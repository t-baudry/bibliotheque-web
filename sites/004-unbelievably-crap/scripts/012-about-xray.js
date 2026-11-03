/* ==========================================================================
   about-xray.js — the dual-scene fluid x-ray reveal.

   After the Codrops tutorial "Building a Dual-Scene Fluid X-Ray Reveal Effect
   in Three.js" (tympanus.net, 23 Mar 2026) and its repo, cullenwebber/three-skull.
   The technique, not the file: the demo composes twelve instanced figures in a
   hex grid with bloom, scan lines and CRT grading, on WebGPU via TSL. This page
   wanted one figure, no post-processing, and classic three.js, so what is
   reproduced here is the mechanism —

     scene A   the body, shaded exactly as js/about-figure.js shades it
     scene B   the skeleton, Fresnel-lit so its edges glow and the faces
               pointing at the camera stay dark: the holographic x-ray read
     fluid     a ping-ponged buffer the pointer writes into, decaying each
               frame and displaced by FBM noise so the boundary crawls
     composite one full-screen quad mixing A and B by the fluid

   — and not its plumbing. WebGPU and TSL buy the demo a node graph shared
   across twelve instances and a stack of post effects; with one figure and no
   post, they would only buy a hard requirement.

   WHY THE OLD RENDERER IS STILL HERE
   This is the first thing in the project that could not be tested before it
   was sent: three.js cannot be fetched from the sandbox this was written in
   (npm and every CDN answer 403), so none of the code below has ever run. The
   structure is the mitigation. js/about-figure.js keeps running and keeps
   owning the canvas; this module builds its own in parallel and takes over
   ONLY after a frame has actually been drawn — see `handOver()`. Anything that
   goes wrong before that point (CDN blocked, API drift between three versions,
   a shader that will not compile, no WebGL2) leaves the page exactly as it was
   and says why in the console. There is no state in which the figure vanishes.

   The saturation layer and the film grain are DOM layers above the canvas, so
   they apply to the composited result without this module touching them —
   which is what "both scenes get the treatment" asked for.
   ========================================================================== */
