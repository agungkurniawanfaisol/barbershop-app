import Image from "next/image";
import { ChevronDown, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { STOREFRONT_IMAGE } from "@/features/landing/constants";
import { cn } from "@/lib/utils";

export function StorefrontHero() {
  return (
    <section
      className="relative h-dvh min-h-[32rem] w-full overflow-hidden"
      aria-label="Tampilan depan toko"
    >
      <Image
        src={STOREFRONT_IMAGE.src}
        alt={STOREFRONT_IMAGE.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/70"
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-4 pb-8 pt-20 text-center sm:px-6 sm:pb-14">
        <div className="mx-auto max-w-3xl space-y-4 sm:space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
            <MapPin className="size-4 shrink-0" aria-hidden />
            BarberPro Hexa · Jakarta Pusat
          </p>

          <h1 className="font-display text-3xl leading-[1.05] font-semibold tracking-tight text-white text-balance sm:text-5xl md:text-6xl">
            Selamat datang di{" "}
            <span className="landing-text-gradient-on-dark">
              {siteConfig.name.replace(" POS", "")}
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Fasad toko kami — tempat potongan rapi bertemu layanan premium.
            Scroll untuk menjelajahi gaya, fitur, dan pengalaman barbershop
            modern.
          </p>
        </div>

        <a
          href="#konten"
          className={cn(
            "mt-10 flex min-h-11 cursor-pointer flex-col items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
          )}
        >
          <span>Jelajahi lebih lanjut</span>
          <ChevronDown
            className="size-6 animate-bounce motion-reduce:animate-none"
            aria-hidden
          />
        </a>
      </div>
    </section>
  );
}
