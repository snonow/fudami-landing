/* shared.js — theme, nav active state, lang init, Clerk auth (loaded on all pages) */

// ── Clerk configuration ──────────────────────────────────────────────────────
// Replace with your Clerk publishable key (safe to expose in frontend code).
// Get it from https://dashboard.clerk.com → API Keys → Publishable key.
const CLERK_PK  = 'pk_live_YOUR_CLERK_PUBLISHABLE_KEY';
const APP_URL   = 'https://fudami.pages.dev';

/**
 * Loads ClerkJS from CDN, then wires up the #clerk-auth-btn nav button on the
 * current page. Opens Clerk's sign-in modal inline — the user never has to
 * navigate away from the landing page to authenticate. After a successful
 * sign-in or sign-up Clerk redirects straight to the web app.
 *
 * If the user is already authenticated the button changes to "Open App" and
 * links directly to the web app (no extra click needed).
 */
function initClerk() {
  if (CLERK_PK.includes('YOUR_CLERK')) return; // not yet configured — skip silently

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';
  script.crossOrigin = 'anonymous';
  script.addEventListener('load', async () => {
    try {
      const clerk = new window.Clerk(CLERK_PK);
      await clerk.load();

      const btn = document.getElementById('clerk-auth-btn');
      if (!btn) return;

      if (clerk.user) {
        // Already signed in: bypass the landing and go straight to the app.
        btn.textContent = 'Open App';
        btn.addEventListener('click', () => { window.location.href = APP_URL; });
      } else {
        btn.addEventListener('click', () => {
          clerk.openSignIn({
            afterSignInUrl:  APP_URL,
            afterSignUpUrl:  APP_URL,
          });
        });
      }
    } catch (err) {
      // Non-fatal — the rest of the page works fine without auth.
      console.warn('[Clerk] init failed:', err);
    }
  });
  document.head.appendChild(script);
}
// ────────────────────────────────────────────────────────────────────────────

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

function initNav() {
  const path = location.pathname;
  document.querySelectorAll('[data-nav]').forEach(el => {
    const page = el.getAttribute('data-nav');
    const isActive =
      (page === 'index' && (path === '/' || path.endsWith('/') || path.endsWith('index.html'))) ||
      (page !== 'index' && path.endsWith(page + '.html'));
    if (isActive) {
      el.classList.add('text-hanko-red', 'font-bold');
      el.classList.remove('text-sumi-ink-muted');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initClerk();
  if (typeof initLang === 'function') initLang();

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const langSel = document.getElementById('lang-select');
  if (langSel) langSel.addEventListener('change', e => {
    if (typeof setLang === 'function') setLang(e.target.value);
  });

  // Sync with OS theme changes (only if user hasn't manually set)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('fudami-theme')) {
      document.documentElement.classList.toggle('dark', e.matches);
      document.documentElement.classList.toggle('light', !e.matches);
      _updateThemeIcon();
    }
  });
});
