# Landing Page Overrides

> Overrides [`../barberpro-pos/MASTER.md`](../barberpro-pos/MASTER.md) for `/` only.

## Visual direction (premium)

- **Style:** Trust & Authority + luxury accents — Playfair Display headings, glass cards, subtle gold line (`#b45309` mixed with accent green)
- **Pattern:** Full-screen storefront hero → hero split → stats glass strip → bento gallery → features → benefits → testimonials → CTA
- **Effects:** `landing-mesh`, `landing-grain`, `landing-glass`, `landing-shine` (respect `prefers-reduced-motion`)

## Typography

- **Display:** Playfair Display (`font-display`) — headings only on landing
- **Body:** Inter (app default)

## Layout

- **Max width:** `max-w-6xl`
- **Gallery:** Bento — first style spans 2×2 on `sm+`
- **Section spacing:** `py-20` / `py-28` for premium whitespace

## CTAs

- Primary: accent green with shine hover → `/login`
- Secondary: glass outline buttons
- One primary CTA per section

## Accessibility

- Touch targets ≥44px (`min-h-11` / `min-h-12`)
- `cursor-pointer` on interactive elements
- Descriptive `alt` on all haircut images
- No emoji icons — Lucide only

## Performance

- Static page — no DB
- Hero storefront `priority` (full viewport); gallery lazy via `next/image`
- Transform-only hovers (no layout shift)
