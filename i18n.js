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
    'banner.dev': 'fudami is currently under active development. <span class="text-matcha-green ml-1">Available soon!</span>',
    'hero.title': 'Learn Japanese.<br/><span class="text-hanko-red">Remember it.</span>',
    'hero.subtitle': 'Bridging high-energy gamification with traditional aesthetic principles. Learn Kanji in a meditative workspace designed for deep retention.',
    'hero.cta.start': 'Start Learning',
    'hero.cta.signin': 'I already have an account',
    'hero.preview.status': 'Coming Soon 2026',
    'fudamiway.title': 'The fudami Way',
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
    'credits.item3': 'Typography utilizes Google Fonts: Plus Jakarta Sans for the landing page and M PLUS Rounded 1c for the app UI.',
    'credits.item4': 'Design system inspired by principles of Zen simplicity and playful modern UI patterns.',
    'footer.copy': '© 2026 fudami. All rights reserved.',
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

  // Update standard language dropdown selector if it exists on other pages
  const sel = document.getElementById('lang-select');
  if (sel) sel.value = lang;
}

function initLang() {
  setLang('en');
}
