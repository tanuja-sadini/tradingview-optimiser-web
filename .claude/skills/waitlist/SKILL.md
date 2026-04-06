---
name: waitlist
description: Read email signups stored in Cloudflare KV from the waitlist form
disable-model-invocation: true
allowed-tools: Bash
---

Retrieve all waitlist signups from Cloudflare KV.

## Details
- **KV namespace ID:** 35a9e16e9b2a4171a356f71f930f428f
- **Account ID:** c634b1a5b96172320adf5a4026105f0c
- Each key is an email address; each value is an ISO 8601 signup timestamp.

## Steps
1. Verify wrangler is authenticated.
2. Run: `wrangler kv key list --namespace-id 35a9e16e9b2a4171a356f71f930f428f`
3. Display results as a clean table: email | signed up at.
4. Report the total count.

## Optional argument
If `$ARGUMENTS` is "export", write results to `waitlist-export.csv` in the project root.
