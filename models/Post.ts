import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

export type PostStatus = "draft" | "scheduled" | "publishing" | "published" | "failed";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Reference to the content being posted
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    // Connected account to post from
    connectedAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConnectedAccount",
      required: true,
    },
    // Platform shorthand
    platform: {
      type: String,
      enum: ["twitter", "instagram", "facebook", "linkedin", "tiktok", "youtube", "threads"],
      required: true,
    },
    // Post status
    status: {
      type: String,
      enum: ["draft", "scheduled", "publishing", "published", "failed"],
      default: "draft",
    },
    // Scheduled time (null = post immediately)
    scheduledFor: {
      type: Date,
      default: null,
    },
    // Actual publish time
    publishedAt: {
      type: Date,
    },
    // Platform-specific post ID after publishing
    platformPostId: {
      type: String,
    },
    // Platform-specific post URL
    platformPostUrl: {
      type: String,
    },
    // The actual content posted (snapshot at publish time)
    publishedContent: {
      text: { type: String },
      mediaUrls: { type: [String] },
      hashtags: { type: [String] },
    },
    // Analytics (populated after publishing)
    analytics: {
      impressions: { type: Number, default: 0 },
      reach: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      engagement: { type: Number, default: 0 },
      lastUpdated: { type: Date },
    },
    // Error tracking
    error: {
      message: { type: String },
      code: { type: String },
      occurredAt: { type: Date },
      retryCount: { type: Number, default: 0 },
    },
    // API request tracking (for rate limiting/billing)
    apiRequest: {
      apiKeyId: { type: mongoose.Schema.Types.ObjectId, ref: "ApiKey" },
      requestId: { type: String },
      ip: { type: String },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Indexes
postSchema.index({ userId: 1, status: 1 });
postSchema.index({ userId: 1, platform: 1 });
postSchema.index({ scheduledFor: 1, status: 1 }); // For scheduler queries
postSchema.index({ connectedAccountId: 1 });
postSchema.index({ contentId: 1 });

postSchema.plugin(toJSON);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
