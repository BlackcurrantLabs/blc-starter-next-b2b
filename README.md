# BLC Stack B2B

Multi-tenant B2B SaaS starter template built with Next.js 15+, Prisma, BetterAuth, and Tailwind 4.

## Features

- **Multi-tenant Architecture**: Robust organization support with membership management and role-based access control.
- **Comprehensive Authentication**: Secure auth via BetterAuth, including email/password, magic links, and admin roles.
- **Pre-built Layouts**: Context-aware layouts for Landing pages, User Accounts, Organizations, and Admin dashboards.
- **Modern UI Stack**: Built with Tailwind CSS 4, Shadcn UI components, and Radix UI primitives.
- **Developer Experience**: Optimized for speed with Prisma (SQLite for dev), pnpm, and structured AI agent guidance.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (Recommended package manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd blc-stack-b2b
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in the required values in `.env` (see [Environment Variables](#environment-variables) section).

4. **Initialize the database:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the development server:**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customization Guide

When forking this template, follow these steps to make it your own:

1. **Branding**:
   - Update `NEXT_PUBLIC_SITE_NAME` in `.env`.
   - Replace logos in `public/` and update site metadata in `app/layout.tsx`.
   - Customize theme colors in `app/globals.css`.

2. **Authentication**:
   - Configure additional OAuth providers in `lib/auth.ts`.
   - Update `BETTER_AUTH_URL` and `TRUSTED_ORIGINS` for your environment.

3. **Database Schema**:
   - Modify `prisma/schema.prisma` to add your business-specific models.
   - Run `npx prisma migrate dev` to apply changes.

4. **Navigation & Layouts**:
   - Customize sidebar and navbar items in the respective layout components.
   - Extend the organization or admin dashboards as needed.

## Environment Variables

The application requires several environment variables to function correctly. Refer to `.env.example` for the full list.

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Prisma database connection string. |
| `BETTER_AUTH_SECRET` | Secret for auth encryption. |
| `BETTER_AUTH_URL` | Base URL for authentication callbacks. |
| `NEXT_PUBLIC_SITE_NAME` | The application's display name. |
| `RESEND_KEY` | API key for Resend email service. |

## Tech Stack

| Technology | Version | Description |
| :--- | :--- | :--- |
| **Next.js** | 16+ | React Framework (App Router) |
| **React** | 19+ | UI Library |
| **Prisma** | 7+ | ORM for Database Management |
| **BetterAuth** | 1+ | Authentication & Session Management |
| **Tailwind CSS** | 4 | Utility-first CSS Framework |
| **Shadcn UI** | Latest | Reusable Component Library |
| **TanStack Table** | 8+ | Headless UI for building powerful tables |

## Documentation

- **AI Agent Guidance**: See `AGENTS.md` for coding patterns, rules, and architecture details.
- **Detailed Guides**: Explore `.agent/rules/` for deep dives into specific project domains (Prisma, Auth, Styling, etc.).

## Deployment

### Vercel
The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new).
Ensure you set all environment variables in the Vercel project settings.

### Railway / Other
This project is compatible with any platform supporting Node.js. Use `pnpm build` and `pnpm start`. Remember to configure a production database (e.g., PostgreSQL).

## License

MIT
