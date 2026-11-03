/* ==========================================================================
   mask-scroll.js — the black block turning into a white one, on scroll.

   WHAT THE CASE STUDY ACTUALLY GAVE
   The Igloo Inc. write-up on Awwwards is a case study, not a tutorial: it
   names the stack (three.js, Svelte, GSAP, Vite, Houdini) and it says the
   scene transitions are "a mix of chromatic aberration, tech displacement and
   frost effect". There is no code, no shader, and nothing at all about
   scroll-linked transitions. So what is borrowed here is that one sentence —
   which is a genuinely useful recipe, because it names three operations rather
   than describing a mood — and everything below is written from scratch.

     displacement   multi-octave noise added to the signed distance BEFORE the
                    threshold, so the boundary tears rather than sliding. Same
                    trick as the x-ray's fluid edge, and for the same reason:
                    threshold first and roughen after and you get a wiggly line
                    but never a detached shard.
     aberration     the mask is sampled three times at slightly offset heights,
                    once per channel. Where the three disagree — which is only
                    ever at the boundary — the edge fringes colour, and nowhere
                    else pays for it.
     frost          a Gaussian band riding the displaced boundary, filled with
                    its own noise, so the join has a crystalline crust instead
                    of being a clean cut.

   THE SECOND STYLE — 'sparkle', and the default — is from a screen recording
   of a different site, measured rather than guessed. It is not the iris and it
   is not the sheet: the transition front is a field of small round DOTS that
   eat the outgoing block, with bright flared sparkles riding the leading edge.

     dot pitch      ~9 CSS px, dots about 6 across
     sparkles       top 0.5% of the frame measures 238/255 against a field mean
                    of 79, so roughly three times the field rather than merely
                    lighter
     flare          the brightest dots carry a four-point cross, which is what
                    reads as bloom

   The bloom is drawn rather than blurred. A real bloom needs a bright pass, a
   separable blur and a combine — three render targets — and for POINT sources
   it buys nothing a per-dot halo and cross cannot do in the same pass, at a
   fraction of the fill rate. The halo is an exponential falloff around each
   dot and the cross is two axis-aligned falloffs; both are computed from the
   distance already needed to draw the dot itself.

   It is one full-screen quad in raw WebGL. There is no scene, no camera and no
   mesh, so three.js would add a CDN dependency and nothing else — and would
   make this untestable in the environment it was written in, the way
   js/about-xray.js is.
   ========================================================================== */
