import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Golden Rule 8: React Compiler is the single memoization strategy.
  // Stable in Next 16; runs via babel-plugin-react-compiler behind an SWC filter.
  reactCompiler: true,
  images: {
    // Avatars are immutable, so cache each optimized variant for 30 days. Once an
    // avatar is fetched, the optimizer serves it from disk and never re-hits the
    // public API — which is what keeps us under its rate limit while browsing.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Character avatars live at https://rickandmortyapi.com/api/character/avatar/<id>.jpeg
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rickandmortyapi.com",
        pathname: "/api/character/avatar/**",
      },
    ],
  },
};

export default nextConfig;
