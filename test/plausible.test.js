const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');

const load = async () => import(`data:text/javascript,${encodeURIComponent(fs.readFileSync(`${__dirname}/../functions/st/[[path]].js`, 'utf8'))}`);
const call = async (fn, method, name, env) => fn({ request: new Request(`https://fudami.net/st/${name}`, { method, body: method === 'POST' ? '{}' : undefined, headers: { 'cf-connecting-ip': '203.0.113.9' } }), env, params: { path: [name] } });

test('without PLAUSIBLE_HOST the proxy sends nothing anywhere', async () => {
  const { onRequest } = await load();
  global.fetch = () => { throw new Error('must not fetch'); };
  assert.strictEqual(await (await call(onRequest, 'GET', 's.js', {})).text(), '');
  assert.strictEqual((await call(onRequest, 'POST', 'e', {})).status, 204);
});

test('with PLAUSIBLE_HOST only the script and the beacon are forwarded, with the visitor address', async () => {
  const { onRequest } = await load();
  const seen = [];
  global.fetch = async (url, init) => { seen.push([url, init.method, init.headers['x-forwarded-for']]); return new Response('ok', { status: 202 }); };
  const env = { PLAUSIBLE_HOST: 'stats.example.test' };
  assert.strictEqual((await call(onRequest, 'GET', 's.js', env)).status, 202);
  assert.strictEqual((await call(onRequest, 'POST', 'e', env)).status, 202);
  assert.deepStrictEqual(seen, [['https://stats.example.test/js/script.js', 'GET', '203.0.113.9'], ['https://stats.example.test/api/event', 'POST', '203.0.113.9']]);
  assert.strictEqual((await call(onRequest, 'GET', 'e', env)).status, 404); // wrong method
  assert.strictEqual((await call(onRequest, 'GET', 'api/stats', env)).status, 404); // nothing else is reachable
});

test('the loader runs on the production host only, off for Do Not Track, with the right attributes and no external host', () => {
  const src = fs.readFileSync(`${__dirname}/../shared.js`, 'utf8');
  const block = src.match(/if \(location\.hostname === 'fudami\.net'[\s\S]*?\n\}\n/)[0];
  const run = (hostname, nav) => {
    const added = [];
    new Function('location', 'navigator', 'document', block)({ hostname }, nav, { createElement: () => ({ dataset: {} }), head: { appendChild: (s) => added.push(s) } });
    return added;
  };
  const [s] = run('fudami.net', {});
  assert.deepStrictEqual([s.defer, s.src, s.dataset.domain, s.dataset.api], [true, '/st/s.js', 'fudami.net', '/st/e']);
  assert.strictEqual(run('x.pages.dev', {}).length, 0);
  assert.strictEqual(run('fudami.net', { doNotTrack: '1' }).length, 0);
  assert.strictEqual(run('fudami.net', { globalPrivacyControl: true }).length, 0);
  assert.ok(!/https?:\/\//.test(block), 'the CSP stays untouched: no external host in the loader');
});
