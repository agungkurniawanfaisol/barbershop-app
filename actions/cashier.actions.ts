"use server";

import { revalidatePath } from "next/cache";
import { authorizeAction } from "@/lib/auth/authorize";
import { UserRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { transactionService } from "@/services/transaction.service";
import { customerService } from "@/services/customer.service";
import {
  checkoutSchema,
  quickCustomerSchema,
} from "@/schemas/transaction.schema";
import { failure, success, isSuccess, type ActionResult } from "@/utils/result";
import type { TransactionDto } from "@/services/transaction.service";

const CASHIER_ROLES = [UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER];

export async function searchPosCustomersAction(query: string) {
  const auth = await authorizeAction(CASHIER_ROLES);
  if (!isSuccess(auth)) return auth;

  try {
    const customers = await transactionService.searchCustomers(query);
    return success(customers);
  } catch {
    return failure("Failed to search customers");
  }
}

export async function createQuickCustomerAction(input: unknown) {
  const auth = await authorizeAction(CASHIER_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = quickCustomerSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const customer = await customerService.create({
      ...parsed.data,
      loyaltyPoints: 0,
    });
    return success({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      loyaltyPoints: customer.loyaltyPoints,
    });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to create customer",
    );
  }
}

export async function checkoutAction(
  input: unknown,
): Promise<ActionResult<TransactionDto>> {
  const auth = await authorizeAction(CASHIER_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid checkout data");
  }

  try {
    const transaction = await transactionService.checkout(
      parsed.data,
      auth.data.id,
    );
    revalidatePath(ROUTES.cashier);
    revalidatePath(ROUTES.transactions);
    revalidatePath(ROUTES.customers);
    revalidatePath(ROUTES.dashboard);
    revalidatePath(ROUTES.myEarnings);
    return success(transaction);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Checkout failed",
    );
  }
}
