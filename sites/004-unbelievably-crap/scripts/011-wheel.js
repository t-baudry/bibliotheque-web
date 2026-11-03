/* ==========================================================================
   wheel.js — horizontal card wheel

   GEOMETRY
   Cards sit around a HORIZONTAL ring (axis vertical, like a carousel). Each
   card is written as

       rotateY(theta) translateZ(radius) rotateY(cardYaw)

   The first two put it on the ring facing outward along its radius; the
   trailing rotateY turns it on its own vertical axis. At cardYaw 90 the card
   is TANGENTIAL — face-on at the left and right extremes of the ellipse,
   knife-thin at the near and far points. That is what the reference shows.
   At cardYaw 0 it would be radial, which reads as a flat rosette instead.

   The whole ring is then tilted toward the camera by `tilt`, which is what
   turns the circle into the wide ellipse AND which side you view it from:
   negative looks DOWN on the ring from above, positive looks UP at it from
   below, 0 is edge-on. cardYaw does not affect the viewpoint.

   INTERACTION
   Wheel-scroll and horizontal drag both feed the same spin accumulator, so
   they compose rather than fight. Spin is a single axis — no trackball here,
   because a carousel only has one meaningful degree of freedom.

   Pointer adds SEPARATE, eased offsets on top (see mouseMode): horizontal
   movement drives spin, vertical movement drives tilt — so the cursor can
   swing the ring and change the viewing elevation at once. They are kept
   apart from the scroll/drag accumulator so 'position' mode can ease back
   to neutral without corrupting it.

   SHARPNESS
   Same trick as the sphere: each card is laid out `rasterQ` times larger and
   scaled back down, so the browser rasterises the photo near the size it
   actually reaches rather than magnifying a small bitmap.
   LIFECYCLE
   Registered with js/lifecycle.js rather than run on load. Almost everything
   below binds to `viewport`, which is inside the Barba container and dies
   with it — the destroy function at the bottom only has to undo the three
   things that outlive it: the window resize listener, the GSAP ticker
   callback, and window.WHEEL. Elements are looked up inside `scope` because
   during a transition BOTH containers are in the document and a plain
   getElementById would hand this page the outgoing page's stage.
   ========================================================================== */
