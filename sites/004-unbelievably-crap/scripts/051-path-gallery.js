/* ==========================================================================
   path-gallery.js — a scroll-driven gallery on a closed 3D curve.

   THE TECHNIQUE, from the Codrops piece: a closed Catmull-Rom curve is the
   camera's track AND the images' spine. The camera rides it on scroll and looks
   a little way further along it, so bends steer the view rather than the view
   steering itself. The planes sit at their own points on the same curve, pushed
   off it sideways and in depth, and turned to its local frame — which is why
   they bank through a corner instead of sliding across it.

   AND THE MOVE THAT MAKES IT: a plane swells as the camera nears it, on a CUBIC
   falloff. Linear would inflate half the gallery at once; cubed, the magnifying
   is over almost as soon as it starts, so exactly one photograph is ever the
   subject and everything else is scenery.

   NO BLENDER, AND NO THREE.JS. The curve is generated here from a handful of
   control points, and the camera is a VIEW MATRIX written straight into
   matrix3d — the same trick the browser does for you in a 3D engine, done by
   hand because this site carries no engine and should not start now.

   CSS's axes, throughout: x right, y DOWN, z toward the viewer. Working in
   graphics convention and flipping at the end is how a scene ends up mirrored
   in one axis and nobody can see which.
   ========================================================================== */
