import { settingRepository } from "@/repositories/setting.repository";
import { SETTING_KEYS } from "@/constants/settings";
import { siteConfig } from "@/config/site";
import type { ShopSettingsInput } from "@/schemas/settings.schema";

export type ShopSettingsDto = {
  shopName: string;
  shopAddress: string | null;
  shopPhone: string | null;
  taxRate: number;
  currency: string;
  receiptFooter: string | null;
  defaultCommissionRate: number;
};

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
}

export class SettingService {
  async getShopSettings(): Promise<ShopSettingsDto> {
    const records = await settingRepository.getMany(Object.values(SETTING_KEYS));
    const map = new Map(records.map((record) => [record.key, record.value]));

    const envTaxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 11);

    return {
      shopName:
        readString(map.get(SETTING_KEYS.shopName)) ||
        process.env.NEXT_PUBLIC_SHOP_NAME ||
        siteConfig.name,
      shopAddress: readString(map.get(SETTING_KEYS.shopAddress)) || null,
      shopPhone: readString(map.get(SETTING_KEYS.shopPhone)) || null,
      taxRate: readNumber(map.get(SETTING_KEYS.taxRate), envTaxRate),
      currency:
        readString(map.get(SETTING_KEYS.currency)) ||
        process.env.NEXT_PUBLIC_CURRENCY ||
        siteConfig.currency,
      receiptFooter: readString(map.get(SETTING_KEYS.receiptFooter)) || null,
      defaultCommissionRate: readNumber(
        map.get(SETTING_KEYS.defaultCommissionRate),
        25,
      ),
    };
  }

  async updateShopSettings(input: ShopSettingsInput): Promise<ShopSettingsDto> {
    await settingRepository.upsertShopSettings(input);
    return this.getShopSettings();
  }
}

export const settingService = new SettingService();
