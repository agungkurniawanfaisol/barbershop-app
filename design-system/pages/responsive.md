# Responsive UI Contract

> Applies to all protected app pages and CRUD managers.

## Breakpoints

| Token | Width | Usage |
|-------|-------|-------|
| default | `<640px` | Phone — card lists, single column |
| `sm` | `≥640px` | Large phone / small tablet |
| `md` | `≥768px` | Tablet — show tables |
| `lg` | `≥1024px` | Sidebar visible, compact laptop |
| `xl` | `≥1280px` | Comfortable desktop |

## Data lists

Below `md`, use `ResponsiveTable` + `MobileDataCard` from `components/data/responsive-table.tsx`.

Reference: `features/customers/customer-manager.tsx`

## Touch targets

- Mobile interactive elements: `min-h-11` (44px)
- Icon buttons: `app-touch-target` or `size-10 min-h-10 min-w-10`
- Toolbars: `flex-col gap-3 sm:flex-row`

## Dialogs

- `max-h-[90vh] overflow-y-auto`
- Forms: `grid gap-4 sm:grid-cols-2`

## Shell

- Protected layout: sidebar sheet `<lg`, fixed sidebar `lg+`
- Pages: wrap content in `PageShell` for consistent `min-w-0` and max-width
