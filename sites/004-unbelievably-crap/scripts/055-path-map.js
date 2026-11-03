/* ==========================================================================
   path-map.js — the ride, seen from above.

   WHAT IT IS. The gallery flies a closed curve through a field of
   photographs; this is that curve drawn flat, with the camera's position on
   it. Figma 14619:12641 puts it at 10,10 in a 184x265 box — the same corner
   and the same hatched ground the home page's map uses, which is deliberate:
   it is the same instrument reading a different journey.

   IT DOES NOT KNOW THE CURVE, AND MUST NOT. The track is a closed Catmull-Rom
   through control points that js/path-gallery.js rebuilds whenever the shape,
   the knot count, the seed or the scale changes. A second copy of that maths
   here would be correct exactly until the first time a dial moved. So this
   module asks — PATHG.curveAt(t) and PATHG.where() — and draws whatever comes
   back. Change the track and the map changes with it, for free.

   THE PROJECTION IS A PLAN, which is what makes it a map. X and Z are the
   ground plane and Y is height, so height is dropped and the two remaining
   axes are fitted to the box. A curve that rises and falls — the `helix`, say
   — therefore crosses ITSELF on the map, and that is correct rather than a
   fault: a road that passes over another road looks like that from a
   helicopter too. `tiltY` mixes a little height back in for pages that would
   rather see the climb.

   HOW THE OPACITY WORKS, which is the part that was asked for. The line is
   drawn as a run of short segments, each with its own alpha, computed from how
   far that segment is from the camera ALONG THE PATH — not from how far away
   it is in space. Distance along the path is the honest measure of "where I
   have just been and where I am about to go": two stretches of track can be
   inches apart on the map and half a lap apart in the ride, and the eye should
   be told the second thing.

   MEASURED THE SHORT WAY ROUND. The track is a loop, so the distance between
   two laps is min(|a-b|, 1-|a-b|) — without that, the segment immediately
   BEHIND the camera at the seam reads as the furthest point on the map and
   goes dark, which puts a black notch in the brightest part of the line.
   ========================================================================== */
