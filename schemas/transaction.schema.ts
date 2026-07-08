import { z } from "zod";
import { normalizeIdPhone } from "@/lib/phone";
import { POS_PAYMENT_METHODS } from "@/constants/payments";

export const cartItemSchema = z.object({
  serviceId: z.string().uuid(),
  serviceName: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const checkoutSchema = z
  .object({
    items: z.array(cartItemSchema).min(1, "Add at least one service"),
    customerId: z.string().uuid().optional().nullable(),
    barberId: z.string().uuid().optional().nullable(),
    discountAmount: z.number().min(0).default(0),
    discountPercent: z.number().min(0).max(100).default(0),
    taxPercent: z.number().min(0).max(100).default(11),
    notes: z.string().max(500).optional().nullable(),
    paymentMethod: z.enum(POS_PAYMENT_METHODS),
    cashPaid: z.number().min(0).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "CASH") {
      if (data.cashPaid == null || data.cashPaid <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Masukkan uang diterima",
          path: ["cashPaid"],
        });
      }
    }
  });

export const quickCustomerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .transform(normalizeIdPhone)
    .refine((v) => v.length >= 11, "Phone must be at least 8 digits"),
});

export const transactionSortFields = [
  "paidAt",
  "total",
  "transactionNumber",
] as const;

export const transactionListFilterSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.enum(transactionSortFields).default("paidAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  paymentMethod: z.enum(["CASH", "QRIS", "DEBIT", "TRANSFER"]).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  barberId: z.string().uuid().optional(),
  whatsapp: z.enum(["all", "sent", "not_sent"]).default("all"),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type QuickCustomerInput = z.infer<typeof quickCustomerSchema>;
export type TransactionListFilterInput = z.infer<
  typeof transactionListFilterSchema
>;
