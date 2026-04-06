# Deploy to Cloudflare Pages

Deploy the current state of the website to Cloudflare Pages.

## Project details
- **Cloudflare account ID:** c634b1a5b96172320adf5a4026105f0c
- **Pages project name:** tradingviewoptimizer
- **Production domain:** tradingviewoptimizer.com
- **Pages.dev URL:** tradingviewoptimizer.pages.dev
- **KV namespace (waitlist):** 35a9e16e9b2a4171a356f71f930f428f (binding: WAITLIST)
- **wrangler.toml:** already configured at project root

## Steps
1. Check that `wrangler` is authenticated (`wrangler whoami`). If not, ask the user to run `! wrangler login`.
2. If the project has a build step (e.g. `npm run build`), run it first and deploy the output directory. Otherwise deploy the project root `.`.
3. Run: `wrangler pages deploy <output_dir> --project-name tradingviewoptimizer --branch main`
4. Confirm the deployment URL and report it to the user.
5. Remind the user that the custom domain may take up to 60 seconds to reflect changes due to Cloudflare's edge cache.

## Notes
- Never deploy secrets or `.env` files.
- The `functions/api/waitlist.js` Pages Function handles email signups — ensure it is included in the deployment directory.
- If there are build errors, fix them before deploying.
