import type { APIRoute } from 'astro';
import { getSession } from '../../lib/session';

export const GET: APIRoute = async ({ params, request, locals }) => {
  const { env } = locals.runtime;
  const { plan } = params;

  if (plan !== 'monthly' && plan !== 'annual') {
    return new Response(null, { status: 302, headers: { Location: '/pricing' } });
  }

  const session = await getSession(request, env.SESSION_SECRET);
  if (!session) {
    return new Response(null, {
      status: 302,
      headers: { Location: `/auth/login?next=/checkout/${plan}` },
    });
  }

  // If user already has an active PAID subscription, send them to the dashboard.
  // Trial users (plan_id=trial, any status) are allowed through to checkout.
  try {
    const meRes = await fetch('https://api.tradingviewoptimizer.com/v1/me', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (meRes.ok) {
      const profile = await meRes.json() as { subscription?: { plan_id: string; status: string } };
      const sub = profile.subscription;
      if (sub && sub.status === 'active' && (sub.plan_id === 'monthly' || sub.plan_id === 'annual')) {
        return new Response(null, { status: 302, headers: { Location: '/dashboard' } });
      }
    }
  } catch {
    // non-fatal — proceed to checkout attempt
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

  if (!res.ok) {
    return new Response(null, { status: 302, headers: { Location: '/pricing?checkout_error=1' } });
  }

  const data = await res.json() as { url?: string };
  if (!data.url) {
    return new Response(null, { status: 302, headers: { Location: '/pricing?checkout_error=1' } });
  }

  return new Response(null, { status: 302, headers: { Location: data.url } });
};
