// First-party door to the self-hosted Plausible: the script and the beacon travel through this site, so the CSP stays
// 'self' and ad-blocker lists see no third-party host. PLAUSIBLE_HOST (a bare host name, set in the Pages settings, never
// in git) unset = an empty script and a 204: nothing is loaded and nothing is sent.
const ROUTES = { 's.js': ['GET', '/js/script.js'], e: ['POST', '/api/event'] };

export async function onRequest({ request, env, params }) {
  const [method, path] = ROUTES[[].concat(params.path).join('/')] || [];
  if (request.method !== method) return new Response('not found', { status: 404 });
  if (!env.PLAUSIBLE_HOST) {
    return method === 'GET' ? new Response('', { headers: { 'content-type': 'text/javascript' } }) : new Response(null, { status: 204 });
  }
  const up = await fetch(`https://${env.PLAUSIBLE_HOST}${path}`, {
    method,
    headers: {
      'content-type': request.headers.get('content-type') || 'text/plain',
      'user-agent': request.headers.get('user-agent') || '',
      'x-forwarded-for': request.headers.get('cf-connecting-ip') || '', // the visitor, not this edge: the daily hash and the country need it
    },
    body: method === 'POST' ? request.body : undefined,
  });
  return new Response(up.body, {
    status: up.status,
    headers: { 'content-type': up.headers.get('content-type') || 'text/plain', 'cache-control': method === 'GET' ? 'public, max-age=3600' : 'no-store' },
  });
}
