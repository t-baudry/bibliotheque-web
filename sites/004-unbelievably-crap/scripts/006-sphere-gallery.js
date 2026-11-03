/* ==========================================================================
   sphere-gallery.js
   CSS-3D + GSAP sphere gallery — CMS-ready placeholder.

   PLACEMENT
   Each card is written as  rotateY(lon) rotateX(lat) translateZ(radius)
   so it ends up tangent to the sphere surface, facing outward along its own
   radius. That's what gives the knife-thin slivers at the silhouette and the
   true spherical read. Positioning with translate3d(x,y,z) alone would put
   cards on a sphere but leave them all parallel to the screen — a flat ring
   of images, not a sphere.

   Points come off a Fibonacci (golden-angle) spiral, which is the
   mathematically even distribution on a sphere — every point has
   near-identical spacing to its neighbours, with no polar clumping and no
   banding. Card size is DERIVED from that spacing (see measure()), so cards
   are guaranteed not to collide however many you add.

   ROTATION
   Orientation is an accumulated 3x3 rotation matrix, not a pair of Euler
   angles. Drag deltas are pre-multiplied in camera space, so:
     - there are no pitch limits and no blind stop zones — drag forever,
       any direction, and the sphere keeps turning
     - there's no gimbal lock, so horizontal drag never inverts or stalls
       when the sphere is pitched near the poles
   Euler angles (rotateX/rotateY) cannot do this: they need a pitch clamp to
   stay usable, and that clamp is what makes a drag feel like it snags.

   Swap DATA below for real CMS entries later — each item just needs a src.

   LIFECYCLE
   Registered with js/lifecycle.js rather than run on load. Everything below
   binds to `viewport` (and to the ghost layer inserted beside it), which is
   inside the Barba container and dies with it — destroy() only has to undo
   the window resize listener, the GSAP ticker callback and window.SPHERE.
   Elements are looked up inside `scope` because during a transition BOTH
   containers are in the document at once.
   ========================================================================== */
