"use client";

import { Clock, Scissors, ShoppingBag, User } from "lucide-react";
import { usePosStore } from "@/stores/pos.store";
import { formatCurrency } from "@/lib/format";

type PosStatusBarProps = {
  serviceCount: number;
  taxRate: number;
};

export function PosStatusBar({ serviceCount, taxRate }: PosStatusBarProps) {
  const items = usePosStore((s) => s.items);
  const customer = usePosStore((s) => s.customer);
  const walkIn = usePosStore((s) => s.walkIn);
  const getTotals = usePosStore((s) => s.getTotals);
  const totals = getTotals();

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="pos-status-bar shrink-0">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="relative">
          <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
            <Scissors className="size-3.5" aria-hidden />
          </div>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground ring-2 ring-card">
              {itemCount}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Kasir
          </p>
          <p className="truncate text-sm font-semibold tabular-nums">
            {itemCount > 0 ? formatCurrency(totals.total) : "Siap melayani"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <User className="size-3" aria-hidden />
          {customer ? customer.name : walkIn ? "Walk-in" : "Belum dipilih"}
        </span>
        <span className="inline-flex items-center gap-1">
          <ShoppingBag className="size-3" aria-hidden />
          {itemCount} item
        </span>
        <span className="inline-flex items-center gap-1">
          <Scissors className="size-3" aria-hidden />
          {serviceCount} layanan
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3" aria-hidden />
          Pajak {taxRate}%
        </span>
      </div>
    </header>
  );
}
