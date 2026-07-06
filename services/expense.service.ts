import { expenseRepository } from "@/repositories/expense.repository";
import type { PaginationInput } from "@/schemas/common.schema";
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
} from "@/schemas/expense.schema";
import { toNumber } from "@/lib/format";

export type ExpenseDto = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  category: string;
  expenseDate: string;
  recordedById: string;
  recordedByName: string;
  createdAt: string;
};

function serializeExpense(
  expense: Awaited<ReturnType<typeof expenseRepository.findById>>,
): ExpenseDto | null {
  if (!expense) return null;
  return {
    id: expense.id,
    title: expense.title,
    description: expense.description,
    amount: toNumber(expense.amount),
    category: expense.category,
    expenseDate: expense.expenseDate.toISOString(),
    recordedById: expense.recordedById,
    recordedByName: expense.recordedBy.fullName,
    createdAt: expense.createdAt.toISOString(),
  };
}

export class ExpenseService {
  async list(params: PaginationInput & { category?: string }) {
    const result = await expenseRepository.findMany(params);
    return {
      ...result,
      data: result.data.map((e) => serializeExpense(e)!),
    };
  }

  async getById(id: string) {
    const expense = await expenseRepository.findById(id);
    return serializeExpense(expense);
  }

  async create(input: CreateExpenseInput, recordedById: string) {
    const expense = await expenseRepository.create(input, recordedById);
    return serializeExpense(expense)!;
  }

  async update(input: UpdateExpenseInput) {
    const current = await expenseRepository.findById(input.id);
    if (!current) throw new Error("Expense not found");
    const expense = await expenseRepository.update(input);
    return serializeExpense(expense)!;
  }

  async delete(id: string) {
    await expenseRepository.softDelete(id);
  }
}

export const expenseService = new ExpenseService();
