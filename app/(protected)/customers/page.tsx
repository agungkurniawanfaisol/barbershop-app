import { Suspense } from "react";
import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { customerService } from "@/services/customer.service";
import { paginationSchema } from "@/schemas/common.schema";
import { CustomerManager } from "@/features/customers/customer-manager";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { SearchInput } from "@/components/data/search-input";
import { PaginationControls } from "@/components/data/pagination-controls";
import { EmptyState } from "@/components/data/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Customers" };

type CustomersPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  await requireRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]);

  const params = paginationSchema.parse(await searchParams);
  const [result, barbers] = await Promise.all([
    customerService.list(params),
    customerService.getBarberOptions(),
  ]);

  return (
    <PageShell>
      <PageHeader description="Kelola profil pelanggan, loyalitas, dan preferensi." />

      <Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
        <PageToolbar>
          <SearchInput placeholder="Cari nama atau nomor telepon…" />
        </PageToolbar>
      </Suspense>

      {result.data.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Add your first customer to start tracking visits and loyalty points."
        />
      ) : (
        <CustomerManager
          customers={result.data}
          page={result.page}
          totalPages={result.totalPages}
          total={result.total}
          barbers={barbers}
        />
      )}

      <Suspense fallback={null}>
        <PaginationControls page={result.page} totalPages={result.totalPages} />
      </Suspense>
    </PageShell>
  );
}
