// First-party door to the self-hosted Umami: the tracker and its beacon travel through this site, so the CSP stays 'self' and
// ad-blocker lists see no third-party host. UMAMI_HOST (a bare host name) and UMAMI_WEBSITE_ID (a UUID) are set in the Pages
// settings, never in git. Either one unset = an empty script and a 204: nothing is loaded and nothing is sent.
// s.js is a tiny bootstrap that adds Umami's tag with this site's id; u.js is Umami's own script; api/send is its beacon.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const ROUTES = { 's.js': ['GET', null], 'u.js': ['GET', '/script.js'], 'api/send': ['POST', '/api/send'] };
const JS = { 'content-type': 'text/javascript', 'cache-control': 'public, max-age=3600' };

export async function onRequest({ request, env, params }) {
  const name = [].concat(params.path).join('/');
  const [method, path] = ROUTES[name] || [];
  if (request.method !== method) return new Response('not found', { status: 404 });
  const on = env.UMAMI_HOST && UUID.test(env.UMAMI_WEBSITE_ID || '');
  if (!on) return method === 'GET' ? new Response('', { headers: JS }) : new Response(null, { status: 204 });
  if (name === 's.js') {
    return new Response(
      `(()=>{const s=document.createElement('script');s.defer=true;s.src='/st/u.js';` +
        `Object.assign(s.dataset,{websiteId:${JSON.stringify(env.UMAMI_WEBSITE_ID)},domains:location.hostname,` +
        `hostUrl:location.origin+'/st',doNotTrack:'true',excludeSearch:'true'});document.head.appendChild(s)})()`,
      { headers: JS },
    );
  }
  const up = await fetch(`https://${env.UMAMI_HOST}${path}`, {
    method,
    headers: {
      'content-type': request.headers.get('content-type') || 'text/plain',
      'user-agent': request.headers.get('user-agent') || '',
      'x-forwarded-for': request.headers.get('cf-connecting-ip') || '', // the visitor, not this edge: the visit hash and the country need it
    },
    body: method === 'POST' ? request.body : undefined,
  });
  return new Response(up.body, {
    status: up.status,
    headers: { 'content-type': up.headers.get('content-type') || 'text/plain', 'cache-control': method === 'GET' ? JS['cache-control'] : 'no-store' },
  });
}
