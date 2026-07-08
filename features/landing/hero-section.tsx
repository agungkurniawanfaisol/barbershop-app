import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { LandingItemDto, LandingMeta } from "@/types/landing";

const HIGHLIGHTS = [
  "Kasir & struk digital",
  "Laporan P&L otomatis",
  "Multi-peran staff",
] as const;

type HeroSectionProps = {
  shopName: string;
  meta: LandingMeta;
  heroStyle?: LandingItemDto;
};

function splitHeroTitle(title: string) {
  const parts = title.split(". ").filter(Boolean);
  if (parts.length <= 1) {
    return { lead: title, accent: null };
  }
  return {
    lead: `${parts[0]}.`,
    accent: parts.slice(1).join(". "),
  };
}

export function HeroSection({ shopName, meta, heroStyle }: HeroSectionProps) {
  const { lead, accent } = splitHeroTitle(meta.heroTitle);

  return (
    <section className="landing-mesh landing-grain relative overflow-hidden">
      <div className="relative z-10 mx-auto grid max-w-6xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-28">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/8 px-4 py-2 text-sm font-medium text-accent shadow-sm backdrop-blur-sm">
            <Sparkles className="size-4" aria-hidden />
            {shopName}
          </div>

          <div className="space-y-5">
            <h1 className="font-display text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem]">
              {lead}{" "}
              {accent ? (
                <span className="landing-text-gradient">{accent}</span>
              ) : null}
            </h1>
            <div className="landing-gold-line h-px w-24" aria-hidden />
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              {meta.heroSubtitle}
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm text-foreground/90"
              >
                <CheckCircle2
                  className="size-4 shrink-0 text-accent"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Link
              href={ROUTES.login}
              className={cn(
                buttonVariants({ size: "lg" }),
                "landing-shine min-h-12 cursor-pointer bg-accent px-8 text-base shadow-lg shadow-accent/25 hover:bg-accent/90",
              )}
            >
              Masuk ke Dashboard
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a
              href="#gaya-potongan"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "landing-glass min-h-12 cursor-pointer",
              )}
            >
              Lihat Gaya Potongan
            </a>
          </div>
        </div>

        {heroStyle?.imageUrl ? (
          <div className="relative lg:pl-6">
            <div
              className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-primary/25 via-transparent to-accent/20 blur-3xl"
              aria-hidden
            />
            <div className="landing-glass relative overflow-hidden rounded-2xl shadow-2xl shadow-primary/15 ring-1 ring-black/5">
              <div className="relative aspect-[4/5]">
                <Image
                  src={heroStyle.imageUrl}
                  alt={`Contoh gaya ${heroStyle.title}`}
                  width={800}
                  height={1000}
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <p className="text-xs font-medium tracking-[0.2em] text-white/60 uppercase">
                    Signature style
                  </p>
                  <p className="font-display mt-1 text-3xl font-medium text-white">
                    {heroStyle.title}
                  </p>
                  {heroStyle.description ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/75">
                      {heroStyle.description}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 bg-card/80 px-6 py-4 backdrop-blur-md">
                <div>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">
                    Modul aktif
                  </p>
                  <p className="font-medium tabular-nums">POS · Laporan · RBAC</p>
                </div>
                <div className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent uppercase">
                  Premium
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
