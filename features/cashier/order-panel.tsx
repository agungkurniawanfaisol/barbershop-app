"use client";

import { useEffect, useState, useTransition } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Banknote,
  Check,
  ChevronDown,
  CreditCard,
  Loader2,
  Minus,
  Plus,
  QrCode,
  Receipt,
  ShoppingBag,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { checkoutAction } from "@/actions/cashier.actions";
import type { PosBarberDto } from "@/stores/pos.store";
import { usePosStore } from "@/stores/pos.store";
import { formatCurrency } from "@/lib/format";
import { openWhatsAppThankYou } from "@/lib/whatsapp";
import { isSuccess } from "@/utils/result";
import { CustomerSearch } from "@/features/cashier/customer-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/forms/native-select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "QRIS", label: "QRIS", icon: QrCode },
  { value: "DEBIT", label: "Debit", icon: CreditCard },
  { value: "TRANSFER", label: "Transfer", icon: ArrowRightLeft },
] as const;

const WIZARD_STEPS = [
  { id: "cart", label: "Pesanan" },
  { id: "pay", label: "Bayar" },
] as const;

type OrderPanelProps = {
  barbers: PosBarberDto[];
  shopName: string;
  className?: string;
};

function WizardStepper({
  step,
  maxStep,
}: {
  step: number;
  maxStep: number;
}) {
  return (
    <div className="pos-wizard-stepper" aria-label="Langkah checkout">
      {WIZARD_STEPS.map((s, index) => {
        const done = index < step;
        const active = index === step;
        const reachable = index <= maxStep;
        return (
          <div
            key={s.id}
            className={cn(
              "pos-wizard-step",
              active && "pos-wizard-step-active",
              done && "pos-wizard-step-done",
              !reachable && "opacity-40",
            )}
          >
            <span className="pos-wizard-step-dot">
              {done ? <Check className="size-3" aria-hidden /> : index + 1}
            </span>
            <span className="pos-wizard-step-label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function OrderTotals({ compact }: { compact?: boolean }) {
  const taxPercent = usePosStore((s) => s.taxPercent);
  const getTotals = usePosStore((s) => s.getTotals);
  const totals = getTotals();

  return (
    <div className={cn("pos-order-totals", compact && "text-xs")}>
      <div className="pos-order-total-row">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="tabular-nums">{formatCurrency(totals.subtotal)}</span>
      </div>
      {totals.discountAmount > 0 && (
        <div className="pos-order-total-row text-destructive">
          <span>Diskon</span>
          <span className="tabular-nums">
            -{formatCurrency(totals.discountAmount)}
          </span>
        </div>
      )}
      <div className="pos-order-total-row">
        <span className="text-muted-foreground">Pajak ({taxPercent}%)</span>
        <span className="tabular-nums">{formatCurrency(totals.taxAmount)}</span>
      </div>
      <div className="pos-order-total-row pos-order-total-grand">
        <span className="font-semibold">Total</span>
        <span
          className={cn(
            "font-bold tabular-nums text-primary",
            compact ? "text-sm" : "text-sm",
          )}
        >
          {formatCurrency(totals.total)}
        </span>
      </div>
    </div>
  );
}

export function OrderPanel({ barbers, shopName, className }: OrderPanelProps) {
  const customer = usePosStore((s) => s.customer);
  const walkIn = usePosStore((s) => s.walkIn);
  const items = usePosStore((s) => s.items);
  const barberId = usePosStore((s) => s.barberId);
  const discountAmount = usePosStore((s) => s.discountAmount);
  const discountPercent = usePosStore((s) => s.discountPercent);
  const notes = usePosStore((s) => s.notes);
  const paymentMethod = usePosStore((s) => s.paymentMethod);
  const setWalkIn = usePosStore((s) => s.setWalkIn);
  const setBarberId = usePosStore((s) => s.setBarberId);
  const setDiscountAmount = usePosStore((s) => s.setDiscountAmount);
  const setDiscountPercent = usePosStore((s) => s.setDiscountPercent);
  const setNotes = usePosStore((s) => s.setNotes);
  const setPaymentMethod = usePosStore((s) => s.setPaymentMethod);
  const setLastTransaction = usePosStore((s) => s.setLastTransaction);
  const setReceiptOpen = usePosStore((s) => s.setReceiptOpen);
  const clearCart = usePosStore((s) => s.clearCart);
  const updateQuantity = usePosStore((s) => s.updateQuantity);
  const removeItem = usePosStore((s) => s.removeItem);
  const getTotals = usePosStore((s) => s.getTotals);

  const [step, setStep] = useState(0);
  const [discountMode, setDiscountMode] = useState<"percent" | "fixed">(
    discountPercent > 0 ? "percent" : "fixed",
  );
  const [showExtras, setShowExtras] = useState(false);
  const [isCheckingOut, startCheckout] = useTransition();

  const totals = getTotals();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const hasItems = items.length > 0;
  const customerReady = Boolean(customer) || walkIn;
  const currentStep = WIZARD_STEPS[step]?.id ?? "cart";

  useEffect(() => {
    if (!hasItems) setStep(0);
  }, [hasItems]);

  function goNext() {
    if (currentStep === "cart" && !hasItems) {
      toast.error("Tambahkan minimal satu layanan");
      return;
    }
    if (currentStep === "cart" && !customerReady) {
      toast.error("Cari pelanggan (nama/HP), tambah baru, atau pilih walk-in");
      return;
    }
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleCheckout() {
    if (!hasItems) {
      toast.error("Tambahkan minimal satu layanan");
      return;
    }
    if (!customerReady) {
      toast.error("Pilih pelanggan atau walk-in terlebih dahulu");
      setStep(0);
      return;
    }

    startCheckout(async () => {
      const result = await checkoutAction({
        items,
        customerId: customer?.id ?? null,
        barberId,
        discountAmount,
        discountPercent,
        taxPercent: usePosStore.getState().taxPercent,
        notes: notes || null,
        paymentMethod,
      });

      if (isSuccess(result)) {
        setLastTransaction(result.data);
        setReceiptOpen(true);
        clearCart();
        setStep(0);
        toast.success("Pembayaran berhasil");

        const phone = result.data.customerPhone;
        const name = result.data.customerName;
        if (phone && name) {
          const opened = openWhatsAppThankYou(phone, {
            customerName: name,
            shopName,
            transactionNumber: result.data.transactionNumber,
            total: result.data.total,
            serviceNames: result.data.items.map((item) => item.serviceName),
          });
          if (!opened) {
            toast.info(
              "Izinkan popup browser untuk mengirim pesan WhatsApp terima kasih.",
            );
          }
        }
        return;
      }
      toast.error(result.error);
    });
  }

  return (
    <aside
      className={cn(
        "pos-order-panel flex min-h-0 flex-col overflow-hidden",
        className,
      )}
    >
      <header className="pos-order-header shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Receipt className="size-3.5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xs font-semibold tracking-tight">Pesanan</h2>
            <p className="truncate text-[10px] text-muted-foreground">
              {hasItems
                ? `${itemCount} layanan · ${formatCurrency(totals.total)}`
                : "Belum ada layanan dipilih"}
            </p>
          </div>
          {hasItems && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => {
                clearCart();
                setStep(0);
              }}
            >
              <Trash2 className="size-3.5" aria-hidden />
            </Button>
          )}
        </div>
        {hasItems && <WizardStepper step={step} maxStep={step} />}
      </header>

      <div className="pos-scroll min-h-0 flex-1">
        <div className="space-y-3 p-3 pb-4">
          {!hasItems ? (
            <div className="pos-order-empty">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="size-6" aria-hidden />
              </div>
              <p className="mt-3 text-sm font-semibold">Mulai pesanan</p>
              <p className="mt-1 max-w-[14rem] text-xs text-muted-foreground">
                Ketuk layanan di katalog untuk menambahkan ke pesanan
              </p>
            </div>
          ) : currentStep === "cart" ? (
            <>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.serviceId} className="pos-order-item">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{item.serviceName}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {formatCurrency(item.price)} / item
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.serviceId)}
                        aria-label={`Hapus ${item.serviceName}`}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-md border bg-background/80 p-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() =>
                            updateQuantity(item.serviceId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Kurangi"
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="w-7 text-center text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() =>
                            updateQuantity(item.serviceId, item.quantity + 1)
                          }
                          aria-label="Tambah"
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                      <p className="shrink-0 text-xs font-semibold tabular-nums text-primary">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pos-order-divider" />

              <CustomerSearch compact />

              {!customer && !walkIn && (
                <button
                  type="button"
                  onClick={() => setWalkIn(true)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-foreground"
                >
                  <UserRound className="size-3.5" aria-hidden />
                  Walk-in — tanpa data pelanggan
                </button>
              )}

              {walkIn && !customer && (
                <div className="flex items-center justify-between gap-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">
                    Mode walk-in aktif
                  </span>
                  <button
                    type="button"
                    className="font-medium text-primary"
                    onClick={() => setWalkIn(false)}
                  >
                    Ubah
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border bg-muted/20 p-3 text-sm">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pelanggan
                </p>
                <p className="mt-1 font-medium">
                  {customer
                    ? customer.name
                    : walkIn
                      ? "Walk-in"
                      : "Belum dipilih"}
                </p>
                {customer && (
                  <p className="text-xs text-muted-foreground">
                    {customer.phone}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="barber"
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Barber
                </Label>
                <NativeSelect
                  id="barber"
                  value={barberId ?? ""}
                  onChange={(e) => setBarberId(e.target.value || null)}
                  className="h-9 w-full rounded-lg"
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
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pembayaran
                </Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PAYMENT_METHODS.map(({ value, label, icon: Icon }) => {
                    const selected = paymentMethod === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPaymentMethod(value)}
                        className={cn(
                          "pos-payment-chip",
                          selected && "pos-payment-chip-active",
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowExtras((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl border border-dashed px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:bg-muted/30 hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="size-3.5" aria-hidden />
                  Diskon & catatan
                  {(discountAmount > 0 || discountPercent > 0 || notes) && (
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
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
                <div className="space-y-3 rounded-xl border bg-muted/20 p-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Diskon</Label>
                    <Tabs
                      value={discountMode}
                      onValueChange={(v) =>
                        setDiscountMode(v as "percent" | "fixed")
                      }
                    >
                      <TabsList className="h-auto w-full">
                        <TabsTrigger
                          value="percent"
                          className="min-h-9 flex-1 text-xs"
                        >
                          %
                        </TabsTrigger>
                        <TabsTrigger
                          value="fixed"
                          className="min-h-9 flex-1 text-xs"
                        >
                          Rp
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
                        className="h-10 rounded-xl"
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
                        className="h-10 rounded-xl"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-xs">
                      Catatan
                    </Label>
                    <Textarea
                      id="notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Opsional…"
                      className="rounded-xl text-sm"
                    />
                  </div>
                </div>
              )}

              <OrderTotals />
            </div>
          )}

          {hasItems && (
            <div className="pos-order-actions">
              {currentStep !== "pay" && (
                <div className="rounded-lg border bg-muted/30 px-2.5 py-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-muted-foreground">Total sementara</span>
                    <span className="shrink-0 font-semibold tabular-nums text-primary">
                      {formatCurrency(totals.total)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 flex-1 gap-1"
                    onClick={goBack}
                    disabled={isCheckingOut}
                  >
                    <ArrowLeft className="size-3.5" aria-hidden />
                    Kembali
                  </Button>
                )}

                {currentStep === "pay" ? (
                  <Button
                    size="sm"
                    className="pos-pay-button h-9 flex-1 gap-1.5 text-sm font-semibold"
                    onClick={handleCheckout}
                    disabled={isCheckingOut || !customerReady}
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                        Memproses…
                      </>
                    ) : (
                      <>
                        <Banknote className="size-4" aria-hidden />
                        Bayar {formatCurrency(totals.total)}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    className="h-9 flex-1 gap-1 text-sm font-medium"
                    onClick={goNext}
                  >
                    Lanjut
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
