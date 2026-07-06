import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  UserCog,
  Scissors,
  Receipt,
  Wallet,
  Banknote,
  BarChart3,
  Settings,
  Shield,
  ClipboardList,
} from "lucide-react";
import { UserRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[] | "*";
};

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
    roles: "*",
  },
  {
    title: "Cashier",
    href: ROUTES.cashier,
    icon: ShoppingCart,
    roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER],
  },
  {
    title: "Customers",
    href: ROUTES.customers,
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER],
  },
  {
    title: "Employees",
    href: ROUTES.employees,
    icon: UserCog,
    roles: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    title: "Services",
    href: ROUTES.services,
    icon: Scissors,
    roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER],
  },
  {
    title: "Transactions",
    href: ROUTES.transactions,
    icon: Receipt,
    roles: [
      UserRole.ADMIN,
      UserRole.MANAGER,
      UserRole.CASHIER,
    ],
  },
  {
    title: "Pendapatan Saya",
    href: ROUTES.myEarnings,
    icon: Wallet,
    roles: [UserRole.BARBER],
  },
  {
    title: "Expenses",
    href: ROUTES.expenses,
    icon: Banknote,
    roles: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    title: "Reports",
    href: ROUTES.reports,
    icon: BarChart3,
    roles: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    title: "Users",
    href: ROUTES.users,
    icon: Shield,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Audit Log",
    href: ROUTES.audit,
    icon: ClipboardList,
    roles: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    title: "Settings",
    href: ROUTES.settings,
    icon: Settings,
    roles: [UserRole.ADMIN, UserRole.MANAGER],
  },
];

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => {
    if (item.roles === "*") return true;
    return item.roles.includes(role);
  });
}
