/* ==========================================================================
   tunnel-console.js — the gallery page's corridor's dials.

   Its own file rather than a group bolted onto js/tune-console.js: that panel
   is the sphere's and guards on #sphereViewport, which this page no longer has.
   A console that mounts on a page whose subject it does not describe is how a
   dial ends up writing to nothing.
   ========================================================================== */
window.PAGE.register('tunnel-console', function (scope) {
  'use strict';
  if (!window.Tuner?.enabled) return;
  if (scope.dataset.page !== 'gallery' || !window.TUNNEL) return;

  const T = window.TUNNEL, C = T.config;
  const num = (key, min, max, step, hint) => ({
    label: 'tun.' + key, min, max, step,
    get: () => C[key], set: v => { C[key] = v; T.apply(); }, hint,
  });
  /* Anything that changes HOW MANY planes exist has to rebuild, not re-lay. */
  const rebuild = (key, min, max, step, hint) => ({
    label: 'tun.' + key, min, max, step,
    get: () => C[key], set: v => { C[key] = v; T.rebuild(); }, hint,
  });
  const flag = (key, hint) => ({
    label: 'tun.' + key, get: () => !!C[key],
    set: v => { C[key] = !!v; T.apply(); }, hint,
  });

  const panel = window.Tuner.create({
    title: 'TUNNEL',
    storeKey: 'shots2026.gallery',
    config: C,
    apply: () => T.apply(),
    restored: () => T.rebuild(),
    reset: () => T.rebuild(),
    readout: () => ({ ...T.readout(),
                      ...(window.WORKFX ? { blob: 'on' } : {}) }),

    groups: [
      /* THE ARRANGEMENT — the brief's own "suggest a few ways", as a dial. They
         are four different pictures rather than four settings of one, which is
         why this is the first row on the panel. */
      { name: 'TUNNEL · how the images sit', open: true, rows: [
        { label: 'tun.mode', options: T.modes,
          get: () => C.mode, set: v => { C.mode = v; T.apply(); },
          hint: 'walls: flat ON the wall, foreshortened, the reference’s · facing: square to you, every picture legible · mixed: walls with every nth turned to face you · rings: four at one depth, one per wall' },
        num('mixedEvery', 2, 12, 1,
          'in MIXED only · one facing image every this many'),
        num('spread', 0, 1, 0.01,
          'in FACING only · how far off the axis they scatter · 0 stacks them on the axis'),
        num('tilt', 0, 45, 1,
          'how far a wall image turns off its wall · 0 is truly flat and nearly edge-on, which is dramatic and unreadable'),
        rebuild('passes', 1, 6, 1,
          'how many times the set repeats down the corridor · more is denser and costs one plane each'),
      ]},

      { name: 'TUNNEL · the corridor', open: true, rows: [
        num('perspective', 300, 2000, 10,
          'the lens · low is wide and the rush is violent, high is long and calm'),
        num('half', 300, 1600, 10,
          'from the axis to a wall · below about 700 the walls converge inside the frame and the corridor stops reaching past the edges'),
        num('gap', 80, 900, 10,
          'depth between one image and the next'),
        num('size', 80, 900, 10, 'the long edge of an image, in px'),
        num('aspect', 0.6, 2.5, 0.05, 'their shape · 1.4 is a 3:2 frame on its side'),
        flag('wallsOn', 'the four walls themselves — off for photographs in a black void'),
        { label: 'tun.wallCol', options: ['#d9d9d9','#ffffff','#9a9a9a','#6a6a6a','#3a3a3a'],
          get: () => C.wallCol, set: v => { C.wallCol = v; T.apply(); },
          hint: 'the walls’ own lightness BEFORE distance touches them · the corridor’s falloff is the fog, not paint' },
        num('tileZ', 800, 12000, 100,
          'how long one tile of corridor is · the walls are three of these and the camera wraps every one, so the join stays inside the fog'),
        num('grid', 40, 800, 10, 'px between the ruled lines on a wall'),
        num('gridA', 0, 0.5, 0.01, '…and how dark they are · 0 is a bare wall'),
        num('fog', 0, 1, 0.01, 'how black the far end is'),
        num('fogEnd', 5, 90, 1, '…and how far out that darkness reaches, in % of the frame'),
      ]},

      { name: 'TUNNEL · the camera', open: true, rows: [
        num('wheelSpeed', 0.1, 4, 0.05, 'px of travel per px of wheel'),
        num('ease', 0.01, 0.4, 0.01,
          'seconds to catch up · 0.02 is the rate the rest of this site scrolls at'),
        num('drift', -600, 600, 10,
          'px a second with no hand on it · the corridor moves on its own'),
        num('roll', -180, 180, 1, 'rotation about the axis, in degrees'),
        num('rollDrift', -30, 30, 0.5,
          '…and degrees a second, if it should keep turning'),
        num('lookX', -40, 40, 0.5, 'aim the camera left or right of the axis'),
        num('lookY', -40, 40, 0.5, '…and up or down'),
      ]},

      { name: 'TUNNEL · the photographs', open: false, rows: [
        num('grey', 0, 1, 0.01,
          '1 is the monochrome the rest of the site uses, 0 is the picture’s own colour'),
        num('contrast', 0.4, 2.5, 0.05, 'contrast on top of that'),
        { label: 'tun.shots', textarea: true, rows: 8,
          get: () => T.getShots(), set: v => { T.setShots(v); },
          hint: 'one filename per line, from assets/gallery · the corridor takes however many it is given and spaces them accordingly' },
      ]},
    ],
  });

  return function destroy(){ panel.destroy(); };
});
