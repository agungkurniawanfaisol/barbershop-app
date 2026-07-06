"use server";

import { revalidatePath } from "next/cache";
import { authorizeAction } from "@/lib/auth/authorize";
import { UserRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { expenseService } from "@/services/expense.service";
import { auditService } from "@/services/audit.service";
import {
  createExpenseSchema,
  updateExpenseSchema,
} from "@/schemas/expense.schema";
import { failure, success, type ActionResult, isSuccess } from "@/utils/result";
import type { ExpenseDto } from "@/services/expense.service";

const EXPENSE_ROLES = [UserRole.ADMIN, UserRole.MANAGER];

export async function createExpenseAction(
  input: unknown,
): Promise<ActionResult<ExpenseDto>> {
  const auth = await authorizeAction(EXPENSE_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = createExpenseSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const expense = await expenseService.create(parsed.data, auth.data.id);

    await auditService.logChange({
      userId: auth.data.id,
      action: "CREATE",
      entity: "EXPENSE",
      entityId: expense.id,
      newValue: expense,
    });

    revalidatePath(ROUTES.expenses);
    revalidatePath(ROUTES.reports);
    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.audit);
    return success(expense);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to create expense",
    );
  }
}

export async function updateExpenseAction(
  input: unknown,
): Promise<ActionResult<ExpenseDto>> {
  const auth = await authorizeAction(EXPENSE_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = updateExpenseSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const previous = await expenseService.getById(parsed.data.id);
    const expense = await expenseService.update(parsed.data);

    await auditService.logChange({
      userId: auth.data.id,
      action: "UPDATE",
      entity: "EXPENSE",
      entityId: expense.id,
      oldValue: previous,
      newValue: expense,
    });

    revalidatePath(ROUTES.expenses);
    revalidatePath(ROUTES.reports);
    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.audit);
    return success(expense);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to update expense",
    );
  }
}

export async function deleteExpenseAction(
  id: string,
): Promise<ActionResult<void>> {
  const auth = await authorizeAction(EXPENSE_ROLES);
  if (!isSuccess(auth)) return auth;

  try {
    const previous = await expenseService.getById(id);
    await expenseService.delete(id);

    await auditService.logChange({
      userId: auth.data.id,
      action: "DELETE",
      entity: "EXPENSE",
      entityId: id,
      oldValue: previous,
    });

    revalidatePath(ROUTES.expenses);
    revalidatePath(ROUTES.reports);
    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.audit);
    return success(undefined);
  } catch {
    return failure("Failed to delete expense");
  }
}
