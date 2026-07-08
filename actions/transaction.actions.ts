"use server";

import { revalidatePath } from "next/cache";
import { authorizeAction } from "@/lib/auth/authorize";
import { UserRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { transactionService } from "@/services/transaction.service";
import {
  transactionListFilterSchema,
} from "@/schemas/transaction.schema";
import { idSchema } from "@/schemas/common.schema";
import { failure, success, isSuccess } from "@/utils/result";

const TRANSACTION_ROLES = [
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.CASHIER,
  UserRole.BARBER,
];

export async function getTransactionsAction(
  searchParams: Record<string, string | undefined>,
) {
  const auth = await authorizeAction(TRANSACTION_ROLES);
  if (!isSuccess(auth)) return auth;

  const params = transactionListFilterSchema.parse(searchParams);

  try {
    const result = await transactionService.list(params);
    return success(result);
  } catch {
    return failure("Failed to load transactions");
  }
}

export async function markWhatsAppSentAction(input: unknown) {
  const auth = await authorizeAction(TRANSACTION_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = idSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid transaction");
  }

  try {
    const transaction = await transactionService.markWhatsAppSent(parsed.data.id);
    revalidatePath(ROUTES.transactions);
    revalidatePath(ROUTES.cashier);
    return success(transaction);
  } catch {
    return failure("Failed to update WhatsApp status");
  }
}
