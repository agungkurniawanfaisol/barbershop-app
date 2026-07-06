import type { UserRole } from "@/constants/roles";

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  avatarUrl: string | null;
};
