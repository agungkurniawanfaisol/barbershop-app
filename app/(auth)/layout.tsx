import Link from "next/link";
import { Scissors, Shield, Zap } from "lucide-react";
import { LandingHeader } from "@/features/landing/landing-header";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";

const TRUST_POINTS = [
  { icon: Shield, text: "Role-based access control" },
  { icon: Zap, text: "Kasir & laporan real-time" },
] as const;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <LandingHeader />
      <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-2">
        <div className="landing-mesh relative hidden overflow-hidden border-r lg:flex lg:flex-col lg:justify-center lg:px-10 lg:py-8 xl:px-14">
          <div
            className="landing-dot-pattern pointer-events-none absolute inset-0 opacity-30"
            aria-hidden
          />
          <div className="relative z-10 mx-auto w-full max-w-md space-y-8">
            <blockquote className="space-y-3">
              <p className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance xl:text-4xl">
                Kelola barbershop dengan{" "}
                <span className="text-primary">presisi</span> dan{" "}
                <span className="text-accent">kecepatan</span>.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Dashboard, POS, pelanggan, dan laporan keuangan — terintegrasi
                untuk tim yang sibuk melayani pelanggan.
              </p>
            </blockquote>

            <ul className="space-y-2.5">
              {TRUST_POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {text}
                </li>
              ))}
            </ul>

            <Link
              href={ROUTES.home}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Scissors className="size-4" aria-hidden />
              </span>
              Kembali ke {siteConfig.name}
            </Link>
          </div>
        </div>

        <div className="flex min-h-0 items-center justify-center overflow-y-auto px-4 py-6 pt-20 sm:px-8 sm:py-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
