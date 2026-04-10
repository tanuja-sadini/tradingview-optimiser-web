---
name: Known Issues / Backlog
description: Tracked issues and backlog items for the TVO website that need fixing
type: project
---

## Backlog — website

1. **Pricing page doesn't reflect existing subscription** — a logged-in subscriber hits `/pricing` and sees "Get Started" buttons instead of their current plan. Need to fetch `/v1/me` (or `/api/me`) and conditionally render plan state.

2. **Nav doesn't show subscription status** — the account dropdown has no indication of what plan the user is on. Could show a badge or plan label.

3. **Access token expiry / refresh** — the session cookie stores the access token with a fixed `expires_at`. When the token expires, `/v1/me` calls silently fail and the dashboard shows empty data. Need to implement token refresh using Asgardeo's token endpoint with a stored refresh token, or redirect to re-login.

**Why:** All three identified during initial build session (2026-04-09). Not blocking launch but are UX gaps for returning subscribers.

**How to apply:** Address these after core auth + subscription flow is confirmed working end-to-end.

