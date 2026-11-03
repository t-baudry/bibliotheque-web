/* ==========================================================================
   err-console.js — the 404's dials.

   Three groups, and they map to the three things on the page: the room, the
   camera, and the lens. Nothing here touches the ticket's LAYOUT — those are
   Figma's numbers, they are in js/err-card.js, and a dial that lets them drift
   is the opposite of what "the same layout" asked for.

   LABELS ARE FRESH AGAIN. js/tuner.js persists a row by its LABEL and restores
   it over the code on load; this page has been four different pages now, and
   none of the earlier saves have any business framing this one.
   ========================================================================== */
window.PAGE.register('err-console', function (scope) {
  'use strict';
  if (!window.Tuner || !window.Tuner.enabled) return;
  if (scope.dataset.page !== 'err') return;

  /* WAIT FOR THE PAGE ITSELF. js/err.js fetches its two art files on arrival
     and only publishes window.ERR once they land, so this module runs BEFORE
     there is anything to tune — the panel came up with zero rows, silently,
     which is exactly the kind of miss that looks like "the dials are gone".
     Same wait as that file's. */
  if (!window.ERR){
    let alive = true, tid = 0, teardown = null;
    (function poll(){
      if (!alive) return;
      if (window.ERR){ teardown = build(scope); return; }
      tid = setTimeout(poll, 60);
    })();
    return function (){ alive = false; clearTimeout(tid); if (teardown) teardown(); };
  }
  return build(scope);
});