window.PAGE.register('about-xray', function (scope) {
  'use strict';

  /* #aboutFigure is the CANVAS, not a container — .about__figure is the box
     around it. Getting this wrong is silent and total: appending a canvas to a
     canvas makes it FALLBACK content, which never renders and throws nothing,
     so the effect would have been invisible on a working machine with no
     error to explain it. */
  const oldCanvas = scope.querySelector('#aboutFigure');
  const host = scope.querySelector('.about__figure');
  if (!host || !oldCanvas) return;

  /* Both meshes are named by the page, for the same reason js/about-figure.js
     names one: another page can point this at a different pair without About
     changing. Absent, they are the figure and its retopology. */
  const OUTER_VAR = scope.dataset.figureVar || 'FIGURE_MESH';
  const OUTER_SRC = scope.dataset.figureSrc || 'assets/about/figure.js';
  const INNER_VAR = scope.dataset.innerVar  || 'SKELETON_MESH';
  const INNER_SRC = scope.dataset.innerSrc  || 'assets/about/skeleton.js';

  const CONFIG = {
    enabled: true,

    // ---- fluid ----
    /* Splat radius as a fraction of the simulation's HEIGHT, so the trail is
       the same physical size whatever the sim resolution is set to. */
    radius: 0.06,
    strength: 0.25,     // how hard the pointer writes
    decay: 0.995,       // per 1/60s; time-corrected, so it is refresh-independent
    displace: 0.01,   // how far the FBM field pushes the trail each frame
    noiseScale: 12,   // FBM frequency
    noiseSpeed: 0.46,  // FBM drift, in noise-units per second
    edge: 1,        // where the mask flips from body to skeleton
    soft: 0.38,        // how soft that boundary is
    /* How much of the BODY survives inside the revealed area, and how much of
       the skeleton is added. Together they decide what "x-ray" means here:

         bodyOpacity 0    a hole — the body is replaced outright, which is what
                          this did before the pair existed
         bodyOpacity ~.25 the body ghosts through the bone, which is what an
                          x-ray actually looks like and why this is the default

       At bodyOpacity 0 and skelOpacity 1 the composite reduces exactly to the
       mix() it replaced, so nothing that was tuned against the old behaviour
       is lost — it is one value away. */
    bodyOpacity: 1,
    skelOpacity: 2.0,
    simScale: 0.5,     // sim resolution as a share of the canvas

    // ---- skeleton ----
    fresnelPower: 1.6, // higher = a thinner rim
    fresnelGain: 1.55,
    skelCore: 0.08,    // brightness of surfaces facing the camera
    skelTint: '#a8caff',
    /* SKELET.glb is not a skeleton — it is a low-poly retopology of the SAME
       figure: same cap, same slouch, same phone. So the two meshes are the
       same subject at two levels of detail, and at unit height they line up at
       scale 1 with no offset. Rendering it proved that; the measurements that
       suggested otherwise (shoulders at 0.65 against 0.68) were the cap being
       counted differently, not two different bodies.

       The full transform is exposed anyway, because a reveal that lands
       slightly off register is a legitimate thing to want. */
    skelScale: 0.972,
    skelPosX: 0.004, skelPosY: 0.024, skelPosZ: 0.0,
    skelRotX: 0.0, skelRotY: 0.0, skelRotZ: 0.0,

    // ---- bloom ----
    bloom: true,
    bloomThreshold: 0.79,  // luminance above which a pixel glows
    bloomKnee: 1,       // how gradually it comes in above the threshold
    bloomIntensity: 0.85,
    bloomRadius: 0.85,      // blur spread, in half-res texels per tap
    bloomPasses: 3,        // H+V blur pairs; each one widens the glow
    bloomScale: 0.55,       // bloom buffer size as a share of the canvas

    /* ---- CRT ----
       The rest of the tutorial's post stack, now on. It all happens in the
       final combine pass — no extra render targets — so it costs one more
       branch, not a frame.

       Worth knowing before judging it: this canvas is only the figure's box,
       420px wide, not the page. A CRT treatment here reads as the FIGURE being
       on a monitor, not the site being on one. Scanlines and vignette also
       multiply alpha as well as colour, so they cut into the figure's coverage
       and show as dark bands against the page rather than washing over it. */
    crt: true,
    crtScanCount: 370,     // scan lines down the canvas
    crtScanDepth: 0.32,    // how dark the dark ones are
    crtAberration: 0.0044, // RGB split, in uv · the single most CRT-ish dial
    crtCurvature: 0,    // barrel distortion; 0 is flat
    crtVignette: 1.0,
    crtContrast: 0.95,
    crtSaturation: 2.0,
  };

  /* Version-pinned, and a cascade rather than one URL. UMD was removed from
     three.js at r160, so this cannot simply track latest — a module build
     would need an import map and would not define window.THREE at all. Each
     candidate is tried in turn and the first that defines THREE wins. */
  const SOURCES = [
    'https://cdn.jsdelivr.net/npm/three@0.159.0/build/three.min.js',
    'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js',
    'https://unpkg.com/three@0.159.0/build/three.min.js',
  ];

  let alive = true, raf = 0, renderer = null, gaveUp = false;
  /* DORMANT. Set from js/dormancy.js when block 01 is not on screen. Distinct
     from CONFIG.enabled on purpose: `enabled` is the user's off switch and it
     hides the canvas and hands the silhouette back, which is a visible state
     change and wrong to perform on a scroll. This one changes nothing anyone
     can see — the canvas keeps its last frame, which is invisible anyway — and
     only stops the fluid step and the draw. */
  let dormant = false;
  const on = window.PAGE.bindings();

  /* Published NOW, not when the scene finishes building. js/about-console.js
     binds its rows to this object as the panel is constructed, and the build
     below is async — three.js has to come off a CDN first. Bind late and every
     x-ray row on the panel would be dead. `readout` is replaced once there is
     something to report. */
  window.XRAY = {
    config: CONFIG,
    apply(){},
    /* Replaced once the scene exists. Present on the stub so a caller that
       arrives during the three.js load does not have to feature-test. */
    setDormant(v){ dormant = !!v; },
    readout(){ return { xray: gaveUp ? 'failed' : 'loading three.js…' }; },
  };

  /* One schema, spread into every panel that wants it — the About page's and
     the model room's. Duplicating four groups of controls across two consoles
     is how the two copies drift apart, and these are the same live config. */
  window.XRAY.groups = function (){
    return [
      { name: 'X-ray', open: false, rows: (function(){
        const X = window.XRAY;
        if (!X) return [];
        const num = (key, min, max, step, hint) => ({
          label: 'xray.' + key, min, max, step, hint,
          get: () => X.config[key], set: v => { X.config[key] = v; },
        });
        return [
          { label:'xray.enabled', options:['on','off'],
            get: () => X.config.enabled ? 'on' : 'off',
            set: v => { X.config.enabled = (v === 'on'); },
            hint:'off puts the plain figure back · the original renderer never stopped, it was only hidden' },
          num('radius', 0.01, 0.4, 0.005, 'size of the pointer trail, as a share of the canvas height'),
          num('strength', 0, 2, 0.05, 'how hard the pointer opens the body'),
          num('decay', 0.8, 0.995, 0.001, 'how fast the reveal heals · quoted per 1/60s and time-corrected, so it is the same on 60Hz and 120Hz'),
          num('displace', 0, 0.02, 0.0005, 'how far the noise field drags the trail each frame · 0 freezes the shape and it stops looking like fluid'),
          num('noiseScale', 0.5, 12, 0.1, 'size of the turbulence'),
          num('noiseSpeed', 0, 1, 0.01, 'how fast the turbulence drifts'),
          num('edge', 0, 1, 0.01, 'where the mask flips from body to bone'),
          num('soft', 0.01, 0.6, 0.01, 'how soft that boundary is · low is a hard cut, high is a dissolve'),
          num('bodyOpacity', 0, 1, 0.01, 'how much of the BODY survives where you have hovered · 0 is a hole cut clean through, which is what this did before. Around 0.25 the body ghosts under the bone, which is what an x-ray looks like'),
          num('skelOpacity', 0, 2, 0.02, 'how strongly the inner figure comes up · above 1 it starts to blow out, which may be what you want'),
          num('simScale', 0.125, 1, 0.025, 'fluid resolution as a share of the canvas · the one real performance dial here'),
          num('fresnelPower', 0.5, 8, 0.1, 'thinner rim as this goes up'),
          num('fresnelGain', 0, 4, 0.05, 'brightness of the glowing edge'),
          num('skelCore', 0, 1, 0.01, 'brightness of bone facing you · near 0 is what makes it read as x-ray rather than as a lit model'),
          /* THE FULL SPECTRUM, not a list. This shipped as five swatches, and
             five is exactly wrong for the one thing anyone asks of it: the
             reveal is the page's loudest colour and the whole point of a
             control on it is to try things. The site red was already in the
             list and still took a code change to reach anything else. */
          { label:'xray.skelTint', colour: true,
            get: () => X.config.skelTint, set: v => { X.config.skelTint = v; },
            hint: 'the colour the body opens into under the pointer · #a8caff is the blue it ships with, #e8271c is the site red' },
        ];
      })() },

      { name: 'X-ray · inner figure', open: false, rows: (function(){
        const X = window.XRAY;
        if (!X) return [];
        const num = (key, min, max, step, hint) => ({
          label: 'xray.' + key, min, max, step, hint,
          get: () => X.config[key], set: v => { X.config[key] = v; },
        });
        return [
          num('skelScale', 0.5, 1.6, 0.002, 'SKELET.glb is a low-poly retopology of the same figure, so 1.0 registers exactly. Everything here is for deliberately throwing it off'),
          num('skelPosX', -0.4, 0.4, 0.002, 'left / right'),
          num('skelPosY', -0.4, 0.4, 0.002, 'up / down'),
          num('skelPosZ', -0.4, 0.4, 0.002, 'towards / away from the camera'),
          num('skelRotX', -180, 180, 1, 'pitch'),
          num('skelRotY', -180, 180, 1, 'yaw · added to the scroll spin, not replacing it, so the two stay locked'),
          num('skelRotZ', -180, 180, 1, 'roll'),
        ];
      })() },

      { name: 'X-ray · bloom', open: false, rows: (function(){
        const X = window.XRAY;
        if (!X) return [];
        const num = (key, min, max, step, hint) => ({
          label: 'xray.' + key, min, max, step, hint,
          get: () => X.config[key], set: v => { X.config[key] = v; },
        });
        return [
          { label:'xray.bloom', options:['on','off'],
            get: () => X.config.bloom ? 'on' : 'off',
            set: v => { X.config.bloom = (v === 'on'); } },
          num('bloomThreshold', 0, 1.5, 0.01, 'luminance a pixel has to beat to glow · the Fresnel rims are the bright part of the image, so this mostly selects them'),
          num('bloomKnee', 0.01, 1, 0.01, 'how gradually the glow comes in above the threshold · low is a hard cut and shows as a ring'),
          num('bloomIntensity', 0, 3, 0.05, 'how much of the blur is added back'),
          num('bloomRadius', 0.25, 4, 0.05, 'spread per blur pass'),
          num('bloomPasses', 1, 6, 1, 'blur pairs · each one roughly doubles the spread for the cost of one pass'),
          num('bloomScale', 0.125, 1, 0.025, 'bloom buffer size as a share of the canvas · halving it is nearly free and barely visible on a glow'),
        ];
      })() },

      { name: 'X-ray · CRT', open: false, rows: (function(){
        const X = window.XRAY;
        if (!X) return [];
        const num = (key, min, max, step, hint) => ({
          label: 'xray.' + key, min, max, step, hint,
          get: () => X.config[key], set: v => { X.config[key] = v; },
        });
        return [
          { label:'xray.crt', options:['off','on'],
            get: () => X.config.crt ? 'on' : 'off',
            set: v => { X.config.crt = (v === 'on'); },
            hint:'the rest of the tutorial\'s post stack · note this canvas is only the figure\'s 420px box, so it reads as the FIGURE being on a monitor, not the site' },
          num('crtScanCount', 60, 1200, 10, 'scan lines down the canvas · near the pixel height they start to alias into moire, which is either the look or a bug depending on your mood'),
          num('crtScanDepth', 0, 1, 0.01, 'how dark the dark lines are · scales alpha too, so the bands cut into the figure rather than washing over the page'),
          num('crtAberration', 0, 0.02, 0.0002, 'RGB split, growing from the centre outward as a real lens does · the single most CRT-ish dial here'),
          num('crtCurvature', 0, 0.4, 0.005, 'barrel distortion · anything outside the tube is discarded rather than clamped, which would smear the edge into a streak'),
          num('crtVignette', 0, 1, 0.01, 'darkening toward the corners'),
          num('crtContrast', 0.5, 2, 0.01, 'about mid grey'),
          num('crtSaturation', 0, 2, 0.01, 'about luma · this compounds with the page\'s saturation layer, which is already at full'),
        ];
      })() },
    ];
  };

  function giveUp(why, err){
    if (gaveUp) return;
    gaveUp = true;
    console.warn('[about-xray] not running — the page keeps the existing ' +
                 'figure renderer. Reason: ' + why, err || '');
    cleanup();
  }

  /* ---------------- loading ------------------------------------------------ */

  function loadScript(src){
    return new Promise((res, rej) => {
      const el = document.createElement('script');
      el.src = src;
      el.async = true;
      el.onload = () => res();
      el.onerror = () => rej(new Error('failed to load ' + src));
      document.head.appendChild(el);
    });
  }

  /* ONE LOAD, however many callers. Barba mounts this page's modules, then
     mounts them again over the same window, so boot() runs twice and both
     copies reached the cascade below with window.THREE still undefined — two
     script tags, two copies of a 600KB library in memory, and Chrome's
     "Multiple instances of Three.js being imported". Memoising the promise
     means the second caller waits on the first fetch instead of starting its
     own. */
  function loadThree(){
    if (window.THREE) return Promise.resolve(window.THREE);
    /* ON THE WINDOW, not in this closure. The first attempt at this memo was a
       module-scope `let`, which is per-MOUNT here — PAGE.register's callback is
       the module, and Barba runs it twice over the same window, so the two
       boots each got their own null and each started its own fetch. The window
       is the only scope both of them share. */
    if (window.__threeLoading) return window.__threeLoading;
    window.__threeLoading = loadThreeOnce();
    return window.__threeLoading;
  }

  async function loadThreeOnce(){
    if (window.THREE) return window.THREE;
    for (const src of SOURCES){
      try {
        await loadScript(src);
        if (window.THREE) return window.THREE;
      } catch (e){ /* try the next one */ }
    }
    throw new Error('three.js could not be loaded from any CDN');
  }

  /* Meshes ship as <script>-defined globals rather than files this fetches,
     for the reason spelled out in tools/decimate-glb.py: fetch() is refused on
     file://, so a fetched model silently never arrives when the page is opened
     off disk. Same pattern as js/about-figure.js. */
  function loadMesh(varName, src){
    return new Promise((res, rej) => {
      if (window[varName] && window[varName].b64) return res(window[varName]);
      const existing = document.querySelector(`script[data-mesh-var="${varName}"]`);
      if (existing){
        existing.addEventListener('load', () => res(window[varName]), { once: true });
        existing.addEventListener('error', () => rej(new Error(src)), { once: true });
        return;
      }
      const el = document.createElement('script');
      el.dataset.meshVar = varName;
      el.src = src;
      el.onload = () => window[varName] && window[varName].b64
        ? res(window[varName]) : rej(new Error(varName + ' loaded but empty'));
      el.onerror = () => rej(new Error('failed to load ' + src));
      document.head.appendChild(el);
    });
  }

  /* Dequantised on the CPU into plain Float32Arrays rather than handed to
     three as normalised integer attributes. The GPU path is smaller and the
     raw renderer uses it, but it depends on three's handling of `normalized`
     matching WebGL's, which is one more thing that cannot be checked from here.
     120k vertices of float32 is about 1.4 MB — worth it for one less unknown. */
  function geometry(THREE, m){
    const bin = atob(m.b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

    const q = new Uint16Array(bytes.buffer, 0, m.verts * 3);
    const n8 = new Int8Array(bytes.buffer, m.verts * 6, m.verts * 3);
    const idxAt = m.idxOffset != null ? m.idxOffset : m.verts * 9;
    const idx = m.idxBytes === 4
      ? new Uint32Array(bytes.buffer, idxAt, m.indices)
      : new Uint16Array(bytes.buffer, idxAt, m.indices);

    const pos = new Float32Array(m.verts * 3);
    const nrm = new Float32Array(m.verts * 3);
    const span = [m.max[0] - m.min[0], m.max[1] - m.min[1], m.max[2] - m.min[2]];
    for (let i = 0; i < m.verts; i++){
      for (let k = 0; k < 3; k++){
        pos[i*3+k] = m.min[k] + (q[i*3+k] / 65535) * span[k];
        nrm[i*3+k] = n8[i*3+k] / 127;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
    // the index array is a view onto the base64 blob; copy so it owns its buffer
    g.setIndex(new THREE.BufferAttribute(idx.slice(), 1));
    return g;
  }

  /* hex -> rgb normalised so its mean is 1. Lifted from js/about-figure.js on
     purpose: the body must be shaded by the same numbers here as there, or
     handing over would be visible as a colour step. */
  function tintVec(hex){
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '#ffffff'));
    if (!m) return [1, 1, 1];
    const n = parseInt(m[1], 16);
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    const avg = (c[0] + c[1] + c[2]) / 3 || 1;
    return c.map(v => v / avg);
  }

  /* ---------------- shaders ------------------------------------------------ */

  // Scene A. Character for character the lighting model in js/about-figure.js.
  const BODY_FRAG = `
    precision mediump float;
    varying vec3 vN, vP;
    uniform vec3 uLight, uTint;
    uniform float uAmbient, uDiffuse, uRim, uTone, uGrain, uSeed;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    void main(){
      vec3 n = normalize(vN);
      float d = max(dot(n, normalize(uLight)), 0.0);
      vec3 v = normalize(-vP);
      float r = pow(1.0 - max(dot(n, v), 0.0), 2.5);
      float s = (uAmbient + uDiffuse * d + uRim * r) * uTone;
      vec2 sp = gl_FragCoord.xy + uSeed;
      vec3 noise = vec3(hash(sp), hash(sp + 17.3), hash(sp + 41.7)) - 0.5;
      gl_FragColor = vec4(clamp(vec3(s) * uTint + noise * uGrain, 0.0, 1.0), 1.0);
    }`;

  const SHARED_VERT = `
    varying vec3 vN, vP;
    void main(){
      vec4 wp = modelViewMatrix * vec4(position, 1.0);
      vP = wp.xyz;
      vN = normalMatrix * normal;
      gl_Position = projectionMatrix * wp;
    }`;

  /* Scene B. The whole x-ray read is here: brightness is driven by how far the
     surface is turned AWAY from the camera, so silhouette edges blaze and
     anything facing you falls to near black. It is the inverse of ordinary
     shading, which is why it looks like something seen through a body rather
     than lit from outside one. */
  const SKEL_FRAG = `
    precision mediump float;
    varying vec3 vN, vP;
    uniform vec3 uTint;
    uniform float uPower, uGain, uCore;
    void main(){
      vec3 n = normalize(vN);
      vec3 v = normalize(-vP);
      float f = pow(1.0 - abs(dot(n, v)), uPower);
      float s = uCore + uGain * f;
      gl_FragColor = vec4(clamp(vec3(s) * uTint, 0.0, 1.0), 1.0);
    }`;

  const QUAD_VERT = `
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

  /* The fluid. Not Navier-Stokes — the tutorial's is a decaying trail buffer
     pushed around by noise, which is what gives the boundary its crawl without
     the cost of a pressure solve.

     The splat is a CAPSULE along the segment the pointer travelled this frame,
     not a circle at its current position. A circle per frame breaks into a
     dotted line the moment the pointer moves faster than radius-per-frame, and
     the faster you move the more obviously it beads. */
  const FLUID_FRAG = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uPrev;
    uniform vec2 uFrom, uTo, uAspect;
    uniform float uRadius, uStrength, uDecay, uDisplace,
                  uNoiseScale, uNoiseSpeed, uTime, uDown;

    vec2 hash2(vec2 p){
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
    }
    float gnoise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
                     dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
                 mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                     dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 4; i++){ v += a * gnoise(p); p *= 2.02; a *= 0.5; }
      return v;
    }
    // distance to the segment ab, measured in aspect-corrected space so the
    // trail is round rather than an ellipse on a tall canvas
    float segDist(vec2 p, vec2 a, vec2 b){
      vec2 pa = (p - a) * uAspect, ba = (b - a) * uAspect;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
      return length(pa - ba * h);
    }

    void main(){
      // curl-ish offset: two FBM lookups a little apart give a divergence-free
      // enough field to push the trail around without it just smearing
      float n1 = fbm(vUv * uNoiseScale + vec2(0.0, uTime * uNoiseSpeed));
      float n2 = fbm(vUv * uNoiseScale + vec2(5.2, 1.3 - uTime * uNoiseSpeed));
      vec2 push = vec2(n2, -n1) * uDisplace;

      float prev = texture2D(uPrev, vUv - push).r * pow(uDecay, uDown);

      float d = segDist(vUv, uFrom, uTo);
      float splat = uStrength * exp(-(d * d) / max(uRadius * uRadius, 1e-6));

      gl_FragColor = vec4(clamp(prev + splat, 0.0, 1.0), 0.0, 0.0, 1.0);
    }`;

  const COMPOSITE_FRAG = `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uBody, uSkel, uFluid;
    uniform float uEdge, uSoft, uBodyOpacity, uSkelOpacity;
    void main(){
      float f = texture2D(uFluid, vUv).r;
      float m = smoothstep(uEdge - uSoft, uEdge + uSoft, f);
      vec4 b = texture2D(uBody, vUv);
      vec4 s = texture2D(uSkel, vUv);

      /* Two weights rather than one mix. The body falls from 1 to
         uBodyOpacity across the reveal instead of to zero, so it can be left
         faintly present under the bone; the skeleton comes up to uSkelOpacity.
         Set them to 0 and 1 and this is mix(b, s, m) exactly. */
      float bw = mix(1.0, uBodyOpacity, m);
      float sw = m * uSkelOpacity;

      /* Alpha is weighted the same way, which is the point rather than a
         detail: where the body has been opened and there is no bone behind it,
         the result is transparent and you see the page through the hole. That
         is what makes it read as looking THROUGH someone. */
      gl_FragColor = vec4(clamp(b.rgb * bw + s.rgb * sw, 0.0, 1.0),
                          clamp(b.a * bw + s.a * sw, 0.0, 1.0));
    }`;

  /* Bloom, hand-written. three's UnrealBloomPass lives in examples/jsm, which
     the UMD build does not carry and which is ESM-only — pulling it in would
     mean an import map and would undo the reason this page can be opened
     straight off disk. It is three passes and no dependency:

       bright   keep only what is above a luminance threshold, with a soft
                knee so the glow fades in rather than switching on at an edge
       blur     separable Gaussian, H then V, at half resolution, repeated —
                each pair roughly doubles the spread for the cost of one
       combine  the sharp composite plus the blurred bright pass

     The Fresnel rims are the bright part of the image by construction, so
     this lands on exactly the edges the effect is about. */
  const BRIGHT_FRAG = `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uSrc;
    uniform float uThreshold, uKnee;
    void main(){
      vec4 c = texture2D(uSrc, vUv);
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      // soft knee: nothing below the threshold, easing in over uKnee above it
      float w = smoothstep(uThreshold, uThreshold + max(uKnee, 1e-4), l);
      gl_FragColor = vec4(c.rgb * w, 1.0);
    }`;

  const BLUR_FRAG = `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uSrc;
    uniform vec2 uDir;          // texel-sized step, already scaled by radius
    void main(){
      // 9-tap Gaussian, weights from the binomial row
      float w[5];
      w[0] = 0.2270270270; w[1] = 0.1945945946; w[2] = 0.1216216216;
      w[3] = 0.0540540541; w[4] = 0.0162162162;
      vec3 c = texture2D(uSrc, vUv).rgb * w[0];
      for (int i = 1; i < 5; i++){
        vec2 o = uDir * float(i);
        c += texture2D(uSrc, vUv + o).rgb * w[i];
        c += texture2D(uSrc, vUv - o).rgb * w[i];
      }
      gl_FragColor = vec4(c, 1.0);
    }`;

  const COMBINE_FRAG = `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uSrc, uBloom;
    uniform float uIntensity;
    uniform float uCrt, uScanCount, uScanDepth, uAberration,
                  uCurvature, uVignette, uContrast, uSaturation;

    void main(){
      vec2 uv = vUv;

      /* Barrel distortion first, because everything below samples through it.
         Centred on 0.5 and pushed out by the square of the distance, which is
         the cheap approximation of a curved tube. */
      if (uCrt > 0.5 && uCurvature > 0.0){
        vec2 d = uv - 0.5;
        uv = 0.5 + d * (1.0 + uCurvature * dot(d, d) * 4.0);
        // outside the tube there is nothing, and clamping would smear the
        // edge pixels outward into a streak
        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0){
          gl_FragColor = vec4(0.0); return;
        }
      }

      vec4 c;
      if (uCrt > 0.5 && uAberration > 0.0){
        // the split grows with distance from centre, as a real lens does
        vec2 dir = (uv - 0.5) * uAberration;
        vec4 cr = texture2D(uSrc, uv + dir);
        vec4 cg = texture2D(uSrc, uv);
        vec4 cb = texture2D(uSrc, uv - dir);
        c = vec4(cr.r, cg.g, cb.b, max(max(cr.a, cg.a), cb.a));
      } else {
        c = texture2D(uSrc, uv);
      }
      vec3 b = texture2D(uBloom, uv).rgb * uIntensity;
      /* Added to colour but ALSO to alpha, or the glow spilling past the
         figure's edge would be premultiplied against an alpha of zero and
         simply not appear — the halo outside the silhouette is most of the
         point of blooming a rim light. */
      float a = clamp(c.a + dot(b, vec3(0.3333)), 0.0, 1.0);
      vec3 rgb = clamp(c.rgb + b, 0.0, 1.0);

      if (uCrt > 0.5){
        // grade: contrast about mid grey, then saturation about luma
        rgb = clamp((rgb - 0.5) * uContrast + 0.5, 0.0, 1.0);
        float l = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
        rgb = clamp(mix(vec3(l), rgb, uSaturation), 0.0, 1.0);

        /* Scan lines and vignette scale ALPHA as well as colour. The canvas is
           premultiplied and sits on a black page, so darkening colour alone
           would do nothing where there is nothing — cutting coverage is what
           makes the bands read against the ground. */
        float scan = 1.0 - uScanDepth *
                     (0.5 + 0.5 * sin(uv.y * uScanCount * 6.2831853));
        vec2 vd = uv - 0.5;
        float vig = 1.0 - uVignette * dot(vd, vd) * 2.0;
        float k = clamp(scan * vig, 0.0, 1.0);
        rgb *= k;
        a *= k;
      }

      gl_FragColor = vec4(rgb, a);
    }`;

  /* ---------------- build -------------------------------------------------- */

  (async function build(){
    let THREE, bodyMesh, skelMesh;
    try {
      [THREE, bodyMesh, skelMesh] = await Promise.all([
        loadThree(),
        loadMesh(OUTER_VAR, OUTER_SRC),
        loadMesh(INNER_VAR, INNER_SRC),
      ]);
    } catch (e){ return giveUp(e.message, e); }
    if (!alive) return;

    try {
      // Colour management off: the raw renderer writes straight to the
      // framebuffer with no transfer function, and the two have to match
      // exactly or the hand-over is a visible jump in brightness.
      if (THREE.ColorManagement) THREE.ColorManagement.enabled = false;

      const canvas = document.createElement('canvas');
      canvas.className = 'about__xray';
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0);

      const camera = new THREE.PerspectiveCamera(70, 1, 0.05, 40);

      const F = window.FIGURE;                     // shading + framing source
      const cfg = () => (F && F.config) || {};

      const bodyMat = new THREE.ShaderMaterial({
        vertexShader: SHARED_VERT, fragmentShader: BODY_FRAG,
        uniforms: {
          uLight:   { value: new THREE.Vector3(1, 1, 1) },
          uTint:    { value: new THREE.Vector3(1, 1, 1) },
          uAmbient: { value: 0.08 }, uDiffuse: { value: 0.8 },
          uRim:     { value: 0.12 }, uTone:    { value: 0.74 },
          uGrain:   { value: 0.095 }, uSeed:   { value: 0 },
        },
      });
      const skelMat = new THREE.ShaderMaterial({
        vertexShader: SHARED_VERT, fragmentShader: SKEL_FRAG,
        uniforms: {
          uTint:  { value: new THREE.Vector3(1, 1, 1) },
          uPower: { value: CONFIG.fresnelPower },
          uGain:  { value: CONFIG.fresnelGain },
          uCore:  { value: CONFIG.skelCore },
        },
      });

      const bodyScene = new THREE.Scene();
      const skelScene = new THREE.Scene();
      const body = new THREE.Mesh(geometry(THREE, bodyMesh), bodyMat);
      const skel = new THREE.Mesh(geometry(THREE, skelMesh), skelMat);
      bodyScene.add(body);
      skelScene.add(skel);

      // ---- render targets ----
      const rtOpts = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
                       depthBuffer: true, stencilBuffer: false };
      const bodyRT = new THREE.WebGLRenderTarget(2, 2, rtOpts);
      const skelRT = new THREE.WebGLRenderTarget(2, 2, rtOpts);
      const fluidOpts = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
                          depthBuffer: false, stencilBuffer: false,
                          type: THREE.HalfFloatType };
      let fluidA = new THREE.WebGLRenderTarget(2, 2, fluidOpts);
      let fluidB = new THREE.WebGLRenderTarget(2, 2, fluidOpts);
      // the composite now lands here first, so bloom has something to read
      const compRT = new THREE.WebGLRenderTarget(2, 2, rtOpts);
      let bloomA = new THREE.WebGLRenderTarget(2, 2, rtOpts);
      let bloomB = new THREE.WebGLRenderTarget(2, 2, rtOpts);

      const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const quadGeo = new THREE.PlaneGeometry(2, 2);

      const fluidMat = new THREE.ShaderMaterial({
        vertexShader: QUAD_VERT, fragmentShader: FLUID_FRAG,
        uniforms: {
          uPrev:  { value: null },
          uFrom:  { value: new THREE.Vector2(-9, -9) },
          uTo:    { value: new THREE.Vector2(-9, -9) },
          uAspect:{ value: new THREE.Vector2(1, 1) },
          uRadius:{ value: CONFIG.radius }, uStrength: { value: 0 },
          uDecay: { value: CONFIG.decay },  uDisplace: { value: CONFIG.displace },
          uNoiseScale: { value: CONFIG.noiseScale },
          uNoiseSpeed: { value: CONFIG.noiseSpeed },
          uTime:  { value: 0 }, uDown: { value: 1 },
        },
      });
      const compMat = new THREE.ShaderMaterial({
        vertexShader: QUAD_VERT, fragmentShader: COMPOSITE_FRAG,
        transparent: true,
        uniforms: {
          uBody: { value: bodyRT.texture }, uSkel: { value: skelRT.texture },
          uFluid:{ value: fluidA.texture },
          uEdge: { value: CONFIG.edge }, uSoft: { value: CONFIG.soft },
          uBodyOpacity: { value: CONFIG.bodyOpacity },
          uSkelOpacity: { value: CONFIG.skelOpacity },
        },
      });
      const brightMat = new THREE.ShaderMaterial({
        vertexShader: QUAD_VERT, fragmentShader: BRIGHT_FRAG,
        uniforms: { uSrc: { value: compRT.texture },
                    uThreshold: { value: CONFIG.bloomThreshold },
                    uKnee: { value: CONFIG.bloomKnee } },
      });
      const blurMat = new THREE.ShaderMaterial({
        vertexShader: QUAD_VERT, fragmentShader: BLUR_FRAG,
        uniforms: { uSrc: { value: null },
                    uDir: { value: new THREE.Vector2(0, 0) } },
      });
      const combineMat = new THREE.ShaderMaterial({
        vertexShader: QUAD_VERT, fragmentShader: COMBINE_FRAG,
        transparent: true,
        uniforms: { uSrc: { value: compRT.texture }, uBloom: { value: null },
                    uIntensity: { value: CONFIG.bloomIntensity },
                    uCrt: { value: 0 },
                    uScanCount: { value: CONFIG.crtScanCount },
                    uScanDepth: { value: CONFIG.crtScanDepth },
                    uAberration: { value: CONFIG.crtAberration },
                    uCurvature: { value: CONFIG.crtCurvature },
                    uVignette: { value: CONFIG.crtVignette },
                    uContrast: { value: CONFIG.crtContrast },
                    uSaturation: { value: CONFIG.crtSaturation } },
      });

      const fluidScene = new THREE.Scene();
      fluidScene.add(new THREE.Mesh(quadGeo, fluidMat));
      const compScene = new THREE.Scene();
      compScene.add(new THREE.Mesh(quadGeo, compMat));
      /* One quad mesh per material rather than one mesh whose material is
         swapped: three caches per-material program state on the mesh, and
         swapping it every pass is the kind of thing that works but quietly
         costs a recompile check each time. */
      const brightScene = new THREE.Scene();
      brightScene.add(new THREE.Mesh(quadGeo, brightMat));
      const blurScene = new THREE.Scene();
      blurScene.add(new THREE.Mesh(quadGeo, blurMat));
      const combineScene = new THREE.Scene();
      combineScene.add(new THREE.Mesh(quadGeo, combineMat));

      // ---- sizing ----
      let W = 2, H = 2, rect = { left: 0, top: 0, width: 1, height: 1 };
      function resize(){
        const r = host.getBoundingClientRect();
        rect = r;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = Math.max(2, Math.round(r.width * dpr));
        H = Math.max(2, Math.round(r.height * dpr));
        renderer.setPixelRatio(1);
        renderer.setSize(W, H, false);
        bodyRT.setSize(W, H);
        skelRT.setSize(W, H);
        const sw = Math.max(2, Math.round(W * CONFIG.simScale));
        const sh = Math.max(2, Math.round(H * CONFIG.simScale));
        fluidA.setSize(sw, sh); fluidB.setSize(sw, sh);
        compRT.setSize(W, H);
        const bw = Math.max(2, Math.round(W * CONFIG.bloomScale));
        const bh = Math.max(2, Math.round(H * CONFIG.bloomScale));
        bloomA.setSize(bw, bh); bloomB.setSize(bw, bh);
        fluidMat.uniforms.uAspect.value.set(sw / sh, 1);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
      }

      // ---- pointer ----
      let px = -9, py = -9, qx = -9, qy = -9, moved = false;
      on(window, 'pointermove', e => {
        const u = (e.clientX - rect.left) / Math.max(rect.width, 1);
        const v = 1 - (e.clientY - rect.top) / Math.max(rect.height, 1);
        if (!moved){ px = u; py = v; }   // no streak from the corner on the first move
        qx = u; qy = v; moved = true;
      });
      on(window, 'pointerleave', () => { moved = false; });

      let rt; on(window, 'resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
      resize();

      /* Spin and tilt come from the existing renderer's live values rather
         than being recomputed here, so the two are the same figure in the same
         pose at the same instant and the hand-over cannot be seen. */
      function syncCamera(){
        const c = cfg();

        /* ONE SOLVE, NOT TWO. This used to reimplement the framing — the same
           trig, the centre hardcoded as 0.5, the eye orbiting a point it was
           not looking at — and that was survivable only while nothing changed.
           Then `contain` framing was added to js/about-figure.js and not here,
           so the figure fitted the frame with the x-ray off and was cut with
           it on. It now asks that module for the camera it is actually using.

           The aspect has to be passed because these two canvases are not
           always the same size. */
        if (F && F.camera){
          const cam = F.camera(W / Math.max(H, 1));
          camera.fov = cam.fovDeg;
          camera.updateProjectionMatrix();
          camera.position.set(cam.eye[0], cam.eye[1], cam.eye[2]);
          camera.lookAt(cam.at[0], cam.at[1], cam.at[2]);
        } else {
          // only reachable if FIGURE went away mid-session
          const height = c.height != null ? c.height : 0.46;
          const fov = (c.fov != null ? c.fov : 70) * Math.PI / 180;
          const dist = (1 / height) / (2 * Math.tan(fov / 2));
          const tilt = (c.tiltStart || 0) * Math.PI / 180;
          camera.fov = (c.fov != null ? c.fov : 70);
          camera.updateProjectionMatrix();
          camera.position.set(0, 0.5 + Math.sin(tilt) * dist, Math.cos(tilt) * dist);
          camera.lookAt(0, 0.5, 0);
        }

        const spin = (F && F.spinRad != null) ? F.spinRad : 0;
        const D = Math.PI / 180;
        body.rotation.y = spin;
        /* The scroll spin is added to the skeleton's own Y rather than
           replacing it, so the two stay locked together however it is posed. */
        skel.rotation.set(CONFIG.skelRotX * D, spin + CONFIG.skelRotY * D,
                          CONFIG.skelRotZ * D);
        skel.scale.setScalar(CONFIG.skelScale);
        skel.position.set(CONFIG.skelPosX, CONFIG.skelPosY, CONFIG.skelPosZ);

        const t = tintVec(c.tint || '#FCFFF8');
        bodyMat.uniforms.uTint.value.set(t[0], t[1], t[2]);
        bodyMat.uniforms.uAmbient.value = c.ambient != null ? c.ambient : 0.08;
        bodyMat.uniforms.uDiffuse.value = c.diffuse != null ? c.diffuse : 0.8;
        bodyMat.uniforms.uRim.value     = c.rim     != null ? c.rim     : 0.12;
        bodyMat.uniforms.uTone.value    = c.tone    != null ? c.tone    : 0.74;
        bodyMat.uniforms.uGrain.value   = c.grain   != null ? c.grain   : 0.095;
        bodyMat.uniforms.uSeed.value    = Math.random() * 1000;
        bodyMat.uniforms.uLight.value.set(
          c.lightX != null ? c.lightX : -1,
          c.lightY != null ? c.lightY : -1,
          c.lightZ != null ? c.lightZ :  1);

        const st = tintVec(CONFIG.skelTint);
        skelMat.uniforms.uTint.value.set(st[0], st[1], st[2]);
        skelMat.uniforms.uPower.value = CONFIG.fresnelPower;
        skelMat.uniforms.uGain.value  = CONFIG.fresnelGain;
        skelMat.uniforms.uCore.value  = CONFIG.skelCore;
      }

      // ---- the loop ----
      let handedOver = false, frames = 0, last = performance.now(), t0 = last;

      function handOver(){
        if (handedOver) return;
        handedOver = true;
        host.appendChild(canvas);
        /* Only now is the old canvas taken out of the picture — and only
           visually. It keeps rendering into its 48x160 silhouette buffer,
           because js/about-text.js shapes every line of the copy around what
           that buffer says, and nothing here reproduces it. */
        if (oldCanvas) oldCanvas.style.visibility = 'hidden';
        if (window.FIGURE && window.FIGURE.setSilhouetteOnly)
          window.FIGURE.setSilhouetteOnly(true);
        console.info('[about-xray] running (three r' +
          (THREE.REVISION || '?') + ')');
      }

      function frame(now){
        if (!alive) return;
        /* THE LOOP KEEPS TURNING, the work stops. Same shape as about-figure's
           dormant branch: cancelling the rAF instead would mean waking needs a
           restart path, and `last` would be stale by however long you were
           away, so the first frame back would integrate a two-minute dt. */
        if (dormant){ last = now; raf = requestAnimationFrame(frame); return; }
        const dt = Math.min((now - last) / 1000, 0.1); last = now;

        try {
          if (!CONFIG.enabled){
            if (handedOver){
              handedOver = false;
              if (oldCanvas) oldCanvas.style.visibility = '';
              if (window.FIGURE && window.FIGURE.setSilhouetteOnly)
                window.FIGURE.setSilhouetteOnly(false);
              /* Hidden, not just left unrendered. Stopping the loop leaves the
                 LAST FRAME on the canvas, and a frozen x-ray sitting on top of
                 the live figure looks like a crash rather than an off switch. */
              canvas.style.visibility = 'hidden';
            }
            raf = requestAnimationFrame(frame);
            return;
          }
          canvas.style.visibility = '';

          syncCamera();

          // 1. fluid step, ping-pong
          fluidMat.uniforms.uPrev.value = fluidA.texture;
          fluidMat.uniforms.uFrom.value.set(px, py);
          fluidMat.uniforms.uTo.value.set(qx, qy);
          fluidMat.uniforms.uStrength.value = moved ? CONFIG.strength : 0;
          fluidMat.uniforms.uRadius.value = CONFIG.radius;
          fluidMat.uniforms.uDecay.value = CONFIG.decay;
          fluidMat.uniforms.uDisplace.value = CONFIG.displace;
          fluidMat.uniforms.uNoiseScale.value = CONFIG.noiseScale;
          fluidMat.uniforms.uNoiseSpeed.value = CONFIG.noiseSpeed;
          fluidMat.uniforms.uTime.value = (now - t0) / 1000;
          // decay is quoted per 1/60s, so raise it by however many of those
          // this frame actually took — same value on 60Hz and 120Hz
          fluidMat.uniforms.uDown.value = dt * 60;
          renderer.setRenderTarget(fluidB);
          renderer.render(fluidScene, quadCam);
          const swap = fluidA; fluidA = fluidB; fluidB = swap;
          px = qx; py = qy;

          // 2. the two scenes
          renderer.setRenderTarget(bodyRT);
          renderer.clear();
          renderer.render(bodyScene, camera);
          renderer.setRenderTarget(skelRT);
          renderer.clear();
          renderer.render(skelScene, camera);

          // 3. composite
          compMat.uniforms.uFluid.value = fluidA.texture;
          compMat.uniforms.uEdge.value = CONFIG.edge;
          compMat.uniforms.uSoft.value = CONFIG.soft;
          compMat.uniforms.uBodyOpacity.value = CONFIG.bodyOpacity;
          compMat.uniforms.uSkelOpacity.value = CONFIG.skelOpacity;
          if (CONFIG.bloom){
            renderer.setRenderTarget(compRT);
            renderer.clear();
            renderer.render(compScene, quadCam);

            // 4. bright pass
            brightMat.uniforms.uThreshold.value = CONFIG.bloomThreshold;
            brightMat.uniforms.uKnee.value = CONFIG.bloomKnee;
            renderer.setRenderTarget(bloomA);
            renderer.clear();
            renderer.render(brightScene, quadCam);

            // 5. separable blur, ping-ponged
            const bw = Math.max(bloomA.width, 1), bh = Math.max(bloomA.height, 1);
            const passes = Math.max(1, Math.min(6, Math.round(CONFIG.bloomPasses)));
            for (let i = 0; i < passes; i++){
              // each pair steps further out, so the spread grows geometrically
              const spread = CONFIG.bloomRadius * (i + 1);
              blurMat.uniforms.uSrc.value = bloomA.texture;
              blurMat.uniforms.uDir.value.set(spread / bw, 0);
              renderer.setRenderTarget(bloomB);
              renderer.render(blurScene, quadCam);

              blurMat.uniforms.uSrc.value = bloomB.texture;
              blurMat.uniforms.uDir.value.set(0, spread / bh);
              renderer.setRenderTarget(bloomA);
              renderer.render(blurScene, quadCam);
            }

            // 6. combine to the screen
            combineMat.uniforms.uBloom.value = bloomA.texture;
            combineMat.uniforms.uIntensity.value = CONFIG.bloomIntensity;
            const cu = combineMat.uniforms;
            cu.uCrt.value = CONFIG.crt ? 1 : 0;
            cu.uScanCount.value = CONFIG.crtScanCount;
            cu.uScanDepth.value = CONFIG.crtScanDepth;
            cu.uAberration.value = CONFIG.crtAberration;
            cu.uCurvature.value = CONFIG.crtCurvature;
            cu.uVignette.value = CONFIG.crtVignette;
            cu.uContrast.value = CONFIG.crtContrast;
            cu.uSaturation.value = CONFIG.crtSaturation;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(combineScene, quadCam);
          } else if (CONFIG.crt){
            /* CRT lives in the combine pass, so with bloom off it still has to
               go through it — with a black bloom texture rather than a branch
               in the shader. */
            renderer.setRenderTarget(compRT);
            renderer.clear();
            renderer.render(compScene, quadCam);
            renderer.setRenderTarget(bloomA);
            renderer.setClearColor(0x000000, 0);
            renderer.clear();
            combineMat.uniforms.uBloom.value = bloomA.texture;
            combineMat.uniforms.uIntensity.value = 0;
            const cu = combineMat.uniforms;
            cu.uCrt.value = 1;
            cu.uScanCount.value = CONFIG.crtScanCount;
            cu.uScanDepth.value = CONFIG.crtScanDepth;
            cu.uAberration.value = CONFIG.crtAberration;
            cu.uCurvature.value = CONFIG.crtCurvature;
            cu.uVignette.value = CONFIG.crtVignette;
            cu.uContrast.value = CONFIG.crtContrast;
            cu.uSaturation.value = CONFIG.crtSaturation;
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(combineScene, quadCam);
          } else {
            renderer.setRenderTarget(null);
            renderer.clear();
            renderer.render(compScene, quadCam);
          }

          /* >= rather than ==, and every frame: handOver() is idempotent, and
             an equality test only ever fires once — so toggling the effect off
             and on again would never take the canvas back. */
          frames++;
          if (frames >= 2) handOver();
        } catch (e){
          return giveUp('threw while rendering', e);
        }
        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);

      window.XRAY.apply = () => resize();
      window.XRAY.setDormant = (v) => { dormant = !!v; };
      window.XRAY.readout = (function(){
        return function(){
          return { xray: handedOver ? 'on' : (gaveUp ? 'failed' : 'starting'),
                   three: THREE.REVISION || '?',
                   sim: `${Math.round(W * CONFIG.simScale)}x${Math.round(H * CONFIG.simScale)}`,
                   /* What the mask can reach when the fluid is fully
                      saturated: smoothstep(edge-soft, edge+soft, 1). It is
                      pure arithmetic, no read-back, and it answers the
                      question that is otherwise invisible — with edge at 1
                      the reveal tops out at 50% however hard you hover,
                      because 1.0 lands exactly on the middle of the ramp. */
                   maxReveal: (function(){
                     const e0 = CONFIG.edge - CONFIG.soft, e1 = CONFIG.edge + CONFIG.soft;
                     const t = Math.max(0, Math.min(1, (1 - e0) / Math.max(e1 - e0, 1e-6)));
                     return (t * t * (3 - 2 * t) * 100).toFixed(0) + '%';
                   })(),
                   skel: `${(skelMesh.indices / 3) | 0} tris` };
        };
      })();
    } catch (e){
      giveUp('failed while building the scene', e);
    }
  })();

  function cleanup(){
    alive = false;
    cancelAnimationFrame(raf);
    on.release();
    if (oldCanvas) oldCanvas.style.visibility = '';
    if (window.FIGURE && window.FIGURE.setSilhouetteOnly)
      window.FIGURE.setSilhouetteOnly(false);
    try { renderer && renderer.dispose && renderer.dispose(); } catch (e){}
    const c = host && host.querySelector('canvas.about__xray');
    if (c && c.parentNode) c.parentNode.removeChild(c);
    renderer = null;
    if (window.XRAY) delete window.XRAY;
  }

  return cleanup;
});
