import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { hostname: 'polymarket-upload.s3.us-east-2.amazonaws.com' },
      { hostname: 'polymarket-static.s3.us-east-2.amazonaws.com' },
      { hostname: '*.polymarket.com' },
    ],
  },
};

export default nextConfig;
