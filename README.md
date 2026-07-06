# BarberPro POS — Foundation

Enterprise barbershop management system. This document describes the **foundation layer only** — no business features.

## Quick Start

```bash
cp .env.example .env   # fill Supabase credentials
docker compose up --build
```

Development runs entirely in Docker — do not use `npm run dev` on the host.

## Docker (App + Redis)

```bash
npm run docker:dev     # foreground
npm run docker:build   # rebuild image after Dockerfile changes
npm run docker:down    # stop stack
```

| Service | URL |
|---------|-----|
| App | http://localhost:5173 |
| Redis | internal (`redis:6379`) |

## Folder Structure

```
app/              Routes, layouts, global styles
features/         Feature modules (Phase 3+)
components/
  ui/             shadcn/ui primitives (Radix/Base UI)
  forms/          Shared form components
  layout/         Shell, theme toggle
actions/          Server Actions
repositories/     Prisma data access
services/         Business logic
hooks/            React hooks
providers/        Context providers
stores/           Zustand stores
schemas/          Zod validation schemas
types/            TypeScript types
constants/        App constants
utils/            Pure utilities
lib/              Infrastructure (prisma, supabase, redis, mail)
config/           App configuration
prisma/           Database schema
docker/           Dockerfile
public/           Static assets
```

## Path Aliases

| Alias | Path |
|-------|------|
| `@/*` | Project root |
| `@/components/*` | `components/` |
| `@/features/*` | `features/` |
| `@/lib/*` | `lib/` |
| `@/stores/*` | `stores/` |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run typecheck` | TypeScript check |
| `npm run db:migrate` | Prisma migrate |
| `npm run db:seed` | Seed demo data |

## Agent setup (Cursor)

Project memory, skills, and rules live in:

- **`AGENTS.md`** — stack, architecture, modules, env
- **`.cursor/skills/`** — BarberPro-specific skills (`barberpro-architecture`, `barberpro-feature-module`, `barberpro-rbac-audit`)
- **`.cursor/rules/`** — layered Cursor rules (core, actions, client boundary, data layer, design)
- **`.agents/skills/`** — external skills from [skills.sh](https://skills.sh) (Next.js, Prisma 7, Supabase)

See `.cursor/README.md` for the full index.

## Stack

- Next.js 15 · React 19 · TypeScript (strict)
- Tailwind CSS v4 · shadcn/ui · Lucide icons
- Prisma 7 · Supabase Auth + PostgreSQL
- Zustand · TanStack Query · RHF · Zod
- Docker Compose · Redis
