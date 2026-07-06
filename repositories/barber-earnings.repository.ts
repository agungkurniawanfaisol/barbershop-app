import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/repositories/base.repository";
import type { TransactionStatus } from "@/app/generated/prisma/client";

const COMPLETED: TransactionStatus = "COMPLETED";

export type BarberEarningsRow = {
  id: string;
  transactionNumber: string;
  paidAt: Date;
  subtotal: { toNumber(): number } | number;
  discountAmount: { toNumber(): number } | number;
  barberCommissionRate: { toNumber(): number } | number | null;
  barberCommissionAmount: { toNumber(): number } | number | null;
  customer: { name: string } | null;
};

export class BarberEarningsRepository {
  async findCompletedByBarber(
    barberId: string,
    range: { from: Date; to: Date },
  ): Promise<BarberEarningsRow[]> {
    return prisma.transaction.findMany({
      where: {
        ...notDeleted,
        barberId,
        status: COMPLETED,
        paidAt: { gte: range.from, lte: range.to },
      },
      select: {
        id: true,
        transactionNumber: true,
        paidAt: true,
        subtotal: true,
        discountAmount: true,
        barberCommissionRate: true,
        barberCommissionAmount: true,
        customer: { select: { name: true } },
      },
      orderBy: { paidAt: "desc" },
    });
  }
}

export const barberEarningsRepository = new BarberEarningsRepository();
