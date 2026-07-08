"use client";

import { useState } from "react";
import { Clock, Plus, Scissors, Search } from "lucide-react";
import type { PosServiceDto } from "@/stores/pos.store";
import { usePosStore } from "@/stores/pos.store";
import { formatCurrency } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORY_ACCENTS = [
  "from-primary/80 to-primary",
  "from-violet-500/80 to-violet-600",
  "from-amber-500/80 to-amber-600",
  "from-rose-500/80 to-rose-600",
  "from-cyan-500/80 to-cyan-600",
] as const;

type ServiceGridProps = {
  services: PosServiceDto[];
};

export function ServiceGrid({ services }: ServiceGridProps) {
  const serviceSearch = usePosStore((s) => s.serviceSearch);
  const setServiceSearch = usePosStore((s) => s.setServiceSearch);
  const items = usePosStore((s) => s.items);
  const addService = usePosStore((s) => s.addService);
  const [categoryFilter, setCategoryFilter] = useState("Semua");

  const categories = [
    "Semua",
    ...Array.from(
      new Set(services.map((s) => s.categoryName ?? "Lainnya")),
    ),
  ];

  const filtered = services.filter((s) => {
    const q = serviceSearch.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.categoryName?.toLowerCase().includes(q);
    const matchCategory =
      categoryFilter === "Semua" ||
      (s.categoryName ?? "Lainnya") === categoryFilter;
    return matchSearch && matchCategory;
  });

  const grouped = filtered.reduce<Record<string, PosServiceDto[]>>(
    (acc, service) => {
      const key = service.categoryName ?? "Lainnya";
      acc[key] = acc[key] ?? [];
      acc[key].push(service);
      return acc;
    },
    {},
  );

  function getCartQty(serviceId: string) {
    return items.find((i) => i.serviceId === serviceId)?.quantity ?? 0;
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="pos-catalog-toolbar shrink-0">
        <div className="relative min-w-0 flex-1">
          <Search
            className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            placeholder="Cari layanan…"
            value={serviceSearch}
            onChange={(e) => setServiceSearch(e.target.value)}
            className="h-8 rounded-lg border-border/60 bg-card pl-8 text-xs shadow-sm"
            aria-label="Cari layanan"
          />
        </div>
      </div>

      <div className="mt-2 flex shrink-0 gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-all min-h-11",
              categoryFilter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground ring-1 ring-border hover:text-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="pos-scroll mt-2 min-h-0 flex-1 pr-1">
        <div className="space-y-4 pb-3">
          {Object.entries(grouped).map(([category, categoryItems], catIndex) => (
            <section key={category}>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={cn(
                    "h-4 w-0.5 rounded-full bg-gradient-to-b",
                    CATEGORY_ACCENTS[catIndex % CATEGORY_ACCENTS.length],
                  )}
                  aria-hidden
                />
                <h3 className="text-xs font-semibold tracking-tight">
                  {category}
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  {categoryItems.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {categoryItems.map((service) => {
                  const qty = getCartQty(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => addService(service)}
                      className={cn(
                        "pos-service-card group",
                        qty > 0 && "pos-service-card-in-cart",
                      )}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Scissors className="size-3" aria-hidden />
                        </div>
                        {qty > 0 ? (
                          <Badge className="h-4 bg-accent px-1 text-[9px] text-accent-foreground tabular-nums">
                            ×{qty}
                          </Badge>
                        ) : (
                          <span className="flex size-6 items-center justify-center rounded-full bg-muted/60 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                            <Plus className="size-3" aria-hidden />
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-left text-xs font-medium leading-snug">
                        {service.name}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold tabular-nums text-primary">
                          {formatCurrency(service.price)}
                        </p>
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <Clock className="size-2.5" aria-hidden />
                          {service.durationMinutes}m
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Scissors className="size-6" aria-hidden />
              </div>
              <p className="text-sm font-medium">Layanan tidak ditemukan</p>
              <p className="text-xs text-muted-foreground">
                Coba kata kunci atau kategori lain
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
