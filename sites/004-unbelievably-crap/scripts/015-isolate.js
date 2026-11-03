/* ==========================================================================
   isolate.js — turn one layer off and see what it was costing.

   WHY. Decimating the meshes took the home page from 11.5MB to 3.1 and moved
   the skull section from 50fps to 55 — which is the answer to a question, just
   not the one we were asking. The cost is not geometry. It is somewhere in the
   stack of full-screen effects, and the only cheap way to find out which one is
   to switch them off one at a time and watch the number.

   USE. `?fps&off=<name>` — several allowed, comma separated:

     yoursite/index.html?fps&skip&off=xray
     yoursite/work.html?fps&skip&off=filters,crt

   It prints to the console which switches it actually found, so a name that
   matched nothing is visible rather than silently reading as "that layer was
   free".

   IT RUNS AFTER EVERYTHING HAS MOUNTED, on a timer rather than on load: these
   globals are published by modules at mount, and some of them — the ones that
   wait on a mesh — are not there for another second. Re-applied a few times
   for the same reason.

   THIS IS A DIAGNOSTIC, NOT A FEATURE. It does nothing without the URL flag
   and nothing at all is switched off for a visitor.
   ========================================================================== */
(function () {
  'use strict';

  /* ==== SHIP_LOCKED ======================================================
     THE SITE IS SUBMITTED. This is the one switch that closes every developer
     surface on it — the tuning panel, the FPS meter and the ?off= isolator all
     carry this same constant under this same name, so `grep -rn SHIP_LOCKED js/`
     finds all three and flipping them to false brings everything back exactly
     as it was. Nothing is deleted.

     It has to be a constant and not a URL flag, because a URL flag is what
     these already had: ?tune, ?fps and ?off are guessable, they are in the
     source anybody can read, and on a page being judged that is a panel one
     query string away from a stranger. */
  const SHIP_LOCKED = true;

  if (SHIP_LOCKED) return;
  const m = /[?&]off=([a-z0-9_,-]+)/i.exec(location.search);
  if (!m) return;
  const want = m[1].toLowerCase().split(',').filter(Boolean);

  /* Each switch says what it turns off and returns true if it found something
     to turn off. Written as "make this layer do no work" rather than "hide
     it": a display:none element still costs whatever its module computes for
     it every frame, and that is the cost being measured. */
  const SWITCH = {
    /* ---- the home page ---- */
    xray(){                       // block 01's three.js fluid simulation
      if (!window.XRAY) return false;
      window.XRAY.config.enabled = false;
      if (window.XRAY.apply) window.XRAY.apply();
      return true;
    },
    figure(){                     // both 3D figures — the canvases stop drawing
      let hit = false;
      ['FIGURE', 'FIGURE_B'].forEach(g => {
        const c = document.querySelector(g === 'FIGURE' ? '#aboutFigure' : '#maskBody');
        if (c){ c.style.display = 'none'; hit = true; }
      });
      return hit;
    },
    /* THE THREE FULL-VIEWPORT TEXTURE UPLOADS block 02's composite does every
       frame — the head, the ASCII ground and the caption layer. About 18
       megapixels of CPU-to-GPU transfer per frame at a 2x 1512 window. The
       block goes blank with this off; that is expected, the point is the
       number in the corner. */
    uploads(){
      if (!window.MASKSCROLL) return false;
      window.MASKSCROLL.config.uploads = false;
      return true;
    },
    mask(){                       // the whole composite, drawing included
      if (window.MASKSCROLL){
        window.MASKSCROLL.config.enabled = false;
        if (window.MASKSCROLL.apply) window.MASKSCROLL.apply();
      }
      const c = document.querySelector('.mask-sheet');
      if (c) c.style.visibility = 'hidden';
      /* IT USED TO ONLY HIDE THE CANVAS, which was a bad test and gave a bad
         answer: visibility:hidden stops the compositor showing a layer, it does
         not stop the module computing and uploading into it every frame. The
         reading came back "mask costs nothing" when nothing had been switched
         off. */
      return !!(window.MASKSCROLL || c);
    },
    caps(){                       // block 02's caption canvas (2D fillText)
      if (!window.BLOCK2) return false;
      window.BLOCK2.config.capOn = false;
      return true;
    },
    grain(){
      const g = document.querySelector('.grain');
      if (!g) return false;
      g.style.display = 'none';
      return true;
    },
    hud(){
      const h = document.querySelector('.hud');
      if (!h) return false;
      h.style.display = 'none';
      return true;
    },

    /* ---- the work page ---- */
    /* THE ONE I MOST EXPECT TO MATTER. Every card gets a `filter` string
       written on it every frame, because the colour is a function of how far
       it is from the middle of the screen. Thirty filtered layers re-rendered
       per frame is a compositing cost that has nothing to do with triangles. */
    filters(){
      if (!window.WORKGRID) return false;
      const C = window.WORKGRID.config;
      C.colourMid = 0; C.colourEdge = 0; C.contrast = 1;
      C.aberration = 0; C.aberrationMove = 0;
      if (window.CRT) window.CRT.config.scope = 'page';   // no per-plate grade
      window.WORKGRID.apply();
      return true;
    },
    /* The aberration alone — an SVG filter, and SVG filters are far more
       expensive than CSS ones. It is 0 at rest and 12 while the field moves,
       so it only costs anything during a drag. */
    aberr(){
      if (!window.WORKGRID) return false;
      const C = window.WORKGRID.config;
      C.aberration = 0; C.aberrationMove = 0;
      window.WORKGRID.apply();
      return true;
    },
    crt(){
      if (!window.CRT) return false;
      window.CRT.config.enabled = false;
      window.CRT.apply();
      return true;
    },
    blob(){
      const b = document.querySelector('.work-blobs');
      if (!b) return false;
      b.style.display = 'none';
      return true;
    },
    radius(){                     // the rounding rewrite, work page and gallery
      let hit = false;
      if (window.WORKGRID){ const C = window.WORKGRID.config; C.radius = 0; C.radiusMove = 0; hit = true; }
      if (window.PATHG){ const C = window.PATHG.config; C.radius = 0; C.radiusMove = 0; hit = true; }
      return hit;
    },

    /* ---- the gallery ---- */
    tint(){
      if (!window.TINT) return false;
      window.TINT.config.enabled = false;
      window.TINT.apply();
      return true;
    },
    map(){
      if (!window.PATHMAP) return false;
      window.PATHMAP.config.enabled = false;
      window.PATHMAP.apply();
      return true;
    },
  };

  const found = {};
  function apply(){
    want.forEach(name => {
      if (found[name]) return;
      const fn = SWITCH[name];
      if (!fn){ found[name] = 'unknown switch'; return; }
      try { if (fn()) found[name] = 'off'; }
      catch (e){ found[name] = 'threw: ' + e.message; }
    });
  }

  /* Four passes over five seconds. A module that is still waiting on a mesh
     has not published its global yet, and a switch that silently did nothing
     would read as "that layer was free" — which is the one wrong answer this
     tool must never give. */
  let tries = 0;
  const iv = setInterval(function () {
    apply();
    if (++tries >= 5){
      clearInterval(iv);
      want.forEach(n => { if (!found[n]) found[n] = 'NOT FOUND on this page'; });
      console.log('%c[isolate] ' + JSON.stringify(found, null, 1),
                  'color:#ffb43a;font-family:monospace');
    }
  }, 1200);
  apply();
})();
