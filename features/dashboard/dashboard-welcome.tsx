import Link from "next/link";
import { ArrowRight, ShoppingCart, TrendingUp } from "lucide-react";
import { ROLE_LABELS } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types/auth";

type DashboardWelcomeProps = {
  user: SessionUser;
};

export function DashboardWelcome({ user }: DashboardWelcomeProps) {
  const firstName = user.fullName.split(" ")[0];

  return (
    <div className="app-card relative overflow-hidden p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">
            {ROLE_LABELS[user.role]}
          </p>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Selamat datang, {firstName}
          </h2>
          <p className="text-sm text-muted-foreground">
            Pantau pendapatan, transaksi, dan tren harian toko Anda.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <Link
            href={ROUTES.cashier}
            className={cn(
              buttonVariants({ size: "sm" }),
              "min-h-9 w-full bg-accent hover:bg-accent/90 sm:w-auto",
            )}
          >
            <ShoppingCart className="size-4" aria-hidden />
            Buka Kasir
          </Link>
          <Link
            href={ROUTES.transactions}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "min-h-9 w-full sm:w-auto",
            )}
          >
            <TrendingUp className="size-4" aria-hidden />
            Transaksi
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
