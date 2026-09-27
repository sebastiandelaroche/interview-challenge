/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    env: { VITE_API_URL: "http://localhost/api" },
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/test/**",
        "src/**/*.spec.{ts,tsx}",
        "src/**/types.ts",
      ],
    },
  },
});
