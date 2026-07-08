import type { LandingSection } from "@/constants/landing";

export type LandingMeta = {
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  storefrontImage: string;
  storefrontWelcome: string;
  featuresEyebrow: string;
  featuresTitle: string;
  featuresDescription: string;
  benefitsEyebrow: string;
  benefitsTitle: string;
  benefitsDescription: string;
  testimonialsEyebrow: string;
  testimonialsTitle: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaDescription: string;
  galleryDescription: string;
};

export type LandingItemDto = {
  id: string;
  section: LandingSection;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type PublicLandingPage = {
  meta: LandingMeta;
  styles: LandingItemDto[];
  stats: LandingItemDto[];
  features: LandingItemDto[];
  benefits: LandingItemDto[];
  testimonials: LandingItemDto[];
};

export type LandingAdminData = {
  meta: LandingMeta;
  items: LandingItemDto[];
};
