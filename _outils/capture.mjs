// Capture d'un site pour la Bibliothèque web : captures, vidéo de scroll, design tokens,
// structure, stack, SEO, perf + analyse de bundle REA (rea analyze-web-bundle via CDP).
// Usage : node capture.mjs [ids séparés par des virgules | all] [--conc 3] [--force]
import { chromium } from 'playwright-core';
import { spawn, execFile, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', 'sites');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const REA = path.join(HERE, 'node_modules', 'rea-agents', 'package.json');

const args = process.argv.slice(2);
const sel = args.find(a => !a.startsWith('--')) || 'all';
const conc = Number((args[args.indexOf('--conc') + 1]) || 3) || 3;
const force = args.includes('--force');

const sites = fs.readFileSync(path.join(HERE, 'sites.txt'), 'utf8').trim().split(/\r?\n/).map(l => {
  const [id, name, url] = l.split('|'); return { id: Number(id), name, url };
});
const wanted = sel === 'all' ? sites : sites.filter(s => sel.split(',').map(Number).includes(s.id));

const slug = s => String(s.id).padStart(3, '0') + '-' + s.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (s, ...m) => console.log(`[${String(s.id).padStart(3)}] ${s.name}:`, ...m);
const withTimeout = (p, ms, label) => Promise.race([p, sleep(ms).then(() => { throw new Error('timeout ' + label); })]);

function reaBin() {
  const pkg = JSON.parse(fs.readFileSync(REA, 'utf8'));
  const bin = typeof pkg.bin === 'string' ? pkg.bin : (pkg.bin.rea || Object.values(pkg.bin)[0]);
  return path.join(HERE, 'node_modules', 'rea-agents', bin);
}
function runRea(cmdArgs, timeoutMs = 120000) {
  return new Promise(res => {
    execFile(process.execPath, [reaBin(), ...cmdArgs], { timeout: timeoutMs, maxBuffer: 200 * 1024 * 1024 },
      (err, stdout, stderr) => res({ err: err ? String(err.message).slice(0, 500) : null, stdout, stderr: String(stderr).slice(0, 2000) }));
  });
}

// ---------- extraction dans la page ----------
const INIT = () => {
  window.__perf = { lcp: 0, cls: 0, lcpEl: null };
  try {
    new PerformanceObserver(l => { for (const e of l.getEntries()) { window.__perf.lcp = e.startTime; window.__perf.lcpEl = e.element ? (e.element.tagName + (e.element.className && typeof e.element.className === 'string' ? '.' + e.element.className.split(' ')[0] : '')) : null; } })
      .observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value; })
      .observe({ type: 'layout-shift', buffered: true });
  } catch (e) {}
};