window.PAGE.register('sphere', function (scope) {
  'use strict';

  const viewport = scope.querySelector('#sphereViewport');
  const stage = scope.querySelector('#sphereStage');
  if (!viewport || !stage) return;

  const on = window.PAGE.bindings();

  /* ---------------- placeholder CMS data ---------------------------------
     Colour photography on purpose — `filter: invert(1)` turns these into
     colour negatives. (Greyscale sources invert to greyscale, which is why
     an earlier pass looked black & white.) */
  /* Every card is the same VERTICAL rectangle, as in the reference. Source
     photos that are landscape simply crop to fill it (object-fit: cover in
     the CSS) rather than changing the card's shape. Add entries here and the
     sphere redistributes automatically. */
  const SOURCES = [
    'assets/gallery/generator-foliage.jpg',
    'assets/gallery/shelf-plant.jpg',
    'assets/gallery/generator-red.jpg',
    'assets/gallery/mirror.jpg',
    'assets/gallery/dayday.jpg',
    'assets/gallery/pingpong-net.jpg',
    'assets/gallery/pingpong-net-tall.jpg',
    'assets/gallery/pingpong-paddle.jpg',
    'assets/gallery/basket-light.jpg',
    'assets/gallery/plant-beam.jpg',
    'assets/gallery/iced-coffee.jpg',
    'assets/gallery/shelf-silhouette.jpg',
    'assets/gallery/yellow-car.jpg',
  ];

  /* Assign sources in a deterministic scattered order rather than cycling
     0,1,2,0,1,2... Straight cycling against a golden-angle spiral makes
     repeats land on a visible spiral of identical images, which is a big
     part of what reads as "scattered" rather than natural. A coprime stride
     spreads repeats evenly over the surface instead. */
  function sourceFor(i){
    const n = SOURCES.length;
    let stride = Math.max(2, Math.round(n * 0.618));   // golden-ish
    while (gcd(stride, n) !== 1) stride++;
    return SOURCES[(i * stride) % n];
  }
  function gcd(a, b){ return b ? gcd(b, a % b) : a; }

  const CONFIG = {
    itemCount: 65,

    /* How each card is allowed to turn. The sphere's rotation is cancelled
       out of the card first, then exactly this much is re-applied:
         'both'  — full tangent: cards lie flat on the sphere like tiles.
                   The only mode where a card can roll diagonally. (chosen)
         'pitch' — vertical angle varies, horizontal alignment never does.
                   Cards flatten top-to-bottom toward the edges.
         'yaw'   — horizontal angle varies, vertical never does. Cards
                   narrow into vertical slivers toward the edges.
         'flat'  — no turning at all; every card dead-on to the camera. */
    cardOrientation: 'both',
    // Geometry is derived per-viewport in measure() — a fixed px radius
    // overflows small screens. These are the desktop caps.
    maxRadius: 430,
    minRadius: 150,
    radiusOfViewport: 0.43,  // radius as a share of min(vw, vh)
    // Card size as a share of the Fibonacci nearest-neighbour spacing.
    // Anything below 1.0 guarantees cards cannot touch; 0.29 leaves a lot
    // of air, which is what keeps the sphere reading as a constellation.
    spacingFactor: 0.29,
    itemAspect: 1.28,        // card height / width — vertical, per reference
    fitRatio: 1.05,          // sphere diameter as a share of min(vw, vh)
    perspective: 1400,       // MUST match .sphere-viewport perspective in CSS

    dragSensitivity: 0.07,   // deg of rotation per px dragged
    followEase: 0.25,        // how fast rotation catches up to your drag
    inertiaGain: 0,          // how much throw you get on release
    idleSpin: 0.075,         // deg/frame drift when untouched (0 = holds still)

    zoomStep: 3,
    zoomMin: -360,           // relative to the resting dolly
    /* How large the nearest card may grow relative to its CSS size before
       the dolly stops. The zoom limit is DERIVED from this in measure()
       rather than being a fixed px value, because a fixed one gives a
       different depth on every screen — radius scales with the viewport, so
       the same translateZ lands you far deeper on a small window than a
       large one. Solving for a target magnification keeps the deepest view
       identical everywhere, and keeps cards from crossing the camera plane
       (where they'd invert and vanish). */
    maxNearScale: 13.5,
    zoomEase: 0.17,

    /* Raster quality when zoomed in.
       A card's CSS box is only ~26px wide, and the dolly then magnifies it
       ~7.6x with a 3D transform. The browser rasterises the image into that
       small box FIRST and scales the bitmap up, so deep zoom looked soft
       even though the source file had the pixels (measured: half the
       sharpness of a proper resample at the same size).
       Fix: lay each card out at rasterTargetPx and scale it back down by the
       same factor in its transform. Visually identical at rest, but the
       bitmap is rasterised at the size it reaches when zoomed, so magnifying
       is downscaling rather than upscaling. */
    rasterTargetPx: 900,

    /* ---- intro ----
       The sphere arrives collapsed at the centre and grows out, copying the
       reference component's entry. Held until the loader hands off — see
       PAGE.intro in js/lifecycle.js. Set introMs to 0 to switch it off. */
    introMs: 1800,
    introFrom: 0.02,
    /* Total degrees of extra turn across the expansion — the reference does
       not just scale up, it arrives turning.

       This is a TOTAL, not a per-frame rate, and that is the point. Expressed
       the way idleSpin is (deg/frame) the intro turned 121 degrees at 60Hz,
       242 at 120Hz and a measured 21 on a slow machine: the one moment of the
       site every visitor sees identically would have looked different on every
       machine. Driven off the ramp's own delta instead, it is exactly this
       many degrees everywhere, and because the ramp is ease-out cubic it
       arrives fast and settles. */
    introTurn: 140,

    /* ---------------- halftone echo layer -------------------------------
       A second copy of the whole sphere, dot-screened and drawn OVER the
       real one. It ships PINNED (htDelayMs 0), so it registers exactly with
       the photographs and reads as a treatment rather than a trail. Raise
       htDelayMs to let it run behind the sphere instead: it then smears
       during a drag and catches up when you stop. */
    htEnabled: true,
    htDelayMs: 0,      // how far behind the echo runs
    htDotScale: 0.5,     // halftone cell size on screen, px at rest
    htDotRadius: 0.05,   // dot size within the cell, 0.5 = cells touch
    htDotShape: 'square',// circle | square | cross
    htOpacity: 1,
    htBlend: 'difference',
    htContrast: 1.6,     // pushes the photo graphic before it's dotted
    htGrayscale: 1,
    htBrightness: 3,
    htInvert: 1,         // 1 turns dark photos into light dots
    htSizeBoost: 1.09,   // echo slightly larger than the original
  };

  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // radians
  const DEG = Math.PI / 180;
  const hasGSAP = typeof window.gsap !== 'undefined';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ================= 3x3 rotation matrix helpers (row-major) ============== */
  const mIdentity = () => [1,0,0, 0,1,0, 0,0,1];

  function mMul(a, b){                      // a * b
    const o = new Array(9);
    for (let r = 0; r < 3; r++){
      for (let c = 0; c < 3; c++){
        o[r*3+c] = a[r*3]*b[c] + a[r*3+1]*b[3+c] + a[r*3+2]*b[6+c];
      }
    }
    return o;
  }
  function mRotX(a){ const s = Math.sin(a), c = Math.cos(a);
    return [1,0,0, 0,c,-s, 0,s,c]; }
  function mRotY(a){ const s = Math.sin(a), c = Math.cos(a);
    return [c,0,s, 0,1,0, -s,0,c]; }

  /* Re-orthonormalise (Gram-Schmidt). Thousands of accumulated multiplies
     would otherwise let floating-point error shear the matrix, which would
     show up as the sphere slowly skewing. */
  function mOrthonormalize(m){
    let x = [m[0], m[3], m[6]];
    let y = [m[1], m[4], m[7]];
    const nx = Math.hypot(...x);
    x = x.map(v => v / nx);
    const d = x[0]*y[0] + x[1]*y[1] + x[2]*y[2];
    y = [y[0]-d*x[0], y[1]-d*x[1], y[2]-d*x[2]];
    const ny = Math.hypot(...y);
    y = y.map(v => v / ny);
    const z = [                       // z = x cross y
      x[1]*y[2] - x[2]*y[1],
      x[2]*y[0] - x[0]*y[2],
      x[0]*y[1] - x[1]*y[0],
    ];
    return [x[0],y[0],z[0], x[1],y[1],z[1], x[2],y[2],z[2]];
  }

  /* CSS matrix3d is COLUMN-major; translation lives in the 4th column. */
  function toMatrix3d(m, tz){
    return `matrix3d(${m[0]},${m[3]},${m[6]},0,` +
                    `${m[1]},${m[4]},${m[7]},0,` +
                    `${m[2]},${m[5]},${m[8]},0,` +
                    `0,0,${tz},1)`;
  }

  /* ---------------- responsive geometry ------------------------------------ */
  let radius, restZoom, spacing, itemW, itemH, zoomMaxRel, rasterQ, invQ;

  function measure(){
    const fit = Math.min(window.innerWidth, window.innerHeight);
    radius = clamp(fit * CONFIG.radiusOfViewport, CONFIG.minRadius, CONFIG.maxRadius);

    // Mean nearest-neighbour arc on an evenly covered sphere: each point owns
    // 4(pi)r^2/N of surface, so centres sit about r*sqrt(4(pi)/N) apart.
    spacing = radius * Math.sqrt(4 * Math.PI / CONFIG.itemCount);

    // Fit the card's DIAGONAL inside that spacing so cards cannot overlap
    // at any orientation, whatever the count.
    itemW = (spacing * CONFIG.spacingFactor) / Math.hypot(1, CONFIG.itemAspect);
    itemH = itemW * CONFIG.itemAspect;

    // Resting dolly, solved from the perspective projection so the sphere
    // frames identically at any viewport:  projected = 2r*P/(P - z)
    const P = CONFIG.perspective;
    restZoom = P - (2 * radius * P) / (CONFIG.fitRatio * fit);

    // Deepest dolly, solved from the same projection. A card on the near
    // shell sits at (zoom + radius); its magnification is P / (P - that).
    // Setting that equal to maxNearScale and solving for zoom:
    const nearestZ = P - P / CONFIG.maxNearScale;
    zoomMaxRel = (nearestZ - radius) - restZoom;

    // Lay cards out this many times larger, then scale back down (see
    // rasterTargetPx). The cap is a memory backstop, not a quality choice —
    // at 12 a 560px target is reachable for cards down to ~47px. Raising
    // itemCount a long way with a high rasterTargetPx is what to watch.
    rasterQ = clamp(CONFIG.rasterTargetPx / itemW, 1, 12);
    invQ = 1 / rasterQ;
  }

  /* ---------------- halftone echo layer ---------------------------------------
     A clone of the whole sphere in its own perspective container, stacked
     above the real one and driven by a delayed copy of the rotation. */
  const ghostVp = document.createElement('div');
  ghostVp.className = 'sphere-viewport sphere-viewport--ghost';
  ghostVp.setAttribute('aria-hidden', 'true');
  const ghostStage = document.createElement('div');
  ghostStage.className = 'sphere-stage';
  ghostVp.appendChild(ghostStage);
  viewport.parentNode.insertBefore(ghostVp, viewport.nextSibling);

  /* The dot screen is an inline SVG tile used as a mask, so the shape is
     fully controllable and behaves identically across browsers — CSS
     gradient tricks for squares and crosses need mask-composite, which is
     patchier. One tile, tiled at htDotScale. */
  function halftoneMask(){
    const r = clamp(CONFIG.htDotRadius, 0.02, 0.5) * 100;
    let shape;
    if (CONFIG.htDotShape === 'square'){
      shape = `<rect x="${50-r}" y="${50-r}" width="${r*2}" height="${r*2}" fill="black"/>`;
    } else if (CONFIG.htDotShape === 'cross'){
      const t = r * 0.62, L = r * 2;
      shape = `<rect x="${50-L/2}" y="${50-t/2}" width="${L}" height="${t}" fill="black"/>` +
              `<rect x="${50-t/2}" y="${50-L/2}" width="${t}" height="${L}" fill="black"/>`;
    } else {
      shape = `<circle cx="50" cy="50" r="${r}" fill="black"/>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${shape}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }

  /* Everything the echo needs is a handful of custom properties on its
     container — the cards inherit them, so changing a dial is one write
     rather than 65. */
  function applyHalftoneStyle(){
    const s = ghostVp.style;
    s.display = CONFIG.htEnabled ? '' : 'none';
    s.setProperty('--ht-mask', halftoneMask());
    /* The mask lives on the img inside the OVERSIZED raster box (itemW *
       rasterQ), which is then scaled back down by 1/rasterQ. Left alone,
       a "6px" dot would land on screen at 6/rasterQ — twelve times smaller
       than the dial claims. Multiplying through makes htDotScale mean what
       it says: the on-screen cell size, in px, at rest. */
    s.setProperty('--ht-size', `${(CONFIG.htDotScale * rasterQ).toFixed(2)}px`);
    s.setProperty('--ht-opacity', CONFIG.htOpacity);
    s.setProperty('--ht-blend', CONFIG.htBlend);
    s.setProperty('--ht-filter',
      `grayscale(${CONFIG.htGrayscale}) contrast(${CONFIG.htContrast}) ` +
      `brightness(${CONFIG.htBrightness}) invert(${CONFIG.htInvert})`);
  }

  /* ---------------- build ---------------------------------------------------- */
  const items = [];
  const ghosts = [];

  function buildItems(){
    // rebuildable: itemCount can change at runtime
    items.forEach(el => el.remove());
    ghosts.forEach(el => el.remove());
    items.length = 0;
    ghosts.length = 0;

    const frag = document.createDocumentFragment();
    const gfrag = document.createDocumentFragment();

    for (let i = 0; i < CONFIG.itemCount; i++){
      const src = sourceFor(i);

      const el = document.createElement('div');
      el.className = 'sphere-item';
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      img.draggable = false;
      el.appendChild(img);
      frag.appendChild(el);
      items.push(el);

      // echo twin — same photo, same place on the sphere, dot-screened
      const g = document.createElement('div');
      g.className = 'sphere-item sphere-item--ghost';
      const gimg = document.createElement('img');
      gimg.src = src;
      gimg.alt = '';
      gimg.loading = 'lazy';
      gimg.draggable = false;
      g.appendChild(gimg);
      gfrag.appendChild(g);
      ghosts.push(g);
    }
    stage.appendChild(frag);
    ghostStage.appendChild(gfrag);
    /* Only the real cards get the reveal — the halftone twins sit on top and
       would double the canvas count for an effect nobody can see through the
       dot screen. */
    items.forEach((el, i) => window.PIXELATE?.attach(el, { delay: i * 12, columns: 8 }));
  }

  /* Static sphere positions. Orientation is NOT baked in here any more —
     see applyBillboard(). */
  const positions = [];

  function layout(){
    const n = CONFIG.itemCount;
    positions.length = 0;
    for (let i = 0; i < n; i++){
      // Fibonacci sphere: even spacing in cos(lat), longitude by golden angle
      const yy = 1 - (2 * i + 1) / n;                // +1 .. -1, centred
      const lat = Math.asin(clamp(yy, -1, 1));
      const lon = i * GOLDEN_ANGLE;

      // cartesian on the sphere (CSS axes: +y is down, so latitude negates)
      positions.push([
        radius * Math.cos(lat) * Math.sin(lon),
        -radius * Math.sin(lat),
        radius * Math.cos(lat) * Math.cos(lon),
      ]);

      // laid out large, scaled back down in applyBillboard()
      const w = `${(itemW * rasterQ).toFixed(2)}px`;
      const h = `${(itemH * rasterQ).toFixed(2)}px`;
      items[i].style.setProperty('--item-w', w);
      items[i].style.setProperty('--item-h', h);
      if (ghosts[i]){
        ghosts[i].style.setProperty('--item-w', w);
        ghosts[i].style.setProperty('--item-h', h);
      }
    }
  }

  /* ---------------- cylindrical billboarding --------------------------------
     Cards stay VERTICAL at all times — never rolled, never pitched — but
     they still turn away around the vertical axis, so a card at the left or
     right of the sphere foreshortens into a thin *vertical* sliver. That's
     the reference behaviour: upright near the middle, narrowing toward the
     edges, with no diagonal tilt anywhere.

     The stage applies rotation R to everything beneath it. Carrying R⁻¹ in
     the card's own transform cancels it, leaving only the position rotated:

        R . translate3d(p) . R⁻¹ . rotateY(t)
          = translate3d(R.p) . rotateY(t)

     so the card rides around the sphere exactly as before, while its
     orientation is reduced to a single yaw. Pitch and roll are fully
     cancelled, which is what keeps every edge vertical. R is a pure
     rotation, so R⁻¹ is just its transpose — free to compute.

     The yaw uses |z| rather than z so a card on the far side presents its
     front rather than a mirrored back (signage and text would otherwise
     read backwards). The 180-degree flip that implies happens exactly when
     z crosses 0 — the moment the card is edge-on and has zero width — so
     it's never visible. */
  function applyBillboard(R, list, extraScale){
    const inv = `matrix3d(${R[0]},${R[1]},${R[2]},0,` +   // transpose = inverse
                        `${R[3]},${R[4]},${R[5]},0,` +
                        `${R[6]},${R[7]},${R[8]},0,` +
                        `0,0,0,1)`;
    const mode = CONFIG.cardOrientation;
    const sc = invQ * (extraScale || 1);

    for (let i = 0; i < list.length; i++){
      const p = positions[i];
      if (!p) break;
      let turn = '';

      if (mode !== 'flat'){
        // world position = R . p   (row-major)
        const wx = R[0]*p[0] + R[1]*p[1] + R[2]*p[2];
        const wy = R[3]*p[0] + R[4]*p[1] + R[5]*p[2];
        const wz = R[6]*p[0] + R[7]*p[1] + R[8]*p[2];
        const az = Math.abs(wz);

        if (mode === 'both'){
          // full tangent: turns on both axes, so cards lie flat on the
          // sphere surface like tiles. The only mode where a card can end
          // up rolled diagonally on screen.
          turn = `rotateY(${(Math.atan2(wx, az) / DEG).toFixed(2)}deg) ` +
                 `rotateX(${(Math.atan2(-wy, Math.hypot(wx, az)) / DEG).toFixed(2)}deg) `;
        } else if (mode === 'pitch'){
          // tilts about the HORIZONTAL axis: vertical angle varies, every
          // horizontal edge stays horizontal
          turn = `rotateX(${(Math.atan2(-wy, az) / DEG).toFixed(2)}deg) `;
        } else {
          // 'yaw' — turns about the VERTICAL axis: cards narrow to vertical
          // slivers at the sides, every vertical edge stays vertical
          turn = `rotateY(${(Math.atan2(wx, az) / DEG).toFixed(2)}deg) `;
        }
      }

      /* scale() undoes the rasterQ oversize. It sits before the centring
         translate, which is in percentages of the (oversized) box, so the
         offset scales with it and the card still lands centred. */
      list[i].style.transform =
        `translate3d(${p[0].toFixed(2)}px,${p[1].toFixed(2)}px,${p[2].toFixed(2)}px) ` +
        `${inv} ${turn}scale(${sc.toFixed(5)}) translate(-50%, -50%)`;
    }
  }

  measure();
  buildItems();
  layout();
  applyHalftoneStyle();   // uses rasterQ from measure()

  /* ---------------- state ---------------------------------------------------- */
  let rot = mMul(mRotX(-6 * DEG), mIdentity());
  let pendingX = 0, pendingY = 0;      // degrees of rotation still to apply
  let velX = 0, velY = 0;              // recent pointer velocity (deg/frame)
  /* Starts AT rest, not dollied back. It used to open at restZoom + zoomMin
     and ease in, which was a second, competing entry animation once the intro
     ramp above existed — the sphere grew twice, on two different curves.
     zoomMin keeps its real job: the far limit of the scroll dolly. */
  let zoom = restZoom, targetZoom = restZoom;

  let dragging = false, pointerId = null;
  let lastPX = 0, lastPY = 0, lastT = 0;
  let frameCount = 0;

  /* ---------------- delay buffer for the echo --------------------------------
     A ring of recent {t, rot, zoom} samples. The echo renders whichever
     sample is closest to (now - htDelayMs), which is what makes it lag
     behind the real sphere during a drag and settle back onto it when the
     motion stops. ~4s of history at 120fps is plenty of headroom. */
  const HISTORY_MAX = 500;
  const history = [];

  function pushHistory(t){
    // At htDelayMs 0 the echo is pinned to the sphere, so there is nothing
    // to look up — skip the per-frame copy entirely. Raising the delay at
    // runtime just refills the ring over the next few frames.
    if (!(CONFIG.htDelayMs > 0)) { if (history.length) history.length = 0; return; }
    history.push({ t, rot: rot.slice(), zoom });
    if (history.length > HISTORY_MAX) history.shift();
  }

  function sampleHistory(t){
    if (!history.length) return null;
    // walk back from newest — the target is always near the tail
    for (let i = history.length - 1; i >= 0; i--){
      if (history[i].t <= t) return history[i];
    }
    return history[0];
  }

  const introRamp = window.PAGE.intro(CONFIG.introMs);
  let introK = 0, introPrevK = 0;     // sampled once per frame, read by render

  function render(){
    /* scale3d FIRST, so it scales the depth as well and the cloud collapses
       toward the origin instead of shrinking in place. Uniform scale commutes
       with the rotation matrix, so the billboarding stays exact throughout and
       nothing about the tuned geometry changes once it reaches 1. */
    const k = CONFIG.introFrom + (1 - CONFIG.introFrom) * introK;
    const grow = `scale3d(${k.toFixed(4)}, ${k.toFixed(4)}, ${k.toFixed(4)}) `;

    stage.style.transform = grow + toMatrix3d(rot, zoom);
    applyBillboard(rot, items, 1);

    if (CONFIG.htEnabled && ghosts.length){
      const past = CONFIG.htDelayMs > 0
        ? (sampleHistory(performance.now() - CONFIG.htDelayMs) || { rot, zoom })
        : { rot, zoom };                       // pinned — reuse, no lookup
      ghostStage.style.transform = grow + toMatrix3d(past.rot, past.zoom);
      applyBillboard(past.rot, ghosts, CONFIG.htSizeBoost);
    }
  }

  /* ---------------- drag = trackball orbit ------------------------------------ */
  viewport.addEventListener('pointerdown', (e) => {
    dragging = true;
    pointerId = e.pointerId;
    velX = velY = 0;
    lastPX = e.clientX; lastPY = e.clientY; lastT = performance.now();
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener('pointermove', (e) => {
    if (!dragging || e.pointerId !== pointerId) return;
    const now = performance.now();
    const dt = Math.max(now - lastT, 1);

    const dY =  (e.clientX - lastPX) * CONFIG.dragSensitivity;  // about screen Y
    const dX = -(e.clientY - lastPY) * CONFIG.dragSensitivity;  // about screen X

    pendingY += dY;
    pendingX += dX;
    velY = dY * (16 / dt);
    velX = dX * (16 / dt);

    lastPX = e.clientX; lastPY = e.clientY; lastT = now;
  });

  function endDrag(e){
    if (!dragging || (e && e.pointerId !== pointerId)) return;
    dragging = false;
    viewport.classList.remove('is-dragging');
    // hand the remaining momentum to the follower, which decays it smoothly
    pendingX += velX * CONFIG.inertiaGain;
    pendingY += velY * CONFIG.inertiaGain;
    velX = velY = 0;
    if (e && viewport.hasPointerCapture?.(e.pointerId)){
      viewport.releasePointerCapture(e.pointerId);
    }
    pointerId = null;
  }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  /* ---------------- wheel / pinch = dolly ------------------------------------- */
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetZoom = clamp(targetZoom + (-e.deltaY) * CONFIG.zoomStep * 0.16,
                       restZoom + CONFIG.zoomMin, restZoom + zoomMaxRel);
  }, { passive: false });

  let pinchDist = 0, pinchZoom = 0;
  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 2) return;
    const [a, b] = e.touches;
    pinchDist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
    pinchZoom = targetZoom;
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 2 || !pinchDist) return;
    e.preventDefault();
    const [a, b] = e.touches;
    const d = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
    targetZoom = clamp(pinchZoom + (d - pinchDist) * 2.2,
                       restZoom + CONFIG.zoomMin, restZoom + zoomMaxRel);
  }, { passive: false });

  viewport.addEventListener('touchend', () => { pinchDist = 0; }, { passive: true });

  /* ---------------- resize ----------------------------------------------------- */
  let resizeT;
  on(window, 'resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      const offset = targetZoom - restZoom;
      measure();
      layout();
      applyHalftoneStyle();
      targetZoom = clamp(restZoom + offset,
                         restZoom + CONFIG.zoomMin, restZoom + zoomMaxRel);
    }, 150);
  });

  /* ---------------- loop -------------------------------------------------------- */
  function frame(){
    /* Sampled here, not in render(): render() also runs from apply() and the
       tuner, and the ramp must advance exactly once per animation frame. */
    introK = introRamp();
    const dk = Math.max(0, introK - introPrevK);
    introPrevK = introK;

    /* The turn rides the same accumulator as the idle drift, so it eases
       through followEase and hands over to idleSpin seamlessly instead of
       stopping dead when the scale lands. Advancing by introTurn * dk makes
       the total exactly introTurn degrees however many frames that took. */
    if (!dragging) pendingY += CONFIG.idleSpin + CONFIG.introTurn * dk;

    // Take a fixed fraction of what's outstanding each frame. During a drag
    // that's a smooth follow; after release the same decay IS the inertia.
    const ax = pendingX * CONFIG.followEase;
    const ay = pendingY * CONFIG.followEase;

    if (ax || ay){
      pendingX -= ax;
      pendingY -= ay;
      // Pre-multiply: deltas act in camera space, so drag direction always
      // matches the screen no matter how the sphere is currently oriented.
      rot = mMul(mMul(mRotY(ay * DEG), mRotX(ax * DEG)), rot);
      if ((++frameCount & 63) === 0) rot = mOrthonormalize(rot);
    }

    zoom += (targetZoom - zoom) * CONFIG.zoomEase;
    pushHistory(performance.now());
    render();
  }

  render();
  let raf = 0, alive = true;
  if (hasGSAP) gsap.ticker.add(frame);
  else (function tick(){ if (!alive) return; frame(); raf = requestAnimationFrame(tick); })();

  /* ---------------- runtime API ------------------------------------------------
     Small hook for tweaking the sphere from the devtools console, e.g.
       SPHERE.config.idleSpin = 0.02; SPHERE.apply()
     Everything is already tuned, so this is only here for future iteration.
     Delete this block if you want the file to expose nothing globally. */
  window.SPHERE = {
    config: CONFIG,

    /* Re-apply after a config change. Rebuilds DOM only when the count
       changed, since that's the expensive path. */
    apply(rebuild){
      if (rebuild) buildItems();
      measure();
      layout();
      applyHalftoneStyle();          // depends on rasterQ, so after measure()
      targetZoom = clamp(targetZoom,
                         restZoom + CONFIG.zoomMin, restZoom + zoomMaxRel);
      render();
    },

    setPerspective(px){
      CONFIG.perspective = px;
      viewport.style.perspective = px + 'px';
      ghostVp.style.perspective = px + 'px';
      this.apply(false);
    },

    /* Re-read every ht* value onto the echo layer. */
    halftone(){ applyHalftoneStyle(); },

    /* Frame the sphere at rest again — handy after big geometry changes. */
    resetZoom(){ targetZoom = restZoom; },

    readout(){
      return {
        cardCss: `${itemW.toFixed(1)} x ${itemH.toFixed(1)}`,
        radius: Math.round(radius),
        zoom: Math.round(zoom),
        zoomRange: `${Math.round(restZoom + CONFIG.zoomMin)} .. ${Math.round(restZoom + zoomMaxRel)}`,
        rasterQ: rasterQ.toFixed(2),
      };
    },
  };

  return function destroy(){
    alive = false;
    cancelAnimationFrame(raf);
    if (hasGSAP) gsap.ticker.remove(frame);
    clearTimeout(resizeT);
    on.release();
    ghostVp.remove();
    /* Only surrender the global if this instance is the one still holding it —
       during a transition the incoming page has already claimed it. */
    if (window.SPHERE && window.SPHERE.config === CONFIG) delete window.SPHERE;
  };
});
