import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js 15 blocks optimization for private IPs (SSRF protection).
    // In dev MinIO runs on localhost — skip optimization so images still render.
    // In production MinIO will have a real hostname and optimization works normally.
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9200",
      },
    ],
  },
};

export default nextConfig;
