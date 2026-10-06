# huck-site

Static marketing site for Huck (preview for gethuck.com). **Do not point DNS until Lee says.**

## Build

```
node src/build.mjs   # no dependencies; writes public/
```

`public/` is committed build output. The old `docs/` 404 stub is untouched, so nothing is published at unieklee.com/huck-site by this change. Point your host (or Pages) at `public/` when ready to launch.

## How it works

| File | Purpose |
| --- | --- |
| `src/site.json` | App Store URL, Apple provider token (`providerToken`, empty for now), support email, social links |
| `src/features.json` | Reusable feature blocks (copy, bullets, device screenshot) |
| `src/variants.json` | One entry per landing page: slug, SEO title/description, App Store campaign token (`ct`), hero, feature order, extra FAQ |
| `src/build.mjs` | Template and page generator (also builds `/privacy/`, `/support/`, 404, sitemap, robots) |
| `src/legal/privacy.md` | Privacy notice, copied verbatim from the live notice dated 5 October 2026 |

### Add a landing page

Append an entry to `src/variants.json` (copy an existing one), choose a `slug`, a unique `campaign` token, a hero, and the order of `features`. Run the build. It appears at `/<slug>/`, gets its own sitemap entry, and shows up in the "What do you want from your scoreboard?" chips on the home page.

## Rules the copy follows
- Lead with "Keep score. Track the rest." Say "game", not "full/complete/whole game".
- Never hard-code prices; the App Store shows local prices.
- Real app screens only, no invented metrics. Workout recording is optional (Apple Watch plus Health permission).
- Launch together with app 26.38. The pricing section describes the 3-free-games and credits model, which is not true of public 26.02.
