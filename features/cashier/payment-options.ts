import type { LucideIcon } from "lucide-react";
import { Banknote, QrCode } from "lucide-react";
import type { PosPaymentMethod } from "@/constants/payments";

export const POS_PAYMENT_OPTIONS: ReadonlyArray<{
  value: PosPaymentMethod;
  label: string;
  icon: LucideIcon;
}> = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "QRIS", label: "QRIS", icon: QrCode },
];
