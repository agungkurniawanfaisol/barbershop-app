import { z } from "zod";

export const serviceCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().max(300).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const createServiceCategorySchema = serviceCategorySchema;
export const updateServiceCategorySchema = serviceCategorySchema
  .partial()
  .extend({ id: z.string().uuid() });

export const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().max(500).optional().nullable(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  durationMinutes: z.coerce.number().int().min(5).max(480).default(30),
  categoryId: z.string().uuid().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const createServiceSchema = serviceSchema;
export const updateServiceSchema = serviceSchema.partial().extend({
  id: z.string().uuid(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ServiceCategoryInput = z.infer<typeof serviceCategorySchema>;
export type CreateServiceCategoryInput = z.infer<typeof createServiceCategorySchema>;
export type UpdateServiceCategoryInput = z.infer<typeof updateServiceCategorySchema>;
