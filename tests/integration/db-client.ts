// TCP-backed drizzle client for the integration test suite.
//
// The app's production client (~/server/db, drizzle-orm/vercel-postgres)
// speaks the Neon WebSocket protocol and cannot connect to a plain
// PostgreSQL server. Integration tests therefore substitute this client at
// the ~/server/db module seam via `vi.mock("~/server/db", ...)` (see the
// test files). Everything above the transport — every query function in
// ~/server/queries(*), all drizzle query builders, the schema and its
// constraints — runs unmocked against real PostgreSQL.

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "~/server/db/schema";

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  throw new Error(
    "POSTGRES_URL is not set. Run via the integration project so that " +
      "tests/integration/global-setup.ts (or TEST_POSTGRES_URL) provides it.",
  );
}

const pool = new Pool({ connectionString });

export const testDb = drizzle(pool, { schema });

export async function closeTestDb(): Promise<void> {
  await pool.end();
}
