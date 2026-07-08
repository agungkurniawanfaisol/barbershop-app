import type { Metadata } from "next";
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
import { getPublicBranding } from "@/lib/branding";
import { getPublicLandingPage } from "@/services/landing.service";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [branding, landing] = await Promise.all([
    getPublicBranding(),
    getPublicLandingPage(),
  ]);

  return {
    title: branding.shopName,
    description: landing.meta.tagline,
    openGraph: {
      title: branding.shopName,
      description: landing.meta.tagline,
      url: siteConfig.url,
    },
  };
}

export default async function HomePage() {
  const [branding, landing] = await Promise.all([
    getPublicBranding(),
    getPublicLandingPage(),
  ]);

  const pageBranding = {
    ...branding,
    tagline: landing.meta.tagline,
  };

  return (
    <div className="landing-page flex min-h-dvh flex-col bg-background">
      <LandingHeader shopName={pageBranding.shopName} />
      <StorefrontHero branding={pageBranding} meta={landing.meta} />
      <main id="konten" className="flex-1 scroll-mt-0">
        <div id="landing-scroll-sentinel" className="h-px w-full" aria-hidden />
        <HeroSection
          shopName={pageBranding.shopName}
          meta={landing.meta}
          heroStyle={landing.styles[1] ?? landing.styles[0]}
        />
        <StatsStrip stats={landing.stats} />
        <StyleGallery
          shopName={pageBranding.shopName}
          styles={landing.styles}
          description={landing.meta.galleryDescription}
        />
        <div id="fitur" className="scroll-mt-20">
          <FeaturesGrid features={landing.features} meta={landing.meta} />
        </div>
        <BenefitsSection benefits={landing.benefits} meta={landing.meta} />
        <TrustSection testimonials={landing.testimonials} meta={landing.meta} />
        <LandingCta meta={landing.meta} />
      </main>
      <LandingFooter branding={pageBranding} />
    </div>
  );
}
