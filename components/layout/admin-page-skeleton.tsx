import { Skeleton } from "@/components/ui/skeleton";
import { PageShell } from "@/components/layout/page-shell";

export function AdminPageSkeleton() {
  return (
    <PageShell animate={false}>
      <Skeleton className="h-5 w-full max-w-xl" />
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="app-card space-y-3 p-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-5/6" />
      </div>
    </PageShell>
  );
}
