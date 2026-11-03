/* ==========================================================================
   figure-host.js — where the scanned figure stands, on whichever page wants it.

   IT WAS work-figure.js while exactly one page had a figure. The home page's
   HUD wants the same one in its map box, and copying this would leave two
   versions of one thing to keep in step — which is the mistake this codebase
   has already made twice (see gridSize() in js/work-grid.js for both, and
   js/crt.js, which moved out here for the same reason). So it takes a HOSTS
   map like crt.js does: a page with no entry simply has no figure, rather than
   having one that is switched off.

   IT IS THE SAME RENDERER, NOT A COPY OF IT. js/about-figure.js is already a
   FACTORY — makeFigure(canvasSelector, globalName, preserveBuffer) — because
   the home page runs two of them, the head in block 01 and the body in block
   02. A third instance is one more line at the bottom of that file, and this
   page gets the identical shader, camera and mesh loader for it. Nothing about
   the 3D is reimplemented here.

   WHAT THIS FILE IS, then, is everything AROUND the figure: where it stands,
   how big it is, which way it faces, and what its colour does to what is
   behind it. Those are the four things that were asked for, and none of them
   belong inside a renderer.

   THE TWO HOSTS ARE NOT THE SAME SHAPE, and only one line of the difference
   matters: the work page's figure is measured against the VIEWPORT, so its
   size is in vh and stays the same share of any screen; the HUD's is a 52px
   figure inside a 283x142px box that the rest of hud.css draws in pixels, so
   vh there would break the one drawing it belongs to. The unit is per host.

   SIMPLE, AS ASKED. The About page's figure carries a second mesh, a pointer
   reveal that wipes a hole in the outer layer, a scroll-driven camera ramp and
   a silhouette read-back that the body copy flows around. All of it is
   switched off below. The read-back is the one worth naming: it is a
   readPixels, which forces a full GPU sync and costs a main-thread stall every
   time it runs — on a page whose whole job is to drag smoothly at 60fps that
   is the most expensive thing that could have come across, and nothing here
   consumes its output.

   A LIGHTER MESH. The home page's figure.js is 5.4 MB of base64 for 250,732
   triangles, which is the right call for a model that fills half the screen
   and the wrong one for a corner element. assets/about/figure-lite.js is the
   same scan cut to 17,848 triangles and 239 KB by the same tool — 23 times
   smaller, and at the sizes this thing draws at there is nothing in the
   difference to see. It is NOT in work.html's script list: about-figure.js
   injects a mesh it cannot find, so the page pays for it only if the figure is
   actually on.

   THE ONE THING TO KNOW ABOUT THE COLOUR DIAL. `invert` is a FILTER — it
   works on the figure alone and knows nothing about what is behind it, so it
   looks the same over a card as over the ground. Everything else is a BLEND:
   the figure combined with the field under it, changing as cards pass beneath.
   Both are on one picker because from where you are sitting they are one
   question. See COLOUR below for why `negative` is the second kind and not,
   as you would expect, the first.
   ========================================================================== */
/* WHICH ELEMENT IS THE STAGE — a LIST, not one entry per page. It was a map
   keyed by page, which was right while no page had two; the home page now has
   the HUD's figure and the logo between block 02's columns, so a page can name
   as many stages as it likes and each gets its own instance, its own dials and
   its own published global.

   `gl` is the renderer instance js/about-figure.js publishes, `global` is what
   this module publishes for that page's console, `unit` is what `size` is
   measured in, and `spinWith` — if present — names a module whose progress()
   drives the rotation instead of the clock. */
const FIGURE_HOSTS = [
  { page: 'design', host: '[data-work-figure]', gl: 'WFIG',   global: 'WORKFIG',
    unit: 'vh', placed: true },
  { page: 'mask',   host: '[data-hud-figure]',  gl: 'HUDFIG', global: 'HUDFIGURE',
    unit: 'px', placed: false },
  /* ITS OWN ROW PREFIX, and this is not cosmetic. js/tuner.js keys every
     stored and exported value by the row's LABEL, and this stage shares a
     panel — and therefore a storeKey — with the HUD's figure above. Two groups
     both writing `fig.size` would overwrite each other in the export, in what
     is restored on load, and in Reset. The work page's stage is on its own
     panel and keeps `fig`, so nothing already saved is disturbed. */
  { page: 'mask',   host: '[data-logo-figure]', gl: 'LOGOFIG', global: 'LOGO',
    unit: 'px', placed: false, spinWith: 'BLOCK2', prefix: 'logo' },
];

