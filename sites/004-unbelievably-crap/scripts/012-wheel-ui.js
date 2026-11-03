/* ==========================================================================
   wheel-ui.js — hover state and the top-right preview panel

   Exactly ONE card is "active" at a time: the one under the cursor, or —
   when the cursor is off the wheel — whichever card currently sits nearest
   the middle-right of the ring. The preview panel mirrors whatever is
   active, ALWAYS: there is no hover gate, so the panel is never empty and it
   keeps changing as the wheel turns under scroll. Cards are all full colour;
   `is-active` only marks which one the panel is showing.

   The resting choice is recomputed each frame rather than fixed to an index,
   because the ring never stops turning (idleSpin) — a fixed index would
   drift out of the middle-right position within seconds.
   Registered with the page lifecycle: the rAF loop at the bottom outlives a
   Barba container swap, so it has to be cancellable, and every element is
   looked up inside `scope` because both containers are in the DOM at once
   during a transition.
   ========================================================================== */
window.PAGE.register('wheel-ui', function (scope) {
  'use strict';

  const stage = scope.querySelector('#wheelStage');
  const viewport = scope.querySelector('#wheelViewport');
  const peek = scope.querySelector('#peek');
  if (!stage || !viewport || !peek || !window.PROJECTS) return;

  const PROJECTS = window.PROJECTS;
  const frame  = peek.querySelector('.peek__frame');
  const fields = {
    awwwwards: peek.querySelector('[data-f="awwwwards"]'),
    fwa:       peek.querySelector('[data-f="fwa"]'),
    css:       peek.querySelector('[data-f="css"]'),
    orpetron:  peek.querySelector('[data-f="orpetron"]'),
    platform:  peek.querySelector('[data-f="platform"]'),
    year:      peek.querySelector('[data-f="year"]'),
    num:       peek.querySelector('[data-f="num"]'),
  };

  /* Which project a card belongs to. wheel.js assigns sources by a coprime
     stride; mapping back through the image path keeps the two in step
     without wheel.js needing to know projects exist. */
  const byImg = new Map(PROJECTS.map(p => [p.img, p]));
  const projectOf = card => byImg.get(card.querySelector('img')?.getAttribute('src')) || PROJECTS[0];

  let activeCard = null;
  let hovered = null;
  let shownProject = null;


  /* ---- preview ------------------------------------------------------------ */
  function show(project){
    if (!project || project === shownProject) return;
    shownProject = project;

    const layer = document.createElement('div');
    layer.className = 'peek__layer is-entering';
    const img = document.createElement('img');
    img.src = project.img;
    img.alt = '';
    img.draggable = false;
    layer.appendChild(img);
    frame.appendChild(layer);

    /* No PIXELATE here any more. The panel now swaps on every change of the
       resting card — which is continuous while the wheel turns — and the
       reference swaps with a fast blur, not a pixel grid. Spawning a canvas
       several times a second for a 210x132 box was both the wrong look and
       the wrong cost. The blur lives in .peek__layer.is-entering. */

    /* A layer is only ever removed once a NEWER one has finished growing
       over it. Culling on the way in (as this used to) could drop the layer
       underneath while the incoming one was still a small rectangle — with
       no background behind the panel that read as the old image vanishing
       before the new one arrived. The cap is generous enough that fast
       hovering stacks rather than tears. */
    while (frame.children.length > 4) frame.removeChild(frame.firstChild);

    layer.addEventListener('animationend', () => {
      layer.classList.remove('is-entering');
      // everything before this layer is now fully covered
      while (frame.firstChild && frame.firstChild !== layer){
        frame.removeChild(frame.firstChild);
      }
    }, { once:true });

    const a = project.awards;
    fields.awwwwards.textContent = a.awwwwards;
    fields.fwa.textContent       = a.fwa;
    fields.css.textContent       = a.css;
    fields.orpetron.textContent  = a.orpetron;
    fields.platform.textContent  = project.platform;
    fields.year.textContent      = project.year;
    fields.num.textContent       = project.n;
  }

  /* ---- hover -------------------------------------------------------------- */
  stage.addEventListener('pointerover', e => {
    const card = e.target.closest('.wheel-card');
    if (card) hovered = card;
  });
  stage.addEventListener('pointerout', e => {
    const card = e.target.closest('.wheel-card');
    if (card && card === hovered) hovered = null;
  });
  viewport.addEventListener('pointerleave', () => { hovered = null; });

  /* ---- resting pick: nearest the middle-right of the ring ------------------ */
  function restingCard(){
    const cards = stage.children;
    const vr = viewport.getBoundingClientRect();
    const targetX = vr.left + vr.width * 0.78;   // middle-right
    const targetY = vr.top  + vr.height * 0.5;
    let best = null, bestScore = Infinity;
    for (let i = 0; i < cards.length; i++){
      const r = cards[i].getBoundingClientRect();
      if (r.width < 12) continue;                // edge-on, not a real target
      const dx = (r.left + r.width/2) - targetX;
      const dy = (r.top + r.height/2) - targetY;
      // favour cards that are both near the target AND facing us (wide)
      const score = Math.hypot(dx, dy) - r.width * 1.6;
      if (score < bestScore){ bestScore = score; best = cards[i]; }
    }
    return best;
  }

  let raf = 0, alive = true;

  function tick(){
    if (!alive) return;
    /* The resting card still drives which project is *loaded*, so the panel
       has something to reveal the instant a hover starts — but the photo is
       only shown while a card is actually under the cursor. */
    const next = hovered || restingCard();
    if (next && next !== activeCard){
      activeCard?.classList.remove('is-active');
      next.classList.add('is-active');
      activeCard = next;
      show(projectOf(next));
    }
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  return function destroy(){
    alive = false;
    cancelAnimationFrame(raf);
  };
});
