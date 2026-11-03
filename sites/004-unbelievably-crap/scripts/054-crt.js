/* ==========================================================================
   crt.js — the tube, for any page that wants it.

   It was written inside js/work-grid.js, which was right while exactly one page
   had it. The gallery wants it too, and copying it would leave two versions of
   one effect to keep in step — which is the mistake this module already made
   twice (see gridSize() in js/work-grid.js for both). So it moves out here and
   the work page loses nothing: the same dials, the same names, the same
   behaviour, from one file.

   THE SAME TREATMENT js/mask-scroll.js GIVES THE HOME PAGE'S 3D, done for DOM
   rather than in a shader: a grade, scan lines and a vignette.

   THE TUBE'S CURVATURE IS NOT HERE, and that is a decision rather than a
   limitation. It CAN be done — an SVG feDisplacementMap fed a barrel map bends
   real DOM per pixel, and it was built and it worked — but a displacement map
   carries eight bits, so the warp arrives quantised, and on a page of
   photographs and 5px microtype the stepping cost more than the curve was
   worth. It was taken out again. Each page keeps its own geometric curve
   instead: the work field's `fov` bends the grid by moving each card's four
   corners, which is exact and costs nothing.

   THE WORK PAGE ONLY. It was on the gallery too and was taken off: a page of
   photographs on white paper does not want a tube over it, and the map above is
   where that decision lives — a page with no entry here simply has no CRT,
   rather than having one that is switched off. Putting it back is one line.

   TWO SCOPES, and they are genuinely different pictures:

     page      one sheet of glass over everything, the microtype and the bar
               included. You are looking THROUGH a screen.
     subject   the glass belongs to the pictures and the page around them stays
               clean — which is what the home page does, where the CRT is on the
               figure and not on the room.

   HOW THE GRADE REACHES A SUBJECT WITHOUT THIS FILE KNOWING ANYTHING ABOUT IT.
   Both hosts already write their own `filter` per element per frame — the work
   field's distance-colour, the gallery's fog. This module cannot edit those
   strings and should not try. It writes ONE custom property on the host,
   `--crt-grade`, and each host appends `var(--crt-grade,)` to its own filter.
   The empty fallback is what makes it inert when the CRT is off: the property
   resolves to nothing and the filter chain is exactly what it was.
   ========================================================================== */
