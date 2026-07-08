import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createAdminClient } from "@/lib/supabase/admin";

const LANDING_BUCKET = process.env.SUPABASE_LANDING_BUCKET ?? "landing";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

function sanitizeExtension(filename: string, mime: string): string {
  const fromName = filename.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export class StorageService {
  validateLandingImage(file: File) {
    if (!ALLOWED_TYPES.has(file.type)) {
      throw new Error("Format harus JPG, PNG, atau WebP");
    }
    if (file.size > MAX_BYTES) {
      throw new Error("Ukuran maksimal 5 MB");
    }
  }

  async uploadLandingBackground(file: File): Promise<string> {
    this.validateLandingImage(file);

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = sanitizeExtension(file.name, file.type);
    const filename = `background-${Date.now()}.${ext}`;

    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        return await this.uploadToSupabase(buffer, filename, file.type);
      } catch {
        if (process.env.NODE_ENV !== "development") {
          throw new Error(
            "Gagal upload ke Supabase. Buat bucket publik \"landing\" atau gunakan URL gambar.",
          );
        }
      }
    }

    if (process.env.NODE_ENV === "development") {
      return this.saveToPublic(buffer, filename);
    }

    throw new Error(
      "Upload membutuhkan SUPABASE_SERVICE_ROLE_KEY dan bucket Storage \"landing\".",
    );
  }

  private async uploadToSupabase(
    buffer: Buffer,
    filename: string,
    contentType: string,
  ): Promise<string> {
    const supabase = createAdminClient();
    const objectPath = `backgrounds/${filename}`;

    const { error } = await supabase.storage
      .from(LANDING_BUCKET)
      .upload(objectPath, buffer, {
        contentType,
        upsert: false,
        cacheControl: "3600",
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data } = supabase.storage
      .from(LANDING_BUCKET)
      .getPublicUrl(objectPath);

    return data.publicUrl;
  }

  private async saveToPublic(buffer: Buffer, filename: string): Promise<string> {
    const dir = path.join(process.cwd(), "public/images/landing");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);
    return `/images/landing/${filename}`;
  }
}

export const storageService = new StorageService();
