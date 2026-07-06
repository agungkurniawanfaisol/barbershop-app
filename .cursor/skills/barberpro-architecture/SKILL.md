---
name: barberpro-architecture
description: BarberPro POS layered architecture, stack constraints, and module map. Use when adding features, refactoring, onboarding to this repo, or when the user mentions BarberPro, hexabarber, POS, or phase development.
---

# BarberPro Architecture

## Layer flow (never skip)

1. **Page** (`app/(protected)/…/page.tsx`) — `requireRole`, parse `searchParams`, call **service** for reads
2. **Feature UI** (`features/[module]/`) — `"use client"` only when needed; mutations via **actions**
3. **Actions** (`actions/*.actions.ts`) — `"use server"`, `authorizeAction`, Zod parse, **service**, `revalidatePath`, `ActionResult`
4. **Service** — DTO serialization, business rules, orchestrates repositories
5. **Repository** — Prisma only; always `notDeleted` filter; soft delete via `softDeleteData()`

## Hard constraints

- Prisma client: `@/app/generated/prisma/client`
- Prisma 7: `@prisma/adapter-pg` in `lib/prisma.ts`
- Client-safe roles: `constants/roles.ts` — never import Prisma enums in client bundles
- Return type: `Promise<ActionResult<T>>` — don't union incompatible `T` in actions
- Audit significant mutations via `auditService.logChange` (settings, users, expenses pattern)

## Key paths

| Concern | Location |
|---------|----------|
| RBAC routes | `constants/roles.ts`, `middleware.ts` |
| Session | `lib/auth/session.ts`, `types/auth.ts` |
| Results | `utils/result.ts` |
| Design | `design-system/barberpro-pos/MASTER.md` |
| Full memory | `AGENTS.md` |

## Verify

```bash
npm run build
```
