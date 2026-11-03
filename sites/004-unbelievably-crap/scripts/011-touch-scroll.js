/* ==========================================================================
   touch-scroll.js — the home page's scroll chain, on a finger.

   THE BUG THIS FIXES. The home page is three phases driven by one gesture:
   js/about-text.js runs the copy, js/mask-scroll.js runs the black-to-white
   transition once the copy is spent, and js/block2.js runs the head and its
   columns after that. All three read the gesture from a `wheel` listener, and
   a phone has no wheel. Only about-text had a pointer drag as well, so on a
   phone the copy moved, reached its end, and the page stopped there: the head
   was unreachable, and from the visitor's side the site simply ended.

   WHY A SYNTHETIC WHEEL RATHER THAN THREE DRAG HANDLERS. The three phases do
   not just each read the gesture — they hand it to each other, in order, by
   rules written into their wheel listeners: the copy takes what it needs and
   passes the rest down, and scrolling back up unwinds them in reverse. Giving
   each one its own touch handler would mean writing that hand-over a second
   time, in three files, and the second copy is where the two go out of step.
   Turning the finger into the event they already agree on leaves exactly one
   description of the order.

   IT IS DISPATCHED ON #aboutStage, not on the root: about-text listens there
   and the other two listen on #aboutRoot above it, so a bubbling event reaches
   all three in the order they are registered — which is the order the hand-off
   is written for. Dispatching on the root would skip the copy entirely.

   MOMENTUM IS PART OF THE FIX, not a flourish. A phone page that stops dead
   the instant the finger lifts reads as broken in a way that is hard to name
   and impossible to miss; every native scroller in the world keeps going. It
   is the same synthetic wheel, decaying, so it goes through the same hand-off
   as the drag did.
   ========================================================================== */
window.PAGE.register('touch-scroll', function (scope) {
  'use strict';

  if (scope.dataset.page !== 'mask') return;

  const target = scope.querySelector('#aboutStage') || scope.querySelector('#aboutRoot');
  if (!target) return;

  const CONFIG = {
    enabled: true,
    speed: 1.6,      // px of wheel per px of finger · above 1 because a thumb
                     // travels a fraction of what a trackpad does
    momentum: true,
    friction: 0.94,  // per frame · lower stops sooner
    minVel: 0.4,     // px/frame below which the glide ends
  };

  const on = window.PAGE.bindings();

  let lastY = 0, vel = 0, lastT = 0, glide = 0, active = false;

  function send(deltaY){
    if (!deltaY) return;
    target.dispatchEvent(new WheelEvent('wheel', {
      deltaY, deltaX: 0, deltaMode: 0, bubbles: true, cancelable: true,
    }));
  }

  function stopGlide(){ cancelAnimationFrame(glide); glide = 0; }

  function coast(){
    vel *= CONFIG.friction;
    if (Math.abs(vel) < CONFIG.minVel){ stopGlide(); return; }
    send(vel * CONFIG.speed);
    glide = requestAnimationFrame(coast);
  }

  on(target, 'touchstart', e => {
    if (!CONFIG.enabled) return;
    stopGlide();
    /* ONE FINGER ONLY. Two is a pinch, and turning a pinch into scroll is how
       a zoom becomes a jump halfway down the page. */
    if (e.touches.length !== 1){ active = false; return; }
    active = true;
    lastY = e.touches[0].clientY;
    lastT = performance.now();
    vel = 0;
  }, { passive: true });

  on(target, 'touchmove', e => {
    if (!CONFIG.enabled || !active || e.touches.length !== 1) return;
    /* The browser must not also scroll. css/about.css already sets
       touch-action: none on .about, and this is the second half of that —
       between them, nothing but this file moves the page. */
    e.preventDefault();

    const y = e.touches[0].clientY;
    const now = performance.now();
    /* DRAGGING UP MOVES THE PAGE DOWN, which is why this is last minus
       current: the finger and the content travel opposite ways, and a wheel's
       positive deltaY already means "down". */
    const dy = lastY - y;
    lastY = y;

    /* Velocity in px per FRAME, not per ms, because coast() spends it one
       frame at a time. Clamped so a 100ms stall before the lift cannot turn a
       one-pixel move into a launch. */
    const dt = Math.max(8, Math.min(64, now - lastT));
    lastT = now;
    vel = dy * (16.7 / dt);

    send(dy * CONFIG.speed);
  }, { passive: false });

  const lift = () => {
    if (!active) return;
    active = false;
    if (CONFIG.momentum && Math.abs(vel) >= CONFIG.minVel){
      stopGlide();
      glide = requestAnimationFrame(coast);
    }
  };
  on(target, 'touchend', lift, { passive: true });
  on(target, 'touchcancel', lift, { passive: true });

  window.TOUCHSCROLL = {
    config: CONFIG,
    groups(){
      const T = window.TOUCHSCROLL;
      if (!T) return [];
      const num = (key, min, max, step, hint) => ({
        label: 'touch.' + key, min, max, step, hint,
        get: () => T.config[key], set: v => { T.config[key] = v; },
      });
      return [{
        name: 'PAGE · scrolling on a phone', open: false, rows: [
          { label: 'touch.enabled', options: ['on', 'off'],
            get: () => T.config.enabled ? 'on' : 'off',
            set: v => { T.config.enabled = (v === 'on'); },
            hint: 'off leaves the page unscrollable on touch — there is no browser scroll underneath to fall back to' },
          num('speed', 0.5, 4, 0.05,
              'how far the page moves per pixel of finger · a thumb travels far less than a trackpad, which is why this is above 1'),
          { label: 'touch.momentum', options: ['on', 'off'],
            get: () => T.config.momentum ? 'on' : 'off',
            set: v => { T.config.momentum = (v === 'on'); },
            hint: 'keeps gliding after the finger lifts, as every native scroller does' },
          num('friction', 0.80, 0.99, 0.005, 'how quickly the glide dies · lower stops sooner'),
        ],
      }];
    },
  };

  return function destroy(){
    stopGlide();
    on.release();
    if (window.TOUCHSCROLL && window.TOUCHSCROLL.config === CONFIG) delete window.TOUCHSCROLL;
  };
});
