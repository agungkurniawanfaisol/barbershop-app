"use server";

import { revalidatePath } from "next/cache";
import { authorizeAction } from "@/lib/auth/authorize";
import { UserRole } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";
import { landingService } from "@/services/landing.service";
import { landingRepository } from "@/repositories/landing.repository";
import { storageService } from "@/services/storage.service";
import { auditService } from "@/services/audit.service";
import {
  createLandingItemSchema,
  deleteLandingItemSchema,
  landingMetaSchema,
  updateLandingItemSchema,
} from "@/schemas/landing.schema";
import { failure, success, type ActionResult, isSuccess } from "@/utils/result";
import type { LandingItemDto, LandingMeta } from "@/types/landing";

const LANDING_ROLES = [UserRole.ADMIN, UserRole.MANAGER];

function revalidateLanding() {
  revalidatePath(ROUTES.home);
  revalidatePath(ROUTES.login);
  revalidatePath(ROUTES.landing);
}

export async function updateLandingMetaAction(
  input: unknown,
): Promise<ActionResult<LandingMeta>> {
  const auth = await authorizeAction(LANDING_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = landingMetaSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid landing content");
  }

  try {
    const previous = await landingService.getMeta();
    const meta = await landingService.updateMeta(parsed.data);

    await auditService.logChange({
      userId: auth.data.id,
      action: "UPDATE",
      entity: "LANDING_META",
      entityId: "landing",
      oldValue: previous,
      newValue: meta,
    });

    revalidateLanding();
    return success(meta);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to save landing content",
    );
  }
}

export async function createLandingItemAction(
  input: unknown,
): Promise<ActionResult<LandingItemDto>> {
  const auth = await authorizeAction(LANDING_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = createLandingItemSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const item = await landingService.createItem(parsed.data);

    await auditService.logChange({
      userId: auth.data.id,
      action: "CREATE",
      entity: "LANDING_ITEM",
      entityId: item.id,
      newValue: item,
    });

    revalidateLanding();
    return success(item);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to create landing item",
    );
  }
}

export async function updateLandingItemAction(
  input: unknown,
): Promise<ActionResult<LandingItemDto>> {
  const auth = await authorizeAction(LANDING_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = updateLandingItemSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const previous = await landingRepository.findById(parsed.data.id);
    const item = await landingService.updateItem(parsed.data);

    await auditService.logChange({
      userId: auth.data.id,
      action: "UPDATE",
      entity: "LANDING_ITEM",
      entityId: item.id,
      oldValue: previous,
      newValue: item,
    });

    revalidateLanding();
    return success(item);
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to update landing item",
    );
  }
}

export async function uploadLandingBackgroundAction(
  formData: FormData,
): Promise<ActionResult<{ url: string }>> {
  const auth = await authorizeAction(LANDING_ROLES);
  if (!isSuccess(auth)) return auth;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return failure("Pilih file gambar terlebih dahulu");
  }

  try {
    const url = await storageService.uploadLandingBackground(file);
    const current = await landingService.getMeta();
    const meta = await landingService.updateMeta({
      ...current,
      storefrontImage: url,
    });

    await auditService.logChange({
      userId: auth.data.id,
      action: "UPDATE",
      entity: "LANDING_META",
      entityId: "landing-background",
      oldValue: { storefrontImage: current.storefrontImage },
      newValue: { storefrontImage: meta.storefrontImage },
    });

    revalidateLanding();
    return success({ url });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Gagal mengunggah gambar",
    );
  }
}

export async function deleteLandingItemAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  const auth = await authorizeAction(LANDING_ROLES);
  if (!isSuccess(auth)) return auth;

  const parsed = deleteLandingItemSchema.safeParse(input);
  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const previous = await landingRepository.findById(parsed.data.id);
    await landingService.deleteItem(parsed.data.id);

    await auditService.logChange({
      userId: auth.data.id,
      action: "DELETE",
      entity: "LANDING_ITEM",
      entityId: parsed.data.id,
      oldValue: previous,
    });

    revalidateLanding();
    return success({ id: parsed.data.id });
  } catch (error) {
    return failure(
      error instanceof Error ? error.message : "Failed to delete landing item",
    );
  }
}
