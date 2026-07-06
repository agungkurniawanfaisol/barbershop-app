import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import {
  format,
  setHours,
  setMinutes,
  subDays,
} from "date-fns";
import {
  PrismaClient,
  type PaymentMethod,
  type UserRole,
} from "../app/generated/prisma/client";
import { SETTING_CATEGORY, SETTING_KEYS } from "../constants/settings";
import { calculateBarberCommission } from "../utils/barber-commission";

const SEED_VERSION = "2026-07-06-earnings";

const DEMO_USERS = [
  {
    email: "admin@barberpro.local",
    password: "BarberAdmin2026!",
    role: "ADMIN" as UserRole,
    fullName: "Admin BarberPro",
  },
  {
    email: "manager@barberpro.local",
    password: "BarberMgr2026!",
    role: "MANAGER" as UserRole,
    fullName: "Rizki Manager",
  },
  {
    email: "cashier@barberpro.local",
    password: "BarberCash2026!",
    role: "CASHIER" as UserRole,
    fullName: "Dewi Kasir",
  },
] as const;

const BARBERS = [
  {
    name: "Andi Fade",
    phone: "081234567801",
    photoPath: "/images/haircuts/skin-fade.jpg",
  },
  {
    name: "Budi Classic",
    phone: "081234567802",
    photoPath: "/images/haircuts/fade-classic.jpg",
  },
  {
    name: "Candra Pompadour",
    phone: "081234567803",
    photoPath: "/images/haircuts/pompadour.jpg",
  },
] as const;

const BARBER_DEMO_USERS = [
  {
    email: "andi@barberpro.local",
    password: "BarberBarber2026!",
    role: "BARBER" as UserRole,
    fullName: "Andi Fade",
    barberIndex: 0,
  },
  {
    email: "budi@barberpro.local",
    password: "BarberBarber2026!",
    role: "BARBER" as UserRole,
    fullName: "Budi Classic",
    barberIndex: 1,
  },
  {
    email: "candra@barberpro.local",
    password: "BarberBarber2026!",
    role: "BARBER" as UserRole,
    fullName: "Candra Pompadour",
    barberIndex: 2,
  },
] as const;

const CUSTOMERS = [
  { name: "Raka Pratama", phone: "081112223301" },
  { name: "Fajar Nugroho", phone: "081112223302" },
  { name: "Gilang Wijaya", phone: "081112223303" },
  { name: "Hendra Saputra", phone: "081112223304" },
  { name: "Iqbal Ramadhan", phone: "081112223305" },
  { name: "Joko Santoso", phone: "081112223306" },
] as const;

const PAYMENT_METHODS: PaymentMethod[] = [
  "CASH",
  "QRIS",
  "DEBIT",
  "TRANSFER",
];

function createPrisma() {
  const connectionString =
    process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return { prisma: new PrismaClient({ adapter }), pool };
}

function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase env for seed");
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function ensureAuthUser(
  admin: ReturnType<typeof createSupabaseAdmin>,
  user: {
    email: string;
    password: string;
    role: UserRole;
    fullName: string;
  },
) {
  const { data: listed } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const existing = listed.users.find((u) => u.email === user.email);

  if (existing) {
    await admin.auth.admin.updateUserById(existing.id, {
      password: user.password,
      email_confirm: true,
      app_metadata: { role: user.role },
      user_metadata: { full_name: user.fullName },
    });
    return existing;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
    app_metadata: { role: user.role },
    user_metadata: { full_name: user.fullName },
  });

  if (error || !data.user) {
    throw new Error(`Failed to create auth user ${user.email}: ${error?.message}`);
  }

  return data.user;
}

