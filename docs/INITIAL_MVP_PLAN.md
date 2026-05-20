# Initial Plan — Student ARC MVP (Native-First)

**Document purpose:** single source of truth for scope, experience, stories, tech choices, and delivery rhythm for the team.

**See also:** [docs/README.md](./README.md) (index), [plans/ROADMAP.md](./plans/ROADMAP.md) (current build status), [specs/](./specs/) (auth, screens, technical).

**Product pillars (from scope):**

1. **Personalised event discovery** — interests from onboarding map to societies/activities; ticketing **opens external platforms** in v1.
2. **Peer Q&A forum** — experience-based questions for academic and student life topics.
3. **Scout in context** — surface **Scout inside the Q&A experience** for simple/high-frequency queries (not a bespoke chatbot).

**Constraints agreed:**

- **Native-first** (iOS + Android via one codebase).
- **No offline forum reading** for MVP.
- **ARC data v1:** dummy bundle (recent **activities** + **societies**); swap to real feed later without rewriting UI.

---

## 1. Product goals & success signals

| Goal | MVP signal |
|------|------------|
| Validate personalised discovery | % of users who save/follow/open ≥ N events after onboarding |
| Validate peer support | Questions posted, answers within 48h, return visits |
| Validate Scout placement | Scout entry used from Q&A screens; task completion or handoff rate |
| Operational sanity | Crash-free sessions, sub-second list loads on typical campus Wi‑Fi |

*(Replace N with a number you agree on once you have baseline traffic.)*

---

## 2. MVP scope — in vs out

**In scope**

- Onboarding: interests/tags, basic profile.
- Home / discovery: societies + activities from **ARC dummy JSON**; filters; personalised ranking v1 (rules/tags).
- Event detail: description, time, society, **external ticket URL**.
- Forum: categories or tags, posts, threaded replies, basic moderation (report + hide from reporter).
- Notifications (minimal): e.g. reply to your thread (optional if timeboxed).
- Scout: embedded web / in-app browser / deep link fallback per ARC capability.

**Out of scope (explicit)**

- In-app ticketing and payments.
- Offline forum reading.
- ML-based recommendations (start with rules + recency/popularity).
- Full chatbot product.

---

## 3. Personas (lightweight)

| Persona | Need |
|---------|------|
| **New student** | Find relevant societies/events quickly; low cognitive load. |
| **Active society member** | Events discoverable; fewer duplicate “where do I…?” questions if forum works. |
| **Casual browser** | Scroll and filter without forced account until action requires it. |

---

## 4. Feature list (MVP backlog shape)

| ID | Feature | Notes |
|----|---------|--------|
| F1 | Auth & session | **In progress:** email/password + zID mapping + Google OAuth. Spec: [specs/AUTH_SPEC.md](./specs/AUTH_SPEC.md). |
| F2 | Onboarding | Pick interests; persist to profile. |
| F3 | ARC content feed | Societies + activities list/detail from **bundled dummy** via repository. |
| F4 | Personalisation v1 | Score/rank by tag overlap + recency + simple popularity. |
| F5 | External ticketing | Open ticket URL in in-app browser / Safari / Chrome Custom Tabs. |
| F6 | Forum — browse | Lists, search/filter client-side for dummy-scale data. |
| F7 | Forum — contribute | Create post, reply; auth required. |
| F8 | Forum — safety | Report content; author delete own post; basic admin toggles if role exists. |
| F9 | Scout entry points | From Q&A hub and/or empty-search state; fallback deep link. |
| F10 | Settings | Notifications toggle, sign out, privacy links. |

---

## 5. User experiences (key journeys)

**Journey A — First value in < 5 minutes**

1. Install app → sign in.
2. Onboarding: select interests.
3. Land on **For you**: top societies/activities match interests.
4. Open activity → **Get tickets** → external site.

**Journey B — Peer question**

