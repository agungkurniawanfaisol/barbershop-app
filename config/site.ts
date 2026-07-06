export const siteConfig = {
  name: "BarberPro POS",
  description:
    "Enterprise barbershop management and point-of-sale system",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:5173",
  locale: "id-ID",
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "IDR",
} as const;
