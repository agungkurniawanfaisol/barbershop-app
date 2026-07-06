import { auditRepository } from "@/repositories/audit.repository";
import type { CreateAuditLogInput } from "@/repositories/audit.repository";
import type { PaginationInput } from "@/schemas/common.schema";
import type { Prisma } from "@/app/generated/prisma/client";

export type AuditLogDto = {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  oldValue: unknown;
  newValue: unknown;
  createdAt: string;
};

function serializeAuditLog(
  log: Awaited<ReturnType<typeof auditRepository.findMany>>["data"][number],
): AuditLogDto {
  return {
    id: log.id,
    userId: log.userId,
    userName: log.user?.fullName ?? null,
    userEmail: log.user?.email ?? null,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    oldValue: log.oldValue,
    newValue: log.newValue,
    createdAt: log.createdAt.toISOString(),
  };
}

export class AuditService {
  async list(params: PaginationInput & { entity?: string }) {
    const result = await auditRepository.findMany(params);
    return {
      ...result,
      data: result.data.map(serializeAuditLog),
    };
  }

  async log(input: CreateAuditLogInput) {
    return auditRepository.create(input);
  }

  async logChange(input: {
    userId: string;
    action: "CREATE" | "UPDATE" | "DELETE" | "INVITE";
    entity: string;
    entityId?: string | null;
    oldValue?: unknown;
    newValue?: unknown;
  }) {
    return this.log({
      userId: input.userId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId ?? null,
      oldValue: input.oldValue as Prisma.InputJsonValue | undefined,
      newValue: input.newValue as Prisma.InputJsonValue | undefined,
    });
  }
}

export const auditService = new AuditService();
