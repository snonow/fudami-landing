/* i18n.js — fudami landing translations (EN support active, others incoming) */

const TRANSLATIONS = {
  en: {
    'nav.approach': 'Approach',
    'nav.methodology': 'Methodology',
    'nav.pricing': 'Pricing',
    'nav.about': 'About',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.getstarted': 'Get Started',
    'nav.openapp': 'Open App',
    'banner.dev': 'Fudami is currently under active development. <span class="text-matcha-green ml-1">Available soon!</span>',
    'hero.title': 'Master Japanese <span class="flag-bubble ml-2 align-middle text-sm font-normal">🇯🇵</span><br/>with <span class="text-matcha-green">Zen focus.</span>',
    'hero.subtitle': 'Bridging high-energy gamification with traditional aesthetic principles. Learn Kanji in a meditative workspace designed for deep retention.',
    'hero.cta.start': 'Start Learning',
    'hero.cta.signin': 'I already have an account',
    'hero.preview.status': 'Coming Soon 2026',
    'fudamiway.title': 'The Fudami Way',
    'fudamiway.card1.title': 'Spaced Repetition',
    'fudamiway.card1.desc': 'Our intelligent algorithm schedules reviews exactly when you are about to forget, maximizing long-term retention.',
    'fudamiway.card2.title': 'Serene Gamification',
    'fudamiway.card2.desc': 'Stay motivated with subtle, celebratory feedback loops and streaks that don\'t rely on sensory overload.',
    'fudamiway.card3.title': 'Deep Context',
    'fudamiway.card3.desc': 'Learn Kanji through radicals, mnemonics, and real-world vocabulary to build a true understanding of the language.',
    'efficacy.title': 'Visualize Your Mastery',
    'efficacy.desc': 'Track your progress across JLPT levels, vocabulary themes, and grammar structures with our dynamic knowledge graph. See exactly where you excel and where to focus next.',
    'credits.title': 'Studies & Credits',
    'credits.item1': 'Spaced Repetition Algorithms based on research by Ebbinghaus and modern SM-2 variations.',
    'credits.item2': 'Kanji stroke order data provided by KanjiVG.',
    'credits.item3': 'Typography utilizes Google Fonts: M PLUS Rounded 1c for a friendly, legible aesthetic.',
    'credits.item4': 'Design system inspired by principles of Zen simplicity and playful modern UI patterns.',
    'footer.copy': '© 2026 Fudami. Master Kanji with Zen focus.',
  }
};

const SUPPORTED_LANGS = ['en'];

function setLang(code) {
  const lang = SUPPORTED_LANGS.includes(code) ? code : 'en';
  const t = TRANSLATIONS[lang];
  document.documentElement.lang = 'en';
  localStorage.setItem('fudami-lang', 'en');

  // Plain text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // innerHTML nodes (contain styled spans / HTML tags)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // Update language selector active states in the bottom bar (English is active)
  document.querySelectorAll('[data-lang]').forEach(el => {
    const container = el.querySelector('.w-14.h-14');
    const text = el.querySelector('span');
    const itemLang = el.getAttribute('data-lang');
    
    if (itemLang === 'en') {
      if (container) {
        container.className = "w-14 h-14 rounded-full bg-surface-container-high border-[4px] border-matcha-green overflow-hidden relative shadow-[0_4px_12px_rgba(46,202,127,0.3)] scale-110 -translate-y-1 transition-all duration-200";
      }
      if (text) {
        text.className = "text-[11px] font-label-caps text-matcha-green font-extrabold mt-1 transition-colors";
      }
    } else {
      if (container) {
        container.className = "w-14 h-14 rounded-full bg-surface-container-high border-[4px] border-surface-container-highest group-hover:border-hanko-red transition-all duration-200 overflow-hidden relative shadow-md group-hover:-translate-y-1 transition-all duration-200";
      }
      if (text) {
        text.className = "text-[11px] font-label-caps text-on-surface-variant group-hover:text-hanko-red transition-colors font-bold transition-colors";
      }
    }
  });

  // Update standard language dropdown selector if it exists on other pages
  const sel = document.getElementById('lang-select');
  if (sel) sel.value = lang;
}

function initLang() {
  setLang('en');
}
