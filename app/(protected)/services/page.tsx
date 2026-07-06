import { Suspense } from "react";
import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { serviceService } from "@/services/service.service";
import { paginationSchema } from "@/schemas/common.schema";
import { ServiceManager } from "@/features/services/service-manager";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { SearchInput } from "@/components/data/search-input";
import { PaginationControls } from "@/components/data/pagination-controls";
import { EmptyState } from "@/components/data/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Services" };

type ServicesPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function ServicesPage({
  searchParams,
}: ServicesPageProps) {
  await requireRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]);

  const raw = await searchParams;
  const params = paginationSchema.parse(raw);
  const [servicesResult, categories] = await Promise.all([
    serviceService.listServices(params),
    serviceService.listCategories(),
  ]);

  const isEmpty =
    servicesResult.data.length === 0 && categories.length === 0;

  return (
    <PageShell>
      <PageHeader description="Kelola katalog layanan dan kategori barbershop." />

      <Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
        <PageToolbar>
          <SearchInput placeholder="Cari layanan…" />
        </PageToolbar>
      </Suspense>

      {isEmpty ? (
        <EmptyState
          title="Belum ada layanan"
          description="Buat kategori dan layanan untuk menu barbershop Anda."
        />
      ) : (
        <ServiceManager
          services={servicesResult.data}
          categories={categories}
          total={servicesResult.total}
        />
      )}

      <Suspense fallback={null}>
        <PaginationControls
          page={servicesResult.page}
          totalPages={servicesResult.totalPages}
        />
      </Suspense>
    </PageShell>
  );
}
