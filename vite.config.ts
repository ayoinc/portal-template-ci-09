import react from "@vitejs/plugin-react";
import { msw } from "msw/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // msw serves /mockServiceWorker.js from the development server only.
  plugins: [react(), { ...msw({ mode: "worker-only" }), apply: "serve" }],
  server: {
    port: 5173,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/main.tsx", "src/mocks/browser.ts", "src/**/*.stories.tsx", "src/**/*.d.ts"],
      reporter: ["text", "lcov"],
    },
  },
});