1. Open **Forum** → pick topic area.
2. Search existing posts (client-side v1).
3. If unresolved → **Ask** → receive push when someone replies (if implemented).

**Journey C — Scout-assisted lookup**

1. From forum hub, tap **Ask Scout** (wording TBD with ARC).
2. Simple FAQ-style flow or embedded Scout UI.
3. If insufficient → suggest **Post to forum** with prefilled title/tags.

---

## 6. User stories (with acceptance-style hints)

**Discovery**

- **US-1:** As a student, I can complete onboarding by selecting interests so that my home feed reflects those tags.
  - *Acceptance:* interests persist; changing them updates ranking without reinstall.
- **US-2:** As a student, I can browse societies and activities so that I understand what is on and who runs it.
  - *Acceptance:* list + detail; images optional; graceful empty states.
- **US-3:** As a student, I can open ticketing externally so that I can complete purchase on the official platform.
  - *Acceptance:* ticket URL never silently broken; in-app browser back returns to app.

**Forum**

- **US-4:** As a signed-in student, I can create a post with title and body so that peers can respond.
  - *Acceptance:* validation; post visible after publish; errors surfaced.
- **US-5:** As a reader, I can read threads online so that I can learn from prior answers.
  - *Acceptance:* no offline requirement; pull-to-refresh.
- **US-6:** As a participant, I can reply to a thread so that conversation stays grouped.
  - *Acceptance:* threading model documented (1-level vs nested); consistent ordering.
- **US-7:** As a user, I can report inappropriate content so that moderators can act later.
  - *Acceptance:* report reason; reporter no longer sees content if “hide for me” implemented.

**Scout**

- **US-8:** As a student, I can open Scout from the Q&A area so that simple questions are deflected from duplicate forum posts.
  - *Acceptance:* clear entry point; fallback if Scout unavailable (message + retry/deeplink).

**Admin / ops (minimal)**

- **US-9:** As an operator, I can replace dummy ARC JSON version so that demos stay stable.
  - *Acceptance:* versioned file name; release notes entry.

---

## 7. Tech stack tables

### Table A — React Native (CLI / bare-style)

| Component | Technology |
|-----------|------------|
| Mobile runtime | React Native |
| Project setup | React Native CLI / bare template |
| Language | TypeScript |
| UI | RN primitives + Tamagui or React Native Paper |
| Navigation | React Navigation |
| State / server cache | TanStack Query + Zustand (or similar) |
| Auth | Supabase Auth |
| Database | PostgreSQL (Supabase) |
| Data access | Supabase JS + Row Level Security |
| Storage | Supabase Storage (if attachments) |
| ARC MVP data | Bundled JSON + repository interface |
| ARC later | HTTPS sync / API behind same interface |
| Push | FCM + APNs (native wiring) |
| Build / release | Xcode / Android Studio + CI + Fastlane |
| Quality | Sentry |

### Table B — Recommended “present idea” (Expo-managed React Native)

| Component | Technology |
|-----------|------------|
| Mobile runtime | React Native (via Expo) |
| Project setup | Expo |
| Language | TypeScript |
| UI | RN primitives + Tamagui or React Native Paper |
| Navigation | Expo Router |
| State / server cache | TanStack Query + Zustand (or similar) |
| Auth | Supabase Auth |
| Database | PostgreSQL (Supabase) |
| Data access | Supabase JS + Row Level Security |
| Storage | Supabase Storage (if attachments) |
| ARC MVP data | Bundled JSON + repository interface |
| ARC later | HTTPS sync / API behind same interface |
| Push | Expo Push Notifications |
| Build / release | EAS Build |
| OTA (optional) | EAS Update |
| Quality | Sentry |

**Recommendation for this team:** **Table B (Expo)** — same React skills, less native project toil, faster iteration for two people.

---

## 8. High-level architecture

