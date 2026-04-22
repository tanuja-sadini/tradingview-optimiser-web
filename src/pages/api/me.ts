import type { APIRoute } from 'astro';
import { getValidSession } from '../../lib/session';

export const GET: APIRoute = async ({ request, locals }) => {
  const { env } = locals.runtime;
  const oidc = { authorizeUrl: env.OIDC_AUTHORIZE_URL, tokenUrl: env.OIDC_TOKEN_URL, logoutUrl: env.OIDC_LOGOUT_URL };
  const result = await getValidSession(request, env.SESSION_SECRET, env.ASGARDEO_CLIENT_ID, env.ASGARDEO_CLIENT_SECRET, oidc);

  if (!result) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { session, newCookie } = result;

  const res = await fetch('https://api.tradingviewoptimizer.com/v1/me', {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  const data = await res.json();
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (newCookie) headers.append('Set-Cookie', newCookie);

  return new Response(JSON.stringify(data), { status: res.status, headers });
};
