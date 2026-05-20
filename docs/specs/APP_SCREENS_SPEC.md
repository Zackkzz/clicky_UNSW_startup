# App screens specification

UI routes, behaviour, and design tokens for the Expo app.

---

## 1. Navigation map

```text
/  (index)                    Splash
    → auto (2s) or tap
/onboarding-branded          Marketing headline
    → auto (2s) or tap
/login                        Sign in / sign up
    → Alternative logins (modal)
    → success → /(tabs)
/(tabs)                       Main app (auth required)
  /(tabs)/index               Discover
  /(tabs)/two                 Placeholder
/alternative-login            Google OAuth (modal)
/modal                        Expo template modal
```

**Stack animations** (`app/_layout.tsx`):

| Transition | Animation |
|------------|-----------|
| Splash → onboarding | Fade |
| Onboarding → login | Slide (platform default / slide_from_right on Android) |

---

## 2. Screen specifications

### 2.1 Splash (`app/index.tsx`)

| Attribute | Value |
|-----------|--------|
| Background | `#A7A7FF` |
| Content | Cream circle + “c”, tagline lines |
| Interaction | Tap or **2s** auto → `/onboarding-branded` |
| Auth | None |

### 2.2 Branded onboarding (`app/onboarding-branded.tsx`)

| Attribute | Value |
|-----------|--------|
| Background | `#B4A7FF` |
| Content | GO FOR / DYNAMIC / UNI LIFE (outlined text), WITH, clicky (Caveat) |
| Interaction | Tap or **2s** auto → `/login` |
| Auth | None |

### 2.3 Login (`app/login.tsx`)

| Attribute | Value |
|-----------|--------|
| Layout | Top ~50% lavender panel (CLICKY logo, tagline, mascot); bottom white form |
| Colors | Panel `#B5B5FF`, accent `#9980FF`, yellow `#FFFFD1` |
| Fields | Account number, password (pill inputs) |
| Actions | **Login**, **Create account**, **Alternative logins**, terms (placeholder) |
| Validation | Account required → password required → Supabase |
| Errors | Red text under title; info text for “check email” after sign-up |

### 2.4 Alternative login (`app/alternative-login.tsx`)

| Attribute | Value |
|-----------|--------|
| Presentation | Modal stack screen |
| Actions | **Continue with Google**, Back |
| Auth | `signInWithGoogle()` |

### 2.5 Discover (`app/(tabs)/index.tsx`)

| Attribute | Value |
|-----------|--------|
| Data | `bundledArcRepository.loadAll()` via TanStack Query |
| Auth | Shows signed-in email; **Sign out** |
| Purpose | MVP demo of societies + activities lists |

### 2.6 Tabs shell (`app/(tabs)/_layout.tsx`)

Standard Expo tabs template; second tab placeholder.

---

## 3. Typography & fonts

| Usage | Font |
|-------|------|
| “clicky” script | `Caveat_700Bold` (loaded in root `_layout.tsx`) |
| Headlines / UI | System Helvetica / sans-serif bold |

---

## 4. Auth-gated behaviour

| State | Behaviour |
|-------|-----------|
| Signed out on `(tabs)` | Redirect to `/login` |
| Signed in on `/login` | Redirect to `/(tabs)` |
| Signed in on splash/onboarding | Redirect to `/(tabs)` (skip marketing if returning user) |

---

## 5. Planned screens (not implemented)

Aligned with [INITIAL_MVP_PLAN.md](../INITIAL_MVP_PLAN.md) and [ROADMAP.md](../plans/ROADMAP.md):

| Screen | Purpose |
|--------|---------|
| Interest onboarding | Pick tags → `profile_interests` |
| Society list / detail | Discovery |
| Activity detail | Description, external ticket CTA |
| Forum list / thread / compose | Q&A |
| Scout shell | WebView / deep link |
| Settings | Notifications, privacy, sign out |

---

## 6. Deep linking

| Scheme | `clickyunswstartup` (`app.json`) |
|--------|----------------------------------|
| OAuth return | Required for Google sign-in |

---

## 7. Related documents

- [AUTH_SPEC.md](./AUTH_SPEC.md)
- [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)
- [PRODUCT_SCHEMA.md](../PRODUCT_SCHEMA.md)
