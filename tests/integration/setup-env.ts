// Per-worker setup for the integration test project.
//
// The global setup (./global-setup.ts) runs in the main process and cannot
// pass environment variables to workers directly, so it publishes the
// connection URL via provide(), with ./.pg-url kept as a fallback handoff.
// This file runs in every worker before any test module is imported and
// points the test database client at the ephemeral database.
//
// process.env is assigned here — before any query executes — which is all
// the TCP test client (./db-client.ts) needs.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inject } from "vitest";

declare module "vitest" {
  interface ProvidedContext {
    avecushoPgUrl: string;
  }
}

function readUrlFile(): string {
  const urlFile = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    ".pg-url",
  );
  try {
    return readFileSync(urlFile, "utf8").trim();
  } catch {
    return "";
  }
}

let url = "";
try {
  url = inject("avecushoPgUrl");
} catch {
  url = readUrlFile();
}

if (url) {
  process.env.POSTGRES_URL = url;
}
