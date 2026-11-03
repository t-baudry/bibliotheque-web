/* ==========================================================================
   line-reveal.js — the speed of the copy resolving, on the panel.

   .anim-line is a one-shot CSS animation that runs at mount: every line starts
   blurred and transparent and resolves, staggered down the page. The stagger is
   a per-line DELAY, so it multiplies — at the shipped 42ms, the sixtieth line
   does not begin for two and a half seconds. Scroll straight down and you
   arrive ahead of copy that has not been told to start yet, which reads as the
   text failing to keep up rather than as a considered reveal.

   This owns nothing of its own. It writes three custom properties that
   css/ui.css now reads, so there is one set of numbers rather than a value in
   the stylesheet and a second one here that would drift apart.

   ON <html>, not on the Barba container: .anim-line is used by block 02 and by
   the footer as well as by the About column, and a variable set on the
   container would miss anything the transition promotes out of it mid-wipe.
   ========================================================================== */
window.PAGE.register('line-reveal', function (scope) {
  'use strict';

  const CONFIG = {
    /* Tuned on the live site and exported from the panel. The step came DOWN
       from 42 and the duration went UP from 520, which is the right pair for
       the complaint that produced them: the stagger multiplies by the line
       count and was what the scroll outran, so it shrinks — while each line
       individually got longer to resolve, which costs nothing extra because
       that part does not stack. */
    ms:   1600,  // how long one line takes to resolve
    step: 14,    // ms between one line starting and the next
    blur: 11,    // px it starts blurred by

    /* WHAT BLOCK 01'S COLUMN DOES, and it is off.

       The three numbers above are shared by every .anim-line on the site — the
       loader's, the footer's, block 02's. Those are a dozen lines each. The
       About column is two hundred and fifty, and at 1600ms with a 14ms step
       something like a hundred and twenty of them are inside their blur on the
       same frame. A blur is the one filter that cannot be composited away: it
       buys every line its own render surface and re-filters it every frame for
       as long as it runs. That is the arrival dropping to about 50fps.

       `fade` is the cheap half of the same idea and worth knowing about: the
       lines still resolve, but on opacity alone, which the compositor animates
       without touching a pixel of either layer. The entrance survives, the
       bill does not. css/about.css holds the three rules. */
    copy: 'off',   // off · fade · blur
  };

  const MODES = ['off', 'fade', 'blur'];
  const root = document.documentElement;

  function apply(){
    root.style.setProperty('--line-ms',   Math.max(0, CONFIG.ms) + 'ms');
    root.style.setProperty('--line-step', Math.max(0, CONFIG.step) + 'ms');
    root.style.setProperty('--line-blur', Math.max(0, CONFIG.blur) + 'px');

    /* `blur` is the ABSENCE of a class, not a class of its own: it is what the
       stylesheet already says, and a rule that restated it would be a second
       copy of those numbers waiting to disagree with the first. */
    MODES.forEach(m => root.classList.toggle('copy-reveal-' + m, CONFIG.copy === m));
  }
  apply();

  /* Re-running the animation is the only way to judge a change without
     reloading: the class is one-shot, so it has to be taken off, the layout
     read to force the removal to count, and put back. */
  function replay(){
    const lines = scope.querySelectorAll('.anim-line');
    lines.forEach(el => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });
  }

  window.LINEREVEAL = {
    config: CONFIG,
    apply,
    replay,
    readout(){
      const n = scope.querySelectorAll('.anim-line').length;
      /* The number that actually matters: when the LAST line starts. */
      return { lineReveal: `${CONFIG.ms}ms · last starts at ` +
                           `${((n - 1) * CONFIG.step / 1000).toFixed(1)}s` };
    },
    rows(){
      const C = CONFIG, self = this;
      return [
        { label: 'line.step', min: 0, max: 120, step: 1,
          get: () => C.step, set: v => { C.step = v; self.apply(); },
          hint: 'ms between one line beginning and the next · THIS is the one that gets outrun, because it multiplies by the number of lines · at 42 with sixty lines the last one waits two and a half seconds, at 10 it waits half a second' },
        { label: 'line.ms', min: 60, max: 1600, step: 10,
          get: () => C.ms, set: v => { C.ms = v; self.apply(); },
          hint: 'how long a single line takes to come out of the blur · this one does not stack, every line spends the same time' },
        { label: 'line.blur', min: 0, max: 24, step: 0.5,
          get: () => C.blur, set: v => { C.blur = v; self.apply(); },
          hint: 'how far out of focus a line starts · at 0 it is a plain fade' },
        { label: 'copy.reveal', options: ['off', 'fade', 'blur'],
          get: () => C.copy, set: v => { C.copy = v; self.apply(); },
          hint: 'block 01’s column only · OFF is the copy simply being there, which is what it ships as · FADE keeps the entrance on opacity alone and costs essentially nothing · BLUR is the original and is the expensive one: two hundred and fifty lines, a hundred and twenty of them inside a blur on the same frame, each on its own render surface · the three numbers above only mean anything in FADE and BLUR' },
        { label: 'line.replay', options: ['—', 'play'],
          get: () => '—',
          set: v => { if (v === 'play') self.replay(); },
          hint: 'run the reveal again · the animation is one-shot, so without this a change to the values above only shows on a reload' },
      ];
    },
  };

  return function destroy(){
    /* The classes live on <html>, which Barba never replaces — left behind,
       they would keep grading a page this module is no longer on. */
    MODES.forEach(m => root.classList.remove('copy-reveal-' + m));
    if (window.LINEREVEAL && window.LINEREVEAL.config === CONFIG) delete window.LINEREVEAL;
  };
});
