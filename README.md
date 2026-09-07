# Avecusho Art Store

Online gallery and store for artist Aurora Khokhliuk: browse artwork, manage a shopping cart, and check out with Stripe. Built with Next.js 14 (App Router), PostgreSQL with Drizzle ORM, and NextAuth.

**Live demo:** https://avecusho.vercel.app

## Features

**Storefront**

- Artwork gallery with dedicated item pages
- Shopping cart (add, view, remove)
- Stripe checkout with an embedded payment form
- Sign-in with Google or email/password (NextAuth)
- Contact page

**Artist admin**

- Upload new artwork (images via UploadThing)
- Role-gated admin area

## Tech stack

- Framework: Next.js 14 (App Router), React 18, TypeScript
- Database: PostgreSQL, Drizzle ORM
- Authentication: NextAuth v5 (Google OAuth, credentials)
- Payments: Stripe
- Image uploads: UploadThing
- Styling: Tailwind CSS, shadcn/ui
- Analytics: PostHog

## Getting started

Prerequisites: Node.js 18+, pnpm 9, a PostgreSQL database, and accounts for Stripe, Google OAuth, and UploadThing (only needed for the features that use them).

1. Clone the repository:

   ```bash
   git clone git@github.com:ByalykT01/avecusho.git
   cd avecusho
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Configure the environment:

   ```bash
   cp .env.example .env
   ```

   Fill in the values described below.

4. Apply the database migrations:

   ```bash
   pnpm db:migrate
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

   Open http://localhost:3000.

Note on the database connection: the app's database client (`src/server/db`, via `@vercel/postgres`) speaks the Neon wire protocol, so `POSTGRES_URL` must be a Vercel/Neon-compatible URL. A plain local PostgreSQL container is not sufficient for `next dev` — use a Neon/Vercel database or a compatible proxy.

## Environment variables

| Variable                                    | Required           | Used for                                                                               |
| ------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------- |
| `POSTGRES_URL`                              | Yes                | Database access (Drizzle, Auth.js adapter, queries)                                    |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | For Google sign-in | NextAuth Google provider                                                               |
| `NEXTAUTH_SECRET`                           | Yes in production  | NextAuth session encryption                                                            |
| `NEXTAUTH_URL`                              | Yes in production  | NextAuth callbacks (defaults locally)                                                  |
| `STRIPE_SECRET_KEY`                         | For checkout       | Checkout Sessions, product lookup                                                      |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`        | For checkout       | Stripe.js on the purchase page                                                         |
| `UPLOADTHING_SECRET` / `UPLOADTHING_APP_ID` | For uploads        | Artwork image uploads                                                                  |
| `NEXT_PUBLIC_POSTHOG_KEY`                   | No                 | Analytics                                                                              |
| `SKIP_ENV_VALIDATION`                       | No                 | Skip env validation (CI, lint)                                                         |
| `TEST_POSTGRES_URL`                         | No                 | Integration tests: reuse a disposable `_test` database instead of starting a container |
| `TEST_PG_IMAGE`                             | No                 | Integration tests: container image (default `postgres:17-alpine`)                      |

## Testing

```bash
pnpm test                 # everything: unit + integration
pnpm test:unit            # no database or Docker required
pnpm test:integration     # real PostgreSQL (see below)
```

- `tests/routes/`, `tests/schemas/`, `tests/lib/` — route-handler and validation tests. The data-access layer is mocked on purpose; they cover HTTP status codes, request validation, and response shapes only.
- `tests/integration/` — data-access coverage against real PostgreSQL. The suite starts an ephemeral container (Docker required), applies the committed `drizzle/` migrations — the exact schema production uses — seeds rows through the real query functions in `src/server/queries`, and asserts against what is stored. Only the connection factory (`~/server/db`) is substituted with a TCP client (`tests/integration/db-client.ts`), because the app's pooled Neon driver cannot speak to plain PostgreSQL; every query and all SQL run unmocked.

## API overview

All request/response bodies are JSON.

| Method | Endpoint                 | Purpose                                           |
| ------ | ------------------------ | ------------------------------------------------- |
| GET    | `/api/items/allitems`    | List all items (empty store returns `[]`)         |
| POST   | `/api/items/oneitem`     | Single item by `itemId`                           |
| POST   | `/api/item`              | Stripe product lookup/creation for an item        |
| POST   | `/api/item/bought`       | Mark an item purchased by a user                  |
| POST   | `/api/bought-items`      | Items purchased by a user                         |
| POST   | `/api/cart/add`          | Add an item to the user's cart                    |
| POST   | `/api/cart/items`        | Items in the user's cart                          |
| POST   | `/api/cart/item`         | Look up a single cart entry                       |
| DELETE | `/api/cart/delete`       | Remove an item from the cart                      |
| POST   | `/api/checkout_sessions` | Create a Stripe Checkout Session                  |
| POST   | `/api/upload`            | Create a new artwork listing (validated with Zod) |
| POST   | `/api/user/find`         | User profile with details                         |
| POST   | `/api/user/edit`         | Create or update profile details                  |
| GET    | `/api/admin`             | Role check (200 for admins, 403 otherwise)        |

## Project structure

```
src/
├── actions/         # Server actions
├── app/             # App Router pages and API routes
├── components/      # React components (UI, auth, nav, store)
├── lib/             # Auth helpers, tokens, type definitions
├── schemas/         # Zod validation schemas
├── server/
│   ├── db/          # Database client and Drizzle schema
│   └── queries/     # Data-access layer
├── middleware.ts    # Auth middleware (route gating)
├── providers/       # Client-side providers
└── utils/           # Shared utilities
tests/
├── routes/          # Route-handler tests (mocked data access)
├── schemas/         # Schema validation tests
├── lib/             # Utility tests
└── integration/     # Integration tests (real PostgreSQL)
drizzle/             # Committed database migrations
scripts/            # One-off maintenance scripts
```

## Scripts

| Command                                        | Purpose                                     |
| ---------------------------------------------- | ------------------------------------------- |
| `pnpm dev`                                     | Start the development server                |
| `pnpm build` / `pnpm start`                    | Production build / serve it                 |
| `pnpm lint`                                    | Lint (needs env or `SKIP_ENV_VALIDATION=1`) |
| `pnpm test` / `test:unit` / `test:integration` | Test suites                                 |
| `pnpm db:generate`                             | Generate a migration from schema changes    |
| `pnpm db:migrate`                              | Apply migrations to `POSTGRES_URL`          |
| `pnpm db:push`                                 | Push the schema directly (development)      |
| `pnpm db:studio`                               | Open Drizzle Studio                         |

## Issues

Bug reports and feature requests: https://github.com/ByalykT01/avecusho/issues
