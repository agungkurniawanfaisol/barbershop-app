import { z } from "zod";
import { normalizeIdPhone } from "@/lib/phone";

export const shopSettingsSchema = z.object({
  shopName: z.string().min(2, "Shop name is required"),
  shopAddress: z.string().max(300).optional().nullable(),
  shopPhone: z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      if (!v?.trim()) return null;
      return normalizeIdPhone(v);
    }),
  taxRate: z.coerce.number().min(0).max(100),
  currency: z.string().min(3).max(3),
  receiptFooter: z.string().max(200).optional().nullable(),
  defaultCommissionRate: z.coerce.number().min(0).max(100).default(25),
});

export type ShopSettingsInput = z.infer<typeof shopSettingsSchema>;
