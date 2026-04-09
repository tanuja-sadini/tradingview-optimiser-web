import type { APIRoute } from 'astro';
import { loginUrl } from '../../lib/auth';

export const GET: APIRoute = async ({ request, locals }) => {
  const { env } = locals.runtime;
  const url  = new URL(request.url);
  const next = url.searchParams.get('next') ?? '/dashboard';
  // Only allow relative paths — prevent open redirect
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';

  const state = crypto.randomUUID();
  const authUrl = loginUrl(env.ASGARDEO_CLIENT_ID, state, request);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authUrl,
      'Set-Cookie': `tvo_auth=${encodeURIComponent(JSON.stringify({ state, next: safeNext }))}; Path=/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
};
