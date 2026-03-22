# Content Repurpose API

The API that transforms any content into platform-ready posts for Twitter, LinkedIn, Reddit, email newsletters, and Instagram. One API call, every platform.

## Quick Start

1. Copy `.env.example` to `.env.local` and fill in your keys
2. Run the SQL files in Supabase SQL Editor (`supabase/schema.sql` then `supabase/increment_usage.sql`)
3. Install and run:

```bash
npm install
npm run dev
```

4. Sign up for an API key:

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'
```

5. Make your first repurpose request:

```bash
curl -X POST http://localhost:3000/api/v1/repurpose \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_KEY" \
  -d '{
    "content": "Your blog post text here...",
    "platforms": ["twitter", "linkedin", "reddit"],
    "tone": "professional"
  }'
```

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Supabase** (Database + Auth)
- **OpenAI** (GPT-4o-mini for content generation)
- **Stripe** (Usage-based billing)
- **Vercel** (Deployment)

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add environment variables from `.env.example`
4. Deploy
