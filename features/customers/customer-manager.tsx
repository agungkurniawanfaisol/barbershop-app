"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  createCustomerAction,
  deleteCustomerAction,
  updateCustomerAction,
} from "@/actions/customer.actions";
import type { CustomerDto } from "@/services/customer.service";
import { formatDate } from "@/lib/format";
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
import { PhoneInput } from "@/components/forms/phone-input";
import { DeleteConfirmDialog } from "@/components/data/delete-confirm-dialog";
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
import { Badge } from "@/components/ui/badge";

type BarberOption = { id: string; name: string };

type CustomerFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: CustomerDto | null;
  barbers: BarberOption[];
};

function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
  barbers,
}: CustomerFormDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(customer);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name") as string,
      phone: form.get("phone") as string,
      gender: (form.get("gender") as string) || null,
      birthday: (form.get("birthday") as string) || null,
      favoriteBarberId: (form.get("favoriteBarberId") as string) || null,
      notes: (form.get("notes") as string) || null,
      loyaltyPoints: Number(form.get("loyaltyPoints") || 0),
      ...(isEdit && customer ? { id: customer.id } : {}),
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateCustomerAction(payload)
        : await createCustomerAction(payload);

      if (isSuccess(result)) {
        toast.success(isEdit ? "Customer updated" : "Customer created");
        onOpenChange(false);
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Customer" : "Add Customer"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update customer information."
              : "Create a new customer record."}
          </DialogDescription>
        </DialogHeader>
        <form
          key={customer?.id ?? "new"}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={customer?.name}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <PhoneInput
                id="phone"
                name="phone"
                defaultValue={customer?.phone}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <NativeSelect
                id="gender"
                name="gender"
                defaultValue={customer?.gender ?? ""}
                disabled={isPending}
              >
                <option value="">Not specified</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                defaultValue={
                  customer?.birthday
                    ? customer.birthday.split("T")[0]
                    : undefined
                }
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loyaltyPoints">Loyalty Points</Label>
              <Input
                id="loyaltyPoints"
                name="loyaltyPoints"
                type="number"
                min={0}
                defaultValue={customer?.loyaltyPoints ?? 0}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="favoriteBarberId">Favorite Barber</Label>
              <NativeSelect
                id="favoriteBarberId"
                name="favoriteBarberId"
                defaultValue={customer?.favoriteBarberId ?? ""}
                disabled={isPending}
              >
                <option value="">None</option>
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={customer?.notes ?? ""}
                disabled={isPending}
              />
            </div>
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
              {isPending ? "Saving…" : isEdit ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type CustomerManagerProps = {
  customers: CustomerDto[];
  page: number;
  totalPages: number;
  total: number;
  barbers: BarberOption[];
};

export function CustomerManager({
  customers,
  page,
  totalPages,
  total,
  barbers,
}: CustomerManagerProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CustomerDto | null>(null);
  const [isDeleting, startDelete] = useTransition();

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(customer: CustomerDto) {
    setEditing(customer);
    setFormOpen(true);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    startDelete(async () => {
      const result = await deleteCustomerAction(deleteTarget.id);
      if (isSuccess(result)) {
        toast.success("Customer deleted");
        setDeleteTarget(null);
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">{total} customers</p>
        <Button className="min-h-9 w-full sm:w-auto" onClick={openCreate}>
          <Plus className="size-4" aria-hidden />
          Add Customer
        </Button>
      </div>

      <div className="rounded-xl border">
        <ResponsiveTable
          className="p-4 md:p-0"
          table={
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Barber</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{customer.visitCount}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(customer.lastVisit)}</TableCell>
                    <TableCell>{customer.favoriteBarberName ?? "—"}</TableCell>
                    <TableCell className="tabular-nums">
                      {customer.loyaltyPoints}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 min-h-9 min-w-9"
                          onClick={() => openEdit(customer)}
                          aria-label={`Edit ${customer.name}`}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 min-h-9 min-w-9"
                          onClick={() => setDeleteTarget(customer)}
                          aria-label={`Delete ${customer.name}`}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
          mobile={customers.map((customer) => (
            <MobileDataCard key={customer.id}>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.phone}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {customer.visitCount} kunjungan ·{" "}
                      {formatDate(customer.lastVisit)}
                    </p>
                    {customer.favoriteBarberName ? (
                      <p className="text-xs text-muted-foreground">
                        Barber: {customer.favoriteBarberName}
                      </p>
                    ) : null}
                  </div>
                  <Badge variant="secondary" className="shrink-0 tabular-nums">
                    {customer.loyaltyPoints} pts
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="min-h-9 flex-1"
                    onClick={() => openEdit(customer)}
                  >
                    <Pencil className="size-4" aria-hidden />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-9 flex-1 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(customer)}
                  >
                    <Trash2 className="size-4" aria-hidden />
                    Hapus
                  </Button>
                </div>
              </div>
            </MobileDataCard>
          ))}
        />
      </div>

      <CustomerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        customer={editing}
        barbers={barbers}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete customer?"
        description={`This will remove ${deleteTarget?.name ?? "this customer"} from active records.`}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
