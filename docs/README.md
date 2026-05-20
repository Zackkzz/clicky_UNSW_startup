# Clicky documentation

Product and engineering docs for the UNSW ARC student app (Clicky MVP).

## Plans (what we are building and when)

| Document | Purpose |
|----------|---------|
| [INITIAL_MVP_PLAN.md](./INITIAL_MVP_PLAN.md) | Original MVP scope, personas, user stories, phased delivery, risks |
| [plans/ROADMAP.md](./plans/ROADMAP.md) | **Current** implementation status vs MVP backlog; near-term priorities |

## Specifications (how it works)

| Document | Purpose |
|----------|---------|
| [specs/TECHNICAL_SPEC.md](./specs/TECHNICAL_SPEC.md) | Stack, repo layout, architecture, CI, environments |
| [specs/AUTH_SPEC.md](./specs/AUTH_SPEC.md) | Authentication flows (email/zID, Google), Supabase setup |
| [specs/APP_SCREENS_SPEC.md](./specs/APP_SCREENS_SPEC.md) | Screens, navigation, UX flows implemented in the app |
| [PRODUCT_SCHEMA.md](./PRODUCT_SCHEMA.md) | Conceptual schema (Word → Postgres mapping); future fields |

## Related repo assets

| Path | Purpose |
|------|---------|
| `supabase/migrations/` | Enforced database schema + RLS |
| `scripts/build_seed_from_xlsx.py` | ARC Excel → SQL seed |
| `.env.example` | Required environment variables |
| `.github/workflows/ci.yml` | CI pipeline |

## Document control

| Field | Value |
|-------|--------|
| Maintainers | Product + engineering |
| Update rule | Change specs when behaviour or schema changes; update ROADMAP when milestones ship |
