---
name: barberpro-rbac-audit
description: RBAC, Supabase auth sync, and audit logging for BarberPro POS. Use when changing permissions, middleware, user roles, invite flow, or audit trail behavior.
---

# BarberPro RBAC & Audit

## RBAC sources of truth

1. **Prisma** `User.role` — app data
2. **Supabase** `app_metadata.role` — middleware reads this
3. **`constants/roles.ts`** — `ROLE_ROUTES`, `hasRoleAccess` (client-safe)
4. **`middleware.ts`** — route guards on every request

After role change: `authService.syncRoleMetadata(userId, role)`.

## Authorization helpers

| Helper | Use |
|--------|-----|
| `requireSessionUser()` | Server pages needing login |
| `requireRole([...])` | Server pages — redirects `/unauthorized` |
| `authorizeAction(roles)` | Server actions — returns `ActionResult` failure |

## User invite (Admin)

Requires `SUPABASE_SERVICE_ROLE_KEY`. Flow in `userService.invite`:
`createAdminClient().auth.admin.createUser` → `userRepository.create` → sync metadata.

Safeguard: actor cannot deactivate self or change own role.

## Audit logging

```typescript
await auditService.logChange({
  userId: auth.data.id,
  action: "CREATE" | "UPDATE" | "DELETE" | "INVITE",
  entity: "USER" | "SETTING" | "EXPENSE" | …,
  entityId: id,
  oldValue?: unknown,
  newValue?: unknown,
});
revalidatePath(ROUTES.audit);
```

Wire on settings, users, expenses actions. Display: `features/audit/audit-log-list.tsx`.

## Client boundary

Never import `services/` that pull Prisma into `"use client"` files. Use DTO props from server pages or client-safe constants (`constants/reports.ts` pattern for report labels).
