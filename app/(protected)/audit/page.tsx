import { Suspense } from "react";
import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { auditService } from "@/services/audit.service";
import { paginationSchema } from "@/schemas/common.schema";
import { AuditLogList } from "@/features/audit/audit-log-list";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { SearchInput } from "@/components/data/search-input";
import { PaginationControls } from "@/components/data/pagination-controls";
import { EmptyState } from "@/components/data/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Audit Log" };

type AuditPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function AuditPage({ searchParams }: AuditPageProps) {
  await requireRole([UserRole.ADMIN, UserRole.MANAGER]);

  const params = paginationSchema.parse(await searchParams);
  const result = await auditService.list(params);

  return (
    <PageShell>
      <PageHeader description="Lacak perubahan pada pengaturan, pengguna, dan data sistem." />

      <Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
        <PageToolbar>
          <SearchInput placeholder="Cari pengguna, aksi, atau entitas…" />
        </PageToolbar>
      </Suspense>

      {result.data.length === 0 ? (
        <EmptyState
          title="Belum ada entri audit"
          description="Perubahan sistem akan dicatat otomatis di sini."
        />
      ) : (
        <AuditLogList logs={result.data} />
      )}

      <Suspense fallback={null}>
        <PaginationControls page={result.page} totalPages={result.totalPages} />
      </Suspense>
    </PageShell>
  );
}
