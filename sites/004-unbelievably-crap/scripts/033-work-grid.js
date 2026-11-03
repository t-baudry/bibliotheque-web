/* ==========================================================================
   work-grid.js — the work page: an endless field of cards you drag through.

   WHAT CAME FROM THE BASELINE, AND WHAT DID NOT.

   The reference is a Webflow component built on GSAP's Observer plugin and a
   masonry arrangement. The MASONRY is not wanted — Figma's grid is regular —
   and the OBSERVER cannot come: it ships as a separate GSAP file this site does
   not load, and every third-party script here arrives from a CDN. A transition
   that cannot reach its CDN falls back to a pixel wipe and the page still
   works; a GRID that cannot reach its CDN is a black screen, because the grid
   IS the page. So the input is hand-rolled on wheel and pointer events, the way
   every other module here already does it.

   WHAT DID COME ACROSS IS THE FEEL, and the numbers are the baseline's own,
   noted at each one: the lerp, the way a horizontal drag bleeds into vertical,
   and the cards shrinking while you move.

   THE PHOTOGRAPHS ARE DOM IMAGES, AND THAT IS NOT A COMPROMISE — IT IS THE
   ONLY THING THAT WORKS. They were WebGL quads, on the reasoning that
   chromatic aberration and distortion are per-pixel operations. They are, and
   it rendered correctly over http, and it was dead on arrival off disk:

       SecurityError: Failed to execute 'texImage2D' — the image element
       contains cross-origin data, and may not be loaded.

   Every file:// document is an OPAQUE ORIGIN, so a local image can never be
   uploaded as a texture — not with CORS headers, because there is no server to
   send any. This site is reviewed by opening the folder, and a renderer that
   only works when served is a renderer that does not work.

   So the pictures are <img>, and the two effects that drove the WebGL decision
   are kept by other means rather than dropped:

     chromatic aberration   an SVG filter — the R and B channels genuinely
                            separated and re-blended, not a coloured copy behind
                            the picture. One filter for the field, its offsets
                            rewritten per frame.
     distortion             a per-card skew and squash under movement, which is
                            what the brief describes ("the cards might distort")
                            rather than a warp inside each photograph.

   INFINITY IS A MODULO, as the baseline has it: each cell's position is taken
   against the field's total size and wrapped, so a card leaving one edge is the
   card arriving at the other.
   ========================================================================== */
