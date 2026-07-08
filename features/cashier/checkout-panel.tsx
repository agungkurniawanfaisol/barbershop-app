"use client";

import { useState, useTransition } from "react";
import { POS_PAYMENT_OPTIONS } from "@/features/cashier/payment-options";
import {
  Banknote,
  Loader2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { checkoutAction } from "@/actions/cashier.actions";
import type { PosBarberDto } from "@/stores/pos.store";
import { usePosStore } from "@/stores/pos.store";
import { formatCurrency } from "@/lib/format";
import { isSuccess } from "@/utils/result";
import { CustomerSearch } from "@/features/cashier/customer-search";
import { CurrencyInput } from "@/components/forms/currency-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/forms/native-select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type CheckoutPanelProps = {
  barbers: PosBarberDto[];
};

export function CheckoutPanel({ barbers }: CheckoutPanelProps) {
  const items = usePosStore((s) => s.items);
  const customer = usePosStore((s) => s.customer);
  const barberId = usePosStore((s) => s.barberId);
  const discountAmount = usePosStore((s) => s.discountAmount);
  const discountPercent = usePosStore((s) => s.discountPercent);
  const taxPercent = usePosStore((s) => s.taxPercent);
  const notes = usePosStore((s) => s.notes);
  const paymentMethod = usePosStore((s) => s.paymentMethod);
  const cashPaid = usePosStore((s) => s.cashPaid);
  const setBarberId = usePosStore((s) => s.setBarberId);
  const setDiscountAmount = usePosStore((s) => s.setDiscountAmount);
  const setDiscountPercent = usePosStore((s) => s.setDiscountPercent);
  const setNotes = usePosStore((s) => s.setNotes);
  const setPaymentMethod = usePosStore((s) => s.setPaymentMethod);
  const setCashPaid = usePosStore((s) => s.setCashPaid);
  const setLastTransaction = usePosStore((s) => s.setLastTransaction);
  const setReceiptOpen = usePosStore((s) => s.setReceiptOpen);
  const clearCart = usePosStore((s) => s.clearCart);
  const getTotals = usePosStore((s) => s.getTotals);

  const [discountMode, setDiscountMode] = useState<"percent" | "fixed">(
    discountPercent > 0 ? "percent" : "fixed",
  );
  const [showExtras, setShowExtras] = useState(false);
  const [isCheckingOut, startCheckout] = useTransition();

  const totals = getTotals();
  const hasItems = items.length > 0;
  const cashInsufficient =
    paymentMethod === "CASH" && cashPaid < totals.total;

  function handleCheckout() {
    if (!hasItems) {
      toast.error("Tambahkan minimal satu layanan");
      return;
    }
    if (paymentMethod === "CASH" && cashPaid < totals.total) {
      toast.error("Uang diterima kurang dari total");
      return;
    }

    startCheckout(async () => {
      const result = await checkoutAction({
        items,
        customerId: customer?.id ?? null,
        barberId,
        discountAmount,
        discountPercent,
        taxPercent,
        notes: notes || null,
        paymentMethod,
        cashPaid: paymentMethod === "CASH" ? cashPaid : null,
      });

      if (isSuccess(result)) {
        setLastTransaction(result.data);
        setReceiptOpen(true);
        clearCart();
        toast.success("Pembayaran berhasil");
        return;
      }
      toast.error(result.error);
    });
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <CustomerSearch />

      <div className="space-y-2">
        <Label htmlFor="barber" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Barber
        </Label>
        <NativeSelect
          id="barber"
          value={barberId ?? ""}
          onChange={(e) => setBarberId(e.target.value || null)}
          className="h-11 rounded-xl"
        >
          <option value="">Pilih barber</option>
          {barbers.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Metode Pembayaran
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {POS_PAYMENT_OPTIONS.map(({ value, label, icon: Icon }) => {
            const selected = paymentMethod === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setPaymentMethod(value)}
                className={cn(
                  "pos-payment-tile",
                  selected && "pos-payment-tile-active",
                )}
              >
                <Icon
                  className={cn("size-5", selected && "text-primary")}
                  aria-hidden
                />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {paymentMethod === "CASH" && (
        <div className="space-y-2">
          <Label htmlFor="checkout-cash-paid">Uang diterima</Label>
          <CurrencyInput
            id="checkout-cash-paid"
            value={cashPaid}
            onValueChange={setCashPaid}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowExtras((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-dashed px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-muted/30 hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="size-4" aria-hidden />
          Diskon & catatan
          {(discountAmount > 0 || discountPercent > 0 || notes) && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              Aktif
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            showExtras && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {showExtras && (
        <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
          <div className="space-y-2">
            <Label>Diskon</Label>
            <Tabs
              value={discountMode}
              onValueChange={(v) => setDiscountMode(v as "percent" | "fixed")}
            >
              <TabsList className="h-auto w-full">
                <TabsTrigger value="percent" className="min-h-9 flex-1">
                  Persen (%)
                </TabsTrigger>
                <TabsTrigger value="fixed" className="min-h-9 flex-1">
                  Nominal (Rp)
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {discountMode === "percent" ? (
              <Input
                type="number"
                min={0}
                max={100}
                value={discountPercent || ""}
                onChange={(e) =>
                  setDiscountPercent(Number(e.target.value) || 0)
                }
                placeholder="0"
                className="h-11 rounded-xl"
              />
            ) : (
              <Input
                type="number"
                min={0}
                value={discountAmount || ""}
                onChange={(e) =>
                  setDiscountAmount(Number(e.target.value) || 0)
                }
                placeholder="0"
                className="h-11 rounded-xl"
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opsional…"
              className="rounded-xl"
            />
          </div>
        </div>
      )}

      <div className="mt-auto space-y-3">
        <div className="pos-total-card space-y-2.5 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums">{formatCurrency(totals.subtotal)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-destructive">
              <span>Diskon</span>
              <span className="tabular-nums">
                -{formatCurrency(totals.discountAmount)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pajak ({taxPercent}%)</span>
            <span className="tabular-nums">
              {formatCurrency(totals.taxAmount)}
            </span>
          </div>
          <div className="flex items-end justify-between border-t border-border/60 pt-3">
            <span className="text-base font-semibold">Total Bayar</span>
            <span className="text-2xl font-bold tabular-nums text-primary">
              {formatCurrency(totals.total)}
            </span>
          </div>
        </div>

        <Button
          size="lg"
          className="pos-pay-button h-14 w-full flex-col gap-0.5 text-base font-bold sm:flex-row sm:gap-2"
          onClick={handleCheckout}
          disabled={isCheckingOut || !hasItems || cashInsufficient}
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden />
              Memproses pembayaran…
            </>
          ) : (
            <>
              <span className="flex items-center gap-2">
                <Banknote className="size-5 shrink-0" aria-hidden />
                Bayar
              </span>
              <span className="truncate text-sm font-bold tabular-nums sm:text-base">
                {formatCurrency(totals.total)}
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
