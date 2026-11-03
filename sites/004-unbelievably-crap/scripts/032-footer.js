/* ==========================================================================
   footer.js — part 3: the page turning red.

   IT RIDES BLOCK 02'S SCROLL, at the tail, exactly as the old footer did.
   js/block2.js already carries the whole phase as one constant-rate column
   and publishes how far along it is, so this is one more thing read off that
   number rather than a fourth timeline. That is the only reason the page
   still has one scroll and not four.

   ---- SCRUBBED, NOT TRIGGERED, and this is the reversal from the old file --
   The footer that this replaces was a STATE: crossing a threshold started a
   700ms roll-out and the wheel was finished with it. That was right for a bar
   that is shut or open, and it is wrong here. The brief for this section is
   that the transition INTO it is the scrolling — the red comes up under your
   hand, at the rate you are moving, and if you stop half way you are looking
   at a half-red screen, which is a real place to be rather than a broken one.
   So the ramp is a pure function of the phase again.

   ---- THE RED MULTIPLIES, IT DOES NOT COVER -------------------------------
   The obvious build is a panel that starts #ffffff — matching the block above
   — and animates to red. It is a trap twice over.

   First, the white above is a canvas composite with its own value, so the
   panel would have to match it exactly and would show a seam on any frame
   where it did not. Fading a colour in OVER whatever is there needs to know
   nothing about the white and lands on the same red regardless.

   Second, and this is the one that matters to the look: an OPAQUE red deletes
   the section underneath. Block 02's composite is still drawing when the
   footer arrives — the head, the ASCII ground, the blob — and all of it went
   black-red-nothing. Multiplied, white goes to the colour and everything
   darker keeps its darkness, so the head reads as a deeper red inside the
   field. That is the gallery's own treatment (js/tint.js, the same dials) and
   it is why the sheet is a separate element appended to the page rather than
   a background on the panel: a blend mode only sees the backdrop inside its
   own stacking context, and the panel has a z-index.

   THE TWO WHITE CAPTIONS ARE THE EXCEPTION and they are switched off from
   here, through BLOCK2.config.capAlpha. Everything the multiply lets through
   is wanted except those, which are the previous section still talking over
   the new one. They are painted into a canvas and sampled as a texture, so
   there is no element to fade and no stylesheet that reaches them — the fade
   has to be asked for at the source.

   ---- THE CONTENT IS FINISHED AND THE TEAR CUTS IT ------------------------
   Block 02's construction, applied here. Its content is not faded in and not
   revealed by a straight line: it is finished, and the displaced boundary cuts
   it per pixel — js/mask-scroll.js samples it as uBlockB and multiplies it by
   the same mask that draws the white. Nothing about it arrives; the edge is
   the only thing that moves.

   The footer's content is DOM — real type, real layout, real links — so it
   cannot go into that texture without being redrawn by hand. It wears the
   boundary instead: SHEETFX.coverPath() renders the tear's own field into a
   small buffer, reads it back and marches it into a `clip-path`, so the panel
   is cut by the shader's edge rather than by a description of it. Shards and
   all: an island of red that has torn loose ahead of the front carries the
   words inside it with it.

   Everything else is a constant. Full strength, live from the first frame,
   never touched again. Two earlier tries are the reason that is spelt out: a
   fade, where the words built up while you watched, and a straight clip a
   little behind the front, which was the same thing with a harder edge. Both
   were something still being assembled. This is a room that was already there
   when the door opened.

   ---- THE BAR LEAVES ------------------------------------------------------
   The site's one constant goes away here, which is the one place on the site
   it is allowed to: the footer has its own navigation in the band and two
   bars of its own underneath, so leaving the page bar on top would be the
   same links twice, ten pixels apart. It slides DOWN rather than fading —
   fading would leave it half-there over the red for the whole ramp, and a
   navigation you can half see is a navigation you try to click.
   ========================================================================== */
