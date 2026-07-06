"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type PosMobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function PosMobileDrawer({
  open,
  onClose,
  title = "Pesanan",
  children,
}: PosMobileDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
        aria-label="Tutup pesanan"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-2xl bg-card shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-border lg:hidden" aria-hidden />
            <p id="pos-order-title" className="text-sm font-semibold">
              {title}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
