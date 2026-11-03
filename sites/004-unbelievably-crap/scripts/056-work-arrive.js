/* ==========================================================================
   work-arrive.js — the work page's pictures stream in rather than being there.

   Each card starts squashed to a horizontal band and smeared, then expands and
   sharpens into the photograph. Flattening a picture vertically and blurring it
   is what makes those ribbons of colour with rainbow edges — they are the
   photograph's own hues pulled across each other rather than a separate
   chromatic effect layered on top, which is why this needs two properties and
   not a filter stack.

   IT ANIMATES A WRAPPER, NOT THE CARD. Every element in a cell already has a
   property written to it on every frame — the cell its transform and opacity,
   the plate its filter and transform, the images their own transform. Anything
   this file set on those would be gone by the next frame, silently, which is
   the kind of bug that looks like "the animation doesn't work" and is actually
   two authors writing the same property. js/work-grid.js's makeCell now builds
   one wrapper, `.wgrid__arrive`, whose entire purpose is to be a surface the
   frame loop has no opinion about.

   THE FILTER IS TEMPORARY AND THAT IS THE POINT. A blur is a render surface,
   and thirty of them re-rasterised every frame is exactly what took this page
   from 120fps to 50 the last time. Here it exists for under a second per card,
   staggered so only a handful overlap, and then the class comes off and the
   wrapper is an ordinary div again with no filter, no transform and no
   will-change.

   THE RESTING STATE IS THE ARRIVED STATE. `.is-waiting` is added by this file
   and never sits in the stylesheet as a default, so if the grid rebuilds — it
   does, on resize — the new cards are simply visible. A version where the CSS
   defaulted to hidden would leave a resized window showing nothing at all, and
   only for people who resize.
   ========================================================================== */
