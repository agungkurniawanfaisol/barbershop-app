import { requireSessionUser } from "@/lib/auth/session";
import { getAuthUser } from "@/lib/auth/session";
import { authService } from "@/services/auth.service";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSessionUser();

  const authUser = await getAuthUser();
  if (authUser) {
    await authService.syncUser(authUser);
  }

  return (
    <div className="app-density-compact flex h-dvh overflow-hidden bg-background lg:gap-2 lg:p-2">
      <div className="hidden shrink-0 lg:flex">
        <AppSidebar user={user} className="h-full max-h-[calc(100dvh-1rem)]" />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader user={user} />
        <main className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain bg-muted/30 p-2 sm:p-3 lg:p-4">
          <div className="mx-auto flex w-full min-w-0 min-h-0 flex-1 flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
