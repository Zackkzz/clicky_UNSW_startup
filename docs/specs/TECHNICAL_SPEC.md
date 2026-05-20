# Technical specification

Engineering reference for the Clicky Expo app and Supabase backend.

---

## 1. Stack

| Layer | Technology | Version (approx.) |
|-------|------------|-------------------|
| Runtime | React Native via Expo | SDK 54 |
| Language | TypeScript | 5.9 |
| Navigation | Expo Router | 6 |
| Server state | TanStack Query | 5 |
| Client state | Zustand | 5 |
| Backend | Supabase (Auth + Postgres + RLS) | CLI 2.98 |
| Bundler | Metro | (Expo) |

---

## 2. Repository layout

```text
app/                    # Expo Router screens
  index.tsx             # Splash → onboarding
  onboarding-branded.tsx
  login.tsx
  alternative-login.tsx
  (tabs)/               # Main app shell
components/             # Shared UI (Expo template)
lib/
  supabase.ts           # Supabase client (lazy init)
  auth/                 # Credentials, session, OAuth
  arc/                  # Bundled ARC repository
providers/
  AppProviders.tsx      # React Query + AuthProvider
  AuthProvider.tsx      # Session bootstrap + route guard
stores/
  auth-store.ts
supabase/
  migrations/           # Schema source of truth
  seeds/
scripts/
  build_seed_from_xlsx.py
  ci-verify-supabase.mjs
.github/workflows/ci.yml
```

---

## 3. Architecture

```text
[ Expo App ]
  ├─ UI (app/* screens)
  ├─ AuthProvider (session, guards)
  └─ Data layer
       ├─ getSupabase() → Auth, future forum CRUD
       └─ bundledArcRepository → MVP discovery JSON
```

**Principles**

- UI must not read ARC JSON directly; use `bundledArcRepository` (swap to `HttpArcRepository` later).
- All student-generated content uses Postgres with **RLS** enabled.
- Supabase client is **lazy-initialized** so static web export / CI does not create clients at import time.

---

## 4. Environments

| Environment | Supabase | App config |
|-------------|----------|------------|
| Local | `supabase start` → `http://127.0.0.1:54321` | `.env` from `.env.example` |
| Cloud dev/staging/prod | Separate Supabase projects | `EXPO_PUBLIC_SUPABASE_*` per project |

**Never commit** `.env` or service role keys. Client uses **anon key** only.

---

## 5. CI pipeline

Workflow: `.github/workflows/ci.yml`

| Job | Steps |
|-----|--------|
| **Typecheck & web bundle** | `npm ci` → `expo export --platform web` → `tsc --noEmit` |
| **Supabase project** | Verify `supabase/config.toml` + ≥1 migration file |

**Local equivalent:**

```bash
npm run ci:all
```

**Node version:** `.node-version` → **22** (GitHub Actions uses `setup-node` with this file).

**CI env:** placeholder `EXPO_PUBLIC_SUPABASE_*` values so Metro can bundle auth code without secrets.

---

## 6. Native dependencies (notable)

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Auth + PostgREST |
| `@react-native-async-storage/async-storage` | Auth session persistence (native) |
| `ws` | Supabase Realtime transport during Node static render / CI |
| `expo-web-browser` | Google OAuth browser session |
| `expo-linking` | OAuth redirect URI |

---

## 7. Data access (current vs planned)

| Domain | MVP (now) | Target |
|--------|-----------|--------|
| Societies / activities | `lib/arc/bundled-repository.ts` | Supabase `societies` / `activities` or HTTP ARC API |
| Forum | Not wired | Supabase `forum_*` tables |
| Profiles / interests | Auth + trigger only | Onboarding writes `profile_interests` |

---

## 8. Quality & release (target)

| Practice | Status |
|----------|--------|
| PR + CI on `main` | CI configured |
| EAS Build | Not configured in repo |
| Sentry | Not configured |
| Feature flags | Not used |

---

## 9. Related documents

- [AUTH_SPEC.md](./AUTH_SPEC.md)
- [APP_SCREENS_SPEC.md](./APP_SCREENS_SPEC.md)
- [PRODUCT_SCHEMA.md](../PRODUCT_SCHEMA.md)
- [plans/ROADMAP.md](../plans/ROADMAP.md)
