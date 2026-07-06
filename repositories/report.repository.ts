import {
  endOfDay,
  endOfMonth,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/repositories/base.repository";
import { toNumber } from "@/lib/format";

const COMPLETED = {
  ...notDeleted,
  status: "COMPLETED" as const,
};

export type ReportDateRange = {
  from: Date;
  to: Date;
};

export function resolveReportDateRange(
  from?: string,
  to?: string,
): ReportDateRange {
  const now = new Date();
  const parsedFrom = from ? parseISO(from) : startOfMonth(now);
  const parsedTo = to ? parseISO(to) : endOfMonth(now);

  return {
    from: startOfDay(parsedFrom),
    to: endOfDay(parsedTo),
  };
}

export class ReportRepository {
  async getRevenueSummary(range: ReportDateRange) {
    const [aggregate, dailyTransactions] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          ...COMPLETED,
          paidAt: { gte: range.from, lte: range.to },
        },
        _sum: {
          total: true,
          subtotal: true,
          taxAmount: true,
          discountAmount: true,
        },
        _count: true,
      }),
      prisma.transaction.findMany({
        where: {
          ...COMPLETED,
          paidAt: { gte: range.from, lte: range.to },
        },
        select: { paidAt: true, total: true },
        orderBy: { paidAt: "asc" },
      }),
    ]);

    const revenueByDate = new Map<string, number>();
    for (const day of eachDayOfInterval({ start: range.from, end: range.to })) {
      revenueByDate.set(format(day, "yyyy-MM-dd"), 0);
    }
    for (const tx of dailyTransactions) {
      const key = format(tx.paidAt, "yyyy-MM-dd");
      revenueByDate.set(
        key,
        (revenueByDate.get(key) ?? 0) + toNumber(tx.total),
      );
    }

    return {
      totalRevenue: toNumber(aggregate._sum.total ?? 0),
      subtotal: toNumber(aggregate._sum.subtotal ?? 0),
      taxAmount: toNumber(aggregate._sum.taxAmount ?? 0),
      discountAmount: toNumber(aggregate._sum.discountAmount ?? 0),
      transactionCount: aggregate._count,
      daily: Array.from(revenueByDate.entries()).map(([date, revenue]) => ({
        date,
        revenue,
      })),
    };
  }

  async getTransactionsInRange(range: ReportDateRange) {
    return prisma.transaction.findMany({
      where: {
        ...COMPLETED,
        paidAt: { gte: range.from, lte: range.to },
      },
      include: {
        customer: true,
        barber: true,
        cashier: true,
        items: { where: notDeleted },
      },
      orderBy: { paidAt: "desc" },
    });
  }

  async getExpensesInRange(range: ReportDateRange) {
    return prisma.expense.findMany({
      where: {
        ...notDeleted,
        expenseDate: { gte: range.from, lte: range.to },
      },
      include: { recordedBy: true },
      orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }],
    });
  }
}

export const reportRepository = new ReportRepository();
