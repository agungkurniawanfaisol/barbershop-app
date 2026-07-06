"use server";

import { revalidatePath } from "next/cache";
import { authorizeAction } from "@/lib/auth/authorize";
import { UserRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { employeeService } from "@/services/employee.service";
import { paginationSchema } from "@/schemas/common.schema";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "@/schemas/employee.schema";
import { z } from "zod";
import { failure, success, type ActionResult, isSuccess } from "@/utils/result";
import type { EmployeeDto } from "@/services/employee.service";

const EMPLOYEE_ROLES = [UserRole.ADMIN, UserRole.MANAGER];

export async function getEmployeesAction(
  searchParams: Record<string, string | undefined>,
) {
  const auth = await authorizeAction(EMPLOYEE_ROLES);
  if (!isSuccess(auth)) return auth;

  const params = paginationSchema.parse({
    page: searchParams.page,
    limit: searchParams.limit,
    search: searchParams.search,
  });

  try {
    const result = await employeeService.list(params);
    return success(result);
  } catch {
    return failure("Failed to load employees");
  }
}

export async function createEmployeeAction(
  input: unknown,
): Promise<ActionResult<EmployeeDto>> {
  const auth = await authorizeAction(EMPLOYEE_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = createEmployeeSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const employee = await employeeService.create(parsed.data);
    revalidatePath(ROUTES.employees);
    return success(employee);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to create employee",
    );
  }
}

export async function updateEmployeeAction(
  input: unknown,
): Promise<ActionResult<EmployeeDto>> {
  const auth = await authorizeAction(EMPLOYEE_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = updateEmployeeSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const employee = await employeeService.update(parsed.data);
    revalidatePath(ROUTES.employees);
    return success(employee);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to update employee",
    );
  }
}

export async function linkEmployeeUserAction(
  input: unknown,
): Promise<ActionResult<EmployeeDto>> {
  const auth = await authorizeAction(EMPLOYEE_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = z
    .object({
      employeeId: z.string().uuid(),
      userId: z.string().uuid().nullable(),
    })
    .safeParse(input);

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const employee = await employeeService.linkUser(
      parsed.data.employeeId,
      parsed.data.userId,
    );
    revalidatePath(ROUTES.employees);
    return success(employee);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to link login account",
    );
  }
}

export async function deleteEmployeeAction(
  id: string,
): Promise<ActionResult<void>> {
  const auth = await authorizeAction(EMPLOYEE_ROLES);
  if (!isSuccess(auth)) return auth;

  try {
    await employeeService.delete(id);
    revalidatePath(ROUTES.employees);
    return success(undefined);
  } catch {
    return failure("Failed to delete employee");
  }
}
