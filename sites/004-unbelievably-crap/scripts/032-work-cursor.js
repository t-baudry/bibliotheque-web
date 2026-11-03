/* ==========================================================================
   work-cursor.js — the torn blobs that follow the pointer on the work page.

   SAME TEAR, DIFFERENT DISTANCE
   This is the mask page's transition with one thing swapped. There the signed
   distance is a horizontal sweep and the noise added to it before the
   threshold tears the sweep's edge into shards; here the distance is to a
   trail of circles chasing the pointer, and the same noise tears those. The
   numbers that decide how the edge looks come from js/dissolve-look.js, which
   both modules read — tune the transition and this follows.

   Two things had to be scaled rather than inherited. The sweep spans a whole
   viewport, so a displacement of 0.095 screen heights is a fraction of its
   travel; a blob is about 0.15 screen heights across, so the same number would
   shred it completely. `tear` is that multiplier. And the sweep's noise scale
   is tuned against a viewport-wide edge, so `tearScale` starts from the shared
   value and is free to move.

   WHAT IS BEHIND THE BLOBS
   The reference plays a video under its shapes. This does not: it inverts the
   page. And it does it without capturing anything, because there is nothing to
   capture — the canvas paints the blobs WHITE and wears
   `mix-blend-mode: difference`, and difference against white IS inversion, per
   pixel, of whatever the browser has already drawn underneath. The wheel, the
   cards, the title and the gradient all invert together and stay in register,
   for free, because the compositor is doing it rather than a shader that would
   first need a copy of the frame.

   That also gives the strength dial for nothing: difference against a grey of
   level g returns |backdrop - g|, so painting the blob darker walks the effect
   back toward the untouched page. `amount` is that level.

   The whole thing sits inside .stage, which is deliberate. A blend mode
   composites against its own stacking context's backdrop, and .stage is what
   paints the page's gradient — hang this on <body> instead and it would blend
   against nothing over any area the page had not painted, which reads as the
   blobs turning solid white in the margins.
   ========================================================================== */
