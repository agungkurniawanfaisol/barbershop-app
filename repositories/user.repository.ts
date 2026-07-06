import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/repositories/base.repository";
import type { User, UserRole } from "@/app/generated/prisma/client";

export class UserRepository {
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
  }): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(
    id: string,
    data: Partial<Pick<User, "fullName" | "role" | "isActive" | "avatarUrl">>,
  ): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }
}

export const userRepository = new UserRepository();
