/* ==========================================================================
   err.js — the 404.

   THE PAGE IS ONE CANVAS. An infinite field of the ticket from Figma
   (14781:15649), the character blobs underneath it, a camera that leans with
   the pointer, and the codepen's CRT lens over the whole thing. Four things,
   two draw calls, one texture that is painted once.

   WHY IT IS BUILT THIS WAY, AND NOT AS DOM + VFX-JS
   The brief asks for two things that fight each other on a DOM page: an
   INFINITE field, and a post effect over EVERYTHING. A post effect has to read
   the finished picture as a texture, and the only way to get DOM into a
   texture is to rasterise the document — which is what VFX-JS does, every
   frame, and it is why those pages stutter. But this page's content never
   changes: one ticket, repeated. Draw it once into a 462x1050 texture and the
   field, the mirroring, the camera and the lens are all shader arithmetic over
   that one image. Nothing is re-rasterised while the pointer moves, and the
   field costs the same whether it is five columns or five thousand.

   THE GRID, MEASURED OFF THE FIGMA FRAME
     card         462 x 1050
     pitch        472 x 1060   (the 10px gutter, both axes)
     phase        cards sit at x = 257 + 472k and y = 10 + 1060k
     ALTERNATE COLUMNS ARE MIRRORED, not offset. Three landmarks put it beyond
     doubt — inside the card the header sits at y 0, "project 0309" at 37 and
     the hearts at 35; in the odd columns those same three land at 1050, 1013
     and 1015, which is 1050 minus each. The type in those columns is upside
     down in the render, which is the design and not a bug.

   THE CAMERA is a translation of the whole field and nothing else — one plane,
   eased, +-40px. There is no depth here on purpose: two layers moving at
   different rates would be a parallax, and the brief asked for a camera.
   ========================================================================== */
/* THE TWO FILES THIS PAGE ALONE NEEDS, fetched by this page alone. The site's
   other pages carry the whole script list in their markup, which is right for
   modules every page uses and wasteful for a ticket only the 404 draws. Same
   pattern js/about-figure.js uses for its meshes: look for the global, inject
   the script if it is missing, boot when it lands. Costs the other three pages
   nothing at all. */
(function inject(){
  const NEED = [['ERR_ART', 'js/err-art.js'], ['ERR_CARD', 'js/err-card.js']];
  for (const [g, src] of NEED){
    if (window[g]) continue;
    if (document.querySelector('script[data-err-src="' + g + '"]')) continue;
    const el = document.createElement('script');
    el.src = src; el.async = false; el.setAttribute('data-err-src', g);
    document.head.appendChild(el);
  }
})();

window.PAGE.register('err', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'err') return;
  const canvas = scope.querySelector('#errField');
  if (!canvas) return;

  /* WAIT FOR THE TWO, then run this same function again. PAGE.register hands
     back a destroy(); returning one that cancels the wait is what stops a
     navigation away mid-load from booting into a container that is gone. */
  /* THE LINKS ARE MADE NOW, SYNCHRONOUSLY, AND THE ORDER IS THE WHOLE REASON.
     js/contact-cta.js gives the site its hover — it collects
     scope.querySelectorAll('[data-scramble]') ONCE, at mount, and binds what it
     finds. This module mounts before it in the script list, but its own boot is
     deferred until two art files land over the network. Build the links inside
     that wait and they would not exist yet when contact-cta.js looks, and they
     would be the only buttons on the site without the hover — silently. So the
     DOM is made here, on the synchronous path, and boot() only ever moves it. */
  const bars = makeBars(scope, canvas);

  if (!window.ERR_ART || !window.ERR_CARD){
    let alive = true, tid = 0;
    let teardown = null;
    (function poll(){
      if (!alive) return;
      if (window.ERR_ART && window.ERR_CARD){ teardown = boot(scope, canvas, bars); return; }
      tid = setTimeout(poll, 40);
    })();
    return function (){ alive = false; clearTimeout(tid); if (teardown) teardown(); };
  }
  return boot(scope, canvas, bars);
});