async function main() {
  const { prisma, pool } = createPrisma();
  const admin = createSupabaseAdmin();

  try {
    const existingSeed = await prisma.setting.findUnique({
      where: { key: "seed.version" },
    });
    if (existingSeed?.value === SEED_VERSION) {
      console.log(`Seed ${SEED_VERSION} already applied — skipping.`);
      return;
    }

    console.log("Seeding demo users...");
    const authUsers = [];
    for (const demo of DEMO_USERS) {
      const authUser = await ensureAuthUser(admin, demo);
      authUsers.push({ authUser, demo });
    }

    const prismaUsers = [];
    for (const { authUser, demo } of authUsers) {
      const user = await prisma.user.upsert({
        where: { email: demo.email },
        create: {
          id: authUser.id,
          email: demo.email,
          fullName: demo.fullName,
          role: demo.role,
          isActive: true,
        },
        update: {
          fullName: demo.fullName,
          role: demo.role,
          isActive: true,
        },
      });
      prismaUsers.push(user);
    }

    console.log("Seeding barber login users...");
    const barberUsers = [];
    for (const demo of BARBER_DEMO_USERS) {
      const authUser = await ensureAuthUser(admin, demo);
      const user = await prisma.user.upsert({
        where: { email: demo.email },
        create: {
          id: authUser.id,
          email: demo.email,
          fullName: demo.fullName,
          role: demo.role,
          isActive: true,
        },
        update: {
          fullName: demo.fullName,
          role: demo.role,
          isActive: true,
        },
      });
      barberUsers.push({ user, demo });
    }

    const adminUser = prismaUsers.find((u) => u.role === "ADMIN")!;
    const cashierUser = prismaUsers.find((u) => u.role === "CASHIER")!;

    console.log("Seeding shop settings...");
    const settings = [
      { key: SETTING_KEYS.shopName, value: "BarberPro Hexa" },
      {
        key: SETTING_KEYS.shopAddress,
        value: "Jl. Sudirman No. 45, Jakarta Pusat",
      },
      { key: SETTING_KEYS.shopPhone, value: "021-555-0101" },
      { key: SETTING_KEYS.taxRate, value: 11 },
      { key: SETTING_KEYS.currency, value: "IDR" },
      {
        key: SETTING_KEYS.receiptFooter,
        value: "Terima kasih — sampai jumpa lagi!",
      },
      { key: SETTING_KEYS.defaultCommissionRate, value: 25 },
    ];

    for (const setting of settings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        create: {
          key: setting.key,
          value: setting.value,
          category: SETTING_CATEGORY,
        },
        update: { value: setting.value },
      });
    }

    console.log("Seeding service categories & services...");
    const categories = [
      {
        name: "Haircut",
        description: "Potong dan styling rambut",
        sortOrder: 1,
        services: [
          {
            name: "Fade Premium",
            description: "Skin fade dengan finishing rapi",
            price: 75000,
            durationMinutes: 45,
          },
          {
            name: "Classic Cut",
            description: "Potongan klasik sesuai bentuk wajah",
            price: 55000,
            durationMinutes: 30,
          },
          {
            name: "Buzz Cut",
            description: "Potongan seragam pendek",
            price: 40000,
            durationMinutes: 20,
          },
        ],
      },
      {
        name: "Beard & Grooming",
        description: "Perawatan jenggot dan grooming",
        sortOrder: 2,
        services: [
          {
            name: "Beard Trim",
            description: "Trim dan shaping jenggot",
            price: 35000,
            durationMinutes: 20,
          },
          {
            name: "Hot Towel Shave",
            description: "Cukur dengan hot towel",
            price: 45000,
            durationMinutes: 25,
          },
        ],
      },
      {
        name: "Paket",
        description: "Kombinasi layanan hemat",
        sortOrder: 3,
        services: [
          {
            name: "Haircut + Beard",
            description: "Potong rambut dan trim jenggot",
            price: 95000,
            durationMinutes: 60,
          },
        ],
      },
    ];

    const allServices: Array<{
      id: string;
      name: string;
      price: number;
    }> = [];

    for (const cat of categories) {
      const category = await prisma.serviceCategory.upsert({
        where: { name: cat.name },
        create: {
          name: cat.name,
          description: cat.description,
          sortOrder: cat.sortOrder,
          isActive: true,
        },
        update: {
          description: cat.description,
          sortOrder: cat.sortOrder,
          isActive: true,
        },
      });

      for (const svc of cat.services) {
        const existing = await prisma.service.findFirst({
          where: { name: svc.name, deletedAt: null },
        });
        const service = existing
          ? await prisma.service.update({
              where: { id: existing.id },
              data: {
                categoryId: category.id,
                description: svc.description,
                price: svc.price,
                durationMinutes: svc.durationMinutes,
                isActive: true,
              },
            })
          : await prisma.service.create({
              data: {
                categoryId: category.id,
                name: svc.name,
                description: svc.description,
                price: svc.price,
                durationMinutes: svc.durationMinutes,
                isActive: true,
              },
            });
        allServices.push({
          id: service.id,
          name: service.name,
          price: Number(service.price),
        });
      }
    }

    console.log("Seeding barbers...");
    const barbers = [];
    for (let i = 0; i < BARBERS.length; i += 1) {
      const barber = BARBERS[i]!;
      const linkedUser = barberUsers.find((b) => b.demo.barberIndex === i)?.user;
      const existing = await prisma.employee.findFirst({
        where: { phone: barber.phone, deletedAt: null },
      });
      const employee = existing
        ? await prisma.employee.update({
            where: { id: existing.id },
            data: {
              name: barber.name,
              photoUrl: barber.photoPath,
              isActive: true,
              commissionRate: 25,
              userId: linkedUser?.id ?? null,
            },
          })
        : await prisma.employee.create({
            data: {
              name: barber.name,
              phone: barber.phone,
              photoUrl: barber.photoPath,
              role: "BARBER",
              commissionRate: 25,
              salary: 4500000,
              isActive: true,
              hireDate: subDays(new Date(), 180),
              userId: linkedUser?.id ?? null,
            },
          });
      barbers.push(employee);
    }

    console.log("Seeding customers...");
    const customers = [];
    for (const customer of CUSTOMERS) {
      const row = await prisma.customer.upsert({
        where: { phone: customer.phone },
        create: {
          name: customer.name,
          phone: customer.phone,
          visitCount: 0,
          loyaltyPoints: 0,
        },
        update: { name: customer.name },
      });
      customers.push(row);
    }

    const txCount = await prisma.transaction.count();
    if (txCount < 20) {
      console.log("Seeding sample transactions...");
      const taxPercent = 11;
      let seq = txCount + 1;

      for (let dayOffset = 29; dayOffset >= 0; dayOffset -= 1) {
        const txsToday = dayOffset % 3 === 0 ? 2 : dayOffset % 2 === 0 ? 1 : 0;
        for (let t = 0; t < txsToday; t += 1) {
          const service = allServices[(dayOffset + t) % allServices.length]!;
          const barber = barbers[(dayOffset + t) % barbers.length]!;
          const customer = customers[(dayOffset + t) % customers.length]!;
          const paymentMethod =
            PAYMENT_METHODS[(dayOffset + t) % PAYMENT_METHODS.length] ?? "CASH";
          const subtotal = service.price;
          const taxAmount = Math.round(subtotal * (taxPercent / 100));
          const total = subtotal + taxAmount;
          const paidAt = setMinutes(
            setHours(subDays(new Date(), dayOffset), 10 + t * 2),
            15 + t * 10,
          );
          const dateKey = format(paidAt, "yyyyMMdd");
          const transactionNumber = `TRX-${dateKey}-${String(seq).padStart(4, "0")}`;
          seq += 1;

          await prisma.transaction.create({
            data: {
              transactionNumber,
              customerId: customer.id,
              barberId: barber.id,
              cashierId: cashierUser.id,
              subtotal,
              taxAmount,
              taxPercent,
              total,
              paymentMethod,
              status: "COMPLETED",
              paidAt,
              items: {
                create: {
                  serviceId: service.id,
                  serviceName: service.name,
                  price: service.price,
                  quantity: 1,
                },
              },
            },
          });
        }
      }
    }

    console.log("Backfilling barber commission snapshots...");
    const barberRateById = new Map(
      barbers.map((barber) => [barber.id, Number(barber.commissionRate)]),
    );
    const transactionsToBackfill = await prisma.transaction.findMany({
      where: {
        barberId: { not: null },
        barberCommissionAmount: null,
        deletedAt: null,
      },
      select: {
        id: true,
        barberId: true,
        subtotal: true,
        discountAmount: true,
      },
    });

    for (const tx of transactionsToBackfill) {
      if (!tx.barberId) continue;
      const rate = barberRateById.get(tx.barberId) ?? 25;
      const subtotal = Number(tx.subtotal);
      const discountAmount = Number(tx.discountAmount);
      const commission = calculateBarberCommission(subtotal, discountAmount, rate);
      await prisma.transaction.update({
        where: { id: tx.id },
        data: {
          barberCommissionRate: commission.commissionRate,
          barberCommissionAmount: commission.commissionAmount,
        },
      });
    }

    await prisma.setting.upsert({
      where: { key: "seed.version" },
      create: {
        key: "seed.version",
        value: SEED_VERSION,
        category: "system",
      },
      update: { value: SEED_VERSION },
    });

    console.log("Seed complete.");
    console.log(`Admin user id: ${adminUser.id}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
