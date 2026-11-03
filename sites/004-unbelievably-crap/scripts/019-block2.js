/* ==========================================================================
   block2.js — the second block's OWN scroll, and what rides on it.

   THE PAGE HAD THREE PHASES AND NOW HAS FOUR:

     1  the copy runs           js/about-text.js owns the wheel
     2  black tears to white    js/mask-scroll.js owns it, 0 -> overPx
     3  the head, and this      <- new. Everything after the transition lands.
     4  the footer              (part 3, not built yet)

   Phase 2 CLAMPS its target at overPx, so the moment the head arrived the wheel
   stopped doing anything at all — that clamp is where the page used to end. This
   file adds the accumulator that takes over there, and publishes it as
   window.BLOCK2 so the states can be read off one number the way block 01's are
   read off js/about-text.js's travel.

   IT DOES NOT FIGHT FOR THE WHEEL. Both this and mask-scroll listen on the same
   element and neither stops the other: mask-scroll discards the delta it cannot
   use (it is already at its ceiling) and this one only accepts a delta once that
   ceiling is reached. Downward, the handover is automatic. UPWARD it is not, and
   that is the one line this file needs from mask-scroll — see the note there:
   block 02's own scroll has to return to 0 before the transition may start
   closing, or scrolling back would peel the white away with the text still
   halfway up the screen.

   PART 1 rides it: the two columns of type, travelling from below the fold up
   and out of the top. Their content is a dial, because it is dummy copy and the
   question being asked of it is "how much more of this do I need".
   ========================================================================== */
