/* ==========================================================================
   tscroll.js — one job: keep the turned copy of the strip's figure in step
   with the live one.

   WHY THIS EXISTS AT ALL. The strip is a cluster and a 180-degree copy of it,
   so the figure appears twice. Registering a second renderer would mean a
   second WebGL context for a 64x128 picture of a mesh that is already being
   drawn a few hundred pixels away — a whole context spent on nothing, on the
   page whose frame rate cost the most to win back.

   So the upright cluster owns the live canvas and this copies its pixels into
   the other one. A drawImage of a 64x128 canvas is the cheapest operation in
   this file's neighbourhood, and the two are guaranteed identical because one
   IS the other.

   AND IT TURNS WITH THE SCROLL, which is the second job and the reason this
   file grew.

   js/about-figure.js has had a scroll spin all along — `scrollTurn`, degrees
   per pixel — but it is fed by an `about:scroll` event that js/about-text.js
   dispatches, and about-text stops moving the moment block 01 hands over. So
   every figure on the page turned while the COPY scrolled and then stood still
   for the rest of the page. On the four figures that live in block 01 that is
   correct. On this one it is exactly backwards: the strip is not on screen
   until after the hand-off, so the figure was frozen for the whole of its own
   appearance and moving only while it could not be seen.

   The driver here is therefore block 02's own travel, and it is applied as a
   DELTA through orbit() rather than by writing an angle — the same rule
   js/head-spin.js is built on, and for the same two reasons. The idle drift
   underneath is neither fought nor thrown away, and scrolling back up unwinds
   the turn exactly, because the total delta over a round trip is zero however
   the frames land.

   NOT `about:scroll`. That event is dispatched at the container and every
   figure on the page listens to it, so feeding block 02's travel in through it
   would spin block 01's figure and the HUD's map as well — three figures
   answering to a scroll that only one of them can see.
   ========================================================================== */
window.PAGE.register('tscroll', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'mask') return;

  const src = scope.querySelector('#tsFigure');
  const dst = scope.querySelector('[data-ts-figcopy]');
  if (!src || !dst) return;

  const cx = dst.getContext('2d');
  if (!cx) return;

  const CONFIG = {
    spinOn: true,
    /* DEGREES PER PIXEL of block-02 travel. The strip is 1644px tall and
       passes the screen over roughly two of those, so 0.06 is about a third of
       a turn across the whole appearance and 0.18 is a full one. Negative
       turns it the other way. */
    spinRate: 0.06,
    /* Degrees a second while nothing is scrolling. This is the renderer's own
       `idleSpin` — set here so both dials for this figure are in one group
       rather than one here and one in a panel section about block 01. */
    idle: 4,
  };

  let raf = 0;
  /* null, NOT 0. The first frame has no previous travel to difference against,
     and starting from 0 would hand the figure the whole of whatever scroll
     position the page was already at as a single delta — a page restored
     mid-block would open with the figure mid-flick. */
  let lastTravel = null;

  function spin(){
    const F = window.TSFIG, B = window.BLOCK2;
    if (!F || typeof F.orbit !== 'function') return;

    if (typeof F.config.idleSpin === 'number') F.config.idleSpin = CONFIG.idle;

    if (!CONFIG.spinOn || !B || typeof B.travel !== 'number'){
      lastTravel = null;   // so re-enabling it does not replay the gap
      return;
    }
    const t = B.travel;
    if (lastTravel === null){ lastTravel = t; return; }
    const d = t - lastTravel;
    lastTravel = t;
    if (d) F.orbit(d * CONFIG.spinRate, 0);
  }

  function frame(){
    if (!document.body.contains(dst)) return;
    raf = requestAnimationFrame(frame);
    spin();
    /* A canvas with no backing store yet throws on drawImage in some
       browsers and draws nothing in the rest; either way there is nothing to
       copy until the mesh has landed and the first frame exists. */
    if (!src.width || !src.height) return;
    try {
      cx.clearRect(0, 0, dst.width, dst.height);
      cx.drawImage(src, 0, 0, dst.width, dst.height);
    } catch (e){ /* mid-resize; the next frame is a fresh attempt */ }
  }

  raf = requestAnimationFrame(frame);

  window.TSCROLL = {
    config: CONFIG,
    apply(){},
    groups(){
      const C = CONFIG;
      return [{
        name: 'BLOCK 02 · the strip’s figure — it turns with the scroll', open: true, rows: [
          { label: 'fig.spin', options: ['on', 'off'],
            get: () => (C.spinOn ? 'on' : 'off'),
            set: v => { C.spinOn = v === 'on'; },
            hint: 'the figure turns as you scroll · off leaves it to its idle drift alone' },
          { label: 'fig.rate', min: -0.4, max: 0.4, step: 0.005,
            get: () => C.spinRate,
            set: v => { C.spinRate = v; },
            hint: 'degrees of turn per pixel scrolled · the strip passes over roughly two screens, so 0.06 is about a third of a turn across the whole appearance and 0.18 is a full one · NEGATIVE turns it the other way, which is the only way to reverse it — there is no separate direction dial because a rate already has a sign' },
          { label: 'fig.idle', min: 0, max: 60, step: 1,
            get: () => C.idle,
            set: v => { C.idle = v; },
            hint: 'degrees a second while nothing is scrolling · 0 holds it perfectly still, which is the honest setting if the turn is meant to belong to the scroll and nothing else' },
        ],
      }];
    },
  };

  return function destroy(){
    cancelAnimationFrame(raf);
    if (window.TSCROLL && window.TSCROLL.config === CONFIG) delete window.TSCROLL;
  };
});
