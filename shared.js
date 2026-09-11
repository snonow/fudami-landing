/* shared.js — landing's own behaviour: the wiki modal, and the page's init.
 *
 * Theme, scroll reveal and toast come from fudami-design (vendor/fudami-design.browser.js)
 * and are re-exported here under their old names, so nothing that calls them changed.
 */

// No Clerk here, deliberately. This page used to load @clerk/clerk-js from a
// CDN and then never call it: no openSignIn, no session check, nothing but
// `.load()`. All it did afterwards was re-bind click handlers that the HTML
// already carries inline, three of them to ids that no longer exist in any
// page. Net effect was an unpinned third-party script on the critical path,
// and CTAs that stayed dead until jsDelivr answered. The buttons navigate to
// the app via their own onclick attributes and work with JS disabled.
// If sign-in state ever needs to show on this page, that is a feature to build
// then - not an SDK to keep warm.

// ── Theme, reveal, toast: fudami-design ──────────────────────────────────────
// One implementation, shared with jisho. initTheme wires #theme-toggle itself and follows
// the OS only while the visitor has never chosen; showToast puts its message in with
// textContent, where this file used to interpolate it into markup.
const initTheme = FudamiDesign.initTheme;
const toggleTheme = FudamiDesign.toggleTheme;
const showToast = FudamiDesign.showToast;

// ── DOM Initialization ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initWikiModal();
  if (typeof initLang === 'function') initLang();

  // Prevent FOUT on app mockup. Guarded: document.fonts is absent in older browsers, and an
  // exception here would take the rest of this handler with it.
  if (!document.fonts) return;
  document.fonts.ready.then(() => {
    const mockup = document.getElementById('app-mockup');
    if (mockup) mockup.classList.remove('opacity-0');
  });
});

// ── Wiki Modal ───────────────────────────────────────────────────────────────
const WIKI_DATA = {
  kana: {
    title: 'Kana',
    desc: 'Japanese phonetic characters used for spelling and grammar. Mastering them is the first step.',
    symbol: 'あ',
    colorClass: 'text-hanko-red'
  },
  kanji: {
    title: 'Kanji',
    desc: 'Complex characters representing entire concepts or roots of words. They make reading Japanese fast and clear.',
    symbol: '水',
    colorClass: 'text-matcha-green'
  }
};

function initWikiModal() {
  const modal = document.getElementById('wiki-modal');
  if (!modal) return;

  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideWikiModal();
  });

  // Attach to trigger words and close button via delegation
  document.body.addEventListener('click', (e) => {
    // Close button
    if (e.target.closest('#close-wiki-modal')) {
      hideWikiModal();
      return;
    }

    const trigger = e.target.closest('[data-wiki-trigger]');
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      const term = trigger.getAttribute('data-wiki-trigger');
      showWikiModal(term);
    }
  });
}

function showWikiModal(term) {
  document.fonts.ready.then(() => {
    const modal = document.getElementById('wiki-modal');
    if (!modal) return;

    const data = WIKI_DATA[term];
    if (!data) return;

    const titleEl = document.getElementById('wiki-modal-title');
    if (titleEl) {
      titleEl.textContent = data.title;
      titleEl.className = `text-2xl font-extrabold capitalize font-['Plus_Jakarta_Sans'] ${data.colorClass}`;
    }
    
    const descEl = document.getElementById('wiki-modal-desc');
    if (descEl) descEl.textContent = data.desc;  // plain sentences; markup here would be a sink

    const symbolEl = document.getElementById('wiki-modal-symbol');
    if (symbolEl) {
      symbolEl.textContent = data.symbol;
      symbolEl.className = `text-2xl font-bold font-['M_PLUS_Rounded_1c'] ${data.colorClass}`;
    }

    modal.classList.remove('opacity-0', 'pointer-events-none');
    const inner = modal.querySelector('.bg-charcoal-dark');
    if (inner) inner.classList.remove('translate-y-4');
  });
}

function hideWikiModal() {
  const modal = document.getElementById('wiki-modal');
  if (!modal) return;

  modal.classList.add('opacity-0', 'pointer-events-none');
  const inner = modal.querySelector('.bg-charcoal-dark');
  if (inner) inner.classList.add('translate-y-4');
}
