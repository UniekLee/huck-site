// Static site generator: node src/build.mjs  ->  public/
// Content lives in site.json, features.json and variants.json; add a variant by adding an entry to variants.json.
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'public');
const read = (f) => readFileSync(join(here, f), 'utf8');
const site = JSON.parse(read('site.json'));
const features = JSON.parse(read('features.json'));
const variants = JSON.parse(read('variants.json'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const path = (slug) => (slug ? `/${slug}/` : '/');

function storeUrl(v) {
  const p = new URLSearchParams();
  if (site.providerToken) p.set('pt', site.providerToken);
  p.set('ct', v.campaign);
  p.set('mt', '8');
  return `${site.appStoreUrl}?${p}`;
}

// Apple's official badge: drop the downloaded SVG at src/assets/app-store-badge.svg and it is used for the big buttons.
const hasBadge = existsSync(join(here, 'assets', 'app-store-badge.svg'));
const cta = (v, placement, label = 'Download on the App Store', cls = '') =>
  hasBadge && !cls
    ? `<a class="badge" href="${esc(storeUrl(v))}" data-placement="${placement}"><img src="/assets/app-store-badge.svg" alt="Download on the App Store" width="162" height="54"></a>`
    : `<a class="btn ${cls}" href="${esc(storeUrl(v))}" data-placement="${placement}"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.600-2.800-1.800-3.400-1.800-1.400-.1-2.800.8-3.500.8-.7 0-1.800-.8-3-.8-1.500 0-3 .9-3.800 2.300-1.600 2.800-.4 7 1.200 9.300.8 1.100 1.700 2.400 2.900 2.300 1.200 0 1.600-.7 3-.7s1.800.7 3 .7c1.300 0 2.100-1.100 2.800-2.200.9-1.300 1.300-2.500 1.300-2.600-.1 0-2.500-1-2.500-3.800zM14.200 5.800c.6-.8 1.100-1.900.9-3-.9 0-2.100.6-2.700 1.400-.6.700-1.100 1.800-1 2.900 1.100.1 2.200-.5 2.800-1.300z"/></svg><span>${label}</span></a>`;

function device(m) {
  const ext = m.img.startsWith('phone') ? 640 : 416;
  return `<figure class="device ${m.type}"><div class="bezel"><img src="/assets/${m.img}.webp" alt="${esc(m.alt)}" width="${ext}" height="${m.type === 'phone' ? 1391 : 496}" loading="lazy"></div></figure>`;
}

function featureSection(key, i) {
  const f = features[key];
  const flip = i % 2 ? ' flip' : '';
  return `<section class="feature${flip}" id="${key}">
  <div class="wrap feature-grid">
    <div class="copy">
      <p class="kicker">${esc(f.kicker)}</p>
      <h2>${esc(f.title)}</h2>
      <p class="lead">${esc(f.body)}</p>
      <ul class="ticks">${f.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
    </div>
    <div class="media">${f.media.map(device).join('')}</div>
  </div>
</section>`;
}

const sharedFaq = [
  { q: 'Is Huck free?', a: 'Your first 3 games are free, with every feature included and no subscription needed to start.' },
  { q: 'What uses a game credit?', a: 'One credit is used when you finish a game lasting 5 minutes or more. Shorter games do not use a credit.' },
  { q: 'Do credits expire?', a: 'No. Game credits never expire, and every game you use them on includes every feature.' },
  { q: 'What happens when I run out of credits?', a: 'You will need credits or Huck Pro to start another game. Your saved history stays available.' },
  { q: 'Do I need an Apple Watch?', a: 'No. Huck works on iPhone and iPad. Apple Watch adds wrist scoring and workout recording.' }
];

function layout(v, body, { title, description, canonical, noindex = false, ld = '' } = {}) {
  const t = title ?? v.title;
  const d = description ?? v.description;
  const url = site.baseUrl + canonical;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t)}</title>
<meta name="description" content="${esc(d)}">
<link rel="canonical" href="${esc(url)}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta name="apple-itunes-app" content="app-id=6467775586">
<meta name="theme-color" content="#0a0a0a">
<meta property="og:type" content="website"><meta property="og:site_name" content="Huck">
<meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(d)}">
<meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${site.baseUrl}/assets/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.png"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/styles.css">
${canonical === '/' ? `<script>/* old Carrd anchors (used by the App Store listing and Watch app) */var m={'#privacy-policy':'/privacy/','#support':'/support/','#privacy':'/privacy/'}[location.hash];if(m)location.replace(m)</script>` : ''}
${ld}
</head>
<body>
${body}
</body>
</html>`;
}

function header(v) {
  return `<header class="nav"><div class="wrap nav-in">
  <a class="brand" href="/" aria-label="Huck home"><img src="/assets/icon.png" alt="" width="32" height="32"><span>Huck</span></a>
  <nav aria-label="Main"><a href="${path(v.slug)}#pricing">Pricing</a><a href="${path(v.slug)}#faq">FAQ</a>${cta(v, 'nav', 'Get Huck', 'sm')}</nav>
