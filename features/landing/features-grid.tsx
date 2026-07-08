import type { LandingItemDto, LandingMeta } from "@/types/landing";
import { resolveLandingIcon } from "@/features/landing/landing-icons";

type FeaturesGridProps = {
  features: LandingItemDto[];
  meta: LandingMeta;
};

export function FeaturesGrid({ features, meta }: FeaturesGridProps) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        className="landing-dot-pattern pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 max-w-2xl">
          <p className="text-sm font-medium tracking-[0.18em] text-accent uppercase">
            {meta.featuresEyebrow}
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {meta.featuresTitle}
          </h2>
          <div className="landing-gold-line mt-4 h-px w-16" aria-hidden />
          <p className="mt-4 text-muted-foreground">{meta.featuresDescription}</p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = resolveLandingIcon(feature.subtitle);
            return (
              <li
                key={feature.id}
                className="landing-card-hover landing-glass group rounded-2xl p-7"
              >
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 text-primary ring-1 ring-primary/10 transition-colors duration-200 group-hover:from-primary group-hover:to-primary/90 group-hover:text-primary-foreground">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                {feature.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
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
