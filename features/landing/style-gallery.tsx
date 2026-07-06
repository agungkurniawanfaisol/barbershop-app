import Image from "next/image";
import { HAIRCUT_STYLES } from "@/features/landing/constants";
import { cn } from "@/lib/utils";

const BENTO_SPANS = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "",
] as const;

export function StyleGallery() {
  return (
    <section
      id="gaya-potongan"
      className="scroll-mt-20 border-t bg-muted/30 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-[0.18em] text-accent uppercase">
              Koleksi
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Gaya potongan andalan
            </h2>
            <div className="landing-gold-line mt-4 h-px w-16" aria-hidden />
            <p className="mt-4 text-muted-foreground">
              Kurasi visual premium untuk inspirasi pelanggan — setiap potongan
              dikerjakan dengan standar konsisten oleh barber berpengalaman.
            </p>
          </div>
          <p className="text-sm font-medium text-muted-foreground tabular-nums">
            {HAIRCUT_STYLES.length} signature looks
          </p>
        </div>

        <ul className="grid auto-rows-[minmax(180px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {HAIRCUT_STYLES.map((style, index) => (
            <li
              key={style.slug}
              className={cn(
                "landing-card-hover group relative overflow-hidden rounded-2xl border bg-card shadow-sm",
                BENTO_SPANS[index] ?? "",
              )}
            >
              <div
                className={cn(
                  "relative overflow-hidden",
                  index === 0 ? "aspect-[4/5] sm:aspect-auto sm:h-full sm:min-h-[420px]" : "aspect-[4/3]",
                )}
              >
                <Image
                  src={style.image}
                  alt={`Gaya potongan ${style.title}`}
                  width={800}
                  height={index === 0 ? 1000 : 600}
                  sizes={
                    index === 0
                      ? "(max-width: 1024px) 100vw, 66vw"
                      : "(max-width: 640px) 100vw, 33vw"
                  }
                  className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute top-4 left-4 flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-sm font-semibold text-white tabular-nums backdrop-blur-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="font-display text-xl font-medium text-white sm:text-2xl">
                    {style.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/75">
                    {style.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
