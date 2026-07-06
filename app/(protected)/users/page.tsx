import { Suspense } from "react";
import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { userService } from "@/services/user.service";
import { paginationSchema } from "@/schemas/common.schema";
import { UserManager } from "@/features/users/user-manager";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { SearchInput } from "@/components/data/search-input";
import { PaginationControls } from "@/components/data/pagination-controls";
import { EmptyState } from "@/components/data/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Users" };

type UsersPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const currentUser = await requireRole([UserRole.ADMIN]);
  const params = paginationSchema.parse(await searchParams);
  const result = await userService.list(params);

  return (
    <PageShell>
      <PageHeader description="Undang staf, atur peran, dan kelola akses akun." />

      <Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
        <PageToolbar>
          <SearchInput placeholder="Cari nama atau email…" />
        </PageToolbar>
      </Suspense>

      <UserManager users={result.data} currentUserId={currentUser.id} />

      {result.data.length === 0 && (
        <EmptyState
          title="Tidak ada pengguna"
          description="Undang anggota tim pertama Anda untuk memulai."
        />
      )}

      <Suspense fallback={null}>
        <PaginationControls page={result.page} totalPages={result.totalPages} />
      </Suspense>
    </PageShell>
  );
}
