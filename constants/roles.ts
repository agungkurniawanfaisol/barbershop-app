import { ROUTES } from "@/constants/routes";

/** Client-safe role enum — mirrors Prisma UserRole */
export const UserRole = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  CASHIER: "CASHIER",
  BARBER: "BARBER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

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
    "/transactions",
  ],
  [UserRole.BARBER]: [ROUTES.dashboard, ROUTES.myEarnings],
};

export function hasRoleAccess(role: UserRole, path: string): boolean {
  const allowed = ROLE_ROUTES[role];
  if (allowed.includes("*")) return true;
  return allowed.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
}

export function isUserRole(value: string): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole);
}
