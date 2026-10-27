const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

test('Pages uploads public assets without repository files or Functions source', () => {
  const config = fs.readFileSync(path.join(ROOT, 'wrangler.toml'), 'utf8');
  assert.match(config, /^pages_build_output_dir = "public"$/m);
  for (const name of ['package.json', 'package-lock.json', 'README.md', 'wrangler.toml', 'test', 'functions', '.git', '.github']) {
    assert.ok(fs.existsSync(path.join(ROOT, name)), `${name} remains at the repository root`);
    assert.ok(!fs.existsSync(path.join(PUBLIC, name)), `${name} must not be uploaded`);
  }
  for (const name of ['index.html', '404.html', 'privacy.html', 'shared.js', 'components.js', 'design-system.css', 'assets/favicon.png', 'vendor/fudami-design.browser.js', 'robots.txt', 'sitemap.xml', 'llms.txt', '_headers', '_redirects', '.well-known/security.txt']) {
    assert.ok(fs.statSync(path.join(PUBLIC, name)).isFile(), `${name} stays public`);
  }
  const security = fs.readFileSync(path.join(PUBLIC, '.well-known/security.txt'), 'utf8');
  assert.match(security, /^Contact: mailto:/m);
  assert.match(security, /^Expires: /m);
});
