/* ==========================================================================
   tint.js — one colour over the whole page.

   Figma 14619:12638 lays a flat red over the gallery: the paper goes red, the
   photographs go dark red, and the type stays black. That is a MULTIPLY, not
   an overlay at low opacity — white times red is red, black times anything is
   black — which is why the blend mode is the first dial and not a detail.

   IT STOPS AT THE BAR, and Figma says so rather than my guessing: the red
   rectangle in that frame is 1511x800 on an 827-tall screen, and the 27 it
   leaves is the bar. The bar is the one element on every page and every
   section, the site's one constant — a tint that recoloured it would make it a
   different object per page, which is exactly what it exists not to be. So
   this sits under it.

   A PAGE MAP LIKE js/crt.js's, not an `enabled` flag per page: a page with no
   entry here has no tint layer in its DOM at all, rather than an invisible one
   that costs a composited full-screen element on every page of the site.
   ========================================================================== */
window.PAGE.register('tint', function (scope) {
  'use strict';

  const PAGES = {
    gallery: { enabled: true, colour: '#ff0000', blend: 'multiply', amount: 1 },
    /* THE 404 CARRIES IT BUT STARTS OFF. Its scheme dial turns this on for RED
       and off for the other two — see js/err.js. Listed here rather than
       created there because a page with no entry returns before it builds
       anything, and a layer that does not exist cannot be switched on. */
    err:     { enabled: false, colour: '#ff0000', blend: 'multiply', amount: 1 },
  };
  const PRESET = PAGES[scope.dataset.page];
  if (!PRESET) return;

  const CONFIG = Object.assign({
    enabled: false,
    colour: '#ff0000',
    /* The blends worth having over a whole page, and they do genuinely
       different things:
         multiply   darkens · white goes to the colour, black stays black.
                    This is the one Figma draws.
         screen     the reverse · black goes to the colour, white stays white
         overlay    keeps the extremes and colours the middle
         hue        takes the colour's HUE and keeps the page's own brightness
                    and saturation, which is the gentlest of them
         color      hue and saturation, brightness kept
         normal     a flat sheet · only useful under 1 */
    blend: 'multiply',
    amount: 1,
  }, PRESET);

  const el = document.createElement('div');
  el.className = 'tint';
  el.setAttribute('aria-hidden', 'true');
  scope.appendChild(el);

  function apply(){
    const C = CONFIG;
    el.style.background = C.colour;
    el.style.mixBlendMode = C.blend;
    el.style.opacity = String(Math.max(0, Math.min(1, C.amount)));
    el.style.display = C.enabled ? 'block' : 'none';
  }
  apply();

  window.TINT = {
    config: CONFIG,
    apply,
    readout(){
      return { tint: CONFIG.enabled
        ? `${CONFIG.colour} · ${CONFIG.blend} · ${CONFIG.amount}` : 'off' };
    },
    rows(){
      const C = CONFIG, self = this;
      return [
        { label: 'tint.enabled', options: ['on', 'off'],
          get: () => (C.enabled ? 'on' : 'off'),
          set: v => { C.enabled = v === 'on'; self.apply(); },
          hint: 'one colour over the whole page · it stops at the bar, which Figma’s own rectangle does too — the bar is the site’s one constant and a tint that recoloured it would make it a different object on every page' },
        { label: 'tint.colour', colour: true,
          get: () => C.colour, set: v => { C.colour = v; self.apply(); },
          hint: 'the colour · the full spectrum, not a list' },
        { label: 'tint.blend', options: ['multiply', 'screen', 'overlay',
                                         'hue', 'color', 'soft-light',
                                         'hard-light', 'difference', 'normal'],
          get: () => C.blend, set: v => { C.blend = v; self.apply(); },
          hint: 'MULTIPLY is what the design draws: white paper goes to the colour, black type stays black, and the photographs darken into it · SCREEN is the reverse and lifts the blacks instead · HUE takes only the colour’s hue and leaves the page’s own light alone, which is the gentlest of them · NORMAL is a flat sheet and only means anything below full strength' },
        { label: 'tint.amount', min: 0, max: 1, step: 0.01,
          get: () => C.amount, set: v => { C.amount = v; self.apply(); },
          hint: 'how strong · at 1 with MULTIPLY the page is fully in the colour, which is the Figma frame' },
      ];
    },
  };

  return function destroy(){
    if (el.parentNode) el.parentNode.removeChild(el);
    if (window.TINT && window.TINT.config === CONFIG) delete window.TINT;
  };
});
