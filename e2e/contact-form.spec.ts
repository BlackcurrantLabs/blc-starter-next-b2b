import { test, expect } from '@playwright/test';
import { prisma } from '../src/app/database';

test.describe('Contact Form', () => {
  test.beforeEach(async () => {
    await prisma.contactQuery.deleteMany();
  });

  test('user can submit contact form successfully', async ({ page }) => {
    await page.goto('/contact-us');

    await expect(page.locator('h3:has-text("Contact Us")')).toBeVisible();

    await page.locator('[data-testid="email-input"]').fill('user@example.com');
    await page.locator('[data-testid="subject-input"]').fill('Test Subject');
    await page.locator('[data-testid="message-input"]').fill('This is a test message from E2E tests.');

    await page.evaluate(() => {
      const widget = document.querySelector('altcha-widget') as any;
      if (widget) {
        widget.dispatchEvent(new CustomEvent('statechange', {
          detail: {
            state: 'verified',
            payload: 'mock-altcha-payload-for-e2e-testing'
          }
        }));
      }
    });

    await page.waitForTimeout(500);

    await page.locator('[data-testid="submit-button"]').click();

    await expect(page.locator('text=Thank you! Your message has been sent.')).toBeVisible({ timeout: 5000 });

    await expect(page.locator('[data-testid="email-input"]')).toHaveValue('');
    await expect(page.locator('[data-testid="subject-input"]')).toHaveValue('');
    await expect(page.locator('[data-testid="message-input"]')).toHaveValue('');

    const query = await prisma.contactQuery.findFirst({
      where: { email: 'user@example.com' }
    });
    expect(query).toBeTruthy();
    expect(query?.subject).toBe('Test Subject');
    expect(query?.message).toBe('This is a test message from E2E tests.');
    expect(query?.status).toBe('unread');
  });

  test('shows validation errors for invalid input', async ({ page }) => {
    await page.goto('/contact-us');

    await page.locator('[data-testid="submit-button"]').click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Subject is required')).toBeVisible();
    await expect(page.locator('text=Message is required')).toBeVisible();

    await page.locator('[data-testid="email-input"]').fill('invalid@email');
    await page.locator('[data-testid="email-input"]').blur();
    await page.waitForTimeout(300);
    
    await expect(page.locator('text=Invalid email: TLD required')).toBeVisible();

    await page.locator('[data-testid="email-input"]').fill('valid@example.com');
    await page.locator('[data-testid="message-input"]').fill('a'.repeat(5001));
    await page.locator('[data-testid="message-input"]').blur();
    await page.waitForTimeout(300);
    
    await expect(page.locator('text=Message too long')).toBeVisible();
    await expect(page.locator('text=5001/5000')).toBeVisible();
  });

  test('shows captcha validation error when not verified', async ({ page }) => {
    await page.goto('/contact-us');

    await page.locator('[data-testid="email-input"]').fill('user@example.com');
    await page.locator('[data-testid="subject-input"]').fill('Test Subject');
    await page.locator('[data-testid="message-input"]').fill('Test message');

    await page.locator('[data-testid="submit-button"]').click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=Please verify you are human')).toBeVisible();

    const count = await prisma.contactQuery.count();
    expect(count).toBe(0);
  });
});
