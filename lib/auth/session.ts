import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authService } from "@/services/auth.service";
import { UserRole, hasRoleAccess } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import type { SessionUser } from "@/types/auth";
import type { User } from "@/app/generated/prisma/client";

function mapToSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role as UserRole,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
  };
}

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const authUser = await getAuthUser();
  if (!authUser) return null;

  let dbUser = await authService.getUserById(authUser.id);

  if (!dbUser) {
    dbUser = await authService.syncUser(authUser);
  }

  if (!dbUser.isActive) return null;

  return mapToSessionUser(dbUser);
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(ROUTES.login);
  return user;
}

export async function requireRole(
  allowedRoles: UserRole[],
): Promise<SessionUser> {
  const user = await requireSessionUser();
  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }
  return user;
}

export function assertRouteAccess(role: UserRole, pathname: string): boolean {
  return hasRoleAccess(role, pathname);
}
