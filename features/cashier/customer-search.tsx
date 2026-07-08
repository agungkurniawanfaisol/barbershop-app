"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Loader2, Search, UserPlus, UserRound, X, Star } from "lucide-react";
import { toast } from "sonner";
import {
  createQuickCustomerAction,
  searchPosCustomersAction,
} from "@/actions/cashier.actions";
import type { PosCustomerDto } from "@/stores/pos.store";
import { usePosStore } from "@/stores/pos.store";
import { isSuccess } from "@/utils/result";
import { stripToLocalDigits } from "@/lib/phone";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
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

const SEARCH_DEBOUNCE_MS = 300;

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

function filterRecentCustomers(
  customers: PosCustomerDto[],
  query: string,
  limit = 8,
): PosCustomerDto[] {
  const q = query.trim();
  if (q.length < 2) return [];

  const lower = q.toLowerCase();
  const digits = q.replace(/\D/g, "");

  return customers
    .filter((c) => {
      if (c.name.toLowerCase().includes(lower)) return true;
      const phoneDigits = c.phone.replace(/\D/g, "");
      if (digits.length >= 2 && phoneDigits.includes(digits)) return true;
      return c.phone.toLowerCase().includes(lower);
    })
    .slice(0, limit);
}

type CustomerSearchProps = {
  compact?: boolean;
  recentCustomers?: PosCustomerDto[];
};

