import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_NAME } from "@/constants/routes";

export const metadata: Metadata = {
  title: `Dashboard | ${APP_NAME}`,
};

const statPlaceholders = [
  { label: "Daily Revenue", value: "—" },
  { label: "Monthly Revenue", value: "—" },
  { label: "Transactions Today", value: "—" },
  { label: "Total Customers", value: "—" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <LayoutDashboard className="size-5 text-primary" aria-hidden />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <p className="text-sm text-muted-foreground">
          Dashboard metrics will be populated in Phase 5.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statPlaceholders.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl tabular-nums">
                  {stat.value}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Chart</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-lg" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