/* ONE BUTTON, AND THE FIGMA FILE IS UNAMBIGUOUS ABOUT IT. The assembled page
   (14781:15649) contains exactly ONE "Frame 1484584743" — the GO HOME bar —
   and exactly one "Go home" text, on the card at x=729. Not one per ticket.

   I built a pool of sixteen, one over every ticket, because the bar is part of
   the COMPONENT and every ticket is that component. It is in the component and
   deliberately absent from every instance but one, which is a thing a design
   file can say and a spec sheet cannot. What it looked like was a button glued
   to the top-left corner of the window, which is what got reported.

   So: one link, on one cell of the infinite field, chosen at mount as the
   unmirrored card nearest the middle of the screen. It travels with the camera
   like everything else, and the camera's reach is far short of carrying it off
   the screen. */
function makeBars(scope, canvas){
  const host = document.createElement('div');
  host.className = 'err__bars';
  const a = document.createElement('a');
  a.className = 'err__go';
  a.href = '/';
  a.setAttribute('data-scramble', '');
  a.hidden = true;
  const sp = document.createElement('span');
  sp.setAttribute('data-label', '');
  sp.textContent = 'go home';
  a.appendChild(sp);
  host.appendChild(a);
  canvas.parentNode.appendChild(host);
  return [a];
}