window.PAGE.register('footer', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'mask') return;
  const ftr = scope.querySelector('.ftr');
  if (!ftr) return;
  const inr = ftr.querySelector('.ftr__in') || ftr;

  const bar = scope.querySelector('.bar');

  /* APPENDED TO THE PAGE, not to the panel. See the header — a mix-blend-mode
     inside .ftr would blend with the panel's own empty space and read as the
     blend silently not working. Same construction as js/tint.js. */
  const sheet = document.createElement('div');
  sheet.className = 'ftr__sheet';
  sheet.setAttribute('aria-hidden', 'true');
  scope.appendChild(sheet);

  const CONFIG = {
    enabled: true,

    /* WHERE IN BLOCK 02'S PHASE THE RED COMES UP, as shares of that phase —
       so both move with it rather than needing to be re-found every time a
       white text is added or the block's rate is retuned. */
    from: 0.59,

    /* ---- AND THEN IT RUNS EXACTLY AS BLOCK 01 -> 02 DOES ------------------
       `from` is a share, because it is a PLACE in block 02's phase and should
       stay put when that phase is retuned. Everything after it is not: how
       long the change takes is `overPx` pixels of wheel and `ease` seconds of
       filter, which are the two numbers js/mask-scroll.js runs the first
       transition on, and MATCH borrows them from it rather than keeping a
       second copy that can drift.

       The ease is the half that matters and it is the half this file did not
       have. Block 02's own scroll is filtered at 0.02s — as good as none — so
       the red used to move with the wheel exactly, notch for notch, while
       block 01's white glides on for the best part of two seconds after you
       stop. Same distance, completely different thing to be in the middle of.
       Filtering this the same way is what makes them one gesture. */
    match:  'block01',   // block01 · own
    overPx: 300,         // px of wheel, when match is 'own'
    ease:   0.5,         // seconds to close most of the gap, when match is 'own'

    /* Shares of THAT ramp, not of the phase. Everything below happens inside
       the white-to-red crossing, so it is described in the crossing's own
       units — otherwise retuning `from`/`to` would silently move all three. */
    /* TEAR · the shader's own edge cuts the finished panel, as block 02's
       content is cut. FADE · the old opacity ramp, and what happens by itself
       when there is no WebGL to ask for the edge. */
    type: 'tear',
    barAt:   0.30,   // the page bar starts sliding down
    openAt:  0.90,   // the footer's links become clickable
    capGone: 0.55,   // …by which share of the fade the white captions are out

    /* ---- THE TOP CLUSTER'S GEOMETRY --------------------------------------
       The band is placed BELOW the headline by a gap rather than at a share
       of the screen height. Two things measured from different edges will
       always meet somewhere, and where they met was the band cutting the word
       HERE in half on any window shorter than the file's 1080. */
    titleTop: 10,    // px from the top of the screen to the caps
    titleGap: 64,    // px of clear space between the caps and the band

    /* ---- WHAT THE RED IS ------------------------------------------------
       The gallery's dials, because it is the gallery's treatment: a colour, a
       blend and a strength. MULTIPLY is the one the design draws — white goes
       to the colour, black stays black, and the head underneath survives as a
       darker red. NORMAL is the opaque version and deletes everything under
       it, which is worth being able to see once. */
    colour: '#ff0000',
    blend:  'multiply',
    amount: 1,

    /* ---- HOW THE RED ARRIVES ---------------------------------------------
       TEAR is the same displaced edge the rest of the site changes rooms with,
       scrubbed by this same scroll. FADE is the old uniform opacity ramp, kept
       because it is the fallback when there is no WebGL and worth being able
       to put side by side once.

       `dir` is which way that edge travels — up, so the footer rises into the
       screen the way block 02 does. */
    tear: 'tear',   // tear · off (off = the plain fade)
    dir:  'up',     // up · down · left · right

    /* How long the bar's slide takes. It is the one thing here on a clock
       rather than on the scroll: the bar is not part of this composition, it
       is a thing leaving, and a departure that scrubs backwards and forwards
       under the wheel reads as a glitch rather than as an exit. */
    barMs: 420,
  };

  /* Written to the panel rather than kept in the stylesheet, so the two dials
     below are live. Called at mount and from their setters. */
  function shape(){
    ftr.style.setProperty('--ftr-title-top', CONFIG.titleTop + 'px');
    ftr.style.setProperty('--ftr-title-gap', CONFIG.titleGap + 'px');
  }

  const on = window.PAGE.bindings();
  let raf = 0, lastT = performance.now(), smooth = 0;
  let lastMix = -1, lastInk = -1, lastOpen = null, lastGone = null, lastLive = null;
  /* WHETHER THE CANVAS TOOK THE LAST FRAME, kept across frames: the scrub is
     only called when the progress actually moved, and everything that follows
     it needs to know which of the two paths painted. */
  let lastCut = 0, lastCutM = -1, cut = null, drawn = false;

  const clamp01 = v => Math.max(0, Math.min(1, v));

  function frame(now){
    if (!window.PAGE || !document.body.contains(ftr)) return;
    raf = requestAnimationFrame(frame);

    const dt = Math.min((now - lastT) / 1000, 0.1); lastT = now;

    /* THE FIRST TRANSITION'S OWN NUMBERS, borrowed rather than copied. */
    const MS = window.MASKSCROLL;
    const src = (CONFIG.match === 'block01' && MS && MS.config) ? MS.config : CONFIG;
    const overPx = Math.max(1, src.overPx);
    const tau = Math.max(0.001, src.ease);

    const B = window.BLOCK2;
    /* IN PIXELS OF WHEEL, not in shares of the phase — a share would make the
       footer four times slower than block 01 -> 02 on this page and something
       else again on the next one, because block 02's phase is five and a half
       screens long and block 01's transition is three hundred pixels. */
    const span = (B && typeof B.span === 'number') ? B.span : 0;
    const trav = (B && typeof B.travel === 'number') ? B.travel : 0;
    const raw = (CONFIG.enabled && span > 0)
      ? clamp01((trav - CONFIG.from * span) / overPx) : 0;

    /* The same filter js/mask-scroll.js runs on its own travel, and the same
       time constant. Easing the progress and easing the distance are the same
       thing here, because one is a straight line in the other. */
    smooth += (raw - smooth) * (1 - Math.exp(-dt / tau));
    if (Math.abs(raw - smooth) < 0.0005) smooth = raw;
    const mix = smooth;

    /* VISIBILITY IS GATED, NOT THE OPACITY. At mix 0 the panel is fully
       transparent and would cost nothing to leave visible — except that it is
       a full-screen fixed layer above everything, so it would eat the pointer
       and the whole page above would stop being clickable. */
    const live = mix > 0.001;
    if (live !== lastLive){
      lastLive = live;
      ftr.classList.toggle('is-live', live);
      ftr.setAttribute('aria-hidden', live ? 'false' : 'true');
    }

    /* Quantised before writing: a custom property written every frame at full
       float precision is a style recalculation a frame for a change nobody can
       see. A thousandth is finer than the screen can show. */
    const m = Math.round(mix * Math.max(0, Math.min(1, CONFIG.amount)) * 1000) / 1000;
    if (m !== lastMix){
      lastMix = m;
      /* ---- THE RED ARRIVES BY THE TEAR, NOT BY A FADE ---------------------
         It used to be an opacity ramp on a plain div — the whole screen going
         evenly redder. That was never the right picture: every other change of
         room on this site is a displaced edge travelling across the screen,
         and the footer was the one that dissolved uniformly, which reads as a
         filter being applied rather than as somewhere new arriving.

         So it is the same shader, scrubbed by the same scroll that drives it —
         js/transition-sheet.js's scrub(), which is one frame at a progress
         this file owns. One effect with one set of dials; tune the tear
         anywhere and the footer follows.

         MULTIPLIED, via `blend`. A page transition covers the screen; this one
         has to let the head and the ground show through it, exactly as the
         gallery's red does. See .sheetfx.is-blend in css/transition.css.

         THE DIV IS STILL THERE AND STILL DOES THE WORK IF THE CANVAS CANNOT.
         No WebGL, a lost context, the effect switched off — the old opacity
         ramp is what happens, and the section still arrives. */
      const FX = window.SHEETFX;
      drawn = FX && typeof FX.scrub === 'function' && CONFIG.tear !== 'off'
        && FX.scrub(m, { dir: CONFIG.dir, top: CONFIG.colour, foot: CONFIG.colour,
                         blend: CONFIG.blend !== 'normal' });
      /* Only one of the two paints. A canvas that took the frame and a div at
         the same opacity underneath it would be the colour applied twice. */
      sheet.style.setProperty('--ftr-mix', drawn ? '0' : m.toFixed(3));
      sheet.style.setProperty('--ftr-col', CONFIG.colour);
      sheet.style.setProperty('--ftr-blend', CONFIG.blend);
    }

    /* THE TWO WHITE CAPTIONS GO OUT WITH THE RED COMING IN. Tied to the same
       ramp rather than to a threshold: they are being replaced, not switched
       off, and a hard cut would be a line vanishing while the thing replacing
       it is still half-way there. */
    const B2 = window.BLOCK2;
    if (B2 && B2.config){
      const want = Math.round((1 - clamp01(mix / Math.max(1e-4, CONFIG.capGone))) * 100) / 100;
      if (want !== B2.config.capAlpha) B2.config.capAlpha = want;
    }

    /* ---- THE TYPE. See the header: it is cut, not faded --------------------
       coverPath() hands back a clip path in viewport pixels, 'none' once the
       screen is entirely covered, or null when there is no WebGL to ask — and
       null is the whole reason the ramp below still exists. A torn clip over a
       red that is fading evenly would be an edge with nothing to explain it,
       so with no canvas the panel goes back to arriving by opacity. */
    if (m !== lastCutM){
      lastCutM = m;
      const FX2 = window.SHEETFX;
      cut = (drawn && CONFIG.type === 'tear' && FX2 && typeof FX2.coverPath === 'function')
        ? FX2.coverPath(m, { dir: CONFIG.dir }) : null;
    }
    const ink = cut === null ? Math.round(clamp01((m - 0.55) / 0.45) * 1000) / 1000 : 1;
    if (ink !== lastInk){
      lastInk = ink;
      ftr.style.setProperty('--ftr-a', ink.toFixed(3));
    }
    if (cut !== lastCut){
      lastCut = cut;
      inr.style.clipPath = cut === null ? 'none' : cut;
    }

    const isOpen = mix >= CONFIG.openAt;
    if (isOpen !== lastOpen){
      lastOpen = isOpen;
      ftr.classList.toggle('is-open', isOpen);
    }

    /* THE BAR. `aria-hidden` as well as the transform: a link that has slid
       off the bottom of the screen is still in the tab order, and a keyboard
       reader would be sent to a navigation nobody can see. */
    const gone = mix >= CONFIG.barAt;
    if (bar && gone !== lastGone){
      lastGone = gone;
      bar.style.setProperty('--bar-out', CONFIG.barMs + 'ms');
      bar.classList.toggle('is-gone', gone);
      bar.setAttribute('aria-hidden', gone ? 'true' : 'false');
    }
  }
  shape();
  raf = requestAnimationFrame(frame);

  window.FOOTER = {
    config: CONFIG,
    apply(){},
    readout(){
      return { ftr: lastMix < 0 ? 'off'
        : (lastMix * 100).toFixed(0) + '% red · type ' + (lastCut === null ? 'fade' : 'cut') };
    },
    groups(){
      const F = window.FOOTER;
      if (!F) return [];
      const num = (key, min, max, step, hint) => ({
        label: 'ftr.' + key, min, max, step, hint,
        get: () => F.config[key], set: v => { F.config[key] = v; },
      });
      return [{
        name: 'FOOTER · the page turning red', open: true, rows: [
          { label: 'ftr.enabled', options: ['on', 'off'],
            get: () => F.config.enabled ? 'on' : 'off',
            set: v => { F.config.enabled = (v === 'on'); },
            hint: 'off leaves block 02 running to its end with no footer at all' },
          num('from', 0, 1, 0.01,
              'where in block 02’s scroll the red STARTS coming up, as a share of that whole phase · a share because it is a PLACE, and it should stay put when that phase is retuned'),
          { label: 'ftr.match', options: ['block01', 'own'],
            get: () => F.config.match, set: v => { F.config.match = v; },
            hint: 'BLOCK01 takes the distance and the easing straight off js/mask-scroll.js, so this transition and the one onto block 02 are the same gesture and cannot drift apart · OWN uses the two below' },
          num('overPx', 60, 2000, 10,
              'how much wheel the whole change takes, in pixels · block 01 → 02 is 300 · ignored while match is BLOCK01'),
          num('ease', 0.02, 1.5, 0.01,
              'seconds to close most of the gap · this is the half that decides whether it feels fast: block 02’s own scroll is filtered at 0.02 and moves notch for notch with the wheel, block 01’s at 0.5 and glides on after you stop · ignored while match is BLOCK01'),
          { label: 'ftr.type', options: ['tear', 'fade'],
            get: () => F.config.type, set: v => { F.config.type = v; lastMix = -1; lastInk = -1; lastCut = 0; lastCutM = -1; },
            hint: 'TEAR is the design \u00b7 the footer is finished before any of this starts and the shader\u2019s own edge cuts it, shards and all, exactly as block 02\u2019s content is cut \u00b7 FADE is the old opacity ramp, where the words built up while you watched, and it is also what happens by itself with no WebGL' },
          { label: 'ftr.colour', colour: true,
            get: () => F.config.colour, set: v => { F.config.colour = v; lastMix = -1; },
            hint: 'the colour the page goes · the full spectrum, not a list' },
          { label: 'ftr.tear', options: ['tear', 'off'],
            get: () => F.config.tear, set: v => { F.config.tear = v; lastMix = -1; },
            hint: 'how the red arrives \u00b7 TEAR is the same displaced edge every other change of room on this site uses, scrubbed by this scroll \u00b7 OFF is the old uniform opacity ramp, which is also what happens by itself when there is no WebGL' },
          { label: 'ftr.dir', options: ['up', 'down', 'left', 'right'],
            get: () => F.config.dir, set: v => { F.config.dir = v; lastMix = -1; },
            hint: 'which way that edge travels \u00b7 UP so the footer rises into the screen the way block 02 does' },
          { label: 'ftr.blend', options: ['multiply', 'normal', 'screen', 'overlay',
                                          'hue', 'color', 'soft-light', 'hard-light', 'difference'],
            get: () => F.config.blend, set: v => { F.config.blend = v; lastMix = -1; },
            hint: 'MULTIPLY is the design: white goes to the colour, black stays black, and the head and the ground underneath survive as darker reds · NORMAL is an opaque sheet and deletes everything under it, which is what this was before and is worth seeing once · HUE keeps the block’s own light and takes only the colour' },
          num('amount', 0, 1, 0.01,
              'how strong it goes at the end of the fade · below 1 the block underneath stays partly its own colour, which is a different room rather than a weaker version of this one'),
          num('capGone', 0.05, 1, 0.01,
              'by which share of the fade the two white captions have gone · they are painted into a canvas and sampled as a texture, so this is the only thing that can reach them · at 1 they are still fading as the red lands'),

          { label: 'ftr.titleTop', min: 0, max: 200, step: 1,
            get: () => F.config.titleTop, set: v => { F.config.titleTop = v; shape(); },
            hint: 'px from the top of the screen to the top of the CAPITALS · not to the text box, which sits six and a half pixels higher at this size' },
          { label: 'ftr.titleGap', min: 0, max: 300, step: 1,
            get: () => F.config.titleGap, set: v => { F.config.titleGap = v; shape(); },
            hint: 'clear space between the headline and the band · the band is placed off this rather than at a share of the screen height, so the two can never collide on a short window' },
        ],
      }];
    },
  };

  return function destroy(){
    on.release();
    cancelAnimationFrame(raf);
    if (sheet.parentNode) sheet.parentNode.removeChild(sheet);
    /* Hand the shared canvas back, or the footer's red is left over the next
       page — it is not this module's canvas, only borrowed for the frames it
       was on screen for. */
    if (window.SHEETFX && window.SHEETFX.unscrub) window.SHEETFX.unscrub();
    /* PUT THE CAPTIONS BACK. They belong to js/block2.js and this file only
       borrows them; left at 0 they would be invisible for the rest of the
       visit on a page this module is no longer mounted on. */
    if (window.BLOCK2 && window.BLOCK2.config) window.BLOCK2.config.capAlpha = 1;
    if (bar){
      bar.classList.remove('is-gone');
      bar.removeAttribute('aria-hidden');
    }
    if (window.FOOTER && window.FOOTER.config === CONFIG) delete window.FOOTER;
  };
});
