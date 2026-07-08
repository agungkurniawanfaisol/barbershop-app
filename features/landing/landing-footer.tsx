import Link from "next/link";
import { Scissors, MapPin, Phone } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import type { PublicBranding } from "@/types/branding";

const FOOTER_LINKS = [
  { href: "#gaya-potongan", label: "Gaya potongan" },
  { href: "#fitur", label: "Fitur" },
  { href: "#testimoni", label: "Testimoni" },
  { href: ROUTES.login, label: "Masuk staff" },
] as const;

type LandingFooterProps = {
  branding: PublicBranding;
};

export function LandingFooter({ branding }: LandingFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-card/60">
      <div className="landing-divider" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="max-w-sm space-y-4">
            <Link
              href={ROUTES.home}
              className="inline-flex items-center gap-3 font-semibold tracking-tight"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md">
                <Scissors className="size-4" aria-hidden />
              </span>
              <span className="font-display text-lg">{branding.shopName}</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {branding.tagline}
            </p>
            {(branding.shopAddress || branding.shopPhone) && (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {branding.shopAddress ? (
                  <li className="flex gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>{branding.shopAddress}</span>
                  </li>
                ) : null}
                {branding.shopPhone ? (
                  <li className="flex gap-2">
                    <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <a
                      href={`tel:${branding.shopPhone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-foreground"
                    >
                      {branding.shopPhone}
                    </a>
                  </li>
                ) : null}
              </ul>
            )}
          </div>

          <nav aria-label="Footer">
            <p className="mb-4 text-sm font-semibold tracking-wide uppercase">
              Navigasi
            </p>
            <ul className="flex flex-col gap-1">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 cursor-pointer items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="landing-divider mt-12 mb-8" aria-hidden />
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {branding.shopName}. All rights reserved.
          </p>
          <p>Dibangun untuk barbershop modern di Indonesia.</p>
        </div>
      </div>
    </footer>
  );
}
