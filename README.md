# BuildStack
AI tools directory (Next.js). Add tools by appending to data/tools.ts. Config (site URL, Stripe links, contact) in lib/config.ts. Env: NEXT_PUBLIC_SITE_URL, RESEND_API_KEY, RESEND_AUDIENCE_ID.

## AI Madness (coding agent bracket)
- Data/seeding: `data/madness.ts` (signals frozen 2026-10-19). Logic/schedule: `lib/madness.ts`. Pages: `/madness`, `/madness/[a-vs-b]`.
- Votes: `lib/voteStore.ts`. Uses Upstash Redis automatically when `KV_REST_API_URL` + `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL`/`_TOKEN`) are set; otherwise the free no-signup Abacus counter API (namespace `MADNESS_NS`, default `buildstack-fawn-madness-2026`). One vote per matchup per browser (cookie `bs_mm`) + max 3 votes per hashed IP per matchup. Optional `VOTE_SALT`.
- Health: `GET /api/madness/health`. Local testing: `MADNESS_FAKE_NOW=2026-10-27T00:00:00Z npm run dev` (ignored on Vercel).

## Comparisons
- Facts per tool: `data/toolFacts.ts`. Pairs + human analysis: `data/comparisons.ts`. Template: `app/compare/[slug]/page.tsx` (facts table, FAQ schema, related links).