window.PAGE.register('path-gallery', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'gallery') return;
  const root = scope.querySelector('.pathg');
  if (!root) return;
  const world = root.querySelector('.pathg__world');

  /* THE PICTURES ON THE TRACK. The list is the gallery — the path repeats it
     as many times as it has planes, so adding a name adds a photograph and
     nothing else has to be told.

     TWO FORMATS ON PURPOSE, and it is not untidiness. The first thirteen are
     the JPEGs this page shipped with; the fourteen after them are WebP, which
     on this exact set measured 21% SMALLER at a BETTER error than JPEG at a
     matched quality — the same result js/data.js records for the work page.
     Re-encoding the originals would be churn for a page about to be looked at,
     so the old ones stay as they are and the new ones arrive in the better
     format. Nothing here cares about the extension.

     SHIPPED AT 1500px ON THE LONG EDGE, WebP quality 88. 1500 is what
     js/lightbox.js needs: an opened picture reaches about 1119 CSS px on a
     laptop, which is 2238 device pixels on a retina screen, and its sharpness
     cap allows 1.5x of stretch — so 1492 is the file size that fills the frame
     without being shrunk. Seven of the fourteen came in SMALLER than that and
     were left alone rather than upscaled: no encoder adds detail, and the cap
     will simply show those a little smaller. */
  const SHOTS = [
    'basket-light.jpg', 'dayday.jpg', 'generator-foliage.jpg', 'generator-red.jpg',
    'iced-coffee.jpg', 'pingpong-net-tall.jpg', 'pingpong-net.jpg',
    'pingpong-paddle.jpg', 'plant-beam.jpg', 'shelf-plant.jpg', 'shelf-silhouette.jpg',
    'yellow-car.jpg',

    'cafe-counter.webp', 'cat-curtain.webp', 'cat-laptop.webp', 'cat-light.webp',
    'cat-sunbeam.webp', 'deckchair-park.webp', 'desk-cap.webp', 'dry-grass.webp',
    'field-dusk.webp', 'glass-case.webp', 'kitchen-night.webp', 'leaves-dark.webp',
    'shelf-corner.webp', 'stage-lights.webp',
  ];

  /* ---- TWO SIZES OF EVERY PICTURE, AND THIS IS THE FLICKER FIX -------------
     THE FIELD LOADS THE SMALL ONE. A plane on this track is about 280 CSS px
     across — 560 device pixels on a retina screen — and it was being rasterised
     from a file up to 1500px wide. The browser does not decode-and-scale once
     and keep it: every time a plane's scale crosses a step it re-rasterises
     from the ORIGINAL bitmap, and at 320 planes with the swell running there
     are dozens of those a frame. Miss the deadline and the compositor shows the
     tile it has, which is nothing — the plane blinks out for one frame. That is
     the flicker, it is what css/path-gallery.css already describes at its head,
     and the fourteen new photographs made it worse because they are the big
     ones: the first thirteen are 269–665px and were always cheap. Which is also
     why the new ones were the hardest to SEE — they are on the track, they were
     simply the planes most often caught mid-raster.

     640px on the long edge, WebP q82. Twice a plane's device width, so the
     swell has room before anything softens, and the whole set is 0.46 MB
     against 1.83 — a quarter of the work per raster.

     THE LIGHTBOX STILL OPENS THE BIG ONE. Every <img> carries the full file's
     path and its dimensions on itself, and js/lightbox.js reads `data-full` in
     preference to the src — so an opened picture is the 1500px file at full
     sharpness while the field it came out of never touches it. The dimensions
     have to travel with it: that file sizes the frame from the FILE's width so
     it never stretches a picture past 1.5x, and measuring the thumbnail would
     shrink the frame to fit a file the page is not going to show.

     THE THUMBNAIL IS ALWAYS .webp, whatever the original is. Nothing here is
     hand-kept: add a name to SHOTS above, encode it into assets/gallery/thumb/
     at 640px, add its full size below, and both halves follow. */
  const FULL = {
    'basket-light.jpg': [269, 360],
    'dayday.jpg': [496, 665],
    'generator-foliage.jpg': [269, 360],
    'generator-red.jpg': [665, 891],
    'iced-coffee.jpg': [360, 482],
    'pingpong-net-tall.jpg': [360, 482],
    'pingpong-net.jpg': [269, 360],
    'pingpong-paddle.jpg': [269, 360],
    'plant-beam.jpg': [360, 482],
    'shelf-plant.jpg': [496, 665],
    'shelf-silhouette.jpg': [360, 482],
    'yellow-car.jpg': [360, 482],
    'cafe-counter.webp': [665, 1182],
    'cat-curtain.webp': [844, 1500],
    'cat-laptop.webp': [1182, 665],
    'cat-light.webp': [1086, 724],
    'cat-sunbeam.webp': [1500, 843],
    'deckchair-park.webp': [638, 360],
    'desk-cap.webp': [1500, 1000],
    'dry-grass.webp': [1500, 843],
    'field-dusk.webp': [640, 359],
    'glass-case.webp': [360, 638],
    'kitchen-night.webp': [1500, 1000],
    'leaves-dark.webp': [844, 1500],
    'shelf-corner.webp': [360, 638],
    'stage-lights.webp': [1500, 1000],
  };
  const thumbOf = n => 'assets/gallery/thumb/' + n.replace(/\.[a-z0-9]+$/i, '.webp');

  /* The shapes the track can be. Each returns control points the closed spline
     runs through — the Blender export's job, done as a formula so it can be
     changed from a dial rather than re-exported. */
  const SHAPES = {
    /* A ring that also rises and falls: the simplest path that still banks. */
    drift: n => Array.from({ length: n }, (_, i) => {
      const a = i / n * Math.PI * 2;
      return [Math.cos(a) * 2600, Math.sin(a * 2) * 700, Math.sin(a) * 2600];
    }),
    /* A corkscrew. The camera keeps turning the same way and the gallery
       spirals past — the most disorienting of the four, on purpose. */
    helix: n => Array.from({ length: n }, (_, i) => {
      const a = i / n * Math.PI * 4;
      return [Math.cos(a) * 2000, (i / n - 0.5) * 3000 * Math.sin(i / n * Math.PI), Math.sin(a) * 2000];
    }),
    /* A figure of eight: it crosses its own middle, so you pass the same
       junction twice from different directions and the gallery reads as a place
       rather than a queue. */
    eight: n => Array.from({ length: n }, (_, i) => {
      const a = i / n * Math.PI * 2;
      return [Math.sin(a) * 3000, Math.sin(a * 3) * 500, Math.sin(a * 2) * 1600];
    }),
    /* A trefoil knot. Genuinely three-dimensional — there is no angle from
       which it reads as flat, which is the whole argument for a curve. */
    knot: n => Array.from({ length: n }, (_, i) => {
      const a = i / n * Math.PI * 2;
      return [(Math.sin(a) + 2 * Math.sin(2 * a)) * 900,
              (Math.cos(a) - 2 * Math.cos(2 * a)) * 900,
              -Math.sin(3 * a) * 900];
    }),
  };

  /* The frames a photograph can be cut to. Polygons rather than images so they
     scale with the plane and cost nothing; the ones with curves use an ellipse
     or a path, which clip-path takes just as happily. */
  const CLIPS = {
    rect:    '',
    circle:  'circle(50% at 50% 50%)',
    ellipse: 'ellipse(50% 38% at 50% 50%)',
    diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    triangle:'polygon(50% 0%, 100% 100%, 0% 100%)',
    hex:     'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    arch:    'polygon(0% 100%, 0% 38%, 12% 16%, 32% 3%, 50% 0%, 68% 3%, 88% 16%, 100% 38%, 100% 100%)',
    blade:   'polygon(0% 12%, 100% 0%, 100% 88%, 0% 100%)',
    slit:    'polygon(0% 22%, 100% 8%, 100% 92%, 0% 78%)',
  };

  const CONFIG = {
    enabled: true,

    /* ---- the track ---- */
    shape: 'knot',   // see the note on ORDER in js/track-switch.js     // drift · helix · eight · knot
    knots: 18,          // control points the spline runs through
    scale: 3,           // the whole track, larger or smaller

    /* ---- the camera ---- */
    /* HOW FAR UP THE PATH IT LOOKS. Low and the camera stares at the inside of
       every bend as it takes it; high and it cuts the corner and the track
       swings underneath. This is the dial that decides whether the ride feels
       like driving or like being carried. */
    lookAhead: 0.08,
    /* BANK. Real vehicles roll into a turn and the eye expects it; at 0 the
       horizon stays dead level through a corkscrew, which reads as a bug. */
    bank: 0,
    /* RUBBER — the lag between the scroll and the camera. The reference eases a
       whole second, which is a lot and is most of why it feels like film. */
    rubber: 0.35,       // seconds to close most of the gap
    wheelSpeed: 0.00009,// laps per px of wheel
    drift: 0.012,       // laps a second with no hand on it

    /* ---- ROUNDED WHILE MOVING ----
       The work page's idea, on this page's planes: square at rest, rounding as
       you scroll and settling back when you stop.

       IT IS DRIVEN BY THE WHEEL, NOT BY HOW FAST THE CAMERA IS GOING, and that
       is forced rather than chosen. js/work-grid.js measures the gap between
       where the field is and where it is heading, which is zero the moment you
       let go. Here `drift` keeps the camera moving with no hand on it at all —
       the gap settles at drift x rubber and never reaches zero — so the same
       measurement would leave the planes permanently half-rounded. What was
       asked for was "when I scroll", so what is measured is the scrolling.

       PERCENT, NOT PX, and that is this page rather than the other one too. The
       work page's cards are all one size, so 200px means the same thing on
       every one of them; these planes run from about 30px to 400 as the camera
       passes, and a fixed radius would be a hairline on one and a circle on its
       neighbour. 50% is a full ellipse whatever the plane. */
    radius: 0,          // % at rest
    radiusMove: 50,     // ...and at full scroll
    radiusAt: 240,      // px of wheel in one go that counts as full
    radiusFall: 0.35,   // seconds to settle back once you stop

    /* ---- the gallery ---- */
    count: 250,         // planes on the curve
    /* A RING, NOT A DISC. The camera rides the curve, so a plane scattered
       anywhere within the radius is a plane the camera will eventually fly
       THROUGH — and a plane at zero distance with the swell on it came out four
       hundred thousand pixels wide. scatterMin is the corridor the camera keeps
       to itself. */
    scatterMin: 960,    // px the camera is never closer than
    scatterX: 1425,     // px off the curve, sideways
    scatterY: 1425,     // ...and up and down
    scatterZ: 1200,     // ...and along it
    seed: 57,           // re-roll the scatter without changing anything else
    size: 280,          // px, the long edge before any swell
    sizeVary: 0,        // how much sizes differ from each other
    face: 'camera',     // curve · camera — aligned to the track, or always square on

    /* ---- the swell, which is the whole effect ---- */
    /* 2.4, NOT THE REFERENCE'S 13 — and that is a units difference, not a
       taste one. Its planes are 0.2 units across in a view about 10 units deep,
       so 13x still leaves them modest. Here a plane is 300 REAL PIXELS and the
       perspective divide is already magnifying it as the camera closes: at 13x
       the two compounded to sixty thousand pixels wide, which is not a
       photograph, it is a white screen. The swell is the accent ON TOP of what
       approaching already does. */
    swell: 0,           // how much the nearest plane magnifies
    swellPow: 3,        // the falloff. 1 inflates half the gallery, 3 is a spotlight
    swellNear: 2600,    // px within which anything swells at all
    swellMax: 3.2,      // and a ceiling on it, because perspective multiplies
    /* THE EYE'S OWN CLEARANCE. A plane level with the camera has a view-space
       depth of nearly zero, and the perspective divide sends it to infinity —
       so "beside you" is the dangerous position, not "behind you". 420 is
       comfortably inside scatterMin, so nothing is culled that should be seen. */
    nearClip: 100,      // px in front of the eye; anything nearer is not drawn

    /* ---- THE POINTER MOVES THE CAMERA, AND ONLY THE CAMERA ---------------
       Not the planes and not the world: the eye steps sideways along its own
       axes and everything answers by parallax, so a photograph a metre away
       slides further than one across the room. That difference IS the effect —
       translating the whole scene by the same number of pixels is a slider, and
       reads as one.

       IT IS DELIBERATELY SMALL. The camera is already moving, banking through
       corners and swelling what it passes; a pointer that could throw it around
       would be a second driver fighting the first. A hundred pixels on a track
       two and a half thousand across is a lean, which is what was asked for.

       `mouseTurn` is what the eye does with the move. At 0 the aim travels with
       it and the view slides — the camera has stepped sideways and is still
       looking the same way. At 1 the aim stays where it was and the camera
       swings to keep it, which is an orbit around the point ahead. Between them
       is a lean with a little turn in it, and that is the default. */
    /* ONE DIAL FOR HOW MUCH, TWO FOR THE SHAPE OF IT. mouseX and mouseY are a
       RATIO between the axes — 90 and 55 because the screen is wider than it is
       tall and the same number of pixels reads as more movement vertically —
       and that ratio is a decision, not a strength. Turning the effect up meant
       moving both and keeping the proportion in your head. This multiplies
       them, so intensity is one slider and the balance survives it. */
    mouseGain: 8,       // the whole effect, up or down
    mouseX: 90,         // px the eye steps for a pointer at the edge
    mouseY: 55,         // ...and up or down · smaller, the screen is wider
    mouseTurn: 0.35,    // 0 slides, 1 swings the view back onto the same point
    mouseEase: 0.28,    // seconds to catch up · the lag is the camera's weight

    /* RASTER ONCE AND TRANSFORM IT, or re-raster every frame. See
       .pathg.is-pinned in css/path-gallery.css: this is the dial for the one
       decision that decides whether a photograph rushing past the camera stays
       on screen or blinks out for a frame, and which way it should go depends
       on the machine rather than on anything this file can measure. ON is the
       answer on the hardware this was tested on. */
    pin: true,

    /* ---- the air ---- */
    fogNear: 2600,
    /* 5000, DOWN FROM 9500, AND THIS IS THE FLICKER FIX ---------------------
       A plane that is drawn is a compositor LAYER, and a layer holds its own
       bitmap at its size on screen times the device pixel ratio. At 9500 there
       were 117 of them alive at once — measured — which on a retina screen is
       roughly two hundred megabytes of layer memory. Past the browser's tile
       budget the compositor evicts a layer and re-rasters it, and what that
       looks like is one photograph blinking out for a frame. That is the
       flicker, and it is why smaller FILES did not fix it: the file's size
       decides how much work a raster is, the plane's size on screen decides
       how much memory the compositor has to hold, and only the second one was
       over budget.

       5000 leaves about forty planes alive. Nothing about the gallery's
       DENSITY changes — the planes are as close together as they ever were —
       the far distance simply fades out sooner. Together with count 250 that
       is the same picture in front of you and a third of the memory behind it.

       WHAT WAS RULED OUT FIRST, so nobody re-tries them: the corner rounding
       that animates while scrolling, the per-plane greyscale filter, and
       `will-change` on the planes. Traced all three against a control and the
       raster work was identical to within noise. It was never paint. */
    fogFar: 5000,
    perspective: 525,
    /* COLOUR IS A DISTANCE, not a setting. Near is the photograph as it was
       taken and far is monochrome, so the gallery reads as memory: the thing in
       front of you is present and everything else has already gone grey. Two
       ends and a curve between them, evaluated per plane per frame from the
       same distance the fog uses — one source, so they cannot disagree. */
    greyNear: 0,        // at greyAt and closer: full colour
    greyFar: 1,         // at greyGone and beyond: monochrome
    greyAt: 900,        // px within which a photograph is fully itself
    greyGone: 5200,     // ...and beyond which it has lost its colour entirely
    greyPow: 1.2,       // the curve between them. >1 keeps colour longer
    contrast: 1,

    /* THE SHAPE OF THE FRAME. clip-path on the image, set when the gallery is
       laid out rather than per frame — it is a property of the picture, not of
       where the camera is. */
    /* `frame`, NOT `shape` — the track already owns `shape`, and declaring it
       twice in one object literal is not an error, it is a silent overwrite:
       the second won and the helix quietly became a rectangle. The same fault
       js/block2.js had with wheelSpeed. Two things in one config may not share
       a name however well each name fits. */
    frame: 'rect',      // see CLIPS above
    frameVary: 0,       // 0 gives every picture the same frame; 1 deals them out

    /* ---- PARALLAX: the picture moves behind its frame ----------------------
       THE FRAME IS A WINDOW, NOT A PICTURE. The clip shape stays welded to the
       plane and the photograph slides underneath it, so what a frame shows
       changes as you pass it — a window onto something further back rather than
       a decal that happens to be that shape.

       WHAT DRIVES IT is where the plane sits relative to the camera's own axis,
       measured in view space and divided by depth — an ANGULAR offset, which is
       the thing parallax actually responds to. A plane dead ahead does not
       shift at all; one at the edge of vision shifts most, and it shifts back as
       the camera swings past. Driving it from the scroll instead would make the
       whole gallery slide in step, which is a texture animation, not parallax.

       ZOOM IS WHAT MAKES IT POSSIBLE. A picture the exact size of its frame has
       nowhere to go: move it one pixel and a bare edge appears inside the shape.
       So the photograph is drawn larger than its window and the surplus is the
       travel. The shift is CLAMPED to that surplus, so no combination of dials
       can slide an edge into view — a dial that can produce an obvious bug is a
       bug with a slider on it. */
    /* 0.30 AND 1.40, AND THE TWO ARE SOLVED AGAINST EACH OTHER rather than
       picked. At the edge of a 1280-wide frame with a 525 lens the angular
       offset reaches about 1.22, so the shift a plane wants there is
       1.22 x parallax x half its width — and the room it has is
       (zoom - 1) / 2 x its width. Set the first larger than the second and
       every plane near the edge sits PINNED at the clamp: no bare edge, which
       is what the clamp is for, but the picture stops responding while the
       frame carries on moving, and a picture that sticks reads as a dropped
       frame. These two land just inside, so the travel is used fully and
       nothing pins. Push parallax up and raise the zoom with it. */
    parallax: 0.30,     // how far the picture lags its frame · 0 is welded
    parallaxZoom: 1.40, // how much larger the picture is than its window
    parallaxAxis: 'both', // both · x · y
    /* NEARER PICTURES MOVE MORE, which is the whole of what parallax means.
       At 0 every plane in the gallery shifts by the same angular rule and the
       depth of the scene stops being legible; at 1 only the ones you are
       passing move, and the far field is a still backdrop. */
    parallaxFalloff: 0.65,
    parallaxNear: 3200, // px within which a plane gets its full share
  };

  /* ---- small vector helpers, CSS axes ------------------------------------- */
  const sub = (a, b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
  const add = (a, b) => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
  const mul = (a, k) => [a[0]*k, a[1]*k, a[2]*k];
  const dot = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const len = a => Math.hypot(a[0], a[1], a[2]) || 1e-6;
  const norm = a => mul(a, 1 / len(a));

  /* A CLOSED Catmull-Rom spline. Closed matters more than it sounds: an open
     curve has two ends to handle and a seam to hide, and a ring has neither —
     the scroll just keeps going and the gallery has no beginning. */
  let PTS = [];
  function curveAt(t){
    const n = PTS.length;
    const f = ((t % 1) + 1) % 1 * n;
    const i = Math.floor(f), u = f - i;
    const p0 = PTS[(i - 1 + n) % n], p1 = PTS[i % n],
          p2 = PTS[(i + 1) % n], p3 = PTS[(i + 2) % n];
    const u2 = u * u, u3 = u2 * u;
    const out = [0, 0, 0];
    for (let k = 0; k < 3; k++){
      out[k] = 0.5 * ((2 * p1[k]) +
        (-p0[k] + p2[k]) * u +
        (2*p0[k] - 5*p1[k] + 4*p2[k] - p3[k]) * u2 +
        (-p0[k] + 3*p1[k] - 3*p2[k] + p3[k]) * u3);
    }
    return CONFIG.scale === 1 ? out : mul(out, CONFIG.scale);
  }
  /* The tangent by difference rather than by derivative: the spline's analytic
     derivative is exact and the numeric one is stable, and stability is what a
     camera wants — an exact tangent that flips sign at a cusp puts the view
     through 180 degrees in one frame. */
  const tangentAt = t => norm(sub(curveAt(t + 0.001), curveAt(t - 0.001)));

  /* A frame on the curve: forward, and a side and up that do not spin. Using a
     fixed world up rather than the curve's own normal keeps the gallery from
     rolling over at the top of a loop, where a Frenet normal flips. */
  function frameAt(t){
    const f = tangentAt(t);
    const worldUp = [0, -1, 0];
    let s = cross(f, worldUp);
    if (len(s) < 0.02) s = cross(f, [1, 0, 0]);   // looking straight up or down
    s = norm(s);
    const u = norm(cross(s, f));
    return { f, s, u };
  }

  /* ---- state -------------------------------------------------------------- */
  const on = window.PAGE.bindings();
  let items = [], target = 0, current = 0, raf = 0, last = performance.now();
  /* ---- OUT OF THE SCENE, NOT JUST OUT OF SIGHT ----------------------------
     `visibility: hidden` rather than opacity 0: hidden is not painted and not
     composited, so the plane gives its layer back. Written only on the change —
     three hundred and twenty style writes a frame to say what was already true
     is the cost this is here to avoid. The transform is left alone while a
     plane is parked, which is another two hundred writes a frame saved; it is
     rewritten on the frame it comes back. */
  function park(it){
    if (it.off) return;
    it.off = true;
    it.el.style.visibility = 'hidden';
    it.el.style.opacity = '0';
  }
  function show(it){
    if (!it.off) return;
    it.off = false;
    it.el.style.visibility = '';
  }

  /* How hard the wheel is being turned, 0..1, decaying on its own. See the
     rounding block in CONFIG for why this is not the camera's own speed. */
  let kick = 0, lastRadius = -1;

  const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7 + CONFIG.seed * 74.7) * 43758.5453; return x - Math.floor(x); };

  function buildTrack(){
    PTS = (SHAPES[CONFIG.shape] || SHAPES.drift)(Math.max(4, Math.round(CONFIG.knots)));
  }

  function build(){
    buildTrack();
    world.textContent = '';
    items = [];
    for (let i = 0; i < CONFIG.count; i++){
      const el = document.createElement('div');
      el.className = 'pathg__it';
      const img = document.createElement('img');
      /* THE SMALL FILE ON THE PLANE, the big one written on it for later.
         See the note by FULL: the field never loads the full-size photograph,
         and js/lightbox.js never loads the thumbnail. */
      const name = SHOTS[i % SHOTS.length];
      img.src = thumbOf(name);
      img.dataset.full = 'assets/gallery/' + name;
      const fz = FULL[name];
      if (fz){ img.dataset.fullW = fz[0]; img.dataset.fullH = fz[1]; }
      /* EAGER, AND IT COSTS NOTHING NOW. Lazy loading decides by intersection
         with the viewport, which is a guess it cannot make about a plane the
         page has posed by hand in 3D — so a picture could sit undecoded until
         the moment it was needed, which is the moment it cannot afford it.
         There are twenty-seven distinct URLs behind these three hundred and
         twenty elements and they now weigh 0.46 MB in total. */
      img.alt = ''; img.loading = 'eager'; img.decoding = 'async';
      el.appendChild(img);
      world.appendChild(el);
      items.push({ el, t: i / CONFIG.count, s: 1, g: -1 });
    }
    layout();
  }

  /* Each plane's fixed properties: where it sits off the curve, and how big it
     is before the swell touches it. */
  function layout(){
    for (let i = 0; i < items.length; i++){
      const it = items[i];
      it.t = i / items.length;
      /* Pushed out to at least scatterMin along whatever direction it landed
         in, so the scatter is a tube around the track rather than a cloud
         through it. */
      let ox = (rnd(i, 1) - 0.5) * 2 * CONFIG.scatterX;
      let oy = (rnd(i, 2) - 0.5) * 2 * CONFIG.scatterY;
      const r = Math.hypot(ox, oy) || 1e-6;
      if (r < CONFIG.scatterMin){ const k2 = CONFIG.scatterMin / r; ox *= k2; oy *= k2; }
      it.ox = ox; it.oy = oy;
      it.oz = (rnd(i, 3) - 0.5) * 2 * CONFIG.scatterZ;
      const k = 1 + (rnd(i, 4) - 0.5) * 2 * CONFIG.sizeVary;
      const w = Math.max(20, CONFIG.size * k), h = Math.round(w / 1.4);
      it.w = w; it.h = h;
      it.el.style.width = w + 'px';
      it.el.style.height = h + 'px';
      it.el.style.marginLeft = (-w / 2) + 'px';
      it.el.style.marginTop = (-h / 2) + 'px';

      /* One shape for all of them, or dealt from the library by the same seed
         the scatter uses — so shapeVary re-deals with `seed` rather than being
         a second, independent randomness nobody can reason about. */
      const names = Object.keys(CLIPS);
      let clip = CLIPS[CONFIG.frame] != null ? CLIPS[CONFIG.frame] : '';
      if (CONFIG.frameVary > 0 && rnd(i, 5) < CONFIG.frameVary){
        clip = CLIPS[names[Math.floor(rnd(i, 6) * names.length) % names.length]];
      }
      /* THE CLIP GOES ON THE FRAME, NOT ON THE PICTURE. It was on the <img>,
         which is correct only while the two are the same rectangle: put the
         shape on the thing that moves and the shape moves with it, and a
         circular frame becomes a circle wandering around inside a square. The
         plane is the window and it holds the shape; the photograph is what is
         behind the window. */
      it.el.style.clipPath = clip;

      const img = it.el.firstElementChild;
      if (img){
        img.style.clipPath = '';        // in case it was set by an earlier layout
        /* The surplus that makes the travel possible, in px each side. Kept on
           the item so the frame loop can clamp against it without dividing
           anything per plane per frame. */
        const z = Math.max(1, CONFIG.parallaxZoom);
        it.px = (z - 1) * 0.5 * w;
        it.py = (z - 1) * 0.5 * h;
        it.z = z;
        it.dx = it.dy = 1e9;            // force the first write
        img.style.transform = `scale(${z})`;
      }
    }
  }

  on(scope, 'wheel', e => {
    /* SHIFT NO LONGER MEANS ANYTHING. This early return existed to keep the wheel
       clear for js/mask.js's shift-wheel scaling, which is off now — so holding
       shift while scrolling was landing on a page that ignored it entirely.
       Shift is an ordinary wheel again. */
    if (!CONFIG.enabled) return;
    e.preventDefault();
    target += e.deltaY * CONFIG.wheelSpeed;
    kick = Math.min(1, kick + Math.abs(e.deltaY) / Math.max(1, CONFIG.radiusAt));
  }, { passive: false });

  /* ---- where the pointer is ------------------------------------------------
     In -1..1 across the viewport, so the dials are in pixels-at-the-edge and
     mean the same thing on any screen. `want` is the pointer, `got` is where
     the camera has actually leaned to — see mouseEase. */
  let wantX = 0, wantY = 0, gotX = 0, gotY = 0;
  on(window, 'pointermove', e => {
    wantX = (e.clientX / Math.max(1, innerWidth)  - 0.5) * 2;
    wantY = (e.clientY / Math.max(1, innerHeight) - 0.5) * 2;
  }, { passive: true });
  /* BACK TO THE MIDDLE when the pointer leaves the window. Left alone the
     camera stays leaning at whatever it last saw, which on the way to another
     tab is a gallery that has quietly gone crooked. */
  on(document, 'pointerleave', () => { wantX = 0; wantY = 0; });

  function frame(now){
    if (!window.PAGE || !document.body.contains(root)) return;
    const dt = Math.min((now - last) / 1000, 0.1); last = now;

    const mk = 1 - Math.exp(-dt / Math.max(0.001, CONFIG.mouseEase));
    gotX += (wantX - gotX) * mk;
    gotY += (wantY - gotY) * mk;

    target += CONFIG.drift * dt;
    current += (target - current) * (1 - Math.exp(-dt / Math.max(0.001, CONFIG.rubber)));

    /* THE ROUNDING, once for the whole field. Every plane gets the same number
       — the scroll is global — so it is one custom property on the root rather
       than three hundred and twenty identical inline writes, and it is only
       written when it has actually changed by a tenth of a percent.

       Exponential decay against real elapsed time, so the settle takes the same
       length whatever the frame rate. */
    kick *= Math.exp(-dt / Math.max(0.001, CONFIG.radiusFall));
    if (kick < 0.001) kick = 0;
    const wantR = CONFIG.radius + (CONFIG.radiusMove - CONFIG.radius) * kick;
    if (Math.abs(wantR - lastRadius) > 0.1){
      lastRadius = wantR;
      root.style.setProperty('--card-radius', wantR.toFixed(2) + '%');
    }

    /* THE CAMERA. Position on the curve, aim further along it, and roll by how
       hard the track is turning — the bank. */
    const eye0 = curveAt(current);
    const aim0 = curveAt(current + CONFIG.lookAhead);
    const f0 = norm(sub(aim0, eye0));

    /* How sharply the path is bending, as the change in tangent across the
       look-ahead — which is the same information a driver's inner ear has. */
    const t0 = tangentAt(current), t1 = tangentAt(current + CONFIG.lookAhead);
    const turn = dot(cross(t0, t1), [0, -1, 0]);
    const roll = turn * CONFIG.bank * 6;

    /* THE TRACK'S OWN FRAME FIRST, because the lean has to be measured in the
       camera's axes and not in the world's. Nudged along a world axis the
       gallery would slide sideways on a straight and forwards through a bend,
       which is not a camera at all. */
    let up = [Math.sin(roll), -Math.cos(roll), 0];
    let s = cross(f0, up);
    if (len(s) < 0.02) s = cross(f0, [1, 0, 0]);
    s = norm(s);
    up = norm(cross(s, f0));

    /* AND NOW THE LEAN. The eye moves; the aim moves with it by whatever
       mouseTurn leaves behind, so the same two dials give a slide, an orbit, or
       anything between.

       BOTH SIGNS ARE THE SAME, and that is the argument for them rather than a
       coincidence. What the eye does to the picture is the same on both axes:
       stepping the camera along an axis subtracts that step from every point's
       coordinate in it, so the scene slides one way and the camera reads as
       having gone the other. Whatever `s` and `up` point at in the world — and
       a view matrix can be built with either handedness — the pair behaves
       consistently, so writing one axis positive and the other negative could
       only ever make them disagree with each other. Both dials take a minus if
       the whole thing wants inverting. */
    const gain = CONFIG.mouseGain;
    const nudge = add(mul(s, gotX * CONFIG.mouseX * gain),
                      mul(up, gotY * CONFIG.mouseY * gain));
    const eye = add(eye0, nudge);
    const aim = add(aim0, mul(nudge, 1 - Math.max(0, Math.min(1, CONFIG.mouseTurn))));
    const f = norm(sub(aim, eye));

    /* Re-squared against the moved aim, with the bank untouched: the roll is
       the TRACK's, and letting the pointer tilt the horizon would be a third
       thing happening for one gesture. */
    s = cross(f, [Math.sin(roll), -Math.cos(roll), 0]);
    if (len(s) < 0.02) s = cross(f, [1, 0, 0]);
    s = norm(s);
    up = norm(cross(s, f));

    /* THE VIEW MATRIX, written straight into matrix3d. CSS wants it column by
       column, and the camera's z looks along -f, which is the one sign that
       turns a scene inside out if it is wrong. */
    const m = [
      s[0], up[0], -f[0], 0,
      s[1], up[1], -f[1], 0,
      s[2], up[2], -f[2], 0,
      -dot(s, eye), -dot(up, eye), dot(f, eye), 1,
    ];
    world.style.transform = 'matrix3d(' + m.map(v => v.toFixed(5)).join(',') + ')';

    /* THE SWELL. Cubic by default: linear would inflate half the gallery at
       once, and cubed the magnifying is over almost as soon as it starts, so
       exactly one photograph is ever the subject. */
    for (let i = 0; i < items.length; i++){
      const it = items[i];
      const fr = frameAt(it.t);
      const p = add(add(curveAt(it.t), mul(fr.s, it.ox)),
                    add(mul(fr.u, it.oy), mul(fr.f, it.oz)));

      const rel = sub(p, eye);
      const ahead = dot(rel, f);
      /* BEHIND THE CAMERA IS NOT SMALL, IT IS WRONG. A plane at negative depth
         projects inverted and enormous rather than vanishing, so it is hidden
         outright — the one thing a renderer does for free and a compositor
         does not. */
      /* BY THE PLANE'S EXTENT, not its centre. A quad with its centre safely in
         front of the eye can still have a CORNER behind it — these are aligned
         to the curve, so they lean into the view direction — and a quad
         straddling the camera plane does not shrink, it projects degenerately
         and the browser hands back a sixty-thousand-pixel box. Half the long
         edge, times whatever the swell has done to it, is how far past the clip
         the centre has to be. */
      const reach = Math.max(it.w, it.h) * it.s * 0.5;
      if (ahead < CONFIG.nearClip + reach){ park(it); continue; }
      const d = len(rel);
      /* PAST THE FOG IT IS NOT DIM, IT IS GONE, and saying so is worth more
         than the opacity it saves. An opacity-0 plane is still a live
         compositor layer with a texture behind it — see park() — and two
         hundred of those is the difference between a field that composites and
         one that flickers. It also stops an invisible photograph catching a
         click, which it could do all along. */
      if (d > CONFIG.fogFar){ park(it); continue; }
      show(it);
      const near = Math.max(1, CONFIG.swellNear);
      const k = d < near ? Math.pow(1 - d / near, Math.max(0.2, CONFIG.swellPow)) : 0;
      const want = Math.min(CONFIG.swellMax, 1 + k * CONFIG.swell);
      /* Eased per plane rather than snapped: the reference gives every plane its
         own animator for exactly this, and without it a plane crossing the
         focus edge pops. */
      it.s += (want - it.s) * (1 - Math.exp(-dt / 0.12));

      let rot;
      if (CONFIG.face === 'camera'){
        /* A billboard is the camera's rotation, transposed — so it undoes the
           view and the plane ends up square on whatever the camera is doing. */
        rot = [ s[0], s[1], s[2], 0,
                up[0], up[1], up[2], 0,
                -f[0], -f[1], -f[2], 0, 0, 0, 0, 1 ];
      } else {
        rot = [ fr.s[0], fr.s[1], fr.s[2], 0,
                fr.u[0], fr.u[1], fr.u[2], 0,
                fr.f[0], fr.f[1], fr.f[2], 0, 0, 0, 0, 1 ];
      }

      const fog = 1 - Math.max(0, Math.min(1,
        (d - CONFIG.fogNear) / Math.max(1, CONFIG.fogFar - CONFIG.fogNear)));
      it.el.style.opacity = fog.toFixed(3);

      /* COLOUR, off the SAME distance the fog uses. Written only when it has
         actually moved a hundredth — a filter change forces a repaint of the
         image, and at 320 planes writing an unchanged value every frame is 320
         repaints a frame for nothing. */
      const gk = Math.max(0, Math.min(1,
        (d - CONFIG.greyAt) / Math.max(1, CONFIG.greyGone - CONFIG.greyAt)));
      const g = CONFIG.greyNear +
        (CONFIG.greyFar - CONFIG.greyNear) * Math.pow(gk, Math.max(0.1, CONFIG.greyPow));
      /* A FIFTIETH, NOT A HUNDREDTH. Every step here is a repaint of a
         photograph, and at speed most of the field crosses one every frame —
         sixty-odd repaints a frame measured, a hundred and twenty-eight at the
         worst. Two per cent of greyscale is not a thing anybody can see; the
         repaints are. */
      const gr = Math.round(g * 50) / 50;
      if (gr !== it.g){
        it.g = gr;
        it.el.style.filter = `grayscale(${gr}) contrast(${CONFIG.contrast})`;
      }
      it.el.style.transform =
        `translate3d(${p[0].toFixed(1)}px,${p[1].toFixed(1)}px,${p[2].toFixed(1)}px) ` +
        'matrix3d(' + rot.map(v => v.toFixed(4)).join(',') + ') ' +
        `scale(${it.s.toFixed(3)})`;

      /* ---- THE PICTURE, BEHIND THE WINDOW --------------------------------
         `rel` is already the vector from the eye to this plane, and s/up/f are
         already the camera's axes — so the angular offset is two dot products
         and a divide, with nothing new to compute per plane. Dividing by depth
         is what makes it angular rather than positional: the same plane twice
         as far away subtends half the angle and shifts half as much, which is
         the effect rather than an approximation of it. */
      if (CONFIG.parallax > 0 && it.px != null){
        /* `pnear`, not `near`: the swell above already has a `near` in this
           loop and a nested block would silently shadow it. Legal, and exactly
           the kind of legal that costs an hour later. */
        const pnear = Math.max(1, CONFIG.parallaxNear);
        const prox = Math.max(0, Math.min(1, 1 - d / pnear));
        const fall = Math.max(0, Math.min(1, CONFIG.parallaxFalloff));
        const amt = CONFIG.parallax * (1 - fall + fall * prox);

        const ax = CONFIG.parallaxAxis === 'y' ? 0 : dot(rel, s)  / ahead;
        const ay = CONFIG.parallaxAxis === 'x' ? 0 : dot(rel, up) / ahead;

        /* CLAMPED TO THE SURPLUS. The picture may travel exactly as far as it
           is oversized and not one pixel further, so the window is never caught
           showing its own edge however the dials are set. */
        const dx = Math.max(-it.px, Math.min(it.px, -ax * amt * it.w * 0.5));
        const dy = Math.max(-it.py, Math.min(it.py, -ay * amt * it.h * 0.5));

        /* Written only when it has actually moved half a pixel. At 320 planes
           an unconditional write is 320 extra style mutations a frame for a
           change nobody can see — the same economy the greyscale above makes,
           and for the same reason. */
        if (Math.abs(dx - it.dx) > 0.5 || Math.abs(dy - it.dy) > 0.5){
          it.dx = dx; it.dy = dy;
          const img = it.el.firstElementChild;
          if (img) img.style.transform =
            `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) scale(${it.z})`;
        }
      }
    }

    raf = requestAnimationFrame(frame);
  }

  function apply(){
    root.classList.toggle('is-pinned', !!CONFIG.pin);
    root.style.setProperty('--pg-persp', CONFIG.perspective + 'px');
    buildTrack();
    layout();
  }

  build();
  apply();
  raf = requestAnimationFrame(frame);

  window.PATHG = {
    config: CONFIG,
    apply,
    /* PUSH THE CAMERA ALONG, in laps. js/track-switch.js runs the flourish
       between two tracks by feeding this a bell-shaped stream of small
       amounts, so the ride accelerates and settles on its own easing rather
       than being teleported.

       IT WRITES `target`, NOT `current` — deliberately. `current` chases
       `target` through the rubber band every frame, so writing `current`
       directly would be undone before the next frame, and writing both would
       be the wheel and this fighting for the same variable. Everything else
       that moves this gallery — the wheel, the idle drift — also writes only
       the target, and that is the whole reason they compose instead of
       stuttering against each other. */
    advance(dLaps){ target += (+dLaps || 0); },
    rebuild(){ build(); apply(); },
    shapes: Object.keys(SHAPES),
    clips: Object.keys(CLIPS),
    faces: ['curve', 'camera'],

    /* ---- WHAT THE MINIMAP NEEDS, and nothing more than that ----------------
       js/path-map.js draws the ride from above. It could not do that by
       guessing: the curve is a closed Catmull-Rom through PTS, which is rebuilt
       whenever the track, the seed or the scale changes, so a second copy of
       the maths over there would be wrong the first time you touched a dial.

       So it asks THIS module where the curve is and where on it you are, and
       the map is a projection of the answer rather than a drawing of its own.
       `where` is laps, unwrapped — the map wraps it itself. */
    curveAt: t => curveAt(t),
    where: () => current,
    getShots: () => SHOTS.join('\n'),
    setShots(v){
      const l = String(v).split('\n').map(s => s.trim()).filter(Boolean);
      if (!l.length) return;
      SHOTS.length = 0; l.forEach(s => SHOTS.push(s));
      build(); apply();
    },
    readout(){
      const biggest = items.reduce((m, i) => Math.max(m, i.s), 0);
      return { lap: (((current % 1) + 1) % 1).toFixed(3),
               planes: String(items.length),
               swelling: biggest.toFixed(2) + 'x',
               track: CONFIG.shape };
    },
  };

  return function destroy(){
    on.release();
    cancelAnimationFrame(raf);
    if (window.PATHG && window.PATHG.config === CONFIG) delete window.PATHG;
  };
});
