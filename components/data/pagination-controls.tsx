"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationControlsProps = {
  page: number;
  totalPages: number;
};

export function PaginationControls({
  page,
  totalPages,
}: PaginationControlsProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function hrefForPage(target: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(target));
    return `?${params.toString()}`;
  }

  return (
    <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Link
          href={hrefForPage(page - 1)}
          aria-disabled={page <= 1}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "min-h-9 flex-1 sm:flex-none",
            page <= 1 && "pointer-events-none opacity-50",
          )}
        >
          Previous
        </Link>
        <Link
          href={hrefForPage(page + 1)}
          aria-disabled={page >= totalPages}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "min-h-9 flex-1 sm:flex-none",
            page >= totalPages && "pointer-events-none opacity-50",
          )}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
