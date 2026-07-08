import { UserRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth/session";
import { landingService } from "@/services/landing.service";
import { LandingAdminPanel } from "@/features/landing-admin/landing-admin-panel";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = { title: "Landing Page" };

export default async function LandingAdminPage() {
  await requireRole([UserRole.ADMIN, UserRole.MANAGER]);

  const data = await landingService.getAdminData();

  return (
    <PageShell>
      <PageHeader description="Kelola konten halaman beranda publik." />
      <LandingAdminPanel data={data} />
    </PageShell>
  );
}
