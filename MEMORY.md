# MEMORY.md — BarberPro POS

Persistent facts for AI agents. Full detail: [AGENTS.md](AGENTS.md).

## Project

- **Name:** BarberPro POS (hexabarber-app)
- **Type:** Enterprise barbershop POS + management
- **Locale:** `id-ID`, currency IDR

## Dev environment

| Item | Value |
|------|-------|
| App URL | http://localhost:5173 |
| Dev mode | Docker only (`docker compose up`) |
| Docker services | `app`, `redis` (no Mailpit) |
| Supabase region | `ap-northeast-1` (pooler, IPv4) |
| Prisma push/seed | Use `DIRECT_URL` (session pooler :5432) |

## Supabase project

- Ref: `oehicghzzjcxvyrbumzs`
- URL: `https://oehicghzzjcxvyrbumzs.supabase.co`
- Auth redirect: `http://localhost:5173/**`

## Demo login (see DataPenting.txt)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@barberpro.local | BarberAdmin2026! |
| Manager | manager@barberpro.local | BarberMgr2026! |
| Cashier | cashier@barberpro.local | BarberCash2026! |

## Key routes

| URL | Purpose |
|-----|---------|
| `/` | Marketing landing (static) |
| `/login` | Staff sign-in |
| `/dashboard` | Protected overview |

## Seed

- `npm run db:seed` — idempotent via `seed.version`
- Creates services, barbers, customers, 30-day sample transactions

## Design

- Master: `design-system/barberpro-pos/MASTER.md`
- Landing override: `design-system/pages/landing.md`
- Primary `#2563EB`, accent `#059669`, Inter font

## Do not

- Use port 3000
- Use `db.*.supabase.co` direct host from WSL (IPv6)
- Import Prisma client in client components
- Use Mailpit in Docker stack
