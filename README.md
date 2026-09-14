# Bookloom

Bookloom is a reader-first social reading workspace built around the idea that books are more than stars. The first vertical is a responsive dashboard for reading progress, private journal traces, personal discovery, and an explainable Reader DNA.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The app is local-first by default. Copy `.env.example` to `.env.local` and leave
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` empty to run
without external credentials.

## Connect Supabase

1. Create a Supabase project and enable the authentication providers you need.
2. Apply `supabase/migrations/0001_core.sql` followed by
	`supabase/migrations/0002_integration_hardening.sql`.
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
	`BOOKLOOM_DATA_BACKEND=supabase` in `.env.local`.
4. Verify `/api/health` reports `supabase: configured`.

The typed clients live in `lib/supabase/`, while
`lib/data/supabase-gateway.ts` owns persistence operations. The local store
remains the fallback until auth and a migration are active. Never expose a
Supabase service-role key in this app; server-only administrative jobs should
use a separate worker.

Checks:

```bash
npm run typecheck
npm run build
```

## Current slice

- Responsive desktop sidebar and mobile bottom navigation
- Reading-first home with current progress and an update path
- Local book discovery with save-to-library interaction
- Reader DNA visualization with confidence-friendly sample language
- Private journal preview and add-book modal
- Editorial design tokens using Fraunces and DM Sans
- Open Library normalization boundary in `lib/books/providers.ts`
- Additive Supabase core migration in `supabase/migrations/0001_core.sql`
- `.env.example` for Supabase and book provider configuration
- Typed browser/server Supabase clients, auth-session middleware, a health check,
  and a persistence gateway for profiles, works, editions, and journal entries
- Incremental schema hardening for provider deduplication, timestamps, and RLS

The UI currently uses seed objects so it remains usable without credentials. Provider and database boundaries are real and ready to be connected in the next slice; no production data is invented.

## Architecture direction

- `app/`: App Router pages and global styling
- `components/`: reusable UI primitives as the surface grows
- `features/`: domain slices such as library, journal, recommendations, and professional tools
- `lib/books/`: provider abstraction and normalized book contracts
- `supabase/migrations/`: additive PostgreSQL schema, RLS, and future data policies
- `tests/`: unit, integration, and critical invariant tests

The data model intentionally separates `works` from `editions`, keeps journal content private by default, and stores sponsored campaigns separately from organic ratings and Book DNA. Paid placement can never be used as a write path to community-derived scores.

## Next implementation slices

1. Supabase client, auth flows, profile onboarding, and server-side library actions.
2. Open Library search UI, edition picker, and work/edition detail routes.
3. Progress history, advanced rating dimensions, spoiler-safe reviews, and journal CRUD.
4. Taste graph aggregates, recommendation explanations, and Reader DNA calculations.
5. RLS tests, accessibility checks, and the paid-versus-organic invariant test.

## Product principles

Core reading workflows remain free. Sponsored content is disclosed. Professional analytics are aggregate-only. Private journals remain private by default. Recommendation quality does not depend on a purchase.