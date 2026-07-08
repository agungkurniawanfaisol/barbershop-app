import type { NextConfig } from "next";

function getSupabaseImagePattern(): { protocol: "https"; hostname: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return { protocol: "https", hostname: new URL(url).hostname };
  } catch {
    return null;
  }
}

const supabasePattern = getSupabaseImagePattern();

const nextConfig: NextConfig = {
  output: "standalone",
  images: supabasePattern
    ? {
        remotePatterns: [
          {
            ...supabasePattern,
            pathname: "/storage/v1/object/public/**",
          },
        ],
      }
    : undefined,
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ["**/node_modules/**", "**/.git/**"],
      };
    }
    return config;
  },
};

export default nextConfig;
