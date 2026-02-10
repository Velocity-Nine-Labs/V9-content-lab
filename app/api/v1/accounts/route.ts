import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/libs/next-auth";
import { withApiAuth, apiError, apiSuccess } from "@/libs/apiAuth";
import connectMongo from "@/libs/mongoose";
import ConnectedAccount from "@/models/ConnectedAccount";
import { encrypt } from "@/libs/encryption";

// GET /api/v1/accounts - List connected accounts
export async function GET(request: NextRequest) {
  try {
    // Check for API key auth first
    const authHeader = request.headers.get("Authorization");
    
    let userId: string;
    
    if (authHeader?.startsWith("Bearer v9cf_")) {
      // API key auth
      const authResult = await import("@/libs/apiAuth").then(m => m.authenticateApiRequest(request));
      if (!authResult.success) {
        return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
      }
      userId = authResult.userId!;
    } else {
      // Session auth
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      userId = session.user.id;
    }

    await connectMongo();

    const accounts = await (ConnectedAccount as any).find({ userId })
      .select("-encryptedTokens -encryption")
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json({
      success: true,
      data: accounts.map((account: any) => ({
        id: account._id,
        platform: account.platform,
        platformUsername: account.platformUsername,
        profilePicture: account.profilePicture,
        status: account.status,
        lastUsedAt: account.lastUsedAt,
        createdAt: account.createdAt,
      })),
    });
  } catch (error) {
    console.error("List accounts error:", error);
    return NextResponse.json({ success: false, error: "Failed to list accounts" }, { status: 500 });
  }
}

// POST /api/v1/accounts - Connect a new account (manual token entry for API users)
export const POST = withApiAuth(async (request, { userId }) => {
  try {
    const body = await request.json();
    const { platform, credentials, profileInfo } = body;

    if (!platform || !credentials) {
      return apiError("Missing required fields: platform, credentials");
    }

    await connectMongo();

    // Check if account already connected
    const existing = await (ConnectedAccount as any).findOne({
      userId,
      platform,
      platformAccountId: profileInfo?.accountId || credentials.accountId,
    });

    if (existing) {
      return apiError("This account is already connected", 400);
    }

    // Encrypt the credentials
    const encryptedData = encrypt(JSON.stringify(credentials));

    const account = await (ConnectedAccount as any).create({
      userId,
      platform,
      platformAccountId: profileInfo?.accountId || credentials.accountId || `${platform}_${Date.now()}`,
      platformUsername: profileInfo?.username || credentials.username || "Unknown",
      profilePicture: profileInfo?.profilePicture,
      encryptedTokens: {
        accessToken: encryptedData.encrypted,
        refreshToken: credentials.refreshToken ? encrypt(credentials.refreshToken).encrypted : undefined,
        expiresAt: credentials.expiresAt ? new Date(credentials.expiresAt) : undefined,
      },
      encryption: {
        iv: encryptedData.iv,
        authTag: encryptedData.authTag,
      },
      status: "active",
    });

    return apiSuccess({
      id: account._id,
      platform: account.platform,
      platformUsername: account.platformUsername,
      status: account.status,
      message: "Account connected successfully",
    });

  } catch (error) {
    console.error("Connect account error:", error);
    return apiError("Failed to connect account", 500);
  }
}, "accounts:write");

// DELETE /api/v1/accounts - Disconnect an account
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    
    let userId: string;
    
    if (authHeader?.startsWith("Bearer v9cf_")) {
      const authResult = await import("@/libs/apiAuth").then(m => m.authenticateApiRequest(request));
      if (!authResult.success) {
        return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
      }
      userId = authResult.userId!;
    } else {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      userId = session.user.id;
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("id");

    if (!accountId) {
      return NextResponse.json({ success: false, error: "Account ID required" }, { status: 400 });
    }

    await connectMongo();

    const result = await (ConnectedAccount as any).findOneAndDelete({
      _id: accountId,
      userId,
    });

    if (!result) {
      return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Account disconnected successfully",
    });
  } catch (error) {
    console.error("Disconnect account error:", error);
    return NextResponse.json({ success: false, error: "Failed to disconnect account" }, { status: 500 });
  }
}
