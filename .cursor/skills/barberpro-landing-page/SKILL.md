---
name: barberpro-landing-page
description: Public marketing landing page for BarberPro POS at /. Use when editing the homepage, hero, haircut gallery, or public-facing marketing UI.
---

# BarberPro Landing Page

## Location

- Route: `app/page.tsx` (public, no auth)
- Components: `features/landing/`
- Assets: `public/images/haircuts/`
- Design override: `design-system/pages/landing.md`
- Master tokens: `design-system/barberpro-pos/MASTER.md`

## Structure (order)

1. `LandingHeader` — logo + Masuk CTA
2. `HeroSection` — headline, copy, CTAs, featured image
3. `StyleGallery` — `#gaya-potongan` grid of haircut photos
4. `BenefitsSection` — 3 cards (POS, barber, laporan)
5. `LandingCta` — emerald band → login
6. `LandingFooter`

## Rules

- **Static page** — no DB queries on `/`
- **Images**: `next/image` with `width`/`height`/`sizes`; hero `priority`
- **Icons**: Lucide only — no emoji as icons
- **Buttons + links**: use `buttonVariants` + `Link`/`a` — not `Button render=`
- **Accent**: emerald `#059669` for marketing CTAs; primary blue for in-app UI
- **Copy**: Indonesian, professional (Trust & Authority style)
- **Touch**: min-h-11 on interactive elements

## Adding a haircut style

1. Add image to `public/images/haircuts/`
2. Entry in `features/landing/constants.ts` → `HAIRCUT_STYLES`

## Do not

- Link "Go to Dashboard" without auth (middleware redirects unauthenticated users)
- Add Mailpit or email flows to landing
