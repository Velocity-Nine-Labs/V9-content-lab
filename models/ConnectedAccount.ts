import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// Platform types
export type PlatformType = 
  | "twitter" 
  | "instagram" 
  | "facebook" 
  | "linkedin" 
  | "tiktok" 
  | "youtube" 
  | "threads";

const connectedAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platform: {
      type: String,
      enum: ["twitter", "instagram", "facebook", "linkedin", "tiktok", "youtube", "threads"],
      required: true,
    },
    // Platform-specific account ID
    platformAccountId: {
      type: String,
      required: true,
    },
    // Display name/username on the platform
    platformUsername: {
      type: String,
      required: true,
    },
    // Profile picture URL
    profilePicture: {
      type: String,
    },
    // Encrypted OAuth tokens (using AES-256-GCM)
    encryptedTokens: {
      accessToken: { type: String, required: true },
      refreshToken: { type: String },
      tokenType: { type: String, default: "Bearer" },
      expiresAt: { type: Date },
      // Additional platform-specific data
      extra: { type: mongoose.Schema.Types.Mixed },
    },
    // Token encryption metadata
    encryption: {
      iv: { type: String, required: true },
      authTag: { type: String, required: true },
    },
    // Account status
    status: {
      type: String,
      enum: ["active", "expired", "revoked", "error"],
      default: "active",
    },
    // Last successful API call
    lastUsedAt: {
      type: Date,
    },
    // Error tracking
    lastError: {
      message: { type: String },
      code: { type: String },
      occurredAt: { type: Date },
    },
    // Platform-specific settings
    settings: {
      autoPost: { type: Boolean, default: true },
      defaultHashtags: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Indexes
connectedAccountSchema.index({ userId: 1, platform: 1 });
connectedAccountSchema.index({ userId: 1, platformAccountId: 1 }, { unique: true });
connectedAccountSchema.index({ status: 1 });

connectedAccountSchema.plugin(toJSON);

export default mongoose.models.ConnectedAccount || 
  mongoose.model("ConnectedAccount", connectedAccountSchema);
