"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateLandingMetaAction } from "@/actions/landing.actions";
import type { LandingMeta } from "@/types/landing";
import { isSuccess } from "@/utils/result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LandingBackgroundField } from "@/features/landing-admin/landing-background-field";

type LandingMetaFormProps = {
  meta: LandingMeta;
};

export function LandingMetaForm({ meta }: LandingMetaFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      tagline: form.get("tagline") as string,
      heroTitle: form.get("heroTitle") as string,
      heroSubtitle: form.get("heroSubtitle") as string,
      storefrontImage: form.get("storefrontImage") as string,
      storefrontWelcome: form.get("storefrontWelcome") as string,
      featuresEyebrow: form.get("featuresEyebrow") as string,
      featuresTitle: form.get("featuresTitle") as string,
      featuresDescription: form.get("featuresDescription") as string,
      benefitsEyebrow: form.get("benefitsEyebrow") as string,
      benefitsTitle: form.get("benefitsTitle") as string,
      benefitsDescription: form.get("benefitsDescription") as string,
      testimonialsEyebrow: form.get("testimonialsEyebrow") as string,
      testimonialsTitle: form.get("testimonialsTitle") as string,
      ctaEyebrow: form.get("ctaEyebrow") as string,
      ctaTitle: form.get("ctaTitle") as string,
      ctaDescription: form.get("ctaDescription") as string,
      galleryDescription: form.get("galleryDescription") as string,
    };

    startTransition(async () => {
      const result = await updateLandingMetaAction(payload);
      if (isSuccess(result)) {
        toast.success("Konten landing disimpan");
        router.refresh();
        return;
      }
      toast.error(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Hero & Toko</CardTitle>
          <CardDescription>
            Teks utama, background halaman beranda, dan tagline.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Textarea
              id="tagline"
              name="tagline"
              defaultValue={meta.tagline}
              rows={2}
              required
              disabled={isPending}
            />
          </div>
          <LandingBackgroundField
            defaultImageUrl={meta.storefrontImage}
            disabled={isPending}
          />
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="storefrontWelcome">Teks Selamat Datang</Label>
            <Textarea
              id="storefrontWelcome"
              name="storefrontWelcome"
              defaultValue={meta.storefrontWelcome}
              rows={3}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="heroTitle">Judul Hero</Label>
            <Input
              id="heroTitle"
              name="heroTitle"
              defaultValue={meta.heroTitle}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="heroSubtitle">Deskripsi Hero</Label>
            <Textarea
              id="heroSubtitle"
              name="heroSubtitle"
              defaultValue={meta.heroSubtitle}
              rows={3}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="galleryDescription">Deskripsi Galeri Gaya</Label>
            <Textarea
              id="galleryDescription"
              name="galleryDescription"
              defaultValue={meta.galleryDescription}
              rows={2}
              required
              disabled={isPending}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Judul Section</CardTitle>
          <CardDescription>
            Heading untuk fitur, manfaat, testimoni, dan CTA.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="featuresEyebrow">Fitur — label kecil</Label>
            <Input
              id="featuresEyebrow"
              name="featuresEyebrow"
              defaultValue={meta.featuresEyebrow}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="featuresTitle">Fitur — judul</Label>
            <Input
              id="featuresTitle"
              name="featuresTitle"
              defaultValue={meta.featuresTitle}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="featuresDescription">Fitur — deskripsi</Label>
            <Textarea
              id="featuresDescription"
              name="featuresDescription"
              defaultValue={meta.featuresDescription}
              rows={2}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefitsEyebrow">Manfaat — label kecil</Label>
            <Input
              id="benefitsEyebrow"
              name="benefitsEyebrow"
              defaultValue={meta.benefitsEyebrow}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="benefitsTitle">Manfaat — judul</Label>
            <Input
              id="benefitsTitle"
              name="benefitsTitle"
              defaultValue={meta.benefitsTitle}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="benefitsDescription">Manfaat — deskripsi</Label>
            <Textarea
              id="benefitsDescription"
              name="benefitsDescription"
              defaultValue={meta.benefitsDescription}
              rows={2}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonialsEyebrow">Testimoni — label kecil</Label>
            <Input
              id="testimonialsEyebrow"
              name="testimonialsEyebrow"
              defaultValue={meta.testimonialsEyebrow}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="testimonialsTitle">Testimoni — judul</Label>
            <Input
              id="testimonialsTitle"
              name="testimonialsTitle"
              defaultValue={meta.testimonialsTitle}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaEyebrow">CTA — label kecil</Label>
            <Input
              id="ctaEyebrow"
              name="ctaEyebrow"
              defaultValue={meta.ctaEyebrow}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ctaTitle">CTA — judul</Label>
            <Input
              id="ctaTitle"
              name="ctaTitle"
              defaultValue={meta.ctaTitle}
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="ctaDescription">CTA — deskripsi</Label>
            <Textarea
              id="ctaDescription"
              name="ctaDescription"
              defaultValue={meta.ctaDescription}
              rows={2}
              required
              disabled={isPending}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="min-w-32">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Menyimpan…
            </>
          ) : (
            "Simpan konten"
          )}
        </Button>
      </div>
    </form>
  );
}
