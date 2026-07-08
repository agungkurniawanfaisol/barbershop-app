import { transactionRepository } from "@/repositories/transaction.repository";
import { serviceRepository } from "@/repositories/service.repository";
import { employeeRepository } from "@/repositories/employee.repository";
import { customerRepository } from "@/repositories/customer.repository";
import type { TransactionListFilterInput } from "@/schemas/transaction.schema";
import type { CheckoutInput } from "@/schemas/transaction.schema";
import { toNumber } from "@/lib/format";
import { calculatePosTotals } from "@/utils/pos-calculations";

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
  cashPaid: number | null;
  changeAmount: number | null;
  status: string;
  notes: string | null;
  whatsappSentAt: string | null;
  paidAt: string;
  items: TransactionItemDto[];
};

export type TransactionChartPointDto = {
  date: string;
  revenue: number;
  count: number;
};

export type TransactionFilterBarberDto = {
  id: string;
  name: string;
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
    cashPaid: tx.cashPaid != null ? toNumber(tx.cashPaid) : null,
    changeAmount: tx.changeAmount != null ? toNumber(tx.changeAmount) : null,
    status: tx.status,
    notes: tx.notes,
    whatsappSentAt: tx.whatsappSentAt?.toISOString() ?? null,
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
  async list(params: TransactionListFilterInput) {
    const result = await transactionRepository.findMany(params);
    return {
      ...result,
      data: result.data.map(serializeTransaction),
    };
  }

  async getChartData(
    params: TransactionListFilterInput,
  ): Promise<TransactionChartPointDto[]> {
    return transactionRepository.getRevenueChartData(params);
  }

  async getFilterBarbers(): Promise<TransactionFilterBarberDto[]> {
    const barbers = await employeeRepository.listActive();
    return barbers
      .filter((barber) => barber.role === "BARBER")
      .map((barber) => ({ id: barber.id, name: barber.name }));
  }

  async markWhatsAppSent(id: string) {
    const tx = await transactionRepository.markWhatsAppSent(id);
    return serializeTransaction(tx);
  }

  async getById(id: string) {
    const tx = await transactionRepository.findById(id);
    return tx ? serializeTransaction(tx) : null;
  }

  async checkout(input: CheckoutInput, cashierId: string) {
    const totals = calculatePosTotals(input);

    let cashPaid: number | null = null;
    let changeAmount: number | null = null;

    if (input.paymentMethod === "CASH") {
      const paid = input.cashPaid ?? 0;
      if (paid < totals.total) {
        throw new Error("Uang diterima kurang dari total pembayaran");
      }
      cashPaid = paid;
      changeAmount = paid - totals.total;
    }

    const tx = await transactionRepository.createCheckout(
      input,
      cashierId,
      { cashPaid, changeAmount },
    );
    return serializeTransaction(tx);
  }

  async getPosBootstrap() {
    const [services, barbers, recentCustomers] = await Promise.all([
      serviceRepository.findActive(),
      employeeRepository.listActive(),
      customerRepository.listRecentForPos(50),
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
      recentCustomers: recentCustomers.map(
        (c): PosCustomerDto => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          loyaltyPoints: c.loyaltyPoints,
        }),
      ),
    };
  }

  async searchCustomers(query: string): Promise<PosCustomerDto[]> {
    if (!query.trim()) return [];
    const customers = await customerRepository.searchForPos(query.trim(), 8);
    return customers.map((c) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      loyaltyPoints: c.loyaltyPoints,
    }));
  }
}

export const transactionService = new TransactionService();
