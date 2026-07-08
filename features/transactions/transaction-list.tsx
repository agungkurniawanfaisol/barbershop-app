"use client";

import { useState } from "react";
import { Eye, MessageCircle } from "lucide-react";
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
import { TransactionDetailDialog } from "@/features/transactions/transaction-detail-dialog";

import { PAYMENT_LABELS } from "@/constants/payments";

type TransactionListProps = {
  transactions: TransactionDto[];
  shopName: string;
};

function WhatsAppStatusBadge({ transaction }: { transaction: TransactionDto }) {
  if (!transaction.customerPhone) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  if (transaction.whatsappSentAt) {
    return (
      <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
        <MessageCircle className="mr-1 size-3" aria-hidden />
        Sent
      </Badge>
    );
  }

  return <Badge variant="outline">Not sent</Badge>;
}

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
          <div className="shrink-0 space-y-2 text-right">
            <p className="font-semibold tabular-nums">
              {formatCurrency(tx.total)}
            </p>
            <Badge variant="secondary">
              {PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod}
            </Badge>
            <div className="flex justify-end">
              <WhatsAppStatusBadge transaction={tx} />
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="min-h-9 w-full"
          onClick={onView}
        >
          <Eye className="size-4" aria-hidden />
          View details
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
                  <TableHead>WhatsApp</TableHead>
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
                    <TableCell>
                      <WhatsAppStatusBadge transaction={tx} />
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
                        aria-label={`View transaction ${tx.transactionNumber}`}
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

      <TransactionDetailDialog
        transaction={selected}
        shopName={shopName}
        onClose={() => setSelected(null)}
        onUpdated={setSelected}
      />
    </>
  );
}
