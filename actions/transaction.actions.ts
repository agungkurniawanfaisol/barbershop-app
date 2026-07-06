"use server";

import { authorizeAction } from "@/lib/auth/authorize";
import { UserRole } from "@/constants/roles";
import { transactionService } from "@/services/transaction.service";
import { paginationSchema } from "@/schemas/common.schema";
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

  const params = paginationSchema.parse({
    page: searchParams.page,
    limit: searchParams.limit,
    search: searchParams.search,
  });

  try {
    const result = await transactionService.list(params);
    return success(result);
  } catch {
    return failure("Failed to load transactions");
  }
}
