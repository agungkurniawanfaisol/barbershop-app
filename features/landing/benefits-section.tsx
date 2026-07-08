import type { LandingItemDto, LandingMeta } from "@/types/landing";
import { resolveLandingIcon } from "@/features/landing/landing-icons";

type BenefitsSectionProps = {
  benefits: LandingItemDto[];
  meta: LandingMeta;
};

export function BenefitsSection({ benefits, meta }: BenefitsSectionProps) {
  return (
    <section id="manfaat" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <p className="text-sm font-medium tracking-[0.18em] text-accent uppercase">
            {meta.benefitsEyebrow}
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {meta.benefitsTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {meta.benefitsDescription}
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = resolveLandingIcon(benefit.subtitle);
            return (
              <li
                key={benefit.id}
                className="landing-card-hover landing-glass relative overflow-hidden rounded-2xl p-8"
              >
                <div
                  className="absolute -top-10 -right-10 size-32 rounded-full bg-accent/5"
                  aria-hidden
                />
                <div className="relative mb-6 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent ring-1 ring-accent/20">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="relative font-display text-xl font-medium">
                  {benefit.title}
                </h3>
                {benefit.description ? (
                  <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
