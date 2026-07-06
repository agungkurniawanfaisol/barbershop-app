import {
  CreditCard,
  LayoutDashboard,
  Receipt,
  Shield,
  Users,
  Wallet,
} from "lucide-react";

const FEATURES = [
  {
    icon: CreditCard,
    title: "Kasir POS",
    description: "Cart multi-layanan, diskon, struk, dan QRIS dalam satu alur.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Pendapatan harian, grafik 30 hari, dan transaksi terbaru.",
  },
  {
    icon: Users,
    title: "Pelanggan & Barber",
    description: "Profil pelanggan, loyalitas, dan manajemen tim barber.",
  },
  {
    icon: Receipt,
    title: "Laporan",
    description: "P&L, ekspor CSV/Excel/PDF, dan filter rentang tanggal.",
  },
  {
    icon: Wallet,
    title: "Pengeluaran",
    description: "Catat biaya operasional per kategori dengan audit trail.",
  },
  {
    icon: Shield,
    title: "Keamanan",
    description: "Role-based access, audit log, dan invite user terkontrol.",
  },
] as const;

export function FeaturesGrid() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        className="landing-dot-pattern pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 max-w-2xl">
          <p className="text-sm font-medium tracking-[0.18em] text-accent uppercase">
            Platform lengkap
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Dari kasir hingga laporan keuangan
          </h2>
          <div className="landing-gold-line mt-4 h-px w-16" aria-hidden />
          <p className="mt-4 text-muted-foreground">
            Semua modul dirancang untuk operasional barbershop harian — tanpa
            spreadsheet terpisah.
          </p>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <li
                key={feature.title}
                className="landing-card-hover landing-glass group rounded-2xl p-7"
              >
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 text-primary ring-1 ring-primary/10 transition-colors duration-200 group-hover:from-primary group-hover:to-primary/90 group-hover:text-primary-foreground">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
