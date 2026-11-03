// ===== shader 1 — 023-video-ascii.js =====

      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    

// ===== shader 2 — 023-video-ascii.js =====

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
    