"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Scissors, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "#gaya-potongan", label: "Gaya" },
  { href: "#fitur", label: "Fitur" },
  { href: "#testimoni", label: "Testimoni" },
] as const;

type LandingHeaderNavProps = {
  isLoggedIn: boolean;
};

export function LandingHeaderNav({ isLoggedIn }: LandingHeaderNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <div
        className="landing-divider absolute inset-x-0 bottom-0 opacity-60"
        aria-hidden
      />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={ROUTES.home}
          className="flex min-h-11 shrink-0 items-center gap-2.5 rounded-xl font-semibold tracking-tight transition-opacity hover:opacity-90"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/85 text-primary-foreground shadow-md ring-1 ring-black/5">
            <Scissors className="size-4" aria-hidden />
          </span>
          <span className="font-display hidden text-lg sm:inline">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Navigasi halaman"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="min-h-10 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 sm:flex">
          {isLoggedIn ? (
            <Link
              href={ROUTES.dashboard}
              className={cn(
                buttonVariants({ size: "sm" }),
                "landing-shine min-h-10 bg-accent text-accent-foreground shadow-md shadow-accent/20 hover:bg-accent/90",
              )}
            >
              Buka Dashboard
            </Link>
          ) : (
            <Link
              href={ROUTES.login}
              className={cn(
                buttonVariants({ size: "sm" }),
                "landing-shine min-h-10 bg-accent text-accent-foreground shadow-md shadow-accent/20 hover:bg-accent/90",
              )}
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 sm:hidden">
          {!isLoggedIn && (
            <Link
              href={ROUTES.login}
              className={cn(
                buttonVariants({ size: "sm" }),
                "landing-shine min-h-9 px-3 text-xs bg-accent text-accent-foreground hover:bg-accent/90",
              )}
            >
              Masuk
            </Link>
          )}
          {isLoggedIn && (
            <Link
              href={ROUTES.dashboard}
              className={cn(
                buttonVariants({ size: "sm" }),
                "min-h-9 px-3 text-xs bg-accent text-accent-foreground hover:bg-accent/90",
              )}
            >
              Dashboard
            </Link>
          )}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-lg border bg-card shadow-sm"
              aria-label="Buka menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(300px,85vw)] p-0">
              <SheetTitle className="sr-only">Menu navigasi</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b px-4 py-4">
                  <span className="font-display font-semibold">
                    {siteConfig.name}
                  </span>
                  <button
                    type="button"
                    onClick={closeMenu}
                    className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-muted"
                    aria-label="Tutup menu"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <nav className="flex flex-col gap-1 p-3" aria-label="Menu mobile">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-2 border-t p-4">
                  {isLoggedIn ? (
                    <Link
                      href={ROUTES.dashboard}
                      onClick={closeMenu}
                      className={cn(
                        buttonVariants(),
                        "w-full bg-accent hover:bg-accent/90",
                      )}
                    >
                      Buka Dashboard
                    </Link>
                  ) : (
                    <Link
                      href={ROUTES.login}
                      onClick={closeMenu}
                      className={cn(
                        buttonVariants(),
                        "w-full bg-accent hover:bg-accent/90",
                      )}
                    >
                      Masuk
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
