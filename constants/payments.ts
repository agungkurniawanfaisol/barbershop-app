export const POS_PAYMENT_METHODS = ["CASH", "QRIS"] as const;

export type PosPaymentMethod = (typeof POS_PAYMENT_METHODS)[number];

export const PAYMENT_LABELS: Record<string, string> = {
  CASH: "Cash",
  QRIS: "QRIS",
  DEBIT: "Debit",
  TRANSFER: "Transfer",
};
