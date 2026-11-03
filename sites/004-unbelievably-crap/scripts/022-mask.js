/* ==========================================================================
   mask.js — the two-block page's own defaults, and the pointer on block 02.

   THE PAGE IS TWO BLOCKS, and they are two different kinds of thing:

     BLOCK 01   the About block, verbatim. Black ground, the copy running down
                both sides of the scanned figure, the x-ray on it. It gets
                NOTHING from this file — its defaults are js/about-figure.js's,
                which are About's, which is the whole point of "the same block".

     BLOCK 02   the head. Face plus mask, on the light pages' background,
                turning toward the pointer. Everything below writes to its
                config and only to its config.

   Both configs are new objects per mount (js/about-figure.js is a factory), so
   nothing here can reach the About page. That was proved once by diffing a
   render; the structure is what keeps it true.

   THE POINTER IS SHARED, so it is handed over rather than fought over:

     block 01 showing   drag scrolls the copy (js/about-text.js owns it)
     block 02 showing   drag MOVES the head · RIGHT-drag turns it, and so does
                        shift+drag · shift+wheel scales it, with no ceiling
     Home               back to the start angle, level, centred

   The plain wheel is js/mask-scroll.js's, always: it runs the copy to its end
   and then opens the second block, one gesture from top to bottom.
   ========================================================================== */
