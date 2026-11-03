/* ==========================================================================
   wheel-console.js — schema for the wheel page's tuning panel.
   The panel itself lives in js/tuner.js and is shared with the sphere page.

   Registered with the page lifecycle so the panel is rebuilt for whichever
   page is mounting and torn down with it.

   The `scope` test is not redundant with the window.WHEEL test, and dropping
   it costs a leaked panel. During a transition the outgoing page is still
   mounted, so window.WHEEL is still set while the INCOMING page mounts — the
   gallery page would build a wheel tuner against the dying page, get its
   markup stripped a moment later by the sphere tuner, and leave an orphan
   holding a keydown listener and a rAF loop for the rest of the session.
   Asking the container whether it actually has a wheel is the same question
   js/wheel.js asks, and it can only be answered by the page being mounted.
   ========================================================================== */
window.PAGE.register('wheel-console', function (scope) {
  'use strict';
  if (!window.Tuner?.enabled) return;
  if (!scope.querySelector('#wheelViewport') || !window.WHEEL) return;
  const W = window.WHEEL;

  /* ---- ONE SET OF DIALS AT A TIME -----------------------------------------
     The wheel is settled and the cursor effect is the thing being worked on,
     so the panel shows the cursor's groups and nothing else. A dial you cannot
     see is a dial you cannot brush past on the way to another one.

     This hides rows; it disables nothing. Every module still runs on the
     values baked into its own file and Copy settings still writes all of them.

     TO BRING THE WHOLE PANEL BACK: set SHOW_ONLY to null. To show a different
     set, name the start of its group — the wheel's groups have no stamp, so
     there is nothing to name there yet; that is what the null is for. */
  const SHOW_ONLY = ['CARDS', 'CURSOR'];   // null brings every wheel dial back
  const visible = list => {
    const want = SHOW_ONLY == null ? null : [].concat(SHOW_ONLY);
    const keep = want
      ? list.filter(g => g && want.some(w => String(g.name).startsWith(w)))
      : list.filter(Boolean);
    /* A stamp that stops matching — a group renamed, a module absent — must
       not hand back an empty panel; that reads as a broken page rather than a
       hidden one. */
    if (want && !keep.length){
      console.warn('[wheel-console] SHOW_ONLY matched nothing:', SHOW_ONLY);
      return list.filter(Boolean);
    }
    return keep;
  };

  const panel = window.Tuner.create({
    title: SHOW_ONLY ? 'WORK · ' + [].concat(SHOW_ONLY).join(' + ') : 'WHEEL TUNER',
    storeKey: 'shots2026.wheel',
    config: W.config,
    extraButton: 'Re-centre',
    onExtra: say => { W.resetView(); say('View reset'); },

    /* Grain rows carry their own get/set (they write CSS variables), so
       only real wheel rows need the geometry pass. */
    apply: (row) => { if (!row.set) W.apply(!!row.rebuild); },
    restored: () => W.apply(true),
    reset: () => { W.apply(true); W.resetView(); },
    readout: () => ({ ...W.readout(), ...(window.WORKFX ? window.WORKFX.readout() : {}) }),

    groups: visible([
      { name: 'Ring', open: true, rows: [
        { key:'size', min:0.4, max:2.5, step:0.01,
          hint:'overall wheel size — scales radius and cards together' },
        { key:'itemCount', min:6, max:120, step:1, rebuild:true },
        { key:'offsetY', min:-400, max:400, step:1,
          hint:'move the whole ring up or down, px · positive = down' },
        { key:'tilt', min:-90, max:90, step:0.5,
          hint:'camera elevation · NEGATIVE looks down from above, positive looks up from below · 0 = edge-on' },
        { key:'cardYaw', min:-180, max:180, step:0.5,
          hint:'how each card turns on its own axis · +/-90 = tangential, 0 = radial rosette' },
        { key:'cardLean', min:-60, max:60, step:0.5, hint:'extra tilt per card' },
        { key:'fitRadius', bool:true, hint:'scale the ring with the viewport' },
        { key:'radiusOfViewport', min:0.10, max:0.60, step:0.005, hint:'used when fitRadius is on' },
        { key:'radius', min:120, max:900, step:5, hint:'used when fitRadius is off' },
        { key:'perspective', min:600, max:4000, step:25 },
      ]},

      { name: 'Cards', open: true, rows: [
        { key:'cardWidth', min:60, max:420, step:2 },
        { key:'cardAspect', min:0.35, max:1.60, step:0.005, hint:'height / width · 0.667 = 3:2 landscape' },
        { key:'cardRadius', min:0, max:30, step:0.5, hint:'corner rounding' },
        { key:'rasterTargetPx', min:100, max:900, step:20, hint:'sharpness when a card is near' },
      ]},

      { name: 'CARDS · shape', open: true, rows: [
        { key:'cardShape',
          options:['rectangle','ellipse','polygon','star','arch','chevron','cross','custom'],
          hint:'rectangle costs nothing and cardRadius still rounds it · everything else is a clip path per card' },
        { key:'cardSides', min:3, max:12, step:1,
          hint:'for polygon and star · 3 is a triangle, 6 a hexagon' },
        { key:'cardShapeRotate', min:-180, max:180, step:1,
          hint:'turn the shape inside the card' },
        { key:'cardStar', min:0.05, max:0.95, step:0.01,
          hint:'a star\'s inner radius · low is spiky, near 1 is almost the polygon' },
        { key:'cardInset', min:0, max:45, step:1,
          hint:'shrink the shape inside the card, so it does not touch the edges' },
        { key:'cardShapeFit', options:['stretch','keep'],
          hint:'stretch fills the card, so a triangle comes out wide · keep holds the shape\'s own proportions and leaves the spare width empty' },
        { key:'cardShapeVary', options:['off','rotation','sides','shape'],
          hint:'give each card its own · keyed off the card\'s position, so nothing reshuffles when the ring rebuilds' },
        { key:'cardShapeVaryAmt', min:0, max:1, step:0.05,
          hint:'how far that variation goes' },
        /* textarea, not a slider. A row with no min/max falls through to the
           range branch and renders an input with min="undefined", which looks
           like a broken control rather than a text field. Two rows is enough
           for a clip-path and keeps the debounce the textarea already has. */
        { key:'cardClip', textarea:true, rows:2,
          hint:'used when shape is custom · any CSS clip-path value, verbatim: circle(40%), path("..."), or a polygon of your own' },
      ]},

      { name: 'Motion', open: true, rows: [
        { key:'scrollSensitivity', min:0.02, max:1.20, step:0.01, hint:'deg of spin per wheel unit' },
        { key:'dragSensitivity', min:0.02, max:1.50, step:0.01, hint:'deg of spin per px dragged' },
        { key:'followEase', min:0.02, max:0.60, step:0.01, hint:'lower = smoother / laggier' },
        { key:'inertiaGain', min:0, max:40, step:0.5, hint:'throw on release' },
        { key:'idleSpin', min:0, max:0.60, step:0.005, hint:'0 = holds still' },
      ]},

      { name: 'Pointer', open: true, rows: [
        { key:'mouseMode', options:['position','drive','off'],
          hint:'position = leans toward the cursor and returns · drive = keeps turning as you move' },
        { key:'mouseRange', min:0, max:360, step:5, hint:'X · deg of SPIN from centre to edge (position)' },
        { key:'mouseRangeY', min:0, max:90, step:0.5, hint:'Y · deg of TILT from centre to edge (position)' },
        { key:'mouseDrive', min:0, max:1.5, step:0.01, hint:'X · deg of spin per px moved (drive)' },
        { key:'mouseDriveY', min:0, max:1.0, step:0.01, hint:'Y · deg of tilt per px moved (drive)' },
        { key:'mouseEase', min:0.01, max:0.40, step:0.005, hint:'how fast the offset follows' },
        { key:'mouseReturn', bool:true, hint:'recentre when the pointer leaves' },
        { key:'tiltClamp', min:10, max:89, step:1, hint:'total tilt is held inside +/- this' },
      ]},

      { name: 'Film grain', open: false, rows: [
        { label:'grain.animate', bool:true,
          get:()=>document.querySelector('.grain')?.dataset.grainAnimate === 'true',
          set:v=>{ const g=document.querySelector('.grain');
                   if(g) g.dataset.grainAnimate = v ? 'true' : 'false'; },
          hint:'stepped position loop — off leaves the texture static' },
        { label:'grain.opacity', min:0, max:1, step:0.01,
          get:()=>parseFloat(getComputedStyle(document.querySelector('.grain')).opacity),
          set:v=>document.querySelector('.grain')?.style.setProperty('--grain-opacity', v) },
        { label:'grain.blend', options:['multiply','normal','overlay','soft-light','darken','screen'],
          get:()=>getComputedStyle(document.querySelector('.grain')).mixBlendMode,
          set:v=>document.querySelector('.grain')?.style.setProperty('--grain-blend', v),
          hint:'multiply for a light page; the original snippet used normal on a dark one' },
        { label:'grain.size(em)', min:1, max:30, step:0.25,
          get:()=>parseFloat(getComputedStyle(document.querySelector('.grain'))
                  .getPropertyValue('--grain-size')) || 5,
          set:v=>document.querySelector('.grain')?.style.setProperty('--grain-size', v+'em'),
          hint:'tile size — SMALLER is finer grain, larger is chunkier' },
        { label:'grain.contrast', min:50, max:300, step:5,
          get:()=>parseFloat(getComputedStyle(document.querySelector('.grain'))
                  .getPropertyValue('--grain-contrast')) || 300,
          set:v=>document.querySelector('.grain')?.style.setProperty('--grain-contrast', v+'%') },
        { label:'grain.brightness', min:10, max:200, step:5,
          get:()=>parseFloat(getComputedStyle(document.querySelector('.grain'))
                  .getPropertyValue('--grain-brightness')) || 80,
          set:v=>document.querySelector('.grain')?.style.setProperty('--grain-brightness', v+'%'),
          hint:'lower = darker grain' },
        { label:'grain.speed(s)', min:0.05, max:3, step:0.05,
          get:()=>parseFloat(getComputedStyle(document.querySelector('.grain'))
                  .getPropertyValue('--grain-speed')) || 0.85,
          set:v=>document.querySelector('.grain')?.style.setProperty('--grain-speed', v+'s') },
      ]},

      { name: 'Dolly', open: false, rows: [
        { key:'zoomMin', min:-1200, max:0, step:10 },
        { key:'zoomMax', min:0, max:1200, step:10 },
        { key:'zoomStep', min:0.1, max:3, step:0.05 },
        { key:'zoomEase', min:0.02, max:0.40, step:0.005 },
      ]},

      /* The cursor effect brings its own two groups, the way IRIS and LIQUID
         bring their rows — the schema for a thing belongs next to the thing,
         or it drifts from it. They are spread in as whole GROUPS rather than
         rows because the effect has two distinct halves: the shapes, and what
         happens to the page under them. */
      ...(window.WORKFX ? window.WORKFX.rows() : []),

      { name: 'Page transition · the tear', open: true,
        rows: window.SHEETFX ? window.SHEETFX.rows() : [] },

      { name: 'Page transition · iris', open: false,
        rows: window.IRIS ? window.IRIS.rows() : [] },

      { name: 'Page transition · liquid', open: false,
        rows: window.LIQUID ? window.LIQUID.rows() : [] },
    ]),
  });

  return function destroy(){ panel?.destroy?.(); };
});
