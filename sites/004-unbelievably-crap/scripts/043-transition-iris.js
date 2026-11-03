/* ==========================================================================
   transition-iris.js — the noise-warped radial dissolve.

   Built from agentPritam47/Loader, which unlike the last three references is
   an actual working source rather than a case study. Its stack is three.js +
   GSAP + Vite, but the whole effect is one fragment shader on a full-screen
   quad with four uniforms, so none of that is load-bearing and none of it is
   here. What was reproduced, in the order the original does it:

     1. PIXELATE   uv snapped to blocks before anything else reads it. Doing
                   this FIRST is the point — the noise, the radius and the glow
                   all inherit the blocks, so the whole dissolve is chunky
                   rather than a smooth wipe with a mosaic laid over it.
     2. ASPECT     centred coordinates corrected, so the field is round on a
                   wide monitor instead of an ellipse.
     3. WARP       3D Perlin noise displaces the uv, the third axis being time,
                   which is what makes the boundary crawl rather than scale.
     4. RADIAL     distance from centre, normalised so 1 is the far corner:
                       g = d * 12.5 + (1 - T) * 2 - 15 * T
                   Those constants are the original's. 12.5 is steep enough
                   that the band is thin against the screen; the +2 and -15
                   push the whole field across the threshold as T runs 0 to 1,
                   which is what opens the iris.
     5. GLOW       a smoothstep band riding the same g, so the leading edge
                   carries colour and the interior does not.

   The one thing deliberately NOT reproduced is the pulse: the original
   oscillates the rim with sin(uTime * 1.5), which reads as a heartbeat on a
   three-second click-to-reveal and as a flicker on a 700ms page change. It is
   `pulse` on the panel, at 0.

   Raw WebGL, no three.js: a full-screen quad has no scene, no camera and no
   mesh, and this runs on every navigation on every page — the worst place in
   the site to ship something that cannot be tested where it was written.
   ========================================================================== */
