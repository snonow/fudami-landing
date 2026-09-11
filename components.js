/* components.js — landing's site chrome, as configuration.
 *
 * The markup moved to fudami-design (vendor/fudami-design.browser.js), which builds DOM
 * nodes instead of concatenating values into `header.innerHTML`. jisho renders from the
 * same code: that is the whole point of the package, since the two sites' copies had
 * already forked.
 *
 * What stays here is landing's own: its pages, its footer, and the wiki modal.
 *
 * The page API is unchanged - injectHeader(active), injectFooter(), injectWikiModal(),
 * initScrollReveal() - so the HTML only gained one <script> tag.
 */

const NAV = [
  { id: 'index', href: 'index.html', label: 'Home', i18n: 'nav.home' },
  { id: 'about', href: 'about.html', label: 'About', i18n: 'nav.about' },
  { id: 'pricing', href: 'pricing.html', label: 'Pricing', i18n: 'nav.pricing' },
];

function injectHeader(activePage) {
  const existing = document.getElementById('site-header');
  if (existing) existing.remove();

  document.body.prepend(
    FudamiDesign.createHeader({
      active: activePage,
      nav: NAV,
      brandHref: 'index.html',
      cta: { label: 'Join Waitlist', href: 'https://app.fudami.net' },
    }),
  );
}

function injectFooter() {
  const existing = document.getElementById('site-footer');
  if (existing) existing.remove();

  document.body.appendChild(
    FudamiDesign.createFooter({
      brandHref: 'index.html',
      tagline: 'Memory science with the pull of a game. Japanese that stays learned.',
      columns: [
        { title: 'Product', links: [{ label: 'Pricing', href: 'pricing.html', i18n: 'nav.pricing' }] },
        {
          title: 'Company',
          links: [
            { label: 'About', href: 'about.html', i18n: 'nav.about' },
            { label: 'GitHub', href: 'https://github.com/snonow/fudami-landing', external: true },
          ],
        },
        {
          title: 'Legal',
          // Terms used to be href="#", a link that goes nowhere. Until the page exists it
          // is a label, not a destination.
          links: [{ label: 'Privacy', href: 'privacy.html' }, { label: 'Terms' }],
        },
      ],
      copyright: '\u00a9 2026 fudami. All rights reserved.',
    }),
  );
}

const initScrollReveal = FudamiDesign.initScrollReveal;

/** The wiki definition modal. Landing-only: jisho has its own vocabulary UI. */
function injectWikiModal() {
  const { el } = FudamiDesign;

  const modal = el('div', {
    className:
      'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md ' +
      'opacity-0 pointer-events-none transition-all duration-300',
    // aria-labelledby, not just role=dialog: a dialog with no accessible name is what
    // Lighthouse's aria-dialog-name audit fails on, and what a screen reader announces as
    // nothing at all.
    attrs: { id: 'wiki-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'wiki-modal-title' },
  });

  const panel = el('div', {
    className:
      'bg-charcoal-dark border border-white/10 rounded-[2rem] max-w-[320px] w-full p-6 shadow-2xl ' +
      'relative translate-y-4 transition-transform duration-300 overflow-hidden',
  });

  const close = el('button', {
    className:
      'absolute top-4 right-4 text-washi-light/60 hover:text-washi-light transition-colors w-8 h-8 ' +
      'rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center z-10',
    attrs: { id: 'close-wiki-modal', type: 'button', 'aria-label': 'Close' },
  });
  const closeIcon = el('span', { className: 'material-symbols-outlined text-lg', text: 'close' });
  closeIcon.style.fontVariationSettings = "'wght' 700";
  close.appendChild(closeIcon);

  const body = el('div', { className: 'flex flex-col gap-2 relative z-10' });
  const head = el('div', { className: 'flex items-center gap-3 mb-2' });
  const iconWrap = el('div', {
    className: 'w-12 h-12 rounded-full flex items-center justify-center bg-white/5 shrink-0',
    attrs: { id: 'wiki-modal-icon-wrapper' },
  });
  iconWrap.appendChild(
    el('span', { className: "text-2xl font-bold font-['M_PLUS_Rounded_1c']", attrs: { id: 'wiki-modal-symbol' } }),
  );
  head.appendChild(iconWrap);
  head.appendChild(
    el('h3', {
      className: "text-2xl font-extrabold capitalize font-['Plus_Jakarta_Sans']",
      attrs: { id: 'wiki-modal-title' },
    }),
  );
  body.appendChild(head);
  body.appendChild(
    el('p', { className: 'text-sm text-washi-light/90 leading-relaxed', attrs: { id: 'wiki-modal-desc' } }),
  );

  panel.append(close, body);
  modal.appendChild(panel);
  document.body.appendChild(modal);
}
