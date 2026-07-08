import { Quote } from "lucide-react";
import type { LandingItemDto, LandingMeta } from "@/types/landing";

type TrustSectionProps = {
  testimonials: LandingItemDto[];
  meta: LandingMeta;
};

export function TrustSection({ testimonials, meta }: TrustSectionProps) {
  return (
    <section
      id="testimoni"
      className="scroll-mt-20 border-t bg-card/40 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">
            {meta.testimonialsEyebrow}
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {meta.testimonialsTitle}
          </h2>
        </div>

        <ul className="grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <li
              key={item.id}
              className="landing-glass landing-card-hover relative rounded-2xl p-8"
            >
              <Quote className="size-8 text-accent/40" aria-hidden />
              <blockquote className="mt-4 text-lg leading-relaxed text-foreground/90">
                &ldquo;{item.description}&rdquo;
              </blockquote>
              {item.subtitle ? (
                <footer className="mt-6 text-sm font-medium text-muted-foreground">
                  — {item.subtitle}
                </footer>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
