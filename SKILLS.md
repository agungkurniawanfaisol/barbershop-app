# SKILLS.md — BarberPro POS

Index of skills for AI agents. Install external skills via [skills.sh](https://skills.sh).

## Project skills (`.cursor/skills/`)

Invoke with `@skill-name` or by describing the task.

| Skill | Use when |
|-------|----------|
| [barberpro-architecture](.cursor/skills/barberpro-architecture/SKILL.md) | Stack, layers, module map |
| [barberpro-feature-module](.cursor/skills/barberpro-feature-module/SKILL.md) | New CRUD / business module |
| [barberpro-rbac-audit](.cursor/skills/barberpro-rbac-audit/SKILL.md) | Auth, roles, audit logging |
| [barberpro-docker-supabase](.cursor/skills/barberpro-docker-supabase/SKILL.md) | Docker dev, Supabase DB, seed |
| [barberpro-landing-page](.cursor/skills/barberpro-landing-page/SKILL.md) | Public homepage `/` |
| [barberpro-query-performance](.cursor/skills/barberpro-query-performance/SKILL.md) | Dashboard/report SQL optimization |

## External skills (`.agents/skills/`)

Installed with `npx skills add owner/repo@skill-name`:

| Skill | Source | Use when |
|-------|--------|----------|
| `nextjs-app-router-patterns` | wshobson/agents | App Router layouts, RSC |
| `nextjs-supabase-auth` | sickn33/antigravity-awesome-skills | Supabase SSR auth |
| `prisma-upgrade-v7` | prisma/skills | Prisma 7 config, adapters |
| `prisma-client-api` | prisma/skills | Queries, relations, raw SQL |
| `supabase` | supabase/agent-skills | Supabase platform, Auth, RLS |
| `supabase-postgres-best-practices` | supabase/agent-skills | Postgres indexes, pooling |
| `vercel-react-best-practices` | vercel-labs/agent-skills | React/Next performance |
| `shadcn` | shadcn/ui | shadcn component patterns |

Lock file: [skills-lock.json](skills-lock.json)

## Add more skills

```bash
npx skills find supabase
npx skills find nextjs
npx skills add vercel-labs/agent-skills@vercel-react-best-practices
```

## Related docs

- [AGENTS.md](AGENTS.md) — full agent memory
- [MEMORY.md](MEMORY.md) — quick reference facts
- [.cursor/README.md](.cursor/README.md) — rules index

## Cursor rules (auto-applied)

| Rule | Scope |
|------|-------|
| `barberpro-core.mdc` | Always |
| `barberpro-docker-dev.mdc` | Always |
| `barberpro-server-actions.mdc` | `actions/**` |
| `barberpro-client-boundary.mdc` | `features/**`, `components/**` |
| `barberpro-data-layer.mdc` | `repositories/**`, `services/**`, `prisma/**` |
| `barberpro-design-system.mdc` | UI files |
| `barberpro-landing-page.mdc` | Landing + haircut assets |
| `barberpro-query-performance.mdc` | Repositories, dashboard |