window.PAGE.register('mask', function (scope) {
  'use strict';

  const stage = scope.querySelector('#aboutRoot');
  if (!stage || !window.FIGURE_B) return;

  const F = window.FIGURE_B;

  /* ---- block 02's page-scoped defaults ------------------------------------
     Set here rather than in js/about-figure.js because that file's defaults
     are the About page's. A settings export saved off THIS page used to be
     baked into them, which quietly re-aimed About's camera every time this
     room was tuned. */

  /* CONTAIN, not height. It fits the whole bounding cylinder inside the
     frustum on both axes, so the head cannot be cut at any fov or tilt, and it
     makes `height` mean the share of the FRAME filled — which is what
     "fullscreen" wants: 1 is edge to edge. */
  F.config.fit = 'contain';
  F.config.tiltOffset = -30.731249999999992;

  /* NO DRIFT, AND AN AIM INSTEAD. The reference the brief points at does not
     rotate on a timer — it looks at you. A head doing both at once reads as a
     head that has not decided. */
  F.config.idleSpin = 0;
  F.config.follow = true;

  /* THE TWO-LAYER REVEAL, back on. The face is what you see and the mask is
     underneath it; the pointer wipes a hole in the face and the mask shows
     through. It only reads with the mask INSIDE the face, which is the
     opposite of a mask worn on one — so the scale goes under 1 here, and the
     pair below is what the original x-ray was tuned to. The cursor does two
     things at once now and they do not fight: the head turns toward the
     pointer, and where the pointer passes over it, it opens. */
  F.config.reveal = true;
  /* The skull's size and position are SOLVED, not typed — see innerFit in
     js/about-figure.js. Both meshes arrive normalised to unit height, which
     makes a skull exactly as tall as the head it belongs in; scale 1 would put
     it through the face. innerScale is a multiplier on the solved fit now, so
     1 means "as it was fitted". */
  F.config.innerFit = true;
  F.config.innerScale = 1.0;
  F.config.innerX = 0; F.config.innerY = 0; F.config.innerZ = 0;
  F.config.innerTint = '#DFF3FF';
  F.config.innerTone = 1.25;

  /* The silhouette read-back, off. js/about-figure.js renders the model into a
     48x160 buffer and calls readPixels on it nine times a second so that
     js/about-text.js can part the copy around the outline. Block 02 has no
     copy. readPixels is a synchronous stall — it makes the CPU wait for the
     GPU — so that was a pipeline flush, nine times a second, for a number with
     no reader. Block 01 keeps its read; the copy there genuinely uses it. */
  /* ---- BLOCK 02, AS TUNED ---------------------------------------------------
     A settings export, baked. These are all page-scoped for the reason at the
     top of this file: js/about-figure.js's defaults are the About page's, and
     a value saved off THIS page has no business being written into them. */
  Object.assign(F.config, {
    height: 0.7300000000000038,
    offsetX: -0.004482171474358961,
    offsetY: -0.06754907852564092,
    fov: 8,
    fit: 'height',
    tiltOffset: -45.65996093749999,

    /* FRONT-ON AT REST, and two separate things had to be fixed for that to
       mean anything.

       startAngle came out of the export as 180 — a number chosen by moving a
       slider that was not connected to anything. This file's defaults are
       written after js/about-figure.js has already seeded its spin from the
       default startAngle of 0, so the value here was read too late to be read
       at all. The panel showed 180, the model sat at 0, and the two never
       disagreed out loud. That seed is deferred to the first frame now, so this
       line finally decides where the head starts — which means it has to be the
       angle that IS front-on, and that is 0. 180 is the back of the head. */
    startAngle: 0,

    /* AND THE COPY NO LONGER TURNS IT. js/about-text.js announces every frame
       of its scroll on the shared page container, and BOTH figures listen — so
       running the copy down to open this block was also spinning the head, a
       fifth of a degree per pixel, for the whole 1200px of travel. That is why
       it arrived in profile: not a wrong start angle but a right one, plus a
       quarter turn nobody asked for, and the amount depended on how far you had
       scrolled. Block 01 keeps its scroll-turn — the figure turning as the copy
       runs is the whole gesture there. Block 02 has no copy of its own. */
    scrollTurn: 0,

    // the reveal
    reveal: true,
    revealRadius: 0.2,
    revealFade: 2.8,
    revealMax: 0.17,
    revealSoft: 0.47,
    revealWarp: 0.56,
    revealWarpScale: 20,
    revealWarpSpeed: 2.05,
    revealStep: 1.05,
    revealEvery: 18,

    // the reveal, as glass
    headOpacity: 1,
    fresnel: 3,
    fresnelPower: 3.6,
    revealGlow: 3,
    revealEdge: 0.35,
    revealTint: '#DFF3FF',
    skullGlow: 0,

    /* TOTALLY WHITE. Every lighting term above reads the model's NORMALS, and
       this scan's normals carry the scan: the brows, the glasses, the crease
       under the lip and a scatter of reconstruction noise across the scalp.
       Lit at all, those come back as grey scratches on what is meant to be a
       clean shape — and at this size there is not enough of them to read as a
       face, so they read as damage.

       1 is flat white, and what is left is the SILHOUETTE, which is the whole
       picture on this block. It touches the outer layer only, so the skull
       underneath still arrives dark through the reveal. */
    flatten: 1,

    // the skull
    innerOn: true,
    innerFit: true,
    innerFitPad: 0,
    innerScale: 0.825,
    innerX: 0, innerY: 0.194, innerZ: 0.132,
    innerTint: '#1A1A1A',
    innerTone: 0.2,

    // the aim
    follow: true,
    followRangeX: 60,
    followRangeY: -13,
    followSpeed: 1,
    followCentre: true,
    idleSpin: 0,
    followEase: 0.5,

    /* The head's colour. The baked-photograph path is gone from
       js/about-figure.js: it was off in every export, and the UV attribute it
       needed is what put block 01's silhouette out — measured, not guessed.
       The head is lit grey like everything else here. */
    tint: '#ffffff',
    tone: 0.05,
    ambient: 0.76,
    diffuse: 0,
    rim: 1.5,
    lightX: 1, lightY: 0.65, lightZ: 0.15,
    grain: 0.12,

    /* 0. THE NOTE BELOW USED TO SAY 110 AND END WITH "0 is free speed if it
       was not a deliberate choice." It was not a deliberate choice, and the
       free speed was sitting there for months while four other theories were
       chased. Taking it: nothing on this page reads block 02's silhouette —
       there is no copy here to part around it — so every read was a readPixels
       stalling the CPU on the GPU, about five times a second, to produce a
       number with no reader.

       WORTH 71 -> 81 fps ON ITS OWN, p95 41.6ms -> 33.3ms, measured on the
       live domain. Nothing about the picture changes, because nothing was
       looking at the answer.

       IT IS ALSO WHY THE FRAME TIMES LOOKED THE WAY THEY DID and why every
       fill-rate theory kept half-working: a synchronous stall a few times a
       second leaves the MEDIAN frame untouched — which is why `load` read 6-8%
       and said the page was idle — and puts the whole cost in p95 and worst.
       A cost that hides from the median is a cost you will misattribute.

       Block 01's figure still reads its silhouette, at 110, because over there
       the copy genuinely parts around the outline. That one is paid for. */
    silMs: 0,
  });

  const CONFIG = {
    drag: false,
    /* WHICH ONE THE BARE DRAG DOES. It was `turn`, at the brief's own request
       earlier — "not move the objects, but rotate them" — with the move on
       shift. The brief has since changed to wanting the position set by hand
       and left there, so `move` is the default and `turn` is what shift does.
       One dial rather than a decision baked in, because both readings were
       right when they were asked for. */
    dragMode: 'turn',   // move · turn
    orbitSpeed: 0.05,   // degrees of turn per px dragged
    panSpeed: 1.6,     // 1 = shift-drag tracks the pointer exactly
    /* SHIFT-WHEEL SCALING, OFF. It was a tuning gesture that shipped: holding
       shift and scrolling resized the head, with no ceiling, and it is far too
       easy to hit by accident — one shift held a beat too long while reading
       and the block is a different size for the rest of the visit, with nothing
       on screen saying why or how to undo it. The code stays; this switch is
       how it comes back for tuning. Home still resets the view. */
    wheel: false,
    wheelSpeed: 0.0016, // change in `height` per px of wheel
    invertY: false,
    /* Below this much of the transition the pointer still belongs to the copy.
       Two things claiming one gesture is how a page stops feeling deliberate,
       and "whichever block you are looking at" is a rule a reader can feel
       without being told it. */
    takeOver: 0.95,
    /* Whether the page's red saturation layer reaches block 02. Off, because
       the head carries its own photograph now and a saturation blend over a
       photograph drives every pixel to full chroma rather than tinting it.
       On, and block 02 wears the same treatment block 01 does — which is what
       you want the moment the colour map is turned off. */
    /* OFF, so the ground reads the way it does on the work page.

       .about__fx is a red fill on `saturation`, and saturation over a pattern
       that carries any colour noise at all drives every one of those pixels to
       FULL chroma. Over a flat grey model that is the whole point of the layer;
       over the ASCII ground it turns a field of grey dots into rainbow speckle,
       which is exactly the difference between block 02 and the work page — the
       work page has no such layer over its characters.

       It is the same failure the head's baked photograph hit, for the same
       reason, and the CSS beside .about__fx already says so. The dial is still
       in the panel: turn it back on and the head wears the page's red
       treatment again, and the ground goes back to confetti with it. */
    fxOver: false,
  };

  const on = window.PAGE.bindings();
  let dragging = false, pid = null, lastX = 0, lastY = 0, cursorRaf = 0;

  const showing = () => !window.MASKSCROLL ||
    window.MASKSCROLL.progress() >= CONFIG.takeOver;

  /* The cursor says whose the pointer is, so it is kept in step with the same
     threshold rather than being set once and left. */
  let grabbable = null;
  (function watch(){
    if (!window.PAGE || !document.body.contains(stage)) return;
    const v = showing();
    if (v !== grabbable){ grabbable = v; stage.classList.toggle('is-grabbable', v); }
    stage.classList.toggle('is-fx-over', !!CONFIG.fxOver);
    cursorRaf = requestAnimationFrame(watch);
  })();

  /* Otherwise the right button opens the browser's menu the moment it is used
     to turn the head, and the drag ends on the first frame. */
  on(stage, 'contextmenu', e => { if (CONFIG.drag && showing()) e.preventDefault(); });

  on(stage, 'pointerdown', e => {
    if (!CONFIG.drag || !showing()) return;
    dragging = true; pid = e.pointerId;
    lastX = e.clientX; lastY = e.clientY;
    stage.classList.add('is-dragging');
    stage.setPointerCapture(e.pointerId);
  });

  on(stage, 'pointermove', e => {
    if (!dragging || e.pointerId !== pid) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    const inv = CONFIG.invertY ? -1 : 1;

    /* Two ways to reach the other one. Shift is the modifier, and the RIGHT
       button is the one that needs no modifier at all — a hand already on the
       mouse can turn the head without finding a key, which is what "I want to
       rotate it" asks for when the left button is busy moving it. */
    const other = e.shiftKey || (e.buttons & 2) === 2;
    const moving = (CONFIG.dragMode === 'move') !== other;

    if (moving){
      /* MOVE. The offsets are in viewport HEIGHTS, so both axes divide by the
         viewport height — not each by its own dimension. Dividing x by the
         width instead is the classic version of this bug: the head tracks the
         pointer on a square window and lags it on a wide one.

         It writes offsetX and offsetY, which are ordinary config values — so
         where you leave it is where it stays, the panel shows the numbers, and
         Copy settings carries them out. Drag and leave, and it is saved. */
      const s = CONFIG.panSpeed / Math.max(stage.clientHeight, 1);
      F.config.offsetX += dx * s;
      F.config.offsetY -= dy * s * inv;
    } else {
      /* TURN. Dragging right turns the model to follow the hand, and dragging
         down lowers the camera, so the model appears to tip towards you —
         which is what grabbing an object and pulling it over does. */
      F.orbit(dx * CONFIG.orbitSpeed, -dy * CONFIG.orbitSpeed * inv);
    }
    lastX = e.clientX; lastY = e.clientY;
  });

  const end = e => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('is-dragging');
    if (e && stage.hasPointerCapture?.(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    pid = null;
  };
  on(stage, 'pointerup', end);
  on(stage, 'pointercancel', end);

  on(stage, 'wheel', e => {
    // SHIFT-wheel only; the plain wheel runs the copy and then the transition
    if (!CONFIG.wheel || !e.shiftKey || !showing()) return;
    e.preventDefault();
    // up = bigger. Clamped at 1 because in contain mode that is edge to edge,
    // and past it the model would be cut again, which is what this page is for
    // NOT doing.
    /* NO CEILING. In contain mode 1 is edge to edge, and past it the head
       overflows the frame — which is a choice, not a mistake. The only floor
       left is the one that stops a zero or a negative height from inverting
       the camera solve, which is arithmetic rather than taste. */
    const h = F.config.height - e.deltaY * CONFIG.wheelSpeed;
    F.config.height = Math.max(0.02, h);
  }, { passive: false });

  on(window, 'keydown', e => {
    if (e.key === 'Home' && showing()) F.resetView();
  });

  window.MASKPAGE = {
    config: CONFIG,
    apply(){},
    centre(){ F.resetView(); },
    readout(){
      return { pointer: showing() ? 'block 02' : 'the copy',
               offset: `${F.config.offsetX.toFixed(3)}, ${F.config.offsetY.toFixed(3)}`,
               tiltOff: F.config.tiltOffset.toFixed(1) + '°',
               fill: F.config.height.toFixed(2) };
    },
  };

  return function destroy(){
    on.release();
    cancelAnimationFrame(cursorRaf);
    stage.classList.remove('is-dragging', 'is-grabbable', 'is-fx-over');
    if (window.MASKPAGE && window.MASKPAGE.config === CONFIG) delete window.MASKPAGE;
  };
});
