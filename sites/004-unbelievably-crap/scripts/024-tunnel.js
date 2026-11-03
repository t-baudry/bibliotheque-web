/* ==========================================================================
   tunnel.js — the gallery page's corridor, and the four ways an image can sit in
   it.

   THE SCROLL IS THE CAMERA. One accumulator, eased against real elapsed time,
   written into a single translateZ on one element — so however many photographs
   are in the corridor, the per-frame work is one transform. Everything else is
   set once, when the tunnel is built or an arrangement changes.

   INFINITY IS A MODULO, not a long corridor. Each item's depth is taken against
   the total span and wrapped, so an item that passes the camera reappears at the
   far end. There is no end to reach, which is why there is no end to build and
   no list to top up.

   THE FOUR ARRANGEMENTS are the brief's own question — "suggest a few ways the
   images are applied" — answered as a dial rather than a decision, because they
   are not variations on one idea:

     walls    flat ON the wall, strongly foreshortened. The reference's, and the
              most dramatic: a photograph you read as motion rather than image.
     facing   square to the viewer at varying depth and offset. The opposite
              trade: every picture legible the whole way in, less corridor.
     mixed    walls, with every nth turned to face you — the rush, punctuated.
     rings    four at a time at one depth, one per wall, so the corridor reads
              as a sequence of frames rather than a scatter.
   ========================================================================== */
