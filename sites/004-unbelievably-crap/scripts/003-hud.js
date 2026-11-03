/* ==========================================================================
   hud.js — the two live things on the index page's instrument panel.

   Everything else in the panel is static markup in the page; only these move:

     THE RED SQUARE      mirrors the pointer. The map is a 283x142 picture of a
                         1920x1080 room, so the square's job is to be at the
                         same PROPORTION across the map as the pointer is across
                         the block — which makes it a pure remap and nothing
                         else. It is not a minimap of anything the page renders.

     THE PROGRESS BAR    reads the copy's scroll. js/about-text.js already
                         publishes travel and max, and those are the same two
                         numbers the figure's turn and the handover to block 02
                         are driven by — so the bar cannot disagree with what
                         you see, which it would the moment it counted anything
                         of its own.

   And the panel as a whole fades with the transition, because it belongs to the
   black room: white type on the second block's white ground is not a HUD, it is
   an invisible one.
   ========================================================================== */
window.PAGE.register('hud', function (scope) {
  'use strict';

  /* This page only. The panel is block 01's, and .about exists on more than one
     page — the same lesson the dissolve and the cursor both learned. */
  if (scope.dataset.page !== 'mask') return;
  const root = scope.querySelector('.hud');
  if (!root) return;

  const dot   = root.querySelector('.hud__dot');
  const box   = root.querySelector('.hud__mapbox');
  const readX = root.querySelector('.hud__xy--x span');
  const readY = root.querySelector('.hud__xy--y span');
  const fill  = root.querySelector('.hud__fill');
  const track = root.querySelector('.hud__track');

  const CONFIG = {
    /* How far into the transition the panel is gone. It leads the handover
       slightly — takeOver in js/mask.js is 0.95 — so the panel has finished
       leaving before the pointer changes hands, rather than fading through it. */
    fadeBy: 0.55,
    /* HOW FAR INTO THE COPY BEFORE THE PANEL STANDS DOWN. The map, the
       coordinates and the panel share the screen with the story, which is
       fine on 1920 — the HUD is a 283px column down the left edge and the copy
       runs past it. On a phone both are full width and the two print on top of
       each other, which is what Figma's phone frames show they should not:
       by the third frame the copy has the screen and only the progress bar is
       left.

       So this is a SECOND fade, on the copy's own travel rather than on the
       block handover, and only css/mobile.css acts on it — nothing on the
       desktop layout selects .is-deep. */
    deepAt: 0.04,
    /* No dotSize here on purpose. The square's size is css/hud.css's — it is a
       6px or a 3px block in the stylesheet — and this file only needs it to keep
       the square inside the box rather than letting its top-left corner reach
       the edge and its body hang out. So it is MEASURED off the element below.
       A copy of the number here would be right until the day the CSS changed
       alone, and the symptom is quiet: a square a few pixels short of one edge
       and over the other. */
    /* Read-outs on or off. They are the pointer's real viewport pixels, which
       is what the mock shows — X 162 / Y 761 is a position on screen. */
    readouts: true,
  };

  const on = window.PAGE.bindings();
  let px = 0.5, py = 0.5, raf = 0;

  on(window, 'pointermove', e => {
    px = e.clientX / Math.max(1, window.innerWidth);
    py = e.clientY / Math.max(1, window.innerHeight);
    if (CONFIG.readouts){
      readX.textContent = String(Math.round(e.clientX));
      readY.textContent = String(Math.round(e.clientY));
    }
  });

  /* One rAF for both, rather than a listener each. The pointer can fire a
     hundred times a second and the scroll every frame; writing a transform and
     a width once per frame is the cheapest correct answer, and it keeps the
     square in step with the scroll fade instead of a frame behind it. */
  let lastW = -1, lastOn = null, lastDeep = null;
  (function frame(){
    if (!window.PAGE || !document.body.contains(root)) return;

    /* THE SQUARE. Clamped by its own size so it stays wholly inside the box —
       at 283x142 with a 3px square the travel is 280x139.

       offsetWidth is read once per frame rather than cached, and that is a
       deliberate exception to this file's own rule about layout reads: it is ONE
       element with a fixed size, the browser answers from the box it already
       computed, and caching it would mean re-introducing exactly the duplicate
       this change removed. */
    const size = dot.offsetWidth || 3;
    const w = box.clientWidth  - size;
    const h = box.clientHeight - size;
    dot.style.transform =
      `translate(${(Math.max(0, Math.min(1, px)) * w).toFixed(1)}px,` +
      `${(Math.max(0, Math.min(1, py)) * h).toFixed(1)}px)`;

    /* THE BAR. travel/max, straight from the copy. */
    const T = window.ABOUTTEXT;
    if (T){
      /* AGAINST THE HANDOVER, NOT THE FULL LENGTH OF THE COPY. The copy stops
         being the only thing on the page at handoffAt — 0.84 — and that is the
         moment the white block starts. Divided by maxTravel, this bar filled to
         84% and then froze there, because from that point the wheel belongs to
         the transition and `travel` never moves again. The bar is a picture of
         "how far through this block are you", so its 100 has to be the end of
         the block, and the end of the block is the handover.

         READ AS NUMBERS, not out of readout(). That function formats with
         toFixed(0), and js/about-text.js says in its own comment why the raw
         getters exist — parsing the strings back quantised a smooth fill to
         whole pixels of travel. This file was doing exactly what that note
         warns against, one line below where it says so. */
      const end = Math.max(1, T.handoffTravel || T.maxTravel || 1);
      const p = Math.max(0, Math.min(1, T.travel / end));
      /* MEASURED, NOT 283. The fill was a fraction of a hard-coded 283 while
         the track it sits in is `left:10; right:10` on a phone — 382 at that
         width — so a story scrolled to the end filled three quarters of its
         own bar and stopped. The same two-places-one-quantity fault the note
         above warns about for the dot's size, in the line underneath it. */
      const tw = track ? track.clientWidth : 283;
      const px2 = Math.round(p * tw);
      if (px2 !== lastW){ lastW = px2; fill.style.width = px2 + 'px'; }

      /* ...and the copy-driven fade. See deepAt. */
      const deep = p > CONFIG.deepAt;
      if (deep !== lastDeep){ lastDeep = deep; root.classList.toggle('is-deep', deep); }
    }

    /* THE FADE. MASKSCROLL.progress() is 0 while the black block has the
       screen and 1 once the white one does. */
    const ms = window.MASKSCROLL;
    const show = !ms || ms.progress() < CONFIG.fadeBy;
    if (show !== lastOn){ lastOn = show; root.classList.toggle('is-on', show); }

    raf = requestAnimationFrame(frame);
  })();

  window.HUD = {
    config: CONFIG,
    apply(){},
    readout(){
      const T = window.ABOUTTEXT;
      return { hudCursor: `${(px * 100).toFixed(0)}%, ${(py * 100).toFixed(0)}%`,
               hudBar: T ? `${lastW}/${track ? track.clientWidth : 283}px` : 'no copy',
               hudOn: lastOn ? 'yes' : 'no' };
    },
  };

  return function destroy(){
    on.release();
    cancelAnimationFrame(raf);
    if (window.HUD && window.HUD.config === CONFIG) delete window.HUD;
  };
});
