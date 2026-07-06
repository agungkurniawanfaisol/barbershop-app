"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Scissors } from "lucide-react";
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

export function LandingHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [overStorefront, setOverStorefront] = useState(true);

  useEffect(() => {
    const sentinel = document.getElementById("landing-scroll-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOverStorefront(entry?.isIntersecting ?? false);
      },
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 border-b transition-colors duration-300",
        overStorefront
          ? "border-transparent bg-transparent text-white"
          : "border-border/40 bg-background/70 text-foreground backdrop-blur-xl supports-[backdrop-filter]:bg-background/55",
      )}
    >
      <div
        className={cn(
          "landing-divider absolute inset-x-0 bottom-0 opacity-60",
          overStorefront && "opacity-0",
        )}
        aria-hidden
      />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={ROUTES.home}
          className="flex min-h-11 shrink-0 cursor-pointer items-center gap-2.5 rounded-xl font-semibold tracking-tight transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-lg shadow-md ring-1",
              overStorefront
                ? "bg-white/15 text-white ring-white/20 backdrop-blur-sm"
                : "bg-gradient-to-br from-primary to-primary/85 text-primary-foreground ring-black/5",
            )}
          >
            <Scissors className="size-4" aria-hidden />
          </span>
          <span className="font-display hidden text-lg sm:inline">
            {siteConfig.name}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Navigasi halaman"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "min-h-10 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                overStorefront
                  ? "text-white/80 hover:bg-white/10 hover:text-white"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger
              className={cn(
                "inline-flex size-10 min-h-11 min-w-11 items-center justify-center rounded-lg border shadow-sm md:hidden",
                overStorefront
                  ? "border-white/25 bg-white/10 text-white"
                  : "border-border bg-card",
              )}
              aria-label="Buka menu navigasi"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(280px,85vw)]">
              <SheetTitle className="font-display text-lg">Menu</SheetTitle>
              <nav
                className="mt-6 flex flex-col gap-1"
                aria-label="Navigasi mobile"
              >
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  href={ROUTES.login}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "mt-2 min-h-11 w-full justify-start sm:hidden",
                  )}
                >
                  Masuk
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            href={ROUTES.login}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden min-h-10 cursor-pointer sm:inline-flex",
              overStorefront && "text-white hover:bg-white/10 hover:text-white",
            )}
          >
            Masuk
          </Link>
          <Link
            href={ROUTES.login}
            className={cn(
              buttonVariants({ size: "sm" }),
              "landing-shine min-h-10 cursor-pointer bg-accent text-accent-foreground shadow-md shadow-accent/20 hover:bg-accent/90",
            )}
          >
            Mulai
          </Link>
        </div>
      </div>
    </header>
  );
}
