import type { APIRoute } from 'astro';
import { exchangeCode, parseIdToken } from '../../lib/auth';
import { createSessionCookie } from '../../lib/session';

export const GET: APIRoute = async ({ request, locals }) => {
  const { env } = locals.runtime;
  const url   = new URL(request.url);
  const code  = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  // Post-logout redirect arrives here with no code — send home cleanly
  if (!code || !state) {
    return redirect('/');
  }

  if (error) {
    return redirect('/?auth_error=1');
  }

  // Validate state from temp cookie
  const cookies = request.headers.get('cookie') ?? '';
  const authMatch = cookies.match(/tvo_auth=([^;]+)/);
  if (!authMatch) return redirect('/?auth_error=1');

  let authData: { state: string; next: string };
  try {
    authData = JSON.parse(decodeURIComponent(authMatch[1]));
  } catch {
    return redirect('/?auth_error=1');
  }

  if (authData.state !== state) return redirect('/?auth_error=1');

  try {
    const tokens = await exchangeCode(code, env.ASGARDEO_CLIENT_ID, env.ASGARDEO_CLIENT_SECRET, request);
    const claims = parseIdToken(tokens.id_token);

    const sessionCookie = await createSessionCookie({
      access_token:  tokens.access_token,
      refresh_token: tokens.refresh_token ?? null,
      user_id:       claims.sub as string,
      email:         (claims.email as string) ?? null,
      expires_at:    Math.floor(Date.now() / 1000) + tokens.expires_in,
    }, env.SESSION_SECRET);

    // Multiple Set-Cookie headers must be appended separately — joining with commas breaks cookie parsing
    const headers = new Headers({ Location: authData.next });
    headers.append('Set-Cookie', sessionCookie);
    headers.append('Set-Cookie', 'tvo_auth=; Path=/auth; HttpOnly; Secure; SameSite=Lax; Max-Age=0');

    return new Response(null, { status: 302, headers });
  } catch (e) {
    console.error('Auth callback error:', e);
    return redirect('/?auth_error=1');
  }
};

function redirect(to: string) {
  return new Response(null, { status: 302, headers: { Location: to } });
}
