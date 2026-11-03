/* ==========================================================================
   path-console.js — the curve gallery's dials.

   Grouped by what you are actually adjusting when you reach for one: the SHAPE
   of the ride, the FEEL of being carried along it, the SPOTLIGHT, and the
   scatter. The quirky ones are in the second and third groups and they are the
   reason this effect is worth having.
   ========================================================================== */
window.PAGE.register('path-console', function (scope) {
  'use strict';
  if (!window.Tuner?.enabled) return;
  if (scope.dataset.page !== 'gallery' || !window.PATHG) return;

  const G = window.PATHG, C = G.config;
  const num = (k, min, max, step, hint) => ({
    label: 'pg.' + k, min, max, step,
    get: () => C[k], set: v => { C[k] = v; G.apply(); }, hint,
  });
  const rebuild = (k, min, max, step, hint) => ({
    label: 'pg.' + k, min, max, step,
    get: () => C[k], set: v => { C[k] = v; G.rebuild(); }, hint,
  });

  const panel = window.Tuner.create({
    title: 'CURVE GALLERY',
    storeKey: 'shots2026.gallery',
    config: C,
    apply: () => G.apply(),
    restored: () => G.rebuild(),
    reset: () => G.rebuild(),
    readout: () => ({ ...G.readout(),
                      ...(window.PATHMAP ? window.PATHMAP.readout() : {}),
                      ...(window.TINT ? window.TINT.readout() : {}) }),

    groups: [
      /* ---- added since the panel was written --------------------------------
         The tuner does NOT discover rows(): every group is listed by hand in a
         console file, so a module can expose a perfectly good rows() and simply
         never appear. These four did exactly that. Spread conditionally, like
         the rest of the file, so a page that does not run one of them shows no
         empty section. */
      ...(window.TRACKSWITCH ? window.TRACKSWITCH.groups() : []),
      ...(window.LIGHTBOX ? [{ name: 'GALLERY \u00b7 opening one picture', open: true,
          rows: window.LIGHTBOX.rows() }] : []),
      ...(window.LINEREVEAL ? [{ name: 'COPY \u00b7 how fast the text resolves', open: false,
          rows: window.LINEREVEAL.rows() }] : []),
      ...(window.CTA ? [{ name: 'BAR \u00b7 the refusing button', open: false,
          rows: window.CTA.rows() }] : []),

      /* THE MAP AND THE TINT, from js/path-map.js and js/tint.js. Their own
         groups rather than rows folded into RIDE: one is an instrument reading
         the ride and the other is a sheet over the whole page, and neither is
         a property of the track itself. */
      ...(window.PATHMAP ? [{ name: 'MAP \u00b7 the ride from above', open: true,
                              rows: window.PATHMAP.rows() }] : []),
      ...(window.TINT ? [{ name: 'TINT \u00b7 the whole page', open: true,
                           rows: window.TINT.rows() }] : []),

      { name: 'RIDE · the track', open: true, rows: [
        { label: 'pg.track', options: G.shapes,
          get: () => C.shape, set: v => { C.shape = v; G.apply(); },
          hint: 'drift: a ring that rises and falls · helix: a corkscrew, the most disorienting · eight: crosses its own middle so you meet the same junction twice · knot: a trefoil, no angle reads as flat' },
        num('knots', 4, 40, 1,
          'how many points the curve is bent through · few is a lazy arc, many is a scribble and the camera will throw you around'),
        num('scale', 0.3, 3, 0.05, 'the whole track, bigger or smaller'),
      ]},

      { name: 'RIDE · how it carries you', open: true, rows: [
        num('lookAhead', 0.001, 0.08, 0.001,
          'how far up the path the camera looks · low and it stares at the inside of every bend as it takes it, high and it cuts the corner and the track swings out from under you. THE dial for driving versus being driven'),
        num('bank', 0, 2, 0.05,
          'how hard it rolls into a turn · 0 keeps the horizon dead level through a corkscrew, which the eye reads as a bug rather than as calm'),
        num('rubber', 0.05, 2, 0.05,
          'seconds the camera lags the scroll · the reference eases a whole second and that lag is most of why it feels like film rather than like a slider'),
        num('drift', -0.06, 0.06, 0.001,
          'laps a second with no hand on it · negative runs the gallery backwards'),
        num('wheelSpeed', 0.00001, 0.0005, 0.00001, 'laps per px of wheel'),

        { label: 'pg.pin', options: ['on', 'off'],
          get: () => window.PATHG.config.pin ? 'on' : 'off',
          set: v => { window.PATHG.config.pin = (v === 'on'); window.PATHG.apply(); },
          hint: 'THE ONE TO TRY IF PICTURES BLINK OUT \u00b7 a plane changes its screen size every frame as it rushes past, and unpinned the browser re-draws it from scratch every time \u2014 a photograph beside the camera is a megapixel redone sixty times a second, and the frame it misses is a picture that vanishes for a sixtieth of a second \u00b7 ON tells it to draw once and stretch that instead, which can go a shade soft at the very last moment and does not blink \u00b7 which way is better depends on the machine, so this is a dial and not a decision' },
        num('mouseGain', 0, 8, 0.05,
            'HOW HARD THE POINTER LEANS THE CAMERA \u2014 the strength dial, and the one to reach for \u00b7 it multiplies the two axes below and keeps their balance, so the effect gets bigger rather than lopsided \u00b7 0 switches it off, 1 is the default, past about 4 the camera swings far enough that a photograph can pass beside the eye and be clipped'),
        num('mouseX', -600, 600, 5,
            'px the eye steps sideways for a pointer at the edge of the screen, before the gain above \u00b7 it moves the CAMERA and nothing else, so near photographs slide further than far ones and the depth is what you feel \u00b7 a minus inverts it'),
        num('mouseY', -600, 600, 5,
            '\u2026and up or down \u00b7 smaller than the sideways one by default, because the screen is wider than it is tall and the same number reads as more movement here'),
        num('mouseTurn', 0, 1, 0.05,
            'what the eye does with that step \u00b7 0 the aim travels with it and the view SLIDES, the camera having stepped sideways and still looking the same way \u00b7 1 the aim stays put and the camera swings to keep it, which is an orbit around the point ahead'),
        num('mouseEase', 0.02, 1.5, 0.02,
            'seconds to catch up \u00b7 the lag is the camera\u2019s weight \u00b7 near 0 it is welded to the pointer, which reads as the page tracking your hand rather than as a camera'),
      ]},

      /* SQUARE AT REST, ROUNDING AS YOU SCROLL — the work page's idea, on
         this page's planes. See the block in js/path-gallery.js's CONFIG for
         why it is measured off the WHEEL rather than off the camera's own
         speed, and why it is a percentage here and pixels there. */
      { name: 'RIDE \u00b7 rounded while scrolling', open: true, rows: [
        num('radius', 0, 50, 0.5,
          'the corner radius AT REST, as a percentage of each plane \u00b7 0 is the square photograph'),
        num('radiusMove', 0, 50, 0.5,
          '\u2026and at full scroll \u00b7 50 is a full ellipse whatever the plane\u2019s size, which is why this is a percentage and not the pixels the work page uses: these planes run from about 30px to 400 as the camera passes, and one number of pixels would be a hairline on one and a circle on its neighbour'),
        num('radiusAt', 40, 1200, 10,
          'how much wheel in one go counts as FULL rounding \u00b7 low and a nudge rounds them completely, high and it takes a real throw'),
        num('radiusFall', 0.05, 2, 0.05,
          'seconds to settle back once you stop \u00b7 it is the wheel this follows, not the camera, because DRIFT keeps the camera moving with no hand on it and the planes would never come back to square'),
      ]},

      { name: 'RIDE \u00b7 the spotlight', open: true, rows: [
        num('swell', 0, 8, 0.1,
          'how much the nearest photograph magnifies · this is the whole effect'),
        num('swellPow', 0.3, 6, 0.1,
          'the falloff · 1 inflates half the gallery at once, 3 is a spotlight that is over almost as soon as it starts. Cubed is the reference’s and the reason only one picture is ever the subject'),
        num('swellNear', 400, 6000, 50, 'px within which anything swells at all'),
        num('swellMax', 1, 8, 0.1,
          'a ceiling, because the perspective divide is ALREADY magnifying as you close · without it the two compound into a white screen'),
      ]},

      { name: 'RIDE · the scatter', open: false, rows: [
        rebuild('count', 20, 400, 10, 'how many planes ride the curve'),
        num('scatterMin', 200, 2000, 20,
          'the corridor the camera keeps to itself · below this nothing is placed, because the camera rides the curve and would fly straight through it'),
        num('scatterX', 0, 2500, 25, 'how far they scatter sideways off the curve'),
        num('scatterY', 0, 2500, 25, '…and up and down'),
        num('scatterZ', 0, 1200, 10, '…and along it, so they do not arrive in ranks'),
        num('seed', 1, 99, 1,
          'RE-ROLL · every offset and size comes off this one number, so nudging it deals a whole new gallery and nothing else changes'),
        num('size', 60, 900, 10, 'the long edge before any swell'),
        num('sizeVary', 0, 1, 0.05, 'how much sizes differ from each other'),
        { label: 'pg.face', options: G.faces,
          get: () => C.face, set: v => { C.face = v; G.apply(); },
          hint: 'curve: turned to the track, so they bank through a corner · camera: always square on, every picture legible and the curve invisible' },
      ]},

      /* THE FRAME. A property of the picture, not of where the camera is, which
         is why it is set at layout and not per frame. */
      { name: 'RIDE · the shape of the frames', open: true, rows: [
        { label: 'pg.frame', options: G.clips,
          get: () => C.frame, set: v => { C.frame = v; G.apply(); },
          hint: 'rect · circle · ellipse · diamond · triangle · hex · arch · blade · slit — cut into the photograph itself, so it holds at any angle and any size' },
        num('frameVary', 0, 1, 0.05,
          'how many get a shape of their own instead · dealt from the same seed as the scatter, so re-rolling seed re-deals these too rather than being a second randomness to reason about'),
      ]},

      /* PARALLAX. The frame is a window and the photograph is behind it, so
         what a frame shows depends on where you are standing. */
      { name: 'RIDE · the picture behind the frame', open: true, rows: [
        num('parallax', 0, 2, 0.05,
          'how far the picture lags its frame as you pass it \u00b7 0 welds the two together and the frame goes back to being a shaped decal'),
        num('parallaxZoom', 1, 2.5, 0.05,
          'how much larger the photograph is drawn than its window \u00b7 this IS the room it has to move in, so a big parallax with a small zoom simply runs out of travel and clamps'),
        { label: 'pg.parallaxAxis', options: ['both', 'x', 'y'],
          get: () => C.parallaxAxis, set: v => { C.parallaxAxis = v; },
          hint: 'which way it is free to slide \u00b7 x alone reads as a window passed at speed, y alone as one you rise past' },
        num('parallaxFalloff', 0, 1, 0.05,
          'how much more the NEAR pictures move than the far ones \u00b7 0 shifts the whole gallery by one rule and the depth stops reading, 1 leaves the far field perfectly still'),
        num('parallaxNear', 400, 9000, 100,
          'the distance inside which a picture gets its full share of the movement'),
      ]},

      /* THE CLOCK IN THE BAR, from js/clock.js. The bar is on every page, so
         this group is the same on each of them. */
      ...(window.CLOCK ? [{ name: 'BAR \u00b7 the clock', open: false,
                            rows: window.CLOCK.rows() }] : []),

      /* COLOUR AS DISTANCE — near is the photograph as taken, far has already
         gone to memory. */
      { name: 'RIDE · colour by distance', open: true, rows: [
        num('greyNear', 0, 1, 0.01,
          'how monochrome a photograph is when it is CLOSE · 0 is its own colour'),
        num('greyFar', 0, 1, 0.01,
          '…and when it is far · 1 is black and white. Swap the two to run it the other way'),
        num('greyAt', 0, 4000, 50,
          'px within which it is fully the near value'),
        num('greyGone', 500, 14000, 100,
          '…and beyond which it is fully the far one'),
        num('greyPow', 0.2, 4, 0.05,
          'the curve between them · above 1 the colour survives further out, below 1 it drains almost at once'),
        num('contrast', 0.4, 2.5, 0.05, 'contrast, at every distance'),
      ]},

      { name: 'RIDE · the air', open: false, rows: [
        num('perspective', 300, 2500, 25, 'the lens'),
        num('fogNear', 0, 4000, 50, 'px at which a photograph starts fading out'),
        num('fogFar', 500, 14000, 100, '…and where it has gone entirely'),
        num('nearClip', 100, 1500, 10,
          'how far in front of the eye a plane must be to be drawn · a plane LEVEL with the camera has almost no depth and the perspective divide sends it to infinity, so "beside you" is the dangerous position, not "behind you"'),
        { label: 'pg.shots', textarea: true, rows: 8,
          get: () => G.getShots(), set: v => { G.setShots(v); },
          hint: 'one filename per line, from assets/gallery' },
      ]},
    ],
  });

  return function destroy(){ panel.destroy(); };
});
