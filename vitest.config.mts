import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Resolve the @/* alias from tsconfig natively (no extra plugin needed).
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Playwright specs live in e2e/ and run with their own runner.
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
  },
});
