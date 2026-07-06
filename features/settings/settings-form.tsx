"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateShopSettingsAction } from "@/actions/settings.actions";
import type { ShopSettingsDto } from "@/services/setting.service";
import { CURRENCY_OPTIONS } from "@/constants/settings";
import { isSuccess } from "@/utils/result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/forms/native-select";
import { PhoneInput } from "@/components/forms/phone-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SettingsFormProps = {
  settings: ShopSettingsDto;
};

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      shopName: form.get("shopName") as string,
      shopAddress: (form.get("shopAddress") as string) || null,
      shopPhone: (form.get("shopPhone") as string) || null,
      taxRate: Number(form.get("taxRate")),
      currency: form.get("currency") as string,
      receiptFooter: (form.get("receiptFooter") as string) || null,
      defaultCommissionRate: Number(form.get("defaultCommissionRate")),
    };

    startTransition(async () => {
      const result = await updateShopSettingsAction(payload);
      if (isSuccess(result)) {
        toast.success("Settings saved");
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Shop Profile</CardTitle>
          <CardDescription>
            Business details shown on receipts and reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="shopName">Shop Name</Label>
            <Input
              id="shopName"
              name="shopName"
              defaultValue={settings.shopName}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="shopAddress">Address</Label>
            <Textarea
              id="shopAddress"
              name="shopAddress"
              rows={2}
              defaultValue={settings.shopAddress ?? ""}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shopPhone">Phone</Label>
            <PhoneInput
              id="shopPhone"
              name="shopPhone"
              defaultValue={settings.shopPhone ?? ""}
              disabled={isPending}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>POS & Receipts</CardTitle>
          <CardDescription>
            Tax and currency settings for the cashier.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              name="taxRate"
              type="number"
              min={0}
              max={100}
              step={0.1}
              defaultValue={settings.taxRate}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <NativeSelect
              id="currency"
              name="currency"
              defaultValue={settings.currency}
              disabled={isPending}
            >
              {CURRENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </NativeSelect>
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultCommissionRate">Default komisi barber (%)</Label>
            <Input
              id="defaultCommissionRate"
              name="defaultCommissionRate"
              type="number"
              min={0}
              max={100}
              step={0.5}
              defaultValue={settings.defaultCommissionRate}
              required
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Dipakai saat menambah pegawai baru jika komisi tidak diisi.
            </p>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="receiptFooter">Receipt Footer</Label>
            <Textarea
              id="receiptFooter"
              name="receiptFooter"
              rows={2}
              placeholder="Thank you for visiting!"
              defaultValue={settings.receiptFooter ?? ""}
              disabled={isPending}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Saving…
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </form>
  );
}
