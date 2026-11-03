self.onmessage = function (e) {
  var d = e.data;
  var canvas = d.canvas;
  var ctx = canvas.getContext("2d");
  var sx = canvas.width / d.vbw;
  var sy = canvas.height / d.vbh;
  var paths = d.paths.map(function (s) { return new Path2D(s); });
  var bbs = d.bboxes, delays = d.delays, DRAW = d.drawMs, F = d.feather;
  var n = paths.length, start = null;
  function ease(t){ t = t<0?0:t>1?1:t; return t<0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
  var raf = self.requestAnimationFrame ? self.requestAnimationFrame.bind(self)
          : function (cb){ setTimeout(function(){ cb(performance.now()); }, 16); };
  function frame(now){
    if (start === null) start = now;
    var t = now - start, done = true, i;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.setTransform(sx,0,0,sy,0,0);
    for (i = 0; i < n; i++) {
      var p = (t - delays[i]) / DRAW;
      if (p < 1) done = false;
      if (p <= 0) continue;
      var bb = bbs[i];
      ctx.save();
      ctx.clip(paths[i]);
      if (p >= 1) {
        ctx.fillStyle = "#ffffff";
        ctx.fill(paths[i]);
      } else {
        var edge  = bb.x + ease(p) * (bb.w + F);
        var solid = edge - F;
        ctx.fillStyle = "#ffffff";
        if (solid > bb.x) ctx.fillRect(bb.x - 0.5, bb.y - 0.5, solid - bb.x + 0.5, bb.h + 1);
        var g = ctx.createLinearGradient(solid, 0, edge, 0);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(solid, bb.y - 0.5, F, bb.h + 1);
      }
      ctx.restore();
    }
    if (done) { self.postMessage({ done: true }); return; }
    raf(frame);
  }
  raf(frame);
};