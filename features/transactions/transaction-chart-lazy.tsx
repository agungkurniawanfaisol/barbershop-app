"use client";

import dynamic from "next/dynamic";
import type { TransactionChartPointDto } from "@/services/transaction.service";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionChart = dynamic(
  () =>
    import("@/features/transactions/transaction-chart").then(
      (mod) => mod.TransactionChart,
    ),
  {
    loading: () => <Skeleton className="app-card h-72 w-full rounded-2xl" />,
  },
);

type TransactionChartLazyProps = {
  data: TransactionChartPointDto[];
  rangeLabel: string;
};

export function TransactionChartLazy({
  data,
  rangeLabel,
}: TransactionChartLazyProps) {
  return <TransactionChart data={data} rangeLabel={rangeLabel} />;
}
