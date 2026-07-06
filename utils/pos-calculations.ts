import type { CartItemInput } from "@/schemas/transaction.schema";

export type PosTotals = {
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  taxAmount: number;
  taxPercent: number;
  total: number;
};

type CalculateTotalsInput = {
  items: CartItemInput[];
  discountAmount: number;
  discountPercent: number;
  taxPercent: number;
};

export function calculatePosTotals(input: CalculateTotalsInput): PosTotals {
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const percentDiscount =
    input.discountPercent > 0
      ? Math.round((subtotal * input.discountPercent) / 100)
      : 0;
  const fixedDiscount = input.discountAmount > 0 ? input.discountAmount : 0;
  const discountAmount = Math.min(subtotal, percentDiscount || fixedDiscount);

  const taxable = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round((taxable * input.taxPercent) / 100);
  const total = taxable + taxAmount;

  return {
    subtotal,
    discountAmount,
    discountPercent: input.discountPercent,
    taxAmount,
    taxPercent: input.taxPercent,
    total,
  };
}

export function roundMoney(value: number): number {
  return Math.round(value);
}
