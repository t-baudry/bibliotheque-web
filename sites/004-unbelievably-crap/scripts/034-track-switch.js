/* ==========================================================================
   track-switch.js — back / next through the gallery's tracks.

   WHAT A PRESS DOES. The camera accelerates along the track it is already on,
   and somewhere in the middle of that rush the track underneath it becomes the
   next one. It then decelerates onto the new curve. The swap itself is never
   the event you watch — the speed is — which is the whole reason it does not
   read as a cut.

   WHY THE SWAP IS AT THE PEAK. Rebuilding the curve moves every plane at once;
   at rest that is a jump. At the fastest part of the ride the frame is already
   changing more between two frames than the rebuild changes it, so the new
   track arrives inside motion the eye has already accepted. Swapping at the
   start or the end of the burst puts the jump where the picture is calm, and
   both were visible.

   IT FEEDS THE TARGET, NOT THE POSITION. js/path-gallery.js runs a rubber band
   between `target` and `current`, and the wheel and the idle drift both write
   only the target. PATHG.advance() does the same, so this composes with a hand
   on the wheel mid-switch instead of fighting it for the variable.

   THE DISTANCE IS EXACT WHATEVER THE FRAME RATE. Each frame hands over the
   DIFFERENCE between the eased total so far and the total already given, so
   the sum is CONFIG.laps at t=1 on a 60Hz screen, a 120Hz screen and a
   stuttering one alike. Adding `speed * dt` per frame instead would make the
   distance a function of how well the machine was doing.
   ========================================================================== */