(function () {
  'use strict';

  const CONFIG = {
    /* OFF, AND STILL HERE. js/transition-sheet.js is the page transition now —
       the home page's own block boundary, so the navigation and the block
       change are one gesture. This is kept whole and one dial away: turn
       sheet.enabled off and the iris is what the picker in js/transition.js
       finds next. */
    enabled: false,

    coverMs: 850,
    uncoverMs: 200,
    /* The original tweens uTransition with GSAP's power2.inOut over 3s. Same
       curve, written out, because this module has no GSAP dependency and a
       transition must not wait on a CDN. */
    ease: 'inOutQuad',

    pixel: 1,          // block size, in CSS px — the original's value
    noiseScale: 2.2,    // size of the warp
    /* How far the noise warps the uv. At the original's subtler setting the
       aperture is very nearly a circle; this is where it starts reading as
       something torn open rather than an ellipse scaling down. */
    noiseAmp: 0.9,
    noiseSpeed: 0.0,   // drift along the noise's third axis

    /* The original's radial constants. Steepness sets how thin the band is;
       open and close are the two ends of the sweep it makes across the screen. */
    steep: 12.5,
    close: 2.0,
    open: 15.0,

    glowWidth: 1.0,     // band width, as a share of the screen radius
    glowGain: 5.0,
    borderColor: '#2E6BFF',
    dark: 0.015,        // the original's midnight multiplier
    bright: 2.35,
    pulse: 0.0,         // sin(uTime * pulse) on the rim · 1.5 is the original
    ground: '#ffffff',
    renderScale: 1.0,
  };

  const VERT = `
    attribute vec2 aPos;
    void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAG = `
    precision highp float;
    uniform vec2 uRes;
    uniform float uT, uTime, uPixel, uNoiseScale, uNoiseAmp, uNoiseSpeed,
                  uSteep, uClose, uOpen, uGlowWidth, uGlowGain,
                  uDark, uBright, uPulse;
    uniform vec3 uBorder, uGround;

    vec3 hash3(vec3 p){
      p = vec3(dot(p, vec3(127.1, 311.7,  74.7)),
               dot(p, vec3(269.5, 183.3, 246.1)),
               dot(p, vec3(113.5, 271.9, 124.6)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }
    /* Gradient noise with Perlin's quintic fade, not the cheaper cubic — the
       second derivative is continuous, so a field this heavily warped does not
       show the grid it was built on. */
    float pnoise(vec3 p){
      vec3 i = floor(p), f = fract(p);
      vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      return mix(mix(mix(dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0)),
                         dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                     mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
                         dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
                 mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
                         dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                     mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
                         dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
    }

    void main(){
      /* 1. PIXELATE, before anything reads the coordinate. Everything below
            inherits the blocks, which is what makes the dissolve chunky rather
            than smooth-with-a-mosaic-on-top. */
      vec2 px = max(vec2(uPixel), vec2(1.0));
      vec2 frag = floor(gl_FragCoord.xy / px) * px + px * 0.5;
      vec2 uv = frag / uRes;

      // 2. centred and aspect-corrected, so the field is round
      vec2 c = (uv - 0.5) * vec2(uRes.x / max(uRes.y, 1.0), 1.0);

      // 3. warp, the third noise axis being time
      float n = pnoise(vec3(c * uNoiseScale, uTime * uNoiseSpeed));
      c += n * uNoiseAmp * 0.25;

      // 4. the original's radial sweep
      float maxD = length(vec2(uRes.x / max(uRes.y, 1.0), 1.0) * 0.5);
      float d = length(c) / max(maxD, 1e-4);
      float g = d * uSteep + (1.0 - uT) * uClose - uOpen * uT;

      /* The original's formula ALREADY yields the mass: at uT 0 the gradient
         is 2..14.5 across the screen and at uT 1 it is -15..-2.5, so a plain
         smoothstep runs the cover from everywhere to nowhere. Negating it —
         which is what a first reading suggests, since "1 minus" looks like it
         should mean "still covered" — inverts the whole transition, and the
         readout still says 0 and 1 in the right places while the screen does
         the opposite. Second time this exact mistake has been made in this
         project; the tell is a progress number that reads correctly against a
         picture that does not. */
      float mass = smoothstep(0.0, 1.0, g);   // 1 = still covered

      /* 5. the rim: a band on the same field, so it tracks every wobble the
            warp puts into the boundary instead of being a circle drawn on top. */
      float edge = smoothstep(uGlowWidth, 0.0, abs(g)) * clamp(uT * uGlowGain, 0.0, 1.0);

      float pulse = 1.0 + (uPulse > 0.0 ? sin(uTime * uPulse) * 0.35 : 0.0);
      vec3 rim = uBorder * uBright * pulse;
      vec3 body = mix(uGround, uBorder * uDark, 0.5);

      vec3 rgb = mix(body, rim, clamp(edge, 0.0, 1.0));
      float a = clamp(max(mass, edge), 0.0, 1.0);
      if (a <= 0.002){ gl_FragColor = vec4(0.0); return; }
      gl_FragColor = vec4(rgb, a);
    }`;

  const EASES = {
    linear: t => t,
    inOutQuad: t => (t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2),
    inOutCubic: t => (t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2),
    outCubic: t => 1 - Math.pow(1 - t, 3),
  };

  let canvas = null, gl = null, U = null, failed = false;
  let raf = 0, t0 = performance.now();
  let T = 1, held = 1;   // 1 = fully open, 0 = fully covering

  function hex3(h){
    const m = /^#?([0-9a-f]{6})$/i.exec(String(h || '#ffffff'));
    if (!m) return [1, 1, 1];
    const n = parseInt(m[1], 16);
    return [((n >> 16) & 255)/255, ((n >> 8) & 255)/255, (n & 255)/255];
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
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const u = n => gl.getUniformLocation(prog, n);
    U = { res:u('uRes'), t:u('uT'), time:u('uTime'), pixel:u('uPixel'),
          nScale:u('uNoiseScale'), nAmp:u('uNoiseAmp'), nSpeed:u('uNoiseSpeed'),
          steep:u('uSteep'), close:u('uClose'), open:u('uOpen'),
          glowW:u('uGlowWidth'), glowG:u('uGlowGain'),
          dark:u('uDark'), bright:u('uBright'), pulse:u('uPulse'),
          border:u('uBorder'), ground:u('uGround') };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  let guard = null;

  function init(){
    if (canvas || failed) return !failed;
    try {
      canvas = document.createElement('canvas');
      canvas.className = 'iris';
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
      console.warn('[iris] unavailable, transition.js keeps the pixel wipe:', e.message);
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
    if (canvas.width !== w || canvas.height !== h){ canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
  }

  function draw(){
    /* Nothing to draw into. The overlay simply does not paint this frame; the
       transition still advances and finishes, so a lost context delays the
       effect rather than stranding the page mid-wipe. */
    if (guard && guard.lost()) return;
    if (!gl) return;
    const C = CONFIG;
    const dpr = canvas.width / Math.max(window.innerWidth, 1);
    gl.uniform2f(U.res, canvas.width, canvas.height);
    gl.uniform1f(U.t, T);
    gl.uniform1f(U.time, (performance.now() - t0) / 1000);
    // the block size is quoted in CSS px, so it has to be scaled to the
    // backing store or it halves on a retina screen
    gl.uniform1f(U.pixel, Math.max(1, C.pixel * dpr));
    gl.uniform1f(U.nScale, C.noiseScale);
    gl.uniform1f(U.nAmp, C.noiseAmp);
    gl.uniform1f(U.nSpeed, C.noiseSpeed);
    gl.uniform1f(U.steep, C.steep);
    gl.uniform1f(U.close, C.close);
    gl.uniform1f(U.open, C.open);
    gl.uniform1f(U.glowW, C.glowWidth);
    gl.uniform1f(U.glowG, C.glowGain);
    gl.uniform1f(U.dark, C.dark);
    gl.uniform1f(U.bright, C.bright);
    gl.uniform1f(U.pulse, C.pulse);
    gl.uniform3fv(U.border, hex3(C.borderColor));
    gl.uniform3fv(U.ground, hex3(C.ground));
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function run(from, to, ms){
    return new Promise(resolve => {
      if (!init()){ resolve(false); return; }
      cancelAnimationFrame(raf);
      canvas.classList.add('is-on');
      resize();
      const ease = EASES[CONFIG.ease] || EASES.inOutQuad;
      const start = performance.now(), dur = Math.max(1, ms);
      (function step(now){
        const k = Math.min(1, (now - start) / dur);
        T = from + (to - from) * ease(k);
        draw();
        if (k < 1) raf = requestAnimationFrame(step);
        else { held = T; resolve(true); }
      })(performance.now());
    });
  }

  window.IRIS = {
    config: CONFIG,
    /* T runs 1 (open) to 0 (covering), which is the original's uTransition
       read the other way up: it reveals as its uniform rises, and a page
       transition needs to conceal first. */
    cover(ms){
      if (!CONFIG.enabled) return Promise.resolve(false);
      return run(1, 0, ms == null ? CONFIG.coverMs : ms);
    },
    uncover(ms){
      if (!CONFIG.enabled) return Promise.resolve(false);
      return run(held != null ? held : 0, 1, ms == null ? CONFIG.uncoverMs : ms)
        .then(ok => { hide(); return ok; });
    },
    hold(){
      if (!CONFIG.enabled || !init()) return false;
      cancelAnimationFrame(raf);
      canvas.classList.add('is-on');
      resize(); T = 0; held = 0; draw();
      return true;
    },
    seek(v){
      if (!init()) return false;
      cancelAnimationFrame(raf);
      canvas.classList.add('is-on');
      resize(); T = 1 - Math.max(0, Math.min(1, v)); held = T; draw();
      return true;
    },
    hide,
    preview(){
      return this.cover().then(() => new Promise(r => setTimeout(r, 220)))
                 .then(() => this.uncover());
    },
    apply(){ resize(); },
    readout(){
      return { iris: failed ? 'failed' : (canvas ? 'ready' : 'not started'),
               irisT: T.toFixed(2) };
    },
    rows(){
      const C = CONFIG;
      const num = (key, min, max, step, hint) => ({
        label: 'iris.' + key, min, max, step, hint,
        get: () => C[key], set: v => { C[key] = v; },
      });
      return [
        { label:'iris.enabled', options:['on','off'],
          get: () => C.enabled ? 'on' : 'off',
          set: v => { C.enabled = (v === 'on'); },
          hint:'off falls back to the pixel-grid wipe, which is also the fallback if WebGL is missing' },
        { label:'iris.preview', options:['—','play'], transient: true,
          get: () => '—', set: v => { if (v === 'play') window.IRIS.preview(); },
          hint:'run it without navigating' },
        { label:'iris.scrub', min:0, max:1, step:0.01, transient: true,
          get: () => 0,
          set: v => { if (v > 0.001) window.IRIS.seek(v); else window.IRIS.hide(); },
          hint:'0 is open, 1 is fully covering' },
        num('coverMs', 200, 3000, 25, null),
        num('uncoverMs', 200, 3000, 25, null),
        { label:'iris.ease', options:['inOutQuad','inOutCubic','outCubic','linear'],
          get: () => C.ease, set: v => { C.ease = v; },
          hint:'the original uses GSAP power2.inOut, which is inOutQuad' },
        num('pixel', 1, 60, 1, 'block size in CSS px · applied BEFORE the noise and the radius, so everything inherits the blocks. The original is 10'),
        num('noiseScale', 0.2, 10, 0.1, 'size of the warp'),
        num('noiseAmp', 0, 1.5, 0.01, 'how far it warps · 0 is a clean circle'),
        num('noiseSpeed', 0, 2, 0.01, 'drift along the noise\'s third axis, which is time'),
        num('steep', 2, 40, 0.5, 'how fast the field crosses the threshold · high is a thin band'),
        num('close', 0, 10, 0.1, 'the original\'s +2'),
        num('open', 4, 40, 0.5, 'the original\'s -15'),
        num('glowWidth', 0, 1, 0.01, 'rim width, as a share of the screen radius'),
        num('glowGain', 0, 12, 0.1, null),
        { label:'iris.borderColor', options:['#2E6BFF','#e8271c','#ffffff','#00ff88','#C8C8C8'],
          get: () => C.borderColor, set: v => { C.borderColor = v; } },
        num('dark', 0, 0.4, 0.005, 'the interior · the original is 0.015, which is nearly black'),
        num('bright', 0, 4, 0.05, 'the rim'),
        num('pulse', 0, 4, 0.05, 'sin(time * this) on the rim · the original is 1.5, which reads as a heartbeat over three seconds and a flicker over one'),
        { label:'iris.ground', options:['#000000','#393939','#101010','#ffffff'],
          get: () => C.ground, set: v => { C.ground = v; } },
        num('renderScale', 0.25, 1, 0.05, 'backing-store scale'),
      ];
    },
  };

  function hide(){
    cancelAnimationFrame(raf);
    if (canvas) canvas.classList.remove('is-on');
    T = 1; held = 1;
  }
})();