window.PAGE.register('work-cursor', function (scope) {
  'use strict';

  /* The work page only. .stage exists elsewhere, so the page name is the
     guard — the same lesson as the dissolve quietly mounting on About because
     it keyed off an element two pages happened to share. */
  /* TWO PAGES NOW, and each names its own host rather than sharing a selector.
     `.stage` exists on pages that want nothing to do with this, which is why
     the page name was the guard in the first place — the same lesson as the
     dissolve quietly mounting on About because it keyed off an element two
     pages happened to share. Adding a page means adding a row here, not
     loosening the selector.

     The host matters as much as the guard: a blend mode composites against its
     own stacking context's backdrop, so the canvas has to live inside the
     element that PAINTS the ground it is meant to sit on. On the work page that
     is .stage and its gradient; on the mask page it is .about, which carries
     block 02's white. Hung on <body> it would blend against nothing wherever
     the page had not painted. */
  /* .pathg is the gallery page's root now — the corridor it used to name is
     gone. A blend composites against its own stacking context's backdrop, so the
     host has to be whatever paints the ground: .stage's gradient, .about's
     white, and here the gallery's paper. */
  /* BEHIND THE PHONE DOOR THE HOST IS THE DOOR. css/gate.css hides the page's
     container outright, so the usual hosts have no size and this canvas would
     draw into nothing. The door wants exactly this field as its background —
     the same blob as every other page rather than a picture of one — so it is
     found on the DOCUMENT, not in the container, because the door deliberately
     lives outside it and survives every navigation. */
  const GATED = document.documentElement.classList.contains('is-gated');
  const HOST = GATED ? '.gate__bg'
                     : { design: '.wgrid', mask: '.about', gallery: '.pathg',
                         err: '.about' }[scope.dataset.page];
  if (!HOST) return;
  const stage = GATED ? document.querySelector(HOST) : scope.querySelector(HOST);
  if (!stage) return;
  /* THE 404 IS THE SAME ROOM. It runs block 01's stage — see .about.err in
     404.html — so every deviation keyed on this flag is keyed on it too, and
     the blobs there are the blobs here rather than a second set that drifted. */
  const ONMASK = scope.dataset.page === 'mask' || scope.dataset.page === 'err';

  const MAX_PTS = 24;          // matches the shader's array; see uPts

  const CONFIG = {
    enabled: true,

    // ---- the blob at the pointer ----
    size: 0.075,        // its radius, in screen heights
    lag: 0.05,         // how far behind the pointer it runs · 0 sticks to it
    merge: 0.0,        // how much overlapping shapes melt together

    /* ---- THE SHAPE UNDERNEATH ----
       The tear roughens an outline; it does not change what the outline IS.
       Under it the mark was a circle, and a circle is the one silhouette the
       eye names instantly however ragged you make its rim — which is why the
       cursor still read as a disc with a fringe. These four bend the shape
       itself, before any tearing happens.

       `wobble` is the one that does the work: a couple of sine harmonics on
       the angle, so the radius is different in every direction and the mark is
       a lump rather than a ball. `vary` gives each mark its own phase, so a
       trace is a line of different lumps instead of one stamp repeated. */
    wobble: 0.10,      // how far the outline departs from a circle
    lobes: 2.4,        // how many bumps around it
    shape: 0.85,       // 0 round · 1 square · one superellipse, not a switch
    stretch: 0.05,     // how far a mark is drawn out along the way it was going
    squash: 0.0,       // flatter or taller, on a fixed axis rather than travel

    /* ---- POLYGONS ----
       The superellipse above only ever walks from a circle to a square; it has
       no way to be a triangle. This is the other family: the polar radius of a
       regular n-gon, mixed in on top of it, so the two compose rather than
       competing. `sides` says how many, `sideMix` how far toward it, `corner`
       rounds it back off and `star` pulls the edge midpoints in — which turns
       the same n into an n-pointed star without another dial for the points. */
    sides: 5.0,
    sideMix: 0.0,      // 0 keeps the superellipse · 1 is the polygon
    corner: 0.0,       // rounds the polygon's corners back toward a circle
    star: 0.0,         // pulls the edges in · 5 sides and this is a five-point star
    rotate: 0.0,       // a fixed turn, in degrees, on top of the travel angle
    spin: 0.0,         // ...and degrees per second, so marks turn as they age

    /* ---- HOW DIFFERENT EACH ONE IS ----
       Every mark carries one random number. These decide what it is allowed to
       change, and they are separate because "all the same size but each turned
       differently" and "all the same but some are triangles" are two different
       pictures. Every one of them is derived from that single seed by hashing
       it against a different constant, so a mark's look is fixed the moment it
       is laid down and none of these costs another uniform. */
    vary: 1.0,         // the wobble's phase · the original one
    varySize: 0.0,     // spread in size, as a share of it
    varyAngle: 0.0,    // spread in rotation, in degrees
    varyShape: 0.0,    // spread in round-to-square and in how polygonal it is
    varyLobes: 0.0,    // spread in the number of bumps
    fade: 0.22,        // seconds to appear and disappear when the pointer
                       // enters or leaves the page

    /* ---- TRACE ----
       What the pointer LEAVES BEHIND. The first version had a tail instead: a
       fixed number of ghosts at the head's recent positions, recomputed every
       frame. That moves with the cursor and vanishes the moment it stops,
       because the ghosts are only ever the last quarter-second of travel.

       A trace is the other thing entirely. A mark is laid down at a place, and
       then it stays at that place and ages out on its own clock — so the shape
       you drew is still on the screen after the pointer has gone somewhere
       else, and stopping leaves the drawing rather than erasing it. */
    traceOn: true,
    traceMarks: 23,    // how many marks can be alive at once
    traceLife: 0.4,    // seconds each one lasts
    traceStep: 0.28,   // how far the pointer moves before laying the next,
                       // in blob radii · this is what makes it a PATH
    traceEvery: 30,    // ms floor, so one fast flick cannot spend them all
    traceShrink: 0.55, // what fraction of its size a mark has left at the end
    traceFade: 0.0,    // ...and how solid it still is · 0 fades out entirely
    traceEase: 2.2,    // >1 holds a mark near full and then lets go quickly
    traceSize: 0.6,    // a mark's size against the cursor's own blob

    /* ---- the tear ----
       Started from js/dissolve-look.js and then scaled, for the reason in the
       header: the shared numbers describe an edge that crosses a viewport. */
    tear: 0.70,        // multiplies the shared displacement · 0 is clean circles
    tearScale: 3.4,    // size of the torn pieces · high is confetti
    drift: 0.35,       // how fast the tear pattern crawls
    soft: 0.004,       // edge hardness · small is a crisp cut

    /* ---- ASCII ----
       The reference does this to a VIDEO, and that is the whole difference:
       a video can be uploaded to the GPU as a texture, so its shader knows the
       brightness of every pixel underneath and can pick a character for it.
       This page is a wheel of CSS-3D cards, live type and a gradient. A
       fragment shader has no copy of that and cannot get one — see the note on
       the SVG filter, which is the only thing that can touch live DOM, and it
       bends pixels rather than reading them.

       So the characters are driven by the thing this module DOES know: its own
       field. A cell near the middle of a mark is dense, a cell at its torn edge
       is sparse, and the ramp runs between them. And because the layer still
       blends — `invert` by default — every character is cut out of the real
       page, so the page's own light and dark show through between the glyphs.
       It reads as the page rendered in characters. It is not that, and the one
       place you can tell is that a character does not get denser over a bright
       card; it gets denser toward the middle of the blob. */
    ascii: true,
    cell: 4,          // character size, in device pixels
    chars: ' .:-=+*#%@',
    ramp: 4.0,         // contrast of the density mapping · >1 pushes to extremes
    rampFlip: false,   // dense where the field is thin instead of thick
    jitter: 0.0,      // per-cell noise on the density, so the ramp shimmers
    weight: 600,       // the font's weight in the atlas
    ink: '#1A1A1A',    // the characters' colour

    /* ---- THE GROUND ----
       The characters cover the whole stage now and sit UNDER the page, so what
       decides their density is no longer the cursor. It is this: a base level,
       a vertical tilt that can follow the page's own gradient, and drifting
       noise so the field is alive rather than a flat screen. */
    bgLevel: 0.67,     // how dense it is before anything else touches it
    bgTilt: 0.23,      // more at the bottom, less at the top · negative flips it
    bgNoise: 0.21,     // how much the drifting noise moves it
    bgNoiseScale: 3.4,
    bgDrift: 1.0,     // how fast that noise crawls
    bgRadial: 0.06,    // denser toward the middle of the screen · negative for
                       // a clear centre and a dense frame

    /* ---- THE CURSOR CLEARS ----
       The blobs used to BE the effect. Now they are a hole in it: where the
       cursor and its trace have been, the density is taken away and the cells
       fall to the blank character, so the page's own clean ground shows
       through. `paint` then lays the blob itself over that hole as a solid
       colour — 0 leaves it as an erase and nothing more. */
    clear: 1.0,        // how completely the cursor wipes the characters out
    paint: 0.0,       // ...and how solidly it paints itself over the gap
    paintTint: '#FFFFFF',

    // ---- how the layer meets the page ----
    mode: 'knockout',     // plain · invert · exclusion · knockout
    amount: 1.0,
    grain: 0.34,       // per-pixel dither
    /* 1, AND IT HAS TO STAY 1. This was briefly 0.75 to save fill — the
       backing store is drawn at this multiple of the device pixel ratio, so
       0.75 is 1.78x fewer pixels — and it cost the effect its midtones.

       THE REASON IS WHAT THIS EFFECT IS. It is a DITHER: it has two ink
       levels and buys every apparent grey between them by trading spatial
       resolution for tonal resolution, spreading dots so the eye averages
       them. Take pixels away and there is less room to spread, so the greys
       collapse — four or five tones became two or three. Sharpness was never
       what was being spent; tone was.

       So renderScale is the wrong lever on a dithered effect, and the frame
       time has to come from somewhere that is not pixels. */
    renderScale: 1,
  };

  /* The shared look is the STARTING point, not an override: anything the panel
     has already moved here stays moved. Only the two keys this module does not
     own outright are taken raw. */
  const LOOK = window.DISSOLVE_LOOK || {};
  /* `tear` still scales the shared displacement, so tuning the transition's
     dispAmp moves these shapes with it. NOTHING ELSE is derived any more.

     tearScale went first: the torn pieces here want to be a few big peninsulas
     rather than the fine shrapnel that reads well on a viewport-wide sweep.
     `grain` has now gone the same way, and it was the same bug — a settings
     export was baked into the file, the page was reloaded, and the value came
     back 0.119 instead of 0.34, because this line ran at mount and quietly
     overwrote it with the transition's number times a constant. A derived
     default is fine right up until the thing it derives becomes a dial someone
     has set; after that it is a value that will not stay where you put it. */

  const VERT = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAG = `
    precision highp float;
    varying vec2 vUv;
    /* xy where the mark is, z its radius (0 = unused slot), w how much life
       it has left. Four components rather than three because a trace needs
       marks to fade as well as shrink, and a union of distances has no room
       for a per-mark opacity — see the weight below. */
    uniform vec4  uPts[${MAX_PTS}];
    /* x the direction the mark was travelling, y its own random phase. A
       second array rather than more components on the first, because these two
       are about the mark's SHAPE and those four are about where and when it
       is — and a vec4 was already full. */
    uniform vec2  uExt[${MAX_PTS}];
    uniform float uAspect, uTime, uMerge, uTear, uTearScale, uDrift, uSoft;
    uniform float uWobble, uLobes, uShape, uStretch, uSquash;
    uniform float uSides, uSideMix, uCorner, uStar, uRotate, uSpin;
    uniform float uVarySize, uVaryAngle, uVaryShape, uVaryLobes;
    uniform float uGrain, uAlpha;
    uniform sampler2D uAtlas, uCells;
    uniform vec2  uRes, uCellGrid;
    uniform float uCell, uGlyphs, uRamp, uRampFlip, uJitter;
    uniform float uBgLevel, uBgTilt, uBgNoise, uBgNoiseScale, uBgDrift, uBgRadial;
    uniform float uClear, uPaint;
    uniform vec3  uInk, uPaintTint;
    uniform int   uDetail;

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float vnoise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
                 mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
    }
    float fbm(vec2 p, int oct){
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 6; i++){
        if (i >= oct) break;
        v += a * vnoise(p); p *= 2.03; a *= 0.5;
      }
      return v;
    }

    /* Smooth maximum. The field is positive inside a blob, so a union is a
       max — and a smooth one is what makes two blobs melt into a peanut
       instead of overlapping like two stickers. */
    float smax(float a, float b, float k){
      if (k <= 0.0001) return max(a, b);
      float h = clamp(0.5 + 0.5 * (a - b) / k, 0.0, 1.0);
      return mix(b, a, h) + k * h * (1.0 - h);
    }

    /* HOW FAR INSIDE THE MARK THIS PIXEL IS — positive inside.

       Everything that makes it not a circle happens here, in the mark's own
       frame: rotated so x runs along the way it was going, stretched on that
       axis, measured with a p-norm instead of a length, and finally given a
       radius that varies with direction. Deforming the DISTANCE rather than
       the result is what keeps the union, the smooth merge and the tear all
       working on it unchanged — they never learn it stopped being round. */
    /* THE POLAR RADIUS OF A REGULAR N-GON, circumradius 1: the apothem over
       the cosine of the angle to the nearest edge normal. 1 at the corners and
       cos(pi/n) at the edge midpoints, so the polygon is inscribed in the unit
       circle and rad keeps meaning what it meant. */
    float ngonR(float a, float n, float corner, float star){
      float seg = 6.2831853 / max(n, 3.0);
      float k = mod(a + seg * 0.5, seg) - seg * 0.5;
      float r = cos(seg * 0.5) / max(cos(k), 1e-3);
      r = mix(r, 1.0, clamp(corner, 0.0, 1.0));
      // one cosine at the polygon's own frequency, so N sides give N points
      if (star > 0.001) r *= 1.0 - star * 0.5 * (1.0 + cos(a * max(n, 3.0)));
      return r;
    }

    float markField(vec2 d, float rad, vec2 ext){
      /* CHEAP REJECT FIRST. Every mark is tested against every pixel, and the
         shaping below costs an atan, two sines and three pows. Most marks are
         nowhere near most pixels, so a squared-distance test against a
         generous bound — room for the stretch, the wobble and the tear —
         skips nearly all of that work and changes nothing that is drawn. */
      float bound = rad * (2.6 + uStretch);
      if (dot(d, d) > bound * bound) return -1.0;

      /* THE FIVE RANDOMS, all from the one seed. Hashing it against different
         constants gives numbers that do not move together — the same seed
         reused raw would tie a mark's size to its rotation, and every mark
         would then be big-and-turned or small-and-straight and never anything
         else, which reads as one shape at two settings rather than as variety. */
      float sd = ext.y;
      float h1 = hash(vec2(sd, 11.3)) - 0.5;   // size
      float h2 = hash(vec2(sd, 27.7)) - 0.5;   // rotation
      float h3 = hash(vec2(sd, 41.1)) - 0.5;   // shape
      float h4 = hash(vec2(sd, 59.9)) - 0.5;   // lobes

      float ang = ext.x + (uRotate + uSpin * uTime + h2 * uVaryAngle) * 0.017453293;
      float cs = cos(ang), sn = sin(ang);
      vec2 e = vec2(d.x * cs + d.y * sn, -d.x * sn + d.y * cs);

      if (uStretch > 0.0001) e.x /= (1.0 + uStretch);
      if (abs(uSquash) > 0.0001) e.y *= (1.0 + uSquash);

      rad *= 1.0 + h1 * uVarySize;

      float shp = clamp(uShape + h3 * uVaryShape, 0.0, 1.0);
      float mixv = clamp(uSideMix + h3 * uVaryShape, 0.0, 1.0);

      float dist;
      if (shp > 0.001){
        /* Superellipse. The exponent IS the shape: 2 is a circle and it walks
           toward a square from there, so one dial covers the whole family
           rather than a switch between two of them. */
        float n = 2.0 + shp * 6.0;
        vec2 a = max(abs(e), 1e-4);
        dist = pow(pow(a.x, n) + pow(a.y, n), 1.0 / n);
      } else {
        dist = length(e);
      }

      /* The polygon scales the RADIUS rather than replacing the distance, so
         it composes with the superellipse and with the wobble instead of one
         of the three winning outright. */
      if (mixv > 0.001){
        float rp = ngonR(atan(e.y, e.x), uSides, uCorner, uStar);
        rad *= mix(1.0, rp, mixv);
      }

      if (uWobble > 0.0001){
        /* Two harmonics, not noise. A radius that varies with the angle has to
           come back to itself after a full turn or the mark has a seam down
           one side; sines are periodic by construction, and two of them at
           unrelated frequencies are already irregular enough to stop reading
           as a flower. Cheap matters here — this runs once per mark per
           pixel. */
        float th = atan(e.y, e.x);
        float ph = ext.y * 6.2831853;
        float lb = max(0.5, uLobes * (1.0 + h4 * uVaryLobes));
        float w = sin(th * lb + ph) * 0.62
                + sin(th * (lb * 1.73 + 1.0) - ph * 1.7) * 0.38;
        rad *= 1.0 + w * uWobble;
      }
      return rad - dist;
    }

    /* THE FIELD AT A POINT — pulled out of main() because the ASCII pass needs
       it at the CENTRE of a character cell rather than at the pixel. A whole
       cell has to agree on which character it is, and asking each of its
       pixels separately is how you get a grid of glyph fragments instead of a
       grid of glyphs. */
    void fieldAt(vec2 q, out float field, out float weight){
      /* The shape is a union of the marks; the OPACITY is the strongest mark
         reaching this pixel. Two quantities because they answer different
         questions — where the ink is, and how old the ink is — and a single
         smooth union would have averaged a fresh mark with a dying one and
         made both wrong. */
      field = -1.0;
      weight = 0.0;
      for (int i = 0; i < ${MAX_PTS}; i++){
        if (uPts[i].z <= 0.0) continue;
        vec2 c = vec2(uPts[i].x * uAspect, uPts[i].y);
        float fi = markField(q - c, uPts[i].z, uExt[i]);
        field = smax(field, fi, uMerge);
        // within the tear's reach counts as reaching: a shard thrown off this
        // mark by the noise still belongs to it and should carry its age
        if (fi > -uTear - uSoft) weight = max(weight, uPts[i].w);
      }

      /* THE TEAR. Added to the distance BEFORE the threshold — that is the
         whole trick, and the reason shards detach instead of the outline
         merely wobbling: a patch of noise can carry a piece of the field
         across zero on its own, away from the blob it came from. */
      if (uTear > 0.0001){
        float n = fbm(q * uTearScale + vec2(0.0, uTime * uDrift), uDetail) - 0.5;
        field += n * uTear * 2.0;
      }
    }

    /* THE GROUND'S OWN DENSITY. Nothing to do with the cursor: a base level, a
       vertical tilt so the field can follow the page's gradient instead of
       fighting it, drifting noise so it is alive, and a radial term for a
       field that thickens toward the middle or clears out of it. */
    float groundAt(vec2 q, vec2 uv){
      float d = uBgLevel + uBgTilt * (0.5 - uv.y) * 2.0;
      if (uBgNoise > 0.0001){
        float n = fbm(q * uBgNoiseScale +
                      vec2(uTime * uBgDrift, uTime * uBgDrift * 0.61), uDetail);
        d += (n - 0.5) * uBgNoise * 2.0;
      }
      if (abs(uBgRadial) > 0.0001){
        vec2 c = uv - 0.5;
        d += uBgRadial * (0.5 - length(vec2(c.x * uAspect, c.y)));
      }
      return clamp(d, 0.0, 1.0);
    }

    void main(){
      /* Circles have to be measured in a square space or they come out as
         ellipses on a wide window. Everything below is in screen HEIGHTS. */

    #ifdef FX_ASCII
      /* ---- CHARACTERS ------------------------------------------------------
         One character per cell, and the cell is measured in DEVICE pixels so a
         glyph is a glyph on any screen rather than getting fatter with the
         window.

         EVERYTHING is decided at the cell's CENTRE — the ground's density and
         the cursor's hole both — so a cell is one character that is either
         there or not. Sampling either per pixel lets a cell straddle two
         glyphs, or clears half of one, and what you get is a grid of glyph
         fragments rather than a grid of glyphs.

         WHICH IS WHY IT IS TWO PASSES NOW. Deciding at the cell centre from
         inside a full-resolution pass means every pixel of a cell computes the
         SAME answer and throws it away: at a 4px cell on a retina screen that
         is sixty-four evaluations of a twenty-four-mark field for one
         character. The first pass writes one texel per cell — dens in red,
         hole in green — and the second just reads it. Same picture, a
         sixty-fourth of the field work. */
    #ifdef PASS_CELLS
      /* One texel per cell, so gl_FragCoord IS the cell index. */
      vec2 cell = floor(gl_FragCoord.xy);
      vec2 centre = (cell + 0.5) * max(uCell, 3.0);
      vec2 cuv = centre / uRes;
      vec2 cq = vec2(cuv.x * uAspect, cuv.y);

      /* THE CURSOR IS A HOLE NOW. Same field, same trace, same tear — read the
         other way round: where it is strong the characters go away. */
      float cField, cWeight;
      fieldAt(cq, cField, cWeight);
      float hole = smoothstep(-uSoft, uSoft, cField) * cWeight * uAlpha;

      float jn = (hash(cell + floor(uTime * 8.0) * 0.017) - 0.5) * uJitter;
      float dens = clamp(groundAt(cq, cuv) + jn, 0.0, 1.0);
      dens = clamp(pow(dens, max(uRamp, 0.05)), 0.0, 1.0);
      if (uRampFlip > 0.5) dens = 1.0 - dens;
      /* The erase runs through the RAMP rather than through the alpha: a
         cleared cell falls to the first character, which is the blank one, so
         it does not fade out as a ghost — it stops being a character. */
      dens *= clamp(1.0 - hole * uClear, 0.0, 1.0);

      gl_FragColor = vec4(dens, hole, 0.0, 1.0);
      return;
    #else
      vec2 cellPx = vec2(max(uCell, 3.0));
      vec2 cell = floor(gl_FragCoord.xy / cellPx);
      /* NEAREST, and sampled at the texel centre: this is a lookup table, not
         an image, and a filtered read would blend two cells' characters into
         one and undo the whole point of deciding per cell. */
      vec4 cf = texture2D(uCells, (cell + 0.5) / uCellGrid);
      float dens = cf.r, hole = cf.g;

      float gi = floor(dens * (uGlyphs - 1.0) + 0.5);
      vec2 local = (gl_FragCoord.xy - cell * cellPx) / cellPx;
      vec2 auv = vec2((gi + local.x) / uGlyphs, 1.0 - local.y);
      float ink = texture2D(uAtlas, auv).a;

      vec4 col = vec4(uInk, ink);

      /* ...and then the blob itself, laid over the hole it just made. At paint
         0 this is only an erase; at 1 the cursor is a solid shape. */
      float wash = hole * uPaint;
      if (wash > 0.001) col = mix(col, vec4(uPaintTint, 1.0), wash);

      if (uGrain > 0.0001){
        vec2 sp = gl_FragCoord.xy + uTime * 60.0;
        vec3 gn = vec3(hash(sp), hash(sp + 17.3), hash(sp + 41.7)) - 0.5;
        col.rgb = clamp(col.rgb + gn * uGrain, 0.0, 1.0);
      }
      if (col.a <= 0.003){ gl_FragColor = vec4(0.0); return; }
      gl_FragColor = col;
    #endif

    #else
      /* ---- NO CHARACTERS: the blob on its own, as it was ------------------- */
      vec2 q = vec2(vUv.x * uAspect, vUv.y);
      float field, weight;
      fieldAt(q, field, weight);
      float a = smoothstep(-uSoft, uSoft, field) * weight * uAlpha;
      if (a <= 0.002){ gl_FragColor = vec4(0.0); return; }

      vec3 rgb = uPaintTint;
      if (uGrain > 0.0001){
        vec2 sp = gl_FragCoord.xy + uTime * 60.0;
        vec3 gn = vec3(hash(sp), hash(sp + 17.3), hash(sp + 41.7)) - 0.5;
        rgb = clamp(rgb + gn * uGrain, 0.0, 1.0);
      }
      gl_FragColor = vec4(rgb, a);
    #endif
    }`;

  /* ---- the glyph atlas -----------------------------------------------------
     The characters are drawn once, into a strip one cell per glyph, and
     uploaded as a texture. Drawn rather than shipped as an image because the
     character SET is a control: change it and the atlas is rebuilt, which a
     baked sprite sheet could not do.

     Alpha only — the shader wants coverage, and the colour comes from the tint
     and the blend mode the same way it does for a solid mark. */
  const GLYPH_PX = 64;
  let atlas = null, atlasTex = null, atlasKey = '', glyphs = 1;

  function buildAtlas(){
    const C = CONFIG;
    const chars = String(C.chars || ' .:-=+*#%@');
    const key = chars + '|' + C.weight;
    if (key === atlasKey && atlasTex) return;
    atlasKey = key;
    glyphs = Math.max(1, chars.length);

    const c = document.createElement('canvas');
    c.width = GLYPH_PX * glyphs; c.height = GLYPH_PX;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    /* 0.78 of the cell, not the whole of it: a monospace glyph's advance is
       narrower than its em, so a font-size equal to the cell overflows
       sideways into its neighbours and the grid smears. */
    ctx.font = `${Math.round(C.weight)} ${Math.round(GLYPH_PX * 0.78)}px ` +
               'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
    for (let i = 0; i < glyphs; i++){
      ctx.fillText(chars[i], (i + 0.5) * GLYPH_PX, GLYPH_PX * 0.54);
    }
    atlas = c;
    if (gl){
      if (!atlasTex) atlasTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, atlasTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
  }

  let canvas = null, gl = null, failed = false;
  let progDraw = null, UDraw = null, progCells = null, UCells = null, progKey = '';
  /* The cell buffer: one texel per character, dens in red and hole in green. */
  let cellFbo = null, cellTex = null, cellW = 0, cellH = 0;
  let raf = 0, alive = true, t0 = performance.now(), last = t0;
  let guard = null;

  /* Pointer state. `head` chases the pointer, and the trace is laid down at
     the HEAD's positions rather than the pointer's — which is what keeps the
     path smooth when the mouse jumps, and what makes the marks land on the
     line the blob actually travelled. */
  let px = 0.5, py = 0.5, hx = 0.5, hy = 0.5, seen = false;
  let alpha = 0, wanted = 0, lastMark = 0;
  /* A frame counter on the panel, because "it feels laggy" and "it is running
     at eleven frames a second" are different reports and only one of them can
     be acted on. Sampled over a second so the number is readable rather than
     flickering. */
  let fps = 0, fpsN = 0, fpsAt = 0;
  const trace = [];   // { x, y, t, a, s } newest first · a is the direction it
                      // was going, s its own phase
  let headAng = 0;

  function hex3(h){
    const m = /^#?([0-9a-f]{6})$/i.exec(String(h || '#ffffff'));
    if (!m) return [1, 1, 1];
    const n = parseInt(m[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  function compile(type, src){
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(s));
    return s;
  }

  const BLEND = { invert: 'difference', exclusion: 'exclusion',
                  knockout: 'normal', plain: 'normal' };

  function init(){
    if (canvas || failed) return !failed;
    try {
      canvas = document.createElement('canvas');
      canvas.className = 'work-blobs';
      canvas.setAttribute('aria-hidden', 'true');
      /* preserveDrawingBuffer, and ONLY on the mask page, where this canvas is
         not just shown — it is READ, as a texture, by js/mask-scroll.js for the
         second block's ground.

         Without it the browser is free to discard the colour buffer the moment
         the frame is composited, and texImage2D from this canvas then uploads
         an EMPTY image. It costs a copy per frame, which is why the work page
         does not pay it: there, nothing samples this canvas.

         The same flag is why #maskBody works as a texture source — its figure
         is constructed with PRESERVE true for exactly this reason. It is a
         cheap thing to forget and it fails silently: no error, no warning, just
         a second block with no ground on it. */
      gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false,
                                        antialias: false,
                                        preserveDrawingBuffer: ONMASK });
      if (!gl) throw new Error('no WebGL context');

      /* The browser can take this context back at any time — see PAGE.glGuard.
         Registered BEFORE anything is built, because the loss can arrive during
         the build as easily as an hour later. */
      guard = window.PAGE.glGuard(canvas, () => { buildGL(); resize(); });

      buildGL();
      stage.appendChild(canvas);
      resize();
      return true;
    } catch (e){
      failed = true;
      console.warn('[work-cursor] unavailable:', e.message);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvas = null; gl = null;
      return false;
    }
  }

  /* EVERY GPU RESOURCE THIS MODULE OWNS, in one function, so that building it
     the first time and rebuilding it after a restored context are the same code
     path rather than two that drift apart.

     The caches are cleared FIRST and that is the whole trick. buildProgram and
     buildAtlas both early-return when their key is unchanged and their handle
     is non-null — which is right on a resize and catastrophic here, because
     after a context loss those handles are still non-null and no longer refer
     to anything. Left in place they make both builders decide there is nothing
     to do, and the module carries on drawing with dead programs into a canvas
     that stays blank. Dropping the handles is what turns "nothing to do" back
     into "build it". */
  function buildGL(){
    progDraw = progCells = null; progKey = '';
    atlasTex = null; atlasKey = '';
    cellTex = null; cellFbo = null; cellW = cellH = 0;

    buildProgram();

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    buildAtlas();
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  /* One program per feature set, the same pattern as the dissolve: the ASCII
     pass is a texture fetch and a second evaluation of the whole field, and a
     uniform set to zero would still pay for both. */
  function link(defs){
    const pre = defs.map(d => '#define ' + d + '\n').join('');
    const pr = gl.createProgram();
    gl.attachShader(pr, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(pr, compile(gl.FRAGMENT_SHADER, pre + FRAG));
    gl.bindAttribLocation(pr, 0, 'aPos');
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(pr));
    return pr;
  }

  function buildProgram(){
    const key = CONFIG.ascii ? 'ascii' : 'solid';
    if (key === progKey && progDraw) return;
    progKey = key;
    progDraw  = link(CONFIG.ascii ? ['FX_ASCII'] : []);
    progCells = CONFIG.ascii ? link(['FX_ASCII', 'PASS_CELLS']) : null;
    UDraw  = uniformsOf(progDraw);
    UCells = progCells ? uniformsOf(progCells) : null;
  }

  function uniformsOf(prog){
    const u = n => gl.getUniformLocation(prog, n);
    return { pts:u('uPts[0]'), ext:u('uExt[0]'),
          wobble:u('uWobble'), lobes:u('uLobes'), shape:u('uShape'),
          stretch:u('uStretch'), squash:u('uSquash'),
          sides:u('uSides'), sideMix:u('uSideMix'), corner:u('uCorner'),
          star:u('uStar'), rotate:u('uRotate'), spin:u('uSpin'),
          varySize:u('uVarySize'), varyAngle:u('uVaryAngle'),
          varyShape:u('uVaryShape'), varyLobes:u('uVaryLobes'),
          aspect:u('uAspect'), time:u('uTime'), merge:u('uMerge'),
          tear:u('uTear'), tearScale:u('uTearScale'), drift:u('uDrift'),
          soft:u('uSoft'), grain:u('uGrain'), alpha:u('uAlpha'),
          detail:u('uDetail'),
          atlas:u('uAtlas'), res:u('uRes'), cell:u('uCell'), glyphs:u('uGlyphs'),
          ramp:u('uRamp'), rampFlip:u('uRampFlip'), jitter:u('uJitter'),
          ink:u('uInk'), paintTint:u('uPaintTint'),
          bgLevel:u('uBgLevel'), bgTilt:u('uBgTilt'), bgNoise:u('uBgNoise'),
          bgNoiseScale:u('uBgNoiseScale'), bgDrift:u('uBgDrift'),
          bgRadial:u('uBgRadial'), clear:u('uClear'), paint:u('uPaint'),
          cells:u('uCells'), cellGrid:u('uCellGrid') };
  }

  /* The cell buffer is sized from the canvas and the cell, so it is rebuilt
     when either moves — which is a resize or a turn of the cell dial, not a
     frame. NEAREST and CLAMP: it is a lookup table, and filtering it would
     blend one cell's character into the next. */
  function ensureCells(cellPx){
    const w = Math.max(1, Math.ceil(canvas.width / cellPx));
    const h = Math.max(1, Math.ceil(canvas.height / cellPx));
    if (cellTex && w === cellW && h === cellH) return;
    cellW = w; cellH = h;
    if (!cellTex) cellTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, cellTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (!cellFbo) cellFbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, cellFbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                            gl.TEXTURE_2D, cellTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  /* THE STAGE'S SIZE, CACHED.
     clientWidth and getBoundingClientRect are not reads, they are questions the
     browser can only answer by finishing layout — so asking one inside the
     frame loop forces a synchronous layout of the whole page, every frame,
     behind ninety-three cards and whatever the tuner just wrote. That is a
     main-thread cost, not a GPU one, which is why it showed up as the PANEL
     lagging rather than the picture: dragging a slider writes a style, the next
     frame asks for a measurement, and the two take turns invalidating each
     other.

     ...THAT WAS THE THEORY, AND IT DID NOT SURVIVE MEASUREMENT. Counting
     Chrome's own LayoutCount over forty pointer moves and three seconds of
     frames gives 21 with the reads in the loop and 18 with them cached —
     noise. A layout read is only expensive when the layout is DIRTY, and this
     loop dirties nothing but a transform and a canvas, neither of which
     invalidates layout. The cache stays because it is the right shape and
     costs nothing, but it is not why anything was slow. The two things that
     measured are the cell pass and the card radius. */
  let sw = 0, sh = 0;
  function measureStage(){
    sw = stage.clientWidth || 1;
    sh = stage.clientHeight || 1;
  }
  measureStage();

  function resize(){
    if (!gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2) *
                Math.max(0.25, Math.min(1, CONFIG.renderScale));
    const w = Math.max(2, Math.round(sw * dpr));
    const h = Math.max(2, Math.round(sh * dpr));
    if (canvas.width !== w || canvas.height !== h){ canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
  }

  /* ---- the mask page's own values ----------------------------------------
     Page-scoped for the same reason js/mask.js's are: these defaults are the
     WORK page's, and a number tuned in one room has no business being written
     into the other's file. Everything the export carried already matched what
     ships; these two are the whole difference. */
  /* THE HOME PAGE'S BLOCK 01 AND THE WORK FIELD RUN THE SAME BLOB, because the
     brief asked for that one by name — "the regular blob, copied from the first
     block of the home page". So the two deviations are keyed on the pair rather
     than on the mask page alone.

     Written as a set rather than as two `if`s: the moment a third page wants
     this treatment, a chain of page tests is how one of them silently keeps the
     work page's old values. */
  if (ONMASK || scope.dataset.page === 'design'){
    CONFIG.vary = 0.6;
    CONFIG.varyLobes = 0.9;
  }

  const on = window.PAGE.bindings();

  /* Listened for on the window, not the stage: the wheel's cards sit on top of
     it and a pointermove over a card is not a pointermove over the stage, so
     binding to the element makes the blobs stutter over exactly the things
     they are most interesting on top of. */
  /* Same reason as the size above, and it matters more here: a pointermove
     can fire a hundred times a second, and getBoundingClientRect in the
     handler is a hundred forced layouts a second. The stage's box moves on a
     resize and on nothing else. */
  let sx = 0, sy = 0;
  function measureBox(){
    const r = stage.getBoundingClientRect();
    sx = r.left; sy = r.top;
  }
  measureBox();

  on(window, 'pointermove', e => {
    if (!sw || !sh) return;
    px = (e.clientX - sx) / sw;
    py = 1 - (e.clientY - sy) / sh;   // GL's y runs up
    const inside = px >= 0 && px <= 1 && py >= 0 && py <= 1;
    wanted = inside ? 1 : 0;
    if (inside && !seen){ hx = px; hy = py; seen = true; }
  });
  on(document, 'pointerleave', () => { wanted = 0; });
  on(window, 'blur', () => { wanted = 0; });

  let rt;
  on(window, 'resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { measureStage(); measureBox(); resize(); }, 150);
  });
  /* The stage also moves when the page scrolls, and the work page does not
     scroll — but a Barba swap re-lays it, so the box is re-read on the first
     frame after mount rather than trusted from construction time. */
  let boxFresh = false;

  function frame(now){
    if (!alive) return;
    const dt = Math.min((now - last) / 1000, 0.1); last = now;
    const C = CONFIG;

    fpsN++;
    if (now - fpsAt >= 1000){ fps = fpsN * 1000 / (now - fpsAt); fpsN = 0; fpsAt = now; }

    /* HELD, NOT KILLED, while the context is gone. The loop keeps running and
       keeps tracking the pointer, so the moment the browser hands a context
       back the blob is already where the cursor is rather than snapping to it
       from the last position before the tab went to sleep. */
    if (guard && guard.lost()){
      if (canvas) canvas.style.visibility = 'hidden';
      raf = requestAnimationFrame(frame);
      return;
    }

    if (C.enabled && init()){
      if (!boxFresh){ boxFresh = true; measureStage(); measureBox(); }
      // exponential decay against real elapsed time, so the lag and the fade
      // settle identically on any refresh rate
      const lk = 1 - Math.exp(-dt / Math.max(C.lag, 0.001));
      hx += (px - hx) * lk;
      hy += (py - hy) * lk;
      const fk = 1 - Math.exp(-dt / Math.max(C.fade, 0.001));
      alpha += (wanted - alpha) * fk;

      /* ---- lay the trace ----
         By DISTANCE first and time second. Time alone spends the whole budget
         in a fraction of a second on a fast mouse, so what stays on screen is
         the last moment of travel rather than the path; and a pointer sitting
         still stacks every mark in one spot and leaves nothing anywhere else.
         Moving is what draws. */
      const cap = Math.max(0, Math.min(MAX_PTS - 1, Math.round(C.traceMarks)));
      if (C.traceOn && cap > 0 && alpha > 0.01){
        const head = trace[0];
        const step = Math.max(0.02, C.traceStep) * Math.max(C.size, 1e-4);
        const moved = !head || Math.hypot(hx - head.x, hy - head.y) >= step;
        if (moved && now - lastMark >= Math.max(4, C.traceEvery)){
          lastMark = now;
          /* The direction is taken from the mark it is following, not from the
             raw pointer: the stretch has to lie along the line the blob
             actually travelled, and a mouse that jitters would otherwise spin
             every mark to a different angle on the same stroke. */
          if (head) headAng = Math.atan2(hy - head.y, hx - head.x);
          trace.unshift({ x: hx, y: hy, t: now, a: headAng, s: Math.random() });
        }
      }
      // age out, and honour a lowered cap straight away rather than on the
      // next stroke — a slider that takes effect later reads as a broken one
      const life = Math.max(0.05, C.traceLife) * 1000;
      while (trace.length && (now - trace[trace.length - 1].t >= life ||
                              trace.length > cap)) trace.pop();

      /* Slot 0 is always the blob under the pointer, at full size and full
         strength. Everything after it is the trace, each mark on its own
         clock: shrinking toward traceShrink and fading toward traceFade. */
      const pts = new Float32Array(MAX_PTS * 4);
      const ext = new Float32Array(MAX_PTS * 2);
      pts[0] = hx; pts[1] = hy; pts[2] = C.size; pts[3] = 1;
      ext[0] = headAng; ext[1] = 0;
      const vary = Math.max(0, Math.min(1, C.vary));
      const mk = Math.max(0.05, C.traceSize);
      const shrink = Math.max(0, Math.min(1, C.traceShrink));
      const fadeTo = Math.max(0, Math.min(1, C.traceFade));
      const ease = Math.max(0.1, C.traceEase);
      for (let i = 0; i < trace.length && i < MAX_PTS - 1; i++){
        const age = Math.max(0, Math.min(1, (now - trace[i].t) / life));
        // eased, so a mark holds its size and then goes rather than shrinking
        // evenly from the instant it is drawn
        const k = 1 - Math.pow(age, ease);
        const o = (i + 1) * 4;
        pts[o]     = trace[i].x;
        pts[o + 1] = trace[i].y;
        pts[o + 2] = C.size * mk * (shrink + (1 - shrink) * k);
        pts[o + 3] = fadeTo + (1 - fadeTo) * k;
        ext[(i + 1) * 2]     = trace[i].a;
        ext[(i + 1) * 2 + 1] = trace[i].s * vary;
      }

      resize();
      buildProgram();
      buildAtlas();
      const aspect = canvas.width / Math.max(canvas.height, 1);
      const dpr = canvas.width / Math.max(sw, 1);
      // the cell is quoted in CSS px, so it has to be scaled to the backing
      // store or the characters halve on a retina screen
      const cellPx = Math.max(3, C.cell * dpr);
      const ic = hex3(C.ink), pc = hex3(C.paintTint);
      const time = (now - t0) / 1000;

      /* Everything both passes need. The cell pass and the draw pass share a
         shader, so they share its uniforms; only the two textures and the grid
         differ, and those are set per pass below. */
      const feed = U => {
        gl.uniform4fv(U.pts, pts);
        gl.uniform2fv(U.ext, ext);
        gl.uniform1f(U.wobble, C.wobble);
        gl.uniform1f(U.lobes, Math.max(1, C.lobes));
        gl.uniform1f(U.shape, Math.max(0, Math.min(1, C.shape)));
        gl.uniform1f(U.stretch, Math.max(0, C.stretch));
        gl.uniform1f(U.squash, C.squash);
        gl.uniform1f(U.sides, Math.max(3, C.sides));
        gl.uniform1f(U.sideMix, Math.max(0, Math.min(1, C.sideMix)));
        gl.uniform1f(U.corner, Math.max(0, Math.min(1, C.corner)));
        gl.uniform1f(U.star, Math.max(0, Math.min(1, C.star)));
        gl.uniform1f(U.rotate, C.rotate);
        gl.uniform1f(U.spin, C.spin);
        gl.uniform1f(U.varySize, Math.max(0, C.varySize));
        gl.uniform1f(U.varyAngle, C.varyAngle);
        gl.uniform1f(U.varyShape, Math.max(0, C.varyShape));
        gl.uniform1f(U.varyLobes, Math.max(0, C.varyLobes));
        gl.uniform2f(U.res, canvas.width, canvas.height);
        gl.uniform1f(U.cell, cellPx);
        gl.uniform1f(U.glyphs, glyphs);
        gl.uniform1f(U.ramp, Math.max(0.05, C.ramp));
        gl.uniform1f(U.rampFlip, C.rampFlip ? 1 : 0);
        gl.uniform1f(U.jitter, Math.max(0, C.jitter));
        gl.uniform1f(U.bgLevel, C.bgLevel);
        gl.uniform1f(U.bgTilt, C.bgTilt);
        gl.uniform1f(U.bgNoise, C.bgNoise);
        gl.uniform1f(U.bgNoiseScale, Math.max(0.1, C.bgNoiseScale));
        gl.uniform1f(U.bgDrift, C.bgDrift);
        gl.uniform1f(U.bgRadial, C.bgRadial);
        gl.uniform1f(U.clear, Math.max(0, Math.min(1, C.clear)));
        gl.uniform1f(U.paint, Math.max(0, Math.min(1, C.paint)));
        gl.uniform3f(U.ink, ic[0], ic[1], ic[2]);
        gl.uniform3f(U.paintTint, pc[0], pc[1], pc[2]);
        gl.uniform1f(U.aspect, aspect);
        gl.uniform1f(U.time, time);
        gl.uniform1f(U.merge, C.merge);
        gl.uniform1f(U.tear, (LOOK.dispAmp != null ? LOOK.dispAmp : 0.095) * C.tear);
        gl.uniform1f(U.tearScale, C.tearScale);
        gl.uniform1f(U.drift, C.drift);
        gl.uniform1f(U.soft, Math.max(0.0005, C.soft));
        gl.uniform1f(U.grain, C.grain);
        gl.uniform1f(U.alpha, alpha);
        gl.uniform1i(U.detail, Math.max(1, Math.min(5,
          Math.round(LOOK.dispDetail != null ? LOOK.dispDetail : 5))));
      };

      /* ---- PASS 1: the cells ------------------------------------------------
         One texel per character. This is where the field is evaluated, and it
         is the whole reason the effect is affordable: at a 4px cell on a retina
         screen the grid is a sixty-fourth of the pixels the visible pass has,
         and the field is the expensive part.

         Blending OFF: this is data, not a picture, and blending it against
         whatever the buffer held last frame would be nonsense. */
      if (C.ascii){
        ensureCells(cellPx);
        gl.bindFramebuffer(gl.FRAMEBUFFER, cellFbo);
        gl.viewport(0, 0, cellW, cellH);
        gl.disable(gl.BLEND);
        gl.useProgram(progCells);
        feed(UCells);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.enable(gl.BLEND);
      }

      /* ---- PASS 2: the picture --------------------------------------------- */
      gl.useProgram(progDraw);
      feed(UDraw);
      if (C.ascii){
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, atlasTex);
        gl.uniform1i(UDraw.atlas, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, cellTex);
        gl.uniform1i(UDraw.cells, 1);
        gl.uniform2f(UDraw.cellGrid, cellW, cellH);
      }

      canvas.style.mixBlendMode = BLEND[C.mode] || 'normal';
      canvas.style.opacity = C.mode === 'plain' ? String(C.amount) : '1';

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      /* WHAT DECIDES VISIBILITY CHANGED WITH THE LAYER'S JOB. It used to be
         the pointer: no pointer, no blobs, nothing to show. The characters are
         the page's ground now and are there whether or not anyone is pointing
         at them, so the gate is the ASCII pass — and only the HOLE still fades
         with the pointer. Leaving the old test in place is what made the whole
         field vanish until the mouse moved, which looked like the ground had
         failed to draw rather than like a stale gate.

         'visible', not '' — the class carries visibility:hidden, so clearing
         the inline value falls back to the rule and nothing appears. */
      canvas.style.visibility = (C.ascii || alpha > 0.002) ? 'visible' : 'hidden';
    } else if (canvas){
      canvas.style.visibility = 'hidden';
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  window.WORKFX = {
    config: CONFIG,
    apply(){ resize(); },
    readout(){
      return { fps: fps ? fps.toFixed(0) : '—',
               cells: CONFIG.ascii ? `${cellW}x${cellH}` : 'off',
               blobs: failed ? 'failed' : (canvas ? (alpha > 0.002 ? 'on screen' : 'waiting') : 'idle'),
               trace: CONFIG.traceOn ? `${trace.length} marks` : 'off' };
    },
    rows(){
      const num = (key, min, max, step, hint) => ({
        label: 'blob.' + key, min, max, step, hint,
        get: () => CONFIG[key], set: v => { CONFIG[key] = v; },
      });
      const pick = (key, options, hint) => ({
        label: 'blob.' + key, options, hint,
        get: () => CONFIG[key], set: v => { CONFIG[key] = v; },
      });
      return [
        { name: 'CURSOR · the blob', open: true, rows: [
          { label:'blob.enabled', options:['on','off'],
            get: () => CONFIG.enabled ? 'on' : 'off',
            set: v => { CONFIG.enabled = (v === 'on'); },
            hint:'the torn shapes that follow your mouse' },
          num('size', 0.02, 0.6, 0.005, 'how big the shape under the cursor is'),
          num('lag', 0.01, 1, 0.01, 'how far behind your mouse it runs · low sticks to the cursor'),
          num('merge', 0, 0.4, 0.005, 'how much overlapping shapes melt into one another'),
        ]},

        { name: 'CURSOR · shape', open: true, rows: [
          num('shape', 0, 1, 0.01, 'round at 0, square at 1, and everything in between'),
          num('wobble', 0, 1.2, 0.01,
            'how far the outline wanders off that shape · 0 gives you the clean shape with only the tear on its edge'),
          num('lobes', 1, 12, 0.5, 'how many bumps that wander makes · low is a few big lumps, high is a starfish'),
          num('stretch', 0, 3, 0.05, 'drawn out along the direction it was moving'),
          num('squash', -0.8, 3, 0.05, 'flatter or taller, on a fixed axis instead of the direction of travel'),
          num('rotate', -180, 180, 1, 'turn every mark by this much'),
          num('spin', -180, 180, 1, 'degrees a second · marks keep turning as they age'),
        ]},

        { name: 'CURSOR · polygons', open: true, rows: [
          num('sideMix', 0, 1, 0.01,
            'how far toward a polygon · 0 leaves the round-to-square shape above alone, and nothing else in this group does anything until you raise it'),
          num('sides', 3, 12, 1, 'how many sides · 3 is a triangle, 6 a hexagon'),
          num('corner', 0, 1, 0.01, 'rounds the corners back off · 1 is a circle again'),
          num('star', 0, 1, 0.01, 'pulls the edges in · with 5 sides this is a five-pointed star'),
        ]},

        { name: 'CURSOR · how different each one is', open: true, rows: [
          num('vary', 0, 1, 0.05,
            'how differently each mark wobbles · 0 stamps the same outline every time'),
          num('varySize', 0, 1.5, 0.05, 'spread in size, as a share of it'),
          num('varyAngle', 0, 180, 5, 'spread in rotation, in degrees'),
          num('varyShape', 0, 1, 0.05,
            'spread in roundness AND in how polygonal it is · at 1 one mark is a square and the next is a hexagon'),
          num('varyLobes', 0, 1.5, 0.05, 'spread in how many bumps it has'),
        ]},

        { name: 'CURSOR · the tear', open: false, rows: [
          num('tear', 0, 2, 0.01, 'how ragged the edges are · this roughens the outline, it does not change what the outline is — that is the group above'),
          num('tearScale', 1, 40, 0.2, 'how big the torn pieces are · high is confetti'),
          num('drift', 0, 3, 0.05, 'how fast the tearing pattern crawls · 0 holds it still'),
          num('soft', 0.0005, 0.06, 0.0005, 'edge hardness · small is a crisp cut'),
          num('fade', 0.02, 1.5, 0.02, 'seconds to appear and vanish when the mouse enters or leaves'),
        ]},

        /* Its own group, and named TRACE so it is the word you scan for. */
        { name: 'CURSOR · TRACE, what it leaves behind', open: true, rows: [
          { label:'trace.on', options:['on','off'],
            get: () => CONFIG.traceOn ? 'on' : 'off',
            set: v => { CONFIG.traceOn = (v === 'on'); },
            hint:'marks stay where you drew them instead of following the cursor away' },
          { ...num('traceMarks', 0, MAX_PTS - 1, 1,
              'how many marks can be on screen at once · this is the length of the trail'),
            label: 'trace.marks' },
          { ...num('traceLife', 0.1, 8, 0.1,
              'seconds a mark lasts before it is gone'),
            label: 'trace.life' },
          { ...num('traceStep', 0.05, 2, 0.05,
              'how far the mouse moves before it leaves another mark · low is a solid smear, high is stepping stones'),
            label: 'trace.step' },
          { ...num('traceEvery', 4, 200, 2,
              'the shortest time between marks · stops one fast flick from spending them all at once'),
            label: 'trace.every' },
          { ...num('traceShrink', 0, 1, 0.01,
              'how much is left of a mark by the end · 0 shrinks it away, 1 keeps it full size'),
            label: 'trace.shrink' },
          { ...num('traceFade', 0, 1, 0.01,
              'how solid a mark still is at the end · 0 fades out, 1 vanishes at full strength'),
            label: 'trace.fade' },
          { ...num('traceEase', 0.2, 4, 0.1,
              'above 1 a mark holds and then goes quickly · below 1 it starts dying immediately'),
            label: 'trace.ease' },
          { ...num('traceSize', 0.05, 2.5, 0.05,
              'how big the marks are next to the blob under the cursor · over 1 and the trail is fatter than its head'),
            label: 'trace.size' },
        ]},
        { name: 'CURSOR · ASCII', open: true, rows: [
          { label:'ascii.on', options:['on','off'],
            get: () => CONFIG.ascii ? 'on' : 'off',
            set: v => { CONFIG.ascii = (v === 'on'); },
            hint:'draw the marks as characters instead of solid shapes' },
          { ...num('cell', 4, 40, 1,
              'how big one character is · this is the grid everything else is measured against'),
            label: 'ascii.cell' },
          { ...pick('chars', [' .:-=+*#%@', ' .·:*oO0@', ' ░▒▓█', ' .-+=#@',
                              ' `\'\".,;!|/\\()[]{}#@', ' 01', ' ▖▘▝▗▚▞▙▛▜▟█'],
              'the ramp, sparse to dense · the first character is the empty one'),
            label: 'ascii.chars' },
          { ...num('ramp', 0.2, 4, 0.05,
              'contrast of the ramp · above 1 it jumps to the dense end, below it lingers on the sparse one'),
            label: 'ascii.ramp' },
          { label:'ascii.rampFlip', options:['off','on'],
            get: () => CONFIG.rampFlip ? 'on' : 'off',
            set: v => { CONFIG.rampFlip = (v === 'on'); },
            hint:'dense at the edges instead of the middle' },
          { ...num('jitter', 0, 0.6, 0.01,
              'per-cell noise, so the ramp shimmers rather than sitting still in bands'),
            label: 'ascii.jitter' },
          { ...num('weight', 100, 900, 100,
              'the font weight the characters are drawn at'),
            label: 'ascii.weight' },
          { ...pick('ink', ['#1A1A1A','#000000','#4A4A4A','#e8271c','#2E6BFF'],
              'the characters\' colour'),
            label: 'ascii.ink' },
        ]},

        { name: 'CURSOR · the ground under the page', open: true, rows: [
          { ...num('bgLevel', 0, 1, 0.01,
              'how dense the characters are before anything else touches them'),
            label: 'ground.level' },
          { ...num('bgTilt', -1, 1, 0.01,
              'denser at the bottom than the top · negative flips it'),
            label: 'ground.tilt' },
          { ...num('bgRadial', -1, 1, 0.01,
              'denser toward the middle · negative clears the middle and thickens the frame'),
            label: 'ground.radial' },
          { ...num('bgNoise', 0, 1.5, 0.01,
              'how much drifting noise breaks it up · 0 is a flat, even screen'),
            label: 'ground.noise' },
          { ...num('bgNoiseScale', 0.3, 14, 0.1,
              'how big those patches are'),
            label: 'ground.noiseScale' },
          { ...num('bgDrift', 0, 1, 0.01,
              'how fast they crawl · 0 holds the field still'),
            label: 'ground.drift' },
        ]},

        { name: 'CURSOR · what the cursor clears', open: true, rows: [
          { ...num('clear', 0, 1, 0.01,
              'how completely the cursor wipes the characters away · 1 leaves the page\'s own clean ground'),
            label: 'clear.amount' },
          { ...num('paint', 0, 1, 0.01,
              'how solidly the blob paints itself over the gap it made · 0 is an erase and nothing more'),
            label: 'clear.paint' },
          { ...pick('paintTint', ['#FFFFFF','#F7F7F7','#000000','#e8271c'],
              'the blob\'s own colour'),
            label: 'clear.tint' },
        ]},

        { name: 'CURSOR · what shows through', open: true, rows: [
          pick('mode', ['invert','exclusion','knockout','plain'],
            'invert flips the colours of whatever is underneath · exclusion is the gentler version · knockout paints the colour flat over it · plain lays the colour on top'),
          num('amount', 0, 1, 0.01, 'how far it goes · 1 is a full flip, 0 leaves the page alone'),
          num('grain', 0, 0.5, 0.005, 'speckle inside the shapes'),
          num('renderScale', 0.25, 1, 0.05, 'draw at less than full resolution if it ever costs too much'),
        ]},
      ];
    },
  };

  return function destroy(){
    alive = false;
    cancelAnimationFrame(raf);
    clearTimeout(rt);
    on.release();
    if (guard){ guard.release(); guard = null; }
    /* THE CONTEXT IS RELEASED, NOT JUST DROPPED. Removing the canvas and
       nulling the reference leaves it to the garbage collector, and Chrome
       reclaims WebGL contexts lazily — but the per-process ceiling is about
       sixteen and this page opens most of them. Navigate index -> work ->
       index a few times and the oldest live context is force-lost instead,
       which is where the stale uniform locations in the console come from.
       js/about-figure.js has done this since it was written; this file had
       not, and it holds the biggest context on the page. */
    try {
      const lose = gl && gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    } catch (e){}
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    canvas = null; gl = null;
    if (window.WORKFX && window.WORKFX.config === CONFIG) delete window.WORKFX;
  };
});
