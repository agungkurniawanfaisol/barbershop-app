import { formatCurrency, formatDateTime } from "@/lib/format";
import type { TransactionDto } from "@/services/transaction.service";

import { PAYMENT_LABELS } from "@/constants/payments";

type ReceiptTemplateProps = {
  transaction: TransactionDto;
  shopName: string;
  className?: string;
};

export function ReceiptTemplate({
  transaction,
  shopName,
  className,
}: ReceiptTemplateProps) {
  return (
    <div className={className} id="receipt-print-area">
      <div className="space-y-4 text-sm">
        <div className="text-center">
          <h2 className="text-lg font-bold">{shopName}</h2>
          <p className="text-muted-foreground">Official Receipt</p>
          <p className="mt-1 font-mono text-xs">{transaction.transactionNumber}</p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(transaction.paidAt)}
          </p>
        </div>

        <div className="border-t border-dashed pt-3">
          {transaction.customerName && (
            <p>
              <span className="text-muted-foreground">Customer: </span>
              {transaction.customerName}
            </p>
          )}
          {transaction.barberName && (
            <p>
              <span className="text-muted-foreground">Barber: </span>
              {transaction.barberName}
            </p>
          )}
          <p>
            <span className="text-muted-foreground">Cashier: </span>
            {transaction.cashierName}
          </p>
        </div>

        <div className="space-y-2 border-t border-dashed pt-3">
          {transaction.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-2">
              <span>
                {item.serviceName}{" "}
                <span className="text-muted-foreground">×{item.quantity}</span>
              </span>
              <span className="shrink-0 tabular-nums">
                {formatCurrency(item.lineTotal)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-1 border-t border-dashed pt-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums">
              {formatCurrency(transaction.subtotal)}
            </span>
          </div>
          {transaction.discountAmount > 0 && (
            <div className="flex justify-between text-destructive">
              <span>
                Discount
                {transaction.discountPercent > 0
                  ? ` (${transaction.discountPercent}%)`
                  : ""}
              </span>
              <span className="tabular-nums">
                -{formatCurrency(transaction.discountAmount)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Tax ({transaction.taxPercent}%)
            </span>
            <span className="tabular-nums">
              {formatCurrency(transaction.taxAmount)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="tabular-nums">
              {formatCurrency(transaction.total)}
            </span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-muted-foreground">Payment</span>
            <span>{PAYMENT_LABELS[transaction.paymentMethod] ?? transaction.paymentMethod}</span>
          </div>
          {transaction.paymentMethod === "CASH" &&
            transaction.cashPaid != null && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bayar</span>
                  <span className="tabular-nums">
                    {formatCurrency(transaction.cashPaid)}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Kembalian</span>
                  <span className="tabular-nums">
                    {formatCurrency(transaction.changeAmount ?? 0)}
                  </span>
                </div>
              </>
            )}
        </div>

        {transaction.notes && (
          <div className="border-t border-dashed pt-3 text-xs text-muted-foreground">
            Note: {transaction.notes}
          </div>
        )}

        <p className="border-t border-dashed pt-3 text-center text-xs text-muted-foreground">
          Thank you for your visit!
        </p>
      </div>
    </div>
  );
}
