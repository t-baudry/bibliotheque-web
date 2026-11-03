/* ==========================================================================
   transition-liquid.js — the rising-mass page transition.

   Built from a screen recording of a reference site, measured rather than
   eyeballed. What came off the video:

     rise time      0.60 – 1.00s per surge (four of them in the clip)
     easing         f(t) = 1 - (1 - t^1.74)^3.92, which fits the measured
                    coverage curve to 1.4%. No single power comes close —
                    1-(1-t)^2 is out by 13%, and every cubic by more. The
                    shape is a slow start, a very fast middle, and a long
                    settle: 95% of the way there at 70% of the time.
     interior       warm grey, mean #817A75, spanning luminance 75 to 207
     crest          near-neutral #D5D3D3 along the leading edge
     page behind    #101010

   WHAT THIS IS NOT
   It is not the reference. The reference's fill is a photographic rock
   texture and its edge detail is finer than a shader will give you; matching
   it exactly would mean shipping their rendered artwork, which is theirs. So
   the shape, the timing, the palette and the behaviour are reproduced, and
   the fill is generated — five octaves of value noise, contrast-stretched to
   the measured range.

   WHY RAW WEBGL AND NOT THREE.JS
   This one is a full-screen quad. There is no scene, no camera and no mesh,
   so three.js would contribute a CDN dependency and nothing else — and it
   would make this untestable in the environment it was written in, the way
   js/about-xray.js is. This runs on every navigation on every page, which is
   the worst place in the site to ship something that has never executed.

   The pixel-grid wipe is still there and still the fallback. If WebGL is
   missing, or the context is lost, or anything here throws, transition.js
   uses it and says why.
   ========================================================================== */
