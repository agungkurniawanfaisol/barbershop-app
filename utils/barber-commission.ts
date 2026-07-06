export function calculateNetServiceAmount(
  subtotal: number,
  discountAmount: number,
): number {
  return Math.max(0, subtotal - discountAmount);
}

export function calculateBarberCommission(
  subtotal: number,
  discountAmount: number,
  commissionRate: number,
): { netAmount: number; commissionAmount: number; commissionRate: number } {
  const netAmount = calculateNetServiceAmount(subtotal, discountAmount);
  const commissionAmount = (netAmount * commissionRate) / 100;
  return {
    netAmount,
    commissionAmount: Math.round(commissionAmount * 100) / 100,
    commissionRate,
  };
}

export function resolveTransactionCommission(
  subtotal: number,
  discountAmount: number,
  snapshotRate: number | null | undefined,
  snapshotAmount: number | null | undefined,
  fallbackRate: number,
): number {
  if (snapshotAmount != null && !Number.isNaN(snapshotAmount)) {
    return snapshotAmount;
  }
  const rate = snapshotRate ?? fallbackRate;
  return calculateBarberCommission(subtotal, discountAmount, rate).commissionAmount;
}
