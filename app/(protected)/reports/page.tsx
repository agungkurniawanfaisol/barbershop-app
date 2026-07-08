import { Suspense } from "react";
import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { reportService } from "@/services/report.service";
import { reportFilterSchema } from "@/schemas/report.schema";
import { ReportViewer } from "@/features/reports/report-viewer";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";
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
    <PageShell wide>
      <PageHeader description="Buat analitik dan ekspor ke CSV, Excel, atau PDF." />

      <Suspense fallback={<Skeleton className="h-48 w-full rounded-2xl" />}>
        <ReportViewer report={report} />
      </Suspense>
    </PageShell>
  );
}
