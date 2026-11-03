/* ==========================================================================
   gate.js — the phone door's one moving part.

   The door itself is CSS and a class set in the <head> before the first paint;
   this file only keeps that class honest afterwards. Two jobs:

     1. RE-DECIDE ON RESIZE. A desktop window dragged narrow, a phone turned on
        its side, a tablet in split view — the door has to open and close with
        the width, and the page behind it has to come up when it opens. Since
        the modules were never mounted while the door was shut, opening it
        means mounting them, which is a reload. That is deliberate: a site that
        boots its whole engine mid-drag is a site that stutters mid-drag, and
        nobody drags a window past 720px by accident twice.

     2. STOP THE PAGE UNDERNEATH FROM SCROLLING. The container is display:none
        so there is nothing to scroll, but iOS still rubber-bands the document
        itself; the touch handler below is what makes the door feel like a wall
        rather than a sticker.

   WHY THE CLASS IS SET IN THE HEAD AND NOT HERE: everything this file could do
   happens after the stylesheet and after the first frame. Set here, the phone
   would show a flash of the layout that is supposed to be unreachable — which
   is the one thing the door exists to prevent.
   ========================================================================== */
(function () {
  'use strict';

  const root = document.documentElement;

  /* THE SAME 720 css/mobile.css USES, and it has to be the same number: that
     file is what the door is hiding, so "phone" must mean one thing on the
     site. Written once here and once in the head script, and nowhere else. */
  const PHONE = '(max-width: 720px)';

  /* THE WAY BACK IN. ?mobile leaves the door open so the layout can still be
     looked at and worked on. It is a query string rather than a build flag on
     purpose — it survives a deploy, it works on a real phone over the network,
     and it is not something anyone lands on. */
  const OPEN = /[?&]mobile(&|=|$)/.test(location.search);

  function gated(){
    return !OPEN && window.matchMedia && window.matchMedia(PHONE).matches;
  }

  /* RELOAD RATHER THAN MOUNT. Crossing the breakpoint changes which modules
     should be running, and js/lifecycle.js decides that once, at mount. Rather
     than teach every module to start and stop halfway through its own life,
     the crossing is a fresh load — the honest version of a state change this
     large, and it can only happen when a window is being dragged. */
  let was = gated();
  let t = 0;
  window.addEventListener('resize', function (){
    clearTimeout(t);
    t = setTimeout(function (){
      const now = gated();
      if (now !== was){ was = now; location.reload(); }
    }, 250);
  }, { passive: true });

  /* The wall. Only while the door is shut, and only on the door itself, so
     nothing else on the site loses a gesture it wanted. */
  document.addEventListener('touchmove', function (e){
    if (root.classList.contains('is-gated')) e.preventDefault();
  }, { passive: false });
})();
