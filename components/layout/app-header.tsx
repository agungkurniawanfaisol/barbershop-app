"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { getNavContext } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { ROLE_LABELS } from "@/constants/roles";
import type { SessionUser } from "@/types/auth";
import { cn } from "@/lib/utils";
import { AdminBreadcrumbs } from "@/components/layout/admin-breadcrumbs";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Badge } from "@/components/ui/badge";
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
  const { item } = getNavContext(pathname);
  const PageIcon = item?.icon ?? LayoutDashboard;

  return (
    <header className="app-shell-header z-30 shrink-0">
      <div className="flex h-11 items-center justify-between gap-2 px-3 sm:px-4 lg:h-12">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger
              className="app-touch-target inline-flex size-10 shrink-0 items-center justify-center rounded-lg border bg-card text-foreground shadow-sm transition-colors hover:bg-muted lg:hidden"
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

          <Link
            href={ROUTES.dashboard}
            className="hidden size-9 shrink-0 items-center justify-center rounded-lg border bg-primary/10 text-primary transition-colors hover:bg-primary/15 lg:flex"
            aria-label="Ke dashboard"
          >
            <PageIcon className="size-4" aria-hidden />
          </Link>

          <div className="hidden h-8 w-px shrink-0 bg-border lg:block" aria-hidden />

          <div className="min-w-0 flex-1">
            <AdminBreadcrumbs />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "hidden h-6 rounded-md px-2 text-[10px] font-semibold uppercase tracking-wide sm:inline-flex",
              "lg:hidden",
            )}
          >
            {ROLE_LABELS[user.role]}
          </Badge>
          <ThemeToggle />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
