import { Suspense } from "react";
import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { employeeService } from "@/services/employee.service";
import { settingService } from "@/services/setting.service";
import { paginationSchema } from "@/schemas/common.schema";
import { EmployeeManager } from "@/features/employees/employee-manager";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { SearchInput } from "@/components/data/search-input";
import { PaginationControls } from "@/components/data/pagination-controls";
import { EmptyState } from "@/components/data/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Employees" };

type EmployeesPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function EmployeesPage({
  searchParams,
}: EmployeesPageProps) {
  await requireRole([UserRole.ADMIN, UserRole.MANAGER]);

  const params = paginationSchema.parse(await searchParams);
  const [result, settings] = await Promise.all([
    employeeService.list(params),
    settingService.getShopSettings(),
  ]);

  const linkableUsersByEmployee: Record<
    string,
    Awaited<ReturnType<typeof employeeService.listBarberUsersForLink>>
  > = {};
  await Promise.all(
    result.data.map(async (employee) => {
      linkableUsersByEmployee[employee.id] =
        await employeeService.listBarberUsersForLink(employee.id);
    }),
  );

  return (
    <PageShell>
      <PageHeader description="Kelola staf, peran, komisi, dan gaji." />

      <Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
        <PageToolbar>
          <SearchInput placeholder="Cari nama, email, atau telepon…" />
        </PageToolbar>
      </Suspense>

      {result.data.length === 0 ? (
        <EmptyState
          title="No employees yet"
          description="Add barbers, cashiers, and managers to your team."
        />
      ) : (
        <EmployeeManager
          employees={result.data}
          total={result.total}
          linkableUsersByEmployee={linkableUsersByEmployee}
          defaultCommissionRate={settings.defaultCommissionRate}
        />
      )}

      <Suspense fallback={null}>
        <PaginationControls page={result.page} totalPages={result.totalPages} />
      </Suspense>
    </PageShell>
  );
}
