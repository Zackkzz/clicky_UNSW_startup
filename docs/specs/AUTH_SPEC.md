# Authentication specification

How sign-in, sign-up, and sessions work in Clicky.

---

## 1. Goals

| Goal | Approach |
|------|----------|
| UNSW students sign in with familiar identifiers | Map zID → institutional email for Supabase Auth |
| Low-friction alternative | **Google OAuth** only (no Apple in v1) |
| Session persists across app restarts | Supabase Auth + AsyncStorage (native) / localStorage (web) |
| Protect main app | `(tabs)` requires authenticated session |

**Deferred:** UNSW “verified badge” (`profiles.unsw_verified_at`), magic link-only auth, Apple Sign-In.

---

## 2. Supabase providers (dashboard)

Enable under **Authentication → Sign In / Providers**:

| Provider | Use |
|----------|-----|
| **Email** | Password sign-in and sign-up |
| **Google** | Alternative login screen |

**URL configuration → Redirect URLs** (required for OAuth):

```text
clickyunswstartup://**
http://localhost:8081/**
```

Add Expo tunnel URLs when using `expo start --tunnel`.

**Google Cloud:** create a **Web application** OAuth client; redirect URI:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

Paste **Client ID** and **Client secret** into Supabase Google provider settings.

---

## 3. Account field → email mapping

Implemented in `lib/auth/credentials.ts` → `accountToEmail()`.

| User enters | Auth email |
|-------------|------------|
| Full email (contains `@`) | Lowercased as-is |
| `z1234567` or `1234567` | `z1234567@student.unsw.edu.au` |
| `z123456` or `123456` | `z123456@ad.unsw.edu.au` |

Invalid zID format → error before network call.

**Important:** Confirmation / password-reset emails go to the **mapped address**. The user must have access to that mailbox (or disable confirm-email in dev).

---

## 4. Client flows

### 4.1 Email password — login

1. User fills **account number** and **password** on `/login`.
2. Client validates: account required, then password required.
3. `signInWithPassword()` → Supabase Auth.
4. On success → `router.replace('/(tabs)')`.

### 4.2 Email password — create account

1. User taps **Create account** (same fields).
2. `signUpWithPassword()` → Supabase Auth + `handle_new_user` trigger → `public.profiles` row.
3. If session returned → enter tabs immediately.
4. If email confirmation required (no session) → info message: check email, then log in.

### 4.3 Google OAuth

1. User taps **Alternative logins** → `/alternative-login`.
2. `signInWithGoogle()` → `signInWithOAuth` + in-app browser (native) or redirect (web).
3. On success → session stored → tabs.

### 4.4 Sign out

Discover tab → **Sign out** → `signOut()` → `/login`.

---

## 5. Session & route guard

`providers/AuthProvider.tsx`:

- On mount: `getSession()` + `onAuthStateChange` → `stores/auth-store.ts`.
- If **no session** and route is `(tabs)` → redirect to `/login`.
- If **session** and route is splash/login/alternative-login → redirect to `/(tabs)`.

`getSupabase()` in `lib/supabase.ts` is **lazy** (avoids CI/static export WebSocket errors).

---

## 6. Database (auth-related)

| Object | Purpose |
|--------|---------|
| `auth.users` | Supabase Auth identities |
| `public.profiles` | App profile; 1:1 with `auth.users.id` |
| Trigger `on_auth_user_created` | Inserts profile on signup |

See migrations: `supabase/migrations/20260514120000_initial_schema.sql`.

---

## 7. Environment variables

```env
EXPO_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

Restart Metro after changing `.env`.

---

## 8. Error messages (user-facing)

| Condition | Message (typical) |
|-----------|-------------------|
| Empty account | Account number is required. |
| Empty password | Password is required. |
| Bad credentials | Account or password is incorrect. |
| Unconfirmed email | Confirm your email before signing in. |
| Supabase not configured | Add EXPO_PUBLIC_* to `.env` |

---

## 9. Future work

| Item | Notes |
|------|-------|
| Password reset | `resetPasswordForEmail` + deep link screen |
| `profiles.unsw_zid` | Store canonical zID; verification workflow |
| `unsw_verified_at` | Badge after verification |
| Rate limiting / CAPTCHA | Supabase + edge functions if abuse |
| Institutional SSO | Azure AD / UNSW IdP if required |

---

## 10. Code reference

| File | Role |
|------|------|
| `lib/auth/credentials.ts` | zID → email, field validation |
| `lib/auth/session.ts` | signIn, signUp, signOut, Google OAuth |
| `lib/supabase.ts` | Client singleton |
| `lib/supabase-auth-storage.ts` | Platform storage + SSR memory |
| `app/login.tsx` | Login UI |
| `app/alternative-login.tsx` | Google UI |
| `providers/AuthProvider.tsx` | Session + guards |
