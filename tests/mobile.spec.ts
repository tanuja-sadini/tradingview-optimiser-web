import { test, expect } from '@playwright/test';

// Simulate a mobile viewport using Chromium (no webkit dependency)
test.use({ viewport: { width: 390, height: 844 }, isMobile: true });

test('page loads on mobile', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-h1')).toBeVisible();
});

test('nav CTA is visible on mobile', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#nav .nav-cta')).toBeVisible();
});

test('nav links are hidden on mobile', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.nav-links')).toBeHidden();
});

test('feature cards are all present on mobile', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.feature-card')).toHaveCount(4);
});

test('waitlist form is usable on mobile', async ({ page }) => {
  await page.goto('/');
  await page.route('/api/waitlist', route =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  );
  await page.locator('#emailInput').fill('mobile@example.com');
  await page.locator('#submitBtn').scrollIntoViewIfNeeded();
  await page.locator('#submitBtn').click({ force: true });
  await expect(page.locator('#formSuccess')).toBeVisible({ timeout: 5000 });
});
