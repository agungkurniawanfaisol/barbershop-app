import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  /** Wider layout for POS / reports */
  wide?: boolean;
  /** Subtle enter animation for page content */
  animate?: boolean;
};

export function PageShell({
  children,
  className,
  wide,
  animate = true,
}: PageShellProps) {
  return (
    <div
      className={cn(
        "app-page w-full min-w-0",
        wide ? "max-w-[1600px]" : "max-w-7xl",
        animate && "app-page-enter",
        className,
      )}
    >
      {children}
    </div>
  );
}
