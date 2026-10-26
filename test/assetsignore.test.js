const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('.assetsignore exists and excludes repository files while serving public assets', () => {
  const ignorePath = path.join(__dirname, '..', '.assetsignore');
  assert.ok(fs.existsSync(ignorePath), '.assetsignore must exist');

  const content = fs.readFileSync(ignorePath, 'utf8');
  const lines = content.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));

  // Critical files that prod must not serve
  const mustIgnore = [
    'package.json',
    'README.md',
    'wrangler.toml',
    'test/',
  ];

  for (const item of mustIgnore) {
    assert.ok(
      lines.includes(item),
      `.assetsignore must exclude ${item} so repo files are not served publicly`,
    );
  }

  // Ensure public assets are not accidentally excluded
  const mustNotIgnore = [
    'index.html',
    '404.html',
    '_headers',
    '_redirects',
    'components.js',
    'shared.js',
    'design-system.css',
    '.well-known',
  ];

  for (const item of mustNotIgnore) {
    assert.ok(
      !lines.includes(item),
      `.assetsignore must not exclude public asset ${item}`,
    );
  }

  // Security.txt exists and meets RFC 9116
  const secPath = path.join(__dirname, '..', '.well-known', 'security.txt');
  assert.ok(fs.existsSync(secPath), '.well-known/security.txt must exist');
  const secContent = fs.readFileSync(secPath, 'utf8');
  assert.match(secContent, /^Contact: mailto:/m, 'security.txt must have Contact field');
  assert.match(secContent, /^Expires: /m, 'security.txt must have Expires field');
});
