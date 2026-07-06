import { z } from "zod";
import { ExpenseCategory } from "@/constants/expenses";

const categoryValues = Object.values(ExpenseCategory) as [
  ExpenseCategory,
  ...ExpenseCategory[],
];

export const expenseSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().max(500).optional().nullable(),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category: z.enum(categoryValues),
  expenseDate: z.string().min(1, "Date is required"),
});

export const createExpenseSchema = expenseSchema;
export const updateExpenseSchema = expenseSchema.partial().extend({
  id: z.string().uuid(),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
