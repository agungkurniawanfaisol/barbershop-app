import { prisma } from "@/lib/prisma";
import { notDeleted, softDeleteData } from "@/repositories/base.repository";
import type { Gender } from "@/app/generated/prisma/client";
import type { PaginationInput } from "@/schemas/common.schema";
import type { CreateCustomerInput, UpdateCustomerInput } from "@/schemas/customer.schema";
import { parseOptionalDate } from "@/lib/format";

export class CustomerRepository {
  async findMany(params: PaginationInput) {
    const { page, limit, search } = params;
    const where = {
      ...notDeleted,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { phone: { contains: search } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: { favoriteBarber: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return prisma.customer.findFirst({
      where: { id, ...notDeleted },
      include: { favoriteBarber: { where: notDeleted } },
    });
  }

  async findByPhone(phone: string) {
    return prisma.customer.findFirst({
      where: { phone, ...notDeleted },
    });
  }

  async create(input: CreateCustomerInput) {
    return prisma.customer.create({
      data: {
        name: input.name,
        phone: input.phone,
        gender: (input.gender as Gender) ?? null,
        birthday: parseOptionalDate(input.birthday ?? null),
        favoriteBarberId: input.favoriteBarberId ?? null,
        notes: input.notes ?? null,
        loyaltyPoints: input.loyaltyPoints ?? 0,
      },
      include: { favoriteBarber: true },
    });
  }

  async update(input: UpdateCustomerInput) {
    const { id, ...data } = input;
    return prisma.customer.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.gender !== undefined && {
          gender: (data.gender as Gender) ?? null,
        }),
        ...(data.birthday !== undefined && {
          birthday: parseOptionalDate(data.birthday ?? null),
        }),
        ...(data.favoriteBarberId !== undefined && {
          favoriteBarberId: data.favoriteBarberId ?? null,
        }),
        ...(data.notes !== undefined && { notes: data.notes ?? null }),
        ...(data.loyaltyPoints !== undefined && {
          loyaltyPoints: data.loyaltyPoints,
        }),
      },
      include: { favoriteBarber: true },
    });
  }

  async softDelete(id: string) {
    return prisma.customer.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  async listBarbers() {
    return prisma.employee.findMany({
      where: { ...notDeleted, isActive: true, role: "BARBER" },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
  }
}

export const customerRepository = new CustomerRepository();