window.PAGE.register('wheel', function (scope) {
  'use strict';

  const viewport = scope.querySelector('#wheelViewport');
  const stage = scope.querySelector('#wheelStage');
  if (!viewport || !stage) return;

  const on = window.PAGE.bindings();

  const SOURCES = [
    'assets/wheel/generator-foliage.jpg',
    'assets/wheel/shelf-plant.jpg',
    'assets/wheel/generator-red.jpg',
    'assets/wheel/mirror.jpg',
    'assets/wheel/dayday.jpg',
    'assets/wheel/pingpong-net.jpg',
    'assets/wheel/pingpong-net-tall.jpg',
    'assets/wheel/pingpong-paddle.jpg',
    'assets/wheel/basket-light.jpg',
    'assets/wheel/plant-beam.jpg',
    'assets/wheel/iced-coffee.jpg',
    'assets/wheel/shelf-silhouette.jpg',
    'assets/wheel/yellow-car.jpg',
  ];

  /* Coprime stride so repeats of the same photo don't land in a run —
     with 13 sources over ~40 cards, plain cycling is very visible. */
  const gcd = (a,b) => b ? gcd(b, a%b) : a;
  function sourceFor(i){
    const n = SOURCES.length;
    let s = Math.max(2, Math.round(n * 0.618));
    while (gcd(s, n) !== 1) s++;
    return SOURCES[(i * s) % n];
  }

  const CONFIG = {
    /* One dial for overall wheel size. It scales radius, card AND
       perspective together. Scaling perspective matters: projected size is
       (2r*P)/(P-z), so scaling r and P by the same factor scales the result
       by that factor while keeping the perspective character identical.
       Without it, `size` does nothing past the point where nearLimit caps
       the radius — at perspective 600 that ceiling is 480px, which the
       shipped radius already reaches. */
    size: 1.52,

    // ---- ring ----
    itemCount: 93,
    radius: 690,           // ring radius in px, before the viewport fit
    fitRadius: true,       // scale radius with the viewport
    radiusOfViewport: 0.315,// radius as a share of min(vw,vh) when fitRadius
    /* Camera elevation, and the ONLY control that moves the viewpoint.
       NEGATIVE looks down on the ring from above; positive looks up at it
       from below; 0 is edge-on. (cardYaw does not do this — it only spins
       each card on its own axis.)
       Note it is NOT asin(ellipse ratio): the silhouette includes the card
       extents, not just the bare ring, so that trig runs several degrees
       too steep. */
    tilt: -16.5,
    /* Vertical placement of the whole ring, in px, positive = down. The stage
       is anchored at the viewport centre; this nudges it off that so the ring
       can be optically centred against the copy and the bottom bar rather
       than geometrically centred in the window. */
    offsetY: 0,
    cardYaw: 90,           // 90 = tangential (reference), 0 = radial
    cardLean: 1,           // extra rotateX per card, degrees
    perspective: 600,     // MUST match .wheel-viewport perspective in CSS

    // ---- cards ----
    cardWidth: 74,        // px — ~0.35 of the ring radius, per the reference
    cardAspect: 0.625,     // height / width — landscape 3:2
    cardRadius: 0,         // corner rounding — square corners, no radius

    /* ---- CARD SHAPE ----
       The card is a box with an image in it and `overflow:hidden`; the shape
       is a clip-path over that, generated here rather than written out as CSS
       so `sides`, `rotate` and the rest are real numbers you can drag.

       rectangle costs nothing — no clip-path at all, and cardRadius above
       still rounds it. Everything else is one polygon per card; with ninety
       cards that is ninety clip paths for the compositor to respect, which is
       cheap but not free, so rectangle stays the default.

       `custom` hands the whole of CSS clip-path over: paste any value —
       circle(), path(), a polygon of your own — and it is used verbatim. That
       is there because no list of shapes I write will be the one you want on
       the third try. */
    cardShape: 'rectangle', // rectangle · ellipse · polygon · star · arch ·
                            // chevron · cross · custom
    cardSides: 3,          // for polygon and star · 3 is a triangle
    cardShapeRotate: 0,    // turn the shape inside the card, in degrees
    cardStar: 0.45,        // a star's inner radius · low is spiky
    cardInset: 0,          // shrink the shape inside the card box, in percent
    /* STRETCH fills the card, so a triangle in a landscape card is a wide
       triangle. KEEP holds the shape's own proportions and lets the card's
       spare width go empty — which is the difference between "a triangular
       card" and "a triangle on a card". */
    cardShapeFit: 'stretch',
    /* Per-card variety, keyed off the card's INDEX rather than a random, so a
       card keeps its shape across a rebuild instead of reshuffling every time
       the ring is re-laid. */
    cardShapeVary: 'off',  // off · rotation · sides · shape
    cardShapeVaryAmt: 1.0,
    cardClip: '',          // the raw clip-path used when cardShape is custom
    rasterTargetPx: 660,   // raster size when a card is near the camera

    // ---- motion ----
    scrollSensitivity: 0.06,  // deg of spin per wheel delta unit
    dragSensitivity: 0.02,    // deg of spin per px dragged
    followEase: 0.02,         // how fast spin catches up
    inertiaGain: 0,           // throw on release
    idleSpin: 0.02,           // deg/frame when untouched

    /* ---- pointer ----
       'position' maps the pointer's horizontal position across the viewport
       to an absolute rotation offset, eased — the wheel leans toward the
       cursor and returns to neutral when it re-centres or leaves.
       'drive' instead feeds pointer MOVEMENT into the spin accumulator, so
       the wheel keeps turning as long as you keep moving, like dragging
       without holding the button. 'off' disables it. */
    mouseMode: 'drive',   // off | position | drive
    mouseRange: 0,          // X: deg of SPIN from centre to edge ('position')
    mouseRangeY: 0,         // Y: deg of TILT from centre to edge ('position')
    mouseDrive: 0.05,        // X: deg of spin per px moved ('drive')
    mouseDriveY: 0,       // Y: deg of tilt per px moved ('drive')
    mouseEase: 0.01,         // how fast the offset follows the pointer
    mouseReturn: true,       // recentre when the pointer leaves
    /* Bounds the POINTER's contribution to tilt only — not `tilt` itself.
       It used to clamp the total, which quietly capped the camera elevation
       at +/-10 degrees no matter what `tilt` said: -16.5, -40 and -90 all
       rendered as -10, which is exactly why the slider appeared to stop
       responding past a point. `tilt` is now free across its full -90..90;
       this still stops the cursor from swinging the ring through edge-on. */
    tiltClamp: 10,

    /* Nearest card is held to this fraction of `perspective`. Without it a
       radius at or past the perspective distance puts cards ON or BEHIND the
       camera plane, where the projection blows up — one card then covers the
       whole screen. At perspective 600 this caps the ring radius at 480. */
    nearLimit: 0.8,

    /* ---- intro ----
       The ring arrives collapsed at the centre and grows out, copying the
       reference component's entry. `introFrom` is the scale it starts at, so
       0.02 is "a dot"; set introMs to 0 to switch the whole thing off. Held
       until the loader hands off — see PAGE.intro in js/lifecycle.js. */
    introMs: 1800,
    introFrom: 0.02,
    /* Total degrees of extra turn across the expansion — the ring arrives
       turning, not just scaling. A TOTAL, not a per-frame rate: see the longer
       note on introTurn in js/sphere-gallery.js for why. */
    introTurn: 90,

    // ---- dolly ----
    zoom: 0,
    zoomMin: -700,
    zoomMax: 500,
    /* The shift-wheel dolly. Off: see the wheel handler. */
    zoomWheel: false,
    zoomStep: 0.6,
    zoomEase: 0.1,
  };

  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
  const hasGSAP = typeof window.gsap !== 'undefined';

  /* ---------------- geometry ---------------------------------------------- */
  let radius, cardW, cardH, rasterQ, invQ, persp, nearCap = Infinity, radiusClamped = false;

  function measure(){
    const fit = Math.min(window.innerWidth, window.innerHeight);
    radius = (CONFIG.fitRadius
      ? clamp(fit * CONFIG.radiusOfViewport, 120, 900)
      : CONFIG.radius) * CONFIG.size;
    // perspective scales with size, so the cap scales with it too
    persp = CONFIG.perspective * CONFIG.size;
    nearCap = persp * CONFIG.nearLimit;
    radiusClamped = radius > nearCap;
    radius = Math.min(radius, nearCap);
    cardW = CONFIG.cardWidth * CONFIG.size;
    cardH = cardW * CONFIG.cardAspect;
    rasterQ = clamp(CONFIG.rasterTargetPx / cardW, 1, 8);
    invQ = 1 / rasterQ;
    viewport.style.perspective = persp.toFixed(1) + 'px';
  }

  /* ---------------- build --------------------------------------------------- */
  const items = [];

  function build(){
    items.forEach(el => el.remove());
    items.length = 0;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < CONFIG.itemCount; i++){
      const el = document.createElement('div');
      el.className = 'wheel-card';
      el.dataset.index = i;
      const img = document.createElement('img');
      img.src = sourceFor(i);
      img.alt = '';
      img.draggable = false;
      el.appendChild(img);
      frag.appendChild(el);
      items.push(el);
    }
    stage.appendChild(frag);
    // pixelated reveal, staggered so 50 cards don't all spawn canvases on
    // the same frame
    items.forEach((el, i) => window.PIXELATE?.attach(el, { delay: i * 16 }));
  }

  /* ---- the shapes ---------------------------------------------------------
     All of them are polygons in PERCENT of the card box, so they follow the
     card whatever size the ring scales it to. Points run clockwise from the
     top, which is what makes `rotate` turn the way a dial should. */
  const SHAPES = ['rectangle','ellipse','polygon','star','arch','chevron','cross'];

  function ptsToClip(pts, inset, fit){
    const k = Math.max(0, Math.min(48, inset)) / 100;
    const sx = (1 - k) * (fit === 'keep' ? CONFIG.cardAspect : 1);
    const sy = (1 - k);
    return 'polygon(' + pts.map(([x, y]) =>
      `${(50 + x * 50 * sx).toFixed(2)}% ${(50 + y * 50 * sy).toFixed(2)}%`
    ).join(', ') + ')';
  }

  function ringPts(n, rotDeg, inner){
    const out = [];
    const N = inner > 0 ? n * 2 : n;
    for (let k = 0; k < N; k++){
      const a = (k / N) * Math.PI * 2 - Math.PI / 2 + rotDeg * Math.PI / 180;
      const r = (inner > 0 && k % 2) ? inner : 1;
      out.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
    return out;
  }

  function shapePts(kind, sides, rotDeg, star){
    const n = Math.max(3, Math.round(sides));
    if (kind === 'polygon') return ringPts(n, rotDeg, 0);
    if (kind === 'star')    return ringPts(n, rotDeg, Math.max(0.05, Math.min(0.95, star)));
    if (kind === 'arch'){
      /* Flat bottom, domed top. The dome is sixteen points because a clip-path
         has no arcs — few enough to stay cheap, enough that the curve does not
         read as a polygon at card size. */
      const p = [[-1, 1], [-1, 0]];
      for (let k = 0; k <= 16; k++){
        const a = Math.PI - (k / 16) * Math.PI;
        p.push([Math.cos(a), -Math.sin(a) * 1.0]);
      }
      p.push([1, 1]);
      return p;
    }
    if (kind === 'chevron') return [[-1,-1], [0,-0.35], [1,-1], [1,1], [0,0.35], [-1,1]];
    if (kind === 'cross'){
      const t = 0.34;
      return [[-t,-1], [t,-1], [t,-t], [1,-t], [1,t], [t,t],
              [t,1], [-t,1], [-t,t], [-1,t], [-1,-t], [-t,-t]];
    }
    return null;
  }

  /* A card's own look, from its index. Deterministic and cheap: no random, so
     nothing reshuffles when the ring rebuilds. */
  /* Returns { clip, radius } — a card is shaped by ONE of the two, and which
     one matters for what it costs. See the ellipse branch below. */
  function styleFor(i){
    const C = CONFIG;
    let kind = C.cardShape;
    if (kind === 'custom') return { clip: String(C.cardClip || '') };
    if (kind === 'rectangle') return {};

    let sides = C.cardSides, rot = C.cardShapeRotate;
    const v = Math.max(0, C.cardShapeVaryAmt);
    if (C.cardShapeVary !== 'off' && v > 0){
      // a cheap deterministic hash of the index, 0..1
      const h = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
      if (C.cardShapeVary === 'rotation') rot += (h - 0.5) * 360 * v;
      if (C.cardShapeVary === 'sides')    sides = 3 + Math.round(h * v * (sides - 3));
      if (C.cardShapeVary === 'shape'){
        const pool = SHAPES.slice(1);            // everything but rectangle
        kind = pool[Math.floor(h * pool.length) % pool.length];
      }
    }

    if (kind === 'ellipse'){
      /* BORDER-RADIUS, NOT clip-path. The card already has overflow:hidden, so
         a 50% radius rounds it to an ellipse — and the compositor treats a
         rounded corner as a cheap clip on a layer it already has, where a
         clip-path forces a mask layer per card. With ninety cards on a turning
         3D ring that difference measured at four and a half times the frame
         rate on this page. Same picture, and it is the shape most likely to be
         left on, so it gets the cheap path.

         An inset ellipse still needs the real clip-path: border-radius cannot
         shrink the shape inside the box, only round its corners. */
      const k = Math.max(0, Math.min(48, C.cardInset)) / 100;
      if (k <= 0.0001 && C.cardShapeFit !== 'keep') return { radius: '50%' };
      const rx = 50 * (1 - k) * (C.cardShapeFit === 'keep' ? C.cardAspect : 1);
      const ry = 50 * (1 - k);
      return { clip: `ellipse(${rx.toFixed(2)}% ${ry.toFixed(2)}% at 50% 50%)` };
    }
    const pts = shapePts(kind, sides, rot, C.cardStar);
    return { clip: pts ? ptsToClip(pts, C.cardInset, C.cardShapeFit) : '' };
  }

  function layout(){
    const step = 360 / CONFIG.itemCount;
    for (let i = 0; i < items.length; i++){
      const el = items[i];
      el.style.setProperty('--card-w', `${(cardW * rasterQ).toFixed(2)}px`);
      el.style.setProperty('--card-h', `${(cardH * rasterQ).toFixed(2)}px`);
      el.style.setProperty('--card-r', `${(CONFIG.cardRadius * rasterQ).toFixed(2)}px`);
      /* Written only when it CHANGES. Assigning the same clip-path string every
         layout is a style invalidation on ninety elements for no new pixels,
         and layout runs on every resize and every panel move. */
      const sh = styleFor(i);
      const clip = sh.clip || '';
      if (el.dataset.clip !== clip){
        el.dataset.clip = clip;
        el.style.clipPath = clip;
      }
      /* The shape's own radius wins over cardRadius when it has one; the
         ellipse is a radius, not a clip. */
      const rad = sh.radius || '';
      if (el.dataset.rad !== rad){
        el.dataset.rad = rad;
        el.style.borderRadius = rad;
      }
      el.style.transform =
        `rotateY(${(i * step).toFixed(3)}deg) translateZ(${radius.toFixed(2)}px) ` +
        `rotateY(${CONFIG.cardYaw}deg) rotateX(${CONFIG.cardLean}deg) ` +
        `scale(${invQ.toFixed(5)}) translate(-50%, -50%)`;
    }
  }

  /* ---------------- state ---------------------------------------------------- */
  let spin = 0, pendingSpin = 0, spinVel = 0;
  let zoom = CONFIG.zoom, targetZoom = CONFIG.zoom;
  let dragging = false, pointerId = null, lastX = 0, lastT = 0;

  /* Pointer contribution is kept SEPARATE from `spin` rather than folded
     into it. In 'position' mode it's an absolute offset that has to be able
     to ease back to zero; if it were added into the accumulator the wheel
     could never return, and scroll/drag would drift every time the pointer
     moved. */
  let mouseNX = 0, mouseNY = 0;     // pointer across the viewport, -1..1
  let mouseOffset = 0;              // X, eased -> spin
  let tiltOffset = 0;               // Y, eased -> tilt
  let tiltDrive = 0, pendingTilt = 0;   // Y in 'drive' mode
  let lastMouseX = null, lastMouseY = null;

  const introRamp = window.PAGE.intro(CONFIG.introMs);
  let introK = 0, introPrevK = 0;     // sampled once per frame, read by render

  function render(){
    const totalSpin = spin + mouseOffset;
    // clamp the pointer's contribution, then add the base — see tiltClamp
    const totalTilt = CONFIG.tilt +
      clamp(tiltOffset + tiltDrive, -CONFIG.tiltClamp, CONFIG.tiltClamp);

    /* scale3d FIRST, so it scales the translateZ too and the ring collapses
       toward the origin rather than shrinking in place at its full depth.
       Uniform scale commutes with the rotations, so nothing about the tuned
       geometry changes once it reaches 1. */
    const k = CONFIG.introFrom + (1 - CONFIG.introFrom) * introK;

    /* offsetY is applied OUTSIDE the intro scale, in screen space: inside it
       the nudge would shrink along with the ring and the wheel would slide
       into position as it grew. */
    stage.style.transform =
      `translate3d(0, ${CONFIG.offsetY.toFixed(1)}px, 0) ` +
      `scale3d(${k.toFixed(4)}, ${k.toFixed(4)}, ${k.toFixed(4)}) ` +
      `translateZ(${zoom.toFixed(2)}px) rotateX(${totalTilt.toFixed(3)}deg) ` +
      `rotateY(${totalSpin.toFixed(3)}deg)`;
  }

  /* ---------------- drag ------------------------------------------------------ */
  viewport.addEventListener('pointerdown', e => {
    dragging = true;
    pointerId = e.pointerId;
    spinVel = 0;
    lastX = e.clientX;
    lastT = performance.now();
    viewport.classList.add('is-dragging');
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener('pointermove', e => {
    /* pointer tracking runs whether or not a drag is in progress */
    const rect = viewport.getBoundingClientRect();
    mouseNX = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    mouseNY = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);

    if (CONFIG.mouseMode === 'drive' && !dragging){
      if (lastMouseX !== null) pendingSpin += (e.clientX - lastMouseX) * CONFIG.mouseDrive;
      if (lastMouseY !== null) pendingTilt += (e.clientY - lastMouseY) * CONFIG.mouseDriveY;
    }
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    if (!dragging || e.pointerId !== pointerId) return;
    const now = performance.now();
    const dt = Math.max(now - lastT, 1);
    const d = (e.clientX - lastX) * CONFIG.dragSensitivity;
    pendingSpin += d;
    spinVel = d * (16 / dt);
    lastX = e.clientX;
    lastT = now;
  });

  viewport.addEventListener('pointerleave', () => {
    lastMouseX = null; lastMouseY = null;
    if (CONFIG.mouseReturn){ mouseNX = 0; mouseNY = 0; }
  });

  function endDrag(e){
    if (!dragging || (e && e.pointerId !== pointerId)) return;
    dragging = false;
    viewport.classList.remove('is-dragging');
    pendingSpin += spinVel * CONFIG.inertiaGain;   // throw
    spinVel = 0;
    if (e && viewport.hasPointerCapture?.(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
    pointerId = null;
  }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  /* ---------------- wheel ------------------------------------------------------
     Scroll spins the ring. Shift+scroll dollies instead, so the depth control
     is still reachable without stealing the primary gesture. */
  viewport.addEventListener('wheel', e => {
    e.preventDefault();
    /* THE DOLLY IS OFF, AND SHIFT FALLS THROUGH TO THE SPIN. Same reasoning as
       js/mask.js's: a modifier that silently resizes the scene is a tuning
       control, not a visitor's. Turning it off without this `else` would have
       left shift+wheel doing NOTHING here, which reads as a frozen page rather
       than as a disabled feature — so with the dolly off the gesture is simply
       an ordinary wheel. CONFIG.zoomWheel brings it back. */
    if (CONFIG.zoomWheel && e.shiftKey){
      targetZoom = clamp(targetZoom + (-e.deltaY) * CONFIG.zoomStep * 0.2,
                         CONFIG.zoomMin, CONFIG.zoomMax);
    } else {
      pendingSpin += e.deltaY * CONFIG.scrollSensitivity;
    }
  }, { passive: false });

  /* ---------------- resize ------------------------------------------------------ */
  let rt;
  on(window, 'resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { measure(); layout(); render(); }, 150);
  });

  /* ---------------- loop --------------------------------------------------------- */
  function frame(){
    /* Sampled here, not in render(): render() also runs from apply() and the
       tuner, and the ramp must advance exactly once per animation frame. */
    introK = introRamp();
    const dk = Math.max(0, introK - introPrevK);
    introPrevK = introK;

    if (!dragging) pendingSpin += CONFIG.idleSpin;

    /* Applied straight to `spin`, NOT through pendingSpin — the one place this
       module bypasses the accumulator, and deliberately.

       followEase here is 0.02: the accumulator surrenders 2% of what it holds
       per frame, which is what gives the drag its long, heavy glide. Feeding a
       timed intro through that stretches it far past the ramp — measured 34
       of 90 degrees delivered by the time the scale had already landed, with
       the rest trailing in over the next several seconds. Straight onto spin,
       the turn follows the ramp's own ease-out exactly and finishes with it.
       The sphere keeps the accumulator route because its followEase is 0.25,
       where the lag is about four frames. */
    if (!dragging) spin += CONFIG.introTurn * dk;

    // take a fixed fraction each frame: a smooth follow during a drag, and
    // the same decay IS the inertia after release
    const step = pendingSpin * CONFIG.followEase;
    if (step){ pendingSpin -= step; spin += step; }

    const pos = CONFIG.mouseMode === 'position';
    mouseOffset += ((pos ? mouseNX * CONFIG.mouseRange  : 0) - mouseOffset) * CONFIG.mouseEase;
    tiltOffset  += ((pos ? mouseNY * CONFIG.mouseRangeY : 0) - tiltOffset)  * CONFIG.mouseEase;

    const tStep = pendingTilt * CONFIG.followEase;
    if (tStep){ pendingTilt -= tStep; tiltDrive += tStep; }

    // the dolly must respect the same near plane as the radius
    targetZoom = Math.min(targetZoom, nearCap - radius);
    zoom += (targetZoom - zoom) * CONFIG.zoomEase;
    render();
  }

  measure();
  build();
  layout();
  render();
  let raf = 0, alive = true;
  if (hasGSAP) gsap.ticker.add(frame);
  else (function tick(){ if (!alive) return; frame(); raf = requestAnimationFrame(tick); })();

  /* ---------------- tuning API ---------------------------------------------------- */
  window.WHEEL = {
    config: CONFIG,
    apply(rebuild){
      if (rebuild) build();
      measure();
      layout();
      targetZoom = clamp(targetZoom, CONFIG.zoomMin, CONFIG.zoomMax);
      render();
    },
    resetView(){ spin = 0; pendingSpin = 0; spinVel = 0; targetZoom = 0;
                 mouseNX = 0; mouseNY = 0; mouseOffset = 0; tiltOffset = 0;
                 tiltDrive = 0; pendingTilt = 0;
                 lastMouseX = null; lastMouseY = null; },
    readout(){
      return {
        cards: items.length,
        card: `${cardW.toFixed(0)}x${cardH.toFixed(0)}`,
        radius: Math.round(radius) + (radiusClamped ? ' (capped)' : ''),
        spin: `${(((spin % 360) + 360) % 360).toFixed(0)}°`,
        mouse: `${mouseOffset.toFixed(0)}° / ${(tiltOffset + tiltDrive).toFixed(0)}°`,
        tilt: `${(CONFIG.tilt + clamp(tiltOffset + tiltDrive, -CONFIG.tiltClamp, CONFIG.tiltClamp)).toFixed(1)}°`,
        rasterQ: rasterQ.toFixed(2),
      };
    },
  };

  return function destroy(){
    alive = false;
    cancelAnimationFrame(raf);
    if (hasGSAP) gsap.ticker.remove(frame);
    clearTimeout(rt);
    on.release();
    /* Only surrender the global if this instance is the one still holding it —
       during a transition the incoming page has already claimed it. */
    if (window.WHEEL && window.WHEEL.config === CONFIG) delete window.WHEEL;
  };
});
