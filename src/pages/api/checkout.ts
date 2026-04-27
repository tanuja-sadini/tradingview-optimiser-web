import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getSession } from '../../lib/session';

export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request, env.SESSION_SECRET);

  if (!session) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: { plan?: string };
  try { body = await request.json(); } catch { return json({ error: 'Bad request' }, 400); }

  const { plan } = body;
  if (plan !== 'monthly' && plan !== 'annual') {
    return json({ error: 'Invalid plan' }, 400);
  }

  const base = new URL(request.url).origin;

  const res = await fetch('https://api.tradingviewoptimizer.com/v1/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      plan,
      success_url: `${base}/dashboard?checkout=success`,
      cancel_url:  `${base}/pricing`,
    }),
  });

  const data = await res.json();
  return json(data, res.status);
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
