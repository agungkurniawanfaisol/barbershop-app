import { z } from "zod";
import { normalizeIdPhone, stripToLocalDigits } from "@/lib/phone";

const genderValues = ["MALE", "FEMALE", "OTHER"] as const;

const idPhoneSchema = z
  .string()
  .min(1, "Phone is required")
  .transform(normalizeIdPhone)
  .refine(
    (v) => stripToLocalDigits(v).length >= 8,
    "Phone must be at least 8 digits",
  );

export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: idPhoneSchema,
  gender: z.enum(genderValues).optional().nullable(),
  birthday: z.string().optional().nullable(),
  favoriteBarberId: z.string().uuid().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  loyaltyPoints: z.coerce.number().int().min(0).default(0),
});

export const createCustomerSchema = customerSchema;
export const updateCustomerSchema = customerSchema.partial().extend({
  id: z.string().uuid(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