function boot(scope, canvas, bars){
  'use strict';
  const CARD = window.ERR_CARD;

  const CONFIG = {
    /* ---- the room ---- */
    paper: '#e8271c',   // the site's red · Figma's is a shade purer
    ink:   '#000000',
    blobs: 0.55,        // how strongly the character field shows through
    cardOpacity: 1,     // below 1 lets the blobs come up through the tickets
    /* OVER THE TICKETS, NOT UNDER THEM — and this is the fix for two
       complaints at once. Under them, the field is a wall of opaque red and
       the only place the blobs could show was the 10px gutter, which is why
       they read as THIN LINES across the page rather than as the blob. Over
       the tickets there is no gutter artefact and the blob is simply on the
       page, the way it is on every other page of the site. */
    groundOver: true,

    /* ---- the camera ---- */
    camOn: true,
    camX: 300,           // px the field travels at the left/right edge
    camY: 201,           // ...and top/bottom
    camEase: 0.92,       // seconds to catch up · a camera has weight
    driftX: 0, driftY: 0,   // px per second when nobody is touching it

    /* ---- the lens, from the codepen ----
       Every term below is the pen's, at the pen's value, with one exception
       that is called out on its own line. */
    crt: true,
    crtZoom: 1.0,
    /* THE ONE CHANGE, AND IT IS DELIBERATE. The pen runs 0.5 here, which
       magnifies the page two-fold before distorting it. On a scrolling article
       that only decides how much you see; on THIS page the scale IS the
       design — at 0.5 the ticket is twice its Figma size and two and a half
       columns fill the screen instead of five. So the base is 1, which is the
       same shader with the magnification taken out, and the dial goes back to
       0.5 if you want the pen's framing. */
    crtBarrel: 0.3,     // pen: pow(l,2)*0.3
    crtSpray: 0.3,      // pen: rd * pow(l*0.7,3) * 0.3
    crtAber: 0.05,      // pen: the 0.05 in `d`
    crtAberFix: 0.0015, // pen: the flat r/b split
    crtScan: 0.05,      // pen: scanline amplitude
    /* 0. THE SQUARES ON THE BACKGROUND. This is the pen's 20x20 grid — a thin
       line every twentieth of the screen, both ways — and on its photographs it
       reads as a CRT's shadow mask. Over a flat red field it reads as a grid
       drawn on the page, which is not in the design. */
    crtGrid: 0,
    crtVig: 1.8,        // pen: 1.8 - l*l
    crtDither: 0,     // pen: rand * 0.1
    crtSpeed: 1,        // multiplies `time` everywhere in the lens
    /* 1 keeps the pen's look at page scale · above 1 walks toward the pen's
       raw arithmetic, which on a full window is a porthole. See the note in
       the lens shader. */
    crtSpread: 1.3,
    /* 1 leaves the middle of the screen at the design's own colour · the pen
       runs the equivalent of 1.8 there, which clips a saturated red. */
    crtGain: 1,

    /* ---- the pen's SECOND shader, per ticket ----
       In the pen this runs on each <img>/<h1>/<p>; here the repeating unit is
       a ticket, so the grid index is the `id` and every card glitches on its
       own clock. Same maths, same thresholds. */
    glitch: true,
    glitchRate: 43,     // pen: floor(time*43)
    glitchAmt: 1,       // scales the pen's 0.1/0.2/0.3 slips
  };

  /* ---- GL ---------------------------------------------------------------- */
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false,
                                          preserveDrawingBuffer: false });
  if (!gl){ canvas.style.display = 'none'; return; }

  const VERT = `
    attribute vec2 aPos;
    void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

  /* THE FIELD. Tiling, mirroring and the ground, in that order. */
  const FIELD = `
    precision highp float;
    uniform vec2  uRes, uCam;
    uniform float uTime, uDpr;
    uniform sampler2D uCard, uBlobs;
    uniform vec3  uPaper;
    uniform float uBlobMix, uCardA, uGroundOver;
    uniform float uGlitch, uGlitchRate, uGlitchAmt;

    float rand2(vec2 p){ return fract(sin(dot(p, vec2(829.0, 483.0))) * 394.0); }

    void main(){
      vec2 f = gl_FragCoord.xy;
      /* The page's own axes: x right, y DOWN from the top, plus the camera.

         DIVIDED BY THE DEVICE RATIO, and that is not a detail. gl_FragCoord is
         in DEVICE pixels; 462 and 1050 are the Figma numbers, which are CSS
         pixels. Skip this and the whole grid comes out at half size on any
         retina screen and exactly right on the one monitor you happened to
         test — a bug that hides from the machine you are working on. */
      vec2 world = vec2(f.x / uDpr + uCam.x, (uRes.y - f.y) / uDpr + uCam.y);

      /* Which column, and where inside it. floor() on a negative index is what
         makes the field extend to the left as happily as to the right — the
         reason there is no "start" tile anywhere in this file. */
      float ci = floor((world.x - 257.0) / 472.0);
      float lx = world.x - 257.0 - ci * 472.0;
      float ri = floor((world.y - 10.0) / 1060.0);
      float ty = world.y - 10.0 - ri * 1060.0;

      /* THE MIRROR. Not an offset — the same ticket, flipped, which is why the
         type in these columns reads upside down. */
      float flip = mod(ci, 2.0) == 0.0 ? 1.0 : 0.0;
      float cy = mix(ty, 1050.0 - ty, flip);

      /* The pen's second shader, per ticket. Its id is the grid cell, so two
         tickets never slip at the same moment. */
      float id = ci * 7.0 + ri * 13.0;
      vec2 cuv = vec2(lx / 462.0, cy / 1050.0);
      vec2 ur = cuv, ug = cuv, ub = cuv;
      if (uGlitch > 0.5){
        float r = rand2(vec2(floor(uTime * uGlitchRate), id));
        if (r > 0.8){
          float y = sin(floor(cuv.y / 0.07)) + sin(floor(cuv.y / 0.003 + uTime));
          float g = (rand2(vec2(y, floor(uTime * 5.0) + id)) * 2.0 - 1.0) * uGlitchAmt;
          ur.x += g * 0.1; ug.x += g * 0.2; ub.x += g * 0.3;
        }
        float r2 = rand2(vec2(floor(uTime * 37.0), id + 10.0));
        if (r2 > 0.9){
          ur.x += sin(cuv.y * 7.0 + uTime + id + 1.0) * 0.03 * uGlitchAmt;
          ug.x += sin(cuv.y * 5.0 + uTime + id + 2.0) * 0.03 * uGlitchAmt;
          ub.x += sin(cuv.y * 3.0 + uTime + id + 3.0) * 0.03 * uGlitchAmt;
        }
      }

      /* THE GROUND, UNDER THE TICKETS. The blobs are js/work-cursor.js's own
         canvas sampled in SCREEN space, not world space — it is a cursor
         effect and it belongs to the window, not to the field, so it must not
         travel with the camera. */
      vec3 col = uPaper;
      vec4 b = texture2D(uBlobs, f / uRes);
      if (uGroundOver < 0.5) col = mix(col, b.rgb, b.a * uBlobMix);

      float inside = step(0.0, lx) * step(lx, 461.999)
                   * step(0.0, cy) * step(cy, 1049.999);
      if (inside > 0.5){
        float cr = texture2D(uCard, ur).r;
        float cg = texture2D(uCard, ug).g;
        float cb = texture2D(uCard, ub).b;
        float ca = texture2D(uCard, cuv).a;
        col = mix(col, vec3(cr, cg, cb), ca * uCardA);
      }
      if (uGroundOver > 0.5) col = mix(col, b.rgb, b.a * uBlobMix);
      gl_FragColor = vec4(col, 1.0);
    }`;

  /* THE LENS. The codepen's post shader, term for term. */
  const LENS = `
    precision highp float;
    uniform sampler2D src;
    uniform vec2  resolution;
    uniform float time;
    uniform float uZoom, uBarrel, uSpray, uAber, uAberFix;
    uniform float uScan, uGrid, uVig, uDither, uSpread, uGain;

    vec4 readTex(vec2 uv){
      vec4 c = texture2D(src, uv);
      c.a *= smoothstep(0.5, 0.499, abs(uv.x - 0.5))
           * smoothstep(0.5, 0.499, abs(uv.y - 0.5));
      return c;
    }
    vec2 zoom(vec2 uv, float t){ return (uv - 0.5) * t + 0.5; }
    float rand(vec3 p){ return fract(sin(dot(p, vec3(829.0, 4839.0, 432.0))) * 39428.0); }

    void main(){
      vec2 uv = gl_FragCoord.xy / resolution;
      vec2 p = uv * 2.0 - 1.0;
      float aspect = resolution.x / max(resolution.y, 1.0);
      p.x *= aspect;

      /* THE ONE THING THE PEN CANNOT BE COPIED ON, and it is a matter of what
         it is applied TO rather than of taste. In the pen every term below is
         driven by l, the distance from the centre in units where 1 is halfway
         down the element — and it runs on IMAGES AND PARAGRAPHS, boxes a few
         hundred pixels across. Its corners reach l ~ 1.7 and the vignette
         (1.8 - l*l) goes negative there, which is exactly the point: each
         element ends up a glowing blob fading to nothing at its own edges.

         Applied to a whole 16:9 window that same arithmetic reaches l = 2.04
         in the corners and the vignette lands at -2.4. Rendered, it is a red
         porthole in the middle of a black screen with the design gone. I have
         the frame to prove it.

         So l is divided by its own value at the corner, which puts it back in
         the 0..1 range the pen's numbers were tuned against. Nothing else is
         touched — same barrel, same spray, same aberration, same scanlines,
         same grid, same dither, same vignette curve. uSpread at 1 is the pen's
         look at page scale; raise it and you walk back toward the porthole. */
      float l = length(p) / max(sqrt(aspect * aspect + 1.0), 1e-4) * uSpread;

      float dist = pow(l, 2.0) * uBarrel;
      dist = smoothstep(0.0, 1.0, dist);
      uv = zoom(uv, uZoom + dist);

      float a = atan(p.y, p.x);
      float rd = rand(vec3(a, time, 0.0));
      uv = (uv - 0.5) * (1.0 + rd * pow(l * 0.7, 3.0) * uSpray) + 0.5;

      vec2 uvr = uv, uvg = uv, uvb = uv;
      float d = (1.0 + sin(uv.y * 20.0 + time * 3.0) * 0.1) * uAber;
      uvr.x += uAberFix;
      uvb.x -= uAberFix;
      uvr = zoom(uvr, 1.0 + d * l * l);
      uvb = zoom(uvb, 1.0 - d * l * l);

      vec4 cr = readTex(uvr), cg = readTex(uvg), cb = readTex(uvb);
      vec4 outColor = vec4(cr.r, cg.g, cb.b, (cr.a + cg.a + cb.a));

      vec4 deco = vec4(0.0);
      float res = resolution.y;
      deco += (sin(uv.y * res * 0.7 + time * 100.0) *
               sin(uv.y * res * 0.3 - time * 130.0)) * uScan;
      deco += smoothstep(0.01, 0.0, min(fract(uv.x * 20.0), fract(uv.y * 20.0))) * uGrid;
      outColor += deco * smoothstep(2.0, 0.0, l);
      /* THE SECOND THING THE PEN CANNOT BE COPIED ON, and it is the same
         reason as the first: this is a MULTIPLY, and at the centre it is x1.8.
         Over the pen's photographs on a dark page that is a glow. Over a flat
         saturated red it is a clip — #e8271c times 1.8 is (1.63, 0.27, 0.20),
         the red channel saturates, and the page comes out orange. So the curve
         is divided by its own value at the centre: the falloff toward the
         corners is the pen's, exactly, and the middle of the screen keeps the
         colour the design actually specifies. uGain puts the brightening back
         if you want it. */
      outColor *= (uVig - l * l) / max(uVig, 1e-4) * uGain;
      outColor += rand(vec3(p, time)) * uDither;
      gl_FragColor = vec4(outColor.rgb, 1.0);
    }`;

  function compile(src, type){
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)){
      console.warn('[err] shader:', gl.getShaderInfoLog(s)); return null;
    }
    return s;
  }
  function program(fs){
    const p = gl.createProgram();
    const v = compile(VERT, gl.VERTEX_SHADER), f = compile(fs, gl.FRAGMENT_SHADER);
    if (!v || !f) return null;
    gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)){
      console.warn('[err] link:', gl.getProgramInfoLog(p)); return null;
    }
    return p;
  }
  const pField = program(FIELD), pLens = program(LENS);
  if (!pField || !pLens){ canvas.style.display = 'none'; return; }

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);

  function bindQuad(p){
    const a = gl.getAttribLocation(p, 'aPos');
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  }
  const U = (p, n) => gl.getUniformLocation(p, n);

  function tex(){
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return t;
  }
  const cardTex = tex(), blobTex = tex(), fieldTex = tex();
  const fbo = gl.createFramebuffer();

  /* A 1x1 stand-in so the first frames have something to sample if the blob
     canvas has not been mounted yet. Transparent, so it contributes nothing. */
  gl.bindTexture(gl.TEXTURE_2D, blobTex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 0, 0]));

  /* ---- the card, painted once -------------------------------------------- */
  const cardCv = document.createElement('canvas');
  const cardCtx = cardCv.getContext('2d');
  let cardScale = 0;

  function paintCard(){
    const S = Math.min(3, Math.max(1, Math.round(dpr * 2)));
    if (S === cardScale) return;
    cardScale = S;
    cardCv.width = CARD.W * S; cardCv.height = CARD.H * S;
    cardCtx.setTransform(1, 0, 0, 1, 0, 0);
    cardCtx.clearRect(0, 0, cardCv.width, cardCv.height);
    CARD.draw(cardCtx, S, { paper: CONFIG.paper, ink: CONFIG.ink });
    gl.bindTexture(gl.TEXTURE_2D, cardTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cardCv);
  }
  /* AFTER THE FONT, and this is the one ordering that matters here. A canvas
     asked to draw in a face the document has not loaded silently falls back to
     the system mono, and every column width on the ticket comes out wrong with
     no error anywhere. Painted once now for the first frame, once more when
     the face lands. */
  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(() => { cardScale = 0; paintCard(); });

  /* ---- size --------------------------------------------------------------- */
  let dpr = 1, W = 1, H = 1;
  function measure(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width * dpr));
    H = Math.max(1, Math.round(r.height * dpr));
    canvas.width = W; canvas.height = H;
    gl.bindTexture(gl.TEXTURE_2D, fieldTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    paintCard();
    /* NOT solveBarCell() HERE. measure() runs at mount, before the `let barC`
       further down has been reached, and touching it from up here throws
       "Cannot access 'barC' before initialization" — a temporal dead zone, and
       it takes the whole page down. The resize path calls both, in order. */
  }
  measure();

  const on = window.PAGE.bindings();
  let rt; on(window, 'resize', () => { clearTimeout(rt);
    rt = setTimeout(() => { measure(); solveBarCell(); }, 150); });

  /* ---- the camera --------------------------------------------------------- */
  let wantX = 0, wantY = 0, gotX = 0, gotY = 0, drift = 0;
  on(window, 'pointermove', e => {
    wantX = (e.clientX / Math.max(1, innerWidth))  * 2 - 1;
    wantY = (e.clientY / Math.max(1, innerHeight)) * 2 - 1;
  }, { passive: true });
  on(document, 'pointerleave', () => { wantX = wantY = 0; });

  /* ---- the ground --------------------------------------------------------- */
  function blobSource(){
    const c = scope.querySelector('canvas.work-blobs');
    return (c && c.width > 0 && c.height > 0) ? c : null;
  }

  let raf = 0, last = performance.now(), t0 = last;

  function frame(now){
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.1); last = now;
    const time = (now - t0) / 1000;

    const k = 1 - Math.exp(-dt / Math.max(0.001, CONFIG.camEase));
    if (CONFIG.camOn){ gotX += (wantX - gotX) * k; gotY += (wantY - gotY) * k; }
    drift += dt;

    const camX = gotX * CONFIG.camX + drift * CONFIG.driftX;
    const camY = gotY * CONFIG.camY + drift * CONFIG.driftY;

    const src = blobSource();
    if (src){
      gl.bindTexture(gl.TEXTURE_2D, blobTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    }

    /* ---- pass 1: the field, into a texture ---- */
    const target = CONFIG.crt ? fbo : null;
    gl.bindFramebuffer(gl.FRAMEBUFFER, target);
    if (CONFIG.crt)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                              gl.TEXTURE_2D, fieldTex, 0);
    gl.viewport(0, 0, W, H);
    gl.useProgram(pField); bindQuad(pField);
    gl.uniform2f(U(pField, 'uRes'), W, H);
    gl.uniform2f(U(pField, 'uCam'), camX, camY);
    gl.uniform1f(U(pField, 'uTime'), time);
    gl.uniform1f(U(pField, 'uDpr'), dpr);
    const rgb = hex(CONFIG.paper);
    gl.uniform3f(U(pField, 'uPaper'), rgb[0], rgb[1], rgb[2]);
    gl.uniform1f(U(pField, 'uBlobMix'), CONFIG.blobs);
    gl.uniform1f(U(pField, 'uCardA'), CONFIG.cardOpacity);
    gl.uniform1f(U(pField, 'uGroundOver'), CONFIG.groundOver ? 1 : 0);
    gl.uniform1f(U(pField, 'uGlitch'), CONFIG.glitch ? 1 : 0);
    gl.uniform1f(U(pField, 'uGlitchRate'), CONFIG.glitchRate);
    gl.uniform1f(U(pField, 'uGlitchAmt'), CONFIG.glitchAmt);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, cardTex);
    gl.uniform1i(U(pField, 'uCard'), 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, blobTex);
    gl.uniform1i(U(pField, 'uBlobs'), 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    placeBars(camX, camY);

    if (!CONFIG.crt) return;

    /* ---- pass 2: the lens, to the screen ---- */
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, W, H);
    gl.useProgram(pLens); bindQuad(pLens);
    gl.uniform2f(U(pLens, 'resolution'), W, H);
    gl.uniform1f(U(pLens, 'time'), time * CONFIG.crtSpeed);
    gl.uniform1f(U(pLens, 'uZoom'), CONFIG.crtZoom);
    gl.uniform1f(U(pLens, 'uBarrel'), CONFIG.crtBarrel);
    gl.uniform1f(U(pLens, 'uSpray'), CONFIG.crtSpray);
    gl.uniform1f(U(pLens, 'uAber'), CONFIG.crtAber);
    gl.uniform1f(U(pLens, 'uAberFix'), CONFIG.crtAberFix);
    gl.uniform1f(U(pLens, 'uScan'), CONFIG.crtScan);
    gl.uniform1f(U(pLens, 'uGrid'), CONFIG.crtGrid);
    gl.uniform1f(U(pLens, 'uVig'), CONFIG.crtVig);
    gl.uniform1f(U(pLens, 'uDither'), CONFIG.crtDither);
    gl.uniform1f(U(pLens, 'uSpread'), CONFIG.crtSpread);
    gl.uniform1f(U(pLens, 'uGain'), CONFIG.crtGain);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fieldTex);
    gl.uniform1i(U(pLens, 'src'), 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /* WHICH CELL THE BUTTON BELONGS TO. Solved once per resize, not per frame:
     it is a property of the page, and a button that re-chose its ticket while
     you moved the mouse would wander. ODD columns only — those are the
     unmirrored ones, and the Figma bar is on an unmirrored card, which is also
     the only way the label reads the right way up. */
  let barC = 1, barR = 0;
  function solveBarCell(){
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    let best = Infinity;
    for (let c = -3; c <= 8; c++){
      if ((((c % 2) + 2) % 2) === 0) continue;          // mirrored column
      const d = Math.abs((257 + c * 472 + 231) - w / 2);
      if (d < best){ best = d; barC = c; }
    }
    best = Infinity;
    for (let r = -3; r <= 8; r++){
      const d = Math.abs((10 + r * 1060 + CARD.BAR.y + 8) - h / 2);
      if (d < best){ best = d; barR = r; }
    }
  }
  solveBarCell();

  /* WHERE IT LANDS THIS FRAME, in CSS pixels, from the same three numbers the
     shader tiles with — so the button and the ticket under it can never drift
     apart however far the camera travels. */
  function placeBars(camX, camY){
    const B = CARD.BAR, el = bars[0];
    if (!el) return;
    const x = 257 + barC * 472 - camX;
    const y = 10 + barR * 1060 - camY + B.y;
    el.hidden = false;
    el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
  }

  function hex(h){
    const n = parseInt(String(h).replace('#', ''), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  raf = requestAnimationFrame(frame);

  window.ERR = {
    config: CONFIG,
    apply(){ cardScale = 0; paintCard(); },
    readout(){
      return { card: cardCv.width + 'x' + cardCv.height,
               canvas: W + 'x' + H, dpr: dpr.toFixed(1),
               cam: camLabel(), blobs: blobSource() ? 'on' : '—',
               lens: CONFIG.crt ? 'on' : 'off' };
    },
  };
  function camLabel(){
    return (gotX * CONFIG.camX).toFixed(0) + ', ' + (gotY * CONFIG.camY).toFixed(0) + 'px';
  }

  return function destroy(){
    on.release();
    cancelAnimationFrame(raf);
    const host = scope.querySelector('.err__bars');
    if (host && host.parentNode) host.parentNode.removeChild(host);
    if (window.ERR && window.ERR.config === CONFIG) delete window.ERR;
  };
}
