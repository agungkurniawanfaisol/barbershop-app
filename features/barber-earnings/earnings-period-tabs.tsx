"use client";

import Link from "next/link";
import type { EarningsPeriod } from "@/constants/barber-earnings";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const PERIODS: { value: EarningsPeriod; label: string }[] = [
  { value: "day", label: "Hari" },
  { value: "week", label: "Minggu" },
  { value: "month", label: "Bulan" },
];

type EarningsPeriodTabsProps = {
  period: EarningsPeriod;
};

export function EarningsPeriodTabs({ period }: EarningsPeriodTabsProps) {
  return (
    <div
      className="inline-flex w-full rounded-lg border bg-muted/40 p-1 sm:w-auto"
      role="tablist"
      aria-label="Periode pendapatan"
    >
      {PERIODS.map((item) => {
        const isActive = period === item.value;
        const href =
          item.value === "day"
            ? ROUTES.myEarnings
            : `${ROUTES.myEarnings}?period=${item.value}`;

        return (
          <Link
            key={item.value}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "min-h-9 flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors sm:flex-none sm:px-6",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
