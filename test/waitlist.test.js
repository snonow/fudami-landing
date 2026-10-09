const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');

test('waitlist stores a valid email once, refuses junk, and lets the honeypot through silently', async () => {
  // Pages Functions are ES modules; this package is CommonJS, so load the source as a module.
  const src = fs.readFileSync(`${__dirname}/../functions/api/waitlist.js`, 'utf8');
  const { onRequestPost } = await import(`data:text/javascript,${encodeURIComponent(src)}`);
  const rows = [];
  const DB = { prepare: (sql) => ({ run: async () => {}, bind: (...args) => ({ run: async () => { if (sql.startsWith('INSERT')) rows.push(args); } }) }) };
  const post = (fields) => onRequestPost({ env: { DB }, request: new Request('https://fudami.net/api/waitlist', { method: 'POST', body: new URLSearchParams(fields) }) });

  assert.match((await post({ email: ' Me@Example.com ' })).headers.get('location'), /#joined$/);
  assert.match((await post({ email: 'not-an-email' })).headers.get('location'), /#invalid$/);
  assert.match((await post({ email: 'bot@spam.io', website: 'x' })).headers.get('location'), /#joined$/);
  assert.deepStrictEqual(rows.map((r) => r[0]), ['me@example.com']);
});
