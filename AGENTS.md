# AGENTS.md — fudami-landing

Verified: 2026-11-27 against fudami-landing@cb29cde (develop)

Vendor-neutral entry point for any agent working in this repo. Talk to the owner in French; code, commits, docs in English.

## What this is

The public site at `https://fudami.net`: static HTML in `public/`, vanilla JS, no framework, on Cloudflare Pages, plus two Pages Functions (`functions/`). It is the visual reference for every fudami surface and the only home of the legal pages (`privacy`, `terms`, `legal`, `credits`). Architecture page: `fudami-docs/architecture/repos/landing.md` (sibling checkout `../fudami-docs`). Fudami reading order: `../fudami-docs/ops/AGENT_ENTRY.md`, then `../fudami-docs/ops/AGENTS.md` (secrets, data licensing, conventions). Read them instead of re-deriving the rules here. The owner's working style is in `~/.claude/working-style.md`.

## Layout

- `public/` — the only directory Pages uploads: `*.html`, `components.js`, `shared.js`, `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, `llms.txt`, `.well-known/security.txt`.
- `functions/api/waitlist.js` — `POST /api/waitlist`, stores an email in D1 `fudami-db` (binding `DB`, `wrangler.toml`).
- `functions/st/[[path]].js` — same-origin relay for the cookieless Umami tracker.
- `scripts/render-chrome.cjs` — renders the shared header/footer into every `public/*.html`.
- `test/` — `node --test` suites; never published.
- No `.agents/` directory is tracked (it is gitignored); do not add vendor-specific dirs or a root `CLAUDE.md`/`GEMINI.md`.

## Install, run, test, build

```bash
npm ci                                    # only dependency: jsdom (dev)
npm test                                  # node --test test/*.test.js (38 tests, ~4 s)
python3 -m http.server 3000 --directory public   # serve the static site
npm run build                             # render-chrome + minified public/design-system.css
npm run dev                               # tailwind --watch into public/design-system.css
npm run vendor:design                     # copy chrome bundle, theme boot, fonts from ../fudami-design/dist
```

`build` and `dev` need the sibling `../fudami-design` checkout **with its own `node_modules`** (they call its `tailwindcss` and config). To refresh design artifacts: `(cd ../fudami-design && npm run build)`, then `npm run vendor:design && npm run build && npm test`. In a worktree under `recovery-work/`, `../fudami-design` does not exist: build from the main checkout, or skip build if you did not touch classes or chrome.

Functions are not run by `npm run dev`; they are covered by `test/waitlist.test.js` and `test/umami.test.js`. Do not run `wrangler` on the LXC.

## Gates before "done"

Mirror CI (`.github/workflows`), all on PRs to `main`/`develop`:

1. `npm test` green (CI job "Page smoke tests").
2. `htmlhint "public/*.html" --format unix` clean (job "Validate HTML", rules in `.htmlhintrc`).
3. Internal links resolve (job "Check Links": every local `href` in `public/*.html` exists, with or without `.html`).
4. Security scan green (`security.yml`: Trivy HIGH/CRITICAL with a fix, Semgrep ERROR). Accepted findings go in `.trivyignore.yaml`, path-scoped with a reason.
5. After changing HTML structure, chrome or classes: `npm run build`, and commit the regenerated files.

`quality.yml` (Lighthouse on the live site: accessibility ≥ 0.9 and `color-contrast` are errors, the rest warn) runs weekly, on manual dispatch and after pushes to `main` that touch `public/**`; it measures the deployed site, so it does not gate a PR.

A behaviour change needs a test that fails before and passes after; never weaken one.

## Branch and release flow

Branch from `develop`, PR to `develop`, never push to `main`, no force-push. Releasing = a PR `develop` → `main`. Cloudflare Pages git integration deploys `main` to production; any other branch gets `<branch>.fudami-landing.pages.dev`. Output directory is `public` (`pages_build_output_dir` in `wrangler.toml`, asserted by `test/public-output.test.js`), and there is no build command in Pages: CSS and chrome are built and **committed** before release. Never deploy the repo root.

## Traps and rules

- **Generated, committed, do not hand-edit:** `public/design-system.css`, `public/vendor/*` (design bundle, theme boot, fonts), and the header/footer blocks between `<!-- fd-header:start -->…<!-- fd-header:end -->` and the `fd-footer` pair in every page. Change `../fudami-design` or `components.js`, then rebuild.
- **Privacy is a contract.** A change that collects, stores or sends new personal data updates `public/privacy.html` in the same change; tests assert the privacy copy (Umami only, opt-out button, no third-party host). Learner data is never exported.
- **CSP in `public/_headers`** allows only `'self'` (plus inline script/style and `data:` images). A new third-party script, font or connection breaks the privacy promise and a test; do not add one.
- **Credits and licensing:** open-data attributions live in `public/credits.html`; copyrighted textbooks and audio are never ingested or shown. Illustration credits (OpenAI image model) stay accurate when pictures ship.
- **Secrets:** `UMAMI_HOST`, `UMAMI_WEBSITE_ID`, `UMAMI_RELAY_KEY` are Pages environment values, never in `wrangler.toml`, the repo or logs. The D1 `database_id` in `wrangler.toml` is an identifier, not a secret. Size caps on the waitlist form and relay (8 KB) are deliberate; keep them.
- **Copy, pricing, design, anything public or irreversible:** propose to the owner via fx-project before building. The main call to action is "Start learning" → `https://app.fudami.net/`; `/waitlist` is only for the phone apps. Pro is optional with a 14-day no-card trial (`pricing.html`).
- Adding or renaming a page: update `sitemap.xml`, `llms.txt`, the chrome links, and `test/smoke.test.js` expectations.
- Never post, publish, schedule or pay anything without the owner's explicit OK.

## Agent conventions (shared, not repeated here)

ponytail is mandatory for coding tasks; `modern-web-guidance` before HTML/CSS/client-JS work; use your own worktree under `/home/agent/fudami/recovery-work/wt-<task>`; never `git stash`; one browser/Playwright run at a time under `flock ~/fudami/recovery-work/.browser.lock`; claim and log tasks with `~/.agents/bin/task_tracker.py`; clean desk when done. Details: `/home/agent/fudami/recovery-work/briefs/repo-agents-1127.md` and `common-1120.md`.
