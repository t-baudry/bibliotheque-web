/* ==========================================================================
   head-spin.js — click the head, it turns once and comes back.

   WHAT IT DOES. A click anywhere over block 02 spins the head a whole number
   of turns, shrinking it slightly on the way round and returning it to exactly
   the size and angle it was at.

   WHY IT RETURNS EXACTLY, which is the only part of this with a trap in it.
   The spin is applied as a DELTA PER FRAME against an eased target, not as an
   absolute angle: each frame asks for `eased * total` degrees and hands over
   the difference from what it has already applied. Two things follow. The
   total delta is exactly `turns * 360` however the easing is shaped and
   however the frames land, so a whole number of turns lands on the same face
   it left. And the head's own motion — the idle drift, the scroll spin, the
   pointer follow — keeps running underneath and is neither fought nor
   overwritten, because nothing here ever writes the angle, only adds to it.

   Setting the angle instead (setAngle) would have done neither: it would have
   dropped the queued idle drift on the first frame and fought the scroll spin
   for every one after.

   THE SIZE IS A STORED BASE, not a running multiply. CONFIG.height is read
   once when the spin starts and written back verbatim at the end, so a click
   during a click, a page change mid-spin, or a thrown frame cannot leave the
   head a few percent smaller than it started — which is exactly what
   accumulating `height *= 0.97` would do, invisibly, one click at a time.

   WHY CONFIG.height WORKS AT ALL: about-figure prefers a --fig-height CSS
   property over CONFIG.height when the canvas sets one, and #maskBody does
   not — only #aboutFigure does, on mobile. So this dial is live here. If that
   ever changes, this control goes silently dead, which is the reason the
   sentence is in the file.
   ========================================================================== */
