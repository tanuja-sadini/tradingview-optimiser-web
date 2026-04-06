# Read waitlist signups

Retrieve all email addresses that have signed up via the waitlist form on tradingviewoptimizer.com.

## Details
- Storage: Cloudflare KV namespace `WAITLIST`
- Namespace ID: `35a9e16e9b2a4171a356f71f930f428f`
- Account ID: `c634b1a5b96172320adf5a4026105f0c`
- Each key is an email address; each value is an ISO 8601 signup timestamp.

## Steps
1. Verify wrangler is authenticated.
2. Run: `wrangler kv key list --namespace-id 35a9e16e9b2a4171a356f71f930f428f`
3. Parse and display the results as a clean table: email | signed up at.
4. Report the total count.

## Optional argument
$ARGUMENTS — if "export" is passed, write the results to a `waitlist-export.csv` file in the project root.
