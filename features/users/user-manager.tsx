"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, UserPlus } from "lucide-react";
import {
  inviteUserAction,
  updateUserAction,
} from "@/actions/user.actions";
import type { UserDto } from "@/services/user.service";
import { ROLE_LABELS, UserRole } from "@/constants/roles";
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
import { Switch } from "@/components/ui/switch";
import { NativeSelect } from "@/components/forms/native-select";
import { Badge } from "@/components/ui/badge";
import { DataTableCard } from "@/components/data/data-table-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ROLE_OPTIONS = [
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.CASHIER,
  UserRole.BARBER,
] as const;

type UserFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserDto | null;
  currentUserId: string;
};

function UserFormDialog({
  open,
  onOpenChange,
  user,
  currentUserId,
}: UserFormDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const isEdit = Boolean(user);
  const isSelf = user?.id === currentUserId;

  useEffect(() => {
    setIsActive(user?.isActive ?? true);
  }, [user]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    if (isEdit && user) {
      const payload = {
        id: user.id,
        fullName: form.get("fullName") as string,
        role: form.get("role") as string,
        isActive,
      };

      startTransition(async () => {
        const result = await updateUserAction(payload);
        if (isSuccess(result)) {
          toast.success("User updated");
          onOpenChange(false);
          router.refresh();
          return;
        }
        toast.error(result.error);
      });
      return;
    }

    const payload = {
      email: form.get("email") as string,
      password: form.get("password") as string,
      fullName: form.get("fullName") as string,
      role: form.get("role") as string,
    };

    startTransition(async () => {
      const result = await inviteUserAction(payload);
      if (isSuccess(result)) {
        toast.success("User invited");
        onOpenChange(false);
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Invite User"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update role and account status."
              : "Create a new account with email and password."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEdit && (
            <>
              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  name="email"
                  type="email"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-password">Temporary Password</Label>
                <Input
                  id="user-password"
                  name="password"
                  type="password"
                  minLength={6}
                  required
                  disabled={isPending}
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="user-fullName">Full Name</Label>
            <Input
              id="user-fullName"
              name="fullName"
              defaultValue={user?.fullName}
              required
              disabled={isPending || isEdit}
              readOnly={isEdit}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-role">Role</Label>
            <NativeSelect
              id="user-role"
              name="role"
              defaultValue={user?.role ?? UserRole.CASHIER}
              disabled={isPending || isSelf}
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </NativeSelect>
          </div>
          {isEdit && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="user-active">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Inactive users cannot sign in.
                </p>
              </div>
              <Switch
                id="user-active"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={isPending || isSelf}
              />
            </div>
          )}
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
              {isEdit ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type UserManagerProps = {
  users: UserDto[];
  currentUserId: string;
};

export function UserManager({ users, currentUserId }: UserManagerProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UserDto | null>(null);

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
          <UserPlus className="size-4" aria-hidden />
          Undang Pengguna
        </Button>
      </div>

      <DataTableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Bergabung</TableHead>
              <TableHead className="w-14" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{user.fullName}</p>
                    <p className="truncate text-xs text-muted-foreground sm:hidden">
                      {user.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden max-w-[12rem] truncate sm:table-cell">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] ??
                      user.role}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant={user.isActive ? "default" : "outline"}>
                    {user.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-sm text-muted-foreground lg:table-cell">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 min-h-9 min-w-9"
                    onClick={() => {
                      setEditing(user);
                      setFormOpen(true);
                    }}
                    aria-label={`Edit ${user.fullName}`}
                  >
                    <Pencil className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTableCard>

      <UserFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        user={editing}
        currentUserId={currentUserId}
      />
    </>
  );
}
