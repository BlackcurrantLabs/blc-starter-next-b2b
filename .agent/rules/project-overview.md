---
trigger: always_on
---

# General instructions

Always import prisma from global initialiser
`import { prisma } from "@/app/database";`

Always use pnpm and never npm.

You can verify database changes using prisma studio
start with npx prisma studio and navigate to http://localhost:51212/

# Project Overview

This is a project that is a saas starter

## Actors

- Admin
- User

## Stack

| Category                  | Technology/Tool                      |
| ------------------------- | ------------------------------------ |
| Framework                 | NextJS                               |
| ORM                       | Prisma, Typescript backend           |
| Authentication            | BetterAuth + BetterAuthUI            |
| Styling                   | Tailwind                             |
| Components                | Shadcn                               |
| Frontend State Management | Context API                          |
| Emails                    | Resend                               |
| Long running Jobs         | Trigger.dev                          |
| Deployment                | Vercel / Railway / AWS (self-hosted) |
| Tables                    | Tanstack Tables                      |
| Forms                     | react-hook-form                      |
