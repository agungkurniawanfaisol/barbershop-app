"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  createEmployeeAction,
  deleteEmployeeAction,
  updateEmployeeAction,
} from "@/actions/employee.actions";
import type { EmployeeDto } from "@/services/employee.service";
import { formatCurrency } from "@/lib/format";
import { ROLE_LABELS, UserRole } from "@/constants/roles";
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
import { Switch } from "@/components/ui/switch";
import { NativeSelect } from "@/components/forms/native-select";
import { PhoneInput } from "@/components/forms/phone-input";
import { DeleteConfirmDialog } from "@/components/data/delete-confirm-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type LinkableUser = {
  id: string;
  fullName: string;
  email: string;
};

type EmployeeFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: EmployeeDto | null;
  linkableUsers: LinkableUser[];
  defaultCommissionRate: number;
};

function EmployeeFormDialog({
  open,
  onOpenChange,
  employee,
  linkableUsers,
  defaultCommissionRate,
}: EmployeeFormDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(employee?.isActive ?? true);
  const [commissionRate, setCommissionRate] = useState(
    employee?.commissionRate ?? defaultCommissionRate,
  );
  const isEdit = Boolean(employee);
  const ownerShare = Math.max(0, 100 - commissionRate);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const userIdRaw = form.get("userId") as string;
    const payload = {
      name: form.get("name") as string,
      phone: (form.get("phone") as string) || null,
      email: (form.get("email") as string) || null,
      address: (form.get("address") as string) || null,
      role: form.get("role") as string,
      commissionRate: Number(form.get("commissionRate") || 0),
      salary: Number(form.get("salary") || 0),
      hireDate: (form.get("hireDate") as string) || null,
      isActive,
      ...(isEdit && employee
        ? {
            id: employee.id,
            userId: userIdRaw ? userIdRaw : null,
          }
        : {}),
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateEmployeeAction(payload)
        : await createEmployeeAction(payload);

      if (isSuccess(result)) {
        toast.success(isEdit ? "Employee updated" : "Employee created");
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
          <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
          <DialogDescription>
            Manage staff details, role, and compensation.
          </DialogDescription>
        </DialogHeader>
        <form
          key={employee?.id ?? "new"}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="emp-name">Name</Label>
              <Input
                id="emp-name"
                name="name"
                defaultValue={employee?.name}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emp-phone">Phone</Label>
              <PhoneInput
                id="emp-phone"
                name="phone"
                defaultValue={employee?.phone ?? ""}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emp-email">Email</Label>
              <Input
                id="emp-email"
                name="email"
                type="email"
                defaultValue={employee?.email ?? ""}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="emp-address">Address</Label>
              <Input
                id="emp-address"
                name="address"
                defaultValue={employee?.address ?? ""}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emp-role">Role</Label>
              <NativeSelect
                id="emp-role"
                name="role"
                defaultValue={employee?.role ?? UserRole.BARBER}
                disabled={isPending}
              >
                {Object.values(UserRole).map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emp-hireDate">Hire Date</Label>
              <Input
                id="emp-hireDate"
                name="hireDate"
                type="date"
                defaultValue={
                  employee?.hireDate
                    ? employee.hireDate.split("T")[0]
                    : undefined
                }
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emp-commission">Komisi barber (%)</Label>
              <Input
                id="emp-commission"
                name="commissionRate"
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value) || 0)}
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                Barber dapat {commissionRate}%, pemilik usaha {ownerShare}%
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emp-salary">Salary</Label>
              <Input
                id="emp-salary"
                name="salary"
                type="number"
                min={0}
                defaultValue={employee?.salary ?? 0}
                disabled={isPending}
              />
            </div>
            {isEdit ? (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="emp-userId">Akun login</Label>
                <NativeSelect
                  id="emp-userId"
                  name="userId"
                  defaultValue={employee?.userId ?? ""}
                  disabled={isPending}
                >
                  <option value="">Tidak terhubung</option>
                  {linkableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </option>
                  ))}
                </NativeSelect>
                <p className="text-xs text-muted-foreground">
                  Hubungkan pegawai ke akun barber yang sudah diundang.
                </p>
              </div>
            ) : null}
            <div className="flex items-center gap-3 sm:col-span-2">
              <Switch
                id="emp-active"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={isPending}
              />
              <Label htmlFor="emp-active">Active employee</Label>
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

type EmployeeManagerProps = {
  employees: EmployeeDto[];
  total: number;
  linkableUsersByEmployee: Record<string, LinkableUser[]>;
  defaultCommissionRate: number;
};

export function EmployeeManager({
  employees,
  total,
  linkableUsersByEmployee,
  defaultCommissionRate,
}: EmployeeManagerProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<EmployeeDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EmployeeDto | null>(null);
  const [isDeleting, startDelete] = useTransition();

  function confirmDelete() {
    if (!deleteTarget) return;
    startDelete(async () => {
      const result = await deleteEmployeeAction(deleteTarget.id);
      if (isSuccess(result)) {
        toast.success("Employee deleted");
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
        <p className="text-sm text-muted-foreground">{total} employees</p>
        <Button
          className="min-h-9 w-full sm:w-auto"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" aria-hidden />
          Add Employee
        </Button>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{ROLE_LABELS[employee.role as UserRole]}</TableCell>
                <TableCell>{employee.phone ?? "—"}</TableCell>
                <TableCell className="tabular-nums">
                  {employee.commissionRate}%
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatCurrency(employee.salary)}
                </TableCell>
                <TableCell>
                  <Badge variant={employee.isActive ? "default" : "secondary"}>
                    {employee.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 min-h-9 min-w-9"
                      onClick={() => {
                        setEditing(employee);
                        setFormOpen(true);
                      }}
                      aria-label={`Edit ${employee.name}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 min-h-9 min-w-9"
                      onClick={() => setDeleteTarget(employee)}
                      aria-label={`Delete ${employee.name}`}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EmployeeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        employee={editing}
        linkableUsers={
          editing
            ? (linkableUsersByEmployee[editing.id] ?? [])
            : []
        }
        defaultCommissionRate={defaultCommissionRate}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete employee?"
        description={`This will remove ${deleteTarget?.name ?? "this employee"} from active records.`}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
