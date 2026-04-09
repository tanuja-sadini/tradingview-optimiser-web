import type { APIRoute } from 'astro';
import { logoutUrl } from '../../lib/auth';
import { clearSessionCookie } from '../../lib/session';

export const GET: APIRoute = async ({ request, locals }) => {
  const { env } = locals.runtime;
  return new Response(null, {
    status: 302,
    headers: {
      Location: logoutUrl(env.ASGARDEO_CLIENT_ID, request),
      'Set-Cookie': clearSessionCookie(),
    },
  });
};
