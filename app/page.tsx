import { LandingHeader } from "@/features/landing/landing-header";
import { StorefrontHero } from "@/features/landing/storefront-hero";
import { HeroSection } from "@/features/landing/hero-section";
import { StatsStrip } from "@/features/landing/stats-strip";
import { StyleGallery } from "@/features/landing/style-gallery";
import { FeaturesGrid } from "@/features/landing/features-grid";
import { BenefitsSection } from "@/features/landing/benefits-section";
import { TrustSection } from "@/features/landing/trust-section";
import { LandingCta } from "@/features/landing/landing-cta";
import { LandingFooter } from "@/features/landing/landing-footer";

export default function HomePage() {
  return (
    <div className="landing-page flex min-h-dvh flex-col bg-background">
      <LandingHeader />
      <StorefrontHero />
      <main id="konten" className="flex-1 scroll-mt-0">
        <div id="landing-scroll-sentinel" className="h-px w-full" aria-hidden />
        <HeroSection />
        <StatsStrip />
        <StyleGallery />
        <div id="fitur" className="scroll-mt-20">
          <FeaturesGrid />
        </div>
        <BenefitsSection />
        <TrustSection />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
