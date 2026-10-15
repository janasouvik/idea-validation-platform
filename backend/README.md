# ProblemPulse — Backend API & Database

REST API for the ProblemPulse Problem Discovery & Validation Platform.

## Technology Stack
- **Node.js** & **Express.js** (TypeScript)
- **Prisma ORM** & **PostgreSQL**
- **Zod** for schema and body validation
- **JWT & bcryptjs** for secure administrator sessions
- **Helmet, CORS & Rate Limiting** for abuse prevention

## Database Configuration
- Database: `problempulse_db`
- Default Port: `5432`
- User: `postgres`
- Password: Configured in `backend/.env` (e.g., `postgresql://postgres:<your_postgres_password>@localhost:5432/problempulse_db?schema=public`)

## Scripts
- `npm run dev` - Start dev server with watch mode (`http://localhost:5001`)
- `npm run build` - Compile TypeScript to `dist/`
- `npm run start` - Run production compiled code
- `npm run prisma:push` - Sync Prisma schema with PostgreSQL database
- `npm run seed` - Seed initial categories, admin account, and sample problems

## Admin Credentials
- **Email:** `admin@problempulse.org`
- **Password:** `AdminSecure2026!`