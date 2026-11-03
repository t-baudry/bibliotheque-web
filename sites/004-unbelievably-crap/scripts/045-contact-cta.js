/* ==========================================================================
   contact-cta.js — the one button on the site that does not want to be used.

   Three clicks before it gives up the address:

       don't contact me   ->  are you sure?  ->  i'm serious  ->  you win. copied.

   AND THE COPY HAPPENS ONLY ON THE THIRD. That is the whole joke, so it is
   also the one thing in here that must not be got wrong: the clipboard is
   written once, at the last stage, and never on the way there.

   THE TEXT DOES NOT SWAP, IT DECODES. Every change runs through a scramble —
   each character picks its own random start and finish, cycles block glyphs in
   between, and lands on the letter it was always going to be. Left to right,
   because the start frames are random but the finish frames drift later along
   the string. Setting textContent directly would have been one line and would
   have thrown away the only reason this reads as a machine changing its mind
   rather than a label being replaced.

   SPACES ARE NEVER SCRAMBLED. A single word can dissolve completely and still
   read as one object; a phrase that loses its gaps turns into a bar of noise
   and you cannot see it resolving at all. Holding the spaces keeps the shape
   of the sentence while everything inside it is still moving.

   IT REPLACES THE HANDLER THAT USED TO LIVE IN js/ui.js, which copied on the
   first click. Two things binding the same [data-copy-email] would both fire,
   and the address would have gone to the clipboard on click one — before the
   button had finished pretending to refuse.

   ---- [data-scramble]: THE HOVER WITHOUT THE JOKE -------------------------
   The decode is the site's hover, and other things want it — the footer's
   LINKEDIN sits beside the refusing button and has to answer the same way, but
   it has no address, no three stages and nothing to copy. So an element marked
   `data-scramble` gets the hover re-decode and nothing else.

   It lives HERE rather than in the footer because this is the file that owns
   the effect. A second implementation next door would be the same animation
   described twice, and the two would be a frame apart the first time either
   was tuned — which on two labels ten pixels from each other is exactly the
   kind of difference you see without being able to name.
   ========================================================================== */
