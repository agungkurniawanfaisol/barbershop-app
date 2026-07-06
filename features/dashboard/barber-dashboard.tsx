import Link from "next/link";
import { ArrowRight, Scissors, Wallet } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/lib/format";
import type { SessionUser } from "@/types/auth";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BarberDashboardProps = {
  user: SessionUser;
  summary: {
    employeeName: string;
    haircutCount: number;
    commissionTotal: number;
    commissionRate: number;
  };
};

export function BarberDashboard({ user, summary }: BarberDashboardProps) {
  const firstName = user.fullName.split(" ")[0];

  return (
    <div className="space-y-4">
      <div className="app-card relative overflow-hidden p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-sm text-muted-foreground">Barber</p>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Selamat datang, {firstName}
            </h2>
            <p className="text-sm text-muted-foreground">
              Ringkasan performa Anda hari ini.
            </p>
          </div>
          <Link
            href={ROUTES.myEarnings}
            className={cn(
              buttonVariants({ size: "sm" }),
              "min-h-9 w-full bg-accent hover:bg-accent/90 sm:w-auto",
            )}
          >
            <Wallet className="size-4" aria-hidden />
            Lihat pendapatan
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Potong hari ini
            </CardTitle>
            <Scissors className="size-4 text-primary" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              {summary.haircutCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Komisi hari ini
            </CardTitle>
            <Wallet className="size-4 text-accent" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              {formatCurrency(summary.commissionTotal)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rate komisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tabular-nums">
              {summary.commissionRate}%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
