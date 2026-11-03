// ===== shader 1 — 007-about-figure.js =====

    attribute vec3 aPos;
    attribute vec3 aNrm;
    uniform mat4 uProj, uView, uModel;
    uniform mat3 uNormal;
    uniform vec3 uQMin, uQSpan;
    uniform float uBreath, uBreathT, uBreathPhase;
    uniform float uSpinOwn, uOwnCx, uOwnCz;
    varying vec3 vN, vP;
    void main(){
      /* aPos arrives as a normalised uint16, i.e. 0..1 across the mesh

// ===== shader 2 — 007-about-figure.js =====
s
       surface, because that is what the original did and what it looks like:
       the hole stays where you drew it while the head keeps turning under it. */
    uniform vec3 uRevPts[${REV_PTS}];
    uniform vec2 uRes;
    /* uRevMode:  1 the outer layer, which the reveal EATS
                  -1 the inner layer, which the reveal is the only thing that
                     shows — so it is invisible until the pointer opens a hole,
                     which is also what stops the parts of the mask that stick
                     out past the face from hanging there permanently. No
                     amount of scaling could contain them; not drawing them
                     unless they have been revealed does it exactly.
                   0 no reveal · one opaque layer, every other page */
    uniform float uHeadOpacity, uFresnel, uFresnelPow, uRevGlow, uRevEdge, uSkullGlow;
    uniform float uFlatten, uFlatLevel;
    uniform vec3 uRevTint;
    uniform float uRevMode, uRevRadius, uRevSoft, uRevMax,
                  uRevWarp, uRevWarpScale, uRevWarpSpeed, uRevTime;

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float vnoiseR(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
                 mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
    }

    float revealAt(){
      if (abs(uRevMode) < 0.5) return 0.0;
      vec2 uv = gl_FragCoord.xy / max(uRes.y, 1.0);   // heights on both axes,
                                                      // so the hole is round
      /* Warp the LOOKUP, not the result. Deforming where the brush is measured
         from bends the whole hole — including its interior — the way a fluid
         does; deforming the result afterwards only ever wobbles the rim. */
      if (uRevWarp > 0.0001){
        float n1 = vnoiseR(uv * uRevWarpScale + vec2(0.0, uRevTime * uRevWarpSpeed));
        float n2 = vnoiseR(uv * uRevWarpScale + vec2(5.2, uRevTime * uRevWarpSpeed + 1.3));
        uv += (vec2(n1, n2) - 0.5) * uRevWarp * uRevRadius * 2.0;
      }
      float r = 0.0;
      for (int i = 0; i < ${REV_PTS}; i++){
        if (uRevPts[i].z <= 0.0) continue;
        vec2 c = vec2(uRevPts[i].x * uRes.x / max(uRes.y, 1.0), uRevPts[i].y);
        float d = length(uv - c) / max(uRevRadius, 1e-4);
        /* Gaussian, not a hard disc: strokes have to ADD where they overlap
           so a slow drag opens a wider hole than a flick, and a soft falloff
           is what lets them sum without banding at every join. */
        r += uRevPts[i].z * exp(-d * d * mix(6.0, 1.6, clamp(uRevSoft, 0.0, 1.0)));
      }
      return clamp(r, 0.0, 1.0) * clamp(uRevMax, 0.0, 1.0);
    }

    void main(){
      vec3 n = normalize(vN);
      float d = max(dot(n, normalize(uLight)), 0.0);
      vec3 v = normalize(-vP);
      float r = pow(1.0 - max(dot(n, v), 0.0), 2.5);
      float s = uAmbient + uDiffuse * d + uRim * r;
      s *= uTone;
      /* FLAT WHITE. Everything above reads the model

// ===== shader 3 — 012-about-xray.js =====

    precision mediump float;
    varying vec3 vN, vP;
    uniform vec3 uLight, uTint;
    uniform float uAmbient, uDiffuse, uRim, uTone, uGrain, uSeed;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    void main(){
      vec3 n = normalize(vN);
      float d = max(dot(n, normalize(uLight)), 0.0);
      vec3 v = normalize(-vP);
      float r = pow(1.0 - max(dot(n, v), 0.0), 2.5);
      float s = (uAmbient + uDiffuse * d + uRim * r) * uTone;
      vec2 sp = gl_FragCoord.xy + uSeed;
      vec3 noise = vec3(hash(sp), hash(sp + 17.3), hash(sp + 41.7)) - 0.5;
      gl_FragColor = vec4(clamp(vec3(s) * uTint + noise * uGrain, 0.0, 1.0), 1.0);
    }

// ===== shader 4 — 012-about-xray.js =====

    varying vec3 vN, vP;
    void main(){
      vec4 wp = modelViewMatrix * vec4(position, 1.0);
      vP = wp.xyz;
      vN = normalMatrix * normal;
      gl_Position = projectionMatrix * wp;
    }

// ===== shader 5 — 012-about-xray.js =====

    precision mediump float;
    varying vec3 vN, vP;
    uniform vec3 uTint;
    uniform float uPower, uGain, uCore;
    void main(){
      vec3 n = normalize(vN);
      vec3 v = normalize(-vP);
      float f = pow(1.0 - abs(dot(n, v)), uPower);
      float s = uCore + uGain * f;
      gl_FragColor = vec4(clamp(vec3(s) * uTint, 0.0, 1.0), 1.0);
    }

// ===== shader 6 — 012-about-xray.js =====

    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }

// ===== shader 7 — 012-about-xray.js =====

    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uPrev;
    uniform vec2 uFrom, uTo, uAspect;
    uniform float uRadius, uStrength, uDecay, uDisplace,
                  uNoiseScale, uNoiseSpeed, uTime, uDown;

    vec2 hash2(vec2 p){
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
    }
    float gnoise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
                     dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
                 mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                     dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 4; i++){ v += a * gnoise(p); p *= 2.02; a *= 0.5; }
      return v;
    }
    // distance to the segment ab, measured in aspect-corrected space so the
    // trail is round rather than an ellipse on a tall canvas
    float segDist(vec2 p, vec2 a, vec2 b){
      vec2 pa = (p - a) * uAspect, ba = (b - a) * uAspect;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
      return length(pa - ba * h);
    }

    void main(){
      // curl-ish offset: two FBM lookups a little apart give a divergence-free
      // enough field to push the trail around without it just smearing
      float n1 = fbm(vUv * uNoiseScale + vec2(0.0, uTime * uNoiseSpeed));
      float n2 = fbm(vUv * uNoiseScale + vec2(5.2, 1.3 - uTime * uNoiseSpeed));
      vec2 push = vec2(n2, -n1) * uDisplace;

      float prev = texture2D(uPrev, vUv - push).r * pow(uDecay, uDown);

      float d = segDist(vUv, uFrom, uTo);
      float splat = uStrength * exp(-(d * d) / max(uRadius * uRadius, 1e-6));

      gl_FragColor = vec4(clamp(prev + splat, 0.0, 1.0), 0.0, 0.0, 1.0);
    }

// ===== shader 8 — 012-about-xray.js =====

    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uBody, uSkel, uFluid;
    uniform float uEdge, uSoft, uBodyOpacity, uSkelOpacity;
    void main(){
      float f = texture2D(uFluid, vUv).r;
      float m = smoothstep(uEdge - uSoft, uEdge + uSoft, f);
      vec4 b = texture2D(uBody, vUv);
      vec4 s = texture2D(uSkel, vUv);

      /* Two weights rather than one mix. The body falls from 1 to
         uBodyOpacity across the reveal instead of to zero, so it can be left
         faintly present under the bone; the skeleton comes up to uSkelOpacity.
         Set them to 0 and 1 and this is mix(b, s, m) exactly. */
      float bw = mix(1.0, uBodyOpacity, m);
      float sw = m * uSkelOpacity;

      /* Alpha is weighted the same way, which is the point rather than a
         detail: where the body has been opened and there is no bone behind it,
         the result is transparent and you see the page through the hole. That
         is what makes it read as looking THROUGH someone. */
      gl_FragColor = vec4(clamp(b.rgb * bw + s.rgb * sw, 0.0, 1.0),
                          clamp(b.a * bw + s.a * sw, 0.0, 1.0));
    }

// ===== shader 9 — 012-about-xray.js =====

    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uSrc;
    uniform float uThreshold, uKnee;
    void main(){
      vec4 c = texture2D(uSrc, vUv);
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      // soft knee: nothing below the threshold, easing in over uKnee above it
      float w = smoothstep(uThreshold, uThreshold + max(uKnee, 1e-4), l);
      gl_FragColor = vec4(c.rgb * w, 1.0);
    }

// ===== shader 10 — 012-about-xray.js =====

    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uSrc;
    uniform vec2 uDir;          // texel-sized step, already scaled by radius
    void main(){
      // 9-tap Gaussian, weights from the binomial row
      float w[5];
      w[0] = 0.2270270270; w[1] = 0.1945945946; w[2] = 0.1216216216;
      w[3] = 0.0540540541; w[4] = 0.0162162162;
      vec3 c = texture2D(uSrc, vUv).rgb * w[0];
      for (int i = 1; i < 5; i++){
        vec2 o = uDir * float(i);
        c += texture2D(uSrc, vUv + o).rgb * w[i];
        c += texture2D(uSrc, vUv - o).rgb * w[i];
      }
      gl_FragColor = vec4(c, 1.0);
    }

// ===== shader 11 — 012-about-xray.js =====

    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uSrc, uBloom;
    uniform float uIntensity;
    uniform float uCrt, uScanCount, uScanDepth, uAberration,
                  uCurvature, uVignette, uContrast, uSaturation;

    void main(){
      vec2 uv = vUv;

      /* Barrel distortion first, because everything below samples through it.
         Centred on 0.5 and pushed out by the square of the distance, which is
         the cheap approximation of a curved tube. */
      if (uCrt > 0.5 && uCurvature > 0.0){
        vec2 d = uv - 0.5;
        uv = 0.5 + d * (1.0 + uCurvature * dot(d, d) * 4.0);
        // outside the tube there is nothing, and clamping would smear the
        // edge pixels outward into a streak
        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0){
          gl_FragColor = vec4(0.0); return;
        }
      }

      vec4 c;
      if (uCrt > 0.5 && uAberration > 0.0){
        // the split grows with distance from centre, as a real lens does
        vec2 dir = (uv - 0.5) * uAberration;
        vec4 cr = texture2D(uSrc, uv + dir);
        vec4 cg = texture2D(uSrc, uv);
        vec4 cb = texture2D(uSrc, uv - dir);
        c = vec4(cr.r, cg.g, cb.b, max(max(cr.a, cg.a), cb.a));
      } else {
        c = texture2D(uSrc, uv);
      }
      vec3 b = texture2D(uBloom, uv).rgb * uIntensity;
      /* Added to colour but ALSO to alpha, or the glow spilling past the
         figure

// ===== shader 12 — 017-about-figure.js =====

    attribute vec3 aPos;
    attribute vec3 aNrm;
    uniform mat4 uProj, uView, uModel;
    uniform mat3 uNormal;
    uniform vec3 uQMin, uQSpan;
    uniform float uBreath, uBreathT, uBreathPhase;
    uniform float uSpinOwn, uOwnCx, uOwnCz;
    varying vec3 vN, vP;
    void main(){
      /* aPos arrives as a normalised uint16, i.e. 0..1 across the mesh

// ===== shader 13 — 017-about-figure.js =====
s
       surface, because that is what the original did and what it looks like:
       the hole stays where you drew it while the head keeps turning under it. */
    uniform vec3 uRevPts[${REV_PTS}];
    uniform vec2 uRes;
    /* uRevMode:  1 the outer layer, which the reveal EATS
                  -1 the inner layer, which the reveal is the only thing that
                     shows — so it is invisible until the pointer opens a hole,
                     which is also what stops the parts of the mask that stick
                     out past the face from hanging there permanently. No
                     amount of scaling could contain them; not drawing them
                     unless they have been revealed does it exactly.
                   0 no reveal · one opaque layer, every other page */
    uniform float uHeadOpacity, uFresnel, uFresnelPow, uRevGlow, uRevEdge, uSkullGlow;
    uniform float uFlatten, uFlatLevel;
    uniform vec3 uRevTint;
    uniform float uRevMode, uRevRadius, uRevSoft, uRevMax,
                  uRevWarp, uRevWarpScale, uRevWarpSpeed, uRevTime;

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float vnoiseR(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
                 mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
    }

    float revealAt(){
      if (abs(uRevMode) < 0.5) return 0.0;
      vec2 uv = gl_FragCoord.xy / max(uRes.y, 1.0);   // heights on both axes,
                                                      // so the hole is round
      /* Warp the LOOKUP, not the result. Deforming where the brush is measured
         from bends the whole hole — including its interior — the way a fluid
         does; deforming the result afterwards only ever wobbles the rim. */
      if (uRevWarp > 0.0001){
        float n1 = vnoiseR(uv * uRevWarpScale + vec2(0.0, uRevTime * uRevWarpSpeed));
        float n2 = vnoiseR(uv * uRevWarpScale + vec2(5.2, uRevTime * uRevWarpSpeed + 1.3));
        uv += (vec2(n1, n2) - 0.5) * uRevWarp * uRevRadius * 2.0;
      }
      float r = 0.0;
      for (int i = 0; i < ${REV_PTS}; i++){
        if (uRevPts[i].z <= 0.0) continue;
        vec2 c = vec2(uRevPts[i].x * uRes.x / max(uRes.y, 1.0), uRevPts[i].y);
        float d = length(uv - c) / max(uRevRadius, 1e-4);
        /* Gaussian, not a hard disc: strokes have to ADD where they overlap
           so a slow drag opens a wider hole than a flick, and a soft falloff
           is what lets them sum without banding at every join. */
        r += uRevPts[i].z * exp(-d * d * mix(6.0, 1.6, clamp(uRevSoft, 0.0, 1.0)));
      }
      return clamp(r, 0.0, 1.0) * clamp(uRevMax, 0.0, 1.0);
    }

    void main(){
      vec3 n = normalize(vN);
      float d = max(dot(n, normalize(uLight)), 0.0);
      vec3 v = normalize(-vP);
      float r = pow(1.0 - max(dot(n, v), 0.0), 2.5);
      float s = uAmbient + uDiffuse * d + uRim * r;
      s *= uTone;
      /* FLAT WHITE. Everything above reads the model

// ===== shader 14 — 024-about-figure.js =====

    attribute vec3 aPos;
    attribute vec3 aNrm;
    uniform mat4 uProj, uView, uModel;
    uniform mat3 uNormal;
    uniform vec3 uQMin, uQSpan;
    uniform float uBreath, uBreathT, uBreathPhase;
    uniform float uSpinOwn, uOwnCx, uOwnCz;
    varying vec3 vN, vP;
    void main(){
      /* aPos arrives as a normalised uint16, i.e. 0..1 across the mesh

// ===== shader 15 — 024-about-figure.js =====
s
       surface, because that is what the original did and what it looks like:
       the hole stays where you drew it while the head keeps turning under it. */
    uniform vec3 uRevPts[${REV_PTS}];
    uniform vec2 uRes;
    /* uRevMode:  1 the outer layer, which the reveal EATS
                  -1 the inner layer, which the reveal is the only thing that
                     shows — so it is invisible until the pointer opens a hole,
                     which is also what stops the parts of the mask that stick
                     out past the face from hanging there permanently. No
                     amount of scaling could contain them; not drawing them
                     unless they have been revealed does it exactly.
                   0 no reveal · one opaque layer, every other page */
    uniform float uHeadOpacity, uFresnel, uFresnelPow, uRevGlow, uRevEdge, uSkullGlow;
    uniform float uFlatten, uFlatLevel;
    uniform vec3 uRevTint;
    uniform float uRevMode, uRevRadius, uRevSoft, uRevMax,
                  uRevWarp, uRevWarpScale, uRevWarpSpeed, uRevTime;

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float vnoiseR(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
                 mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
    }

    float revealAt(){
      if (abs(uRevMode) < 0.5) return 0.0;
      vec2 uv = gl_FragCoord.xy / max(uRes.y, 1.0);   // heights on both axes,
                                                      // so the hole is round
      /* Warp the LOOKUP, not the result. Deforming where the brush is measured
         from bends the whole hole — including its interior — the way a fluid
         does; deforming the result afterwards only ever wobbles the rim. */
      if (uRevWarp > 0.0001){
        float n1 = vnoiseR(uv * uRevWarpScale + vec2(0.0, uRevTime * uRevWarpSpeed));
        float n2 = vnoiseR(uv * uRevWarpScale + vec2(5.2, uRevTime * uRevWarpSpeed + 1.3));
        uv += (vec2(n1, n2) - 0.5) * uRevWarp * uRevRadius * 2.0;
      }
      float r = 0.0;
      for (int i = 0; i < ${REV_PTS}; i++){
        if (uRevPts[i].z <= 0.0) continue;
        vec2 c = vec2(uRevPts[i].x * uRes.x / max(uRes.y, 1.0), uRevPts[i].y);
        float d = length(uv - c) / max(uRevRadius, 1e-4);
        /* Gaussian, not a hard disc: strokes have to ADD where they overlap
           so a slow drag opens a wider hole than a flick, and a soft falloff
           is what lets them sum without banding at every join. */
        r += uRevPts[i].z * exp(-d * d * mix(6.0, 1.6, clamp(uRevSoft, 0.0, 1.0)));
      }
      return clamp(r, 0.0, 1.0) * clamp(uRevMax, 0.0, 1.0);
    }

    void main(){
      vec3 n = normalize(vN);
      float d = max(dot(n, normalize(uLight)), 0.0);
      vec3 v = normalize(-vP);
      float r = pow(1.0 - max(dot(n, v), 0.0), 2.5);
      float s = uAmbient + uDiffuse * d + uRim * r;
      s *= uTone;
      /* FLAT WHITE. Everything above reads the model

// ===== shader 16 — 024-about-xray.js =====

    precision mediump float;
    varying vec3 vN, vP;
    uniform vec3 uLight, uTint;
    uniform float uAmbient, uDiffuse, uRim, uTone, uGrain, uSeed;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    void main(){
      vec3 n = normalize(vN);
      float d = max(dot(n, normalize(uLight)), 0.0);
      vec3 v = normalize(-vP);
      float r = pow(1.0 - max(dot(n, v), 0.0), 2.5);
      float s = (uAmbient + uDiffuse * d + uRim * r) * uTone;
      vec2 sp = gl_FragCoord.xy + uSeed;
      vec3 noise = vec3(hash(sp), hash(sp + 17.3), hash(sp + 41.7)) - 0.5;
      gl_FragColor = vec4(clamp(vec3(s) * uTint + noise * uGrain, 0.0, 1.0), 1.0);
    }

// ===== shader 17 — 024-about-xray.js =====

    varying vec3 vN, vP;
    void main(){
      vec4 wp = modelViewMatrix * vec4(position, 1.0);
      vP = wp.xyz;
      vN = normalMatrix * normal;
      gl_Position = projectionMatrix * wp;
    }

// ===== shader 18 — 024-about-xray.js =====

    precision mediump float;
    varying vec3 vN, vP;
    uniform vec3 uTint;
    uniform float uPower, uGain, uCore;
    void main(){
      vec3 n = normalize(vN);
      vec3 v = normalize(-vP);
      float f = pow(1.0 - abs(dot(n, v)), uPower);
      float s = uCore + uGain * f;
      gl_FragColor = vec4(clamp(vec3(s) * uTint, 0.0, 1.0), 1.0);
    }

// ===== shader 19 — 024-about-xray.js =====

    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }

// ===== shader 20 — 024-about-xray.js =====

    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uPrev;
    uniform vec2 uFrom, uTo, uAspect;
    uniform float uRadius, uStrength, uDecay, uDisplace,
                  uNoiseScale, uNoiseSpeed, uTime, uDown;

    vec2 hash2(vec2 p){
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
    }
    float gnoise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
                     dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
                 mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                     dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 4; i++){ v += a * gnoise(p); p *= 2.02; a *= 0.5; }
      return v;
    }
    // distance to the segment ab, measured in aspect-corrected space so the
    // trail is round rather than an ellipse on a tall canvas
    float segDist(vec2 p, vec2 a, vec2 b){
      vec2 pa = (p - a) * uAspect, ba = (b - a) * uAspect;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
      return length(pa - ba * h);
    }

    void main(){
      // curl-ish offset: two FBM lookups a little apart give a divergence-free
      // enough field to push the trail around without it just smearing
      float n1 = fbm(vUv * uNoiseScale + vec2(0.0, uTime * uNoiseSpeed));
      float n2 = fbm(vUv * uNoiseScale + vec2(5.2, 1.3 - uTime * uNoiseSpeed));
      vec2 push = vec2(n2, -n1) * uDisplace;

      float prev = texture2D(uPrev, vUv - push).r * pow(uDecay, uDown);

      float d = segDist(vUv, uFrom, uTo);
      float splat = uStrength * exp(-(d * d) / max(uRadius * uRadius, 1e-6));

      gl_FragColor = vec4(clamp(prev + splat, 0.0, 1.0), 0.0, 0.0, 1.0);
    }

// ===== shader 21 — 024-about-xray.js =====

    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uBody, uSkel, uFluid;
    uniform float uEdge, uSoft, uBodyOpacity, uSkelOpacity;
    void main(){
      float f = texture2D(uFluid, vUv).r;
      float m = smoothstep(uEdge - uSoft, uEdge + uSoft, f);
      vec4 b = texture2D(uBody, vUv);
      vec4 s = texture2D(uSkel, vUv);

      /* Two weights rather than one mix. The body falls from 1 to
         uBodyOpacity across the reveal instead of to zero, so it can be left
         faintly present under the bone; the skeleton comes up to uSkelOpacity.
         Set them to 0 and 1 and this is mix(b, s, m) exactly. */
      float bw = mix(1.0, uBodyOpacity, m);
      float sw = m * uSkelOpacity;

      /* Alpha is weighted the same way, which is the point rather than a
         detail: where the body has been opened and there is no bone behind it,
         the result is transparent and you see the page through the hole. That
         is what makes it read as looking THROUGH someone. */
      gl_FragColor = vec4(clamp(b.rgb * bw + s.rgb * sw, 0.0, 1.0),
                          clamp(b.a * bw + s.a * sw, 0.0, 1.0));
    }

// ===== shader 22 — 024-about-xray.js =====

    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uSrc;
    uniform float uThreshold, uKnee;
    void main(){
      vec4 c = texture2D(uSrc, vUv);
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      // soft knee: nothing below the threshold, easing in over uKnee above it
      float w = smoothstep(uThreshold, uThreshold + max(uKnee, 1e-4), l);
      gl_FragColor = vec4(c.rgb * w, 1.0);
    }

// ===== shader 23 — 024-about-xray.js =====

    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uSrc;
    uniform vec2 uDir;          // texel-sized step, already scaled by radius
    void main(){
      // 9-tap Gaussian, weights from the binomial row
      float w[5];
      w[0] = 0.2270270270; w[1] = 0.1945945946; w[2] = 0.1216216216;
      w[3] = 0.0540540541; w[4] = 0.0162162162;
      vec3 c = texture2D(uSrc, vUv).rgb * w[0];
      for (int i = 1; i < 5; i++){
        vec2 o = uDir * float(i);
        c += texture2D(uSrc, vUv + o).rgb * w[i];
        c += texture2D(uSrc, vUv - o).rgb * w[i];
      }
      gl_FragColor = vec4(c, 1.0);
    }

// ===== shader 24 — 024-about-xray.js =====

    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uSrc, uBloom;
    uniform float uIntensity;
    uniform float uCrt, uScanCount, uScanDepth, uAberration,
                  uCurvature, uVignette, uContrast, uSaturation;

    void main(){
      vec2 uv = vUv;

      /* Barrel distortion first, because everything below samples through it.
         Centred on 0.5 and pushed out by the square of the distance, which is
         the cheap approximation of a curved tube. */
      if (uCrt > 0.5 && uCurvature > 0.0){
        vec2 d = uv - 0.5;
        uv = 0.5 + d * (1.0 + uCurvature * dot(d, d) * 4.0);
        // outside the tube there is nothing, and clamping would smear the
        // edge pixels outward into a streak
        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0){
          gl_FragColor = vec4(0.0); return;
        }
      }

      vec4 c;
      if (uCrt > 0.5 && uAberration > 0.0){
        // the split grows with distance from centre, as a real lens does
        vec2 dir = (uv - 0.5) * uAberration;
        vec4 cr = texture2D(uSrc, uv + dir);
        vec4 cg = texture2D(uSrc, uv);
        vec4 cb = texture2D(uSrc, uv - dir);
        c = vec4(cr.r, cg.g, cb.b, max(max(cr.a, cg.a), cb.a));
      } else {
        c = texture2D(uSrc, uv);
      }
      vec3 b = texture2D(uBloom, uv).rgb * uIntensity;
      /* Added to colour but ALSO to alpha, or the glow spilling past the
         figure

// ===== shader 25 — 027-about-xray.js =====

    precision mediump float;
    varying vec3 vN, vP;
    uniform vec3 uLight, uTint;
    uniform float uAmbient, uDiffuse, uRim, uTone, uGrain, uSeed;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    void main(){
      vec3 n = normalize(vN);
      float d = max(dot(n, normalize(uLight)), 0.0);
      vec3 v = normalize(-vP);
      float r = pow(1.0 - max(dot(n, v), 0.0), 2.5);
      float s = (uAmbient + uDiffuse * d + uRim * r) * uTone;
      vec2 sp = gl_FragCoord.xy + uSeed;
      vec3 noise = vec3(hash(sp), hash(sp + 17.3), hash(sp + 41.7)) - 0.5;
      gl_FragColor = vec4(clamp(vec3(s) * uTint + noise * uGrain, 0.0, 1.0), 1.0);
    }

// ===== shader 26 — 027-about-xray.js =====

    varying vec3 vN, vP;
    void main(){
      vec4 wp = modelViewMatrix * vec4(position, 1.0);
      vP = wp.xyz;
      vN = normalMatrix * normal;
      gl_Position = projectionMatrix * wp;
    }

// ===== shader 27 — 027-about-xray.js =====

    precision mediump float;
    varying vec3 vN, vP;
    uniform vec3 uTint;
    uniform float uPower, uGain, uCore;
    void main(){
      vec3 n = normalize(vN);
      vec3 v = normalize(-vP);
      float f = pow(1.0 - abs(dot(n, v)), uPower);
      float s = uCore + uGain * f;
      gl_FragColor = vec4(clamp(vec3(s) * uTint, 0.0, 1.0), 1.0);
    }

// ===== shader 28 — 027-about-xray.js =====

    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }

// ===== shader 29 — 027-about-xray.js =====

    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uPrev;
    uniform vec2 uFrom, uTo, uAspect;
    uniform float uRadius, uStrength, uDecay, uDisplace,
                  uNoiseScale, uNoiseSpeed, uTime, uDown;

    vec2 hash2(vec2 p){
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
    }
    float gnoise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
                     dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
                 mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                     dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 4; i++){ v += a * gnoise(p); p *= 2.02; a *= 0.5; }
      return v;
    }
    // distance to the segment ab, measured in aspect-corrected space so the
    // trail is round rather than an ellipse on a tall canvas
    float segDist(vec2 p, vec2 a, vec2 b){
      vec2 pa = (p - a) * uAspect, ba = (b - a) * uAspect;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
      return length(pa - ba * h);
    }

    void main(){
      // curl-ish offset: two FBM lookups a little apart give a divergence-free
      // enough field to push the trail around without it just smearing
      float n1 = fbm(vUv * uNoiseScale + vec2(0.0, uTime * uNoiseSpeed));
      float n2 = fbm(vUv * uNoiseScale + vec2(5.2, 1.3 - uTime * uNoiseSpeed));
      vec2 push = vec2(n2, -n1) * uDisplace;

      float prev = texture2D(uPrev, vUv - push).r * pow(uDecay, uDown);

      float d = segDist(vUv, uFrom, uTo);
      float splat = uStrength * exp(-(d * d) / max(uRadius * uRadius, 1e-6));

      gl_FragColor = vec4(clamp(prev + splat, 0.0, 1.0), 0.0, 0.0, 1.0);
    }

// ===== shader 30 — 027-about-xray.js =====

    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uBody, uSkel, uFluid;
    uniform float uEdge, uSoft, uBodyOpacity, uSkelOpacity;
    void main(){
      float f = texture2D(uFluid, vUv).r;
      float m = smoothstep(uEdge - uSoft, uEdge + uSoft, f);
      vec4 b = texture2D(uBody, vUv);
      vec4 s = texture2D(uSkel, vUv);

      /* Two weights rather than one mix. The body falls from 1 to
         uBodyOpacity across the reveal instead of to zero, so it can be left
         faintly present under the bone; the skeleton comes up to uSkelOpacity.
         Set them to 0 and 1 and this is mix(b, s, m) exactly. */
      float bw = mix(1.0, uBodyOpacity, m);
      float sw = m * uSkelOpacity;

      /* Alpha is weighted the same way, which is the point rather than a
         detail: where the body has been opened and there is no bone behind it,
         the result is transparent and you see the page through the hole. That
         is what makes it read as looking THROUGH someone. */
      gl_FragColor = vec4(clamp(b.rgb * bw + s.rgb * sw, 0.0, 1.0),
                          clamp(b.a * bw + s.a * sw, 0.0, 1.0));
    }

// ===== shader 31 — 027-about-xray.js =====

    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uSrc;
    uniform float uThreshold, uKnee;
    void main(){
      vec4 c = texture2D(uSrc, vUv);
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      // soft knee: nothing below the threshold, easing in over uKnee above it
      float w = smoothstep(uThreshold, uThreshold + max(uKnee, 1e-4), l);
      gl_FragColor = vec4(c.rgb * w, 1.0);
    }

// ===== shader 32 — 027-about-xray.js =====

    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uSrc;
    uniform vec2 uDir;          // texel-sized step, already scaled by radius
    void main(){
      // 9-tap Gaussian, weights from the binomial row
      float w[5];
      w[0] = 0.2270270270; w[1] = 0.1945945946; w[2] = 0.1216216216;
      w[3] = 0.0540540541; w[4] = 0.0162162162;
      vec3 c = texture2D(uSrc, vUv).rgb * w[0];
      for (int i = 1; i < 5; i++){
        vec2 o = uDir * float(i);
        c += texture2D(uSrc, vUv + o).rgb * w[i];
        c += texture2D(uSrc, vUv - o).rgb * w[i];
      }
      gl_FragColor = vec4(c, 1.0);
    }

// ===== shader 33 — 027-about-xray.js =====

    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uSrc, uBloom;
    uniform float uIntensity;
    uniform float uCrt, uScanCount, uScanDepth, uAberration,
                  uCurvature, uVignette, uContrast, uSaturation;

    void main(){
      vec2 uv = vUv;

      /* Barrel distortion first, because everything below samples through it.
         Centred on 0.5 and pushed out by the square of the distance, which is
         the cheap approximation of a curved tube. */
      if (uCrt > 0.5 && uCurvature > 0.0){
        vec2 d = uv - 0.5;
        uv = 0.5 + d * (1.0 + uCurvature * dot(d, d) * 4.0);
        // outside the tube there is nothing, and clamping would smear the
        // edge pixels outward into a streak
        if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0){
          gl_FragColor = vec4(0.0); return;
        }
      }

      vec4 c;
      if (uCrt > 0.5 && uAberration > 0.0){
        // the split grows with distance from centre, as a real lens does
        vec2 dir = (uv - 0.5) * uAberration;
        vec4 cr = texture2D(uSrc, uv + dir);
        vec4 cg = texture2D(uSrc, uv);
        vec4 cb = texture2D(uSrc, uv - dir);
        c = vec4(cr.r, cg.g, cb.b, max(max(cr.a, cg.a), cb.a));
      } else {
        c = texture2D(uSrc, uv);
      }
      vec3 b = texture2D(uBloom, uv).rgb * uIntensity;
      /* Added to colour but ALSO to alpha, or the glow spilling past the
         figure

// ===== shader 34 — 029-err.js =====

    precision highp float;
    uniform vec2  uRes, uCam;
    uniform float uTime, uDpr;
    uniform sampler2D uCard, uBlobs;
    uniform vec3  uPaper;
    uniform float uBlobMix, uCardA, uGroundOver;
    uniform float uGlitch, uGlitchRate, uGlitchAmt;

    float rand2(vec2 p){ return fract(sin(dot(p, vec2(829.0, 483.0))) * 394.0); }

    void main(){
      vec2 f = gl_FragCoord.xy;
      /* The page

// ===== shader 35 — 029-err.js =====

    precision highp float;
    uniform sampler2D src;
    uniform vec2  resolution;
    uniform float time;
    uniform float uZoom, uBarrel, uSpray, uAber, uAberFix;
    uniform float uScan, uGrid, uVig, uDither, uSpread, uGain;

    vec4 readTex(vec2 uv){
      vec4 c = texture2D(src, uv);
      c.a *= smoothstep(0.5, 0.499, abs(uv.x - 0.5))
           * smoothstep(0.5, 0.499, abs(uv.y - 0.5));
      return c;
    }
    vec2 zoom(vec2 uv, float t){ return (uv - 0.5) * t + 0.5; }
    float rand(vec3 p){ return fract(sin(dot(p, vec3(829.0, 4839.0, 432.0))) * 39428.0); }

    void main(){
      vec2 uv = gl_FragCoord.xy / resolution;
      vec2 p = uv * 2.0 - 1.0;
      float aspect = resolution.x / max(resolution.y, 1.0);
      p.x *= aspect;

      /* THE ONE THING THE PEN CANNOT BE COPIED ON, and it is a matter of what
         it is applied TO rather than of taste. In the pen every term below is
         driven by l, the distance from the centre in units where 1 is halfway
         down the element — and it runs on IMAGES AND PARAGRAPHS, boxes a few
         hundred pixels across. Its corners reach l ~ 1.7 and the vignette
         (1.8 - l*l) goes negative there, which is exactly the point: each
         element ends up a glowing blob fading to nothing at its own edges.

         Applied to a whole 16:9 window that same arithmetic reaches l = 2.04
         in the corners and the vignette lands at -2.4. Rendered, it is a red
         porthole in the middle of a black screen with the design gone. I have
         the frame to prove it.

         So l is divided by its own value at the corner, which puts it back in
         the 0..1 range the pen

// ===== shader 36 — 031-err.js =====

    precision highp float;
    uniform vec2  uRes, uCam;
    uniform float uTime, uDpr;
    uniform sampler2D uCard, uBlobs;
    uniform vec3  uPaper;
    uniform float uBlobMix, uCardA, uGroundOver;
    uniform float uGlitch, uGlitchRate, uGlitchAmt;

    float rand2(vec2 p){ return fract(sin(dot(p, vec2(829.0, 483.0))) * 394.0); }

    void main(){
      vec2 f = gl_FragCoord.xy;
      /* The page

// ===== shader 37 — 031-err.js =====

    precision highp float;
    uniform sampler2D src;
    uniform vec2  resolution;
    uniform float time;
    uniform float uZoom, uBarrel, uSpray, uAber, uAberFix;
    uniform float uScan, uGrid, uVig, uDither, uSpread, uGain;

    vec4 readTex(vec2 uv){
      vec4 c = texture2D(src, uv);
      c.a *= smoothstep(0.5, 0.499, abs(uv.x - 0.5))
           * smoothstep(0.5, 0.499, abs(uv.y - 0.5));
      return c;
    }
    vec2 zoom(vec2 uv, float t){ return (uv - 0.5) * t + 0.5; }
    float rand(vec3 p){ return fract(sin(dot(p, vec3(829.0, 4839.0, 432.0))) * 39428.0); }

    void main(){
      vec2 uv = gl_FragCoord.xy / resolution;
      vec2 p = uv * 2.0 - 1.0;
      float aspect = resolution.x / max(resolution.y, 1.0);
      p.x *= aspect;

      /* THE ONE THING THE PEN CANNOT BE COPIED ON, and it is a matter of what
         it is applied TO rather than of taste. In the pen every term below is
         driven by l, the distance from the centre in units where 1 is halfway
         down the element — and it runs on IMAGES AND PARAGRAPHS, boxes a few
         hundred pixels across. Its corners reach l ~ 1.7 and the vignette
         (1.8 - l*l) goes negative there, which is exactly the point: each
         element ends up a glowing blob fading to nothing at its own edges.

         Applied to a whole 16:9 window that same arithmetic reaches l = 2.04
         in the corners and the vignette lands at -2.4. Rendered, it is a red
         porthole in the middle of a black screen with the design gone. I have
         the frame to prove it.

         So l is divided by its own value at the corner, which puts it back in
         the 0..1 range the pen

// ===== shader 38 — 031-transition-iris.js =====
s quintic fade, not the cheaper cubic — the
       second derivative is continuous, so a field this heavily warped does not
       show the grid it was built on. */
    float pnoise(vec3 p){
      vec3 i = floor(p), f = fract(p);
      vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      return mix(mix(mix(dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0)),
                         dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
                     mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
                         dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
                 mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
                         dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
                     mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
                         dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y), u.z);
    }

    void main(){
      /* 1. PIXELATE, before anything reads the coordinate. Everything below
            inherits the blocks, which is what makes the dissolve chunky rather
            than smooth-with-a-mosaic-on-top. */
      vec2 px = max(vec2(uPixel), vec2(1.0));
      vec2 frag = floor(gl_FragCoord.xy / px) * px + px * 0.5;
      vec2 uv = frag / uRes;

      // 2. centred and aspect-corrected, so the field is round
      vec2 c = (uv - 0.5) * vec2(uRes.x / max(uRes.y, 1.0), 1.0);

      // 3. warp, the third noise axis being time
      float n = pnoise(vec3(c * uNoiseScale, uTime * uNoiseSpeed));
      c += n * uNoiseAmp * 0.25;

      // 4. the original

// ===== shader 39 — 032-work-cursor.js =====

    attribute vec2 aPos;
    varying vec2 vUv;
    void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }

// ===== shader 40 — 032-work-cursor.js =====
s gradient instead of
       fighting it, drifting noise so it is alive, and a radial term for a
       field that thickens toward the middle or clears out of it. */
    float groundAt(vec2 q, vec2 uv){
      float d = uBgLevel + uBgTilt * (0.5 - uv.y) * 2.0;
      if (uBgNoise > 0.0001){
        float n = fbm(q * uBgNoiseScale +
                      vec2(uTime * uBgDrift, uTime * uBgDrift * 0.61), uDetail);
        d += (n - 0.5) * uBgNoise * 2.0;
      }
      if (abs(uBgRadial) > 0.0001){
        vec2 c = uv - 0.5;
        d += uBgRadial * (0.5 - length(vec2(c.x * uAspect, c.y)));
      }
      return clamp(d, 0.0, 1.0);
    }

    void main(){
      /* Circles have to be measured in a square space or they come out as
         ellipses on a wide window. Everything below is in screen HEIGHTS. */

    #ifdef FX_ASCII
      /* ---- CHARACTERS ------------------------------------------------------
         One character per cell, and the cell is measured in DEVICE pixels so a
         glyph is a glyph on any screen rather than getting fatter with the
         window.

         EVERYTHING is decided at the cell