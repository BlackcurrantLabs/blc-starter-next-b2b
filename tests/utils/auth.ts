import { Page } from '@playwright/test';
import { PrismaClient } from '../../src/generated/prisma/client';
import { randomUUID } from 'crypto';

/**
 * Test user credentials for E2E authentication tests
 */
export const TEST_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  password: 'TestPassword123!',
} as const;

/**
 * User and session data returned by seedTestUser
 */
export interface TestUserData {
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * Seeds a test user with an active session in the database.
 * 
 * @param prisma - Prisma client instance
 * @returns User and session data
 * 
 * @example
 * ```ts
 * import { prisma } from '@/app/database';
 * const { user, session } = await seedTestUser(prisma);
 * ```
 */
export async function seedTestUser(prisma: PrismaClient): Promise<TestUserData> {
  const now = new Date();
  const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  // Create user
  const user = await prisma.user.create({
    data: {
      id: TEST_USER.id,
      email: TEST_USER.email,
      name: TEST_USER.name,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  // Create session
  const session = await prisma.session.create({
    data: {
      id: randomUUID(),
      userId: TEST_USER.id,
      token: randomUUID(),
      expiresAt: oneYearFromNow,
      createdAt: now,
      updatedAt: now,
    },
  });

  return { user, session };
}

/**
 * Generates BetterAuth session cookie string for injection.
 * 
 * @param session - Session object with token
 * @returns Cookie string formatted for BetterAuth
 * 
 * @example
 * ```ts
 * const cookies = getAuthCookies(session);
 * // Returns: "better-auth.session_token=abc-123; Path=/; HttpOnly"
 * ```
 */
export function getAuthCookies(session: { token: string }): string {
  return `better-auth.session_token=${session.token}; Path=/; HttpOnly`;
}

/**
 * Injects authentication cookies into a Playwright page context.
 * 
 * @param page - Playwright page instance
 * @param session - Session object with token
 * 
 * @example
 * ```ts
 * import { test } from '@playwright/test';
 * 
 * test('authenticated user can access dashboard', async ({ page }) => {
 *   const { session } = await seedTestUser(prisma);
 *   await authenticatedPage(page, session);
 *   await page.goto('/dashboard');
 *   // User is now authenticated
 * });
 * ```
 */
export async function authenticatedPage(
  page: Page,
  session: { token: string }
): Promise<void> {
  await page.context().addCookies([
    {
      name: 'better-auth.session_token',
      value: session.token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
}
