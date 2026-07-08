import { cache } from "react";
import { landingRepository } from "@/repositories/landing.repository";
import { settingRepository } from "@/repositories/setting.repository";
import { SETTING_KEYS } from "@/constants/settings";
import {
  DEFAULT_LANDING_BENEFITS,
  DEFAULT_LANDING_FEATURES,
  DEFAULT_LANDING_META,
  DEFAULT_LANDING_STATS,
  DEFAULT_LANDING_STYLES,
  DEFAULT_LANDING_TESTIMONIALS,
  LandingSection,
  type LandingSection as LandingSectionType,
} from "@/constants/landing";
import {
  type CreateLandingItemInput,
  type LandingMetaInput,
  type UpdateLandingItemInput,
} from "@/schemas/landing.schema";
import type {
  LandingAdminData,
  LandingItemDto,
  LandingMeta,
  PublicLandingPage,
} from "@/types/landing";
import type { LandingItem } from "@/app/generated/prisma/client";

function serializeItem(item: LandingItem): LandingItemDto {
  return {
    id: item.id,
    section: item.section as LandingSectionType,
    title: item.title,
    subtitle: item.subtitle,
    description: item.description,
    imageUrl: item.imageUrl,
    sortOrder: item.sortOrder,
    isPublished: item.isPublished,
  };
}