window.PAGE.register('work-arrive', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'design') return;

  const CONFIG = {
    enabled: true,
    squash:  0.08,   // how flat the band is to start · 1 is no squash at all
    blur:    16,     // px of smear at the start
    ms:      820,    // how long one card takes
    stagger: 26,     // ms between one card starting and the next
    delay:   140,    // after the page is up, before the first one moves
    order:   'random',
  };

  /* Where in the sequence each card falls. The reference reads as unordered —
     they do not sweep across in rows — so random is the default; the others
     are here because they are one line each and worth being able to see. */
  const ORDERS = {
    random: (list) => list.map(v => [Math.random(), v]).sort((a,b) => a[0]-b[0]).map(v => v[1]),
    rows:   (list) => list,
    centre: (list) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      return list.slice().sort((a, b) => {
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        return Math.hypot(ra.left - cx, ra.top - cy) - Math.hypot(rb.left - cx, rb.top - cy);
      });
    },
    edges: (list) => ORDERS.centre(list).reverse(),
  };

  let timers = [], done = false;

  function clear(){
    timers.forEach(clearTimeout);
    timers = [];
  }

  function run(){
    if (done || !CONFIG.enabled) return;
    /* NOT WHILE THE BLACK IS UP. js/loader.js holds `is-loading` on <html> for
       the whole intro, and the first version of this started 140ms after mount
       — so the entire staggered arrival, about 1.7 seconds of it, played out
       behind the cover and the page was handed over with every card already
       landed. Nothing was broken and nothing was visible, which is the worst
       pair. js/lifecycle.js's intro() gate exists for exactly this and says so
       in its own comment; this is the same gate, read directly.

       A Barba navigation has no loader, so the class is absent and this
       returns straight through. */
    if (document.documentElement.classList.contains('is-loading')) return false;
    const cards = Array.prototype.slice.call(scope.querySelectorAll('.wgrid__arrive'));
    if (!cards.length) return false;
    done = true;

    const root = scope.querySelector('.wgrid') || scope;
    root.style.setProperty('--arrive-squash', String(Math.max(0.01, CONFIG.squash)));
    root.style.setProperty('--arrive-blur', Math.max(0, CONFIG.blur) + 'px');
    root.style.setProperty('--arrive-ms', Math.max(60, CONFIG.ms) + 'ms');

    cards.forEach(c => c.classList.add('is-waiting'));

    const seq = (ORDERS[CONFIG.order] || ORDERS.random)(cards);
    seq.forEach((c, i) => {
      const at = CONFIG.delay + i * Math.max(0, CONFIG.stagger);
      timers.push(setTimeout(() => {
        /* The transition goes on FIRST and in its own frame. Added in the same
           tick as the class removal, the browser has one style to resolve and
           no two states to interpolate between — the card would simply appear,
           which is the same non-animation the FLIP in js/lightbox.js has to
           force a reflow to avoid. */
        c.classList.add('is-arriving');
        void c.offsetWidth;
        c.classList.remove('is-waiting');
        timers.push(setTimeout(() => {
          /* EVERYTHING COMES OFF. No filter, no will-change, no transition
             rule left behind on thirty elements. */
          c.classList.remove('is-arriving');
        }, CONFIG.ms + 80));
      }, at));
    });
    return true;
  }

  /* The grid is built by js/work-grid.js on its own mount, and on a Barba
     navigation both modules mount in the same tick with no ordering promise
     between them. Rather than depend on that, look for the cards a few times
     and stop the moment they are there. */
  let tries = 0;
  const iv = setInterval(() => {
    if (run() || ++tries > 150) clearInterval(iv);   /* 12s · the loader is the long pole, not the build */
  }, 80);
  run();

  window.WORKARRIVE = {
    config: CONFIG,
    apply(){},
    /* Re-run it from the panel, which is the only way to see a change to any
       of these without reloading the page. */
    replay(){ clear(); done = false; run(); },
    readout(){ return { arrive: done ? 'played' : 'waiting' }; },
    rows(){
      const C = CONFIG, self = this;
      return [
        { label: 'arrive.enabled', options: ['on', 'off'],
          get: () => (C.enabled ? 'on' : 'off'),
          set: v => { C.enabled = v === 'on'; },
          hint: 'the pictures stream in on arrival · off and they are simply there, which is what a reload looked like before' },
        { label: 'arrive.replay', options: ['—', 'play'],
          get: () => '—',
          set: v => { if (v === 'play') self.replay(); },
          hint: 'run it again · the only way to judge a change to the values below without reloading' },
        { label: 'arrive.squash', min: 0.01, max: 1, step: 0.01,
          get: () => C.squash, set: v => { C.squash = v; },
          hint: 'how flat the band is before it opens · this is the effect, more than the blur is · at 1 there is no band at all and the cards only fade' },
        { label: 'arrive.blur', min: 0, max: 60, step: 1,
          get: () => C.blur, set: v => { C.blur = v; },
          hint: 'the smear · it is what turns the flattened picture into ribbons of colour rather than a thin sharp line' },
        { label: 'arrive.ms', min: 200, max: 2400, step: 20,
          get: () => C.ms, set: v => { C.ms = v; },
          hint: 'how long one card takes from band to photograph' },
        { label: 'arrive.stagger', min: 0, max: 160, step: 2,
          get: () => C.stagger, set: v => { C.stagger = v; },
          hint: 'the gap between one card starting and the next · this also decides how many are blurring at the same moment, which is the whole cost of the effect' },
        { label: 'arrive.delay', min: 0, max: 2000, step: 20,
          get: () => C.delay, set: v => { C.delay = v; },
          hint: 'the pause after the page is up before the first card moves' },
        { label: 'arrive.order', options: ['random', 'rows', 'centre', 'edges'],
          get: () => C.order, set: v => { C.order = v; },
          hint: 'RANDOM is the reference — they do not sweep, they simply arrive · CENTRE opens from the middle of the screen outward, EDGES the reverse, ROWS reads left to right and looks like a page loading' },
      ];
    },
  };

  return function destroy(){
    clearInterval(iv);
    clear();
    if (window.WORKARRIVE && window.WORKARRIVE.config === CONFIG) delete window.WORKARRIVE;
  };
});
