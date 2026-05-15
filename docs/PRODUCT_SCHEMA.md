# Product schema (from `Schema.docx`)

This file is the **version-controlled** mirror of the product’s conceptual schema. When **`Schema.docx`** on the Desktop is updated or appended, **update this document** and add a **new dated SQL migration** under `supabase/migrations/` for anything that should be enforced in Postgres (tables, columns, constraints, RLS).

**Source of truth for behaviour:** product / design docs (Word).  
**Source of truth for the running database:** `supabase/migrations/*.sql`.

---

## 1. User

| Concept (Word) | Notes | Current database mapping |
|------------------|-------|----------------------------|
| Account (UNSW `z[0-9]{7}`) | e.g. `z2251114` | **Future:** store in `profiles.unsw_zid text unique` or `profiles.student_id text` + check constraint / validation in app. Not in DB yet. |
| Password | — | **Supabase Auth** (`auth.users` encrypted password). Not duplicated in `public`. |
| Alternative logins? | OAuth / magic link, etc. | **Supabase Auth** identities / providers. |
| Hobbies? | | **Partial:** `profile_interests.tag` can represent hobbies; or **future** dedicated `profile_hobbies` / JSON. |
| Faculty and major? | | **Future:** `profiles.faculty text`, `profiles.major text` (nullable). |
| Degree? | | **Future:** `profiles.degree text` or enum. |
| Gender? | | **Future:** `profiles.gender text` (or enum); keep privacy/product review in mind. |
| Tags for users? | | **`profile_interests`** (`tag text`). |
| Official account recognition? | Verified / official badge | **Future:** `profiles.is_official boolean` or `profiles.verification_status`. |
| Description? | Bio | **Future:** `profiles.bio text` or use `display_name` + extended `description`. |
| Email? | | **Supabase Auth** `auth.users.email`; optional copy/sync discouraged—prefer reading via Auth API. |
| Social app links? | | **Future:** `profiles.social_links jsonb` or normalised `profile_social_links` table. |
| Phone? | | **Future:** `profiles.phone text` or Auth phone provider. |

**Implemented today:** `public.profiles` (`id`, `display_name`, `avatar_url`, timestamps) + `public.profile_interests`.

---

## 2. Posts (generic) / “Like posts”

| Concept (Word) | Current database mapping |
|----------------|----------------------------|
| Like posts | **Not implemented.** **Future:** `post_likes` (`user_id`, `post_id`, `created_at`) with RLS; target might be `forum_posts`, `uni_square_posts`, etc. |

---

## 3. Event

| Concept (Word) | Current database mapping |
|------------------|----------------------------|
| Title | `activities.title` |
| Description | `activities.description` (nullable; not in current XLSX columns; use when ARC API sends body copy). |
| Date | `activities.starts_at`, `activities.ends_at` |
| Location? | `activities.location` |
| Tags for events? | `activities.tags` (`text[]`, seeded from workbook **Event Type / Tag**); `activities.event_type` keeps the same value as a single-label column for simple filters. |

---

## 4. Uni Square post

| Concept (Word) | Current database mapping |
|----------------|----------------------------|
| User | **Not implemented.** **Future:** `uni_square_posts` (`author_id` → `profiles`) |
| Title | **Future:** `title text` |
| Location? | **Future:** `location text` |
| Tags? | **Future:** `tags text[]` |
| Description | **Future:** `body text` |

Distinct from **discussion forum** in the product doc; keep as a **separate table** when you implement it.

---

## 5. Discussion forum post

| Concept (Word) | Current database mapping |
|----------------|----------------------------|
| User | `forum_posts.author_id` |
| Description | `forum_posts.body` (title + body pattern: title separate) |
| Tags | `forum_posts.tags` (`text[]`) |
| Viewer number | **Not implemented.** **Future:** `forum_posts.view_count int` + optional `forum_post_views` for dedupe analytics. |
| Reply | `forum_replies` |
| Liked by other users | **Not implemented.** **Future:** `forum_reply_likes`, `forum_post_likes`. |
| Collected by other users | **Not implemented.** **Future:** `forum_post_saves` (user, post, created_at). |

---

## 6. Point store

| Concept (Word) | Current database mapping |
|----------------|----------------------------|
| goods | **Not implemented.** **Future:** `point_goods`, `point_balances`, `point_transactions` (design TBD). |

---

## Appendix — Rubric / Excel import (already in DB)

| Spreadsheet | Table |
|-------------|--------|
| Club Details | `societies` (`name`, `description`, `category`, `contact_email`, `rubric_admin_url`, **`tags`** seeded from `category` when present) |
| Event Details | `activities` (`title`, `event_type`, **`tags`** seeded from event type, `starts_at`, `ends_at`, `location`, `registration_url`, **`description`** null until ARC sends copy) |

See `scripts/build_seed_from_xlsx.py` and `supabase/seeds/from_xlsx.sql`.

---

## How to append the schema

1. Edit **`Schema.docx`** (or share a new section).  
2. Update **this file** with new rows / sections.  
3. When the shape is agreed, add **`supabase/migrations/YYYYMMDDHHMMSS_description.sql`** (never rewrite old migrations in place if they have already been applied anywhere).  
4. Regenerate seeds only if import shape changes.  
5. Update the app types / repositories to match.
