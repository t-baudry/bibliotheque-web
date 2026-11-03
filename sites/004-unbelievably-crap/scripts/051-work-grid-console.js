/* ==========================================================================
   work-grid-console.js — the work field's dials.

   Its own file rather than a group inside js/wheel-console.js: that panel is
   the wheel's and guards on #wheelViewport, which this page no longer has. A
   console that mounts on a page whose subject it does not describe is how a
   dial ends up writing to nothing.

   THE GROUPS ARE NAMED AFTER THE BRIEF's six controls — FOV, chromatic
   aberration, cursor magnetism, card size, zoom, distortion — plus the two the
   focus state needs. Anything that only exists because the baseline had it is
   grouped separately under MOVEMENT, so the numbers that came from the
   reference stay legible as a set and can be compared with it.
   ========================================================================== */
window.PAGE.register('work-grid-console', function (scope) {
  'use strict';
  if (!window.Tuner?.enabled) return;
  if (scope.dataset.page !== 'design' || !window.WORKGRID) return;

  const G = window.WORKGRID, C = G.config;

  const num = (key, min, max, step, hint) => ({
    label: 'wg.' + key, min, max, step,
    get: () => C[key], set: v => { C[key] = v; }, hint,
  });
  /* Anything that changes how many cells exist, or how big a cell IS, has to
     rebuild rather than re-place: the column count is solved from the cell
     against the viewport, so a size change with no rebuild leaves a field that
     no longer covers the screen. */
  const rebuild = (key, min, max, step, hint) => ({
    label: 'wg.' + key, min, max, step,
    get: () => C[key], set: v => { C[key] = v; G.rebuild(); }, hint,
  });
  const flag = (key, hint) => ({
    label: 'wg.' + key, options: ['on', 'off'],
    get: () => (C[key] ? 'on' : 'off'),
    set: v => { C[key] = v === 'on'; }, hint,
  });

  const panel = window.Tuner.create({
    title: 'WORK · the field',
    storeKey: 'shots2026.design',
    config: C,
    apply: () => {},
    restored: () => G.rebuild(),
    reset: () => G.rebuild(),
    readout: () => ({ ...G.readout(),
                      ...(window.CLOCK ? window.CLOCK.readout() : {}),
                      ...(window.CRT ? window.CRT.readout() : {}),
                      ...(window.WORKFIG ? window.WORKFIG.readout() : {}),
                      ...(window.WORKFX ? { blob: 'on' } : {}) }),

    groups: [
      /* ---- added since the panel was written --------------------------------
         The tuner does NOT discover rows(): every group is listed by hand in a
         console file, so a module can expose a perfectly good rows() and simply
         never appear. These four did exactly that. Spread conditionally, like
         the rest of the file, so a page that does not run one of them shows no
         empty section. */
      ...(window.WORKARRIVE ? [{ name: 'FIELD \u00b7 how the photographs arrive', open: true,
          rows: window.WORKARRIVE.rows() }] : []),
      ...(window.LIGHTBOX ? [{ name: 'FIELD \u00b7 opening one picture', open: true,
          rows: window.LIGHTBOX.rows() }] : []),
      ...(window.LINEREVEAL ? [{ name: 'COPY \u00b7 how fast the text resolves', open: false,
          rows: window.LINEREVEAL.rows() }] : []),
      ...(window.CTA ? [{ name: 'BAR \u00b7 the refusing button', open: false,
          rows: window.CTA.rows() }] : []),

      /* THE ARRANGEMENT FIRST, because it is the only dial here that changes
         what you are looking at rather than how it is being looked at. Six
         different pictures, not six settings of one — which is why it is a
         picker and why `layoutAmount` exists underneath it: every one of them
         fades back to the ruled grid rather than switching to it. */
      { name: 'FIELD \u00b7 the arrangement', open: true, rows: [
        { label: 'wg.layout', options: G.layouts,
          get: () => C.layout, set: v => { C.layout = v; G.rebuild(); },
          hint: 'grid: Figma\u2019s, even rows and columns \u00b7 brick: every other row shifted half a pitch, like brickwork \u00b7 masonry: the reference\u2019s own \u2014 columns staggered and every third travelling slower \u00b7 diagonal: the whole field running on a slant \u00b7 scatter: every card nudged inside its own slot \u00b7 mixed: a rhythm of large and small' },
        { label: 'wg.layoutAmount', min: 0, max: 1, step: 0.05,
          get: () => C.layoutAmount, set: v => { C.layoutAmount = v; G.rebuild(); },
          hint: 'how far the arrangement goes \u00b7 0 is the ruled grid whatever is picked above, so each of them is a continuum rather than a switch' },
        { label: 'wg.layoutSeed', min: 1, max: 200, step: 1,
          get: () => C.layoutSeed, set: v => { C.layoutSeed = v; G.rebuild(); },
          hint: 're-deals SCATTER and MIXED \u00b7 a hash of the cell\u2019s own coordinates, not a random roll, so the field is identical after a resize instead of reshuffling while you drag the window' },
        { label: 'wg.layoutDrop', min: 1, max: 6, step: 1,
          get: () => C.layoutDrop, set: v => { C.layoutDrop = v; G.rebuild(); },
          hint: 'DIAGONAL only \u00b7 how many whole cells the field falls across its width. Whole cells because the slant has to meet itself at the wrap \u2014 a fraction leaves a step running down the screen' },
        { label: 'wg.smallCard', min: 0.3, max: 1, step: 0.02,
          get: () => C.smallCard, set: v => { C.smallCard = v; G.rebuild(); },
          hint: 'MIXED only \u00b7 what a small card scales to. The PITCH never changes, only what fills it, which is what keeps the field wrappable' },
      ]},

      /* THE SIX FROM THE BRIEF, in the order they were asked for rather than
         the order the code happens to apply them. */
      { name: 'FIELD · the lens', open: true, rows: [
        num('fov', 0, 90, 1,
          'the lens \u00b7 each card\u2019s FOUR CORNERS are displaced independently and it becomes a quad, so the field bends and every tile is a straight-edged trapezoid \u2014 which is exactly what the reference does. 0 is the flat grid Figma draws'),
        num('aberration', 0, 8, 0.1,
          'the colour fringe at rest, in px \u00b7 the R and B channels genuinely separated and screened back, so black stays black and only edges fringe'),
        num('aberrationMove', 0, 12, 0.1,
          '\u2026and how much MORE of it while the field is moving \u00b7 this is the half you actually notice, and it costs nothing at rest'),
        num('fisheye', 0, 40, 0.5,
          'how far a card at the EDGE turns away from you \u00b7 separate from fov on purpose: fov moves cards toward the middle and shrinks them, so the field curves while every card stays flat. This turns the cards themselves, which is the half a displacement cannot give you'),
        num('fisheyePersp', 200, 3000, 25,
          'the lens length that turn is seen through \u00b7 short is violent, long is barely there. Meaningless while fisheye is 0'),
        num('zoom', 0.2, 4, 0.05,
          'how close you are standing \u00b7 pinch on a trackpad does this too. The camera moves BACK and nothing about the arrangement changes: the pitch, the stagger and the card all scale together, and pulling back reveals more cards rather than repeating the ones already there'),
        { label: 'wg.zoomGesture', options: ['on', 'off'],
          get: () => (C.zoomGesture ? 'on' : 'off'),
          set: v => { C.zoomGesture = v === 'on'; },
          hint: 'whether a TRACKPAD PINCH may zoom \u00b7 off, so the field is only ever the size the dial above says. The dial and the gesture move the same number; only the gesture is switched off' },
        { label: 'wg.zoomMin', min: 0.1, max: 2, step: 0.05,
          get: () => C.zoomMin, set: v => { C.zoomMin = v; },
          hint: 'how far back the pinch is allowed to go \u00b7 the floor on the gesture, not on the dial above \u2014 you can always type a value outside it here to see what it looks like' },
        { label: 'wg.zoomMax', min: 0.5, max: 6, step: 0.05,
          get: () => C.zoomMax, set: v => { C.zoomMax = v; },
          hint: '\u2026and how far in \u00b7 past about 3 a card is drawn larger than its own 1400px picture and softens' },
      ]},

      /* COLOUR AS DISTANCE FROM THE MIDDLE — roughly what your own eye does,
         cones in the middle and rods at the edges. */
      { name: 'FIELD \u00b7 colour toward the middle', open: true, rows: [
        num('colourMid', 0, 1, 0.01,
          'how monochrome a card is in the MIDDLE of the screen \u00b7 0 is the photograph\u2019s own colour'),
        num('colourEdge', 0, 1, 0.01,
          '\u2026and out at the edges \u00b7 1 is fully grey'),
        num('colourAt', 0, 1200, 10,
          'px from the centre within which a card keeps all its colour'),
        num('colourGone', 100, 3000, 20,
          '\u2026and beyond which it has lost all of it'),
        num('colourPow', 0.2, 4, 0.1,
          'the curve between the two \u00b7 above 1 holds the colour longer and then drops it quickly, which reads as a pool of colour rather than a gradient across the screen'),
      ]},

      /* THE CONTAINER'S OWN COLOUR, and the CRT. */
      /* HOW BIG THE PICTURE IS INSIDE THE CONTAINER. Two numbers, because the
         phrase means two things and only one of them is usually what is
         wanted — see the note in js/work-grid.js. */
      { name: 'FIELD \u00b7 the picture inside the container', open: true, rows: [
        { label: 'wg.inset', min: 0, max: 140, step: 1,
          get: () => C.inset, set: v => { C.inset = v; G.apply(); },
          hint: 'the MARGIN \u2014 px of container showing around the photograph. Figma\u2019s is 32, which leaves 411 x 247 inside a 475 x 311 plate. Raise it and you see more container, less picture, and the window the picture is cropped to shrinks with it' },
        { label: 'wg.imageFit', options: ['cover', 'contain'],
          get: () => C.imageFit, set: v => { C.imageFit = v; G.apply(); },
          hint: 'cover fills the 5:3 window by cutting the sides off \u2014 right for a photograph, whose subject sits near the middle. contain shows the WHOLE shot and lets the container colour make up the difference \u2014 which is what a website shot wants, because its subject is a headline that runs to both edges' },
        { label: 'wg.imageZoom', min: 0.4, max: 3, step: 0.02,
          get: () => C.imageZoom, set: v => { C.imageZoom = v; G.apply(); },
          hint: 'the CROP \u2014 how far the photograph is magnified inside that window. The frame does not move; you simply see less of the picture. 1 is object-fit: cover exactly' },
      ]},

      /* PARALLAX, in its own group rather than buried among the sizing
         numbers. It was inside 'the picture inside the container', which is
         true — it IS the picture moving inside the container — and is not
         where anybody would look for a thing called parallax. A control
         nobody can find is a control that does not exist. */
      { name: 'FIELD \u00b7 parallax', open: true, rows: [
        { label: 'wg.parallax', min: -1, max: 1, step: 0.02,
          get: () => C.parallax, set: v => { C.parallax = v; },
          hint: 'how far the picture LAGS its frame as the card crosses the screen \u00b7 a card in the middle does not shift at all, one at the edge shifts most. Negative leads instead. THE CEILING IS imageZoom MINUS 1, exactly: the shift wanted at the edge is parallax x window/2 and the room the magnification leaves is (imageZoom-1) x window/2. Above that every picture pins against the clamp and stops responding \u2014 the readout says how many are pinned' },
        { label: 'wg.parallaxAxis', options: ['both', 'x', 'y'],
          get: () => C.parallaxAxis, set: v => { C.parallaxAxis = v; },
          hint: 'which way it is free to slide \u00b7 x alone reads as a window passed at speed, y alone as one you rise past' },
        { label: 'wg.parallaxCurve', min: 0.2, max: 4, step: 0.1,
          get: () => C.parallaxCurve, set: v => { C.parallaxCurve = v; },
          hint: 'above 1 keeps the middle of the screen still and throws the edges further, which reads as a lens rather than a uniform drift' },
      ]},

      { name: 'FIELD \u00b7 the container', open: true, rows: [
        { label: 'wg.plateColour', colour: true,
          get: () => C.plateColour, set: v => { C.plateColour = v; G.apply(); },
          hint: 'the ground the photograph lies on \u00b7 Figma\u2019s is #393939, the same as the bar. A picker rather than a list, because a ground colour is not a menu of five' },
      ]},

      /* THE TUBE, from js/crt.js — the same rows the gallery shows, because it
         is the same effect and there is one copy of it. */
      ...(window.CRT ? [{ name: 'CRT \u00b7 the tube', open: true,
                          rows: window.CRT.rows() }] : []),

      /* THE FIGURE, from js/figure-host.js — the home page's model standing on
         this page. Its own group rather than rows folded into FIELD: it is not
         part of the field, it is an object in the room the field is in, and
         nothing above it moves when one of these changes. */
      ...(window.WORKFIG ? [{ name: 'FIGURE \u00b7 the 3D', open: true,
                              rows: window.WORKFIG.rows() }] : []),

      /* HOW ROUNDED, and it is a movement property rather than a style one. */
      { name: 'FIELD \u00b7 rounded while moving', open: true, rows: [
        num('radius', 0, 120, 1,
          'the corner radius at REST \u00b7 0 is the hard rectangle Figma draws'),
        num('radiusMove', 0, 200, 1,
          '\u2026and at full movement \u00b7 push it past half the card\u2019s short side and a thrown card goes to a lozenge, which is the point'),
      ]},

      /* THE SIZE OF A CARD, on its own row group because it is the one dial
         that changes what the grid IS rather than how it is being looked at —
         and the only one that has to rebuild, since the column count is solved
         from the cell against the viewport. */
      { name: 'FIELD · the size of a card', open: true, rows: [
        rebuild('size', 0.3, 3, 0.05,
          'how big a card is · 1 is Figma\u2019s 475 x 331 on its own 1920 frame. The gutter, the ticks and the microtype all scale with it, so the grid keeps its proportions rather than the cards growing inside a fixed pitch'),
        rebuild('gutterX', 0, 200, 2,
          'the gap between columns \u00b7 Figma\u2019s is 16'),
        rebuild('gutterY', 0, 200, 2,
          '\u2026and between rows \u00b7 Figma\u2019s is 32'),
      ]},

      { name: 'FIELD · distortion under movement', open: true, rows: [
        num('skew', 0, 25, 0.5,
          'how far a card leans in the direction of travel while the field moves · back to nothing the moment it settles'),
        num('squash', 0, 0.6, 0.02,
          '…and how much it flattens ALONG that direction · the two together read as the card resisting being moved'),
        num('minCardScale', 0.2, 1, 0.05,
          'how far a card shrinks while the field moves · the baseline’s own, and the most recognisable thing it does'),
        num('scaleLerp', 0.005, 0.4, 0.005,
          'how fast it SHRINKS \u00b7 high catches the movement instantly, low lets the field get going first'),
        num('scaleBack', 0.005, 0.4, 0.005,
          '\u2026and how fast it comes BACK when you let go \u00b7 separate on purpose: the same rate both ways makes a card snap back the instant you pause mid-drag'),
        num('scaleHold', 0, 800, 10,
          'ms after the last scroll or drag before it starts returning \u00b7 keeps the cards small through a stuttery trackpad flick instead of pulsing on every gap between events'),
      ]},

      { name: 'FIELD · cursor magnetism', open: true, rows: [
        num('magnet', 0, 0.6, 0.01,
          'how far a card leans toward the pointer · a share of the distance, so a card can never reach the cursor — one that did would be impossible to point at, because it would move out from under every approach'),
        num('magnetRadius', 80, 1200, 20,
          'how close the pointer has to be before a card feels it'),
        num('magnetLerp', 0.02, 0.4, 0.01,
          'how quickly it leans · low is a heavy card, high is a nervous one'),
      ]},

      /* THE FOCUS STATE. Figma 14584:13346. */
      { name: 'FIELD · resting on a card', open: true, rows: [
        num('dwellMs', 200, 6000, 100,
          'how long the pointer has to rest on one card before the rest dim · any movement of the field cancels it, because you cannot be resting on a card you are dragging past'),
        num('dimTo', 0, 1, 0.01,
          'what every OTHER card drops to · Figma’s is 0.40'),
        /* WRITES THE CSS VARIABLE TOO, because this dial lives in the
           stylesheet: the dim is a CSS transition that reads the variable, and
           setting only the config would move the number nothing reads. */
        { label: 'wg.focusMs', min: 80, max: 1500, step: 20,
          get: () => C.focusMs,
          set: v => { C.focusMs = v; G.apply(); },
          hint: 'how long the dim takes \u00b7 one number for the picture, its ticks and its label, so the three cannot fade at different rates' },
        num('focusScale', 1, 1.4, 0.01,
          '…and how much the held card grows'),
      ]},

      /* THE CLOCK IN THE BAR, from js/clock.js. The bar is on every page, so
         this group is the same on each of them. */
      ...(window.CLOCK ? [{ name: 'BAR \u00b7 the clock', open: false,
                            rows: window.CLOCK.rows() }] : []),

      /* THE BASELINE'S NUMBERS, kept together and under their own names so the
         set can be read against the reference without translating. */
      { name: 'MOVEMENT · from the baseline', open: false, rows: [
        num('wheelSpeed', 0.1, 3, 0.05, 'wheel and trackpad speed · the reference’s 0.6'),
        num('dragSpeed', 0.1, 3, 0.05, 'drag speed · the reference’s 1.2'),
        num('positionLerp', 0.01, 0.4, 0.01,
          'movement smoothing · 0.05 is the reference’s, and it is a long glide'),
        num('xToYInfluence', -1, 1, 0.05,
          'how much a HORIZONTAL drag bleeds into vertical · most of why the field reads as a surface rather than a pair of scrollbars'),
        rebuild('startOffsetY', 0, 1, 0.01,
          'the vertical stagger between neighbouring columns \u00b7 the reference ships 0.33, which makes a masonry field out of a ruled one. 0 here, because Figma\u2019s grid is ruled'),
        rebuild('colSpeedB', 0.5, 1.5, 0.01,
          'how fast every THIRD column travels \u00b7 the reference\u2019s 0.9 gives the field depth before any of the 3D is on. 1 keeps it a single sheet, as drawn'),
        rebuild('overscan', 0, 3, 1,
          'extra rows and columns kept outside the viewport · too few and a card pops in at the edge, too many and you are drawing what nobody sees'),
        num('maxDelta', 10, 200, 5,
          'the clamp on a single event · stops one violent trackpad flick throwing the field across the world'),
      ]},

      { name: 'FIELD · the photographs', open: false, rows: [
        /* wg.grey is gone: colour is a function of where a card sits now, so
           the flat value it used to hold has two ends and lives in COLOUR
           TOWARD THE MIDDLE above. */
        { label: 'wg.contrast', min: 0.4, max: 2.5, step: 0.05,
          get: () => C.contrast, set: v => { C.contrast = v; G.apply(); },
          hint: 'contrast, on top of whatever the distance ramp has done to the colour' },
        flag('enabled', 'the whole field · off freezes it where it stands'),
      ]},
    ],
  });

  return function destroy(){ panel.destroy(); };
});
