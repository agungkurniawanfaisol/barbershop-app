# BarberPro POS

Enterprise barbershop management and point-of-sale system.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui + Radix UI
- **Database:** PostgreSQL (Supabase) + Prisma ORM
- **Auth:** Supabase Auth
- **State:** Zustand + TanStack Query

## Getting Started

### 1. Environment

```bash
cp .env.example .env
# Fill in Supabase credentials and DATABASE_URL
```

### 2. Local Development (without Docker)

```bash
npm install
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Docker Development (with Redis + Mailpit)

```bash
cp .env.example .env
npm run docker:dev
```

| Service  | URL                        |
|----------|----------------------------|
| App      | http://localhost:3000      |
| Mailpit  | http://localhost:8025      |
| Redis    | localhost:6379             |

### 4. Database Migrations

```bash
npx prisma migrate dev --name init
```

## Project Structure

```
app/           → Routes & pages
features/      → Feature-specific UI
actions/       → Server Actions
repositories/  → Data access (Prisma)
services/      → Business logic
schemas/       → Zod validation
providers/     → React context providers
docker/        → Docker Compose & Dockerfile
prisma/        → Database schema
```

## Development Phases

| Phase | Status | Scope                    |
|-------|--------|--------------------------|
| 1     | ✅     | Foundation & scaffolding |
| 2     | ⏳     | Auth + RBAC              |
| 3     | ⏳     | Core CRUD modules        |
| 4     | ⏳     | Cashier POS              |
| 5     | ⏳     | Dashboard                |
| 6     | ⏳     | Reports + Expenses       |
| 7     | ⏳     | Settings, Users, Audit   |