window.PAGE.register('contact-cta', function (scope) {
  'use strict';

  const CONFIG = {
    enabled: true,
    /* The three lines it says on the way to giving in. The first is whatever
       the markup already says, so it is not listed here. */
    ask:    'are you sure?',
    insist: "i'm serious",
    give:   'you win. copied.',
    /* Quadrant and half blocks. They are what the reference does, and they
       carry no letterform of their own, so a string mid-decode reads as noise
       rather than as a different word. */
    glyphs: '▘▙▚▛▜▝▞▟▖▗▄▀█▌▐▓▒░',
    speed:   1,      // higher is faster
    hover:   true,   // re-decode on hover
    holdMs:  2400,   // how long the last line stays before it forgets
    lockWidth: true,
  };

  const els  = Array.prototype.slice.call(scope.querySelectorAll('[data-copy-email]'));
  const echo = Array.prototype.slice.call(scope.querySelectorAll('[data-scramble]'));
  if (!els.length && !echo.length) return;

  const rnd = () => CONFIG.glyphs[(Math.random() * CONFIG.glyphs.length) | 0];

  /* ---- the scramble ------------------------------------------------------- */
  function scrambler(el){
    let raf = 0, frame = 0, q = [], busy = false, after = null;

    function step(){
      let out = '', done = 0;
      for (let i = 0; i < q.length; i++){
        const c = q[i];
        if (c.to === ' '){ out += ' '; done++; continue; }
        if (frame >= c.end){ out += c.to; done++; }
        else if (frame >= c.start){
          /* Held for a few frames at a time rather than re-rolled every one:
             at 120Hz a fresh glyph per frame is a grey blur, not a character. */
          if (!c.ch || Math.random() < 0.28) c.ch = rnd();
          out += c.ch;
        } else out += c.from;
      }
      el.textContent = out;
      if (done === q.length){
        busy = false;
        const fn = after; after = null;
        if (fn) fn();
        return;
      }
      frame++;
      raf = requestAnimationFrame(step);
    }

    return {
      get busy(){ return busy; },
      to(next, done){
        const prev = el.textContent;
        const len = Math.max(prev.length, next.length);
        const s = Math.max(0.2, CONFIG.speed);
        q = [];
        for (let i = 0; i < len; i++){
          const start = Math.floor(Math.random() * 12 / s);
          q.push({
            from: prev[i] || ' ',
            to:   next[i] || '',
            start,
            end:  start + Math.floor((Math.random() * 14 + 6) / s),
            ch:   '',
          });
        }
        cancelAnimationFrame(raf);
        frame = 0; busy = true; after = done || null;
        step();
      },
      stop(){ cancelAnimationFrame(raf); busy = false; after = null; },
    };
  }

  /* ---- the clipboard ------------------------------------------------------ */
  /* navigator.clipboard needs a secure context, and this site still gets opened
     straight off the filesystem during design reviews — so the textarea path is
     a real fallback here rather than a legacy nicety. Kept verbatim from the
     handler this file replaces. */
  async function copy(address){
    try {
      if (navigator.clipboard && navigator.clipboard.writeText){
        await navigator.clipboard.writeText(address);
        return true;
      }
      throw new Error('no clipboard api');
    } catch (e){
      const ta = document.createElement('textarea');
      ta.value = address;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (err){ ok = false; }
      ta.remove();
      return ok;
    }
  }

  /* ---- one button --------------------------------------------------------- */
  const on = window.PAGE.bindings();
  const wired = [];

  els.forEach(mail => {
    const address = mail.dataset.copyEmail;
    const label = mail.querySelector('[data-label]') || mail;
    const home = label.textContent;
    const sc = scrambler(label);
    let stage = 0, hold = 0;

    /* THE WIDEST LINE, MEASURED, so the chip does not resize four times on the
       way through the sequence — on the footer's white block that is a very
       visible reflow, and in the bar it shoves the little cross about. Measured
       after the webfont has loaded, because measuring against the fallback
       gives a number that is wrong the moment the real font arrives. */
    function lock(){
      if (!CONFIG.lockWidth) { label.style.minWidth = ''; return; }
      const probe = document.createElement('span');
      const cs = getComputedStyle(label);
      probe.style.cssText =
        `position:absolute;visibility:hidden;white-space:pre;left:-9999px;` +
        `font:${cs.font};letter-spacing:${cs.letterSpacing};` +
        `text-transform:${cs.textTransform};`;
      document.body.appendChild(probe);
      let w = 0;
      [home, CONFIG.ask, CONFIG.insist, CONFIG.give].forEach(t => {
        probe.textContent = t;
        w = Math.max(w, probe.getBoundingClientRect().width);
      });
      probe.remove();
      label.style.display = 'inline-block';
      label.style.minWidth = Math.ceil(w) + 'px';
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(lock).catch(lock);
    else lock();

    function reset(){
      clearTimeout(hold);
      stage = 0;
      sc.to(home);
    }

    function click(){
      if (!CONFIG.enabled) return;
      clearTimeout(hold);
      stage++;

      if (stage === 1) return sc.to(CONFIG.ask);
      if (stage === 2) return sc.to(CONFIG.insist);

      /* THE THIRD. The only place the address is written. */
      copy(address).then(ok => {
        /* If even the fallback could not reach the clipboard, showing the
           address is more use than claiming a copy that did not happen. */
        sc.to(ok ? CONFIG.give : address, () => {
          hold = setTimeout(reset, CONFIG.holdMs);
        });
      });
      stage = 0;   // the next click starts the refusal again
    }

    on(mail, 'click', click);
    on(mail, 'pointerenter', () => {
      if (CONFIG.hover && !sc.busy) sc.to(label.textContent);
    });

    wired.push({ mail, label, home, sc, relock: lock, reset });
  });

  /* THE PLAIN ONES. Same scrambler, same dials, none of the sequence — see the
     note in the header. No width lock either: there is only ever one string,
     so there is nothing for the box to resize between. */
  echo.forEach(el => {
    const label = el.querySelector('[data-label]') || el;
    const sc = scrambler(label);

    /* IT HOLDS ITS WIDTH, and unlike the button above that is not about the
       words changing — they never do here. It is the GLYPHS: the block
       characters are not in the site's face and come out of a fallback, at
       whatever advance that fallback gives them, so a five-letter word is a
       different number of pixels wide mid-decode than it is at rest. On the
       button nothing follows the label and it never showed. On the footer's
       nav the `+` follows the word and three more links follow that, and the
       whole row twitches sideways for the length of the animation. */
    function lock(){
      if (!CONFIG.lockWidth){ label.style.width = ''; return; }
      label.style.display = 'inline-block';
      label.style.width = '';
      const w = label.getBoundingClientRect().width;
      /* WIDTH, NOT min-width, AND NOT ROUNDED UP. A minimum only stops it
         shrinking, and the block glyphs are as likely to be wider as narrower.
         Rounding up is worse than it sounds on a flex row: every item gains its
         own fraction of a pixel and they ADD, so the fourth link had moved two
         pixels right of where the file draws it before anyone had hovered
         anything. The exact fraction pins all four exactly where they were. */
      if (w > 0) label.style.width = w.toFixed(2) + 'px';
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(lock).catch(lock);
    else lock();

    on(el, 'pointerenter', () => {
      if (CONFIG.enabled && CONFIG.hover && !sc.busy) sc.to(label.textContent);
    });
    wired.push({ mail: el, label, home: label.textContent, sc,
                 relock: lock, reset: () => {} });
  });

  function apply(){
    wired.forEach(w => { w.relock(); });
  }

  window.CTA = {
    config: CONFIG,
    apply,
    readout(){ return { cta: CONFIG.enabled ? 'armed' : 'off' }; },
    rows(){
      const C = CONFIG, self = this;
      return [
        { label: 'cta.enabled', options: ['on', 'off'],
          get: () => (C.enabled ? 'on' : 'off'),
          set: v => { C.enabled = v === 'on'; },
          hint: 'the three-click refusal · off leaves the button inert, it does not fall back to copying on the first click' },
        { label: 'cta.speed', min: 0.3, max: 3, step: 0.05,
          get: () => C.speed, set: v => { C.speed = v; },
          hint: 'how fast the letters resolve · every character still picks its own start and finish, this only scales them' },
        { label: 'cta.hover', options: ['on', 'off'],
          get: () => (C.hover ? 'on' : 'off'),
          set: v => { C.hover = v === 'on'; },
          hint: 'decode again on hover, without changing what it says' },
        { label: 'cta.holdMs', min: 600, max: 6000, step: 100,
          get: () => C.holdMs, set: v => { C.holdMs = v; },
          hint: 'how long YOU WIN stays up before the button forgets and goes back to refusing' },
        { label: 'cta.lockWidth', options: ['on', 'off'],
          get: () => (C.lockWidth ? 'on' : 'off'),
          set: v => { C.lockWidth = v === 'on'; self.apply(); },
          hint: 'hold the chip at the width of its longest line · off lets it resize on every stage, which on the footer’s white block is a visible reflow' },
      ];
    },
  };

  return function destroy(){
    on.release();
    wired.forEach(w => { w.sc.stop(); });
    if (window.CTA && window.CTA.config === CONFIG) delete window.CTA;
  };
});
