import { test, expect, devices } from '@playwright/test';

test.describe('Page load', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/TradingView Strategy Optimizer/);
  });

  test('returns 200', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBe(200);
  });
});

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('logo is visible and links to homepage', async ({ page }) => {
    const logo = page.locator('#nav .nav-logo');
    await expect(logo).toBeVisible();
    // Accept both "/" and "#" (legacy) — exact href verified post-deployment
    const href = await logo.getAttribute('href');
    expect(['/', '#']).toContain(href);
  });

  test('nav has all section links', async ({ page }) => {
    const nav = page.locator('#nav');
    await expect(nav.getByRole('link', { name: 'The Problem' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'How It Works' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Features' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Analytics' })).toBeVisible();
  });

  test('nav CTA links to waitlist section', async ({ page }) => {
    const cta = page.locator('#nav .nav-cta');
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute('href');
    expect(href).toContain('waitlist');
  });
});

test.describe('Hero section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows the headline', async ({ page }) => {
    await expect(page.locator('.hero-h1')).toContainText("The parameter optimizer");
    await expect(page.locator('.hero-h1')).toContainText("TradingView doesn't have");
  });

  test('shows early access badge', async ({ page }) => {
    await expect(page.locator('.hero-badge')).toContainText('Early Access');
  });

  test('shows all three platforms', async ({ page }) => {
    const badge = page.locator('.hero-badge');
    await expect(badge).toContainText('macOS');
    await expect(badge).toContainText('Windows');
    await expect(badge).toContainText('Linux');
  });

  test('shows hero stats', async ({ page }) => {
    await expect(page.locator('.hero-stats')).toBeVisible();
    await expect(page.locator('.hero-stats')).toContainText('combinations per run');
    await expect(page.locator('.hero-stats')).toContainText('analytics views');
    await expect(page.locator('.hero-stats')).toContainText('cloud dependencies');
  });

  test('shows primary CTA', async ({ page }) => {
    const cta = page.locator('.hero-actions .btn-primary');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText('Join the Waitlist');
  });
});

test.describe('Dashboard preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the mock results table', async ({ page }) => {
    const preview = page.locator('.dashboard-preview');
    await expect(preview).toBeVisible();
  });

  test('shows gold, silver, bronze rows', async ({ page }) => {
    await expect(page.locator('.results-table tr.gold')).toBeVisible();
    await expect(page.locator('.results-table tr.silver')).toBeVisible();
    await expect(page.locator('.results-table tr.bronze')).toBeVisible();
  });

  test('shows run summary info', async ({ page }) => {
    await expect(page.locator('.run-info')).toBeVisible();
    await expect(page.locator('.run-badge.green')).toContainText('Complete');
  });

  test('window chrome has correct title', async ({ page }) => {
    await expect(page.locator('.window-title')).toContainText('TradingView Strategy Optimizer');
  });
});

test.describe('The Problem section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('section is present', async ({ page }) => {
    await expect(page.locator('#problem')).toBeVisible();
  });

  test('shows before and after cards', async ({ page }) => {
    await expect(page.locator('.problem-card.before')).toBeVisible();
    await expect(page.locator('.problem-card.after')).toBeVisible();
  });

  test('before card shows manual process pain', async ({ page }) => {
    const before = page.locator('.problem-card.before');
    await expect(before).toContainText('Without TVO');
  });

  test('after card shows automated result', async ({ page }) => {
    const after = page.locator('.problem-card.after');
    await expect(after).toContainText('With TVO');
  });
});

test.describe('How It Works section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('section is present', async ({ page }) => {
    await expect(page.locator('#how-it-works')).toBeVisible();
  });

  test('shows all 6 steps', async ({ page }) => {
    const steps = page.locator('.step-card');
    await expect(steps).toHaveCount(6);
  });

  test('steps are numbered correctly', async ({ page }) => {
    const numbers = page.locator('.step-number');
    await expect(numbers.nth(0)).toContainText('01');
    await expect(numbers.nth(5)).toContainText('06');
  });

  test('step titles are correct', async ({ page }) => {
    await expect(page.locator('.step-title').nth(0)).toContainText('Create a project');
    await expect(page.locator('.step-title').nth(5)).toContainText('Deploy to chart');
  });
});

