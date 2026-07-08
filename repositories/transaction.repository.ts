import { format, endOfDay, startOfDay, subDays, eachDayOfInterval } from "date-fns";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/repositories/base.repository";
import { toNumber } from "@/lib/format";
import type { TransactionListFilterInput } from "@/schemas/transaction.schema";
import type { CheckoutInput } from "@/schemas/transaction.schema";
import type { PaymentMethod } from "@/app/generated/prisma/client";
import { calculatePosTotals } from "@/utils/pos-calculations";
import { calculateBarberCommission } from "@/utils/barber-commission";

const COMPLETED = {
  ...notDeleted,
  status: "COMPLETED" as const,
};

function buildTransactionWhere(params: Pick<
  TransactionListFilterInput,
  "search" | "paymentMethod" | "from" | "to" | "barberId" | "whatsapp"
>) {
  const { search, paymentMethod, from, to, barberId, whatsapp } = params;

  return {
    ...COMPLETED,
    ...(paymentMethod ? { paymentMethod: paymentMethod as PaymentMethod } : {}),
    ...(barberId ? { barberId } : {}),
    ...(from || to
      ? {
          paidAt: {
            ...(from ? { gte: startOfDay(new Date(from)) } : {}),
            ...(to ? { lte: endOfDay(new Date(to)) } : {}),
          },
        }
      : {}),
    ...(whatsapp === "sent"
      ? { whatsappSentAt: { not: null } }
      : whatsapp === "not_sent"
        ? { whatsappSentAt: null }
        : {}),
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
}

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
  async findMany(params: TransactionListFilterInput) {
    const { page, limit, sortBy, sortOrder } = params;
    const where = buildTransactionWhere(params);

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          customer: true,
          barber: true,
          cashier: true,
          items: { where: notDeleted },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transaction.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getRevenueChartData(
    params: Pick<
      TransactionListFilterInput,
      | "paymentMethod"
      | "from"
      | "to"
      | "barberId"
      | "whatsapp"
      | "search"
    >,
  ) {
    const end = params.to ? endOfDay(new Date(params.to)) : new Date();
    const start = params.from
      ? startOfDay(new Date(params.from))
      : startOfDay(subDays(end, 29));

    const where = {
      ...buildTransactionWhere({ ...params, whatsapp: params.whatsapp ?? "all" }),
      paidAt: { gte: start, lte: end },
    };

    const rows = await prisma.transaction.findMany({
      where,
      select: { paidAt: true, total: true },
      orderBy: { paidAt: "asc" },
    });

    const revenueByDate = new Map<string, { revenue: number; count: number }>();
    for (const day of eachDayOfInterval({ start, end })) {
      revenueByDate.set(format(day, "yyyy-MM-dd"), { revenue: 0, count: 0 });
    }

    for (const row of rows) {
      const key = format(row.paidAt, "yyyy-MM-dd");
      const current = revenueByDate.get(key) ?? { revenue: 0, count: 0 };
      revenueByDate.set(key, {
        revenue: current.revenue + toNumber(row.total),
        count: current.count + 1,
      });
    }

    return Array.from(revenueByDate.entries()).map(([date, point]) => ({
      date,
      revenue: point.revenue,
      count: point.count,
    }));
  }

  async markWhatsAppSent(id: string) {
    return prisma.transaction.update({
      where: { id },
      data: { whatsappSentAt: new Date() },
      include: {
        customer: true,
        barber: true,
        cashier: true,
        items: { where: notDeleted },
      },
    });
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

  async createCheckout(
    input: CheckoutInput,
    cashierId: string,
    cash: { cashPaid: number | null; changeAmount: number | null },
  ) {
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
          cashPaid: cash.cashPaid,
          changeAmount: cash.changeAmount,
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
