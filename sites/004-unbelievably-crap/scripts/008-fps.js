/* ==========================================================================
   fps.js — a frame-rate read-out, for measuring on real hardware.

   WHY IT EXISTS. Every performance number I can produce here comes out of a
   software renderer and is worthless as an absolute — it can rank two things
   against each other and nothing more. Before anything is optimised, the
   before-figure has to come off YOUR machine and YOUR phone. This is the
   instrument that produces it.

   OFF UNLESS ASKED FOR. `?fps` in the URL, and nothing else turns it on — a
   visitor can never see it, and it costs a string comparison on every other
   load. Add `&skip` to jump the intro while measuring.

   IT MUST NOT BE THE SLOW THING. Two rules keep it honest:

     THE TEXT IS WRITTEN FOUR TIMES A SECOND, not sixty. Writing into the DOM
     every frame is a style recalculation every frame, on the one element whose
     whole job is to not disturb what it is measuring.

     THE GRAPH IS A CANVAS, redrawn on the same quarter-second tick. A hundred
     and twenty DOM bars restyled per frame would cost more than most of what
     you are trying to measure.

   WHAT THE NUMBERS MEAN, because the average is the least useful of them:

     FPS     frames in the last second — AND IT IS CAPPED BY YOUR SCREEN.
             requestAnimationFrame cannot run faster than the display
             refreshes, so a 120Hz laptop reads 120 and stops. That makes FPS
             a fault detector, not a speed: it tells you when something went
             wrong and nothing at all about how much room is left.
     LOAD    which is why this exists. The share of each frame's budget spent
             doing work rather than idling — main-thread only. At 120Hz the
             budget is 8.3ms, so 2ms of work is 24%. THIS is the number that
             separates "comfortably at 120" from "only just making 120", and
             it is the one to watch while optimising, because it keeps moving
             after FPS has pinned to the ceiling.
     p95     the frame time 95% of frames come in under. This is the honest
             one — it is what a stutter actually is, and an average of 60 with
             a p95 of 40ms is a page that hitches twice a second.
     WORST   the slowest single frame in the window. One 300ms frame is a
             visible lurch even if every other frame was perfect.
     LOOPS   how many separate requestAnimationFrame callbacks are running.
             Not a speed, but it is the number that explains the others on
             this site.

   The two rules on the graph are 60fps (16.7ms) and 120fps (8.3ms). Bars
   under the lower line are frames that made 120; bars over the upper one are
   dropped frames.
   ========================================================================== */
