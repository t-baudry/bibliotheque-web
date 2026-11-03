/* ==========================================================================
   lightbox.js — click a picture, it comes to the middle; click again, it goes
   back to where it came from.

   ONE MODULE, TWO PAGES. The work grid and the gallery build different DOM for
   different reasons — the grid needs a cropped plate because thirty of them
   have to tile, the gallery needs a plane it can fly along a curve — but the
   thing being asked for is the same on both, so the difference is two lines of
   preset rather than two files.

   IT IS A FLIP, NOT A FADE. The picture is laid out at its FINAL position and
   size, then transformed back onto the card that was clicked, then released.
   The browser interpolates one transform and nothing re-lays-out, which is why
   this stays cheap on a page we spent a night measuring. A cross-fade between
   two elements would have been fewer lines and would have thrown away the one
   thing that makes it read as the same photograph rather than a second copy.

   THE SCALE IS UNIFORM, taken from the width alone. Scaling x and y
   separately would land the flight exactly on the card's rectangle, and would
   stretch the photograph the whole way there — the plate is cropped to a fixed
   frame and the opened picture is not, so the two aspect ratios genuinely
   differ. A uniform scale starts a few pixels off the card and never distorts,
   which is the trade worth making.

   WHY THE CARD IS REMEMBERED AT POINTERDOWN. js/work-grid.js calls
   root.setPointerCapture() the moment you press, and capture RETARGETS every
   later pointer event to the capturing element. So at pointerup the target is
   always the grid root and never a cell — `closest('.wgrid__cell')` there
   returns null on every click, which is exactly how this first shipped and
   exactly why it opened roughly never.

   Pointerdown is the one moment before capture exists, and this listener runs
   in the capture phase on window, so it sees the real element under the
   pointer before work-grid's own handler on root has run. That cell is kept
   and used on release. document.elementFromPoint is the belt to that braces:
   it is a hit test rather than an event, so pointer capture cannot touch it.

   Travel more than DRAG_SLOP between down and up and you were dragging the
   field, not choosing a picture.
   ========================================================================== */
