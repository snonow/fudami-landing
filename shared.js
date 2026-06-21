/* shared.js — theme, nav active state, lang init, Clerk auth, and interactive Mascot */

// ── Clerk configuration ──────────────────────────────────────────────────────
const CLERK_PK  = 'pk_test_a2luZC1odW1wYmFjay0xOS5jbGVyay5hY2NvdW50cy5kZXYk';
const APP_URL   = 'https://fudami-app.arno-wilhelm.dev';

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
        if (clerk.user) {
          authBtn.textContent = openAppText;
          authBtn.onclick = (e) => { e.preventDefault(); window.location.href = APP_URL; };
        } else {
          authBtn.textContent = signInText;
          authBtn.onclick = (e) => {
            e.preventDefault();
            clerk.openSignIn({ afterSignInUrl: APP_URL, afterSignUpUrl: APP_URL });
          };
        }
      }

      // 2. Hero Start Learning button (Sign Up flow)
      const heroStartBtn = document.getElementById('clerk-hero-signup-btn');
      if (heroStartBtn) {
        if (clerk.user) {
          // Change text (preserving inner tags like icons if present)
          const textEl = heroStartBtn.querySelector('.font-label-caps') || heroStartBtn;
          textEl.textContent = openAppText;
          heroStartBtn.onclick = (e) => { e.preventDefault(); window.location.href = APP_URL; };
        } else {
          heroStartBtn.onclick = (e) => {
            e.preventDefault();
            clerk.openSignUp({ afterSignInUrl: APP_URL, afterSignUpUrl: APP_URL });
          };
        }
      }

      // 3. Hero Open Web App button (Sign In flow)
      const heroOpenBtn = document.getElementById('clerk-hero-signin-btn');
      if (heroOpenBtn) {
        if (clerk.user) {
          const textEl = heroOpenBtn.querySelector('.font-label-caps') || heroOpenBtn;
          textEl.textContent = openAppText;
          heroOpenBtn.onclick = (e) => { e.preventDefault(); window.location.href = APP_URL; };
        } else {
          heroOpenBtn.onclick = (e) => {
            e.preventDefault();
            clerk.openSignIn({ afterSignInUrl: APP_URL, afterSignUpUrl: APP_URL });
          };
        }
      }

      // 4. CTA section button (Sign Up flow)
      const ctaBtn = document.getElementById('clerk-cta-btn');
      if (ctaBtn) {
        if (clerk.user) {
          ctaBtn.textContent = openAppText;
          ctaBtn.onclick = (e) => { e.preventDefault(); window.location.href = APP_URL; };
        } else {
          ctaBtn.onclick = (e) => {
            e.preventDefault();
            clerk.openSignUp({ afterSignInUrl: APP_URL, afterSignUpUrl: APP_URL });
          };
        }
      }

      // 5. Pricing Plan Free button (Sign Up flow)
      const pricingFreeBtn = document.getElementById('clerk-pricing-free-btn');
      if (pricingFreeBtn) {
        if (clerk.user) {
          pricingFreeBtn.textContent = openAppText;
          pricingFreeBtn.onclick = (e) => { e.preventDefault(); window.location.href = APP_URL; };
        } else {
          pricingFreeBtn.onclick = (e) => {
            e.preventDefault();
            clerk.openSignUp({ afterSignInUrl: APP_URL, afterSignUpUrl: APP_URL });
          };
        }
      }

      // 6. Inline SignUp buttons (e.g. from the step card)
      const inlineSignupBtns = document.querySelectorAll('.clerk-signup-trigger');
      inlineSignupBtns.forEach(btn => {
        if (clerk.user) {
          btn.textContent = openAppText;
          btn.onclick = (e) => { e.preventDefault(); window.location.href = APP_URL; };
        } else {
          btn.onclick = (e) => {
            e.preventDefault();
            clerk.openSignUp({ afterSignInUrl: APP_URL, afterSignUpUrl: APP_URL });
          };
        }
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

// ── Interactive Mascot (Daruma) ──────────────────────────────────────────────
function initMascot() {
  const mascots = document.querySelectorAll('.daruma-mascot');
  if (mascots.length === 0) return;

  let lastMouseMove = Date.now();
  let currentMood = 'happy'; // 'happy' (default smiling)
  let isBlinking = false;
  let isHovered = false;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Track mouse coordinates for parallax cursor-follow
  window.addEventListener('mousemove', (e) => {
    lastMouseMove = Date.now();
    
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    updateMascotsTransform();
  });

  // Blink logic
  function triggerBlink() {
    if (isBlinking) return;
    isBlinking = true;
    updateMascotsImage();
    
    setTimeout(() => {
      isBlinking = false;
      updateMascotsImage();
      
      // Schedule next random blink
      setTimeout(triggerBlink, 3000 + Math.random() * 4000);
    }, 150);
  }
  
  // Schedule first blink
  setTimeout(triggerBlink, 2000 + Math.random() * 2000);

  // Updates the image source based on mood and blink state
  function updateMascotsImage() {
    mascots.forEach(img => {
      const blinkState = isBlinking ? '-blink' : '';
      img.src = `assets/daruma-${currentMood}${blinkState}-no-bg.png`;
    });
  }

  // Calculates and applies smooth 3D translations and rotations
  function updateMascotsTransform() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    
    const parallaxX = dx / 25; // ±screen/25 parallax
    const parallaxY = dy / 25;
    const rotateY = (dx / window.innerWidth) * 20;
    const rotateX = -(dy / window.innerHeight) * 20;
    
    mascots.forEach(img => {
      const scaleVal = isHovered ? 1.05 : 1.0;
      img.style.transition = 'transform 0.1s ease-out, filter 0.3s ease';
      img.style.transform = `translate3d(${parallaxX}px, ${parallaxY}px, 0) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scaleVal})`;
    });
  }

  // Setup hover bindings
  mascots.forEach(img => {
    // Look for a parent bento card (.group) or fallback to image itself
    const hoverContainer = img.closest('.group') || img;
    
    hoverContainer.addEventListener('mouseenter', () => {
      isHovered = true;
      currentMood = 'happy';
      updateMascotsImage();
      updateMascotsTransform();
    });
    
    hoverContainer.addEventListener('mouseleave', () => {
      isHovered = false;
      currentMood = 'happy';
      updateMascotsImage();
      updateMascotsTransform();
    });
  });

  // Initial transform setup
  updateMascotsTransform();
}

// ── DOM Initialization ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initClerk();
  initMascot();
  if (typeof initLang === 'function') initLang();

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const langSel = document.getElementById('lang-select');
  if (langSel) langSel.addEventListener('change', e => {
    if (typeof setLang === 'function') {
      setLang(e.target.value);
      // Re-initialize clerk to refresh button text translations
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

  // Set up click listeners for the bottom language selector flags bar
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.addEventListener('click', () => {
      const code = el.getAttribute('data-lang');
      if (code === 'en') {
        if (typeof setLang === 'function') {
          setLang(code);
          initClerk(); // Re-initialize clerk to refresh button text translations
        }
      } else {
        const span = el.querySelector('span');
        const langName = span ? span.textContent.replace(' (INCOMING)', '') : 'Language';
        showToast(`${langName} support is incoming!`);
      }
    });
  });
});

// ── Floating Toast Notification ──────────────────────────────────────────────
function showToast(message) {
  // Remove existing toast if any
  const existing = document.getElementById('fudami-toast');
  if (existing) existing.remove();

  // Create toast container
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

  // Trigger reflow
  toast.offsetHeight;

  // Fade and slide in
  toast.classList.remove('opacity-0', 'translate-y-[-10px]');
  toast.classList.add('opacity-100', 'translate-y-0');

  // Fade and slide out after 2.5s
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-[-10px]');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
