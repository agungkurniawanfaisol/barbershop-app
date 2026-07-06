const STATS = [
  { value: "7+", label: "Modul terintegrasi" },
  { value: "30 hari", label: "Tren laporan real-time" },
  { value: "4", label: "Metode pembayaran" },
  { value: "RBAC", label: "Akses per peran" },
] as const;

export function StatsStrip() {
  return (
    <section aria-label="Ringkasan platform" className="relative border-y">
      <div className="landing-divider absolute inset-x-0 top-0" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {STATS.map((stat) => (
            <li
              key={stat.label}
              className="landing-glass rounded-2xl px-5 py-6 text-center md:text-left"
            >
              <p className="font-display text-3xl font-semibold tracking-tight text-primary tabular-nums sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-snug text-muted-foreground">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="landing-divider absolute inset-x-0 bottom-0" aria-hidden />
    </section>
  );
}
