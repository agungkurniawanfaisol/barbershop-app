import { formatCurrency } from "@/lib/format";
import { stripToLocalDigits } from "@/lib/phone";

export function phoneToWaMeDigits(phone: string): string {
  const local = stripToLocalDigits(phone);
  return local ? `62${local}` : "";
}

export type ThankYouMessageParams = {
  customerName: string;
  shopName: string;
  transactionNumber: string;
  total: number;
  serviceNames: string[];
};

export function buildThankYouMessage(params: ThankYouMessageParams): string {
  const services = [...new Set(params.serviceNames)].join(", ");

  return `Halo ${params.customerName},

Terima kasih telah berkunjung ke ${params.shopName}!

Nomor transaksi: ${params.transactionNumber}
Total pembayaran: ${formatCurrency(params.total)}
Layanan: ${services}

Kami berharap Anda puas dengan pelayanan kami. Sampai jumpa di kunjungan berikutnya!

Salam,
${params.shopName}`;
}

export function buildWaMeUrl(phone: string, text: string): string {
  const digits = phoneToWaMeDigits(phone);
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function openWhatsAppThankYou(
  phone: string,
  params: Omit<ThankYouMessageParams, "customerName"> & { customerName: string },
): boolean {
  const message = buildThankYouMessage(params);
  const url = buildWaMeUrl(phone, message);
  if (!url) return false;

  const opened = window.open(url, "_blank", "noopener,noreferrer");
  return opened !== null;
}
