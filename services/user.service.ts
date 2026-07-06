import { userRepository } from "@/repositories/user.repository";
import { authService } from "@/services/auth.service";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PaginationInput } from "@/schemas/common.schema";
import type { InviteUserInput, UpdateUserInput } from "@/schemas/user.schema";
import type { UserRole as PrismaUserRole } from "@/app/generated/prisma/client";

export type UserDto = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  avatarUrl: string | null;
  createdAt: string;
};

function serializeUser(
  user: Awaited<ReturnType<typeof userRepository.findMany>>["data"][number],
): UserDto {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isActive: user.isActive,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
  };
}

export class UserService {
  async list(params: PaginationInput) {
    const result = await userRepository.findMany(params);
    return {
      ...result,
      data: result.data.map(serializeUser),
    };
  }

  async getById(id: string) {
    const user = await userRepository.findById(id);
    return user ? serializeUser(user) : null;
  }

  async update(input: UpdateUserInput, actorId: string) {
    const current = await userRepository.findById(input.id);
    if (!current) throw new Error("User not found");

    if (input.id === actorId) {
      if (input.isActive === false) {
        throw new Error("You cannot deactivate your own account");
      }
      if (input.role && input.role !== current.role) {
        throw new Error("You cannot change your own role");
      }
    }

    const user = await userRepository.update(input.id, {
      ...(input.fullName !== undefined && { fullName: input.fullName }),
      ...(input.role !== undefined && { role: input.role as PrismaUserRole }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),
    });

    if (input.role !== undefined) {
      await authService.syncRoleMetadata(user.id, user.role);
    }

    return {
      user: serializeUser(user),
      previous: serializeUser(current),
    };
  }

  async invite(input: InviteUserInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error("A user with this email already exists");
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("User invitation requires SUPABASE_SERVICE_ROLE_KEY");
    }

    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: { full_name: input.fullName },
      app_metadata: { role: input.role },
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? "Failed to create auth user");
    }

    const user = await userRepository.create({
      id: data.user.id,
      email: input.email,
      fullName: input.fullName,
      role: input.role as PrismaUserRole,
    });

    await authService.syncRoleMetadata(user.id, user.role);
    return serializeUser(user);
  }
}

export const userService = new UserService();
