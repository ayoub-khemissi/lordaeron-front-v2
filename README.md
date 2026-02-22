# Lordaeron

Web application for the **Lordaeron** World of Warcraft 3.3.5a private server — featuring an item shop with Stripe payments, multilingual content, admin dashboard, and real-time server integration via SOAP.

## Tech Stack

- **Framework** — Next.js 15 (App Router, Turbopack)
- **UI** — HeroUI v2 + Tailwind CSS 4 + Framer Motion
- **Language** — TypeScript 5
- **Database** — MySQL 8 (mysql2) — 3 connection pools (auth, characters, website)
- **Auth** — JWT (jose) + SRP6 password hashing + email-based password reset (nodemailer)
- **Payments** — Stripe Checkout
- **i18n** — next-intl (English, French, Spanish, German, Italian)
- **Charts** — Recharts

## Features

- **Shop** — Browse and purchase in-game items, sets, services (XP boosts, character changes, VIP). Items delivered via WoW SOAP.
- **Soul Shards** — Virtual currency purchased through Stripe, used to buy shop items. Gift system between players.
- **Daily Highlights** — Automated daily deals with random discounts per category.
- **Account** — Registration, login, password reset via email, password change, purchase history, character selection.
- **Admin Panel** — Item/set/news management, sales analytics, financial reports, ban system, audit log.
- **News** — Multilingual news articles with Markdown rendering.
- **Server Status** — Live player count and realm status.
- **SEO** — Sitemap, robots.txt, Open Graph metadata, JSON-LD structured data.
- **i18n** — Full 5-locale support with locale-prefixed routing.

## Project Structure

```
app/
  [locale]/          Pages (homepage, shop, account, admin, news, ...)
  api/               REST API (auth, shop, admin, stripe, cron, ...)
components/          React components (shop/, admin/, shared)
config/              Site config (navigation, links, realmlist)
i18n/                Locale routing and request config
lib/                 Core utilities
  queries/           Database query functions
  auth.ts            JWT session management
  email.ts           SMTP email sending (nodemailer)
  email-templates/   Email templates (password reset, ...)
  db.ts              MySQL connection pools
  soap.ts            WoW SOAP client
  srp6.ts            SRP6 password hashing
  stripe.ts          Stripe helpers
messages/            Translation files (en, fr, es, de, it)
public/              Static assets (images, fonts, favicon)
styles/              Global CSS (Tailwind + WoW theme)
types/               TypeScript interfaces
sql/                 Database schema and generators
doc/                 Documentation
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm
- MySQL 8
- A running TrinityCore 3.3.5a server

### Install

```bash
pnpm install
```

### Configure

Create a `.env.local` file at the project root:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Auth database (TrinityCore)
DB_AUTH_HOST=localhost
DB_AUTH_PORT=3306
DB_AUTH_USER=root
DB_AUTH_PASSWORD=
DB_AUTH_NAME=auth

# Characters database (TrinityCore)
DB_CHARACTERS_HOST=localhost
DB_CHARACTERS_PORT=3306
DB_CHARACTERS_USER=root
DB_CHARACTERS_PASSWORD=
DB_CHARACTERS_NAME=characters

# Website database
DB_WEBSITE_HOST=localhost
DB_WEBSITE_PORT=3306
DB_WEBSITE_USER=root
DB_WEBSITE_PASSWORD=
DB_WEBSITE_NAME=lordaeron_website

# WoW SOAP
SOAP_HOST=127.0.0.1
SOAP_PORT=7878
SOAP_USERNAME=
SOAP_PASSWORD=

# JWT
JWT_SECRET=

# Cron
CRON_SECRET=

# SMTP (emails)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=Lordaeron <no-reply@lordaeron.eu>

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Run

```bash
pnpm dev        # Development (Turbopack)
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Lint and auto-fix
```

## Documentation

- [Installation on Ubuntu 24.04](doc/INSTALL_UBUNTU.md)
- [Cron Jobs Setup](doc/COMMAND_SCHEDULER.md)
- [Pricing & Margins](doc/PRICING.md)

## License

[MIT](LICENSE)
