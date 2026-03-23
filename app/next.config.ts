import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove X-Powered-By header to prevent information leakage
  poweredByHeader: false,
};

export default nextConfig;
