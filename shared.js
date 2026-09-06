/* shared.js - theme, nav active state, wiki modal. */

// No Clerk here, deliberately. This page used to load @clerk/clerk-js from a
// CDN and then never call it: no openSignIn, no session check, nothing but
// `.load()`. All it did afterwards was re-bind click handlers that the HTML
// already carries inline, three of them to ids that no longer exist in any
// page. Net effect was an unpinned third-party script on the critical path,
// and CTAs that stayed dead until jsDelivr answered. The buttons navigate to
// the app via their own onclick attributes and work with JS disabled.
// If sign-in state ever needs to show on this page, that is a feature to build
// then - not an SDK to keep warm.

// ── Theme management ─────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('fudami-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = saved ? saved === 'dark' : prefersDark;
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.classList.toggle('light', !dark);
  _updateThemeIcon();
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', !isDark);
  document.documentElement.classList.toggle('light', isDark);
  localStorage.setItem('fudami-theme', isDark ? 'light' : 'dark');
  _updateThemeIcon();
}

function _updateThemeIcon() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const isDark = document.documentElement.classList.contains('dark');
  btn.innerHTML = `<span class="material-symbols-outlined text-[20px]">${isDark ? 'light_mode' : 'dark_mode'}</span>`;
  btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
}

// ── Navigation ───────────────────────────────────────────────────────────────
function initNav() {
  const path = location.pathname;
  document.querySelectorAll('[data-nav]').forEach(el => {
    const page = el.getAttribute('data-nav');
    const isActive =
      (page === 'index' && (path === '/' || path.endsWith('/') || path.endsWith('index.html'))) ||
      (page !== 'index' && path.endsWith(page + '.html'));
    if (isActive) {
      el.classList.add('text-hanko', 'font-bold');
      el.classList.remove('text-sumi-muted');
    }
  });
}

// ── Language Support Removed ───────────────────────────────────────────────────

// ── DOM Initialization ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initWikiModal();
  if (typeof initLang === 'function') initLang();

  // Prevent FOUT on app mockup
  document.fonts.ready.then(() => {
    const mockup = document.getElementById('app-mockup');
    if (mockup) mockup.classList.remove('opacity-0');
  });

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const langSel = document.getElementById('lang-select');
  if (langSel) langSel.addEventListener('change', e => {
    if (typeof setLang === 'function') setLang(e.target.value);
  });

  // Sync with OS preferences
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('fudami-theme')) {
      document.documentElement.classList.toggle('dark', e.matches);
      document.documentElement.classList.toggle('light', !e.matches);
      _updateThemeIcon();
    }
  });
});

// ── Floating Toast Notification ──────────────────────────────────────────────
function showToast(message) {
  const existing = document.getElementById('fudami-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'fudami-toast';
  toast.className = 'fixed top-24 left-1/2 -translate-x-1/2 z-50 liquid-glass border border-hanko-red/30 text-washi-light px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 pointer-events-none transition-all duration-300 opacity-0 translate-y-[-10px]';
  toast.style.backdropFilter = 'blur(16px)';
  toast.style.webkitBackdropFilter = 'blur(16px)';
  
  toast.innerHTML = `
    <span class="material-symbols-outlined text-hanko-red text-xl animate-pulse">info</span>
    <span class="font-bold text-sm tracking-wide uppercase">${message}</span>
  `;

  document.body.appendChild(toast);
  toast.offsetHeight;

  toast.classList.remove('opacity-0', 'translate-y-[-10px]');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-[-10px]');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

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
    if (descEl) descEl.innerHTML = data.desc;

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
