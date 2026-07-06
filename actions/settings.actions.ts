"use server";

import { revalidatePath } from "next/cache";
import { authorizeAction } from "@/lib/auth/authorize";
import { UserRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { settingService } from "@/services/setting.service";
import { auditService } from "@/services/audit.service";
import { shopSettingsSchema } from "@/schemas/settings.schema";
import { failure, success, type ActionResult, isSuccess } from "@/utils/result";
import type { ShopSettingsDto } from "@/services/setting.service";

const SETTINGS_ROLES = [UserRole.ADMIN, UserRole.MANAGER];

export async function updateShopSettingsAction(
  input: unknown,
): Promise<ActionResult<ShopSettingsDto>> {
  const auth = await authorizeAction(SETTINGS_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = shopSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid settings");
  }

  try {
    const previous = await settingService.getShopSettings();
    const settings = await settingService.updateShopSettings(parsed.data);

    await auditService.logChange({
      userId: auth.data.id,
      action: "UPDATE",
      entity: "SETTING",
      entityId: "shop",
      oldValue: previous,
      newValue: settings,
    });

    revalidatePath(ROUTES.settings);
    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.cashier);
    revalidatePath(ROUTES.reports);
    return success(settings);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to save settings",
    );
  }
}
