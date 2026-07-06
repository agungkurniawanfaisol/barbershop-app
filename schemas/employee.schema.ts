import { z } from "zod";
import { UserRole } from "@/constants/roles";
import { normalizeIdPhone } from "@/lib/phone";

const roleValues = [
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.CASHIER,
  UserRole.BARBER,
] as const;

export const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .optional()
    .nullable()
    .transform((v) => {
      if (!v?.trim()) return null;
      return normalizeIdPhone(v);
    }),
  email: z.string().email("Invalid email").optional().nullable().or(z.literal("")),
  address: z.string().max(300).optional().nullable(),
  photoUrl: z.string().url().optional().nullable().or(z.literal("")),
  role: z.enum(roleValues).default(UserRole.BARBER),
  commissionRate: z.coerce.number().min(0).max(100).default(0),
  salary: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
  hireDate: z.string().optional().nullable(),
});

export const createEmployeeSchema = employeeSchema;
export const updateEmployeeSchema = employeeSchema.partial().extend({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable().optional(),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
