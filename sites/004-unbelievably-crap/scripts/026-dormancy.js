/* ==========================================================================
   dormancy.js — stop drawing what nobody can see.

   WHY. Measured on the live site, the second block ran at 72fps with a p95 of
   41.6ms while the main thread sat at 7% — the CPU was asleep and the GPU was
   five vsyncs behind. Three theories died before this one: the meshes (proved
   irrelevant by decimating them), the texture uploads (switching all three off
   with ?off=uploads moved 72 to 77), and the shader's expensive branches (blur,
   rays and chroma are all already compiled out at their shipped values).

   What was actually happening: NOTHING ON THIS PAGE EVER STOPPED. Scrolled to
   the skull, the GPU was still running block 01's three.js fluid simulation and
   still drawing block 01's 250k-triangle body — full-screen, every frame, for a
   section a viewport and a half above. The composite did not replace that load,
   it stacked on top of it, which is exactly why the number depended on where
   you had scrolled to rather than sitting at one value.

   Only pixelate.js used an IntersectionObserver. Nothing else had any notion of
   being off screen.

   WHAT IT DOES NOT DO. It does not touch anything visible: no display, no
   visibility, no opacity, no canvas clearing. A dormant renderer keeps its
   context, its buffers and its last frame — which is off screen by definition,
   so there is nothing to see either way. It only stops the work.

   THE WAKE MARGIN IS THE WHOLE TRICK. Waking at the exact edge of the viewport
   means the first frame you see is the first frame drawn, and anything that
   eases toward a target — the figure's silhouette read-back, the fluid's
   settling — would be visibly catching up as it slid into view. WAKE is half a
   viewport of lead, so by the time the block is on screen it has already been
   running for several hundred milliseconds and is in its steady state.

   ONLY BLOCK 01. The head in block 02 is deliberately not handled here: it is
   already gated by mask-scroll.js's gateBody(), which knows the scroll progress
   and can tell whether the composite is actually sampling it. And #maskBody is
   a texture source that is never itself on screen — an IntersectionObserver
   would find it invisible and switch it off forever.
   ========================================================================== */
window.PAGE.register('dormancy', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'mask') return;

  const root = scope.querySelector('#aboutRoot');
  if (!root) return;

  /* Half a viewport of lead in both directions. See the note above — this is
     the difference between "it resumes" and "you watch it resume". */
  const WAKE = '50% 0px 50% 0px';

  /* The desired state is held here rather than pushed straight through,
     because these two modules publish their globals at their own pace: XRAY
     waits on the three.js CDN, and FIGURE waits on a 2.6MB mesh. An observer
     that fired before either existed would otherwise be a no-op that reads,
     from the frame counter, exactly like a fix that did not work. */
  let want = null;          // null = never decided, true = should be dormant
  let applied = null;

  function push(){
    if (want === null) return;

    const F = window.FIGURE;
    const X = window.XRAY;
    /* Both or neither. Applying to whichever half has loaded would leave the
       other permanently on the wrong side of a state change it never saw. */
    if (!(F && F.setDormant) || !(X && X.setDormant)) return;

    if (applied === want) return;
    applied = want;
    F.setDormant(want);
    X.setDormant(want);
    /* SAYS SO OUT LOUD, under ?fps only. A switch that silently never fired
       and a switch that fired and did not help produce the same frame counter,
       and telling those two apart by staring at the number is how the last
       three rounds of this were wasted. */
    if (/[?&]fps(&|=|$)/.test(location.search)){
      console.log('%c[dormancy] block 01 ' + (want ? 'ASLEEP' : 'awake'),
                  'color:#5fb37e;font-family:monospace');
    }
  }

  const io = new IntersectionObserver(function (entries){
    for (const e of entries){
      want = !e.isIntersecting;
      push();
    }
  }, { rootMargin: WAKE, threshold: 0 });

  io.observe(root);

  /* The retry exists for the load race described above, not for the observer —
     that fires once on its own as soon as it is connected. Five seconds is
     past the slowest mesh; after that either the globals arrived or the module
     is not on this page at all, and in both cases there is nothing to poll
     for. It stops on its own either way. */
  let tries = 0;
  const iv = setInterval(function (){
    push();
    if (applied !== null || ++tries >= 10) clearInterval(iv);
  }, 500);

  return function destroy(){
    clearInterval(iv);
    io.disconnect();
    /* WAKE ON THE WAY OUT. Barba keeps the window alive across a navigation,
       and a renderer left dormant by a teardown would come back to a page that
       no longer has anything to switch it on again. */
    const F = window.FIGURE, X = window.XRAY;
    if (F && F.setDormant) F.setDormant(false);
    if (X && X.setDormant) X.setDormant(false);
  };
});
