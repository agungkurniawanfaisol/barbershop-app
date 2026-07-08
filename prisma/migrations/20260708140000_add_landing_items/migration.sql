-- CreateEnum
CREATE TYPE "LandingSection" AS ENUM ('STYLE', 'STAT', 'FEATURE', 'BENEFIT', 'TESTIMONIAL');

-- CreateTable
CREATE TABLE "landing_items" (
    "id" UUID NOT NULL,
    "section" "LandingSection" NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "landing_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "landing_items_section_sort_order_idx" ON "landing_items"("section", "sort_order");

-- CreateIndex
CREATE INDEX "landing_items_is_published_idx" ON "landing_items"("is_published");

-- CreateIndex
CREATE INDEX "landing_items_deleted_at_idx" ON "landing_items"("deleted_at");