</div></header>`;
}

function footer() {
  return `<footer class="foot"><div class="wrap foot-in">
  <div><a class="brand" href="/"><img src="/assets/icon.png" alt="" width="28" height="28"><span>Huck</span></a>
  <p class="muted">Ultimate scoring for iPhone and Apple Watch.<br>Huck is provided by Uniek Ltd.</p></div>
  <nav aria-label="Footer"><a href="/privacy/">Privacy notice</a><a href="${esc(site.termsUrl)}">Terms of use</a><a href="/support/">Support</a></nav>
  <nav aria-label="Social">${site.social.map((s) => `<a href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a>`).join('')}</nav>
</div></footer>`;
}

function variantIndex(v) {
  const others = variants.filter((x) => x.slug !== v.slug);
  return `<section class="tabs"><div class="wrap"><p class="kicker">What do you want from your scoreboard?</p><div class="chips">${others.map((o) => `<a href="${path(o.slug)}">${esc(o.nav)}</a>`).join('')}</div></div></section>`;
}

function page(v) {
  const faq = [...v.faq, ...sharedFaq];
  const ld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'MobileApplication', name: 'Huck', operatingSystem: 'iOS, watchOS',
    applicationCategory: 'SportsApplication', description: v.description, url: site.baseUrl + path(v.slug),
    publisher: { '@type': 'Organization', name: 'Uniek Ltd' }
  })}</script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
  })}</script>`;
  const body = `${header(v)}
<main>
<section class="hero"><div class="wrap hero-grid">
  <div class="copy">
    <p class="eyebrow">${esc(v.hero.eyebrow)}</p>
    <h1><span>${esc(v.hero.line1)}</span> <em>${esc(v.hero.line2)}</em></h1>
    <p class="lead">${esc(v.hero.sub)}</p>
    <div class="cta-row">${cta(v, 'hero')}<span class="note">First 3 games free. Every feature included.</span></div>
    <ul class="proof"><li>iPhone</li><li>Apple Watch</li><li>iPad</li></ul>
  </div>
  <div class="media hero-media">${v.hero.media.map(device).join('')}</div>
</div></section>
${v.slug ? '' : variantIndex(v)}
${v.features.map(featureSection).join('\n')}
<section class="steps"><div class="wrap">
  <p class="kicker">How a game goes</p><h2>Set up in seconds. Then just play.</h2>
  <ol class="step-grid">
    <li><b>1</b><h3>Set up</h3><p>Name your teams, pick colours and choose a mixed-set rotation.</p></li>
    <li><b>2</b><h3>Play</h3><p>Score and log your contribution from your wrist or phone. Record a workout on Apple Watch if you want one.</p></li>
    <li><b>3</b><h3>Look back</h3><p>Review the score, your stats and the set history, then share the result.</p></li>
  </ol>
</div></section>
<section class="pricing" id="pricing"><div class="wrap">
  <p class="kicker">Pricing</p><h2>Try every feature before you decide.</h2>
  <p class="lead">Every game includes every feature. Prices are shown in your own currency in the App Store.</p>
  <div class="price-grid">
    <article class="card hi"><h3>First 3 games</h3><p class="big">Free</p><p>Start playing right away. No subscription, no purchase sheet before your first game.</p></article>
    <article class="card"><h3>Game credits</h3><p class="big">Packs of 5, 10 or 25</p><p>For occasional players. Credits never expire. One is used when a game lasts 5 minutes or more.</p></article>
    <article class="card"><h3>Huck Pro</h3><p class="big">Unlimited games</p><p>For regular players. Choose monthly, three-month or yearly billing.</p></article>
  </div>
  <p class="fine">Your saved history always stays available, even with no credits. Existing Huck Pro and lifetime purchases are honoured. Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period; manage them in your App Store account settings.</p>
</div></section>
<section class="faq" id="faq"><div class="wrap narrow">
  <p class="kicker">Questions</p><h2>Good to know</h2>
  ${faq.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('\n  ')}
</div></section>
<section class="final"><div class="wrap">
  <h2>${esc(v.finalTitle)}</h2><p class="lead">${esc(v.finalSub)}</p>${cta(v, 'footer')}
</div></section>
${signup()}</main>
${footer()}`;
  return layout(v, body, { canonical: path(v.slug), ld });
}