```text
[ Expo App ]
  ├─ UI (screens, components)
  ├─ Feature modules (discovery, forum, scout shell)
  └─ Data layer
       ├─ Supabase client (auth, forum CRUD, profiles)
       └─ ArcRepository
             ├─ BundledJsonArcRepository (MVP)
             └─ HttpArcRepository (post-ARC API)
```

**Principles**

- **No UI → direct ARC JSON reads**; always through `ArcRepository`.
- **RLS** on all student-generated tables; never trust the client for authorization.
- **Scout** behind a thin adapter (`openScout(context)`) for WebView vs deep link.

---

## 9. Data model (first cut — illustrative)

**Supabase / Postgres (examples, not final SQL)**

- `profiles` — user id, display name, onboarding tags, created_at.
- `forum_posts` — id, author, title, body, tags, created_at, status.
- `forum_replies` — id, post_id, author, body, created_at.
- `reports` — id, target_type, target_id, reporter_id, reason, created_at.

**ARC dummy JSON (bundled)**

- `societies[]` — id, name, description, category tags, image url optional.
- `activities[]` — id, society_id, title, start/end, location, ticket_url, tags.

---

## 10. Workflow (how the two of you work)

| Area | Practice |
|------|----------|
| **Source control** | GitHub; **trunk-based** or short-lived branches (`feature/*`); PR required for `main`. |
| **Branch naming** | `feature/forum-report`, `fix/onboarding-crash`. |
| **Reviews** | Async PR review within 24h; merge when CI green + one approval (peer). |
| **CI** | Lint + typecheck + unit tests on PR; optional EAS build on `main` tags. |
| **Environments** | `dev` Supabase project + `staging` + `prod`; app points via env config. |
| **Secrets** | EAS secrets + Supabase dashboard; never commit keys. |
| **Design / copy** | Lightweight Figma or doc for screens; ARC-approved Scout strings. |
| **Release** | **Internal TestFlight / Play internal testing** weekly during build phase; store release when checklist passes. |

---

## 11. Software development plan (phased)

**Phase 0 — Foundation (week 1–2)**

- Repo, Expo app shell, Supabase projects, auth working, navigation skeleton, Sentry.
- `ArcRepository` + bundled dummy JSON in app; societies + activities screens read-only.

**Phase 1 — Discovery MVP (week 2–4)**

- Onboarding + persisted profile tags.
- Personalised ranking v1 + filters.
- Event detail + external ticketing flow + analytics events.

**Phase 2 — Forum MVP (week 4–7)**

- Schema + RLS for posts/replies.
- Create/read thread flows; report MVP.
- Optional: push for replies (if scoped).

**Phase 3 — Scout + hardening (week 7–9)**

- Scout entry UX + WebView/deeplink adapter.
- Performance pass, empty/error states, accessibility basics.
- Beta checklist: crash rate, core flows tested on two OS versions each.

**Phase 4 — Pilot & iterate (ongoing)**

- ARC real data swap behind repository when available.
- Moderation improvements based on real usage.

*(Durations are indicative; adjust to your term dates and ARC milestones.)*

---

## 12. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| ARC API delayed | Repository pattern + dummy JSON versioning from day one. |
| Scout cannot embed | Deep link + clear UX; measure drop-off. |
| Forum abuse early | Report flow + rate limits + minimal moderator role. |
| Two-person bandwidth | Strict MVP out-of-scope list; no parallel “second product” (e.g. web app). |

---

## 13. Open decisions (fill in as you learn ARC constraints)

- Exact **auth** method allowed for students — **v1 implemented:** email/password + Google; institutional SSO TBD. See [specs/AUTH_SPEC.md](./specs/AUTH_SPEC.md).
- **Scout** integration mechanism (embed vs link) and branding approval.
- **Threading** model (flat vs one-level nested).
- **Moderation** — who is first-line moderator (ARC vs you).

---

## Document control

| Field | Value |
|-------|--------|
| Version | 0.1 |
| Intended audience | Founders + ARC stakeholders |
| Next update | After ARC confirms Scout + data access path |
