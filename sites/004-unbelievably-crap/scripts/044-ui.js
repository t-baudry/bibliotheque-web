/* ==========================================================================
   ui.js — shared page chrome behaviour
   The email copy button, the staggered body-text reveal, and marking the
   current page in the bottom bar.

   Everything here binds to elements INSIDE the Barba container, so it needs
   no teardown of its own — the listeners go when the container does. It is
   registered with the lifecycle anyway so that it re-runs for each incoming
   page; without that, the second page's copy button would be inert and its
   reveal cascade would never get its --i indices.
   ========================================================================== */
window.PAGE.register('chrome', function (scope) {
  'use strict';

  /* ---- email copy -------------------------------------------------------
     MOVED OUT, to js/contact-cta.js. It used to live here and copied the
     address on the FIRST click. The button now refuses twice before it gives
     in, and the copy belongs to the third click only — so leaving this here as
     well would have meant two handlers on the same [data-copy-email], both
     firing, and the address on the clipboard before the refusal had even
     started. Deleted rather than disabled, because a dead copy of a handler is
     the kind of thing that gets re-enabled by accident a year later. */

  /* ---- staggered body-text reveal ----------------------------------------
     Index is assigned in document order so the cascade runs down the page.
     Each column restarts its own count, otherwise a late column would wait
     out every line above it and arrive seconds after the rest.

     Because the incoming container is freshly parsed markup, the CSS
     animation on .anim-line starts from scratch on every navigation — the
     copy re-resolves out of blur behind the pixel wipe, which is why the
     reveal did not need porting into the transition timeline. */
  scope.querySelectorAll('[data-anim-group]').forEach(group => {
    const lines = group.querySelectorAll('.anim-line');
    lines.forEach((el, i) => el.style.setProperty('--i', i));
    if (group.dataset.animGroup) {
      group.style.setProperty('--group-delay', group.dataset.animGroup + 'ms');
    }
  });

  /* ---- mark the current page in the bottom bar ---------------------------
     Read off the container rather than location.pathname: Barba has already
     pushed the new URL by the time the incoming page mounts, but the outgoing
     page is still on screen, and keying off a global would mark both. */
  /* COMPARED IN A NORMALISED FORM, not as raw strings. The site went to clean
     URLs when it got its domain: the links now say `/`, `/work`, `/gallery`,
     the pages still exist on disk as index.html / work.html / gallery.html,
     and Vercel keeps 308-redirecting the old .html addresses for anything
     already linked. So the same page can arrive here spelled four ways, and a
     `===` on the raw href silently stops marking the current tab — which is
     not an error, just a bar that quietly no longer works. Fold every spelling
     onto one name instead. */
  const norm = p => {
    p = String(p).split('?')[0].split('#')[0].replace(/\/+$/, '');
    p = p.split('/').pop().replace(/\.html$/, '');
    return p || 'index';
  };
  const here = norm(scope.dataset.pageUrl || location.pathname);
  scope.querySelectorAll('.bar__btn[href]').forEach(a => {
    if (norm(a.getAttribute('href')) === here) a.classList.add('is-current');
  });

  return function destroy(){ clearTimeout(revert);  };
});
