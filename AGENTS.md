# BarberPro POS — Agent Memory

Enterprise barbershop POS built with Next.js 15 App Router. All 7 development phases are complete.

**Quick refs:** [MEMORY.md](MEMORY.md) · [SKILLS.md](SKILLS.md) · [.cursor/README.md](.cursor/README.md)

## Stack

- **Next.js 15.5** · React 19 · TypeScript strict · Turbopack
- **Tailwind v4** · shadcn/ui (Base UI) · Lucide
- **Prisma 7** + `@prisma/adapter-pg` + `pg` → Supabase PostgreSQL (`ap-northeast-1` pooler)
- **Supabase Auth** (SSR cookies) · RBAC via `app_metadata.role`
- **Zustand** (POS cart) · TanStack Query · RHF · Zod v4
- **Docker Compose** — app + Redis only (port **5173**, no Mailpit)

## Architecture (strict layer order)

```
app/(protected)/[route]/page.tsx   → requireRole() + service reads
features/[module]/                 → Client UI (tables, dialogs)
actions/[module].actions.ts          → authorizeAction() + mutations
services/                            → Business logic + DTO serialization
repositories/                        → Prisma + soft delete (notDeleted)
schemas/                             → Zod validation
constants/                           → Client-safe enums (NOT Prisma imports on client)
utils/result.ts                      → ActionResult<T> pattern
```

## Client / server boundaries

| Safe on client | Server only |
|----------------|-------------|
| `constants/roles.ts` (`UserRole`) | `@/app/generated/prisma/client` |
| `types/auth.ts` (`SessionUser`) | `lib/prisma.ts`, repositories |
| DTO types from services | `authorizeAction`, `requireRole` |

- shadcn Button: no `asChild` — use `buttonVariants` + `Link`
- `isSuccess(result)` needs consistent `ActionResult<T>` (don't union incompatible T)

## Prisma 7

- Import: `@/app/generated/prisma/client` (not bare `@/app/generated/prisma`)
- Adapter required in `lib/prisma.ts`: `PrismaPg` + `pg` Pool
- All tables: UUID PKs, soft delete via `deletedAt`

## RBAC routes

| Role | Access |
|------|--------|
| ADMIN | All routes |
| MANAGER | All except `/users`, `/cashier` |
| CASHIER | dashboard, cashier, customers, services, transactions |
| BARBER | dashboard, my-earnings |

Middleware + `constants/roles.ts` `ROLE_ROUTES` must stay in sync.

## Public routes

| Route | Notes |
|-------|-------|
| `/` | Marketing landing — static, `features/landing/`, haircut gallery |
| `/login` | Supabase Auth sign-in |

## Modules (complete)

| Route | Module |
|-------|--------|
| `/dashboard` | Metrics, revenue chart, recent tx |
| `/cashier` | POS — Zustand cart, checkout, receipt |
| `/customers`, `/employees`, `/services` | CRUD |
| `/transactions` | History + receipt reprint |
| `/my-earnings` | Barber personal earnings (day/week/month) |
| `/expenses` | Expense CRUD |
| `/reports` | P&L, revenue, tx, expenses + CSV/Excel/PDF export |
| `/settings` | Shop profile, tax, currency |
| `/users` | Invite, role, active (Admin) |
| `/audit` | Audit trail |

## Design system

- Master: `design-system/barberpro-pos/MASTER.md`
- Page overrides: `design-system/pages/[page].md` (e.g. `landing.md`)
- Primary `#2563EB`, accent `#059669`, Inter font, IDR locale
- Landing images: `public/images/haircuts/`

## Supabase & database

- Project ref: `oehicghzzjcxvyrbumzs`
- Use **pooler** URLs (`aws-0-ap-northeast-1.pooler.supabase.com`) — not `db.*.supabase.co` from WSL
- `DIRECT_URL` → migrations/seed; `DATABASE_URL` → transaction pooler `:6543`
- Auth Site URL: `http://localhost:5173`, redirect `http://localhost:5173/**`
- Demo credentials: `DataPenting.txt`

## Commands

```bash
cp .env.example .env          # Supabase + DATABASE_URL required
npm run docker:dev            # Preferred dev (port 5173)
npm run build                 # Always verify before finishing
export $(grep -v '^#' .env | xargs) && DATABASE_URL="$DIRECT_URL" npx prisma db push
npm run db:seed               # Demo users + catalog + transactions
```

## Env keys

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (user invite), `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_TAX_RATE`, `NEXT_PUBLIC_SHOP_NAME`, `NEXT_PUBLIC_CURRENCY`

## Adding a new feature

Follow `.cursor/skills/barberpro-feature-module/SKILL.md` checklist.

## Project skills

| Skill | Topic |
|-------|-------|
| `barberpro-architecture` | Layers, constraints |
| `barberpro-feature-module` | New modules |
| `barberpro-rbac-audit` | Auth & audit |
| `barberpro-docker-supabase` | Docker, Supabase, seed |
| `barberpro-landing-page` | Homepage `/` |
| `barberpro-query-performance` | Dashboard SQL |

Full index: [SKILLS.md](SKILLS.md)

## External skills (skills.sh)

Installed under `.agents/skills/`: `nextjs-app-router-patterns`, `nextjs-supabase-auth`, `prisma-upgrade-v7`, `prisma-client-api`, `supabase`, `supabase-postgres-best-practices`, `vercel-react-best-practices`, `shadcn`.

Add: `npx skills find <query>` then `npx skills add owner/repo@skill-name`
