/* components.js — Shared UI components for fudami landing pages
   Provides: injectHeader(), injectFooter(), injectPollModal(), initScrollReveal() */

/**
 * Injects the shared header/navbar into the page.
 * @param {string} activePage - Current page: 'index', 'about', or 'pricing'
 */
function injectHeader(activePage) {
  const header = document.createElement('header');
  header.id = 'site-header';
  header.className = 'fixed top-0 w-full z-50 chrome-glass';

  const navItems = [
    { id: 'index',    href: 'index.html',           label: 'Home',     i18n: 'nav.home' },
    { id: 'about',    href: 'about.html',            label: 'About',    i18n: 'nav.about' },
    { id: 'pricing',  href: 'pricing.html',          label: 'Pricing',  i18n: 'nav.pricing' },
  ];

  const desktopLinks = navItems.map(function(item) {
    var isActive = item.id === activePage;
    var cls = isActive
      ? 'text-washi-light border-b-2 border-hanko-red pb-0.5'
      : 'text-washi-light/60 hover:text-washi-light';
    return '<a class="' + cls + ' transition-colors duration-200 text-sm font-medium no-underline" href="' + item.href + '" data-i18n="' + item.i18n + '">' + item.label + '</a>';
  }).join('');

  var mobileLinks = navItems.map(function(item) {
    var isActive = item.id === activePage;
    var cls = isActive
      ? 'text-hanko-red bg-hanko-red/10'
      : 'text-washi-light/80 hover:text-washi-light hover:bg-white/5';
    return '<a class="py-3 px-4 rounded-xl text-sm font-medium no-underline transition-colors ' + cls + '" href="' + item.href + '" data-i18n="' + item.i18n + '">' + item.label + '</a>';
  }).join('');

  header.innerHTML =
    '<div class="flex justify-between items-center w-full px-6 md:px-8 max-w-[1200px] mx-auto h-16">' +
      '<!-- Brand -->' +
      '<a class="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity no-underline flex items-center gap-2 text-washi-light" href="index.html">' +
        '<span class="font-[\'Plus_Jakarta_Sans\']">fudami</span>' +
      '</a>' +
      '<!-- Desktop Nav -->' +
      '<nav class="hidden md:flex items-center gap-8">' +
        desktopLinks +
      '</nav>' +
      '<!-- Actions -->' +
      '<div class="flex items-center gap-3">' +
        '<button id="theme-toggle" class="text-washi-light/70 hover:text-washi-light hover:scale-105 transition-all duration-200 w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5" aria-label="Toggle theme">' +
          '<span class="material-symbols-outlined text-[18px]">dark_mode</span>' +
        '</button>' +
        '<button id="clerk-auth-btn" onclick="window.location.href=\'https://app.fudami.net\'" class="btn-hanko px-5 py-2 rounded-xl text-xs uppercase tracking-widest hidden md:inline-flex items-center gap-1.5">' +
          'Join Waitlist' +
        '</button>' +
        '<!-- Mobile menu -->' +
        '<button id="mobile-menu-toggle" class="md:hidden text-washi-light/70 hover:text-washi-light w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5" aria-label="Menu">' +
          '<span class="material-symbols-outlined text-[20px]">menu</span>' +
        '</button>' +
      '</div>' +
    '</div>' +
    '<!-- Mobile Nav Drawer -->' +
    '<div id="mobile-nav" class="md:hidden hidden border-t border-white/5" style="background:rgba(var(--surface-rgb),0.95);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px)">' +
      '<nav class="flex flex-col px-6 py-4 gap-1">' +
        mobileLinks +
        '<button id="clerk-mobile-auth-btn" onclick="window.location.href=\'https://app.fudami.net\'" class="btn-hanko mt-3 py-3 rounded-xl text-xs uppercase tracking-widest w-full">Join Waitlist</button>' +
      '</nav>' +
    '</div>';

  document.body.prepend(header);

  // Wire mobile toggle
  var menuToggle = document.getElementById('mobile-menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function() {
      var isOpen = !mobileNav.classList.contains('hidden');
      mobileNav.classList.toggle('hidden', isOpen);
      var icon = menuToggle.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = isOpen ? 'menu' : 'close';
    });
  }
}


/**
 * Injects the shared footer into the page.
 */
