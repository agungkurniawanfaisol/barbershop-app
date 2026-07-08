import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Receipt,
  Scissors,
  Shield,
  Sparkles,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

const ICON_MAP = {
  CreditCard,
  LayoutDashboard,
  Users,
  Receipt,
  Wallet,
  Shield,
  Zap,
  Scissors,
  BarChart3,
  Sparkles,
} as const satisfies Record<string, LucideIcon>;

export type LandingIconName = keyof typeof ICON_MAP;

export function resolveLandingIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Sparkles;
  return ICON_MAP[name as LandingIconName] ?? Sparkles;
}
