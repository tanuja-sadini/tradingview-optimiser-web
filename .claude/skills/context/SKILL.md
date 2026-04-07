---
name: context
description: Shared project context — current state, tech stack, and key decisions for use by other skills
---

# Project Context — TradingView Strategy Optimizer Website

## Tech Stack
- **Framework:** Astro with `@astrojs/cloudflare` adapter
- **Deployment:** Cloudflare Pages (`tradingviewoptimizer` project)
- **Domain:** tradingviewoptimizer.com
- **Build output:** `dist/`

## Key Files
- `website-brief.md` — source of truth for all copy and feature descriptions
- `CLAUDE.md` — design system, tone rules, behavior rules
- `src/pages/index.astro` — homepage (only page currently)
- `src/layouts/Base.astro` — shared layout wrapper
- `src/styles/global.css` — CSS custom properties and global styles
- `src/components/WaitlistForm.astro` — waitlist signup form

## Waitlist
Signups POST to `https://api.tradingviewoptimizer.com/v1/waitlist` with `{ email }`.  
Returns `{ ok: true }` on success, `{ ok: false, error: "..." }` on failure.  
No local API route — the external backend handles storage.

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
- Numbers over adjectives: "1,848 combinations" not "thousands"
- Only use feature claims from `website-brief.md`

## Pages
- `index.astro` — homepage with hero, how it works, features, waitlist CTA

## After Functional Changes
Update this file and `README.md` to reflect the new state before committing.
