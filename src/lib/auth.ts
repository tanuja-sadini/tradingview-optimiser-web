const ASGARDEO_BASE = 'https://api.asgardeo.io/t/tvoprod';

export const OIDC = {
  authorize: `${ASGARDEO_BASE}/oauth2/authorize`,
  token:     `${ASGARDEO_BASE}/oauth2/token`,
  logout:    `${ASGARDEO_BASE}/oidc/logout`,
};

function origin(request: Request): string {
  const u = new URL(request.url);
  return `${u.protocol}//${u.host}`;
}

export function loginUrl(clientId: string, state: string, request: Request): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id:     clientId,
    redirect_uri:  `${origin(request)}/auth/callback`,
    scope:         'openid profile email',
    state,
  });
  return `${OIDC.authorize}?${params}`;
}

export async function exchangeCode(
  code: string,
  clientId: string,
  clientSecret: string,
  request: Request,
): Promise<{ access_token: string; id_token: string; expires_in: number }> {
  const res = await fetch(OIDC.token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type:   'authorization_code',
      code,
      redirect_uri: `${origin(request)}/auth/callback`,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${body}`);
  }

  return res.json();
}

export function parseIdToken(token: string): Record<string, unknown> {
  const [, payload] = token.split('.');
  const padded = payload.replace(/-/g, '+').replace(/_/g, '/');
  const pad = (4 - (padded.length % 4)) % 4;
  return JSON.parse(atob(padded + '='.repeat(pad)));
}

export function logoutUrl(clientId: string, request: Request): string {
  const params = new URLSearchParams({
    client_id:                clientId,
    post_logout_redirect_uri: `${origin(request)}/auth/callback`,
  });
  return `${OIDC.logout}?${params}`;
}
