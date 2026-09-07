// Per-worker setup for the integration test project.
//
// The global setup (./global-setup.ts) runs in the main process and cannot
// pass environment variables to workers directly, so it publishes the
// connection URL to ./.pg-url. This file runs in every worker before any
// test module is imported and points the app's database client
// (src/server/db, via @vercel/postgres) at the ephemeral database.
//
// @vercel/postgres resolves POSTGRES_URL lazily on first query, so setting
// process.env here — before any query executes — is sufficient.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const urlFile = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  ".pg-url",
);

try {
  const url = readFileSync(urlFile, "utf8").trim();
  if (url) {
    process.env.POSTGRES_URL = url;
  }
} catch {
  // Global setup did not run; leave the environment untouched so the failure
  // surfaces as a missing-connection error instead of a crash here.
}