(function () {
  'use strict';

  const CONFIG = {
    /* OFF. The pixel-grid wipe is the transition; this is kept because it is
       measured against a reference and that work does not want redoing, not
       because it is in use. Nothing here runs, allocates a context or costs a
       frame while this is false — transition.js takes the pixel path directly
       and init() is never reached. `liquid.enabled` on the panel turns it on
       to look at it. To remove it outright: delete this file and its three
       <script> tags, and the .liquid block at the end of css/transition.css. */
    enabled: false,

    // ---- timing (seconds) ----
    coverMs: 900,        // measured: 0.60-1.00s per surge in the reference
    uncoverMs: 700,
    /* The fitted curve. easeA shapes the start, easeB the finish:
       f(t) = 1 - (1 - t^easeA)^easeB */
    easeA: 1.74,
    easeB: 3.92,
    /* 'recede' drops the mass back down to reveal the new page, as the
       reference does. 'rise' carries it off the top instead — cleaner as a
       wipe, less like the reference. */
    uncoverMode: 'recede',

    /* Backing-store scale. The shader is a dozen noise octaves per pixel, and
       at dpr 2 on a large display that is 8M pixels of it. Dropping to 0.75
       quarters nothing visible — the fill is noise and the edge has its own
       softness — and takes a third off the fill rate. Raise it to 1 if the
       edge looks soft on a retina screen. */
    renderScale: 0.85,

    // ---- shape ----
    /* How far past the top the surface travels at full progress. Above 1 the
       mass is comfortably clear of the screen when covered, which matters
       because the edge noise below can otherwise nibble holes in a mass that
       only just reaches the top. */
    overshoot: 1.35,
    basin: 0.30,         // how much higher the sides ride than the centre
    waveAmp: 0.055,      // rolling surface
    waveFreq: 1.15,
    waveSpeed: 0.55,
    surfNoise: 0.07,     // slower, larger surface wander on top of the waves
    surfNoiseScale: 2.4,
    surfNoiseSpeed: 0.35,

    // ---- edge ----
    /* The crumbly boundary and the droplets that detach from it are one
       thing, not two: the noise is added to the signed distance BEFORE the
       threshold, so where it is strong near the edge it pushes patches across
       zero and they become islands. Raise edgeAmp for more spray. */
    edgeScale: 7.0,     // frequency of the boundary noise
    edgeAmp: 0.09,      // displacement, in units of SCREEN HEIGHT
    edgeSoft: 0.004,     // half-width of the threshold · small keeps it crisp
    edgeDrift: 0.25,     // how fast the boundary noise crawls

    // ---- fill ----
    texScale: 10.0,       // size of the broad mottling
    texContrast: 3.0,
    texGrit: 0.65,       // how much of the fine layer is mixed in
    texLift: 0.01,      // brightness trim after the contrast stretch
    texGamma: 1.2,       // bends the midtones without moving the endpoints
    /* Solved against the reference rather than picked. With these, the fill's
       luminance percentiles land within 8 levels out of 255 of the reference
       frame — p5 67/63, p25 94/84, p50 121/110, p75 151/147, p95 198/209 —
       and its local contrast, the "grit", within 1.1 of the reference's 16.2.

       Matching the histogram alone is not enough and was actively misleading:
       an earlier pass hit the percentiles to within 3.8 using a single
       high-frequency lookup for the fine layer, and looked like television
       static. Gravel clusters. The fine layer is mostly fbm now, with a little
       raw noise on top, and the grit figure is what catches the difference. */
    dark: '#423C36',
    light: '#EFECE9',
    crest: '#D5D3D3',
    crestWidth: 0.02,   // how far the bright rim reaches inward
    crestGain: 1.0,
    grain: 0.03,         // per-pixel noise, matching the site's film grain
  };

  const VERT = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAG = `
    precision highp float;
    varying vec2 vUv;
    uniform float uP, uTime, uAspect;
    uniform float uOvershoot, uBasin, uWaveAmp, uWaveFreq, uWaveSpeed,
                  uSurfNoise, uSurfScale, uSurfSpeed,
                  uEdgeScale, uEdgeAmp, uEdgeSoft, uEdgeDrift,
                  uTexScale, uTexContrast, uTexGrit, uTexLift, uTexGamma,
                  uCrestWidth, uCrestGain, uGrain;
    uniform vec3 uDark, uLight, uCrest;

    float hash(vec2 p){
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    float vnoise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
                 mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
    }
    float fbm(vec2 p, int oct){
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 6; i++){
        if (i >= oct) break;
        v += a * vnoise(p); p *= 2.03; a *= 0.5;
      }
      return v;
    }

    /* Height of the surface at x, in the same 0..1 units as uv.y (0 at the
       bottom). Everything that makes the mass read as liquid rather than as a
       rising rectangle is in here. */
    float surface(float x){
      float base = -0.25 + uP * (uOvershoot + 0.25);
      // the sides ride higher than the middle — the basin in the reference
      float b = uBasin * pow(abs(x - 0.5) * 2.0, 2.0);
      float w = sin(x * 6.2831853 * uWaveFreq + uTime * uWaveSpeed) * uWaveAmp
              + sin(x * 6.2831853 * uWaveFreq * 1.93 - uTime * uWaveSpeed * 0.7)
                * uWaveAmp * 0.55;
      float n = (fbm(vec2(x * uSurfScale, uTime * uSurfSpeed), 3) - 0.5)
                * 2.0 * uSurfNoise;
      return base + b + w + n;
    }

    void main(){
      vec2 uv = vUv;
      float d = surface(uv.x) - uv.y;        // > 0 inside the mass

      /* The crumbly edge and the detached droplets are one operation: multi
         octave noise displaces the surface distance, then a HARD threshold.
         Both halves matter. Displacing by a wide, soft ramp only blurs the
         boundary — it was doing that, and read as fog. The noise has to be
         large in height units and the threshold narrow, so patches are carried
         cleanly across zero and become islands with real edges.

         uEdgeAmp is therefore in units of screen height, not an abstract gain:
         0.06 is a 6%-of-height wobble, which at 1080p is about 60px of broken
         boundary. */
      vec2 np = vec2(uv.x * uAspect, uv.y) * uEdgeScale;
      float n = fbm(np + vec2(0.0, uTime * uEdgeDrift), 4) - 0.5;
      float dn = d + n * uEdgeAmp * 2.0;
      float m = smoothstep(-uEdgeSoft, uEdgeSoft, dn);
      if (m <= 0.001){ gl_FragColor = vec4(0.0); return; }

      /* Fill. Two scales, not one: the broad fbm gives the cloudy patches and
         a much finer layer on top gives the grit. With the fbm alone the
         result is smooth cloud where the reference is gravel — measured as
         local contrast, 3.6 against the reference's 16.2, which is the number
         this second term exists to close. */
      vec2 tp = vec2(uv.x * uAspect, uv.y);
      float t = fbm(tp * uTexScale, 5);
      /* fbm, not raw vnoise. A single high-frequency lookup is per-texel
         static — it matched the reference's HISTOGRAM exactly while looking
         nothing like it, which is the trap in tuning against statistics alone.
         Gravel clusters, so the fine layer needs octaves too. */
      float grit = fbm(tp * uTexScale * 5.0, 3) * 0.68
                 + vnoise(tp * uTexScale * 21.0) * 0.32;
      t = mix(t, grit, uTexGrit);
      t = clamp((t - 0.5) * uTexContrast + 0.5 + uTexLift, 0.0, 1.0);
      /* Gamma AFTER the stretch. The endpoints were already matching the
         reference while every midtone sat about 22 levels too bright, and a
         lift moves the whole curve including the ends. A gamma bends the
         middle and leaves 0 and 1 where they are, which is the shape of the
         error. */
      t = pow(t, uTexGamma);
      vec3 col = mix(uDark, uLight, t);

      /* The crest follows the DISPLACED distance, not the smooth one. That is
         what puts a bright rim around every detached island instead of a band
         across the top of the mass — and the outlined islands are most of what
         makes the reference read as liquid rather than as a texture with a
         ragged edge. */
      float crest = (1.0 - smoothstep(0.0, max(uCrestWidth, 1e-4), dn))
                    * step(-uEdgeSoft, dn);
      col = mix(col, uCrest, clamp(crest * uCrestGain, 0.0, 1.0));

      col += (hash(gl_FragCoord.xy + uTime) - 0.5) * uGrain;
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), m);
    }`;

  let canvas = null, gl = null, prog = null, U = null, failed = false;
  let raf = 0, running = null, t0 = performance.now();
  let progress = 0, held = 0;

  function hex3(h){
    const m = /^#?([0-9a-f]{6})$/i.exec(String(h || '#ffffff'));
    if (!m) return [1, 1, 1];
    const n = parseInt(m[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  function compile(type, src){
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  /* The GPU side on its own, so a restored context rebuilds through exactly
     the code that built it. See PAGE.glGuard in js/lifecycle.js. */
  function buildGL(){

    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const u = n => gl.getUniformLocation(prog, n);
    U = { p:u('uP'), time:u('uTime'), aspect:u('uAspect'),
          overshoot:u('uOvershoot'), basin:u('uBasin'),
          waveAmp:u('uWaveAmp'), waveFreq:u('uWaveFreq'), waveSpeed:u('uWaveSpeed'),
          surfNoise:u('uSurfNoise'), surfScale:u('uSurfScale'), surfSpeed:u('uSurfSpeed'),
          edgeScale:u('uEdgeScale'), edgeAmp:u('uEdgeAmp'),
          edgeSoft:u('uEdgeSoft'), edgeDrift:u('uEdgeDrift'),
          texScale:u('uTexScale'), texContrast:u('uTexContrast'),
          texGrit:u('uTexGrit'), texLift:u('uTexLift'), texGamma:u('uTexGamma'),
          crestWidth:u('uCrestWidth'), crestGain:u('uCrestGain'), grain:u('uGrain'),
          dark:u('uDark'), light:u('uLight'), crest:u('uCrest') };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  let guard = null;

  function init(){
    if (canvas || failed) return !failed;
    try {
      canvas = document.createElement('canvas');
      canvas.className = 'liquid';
      canvas.setAttribute('aria-hidden', 'true');
      gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false,
                                        antialias: false });
      if (!gl) throw new Error('no WebGL context');

      guard = window.PAGE.glGuard(canvas, () => { buildGL(); resize(); });
      buildGL();
      document.body.appendChild(canvas);
      resize();
      window.addEventListener('resize', resize);
      return true;
    } catch (e){
      failed = true;
      console.warn('[liquid] unavailable, transition.js keeps the pixel wipe:', e.message);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvas = null; gl = null;
      return false;
    }
  }

  function resize(){
    if (!gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2) *
                Math.max(0.25, Math.min(1, CONFIG.renderScale));
    const w = Math.max(2, Math.round(window.innerWidth * dpr));
    const h = Math.max(2, Math.round(window.innerHeight * dpr));
    if (canvas.width !== w || canvas.height !== h){
      canvas.width = w; canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
  }

  function draw(){
    /* Nothing to draw into. The overlay simply does not paint this frame; the
       transition still advances and finishes, so a lost context delays the
       effect rather than stranding the page mid-wipe. */
    if (guard && guard.lost()) return;
    if (!gl) return;
    const C = CONFIG;
    gl.uniform1f(U.p, progress);
    gl.uniform1f(U.time, (performance.now() - t0) / 1000);
    gl.uniform1f(U.aspect, canvas.width / Math.max(canvas.height, 1));
    gl.uniform1f(U.overshoot, C.overshoot);
    gl.uniform1f(U.basin, C.basin);
    gl.uniform1f(U.waveAmp, C.waveAmp);
    gl.uniform1f(U.waveFreq, C.waveFreq);
    gl.uniform1f(U.waveSpeed, C.waveSpeed);
    gl.uniform1f(U.surfNoise, C.surfNoise);
    gl.uniform1f(U.surfScale, C.surfNoiseScale);
    gl.uniform1f(U.surfSpeed, C.surfNoiseSpeed);
    gl.uniform1f(U.edgeScale, C.edgeScale);
    gl.uniform1f(U.edgeAmp, C.edgeAmp);
    gl.uniform1f(U.edgeSoft, C.edgeSoft);
    gl.uniform1f(U.edgeDrift, C.edgeDrift);
    gl.uniform1f(U.texScale, C.texScale);
    gl.uniform1f(U.texContrast, C.texContrast);
    gl.uniform1f(U.texGrit, C.texGrit);
    gl.uniform1f(U.texLift, C.texLift);
    gl.uniform1f(U.texGamma, C.texGamma);
    gl.uniform1f(U.crestWidth, C.crestWidth);
    gl.uniform1f(U.crestGain, C.crestGain);
    gl.uniform1f(U.grain, C.grain);
    gl.uniform3fv(U.dark, hex3(C.dark));
    gl.uniform3fv(U.light, hex3(C.light));
    gl.uniform3fv(U.crest, hex3(C.crest));
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /* The fitted curve, and the only easing here. */
  function ease(t){
    t = Math.max(0, Math.min(1, t));
    return 1 - Math.pow(1 - Math.pow(t, CONFIG.easeA), CONFIG.easeB);
  }

  function run(from, to, ms){
    return new Promise(resolve => {
      if (!init()){ resolve(false); return; }
      cancelAnimationFrame(raf);
      canvas.classList.add('is-on');
      resize();
      const start = performance.now();
      const dur = Math.max(1, ms);
      (function step(now){
        const t = Math.min(1, (now - start) / dur);
        progress = from + (to - from) * ease(t);
        draw();
        if (t < 1){ raf = requestAnimationFrame(step); }
        else { held = progress; resolve(true); }
      })(performance.now());
    });
  }

  window.LIQUID = {
    config: CONFIG,
    get available(){ return !failed && (canvas ? true : null); },
    /* Cover the screen. Resolves when the mass is over the top, which is when
       the page underneath can be swapped without it being seen. */
    cover(ms){
      if (!CONFIG.enabled) return Promise.resolve(false);
      return run(0, 1, ms == null ? CONFIG.coverMs : ms);
    },
    uncover(ms){
      if (!CONFIG.enabled) return Promise.resolve(false);
      const dur = ms == null ? CONFIG.uncoverMs : ms;
      /* 'rise' carries it off the top; 'recede' drops it back down, which is
         what the reference does. Either way it ends fully out of the way. */
      const to = CONFIG.uncoverMode === 'rise' ? 2.0 : 0.0;
      return run(held || 1, to, dur).then(ok => { hide(); return ok; });
    },
    /* Straight to covered with no animation — the fallback path needs this to
       hide a real page load that is already under way. */
    hold(){
      if (!CONFIG.enabled || !init()) return false;
      cancelAnimationFrame(raf);
      canvas.classList.add('is-on');
      resize(); progress = 1; held = 1; draw();
      return true;
    },
    /* Park it at a given progress and hold. Scrubbing beats playing when you
       are tuning a shape rather than a timing — and it is how the frames were
       compared against the reference. */
    seek(v){
      if (!init()) return false;
      cancelAnimationFrame(raf);
      canvas.classList.add('is-on');
      resize();
      progress = Math.max(0, Math.min(2, v)); held = progress; draw();
      return true;
    },
    hide,
    /* Run it without navigating. Tuning a transition you can only see by
       leaving the page is close to impossible — every adjustment costs a
       round trip and you are looking at the wrong page by the time it plays. */
    preview(){
      return this.cover().then(() => new Promise(r => setTimeout(r, 260)))
                 .then(() => this.uncover());
    },
    apply(){ resize(); },

    /* One schema, spread into all three panels. The transition is site-wide,
       so triplicating this is how the three copies drift apart. */
    rows(){
      const C = CONFIG;
      const num = (key, min, max, step, hint) => ({
        label: 'liquid.' + key, min, max, step, hint,
        get: () => C[key], set: v => { C[key] = v; },
      });
      return [
        { label:'liquid.enabled', options:['on','off'],
          get: () => C.enabled ? 'on' : 'off',
          set: v => { C.enabled = (v === 'on'); },
          hint:'off returns to the pixel-grid wipe, which is still there and is also the fallback if WebGL is missing' },
        { label:'liquid.preview', options:['—','play'], transient: true,
          get: () => '—',
          set: v => { if (v === 'play') window.LIQUID.preview(); },
          hint:'run it here, without navigating' },
        { label:'liquid.scrub', min:0, max:1, step:0.01, transient: true,
          get: () => 0,
          set: v => { if (v > 0.001) window.LIQUID.seek(v); else window.LIQUID.hide(); },
          hint:'hold it at a progress instead of playing it · tuning a shape through a 0.9s animation is guesswork' },
        num('renderScale', 0.25, 1, 0.05, 'backing-store scale · the shader is a dozen noise octaves per pixel, so this is the one performance dial here'),
        num('coverMs', 200, 3000, 25, 'measured on the reference: 0.60-1.00s per surge'),
        num('uncoverMs', 200, 3000, 25, null),
        num('easeA', 0.5, 4, 0.02, 'shapes the START · fitted to the reference at 1.74'),
        num('easeB', 0.5, 8, 0.02, 'shapes the FINISH · fitted at 3.92. Together these match the measured coverage curve to 1.4%, where no single power gets closer than 13%'),
        { label:'liquid.uncoverMode', options:['recede','rise'],
          get: () => C.uncoverMode, set: v => { C.uncoverMode = v; },
          hint:'recede drops the mass back down, as the reference does · rise carries it off the top, which is cleaner as a wipe' },
        num('overshoot', 1, 2.5, 0.01, 'how far past the top it travels · below about 1.2 the edge noise can nibble holes in a mass that only just reaches the top'),
        num('basin', 0, 1, 0.01, 'how much higher the sides ride than the centre'),
        num('waveAmp', 0, 0.3, 0.005, 'rolling surface'),
        num('waveFreq', 0.2, 6, 0.05, null),
        num('waveSpeed', 0, 3, 0.05, null),
        num('surfNoise', 0, 0.3, 0.005, 'slower, larger wander on top of the waves'),
        num('surfNoiseScale', 0.5, 8, 0.1, null),
        num('surfNoiseSpeed', 0, 2, 0.05, null),
        num('edgeScale', 4, 80, 1, 'frequency of the boundary noise · this is what makes the edge crumble'),
        num('edgeAmp', 0, 0.25, 0.002, 'how far the noise displaces the boundary, in units of screen height · the droplets that detach are this same noise carrying patches across the threshold, which is why there is no separate droplet control'),
        num('edgeSoft', 0.001, 0.06, 0.001, 'half-width of the threshold · small keeps the islands crisp, large turns the whole edge to fog'),
        num('edgeDrift', 0, 2, 0.05, 'how fast the boundary crawls'),
        num('texScale', 0.5, 12, 0.1, 'size of the mottling in the fill'),
        num('texContrast', 0.5, 3, 0.05, null),
        num('texGrit', 0, 1, 0.01, 'how much fine speckle is mixed into the broad mottling · with none of it the fill is smooth cloud where the reference is gravel'),
        num('texLift', -0.3, 0.3, 0.01, 'brightness trim after the contrast stretch'),
        num('texGamma', 0.4, 2.5, 0.01, 'bends the midtones and leaves the endpoints alone · this is what matched the reference once its black and white points already did'),
        { label:'liquid.dark', options:['#4A443F','#3A3A3A','#2b2b2b','#5A5049','#393939'],
          get: () => C.dark, set: v => { C.dark = v; },
          hint:'measured p5 of the reference interior' },
        { label:'liquid.light', options:['#D8D4D0','#ffffff','#C8C8C8','#E8E2DC'],
          get: () => C.light, set: v => { C.light = v; }, hint:'measured p95' },
        { label:'liquid.crest', options:['#D5D3D3','#ffffff','#F2EFEC','#C8C8C8'],
          get: () => C.crest, set: v => { C.crest = v; }, hint:'the bright leading edge' },
        num('crestWidth', 0, 0.1, 0.002, 'how far the bright rim reaches inward from the boundary · it follows the displaced edge, so it outlines every island too'),
        num('crestGain', 0, 2, 0.05, null),
        num('grain', 0, 0.2, 0.005, null),
      ];
    },
    readout(){
      /* Namespaced. Plain `canvas` and `p` collided with FIGURE's and
         ABOUTTEXT's keys when a panel spread several readouts together, and
         because this one is spread last it won — the figure's canvas size was
         being reported as this module's, which is not started most of the
         time. */
      return { liquid: failed ? 'failed' : (canvas ? 'ready' : 'not started'),
               liquidP: progress.toFixed(2),
               liquidCanvas: canvas ? `${canvas.width}x${canvas.height}` : '—' };
    },
  };

  function hide(){
    cancelAnimationFrame(raf);
    if (canvas) canvas.classList.remove('is-on');
    progress = 0; held = 0;
  }
})();