window.PAGE.register('track-switch', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'gallery') return;

  const bar = scope.querySelector('[data-track-bar]');
  if (!bar) return;

  /* A CURATED THREE, not Object.keys(SHAPES) — reading the shapes off the
     module would silently add a fourth the day someone adds one.

     TWO OF THE FOUR ARE OUT, and both are still in path-gallery.js — this is a
     choice about the rotation, not a deletion, and either goes back by putting
     its name in this array.

     `eight` stuttered. It crosses its own middle, so twice a lap the camera
     flies through the one place where planes from both halves of the track
     overlap — the densest frame the gallery can produce, arriving at the
     moment it is moving fastest.

     `drift` went next. It is a plain ring, and a ring seen from a camera
     riding it is the one shape that never shows you anything new: the same
     arc, the same order, every lap.

     WHAT THIS COSTS, said out loud: with two entries, BACK and NEXT reach the
     same place. The pair stays because the design has both and because a third
     shape puts it right, not because the second button is doing anything. */
  const ORDER = ['helix', 'knot'];

  const CONFIG = {
    enabled: true,
    laps: 0.35,     // extra laps travelled during one switch
    ms: 1350,       // how long the whole flourish takes
    swapAt: 0.43,    // where in it the track changes · 0.5 is the fastest point
    x: 10,          // px from the left
    y: 259,         // px from the top · Figma's, and expected to want moving
  };

  const on = window.PAGE.bindings();
  const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  let raf = 0, busy = false;

  function place(){
    bar.style.setProperty('--trk-x', CONFIG.x + 'px');
    bar.style.setProperty('--trk-y', CONFIG.y + 'px');
  }

  function gallery(){
    const G = window.PATHG;
    return (G && typeof G.advance === 'function' && G.config) ? G : null;
  }

  function indexOfCurrent(G){
    const i = ORDER.indexOf(G.config.shape);
    /* NOT -1 + 1 = 0. If the gallery is on a shape outside the rotation —
       `helix`, or anything added later — "next" should start the rotation
       rather than silently jump to its second entry. */
    return i < 0 ? -1 : i;
  }

  function go(dir){
    if (busy || !CONFIG.enabled) return;
    const G = gallery();
    if (!G) return;

    const i = indexOfCurrent(G);
    const to = i < 0
      ? (dir > 0 ? 0 : ORDER.length - 1)
      : (i + dir + ORDER.length) % ORDER.length;
    const shape = ORDER[to];

    busy = true;
    bar.classList.add('is-busy');

    const startAt = performance.now();
    /* Backwards still travels FORWARD along the track. The camera has one
       direction of travel and reversing it for a "back" button would read as
       the film being rewound rather than as the previous track being chosen. */
    const total = Math.abs(CONFIG.laps);
    let given = 0, swapped = false;

    function frame(now){
      const G2 = gallery();
      if (!G2){ done(); return; }

      const t = Math.max(0, Math.min(1, (now - startAt) / Math.max(1, CONFIG.ms)));
      const want = easeInOut(t) * total;
      G2.advance(want - given);
      given = want;

      if (!swapped && t >= CONFIG.swapAt){
        swapped = true;
        G2.config.shape = shape;
        G2.rebuild();
      }

      if (t < 1){ raf = requestAnimationFrame(frame); return; }
      /* THE SWAP HAPPENS EVEN IF THE RIDE WAS CUT SHORT — a swapAt above 1, a
         single-frame run — because a press that changed nothing at all is the
         one outcome with no explanation on screen. */
      if (!swapped){ G2.config.shape = shape; G2.rebuild(); }
      done();
    }

    function done(){
      cancelAnimationFrame(raf);
      raf = 0;
      busy = false;
      bar.classList.remove('is-busy');
    }

    raf = requestAnimationFrame(frame);
  }

  on(bar, 'click', e => {
    const btn = e.target.closest && e.target.closest('[data-track]');
    if (!btn) return;
    go(btn.dataset.track === 'prev' ? -1 : 1);
  });

  /* The wheel belongs to the gallery underneath. Without this a scroll that
     began on the bar would be swallowed and the ride would stall wherever the
     pointer happened to be. */
  on(bar, 'wheel', e => {
    const G = gallery();
    if (!G) return;
    e.preventDefault();
    G.advance(e.deltaY * (G.config.wheelSpeed || 0));
  }, { passive: false });

  place();

  window.TRACKSWITCH = {
    config: CONFIG,
    apply(){ place(); },
    next(){ go(1); },
    prev(){ go(-1); },
    get busy(){ return busy; },
    readout(){ return { switcher: ORDER.join(' · ') }; },
    groups(){
      const S = window.TRACKSWITCH;
      if (!S) return [];
      const num = (key, min, max, step, hint) => ({
        label: 'trk.' + key, min, max, step, hint,
        get: () => S.config[key], set: v => { S.config[key] = v; S.apply(); },
      });
      return [{
        name: 'GALLERY · the track switch', open: false, rows: [
          { label: 'trk.enabled', options: ['on', 'off'],
            get: () => S.config.enabled ? 'on' : 'off',
            set: v => { S.config.enabled = (v === 'on'); },
            hint: 'off leaves the bar visible and inert' },
          num('laps', 0.2, 4, 0.05,
              'how far the camera rushes during one switch, in laps of the track'),
          num('ms', 300, 4000, 50, 'how long the whole flourish takes'),
          num('swapAt', 0.05, 0.95, 0.01,
              'where in the rush the track changes · 0.5 is the fastest point, which is where the change hides'),
          num('x', 0, 400, 1, 'the bar’s distance from the left edge, in px'),
          num('y', 0, 1000, 1, 'the bar’s distance from the top, in px'),
          { label: 'trk.play', options: ['—', 'next', 'back'],
            get: () => '—',
            set: v => { if (v === 'next') S.next(); if (v === 'back') S.prev(); },
            hint: 'runs a switch from here while you are tuning the numbers' },
        ],
      }];
    },
  };

  return function destroy(){
    cancelAnimationFrame(raf);
    on.release();
    if (window.TRACKSWITCH && window.TRACKSWITCH.config === CONFIG) delete window.TRACKSWITCH;
  };
});
