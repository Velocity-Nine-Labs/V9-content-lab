// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { withApiAuth, apiError, apiSuccess } from "@/libs/apiAuth";
import connectMongo from "@/libs/mongoose";
import Content from "@/models/Content";
import Post from "@/models/Post";
import ConnectedAccount from "@/models/ConnectedAccount";
import { decrypt } from "@/libs/encryption";

// POST /api/v1/publish - Publish content to a platform
export const POST = withApiAuth(async (request, { userId, apiKey }) => {
  try {
    const body = await request.json();
    const { contentId, platform, accountId, text, mediaUrls, scheduledFor, hashtags } = body;

    if (!platform) {
      return apiError("Missing required field: platform");
    }

    await connectMongo();

    // Get connected account
    let connectedAccount;
    if (accountId) {
      connectedAccount = await (ConnectedAccount as any).findOne({
        _id: accountId,
        userId,
        platform,
        status: "active",
      });
    } else {
      // Find first active account for the platform
      connectedAccount = await (ConnectedAccount as any).findOne({
        userId,
        platform,
        status: "active",
      });
    }

    if (!connectedAccount) {
      return apiError(`No active ${platform} account connected`, 400);
    }

    // Get or create content
    let content;
    if (contentId) {
      content = await Content.findOne({ _id: contentId, userId });
      if (!content) {
        return apiError("Content not found", 404);
      }
    }

    // Create post record
    const post = await (Post as any).create({
      userId,
      contentId: content?._id,
      connectedAccountId: connectedAccount._id,
      platform,
      status: scheduledFor ? "scheduled" : "publishing",
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      publishedContent: {
        text: text || content?.text,
        mediaUrls: mediaUrls || content?.media?.map((m: any) => m.url) || [],
        hashtags: hashtags || [],
      },
      apiRequest: {
        apiKeyId: apiKey._id,
        requestId: `req_${Date.now()}`,
      },
    });

    // If scheduled, return early
    if (scheduledFor) {
      return apiSuccess({
        postId: post._id,
        status: "scheduled",
        scheduledFor: post.scheduledFor,
        platform,
      });
    }

    // Publish immediately
    const result = await publishToPlatform(connectedAccount, post);

    // Update post with result
    if (result.success) {
      post.status = "published";
      post.publishedAt = new Date();
      post.platformPostId = result.platformPostId;
      post.platformPostUrl = result.platformPostUrl;
    } else {
      post.status = "failed";
      post.error = {
        message: result.error,
        occurredAt: new Date(),
      };
    }
    await post.save();

    // Update content status if linked
    if (content) {
      content.status = result.success ? "published" : "failed";
      await content.save();
    }

    return apiSuccess({
      postId: post._id,
      status: post.status,
      platform,
      platformPostId: post.platformPostId,
      platformPostUrl: post.platformPostUrl,
      error: post.error?.message,
    });

  } catch (error) {
    console.error("Publish error:", error);
    return apiError("Failed to publish content", 500);
  }
}, "publish:write");

// Platform-specific publishing logic
async function publishToPlatform(
  account: any,
  post: any
): Promise<{ success: boolean; platformPostId?: string; platformPostUrl?: string; error?: string }> {
  
  // Decrypt tokens
  const tokens = decryptTokens(account);
  
  switch (account.platform) {
    case "twitter":
      return publishToTwitter(tokens, post);
    case "instagram":
      return publishToInstagram(tokens, post);
    case "facebook":
      return publishToFacebook(tokens, post);
    case "linkedin":
      return publishToLinkedIn(tokens, post);
    default:
      return { success: false, error: `Platform ${account.platform} not yet supported` };
  }
}

function decryptTokens(account: any): any {
  try {
    const decrypted = decrypt({
      encrypted: account.encryptedTokens.accessToken,
      iv: account.encryption.iv,
      authTag: account.encryption.authTag,
    });
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Token decryption failed:", error);
    return null;
  }
}

