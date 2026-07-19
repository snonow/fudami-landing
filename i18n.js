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
    'banner.dev': '<span class="w-2 h-2 rounded-full bg-hanko-red animate-pulse"></span> <span class="font-[\'Plus_Jakarta_Sans\'] font-bold">fudami</span> is currently under active development. <span class="text-hanko-red ml-1">Available soon!</span>',
    'hero.title': 'Make Japanese<br/><span class="text-hanko-red">impossible to forget.</span>',
    'hero.subtitle': 'The proven <strong>memory science</strong> of <strong style="color: #0095ff;">Anki</strong> meets the <strong>engaging flow</strong> of <strong style="color: #58cc02;">Duolingo</strong>, with none of the baggage. <span class="font-[\'Plus_Jakarta_Sans\'] font-bold">fudami</span> <strong>perfectly times</strong> every <button data-wiki-trigger="kana" class="inline border-b border-dashed border-washi-light/50 hover:border-washi-light hover:text-washi-light transition-colors focus:outline-none bg-transparent p-0 m-0 cursor-pointer">kana</button>, <button data-wiki-trigger="kanji" class="inline border-b border-dashed border-washi-light/50 hover:border-washi-light hover:text-washi-light transition-colors focus:outline-none bg-transparent p-0 m-0 cursor-pointer">kanji</button>, and word right before you forget them, ensuring your knowledge <strong>stays locked in</strong>.',
    'hero.cta.start': 'Start Learning',
    'hero.cta.signin': 'I already have an account',
    'hero.preview.status': 'Coming Soon 2026',
    'fudamiway.title': 'The <span class="font-[\'Plus_Jakarta_Sans\'] font-bold">fudami</span> Way',
    'fudamiway.subtitle': 'Three pillars make Japanese stick — memory science, honest game design, and one connected graph. No gimmicks.',
    'fudamiway.card1.title': 'Spaced Repetition',
    'fudamiway.card1.desc': 'FSRS — the state-of-the-art scheduling algorithm — plans each review for the moment just before you\'d forget. Maximum retention, minimum reviews.',
    'fudamiway.card2.title': 'A Game That Respects You',
    'fudamiway.card2.desc': 'Streaks, daily goals and quiet celebrations pull you back every day — and XP is always tied to a real goal like JLPT N5, never a meaningless leaderboard.',
    'fudamiway.card3.title': 'One Living Graph',
    'fudamiway.card3.desc': 'Kana, radicals, kanji, vocabulary and grammar form one connected graph — not isolated decks. Mastering each node strengthens its neighbours.',
    'efficacy.title': 'Visualize Your Mastery',
    'efficacy.desc': 'Track your progress across JLPT levels, vocabulary themes, and grammar structures with our dynamic knowledge graph. See exactly where you excel and where to focus next.',
    'credits.title': 'Studies & Credits',
    'credits.desc': '<span class="font-[\'Plus_Jakarta_Sans\'] font-bold">fudami</span> stands on the shoulders of giants. We are deeply grateful to the researchers and open-source projects that make this platform possible.',
    'credits.item1': 'Spaced Repetition Algorithms based on research by Ebbinghaus and modern SM-2 variations.',
    'credits.item2': 'Kanji stroke order data provided by KanjiVG.',
    'credits.item3': 'Typography utilizes Google Fonts: Plus Jakarta Sans for the landing page and M PLUS Rounded 1c for the app UI.',
    'credits.item4': 'Design system inspired by principles of Zen simplicity and playful modern UI patterns.',
    'footer.tagline': 'Memory science with the pull of a game. Japanese that stays learned.',
    'footer.copy': '© 2026 <span class="font-[\'Plus_Jakarta_Sans\'] font-bold">fudami</span>. All rights reserved.',
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
