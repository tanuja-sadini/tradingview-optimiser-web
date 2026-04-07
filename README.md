# TradingView Strategy Optimizer — Website

Promotional website for the TradingView Strategy Optimizer desktop app.

**Production:** [tradingviewoptimizer.com](https://tradingviewoptimizer.com)  
**Platform:** Cloudflare Pages  
**Framework:** Astro with `@astrojs/cloudflare` adapter

---

## Development

```bash
npm install
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
wrangler pages deploy dist --project-name tradingviewoptimizer --branch main
```

Requires `wrangler` authenticated (`wrangler whoami`).

---

## Project Structure

```
src/
  pages/index.astro         # Homepage
  components/
    Nav.astro
    Footer.astro
    WaitlistForm.astro      # Posts to https://api.tradingviewoptimizer.com/v1/waitlist
    DashboardPreview.astro
  layouts/Base.astro
  styles/global.css
public/                     # Static assets
website-brief.md            # Source of truth for all copy and features
CLAUDE.md                   # Agent instructions and design system
```

## Waitlist

Signups are handled by the external backend at `https://api.tradingviewoptimizer.com/v1/waitlist` (POST `{ email }`). No local API route.

## Skills (slash commands)

| Command | Description |
|---------|-------------|
| `/deploy` | Build and deploy to Cloudflare Pages |
| `/component` | Scaffold a new UI component |
| `/page` | Scaffold a new page |
| `/waitlist` | Read waitlist signups |
