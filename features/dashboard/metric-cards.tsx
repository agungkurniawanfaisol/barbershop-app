import {
  Banknote,
  CalendarDays,
  Receipt,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { DashboardMetricDto } from "@/services/dashboard.service";
import { dashboardService } from "@/services/dashboard.service";
import { cn } from "@/lib/utils";

const METRIC_CONFIG: Record<
  string,
  { icon: typeof Banknote; accent: string; bg: string }
> = {
  "Daily Revenue": {
    icon: Banknote,
    accent: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  "Monthly Revenue": {
    icon: CalendarDays,
    accent: "text-primary",
    bg: "bg-primary/10",
  },
  "Transactions Today": {
    icon: Receipt,
    accent: "text-violet-600",
    bg: "bg-violet-500/10",
  },
  "Total Customers": {
    icon: Users,
    accent: "text-amber-600",
    bg: "bg-amber-500/10",
  },
};

type MetricCardsProps = {
  metrics: DashboardMetricDto[];
};

function formatMetricValue(metric: DashboardMetricDto): string {
  if (metric.format === "currency") {
    return formatCurrency(metric.value);
  }
  return metric.value.toLocaleString("id-ID");
}

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid max-[360px]:grid-cols-1 grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {metrics.map((metric) => {
        const config = METRIC_CONFIG[metric.label] ?? METRIC_CONFIG["Daily Revenue"]!;
        const Icon = config.icon;
        const change = dashboardService.getMetricChange(metric);
        const isPositive = change !== null && change >= 0;

        return (
          <div
            key={metric.label}
            className="app-card app-card-interactive p-3 sm:p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-1 sm:space-y-2">
                <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                  {metric.label}
                </p>
                <p className="text-base font-bold tracking-tight tabular-nums sm:text-xl lg:text-2xl">
                  {formatMetricValue(metric)}
                </p>
                {metric.changeType === "subtitle" && metric.subtitle ? (
                  <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
                ) : change !== null ? (
                  <p
                    className={cn(
                      "flex flex-wrap items-center gap-1 text-xs font-medium",
                      isPositive ? "text-emerald-600" : "text-destructive",
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="size-3.5 shrink-0" aria-hidden />
                    ) : (
                      <TrendingDown className="size-3.5 shrink-0" aria-hidden />
                    )}
                    <span className="tabular-nums">
                      {isPositive ? "+" : ""}
                      {change.toFixed(1)}%
                    </span>
                  </p>
                ) : null}
              </div>
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9 sm:rounded-lg",
                  config.bg,
                  config.accent,
                )}
              >
                <Icon className="size-3.5 sm:size-4" aria-hidden />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
