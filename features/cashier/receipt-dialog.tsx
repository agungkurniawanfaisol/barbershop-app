"use client";

import { Printer } from "lucide-react";
import type { TransactionDto } from "@/services/transaction.service";
import { ReceiptTemplate } from "@/components/receipt/receipt-template";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ReceiptDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionDto | null;
  shopName: string;
  onDone: () => void;
};

export function ReceiptDialog({
  open,
  onOpenChange,
  transaction,
  shopName,
  onDone,
}: ReceiptDialogProps) {
  if (!transaction) return null;

  function handlePrint() {
    window.print();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm print:shadow-none">
        <DialogHeader className="print:hidden">
          <DialogTitle>Receipt</DialogTitle>
          <DialogDescription>
            {transaction.transactionNumber}
          </DialogDescription>
        </DialogHeader>

        <ReceiptTemplate transaction={transaction} shopName={shopName} />

        <div className="flex gap-2 print:hidden">
          <Button variant="outline" className="flex-1" onClick={onDone}>
            New Sale
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
