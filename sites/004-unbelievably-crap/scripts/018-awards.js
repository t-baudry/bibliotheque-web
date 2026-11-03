/* ==========================================================================
   awards.js — the awards list scrolls with the page, and never runs out.

   WHAT IT DOES. The list in the black room's top right is longer than the box
   it is given. It moves as block 01's copy moves, and when it reaches the end
   it is already showing the beginning again, so there is no moment where it
   stops or snaps.

   HOW THE LOOP CLOSES, which is the only part with a rule to get wrong. The
   markup is cloned exactly ONCE, and the travel is taken modulo the height of
   the original. Those two numbers have to be the same thing: the distance
   moved before wrapping must equal the distance repeated, or the wrap is a
   visible jump. Measuring the track AFTER cloning and halving it would be the
   same number by accident and wrong the moment anything else lands inside —
   so the height is read from the original children, before the clone joins
   them.

   IT IS DRIVEN, NOT ANIMATED. The brief was that it scrolls as the user
   scrolls, so there is no clock in here at all: the position is a pure
   function of js/about-text.js's travel. Stop scrolling and it stops, which is
   what makes it read as part of the page rather than as a widget playing next
   to it.

   FONTS MOVE THE ANSWER. The height is measured after document.fonts.ready as
   well as on resize — measured before the face loads, every row is a fallback
   row and the total is short by enough to see the seam.
   ========================================================================== */
window.PAGE.register('awards', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'mask') return;

  const box   = scope.querySelector('[data-awards]');
  const track = scope.querySelector('[data-awards-track]');
  if (!box || !track) return;

  const CONFIG = {
    enabled: true,
    speed: 0.34,   // px the list moves per px the copy moves
    fade: 5,       // % of the box fully lit before the gradient starts
    gone: 92,      // % of the box by which it has faded to nothing
  };

  const on = window.PAGE.bindings();

  /* The original run, kept as the unit of the loop. */
  const originals = Array.from(track.children);
  let loopH = 0, raf = 0, cloned = false;

  function clone(){
    if (cloned) return;
    cloned = true;
    for (const el of originals){
      const c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      track.appendChild(c);
    }
  }

  function measure(){
    /* The originals only — see the note at the top. */
    let h = 0;
    for (const el of originals) h += el.getBoundingClientRect().height;
    loopH = Math.max(1, Math.round(h));
    box.style.setProperty('--aw-solid', CONFIG.fade + '%');
    box.style.setProperty('--aw-gone', CONFIG.gone + '%');
  }

  function frame(){
    if (!document.body.contains(box)) return;
    raf = requestAnimationFrame(frame);
    if (!CONFIG.enabled) return;

    const T = window.ABOUTTEXT;
    const travel = (T && typeof T.travel === 'number') ? T.travel : 0;

    /* MODULO, WITH THE SIGN FIXED. JavaScript's % keeps the sign of the left
       operand, so a negative travel — which nothing produces today, but a
       rubber-band scroll would — puts the track a whole loop out of place for
       one frame. Adding loopH before the second modulo costs nothing and takes
       that away. */
    const y = ((travel * CONFIG.speed) % loopH + loopH) % loopH;
    track.style.transform = 'translate3d(0,' + (-y).toFixed(2) + 'px,0)';
  }

  clone();
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  let rt;
  on(window, 'resize', () => { clearTimeout(rt); rt = setTimeout(measure, 150); });
  raf = requestAnimationFrame(frame);

  window.AWARDS = {
    config: CONFIG,
    apply(){ measure(); },
    readout(){ return { awards: loopH + 'px loop' }; },
    groups(){
      const A = window.AWARDS;
      if (!A) return [];
      const num = (key, min, max, step, hint) => ({
        label: 'aw.' + key, min, max, step, hint,
        get: () => A.config[key], set: v => { A.config[key] = v; A.apply(); },
      });
      return [{
        name: 'BLOCK 01 · the awards list', open: false, rows: [
          { label: 'aw.enabled', options: ['on', 'off'],
            get: () => A.config.enabled ? 'on' : 'off',
            set: v => { A.config.enabled = (v === 'on'); },
            hint: 'off parks the list where it is' },
          num('speed', 0, 1.5, 0.01,
              'how far the list travels per pixel the copy travels · 1 moves it with the text, 0 pins it'),
          num('fade', 0, 100, 1,
              'how much of the box is fully lit before the gradient starts, in per cent'),
          num('gone', 5, 100, 1,
              'where the gradient has faded to nothing · 60 is the file\u2019s, 100 spreads the fade over the whole box'),
        ],
      }];
    },
  };

  return function destroy(){
    cancelAnimationFrame(raf);
    clearTimeout(rt);
    on.release();
    if (window.AWARDS && window.AWARDS.config === CONFIG) delete window.AWARDS;
  };
});
