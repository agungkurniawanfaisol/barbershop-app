"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import type { TransactionDto } from "@/services/transaction.service";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MobileDataCard,
  ResponsiveTable,
} from "@/components/data/responsive-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReceiptTemplate } from "@/components/receipt/receipt-template";

const PAYMENT_LABELS: Record<string, string> = {
  CASH: "Cash",
  QRIS: "QRIS",
  DEBIT: "Debit",
  TRANSFER: "Transfer",
};

type TransactionListProps = {
  transactions: TransactionDto[];
  shopName: string;
};

function TransactionMobileCard({
  tx,
  onView,
}: {
  tx: TransactionDto;
  onView: () => void;
}) {
  return (
    <MobileDataCard>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="truncate font-mono text-xs">{tx.transactionNumber}</p>
            <p className="font-medium">{tx.customerName ?? "Walk-in"}</p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(tx.paidAt)}
            </p>
            {tx.barberName ? (
              <p className="text-xs text-muted-foreground">
                Barber: {tx.barberName}
              </p>
            ) : null}
          </div>
          <div className="shrink-0 text-right">
            <p className="font-semibold tabular-nums">
              {formatCurrency(tx.total)}
            </p>
            <Badge variant="secondary" className="mt-1">
              {PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod}
            </Badge>
          </div>
        </div>
        <Button
          variant="outline"
          className="min-h-9 w-full"
          onClick={onView}
        >
          <Eye className="size-4" aria-hidden />
          Lihat struk
        </Button>
      </div>
    </MobileDataCard>
  );
}

export function TransactionList({
  transactions,
  shopName,
}: TransactionListProps) {
  const [selected, setSelected] = useState<TransactionDto | null>(null);

  return (
    <>
      <div className="rounded-xl border">
        <ResponsiveTable
          table={
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Barber</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs">
                      {tx.transactionNumber}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(tx.paidAt)}
                    </TableCell>
                    <TableCell>{tx.customerName ?? "Walk-in"}</TableCell>
                    <TableCell>{tx.barberName ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(tx.total)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 min-h-9 min-w-9"
                        onClick={() => setSelected(tx)}
                        aria-label={`View receipt ${tx.transactionNumber}`}
                      >
                        <Eye className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
          mobile={transactions.map((tx) => (
            <TransactionMobileCard
              key={tx.id}
              tx={tx}
              onView={() => setSelected(tx)}
            />
          ))}
          className="p-4 md:p-0"
        />
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Transaction Receipt</DialogTitle>
          </DialogHeader>
          {selected && (
            <ReceiptTemplate transaction={selected} shopName={shopName} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
