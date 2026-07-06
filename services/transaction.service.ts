import { transactionRepository } from "@/repositories/transaction.repository";
import { serviceRepository } from "@/repositories/service.repository";
import { employeeRepository } from "@/repositories/employee.repository";
import { customerRepository } from "@/repositories/customer.repository";
import type { PaginationInput } from "@/schemas/common.schema";
import type { CheckoutInput } from "@/schemas/transaction.schema";
import { toNumber } from "@/lib/format";

export type TransactionItemDto = {
  id: string;
  serviceId: string | null;
  serviceName: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type TransactionDto = {
  id: string;
  transactionNumber: string;
  customerId: string | null;
  customerName: string | null;
  customerPhone: string | null;
  barberId: string | null;
  barberName: string | null;
  cashierName: string;
  subtotal: number;
  discountAmount: number;
  discountPercent: number;
  taxAmount: number;
  taxPercent: number;
  total: number;
  paymentMethod: string;
  status: string;
  notes: string | null;
  paidAt: string;
  items: TransactionItemDto[];
};

export type PosServiceDto = {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  categoryId: string | null;
  categoryName: string | null;
};

export type PosBarberDto = {
  id: string;
  name: string;
};

export type PosCustomerDto = {
  id: string;
  name: string;
  phone: string;
  loyaltyPoints: number;
};

function serializeTransaction(
  tx: NonNullable<Awaited<ReturnType<typeof transactionRepository.findById>>>,
): TransactionDto {
  return {
    id: tx.id,
    transactionNumber: tx.transactionNumber,
    customerId: tx.customerId,
    customerName: tx.customer?.name ?? null,
    customerPhone: tx.customer?.phone ?? null,
    barberId: tx.barberId,
    barberName: tx.barber?.name ?? null,
    cashierName: tx.cashier.fullName,
    subtotal: toNumber(tx.subtotal),
    discountAmount: toNumber(tx.discountAmount),
    discountPercent: toNumber(tx.discountPercent),
    taxAmount: toNumber(tx.taxAmount),
    taxPercent: toNumber(tx.taxPercent),
    total: toNumber(tx.total),
    paymentMethod: tx.paymentMethod,
    status: tx.status,
    notes: tx.notes,
    paidAt: tx.paidAt.toISOString(),
    items: tx.items.map((item) => ({
      id: item.id,
      serviceId: item.serviceId,
      serviceName: item.serviceName,
      price: toNumber(item.price),
      quantity: item.quantity,
      lineTotal: toNumber(item.price) * item.quantity,
    })),
  };
}

export class TransactionService {
  async list(params: PaginationInput) {
    const result = await transactionRepository.findMany(params);
    return {
      ...result,
      data: result.data.map(serializeTransaction),
    };
  }

  async getById(id: string) {
    const tx = await transactionRepository.findById(id);
    return tx ? serializeTransaction(tx) : null;
  }

  async checkout(input: CheckoutInput, cashierId: string) {
    const tx = await transactionRepository.createCheckout(input, cashierId);
    return serializeTransaction(tx);
  }

  async getPosBootstrap() {
    const [services, barbers] = await Promise.all([
      serviceRepository.findActive(),
      employeeRepository.listActive(),
    ]);

    return {
      services: services.map(
        (s): PosServiceDto => ({
          id: s.id,
          name: s.name,
          price: toNumber(s.price),
          durationMinutes: s.durationMinutes,
          categoryId: s.categoryId,
          categoryName: s.category?.name ?? null,
        }),
      ),
      barbers: barbers
        .filter((b) => b.role === "BARBER")
        .map((b): PosBarberDto => ({ id: b.id, name: b.name })),
    };
  }

  async searchCustomers(query: string): Promise<PosCustomerDto[]> {
    if (!query.trim()) return [];
    const result = await customerRepository.findMany({
      page: 1,
      limit: 8,
      search: query.trim(),
    });
    return result.data.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      loyaltyPoints: c.loyaltyPoints,
    }));
  }
}

export const transactionService = new TransactionService();
