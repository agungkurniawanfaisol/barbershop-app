import { format } from "date-fns";
import { expenseRepository } from "@/repositories/expense.repository";
import {
  reportRepository,
  resolveReportDateRange,
  type ReportDateRange,
} from "@/repositories/report.repository";
import { EXPENSE_CATEGORY_LABELS } from "@/constants/expenses";
import { getReportTitle } from "@/constants/reports";
import type { ReportFilterInput, ReportType } from "@/schemas/report.schema";
import { formatCurrency, toNumber } from "@/lib/format";

export type ProfitLossReportDto = {
  type: "profit-loss";
  range: { from: string; to: string };
  revenue: number;
  expenses: number;
  netProfit: number;
  transactionCount: number;
  expenseCount: number;
  expenseByCategory: Array<{
    category: string;
    label: string;
    total: number;
    count: number;
  }>;
};

export type RevenueReportDto = {
  type: "revenue";
  range: { from: string; to: string };
  totalRevenue: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  transactionCount: number;
  daily: Array<{ date: string; revenue: number }>;
};

export type TransactionsReportDto = {
  type: "transactions";
  range: { from: string; to: string };
  rows: Array<{
    transactionNumber: string;
    date: string;
    customer: string;
    barber: string;
    paymentMethod: string;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  }>;
  totalAmount: number;
};

export type ExpensesReportDto = {
  type: "expenses";
  range: { from: string; to: string };
  rows: Array<{
    date: string;
    title: string;
    category: string;
    amount: number;
    recordedBy: string;
    description: string;
  }>;
  totalAmount: number;
};

export type ReportDataDto =
  | ProfitLossReportDto
  | RevenueReportDto
  | TransactionsReportDto
  | ExpensesReportDto;

const PAYMENT_LABELS: Record<string, string> = {
  CASH: "Cash",
  QRIS: "QRIS",
  DEBIT: "Debit",
  TRANSFER: "Transfer",
};

function serializeRange(range: ReportDateRange) {
  return {
    from: format(range.from, "yyyy-MM-dd"),
    to: format(range.to, "yyyy-MM-dd"),
  };
}

export class ReportService {
  async generate(filter: ReportFilterInput): Promise<ReportDataDto> {
    const range = resolveReportDateRange(filter.from, filter.to);

    switch (filter.type) {
      case "profit-loss":
        return this.buildProfitLoss(range);
      case "revenue":
        return this.buildRevenue(range);
      case "transactions":
        return this.buildTransactions(range);
      case "expenses":
        return this.buildExpenses(range);
      default:
        return this.buildProfitLoss(range);
    }
  }

  private async buildProfitLoss(
    range: ReportDateRange,
  ): Promise<ProfitLossReportDto> {
    const [revenue, expenseSum, expenseByCategory] = await Promise.all([
      reportRepository.getRevenueSummary(range),
      expenseRepository.sumInRange(range.from, range.to),
      expenseRepository.sumByCategoryInRange(range.from, range.to),
    ]);

    const expenses = toNumber(expenseSum.total ?? 0);

    return {
      type: "profit-loss",
      range: serializeRange(range),
      revenue: revenue.totalRevenue,
      expenses,
      netProfit: revenue.totalRevenue - expenses,
      transactionCount: revenue.transactionCount,
      expenseCount: expenseSum.count,
      expenseByCategory: expenseByCategory.map((item) => ({
        category: item.category,
        label:
          EXPENSE_CATEGORY_LABELS[
            item.category as keyof typeof EXPENSE_CATEGORY_LABELS
          ] ?? item.category,
        total: toNumber(item._sum.amount ?? 0),
        count: item._count,
      })),
    };
  }

  private async buildRevenue(range: ReportDateRange): Promise<RevenueReportDto> {
    const summary = await reportRepository.getRevenueSummary(range);
    return {
      type: "revenue",
      range: serializeRange(range),
      totalRevenue: summary.totalRevenue,
      subtotal: summary.subtotal,
      taxAmount: summary.taxAmount,
      discountAmount: summary.discountAmount,
      transactionCount: summary.transactionCount,
      daily: summary.daily,
    };
  }

  private async buildTransactions(
    range: ReportDateRange,
  ): Promise<TransactionsReportDto> {
    const transactions = await reportRepository.getTransactionsInRange(range);
    const rows = transactions.map((tx) => ({
      transactionNumber: tx.transactionNumber,
      date: format(tx.paidAt, "yyyy-MM-dd HH:mm"),
      customer: tx.customer?.name ?? "Walk-in",
      barber: tx.barber?.name ?? "—",
      paymentMethod: PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod,
      subtotal: toNumber(tx.subtotal),
      discount: toNumber(tx.discountAmount),
      tax: toNumber(tx.taxAmount),
      total: toNumber(tx.total),
    }));

    return {
      type: "transactions",
      range: serializeRange(range),
      rows,
      totalAmount: rows.reduce((sum, row) => sum + row.total, 0),
    };
  }

  private async buildExpenses(range: ReportDateRange): Promise<ExpensesReportDto> {
    const expenses = await reportRepository.getExpensesInRange(range);
    const rows = expenses.map((expense) => ({
      date: format(expense.expenseDate, "yyyy-MM-dd"),
      title: expense.title,
      category:
        EXPENSE_CATEGORY_LABELS[
          expense.category as keyof typeof EXPENSE_CATEGORY_LABELS
        ] ?? expense.category,
      amount: toNumber(expense.amount),
      recordedBy: expense.recordedBy.fullName,
      description: expense.description ?? "",
    }));

    return {
      type: "expenses",
      range: serializeRange(range),
      rows,
      totalAmount: rows.reduce((sum, row) => sum + row.amount, 0),
    };
  }

  getReportTitle(type: ReportType): string {
    return getReportTitle(type);
  }
}

export const reportService = new ReportService();
