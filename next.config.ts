import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Golden Rule 8: React Compiler is the single memoization strategy.
  // Stable in Next 16; runs via babel-plugin-react-compiler behind an SWC filter.
  reactCompiler: true,
  images: {
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
