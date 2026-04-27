import type { APIRoute } from 'astro';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  let body: { email?: unknown };
  try { body = await request.json(); } catch { return bad('Invalid JSON'); }

  const { email } = body;
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return bad('A valid email address is required');
  }

  const res = await fetch('https://api.tradingviewoptimizer.com/v1/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
};

function bad(error: string) {
  return new Response(JSON.stringify({ ok: false, error }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}
