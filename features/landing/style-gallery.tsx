import Image from "next/image";
import type { LandingItemDto } from "@/types/landing";
import { cn } from "@/lib/utils";

const BENTO_SPANS = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "",
  "",
] as const;

type StyleGalleryProps = {
  shopName: string;
  styles: LandingItemDto[];
  description: string;
};

export function StyleGallery({
  shopName,
  styles,
  description,
}: StyleGalleryProps) {
  return (
    <section
      id="gaya-potongan"
      className="scroll-mt-20 border-t bg-muted/30 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-[0.18em] text-accent uppercase">
              Koleksi {shopName}
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Gaya potongan andalan
            </h2>
            <div className="landing-gold-line mt-4 h-px w-16" aria-hidden />
            <p className="mt-4 text-muted-foreground">{description}</p>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {styles.map((style, index) => (
            <li
              key={style.id}
              className={cn(
                "landing-card-hover group relative overflow-hidden rounded-2xl border bg-card shadow-sm",
                BENTO_SPANS[index] ?? "",
              )}
            >
              {style.imageUrl ? (
                <div className="relative aspect-[4/5] sm:aspect-auto sm:min-h-[220px]">
                  <Image
                    src={style.imageUrl}
                    alt={style.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-xl font-medium text-white">
                      {style.title}
                    </h3>
                    {style.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-white/75">
                        {style.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <h3 className="font-display text-xl font-medium">{style.title}</h3>
                  {style.description ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {style.description}
                    </p>
                  ) : null}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
