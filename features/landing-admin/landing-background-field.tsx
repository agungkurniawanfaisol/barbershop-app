"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadLandingBackgroundAction } from "@/actions/landing.actions";
import { isSuccess } from "@/utils/result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LandingBackgroundFieldProps = {
  defaultImageUrl: string;
  disabled?: boolean;
};

function isLocalImage(url: string) {
  return url.startsWith("/");
}

export function LandingBackgroundField({
  defaultImageUrl,
  disabled = false,
}: LandingBackgroundFieldProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(defaultImageUrl);
  const [isUploading, startUpload] = useTransition();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    startUpload(async () => {
      const result = await uploadLandingBackgroundAction(formData);
      if (isSuccess(result)) {
        setImageUrl(result.data.url);
        toast.success("Background landing diperbarui");
        router.refresh();
        return;
      }
      toast.error(result.error);
    });

    e.target.value = "";
  }

  return (
    <div className="space-y-3 sm:col-span-2">
      <Label htmlFor="storefrontImage">Gambar background landing page</Label>
      <p className="text-xs text-muted-foreground">
        Foto full-screen di bagian atas halaman beranda. JPG, PNG, atau WebP —
        maks. 5 MB.
      </p>

      <div className="overflow-hidden rounded-xl border bg-muted/30">
        <div className="relative aspect-[21/9] w-full min-h-[140px] bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Preview background landing page"
              fill
              unoptimized={!isLocalImage(imageUrl)}
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageIcon className="size-10 opacity-40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
        />
        <Button
          type="button"
          variant="outline"
          className="min-h-10"
          disabled={disabled || isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Mengunggah…
            </>
          ) : (
            <>
              <Upload className="size-4" />
              Unggah gambar baru
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          Atau tempel URL gambar di bawah.
        </p>
      </div>

      <Input
        id="storefrontImage"
        name="storefrontImage"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="/images/shop/storefront.jpg"
        required
        disabled={disabled || isUploading}
      />
    </div>
  );
}
