import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { EarningsPeriod } from "@/constants/barber-earnings";
import { isEarningsPeriod } from "@/constants/barber-earnings";
import { barberEarningsRepository } from "@/repositories/barber-earnings.repository";
import { employeeRepository } from "@/repositories/employee.repository";
import { toNumber } from "@/lib/format";
import { resolveTransactionCommission } from "@/utils/barber-commission";

export type { EarningsPeriod } from "@/constants/barber-earnings";

export type BarberEarningsTransactionDto = {
  id: string;
  transactionNumber: string;
  paidAt: string;
  customerName: string | null;
  netAmount: number;
  commissionAmount: number;
};

export type BarberEarningsPageDto = {
  employeeId: string;
  employeeName: string;
  commissionRate: number;
  period: EarningsPeriod;
  rangeLabel: string;
  haircutCount: number;
  commissionTotal: number;
  transactions: BarberEarningsTransactionDto[];
};

function getRange(period: EarningsPeriod, reference = new Date()) {
  switch (period) {
    case "day":
      return {
        from: startOfDay(reference),
        to: endOfDay(reference),
        label: "Hari ini",
      };
    case "week":
      return {
        from: startOfWeek(reference, { weekStartsOn: 1 }),
        to: endOfWeek(reference, { weekStartsOn: 1 }),
        label: "Minggu ini",
      };
    case "month":
      return {
        from: startOfMonth(reference),
        to: endOfMonth(reference),
        label: "Bulan ini",
      };
  }
}

function parsePeriod(value: string | undefined): EarningsPeriod {
  return isEarningsPeriod(value) ? value : "day";
}

export class BarberEarningsService {
  async getEmployeeForUser(userId: string) {
    const employee = await employeeRepository.findByUserId(userId);
    if (!employee) {
      throw new Error(
        "Profil pegawai tidak ditemukan. Hubungi admin untuk menghubungkan akun Anda.",
      );
    }
    return employee;
  }

  async getPageData(
    userId: string,
    periodParam?: string,
  ): Promise<BarberEarningsPageDto> {
    const period = parsePeriod(periodParam);
    const employee = await this.getEmployeeForUser(userId);
    const commissionRate = toNumber(employee.commissionRate);
    const range = getRange(period);

    const rows = await barberEarningsRepository.findCompletedByBarber(
      employee.id,
      { from: range.from, to: range.to },
    );

    const transactions: BarberEarningsTransactionDto[] = rows.map((row) => {
      const subtotal = toNumber(row.subtotal);
      const discountAmount = toNumber(row.discountAmount);
      const netAmount = Math.max(0, subtotal - discountAmount);
      const commissionAmount = resolveTransactionCommission(
        subtotal,
        discountAmount,
        row.barberCommissionRate != null
          ? toNumber(row.barberCommissionRate)
          : null,
        row.barberCommissionAmount != null
          ? toNumber(row.barberCommissionAmount)
          : null,
        commissionRate,
      );

      return {
        id: row.id,
        transactionNumber: row.transactionNumber,
        paidAt: row.paidAt.toISOString(),
        customerName: row.customer?.name ?? null,
        netAmount,
        commissionAmount,
      };
    });

    const commissionTotal = transactions.reduce(
      (sum, tx) => sum + tx.commissionAmount,
      0,
    );

    return {
      employeeId: employee.id,
      employeeName: employee.name,
      commissionRate,
      period,
      rangeLabel: range.label,
      haircutCount: transactions.length,
      commissionTotal,
      transactions,
    };
  }

  async getTodaySummary(userId: string) {
    const data = await this.getPageData(userId, "day");
    return {
      haircutCount: data.haircutCount,
      commissionTotal: data.commissionTotal,
      commissionRate: data.commissionRate,
      employeeName: data.employeeName,
    };
  }
}

export const barberEarningsService = new BarberEarningsService();
