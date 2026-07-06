"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/navigation";
import type { SessionUser } from "@/types/auth";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type AppHeaderProps = {
  user: SessionUser;
};

export function AppHeader({ user }: AppHeaderProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const title =
    NAV_ITEMS.find(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`),
    )?.title ?? "BarberPro POS";

  return (
    <header className="app-shell-header z-30 flex h-11 shrink-0 items-center justify-between gap-2 px-3 sm:px-4 lg:h-12 lg:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger
            className="inline-flex size-9 min-h-9 min-w-9 shrink-0 items-center justify-center rounded-lg border bg-card text-foreground shadow-sm lg:hidden"
            aria-label="Buka menu navigasi"
          >
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(280px,85vw)] border-0 p-0">
            <SheetTitle className="sr-only">Navigasi</SheetTitle>
            <AppSidebar
              user={user}
              className="h-full rounded-none border-0"
              collapsible={false}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <div className="min-w-0">
          <p className="hidden text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:block">
            Halaman
          </p>
          <h1 className="truncate text-sm font-semibold leading-tight tracking-tight sm:text-base">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