window.PAGE.register('crt', function (scope) {
  'use strict';

  /* WHICH ELEMENT IS THE ROOM, AND WHICH ARE THE SUBJECTS, per page. The same
     shape js/work-cursor.js uses for the blob: a page this module has no entry
     for simply does not get a tube, rather than getting a broken one. */
  const HOSTS = {
    design: { root: '.wgrid', subject: '.wgrid__plate' },
    /* NO ENTRY FOR THE 404, AND THAT IS DELIBERATE. It was given one, and the
       room came up red: this module puts a `filter` on its root, a filter makes
       a stacking context, and mix-blend-mode only ever sees the backdrop inside
       the context it sits in — so .about__fx's saturation layer stopped
       reaching the body's black and fell back to painting its own colour.
       Block 01 has no tube either; the texture on that block is the figure's
       own grain. */
  };
  const map = HOSTS[scope.dataset.page];
  if (!map) return;
  const root = scope.querySelector(map.root);
  if (!root) return;

  const CONFIG = {
    enabled: false,
    scope: 'page',      // page · subject
    contrast: 1.15,
    saturation: 1.1,
    scan: 2,            // px from one scan line to the next
    scanDepth: 0.35,    // ...and how dark each one is
    vignette: 1,        // how far the corners fall away
    /* THE LINES CAN DRIFT. A still scan pattern reads as a texture laid over
       the page; one that crawls, however slowly, reads as a signal. 0 holds it,
       which is a real setting rather than off. */
    roll: 0,            // px a second the lines travel

  };

  /* ---- ON, AND PAGE-SCOPED the way the rest of this site scopes its numbers
     (js/mask.js, js/work-cursor.js): a value tuned in one room has no business
     being written into another's file. These are the work page's own export. */
  /* THE GRADE STAYS. It was taken off once — contrast and saturation pushed to
     1 on the theory that a tube should be a texture and not a palette — and
     that was the wrong read of the complaint: the grid is ART DIRECTED, the
     push is part of how this page looks, and flattening it flattened the page.
     What was actually wrong was that an OPENED picture did not match it, and
     that is settled in js/lightbox.js, where the answer turned out to be the
     other way round: the grid keeps its grade, and the one picture you have
     asked to look at properly is shown as the file. */
  const PRESET = {
    design: { enabled: true, scope: 'page', scan: 2, scanDepth: 0.35, vignette: 1 },
  }[scope.dataset.page];
  if (PRESET) Object.assign(CONFIG, PRESET);

  const on = window.PAGE.bindings();
  let sheet = null, raf = 0, alive = true, t0 = performance.now(), lastRoll = -1;

  sheet = document.createElement('div');
  sheet.className = 'crt';
  sheet.setAttribute('aria-hidden', 'true');
  root.appendChild(sheet);

  function apply(){
    const C = CONFIG;
    const onPage = C.enabled && C.scope === 'page';
    const onSubject = C.enabled && C.scope !== 'page';

    root.style.setProperty('--crt-scan', Math.max(1, C.scan) + 'px');
    root.style.setProperty('--crt-depth', String(C.scanDepth));
    root.style.setProperty('--crt-vig', String(C.vignette));

    /* THE GRADE GOES WHERE THE SCOPE SAYS, AND ONLY THERE. Applying it in both
       places grades the pictures twice — once per element and once through the
       sheet over them — while the type and the bar, which are the whole
       difference between the two scopes, are never graded at all. */
    const grade = C.enabled
      ? ` contrast(${C.contrast}) saturate(${C.saturation})`
      : '';
    root.style.setProperty('--crt-grade', onSubject ? grade : '');
    root.style.filter = onPage ? grade.trim() : '';

    root.classList.toggle('is-crt', !!C.enabled);
    root.classList.toggle('is-crt-page', onPage);
    root.classList.toggle('is-crt-subject', onSubject);
  }

  /* The only per-frame work, and only while the lines are asked to move: one
     custom property carrying the scan pattern's offset. */
  function frame(now){
    if (!alive) return;
    if (CONFIG.enabled && Math.abs(CONFIG.roll) > 0.01){
      const y = ((now - t0) * 0.001 * CONFIG.roll) % Math.max(1, CONFIG.scan);
      const r = Math.round(y * 10) / 10;
      if (r !== lastRoll){ lastRoll = r; root.style.setProperty('--crt-roll', r + 'px'); }
    } else if (lastRoll !== 0){
      lastRoll = 0; root.style.setProperty('--crt-roll', '0px');
    }
    raf = requestAnimationFrame(frame);
  }

  apply();
  raf = requestAnimationFrame(frame);

  window.CRT = {
    config: CONFIG,
    apply,
    readout(){
      return { crt: CONFIG.enabled ? `on · ${CONFIG.scope}` : 'off' };
    },
    /* The rows, so every page's console can show the same set without three
       copies of the same twenty lines. */
    rows(){
      const C = CONFIG, self = this;
      const num = (key, min, max, step, hint) => ({
        label: 'crt.' + key, min, max, step,
        get: () => C[key], set: v => { C[key] = v; self.apply(); }, hint,
      });
      return [
        { label: 'crt.enabled', options: ['on', 'off'],
          get: () => (C.enabled ? 'on' : 'off'),
          set: v => { C.enabled = v === 'on'; self.apply(); },
          hint: 'the glass · the same treatment the home page’s 3D carries, done for DOM' },
        { label: 'crt.scope', options: ['page', 'subject'],
          get: () => C.scope, set: v => { C.scope = v; self.apply(); },
          hint: 'page: one sheet over everything, the microtype and the bar included — you are looking THROUGH a screen · subject: the glass belongs to the pictures and the page around them stays clean, which is what the home page does' },
        num('contrast', 0.5, 3, 0.05,
          'the grade’s contrast · mask-scroll runs 2.0 on the home page'),
        num('saturation', 0, 3, 0.05,
          '…and its saturation · on a monochrome picture this does nothing until some colour has been let through'),
        num('scan', 1, 20, 1,
          'px from one scan line to the next · 2 is a fine mesh, 8 is a monitor seen from across the room'),
        num('scanDepth', 0, 0.8, 0.01, '…and how dark each line is'),
        num('roll', -240, 240, 5,
          'px a second the lines travel · 0 holds them still, which is a real setting rather than off. A still pattern reads as a texture laid over the page; one that crawls reads as a signal'),
        num('vignette', 0, 1, 0.02,
          'how far the corners fall away · in SUBJECT scope this is per picture, in PAGE scope it is the whole screen'),
      ];
    },
  };

  return function destroy(){
    alive = false;
    cancelAnimationFrame(raf);
    on.release();
    if (sheet && sheet.parentNode) sheet.parentNode.removeChild(sheet);
    root.style.filter = '';
    root.classList.remove('is-crt', 'is-crt-page', 'is-crt-subject');
    ['--crt-scan','--crt-depth','--crt-vig','--crt-grade','--crt-roll']
      .forEach(v => root.style.removeProperty(v));

    sheet = null;
    if (window.CRT && window.CRT.config === CONFIG) delete window.CRT;
  };
});