function EXTRACT() {
  const rgbToHex = c => {
    const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    if (p.length > 3 && p[3] === 0) return null;
    return '#' + p.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  };
  const vw = innerWidth, vh = innerHeight;
  const all = [...document.querySelectorAll('body *')].slice(0, 6000);
  const bg = {}, fg = {}, border = {}, fam = {}, radius = {}, shadows = {}, transitions = {};
  let canvas = 0, videos = 0, imgs = 0, imgNoAlt = 0, svgs = 0, iframes = 0;
  const add = (o, k, w) => { if (k) o[k] = (o[k] || 0) + w; };
  for (const el of all) {
    const tag = el.tagName;
    if (tag === 'CANVAS') canvas++; if (tag === 'VIDEO') videos++; if (tag === 'svg' || tag === 'SVG') svgs++; if (tag === 'IFRAME') iframes++;
    if (tag === 'IMG') { imgs++; if (!el.getAttribute('alt')) imgNoAlt++; }
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
    const area = Math.min(r.width, vw) * Math.min(r.height, vh * 3);
    add(bg, rgbToHex(cs.backgroundColor), area);
    const ownText = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ');
    if (ownText.length) { add(fg, rgbToHex(cs.color), ownText.length); add(fam, cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), ownText.length); }
    if (cs.borderTopWidth !== '0px' && cs.borderTopStyle !== 'none') add(border, rgbToHex(cs.borderTopColor), 1);
    if (cs.borderTopLeftRadius !== '0px') add(radius, cs.borderTopLeftRadius, 1);
    if (cs.boxShadow !== 'none') add(shadows, cs.boxShadow.slice(0, 120), 1);
    if (cs.transitionDuration !== '0s') add(transitions, cs.transitionTimingFunction.split(',')[0] + ' ' + cs.transitionDuration.split(',')[0], 1);
  }
  const top = (o, n = 12) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => ({ v: k, w: Math.round(v) }));
  const typo = {};
  for (const s of ['h1', 'h2', 'h3', 'h4', 'p', 'a', 'button', 'li', 'body']) {
    const el = [...document.querySelectorAll(s)].find(e => e.getBoundingClientRect().height > 0 && (s === 'body' || e.textContent.trim().length > 1));
    if (!el) continue; const cs = getComputedStyle(el);
    typo[s] = { family: cs.fontFamily.slice(0, 120), size: cs.fontSize, weight: cs.fontWeight, lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, transform: cs.textTransform, color: rgbToHex(cs.color), sample: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 80) };
  }
  // tailles de police distinctes (échelle typographique)
  const sizes = {};
  for (const el of all) { const t = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); if (t) add(sizes, getComputedStyle(el).fontSize, 1); }
  // CSS : variables, font-face, keyframes, media queries
  const vars = {}, fontFaces = [], keyframes = new Set(), media = {}; let rulesCount = 0, crossOrigin = 0;
  const walk = rules => { for (const r of rules) { rulesCount++;
    if (r.type === 1 && /(:root|html|body)\b/.test(r.selectorText || '')) for (const p of r.style) if (p.startsWith('--') && Object.keys(vars).length < 250) vars[p] = r.style.getPropertyValue(p).trim().slice(0, 140);
    if (r.type === 5) fontFaces.push({ family: r.style.getPropertyValue('font-family').replace(/["']/g, ''), weight: r.style.getPropertyValue('font-weight'), style: r.style.getPropertyValue('font-style'), src: (r.style.getPropertyValue('src') || '').slice(0, 200) });
    if (r.type === 7) keyframes.add(r.name);
    if (r.type === 4) { const m = r.conditionText || r.media.mediaText; (m.match(/\d+(\.\d+)?(px|em|rem)/g) || []).forEach(b => add(media, b, 1)); walk(r.cssRules); }
    if (r.cssRules && r.type !== 4) try { walk(r.cssRules); } catch (e) {}
  } };
  for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch (e) { crossOrigin++; } }
  // stack
  const html = document.documentElement.outerHTML.slice(0, 3000000);
  const scripts = [...document.scripts].map(s => s.src).filter(Boolean);
  const has = re => re.test(html);
  const W = window;
  const tech = {
    gsap: !!W.gsap || has(/gsap(\.min)?\.js|greensock/i), gsapVersion: W.gsap && W.gsap.version,
    scrollTrigger: !!(W.ScrollTrigger || (W.gsap && W.gsap.core && W.gsap.core.globals && W.gsap.core.globals().ScrollTrigger)),
    splitText: !!(W.SplitText || W.SplitType || W.Splitting) || has(/split-?type|splitting\.js|SplitText/),
    lenis: !!W.Lenis || !!W.lenis || document.documentElement.classList.contains('lenis') || has(/lenis/i),
    locomotive: has(/locomotive-scroll|has-scroll-smooth|data-scroll-container/),
    three: !!(W.THREE || W.__THREE__) || has(/three(\.module)?(\.min)?\.js/), threeRevision: W.__THREE__ || null,
    ogl: has(/\bogl\b/), pixi: !!W.PIXI, babylon: !!W.BABYLON, spline: has(/spline-viewer|splinetool|prod\.spline\.design/), rive: has(/@rive-app|\.riv["']/),
    lottie: !!(W.lottie || W.bodymovin) || has(/lottie|bodymovin/i), unicornStudio: has(/unicornstudio|unicorn\.studio/i),
    barba: !!W.barba || has(/data-barba/), swup: !!W.swup || has(/swup/), highway: has(/data-router-view|highway/i), taxi: has(/data-taxi/),
    swiper: !!W.Swiper || has(/swiper/), webflow: !!W.Webflow || has(/data-wf-page|webflow/), framer: has(/framerusercontent|__framer/), wordpress: has(/wp-content|wp-includes/),
    shopify: !!W.Shopify, squarespace: has(/squarespace/), wix: has(/wix\.com|wixstatic/),
    next: !!W.__NEXT_DATA__ || !!W.next || has(/\/_next\//), nuxt: !!(W.__NUXT__ || W.$nuxt) || has(/\/_nuxt\//), astro: has(/astro-island|\/_astro\//),
    sveltekit: has(/__sveltekit|svelte-/), gatsby: !!W.___gatsby, remix: !!W.__remixContext, react: !!(W.React || document.querySelector('[data-reactroot]') || W.__REACT_DEVTOOLS_GLOBAL_HOOK__ && W.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers && W.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.size), vue: !!W.__VUE__ || has(/data-v-[0-9a-f]{6}/),
    cms: ['sanity', 'prismic', 'contentful', 'storyblok', 'datocms', 'strapi', 'craftcms', 'hygraph', 'payloadcms'].filter(c => has(new RegExp(c, 'i'))),
    analytics: ['googletagmanager', 'google-analytics', 'gtag', 'hotjar', 'clarity.ms', 'plausible', 'segment', 'mixpanel', 'fbevents', 'hubspot', 'posthog'].filter(c => has(new RegExp(c.replace('.', '\\.'), 'i'))),
    customCursor: has(/cursor/i) && [...document.querySelectorAll('[class*=cursor]')].length > 0,
    audio: document.querySelectorAll('audio').length > 0 || has(/howler|\.mp3|\.ogg/i),
    webglCanvas: [...document.querySelectorAll('canvas')].some(c => { try { return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }),
  };
  const generator = document.querySelector('meta[name=generator]')?.content || null;
  // SEO
  const meta = n => document.querySelector(`meta[name="${n}"],meta[property="${n}"]`)?.content || null;
  const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { const j = JSON.parse(s.textContent); return [].concat(j['@graph'] || j).map(x => x['@type']).flat(); } catch (e) { return ['invalide']; } }).flat();
  const headings = [...document.querySelectorAll('h1,h2,h3')].slice(0, 50).map(h => h.tagName + ' ' + h.textContent.trim().replace(/\s+/g, ' ').slice(0, 90));
  // structure
  const main = document.querySelector('main') || document.body;
  let blocks = [...main.children].filter(e => e.getBoundingClientRect().height > 150);
  if (blocks.length === 1 && blocks[0].children.length > 2) blocks = [...blocks[0].children].filter(e => e.getBoundingClientRect().height > 150);
  const sections = blocks.slice(0, 30).map(e => ({ tag: e.tagName.toLowerCase(), id: e.id || null, cls: (typeof e.className === 'string' ? e.className : '').slice(0, 80), h: Math.round(e.getBoundingClientRect().height), top: Math.round(e.getBoundingClientRect().top + scrollY), title: (e.querySelector('h1,h2,h3')?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80), media: e.querySelectorAll('img,video,canvas,picture').length }));
  const navLinks = [...document.querySelectorAll('nav a, header a')].slice(0, 30).map(a => ({ t: a.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), href: a.href }));
  const ctas = [...document.querySelectorAll('a,button')].filter(e => { const t = e.textContent.trim(); const r = e.getBoundingClientRect(); return t && t.length < 40 && r.width > 60 && r.height > 28 && getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)'; }).slice(0, 15).map(e => e.textContent.trim().replace(/\s+/g, ' '));
  const internal = [...new Set([...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => { try { const u = new URL(h); return u.origin === location.origin && u.pathname !== location.pathname && !/\.(pdf|jpg|png|zip|mp4)$/i.test(u.pathname) && !u.hash; } catch (e) { return false; } }))].slice(0, 40);
  const nav = performance.getEntriesByType('navigation')[0] || {};
  return {
    url: location.href, title: document.title, lang: document.documentElement.lang || null, generator,
    seo: { description: meta('description'), canonical: document.querySelector('link[rel=canonical]')?.href || null, robots: meta('robots'), ogTitle: meta('og:title'), ogImage: meta('og:image'), twitterCard: meta('twitter:card'), jsonLd: [...new Set(ld)], h1Count: document.querySelectorAll('h1').length, headings, imgs, imgNoAlt, favicon: document.querySelector('link[rel*=icon]')?.href || null, themeColor: meta('theme-color') },
    design: { bg: top(bg), text: top(fg), border: top(border, 6), fonts: top(fam, 8), fontSizes: top(sizes, 16), radius: top(radius, 8), shadows: top(shadows, 5), transitions: top(transitions, 8), typo, cssVars: vars, fontFaces: fontFaces.slice(0, 40), keyframes: [...keyframes].slice(0, 60), breakpoints: top(media, 12), rulesCount, crossOriginSheets: crossOrigin },
    structure: { sections, navLinks, ctas, pageHeight: document.documentElement.scrollHeight, counts: { canvas, videos, imgs, svgs, iframes, domNodes: document.getElementsByTagName('*').length } },
    tech, scripts: scripts.slice(0, 80), internal,
    perf: { ttfb: Math.round(nav.responseStart || 0), dcl: Math.round(nav.domContentLoadedEventEnd || 0), load: Math.round(nav.loadEventEnd || 0), lcp: Math.round((window.__perf || {}).lcp || 0), lcpEl: (window.__perf || {}).lcpEl, cls: Number(((window.__perf || {}).cls || 0).toFixed(3)) },
  };
}


// capture d'écran via CDP direct (ne bloque pas la file Playwright), avec délai max
const cdpCache = new WeakMap();
async function shot(page, file, { quality = 78, full = false, maxH = 16000, timeout = 15000 } = {}) {
  let c = cdpCache.get(page); if (!c) { c = await page.context().newCDPSession(page); cdpCache.set(page, c); }
  const opts = { format: 'jpeg', quality };
  if (full) {
    const m = await withTimeout(c.send('Page.getLayoutMetrics'), 5000, 'metrics');
    const w = Math.ceil(m.cssContentSize ? m.cssContentSize.width : 1440), h = Math.min(maxH, Math.ceil(m.cssContentSize ? m.cssContentSize.height : 900));
    Object.assign(opts, { captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: h, scale: 1 } });
  }
  const r = await withTimeout(c.send('Page.captureScreenshot', opts), timeout, 'shot');
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
}
const live = new Map();
function killTree(pid) { try { execFileSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore', timeout: 15000 }); } catch (e) {} }
async function rmProfile(dir) { for (let i = 0; i < 8; i++) { try { fs.rmSync(dir, { recursive: true, force: true }); if (!fs.existsSync(dir)) return; } catch (e) {} await sleep(1500); } }
// profils Chrome jetables laissés par un run précédent
for (const d of fs.readdirSync(os.tmpdir())) if (d.startsWith('biblio-')) { try { fs.rmSync(path.join(os.tmpdir(), d), { recursive: true, force: true }); } catch (e) {} }

// ---------- helpers navigation ----------
async function dismiss(page) {
  const clicked = [];
  const sels = ['#onetrust-accept-btn-handler', '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', '#axeptio_btn_acceptAll', '.cky-btn-accept', '[data-cookiefirst-action="accept"]', '#didomi-notice-agree-button', '.fc-cta-consent'];
  for (const s of sels) { try { const el = await page.$(s); if (el && await el.isVisible()) { await el.click({ timeout: 1500 }); clicked.push(s); } } catch (e) {} }
  try {
    const re = /^(accept( all)?( cookies)?|allow( all)?|agree|i agree|ok|got it|accepter|tout accepter|j'accepte|aceptar( todo)?|akzeptieren|alle akzeptieren|accetta( tutto)?|accepteren|alles accepteren)$/i;
    const btns = await page.$$('button, a[role=button], [class*=cookie] a, [class*=consent] a');
    for (const b of btns.slice(0, 200)) { const t = ((await b.textContent().catch(() => '')) || '').trim(); if (re.test(t) && await b.isVisible().catch(() => false)) { await b.click({ timeout: 1500 }).catch(() => {}); clicked.push('txt:' + t); break; } }
  } catch (e) {}
  return clicked;
}
async function enterExperience(page) {
  try {
    const re = /^(enter|enter site|enter experience|start|start experience|explore|begin|discover|entrer|let'?s go|play|continue|sound on|with sound|without sound|sound off|skip( intro)?)$/i;
    const els = await page.$$('button, a, [role=button], div[class*=enter], div[class*=start]');
    for (const b of els.slice(0, 300)) { const t = ((await b.textContent().catch(() => '')) || '').trim(); if (t.length < 25 && re.test(t) && await b.isVisible().catch(() => false)) { await b.click({ timeout: 2000 }).catch(() => {}); await sleep(2500); return t; } }
  } catch (e) {}
  return null;
}
async function scrollFrames(page, dir, prefix, maxFrames, vh) {
  const frames = [];
  await page.mouse.move(vh * 0.8, vh / 2).catch(() => {});
  for (let i = 0; i < maxFrames; i++) {
    const f = `${prefix}-${String(i + 1).padStart(2, '0')}.jpg`;
    try { await shot(page, path.join(dir, f)); frames.push(f); } catch (e) { break; }
    const before = await page.evaluate(() => [scrollY, document.documentElement.scrollHeight]).catch(() => [0, 0]);
    for (let k = 0; k < 6; k++) { await page.mouse.wheel(0, vh * 0.15).catch(() => {}); await sleep(90); }
    await sleep(900);
    const after = await page.evaluate(() => [scrollY, document.documentElement.scrollHeight]).catch(() => [0, 0]);
    // scroll natif bloqué et page non scrollée (WebGL / scroll virtuel) : on s'arrête après 3 vues identiques
    if (after[0] === before[0] && after[0] + vh >= after[1] - 2 && i >= 2) {
      if (frames.length >= 3 && after[1] <= vh + 5) { /* page virtuelle : on continue un peu, le scroll peut être interne */ if (i >= 6) break; }
      else if (after[1] > vh + 5) break;
    }
  }
  return frames;
}

// ---------- empreintes des librairies dans le JS/CSS récupéré ----------
const SIGS = {
  'GSAP': /GreenSock|gsap\.registerPlugin|_gsScope|gsap\.to\(|"gsap"/, 'ScrollTrigger': /ScrollTrigger/, 'SplitText/SplitType': /SplitText|SplitType|splitting/i,
  'Flip (GSAP)': /\bFlip\.getState/, 'DrawSVG/MorphSVG': /DrawSVGPlugin|MorphSVGPlugin/, 'Lenis': /lenis/i, 'Locomotive Scroll': /locomotive/i,
  'Three.js': /WebGLRenderer|three\.module|__THREE__/, 'React Three Fiber': /@react-three\/fiber|useFrame|R3F/, 'Drei': /@react-three\/drei/, 'OGL': /\bogl\b|new Renderer\(\{[^}]*dpr/,
  'PixiJS': /PIXI\.|pixi\.js|@pixi\//, 'Babylon.js': /BABYLON\./, 'PlayCanvas': /playcanvas/i, 'Curtains.js': /curtainsjs|Curtains\(/, 'Postprocessing': /EffectComposer|postprocessing/,
  'Theatre.js': /@theatre\/|theatre-studio/, 'Rive': /@rive-app|rive\.wasm/, 'Lottie': /bodymovin|lottie/i, 'Spline': /@splinetool|spline-viewer/, 'Unicorn Studio': /unicornstudio/i,
  'Matter.js': /Matter\.Engine|matter-js/, 'Rapier/Cannon (physique)': /rapier|cannon-es|cannon\.js/i, 'Howler (audio)': /howler/i, 'Tone.js': /Tone\.Transport|tone\.js/i,
  'Barba.js': /barba/i, 'Swup': /swup/i, 'Highway': /Highway\.Core|@dogstudio\/highway/, 'Taxi.js': /@unseenco\/taxi|taxi\.Core/, 'Swiper': /swiper/i, 'Embla': /embla/i, 'Splide': /splide/i, 'Flickity': /flickity/i, 'Keen slider': /keen-slider/,
  'React': /react-dom|__SECRET_INTERNALS_DO_NOT_USE|createRoot\(/, 'Next.js': /__NEXT_DATA__|next\/dist|_next\/static/, 'Vue': /__VUE__|createApp\(|vue\.runtime/, 'Nuxt': /__NUXT__|nuxt/, 'Svelte': /svelte/i, 'Astro': /astro-island|astro:/,
  'Framer Motion': /framer-motion|motion-dom/, 'Motion One': /@motionone/, 'Anime.js': /anime\.js|animejs/i, 'Alpine.js': /Alpine\.start|alpinejs/, 'jQuery': /jQuery v?\d|jquery/i, 'Webflow (runtime)': /Webflow\.push|webflow\.js/,
  'Lil-GUI/Tweakpane (debug)': /lil-gui|tweakpane|dat\.gui/i, 'Stats.js': /stats\.min|new Stats\(/, 'Virtual scroll': /virtual-scroll/i, 'Stimulus/Hotwire': /@hotwired/, 'Sanity': /sanity/i, 'Prismic': /prismic/i, 'Contentful': /contentful/i, 'Storyblok': /storyblok/i, 'Shopify': /Shopify\./,
};
function fingerprint(jsDir, cssAll, dir) {
  const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
  const hits = {}; const shaders = []; let gsapVersion = null, threeRev = null;
  for (const f of files) {
    const t = fs.readFileSync(path.join(jsDir, f), 'utf8');
    for (const [k, re] of Object.entries(SIGS)) if (re.test(t)) (hits[k] = hits[k] || []).push(f);
    if (!gsapVersion) { const m = t.match(/GSAP\s+(3\.\d+\.\d+)|version\s*[:=]\s*"(3\.\d+\.\d+)"[^\n]{0,80}gsap/i); gsapVersion = m ? (m[1] || m[2]) : null; }
    if (!threeRev) { const m = t.match(/REVISION\s*=\s*"(\d{3})/); threeRev = m ? m[1] : null; }
    if (/gl_FragColor|gl_Position|fragColor|precision\s+(high|medium)p\s+float/.test(t)) {
      const re = /[`"']((?:[^`"'\\]|\\.){0,20000}?void\s+main\s*\((?:[^`"'\\]|\\.){20,20000}?)[`"']/g; let m;
      while ((m = re.exec(t)) && shaders.length < 40) if (!/#include\s*</.test(m[1]) && m[1].length > 80) shaders.push({ from: f, code: m[1].replace(/\\n/g, '\n').replace(/\\t/g, '  ').slice(0, 12000) });
    }
  }
  for (const [k, re] of Object.entries({ 'Lenis': /\.lenis\b/, 'Locomotive Scroll': /has-scroll-smooth|data-scroll-container/ })) if (re.test(cssAll)) (hits[k] = hits[k] || []).push('styles.css');
  if (shaders.length) fs.writeFileSync(path.join(dir, 'shaders.glsl'), shaders.map((s, i) => `// ===== shader ${i + 1} — ${s.from} =====\n${s.code}`).join('\n\n'));
  return { detected: Object.keys(hits), where: hits, gsapVersion, threeRevision: threeRev, shaders: shaders.length, scripts: files.length };
}

// ---------- capture d'un site ----------
async function captureSite(s, port) {
  const dir = path.join(ROOT, slug(s)); const cap = path.join(dir, 'captures');
  if (!force && fs.existsSync(path.join(dir, 'data.json'))) { const prev = JSON.parse(fs.readFileSync(path.join(dir, 'data.json'), 'utf8')); if (!(args.includes('--retry') && prev.status !== 'ok')) { log(s, 'déjà fait'); return; } }
  fs.mkdirSync(cap, { recursive: true });
  const t0 = Date.now();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'biblio-'));
  const chrome = spawn(CHROME, [`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--headless=new', '--no-first-run', '--no-default-browser-check',
    '--disable-background-timer-throttling', '--autoplay-policy=no-user-gesture-required', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--window-size=1440,900', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
  live.set(port, { pid: chrome.pid, s });
  const result = { id: s.id, name: s.name, sourceUrl: s.url, capturedAt: new Date().toISOString(), status: 'ok', errors: [], steps: {} };
  let browser;
  try {
    let ok = false; for (let i = 0; i < 40 && !ok; i++) { await sleep(250); try { ok = (await fetch(`http://127.0.0.1:${port}/json/version`)).ok; } catch (e) {} }
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
    // ---- desktop ----
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: cap, size: { width: 960, height: 600 } }, locale: 'fr-FR', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' });
    await ctx.addInitScript(INIT);
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page); await cdp.send('Network.enable');
    const net = new Map(); const cssTexts = []; const fontsLoaded = new Set();
    cdp.on('Network.responseReceived', e => net.set(e.requestId, { url: e.response.url, type: e.type, mime: e.response.mimeType, status: e.response.status, bytes: 0, proto: e.response.protocol }));
    cdp.on('Network.loadingFinished', e => { const r = net.get(e.requestId); if (r) r.bytes = e.encodedDataLength; });
    const jsDir = path.join(dir, 'scripts'); fs.mkdirSync(jsDir, { recursive: true }); let jsBytes = 0, jsN = 0; const jsIndex = [];
    page.on('response', async r => { try { const ct = r.headers()['content-type'] || '';
      if ((/javascript|ecmascript/.test(ct) || /\.m?js(\?|$)/.test(r.url())) && !/googletagmanager|google-analytics|gtag|hotjar|clarity|facebook|doubleclick|hubspot|cookiebot|onetrust|axept|didomi|recaptcha|gstatic/.test(r.url()) && jsBytes < 25e6) {
        const t = await r.text(); if (t.length > 200) { jsN++; jsBytes += t.length; const nm = String(jsN).padStart(3, '0') + '-' + (new URL(r.url()).pathname.split('/').pop() || 'index').replace(/\.m?js$/, '').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60).replace(/[._]+$/, '') + '.js'; fs.writeFileSync(path.join(jsDir, nm), t); jsIndex.push({ file: nm, url: r.url(), kb: Math.round(t.length / 1024) }); } } if (ct.includes('text/css') && cssTexts.length < 40) { const t = await r.text(); cssTexts.push(`/* ===== ${r.url()} ===== */\n` + t.slice(0, 3000000)); } if (/font|woff/.test(ct) || /\.(woff2?|ttf|otf)(\?|$)/.test(r.url())) fontsLoaded.add(r.url()); } catch (e) {} });
    let resp;
    try { resp = await page.goto(s.url, { waitUntil: 'load', timeout: 60000 }); }
    catch (e) { result.errors.push('goto load: ' + e.message.split('\n')[0]); try { resp = await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 }); } catch (e2) { result.errors.push('goto dcl: ' + e2.message.split('\n')[0]); } }
    result.httpStatus = resp ? resp.status() : null;
    await sleep(5000);
    if (process.env.DBG) log(s, 'étape 0', Math.round((Date.now()-t0)/1000)+'s'); result.steps.cookies = await dismiss(page);
    await shot(page, path.join(cap, 'desktop-00-arrivee.jpg'), { quality: 80 }).catch(e => result.errors.push('shot0 ' + e.message));
    if (process.env.DBG) log(s, 'étape 1', Math.round((Date.now()-t0)/1000)+'s'); result.steps.enter = await enterExperience(page);
    await sleep(1500);
    const reaP = Promise.resolve(); result.steps.rea = 'passe hors ligne (rea-pass.mjs)';
    // extraction
    if (process.env.DBG) log(s, 'étape 3', Math.round((Date.now()-t0)/1000)+'s'); try { Object.assign(result, await withTimeout(page.evaluate(EXTRACT), 60000, 'extract')); } catch (e) { result.errors.push('extract: ' + e.message.split('\n')[0]); }
    // scroll
    if (process.env.DBG) log(s, 'étape 4', Math.round((Date.now()-t0)/1000)+'s'); result.steps.desktopFrames = await scrollFrames(page, cap, 'desktop', 14, 900);
    // pleine page (après scroll, pour déclencher le lazy-load)
    try {
      if (process.env.DBG) log(s, 'étape 5', Math.round((Date.now()-t0)/1000)+'s'); await page.evaluate(() => window.scrollTo(0, 0)); await sleep(800);
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      if (h > 950) await shot(page, path.join(cap, 'desktop-pleine-page.jpg'), { quality: 70, full: true, timeout: 40000 });
      result.steps.fullPage = h > 950 ? h : 'page non scrollable (scroll virtuel/WebGL)';
    } catch (e) { result.errors.push('fullpage: ' + e.message.split('\n')[0]); }
    if (process.env.DBG) log(s, 'étape 6', Math.round((Date.now()-t0)/1000)+'s'); try { fs.writeFileSync(path.join(dir, 'page.html'), await page.content()); } catch (e) {}
    fs.writeFileSync(path.join(dir, 'styles.css'), cssTexts.join('\n\n'));
    fs.writeFileSync(path.join(jsDir, '_index.json'), JSON.stringify(jsIndex, null, 1));
    try { result.libs = fingerprint(jsDir, cssTexts.join('\n'), dir); } catch (e) { result.errors.push('fingerprint: ' + e.message); }
    // réseau
    const reqs = [...net.values()]; const byType = {};
    for (const r of reqs) { byType[r.type] = byType[r.type] || { n: 0, kb: 0 }; byType[r.type].n++; byType[r.type].kb += r.bytes / 1024; }
    Object.values(byType).forEach(v => v.kb = Math.round(v.kb));
    result.network = { requests: reqs.length, totalKb: Math.round(reqs.reduce((a, r) => a + r.bytes, 0) / 1024), byType, thirdPartyHosts: [...new Set(reqs.map(r => { try { return new URL(r.url).host; } catch (e) { return null; } }).filter(h => h && !s.url.includes(h.replace(/^www\./, ''))))].slice(0, 40), fontFiles: [...fontsLoaded].slice(0, 30), biggest: reqs.sort((a, b) => b.bytes - a.bytes).slice(0, 8).map(r => ({ url: r.url.slice(0, 160), kb: Math.round(r.bytes / 1024), type: r.type })) };
    // pages internes
    result.steps.subpages = [];
    const picks = []; const seen = new Set();
    for (const u of (result.internal || [])) { const p = new URL(u).pathname.split('/').filter(Boolean)[0] || ''; if (!seen.has(p) && p) { seen.add(p); picks.push(u); } if (picks.length >= 3) break; }
    if (process.env.DBG) log(s, 'étape 7', Math.round((Date.now()-t0)/1000)+'s'); await withTimeout(reaP, 250000, 'rea').catch(e => { result.steps.rea = 'abandon: ' + e.message; }); const video = page.video(); await ctx.close();
    try { const vp = await video.path(); fs.renameSync(vp, path.join(cap, 'desktop-scroll.webm')); result.steps.video = 'desktop-scroll.webm'; } catch (e) {}
    const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR' }); const page2 = await ctx2.newPage();
    for (const [i, u] of picks.entries()) {
      const page = page2;
      try { await page.goto(u, { waitUntil: 'load', timeout: 40000 }); await sleep(3500); const fr = await scrollFrames(page, cap, `page${i + 1}`, 4, 900); result.steps.subpages.push({ url: u, frames: fr }); }
      catch (e) { result.steps.subpages.push({ url: u, error: e.message.split('\n')[0] }); }
    }
    await ctx2.close();
    for (const f of fs.readdirSync(cap)) if (f.endsWith('.webm') && f !== 'desktop-scroll.webm') { try { fs.unlinkSync(path.join(cap, f)); } catch (e) {} }
    if (process.env.DBG) log(s, 'étape 8', Math.round((Date.now()-t0)/1000)+'s'); // ---- mobile ----
    try {
      const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'fr-FR', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' });
      const mp = await m.newPage();
      try { await mp.goto(s.url, { waitUntil: 'load', timeout: 50000 }); } catch (e) { result.errors.push('mobile goto: ' + e.message.split('\n')[0]); }
      await sleep(4500); await dismiss(mp); await enterExperience(mp);
      const mf = [];
      for (let i = 0; i < 6; i++) {
        const f = `mobile-${String(i + 1).padStart(2, '0')}.jpg`;
        try { await shot(mp, path.join(cap, f), { quality: 75 }); mf.push(f); } catch (e) { break; }
        await mp.evaluate(() => window.scrollBy(0, innerHeight * 0.9)).catch(() => {});
        await mp.mouse.wheel(0, 760).catch(() => {}); await sleep(1100);
      }
      if (process.env.DBG) log(s, 'étape 9', Math.round((Date.now()-t0)/1000)+'s'); result.steps.mobileFrames = mf;
      result.mobile = await mp.evaluate(() => ({ h1: (() => { const h = document.querySelector('h1'); if (!h) return null; const c = getComputedStyle(h); return { size: c.fontSize, lineHeight: c.lineHeight }; })(), body: getComputedStyle(document.body).fontSize, overflowX: document.documentElement.scrollWidth > innerWidth + 2, burger: !!document.querySelector('[class*=burger],[class*=hamburger],[aria-label*=menu i],[class*=menu-toggle],[class*=menu-btn]') })).catch(() => null);
      await m.close();
    } catch (e) { result.errors.push('mobile: ' + e.message.split('\n')[0]); }
  } catch (e) { result.status = 'erreur'; result.errors.push(e.message.split('\n')[0]); }
  finally {
    try { await withTimeout(browser?.close() || Promise.resolve(), 8000, 'close'); } catch (e) {}
    killTree(chrome.pid); live.delete(port);
    await rmProfile(profile);
  }
  if (!result.title && !result.design) result.status = 'inaccessible';
  else if (result.httpStatus && result.httpStatus >= 400) result.status = 'http ' + result.httpStatus;
  if (s.aborted) return;
  result.durationS = Math.round((Date.now() - t0) / 1000);
  fs.writeFileSync(path.join(dir, 'data.json'), JSON.stringify(result, null, 1));
  log(s, result.status, `${result.durationS}s`, result.errors.length ? 'erreurs: ' + result.errors.join(' | ').slice(0, 200) : '');
}

// ---------- publication GitHub (un site à la fois, dans un processus séparé pour ne pas bloquer les captures) ----------
const noPublish = process.argv.includes('--no-publish');
let pubChain = Promise.resolve();
function publish(sl) {
  pubChain = pubChain.then(() => new Promise(res => {
    const p = spawn(process.execPath, [path.join(path.dirname(fileURLToPath(import.meta.url)), 'publier.mjs'), sl], { stdio: ['ignore', 'ignore', 'inherit'] });
    p.on('close', () => res()); p.on('error', () => res());
  }));
}

// ---------- file d'attente ----------
const queue = [...wanted];
await Promise.all(Array.from({ length: Math.min(conc, queue.length) }, async (_, w) => {
  while (queue.length) { const s = queue.shift(); const port = 9400 + s.id;
    try { await withTimeout(captureSite(s, port), 11 * 60000, 'site'); }
    catch (e) { s.aborted = true; const l = live.get(port); if (l) killTree(l.pid); live.delete(port); log(s, 'ÉCHEC', e.message);
      const df = path.join(ROOT, slug(s), 'data.json'); if (!fs.existsSync(df)) { fs.mkdirSync(path.dirname(df), { recursive: true }); fs.writeFileSync(df, JSON.stringify({ id: s.id, name: s.name, sourceUrl: s.url, status: 'timeout', errors: [e.message], capturedAt: new Date().toISOString() })); } }
    if (!noPublish) publish(slug(s)); }
}));
await pubChain;
console.log('Terminé.');
