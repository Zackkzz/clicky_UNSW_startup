# Clicky (UNSW ARC MVP)

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

## Docker / Dev Container (virtual dev environment)

This repo includes a **Node-only** Docker setup so everyone gets the same toolchain without installing Node on the host. It is aimed at **Expo dev server + Metro** — not at running Android emulators or iOS simulators inside the container (those usually stay on the host, or you use a physical device).

### Option A — VS Code / Cursor Dev Container (recommended)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/macOS) or Docker Engine (Linux).
2. Open the repo folder in Cursor / VS Code.
3. **Command Palette** → **Dev Containers: Reopen in Container** (requires the Dev Containers extension in VS Code; Cursor supports the same flow when the feature is available).
4. After the container builds, in the integrated terminal: `npm run start:tunnel` (easiest way for a phone to reach Metro through Docker networking) or `npm run start`.

### Option B — Docker Compose from the terminal

```powershell
cd D:\myCode\clicky_UNSW_startup
docker compose up -d --build
docker compose exec app npm install
docker compose exec app npm run start:tunnel
```

Stop the `app` service only: `docker compose stop app` (full stack: `docker compose down`).

**Why `--tunnel`:** Expo advertises a URL your device can reach. Plain LAN mode from inside Docker often needs extra host/IP configuration on Windows.

### Local Supabase (Compose profile `supabase`)

This adds a second service, `supabase_local`, which mounts the **Docker socket** and runs **`supabase start`** from your repo so the normal Supabase local stack (Postgres, Auth API on **:54321**, Studio on **:54323**, etc.) comes up on the **host Docker engine** (the same one Docker Desktop uses).

```powershell
cd D:\myCode\clicky_UNSW_startup
docker compose --profile supabase up -d --build
```

Check logs if the first boot fails (ports in use, etc.): `docker compose logs -f supabase_local`.

**Configure the Expo app**

- Expo **on the host**: set `EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321` (see commented lines in `.env.example`).
- Expo **inside the `app` container**: use `EXPO_PUBLIC_SUPABASE_URL=http://host.docker.internal:54321` so the app reaches APIs bound on the host.

The default **local anon key** is commented in `.env.example` (it is the public demo JWT Supabase uses for local stacks).

**Stop Supabase (important)**

Stopping or removing the `supabase_local` container **does not** automatically remove the Supabase stack containers the CLI created. From the repo directory, with Docker running:

```powershell
npm run supabase:stop
```

If you do not have Node on the host but the `supabase_local` container is running:

```powershell
docker compose --profile supabase exec supabase_local supabase stop
```

(or run `supabase stop` from any environment where the Supabase CLI can reach the same Docker host and project folder).

**Host-only alternative (no Compose profile)**

If you already have Node on the host:

```powershell
npm run supabase:start
npm run supabase:status
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
| `supabase/` | Local Supabase config (`config.toml`), migrations, seed |
| `Dockerfile`, `docker-compose.yml` | Dev container / Compose (`app` + optional `supabase_local`) |
| `.devcontainer/devcontainer.json` | Cursor / VS Code Dev Container config |

## ARC data note

UI and queries should go through **`bundledArcRepository`** (or future `httpArcRepository`) — not raw imports in screens — so swapping ARC dummy → real data is isolated.

## Scripts

- `npm run start` — Expo dev server
- `npm run start:tunnel` — Expo with tunnel (handy with Docker or restrictive LANs)
- `npm run supabase:start` / `supabase:stop` / `supabase:status` — local Supabase via CLI on the host
- `npm run android` / `npm run ios` / `npm run web`
