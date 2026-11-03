import { rmSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function excludeMockWorkerFromBuild() {
  return {
    name: "exclude-mock-worker-from-build",
    apply: "build",
    closeBundle() {
      rmSync(
        fileURLToPath(new URL("./dist/mockServiceWorker.js", import.meta.url)),
        { force: true },
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), excludeMockWorkerFromBuild()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
    css: true,
    clearMocks: true,
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
