import { getSessionUser } from "@/lib/auth/session";
import type { UserRole } from "@/constants/roles";
import type { SessionUser } from "@/types/auth";
import { failure, success, type ActionResult } from "@/utils/result";

export async function authorizeAction(
  allowedRoles: UserRole[],
): Promise<ActionResult<SessionUser>> {
  const user = await getSessionUser();

  if (!user) {
    return failure("Please sign in to continue", "UNAUTHORIZED");
  }

  if (!allowedRoles.includes(user.role)) {
    return failure("You do not have permission for this action", "FORBIDDEN");
  }

  return success(user);
}
