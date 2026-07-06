import { formatCurrency } from "@/lib/format";
import type { ReportDataDto } from "@/services/report.service";
import { getReportTitle } from "@/constants/reports";
import { buildCsv, downloadCsv, slugifyFilename } from "@/utils/export/csv";
import { downloadXlsx } from "@/utils/export/excel";
import { downloadPdf } from "@/utils/export/pdf";

export type ExportFormat = "csv" | "xlsx" | "pdf";

function baseFilename(report: ReportDataDto): string {
  const title = slugifyFilename(getReportTitle(report.type));
  return `barberpro-${title}-${report.range.from}-to-${report.range.to}`;
}

function profitLossExport(report: Extract<ReportDataDto, { type: "profit-loss" }>) {
  const summaryRows: (string | number)[][] = [
    ["Revenue", report.revenue],
    ["Expenses", report.expenses],
    ["Net Profit", report.netProfit],
    ["Transactions", report.transactionCount],
    ["Expense Entries", report.expenseCount],
  ];

  const categoryHeaders = ["Category", "Count", "Total"];
  const categoryRows = report.expenseByCategory.map((item) => [
    item.label,
    item.count,
    item.total,
  ]);

  return {
    headers: ["Metric", "Value"],
    rows: summaryRows,
    extra: { headers: categoryHeaders, rows: categoryRows },
    summary: [
      `Revenue: ${formatCurrency(report.revenue)}`,
      `Expenses: ${formatCurrency(report.expenses)}`,
      `Net Profit: ${formatCurrency(report.netProfit)}`,
    ],
  };
}

function revenueExport(report: Extract<ReportDataDto, { type: "revenue" }>) {
  return {
    headers: ["Date", "Revenue"],
    rows: report.daily.map((row) => [row.date, row.revenue]),
    summary: [
      `Total Revenue: ${formatCurrency(report.totalRevenue)}`,
      `Transactions: ${report.transactionCount}`,
      `Tax: ${formatCurrency(report.taxAmount)}`,
      `Discounts: ${formatCurrency(report.discountAmount)}`,
    ],
  };
}

function transactionsExport(
  report: Extract<ReportDataDto, { type: "transactions" }>,
) {
  return {
    headers: [
      "Number",
      "Date",
      "Customer",
      "Barber",
      "Payment",
      "Subtotal",
      "Discount",
      "Tax",
      "Total",
    ],
    rows: report.rows.map((row) => [
      row.transactionNumber,
      row.date,
      row.customer,
      row.barber,
      row.paymentMethod,
      row.subtotal,
      row.discount,
      row.tax,
      row.total,
    ]),
    summary: [`Total: ${formatCurrency(report.totalAmount)}`],
  };
}

function expensesExport(report: Extract<ReportDataDto, { type: "expenses" }>) {
  return {
    headers: ["Date", "Title", "Category", "Amount", "Recorded By", "Description"],
    rows: report.rows.map((row) => [
      row.date,
      row.title,
      row.category,
      row.amount,
      row.recordedBy,
      row.description,
    ]),
    summary: [`Total: ${formatCurrency(report.totalAmount)}`],
  };
}

function getExportData(report: ReportDataDto) {
  switch (report.type) {
    case "profit-loss":
      return profitLossExport(report);
    case "revenue":
      return revenueExport(report);
    case "transactions":
      return transactionsExport(report);
    case "expenses":
      return expensesExport(report);
  }
}

export function exportReport(report: ReportDataDto, format: ExportFormat): void {
  const filename = baseFilename(report);
  const title = getReportTitle(report.type);
  const subtitle = `${report.range.from} to ${report.range.to}`;
  const data = getExportData(report);

  if (format === "csv") {
    if (report.type === "profit-loss") {
      const plData = profitLossExport(report);
      const csv =
        buildCsv(plData.headers, plData.rows) +
        `\n\n${buildCsv(plData.extra.headers, plData.extra.rows)}`;
      downloadCsv(`${filename}.csv`, csv);
      return;
    }

    let csv = buildCsv(data.headers, data.rows);
    downloadCsv(`${filename}.csv`, csv);
    return;
  }

  if (format === "xlsx") {
    downloadXlsx(`${filename}.xlsx`, title.slice(0, 31), data.headers, data.rows);
    return;
  }

  downloadPdf(`${filename}.pdf`, {
    title,
    subtitle,
    headers: data.headers,
    rows: data.rows,
    summary: data.summary,
  });
}
