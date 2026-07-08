"use client";

import dynamic from "next/dynamic";
import type { RevenueDataPointDto } from "@/services/dashboard.service";
import { Skeleton } from "@/components/ui/skeleton";

const RevenueChart = dynamic(
  () =>
    import("@/features/dashboard/revenue-chart").then((mod) => mod.RevenueChart),
  {
    loading: () => <Skeleton className="app-card h-72 w-full rounded-2xl" />,
  },
);

type RevenueChartLazyProps = {
  data: RevenueDataPointDto[];
};

export function RevenueChartLazy({ data }: RevenueChartLazyProps) {
  return <RevenueChart data={data} />;
}
