const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');

const ID = '276c28f6-0000-4000-8000-00000000000a'; // a made-up UUID: the real one lives in the Pages settings
const load = async () => import(`data:text/javascript,${encodeURIComponent(fs.readFileSync(`${__dirname}/../functions/st/[[path]].js`, 'utf8'))}`);
const call = async (fn, method, name, env) => fn({ request: new Request(`https://fudami.net/st/${name}`, { method, body: method === 'POST' ? '{}' : undefined, headers: { 'cf-connecting-ip': '203.0.113.9' } }), env, params: { path: name.split('/') } });

test('without UMAMI_HOST or a valid UMAMI_WEBSITE_ID the door sends nothing anywhere', async () => {
  const { onRequest } = await load();
  global.fetch = () => { throw new Error('must not fetch'); };
  for (const env of [{}, { UMAMI_HOST: 'stats.example.test' }, { UMAMI_WEBSITE_ID: ID }, { UMAMI_HOST: 'stats.example.test', UMAMI_WEBSITE_ID: "x'});alert(1)//" }]) {
    for (const name of ['s.js', 'u.js']) assert.strictEqual(await (await call(onRequest, 'GET', name, env)).text(), '');
    assert.strictEqual((await call(onRequest, 'POST', 'api/send', env)).status, 204);
  }
});

test('configured: only the tracker and the beacon are forwarded, with the visitor address', async () => {
  const { onRequest } = await load();
  const seen = [];
  global.fetch = async (url, init) => { seen.push([url, init.method, init.headers['x-forwarded-for'], Object.keys(init.headers).sort().join()]); return new Response('ok', { status: 202 }); };
  const env = { UMAMI_HOST: 'stats.example.test', UMAMI_WEBSITE_ID: ID };
  assert.strictEqual((await call(onRequest, 'GET', 'u.js', env)).status, 202);
  assert.strictEqual((await call(onRequest, 'POST', 'api/send', env)).status, 202);
  assert.deepStrictEqual(seen, [
    ['https://stats.example.test/script.js', 'GET', '203.0.113.9', 'content-type,user-agent,x-forwarded-for'],
    ['https://stats.example.test/api/send', 'POST', '203.0.113.9', 'content-type,user-agent,x-forwarded-for'], // no cookie, no auth, nothing else
  ]);
  assert.strictEqual((await call(onRequest, 'GET', 'api/send', env)).status, 404); // wrong method
  assert.strictEqual((await call(onRequest, 'GET', 'api/websites', env)).status, 404); // nothing else is reachable
  assert.strictEqual(seen.length, 2);
});

test('the bootstrap adds Umami\'s tag with this site\'s id, through our own origin, cookieless settings on', async () => {
  const { onRequest } = await load();
  const js = await (await call(onRequest, 'GET', 's.js', { UMAMI_HOST: 'stats.example.test', UMAMI_WEBSITE_ID: ID })).text();
  const added = [];
  new Function('document', 'location', js)({ createElement: () => ({ dataset: {} }), head: { appendChild: (s) => added.push(s) } }, { hostname: 'fudami.net', origin: 'https://fudami.net' });
  const [s] = added;
  assert.deepStrictEqual([s.defer, s.src, s.dataset.websiteId, s.dataset.hostUrl, s.dataset.domains, s.dataset.doNotTrack, s.dataset.excludeSearch],
    [true, '/st/u.js', ID, 'https://fudami.net/st', 'fudami.net', 'true', 'true']);
  assert.ok(!js.includes('stats.example.test'), 'the stats host never reaches the browser');
});

test('the loader runs on the production host only, off for Do Not Track and GPC, no external host', () => {
  const src = fs.readFileSync(`${__dirname}/../shared.js`, 'utf8');
  const block = src.match(/if \(location\.hostname === 'fudami\.net'[\s\S]*?\n\}\n/)[0];
  const run = (hostname, nav) => {
    const added = [];
    new Function('location', 'navigator', 'document', block)({ hostname }, nav, { createElement: () => ({}), head: { appendChild: (s) => added.push(s) } });
    return added;
  };
  const [s] = run('fudami.net', {});
  assert.deepStrictEqual([s.defer, s.src], [true, '/st/s.js']);
  assert.strictEqual(run('x.pages.dev', {}).length, 0);
  assert.strictEqual(run('fudami.net', { doNotTrack: '1' }).length, 0);
  assert.strictEqual(run('fudami.net', { globalPrivacyControl: true }).length, 0);
  assert.ok(!/https?:\/\//.test(block), 'the CSP stays untouched: no external host in the loader');
});
