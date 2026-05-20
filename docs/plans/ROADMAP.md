# Implementation roadmap

Tracks **MVP plan** ([INITIAL_MVP_PLAN.md](../INITIAL_MVP_PLAN.md)) against **what is in the repo today**.

**Legend:** Done · Partial · Not started

---

## Phase overview

| Phase | Focus | Target (indicative) | Status |
|-------|--------|---------------------|--------|
| 0 | Foundation — Expo, Supabase, ARC dummy, CI | Weeks 1–2 | **Partial** |
| 1 | Discovery — onboarding interests, personalised feed | Weeks 2–4 | **Not started** (UI shell only) |
| 2 | Forum MVP | Weeks 4–7 | **Not started** (DB ready) |
| 3 | Scout + hardening | Weeks 7–9 | **Not started** |
| 4 | Pilot / real ARC data | Ongoing | **Not started** |

---

## Feature backlog (MVP IDs from initial plan)

| ID | Feature | Status | Notes |
|----|---------|--------|-------|
| F1 | Auth & session | **Partial** | Email/password + Google OAuth; zID email mapping; session guard. See [AUTH_SPEC.md](../specs/AUTH_SPEC.md). |
| F2 | Onboarding | **Partial** | Marketing onboarding screens + auto-advance; **interest tags not persisted** yet. |
| F3 | ARC content feed | **Partial** | Bundled JSON + Discover tab demo; not Supabase-backed. |
| F4 | Personalisation v1 | **Not started** | Rules engine / ranking. |
| F5 | External ticketing | **Not started** | Open `registration_url` in browser. |
| F6 | Forum — browse | **Not started** | Tables + RLS exist. |
| F7 | Forum — contribute | **Not started** | |
| F8 | Forum — safety | **Not started** | `content_reports` table exists. |
| F9 | Scout entry points | **Not started** | |
| F10 | Settings | **Not started** | Sign out on Discover only. |

---

## Shipped in repo (concrete)

### App screens

| Screen | Route | Status |
|--------|-------|--------|
| Splash | `/` | Done |
| Branded onboarding | `/onboarding-branded` | Done |
| Login | `/login` | Done |
| Alternative login (Google) | `/alternative-login` | Done |
| Discover (tabs) | `/(tabs)` | Partial (dummy data) |
| Placeholder tab | `/(tabs)/two` | Scaffold |

### Backend / data

| Item | Status |
|------|--------|
| Supabase migrations (`profiles`, `societies`, `activities`, forum, RLS) | Done |
| Seed from ARC Excel | Done (`scripts/build_seed_from_xlsx.py`) |
| Supabase Auth + profile trigger | Done |
| Forum / discovery read from Postgres in app | Not started |

### Engineering

| Item | Status |
|------|--------|
| GitHub Actions CI (typecheck, web export, migration check) | Done |
| Docker / Dev Container | Done |
| `ArcRepository` interface + bundled implementation | Done |

---

## Near-term priorities (suggested order)

1. **Auth polish** — email confirmation policy, password reset, optional `profiles.unsw_zid` column ([PRODUCT_SCHEMA.md](../PRODUCT_SCHEMA.md)).
2. **Persist onboarding interests** — write `profile_interests` after tag picker (F2).
3. **Discovery UI** — societies/activities lists wired to Supabase or keep bundled repo until ARC API (F3).
4. **Forum read path** — list/detail from `forum_posts` (F6).
5. **Forum write path** — create post/reply (F7).
6. **Event detail + external tickets** (F5).

---

## Out of scope (unchanged)

- In-app payments / ticketing
- Offline forum
- ML recommendations
- Standalone chatbot (Scout is in-context only)
- Apple Sign-In (removed; Google + email only)

---

## Open decisions

| Topic | Options | Decision |
|-------|---------|----------|
| Email confirmation | Required vs off in dev | TBD per environment |
| UNSW badge | OAuth now; verify zID later | **Deferred** — `unsw_verified_at` not in DB yet |
| Forum threading | Flat vs one-level nested | TBD |
| ARC live API | HTTP repository vs sync job | TBD when ARC provides access |

---

## Document control

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-05 | Initial roadmap aligned with repo state |
