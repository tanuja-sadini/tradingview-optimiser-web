import type { APIRoute } from 'astro';
import { getSession } from '../../lib/session';

export const GET: APIRoute = async ({ request, locals }) => {
  const { env } = locals.runtime;
  const session = await getSession(request, env.SESSION_SECRET);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = await fetch('https://api.tradingviewoptimizer.com/v1/me', {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
};
