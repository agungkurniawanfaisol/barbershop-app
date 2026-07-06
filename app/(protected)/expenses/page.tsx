import { Suspense } from "react";
import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { expenseService } from "@/services/expense.service";
import { paginationSchema } from "@/schemas/common.schema";
import { ExpenseManager } from "@/features/expenses/expense-manager";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { SearchInput } from "@/components/data/search-input";
import { PaginationControls } from "@/components/data/pagination-controls";
import { EmptyState } from "@/components/data/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Expenses" };

type ExpensesPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function ExpensesPage({
  searchParams,
}: ExpensesPageProps) {
  await requireRole([UserRole.ADMIN, UserRole.MANAGER]);

  const raw = await searchParams;
  const params = {
    ...paginationSchema.parse(raw),
    category: raw.category,
  };
  const result = await expenseService.list(params);

  return (
    <PageShell>
      <PageHeader description="Catat dan kelola biaya operasional toko." />

      <Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
        <PageToolbar>
          <SearchInput placeholder="Cari judul atau deskripsi…" />
        </PageToolbar>
      </Suspense>

      <ExpenseManager expenses={result.data} />

      {result.data.length === 0 && (
        <EmptyState
          title="Belum ada pengeluaran"
          description="Catat sewa, perlengkapan, gaji, dan biaya operasional lainnya."
        />
      )}

      <Suspense fallback={null}>
        <PaginationControls page={result.page} totalPages={result.totalPages} />
      </Suspense>
    </PageShell>
  );
}
