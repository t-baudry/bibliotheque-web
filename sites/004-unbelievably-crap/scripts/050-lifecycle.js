/* ==========================================================================
   lifecycle.js — mount / unmount registry for the page modules.

   WHY
   Every page module here used to be an IIFE that ran once on load, grabbed
   its elements by id, attached listeners and started a ticker. That is exactly
   right for a document that gets thrown away on navigation, and exactly wrong
   under Barba, where the document survives and only <main data-barba
   ="container"> is swapped. Left as they were, the modules would run once for
   the first page and then never again — and their window listeners and GSAP
   tickers would keep firing at DOM that no longer exists.

   So each module now registers a BOOT function instead of running itself:

     PAGE.register('wheel', function (scope) {
       const viewport = scope.querySelector('#wheelViewport');
       if (!viewport) return;                 // not this page — no-op
       ...
       return function destroy(){ ... };      // optional
     });

   `scope` is the container being mounted. Modules MUST query inside it rather
   than through document: during a transition BOTH containers are in the DOM
   at once, so document.getElementById('wheelStage') would hand the incoming
   page the outgoing page's stage.

   Returning a destroy function is optional — anything attached to an element
   inside the container dies with the container. It is required for the things
   that outlive it: window/document listeners, gsap.ticker callbacks, rAF
   loops, intervals and globals such as window.WHEEL.

   mount() returns an INSTANCE rather than mutating shared state, because the
   two pages legitimately overlap: the incoming page mounts while the outgoing
   one is still on screen and still animating under the wipe. Both run side by
   side for the length of the transition and the old instance is torn down
   only once its container has been removed.
   ========================================================================== */
(() => {
  'use strict';

  const modules = [];

  function register(name, boot){
    if (typeof boot !== 'function') return;
    modules.push({ name, boot });
  }

  /* THE PHONE DOOR. When css/gate.css has the screen — see the `is-gated` class
     the head script sets before the first paint — the page's container is
     display:none and there is nothing for any of this to drive. Mounting the
     modules anyway would start several WebGL contexts and a handful of
     animation loops against boxes of zero size: invisible work, on the device
     least able to afford it.

     So behind the door only these two run. `gate` is the door's own resize
     watch; `work-cursor` paints the character field that IS the door's
     background, mounted into the door rather than into the hidden page.

     THIS IS THE PERFORMANCE ANSWER TO "HIDE IT, DO NOT DELETE IT". A sheet
     laid over a running site costs MORE than the site did. A door that stops
     the site from starting costs almost nothing, and css/mobile.css is still
     there, still linked, still exactly as it was — one query string away. */
  const GATE_OK = { gate: 1, 'work-cursor': 1 };

  function mount(scope){
    const root = scope || document;
    const downs = [];
    const gated = document.documentElement.classList.contains('is-gated');

    for (const m of modules){
      if (gated && !GATE_OK[m.name]) continue;
      let down;
      try {
        down = m.boot(root);
      } catch (err){
        /* One broken module must not stop the rest of the page from coming
           up — a half-mounted page is far more debuggable than a blank one. */
        console.error(`[page] "${m.name}" failed to mount:`, err);
        continue;
      }
      if (typeof down === 'function') downs.push([m.name, down]);
    }

    return {
      scope: root,
      /* Reverse order, so a module unwinds before anything it depended on. */
      unmount(){
        for (let i = downs.length - 1; i >= 0; i--){
          try { downs[i][1](); }
          catch (err){ console.error(`[page] "${downs[i][0]}" failed to unmount:`, err); }
        }
        downs.length = 0;
      },
    };
  }

  /* Small helper the modules use so they don't each hand-roll listener
     bookkeeping. Returns a function that removes everything it registered. */
  function bindings(){
    const off = [];
    const api = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts);
      off.push(() => target.removeEventListener(type, fn, opts));
    };
    api.release = () => { off.forEach(f => { try { f(); } catch(e){} }); off.length = 0; };
    return api;
  }

  /* ---------------- intro ramp -------------------------------------------------
     Shared by the two 3D galleries. Returns a function yielding 0 -> 1 on an
     ease-out cubic over `ms`.

     The clock does NOT start while the intro loader is up. Without that gate
     the gallery would expand to full size behind the black and the page would
     hand off to an object that had already finished arriving — the same
     mistake the paused .anim-line and the queued PIXELATE calls exist to
     avoid. Pages with no loader (a Barba navigation) see is-loading absent and
     start immediately. */
  function intro(ms){
    let t0 = 0, done = !(ms > 0);
    return function(){
      if (done) return 1;
      if (document.documentElement.classList.contains('is-loading')) return 0;
      if (!t0) t0 = performance.now();
      const t = Math.min(1, (performance.now() - t0) / ms);
      if (t >= 1) done = true;
      return 1 - Math.pow(1 - t, 3);
    };
  }

  /* ---------------- WebGL context loss -----------------------------------------
     A WebGL context is not the page's to keep. The browser hands one out and
     TAKES IT BACK whenever it wants the memory: a tab left in the background,
     a machine that slept, a laptop switching between its two GPUs, another tab
     being greedy, a driver reset. Chrome does this routinely and it is not an
     error condition — it is the normal life of a canvas.

     WHAT IT LOOKS LIKE WHEN IT HAPPENS, and why it took a while to name: every
     GL object the page holds — programs, textures, buffers, framebuffers —
     becomes silently invalid, and every draw call becomes a no-op. Nothing
     throws. Nothing is logged. requestAnimationFrame keeps running, the loop
     keeps "drawing" sixty times a second, and the canvas is simply transparent.
     The page looks like it lost one layer and only a reload brings it back.

     THE ONE LINE THAT ACTUALLY FIXES IT is the preventDefault below. The lost
     event's DEFAULT ACTION is to leave the context dead permanently;
     preventDefault is how a page says "I can rebuild, please give me another".
     Without it the browser never fires webglcontextrestored AT ALL — so a page
     with no handler is not merely failing to recover, it has declined to.

     Shared here rather than written five times because there are five contexts
     on this site and the two easy things to get wrong — forgetting the
     preventDefault, and rebuilding onto stale handles — are exactly the things
     that fail silently.

     `rebuild` must recreate every GPU resource the module owns. The canvas
     element and the gl object survive; everything reachable THROUGH the gl
     object does not, so any cached program, texture or framebuffer has to be
     dropped rather than reused. */
  function glGuard(canvas, rebuild){
    let lost = false;
    const onLost = e => { e.preventDefault(); lost = true; };
    const onRestored = () => {
      try { rebuild(); lost = false; }
      catch (err){ console.warn('[gl] could not rebuild after restore:', err && err.message); }
    };
    canvas.addEventListener('webglcontextlost', onLost, false);
    canvas.addEventListener('webglcontextrestored', onRestored, false);
    return {
      lost: () => lost,
      release(){
        canvas.removeEventListener('webglcontextlost', onLost, false);
        canvas.removeEventListener('webglcontextrestored', onRestored, false);
      },
    };
  }

  window.PAGE = { register, mount, bindings, intro, modules, glGuard };
})();
