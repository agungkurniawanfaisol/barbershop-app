"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PosPanelVariant = "services" | "cart" | "checkout";

const HEADER_STYLES: Record<PosPanelVariant, string> = {
  services: "pos-panel-header-services",
  cart: "pos-panel-header-cart",
  checkout: "pos-panel-header-checkout",
};

const ICON_STYLES: Record<PosPanelVariant, string> = {
  services: "bg-primary text-primary-foreground shadow-md shadow-primary/20",
  cart: "bg-amber-500 text-white shadow-md shadow-amber-500/25",
  checkout: "bg-accent text-accent-foreground shadow-md shadow-accent/25",
};

type PosPanelProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  variant?: PosPanelVariant;
  compact?: boolean;
  className?: string;
  headerExtra?: ReactNode;
  children: ReactNode;
};

export function PosPanel({
  title,
  subtitle,
  icon,
  variant = "services",
  compact = false,
  className,
  headerExtra,
  children,
}: PosPanelProps) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm",
        compact ? "min-h-0" : "min-h-0 lg:min-h-full",
        className,
      )}
    >
      <header
        className={cn(
          "flex items-center justify-between gap-3 border-b border-border/60",
          HEADER_STYLES[variant],
          compact ? "px-3 py-3" : "px-4 py-4 sm:px-5",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          {icon && (
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                ICON_STYLES[variant],
              )}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="font-semibold tracking-tight sm:text-base">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {headerExtra}
      </header>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          compact ? "p-3" : "p-4 sm:p-5",
          !compact && "lg:overflow-hidden",
        )}
      >
        {children}
      </div>
    </section>
  );
}
