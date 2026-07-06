# Cursor Skills & Rules — BarberPro POS

## Agent docs (root)

| File | Purpose |
|------|---------|
| [AGENTS.md](../AGENTS.md) | Full project memory for agents |
| [MEMORY.md](../MEMORY.md) | Quick-reference facts |
| [SKILLS.md](../SKILLS.md) | Skill catalog + install commands |

## Project skills (`.cursor/skills/`)

| Skill | When to use |
|-------|-------------|
| `barberpro-architecture` | Stack, layers, constraints |
| `barberpro-feature-module` | New CRUD / business module |
| `barberpro-rbac-audit` | Auth, roles, audit logging |
| `barberpro-docker-supabase` | Docker dev, Supabase DB, seed |
| `barberpro-landing-page` | Public homepage `/` |
| `barberpro-query-performance` | Dashboard/report query optimization |

Invoke: `@barberpro-docker-supabase` or describe the task in chat.

## External skills (`.agents/skills/` via [skills.sh](https://skills.sh))

| Skill | Source |
|-------|--------|
| `nextjs-app-router-patterns` | wshobson/agents |
| `nextjs-supabase-auth` | sickn33/antigravity-awesome-skills |
| `prisma-upgrade-v7` | prisma/skills |
| `prisma-client-api` | prisma/skills |
| `supabase` | supabase/agent-skills |
| `supabase-postgres-best-practices` | supabase/agent-skills |
| `vercel-react-best-practices` | vercel-labs/agent-skills |
| `shadcn` | shadcn/ui |

Add more: `npx skills find <query>` then `npx skills add owner/repo@skill-name`

## Rules (`.cursor/rules/`)

| Rule | Scope |
|------|-------|
| `barberpro-core.mdc` | Always apply |
| `barberpro-docker-dev.mdc` | Always apply — port 5173, Docker-only |
| `barberpro-server-actions.mdc` | `actions/**` |
| `barberpro-client-boundary.mdc` | `features/**`, `components/**`, `stores/**` |
| `barberpro-data-layer.mdc` | `repositories/**`, `services/**`, `prisma/**` |
| `barberpro-design-system.mdc` | UI files + `globals.css` |
| `barberpro-landing-page.mdc` | Landing page + haircut assets |
| `barberpro-query-performance.mdc` | Repositories, dashboard queries |
