# fudami — landing page

Marketing site for the fudami platform. Static HTML, no build step, no framework.

---

## Philosophy

fudami exists because the best Japanese-learning tools are on opposite ends of a spectrum:

- **Anki** — world-class spaced repetition, punishing UX. Shows you debt (353 cards due) instead of progress.
- **Duolingo** — polished, game-like UX, shallow memory science. Feels good but doesn't build retention.

fudami is the middle path: **Anki's FSRS scheduling depth running inside Duolingo's game-like shell**. The landing page's job is to communicate that contrast quickly and get curious visitors to open the app before they lose momentum.

Every line on this site should reinforce that positioning. If it doesn't, cut it.

---

## Site structure

```
index.html      Hero, philosophy, FSRS deep-dive, roadmap, bottom CTA
pricing.html    Pricing tiers
about.html      Mission and team

shared.js       Theme (dark/light), nav active state, Clerk auth init
i18n.js         String map for EN / FR / JA / ES / DE

assets/         Daruma mascot PNGs (neutral, happy, sad — open + blink states)
                Favicons (dark / light)

_headers        Cloudflare Pages security and cache headers
_redirects      Cloudflare Pages URL rewrites (clean canonical paths)
```

---

## Local development

No build step. Open any `.html` directly in a browser. For accurate font and script loading:

```bash
npx serve .
# → http://localhost:3000
```

---

## Deployment

Automated on every push to `main` via **Cloudflare Pages** (GitHub Actions).

### Required GitHub secrets

| Secret | Where to get it |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create Token (Pages:Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → right sidebar → Account ID |

The Cloudflare Pages project (`fudami-landing`) must exist in your dashboard before the first deploy. Create it once manually via **Workers & Pages → Create application → Pages → Connect to Git**, then all subsequent deploys are fully automated.

---

## Clerk sign-in

The nav Sign In button uses **ClerkJS** (CDN, vanilla JS) to open Clerk's authentication modal as an overlay — the visitor authenticates without leaving the landing page. After sign-in or sign-up they are redirected straight to the web app.

If the visitor is already authenticated, the button changes to "Open App" and navigates directly.

**To configure:** replace `CLERK_PK` in `shared.js` with your Clerk publishable key:

```js
// shared.js (line 5)
const CLERK_PK = 'pk_live_YOUR_CLERK_PUBLISHABLE_KEY';
```

The publishable key is safe to commit — it is designed to be public.  
Get it from [dashboard.clerk.com](https://dashboard.clerk.com) → API Keys → Publishable key.

---

## Platform context

This is Tier 1 of the fudami platform (the marketing funnel). For the full architecture see `/PLATFORM.md`.

| Repo | Host | Role |
| --- | --- | --- |
| `fudami-landing` (this) | Cloudflare Pages | Marketing & SEO |
| `fudami-front` | Cloudflare Pages | The app (React Native / Expo web) |
| `fudami-cloud` | Cloudflare Workers | Auth, billing, encrypted content packs |
| `fudami-studio` | Local / offline | Content factory (private pipeline) |

---

© 2026 fudami. All rights reserved.
