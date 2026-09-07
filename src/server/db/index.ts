import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

import * as schema from "./schema";

// NOTE: this client speaks the Neon wire protocol (WebSocket/HTTP) and only
// accepts Vercel Postgres pooled URLs (or localhost). It cannot connect to a
// plain PostgreSQL server, so local development needs a Vercel/Neon-backed
// POSTGRES_URL. The integration suite (tests/integration) runs against plain
// PostgreSQL in Docker and substitutes a TCP client (drizzle-orm/node-postgres)
// at this module seam; every query above the transport runs unmocked there.

export const db = drizzle(sql, { schema });
