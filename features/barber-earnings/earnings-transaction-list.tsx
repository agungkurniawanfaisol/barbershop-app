"use client";

import { formatCurrency, formatDateTime } from "@/lib/format";
import type { BarberEarningsTransactionDto } from "@/services/barber-earnings.service";
import { EmptyState } from "@/components/data/empty-state";
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

type EarningsTransactionListProps = {
  transactions: BarberEarningsTransactionDto[];
};

export function EarningsTransactionList({
  transactions,
}: EarningsTransactionListProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="Belum ada transaksi"
        description="Transaksi selesai dengan nama Anda sebagai barber akan muncul di sini."
      />
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Detail transaksi</h3>
      <ResponsiveTable
        table={
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Transaksi</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead className="text-right">Net layanan</TableHead>
                  <TableHead className="text-right">Komisi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">
                      {tx.transactionNumber}
                    </TableCell>
                    <TableCell>{formatDateTime(tx.paidAt)}</TableCell>
                    <TableCell>{tx.customerName ?? "—"}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(tx.netAmount)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium text-accent">
                      {formatCurrency(tx.commissionAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        }
        mobile={transactions.map((tx) => (
          <MobileDataCard key={tx.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="font-medium">{tx.transactionNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(tx.paidAt)}
                </p>
                <p className="text-sm">{tx.customerName ?? "Walk-in"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Komisi</p>
                <p className="font-semibold tabular-nums text-accent">
                  {formatCurrency(tx.commissionAmount)}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Net layanan: {formatCurrency(tx.netAmount)}
            </p>
          </MobileDataCard>
        ))}
      />
    </div>
  );
}
