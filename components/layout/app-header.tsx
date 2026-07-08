"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { getNavContext } from "@/constants/navigation";
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
  const { title, group } = getNavContext(pathname);

  return (
    <header className="app-shell-header z-30 flex h-11 shrink-0 items-center justify-between gap-2 px-3 sm:px-4 lg:h-12 lg:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger
            className="app-touch-target inline-flex size-10 shrink-0 items-center justify-center rounded-lg border bg-card text-foreground shadow-sm lg:hidden"
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
            {group ?? "BarberPro"}
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
