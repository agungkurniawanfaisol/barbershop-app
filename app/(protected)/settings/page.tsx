import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { settingService } from "@/services/setting.service";
import { SettingsForm } from "@/features/settings/settings-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireRole([UserRole.ADMIN, UserRole.MANAGER]);
  const settings = await settingService.getShopSettings();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure shop profile, tax rate, and receipt options.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
