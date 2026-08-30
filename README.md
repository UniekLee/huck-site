# huck-site

Static marketing one-pager for **Huck**, the Ultimate scorekeeping app. This repo is the preview for [gethuck.com](https://gethuck.com). Production stays on Carrd until Lee says otherwise.

## Preview

GitHub Pages (project site): **https://unieklee.github.io/huck-site/**

Do **not** point DNS or a custom domain at this repo until Lee says to. Do not add a CNAME for gethuck.com.

## What this is

- Static HTML/CSS (a little JS for the support form placeholder).
- Paths are set for the `/huck-site/` project Pages base (root-relative `/huck-site/...` URLs).
- App Store CTAs: https://apps.apple.com/app/id6467775586

## What this is not

- Not live production. Carrd still serves gethuck.com.
- Not the iOS app. The app repo is [UniekLee/Huck](https://github.com/UniekLee/Huck) — leave it alone.
- The support form does not POST anywhere. It is a placeholder until after publish.

## Local

Serve the files under a `/huck-site/` prefix so root-relative URLs resolve:

```sh
mkdir -p /tmp/huck-preview/huck-site
cp -a index.html .nojekyll css js assets privacy /tmp/huck-preview/huck-site/
cd /tmp/huck-preview && python3 -m http.server 8000
```

Then open http://127.0.0.1:8000/huck-site/

## Pages

Preferred after merge: GitHub Actions workflow in `.github/workflows/pages.yml`.

Until `main` is merged, the preview is published from the `gh-pages` branch so github.io can load without changing production DNS.