window.PAGE.register('lightbox', function (scope) {
  'use strict';

  /* Per page: what counts as a picture, which <img> inside it is the real one,
     and how far the page falls back behind it. The work page is already almost
     black so it takes a heavier veil to read as a change at all; the gallery is
     a full red field, where the same value would bury it. */
  const PAGES = {
    design:  { pick: '.wgrid__cell', src: 'img:not(.wgrid__grey)', veil: 0.72,
               gradeFrom: '.wgrid',
               /* THE PICTURE'S GRAIN IS THE GALLERY'S, AND ONLY HERE. .grain is
                  one fixed layer over the whole site, so an opened picture is
                  already grained — but css/work-grid.css retunes that layer for
                  this page's near-black field (lighten, .06, contrast 50%), and
                  over a photograph those numbers come to almost nothing. This
                  puts the gallery's own setting back on the picture alone, so
                  the same photograph opened on either page arrives looking the
                  same. See css/lightbox.css. */
               grain: 0.13 },
    /* THE GALLERY IS DELIBERATELY BLANK HERE. Its page colour is js/tint.js's
       red sheet at z-index 55, and the whole reason this overlay sits at 56 is
       that the mock-ups open the picture ABOVE the tint, in its own colour.
       Matching a grade there would undo the one thing that layering is for. */
    gallery: { pick: '.pathg__it',   src: 'img',                   veil: 0.42,
               gradeFrom: '',
               /* NONE, BECAUSE THE PAGE ALREADY GIVES IT. This page does not
                  retune .grain, so its default — overlay at .13 — is falling on
                  the opened picture already. Adding the same layer again here
                  would give the gallery TWICE the grain of the work page, which
                  is the opposite of making them match. 0 is what "the same as
                  the gallery" means when you are already on the gallery. */
               grain: 0 },
  };
  const PRESET = PAGES[scope.dataset.page];
  if (!PRESET) return;

  const CONFIG = Object.assign({
    enabled: true,
    size:    0.74,     // longest side, as a share of the space above the bar
    veil:    0.6,      // how far the page falls back
    ms:      420,      // flight time each way
    ticks:   true,
    tickOut: 48,       // px the corner marks sit outside the picture
    openText:  'CLICK TO OPEN',    // hovering a picture, nothing up yet
    closeText: 'CLICK TO CLOSE',   // a picture is up
    ink:     'light',  // colour of the marks and the words

    /* ---- AN OPENED PICTURE IS THE FILE, AND THAT IS THE POINT --------------
       The work page's grid is graded: js/crt.js puts contrast and saturation
       on .wgrid as a real CSS `filter`, and the tube's scan lines and vignette
       sit over it. That grade is art direction and it stays — the field is
       meant to look like that.

       This overlay is appended to the PAGE, not to the grid, which is what
       lets it open above the gallery's tint, and it means an opened picture
       inherits none of that. Kept, deliberately. The field is the room; the
       opened picture is the work, and the one view somebody chose in order to
       look at a piece properly is the one place it should be shown in the
       colour its designer actually picked.

         raw    the file as it is · what a click is for
         match  the opened picture carries the grid's grade instead, read off
                the host's own computed filter, so it cannot fall out of step
                with whatever js/crt.js is set to

       The two together are also the only honest way to SEE the grade: open a
       picture and switch this. */
    grade:     'raw',
    gradeFrom: '',     // which element carries the grade · '' is none

    /* ---- THE PICTURE'S OWN GRAIN ---------------------------------------
       css/ui.css's values, which are the GALLERY's, applied on both pages —
       the work page retunes the site grain for a near-black field and that
       setting is right for the field and wrong for a photograph. */
    grain:           0,      // per page · see PAGES above
    grainSize:       5,      // em
    grainContrast:   300,    // %
    grainBrightness: 80,     // %
    grainBlend:      'overlay',

    /* ---- HOW FAR THE FILE MAY BE STRETCHED ------------------------------
       THE PICTURES ARE 1020px ON THE LONG EDGE. At `size` 0.74 an opened one
       is about 1094 CSS px wide on a 1512-wide laptop, and on a retina screen
       that is 2188 DEVICE pixels drawn from 1020 — the browser inventing every
       second pixel, twice over. That is the softness.

       This is the ceiling on that: 1 never stretches the file past its own
       resolution and is the sharpest possible picture, at the cost of it being
       physically smaller on a retina screen. Above 1 trades sharpness back for
       size. 0 turns the cap off and restores exactly the old behaviour.

       IT IS A CAP AND NOT A FIX. No amount of arithmetic adds detail that is
       not in the file. A picture that is both large AND sharp needs bigger
       files: tools/optimise-images.command already does the job, its LONG_EDGE
       is set to 1400, and these were made before that — 2400 would cover every
       screen this site is opened on. */
    maxUpscale: 1.5,
  }, PRESET);

  const DRAG_SLOP = 6;   // px of travel that still counts as a click
  const BAR_H     = 28;  // the bottom bar · the picture centres above it

  /* ---- the furniture ------------------------------------------------------ */
  const root = document.createElement('div');
  root.className = 'lbox';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML =
    '<div class="lbox__veil"></div>' +
    '<div class="lbox__box">' +
      '<img class="lbox__img" alt="" decoding="async">' +
      /* INSIDE THE BOX, ABOVE THE PICTURE. See the note in css/lightbox.css for
         why the picture needs a grain of its own rather than the page's. Inside
         the flying box, so it travels and scales with the photograph. */
      '<div class="lbox__grain" data-grain-animate="true"></div>' +
      '<i class="lbox__tick lbox__tick--tl"></i>' +
      '<i class="lbox__tick lbox__tick--tr"></i>' +
      '<i class="lbox__tick lbox__tick--bl"></i>' +
      '<i class="lbox__tick lbox__tick--br"></i>' +
    '</div>' +
    '<div class="lbox__label"></div>';
  scope.appendChild(root);

  const box   = root.querySelector('.lbox__box');
  const img   = root.querySelector('.lbox__img');
  const gr    = root.querySelector('.lbox__grain');
  const label = root.querySelector('.lbox__label');
  const ticks = root.querySelectorAll('.lbox__tick');

  let open = false, srcEl = null, flight = 0;
  /* The card the press landed on, taken before pointer capture can hide it.
     See the header. */
  let downCell = null, pressing = false, flyTimer = 0, flyRaf = 0;

  function apply(){
    const C = CONFIG;
    root.style.setProperty('--lbox-ms', C.ms + 'ms');
    root.style.setProperty('--lbox-veil', String(Math.max(0, Math.min(1, C.veil))));
    root.style.setProperty('--lbox-out', String(Math.max(0, C.tickOut)));
    root.classList.toggle('lbox--light', C.ink !== 'dark');
    root.classList.toggle('lbox--dark',  C.ink === 'dark');
    ticks.forEach(t => { t.style.display = C.ticks ? '' : 'none'; });
    root.style.setProperty('--lbox-grain', String(Math.max(0, Math.min(1, C.grain))));
    root.style.setProperty('--lbox-grain-size', C.grainSize + 'em');
    root.style.setProperty('--lbox-grain-contrast', C.grainContrast + '%');
    root.style.setProperty('--lbox-grain-brightness', C.grainBrightness + '%');
    root.style.setProperty('--lbox-grain-blend', C.grainBlend);
    if (gr) gr.style.display = C.grain > 0 ? '' : 'none';
    label.textContent = open ? C.closeText : C.openText;
    grade();
  }

  /* Read, never remembered. The host's filter is a string js/crt.js rewrites
     whenever its dials move, and a copy taken once at mount would be the value
     it happened to hold then. `none` is passed through as no filter at all
     rather than as the word: an identity filter still buys the element a
     render surface it has no use for. */
  function grade(){
    if (CONFIG.grade !== 'match' || !CONFIG.gradeFrom){ box.style.filter = ''; return; }
    const host = scope.querySelector(CONFIG.gradeFrom);
    const f = host ? getComputedStyle(host).filter : '';
    box.style.filter = (f && f !== 'none') ? f : '';
  }
  apply();

  /* ---- geometry ----------------------------------------------------------- */
  /* Where the picture ends up: as large as `size` allows inside the space above
     the bar, at the photograph's OWN aspect ratio rather than the plate's. */
  /* `real` says whether natW/natH are the FILE's dimensions or the fallback to
     the card's on-screen box. The cap below is a statement about the file, so
     applied to the fallback it would clamp an opened picture to the size of the
     thumbnail it came from — the one case where this would be catastrophic
     rather than merely wrong. */
  function destRect(natW, natH, real){
    const vw = window.innerWidth;
    const vh = window.innerHeight - BAR_H;
    const a  = (natW > 0 && natH > 0) ? natW / natH : 3 / 2;
    let w = vw * CONFIG.size;
    let h = w / a;
    if (h > vh * CONFIG.size){ h = vh * CONFIG.size; w = h * a; }

    /* THE CAP, IN DEVICE PIXELS AND NOT CSS ONES — which is the whole point.
       A CSS pixel is two device pixels on the screen this site is designed on,
       so a 1020px file drawn 1000 CSS px wide is being stretched twice over,
       not held at 1:1. devicePixelRatio is what turns the ceiling into the
       thing you can actually see. */
    const cap = Math.max(0, CONFIG.maxUpscale);
    if (real && cap > 0 && natW > 0){
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const maxW = natW * cap / dpr;
      if (w > maxW){ w = maxW; h = w / a; }
    }
    return { x: (vw - w) / 2, y: (vh - h) / 2, w, h };
  }

  function place(from, to, animate){
    box.style.left   = to.x + 'px';
    box.style.top    = to.y + 'px';
    box.style.width  = to.w + 'px';
    box.style.height = to.h + 'px';

    /* Uniform, from the width. See the note at the top of the file. */
    const k  = from.width / Math.max(to.w, 1);
    const tx = from.left - to.x;
    const ty = from.top  - to.y;

    box.style.transition = 'none';
    box.style.transform  = `translate(${tx}px, ${ty}px) scale(${k})`;
    /* Reading a layout property between the two writes is what forces the
       browser to treat them as two states rather than collapsing them into
       the final one. Without it there is no animation at all — the element
       simply appears where it was going. */
    void box.offsetWidth;
    if (animate){
      box.style.transition = `transform ${CONFIG.ms}ms cubic-bezier(.16,.84,.32,1)`;
      box.style.transform  = 'translate(0px, 0px) scale(1)';
    }
  }

  /* ---- open / close ------------------------------------------------------- */
  function show(cell){
    const im = cell.querySelector(CONFIG.src);
    /* `data-full` FIRST, AND ONLY THE GALLERY SETS IT. That page puts a 640px
       thumbnail on each of its three hundred and twenty planes so the field can
       rasterise cheaply — see the note by FULL in js/path-gallery.js — and
       writes the real photograph's path here. Opening one has to reach past the
       thumbnail or the picture would come up at a quarter of its resolution.
       Everywhere else there is no such attribute and this is the src it always
       was. */
    const url = im && (im.dataset.full || im.currentSrc || im.src);
    if (!url) return;

    srcEl = cell;
    img.src = url;
    /* THE FRAME IS SIZED FROM THE FILE BEING OPENED, not the one on the card.
       naturalWidth is the thumbnail's when there is a thumbnail, and the cap
       below is a statement about the file — measuring the wrong one would frame
       a 1500px photograph as though it were 640 and show it small. The real
       dimensions travel on the element beside the path, so nothing has to be
       loaded before the flight can be laid out. */
    const from = cell.getBoundingClientRect();
    const fw = parseFloat(im.dataset.fullW) || im.naturalWidth;
    const fh = parseFloat(im.dataset.fullH) || im.naturalHeight;
    const to = destRect(fw || from.width,
                        fh || from.height,
                        fw > 0 && fh > 0);

    place(from, to, true);
    cancelAnimationFrame(flyRaf);
    box.style.opacity = '';
    clearTimeout(flyTimer);
    root.classList.remove('is-flying');
    root.classList.add('is-open');
    grade();          // the panel may have moved it since the last open
    open = true;
    label.textContent = CONFIG.closeText;
    flight = performance.now() + CONFIG.ms;
  }

  function hide(){
    if (!open) return;
    open = false;

    /* THE CARD IS MOVING, SO THE FLIGHT HOME HAS TO FOLLOW IT.
       This used to hand the return to a CSS transition, with the card's
       rectangle read once at the moment of closing. On the work page the field
       drifts the whole time the picture is up, so by the time the transition
       landed — 420ms later — the card had moved on and the picture arrived at
       an empty patch of screen and then vanished. Correct arithmetic, wrong
       target: the rectangle was right when it was read and stale by the time
       it was used.

       Driven per frame instead, re-reading the card each time. It costs one
       getBoundingClientRect a frame for under half a second, and it is the
       difference between the picture going home and the picture going roughly
       where home used to be. */
    const from = { x: parseFloat(box.style.left), y: parseFloat(box.style.top),
                   w: parseFloat(box.style.width) };
    const card = srcEl;
    srcEl = null;

    root.classList.remove('is-open');
    root.classList.add('is-flying');
    clearTimeout(flyTimer);
    cancelAnimationFrame(flyRaf);
    box.style.transition = 'none';

    /* If the card has gone entirely there is nothing to fly to, so it just
       leaves. */
    if (!card || !card.isConnected){
      root.classList.remove('is-flying');
      label.textContent = CONFIG.openText;
      return;
    }

    const t0 = performance.now();
    const ms = Math.max(80, CONFIG.ms);
    /* The same curve the way out uses, so the two halves feel like one move. */
    const ease = t => 1 - Math.pow(1 - t, 3);

    (function step(now){
      const t = Math.min(1, (now - t0) / ms);
      const e = ease(t);
      const r = card.getBoundingClientRect();
      if (r.width > 0){
        const k = 1 + (r.width / Math.max(from.w, 1) - 1) * e;
        box.style.transform =
          `translate(${(r.left - from.x) * e}px, ${(r.top - from.y) * e}px) scale(${k})`;
      }
      /* FADED OUT OVER THE LAST FIFTH, not cut. The card underneath is still
         being drawn, so the two are briefly the same picture in the same place
         — which is exactly when to stop showing one of them. Cutting instead
         is a visible pop even when the geometry is perfect. */
      box.style.opacity = String(1 - Math.max(0, (t - 0.8) / 0.2));

      if (t < 1){ flyRaf = requestAnimationFrame(step); return; }
      root.classList.remove('is-flying');
      box.style.opacity = '';
      box.style.transition = '';
    })(t0);

    label.textContent = CONFIG.openText;
  }

  /* ---- input -------------------------------------------------------------- */
  let downX = 0, downY = 0;

  /* A hit test rather than an event, so pointer capture cannot redirect it and
     pointer-events:none on the world is still honoured. This is what finds the
     card under the cursor for the hover words, and the fallback for opening. */
  function pickAt(x, y){
    const el = document.elementFromPoint(x, y);
    const cell = el && el.closest && el.closest(CONFIG.pick);
    return (cell && scope.contains(cell)) ? cell : null;
  }

  function onDown(e){
    downX = e.clientX; downY = e.clientY;
    pressing = true;
    /* THE ONE MOMENT BEFORE CAPTURE EXISTS. See the header. */
    downCell = (e.target.closest && e.target.closest(CONFIG.pick)) || pickAt(e.clientX, e.clientY);
    if (downCell && !scope.contains(downCell)) downCell = null;
  }

  function onUp(e){
    const dragged = Math.hypot(e.clientX - downX, e.clientY - downY) > DRAG_SLOP;
    pressing = false;
    const cell = downCell; downCell = null;
    if (!CONFIG.enabled) return;

    if (open){
      /* Ignore the tail of the very gesture that opened it. */
      if (performance.now() < flight - CONFIG.ms + 80) return;
      hide();
      root.classList.remove('is-hot');
      return;
    }
    if (dragged) return;
    const target = cell || pickAt(e.clientX, e.clientY);
    if (target) show(target);
  }

  function onMove(e){
    /* The words track the pointer in both states, and flip to its other side
       near the right edge so they never run off the screen. */
    const w = label.offsetWidth || 90;
    const x = (e.clientX + 18 + w > window.innerWidth) ? e.clientX - 18 - w : e.clientX + 18;
    label.style.transform = `translate3d(${x}px, ${e.clientY - 16}px, 0)`;

    if (open) return;
    /* CLICK TO OPEN, but not while the field is being dragged past — the words
       would be inviting a click that the drag guard is about to refuse. */
    const hot = CONFIG.enabled && !pressing && !!pickAt(e.clientX, e.clientY);
    root.classList.toggle('is-hot', hot);
  }

  function onKey(e){ if (e.key === 'Escape') hide(); }

  const on = window.PAGE.bindings();
  on(window, 'pointerdown', onDown, true);
  on(window, 'pointerup',   onUp,   true);
  on(window, 'pointermove', onMove, true);
  on(window, 'keydown',     onKey);
  on(window, 'pointerleave', () => root.classList.remove('is-hot'));
  on(window, 'blur',         () => { pressing = false; root.classList.remove('is-hot'); });

  /* ---- the panel ---------------------------------------------------------- */
  window.LIGHTBOX = {
    config: CONFIG,
    apply,
    close: hide,
    readout(){ return { lightbox: open ? 'open' : (CONFIG.enabled ? 'ready' : 'off') }; },
    rows(){
      const C = CONFIG, self = this;
      return [
        { label: 'lbox.enabled', options: ['on', 'off'],
          get: () => (C.enabled ? 'on' : 'off'),
          set: v => { C.enabled = v === 'on'; if (!C.enabled) hide(); },
          hint: 'click a picture to bring it to the middle · off leaves the field as a field' },
        { label: 'lbox.sharp', min: 0, max: 4, step: 0.05,
          get: () => C.maxUpscale, set: v => { C.maxUpscale = v; self.apply(); },
          hint: 'HOW FAR THE FILE MAY BE STRETCHED · the work pictures are 1020px on the long edge, and at `size` alone an opened one is drawn at about 2.1x that on a retina screen — every second pixel invented, which is the softness · 1.5 is the knee where a photograph stops looking stretched · 0 turns the ceiling off · it can only ever make the picture SMALLER, so for one that is both large and sharp the files need re-exporting bigger (tools/optimise-images.command, LONG_EDGE)' },
        { label: 'lbox.grain', min: 0, max: 0.5, step: 0.005,
          get: () => C.grain, set: v => { C.grain = v; self.apply(); },
          hint: 'the opened picture’s OWN grain, over and above the page’s · the work page retunes the site grain for its near-black field (lighten, .06) and over a photograph that comes to almost nothing, so the picture carries the gallery’s setting instead — .13 overlay · on the GALLERY this ships at 0, because that page’s own grain is already exactly that and doubling it would be the opposite of matching' },
        { label: 'lbox.size', min: 0.3, max: 1, step: 0.01,
          get: () => C.size, set: v => { C.size = v; self.apply(); },
          hint: 'the opened picture’s longest side, as a share of the space above the bar · it keeps the photograph’s own proportions, so this is a ceiling rather than a size' },
        { label: 'lbox.veil', min: 0, max: 1, step: 0.01,
          get: () => C.veil, set: v => { C.veil = v; self.apply(); },
          hint: 'how far the page falls back · the work page starts near black so it needs more of this to read as a change at all, the gallery is a full red field and the same value would bury it' },
        { label: 'lbox.ms', min: 120, max: 1200, step: 10,
          get: () => C.ms, set: v => { C.ms = v; self.apply(); },
          hint: 'the flight, each way · the picture travels from the card to the middle rather than fading in, which is what keeps it the same photograph instead of a second copy of one' },
        { label: 'lbox.ticks', options: ['on', 'off'],
          get: () => (C.ticks ? 'on' : 'off'),
          set: v => { C.ticks = v === 'on'; self.apply(); },
          hint: 'the four corner marks · the same ones the grid puts on its cells' },
        { label: 'lbox.tickOut', min: 0, max: 160, step: 1,
          get: () => C.tickOut, set: v => { C.tickOut = v; self.apply(); },
          hint: 'how far outside the picture those marks sit · at 0 they touch the corners, higher and they frame it at a distance' },
        { label: 'lbox.grade', options: ['match', 'raw'],
          get: () => C.grade, set: v => { C.grade = v; self.apply(); },
          hint: 'RAW is the shipped one: the field is graded — js/crt.js pushes contrast and saturation across the whole grid — and an opened picture is deliberately NOT, so the piece you clicked is shown in the colour its designer chose · MATCH makes it carry the grid’s grade instead, whatever that grade currently is · switching between the two on an open picture is also the only way to see exactly what the grade is doing' },
        { label: 'lbox.ink', options: ['light', 'dark'],
          get: () => C.ink, set: v => { C.ink = v; self.apply(); },
          hint: 'the marks and the words · light on both pages as drawn, dark only if a page ever goes pale behind them' },
      ];
    },
  };

  return function destroy(){
    on.release();
    cancelAnimationFrame(flyRaf);
    clearTimeout(flyTimer);
    if (root.parentNode) root.parentNode.removeChild(root);
    if (window.LIGHTBOX && window.LIGHTBOX.config === CONFIG) delete window.LIGHTBOX;
  };
});
