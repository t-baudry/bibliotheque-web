/* ============================================================
   Revelatio - WebGL ASCII video + scroll zoom (arquivo único)
   ============================================================ */

/* ---------- WebGL ASCII effect ---------- */
(() => {
  if (window.__revelatioAsciiInit) return;
  window.__revelatioAsciiInit = true;

  const TRAIL_MAX = 24;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(info || 'Shader compile error');
    }
    return shader;
  }

  function createProgram(gl, vsSource, fsSource) {
    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(info || 'Program link error');
    }
    return program;
  }

  function createGlyphAtlas(chars, glyphSize = 52, fontWeight = 700) {
    const canvas = document.createElement('canvas');
    canvas.width = chars.length * glyphSize;
    canvas.height = glyphSize;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontWeight} ${Math.floor(glyphSize * 0.78)}px Menlo, Monaco, "Courier New", monospace`;
    for (let i = 0; i < chars.length; i += 1) {
      ctx.fillText(chars[i], i * glyphSize + glyphSize * 0.5, glyphSize * 0.54);
    }
    return canvas;
  }

  function initAsciiVideoWebGL(config = {}) {
    const canvas =
      typeof config.canvas === 'string'
        ? document.querySelector(config.canvas)
        : config.canvas || document.querySelector('[data-ascii-canvas]');
    if (!canvas) return null;

    const video = document.createElement('video');
    video.src =
      config.videoSrc ||
      'https://cdn.prod.website-files.com/69ebb4638e4c654fe1990271%2F6a1ad98e81c60eedf1888470_REVELATIO%20VIDEO_v2%20%281%29%20%281%29_mp4.mp4';
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.style.display = 'none';
    document.body.appendChild(video);

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    });
    if (!gl) return null;

    const params = {
      cellSize: config.cellSize ?? 6,
      dotScale: config.dotScale ?? 1.6,
      contrast: config.contrast ?? 0.5,
      brightness: config.brightness ?? 0.5,
      fisheyeStrength: config.fisheyeStrength ?? 0.28,
      mouseRadius: config.mouseRadius ?? 108,
      mouseStrength: config.mouseStrength ?? 0.12,
      warpStrength: config.warpStrength ?? 46.5,
      glitchStrength: config.glitchStrength ?? 0,
      chromaAmount: config.chromaAmount ?? 2,
      bloomStrength: config.bloomStrength ?? 0.75,
      grainStrength: config.grainStrength ?? 0,
      trailDecay: config.trailDecay ?? 0.839,
      tailWidth: config.tailWidth ?? 0.85,
      tailLength: config.tailLength ?? 3.44,
      tvness: config.tvness ?? 1,
      powerState: config.powerState ?? 1,
    };

    const glyphChars = config.glyphChars || '@#W$9876543210?!abc;:+=-,._  ';
    const glyphAtlas = createGlyphAtlas(glyphChars);

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_video;
      uniform sampler2D u_glyph;
      uniform vec2 u_resolution;
      uniform vec2 u_video_resolution;
      uniform float u_cell;
      uniform float u_dot_scale;
      uniform float u_brightness;
      uniform float u_contrast;
      uniform float u_fisheye_strength;
      uniform float u_mouse_radius;
      uniform float u_mouse_strength;
      uniform float u_warp_strength;
      uniform float u_glitch_strength;
      uniform float u_chroma_amount;
      uniform float u_bloom_strength;
      uniform float u_grain_strength;
      uniform float u_tail_width;
      uniform float u_tail_length;
      uniform float u_tvness;
      uniform float u_power_state;
      uniform float u_power_flash;
      uniform float u_glyph_count;
      uniform float u_time;
      uniform float u_trail_count;
      uniform vec4 u_trail[24];

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      vec2 coverUV(vec2 uv, vec2 src, vec2 dst) {
        float srcAspect = src.x / src.y;
        float dstAspect = dst.x / dst.y;
        vec2 outUV = uv;
        if (dstAspect > srcAspect) {
          float scale = srcAspect / dstAspect;
          outUV.y = uv.y * scale + (1.0 - scale) * 0.5;
        } else {
          float scale = dstAspect / srcAspect;
          outUV.x = uv.x * scale + (1.0 - scale) * 0.5;
        }
        return outUV;
      }

      vec2 fisheyeUV(vec2 uv, float strength) {
        vec2 p = uv * 2.0 - 1.0;
        float aspect = u_resolution.x / max(u_resolution.y, 1.0);
        p.x *= aspect;
        float r2 = dot(p, p);
        p *= (1.0 + strength * r2);
        p.x /= aspect;
        return p * 0.5 + 0.5;
      }

      float tvShape(vec2 p, vec2 b, float bulgeTop, float bulgeBot, float vBulgeTop, float vBulgeBot) {
        float yNorm = clamp(p.y / b.y, -1.0, 1.0);
        float bulge = mix(bulgeBot, bulgeTop, smoothstep(-1.0, 1.0, yNorm));
        float effW = b.x + bulge * (1.0 - yNorm * yNorm);

        float xNorm = clamp(p.x / b.x, -1.0, 1.0);
        float vBulge = p.y < 0.0 ? vBulgeBot : vBulgeTop;
        float effH = b.y + vBulge * (1.0 - xNorm * xNorm);

        vec2 d = abs(p) - vec2(effW, effH);
        return max(d.x, d.y);
      }

      vec3 sampleVideoGlitch(vec2 uv, vec2 cellCoord, vec2 dragDir, float influence) {
        float t = floor(u_time * 24.0);
        float line = step(0.92, hash(vec2(floor(uv.y * 180.0 + t), t)));
        float n = hash(cellCoord + vec2(t, t * 0.37)) - 0.5;
        float glitch = u_glitch_strength * (0.4 + influence);
        vec2 jitter = vec2(n, hash(cellCoord.yx + vec2(t * 1.31, t)) - 0.5) * 0.0045 * glitch;
        float tear = line * (hash(vec2(floor(uv.y * 130.0), t * 1.7)) - 0.5) * 0.09 * glitch;
        vec2 base = uv + jitter + vec2(tear, 0.0);
        float pixelGrid = mix(260.0, 70.0, clamp(influence, 0.0, 1.0));
        base = floor(base * pixelGrid) / pixelGrid;
        float chromaMag = u_chroma_amount * 0.0022 * influence * (0.8 + influence * 2.2);
        vec2 chromaVec = normalize(dragDir + vec2(0.0001)) * chromaMag;
        vec3 c;
        c.r = texture2D(u_video, base + chromaVec).r;
        c.g = texture2D(u_video, base).g;
        c.b = texture2D(u_video, base - chromaVec).b;
        return c;
      }

      void main() {
        vec2 frag = v_uv * u_resolution;
        vec2 cellCoord = floor(frag / u_cell);
        vec2 center = (cellCoord + 0.5) * u_cell;
        vec2 cellUV = center / u_resolution;

        vec2 drag = vec2(0.0);
        float accum = 0.0;

        if (u_trail_count > 0.5) {
          vec2 head = u_trail[0].xy * u_resolution;
          vec2 headVel = u_trail[0].zw;
          float headDist = distance(center, head);
          float headMask = 1.0 - smoothstep(u_mouse_radius * 0.20, u_mouse_radius * 0.95, headDist);
          drag += normalize(headVel + vec2(0.0001)) * headMask * 0.55;
          accum += headMask * 0.55;
        }

        for (int i = 0; i < 23; i++) {
          if (float(i + 1) >= u_trail_count) break;

          vec2 a = u_trail[i].xy * u_resolution;
          vec2 b = u_trail[i + 1].xy * u_resolution;
          vec2 seg = b - a;
          float segLen = length(seg);
          if (segLen < 0.0001) continue;

          vec2 dir = seg / segLen;
          vec2 pa = center - a;
          float h = clamp(dot(pa, seg) / max(dot(seg, seg), 0.0001), 0.0, 1.0);
          vec2 closest = a + seg * h;
          float dist = distance(center, closest);

          float widthPx = u_mouse_radius * (0.16 + u_tail_width * 0.28);
          float trailMask = 1.0 - smoothstep(widthPx, widthPx * 2.35, dist);

          float taper = mix(1.0, 0.65, h);
          float age = exp(-float(i) / max(u_tail_length, 0.2));
          float speed = length(u_trail[i].zw) + length(u_trail[i + 1].zw);
          float speedMask = smoothstep(0.00025, 0.010, speed);
          speedMask = mix(0.24, 1.0, speedMask);

          float breakup = hash(cellCoord + closest * 0.012 + vec2(float(i) * 11.7, u_time * 19.0));
          breakup = smoothstep(0.08, 0.96, breakup);

          float mask = trailMask * taper * age * speedMask * breakup;
          drag += dir * mask;
          accum += mask;
        }

        float influence = clamp(accum * u_mouse_strength * 1.25, 0.0, 1.0);
        vec2 dragDir = normalize(drag + vec2(0.0001));
        vec2 pixelStep = vec2(u_cell) / u_resolution;
        vec2 dragOffsetRaw = drag * ((u_warp_strength * 0.9 / u_resolution) * influence);
        vec2 dragOffset = floor(dragOffsetRaw / max(pixelStep, vec2(0.00001))) * pixelStep;
        float scan = (sin(center.y * 0.34 + u_time * 70.0) * 0.5 + 0.5) - 0.5;
        vec2 tearOffset = vec2(scan * 0.14 * influence, 0.0);
        vec2 waveOffset = vec2(
          sin((center.y + u_time * 180.0) * 0.03),
          cos((center.x - u_time * 140.0) * 0.028)
        ) * ((u_warp_strength * 0.12) / u_resolution) * influence;

        cellUV += dragOffset + tearOffset + waveOffset;
        cellUV = fisheyeUV(cellUV, u_fisheye_strength * u_tvness);
        cellUV = clamp(cellUV, vec2(0.001), vec2(0.999));
        vec2 videoUV = coverUV(cellUV, u_video_resolution, u_resolution);
        videoUV = mix(vec2(0.5), videoUV, 0.82);
        vec2 tubeP = v_uv * 2.0 - 1.0;
        vec2 tvSize = mix(vec2(1.0, 1.0), vec2(0.93, 0.80), u_tvness);
        float tvBulge = mix(0.0, 0.035, u_tvness);
        float vBulgeTop = mix(0.0, 0.14, u_tvness);
        float vBulgeBot = mix(0.0, 0.15, u_tvness);
        float tubeDist = tvShape(tubeP, tvSize, tvBulge, tvBulge, vBulgeTop, vBulgeBot);
        float pxToUnits = 2.0 / min(u_resolution.x, u_resolution.y);
        float edgeFalloff = u_cell * 0.8 * pxToUnits;
        float tubeMask = 1.0 - smoothstep(0.0, edgeFalloff, tubeDist);
        vec3 color = sampleVideoGlitch(videoUV, cellCoord, dragDir, influence);

        float luma = dot(color, vec3(0.299, 0.587, 0.114));
        luma = clamp((luma - 0.5) * u_contrast + 0.5 + u_brightness, 0.0, 1.0);
        float lumaNoise = (hash(cellCoord + floor(u_time * 55.0)) - 0.5) * 0.5;
        luma = clamp(luma + lumaNoise * influence, 0.0, 1.0);

        float glyphIndex = floor((1.0 - luma) * (u_glyph_count - 1.0) + 0.5);
        vec2 local = (mod(frag, u_cell) - (u_cell * 0.5)) / (u_cell * 0.5 * max(u_dot_scale, 0.1));
        vec2 glyphLocal = clamp(local * 0.5 + 0.5, 0.0, 1.0);
        vec2 glyphUV = vec2((glyphIndex + glyphLocal.x) / u_glyph_count, glyphLocal.y);
        float glyphMask = texture2D(u_glyph, glyphUV).r;

        vec3 bg = vec3(0.0);
        vec3 asciiColor = mix(bg, color, glyphMask);

        vec2 px = 1.0 / u_resolution;
        vec3 b0 = sampleVideoGlitch(videoUV + vec2(px.x * 2.0, 0.0), cellCoord + vec2(1.0, 0.0), dragDir, influence);
        vec3 b1 = sampleVideoGlitch(videoUV + vec2(-px.x * 2.0, 0.0), cellCoord + vec2(-1.0, 0.0), dragDir, influence);
        vec3 b2 = sampleVideoGlitch(videoUV + vec2(0.0, px.y * 2.0), cellCoord + vec2(0.0, 1.0), dragDir, influence);
        vec3 b3 = sampleVideoGlitch(videoUV + vec2(0.0, -px.y * 2.0), cellCoord + vec2(0.0, -1.0), dragDir, influence);
        vec3 blur = (b0 + b1 + b2 + b3) * 0.25;
        float bright = max(max(blur.r, blur.g), blur.b);
        vec3 bloom = blur * smoothstep(0.58, 1.0, bright) * u_bloom_strength;

        float grain = (hash(frag + u_time * 120.0) - 0.5) * u_grain_strength;
        vec3 outColor = asciiColor + bloom + vec3(grain);

        float startup = 1.0 - smoothstep(0.0, 1.0, u_power_state);
        float aperture = mix(0.0010, 1.0, smoothstep(0.0, 1.0, u_power_state));
        float openMask = 1.0 - smoothstep(aperture, aperture + edgeFalloff * 1.15, abs(v_uv.y - 0.5));

        float unstable = startup * (0.006 + 0.010 * u_power_flash);
        float bandNoise = (hash(vec2(v_uv.y * 140.0, floor(u_time * 80.0))) - 0.5);
        float staticNoise = (hash(vec2(v_uv.x * 300.0 + u_time * 30.0, v_uv.y * 120.0)) - 0.5);
        outColor += vec3((bandNoise * 0.35 + staticNoise * 0.2) * unstable);

        float beam = exp(-abs(v_uv.y - 0.5) / max(0.0012, 0.016 + u_power_flash * 0.09));
        float orb = exp(-length((v_uv - 0.5) * vec2(1.75, 1.0)) / max(0.008, 0.03 + u_power_flash * 0.16));
        float flare = (beam * 1.35 + orb * 1.05) * u_power_flash;

        vec3 powered = outColor * openMask + vec3(flare);
        float alpha = clamp(tubeMask * max(openMask, flare * 0.5), 0.0, 1.0);
        // Alpha premultiplicado: compositing correto no WebKit/iOS (recorte do tubo).
        gl_FragColor = vec4(clamp(powered, 0.0, 1.0) * alpha, alpha);
      }
    `;

    const program = createProgram(gl, vs, fs);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uVideo = gl.getUniformLocation(program, 'u_video');
    const uGlyph = gl.getUniformLocation(program, 'u_glyph');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uVideoResolution = gl.getUniformLocation(program, 'u_video_resolution');
    const uCell = gl.getUniformLocation(program, 'u_cell');
    const uDotScale = gl.getUniformLocation(program, 'u_dot_scale');
    const uBrightness = gl.getUniformLocation(program, 'u_brightness');
    const uContrast = gl.getUniformLocation(program, 'u_contrast');
    const uFisheyeStrength = gl.getUniformLocation(program, 'u_fisheye_strength');
    const uMouseRadius = gl.getUniformLocation(program, 'u_mouse_radius');
    const uMouseStrength = gl.getUniformLocation(program, 'u_mouse_strength');
    const uWarpStrength = gl.getUniformLocation(program, 'u_warp_strength');
    const uGlitchStrength = gl.getUniformLocation(program, 'u_glitch_strength');
    const uChromaAmount = gl.getUniformLocation(program, 'u_chroma_amount');
    const uBloomStrength = gl.getUniformLocation(program, 'u_bloom_strength');
    const uGrainStrength = gl.getUniformLocation(program, 'u_grain_strength');
    const uTailWidth = gl.getUniformLocation(program, 'u_tail_width');
    const uTailLength = gl.getUniformLocation(program, 'u_tail_length');
    const uTvness = gl.getUniformLocation(program, 'u_tvness');
    const uPowerState = gl.getUniformLocation(program, 'u_power_state');
    const uPowerFlash = gl.getUniformLocation(program, 'u_power_flash');
    const uGlyphCount = gl.getUniformLocation(program, 'u_glyph_count');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uTrail = gl.getUniformLocation(program, 'u_trail[0]');
    const uTrailCount = gl.getUniformLocation(program, 'u_trail_count');

    const videoTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, videoTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const glyphTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, glyphTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glyphAtlas);

    const mouse = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, active: false };
    let mouseEnergy = 0;
    let lastMoveTime = 0;
    let powerFlash = 0;
    let powerAnimRaf = 0;
    const trail = [];
    const trailUniform = new Float32Array(TRAIL_MAX * 4);

    function pushTrail(x, y, dx, dy) {
      trail.unshift({ x, y, dx, dy });
      if (trail.length > TRAIL_MAX) trail.length = TRAIL_MAX;
    }

    function updateMouse(event) {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const insideX = event.clientX >= rect.left && event.clientX <= rect.right;
      const insideY = event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (!insideX || !insideY) {
        mouse.active = false;
        return;
      }
      const nx = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const ny = 1 - Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      const dx = nx - mouse.x;
      const dy = ny - mouse.y;
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = nx;
      mouse.y = ny;
      mouse.active = true;
      lastMoveTime = performance.now();
      pushTrail(nx, ny, dx, dy);
    }

    window.addEventListener('pointermove', updateMouse, { passive: true });
    window.addEventListener('mousemove', updateMouse, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updateMouse({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    }, { passive: true });
    window.addEventListener('blur', () => {
      mouse.active = false;
    });

    function updateTrail() {
      for (let i = trail.length - 1; i >= 0; i -= 1) {
        trail[i].dx *= params.trailDecay;
        trail[i].dy *= params.trailDecay;
        trail[i].x += trail[i].dx * 0.15;
        trail[i].y += trail[i].dy * 0.15;
        if (Math.abs(trail[i].dx) + Math.abs(trail[i].dy) < 0.00006) {
          trail.splice(i, 1);
        }
      }
    }

    function uploadTrail() {
      trailUniform.fill(0);
      const count = Math.min(trail.length, TRAIL_MAX);
      for (let i = 0; i < count; i += 1) {
        const t = trail[i];
        const o = i * 4;
        trailUniform[o] = t.x;
        trailUniform[o + 1] = t.y;
        trailUniform[o + 2] = t.dx;
        trailUniform[o + 3] = t.dy;
      }
      gl.uniform1f(uTrailCount, count);
      gl.uniform4fv(uTrail, trailUniform);
    }

    let currentDpr = 1;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      currentDpr = dpr;
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    }

    function render() {
      resize();
      updateTrail();
      uploadTrail();

      const now = performance.now();
      const idleMs = now - lastMoveTime;
      const targetEnergy = mouse.active || idleMs < 260 ? 1 : 0;
      mouseEnergy += (targetEnergy - mouseEnergy) * 0.09;
      const smoothedMouseStrength =
        params.mouseStrength * (0.15 + mouseEnergy * 0.85);

      if (video.readyState >= 2) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, videoTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.uniform1i(uVideo, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, glyphTexture);
        gl.uniform1i(uGlyph, 1);

        gl.uniform2f(
          uVideoResolution,
          video.videoWidth || canvas.width,
          video.videoHeight || canvas.height
        );
        gl.uniform1f(uCell, params.cellSize * currentDpr);
        gl.uniform1f(uDotScale, params.dotScale);
        gl.uniform1f(uBrightness, params.brightness);
        gl.uniform1f(uContrast, params.contrast);
        gl.uniform1f(uFisheyeStrength, params.fisheyeStrength);
        gl.uniform1f(uMouseRadius, params.mouseRadius * currentDpr);
        gl.uniform1f(uMouseStrength, smoothedMouseStrength);
        gl.uniform1f(uWarpStrength, params.warpStrength * currentDpr);
        gl.uniform1f(uGlitchStrength, params.glitchStrength);
        gl.uniform1f(uChromaAmount, params.chromaAmount * params.tvness);
        gl.uniform1f(uBloomStrength, params.bloomStrength);
        gl.uniform1f(uGrainStrength, params.grainStrength);
        gl.uniform1f(uTailWidth, params.tailWidth);
        gl.uniform1f(uTailLength, params.tailLength);
        gl.uniform1f(uTvness, params.tvness);
        gl.uniform1f(uPowerState, params.powerState);
        gl.uniform1f(uPowerFlash, powerFlash);
        gl.uniform1f(uGlyphCount, glyphChars.length);
        gl.uniform1f(uTime, performance.now() * 0.001);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize);
    video.play().catch(() => {});
    render();

    function powerOn(duration = 980) {
      if (powerAnimRaf) cancelAnimationFrame(powerAnimRaf);
      params.powerState = 0;
      const startAt = performance.now();

      const step = () => {
        const t = Math.min(1, (performance.now() - startAt) / duration);
        const openT = t < 0.35
          ? Math.pow(t / 0.35, 0.58) * 0.28
          : 0.28 + Math.pow((t - 0.35) / 0.65, 1.3) * 0.72;
        params.powerState = openT;

        const mainFlare = Math.exp(-Math.pow((t - 0.12) / 0.08, 2.0)) * 1.55;
        const tailFlare = Math.exp(-Math.pow((t - 0.32) / 0.14, 2.0)) * 0.55;
        powerFlash = mainFlare + tailFlare;

        if (t < 1) {
          powerAnimRaf = requestAnimationFrame(step);
        } else {
          params.powerState = 1;
          powerFlash = 0;
          powerAnimRaf = 0;
        }
      };

      powerAnimRaf = requestAnimationFrame(step);
    }

    return {
      setOptions(next = {}) {
        Object.keys(next).forEach((key) => {
          if (typeof next[key] === 'number') params[key] = next[key];
        });
      },
      powerOn,
      getOptions() {
        return { ...params };
      },
    };
  }

  function tryInit() {
    if (document.querySelector('[data-ascii-canvas]')) {
      window.revelatioAscii = initAsciiVideoWebGL();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }
})();

