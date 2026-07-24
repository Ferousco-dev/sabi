import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-f170a2592d2c4a1485466404c36807be.r2.dev",
      },
    ],
  },
};

export default nextConfig;
