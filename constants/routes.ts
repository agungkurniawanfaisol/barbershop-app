import { siteConfig } from "@/config/site";

export const APP_NAME = siteConfig.name;
export const APP_DESCRIPTION =
  "Enterprise barbershop management and point-of-sale system";

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  cashier: "/cashier",
  customers: "/customers",
  employees: "/employees",
  services: "/services",
  transactions: "/transactions",
  expenses: "/expenses",
  reports: "/reports",
  settings: "/settings",
  landing: "/landing",
  users: "/users",
  audit: "/audit",
  myEarnings: "/my-earnings",
} as const;

export type RouteKey = keyof typeof ROUTES;
