# huck-site

Static marketing one-pager for **Huck**, the Ultimate scorekeeping app. This repo is the draft for [gethuck.com](https://gethuck.com). Production stays on Carrd until Lee says otherwise.

## Preview

**GitHub Pages is off. Do not enable it** under UniekLee. Any UniekLee project Pages site is served at `www.unieklee.com/<repo>/` because the user Pages site already uses that custom domain. Lee does not want this preview on unieklee.com.

`main`/`docs` holds a noindex “Not found” stub so `https://www.unieklee.com/huck-site/` is not the Huck site. Leave that stub alone.

Preview is **this pull request** until a host that is not unieklee.com is chosen. Do not add a CNAME. Do not point DNS at this repo. Do not touch live gethuck.com.

## What this is

- Static HTML/CSS (a little JS for the support form placeholder).
- Relative URLs (`css/`, `assets/`, `js/`, `privacy/`) so the site works from any static host, including a GitHub CDN file preview.
- App Store CTAs: https://apps.apple.com/app/id6467775586

## What this is not

- Not live production. Carrd still serves gethuck.com.
- Not a GitHub Pages site. Do not turn Pages on.
- Not the iOS app. The app repo is [UniekLee/Huck](https://github.com/UniekLee/Huck) — leave it alone.
- The support form does not POST anywhere. Eventual backend is **Forminit TBD** (no account created, no endpoint invented). Placeholder until an endpoint is provided. Data request: `mailto:privacy@gethuck.com`.

## Local

From the repo root:

```sh
python3 -m http.server 8000
```

Then open http://127.0.0.1:8000/
