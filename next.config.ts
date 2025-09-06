import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    reactStrictMode: true,
    output: 'standalone',
    eslint: { ignoreDuringBuilds: true },
    productionBrowserSourceMaps: true,
};

export default nextConfig;
