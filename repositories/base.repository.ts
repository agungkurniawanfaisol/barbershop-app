import type { Prisma } from "@/app/generated/prisma/client";

/** Base filter to exclude soft-deleted records */
export const notDeleted = {
  deletedAt: null,
} as const;

export type SoftDeleteWhere = {
  deletedAt: null;
};

export function withNotDeleted<T extends Prisma.UserFindManyArgs>(
  args?: T,
): T & { where: SoftDeleteWhere } {
  return {
    ...args,
    where: {
      ...args?.where,
      deletedAt: null,
    },
  } as T & { where: SoftDeleteWhere };
}

export function softDeleteData() {
  return { deletedAt: new Date() };
}
