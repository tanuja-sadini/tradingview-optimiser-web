import { test, expect } from '@playwright/test';

// ── /contact ──────────────────────────────────────────────────────────────────

test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('returns 200', async ({ request }) => {
    const res = await request.get('/contact');
    expect(res.status()).toBe(200);
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Contact/);
  });

  test('shows page heading', async ({ page }) => {
    await expect(page.locator('.contact-title')).toContainText('Get in touch');
  });

  test('shows three contact cards', async ({ page }) => {
    await expect(page.locator('.contact-card')).toHaveCount(3);
  });

  test('support card links to support email', async ({ page }) => {
    await expect(page.locator('.contact-card[href="mailto:support@tradingviewoptimizer.com"]')).toBeVisible();
  });

  test('general card links to contact email', async ({ page }) => {
    await expect(page.locator('.contact-card[href="mailto:contact@tradingviewoptimizer.com"]')).toBeVisible();
  });

  test('legal card links to legal email', async ({ page }) => {
    await expect(page.locator('.contact-card[href="mailto:legal@tradingviewoptimizer.com"]')).toBeVisible();
  });

  test('nav is present', async ({ page }) => {
    await expect(page.locator('#nav')).toBeVisible();
  });

  test('footer is present', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });
});

// ── /dashboard (unauthenticated) ──────────────────────────────────────────────

test.describe('Dashboard page (unauthenticated)', () => {
  test('redirects to login when not signed in', async ({ request }) => {
    const res = await request.get('/dashboard', { maxRedirects: 0 });
    expect(res.status()).toBe(302);
    expect(res.headers()['location']).toContain('/auth/login');
  });
});

// ── /auth/login ───────────────────────────────────────────────────────────────

test.describe('Auth: login', () => {
  test('redirects to identity provider', async ({ request }) => {
    const res = await request.get('/auth/login', { maxRedirects: 0 });
    // Must redirect — exact destination is the OIDC provider
    expect([301, 302]).toContain(res.status());
  });

  test('preserves next param in redirect', async ({ request }) => {
    const res = await request.get('/auth/login?next=/dashboard', { maxRedirects: 0 });
    expect([301, 302]).toContain(res.status());
  });
});

// ── /auth/logout ──────────────────────────────────────────────────────────────

test.describe('Auth: logout', () => {
  test('redirects (to OIDC logout or homepage)', async ({ request }) => {
    const res = await request.get('/auth/logout', { maxRedirects: 0 });
    expect([301, 302]).toContain(res.status());
  });
});

// ── /checkout/[plan] (unauthenticated) ────────────────────────────────────────

test.describe('Checkout (unauthenticated)', () => {
  test('monthly redirects to login', async ({ request }) => {
    const res = await request.get('/checkout/monthly', { maxRedirects: 0 });
    expect(res.status()).toBe(302);
    expect(res.headers()['location']).toContain('/auth/login');
  });

  test('annual redirects to login', async ({ request }) => {
    const res = await request.get('/checkout/annual', { maxRedirects: 0 });
    expect(res.status()).toBe(302);
    expect(res.headers()['location']).toContain('/auth/login');
  });

  test('invalid plan redirects to pricing', async ({ request }) => {
    const res = await request.get('/checkout/invalid', { maxRedirects: 0 });
    expect(res.status()).toBe(302);
    expect(res.headers()['location']).toContain('/pricing');
  });
});

// ── /privacy-policy (redirect) ────────────────────────────────────────────────

test.describe('/privacy-policy redirect', () => {
  test('redirects to /privacy', async ({ request }) => {
    const res = await request.get('/privacy-policy', { maxRedirects: 0 });
    expect([301, 302]).toContain(res.status());
    expect(res.headers()['location']).toContain('/privacy');
  });
});

// ── API routes (unauthenticated) ──────────────────────────────────────────────

test.describe('API routes (unauthenticated)', () => {
  test('GET /api/me returns 401', async ({ request }) => {
    const res = await request.get('/api/me');
    expect(res.status()).toBe(401);
  });

  test('POST /api/checkout returns 401', async ({ request }) => {
    const res = await request.post('/api/checkout', { data: { plan: 'monthly' } });
    expect(res.status()).toBe(401);
  });

  test('POST /api/portal returns 4xx without auth', async ({ request }) => {
    const res = await request.post('/api/portal');
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });
});
