import { UserRole, hasRoleAccess, isUserRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

export function resolveRole(
  metadata?: Record<string, unknown>,
): UserRole | null {
  const role = metadata?.role;
  if (typeof role === "string" && isUserRole(role)) {
    return role;
  }
  return null;
}

/** Safe internal path for post-login redirect (rejects open redirects). */
export function resolvePostLoginRedirect(
  value: FormDataEntryValue | null,
  role: UserRole | null,
): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return ROUTES.dashboard;
  }

  let pathname: string;
  try {
    pathname = new URL(value, "http://localhost").pathname;
  } catch {
    return ROUTES.dashboard;
  }

  if (!role || !hasRoleAccess(role, pathname)) {
    return ROUTES.dashboard;
  }

  return value;
}
