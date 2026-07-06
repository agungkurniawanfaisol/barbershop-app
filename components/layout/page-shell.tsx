import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  /** Wider layout for POS / reports */
  wide?: boolean;
};

export function PageShell({ children, className, wide }: PageShellProps) {
  return (
    <div
      className={cn(
        "app-page w-full min-w-0",
        wide ? "max-w-[1600px]" : "max-w-7xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
