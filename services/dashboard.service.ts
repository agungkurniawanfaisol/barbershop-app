import { dashboardRepository } from "@/repositories/dashboard.repository";
import type { TransactionDto } from "@/services/transaction.service";
import { toNumber } from "@/lib/format";

export type DashboardMetricDto = {
  label: string;
  value: number;
  previousValue?: number;
  format: "currency" | "number";
  changeType?: "percent" | "subtitle";
  subtitle?: string;
};

export type RevenueDataPointDto = {
  date: string;
  label: string;
  revenue: number;
};

export type PaymentBreakdownDto = {
  method: string;
  total: number;
  count: number;
};

export type TopServiceDto = {
  name: string;
  quantity: number;
};

export type DashboardDataDto = {
  metrics: DashboardMetricDto[];
  revenueChart: RevenueDataPointDto[];
  paymentBreakdown: PaymentBreakdownDto[];
  topServices: TopServiceDto[];
  recentTransactions: TransactionDto[];
};

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function serializeRecentTransaction(
  tx: Awaited<
    ReturnType<typeof dashboardRepository.getRecentTransactions>
  >[number],
): TransactionDto {
  return {
    id: tx.id,
    transactionNumber: tx.transactionNumber,
    customerId: tx.customerId,
    customerName: tx.customer?.name ?? null,
    customerPhone: tx.customer?.phone ?? null,
    barberId: tx.barberId,
    barberName: tx.barber?.name ?? null,
    cashierName: tx.cashier.fullName,
    subtotal: toNumber(tx.subtotal),
    discountAmount: toNumber(tx.discountAmount),
    discountPercent: toNumber(tx.discountPercent),
    taxAmount: toNumber(tx.taxAmount),
    taxPercent: toNumber(tx.taxPercent),
    total: toNumber(tx.total),
    paymentMethod: tx.paymentMethod,
    status: tx.status,
    notes: tx.notes,
    paidAt: tx.paidAt.toISOString(),
    items: tx.items.map((item) => ({
      id: item.id,
      serviceId: item.serviceId,
      serviceName: item.serviceName,
      price: toNumber(item.price),
      quantity: item.quantity,
      lineTotal: toNumber(item.price) * item.quantity,
    })),
  };
}

export class DashboardService {
  async getDashboardData(): Promise<DashboardDataDto> {
    const [summary, revenueChart, paymentBreakdown, topServices, recent] =
      await Promise.all([
        dashboardRepository.getSummaryMetrics(),
        dashboardRepository.getRevenueLast30Days(),
        dashboardRepository.getPaymentBreakdown(),
        dashboardRepository.getTopServices(5),
        dashboardRepository.getRecentTransactions(8),
      ]);

    const metrics: DashboardMetricDto[] = [
      {
        label: "Daily Revenue",
        value: summary.dailyRevenue,
        previousValue: summary.yesterdayRevenue,
        format: "currency",
      },
      {
        label: "Monthly Revenue",
        value: summary.monthlyRevenue,
        previousValue: summary.lastMonthRevenue,
        format: "currency",
      },
      {
        label: "Transactions Today",
        value: summary.transactionsToday,
        previousValue: summary.transactionsYesterday,
        format: "number",
      },
      {
        label: "Total Customers",
        value: summary.totalCustomers,
        format: "number",
        changeType: "subtitle",
        subtitle: `+${summary.newCustomersThisMonth} this month`,
      },
    ];

    return {
      metrics,
      revenueChart: revenueChart.map((point) => ({
        ...point,
        label: point.date.slice(5),
      })),
      paymentBreakdown,
      topServices,
      recentTransactions: recent.map(serializeRecentTransaction),
    };
  }

  getMetricChange(metric: DashboardMetricDto): number | null {
    if (metric.changeType === "subtitle" || metric.previousValue === undefined) {
      return null;
    }
    return percentChange(metric.value, metric.previousValue);
  }
}

export const dashboardService = new DashboardService();
