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

const ROOT = path.join(__dirname, '..');
const PAGES = ['index.html', 'about.html', 'pricing.html', 'privacy.html', 'credits.html'];
const APP_URL = 'app.fudami.net';

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

  for (const script of ['i18n.js', 'components.js', 'shared.js']) {
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

    assert.ok(doc.getElementById('site-header'), 'header was not injected');
    assert.ok(doc.getElementById('theme-toggle'), 'theme toggle missing from header');
    assert.ok(
      doc.documentElement.classList.contains('dark') || doc.documentElement.classList.contains('light'),
      'initTheme() set neither theme class',
    );

    // Every call to action navigates by its own onclick attribute, so the page
    // works with JS disabled and does not wait on any third-party script.
    const ctas = [...doc.querySelectorAll('[id^="clerk-"], .clerk-signup-trigger')];
    assert.ok(ctas.length > 0, 'page has no call to action at all');
    for (const cta of ctas) {
      assert.match(
        cta.getAttribute('onclick') ?? '',
        new RegExp(APP_URL),
        `CTA ${cta.id || cta.className} does not navigate to the app`,
      );
    }
  });
}

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
