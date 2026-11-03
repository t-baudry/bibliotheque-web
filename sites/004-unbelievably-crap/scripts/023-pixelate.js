/* ==========================================================================
   pixelate.js — pixelated image reveal

   Ported from the supplied snippet, with two changes needed to make it work
   on this site:

   1. SIZING. The original measures the container with getBoundingClientRect.
      Every image here lives on a 3D-transformed card, where that returns the
      PROJECTED bounding box — a rotated card would get a canvas of the wrong
      shape, and an edge-on one a canvas of near-zero width. This uses
      offsetWidth/offsetHeight, which is the element's own untransformed box.

   2. AN attach() API. The original scans the DOM on DOMContentLoaded, but
      the wheel and sphere build their images in JavaScript after that, so
      nothing would ever be found. attach() can be called on an element the
      moment it is created. Static markup with [data-pixelate-render] is
      still picked up automatically.

   Starts are staggered. Fifty cards each spawning canvases on the same frame
   is a visible hitch; a few ms apart it reads as a cascade and costs nothing.
   ========================================================================== */
(() => {
  'use strict';

  const DEFAULTS = { duration: 90, steps: 10, columns: 10, fit: 'cover' };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- hold / release -------------------------------------------------------
     The intro loader mounts the page behind an opaque black layer so the wheel
     is built and its photos are decoded before anyone sees it. Without this,
     the reveal these canvases exist for would play out entirely behind that
     black and the page would simply appear, already finished. While held,
     attach() records the call instead of running it, and release() plays them
     all at the original stagger. Anything with no loader never touches it —
     `held` starts false and only js/loader.js's markup can set it. */
  let held = document.documentElement.classList.contains('is-loading');
  const queue = [];

  function release(){
    if (!held) return;
    held = false;
    const pending = queue.splice(0);
    pending.forEach(([root, opts]) => attach(root, opts));
  }

  function attach(root, opts = {}){
    if (reduced || !root || root.dataset.pixelateDone === '1') return;
    const img = root.querySelector('img');
    if (!img) return;

    if (held){ queue.push([root, opts]); return; }

    const o = { ...DEFAULTS, ...opts };
    root.dataset.pixelateDone = '1';

    const start = () => {
      const w = root.offsetWidth, h = root.offsetHeight;
      if (!w || !h || !img.naturalWidth) return;

      const canvas = document.createElement('canvas');
      canvas.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;';
      const dpr = Math.min(2, Math.max(1, Math.floor(window.devicePixelRatio || 1)));
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      if (getComputedStyle(root).position === 'static') root.style.position = 'relative';
      root.appendChild(canvas);

      // full-resolution buffer the pixelated stages are sampled from
      const back = document.createElement('canvas');
      back.width = canvas.width; back.height = canvas.height;
      const bctx = back.getContext('2d');
      const cw = back.width, ch = back.height;
      const s = o.fit === 'contain'
        ? Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
        : Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = Math.round(img.naturalWidth * s), dh = Math.round(img.naturalHeight * s);
      bctx.imageSmoothingEnabled = true;
      bctx.drawImage(img, (cw - dw) >> 1, (ch - dh) >> 1, dw, dh);

      // geometric ramp from `columns` up to full resolution
      const ramp = [];
      const startCols = Math.min(o.columns, cw);
      const ratio = Math.pow(cw / startCols, 1 / Math.max(1, o.steps));
      for (let i = 0; i < o.steps; i++){
        ramp.push(Math.max(1, Math.round(startCols * Math.pow(ratio, i))));
      }
      for (let i = 1; i < ramp.length; i++) if (ramp[i] <= ramp[i-1]) ramp[i] = ramp[i-1] + 1;

      const tiny = document.createElement('canvas');
      const tctx = tiny.getContext('2d');
      let stage = 0, stageStart = 0;

      const paint = cols => {
        const rows = Math.max(1, Math.round(cols * (ch / cw)));
        if (tiny.width !== cols || tiny.height !== rows){ tiny.width = cols; tiny.height = rows; }
        tctx.imageSmoothingEnabled = false;
        tctx.clearRect(0, 0, cols, rows);
        tctx.drawImage(back, 0, 0, cw, ch, 0, 0, cols, rows);
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(tiny, 0, 0, cols, rows, 0, 0, cw, ch);
      };

      paint(ramp[0]);

      const step = t => {
        if (!stageStart) stageStart = t;
        if (t - stageStart >= o.duration){ stage++; stageStart = t; }
        if (stage >= ramp.length - 1){
          canvas.style.transition = 'opacity .12s linear';
          canvas.style.opacity = '0';
          setTimeout(() => canvas.remove(), 200);
          return;
        }
        paint(ramp[stage]);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const go = () => setTimeout(start, opts.delay || 0);
    if (img.complete && img.naturalWidth) go();
    else img.addEventListener('load', go, { once: true });
  }

  /* Static markup still works exactly as in the original snippet. It now
     takes a root so it can be re-run against each incoming Barba container
     instead of only firing once on DOMContentLoaded — the observers and
     one-shot listeners it creates all live on elements inside that container,
     so they go away with it. */
  function scan(root){
    (root || document).querySelectorAll('[data-pixelate-render]').forEach((root, i) => {
      const n = a => { const v = parseInt(root.getAttribute(a), 10); return Number.isFinite(v) ? v : undefined; };
      const opts = {
        duration: n('data-pixelate-render-duration'),
        steps: n('data-pixelate-render-steps'),
        columns: n('data-pixelate-render-columns'),
        fit: root.getAttribute('data-pixelate-render-fit') || undefined,
        delay: i * 18,
      };
      Object.keys(opts).forEach(k => opts[k] === undefined && delete opts[k]);
      const trigger = (root.getAttribute('data-pixelate-render-trigger') || 'load').toLowerCase();
      if (trigger === 'inview'){
        const io = new IntersectionObserver(es => {
          es.forEach(e => { if (e.isIntersecting){ attach(root, opts); io.disconnect(); } });
        }, { rootMargin: '0px 0px -25% 0px', threshold: 0.25 });
        io.observe(root);
      } else if (trigger === 'hover'){
        root.addEventListener('mouseenter', () => attach(root, opts), { once: true });
      } else if (trigger === 'click'){
        root.addEventListener('click', () => attach(root, opts), { once: true });
      } else attach(root, opts);
    });
  }

  window.PIXELATE = { attach, scan, release, defaults: DEFAULTS };

  /* Static [data-pixelate-render] markup, per page. Registered rather than
     bound to DOMContentLoaded so the second page gets it too. Images built in
     JS (the wheel cards, the sphere cards, the preview layers) call
     PIXELATE.attach directly at creation time instead. */
  window.PAGE.register('pixelate', function (scope) { scan(scope); });
})();