// ---- legal & support pages ----
const privacySrc = read('legal/privacy.md').trim().split('\n');
function mdInline(s) {
  return esc(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `<a href="${u.replace(/&amp;/g, '&')}">${t}</a>`);
}
function privacyHtml() {
  let h = '', list = false;
  for (const line of privacySrc) {
    const m = line.match(/^\*\*(.+)\*\*$/);
    if (line.startsWith('•')) { if (!list) { h += '<ul>'; list = true; } h += `<li>${mdInline(line.slice(1).trim())}</li>`; continue; }
    if (list) { h += '</ul>'; list = false; }
    if (!line.trim()) continue;
    h += m ? `<h2>${esc(m[1])}</h2>` : `<p>${mdInline(line)}</p>`;
  }
  return '<p class="muted">Last updated: 5 October 2026</p>' + h + (list ? '</ul>' : '');
}
const base = variants[0];
const simple = (title, inner, canonical, desc) => layout(base, `${header(base)}<main class="doc"><div class="wrap narrow"><h1>${esc(title)}</h1>${inner}</div></main>${footer()}`, { title: `${title} – Huck`, description: desc, canonical });

// Email signup. Plain HTML form, no JavaScript. Hidden until site.json newsletter.listId is set (EmailOctopus list ID).
function signup() {
  const id = site.newsletter?.listId;
  if (!id) return '';
  return `<section class="signup" id="updates"><div class="wrap narrow">
  <p class="kicker">Huckdates</p><h2>Get occasional Huck updates.</h2>
  <form action="https://emailoctopus.com/lists/${esc(id)}/members/embedded/1.3/add" method="post" class="signup-form">
    <label class="sr" for="email">Email address</label>
    <input id="email" type="email" name="email_address" placeholder="you@example.com" required autocomplete="email">
    <input type="text" name="hpc${esc(id)}" tabindex="-1" autocomplete="off" aria-hidden="true" class="hp" value="">
    <button class="btn" type="submit">Subscribe</button>
  </form>
  <p class="fine">Occasional updates, only if you sign up. Unsubscribe any time. See the <a href="/privacy/">privacy notice</a> for how your details are handled.</p>
</div></section>`;
}

const pages = new Map();
for (const v of variants) pages.set(path(v.slug), page(v));
pages.set('/privacy/', simple('Privacy notice', privacyHtml(), '/privacy/', 'How the Huck app and gethuck.com handle information.'));
pages.set('/support/', simple('Support', `<p>Running into trouble with Huck? Email <a href="mailto:${site.supportEmail}">${site.supportEmail}</a> and tell us your iPhone and Apple Watch models and your Huck version.</p><h2>Request your data</h2><p>To request access, correction or deletion of your information, email <a href="mailto:${site.privacyEmail}">${site.privacyEmail}</a>. See the <a href="/privacy/">privacy notice</a>.</p><h2>Subscriptions and credits</h2><p>Manage or cancel a Huck Pro subscription in your App Store account settings. Game credits never expire and your saved history stays available.</p><h2>Please don't send Health information</h2><p>Don't include Health information in support requests unless you intend to share it.</p>`, '/support/', 'Get help with Huck.'));
pages.set('/404.html', simple('Page not found', '<p>That page does not exist. <a href="/">Back to Huck</a>.</p>', '/404.html', 'Page not found.').replace('<meta name="description"', '<meta name="robots" content="noindex"><meta name="description"'));

rmSync(out, { recursive: true, force: true });
for (const [p, html] of pages) {
  const f = p.endsWith('.html') ? join(out, p) : join(out, p, 'index.html');
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, html);
}
cpSync(join(here, 'assets'), join(out, 'assets'), { recursive: true });
cpSync(join(here, 'styles.css'), join(out, 'assets', 'styles.css'));
const urls = [...pages.keys()].filter((p) => !p.endsWith('.html'));
writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${site.baseUrl}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.baseUrl}/sitemap.xml\n`);
console.log(`Built ${pages.size} pages into public/`);
