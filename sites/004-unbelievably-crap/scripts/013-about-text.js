/* ==========================================================================
   about-text.js — the case-file text, and the page's scroll.

   WHY A VIRTUAL SCROLL RATHER THAN THE DOCUMENT'S
   `body { overflow: hidden }` is site-wide (css/base.css) because the wheel
   and the sphere both own the wheel gesture. Rather than carve an exception
   for one page, About drives its own scroll position: wheel, drag and the
   keyboard all feed one accumulator, which is eased and then applied as a
   transform on the text column.

   That also solves the coupling. The figure has to turn by the same amount the
   text moves, and both have to keep moving after the wheel stops — sharing one
   eased number is simpler and stays in step by construction, where two
   listeners reading `scrollTop` would drift. The number is published on the
   container as an `about:scroll` event, which js/about-figure.js listens for.

   The reference (seventeenagency.com) moves the block as one piece with a long
   ease rather than snapping line to line, which is why followEase is low and
   the wheel delta is scaled down rather than used raw.
   ========================================================================== */
window.PAGE.register('about-text', function (scope) {
  'use strict';

  const stage  = scope.querySelector('#aboutStage');
  const column = scope.querySelector('#aboutColumn');
  if (!stage || !column) return;

  const CONFIG = {
    /* 1:1 WITH THE WHEEL. This was 0.4, which meant the copy's 1718px of
       travel cost 4295px of wheel — and block 02's phase after it another
       11000 — so reaching the head was a minute of scrolling that read, from
       the chair, as the page being stuck. A page that moves less than the
       gesture asks for is a page the visitor thinks is broken. */
    wheelSpeed: 1.0,     // px of travel per px of wheel delta
    dragSpeed: 0.2,      // px of travel per px dragged
    /* Seconds for the column to close ~63% of the remaining distance. Time
       based, not a per-frame fraction: a fixed fraction per frame settles
       twice as fast on a 120Hz screen as on 60Hz, so the same page felt
       different on different machines and never quite tracked the wheel. */
    ease: 0.02,
    shapeGap: 22,        // px of clearance between the copy and the silhouette
    shapeMin: 40,        // px: never squeeze a line narrower than this
    /* CLEAR SPACE BETWEEN TWO LINES ON THE SAME SIDE, in px — which is the
       gap you actually see and the one worth specifying.

       It is not the CSS row-gap, and the difference is not pedantic. The copy
       strictly alternates left, right, left, right around the figure, so the
       next line down the LEFT column is two rows away in the DOM. A CSS gap of
       g therefore reads as a visual gap of 2*(box + g) - ink: at box 5, ink 7
       and g 12 the rows are 12px apart and the column reads as 27px apart,
       which is why "the gap is 12" and "the gap looks like nearly 30" were
       both true and the number in the code matched nothing on screen.

       measure() inverts that, from the ink height and line box as actually
       rendered rather than from constants, so the number here survives a
       change of font size or leading. */
    lineGap: 10,
    /* Run-out past the last line, in px: how far the scroll keeps going once
       the story has ended. Room for whatever closes the page. */
    endPad: 600,
    /* HOW FAR THE COPY MAY GO, as a share of the distance its own content
       needs. 1 is "carry the last line clear of the stage", which is what the
       length is derived from; below that the column stops early and the rest
       of the writing never reaches the top of the screen. A share rather than
       a pixel count on purpose — the content decides the distance, this
       decides how much of it is used, and adding a line does not invalidate
       the number. */
    travelCap: 1.39,
    /* WHEN THE NEXT BLOCK MAY START, as a share of that same travel. The
       hand-over used to be pinned to the very end: js/mask-scroll.js waits on
       atEnd() and would not take a single pixel until the copy had nothing
       left. At 0.8 the white can begin while the last lines are still
       climbing, which is a different reading of the same page and is not
       reachable by any other dial. */
    handoffAt: 0.84,
    /* WHERE THE COPY ENTERS FROM, in viewport heights below the top of the
       stage — and the whole mechanism for "nothing on landing, then it
       arrives". At 1 the first line sits one full screen down, so the page
       opens empty and the copy travels UP into view under the scroll. It is not
       present-and-hidden, it is genuinely somewhere else.

       An opacity ramp was the first attempt at this and it was the wrong
       instrument: fading in a column that is already in place says "this was
       here all along", and what the page wants is arrival — which is a
       position, not a transparency. That ramp is deleted rather than left
       switched off, because a second way of hiding the same copy would only
       ever end up disagreeing with this one.

       Kept as a NUMBER here and written to CSS by measure(), rather than living
       in the stylesheet and being read back with parseFloat — that round trip
       is what lost the copy for a day: the panel's getter read "6svh" as 6, its
       setter multiplied by 100, and the restored value pushed the column 600
       viewport heights down the page. A value stored in one unit and applied in
       another will always find a way to do that. */
    startOffset: 1.0,
  };

  /* THE INTRO WAITS FOR THE COPY TO BE LOOKED AT.

     .anim-line is a one-shot CSS animation that runs at mount. That was right
     while the copy started on screen; it stopped being right the moment
     startOffset put it a full screen below the fold, because the whole blur-in
     then played where nobody could see it and the copy arrived already faded
     up — "it's kind of already there".

     So the lines are held paused until the first scroll moves the column, using
     the same animation-play-state the loader already uses for the same reason.
     Released once, never re-applied: this is an entrance, not a state. */
  let introHeld = true;
  column.classList.add('is-held');

  const on = window.PAGE.bindings();

  /* FINITE. The story is read once and then it stops — no duplication, no
     modulo. It used to loop, and the machinery for that (a clone count derived
     from the stage height, a seam gap, a modulo on every frame) is removed
     rather than disabled: a loop that is merely switched off still constrains
     everything around it, and the even-line-count rule that kept the seam's
     alternation intact no longer applies. Add or remove lines freely. */
  let lines = [...column.children];
  let allLines = [...column.children];
  let target = 0, current = 0, maxTravel = 0;

  /* WHERE THE COPY STOPS BEING THE ONLY THING ON THE PAGE. A plain function on
     the same scope as maxTravel, so both the handover test and anything asking
     the published getter run the identical arithmetic — and so neither has to
     reach through window.ABOUTTEXT to get it. */
  function handoffTravel(){
    return maxTravel * Math.max(0, Math.min(1, CONFIG.handoffAt));
  }
  let dragging = false, lastY = 0, pointerId = null;

  /* Offsets are cached here and never read again while scrolling. shape()
     used to call getBoundingClientRect() on all 96 lines and then write
     padding, which forces a layout read and a layout write sixteen times a
     second — the copy visibly trailed the column it belongs to. Now the y of
     every line is arithmetic and the only write is a transform. */
  let offsets = [], colTop = 0;
  /* Declared HERE, above measure(), not beside shape() where they are read.
     `let` is in its temporal dead zone until the declaration is evaluated, and
     measure() runs during mount — before the line further down was reached —
     so writing stageW from it threw and took the whole text module out. The
     page still came up because js/lifecycle.js isolates a failed module, which
     is exactly why that try/catch is there. */
  let stageW = 0, stageH = 0, figW = 420, tooWide = 0;

  /* Ink height — cap top to the lowest descender — for the font as actually
     loaded, at its current size. Canvas metrics rather than a guess, because
     the glyphs deliberately overflow their line box at line-height .5, so the
     box height says nothing about how much of the gap is visually filled. */
  function inkHeight(el){
    const cs = getComputedStyle(el);
    const c = document.createElement('canvas').getContext('2d');
    c.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize}/1 ${cs.fontFamily}`;
    const m = c.measureText('HAMBURGEFONS,');
    const ink = (m.actualBoundingBoxAscent || 0) + (m.actualBoundingBoxDescent || 0);
    return ink > 0 ? ink : parseFloat(cs.fontSize) * 0.72;
  }

  function measure(){
    /* Solve the CSS row-gap from the gap that is actually visible.
         visible = 2 * (box + gap) - ink   ->   gap = (visible + ink)/2 - box
       Set the gap first, then re-derive: the first pass needs a laid-out line
       to measure, and both quantities move with font-size. */
    const probe = allLines[0];
    const ink = inkHeight(probe.firstElementChild || probe);
    const box = probe.offsetHeight || parseFloat(getComputedStyle(probe).fontSize) * 0.5;
    const cssGap = Math.max(0, (CONFIG.lineGap + ink) / 2 - box);
    column.style.setProperty('--line-gap', cssGap.toFixed(2) + 'px');

    /* The halving above is only right for a line whose neighbour is on the
       OTHER side. Two lines on the same side stack directly on top of each
       other, so they need the whole gap rather than half of it — the copy has
       a few deliberate two-line blocks that land that way. */
    const full = Math.max(0, CONFIG.lineGap + ink - box);
    function spaceLines(){
      allLines = [...column.children];
      for (let i = 0; i < allLines.length; i++){
        const a = allLines[i - 1]?.dataset.side, b = allLines[i].dataset.side;
        const stacked = i > 0 && a === b;
        allLines[i].style.marginTop =
          stacked ? (full - cssGap).toFixed(2) + 'px' : '';
      }
    }
    spaceLines();
    // clamped so no stored value can put the copy off-screen for good
    const off = Math.max(-0.5, Math.min(1.5, CONFIG.startOffset));
    column.style.setProperty('--start-offset', (off * 100) + 'svh');
    offsets = allLines.map(el => el.offsetTop);

    /* Lines are `white-space: nowrap` by design — the layout is one line per
       row — so a line longer than its half of the stage runs off the edge
       instead of wrapping. Counted here rather than left to be noticed:
       `tooWide` in the readout says how many need breaking by hand. */
    const chan = Math.max(40, (stageW - figW) / 2 - CONFIG.shapeGap);
    tooWide = 0;
    for (let i = 0; i < allLines.length; i++){
      const inner = allLines[i].firstElementChild;
      if (inner && inner.offsetWidth > chan) tooWide++;
    }
    colTop = column.offsetTop;
    stageW = stage.clientWidth;
    stageH = stage.clientHeight;
    figW = parseFloat(getComputedStyle(scope.querySelector('.about'))
             .getPropertyValue('--fig-w')) || 420;

    /* Scroll far enough to carry the last line, plus the run-out, past the
       bottom of the stage — and not one pixel further. */
    const last = allLines[allLines.length - 1];
    const contentBottom = colTop + last.offsetTop + last.offsetHeight;
    /* The content's own requirement, then the share of it we allow. */
    const need = Math.max(0, contentBottom + CONFIG.endPad - stageH);
    maxTravel = need * Math.max(0.05, Math.min(2, CONFIG.travelCap));
    target = Math.min(target, maxTravel);
    current = Math.min(current, maxTravel);
  }

  /* Clamped at both ends, so the wheel cannot run up an invisible debt that
     has to be unwound before the copy starts moving again. */
  function push(delta){
    if (held) return;
    target = Math.max(0, Math.min(maxTravel, target + delta));
  }

  /* HELD. Not disabled and not unmounted: the copy keeps easing toward
     wherever it was, it simply stops accepting new input. The mask page's
     second block sets this while it is open, so scrolling back up closes that
     block before the text starts moving again — one gesture running the whole
     page rather than two listeners splitting a wheel event between them. */
  let held = false;

  on(stage, 'wheel', e => {
    e.preventDefault();
    push(e.deltaY * CONFIG.wheelSpeed);
  }, { passive: false });

  /* MOUSE ONLY. A touch fires pointer events too, so on a phone this drag and
     js/touch-scroll.js would both move the copy from one finger — twice the
     distance, and only in block 01, which would then run out of travel while
     the other two phases had seen half the gesture. Touch belongs to
     touch-scroll because it is the only one of the two that carries the
     gesture on into the transition and the head. */
  on(stage, 'pointerdown', e => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    dragging = true; pointerId = e.pointerId; lastY = e.clientY;
    stage.setPointerCapture(e.pointerId);
  });
  on(stage, 'pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    push((lastY - e.clientY) * CONFIG.dragSpeed);
    lastY = e.clientY;
  });
  const endDrag = e => {
    if (!dragging) return;
    dragging = false;
    if (e && stage.hasPointerCapture?.(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    pointerId = null;
  };
  on(stage, 'pointerup', endDrag);
  on(stage, 'pointercancel', endDrag);

  on(window, 'keydown', e => {
    const step = stage.clientHeight * 0.8;
    if (e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); push(step); }
    if (e.key === 'PageUp') { e.preventDefault(); push(-step); }
    if (e.key === 'ArrowDown') push(60);
    if (e.key === 'ArrowUp') push(-60);
    if (e.key === 'Home') { target = 0; current = 0; }
    if (e.key === 'End') push(maxTravel);
  });

  let rt;
  on(window, 'resize', () => { clearTimeout(rt); rt = setTimeout(measure, 150); });

  measure();
  // remeasure once the webfont settles — line heights move under it
  document.fonts?.ready.then(measure).catch(() => {});

  /* ---------------- shaping ---------------------------------------------------
     Each line is a full-width flex row; the copy is pushed in from one side by
     however far the figure's silhouette reaches at that line's height. The
     silhouette comes from js/about-figure.js, which reads the outline back off
     the GPU a few times a second, so the copy re-parts as the body turns
     rather than clearing a fixed rectangle. */
  let lastX = [];

  function shape(y0){
    const F = window.FIGURE;
    if (!F || !F.silhouette || !stageH) return;
    const sil = F.silhouette, rows = F.silRows;
    const figLeft = (stageW - figW) / 2;
    if (lastX.length !== allLines.length) lastX = new Array(allLines.length).fill(NaN);

    for (let i = 0; i < allLines.length; i++){
      const el = allLines[i];
      // y is derived, not measured: no getBoundingClientRect, no forced layout
      const mid = colTop + offsets[i] + 2.5 - y0;
      if (mid < -60 || mid > stageH + 60) continue;
      const row = (mid / stageH * rows) | 0;
      const rc = row < 0 ? 0 : row >= rows ? rows - 1 : row;

      let x;
      if (el.dataset.side === 'l'){
        const l = figLeft + sil[rc * 2] * figW;
        x = -Math.max(0, Math.min(stageW - (l - CONFIG.shapeGap), stageW - CONFIG.shapeMin));
      } else if (el.dataset.side === 'r'){
        const r = figLeft + sil[rc * 2 + 1] * figW;
        x = Math.max(0, Math.min(r + CONFIG.shapeGap, stageW - CONFIG.shapeMin));
      } else continue;

      // transform, not padding: the compositor moves it, nothing re-lays out
      // 0.1px, not 0.4: the coarser threshold quantised the horizontal motion
      // into visible steps on a high-DPR screen, where 0.4 CSS px is nearly a
      // whole device pixel
      if (!(Math.abs(x - lastX[i]) < 0.1)){
        lastX[i] = x;
        el.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      }
    }
  }

  let raf = 0, alive = true, lastT = performance.now();
  function frame(now){
    if (!alive) return;
    const dt = Math.min((now - lastT) / 1000, 0.1); lastT = now;

    /* Exponential decay against real elapsed time. Identical settling on any
       refresh rate, and it keeps moving smoothly between wheel events instead
       of stepping. */
    const k = 1 - Math.exp(-dt / Math.max(CONFIG.ease, 0.001));
    const step = (target - current) * k;
    if (Math.abs(step) > 0.005){
      current += step;
      column.style.transform = `translate3d(0, ${-current.toFixed(2)}px, 0)`;
      /* delta turns the figure; progress (unlooped, clamped) runs the tilt
         ramp — one source for both, so they cannot drift apart */
      /* `travel` is the raw, unlooped distance. The figure decides for itself
         how far the tilt ramp should span, so changing the line gap — which
         changes the loop length — cannot turn a slow camera move into a snap. */
      scope.dispatchEvent(new CustomEvent('about:scroll', {
        detail: { delta: step, travel: current },
      }));
    }
    /* Every frame now, because it costs no layout. At 60ms it lagged the
       column it was supposed to be tracking, which is what read as the copy
       sliding around behind the scroll. */
    if (introHeld && current > 0.5){
      introHeld = false;
      column.classList.remove('is-held');
    }

    shape(current);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  /* ---------------- live copy ------------------------------------------------
     The panel edits the story as plain text, one line per row, so the length
     of the copy can be judged against the block it has to fill rather than
     guessed. Sides are assigned here, strictly alternating, because that is
     a property of the layout and not something anyone should have to maintain
     by hand while writing.

     The DOM is rebuilt rather than diffed. Rebuilding 48 one-line rows is
     nothing next to a debounce interval, and a diff would have to reason about
     which existing row corresponds to which new line — which is guesswork the
     moment a line is inserted in the middle. */
  function getText(){
    return lines.map(el => (el.textContent || '').trim()).join('\n');
  }

  /* The copy is written in markdown, so the field accepts it: a leading ###
     or a fully bold line becomes a --head row, and inline ** and * are
     stripped. Without this a pasted draft renders its own asterisks, which
     is a strange thing to discover at 10px. */
  function parseLine(t){
    let cls = '';
    let m = /^(#{1,6})\s+(.*)$/.exec(t);
    if (m){ t = m[2]; cls = 'about__line--head'; }
    else if ((m = /^\*\*(.+)\*\*$/.exec(t))){ t = m[1]; cls = 'about__line--head'; }
    t = t.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
    return { text: t.trim(), cls };
  }

  function setText(text){
    const rows = String(text == null ? '' : text)
      .split('\n').map(t => t.trim()).filter(Boolean);
    if (!rows.length) return;
    column.innerHTML = '';
    rows.forEach((raw, i) => {
      const { text: t, cls } = parseLine(raw);
      const div = document.createElement('div');
      div.className = 'about__line' + (cls ? ' ' + cls : '');
      div.dataset.side = (i % 2 === 0) ? 'l' : 'r';
      const p = document.createElement('p');
      p.textContent = t;
      div.appendChild(p);
      column.appendChild(div);
    });
    lines = [...column.children];
    allLines = lines;
    lastX = [];                 // the cache is indexed by line; it is now stale
    target = current = 0;       // the old scroll position means nothing
    column.style.transform = 'translate3d(0,0,0)';
    measure();
  }

  window.ABOUTTEXT = {
    /* Read by js/mask-scroll.js. `atEnd` is the handover point: while the copy
       still has somewhere to go, the wheel is the copy's. */
    /* THE NUMBER, not the string readout() formats. js/awards.js drives the
       awards list off this block's scroll, and parsing a toFixed(0) back into
       a float would quantise a smooth motion to whole pixels. */
    get travel(){ return current; },
    get maxTravel(){ return maxTravel; },
    /* READ BY js/mask-scroll.js as permission to start the white. It is the
       copy that decides, because the copy is what the visitor is reading —
       and handoffAt is where in that reading it stops being the only thing on
       the page. */
    /* THE TRAVEL AT WHICH THE HANDOVER FIRES, as a number. It was only ever
       an expression inside atEnd(), which meant anything that wanted to know
       WHERE the copy ends in practice had to re-derive it — and js/hud.js did
       not, so its progress bar measured against the full length of the copy
       and stopped at 84% the instant the white block took the screen. One
       quantity, one place it is computed; atEnd() reads the same helper. */
    get handoffTravel(){ return handoffTravel(); },
    atEnd(){ return target >= handoffTravel() - 0.5; },
    atStart(){ return target <= 0.5; },
    hold(v){ held = !!v; },
    get held(){ return held; },
    config: CONFIG,
    apply(){ measure(); },
    groups(){
      const T = window.ABOUTTEXT;
      if (!T) return [];
      return [{ name: 'BLOCK 01 · how far the copy scrolls', open: true, rows: [
        { label: 'copy.travel', min: 0.2, max: 2, step: 0.01,
          get: () => T.config.travelCap,
          set: v => { T.config.travelCap = v; T.apply(); },
          hint: 'how far the middle text may scroll, as a share of what its own content needs · 1 carries the last line clear, below that it stops early' },
        { label: 'copy.handoff', min: 0.2, max: 1, step: 0.01,
          get: () => T.config.handoffAt,
          set: v => { T.config.handoffAt = v; },
          hint: 'where in that scroll the transition to the white may begin · 1 waits for the very end, lower lets the white start while the last lines are still rising' },
      ] }];
    },
    getText, setText,
    readout(){
      /* The gap as seen down ONE side: two rows on, less the ink. Derived
         rather than read off offsets[0..2], which straddle the centred heading
         and so carry the wider stacked margin instead of the normal one. */
      const p0 = allLines[0];
      const ink = inkHeight(p0.firstElementChild || p0);
      const box = p0.offsetHeight;
      const g = parseFloat(getComputedStyle(column).rowGap) || 0;
      const last = allLines[allLines.length - 1];
      const contentH = last ? last.offsetTop + last.offsetHeight : 0;
      /* `fills` is the number the copy is actually being written against: how
         many viewport-heights of scrolling the story is worth, run-out
         excluded. Below 1 the whole thing is on screen at once and scrolling
         only carries it away; around 2-3 it reads as a passage. */
      const fills = stageH ? (contentH / stageH) : 0;
      return { travel: current.toFixed(0), max: maxTravel.toFixed(0),
               at: maxTravel ? (current / maxTravel * 100).toFixed(0) + '%' : '—',
               visibleGap: (2 * (box + g) - ink).toFixed(1),
               lines: String(lines.length),
               copyH: contentH.toFixed(0) + 'px',
               fills: fills.toFixed(2) + ' screens',
               tooWide: String(tooWide) };
    },
  };

  return function destroy(){
    alive = false;
    cancelAnimationFrame(raf);
    clearTimeout(rt);
    on.release();
    if (window.ABOUTTEXT && window.ABOUTTEXT.config === CONFIG) delete window.ABOUTTEXT;
  };
});
