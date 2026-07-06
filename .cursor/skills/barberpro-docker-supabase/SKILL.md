---
name: barberpro-docker-supabase
description: Docker-only dev workflow, Supabase PostgreSQL pooler, env vars, and database seed for BarberPro POS. Use when running the app, fixing DB connection, seeding demo data, or configuring Supabase Auth URLs.
---

# BarberPro Docker & Supabase

## Dev workflow (required)

- **Do not** use `npm run dev` on the host for normal development
- Run: `npm run docker:dev` or `docker compose up --build`
- App URL: **http://localhost:5173** (not 3000)
- Stack: `app` + `redis` only (Mailpit removed)

## Database connection

| Env | Purpose |
|-----|---------|
| `DIRECT_URL` | Session pooler `:5432` — migrations, seed, Prisma push |
| `DATABASE_URL` | Transaction pooler `:6543?pgbouncer=true` — runtime |

**Region:** `ap-northeast-1` — format:
`postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:...`

**Do not** use `db.[ref].supabase.co` from WSL — IPv6-only, unreachable.

`lib/prisma.ts` prefers `DIRECT_URL` for the pg Pool.

## Supabase Auth

Dashboard → Authentication → URL Configuration:
- Site URL: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173/**`

Required env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Seed

```bash
npm run db:seed          # host with .env loaded
# or inside container:
docker compose exec app npx prisma db seed
```

- Script: `prisma/seed.ts`
- Config: `prisma.config.ts` → `migrations.seed`
- Idempotent via `seed.version` setting
- Creates Supabase Auth users + Prisma rows (same UUID)
- Demo credentials: `DataPenting.txt`

## Common commands

```bash
export $(grep -v '^#' .env | xargs) && DATABASE_URL="$DIRECT_URL" npx prisma db push
npm run docker:down && docker compose up -d --build
```

## Verify

- `docker compose ps` — app + redis healthy
- `curl -I http://localhost:5173` → 200
- Login with admin from `DataPenting.txt`
