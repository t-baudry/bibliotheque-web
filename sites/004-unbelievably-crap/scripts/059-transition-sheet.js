/* ==========================================================================
   transition-sheet.js — the page transition, made out of the home page's own
   block 01 -> block 02 tear.

   WHY THIS EXISTS RATHER THAN A SETTING ON THE IRIS. The iris is a radial
   dissolve: a glowing aperture that opens from the middle. The tear between
   the home page's two blocks is a DISPLACED HORIZONTAL EDGE — multi-octave
   value noise added to a signed distance before it is thresholded, so patches
   of the boundary are carried across zero and come away as separate shards.
   They are not two settings of one effect, so this is its own file, exactly as
   the iris and the liquid are.

   THE LOOK IS NOT RE-INVENTED HERE. The noise, the octaves, the threshold's
   half-width and the near-white the block lands on are the numbers already in
   js/dissolve-look.js and js/mask-scroll.js's CONFIG, copied verbatim below
   with their provenance noted at each one. The whole point of the request is
   that the page change and the block change be the SAME tear; a second set of
   numbers that merely looked similar would drift apart the first time either
   was tuned.

   WHAT IS DELIBERATELY LEFT OUT. mask-scroll's shader also composites block
   02 into the torn region — the character ground, the captions, the head —
   because on that page the tear IS the second block. Here there is nothing
   behind it but the next page, so the torn region is the flat ground the light
   pages use and nothing else. Aberration, frost and the CRT band are absent
   for the same reason they are invisible on the home page: all three are at
   zero there, and shipping three disabled features into a shader that runs on
   every navigation is paying for them at compile time forever.

   ONE SWEEP, NOT A SWEEP AND ITS UNDO. A page change is two halves around a
   real DOM swap, and the naive reading — run the tear forward to cover, then
   backwards to uncover — plays the second half in reverse and reads as a
   mistake being corrected. Both halves run uP 0 -> 1 here; `uOut` flips which
   side of the boundary is opaque, so the covering edge and the clearing edge
   travel the same way and the whole navigation is one continuous movement in
   one direction. See the note on `run` below.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- FIVE ROWS WERE RENAMED, AND IT WAS THE POINT, NOT A TIDY-UP -------
     The panel saves a value under its row's LABEL and restores it over the
     code on the next load. So when a default changes, anybody who had ever
     touched that row — or had it captured in a snapshot — keeps the old
     number for ever, and the change ships, deploys, and does nothing. That
     happened here to five rows at once: direction, both durations and the two
     ink colours, the last two still holding the loader's red from a bug fixed
     days ago.

     Renaming the label orphans the saved value, so the code wins again. It is
     the narrowest tool for this — bumping the store's version number would
     have cleared every page's tuning to fix five rows on one.

       direction -> dir        coverMs -> fillMs      uncoverMs -> clearMs
       top -> inkTop           foot -> inkFoot

     The CONFIG keys below are unchanged; only what the panel calls them. */
  const CONFIG = {
    enabled: true,

    /* Longer covering than clearing, the same asymmetry the iris ships with:
       the cover has to hide a page and is the half anyone looks at, and the
       clear is over the top of a page that has already arrived. */
    /* ---- ONE SET OF NUMBERS FOR BOTH ------------------------------------
       These were 900 and 520 — a navigation's own pair, chosen back when the
       tear between pages was furniture and the intro's exit was something
       else. It is one effect now, so it is one set of numbers: the fill and
       the clear the loader was tuned to, used by every navigation as well.

       The ONLY thing that differs between the two is which way it travels —
       `direction` against `loaderDirection`. Everything else, including these,
       is shared, which is the point: two copies of a timing are two things to
       keep in step by hand, and they never are. */
    coverMs: 520,      // the fill
    uncoverMs: 1400,   // …and the clear

    /* HOW MUCH OF THE CLEAR TO SKIP. Its first stretch is the tear still off
       the far edge with the screen sitting solid, which is dead time in a
       navigation exactly as it is in the intro. Shared for the same reason
       the durations are. */
    outFrom: 0.36,

    /* ---- THE NAVIGATION RUNS SLOWER THAN THE INTRO ------------------------
       A multiplier on fillMs and clearMs, and it applies to NAVIGATIONS ONLY.

       The two halves share one set of numbers on purpose — one tear on the
       site, not two that drift — but they are not watched under the same
       conditions. The intro's exit arrives after two and a half seconds of
       counting, so it is the end of something and can be brisk. A navigation
       is the whole event: you clicked, and this is all there is until the next
       page. At the intro's pace it is over before it has registered.

       It works by being the value used when NOBODY ASKED FOR ONE. The loader
       passes its durations explicitly, every time; a navigation calls cover()
       and uncover() bare, so those are the calls this catches. No page needs
       to know about it and no other caller can be caught by accident. */
    navScale: 2.7,

    /* THE LOADER'S EXIT — its UNCOVER, not its cover. See the long note in
       js/loader.js: on the way out the sheet is set to the loader's own red
       and rises over a red screen, so the cover is invisible by design. The
       tear you actually watch is the uncover clearing off the arrived page,
       and that is what this times.

       Separate from uncoverMs because the two are different jobs. Between
       pages the tear is FURNITURE — you clicked a link, you want the next
       page, and every millisecond it spends is a millisecond of waiting.
       Here it is the last beat of the intro and the one moment the effect is
       the thing being looked at. 520 is right for the first and far too quick
       for the second.

       0 means "use uncoverMs". */
    loaderMs: 0,
    /* THE FILLING HALF, separately. Both halves of the loader's exit are the
       same tear rising from the bottom — the first lays the red down, the
       second takes it away — and they read as one gesture repeated, so they
       share a duration by default. 0 means "same as loaderMs"; give it a
       number only to make the two deliberately different. */
    /* 1300 RATHER THAN loaderMs' 1400, and the hundred is not a stylistic
       choice. The fill covers the screen at about 59% of whatever it is given,
       so the rest is dead — a longer fill buys a longer pause, not a longer
       animation. Trimming it takes the last of the 25% that loaderOutFrom
       alone cannot reach, and it moves the visible part of the fill by under
       ninety milliseconds. */
    loaderInMs: 0,

    /* ---- THE SOLID-RED PAUSE, AND WHERE IT ACTUALLY COMES FROM -----------
       Measured on the built sequence, frame by frame: the screen is completely
       red for about 735ms. None of it is a pause anybody wrote.

         · the fill covers the screen at ~849ms of its 1400 — the remaining
           551 are spent easing a boundary that has already left the top;
         · the clear then spends its first ~184ms with the tear still below
           the bottom edge, so the screen stays solid.

       This dial removes the second one. The clearing half starts at a
       progress of `loaderOutFrom` instead of 0 — that is, exactly where its
       tear reaches the bottom edge and the first pixel of page appears — and
       its duration is shortened by the same share so the clear travels at
       precisely the rate it did before. Nothing visible is cut, because the
       part being skipped is by definition the part where nothing is visible.

       0 puts it back. Note the other half's 551ms is NOT taken here: cutting
       that means shortening the fill, and the fill is an animation somebody
       watches. */
    loaderOutFrom: 0,   // 0 follows outFrom

    /* ---- THE ONE DIAL FOR THE RED SCREEN ---------------------------------
       How much longer the screen holds solid red between the fill landing and
       the clear starting, in ms. A real wait, inserted at the one moment when
       nothing is moving anyway.

       IT ADDS TO A FLOOR IT CANNOT REACH UNDER, and that is worth knowing
       before turning it. About 550ms of red is not a pause at all — it is the
       two halves easing a boundary that is already off the top and not yet
       back from the bottom (see loaderInMs and loaderOutFrom, which is where
       that number came down from 717). This starts from there: 0 is the
       shortest the movement allows, 400 is a beat, 1200 is a held breath.

       One dial rather than three because the other two are the SHAPE of the
       movement and this is the LENGTH of the stillness between. Those are
       different questions and only the second one gets asked often. */
    loaderHoldMs: 0,

    /* ---- THE OTHER "WHEN" -------------------------------------------------
       There are exactly two moments in the loader's exit where nothing is
       moving and something is about to, and they are easy to mix up because
       both read as "the red just sits there":

         loaderStartMs   the line has reached 100% and the red has not begun
                         rising yet. The screen is still the BLACK loader.
         loaderHoldMs    the red has taken the screen and the clear has not
                         begun. The screen is SOLID RED.

       Every other dial in this file is a DURATION — how fast something moves.
       These two are the only ones that say WHEN it starts. */
    loaderStartMs: 0,

    /* THE BLOCK CHANGE'S OWN CURVE, not a tween chosen to look like it. See
       the note beside EASES: js/mask-scroll.js filters its boundary toward the
       scroll rather than tweening it, and `mask` is that filter written out.
       `inOutQuad` is the tidy version and is what this shipped as; the two are
       worth putting side by side once. */
    ease: 'mask',
    /* Where the loader's tear gets its shape. MASK reads js/mask-scroll.js's
       live values at the moment it runs, so the intro's exit IS the block
       change rather than a copy of it. OWN uses the five dials below. */
    loaderShape: 'own',   // mask · own
    /* The filter's time constant, in ms — mask-scroll's `ease: 0.5` seconds,
       in the units this file uses. It is an absolute time on purpose: that is
       what makes a long move settle like a short one instead of simply being
       a slow version of it. */
    easeTau: 500,

    /* ---- the tear ----
       js/dissolve-look.js, verbatim. That file is the single description of
       this displacement — the work page's cursor blobs and the home page's
       block boundary already share it, and this is the third reader of the
       same numbers rather than a fourth copy of them. */
    dispAmp:   0.175,   // how far the noise drags the boundary
    dispScale: 12.2,    // size of the tears · high is shrapnel, low is a wave
    dispDetail: 5,      // octaves · 1 is a smooth wobble, 5 is debris
    dispDrift: 0.0,     // how fast the pattern crawls · 0 holds it still
    soft:      0.001,   // half-width of the threshold · small keeps shards crisp

    /* THE BOW. js/mask-scroll.js's `lensBarrel`, and the one number that was
       missing all along — see the long note beside lensAt in the shader. 0 is
       a flat horizon, which is what this file drew before and why it never
       looked like the block change however the noise was tuned. Negative
       curves the middle up. */
    lens:     -0.275,

    /* ---- the ground it lands on ----
       js/mask-scroll.js's white/whiteFoot. Not a colour picked here: it is the
       light pages' own background, `linear-gradient(to bottom, #fff 0%,
       #afafaf 162.59%)` from css/style.css read over one viewport. Using the
       same two ends is what makes the covered screen the same room the site is
       already in rather than a white rectangle laid over it. */
    top:  '#EFEFEF',
    foot: '#FFFFFF',

    /* WHICH WAY IT TRAVELS. The home page's tear rises, because there the
       white is the room below arriving from under the fold. A navigation has
       no such geometry, so the direction is a dial; `up` keeps it identical to
       the block change. */
    /* ---- TWO DIRECTIONS, BECAUSE THEY ARE TWO DIFFERENT EVENTS -----------
       `direction` is what a NAVIGATION uses. Left, so the page slides away
       sideways: a click is a move across the site, and a sideways wipe says
       that in a way a vertical one does not — vertical is what the home page's
       own two blocks do to each other, and reusing it for a link made every
       navigation read as another scroll.

       `loaderDirection` is the intro's exit, and it stays UP on purpose: that
       one is meant to be the block-01-to-02 change exactly, and that change
       rises. One dial for both would have forced a choice between the two. */
    /* UP, the same way the loader's exit and the two home-page blocks go.
       It was `left` for a while on the argument that a click is a move ACROSS
       the site where a scroll is a move down it — which is a nice sentence and
       is not what the site looks like: every other change of room here rises,
       and the one that did not read as a different effect rather than as the
       same one applied to a different event. */
    direction: 'up',            // up · down · left · right   (navigation)
    loaderDirection: 'up',      // …and the loader's own exit

    renderScale: 1,
  };

