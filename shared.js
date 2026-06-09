/* shared.js — theme, nav active state, lang init (loaded on all pages) */

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
