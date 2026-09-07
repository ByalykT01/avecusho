import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const alias = {
  "~": path.resolve(rootDir, "./src"),
  "server-only": path.resolve(rootDir, "./tests/__mocks__/server-only.ts"),
};

export default defineConfig({
  resolve: { alias },
  test: {
    environment: "node",
    globals: false,
    // Two projects sharing the same aliases:
    // - unit: route-handler (mocked data access), schema validation, utils.
    //   No database or Docker required.
    // - integration: real PostgreSQL via an ephemeral Docker container
    //   started in tests/integration/global-setup.ts (or TEST_POSTGRES_URL).
    projects: [
      {
        resolve: { alias },
        test: {
          name: "unit",
          environment: "node",
          include: [
            "tests/routes/**/*.test.ts",
            "tests/lib/**/*.test.ts",
            "tests/schemas/**/*.test.ts",
          ],
          testTimeout: 10_000,
        },
      },
      {
        resolve: { alias },
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.test.ts"],
          globalSetup: ["tests/integration/global-setup.ts"],
          setupFiles: ["tests/integration/setup-env.ts"],
          testTimeout: 60_000,
          hookTimeout: 120_000,
          // The suite truncates shared tables between tests, so files must
          // not run against the database concurrently.
          pool: "forks",
          fileParallelism: false,
          sequence: { shuffle: false },
        },
      },
    ],
  },
});
