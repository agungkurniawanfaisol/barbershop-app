---
name: barberpro-query-performance
description: PostgreSQL and Prisma query optimization for BarberPro dashboards and reports. Use when dashboard is slow, adding aggregates, or writing repository findMany/groupBy queries.
---

# BarberPro Query Performance

## Dashboard hot path

`services/dashboard.service.ts` → `repositories/dashboard.repository.ts`

All five reads run in `Promise.all` — optimize each query, not just one.

## Patterns

### Prefer `select` over `include`

```ts
// ❌ Loads full related rows
include: { customer: true, barber: true, items: true }

// ✅ Only fields needed for DTO
select: {
  id, total, paidAt,
  customer: { select: { name: true } },
  items: { select: { serviceName: true, price: true, quantity: true } },
}
```

### Aggregate in SQL, not JS

```ts
// ❌ findMany all rows then loop
// ✅ $queryRaw GROUP BY DATE(paid_at) for revenue charts
```

### Use `groupBy` for breakdowns

Payment method and top services already use `groupBy` — keep that pattern.

## Indexes

`Transaction` has composite `@@index([status, paidAt])` for dashboard date-range filters.

Add indexes when filtering + sorting on the same columns repeatedly. Run `prisma db push` after schema changes.

## Seed data volume

Demo seed creates ~30 days of transactions — enough to validate charts without stress-testing.

## References

- External: `.agents/skills/supabase-postgres-best-practices`
- External: `.agents/skills/prisma-client-api`
