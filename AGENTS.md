# AGENTS.md - AI Agent Knowledge Base

> This file is the single source of truth for AI agents working on this codebase.
> It is designed to be continuously updated as the project evolves.

<!-- AUTO-GENERATED: Do not edit above this line -->

## Quick Reference

| Category | Key Pattern / Import |
| :--- | :--- |
| **Prisma Client** | `import { prisma } from "@/app/database";` |
| **Auth Client** | `import { authClient } from "@/lib/auth-client"` |
| **Auth Server** | `import { auth } from "./auth";` |
| **Org Context** | `import { AuthUIContext } from '@daveyplate/better-auth-ui'` |
| **Package Manager** | Always use `pnpm` (Never `npm`) |
| **Database Sync** | `npx prisma studio` (port 51212) |
| **Form Library** | `@tanstack/react-form` + Zod |
| **Test (Unit)** | `pnpm test` |
| **Test (E2E)** | `pnpm test:e2e` |
| **Test Utilities** | `tests/utils/` |

## Project Architecture

This project is a B2B SaaS starter designed for scalability and modern developer experience.

- **Actors**: Admin, User (Member of Organizations)
- **Stack**:
  - **Framework**: Next.js 15+ (App Router)
  - **Database/ORM**: Prisma with SQLite (Dev) / PostgreSQL (Prod)
  - **Auth**: BetterAuth + BetterAuthUI (Organization-aware)
  - **Styling**: Tailwind CSS + Shadcn UI + Radix UI
  - **State**: React Context API (No heavy 3rd party libs)
  - **Infrastructure**: Resend (Email), Trigger.dev (Background Jobs)
  - **UI Patterns**: Tanstack Tables, @tanstack/react-form + Zod

## Critical Rules

1.  **Database Access**: Always import the Prisma singleton from `@/app/database`. Never instantiate `PrismaClient` directly in other files to avoid connection leaks.
2.  **Authentication**: Use `authClient.useSession()` for client-side and `auth.api.getSession({ headers: await headers() })` for server-side auth.
3.  **UI Consistency**: Use Shadcn components. Favor composition and local styling over modifying base components in `components/ui`.
4.  **State Management**: Keep state local or in Context Providers. Do not introduce Redux, Zustand, or similar unless explicitly requested.
5.  **Next.js Conventions**: Use React Server Components (RSC) by default. Minimize `'use client'` usage. Use `kebab-case` for all directories and file names.

## Environment Variables

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Prisma database connection string |
| `BETTER_AUTH_SECRET` | Secret for auth encryption (openssl rand -base64 32) |
| `BETTER_AUTH_URL` | Base URL for authentication callbacks |
| `NEXT_PUBLIC_SITE_NAME` | The application's display name |
| `NEXT_PUBLIC_BASE_URL` | Publicly accessible URL of the application |
| `RESEND_KEY` | API key for Resend email service |
| `RESEND_FROM` | Default sender email address |
| `TRUSTED_ORIGINS` | Comma-separated list of allowed origins for CORS/CSRF |

## Common Tasks

### Handling Authentication
- **Client**: `const { data: session } = authClient.useSession()`
- **Server**: `const session = await auth.api.getSession({ headers: await headers() })`
- **Organizations**: Use `hooks.useActiveOrganization()` from `AuthUIContext`.

### Database Operations
- **Migrations**: `npx prisma migrate dev --name <description>`
- **Queries**: Use `prisma.modelName.findUnique/findMany` with explicit `select` for performance.
- **Transactions**: Use `prisma.$transaction([])` for atomic multi-step operations.

### UI Development
- **New Components**: `npx shadcn@latest add <component-name>`
- **Theming**: Edit `app/globals.css` using Tailwind variables.

## Detailed Guides

Deep dives into specific project domains:
- [Project Overview](./.agent/rules/project-overview.md)
- [Better Auth Guide](./.agent/rules/better-auth-guide.md)
- [Prisma Guide](./.agent/rules/prisma-guide.md)
- [Next.js Guide](./.agent/rules/next-js-guide.md)
- [Styling Guide](./.agent/rules/styling-guide.md)
- [State Management](./.agent/rules/state-management.md)
- [Testing Guide](./.agent/rules/testing-guide.md)

<!-- USER-EDITABLE: Add project-specific patterns below -->

## Known Issues & Workarounds
- **Prisma in Dev**: Connection pool exhaustion is prevented by the singleton pattern in `src/app/database.ts`.
- **Auth Origins**: `TRUSTED_ORIGINS` env var must be set correctly for production deployments to avoid CSRF errors.
- **Fonts**: Geist is the primary font family; Inter has been removed to reduce bundle size and match the design system.

## Best Practices Log
- **Testing**: Co-locate tests with components/logic. Use `tests/utils/` factories for seeding test data. Always cleanup DB in E2E tests.

## Changelog
- **2026-01-29**: Completed contact-us feature with Altcha captcha, email threading, and admin management UI. Established @tanstack/react-form + Zod as the standard form pattern.
- **2026-01-29**: Final verification of contact-us feature. Updated preferred form library to @tanstack/react-form.
- **2026-01-28**: Initial creation of AGENTS.md. Consolidated content from initial .agent/rules/ guides and Wave 1 learnings.
