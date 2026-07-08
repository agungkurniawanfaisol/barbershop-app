import { Suspense } from "react";
import { format } from "date-fns";
import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { transactionService } from "@/services/transaction.service";
import { transactionListFilterSchema } from "@/schemas/transaction.schema";
import { TransactionList } from "@/features/transactions/transaction-list";
import { TransactionFilters } from "@/features/transactions/transaction-filters";
import { TransactionChartLazy } from "@/features/transactions/transaction-chart-lazy";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { SearchInput } from "@/components/data/search-input";
import { PaginationControls } from "@/components/data/pagination-controls";
import { EmptyState } from "@/components/data/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Transactions" };

type TransactionsPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

function getChartRangeLabel(from?: string, to?: string) {
  if (from && to) {
    return `${format(new Date(from), "dd MMM yyyy")} — ${format(new Date(to), "dd MMM yyyy")}`;
  }
  if (from) {
    return `From ${format(new Date(from), "dd MMM yyyy")}`;
  }
  if (to) {
    return `Until ${format(new Date(to), "dd MMM yyyy")}`;
  }
  return "Last 30 days";
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  await requireRole([
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.CASHIER,
  ]);

  const params = transactionListFilterSchema.parse(await searchParams);
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "BarberPro";

  const [result, chartData, barbers] = await Promise.all([
    transactionService.list(params),
    transactionService.getChartData(params),
    transactionService.getFilterBarbers(),
  ]);

  return (
    <PageShell>
      <PageHeader description="Filter, analisis, dan kelola struk dengan tindak lanjut WhatsApp." />

      <Suspense fallback={<Skeleton className="h-48 w-full rounded-2xl" />}>
        <TransactionFilters
          barbers={barbers}
          defaults={{
            from: params.from,
            to: params.to,
            paymentMethod: params.paymentMethod,
            barberId: params.barberId,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
            whatsapp: params.whatsapp,
          }}
        />
      </Suspense>

      <TransactionChartLazy
        data={chartData}
        rangeLabel={getChartRangeLabel(params.from, params.to)}
      />

      <Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
        <PageToolbar>
          <SearchInput placeholder="Cari nomor transaksi atau pelanggan…" />
        </PageToolbar>
      </Suspense>

      {result.data.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Try adjusting filters or complete sales from the cashier."
        />
      ) : (
        <TransactionList transactions={result.data} shopName={shopName} />
      )}

      <Suspense fallback={null}>
        <PaginationControls page={result.page} totalPages={result.totalPages} />
      </Suspense>
    </PageShell>
  );
}
