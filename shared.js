/* shared.js — theme, nav active state, lang init, Clerk auth, and language request poll */

// ── Configuration ──────────────────────────────────────────────────────────
// Production origins use the PROD Clerk instance (clerk.fudami.net); previews and
// localhost use the DEV instance. Publishable keys are public, so we pick by host.
// (Kept identical to the app's rule in fudami-app/constants/clerk.ts.)
const CLERK_PK  = ['fudami.net', 'www.fudami.net'].includes(location.hostname)
  ? 'pk_live_Y2xlcmsuZnVkYW1pLm5ldCQ'                              // prod instance
  : 'pk_test_a2luZC1odW1wYmFjay0xOS5jbGVyay5hY2NvdW50cy5kZXYk';   // dev instance
const APP_URL   = 'https://app.fudami.net';
// The Worker serves BOTH the app and the API on one origin — there is no
// separate api subdomain. The landing calls /api/* cross-origin (CORS-allowed).
const API_URL   = 'https://app.fudami.net';

/**
 * Loads ClerkJS from CDN and wires up auth elements:
 * - Navbar Sign In button: triggers clerk.openSignIn
 * - CTA, Hero Start Learning, and Free Plan buttons: trigger clerk.openSignUp
 *
 * If the user is already authenticated, it updates all buttons to display "Open App"
 * (localized via i18n keys) and redirect directly to the app URL.
 */
function initClerk() {
  if (CLERK_PK.includes('YOUR_CLERK')) return; // not configured - skip

  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';
  script.crossOrigin = 'anonymous';
  script.addEventListener('load', async () => {
    try {
      const clerk = new window.Clerk(CLERK_PK);
      await clerk.load();

      // Retrieve current localized labels for dynamic button replacement
      const currentLang = localStorage.getItem('fudami-lang') || 'en';
      const langDict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[currentLang]) || {};
      const openAppText = langDict['nav.openapp'] || 'Open App';
      const signInText = langDict['nav.signin'] || 'Sign In';
      const signUpText = langDict['nav.signup'] || 'Sign Up';

      // 1. Navbar auth button
      const authBtn = document.getElementById('clerk-auth-btn');
      if (authBtn) {
        authBtn.onclick = (e) => { e.preventDefault(); window.location.href = APP_URL; };
      }

      // Mobile Nav auth button
      const mobileAuthBtn = document.getElementById('clerk-mobile-auth-btn');
      if (mobileAuthBtn) {
        mobileAuthBtn.onclick = (e) => { e.preventDefault(); window.location.href = APP_URL; };
      }

      // 2. Hero Start Learning button (Sign Up flow)
      const heroStartBtn = document.getElementById('clerk-hero-signup-btn');
      if (heroStartBtn) {
        heroStartBtn.onclick = (e) => { e.preventDefault(); window.location.href = APP_URL; };
      }

      // 3. Hero Open Web App button (Sign In flow) - Removed in HTML but kept for safety
      const heroOpenBtn = document.getElementById('clerk-hero-signin-btn');
      if (heroOpenBtn) {
        heroOpenBtn.onclick = (e) => { e.preventDefault(); window.location.href = APP_URL; };
      }

      // 4. CTA section button (Sign Up flow)
      const ctaBtn = document.getElementById('clerk-cta-btn');
      if (ctaBtn) {
        ctaBtn.onclick = (e) => { e.preventDefault(); window.location.href = APP_URL; };
      }

      // 5. Pricing Plan Free button (Sign Up flow)
      const pricingFreeBtn = document.getElementById('clerk-pricing-free-btn');
      if (pricingFreeBtn) {
        pricingFreeBtn.onclick = (e) => { e.preventDefault(); window.location.href = APP_URL; };
      }

      // 6. Inline SignUp buttons
      const inlineSignupBtns = document.querySelectorAll('.clerk-signup-trigger');
      inlineSignupBtns.forEach(btn => {
        btn.onclick = (e) => { e.preventDefault(); window.location.href = APP_URL; };
      });

    } catch (err) {
      console.warn('[Clerk] init failed:', err);
    }
  });
  document.head.appendChild(script);
}

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

// ── Language Support Poll ────────────────────────────────────────────────────
const INCOMING_LANGS = {
  es: { name: 'Spanish', emoji: '🇪🇸' },
  fr: { name: 'French', emoji: '🇫🇷' },
  de: { name: 'German', emoji: '🇩🇪' },
  it: { name: 'Italian', emoji: '🇮🇹' },
  ja: { name: 'Japanese', emoji: '🇯🇵' }
};