window.PAGE.register('mask-scroll', function (scope) {
  'use strict';

  /* The stage is the About block's own root, because on this page block 01 IS
     the About block. That element exists on about.html too, so the second
     block's canvas is what actually decides: no block 02, no transition. The
     first version of this line keyed off the stage alone and quietly mounted
     the whole dissolve on the About page, where it bound the wheel and waited
     for a block that was never coming. */
  const stage = scope.querySelector('#aboutRoot');
  if (!stage || !scope.querySelector('#maskBody')) return;

  const CONFIG = {
    enabled: true,
    /* ---- THE THREE PER-FRAME TEXTURE UPLOADS ----
       This shader composites three other canvases — block 02's head, the ASCII
       ground and the caption layer — and each arrives through a texImage2D of
       a FULL-VIEWPORT canvas, every frame. At a 1512-wide window on a 2x screen
       that is about 5.9 megapixels each, so roughly 18 million pixels pushed
       from CPU to GPU per frame.

       A diagnostic switch, not a feature: js/isolate.js flips it so the cost
       can be measured rather than guessed at. Nothing turns it off in normal
       use — with it off the block composites against nothing and is blank. */
    uploads: true,
    /* ---- ONE CONTEXT INSTEAD OF TWO ----
       OFF BY DEFAULT, and that is the point of it. With this on, the head is
       rendered by js/about-figure.js straight into a framebuffer that lives in
       THIS context, and the per-frame canvas-to-texture copy disappears along
       with the second context and the driver's switch between them.

       Off, everything works exactly as it did. Turn it on from the console —
       MASKSCROLL.config.sharedHead = true; MASKSCROLL.apply() — and a reload
       undoes it. Nothing about the shipped site changes until this default
       does. */
    sharedHead: false,
    /* 'sparkle' is the dot dissolve; 'sheet' is the earlier displaced white
       block. Two programs, compiled once each and selected here, rather than
       one shader branching per pixel. */
    style: 'sheet',

    // ---- scroll ----
    /* ---- the big mark behind everything ----
       assets/big-logo.svg, 1186x1186. It is composited UNDER the ground and
       therefore under the blob and under the head — which is the whole point
       and the reason it is not a DOM layer: the composite is one opaque
       canvas, so anything under it in the document is under an opaque sheet
       and never seen. Being underneath means being underneath in here. */
    bigOn: true,
    /* 1186 IS THE FILE'S OWN NUMBER, in the file's own 1920 frame — so it is
       exactly 1186 at 1920 and keeps its proportion of the page everywhere
       else, the same way capSize and the HUD already work. It was a share of
       the viewport before, which made it full-bleed on a wide screen and a
       different mark on every laptop. */
    bigPx: 1186,
    bigX: 0.5,         // centre across the width, in screen uv
    /* WHERE IT STARTS: the gap between the mark's TOP edge and the top of the
       screen, and 0 means flush with it. Anchored to the TOP on purpose — the
       mark is 1186 tall and most windows are shorter, so measuring from the
       bottom made its starting position depend on the window's height and it
       sat somewhere different on every screen. From the top it is the same
       place on all of them, which is what the design draws. */
    bigTop: 0,         // px from the top of the screen to its top edge
    /* WHEN IT GOES, AND HOW FAR. bigStart is the point in the block's scroll
       where it begins to fall and bigUntil is where it has finished; between
       them it travels bigSpeed screen-heights. Before bigStart it sits still
       at its resting place, which is the whole reason bigStart exists — the
       fall used to begin on the first pixel of scroll, so there was no moment
       where the mark simply WAS.

       Clamped at both ends, and that is what makes the rest work: it is a
       pure function of progress, so scrolling back plays it in reverse for
       free, and past bigUntil it stays put rather than drifting into view
       under the columns. */
    bigSpeed: 1.9,
    bigStart: 0,
    bigUntil: 1,
    bigTurns: 0.5,     // turns across that same window
    bigColour: '#ff0000',
    bigAlpha: 1,

    overPx: 300,       // px of scroll from all-black to all-white
    wheelSpeed: 1.0,
    ease: 0.5,         // seconds to close most of the gap
    from: 'bottom',     // which edge the white block arrives from

    /* ---- displacement ----
       From js/dissolve-look.js, because the work page's cursor blobs are the
       same tear made from a different distance and two copies of these numbers
       would have drifted the first time either was tuned. Spread in rather
       than referenced, so a dial moved here stays here. */
    ...(window.DISSOLVE_LOOK || {}),

    // ---- chromatic aberration ----
    /* Channel separation, in screen heights. 0.018 was the first guess and it
       is 14 pixels — which does not read as chromatic aberration, it reads as
       a cyan stripe painted along the edge. A fringe should be findable, not
       announced. */
    aberration: 0,

    // ---- frost ----
    frostWidth: 0.0,   // how far the crust reaches either side of the boundary
    frostGain: 0.0,
    frostScale: 4.0,
    frostColour: '#ffffff',

    /* THE SECOND BLOCK'S GROUND, top and foot. Not a colour chosen here: it
       is the light pages' own background, `linear-gradient(to bottom, #fff 0%,
       #afafaf 162.59%)` in css/style.css, which over one viewport height ends
       at #CECECE. Reusing the two ends of that ramp is what makes the block
       the same room as PHOTOGRAPHY rather than a white rectangle. */
    white: '#EFEFEF',
    whiteFoot: '#FFFFFF',
    /* 1, AND THE REASON IS NOT THE ONE THAT USED TO BE WRITTEN HERE.

       The old note said this dial could never move because the effect is a
       dither — it buys its greys by trading spatial resolution for tonal
       resolution, so removing pixels collapses the midtones. That reasoning is
       correct about dithers and was still the wrong conclusion here: it was
       written after changing renderScale in this file AND in js/work-cursor.js
       at the same time, then judging one picture. The tones that collapsed
       were the blob's, in work-cursor. Two files changed, one symptom seen,
       and the blame sat on the wrong file for months.

       MEASURED PROPERLY, live domain, second block, full window:

         1.00, silMs 110    71 fps   p95 41.6ms   (5 missed vsyncs)
         0.75, silMs 110    82 fps   p95 33.3ms   (4)
         1.00, silMs 0      81 fps   p95 33.3ms   (4)
         0.75, silMs 0      78 fps   p95 33.3ms   (4)
         0.50, silMs 110    79 fps   p95 41.7ms

       THE LAST TWO ROWS ARE WHY THIS IS 1. The two fixes DO NOT STACK — they
       were relieving the same stall, and p95 snaps to 33.3ms and then will not
       move whatever else is done to it. Killing the silhouette read-back gets
       the whole win on its own and costs nothing visible; dropping resolution
       gets the same win and costs image quality. So the free one ships and
       this one stays home.

       0.5 is also worse than 0.75, so this was never a direction to push in
       anyway — below about 0.75 the magnification back to canvas size costs
       more than the shading saves, and the dot field visibly coarsens.

       The remaining 33.3ms stall is FOUR WHOLE FRAMES, quantised — a periodic
       pipeline stall, not a workload. Suspects, in order: the per-frame
       INVALID_OPERATION storm out of about-figure, and the eleven live WebGL
       contexts this page opens. Neither is a dial. */
    renderScale: 1,

    /* ---- CRT ----
       The same stack the figure wears, and on by default here because the two
       are now the same picture: with the figure on a CRT and the transition
       not, the dissolve was the one surface on the page not behind the glass. */

    crtScanCount: 1200,
    crtScanDepth: 0.0,
    crt: true,
    crtCurvature: 0.0,
    /* 0.35, not the figure's 1.0. The figure's CRT lives on a 420px box where
       1.0 is a gentle falloff at the corners; this canvas is the whole
       viewport, where the same number turns the second block from white to
       dark grey and eats the corners outright. Same treatment, different
       surface, so the same number is not the same look. */
    crtVignette: 0.0,
    crtContrast: 2.0,
    crtSaturation: 2.0,
    /* THE GLASS IS THE TRANSITION'S, NOT THE PAGE'S.
       Everything this canvas draws IS the second block — it is transparent
       over the first — so the grade, the scan lines, the vignette and the
       tube's barrel were all landing on the arriving white and nothing else.
       That is why the block came up mid-grey with a dark crescent bitten out
       of its top edge: the CRT was treating the room, not the screen.

       So the amount ramps off over the last of the scroll. crtHold is how much
       survives once the block has landed — 0 leaves the light page exactly as
       PHOTOGRAPHY renders it; 1 is the old behaviour, glass and all. */
    crtHold: 0.0,
    /* HOW FAR THE GLASS REACHES FROM THE TEARING EDGE, in screen heights.
       This is what makes the change of colour immediate. Ramping the CRT by
       SCROLL — which is what this did first — greys the whole middle of the
       travel, because at half scroll the glass is at full strength across the
       entire arrived block. Anchoring it to the boundary instead means the
       block is the light page the moment it arrives, and the glass lives on
       the edge that is still moving. */
    crtBand: 0.045,
    /* The tube's barrel is the one part that cannot be per-pixel — it warps
       the coordinate before anything is read, so it needs a single number.
       It flattens over the last of the scroll, which is what stops it biting
       a dark crescent out of a block that should be edge to edge. */
    crtFade: 1.0,

    // ---- sparkle ----
    originX: 0.42,       // where the dissolve starts, in the stage's own uv
    originY: 0.13,
    pitch: 9.0,         // dot spacing in CSS px · measured off the reference
    dot: 0.62,          // dot diameter as a share of the cell
    frontWidth: 0.63,   // how deep the dot band is, as a share of the sweep
    stagger: 0.55,      // per-cell jitter, so the dots do not pop in rows
    /* Displacement and aberration are the SHEET style's controls, reused here
       rather than duplicated under sparkle-specific names. They mean the same
       thing in both — noise added before the threshold, and channel separation
       at the boundary — and two sets of dials for one idea is how a panel
       stops being usable. */
    /* grain also arrives from js/dissolve-look.js above; this line is what it
       means here — per-pixel colour dither, matching the figure's. */
    glowSpread: 1.75,    // halo radius, in dot radii
    glowGain: 0.74,

    flare: 0.48,         // the four-point cross on the brightest dots
    flareLen: 5.7,
    sparkColour: '#FFFFFF',
    sparkGain: 3.35,     // measured: sparkles run ~3x the field

    /* ---- post stack ----
       All OFF by default, so nothing here changes a look that was already
       tuned. Each one is an output-stage operation shared by both styles. */

    lensBarrel: -0.275,     // barrel distortion, separate from the CRT's tube
    lensChroma: 0.0,     // per-channel difference in that distortion
    blurAmt: 0.115,       // motion blur distance, in uv
    blurSteps: 1,        // 1 is off · this is the expensive dial on the panel
    rayGain: 0.0,        // volumetric shafts from the origin
    rayCount: 80.0,
    raySpeed: 0.0,
    rayFall: 0.2,
    rayCol: '#FFF3D6',
    holoGain: 0.0,       // travelling bands, tint and flicker
    holoBands: 300.0,
    holoSpeed: 0.0,
    holoFlicker: 0.0,
    holoTint: '#8FE9FF',
    dissolve: 0.0,       // per-pixel threshold erosion
    dissolveScale: 1.0,

    // ---- the dots themselves ----
    pulseRate: 5.0,     // radians/second
    pulseDepth: 0.35,   // how far the swing goes
    pulsePhase: 1.0,    // 0 the whole field beats as one, 1 each cell alone
    pulseMode: 'both',  // radius / brightness / both
    square: 0.0,        // 0 circle, 1 square · one superellipse, not a switch
    ringWidth: 0.0,     // 0 solid, up to 1 a thin ring
    trail: 1.46,        // where a dot starts to die behind the front
    rings: 0,           // 0 smooth, N quantises the front into N waves
    swirl: 0.0,         // radians of spiral across the screen
    cellRotate: 0.0,    // static rotation of the grid
    jitter: 0.0,        // per-cell offset of the dot inside its cell
  };

  const VERT = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAG_SHEET = `
    precision highp float;
    varying vec2 vUv;
    uniform float uP, uTime, uAspect, uFlip;
    uniform float uDispAmp, uDispScale, uDispDrift, uSoft, uAberr,
                  uFrostWidth, uFrostGain, uFrostScale;
    uniform int uDetail;
    uniform vec3 uWhite, uFrost;
    uniform sampler2D uBlockB;
    uniform float uHasB;
    /* ---- CRT, shared by both styles ----------------------------------------
       The same operations js/about-xray.js applies to the figure. Declared
       once and concatenated into both fragment sources rather than pasted
       twice: it is an output-stage treatment, so it has nothing to do with
       which dissolve is running, and two copies would have drifted the first
       time either was touched. */
    uniform float uCrt, uScanCount, uScanDepth, uCurve, uVig, uCon, uSat;

    /* HOW MUCH GLASS IS ON AT THIS MOMENT. Solved on the CPU (see crtAmount)
       and handed in as one number, because the CRT is the TRANSITION's
       treatment, not the page's: it belongs to the screen that is dying, and
       once the second block has landed there is no screen left to be behind.
       Driving the tube's curvature with it as well is what stops the barrel
       from cutting a dark crescent out of a block that is supposed to be
       edge-to-edge white. */
    uniform float uCrtAmt;

    /* HOW CLOSE THIS PIXEL IS TO THE MOVING EDGE — 1 on the boundary, 0 deep
       inside the block that has already landed. Each style sets it while it is
       working out its own coverage, so it costs nothing: the sheet already has
       the signed distance in hand and the sparkle already has the front.

       It is a global rather than an argument because crt() is the last thing
       in a chain of shared code and threading a value through the post stack
       would mean changing the signature of every stage. With motion blur on,
       several samples run before crt() and the last one wins — which is the
       right answer at the boundary and indistinguishable everywhere else. */
    float gFront = 1.0;
    uniform float uCrtHold, uCrtBand;

    /* THE SECOND BLOCK'S GROUND is not flat white — it is the light pages'
       own background, linear-gradient(to bottom, #fff 0%, #afafaf 162.59%)
       from css/style.css, which over one viewport lands on #CECECE at the
       foot. Painting it flat is what made the second block read as a hole
       rather than as the next room. */
    uniform vec3 uWhiteFoot;
    uniform sampler2D uGround; uniform float uHasGround;
    uniform sampler2D uBig; uniform float uHasBig;
    uniform vec3 uBigCol; uniform vec4 uBigRect;  // x, y, w, h in screen uv
    uniform float uBigA;
    uniform float uBigRot;
    uniform sampler2D uCap; uniform float uHasCap;
    /* THE SCREEN COORDINATE, kept aside before the lens gets hold of it.

       shade() takes its uv as a parameter NAMED vUv, which shadows the varying
       of the same name — so everything inside it, this ground included, was
       being read at the barrel-warped coordinate. On the head that is the
       point: it is one object and the tube should bend it. On the ground it is
       not, because the ground is a REGULAR GRID of characters four pixels
       apart, and warping a regular grid is the one thing that shows: the rows
       curve, the spacing drifts across the frame, and resampling a 4px pitch
       through a curve beats it into moire.

       The work page has no lens over its characters, so this is what stopped
       the two matching. Set once in main() from the true varying, and used for
       the texture lookup only — the ground's own gradient still goes through
       the lens, so the tube's shape is unchanged. */
    vec2 gScreenUv;
    /* THE SECOND BLOCK'S GROUND, WHICH CAN BE A PICTURE.
       It was a two-stop gradient and still is when nothing else is offered.
       When the ASCII layer is running, that canvas IS the ground — sampled
       here, at the very bottom of the composite, so the head is drawn OVER it
       a few lines down rather than beside it.

       This is the only place it could go. Block 02 is not a DOM stack: the
       white block is one canvas that this shader paints, so a layer put
       *underneath* it in the document is underneath an opaque sheet and never
       seen. Being under the head means being under it HERE. */
    vec3 groundB(vec2 uv){
      vec3 g = mix(uWhiteFoot, uWhite, clamp(uv.y, 0.0, 1.0));
      /* THE BIG MARK, FIRST. Before the ground, so the blob draws over it, and
         long before the head. Only its ALPHA is sampled: the file is solid
         black shapes, and taking the colour from a uniform means the mark can
         be the site's red without a second copy of the artwork. */
      if (uHasBig > 0.5){
        /* uBigRect.zw is the HALF size in screen uv — x and y separately, so
           dividing by it lands in a space where one unit across equals one
           unit down whatever the window's aspect is. That is what makes the
           rotation below a rotation rather than a shear. */
        vec2 d = (gScreenUv - uBigRect.xy) / uBigRect.zw;
        float bc = cos(uBigRot), bs = sin(uBigRot);
        d = mat2(bc, -bs, bs, bc) * d;
        vec2 bu = d * 0.5 + 0.5;
        if (bu.x > 0.0 && bu.x < 1.0 && bu.y > 0.0 && bu.y < 1.0){
          float ba = texture2D(uBig, bu).a;
          g = mix(g, uBigCol, clamp(ba * uBigA, 0.0, 1.0));
        }
      }
      if (uHasGround > 0.5){
        vec4 t = texture2D(uGround, gScreenUv);
        g = mix(g, t.rgb, clamp(t.a, 0.0, 1.0));
      }
      return g;
    }

    vec4 crt(vec4 col, vec2 uv){
    #ifndef FX_CRT
      return col;
    #else
      /* The glass belongs to the EDGE, not to the room. uCrtHold is what the
         landed block keeps — 0 leaves it exactly as the light pages render it,
         which is what makes black to white immediate rather than passing
         through grey. */
      float amt = mix(uCrtHold, 1.0, clamp(gFront, 0.0, 1.0));
      if (amt <= 0.0005) return col;
      vec3 rgb = col.rgb;
      float a = col.a;
      // grade: contrast about mid grey, then saturation about luma
      vec3 gr = clamp((rgb - 0.5) * uCon + 0.5, 0.0, 1.0);
      float l = dot(gr, vec3(0.2126, 0.7152, 0.0722));
      gr = clamp(mix(vec3(l), gr, uSat), 0.0, 1.0);
      rgb = mix(rgb, gr, amt);
      /* Scan lines and vignette scale ALPHA as well as colour. This canvas is
         premultiplied over a black page, so darkening colour alone would do
         nothing where there is nothing — cutting coverage is what makes the
         bands read against the ground. */
      float scan = 1.0 - uScanDepth * amt *
                   (0.5 + 0.5 * sin(uv.y * uScanCount * 6.2831853));
      vec2 vd = uv - 0.5;
      float vig = 1.0 - uVig * amt * dot(vd, vd) * 2.0;
      float k = clamp(scan * vig, 0.0, 1.0);
      return vec4(rgb * k, a * k);
    #endif
    }

    /* Barrel distortion, applied to the coordinate BEFORE the dissolve reads
       it, so the dots and the front curve with the tube rather than being
       drawn flat and bent afterwards. */
    vec2 crtWarp(vec2 uv, out bool outside){
      outside = false;
    #ifndef FX_WARP
      return uv;
    #else
      float k = uCurve * uCrtAmt;
      if (k <= 0.0) return uv;
      vec2 d = uv - 0.5;
      vec2 w = 0.5 + d * (1.0 + k * dot(d, d) * 4.0);
      if (w.x < 0.0 || w.x > 1.0 || w.y < 0.0 || w.y > 1.0) outside = true;
      return w;
    #endif
    }


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

    /* Signed distance to the displaced boundary, positive on the white side.
       The noise is added HERE, before any threshold — that is what lets a
       patch be carried across zero and come away as a separate shard. */
    float field(vec2 uv){
      float y = mix(uv.y, 1.0 - uv.y, uFlip);
      /* p=0 puts the edge just BELOW the screen and p=1 just above it, so the
         white fills upward as you scroll. Written the other way round first,
         which made the page start white and clear to black — the readout said
         100% while the screen was empty, because "100% white" and "the edge
         has left the top" are the same number read from opposite ends. */
      float edge = mix(-uDispAmp, 1.0 + uDispAmp, uP);
    #ifndef FX_DISP
      return edge - y;
    #else
      float n = fbm(vec2(uv.x * uAspect, y) * uDispScale +
                    vec2(0.0, uTime * uDispDrift), uDetail) - 0.5;
      return (edge - y) + n * uDispAmp * 2.0;
    #endif
    }

    float maskAt(vec2 uv, float dy){
      return smoothstep(-uSoft, uSoft, field(uv + vec2(0.0, dy)));
    }

    vec4 shade(vec2 vUv){
      /* THREE SAMPLES, ONE PER CHANNEL. They agree everywhere except within a
         few pixels of the boundary, so the fringe costs two extra lookups and
         appears exactly where it should. */
      /* ONE evaluation of the boundary, kept. The centre channel, the frost
         band and the glass all want the same signed distance, and calling
         field() three times for it is three five-octave fbms for one number. */
      float d0 = field(vUv);
      gFront = exp(-abs(d0) / max(uCrtBand, 1e-4));

    #ifdef FX_ABERR
      float mR = maskAt(vUv,  uAberr);
      float mG = smoothstep(-uSoft, uSoft, d0);
      float mB = maskAt(vUv, -uAberr);
    #else
      /* With the fringe at zero the three were three IDENTICAL evaluations of
         a five-octave fbm — ten wasted octaves a pixel, which was most of what
         this shader cost. */
      float mG = smoothstep(-uSoft, uSoft, d0);
      float mR = mG, mB = mG;
    #endif

      /* THE BLOCK HAS TO CLOSE. The displaced boundary reaches the top of the
         frame with its deepest tear at exactly zero, so at full scroll a few
         pixels along that edge sit at half coverage — and "totally white" with
         a row of dark speckle in it is not totally white. The last of the
         scroll shuts whatever the noise left open. */
      float seal = smoothstep(0.985, 1.0, uP);
      mR = max(mR, seal); mG = max(mG, seal); mB = max(mB, seal);

      float a = max(mR, max(mG, mB));
      if (a <= 0.001) return vec4(0.0);
      /* THE SECOND BLOCK, exactly as the sparkle style composites it. Wiring
         it into only one of the two styles is what made the body vanish the
         moment the style was switched to sheet — the block was there, the
         renderer was running, and nothing sampled it. */
      vec3 ground = groundB(vUv);
      /* THE CAPTION, between the ground and the head — which is the whole
         reason it is here rather than in the DOM. The white block is one
         canvas this shader paints, so anything layered under it in the
         document is under an opaque sheet; "behind the 3D but over the
         characters" is a position in THIS composite and nowhere else.

         Read at gScreenUv for the same reason the ground is: it is flat type
         on a flat plane, and pulling it through the barrel would bend a
         straight baseline. */
      if (uHasCap > 0.5){
        vec4 tc = texture2D(uCap, gScreenUv);
        ground = mix(ground, tc.rgb, clamp(tc.a, 0.0, 1.0));
      }
      vec3 blockB = ground;
      if (uHasB > 0.5){
        vec4 tb = texture2D(uBlockB, vUv);
        blockB = mix(ground, tb.rgb, clamp(tb.a, 0.0, 1.0));
      }
      // normalised by the strongest channel, so the body stays white and only
      // the disagreement at the edge carries colour
      vec3 rgb = blockB * (vec3(mR, mG, mB) / a);

    #ifdef FX_FROST
      /* FROST. A Gaussian band on the displaced distance — it follows every
         shard rather than lying across the screen in a straight line. It costs
         three more octaves, so with the gain at zero it is compiled out rather
         than multiplied by nothing. */
      float band = exp(-(d0 * d0) / max(uFrostWidth * uFrostWidth, 1e-6));
      float f = fbm(vec2(vUv.x * uAspect, vUv.y) * uFrostScale +
                    vec2(0.0, uTime * 0.05), 3);
      float crust = band * f * uFrostGain;
      rgb = mix(rgb, uFrost, clamp(crust, 0.0, 1.0));
      a = clamp(a + crust * 0.85, 0.0, 1.0);
    #endif

      return vec4(clamp(rgb, 0.0, 1.0), a);
    }


    /* ---- POST, shared by both styles ---------------------------------------
       Everything below runs on the OUTPUT of whichever dissolve is drawing, so
       none of it knows or cares which one that is. Same reason the CRT block
       above is concatenated rather than pasted: it is an output stage, and two
       copies drift.

       Its own noise helpers, deliberately named apart from each shader's, so
       concatenating cannot collide with the ones already there. */
    uniform float uLensBarrel, uLensChroma, uBlurAmt, uRayGain, uRayCount,
                  uRaySpeed, uRayFall, uHoloGain, uHoloBands, uHoloSpeed,
                  uHoloFlicker, uDissolve, uDissolveScale;
    uniform int uBlurSteps;
    uniform vec3 uHoloTint, uRayCol;
    uniform vec2 uPostOrigin;

    float hashP(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float vnoiseP(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hashP(i), hashP(i + vec2(1,0)), u.x),
                 mix(hashP(i + vec2(0,1)), hashP(i + vec2(1,1)), u.x), u.y);
    }
    float fbmP(vec2 p){
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 3; i++){ v += a * vnoiseP(p); p *= 2.03; a *= 0.5; }
      return v;
    }

    /* LENS. Barrel distortion with a per-channel difference, which is what
       makes it a lens rather than a warp: real glass refracts the three
       wavelengths by different amounts, so the chroma has to come from
       sampling at three different DISTORTIONS, not from offsetting the result. */
    vec2 lensAt(vec2 uv, float k, out bool outside){
      outside = false;
      vec2 d = uv - 0.5;
      vec2 w = 0.5 + d * (1.0 + k * dot(d, d) * 4.0);
      if (w.x < 0.0 || w.x > 1.0 || w.y < 0.0 || w.y > 1.0) outside = true;
      return w;
    }

    vec4 sampleLens(vec2 uv){
    #ifndef FX_LENS
      return shade(uv);
    #else
      bool o1;
    #ifdef FX_CHROMA
      {
        bool o2, o3;
        vec2 uR = lensAt(uv, uLensBarrel + uLensChroma, o1);
        vec2 uG = lensAt(uv, uLensBarrel,               o2);
        vec2 uB = lensAt(uv, uLensBarrel - uLensChroma, o3);
        vec4 cR = o1 ? vec4(0.0) : shade(uR);
        vec4 cG = o2 ? vec4(0.0) : shade(uG);
        vec4 cB = o3 ? vec4(0.0) : shade(uB);
        return vec4(cR.r, cG.g, cB.b, max(cR.a, max(cG.a, cB.a)));
      }
    #endif
      vec2 u = lensAt(uv, uLensBarrel, o1);
      return o1 ? vec4(0.0) : shade(u);
    #endif
    }

    void main(){
      gScreenUv = vUv;   // before the lens; see the note above
      bool outside;
      vec2 base = crtWarp(vUv, outside);
      if (outside){ gl_FragColor = vec4(0.0); return; }

      /* MOTION BLUR. The whole dissolve is re-evaluated along the direction it
         is travelling — radially away from the origin — and averaged. It is
         the expensive control on this panel by a wide margin, which is why it
         is steps rather than a smooth amount: the cost is exactly the number
         of taps and nothing hides that. */
    #ifndef FX_BLUR
      vec4 col = sampleLens(base);
    #else
      int steps = uBlurSteps < 1 ? 1 : (uBlurSteps > 6 ? 6 : uBlurSteps);
      vec2 away = base - uPostOrigin;
      vec2 dir = (length(away) > 1e-5 ? normalize(away) : vec2(0.0, 1.0)) * uBlurAmt;

      vec4 col = vec4(0.0);
      float wsum = 0.0;
      for (int i = 0; i < 6; i++){
        if (i >= steps) break;
        float f = (steps == 1) ? 0.0 : (float(i) / float(steps - 1) - 0.5);
        col += sampleLens(base - dir * f);
        wsum += 1.0;
      }
      col /= max(wsum, 1e-4);
    #endif

      /* VOLUMETRIC. Shafts from the same origin, banded by angle so they read
         as rays rather than as a glow, and falling off with distance so they
         belong to the source. Cheap on purpose: a true volumetric marches the
         mask along each ray, which is another six taps on top of the blur's. */
    #ifdef FX_RAYS
      if (uRayGain > 0.0001){
        vec2 rd = base - uPostOrigin;
        float ang = atan(rd.y, rd.x);
        float dist = length(rd);
        float r = fbmP(vec2(ang * uRayCount, uTime * uRaySpeed));
        float shaft = pow(max(r, 0.0), 2.5) * exp(-dist * uRayFall);
        col.rgb += uRayCol * shaft * uRayGain;
        col.a = clamp(col.a + shaft * uRayGain * 0.6, 0.0, 1.0);
      }
    #endif

      /* HOLOGRAM. Travelling bands, a tint, and a flicker held for a few
         frames at a time rather than per frame — a per-frame flicker at 60Hz
         reads as noise, not as an unstable projection. */
    #ifdef FX_HOLO
      if (uHoloGain > 0.0001){
        float band = 0.5 + 0.5 * sin((base.y * uHoloBands - uTime * uHoloSpeed) * 6.2831853);
        float held = floor(uTime * 12.0);
        float flick = 1.0 - uHoloFlicker * hashP(vec2(held, 3.7));
        vec3 h = mix(col.rgb, uHoloTint, 0.65) * (0.72 + 0.4 * band) * flick;
        col.rgb = mix(col.rgb, h, uHoloGain);
      }
    #endif

      /* DISSOLVE. A per-pixel threshold against a hash, so the layer erodes
         into speckle rather than fading. Quantised to blocks by scale, and
         weighted toward the edge — eroding the solid interior as hard as the
         boundary just punches holes in a finished block. */
    #ifdef FX_DISSOLVE
      if (uDissolve > 0.0001){
        vec2 dp = floor(gl_FragCoord.xy / max(uDissolveScale, 1.0));
        float n = hashP(dp);
        float edgeBias = mix(1.0, 0.35, smoothstep(0.75, 1.0, col.a));
        col.a *= step(uDissolve * edgeBias, n);
      }
    #endif

      gl_FragColor = crt(col, base);
    }
`;

  const FRAG_SPARK = `
    precision highp float;
    varying vec2 vUv;
    uniform float uP, uTime, uAspect, uPxPitch, uDot, uFrontW, uStagger,
                  uDispAmp, uDispScale, uDispDrift, uGlowSpread, uGlowGain,
                  uFlare, uFlareLen, uSparkGain, uAberr, uGrain,
                  uPulseRate, uPulseDepth, uPulsePhase, uPulseMode,
                  uSquare, uRingW, uTrail, uRings, uSwirl, uCellRot, uJitter;
    uniform int uDetail;
    uniform vec2 uRes, uOrigin;
    uniform vec3 uWhite, uSpark;
    uniform sampler2D uBlockB;
    uniform float uHasB;
    /* ---- CRT, shared by both styles ----------------------------------------
       The same operations js/about-xray.js applies to the figure. Declared
       once and concatenated into both fragment sources rather than pasted
       twice: it is an output-stage treatment, so it has nothing to do with
       which dissolve is running, and two copies would have drifted the first
       time either was touched. */
    uniform float uCrt, uScanCount, uScanDepth, uCurve, uVig, uCon, uSat;

    /* HOW MUCH GLASS IS ON AT THIS MOMENT. Solved on the CPU (see crtAmount)
       and handed in as one number, because the CRT is the TRANSITION's
       treatment, not the page's: it belongs to the screen that is dying, and
       once the second block has landed there is no screen left to be behind.
       Driving the tube's curvature with it as well is what stops the barrel
       from cutting a dark crescent out of a block that is supposed to be
       edge-to-edge white. */
    uniform float uCrtAmt;

    /* HOW CLOSE THIS PIXEL IS TO THE MOVING EDGE — 1 on the boundary, 0 deep
       inside the block that has already landed. Each style sets it while it is
       working out its own coverage, so it costs nothing: the sheet already has
       the signed distance in hand and the sparkle already has the front.

       It is a global rather than an argument because crt() is the last thing
       in a chain of shared code and threading a value through the post stack
       would mean changing the signature of every stage. With motion blur on,
       several samples run before crt() and the last one wins — which is the
       right answer at the boundary and indistinguishable everywhere else. */
    float gFront = 1.0;
    uniform float uCrtHold, uCrtBand;

    /* THE SECOND BLOCK'S GROUND is not flat white — it is the light pages'
       own background, linear-gradient(to bottom, #fff 0%, #afafaf 162.59%)
       from css/style.css, which over one viewport lands on #CECECE at the
       foot. Painting it flat is what made the second block read as a hole
       rather than as the next room. */
    uniform vec3 uWhiteFoot;
    uniform sampler2D uGround; uniform float uHasGround;
    uniform sampler2D uBig; uniform float uHasBig;
    uniform vec3 uBigCol; uniform vec4 uBigRect;  // x, y, w, h in screen uv
    uniform float uBigA;
    uniform float uBigRot;
    uniform sampler2D uCap; uniform float uHasCap;
    /* THE SCREEN COORDINATE, kept aside before the lens gets hold of it.

       shade() takes its uv as a parameter NAMED vUv, which shadows the varying
       of the same name — so everything inside it, this ground included, was
       being read at the barrel-warped coordinate. On the head that is the
       point: it is one object and the tube should bend it. On the ground it is
       not, because the ground is a REGULAR GRID of characters four pixels
       apart, and warping a regular grid is the one thing that shows: the rows
       curve, the spacing drifts across the frame, and resampling a 4px pitch
       through a curve beats it into moire.

       The work page has no lens over its characters, so this is what stopped
       the two matching. Set once in main() from the true varying, and used for
       the texture lookup only — the ground's own gradient still goes through
       the lens, so the tube's shape is unchanged. */
    vec2 gScreenUv;
    /* THE SECOND BLOCK'S GROUND, WHICH CAN BE A PICTURE.
       It was a two-stop gradient and still is when nothing else is offered.
       When the ASCII layer is running, that canvas IS the ground — sampled
       here, at the very bottom of the composite, so the head is drawn OVER it
       a few lines down rather than beside it.

       This is the only place it could go. Block 02 is not a DOM stack: the
       white block is one canvas that this shader paints, so a layer put
       *underneath* it in the document is underneath an opaque sheet and never
       seen. Being under the head means being under it HERE. */
    vec3 groundB(vec2 uv){
      vec3 g = mix(uWhiteFoot, uWhite, clamp(uv.y, 0.0, 1.0));
      /* THE BIG MARK, FIRST. Before the ground, so the blob draws over it, and
         long before the head. Only its ALPHA is sampled: the file is solid
         black shapes, and taking the colour from a uniform means the mark can
         be the site's red without a second copy of the artwork. */
      if (uHasBig > 0.5){
        /* uBigRect.zw is the HALF size in screen uv — x and y separately, so
           dividing by it lands in a space where one unit across equals one
           unit down whatever the window's aspect is. That is what makes the
           rotation below a rotation rather than a shear. */
        vec2 d = (gScreenUv - uBigRect.xy) / uBigRect.zw;
        float bc = cos(uBigRot), bs = sin(uBigRot);
        d = mat2(bc, -bs, bs, bc) * d;
        vec2 bu = d * 0.5 + 0.5;
        if (bu.x > 0.0 && bu.x < 1.0 && bu.y > 0.0 && bu.y < 1.0){
          float ba = texture2D(uBig, bu).a;
          g = mix(g, uBigCol, clamp(ba * uBigA, 0.0, 1.0));
        }
      }
      if (uHasGround > 0.5){
        vec4 t = texture2D(uGround, gScreenUv);
        g = mix(g, t.rgb, clamp(t.a, 0.0, 1.0));
      }
      return g;
    }

    vec4 crt(vec4 col, vec2 uv){
    #ifndef FX_CRT
      return col;
    #else
      /* The glass belongs to the EDGE, not to the room. uCrtHold is what the
         landed block keeps — 0 leaves it exactly as the light pages render it,
         which is what makes black to white immediate rather than passing
         through grey. */
      float amt = mix(uCrtHold, 1.0, clamp(gFront, 0.0, 1.0));
      if (amt <= 0.0005) return col;
      vec3 rgb = col.rgb;
      float a = col.a;
      // grade: contrast about mid grey, then saturation about luma
      vec3 gr = clamp((rgb - 0.5) * uCon + 0.5, 0.0, 1.0);
      float l = dot(gr, vec3(0.2126, 0.7152, 0.0722));
      gr = clamp(mix(vec3(l), gr, uSat), 0.0, 1.0);
      rgb = mix(rgb, gr, amt);
      /* Scan lines and vignette scale ALPHA as well as colour. This canvas is
         premultiplied over a black page, so darkening colour alone would do
         nothing where there is nothing — cutting coverage is what makes the
         bands read against the ground. */
      float scan = 1.0 - uScanDepth * amt *
                   (0.5 + 0.5 * sin(uv.y * uScanCount * 6.2831853));
      vec2 vd = uv - 0.5;
      float vig = 1.0 - uVig * amt * dot(vd, vd) * 2.0;
      float k = clamp(scan * vig, 0.0, 1.0);
      return vec4(rgb * k, a * k);
    #endif
    }

    /* Barrel distortion, applied to the coordinate BEFORE the dissolve reads
       it, so the dots and the front curve with the tube rather than being
       drawn flat and bent afterwards. */
    vec2 crtWarp(vec2 uv, out bool outside){
      outside = false;
    #ifndef FX_WARP
      return uv;
    #else
      float k = uCurve * uCrtAmt;
      if (k <= 0.0) return uv;
      vec2 d = uv - 0.5;
      vec2 w = 0.5 + d * (1.0 + k * dot(d, d) * 4.0);
      if (w.x < 0.0 || w.x > 1.0 || w.y < 0.0 || w.y > 1.0) outside = true;
      return w;
    #endif
    }


    float hash1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float vnoise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash1(i), hash1(i + vec2(1,0)), u.x),
                 mix(hash1(i + vec2(0,1)), hash1(i + vec2(1,1)), u.x), u.y);
    }
    float fbm2(vec2 p, int oct){
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 6; i++){
        if (i >= oct) break;
        v += a * vnoise(p); p *= 2.03; a *= 0.5;
      }
      return v;
    }

    vec4 shade(vec2 vUv){
      vec2 a = vec2(uAspect, 1.0);
      vec2 pos = vUv * a, org = uOrigin * a;

      /* DISPLACEMENT — the same control the sheet style uses, and the same
         idea: multi-octave noise added to the distance BEFORE anything
         thresholds it, so the front tears rather than expanding as a circle. */
      float n = fbm2(pos * uDispScale + vec2(0.0, uTime * uDispDrift), uDetail) - 0.5;
      float far = max(length(a - org), length(org));
      float d = (length(pos - org) + n * uDispAmp) / max(far, 1e-4);

      /* The sweep runs the front from before the origin to past the corner, so
         both ends are clean. local is 0 at the leading edge and 1 well
         behind it — everything below is a function of it. */
      float front = uP * (1.0 + uFrontW * 2.0) - uFrontW;
      float local = (front - d) / max(uFrontW, 1e-4);

      /* CELLS IN DEVICE PIXELS, not in uv. Dividing uv by a grid derived from
         the resolution gives cells that are square only by accident, and any
         rotation of that space shears them. Working in fragment coordinates
         makes the cell a square by construction, so rotate and swirl below are
         rotations rather than skews. */
      vec2 c2 = gl_FragCoord.xy - uRes * 0.5;
      float ang = uCellRot + uSwirl * (length(c2) / max(uRes.y, 1.0));
      float ca = cos(ang), sa = sin(ang);
      vec2 cr = vec2(c2.x * ca - c2.y * sa, c2.x * sa + c2.y * ca);
      vec2 gxy = cr / max(uPxPitch, 2.0);
      vec2 cell = floor(gxy);
      vec2 f = fract(gxy) - 0.5;
      float rnd = hash1(cell);
      float rnd2 = hash1(cell + 7.3);

      // the dot need not sit in the middle of its cell
      f -= (vec2(rnd, rnd2) - 0.5) * uJitter;

      // per-cell offset, so the band does not arrive as a straight rank
      float t = local + (rnd - 0.5) * uStagger;

      /* Quantised into concentric waves. Rounding the FRONT rather than the
         dot means whole rings arrive together, which is a different rhythm
         from the smooth sweep rather than a coarser version of it. */
      if (uRings > 0.5) t = floor(t * uRings) / uRings;

      /* PULSE. Each cell gets its own phase from its own hash, so at
         pulsePhase 1 they breathe independently and at 0 the whole field beats
         as one — which are two genuinely different effects, not two settings. */
      float ph = rnd2 * 6.2831853 * uPulsePhase;
      float pulse = 1.0 + sin(uTime * uPulseRate + ph) * uPulseDepth;
      float pulseR = (uPulseMode < 0.5 || uPulseMode > 1.5) ? pulse : 1.0;
      float pulseB = (uPulseMode > 0.5) ? pulse : 1.0;

      /* A dot grows in at the front and shrinks away behind it, which is what
         makes the band a band rather than a filled disc with a ragged edge. */
      float grow = smoothstep(0.0, 0.35, t);
      // uTrail is where the dot begins to die, so a long trail leaves a wake
      float fade = 1.0 - smoothstep(uTrail, uTrail + 0.5, t);
      float rad = uDot * 0.5 * grow * fade * max(pulseR, 0.0);

      /* GUARDED. smoothstep with edge0 == edge1 is undefined in GLSL, and in
         practice returns 1 for any x >= edge0 — so every cell OUTSIDE the band,
         where the radius is exactly zero, drew a full-strength dot and the
         whole screen came up white. The radius has to be positive before it can
         be used as an edge pair. */
      /* SUPERELLIPSE. n = 2 is a circle and large n is a square, so one dial
         runs the glyph between the two rather than a mode switch that jumps. */
      float sn = mix(2.0, 10.0, clamp(uSquare, 0.0, 1.0));
      float r = pow(pow(abs(f.x), sn) + pow(abs(f.y), sn), 1.0 / sn);

      float core = 0.0, halo = 0.0, cross = 0.0;
      if (rad > 0.0005){
        core = smoothstep(rad, rad * 0.55, r);
        // hollow it into a ring, so the field reads as outlines not blobs
        if (uRingW > 0.001) core *= smoothstep(rad * uRingW * 0.55, rad * uRingW, r);

        /* BLOOM, DRAWN NOT BLURRED. A halo and a cross per dot, both from the
           distance the dot already needed. For point sources this is what
           three render targets would have bought. */
        halo = exp(-r / max(rad * uGlowSpread, 1e-3)) * uGlowGain;
        if (uFlare > 0.0){
          float bright = step(0.72, rnd);        // only the brightest few flare
          float fx = exp(-abs(f.y) / max(rad * 0.22, 1e-3)) *
                     exp(-abs(f.x) / max(rad * uFlareLen, 1e-3));
          float fy = exp(-abs(f.x) / max(rad * 0.22, 1e-3)) *
                     exp(-abs(f.y) / max(rad * uFlareLen, 1e-3));
          cross = (fx + fy) * uFlare * bright;
        }
      }

      float spark = clamp((core + halo + cross) * max(pulseB, 0.0), 0.0, 3.0);

      /* ABERRATION. The front is evaluated at three slightly different radii,
         one per channel — three distances rather than three whole dot fields,
         so the fringe costs almost nothing and still appears only where the
         three disagree, which is the advancing edge. */
      float cR = smoothstep(0.0, 1.0, t + uAberr);
      float cG = smoothstep(0.0, 1.0, t);
      float cB = smoothstep(0.0, 1.0, t - uAberr);
      float covered = cG;
      /* Same idea, already computed: 1 on the advancing band, 0 behind it. */
      gFront = clamp(1.0 - covered, 0.0, 1.0);

      /* THE SECOND BLOCK. Its figure is rendered by a separate instance of
         js/about-figure.js into a hidden canvas, uploaded here as a texture.
         Compositing it in the shader rather than stacking it in the DOM is
         what lets the SAME dot mask that eats the first block reveal it —
         a DOM canvas cannot be clipped by a shader. */
      vec3 ground = groundB(vUv);
      /* THE CAPTION, between the ground and the head — which is the whole
         reason it is here rather than in the DOM. The white block is one
         canvas this shader paints, so anything layered under it in the
         document is under an opaque sheet; "behind the 3D but over the
         characters" is a position in THIS composite and nowhere else.

         Read at gScreenUv for the same reason the ground is: it is flat type
         on a flat plane, and pulling it through the barrel would bend a
         straight baseline. */
      if (uHasCap > 0.5){
        vec4 tc = texture2D(uCap, gScreenUv);
        ground = mix(ground, tc.rgb, clamp(tc.a, 0.0, 1.0));
      }
      vec3 blockB = ground;
      if (uHasB > 0.5){
        vec4 tb = texture2D(uBlockB, vUv);
        blockB = mix(ground, tb.rgb, clamp(tb.a, 0.0, 1.0));
      }

      vec3 cov = vec3(cR, cG, cB);
      vec3 rgb = mix(uSpark * uSparkGain * spark,
                     blockB * cov / max(max(cR, max(cG, cB)), 1e-4),
                     covered);

      /* GRAIN, the shader kind — the same per-pixel colour dither the figure
         carries. It is not decoration here: the saturation layer above this
         canvas takes the SOURCE's saturation, and a neutral grey has none, so
         without this the dissolve would sit under the page's effect wearing
         none of it. */
      vec2 sp = gl_FragCoord.xy + uTime * 60.0;
      vec3 gn = vec3(hash1(sp), hash1(sp + 17.3), hash1(sp + 41.7)) - 0.5;
      rgb += gn * uGrain;

      float alpha = clamp(max(max(cR, max(cG, cB)), spark), 0.0, 1.0);
      if (alpha <= 0.002) return vec4(0.0);
      return vec4(clamp(rgb, 0.0, 1.0), alpha);
    }


    /* ---- POST, shared by both styles ---------------------------------------
       Everything below runs on the OUTPUT of whichever dissolve is drawing, so
       none of it knows or cares which one that is. Same reason the CRT block
       above is concatenated rather than pasted: it is an output stage, and two
       copies drift.

       Its own noise helpers, deliberately named apart from each shader's, so
       concatenating cannot collide with the ones already there. */
    uniform float uLensBarrel, uLensChroma, uBlurAmt, uRayGain, uRayCount,
                  uRaySpeed, uRayFall, uHoloGain, uHoloBands, uHoloSpeed,
                  uHoloFlicker, uDissolve, uDissolveScale;
    uniform int uBlurSteps;
    uniform vec3 uHoloTint, uRayCol;
    uniform vec2 uPostOrigin;

    float hashP(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float vnoiseP(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hashP(i), hashP(i + vec2(1,0)), u.x),
                 mix(hashP(i + vec2(0,1)), hashP(i + vec2(1,1)), u.x), u.y);
    }
    float fbmP(vec2 p){
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 3; i++){ v += a * vnoiseP(p); p *= 2.03; a *= 0.5; }
      return v;
    }

    /* LENS. Barrel distortion with a per-channel difference, which is what
       makes it a lens rather than a warp: real glass refracts the three
       wavelengths by different amounts, so the chroma has to come from
       sampling at three different DISTORTIONS, not from offsetting the result. */
    vec2 lensAt(vec2 uv, float k, out bool outside){
      outside = false;
      vec2 d = uv - 0.5;
      vec2 w = 0.5 + d * (1.0 + k * dot(d, d) * 4.0);
      if (w.x < 0.0 || w.x > 1.0 || w.y < 0.0 || w.y > 1.0) outside = true;
      return w;
    }

    vec4 sampleLens(vec2 uv){
    #ifndef FX_LENS
      return shade(uv);
    #else
      bool o1;
    #ifdef FX_CHROMA
      {
        bool o2, o3;
        vec2 uR = lensAt(uv, uLensBarrel + uLensChroma, o1);
        vec2 uG = lensAt(uv, uLensBarrel,               o2);
        vec2 uB = lensAt(uv, uLensBarrel - uLensChroma, o3);
        vec4 cR = o1 ? vec4(0.0) : shade(uR);
        vec4 cG = o2 ? vec4(0.0) : shade(uG);
        vec4 cB = o3 ? vec4(0.0) : shade(uB);
        return vec4(cR.r, cG.g, cB.b, max(cR.a, max(cG.a, cB.a)));
      }
    #endif
      vec2 u = lensAt(uv, uLensBarrel, o1);
      return o1 ? vec4(0.0) : shade(u);
    #endif
    }

    void main(){
      gScreenUv = vUv;   // before the lens; see the note above
      bool outside;
      vec2 base = crtWarp(vUv, outside);
      if (outside){ gl_FragColor = vec4(0.0); return; }

      /* MOTION BLUR. The whole dissolve is re-evaluated along the direction it
         is travelling — radially away from the origin — and averaged. It is
         the expensive control on this panel by a wide margin, which is why it
         is steps rather than a smooth amount: the cost is exactly the number
         of taps and nothing hides that. */
    #ifndef FX_BLUR
      vec4 col = sampleLens(base);
    #else
      int steps = uBlurSteps < 1 ? 1 : (uBlurSteps > 6 ? 6 : uBlurSteps);
      vec2 away = base - uPostOrigin;
      vec2 dir = (length(away) > 1e-5 ? normalize(away) : vec2(0.0, 1.0)) * uBlurAmt;

      vec4 col = vec4(0.0);
      float wsum = 0.0;
      for (int i = 0; i < 6; i++){
        if (i >= steps) break;
        float f = (steps == 1) ? 0.0 : (float(i) / float(steps - 1) - 0.5);
        col += sampleLens(base - dir * f);
        wsum += 1.0;
      }
      col /= max(wsum, 1e-4);
    #endif

      /* VOLUMETRIC. Shafts from the same origin, banded by angle so they read
         as rays rather than as a glow, and falling off with distance so they
         belong to the source. Cheap on purpose: a true volumetric marches the
         mask along each ray, which is another six taps on top of the blur's. */
    #ifdef FX_RAYS
      if (uRayGain > 0.0001){
        vec2 rd = base - uPostOrigin;
        float ang = atan(rd.y, rd.x);
        float dist = length(rd);
        float r = fbmP(vec2(ang * uRayCount, uTime * uRaySpeed));
        float shaft = pow(max(r, 0.0), 2.5) * exp(-dist * uRayFall);
        col.rgb += uRayCol * shaft * uRayGain;
        col.a = clamp(col.a + shaft * uRayGain * 0.6, 0.0, 1.0);
      }
    #endif

      /* HOLOGRAM. Travelling bands, a tint, and a flicker held for a few
         frames at a time rather than per frame — a per-frame flicker at 60Hz
         reads as noise, not as an unstable projection. */
    #ifdef FX_HOLO
      if (uHoloGain > 0.0001){
        float band = 0.5 + 0.5 * sin((base.y * uHoloBands - uTime * uHoloSpeed) * 6.2831853);
        float held = floor(uTime * 12.0);
        float flick = 1.0 - uHoloFlicker * hashP(vec2(held, 3.7));
        vec3 h = mix(col.rgb, uHoloTint, 0.65) * (0.72 + 0.4 * band) * flick;
        col.rgb = mix(col.rgb, h, uHoloGain);
      }
    #endif

      /* DISSOLVE. A per-pixel threshold against a hash, so the layer erodes
         into speckle rather than fading. Quantised to blocks by scale, and
         weighted toward the edge — eroding the solid interior as hard as the
         boundary just punches holes in a finished block. */
    #ifdef FX_DISSOLVE
      if (uDissolve > 0.0001){
        vec2 dp = floor(gl_FragCoord.xy / max(uDissolveScale, 1.0));
        float n = hashP(dp);
        float edgeBias = mix(1.0, 0.35, smoothstep(0.75, 1.0, col.a));
        col.a *= step(uDissolve * edgeBias, n);
      }
    #endif

      gl_FragColor = crt(col, base);
    }
`;

  let canvas = null, gl = null, U = null, failed = false;
  let texB = null, texG = null, texC = null, buildProg = null, uniformsFor = null, curProg = null;
  let texBig = null, bigUp = false;
  /* Loaded once for the life of the page, not per mount: the decode is the
     only slow part and it does not depend on anything this module rebuilds. */
  const bigImg = new Image();
  bigImg.src = 'assets/big-logo.svg';
  /* THE SVG RASTERISED AT THE SIZE IT IS DRAWN, which is the whole answer to
     "the edges look like a png". Uploading the <img> straight to a texture
     uploads it at the file's OWN 1186 and the GPU then magnifies it — a
     vector turned into a soft bitmap by the one step that had no reason to
     be lossy. Painted into a canvas at the device pixels it will occupy, the
     browser's own vector rasteriser does the work and the edges are the
     file's. Redrawn only when that size changes. */
  const bigCan = document.createElement('canvas');
  let bigKey = '';
  /* MODULE SCOPE, because compositeState() re-binds it every frame and that
     function lives out here. It was a const inside the setup function — a
     ReferenceError the moment the composite tried to draw. */
  let buf = null;
  let guard = null;
  const progs = new Map();
  let raf = 0, alive = true, t0 = performance.now(), last = t0;
  let target = 0, current = 0;

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

  /* ---- WHAT ACTUALLY GETS COMPILED ---------------------------------------
     A uniform set to zero is not a switch. It still costs every texture tap
     and every noise octave behind it, and this shader had five of them: with
     the fringe off, the boundary was evaluated three times identically; with
     the frost off, a second time on top of that, plus three more octaves for a
     crust multiplied by nothing. Twenty-three octaves a pixel to draw a
     five-octave picture.

     So the feature set is a list of #defines built from the live config, one
     program is compiled per distinct set and kept, and a control crossing zero
     recompiles ONCE — not per frame, and not on a control that was never
     touched. The uniforms behind a feature that is compiled out resolve to
     null locations, and gl.uniform*(null, …) is a defined no-op, so the
     per-frame writes below can stay unconditional. */
  function defines(){
    const C = CONFIG, d = [];
    const nz = v => Math.abs(v || 0) > 1e-4;
    if (nz(C.dispAmp)) d.push('FX_DISP');
    if (nz(C.aberration)) d.push('FX_ABERR');
    if (nz(C.frostGain) && nz(C.frostWidth)) d.push('FX_FROST');
    if (C.crt){
      d.push('FX_CRT');
      if (nz(C.crtCurvature)) d.push('FX_WARP');
    }
    if (nz(C.lensBarrel) || nz(C.lensChroma)) d.push('FX_LENS');
    if (nz(C.lensChroma)) d.push('FX_CHROMA');
    if (C.blurSteps > 1 && nz(C.blurAmt)) d.push('FX_BLUR');
    if (nz(C.rayGain)) d.push('FX_RAYS');
    if (nz(C.holoGain)) d.push('FX_HOLO');
    if (nz(C.dissolve)) d.push('FX_DISSOLVE');
    return d;
  }

  function programFor(style){
    const d = defines();
    const key = style + '|' + d.join(',');
    let e = progs.get(key);
    if (e) return e;
    /* The unused style is never compiled at all. Building both up front was
       there to keep a stall out of the middle of a transition, which is still
       worth having — but a stall in the style you are NOT running is just a
       shader nobody asked for. The first frame after a switch pays for it. */
    const pre = d.map(n => '#define ' + n + '\n').join('');
    const prog = buildProg(pre + (style === 'sheet' ? FRAG_SHEET : FRAG_SPARK));
    e = { prog, U: uniformsFor(style, prog), defs: d };
    progs.set(key, e);
    return e;
  }

  /* ---- warming up, while the first block still has the room ---------------
     THE FIRST FRAME OF THE SECOND BLOCK PAYS FOR THE SHADER. programFor()
     compiles on demand from inside the frame loop, and linking a GLSL program
     of this size is tens of milliseconds of blocking work — so the moment the
     composite first has something to draw, it stalls, exactly once, right at
     the point where the page is asking to look smooth.

     The define set is fixed at runtime: nothing in defines() is driven by
     scroll, so this compiles once and is cached for the life of the page. That
     makes it a one-off cost that can simply be paid EARLIER, and the first
     block is where the room is — it runs at the refresh ceiling with headroom
     to spare while the reader is still at the top.

     Both styles are compiled, not just the current one. The unused style costs
     a compile nobody asked for, which programFor() rightly refuses to do on
     demand; here there is nothing to interrupt, and a style switch from the
     panel then never stalls either.

     ON AN IDLE CALLBACK, and after the loader: doing it at mount would put the
     stall inside the intro instead of inside the scroll, which is moving the
     problem rather than solving it. */
  /* The framebuffer the head is rendered into when sharedHead is on. Rebuilt
     with the canvas, because a target of the wrong size would either crop the
     head or waste the difference. */
  let headTex = null, headFbo = null, headW = 0, headH = 0, headOn = false;

  function buildHeadFbo(){
    if (!gl) return false;
    if (headTex) gl.deleteTexture(headTex);
    if (headFbo) gl.deleteFramebuffer(headFbo);
    headW = canvas.width; headH = canvas.height;
    headTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, headTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, headW, headH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    headFbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, headFbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, headTex, 0);
    /* A DEPTH BUFFER, because the thing being drawn into this is a MESH. The
       silhouette buffer in about-figure.js has one for the same reason; a
       colour-only target would draw the head's back faces over its front. */
    const rb = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, headW, headH);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return ok;
  }

  /* Handed to about-figure only once there is a target for it to draw into.
     If anything about that fails the flag goes back off and the old canvas
     path carries on — the same "take over only after it works" shape
     js/about-xray.js uses. */
  function shareHead(){
    const B = window.FIGURE_B;
    if (headOn || !CONFIG.sharedHead || !gl || !B || !B.attachTo) return;
    if (!buildHeadFbo()){ CONFIG.sharedHead = false; return; }
    headOn = !!B.attachTo(gl, headFbo, headW, headH);
    if (!headOn){ CONFIG.sharedHead = false; console.warn('[mask-scroll] shared head refused; staying on the copy'); }
    else console.log('%c[mask-scroll] head is sharing this context', 'color:#5fb37e');
  }

  let warmed = false;
  function warm(){
    if (warmed || !CONFIG.enabled) return false;
    if (document.documentElement.classList.contains('is-loading')) return false;
    if (!init()) return false;
    warmed = true;
    try {
      programFor('sheet');
      programFor('spark');
    } catch (e){ /* a failed warm-up must never take the page with it */ }
    return true;
  }

  (function scheduleWarm(){
    let tries = 0;
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 200));
    const go = () => {
      if (warm() || ++tries > 40) return;
      setTimeout(() => idle(go), 250);
    };
    idle(go);
  })();

  /* THE TUBE ONLY. The grade, the scan lines and the vignette are per-pixel
     now (see gFront in the shader); the barrel warps the coordinate before
     anything is read, so it is the one part that still needs a single number
     for the whole frame. It flattens over the last of the scroll. */
  function crtAmount(p){
    if (!CONFIG.crt) return 0;
    const a = Math.max(0, Math.min(1, CONFIG.crtFade));
    const t = a >= 0.9999 ? 0 : Math.max(0, Math.min(1, (p - a) / (1 - a)));
    const e = t * t * (3 - 2 * t);
    return 1 + (Math.max(0, Math.min(1, CONFIG.crtHold)) - 1) * e;
  }

  /* EVERY GPU RESOURCE THIS MODULE OWNS, in one place, so that the first build
     and the rebuild after a restored context are the same code rather than two
     that drift apart. See PAGE.glGuard in js/lifecycle.js for why a context
     goes away in the first place.

     THE PROGRAM CACHE IS CLEARED FIRST, and it is the part that would otherwise
     be missed. programFor() is a Map keyed by style and defines, and after a
     loss every entry in it holds a program handle that is still a truthy object
     and no longer refers to a program. Left in place, the cache answers every
     lookup with a dead entry and the block draws nothing forever — the exact
     failure this whole function exists to fix, reintroduced one level down. */
  function buildGL(){
    progs.clear();
    curProg = null;
    texB = texG = texC = texBig = null; bigUp = false;

    buildProg = function build(frag){
      const pr = gl.createProgram();
      gl.attachShader(pr, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(pr, compile(gl.FRAGMENT_SHADER, frag));
      gl.bindAttribLocation(pr, 0, 'aPos');
      gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(pr));
      return pr;
    };

    /* The second block's texture. NPOT, so no mipmaps and clamped — a
       viewport-sized canvas is almost never a power of two. */
    texB = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texB);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    /* Its own texture object, same settings. Sharing texB and re-binding per
       draw would work exactly until the day both are wanted in one pass —
       which is today, since the head is composited over this. */
    texC = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texC);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    /* THE BIG MARK'S TEXTURE. Uploaded ONCE, when the image lands — it never
       changes, so re-uploading it per frame would be the exact cost this file
       spent a week removing from the other three. */
    texBig = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texBig);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    bigUp = false;

    texG = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texG);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uOf = (pr, n) => gl.getUniformLocation(pr, n);
    const post = P => ({
      lensBarrel:uOf(P,'uLensBarrel'), lensChroma:uOf(P,'uLensChroma'),
      blurAmt:uOf(P,'uBlurAmt'), blurSteps:uOf(P,'uBlurSteps'),
      rayGain:uOf(P,'uRayGain'), rayCount:uOf(P,'uRayCount'),
      raySpeed:uOf(P,'uRaySpeed'), rayFall:uOf(P,'uRayFall'),
      rayCol:uOf(P,'uRayCol'), holoGain:uOf(P,'uHoloGain'),
      holoBands:uOf(P,'uHoloBands'), holoSpeed:uOf(P,'uHoloSpeed'),
      holoFlicker:uOf(P,'uHoloFlicker'), holoTint:uOf(P,'uHoloTint'),
      dissolve:uOf(P,'uDissolve'), dissolveScale:uOf(P,'uDissolveScale'),
      postOrigin:uOf(P,'uPostOrigin'),
      /* shared by both styles, like the CRT block they belong to */
      white:uOf(P,'uWhite'), whiteFoot:uOf(P,'uWhiteFoot'),
      blockB:uOf(P,'uBlockB'), hasB:uOf(P,'uHasB'),
      ground:uOf(P,'uGround'), hasGround:uOf(P,'uHasGround'),
      big:uOf(P,'uBig'), hasBig:uOf(P,'uHasBig'),
      bigCol:uOf(P,'uBigCol'), bigRect:uOf(P,'uBigRect'),
      bigA:uOf(P,'uBigA'),
      bigRot:uOf(P,'uBigRot'),
      cap:uOf(P,'uCap'), hasCap:uOf(P,'uHasCap'),
      crt:uOf(P,'uCrt'), crtAmt:uOf(P,'uCrtAmt'),
      crtHold:uOf(P,'uCrtHold'), crtBand:uOf(P,'uCrtBand'),
      scanCount:uOf(P,'uScanCount'), scanDepth:uOf(P,'uScanDepth'),
      curve:uOf(P,'uCurve'), vig:uOf(P,'uVig'),
      con:uOf(P,'uCon'), sat:uOf(P,'uSat'),
      p:uOf(P,'uP'), time:uOf(P,'uTime'), aspect:uOf(P,'uAspect'),
      dispAmp:uOf(P,'uDispAmp'), dispScale:uOf(P,'uDispScale'),
      dispDrift:uOf(P,'uDispDrift'), detail:uOf(P,'uDetail'),
      aberr:uOf(P,'uAberr'),
    });

    uniformsFor = function (style, P){
      if (style === 'sheet'){
        return { ...post(P), flip:uOf(P,'uFlip'), soft:uOf(P,'uSoft'),
          frostWidth:uOf(P,'uFrostWidth'), frostGain:uOf(P,'uFrostGain'),
          frostScale:uOf(P,'uFrostScale'), frost:uOf(P,'uFrost') };
      }
      return { ...post(P), res:uOf(P,'uRes'), origin:uOf(P,'uOrigin'),
        pitch:uOf(P,'uPxPitch'), dot:uOf(P,'uDot'), frontW:uOf(P,'uFrontW'),
        stagger:uOf(P,'uStagger'), pulseRate:uOf(P,'uPulseRate'),
        pulseDepth:uOf(P,'uPulseDepth'), pulsePhase:uOf(P,'uPulsePhase'),
        pulseMode:uOf(P,'uPulseMode'), square:uOf(P,'uSquare'),
        ringW:uOf(P,'uRingW'), trail:uOf(P,'uTrail'), rings:uOf(P,'uRings'),
        swirl:uOf(P,'uSwirl'), cellRot:uOf(P,'uCellRot'), jitter:uOf(P,'uJitter'),
        grain:uOf(P,'uGrain'), glowSpread:uOf(P,'uGlowSpread'),
        glowGain:uOf(P,'uGlowGain'), flare:uOf(P,'uFlare'),
        flareLen:uOf(P,'uFlareLen'), sparkGain:uOf(P,'uSparkGain'),
        spark:uOf(P,'uSpark') };
    };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  }

  /* STATED BEFORE EVERY DRAW, not once at setup. Alone in its own context this
     module could set blend here and forget it. Sharing one with about-figure.js
     it cannot: that module needs DEPTH_TEST and CULL_FACE for its mesh and
     leaves them on, and this module draws a full-screen quad — which would then
     be depth-tested against the head's depth buffer and culled by its own
     winding. The result is a black screen and an empty console, so the four
     lines below are not tidiness. */
  function compositeState(){
    /* THE VERTEX STATE, re-stated every frame for the same reason as the
       program. This module binds its quad once at setup and drew from it for
       the life of the context; about-figure.js rebinds attribute 0 to its
       MESH — three shorts, not two floats — and enables attribute 1 for
       normals, on every one of its draws. Left alone, the composite's quad
       would read the head's vertices in the wrong format. */
    if (buf){
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.disableVertexAttribArray(1);
    }
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  function init(){
    if (canvas || failed) return !failed;
    try {
      canvas = document.createElement('canvas');
      canvas.className = 'mask-sheet';
      canvas.setAttribute('aria-hidden', 'true');
      gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false,
                                        antialias: false });
      if (!gl) throw new Error('no WebGL context');

      /* The browser can take this context back at any time. Registered before
         anything is built, because a loss during the build is as possible as one
         an hour later. */
      guard = window.PAGE.glGuard(canvas, () => { buildGL(); resize(); });
      buildGL();
      stage.appendChild(canvas);
      resize();
      return true;
    } catch (e){
      failed = true;
      console.warn('[mask-scroll] unavailable:', e.message);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvas = null; gl = null;
      return false;
    }
  }

  function resize(){
    if (!gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2) *
                Math.max(0.25, Math.min(1, CONFIG.renderScale));
    const w = Math.max(2, Math.round(stage.clientWidth * dpr));
    const h = Math.max(2, Math.round(stage.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h){
      canvas.width = w; canvas.height = h;
      /* The head's target follows the canvas. Rebuilding hands about-figure a
         new framebuffer, so it has to be told again. */
      if (headOn){ headOn = false; shareHead(); }
    }
    gl.viewport(0, 0, w, h);
  }

  const on = window.PAGE.bindings();

  /* ONE GESTURE, TOP TO BOTTOM. The copy in block 01 and this transition both
     want the wheel, and the reader should not have to know that. So the copy
     goes first and this only takes what the copy could not use: scrolling down
     runs the text to its end and THEN opens block 02, and scrolling up closes
     block 02 before the text moves again.

     js/about-text.js is registered before this one, so its listener has
     already run by the time this fires and `atEnd` is this frame's answer, not
     last frame's. It is also held while the second block is open, which is the
     other half of the same rule — see hold() below. */
  on(stage, 'wheel', e => {
    /* SHIFT NO LONGER MEANS ANYTHING. This early return existed to keep the wheel
       clear for js/mask.js's shift-wheel scaling, which is off now — so holding
       shift while scrolling was landing on a page that ignored it entirely.
       Shift is an ordinary wheel again. */
    if (!CONFIG.enabled) return;
    e.preventDefault();
    const T = window.ABOUTTEXT;
    const down = e.deltaY > 0;
    if (T && down && !T.atEnd()) return;    // the copy still has room
    if (T && !down && current <= 0.5) return; // block 02 is already closed
    /* AND THE SECOND BLOCK'S OWN SCROLL HAS TO UNWIND FIRST. js/block2.js runs
       a phase AFTER this one — the head, the columns, the footer — and without
       this line scrolling back up would start peeling the white away while that
       text was still halfway up the screen: two phases running backwards at
       once, from one gesture. Downward the handover needs no such line, because
       this target is already at its ceiling and simply discards the delta. */
    if (!down && window.BLOCK2 && window.BLOCK2.travel > 0.5) return;
    target = Math.max(0, Math.min(CONFIG.overPx,
      target + e.deltaY * CONFIG.wheelSpeed));
  }, { passive: false });

  on(window, 'keydown', e => {
    if (!CONFIG.enabled) return;
    if (e.key === 'PageDown'){ target = CONFIG.overPx; }
    if (e.key === 'PageUp'){ target = 0; }
  });

  let rt;
  on(window, 'resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });

  /* The second block's figure is rendered by its own instance of
     js/about-figure.js into a hidden canvas. While the page is still black
     nothing samples it, so it is a full mesh draw per frame for a picture that
     does not exist yet. It keeps its context — it just stops drawing. */
  let bodyOn = null;
  function gateBody(want){
    if (bodyOn === want) return;
    bodyOn = want;
    const B = window.FIGURE_B;
    if (B && B.setDormant) B.setDormant(!want);
  }

  function frame(now){
    if (!alive) return;
    const dt = Math.min((now - last) / 1000, 0.1); last = now;

    /* HELD, NOT KILLED, while the context is gone: the scroll position and the
       phase go on being tracked, so a context handed back mid-block resumes at
       the place the reader had scrolled to rather than at the top. */
    if (guard && guard.lost()){
      if (canvas) canvas.style.visibility = 'hidden';
      raf = requestAnimationFrame(frame);
      return;
    }

    if (CONFIG.enabled && init()){
      // exponential decay against real elapsed time: the same settling on any
      // refresh rate, the rule the rest of the site's scrolls use
      const k = 1 - Math.exp(-dt / Math.max(CONFIG.ease, 0.001));
      current += (target - current) * k;
      const p = Math.max(0, Math.min(1, current / Math.max(CONFIG.overPx, 1)));

      /* NOTHING TO DRAW, AND NOTHING ON THE WAY.
         The canvas is transparent over the first block and hidden at rest, so
         a pass here paints a transparent frame — sixty times a second, for as
         long as the page sits at the top. The second block's renderer is a
         whole second WebGL context doing the same thing behind it. Both stop;
         neither loses its context or its pose. */
      const settled = Math.abs(target - current) < 0.25;
      if (p <= 0.0005 && settled){
        canvas.style.visibility = 'hidden';
        gateBody(false);
        if (window.ABOUTTEXT && window.ABOUTTEXT.hold) window.ABOUTTEXT.hold(false);
        raf = requestAnimationFrame(frame);
        return;
      }
      gateBody(true);
      /* The other half of the wheel handover: while block 02 is on screen the
         copy stops accepting input, so scrolling back up closes this block
         before the text starts moving again. */
      /* Held on the TARGET, not on what is currently on screen. Scrolling
         back up sets the target to zero at once and the block then takes half
         a second to ease out — hold on the eased value and the copy stays
         frozen for that whole half second after the reader has plainly asked
         for it, which feels like a page that has stopped responding. */
      if (window.ABOUTTEXT && window.ABOUTTEXT.hold) window.ABOUTTEXT.hold(target > 0.5);

      resize();
      const C = CONFIG;
      const aspect = canvas.width / Math.max(canvas.height, 1);
      const time = (now - t0) / 1000;

      /* One program per distinct feature set, compiled on demand. */
      const entry = programFor(C.style);
      /* ALWAYS, not only when it changed. The cache was right for a context
         this module owns alone; sharing one with js/about-figure.js it is a
         lie — that module binds its own program between our frames, so "the
         program has not changed since last time" says nothing about what is
         actually current. Every uniform below would then be written against
         the wrong program. Binding unconditionally costs one call a frame. */
      curProg = entry.prog; gl.useProgram(curProg);
      U = entry.U;

      if (C.style === 'sheet'){
        gl.uniform1f(U.p, p);
        gl.uniform1f(U.time, time);
        gl.uniform1f(U.aspect, aspect);
        gl.uniform1f(U.flip, C.from === 'top' ? 1 : 0);
        gl.uniform1f(U.dispAmp, C.dispAmp);
        gl.uniform1f(U.dispScale, C.dispScale);
        gl.uniform1f(U.dispDrift, C.dispDrift);
        gl.uniform1f(U.soft, C.soft);
        gl.uniform1f(U.aberr, C.aberration);
        gl.uniform1i(U.detail, Math.max(1, Math.min(5, Math.round(C.dispDetail))));
        gl.uniform1f(U.frostWidth, C.frostWidth);
        gl.uniform1f(U.frostGain, C.frostGain);
        gl.uniform1f(U.frostScale, C.frostScale);
        gl.uniform3fv(U.frost, hex3(C.frostColour));
      } else {
        const dpr = canvas.width / Math.max(stage.clientWidth, 1);
        gl.uniform1f(U.p, p);
        gl.uniform1f(U.time, time);
        gl.uniform1f(U.aspect, aspect);
        gl.uniform2f(U.res, canvas.width, canvas.height);
        gl.uniform2f(U.origin, C.originX, C.originY);
        // the pitch is quoted in CSS px, so it has to be scaled to the backing
        // store or the dots halve on a retina screen
        gl.uniform1f(U.pitch, Math.max(2, C.pitch * dpr));
        gl.uniform1f(U.dot, C.dot);
        gl.uniform1f(U.frontW, C.frontWidth);
        gl.uniform1f(U.stagger, C.stagger);
        gl.uniform1f(U.dispAmp, C.dispAmp);
        gl.uniform1f(U.dispScale, C.dispScale);
        gl.uniform1f(U.dispDrift, C.dispDrift);
        gl.uniform1i(U.detail, Math.max(1, Math.min(5, Math.round(C.dispDetail))));
        gl.uniform1f(U.aberr, C.aberration);
        gl.uniform1f(U.grain, C.grain);
        gl.uniform1f(U.pulseRate, C.pulseRate);
        gl.uniform1f(U.pulseDepth, C.pulseDepth);
        gl.uniform1f(U.pulsePhase, C.pulsePhase);
        gl.uniform1f(U.pulseMode,
          C.pulseMode === 'radius' ? 0 : (C.pulseMode === 'brightness' ? 1 : 2));
        gl.uniform1f(U.square, C.square);
        gl.uniform1f(U.ringW, C.ringWidth);
        gl.uniform1f(U.trail, C.trail);
        gl.uniform1f(U.rings, C.rings);
        gl.uniform1f(U.swirl, C.swirl);
        gl.uniform1f(U.cellRot, C.cellRotate);
        gl.uniform1f(U.jitter, C.jitter);
        gl.uniform1f(U.glowSpread, C.glowSpread);
        gl.uniform1f(U.glowGain, C.glowGain);
        gl.uniform1f(U.flare, C.flare);
        gl.uniform1f(U.flareLen, C.flareLen);
        gl.uniform1f(U.sparkGain, C.sparkGain);
        gl.uniform3fv(U.spark, hex3(C.sparkColour));

      }

      /* Uploaded for EITHER style — it used to sit inside the sparkle branch,
         which is why switching to sheet lost the second block's figure. It is a
         full-viewport canvas-to-texture copy per frame, cheap on the GPU and
         pointless at rest, so it only runs while the transition is in flight. */
      const src = scope.querySelector('#maskBody');
      let hasB = 0;
      /* SHARED: nothing is copied. about-figure.js has already drawn the head
         into headTex inside this very context, so the texture is simply bound.
         This is the whole point of the exercise — the branch below is the old
         path, kept intact so the flag can go back off at any moment. */
      if (headOn && headTex && p > 0.001){
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, headTex);
        gl.uniform1i(U.blockB, 0);
        hasB = 1;
      } else if (CONFIG.uploads && src && src.width > 1 && p > 0.001){
        try {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texB);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
          gl.uniform1i(U.blockB, 0);
          hasB = 1;
        } catch (err){ hasB = 0; }
      }
      gl.uniform1f(U.hasB, hasB);

      /* THE ASCII GROUND, on TEXTURE1 — its own unit, not a rebind of 0. Two
         textures sharing a unit means the second bind silently replaces the
         first, and the symptom is the head vanishing rather than an error.

         Uploaded whenever the block is visible at all, unlike the body above
         which only matters in flight: this is the ground, so it has to be
         there for the whole of the second block, not just while it arrives. */
      /* THE BIG MARK, on TEXTURE3. Uploaded the first frame the image is
         decoded and never again — it is a static drawing, and the three
         uploads beside it are already the most expensive thing in this pass.

         ITS BOX IS SQUARE IN PIXELS, not in uv. The shader works in screen uv
         where one unit across is not one unit down, so the height has to be
         the width times the aspect or a 1186x1186 mark comes out an oval on
         every window that is not square. */
      let hasBig = 0;
      if (CONFIG.bigOn && texBig && bigImg.complete && bigImg.naturalWidth){
        /* THE FILE'S 1186 IN THE FILE'S 1920 FRAME. Not a share of the window:
           as a share it was full-bleed on a wide screen and a different mark
           on every laptop. */
        const sizeCss = CONFIG.bigPx * (Math.max(1, innerWidth) / 1920);
        /* Rasterised at DEVICE pixels, and capped: the mark can be scaled up
           in the console and a texture the size of a scaled-up 4K canvas is a
           real allocation, not a rounding error.

           ITS OWN dpr, DELIBERATELY. There is a `dpr` a few lines above with
           exactly this value — and it is declared inside an `else` branch, so
           reading it from out here is a ReferenceError on the first frame that
           takes the other branch, which would take the whole composite down
           rather than just this mark. Two lines of arithmetic beat borrowing
           a name out of a scope that does not contain you. */
        const bigDpr = canvas.width / Math.max(stage.clientWidth, 1);
        const px = Math.min(4096, Math.max(64, Math.round(sizeCss * bigDpr)));
        const key = px + '';
        if (key !== bigKey){
          bigCan.width = bigCan.height = px;
          const c2 = bigCan.getContext('2d');
          c2.clearRect(0, 0, px, px);
          c2.drawImage(bigImg, 0, 0, px, px);
          bigKey = key;
          bigUp = false;                      // the pixels changed; re-upload
        }

        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, texBig);
        if (!bigUp){
          try {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bigCan);
            bigUp = true;
          } catch (err){ bigUp = false; }
        }

        if (bigUp){
          /* IT TRAVELS AND TURNS WITH THE BLOCK. The phase that owns this
             stretch of scroll is js/block2.js's, not this file's — this one's
             own progress is spent by the time the white has arrived — so the
             mark is driven by BLOCK2's, and simply sits at its start until
             that module exists. */
          const B = window.BLOCK2;
          const bp = (B && typeof B.progress === 'function')
            ? Math.max(0, Math.min(1, B.progress())) : 0;

          /* ITS OWN WINDOW, CLAMPED AT BOTH ENDS. The mark's whole journey is
             spent between bigStart and bigUntil of the block, so by the time the two
             columns arrive it is long gone — and because t stops at 1 it
             cannot come back up underneath them. Scrolling up runs the same
             function in reverse, which is the out-animation, for free. */
          /* GUARDED AGAINST A WINDOW OF ZERO. bigStart and bigUntil are two
             free dials and nothing stops them meeting; a bare subtraction
             would divide by zero the moment they did, and the mark would
             vanish rather than snap — a control that breaks the thing it is
             pointed at. Below a thousandth the fall is instant, which is what
             those two numbers being equal actually means. */
          const span = Math.max(0.001, CONFIG.bigUntil - CONFIG.bigStart);
          const t = Math.max(0, Math.min(1, (bp - CONFIG.bigStart) / span));

          const Hpx = Math.max(1, innerHeight);
          /* PIXELS FROM THE TOP, then converted once. This shader's uv has y=1
             at the TOP of the screen — the caps are uploaded flipped and read
             at the same coordinate — so a y that grows moves UP, which is
             exactly why the mark rose instead of falling. Doing the arithmetic
             in screen pixels and flipping in one named place is the difference
             between a direction you can reason about and a sign you guess.

             yTop0 is the mark's CENTRE at rest, which is its top edge plus
             half its height — the config is an edge because that is what the
             design measures, and the shader wants a centre. */
          const yTop0 = CONFIG.bigTop + sizeCss / 2;
          const yTop  = yTop0 + t * CONFIG.bigSpeed * Hpx;
          const cy = 1 - (yTop / Hpx);

          const rot = t * CONFIG.bigTurns * Math.PI * 2;

          /* HALF the size, in uv, per axis — see the note in the shader. */
          const hw = (sizeCss / 2) / Math.max(1, innerWidth);
          const hh = (sizeCss / 2) / Math.max(1, innerHeight);

          gl.uniform1i(U.big, 3);
          gl.uniform4f(U.bigRect, CONFIG.bigX, cy, hw, hh);
          gl.uniform1f(U.bigRot, rot);
          gl.uniform3fv(U.bigCol, hex3(CONFIG.bigColour));
          gl.uniform1f(U.bigA, Math.max(0, Math.min(1, CONFIG.bigAlpha)));
          hasBig = 1;
        }
      }
      gl.uniform1f(U.hasBig, hasBig);

      const gsrc = scope.querySelector('.work-blobs');
      let hasG = 0;
      if (CONFIG.uploads && gsrc && gsrc.width > 1){
        try {
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, texG);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gsrc);
          gl.uniform1i(U.ground, 1);
          hasG = 1;
        } catch (err){ hasG = 0; }
      }
      gl.uniform1f(U.hasGround, hasG);

      /* THE CAPTION LAYER, on TEXTURE2 — its own unit again, for the reason
         given above the ground's: two textures sharing a unit means the second
         bind silently replaces the first, and the symptom is something
         vanishing rather than an error. */
      const csrc = scope.querySelector('.b2-cap');
      let hasC = 0;
      if (CONFIG.uploads && csrc && csrc.width > 1){
        try {
          gl.activeTexture(gl.TEXTURE2);
          gl.bindTexture(gl.TEXTURE_2D, texC);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, csrc);
          gl.uniform1i(U.cap, 2);
          hasC = 1;
        } catch (err){ hasC = 0; }
      }
      gl.uniform1f(U.hasCap, hasC);

      /* Written after the branch, because the names are identical on both
         programs and the treatment is the same either way. */
      gl.uniform1f(U.lensBarrel, C.lensBarrel);
      gl.uniform1f(U.lensChroma, C.lensChroma);
      gl.uniform1f(U.blurAmt, C.blurAmt);
      gl.uniform1i(U.blurSteps, Math.max(1, Math.min(6, Math.round(C.blurSteps))));
      gl.uniform1f(U.rayGain, C.rayGain);
      gl.uniform1f(U.rayCount, C.rayCount);
      gl.uniform1f(U.raySpeed, C.raySpeed);
      gl.uniform1f(U.rayFall, C.rayFall);
      gl.uniform3fv(U.rayCol, hex3(C.rayCol));
      gl.uniform1f(U.holoGain, C.holoGain);
      gl.uniform1f(U.holoBands, C.holoBands);
      gl.uniform1f(U.holoSpeed, C.holoSpeed);
      gl.uniform1f(U.holoFlicker, C.holoFlicker);
      gl.uniform3fv(U.holoTint, hex3(C.holoTint));
      gl.uniform1f(U.dissolve, C.dissolve);
      gl.uniform1f(U.dissolveScale, C.dissolveScale);
      gl.uniform2f(U.postOrigin, C.originX, C.originY);
      gl.uniform3fv(U.white, hex3(C.white));
      gl.uniform3fv(U.whiteFoot, hex3(C.whiteFoot));
      gl.uniform1f(U.crt, C.crt ? 1 : 0);
      gl.uniform1f(U.crtAmt, crtAmount(p));
      gl.uniform1f(U.crtHold, Math.max(0, Math.min(1, C.crtHold)));
      gl.uniform1f(U.crtBand, Math.max(0.0005, C.crtBand));
      gl.uniform1f(U.scanCount, C.crtScanCount);
      gl.uniform1f(U.scanDepth, C.crtScanDepth);
      gl.uniform1f(U.curve, C.crtCurvature);
      gl.uniform1f(U.vig, C.crtVignette);
      gl.uniform1f(U.con, C.crtContrast);
      gl.uniform1f(U.sat, C.crtSaturation);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      /* BACK TO THE SCREEN, and back to this module's own state. When the head
         shares this context it has just finished drawing into headFbo and left
         both the target and DEPTH_TEST/CULL_FACE where it needed them. */
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      compositeState();
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      /* 'visible', not ''. The class sets visibility:hidden, so clearing the
         inline value falls back to the rule and the sheet stays invisible —
         which is exactly what it did, silently, with the readout cheerfully
         reporting 100%. */
      canvas.style.visibility = p > 0.0005 ? 'visible' : 'hidden';
    } else if (canvas){
      canvas.style.visibility = 'hidden';
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  window.MASKSCROLL = {
    config: CONFIG,
    /* 0 while block 01 has the screen, 1 once block 02 has it. js/mask.js
       reads it to decide whose the pointer is. */
    progress(){ return Math.max(0, Math.min(1, current / Math.max(CONFIG.overPx, 1))); },
    apply(){ resize(); shareHead(); },
    seek(v){ target = current = Math.max(0, Math.min(1, v)) * CONFIG.overPx; },
    readout(){
      const d = defines();
      return { sheet: failed ? 'failed' : (canvas ? 'ready' : 'idle'),
               white: (current / Math.max(CONFIG.overPx, 1) * 100).toFixed(0) + '%',
               /* What is actually compiled in right now. Everything absent
                  from this line costs nothing — not a tap, not an octave. */
               compiled: d.length ? d.map(n => n.slice(3).toLowerCase()).join(' ') : 'none',
               programs: progs.size + ' built' };
    },
  };

  return function destroy(){
    alive = false;
    gateBody(true);
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
    if (window.MASKSCROLL && window.MASKSCROLL.config === CONFIG) delete window.MASKSCROLL;
  };
});
