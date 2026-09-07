-- Manual cleanup for the removed special date-invite feature.
--
-- The aurora_date_request table definition was removed from
-- src/server/db/schema.ts, but code removal does not drop the table from
-- already-deployed databases. Run this once against production when the
-- feature's data is no longer needed:
--
--   psql "$POSTGRES_URL" -f scripts/drop-aurora-date-request.sql
--
-- It is idempotent (safe to run more than once).

DROP TABLE IF EXISTS aurora_date_request;
