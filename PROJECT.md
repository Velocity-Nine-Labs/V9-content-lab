# V9 Content Lab — Project Documentation

> **AI-powered content creation and publishing platform**  
> One API key to create images, videos, and posts — then publish everywhere.

**Version:** 1.0  
**Last Updated:** 2026-02-11  
**Owner:** Velocity Nine Labs  

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem & Solution](#problem--solution)
3. [Target Users](#target-users)
4. [Core Features](#core-features)
5. [Architecture Overview](#architecture-overview)
6. [Tech Stack](#tech-stack)
7. [Database Schema](#database-schema)
8. [API Design](#api-design)
9. [Authentication & Security](#authentication--security)
10. [AI Integration](#ai-integration)
11. [Social Platform Integration](#social-platform-integration)
12. [Dashboard Features](#dashboard-features)
13. [Pricing & Plans](#pricing--plans)
14. [Development Workflow](#development-workflow)
15. [Environment Setup](#environment-setup)
16. [Deployment](#deployment)
17. [Roadmap](#roadmap)
18. [Team Responsibilities](#team-responsibilities)

---

## Executive Summary

**V9 Content Lab** is a SaaS platform that enables creators, marketers, and agencies to:

1. **Generate content** using AI (text, images, videos, voiceovers)
2. **Store and organize** content in a library
3. **Publish content** to multiple social platforms simultaneously
4. **Schedule posts** for optimal timing
5. **Track performance** with unified analytics
6. **Access everything via API** for automation and integration

The platform serves both as a **dashboard application** (web UI) and an **API-first service** (programmatic access via API keys).

### Key Differentiators

- **Unified API**: One API key to generate content AND publish to all platforms
- **AI-Native**: Built around AI generation, not bolted on
- **Multi-Platform Publishing**: X, Instagram, Facebook, LinkedIn, TikTok, YouTube
- **Secure Token Storage**: Enterprise-grade encryption for social credentials
- **Developer-Friendly**: OpenAPI spec, webhooks, SDKs

---

## Problem & Solution

### The Problem

Content creators and marketers face these challenges:

1. **Fragmented Tools**: Different tools for AI generation, scheduling, analytics
2. **Manual Publishing**: Copy-pasting content across multiple platforms
3. **Inconsistent Quality**: Hard to maintain content quality at scale
4. **No API Access**: Most tools are UI-only, can't automate
5. **Security Concerns**: Storing social media credentials safely

### Our Solution

V9 Content Lab provides:

| Problem | Solution |
|---------|----------|
| Fragmented tools | All-in-one platform: generate, store, publish, analyze |
| Manual publishing | One-click multi-platform publishing |
| Inconsistent quality | AI generation with customizable templates and tones |
| No API access | Full REST API with API keys |
| Security concerns | AES-256-GCM encrypted token storage |

---

## Target Users

### Primary Personas

1. **Solo Creators**
   - Influencers, YouTubers, content creators
   - Need: Easy content generation and scheduling
   - Plan: Creator ($29/mo)

2. **Marketing Teams**
   - In-house marketing departments
   - Need: Collaboration, brand consistency, analytics
   - Plan: Agency ($99/mo)

3. **Agencies**
   - Managing multiple client accounts
   - Need: White-label, team workspaces, API access
   - Plan: Enterprise (custom)

4. **Developers**
   - Building content automation workflows
   - Need: API access, webhooks, documentation
   - Plan: Creator+ or Agency

### Use Cases

- Automated content pipelines (AI agent posting)
- Batch content generation for campaigns
- Cross-platform content syndication
- Scheduled content calendars
- Performance tracking dashboards

---

## Core Features

### 1. AI Content Generation

| Content Type | AI Provider | Capabilities |
|--------------|-------------|--------------|
| Text | OpenAI GPT-4 / Anthropic Claude | Captions, posts, threads, articles |
| Images | OpenAI DALL-E 3 | Marketing graphics, social posts |
| Videos | Kling AI / Runway | Short-form video, reels |
| Voice | ElevenLabs / OpenAI TTS | Voiceovers, narration |

**Features:**
- Template library (tweet, thread, LinkedIn post, etc.)
- Tone selection (professional, casual, funny, etc.)
- Auto-hashtag generation
- Auto-emoji enhancement
- Content variations (generate multiple options)

### 2. Content Library

- Store all generated content
- Organize with folders/tags
- Search and filter
- Version history
- Duplicate and edit
- Export functionality

### 3. Multi-Platform Publishing

**Supported Platforms:**
- X (Twitter)
- Instagram (Feed, Stories, Reels)
- Facebook (Pages, Groups)
- LinkedIn (Posts, Articles)
- TikTok
- YouTube (Shorts, Videos)

**Publishing Features:**
- Single-click multi-platform posting
- Platform-specific formatting
- Media optimization per platform
- Character limit validation
- Preview before posting

### 4. Scheduling

- Calendar view (day, week, month)
- Optimal time suggestions
- Time zone support
- Recurring posts
- Queue management
- Draft → Scheduled → Published workflow

### 5. Analytics

- Unified dashboard across platforms
- Impressions, engagement, clicks
- Follower growth tracking
- Top performing content
- Platform comparison
- Export reports

### 6. API Access

- RESTful API
- API key authentication
- Rate limiting by plan
- Webhooks for events
- OpenAPI specification
- SDKs (Node.js, Python)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  Web Dashboard (Next.js)  │  API Clients  │  Mobile (Future)    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  Next.js API Routes (/api/v1/*)                                  │
│  ├── /keys      — API key management                            │
│  ├── /accounts  — Social account connections                    │
│  ├── /content   — Content CRUD                                  │
│  ├── /generate  — AI content generation                         │
│  └── /publish   — Publishing & scheduling                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  Auth Service    │  AI Service     │  Publishing Service        │
│  (NextAuth)      │  (OpenAI, etc)  │  (Platform SDKs)           │
├──────────────────┼─────────────────┼────────────────────────────┤
│  Encryption      │  Queue Service  │  Analytics Service         │
│  Service         │  (Bull/Redis)   │  (Aggregation)             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB (Primary)        │  Redis (Cache/Queue)                │
│  ├── Users                │  ├── Session cache                  │
│  ├── ApiKeys              │  ├── Rate limiting                  │
│  ├── ConnectedAccounts    │  └── Job queue                      │
│  ├── Content              │                                      │
│  └── Posts                │  S3 (Media Storage)                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│  AI Providers          │  Social Platforms      │  Other        │
│  ├── OpenAI            │  ├── Twitter/X API    │  ├── Stripe   │
│  ├── Anthropic         │  ├── Meta Graph API   │  ├── Resend   │
│  ├── Kling AI          │  ├── LinkedIn API     │  └── Vercel   │
│  └── ElevenLabs        │  ├── TikTok API       │               │
│                        │  └── YouTube API      │               │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow Example

```
User Request: "Generate a tweet about AI and publish to X"

1. [Dashboard] User fills form, clicks "Generate & Publish"
2. [API] POST /api/v1/generate { type: "text", prompt: "..." }
3. [AI Service] Call OpenAI GPT-4 API
4. [API] Return generated content
5. [Dashboard] User reviews, clicks "Publish"
6. [API] POST /api/v1/publish { text: "...", platforms: ["twitter"] }
7. [Auth] Validate user session and API permissions
8. [Encryption] Decrypt stored Twitter access token
9. [Publishing Service] Call Twitter API v2
10. [Database] Save Post record with status
11. [API] Return success with post IDs
12. [Webhook] Fire "post.published" event
```

---

## Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework with App Router | 15.x |
| React | UI library | 19.x |
| TypeScript | Type safety | 5.x |
| TailwindCSS | Utility-first CSS | 4.x |
| DaisyUI | Component library | 5.x |
| Lucide React | Icons | Latest |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js API Routes | REST API | 15.x |
| NextAuth.js | Authentication | 5.x (beta) |
| Mongoose | MongoDB ODM | 8.x |
| Stripe | Payments | Latest |
| Resend | Transactional email | Latest |

### Database & Storage

| Technology | Purpose |
|------------|---------|
| MongoDB | Primary database |
| Redis | Caching, rate limiting, job queue |
| AWS S3 | Media file storage |

### External APIs

| Service | Purpose |
|---------|---------|
| OpenAI | GPT-4, DALL-E 3, TTS |
| Anthropic | Claude for text generation |
| Kling AI | Video generation |
| ElevenLabs | Voice generation |
| Twitter API v2 | X publishing |
| Meta Graph API | Instagram, Facebook |
| LinkedIn API | LinkedIn publishing |
| TikTok API | TikTok publishing |
| YouTube Data API | YouTube publishing |

### Infrastructure

| Service | Purpose |
|---------|---------|
| Vercel | Hosting, edge functions |
| MongoDB Atlas | Managed MongoDB |
| Upstash | Managed Redis |
| AWS S3 | Media storage |
| Stripe | Payment processing |

---

## Database Schema

### Users Collection

```typescript
interface User {
  _id: ObjectId;
  email: string;
  name: string;
  image?: string;
  emailVerified?: Date;
  
  // Subscription
  plan: 'free' | 'creator' | 'agency' | 'enterprise';
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  
  // Usage tracking
  usage: {
    textGenerations: number;
    imageGenerations: number;
    videoGenerations: number;
    postsPublished: number;
    periodStart: Date;
    periodEnd: Date;
  };
  
  // Preferences
  preferences: {
    defaultTone: string;
    defaultModel: string;
    autoHashtags: boolean;
    autoEmojis: boolean;
    timezone: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}
```

### ApiKeys Collection

```typescript
interface ApiKey {
  _id: ObjectId;
  userId: ObjectId;
  name: string;
  keyHash: string;           // SHA-256 hash of the key
  keyPreview: string;        // First 8 chars for display
  scopes: string[];          // ['generate', 'publish', 'read']
  
  isActive: boolean;
  expiresAt?: Date;
  
  usage: {
    totalRequests: number;
    lastUsedAt?: Date;
  };
  
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}
```

### ConnectedAccounts Collection

```typescript
interface ConnectedAccount {
  _id: ObjectId;
  userId: ObjectId;
  platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube';
  
  // Profile info
  platformUserId: string;
  username: string;
  displayName: string;
  profileUrl: string;
  profileImage?: string;
  
  // Encrypted tokens
  accessToken: string;       // AES-256-GCM encrypted
  refreshToken?: string;     // AES-256-GCM encrypted
  tokenExpiresAt?: Date;
  
  // Permissions
  scopes: string[];
  
  isActive: boolean;
  lastUsedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### Content Collection

```typescript
interface Content {
  _id: ObjectId;
  userId: ObjectId;
  
  type: 'text' | 'image' | 'video' | 'voice';
  title: string;
  
  // Content data
  text?: string;
  mediaUrl?: string;
  mediaType?: string;
  duration?: number;         // For video/audio
  
  // Generation metadata
  generation: {
    prompt: string;
    model: string;
    provider: string;
    options: Record<string, any>;
    generatedAt: Date;
  };
  
  // Organization
  tags: string[];
  folder?: string;
  
  // Status
  status: 'draft' | 'ready' | 'archived';
  
  createdAt: Date;
  updatedAt: Date;
}
```

### Posts Collection

```typescript
interface Post {
  _id: ObjectId;
  userId: ObjectId;
  contentId?: ObjectId;      // Reference to Content
  
  // Post content
  text: string;
  mediaUrls: string[];
  
  // Platform targets
  platforms: {
    platform: string;
    accountId: ObjectId;
    status: 'pending' | 'published' | 'failed' | 'scheduled';
    platformPostId?: string;
    publishedAt?: Date;
    error?: string;
    metrics?: {
      impressions: number;
      likes: number;
      comments: number;
      shares: number;
      clicks: number;
    };
  }[];
  
  // Scheduling
  scheduledFor?: Date;
  
  // Metadata
  hashtags: string[];
  mentions: string[];
  
  createdAt: Date;
  updatedAt: Date;
}
```

### Indexes

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ stripeCustomerId: 1 });

// ApiKeys
db.apikeys.createIndex({ userId: 1 });
db.apikeys.createIndex({ keyHash: 1 }, { unique: true });

// ConnectedAccounts
db.connectedaccounts.createIndex({ userId: 1 });
db.connectedaccounts.createIndex({ platform: 1, platformUserId: 1 }, { unique: true });

// Content
db.content.createIndex({ userId: 1 });
db.content.createIndex({ userId: 1, type: 1 });
db.content.createIndex({ userId: 1, tags: 1 });
db.content.createIndex({ userId: 1, createdAt: -1 });

// Posts
db.posts.createIndex({ userId: 1 });
db.posts.createIndex({ userId: 1, scheduledFor: 1 });
db.posts.createIndex({ userId: 1, "platforms.status": 1 });
db.posts.createIndex({ scheduledFor: 1, "platforms.status": 1 });  // For scheduler
```

---

## API Design

### Base URL

```
Production: https://api.contentlab.velocitynine-labs.com/v1
Development: http://localhost:3000/api/v1
```

### Authentication

All API requests require authentication via API key:

```http
Authorization: Bearer v9cf_your_api_key_here
```

Or via header:

```http
X-API-Key: v9cf_your_api_key_here
```

### Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-02-11T05:00:00Z"
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid platform specified",
    "details": { ... }
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2026-02-11T05:00:00Z"
  }
}
```

### Endpoints

#### API Keys

```http
GET    /v1/keys              # List all API keys
POST   /v1/keys              # Create new API key
DELETE /v1/keys?id={id}      # Revoke API key
```

#### Connected Accounts

```http
GET    /v1/accounts          # List connected accounts
POST   /v1/accounts          # Start OAuth flow
DELETE /v1/accounts?id={id}  # Disconnect account
```

#### Content

```http
GET    /v1/content           # List content (paginated)
GET    /v1/content/{id}      # Get single content
POST   /v1/content           # Create content manually
PUT    /v1/content/{id}      # Update content
DELETE /v1/content/{id}      # Delete content
```

#### Generate

```http
POST   /v1/generate          # Generate content
GET    /v1/generate/{id}     # Get generation status (async)
```

**Generate Request:**

```json
{
  "type": "text",
  "prompt": "Write an engaging tweet about AI automation",
  "options": {
    "template": "tweet",
    "tone": "professional",
    "model": "gpt-4",
    "maxLength": 280,
    "variations": 3,
    "hashtags": true,
    "emojis": false
  }
}
```

**Generate Response:**

```json
{
  "success": true,
  "data": {
    "id": "gen_abc123",
    "type": "text",
    "content": "AI automation is transforming how businesses operate...",
    "variations": [
      "AI automation is transforming...",
      "Businesses are discovering...",
      "The future of work..."
    ],
    "model": "gpt-4",
    "usage": {
      "promptTokens": 25,
      "completionTokens": 45,
      "totalTokens": 70
    }
  }
}
```

#### Publish

```http
POST   /v1/publish           # Publish or schedule post
GET    /v1/publish           # List posts (paginated)
GET    /v1/publish/{id}      # Get post status
DELETE /v1/publish/{id}      # Cancel scheduled post
```

**Publish Request:**

```json
{
  "text": "AI is transforming content creation 🚀",
  "platforms": ["twitter", "linkedin"],
  "mediaUrls": ["https://..."],
  "hashtags": ["AI", "ContentCreation"],
  "scheduledFor": "2026-02-12T09:00:00Z"
}
```

**Publish Response:**

```json
{
  "success": true,
  "data": {
    "id": "post_abc123",
    "status": "scheduled",
    "scheduledFor": "2026-02-12T09:00:00Z",
    "platforms": [
      {
        "platform": "twitter",
        "status": "pending",
        "accountId": "acc_123"
      },
      {
        "platform": "linkedin",
        "status": "pending",
        "accountId": "acc_456"
      }
    ]
  }
}
```

### Rate Limits

| Plan | Requests/Minute | Requests/Day |
|------|-----------------|--------------|
| Free | 10 | 100 |
| Creator | 60 | 1,000 |
| Agency | 120 | 10,000 |
| Enterprise | Custom | Custom |

Rate limit headers:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1707620000
```

### Webhooks

Webhook events are sent to configured URLs:

```json
{
  "event": "post.published",
  "timestamp": "2026-02-11T05:00:00Z",
  "data": {
    "postId": "post_abc123",
    "platform": "twitter",
    "platformPostId": "1234567890",
    "url": "https://twitter.com/user/status/1234567890"
  }
}
```

**Available Events:**
- `post.published`
- `post.failed`
- `post.scheduled`
- `generation.completed`
- `account.connected`
- `account.disconnected`

---

## Authentication & Security

### User Authentication

1. **OAuth Providers** (via NextAuth):
   - Google OAuth
   - GitHub OAuth (optional)
   
2. **Magic Link** (passwordless email)

### API Authentication

1. **API Keys**:
   - Prefixed with `v9cf_` for identification
   - SHA-256 hashed before storage
   - Never stored in plain text
   - Scoped permissions (generate, publish, read)

2. **Rate Limiting**:
   - Per-key limits
   - Sliding window algorithm
   - Redis-backed for distribution

### Token Encryption

Social media access tokens are encrypted using:

```typescript
// Algorithm: AES-256-GCM
// Key derivation: PBKDF2 with per-user salt
// IV: Unique per encryption

interface EncryptedToken {
  ciphertext: string;    // Base64 encoded
  iv: string;            // Base64 encoded
  authTag: string;       // Base64 encoded
  version: number;       // For key rotation
}
```

**Encryption Flow:**

```
1. Generate random IV (12 bytes)
2. Derive key from master secret + user salt
3. Encrypt token with AES-256-GCM
4. Store: { ciphertext, iv, authTag }
5. On retrieval: decrypt with same key
```

### Security Best Practices

- HTTPS only in production
- CORS restricted to known domains
- Input validation on all endpoints
- SQL/NoSQL injection prevention
- XSS protection via React
- CSRF tokens for mutations
- Webhook signature verification
- Audit logging for sensitive actions

---

## AI Integration

### Provider Configuration

```typescript
// config.ts
const aiProviders = {
  text: {
    primary: 'openai',        // gpt-4
    fallback: 'anthropic',    // claude-3
  },
  image: {
    primary: 'openai',        // dall-e-3
  },
  video: {
    primary: 'kling',         // kling-ai
  },
  voice: {
    primary: 'elevenlabs',
    fallback: 'openai',       // openai-tts
  },
};
```

### Text Generation

```typescript
async function generateText(params: {
  prompt: string;
  template: string;
  tone: string;
  maxLength: number;
}) {
  const systemPrompt = buildSystemPrompt(params.template, params.tone);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: params.prompt },
    ],
    max_tokens: params.maxLength * 2, // Buffer for tokens
    temperature: 0.7,
  });
  
  return response.choices[0].message.content;
}
```

### Template System

```typescript
const templates = {
  tweet: {
    maxLength: 280,
    systemPrompt: 'Write a concise, engaging tweet. Use 1-2 emojis naturally. Keep under 280 characters.',
  },
  thread: {
    maxLength: 2000,
    systemPrompt: 'Write a Twitter thread (3-7 tweets). Start with a hook. Number each tweet. End with a CTA.',
  },
  linkedin: {
    maxLength: 3000,
    systemPrompt: 'Write a professional LinkedIn post. Use line breaks for readability. Include a question or CTA at the end.',
  },
  instagram: {
    maxLength: 2200,
    systemPrompt: 'Write an Instagram caption. Be personable and authentic. Use relevant emojis. Include hashtag suggestions at the end.',
  },
};
```

### Tone Modifiers

```typescript
const tones = {
  professional: 'Use formal, business-appropriate language. Be authoritative but approachable.',
  casual: 'Use conversational, friendly language. Contractions are fine. Be relatable.',
  funny: 'Use humor and wit. Include wordplay if appropriate. Keep it light.',
  inspirational: 'Use motivational language. Include actionable advice. Be uplifting.',
  educational: 'Explain clearly. Use examples. Break down complex concepts.',
};
```

---

## Social Platform Integration

### OAuth Flow

```
1. User clicks "Connect [Platform]"
2. Redirect to platform OAuth authorization
3. User grants permissions
4. Platform redirects back with auth code
5. Exchange code for access/refresh tokens
6. Encrypt and store tokens
7. Fetch user profile info
8. Create ConnectedAccount record
```

### Platform SDKs

| Platform | SDK/Library | Auth Type |
|----------|-------------|-----------|
| Twitter/X | twitter-api-v2 | OAuth 2.0 PKCE |
| Instagram | Meta Graph API | OAuth 2.0 |
| Facebook | Meta Graph API | OAuth 2.0 |
| LinkedIn | linkedin-api-client | OAuth 2.0 |
| TikTok | Official SDK | OAuth 2.0 |
| YouTube | googleapis | OAuth 2.0 |

### Publishing Logic

```typescript
async function publishToTwitter(post: Post, account: ConnectedAccount) {
  // 1. Decrypt access token
  const accessToken = await decrypt(account.accessToken);
  
  // 2. Initialize client
  const client = new TwitterApi(accessToken);
  
  // 3. Upload media if present
  let mediaIds: string[] = [];
  if (post.mediaUrls.length > 0) {
    for (const url of post.mediaUrls) {
      const mediaId = await client.v1.uploadMedia(url);
      mediaIds.push(mediaId);
    }
  }
  
  // 4. Post tweet
  const result = await client.v2.tweet({
    text: post.text,
    media: mediaIds.length > 0 ? { media_ids: mediaIds } : undefined,
  });
  
  // 5. Return platform post ID
  return {
    platformPostId: result.data.id,
    url: `https://twitter.com/i/status/${result.data.id}`,
  };
}
```

### Token Refresh

```typescript
async function refreshTokenIfNeeded(account: ConnectedAccount) {
  if (!account.tokenExpiresAt) return account;
  
  const expiresIn = account.tokenExpiresAt.getTime() - Date.now();
  const refreshThreshold = 5 * 60 * 1000; // 5 minutes
  
  if (expiresIn > refreshThreshold) return account;
  
  // Refresh token based on platform
  const newTokens = await refreshPlatformToken(
    account.platform,
    account.refreshToken
  );
  
  // Update stored tokens
  await ConnectedAccount.findByIdAndUpdate(account._id, {
    accessToken: await encrypt(newTokens.accessToken),
    refreshToken: newTokens.refreshToken 
      ? await encrypt(newTokens.refreshToken) 
      : account.refreshToken,
    tokenExpiresAt: newTokens.expiresAt,
  });
  
  return { ...account, accessToken: newTokens.accessToken };
}
```

---

## Dashboard Features

### Page Structure

```
/dashboard
├── / ...................... Overview (stats, activity, usage)
├── /create ................ AI content generation
├── /content ............... Content library
├── /publish ............... Multi-platform publishing
├── /schedule .............. Calendar view
├── /accounts .............. Connected accounts
├── /analytics ............. Performance metrics
├── /api-keys .............. API key management
└── /settings .............. Account settings
```

### Dashboard Overview

- Quick stats (content created, posts published, accounts, API usage)
- Quick actions grid
- Recent activity feed
- API quick start guide
- Usage overview with progress bars

### Create Page

- Content type selection (text, image, video, voice)
- Template selection for text
- Tone selection
- Prompt input
- Generation preview
- Save to library / Publish directly

### Content Library

- Grid/List view toggle
- Search functionality
- Filter by type, status, date
- Bulk actions
- Edit, duplicate, delete
- Quick publish action

### Publish Page

- Content input (text + media)
- Platform selection checkboxes
- Character limit warnings
- Schedule or publish now
- Preview panel

### Schedule Page

- Week view calendar
- Scheduled posts on calendar
- Upcoming posts list
- Drag to reschedule
- Quick edit/delete

### Analytics Page

- Date range selector
- Platform filter
- Impressions, engagement, clicks, followers
- Chart visualizations
- Platform breakdown
- Top performing posts table

### Accounts Page

- Connected accounts list
- Platform cards with connect buttons
- OAuth flow integration
- Disconnect functionality
- Token status indicators

### API Keys Page

- Keys list with usage stats
- Create new key modal
- Key reveal (one-time)
- Revoke keys
- Copy to clipboard

### Settings Page

Tabs:
- **Account**: Name, email, timezone
- **Notifications**: Email/push preferences
- **AI Settings**: Default tone, model, auto-features
- **Security**: Password, 2FA, sessions
- **Billing**: Plan, usage, upgrade

---

## Pricing & Plans

### Plan Features

| Feature | Free | Creator ($29) | Agency ($99) | Enterprise |
|---------|------|---------------|--------------|------------|
| Posts/month | 10 | 100 | Unlimited | Unlimited |
| Platforms | 2 | 5 | All | All |
| Text generations | 20 | 200 | 1,000 | Unlimited |
| Image generations | 5 | 50 | 200 | Unlimited |
| Video generations | 0 | 10 | 50 | Unlimited |
| API access | ❌ | ✅ | ✅ | ✅ |
| Team members | 1 | 1 | 5 | Unlimited |
| Analytics | Basic | Full | Full | Custom |
| Support | Community | Email | Priority | Dedicated |
| White-label | ❌ | ❌ | ❌ | ✅ |

### Stripe Integration

```typescript
const plans = {
  creator: {
    priceId: 'price_creator_monthly',
    name: 'Creator',
    price: 2900, // cents
    interval: 'month',
  },
  agency: {
    priceId: 'price_agency_monthly',
    name: 'Agency',
    price: 9900,
    interval: 'month',
  },
};
```

### Usage Tracking

```typescript
async function trackUsage(userId: string, type: string) {
  await User.findByIdAndUpdate(userId, {
    $inc: { [`usage.${type}`]: 1 },
  });
}

async function checkUsageLimit(userId: string, type: string): Promise<boolean> {
  const user = await User.findById(userId);
  const limits = getPlanLimits(user.plan);
  return user.usage[type] < limits[type];
}
```

---

## Development Workflow

### Git Branching Strategy

```
main (production)
├── develop (staging)
│   ├── feature/add-tiktok-integration
│   ├── feature/video-generation
│   ├── fix/token-refresh-bug
│   └── chore/update-dependencies
```

### Commit Convention

```
feat: Add TikTok publishing integration
fix: Resolve token refresh race condition
docs: Update API documentation
chore: Upgrade to Next.js 15.1
refactor: Simplify encryption service
test: Add unit tests for publishing
```

### Pull Request Process

1. Create feature branch from `develop`
2. Implement feature with tests
3. Open PR with description template
4. Automated tests must pass
5. Code review required
6. Squash and merge to `develop`
7. Deploy to staging for QA
8. Merge `develop` to `main` for production

### Code Review Checklist

- [ ] TypeScript types are correct
- [ ] Error handling is comprehensive
- [ ] Security considerations addressed
- [ ] Database queries are efficient
- [ ] API responses follow format
- [ ] Tests cover new functionality
- [ ] Documentation updated

---

## Environment Setup

### Prerequisites

- Node.js 20+
- npm 10+
- MongoDB (local or Atlas)
- Redis (local or Upstash)

### Environment Variables

```bash
# .env.local

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/v9contentlab
REDIS_URL=redis://localhost:6379

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Encryption
ENCRYPTION_SECRET=32-byte-hex-string

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# AI Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
ELEVENLABS_API_KEY=...
KLING_API_KEY=...

# Social Platforms
TWITTER_CLIENT_ID=...
TWITTER_CLIENT_SECRET=...
META_APP_ID=...
META_APP_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...

# Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=v9-content-lab

# Email
RESEND_API_KEY=re_...
```

### Installation

```bash
# Clone repository
git clone https://github.com/Velocity-Nine-Labs/V9-content-factory.git
cd V9-content-factory

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables in Vercel

Set all environment variables in Vercel Dashboard → Project → Settings → Environment Variables.

### MongoDB Atlas Setup

1. Create cluster (M10+ for production)
2. Create database user
3. Whitelist Vercel IPs (or allow all: 0.0.0.0/0)
4. Get connection string
5. Set `MONGODB_URI` in Vercel

### Redis (Upstash) Setup

1. Create Upstash Redis database
2. Get connection URL
3. Set `REDIS_URL` in Vercel

### Stripe Webhook Setup

1. In Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhook/stripe`
3. Select events: `checkout.session.completed`, `customer.subscription.*`
4. Get webhook secret
5. Set `STRIPE_WEBHOOK_SECRET` in Vercel

---

## Roadmap

### Phase 1: MVP (Current)
- [x] User authentication
- [x] Dashboard layout
- [x] API key management
- [x] Text generation (OpenAI)
- [x] Basic publishing (X, LinkedIn)
- [x] Content library
- [x] Scheduling

### Phase 2: Platform Expansion
- [ ] Instagram publishing
- [ ] Facebook publishing
- [ ] TikTok publishing
- [ ] YouTube Shorts publishing
- [ ] Image generation (DALL-E 3)
- [ ] Unified analytics

### Phase 3: Advanced Features
- [ ] Video generation (Kling AI)
- [ ] Voice generation (ElevenLabs)
- [ ] Team workspaces
- [ ] Content approval workflows
- [ ] A/B testing
- [ ] AI-powered optimal timing

### Phase 4: Enterprise
- [ ] White-label option
- [ ] SSO/SAML
- [ ] Advanced analytics
- [ ] Custom integrations
- [ ] Dedicated support
- [ ] SLA guarantees

---

## Team Responsibilities

### Backend Engineer

**Focus Areas:**
- API development (`/app/api/v1/*`)
- Database schema and queries
- Authentication and security
- AI provider integrations
- Social platform integrations
- Background jobs and queues

**Key Files:**
- `/app/api/v1/*` — API routes
- `/libs/*` — Utility libraries
- `/models/*` — Database schemas

### Frontend Engineer

**Focus Areas:**
- Dashboard UI development
- Component library
- State management
- Form handling
- Responsive design
- User experience

**Key Files:**
- `/app/dashboard/*` — Dashboard pages
- `/components/*` — UI components
- `/components/dashboard/*` — Dashboard-specific components

### DevOps / Infrastructure

**Focus Areas:**
- CI/CD pipelines
- Environment management
- Database administration
- Monitoring and logging
- Security audits
- Performance optimization

**Key Files:**
- `/vercel.json` — Deployment config
- `/.env.example` — Environment template
- `/next.config.js` — Next.js config

### QA Engineer

**Focus Areas:**
- Test strategy
- Automated testing
- Manual testing
- Bug reporting
- Performance testing
- Security testing

**Key Files:**
- `/tests/*` — Test files
- `/cypress/*` — E2E tests (if used)

---

## Appendix

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript check

# Database
npm run db:seed          # Seed database
npm run db:migrate       # Run migrations

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Helpful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Mongoose Documentation](https://mongoosejs.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Twitter API v2 Reference](https://developer.twitter.com/en/docs/twitter-api)
- [Meta Graph API Reference](https://developers.facebook.com/docs/graph-api)

---

**Questions?** Contact the team at eng@velocitynine-labs.com

---

*Document Version: 1.0*  
*Last Updated: 2026-02-11*  
*Maintained by: V9 Engineering Team*
