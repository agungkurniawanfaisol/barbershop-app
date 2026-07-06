import { prisma } from "@/lib/prisma";
import { notDeleted, softDeleteData } from "@/repositories/base.repository";
import type { PaginationInput } from "@/schemas/common.schema";
import type {
  CreateServiceInput,
  CreateServiceCategoryInput,
  UpdateServiceInput,
  UpdateServiceCategoryInput,
} from "@/schemas/service.schema";

export class ServiceCategoryRepository {
  async findAll() {
    return prisma.serviceCategory.findMany({
      where: notDeleted,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }

  async findById(id: string) {
    return prisma.serviceCategory.findFirst({
      where: { id, ...notDeleted },
    });
  }

  async create(input: CreateServiceCategoryInput) {
    return prisma.serviceCategory.create({ data: input });
  }

  async update(input: UpdateServiceCategoryInput) {
    const { id, ...data } = input;
    return prisma.serviceCategory.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return prisma.serviceCategory.update({
      where: { id },
      data: softDeleteData(),
    });
  }
}

export class ServiceRepository {
  async findMany(params: PaginationInput & { categoryId?: string }) {
    const { page, limit, search, categoryId } = params;
    const where = {
      ...notDeleted,
      ...(categoryId ? { categoryId } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { description: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: { category: true },
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.service.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findActive() {
    return prisma.service.findMany({
      where: { ...notDeleted, isActive: true },
      include: { category: true },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.service.findFirst({
      where: { id, ...notDeleted },
      include: { category: true },
    });
  }

  async create(input: CreateServiceInput) {
    return prisma.service.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        price: input.price,
        durationMinutes: input.durationMinutes,
        categoryId: input.categoryId ?? null,
        isActive: input.isActive,
      },
      include: { category: true },
    });
  }

  async update(input: UpdateServiceInput) {
    const { id, ...data } = input;
    return prisma.service.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description ?? null,
        }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.durationMinutes !== undefined && {
          durationMinutes: data.durationMinutes,
        }),
        ...(data.categoryId !== undefined && {
          categoryId: data.categoryId ?? null,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: { category: true },
    });
  }

  async softDelete(id: string) {
    return prisma.service.update({
      where: { id },
      data: softDeleteData(),
    });
  }
}

export const serviceCategoryRepository = new ServiceCategoryRepository();
export const serviceRepository = new ServiceRepository();
