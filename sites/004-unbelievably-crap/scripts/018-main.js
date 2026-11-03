/* ==========================================================================
   main.js — clock, live cursor readout

   Registered with the page lifecycle (js/lifecycle.js) rather than run on
   load: the interval and the window listener below both outlive a Barba
   container swap, so they have to be cancellable.
   ========================================================================== */
window.PAGE.register('clock', function (scope) {
  'use strict';

  const clockEl = scope.querySelector('#clock');
  const coordX  = scope.querySelector('#coordX');
  const coordY  = scope.querySelector('#coordY');
  if (!clockEl && !coordX && !coordY) return;   // nothing on this page

  const on = window.PAGE.bindings();

  /* ---------------- GMT+3 clock -----------------------------------------
     Always computed from a fixed UTC+3 offset, independent of the visitor's
     own timezone, so it reads correctly for anyone, anywhere. */
  function renderClock(){
    if (!clockEl) return;
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const gmt3 = new Date(utcMs + 3 * 60 * 60 * 1000);

    let hours = gmt3.getHours();
    const minutes = String(gmt3.getMinutes()).padStart(2, '0');
    const suffix = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    if (hours === 0) hours = 12;

    clockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}${suffix}`;
  }

  renderClock();
  const tick = setInterval(renderClock, 1000);

  /* ---------------- live x/y readout -------------------------------------- */
  let lastLabelUpdate = 0;

  on(window, 'pointermove', (e) => {
    // throttle text updates a touch, they don't need to repaint every pixel
    const now = performance.now();
    if (now - lastLabelUpdate > 30){
      if (coordX) coordX.textContent = `x: ${Math.round(e.clientX)}px`;
      if (coordY) coordY.textContent = `y: ${Math.round(e.clientY)}px`;
      lastLabelUpdate = now;
    }
  }, { passive: true });

  return function destroy(){
    clearInterval(tick);
    on.release();
  };
});
