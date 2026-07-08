import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { LandingMeta } from "@/types/landing";
import { cn } from "@/lib/utils";

type LandingCtaProps = {
  meta: LandingMeta;
};

export function LandingCta({ meta }: LandingCtaProps) {
  return (
    <section className="relative overflow-hidden border-t">
      <div
        className="absolute inset-0 bg-gradient-to-br from-foreground via-primary to-accent"
        aria-hidden
      />
      <div
        className="landing-dot-pattern absolute inset-0 opacity-15"
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-28">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
          <Sparkles className="size-4" aria-hidden />
          {meta.ctaEyebrow}
        </div>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {meta.ctaTitle}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/80">
          {meta.ctaDescription}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={ROUTES.login}
            className={cn(
              buttonVariants({ size: "lg" }),
              "landing-shine min-h-12 min-w-[220px] cursor-pointer bg-white text-accent shadow-2xl hover:bg-white/95",
            )}
          >
            Mulai Sekarang
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="#fitur"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "min-h-12 cursor-pointer border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white",
            )}
          >
            Pelajari fitur
          </Link>
        </div>
      </div>
    </section>
  );
}
