# V9 Content Lab 🏭

> AI-powered content creation and publishing platform. One API key to create images, videos, and posts — then publish everywhere.

**A Velocity Nine Labs Product**

## Features

### Content Creation
- 📝 **AI Text Generation** — Generate captions, posts, threads with GPT-4/Claude
- 🖼️ **AI Image Generation** — Create images with DALL-E 3
- 🎬 **AI Video/Reel Generation** — Create short-form video with Kling AI
- 🎙️ **AI Voiceover** — Generate voiceovers with ElevenLabs/OpenAI TTS

### Publishing
- 📱 **Multi-Platform Publishing** — Post to X, Instagram, Facebook, LinkedIn, TikTok, YouTube
- 📅 **Scheduling** — Schedule posts for optimal times
- 🔄 **Cross-Posting** — Publish the same content across multiple platforms
- 📊 **Analytics** — Track performance across all platforms

### API-First
- 🔑 **API Keys** — Generate API keys for programmatic access
- 🔒 **Secure Token Storage** — Encrypted storage for your social media credentials
- 📚 **OpenAPI Spec** — Full API documentation
- ⚡ **Webhooks** — Get notified when content is published

## Quick Start

```bash
# Clone and install
git clone https://github.com/velocitynine-labs/v9-content-lab
cd v9-content-lab
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

## API Usage

### Generate Content

```bash
curl -X POST https://api.contentlab.velocitynine-labs.com/v1/generate \
  -H "Authorization: Bearer v9cf_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "text",
    "prompt": "Write an engaging tweet about AI automation"
  }'
```

### Publish Content

```bash
curl -X POST https://api.contentlab.velocitynine-labs.com/v1/publish \
  -H "Authorization: Bearer v9cf_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "twitter",
    "text": "AI is changing how we create content 🚀",
    "hashtags": ["AI", "ContentCreation", "Automation"]
  }'
```

### List Connected Accounts

```bash
curl https://api.contentlab.velocitynine-labs.com/v1/accounts \
  -H "Authorization: Bearer v9cf_your_api_key"
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/keys` | GET, POST, DELETE | Manage API keys |
| `/v1/accounts` | GET, POST, DELETE | Manage connected social accounts |
| `/v1/content` | GET, POST, PUT, DELETE | CRUD for content items |
| `/v1/generate` | POST, GET | Generate content with AI |
| `/v1/publish` | POST, GET | Publish/schedule content |

## Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Auth:** NextAuth.js v5
- **Payments:** Stripe
- **Styling:** TailwindCSS + DaisyUI
- **AI:** OpenAI, Anthropic, Kling AI, ElevenLabs

## Project Structure

```
├── app/
│   ├── api/v1/          # Public API routes
│   │   ├── keys/        # API key management
│   │   ├── accounts/    # Connected accounts
│   │   ├── content/     # Content CRUD
│   │   ├── generate/    # AI generation
│   │   └── publish/     # Publishing
│   └── dashboard/       # Dashboard UI
├── components/          # React components
├── libs/               # Utilities
│   ├── encryption.ts   # Token encryption
│   ├── apiAuth.ts      # API authentication
│   └── mongoose.ts     # Database connection
├── models/             # MongoDB models
│   ├── ApiKey.ts
│   ├── ConnectedAccount.ts
│   ├── Content.ts
│   └── Post.ts
└── config.ts           # App configuration
```

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | $0/mo | 10 posts/mo, 2 platforms, Dashboard only |
| Creator | $29/mo | 100 posts/mo, 5 platforms, Full API access |
| Agency | $99/mo | Unlimited, All platforms, Team workspaces |
| Enterprise | Custom | White-label, Dedicated support, SLA |

## Security

- All social media tokens are encrypted at rest using AES-256-GCM
- API keys are hashed and never stored in plain text
- OAuth 2.0 for all social platform connections
- Rate limiting on all API endpoints

## License

Proprietary - Velocity Nine Labs © 2026

---

Built with ❤️ by [Velocity Nine Labs](https://velocitynine-labs.com)
