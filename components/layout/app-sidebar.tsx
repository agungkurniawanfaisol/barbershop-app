"use client";

import Link from "next/link";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Scissors,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { getNavItemsForRole, type NavItem } from "@/constants/navigation";
import { APP_NAME, ROUTES } from "@/constants/routes";
import { ROLE_LABELS, UserRole } from "@/constants/roles";
import type { SessionUser } from "@/types/auth";
import { useUiStore } from "@/stores/ui.store";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavGroup = {
  label: string;
  hrefs: string[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Utama",
    hrefs: [ROUTES.dashboard, ROUTES.cashier, ROUTES.myEarnings],
  },
  {
    label: "Operasional",
    hrefs: [
      ROUTES.customers,
      ROUTES.employees,
      ROUTES.services,
      ROUTES.transactions,
    ],
  },
  {
    label: "Keuangan",
    hrefs: [ROUTES.expenses, ROUTES.reports],
  },
  {
    label: "Administrasi",
    hrefs: [ROUTES.users, ROUTES.audit, ROUTES.settings],
  },
];

function groupNavItems(items: NavItem[]): { label: string; items: NavItem[] }[] {
  const hrefSet = new Set(items.map((item) => item.href));

  return NAV_GROUPS.map((group) => ({
    label: group.label,
    items: group.hrefs
      .filter((href) => hrefSet.has(href))
      .map((href) => items.find((item) => item.href === href))
      .filter((item): item is NavItem => item !== undefined),
  })).filter((group) => group.items.length > 0);
}

type SidebarNavItemProps = {
  item: NavItem;
  groupLabel: string;
  isActive: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
};

function SidebarNavItem({
  item,
  groupLabel,
  isActive,
  collapsed,
  onNavigate,
}: SidebarNavItemProps) {
  const Icon = item.icon;

  const linkClassName = cn(
    "app-nav-item",
    collapsed && "app-nav-item-collapsed",
    isActive && "app-nav-item-active",
  );

  if (!collapsed) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={linkClassName}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="app-nav-icon">
          <Icon className="size-3.5" aria-hidden />
        </span>
        <span className="truncate">{item.title}</span>
      </Link>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={item.href}
            onClick={onNavigate}
            className={linkClassName}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.title}
          />
        }
      >
        <span className="app-nav-icon">
          <Icon className="size-3.5" aria-hidden />
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={14}
        className="app-sidebar-hover-card border-0 bg-transparent p-0 shadow-none"
      >
        <div className="app-sidebar-hover-card-inner">
          <p className="font-semibold text-white">{item.title}</p>
          <p className="text-[11px] text-slate-400">{groupLabel}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

type AppSidebarProps = {
  user: SessionUser;
  className?: string;
  onNavigate?: () => void;
  collapsible?: boolean;
};

export function AppSidebar({
  user,
  className,
  onNavigate,
  collapsible = true,
}: AppSidebarProps) {
  const pathname = usePathname();
  const role = user.role as UserRole;
  const items = getNavItemsForRole(role);
  const groups = groupNavItems(items);
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const collapsed = collapsible && !sidebarOpen;

  const sidebar = (
    <aside
      className={cn(
        "app-shell-sidebar relative flex flex-col overflow-hidden transition-[width] duration-300 ease-in-out",
        collapsed ? "w-[4.25rem]" : "w-[230px]",
        collapsible && "rounded-xl shadow-lg shadow-black/20",
        className,
      )}
    >
      <div
        className="app-shell-sidebar-pattern pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />

      <div
        className={cn(
          "relative flex h-11 shrink-0 items-center lg:h-12",
          collapsed ? "justify-center px-2" : "gap-2.5 px-3",
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
          <Scissors className="size-4" aria-hidden />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="font-display truncate text-sm font-semibold leading-tight text-white">
              {APP_NAME}
            </p>
            <p className="truncate text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Point of Sale
            </p>
          </div>
        )}
        {collapsible && !collapsed && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-slate-400 hover:bg-white/10 hover:text-white"
            onClick={toggleSidebar}
            aria-label="Ciutkan sidebar"
          >
            <PanelLeftClose className="size-4" />
          </Button>
        )}
      </div>

      <ScrollArea
        className={cn(
          "relative min-h-0 flex-1 py-2",
          collapsed ? "px-2" : "px-3",
        )}
      >
        <nav
          className={cn(
            "flex flex-col pb-2",
            collapsed ? "gap-4" : "gap-5",
          )}
          aria-label="Main navigation"
        >
          {groups.map((group, groupIndex) => (
            <div
              key={group.label}
              className={cn(collapsed && groupIndex > 0 && "pt-1")}
            >
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  {group.label}
                </p>
              )}
              {collapsed && groupIndex > 0 && (
                <div
                  className="mx-auto mb-3 h-px w-8 bg-white/10"
                  aria-hidden
                />
              )}
              <div
                className={cn(
                  "flex flex-col",
                  collapsed ? "gap-2" : "gap-0.5",
                )}
              >
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <SidebarNavItem
                      key={item.href}
                      item={item}
                      groupLabel={group.label}
                      isActive={isActive}
                      collapsed={collapsed}
                      onNavigate={onNavigate}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div
        className={cn(
          "relative shrink-0 border-t border-white/8 py-3",
          collapsed ? "px-2" : "px-4",
        )}
      >
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="flex size-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-slate-200 ring-2 ring-white/10" />
                }
              >
                {user.fullName.charAt(0).toUpperCase()}
              </TooltipTrigger>
              <TooltipContent
                side="right"
                sideOffset={14}
                className="app-sidebar-hover-card border-0 bg-transparent p-0 shadow-none"
              >
                <div className="app-sidebar-hover-card-inner">
                  <p className="font-semibold text-white">{user.fullName}</p>
                  <p className="truncate text-[11px] text-slate-400">
                    {user.email}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
                    {ROLE_LABELS[role]}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-slate-400 hover:bg-white/10 hover:text-white"
              onClick={toggleSidebar}
              aria-label="Perluas sidebar"
            >
              <PanelLeftOpen className="size-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-200">
                {user.fullName}
              </p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
            <span className="shrink-0 rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
              {ROLE_LABELS[role]}
            </span>
          </div>
        )}
      </div>
    </aside>
  );

  if (!collapsed) return sidebar;

  return (
    <TooltipProvider delay={120}>{sidebar}</TooltipProvider>
  );
}
