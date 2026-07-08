import { UserRole } from "@/constants/roles";
import { requireRole, requireSessionUser } from "@/lib/auth/session";
import { barberEarningsService } from "@/services/barber-earnings.service";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";
import { EarningsPeriodTabs } from "@/features/barber-earnings/earnings-period-tabs";
import { EarningsSummaryCards } from "@/features/barber-earnings/earnings-summary-cards";
import { EarningsTransactionList } from "@/features/barber-earnings/earnings-transaction-list";

export const metadata = {
  title: "Pendapatan Saya",
};

type MyEarningsPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function MyEarningsPage({
  searchParams,
}: MyEarningsPageProps) {
  await requireRole([UserRole.BARBER]);
  const user = await requireSessionUser();
  const params = await searchParams;
  const data = await barberEarningsService.getPageData(user.id, params.period);

  return (
    <PageShell>
      <PageHeader
        description={`Ringkasan potong dan komisi untuk ${data.employeeName} — ${data.rangeLabel.toLowerCase()}.`}
      />

      <div className="space-y-4">
        <EarningsPeriodTabs period={data.period} />
        <EarningsSummaryCards data={data} />
        <EarningsTransactionList transactions={data.transactions} />
      </div>
    </PageShell>
  );
}
