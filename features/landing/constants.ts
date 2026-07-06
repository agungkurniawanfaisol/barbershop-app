export type HaircutStyle = {
  slug: string;
  title: string;
  description: string;
  image: string;
};

export const STOREFRONT_IMAGE = {
  src: "/images/shop/storefront.jpg",
  alt: "Fasad depan BarberPro Hexa — barbershop modern dengan pencahayaan hangat",
} as const;

export const HAIRCUT_STYLES: HaircutStyle[] = [
  {
    slug: "fade-classic",
    title: "Fade Classic",
    description: "Transisi halus dari samping ke atas — tampilan rapi sehari-hari.",
    image: "/images/haircuts/fade-classic.jpg",
  },
  {
    slug: "skin-fade",
    title: "Skin Fade",
    description: "Gradasi tajam ke kulit kepala untuk look modern dan bersih.",
    image: "/images/haircuts/skin-fade.jpg",
  },
  {
    slug: "pompadour",
    title: "Pompadour",
    description: "Volume di atas dengan sisi rapi — klasik dengan sentuhan kontemporer.",
    image: "/images/haircuts/pompadour.jpg",
  },
  {
    slug: "buzz-cut",
    title: "Buzz Cut",
    description: "Potongan pendek seragam, praktis dan selalu on-point.",
    image: "/images/haircuts/buzz-cut.jpg",
  },
];

export const LANDING_BENEFITS = [
  {
    title: "POS Cepat",
    description:
      "Checkout layanan dalam hitungan detik — tunai, QRIS, debit, atau transfer.",
  },
  {
    title: "Kelola Barber",
    description:
      "Jadwal barber, komisi, dan performa tim dalam satu dashboard terpusat.",
  },
  {
    title: "Laporan Real-time",
    description:
      "Pendapatan harian, tren 30 hari, dan layanan terlaris selalu ter-update.",
  },
] as const;
