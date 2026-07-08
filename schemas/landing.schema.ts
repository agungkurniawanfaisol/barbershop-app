import { z } from "zod";
import { LandingSection } from "@/constants/landing";

const landingSectionSchema = z.enum([
  LandingSection.STYLE,
  LandingSection.STAT,
  LandingSection.FEATURE,
  LandingSection.BENEFIT,
  LandingSection.TESTIMONIAL,
]);

export const landingMetaSchema = z.object({
  tagline: z.string().min(1).max(500),
  heroTitle: z.string().min(1).max(200),
  heroSubtitle: z.string().min(1).max(500),
  storefrontImage: z.string().min(1).max(500),
  storefrontWelcome: z.string().min(1).max(500),
  featuresEyebrow: z.string().min(1).max(100),
  featuresTitle: z.string().min(1).max(200),
  featuresDescription: z.string().min(1).max(500),
  benefitsEyebrow: z.string().min(1).max(100),
  benefitsTitle: z.string().min(1).max(200),
  benefitsDescription: z.string().min(1).max(500),
  testimonialsEyebrow: z.string().min(1).max(100),
  testimonialsTitle: z.string().min(1).max(200),
  ctaEyebrow: z.string().min(1).max(100),
  ctaTitle: z.string().min(1).max(200),
  ctaDescription: z.string().min(1).max(500),
  galleryDescription: z.string().min(1).max(500),
});

export type LandingMetaInput = z.infer<typeof landingMetaSchema>;

export const createLandingItemSchema = z.object({
  section: landingSectionSchema,
  title: z.string().min(1).max(200),
  subtitle: z.string().max(200).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  imageUrl: z.string().max(500).nullable().optional(),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
  isPublished: z.boolean().default(true),
});

export const updateLandingItemSchema = createLandingItemSchema.extend({
  id: z.string().uuid(),
});

export const deleteLandingItemSchema = z.object({
  id: z.string().uuid(),
});

export type CreateLandingItemInput = z.infer<typeof createLandingItemSchema>;
export type UpdateLandingItemInput = z.infer<typeof updateLandingItemSchema>;
