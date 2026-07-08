"use client";

import Link from "next/link";
import { ArrowLeft, Scissors } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthHeaderProps = {
  shopName: string;
};

export function AuthHeader({ shopName }: AuthHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={ROUTES.home}
          className="flex min-h-10 shrink-0 items-center gap-2.5 rounded-xl font-semibold tracking-tight transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/20 ring-1 ring-black/5">
            <Scissors className="size-4" aria-hidden />
          </span>
          <span className="font-display hidden text-lg sm:inline">
            {shopName}
          </span>
        </Link>

        <Link
          href={ROUTES.home}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "min-h-9 gap-1.5 border-border/80 bg-card/80 shadow-sm",
          )}
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">Kembali ke beranda</span>
          <span className="sm:hidden">Beranda</span>
        </Link>
      </div>
    </header>
  );
}
