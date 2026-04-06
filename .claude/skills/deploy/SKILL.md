---
name: deploy
description: Deploy the website to Cloudflare Pages production
disable-model-invocation: true
---

Deploy the current website to Cloudflare Pages.

## Project details
All config (account ID, project name, KV namespace) is in `wrangler.toml` at the project root. Read it before running any commands.

## Steps
1. Check wrangler is authenticated (`wrangler whoami`). If not, ask the user to run `! wrangler login`.
2. If the project has a build step (e.g. `npm run build`), run it first and deploy the output directory. Otherwise deploy the project root `.`.
3. Read the project name from `wrangler.toml`, then run: `wrangler pages deploy . --project-name <name> --branch main`
4. Confirm the deployment URL and report it to the user.
5. Remind the user that the custom domain may take up to 60 seconds to reflect changes.

## Notes
- Never deploy `.env` files or secrets.
- `functions/api/waitlist.js` must be present in the deployment directory.
- Fix any build errors before deploying.
