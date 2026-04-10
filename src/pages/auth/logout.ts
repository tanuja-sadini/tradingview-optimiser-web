import type { APIRoute } from 'astro';
import { buildLogoutUrl } from '../../lib/auth';
import { clearSessionCookie } from '../../lib/session';

export const GET: APIRoute = async ({ request, locals }) => {
  const { env } = locals.runtime;
  const oidc = { authorizeUrl: env.OIDC_AUTHORIZE_URL, tokenUrl: env.OIDC_TOKEN_URL, logoutUrl: env.OIDC_LOGOUT_URL };
  return new Response(null, {
    status: 302,
    headers: {
      Location: buildLogoutUrl(oidc, env.ASGARDEO_CLIENT_ID, request),
      'Set-Cookie': clearSessionCookie(),
    },
  });
};
