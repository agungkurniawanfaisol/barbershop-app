import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DataTableCardProps = {
  children: ReactNode;
  className?: string;
};

export function DataTableCard({ children, className }: DataTableCardProps) {
  return (
    <div
      className={cn(
        "app-card -mx-px overflow-hidden sm:mx-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
