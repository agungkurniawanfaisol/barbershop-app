import { Scissors, Percent, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { BarberEarningsPageDto } from "@/services/barber-earnings.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EarningsSummaryCardsProps = {
  data: BarberEarningsPageDto;
};

export function EarningsSummaryCards({ data }: EarningsSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Jumlah potong
          </CardTitle>
          <Scissors className="size-4 text-primary" aria-hidden />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums">{data.haircutCount}</p>
          <p className="text-xs text-muted-foreground">{data.rangeLabel}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Komisi saya
          </CardTitle>
          <Wallet className="size-4 text-accent" aria-hidden />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums">
            {formatCurrency(data.commissionTotal)}
          </p>
          <p className="text-xs text-muted-foreground">Sebelum pajak</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Rate komisi
          </CardTitle>
          <Percent className="size-4 text-muted-foreground" aria-hidden />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums">
            {data.commissionRate}%
          </p>
          <p className="text-xs text-muted-foreground">Dari net layanan</p>
        </CardContent>
      </Card>
    </div>
  );
}
