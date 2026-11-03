/* ==========================================================================
   transition.js — Barba page transitions: the pixel wipe.

   WHAT IT DOES
   Navigation between DESIGN and PHOTOGRAPHY no longer reloads the document.
   Barba fetches the next page, swaps <main data-barba="container">, and the
   whole transition happens in the LEAVE phase: the incoming page is already
   in place, hidden behind a clip-path that opens in discrete steps — one step
   per grid column — while each column's pixels flash on and back off just
   ahead of the edge. That flicker riding the hard step is the entire effect;
   without it the clip-path alone reads as a plain wipe.

   Ported from the reference boilerplate. Deliberate changes, all of them
   forced by this site rather than preference:

   1. PIXEL COLOUR is #393939 (in css/transition.css) instead of #7948e9 —
      the site's ink, and the same value as the bottom bar.
   2. NO LENIS. The boilerplate pairs Barba with a smooth-scroll library, but
      both pages are a single fixed screen with `overflow: hidden` and the
      wheel owns the scroll gesture. Every hasLenis / hasScrollTrigger guard
      is kept intact, so dropping either library back in is a script tag.
   3. PAGE MODULES are mounted and unmounted through js/lifecycle.js in place
      of the boilerplate's init*Functions registry — see that file for why the
      old IIFE modules could not survive a container swap.
   4. The incoming container is pinned to the viewport, with an EXPLICIT
      height, for the length of the reveal. The boilerplate's own gsap.set
      passes force3D, and a transform — unlike clip-path, which does not —
      makes an element the containing block for its fixed-position
      descendants. Measured in Chromium on a container forced to 800x400:
      clip-path alone leaves .bar at the viewport bottom (900), adding
      translate3d moves it to 400. So for the length of the wipe .rail /
      .cols / .bar / .peek resolve against the CONTAINER, and it has to be
      exactly one viewport tall or the bottom bar sits at the container's
      content height (100svh) instead of the viewport's (100dvh) — identical
      on desktop, a visible jump on a phone with a collapsing address bar.
      Being captured is also what makes the chrome wipe in WITH the page
      rather than sitting untouched above it.
   5. "transform" is added to the leave animation's clearProps list.
      clearProps takes CSS property names and "force3D" is not one, so as the
      boilerplate has it that translate3d is never removed — and by the point
      above, a container that keeps a transform keeps capturing the fixed
      chrome for the rest of the session, long after the transition is over.
   6. Both pages overlap by design: the incoming page mounts at beforeEnter so
      there is something to reveal, and the outgoing one is torn down only
      after its container has actually been removed. Two wheels briefly run at
      once, which is why the modules publish window.WHEEL / window.SPHERE
      defensively.

   Barba fetches over HTTP, so the whole thing is skipped on file:// and
   without GSAP — links then behave as ordinary links and the page mounts
   directly, which is what keeps the local design-review workflow working.
   ========================================================================== */