// Twitter/X publishing
async function publishToTwitter(
  tokens: any,
  post: any
): Promise<{ success: boolean; platformPostId?: string; platformPostUrl?: string; error?: string }> {
  try {
    const { accessToken, accessTokenSecret } = tokens;
    
    // Use Twitter API v2
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: formatForPlatform(post.publishedContent.text, "twitter", post.publishedContent.hashtags),
      }),
    });

    const data = await response.json();

    if (data.data?.id) {
      return {
        success: true,
        platformPostId: data.data.id,
        platformPostUrl: `https://twitter.com/i/status/${data.data.id}`,
      };
    }

    return { success: false, error: data.detail || "Twitter API error" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Instagram publishing (via Meta Graph API)
async function publishToInstagram(
  tokens: any,
  post: any
): Promise<{ success: boolean; platformPostId?: string; platformPostUrl?: string; error?: string }> {
  try {
    const { accessToken, instagramAccountId } = tokens;
    
    // For images, need to create media container first
    const mediaUrls = post.publishedContent.mediaUrls;
    
    if (mediaUrls.length === 0) {
      // Text-only not supported on Instagram
      return { success: false, error: "Instagram requires media" };
    }

    // Create media container
    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: mediaUrls[0],
          caption: formatForPlatform(post.publishedContent.text, "instagram", post.publishedContent.hashtags),
          access_token: accessToken,
        }),
      }
    );

    const containerData = await containerResponse.json();

    if (!containerData.id) {
      return { success: false, error: containerData.error?.message || "Failed to create media container" };
    }

    // Publish the container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: accessToken,
        }),
      }
    );

    const publishData = await publishResponse.json();

    if (publishData.id) {
      return {
        success: true,
        platformPostId: publishData.id,
        platformPostUrl: `https://instagram.com/p/${publishData.id}`,
      };
    }

    return { success: false, error: publishData.error?.message || "Failed to publish" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Facebook publishing
async function publishToFacebook(
  tokens: any,
  post: any
): Promise<{ success: boolean; platformPostId?: string; platformPostUrl?: string; error?: string }> {
  try {
    const { accessToken, pageId } = tokens;
    
    const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: formatForPlatform(post.publishedContent.text, "facebook", post.publishedContent.hashtags),
        access_token: accessToken,
      }),
    });

    const data = await response.json();

    if (data.id) {
      return {
        success: true,
        platformPostId: data.id,
        platformPostUrl: `https://facebook.com/${data.id}`,
      };
    }

    return { success: false, error: data.error?.message || "Facebook API error" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// LinkedIn publishing
async function publishToLinkedIn(
  tokens: any,
  post: any
): Promise<{ success: boolean; platformPostId?: string; platformPostUrl?: string; error?: string }> {
  try {
    const { accessToken, personUrn } = tokens;
    
    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: personUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: formatForPlatform(post.publishedContent.text, "linkedin", post.publishedContent.hashtags),
            },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    });

    const data = await response.json();

    if (data.id) {
      return {
        success: true,
        platformPostId: data.id,
        platformPostUrl: `https://linkedin.com/feed/update/${data.id}`,
      };
    }

    return { success: false, error: "LinkedIn API error" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Format text for specific platform
function formatForPlatform(text: string, platform: string, hashtags: string[]): string {
  let formatted = text || "";
  
  // Add hashtags
  if (hashtags && hashtags.length > 0) {
    const hashtagStr = hashtags.map(h => h.startsWith("#") ? h : `#${h}`).join(" ");
    formatted = `${formatted}\n\n${hashtagStr}`;
  }
  
  // Platform-specific limits
  const limits: Record<string, number> = {
    twitter: 280,
    instagram: 2200,
    facebook: 63206,
    linkedin: 3000,
  };
  
  const limit = limits[platform] || 1000;
  if (formatted.length > limit) {
    formatted = formatted.substring(0, limit - 3) + "...";
  }
  
  return formatted;
}

// GET /api/v1/publish - Get post status
export const GET = withApiAuth(async (request, { userId }) => {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  
  if (!postId) {
    // List recent posts
    await connectMongo();
    const posts = await (Post as any).find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("connectedAccountId", "platform platformUsername");
    
    return apiSuccess(posts);
  }
  
  await connectMongo();
  const post = await (Post as any).findOne({ _id: postId, userId })
    .populate("connectedAccountId", "platform platformUsername");
  
  if (!post) {
    return apiError("Post not found", 404);
  }
  
  return apiSuccess(post);
}, "publish:read");
