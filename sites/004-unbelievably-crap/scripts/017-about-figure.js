/* ==========================================================================
   about-figure.js — the scanned figure on the About page.

   WHY RAW WebGL AND NOT THREE.JS
   The model needs one static mesh, one material, one light and a Y rotation.
   three.js is ~150KB gzipped for that, and this site currently ships no 3D
   library at all — the wheel and the sphere are CSS transforms. The whole
   renderer below is under 200 lines and has no dependency, which also keeps
   the page working when the CDN is unreachable, the same rule js/loader.js and
   js/transition.js already follow.

   WHAT THE FILE ACTUALLY CONTAINS
   assets/about/figure.glb is produced by tools/decimate-glb.py from a 36 MB,
   two-million-triangle Meshy export. That export had POSITION and nothing
   else: no materials, no UVs, no textures, and no NORMALS. The figure is grey
   because there is no colour information anywhere in it — the normals this
   shader lights it with were derived, not supplied. Do not go looking for a
   texture to hook up; there isn't one, and the design does not want one.

   INTERACTION
   Scroll turns it, and it drifts on its own when untouched. Scroll is fed
   through the same accumulator-and-ease shape the wheel uses, so the two pages
   feel related, and the drift is added to the same accumulator so it hands
   over without a seam when scrolling stops.
   ========================================================================== */
/* A FACTORY, not a single registration. The mask page runs TWO of these — the
   head in the first block and the full body in the second — and they differ in
   exactly three things: which canvas, which global they publish, and whether
   their drawing buffer is preserved. Everything else is identical, so the
   alternative was a second copy of six hundred lines that would have drifted
   from this one the first time either changed. */
/* OVERRIDES is the fourth argument and the reason it exists is worth stating:
   every instance of this renderer shares one set of defaults, and the head in
   block 02 is a different subject at a different size from the standing figure
   in block 01. Before this it could only be resized through the --fig-height
   CSS property — which about-figure prefers over CONFIG.height whenever it is
   set, and which would therefore have taken js/head-spin.js's size dial dead
   with it, silently. A plain default here leaves CONFIG.height the live value
   it has to stay. */
