/* ==========================================================================
   dissolve-look.js — the torn edge, in one place.

   The block-to-block transition on mask.html and the cursor blobs on the work
   page are the same picture made twice: multi-octave noise added to a signed
   distance BEFORE the threshold, so the boundary tears into shards instead of
   sliding. Only the distance differs — a horizontal sweep there, a trail of
   circles here.

   So the numbers that decide how that edge LOOKS live here rather than being
   typed into two files that would drift the first time either was tuned. Both
   modules spread this in and then override whatever their own geometry needs.
   Tune the transition, and the cursor follows.

   What is NOT here: anything about how far along the transition is, where the
   sweep starts, or what colour the second block is. Those are one page's
   business. This file is the texture of the tear and nothing else.
   ========================================================================== */
window.DISSOLVE_LOOK = {
  /* How far the noise drags the boundary, in screen heights. On a sweep that
     spans the viewport this is a small fraction of the travel; on a blob a
     fifth of that height is the whole blob, which is why js/work-cursor.js
     scales it by a `tear` multiplier rather than using it raw. */
  dispAmp:    0.095,
  dispScale:  12.2,   // size of the tears · high is shrapnel, low is a wave
  dispDetail: 5,      // octaves · 1 is a smooth wobble, 5 is debris
  dispDrift:  0.0,    // how fast the pattern crawls · 0 holds it still
  soft:       0.001,  // half-width of the threshold · small keeps shards crisp
  grain:      0.29,   // per-pixel colour dither
};