window.PAGE.register('path-map', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'gallery') return;
  const host = scope.querySelector('[data-path-map]');
  if (!host) return;
  const canvas = host.querySelector('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const CONFIG = {
    enabled: true,

    /* ---- the panel ----
       THE HOME PAGE'S MAP HAS NO GROUND and does not need one: nothing ever
       passes behind it. Here the photographs drift across the whole viewport,
       and a transparent instrument with a photograph showing through it stops
       being an instrument. So this one has paper.

       WHITE at nine tenths, which under the page's red multiply resolves to
       the red the Figma frame draws — so it is the panel in both settings
       rather than a white rectangle that only looks right with the tint on. */
    ground: '#ffffff',
    groundAlpha: 1,

    /* ---- the line ---- */
    samples: 420,       // points the curve is sampled at · the map's resolution
    colour: '#000000',

    /* ---- HOW THE LINE IS DRAWN ----
       TWO INDEPENDENT AXES, not one picker of every combination. WHAT the mark
       is — a continuous line, dashes, dots, ticks off the path — and HOW THICK
       it is are different questions, and a single list of `dashed-tapered`,
       `dotted-tapered`, `ticks-tapered`… would be that list multiplied out,
       with nothing to say which half you actually wanted to change.

       TICKS is the odd one and worth naming: instead of drawing ALONG the path
       it draws short strokes ACROSS it, which is how a route is marked on a
       survey map. The path is then read from the run of ticks rather than from
       a line, and at a wide gap it becomes a dotted trail of dashes lying
       across the direction of travel. */
    line: 'solid',      // solid · dashed · dots · ticks

    /* Segments drawn, then skipped. Both are in SAMPLES rather than pixels —
       the samples are evenly spaced in lap, not in distance, so a pixel dash
       would breathe as the track's curvature changed and a sample dash does
       not. Ignored by `solid`. */
    dash: 3,
    gap: 5,
    tick: 4,            // px · TICKS only, the stroke's length across the path

    width: 1.2,         // px · the line's weight away from you
    /* ...AND AT YOUR OWN POSITION. Thick where you are and thin at the far end
       of the loop was the ask; this is the thick end and `taper` is how much of
       the difference is actually used, so 0 gives a line of one weight without
       having to make the two numbers equal. */
    widthAt: 3.4,
    taper: 1,
    /* HOW MUCH OF THE BOX THE PATH FILLS. Below 1 it keeps a margin, which the
       fit needs: a line drawn to the very edge is a line whose end you cannot
       see is an end. */
    fit: 0.74,
    /* A PLAN VIEW AT 0 — height thrown away, the two ground axes drawn. Above
       0 folds some of the height back in, which turns the plan into a lean
       oblique and lets a corkscrew read as a corkscrew. */
    tiltY: 0.25,
    /* Which way round the plan sits. The curve has no north. */
    spin: 0,            // degrees

    /* ---- where you are on it ---- */
    /* THE TWO NUMBERS THE BRIEF ASKED FOR. `dim` is what the rest of the track
       falls to — 0 hides it entirely and only the lit stretch is drawn, 1 is a
       flat line with no reading at all. `reach` is how much of the lap around
       you stays lit, in laps: 0.06 is a short pool of light travelling with
       you, 0.5 is the whole loop graded from front to back. */
    dim: 0.05,
    reach: 0.12,
    /* The shape of the falloff between the two. 1 is a straight ramp; above 1
       holds the brightness close to you and then drops it, which reads as a
       pool rather than a gradient. */
    curve: 2.2,

    /* ---- the marker ---- */
    dot: 3,             // px · the square at the camera's position
    /* BLACK, NOT THE RED THE HOME PAGE'S CURSOR USES, and the tint is why. The
       gallery ships a red multiply over the whole page, and under a multiply
       nothing lighter than the backdrop survives — a red marker on red paper
       is not dim, it is gone. Dark reads on both grounds, so dark it is, and
       the halo below is what keeps it from merging into the line. */
    dotColour: '#000000',
    /* A CLEARING BEHIND THE MARKER. The line at the camera's own position is
       at full strength and the same colour as the marker sitting on it, so
       without this the one thing you are meant to find is the one thing with
       nothing to separate it. Painted in white rather than a guessed ground
       colour: under a multiply tint white resolves to the tint itself, so it
       reads as the paper on either setting. */
    halo: 4,            // px radius · 0 is off
    haloColour: '#ffffff',
    /* The direction it is travelling, drawn as a short spur off the dot. 0 is
       off. */
    heading: 7,         // px
  };

  const on = window.PAGE.bindings();
  let raf = 0, alive = true, dpr = 1, w = 0, h = 0;

  /* The projected curve, rebuilt only when the track or the framing changes —
     the camera moving does not move the line, it only moves the light along
     it. That is the whole reason this is cached: at 420 samples a rebuild is
     420 curve evaluations, and doing it per frame would be paying for a
     picture that has not changed. */
  let pts = null, builtFor = '';

  function project(){
    const G = window.PATHG;
    if (!G || !G.curveAt) return null;

    const N = Math.max(16, CONFIG.samples | 0);
    const a = CONFIG.spin * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    const raw = [];
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < N; i++){
      const p = G.curveAt(i / N);
      /* PLAN: x across, z down the page. Y — height — is folded in by tiltY
         rather than dropped outright, so the dial is a continuum from a true
         plan to a lean oblique rather than a switch between two pictures. */
      const x = p[0] * ca - p[2] * sa;
      const y = (p[2] * ca + p[0] * sa) - p[1] * CONFIG.tiltY;
      raw.push([x, y]);
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    /* ONE SCALE FOR BOTH AXES, so the track keeps its proportions — fitting
       each axis independently would stretch a circle into whatever shape the
       box happens to be. */
    const spanX = Math.max(1e-6, maxX - minX), spanY = Math.max(1e-6, maxY - minY);
    const k = Math.min(w / spanX, h / spanY) * Math.max(0.05, CONFIG.fit);
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    return raw.map(([x, y]) => [w / 2 + (x - cx) * k, h / 2 + (y - cy) * k]);
  }

  /* The signature of everything the PROJECTION depends on. Anything not in
     here can change without a rebuild; anything in here forces one. */
  function sig(){
    const G = window.PATHG;
    const C = G ? G.config : {};
    return [C.shape, C.knots, C.scale, C.seed, CONFIG.samples, CONFIG.spin,
            CONFIG.tiltY, CONFIG.fit, w, h].join('|');
  }

  function measure(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = host.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    builtFor = '';             // the fit depends on the box, so re-project
  }

  /* Laps between two points on a LOOP, the short way round: 0 to 0.5. */
  function lapGap(a, b){
    const d = Math.abs(((a - b) % 1 + 1) % 1);
    return Math.min(d, 1 - d);
  }

  function frame(){
    if (!alive) return;
    raf = requestAnimationFrame(frame);

    const G = window.PATHG;
    if (!CONFIG.enabled || !G){ ctx.clearRect(0, 0, w, h); return; }

    const s = sig();
    if (s !== builtFor){ pts = project(); builtFor = s; }
    if (!pts) return;

    const at = ((G.where() % 1) + 1) % 1;
    const N = pts.length;
    const reach = Math.max(1e-4, CONFIG.reach);
    const dim = Math.max(0, Math.min(1, CONFIG.dim));
    const pow = Math.max(0.1, CONFIG.curve);

    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = CONFIG.colour;
    ctx.fillStyle = CONFIG.colour;

    const mode = CONFIG.line;
    const period = Math.max(1, Math.round(CONFIG.dash) + Math.round(CONFIG.gap));
    const onFor = Math.max(1, Math.round(CONFIG.dash));
    const taper = Math.max(0, Math.min(1, CONFIG.taper));

    /* SEGMENT BY SEGMENT, because the alpha is a function of position and a
       single stroked path can only have one. 420 short strokes is nothing for
       a 184x265 box, and it buys an exact gradient along the track rather than
       a canvas gradient that would have to be laid out in screen space and
       would be wrong the moment the curve doubled back on itself. */
    for (let i = 0; i < N; i++){
      /* The gaps, in samples. `solid` skips nothing; everything else draws
         `dash` of every `dash + gap`. */
      if (mode !== 'solid' && (i % period) >= onFor) continue;

      const a = pts[i], b = pts[(i + 1) % N];
      const t = (i + 0.5) / N;
      const near = 1 - Math.min(1, lapGap(t, at) / reach);
      const lit = Math.pow(near, pow);
      const alpha = dim + (1 - dim) * lit;
      if (alpha <= 0.004) continue;

      /* THICK WHERE YOU ARE. The same `lit` the alpha uses, so the weight and
         the brightness peak at the same point rather than at two points a few
         samples apart — which is what would happen if this had its own curve,
         and it reads as a smear rather than as a head. */
      ctx.lineWidth = Math.max(0.1,
        CONFIG.width + (CONFIG.widthAt - CONFIG.width) * lit * taper);
      ctx.globalAlpha = alpha;

      if (mode === 'dots'){
        ctx.beginPath();
        ctx.arc(a[0], a[1], ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      if (mode === 'ticks'){
        /* ACROSS the path, not along it. The normal is the segment's direction
           turned a quarter turn, which is why this needs the segment at all. */
        const dx = b[0] - a[0], dy = b[1] - a[1];
        const m = Math.hypot(dx, dy) || 1;
        const nx = -dy / m * CONFIG.tick / 2, ny = dx / m * CONFIG.tick / 2;
        ctx.beginPath();
        ctx.moveTo(a[0] - nx, a[1] - ny);
        ctx.lineTo(a[0] + nx, a[1] + ny);
        ctx.stroke();
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    }

    /* THE CAMERA. Interpolated between the two samples it falls between rather
       than snapped to the nearer one — at 420 samples a snap is under a pixel,
       but it is a pixel of stutter on the one element whose whole job is to
       read as continuous movement. */
    const f = at * N, i0 = Math.floor(f) % N, u = f - Math.floor(f);
    const p0 = pts[i0], p1 = pts[(i0 + 1) % N];
    const px = p0[0] + (p1[0] - p0[0]) * u;
    const py = p0[1] + (p1[1] - p0[1]) * u;

    ctx.globalAlpha = 1;
    if (CONFIG.halo > 0.5){
      ctx.fillStyle = CONFIG.haloColour;
      ctx.beginPath();
      ctx.arc(px, py, CONFIG.halo, 0, Math.PI * 2);
      ctx.fill();
    }
    if (CONFIG.heading > 0.5){
      const dx = p1[0] - p0[0], dy = p1[1] - p0[1];
      const m = Math.hypot(dx, dy) || 1;
      ctx.strokeStyle = CONFIG.dotColour;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + dx / m * CONFIG.heading, py + dy / m * CONFIG.heading);
      ctx.stroke();
    }
    const d = Math.max(1, CONFIG.dot);
    ctx.fillStyle = CONFIG.dotColour;
    ctx.fillRect(Math.round(px - d / 2), Math.round(py - d / 2), d, d);
  }

  measure();
  let rt; on(window, 'resize', () => { clearTimeout(rt); rt = setTimeout(measure, 150); });
  raf = requestAnimationFrame(frame);

  /* #rrggbb + an alpha, as rgba(). The colour rows hand back a hex — a picker
     cannot give an alpha — and the ground needs one, so the two are combined
     here rather than asking for a second, differently-shaped dial. */
  function hexA(hex, a){
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
    if (!m) return `rgba(255,255,255,${a})`;
    const n = parseInt(m[1], 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }
  function paper(){
    host.style.background = CONFIG.groundAlpha <= 0.001
      ? 'transparent' : hexA(CONFIG.ground, CONFIG.groundAlpha);
  }
  paper();

  window.PATHMAP = {
    config: CONFIG,
    apply(){ builtFor = ''; paper(); },
    readout(){
      const G = window.PATHG;
      return { map: !CONFIG.enabled ? 'off'
                  : !G ? 'no track'
                  : `${CONFIG.samples} pts · at ${(((G.where() % 1) + 1) % 1).toFixed(3)}` };
    },
    rows(){
      const C = CONFIG, self = this;
      const num = (key, min, max, step, hint) => ({
        label: 'map.' + key, min, max, step,
        get: () => C[key], set: v => { C[key] = v; self.apply(); }, hint,
      });
      return [
        { label: 'map.enabled', options: ['on', 'off'],
          get: () => (C.enabled ? 'on' : 'off'),
          set: v => { C.enabled = v === 'on'; self.apply(); },
          hint: 'the ride seen from above · it is the REAL curve, asked of js/path-gallery.js rather than drawn here, so changing the track changes the map with it' },

        { label: 'map.ground', colour: true,
          get: () => C.ground, set: v => { C.ground = v; self.apply(); },
          hint: 'the panel’s paper · the home page’s map has none and does not need one, because nothing ever passes behind it. Here the photographs drift across the whole viewport, and an instrument you can see a photograph through is not an instrument' },
        num('groundAlpha', 0, 1, 0.05,
          'how opaque that paper is · 0 is the transparent box the home page uses. At 0.9 white it resolves to the red the Figma frame draws once the tint is over it, so it is the same panel with the tint on or off'),

        num('dim', 0, 1, 0.01,
          'what the rest of the track falls to · 0 draws only the lit stretch and the loop disappears behind you, 1 is a flat line that tells you nothing about where you are'),
        num('reach', 0.01, 0.5, 0.01,
          'how much of the lap around you stays lit, IN LAPS · 0.06 is a short pool of light travelling with you, 0.5 grades the whole loop from front to back. Measured along the PATH, not across the map, because two stretches can be inches apart on the picture and half a lap apart in the ride'),
        num('curve', 0.3, 6, 0.1,
          'the falloff between the two · 1 is a straight ramp, above 1 holds the brightness close to you and then drops it, which reads as a pool rather than a gradient'),

        num('tiltY', 0, 1.5, 0.05,
          'how much HEIGHT is folded into the plan · 0 is a true map, looking straight down, so a corkscrew crosses itself. Above 0 leans it into an oblique and the climb becomes visible'),
        num('spin', -180, 180, 1, 'which way round the plan sits · the curve has no north'),
        num('fit', 0.3, 1, 0.02, 'how much of the box the track fills'),
        num('samples', 60, 900, 20,
          'points the curve is sampled at · this is the map’s resolution AND the number of separate strokes, since every segment carries its own alpha'),

        { label: 'map.line', options: ['solid', 'dashed', 'dots', 'ticks'],
          get: () => C.line, set: v => { C.line = v; self.apply(); },
          hint: 'what the mark IS · SOLID is a continuous line · DASHED and DOTS break it on the two dials below, in samples rather than pixels so the rhythm does not breathe as the track’s curvature changes · TICKS draws short strokes ACROSS the path instead of along it, the way a route is marked on a survey map — at a wide gap the path becomes a trail of marks lying across the direction of travel' },
        num('dash', 1, 40, 1, 'samples drawn · ignored by SOLID'),
        num('gap', 0, 40, 1, '…and samples skipped between them'),
        num('tick', 1, 30, 1, 'TICKS only · how far each stroke reaches across the path'),

        num('width', 0.2, 8, 0.1, 'the line’s weight at the FAR end of the loop'),
        num('widthAt', 0.2, 14, 0.1,
          '…and at your own position · thick where you are and thin at the ends, which is what the weight is for. It peaks on the same curve the brightness does, so the head of the line is one thing rather than two a few samples apart'),
        num('taper', 0, 1, 0.05,
          'how much of the difference between those two is actually used · 0 is one weight all the way round without having to make the two equal, 1 is the full swell'),
        { label: 'map.colour', colour: true,
          get: () => C.colour, set: v => { C.colour = v; self.apply(); },
          hint: 'the track’s colour' },
        num('dot', 1, 12, 1, 'the square at your position'),
        num('halo', 0, 16, 0.5,
          'a clearing painted behind it first · the track at your own position is at full strength and the same colour as the marker sitting on it, so without this the one thing you are meant to find has nothing separating it from the line'),
        num('heading', 0, 24, 1,
          '…and a spur showing which way you are travelling · 0 is off'),
        { label: 'map.dotColour', colour: true,
          get: () => C.dotColour, set: v => { C.dotColour = v; self.apply(); },
          hint: 'the marker’s colour · DARK rather than the red the home page’s cursor uses, because this page ships a red multiply over everything and under a multiply nothing lighter than the backdrop survives — a red marker on red paper is gone, not dim' },
        { label: 'map.haloColour', colour: true,
          get: () => C.haloColour, set: v => { C.haloColour = v; self.apply(); },
          hint: 'the clearing’s colour · white by default, which under a multiply tint resolves to the tint itself, so it reads as the paper on either setting' },
      ];
    },
  };

  return function destroy(){
    alive = false;
    cancelAnimationFrame(raf);
    clearTimeout(rt);
    on.release();
    if (window.PATHMAP && window.PATHMAP.config === CONFIG) delete window.PATHMAP;
  };
});
