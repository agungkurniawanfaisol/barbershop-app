---
name: barberpro-feature-module
description: Step-by-step workflow to add a CRUD or business module to BarberPro POS following existing patterns. Use when creating new pages, entities, server actions, or extending customers/employees/expenses-style modules.
---

# Add a BarberPro Feature Module

## Checklist

```
- [ ] 1. Schema — schemas/[entity].schema.ts (Zod + types)
- [ ] 2. Repository — repositories/[entity].repository.ts (notDeleted, soft delete)
- [ ] 3. Service — services/[entity].service.ts (DTO serialize, toNumber for Decimal)
- [ ] 4. Actions — actions/[entity].actions.ts (authorizeAction, revalidatePath)
- [ ] 5. Feature UI — features/[entity]/[entity]-manager.tsx
- [ ] 6. Page — app/(protected)/[route]/page.tsx (requireRole, paginationSchema)
- [ ] 7. Nav + routes — constants/routes.ts, constants/navigation.ts, ROLE_ROUTES
- [ ] 8. Export schema — schemas/index.ts
- [ ] 9. Audit (if mutating) — auditService.logChange in actions
- [ ] 10. npm run build
```

## Page template

```tsx
await requireRole([UserRole.ADMIN, UserRole.MANAGER]);
const params = paginationSchema.parse(await searchParams);
const result = await entityService.list(params);
```

## Action template

```tsx
const auth = await authorizeAction(ALLOWED_ROLES);
if (!isSuccess(auth)) return auth;
const parsed = schema.safeParse(input);
if (!parsed.success) return failure(parsed.error.issues[0]?.message ?? "Invalid input");
```

## UI patterns

- List: `SearchInput`, `PaginationControls`, `EmptyState`, table in feature component
- Forms: native `FormData` + `useTransition` + `toast` + `router.refresh()` (match `customer-manager.tsx`)
- Delete: `DeleteConfirmDialog`

## Reference implementations

- CRUD: `features/customers/`, `features/expenses/`
- POS client state: `stores/pos.store.ts`, `features/cashier/`
- Reports/export: `services/report.service.ts`, `utils/export/`

See [references/module-map.md](references/module-map.md) for route ↔ file map.
