const COUNTRY_CODE = "62";

/** Strip stored phone to digits user types after +62 */
export function stripToLocalDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith(COUNTRY_CODE)) return digits.slice(COUNTRY_CODE.length);
  if (digits.startsWith("0")) return digits.slice(1);
  return digits;
}

/** Build full phone from local digits (e.g. 8123456789 → +628123456789) */
export function formatIdPhone(localDigits: string): string {
  const cleaned = localDigits.replace(/\D/g, "");
  if (!cleaned) return "";
  const normalized = cleaned.startsWith("0") ? cleaned.slice(1) : cleaned;
  return `+${COUNTRY_CODE}${normalized}`;
}

export function normalizeIdPhone(phone: string): string {
  if (!phone.trim()) return "";
  return formatIdPhone(stripToLocalDigits(phone));
}
