import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { transactionService } from "@/services/transaction.service";
import { PosPage } from "@/features/cashier/pos-page";
import { PageShell } from "@/components/layout/page-shell";

export const metadata = { title: "Cashier" };

export default async function CashierPage() {
  await requireRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]);

  const bootstrap = await transactionService.getPosBootstrap();
  const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 11);
  const shopName = process.env.NEXT_PUBLIC_SHOP_NAME ?? "BarberPro";

  return (
    <PageShell wide className="flex h-full min-h-0 flex-col">
      <PosPage
        services={bootstrap.services}
        barbers={bootstrap.barbers}
        taxRate={taxRate}
        shopName={shopName}
        serviceCount={bootstrap.services.length}
      />
    </PageShell>
  );
}
