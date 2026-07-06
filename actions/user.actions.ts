"use server";

import { revalidatePath } from "next/cache";
import { authorizeAction } from "@/lib/auth/authorize";
import { UserRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { userService } from "@/services/user.service";
import { auditService } from "@/services/audit.service";
import {
  inviteUserSchema,
  updateUserSchema,
} from "@/schemas/user.schema";
import { failure, success, type ActionResult, isSuccess } from "@/utils/result";
import type { UserDto } from "@/services/user.service";

const USER_ROLES = [UserRole.ADMIN];

export async function inviteUserAction(
  input: unknown,
): Promise<ActionResult<UserDto>> {
  const auth = await authorizeAction(USER_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = inviteUserSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const user = await userService.invite(parsed.data);

    await auditService.logChange({
      userId: auth.data.id,
      action: "INVITE",
      entity: "USER",
      entityId: user.id,
      newValue: {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });

    revalidatePath(ROUTES.users);
    revalidatePath(ROUTES.audit);
    return success(user);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to invite user",
    );
  }
}

export async function updateUserAction(
  input: unknown,
): Promise<ActionResult<UserDto>> {
  const auth = await authorizeAction(USER_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const { user, previous } = await userService.update(parsed.data, auth.data.id);

    await auditService.logChange({
      userId: auth.data.id,
      action: "UPDATE",
      entity: "USER",
      entityId: user.id,
      oldValue: previous,
      newValue: user,
    });

    revalidatePath(ROUTES.users);
    revalidatePath(ROUTES.audit);
    return success(user);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to update user",
    );
  }
}
