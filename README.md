<p align="center">
  <img src="assets/favicon.png" alt="fudami — Daruma mascot" width="96" height="96" />
</p>

<h1 align="center">fudami — Landing Page</h1>

<p align="center">
  <strong>Marketing site for fudami, the Japanese learning platform that combines spaced repetition science with calm, focused design.</strong>
</p>

<p align="center">
  <a href="https://github.com/snonow/fudami-landing/actions/workflows/ci.yml">
    <img src="https://github.com/snonow/fudami-landing/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <a href="https://fudami.arno-wilhelm.dev">
    <img src="https://img.shields.io/website?url=https%3A%2F%2Ffudami.arno-wilhelm.dev&style=flat&label=website" alt="Website Status" />
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
  <a href="https://fudami.arno-wilhelm.dev"><strong>→ Visit the live site</strong></a>
</p>

---

## Features

| Feature | Description |
|---|---|
| 🌙 **Dark / Light Theme** | OS-aware with manual toggle, persisted in localStorage — no flash on load |
| 🌐 **Internationalization** | i18n string map for EN, FR, JA, ES, DE with language picker |
| 🎨 **Design System** | Custom CSS design tokens (Japanese-inspired palette: washi paper, sumi ink, hanko red, matcha green) |
| 📱 **Responsive** | Mobile-first layout with fluid typography and adaptive navigation |
| 🔍 **SEO-Optimized** | Open Graph, Twitter Cards, canonical URLs, structured headings, sitemap, robots.txt |
| 🔐 **Clerk Authentication** | Sign-in modal overlay via ClerkJS CDN — users authenticate without leaving the page |
| ⚡ **Zero Build Step** | Pure static HTML/CSS/JS — no bundler, no framework, instant deploys |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Markup** | HTML5 (semantic) |
| **Styling** | Vanilla CSS design system + Tailwind CSS (CDN) |
| **Scripts** | Vanilla JavaScript (ES modules, deferred loading) |
| **Fonts** | Plus Jakarta Sans · M PLUS Rounded 1c (Google Fonts) |
| **Icons** | Material Symbols Outlined |
| **Auth** | Clerk (CDN, vanilla JS integration) |
| **Hosting** | Cloudflare Pages |
| **Security Headers** | X-Frame-Options, CSP, Referrer-Policy, Permissions-Policy |
| **CI** | GitHub Actions (HTML validation, link checking) |

---

## Project Structure

```
├── index.html            # Hero, philosophy, FSRS deep-dive, roadmap, CTA
├── pricing.html          # Pricing tiers
├── about.html            # Mission and team
├── credits.html          # Open-source attributions
│
├── design-system.css     # CSS custom properties, dark/light tokens, layout
├── tailwind-config.js    # Tailwind theme extensions
├── shared.js             # Theme toggle, nav state, Clerk auth init
├── components.js         # Shared header, footer, modal components
├── i18n.js               # Multi-language string map
│
├── assets/               # Daruma mascot favicons (dark + light variants)
├── _headers              # Cloudflare Pages security & cache headers
├── _redirects            # Cloudflare Pages URL rewrites
├── robots.txt            # Search engine directives
├── sitemap.xml           # XML sitemap
│
├── .github/workflows/
│   └── ci.yml            # HTML validation & link checks
└── LICENSE               # MIT
```

---

## Getting Started

No build step required. Open any `.html` file directly in a browser, or serve locally for accurate font and script loading:

```bash
npx serve .
# → http://localhost:3000
```

---

## Deployment

Deployed automatically on every push to `main` via **Cloudflare Pages** (connected to this GitHub repo).

| Requirement | Details |
|---|---|
| **Platform** | Cloudflare Pages (direct GitHub integration) |
| **Build command** | _None_ (static site) |
| **Output directory** | `/` (root) |

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
