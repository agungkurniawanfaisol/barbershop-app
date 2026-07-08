import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ResponsiveTableProps = {
  table: ReactNode;
  mobile: ReactNode;
  className?: string;
};

export function ResponsiveTable({
  table,
  mobile,
  className,
}: ResponsiveTableProps) {
  return (
    <div className={className}>
      <div className="app-table-dense hidden md:block">{table}</div>
      <div className="space-y-3 md:hidden">{mobile}</div>
    </div>
  );
}

type MobileDataCardProps = {
  children: ReactNode;
  className?: string;
};

export function MobileDataCard({ children, className }: MobileDataCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 shadow-sm transition-colors",
        className,
      )}
    >
      {children}
    </div>
  );
}