window.PAGE.register('work-grid', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'design') return;
  const root = scope.querySelector('.wgrid');
  const world = scope.querySelector('.wgrid__world');
  if (!root || !world) return;

  const PROJECTS = window.PROJECTS || [];
  if (!PROJECTS.length) return;

  const CONFIG = {
    enabled: true,

    /* ---- THE BASELINE'S MOVEMENT, verbatim -------------------------------
       Every number in this block is the reference's, with its own name kept so
       the two can be compared without translating. They are the feel. */
    wheelSpeed: 3,    // wheel/trackpad speed
    dragSpeed: 1.35,     // drag speed
    positionLerp: 0.2, // movement smoothing
    xToYInfluence: 0.1, // horizontal movement's influence on vertical
    overscan: 1,        // extra rows and columns generated outside the viewport
    maxDelta: 80,       // the reference clamps every event to this

    /* THE FIELD AT REST IS FIGMA'S GRID, EXACTLY, which is why the next two are
       at zero rather than at the reference's values.

       The baseline staggers columns vertically (0.33) and runs every third one
       slower (0.9). That is a MASONRY idea — it makes an irregular field out of
       a regular one — and it is lovely, and it made a page that could not be
       compared with the design at all. Figma 14584:12146 is a ruled grid: even
       rows, even columns, every card the same size.

       Both are still dials. They are simply not the default, so the page you
       open is the page that was drawn. */
    startOffsetY: 0,    // vertical stagger between columns · the baseline's 0.33
    colSpeedB: 1,       // every third column's speed · the baseline's 0.9

    /* ---- THE ARRANGEMENT ---------------------------------------------------
       Six ways the same cards can be laid out. They are six different pictures
       rather than six settings of one, which is why this is a dial and not a
       number — see LAYOUTS below for what each does and why.

       EVERY ONE OF THEM STAYS PERIODIC ON THE CELL LATTICE, and that is the
       constraint that shapes the whole set. The field is a torus: x wraps at
       cols x pitch and y at rows x pitch, so an arrangement is only seamless if
       it is a function of the cell's own index. That rules out anything
       genuinely global — a spiral, a radial burst — because those have a centre
       and a torus does not. Everything here is per-cell, so the field can be
       dragged forever in any direction without a seam. */
    layout: 'grid',     // grid · brick · masonry · diagonal · scatter · mixed
    layoutAmount: 1,    // how strongly the arrangement applies · 0 is always the ruled grid
    layoutSeed: 1,      // re-deal the two arrangements that use chance
    layoutDrop: 1,      // in DIAGONAL only: whole cells of fall across the field
    smallCard: 0.62,    // in MIXED only: what a small card scales to

    /* ---- the cards ---- */
    /* FIGMA'S CELL. The pitch is derived from the card rather than dialled
       separately: a gutter that does not track the card is a grid that comes
       apart the moment the size moves. */
    cardW: 475, cardH: 331,
    gutterX: 16, gutterY: 16,
    plateH: 311,        // the picture's plate; the rest of the cell is label

    /* ---- HOW BIG THE PICTURE IS INSIDE ITS CONTAINER ----------------------
       TWO NUMBERS, because "the size of the image" means two different things
       and only one of them is what you usually want.

       `inset` is the MARGIN — how much of the container shows around the
       photograph. Figma's is 32, giving 411 x 247 inside a 475 x 311 plate.
       Raise it and you see more container and less picture, and the window the
       picture is cropped to gets smaller with it.

       `imageZoom` is the CROP — how far the photograph is scaled inside that
       window. The window does not move; you simply see less of the photograph,
       magnified. 1 is object-fit: cover exactly.

       Change the inset and the composition changes with the frame. Change the
       zoom and the frame holds while the picture pushes in. */
    inset: 52,          // px of container showing around the picture
    imageZoom: 1.08,       // ...and how far the picture is magnified inside it
    /* COVER OR CONTAIN, and with this set of pictures it is not a detail.
       The window is 5:3 and these shots are 16:9 or taller, so COVER fills the
       frame by cutting the sides off — which is right for a photograph, whose
       subject is usually near the middle, and wrong for a website shot, whose
       subject is a headline that runs to both edges. CONTAIN shows the whole
       thing and lets the container colour make up the difference. */
    imageFit: 'contain',  // cover · contain

    /* ---- PARALLAX: the picture moves behind its frame ---------------------
       THE FRAME IS A WINDOW. The container stays welded to the grid and the
       photograph slides underneath it, so what a card shows changes with where
       that card is on screen — a window onto something further back rather than
       a picture pinned to a rectangle.

       WHAT DRIVES IT is the card's own offset from the middle of the screen. A
       card dead centre does not shift at all; one at the edge shifts most, and
       it shifts back as you drag it through the middle. Driving it from the
       scroll instead would slide every picture in step, which is a texture
       animation and not parallax.

       IT NEEDS `imageZoom` ABOVE 1 TO HAVE ANYWHERE TO GO. At cover and zoom 1
       the photograph is exactly its window and one pixel of travel shows a bare
       edge; the surplus from magnifying it IS the travel. The shift is clamped
       to that surplus, so no combination of dials can slide an edge into view —
       and with no surplus, parallax simply does nothing rather than breaking. */
    /* OFF, AND THE REASON IS THE CLAMP DIRECTLY ABOVE. It was 1, and 1 is not
       a parallax on this page — it is a permanent offset wearing one's name.

       The arithmetic: the shift asked for at the edge of the screen is
       `parallax x window/2`, which at 1 is 185px. The surplus available is
       `(imageZoom - 1) x window/2`, which at zoom 1.08 is 14.8px. So the clamp
       caught it everywhere except a narrow band down the middle of the screen,
       and every other card sat PINNED at the full 14.8px across and 8.3px
       down — a fixed displacement that flipped sign at the centre line. Which
       is exactly what it looked like: some cards centred, most not, and no
       pattern to it unless you knew where the middle was.

       An effect that is clamped almost everywhere is not a subtle effect, it
       is a constant one. To have it back as a real parallax, the surplus has
       to be big enough to hold the travel: raise `imageZoom` first, then keep
       this BELOW `imageZoom - 1`. The readout says which side of that line the
       current pair is on. */
    parallax: 0,        // how far the picture lags its frame · negative leads instead
    parallaxAxis: 'both', // both · x · y
    parallaxCurve: 1,   // >1 keeps the middle still and throws the edges further
    /* CARD SIZE. 1 is Figma's 475 x 331 on its own 1920 frame. Everything
       scales with it — the gutter, the ticks, the microtype — so the grid keeps
       its proportions rather than the cards growing inside a fixed pitch. */
    size: 1.15,

    /* ---- ZOOM ----
       Distinct from size: size changes how big a card IS, zoom changes how
       close you are standing to a field of cards of that size. Pinch does this. */
    zoom: 1.05,
    /* THE PINCH IS OFF. `zoom` stays — it is how the field's scale is set, and
       the shipped 1.05 is that setting — but the GESTURE is disabled, so a
       trackpad pinch does nothing and the field is only ever the size it was
       dialled to. The two are different things and only one of them was
       unwanted: turn this on and pinching moves the same number the slider
       does. */
    zoomGesture: false,
    zoomMin: 0.4, zoomMax: 2.5,
    zoomSpeed: 0.0015,
    zoomLerp: 0.08,

    /* ---- FOV ----
       A LENS, not a camera. A grid facing you square-on has no perspective to
       show — a real projection of a fronto-parallel plane is a uniform scale
       and nothing else — so what this means on a field like this is a radial
       displacement: the field curves away at the edges and every card stays a
       rectangle. 0 is Figma's flat grid, and is the default for the same reason
       the stagger is. */
    fov: 0,             // degrees of curve, 0 = the flat grid as drawn

    /* ---- chromatic aberration ----
       Real channel separation through an SVG filter, in px. Nothing at rest,
       because Figma's grid is clean; the moving half is the one worth having —
       a lens that fringes only while it is being pushed. */
    aberration: 0,
    aberrationMove: 12,

    /* ---- distortion ----
       "When scrolling, the cards might distort." Three things, because they
       read differently, and all three return to nothing when the field settles. */
    /* HOW FAR A CARD SHRINKS WHILE THE FIELD MOVES, and how it gets there and
       back. It was one lerp governing both directions and a hard-coded 120ms
       before the return — which is the baseline's shape, and it means the
       shrink and the recovery can never be tuned against each other. They are
       different halves of the gesture: the shrink should catch the movement
       immediately, and the recovery should take its time, or a card snaps back
       the instant you pause mid-drag. */
    minCardScale: 0.2,  // how small a card gets at full movement
    scaleLerp: 0.08,    // ...how fast it SHRINKS
    scaleBack: 0.08,    // ...and how fast it comes back when you let go
    scaleHold: 120,     // ms after the last event before it starts coming back
    skew: 0,            // degrees of lean at full movement
    squash: 0.22,          // ...and how much it flattens along the direction of travel

    /* ---- cursor magnetism ----
       Off by default so the resting field is the drawn one; turn it up and the
       nearest cards lean toward the pointer. */
    magnet: 0.52,
    magnetRadius: 320,
    magnetLerp: 0.08,

    /* ---- the focus state, Figma 14584:13346 ----
       DWELL, NOT CLICK. Rest on a card and after `dwellMs` every other card
       drops to `dimTo`. */
    dwellMs: 800,
    dimTo: 0.15,
    focusMs: 1500,
    focusScale: 1,      // Figma's held card does not grow; the others simply go

    /* ---- FISHEYE ----
       SEPARATE FROM `fov`, AND THE TWO DO DIFFERENT THINGS. fov is a
       displacement: it moves cards toward the middle and shrinks them, so the
       FIELD curves while every card stays a flat rectangle. This TURNS each
       card away from you in proportion to how far off centre it is, so the
       cards themselves are seen at an angle — which is the half of a fisheye
       the displacement cannot give you.

       It is a rotation and not a warp because a DOM image cannot be bent: no
       filter takes a rectangle to a curved quad. A turn about the vertical and
       horizontal axes, under a short perspective, is what a real barrel does to
       a flat card in the corner of frame, and it is exact rather than an
       approximation of it. */
    fisheye: 0,         // degrees a card at the screen edge turns away
    fisheyePersp: 200,  // the lens length that turn is seen through · short is violent

    /* ---- HOW ROUNDED THE CARDS ARE WHILE MOVING ----
       Two ends of one number, and it is the corners that carry it: a card at
       rest is a hard rectangle, and one being thrown across the screen rounds
       off, the way a fast object reads as a blur with no corners at all. */
    radius: 0,          // px at rest
    radiusMove: 200,      // ...and at full movement

    /* ---- COLOUR BY DISTANCE FROM THE MIDDLE ----
       What you are looking at is in colour and the edge of vision is not, which
       is roughly what your own eye does — cones in the middle, rods at the
       edges. Measured from the CARD's distance to the centre of the viewport,
       not from its place in the grid, so the colour belongs to where a card IS
       rather than to which card it is: drag, and a photograph gains its colour
       as it comes in and loses it as it leaves. */
    colourMid: 0,       // grayscale in the middle · 0 is the photograph's own colour
    colourEdge: 1,      // ...and out at the edges · 1 is fully monochrome
    colourAt: 0,      // px from centre within which a card is fully itself
    colourGone: 1500,    // ...and beyond which it has lost its colour entirely
    colourPow: 1.4,     // the curve between them · >1 holds the colour longer

    contrast: 1,

    /* ---- THE CONTAINER'S OWN COLOUR ----
       Figma's is #393939, the site's one furniture colour. A picker rather than
       a list, because a ground colour is not a menu of five. */
    plateColour: '#171717',

  };

  /* ---- state --------------------------------------------------------------- */
  const on = window.PAGE.bindings();
  let cells = [], cols = 0, rows = 0;
  let raf = 0, alive = true, last = performance.now();
  const pos = { x: 0, y: 0, tx: 0, ty: 0, startX: 0, startY: 0 };
  const scl = { now: 1, want: 1 };
  const zm  = { now: 0, want: 1 };   // seeded from CONFIG on the first frame
  let moving = 0;
  /* The plate's own filter chain, without the aberration — everything in it is
     constant between apply() calls, so it is built there rather than thirty
     times a frame. Empty means the plates get no filter, which is the point:
     see the note in frame(). */
  let chain = '';
  function buildChain(){
    const parts = [];
    if (Math.abs(CONFIG.contrast - 1) > 0.001) parts.push(`contrast(${CONFIG.contrast})`);
    /* js/crt.js writes --crt-grade on the root and this reads it back, so
       neither file has to know about the other. Read ONCE per apply: a
       getComputedStyle per card per frame would cost more than the filter it
       is trying to avoid. */
    const grade = getComputedStyle(root).getPropertyValue('--crt-grade').trim();
    if (grade) parts.push('var(--crt-grade,)');
    chain = parts.join(' ');
  }
  let px = -1e9, py = -1e9, hasPointer = false;
  let dragging = false, dragId = -1, lastX = 0, lastY = 0;
  let dwellAt = 0, dwellCell = -1, focusCell = -1;
  let scrollTimer = 0, scaleTimer = 0, rt = 0, rebuildAt = 0;
  let offR = null, offB = null;      // the aberration filter's two feOffsets
  let lastRadius = -1, aberrOn = false, pinned = 0;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const wrap = (v, n) => ((v % n) + n) % n;

  /* ==========================================================================
     THE QUAD WARP — what makes the field bend like a lens.

     THE OBSERVATION THAT SETTLES THE TECHNIQUE: on the reference, every tile is
     a straight-edged TRAPEZOID. No single card is bent; the curve is what the
     whole field does. So the job is not to warp a picture — which CSS cannot do
     to a DOM element at all — but to move each card's FOUR CORNERS
     independently and let it become a quad.

     A rectangle taken to an arbitrary quad is a projective transform, and
     matrix3d is a full 4x4 projective matrix, so this is exact rather than an
     approximation. The closed form below maps the unit square to p0..p3; the
     two w-column terms (g and h) are the whole difference between this and an
     affine transform, and they are what makes the far edge of a card genuinely
     shorter than the near one.

     Returns null when the quad has collapsed — a degenerate solve produces
     NaNs, and a NaN in a transform silently removes the element rather than
     throwing, which is the sort of failure that looks like a missing card. */
  function quadMatrix(p0, p1, p2, p3, w, h){
    const dx1 = p1[0] - p2[0], dy1 = p1[1] - p2[1];
    const dx2 = p3[0] - p2[0], dy2 = p3[1] - p2[1];
    const sx  = p0[0] - p1[0] + p2[0] - p3[0];
    const sy  = p0[1] - p1[1] + p2[1] - p3[1];
    const den = dx1 * dy2 - dx2 * dy1;
    if (!den || !isFinite(den)) return null;

    const g = (sx * dy2 - dx2 * sy) / den;
    const hh = (dx1 * sy - sx * dy1) / den;
    const a = p1[0] - p0[0] + g * p1[0];
    const b = p3[0] - p0[0] + hh * p3[0];
    const c = p0[0];
    const d = p1[1] - p0[1] + g * p1[1];
    const e = p3[1] - p0[1] + hh * p3[1];
    const f = p0[1];
    if (!isFinite(a + b + d + e)) return null;

    /* Column-major, and pre-divided by the element's own size so the matrix
       takes LOCAL px rather than the unit square — the element is laid out at
       Figma's dimensions and transform-origin is its top-left corner. */
    return 'matrix3d(' + [
      a / w, d / w, 0, g / w,
      b / h, e / h, 0, hh / h,
      0, 0, 1, 0,
      c, f, 0, 1,
    ].map(v => v.toFixed(6)).join(',') + ')';
  }

  /* ---- the aberration filter ----------------------------------------------
     ONE FILTER FOR THE WHOLE FIELD, its offsets rewritten per frame. Thirty
     cards each with their own <filter> would be thirty filter graphs describing
     one number.

     WHY A FILTER AND NOT THE USUAL CSS TRICK: the common approximation is two
     tinted copies of the image offset behind it, which is additive and washes
     the picture out. This isolates the actual channels with feColorMatrix,
     moves R one way and B the other, and screens them back — so black stays
     black and only edges fringe, which is what a lens does. */
  function makeFilter(){
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'wgrid__defs');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    const f = document.createElementNS(NS, 'filter');
    f.setAttribute('id', 'wgridAberr');
    f.setAttribute('x', '-10%'); f.setAttribute('y', '-10%');
    f.setAttribute('width', '120%'); f.setAttribute('height', '120%');
    f.setAttribute('color-interpolation-filters', 'sRGB');

    const mat = (values, result) => {
      const m = document.createElementNS(NS, 'feColorMatrix');
      m.setAttribute('in', 'SourceGraphic');
      m.setAttribute('type', 'matrix');
      m.setAttribute('values', values);
      m.setAttribute('result', result);
      return m;
    };
    const off = (input, result) => {
      const o = document.createElementNS(NS, 'feOffset');
      o.setAttribute('in', input); o.setAttribute('result', result);
      o.setAttribute('dx', '0'); o.setAttribute('dy', '0');
      return o;
    };
    const blend = (a, bIn, result) => {
      const x = document.createElementNS(NS, 'feBlend');
      x.setAttribute('in', a); x.setAttribute('in2', bIn);
      x.setAttribute('mode', 'screen');
      if (result) x.setAttribute('result', result);
      return x;
    };

    f.appendChild(mat('1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0', 'r'));
    f.appendChild(mat('0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0', 'g'));
    f.appendChild(mat('0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0', 'b'));
    offR = off('r', 'ro'); f.appendChild(offR);
    offB = off('b', 'bo'); f.appendChild(offB);
    f.appendChild(blend('ro', 'g', 'rg'));
    f.appendChild(blend('rg', 'bo'));

    svg.appendChild(f);
    root.appendChild(svg);
  }

  /* ---- the DOM cell -------------------------------------------------------- */
  function makeCell(p){
    const el = document.createElement('div');
    el.className = 'wgrid__cell';
    el.innerHTML =
      /* ONE WRAPPER THAT THE FRAME LOOP NEVER TOUCHES. Everything else in a
         cell already has a property written to it sixty times a second — the
         cell its transform and opacity, the plate its filter and transform,
         the images their own transform — so the arrival in js/work-arrive.js
         had nowhere to animate that would not be overwritten on the next
         frame. This div exists only to be that surface. It is laid out to the
         exact box of the plate inside it, so it changes nothing on its own. */
      '<div class="wgrid__arrive">' +
      '<div class="wgrid__plate">' +
        '<img alt="" loading="lazy" decoding="async">' +
        /* THE SAME PICTURE AGAIN, PERMANENTLY GREY. See the note beside the
           colour ramp in frame(): the greyness is a cross-fade between these
           two now, not a filter whose value changes. */
        '<img class="wgrid__grey" aria-hidden="true" alt="" loading="lazy" decoding="async">' +
      '</div>' +
      '</div>' +
      '<i class="wgrid__tick wgrid__tick--tl"></i>' +
      '<i class="wgrid__tick wgrid__tick--tr"></i>' +
      '<i class="wgrid__tick wgrid__tick--bl"></i>' +
      '<i class="wgrid__tick wgrid__tick--br"></i>' +
      '<div class="wgrid__meta"><b></b><b></b></div>';
    el.querySelectorAll('img').forEach(i => { i.src = p.img; });
    const meta = el.querySelector('.wgrid__meta');
    meta.children[0].textContent = p.year + ' //';
    meta.children[1].textContent = '// ' + p.n;
    return el;
  }

  /* ==========================================================================
     THE ARRANGEMENTS.

     Each returns what one cell should do: an offset from its slot, a scale, and
     a travel speed. Nothing else in the module knows which layout is running —
     that is the whole point of the shape. `amount` fades any of them back to
     the ruled grid, so every one of these is a continuum and not a switch.

     `rnd` is a hash of the cell's own coordinates, not Math.random: the field
     is rebuilt on every resize and on every size change, and a layout that
     re-rolls its chance each time would reshuffle itself while you drag the
     window. Same cell, same seed, same answer, forever.
     ========================================================================== */
  function rnd(col, row, salt){
    const n = Math.sin((col * 127.1 + row * 311.7 + salt * 74.7 +
                        CONFIG.layoutSeed * 43.3)) * 43758.5453;
    return n - Math.floor(n);
  }

  const LAYOUTS = {
    /* Figma 14584:12146, and the default. Even rows, even columns, every card
       the same size — the thing the design was drawn as. */
    grid: () => ({ ox: 0, oy: 0, k: 1, ySpeed: 1 }),

    /* RUNNING BOND, the way bricks are laid: every other row shifted half a
       pitch. The cheapest way to stop a grid reading as a spreadsheet, because
       it breaks the vertical rules without touching the horizontal ones — you
       still get clean rows to read along. */
    brick: (col, row, g, a) => ({
      ox: (row % 2) * g.cw * 0.5 * a, oy: 0, k: 1, ySpeed: 1,
    }),

    /* THE BASELINE'S OWN. Columns staggered vertically and every third one
       travelling slower, so the field has parallax depth before any of the 3D
       is switched on. This is what the reference looks like, kept whole and put
       behind a name rather than left as two loose numbers. */
    masonry: (col, row, g, a) => ({
      ox: 0,
      oy: (col - g.cx) * g.ch * 0.33 * a,
      k: 1,
      ySpeed: 1 + ((col % 3 === 2) ? -0.1 * a : 0),
    }),

    /* A SLANT. Each column sits a little lower than the one before it, so the
       whole field runs on a diagonal and dragging sideways also carries you
       down.

       THE DROP IS AN EXACT NUMBER OF CELLS ACROSS THE FIELD, which is the only
       reason this tiles: the total fall over all the columns has to be a whole
       multiple of the row pitch, or the slant meets itself misaligned at the
       wrap and there is a visible step running down the screen. */
    diagonal: (col, row, g, a) => ({
      ox: 0,
      oy: col * g.ch * (Math.round(CONFIG.layoutDrop) / Math.max(1, g.cols)) * a,
      k: 1, ySpeed: 1,
    }),

    /* THE GRID, SHAKEN. Every card keeps its slot and is nudged within it —
       so the field still reads as ordered at a glance and never as a queue.
       Capped at 0.35 of a pitch: past that neighbours start colliding, and a
       scatter that overlaps is a pile, not a scatter. */
    scatter: (col, row, g, a) => ({
      ox: (rnd(col, row, 1) - 0.5) * g.cw * 0.7 * a,
      oy: (rnd(col, row, 2) - 0.5) * g.ch * 0.7 * a,
      k: 1, ySpeed: 1,
    }),

    /* EDITORIAL. Every third card or so is dealt small and sits in the middle
       of its own slot, so the field has a rhythm of large and small without any
       of them moving off the lattice. The pitch never changes — only what fills
       it — which is what keeps it wrappable and what stops the small ones
       leaving holes in the reading order. */
    mixed: (col, row, g, a) => {
      const small = rnd(col, row, 3) < 0.34;
      return {
        ox: (rnd(col, row, 4) - 0.5) * g.cw * 0.10 * a,
        oy: (rnd(col, row, 5) - 0.5) * g.ch * 0.10 * a,
        k: small ? 1 + (CONFIG.smallCard - 1) * a : 1,
        ySpeed: 1,
      };
    },
  };

  /* WHICH PHOTOGRAPH GOES WHERE — and the ONLY thing that matters here is that
     every project can actually be reached.

     It used to step the row by a number chosen to be coprime with the list, on
     the reasoning that walking the list in strides keeps neighbours apart. It
     does, and it is also not onto: with 30 projects on a 5x5 field the stride
     of 4 reaches 21 of them and the last NINE could never appear on the page at
     any scroll position, because the field is a torus of fixed cells and each
     cell is bound to one project forever. Adding photographs simply did
     nothing, silently.

     Reading the grid in order is a bijection whenever there are at least as
     many cells as projects — which build() now guarantees — and neighbours
     still differ, by 1 across and by `cols` down. Plainer, and correct. */
  function pick(col, row, cols){
    return PROJECTS[wrap(row * cols + col, PROJECTS.length)];
  }

  /* HOW BIG THE FIELD HAS TO BE, in one place.

     THIS IS THE SECOND BUG IN THIS MODULE CAUSED BY TWO PLACES COMPUTING ONE
     QUANTITY. The first was build() laying out at `size` while the frame loop
     wrapped at `size x zoom`. The second was this: build() raised `rows` to fit
     every project, the frame loop's rebuild check did not, so the two never
     agreed, the check fired on every frame and the field was torn down and
     rebuilt eleven times a second — which reads as the page seizing up, because
     the images restart and nothing ever settles.

     Neither was a hard thing to get right. Both were a duplicated formula, so
     the formula lives here now and there is nothing left to drift. */
  function gridSize(cw, ch){
    const cols = Math.max(1, Math.ceil(root.clientWidth  / cw) + CONFIG.overscan * 2);
    return {
      cols,
      rows: Math.max(1,
        Math.ceil(root.clientHeight / ch) + CONFIG.overscan * 2,
        /* at least enough cells to reach every project — see pick() */
        Math.ceil(PROJECTS.length / cols)),
    };
  }

  function build(){
    /* The live scale, zoom included — build and the frame loop have to agree
       about how big a cell is or the field is laid out for one and wrapped for
       another. */
    const S = Math.max(0.2, CONFIG.size) * (zm.now || CONFIG.zoom || 1);
    const cw = (CONFIG.cardW + CONFIG.gutterX) * S;
    const ch = (CONFIG.cardH + CONFIG.gutterY) * S;

    /* AT LEAST ENOUGH CELLS TO REACH EVERY PROJECT — the field is a fixed
       cols x rows torus and each cell keeps its project for life, so a field
       with fewer cells than projects can never show the remainder however far
       you drag. gridSize() owns that clause; see the note there. */
    ({ cols, rows } = gridSize(cw, ch));

    world.textContent = '';
    cells = [];
    const frag = document.createDocumentFragment();
    const cx = Math.floor(cols / 2), cy = Math.floor(rows / 2);
    const geom = { cw, ch, cols, rows, cx, cy };

    for (let row = 0; row < rows; row++){
      for (let col = 0; col < cols; col++){
        const p = pick(col, row, cols);
        const el = makeCell(p);
        frag.appendChild(el);
        /* THE ARRANGEMENT, asked once per cell at build time. It is a
           property of the cell's slot, not of where the camera is, so it has
           no business being recomputed sixty times a second. */
        const L = (LAYOUTS[CONFIG.layout] || LAYOUTS.grid)(
          col, row, geom, Math.max(0, Math.min(1, CONFIG.layoutAmount)));

        cells.push({
          el, plate: el.querySelector('.wgrid__plate'),
          img: el.querySelector('img'),
          grey: el.querySelector('.wgrid__grey'),
          /* `g` caches the grey level, `f` the plate's filter string — two
             separate caches because they change for different reasons and at
             different rates. */
          g: -1, f: null,
          n: p.n, col, row,
          /* ---- STORED IN CELL UNITS, NOT PIXELS, and this is the fix for a
             real bug rather than a tidy-up.

             build() ran at `size` and the frame loop runs at `size x zoom`, so
             a position baked here in pixels was laid out at one scale and
             WRAPPED at another: the cards stepped `cw` apart while the field
             repeated every `cols x cw x zoom`. At zoom 1 the two agree and it
             looks perfect; at anything else the spacing and the repeat pull
             apart — gaps at zoom above 1, overlaps below it — which is exactly
             the layout changing as you zoom.

             Held as cell units and multiplied by the LIVE pitch every frame,
             the arrangement is scale-invariant: zoom moves the camera back and
             nothing about the layout moves at all. */
          gx: col + L.ox / cw,
          gy: row + L.oy / ch,
          sy: (col - cx) * CONFIG.startOffsetY,   // the stagger, also in cells
          k: L.k,
          /* The two loose baseline numbers still apply ON TOP of the chosen
             arrangement, so the masonry preset and the hand-set stagger are not
             fighting over the same cell — they add. */
          ySpeed: L.ySpeed * ((col % 3 === 2) ? CONFIG.colSpeedB : 1),
          x: 0, y: 0, mx: 0, my: 0, a: 1, s: 1, lens: 1, lx: 0, ly: 0,
          g: null, pdx: 1e9, pdy: 1e9,
        });
      }
    }
    world.appendChild(frag);

    pos.startX = root.clientWidth  * 0.5 - cx * cw - cw * 0.5;
    pos.startY = root.clientHeight * 0.5 - cy * ch - ch * 0.5;
    pos.x = pos.tx = pos.startX;
    pos.y = pos.ty = pos.startY;
    applyStatic();
  }

  /* Everything that is constant until a dial moves. Written to the ROOT so one
     declaration reaches every card, rather than thirty inline styles all
     carrying the same string. */
  function applyStatic(){
    /* The plate's constant filter chain, rebuilt here because everything in it
       is a dial rather than a per-frame quantity. Also clears every cached
       string so the next frame writes the new chain. */
    buildChain();
    cells.forEach(c => { c.f = null; });
    root.style.setProperty('--focus-ms', CONFIG.focusMs + 'ms');
    root.style.setProperty('--plate-bg', CONFIG.plateColour);
    root.style.setProperty('--inset', Math.max(0, CONFIG.inset) + 'px');
    /* The crop is a transform rather than a width, so it scales about the
       window's own centre and the plate's overflow does the clipping — a width
       change would move the picture's top-left and re-crop from a corner. */
    root.style.setProperty('--img-zoom', String(Math.max(0.2, CONFIG.imageZoom)));
    root.style.setProperty('--img-fit', CONFIG.imageFit === 'contain' ? 'contain' : 'cover');
  }

  /* ---- input ---------------------------------------------------------------
     THE THIRD OF THE THREE THINGS THAT STOP THE BROWSER TAKING THE GESTURE.
     touch-action and overscroll-behavior are in css/work-grid.css; this is the
     one CSS cannot do — a NON-PASSIVE wheel listener that preventDefaults.
     Chrome treats a wheel listener as passive by default on a scrollable root,
     and a passive listener cannot preventDefault: the two-finger swipe still
     navigates back, silently, and only on a trackpad. */
  function move(dx, dy, isWheel){
    const speed = isWheel ? CONFIG.wheelSpeed : CONFIG.dragSpeed;
    const cdx = clamp(dx * speed, -CONFIG.maxDelta, CONFIG.maxDelta);
    const cdy = clamp(dy * speed, -CONFIG.maxDelta, CONFIG.maxDelta);
    /* The wheel pushes the field the other way and a drag carries it with you.
       The reference inverts exactly one of the two, and getting this wrong is a
       page that feels right on a mouse and backwards on a trackpad. */
    const mx = isWheel ? -cdx : cdx;
    const my = isWheel ? -cdy : cdy;

    const strength = clamp(Math.max(Math.abs(cdx), Math.abs(cdy)) / CONFIG.maxDelta, 0, 1);
    scl.want = 1 + (CONFIG.minCardScale - 1) * strength;

    clearTimeout(scaleTimer);
    scaleTimer = setTimeout(() => { scl.want = 1; }, Math.max(0, CONFIG.scaleHold));
    if (isWheel){
      root.classList.add('is-scrolling');
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => root.classList.remove('is-scrolling'), 200);
    }

    pos.tx += mx;
    /* A HORIZONTAL DRAG BLEEDS INTO VERTICAL — the baseline's xToYInfluence,
       and most of why the field reads as a surface rather than two scrollbars. */
    pos.ty += my + mx * CONFIG.xToYInfluence;
    dwellAt = 0; dwellCell = -1;   // you cannot rest on a card you are dragging past
  }

  on(root, 'wheel', e => {
    if (!CONFIG.enabled) return;
    e.preventDefault();
    /* Pinch on a trackpad arrives as a wheel event with ctrlKey set — the only
       way the platform exposes it. */
    /* A PINCH ARRIVES AS A CTRL-WHEEL — the only way the platform exposes it.
       With the gesture off it is swallowed rather than passed on to the pan,
       because a pinch is not a scroll and turning one into the other would send
       the field flying whenever someone spread two fingers. */
    if (e.ctrlKey){
      if (!CONFIG.zoomGesture) return;
      /* THE PINCH WRITES THE CONFIG, not the eased value. It used to set
         `zm.want` directly, which meant the gesture and the dial were two
         separate truths about one number — and since nothing ever read
         CONFIG.zoom, the dial did nothing at all while the gesture worked.
         One source: the pinch moves the config, the frame loop eases toward it,
         and both the slider and the trackpad are moving the same thing. */
      CONFIG.zoom = clamp(CONFIG.zoom - e.deltaY * CONFIG.zoomSpeed * 10,
                          CONFIG.zoomMin, CONFIG.zoomMax);
      return;
    }
    move(e.deltaX, e.deltaY, true);
  }, { passive: false });

  on(root, 'pointerdown', e => {
    if (!CONFIG.enabled || dragging) return;
    dragging = true; dragId = e.pointerId;
    lastX = e.clientX; lastY = e.clientY;
    root.classList.add('is-dragging');
    try { root.setPointerCapture(e.pointerId); } catch (err){}
  });
  on(root, 'pointermove', e => {
    px = e.clientX; py = e.clientY; hasPointer = true;
    if (!dragging || e.pointerId !== dragId) return;
    move(e.clientX - lastX, e.clientY - lastY, false);
    lastX = e.clientX; lastY = e.clientY;
  });
  const release = e => {
    if (!dragging || (e && e.pointerId !== dragId)) return;
    dragging = false; dragId = -1;
    root.classList.remove('is-dragging');
  };
  on(root, 'pointerup', release);
  on(root, 'pointercancel', release);
  on(window, 'blur', () => release(null));
  on(root, 'pointerleave', () => { hasPointer = false; px = py = -1e9; });
  on(window, 'resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });

  /* ==========================================================================
     THE FRAME
     ========================================================================== */
  function frame(now){
    if (!alive) return;
    const dt = Math.min((now - last) / 1000, 0.1); last = now;
    if (!CONFIG.enabled){ raf = requestAnimationFrame(frame); return; }

    /* The baseline's lerps, run against real elapsed time rather than a fixed
       step — the same settling on any refresh rate, which is the rule the rest
       of this site's scrolls follow. */
    const k = 1 - Math.pow(1 - CONFIG.positionLerp, dt * 60);
    pos.x += (pos.tx - pos.x) * k;
    pos.y += (pos.ty - pos.y) * k;
    /* Two rates, picked by which way it is going: shrinking uses scaleLerp,
       recovering uses scaleBack. */
    const sRate = scl.want < scl.now ? CONFIG.scaleLerp : CONFIG.scaleBack;
    scl.now += (scl.want - scl.now) * (1 - Math.pow(1 - Math.max(0.001, sRate), dt * 60));
    /* The config IS the target. Typing a number in the panel and pinching the
       trackpad now do the same thing, and the ease belongs to the render rather
       than to the input. */
    zm.want = Math.max(0.05, CONFIG.zoom);
    zm.now  += (zm.want - zm.now) * (1 - Math.pow(1 - CONFIG.zoomLerp, dt * 60));

    /* HOW HARD THE FIELD IS MOVING, measured from the gap the lerp has left to
       close rather than from the last event. An event-driven number snaps to
       zero the moment you let go, and the distortion then vanishes while the
       field is still visibly gliding; this one decays with the motion. */
    const gap = Math.hypot(pos.tx - pos.x, pos.ty - pos.y);
    moving = clamp(gap / 120, 0, 1);
    const dirX = gap > 0.01 ? (pos.tx - pos.x) / gap : 0;
    const dirY = gap > 0.01 ? (pos.ty - pos.y) / gap : 0;

    /* HOW ROUNDED THE CARDS ARE, once for the whole field. It is the same
       number on every card — movement is global — so it goes on the root as a
       variable rather than thirty identical inline writes, and only when it has
       actually moved half a pixel. */
    const wantR = CONFIG.radius + (CONFIG.radiusMove - CONFIG.radius) * moving;
    if (Math.abs(wantR - lastRadius) > 0.5){
      lastRadius = wantR;
      root.style.setProperty('--card-radius', wantR.toFixed(1) + 'px');
    }

    /* The aberration, written once for the whole field. */
    if (offR){
      const a = CONFIG.aberration + CONFIG.aberrationMove * moving;
      const ax = a * (gap > 0.01 ? dirX : 1), ay = a * dirY;
      offR.setAttribute('dx', ax.toFixed(2));
      offR.setAttribute('dy', ay.toFixed(2));
      offB.setAttribute('dx', (-ax).toFixed(2));
      offB.setAttribute('dy', (-ay).toFixed(2));
      aberrOn = a > 0.02;
    }

    const S = Math.max(0.2, CONFIG.size) * zm.now;
    const cw = (CONFIG.cardW + CONFIG.gutterX) * S;
    const ch = (CONFIG.cardH + CONFIG.gutterY) * S;

    /* PULLING BACK HAS TO REVEAL MORE CARDS, not the same ones again. The field
       is a fixed cols x rows tiled by the wrap, so zooming out without growing
       it shrinks the tile below the viewport and you see the same handful
       repeating two or three times across the screen — which reads as the page
       running out of work. Rebuilt when the count the viewport needs actually
       changes, which is a handful of times across the whole zoom range rather
       than every frame. */
    const need = gridSize(cw, ch);
    if ((need.cols !== cols || need.rows !== rows) && !rebuildAt){
      rebuildAt = setTimeout(() => { rebuildAt = 0; build(); }, 90);
    }

    const tw = cols * cw, th = rows * ch;
    const offX = cw * CONFIG.overscan, offY = ch * CONFIG.overscan;
    const scrollY = pos.y - pos.startY;
    const halfW = root.clientWidth * 0.5, halfH = root.clientHeight * 0.5;
    const tanF = CONFIG.fov <= 0.01 ? 0 : Math.tan(CONFIG.fov * Math.PI / 360) * 0.55;
    /* ONE LENS, called for centres in pass 1 and for corners in pass 2. Written
       once so the two can never drift — a card whose middle is displaced by one
       rule and whose corners by another is a card that tears. */
    const lensPt = (x, y) => {
      if (tanF === 0) return [x, y];
      const ax = (x - halfW) / halfW, ay = (y - halfH) / halfH;
      const k2 = 1 / (1 + tanF * (ax * ax + ay * ay));
      return [halfW + (x - halfW) * k2, halfH + (y - halfH) * k2];
    };

    /* ---- PASS 1: where every card is ---------------------------------------
       Geometry only, no styles written. Split from the writing pass because the
       DWELL TEST NEEDS THE FINAL BOX — the first version tested the pointer
       against the card's unlensed corner, which is not where the card is drawn
       once the FOV is anything but zero, and the focus simply never fired. */
    for (let i = 0; i < cells.length; i++){
      const c = cells[i];
      /* The pitch is the live one, so the layout holds its shape at any zoom. */
      c.x = wrap(c.gx * cw + pos.x + offX, tw) - offX;
      c.y = wrap(c.gy * ch + pos.startY + c.sy * ch + scrollY * c.ySpeed + offY, th) - offY;

      /* CURSOR MAGNETISM. A pull toward the pointer that falls off with
         distance and is capped by the pull factor, so a card leans and never
         chases — a card that reached the cursor could never be pointed at,
         because it would move out from under every approach. */
      let wx = 0, wy = 0;
      if (hasPointer && CONFIG.magnet > 0){
        const mcx = c.x + CONFIG.cardW * S * 0.5 * c.k;
        const mcy = c.y + CONFIG.plateH * S * 0.5 * c.k;
        const dx = px - mcx, dy = py - mcy;
        const dist = Math.hypot(dx, dy);
        const R = CONFIG.magnetRadius * S;
        if (dist < R && dist > 0.001){
          const fall = 1 - dist / R;
          const pull = CONFIG.magnet * fall * fall;
          wx = dx * pull; wy = dy * pull;
        }
      }
      const km = 1 - Math.pow(1 - CONFIG.magnetLerp, dt * 60);
      c.mx += (wx - c.mx) * km;
      c.my += (wy - c.my) * km;

      /* THE LENS. A radial displacement of the card's centre and size — the
         card stays a rectangle and the FIELD curves, measured from the
         viewport's centre in half-widths so the curve is the same shape on any
         screen. At fov 0 this is exactly 1 and the grid is Figma's. */
      const ccx = c.x + c.mx + CONFIG.cardW * S * 0.5 * c.k;
      const ccy = c.y + c.my + CONFIG.plateH * S * 0.5 * c.k;
      const nx = (ccx - halfW) / halfW, ny = (ccy - halfH) / halfH;
      c.lens = tanF === 0 ? 1 : 1 / (1 + tanF * (nx * nx + ny * ny));
      c.lx = halfW + (ccx - halfW) * c.lens;
      c.ly = halfH + (ccy - halfH) * c.lens;
      c.cx0 = ccx; c.cy0 = ccy;   // the unlensed centre, for the corner solve
    }

    /* ---- the dwell, against the boxes pass 1 just settled -------------------
       Arithmetic rather than a DOM hit test: the cells are pointer-events:none —
       they have to be, or the pictures would swallow the drag — so there is
       nothing for the browser to hit-test. */
    let over = -1;
    if (hasPointer && !dragging){
      let bestD = Infinity;
      for (let i = 0; i < cells.length; i++){
        const c = cells[i];
        const hw = CONFIG.cardW * 0.5 * S * c.s * c.lens * c.k;
        const hh = CONFIG.plateH * 0.5 * S * c.s * c.lens * c.k;
        const dx = Math.abs(px - c.lx), dy = Math.abs(py - c.ly);
        if (dx <= hw && dy <= hh){
          /* NEAREST CENTRE WINS, not first found: with magnetism on, two cards
             can overlap the pointer, and taking the first in DOM order makes
             the focus flick between them as they lean. */
          const d2 = dx * dx + dy * dy;
          if (d2 < bestD){ bestD = d2; over = i; }
        }
      }
    }
    if (over !== dwellCell){ dwellCell = over; dwellAt = over >= 0 ? now : 0; }
    const held = (dwellCell >= 0 && dwellAt && now - dwellAt >= CONFIG.dwellMs)
      ? dwellCell : -1;
    if (held !== focusCell){
      if (focusCell >= 0 && cells[focusCell]) cells[focusCell].el.classList.remove('is-focus');
      if (held >= 0 && cells[held]) cells[held].el.classList.add('is-focus');
      focusCell = held;
      root.classList.toggle('is-focused', held >= 0);
    }

    /* ---- PASS 2: write it ---------------------------------------------------
       TWO TRANSFORMS, ONE PER ELEMENT, never a third. The CELL carries where
       the card is and how big it is; the PLATE carries the distortion. Putting
       the distortion on the cell instead would skew the ticks and the microtype
       along with the picture, and 5px type through a skew is mud. */
    pinned = 0;
    const sk = CONFIG.skew * moving;
    const sq = CONFIG.squash * moving;
    const distorting = CONFIG.skew !== 0 || CONFIG.squash !== 0;

    for (let i = 0; i < cells.length; i++){
      const c = cells[i];
      const wantS = scl.now * (i === focusCell ? CONFIG.focusScale : 1);
      c.s += (wantS - c.s) * (1 - Math.pow(1 - 0.14, dt * 60));
      c.a = (focusCell < 0 || i === focusCell) ? 1 : CONFIG.dimTo;

      const baseScale = c.s * c.k * S / Math.max(0.2, CONFIG.size);
      const cellScale = baseScale * c.lens;

      /* THE FISHEYE. How far off centre the card is, as a share of a half
         screen, turned into a turn about the two axes. A card in the middle is
         square on; one at the left edge turns its left side away from you and
         one at the top tips its top back, which is what a barrel does to a flat
         card in the corner of frame.

         The perspective() has to come FIRST in the list or the rotations are
         orthographic and the card simply gets thinner — a rotation with no
         perspective in front of it is a scale with extra steps. */
      let turn = '';
      if (CONFIG.fisheye > 0.01){
        const ex = clamp((c.lx - halfW) / halfW, -1.4, 1.4);
        const ey = clamp((c.ly - halfH) / halfH, -1.4, 1.4);
        turn = ` perspective(${CONFIG.fisheyePersp}px)` +
               ` rotateY(${(ex * CONFIG.fisheye).toFixed(2)}deg)` +
               ` rotateX(${(-ey * CONFIG.fisheye).toFixed(2)}deg)`;
      }

      /* ---- THE CARD'S PLACEMENT --------------------------------------------
         TWO PATHS, and the cheap one is not a shortcut. With no lens the four
         corners land exactly where a translate and a scale would put them, and
         solving a projective transform to discover that is four lens
         evaluations and a 2x2 solve per card per frame to reproduce two
         numbers. With a lens, the corners genuinely differ and the quad is the
         only honest answer. */
      let placed = null;
      if (tanF !== 0){
        const W = CONFIG.cardW * baseScale, H = CONFIG.cardH * baseScale;
        /* The card's box BEFORE the lens: its plate centre sits at the
           unlensed centre, and the label strip hangs below it. */
        const tlx = c.cx0 - CONFIG.cardW * 0.5 * baseScale;
        const tly = c.cy0 - CONFIG.plateH * 0.5 * baseScale;
        placed = quadMatrix(
          lensPt(tlx,     tly),
          lensPt(tlx + W, tly),
          lensPt(tlx + W, tly + H),
          lensPt(tlx,     tly + H),
          CONFIG.cardW, CONFIG.cardH);
      }

      c.el.style.transform = placed
        ? placed + turn
        : `translate3d(${(c.lx - CONFIG.cardW * 0.5 * cellScale).toFixed(1)}px,` +
          `${(c.ly - CONFIG.plateH * 0.5 * cellScale).toFixed(1)}px,0)` +
          turn +
          ` scale(${cellScale.toFixed(4)})`;
      c.el.style.opacity = c.a.toFixed(3);

      /* ---- COLOUR BY DISTANCE FROM THE MIDDLE ------------------------------
         Off the card's real distance to the centre of the viewport, so the
         colour belongs to WHERE A CARD IS rather than to which card it is: drag
         and a photograph gains colour coming in and loses it going out.

         WRITTEN ONLY WHEN IT HAS MOVED A FIFTIETH, and that gate is doing real
         work — a filter change forces the browser to re-rasterise the whole
         element, and at thirty cards an unconditional write is thirty
         re-rasters a frame for a change nobody can see. Same economy the
         gallery's greyscale ramp makes. */
      const dCentre = Math.hypot(c.lx - halfW, c.ly - halfH);
      const t = clamp((dCentre - CONFIG.colourAt) /
                      Math.max(1, CONFIG.colourGone - CONFIG.colourAt), 0, 1);
      const gWant = CONFIG.colourMid +
        (CONFIG.colourEdge - CONFIG.colourMid) *
        Math.pow(t, Math.max(0.1, CONFIG.colourPow));
      const gr = Math.round(gWant * 100) / 100;

      /* IT IS A CROSS-FADE NOW, NOT A FILTER, and that is the single biggest
         performance decision on this page.

         It used to write `grayscale(gr)` onto each plate. A filter other than
         `none` puts the element on its own render surface, and when the value
         changes the surface has to be FILTERED AGAIN — so thirty plates, each
         475x311, were re-filtered every frame the field moved: about 4.4
         megapixels of filtering per frame, at whatever rate the screen asks
         for. Measured on the real machine: the work page ran at 50fps, and
         with the per-card filters switched off it ran at 120.

         Cross-fading two stacked copies costs none of that. The grey copy
         carries `filter: grayscale(1)` in the stylesheet — CONSTANT, so it is
         rasterised once and never again — and what changes per frame is
         `opacity`, which the compositor animates without touching the layer's
         pixels at all.

         The quantisation gets FINER as a result (1/100 rather than 1/50): the
         gate existed to keep re-rasters down, and there are none to keep down
         now, so the ramp can be smoother than it was. */
      if (gr !== c.g){
        c.g = gr;
        c.grey.style.opacity = gr;
      }

      /* WHAT IS LEFT ON THE PLATE ITSELF is only the things that genuinely
         cannot be a cross-fade: the contrast grade, the CRT's, and the
         aberration. All three are usually inert, and when they are, the plate
         is given NO FILTER AT ALL rather than an identity one — `contrast(1)`
         is not free, it still buys the element a render surface it does not
         need. `chain` is recomputed in apply(), not here. */
      const want = chain + (aberrOn ? ' url(#wgridAberr)' : '');
      if (want !== c.f){
        c.f = want;
        c.plate.style.filter = want;
      }

      /* ---- PARALLAX: the picture behind the window -------------------------
         Off the card's own offset from the middle of the screen, so the shift
         belongs to WHERE A CARD IS rather than to which card it is: drag, and a
         photograph slides one way as it crosses the middle and back as it
         leaves.

         CLAMPED TO THE SURPLUS the magnification leaves. The picture may travel
         exactly as far as it is oversized and not one pixel further, so a bare
         edge can never appear however the dials are set — and at imageZoom 1
         there is no surplus and this does nothing at all, which is the right
         answer rather than a broken one. */
      if (CONFIG.parallax !== 0 && c.img){
        const z = Math.max(0.2, CONFIG.imageZoom);
        const winW = Math.max(1, CONFIG.cardW - CONFIG.inset * 2);
        const winH = Math.max(1, CONFIG.plateH - CONFIG.inset * 2);
        const roomX = Math.max(0, (z - 1) * 0.5 * winW);
        const roomY = Math.max(0, (z - 1) * 0.5 * winH);

        const nx = CONFIG.parallaxAxis === 'y' ? 0 : clamp((c.lx - halfW) / halfW, -1, 1);
        const ny = CONFIG.parallaxAxis === 'x' ? 0 : clamp((c.ly - halfH) / halfH, -1, 1);
        /* The curve keeps its sign: raising a negative offset to a power would
           flip the direction on one side of the screen and tear the field in
           half down the middle. */
        const cv = Math.max(0.2, CONFIG.parallaxCurve);
        const px2 = Math.sign(nx) * Math.pow(Math.abs(nx), cv);
        const py2 = Math.sign(ny) * Math.pow(Math.abs(ny), cv);

        const dx = clamp(-px2 * CONFIG.parallax * winW * 0.5, -roomX, roomX);
        const dy = clamp(-py2 * CONFIG.parallax * winH * 0.5, -roomY, roomY);

        /* Written only when it has moved half a pixel — a transform change on
           thirty images every frame for a shift nobody can see is thirty
           needless composites. */
        if (Math.abs(Math.abs(dx) - roomX) < 0.6 ||
            Math.abs(Math.abs(dy) - roomY) < 0.6) pinned++;
        if (Math.abs(dx - c.pdx) > 0.5 || Math.abs(dy - c.pdy) > 0.5){
          c.pdx = dx; c.pdy = dy;
          const tf = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) scale(${z})`;
          c.img.style.transform = tf;
          /* THE GREY COPY MOVES WITH IT. Written from the same string rather
             than read back off the colour one — reading the sibling's style
             here would have handed it the PREVIOUS frame's value, and the two
             pictures would have slid a frame apart from each other under
             parallax, which reads as a soft double image. */
          if (c.grey) c.grey.style.transform = tf;
        }
      } else if (c.img && c.pdx !== 1e9){
        c.pdx = c.pdy = 1e9;
        c.img.style.transform = '';   // back to the stylesheet's plain scale
        if (c.grey) c.grey.style.transform = '';
      }

      if (distorting){
        c.plate.style.transform =
          `skew(${(sk * dirX).toFixed(2)}deg,${(sk * dirY).toFixed(2)}deg) ` +
          `scale(${(1 - sq * Math.abs(dirX)).toFixed(3)},` +
          `${(1 - sq * Math.abs(dirY)).toFixed(3)})`;
      } else if (c.plate.style.transform){
        c.plate.style.transform = '';
      }
    }

    raf = requestAnimationFrame(frame);
  }

  makeFilter();
  build();
  raf = requestAnimationFrame(frame);

  window.WORKGRID = {
    config: CONFIG,
    layouts: Object.keys(LAYOUTS),
    apply(){ applyStatic(); },
    rebuild(){ build(); },
    readout(){
      return {
        cells: cells.length + ` (${cols}x${rows})`,
        move: moving.toFixed(2),
        zoom: zm.now.toFixed(2),
        focus: focusCell >= 0 ? cells[focusCell].n : 'none',
        /* PINNED IS THE NUMBER THAT MATTERS. The travel is clamped to the
           surplus `imageZoom` leaves, and the two are related by one line:
           the shift wanted at the screen edge is parallax x window/2 and the
           room is (imageZoom - 1) x window/2, so anything above
           parallax = imageZoom - 1 simply pins. A pinned picture stops
           responding while its frame carries on moving, which reads as a
           dropped frame rather than as a setting. */
        parallax: CONFIG.parallax === 0 ? 'off'
          : `${pinned}/${cells.length} pinned` +
            (CONFIG.parallax > CONFIG.imageZoom - 1
              ? ` · try ${(CONFIG.imageZoom - 1).toFixed(2)} or raise imageZoom` : ''),
        dwell: dwellCell >= 0 ? ((performance.now() - dwellAt) / 1000).toFixed(1) + 's' : '-',
      };
    },
  };

  return function destroy(){
    alive = false;
    cancelAnimationFrame(raf);
    clearTimeout(rt); clearTimeout(scrollTimer); clearTimeout(scaleTimer);
    clearTimeout(rebuildAt);
    on.release();
    world.textContent = '';
    const defs = root.querySelector('.wgrid__defs');
    if (defs) defs.remove();
    offR = offB = null;
    if (window.WORKGRID && window.WORKGRID.config === CONFIG) delete window.WORKGRID;
  };
});
