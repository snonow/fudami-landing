/**
 * Boot smoke test for every page.
 *
 * These are static pages whose entire chrome - header, footer, modal - is built
 * at runtime by components.js. Nothing here is type-checked and nothing else is
 * tested, so a typo in an injected template ships a page with no navigation and
 * CI stays green. htmlhint only reads the static HTML and cannot see any of it.
 *
 * So this loads each page in a real DOM, runs the same scripts in the same
 * order the pages do, and asserts the chrome actually appeared.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..', 'public');
const PAGES = ['index.html', 'about.html', 'fsrs.html', 'glossary.html', 'pricing.html', 'privacy.html', 'terms.html', 'legal.html', 'credits.html', 'waitlist.html'];
// The app is private for now: every call to action leads to the waitlist.
const APP_URL = 'waitlist';

/** Load one page with its scripts executed, as a browser would. */
function boot(page) {
  const dom = new JSDOM(fs.readFileSync(path.join(ROOT, page), 'utf8'), {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'https://fudami.net/',
  });
  const { window } = dom;
  window.matchMedia = window.matchMedia
    || ((q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
  window.document.fonts = { ready: Promise.resolve() };

  // Same order the pages load them: the package defines FudamiDesign, which the two
  // site files call at module scope.
  for (const script of ['vendor/fudami-design.browser.js', 'components.js', 'shared.js']) {
    window.eval(fs.readFileSync(path.join(ROOT, script), 'utf8'));
  }
  // Each page calls these from its own inline script; mirror that here.
  const active = path.basename(page, '.html');
  window.eval(`injectHeader('${active}'); injectFooter();`);
  if (typeof window.injectWikiModal === 'function') window.eval('injectWikiModal();');
  if (typeof window.initScrollReveal === 'function') window.eval('initScrollReveal();');
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return window.document;
}

for (const page of PAGES) {
  test(`${page} boots with its chrome and a working CTA`, () => {
    const doc = boot(page);

    assert.strictEqual(doc.querySelectorAll('#site-header').length, 1, 'client initialization duplicated the header');
    assert.strictEqual(doc.querySelectorAll('#site-footer').length, 1, 'client initialization duplicated the footer');

    assert.ok(doc.getElementById('site-header'), 'header was not injected');
    assert.ok(doc.getElementById('theme-toggle'), 'theme toggle missing from header');
    assert.ok(
      doc.documentElement.classList.contains('dark') || doc.documentElement.classList.contains('light'),
      'initTheme() set neither theme class',
    );

    // Every call to action reaches the app without waiting on a third-party script.
    // The header's CTA is now an <a href> built by fudami-design rather than a button
    // carrying an inline onclick, so both forms count - an href is the stronger one: it
    // survives JS being disabled and any CSP that forbids inline handlers.
    const ctas = [...doc.querySelectorAll('a.btn-hanko')];
    assert.strictEqual(doc.querySelectorAll('[id^="clerk-"], .clerk-signup-trigger').length, 0, 'dead clerk id or class found');
    assert.ok(ctas.length > 0, 'page has no call to action at all');
    for (const cta of ctas) {
      const target = `${cta.getAttribute('href') ?? ''} ${cta.getAttribute('onclick') ?? ''}`;
      assert.match(target, new RegExp(APP_URL), `CTA ${cta.id || cta.className} does not reach the app`);
    }

    // No inline handler on anything the package builds.
    for (const node of doc.querySelectorAll('#site-header *, #site-footer *')) {
      assert.strictEqual(node.getAttribute('onclick'), null, 'package markup must carry no inline handler');
    }
  });
}

test('every page ships navigation and the shared legal links with JavaScript disabled', () => {
  for (const page of fs.readdirSync(ROOT).filter(name => name.endsWith('.html'))) {
    const dom = new JSDOM(fs.readFileSync(path.join(ROOT, page), 'utf8'));
    const doc = dom.window.document;
    assert.strictEqual(doc.querySelectorAll('#site-header').length, 1, page);
    assert.strictEqual(doc.querySelectorAll('#site-footer').length, 1, page);
    for (const href of ['/about', '/pricing', 'https://jisho.fudami.net']) {
      assert.ok(doc.querySelector(`#site-header a[href="${href}"]`), `${page}: ${href}`);
    }
    for (const href of ['privacy', 'terms', 'legal', 'credits']) {
      assert.ok(doc.querySelector(`#site-footer a[href="https://fudami.net/${href}"]`), `${page}: ${href}`);
    }
    dom.window.close();
  }
});

test('client initialization preserves the theme toggle and mobile navigation', () => {
  const doc = boot('index.html');
  const wasDark = doc.documentElement.classList.contains('dark');
  doc.getElementById('theme-toggle').click();
  assert.strictEqual(doc.documentElement.classList.contains('dark'), !wasDark);
  const mobile = doc.getElementById('mobile-nav');
  assert.ok(mobile.classList.contains('hidden'));
  doc.getElementById('mobile-menu-toggle').click();
  assert.ok(!mobile.classList.contains('hidden'));
});

test('no third-party auth SDK is pulled into any page', () => {
  // Regression: the landing page used to load @clerk/clerk-js@latest from a CDN
  // and never call it, which put an unpinned third-party script on the critical
  // path of every page for no behaviour.
  for (const page of PAGES) {
    const doc = boot(page);
    const srcs = [...doc.querySelectorAll('script')].map((s) => s.src || '');
    assert.ok(!srcs.some((s) => s.includes('clerk')), `${page} loads a Clerk script`);
  }
});

test('i18n applies to the injected nav', () => {
  const doc = boot('index.html');
  const about = doc.querySelector('[data-i18n="nav.about"]');
  assert.ok(about, 'nav link carries no i18n key');
  assert.strictEqual(about.textContent, 'About');
});

test('every page points crawlers and link previews at fudami.net, not an old domain', () => {
  // canonical and og:url sat on fudami.arno-wilhelm.dev long after the move: Google was told
  // to index the old domain and every shared link previewed it.
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
    const ogUrl = /<meta property="og:url" content="([^"]+)"/.exec(html)?.[1];
    assert.ok(canonical?.startsWith('https://fudami.net/'), `${page} canonical: ${canonical}`);
    assert.strictEqual(ogUrl, canonical, `${page} og:url differs from canonical`);
  }
});