window.PAGE.register('block2', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'mask') return;
  const root = scope.querySelector('.b2');
  if (!root) return;

  const colsL = root.querySelector('.b2__col--l .b2__list');
  const colsR = root.querySelector('.b2__col--r .b2__list');

  const CONFIG = {
    enabled: true,

    /* THE COPY'S OWN EASE. js/about-text.js settles at 0.02 and this had 0.10,
       five times the lag, which is half of why block 02 moved to a different
       rhythm from the block above it.

       The SPEED IS the copy's 0.4, tuned to it on the page. It shipped at 1.0
       — a normal page scroll, on the argument that the block above is a slow
       story being read and this one is not — and 1.0 threw the white texts past
       the eye a screen at a time. At 0.4 the two blocks scroll at one rate and
       the head is looked at rather than passed.

       One number was declared twice here for a while — 0.4 up here and 1.0
       below — and the second silently won, which is the kind of thing an object
       literal will never warn about. There is one declaration now. */
    wheelSpeed: 1.0,   // 1:1 with the wheel — see the note in js/about-text.js
    ease: 0.02,

    /* ---- ONE COLUMN, ONE CONSTANT RATE ----
       Everything below is a START POSITION in the virtual column, in viewport
       heights from the top, and every item's y is simply `start * innerHeight -
       travel`. Nothing is remapped, eased or held.

       It was ramps before — a fast entry, a slow middle, a share of the phase
       per item — and that is what "sometimes faster, sometimes slower, feels
       cut off" was. A ramp is the right tool for a state that has to LAND
       somewhere; it is the wrong one for reading, because a reader's eye tracks
       a constant rate and reads any change in it as a stutter. The page's own
       copy has no ramps either: about-text moves its column by the travel and
       nothing else, which is why it feels like scrolling.

       So the whole phase is now a plain scroll, and the only numbers left are
       where each thing starts. */
    /* IN VIEW THE MOMENT THE HEAD LANDS — 0 is the centred rest position, so
       there is nothing to scroll to before the copy is there. It arrived from
       below the fold before, which meant two or three notches of an empty white
       screen, and an entrance that had already been asked for and answered:
       the rest of this site reveals type with .anim-line's blur-in, and this
       block was the only one travelling instead. It now does what the work page
       and block 01 do, and the travel is only the scroll carrying it away. */
    /* ---- PART 0, the scroll-through strip ----
       Figma 14719:22210, 1644px of text between the white arriving and the
       columns. Its HEIGHT is the distance you scroll through it, so nothing
       here is a duration — tsGap is the only free number, the clear space
       after it before the columns start. */
    tsOn: true,
    /* ZERO: THE WHITE OPENS WITH THE TEXT ALREADY ON IT. At 0.7 the block
       arrived as a screen of empty white and the type came up from below,
       which reads as a gap rather than as an arrival. The strip's top now
       sits at the top of the block, so the white and the text land together
       and the reveal plays where the visitor is already looking. */
    tsStart: 0.5,      // where the strip's top enters, in screens
    tsGap: 0,          // screens of clear white between the strip and part 1

    colsStart: 0.7,    // the columns' offset from centre, in screens · AFTER the strip
    /* AFTER THE COLUMNS HAVE GONE. The pair is centred at travel 0 and is clear
       of the top by roughly half a screen plus half its own height; 1.5 puts the
       first white text's entrance after that, so the two never share the screen.
       Raise it and there is more empty white between them. */
    capColour: '#e8271c',  // the site's red · these were white until the strip arrived
    capStart:  1.8,    // the first white text
    capGap:    1.25,   // ...and the distance to each next one
    capTail:   1.1,    // room after the last one, before the phase ends

    /* ---- PART 2, the white texts ----
       Figma 14528:14331: 128px, line-height .75, tracking -5.12px (kept as
       -0.04em so it survives the viewport scaling), uppercase, WHITE, wrapped
       in a 616px box on a 1920 frame.

       White type on a white ground reads only because the ASCII characters are
       under it — which is why it cannot be a DOM layer. The white block is one
       canvas js/mask-scroll.js paints, so "behind the head but over the
       characters" is a position in THAT shader. See uCap there.

       A LINE MAY BE SPLIT. `left || right` puts one block against the left edge
       and one against the right, which is what the last of the three wants: the
       question on one side of the head and the answer on the other. A line with
       no `||` is a single centred block, as the first two are. */
    capOn: true,
    /* THE WHITE TEXTS' OWN FADE, driven by js/footer.js and by nothing else.

       WHY IT HAS TO EXIST AT ALL. These lines are not DOM — they are painted
       into a canvas that js/mask-scroll.js samples as a texture into the white
       block, so there is no element to give an opacity to and no stylesheet
       that can reach them. The footer arrives as a red blend OVER that
       composite, deliberately, so that the head and the ground show through
       it; the same transparency that lets the head through would have let the
       last two captions through as well, and they are the previous section
       still talking over the new one. */
    capAlpha: 1,
    capText: ['i am a selfish man',
              'designed to die',
              'but is it heaven up there? || \u2018cause it\u2019s a hell down here'],
    capSize: 128,       // px at a 1920-wide frame; scaled to the viewport
    capWidth: 616,      // the box a CENTRED line wraps inside, same frame
    capSideWidth: 780,  // ...and the box each half of a SPLIT line gets
    capSideEdge: 30,    // how far a split block sits from the viewport edge
    /* The last text stops rising and stays for the footer. capPinAt is where it
       comes to rest, in screens from the top of the viewport. */
    /* Where the four corner labels start fading and where they have gone, as
       shares of this phase. Before the footer's own 0.80, so they are away
       rather than being covered. */
    cornerFade: 0.62,
    cornerGone: 0.76,
    /* The corner words themselves. Both are filled from the markup at mount —
       see the note beside setCornerB — so these two empty strings are never
       what the page shows. */
    cornerA: '',
    cornerB: '',
    /* How far the stack of three sits in from the outer word. css/block2.css
       had it as a bare 105px in two mirrored rules; it is one variable now, so
       the two sides cannot end up set to different numbers. */
    cornerGap: 105,
    capPin: true,
    capPinAt: 0.30,
    /* ---- the cursor's label ----
       Shown only while this block has the screen AND the pointer is over it —
       two separate conditions, because a block being on screen says nothing
       about where the cursor is. It leaves the moment the pointer crosses into
       the footer or the bar, which are chrome and not this block. */
    hintOn: true,
    hintText: 'don\u2019t click',
    /* WHAT IT SAYS ONCE YOU HAVE. The label is the head talking, and the only
       thing you can do to it is spin it — so it asks you not to, and then it
       complains. It goes back on its own; there is nothing to dismiss. */
    hintClick:   'i\u2019m dizzy now',
    hintClickMs: 3000,
    hintDX: 0,          // px from the pointer, positive is right
    hintDY: -16,        // ...and up
    capLead: 0.75,      // line-height
    capTrack: -0.04,    // em, i.e. Figma's -5.12px at 128
  };

  /* THE ENTRANCE WAITS FOR THE BLOCK, exactly as js/about-text.js's does for
     the copy: .anim-line is a one-shot CSS animation that runs at mount, and
     block 02 does not exist on screen for the first two thousand pixels of
     wheel. Held paused until the white has arrived, then released once. */
  let introHeld = true;
  root.classList.add('is-held');

  const on = window.PAGE.bindings();
  let target = 0, current = 0, raf = 0, last = performance.now();

  /* ---- the cursor's label -------------------------------------------------
     Its position is written on every pointermove and its visibility is decided
     there too, from the one thing that actually settles it: is the pointer
     above the chrome. The footer's top edge moves as it opens and the bar's
     does not, so the boundary is whichever of the two is higher up the screen —
     read from the elements rather than from a number, so it stays right at any
     footer height. */
  const hint = root.querySelector('.b2__hint');
  const ftrEl = scope.querySelector('.ftr');
  const barEl = scope.querySelector('.bar');
  let hintShown = null;

  /* ---- and what it says ---------------------------------------------------
     Two lines and a timer. `dizzy` is the state rather than the timeout id
     because an id stays truthy long after it has fired, and setHint below has
     to know whether it is safe to write. */
  let dizzyT = 0, dizzy = false;
  function say(t){ if (hint) hint.textContent = t; }
  say(CONFIG.hintText);

  /* A DRAG IS NOT A CLICK, and on this block that distinction is the whole
     difference: the head is draggable — that is what spins it — and a drag
     ends by dispatching `click` like anything else. Answering "i'm dizzy now"
     to somebody who is in the middle of turning it would be the label talking
     over the thing it is talking about. Six pixels of travel is the line. */
  let downX = 0, downY = 0;
  on(window, 'pointerdown', e => { downX = e.clientX; downY = e.clientY; });
  on(window, 'click', e => {
    if (!hint || !hintShown || !CONFIG.hintOn) return;
    if (Math.abs(e.clientX - downX) > 6 || Math.abs(e.clientY - downY) > 6) return;
    /* Clicking again restarts the three seconds rather than queueing a second
       reset behind the first, which would have put the label back mid-sentence
       on the second click. */
    clearTimeout(dizzyT);
    dizzy = true;
    say(CONFIG.hintClick);
    dizzyT = setTimeout(() => { dizzy = false; say(CONFIG.hintText); },
                        Math.max(0, CONFIG.hintClickMs));
  });

  on(window, 'pointermove', e => {
    if (!hint) return;
    hint.style.transform =
      `translate(calc(-50% + ${e.clientX + CONFIG.hintDX}px), ${e.clientY + CONFIG.hintDY}px)`;

    /* THE BAR IS A GEOMETRIC QUESTION. It is a 28px strip pinned to the bottom
       of the screen, so "is the pointer over it" is genuinely about where its
       top edge is, and that edge is read off the element rather than typed in
       here because the bar slides away when the footer opens. */
    let floor = innerHeight;
    if (barEl){ const b = barEl.getBoundingClientRect(); floor = Math.min(floor, b.top); }

    /* THE FOOTER IS NOT, AND THAT IS THE BUG THIS LINE REPLACES. It used to be
       measured the same way, which was right while it was a strip along the
       bottom — but the footer is now a FULL-SCREEN fixed panel, laid out at all
       times so its own measurements are ready (see .ftr in css/footer.css). Its
       top edge is therefore 0, always, and `pointer is above the footer` became
       `clientY < 0`: the label stopped appearing anywhere on the block and
       nothing about it looked broken.

       It is a state question now. While the footer is up, block 02 is being
       replaced — there is nothing here left to label. */
    const ftrUp = !!(ftrEl && ftrEl.classList.contains('is-live'));

    const show = CONFIG.hintOn && transitionDone() && !ftrUp && e.clientY < floor;
    if (show !== hintShown){ hintShown = show; hint.classList.toggle('is-on', show); }
  });

  /* Gone with the pointer. Without this the label is left frozen on the last
     position it saw when the window loses focus. */
  on(document, 'pointerleave', () => {
    if (hint){ hintShown = false; hint.classList.remove('is-on'); }
  });

  /* Only once the transition has finished. `>= 0.999` rather than `=== 1`
     because `current` eases toward its target and lands a hair short. */
  /* 0.9, not 0.999 — and that difference IS the "2 to 5 scrolls of nothing".

     js/mask-scroll.js eases its own travel at 0.5 SECONDS, so after the white
     has visibly landed its progress creeps toward 1 for the best part of a
     second. During that creep this phase refused the wheel and mask-scroll
     discarded it (already at its ceiling), so the notches went nowhere at all.
     At 0.9 the white is there to look at and the scroll is live. */
  const transitionDone = () =>
    !window.MASKSCROLL || window.MASKSCROLL.progress() >= 0.9;

  on(scope.querySelector('#aboutRoot') || scope, 'wheel', e => {
    /* SHIFT NO LONGER MEANS ANYTHING. This early return existed to keep the wheel
       clear for js/mask.js's shift-wheel scaling, which is off now — so holding
       shift while scrolling was landing on a page that ignored it entirely.
       Shift is an ordinary wheel again. */
    if (!CONFIG.enabled) return;
    const down = e.deltaY > 0;
    /* Down: only after the white has fully arrived. Up: only while this phase
       still has somewhere to go — below that, the wheel belongs to the
       transition again and mask-scroll takes it. */
    if (down && !transitionDone()) return;
    if (!down && target <= 0) return;
    e.preventDefault();
    target = Math.max(0, Math.min(span(), target + e.deltaY * CONFIG.wheelSpeed));
  }, { passive: false });

  on(window, 'keydown', e => {
    if (!CONFIG.enabled) return;
    if (e.key === 'End' && transitionDone()) target = span();
    if (e.key === 'Home') target = 0;
  });

  /* THE PHASE IS AS LONG AS ITS CONTENT, derived rather than typed — the same
     shape as about-text's maxTravel. Type a length instead and it is wrong the
     first time a text is added or the window is resized. */
  /* The strip's height in px, once. Kept beside span() because the two have
     to agree: a phase that did not grow by the strip's height would run out
     of scroll with the last white text still below the fold. */
  const TS_H = 1644;
  const span = () => Math.max(1, (CONFIG.capStart
    + Math.max(0, CONFIG.capText.length - 1) * CONFIG.capGap
    + CONFIG.capTail) * Math.max(1, innerHeight)
    + (CONFIG.tsOn ? TS_H + CONFIG.tsGap * Math.max(1, innerHeight) : 0));
  const p = () => Math.max(0, Math.min(1, current / span()));


  function frame(now){
    if (!window.PAGE || !document.body.contains(root)) return;
    const dt = Math.min((now - last) / 1000, 0.1); last = now;

    const k = 1 - Math.exp(-dt / Math.max(0.001, CONFIG.ease));
    current += (target - current) * k;

    const v = p();

    /* ONE SCROLL. Every start is a viewport height; every y is that start
       less the travel. No ramp anywhere, so nothing speeds up or slows down. */
    if (introHeld && transitionDone()){
      introHeld = false;
      root.classList.remove('is-held');
    }

    const H = Math.max(1, innerHeight);

    /* THE STRIP'S HEIGHT, IN PIXELS, ADDED TO EVERYTHING AFTER IT. Written as
       a real 1644 rather than as a share of a screen because that is what it
       is: a fixed block of type at a fixed line pitch. Expressed in screens it
       would be a different amount of reading on every laptop. */
    const tsPush = CONFIG.tsOn ? (TS_H + CONFIG.tsGap * H) : 0;

    if (ts){
      const tsY = CONFIG.tsStart * H - current;
      ts.style.setProperty('--b2-ts-y', tsY.toFixed(1) + 'px');
      /* IT COMES UP WITH THE WHITE. js/mask-scroll.js's progress is 0 while
         the block above still has the screen and 1 once the white has landed,
         which is exactly the curve this type wants: by the time there is a
         white block to read it on, the reading is already there. Tied to that
         rather than to .b2's own gate, which only opens once the transition
         has finished — a fade the visitor would watch. */
      const MS = window.MASKSCROLL;
      const w = (MS && typeof MS.progress === 'function') ? MS.progress() : 1;
      ts.style.setProperty('--b2-ts-a', w.toFixed(3));
    }

    const colsY = CONFIG.colsStart * H + tsPush - current;
    root.style.setProperty('--b2-cols-y', colsY.toFixed(1) + 'px');
    root.style.setProperty('--b2-cols-a', '1');

    /* PART 2, on the same column and at the same rate. EVERY text that is on
       screen, not the first that is: drawing only the first match meant a text
       still leaving the top kept the next one from being drawn at all, so the
       one below did not rise into view — it appeared out of nowhere the instant
       the one above released it. Two can legitimately share the screen. */
    if (CONFIG.capOn && CONFIG.capText.length){
      const vis = [];
      for (let i = 0; i < CONFIG.capText.length; i++){
        let y = (CONFIG.capStart + i * CONFIG.capGap) * H + tsPush - current;

        /* THE LAST ONE PINS. It is the line the footer opens under and it has
           to still be there when it does, so once it has risen to its resting
           place it stops and the scroll goes on without it. Every other text
           travels straight through. */
        if (CONFIG.capPin && i === CONFIG.capText.length - 1){
          y = Math.max(y, CONFIG.capPinAt * H);
        }
        if (y < H * 1.2 && y > -H * 0.8) vis.push({ i, y: y * capDpr });
      }
      drawCaps(vis);
    } else drawCaps([]);

    /* The layer as a whole belongs to the white block. Before the head lands
       there is nothing here to show, and #393939 type over the black block
       would be invisible anyway. */
    /* THE CORNER LABELS LEAVE BEFORE THE FOOTER ARRIVES. They belong to the
       reading part of this block, and by the footer the screen is a card, a
       strip and a running line — four words still pinned to the top corners
       read as something nobody cleared away. */
    const cornerOut = Math.max(0, Math.min(1,
      (v - CONFIG.cornerFade) / Math.max(1e-4, CONFIG.cornerGone - CONFIG.cornerFade)));
    root.style.setProperty('--b2-corner-a', (1 - cornerOut).toFixed(3));

    root.classList.toggle('is-on', transitionDone());

    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  /* ---- the columns' content -----------------------------------------------
     One line per row, exactly like js/about-text.js's copy dial: it is dummy
     text and the question actually being asked is "how much more of this do I
     need", which you can only answer by pasting some in and looking. */
  const readList = el => [...el.children].map(n => n.textContent).join('\n');
  const writeList = (el, s) => {
    el.textContent = '';
    let i = 0;
    s.split('\n').forEach(line => {
      const t = line.trim();
      if (!t) return;
      const pp = document.createElement('p');
      /* THE REVEAL, WHICH THIS USED TO DROP. The shipped markup gives every
         word `class="anim-line" style="--i:N"` — that is the site's blur-in,
         staggered by the index. A word typed into the console arrived without
         either, so the list you tuned animated differently from the list you
         shipped, and the difference only showed on a reload. Same markup from
         both routes now. */
      pp.className = 'anim-line';
      pp.style.setProperty('--i', i++);
      pp.textContent = t;
      el.appendChild(pp);
    });
  };

  /* ---- THE FOUR CORNER LABELS ---------------------------------------------
     The words pinned to the top corners while block 02 comes up — one on the
     outer edge and a stack of three set in from it, mirrored left and right.

     THEY WERE MARKUP AND NOTHING ELSE: four copies of the same words typed into
     index.html, with no dial anywhere and no single place to change them.
     Editing them meant editing the page in four places and hoping they matched.

     ONE PAIR OF STRINGS DRIVES ALL FOUR, which is the point — the two corners
     are the same words mirrored, so they cannot drift apart. */
  const corners = [...root.querySelectorAll('.b2__corner')];

  function setCornerA(v){
    const t = String(v).trim();
    CONFIG.cornerA = t;
    corners.forEach(c => {
      const el = c.querySelector('.a');
      if (el) el.textContent = t;
    });
  }
  function setCornerB(v){
    const lines = String(v).split('\n').map(t => t.trim()).filter(Boolean);
    CONFIG.cornerB = lines.join('\n');
    corners.forEach(c => {
      /* Rebuilt rather than reused: the count changes, and .a is a sibling that
         has to survive — so the .b nodes go and are written back after it. */
      [...c.querySelectorAll('.b')].forEach(n => n.remove());
      lines.forEach(t => {
        const pp = document.createElement('p');
        pp.className = 'b';
        pp.textContent = t;
        c.appendChild(pp);
      });
    });
  }

  /* THE SHIPPED WORDS ARE THE DEFAULTS, read back off the markup rather than
     typed again into CONFIG — a second copy of four words is a second copy to
     keep in step, and this one would go wrong silently. */
  if (corners.length){
    CONFIG.cornerA = (corners[0].querySelector('.a') || {}).textContent || '';
    CONFIG.cornerB = [...corners[0].querySelectorAll('.b')]
                       .map(n => n.textContent).join('\n');
  }

  /* ---- PART 2: the caption canvas ----------------------------------------
     A 2D canvas, because this is type: fillText with a real font beats anything
     that would have to be rebuilt in GLSL, and js/mask-scroll.js can sample a
     canvas as happily as it samples the ASCII layer. Hidden from the compositor
     like .work-blobs and #maskBody — it is a texture source, not a layer. */
  const cap = root.querySelector('.b2-cap');
  const ts = scope.querySelector('[data-ts]');
  const cx  = cap ? cap.getContext('2d') : null;
  let capW = 0, capH = 0, capDpr = 1, fontReady = false;

  if (document.fonts && document.fonts.ready){
    document.fonts.ready.then(() => { fontReady = true; });
  } else fontReady = true;

  function capResize(){
    if (!cap) return;
    /* Capped at 2, and at 1.5 above a 2400px viewport: this is a full-screen
       canvas re-drawn whenever the text moves, and its only reader is a texture
       upload that is already resampling it. */
    capDpr = Math.min(window.devicePixelRatio || 1, innerWidth > 2400 ? 1.5 : 2);
    capW = Math.max(1, Math.round(innerWidth  * capDpr));
    capH = Math.max(1, Math.round(innerHeight * capDpr));
    if (cap.width !== capW || cap.height !== capH){ cap.width = capW; cap.height = capH; }
  }
  capResize();
  on(window, 'resize', capResize);

  /* Word wrap to the design's box, at the design's size, both scaled by how
     wide the viewport is against Figma's 1920 — so the type keeps its
     proportion to the head rather than its absolute size. */
  function wrap(text, maxPx){
    const words = String(text).toUpperCase().split(/\s+/).filter(Boolean);
    const lines = []; let line = '';
    for (const w of words){
      const t = line ? line + ' ' + w : w;
      if (line && cx.measureText(t).width > maxPx){ lines.push(line); line = w; }
      else line = t;
    }
    if (line) lines.push(line);
    return lines;
  }

  /* The canvas holds a LIST now. Clearing and keying belong here, once per
     frame, so drawing a second block cannot wipe the first. */
  let capLast = '';
  function drawCaps(list){
    if (!cx) return;
    /* THE COLOUR IS PART OF THE KEY. Without it, changing capColour in the
       console repainted nothing — the cache said the frame was identical
       because every position was, which is the exact shape of a control
       that looks broken. */
    /* THE ALPHA IS PART OF THE KEY, for the same reason the colour is: the
       cache compares what was drawn, and a fade whose positions have not moved
       is a frame the cache would otherwise call identical and skip. Quantised
       so a fade does not force a repaint on every thousandth. */
    const key = list.map(o => o.i + '@' + Math.round(o.y)).join(',')
              + '|' + capW + '|' + CONFIG.capColour
              + '|' + Math.round(Math.max(0, Math.min(1, CONFIG.capAlpha)) * 100);
    if (key === capLast) return;          // nothing moved; skip the redraw
    capLast = key;
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.clearRect(0, 0, capW, capH);
    if (!CONFIG.capOn) return;
    const a = Math.max(0, Math.min(1, CONFIG.capAlpha));
    if (a <= 0.002) return;          // cleared above; nothing to draw
    for (const o of list) drawOne(o.i, o.y, a);
  }

  /* Canvas takes a colour string, and the console hands us a hex. One helper
     rather than a colour parsed at sixty frames a second. */
  function hexToRgba(hex, a){
    const h = String(hex || '#ffffff').replace('#', '');
    const n = h.length === 3
      ? h.split('').map(c => parseInt(c + c, 16))
      : [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
    return 'rgba(' + n[0] + ',' + n[1] + ',' + n[2] + ',' + a.toFixed(3) + ')';
  }

  function drawOne(idx, y, alpha){
    if (!cx || idx < 0 || alpha <= 0.002) return;

    const k = (innerWidth / 1920) * capDpr;
    const size = CONFIG.capSize * k;
    cx.font = '400 ' + size.toFixed(1) + "px 'PP Supply Sans', system-ui, sans-serif";
    cx.letterSpacing = (CONFIG.capTrack * size).toFixed(2) + 'px';
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    /* RED, NOT WHITE. These used to be white type on the white block, legible
       only because the ASCII ground moves under them. In the site's red they
       are the same shape reading against that ground instead of through it —
       so the colour is a real one rather than an alpha trick, and the alpha
       stays the fade it always was. */
    cx.fillStyle = hexToRgba(CONFIG.capColour, alpha);

    const lh = size * CONFIG.capLead;
    const raw = CONFIG.capText[idx] || '';

    /* A BLOCK, wherever it is asked to sit. `y` is the top of the item in the
       virtual column, in device px, so the whole thing is positioned the same
       way the DOM columns are and moves at exactly the same rate. */
    const block = (text, boxPx, align, edgePx) => {
      const lines = wrap(text, boxPx);
      cx.textAlign = align;
      const x = align === 'left'  ? edgePx
              : align === 'right' ? capW - edgePx
              : capW / 2;
      for (let i = 0; i < lines.length; i++) cx.fillText(lines[i], x, y + lh / 2 + i * lh);
    };

    if (raw.includes('||')){
      /* SPLIT. The question against one edge and the answer against the other,
         with the head between them — which is the whole point of the last of
         the three, and impossible while it was one centred block. */
      const [l, r] = raw.split('||');
      const box = CONFIG.capSideWidth * k;
      const edge = CONFIG.capSideEdge * k;
      block(l, box, 'left',  edge);
      block(r, box, 'right', edge);
    } else {
      block(raw, CONFIG.capWidth * k, 'center', 0);
    }
  }

  window.BLOCK2 = {
    config: CONFIG,
    apply(){},
    /* Read by whatever comes next: parts 2 and 3 are further ramps on this. */
    progress: p,
    /* Jump the phase, 0..1. The transition has had one of these all along and
       it is the only sane way to look at a state two thousand pixels of wheel
       in — by hand or from a test. */
    seek(v){ target = current = Math.max(0, Math.min(1, v)) * span(); },
    get travel(){ return current; },
    /* THE WHOLE PHASE, IN PIXELS OF WHEEL. Read by js/footer.js, which needs
       to start its own ramp at a share of this phase and then run it for a
       fixed number of pixels rather than for a share — because that is what
       block 01's transition does, and the two are meant to feel identical. */
    get span(){ return span(); },
    getLeft:  () => readList(colsL),
    setLeft:  s => writeList(colsL, s),
    getCornerA: () => CONFIG.cornerA,
    setCornerA,
    getCornerB: () => CONFIG.cornerB,
    setCornerB,
    setCornerGap(v){
      CONFIG.cornerGap = v;
      root.style.setProperty('--b2-corner-gap', v + 'px');
    },
    setHint: v => { CONFIG.hintText = String(v); if (!dizzy) say(CONFIG.hintText); },
    getHint: () => CONFIG.hintText,
    getCaps: () => CONFIG.capText.join('\n'),
    setCaps: v => { CONFIG.capText = String(v).split('\n').map(t => t.trim()).filter(Boolean);
                    capLast = ''; },
    getRight: () => readList(colsR),
    setRight: s => writeList(colsR, s),
    readout(){
      return { b2: (p() * 100).toFixed(0) + '%',
               b2travel: current.toFixed(0) + '/' + span().toFixed(0),
               b2rows: colsL.children.length + ' / ' + colsR.children.length,
               b2cap: (capLast.split('|')[0] || '-') };
    },
  };

  return function destroy(){
    on.release();
    clearTimeout(dizzyT);
    cancelAnimationFrame(raf);
    if (window.BLOCK2 && window.BLOCK2.config === CONFIG) delete window.BLOCK2;
  };
});
