import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Force Next.js dev server to use port 3001
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
