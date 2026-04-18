# Consent Ledger — Specification

This document specifies how TradingView Optimizer records user acceptance
of the Terms of Service and Privacy Policy. It is the single source of
truth for the backend schema, the API contract, and the desktop-app
client behavior.

## Goals

- Prove, with legally defensible evidence, that a specific user accepted a
  specific version of the Terms and Privacy Policy at a specific time.
- Force re-acceptance whenever either document is materially updated.
- Gate use of the desktop application on current acceptance (telemetry
  is a condition of the license — no acceptance, no launch).
- Retain evidence for 6 years after account closure (see Privacy Policy §8).

## Document versioning

Each legal document has a version identifier — an ISO date in the form
`YYYY-MM-DD` matching the `updated` field on the rendered page.

Current versions (initial):

| Document | Version |
|----------|---------|
| Terms of Service | `2026-04-17` |
| Privacy Policy | `2026-04-17` |

When either doc is materially updated, bump **that** doc's version. The
server treats any mismatch between a user's latest-accepted versions and
the current versions as `stale` — the desktop app must force re-acceptance.

The current versions are configured server-side only — the desktop app
discovers them by calling `GET /v1/consent`. The app never hard-codes
versions.

## Data model

A single append-only table. Never update; only insert on each acceptance.

```sql
CREATE TABLE consent_records (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           TEXT        NOT NULL,          -- Asgardeo sub
  accepted_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  terms_version     TEXT        NOT NULL,          -- e.g. "2026-04-17"
  privacy_version   TEXT        NOT NULL,
  ip_address        INET,                          -- captured server-side from request
  user_agent        TEXT,                          -- from request headers
  app_version       TEXT,                          -- e.g. "1.0.3"
  platform          TEXT,                          -- "macos" | "windows" | "linux"
  scope             TEXT[]      NOT NULL DEFAULT ARRAY['terms','privacy']
);

CREATE INDEX consent_records_user_latest
  ON consent_records (user_id, accepted_at DESC);
```

Notes:

- `user_id` is the Asgardeo `sub` claim (what every other table keys off).
- `ip_address` and `user_agent` are captured by the server from the
  request — the client never sends them (harder to forge evidence).
- `app_version` and `platform` come from the request body (client-provided).
- `scope` is an array so a future third document (e.g. a DPA, or a
  mandatory-arbitration addendum) can be added without migrating the schema.

## API contract

Base URL: `https://api.tradingviewoptimizer.com`
Auth: Bearer JWT (Asgardeo access token), same as other `/v1/*` endpoints.

### `GET /v1/consent`

Returns whether the authenticated user's acceptance is current.

**Response 200:**

```json
{
  "current_versions": {
    "terms": "2026-04-17",
    "privacy": "2026-04-17"
  },
  "user_acceptance": {
    "terms":   { "version": "2026-04-17", "accepted_at": "2026-04-18T01:02:03Z" },
    "privacy": { "version": "2026-04-17", "accepted_at": "2026-04-18T01:02:03Z" }
  },
  "status": "current"
}
```

Statuses:

| `status`  | Meaning |
|-----------|---------|
| `current` | User's latest acceptance matches all current doc versions. |
| `stale`   | User has accepted before, but at least one doc is now a newer version. |
| `never`   | User has never accepted. |

When status is `never`, `user_acceptance` is `null`.

### `POST /v1/consent`

Records a new acceptance row. Idempotent per (user_id, terms_version,
privacy_version) — if the user already has a matching record, return it
rather than insert a duplicate.

**Request body:**

```json
{
  "terms_version":   "2026-04-17",
  "privacy_version": "2026-04-17",
  "app_version":     "1.0.3",
  "platform":        "macos"
}
```

**Behavior:**

1. Verify the supplied versions match the server's current versions. If
   they do not, return `409 Conflict` with the current versions — the
   client must re-fetch `GET /v1/consent` and show the user the newest
   text before accepting.
2. Extract `ip_address` from the request (respecting any trusted proxy
   header configured at the edge).
3. Extract `user_agent` from the request headers.
4. Insert a row.

**Response 200:**

```json
{
  "id": "3c4d…",
  "accepted_at": "2026-04-18T01:02:03Z",
  "terms_version": "2026-04-17",
  "privacy_version": "2026-04-17"
}
```

**Response 409 (stale versions):**

```json
{
  "error": "version_mismatch",
  "current_versions": {
    "terms":   "2026-05-01",
    "privacy": "2026-04-17"
  }
}
```

### Integration with other endpoints

- `GET /v1/me` should include a `consent_status` field set to the same
  values as `GET /v1/consent` status (`current` | `stale` | `never`).
  This lets the app decide whether to block startup without a second
  round-trip.
- Existing endpoints (sweep runs, etc.) that require an active session
  should also require `consent_status = current`. Reject with `403
  Forbidden` and error code `consent_required` otherwise, so the app
  can surface the consent modal.

## Desktop-app behavior (summary)

1. After login, call `GET /v1/consent` (or read `consent_status` from
   `GET /v1/me`).
2. If `current` → proceed to app.
3. If `stale` or `never` → open a modal blocking all other UI:
   - Title: *Before you continue*
   - Short intro explaining Terms + Privacy + telemetry.
   - Two links: `View Terms of Service` → `https://tradingviewoptimizer.com/terms`
     and `View Privacy Policy` → `https://tradingviewoptimizer.com/privacy`
   - One checkbox: **I have read and agree to the Terms of Service and
     Privacy Policy, including the use of product telemetry as described.**
   - Buttons: `Accept and continue` (disabled until checkbox is ticked)
     and `Decline and quit` (closes the app).
4. On accept: `POST /v1/consent` with the two versions from the
   `current_versions` field returned by `GET /v1/consent`. On success,
   unblock the app.
5. On decline: close the app.

## Versioning process (operational)

When publishing a material change to Terms or Privacy:

1. Update the doc in the website repo (`src/pages/terms.astro` or
   `privacy.astro`), bump the `updated` prop to the new date.
2. Update the same date in this file's "Current versions" table.
3. Update the server's current-version config to the new date.
4. Deploy backend first, then website. On next app launch, users will
   see the stale-consent modal and re-accept.

Trivial typo fixes and formatting changes do **not** require a version
bump. When in doubt, ask counsel.
