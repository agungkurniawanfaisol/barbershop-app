# Dashboard & Protected Shell

> **Overrides:** [`MASTER.md`](../barberpro-pos/MASTER.md) for shell layout, sidebar, and header behavior on all `(protected)` routes.

---

## Shell Layout

All authenticated pages share a fixed app shell via [`app/(protected)/layout.tsx`](../../app/(protected)/layout.tsx).

| Region | Behavior |
|--------|----------|
| Root | `h-dvh overflow-hidden` — viewport height locked |
| Sidebar (desktop) | Fixed width `260px`, full height, does not scroll with content |
| Header | Fixed at top of main column, glass blur (`app-shell-header`) |
| Main | `overflow-y-auto` — **only this area scrolls** |

Mobile: sidebar hidden; navigation opens in a left Sheet from the header menu trigger.

---

## Sidebar (`app-shell-sidebar`)

- **Theme:** Dark gradient (`slate-950` → `slate-900`) with subtle dot pattern
- **Brand:** Logo gradient + `font-display` app name + “Point of Sale” subtitle
- **Navigation groups:** Utama, Operasional, Keuangan, Administrasi (empty groups hidden per role)
- **Active item:** Left accent bar (accent green), `bg-white/10`, icon highlight — not solid primary fill
- **Footer:** User name, email, role badge

CSS utilities: `app-shell-sidebar`, `app-nav-item`, `app-nav-item-active`, `app-nav-icon`

---

## Header (`app-shell-header`)

- Glass effect: `backdrop-blur-xl` + semi-transparent background
- Title hierarchy: small “Halaman” label + page title from active nav item
- Mobile menu button: dark (`slate-900`) to match sidebar brand

---

## Dashboard Content

- Main area background: `bg-muted/30` so cards float above the shell
- Cards use `app-surface`, `landing-card-hover` for consistency with landing polish
- Welcome heading uses `font-display` for premium tone

---

## Do Not

- Do not put `overflow-auto` on the root shell or sidebar wrapper
- Do not use full-width solid primary blocks for active nav items
- Do not scroll the entire page including sidebar/header on long content

---

## Mobile (`< md` / `< lg`)

| Breakpoint | Behavior |
|------------|----------|
| `< lg` | Sidebar hidden; hamburger opens left Sheet (`AppSidebar`) |
| `< md` | Data tables use `ResponsiveTable` card fallback instead of horizontal scroll |
| Touch targets | Minimum `min-h-11` (44px) on nav items, pagination, primary actions |
| Cashier `< lg` | POS uses tabbed layout: Layanan → Keranjang → Checkout |
| Main scroll | Only `<main>` scrolls; header stays fixed in column |

Components: [`components/data/responsive-table.tsx`](../../components/data/responsive-table.tsx), [`MobileDataCard`](../../components/data/responsive-table.tsx)

Landing mobile nav: [`features/landing/landing-header.tsx`](../../features/landing/landing-header.tsx) Sheet for anchor links below `md`.

