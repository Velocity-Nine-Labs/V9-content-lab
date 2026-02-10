import { NextRequest, NextResponse } from "next/server";
import { hashApiKey } from "./encryption";
import connectMongo from "./mongoose";
import ApiKey from "@/models/ApiKey";
import User from "@/models/User";
// Note: For session auth in API routes, use auth() from @/libs/next-auth

export interface ApiAuthResult {
  success: boolean;
  userId?: string;
  user?: any;
  apiKey?: any;
  error?: string;
  status?: number;
}

/**
 * Authenticate an API request using Bearer token (API key)
 */
export async function authenticateApiRequest(
  request: NextRequest
): Promise<ApiAuthResult> {
  // Get Authorization header
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader) {
    return {
      success: false,
      error: "Missing Authorization header",
      status: 401,
    };
  }
  
  // Parse Bearer token
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return {
      success: false,
      error: "Invalid Authorization header format. Use: Bearer <api_key>",
      status: 401,
    };
  }
  
  const apiKeyValue = parts[1];
  
  // Validate key format
  if (!apiKeyValue.startsWith("v9cf_")) {
    return {
      success: false,
      error: "Invalid API key format",
      status: 401,
    };
  }
  
  try {
    await connectMongo();
    
    // Hash the key and look it up
    const keyHash = hashApiKey(apiKeyValue);
    
    const apiKey = await (ApiKey as any).findOne({ keyHash, isActive: true });
    
    if (!apiKey) {
      return {
        success: false,
        error: "Invalid or inactive API key",
        status: 401,
      };
    }
    
    // Check expiration
    if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
      return {
        success: false,
        error: "API key has expired",
        status: 401,
      };
    }
    
    // Get user
    const user = await (User as any).findById(apiKey.userId);
    
    if (!user) {
      return {
        success: false,
        error: "User not found",
        status: 401,
      };
    }
    
    // Update usage stats
    await (ApiKey as any).findByIdAndUpdate(apiKey._id, {
      $inc: { "usage.totalRequests": 1 },
      $set: { "usage.lastUsedAt": new Date() },
    });
    
    return {
      success: true,
      userId: user._id.toString(),
      user,
      apiKey,
    };
  } catch (error) {
    console.error("API auth error:", error);
    return {
      success: false,
      error: "Authentication failed",
      status: 500,
    };
  }
}

/**
 * Check if user has required scope
 */
export function hasScope(apiKey: any, requiredScope: string): boolean {
  return apiKey.scopes.includes(requiredScope) || apiKey.scopes.includes("*");
}

/**
 * Create an error response
 */
export function apiError(message: string, status: number = 400): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

/**
 * Create a success response
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Wrapper for API route handlers that require authentication
 */
export function withApiAuth(
  handler: (
    request: NextRequest,
    auth: { userId: string; user: any; apiKey: any }
  ) => Promise<NextResponse>,
  requiredScope?: string
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const auth = await authenticateApiRequest(request);
    
    if (!auth.success) {
      return apiError(auth.error!, auth.status);
    }
    
    if (requiredScope && !hasScope(auth.apiKey, requiredScope)) {
      return apiError(`Missing required scope: ${requiredScope}`, 403);
    }
    
    return handler(request, {
      userId: auth.userId!,
      user: auth.user,
      apiKey: auth.apiKey,
    });
  };
}
