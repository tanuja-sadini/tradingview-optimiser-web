---
name: waitlist
description: Read email signups stored in Cloudflare KV from the waitlist form
disable-model-invocation: true
---

Retrieve all waitlist signups from Cloudflare KV.

## Steps
1. Read `wrangler.toml` to get the KV namespace ID (under `[[kv_namespaces]]`).
2. Verify wrangler is authenticated.
3. Run: `wrangler kv key list --namespace-id <id-from-wrangler.toml> --remote`
4. For each key, fetch its value with: `wrangler kv key get --namespace-id <id> --remote "<email>"`
5. Display results as a clean table: email | signed up at (ISO timestamp).
6. Report the total count.

## Optional argument
If `$ARGUMENTS` is "export", write results to `waitlist-export.csv` in the project root.