/* ---- THE CURVES, AND WHY ONE OF THEM IS NOT A CURVE ----------------------

   `mask` is the block change's own motion, copied rather than approximated.

   js/mask-scroll.js does not TWEEN its boundary. It runs a filter — every
   frame it closes a share of the gap between where the edge is and where the
   scroll says it should be:

       current += (target - current) * (1 - exp(-dt / ease))     ease = 0.5s

   Flick the wheel and the target jumps to the far end, so what you actually
   watch is `1 - exp(-t / 0.5)`: a start with no acceleration at all, then a
   deceleration that takes about a second and a half to properly stop. That
   long creeping settle is the whole character of it — the thing that reads as
   the white block having weight rather than being slid into place.

   NONE OF THE EASES ABOVE CAN MAKE THAT SHAPE. They are all polynomials on a
   normalised 0..1, so they are the same picture whatever the duration; this
   one has a time CONSTANT in seconds, which means the same 0.5s settle
   whether the move takes 900ms or three seconds. At 900 it is a firm
   ease-out; at 2500 the edge has all but arrived by the first second and
   spends the rest easing the last few pixels — which is exactly what the
   block change does when you throw the wheel at it.

   That is also why it takes the duration as a second argument, and why the
   normalisation is there: the raw filter never reaches 1, so the value at the
   end of the run is divided out to land the edge exactly where it belongs
   rather than a fraction short of it. */
  const EASES = {
    linear:      k => k,
    inOutQuad:   k => (k < 0.5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2) / 2),
    inOutCubic:  k => (k < 0.5 ? 4*k*k*k : 1 - Math.pow(-2*k + 2, 3) / 2),
    outCubic:    k => 1 - Math.pow(1 - k, 3),
    outQuint:    k => 1 - Math.pow(1 - k, 5),
    mask:        (k, dur, tau) => {
      const n = Math.max(1, dur) / Math.max(1, tau);
      return (1 - Math.exp(-k * n)) / (1 - Math.exp(-n));
    },
  };

  const VERT = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAG = `
    precision highp float;
    varying vec2 vUv;
    uniform float uP, uTime, uAspect, uFlip, uOut, uProbe;
    uniform float uDispAmp, uDispScale, uDispDrift, uSoft;
    uniform float uLens, uAxis;
    uniform int uDetail;
    uniform vec3 uTop, uFoot;

    /* The hash, the value noise and the fbm are js/mask-scroll.js's, character
       for character. Same pattern in, same shards out — a "similar" noise would
       give a tear of the same character but not the same tear, and the two are
       seen back to back on the home page. */
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
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

    /* Signed distance to the displaced boundary, positive on the covered side.
       The noise is added HERE, before any threshold — that is what lets a patch
       be carried across zero and come away as a separate shard rather than as a
       wobble in a clean line. */
    /* THE TRAVEL COORDINATE AND THE NOISE, apart from each other. field() used
       to hold both; the probe below needs the second without the first. */
    float axisY(vec2 uv){
      vec2 q = (uAxis > 0.5) ? vec2(uv.y, uv.x) : uv;
      return mix(q.y, 1.0 - q.y, uFlip);
    }
    float noiseAt(vec2 uv){
      vec2 q = (uAxis > 0.5) ? vec2(uv.y, uv.x) : uv;
      float y = mix(q.y, 1.0 - q.y, uFlip);
      return fbm(vec2(q.x * uAspect, y) * uDispScale +
                 vec2(0.0, uTime * uDispDrift), uDetail) - 0.5;
    }

    float field(vec2 uv){
      /* THE TRAVEL AXIS IS ALWAYS q.y IN HERE. uAxis 1 swaps the two
         coordinates on the way in, so a horizontal sweep is the identical
         boundary read sideways rather than a second copy of this function with
         x and y exchanged. Everything below — the noise, the seal, the lens —
         is written once and works for both.

         The caller hands over an aspect that matches the axis (width over
         height for a vertical sweep, height over width for a horizontal one),
         so the tears come out the same SIZE either way instead of stretching
         into stripes on the long edge. */
      /* p=0 puts the edge just off one side of the screen and p=1 just off the
         other, so the sheet fills the whole frame at both ends of its travel
         however far the noise drags the boundary. */
      float edge = mix(-uDispAmp, 1.0 + uDispAmp, uP);
      return (edge - axisY(uv)) + noiseAt(uv) * uDispAmp * 2.0;
    }

    /* ---- THE SAME BOUNDARY, AS A NUMBER ANYONE CAN READ -------------------
       arriveAt() is the progress at which a pixel is taken: rearrange field>0
       and uP drops out as a plain threshold. Rendered into a small buffer once
       and read back, it is the whole tear as data — see probeGrid() below,
       and coverPath(), which turns it into a clip path so DOM content can be
       cut by this exact edge instead of by a straight line pretending to be
       it. Squeezed into 0..1 because the buffer is eight bits a channel. */
    float arriveAt(vec2 uv){
      float t = axisY(uv) - noiseAt(uv) * uDispAmp * 2.0;
      return (t + uDispAmp) / (1.0 + 2.0 * uDispAmp);
    }

    /* ---- THE LENS, AND IT IS THE WHOLE MISSING HALF ------------------------
       js/mask-scroll.js reads its boundary at a BARREL-WARPED coordinate, not
       at the screen's own — lensAt() in that file, driven by lensBarrel at
       -0.275. This file read it flat, and that one difference is the entire
       reason the two never matched: the tear numbers were identical, the noise
       was identical, the easing was identical, and one of them was drawn on a
       flat plane while the other was drawn on a tube.

       What it does: the coordinate is pushed away from the centre in
       proportion to the SQUARE of its distance from it. A boundary that is a
       straight horizontal line in field space therefore arrives on screen as a
       curve — flat in the middle, sweeping away at the edges. That bow across
       the middle is the thing that was being asked for, four times, and it was
       never going to come out of any combination of dispAmp and dispScale,
       because it is not made of noise.

       Copied verbatim rather than approximated, k and all. */
    vec2 lensAt(vec2 uv, float k, out bool outside){
      outside = false;
      vec2 d = uv - 0.5;
      vec2 w = 0.5 + d * (1.0 + k * dot(d, d) * 4.0);
      if (w.x < 0.0 || w.x > 1.0 || w.y < 0.0 || w.y > 1.0) outside = true;
      return w;
    }

    void main(){
      bool outside = false;
      vec2 uv = (uLens == 0.0) ? vUv : lensAt(vUv, uLens, outside);
      /* OUTSIDE THE TUBE IS NOT TRANSPARENT HERE, and this is where this file
         has to part company with mask-scroll. There the warp can throw a
         corner away because the page behind it is the room. This sheet is
         covering the screen — a discarded corner is a hole straight through to
         whatever is underneath, which during the loader's exit is the page it
         has not finished arriving at. So the corners clamp instead. */
      if (outside) uv = clamp(uv, 0.0, 1.0);

      /* THE PROBE PASS. Same shader, same warp, same noise — the only way the
         readback can be the tear that is actually on the screen rather than a
         convincing lookalike. A JS copy of this hash cannot be: sin() of a
         five-figure argument in a 24-bit float and in a 64-bit double part
         company completely, and the two tears would share every dial and no
         shards. */
      if (uProbe > 0.5){
        gl_FragColor = vec4(clamp(arriveAt(uv), 0.0, 1.0), 0.0, 0.0, 1.0);
        return;
      }

      float a = smoothstep(-uSoft, uSoft, field(uv));

      /* IT HAS TO CLOSE, AND IT HAS TO OPEN. The displaced boundary reaches the
         far side of the frame with its deepest tear at exactly zero, so at the
         end of the travel a few pixels along that edge sit at half coverage.
         Left alone that is a row of speckle in a screen that is meant to be
         solid — or, on the clearing half, a haze of debris left over the page
         that has just arrived. Both ends are sealed. */
      a = max(a, smoothstep(0.985, 1.0, uP));

      /* WHICH SIDE IS OPAQUE. uOut=1 makes the sheet the part that is LEAVING,
         so the same rising edge that covered the screen goes on rising and
         clears it. Reversing uP instead would send the tear back down the way
         it came, which reads as an undo rather than as a continuation. */
      a = mix(a, 1.0 - a, uOut);
      if (a <= 0.001) discard;

      vec3 col = mix(uFoot, uTop, clamp(vUv.y, 0.0, 1.0));
      gl_FragColor = vec4(col * a, a);
    }`;

  let canvas = null, gl = null, U = null, failed = false, guard = null;
  let raf = 0, T = 0, out = 0, t0 = performance.now();
  /* The resolve() of the run currently in flight, so a run that PRE-EMPTS it
     can settle it instead of abandoning it. See run(). */
  let pending = null;
  /* WHICH RUN IS THE CURRENT ONE. Bumped by every run(); a run that has been
     interrupted holds a stale number and must not touch the canvas on its way
     out. See hide() and uncover(). */
  let token = 0;

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
    U = { p:u('uP'), time:u('uTime'), aspect:u('uAspect'), flip:u('uFlip'),
          out:u('uOut'), dispAmp:u('uDispAmp'), dispScale:u('uDispScale'),
          dispDrift:u('uDispDrift'), soft:u('uSoft'), detail:u('uDetail'),
          lens:u('uLens'), axis:u('uAxis'), probe:u('uProbe'),
          top:u('uTop'), foot:u('uFoot') };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);   // premultiplied, as written
  }

  function init(){
    if (canvas || failed) return !failed;
    try {
      canvas = document.createElement('canvas');
      canvas.className = 'sheetfx';
      canvas.setAttribute('aria-hidden', 'true');
      gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true,
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
      console.warn('[sheet] unavailable, transition.js keeps the pixel wipe:', e.message);
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
    gl.uniform1f(U.p, T);
    gl.uniform1f(U.out, out);
    gl.uniform1f(U.probe, 0);
    gl.uniform1f(U.time, (performance.now() - t0) / 1000);
    /* WHICH WAY THIS RUN TRAVELS. `dir` is set by run(); see DIRS. */
    const w = Math.max(1, canvas.width), h = Math.max(1, canvas.height);
    const D = DIRS[dir] || DIRS.up;
    gl.uniform1f(U.axis, D.axis);
    /* THE ASPECT FOLLOWS THE AXIS. Along a vertical sweep the edge runs across
       the width, along a horizontal one it runs down the height — hand over
       the wrong one and the tears stretch into stripes. */
    gl.uniform1f(U.aspect, D.axis ? h / w : w / h);
    gl.uniform1f(U.flip, D.flip);
    /* SHAPE, BORROWED THE SAME WAY THE COLOUR IS. See setShape below: the
       loader asks for js/mask-scroll.js's own tear rather than a copy of its
       numbers, so the two can never drift apart again. */
    const S = shape || C;
    gl.uniform1f(U.dispAmp, S.dispAmp);
    gl.uniform1f(U.dispScale, S.dispScale);
    gl.uniform1f(U.dispDrift, S.dispDrift);
    gl.uniform1f(U.soft, Math.max(0.0002, S.soft));
    gl.uniform1i(U.detail, Math.max(1, Math.min(5, Math.round(S.dispDetail))));
    gl.uniform1f(U.lens, S.lens);
    /* THE OVERRIDE WINS, AND IT EXISTS SO NOTHING HAS TO WRITE TO CONFIG.

       js/loader.js needs this sheet in the loader's own red for one run. It
       used to get that by assigning C.top and C.foot and putting them back
       afterwards, which worked and had a nasty tail: the tuning panel snapshots
       CONFIG to localStorage, and a snapshot taken during that one run saved
       the loader's red as the sheet's PERMANENT colour. From then on every
       navigation on the site tore red instead of white, in one person's
       browser, with nothing in the code to explain it.

       A borrowed value should never be written into the thing it is borrowed
       from. */
    const K = scrubbing ? scrubInk : ink;
    gl.uniform3fv(U.top,  hex3(K ? K[0] : C.top));
    gl.uniform3fv(U.foot, hex3(K ? K[1] : C.foot));
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /* ONLY THE CURRENT RUN MAY HIDE THE CANVAS, and this guard is what makes a
     navigation-during-a-navigation safe.

     Interrupting a run settles its promise so the caller is not left hanging
     — which means the interrupted clear's `.then` still fires, a tick after
     the new cover has switched the canvas ON. Unguarded it takes `is-on`
     straight back off, and the new transition draws every frame perfectly into
     a canvas nobody can see: the click appears to do nothing at all.

     This only became reachable when js/transition.js stopped awaiting the
     clear, which is precisely what made clicking during it possible. */
  function hide(mine){
    if (mine !== undefined && mine !== token) return;
    if (canvas) canvas.classList.remove('is-on');
  }

  /* BOTH HALVES RUN 0 -> 1. `outward` is what differs: on the way in the sheet
     is what the edge leaves behind, on the way out it is what the edge takes
     with it. The edge itself travels the same direction across the screen for
     the whole navigation, which is the difference between one movement and a
     movement followed by its own reversal. */
  /* [top, foot] for the run in flight, or null for CONFIG's own. */
  let ink = null;
  /* The tear's shape for the run in flight, or null for CONFIG's own. */
  let shape = null;
  /* A scrub's own colour and its own flag — see scrub(). Kept apart from `ink`
     so a scrubbed frame can never colour the next real transition. */
  let scrubInk = null, scrubbing = false;
  /* Whether the sheet should sit above the loader — see setFront. Held here
     rather than on the element because it is asked for before the element
     exists. */
  let front = false;

  /* ---- WHICH WAY A RUN TRAVELS -------------------------------------------
     `axis` is which coordinate the boundary moves along — 0 vertical, 1
     horizontal — and `flip` reverses it. Named for the direction of TRAVEL, so
     `up` is the sheet rising and `left` is it moving leftward, which means it
     enters from the right.

     A table rather than two booleans threaded through the code: there are four
     of these and every one of them is a pair, so the pair is the thing worth
     naming. */
  const DIRS = {
    up:    { axis: 0, flip: 0 },
    down:  { axis: 0, flip: 1 },
    right: { axis: 1, flip: 0 },
    left:  { axis: 1, flip: 1 },
  };
  /* The direction of the run in flight. run() sets it; draw() reads it. */
  let dir = 'up';

  /* Guarded so a zero or a stray string cannot stop the transition dead — a
     navigation that never uncovers is a page nobody can reach. */
  const navK = () => {
    const k = Number(CONFIG.navScale);
    return (isFinite(k) && k > 0) ? k : 1;
  };

  function run(outward, ms, fromP, dirName){
    return new Promise(resolve => {
      if (!init()){ resolve(false); return; }

      /* SETTLE THE RUN THIS ONE IS INTERRUPTING — and this line is the whole
         reason navigation used to hang at random.

         cancelAnimationFrame below stops the previous run's `step` loop, and
         that loop contains the ONLY call to its promise's resolve(). Cancelled
         mid-flight, that promise stays pending forever.

         Which would be harmless if the two runs were never concurrent. They
         are: js/transition.js declares the Barba transition `sync: true`, so
         `leave` and `enter` run AT THE SAME TIME — leave awaits cover(), enter
         immediately calls uncover(), and uncover cancels cover. When cover
         happened to finish its last frame first, everything worked; when enter
         got there first, leave's promise never settled, Barba waited for a
         transition that could never end, and the click did nothing. Pure
         timing, so it failed perhaps one navigation in three.

         Resolved TRUE rather than false: true is what tells leave the screen is
         covered and the old container may be removed, which is exactly what
         should still happen — the navigation is already moving on. False would
         send it into the pixel-grid fallback on top of a transition that is
         mid-flight. */
      /* The canvas exists from here on, so anything asked for before it did
         gets applied now. See setFront. */
      canvas.classList.toggle('is-front', front);
      /* A REAL TRANSITION ENDS ANY SCRUB. The footer may have been holding the
         canvas a moment ago; from here it is this run's, with this run's
         colours and no multiply left on the element. */
      scrubbing = false; scrubInk = null;
      canvas.classList.remove('is-blend');
      dir = DIRS[dirName] ? dirName : (DIRS[CONFIG.direction] ? CONFIG.direction : 'up');
      token++;

      if (pending){ const settle = pending; pending = null; settle(true); }
      cancelAnimationFrame(raf);
      pending = resolve;
      canvas.classList.add('is-on');
      resize();
      out = outward ? 1 : 0;
      const ease = EASES[CONFIG.ease] || EASES.inOutQuad;
      /* SKIP THE INVISIBLE HEAD. `fromP` starts the travel part-way along
         rather than at zero, and the duration is cut by the same share so the
         edge moves at exactly the rate it would have. See loaderOutFrom. */
      const f0 = Math.max(0, Math.min(0.9, fromP || 0));
      const start = performance.now(), dur = Math.max(1, ms) * (1 - f0);
      (function step(now){
        const k = Math.min(1, (now - start) / dur);
        /* The duration and the time constant are handed to every curve and
           ignored by all but one — see the note beside EASES. */
        T = f0 + (1 - f0) * ease(k, dur, CONFIG.easeTau);
        draw();
        if (k < 1){ raf = requestAnimationFrame(step); }
        else { pending = null; resolve(true); }
      })(performance.now());
    });
  }


  /* ==========================================================================
     THE TEAR AS A CLIP PATH — so DOM content can be cut by this exact edge.

     WHY THIS EXISTS. The footer arrives the way block 02 does, and block 02's
     content is not faded in and not clipped by a straight line: it is INSIDE
     the composite, finished, and the displaced boundary cuts it per pixel
     (js/mask-scroll.js samples it as uBlockB and multiplies by the same mask).
     The footer's content is DOM — real type, real layout, real links — so it
     cannot go into the texture without being redrawn by hand. What it can do
     is wear the same boundary as a clip path.

     HOW. arriveAt() in the shader is the progress at which a pixel is taken.
     Rendered once into a small buffer and read back, it is the entire tear as
     a grid of numbers, and every frame after that is a threshold at p —
     marching squares over a static array, which is arithmetic and no noise at
     all. Read back rather than recomputed in JS on purpose: see the note by
     the probe branch.

     WHAT IT COSTS. One 8-bit readback per size (a few ms), then about a
     thousand comparisons and a path string per frame. The path is rebuilt only
     when the quantised progress moves.

     THE ONE THING IT CANNOT FOLLOW is a drifting pattern: dispDrift moves the
     noise with the clock and the grid is built once. It is 0 and has always
     been 0; if it is ever turned up, this goes stale and the clip and the red
     part company. Rebuild per frame there, or leave the drift alone.
     ========================================================================== */
  let probe = null;   // { key, nx, ny, xs, ys, data }

  function probeKey(dirName){
    const S = shape || CONFIG;
    return [dirName, window.innerWidth, window.innerHeight,
            S.dispAmp, S.dispScale, S.dispDetail, S.dispDrift, S.lens].join('|');
  }

  /* Render arriveAt() into an offscreen target and read it back. Offscreen and
     not the canvas itself: the canvas is on screen and may be mid-transition,
     and a probe frame drawn into it would be a grey rectangle across everyone's
     view for as long as it took the next frame to land. */
  function probeGrid(dirName){
    if (!init()) return null;
    if (guard && guard.lost()) return null;
    const key = probeKey(dirName);
    if (probe && probe.key === key) return probe;

    const vw = Math.max(1, window.innerWidth), vh = Math.max(1, window.innerHeight);
    /* ONE SAMPLE PER EIGHT PIXELS. Finer costs the readback and the marching;
       coarser starts swallowing the small shards, which are most of what makes
       this edge look like a tear rather than a wave. */
    const nx = Math.max(8, Math.min(240, Math.round(vw / 8)));
    const ny = Math.max(8, Math.min(240, Math.round(vh / 8)));

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, nx, ny, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

    let data = null;
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE){
      const S = shape || CONFIG;
      const D = DIRS[dirName] || DIRS.up;
      gl.viewport(0, 0, nx, ny);
      gl.disable(gl.BLEND);
      gl.uniform1f(U.probe, 1);
      gl.uniform1f(U.p, 0);
      gl.uniform1f(U.out, 0);
      gl.uniform1f(U.time, (performance.now() - t0) / 1000);
      gl.uniform1f(U.axis, D.axis);
      gl.uniform1f(U.aspect, D.axis ? vh / vw : vw / vh);
      gl.uniform1f(U.flip, D.flip);
      gl.uniform1f(U.dispAmp, S.dispAmp);
      gl.uniform1f(U.dispScale, S.dispScale);
      gl.uniform1f(U.dispDrift, S.dispDrift);
      gl.uniform1f(U.soft, Math.max(0.0002, S.soft));
      gl.uniform1i(U.detail, Math.max(1, Math.min(5, Math.round(S.dispDetail))));
      gl.uniform1f(U.lens, S.lens);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      const px = new Uint8Array(nx * ny * 4);
      gl.readPixels(0, 0, nx, ny, gl.RGBA, gl.UNSIGNED_BYTE, px);
      data = px;
      gl.uniform1f(U.probe, 0);
      gl.enable(gl.BLEND);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fbo);
    gl.deleteTexture(tex);
    resize();
    if (!data) return null;

    /* A SKIRT ROUND THE OUTSIDE, and both halves of it are load-bearing.

       WHERE IT SITS: twenty pixels off every side of the screen, because the
       samples are pixel CENTRES and the outermost one is half a cell in from
       the edge. Without something beyond them the grid stops short and the
       clip shaves a strip off all four sides of the page — here the copyright
       line and the top of the headline.

       WHAT IT HOLDS: 1, which is "never covered". A contour that reaches the
       edge of the grid is an open chain with nothing to close it, and an
       unclosed subpath fills as if someone had drawn a straight line across
       the screen. A ring the tear can never take means every contour closes on
       itself inside the grid, off screen, and the whole question disappears. */
    const NX = nx + 2, NY = ny + 2;
    const xs = new Float32Array(NX), ys = new Float32Array(NY);
    xs[0] = -20; xs[NX - 1] = vw + 20;
    for (let i = 0; i < nx; i++) xs[i + 1] = (i + 0.5) / nx * vw;
    ys[0] = -20; ys[NY - 1] = vh + 20;
    for (let j = 0; j < ny; j++) ys[j + 1] = (j + 0.5) / ny * vh;

    const g = new Float32Array(NX * NY);
    g.fill(1);
    for (let j = 0; j < ny; j++){
      /* readPixels comes back bottom-up; the grid is written top-down, which is
         the direction every coordinate on the page is measured in. */
      const row = (ny - 1 - j) * nx * 4;
      for (let i = 0; i < nx; i++)
        g[(j + 1) * NX + (i + 1)] = data[row + i * 4] / 255;
    }
    probe = { key, nx: NX, ny: NY, xs, ys, data: g };
    return probe;
  }

  /* MARCHING SQUARES, and the table is the ordinary one: a cell's four corners
     give sixteen cases, each case a segment or two between the points where the
     threshold crosses the cell's edges. Two things are worth knowing.

     THE EDGE POINTS ARE ADDRESSED, NOT COMPARED. Each crossing is named by the
     grid edge it sits on — one integer — so neighbouring cells agree on a
     shared point exactly rather than nearly, and the segments stitch into
     closed loops with no tolerance to tune.

     THE WINDING SORTS THE HOLES OUT BY ITSELF. Every case is written with the
     covered side on the same hand, so an island comes out wound against the
     shape that contains it and `path()`'s nonzero fill drops it. That is what
     makes the shards read as holes torn THROUGH the sheet rather than as extra
     patches of it. */
  /* 0 top, 1 right, 2 bottom, 3 left · pairs are from → to.
     bit 1 top-left, 2 top-right, 4 bottom-right, 8 bottom-left, set when that
     corner is already covered. 5 and 10 are the saddles and get two segments. */
  const MS = [
    [],       [0,3],     [1,0],     [1,3],
    [2,1],    [0,3,2,1], [2,0],     [2,3],
    [3,2],    [0,2],     [1,0,3,2], [1,2],
    [3,1],    [0,1],     [3,0],     [],
  ];

  /* Scratch, kept between frames. A path a frame is a lot of very short-lived
     objects, and this runs inside a scroll: the maps and the arrays this used
     to allocate were most of its cost. Sized once per grid. */
  let ptX = null, ptY = null, next = null, touched = null, nTouch = 0;

  function coverPath(p, opts){
    const o = opts || {};
    const dirName = DIRS[o.dir] ? o.dir : 'up';
    const g = probeGrid(dirName);
    if (!g) return null;
    if (p >= 0.9995) return 'none';            // the whole screen · no clip
    if (p <= 0.0005) return 'path("M 0 0 Z")'; // nothing yet

    const { nx: NX, ny: NY, xs, ys, data } = g;
    const H = NX * NY;                 // ids 0..H-1 horizontal, H.. vertical
    if (!next || next.length !== 2 * H){
      ptX = new Float32Array(2 * H); ptY = new Float32Array(2 * H);
      next = new Int32Array(2 * H); touched = new Int32Array(2 * H);
      next.fill(-1);
    }
    while (nTouch > 0) next[touched[--nTouch]] = -1;

    for (let j = 0; j < NY - 1; j++){
      const r0 = j * NX, r1 = r0 + NX;
      for (let i = 0; i < NX - 1; i++){
        const va = data[r0 + i], vb = data[r0 + i + 1];
        const vd = data[r1 + i], vc = data[r1 + i + 1];
        const code = (va < p ? 1 : 0) | (vb < p ? 2 : 0) |
                     (vc < p ? 4 : 0) | (vd < p ? 8 : 0);
        if (code === 0 || code === 15) continue;
        const cuts = MS[code];
        const x0 = xs[i], x1 = xs[i + 1], y0 = ys[j], y1 = ys[j + 1];
        for (let k = 0; k < cuts.length; k += 2){
          let a = cuts[k], bq = cuts[k + 1], id0 = 0, id1 = 0;
          for (let q = 0; q < 2; q++){
            const e = q ? bq : a;
            /* 0 top, 1 right, 2 bottom, 3 left — named by the GRID edge they
               sit on, so the cell next door lands on the same integer and the
               segments stitch with no tolerance to get wrong. */
            const id = e === 0 ? (r0 + i) : e === 2 ? (r1 + i)
                     : e === 3 ? (H + r0 + i) : (H + r0 + i + 1);
            if (q) id1 = id; else id0 = id;
            if (e === 0){ ptX[id] = x0 + (p - va) / ((vb - va) || 1e-6) * (x1 - x0); ptY[id] = y0; }
            else if (e === 2){ ptX[id] = x0 + (p - vd) / ((vc - vd) || 1e-6) * (x1 - x0); ptY[id] = y1; }
            else if (e === 3){ ptX[id] = x0; ptY[id] = y0 + (p - va) / ((vd - va) || 1e-6) * (y1 - y0); }
            else { ptX[id] = x1; ptY[id] = y0 + (p - vb) / ((vc - vb) || 1e-6) * (y1 - y0); }
          }
          if (next[id0] === -1) touched[nTouch++] = id0;
          next[id0] = id1;
        }
      }
    }
    if (!nTouch) return 'path("M 0 0 Z")';

    /* Walk each chain to its end. `next` is emptied as it is read, so a loop
       cannot be started twice and a corrupt chain cannot run for ever. */
    const out = [];
    for (let t = 0; t < nTouch; t++){
      let at = touched[t];
      if (next[at] === -1) continue;
      out.push('M', ptX[at].toFixed(1), ' ', ptY[at].toFixed(1));
      let n = 0;
      while (at !== -1 && n++ < 1e6){
        const nx2 = next[at];
        next[at] = -1;
        if (nx2 === -1) break;
        out.push('L', ptX[nx2].toFixed(1), ' ', ptY[nx2].toFixed(1));
        at = nx2;
      }
      out.push('Z');
    }
    nTouch = 0;
    return out.length ? 'path("' + out.join('') + '")' : 'path("M 0 0 Z")';
  }

  window.SHEETFX = {
    config: CONFIG,
    /* Borrow the sheet's colour for the next run or two. Cleared by hand, not
       automatically: the loader covers in red, hands over, and uncovers in the
       same red, and something that reset itself after the cover would put the
       white back mid-flight. */
    setInk(top, foot){ ink = [top, foot]; },
    clearInk(){ ink = null; },

    /* ---- SCRUBBED, RATHER THAN PLAYED ------------------------------------
       One frame at a progress somebody else owns. js/footer.js drives this off
       block 02's scroll, which is how the home page's own block change works —
       the boundary is a function of where you are, not of a clock.

       WHY IT IS HERE AND NOT A SECOND COPY OF THE EFFECT. The footer is meant
       to arrive by the SAME tear as everything else, and "the same" has to
       mean one shader with one set of dials, or it is two things that look
       alike until the first time either is touched. This is the whole reason
       the effect stopped being duplicated in the loader as well.

       IT YIELDS TO A NAVIGATION WITHOUT ARGUING. A page transition is a run
       with a token; a scrub is not, and it simply declines while one is in
       flight rather than fighting it for the canvas. A footer half-drawn under
       a page that is leaving is nobody's intended picture, and the scroll that
       drives it is about to be a different page's anyway. */
    scrub(p, opts){
      if (!init()) return false;
      if (pending) return false;          // a real transition owns the canvas
      const o = opts || {};
      dir = DIRS[o.dir] ? o.dir : 'up';
      /* ITS OWN INK, NOT THE SHARED ONE. Writing the footer's red into `ink`
         would leave it there for whatever ran next — a navigation started from
         the footer would have torn red across the site, which is the same
         leak the loader had and the reason setInk exists at all. */
      scrubInk = (o.top || o.foot) ? [o.top || o.foot, o.foot || o.top] : null;
      scrubbing = true;
      out = 0;
      T = Math.max(0, Math.min(1, p));
      canvas.classList.toggle('is-on', T > 0.0005);
      canvas.classList.toggle('is-blend', !!o.blend);
      if (T > 0.0005){ resize(); draw(); }
      return true;
    },
    /* THE SAME TEAR AS A CLIP PATH · see coverPath() above. Returns a CSS
       clip-path string, 'none' once the screen is entirely covered, or null if
       there is no WebGL to ask — the caller has to have an answer for that. */
    coverPath(p, opts){ return coverPath(p, opts); },

    /* Hand the canvas back — the scrub has finished with it. */
    unscrub(){
      scrubbing = false; scrubInk = null;
      if (!canvas || pending) return;
      canvas.classList.remove('is-on', 'is-blend');
    },

    /* ABOVE THE LOADER. See the note beside .sheetfx.is-front in
       css/transition.css: without this the intro's covering half animates
       behind a layer eight hundred z-indexes higher and is never seen.

       THE STATE IS REMEMBERED, NOT WRITTEN STRAIGHT TO THE ELEMENT, and that
       is not tidiness — it is the bug this had on its first try. The canvas
       does not exist until the first run() calls init(), and js/loader.js asks
       for the front BEFORE it calls cover(), which is the only sane order:
       raise it, then draw on it. Written straight to `canvas` the call landed
       on null, did nothing, and the covering half went on animating behind the
       loader exactly as before — the change was real, shipped, and had no
       effect whatsoever. run() re-applies it once the canvas is there. */
    setFront(on){
      front = !!on;
      if (canvas) canvas.classList.toggle('is-front', front);
    },

    /* ---- REPLAY THE LOADER'S EXIT, ON DEMAND ---------------------------
       Because the alternative is a reload for every guess.

       This dial exists after four rounds of me changing a number, asking for
       a push, and being told nothing changed — with no way for either of us
       to see the thing under discussion without reloading the page and
       watching two and a half seconds go by. Whatever the loader's tear
       turns out to be, it cannot be tuned through that loop.

       It runs exactly what finish() in js/loader.js runs: the loader's red,
       the loader's duration, and whatever shape the caller passes — so what
       you watch here is the real thing and not a demonstration of it. */
    replayLoader(shapeSrc){
      if (shapeSrc !== undefined) this.setShape(shapeSrc);
      this.setInk('#e8271c', '#e8271c');
      this.setFront(true);
      const out = (CONFIG.loaderMs > 0) ? CONFIG.loaderMs : CONFIG.uncoverMs;
      /* coverMs, not `out` — see the note in js/loader.js. */
      const inn = (CONFIG.loaderInMs > 0) ? CONFIG.loaderInMs : CONFIG.coverMs;
      const done = () => { this.clearInk(); this.clearShape(); this.setFront(false); };
      const hold = Math.max(0, CONFIG.loaderHoldMs || 0);
      const wait = Math.max(0, CONFIG.loaderStartMs || 0);
      return (wait ? new Promise(r => setTimeout(r, wait)) : Promise.resolve())
        .then(() => this.cover(inn, CONFIG.loaderDirection))
        .then(() => hold ? new Promise(r => setTimeout(r, hold)) : null)
        .then(() => this.uncover(out, CONFIG.loaderOutFrom || CONFIG.outFrom,
                                 CONFIG.loaderDirection))
        .then(done, done);
    },

    /* BORROW A TEAR RATHER THAN COPY ONE.

       The loader's exit is supposed to be the block-01-to-02 change, one to
       one. It was built as a copy of that effect's numbers, and a copy is a
       promise you have to keep by hand: tune the block change on the panel and
       the loader keeps the old shape, silently, and the two drift apart with
       nothing on screen to say why. That is exactly what happened — the two
       LOOKED different and both files said 0.095.

       So the loader hands over js/mask-scroll.js's live config instead. Same
       object the block change is drawing from, read at the moment of use.
       There is no second set of numbers to keep in sync because there is no
       second set of numbers.

       Only the five that shape the boundary; the colour, the direction and the
       duration stay this file's own, because those genuinely are the loader's
       business and not the block change's. */
    setShape(src){
      if (!src){ shape = null; return; }
      /* PER KEY, WITH THIS FILE'S OWN AS THE FALLBACK. The caller may hand
         over a partial object — js/loader.js builds one from two sources and
         either may be missing a value — and a missing number reaching a
         uniform is a NaN, which in GLSL is not an error, it is a boundary
         that quietly stops existing. */
      const pick = k => (typeof src[k] === 'number' ? src[k] : CONFIG[k]);
      shape = {
        dispAmp:    pick('dispAmp'),
        dispScale:  pick('dispScale'),
        dispDetail: pick('dispDetail'),
        dispDrift:  pick('dispDrift'),
        soft:       pick('soft'),
        /* mask-scroll calls it lensBarrel; same number, and it is the one that
           actually makes the two look alike. */
        lens: (typeof src.lensBarrel === 'number') ? src.lensBarrel
            : (typeof src.lens === 'number') ? src.lens : CONFIG.lens,
      };
    },
    clearShape(){ shape = null; },

    /* `ms` omitted means a navigation — see navScale. */
    cover(ms, dirName){
      if (!CONFIG.enabled) return Promise.resolve(false);
      return run(false, ms == null ? CONFIG.coverMs * navK() : ms, 0, dirName);
    },
    uncover(ms, fromP, dirName){
      if (!CONFIG.enabled) return Promise.resolve(false);
      /* THE SKIP IS THE DEFAULT, not something only the loader asks for — see
         outFrom. A caller can still override it, and passing 0 puts the dead
         stretch back. */
      const from = (fromP == null) ? CONFIG.outFrom : fromP;
      const p = run(true, ms == null ? CONFIG.uncoverMs * navK() : ms, from, dirName);
      /* READ IMMEDIATELY AFTER, and that is exact rather than lucky: run()
         bumps the token inside the promise's executor, which JavaScript runs
         synchronously, so by this line `token` is this run's own number. If
         something interrupts before the clear finishes, the token has moved on
         and hide() declines — see the note there. */
      const mine = token;
      return p.then(ok => { hide(mine); return ok; });
    },
    /* Park it fully covering — what the fallback wipe's two halves need across
       a real page load, where the second half runs in a document that has only
       just started. */
    hold(){
      if (!CONFIG.enabled || !init()) return false;
      cancelAnimationFrame(raf);
      canvas.classList.add('is-on');
      resize(); T = 1; out = 0; draw();
      return true;
    },
    seek(v){
      if (!init()) return false;
      cancelAnimationFrame(raf);
      canvas.classList.add('is-on');
      resize(); T = Math.max(0, Math.min(1, v)); out = 0; draw();
      return true;
    },
    hide,
    /* THE COLOUR SOMEONE ELSE HAS TO PAINT. On the no-Barba path the next
       document puts up a flat sheet before its first paint, long before this
       file has loaded — see html.is-wiping in css/transition.css. It has to be
       this sheet's colour or the arrival flashes. The foot rather than the top
       because the ramp between them is two levels of near-white and the foot is
       the one the eye lands on first. */
    coverColour(){ return CONFIG.foot; },
    preview(){
      return this.cover().then(() => new Promise(r => setTimeout(r, 220)))
                 .then(() => this.uncover());
    },
    apply(){ resize(); },
    readout(){
      return { sheet: failed ? 'failed' : (canvas ? 'ready' : 'not started'),
               sheetP: T.toFixed(2),
               /* What the last run actually drew with — the only way to see
                  whether the loader's borrow reached this file or fell back. */
               sheetShape: shape
                 ? ('borrowed ' + shape.dispAmp + ' / ' + shape.dispScale)
                 : ('own ' + CONFIG.dispAmp + ' / ' + CONFIG.dispScale) };
    },
    rows(){
      const C = CONFIG;
      const num = (key, min, max, step, hint) => ({
        label: 'sheet.' + key, min, max, step,
        get: () => C[key], set: v => { C[key] = v; }, hint,
      });
      return [
        { label: 'sheet.enabled', options: ['on','off'],
          get: () => (C.enabled ? 'on' : 'off'),
          set: v => { C.enabled = v === 'on'; },
          hint: 'the page transition · off falls back to the iris, and to the pixel grid if that is off too' },
        /* RENAMED FROM sheet.dir, and that is the only way this change could
           reach anyone who has ever touched the panel: js/tuner.js stores by
           the row's LABEL and restores it over the code, so a saved `left`
           would have gone on winning against every default written here. A new
           label has nothing saved against it and the code's own value stands. */
        { label: 'sheet.navDir', options: ['up','down','left','right'],
          get: () => C.direction, set: v => { C.direction = v; },
          hint: 'which way the tear travels ON A NAVIGATION · named for the direction of travel, so UP enters from the bottom edge · up because that is what every other change of room on this site does, including the loader’s exit and block 01 into block 02' },
        { label: 'sheet.loaderDirection', options: ['up','down','left','right'],
          get: () => C.loaderDirection, set: v => { C.loaderDirection = v; },
          hint: 'the same for the LOADER’S exit, which is separate on purpose · up, because that one is meant to be the block-01-to-02 change exactly and that change rises' },
        /* WRITTEN OUT RATHER THAN THROUGH num(), because that helper builds the
           label from the config key and these two needed a NEW LABEL over the
           SAME key — see the note at the top of CONFIG. */
        num('navScale', 0.25, 4, 0.05,
          'how much slower a NAVIGATION runs than the intro\u2019s exit \u00b7 both use the same two durations below, and this multiplies them for page-to-page only \u00b7 the intro arrives after two and a half seconds of counting so it can be brisk, where a click has nothing before it and the whole event is this \u00b7 1 makes them identical'),
        { label: 'sheet.fillMs', min: 120, max: 3000, step: 10,
          get: () => C.coverMs, set: v => { C.coverMs = v; },
          hint: 'how long the sheet takes to cover the page you are leaving \u00b7 the loader\u2019s exit uses this same number, so there is one fill on the site rather than two that drift' },
        { label: 'sheet.clearMs', min: 120, max: 3000, step: 10,
          get: () => C.uncoverMs, set: v => { C.uncoverMs = v; },
          hint: '\u2026and to clear off the one you have arrived at \u00b7 shared with the loader for the same reason' },
        { label: 'sheet.replay', options: ['\u2014','play'],
          get: () => '\u2014',
          set: v => {
            if (v !== 'play') return;
            const M = window.MASKSCROLL;
            window.SHEETFX.replayLoader(
              CONFIG.loaderShape === 'own' ? null : (M && M.config) || null);
          },
          hint: 'run the loader\u2019s exit here and now, with its own red and its own duration \u00b7 the only way to see it without reloading and sitting through the count every time \u00b7 to TUNE the shape, set loaderShape to OWN first \u2014 on MASK the numbers come from the block change and the dials below are ignored, which is the whole point of that setting' },
        { label: 'sheet.loaderShape', options: ['mask','own'],
          get: () => C.loaderShape, set: v => { C.loaderShape = v; },
          hint: 'where the LOADER\u2019S tear gets its shape \u00b7 MASK reads js/mask-scroll.js\u2019s live numbers as it runs, so the intro\u2019s exit is the block-01-to-02 change itself and not a copy that drifts the first time you tune one of them \u00b7 OWN uses the five dials below, which are also what every page-to-page navigation uses' },
        num('loaderStartMs', 0, 3000, 20,
          'WHEN THE RED STARTS RISING \u00b7 ms to wait after the line reaches 100%% before the fill begins \u00b7 the screen is still the BLACK loader through this \u00b7 this and loaderHoldMs are the only two dials here that say WHEN something starts; every other one says how fast it moves once it has'),
        num('loaderHoldMs', 0, 2000, 20,
          'HOW LONG THE SCREEN HOLDS SOLID RED, in ms, between the fill landing and the clear starting \u00b7 this is the one to play with \u00b7 it ADDS to about 550ms that the movement itself costs \u2014 that is the two halves easing a boundary already off the top and not yet back from the bottom, not a pause anybody wrote \u00b7 so 0 is the shortest this can be, 400 is a beat, 1200 is a held breath \u00b7 to go UNDER the floor it is loaderOutFrom and loaderInMs, which are the shape of the movement rather than the length of the stillness'),
        num('outFrom', 0, 0.6, 0.005,
          'how much of the CLEARING half to skip, everywhere \u00b7 for its first stretch the tear is still off the far edge and the screen just sits solid, which is dead time on a navigation as much as in the intro \u00b7 starting part-way along removes exactly that, and the duration is cut by the same share so the edge still travels at the same speed \u00b7 0 puts the pause back'),
        num('loaderOutFrom', 0, 0.6, 0.005,
          'how much of the CLEARING half to skip \u00b7 for its first stretch the tear is still below the bottom edge and the screen just sits solid red, and that is most of what reads as the red standing too long \u00b7 starting part-way along removes exactly that, and the duration is cut by the same share so the edge still travels at the same speed \u00b7 0 puts the pause back'),
        num('loaderInMs', 0, 6000, 20,
          'THE LOADER\u2019S FILL \u00b7 how long the red takes to rise and take the screen, before the page arrives \u00b7 0 follows loaderMs, which is usually right: the two halves are the same movement made twice and look wrong at different speeds'),
        num('loaderMs', 0, 6000, 20,
          'THE LOADER ONLY, as an override \u00b7 0 follows uncoverMs \u00b7 how long the tear takes as it clears off the arrived page \u00b7 this is the UNCOVER, not the cover: on the way out the sheet is set to the loader\u2019s own red and rises over a red screen, so the covering half is invisible by design and timing it changes nothing you can see \u00b7 0 means follow uncoverMs, which at 520 is right between pages and far too quick for an intro \u00b7 changing it shows on the NEXT reload, because by the time you can touch this dial the loader has already run'),
        { label: 'sheet.ease', options: Object.keys(EASES),
          get: () => C.ease, set: v => { C.ease = v; },
          hint: 'the curve the edge travels on \u00b7 MASK is the block-01-to-02 change\u2019s own motion, copied rather than imitated: that boundary is not tweened at all, it is filtered toward the scroll, so it starts at full speed and then takes about a second and a half to properly stop \u00b7 the others are ordinary tweens and are the same picture at any duration' },
        num('easeTau', 60, 2000, 10,
          'MASK only \u00b7 the filter\u2019s time constant, in ms \u00b7 500 is js/mask-scroll.js\u2019s own half second \u00b7 it is an ABSOLUTE time, which is the point: a long move settles like a short one rather than being a slow version of it, so a three-second loader exit arrives almost at once and then spends the rest easing the last few pixels, exactly as the block change does when you throw the wheel at it'),
        num('lens', -0.8, 0.8, 0.005,
          'THE BOW ACROSS THE MIDDLE \u00b7 the boundary is read at a barrel-warped coordinate, so a straight line in the noise arrives on screen as a curve \u00b7 this is js/mask-scroll.js\u2019s lensBarrel and it is the whole difference between this tear and the block-01-to-02 one \u00b7 0 is a flat horizon, -0.275 is the block change\u2019s own'),
        num('dispAmp', 0, 0.4, 0.005,
          'how far the noise drags the boundary · 0 is a straight line sweeping across, which is a plain wipe'),
        num('dispScale', 1, 40, 0.1,
          'the size of the tears · high is shrapnel, low is one long wave'),
        num('dispDetail', 1, 5, 1,
          'octaves of noise · 1 is a smooth wobble, 5 is debris'),
        num('dispDrift', 0, 2, 0.01,
          'how fast the pattern crawls while it travels · 0 holds it still, which is the home page’s'),
        num('soft', 0.0002, 0.05, 0.0002,
          'half-width of the threshold · small keeps the shards crisp, large melts them into a gradient'),
        { label: 'sheet.inkTop', options: ['#EFEFEF','#FFFFFF','#CECECE','#000000','#e8271c'],
          get: () => C.top, set: v => { C.top = v; },
          hint: 'the sheet at the top of the frame' },
        { label: 'sheet.inkFoot', options: ['#FFFFFF','#EFEFEF','#CECECE','#000000','#e8271c'],
          get: () => C.foot, set: v => { C.foot = v; },
          hint: '…and at the foot · the two are the light pages’ own background ramp' },
        num('renderScale', 0.25, 1, 0.05,
          'draw at less than full resolution if it ever costs too much'),
      ];
    },
  };
})();