window.PAGE.register('head-spin', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'mask') return;

  const root = scope.querySelector('.b2');
  if (!root) return;

  const CONFIG = {
    enabled: true,
    turns: 1,        // whole turns per click · fractions do not come back level
    ms: 1100,        // how long one click takes
    scale: 0.17,     // how much smaller at the halfway point, as a share
    ease: 'custom',  // a name below, or 'custom' for the four handles
    /* THE CUSTOM CURVE, as the two control points of a cubic bezier — the same
       four numbers Figma and CSS use, in the same order. Only read when
       `ease` is 'custom'. y is deliberately NOT clamped to 0..1: pushing it
       past 1 is how you get an overshoot that swings past the landing and
       settles back, and pulling it below 0 is how you get the wind-up before
       the turn. x is clamped, because a control point outside 0..1 on the time
       axis makes the curve non-monotonic in t and the spin would run
       backwards. */
    p1x: 1.00, p1y: 0.00,
    p2x: 0.40, p2y: 1.06,
    scaleOn: 'time',  // time · ease — which clock the size dip runs on
    queue: 4,        // clicks that may stack up while one is already turning
  };

  const EASE = {
    linear: t => t,
    in:     t => t * t * t,
    out:    t => 1 - Math.pow(1 - t, 3),
    inout:  t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    expo:   t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
    back:   t => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2),
  };

  /* ---- the custom curve -------------------------------------------------
     A cubic bezier from (0,0) to (1,1) with the two control points from
     CONFIG. Both axes are the same cubic; the work is that we are given TIME
     and the curve is parameterised by its own variable, so x has to be
     inverted before y can be read.

     NEWTON FIRST, BISECTION AS THE FLOOR. Newton converges in three or four
     steps on the curves anyone actually draws, and stalls where the curve goes
     briefly flat — dx/du near zero — which is exactly what a control point at
     x = 0 or x = 1 produces, and those are the two a designer reaches for
     first. Bisection cannot stall and cannot leave the interval, so it is what
     catches that case rather than a silent wrong answer or a hang.

     A ZERO-WIDTH GUARD is not needed on the interval itself: u stays in [0,1]
     by construction and 24 halvings put it inside 1e-7 of the root, which is
     finer than a frame can show. */
  function bez1(a, b, u){
    const v = 1 - u;
    return 3 * v * v * u * a + 3 * v * u * u * b + u * u * u;
  }

  function bezier(t){
    const x1 = Math.max(0, Math.min(1, CONFIG.p1x));
    const x2 = Math.max(0, Math.min(1, CONFIG.p2x));
    const y1 = CONFIG.p1y, y2 = CONFIG.p2y;

    if (t <= 0) return 0;
    if (t >= 1) return 1;

    let u = t;
    for (let i = 0; i < 5; i++){
      const x = bez1(x1, x2, u) - t;
      if (Math.abs(x) < 1e-6) return bez1(y1, y2, u);
      const v = 1 - u;
      const d = 3 * v * v * (x1) + 6 * v * u * (x2 - x1) + 3 * u * u * (1 - x2);
      if (Math.abs(d) < 1e-6) break;      // flat — hand it to bisection
      u -= x / d;
      if (u < 0 || u > 1) break;          // left the interval — same
    }

    let lo = 0, hi = 1;
    u = t;
    for (let i = 0; i < 24; i++){
      const x = bez1(x1, x2, u);
      if (x < t) lo = u; else hi = u;
      u = (lo + hi) / 2;
    }
    return bez1(y1, y2, u);
  }

  function easeAt(t){
    if (CONFIG.ease === 'custom') return bezier(t);
    return (EASE[CONFIG.ease] || EASE.inout)(t);
  }

  const on = window.PAGE.bindings();

  let raf = 0, running = false, queued = 0;
  let applied = 0, baseHeight = 0, startAt = 0;

  function head(){
    const f = window.FIGURE_B;
    return (f && typeof f.orbit === 'function') ? f : null;
  }

  /* Put the size back and forget the run. Called from the end of a spin, from
     a failure, and from destroy() — three paths that must not leave the head
     at a mid-flight size. */
  function settle(f){
    if (f && baseHeight) f.config.height = baseHeight;
    running = false;
    applied = 0;
    baseHeight = 0;
    raf = 0;
  }

  function frame(now){
    const f = head();
    if (!f){ settle(null); return; }

    const t = Math.max(0, Math.min(1, (now - startAt) / Math.max(1, CONFIG.ms)));
    const e = easeAt(t);

    /* THE DELTA, never the angle. See the note at the top. */
    const want = e * CONFIG.turns * 360;
    f.orbit(want - applied, 0);
    applied = want;

    /* Symmetric in RAW t, not in the eased value: sin(pi*t) is exactly 0 at
       both ends whatever the easing does in between, so the size cannot be
       left short by a rounding of the last frame. */
    if (baseHeight){
      /* WHICH CLOCK THE DIP RUNS ON. Raw t keeps the shrink symmetric in real
         time whatever the curve does; the eased value ties it to the motion,
         so a slow start shrinks slowly too. Both are exactly 0 at each end —
         e(0) is 0 and e(1) is 1 for every curve here — so neither can leave
         the head off its size. With an overshooting curve the eased option
         briefly passes 1, and sin() there goes slightly negative: the head
         swells a hair as it lands, which is a real effect rather than a bug,
         and switching to time is how you turn it off. */
      const st = CONFIG.scaleOn === 'ease' ? e : t;
      f.config.height = baseHeight * (1 - CONFIG.scale * Math.sin(Math.PI * st));
    }

    if (t < 1){ raf = requestAnimationFrame(frame); return; }

    /* Land it. `want` is the full turns * 360 at t = 1, so nothing is owed. */
    settle(f);
    pump();
  }

  /* ONE CLICK, ONE TURN — even the ones that arrive mid-turn. The first pass
     simply ignored those, which read as the click doing nothing; they now wait
     their turn and play in full.

     A QUEUE RATHER THAN A RESTART, and that is the decision worth recording.
     Restarting the easing on each click would feel more immediate, but the
     size dip is a sin() over the run's own clock: restarting it from a head
     that is already 6% small snaps it back to full size, and the pop is worse
     than the wait. Each run therefore plays whole, and CONFIG.queue caps how
     many can stack so that leaning on the mouse cannot buy thirty seconds of
     spinning. */
  function pump(){
    if (running || queued <= 0) return;
    queued--;
    play();
  }

  function play(){
    if (running || !CONFIG.enabled) return false;
    const f = head();
    if (!f) return false;

    running = true;
    applied = 0;
    baseHeight = f.config.height;
    startAt = performance.now();
    raf = requestAnimationFrame(frame);
    return true;
  }

  /* WHICH CLICKS COUNT. Block 02 has no hit area of its own — the head is a
     texture inside js/mask-scroll.js's full-screen composite, so there is
     nothing to attach to that means "the head". The gate is therefore the
     block's own scroll progress, which is 0 while block 01 has the screen and
     1 once block 02 does; MASKSCROLL already publishes it for js/mask.js to
     decide whose the pointer is, and the same answer is the right one here.

     The chrome is excluded by hand rather than by z-order: the bar and the
     footer sit above the composite and their links must keep working, and the
     contact button in particular counts its own clicks — spinning the head on
     the way past would be a second thing happening to a deliberate press. */
  const CHROME = 'a, button, input, textarea, select, label, [data-copy-email], .bar, .ftr';

  /* ON THE WINDOW, NOT ON .b2. The first pass listened on the block's own
     element and nothing ever fired: .b2 is `pointer-events: none` in
     css/block2.css — it is a caption layer over a full-screen canvas, so it
     has to let the pointer through — and an element that cannot be hit cannot
     be clicked either. The gates below are what make a window listener safe:
     the block has to actually have the screen, and the click has to not belong
     to something else. */
  on(window, 'click', e => {
    if (!CONFIG.enabled) return;
    if (e.target && e.target.closest && e.target.closest(CHROME)) return;
    const ms = window.MASKSCROLL;
    if (ms && typeof ms.progress === 'function' && ms.progress() < 0.5) return;

    const cap = Math.max(0, CONFIG.queue | 0);
    if (running){ if (queued < cap) queued++; return; }
    play();
  });

  window.HEADSPIN = {
    config: CONFIG,
    /* Run it without clicking — tuning a 1.1s motion by hunting for a spot on
       the page that is not a link gets old after the third adjustment. */
    play,
    get running(){ return running; },

    groups(){
      const H = window.HEADSPIN;
      if (!H) return [];
      const num = (key, min, max, step, hint) => ({
        label: 'spin.' + key, min, max, step, hint,
        get: () => H.config[key], set: v => { H.config[key] = v; },
      });
      return [{
        name: 'BLOCK 02 · the head spin', open: false, rows: [
          { label: 'spin.enabled', options: ['on', 'off'],
            get: () => H.config.enabled ? 'on' : 'off',
            set: v => { H.config.enabled = (v === 'on'); },
            hint: 'off leaves the click doing nothing' },
          num('turns', 1, 4, 1,
              'whole turns per click · a fraction does not come back to the same face'),
          num('ms', 200, 4000, 50, 'how long one click takes, start to finish'),
          num('scale', 0, 0.5, 0.01,
              'how much smaller at the halfway point · 0.12 is a tenth, 0 keeps it the same size'),
          num('queue', 0, 8, 1,
              'clicks that may stack up mid-turn · 0 ignores them, 4 is four more turns'),
          { label: 'spin.ease',
            options: ['inout', 'out', 'in', 'expo', 'back', 'linear', 'custom'],
            get: () => H.config.ease, set: v => { H.config.ease = v; },
            hint: 'inout eases both ends · out starts fast · back overshoots and settles · custom uses the four handles below' },
          num('p1x', 0, 1, 0.01,
              'CUSTOM only · first handle, along time · lower leaves later'),
          num('p1y', -1, 2, 0.01,
              'CUSTOM only · first handle, along the turn · below 0 winds up backwards first'),
          num('p2x', 0, 1, 0.01,
              'CUSTOM only · second handle, along time'),
          num('p2y', -1, 2, 0.01,
              'CUSTOM only · second handle · above 1 swings past the landing and settles back'),
          { label: 'spin.scaleOn', options: ['time', 'ease'],
            get: () => H.config.scaleOn, set: v => { H.config.scaleOn = v; },
            hint: 'which clock the shrink runs on · time is even, ease ties it to the curve' },
          { label: 'spin.play', options: ['—', 'run'],
            get: () => '—',
            set: v => { if (v === 'run') H.play(); },
            hint: 'plays it once without having to find a clickable spot' },
        ],
      }];
    },
  };

  return function destroy(){
    cancelAnimationFrame(raf);
    /* The size, before anything else. A teardown mid-spin is the one moment
       the head can be left shrunk with nothing on the page able to put it
       back. */
    queued = 0;
    settle(head());
    on.release();
    if (window.HEADSPIN && window.HEADSPIN.config === CONFIG) delete window.HEADSPIN;
  };
});
