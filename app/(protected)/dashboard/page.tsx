import { requireSessionUser } from "@/lib/auth/session";
import { UserRole } from "@/constants/roles";
import { dashboardService } from "@/services/dashboard.service";
import { barberEarningsService } from "@/services/barber-earnings.service";
import { PageShell } from "@/components/layout/page-shell";
import { DashboardWelcome } from "@/features/dashboard/dashboard-welcome";
import { BarberDashboard } from "@/features/dashboard/barber-dashboard";
import { MetricCards } from "@/features/dashboard/metric-cards";
import { RevenueChart } from "@/features/dashboard/revenue-chart";
import { RecentTransactions } from "@/features/dashboard/recent-transactions";
import { DashboardSidebar } from "@/features/dashboard/dashboard-sidebar";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await requireSessionUser();

  if (user.role === UserRole.BARBER) {
    const summary = await barberEarningsService.getTodaySummary(user.id);
    return (
      <PageShell>
        <BarberDashboard user={user} summary={summary} />
      </PageShell>
    );
  }

  const data = await dashboardService.getDashboardData();

  return (
    <PageShell>
      <DashboardWelcome user={user} />
      <MetricCards metrics={data.metrics} />
      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="space-y-4 lg:col-span-2 lg:space-y-4">
          <RevenueChart data={data.revenueChart} />
          <RecentTransactions transactions={data.recentTransactions} />
        </div>
        <DashboardSidebar
          paymentBreakdown={data.paymentBreakdown}
          topServices={data.topServices}
        />
      </div>
    </PageShell>
  );
}
