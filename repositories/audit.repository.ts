import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/repositories/base.repository";
import type { PaginationInput } from "@/schemas/common.schema";
import type { Prisma } from "@/app/generated/prisma/client";

export type CreateAuditLogInput = {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  oldValue?: Prisma.InputJsonValue;
  newValue?: Prisma.InputJsonValue;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export class AuditRepository {
  async findMany(params: PaginationInput & { entity?: string }) {
    const { page, limit, search, entity } = params;
    const where = {
      ...notDeleted,
      ...(entity ? { entity } : {}),
      ...(search
        ? {
            OR: [
              { action: { contains: search, mode: "insensitive" as const } },
              { entity: { contains: search, mode: "insensitive" as const } },
              {
                user: {
                  fullName: { contains: search, mode: "insensitive" as const },
                },
              },
              {
                user: {
                  email: { contains: search, mode: "insensitive" as const },
                },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { user: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(input: CreateAuditLogInput) {
    return prisma.auditLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        oldValue: input.oldValue ?? undefined,
        newValue: input.newValue ?? undefined,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      },
      include: { user: true },
    });
  }
}

export const auditRepository = new AuditRepository();