function initPollModal() {
  const modal = document.getElementById('poll-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('close-poll-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', hidePollModal);
  }

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hidePollModal();
  });

  // Wire up option buttons inside the modal
  const optionBtns = document.querySelectorAll('.poll-option-btn');
  optionBtns.forEach(btn => {
    const langCode = btn.getAttribute('data-lang');
    updatePollButtonVotedState(btn, langCode);
    btn.addEventListener('click', () => {
      submitPollVote(langCode, btn);
    });
  });

  // Wire up navbar trigger
  const trigger = document.getElementById('lang-poll-trigger');
  if (trigger) {
    trigger.addEventListener('click', () => {
      showPollModal();
    });
  }
}

function updatePollButtonVotedState(btn, langCode) {
  if (localStorage.getItem(`fudami-voted-${langCode}`)) {
    btn.disabled = true;
    btn.classList.add('cursor-not-allowed', 'border-matcha-green/30', 'bg-matcha-green/5');
    btn.classList.remove('hover:bg-white/10');
    const icon = btn.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.textContent = 'check';
      icon.classList.remove('opacity-0', 'group-hover:opacity-100');
      icon.classList.add('opacity-100');
    }
  }
}

function showPollModal() {
  const modal = document.getElementById('poll-modal');
  if (!modal) return;

  // Set loading placeholder for counts
  const countEls = modal.querySelectorAll('.poll-count');
  countEls.forEach(el => {
    el.textContent = 'Loading...';
  });

  // Show modal
  modal.classList.remove('opacity-0', 'pointer-events-none');
  const inner = modal.querySelector('.liquid-glass');
  if (inner) inner.classList.remove('translate-y-4');

  // Fetch counts for all languages
  fetch(`${API_URL}/api/request-language`)
    .then(res => res.json())
    .then(data => {
      const counts = data.counts || {};
      const optionBtns = modal.querySelectorAll('.poll-option-btn');
      optionBtns.forEach(btn => {
        const langCode = btn.getAttribute('data-lang');
        const count = counts[langCode] !== undefined ? counts[langCode] : 0;
        const countEl = btn.querySelector('.poll-count');
        if (countEl) {
          countEl.textContent = `${count} request${count !== 1 ? 's' : ''}`;
        }
        updatePollButtonVotedState(btn, langCode);
      });
    })
    .catch(err => {
      console.error('[Poll] failed to fetch counts:', err);
      const optionBtns = modal.querySelectorAll('.poll-option-btn');
      optionBtns.forEach(btn => {
        const countEl = btn.querySelector('.poll-count');
        if (countEl) countEl.textContent = 'N/A';
      });
    });
}

function hidePollModal() {
  const modal = document.getElementById('poll-modal');
  if (!modal) return;

  modal.classList.add('opacity-0', 'pointer-events-none');
  const inner = modal.querySelector('.liquid-glass');
  if (inner) inner.classList.add('translate-y-4');
}

async function submitPollVote(langCode, btn) {
  if (!langCode || !btn) return;

  if (localStorage.getItem(`fudami-voted-${langCode}`)) {
    showToast('You have already requested this language!');
    return;
  }

  // Set loading state on this button
  const countEl = btn.querySelector('.poll-count');
  const originalCountText = countEl ? countEl.textContent : '';
  if (countEl) countEl.textContent = 'Voting...';

  try {
    const res = await fetch(`${API_URL}/api/request-language`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ lang: langCode })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      localStorage.setItem(`fudami-voted-${langCode}`, '1');
      if (countEl) {
        countEl.textContent = `${data.count} request${data.count !== 1 ? 's' : ''}`;
      }
      updatePollButtonVotedState(btn, langCode);
      showToast(`Request submitted for ${INCOMING_LANGS[langCode]?.name || langCode}!`);
    } else if (data.error === 'already_voted') {
      localStorage.setItem(`fudami-voted-${langCode}`, '1');
      updatePollButtonVotedState(btn, langCode);
      showToast('You have already requested this language!');
    } else {
      throw new Error(data.error || 'Server error');
    }
  } catch (err) {
    console.error('[Poll] vote submission failed:', err);
    if (countEl) countEl.textContent = originalCountText;
    showToast('Failed to submit request. Please try again.');
  }
}

// ── DOM Initialization ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initClerk();
  initPollModal();
  if (typeof initLang === 'function') initLang();

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const langSel = document.getElementById('lang-select');
  if (langSel) langSel.addEventListener('change', e => {
    if (typeof setLang === 'function') {
      setLang(e.target.value);
      initClerk();
    }
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
