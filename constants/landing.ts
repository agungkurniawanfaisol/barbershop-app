/** Client-safe landing section enum — mirrors Prisma LandingSection */
export const LandingSection = {
  STYLE: "STYLE",
  STAT: "STAT",
  FEATURE: "FEATURE",
  BENEFIT: "BENEFIT",
  TESTIMONIAL: "TESTIMONIAL",
} as const;

export type LandingSection =
  (typeof LandingSection)[keyof typeof LandingSection];

export const LANDING_SECTION_LABELS: Record<LandingSection, string> = {
  [LandingSection.STYLE]: "Gaya Potongan",
  [LandingSection.STAT]: "Statistik",
  [LandingSection.FEATURE]: "Fitur",
  [LandingSection.BENEFIT]: "Manfaat",
  [LandingSection.TESTIMONIAL]: "Testimoni",
};

export const LANDING_ICON_OPTIONS = [
  { value: "CreditCard", label: "Kasir / Kartu" },
  { value: "LayoutDashboard", label: "Dashboard" },
  { value: "Users", label: "Pengguna" },
  { value: "Receipt", label: "Struk / Laporan" },
  { value: "Wallet", label: "Dompet" },
  { value: "Shield", label: "Keamanan" },
  { value: "Zap", label: "Cepat" },
  { value: "Scissors", label: "Gunting" },
  { value: "BarChart3", label: "Grafik" },
  { value: "Sparkles", label: "Premium" },
] as const;

export const DEFAULT_LANDING_META = {
  tagline:
    "Barbershop premium dengan layanan rapi, POS modern, dan pengalaman pelanggan terbaik",
  heroTitle: "Potongan rapi. Operasional kelas premium.",
  heroSubtitle:
    "Satu platform elegan untuk layanan, barber, transaksi, dan laporan — dirancang untuk barbershop modern di Indonesia.",
  storefrontImage: "/images/shop/storefront.jpg",
  storefrontWelcome:
    "Fasad toko kami — tempat potongan rapi bertemu layanan premium. Scroll untuk menjelajahi gaya, fitur, dan pengalaman barbershop modern.",
  featuresEyebrow: "Platform lengkap",
  featuresTitle: "Dari kasir hingga laporan keuangan",
  featuresDescription:
    "Semua modul dirancang untuk operasional barbershop harian — tanpa spreadsheet terpisah.",
  benefitsEyebrow: "Manfaat",
  benefitsTitle: "Semua yang barbershop butuhkan",
  benefitsDescription:
    "Fokus pada pelayanan pelanggan — biarkan sistem mengurus operasional harian dengan presisi.",
  testimonialsEyebrow: "Dipercaya tim profesional",
  testimonialsTitle: "Standar operasional yang terasa premium",
  ctaEyebrow: "Mulai dalam hitungan menit",
  ctaTitle: "Siap mengelola barbershop lebih efisien?",
  ctaDescription:
    "Masuk dengan akun staff untuk mengakses dashboard, kasir, laporan, dan pengaturan toko — dalam satu platform premium.",
  galleryDescription:
    "Kurasi visual premium — setiap potongan dikerjakan dengan standar konsisten oleh barber berpengalaman.",
} as const;

export const DEFAULT_LANDING_STYLES = [
  {
    title: "Fade Classic",
    subtitle: "fade-classic",
    description:
      "Transisi halus dari samping ke atas — tampilan rapi sehari-hari.",
    imageUrl: "/images/haircuts/fade-classic.jpg",
    sortOrder: 1,
  },
  {
    title: "Skin Fade",
    subtitle: "skin-fade",
    description: "Gradasi tajam ke kulit kepala untuk look modern dan bersih.",
    imageUrl: "/images/haircuts/skin-fade.jpg",
    sortOrder: 2,
  },
  {
    title: "Pompadour",
    subtitle: "pompadour",
    description:
      "Volume di atas dengan sisi rapi — klasik dengan sentuhan kontemporer.",
    imageUrl: "/images/haircuts/pompadour.jpg",
    sortOrder: 3,
  },
  {
    title: "Buzz Cut",
    subtitle: "buzz-cut",
    description: "Potongan pendek seragam, praktis dan selalu on-point.",
    imageUrl: "/images/haircuts/buzz-cut.jpg",
    sortOrder: 4,
  },
] as const;

export const DEFAULT_LANDING_STATS = [
  { title: "7+", subtitle: "Modul terintegrasi", sortOrder: 1 },
  { title: "30 hari", subtitle: "Tren laporan real-time", sortOrder: 2 },
  { title: "4", subtitle: "Metode pembayaran", sortOrder: 3 },
  { title: "RBAC", subtitle: "Akses per peran", sortOrder: 4 },
] as const;

export const DEFAULT_LANDING_FEATURES = [
  {
    title: "Kasir POS",
    subtitle: "CreditCard",
    description:
      "Cart multi-layanan, diskon, struk, dan QRIS dalam satu alur.",
    sortOrder: 1,
  },
  {
    title: "Dashboard",
    subtitle: "LayoutDashboard",
    description: "Pendapatan harian, grafik 30 hari, dan transaksi terbaru.",
    sortOrder: 2,
  },
  {
    title: "Pelanggan & Barber",
    subtitle: "Users",
    description: "Profil pelanggan, loyalitas, dan manajemen tim barber.",
    sortOrder: 3,
  },
  {
    title: "Laporan",
    subtitle: "Receipt",
    description: "P&L, ekspor CSV/Excel/PDF, dan filter rentang tanggal.",
    sortOrder: 4,
  },
  {
    title: "Pengeluaran",
    subtitle: "Wallet",
    description: "Catat biaya operasional per kategori dengan audit trail.",
    sortOrder: 5,
  },
  {
    title: "Keamanan",
    subtitle: "Shield",
    description: "Role-based access, audit log, dan invite user terkontrol.",
    sortOrder: 6,
  },
] as const;

export const DEFAULT_LANDING_BENEFITS = [
  {
    title: "POS Cepat",
    subtitle: "Zap",
    description:
      "Checkout layanan dalam hitungan detik — tunai, QRIS, debit, atau transfer.",
    sortOrder: 1,
  },
  {
    title: "Kelola Barber",
    subtitle: "Scissors",
    description:
      "Jadwal barber, komisi, dan performa tim dalam satu dashboard terpusat.",
    sortOrder: 2,
  },
  {
    title: "Laporan Real-time",
    subtitle: "BarChart3",
    description:
      "Pendapatan harian, tren 30 hari, dan layanan terlaris selalu ter-update.",
    sortOrder: 3,
  },
] as const;

export const DEFAULT_LANDING_TESTIMONIALS = [
  {
    description:
      "Dashboard dan kasir terasa seperti sistem hotel bintang lima — cepat, rapi, dan mudah dilatih ke tim baru.",
    subtitle: "Owner, Fade House Jakarta",
    sortOrder: 1,
  },
  {
    description:
      "Laporan 30 hari membantu kami lihat layanan mana yang paling laris tanpa spreadsheet manual.",
    subtitle: "Manager Operasional",
    sortOrder: 2,
  },
] as const;
