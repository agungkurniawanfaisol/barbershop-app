import { prisma } from "@/lib/prisma";
import { notDeleted, softDeleteData } from "@/repositories/base.repository";
import type { ExpenseCategory } from "@/constants/expenses";
import type { PaginationInput } from "@/schemas/common.schema";
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
} from "@/schemas/expense.schema";
import { parseOptionalDate } from "@/lib/format";

export class ExpenseRepository {
  async findMany(params: PaginationInput & { category?: string }) {
    const { page, limit, search, category } = params;
    const where = {
      ...notDeleted,
      ...(category ? { category: category as ExpenseCategory } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              {
                description: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: { recordedBy: true },
        orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return prisma.expense.findFirst({
      where: { id, ...notDeleted },
      include: { recordedBy: true },
    });
  }

  async create(input: CreateExpenseInput, recordedById: string) {
    const expenseDate = parseOptionalDate(input.expenseDate);
    if (!expenseDate) {
      throw new Error("Invalid expense date");
    }

    return prisma.expense.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        amount: input.amount,
        category: input.category as ExpenseCategory,
        expenseDate,
        recordedById,
      },
      include: { recordedBy: true },
    });
  }

  async update(input: UpdateExpenseInput) {
    const { id, ...data } = input;
    const expenseDate =
      data.expenseDate !== undefined
        ? parseOptionalDate(data.expenseDate ?? null)
        : undefined;

    if (data.expenseDate !== undefined && !expenseDate) {
      throw new Error("Invalid expense date");
    }

    return prisma.expense.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description ?? null,
        }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.category !== undefined && { category: data.category }),
        ...(expenseDate && { expenseDate }),
      },
      include: { recordedBy: true },
    });
  }

  async softDelete(id: string) {
    return prisma.expense.update({
      where: { id },
      data: softDeleteData(),
    });
  }

  async sumInRange(from: Date, to: Date) {
    const result = await prisma.expense.aggregate({
      where: {
        ...notDeleted,
        expenseDate: { gte: from, lte: to },
      },
      _sum: { amount: true },
      _count: true,
    });

    return {
      total: result._sum.amount,
      count: result._count,
    };
  }

  async sumByCategoryInRange(from: Date, to: Date) {
    return prisma.expense.groupBy({
      by: ["category"],
      where: {
        ...notDeleted,
        expenseDate: { gte: from, lte: to },
      },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: "desc" } },
    });
  }
}

export const expenseRepository = new ExpenseRepository();
