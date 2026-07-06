import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Dashboard dan kasir terasa seperti sistem hotel bintang lima — cepat, rapi, dan mudah dilatih ke tim baru.",
    role: "Owner, Fade House Jakarta",
  },
  {
    quote:
      "Laporan 30 hari membantu kami lihat layanan mana yang paling laris tanpa spreadsheet manual.",
    role: "Manager Operasional",
  },
] as const;

export function TrustSection() {
  return (
    <section
      id="testimoni"
      className="scroll-mt-20 border-t bg-card/40 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">
            Dipercaya tim profesional
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Standar operasional yang terasa premium
          </h2>
        </div>

        <ul className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((item) => (
            <li
              key={item.role}
              className="landing-glass landing-card-hover relative rounded-2xl p-8"
            >
              <Quote
                className="size-8 text-accent/40"
                aria-hidden
              />
              <blockquote className="mt-4 text-lg leading-relaxed text-foreground/90">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <footer className="mt-6 text-sm font-medium text-muted-foreground">
                — {item.role}
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
