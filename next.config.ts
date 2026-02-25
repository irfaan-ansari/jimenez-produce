import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: "drive.google.com" },
      { hostname: "api.dicebear.com" },
      { hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
