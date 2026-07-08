"use client";

import { useEffect, useState } from "react";
import { ChevronUp, ShoppingBag } from "lucide-react";
import type { PosBarberDto, PosCustomerDto, PosServiceDto } from "@/stores/pos.store";
import { usePosStore } from "@/stores/pos.store";
import { ServiceGrid } from "@/features/cashier/service-grid";
import { OrderPanel } from "@/features/cashier/order-panel";
import { PosMobileDrawer } from "@/features/cashier/pos-mobile-drawer";
import { ReceiptDialog } from "@/features/cashier/receipt-dialog";
import { PosStatusBar } from "@/features/cashier/pos-status-bar";
import { formatCurrency } from "@/lib/format";

type PosPageProps = {
  services: PosServiceDto[];
  barbers: PosBarberDto[];
  recentCustomers: PosCustomerDto[];
  taxRate: number;
  shopName: string;
  serviceCount: number;
};

export function PosPage({
  services,
  barbers,
  recentCustomers,
  taxRate,
  shopName,
  serviceCount,
}: PosPageProps) {
  const setTaxPercent = usePosStore((s) => s.setTaxPercent);
  const lastTransaction = usePosStore((s) => s.lastTransaction);
  const receiptOpen = usePosStore((s) => s.receiptOpen);
  const setReceiptOpen = usePosStore((s) => s.setReceiptOpen);
  const setLastTransaction = usePosStore((s) => s.setLastTransaction);
  const itemCount = usePosStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  );
  const getTotals = usePosStore((s) => s.getTotals);
  const totals = getTotals();

  const [orderOpen, setOrderOpen] = useState(false);

  useEffect(() => {
    setTaxPercent(taxRate);
  }, [taxRate, setTaxPercent]);

  useEffect(() => {
    if (itemCount === 0) setOrderOpen(false);
  }, [itemCount]);

  function handleReceiptDone() {
    setReceiptOpen(false);
    setLastTransaction(null);
  }

  return (
    <div className="pos-workspace pos-compact flex min-h-0 flex-1 flex-col overflow-hidden">
      <PosStatusBar serviceCount={serviceCount} taxRate={taxRate} />

      <div className="pos-workspace-body min-h-0 flex-1">
        <main className="pos-catalog">
          <ServiceGrid services={services} />
        </main>

        <OrderPanel
          barbers={barbers}
          shopName={shopName}
          recentCustomers={recentCustomers}
          className="hidden lg:flex"
        />
      </div>

      {itemCount > 0 && !orderOpen && (
        <button
          type="button"
          onClick={() => setOrderOpen(true)}
          className="pos-mobile-trigger shrink-0 lg:hidden"
          aria-label="Buka pesanan"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <ShoppingBag className="size-4" aria-hidden />
            </span>
            <div className="text-left">
              <p className="text-xs font-medium text-muted-foreground">
                {itemCount} layanan
              </p>
              <p className="text-sm font-bold tabular-nums">
                {formatCurrency(totals.total)}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold text-primary">
            Lihat pesanan
            <ChevronUp className="size-4" aria-hidden />
          </span>
        </button>
      )}

      <PosMobileDrawer open={orderOpen} onClose={() => setOrderOpen(false)}>
        <OrderPanel
          barbers={barbers}
          shopName={shopName}
          recentCustomers={recentCustomers}
          compact
          className="pos-order-panel-sheet h-full max-w-none border-0 shadow-none"
        />
      </PosMobileDrawer>

      <ReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        transaction={lastTransaction}
        shopName={shopName}
        onDone={handleReceiptDone}
      />
    </div>
  );
}