/* ---------- Scroll zoom (cresce e perde o efeito de TV ao rolar) ---------- */
(() => {
  if (window.__revelatioScrollZoom) return;
  window.__revelatioScrollZoom = true;

  const TRIGGER_SELECTOR = '[data-revelatio-zoom-scope]';
  const TARGET_SELECTOR = '[data-revelatio-tv]';
  const SCALE_END_PROGRESS = 0.85;
  const TVNESS_END_PROGRESS = 0.85;
  const DESKTOP_MONITOR_LIFT_EM = 3; // quanto sobe no estado "monitor" (desktop)
  const MOBILE_MONITOR_LIFT_EM = 2; // quanto sobe no estado "monitor" (mobile)

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  // Viewport visível real (equivalente a svh no iOS, ignora a barra dinâmica).
  function viewportHeight() {
    const vv = window.visualViewport;
    if (vv && vv.height) return vv.height;
    return document.documentElement.clientHeight || window.innerHeight;
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(() => {
    const scope =
      document.querySelector(TRIGGER_SELECTOR) ||
      document.querySelector(TARGET_SELECTOR)?.closest('section');
    const target = document.querySelector(TARGET_SELECTOR);
    if (!scope || !target) return;

    let baseW = 0;
    let baseH = 0;
    let updateRaf = 0;

    function captureBase() {
      const previous = {
        width: target.style.width,
        height: target.style.height,
        maxWidth: target.style.maxWidth,
        aspectRatio: target.style.aspectRatio,
        margin: target.style.margin,
      };

      target.style.width = '';
      target.style.height = '';
      target.style.maxWidth = '';
      target.style.aspectRatio = '';
      target.style.margin = '';

      const rect = target.getBoundingClientRect();
      if (rect.width) baseW = rect.width;
      if (rect.height) baseH = rect.height;

      target.style.width = previous.width;
      target.style.height = previous.height;
      target.style.maxWidth = previous.maxWidth;
      target.style.aspectRatio = previous.aspectRatio;
      target.style.margin = previous.margin;
    }

    function update() {
      if (!baseW || !baseH) captureBase();

      const vh = viewportHeight();
      const rect = scope.getBoundingClientRect();
      // offsetHeight é a altura de layout (estável em px), não flutua com a barra do iOS.
      const scopeH = scope.offsetHeight || rect.height;
      const distance = scopeH - vh;

      // Se a distância de scroll degenerar (iOS/vh), mantém o estado base (máscara de
      // monitor) em vez de saturar o progresso para "tela cheia".
      let raw = 0;
      if (distance > 4) {
        raw = clamp(-rect.top / distance, 0, 1);
      }

      const sizeProgress = clamp(raw / SCALE_END_PROGRESS, 0, 1);
      const tvProgress = clamp(raw / TVNESS_END_PROGRESS, 0, 1);

      const targetW = window.innerWidth;
      const targetH = vh;

      const w = lerp(baseW, targetW, sizeProgress);
      const h = lerp(baseH, targetH, sizeProgress);
      const isMobile = window.innerWidth <= 767;
      const liftEm = isMobile ? MOBILE_MONITOR_LIFT_EM : DESKTOP_MONITOR_LIFT_EM;
      const liftY = lerp(-liftEm, 0, sizeProgress);

      target.style.width = w + 'px';
      target.style.height = h + 'px';
      target.style.maxWidth = 'none';
      target.style.aspectRatio = 'auto';
      target.style.margin = '0 auto';
      target.style.transform = 'translateY(' + liftY + 'em)';

      if (window.revelatioAscii && typeof window.revelatioAscii.setOptions === 'function') {
        window.revelatioAscii.setOptions({ tvness: 1 - tvProgress });
      }
    }

    function requestUpdate() {
      if (updateRaf) return;
      updateRaf = requestAnimationFrame(() => {
        updateRaf = 0;
        update();
      });
    }

    function start() {
      captureBase();
      update();
    }

    function resetAndStart() {
      target.style.width = '';
      target.style.height = '';
      target.style.maxWidth = '';
      target.style.aspectRatio = '';
      target.style.transform = '';
      baseW = 0;
      baseH = 0;
      requestAnimationFrame(start);
    }

    let lastWidth = window.innerWidth;
    function onResize() {
      // No iOS a barra dinâmica dispara resize mudando só a altura: nesse caso só
      // re-medimos o progresso. Largura diferente = resize real -> recaptura a base.
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        resetAndStart();
      } else {
        requestUpdate();
      }
    }

    window.addEventListener('load', start);
    window.addEventListener('pageshow', start);
    window.addEventListener('revelatio:preloader-done', resetAndStart);
    window.addEventListener('orientationchange', resetAndStart);
    window.addEventListener('resize', onResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', requestUpdate);
    }
    window.addEventListener('scroll', requestUpdate, { passive: true });

    start();
  });
})();
