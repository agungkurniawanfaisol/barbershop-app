"use client";

import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { usePosStore } from "@/stores/pos.store";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function CartPanel() {
  const items = usePosStore((s) => s.items);
  const updateQuantity = usePosStore((s) => s.updateQuantity);
  const removeItem = usePosStore((s) => s.removeItem);
  const clearCart = usePosStore((s) => s.clearCart);
  const getTotals = usePosStore((s) => s.getTotals);

  const totals = getTotals();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[12rem] flex-col items-center justify-center rounded-2xl border border-dashed border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent p-8 text-center lg:min-h-0 lg:flex-1">
        <div className="relative">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600">
            <ShoppingCart className="size-8" aria-hidden />
          </div>
          <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
            0
          </span>
        </div>
        <p className="mt-5 text-base font-semibold">Keranjang kosong</p>
        <p className="mt-1.5 max-w-[16rem] text-sm text-muted-foreground">
          Pilih layanan di panel kiri — ketuk kartu untuk menambahkan
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ScrollArea className="min-h-0 flex-1 pr-1">
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li
              key={item.serviceId}
              className="group relative overflow-hidden rounded-xl border border-border/80 bg-gradient-to-r from-card to-muted/20 p-3 transition-all hover:border-amber-500/30 hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
                  <span className="text-sm font-bold tabular-nums">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{item.serviceName}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {formatCurrency(item.price)} / item
                  </p>
                  <p className="mt-1 text-sm font-bold tabular-nums text-primary">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 min-h-9 min-w-9 shrink-0 opacity-60 group-hover:opacity-100"
                  onClick={() => removeItem(item.serviceId)}
                  aria-label={`Hapus ${item.serviceName}`}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
              <div className="mt-3 flex items-center justify-end gap-1 rounded-lg border bg-card/80 p-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 min-h-9 min-w-9"
                  onClick={() =>
                    updateQuantity(item.serviceId, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="size-3.5" />
                </Button>
                <span className="w-8 text-center text-sm font-bold tabular-nums">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 min-h-9 min-w-9"
                  onClick={() =>
                    updateQuantity(item.serviceId, item.quantity + 1)
                  }
                  aria-label="Tambah jumlah"
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>

      <div className="mt-4 space-y-3">
        <div className="pos-total-card p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <div className="text-right">
              <Badge variant="secondary" className="mb-1 font-normal">
                {itemCount} item
              </Badge>
              <p className="text-lg font-bold tabular-nums">
                {formatCurrency(totals.subtotal)}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Diskon & pajak dihitung di panel checkout →
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={clearCart}
        >
          <Trash2 className="size-3.5" aria-hidden />
          Kosongkan keranjang
        </Button>
      </div>
    </div>
  );
}
