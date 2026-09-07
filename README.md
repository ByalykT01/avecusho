# Avecusho Art Store

A modern e-commerce platform built for artist to showcase and sell her artwork. This project uses Next.js 14 with App Router, featuring server-side rendering, dynamic routing, and a seamless shopping experience.

## Features

### User Features
- 🎨 Browse artwork gallery
- 🛍️ Shopping cart functionality
- 💳 Secure checkout with Stripe
- 👤 User authentication
- 📱 Responsive design
- 🖼️ Dynamic image loading and optimization

### Admin Features
- 📤 Upload new artwork
- 💼 Manage inventory
- 📊 View sales statistics
- 👥 User management

### Technical Features
- 🔐 Next-Auth authentication
- 🎯 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🗄️ PostgreSQL database with Drizzle ORM
- 💳 Stripe payment integration
- 📤 UploadThing for image uploads
- 📊 PostHog analytics integration

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Authentication**: Next-Auth
- **Styling**: Tailwind CSS, Shadcn UI
- **Payment Processing**: Stripe
- **Image Upload**: UploadThing
- **Analytics**: PostHog

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL
- Stripe account
- UploadThing account

### Environment Variables

Create a `.env` file with:

```bash
# Database
POSTGRES_URL=

# Next Auth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# UploadThing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
```

### Installation

1. Clone the repository:
```bash
git clone git@github.com:ByalykT01/avecusho.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:migrate
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

> Note: the app's database client (`src/server/db`, via `@vercel/postgres`)
> speaks the Neon wire protocol and only accepts Vercel Postgres pooled URLs
> (or `localhost`). A plain local PostgreSQL container is not sufficient for
> `next dev` — use a Vercel/Neon-backed `POSTGRES_URL`.

## Testing

```bash
pnpm test              # everything: unit + integration
pnpm test:unit         # no database or Docker required
pnpm test:integration  # real PostgreSQL (see below)
```

- `tests/routes/`, `tests/schemas/`, `tests/lib/` — route-handler and
  validation tests. The data-access layer is mocked on purpose; they cover
  HTTP status codes, request validation and response shapes only.
- `tests/integration/` — real data-access coverage against PostgreSQL. The
  suite starts an ephemeral `postgres:17-alpine` container (Docker required),
  applies `tests/integration/schema.sql`, seeds rows through the app's real
  query functions in `src/server/queries(*)`, and asserts against what is
  actually stored. Only the connection factory (`~/server/db`) is
  substituted with a TCP client (`tests/integration/db-client.ts`), because
  the app's pooled Neon driver cannot speak to plain PostgreSQL; every query
  function and all SQL run unmocked.
- To reuse a disposable database instead of starting a container:
  `TEST_POSTGRES_URL="postgresql://.../avecusho_test" pnpm test:integration`
  (tables are truncated between tests — never point it at a real database).

## Project Structure

```
src/
├── actions/         # Server actions
├── app/            # App router pages
├── components/     # React components
├── lib/           # Utility functions
├── server/        # Server-side code
│   ├── db/       # Database configuration
│   └── queries/  # Database queries
├── styles/        # Global styles
└── types/         # TypeScript types
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Stripe](https://stripe.com/)
- [UploadThing](https://uploadthing.com/)
- [PostHog](https://posthog.com/)