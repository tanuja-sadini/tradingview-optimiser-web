---
name: deploy
description: Build and deploy the website to Cloudflare Pages production
---

Deploy the TradingView Optimizer website to Cloudflare Pages.

## Project details
- Framework: Astro with `@astrojs/cloudflare` adapter
- Build output: `dist/` (set in `wrangler.toml` as `pages_build_output_dir`)
- Project name: `tradingviewoptimizer`
- Production domain: tradingviewoptimizer.com
- `wrangler.toml` pins `compatibility_date = "2024-09-23"` (required for Astro SSR's `new ReadableStream()`)

## Steps (production)
1. Check wrangler is authenticated: `wrangler whoami`. If not authenticated, ask the user to run `! wrangler login` in the prompt.
2. Run the build: `npm run build`
3. Fix any build errors before proceeding.
4. Deploy: `wrangler pages deploy dist --project-name tradingviewoptimizer --branch main`
5. Report the deployment URL to the user.
6. Note: custom domain (tradingviewoptimizer.com) may take up to 60 seconds to reflect changes.

## Preview deploys (non-main branches)
Any branch other than `main` deploys to `https://<branch>.tradingviewoptimizer.pages.dev` without touching production:
```
wrangler pages deploy dist --project-name tradingviewoptimizer --branch <branch-name>
```
First time on a new preview environment, also:
- `wrangler pages secret bulk .dev.vars --project-name=tradingviewoptimizer --env=preview`
- Add `WAITLIST` KV binding for Preview in the Cloudflare dashboard
- Whitelist the preview callback URL in the Asgardeo `tvoprod` app

## Rules
- Always build before deploying — never deploy a stale `dist/`.
- Never deploy `.env` files or secrets.
- Run one CLI command at a time (no `&&` chaining).
