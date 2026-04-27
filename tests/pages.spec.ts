import { test, expect } from '@playwright/test';

// ── /pricing ──────────────────────────────────────────────────────────────────

test.describe('Pricing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('returns 200', async ({ request }) => {
    const res = await request.get('/pricing');
    expect(res.status()).toBe(200);
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Pricing/);
  });

  test('shows page heading', async ({ page }) => {
    await expect(page.locator('.pricing-title')).toContainText('Simple, transparent pricing');
  });

  test('shows Monthly plan card', async ({ page }) => {
    await expect(page.locator('.plan-card').first()).toContainText('Monthly');
  });

  test('shows Annual plan card', async ({ page }) => {
    await expect(page.locator('.plan-card.plan-featured')).toContainText('Annual');
  });

  test('shows two plan cards', async ({ page }) => {
    await expect(page.locator('.plan-card')).toHaveCount(2);
  });

  test('annual card shows Best Value badge', async ({ page }) => {
    await expect(page.locator('.plan-badge')).toContainText('Best Value');
  });

  test('shows FAQ section', async ({ page }) => {
    await expect(page.locator('#faq')).toBeVisible();
  });
});

// ── /download ─────────────────────────────────────────────────────────────────

test.describe('Download page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/download');
  });

  test('returns 200', async ({ request }) => {
    const res = await request.get('/download');
    expect(res.status()).toBe(200);
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Download/);
  });

  test('shows page heading', async ({ page }) => {
    await expect(page.locator('.download-title')).toContainText('Download TradingView Optimizer');
  });

  test('shows all three platform cards', async ({ page }) => {
    await expect(page.locator('.platform-card')).toHaveCount(3);
  });

  test('shows macOS platform', async ({ page }) => {
    await expect(page.locator('.platform-card').nth(0)).toContainText('macOS');
  });

  test('shows Windows platform', async ({ page }) => {
    await expect(page.locator('.platform-card').nth(1)).toContainText('Windows');
  });

  test('shows Linux platform', async ({ page }) => {
    await expect(page.locator('.platform-card').nth(2)).toContainText('Linux');
  });
});

// ── /app/callback ─────────────────────────────────────────────────────────────

test.describe('App OAuth callback page', () => {
  // The page immediately redirects to tradingview-optimizer:// which hangs in a
  // headless browser. We test static content via HTTP and the timer via a page
  // that has the redirect stubbed out.

  test('returns 200', async ({ request }) => {
    const res = await request.get('/app/callback');
    expect(res.status()).toBe(200);
  });

  test('contains Authentication Complete heading in HTML', async ({ request }) => {
    const res = await request.get('/app/callback');
    const html = await res.text();
    expect(html).toContain('Authentication Complete');
  });

  test('contains logo in HTML', async ({ request }) => {
    const res = await request.get('/app/callback');
    const html = await res.text();
    expect(html).toContain('/logo.png');
  });

  test('contains timer element in HTML', async ({ request }) => {
    const res = await request.get('/app/callback');
    const html = await res.text();
    expect(html).toContain('timer-ring');
    expect(html).toContain('timerNumber');
  });

  test('contains website link in HTML', async ({ request }) => {
    const res = await request.get('/app/callback');
    const html = await res.text();
    expect(html).toContain('href="/"');
    expect(html).toContain('website-link');
  });

  test('timer element starts at 5 or less in HTML', async ({ request }) => {
    const res = await request.get('/app/callback');
    const html = await res.text();
    // The initial value "5" is hardcoded in the HTML; JS counts it down
    expect(html).toContain('>5<');
  });
});

// ── Legal pages ───────────────────────────────────────────────────────────────

const legalPages = [
  { path: '/terms',      title: 'Terms of Service',  heading: 'Terms of Service' },
  { path: '/privacy',    title: 'Privacy Policy',     heading: 'Privacy Policy'   },
  { path: '/refunds',    title: 'Refund Policy',      heading: 'Refund Policy'    },
  { path: '/disclaimer', title: 'Trading Disclaimer', heading: 'Trading Disclaimer' },
];

for (const { path, title, heading } of legalPages) {
  test.describe(`${title} page (${path})`, () => {
    test('returns 200', async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
    });

    test('has correct title', async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(new RegExp(title));
    });

    test('shows correct heading', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('.legal-title')).toContainText(heading);
    });

    test('nav is present', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('#nav')).toBeVisible();
    });

    test('footer is present', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('footer').first()).toBeVisible();
    });
  });
}
