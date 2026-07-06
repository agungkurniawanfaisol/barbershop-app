import {
  serviceCategoryRepository,
  serviceRepository,
} from "@/repositories/service.repository";
import type { PaginationInput } from "@/schemas/common.schema";
import type {
  CreateServiceCategoryInput,
  CreateServiceInput,
  UpdateServiceCategoryInput,
  UpdateServiceInput,
} from "@/schemas/service.schema";
import { toNumber } from "@/lib/format";

export type ServiceCategoryDto = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type ServiceDto = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  categoryId: string | null;
  categoryName: string | null;
  isActive: boolean;
  createdAt: string;
};

function serializeCategory(
  category: Awaited<ReturnType<typeof serviceCategoryRepository.findById>>,
): ServiceCategoryDto | null {
  if (!category) return null;
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
  };
}

function serializeService(
  service: NonNullable<Awaited<ReturnType<typeof serviceRepository.findById>>>,
): ServiceDto {
  return {
    id: service.id,
    name: service.name,
    description: service.description,
    price: toNumber(service.price),
    durationMinutes: service.durationMinutes,
    categoryId: service.categoryId,
    categoryName: service.category?.name ?? null,
    isActive: service.isActive,
    createdAt: service.createdAt.toISOString(),
  };
}

export class ServiceService {
  async listServices(params: PaginationInput & { categoryId?: string }) {
    const result = await serviceRepository.findMany(params);
    return {
      ...result,
      data: result.data.map(serializeService),
    };
  }

  async getServiceById(id: string) {
    const service = await serviceRepository.findById(id);
    return service ? serializeService(service) : null;
  }

  async createService(input: CreateServiceInput) {
    const service = await serviceRepository.create(input);
    return serializeService(service);
  }

  async updateService(input: UpdateServiceInput) {
    const current = await serviceRepository.findById(input.id);
    if (!current) throw new Error("Service not found");
    const service = await serviceRepository.update(input);
    return serializeService(service);
  }

  async deleteService(id: string) {
    await serviceRepository.softDelete(id);
  }

  async listCategories() {
    const categories = await serviceCategoryRepository.findAll();
    return categories.map((c) => serializeCategory(c)!);
  }

  async createCategory(input: CreateServiceCategoryInput) {
    const category = await serviceCategoryRepository.create(input);
    return serializeCategory(category)!;
  }

  async updateCategory(input: UpdateServiceCategoryInput) {
    const category = await serviceCategoryRepository.update(input);
    return serializeCategory(category)!;
  }

  async deleteCategory(id: string) {
    await serviceCategoryRepository.softDelete(id);
  }
}

export const serviceService = new ServiceService();
