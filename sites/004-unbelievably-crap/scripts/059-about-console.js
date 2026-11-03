/* ==========================================================================
   about-console.js — schema for the About page's tuning panel.
   The panel itself lives in js/tuner.js and is shared with the other pages.
   Off by default; ` opens it.
   ========================================================================== */
window.PAGE.register('about-console', function (scope) {
  'use strict';
  if (!window.Tuner?.enabled) return;
  if (!scope.querySelector('#aboutFigure')) return;
  if (!window.FIGURE) return;
  /* AND ONLY ON THE TWO PAGES THIS PANEL IS FOR. window.FIGURE used to exist
     on About and the home page alone, so its presence was a good enough test.
     The 404 is block 01's markup now, so it has a window.FIGURE too — and
     without this line the whole About panel mounted there as a second Tuner on
     the same storeKey as js/err-console.js's, two panels writing one save. */
  if (scope.dataset.page !== 'about' && scope.dataset.page !== 'mask') return;

  /* Two pages share this panel: About, and the mask room in mask.html. The
     only difference is that one has copy on it and the other does not, so
     ABOUTTEXT is optional here and the three text groups are spread in only
     when it exists. A second console file would have drifted from this one the
     first time either changed.

     storeKey is per PAGE, so tuning one cannot restore over the other. */
  const F = window.FIGURE, T = window.ABOUTTEXT || null;
  const PAGE = scope.dataset.page || 'about';

  /* WHOSE DIAL IS THIS. On About there is one block and the group names can
     just say what they do. mask.html is two blocks and the whole point of the
     panel there is that you can tell, at a glance and without reading a hint,
     which one you are about to change. So every group is stamped with the
     block it writes to — and it is only a stamp because the isolation is
     structural: block 01 is js/about-figure.js's own config and block 02 is a
     second instance's, two separate objects that share no state. A dial in one
     set cannot reach the other even by accident. */
  const TWO = PAGE === 'mask';
  const b1 = n => TWO ? 'BLOCK 01 · ' + n : n;   // the About block
  const b2 = n => 'BLOCK 02 · ' + n;             // the head
  const mid = n => TWO ? 'BETWEEN 01 → 02 · ' + n : n;
  const pg  = n => TWO ? 'PAGE · ' + n : n;

  /* NOTHING FROM THE OLD SETS, on this page.

     Block 01, block 02 and the transition are all settled, and a dial you
     cannot see is a dial you cannot brush past on the way to another one. So
     the home page's panel shows exactly one group: the map's running lines,
     which is the only thing here still being tuned.

     This hides rows; it disables nothing. Every module still runs on the values
     baked into its own file, and Copy settings still writes them all out — so
     nothing is lost, it is out of reach. TO BRING A SET BACK: add its stamp to
     the list. 'BLOCK 02' is the head, 'BLOCK 01' the About block, 'BETWEEN' the
     transition, 'PAGE' the page itself. null shows everything. */
  const SHOW_ONLY = TWO
    /* NARROWED TO THE WORK IN HAND. Everything below is still built, still
       live and still written out by Copy settings — it is out of the panel,
       not out of the site. Widening it again is adding the stamp back to this
       list; the names are the ones the groups are spread in with, which for
       the x-ray set means the b1() stamp and not the name in its own file. */
    ? ['FOOTER \u00b7 the page turning red',
       'PAGE \u00b7 leaving this page \u00b7 the tear',
       'BETWEEN 01 \u2192 02',
       /* LONGER THAN THE GROUP IT COMES FROM, deliberately: the match is a
          startsWith, and 'HUD \u00b7 the figure' would let the whole twenty-row
          group through with it. */
       'HUD \u00b7 the figure turning']
    : null;   // NOT 'BLOCK 02' — that stamp also matches the nine head groups
  const visible = list => {
    const keep = SHOW_ONLY
      ? list.filter(g => g && SHOW_ONLY.some(s => String(g.name).startsWith(s)))
      : list.filter(Boolean);
    /* If a stamp ever stops matching — a group renamed, a module absent — an
       empty panel is a far worse answer than the whole panel, so say so and
       show everything rather than presenting a working page as a broken one. */
    if (SHOW_ONLY && !keep.length){
      console.warn('[about-console] SHOW_ONLY matched nothing:', SHOW_ONLY);
      return list.filter(Boolean);
    }
    return keep;
  };
  const root   = scope.querySelector('.about');
  const fx     = scope.querySelector('.about__fx');
  const column = scope.querySelector('#aboutColumn');

  /* The length of block 01's scroll, for the turn dial below. Read from the
     copy rather than stored: it moves with the line gap, the run-out and the
     viewport, and a turn aimed at "the end" has to mean whatever the end
     currently is. The fallback only matters on a page with no copy, where
     nothing reads it anyway. */
  const travelMax = () => (T && parseFloat(T.readout().max)) || 1278;

  /* The map's hatch box, and the two helpers its rows need. `step` is the
     derivation the seamless loop depends on: the travel per cycle has to be the
     stripe period measured along x, which is period / sin(angle). */
  const map = scope.querySelector('.hud__mapbox');
  const mapVar = (name, fallback) => {
    if (!map) return fallback;
    const v = parseFloat(getComputedStyle(map).getPropertyValue(name));
    return Number.isFinite(v) ? v : fallback;
  };
  function step(){
    if (!map) return;
    const per = mapVar('--hatch-period', 7);
    const deg = mapVar('--hatch-angle', 105);
    const s = Math.abs(Math.sin(deg * Math.PI / 180));
    map.style.setProperty('--hatch-step',
      (per / Math.max(0.05, s)).toFixed(3) + 'px');
  }

  const cssVar = (el, name, fallback) => ({
    get: () => { const v = getComputedStyle(el).getPropertyValue(name).trim();
                 return v === '' ? fallback : (parseFloat(v) || v); },
    set: v => el.style.setProperty(name, v),
  });

  const BLENDS = ['saturation','color','hue','luminosity','overlay','soft-light',
                  'hard-light','screen','multiply','difference','exclusion','normal'];

  const panel = window.Tuner.create({
    title: PAGE === 'mask'
      ? (SHOW_ONLY ? 'INDEX · LINES' : 'INDEX TUNER')
      : 'ABOUT TUNER',
    storeKey: 'shots2026.' + PAGE,
    config: F.config,
    extraButton: 'Re-frame',
    onExtra: say => { F.apply(); if (T) T.apply(); say('Re-framed'); },

    apply: row => { if (!row.set) F.apply(); },
    restored: () => { F.apply(); if (T) T.apply(); },
    reset: () => { F.apply(); if (T) T.apply(); },
    readout: () => ({ ...(window.SHEETFX ? window.SHEETFX.readout() : {}), ...(window.IRIS ? window.IRIS.readout() : {}), ...(window.LIQUID ? window.LIQUID.readout() : {}), ...F.readout(), ...(T ? T.readout() : {}),
                      ...(window.XRAY ? window.XRAY.readout() : {}),
                      ...(window.MASKPAGE ? window.MASKPAGE.readout() : {}),
                      ...(window.MASKSCROLL ? window.MASKSCROLL.readout() : {}),
                      ...(window.BLOCK2 ? window.BLOCK2.readout() : {}),
                      ...(window.FOOTER ? window.FOOTER.readout() : {}),
                      ...(window.HUDFIGURE ? window.HUDFIGURE.readout() : {}),
                      ...(window.LOGO ? { logo: window.LOGO.readout().figure } : {}) }),

    groups: visible([
      /* ---- added since the panel was written --------------------------------
         The tuner does NOT discover rows(): every group is listed by hand in a
         console file, so a module can expose a perfectly good rows() and simply
         never appear. These four did exactly that. Spread conditionally, like
         the rest of the file, so a page that does not run one of them shows no
         empty section. */
      ...(window.LINEREVEAL ? [{ name: 'BLOCK 01 \u00b7 how fast the copy resolves', open: true,
          rows: window.LINEREVEAL.rows() }] : []),
      ...(window.CTA ? [{ name: 'BAR \u00b7 the refusing button', open: false,
          rows: window.CTA.rows() }] : []),
      /* Carries its own group NAME rather than a rows() the panel wraps: it is
         one module's whole story, and naming it here as well would be a second
         place for that name to be wrong. */
      ...(window.TSCROLL ? window.TSCROLL.groups() : []),

      /* PART 1's COPY. Dummy text, and the question actually being asked of it
         is "how much more of this do I need" — which is not a question you can
         answer by reading the file, only by pasting some in and watching where
         the columns run out. One line per row, like the block-01 copy dial. */
      /* BLOCK 02'S CONTENT, on one constant-rate column. Every start below is
         a viewport height from the top of the viewport, and every item's y is
         that start less the travel — so these are POSITIONS, not timings, and
         nothing here can make anything speed up or slow down. */
      ...(window.BLOCK2 ? [{ name: 'BLOCK 02 · the columns', open: true, rows: [
        { label:'cols.left', textarea: true, rows: 8,
          get: () => window.BLOCK2.getLeft(), set: v => { window.BLOCK2.setLeft(v); },
          hint:'the left column, one line per row \u00b7 blank lines are dropped' },
        { label:'cols.right', textarea: true, rows: 8,
          get: () => window.BLOCK2.getRight(), set: v => { window.BLOCK2.setRight(v); },
          hint:'the right column, same again \u00b7 the two are independent, so they can be different lengths' },
        /* THE FOUR CORNER LABELS. One pair of strings drives all four — the
           corners are the same words mirrored, so a dial per corner would only
           be four ways to make them disagree. */
        { label:'corner.a', textarea: true, rows: 1,
          get: () => window.BLOCK2.getCornerA(), set: v => { window.BLOCK2.setCornerA(v); },
          hint:'the single word on the outer edge of each top corner \u00b7 both corners at once, because they are one label mirrored' },
        { label:'corner.b', textarea: true, rows: 4,
          get: () => window.BLOCK2.getCornerB(), set: v => { window.BLOCK2.setCornerB(v); },
          hint:'the stack set in from it, one line per row \u00b7 three is what the design draws, but any number works and the block below simply starts lower' },
        { label:'corner.gap', min:0, max:400, step:5,
          get: () => window.BLOCK2.config.cornerGap,
          set: v => { window.BLOCK2.setCornerGap(v); },
          hint:'how far the stack sits in from the outer word, in px \u00b7 one number for both sides' },
        { label:'corner.fade', min:0, max:1, step:0.01,
          get: () => window.BLOCK2.config.cornerFade,
          set: v => { window.BLOCK2.config.cornerFade = v; },
          hint:'how far through the block they START going \u00b7 they are the only thing still pinned to the top while everything else travels, so they have to leave before the footer arrives' },
        { label:'corner.gone', min:0, max:1, step:0.01,
          get: () => window.BLOCK2.config.cornerGone,
          set: v => { window.BLOCK2.config.cornerGone = v; },
          hint:'\u2026and where they have gone entirely' },

        { label:'cols.start', min:0, max:3, step:0.05,
          get: () => window.BLOCK2.config.colsStart,
          set: v => { window.BLOCK2.config.colsStart = v; },
          hint:'where the columns start, in screens below the top of the viewport \u00b7 1 puts them just off the bottom' },
        { label:'scroll.speed', min:0.2, max:2, step:0.05,
          get: () => window.BLOCK2.config.wheelSpeed,
          set: v => { window.BLOCK2.config.wheelSpeed = v; },
          hint:'px of content per px of wheel \u00b7 1 is a normal page scroll, 0.4 is the slow rate block 01\u2019s copy uses' },
      ]}] : []),

      /* THE FOOTER OWNS ITS OWN ROWS NOW. This section used to be written out
         by hand here, and when the footer was rebuilt every dial in it named a
         setting that no longer existed — a panel full of controls wired to
         nothing, which is worse than no panel. Spread from the module and it
         cannot drift again. */
      ...(window.FOOTER && window.FOOTER.groups ? window.FOOTER.groups() : []),

      ...(window.ABOUTTEXT && window.ABOUTTEXT.groups ? window.ABOUTTEXT.groups() : []),
      ...(window.MASKSCROLL ? [{ name: 'BLOCK 02 · the big mark behind it all', open: false, rows: [
        { label:'big.enabled', options:['on','off'],
          get: () => window.MASKSCROLL.config.bigOn ? 'on' : 'off',
          set: v => { window.MASKSCROLL.config.bigOn = (v === 'on'); },
          hint:'it is composited under the ground, so it is under the blob and under the head' },
        { label:'big.px', min:200, max:2600, step:2,
          get: () => window.MASKSCROLL.config.bigPx,
          set: v => { window.MASKSCROLL.config.bigPx = v; },
          hint:'its size in the file\u2019s own 1920 frame \u00b7 1186 is Figma\u2019s, and it keeps that proportion at any width' },
        { label:'big.x', min:-0.5, max:1.5, step:0.005,
          get: () => window.MASKSCROLL.config.bigX,
          set: v => { window.MASKSCROLL.config.bigX = v; }, hint:'centre across the width' },
        { label:'big.top', min:-600, max:600, step:1,
          get: () => window.MASKSCROLL.config.bigTop,
          set: v => { window.MASKSCROLL.config.bigTop = v; },
          hint:'px between the top of the screen and its top edge \u00b7 0 is flush, and it is the same on every screen height' },
        { label:'big.speed', min:0, max:5, step:0.05,
          get: () => window.MASKSCROLL.config.bigSpeed,
          set: v => { window.MASKSCROLL.config.bigSpeed = v; },
          hint:'how many screen-heights it falls \u00b7 below about 1.5 it is still on screen when it stops' },
        { label:'big.start', min:0, max:1, step:0.01,
          get: () => window.MASKSCROLL.config.bigStart,
          set: v => { window.MASKSCROLL.config.bigStart = v; },
          hint:'where in the block it starts falling \u00b7 0 goes on the first pixel of scroll, higher lets it sit still first' },
        { label:'big.until', min:0.02, max:1, step:0.01,
          get: () => window.MASKSCROLL.config.bigUntil,
          set: v => { window.MASKSCROLL.config.bigUntil = v; },
          hint:'where it has finished falling \u00b7 gone and staying gone after this, so keep it below where the columns arrive' },
        { label:'big.turns', min:-3, max:3, step:0.05,
          get: () => window.MASKSCROLL.config.bigTurns,
          set: v => { window.MASKSCROLL.config.bigTurns = v; },
          hint:'full turns while it falls \u00b7 negative winds it the other way' },
        { label:'big.alpha', min:0, max:1, step:0.01,
          get: () => window.MASKSCROLL.config.bigAlpha,
          set: v => { window.MASKSCROLL.config.bigAlpha = v; }, hint:'how strongly it reads' },
        { label:'big.colour', colour: true,
          get: () => window.MASKSCROLL.config.bigColour,
          set: v => { window.MASKSCROLL.config.bigColour = v; },
          hint:'only the file\u2019s alpha is used, so the colour is free \u00b7 no second copy of the artwork' },
      ] }] : []),

      ...(window.BLOCK2 ? [{ name: 'BLOCK 02 · the scroll-through text', open: true, rows: [
        { label:'ts.enabled', options:['on','off'],
          get: () => window.BLOCK2.config.tsOn ? 'on' : 'off',
          set: v => { window.BLOCK2.config.tsOn = (v === 'on'); },
          hint:'off removes the strip AND the scroll it costs \u00b7 the columns move back up to where they were' },
        { label:'ts.start', min:0, max:2, step:0.05,
          get: () => window.BLOCK2.config.tsStart,
          set: v => { window.BLOCK2.config.tsStart = v; },
          hint:'where the strip\u2019s top enters, in screens below the fold' },
        { label:'ts.gap', min:0, max:2, step:0.05,
          get: () => window.BLOCK2.config.tsGap,
          set: v => { window.BLOCK2.config.tsGap = v; },
          hint:'clear white between the end of the strip and the two columns, in screens' },
      ] }] : []),

      ...(window.BLOCK2 ? [{ name: 'BLOCK 02 · the white texts', open: true, rows: [
        { label:'cap.colour', colour: true,
          get: () => window.BLOCK2.config.capColour,
          set: v => { window.BLOCK2.config.capColour = v; },
          hint:'the big texts\u2019 colour \u00b7 red now, white until the strip arrived' },
        { label:'cap.text', textarea: true, rows: 6,
          get: () => window.BLOCK2.getCaps(), set: v => { window.BLOCK2.setCaps(v); },
          hint:'one text per line \u00b7 put || in a line to split it to the two edges instead of the middle, the way the last one is' },
        { label:'cap.start', min:0.5, max:4, step:0.05,
          get: () => window.BLOCK2.config.capStart,
          set: v => { window.BLOCK2.config.capStart = v; },
          hint:'where the first white text starts, in screens below the top' },
        { label:'cap.gap', min:0.5, max:3, step:0.05,
          get: () => window.BLOCK2.config.capGap,
          set: v => { window.BLOCK2.config.capGap = v; },
          hint:'distance from one to the next \u00b7 1 is exactly one screen apart' },
        { label:'cap.size', min:40, max:300, step:2,
          get: () => window.BLOCK2.config.capSize,
          set: v => { window.BLOCK2.config.capSize = v; },
          hint:'px at a 1920-wide frame, scaled to the viewport so it keeps its proportion to the head' },
        { label:'cap.width', min:200, max:1600, step:10,
          get: () => window.BLOCK2.config.capWidth,
          set: v => { window.BLOCK2.config.capWidth = v; },
          hint:'the box a CENTRED line wraps inside' },
        { label:'cap.sideWidth', min:300, max:1400, step:10,
          get: () => window.BLOCK2.config.capSideWidth,
          set: v => { window.BLOCK2.config.capSideWidth = v; },
          hint:'\u2026and the box each half of a SPLIT line gets' },
        { label:'cap.sideEdge', min:0, max:200, step:2,
          get: () => window.BLOCK2.config.capSideEdge,
          set: v => { window.BLOCK2.config.capSideEdge = v; },
          hint:'how far a split block sits from the viewport edge' },
      ]}] : []),

      /* THE MAP'S RUNNING LINES. These write CSS variables on .hud__mapbox
         rather than a config object, because that is where the hatch lives —
         see css/hud.css.

         SPACING AND ANGLE ARE NOT PLAIN VARIABLE ROWS. The drift loops
         seamlessly only while the travel per cycle equals the stripe period
         measured along x, which is period / sin(angle). Let either of those two
         move without recomputing that and the lines jump once every cycle —
         a fault that looks like a dropped frame and is arithmetic. So both
         setters write the derived step as well. */
      ...(map ? [{ name: 'LINES · the map\u2019s running lines', open: true, rows: [
        { label:'lines.speed', min:0.05, max:6, step:0.05,
          get:()=>+(1 / Math.max(0.001, mapVar('--hatch-speed', 1.6))).toFixed(2),
          set:v=>{ map.style.setProperty('--hatch-speed',
                     (1 / Math.max(0.05, v)).toFixed(3) + 's'); },
          hint:'how fast they run, in lines per second \u00b7 higher is faster, and it is a speed rather than a duration so the slider goes the way you expect' },
        { label:'lines.thickness', min:0.5, max:6, step:0.25,
          get:()=>mapVar('--hatch-thick', 1),
          set:v=>{ map.style.setProperty('--hatch-thick', v + 'px'); },
          hint:'how heavy each line is, in px' },
        { label:'lines.spacing', min:3, max:40, step:0.5,
          get:()=>mapVar('--hatch-period', 7),
          set:v=>{ map.style.setProperty('--hatch-period', v + 'px'); step(); },
          hint:'gap from one line to the next \u00b7 the loop is re-solved with it, so the run stays seamless' },
        { label:'lines.angle', min:60, max:150, step:1,
          get:()=>mapVar('--hatch-angle', 105),
          set:v=>{ map.style.setProperty('--hatch-angle', v + 'deg'); step(); },
          hint:'which way they lean \u00b7 90 is upright, and the loop is re-solved with this too' },
        { label:'lines.opacity', min:0, max:1, step:0.01,
          get:()=>{ const m = /[\d.]+\s*\)$/.exec(
                      getComputedStyle(map).getPropertyValue('--hatch-ink').trim());
                    return m ? parseFloat(m[0]) : 0.1; },
          set:v=>{ map.style.setProperty('--hatch-ink',
                     'rgba(255,255,255,' + v + ')'); },
          hint:'how bright they are against the black' },
      ]}] : []),

      /* THE JOURNEY THROUGH BLOCK 01 — where the body starts, where it has
         turned to by the time the second block takes over, and when the copy is
         there at all. Every one of these is read off the SCROLL rather than off
         a clock, which is why they can be described as two ends of one move:
         the scroll is the only timeline this page has, and the tilt ramp, the
         figure's turn and the handover all already read from it.

         Kept deliberately short. The rest of block 01 is the About block and is
         not for re-tuning here. */
      { name: b1('landing, and when the text arrives'), open: true, rows: [
        { key:'startAngle', min:0, max:360, step:1,
          hint:'which way the body faces the moment the page opens · 0 is front-on, 180 is the back of it' },
        { label:'01.turnByEnd', min:-720, max:720, step:5,
          /* A VIEW ONTO scrollTurn, not a second number beside it. The figure
             turns by degrees-per-pixel-scrolled, which is the right thing for
             it to store and a hopeless thing to aim with: the question is "how
             far round is it by the time the second block takes over", and that
             is this times the length of the scroll. Stored as the total, so it
             survives a change to the copy's length as the INTENT rather than as
             an arithmetic leftover. */
          get: () => Math.round(F.config.scrollTurn * travelMax()),
          set: v => { F.config.scrollTurn = v / Math.max(1, travelMax()); },
          hint:'how far the body has turned by the time the second block takes over · this is the whole turn, not a speed' },
        ...(T ? [
        { label:'text.startOffset', min:0, max:2, step:0.02,
          get:()=>T.config.startOffset, set:v=>{ T.config.startOffset=v; T.apply(); },
          hint:'how far below the fold the copy starts, in screens · 1 means nothing is visible when you land and the text travels up into view as you scroll · 0 puts it on screen straight away' },
        { label:'text.endPad', min:0, max:1600, step:20,
          get:()=>T.config.endPad, set:v=>{ T.config.endPad=v; T.apply(); },
          hint:'how far the scroll keeps going once the last line has passed · the run-out before the second block takes over' },
        ] : []),
      ]},

      { name: b1('the red effect'), open: false, rows: [
        { label:'fx.colour', options:['#e8271c','#ff0000','#00ff88','#3a5bff','#ffffff','#ff00c8'],
          ...cssVar(fx, '--fx-color', '#e8271c'),
          hint:'the mask colour laid over the figure' },
        { label:'fx.blend', options:BLENDS, ...cssVar(fx, '--fx-blend', 'saturation'),
          hint:'saturation is the Figma setting · needs the shader grain below to have anything to work on' },
        { label:'fx.opacity', min:0, max:1, step:0.01, ...cssVar(fx, '--fx-opacity', 1),
          hint:'THE strength dial · the blend saturates fully at any grain, so this is what makes it pastel rather than confetti' },
        { key:'grain', min:0, max:0.3, step:0.005,
          hint:'density of the colour, not its strength · at 0 the saturation blend does nothing at all' },
      ]},

      { name: b1('the figure'), open: false, rows: [
        { key:'height', min:0.05, max:1.4, step:0.01,
          hint:'share of the viewport height · in contain mode it is the share of the FRAME, capped at 1, where 1 is edge to edge' },
        { key:'offsetX', min:-1, max:1, step:0.005,
          hint:'move it left or right, in viewport heights · on the mask page just drag it instead, this is the same number' },
        { key:'offsetY', min:-1, max:1, step:0.005, hint:'move it up or down' },
        { key:'fit', options:['height','contain'],
          hint:'height fills that share of the viewport HEIGHT and may overflow · contain fits the whole model inside the frame on both axes so it cannot be cut at any fov or tilt, and makes height mean the share of the FRAME filled' },
        { key:'fitPad', min:0, max:0.3, step:0.005,
          hint:'margin kept clear in contain mode · at 0 the silhouette antialiases onto the border' },
        { key:'fov', min:10, max:70, step:1, hint:'low is flattering, high is dramatic' },
        { key:'tiltStart', min:-60, max:60, step:0.5,
          hint:'camera elevation at the top of the story' },
        { key:'tiltEnd', min:-60, max:60, step:0.5,
          hint:'...and where it lands once the ramp below is complete' },
        { key:'tiltOverPx', min:200, max:6000, step:50,
          hint:'px of scroll the tilt takes to go from start to end' },
        { key:'tiltOffset', min:-89, max:89, step:0.5,
          hint:'added to whatever the ramp above produces · this is what a vertical drag writes, so the pointer and the ramp compose instead of fighting' },
        { label:'figure.width(px)', min:160, max:900, step:10,
          ...cssVar(root, '--fig-w', 420),
          set: v => root.style.setProperty('--fig-w', v + 'px'),
          hint:'also the width of the channel the text parts around' },
      ]},

      { name: b1('shading'), open: false, rows: [
        { key:'tint', options:['#FCFFF8','#ffffff','#FAFFF6','#F5FFEE','#FFF8F2','#F6FAFF'],
          hint:'hue only — normalised by its own mean, so it never changes brightness. Compounds with fx.opacity: the blend amplifies this hue too' },
        { key:'tone', min:0.2, max:1.4, step:0.01 },
        { key:'ambient', min:0, max:1, step:0.01, hint:'0 is a hard black shadow side' },
        { key:'diffuse', min:0, max:1.5, step:0.01 },
        { key:'rim', min:0, max:1.5, step:0.01, hint:'edge light — what stops it reading as a flat cutout' },
        { key:'lightX', min:-1, max:1, step:0.05 },
        { key:'lightY', min:-1, max:1, step:0.05 },
        { key:'lightZ', min:-1, max:1, step:0.05 },
      ]},

      { name: b1('rotation'), open: false, rows: [
        { key:'scrollTurn', min:0, max:1.2, step:0.01, hint:'degrees of spin per px scrolled' },
        { key:'idleSpin', min:0, max:8, step:0.01, hint:'deg/second when untouched · time-based, so it is the same on any refresh rate' },
        { key:'followEase', min:0.01, max:0.5, step:0.005 },
        { key:'startAngle', min:-180, max:180, step:1 },
        { key:'silMs', min:0, max:500, step:10,
          hint:'silhouette read-back floor · every read is a GPU stall; 0 turns the text shaping off' },
        { key:'silEps', min:0, max:10, step:0.1,
          hint:'...and only re-read once the figure has turned this many degrees' },
        { key:'silEase', min:0.01, max:0.4, step:0.005,
          hint:'how fast the outline follows a new read · this is what keeps sparse reads from looking stepped' },
      ]},

      /* Copy-dependent, so present only on the page that has copy. */
      ...(T ? [
      { name: b1('text'), open: false, rows: [
        { label:'text.size(px)', min:6, max:28, step:0.5,
          ...cssVar(root, '--text-size', 10),
          set:v=>{ root.style.setProperty('--text-size', v + 'px'); T.apply(); } },
        { label:'text.leading', min:0.3, max:2, step:0.05,
          ...cssVar(root, '--text-leading', .5),
          set:v=>{ root.style.setProperty('--text-leading', v); T.apply(); },
          hint:'.5 matches the rest of the site — the glyphs overflow the line box on purpose' },
        { label:'text.tracking(px)', min:-2, max:4, step:0.1,
          ...cssVar(root, '--text-track', -0.4),
          set:v=>root.style.setProperty('--text-track', v + 'px') },
        { label:'text.colour', options:['#ffffff','#C8C8C8','#8f8f8f','#e8271c','#000000'],
          ...cssVar(root, '--text-color', '#ffffff'),
          hint:'every line, including the ones that used to be dimmed' },
        { label:'text.opacity', min:0.05, max:1, step:0.01,
          ...cssVar(root, '--text-opacity', 1) },
      ]},

      { name: b1('copy'), open: false, rows: [
        { label:'text.copy', textarea: true, rows: 14,
          get: () => T.getText(), set: v => { T.setText(v); },
          hint:'one line per row · sides alternate automatically, so do not think about them. Watch "fills" in the readout below: under 1.00 screens the whole story is visible at once and scrolling only carries it away' },
      ]},

      { name: b1('text scroll'), open: false, rows: [
        { label:'text.wheelSpeed', min:0.2, max:3, step:0.05,
          get:()=>T.config.wheelSpeed, set:v=>{ T.config.wheelSpeed=v; } },
        { label:'text.dragSpeed', min:0.2, max:4, step:0.05,
          get:()=>T.config.dragSpeed, set:v=>{ T.config.dragSpeed=v; } },
        { label:'text.ease(s)', min:0.02, max:0.6, step:0.01,
          get:()=>T.config.ease, set:v=>{ T.config.ease=v; },
          hint:'seconds to close most of the gap · time-based, so it settles the same on 60Hz and 120Hz' },
        { label:'text.lineGap', min:2, max:60, step:1,
          get:()=>T.config.lineGap, set:v=>{ T.config.lineGap=v; T.apply(); },
          hint:'clear space between two lines ON THE SAME SIDE — what you can actually measure on screen. The CSS gap is about half it, because the copy alternates sides' },
        { label:'text.endPad', min:0, max:1600, step:20,
          get:()=>T.config.endPad, set:v=>{ T.config.endPad=v; T.apply(); },
          hint:'how far the scroll keeps going once the last line has passed · room for whatever closes the page' },
        { label:'text.startOffset', min:0, max:1, step:0.01,
          get:()=>T.config.startOffset, set:v=>{ T.config.startOffset=v; T.apply(); },
          hint:'where the text begins, in viewport heights' },
        { label:'text.shapeGap', min:0, max:120, step:2,
          get:()=>T.config.shapeGap, set:v=>{ T.config.shapeGap=v; },
          hint:'clearance between the copy and the figure\'s silhouette' },
        { label:'text.shapeMin', min:40, max:400, step:10,
          get:()=>T.config.shapeMin, set:v=>{ T.config.shapeMin=v; },
          hint:'a line is never squeezed narrower than this' },
      ]},
      ] : []),

      /* The x-ray belongs to block 01's figure — it is the same renderer About
         uses, on the same canvas — so it is stamped with block 01 rather than
         floating loose between the two sets. */
      ...(window.XRAY ? window.XRAY.groups().map(
            g => ({ ...g, name: b1(('x-ray · ' +
              String(g.name).replace(/^X-ray\s*·?\s*/i, '')).replace(/\s*·\s*$/, '')) })) : []),

      /* ---- BLOCK 02 -------------------------------------------------------
         Every row below writes to window.FIGURE_B — a second instance of
         js/about-figure.js with its own config object — or to js/mask.js's
         pointer settings. None of it can reach block 01.

         The hints are written for someone who has never seen the dial before:
         what it does, in one line, in the words you would use out loud. The
         number it feeds is in the code; a panel is not the place for it. */
      ...(window.FIGURE_B ? (function(){
        const B = window.FIGURE_B;
        const num = (key, min, max, step, hint) => ({
          label: '02.' + key, min, max, step, hint,
          get: () => B.config[key], set: v => { B.config[key] = v; },
        });
        const pick = (key, options, hint) => ({
          label: '02.' + key, options, hint,
          get: () => B.config[key], set: v => { B.config[key] = v; },
        });
        const flag = (key, hint) => ({
          label: '02.' + key, options: ['on','off'], hint,
          get: () => B.config[key] ? 'on' : 'off',
          set: v => { B.config[key] = (v === 'on'); },
        });
        return [
          { name: b2('size and framing'), open: true, rows: [
            num('height', 0.02, 20, 0.01,
              'how big the head is · 1 fills the screen and nothing stops you going past it · the shift+wheel has no ceiling at all, this slider just has to end somewhere'),
            num('offsetX', -1, 1, 0.005, 'move it left or right'),
            num('offsetY', -1, 1, 0.005, 'move it up or down'),
            num('fov', 8, 140, 1, 'the lens · low is flat and calm, high is close and dramatic'),
            pick('fit', ['contain','height'],
              'contain never lets the head touch the edges · height lets it grow past them'),
            num('tiltOffset', -89, 89, 0.5, 'look at it from higher or lower'),
            num('startAngle', -180, 180, 1, 'which way it faces before you touch it'),
          ]},

          { name: b2('the reveal'), open: true, rows: [
            flag('reveal', 'move the mouse over the head and it opens, showing the mask underneath'),
            num('revealRadius', 0.01, 0.4, 0.005, 'how big the opening is'),
            num('revealFade', 0.1, 6, 0.1, 'seconds before it closes again'),
            num('revealMax', 0, 1, 0.01, 'how far it opens · under 1 the face never quite disappears'),
            num('revealSoft', 0, 1, 0.01, 'the edge of the opening · 0 is a cut, 1 is a wide fade'),
            num('revealWarp', 0, 2, 0.01, 'how much the opening wobbles instead of being a circle'),
            num('revealWarpScale', 1, 40, 0.5, 'how fine that wobble is'),
            num('revealWarpSpeed', 0, 3, 0.05, 'how fast it churns · 0 holds it still'),
            num('revealStep', 0.05, 2, 0.05, 'how far the mouse must move before it leaves another mark · low is a smooth smear, high is beads'),
            num('revealEvery', 4, 120, 2, 'the shortest time between marks · stops one fast flick from spending the whole trail at once'),
          ]},

          /* The x-ray's qualities, not its numbers. That effect is a fluid
             simulation in three.js on block 01's figure; these produce what it
             produces on a renderer that works another way entirely. */
          { name: b2('the reveal — colour and glass'), open: true, rows: [
            num('headOpacity', 0, 1, 0.01,
              'how see-through the head is even where you have NOT touched it · 1 is solid until the cursor opens it, lower and the skull is always faintly there · this is the one that makes it read as x-ray rather than as a hole'),
            num('fresnel', 0, 3, 0.05,
              'the head\'s rim lights up where it turns away from you · glass does this and a solid does not'),
            num('fresnelPower', 0.5, 8, 0.1,
              'how thin that rim is · higher is a finer line right at the edge'),
            num('revealGlow', 0, 3, 0.05,
              'a bright fringe burning at the edge of the opening, where it is passing through'),
            num('revealEdge', 0, 1, 0.01,
              'how wide that fringe is · 0 is a thin line at the boundary, 1 fills the whole opening'),
            pick('revealTint', ['#DFF3FF','#ffffff','#8FE9FF','#FFE9D6','#e8271c'],
              'the colour of that light'),
            num('skullGlow', 0, 3, 0.05,
              'the skull lit from within rather than by the scene · what makes bone look like it is shining through'),
                      num('flatten', 0, 1, 0.01,
              'pushes the surface to flat white, ignoring its own shading · 0 is the lit model, 1 is a clean silhouette with none of the scan\'s scratches on it'),
]},

          { name: b2('the skull underneath'), open: true, rows: [
            flag('innerOn', 'turn the skull off to see the head on its own'),
            flag('innerFit',
              'work out the size and position that puts the skull INSIDE the head, instead of you finding them · leave this on and use the four below as nudges'),
            num('innerFitPad', 0, 0.5, 0.01,
              'how much clearance the fit leaves · 0 makes the skull touch the inside of the head, higher pulls it further in'),
            num('innerScale', 0.4, 2.0, 0.005,
              'the skull\'s size · with the fit on this MULTIPLIES it, so 1 is exactly as it was fitted and anything else is a deliberate departure'),
            num('innerX', -0.4, 0.4, 0.002, 'slide the skull left or right'),
            num('innerY', -0.4, 0.4, 0.002, 'slide it up or down'),
            num('innerZ', -0.4, 0.4, 0.002, 'push it deeper in or pull it forward'),
            pick('innerTint', ['#DFF3FF','#FCFFF8','#ffffff','#FFE9D6','#E7FFE2','#1A1A1A','#e8271c'],
              'the SKULL\'s colour · hue only, it will not get brighter or darker'),
            num('innerTone', 0.05, 1.8, 0.01,
              'how light the skull is · above the head\'s own tone it reads as lit from inside, below it as a shadow'),
          ]},

          { name: b2('follows the cursor'), open: true, rows: [
            flag('follow', 'the head turns to look at your mouse'),
            num('followRangeX', -60, 60, 1,
              'how far it turns when the mouse is at the edge · a minus makes it look away'),
            num('followRangeY', -40, 40, 1, 'the same, up and down'),
            num('followSpeed', 0.01, 1, 0.01, 'how quickly it gets there · 1 snaps, low is slow and heavy'),
            flag('followCentre', 'go back to facing forward when the mouse leaves the window'),
            num('idleSpin', 0, 12, 0.01,
              'turns on its own, degrees a second · 0 while it is following you, or it never settles'),
            num('followEase', 0.01, 0.5, 0.005, 'how smoothly that drift catches up'),
          ]},

          
          { name: b2('the head — grey shading'), open: false, rows: [
            pick('tint', ['#FCFFF8','#ffffff','#FAFFF6','#FFF8F2','#F6FAFF','#1A1A1A','#e8271c'],
              'the HEAD\'s colour · hue only, it will not get brighter or darker'),
            num('tone', 0.05, 1.6, 0.01,
              'how light the head is · it sits on white, so low reads as a silhouette and high washes it out'),
            num('ambient', 0, 1, 0.01, 'light in the shadows · 0 makes the dark side pure black'),
            num('diffuse', 0, 1.5, 0.01, 'the main light'),
            num('rim', 0, 1.5, 0.01, 'a bright edge · what stops it looking like a flat cutout'),
            num('lightX', -1, 1, 0.05, 'where the light comes from, left to right'),
            num('lightY', -1, 1, 0.05, 'above or below'),
            num('lightZ', -1, 1, 0.05, 'in front or behind'),
            num('grain', 0, 0.3, 0.005, 'speckle · it is what lets the red effect find colour to work with'),
            num('silMs', 0, 500, 10,
              'nothing reads this head\'s outline, so 0 is free speed · every read makes the page wait for the graphics card'),
          ]},

          ...(window.MASKPAGE ? [{ name: b2('moving it by hand'), open: false, rows: (function(){
            const M = window.MASKPAGE;
            const mnum = (key, min, max, step, hint) => ({
              label: '02.' + key, min, max, step, hint,
              get: () => M.config[key], set: v => { M.config[key] = v; },
            });
            return [
              { label:'02.drag', options:['on','off'],
                get: () => M.config.drag ? 'on' : 'off',
                set: v => { M.config.drag = (v === 'on'); },
                hint:'drag the head where you want it and leave it there · shift+drag turns it instead, shift+wheel resizes, Home resets. It writes the same numbers as the sliders above, so where you drop it is saved' },
              { label:'02.dragMode', options:['move','turn'],
                get: () => M.config.dragMode,
                set: v => { M.config.dragMode = v; },
                hint:'what a plain drag does · the RIGHT button and shift both do the other one, so you can turn the head without letting go of anything' },
              mnum('orbitSpeed', 0.05, 2, 0.01, 'how far it turns per pixel you drag'),
              mnum('panSpeed', 0.1, 3, 0.05, 'how far it slides · 1 keeps up with the mouse exactly'),
              /* RENAMED, AND THAT IS THE POINT. js/tuner.js persists a row by
                 its LABEL and restores it OVER the code on load, so leaving
                 this called 02.wheel would have brought a saved "on" straight
                 back and shift+wheel would still resize the head on any machine
                 that had ever touched the dial — with the file plainly saying
                 false. A new name orphans the old save. */
              { label:'02.wheelResize', options:['on','off'],
                get: () => M.config.wheel ? 'on' : 'off',
                set: v => { M.config.wheel = (v === 'on'); },
                hint:'shift+wheel resizes the head · OFF by default now: it is a tuning gesture, and one shift held a beat too long while reading left the block a different size for the rest of the visit with nothing on screen to undo it · Home resets the view either way' },
              mnum('wheelSpeed', 0.0002, 0.01, 0.0002, 'how fast that resize goes'),
              { label:'02.invertY', options:['off','on'],
                get: () => M.config.invertY ? 'on' : 'off',
                set: v => { M.config.invertY = (v === 'on'); },
                hint:'flip the up/down direction of the drag' },
              { label:'02.fxOver', options:['off','on'],
                get: () => M.config.fxOver ? 'on' : 'off',
                set: v => { M.config.fxOver = (v === 'on'); },
                hint:'let the page\'s red saturation effect reach this block · it is built for a grey model, so over the head\'s own photograph it drives every pixel to full colour rather than tinting it · turn it on when the map is off' },
              mnum('takeOver', 0, 1, 0.05,
                'how far into the scroll the mouse stops belonging to the copy and starts belonging to this head'),
            ];
          })() }] : []),
        ];
      })() : []),

      ...(window.MASKSCROLL ? (function(){
        const S = window.MASKSCROLL;
        const num = (key, min, max, step, hint) => ({
          label: 'dis.' + key, min, max, step, hint,
          get: () => S.config[key], set: v => { S.config[key] = v; },
        });
        const pick = (key, options, hint) => ({
          label: 'dis.' + key, options, hint,
          get: () => S.config[key], set: v => { S.config[key] = v; },
        });
        const flag = (key, hint) => ({
          label: 'dis.' + key, options: ['on','off'], hint,
          get: () => S.config[key] ? 'on' : 'off',
          set: v => { S.config[key] = (v === 'on'); },
        });
        return [
          /* Split into four groups by what a dial DOES rather than by which
             uniform it happens to feed. Twenty-odd controls in one list is a
             list; grouped by sweep, glyph, light and glass it is a panel. */
          { name: mid('the sweep'), open: true, rows: [
            flag('enabled'),
            pick('style', ['sparkle','sheet'],
              'sparkle is the dot dissolve · sheet is the earlier displaced white block'),
            { label:'dis.scrub', min:0, max:1, step:0.01, transient: true,
              get: () => 0, set: v => S.seek(v),
              hint:'hold it at a progress instead of scrolling to it' },
            num('overPx', 300, 5000, 50, 'px of scroll from first block to second'),
            num('ease', 0.01, 0.5, 0.01, 'seconds to close most of the gap'),
            num('originX', 0, 1, 0.01, 'where the dissolve starts across the stage'),
            num('originY', 0, 1, 0.01, '...and down it'),
            num('frontWidth', 0.05, 1, 0.01,
              'how deep the band is · thin is a crisp ring, wide is a cloud'),
            num('trail', 0.1, 2, 0.02,
              'how far behind the front a dot survives · long leaves a wake'),
            num('rings', 0, 12, 1,
              '0 sweeps smoothly · above that the front is quantised into that many waves, so whole rings arrive together'),
          ]},

          { name: mid('the dots'), open: false, rows: [
            num('pitch', 3, 40, 0.5, 'dot spacing in CSS px · the reference measures about 9'),
            num('dot', 0.1, 1.2, 0.02, 'dot diameter as a share of the cell'),
            num('square', 0, 1, 0.01,
              '0 circle, 1 square · one superellipse exponent, so it runs between them rather than switching'),
            num('ringWidth', 0, 1, 0.01,
              'hollows the dot · the field reads as outlines instead of blobs'),
            num('jitter', 0, 1, 0.02, 'moves each dot off the centre of its own cell'),
            num('stagger', 0, 2, 0.02, 'per-cell arrival jitter · at 0 the dots come in ranks'),
            num('cellRotate', -1.6, 1.6, 0.01, 'static rotation of the grid'),
            num('swirl', -6, 6, 0.05, 'radians of spiral across the screen'),
          ]},

          { name: mid('the pulse'), open: false, rows: [
            num('pulseRate', 0, 30, 0.1, 'radians per second'),
            num('pulseDepth', 0, 1, 0.01,
              'how far the swing goes · measured, the frame-to-frame change runs 0.99 at 0, 10.9 at 0.35 and 20.9 at 0.8, against a rasteriser noise floor of about 1'),
            num('pulsePhase', 0, 1, 0.01,
              '0 the whole field beats as one, 1 every cell on its own clock · two genuinely different effects, not two settings'),
            pick('pulseMode', ['both','radius','brightness'],
              'radius makes them breathe, brightness makes them blink'),
          ]},

          { name: mid('the light'), open: false, rows: [
            num('glowSpread', 0.5, 6, 0.05,
              'halo radius in dot radii · this and flare ARE the bloom, drawn per dot rather than blurred'),
            num('glowGain', 0, 2, 0.02, null),
            num('flare', 0, 2, 0.02, 'the four-point cross on the brightest dots'),
            num('flareLen', 0.5, 10, 0.1, null),
            num('sparkGain', 0.5, 6, 0.05, 'the reference runs its sparkles about 3x its field'),
            pick('sparkColour', ['#FFFFFF','#EAF2F7','#FFF3D6','#DFF3FF'], null),
            num('grain', 0, 0.4, 0.005,
              'per-pixel colour dither · not decoration, the saturation layer takes the SOURCE\'s saturation and neutral grey has none'),
            num('aberration', 0, 0.06, 0.001,
              'channel separation · the FRONT is evaluated at three radii rather than the dot field three times, so the fringe is nearly free'),
            num('dispAmp', 0, 0.35, 0.005, 'noise added BEFORE the threshold, so the front tears'),
            num('dispScale', 0.5, 20, 0.1, 'size of the tears'),
            num('dispDetail', 1, 5, 1, 'octaves · 1 is a wave, 5 is shrapnel'),
            num('dispDrift', 0, 1, 0.01, 'how fast the tear pattern crawls'),
            num('renderScale', 0.25, 1, 0.05, 'backing-store scale · the one performance dial'),
          ]},

          { name: mid('extra effects'), open: false, rows: [
            num('lensBarrel', -0.4, 0.4, 0.005,
              'barrel distortion, separate from the CRT tube · negative pincushions'),
            num('lensChroma', 0, 0.15, 0.002,
              'per-channel DIFFERENCE in that distortion · real glass refracts the three wavelengths by different amounts, so the chroma has to come from sampling at three distortions rather than offsetting the result'),
            num('blurSteps', 1, 6, 1,
              'motion blur taps · 1 is off. The expensive dial on this panel by a wide margin, and it is steps rather than an amount so the cost is exactly what it says'),
            num('blurAmt', 0, 0.3, 0.005, 'how far the blur reaches, along the direction of travel'),
            num('rayGain', 0, 1.5, 0.01,
              'volumetric shafts from the origin · banded by angle so they read as rays rather than glow'),
            num('rayCount', 2, 80, 1, 'how many shafts'),
            num('raySpeed', 0, 2, 0.02, null),
            num('rayFall', 0.2, 10, 0.1, 'how fast they fade outward'),
            pick('rayCol', ['#FFF3D6','#FFFFFF','#8FE9FF','#e8271c'], null),
            num('holoGain', 0, 1, 0.01, 'travelling bands, a tint and a flicker'),
            num('holoBands', 5, 300, 1, null),
            num('holoSpeed', 0, 4, 0.05, null),
            num('holoFlicker', 0, 1, 0.01,
              'held for a few frames at a time · a per-frame flicker at 60Hz reads as noise, not as an unstable projection'),
            pick('holoTint', ['#8FE9FF','#DFF3FF','#9CFFB8','#FFF3D6'], null),
            num('dissolve', 0, 1, 0.01,
              'per-pixel threshold erosion · weighted toward the edge, because eroding the solid interior as hard just punches holes in a finished block'),
            num('dissolveScale', 1, 24, 1, 'block size of the erosion'),
          ]},

          { name: mid('the CRT glass'), open: false, rows: [
            flag('crt', 'the same stack the figure wears'),
            num('crtScanCount', 60, 1200, 10,
              'past about half the canvas height in DEVICE px the sine crosses Nyquist and the lines alias into moire · 550 is right at 2x and wrong at 1x'),
            num('crtScanDepth', 0, 1, 0.01,
              'scales alpha as well as colour, so the bands cut in rather than washing over'),
            num('crtCurvature', 0, 0.4, 0.005,
              'applied to the coordinate BEFORE the dissolve reads it, so the dots curve with the tube'),
            num('crtVignette', 0, 1, 0.01,
              '0.35 here against the figure\'s 1.0 · that is a gentle falloff on a 420px box and eats the corners across a viewport'),
            num('crtContrast', 0.5, 2, 0.01, null),
            num('crtSaturation', 0, 2, 0.01, null),
            num('crtHold', 0, 1, 0.01,
              'how much glass the LANDED block keeps · everything this canvas draws is the second block, so at 1 the grade, the vignette and the tube were all landing on the arriving white and nothing else'),
            num('crtFade', 0, 1, 0.01,
              'where along the scroll the glass starts to clear'),
          ]},

          { name: mid('block 02\'s ground'), open: false, rows: [
            pick('white', ['#FFFFFF','#F7F7F7','#EFEFEF'],
              'top of the ramp · the light pages start at #FFFFFF'),
            pick('whiteFoot', ['#CECECE','#AFAFAF','#DDDDDD','#FFFFFF'],
              'foot of the ramp · #CECECE is where PHOTOGRAPHY\'s gradient lands after one viewport, so the block is the same room rather than a white rectangle'),
          ]},

          { name: mid('sheet style only'), open: false, rows: [
            pick('from', ['bottom','top'], 'which edge the white block arrives from'),
            num('soft', 0.001, 0.08, 0.001, 'half-width of the threshold'),
            num('frostWidth', 0, 0.3, 0.005, 'how far the crust reaches either side'),
            num('frostGain', 0, 2, 0.05, null),
            num('frostScale', 4, 80, 1, 'grain of the crust'),
            pick('frostColour', ['#EAF2F7','#ffffff','#DFF3FF','#F2EFEC'], null),
          ]},
        ];
      })() : []),

      { name: pg('film grain'), open: false, rows: [
        { label:'grain.opacity', min:0, max:1, step:0.01,
          get:()=>parseFloat(getComputedStyle(document.querySelector('.grain')).opacity),
          set:v=>document.querySelector('.grain')?.style.setProperty('--grain-opacity', v) },
        { label:'grain.blend', options:['screen','normal','overlay','soft-light','lighten'],
          get:()=>getComputedStyle(document.querySelector('.grain')).mixBlendMode,
          set:v=>document.querySelector('.grain')?.style.setProperty('--grain-blend', v),
          hint:'screen on a black page · overlay barely touches the dark end' },
        { label:'grain.size(em)', min:1, max:30, step:0.25,
          get:()=>parseFloat(getComputedStyle(document.querySelector('.grain'))
                  .getPropertyValue('--grain-size')) || 16,
          set:v=>document.querySelector('.grain')?.style.setProperty('--grain-size', v+'em'),
          hint:'16em paints the tile 1:1 — smaller resamples it and the repeat shows' },
        { label:'grain.contrast', min:50, max:400, step:5,
          get:()=>parseFloat(getComputedStyle(document.querySelector('.grain'))
                  .getPropertyValue('--grain-contrast')) || 220,
          set:v=>document.querySelector('.grain')?.style.setProperty('--grain-contrast', v+'%') },
      ]},

      /* THE HUD'S FIGURE, from js/figure-host.js — the same module the work
         page's uses, so there is one set of these dials and not two. Its
         PLACEMENT rows are absent by design: in the map box css/hud.css pins
         it, and a dial writing a number nothing reads reads as broken rather
         than as absent. */
      ...(window.HUDFIGURE ? [{ name: 'HUD · the figure', open: false,
                                rows: window.HUDFIGURE.rows() }] : []),

      /* ONE ROW OFF THAT GROUP, on the index panel. How fast the map's contact
         turns is the only thing anyone asks for here, and the group above is
         filtered off this panel by SHOW_ONLY — so it was a code edit away.

         TAKEN FROM rows() BY ITS LABEL rather than written again: same object,
         same getter, same key in what the tuner stores, so this and the full
         group can never end up holding two different numbers. */
      ...(function (){
        const H = window.HUDFIGURE;
        if (!H || typeof H.rows !== 'function') return [];
        const row = H.rows().filter(r => r && r.label === 'fig.spin');
        return row.length ? [{ name: 'HUD · the figure turning', open: true,
                               rows: row }] : [];
      })(),

      /* THE LOGO between block 02's columns — the same module as the HUD's
         figure and the work page's, a third stage in its HOSTS list. Its
         rotation is the one thing here that is not on a clock: fig.turns is
         full revolutions across the block, read off the scroll. */
      /* THE HEAD'S SIZE, on its own and on this panel. It lives in FIGURE_B's
         config alongside forty other rows in the nine head groups below, all
         of which are filtered off the index panel by SHOW_ONLY — so the one
         number anyone actually asks for was unreachable without a code edit.
         One row, named so the whitelist can reach it. */
      ...(window.FIGURE_B ? [{ name: 'BLOCK 02 · the head size', open: false, rows: [
        { label: 'head.size', min: 0.1, max: 1.2, step: 0.002,
          get: () => window.FIGURE_B.config.height,
          set: v => { window.FIGURE_B.config.height = v; },
          hint: 'the head\u2019s height as a share of the viewport \u00b7 0.368 is the shipped size' },
      ] }] : []),

      ...(window.AWARDS ? window.AWARDS.groups() : []),
      ...(window.TOUCHSCROLL ? window.TOUCHSCROLL.groups() : []),
      ...(window.HEADSPIN ? window.HEADSPIN.groups() : []),
      ...(window.LOGO ? [{ name: 'BLOCK 02 · the logo', open: false,
                           rows: window.LOGO.rows() }] : []),

      { name: pg('leaving this page · the tear'), open: true,
        rows: window.SHEETFX ? window.SHEETFX.rows() : [] },

      { name: pg('leaving this page · iris'), open: false,
        rows: window.IRIS ? window.IRIS.rows() : [] },

      { name: pg('leaving this page · liquid'), open: false,
        rows: window.LIQUID ? window.LIQUID.rows() : [] },
    ]),
  });

  return function destroy(){ panel?.destroy?.(); };
});