function makeFigure(CANVAS_SEL, GLOBAL, PRESERVE, OVERRIDES){
 return function (scope) {
  'use strict';

  const canvas = scope.querySelector(CANVAS_SEL);
  /* BEFORE anything reads it. The mesh lookup below was written above this
     guard, which meant every page WITHOUT a figure — the wheel and the sphere,
     two thirds of the site — threw on mount the moment the lookup started
     reading the canvas instead of the container. The lifecycle isolated it, so
     the pages still came up; only the console said so. */
  if (!canvas) return;

  /* WHICH MESH. Read off the CANVAS first and the container second, so two
     renderers on one page can carry different models. Absent from both — as on
     About — and it is the scanned figure, exactly as before. */
  const MESH_VAR = canvas.dataset.figureVar || scope.dataset.figureVar || 'FIGURE_MESH';
  const MESH_SRC = canvas.dataset.figureSrc || scope.dataset.figureSrc || 'assets/about/figure.js';

  /* AND AN OPTIONAL SECOND MESH, drawn over the first in the same pass — the
     mask over the face. It is named on the CANVAS only, never inherited from
     the container: js/about-xray.js reads data-inner-var off the container for
     its own second layer, and a renderer that quietly picked that up would put
     the skeleton inside the head. Absent, and this is a one-mesh figure
     exactly as About has always been. */
  const INNER_VAR = canvas.dataset.innerVar || '';
  const INNER_SRC = canvas.dataset.innerSrc || '';

  const CONFIG = {

    // ---- framing ----
    height: 0.46,      // figure height as a share of the viewport height
    offsetX: 0,        // nudge left/right, in viewport heights
    /* ...AND ALONG THE VIEW AXIS. The other two slide the subject across the
       frame; this one moves it TOWARD or AWAY from the camera, which is a
       different thing from scaling it — the perspective changes with it, so a
       plate turning edge-on foreshortens more when it is near and less when it
       is far. Above 0 is closer. Ships at 0, where it costs nothing. */
    offsetZ: 0,
    offsetY: 0,      // nudge up/down, in viewport heights

    /* ---- THE POINTER LEANS THE CAMERA -----------------------------------
       js/path-gallery.js's move, and the same idea: the camera steps sideways
       along its OWN axes and the model answers by parallax. It is NOT `follow`
       further down — that turns the MODEL to look at you; this moves the EYE
       and the model does not know you are there.

       Off everywhere and turned on per stage. Six things on this site are
       drawn by this file and a camera that drifts with the pointer is right
       for one of them. */
    /* ---- EACH HALF ABOUT ITS OWN AXIS ------------------------------------
       See the vertex shader. `spinOwn` is degrees; ownCx/ownCz say where that
       axis stands, in the model's own units, and the sign of x picks which
       side of the pair a vertex belongs to. All three are 0 by default, which
       is off — a model with nothing at ±ownCx has no halves to turn. */
    spinOwn: 0,
    ownCx: 0,
    ownCz: 0,

    mouseGain: 0,      // the strength dial · 0 is off
    mouseX: 0.06,      // viewport heights the eye steps at the edge
    mouseY: 0.035,
    mouseTurn: 0.35,   // 0 slides, 1 swings back onto the model
    mouseEase: 0.28,

    /* ---- THE BREATH ------------------------------------------------------
       A slow rise and fall, with the two halves of the model slightly out of
       step so it reads as something alive rather than as one object bobbing.
       See the vertex shader for why the two sides are told apart in there.
       0 is off, which is every stage but the one that asks. */
    breath: 0,        // amplitude, in model heights · 0.012 is a breath
    breathRate: 0.19, // cycles a second · slower than a real breath, on purpose
    breathPhase: 0.14,// how far out of step the two sides are, in cycles
    fov: 70,           // degrees; low is flattering, high is dramatic
    /* 'height' — the figure fills this share of the viewport HEIGHT and may
       overflow. 'contain' — it fills this share of the FRAME and never leaves
       it. About ships 'height'; the model room in lab.html sets 'contain', for
       the obvious reason that it exists to be scaled up. */
    fit: 'height',
    fitPad: 0.04,      // share of the frame kept clear in 'contain' mode

    /* Camera elevation, ramped from tiltStart to tiltEnd across tiltOverPx of
       scroll. Both are 40 in the shipped setting, i.e. a fixed elevation —
       the ramp is still here and works the moment the two differ. */
    tiltStart: 40,
    tiltEnd: 40,
    /* How far the reader has to scroll for the tilt to complete, in px. Its
       own number rather than "one pass of the text": the pass length depends
       on the line gap, so tying the two meant tightening the copy also turned
       a fifteen-hundred-pixel camera move into a seven-hundred-pixel one. */
    tiltOverPx: 1800,
    /* Added to whatever the ramp above produces. This is what a vertical drag
       writes, so the pointer and the ramp compose instead of fighting. */
    tiltOffset: -28.040625,

    /* PITCH — AND IT IS NOT ANOTHER TILT, WHICH IS THE ONLY THING WORTH
       KNOWING ABOUT IT. The three above ORBIT: they walk the eye around the
       subject on a circle and keep it aimed at the same point, so raising them
       looks DOWN from higher up and the subject turns on the spot as you go.
       That is a camera on a crane.

       This one rotates the camera about ITS OWN position and moves nothing.
       The eye stays where it is, the subject stays where it is, and only the
       direction of the look changes — which is what a person standing at
       someone's feet and raising their chin actually does. The picture keeps
       the perspective of the low viewpoint: verticals converge upward and the
       body towers, instead of flattening out the way an orbit would.

       Degrees, positive is up. 0 changes nothing, which is why every other
       stage on the site can ignore that this exists. */
    pitch: 0,

    // ---- motion ----
    scrollTurn: 0.22,  // degrees of spin per pixel scrolled
    idleSpin: 4,     // degrees per second when untouched (a turn in 90s)
    followEase: 0.09,  // how fast the spin catches up
    startAngle: 0,     // degrees at rest

    /* ---- WHAT THE REVEAL LOOKS LIKE ----
       The reveal dials decide WHERE the hole is; these decide what it looks
       like. They are the qualities block 01's x-ray has that a plain hole does
       not — that effect is a fluid sim in three.js and these are NOT its
       numbers, because copying those would be copying the settings of a
       different machine. What is copied is what they produce.

       All seven ship at the value that changes nothing. */
    headOpacity: 1.0,   // the outer layer, see-through even untouched
    fresnel: 0.0,       // the rim lights where the surface turns away
    fresnelPower: 2.2,  // how thin that rim is
    revealGlow: 0.0,    // a fringe burning where the reveal passes THROUGH
    revealEdge: 0.35,   // how wide that fringe is
    revealTint: '#DFF3FF',
    skullGlow: 0.0,     // the inner layer lit from within

    /* How far the surface is pushed to flat white, ignoring its own shading.
       0 is the lit model; 1 is a clean silhouette. Ships at 0. */
    flatten: 0.0,

    /* HOW DEEP THE MESH IS, along its own Z, as a multiplier of whatever it
       was modelled at. 1 changes nothing, which is why every mesh that does not
       ask keeps exactly the geometry it shipped with.

       It exists for the logo: that mesh is 1.000 x 1.000 x 0.030, a plate, and
       at 30px on screen its edge is a hairline. Scaling the whole object would
       make it wider as well; this scales the one axis that is its thickness.

       THE OUTER MESH ONLY. The two-layer path draws a second mesh through the
       same shader with its own matrix, and a depth baked into the shared
       rotation would have been inherited by that one's NORMALS while missing
       its positions — a mismatch that shows as lighting from the wrong angle
       on a layer nobody asked to thicken. */
    depth: 1.0,
    /* ...and the level it flattens TO. 1.0 is flat white, which is what
       `flatten` has always meant and what block 02's head depends on. Below 1
       it is a flat GREY instead, which is only what the work page's figure
       wants — see the note beside uFlatLevel in the shader for why this is a
       separate number and not simply `tone`. */
    flatLevel: 1.0,

    // ---- shading ----
    lightX: -1, lightY: -1, lightZ: 1,
    ambient: 0.08,     // fill; 0 is a hard black shadow side
    diffuse: 0.8,
    rim: 0.12,         // edge light, what stops it reading as a flat cutout
    /* Matched to the reference by measurement, not by eye. Sampling the
       target's torso gave a mean level of 170 with a chroma spread of 40; the
       first pass measured 129 and 164 — too dark and four times too speckled,
       which read as confetti rather than a tinted grey. */
    /* A green cast, and it has to come from HERE rather than from the fx
       layer: a `saturation` blend takes only the source's saturation, never
       its hue, so making --fx-color green does not make the figure green. The
       tint is normalised by its own mean before it is applied, so choosing a
       colour shifts the hue without also changing how bright the figure is —
       `tone` stays the one brightness control. */
    tint: '#FCFFF8',

    tone: 0.74,        // overall lightness of the grey
    grain: 0.095,      // per-pixel colour noise. Sets how MANY pixels the
                       // saturation layer can colour, not how strongly — that
                       // is --fx-opacity. See the note in css/about.css.

    /* Silhouette read-back. This is the only expensive thing on the page:
       readPixels forces a full GPU sync, so every one of these is a hitch on
       the main thread. Two gates, not one:

         silMs      the floor — never more often than this
         silEps     and only if the figure has actually TURNED this far since
                    the last read. Idle drift is 4 deg/s, so at 1.2 degrees the
                    read drops from eleven times a second to about three, and
                    the stalls stop being felt when nothing is happening.

       0 switches it off; the copy then parts around a plain rectangle. */
    silMs: 110,
    silEps: 1.2,
    silEase: 0.07,     // seconds for the outline to follow a new read-back

    /* ---- the second mesh ----
       Inert unless the canvas names one. It rides the same spin, so it stays
       registered with the face however the head turns; the offsets below are
       in the face's own units, where 1 is the height of the model. */
    innerOn: true,
    innerX: 0, innerY: 0.004, innerZ: 0.012,
    /* Over 1, and it has to be. At exactly 1 the mask is the same size as the
       face and sits INSIDE it — the depth test then hides almost all of it and
       what survives is a fringe around the ears, which reads as a modelling
       error rather than as a mask. It is worn, so it is bigger. */
    /* FITTING THE INNER MESH INSIDE THE OUTER ONE. Both meshes arrive
       normalised to unit height, which makes them the same HEIGHT and nothing
       else — a skull normalised that way is exactly as tall as the head it
       belongs in, and scale 1 is not "inside", it is "coincident".

       OFF by default, and that default is the ABOUT page's: block 01's figure
       and skeleton were placed by hand, before this existed, and defaulting it
       on re-solved a scale somebody had already chosen. js/mask.js turns it on
       for block 02, where it does real work. */
    innerFit: false,
    innerFitPad: 0.06,
    innerScale: 1.05,
    innerTint: '#FCFFF8',
    innerTone: 0.74,

    /* ---- the two-layer reveal ----
       The idea js/about-xray.js had: the outer mesh is what you see, the inner
       one is underneath it, and the pointer wipes a hole in the outer so the
       inner shows through. Only the idea — the x-ray does it in three.js with
       a fluid simulation in a ping-pong buffer, and this is a trail of recent
       pointer positions summed in the fragment shader. Same picture, no second
       renderer, and it can be tested in the environment this site is built in.

       For it to read at all the inner mesh has to be INSIDE the outer, which
       is the opposite of a mask worn on a face — so `innerScale` under 1 and
       the reveal on go together, and the shipped pair below is the one the
       original x-ray was tuned to. */
    reveal: false,
    revealRadius: 0.15,  // brush size, as a share of the canvas height
    revealFade: 1.6,      // seconds a stroke takes to close over
    revealSoft: 0.72,      // edge of the hole · 1 is a wide gradient, 0 a cut
    revealMax: 1.0,       // how far it opens · below 1 the outer never fully goes
    revealWarp: 0.35,     // how much noise deforms the hole
    revealWarpScale: 9.0,
    revealWarpSpeed: 0.4,
    revealEvery: 26,      // ms · the floor between samples, so one fast flick
                          // cannot spend the whole budget in a single frame
    revealStep: 0.45,     // ...and how far the pointer must MOVE, in brush
                          // radii, before a new mark is laid down

    /* ---- pointer follow ----
       The figure turns TOWARD the pointer instead of drifting on its own. Both
       can be on; idleSpin is the drift and this is the aim, and they add. The
       range is what stops it from being a puppet: past about 30 degrees a head
       stops reading as attention and starts reading as a turntable. */
    follow: false,
    followRangeX: 26,  // degrees of turn at the edge of the screen
    followRangeY: 12,  // degrees of camera lift at the top and bottom
    followSpeed: 0.12, // 0 is frozen, 1 snaps · how fast it reaches the aim
    followCentre: true,// return to the start angle when the pointer leaves
  };

  /* The instance's own defaults, applied over the shared ones. See the note
     above makeFigure. */
  if (OVERRIDES) Object.assign(CONFIG, OVERRIDES);

  /* ---------------- GL setup ------------------------------------------------ */
  /* `let`, NOT const: attachTo() below swaps this for another module's context
     so the head can be rendered straight into the composite's own framebuffer
     instead of into a canvas that then has to be copied across. */
  let gl = canvas.getContext('webgl', {
    antialias: true, alpha: true, premultipliedAlpha: false,
    preserveDrawingBuffer: !!PRESERVE,
  });
  if (!gl){ canvas.dataset.failed = '1'; return; }

  const VERT = `
    attribute vec3 aPos;
    attribute vec3 aNrm;
    uniform mat4 uProj, uView, uModel;
    uniform mat3 uNormal;
    uniform vec3 uQMin, uQSpan;
    uniform float uBreath, uBreathT, uBreathPhase;
    uniform float uSpinOwn, uOwnCx, uOwnCz;
    varying vec3 vN, vP;
    void main(){
      /* aPos arrives as a normalised uint16, i.e. 0..1 across the mesh's own
         bounding box; this maps it back. Dequantising on the GPU rather than
         on load keeps the buffer at half the size in memory as well as on the
         wire. */
      vec3 p = uQMin + aPos * uQSpan;

      /* ---- THE BREATH, AND WHY IT IS IN HERE ------------------------------
         Two hands that rise and fall a little out of step. They are ONE mesh
         and one draw call, and they have to stay that way: a second canvas is
         a second WebGL context, and splitting them into two draws is two model
         matrices, two uniform sets and two state changes a frame for a
         movement worth four lines.

         So the side is read off the vertex itself. The model is centred
         between the wrists, so the sign of x IS which hand this is, and the
         phase falls out of it. The inner mesh is drawn by this same program in
         the same space, so its bones breathe with the hand they are inside —
         which is the other half of why this is here and not in JS.

         It is a translation along y and nothing else, so the normals below are
         still exactly right: a rigid shift does not turn a surface. */
      float side = p.x < 0.0 ? -1.0 : 1.0;

      if (uBreath > 0.0){
        p.y += uBreath * sin(uBreathT + side * uBreathPhase);
      }

      /* ---- EACH HALF ABOUT ITS OWN AXIS -----------------------------------
         The model matrix's rotY turns the WHOLE model about the origin, and
         the origin here is the line between the two wrists — so the pair swings
         like a door and each hand travels a wide circle. This is the other
         rotation: each half turns about a vertical axis through its own middle,
         so a hand spins where it stands.

         Same side test as the breath, and the same reason it is in here: one
         mesh, one draw call, and the inner layer is drawn by this program in
         this space, so the bones turn with the hand they are inside.

         THE NORMAL TURNS WITH IT. uNormal is built from the model matrix and
         knows nothing about this, so a surface rotated here and lit by a normal
         that was not would light as though it had never moved — the shading
         would stay welded to the screen while the shape turned under it. */
      vec3 nrm = aNrm;
      if (uSpinOwn != 0.0){
        vec2 c = vec2(side * uOwnCx, uOwnCz);
        vec2 d = p.xz - c;
        float sa = sin(uSpinOwn), ca = cos(uSpinOwn);
        p.xz = c + vec2(d.x * ca - d.y * sa, d.x * sa + d.y * ca);
        nrm.xz = vec2(nrm.x * ca - nrm.z * sa, nrm.x * sa + nrm.z * ca);
      }

      vN = normalize(uNormal * nrm);
      vec4 wp = uModel * vec4(p, 1.0);
      vP = wp.xyz;
      gl_Position = uProj * uView * wp;
    }`;

  /* The noise is deliberate and load-bearing. The figure is pure grey, and a
     `saturation` blend over pure grey does NOTHING — grey has no hue to
     saturate. Giving every pixel a tiny random hue is what the saturation
     layer then amplifies into the colour speckle the design is after. */
  const REV_PTS = 14;
  const FRAG = `
    precision mediump float;
    varying vec3 vN, vP;
    uniform vec3 uLight;
    uniform float uAmbient, uDiffuse, uRim, uTone, uGrain, uSeed;
    uniform vec3 uTint;

    /* THE REVEAL, in screen space. x and y are the canvas's own 0..1, z is how
       much life the stroke has left. Screen space rather than on the model's
       surface, because that is what the original did and what it looks like:
       the hole stays where you drew it while the head keeps turning under it. */
    uniform vec3 uRevPts[${REV_PTS}];
    uniform vec2 uRes;
    /* uRevMode:  1 the outer layer, which the reveal EATS
                  -1 the inner layer, which the reveal is the only thing that
                     shows — so it is invisible until the pointer opens a hole,
                     which is also what stops the parts of the mask that stick
                     out past the face from hanging there permanently. No
                     amount of scaling could contain them; not drawing them
                     unless they have been revealed does it exactly.
                   0 no reveal · one opaque layer, every other page */
    uniform float uHeadOpacity, uFresnel, uFresnelPow, uRevGlow, uRevEdge, uSkullGlow;
    uniform float uFlatten, uFlatLevel;
    uniform vec3 uRevTint;
    uniform float uRevMode, uRevRadius, uRevSoft, uRevMax,
                  uRevWarp, uRevWarpScale, uRevWarpSpeed, uRevTime;

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float vnoiseR(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
                 mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
    }

    float revealAt(){
      if (abs(uRevMode) < 0.5) return 0.0;
      vec2 uv = gl_FragCoord.xy / max(uRes.y, 1.0);   // heights on both axes,
                                                      // so the hole is round
      /* Warp the LOOKUP, not the result. Deforming where the brush is measured
         from bends the whole hole — including its interior — the way a fluid
         does; deforming the result afterwards only ever wobbles the rim. */
      if (uRevWarp > 0.0001){
        float n1 = vnoiseR(uv * uRevWarpScale + vec2(0.0, uRevTime * uRevWarpSpeed));
        float n2 = vnoiseR(uv * uRevWarpScale + vec2(5.2, uRevTime * uRevWarpSpeed + 1.3));
        uv += (vec2(n1, n2) - 0.5) * uRevWarp * uRevRadius * 2.0;
      }
      float r = 0.0;
      for (int i = 0; i < ${REV_PTS}; i++){
        if (uRevPts[i].z <= 0.0) continue;
        vec2 c = vec2(uRevPts[i].x * uRes.x / max(uRes.y, 1.0), uRevPts[i].y);
        float d = length(uv - c) / max(uRevRadius, 1e-4);
        /* Gaussian, not a hard disc: strokes have to ADD where they overlap
           so a slow drag opens a wider hole than a flick, and a soft falloff
           is what lets them sum without banding at every join. */
        r += uRevPts[i].z * exp(-d * d * mix(6.0, 1.6, clamp(uRevSoft, 0.0, 1.0)));
      }
      return clamp(r, 0.0, 1.0) * clamp(uRevMax, 0.0, 1.0);
    }

    void main(){
      vec3 n = normalize(vN);
      float d = max(dot(n, normalize(uLight)), 0.0);
      vec3 v = normalize(-vP);
      float r = pow(1.0 - max(dot(n, v), 0.0), 2.5);
      float s = uAmbient + uDiffuse * d + uRim * r;
      s *= uTone;
      /* FLAT WHITE. Everything above reads the model's NORMALS, and a
         photogrammetry scan's normals carry the scan: the brows, the glasses,
         the crease under the lip, and a scatter of reconstruction noise across
         the scalp. Lit at all, those come back as grey scratches on what is
         meant to be a clean white shape — which reads as damage rather than as
         detail, because at this size there is not enough of it to read as a
         face.

         So this walks the shaded value to 1 without touching a single lighting
         dial: at 0 nothing changes, at 1 the surface is pure white and the only
         thing left is the SILHOUETTE, which is the whole picture on this block
         anyway. The reveal, the fresnel and the skull underneath are all
         downstream of this and keep working — they are alpha and additive
         terms, not this. */
      /* THE OUTER LAYER ONLY. One shader draws both, and the skull is the
         thing the reveal is FOR — flatten it too and it goes white on white and
         the hole opens onto nothing. uRevMode < -0.5 is the inner draw. */
      /* WHAT IT FLATTENS *TO*, and it is a uniform rather than the 1.0 it
         reads as because two pages want two different answers.

         It was briefly uTone, so that the work page could have a dark
         silhouette for its subtractive blend modes — white multiplied by
         anything is that thing, so multiply and burn were no-ops there. That
         was wrong, and wrong in the way that matters: block 02's head runs
         flatten 1 with tone 0.05 ON PURPOSE — the lighting is turned right
         down and the flatten is what carries it back to white — so tying the
         two together took the head to near-black and brought its shading back
         with it. The check that missed it looked at block 01, which ships
         flatten 0, where the change was a mathematical no-op. THREE INSTANCES
         RUN THIS SHADER; verifying one of them verifies nothing.

         So it is its own dial, defaulting to the 1.0 it always was. Nothing
         that does not set it can notice this exists. */
      if (uRevMode > -0.5) s = mix(s, uFlatLevel, clamp(uFlatten, 0.0, 1.0));
      vec2 sp = gl_FragCoord.xy + uSeed;
      vec3 noise = vec3(hash(sp), hash(sp + 17.3), hash(sp + 41.7)) - 0.5;
      /* One shader for both layers; the mode is the only thing that differs,
         and it differs only in the alpha. */
      float rv = revealAt();
      float fres = 0.0;
      if (uFresnel > 0.0001 && uRevMode > 0.5){
        fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), uFresnelPow) * uFresnel;
      }
      float a = uRevMode > 0.5 ? uHeadOpacity * (1.0 - rv) + fres
              : (uRevMode < -0.5 ? rv : 1.0);
      /* DISCARD, not a zero alpha. A fragment with alpha 0 still writes DEPTH,
         so the unrevealed mask — invisible — would sit in the depth buffer in
         front of the face and punch a hole in it. */
      if (a <= 0.004) discard;
      vec3 base = vec3(s) * uTint;
      // the inner layer, lit from within rather than by the scene
      if (uRevMode < -0.5 && uSkullGlow > 0.0001) base += base * uSkullGlow;
      base += fres;
      /* THE FRINGE AT THE OPENING. Brightest where the reveal is passing
         THROUGH — not at its centre, where the hole is simply open, and not
         outside it, where nothing is happening. A band on the reveal's own
         value, peaking at half. */
      if (uRevGlow > 0.0001 && rv > 0.001){
        float band = rv * (1.0 - rv) * 4.0;
        band = pow(clamp(band, 0.0, 1.0), max(0.05, 1.0 - uRevEdge) * 4.0);
        base += uRevTint * band * uRevGlow;
      }
      gl_FragColor = vec4(clamp(base + noise * uGrain, 0.0, 1.0), a);
    }`;

  function compile(type, src){
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      console.error('[about-figure] shader:', gl.getShaderInfoLog(s));
    return s;
  }
  /* `let`, not `const`, and built through a function — because the browser can
     take this context back (a backgrounded tab, a sleeping machine, a GPU
     switch) and hand back a live one, at which point every GL object here is a
     dead handle that must be made again. See PAGE.glGuard in js/lifecycle.js. */
  let prog = null;
  function buildProgram(){
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.bindAttribLocation(prog, 1, 'aNrm');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      console.error('[about-figure] link:', gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
  }
  buildProgram();
  /* Uniform locations belong to the PROGRAM, so they die with it. Rebuilt
     alongside it rather than captured once, or a restored context would draw
     a live program with locations from a dead one — which sets nothing and
     reports no error. */
  let u = null;
  function buildUniforms(){
    const U = n => gl.getUniformLocation(prog, n);
    u = { proj:U('uProj'), view:U('uView'), model:U('uModel'), normal:U('uNormal'),
                light:U('uLight'), ambient:U('uAmbient'), diffuse:U('uDiffuse'),
                rim:U('uRim'), tone:U('uTone'), grain:U('uGrain'), seed:U('uSeed'),
                qmin:U('uQMin'), qspan:U('uQSpan'), tint:U('uTint'),
                breath:U('uBreath'), breathT:U('uBreathT'), breathPhase:U('uBreathPhase'),
                spinOwn:U('uSpinOwn'), ownCx:U('uOwnCx'), ownCz:U('uOwnCz'),
                revPts:U('uRevPts[0]'), res:U('uRes'), revOn:U('uRevMode'),
                revRadius:U('uRevRadius'), revSoft:U('uRevSoft'), revMax:U('uRevMax'),
                revWarp:U('uRevWarp'), revWarpScale:U('uRevWarpScale'),
                revWarpSpeed:U('uRevWarpSpeed'), revTime:U('uRevTime'),
                headOpacity:U('uHeadOpacity'), fresnel:U('uFresnel'),
                fresnelPow:U('uFresnelPow'), revGlow:U('uRevGlow'),
                revEdge:U('uRevEdge'), revTint:U('uRevTint'),
                skullGlow:U('uSkullGlow'), flatten:U('uFlatten'),
                flatLevel:U('uFlatLevel') };
  }
  buildUniforms();

  /* hex -> rgb normalised so its mean is 1: a pure hue shift, no brightness
     change, so `tone` remains the only thing that lightens or darkens */
  function tintVec(hex){
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '#ffffff'));
    if (!m) return [1, 1, 1];
    const n = parseInt(m[1], 16);
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    const avg = (c[0] + c[1] + c[2]) / 3 || 1;
    return c.map(v => v / avg);
  }

  /* SET PER DRAW, not once here — see setState() below. They used to be
     enabled at setup, which is correct for a context this file owns alone and
     quietly fatal for one it shares: js/mask-scroll.js draws a full-screen quad
     and never disables either, so its composite would be depth-tested against
     whatever the head left behind and face-culled by its own winding. A black
     screen, with nothing in the console. */
  function setState(){
    /* THE PROGRAM TOO, and this is the one that actually bit. It was bound once
       inside buildProgram() and never again, which is correct while this file
       owns the context alone — nothing else could unbind it. Sharing one with
       js/mask-scroll.js, its composite program is bound between our frames, and
       every uniform this file then sets goes to a location that belongs to a
       program that is not current: INVALID_OPERATION, forty times a frame, and
       the values silently never arrive. */
    if (prog) gl.useProgram(prog);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
  }
  setState();

  /* ---------------- mesh ----------------------------------------------------
     The mesh is a <script>, not a file this code fetches. fetch() is refused
     on file:// — a local file is an opaque origin — so the model silently
     never arrived when the page was opened off disk, which is how this site
     gets reviewed. A script tag has no such restriction and behaves the same
     in both places. assets/about/figure.js is generated by
     tools/decimate-glb.py; see write_js() there for the quantisation. */
  /* TWO MESH RECORDS, not one set of module variables. There is no VAO in
     WebGL 1 without an extension, so drawing a second mesh means rebinding the
     three buffers and the two attribute pointers before each draw — which is
     fine, and is why each mesh has to carry its own buffers rather than
     overwriting a shared set on load. */
  let outer = null, inner = null;
  let count = 0, ready = false, idxType = 0, qmin = [0,0,0], qspan = [1,1,1];
  /* Bounding sphere of the normalised mesh, filled in by upload(). CONTAIN
     framing solves against a SPHERE rather than a box on purpose: a sphere is
     rotation-invariant, so the fit holds at every spin and tilt without
     reprojecting eight corners every frame. */
  let bsY = 0.5, bsR = 0.55, cylR = 0.35, cylMinY = 0, cylMaxY = 1;

  function makeMesh(m){
    const bytes = Uint8Array.from(atob(m.b64), c => c.charCodeAt(0));
    const nPos = m.verts * 3 * 2;
    const pos = new Uint16Array(bytes.buffer, 0, m.verts * 3);
    const nrm = new Int8Array(bytes.buffer, nPos, m.verts * 3);
    /* idxOffset, not nPos + nNrm. A typed array must start on a multiple of
       its element size, and positions plus normals come to verts*9 bytes —
       only a multiple of 4 by coincidence. At 120,002 vertices that is
       1,080,018 and a Uint32Array view over it throws outright, which is why
       the exporter pads and records where the indices really begin. */
    const idxAt = m.idxOffset != null ? m.idxOffset : nPos + m.verts * 3;
    const idx = m.idxBytes === 2
      ? new Uint16Array(bytes.buffer, idxAt, m.indices)
      : new Uint32Array(bytes.buffer, idxAt, m.indices);

    const buf = (data, target) => {
      const b = gl.createBuffer();
      gl.bindBuffer(target, b);
      gl.bufferData(target, data, gl.STATIC_DRAW);
      return b;
    };
    const posBuf = buf(pos, gl.ARRAY_BUFFER);
    const nrmBuf = buf(nrm, gl.ARRAY_BUFFER);
    const idxBuf = buf(idx, gl.ELEMENT_ARRAY_BUFFER);

    /* Take the type from the ARRAY, never from the index count: the count is
       the number of indices (132,816 here) while the type depends on the
       number of VERTICES (20,458 — so uint16). Deriving it from the count
       picked UNSIGNED_INT for a uint16 buffer, which reads two indices as one
       and draws garbage triangles that still light up pixels, so it looks like
       a framing problem rather than a type error. */
    let type;
    if (idx instanceof Uint32Array){
      if (!gl.getExtension('OES_element_index_uint')){
        console.warn('[about-figure] no 32-bit indices; mesh will be truncated');
      }
      type = gl.UNSIGNED_INT;
    } else {
      type = gl.UNSIGNED_SHORT;
    }

    const mn = m.min;
    const sp = [m.max[0]-m.min[0], m.max[1]-m.min[1], m.max[2]-m.min[2]];
    // centred on X/Z by the converter, feet at y=0, so the centre is mid-height
    const sy = (m.min[1] + m.max[1]) / 2;
    const sr = Math.hypot(Math.max(Math.abs(m.min[0]), Math.abs(m.max[0])),
                     (m.max[1] - m.min[1]) / 2,
                     Math.max(Math.abs(m.min[2]), Math.abs(m.max[2])));
    /* A CYLINDER around the Y axis, which is the only axis the model turns
       about. It is rotation-invariant like the sphere — no breathing as it
       spins — but far tighter on anything tall: a bust's sphere has to swallow
       the whole height as radius, so the head ends up two thirds the size it
       could be. */
    const cr = Math.hypot(Math.max(Math.abs(m.min[0]), Math.abs(m.max[0])),
                      Math.max(Math.abs(m.min[2]), Math.abs(m.max[2])));
    return { posBuf, nrmBuf, idxBuf, count: m.indices, idxType: type,
             qmin: mn, qspan: sp, bsY: sy, bsR: sr, cylR: cr,
             cylMinY: m.min[1], cylMaxY: m.max[1] };
  }

  /* Rebind everything that differs between the two meshes. The camera solve
     reads the OUTER mesh's bounds only, so hanging a mask on the face cannot
     re-frame the shot — the mask is jewellery, not geometry. */
  let innerFitK = 1, innerFitY = 0;
  /* THE LARGEST UNIFORM SCALE THAT FITS. Per axis the ratio of the outer's
     half-extent to the inner's; the smallest of the three is the one that
     binds, because a uniform scale has to satisfy all of them. Then the
     centres are aligned, which is the other half of "inside": a box small
     enough to fit is still outside if it is in the wrong place. */
  function solveInnerFit(){
    if (!outer || !inner){ innerFitK = 1; innerFitY = 0; return; }
    const half = r => [
      Math.max(Math.abs(r.qmin[0]), Math.abs(r.qmin[0] + r.qspan[0])),
      r.qspan[1] / 2,
      Math.max(Math.abs(r.qmin[2]), Math.abs(r.qmin[2] + r.qspan[2])),
    ];
    const o = half(outer), i = half(inner);
    const pad = 1 - Math.max(0, Math.min(0.6, CONFIG.innerFitPad));
    innerFitK = Math.min(
      o[0] / Math.max(i[0], 1e-6),
      o[1] / Math.max(i[1], 1e-6),
      o[2] / Math.max(i[2], 1e-6)) * pad;
    // where the inner's own centre lands once scaled, against the outer's
    const oc = outer.qmin[1] + outer.qspan[1] / 2;
    const ic = (inner.qmin[1] + inner.qspan[1] / 2) * innerFitK;
    innerFitY = oc - ic;
  }

  function bindMesh(rec){
    gl.bindBuffer(gl.ARRAY_BUFFER, rec.posBuf);
    gl.enableVertexAttribArray(0);
    // normalized:true is what turns the uint16 back into 0..1 for the shader
    gl.vertexAttribPointer(0, 3, gl.UNSIGNED_SHORT, true, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, rec.nrmBuf);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.BYTE, true, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rec.idxBuf);
    /* The program, before the two uniforms below. This runs at mesh-load time
       rather than inside the frame, so it is outside the setState() the draw
       does — and in a shared context whatever was current belongs to someone
       else. Four INVALID_OPERATIONs, once, and qmin/qspan silently not set
       until the next frame overwrote them anyway. */
    if (prog) gl.useProgram(prog);
    gl.uniform3f(u.qmin, rec.qmin[0], rec.qmin[1], rec.qmin[2]);
    gl.uniform3f(u.qspan, rec.qspan[0], rec.qspan[1], rec.qspan[2]);
  }

  function useOuter(m){
    outer = makeMesh(m);
    bindMesh(outer);
    idxType = outer.idxType; count = outer.count;
    qmin = outer.qmin; qspan = outer.qspan;
    bsY = outer.bsY; bsR = outer.bsR;
    cylR = outer.cylR; cylMinY = outer.cylMinY; cylMaxY = outer.cylMaxY;
    ready = true;
    canvas.dataset.ready = '1';
  }

  /* The mesh script is on about.html only — it is 2.6MB and the other two
     pages have no use for it. Arriving here through a Barba navigation means
     it was never in the document, so inject it. A created <script> works over
     file:// exactly like a written one, which a fetch would not. */
  function withMesh(varName, src, fn){
    if (window[varName] && window[varName].b64) return fn(window[varName]);
    const existing = document.querySelector(`script[data-mesh-var="${varName}"]`);
    if (existing){
      existing.addEventListener('load', () => fn(window[varName]), { once: true });
      return;
    }
    const el = document.createElement('script');
    el.dataset.meshVar = varName;
    el.src = src;
    el.onload = () => fn(window[varName]);
    el.onerror = () => { console.error('[about-figure] mesh script failed:', src);
                         canvas.dataset.failed = '1'; };
    document.head.appendChild(el);
  }

  withMesh(MESH_VAR, MESH_SRC, m => {
    if (!m || !m.b64){
      console.error('[about-figure] mesh script loaded but empty');
      canvas.dataset.failed = '1'; return;
    }
    try { useOuter(m); }
    catch (e){ console.error('[about-figure] mesh:', e); canvas.dataset.failed = '1'; }
  });

  /* The second mesh is loaded the same way and is entirely optional: if it
     never arrives, the figure is a one-mesh figure and nothing else changes.
     It deliberately does NOT set canvas.dataset.ready — that flag means the
     figure can be drawn, and a mask with no face under it cannot. */
  if (INNER_VAR){
    withMesh(INNER_VAR, INNER_SRC, m => {
      if (!m || !m.b64){ console.error('[about-figure] inner mesh empty'); return; }
      try { inner = makeMesh(m); solveInnerFit(); if (outer) bindMesh(outer); }
      catch (e){ console.error('[about-figure] inner mesh:', e); }
    });
  }

  /* ---------------- matrices ------------------------------------------------ */
  const M = {
    perspective(fovy, aspect, near, far){
      const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
      return [f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0];
    },
    lookAt(eye, at, up){
      const z = norm(sub(eye, at)), x = norm(cross(up, z)), y = cross(z, x);
      return [x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0,
              -dot(x,eye), -dot(y,eye), -dot(z,eye), 1];
    },
    /* Y rotation, then a translation and a uniform scale in the model's OWN
       space — which is the order the mask wants: nudge it onto the face once,
       and it stays put however the head turns. Written out rather than
       composed from a generic multiply because it is three numbers and a
       matrix library for three numbers is a dependency, not a convenience. */
    rotYMove(a, tx, ty, tz, k){
      const c = Math.cos(a), s = Math.sin(a);
      return [ k*c, 0, -k*s, 0,
               0,   k, 0,    0,
               k*s, 0, k*c,  0,
               tx*c + tz*s, ty, -tx*s + tz*c, 1 ];
    },
    rotY(a){ const c = Math.cos(a), s = Math.sin(a);
             return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]; },
  };
  const sub = (a,b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
  const dot = (a,b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const norm = a => { const l = Math.hypot(...a) || 1; return [a[0]/l, a[1]/l, a[2]/l]; };

  /* ---------------- silhouette ------------------------------------------------
     The text has to part around the figure's actual OUTLINE, not around a
     fixed-width column — and the outline changes every frame as it turns. So
     the figure is drawn a second time into a tiny offscreen buffer and read
     back, giving the leftmost and rightmost covered pixel per row.

     Small and infrequent on purpose. readPixels is a GPU stall, so this runs
     at SIL_W x SIL_H (48x160 = 30KB) and only every CONFIG.silMs, which is plenty
     for something that moves as slowly as a body rotating. The main canvas is
     never read back — reading an 840x1654 buffer every frame would cost more
     than the whole page. */
  const SIL_W = 48, SIL_H = 160;
  /* Two buffers. `silTarget` is what the last read-back actually saw;
     `silhouette` is what the text reads, and it eases toward the target every
     frame. Without that the outline the copy follows would step whenever a
     read lands — once every 110ms — and the copy would visibly jump sideways
     in time with it. Easing 320 floats is nothing next to a GPU sync, and it
     is what lets the reads be sparse without the motion looking sparse. */
  const silhouette = new Float32Array(SIL_H * 2);   // [l, r] per row, 0..1
  const silTarget  = new Float32Array(SIL_H * 2);
  for (let i = 0; i < SIL_H; i++){
    silhouette[i*2] = silTarget[i*2] = 0.5;
    silhouette[i*2+1] = silTarget[i*2+1] = 0.5;
  }

  let silTex = null, silFbo = null, silDepth = null, silOK = false;
  function buildSilFbo(){
    silTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, silTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIL_W, SIL_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    silFbo = gl.createFramebuffer();
    silDepth = gl.createRenderbuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, silFbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, silTex, 0);
    gl.bindRenderbuffer(gl.RENDERBUFFER, silDepth);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, SIL_W, SIL_H);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, silDepth);
    silOK = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  buildSilFbo();

  /* THE WHOLE GPU SIDE OF THIS FIGURE, in the order it has to happen: the
     program, then its uniform locations (which belong to it), then the
     silhouette's offscreen buffer, then both meshes re-uploaded from the mesh
     globals — those are plain script-tag data and survive, so nothing has to be
     fetched again.

     Called once on a restored context. Everything else about the figure — its
     spin, its tilt, where the pointer is — is ordinary JavaScript state that
     the loss never touched, which is why the figure comes back in the pose it
     went away in rather than snapping to its start angle. */
  function rebuildGL(){
    buildProgram();
    buildUniforms();
    buildSilFbo();
    outer = inner = null; ready = false;
    if (window[MESH_VAR] && window[MESH_VAR].b64){
      try { useOuter(window[MESH_VAR]); }
      catch (e){ console.error('[about-figure] mesh rebuild:', e); }
    }
    if (INNER_VAR && window[INNER_VAR] && window[INNER_VAR].b64){
      try { inner = makeMesh(window[INNER_VAR]); solveInnerFit(); if (outer) bindMesh(outer); }
      catch (e){ console.error('[about-figure] inner mesh rebuild:', e); }
    }
  }

  const guard = window.PAGE.glGuard(canvas, rebuildGL);
  const silPixels = new Uint8Array(SIL_W * SIL_H * 4);
  let silAt = 0, silSpin = -1e9, silTilt = -1e9, silReads = 0;
  let silHits = 0;
  let silhouetteOnly = false;   // see the note in the draw below
  let dormant       = false;
  /* Set by attachTo(). While these hold a framebuffer the visible pass renders
     into it rather than into this module's own canvas, and the canvas is left
     untouched — nothing copies it and nothing reads it. */
  let extFbo = null, extW = 0, extH = 0;
  let blending      = false;   // see the note by the reveal in frame()

  /* Both meshes, outer first. The inner one carries its own model matrix, its
     own tint and its own dequantisation, and then everything is put back — the
     next caller is entitled to find the outer mesh bound, which is the sort of
     assumption that only breaks the second time something is added. */
  const revPts = new Float32Array(REV_PTS * 3);
  function uploadReveal(now){
    const C = CONFIG;
    const two = !!(inner && C.innerOn && C.reveal);
    revPts.fill(0);
    if (two){
      const life = Math.max(0.05, C.revealFade) * 1000;
      let k = 0;
      for (let i = 0; i < strokes.length && k < REV_PTS; i++){
        const age = (now - strokes[i].t) / life;
        if (age >= 1) continue;
        // squared falloff, so a stroke holds and then goes rather than
        // dimming evenly from the moment it is drawn
        revPts[k * 3]     = strokes[i].x;
        revPts[k * 3 + 1] = strokes[i].y;
        revPts[k * 3 + 2] = (1 - age) * (1 - age);
        k++;
      }
    }
    gl.uniform3fv(u.revPts, revPts);
    gl.uniform2f(u.res, w, h);
    gl.uniform1f(u.revRadius, C.revealRadius);
    gl.uniform1f(u.revSoft, C.revealSoft);
    gl.uniform1f(u.revMax, C.revealMax);
    gl.uniform1f(u.revWarp, C.revealWarp);
    gl.uniform1f(u.revWarpScale, C.revealWarpScale);
    gl.uniform1f(u.revWarpSpeed, C.revealWarpSpeed);
    gl.uniform1f(u.revTime, now / 1000);
    gl.uniform1f(u.headOpacity, Math.max(0, Math.min(1, C.headOpacity)));
    gl.uniform1f(u.fresnel, Math.max(0, C.fresnel));
    gl.uniform1f(u.fresnelPow, Math.max(0.1, C.fresnelPower));
    gl.uniform1f(u.revGlow, Math.max(0, C.revealGlow));
    gl.uniform1f(u.revEdge, Math.max(0, Math.min(1, C.revealEdge)));
    gl.uniform1f(u.skullGlow, Math.max(0, C.skullGlow));
    gl.uniform1f(u.flatten, Math.max(0, Math.min(1, C.flatten)));
    gl.uniform1f(u.flatLevel, C.flatLevel === undefined ? 1 : C.flatLevel);
    const rtv = tintVec(C.revealTint);
    gl.uniform3f(u.revTint, rtv[0], rtv[1], rtv[2]);
    return two;
  }

  function drawMeshes(model){
    const two = !!(inner && CONFIG.innerOn && CONFIG.reveal);

    /* THE INNER MESH FIRST, drawn only where the reveal has opened. It is
       underneath, so it goes down first and the outer blends over it — where
       the outer's alpha has been eaten, what is already in the colour buffer
       is the layer below.

       Drawing them the other way round and relying on the depth test cannot
       work: wherever the inner is genuinely inside the outer it would fail the
       depth test at every pixel and never appear at all. */
    if (two) drawInner(model, -1);

    gl.uniform1f(u.revOn, two ? 1 : 0);
    gl.drawElements(gl.TRIANGLES, outer.count, outer.idxType, 0);
    gl.uniform1f(u.revOn, 0);

    if (two || !inner || !CONFIG.innerOn) return;
    drawInner(model, 0);
  }

  function drawInner(model, mode){

    const C = CONFIG;
    const k = (C.innerScale || 1) * (C.innerFit ? innerFitK : 1);
    /* SCALED ABOUT THE FACE'S CENTRE, not about the model origin. The meshes
       are normalised with their feet at y=0, so scaling about the origin also
       drops the mask — at 0.972 by about 3% of the head's height, which is
       exactly enough to push its chin out through the face's and read as a
       modelling error rather than as something worn underneath. Shrinking one
       thing to sit INSIDE another has to be concentric or it is not inside
       anything. The centre is on the Y axis only, so it folds into the Y
       translation and costs nothing. */
    const cy = outer ? outer.bsY : 0.5;
    const im = M.rotYMove(spin + followSpin * Math.PI / 180,
                          C.innerX, C.innerY + (C.innerFit ? innerFitY : cy * (1 - k)), C.innerZ, k);
    gl.uniform1f(u.revOn, mode);
    gl.uniformMatrix4fv(u.model, false, im);
    /* Uniform scale and a rotation, so the normal matrix is the same rotation:
       a uniform scale does not skew a normal, it only changes its length, and
       the shader normalises. */
    gl.uniformMatrix3fv(u.normal, false,
      [model[0], model[1], model[2], model[4], model[5], model[6],
       model[8], model[9], model[10]]);
    const iv = tintVec(C.innerTint);
    gl.uniform3f(u.tint, iv[0], iv[1], iv[2]);
    gl.uniform1f(u.tone, C.innerTone);

    bindMesh(inner);
    gl.drawElements(gl.TRIANGLES, inner.count, inner.idxType, 0);

    gl.uniform1f(u.revOn, 0);
    bindMesh(outer);
    /* The depth-scaled pair, and the normal matrix has to be re-set here: the
       inner draw above overwrote it with the plain rotation. */
    gl.uniformMatrix4fv(u.model, false, modelO || model);
    if (normO) gl.uniformMatrix3fv(u.normal, false, normO);
    const ov = tintVec(C.tint);
    gl.uniform3f(u.tint, ov[0], ov[1], ov[2]);
    gl.uniform1f(u.tone, C.tone);
  }

  function readSilhouette(){
    if (!silOK || !ready || !CONFIG.silMs) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, silFbo);
    gl.viewport(0, 0, SIL_W, SIL_H);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, outer.count, outer.idxType, 0);
    gl.readPixels(0, 0, SIL_W, SIL_H, gl.RGBA, gl.UNSIGNED_BYTE, silPixels);
    silReads++;
    silHits = 0;
    for (let i = 3; i < silPixels.length; i += 4) if (silPixels[i] > 8) silHits++;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);

    for (let y = 0; y < SIL_H; y++){
      // GL rows run bottom-up; the text is laid out top-down
      const src = (SIL_H - 1 - y) * SIL_W * 4;
      let l = -1, r = -1;
      for (let x = 0; x < SIL_W; x++){
        if (silPixels[src + x*4 + 3] > 8){ if (l < 0) l = x; r = x; }
      }
      if (l < 0){ silTarget[y*2] = 0.5; silTarget[y*2+1] = 0.5; }
      else { silTarget[y*2] = l / SIL_W; silTarget[y*2+1] = (r + 1) / SIL_W; }
    }
  }

  /* ---------------- state --------------------------------------------------- */
  /* SEEDED ON THE FIRST FRAME, NOT AT MOUNT. A page's own defaults are written
     by that page's module (js/mask.js), which runs in the same mount pass but
     AFTER this one — so reading startAngle here read it before the page had had
     its say, and the dial did nothing while the panel showed its value. The
     frame loop cannot run until every module in the pass has finished, so
     whoever set it last is the one that decides. */
  let spin = 0, seeded = false, pending = 0, last = performance.now();
  /* The outer mesh's model and normal matrices, rebuilt each frame beside
     the rotation and read by both places the outer mesh is drawn. */
  let modelO = null, normO = null;
  /* POINTER FOLLOW. Kept apart from `spin` and `tiltOffset` rather than added
     into them, because those two are what the drag writes and what the panel
     shows: fold the aim into them and the numbers on the panel start crawling
     whenever the mouse moves, and letting go of the model would leave it
     wherever the pointer happened to be. These are an offset the renderer
     applies and nothing else can see. */
  let ptrX = 0, ptrY = 0, followSpin = 0, followTilt = 0;
  /* The lean's own pair — separate from ptrX/ptrY, which only move while
     `follow` is on. The two effects are independent. */
  let wantLX = 0, wantLY = 0, leanX = 0, leanY = 0;
  /* Where the pointer has been on THIS canvas, newest first, in its own 0..1.
     Ten is the shader's array length; past that the oldest is dropped, which
     is also what bounds how long a stroke can linger however high revealFade
     goes — a limit worth knowing about rather than discovering. */
  const strokes = [];
  let lastStroke = 0;
  let progress = 0;          // 0..1 through one pass of the text, from about-text
  const on = window.PAGE.bindings();

  /* The About page drives its own scroll rather than the document's: body is
     overflow:hidden site-wide, and the text column and the figure have to read
     from the same number anyway. js/about-text.js owns it and publishes it. */
  /* Aim is read off the CANVAS box, not the window: the figure is a 420px
     column on About and full-bleed on the mask page, and "the pointer is at
     the right-hand edge" has to mean the edge of the thing being looked at. */
  on(window, 'pointermove', e => {
    if (!CONFIG.follow) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    ptrX = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)));
    ptrY = Math.max(-1, Math.min(1, ((r.top + r.height / 2) - e.clientY) / (r.height / 2)));
  });

  on(window, 'pointermove', e => {
    if (!CONFIG.mouseGain) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    wantLX = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)));
    wantLY = Math.max(-1, Math.min(1, ((r.top + r.height / 2) - e.clientY) / (r.height / 2)));
  });
  /* Back to the middle when the pointer leaves the window — unlike `follow`,
     which holds its last aim on purpose for touch. A held aim is a model
     facing somewhere; a held lean is a camera quietly off its mark. */
  on(document, 'pointerleave', () => { wantLX = 0; wantLY = 0; });

  /* The reveal wants the pointer wherever it is on the canvas, whether or not
     the figure is following it, so it is its own listener rather than a branch
     inside the one above. */
  on(window, 'pointermove', e => {
    if (!CONFIG.reveal) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = (e.clientX - r.left) / r.width;
    const y = 1 - (e.clientY - r.top) / r.height;   // GL's y runs up
    if (x < -0.2 || x > 1.2 || y < -0.2 || y > 1.2) return;
    const now = performance.now();
    if (now - lastStroke < Math.max(4, CONFIG.revealEvery)) return;
    lastStroke = now;

    /* SAMPLED BY DISTANCE, not only by time. Time alone spends the whole
       fourteen-mark budget in a fifth of a second on a fast mouse, so the
       stroke that lingers is a quarter-second of travel rather than the arc
       you actually drew — and a pointer sitting still burns the budget on
       fourteen marks in the same spot.

       So a new mark needs the pointer to have MOVED, and when it has not the
       newest mark's clock is reset instead: hold still and the hole stays
       open under you, sweep and it lays a trail the length of the sweep. */
    const head = strokes[0];
    const step = Math.max(0.02, CONFIG.revealStep) * Math.max(CONFIG.revealRadius, 1e-4);
    if (head && Math.hypot(x - head.x, y - head.y) < step){ head.t = now; return; }

    strokes.unshift({ x, y, t: now });
    while (strokes.length > REV_PTS) strokes.pop();
  });
  /* Pointer gone: come back to centre if asked, or hold the last aim. Holding
     is the honest default for a touch screen, where there IS no pointer. */
  on(document, 'pointerleave', () => {
    if (CONFIG.follow && CONFIG.followCentre){ ptrX = 0; ptrY = 0; }
  });

  scope.addEventListener('about:scroll', e => {
    pending += e.detail.delta * CONFIG.scrollTurn;
    if (typeof e.detail.travel === 'number'){
      progress = Math.max(0, Math.min(1, e.detail.travel / (CONFIG.tiltOverPx || 1)));
    }
  });

  let dpr = 1, w = 0, h = 0;
  /* THE BREAKPOINT LIVES IN CSS, AND THIS READS WHAT CSS DECIDED.

     The phone frame wants a figure a third of the viewport tall where the
     desktop wants nearly half, and that is a breakpoint — so it belongs in
     css/mobile.css with every other one, not in a matchMedia here that would
     be a second copy of the same 720px to keep in step. js/about-text.js
     already does exactly this with --fig-w; this is the same idea for the
     other axis.

     READ IN measure() AND CACHED, never per frame: getComputedStyle forces
     style resolution, solveCamera runs every frame, and measure() already runs
     on exactly the event that can change the answer — a resize.

     An unset property parses to NaN and falls back to CONFIG.height, so the
     console dial stays live on every page and every width that does not set
     it, which is all of them but one. */
  let cssHeight = 0;
  function measure(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width * dpr));
    h = Math.max(1, Math.round(r.height * dpr));
    canvas.width = w; canvas.height = h;
    gl.viewport(0, 0, w, h);
    cssHeight = parseFloat(
      getComputedStyle(canvas).getPropertyValue('--fig-height')) || 0;
  }
  measure();
  let rt; on(window, 'resize', () => { clearTimeout(rt); rt = setTimeout(measure, 150); });


  /* THE CAMERA SOLVE, IN ONE PLACE.

     js/about-xray.js used to carry its own copy of this — the same trig, the
     centre hardcoded as 0.5, and the eye orbiting a point it was not actually
     looking at. Which was fine until this one changed: `contain` framing
     landed here and not there, so the figure fitted the frame with the x-ray
     off and was cut with it on. Two renderers deriving the same camera
     independently will always drift the moment one of them is touched, so
     there is now one function and the other module calls it.

     Published as FIGURE.camera(aspect). Takes the aspect because the two
     canvases are not always the same size.

     TWO FRAMING MODES.

     'height' — the original: the figure occupies CONFIG.height of the viewport
     HEIGHT. Simple, and what About wants, but it says nothing about width and
     nothing stops height going past 1 — at which point the figure is larger
     than the screen and the screen cuts it.

     'contain' — solve so the whole bounding sphere is inside the frustum on
     BOTH axes. A sphere of radius r is fully visible at r / sin(halfAngle),
     and the binding axis is whichever half-angle is smaller, so taking the min
     of the two covers portrait and landscape alike. CONFIG.height then means
     the share of the frame the figure fills. */
  function solveCamera(aspect){
    const fov = CONFIG.fov * Math.PI / 180;
    /* Resolved once, and every read below is of THIS rather than of
       CONFIG.height — the same lesson gridSize() in js/work-grid.js records
       twice over: one quantity, one place it is computed. */
    const H = Math.max(cssHeight || CONFIG.height, 0.01);
    /* One tilt, computed once. It used to be derived in two places inside this
       function — the containment fit and the eye placement — which was fine
       only while nothing else contributed to it. tiltOffset does, so a second
       copy would have fitted the frame for one elevation and looked from
       another. Clamped short of the poles because at exactly 90 the up vector
       and the view direction are parallel and lookAt has no basis to build. */
    const tiltDeg = Math.max(-89, Math.min(89,
      CONFIG.tiltStart + (CONFIG.tiltEnd - CONFIG.tiltStart) * progress +
      CONFIG.tiltOffset + followTilt));
    let dist;
    if (CONFIG.fit === 'contain'){
      const halfY = fov / 2;
      const halfX = Math.atan(Math.tan(halfY) * Math.max(aspect, 0.01));
      /* Clamped at 1 and padded. Both learned by measuring the border pixels
         of the rendered frame: height above 1 means "fill more than the
         frame", which cuts by definition, and height of exactly 1 still put 74
         pixels on the border because the silhouette antialiases past the
         boundary. */
      const fill = Math.min(1, H) *
                   (1 - Math.max(0, Math.min(0.5, CONFIG.fitPad)));

      /* Exact fit of the bounding cylinder at THIS tilt.

         For a camera at distance d along its own backward axis w, a point p
         sits inside the frustum when |p·u| <= depth*tanX and |p·v| <=
         depth*tanY, where depth = d - p·w. Solving each for d gives

             d >= p·w + |p·u| / tanX      and      d >= p·w + |p·v| / tanY

         so the answer is the largest of those over the silhouette. Sampling
         the cylinder's rim at 16 azimuths and both ends covers it, and because
         the whole ring is sampled the result does not change as the model
         spins — which is the property a per-frame bounding BOX would lose, and
         it would show as the model breathing in and out as it turned. */
      const tiltR = tiltDeg * Math.PI / 180;
      const st = Math.sin(tiltR), ct = Math.cos(tiltR);
      const tanX = Math.tan(halfX), tanY = Math.tan(halfY);
      const ay = bsY - CONFIG.offsetY * (1 / H);
      const ax = -CONFIG.offsetX * (1 / H);
      let need = 0;
      for (let k = 0; k < 16; k++){
        const a = k * Math.PI / 8;
        const px = Math.cos(a) * cylR - ax, pz = Math.sin(a) * cylR;
        for (let e = 0; e < 2; e++){
          const py = (e ? cylMaxY : cylMinY) - ay;
          const pu = px;                       // camera right is world +X
          const pv = py * ct - pz * st;        // camera up
          const pw = py * st + pz * ct;        // camera backward
          const d1 = pw + Math.abs(pu) / tanX;
          const d2 = pw + Math.abs(pv) / tanY;
          if (d1 > need) need = d1;
          if (d2 > need) need = d2;
        }
      }
      dist = Math.max(need, 1e-3) / fill;
    } else {
      dist = (1 / H) / (2 * Math.tan(fov / 2));
    }
    const t = tiltDeg * Math.PI / 180;
    /* `at` first, then the eye placed relative to it. Orbiting a point the
       camera is not looking at is how offsetY slid the subject out of frame
       instead of moving it. */
    /* Both offsets are in viewport heights and move the SUBJECT, not the
       camera, which is why they are negated into `at`: sliding the look-at
       point right carries the subject left. Scaled by 1/height so a given
       offset means the same fraction of the frame whatever the framing. */
    const k = 1 / H;
    let at  = [-CONFIG.offsetX * k, bsY - CONFIG.offsetY * k,
               -CONFIG.offsetZ * k];
    let eye = [at[0], at[1] + Math.sin(t) * dist, at[2] + Math.cos(t) * dist];

    /* THE LEAN, in the camera's own axes and not the world's: nudged along a
       world axis it would slide sideways at one tilt and forwards at another,
       which is not a camera. Scaled by `dist` so the step is a share of the
       FRAME — at a long lens the eye is further out and has to move further to
       shift the picture by the same amount. */
    if (CONFIG.mouseGain){
      const g = CONFIG.mouseGain;
      const zc = norm(sub(eye, at));
      const xc = norm(cross([0, 1, 0], zc));
      const yc = cross(zc, xc);
      const dx = leanX * CONFIG.mouseX * g * dist;
      const dy = leanY * CONFIG.mouseY * g * dist;
      const off = [xc[0]*dx + yc[0]*dy, xc[1]*dx + yc[1]*dy, xc[2]*dx + yc[2]*dy];
      const keep = 1 - Math.max(0, Math.min(1, CONFIG.mouseTurn));
      eye = [eye[0] + off[0], eye[1] + off[1], eye[2] + off[2]];
      at  = [at[0] + off[0]*keep, at[1] + off[1]*keep, at[2] + off[2]*keep];
    }
    /* THE PITCH, LAST, AND ON `at` ALONE. Everything above has placed the eye;
       this only re-aims it. The look-at point is swung around the eye on the
       camera's own right axis — Rodrigues, so the focus distance is preserved
       and the roll cannot drift — which is the definition of a camera that
       looks up without moving.

       It has to be last for the same reason the lean is second-to-last: the
       'contain' fit solves the distance for an UNPITCHED frustum, so pitching
       first would have had the fit chasing its own result. Pitching after
       means the fit frames the body as if you were looking straight at it and
       the pitch then decides which part of that frame you are pointed at,
       which is the behaviour you can reason about from a dial. */
    if (CONFIG.pitch){
      const a  = CONFIG.pitch * Math.PI / 180;
      const f  = sub(at, eye);                   // the look vector, length kept
      const zc = norm(sub(eye, at));             // camera backward
      const xc = norm(cross([0, 1, 0], zc));     // camera right — the hinge
      const ca = Math.cos(a), sa = Math.sin(a);
      const d  = xc[0]*f[0] + xc[1]*f[1] + xc[2]*f[2];
      const cr = cross(xc, f);
      at = [eye[0] + f[0]*ca + cr[0]*sa + xc[0]*d*(1-ca),
            eye[1] + f[1]*ca + cr[1]*sa + xc[1]*d*(1-ca),
            eye[2] + f[2]*ca + cr[2]*sa + xc[2]*d*(1-ca)];
    }

    return { fov, fovDeg: CONFIG.fov, dist, tiltDeg, at, eye };
  }

  function frame(now){
    const dt = Math.min((now - last) / 1000, 0.1); last = now;

    /* DORMANT. Not paused and not destroyed: the context, the buffers and the
       pose all stay exactly where they are, and the loop keeps turning so the
       first frame after waking is a normal frame. It is only the work that
       stops — which matters because the mask page runs TWO of these, and at
       either end of its scroll one of them is drawing a mesh nothing can see.
       Skipping the spin as well is deliberate: a figure that idles on while
       invisible comes back at an angle nobody chose. */
    if (dormant){ raf = requestAnimationFrame(frame); return; }
    /* The context is away. Dormant for a different reason, and handled the same
       way: hold the pose, keep the loop turning, draw nothing. */
    if (guard.lost()){ raf = requestAnimationFrame(frame); return; }

    // continuous approach to whatever the last read-back saw
    const sk = 1 - Math.exp(-dt / Math.max(CONFIG.silEase, 0.001));
    for (let i = 0; i < silhouette.length; i++){
      silhouette[i] += (silTarget[i] - silhouette[i]) * sk;
    }

    if (!seeded){ spin = CONFIG.startAngle * Math.PI / 180; seeded = true; }

    pending += CONFIG.idleSpin * dt;
    const step = pending * CONFIG.followEase;
    if (step){ pending -= step; spin += step * Math.PI / 180; }

    /* Exponential decay against real elapsed time, so the aim settles at the
       same rate on a 60Hz and a 120Hz screen. followSpeed reads as "share of
       the gap closed in a sixtieth of a second", which is the unit the rest of
       this file's easing already uses. */
    /* The lean catches up on a clock, so it settles at the same rate whatever
       the frame rate — the filter the gallery's camera uses. */
    const lk = 1 - Math.exp(-dt / Math.max(0.001, CONFIG.mouseEase));
    leanX += (wantLX - leanX) * lk;
    leanY += (wantLY - leanY) * lk;

    const aimS = CONFIG.follow ? ptrX * CONFIG.followRangeX : 0;
    const aimT = CONFIG.follow ? ptrY * CONFIG.followRangeY : 0;
    const fk = 1 - Math.exp(-dt * 60 * Math.max(0.001, Math.min(1, CONFIG.followSpeed)));
    followSpin += (aimS - followSpin) * fk;
    followTilt += (aimT - followTilt) * fk;

    if (ready){
      /* SILHOUETTE-ONLY MODE. js/about-xray.js draws the figure itself once
         three.js is up, but nothing over there reproduces the outline that
         js/about-text.js shapes every line of the copy around — so this
         renderer stays alive purely to keep feeding it, and skips the visible
         pass. Two full draws of a 250k-triangle mesh per frame would be a real
         cost for a canvas nobody can see; the 48x160 buffer is not. */
      /* SET STATE UNCONDITIONALLY. This used to sit inside the branch below,
         which was wrong in the one mode this page actually runs in: with
         silhouetteOnly on, setState() — the only place the program is bound —
         never ran again after setup, so every uniform written further down
         went to a location belonging to whichever program mask-scroll.js had
         left current. Forty INVALID_OPERATIONs a frame, the values silently
         never arriving, and readSilhouette() drawing last frame's pose. The
         console said "too many errors, no more errors will be reported".
         Binding costs nothing; not binding cost the whole block. */
      setState();

      if (!silhouetteOnly){
        /* readSilhouette() leaves its own 48x160 buffer bound, so the target is
           re-stated here every frame rather than assumed. */
        gl.bindFramebuffer(gl.FRAMEBUFFER, extFbo);
        gl.viewport(0, 0, extFbo ? extW : w, extFbo ? extH : h);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      }

      /* The camera is derived from CONFIG.height so the figure occupies that
         share of the canvas whatever the viewport is: the mesh is normalised
         to exactly one unit tall by the decimator, so the distance that frames
         it is a straight trig solve rather than a magic number. */
      const cam = solveCamera(w / Math.max(h, 1));
      const tiltDeg = cam.tiltDeg;

      gl.uniformMatrix4fv(u.proj, false, M.perspective(cam.fov, w / h, 0.05, 40));
      gl.uniformMatrix4fv(u.view, false, M.lookAt(cam.eye, cam.at, [0, 1, 0]));
      const model = M.rotY(spin + followSpin * Math.PI / 180);

      /* THE OUTER MESH'S OWN PAIR, rotation with the depth scale folded in.
         Column-major, so multiplying the THIRD COLUMN by d is exactly R * S
         with S = diag(1, 1, d): the scale happens in the model's own space and
         the rotation then carries it, which is what makes this a thickness
         rather than a stretch toward the camera.

         The normal matrix is the inverse transpose, and for R * S with R
         orthonormal that is R * S-inverse — the same column DIVIDED by d
         instead of multiplied. Written as /(d*d) because the column has
         already been multiplied once above. Skip it at d = 1 and the two
         matrices are the same object as before. */
      const d = Math.max(0.01, CONFIG.depth || 1);
      modelO = model;
      if (d !== 1){
        modelO = model.slice();
        modelO[8] *= d; modelO[9] *= d; modelO[10] *= d;
      }
      normO = [modelO[0], modelO[1], modelO[2],
               modelO[4], modelO[5], modelO[6],
               modelO[8] / (d * d), modelO[9] / (d * d), modelO[10] / (d * d)];

      gl.uniformMatrix4fv(u.model, false, modelO);
      gl.uniformMatrix3fv(u.normal, false, normO);

      gl.uniform3f(u.qmin, qmin[0], qmin[1], qmin[2]);
      gl.uniform3f(u.qspan, qspan[0], qspan[1], qspan[2]);

      /* THE BREATH, ONCE FOR THE FRAME. It is program state, not per-mesh, so
         the inner layer picks up the same numbers when it is drawn a few lines
         further down and stays inside the hand it belongs to. On a clock
         rather than on the frame count, so it breathes at the same rate on a
         60Hz screen and a 120Hz one. */
      gl.uniform1f(u.breath, CONFIG.breath);
      gl.uniform1f(u.breathT, (performance.now() / 1000) * CONFIG.breathRate * 6.2831853);
      gl.uniform1f(u.breathPhase, CONFIG.breathPhase * Math.PI);
      gl.uniform1f(u.spinOwn, (CONFIG.spinOwn || 0) * Math.PI / 180);
      gl.uniform1f(u.ownCx, CONFIG.ownCx === undefined ? 0 : CONFIG.ownCx);
      gl.uniform1f(u.ownCz, CONFIG.ownCz || 0);

      const tv = tintVec(CONFIG.tint);
      gl.uniform3f(u.tint, tv[0], tv[1], tv[2]);
      gl.uniform3f(u.light, CONFIG.lightX, CONFIG.lightY, CONFIG.lightZ);
      gl.uniform1f(u.ambient, CONFIG.ambient);
      gl.uniform1f(u.diffuse, CONFIG.diffuse);
      gl.uniform1f(u.rim, CONFIG.rim);
      gl.uniform1f(u.tone, CONFIG.tone);
      gl.uniform1f(u.grain, CONFIG.grain);
      gl.uniform1f(u.seed, (now * 0.06) % 1000);

      /* BLENDING, only while there are two layers to blend. The figure is
         opaque everywhere else and turning this on unconditionally would put
         every page's model through the blend unit for nothing — and would let
         the model's own overlapping surfaces blend with each other on any page
         that later gave alpha a meaning. */
      const two = uploadReveal(now);
      if (two !== blending){
        blending = two;
        if (two){ gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); }
        else gl.disable(gl.BLEND);
      }

      /* The uniforms above are set either way — readSilhouette() renders with
         this same program and would otherwise draw with last frame's pose. It
         is only the visible draw that is skipped. */
      if (!silhouetteOnly) drawMeshes(model);

      if (CONFIG.silMs && now - silAt > CONFIG.silMs){
        const deg = spin * 180 / Math.PI;
        if (Math.abs(deg - silSpin) > CONFIG.silEps ||
            Math.abs(tiltDeg - silTilt) > CONFIG.silEps){
          silAt = now; silSpin = deg; silTilt = tiltDeg;
          readSilhouette();
        }
      }
    }
    raf = requestAnimationFrame(frame);
  }
  let raf = requestAnimationFrame(frame);

  /* ---- lending this renderer to another context ---------------------------
     WHY THIS EXISTS. Block 02 composites the head by rendering it into its own
     canvas and then copying that canvas into the composite's context as a
     texture, every frame. Two contexts, one copy, and the driver switching
     between them sixty times a second. The tutorial this effect came from does
     the whole thing in ONE context with render targets, and its far heavier
     scene runs at the refresh ceiling — which is the measurement that made
     this worth writing.

     GL OBJECTS DO NOT CROSS CONTEXTS. Programs, buffers and textures belong to
     the context that made them, so attaching is not a matter of swapping a
     variable: everything has to be built again in the new one. rebuildGL()
     already does exactly that — it was written for context loss, which is the
     same problem with a different cause.

     REVERSIBLE ON PURPOSE. detach() puts it back on its own canvas, so a
     failure is a console line away from being undone rather than a reload. */
  function attachTo(extGl, fbo, fw, fh){
    if (!extGl || !fbo) return false;
    try {
      gl = extGl;
      extFbo = fbo; extW = fw; extH = fh;
      rebuildGL();
      setState();
      return !!(prog && ready);
    } catch (e){
      console.error('[about-figure] attachTo failed, staying on own canvas:', e);
      return false;
    }
  }

  window[GLOBAL] = {
    attachTo,
    config: CONFIG,
    /* Live pose, read by js/about-xray.js so its camera is this camera. Two
       renderers deriving the same numbers independently would drift by a frame
       and the hand-over between them would be visible. */
    get spinRad(){ return spin + followSpin * Math.PI / 180; },
    get tiltDeg(){
      /* Includes tiltOffset and the same clamp solveCamera applies, because a
         reader of this wants the elevation the camera is ACTUALLY at, not the
         one the scroll ramp asked for. */
      return Math.max(-89, Math.min(89,
        CONFIG.tiltStart + (CONFIG.tiltEnd - CONFIG.tiltStart) * progress +
        CONFIG.tiltOffset + followTilt));
    },
    setSilhouetteOnly(v){ silhouetteOnly = !!v; },
    setDormant(v){ dormant = !!v; },
    debugReveal(){ return { w, h, pts: Array.from(revPts), n: strokes.length,
                            on: CONFIG.reveal, innerOn: CONFIG.innerOn, hasInner: !!inner }; },
    get dormant(){ return dormant; },
    /* Turn the model, in degrees. Horizontal goes straight into `spin` rather
       than into the eased `pending` queue that idleSpin uses — a drag should
       arrive under the finger, not chase it. Vertical raises or lowers the
       camera through tiltOffset, which solveCamera clamps short of the poles. */
    orbit(dSpinDeg, dTiltDeg){
      spin += (dSpinDeg || 0) * Math.PI / 180;
      CONFIG.tiltOffset = Math.max(-89, Math.min(89,
        CONFIG.tiltOffset + (dTiltDeg || 0)));
    },
    /* Turn each half about its own axis, in degrees. Separate from orbit()
       above because they are different rotations: that one turns the whole
       model about the scene's axis, this one turns each half about its own. */
    orbitOwn(dDeg){ CONFIG.spinOwn = (CONFIG.spinOwn || 0) + (dDeg || 0); },
    resetView(){
      spin = CONFIG.startAngle * Math.PI / 180;
      CONFIG.tiltOffset = 0;
      CONFIG.offsetX = 0; CONFIG.offsetY = 0;
    },
    /* POINT IT SOMEWHERE, NOW. `startAngle` seeds the spin on the first frame
       and is never read again — which is correct for a figure that then drifts
       on its own, and useless as a dial: writing it after that first frame
       changed nothing, silently. The work page's rotation control needs to be
       able to SET the angle rather than the angle it started from, so it says
       so, and the queued idle drift is dropped with it or the figure creeps
       away from the number you just chose. */
    setAngle(deg){
      CONFIG.startAngle = deg;
      spin = deg * Math.PI / 180;
      pending = 0;
      seeded = true;
    },
    /* The one camera solve, so js/about-xray.js frames identically instead of
       reimplementing it. */
    camera(aspect){ return solveCamera(aspect); },
    /* rows of [left, right] in 0..1 of the canvas width, top-down; 0.5/0.5
       means the row is empty. js/about-text.js parts the copy around this. */
    silhouette, silRows: SIL_H,
    apply(){ measure(); },
    readout(){
      return { tris: (count / 3) | 0,
               inner: inner ? `${(inner.count / 3) | 0} tris` : (INNER_VAR ? 'loading' : '—'),
               aim: CONFIG.follow ? `${followSpin.toFixed(1)}° / ${followTilt.toFixed(1)}°` : 'off',
               reveal: !CONFIG.reveal ? 'off'
                     : (!inner ? 'no inner mesh'
                     : `${strokes.length} strokes`),
               spin: `${((spin * 180 / Math.PI) % 360).toFixed(0)}°`,
               canvas: `${w}x${h}`, dpr: dpr.toFixed(1),
               tilt: `${window[GLOBAL].tiltDeg.toFixed(1)}°`,
               sil: silOK ? `on (${silReads})` : 'FBO failed',
               silSaw: `${(100*silHits/(SIL_W*SIL_H)).toFixed(1)}%` };
    },
  };

  return function destroy(){
    cancelAnimationFrame(raf);
    guard.release();
    clearTimeout(rt);
    on.release();
    const ext = gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();          // free the GPU context on navigation
    if (window[GLOBAL] && window[GLOBAL].config === CONFIG) delete window[GLOBAL];
  };
 };
}

