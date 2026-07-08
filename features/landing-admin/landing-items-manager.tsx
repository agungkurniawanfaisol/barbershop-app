"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  createLandingItemAction,
  deleteLandingItemAction,
  updateLandingItemAction,
} from "@/actions/landing.actions";
import {
  LANDING_ICON_OPTIONS,
  LANDING_SECTION_LABELS,
  LandingSection,
  type LandingSection as LandingSectionType,
} from "@/constants/landing";
import type { LandingItemDto } from "@/types/landing";
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
import { Switch } from "@/components/ui/switch";

type FieldKey = "title" | "subtitle" | "description" | "imageUrl" | "sortOrder";

type SectionConfig = {
  section: LandingSectionType;
  description: string;
  fields: FieldKey[];
  labels: Partial<Record<FieldKey, string>>;
  subtitleAsIcon?: boolean;
  hideTitle?: boolean;
};

const SECTION_CONFIGS: Record<LandingSectionType, SectionConfig> = {
  [LandingSection.STYLE]: {
    section: LandingSection.STYLE,
    description: "Kelola gaya potongan di galeri landing page.",
    fields: ["title", "subtitle", "description", "imageUrl", "sortOrder"],
    labels: {
      title: "Nama gaya",
      subtitle: "Slug URL",
      description: "Deskripsi",
      imageUrl: "URL gambar",
      sortOrder: "Urutan",
    },
  },
  [LandingSection.STAT]: {
    section: LandingSection.STAT,
    description: "Angka dan label statistik di strip landing.",
    fields: ["title", "subtitle", "sortOrder"],
    labels: {
      title: "Nilai",
      subtitle: "Label",
      sortOrder: "Urutan",
    },
  },
  [LandingSection.FEATURE]: {
    section: LandingSection.FEATURE,
    description: "Kartu fitur platform di landing page.",
    fields: ["title", "subtitle", "description", "sortOrder"],
    labels: {
      title: "Judul",
      subtitle: "Ikon",
      description: "Deskripsi",
      sortOrder: "Urutan",
    },
    subtitleAsIcon: true,
  },
  [LandingSection.BENEFIT]: {
    section: LandingSection.BENEFIT,
    description: "Kartu manfaat untuk pengunjung landing.",
    fields: ["title", "subtitle", "description", "sortOrder"],
    labels: {
      title: "Judul",
      subtitle: "Ikon",
      description: "Deskripsi",
      sortOrder: "Urutan",
    },
    subtitleAsIcon: true,
  },
  [LandingSection.TESTIMONIAL]: {
    section: LandingSection.TESTIMONIAL,
    description: "Kutipan testimoni pelanggan atau tim.",
    fields: ["description", "subtitle", "sortOrder"],
    labels: {
      description: "Kutipan",
      subtitle: "Peran / sumber",
      sortOrder: "Urutan",
    },
    hideTitle: true,
  },
};

type ItemFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: SectionConfig;
  item?: LandingItemDto | null;
};

