"use client";

import { format, parseISO } from "date-fns";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { TransactionChartPointDto } from "@/services/transaction.service";
import { formatCurrency } from "@/lib/format";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Pendapatan",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type TransactionChartProps = {
  data: TransactionChartPointDto[];
  rangeLabel: string;
};

export function TransactionChart({ data, rangeLabel }: TransactionChartProps) {
  const hasData = data.some((point) => point.revenue > 0);
  const totalRevenue = data.reduce((sum, point) => sum + point.revenue, 0);
  const totalCount = data.reduce((sum, point) => sum + point.count, 0);

  return (
    <div className="app-card overflow-hidden">
      <div className="flex flex-col gap-2 border-b px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:py-5">
        <div className="min-w-0">
          <h3 className="font-semibold tracking-tight">Transaction Revenue</h3>
          <p className="text-sm text-muted-foreground">{rangeLabel}</p>
        </div>
        {hasData ? (
          <div className="text-right">
            <p className="text-xl font-bold tabular-nums text-primary sm:text-2xl">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-sm text-muted-foreground">
              {totalCount} transaction{totalCount === 1 ? "" : "s"}
            </p>
          </div>
        ) : null}
      </div>
      <div className="p-3 sm:p-6">
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-56 w-full min-w-0 sm:h-72"
          >
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={48}
                interval="preserveStartEnd"
                tickFormatter={(value: string) =>
                  format(parseISO(value), "d/M")
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, _name, item) => (
                      <div className="flex flex-col gap-0.5">
                        <span>{formatCurrency(Number(value))}</span>
                        <span className="text-xs text-muted-foreground">
                          {item.payload.count} transaksi
                        </span>
                      </div>
                    )}
                    labelFormatter={(label) =>
                      format(parseISO(String(label)), "dd MMM yyyy")
                    }
                  />
                }
              />
              <Bar
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 text-center sm:h-72">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="size-6" aria-hidden />
            </div>
            <div className="px-4">
              <p className="font-medium">No transactions in this range</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Adjust filters or complete sales at the cashier.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