function injectFooter() {
  var footer = document.createElement('footer');
  footer.id = 'site-footer';
  footer.className = 'w-full py-12 mt-auto border-t border-white/5 relative z-10';
  footer.style.backgroundColor = 'rgb(var(--surface-rgb))';

  footer.innerHTML =
    '<div class="max-w-[1200px] mx-auto px-6 md:px-8">' +
      '<div class="flex flex-col md:flex-row justify-between items-start gap-8">' +
        '<!-- Brand -->' +
        '<div class="flex flex-col gap-3">' +
          '<a href="index.html" class="inline-block no-underline">' +
            '<span class="text-lg font-bold text-washi-light font-[\'Plus_Jakarta_Sans\']">fudami</span>' +
          '</a>' +
          '<p class="text-sm text-washi-light/50 max-w-[280px]" data-i18n="footer.tagline">Memory science with the pull of a game. Japanese that stays learned.</p>' +
        '</div>' +
        '<!-- Links -->' +
        '<div class="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-10 md:flex md:gap-16">' +
          '<div class="flex flex-col gap-2">' +
            '<span class="text-xs font-bold uppercase tracking-widest text-washi-light/40 mb-1">Product</span>' +
            '<a class="text-sm text-washi-light/60 hover:text-washi-light transition-colors no-underline" href="pricing.html" data-i18n="nav.pricing">Pricing</a>' +
          '</div>' +
          '<div class="flex flex-col gap-2">' +
            '<span class="text-xs font-bold uppercase tracking-widest text-washi-light/40 mb-1">Company</span>' +
            '<a class="text-sm text-washi-light/60 hover:text-washi-light transition-colors no-underline" href="about.html" data-i18n="nav.about">About</a>' +
            '<a class="text-sm text-washi-light/60 hover:text-washi-light transition-colors no-underline" href="https://github.com/snonow/fudami-landing">GitHub</a>' +
          '</div>' +
          '<div class="flex flex-col gap-2">' +
            '<span class="text-xs font-bold uppercase tracking-widest text-washi-light/40 mb-1">Legal</span>' +
            '<a class="text-sm text-washi-light/60 hover:text-washi-light transition-colors no-underline" href="privacy.html">Privacy</a>' +
            '<a class="text-sm text-washi-light/60 hover:text-washi-light transition-colors no-underline" href="#">Terms</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<!-- Bottom -->' +
      '<div class="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3">' +
        '<span class="text-xs text-washi-light/40" data-i18n="footer.copy">\u00a9 2026 fudami. All rights reserved.</span>' +
        '<div class="flex items-center gap-1 text-xs text-washi-light/30">' +
          '<span>Crafted with</span>' +
          '<span class="text-hanko-red">\u2665</span>' +
          '<span>for Japanese learners</span>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.body.appendChild(footer);
}


/**
 * Initializes scroll-based section reveal animations.
 * Call after DOM is ready and sections are in place.
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    document.querySelectorAll('.section-fade-in').forEach(function(el) {
      el.classList.add('section-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.section-fade-in').forEach(function(el) {
    observer.observe(el);
  });
}


/**
 * Injects the wiki definition modal.
 */
function injectWikiModal() {
  var modal = document.createElement('div');
  modal.id = 'wiki-modal';
  modal.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md opacity-0 pointer-events-none transition-all duration-300';

  modal.innerHTML =
    '<div class="bg-charcoal-dark border border-white/10 rounded-[2rem] max-w-[320px] w-full p-6 shadow-2xl relative translate-y-4 transition-transform duration-300 overflow-hidden">' +
      '<button id="close-wiki-modal" class="absolute top-4 right-4 text-washi-light/60 hover:text-washi-light transition-colors w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center z-10">' +
        '<span class="material-symbols-outlined text-lg" style="font-variation-settings:\'wght\' 700">close</span>' +
      '</button>' +
      '<div class="flex flex-col gap-2 relative z-10">' +
        '<div class="flex items-center gap-3 mb-2">' +
          '<div id="wiki-modal-icon-wrapper" class="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 shrink-0">' +
            '<span id="wiki-modal-symbol" class="text-2xl font-bold font-[\'M_PLUS_Rounded_1c\']"></span>' +
          '</div>' +
          '<h3 id="wiki-modal-title" class="text-2xl font-extrabold capitalize font-[\'Plus_Jakarta_Sans\']"></h3>' +
        '</div>' +
        '<p id="wiki-modal-desc" class="text-sm text-washi-light/90 leading-relaxed"></p>' +
      '</div>' +
    '</div>';

  document.body.appendChild(modal);
}
