import { reportTypes, type ReportType } from "@/schemas/report.schema";

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  "profit-loss": "Profit & Loss",
  revenue: "Revenue Report",
  transactions: "Transactions Report",
  expenses: "Expenses Report",
};

export function getReportTitle(type: ReportType): string {
  return REPORT_TYPE_LABELS[type];
}

export { reportTypes };
