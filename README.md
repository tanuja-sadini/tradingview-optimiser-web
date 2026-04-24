# TradingView Optimizer — Website

Full marketing and subscription website for the TradingView Optimizer desktop app.

**Production:** [tradingviewoptimizer.com](https://tradingviewoptimizer.com)  
**Platform:** Cloudflare Pages  
**Framework:** Astro (`output: server`) with `@astrojs/cloudflare` adapter

---

## Development

```bash
npm install
```

Create `.dev.vars` in the project root (gitignored) with:

```
ASGARDEO_CLIENT_ID=<your value>
ASGARDEO_CLIENT_SECRET=<your value>
SESSION_SECRET=<openssl rand -hex 32>
OIDC_AUTHORIZE_URL=<IDP authorize endpoint>
OIDC_TOKEN_URL=<IDP token endpoint>
OIDC_LOGOUT_URL=<IDP logout endpoint>
```

```bash
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy

Use the `/deploy` skill, or manually:

```bash
npm run build
wrangler pages deploy dist --project-name tradingviewoptimizer --branch main
```

Requires `wrangler` authenticated (`wrangler whoami`).

### Preview deploys

Deploy any non-`main` branch to a preview URL (production stays untouched):

```bash
npm run build
wrangler pages deploy dist --project-name tradingviewoptimizer --branch <branch-name>
```

Preview URL: `https://<branch-name>.tradingviewoptimizer.pages.dev`.

One-time preview-env setup:
- Upload secrets: `wrangler pages secret bulk .dev.vars --project-name=tradingviewoptimizer --env=preview`
- Add the `WAITLIST` KV binding for Preview in the Cloudflare dashboard (Settings → Functions → KV namespace bindings)
- Add the preview callback URL to Allowed redirect URIs in the Asgardeo `tvoprod` app: `https://<branch-name>.tradingviewoptimizer.pages.dev/auth/callback`

### Cloudflare Pages environment variables

Set these in the Cloudflare Pages dashboard (Settings → Environment Variables):

| Variable | Description |
|----------|-------------|
| `ASGARDEO_CLIENT_ID` | OIDC client ID |
| `ASGARDEO_CLIENT_SECRET` | OIDC client secret |
| `SESSION_SECRET` | Random 32-byte hex string for signing session cookies |
| `OIDC_AUTHORIZE_URL` | OIDC authorization endpoint |
| `OIDC_TOKEN_URL` | OIDC token endpoint |
| `OIDC_LOGOUT_URL` | OIDC logout endpoint |

---

## Project Structure

```
src/
  pages/
    index.astro               # Homepage
    pricing.astro             # Pricing page (monthly / annual)
    dashboard.astro           # User dashboard (protected)
    download.astro            # Public download page (macOS, Windows, Linux)
    terms.astro               # Terms of Service
    privacy.astro             # Privacy Policy
    refunds.astro             # Refund Policy (strict no-refund)
    disclaimer.astro          # Trading / financial disclaimer
    app/
      callback.astro          # OAuth redirect URI for the desktop app — forwards ?code&state to tradingview-optimizer://oauth/callback
    auth/
      login.ts                # Redirects to OIDC provider
      callback.ts             # Exchanges code, sets session cookie
      logout.ts               # Clears session, redirects to OIDC logout
    checkout/
      [plan].ts               # GET — auth gate + direct Stripe checkout redirect
    api/
      checkout.ts             # POST — proxies to backend /v1/checkout
      me.ts                   # GET  — proxies to backend /v1/me
      portal.ts               # POST — proxies to backend /v1/portal (Stripe billing portal)
  components/
    Nav.astro                 # Auth-aware nav with account dropdown
    Footer.astro
    WaitlistForm.astro        # Posts to https://api.tradingviewoptimizer.com/v1/waitlist
    DashboardPreview.astro
  layouts/
    Base.astro                # Reads session, passes user to Nav
    Legal.astro               # Shared layout for legal docs (terms / privacy / refunds / disclaimer)
  lib/
    auth.ts                   # Asgardeo OIDC helpers
    session.ts                # HMAC-signed HttpOnly cookie session
    subscription.ts           # interpretSubscription() — derives trial/paid/expired/billing-issue state
  styles/global.css
public/                       # Static assets
docs/
  consent-ledger.md           # Spec for cross-repo consent-recording feature (backend + desktop app)
website-brief.md              # Source of truth for all copy and features
CLAUDE.md                     # Agent instructions and design system
```

## Auth Flow

1. `/auth/login` — generates state, redirects to OIDC provider authorize endpoint
2. OIDC provider redirects to `/auth/callback?code=...&state=...`
3. `/auth/callback` — exchanges code for tokens, sets signed HttpOnly session cookie, redirects to `next` (stored in temp cookie)
4. `/auth/logout` — clears cookie, redirects to OIDC RP-initiated logout (post-logout lands back at `/auth/callback` → redirects to `/`)

Session is an HMAC-SHA256 signed cookie (`tvo_sess`) containing the access token, user ID, email, and expiry. 8-hour lifetime.

OIDC endpoint URLs are configured via `OIDC_AUTHORIZE_URL`, `OIDC_TOKEN_URL`, and `OIDC_LOGOUT_URL` env vars — no code changes needed to switch providers.

## Checkout Flow (unauthenticated)

Unauthenticated users clicking a subscribe button go to `/checkout/[plan]`, which:
1. Redirects to `/auth/login?next=/checkout/[plan]` if no session
2. After auth, `/checkout/[plan]` checks `/v1/me` — redirects existing **paid** (monthly/annual + active) subscribers to `/dashboard`. Trial users (`plan_id=trial`, any status) are passed through to checkout.
3. Otherwise calls `/v1/checkout` and redirects to Stripe hosted checkout

## Subscription model

Backend `/v1/me` returns `subscription: { plan_id, status, current_period_end }`. New users start on a 7-day free trial with `plan_id='trial'` and `status='active'`; once the trial ends, status flips to `expired`. The website does not gate any features (the desktop app does), but renders different UI per state. All subscription logic is centralized in `src/lib/subscription.ts`:

| State | Condition | UI behavior |
|-------|-----------|-------------|
| `trial-active` | `plan='trial'`, `status='active'` | Yellow "trial — N days left" badge in nav; trial card on dashboard with upgrade CTA; banner on pricing page |
| `trial-expired` | `plan='trial'`, `status!='active'` | Red "trial expired" badge; expired card on dashboard; warning banner on pricing |
| `paid-active` | `plan='monthly'\|'annual'`, `status='active'` | Green plan badge; active subscription card with renewal date and "manage" button |
| `billing-issue` | `plan='monthly'\|'annual'`, `status='past_due'\|'paused'\|'canceled'\|'incomplete'` | Red badge; "manage billing" CTA pointing to Stripe portal |
| `none` | No subscription | "View plans" CTA |

Trial users with `status='active'` retain `hasAccess=true` and can subscribe at any time to upgrade.

## Backend API

All authenticated calls proxy through server-side API routes (access token never exposed to the browser):

| Route | Backend endpoint |
|-------|-----------------|
| `GET /api/me` | `GET /v1/me` |
| `POST /api/checkout` | `POST /v1/checkout` |
| `POST /api/portal` | `POST /v1/portal` (Stripe billing portal session) |

Backend base: `https://api.tradingviewoptimizer.com`

## Skills (slash commands)

| Command | Description |
|---------|-------------|
| `/deploy` | Build and deploy to Cloudflare Pages |
| `/component` | Scaffold a new UI component |
| `/page` | Scaffold a new page |
| `/waitlist` | Read waitlist signups |
