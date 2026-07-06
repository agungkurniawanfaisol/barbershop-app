import { z } from "zod";
import { normalizeIdPhone } from "@/lib/phone";

const paymentMethods = ["CASH", "QRIS", "DEBIT", "TRANSFER"] as const;

export const cartItemSchema = z.object({
  serviceId: z.string().uuid(),
  serviceName: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Add at least one service"),
  customerId: z.string().uuid().optional().nullable(),
  barberId: z.string().uuid().optional().nullable(),
  discountAmount: z.number().min(0).default(0),
  discountPercent: z.number().min(0).max(100).default(0),
  taxPercent: z.number().min(0).max(100).default(11),
  notes: z.string().max(500).optional().nullable(),
  paymentMethod: z.enum(paymentMethods),
});

export const quickCustomerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .transform(normalizeIdPhone)
    .refine((v) => v.length >= 11, "Phone must be at least 8 digits"),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type QuickCustomerInput = z.infer<typeof quickCustomerSchema>;
