import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageToolbarProps = {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageToolbar({ children, actions, className }: PageToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="w-full min-w-0 sm:max-w-md">{children}</div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
