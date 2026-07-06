"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, UserPlus, X, Star } from "lucide-react";
import { toast } from "sonner";
import {
  createQuickCustomerAction,
  searchPosCustomersAction,
} from "@/actions/cashier.actions";
import type { PosCustomerDto } from "@/stores/pos.store";
import { usePosStore } from "@/stores/pos.store";
import { isSuccess } from "@/utils/result";
import { stripToLocalDigits } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/forms/phone-input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function isPhoneLikeQuery(query: string): boolean {
  const digits = query.replace(/\D/g, "");
  return digits.length >= 2 && digits.length / query.trim().length >= 0.5;
}

function getInlinePrefill(query: string) {
  const trimmed = query.trim();
  if (isPhoneLikeQuery(trimmed)) {
    return { name: "", phone: stripToLocalDigits(trimmed) };
  }
  return { name: trimmed.length >= 2 ? trimmed : "", phone: "" };
}

export function CustomerSearch({ compact = false }: { compact?: boolean }) {
  const customer = usePosStore((s) => s.customer);
  const setCustomer = usePosStore((s) => s.setCustomer);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PosCustomerDto[]>([]);
  const [isSearching, startSearch] = useTransition();
  const [quickOpen, setQuickOpen] = useState(false);
  const [isCreating, startCreate] = useTransition();

  const trimmedQuery = query.trim();
  const showInlineForm =
    trimmedQuery.length >= 2 && results.length === 0 && !isSearching;

  const inlinePrefill = useMemo(
    () => (showInlineForm ? getInlinePrefill(trimmedQuery) : { name: "", phone: "" }),
    [showInlineForm, trimmedQuery],
  );

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length > 0) {
      usePosStore.getState().setWalkIn(false);
    }
    startSearch(async () => {
      if (value.trim().length < 2) {
        setResults([]);
        return;
      }
      const result = await searchPosCustomersAction(value);
      if (isSuccess(result)) setResults(result.data);
    });
  }

  function handleQuickCreate(
    e: React.FormEvent<HTMLFormElement>,
    onSuccess?: () => void,
  ) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    startCreate(async () => {
      const result = await createQuickCustomerAction({
        name: form.get("name"),
        phone: form.get("phone"),
      });
      if (isSuccess(result)) {
        setCustomer(result.data);
        setQuickOpen(false);
        setQuery("");
        setResults([]);
        onSuccess?.();
        toast.success("Pelanggan ditambahkan");
        return;
      }
      toast.error(result.error);
    });
  }

  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Pelanggan
      </Label>
      {customer ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border border-accent/40 bg-gradient-to-r from-accent/10 via-card to-accent/5",
            compact ? "p-2.5" : "p-4",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <div
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground",
                  compact ? "size-8 text-xs" : "size-10 text-sm shadow-md shadow-accent/25",
                )}
              >
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.phone}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Badge className="gap-0.5 bg-amber-500/15 px-1.5 text-[10px] text-amber-700 font-normal">
                <Star className="size-2.5 fill-amber-500 text-amber-500" aria-hidden />
                {customer.loyaltyPoints}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setCustomer(null)}
                aria-label="Hapus pelanggan"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "space-y-2 rounded-xl border border-dashed bg-muted/20",
            compact ? "p-2" : "p-3",
          )}
        >
          <div className="relative">
            <Search
              className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              placeholder="Ketik nama atau nomor telepon…"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-9 rounded-lg bg-card pl-8 text-sm"
              disabled={isSearching}
              autoComplete="off"
            />
          </div>
          {results.length > 0 && (
            <ul className="max-h-36 overflow-y-auto rounded-lg border bg-card text-sm shadow-sm">
              {results.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 border-b px-2.5 py-2 text-left transition-colors last:border-0 hover:bg-accent/5"
                    onClick={() => {
                      setCustomer(c);
                      setQuery("");
                      setResults([]);
                    }}
                  >
                    <span className="flex min-w-0 flex-1 flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-2">
                      <span className="flex items-center gap-2">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {c.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="truncate text-sm font-medium">{c.name}</span>
                      </span>
                      <span className="pl-9 text-xs text-muted-foreground sm:pl-0">
                        {c.phone}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {showInlineForm && (
            <form
              key={`inline-${trimmedQuery}`}
              onSubmit={(e) => handleQuickCreate(e)}
              className="space-y-2 rounded-lg border border-primary/20 bg-card p-2.5"
            >
              <p className="text-xs text-muted-foreground">
                Pelanggan tidak ditemukan — tambah manual
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="inline-name" className="text-xs">
                  Nama
                </Label>
                <Input
                  id="inline-name"
                  name="name"
                  required
                  disabled={isCreating}
                  defaultValue={inlinePrefill.name}
                  className="h-9 text-sm"
                  placeholder="Nama pelanggan"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inline-phone" className="text-xs">
                  Nomor HP
                </Label>
                <PhoneInput
                  id="inline-phone"
                  name="phone"
                  required
                  disabled={isCreating}
                  defaultValue={inlinePrefill.phone}
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="pos-pay-button h-8 w-full text-xs"
                disabled={isCreating}
              >
                {isCreating ? "Menyimpan…" : "Simpan & gunakan"}
              </Button>
            </form>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 w-full rounded-lg border-dashed text-xs sm:w-auto"
            onClick={() => setQuickOpen(true)}
          >
            <UserPlus className="size-3.5" aria-hidden />
            Pelanggan Baru
          </Button>
        </div>
      )}

      <Dialog open={quickOpen} onOpenChange={setQuickOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Pelanggan Cepat</DialogTitle>
          </DialogHeader>
          <form key={quickOpen ? "open" : "closed"} onSubmit={handleQuickCreate} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="qc-name">Nama</Label>
              <Input id="qc-name" name="name" required disabled={isCreating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qc-phone">Nomor HP</Label>
              <PhoneInput
                id="qc-phone"
                name="phone"
                required
                disabled={isCreating}
              />
            </div>
            <Button
              type="submit"
              className="pos-pay-button w-full"
              disabled={isCreating}
            >
              {isCreating ? "Menyimpan…" : "Simpan"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
