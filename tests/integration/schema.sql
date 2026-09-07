-- Minimal schema for the integration test suite (tests/integration).
-- Mirrors the table definitions in src/server/db/schema.ts for the tables
-- exercised by the query layer. Uses IF NOT EXISTS so the suite can also run
-- against a disposable database provided via TEST_POSTGRES_URL.
--
-- NOTE: the "user" table name is quoted because USER is reserved in Postgres.
-- NOTE: the user_role enum is created by global-setup.ts (CREATE TYPE has no
-- IF NOT EXISTS), not here.

CREATE TABLE IF NOT EXISTS "user" (
  id uuid PRIMARY KEY,
  name text,
  email text UNIQUE,
  "emailVerified" timestamp,
  image text,
  password text,
  role user_role DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS aurora_item (
  id serial PRIMARY KEY,
  name varchar(256) NOT NULL,
  url varchar(1024) NOT NULL,
  price numeric(10, 2) NOT NULL,
  description text NOT NULL,
  "userId" uuid REFERENCES "user"(id),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS aurora_user_data (
  "userId" uuid PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  country text,
  state text,
  city text,
  postcode text,
  street text,
  "houseNumber" text,
  "apartmentNumber" text,
  "phoneNumber" text
);

CREATE TABLE IF NOT EXISTS aurora_cart (
  id serial PRIMARY KEY,
  "userId" uuid REFERENCES "user"(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS aurora_cart_item (
  id serial PRIMARY KEY,
  "cartId" integer REFERENCES aurora_cart(id) ON DELETE CASCADE,
  "itemId" integer REFERENCES aurora_item(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "aurora_verificationToken" (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  token text NOT NULL,
  expires timestamptz NOT NULL,
  CONSTRAINT email_token_unique UNIQUE (email, token)
);
