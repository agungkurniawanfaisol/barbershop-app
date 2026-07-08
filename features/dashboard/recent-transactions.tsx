import Link from "next/link";
import { ArrowRight, Receipt } from "lucide-react";
import type { TransactionDto } from "@/services/transaction.service";
import { ROUTES } from "@/constants/routes";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

import { PAYMENT_LABELS } from "@/constants/payments";

type RecentTransactionsProps = {
  transactions: TransactionDto[];
};

function TransactionMobileCard({ tx }: { tx: TransactionDto }) {
  return (
    <MobileDataCard>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate font-mono text-xs text-muted-foreground">
            {tx.transactionNumber}
          </p>
          <p className="truncate font-medium">
            {tx.customerName ?? "Walk-in"}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(tx.paidAt)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-semibold tabular-nums text-primary">
            {formatCurrency(tx.total)}
          </p>
          <Badge variant="secondary" className="mt-1 font-normal">
            {PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod}
          </Badge>
        </div>
      </div>
    </MobileDataCard>
  );
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="app-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div>
          <h3 className="font-semibold tracking-tight">Transaksi Terbaru</h3>
          <p className="text-sm text-muted-foreground">
            Penjualan selesai terakhir
          </p>
        </div>
        <Link
          href={ROUTES.transactions}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "min-h-9 w-full sm:w-auto",
          )}
        >
          Lihat semua
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <Receipt className="size-6" aria-hidden />
          </div>
          <p className="text-sm text-muted-foreground">
            Belum ada transaksi. Mulai dari halaman Kasir.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto p-4 sm:p-0">
          <ResponsiveTable
            table={
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-4 sm:pl-6">Nomor</TableHead>
                    <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead className="hidden md:table-cell">Bayar</TableHead>
                    <TableHead className="pr-4 text-right sm:pr-6">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="max-w-[5rem] truncate pl-4 font-mono text-xs sm:max-w-none sm:pl-6 sm:text-sm">
                        {tx.transactionNumber}
                      </TableCell>
                      <TableCell className="hidden whitespace-nowrap text-sm sm:table-cell">
                        {formatDateTime(tx.paidAt)}
                      </TableCell>
                      <TableCell className="max-w-[6rem] truncate font-medium sm:max-w-none">
                        {tx.customerName ?? "Walk-in"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="font-normal">
                          {PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-4 text-right font-semibold tabular-nums text-primary sm:pr-6">
                        {formatCurrency(tx.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            }
            mobile={transactions.map((tx) => (
              <TransactionMobileCard key={tx.id} tx={tx} />
            ))}
          />
        </div>
      )}
    </div>
  );
}