window.PAGE.register('about-figure', makeFigure('#aboutFigure', 'FIGURE', false));
/* The mask page's second block. preserveDrawingBuffer is TRUE for it and only
   it: js/mask-scroll.js uploads this canvas as a texture every frame of the
   transition, and without it the browser is free to have cleared the buffer
   after compositing — the upload then reads blank, silently. That is the same
   trap that made an earlier readPixels come back empty. */
window.PAGE.register('about-figure-b', makeFigure('#maskBody', 'FIGURE_B', true, {
  /* TUNED BY EYE, and it went the other way. This arrived as 0.368 — the
     shared 0.46 less a fifth — and the answer on screen was 0.73: with the
     composite's torn edge eating the outside of the head, a fifth smaller read
     as a head that had shrunk away from its own frame rather than a smaller
     one. The number the file wants is the one that looks right in the mask,
     not the one that is 20% of the other renderer's. */
  height: 0.73,
}));
/* THE WORK PAGE'S CORNER FIGURE — the third instance, and the whole reason
   this file is a factory. Same shader, same camera, same mesh loader; it
   differs from About in a canvas, a global, and a smaller cut of the same scan
   named on the canvas itself. Everything around it — where it stands, how big,
   which way it faces, what its colour does to the field behind it — is
   js/figure-host.js, which no-ops on every page but that one. */
