import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for optimized deployment.
  // This is required by the Railpack/Dokploy environment.
  output: "standalone",

  // Disable Turbopack for production builds to avoid OOM errors.
  // The --webpack flag in package.json ensures this, but adding it here for safety.
  experimental: {
    // Ensuring we don't use turbopack features that might trigger it.
  }
};

export default nextConfig;
