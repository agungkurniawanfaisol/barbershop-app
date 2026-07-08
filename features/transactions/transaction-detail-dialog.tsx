"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { MessageCircle, Printer } from "lucide-react";
import { toast } from "sonner";
import { markWhatsAppSentAction } from "@/actions/transaction.actions";
import type { TransactionDto } from "@/services/transaction.service";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { openWhatsAppThankYou } from "@/lib/whatsapp";
import { isSuccess } from "@/utils/result";
import { PAYMENT_LABELS } from "@/constants/payments";
import { ReceiptTemplate } from "@/components/receipt/receipt-template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type TransactionDetailDialogProps = {
  transaction: TransactionDto | null;
  shopName: string;
  onClose: () => void;
  onUpdated?: (transaction: TransactionDto) => void;
};

export function TransactionDetailDialog({
  transaction,
  shopName,
  onClose,
  onUpdated,
}: TransactionDetailDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!transaction) return null;

  const canSendWhatsApp = Boolean(
    transaction.customerPhone && transaction.customerName,
  );

  function handlePrint() {
    window.print();
  }

  function handleWhatsApp() {
    if (!transaction?.customerPhone || !transaction.customerName) {
      toast.error("Pelanggan tidak memiliki nomor telepon");
      return;
    }

    const opened = openWhatsAppThankYou(transaction.customerPhone, {
      customerName: transaction.customerName,
      shopName,
      transactionNumber: transaction.transactionNumber,
      total: transaction.total,
      serviceNames: transaction.items.map((item) => item.serviceName),
    });

    if (!opened) {
      toast.info(
        "Izinkan popup browser untuk mengirim pesan WhatsApp terima kasih.",
      );
      return;
    }

    startTransition(async () => {
      const result = await markWhatsAppSentAction({ id: transaction.id });
      if (isSuccess(result)) {
        onUpdated?.(result.data);
        toast.success(
          transaction.whatsappSentAt
            ? "WhatsApp dibuka untuk kirim ulang"
            : "WhatsApp terkirim",
        );
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto print:shadow-none">
        <DialogHeader className="print:hidden">
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            {transaction.transactionNumber} ·{" "}
            {formatDateTime(transaction.paidAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 print:hidden">
          <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Customer</p>
              <p className="font-medium">
                {transaction.customerName ?? "Walk-in"}
              </p>
              {transaction.customerPhone ? (
                <p className="text-xs text-muted-foreground">
                  {transaction.customerPhone}
                </p>
              ) : null}
            </div>
            <div>
              <p className="text-muted-foreground">Barber</p>
              <p className="font-medium">{transaction.barberName ?? "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cashier</p>
              <p className="font-medium">{transaction.cashierName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment</p>
              <Badge variant="secondary">
                {PAYMENT_LABELS[transaction.paymentMethod] ??
                  transaction.paymentMethod}
              </Badge>
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">WhatsApp Thank You</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.whatsappSentAt
                    ? `Sent ${formatDateTime(transaction.whatsappSentAt)}`
                    : canSendWhatsApp
                      ? "Not sent yet"
                      : "No customer phone on file"}
                </p>
              </div>
              {transaction.whatsappSentAt ? (
                <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                  Sent
                </Badge>
              ) : (
                <Badge variant="outline">Not sent</Badge>
              )}
            </div>
            {canSendWhatsApp ? (
              <Button
                className="mt-3 w-full"
                variant={transaction.whatsappSentAt ? "outline" : "default"}
                onClick={handleWhatsApp}
                disabled={isPending}
              >
                <MessageCircle className="size-4" aria-hidden />
                {transaction.whatsappSentAt
                  ? "Send again via WhatsApp"
                  : "Send WhatsApp thank you"}
              </Button>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Line items</p>
            <div className="space-y-2 rounded-xl border p-3 text-sm">
              {transaction.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3">
                  <span>
                    {item.serviceName}{" "}
                    <span className="text-muted-foreground">
                      ×{item.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {formatCurrency(item.lineTotal)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="tabular-nums">
                  {formatCurrency(transaction.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="print:hidden" />

        <ReceiptTemplate transaction={transaction} shopName={shopName} />

        <div className="flex gap-2 print:hidden">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1" onClick={handlePrint}>
            <Printer className="size-4" aria-hidden />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
