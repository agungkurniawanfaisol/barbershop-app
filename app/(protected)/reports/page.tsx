import { Suspense } from "react";
import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { reportService } from "@/services/report.service";
import { reportFilterSchema } from "@/schemas/report.schema";
import { ReportViewer } from "@/features/reports/report-viewer";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Reports" };

type ReportsPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  await requireRole([UserRole.ADMIN, UserRole.MANAGER]);

  const filter = reportFilterSchema.parse(await searchParams);
  const report = await reportService.generate(filter);

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Generate analytics and export to CSV, Excel, or PDF.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <ReportViewer report={report} />
      </Suspense>
    </div>
  );
}
