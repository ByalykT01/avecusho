import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    globals: false,
    testTimeout: 10_000,
  },
  resolve: {
    alias: {
      "~": path.resolve(rootDir, "./src"),
      "server-only": path.resolve(rootDir, "./tests/__mocks__/server-only.ts"),
    },
  },
});
