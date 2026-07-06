declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "test" | "production";
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    DATABASE_URL: string;
    DIRECT_URL?: string;
    REDIS_URL?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_FROM?: string;
    MAILPIT_URL?: string;
    NEXT_PUBLIC_TAX_RATE?: string;
    NEXT_PUBLIC_CURRENCY?: string;
    NEXT_PUBLIC_SHOP_NAME?: string;
  }
}
