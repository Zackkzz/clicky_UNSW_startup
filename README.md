# Clicky (UNSW Startup MVP)

Native-first student app scaffold: **personalised ARC discovery**, **peer forum**, and **Scout-in-context** (per product plan in `docs/INITIAL_MVP_PLAN.md`).

## Stack

- **Expo SDK 54** + **Expo Router** + **TypeScript**
- **Supabase** (`@supabase/supabase-js`) — Auth + Postgres when you wire schemas
- **TanStack Query** — server/cache state (demo: ARC dummy dataset)
- **Zustand** — lightweight client state (`stores/auth-store.ts` starter)

## Getting started

```bash
npm install
copy .env.example .env   # PowerShell: Copy-Item .env.example .env
```

Add your Supabase **Project URL** and **anon key** to `.env` as `EXPO_PUBLIC_SUPABASE_*`. Until then, the app runs fine using bundled ARC dummy JSON only.

```bash
npm run start
```

## Project layout (initial)

| Path | Purpose |
|------|---------|
| `app/` | Expo Router screens |
| `assets/data/arc-dummy.json` | Versioned ARC placeholder societies + activities |
| `lib/arc/` | `ArcRepository` types + bundled implementation (swap for HTTP later) |
| `lib/supabase.ts` | Supabase client (null until env vars are set) |
| `providers/AppProviders.tsx` | `QueryClientProvider` |
| `stores/` | Zustand stores |
| `docs/INITIAL_MVP_PLAN.md` | Scope, stories, delivery plan |

## ARC data note

UI and queries should go through **`bundledArcRepository`** (or future `httpArcRepository`) — not raw imports in screens — so swapping ARC dummy → real data is isolated.

## Scripts

- `npm run start` — Expo dev server
- `npm run android` / `npm run ios` / `npm run web`
