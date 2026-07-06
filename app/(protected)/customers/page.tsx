import { Suspense } from "react";
import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { customerService } from "@/services/customer.service";
import { paginationSchema } from "@/schemas/common.schema";
import { CustomerManager } from "@/features/customers/customer-manager";
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
    <div className="mx-auto max-w-7xl space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground">
          Manage customer profiles, loyalty, and preferences.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-8 max-w-sm" />}>
        <SearchInput placeholder="Search by name or phone…" />
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
    </div>
  );
}
