"use server";

import { revalidatePath } from "next/cache";
import { authorizeAction } from "@/lib/auth/authorize";
import { UserRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { serviceService } from "@/services/service.service";
import { paginationSchema } from "@/schemas/common.schema";
import {
  createServiceCategorySchema,
  createServiceSchema,
  updateServiceCategorySchema,
  updateServiceSchema,
} from "@/schemas/service.schema";
import { failure, success, type ActionResult, isSuccess } from "@/utils/result";
import type {
  ServiceCategoryDto,
  ServiceDto,
} from "@/services/service.service";

const SERVICE_ROLES = [UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER];

export async function getServicesAction(
  searchParams: Record<string, string | undefined>,
) {
  const auth = await authorizeAction(SERVICE_ROLES);
  if (!isSuccess(auth)) return auth;

  const params = paginationSchema.parse({
    page: searchParams.page,
    limit: searchParams.limit,
    search: searchParams.search,
  });

  try {
    const [services, categories] = await Promise.all([
      serviceService.listServices({
        ...params,
        categoryId: searchParams.categoryId,
      }),
      serviceService.listCategories(),
    ]);
    return success({ services, categories });
  } catch {
    return failure("Failed to load services");
  }
}

export async function createServiceAction(
  input: unknown,
): Promise<ActionResult<ServiceDto>> {
  const auth = await authorizeAction(SERVICE_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = createServiceSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const service = await serviceService.createService(parsed.data);
    revalidatePath(ROUTES.services);
    return success(service);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to create service",
    );
  }
}

export async function updateServiceAction(
  input: unknown,
): Promise<ActionResult<ServiceDto>> {
  const auth = await authorizeAction(SERVICE_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = updateServiceSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const service = await serviceService.updateService(parsed.data);
    revalidatePath(ROUTES.services);
    return success(service);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to update service",
    );
  }
}

export async function deleteServiceAction(
  id: string,
): Promise<ActionResult<void>> {
  const auth = await authorizeAction(SERVICE_ROLES);
  if (!isSuccess(auth)) return auth;

  try {
    await serviceService.deleteService(id);
    revalidatePath(ROUTES.services);
    return success(undefined);
  } catch {
    return failure("Failed to delete service");
  }
}

export async function createServiceCategoryAction(
  input: unknown,
): Promise<ActionResult<ServiceCategoryDto>> {
  const auth = await authorizeAction([UserRole.ADMIN, UserRole.MANAGER]);
  if (!isSuccess(auth)) return auth;

  const parsed = createServiceCategorySchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const category = await serviceService.createCategory(parsed.data);
    revalidatePath(ROUTES.services);
    return success(category);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to create category",
    );
  }
}

export async function updateServiceCategoryAction(
  input: unknown,
): Promise<ActionResult<ServiceCategoryDto>> {
  const auth = await authorizeAction([UserRole.ADMIN, UserRole.MANAGER]);
  if (!isSuccess(auth)) return auth;

  const parsed = updateServiceCategorySchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const category = await serviceService.updateCategory(parsed.data);
    revalidatePath(ROUTES.services);
    return success(category);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to update category",
    );
  }
}

export async function deleteServiceCategoryAction(
  id: string,
): Promise<ActionResult<void>> {
  const auth = await authorizeAction([UserRole.ADMIN, UserRole.MANAGER]);
  if (!isSuccess(auth)) return auth;

  try {
    await serviceService.deleteCategory(id);
    revalidatePath(ROUTES.services);
    return success(undefined);
  } catch {
    return failure("Failed to delete category");
  }
}
