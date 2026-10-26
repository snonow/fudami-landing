<p align="center">
  <img src="public/assets/favicon.png" alt="fudami" width="96" height="96" />
</p>

<h1 align="center">fudami — Landing Page</h1>

<p align="center">
  <strong>Marketing site for fudami, the Japanese learning platform that combines spaced repetition science with calm, focused design.</strong>
</p>

<p align="center">
  <a href="https://github.com/snonow/fudami-landing/actions/workflows/ci.yml">
    <img src="https://github.com/snonow/fudami-landing/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <a href="https://fudami.net">
    <img src="https://img.shields.io/website?url=https%3A%2F%2Ffudami.net&style=flat&label=website" alt="Website Status" />
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" />
  </a>
  <img src="https://img.shields.io/badge/deploy-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare Pages" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

---

## About

**fudami** exists at the intersection of two extremes in Japanese language learning:

- **Anki** — world-class spaced repetition, punishing UX.
- **Duolingo** — polished game-like UX, shallow memory science.

fudami is the middle path: real SRS depth inside a serene, game-like shell. This repository is the **public marketing and SEO landing page** — a multi-page static site deployed on Cloudflare Pages.

<p align="center">
  <a href="https://fudami.net"><strong>→ Visit the live site</strong></a>
</p>

---

## Features

| Feature | Description |
|---|---|
| 🌙 **Dark / Light Theme** | OS-aware with manual toggle, persisted in localStorage — no flash on load |
| 🌐 **Internationalization** | i18n string map for EN, FR, JA, ES, DE with language picker |
| 🎨 **Design System** | Custom CSS design tokens (Japanese-inspired palette: washi paper, sumi ink, hanko red, matcha green) |
| 📱 **Responsive** | Mobile-first layout with fluid typography and adaptive navigation |
| 🔍 **SEO / GEO** | 1200×630 share image, Open Graph + Twitter Cards, canonical URLs, JSON-LD (Organization, WebSite, BreadcrumbList, FAQPage, DefinedTermSet), sitemap, `robots.txt` that welcomes search and AI crawlers, `llms.txt` |
| 📬 **Waitlist** | One email field, stored in D1 by a Pages Function — no account, no third-party script |
| 📖 **Glossary** | Plain-language definitions (kana, kanji, JLPT, FSRS…) with `DefinedTermSet` structured data, linked from the term pop-ups |
| ⚡ **Zero Build Step** | Pure static HTML/CSS/JS — no bundler, no framework, instant deploys |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Markup** | HTML5 (semantic) |
| **Styling** | Generated CSS from the shared fudami-design package |
| **Scripts** | Vanilla JavaScript (ES modules, deferred loading) |
| **Fonts** | Self-hosted fonts vendored from fudami-design |
| **Icons** | Material Symbols Outlined |
| **Forms** | Cloudflare Pages Functions + D1 (`functions/api/waitlist.js`) |
| **Hosting** | Cloudflare Pages |
| **Security Headers** | X-Frame-Options, CSP, Referrer-Policy, Permissions-Policy |
| **CI** | GitHub Actions (HTML validation, link checking) |

---

## Project Structure

```
├── public/               # Only directory uploaded by Cloudflare Pages
│   ├── *.html            # Marketing, waitlist and legal pages
│   ├── components.js     # Shared header, footer and modal adapters
│   ├── shared.js         # Theme, terms and same-origin Umami loader
│   ├── design-system.css # Generated from fudami-design
│   ├── assets/           # Favicons and share image
│   ├── vendor/           # Generated design bundle and self-hosted fonts
│   ├── .well-known/      # security.txt
│   ├── _headers          # Security and cache headers
│   ├── _redirects        # URL rewrites
│   └── robots.txt, sitemap.xml, llms.txt
├── functions/            # Pages Functions; stays at the repository root
├── test/                 # Tests; never published
├── .github/workflows/    # Validation, links and security checks
├── package.json
├── wrangler.toml         # pages_build_output_dir = "public"
└── LICENSE
```

---

## Getting Started

The committed CSS can be served directly. Rebuild it after changing classes, with the sibling `fudami-design` checkout available:

```bash
npm ci
npm run build
python3 -m http.server 3000 --directory public
# → http://localhost:3000
```

---

## Deployment

Deployed automatically on every push to `main` via **Cloudflare Pages** (connected to this GitHub repo).

| Requirement | Details |
|---|---|
| **Platform** | Cloudflare Pages (direct GitHub integration) |
| **Build command** | _None_ (CSS is built and committed before release) |
| **Output directory** | `public` (also set in `wrangler.toml`) |

The Pages project must use `public` as its output directory. Repository metadata,
tests, dependencies and Functions source stay outside it. Do not deploy the
repository root or rely on `.assetsignore` to filter a Pages upload.

To refresh the shared design artifacts after building the sibling package:

```bash
npm run vendor:design
npm run build
npm test
```

---

## Platform Context

This landing page is **Tier 0** — the marketing funnel — of a multi-tier Japanese learning platform:

| Tier | Role |
|---|---|
| **Landing** _(this repo)_ | Public marketing & SEO |
| **App** | The learning experience (Expo / React Native) |
| **Cloud** | Auth, sync, content delivery (Cloudflare Workers) |
| **Studio** | Content graph factory (offline tooling) |

---

## License

This project is licensed under the [MIT License](LICENSE).

Built with 🎋 by [Arno Wilhelm](https://arno-wilhelm.dev)
