/* ==========================================================================
   tune-console.js — schema for the sphere page's tuning panel.
   The panel itself lives in js/tuner.js and is shared with the wheel page.

   Registered with the page lifecycle so the panel is rebuilt for whichever
   page is mounting and torn down with it. The `scope` test guards against
   latching onto the OUTGOING page's globals mid-transition — see the longer
   note in js/wheel-console.js.
   ========================================================================== */
window.PAGE.register('sphere-console', function (scope) {
  'use strict';
  if (!window.Tuner?.enabled) return;
  if (!scope.querySelector('#sphereViewport') || !window.SPHERE) return;
  const S = window.SPHERE;
  const C = S.config;

  const sphereVp   = scope.querySelector('.sphere-viewport:not(.sphere-viewport--ghost)');
  const title      = scope.querySelector('.hero__title');
  const sGet = (el, p, f) => el ? getComputedStyle(el)[p] : f;
  const sSet = (el, p, v) => { if (el) el.style[p] = v; };

  const BLENDS = ['normal','multiply','screen','overlay','soft-light','hard-light',
                  'darken','lighten','difference','exclusion','color-dodge','luminosity'];

  const panel = window.Tuner.create({
    title: 'SPHERE TUNER',
    storeKey: 'shots2026.tune',
    config: C,
    extraButton: 'Re-frame',
    onExtra: say => { S.resetZoom(); say('Re-framed'); },

    /* `ht` rows only need the echo restyled — much cheaper than the full
       geometry pass. `perspective` has to go through its own setter because
       it also writes the CSS on both viewports. */
    apply: (row, v) => {
      if (row.perspective) S.setPerspective(v);
      else if (row.ht) S.halftone();
      else if (!row.set) S.apply(!!row.rebuild);
    },
    restored: () => { S.setPerspective(C.perspective); S.halftone(); S.apply(true); },
    reset: () => { S.setPerspective(C.perspective); S.halftone(); S.apply(true); S.resetZoom(); },
    readout: () => S.readout(),

    groups: [
      { name: 'Halftone echo', open: true, rows: [
        { key:'htEnabled',   bool:true, ht:true, hint:'the dot-screened copy stacked over the photos' },
        { key:'htDelayMs',   min:0, max:1500, step:10, ht:true,
          hint:'how far behind the echo runs — 0 pins it to the sphere' },
        { key:'htDotScale',  min:0.5, max:40, step:0.5, ht:true, hint:'halftone cell size (px on screen)' },
        { key:'htDotRadius', min:0.02, max:0.50, step:0.01, ht:true, hint:'dot size in the cell · 0.5 = cells touch' },
        { key:'htDotShape',  options:['circle','square','cross'], ht:true },
        { key:'htOpacity',   min:0, max:1, step:0.01, ht:true },
        { key:'htBlend',     options:BLENDS, ht:true },
        { key:'htContrast',  min:0.5, max:5, step:0.05, ht:true },
        { key:'htGrayscale', min:0, max:1, step:0.05, ht:true },
        { key:'htBrightness',min:0.2, max:4, step:0.05, ht:true },
        { key:'htInvert',    min:0, max:1, step:0.05, ht:true },
        { key:'htSizeBoost', min:0.85, max:1.30, step:0.005, hint:'echo scale vs the original' },
      ]},
      { name: 'Sphere', open: false, rows: [
        { key:'itemCount', min:8, max:220, step:1, rebuild:true },
        { key:'spacingFactor', min:0.12, max:1.10, step:0.01, hint:'gap between cards' },
        { key:'itemAspect', min:0.55, max:2.40, step:0.01, hint:'card height / width' },
        { key:'radiusOfViewport', min:0.20, max:0.65, step:0.005 },
        { key:'fitRatio', min:0.35, max:1.30, step:0.01, hint:'sphere size on screen' },
        { key:'perspective', min:500, max:3200, step:25, perspective:true },
      ]},
      { name: 'Card angle', open: false, rows: [
        { key:'cardOrientation', options:['both','pitch','yaw','flat'],
          hint:'both = full tangent · pitch = vertical only · yaw = horizontal only · flat = face-on' },
      ]},
      { name: 'Motion', open: false, rows: [
        { key:'dragSensitivity', min:0.02, max:1.20, step:0.01 },
        { key:'followEase', min:0.02, max:0.60, step:0.01 },
        { key:'inertiaGain', min:0, max:40, step:0.5 },
        { key:'idleSpin', min:0, max:0.40, step:0.005, hint:'0 = holds still' },
      ]},
      { name: 'Zoom', open: false, rows: [
        { key:'maxNearScale', min:1.5, max:16, step:0.1 },
        { key:'zoomMin', min:-900, max:0, step:10 },
        { key:'zoomStep', min:0.15, max:4, step:0.05 },
        { key:'zoomEase', min:0.02, max:0.35, step:0.005 },
      ]},
      { name: 'Quality', open: false, rows: [
        { key:'rasterTargetPx', min:80, max:900, step:20 },
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

      { name: 'Look', open: false, rows: [
        { label:'sphere.blend', options:BLENDS,
          get:()=>sGet(sphereVp,'mixBlendMode','multiply'), set:v=>sSet(sphereVp,'mixBlendMode',v) },
        { label:'headline.opacity', min:0, max:1, step:0.01,
          get:()=>parseFloat(sGet(title,'opacity',1)), set:v=>sSet(title,'opacity',v) },
      ]},

      { name: 'Page transition · the tear', open: true,
        rows: window.SHEETFX ? window.SHEETFX.rows() : [] },

      { name: 'Page transition · iris', open: false,
        rows: window.IRIS ? window.IRIS.rows() : [] },

      { name: 'Page transition · liquid', open: false,
        rows: window.LIQUID ? window.LIQUID.rows() : [] },
    ],
  });

  return function destroy(){ panel?.destroy?.(); };
});
