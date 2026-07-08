import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function getRuntimeConnectionString(): string {
  const isServerless =
    process.env.VERCEL === "1" || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isServerless || process.env.NODE_ENV === "production") {
    return process.env.DATABASE_URL ?? process.env.DIRECT_URL ?? "";
  }

  return process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";
}

function createPrismaClient(): PrismaClient {
  const connectionString = getRuntimeConnectionString();
  const isServerless =
    process.env.VERCEL === "1" || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      max: isServerless ? 1 : 10,
      idleTimeoutMillis: isServerless ? 5_000 : 30_000,
      connectionTimeoutMillis: 10_000,
    });
  const adapter = new PrismaPg(pool);

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
