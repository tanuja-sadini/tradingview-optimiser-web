import { test, expect } from '@playwright/test';

// Simulate a mobile viewport using Chromium (no webkit dependency)
test.use({ viewport: { width: 390, height: 844 }, isMobile: true });

test('page loads on mobile', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-h1')).toBeVisible();
});

test('hamburger menu button is visible on mobile', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#navHamburger')).toBeVisible();
});

test('nav links are hidden on mobile', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.nav-links')).toBeHidden();
});

test('feature cards are all present on mobile', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.feature-card')).toHaveCount(4);
});

test('CTA section is visible on mobile', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.cta-card-title')).toBeVisible();
});
