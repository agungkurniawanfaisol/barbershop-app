import { format, isValid, parseISO } from "date-fns";
import { siteConfig } from "@/config/site";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(siteConfig.locale, {
    style: "currency",
    currency: siteConfig.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(
  value: Date | string | null | undefined,
  pattern = "dd MMM yyyy",
): string {
  if (!value) return "—";
  const date = typeof value === "string" ? parseISO(value) : value;
  if (!isValid(date)) return "—";
  return format(date, pattern);
}

export function toNumber(value: { toString(): string } | number): number {
  return typeof value === "number" ? value : Number(value);
}

export function formatDateTime(
  value: Date | string | null | undefined,
  pattern = "dd MMM yyyy, HH:mm",
): string {
  return formatDate(value, pattern);
}

export function parseOptionalDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
