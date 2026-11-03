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
      while ((m = re.exec(t)) && shaders.length < 40) shaders.push({ from: f, code: m[1].replace(/\\n/g, '\n').replace(/\\t/g, '  ').slice(0, 12000) });
    }
  }
  for (const [k, re] of Object.entries({ 'Lenis': /\.lenis\b/, 'Locomotive Scroll': /has-scroll-smooth|data-scroll-container/ })) if (re.test(cssAll)) (hits[k] = hits[k] || []).push('styles.css');
  if (shaders.length) fs.writeFileSync(path.join(dir, 'shaders.glsl'), shaders.map((s, i) => `// ===== shader ${i + 1} — ${s.from} =====\n${s.code}`).join('\n\n'));
  return { detected: Object.keys(hits), where: hits, gsapVersion, threeRevision: threeRev, shaders: shaders.length, scripts: files.length };
}
