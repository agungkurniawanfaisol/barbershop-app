export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  CASHIER = "CASHIER",
  BARBER = "BARBER",
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrator",
  [UserRole.MANAGER]: "Manager",
  [UserRole.CASHIER]: "Cashier",
  [UserRole.BARBER]: "Barber",
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.ADMIN]: 4,
  [UserRole.MANAGER]: 3,
  [UserRole.CASHIER]: 2,
  [UserRole.BARBER]: 1,
};

/** Routes accessible per role — expanded in Phase 2 */
export const ROLE_ROUTES: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: ["*"],
  [UserRole.MANAGER]: [
    "/dashboard",
    "/employees",
    "/customers",
    "/services",
    "/transactions",
    "/expenses",
    "/reports",
    "/settings",
    "/audit",
  ],
  [UserRole.CASHIER]: [
    "/dashboard",
    "/cashier",
    "/customers",
    "/services",
    "/transactions",
  ],
  [UserRole.BARBER]: ["/dashboard", "/transactions"],
};

export function hasRoleAccess(role: UserRole, path: string): boolean {
  const allowed = ROLE_ROUTES[role];
  if (allowed.includes("*")) return true;
  return allowed.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
}
