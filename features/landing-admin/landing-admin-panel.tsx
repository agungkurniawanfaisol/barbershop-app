"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { LandingMetaForm } from "@/features/landing-admin/landing-meta-form";
import { LandingItemsManager } from "@/features/landing-admin/landing-items-manager";
import { LandingSection } from "@/constants/landing";
import type { LandingAdminData } from "@/types/landing";
import { ROUTES } from "@/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type LandingAdminPanelProps = {
  data: LandingAdminData;
};

export function LandingAdminPanel({ data }: LandingAdminPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Kelola teks, galeri, statistik, fitur, manfaat, dan testimoni halaman
          beranda.
        </p>
        <Link
          href={ROUTES.home}
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "min-h-9 gap-2",
          )}
        >
          <ExternalLink className="size-4" />
          Lihat beranda
        </Link>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="hero">Hero & Teks</TabsTrigger>
          <TabsTrigger value="styles">Gaya Potongan</TabsTrigger>
          <TabsTrigger value="stats">Statistik</TabsTrigger>
          <TabsTrigger value="features">Fitur</TabsTrigger>
          <TabsTrigger value="benefits">Manfaat</TabsTrigger>
          <TabsTrigger value="testimonials">Testimoni</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <LandingMetaForm meta={data.meta} />
        </TabsContent>

        <TabsContent value="styles">
          <LandingItemsManager
            section={LandingSection.STYLE}
            items={data.items}
          />
        </TabsContent>

        <TabsContent value="stats">
          <LandingItemsManager section={LandingSection.STAT} items={data.items} />
        </TabsContent>

        <TabsContent value="features">
          <LandingItemsManager
            section={LandingSection.FEATURE}
            items={data.items}
          />
        </TabsContent>

        <TabsContent value="benefits">
          <LandingItemsManager
            section={LandingSection.BENEFIT}
            items={data.items}
          />
        </TabsContent>

        <TabsContent value="testimonials">
          <LandingItemsManager
            section={LandingSection.TESTIMONIAL}
            items={data.items}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
