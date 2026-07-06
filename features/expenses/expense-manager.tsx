"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  createExpenseAction,
  deleteExpenseAction,
  updateExpenseAction,
} from "@/actions/expense.actions";
import type { ExpenseDto } from "@/services/expense.service";
import {
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_CATEGORY_OPTIONS,
  type ExpenseCategory,
} from "@/constants/expenses";
import { formatCurrency, formatDate } from "@/lib/format";
import { isSuccess } from "@/utils/result";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/forms/native-select";
import { DeleteConfirmDialog } from "@/components/data/delete-confirm-dialog";
import { DataTableCard } from "@/components/data/data-table-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type ExpenseFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: ExpenseDto | null;
};

function ExpenseFormDialog({
  open,
  onOpenChange,
  expense,
}: ExpenseFormDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(expense);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title") as string,
      description: (form.get("description") as string) || null,
      amount: Number(form.get("amount")),
      category: form.get("category") as string,
      expenseDate: form.get("expenseDate") as string,
      ...(isEdit && expense ? { id: expense.id } : {}),
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateExpenseAction(payload)
        : await createExpenseAction(payload);

      if (isSuccess(result)) {
        toast.success(isEdit ? "Expense updated" : "Expense recorded");
        onOpenChange(false);
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  }

  const defaultDate = expense?.expenseDate
    ? expense.expenseDate.slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Expense" : "Record Expense"}</DialogTitle>
          <DialogDescription>
            Track shop operating costs and overheads.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exp-title">Title</Label>
            <Input
              id="exp-title"
              name="title"
              defaultValue={expense?.title}
              required
              disabled={isPending}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="exp-amount">Amount</Label>
              <Input
                id="exp-amount"
                name="amount"
                type="number"
                min={1}
                step={1}
                defaultValue={expense?.amount}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-date">Date</Label>
              <Input
                id="exp-date"
                name="expenseDate"
                type="date"
                defaultValue={defaultDate}
                required
                disabled={isPending}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-category">Category</Label>
            <NativeSelect
              id="exp-category"
              name="category"
              defaultValue={expense?.category ?? "OTHER"}
              disabled={isPending}
            >
              {EXPENSE_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-description">Description</Label>
            <Textarea
              id="exp-description"
              name="description"
              rows={3}
              defaultValue={expense?.description ?? ""}
              disabled={isPending}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isEdit ? "Save Changes" : "Record Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type ExpenseManagerProps = {
  expenses: ExpenseDto[];
};

export function ExpenseManager({ expenses }: ExpenseManagerProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ExpenseDto | null>(null);
  const [deleting, setDeleting] = useState<ExpenseDto | null>(null);
  const [isDeleting, startDelete] = useTransition();

  function handleDelete() {
    if (!deleting) return;
    startDelete(async () => {
      const result = await deleteExpenseAction(deleting.id);
      if (isSuccess(result)) {
        toast.success("Expense deleted");
        setDeleting(null);
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  }

  return (
    <>
      <div className="flex justify-stretch sm:justify-end">
        <Button
          className="min-h-9 w-full sm:w-auto"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" aria-hidden />
          Catat Pengeluaran
        </Button>
      </div>

      <DataTableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead className="hidden sm:table-cell">Kategori</TableHead>
              <TableHead className="hidden md:table-cell">Dicatat</TableHead>
              <TableHead className="text-right">Jumlah</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDate(expense.expenseDate)}
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <p className="font-medium">{expense.title}</p>
                    <Badge variant="secondary" className="mt-1 sm:hidden">
                      {EXPENSE_CATEGORY_LABELS[
                        expense.category as ExpenseCategory
                      ] ?? expense.category}
                    </Badge>
                    {expense.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {expense.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="secondary">
                    {EXPENSE_CATEGORY_LABELS[
                      expense.category as ExpenseCategory
                    ] ?? expense.category}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {expense.recordedByName}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(expense.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 min-h-9 min-w-9"
                      onClick={() => {
                        setEditing(expense);
                        setFormOpen(true);
                      }}
                      aria-label={`Edit ${expense.title}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 min-h-9 min-w-9"
                      onClick={() => setDeleting(expense)}
                      aria-label={`Delete ${expense.title}`}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTableCard>

      <ExpenseFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        expense={editing}
      />

      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={() => setDeleting(null)}
        title="Delete expense?"
        description={`This will remove "${deleting?.title}" from your records.`}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
