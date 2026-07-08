const DEFAULT_SHOP_NAME = "Hexa Barber";

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SHOP_NAME ?? DEFAULT_SHOP_NAME,
  description:
    "Barbershop premium dengan layanan rapi, POS modern, dan pengalaman pelanggan terbaik",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:5173",
  locale: "id-ID",
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "IDR",
} as const;
