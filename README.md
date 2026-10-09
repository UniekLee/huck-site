# huck-site

Static marketing site for Huck (preview for gethuck.com). **Do not point DNS until Lee says.**

## Build

```
node src/build.mjs   # no dependencies; writes public/
```

`public/` is committed build output. The old `docs/` 404 stub is untouched, so nothing is published at unieklee.com/huck-site by this change. Point your host (or Pages) at `public/` when ready to launch.

## Hosting (Cloudflare)

`wrangler.jsonc` serves `public/`. In Cloudflare (Workers & Pages → Create → Import a repository) use: root directory `/`, build command `node src/build.mjs`, deploy command `npx wrangler deploy`. Pull requests and branches can use the non-production branch command `npx wrangler versions upload` for preview URLs.

## How it works

| File | Purpose |
| --- | --- |
| `src/site.json` | App Store URL, Apple provider token (`providerToken`, empty for now), support email, social links |
| `src/features.json` | Reusable feature blocks (copy, bullets, device screenshot) |
| `src/variants.json` | One entry per landing page: slug, SEO title/description, App Store campaign token (`ct`), hero, feature order, extra FAQ |
| `src/build.mjs` | Template and page generator (also builds `/privacy/`, `/support/`, 404, sitemap, robots) |
| `src/legal/privacy.md` | Privacy notice, copied verbatim from the live notice dated 5 October 2026 |

### Add a landing page

Append an entry to `src/variants.json` (copy an existing one), choose a `slug`, a unique `campaign` token, an optional `ppid` (App Store custom product page ID), a hero, and the order of `features`. Run the build. It appears at `/<slug>/`, gets its own sitemap entry, and shows up in the "What do you want from your scoreboard?" chips on the home page.

## Rules the copy follows
- Lead with "Keep score. Track the rest." Say "game", not "full/complete/whole game".
- Never hard-code prices; the App Store shows local prices.
- Real app screens only, no invented metrics. Workout recording is optional (Apple Watch plus Health permission).
- The pricing section describes the 3-free-games and credits model (app 26.38, live).

## App Store badge
Download Apple's official "Download on the App Store" SVG (black, English) from https://toolbox.marketingtools.apple.com/ and save it as `src/assets/app-store-badge.svg`, then rebuild. Until then the big buttons use a styled link.

Preview deploys: pushes to the PR branch build on Cloudflare automatically.

<!-- deploy trigger 14:29 -->

## Email signup
`src/site.json` → `newsletter` (`formId`, `honeypot` and `recaptchaKey` all come from the EmailOctopus form: the ID in `…/form/<formId>.js`, the hidden `hp…` input name and the reCAPTCHA site key). While `formId` is empty, the signup section is hidden. When set, pages show our own styled form that posts to EmailOctopus, so no EmailOctopus styling or script is loaded except Google reCAPTCHA.
