import { z } from "zod";
import { UserRole } from "@/constants/roles";

const roleValues = [
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.CASHIER,
  UserRole.BARBER,
] as const;

export const updateUserSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(2).optional(),
  role: z.enum(roleValues).optional(),
  isActive: z.boolean().optional(),
});

export const inviteUserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name is required"),
  role: z.enum(roleValues),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