(() => {
  'use strict';

  /* ---------------- timing ---------------------------------------------------
     The reference's four dials, unchanged. Raise pixelHorizontalAmount for a
     finer, more detailed wipe; lower it for chunkier, more retro blocks. */
  const pixelHorizontalAmount = 12;   // grid columns, and clip-path steps
  const transitionDuration    = 1;    // seconds, whole leave animation
  const pixelFadeDuration     = 0.2;  // seconds, per-column flash
  const pixelOverlap          = 0.3;  // 0 sequential .. 1 all at once

  const hasGSAP          = typeof window.gsap !== 'undefined';
  const hasBarba         = typeof window.barba !== 'undefined';
  const hasLenis         = typeof window.Lenis !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
  const isHttp           = /^https?:$/.test(location.protocol);

  const rmMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = rmMQ.matches;
  rmMQ.addEventListener?.('change', e => (reducedMotion = e.matches));

  let lenis = null;

  if (hasGSAP && window.CustomEase){
    gsap.registerPlugin(CustomEase);
    CustomEase.create('osmo', '0.625, 0.05, 0, 1');
    gsap.defaults({ ease: 'osmo', duration: 0.6 });
  }

  history.scrollRestoration = 'manual';

  /* ---------------- page module lifecycle -------------------------------------
     `live` is the instance owning what is currently on screen. During a
     transition `pending` holds the incoming one; the swap happens once the old
     container is gone. */
  let live = null;
  let pending = null;

  /* Mirrored onto PAGE for debugging: if a transition ever wedges, PAGE.live
     and PAGE.pending say which instances are up, and PAGE.pending being
     non-null after a navigation settles means afterLeave never ran. */
  function setLive(v){ live = v; window.PAGE.live = v; }
  function setPending(v){ pending = v; window.PAGE.pending = v; }

  function mountPage(container){
    document.body.dataset.page = container.dataset.page || '';
    return window.PAGE.mount(container);
  }

  /* ---------------- helpers ---------------------------------------------------- */
  function initLenis(){
    if (lenis || !hasLenis) return;
    lenis = new Lenis({ lerp: 0.165, wheelMultiplier: 1.25 });
    if (hasScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function resetPage(container){
    window.scrollTo(0, 0);
    gsap.set(container, { clearProps: 'position,top,left,right,height,zIndex,transform' });
    if (hasLenis){ lenis.resize(); lenis.start(); }
  }

  /* Build the pixel grid to fit the current viewport.
     Rebuilt on every navigation so an orientation change between two
     transitions is picked up: in portrait the columns become horizontal rows
     and the stepped reveal runs top-to-bottom instead of left-to-right. */
  function pixelGrid(isPortrait){
    const panel = document.querySelector('[data-transition-panel]');
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    panel.style.flexDirection = isPortrait ? 'column' : 'row';

    const lineSizePx = isPortrait
      ? rect.height / pixelHorizontalAmount
      : rect.width / pixelHorizontalAmount;
    const crossAmount = Math.ceil((isPortrait ? rect.width : rect.height) / lineSizePx);

    let lines = panel.querySelectorAll('[data-transition-col]');
    const lineTemplate = lines[0];
    if (!lineTemplate) return;
    const pixelTemplate = lineTemplate.querySelector('[data-transition-pixel]');
    if (!pixelTemplate) return;

    if (lines.length !== pixelHorizontalAmount){
      const frag = document.createDocumentFragment();
      for (let i = 0; i < pixelHorizontalAmount; i++){
        frag.appendChild(lineTemplate.cloneNode(false));
      }
      panel.replaceChildren(frag);
      lines = panel.querySelectorAll('[data-transition-col]');
    }

    lines.forEach(line => {
      line.style.flexDirection = isPortrait ? 'row' : 'column';
      line.style.flex = '1 1 auto';
      line.style.justifyContent = 'center';

      const diff = crossAmount - line.childElementCount;
      if (diff > 0){
        const frag = document.createDocumentFragment();
        for (let i = 0; i < diff; i++) frag.appendChild(pixelTemplate.cloneNode(true));
        line.appendChild(frag);
      } else if (diff < 0){
        for (let i = diff; i < 0; i++) line.lastElementChild.remove();
      }
    });
  }

  /* Exposed so the grid can be rebuilt and inspected from devtools after
     changing pixelHorizontalAmount, without having to navigate:
       PAGE.pixelGrid(false); document.querySelector('.transition__panel').style.opacity = 1 */
  window.PAGE.pixelGrid = pixelGrid;

  /* ---------------- transitions ------------------------------------------------ */
  function runPageOnceAnimation(next){
    const tl = gsap.timeline();
    tl.call(() => resetPage(next), null, 0);
    return tl;
  }

  /* Is the liquid transition available and wanted? Checked at each use rather
     than once at startup, because it initialises its WebGL context lazily and
     because the console can switch it off mid-session. */
  /* Which full-screen transition, if any. A registry rather than a single
     check, because there are now two of them and choosing between them from a
     console is worth more than either being hardwired. First enabled wins;
     none enabled means the pixel grid, which is also what happens when one is
     enabled but declines at runtime. */
  function overlay(){
    if (reducedMotion) return null;
    for (const m of [window.SHEETFX, window.IRIS, window.LIQUID]){
      if (m && m.config && m.config.enabled) return m;
    }
    return null;
  }
  function useLiquid(){ return !!overlay(); }

  function runPageLeaveAnimation(current, next){
    /* js/transition-liquid.js covers the screen, then the outgoing container
       is removed underneath it. If it declines — no WebGL, a dead context, a
       shader that would not compile — it resolves false and the pixel grid
       below runs exactly as it always has. */
    const ov = overlay();
    if (ov){
      return ov.cover().then(ok => {
        if (!ok) return runPageLeaveAnimation._fallback(current, next);
        current.remove();
      });
    }
    return runPageLeaveAnimation._fallback(current, next);
  }

  runPageLeaveAnimation._fallback = function (current, next){
    const tl = gsap.timeline();

    if (reducedMotion){
      tl.set(current, { autoAlpha: 0 });
      tl.call(() => current.remove(), null, 0);
      return tl;
    }

    const isPortrait = window.innerHeight > window.innerWidth;
    pixelGrid(isPortrait);

    const transitionWrap  = document.querySelector('[data-transition-wrap]');
    const transitionPanel = transitionWrap.querySelector('[data-transition-panel]');
    const lines     = Array.from(transitionPanel.querySelectorAll('[data-transition-col]'));
    const allPixels = transitionPanel.querySelectorAll('[data-transition-pixel]');

    const overlap  = Math.max(0, Math.min(1, pixelOverlap));
    const clipFrom = isPortrait
      ? 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'
      : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)';
    const clipTo   = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';

    const clipStart    = Math.min(pixelFadeDuration, transitionDuration * 0.5);
    const clipDuration = Math.max(0.001, transitionDuration - 2 * clipStart);
    const stepDur      = clipDuration / Math.max(1, pixelHorizontalAmount);
    const endDelay     = transitionDuration / Math.max(1, pixelHorizontalAmount);

    gsap.set(allPixels, { opacity: 0, willChange: 'opacity' });
    gsap.set(transitionPanel, { opacity: 1, willChange: 'opacity' });
    gsap.set(next, {
      autoAlpha: 1,
      clipPath: clipFrom,
      webkitClipPath: clipFrom,
      willChange: 'clip-path',
      force3D: true,
      maxHeight: '100dvh',
    });

    lines.forEach((line, i) => {
      const pixels = Array.from(line.querySelectorAll('[data-transition-pixel]'));
      if (!pixels.length) return;

      const revealTime = clipStart + i * stepDur;
      const fillStart  = Math.max(0, revealTime - pixelFadeDuration);
      const fadeStart  = Math.min(transitionDuration, revealTime + stepDur);

      const perPixelMin = pixelFadeDuration / pixels.length;
      const perPixelDur = perPixelMin * (1 - overlap) + pixelFadeDuration * overlap;
      const spread      = Math.max(0, pixelFadeDuration - perPixelDur);

      // Animate Pixels In
      tl.to(pixels, {
        opacity: 1,
        duration: Math.max(0.001, perPixelDur),
        ease: 'none',
        stagger: { amount: spread, from: 'random' },
      }, fillStart);

      // Animate Pixels Out
      tl.to(pixels, {
        opacity: 0,
        duration: Math.max(0.001, perPixelDur),
        ease: 'none',
        stagger: { amount: spread, from: 'random' },
      }, fadeStart);
    });

    // Animate Clip Path — one hard step per grid column
    tl.to(next, {
      clipPath: clipTo,
      webkitClipPath: clipTo,
      ease: `steps(${pixelHorizontalAmount}, start)`,
      duration: clipDuration,
    }, clipStart);

    /* "transform" is listed explicitly, and it is the one addition to this
       list: force3D above leaves a translate3d behind, "force3D" is not a CSS
       property so clearProps cannot remove it, and a container that keeps a
       transform goes on acting as the containing block for the fixed chrome
       inside it forever. */
    tl.set(next, {
      clearProps: 'clipPath,webkitClipPath,willChange,transform,maxHeight',
    }, clipStart + clipDuration);

    tl.call(() => current.remove(), null, transitionDuration + endDelay);
    tl.set(allPixels, { clearProps: 'willChange' }, transitionDuration + endDelay);
    tl.set(transitionPanel, { clearProps: 'willChange' }, transitionDuration + endDelay);

    return tl;
  };

  function runPageEnterAnimation(next){
    const ov = overlay();
    if (ov){
      resetPage(next);
      /* ---- THE CLEAR IS NOT AWAITED, AND THAT IS THE FIX --------------------
         Barba runs with `preventRunning: true`, so while a transition is in
         flight every other link on the page is dead. That is right for the
         COVER — the outgoing page is still on screen and a second navigation
         mid-cover would be two pages leaving at once — and it is wrong for the
         clear.

         By then the new page has already been swapped in and is sitting
         underneath; the sheet is only getting out of its way. Awaiting it
         meant the router stayed busy for the whole clear, which at the
         navigation's own pace is several seconds of clicks that visibly do
         nothing. "I have to click twice, or wait a second or two" is exactly
         that window.

         So the clear is started and left to run. Barba is free the moment the
         page is there, and a click during it starts the next navigation over
         the top — js/transition-sheet.js already settles a run that is
         interrupted, which is what makes that safe rather than a hang. */
      ov.uncover();
      return Promise.resolve();
    }
    const tl = gsap.timeline();
    const endDelay = transitionDuration / Math.max(1, pixelHorizontalAmount);

    if (reducedMotion){
      tl.set(next, { autoAlpha: 1 });
      tl.add('pageReady');
      tl.call(resetPage, [next], 'pageReady');
      return new Promise(resolve => tl.call(resolve, null, 'pageReady'));
    }

    tl.add('pageReady', transitionDuration + endDelay);
    tl.call(resetPage, [next], 'pageReady');
    return new Promise(resolve => tl.call(resolve, null, 'pageReady'));
  }

  /* ==========================================================================
     FALLBACK WIPE — no Barba, no problem.

     Barba fetches the next page over HTTP, which rules it out on file:// (a
     local file is an opaque origin, so fetch and XHR are both refused) and
     whenever the CDN cannot be reached. The transition used to just switch
     itself off there and let the links navigate normally, which is the wrong
     default: opening the folder off disk is exactly how this site gets looked
     at, and a silently absent transition reads as a broken one.

     So the same wipe runs in two halves around a REAL page load instead:
     pixels flood in left to right until the screen is solid #393939, the
     browser navigates, and the incoming page uncovers with the same sweep.
     The hand-off is a #wipe hash on the outgoing URL, which a two-line script
     in <head> turns into a flat cover before the first paint — that is what
     hides the load itself. No dependencies: the tweens here are linear, so
     plain rAF does the job GSAP does on the Barba path.

     It is not identical. The real transition reveals the next page THROUGH
     the wipe because both pages are in the DOM at once; this one covers,
     loads, uncovers, so it is a little longer and the middle is opaque. On a
     server with the CDN up you get the real one.
     ========================================================================== */
  const WIPE_HASH = '#wipe';

  function shuffledSlots(n, seed){
    const order = [];
    for (let i = 0; i < n; i++) order.push(i);
    let s = seed * 9301 + 49297;
    for (let i = n - 1; i > 0; i--){
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      const t = order[i]; order[i] = order[j]; order[j] = t;
    }
    return order;
  }

  function runFallbackWipe(mode, done){
    /* Same two halves, same hand-off, different renderer. On the cover half
       the promise resolving is the cue to navigate; on the uncover half the
       mass is already held up by the <head> script and just drops away. */
    const ov = overlay();
    if (ov){
      /* HAND THE FLAT COVER OVER BEFORE ANIMATING, on the arrival half. The
         <head> script paints a flat sheet over the document before its first
         paint, which is what hides the real page load; that sheet is still up
         when we get here, UNDER the overlay. Animate the overlay off without
         dropping it and the tear reveals the flat panel rather than the page,
         and the page appears a moment later as a hard cut.

         hold() parks the overlay fully covering, so the panel can be dropped
         in the same synchronous go with nothing uncovered in between. */
      if (mode === 'uncover' && ov.hold && ov.hold()){
        const panel = document.querySelector('[data-transition-panel]');
        if (panel){ panel.style.opacity = '0'; panel.style.backgroundColor = ''; }
      }
      const p = mode === 'cover' ? ov.cover() : ov.uncover();
      p.then(ok => { if (ok) done(); else runFallbackWipe._pixels(mode, done); });
      return;
    }
    runFallbackWipe._pixels(mode, done);
  }

  runFallbackWipe._pixels = function (mode, done){
    const panel = document.querySelector('[data-transition-panel]');
    if (!panel){ done(); return; }

    pixelGrid(window.innerHeight > window.innerWidth);
    const cols = Array.from(panel.querySelectorAll('[data-transition-col]'));
    const n = Math.max(1, cols.length);

    /* Half the round trip each way, so covering and uncovering together land
       near the one second the Barba path takes. */
    const dur     = mode === 'cover' ? 0.42 : 0.52;
    const fade    = 0.18;
    const colStep = (dur - fade) / Math.max(1, n - 1);

    const items = [];
    cols.forEach((col, i) => {
      const px = Array.from(col.querySelectorAll('[data-transition-pixel]'));
      const slots = shuffledSlots(px.length, i + 1);
      px.forEach((el, k) => {
        const slot = slots[k] / Math.max(1, px.length - 1);
        items.push({ el, at: i * colStep + slot * fade * 0.7, dur: fade * 0.55 });
      });
    });

    panel.style.opacity = '1';
    items.forEach(it => { it.el.style.opacity = mode === 'cover' ? '0' : '1'; });

    if (mode === 'uncover'){
      /* Hand the cover over from the flat CSS sheet to the pixel grid, in one
         synchronous go — the pixels are already all opaque and they tile the
         whole viewport, so there is nothing to flash through.

         This MUST happen before the animation starts. `html.is-wiping` paints
         background-color on the panel ITSELF, and while that rule applies the
         pixels can fade out all they like behind an opaque sheet. That was
         the bug: the out animation ran perfectly, invisibly, for half a
         second, and then the panel was hidden and the next page appeared to
         snap in. Clearing the inline background is not enough — the class
         rule is what paints it. */
      panel.style.backgroundColor = 'transparent';
      document.documentElement.classList.remove('is-wiping');
    } else {
      panel.style.backgroundColor = '';
    }

    const t0 = performance.now();
    (function step(){
      const t = (performance.now() - t0) / 1000;
      for (const it of items){
        const v = Math.min(1, Math.max(0, (t - it.at) / it.dur));
        it.el.style.opacity = String(mode === 'cover' ? v : 1 - v);
      }
      if (t < dur + 0.06) requestAnimationFrame(step);
      else done();
    })();
  };

  /* Uncover, if we arrived behind the flat cover the <head> script put up. */
  function finishFallbackArrival(){
    const root = document.documentElement;
    if (!root.classList.contains('is-wiping')) return;

    const panel = document.querySelector('[data-transition-panel]');
    runFallbackWipe('uncover', () => {
      if (panel){ panel.style.opacity = '0'; panel.style.backgroundColor = ''; }
      root.classList.remove('is-wiping');   // already gone; harmless
      try {
        history.replaceState(null, '', location.pathname + location.search);
      } catch (e){ /* file:// refuses replaceState — the stray hash is harmless */ }
    });
  }

  /* Intercept in-site links ourselves, using the same rules Barba applies. */
  function bindFallbackLinks(){
    document.addEventListener('click', e => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = e.target.closest?.('a[href]');
      if (!a) return;
      if (a.hasAttribute('data-barba-prevent')) return;
      if (a.hasAttribute('download') || a.target === '_blank') return;

      const href = a.getAttribute('href');
      if (!href || /^(#|mailto:|tel:|https?:\/\/|\/\/)/i.test(href)) return;
      if (a.href === location.href) return;

      e.preventDefault();
      runFallbackWipe('cover', () => {
        const panel = document.querySelector('[data-transition-panel]');
        /* Flat fill first: no seams while the browser tears down the page. The
           COLOUR is the overlay's own, because this fill is what the next
           document paints behind before any script of its own has run — and a
           near-white tear handing over to a dark grey panel is a flash of a
           colour that belongs to neither transition. */
        const ov2 = overlay();
        if (panel) panel.style.backgroundColor =
          (ov2 && ov2.coverColour) ? ov2.coverColour() : '#393939';
        location.href = a.href.split('#')[0] + WIPE_HASH;
      });
    }, true);
  }

  /* ---------------- boot -------------------------------------------------------- */
  const firstContainer = document.querySelector('[data-barba="container"]');

  function why(){
    if (!isHttp) return `page opened over ${location.protocol}  —  Barba needs http(s), ` +
                        'a local file is an opaque origin and cannot fetch the next page';
    if (!hasBarba) return 'barba.umd.min.js did not load (offline? CDN blocked?)';
    if (!hasGSAP)  return 'gsap.min.js did not load (offline? CDN blocked?)';
    return '';
  }

  if (!hasBarba || !hasGSAP || !isHttp){
    /* Say so out loud. A transition that is silently off is indistinguishable
       from one that is broken, which is the whole reason this branch exists. */
    console.info('%c[transition]%c fallback wipe — ' + why(),
                 'background:#393939;color:#fff;padding:1px 5px', '');
    if (firstContainer) setLive(mountPage(firstContainer));
    bindFallbackLinks();
    finishFallbackArrival();
    return;
  }

  /* Mount the first page here rather than from the beforeOnce hook: the
     container is already in the document, so there is nothing to wait for,
     and it means a first paint can never depend on Barba's lifecycle. */
  if (firstContainer) setLive(mountPage(firstContainer));

  barba.hooks.beforeEnter(data => {
    /* Pin the incoming container to the viewport on top of the outgoing one.
       Explicit height, not just top/left/right — see note 4 in the header. */
    gsap.set(data.next.container, {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '100dvh',
      /* Above the outgoing page. Both containers are stacking contexts (see
         base.css), so this one number orders the two pages entirely — without
         it they tie at 0 and the outgoing page's internals bleed through. */
      zIndex: 1,
    });

    if (lenis?.stop) lenis.stop();

    /* NOT ON THE FIRST LOAD. Barba runs this hook around `once` as well as
       around a real navigation, and on `once` data.next.container is the
       container line 512 above has already mounted. Without this guard every
       module booted twice on arrival — and because `afterLeave` (the hook that
       calls live.unmount()) never fires for `once`, the second instance was
       never torn down either. Both stayed alive, so the page carried two of
       every renderer's canvas: two full-screen composites and two x-ray
       canvases, 14.7 of the 29.4 megapixels the compositor was pushing every
       frame, for layers nothing was drawing into. That was the whole of the
       second block's frame-rate gap — measured at 68fps with the duplicates
       against 119 on the block that had none.

       Mount here, not after the reveal: the wipe has to have a finished page
       to uncover. The outgoing one is still mounted and still animating
       underneath — see note 6. */
    if (live && live.scope === data.next.container) return;
    setPending(mountPage(data.next.container));
  });

  barba.hooks.afterLeave(() => {
    if (hasScrollTrigger) ScrollTrigger.getAll().forEach(t => t.kill());

    /* The old container has been removed by the leave timeline, so its module
       instance can go — this is what stops its ticker and window listeners. */
    live?.unmount();
    setLive(pending);
    setPending(null);
  });

  barba.hooks.afterEnter(() => {
    if (hasLenis){ lenis.resize(); lenis.start(); }
    if (hasScrollTrigger) ScrollTrigger.refresh();
  });

  try {
    barba.init({
      debug: false,
      timeout: 7000,
      preventRunning: true,
      transitions: [
        {
          name: 'pixel',
          sync: true,
          async once(data){ initLenis(); return runPageOnceAnimation(data.next.container); },
          async leave(data){ return runPageLeaveAnimation(data.current.container, data.next.container); },
          async enter(data){ return runPageEnterAnimation(data.next.container); },
        },
      ],
    });
    console.info('%c[transition]%c pixel wipe active (barba)',
                 'background:#393939;color:#fff;padding:1px 5px', '');
  } catch (err){
    /* If Barba refuses to start, do NOT leave the site with no transition and
       no explanation — that is the failure this whole block is here to stop. */
    console.error('[transition] barba.init failed, falling back to the wipe:', err);
    bindFallbackLinks();
  }

  finishFallbackArrival();
})();
