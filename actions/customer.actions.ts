"use server";

import { revalidatePath } from "next/cache";
import { authorizeAction } from "@/lib/auth/authorize";
import { UserRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { customerService } from "@/services/customer.service";
import { paginationSchema } from "@/schemas/common.schema";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "@/schemas/customer.schema";
import { failure, success, type ActionResult, isSuccess } from "@/utils/result";
import type { CustomerDto } from "@/services/customer.service";

const CUSTOMER_ROLES = [UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER];

export async function getCustomersAction(searchParams: Record<string, string | undefined>) {
  const auth = await authorizeAction(CUSTOMER_ROLES);
  if (!isSuccess(auth)) return auth;

  const params = paginationSchema.parse({
    page: searchParams.page,
    limit: searchParams.limit,
    search: searchParams.search,
  });

  try {
    const result = await customerService.list(params);
    return success(result);
  } catch {
    return failure("Failed to load customers");
  }
}

export async function getCustomerBarbersAction() {
  const auth = await authorizeAction(CUSTOMER_ROLES);
  if (!isSuccess(auth)) return auth;

  try {
    const barbers = await customerService.getBarberOptions();
    return success(barbers);
  } catch {
    return failure("Failed to load barbers");
  }
}

export async function createCustomerAction(
  input: unknown,
): Promise<ActionResult<CustomerDto>> {
  const auth = await authorizeAction(CUSTOMER_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = createCustomerSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const customer = await customerService.create(parsed.data);
    revalidatePath(ROUTES.customers);
    return success(customer);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to create customer",
    );
  }
}

export async function updateCustomerAction(
  input: unknown,
): Promise<ActionResult<CustomerDto>> {
  const auth = await authorizeAction(CUSTOMER_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = updateCustomerSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const customer = await customerService.update(parsed.data);
    revalidatePath(ROUTES.customers);
    return success(customer);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to update customer",
    );
  }
}

export async function deleteCustomerAction(
  id: string,
): Promise<ActionResult<void>> {
  const auth = await authorizeAction(CUSTOMER_ROLES);
  if (!isSuccess(auth)) return auth;

  try {
    await customerService.delete(id);
    revalidatePath(ROUTES.customers);
    return success(undefined);
  } catch {
    return failure("Failed to delete customer");
  }
}
