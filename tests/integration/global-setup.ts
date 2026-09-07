// Global setup for the integration test project.
//
// Starts an ephemeral PostgreSQL container on a dynamically mapped host
// port, waits until it accepts connections, applies the committed drizzle
// migrations (drizzle/), and publishes the connection URL to workers via
// provide() (see ./setup-env.ts) plus the ./.pg-url fallback file.
//
// If TEST_POSTGRES_URL is set, no container is started and the migrations
// are applied to that database instead. It must be a DISPOSABLE database
// whose name ends with _test: the suite truncates tables between tests and
// setup refuses anything else.
//
// Vitest calls the default export before the workers start and calls the
// returned function as teardown afterwards.

import { execFile } from "node:child_process";
import { randomBytes } from "node:crypto";
import { unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

// Minimal structural type for the global-setup context (vitest does not
// export a public type for it). `provide` publishes values that workers
// read back via `inject` (see ./setup-env.ts).
interface SetupContext {
  provide: (key: "avecushoPgUrl", value: string) => void;
}

const execFileAsync = promisify(execFile);

const here = path.dirname(fileURLToPath(import.meta.url));
export const pgUrlFile = path.join(here, ".pg-url");

// Override to match production's exact PostgreSQL version
// (e.g. TEST_PG_IMAGE=postgres:15-alpine).
const IMAGE = process.env.TEST_PG_IMAGE?.trim() || "postgres:17-alpine";
const READY_TIMEOUT_MS = 90_000;

async function docker(...args: string[]): Promise<string> {
  const { stdout } = await execFileAsync("docker", args);
  return stdout.trim();
}

function redact(url: string): string {
  return url.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:<redacted>@");
}

async function waitForReady(url: string): Promise<void> {
  const sql = postgres(url, { max: 1, connect_timeout: 2 });
  try {
    const deadline = Date.now() + READY_TIMEOUT_MS;
    for (;;) {
      try {
        await sql`select 1`;
        return;
      } catch (error) {
        if (Date.now() > deadline) {
          throw new Error(
            `Postgres at ${redact(url)} never became ready: ${String(error)}`,
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  } finally {
    await sql.end();
  }
}

async function applySchema(url: string): Promise<void> {
  // Apply the committed drizzle migrations — the exact schema
  // representation production uses. Already-applied migrations are skipped,
  // so reusing a database via TEST_POSTGRES_URL is idempotent and quiet.
  const pool = new Pool({ connectionString: url });
  try {
    const db = drizzle(pool);
    await migrate(db, {
      migrationsFolder: path.join(here, "..", "..", "drizzle"),
    });
  } finally {
    await pool.end();
  }
}

export default async function setup({
  provide,
}: SetupContext): Promise<() => Promise<void>> {
  const externalUrl = process.env.TEST_POSTGRES_URL?.trim();
  let containerName: string | null = null;
  let url: string;

  if (externalUrl) {
    url = externalUrl;
    console.log("[integration] TEST_POSTGRES_URL is set, reusing database");
  } else {
    const password = randomBytes(12).toString("hex");
    containerName = `avecusho-integration-pg-${process.pid}`;
    // A previous crashed run may have left the (non---rm) name behind.
    await docker("rm", "-f", containerName).catch(() => undefined);
    await docker(
      "run",
      "-d",
      "--rm",
      "--name",
      containerName,
      "-e",
      "POSTGRES_USER=postgres",
      "-e",
      `POSTGRES_PASSWORD=${password}`,
      "-e",
      "POSTGRES_DB=avecusho_test",
      "-p",
      "127.0.0.1::5432",
      IMAGE,
    );
    const portMapping = await docker("port", containerName, "5432");
    const hostPort = portMapping.split("\n")[0]?.split(":").pop()?.trim();
    if (!hostPort) {
      throw new Error(
        `Could not determine the mapped port of ${containerName}: ${portMapping}`,
      );
    }
    // NOTE: hostname must be literally "localhost": @vercel/postgres only
    // accepts localhost or *-pooler.* connection strings for pooled clients.
    url = `postgresql://postgres:${password}@localhost:${hostPort}/avecusho_test`;
    console.log(
      `[integration] started ephemeral Postgres ${containerName} on port ${hostPort}`,
    );
  }

  // Safety guard: the suite truncates tables, so refuse anything that is
  // not obviously a disposable test database.
  const dbName = new URL(url).pathname.replace(/^\//, "").split("/")[0];
  if (!dbName?.endsWith("_test")) {
    throw new Error(
      `Refusing to run integration tests against database "${dbName ?? url}": ` +
        "use the ephemeral container (default) or point TEST_POSTGRES_URL " +
        "at a disposable database whose name ends with _test.",
    );
  }

  await waitForReady(url);
  await applySchema(url);
  provide("avecushoPgUrl", url);
  await writeFile(pgUrlFile, url, "utf8");

  return async () => {
    await unlink(pgUrlFile).catch(() => undefined);
    if (containerName) {
      await docker("stop", containerName).catch(() => undefined);
    }
  };
}
