import { cache } from "react";
import { settingService } from "@/services/setting.service";
import { siteConfig } from "@/config/site";
import type { PublicBranding } from "@/types/branding";

export function getDefaultShopName(): string {
  return process.env.NEXT_PUBLIC_SHOP_NAME ?? siteConfig.name;
}

function resolveLocationLabel(address: string | null): string {
  if (!address?.trim()) return "Indonesia";
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.at(-1) ?? address;
}

export const getPublicBranding = cache(async (): Promise<PublicBranding> => {
  const settings = await settingService.getShopSettings();

  return {
    shopName: settings.shopName || getDefaultShopName(),
    shopAddress: settings.shopAddress,
    shopPhone: settings.shopPhone,
    tagline: siteConfig.description,
    locationLabel: resolveLocationLabel(settings.shopAddress),
  };
});