function makeFigureHost(MAP){
 return function (scope) {
  'use strict';

  if (scope.dataset.page !== MAP.page) return;
  const host = scope.querySelector(MAP.host);
  if (!host) return;

  /* THE RENDERER'S OWN GLOBAL. js/about-figure.js registers the instance and
     publishes this at ITS mount, and registration order is mount order — so
     this file's <script> comes after that one's. Saying so out loud rather
     than trusting it: a dial that silently writes to nothing is the failure
     this site has already had once, when the clock's console was built against
     a global that had not been published yet. */
  const gl = () => window[MAP.gl] || null;
  if (!gl()) console.warn('[figure-host] ' + MAP.gl + ' not published — is ' +
                          'js/figure-host.js loaded before js/about-figure.js?');

  const CONFIG = {
    enabled: true,

    // ---- where it stands ----
    /* The five the brief names, and the class names in css/figure-host.css are
       these strings — so adding a sixth is a value here and a rule there, with
       nothing in between to keep in step. */
    place: 'center',     // center · top-left · top-right · bottom-left · bottom-right
    size: 10,            // the box, in the host's own unit — vh or px
    marginX: 0,          // ...and its inset from the edge, same unit
    marginY: 40,         // (both ignored at CENTRE, which is not measured from one)

    // ---- what its colour does ----
    colour: 'difference',// see COLOUR below
    opacity: 1,
    /* HOW DEEP IN THE STACK. FRONT is in front of the CRT's glass and stays a
       clean silhouette; OVER is under the scan lines, as though the monitor
       were displaying it; UNDER drops it behind the photographs with the blob,
       where a blend mode makes it part of the room rather than an object in
       front of it. See the note in apply(). */
    layer: 'under',      // under · over · front

    // ---- the figure itself, forwarded to the renderer ----
    rotate: 180,         // degrees it faces
    tilt: -40,           // camera elevation, added to the renderer's own 40
    spin: 30,            // degrees a second of idle drift · 0 holds it still
    lens: 15,            // camera FOV · low is flattering, high is dramatic
    flat: 1,             // 0 is the lit model, 1 a clean white silhouette
    tone: 1.6,           // overall lightness
    tint: '#ffffff',

    /* HOW MANY FULL TURNS THE SCROLL IS WORTH. Read only on a stage with a
       `spinWith` — see the frame loop at the bottom. Rotation is then a
       FUNCTION OF POSITION rather than of time: scroll back up and it unwinds
       through exactly the angles it came through, because nothing is being
       accumulated, only the block's own progress read. */
    turns: 1.5,
    /* SCREEN: it holds the middle of the viewport and the copy travels past it.
       TEXT: it rides with the copy, which is the other reading of "in the
       middle of the text" — truer to the words, and it means the mark is only
       on screen for a moment. Only a stage with a `spinWith` shows this. */
    anchor: 'screen',   // screen · text

    /* ---- WHERE IT SITS, in three axes ----
       X and Y move the mark on the PAGE and are plain pixels, because that is
       what placing a mark on a layout is. Z is not a pixel and could not be:
       it moves the object along the view axis inside its own little scene, so
       the perspective changes with it — the plate foreshortens harder near the
       camera than far from it. It is not another way of writing `size`, which
       changes how big the box is without moving anything. */
    x: 0, y: 0,         // px
    z: 0,               // depth · above 0 is toward the viewer

    /* HOW THICK THE OBJECT IS, as a multiple of what it was modelled at. Not
       the same axis as `z` above and not the same idea: z moves the whole thing
       toward you, this makes the thing itself deeper. On the logo — a plate
       modelled 0.030 deep against 1.000 wide — it is the difference between a
       mark that vanishes as it turns and one that has a body. */
    depth: 1,

    /* ---- HOW THE ROTATION FOLLOWS THE WHEEL ----
       0 is locked to the scroll: the angle is exactly the position, and the
       mark stops dead the instant you do. Above 0 it lags and catches up, and
       the number is the time constant in SECONDS — 0.15 is a light drag, 0.6
       is heavy. It is a time constant rather than a per-frame fraction so it
       means the same thing at 60fps and at 120. */
    spinLerp: 0,

    /* ---- WHEN IT IS THERE ----
       In block 02's own progress, 0 to 1, which is the unit everything else in
       this block is written in — js/block2.js's note is worth reading on why:
       these are POSITIONS, not timings, so they do not drift when the block's
       scroll speed is retuned. Seconds would.

       Four numbers rather than two so the arrival and the departure can have
       different lengths; set showTo == showFrom for a hard cut. */
    showFrom: 0, showTo: 0.04,
    hideFrom: 0.92, hideTo: 1,
  };

  /* ---- AND WHAT EACH HOST CHANGES ABOUT THEM. The block above is the WORK
     page's, exported from its own console — the map below is only the HUD's
     departures from it, so there is one set of numbers with one page's worth of
     exceptions rather than two full copies drifting apart.

     The HUD's figure is pinned to the middle of a 283x142px map box by
     css/hud.css, exactly where the PNG it replaces used to sit, so placement
     and layering are hud.css's business and the dials for them do not appear
     on that page. What is left is what it LOOKS like. */
  const HOST_PRESET = {
    HUDFIGURE: {
      /* 52px in a 283x142 box — the height the PNG occupied, so the map reads
         as it always did and only its subject is now live. */
      size: 52, place: 'center',
      /* NORMAL, not difference: the map box is a dark hatch with a red square
         on it and nothing else, so there is nothing behind the figure worth
         blending with — and `difference` against that hatch would pick up the
         stripes THROUGH the figure, which is noise at 52px. */
      colour: 'normal', layer: 'over',
      /* Facing the reader, lit from a low camera, and turning slowly: it is a
         radar contact, and a contact that never moves reads as a graphic. */
      rotate: 0, tilt: -8, spin: 163, lens: 30,
      flat: 1, tone: 1.15,
    },

    /* THE LOGO, between block 02's columns. Figma 14616:11397 draws it 30x30
       at the dead centre of a 1920x1080 frame, which is also the centre of the
       two columns — so css/block2.css centres it and this sizes it.

       TOTALLY DARK, and `tone: 0` is what does it rather than a black tint:
       the shading is multiplied by tone before anything else, so at 0 every
       pixel of the mark is 0 whatever colour it was going to be. A black tint
       would do the same only while `flat` is 1 — this holds at any setting, so
       turning the shading back on later gives a lit dark object rather than a
       flat one that has suddenly acquired colour.

       The mesh is 1.000 x 1.000 x 0.030 — a plate, stood up by
       tools/glb-to-js.py so it faces the reader and the renderer's Y spin
       turns it like a revolving door. That is the one rotation a flat mark
       reads in; spun about its own thin axis it would just be a wheel. */
    LOGO: {
      size: 30, place: 'center', layer: 'over',
      /* NEGATIVE, not normal: the mark sits on the white block, and punching
          the page through as a hole keeps it part of the same surface rather
          than a black plate laid on top. */
       /* NORMAL, not negative — and this is the pair that has to be read
          together. NEGATIVE blends with `difference`: it inverts the page
          through the silhouette, which only shows if the silhouette is LIGHT.
          This one is black (tone 0, tint #000000) and the block it sits on is
          white, and |white - black| is white: the mark renders every frame and
          is the same colour as the paper. Nothing is broken and nothing is
          visible, which is the worst pair to debug. A black plate on white
          wants NORMAL. */
       colour: 'normal', flat: 1, tone: 0, tint: '#000000',
      /* -40 CANCELS THE RENDERER'S OWN 40. `tilt` is an OFFSET on top of
         tiltStart/tiltEnd, which are 40 because this renderer was written for
         a standing figure and 40 degrees above is a flattering angle on a
         person. On a flat mark it is not an angle at all, it is a squash: at
         the +12 this shipped with, the camera sat 52 degrees above the plate
         and the vertical arms of the cross came out half the length of the
         horizontal ones. 0 elevation is face-on, which is what Figma draws. */
      /* 152 is where it faces at the TOP of the block; the scroll turns it
          from there. By eye against the copy, not derived. */
       rotate: 152, tilt: -40, spin: 0, lens: 15,
       /* 433px down: riding with the text put it at the columns' own centre,
          which is not where it sits well against this particular copy. */
       y: 433,
      /* TEXT, not SCREEN. The original reading held the middle of the viewport
         and let the copy travel past it, so the rotation stayed on screen long
         enough to read — which is why it was built that way. The brief is the
         other one: the mark belongs inside the block of text and goes with it.
         It now passes in about a second, and that is the intended trade. */
      /* 4.4 TURNS, up from 1.5, and the anchor is why. Held to the screen it
          had the whole block to rotate through; riding with the copy it is in
          front of you for a fraction of that, so 1.5 read as almost no
          movement. The number went up to put the rotation back in the window
          where it can be seen. */
       turns: 4.4, anchor: 'text',
       /* WHEN IT IS THERE, in the block's own progress: a near-instant arrival
          at 0.22, then it STAYS. The fade used to start at 0.33, which is a
          tenth of the block — the mark was gone before most of the copy it is
          centred between had even been read, and the report that reached me
          was simply "the cross isn't there". It is anchored to the text and
          scrolls with it, so it should leave when the text does, not a third
          of the way through. */
       showFrom: 0.22, showTo: 0.23, hideFrom: 0.92, hideTo: 1,
      /* FOUR, not the 1 the file was modelled at. At 1 the plate is 0.030 deep
         against 1.000 wide and its edge is a hairline — the mark all but
         disappears every quarter turn, which is what "pretty thin" was. Four
         gives it a body you can see turning without making it a slab. */
      /* 6.5 now, not 4 — same reason as the note above, it needed more body
          at this size. */
      depth: 6.5,
    },
  /* KEYED BY THE STAGE, NOT THE PAGE. Two stages share the page 'mask' now,
     so a page key would hand the logo the HUD figure's numbers — which it did,
     once. The published global names the stage uniquely; the page does not. */
  }[MAP.global];
  if (HOST_PRESET) Object.assign(CONFIG, HOST_PRESET);

  /* WHAT `negative` HAD TO BE. It was invert(1) — the figure's own colours
     flipped — which is the literal reading and a dead option here: the figure
     ships as a flat white silhouette and the page it stands on is black, so
     inverting it painted black on black and the dial appeared to do nothing.

     A negative is a negative OF SOMETHING, and the something is the field
     behind it. `difference` against a white source is exactly 1 - backdrop, so
     the silhouette becomes a hole through which the page is inverted — a white
     card goes black inside it, the black ground goes white. That is the effect
     the word means, and it is the one that reads.

     The literal one is still here under its own name, `invert`, because on a
     TINTED or lit figure it is a different picture and worth having. */
  const COLOUR = {
    normal:      { blend: 'normal',      filter: 'none' },
    negative:    { blend: 'difference',  filter: 'none' },
    invert:      { blend: 'normal',      filter: 'invert(1)' },
    multiply:    { blend: 'multiply',    filter: 'none' },
    screen:      { blend: 'screen',      filter: 'none' },
    overlay:     { blend: 'overlay',     filter: 'none' },
    difference:  { blend: 'difference',  filter: 'none' },
    exclusion:   { blend: 'exclusion',   filter: 'none' },
    'hard-light':{ blend: 'hard-light',  filter: 'none' },
    'soft-light':{ blend: 'soft-light',  filter: 'none' },
    luminosity:  { blend: 'luminosity',  filter: 'none' },
    dodge:       { blend: 'color-dodge', filter: 'none' },
    burn:        { blend: 'color-burn',  filter: 'none' },
  };
  const PLACES = ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

  /* ---- THE RENDERER'S PAGE-SCOPED PRESET, the shape js/crt.js and js/mask.js
     already use: the defaults in about-figure.js are the ABOUT page's, and a
     value tuned in one room has no business being written into another's file.
     So the differences are stated here, once, where the page that wants them
     lives. Everything switched off below is something the brief asked not to
     bring across. */
  function preset(){
    const F = gl(); if (!F) return;
    Object.assign(F.config, {
      /* CONTAIN, not HEIGHT. `height` means a share of the VIEWPORT and would
         ignore the box entirely; `contain` means a share of the FRAME, which
         is the box, which is what `size` sets. */
      fit: 'contain', fitPad: 0.02, height: 1,
      offsetX: 0, offsetY: 0,

      /* None of the About page's machinery. */
      reveal: false,      // the pointer wiping a hole in the outer layer
      innerOn: false,     // the second mesh under it
      follow: false,      // turning toward the cursor
      scrollTurn: 0,      // the page's scroll driving the spin
      silMs: 0,           // the readPixels · a main-thread stall nothing reads
      /* NO SPECKLE. The About page gives every pixel a tiny random hue
         because its fx layer is a `saturation` blend, and a saturation blend
         over pure grey does nothing — the noise is what that layer has to
         work with. Nothing here blends that way, so the noise is only noise,
         and a clean silhouette is what the mock-up draws. */
      grain: 0,

      /* A fixed elevation: the ramp exists but its two ends are equal, so what
         is left is `tiltOffset`, which the dial below writes. */
      tiltStart: 40, tiltEnd: 40,
      followEase: 0.09,
    });
  }

  function apply(){
    const C = CONFIG, F = gl();

    host.classList.toggle('is-off', !C.enabled);
    PLACES.forEach(p => host.classList.toggle('wfig--' + p, p === C.place));

    /* vh on the work page, px in the HUD. See the note at the top: the HUD is
       drawn in pixels by css/hud.css and a viewport-relative figure inside it
       would come apart from the box it is standing in. */
    const U = MAP.unit;
    host.style.setProperty('--wfig-size', C.size + U);
    host.style.setProperty('--wfig-mx', C.marginX + U);
    host.style.setProperty('--wfig-my', C.marginY + U);
    host.style.setProperty('--wfig-opacity', String(C.opacity));
    /* THREE HEIGHTS, and the middle one is the interesting distinction. The
       CRT's glass is a sheet at z-index 55 INSIDE the same element, so a figure
       at 45 is under the scan lines and one at 60 is not — which is the
       difference between the figure being something the monitor is DISPLAYING
       and something standing in front of it. The mock-up draws the second: a
       clean white silhouette against a field that is visibly scanned. */
    host.style.setProperty('--wfig-z',
      C.layer === 'under' ? '0' : C.layer === 'front' ? '60' : '45');

    host.classList.toggle('is-with-text', C.anchor === 'text');
    /* The nudge rides in its OWN custom property rather than in the transform,
       because css/figure-host.css already owns that transform for the centring
       and css/block2.css adds the column travel on top of it. Three writers on
       one property is how a placement ends up depending on load order. */
    host.style.setProperty('--wfig-dx', C.x + 'px');
    host.style.setProperty('--wfig-dy', C.y + 'px');

    const look = COLOUR[C.colour] || COLOUR.normal;
    host.style.setProperty('--wfig-blend', look.blend);
    host.style.setProperty('--wfig-filter', look.filter);

    if (!F) return;
    Object.assign(F.config, {
      fov: C.lens,
      idleSpin: C.spin,
      tiltOffset: C.tilt,
      flatten: C.flat,
      offsetZ: C.z,
      depth: C.depth,
      tone: C.tone,
      /* WHAT THE FLATTEN WALKS TO. Without this, `tone` is invisible at flat 1
         — the surface goes to pure white past every brightness dial — and a
         white figure cannot darken anything, so MULTIPLY and BURN do nothing.
         It is a separate uniform rather than tone itself because block 02's
         head on the home page runs flatten 1 with tone 0.05 deliberately; see
         the note beside uFlatLevel in js/about-figure.js. */
      flatLevel: C.tone,
      tint: C.tint,
    });
    /* THE ANGLE GOES THROUGH setAngle RATHER THAN THE CONFIG. `startAngle` is
       read once, to seed the spin on the first frame — writing it afterwards
       used to change nothing at all, which made the rotation dial look broken
       while the value it wrote was perfectly correct. See the note beside
       `seeded` in js/about-figure.js.

       NOT ON A SCROLL-DRIVEN STAGE, though: there the frame loop owns the
       angle, and apply() setting it to `rotate` fought that loop — worse, it
       fought it INVISIBLY, because the loop caches the last angle it wrote and
       would then compute the same number and decline to write it back. Moving
       any other dial parked the mark at its start angle until the next scroll.
       So the cache is invalidated and the loop is left to it. */
    if (MAP.spinWith){
      lastDeg = null;
    } else if (F.setAngle){
      F.setAngle(C.rotate);
    } else {
      F.config.startAngle = C.rotate;
    }
    F.apply();
  }

  /* ---- ROTATION FROM THE SCROLL, on a stage that asks for it ---------------
     NOT AN ANIMATION. `spin` is degrees a second and runs on a clock; this is
     degrees per unit of PROGRESS and runs on the wheel — scroll down and it
     turns, stop and it stops exactly there, scroll back and it unwinds through
     the same angles. Nothing is accumulated: the angle is recomputed from the
     block's progress every frame, so it can never drift out of step with the
     page the way an integrated velocity would.

     The named module may not be up yet — registration order is mount order and
     nothing guarantees this file comes after that one — so it is looked up per
     frame rather than captured. That is one property read on an object that is
     already there; the alternative is a dial that silently never moves because
     it bound to undefined once, at mount. */
  let raf = 0, alive = true, lastDeg = null, lastVis = null, spun = null,
      lastT = performance.now();
  /* 0 below `from`, 1 above `to`, straight line between. A zero-width window is
     a hard cut rather than a divide by zero. */
  const ramp = (v, from, to) =>
    to <= from ? (v >= to ? 1 : 0)
               : Math.max(0, Math.min(1, (v - from) / (to - from)));
  if (MAP.spinWith){
    const frame = () => {
      if (!alive) return;
      const now = performance.now();
      const dt = Math.min(0.1, (now - lastT) / 1000);   // clamped: a backgrounded
      lastT = now;                                       // tab returns a huge one
      const M = window[MAP.spinWith];
      const F = gl();
      if (M && typeof M.progress === 'function' && F && F.setAngle){
        const p = M.progress();

        /* THE ANGLE. The target is exactly the scroll position; `spinLerp` is
           how hard the mark is allowed to lag behind it. Exponential against
           REAL elapsed time, not a fixed fraction per frame, so the same
           setting feels the same on a 60Hz screen and a 120Hz one. */
        const want = CONFIG.rotate + p * CONFIG.turns * 360;
        if (CONFIG.spinLerp <= 0 || spun === null) spun = want;
        else spun += (want - spun) * (1 - Math.exp(-dt / CONFIG.spinLerp));
        /* A tenth of a degree is under a pixel at this size, and setAngle is
           not free — it re-seeds the renderer's spin. */
        const q = Math.round(spun * 10) / 10;
        if (q !== lastDeg){ lastDeg = q; F.setAngle(q); }

        /* WHEN IT IS THERE. Multiplied INTO opacity rather than replacing it,
           so fig.opacity stays the overall level and these stay the schedule —
           two dials that would otherwise fight over one property. */
        const vis = ramp(p, CONFIG.showFrom, CONFIG.showTo) *
                    (1 - ramp(p, CONFIG.hideFrom, CONFIG.hideTo));
        const a = Math.round(CONFIG.opacity * vis * 1000) / 1000;
        if (a !== lastVis){
          lastVis = a;
          host.style.setProperty('--wfig-opacity', String(a));
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }

  preset();
  apply();

  window[MAP.global] = {
    config: CONFIG,
    placed: MAP.placed,
    apply,
    places: PLACES,
    readout(){
      const F = gl();
      return { figure: !CONFIG.enabled ? 'off'
                     : `${CONFIG.size}${MAP.unit} · ${CONFIG.colour}` +
                       (MAP.placed ? ` · ${CONFIG.place}` : '') +
                       (F && F.readout ? ` · ${F.readout().tris} tris` : '') };
    },
    rows(){
      const C = CONFIG, self = this;
      const P = (MAP.prefix || 'fig') + '.';
      const num = (key, min, max, step, hint) => ({
        label: P + key, min, max, step,
        get: () => C[key], set: v => { C[key] = v; self.apply(); }, hint,
      });
      /* THE PLACEMENT ROWS ONLY WHERE PLACEMENT IS THIS MODULE'S. In the HUD
         the figure is pinned to the middle of the map box by css/hud.css, and a
         dial that writes a number nothing reads is worse than no dial: it looks
         like the feature is broken rather than absent. */
      const placement = !MAP.placed ? [] : [
        { label: P + 'place', options: PLACES,
          get: () => C.place, set: v => { C.place = v; self.apply(); },
          hint: 'the five positions · the four corners are measured from the edge with the two margins below, and CENTRE is the one that is not, so those two do nothing while it is picked' },
        num('marginX', 0, 40, 0.5, 'inset from the left or right edge · CENTRE ignores it'),
        num('marginY', 0, 40, 0.5, '…and from the top or bottom'),
        { label: P + 'layer', options: ['front', 'over', 'under'],
          get: () => C.layer, set: v => { C.layer = v; self.apply(); },
          hint: 'how deep in the stack it stands · FRONT is in front of the CRT’s glass, so it stays a clean silhouette while the field behind it is visibly scanned — which is what the mock-up draws · OVER puts it under the scan lines, as though the monitor were displaying it · UNDER drops it behind the photographs with the blob, where a blend mode makes it part of the room rather than an object in front of it' },
      ];
      return [
        { label: P + 'enabled', options: ['on', 'off'],
          get: () => (C.enabled ? 'on' : 'off'),
          set: v => { C.enabled = v === 'on'; self.apply(); },
          hint: 'the figure · it is the home page’s own model and the home page’s own renderer, cut to a twenty-third of the triangles because nothing at this size can tell' },

        ...placement.slice(0, 1),
        num('size', ...(MAP.unit === 'px' ? [8, 140, 1] : [2, 100, 1]),
          MAP.unit === 'px'
            ? 'how big, in PX · the map box is 283x142px and the rest of css/hud.css is drawn in pixels, so this is too — a viewport-relative figure would come apart from the box it stands in. 52 is the height the PNG it replaced occupied'
            : 'how big, as a share of the viewport’s HEIGHT · so it keeps its proportion of the page on any screen rather than a pixel count that is huge on a laptop and a stamp on a display'),
        ...placement.slice(1, 3),

        { label: P + 'colour', options: Object.keys(COLOUR),
          get: () => C.colour, set: v => { C.colour = v; self.apply(); },
          hint: 'NEGATIVE turns the silhouette into a hole the page is inverted through — a white card goes black inside it and the black ground goes white — and it is the one to reach for first · INVERT is the literal one, the figure’s own colours flipped, which on a white silhouette over black paints black on black and looks like nothing · the rest are blends with the field behind, so they change as cards pass under: screen and dodge keep the lights, luminosity takes the figure’s light but the field’s colour. MULTIPLY and BURN need a DARK figure to show at all — white multiplied by anything is that thing — so drop TONE or set a dark TINT before judging them' },
        num('opacity', 0, 1, 0.02, 'how present it is'),
        ...placement.slice(3),

        num('rotate', -180, 180, 1,
          MAP.spinWith
            ? 'which way it faces at the TOP of the block · the scroll turns it from here'
            : 'which way it faces · degrees about its own vertical axis'),
        ...(!MAP.spinWith ? [] : [
          num('turns', -6, 6, 0.1,
            'FULL TURNS across the whole of block 02 · the rotation is a function of scroll POSITION, not of time, so it stops where you stop and unwinds if you scroll back. Negative turns the other way'),
          { label: P + 'anchor', options: ['screen', 'text'],
            get: () => C.anchor, set: v => { C.anchor = v; self.apply(); },
            hint: 'SCREEN holds the middle of the viewport and lets the copy travel past, which is what the Figma frame shows and the only way a rotation is on screen long enough to read · TEXT rides with the columns, which is truer to “in the middle of the text” and means the mark passes in about a second' },
          num('spinLerp', 0, 1.2, 0.02,
            'HOW HARD IT LAGS THE WHEEL, in seconds · 0 is locked to the scroll — the angle IS the position and it stops dead when you do. Above 0 it trails and catches up: 0.15 is a light drag, 0.6 is heavy. A time constant rather than a fraction per frame, so it feels the same at 60Hz and at 120'),

          num('x', -1200, 1200, 1,
            'across the page, in px · this moves the MARK on the layout, not the object in its scene — the two are different and the one you want for placing something is this'),
          num('y', -1200, 1200, 1, '…and up and down, same units'),
          num('z', -2, 2, 0.02,
            'and TOWARD you, in the object’s own scene · not another way of writing SIZE: the perspective moves with it, so a plate turning edge-on foreshortens harder when it is near and flattens out when it is far. Size changes how big the box is and moves nothing'),
          num('depth', 0.2, 20, 0.1,
            'HOW THICK THE MARK IS, as a multiple of what it was modelled at · your logo is 1.000 wide and 0.030 deep, so at 1 its edge is a hairline and it all but disappears every quarter turn. This scales that one axis only, in the model’s own space, so face-on it is unchanged and what grows is the body you see as it turns. Different axis from Z above, and a different idea: Z moves the whole thing toward you, this makes the thing itself deeper'),

          num('showFrom', 0, 1, 0.01,
            'where in block 02 it starts arriving · these four are the block’s own progress, 0 to 1, which is the unit everything else here is written in — positions rather than seconds, so they do not drift when scroll.speed is retuned'),
          num('showTo', 0, 1, 0.01,
            '…and where it is fully there · equal to the one above for a hard cut'),
          num('hideFrom', 0, 1, 0.01, 'where it starts leaving'),
          num('hideTo', 0, 1, 0.01, '…and where it has gone'),
        ]),
        num('tilt', -60, 60, 1,
          'the camera’s elevation · above zero looks down on it, below looks up'),
        num('spin', -720, 720, 0.5,
          'degrees a SECOND · 0 holds it exactly where the dial above put it, 90 is a quarter turn a second, 360 is a full one, and the range runs to two turns a second either way · negative goes the other way · the box beside the slider takes an exact number, which is the only sane way to aim at a wide range like this'),
        num('lens', 15, 90, 1,
          'the camera’s field of view · low is a long lens and flattens it, high is close and dramatises the nearer leg'),

        num('flat', 0, 1, 0.02,
          'towards a clean silhouette · 0 is the lit model with its shadow side, 1 is flat colour ignoring the light entirely, which is what the mock-up draws'),
        num('tone', 0, 1.6, 0.02,
          'overall lightness · it reaches the figure even at FLAT 1, which it did not until the note beside uFlatten in js/about-figure.js · this is what makes MULTIPLY and BURN possible, since a white figure cannot darken anything'),
        { label: P + 'tint', colour: true,
          get: () => C.tint, set: v => { C.tint = v; self.apply(); },
          hint: 'its colour · normalised by its own brightness before it is applied, so this shifts the hue without also changing how light the figure is — TONE stays the one brightness control' },
      ];
    },
  };

  return function destroy(){
    alive = false;
    cancelAnimationFrame(raf);
    if (window[MAP.global] && window[MAP.global].config === CONFIG)
      delete window[MAP.global];
  };
 };
}

/* One registration per stage. Each no-ops on every page but its own, exactly
   as js/about-figure.js's four instances do. */
FIGURE_HOSTS.forEach((h, i) =>
  window.PAGE.register('figure-host-' + i, makeFigureHost(h)));
