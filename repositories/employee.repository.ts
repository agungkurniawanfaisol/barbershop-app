import { prisma } from "@/lib/prisma";
import { notDeleted, softDeleteData } from "@/repositories/base.repository";
import type { UserRole } from "@/app/generated/prisma/client";
import type { PaginationInput } from "@/schemas/common.schema";
import type { CreateEmployeeInput, UpdateEmployeeInput } from "@/schemas/employee.schema";
import { parseOptionalDate } from "@/lib/format";

export class EmployeeRepository {
  async findMany(params: PaginationInput) {
    const { page, limit, search } = params;
    const where = {
      ...notDeleted,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
              { phone: { contains: search } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.employee.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return prisma.employee.findFirst({ where: { id, ...notDeleted } });
  }

  async findByUserId(userId: string) {
    return prisma.employee.findFirst({
      where: { userId, ...notDeleted, isActive: true },
    });
  }

  async linkUser(employeeId: string, userId: string | null) {
    if (userId) {
      const existing = await prisma.employee.findFirst({
        where: {
          userId,
          ...notDeleted,
          id: { not: employeeId },
        },
      });
      if (existing) {
        throw new Error("Akun login sudah terhubung ke pegawai lain");
      }
    }

    return prisma.employee.update({
      where: { id: employeeId },
      data: { userId },
    });
  }

  async listBarberUsersForLink(employeeId?: string) {
    return prisma.user.findMany({
      where: {
        ...notDeleted,
        isActive: true,
        role: "BARBER",
        OR: [
          { employee: { is: null } },
          ...(employeeId
            ? [{ employee: { is: { id: employeeId } } }]
            : []),
        ],
      },
      select: { id: true, fullName: true, email: true },
      orderBy: { fullName: "asc" },
    });
  }

  async create(input: CreateEmployeeInput) {
    return prisma.employee.create({
      data: {
        name: input.name,
        phone: input.phone || null,
        email: input.email || null,
        address: input.address || null,
        photoUrl: input.photoUrl || null,
        role: input.role as UserRole,
        commissionRate: input.commissionRate,
        salary: input.salary,
        isActive: input.isActive,
        hireDate: parseOptionalDate(input.hireDate ?? null),
      },
    });
  }

  async update(input: UpdateEmployeeInput) {
    const { id, ...data } = input;
    return prisma.employee.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone || null }),
        ...(data.email !== undefined && { email: data.email || null }),
        ...(data.address !== undefined && { address: data.address || null }),
        ...(data.photoUrl !== undefined && {
          photoUrl: data.photoUrl || null,
        }),
        ...(data.role !== undefined && { role: data.role as UserRole }),
        ...(data.commissionRate !== undefined && {
          commissionRate: data.commissionRate,
        }),
        ...(data.salary !== undefined && { salary: data.salary }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.hireDate !== undefined && {
          hireDate: parseOptionalDate(data.hireDate ?? null),
        }),
        ...(data.userId !== undefined && { userId: data.userId }),
      },
    });
  }

  async softDelete(id: string) {
    return prisma.employee.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  async listActive() {
    return prisma.employee.findMany({
      where: { ...notDeleted, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, role: true },
    });
  }
}

export const employeeRepository = new EmployeeRepository();
