import { Banknote, CreditCard, QrCode, ArrowRightLeft, Scissors } from "lucide-react";
import type {
  PaymentBreakdownDto,
  TopServiceDto,
} from "@/services/dashboard.service";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const PAYMENT_LABELS: Record<string, string> = {
  CASH: "Cash",
  QRIS: "QRIS",
  DEBIT: "Debit",
  TRANSFER: "Transfer",
};

const PAYMENT_ICONS: Record<string, typeof Banknote> = {
  CASH: Banknote,
  QRIS: QrCode,
  DEBIT: CreditCard,
  TRANSFER: ArrowRightLeft,
};

const BAR_COLORS = [
  "bg-primary",
  "bg-accent",
  "bg-violet-500",
  "bg-amber-500",
] as const;

type DashboardSidebarProps = {
  paymentBreakdown: PaymentBreakdownDto[];
  topServices: TopServiceDto[];
};

export function DashboardSidebar({
  paymentBreakdown,
  topServices,
}: DashboardSidebarProps) {
  const paymentTotal = paymentBreakdown.reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      <div className="app-card p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="font-semibold tracking-tight">Metode Bayar</h3>
          <p className="text-xs text-muted-foreground">30 hari terakhir</p>
        </div>
        <div className="space-y-4">
          {paymentBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada data.</p>
          ) : (
            paymentBreakdown.map((item, index) => {
              const pct =
                paymentTotal > 0
                  ? Math.round((item.total / paymentTotal) * 100)
                  : 0;
              const Icon = PAYMENT_ICONS[item.method] ?? Banknote;
              return (
                <div key={item.method} className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="size-4 text-muted-foreground" aria-hidden />
                      </span>
                      <span className="truncate">
                        {PAYMENT_LABELS[item.method] ?? item.method}
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        BAR_COLORS[index % BAR_COLORS.length],
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.count} transaksi · {pct}%
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="app-card p-4 sm:p-5">
        <div className="mb-4">
          <h3 className="font-semibold tracking-tight">Layanan Terlaris</h3>
          <p className="text-xs text-muted-foreground">Berdasarkan qty terjual</p>
        </div>
        {topServices.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada data.</p>
        ) : (
          <ol className="space-y-2">
            {topServices.map((service, index) => (
              <li
                key={service.name}
                className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 px-3 py-2.5 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                      index === 0
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="flex min-w-0 items-center gap-1.5 truncate">
                    <Scissors className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    {service.name}
                  </span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {service.quantity}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
