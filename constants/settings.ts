export const SETTING_KEYS = {
  shopName: "shop.name",
  shopAddress: "shop.address",
  shopPhone: "shop.phone",
  taxRate: "shop.tax_rate",
  currency: "shop.currency",
  receiptFooter: "shop.receipt_footer",
  defaultCommissionRate: "shop.default_commission_rate",
  landingMeta: "landing.meta",
} as const;

export const SETTING_CATEGORY = "shop";
export const LANDING_SETTING_CATEGORY = "landing";

export const CURRENCY_OPTIONS = [
  { value: "IDR", label: "IDR — Indonesian Rupiah" },
  { value: "USD", label: "USD — US Dollar" },
] as const;
