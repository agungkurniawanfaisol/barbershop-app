"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import type { TransactionFilterBarberDto } from "@/services/transaction.service";
import { PAYMENT_LABELS } from "@/constants/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/forms/native-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TransactionFiltersProps = {
  barbers: TransactionFilterBarberDto[];
  defaults: {
    from?: string;
    to?: string;
    paymentMethod?: string;
    barberId?: string;
    sortBy: string;
    sortOrder: string;
    whatsapp: string;
  };
};

export function TransactionFilters({
  barbers,
  defaults,
}: TransactionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function applyFilters(form: HTMLFormElement) {
    const data = new FormData(form);
    const params = new URLSearchParams(searchParams.toString());

    const fields = [
      "from",
      "to",
      "paymentMethod",
      "barberId",
      "sortBy",
      "sortOrder",
      "whatsapp",
    ] as const;

    for (const field of fields) {
      const value = String(data.get(field) ?? "").trim();
      if (value) {
        params.set(field, value);
      } else {
        params.delete(field);
      }
    }

    params.delete("page");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  function resetFilters() {
    const params = new URLSearchParams(searchParams.toString());
    const search = params.get("search");
    const next = new URLSearchParams();
    if (search) next.set("search", search);

    startTransition(() => {
      router.push(next.toString() ? `?${next.toString()}` : "?");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Filter & Sort</CardTitle>
        <CardDescription>
          Filter by date, payment, barber, or WhatsApp status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            applyFilters(e.currentTarget);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="tx-from">From</Label>
            <Input
              id="tx-from"
              name="from"
              type="date"
              defaultValue={defaults.from ?? ""}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tx-to">To</Label>
            <Input
              id="tx-to"
              name="to"
              type="date"
              defaultValue={defaults.to ?? ""}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tx-payment">Payment</Label>
            <NativeSelect
              id="tx-payment"
              name="paymentMethod"
              defaultValue={defaults.paymentMethod ?? ""}
              disabled={isPending}
            >
              <option value="">All methods</option>
              {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tx-barber">Barber</Label>
            <NativeSelect
              id="tx-barber"
              name="barberId"
              defaultValue={defaults.barberId ?? ""}
              disabled={isPending}
            >
              <option value="">All barbers</option>
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tx-sort">Sort by</Label>
            <NativeSelect
              id="tx-sort"
              name="sortBy"
              defaultValue={defaults.sortBy}
              disabled={isPending}
            >
              <option value="paidAt">Date</option>
              <option value="total">Total</option>
              <option value="transactionNumber">Number</option>
            </NativeSelect>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tx-order">Order</Label>
            <NativeSelect
              id="tx-order"
              name="sortOrder"
              defaultValue={defaults.sortOrder}
              disabled={isPending}
            >
              <option value="desc">Newest / Highest first</option>
              <option value="asc">Oldest / Lowest first</option>
            </NativeSelect>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tx-whatsapp">WhatsApp</Label>
            <NativeSelect
              id="tx-whatsapp"
              name="whatsapp"
              defaultValue={defaults.whatsapp}
              disabled={isPending}
            >
              <option value="all">All</option>
              <option value="sent">Sent</option>
              <option value="not_sent">Not sent</option>
            </NativeSelect>
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" className="flex-1" disabled={isPending}>
              Apply
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetFilters}
              disabled={isPending}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