/* THE 404'S LEGS. Its own instance, the way block 02's head has one, and this
   time that is correct rather than a mistake: the page is BLOCK 02's room now,
   and block 02 is exactly this — a second stage on this renderer, its mesh
   named on the canvas, with no js/about-xray.js over it.

   (It was a mistake in the version before last, when the page was block 01's
   room. Block 01 is drawn by js/about-xray.js on top of this renderer, and
   that module finds its subject by three literal names — `#aboutFigure`,
   `.about__figure` and `window.FIGURE`. A separate instance under different
   names missed all three, so the page showed this file's plain shaded figure
   with the x-ray missing and no error anywhere. Which renderer a page wants is
   the thing to decide first: block 01 means those three names, block 02 means
   an instance of your own.) */
window.PAGE.register('err-figure', makeFigure('#errFigure', 'FIGURE_ERR', false));

window.PAGE.register('work-figure-gl', makeFigure('#workFigure', 'WFIG', false));
/* THE HOME PAGE'S HUD, in the map box — the fourth instance, and it replaces
   a PNG that was a render of this very mesh. The picture is the same one; the
   difference is that it can no longer go stale, because there is nothing left
   to re-export when the model changes. */
window.PAGE.register('hud-figure-gl', makeFigure('#hudFigure', 'HUDFIG', false));

/* THE STRIP'S FIGURE, the same FIGURE_LITE mesh the work page and the HUD
   already draw — a 32px png beside a vector numeral was the one soft thing in
   the block. ONE instance, not two: the strip is a cluster and a turned copy
   of it, so the upright one owns the live canvas and js/tscroll.js mirrors it
   into the other with a 2d drawImage. A second WebGL context for a 64x128
   picture of the same mesh would be a context spent on nothing. */
window.PAGE.register('ts-figure-gl', makeFigure('#tsFigure', 'TSFIG', false, {
  /* A SILHOUETTE, not a lit model: flat at level 0 is solid black, which is
     what the file draws and what reads at 32x64. The shared default is a lit
     white figure filling 46% of its canvas — correct for the About block it
     was written for, and a small grey smudge here. */
  height: 0.92,
  flatten: 1, flatLevel: 0, tone: 0, tint: '#000000',
}));
/* THE LOGO between block 02's columns — the fifth instance, and the first
   one that is not a person: a flat plate stood up by tools/glb-to-js.py so
   the Y spin this renderer already has turns it like a revolving door. */
window.PAGE.register('logo-figure-gl', makeFigure('#logoFigure', 'LOGOFIG', false));
