// Global setup for the integration test project.
//
// Starts an ephemeral PostgreSQL container (postgres:17-alpine) on a
// dynamically mapped host port, waits until it accepts connections, creates
// the tables from ./schema.sql, and publishes the connection URL to
// ./​.pg-url so worker processes can pick it up in ./setup-env.ts.
//
// If TEST_POSTGRES_URL is set, no container is started and the schema is
// applied to that database instead. Point it at a DISPOSABLE database: the
// suite truncates tables between tests.
//
// Vitest calls the default export before the workers start and calls the
// returned function as teardown afterwards.

import { execFile } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const execFileAsync = promisify(execFile);

const here = path.dirname(fileURLToPath(import.meta.url));
export const pgUrlFile = path.join(here, ".pg-url");

const IMAGE = "postgres:17-alpine";
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
  // onnotice swallows the "relation already exists, skipping" notices so
  // reusing a database via TEST_POSTGRES_URL stays quiet.
  const sql = postgres(url, { max: 1, onnotice: () => undefined });
  try {
    // CREATE TYPE has no IF NOT EXISTS variant, so create the enum only when
    // it is missing (matters when reusing a database via TEST_POSTGRES_URL).
    const existing = await sql`SELECT 1 FROM pg_type WHERE typname = 'user_role'`;
    if (existing.length === 0) {
      await sql.unsafe(`CREATE TYPE user_role AS ENUM ('ADMIN', 'USER')`);
    }
    const schema = await readFile(path.join(here, "schema.sql"), "utf8");
    const statements = schema
      .split(/;\s*\n/)
      .map((statement) => statement.trim().replace(/;$/, ""))
      .filter(Boolean);
    for (const statement of statements) {
      await sql.unsafe(statement);
    }
  } finally {
    await sql.end();
  }
}

export default async function setup(): Promise<() => Promise<void>> {
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

  await waitForReady(url);
  await applySchema(url);
  await writeFile(pgUrlFile, url, "utf8");

  return async () => {
    await unlink(pgUrlFile).catch(() => undefined);
    if (containerName) {
      await docker("stop", containerName).catch(() => undefined);
    }
  };
}