test('every page has a 1200x630 share image, a large Twitter card and valid structured data', () => {
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
    assert.match(html, /<meta property="og:image" content="https:\/\/fudami\.net\/assets\/og-image\.png"/, `${page} og:image`);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"/, `${page} twitter:card`);
    assert.match(html, /<meta property="og:description"/, `${page} og:description`);
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      assert.doesNotThrow(() => JSON.parse(json), `${page} has invalid JSON-LD`);
    }
  }
  const png = fs.readFileSync(path.join(ROOT, 'assets', 'og-image.png'));
  assert.strictEqual(png.readUInt32BE(16), 1200, 'og-image width');
  assert.strictEqual(png.readUInt32BE(20), 630, 'og-image height');
});

test('the sitemap lists exactly the indexable pages, and robots.txt points at it', () => {
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
  const expected = PAGES.map((p) => (p === 'index.html' ? 'https://fudami.net/' : `https://fudami.net/${p.replace('.html', '')}`)).sort();
  assert.deepStrictEqual(listed, expected);
  const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
  assert.match(robots, /^Sitemap: https:\/\/fudami\.net\/sitemap\.xml$/m);
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m, 'robots.txt must not block the whole site');
  for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) {
    assert.match(robots, new RegExp(`User-agent: ${bot}\\nAllow: /`), `${bot} is not explicitly welcome`);
  }
});

test('every term the landing explains in its modal has a section on the glossary page', () => {
  // Issue #6: the modal is the quick answer, the glossary is the full one it links to.
  const glossary = fs.readFileSync(path.join(ROOT, 'glossary.html'), 'utf8');
  const shared = fs.readFileSync(path.join(ROOT, 'shared.js'), 'utf8');
  const modalTerms = [...shared.matchAll(/^  (\w+): \{\n    title:/gm)].map((m) => m[1]);
  assert.ok(modalTerms.length >= 5, 'the modal explains too few terms');
  for (const term of modalTerms) assert.match(glossary, new RegExp(`<section id="${term}">`), `glossary lacks #${term}`);
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  for (const [, term] of index.matchAll(/data-wiki-trigger="(\w+)"/g)) {
    assert.ok(modalTerms.includes(term), `index.html triggers unknown term ${term}`);
    assert.match(index, new RegExp(`href="glossary#${term}"`), `the ${term} trigger has no crawlable link`);
  }
});

test('the static home page links to its sibling pages without JavaScript', () => {
  // The header and footer are injected at runtime; a crawler that does not run scripts must
  // still find the rest of the site from the page body.
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  for (const href of ['glossary', 'fsrs', 'about', 'pricing', 'waitlist']) {
    assert.match(index, new RegExp(`href="${href}"`), `index.html has no static link to ${href}`);
  }
});
