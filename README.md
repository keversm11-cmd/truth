# Truth

Truth is a lightweight payment tracking MVP for managing customers, invoices, and outstanding balances.

## Features
- Customer management
- Invoice creation with due dates and statuses
- Payment dashboard with totals and overdue tracking
- Basic authentication with email and password
- SQLite database via Prisma

## Stack
- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- SQLite

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your local environment file:
   ```bash
   cp .env.example .env
   ```
3. Generate the Prisma client and sync the database:
   ```bash
   npx prisma db push
   ```
4. Seed the app with a starter user if needed:
   ```bash
   npm run db:seed
   ```
5. Start the app:
   ```bash
   npm run dev
   ```

Open http://localhost:3000

## Default login
You can create a new account from the login page, or use the seeded user:
- Email: admin@truth.app
- Password: password123

## Scripts
- `npm run dev` — run development server
- `npm run build` — generate Prisma client and build app
- `npm run db:push` — sync Prisma schema to SQLite
- `npm run db:seed` — seed initial user data