test.describe('Features section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('section is present', async ({ page }) => {
    await expect(page.locator('#features')).toBeVisible();
  });

  test('shows 4 feature cards', async ({ page }) => {
    await expect(page.locator('.feature-card')).toHaveCount(4);
  });

  test('feature cards have correct titles', async ({ page }) => {
    await expect(page.locator('.feature-title').nth(0)).toContainText('Automated Parameter Sweeps');
    await expect(page.locator('.feature-title').nth(1)).toContainText('One-Click Parameter Extraction');
    await expect(page.locator('.feature-title').nth(2)).toContainText('Instrument');
    await expect(page.locator('.feature-title').nth(3)).toContainText('Resume');
  });
});

test.describe('Analytics section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('section is present', async ({ page }) => {
    await expect(page.locator('#analytics')).toBeVisible();
  });

  test('shows 4 analytics cards', async ({ page }) => {
    await expect(page.locator('.analytics-card')).toHaveCount(4);
  });

  test('analytics card titles are correct', async ({ page }) => {
    await expect(page.locator('.analytics-card-title').nth(0)).toContainText('Parameter Impact Charts');
    await expect(page.locator('.analytics-card-title').nth(1)).toContainText('Heatmap');
    await expect(page.locator('.analytics-card-title').nth(2)).toContainText('Scatter Plot');
    await expect(page.locator('.analytics-card-title').nth(3)).toContainText('Run Comparison');
  });
});

test.describe('Waitlist form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Intercept the API so tests don't write to production KV
    await page.route('/api/waitlist', async route => {
      const body = route.request().postDataJSON();
      const email: string = body?.email ?? '';
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      await route.fulfill({
        status: valid ? 200 : 400,
        contentType: 'application/json',
        body: JSON.stringify(valid ? { ok: true } : { ok: false, error: 'Invalid email address.' }),
      });
    });
  });

  test('form is visible', async ({ page }) => {
    await expect(page.locator('#waitlistForm')).toBeVisible();
  });

  test('email input is present', async ({ page }) => {
    await expect(page.locator('#emailInput')).toBeVisible();
  });

  test('submit button is present', async ({ page }) => {
    await expect(page.locator('#submitBtn')).toBeVisible();
    await expect(page.locator('#submitBtn')).toContainText('Join Waitlist');
  });

  test('shows success message after valid submission', async ({ page }) => {
    await page.locator('#emailInput').fill('test@example.com');
    await page.locator('#submitBtn').click();

    await expect(page.locator('#formSuccess')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#formSuccess')).toContainText("You're on the list");
    await expect(page.locator('#waitlistForm')).not.toBeVisible();
  });

  test('waitlist CTA section exists', async ({ page }) => {
    await expect(page.locator('#waitlist')).toBeVisible();
    await expect(page.locator('.waitlist-card-title')).toContainText('Ready to stop clicking');
  });
});

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('footer is visible', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });

  test('shows copyright', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('TradingView Strategy Optimizer');
  });

  test('shows local data note', async ({ page }) => {
    await expect(page.locator('footer')).toContainText('All data stored locally');
  });

  test('contact link is present', async ({ page }) => {
    const contact = page.locator('footer a[href^="mailto:"]');
    await expect(contact).toBeVisible();
    await expect(contact).toContainText('Contact');
  });
});

test.describe('API endpoint', () => {
  test('rejects missing email', async ({ request }) => {
    const res = await request.post('/api/waitlist', {
      data: {},
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  test('rejects malformed email', async ({ request }) => {
    const res = await request.post('/api/waitlist', {
      data: { email: 'not-an-email' },
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });
});