function build(scope){
  'use strict';
  const E = window.ERR, C = E.config;
  const num = (label, k, min, max, step, hint) => ({
    label: 'err.' + label, min, max, step,
    get: () => C[k], set: v => { C[k] = v; }, hint,
  });
  /* The two that change the TEXTURE rather than a uniform have to repaint the
     card; everything else is read straight off the config each frame. */
  const paint = (label, k, min, max, step, hint) => ({
    label: 'err.' + label, min, max, step,
    get: () => C[k], set: v => { C[k] = v; E.apply(); }, hint,
  });
  const flag = (label, k, hint) => ({
    label: 'err.' + label, options: ['on', 'off'],
    get: () => (C[k] ? 'on' : 'off'), set: v => { C[k] = (v === 'on'); }, hint,
  });

  window.Tuner.create({
    title: '404 · THE FIELD',
    storeKey: 'shots2026.err',
    config: C,
    apply: () => E.apply(),
    restored: () => E.apply(),
    reset: () => E.apply(),
    readout: () => E.readout(),

    groups: [
      { name: 'THE ROOM', open: true, rows: [
        { label: 'err.paper', colour: true,
          get: () => C.paper, set: v => { C.paper = v; E.apply(); },
          hint: 'the ticket AND the ground, because they are the same red · the site runs #e8271c and Figma’s is a shade purer, so this is the one place the two disagree on purpose' },
        num('ground', 'blobs', 0, 1, 0.01,
            'how strongly js/work-cursor.js’s character field shows through the red · it sits UNDER the tickets, so at 1 you mostly see it in the 10px gutters'),
        { label: 'err.groundOver', options: ['over', 'under'],
          get: () => (C.groundOver ? 'over' : 'under'),
          set: v => { C.groundOver = (v === 'over'); },
          hint: 'where the blob sits · OVER is the default and the right one: under the tickets it can only show in the 10px gutters, which reads as thin lines ruled across the page rather than as the blob' },
        num('ticket', 'cardOpacity', 0, 1, 0.01,
            'the tickets’ own opacity · below 1 the character field comes up THROUGH them instead of only between them'),
      ]},

      { name: 'THE STRIP', open: true, rows: [
        { label: 'err.stripY', min: 0, max: 100, step: 0.1,
          get: () => parseFloat(getComputedStyle(document.documentElement)
                     .getPropertyValue('--err-strip-y')) || 50,
          set: v => document.documentElement.style.setProperty('--err-strip-y', v + '%'),
          hint: 'where the MIDDLE of the strip sits, as a share of the window height · 50 is dead centre · it does not travel with the camera, it belongs to the window' },
        { label: 'err.stripNeg', options: ['negative', 'off'],
          get: () => (document.querySelector('.err__strip') || {}).dataset
                     && document.querySelector('.err__strip').dataset.neg === 'off' ? 'off' : 'negative',
          set: v => { const e = document.querySelector('.err__strip');
                      if (e) e.dataset.neg = (v === 'off' ? 'off' : 'on'); },
          hint: 'NEGATIVE inverts whatever the strip is lying on — the field, the tickets, the blob and the lens’s grain all come through reversed, so the red reads cyan and the black ink reads white · OFF leaves it a plain transparent strip with its type' },
      ]},

      { name: 'THE CAMERA', open: true, rows: [
        flag('camOn', 'camOn', 'the field leans away from the pointer · off parks it dead centre'),
        num('camX', 'camX', 0, 300, 1,
            'how far the field travels at the left and right edges of the window, in px · 40 is the brief’s "a bit", and it is enough to bring a whole extra column into view'),
        num('camY', 'camY', 0, 300, 1, '…and at the top and bottom'),
        num('camLag', 'camEase', 0.02, 2, 0.02,
            'seconds to catch up · near 0 it is welded to your hand, which reads as the page tracking you rather than as a camera'),
        num('driftX', 'driftX', -60, 60, 1,
            'px per second the field slides on its own, forever · 0 is still · the field is infinite, so this can run all day and never reach an edge'),
        num('driftY', 'driftY', -60, 60, 1, '…and vertically'),
      ]},

      { name: 'THE LENS · from the codepen', open: false, rows: [
        flag('lens', 'crt', 'the whole post effect · off shows the field raw, which is the picture to compare against Figma'),
        num('spread', 'crtSpread', 0.3, 2.2, 0.02,
            'HOW MUCH OF THE PEN’S GEOMETRY YOU GET · 1 is its look at page scale · the pen was written for images a few hundred px across and its maths reaches much further on a full window, so above ~1.4 the vignette closes into a porthole with the design inside it'),
        num('gain', 'crtGain', 0.3, 2, 0.02,
            'brightness in the middle of the screen · the pen effectively runs 1.8 here, which clips a saturated red to orange · 1 keeps the design’s own colour'),
        num('zoom', 'crtZoom', 0.4, 1.6, 0.01,
            'the pen runs 0.5, which magnifies everything twofold before distorting it · 1 keeps the ticket at its Figma size'),
        num('barrel', 'crtBarrel', 0, 1.2, 0.01, 'the bulge · the pen’s 0.3'),
        num('spray', 'crtSpray', 0, 1.2, 0.01,
            'radial noise, strongest at the edges · the pen’s 0.3 · on photographs it reads as bloom, on hairline type it reads as fur, so this is the first one to pull down if it is too much'),
        num('aber', 'crtAber', 0, 0.3, 0.002, 'chromatic aberration, the wobbling part · the pen’s 0.05'),
        num('aberFix', 'crtAberFix', 0, 0.02, 0.0005, '…and the flat red/blue split · the pen’s 0.0015'),
        num('scan', 'crtScan', 0, 0.3, 0.005, 'scanlines · the pen’s 0.05'),
        num('grid', 'crtGrid', 0, 0.4, 0.005, 'the 20x20 grid over everything · the pen’s 0.1'),
        num('vig', 'crtVig', 0.6, 4, 0.02, 'the vignette curve · the pen’s 1.8 · lower closes the corners in'),
        num('dither', 'crtDither', 0, 0.4, 0.005,
            'grain · the pen’s 0.1 · it is an ADD, so it lifts the blacks as well as breaking up the red'),
        num('speed', 'crtSpeed', 0, 4, 0.05, 'how fast the whole lens animates'),
      ]},

      { name: 'THE GLITCH · the pen’s second shader, per ticket', open: false, rows: [
        flag('glitchOn', 'glitch',
             'in the pen this runs on each image and paragraph · here the repeating unit is a ticket, so each one tears on its own clock'),
        num('glitchAmt', 'glitchAmt', 0, 3, 0.05,
            'how far a torn ticket slips · 1 is the pen’s 0.1/0.2/0.3 split across the three channels'),
        num('glitchRate', 'glitchRate', 4, 120, 1,
            'how often a ticket is picked · the pen’s 43 · higher is more frequent and shorter'),
      ]},
    ],
  });

  return function destroy(){};
}
