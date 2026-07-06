import { employeeRepository } from "@/repositories/employee.repository";
import { settingService } from "@/services/setting.service";
import type { PaginationInput } from "@/schemas/common.schema";
import type { CreateEmployeeInput, UpdateEmployeeInput } from "@/schemas/employee.schema";
import { toNumber } from "@/lib/format";

export type EmployeeDto = {
  id: string;
  userId: string | null;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  photoUrl: string | null;
  role: string;
  commissionRate: number;
  salary: number;
  isActive: boolean;
  hireDate: string | null;
  createdAt: string;
};

function serializeEmployee(
  employee: NonNullable<Awaited<ReturnType<typeof employeeRepository.findById>>>,
): EmployeeDto {
  return {
    id: employee.id,
    userId: employee.userId,
    name: employee.name,
    phone: employee.phone,
    email: employee.email,
    address: employee.address,
    photoUrl: employee.photoUrl,
    role: employee.role,
    commissionRate: toNumber(employee.commissionRate),
    salary: toNumber(employee.salary),
    isActive: employee.isActive,
    hireDate: employee.hireDate?.toISOString() ?? null,
    createdAt: employee.createdAt.toISOString(),
  };
}

export class EmployeeService {
  async list(params: PaginationInput) {
    const result = await employeeRepository.findMany(params);
    return {
      ...result,
      data: result.data.map(serializeEmployee),
    };
  }

  async getById(id: string) {
    const employee = await employeeRepository.findById(id);
    return employee ? serializeEmployee(employee) : null;
  }

  async create(input: CreateEmployeeInput) {
    const settings = await settingService.getShopSettings();
    const payload = {
      ...input,
      commissionRate:
        input.commissionRate > 0
          ? input.commissionRate
          : settings.defaultCommissionRate,
    };
    const employee = await employeeRepository.create(payload);
    return serializeEmployee(employee);
  }

  async linkUser(employeeId: string, userId: string | null) {
    const employee = await employeeRepository.linkUser(employeeId, userId);
    return serializeEmployee(employee);
  }

  async listBarberUsersForLink(employeeId?: string) {
    return employeeRepository.listBarberUsersForLink(employeeId);
  }

  async update(input: UpdateEmployeeInput) {
    const current = await employeeRepository.findById(input.id);
    if (!current) throw new Error("Employee not found");
    const employee = await employeeRepository.update(input);
    return serializeEmployee(employee);
  }

  async delete(id: string) {
    await employeeRepository.softDelete(id);
  }
}

export const employeeService = new EmployeeService();