(function () {
  'use strict';

  /* ==== SHIP_LOCKED ======================================================
     THE SITE IS SUBMITTED. This is the one switch that closes every developer
     surface on it — the tuning panel, the FPS meter and the ?off= isolator all
     carry this same constant under this same name, so `grep -rn SHIP_LOCKED js/`
     finds all three and flipping them to false brings everything back exactly
     as it was. Nothing is deleted.

     It has to be a constant and not a URL flag, because a URL flag is what
     these already had: ?tune, ?fps and ?off are guessable, they are in the
     source anybody can read, and on a page being judged that is a panel one
     query string away from a stranger. */
  const SHIP_LOCKED = true;

  if (SHIP_LOCKED) return;
  if (!/[?&]fps(&|=|$)/.test(location.search)) return;

  /* ---- counting the loops -------------------------------------------------
     Wrapped ONCE, at load, before any module has registered — which is why
     this file is a plain IIFE rather than a PAGE.register: by the time a
     registered module mounts, every rAF loop on the page has already been
     started and there is nothing left to count.

     A callback that re-requests is one loop, not two, so what is counted is
     how many are OUTSTANDING at any moment: the count settles at the number of
     independent loops running, which is the figure worth knowing. */
  let pending = 0, loops = 0, workAcc = 0;
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = function (cb) {
    pending++;
    return raf(function (t) {
      pending--;
      if (pending + 1 > loops) loops = pending + 1;
      /* EVERY CALLBACK IS TIMED, and the total is this frame's main-thread
         work. It is what LOAD is a share of. It does NOT include the GPU or
         the browser's own compositing — those are not reachable from script —
         so treat it as a floor: the real cost is this or more. */
      const t0 = performance.now();
      try { return cb(t); }
      finally { workAcc += performance.now() - t0; }
    });
  };
  /* The high-water mark decays, so closing a page's modules lets it fall back
     rather than reporting the busiest moment of the session forever. */
  setInterval(function () { loops = Math.max(pending, loops - 1); }, 3000);

  const W = 132, H = 34, KEEP = 132;
  const times = new Float32Array(KEEP);
  const works = new Float32Array(KEEP);
  let n = 0, head = 0;

  const box = document.createElement('div');
  box.id = 'fpsbox';
  box.setAttribute('aria-hidden', 'true');
  box.innerHTML =
    '<div class="fps-row"><b data-fps>--</b><span>FPS</span></div>' +
    '<canvas width="' + (W * 2) + '" height="' + (H * 2) + '"></canvas>' +
    '<div class="fps-grid">' +
      '<span>load</span><i data-load>--</i>' +
      '<span>p95</span><i data-p95>--</i>' +
      '<span>worst</span><i data-max>--</i>' +
      '<span>loops</span><i data-loops>--</i>' +
    '</div>';

  const css = document.createElement('style');
  css.textContent =
    '#fpsbox{position:fixed;top:10px;right:10px;z-index:200;' +
      'background:#000;color:#fff;border:1px solid #444;padding:8px 9px 7px;' +
      'font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:10px;' +
      'line-height:1.35;letter-spacing:.02em;pointer-events:none;' +
      'font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased}' +
    '#fpsbox .fps-row{display:flex;align-items:baseline;gap:5px;margin-bottom:5px}' +
    '#fpsbox .fps-row b{font-size:21px;font-weight:500;line-height:1}' +
    '#fpsbox .fps-row span{color:#7a7a7a;font-size:9px;letter-spacing:.1em}' +
    '#fpsbox canvas{display:block;width:' + W + 'px;height:' + H + 'px}' +
    '#fpsbox .fps-grid{display:grid;grid-template-columns:auto auto;' +
      'gap:1px 10px;margin-top:6px}' +
    '#fpsbox .fps-grid span{color:#7a7a7a}' +
    '#fpsbox .fps-grid i{font-style:normal;text-align:right}' +
    '#fpsbox .warn{color:#ffb43a}#fpsbox .bad{color:#ff5555}';

  /* boot() is DEFINED here and CALLED at the bottom of the file. It was called
     here, which threw: `last` and `tick` are declared below, and a `let` read
     before its declaration is a ReferenceError rather than undefined. The
     read-out rendered its own box and then sat at `--` forever, which is a
     good reminder that an instrument reporting nothing looks a lot like an
     instrument reporting zero. */
  function boot(){
    document.head.appendChild(css);
    document.body.appendChild(box);
    tick(performance.now());
    setInterval(paint, 250);
  }

  const el = {
    fps:   () => box.querySelector('[data-fps]'),
    load:  () => box.querySelector('[data-load]'),
    p95:   () => box.querySelector('[data-p95]'),
    max:   () => box.querySelector('[data-max]'),
    loops: () => box.querySelector('[data-loops]'),
  };
  const ctx = box.querySelector('canvas').getContext('2d');
  ctx.scale(2, 2);

  let last = performance.now();
  function tick(now){
    const dt = now - last;
    last = now;
    /* The first frame after a tab comes back is hundreds of ms and is not a
       dropped frame — it is a tab that was not running. Anything over a third
       of a second is discarded rather than allowed to poison WORST. */
    /* fps.js loads first, so its callback is the first of each frame — which
       means workAcc currently holds the PREVIOUS frame's total. Reported one
       frame late, which at 120Hz is 8ms and does not matter. */
    const work = workAcc; workAcc = 0;
    if (dt > 0 && dt < 333){
      times[head] = dt; works[head] = work;
      head = (head + 1) % KEEP; if (n < KEEP) n++;
    }
    raf(tick);
  }

  function paint(){
    if (!n) return;
    const win = Array.prototype.slice.call(times, 0, n).sort(function (a, b){ return a - b; });
    const p95 = win[Math.min(win.length - 1, Math.floor(win.length * 0.95))];
    const max = win[win.length - 1];

    /* FPS from the last second of frames, walked back from the newest — an
       average over the whole 132-frame window would still be reporting a stall
       that ended two seconds ago. */
    let acc = 0, f = 0;
    for (let i = 0; i < n && acc < 1000; i++){
      acc += times[(head - 1 - i + KEEP) % KEEP]; f++;
    }
    const fps = acc > 0 ? Math.round(f / (acc / 1000)) : 0;

    const b = el.fps();
    b.textContent = fps;
    b.className = fps >= 90 ? '' : fps >= 55 ? 'warn' : 'bad';
    /* MEDIANS, not means: one 200ms hitch would drag an average load over
       100% and say the page is saturated when it is idle. WORST is where a
       hitch belongs. */
    const wk = Array.prototype.slice.call(works, 0, n).sort(function (a, b){ return a - b; });
    const medWork = wk[wk.length >> 1];
    const medFrame = win[win.length >> 1];
    const load = medFrame > 0 ? Math.round(medWork / medFrame * 100) : 0;
    el.load().textContent = load + '%';
    el.load().className = load < 50 ? '' : load < 80 ? 'warn' : 'bad';

    el.p95().textContent = p95.toFixed(1) + 'ms';
    el.p95().className = p95 <= 8.4 ? '' : p95 <= 17 ? 'warn' : 'bad';
    el.max().textContent = max.toFixed(0) + 'ms';
    el.max().className = max <= 17 ? '' : max <= 50 ? 'warn' : 'bad';
    el.loops().textContent = loops;

    /* THE GRAPH. Fixed 34ms full scale — two dropped frames at 60Hz — so the
       bars mean the same height from one recording to the next. An auto-scaled
       graph is unreadable for exactly this job: the picture would look
       identical whether the page ran at 120 or at 12. */
    const FULL = 34;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < n; i++){
      const v = times[(head - n + i + KEEP) % KEEP];
      const bh = Math.max(1, Math.min(H, v / FULL * H));
      ctx.fillStyle = v <= 8.4 ? '#5fb37e' : v <= 17 ? '#ffb43a' : '#ff5555';
      ctx.fillRect(i * (W / KEEP), H - bh, Math.max(1, W / KEEP - 0.3), bh);
    }
    ctx.fillStyle = 'rgba(255,255,255,.28)';
    ctx.fillRect(0, H - 16.7 / FULL * H, W, 1);   // 60fps
    ctx.fillRect(0, H -  8.3 / FULL * H, W, 1);   // 120fps
  }

  /* LAST LINE, so everything above it exists by the time the first frame is
     asked for. See the note beside boot(). */
  if (document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot, { once: true });
})();
