"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  createServiceAction,
  createServiceCategoryAction,
  deleteServiceAction,
  deleteServiceCategoryAction,
  updateServiceAction,
  updateServiceCategoryAction,
} from "@/actions/service.actions";
import type {
  ServiceCategoryDto,
  ServiceDto,
} from "@/services/service.service";
import { formatCurrency } from "@/lib/format";
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
import { Switch } from "@/components/ui/switch";
import { NativeSelect } from "@/components/forms/native-select";
import { DeleteConfirmDialog } from "@/components/data/delete-confirm-dialog";
import { DataTableCard } from "@/components/data/data-table-card";
import {
  MobileDataCard,
  ResponsiveTable,
} from "@/components/data/responsive-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type ServiceManagerProps = {
  services: ServiceDto[];
  categories: ServiceCategoryDto[];
  total: number;
};

export function ServiceManager({
  services,
  categories,
  total,
}: ServiceManagerProps) {
  const router = useRouter();
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceDto | null>(null);
  const [editingCategory, setEditingCategory] =
    useState<ServiceCategoryDto | null>(null);
  const [deleteServiceTarget, setDeleteServiceTarget] =
    useState<ServiceDto | null>(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] =
    useState<ServiceCategoryDto | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const [serviceActive, setServiceActive] = useState(
    editingService?.isActive ?? true,
  );
  const [categoryActive, setCategoryActive] = useState(
    editingCategory?.isActive ?? true,
  );

  function openServiceForm(service: ServiceDto | null) {
    setEditingService(service);
    setServiceActive(service?.isActive ?? true);
    setServiceFormOpen(true);
  }

  function openCategoryForm(category: ServiceCategoryDto | null) {
    setEditingCategory(category);
    setCategoryActive(category?.isActive ?? true);
    setCategoryFormOpen(true);
  }

  function submitService(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const isEdit = Boolean(editingService);
    const payload = {
      name: form.get("name") as string,
      description: (form.get("description") as string) || null,
      price: Number(form.get("price")),
      durationMinutes: Number(form.get("durationMinutes") || 30),
      categoryId: (form.get("categoryId") as string) || null,
      isActive: serviceActive,
      ...(isEdit && editingService ? { id: editingService.id } : {}),
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateServiceAction(payload)
        : await createServiceAction(payload);
      if (isSuccess(result)) {
        toast.success(isEdit ? "Service updated" : "Service created");
        setServiceFormOpen(false);
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  }

  function submitCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const isEdit = Boolean(editingCategory);
    const payload = {
      name: form.get("name") as string,
      description: (form.get("description") as string) || null,
      sortOrder: Number(form.get("sortOrder") || 0),
      isActive: categoryActive,
      ...(isEdit && editingCategory ? { id: editingCategory.id } : {}),
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateServiceCategoryAction(payload)
        : await createServiceCategoryAction(payload);
      if (isSuccess(result)) {
        toast.success(isEdit ? "Category updated" : "Category created");
        setCategoryFormOpen(false);
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  }

  return (
    <>
      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid h-auto min-h-11 w-full grid-cols-2 sm:inline-flex sm:w-auto">
          <TabsTrigger value="services" className="min-h-11">
            Layanan ({total})
          </TabsTrigger>
          <TabsTrigger value="categories" className="min-h-11">
            Kategori ({categories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-0 space-y-4">
          <div className="flex justify-stretch sm:justify-end">
            <Button
              className="min-h-9 w-full sm:w-auto"
              onClick={() => openServiceForm(null)}
            >
              <Plus className="size-4" aria-hidden />
              Tambah Layanan
            </Button>
          </div>
          <DataTableCard>
            <ResponsiveTable
              className="p-4 md:p-0"
              table={
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4 sm:pl-6">Nama</TableHead>
                      <TableHead className="hidden sm:table-cell">Kategori</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead className="hidden md:table-cell">Durasi</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="w-20 pr-4 text-right sm:pr-6">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="pl-4 font-medium sm:pl-6">
                          {service.name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {service.categoryName ?? "—"}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {formatCurrency(service.price)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {service.durationMinutes} m
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            variant={service.isActive ? "default" : "secondary"}
                          >
                            {service.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="pr-4 text-right sm:pr-6">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-9 min-h-9 min-w-9"
                              onClick={() => openServiceForm(service)}
                              aria-label={`Edit ${service.name}`}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-9 min-h-9 min-w-9"
                              onClick={() => setDeleteServiceTarget(service)}
                              aria-label={`Delete ${service.name}`}
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
              mobile={services.map((service) => (
                <MobileDataCard key={service.id}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.categoryName ?? "Tanpa kategori"} ·{" "}
                          {service.durationMinutes} menit
                        </p>
                        <p className="mt-1 text-sm font-semibold tabular-nums text-primary">
                          {formatCurrency(service.price)}
                        </p>
                      </div>
                      <Badge
                        variant={service.isActive ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {service.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="min-h-11 flex-1"
                        onClick={() => openServiceForm(service)}
                      >
                        <Pencil className="size-4" aria-hidden />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="min-h-11 flex-1 text-destructive hover:text-destructive"
                        onClick={() => setDeleteServiceTarget(service)}
                      >
                        <Trash2 className="size-4" aria-hidden />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </MobileDataCard>
              ))}
            />
          </DataTableCard>
        </TabsContent>

        <TabsContent value="categories" className="mt-0 space-y-4">
          <div className="flex justify-stretch sm:justify-end">
            <Button
              className="min-h-9 w-full sm:w-auto"
              onClick={() => openCategoryForm(null)}
            >
              <Plus className="size-4" aria-hidden />
              Tambah Kategori
            </Button>
          </div>
          <DataTableCard>
            <ResponsiveTable
              className="p-4 md:p-0"
              table={
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Sort</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-24 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {category.sortOrder}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={category.isActive ? "default" : "secondary"}
                          >
                            {category.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-9 min-h-9 min-w-9"
                              onClick={() => openCategoryForm(category)}
                              aria-label={`Edit ${category.name}`}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-9 min-h-9 min-w-9"
                              onClick={() => setDeleteCategoryTarget(category)}
                              aria-label={`Delete ${category.name}`}
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
              mobile={categories.map((category) => (
                <MobileDataCard key={category.id}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Urutan {category.sortOrder}
                        </p>
                      </div>
                      <Badge
                        variant={category.isActive ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="min-h-11 flex-1"
                        onClick={() => openCategoryForm(category)}
                      >
                        <Pencil className="size-4" aria-hidden />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="min-h-11 flex-1 text-destructive hover:text-destructive"
                        onClick={() => setDeleteCategoryTarget(category)}
                      >
                        <Trash2 className="size-4" aria-hidden />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </MobileDataCard>
              ))}
            />
          </DataTableCard>
        </TabsContent>
      </Tabs>

      <Dialog open={serviceFormOpen} onOpenChange={setServiceFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add Service"}
            </DialogTitle>
            <DialogDescription>
              Configure pricing, duration, and category.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitService} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="svc-name">Name</Label>
              <Input
                id="svc-name"
                name="name"
                defaultValue={editingService?.name}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-desc">Description</Label>
              <Textarea
                id="svc-desc"
                name="description"
                rows={2}
                defaultValue={editingService?.description ?? ""}
                disabled={isPending}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="svc-price">Price</Label>
                <Input
                  id="svc-price"
                  name="price"
                  type="number"
                  min={1}
                  defaultValue={editingService?.price ?? ""}
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="svc-duration">Duration (min)</Label>
                <Input
                  id="svc-duration"
                  name="durationMinutes"
                  type="number"
                  min={5}
                  defaultValue={editingService?.durationMinutes ?? 30}
                  disabled={isPending}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-category">Category</Label>
              <NativeSelect
                id="svc-category"
                name="categoryId"
                defaultValue={editingService?.categoryId ?? ""}
                disabled={isPending}
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="svc-active"
                checked={serviceActive}
                onCheckedChange={setServiceActive}
                disabled={isPending}
              />
              <Label htmlFor="svc-active">Active service</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setServiceFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryFormOpen} onOpenChange={setCategoryFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={submitCategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                name="name"
                defaultValue={editingCategory?.name}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                name="description"
                rows={2}
                defaultValue={editingCategory?.description ?? ""}
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-sort">Sort Order</Label>
              <Input
                id="cat-sort"
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={editingCategory?.sortOrder ?? 0}
                disabled={isPending}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="cat-active"
                checked={categoryActive}
                onCheckedChange={setCategoryActive}
                disabled={isPending}
              />
              <Label htmlFor="cat-active">Active category</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCategoryFormOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={Boolean(deleteServiceTarget)}
        onOpenChange={(open) => !open && setDeleteServiceTarget(null)}
        title="Delete service?"
        description={`Remove ${deleteServiceTarget?.name ?? "this service"}?`}
        onConfirm={() => {
          if (!deleteServiceTarget) return;
          startDelete(async () => {
            const result = await deleteServiceAction(deleteServiceTarget.id);
            if (isSuccess(result)) {
              toast.success("Service deleted");
              setDeleteServiceTarget(null);
              router.refresh();
              return;
            }
            toast.error(result.error);
          });
        }}
        isLoading={isDeleting}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteCategoryTarget)}
        onOpenChange={(open) => !open && setDeleteCategoryTarget(null)}
        title="Delete category?"
        description={`Remove ${deleteCategoryTarget?.name ?? "this category"}?`}
        onConfirm={() => {
          if (!deleteCategoryTarget) return;
          startDelete(async () => {
            const result = await deleteServiceCategoryAction(
              deleteCategoryTarget.id,
            );
            if (isSuccess(result)) {
              toast.success("Category deleted");
              setDeleteCategoryTarget(null);
              router.refresh();
              return;
            }
            toast.error(result.error);
          });
        }}
        isLoading={isDeleting}
      />
    </>
  );
}
