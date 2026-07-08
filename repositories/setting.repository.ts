import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/repositories/base.repository";
import {
  SETTING_CATEGORY,
  SETTING_KEYS,
  LANDING_SETTING_CATEGORY,
} from "@/constants/settings";
import type { ShopSettingsInput } from "@/schemas/settings.schema";
import type { Prisma } from "@/app/generated/prisma/client";

export class SettingRepository {
  async getMany(keys: string[]) {
    return prisma.setting.findMany({
      where: {
        ...notDeleted,
        key: { in: keys },
      },
    });
  }

  async upsertShopSettings(input: ShopSettingsInput) {
    const entries: Array<{ key: string; value: Prisma.InputJsonValue }> = [
      { key: SETTING_KEYS.shopName, value: input.shopName },
      { key: SETTING_KEYS.shopAddress, value: input.shopAddress ?? "" },
      { key: SETTING_KEYS.shopPhone, value: input.shopPhone ?? "" },
      { key: SETTING_KEYS.taxRate, value: input.taxRate },
      { key: SETTING_KEYS.currency, value: input.currency },
      { key: SETTING_KEYS.receiptFooter, value: input.receiptFooter ?? "" },
      {
        key: SETTING_KEYS.defaultCommissionRate,
        value: input.defaultCommissionRate,
      },
    ];

    await prisma.$transaction(
      entries.map((entry) =>
        prisma.setting.upsert({
          where: { key: entry.key },
          create: {
            key: entry.key,
            value: entry.value,
            category: SETTING_CATEGORY,
          },
          update: { value: entry.value },
        }),
      ),
    );
  }

  async upsertLandingMeta(value: Prisma.InputJsonValue) {
    await prisma.setting.upsert({
      where: { key: SETTING_KEYS.landingMeta },
      create: {
        key: SETTING_KEYS.landingMeta,
        value,
        category: LANDING_SETTING_CATEGORY,
      },
      update: { value },
    });
  }
}

export const settingRepository = new SettingRepository();
