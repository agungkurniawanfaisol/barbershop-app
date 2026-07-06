import { customerRepository } from "@/repositories/customer.repository";
import type { PaginationInput } from "@/schemas/common.schema";
import type { CreateCustomerInput, UpdateCustomerInput } from "@/schemas/customer.schema";

export type CustomerDto = {
  id: string;
  name: string;
  phone: string;
  gender: string | null;
  birthday: string | null;
  visitCount: number;
  lastVisit: string | null;
  favoriteBarberId: string | null;
  favoriteBarberName: string | null;
  notes: string | null;
  loyaltyPoints: number;
  createdAt: string;
};

function serializeCustomer(
  customer: Awaited<ReturnType<typeof customerRepository.findById>>,
): CustomerDto | null {
  if (!customer) return null;
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    gender: customer.gender,
    birthday: customer.birthday?.toISOString() ?? null,
    visitCount: customer.visitCount,
    lastVisit: customer.lastVisit?.toISOString() ?? null,
    favoriteBarberId: customer.favoriteBarberId,
    favoriteBarberName: customer.favoriteBarber?.name ?? null,
    notes: customer.notes,
    loyaltyPoints: customer.loyaltyPoints,
    createdAt: customer.createdAt.toISOString(),
  };
}

export class CustomerService {
  async list(params: PaginationInput) {
    const result = await customerRepository.findMany(params);
    return {
      ...result,
      data: result.data.map((c) => serializeCustomer(c)!),
    };
  }

  async getById(id: string) {
    const customer = await customerRepository.findById(id);
    return serializeCustomer(customer);
  }

  async create(input: CreateCustomerInput) {
    const existing = await customerRepository.findByPhone(input.phone);
    if (existing) {
      throw new Error("A customer with this phone number already exists");
    }
    const customer = await customerRepository.create(input);
    return serializeCustomer(customer)!;
  }

  async update(input: UpdateCustomerInput) {
    const current = await customerRepository.findById(input.id);
    if (!current) throw new Error("Customer not found");

    if (input.phone && input.phone !== current.phone) {
      const existing = await customerRepository.findByPhone(input.phone);
      if (existing) {
        throw new Error("A customer with this phone number already exists");
      }
    }

    const customer = await customerRepository.update(input);
    return serializeCustomer(customer)!;
  }

  async delete(id: string) {
    await customerRepository.softDelete(id);
  }

  async getBarberOptions() {
    return customerRepository.listBarbers();
  }
}

export const customerService = new CustomerService();
