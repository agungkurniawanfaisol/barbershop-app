import { prisma } from "@/lib/prisma";
import { notDeleted, softDeleteData } from "@/repositories/base.repository";
import type { PaginationInput } from "@/schemas/common.schema";
import type { User, UserRole } from "@/app/generated/prisma/client";

export class UserRepository {
  async findMany(params: PaginationInput) {
    const { page, limit, search } = params;
    const where = {
      ...notDeleted,
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { id, ...notDeleted },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: { email, ...notDeleted },
    });
  }

  async create(data: {
    id: string;
    email: string;
    fullName: string;
    role?: UserRole;
    avatarUrl?: string | null;
  }): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(
    id: string,
    data: Partial<
      Pick<User, "fullName" | "role" | "isActive" | "avatarUrl">
    >,
  ): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: softDeleteData(),
    });
  }
}

export const userRepository = new UserRepository();
