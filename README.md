# TradingView Strategy Optimizer — Website

Full marketing and subscription website for the TradingView Strategy Optimizer desktop app.

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

### Cloudflare Pages environment variables

Set these in the Cloudflare Pages dashboard (Settings → Environment Variables):

| Variable | Description |
|----------|-------------|
| `ASGARDEO_CLIENT_ID` | Asgardeo web app client ID |
| `ASGARDEO_CLIENT_SECRET` | Asgardeo web app client secret |
| `SESSION_SECRET` | Random 32-byte hex string for signing session cookies |

---

## Project Structure

```
src/
  pages/
    index.astro               # Homepage
    pricing.astro             # Pricing page (monthly / annual)
    dashboard.astro           # User dashboard (protected)
    auth/
      login.ts                # Redirects to Asgardeo OIDC
      callback.ts             # Exchanges code, sets session cookie
      logout.ts               # Clears session, redirects to Asgardeo logout
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
  lib/
    auth.ts                   # Asgardeo OIDC helpers
    session.ts                # HMAC-signed HttpOnly cookie session
  styles/global.css
public/                       # Static assets
website-brief.md              # Source of truth for all copy and features
CLAUDE.md                     # Agent instructions and design system
```

## Auth Flow

1. `/auth/login` — generates state, redirects to Asgardeo authorize endpoint
2. Asgardeo redirects to `/auth/callback?code=...&state=...`
3. `/auth/callback` — exchanges code for tokens, sets signed HttpOnly session cookie, redirects to dashboard
4. `/auth/logout` — clears cookie, redirects to Asgardeo RP-initiated logout (post-logout lands back at `/auth/callback` → redirects to `/`)

Session is an HMAC-SHA256 signed cookie (`tvo_sess`) containing the Asgardeo access token, user ID, email, and expiry. 8-hour lifetime.

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
