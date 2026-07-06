import type { User as SupabaseUser } from "@supabase/supabase-js";
import { UserRole, isUserRole } from "@/constants/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { userRepository } from "@/repositories/user.repository";
import type { User } from "@/app/generated/prisma/client";
import type { UserRole as PrismaUserRole } from "@/app/generated/prisma/client";

function resolveFullName(
  supabaseUser: SupabaseUser,
  fallbackEmail: string,
): string {
  const metadata = supabaseUser.user_metadata as
    | { full_name?: string; fullName?: string }
    | undefined;

  return (
    metadata?.full_name ??
    metadata?.fullName ??
    fallbackEmail.split("@")[0] ??
    "User"
  );
}

function resolveRole(value: unknown): PrismaUserRole {
  if (typeof value === "string" && isUserRole(value)) {
    return value as PrismaUserRole;
  }
  return UserRole.CASHIER as PrismaUserRole;
}

export class AuthService {
  async syncUser(supabaseUser: SupabaseUser): Promise<User> {
    const email = supabaseUser.email;
    if (!email) {
      throw new Error("Supabase user is missing an email address");
    }

    const existing =
      (await userRepository.findById(supabaseUser.id)) ??
      (await userRepository.findByEmail(email));

    const avatarUrl =
      (supabaseUser.user_metadata as { avatar_url?: string } | undefined)
        ?.avatar_url ?? null;

    const user = existing
      ? await userRepository.update(existing.id, {
          fullName: resolveFullName(supabaseUser, email),
          avatarUrl,
        })
      : await userRepository.create({
          id: supabaseUser.id,
          email,
          fullName: resolveFullName(supabaseUser, email),
          role: resolveRole(supabaseUser.app_metadata?.role),
          avatarUrl,
        });

    await this.syncRoleMetadata(user.id, user.role);
    return user;
  }

  async syncRoleMetadata(
    userId: string,
    role: PrismaUserRole,
  ): Promise<void> {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;

    const admin = createAdminClient();
    await admin.auth.admin.updateUserById(userId, {
      app_metadata: { role },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return userRepository.findById(id);
  }
}

export const authService = new AuthService();
