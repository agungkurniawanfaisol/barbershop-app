import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { settingService } from "@/services/setting.service";
import { SettingsForm } from "@/features/settings/settings-form";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireRole([UserRole.ADMIN, UserRole.MANAGER]);
  const settings = await settingService.getShopSettings();

  return (
    <PageShell className="max-w-3xl">
      <PageHeader description="Atur profil toko, tarif pajak, dan opsi struk." />
      <SettingsForm settings={settings} />
    </PageShell>
  );
}
