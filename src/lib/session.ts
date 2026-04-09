import { refreshTokens } from './auth';

const COOKIE = 'tvo_sess';
const MAX_AGE = 60 * 60 * 8; // 8 hours

export interface Session {
  access_token:  string;
  refresh_token: string | null;
  user_id:       string;
  email:         string | null;
  expires_at:    number; // unix epoch
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function b64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): Uint8Array {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = (4 - (padded.length % 4)) % 4;
  return Uint8Array.from(atob(padded + '='.repeat(pad)), c => c.charCodeAt(0));
}

export async function createSessionCookie(session: Session, secret: string): Promise<string> {
  const payload = btoa(JSON.stringify(session));
  const key = await hmacKey(secret);
  const sig = b64url(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)));
  return `${COOKIE}=${payload}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export async function getSession(request: Request, secret: string): Promise<Session | null> {
  const raw = request.headers.get('cookie') ?? '';
  const match = raw.match(new RegExp(`(?:^|; )${COOKIE}=([^;]+)`));
  if (!match) return null;

  const dot = match[1].lastIndexOf('.');
  if (dot === -1) return null;
  const payload = match[1].slice(0, dot);
  const sig     = match[1].slice(dot + 1);

  let sigBytes: Uint8Array;
  try { sigBytes = b64urlDecode(sig); } catch { return null; }

  const key   = await hmacKey(secret);
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(payload));
  if (!valid) return null;

  let session: Session;
  try { session = JSON.parse(atob(payload)); } catch { return null; }

  if (session.expires_at < Math.floor(Date.now() / 1000)) return null;
  return session;
}

export function clearSessionCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Returns the current session, automatically refreshing the access token if it
 * expires within 5 minutes. Returns `newCookie` when the caller must set a new
 * Set-Cookie header on the response.
 */
export async function getValidSession(
  request: Request,
  secret: string,
  clientId: string,
  clientSecret: string,
): Promise<{ session: Session; newCookie?: string } | null> {
  const session = await getSession(request, secret);
  if (!session) return null;

  const now = Math.floor(Date.now() / 1000);
  // Token still valid for more than 5 minutes — use as-is
  if (session.expires_at > now + 300) return { session };

  // Token expired or about to expire — try refresh
  if (!session.refresh_token) return null;

  try {
    const tokens = await refreshTokens(session.refresh_token, clientId, clientSecret);
    const fresh: Session = {
      ...session,
      access_token:  tokens.access_token,
      refresh_token: tokens.refresh_token ?? session.refresh_token,
      expires_at:    now + tokens.expires_in,
    };
    const newCookie = await createSessionCookie(fresh, secret);
    return { session: fresh, newCookie };
  } catch {
    // Refresh failed — session is dead, force re-login
    return null;
  }
}