function readMetaValue(
  record: { value: unknown } | undefined,
  key: keyof LandingMeta,
): string {
  if (!record?.value || typeof record.value !== "object" || record.value === null) {
    return DEFAULT_LANDING_META[key];
  }
  const value = (record.value as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value : DEFAULT_LANDING_META[key];
}

function groupItems(items: LandingItemDto[]) {
  return {
    styles: items.filter((item) => item.section === LandingSection.STYLE),
    stats: items.filter((item) => item.section === LandingSection.STAT),
    features: items.filter((item) => item.section === LandingSection.FEATURE),
    benefits: items.filter((item) => item.section === LandingSection.BENEFIT),
    testimonials: items.filter(
      (item) => item.section === LandingSection.TESTIMONIAL,
    ),
  };
}

function defaultItemsForSection(section: LandingSectionType): LandingItemDto[] {
  const map = {
    [LandingSection.STYLE]: DEFAULT_LANDING_STYLES.map((item, index) => ({
      id: `default-style-${index}`,
      section: LandingSection.STYLE,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      imageUrl: item.imageUrl,
      sortOrder: item.sortOrder,
      isPublished: true,
    })),
    [LandingSection.STAT]: DEFAULT_LANDING_STATS.map((item, index) => ({
      id: `default-stat-${index}`,
      section: LandingSection.STAT,
      title: item.title,
      subtitle: item.subtitle,
      description: null,
      imageUrl: null,
      sortOrder: item.sortOrder,
      isPublished: true,
    })),
    [LandingSection.FEATURE]: DEFAULT_LANDING_FEATURES.map((item, index) => ({
      id: `default-feature-${index}`,
      section: LandingSection.FEATURE,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      imageUrl: null,
      sortOrder: item.sortOrder,
      isPublished: true,
    })),
    [LandingSection.BENEFIT]: DEFAULT_LANDING_BENEFITS.map((item, index) => ({
      id: `default-benefit-${index}`,
      section: LandingSection.BENEFIT,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      imageUrl: null,
      sortOrder: item.sortOrder,
      isPublished: true,
    })),
    [LandingSection.TESTIMONIAL]: DEFAULT_LANDING_TESTIMONIALS.map(
      (item, index) => ({
        id: `default-testimonial-${index}`,
        section: LandingSection.TESTIMONIAL,
        title: "",
        subtitle: item.subtitle,
        description: item.description,
        imageUrl: null,
        sortOrder: item.sortOrder,
        isPublished: true,
      }),
    ),
  };

  return map[section];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export class LandingService {
  async getMeta(): Promise<LandingMeta> {
    const records = await settingRepository.getMany([SETTING_KEYS.landingMeta]);
    const record = records[0];

    const meta: LandingMeta = {
      tagline: readMetaValue(record, "tagline"),
      heroTitle: readMetaValue(record, "heroTitle"),
      heroSubtitle: readMetaValue(record, "heroSubtitle"),
      storefrontImage: readMetaValue(record, "storefrontImage"),
      storefrontWelcome: readMetaValue(record, "storefrontWelcome"),
      featuresEyebrow: readMetaValue(record, "featuresEyebrow"),
      featuresTitle: readMetaValue(record, "featuresTitle"),
      featuresDescription: readMetaValue(record, "featuresDescription"),
      benefitsEyebrow: readMetaValue(record, "benefitsEyebrow"),
      benefitsTitle: readMetaValue(record, "benefitsTitle"),
      benefitsDescription: readMetaValue(record, "benefitsDescription"),
      testimonialsEyebrow: readMetaValue(record, "testimonialsEyebrow"),
      testimonialsTitle: readMetaValue(record, "testimonialsTitle"),
      ctaEyebrow: readMetaValue(record, "ctaEyebrow"),
      ctaTitle: readMetaValue(record, "ctaTitle"),
      ctaDescription: readMetaValue(record, "ctaDescription"),
      galleryDescription: readMetaValue(record, "galleryDescription"),
    };

    return meta;
  }

  async updateMeta(input: LandingMetaInput): Promise<LandingMeta> {
    await settingRepository.upsertLandingMeta(input);
    return this.getMeta();
  }

  async getAdminData(): Promise<LandingAdminData> {
    const [meta, items] = await Promise.all([
      this.getMeta(),
      landingRepository.findAll(),
    ]);

    return {
      meta,
      items: items.map(serializeItem),
    };
  }

  async getPublicPage(): Promise<PublicLandingPage> {
    const [meta, items] = await Promise.all([
      this.getMeta(),
      landingRepository.findPublishedBySection(),
    ]);

    const serialized = items.map(serializeItem);
    const grouped = groupItems(serialized);

    return {
      meta,
      styles: grouped.styles.length
        ? grouped.styles
        : defaultItemsForSection(LandingSection.STYLE),
      stats: grouped.stats.length
        ? grouped.stats
        : defaultItemsForSection(LandingSection.STAT),
      features: grouped.features.length
        ? grouped.features
        : defaultItemsForSection(LandingSection.FEATURE),
      benefits: grouped.benefits.length
        ? grouped.benefits
        : defaultItemsForSection(LandingSection.BENEFIT),
      testimonials: grouped.testimonials.length
        ? grouped.testimonials
        : defaultItemsForSection(LandingSection.TESTIMONIAL),
    };
  }

  async createItem(input: CreateLandingItemInput): Promise<LandingItemDto> {
    const payload = { ...input };

    if (payload.section === LandingSection.STYLE && !payload.subtitle?.trim()) {
      payload.subtitle = slugify(payload.title);
    }

    if (payload.section === LandingSection.TESTIMONIAL && !payload.title.trim()) {
      payload.title = "Testimoni";
    }

    const item = await landingRepository.create(payload);
    return serializeItem(item);
  }

  async updateItem(input: UpdateLandingItemInput): Promise<LandingItemDto> {
    const existing = await landingRepository.findById(input.id);
    if (!existing) {
      throw new Error("Landing item not found");
    }

    const payload = { ...input };

    if (payload.section === LandingSection.STYLE && !payload.subtitle?.trim()) {
      payload.subtitle = slugify(payload.title);
    }

    if (payload.section === LandingSection.TESTIMONIAL && !payload.title.trim()) {
      payload.title = "Testimoni";
    }

    const item = await landingRepository.update(payload);
    return serializeItem(item);
  }

  async deleteItem(id: string): Promise<void> {
    const existing = await landingRepository.findById(id);
    if (!existing) {
      throw new Error("Landing item not found");
    }
    await landingRepository.softDelete(id);
  }
}

export const landingService = new LandingService();

export const getPublicLandingPage = cache(() => landingService.getPublicPage());
