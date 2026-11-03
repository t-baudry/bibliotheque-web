/* ==========================================================================
   loader.js — the intro loader.

   THE SEQUENCE (the client's five steps)
     1. copy blurs in                     — the site's own .anim-line reveal
     2. the percentage counts
     3. the copy travels left -> right and exits, while the red line at the
        bottom grows with the percentage
     4. at 100% the 3px red line floods upward and takes the screen; while it
        is still going up, the white goes over it
     5. the DESIGN page runs its own animations, which were held until now

   Step 4 is two panels, not one. The red rises first and gets its own beat —
   an earlier pass ran it at 400ms behind a 120ms lead and it was, measured,
   invisible: not one frame of the recording had more than a quarter of the
   screen red. It now takes 650ms with a 300ms lead before the white starts,
   which is what makes it read as the line taking over rather than a flicker.

   The white panel is not decoration either. Without it the loader simply
   clipped itself away and the page appeared, which is a cut, not a move. It
   carries .stage's gradient verbatim so that when the loader is finally
   removed the real page behind it is pixel-identical — no seam, and the
   page's own reveal starts from that exact frame.

   WHAT DRIVES THE PERCENTAGE
   Real decode progress, floored and capped. A warm cache would otherwise
   flash 0 -> 100 in a frame, and a bad connection would strand someone at
   62% for ten seconds; neither is the 2-3s the brief asks for. So:

       pTime  = elapsed / MIN            ceiling: can never finish before MIN
       pReal  = decoded / total          the truth
       pFloor = elapsed / MAX            floor: always reaches 100 by MAX
       p      = min(pTime, max(pReal, pFloor))

   pFloor is what keeps the curve smooth. Gating on real progress alone gives
   a horrible shape on a cold connection — measured 7% at one second, then a
   scramble to 100 — because the count crawls behind the slowest image. The
   floor means the number always advances at a sane minimum rate, real
   progress overtakes it the moment it can, and the pTime ceiling still
   guarantees it cannot claim to be done early. Honest where it can be,
   never stalled, never a lie about being finished.

   NO GSAP. Every move here is a CSS transition on transform, width, height or
   clip-path, using --ease-osmo (the same curve as CustomEase "osmo" in
   js/transition.js). The only per-frame JavaScript is the counter and the
   line width. That means the loader works identically on file://, offline,
   and anywhere the CDN is unreachable — the same rule the rest of the site
   follows.

   NOT RUN WHEN: the head script skipped it (?skip in the URL, arriving on the
   transition fallback's #wipe hash, or prefers-reduced-motion). The class it
   sets is the single switch; everything below is inert without it.
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const el = document.querySelector('[data-loader]');

  /* Skipped by the head script (?skip, #wipe, reduced motion). Drop the markup
     so it is not left sitting in the DOM as a hidden layer. */
  if (!root.classList.contains('is-loading')){ el?.remove(); return; }
  if (!el){ root.classList.remove('is-loading'); return; }

  /* ---------------- timing ---------------------------------------------------
     MIN/MAX bound how long the count itself may take. The tail after it —
     flood plus hand-off — adds about 0.6s, which is what keeps the whole
     thing inside the 2-3s brief on a normal connection. */
  /* Budget: 3.75s from NAVIGATION to the DESIGN page being fully there — see
     the note on `elapsed` further down for why it is measured from there.

     THE TAIL IS NOW THE SHEET, so these came down. It used to be the CSS
     flood at a fixed 820ms; it is the page transition's own sheet at
     900 cover + 520 uncover = 1420ms. Holding the 3750ms budget means the
     count gets 3750 - 1420 = 2330 instead of 2930, and EXIT_AT keeps the same
     ~60% of the count it has always had so the copy is still readable while
     the number climbs. Change coverMs/uncoverMs on the sheet and these three
     want changing with them. */
  const MIN_MS = 2330;   // never finish counting sooner than this
  const MAX_MS = 2650;   // never take longer, whatever is still downloading
  const EXIT_AT = 1390;  // ms: copy starts travelling right

  /* The tail. Durations themselves live in css/loader.css (.65s flood,
     .55s cover); these are the offsets between them. COVER_LEAD is what gives
     the red its beat before the white starts over it, and CLEAR_AT is when
     the white has fully covered — the only safe moment to swap the panel for
     the real page, since the two are the same gradient. */
  const COVER_LEAD = 260;   // ms after the flood begins
  const CLEAR_AT   = 560;   // ms after the cover begins

  const pctEl  = el.querySelector('[data-loader-pct]');
  const lineEl = el.querySelector('[data-loader-line]');

  /* ---------------- what we are waiting for ----------------------------------
     Every distinct image the mounted page actually references, plus the fonts.
     Counted by unique src: the wheel builds 50 cards from 13 photos, and
     progress should reflect 13 downloads, not 50 cache hits. */
  function collectTargets(){
    const srcs = new Set();
    document.querySelectorAll('[data-barba="container"] img').forEach(img => {
      const s = img.currentSrc || img.src;
      if (s) srcs.add(s);
    });
    /* Anything that is not an <img> but still has to be there before the page
       is worth showing declares itself with data-preload. The About page's
       757KB figure.glb is the case that forced this: counting images alone,
       that page has none, so the loader finished against the fonts and handed
       off to an empty black screen while the model was still downloading. */
    document.querySelectorAll('[data-barba="container"] [data-preload]')
      .forEach(el => { const u = el.getAttribute('data-preload'); if (u) srcs.add(u); });
    return [...srcs];
  }

  let total = 0, done = 0;

  function watchAssets(){
    const srcs = collectTargets();
    total = srcs.length + 1;              // +1 for the font set

    if (!srcs.length) done++;             // nothing to wait on but the fonts
    srcs.forEach(src => {
      const tick = () => { done++; };
      /* Images go through Image() so they land in the same cache the page will
         read from. Anything else is fetched — the response is discarded, but
         the browser has it cached by the time the page asks. */
      if (/\.(jpe?g|png|webp|avif|gif|svg)(\?|$)/i.test(src)){
        const probe = new Image();
        probe.onload = tick;
        probe.onerror = tick;             // a 404 must not hang the loader
        probe.src = src;
      } else {
        fetch(src).then(tick).catch(tick);
      }
    });

    if (document.fonts && document.fonts.ready){
      document.fonts.ready.then(() => { done++; }).catch(() => { done++; });
    } else done++;
  }

  /* The page modules mount from js/transition.js, which runs after this file.
     Waiting a frame lets the wheel build its cards so there is something to
     count; without it collectTargets() finds an empty container. */
  requestAnimationFrame(() => requestAnimationFrame(watchAssets));

  /* ---------------- the run ---------------------------------------------------
     `elapsed` is performance.now(), which is milliseconds since NAVIGATION —
     not since this script started. That is deliberate: the budget above is
     what the visitor experiences, and parsing the document and mounting the
     page (50 wheel cards, or 130 sphere layers) happens before this file runs.
     Clocking from script start put that cost on top of the budget instead of
     inside it — measured 5.34s against a 5.00s target, purely from mount.

     `startedAt` guards the one thing that breaks: on a slow enough device
     EXIT_AT could already be in the past when this runs, and the copy would
     sweep out before anyone had seen it. It always gets 400ms on screen. */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const startedAt = performance.now();
  let exited = false, finished = false;

  function frame(now){
    const elapsed = now;

    if (!exited && elapsed >= EXIT_AT && now - startedAt >= 400){
      exited = true;
      el.classList.add('is-exiting');
    }

    const pTime  = clamp(elapsed / MIN_MS, 0, 1);
    const pReal  = total ? clamp(done / total, 0, 1) : 0;
    const pFloor = clamp(elapsed / MAX_MS, 0, 1);
    const p = Math.min(pTime, Math.max(pReal, pFloor));

    if (pctEl)  pctEl.textContent = String(Math.round(p * 100));
    if (lineEl) lineEl.style.width = (p * 100).toFixed(2) + '%';

    if (p >= 1){ finish(); return; }
    requestAnimationFrame(frame);
  }

  /* ---------------- the tail --------------------------------------------------
     THE SAME SHEET EVERY PAGE CHANGE USES. Arriving at the site used to be a
     different event from moving around inside it: the loader ran its own CSS
     flood and white panel, and every link after that ran js/transition-sheet.js
     — two motions doing the same job, and the first one the visitor sees was
     the odd one out. So the count now hands straight to the sheet.

     RED IS BORROWED, NOT SET. The sheet's own colours are the two near-whites
     a page change wants; the arrival wants the site's red. Rather than teach
     the sheet a second palette, this paints it red for the one run and puts
     the values back afterwards — including if the run throws, which is what
     the two restore arms below are for. Leave them behind and every later
     page change would wipe red.

     THE HAND-OFF IS AT FULL COVER, exactly as before. cover() resolves when
     the sheet is over the top, which is the only moment the loader can be
     taken out from under it without a seam. */
  const SHEET_RED = '#e8271c';

  function sheetFx(){
    const fx = window.SHEETFX;
    return (fx && fx.config && fx.config.enabled) ? fx : null;
  }

  /* ---- THE BLOCK CHANGE'S TEAR, FROM WHEREVER IT IS BY NOW -----------------

     The loader wants js/mask-scroll.js's boundary shape, and it is running at
     the one moment in the page's life when that is awkward to get: this fires
     about two and a third seconds in, and the tuning panel restores a saved
     export when its own module mounts, which is not guaranteed to be before
     that.

     Reading only the live config was the first attempt and it half worked —
     it picks up the code's defaults, so on a browser that has never opened
     the panel it is exactly right, and on the one browser where the block
     change had been tuned it silently kept using the defaults and looked
     unchanged. Which is the whole complaint.

     So both sources, in order: the live config for whatever is already there,
     then the saved export laid over the top. The panel writes its values under
     `shots2026.<page>` as { css: { 'dis.dispAmp': … } }, keyed by row label,
     and those five labels are the same five names — see js/about-console.js,
     where the `dis.` rows read and write MASKSCROLL.config directly.

     Nothing here throws on a browser with no storage, a stale schema, or a
     half-written entry: every read is guarded and every miss falls back to the
     value already in hand. A loader that failed because of a private window
     would be a spectacular way to lose a visitor. */
  const SHAPE_KEYS = ['dispAmp', 'dispScale', 'dispDetail', 'dispDrift', 'soft'];

  function maskShape(){
    const out = {};
    const live = (window.MASKSCROLL && window.MASKSCROLL.config) || null;
    if (live) for (const k of SHAPE_KEYS){
      if (typeof live[k] === 'number') out[k] = live[k];
    }
    try {
      const page = document.querySelector('[data-barba="container"]');
      const key = 'shots2026.' + ((page && page.dataset.page) || 'mask');
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      const css = saved && saved.css;
      if (css) for (const k of SHAPE_KEYS){
        const v = css['dis.' + k];
        if (typeof v === 'number') out[k] = v;
      }
    } catch (e){ /* no storage, or nothing saved — the live values stand */ }
    return Object.keys(out).length ? out : null;
  }

  function finish(){
    if (finished) return;
    finished = true;

    if (pctEl)  pctEl.textContent = '100';
    if (lineEl) lineEl.style.width = '100%';

    const fx = sheetFx();
    /* No sheet — no WebGL, a dead context, the effect switched off in the
       console — and the original flood still runs. The arrival must never
       depend on the optional half. */
    if (!fx) return floodTail();

    /* BORROWED, NOT ASSIGNED. This used to write SHEET_RED into fx.config and
       put the old values back afterwards. It worked, and it quietly poisoned
       saved settings: the tuning panel snapshots that config, and a snapshot
       taken during these two seconds stored the loader's red as the sheet's
       permanent colour — after which every navigation on the site tore red
       instead of white, in that browser, with nothing in the code saying why.
       See the note beside setInk in js/transition-sheet.js. */
    const canInk = typeof fx.setInk === 'function';
    if (canInk) fx.setInk(SHEET_RED, SHEET_RED);

    /* THE SHAPE COMES FROM THE BLOCK CHANGE ITSELF, not from a copy of its
       numbers. js/mask-scroll.js is a page module and is already mounted by
       the time the count finishes, so its live config is simply there to be
       read — including whatever has been tuned on the panel and restored from
       a saved export, which is precisely what a hardcoded copy could never
       see. See setShape in js/transition-sheet.js for why this stopped being
       a copy. */
    const canShape = typeof fx.setShape === 'function';
    const wantMask = fx.config.loaderShape !== 'own';
    if (canShape && wantMask) fx.setShape(maskShape());

    const restore = () => {
      if (canInk) fx.clearInk();
      if (canShape) fx.clearShape();
      /* BACK DOWN. 950 is right for these two seconds and wrong for the rest
         of the visit: left there, the sheet would sit above anything the page
         puts between 122 and 950 for every navigation afterwards. */
      if (typeof fx.setFront === 'function') fx.setFront(false);
    };

    /* THE VISIBLE HALF IS THE UNCOVER, AND ONLY THE UNCOVER.

       This is worth spelling out because it is not what it looks like from the
       call order. The COVER runs against a loader that has just flooded itself
       red, and the two lines above have set the sheet's own top and foot to
       SHEET_RED to match it — so the tear rises red over red and there is
       nothing to see. That is deliberate: the cover's whole job here is to be
       invisible, so that the loader can be pulled out from under it without a
       seam. Timing it does nothing you can watch.

       The UNCOVER is the one. The sheet is still red, the real page is now
       behind it, and the tear clears off downward to reveal it — the only
       moment on the whole site where the effect is what is being looked at
       rather than what is in the way. So `loaderMs` belongs here.

       It was on the cover first, which is why slowing it appeared to change
       nothing at all. */
    const outMs = (fx.config.loaderMs > 0) ? fx.config.loaderMs : null;
    /* THE FILLING HALF IS NOW WATCHED TOO, which is the whole change here.
       It always ran at its full duration; it ran BEHIND this loader, which is
       z-index 900 against the sheet's 122, so not one frame of it reached
       anybody. What did reach them was the hand-off — the loader taken away to
       reveal a screen that was already solid red — and a cut is exactly what
       it looked like.

       Brought to the front, the sequence is what it was always meant to be:
       the line finishes, the red rises from the bottom on the same tear, and
       only then does the page arrive by that tear clearing off. Two halves of
       one gesture, both seen. */
    if (typeof fx.setFront === 'function') fx.setFront(true);
    /* FALLS BACK TO coverMs, NOT TO outMs. It used to fall back to the clear's
       duration, which was harmless only while the loader carried its own pair
       of numbers — the moment the two halves came from the shared coverMs and
       uncoverMs, a loader with no override ran its FILL at the CLEAR's length.
       Measured: the fill went 520 to 1400 and the solid red with it. */
    const inMs = (fx.config.loaderInMs > 0) ? fx.config.loaderInMs : fx.config.coverMs;

    /* WHEN THE RED STARTS RISING. The screen is still the black loader through
       this wait — see loaderStartMs in js/transition-sheet.js, and the note
       there about the two moments this file has that are easy to confuse. */
    const startWait = Math.max(0, fx.config.loaderStartMs || 0);
    /* THE LOADER GOES ITS OWN WAY. Navigations now wipe sideways; this one
       stays vertical because it is meant to be the block-01-to-02 change
       exactly, and that change rises. See loaderDirection in
       js/transition-sheet.js. */
    const dir = fx.config.loaderDirection || 'up';
    const begin = () => fx.cover(inMs, dir);

    let covered = false;
    (startWait ? new Promise(r => setTimeout(r, startWait)).then(begin) : begin())
      .then(ok => {
        if (!ok){ restore(); return floodTail(); }
        covered = true;
        handOff();
        /* THE HELD RED, if one is asked for. The hand-off happens first on
           purpose: the loader comes out from under a screen that is already
           solid, so the hold is spent on the finished picture rather than on
           a loader still sitting behind it. */
        const hold = Math.max(0, fx.config.loaderHoldMs || 0);
        /* STARTED PART-WAY ALONG. Its first stretch is the tear still below
           the bottom edge with the screen sitting solid red — see
           loaderOutFrom in js/transition-sheet.js. Skipping it takes the cut
           out of the pause instead of out of the animation. */
        const clear = () => fx.uncover(outMs, fx.config.loaderOutFrom || fx.config.outFrom, dir);
        return hold ? new Promise(r => setTimeout(r, hold)).then(clear) : clear();
      })
      .then(restore, err => {
        restore();
        /* Only if it never covered. Failing during the uncover means the page
           is already visible and the loader already gone — running the flood
           then would put a red screen back over a live page. */
        if (!covered){ console.warn('[loader] sheet failed, flooding:', err); floodTail(); }
        else handOff();
      });
  }

  /* The original step 4, kept whole as the fallback. */
  function floodTail(){
    // 4a — the 3px line floods upward and takes the screen
    el.classList.add('is-flooding');

    // 4b — while it is still going up, the white goes over it
    setTimeout(() => {
      el.classList.add('is-covering');
      setTimeout(handOff, CLEAR_AT);
    }, COVER_LEAD);
  }

  function handOff(){
    if (el.dataset.handedOff) return;
    el.dataset.handedOff = '1';

    /* The screen is fully covered on this frame — by the red sheet on the
       normal path, by the white panel on the fallback's, and either way the
       loader can be taken out from under it without being seen.
       Release the held animations in the same tick: the copy resolves out of
       blur and the photos pixelate in starting from the frame the loader
       disappears, which is step 5. */
    root.classList.remove('is-loading');
    window.PIXELATE?.release?.();
    el.remove();
    document.dispatchEvent(new CustomEvent('loader:done'));
  }

  requestAnimationFrame(frame);
})();
