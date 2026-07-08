import { prisma } from "@/lib/prisma";
import { notDeleted, softDeleteData } from "@/repositories/base.repository";
import type { LandingSection } from "@/constants/landing";
import type {
  CreateLandingItemInput,
  UpdateLandingItemInput,
} from "@/schemas/landing.schema";
import type { LandingSection as PrismaLandingSection } from "@/app/generated/prisma/client";

export class LandingRepository {
  async findPublishedBySection(section?: LandingSection) {
    return prisma.landingItem.findMany({
      where: {
        ...notDeleted,
        isPublished: true,
        ...(section ? { section: section as PrismaLandingSection } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  }

  async findAll(section?: LandingSection) {
    return prisma.landingItem.findMany({
      where: {
        ...notDeleted,
        ...(section ? { section: section as PrismaLandingSection } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  }

  async findById(id: string) {
    return prisma.landingItem.findFirst({
      where: { id, ...notDeleted },
    });
  }

  async create(input: CreateLandingItemInput) {
    return prisma.landingItem.create({
      data: {
        section: input.section as PrismaLandingSection,
        title: input.title,
        subtitle: input.subtitle ?? null,
        description: input.description ?? null,
        imageUrl: input.imageUrl ?? null,
        sortOrder: input.sortOrder,
        isPublished: input.isPublished,
      },
    });
  }

  async update(input: UpdateLandingItemInput) {
    const { id, ...data } = input;
    return prisma.landingItem.update({
      where: { id },
      data: {
        section: data.section as PrismaLandingSection,
        title: data.title,
        subtitle: data.subtitle ?? null,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? null,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
      },
    });
  }

  async softDelete(id: string) {
    return prisma.landingItem.update({
      where: { id },
      data: softDeleteData(),
    });
  }
}

export const landingRepository = new LandingRepository();
