---
name: project-context
description: Shared project context — current state, tech stack, and key decisions for use by other skills
---

# Project Context — TradingView Strategy Optimizer Website

## Tech Stack
- **Framework:** Astro (`output: server`) with `@astrojs/cloudflare` adapter
- **Deployment:** Cloudflare Pages (`tradingviewoptimizer` project)
- **Domain:** tradingviewoptimizer.com
- **Build output:** `dist/`

## Key Files
- `website-brief.md` — source of truth for all copy and feature descriptions
- `CLAUDE.md` — design system, tone rules, behavior rules
- `src/pages/index.astro` — homepage
- `src/pages/pricing.astro` — pricing page (monthly $19.99 / annual $199.99)
- `src/pages/dashboard.astro` — protected user dashboard
- `src/pages/download.astro` — public download page (macOS, Windows, Linux)
- `src/layouts/Base.astro` — shared layout, reads session and passes user to Nav
- `src/styles/global.css` — CSS custom properties and global styles
- `src/pages/checkout/[plan].ts` — unauthenticated checkout gate; redirects to login then directly to Stripe
- `src/lib/auth.ts` — OIDC helpers (IDP-agnostic; endpoint URLs from env vars)
- `src/lib/session.ts` — HMAC-signed HttpOnly cookie session management

## Auth
- **Provider:** Asgardeo OIDC (tenant: `tvoprod`) — but IDP-agnostic via env vars
- **Flow:** Authorization Code (server-side, confidential client)
- **Session:** HMAC-SHA256 signed HttpOnly cookie `tvo_sess`, 8hr lifetime
- **Routes:** `/auth/login` → `/auth/callback` → `/auth/logout`
- Credentials and OIDC endpoint URLs stored in Cloudflare Pages env vars and `.dev.vars` locally
- OIDC endpoint env vars: `OIDC_AUTHORIZE_URL`, `OIDC_TOKEN_URL`, `OIDC_LOGOUT_URL`

## Backend API
- Base URL: `https://api.tradingviewoptimizer.com`
- Auth: Bearer JWT (Asgardeo access token)
- Key endpoints used by the website:
  - `GET /v1/me` — user profile, subscription, usage
  - `POST /v1/checkout` — create Stripe checkout session (`plan: monthly | annual`)
  - `POST /v1/portal` — create Stripe billing portal session (cancel/switch plan)
  - `POST /v1/waitlist` — join waitlist
- Server-side proxies at `/api/me`, `/api/checkout`, and `/api/portal` keep the access token out of the browser

## Pricing
- Monthly: $19.99/month
- Annual: $199.99/year ($16.67/month, saves ~$40/year)
- Checkout flow (logged-in): pricing page → `/api/checkout` → Stripe hosted page → `/dashboard?checkout=success`
- Checkout flow (unauthenticated): `/checkout/[plan]` → `/auth/login?next=/checkout/[plan]` → Stripe (existing paid subscribers redirected to `/dashboard`)
- On checkout success: polls `/api/me` every 2s for up to 15s until subscription is active
- All new users start on `plan_id: "free"`, `status: "active"` — treated as unpaid throughout the UI
- Paid plans: `plan_id: "monthly"` or `"annual"` with `status: "active"` or `"trialing"`
- Download is always free and available to all logged-in users — the app handles its own subscription gating
- Paid subscribers see "Manage subscription" in dashboard → Stripe billing portal (`/api/portal`)
- Pricing page blocks second subscription: if already on paid plan, subscribe buttons replaced with "Switch plan via dashboard →"

## Design System (summary)
- Dark backgrounds only — primary bg `#1E1F22`, panels `#2B2D31`, cards `#313338`
- Accent: `#5865F2` (blurple)
- Text: `#DBDEE1` primary, `#80848E` muted
- Status: green `#23A55A`, red `#F23F43`, yellow `#F0B232`
- Font: Noto Sans (body), Noto Sans Mono (metrics/code)
- Always use CSS custom properties — never raw hex values

## Copy Rules
- Audience: algorithmic traders using TradingView Pine Script
- Direct and technical — no "revolutionary", no "AI-powered"
- Do not invent specific counts
- Only use feature claims from `website-brief.md`

## Known Backlog
See `.claude/memory/project_known_issues.md` for tracked issues.

## After Functional Changes
Update this file and `README.md` to reflect the new state before committing.