window.PAGE.register('tunnel', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'gallery') return;
  const root = scope.querySelector('.tunnel');
  if (!root) return;

  const cam = root.querySelector('.tunnel__cam');
  const walls = root.querySelector('.tunnel__walls');

  /* Figma 14550:10603, verbatim — the mirrored ramp that paints the corridor.
     Kept as the file's own SVG rather than redrawn as four CSS gradients: the
     matrix is what makes the vanishing point land where the design puts it. */
  const WALLS =
    "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg' " +
    "preserveAspectRatio='none'><g transform='matrix(-274.85 170.7 -170.7 -274.85 960 540)'>" +
    "<rect height='56.682' width='48.771' fill='url(%23g)' id='q' shape-rendering='crispEdges'/>" +
    "<use href='%23q' transform='scale(1 -1)'/><use href='%23q' transform='scale(-1 1)'/>" +
    "<use href='%23q' transform='scale(-1 -1)'/></g><defs>" +
    "<linearGradient id='g' gradientUnits='userSpaceOnUse' x2='5' y2='5'>" +
    "<stop stop-color='%23000' offset='0.0013'/><stop stop-color='%23000' offset='0.131'/>" +
    "<stop stop-color='%23080808' offset='0.1587'/><stop stop-color='%23101010' offset='0.1859'/>" +
    "<stop stop-color='%23202020' offset='0.2402'/><stop stop-color='%23303030' offset='0.2944'/>" +
    "<stop stop-color='%23404040' offset='0.3487'/><stop stop-color='%23606060' offset='0.4573'/>" +
    "<stop stop-color='%23808080' offset='0.5658'/><stop stop-color='%239f9f9f' offset='0.6744'/>" +
    "<stop stop-color='%23bfbfbf' offset='0.7829'/><stop stop-color='%23dfdfdf' offset='0.8915'/>" +
    "<stop stop-color='%23fff' offset='1'/></linearGradient></defs></svg>\")";

  const SHOTS = [
    'basket-light.jpg', 'dayday.jpg', 'generator-foliage.jpg', 'generator-red.jpg',
    'iced-coffee.jpg', 'mirror.jpg', 'pingpong-net-tall.jpg', 'pingpong-net.jpg',
    'pingpong-paddle.jpg', 'plant-beam.jpg', 'shelf-plant.jpg', 'shelf-silhouette.jpg',
    'yellow-car.jpg',
  ];

  const CONFIG = {
    enabled: true,

    /* ---- the corridor ---- */
    perspective: 700,   // px. Low is a wide lens and a violent rush
    wallsOn: true,
    /* MID GREY, not near-white. Figma's corridor runs black at the far end to a
       mid tone at the near edges, and a #d9d9d9 wall with the fog over it came
       out a bright room with a dark blob in it — the same picture inverted. The
       lightness is the wall's; the darkness is distance. */
    wallCol: '#8a8a8a', // the walls' own lightness before distance touches them
    /* HOW LONG ONE TILE OF CORRIDOR IS. The walls are three of these and the
       camera wraps every one, so the join is always the same distance ahead and
       always inside the fog — which is what makes an endless corridor out of a
       finite pair of planes. */
    tileZ: 4000,
    grid: 240,          // px between the ruled lines on a wall
    gridA: 0.10,        // ...and how dark they are. 0 is a bare wall
    /* STRONG, and it has a second job: the walls are three tiles long and their
       far END is a real edge in the scene. At 0.55 it showed through the middle
       as a dark bowtie — geometry the corridor is not supposed to have. The fog
       is what makes the far end a distance rather than a wall. */
    fog: 0.95,          // how black the far end is
    fogEnd: 48,         // %, where the fog has cleared

    /* ---- the images ---- */
    /* HOW MANY COPIES of the set are in the corridor at once. The set is 13, so
       3 passes is 39 planes — enough that the far end is never empty and few
       enough that nothing is transformed for no reason. */
    passes: 3,
    gap: 300,           // px of depth between one image and the next
    /* WIDER THAN THE SCREEN, deliberately. At 520 the walls converged inside
       the frame and the corridor read as a box floating in the middle of the
       page; the rush only happens when the near end of each wall is already
       past the edge of the viewport and the photograph leaves sideways. */
    half: 900,          // px from the axis to a wall — the corridor's half-width
    size: 340,          // px, the long edge of an image
    aspect: 1.4,
    /* Wall images are laid flat and therefore seen edge-on; a little turn off
       the wall is what makes them readable at all without stopping being wall
       images. 0 is truly flat. */
    tilt: 8,

    mode: 'walls',      // walls · facing · mixed · rings
    mixedEvery: 4,      // in `mixed`, one facing image every this many
    spread: 0.55,       // in `facing`, how far off the axis they scatter

    /* ---- the camera ---- */
    wheelSpeed: 1.0,    // px of travel per px of wheel
    ease: 0.06,         // seconds to close most of the gap
    /* IT TRAVELS AND IT TURNS WITHOUT BEING ASKED. Both were dials at 0, which
       made them dials for something that never happened; a corridor that only
       moves when a hand is on the wheel is a diagram of a corridor. The wheel
       still works and adds to this rather than replacing it. */
    drift: 130,         // px a second of travel with no hand on it
    roll: 0,            // degrees, a fixed rotation about the axis
    rollDrift: 6,       // ...and degrees a second — 6 is one full turn a minute
    lookX: 0, lookY: 0, // degrees, aiming the camera off the axis

    /* ---- the photographs' treatment ---- */
    grey: 1,            // 1 is the site's monochrome, 0 is the real colour
    contrast: 1,
  };

  const on = window.PAGE.bindings();
  let items = [], target = 0, current = 0, raf = 0, last = performance.now();
  let rollNow = 0;

  const span = () => Math.max(1, SHOTS.length * CONFIG.passes * CONFIG.gap);

  /* ---- building ------------------------------------------------------------
     The DOM is made once and only re-laid when an arrangement dial moves.
     Rebuilding 39 <img> on every change would re-download nothing (they are
     cached) but would restart every decode, and the flicker is visible. */
  /* THE FOUR WALLS. Each is a plane the length of the corridor, turned onto its
     own face: rotateY for the sides, rotateX for the floor and ceiling. They
     live in the SAME 3D tree as the photographs, which is the whole point — one
     rotation moves the room and everything in it together. */
  let wallEls = [];
  function buildWalls(){
    wallEls.forEach(e => e.remove());
    wallEls = [];
    /* FIVE TILES, not three. The far end of a wall is a real edge in the scene
       and it showed through the vanishing point as a dark bowtie — geometry the
       corridor is not supposed to have. Length is free here (four more planes,
       no more per-frame work), and past about four tiles the end is deep enough
       inside the fog to have stopped existing. */
    const L = CONFIG.tileZ * 5;
    /* A SQUARE SECTION, and that is a rotation requirement rather than a taste.
       The floor and ceiling used to sit closer in than the sides, so the
       corridor's cross-section was 1800 x 1116 — and a room turned about its
       axis only keeps covering the screen while the viewport's DIAGONAL fits
       inside that section. At 1440 x 810 the diagonal is 1652, which fits a
       1800 square and does not fit an 1116 height: the corners went black every
       time the roll passed a right angle. */
    const hv = CONFIG.half;
    const spec = [
      { w: L, h: CONFIG.half * 2, t: `translate3d(${-CONFIG.half}px,0,${-L/2}px) rotateY(90deg)` },
      { w: L, h: CONFIG.half * 2, t: `translate3d(${CONFIG.half}px,0,${-L/2}px) rotateY(-90deg)` },
      { w: L, h: hv * 2,          t: `translate3d(0,${hv}px,${-L/2}px) rotateY(90deg) rotateX(90deg)` },
      { w: L, h: hv * 2,          t: `translate3d(0,${-hv}px,${-L/2}px) rotateY(90deg) rotateX(-90deg)` },
    ];
    spec.forEach(sp => {
      const el = document.createElement('div');
      el.className = 'tunnel__wall';
      el.style.width = sp.w + 'px';
      el.style.height = sp.h + 'px';
      el.style.marginLeft = (-sp.w / 2) + 'px';
      el.style.marginTop = (-sp.h / 2) + 'px';
      el.dataset.t = sp.t;
      el.style.transform = sp.t;
      cam.appendChild(el);
      wallEls.push(el);
    });
  }

  function build(){
    cam.textContent = '';
    items = [];
    buildWalls();
    const total = SHOTS.length * CONFIG.passes;
    for (let i = 0; i < total; i++){
      const el = document.createElement('div');
      el.className = 'tunnel__it';
      const img = document.createElement('img');
      img.src = 'assets/gallery/' + SHOTS[i % SHOTS.length];
      img.alt = '';
      img.loading = 'lazy';
      el.appendChild(img);
      cam.appendChild(el);
      items.push(el);
    }
    layout();
  }

  /* Where each item sits, and which way it faces. Written once per arrangement
     change — never per frame. */
  function layout(){
    const n = items.length;
    for (let i = 0; i < n; i++){
      const el = items[i];
      const w = CONFIG.size, h = Math.round(CONFIG.size / CONFIG.aspect);
      el.style.width = w + 'px';
      el.style.height = h + 'px';
      el.style.marginLeft = (-w / 2) + 'px';
      el.style.marginTop  = (-h / 2) + 'px';
      el.dataset.z = String(i * CONFIG.gap);

      const wall = i % 4;                       // 0 left, 1 right, 2 floor, 3 ceiling
      let t = '';

      const facing = CONFIG.mode === 'facing' ||
                     (CONFIG.mode === 'mixed' && i % Math.max(2, CONFIG.mixedEvery) === 0);

      if (facing){
        /* SQUARE TO THE VIEWER. Scattered off the axis by a hash of the index so
           the pattern does not read as a spiral — deterministic, so a reload
           gives the same corridor. */
        const hx = Math.sin(i * 12.9898) * 43758.5453;
        const hy = Math.sin(i * 78.233) * 43758.5453;
        const x = ((hx - Math.floor(hx)) - 0.5) * 2 * CONFIG.half * CONFIG.spread;
        const y = ((hy - Math.floor(hy)) - 0.5) * 2 * CONFIG.half * CONFIG.spread;
        t = `translate3d(${x.toFixed(0)}px, ${y.toFixed(0)}px, 0)`;
      } else if (CONFIG.mode === 'rings'){
        /* FOUR AT A DEPTH, one per wall. The depth is the ring's, not the
           item's, which is what makes them arrive together. */
        const ring = Math.floor(i / 4);
        el.dataset.z = String(ring * CONFIG.gap * 4);
        t = wallTransform(wall);
      } else {
        t = wallTransform(wall);
      }
      el.dataset.t = t;
    }
  }

  /* A wall plane. rotateY for the sides and rotateX for floor and ceiling, then
     the tilt off the surface so an edge-on photograph is still a photograph. */
  function wallTransform(wall){
    const d = CONFIG.half, k = CONFIG.tilt;
    if (wall === 0) return `translate3d(${-d}px,0,0) rotateY(${90 - k}deg)`;
    if (wall === 1) return `translate3d(${d}px,0,0) rotateY(${-90 + k}deg)`;
    /* The same d as the sides — the photographs sit ON the walls, so when the
       section became square they had to follow it or they would hang in the air
       a third of the way up. */
    if (wall === 2) return `translate3d(0,${d}px,0) rotateX(${-90 + k}deg)`;
    return                 `translate3d(0,${-d}px,0) rotateX(${90 - k}deg)`;
  }

  /* ---- the scroll ---------------------------------------------------------- */
  /* ON THE CONTAINER, not on .tunnel. The corridor is a CHILD of .hero and the
     title sits over it, so a wheel with the pointer anywhere but directly on a
     photograph has .hero as its target and never reaches a listener bound to
     the tunnel — events bubble up from what is under the cursor, they do not
     descend into what is behind it. Every other scroll on this site binds to the
     container for the same reason. */
  on(scope, 'wheel', e => {
    /* SHIFT NO LONGER MEANS ANYTHING. This early return existed to keep the wheel
       clear for js/mask.js's shift-wheel scaling, which is off now — so holding
       shift while scrolling was landing on a page that ignored it entirely.
       Shift is an ordinary wheel again. */
    if (!CONFIG.enabled) return;
    e.preventDefault();
    target += e.deltaY * CONFIG.wheelSpeed;
  }, { passive: false });

  function frame(now){
    if (!window.PAGE || !document.body.contains(root)) return;
    const dt = Math.min((now - last) / 1000, 0.1); last = now;

    target += CONFIG.drift * dt;
    current += (target - current) * (1 - Math.exp(-dt / Math.max(0.001, CONFIG.ease)));
    rollNow += CONFIG.rollDrift * dt;

    /* THE ONLY PER-FRAME WRITES: one transform on the camera, and each item's
       wrapped depth. The wrap has to be per item because they are at different
       depths; the alternative — moving the camera forever — runs out of float
       precision and starts juddering after a few minutes of scrolling. */
    const S = span();
    for (let i = 0; i < items.length; i++){
      const el = items[i];
      const base = +el.dataset.z;
      /* DEPTH AHEAD OF THE CAMERA, 0 to span — then NEGATED, because CSS 3D
         puts +z toward the viewer. Written positive the first time, every plane
         sat behind the camera and the corridor was empty: the gradient was the
         only thing on screen and it looked like the images had failed to load
         rather than like they were in the wrong hemisphere. */
      const d = (((base - current) % S) + S) % S;
      el.style.transform = `translate3d(0,0,${(-d).toFixed(1)}px) ${el.dataset.t}`;
    }

    /* THE WHOLE TUNNEL TURNS, not the photographs inside it. The roll used to
       be the camera's alone — and the camera is the only thing the images live
       in, so the walls stayed put and the pictures spun against a corridor that
       did not move. Wrong on its face: the gradient IS the tunnel, so it takes
       the same angle. It is a separate element and not in the 3D tree, which is
       why it needs its own write rather than inheriting one. */
    /* THE WALLS MOVE TOO, wrapped by one tile. Without this they would be a
       fixed room the photographs flew through, which is the same mistake as the
       picture — the sense of travel comes from the SURFACE going past, not from
       objects passing a static frame. */
    /* PLUS A TILE, so the walls always overshoot the eye. The wrap puts the near
       end of each wall between 0 and one tile ahead — and at the low end that
       edge lands exactly ON the camera plane, so the screen corners looked past
       it into nothing. Pushing the whole room one tile toward the viewer means
       the near end is always behind the eye and there is no edge to see past.
       The wrap is unchanged: it is still one tile, just measured from further
       back. */
    const wz = (((current % CONFIG.tileZ) + CONFIG.tileZ) % CONFIG.tileZ) + CONFIG.tileZ;
    for (const el of wallEls) el.style.transform = `translate3d(0,0,${wz.toFixed(1)}px) ${el.dataset.t}`;

    /* ONE ROTATION FOR THE WHOLE ROOM. The walls are inside this element now, so
       they take it without being told — which is what "the tunnel rotates"
       means and what a background image could never do. */
    const rollDeg = CONFIG.roll + rollNow;
    cam.style.transform =
      `rotateX(${CONFIG.lookY.toFixed(2)}deg) rotateY(${CONFIG.lookX.toFixed(2)}deg) ` +
      `rotateZ(${rollDeg.toFixed(2)}deg)`;

    raf = requestAnimationFrame(frame);
  }

  function apply(){
    root.style.setProperty('--tun-persp', CONFIG.perspective + 'px');
    root.style.setProperty('--tun-wallCol', CONFIG.wallCol);
    root.style.setProperty('--tun-grid', CONFIG.grid + 'px');
    root.style.setProperty('--tun-gridA', String(CONFIG.gridA));
    wallEls.forEach(e => { e.style.display = CONFIG.wallsOn ? '' : 'none'; });
    root.style.setProperty('--tun-fog', String(CONFIG.fog));
    root.style.setProperty('--tun-fogEnd', CONFIG.fogEnd + '%');
    root.style.setProperty('--tun-grey', String(CONFIG.grey));
    root.style.setProperty('--tun-contrast', String(CONFIG.contrast));
    layout();
  }

  build();
  apply();
  raf = requestAnimationFrame(frame);

  window.TUNNEL = {
    config: CONFIG,
    apply,
    rebuild(){ build(); apply(); },
    modes: ['walls', 'facing', 'mixed', 'rings'],
    getShots: () => SHOTS.join('\n'),
    setShots(v){
      const list = String(v).split('\n').map(s => s.trim()).filter(Boolean);
      if (!list.length) return;
      SHOTS.length = 0; list.forEach(s => SHOTS.push(s));
      build(); apply();
    },
    readout(){
      return { tunZ: current.toFixed(0), tunSpan: span().toFixed(0),
               tunItems: String(items.length), tunMode: CONFIG.mode };
    },
  };

  return function destroy(){
    on.release();
    cancelAnimationFrame(raf);
    if (window.TUNNEL && window.TUNNEL.config === CONFIG) delete window.TUNNEL;
  };
});
