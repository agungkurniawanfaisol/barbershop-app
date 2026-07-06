import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function PageHeader({
  description,
  children,
  className,
}: PageHeaderProps) {
  if (!description && !children) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      {description && (
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
      {children && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
