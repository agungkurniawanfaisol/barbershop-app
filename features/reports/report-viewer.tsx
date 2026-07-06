"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import type { ReportDataDto } from "@/services/report.service";
import { getReportTitle, reportTypes } from "@/constants/reports";
import type { ReportType } from "@/schemas/report.schema";
import { formatCurrency, formatDate } from "@/lib/format";
import { exportReport } from "@/utils/export/report-export";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/forms/native-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  "profit-loss": "Profit & Loss",
  revenue: "Revenue",
  transactions: "Transactions",
  expenses: "Expenses",
};

type ReportViewerProps = {
  report: ReportDataDto;
};

export function ReportViewer({ report }: ReportViewerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function applyFilters(form: HTMLFormElement) {
    const data = new FormData(form);
    const params = new URLSearchParams();
    params.set("type", String(data.get("type") ?? "profit-loss"));
    const from = String(data.get("from") ?? "");
    const to = String(data.get("to") ?? "");
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Report Filters</CardTitle>
          <CardDescription>Select report type and date range</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={(e) => {
              e.preventDefault();
              applyFilters(e.currentTarget);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <NativeSelect
                id="report-type"
                name="type"
                defaultValue={report.type}
                disabled={isPending}
              >
                {reportTypes.map((type) => (
                  <option key={type} value={type}>
                    {REPORT_TYPE_LABELS[type]}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-from">From</Label>
              <Input
                id="report-from"
                name="from"
                type="date"
                defaultValue={report.range.from}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-to">To</Label>
              <Input
                id="report-to"
                name="to"
                type="date"
                defaultValue={report.range.to}
                disabled={isPending}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full" disabled={isPending}>
                Generate Report
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {getReportTitle(report.type)}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(report.range.from)} — {formatDate(report.range.to)}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button
            variant="outline"
            className="min-h-9 w-full sm:w-auto"
            onClick={() => exportReport(report, "csv")}
          >
            <Download className="size-4" aria-hidden />
            CSV
          </Button>
          <Button
            variant="outline"
            className="min-h-9 w-full sm:w-auto"
            onClick={() => exportReport(report, "xlsx")}
          >
            <FileSpreadsheet className="size-4" aria-hidden />
            Excel
          </Button>
          <Button
            variant="outline"
            className="min-h-9 w-full sm:w-auto"
            onClick={() => exportReport(report, "pdf")}
          >
            <FileText className="size-4" aria-hidden />
            PDF
          </Button>
        </div>
      </div>

      <ReportPreview report={report} />
    </div>
  );
}

function ReportPreview({ report }: { report: ReportDataDto }) {
  switch (report.type) {
    case "profit-loss":
      return <ProfitLossPreview report={report} />;
    case "revenue":
      return <RevenuePreview report={report} />;
    case "transactions":
      return <TransactionsPreview report={report} />;
    case "expenses":
      return <ExpensesPreview report={report} />;
  }
}

function ProfitLossPreview({
  report,
}: {
  report: Extract<ReportDataDto, { type: "profit-loss" }>;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Revenue</span>
            <span className="font-medium tabular-nums">
              {formatCurrency(report.revenue)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expenses</span>
            <span className="font-medium tabular-nums text-destructive">
              -{formatCurrency(report.expenses)}
            </span>
          </div>
          <div className="flex justify-between border-t pt-3 text-base font-semibold">
            <span>Net Profit</span>
            <span
              className={
                report.netProfit >= 0 ? "text-emerald-600" : "text-destructive"
              }
            >
              {formatCurrency(report.netProfit)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {report.transactionCount} transactions · {report.expenseCount}{" "}
            expense entries
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {report.expenseByCategory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No expenses in range.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.expenseByCategory.map((item) => (
                  <TableRow key={item.category}>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {item.count}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(item.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RevenuePreview({
  report,
}: {
  report: Extract<ReportDataDto, { type: "revenue" }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Daily Revenue</CardTitle>
        <CardDescription>
          {formatCurrency(report.totalRevenue)} total · {report.transactionCount}{" "}
          transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-96 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.daily.map((row) => (
              <TableRow key={row.date}>
                <TableCell>{formatDate(row.date)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(row.revenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TransactionsPreview({
  report,
}: {
  report: Extract<ReportDataDto, { type: "transactions" }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Transaction Details</CardTitle>
        <CardDescription>
          Total {formatCurrency(report.totalAmount)}
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No transactions in this period.
                </TableCell>
              </TableRow>
            ) : (
              report.rows.map((row) => (
                <TableRow key={row.transactionNumber + row.date}>
                  <TableCell className="font-mono text-xs">
                    {row.transactionNumber}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{row.date}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell>{row.paymentMethod}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(row.total)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ExpensesPreview({
  report,
}: {
  report: Extract<ReportDataDto, { type: "expenses" }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Expense Entries</CardTitle>
        <CardDescription>
          Total {formatCurrency(report.totalAmount)}
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Recorded By</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No expenses in this period.
                </TableCell>
              </TableRow>
            ) : (
              report.rows.map((row, index) => (
                <TableRow key={`${row.date}-${row.title}-${index}`}>
                  <TableCell>{formatDate(row.date)}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.recordedBy}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(row.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