export function CustomerSearch({
  compact = false,
  recentCustomers = [],
}: CustomerSearchProps) {
  const customer = usePosStore((s) => s.customer);
  const walkIn = usePosStore((s) => s.walkIn);
  const setCustomer = usePosStore((s) => s.setCustomer);
  const setWalkIn = usePosStore((s) => s.setWalkIn);
  const [query, setQuery] = useState("");
  const [serverResults, setServerResults] = useState<PosCustomerDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchSeq = useRef(0);
  const [quickOpen, setQuickOpen] = useState(false);
  const [isCreating, startCreate] = useTransition();

  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, SEARCH_DEBOUNCE_MS);
  const isDebouncing = trimmedQuery !== debouncedQuery;

  const localResults = useMemo(
    () => filterRecentCustomers(recentCustomers, trimmedQuery),
    [recentCustomers, trimmedQuery],
  );

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < 2) {
      setServerResults([]);
      setIsSearching(false);
      return;
    }

    const seq = ++searchSeq.current;
    setIsSearching(true);

    void searchPosCustomersAction(q).then((result) => {
      if (seq !== searchSeq.current) return;
      if (isSuccess(result)) setServerResults(result.data);
      setIsSearching(false);
    });
  }, [debouncedQuery]);

  const displayResults = useMemo(() => {
    if (trimmedQuery.length < 2) return [];
    if (isDebouncing) return localResults;
    if (isSearching && serverResults.length === 0) return localResults;
    return serverResults;
  }, [
    trimmedQuery,
    isDebouncing,
    isSearching,
    localResults,
    serverResults,
  ]);

  const showInlineForm =
    trimmedQuery.length >= 2 &&
    displayResults.length === 0 &&
    !isDebouncing &&
    !isSearching;

  const inlinePrefill = useMemo(
    () => (showInlineForm ? getInlinePrefill(trimmedQuery) : { name: "", phone: "" }),
    [showInlineForm, trimmedQuery],
  );

  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.trim().length > 0) {
      usePosStore.getState().setWalkIn(false);
    }
    if (value.trim().length < 2) {
      setServerResults([]);
    }
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
        setServerResults([]);
        onSuccess?.();
        toast.success("Pelanggan ditambahkan");
        return;
      }
      toast.error(result.error);
    });
  }

  function handleWalkIn() {
    setWalkIn(true);
    setQuery("");
    setServerResults([]);
  }

  function handleSelectCustomer(c: PosCustomerDto) {
    setWalkIn(false);
    setCustomer(c);
    setQuery("");
    setServerResults([]);
  }

  return (
    <div className="space-y-2">
      <Label
        className={cn(
          "font-semibold uppercase tracking-wider text-primary",
          compact ? "text-[10px] text-muted-foreground" : "text-xs",
        )}
      >
        Pelanggan
      </Label>
      {customer ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border-2 border-accent/50 bg-gradient-to-r from-accent/15 via-card to-accent/5 shadow-sm",
            compact ? "p-2.5" : "p-4",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground",
                  compact ? "size-8 text-xs" : "size-11 text-base shadow-md shadow-accent/25",
                )}
              >
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className={cn("truncate font-semibold", compact ? "text-sm" : "text-base")}>
                  {customer.name}
                </p>
                <p className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
                  {customer.phone}
                </p>
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
                className="size-10 min-h-10 min-w-10"
                onClick={() => setCustomer(null)}
                aria-label="Hapus pelanggan"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : walkIn ? (
        <div
          className={cn(
            "flex items-center justify-between gap-2 rounded-xl border-2 border-accent/40 bg-accent/10 shadow-sm",
            compact ? "p-2.5" : "p-3.5",
          )}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <div
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground",
                compact ? "size-8 text-xs" : "size-10 text-sm",
              )}
            >
              <UserRound className={compact ? "size-3.5" : "size-4"} aria-hidden />
            </div>
            <div className="min-w-0">
              <p className={cn("font-semibold", compact ? "text-sm" : "text-base")}>
                Walk-in
              </p>
              <p className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
                Tanpa data pelanggan
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-primary"
            onClick={() => setWalkIn(false)}
          >
            Ubah
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "space-y-2.5 rounded-xl border-2 border-primary/20 bg-card shadow-sm",
            compact ? "p-2" : "p-3.5",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
                  compact ? "left-2.5 size-3.5" : "left-3 size-4",
                )}
                aria-hidden
              />
              <Input
                placeholder={compact ? "Cari nama / HP…" : "Nama atau HP…"}
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className={cn(
                  "w-full rounded-lg bg-background font-medium shadow-inner",
                  compact ? "h-9 pl-8 pr-8 text-sm" : "h-10 pl-10 pr-9 text-sm",
                )}
                autoComplete="off"
              />
              {(isDebouncing || isSearching) && (
                <Loader2
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 animate-spin text-muted-foreground",
                    compact ? "right-2.5 size-3.5" : "right-3 size-4",
                  )}
                  aria-hidden
                />
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "shrink-0 gap-1.5 border-dashed font-medium",
                compact ? "h-9 px-2.5 text-xs" : "h-10 px-3 text-sm",
              )}
              onClick={handleWalkIn}
              aria-label="Walk-in tanpa data pelanggan"
            >
              <UserRound className="size-4 shrink-0" aria-hidden />
              <span className="hidden min-[420px]:inline">Walk-in</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "shrink-0 gap-1.5 font-medium",
                compact ? "h-9 px-2.5 text-xs" : "h-10 px-3 text-sm",
              )}
              onClick={() => setQuickOpen(true)}
              aria-label="Tambah pelanggan baru"
            >
              <UserPlus className="size-4 shrink-0" aria-hidden />
              <span className="hidden min-[420px]:inline">Baru</span>
            </Button>
          </div>
          {displayResults.length > 0 && (
            <ul
              className={cn(
                "overflow-y-auto rounded-lg border-2 border-border bg-card shadow-md",
                compact ? "max-h-36 text-sm" : "max-h-48 text-base",
              )}
            >
              {displayResults.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between gap-2 border-b px-3 text-left transition-colors last:border-0 hover:bg-primary/5",
                      compact ? "py-2" : "py-3",
                    )}
                    onClick={() => handleSelectCustomer(c)}
                  >
                    <span className="flex min-w-0 flex-1 flex-col items-start gap-0 sm:flex-row sm:items-center sm:gap-3">
                      <span className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "flex shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary",
                            compact ? "size-7 text-[10px]" : "size-9 text-sm",
                          )}
                        >
                          {c.name.charAt(0).toUpperCase()}
                        </span>
                        <span className={cn("truncate font-semibold", compact ? "text-sm" : "text-base")}>
                          {c.name}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "text-muted-foreground sm:pl-0",
                          compact ? "pl-9 text-xs" : "pl-11 text-sm",
                        )}
                      >
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
