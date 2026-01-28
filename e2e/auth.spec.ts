import { test, expect } from '@playwright/test';
import { prisma } from '../src/app/database';
import { seedTestUser, authenticatedPage, TEST_USER } from '../tests/utils/auth';

test.describe('Authentication', () => {
  test.beforeEach(async () => {
    await prisma.session.deleteMany({ where: { userId: TEST_USER.id } });
    await prisma.account.deleteMany({ where: { userId: TEST_USER.id } });
    await prisma.user.deleteMany({ where: { id: TEST_USER.id } });
  });

  test('user can sign up with email', async ({ page }) => {
    await page.goto('/sign-up');

    await expect(page.locator('text=Create an account')).toBeVisible();

    const uniqueEmail = `test-${Date.now()}@example.com`;
    await page.locator('input[name="email"]').fill(uniqueEmail);
    await page.locator('input[name="password"]').fill('TestPassword123!');
    await page.locator('input[name="name"]').fill('Test User');

    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/\/(verify-email|dashboard|account)/, { timeout: 5000 });

    const user = await prisma.user.findUnique({
      where: { email: uniqueEmail }
    });
    expect(user).toBeTruthy();
    expect(user?.name).toBe('Test User');
  });

  test('user can sign in with credentials', async ({ page }) => {
    await seedTestUser(prisma);

    await page.goto('/sign-in');

    await expect(page.locator('text=Sign in to your account')).toBeVisible();

    await page.locator('input[name="email"]').fill(TEST_USER.email);
    await page.locator('input[name="password"]').fill(TEST_USER.password);

    await page.locator('button[type="submit"]').click();

    await page.waitForURL(/\/(dashboard|account)/, { timeout: 5000 });

    const isAuthenticated = await page.locator('[href="/account"]').isVisible().catch(() => false) ||
                           await page.locator('text=Account').isVisible().catch(() => false) ||
                           await page.locator(`text=${TEST_USER.email}`).isVisible().catch(() => false);
    
    expect(isAuthenticated).toBeTruthy();
  });

  test('authenticated user can access protected route', async ({ page }) => {
    const { session } = await seedTestUser(prisma);
    await authenticatedPage(page, session);

    await page.goto('/account');

    await expect(page).not.toHaveURL(/\/sign-in/);

    const hasAccountContent = await page.locator('text=Account').isVisible().catch(() => false) ||
                              await page.locator('text=Profile').isVisible().catch(() => false) ||
                              await page.locator(`text=${TEST_USER.email}`).isVisible().catch(() => false);
    
    expect(hasAccountContent).toBeTruthy();
  });

  test('unauthenticated user is redirected from protected route', async ({ page }) => {
    await page.goto('/account');

    await page.waitForURL(/\/sign-in/, { timeout: 5000 });

    await expect(page.locator('text=Sign in to your account')).toBeVisible();
  });

  test('authenticated user can sign out', async ({ page }) => {
    const { session } = await seedTestUser(prisma);
    await authenticatedPage(page, session);

    await page.goto('/account');

    const signOutButton = page.locator('button:has-text("Sign Out")').or(
                         page.locator('button:has-text("Logout")')).or(
                         page.locator('[aria-label="Sign out"]'));
    
    await signOutButton.click();

    await page.waitForURL(/\/(|sign-in)/, { timeout: 5000 });

    await page.goto('/account');
    await page.waitForURL(/\/sign-in/, { timeout: 5000 });
  });
});
