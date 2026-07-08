import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { transactionService } from "@/services/transaction.service";
import { settingService } from "@/services/setting.service";
import { getDefaultShopName } from "@/lib/branding";
import { PosPage } from "@/features/cashier/pos-page";
import { PageShell } from "@/components/layout/page-shell";

export const metadata = { title: "Cashier" };

export default async function CashierPage() {
  await requireRole([UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]);

  const [bootstrap, settings] = await Promise.all([
    transactionService.getPosBootstrap(),
    settingService.getShopSettings(),
  ]);
  const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 11);
  const shopName = settings.shopName || getDefaultShopName();

  return (
    <PageShell wide className="flex h-full min-h-0 flex-col">
      <PosPage
        services={bootstrap.services}
        barbers={bootstrap.barbers}
        recentCustomers={bootstrap.recentCustomers}
        taxRate={taxRate}
        shopName={shopName}
        serviceCount={bootstrap.services.length}
      />
    </PageShell>
  );
}