function ItemFormDialog({
  open,
  onOpenChange,
  config,
  item,
}: ItemFormDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPublished, setIsPublished] = useState(item?.isPublished ?? true);
  const isEdit = Boolean(item);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      section: config.section,
      title: (form.get("title") as string) || "Testimoni",
      subtitle: (form.get("subtitle") as string) || null,
      description: (form.get("description") as string) || null,
      imageUrl: (form.get("imageUrl") as string) || null,
      sortOrder: Number(form.get("sortOrder") || 0),
      isPublished,
      ...(isEdit && item ? { id: item.id } : {}),
    };

    startTransition(async () => {
      const result = isEdit
        ? await updateLandingItemAction(payload)
        : await createLandingItemAction(payload);

      if (isSuccess(result)) {
        toast.success(isEdit ? "Item diperbarui" : "Item ditambahkan");
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
          <DialogTitle>
            {isEdit ? "Edit" : "Tambah"}{" "}
            {LANDING_SECTION_LABELS[config.section]}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!config.hideTitle && config.fields.includes("title") ? (
            <div className="space-y-2">
              <Label htmlFor="title">{config.labels.title ?? "Judul"}</Label>
              <Input
                id="title"
                name="title"
                defaultValue={item?.title}
                required
                disabled={isPending}
              />
            </div>
          ) : (
            <input type="hidden" name="title" value={item?.title ?? "Testimoni"} />
          )}

          {config.fields.includes("subtitle") ? (
            <div className="space-y-2">
              <Label htmlFor="subtitle">
                {config.labels.subtitle ?? "Subjudul"}
              </Label>
              {config.subtitleAsIcon ? (
                <NativeSelect
                  id="subtitle"
                  name="subtitle"
                  defaultValue={item?.subtitle ?? LANDING_ICON_OPTIONS[0]?.value}
                  disabled={isPending}
                >
                  {LANDING_ICON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect>
              ) : (
                <Input
                  id="subtitle"
                  name="subtitle"
                  defaultValue={item?.subtitle ?? ""}
                  disabled={isPending}
                />
              )}
            </div>
          ) : null}

          {config.fields.includes("description") ? (
            <div className="space-y-2">
              <Label htmlFor="description">
                {config.labels.description ?? "Deskripsi"}
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={item?.description ?? ""}
                rows={3}
                required={config.section === LandingSection.TESTIMONIAL}
                disabled={isPending}
              />
            </div>
          ) : null}

          {config.fields.includes("imageUrl") ? (
            <div className="space-y-2">
              <Label htmlFor="imageUrl">
                {config.labels.imageUrl ?? "URL gambar"}
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                defaultValue={item?.imageUrl ?? ""}
                placeholder="/images/haircuts/fade-classic.jpg"
                required
                disabled={isPending}
              />
            </div>
          ) : null}

          {config.fields.includes("sortOrder") ? (
            <div className="space-y-2">
              <Label htmlFor="sortOrder">
                {config.labels.sortOrder ?? "Urutan"}
              </Label>
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={item?.sortOrder ?? 0}
                disabled={isPending}
              />
            </div>
          ) : null}

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Tampilkan di landing</p>
              <p className="text-xs text-muted-foreground">
                Nonaktifkan untuk menyembunyikan sementara.
              </p>
            </div>
            <Switch
              id="isPublished"
              checked={isPublished}
              onCheckedChange={setIsPublished}
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
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isEdit ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type LandingItemsManagerProps = {
  section: LandingSectionType;
  items: LandingItemDto[];
};

export function LandingItemsManager({
  section,
  items,
}: LandingItemsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LandingItemDto | null>(null);
  const [deleting, setDeleting] = useState<LandingItemDto | null>(null);
  const config = SECTION_CONFIGS[section];

  const sectionItems = useMemo(
    () =>
      items
        .filter((item) => item.section === section)
        .toSorted((a, b) => a.sortOrder - b.sortOrder),
    [items, section],
  );

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(item: LandingItemDto) {
    setEditing(item);
    setFormOpen(true);
  }

  function handleDelete() {
    if (!deleting) return;
    startTransition(async () => {
      const result = await deleteLandingItemAction({ id: deleting.id });
      if (isSuccess(result)) {
        toast.success("Item dihapus");
        setDeleting(null);
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  }

  function primaryLabel(item: LandingItemDto) {
    if (section === LandingSection.TESTIMONIAL) {
      return item.description ?? "—";
    }
    return item.title;
  }

  function secondaryLabel(item: LandingItemDto) {
    if (section === LandingSection.STAT) return item.subtitle;
    if (section === LandingSection.STYLE) return item.imageUrl;
    return item.subtitle;
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {LANDING_SECTION_LABELS[section]}
          </h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
        <Button size="sm" onClick={openCreate} className="min-h-9">
          <Plus className="size-4" />
          Tambah
        </Button>
      </div>

      <DataTableCard>
        <ResponsiveTable
          className="p-4 md:p-0"
          table={
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utama</TableHead>
                  <TableHead className="hidden md:table-cell">Detail</TableHead>
                  <TableHead className="w-20">Urutan</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-28 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectionItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="max-w-xs font-medium">
                      <span className="line-clamp-2">{primaryLabel(item)}</span>
                    </TableCell>
                    <TableCell className="hidden max-w-xs text-muted-foreground md:table-cell">
                      <span className="line-clamp-2">{secondaryLabel(item)}</span>
                    </TableCell>
                    <TableCell>{item.sortOrder}</TableCell>
                    <TableCell>
                      <Badge variant={item.isPublished ? "default" : "secondary"}>
                        {item.isPublished ? "Aktif" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEdit(item)}
                          aria-label="Edit"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleting(item)}
                          aria-label="Hapus"
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
          mobile={sectionItems.map((item) => (
            <MobileDataCard key={item.id}>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{primaryLabel(item)}</p>
                    {secondaryLabel(item) ? (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {secondaryLabel(item)}
                      </p>
                    ) : null}
                  </div>
                  <Badge variant={item.isPublished ? "default" : "secondary"}>
                    {item.isPublished ? "Aktif" : "Draft"}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleting(item)}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </MobileDataCard>
          ))}
        />
      </DataTableCard>

      <ItemFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        config={config}
        item={editing}
      />

      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
        isLoading={isPending}
        title="Hapus item landing?"
        description="Item akan dihapus dari halaman beranda."
      />
    </>
  );
}
