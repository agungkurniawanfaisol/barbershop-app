import { userRepository } from "@/repositories/user.repository";
import type { User, UserRole } from "@/app/generated/prisma/client";

export class UserService {
  async getById(id: string): Promise<User | null> {
    return userRepository.findById(id);
  }

  async getByEmail(email: string): Promise<User | null> {
    return userRepository.findByEmail(email);
  }

  async syncFromAuth(authUser: {
    id: string;
    email: string;
    fullName?: string;
    role?: UserRole;
  }): Promise<User> {
    const existing = await userRepository.findByEmail(authUser.email);

    if (existing) {
      return userRepository.update(existing.id, {
        fullName: authUser.fullName ?? existing.fullName,
      });
    }

    return userRepository.create({
      id: authUser.id,
      email: authUser.email,
      fullName: authUser.fullName ?? authUser.email.split("@")[0],
      role: authUser.role,
    });
  }
}

export const userService = new UserService();
