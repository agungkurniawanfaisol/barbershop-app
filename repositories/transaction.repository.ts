import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/repositories/base.repository";
import type { PaginationInput } from "@/schemas/common.schema";
import type { CheckoutInput } from "@/schemas/transaction.schema";
import type { PaymentMethod } from "@/app/generated/prisma/client";
import { calculatePosTotals } from "@/utils/pos-calculations";
import { calculateBarberCommission } from "@/utils/barber-commission";

async function generateTransactionNumber(): Promise<string> {
  const today = format(new Date(), "yyyyMMdd");
  const prefix = `TRX-${today}`;
  const count = await prisma.transaction.count({
    where: {
      transactionNumber: { startsWith: prefix },
      ...notDeleted,
    },
  });
  return `${prefix}-${String(count + 1).padStart(4, "0")}`;
}

export class TransactionRepository {
  async findMany(params: PaginationInput) {
    const { page, limit, search } = params;
    const where = {
      ...notDeleted,
      ...(search
        ? {
            OR: [
              {
                transactionNumber: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                customer: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          customer: true,
          barber: true,
          cashier: true,
          items: { where: notDeleted },
        },
        orderBy: { paidAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    return prisma.transaction.findFirst({
      where: { id, ...notDeleted },
      include: {
        customer: true,
        barber: true,
        cashier: true,
        items: { where: notDeleted },
      },
    });
  }

  async createCheckout(input: CheckoutInput, cashierId: string) {
    const totals = calculatePosTotals(input);
    const transactionNumber = await generateTransactionNumber();

    let barberCommissionRate: number | null = null;
    let barberCommissionAmount: number | null = null;

    if (input.barberId) {
      const barber = await prisma.employee.findFirst({
        where: { id: input.barberId, ...notDeleted, isActive: true },
        select: { commissionRate: true },
      });
      if (barber) {
        const rate = Number(barber.commissionRate);
        const commission = calculateBarberCommission(
          totals.subtotal,
          totals.discountAmount,
          rate,
        );
        barberCommissionRate = commission.commissionRate;
        barberCommissionAmount = commission.commissionAmount;
      }
    }

    return prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          transactionNumber,
          customerId: input.customerId ?? null,
          barberId: input.barberId ?? null,
          cashierId,
          subtotal: totals.subtotal,
          discountAmount: totals.discountAmount,
          discountPercent: input.discountPercent,
          taxAmount: totals.taxAmount,
          taxPercent: input.taxPercent,
          total: totals.total,
          barberCommissionRate,
          barberCommissionAmount,
          paymentMethod: input.paymentMethod as PaymentMethod,
          notes: input.notes ?? null,
          items: {
            create: input.items.map((item) => ({
              serviceId: item.serviceId,
              serviceName: item.serviceName,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          customer: true,
          barber: true,
          cashier: true,
          items: true,
        },
      });

      if (input.customerId) {
        await tx.customer.update({
          where: { id: input.customerId },
          data: {
            visitCount: { increment: 1 },
            lastVisit: new Date(),
            loyaltyPoints: { increment: 1 },
          },
        });
      }

      return transaction;
    });
  }
}

export const transactionRepository = new TransactionRepository();
