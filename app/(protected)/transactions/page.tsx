import { Suspense } from "react";
import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { transactionService } from "@/services/transaction.service";
import { paginationSchema } from "@/schemas/common.schema";
import { TransactionList } from "@/features/transactions/transaction-list";
import { SearchInput } from "@/components/data/search-input";
import { PaginationControls } from "@/components/data/pagination-controls";
import { EmptyState } from "@/components/data/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Transactions" };

type TransactionsPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  await requireRole([
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.CASHIER,
  ]);

  const params = paginationSchema.parse(await searchParams);
  const result = await transactionService.list(params);
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "BarberPro";

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Transaction History
        </h2>
        <p className="text-muted-foreground">
          View and reprint past sales receipts.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-8 max-w-sm" />}>
        <SearchInput placeholder="Search by number or customer…" />
      </Suspense>

      {result.data.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Completed sales from the cashier will appear here."
        />
      ) : (
        <TransactionList transactions={result.data} shopName={shopName} />
      )}

      <Suspense fallback={null}>
        <PaginationControls page={result.page} totalPages={result.totalPages} />
      </Suspense>
    </div>
  );
}
