import type { APIRoute } from 'astro';

export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const email = (typeof body?.email === 'string' ? body.email : '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { ok: false, error: 'Invalid email address.' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const env = locals.runtime?.env;
    if (!env?.WAITLIST) {
      return Response.json(
        { ok: false, error: 'Service unavailable.' },
        { status: 503, headers: CORS_HEADERS }
      );
    }

    await env.WAITLIST.put(email, new Date().toISOString());

    return Response.json({ ok: true }, { status: 200, headers: CORS_HEADERS });
  } catch {
    return Response.json(
      { ok: false, error: 'Server error.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
};

export const OPTIONS: APIRoute = () =>
  new Response(null, { status: 204, headers: CORS_HEADERS });
