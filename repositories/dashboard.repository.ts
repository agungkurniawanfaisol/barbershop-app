import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
  eachDayOfInterval,
} from "date-fns";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/repositories/base.repository";
import { toNumber } from "@/lib/format";

const COMPLETED = {
  ...notDeleted,
  status: "COMPLETED" as const,
};

function dayRange(date: Date) {
  return {
    gte: startOfDay(date),
    lte: endOfDay(date),
  };
}

function monthRange(date: Date) {
  return {
    gte: startOfMonth(date),
    lte: endOfMonth(date),
  };
}

export class DashboardRepository {
  async getSummaryMetrics() {
    const now = new Date();
    const yesterday = subDays(now, 1);
    const lastMonth = subMonths(now, 1);

    const [
      dailyRevenue,
      yesterdayRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      transactionsToday,
      transactionsYesterday,
      totalCustomers,
      newCustomersThisMonth,
    ] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...COMPLETED, paidAt: dayRange(now) },
        _sum: { total: true },
      }),
      prisma.transaction.aggregate({
        where: { ...COMPLETED, paidAt: dayRange(yesterday) },
        _sum: { total: true },
      }),
      prisma.transaction.aggregate({
        where: { ...COMPLETED, paidAt: monthRange(now) },
        _sum: { total: true },
      }),
      prisma.transaction.aggregate({
        where: { ...COMPLETED, paidAt: monthRange(lastMonth) },
        _sum: { total: true },
      }),
      prisma.transaction.count({
        where: { ...COMPLETED, paidAt: dayRange(now) },
      }),
      prisma.transaction.count({
        where: { ...COMPLETED, paidAt: dayRange(yesterday) },
      }),
      prisma.customer.count({ where: notDeleted }),
      prisma.customer.count({
        where: {
          ...notDeleted,
          createdAt: monthRange(now),
        },
      }),
    ]);

    return {
      dailyRevenue: toNumber(dailyRevenue._sum.total ?? 0),
      yesterdayRevenue: toNumber(yesterdayRevenue._sum.total ?? 0),
      monthlyRevenue: toNumber(monthlyRevenue._sum.total ?? 0),
      lastMonthRevenue: toNumber(lastMonthRevenue._sum.total ?? 0),
      transactionsToday,
      transactionsYesterday,
      totalCustomers,
      newCustomersThisMonth,
    };
  }

  async getRevenueLast30Days() {
    const end = new Date();
    const start = startOfDay(subDays(end, 29));

    const rows = await prisma.$queryRaw<
      Array<{ date: Date; revenue: number | string }>
    >`
      SELECT DATE(paid_at) AS date, SUM(total)::float AS revenue
      FROM transactions
      WHERE status = 'COMPLETED'
        AND deleted_at IS NULL
        AND paid_at >= ${start}
        AND paid_at <= ${endOfDay(end)}
      GROUP BY DATE(paid_at)
      ORDER BY date ASC
    `;

    const revenueByDate = new Map<string, number>();
    for (const day of eachDayOfInterval({ start, end })) {
      revenueByDate.set(format(day, "yyyy-MM-dd"), 0);
    }

    for (const row of rows) {
      const key = format(row.date, "yyyy-MM-dd");
      revenueByDate.set(key, Number(row.revenue));
    }

    return Array.from(revenueByDate.entries()).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }

  async getPaymentBreakdown() {
    const start = startOfDay(subDays(new Date(), 29));
    const groups = await prisma.transaction.groupBy({
      by: ["paymentMethod"],
      where: {
        ...COMPLETED,
        paidAt: { gte: start },
      },
      _sum: { total: true },
      _count: true,
    });

    return groups.map((g) => ({
      method: g.paymentMethod,
      total: toNumber(g._sum.total ?? 0),
      count: g._count,
    }));
  }

  async getTopServices(limit = 5) {
    const start = startOfDay(subDays(new Date(), 29));

    const items = await prisma.transactionItem.groupBy({
      by: ["serviceName"],
      where: {
        ...notDeleted,
        transaction: {
          ...COMPLETED,
          paidAt: { gte: start },
        },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: limit,
    });

    return items.map((item) => ({
      name: item.serviceName,
      quantity: item._sum.quantity ?? 0,
    }));
  }

  async getRecentTransactions(limit = 8) {
    return prisma.transaction.findMany({
      where: COMPLETED,
      select: {
        id: true,
        transactionNumber: true,
        subtotal: true,
        discountAmount: true,
        discountPercent: true,
        taxAmount: true,
        taxPercent: true,
        total: true,
        paymentMethod: true,
        cashPaid: true,
        changeAmount: true,
        status: true,
        notes: true,
        whatsappSentAt: true,
        paidAt: true,
        customerId: true,
        barberId: true,
        customer: { select: { name: true, phone: true } },
        barber: { select: { name: true } },
        cashier: { select: { fullName: true } },
        items: {
          where: notDeleted,
          select: {
            id: true,
            serviceId: true,
            serviceName: true,
            price: true,
            quantity: true,
          },
        },
      },
      orderBy: { paidAt: "desc" },
      take: limit,
    });
  }
}

export const dashboardRepository = new DashboardRepository();
