export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { ok: false, error: 'Invalid email address.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Use email as key so duplicates are automatically deduplicated.
    // Value stores signup timestamp.
    await env.WAITLIST.put(email, new Date().toISOString());

    return Response.json({ ok: true }, { status: 200, headers: corsHeaders });
  } catch (err) {
    return Response.json(
      { ok: false, error: 'Server error.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
