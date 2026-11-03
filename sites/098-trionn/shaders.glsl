// ===== shader 1 — 009-0eq63v9bib54k.js =====

    precision highp float;
    uniform float T;
    uniform float M;
    uniform float H;
    uniform vec2  R;

    float hash(vec2 p){
      if (R.x < 768.0) {
        p = fract(p * vec2(0.3183099, 0.3678794));
        return fract(sin(p.x * 12.9898 + p.y * 78.233) * 43.75854);
      } else {
        p = fract(p * vec2(127.34, 311.7));
        p += dot(p, p + 19.19);
        return fract(p.x * p.y);
      }
    }
    float vnoise(vec2 p){
      vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
      if (R.x < 768.0) {
        i = mod(i, 100.0);
      }
      return mix(
        mix(hash(i),           hash(i+vec2(1,0)), u.x),
        mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v=0., a=.5;
      for(int i=0;i<3;i++){
        v += a * vnoise(p);
        p  = p * 2.1 + vec2(3.7, 8.3);
        a *= 0.5;
      }
      return v;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / R;
      float y = uv.y;
      float aspect = R.x / R.y;

      float vMask = 1.0 - smoothstep(0.0, 1.0, y);
      vMask = pow(vMask, 0.22);
      vMask *= 1.0 - smoothstep(0.95, 1.0, y);
      if(vMask < 0.002){ gl_FragColor = vec4(0.); return; }

      float rise  = T * 0.07;

      float LOOP  = 32.0;
      float mA    = mod(M, LOOP);
      float mB    = mod(M + LOOP * 0.5, LOOP);
      float blend = abs(mod(M, LOOP) / LOOP - 0.5) * 2.0;

      vec2 q, q2;
      if (R.x < 768.0) {
        float qY = (R.y - gl_FragCoord.y) / 88.88;
        q   = vec2(gl_FragCoord.x / 133.33, qY + rise);
        q2  = vec2(gl_FragCoord.x / 153.84, qY * 0.8444 + rise * 0.6);
      } else {
        q   = vec2(uv.x * aspect * 3.0, (1.0 - y) * 4.5 + rise);
        q2  = vec2(uv.x * aspect * 2.6, (1.0 - y) * 3.8 + rise * 0.6);
      }

      vec2 w1a = vec2(fbm(q2 + vec2(0.0, mA*0.15)), fbm(q2 + vec2(4.3, 2.7+mA*0.10)));
      float fA = fbm(q + 1.4*w1a + vec2(0.0, mA*0.06));

      vec2 w1b = vec2(fbm(q2 + vec2(7.3, mB*0.15)), fbm(q2 + vec2(1.8, 5.4+mB*0.10)));
      float fB = fbm(q + 1.4*w1b + vec2(3.7, mB*0.06));

      float f = mix(fA, fB, blend);

      f = max(0.0, f - 0.36);
      f = smoothstep(0.0, 0.36, f);
      f = pow(f, 0.85);

      // Pulse: visible lift without washing the whole footer (medium baseline fog)
      float hoverGlow = H * 0.42;
      f = clamp(f + H * 0.14, 0.0, 1.0);

      float baseFog = smoothstep(0.35, 0.0, y) * 0.14
                    + smoothstep(0.18, 0.0, y) * 0.11;

      float alpha = (f + baseFog + hoverGlow * vMask) * vMask * 0.94;
      alpha = clamp(alpha, 0.0, 0.82);

      vec3 charcoal = vec3(0.02, 0.03, 0.05);
      vec3 ashGrey  = vec3(0.12, 0.14, 0.18);
      vec3 lightGrey= vec3(0.28, 0.31, 0.36);
      vec3 hoverTint = vec3(0.35, 0.38, 0.44);
      vec3 col = mix(charcoal, ashGrey,   pow(f, 1.0));
          col  = mix(col,      lightGrey, pow(f, 2.2));
          col  = mix(col,      hoverTint, H * 0.55 * f);

      gl_FragColor = vec4(col * alpha, alpha);
    }
  

// ===== shader 2 — 019-15ky3h9upk1qm.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 3 — 019-15ky3h9upk1qm.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 4 — 022-0.924d2y-5_87.js =====

          uniform sampler2D map;
          uniform vec2 uSize;
          uniform float uRadius;
          varying vec2 vUv;
          void main(){
            vec2 pxPos = (vUv - 0.5) * uSize;
            vec2 halfSize = uSize * 0.5;
            vec2 q = abs(pxPos) - halfSize + uRadius;
            float dist = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - uRadius;
            float alpha = 1.0 - smoothstep(-0.5, 0.5, dist);
            if (alpha <= 0.0) discard;
            vec4 col = texture2D(map, vUv);
            gl_FragColor = vec4(col.rgb, col.a * alpha);
          }

// ===== shader 5 — 022-0.924d2y-5_87.js =====
varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }

// ===== shader 6 — 022-0.924d2y-5_87.js =====
varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }

// ===== shader 7 — 022-0.924d2y-5_87.js =====
uniform sampler2D map; varying vec2 vUv; void main(){ vec2 uv=vUv; if(gl_FrontFacing) uv.x=1.0-uv.x; gl_FragColor=texture2D(map,uv); }

// ===== shader 8 — 024-0579sn.qr398q.js =====

attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}

// ===== shader 9 — 024-0579sn.qr398q.js =====

precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform sampler2D uImage;
uniform sampler2D uDepth;
uniform vec2 uImageScale;
uniform vec2 uMouseEase;
uniform float uTime;
uniform float uHover;

vec2 containUv(vec2 uv, vec2 viewport, vec2 image) {
  float vr = viewport.x / viewport.y;
  float ir = image.x / image.y;
  vec2 scale = vec2(1.0);
  if (vr > ir) scale.x = ir / vr; else scale.y = vr / ir;
  return (uv - 0.5) / scale + 0.5;
}

void main() {
  vec2 contained = containUv(vUv, uResolution, uImageScale);
  bool outside = contained.x < 0.0 || contained.x > 1.0 || contained.y < 0.0 || contained.y > 1.0;
  vec3 bg = vec3(1.0);
  if (outside) { gl_FragColor = vec4(bg, 1.0); return; }
  vec2 mouse = (uMouseEase - 0.5) * vec2(2.0, -2.0);
  float depth = texture2D(uDepth, contained).r;
  float breathing = sin(uTime * 0.0012) * 0.5 + 0.5;
  float amount = (0.03 + 0.012 * breathing) * uHover;
  vec2 disp = mouse * depth * amount;
  vec2 uv = contained - disp;
  float r = texture2D(uImage, uv + disp * 0.16).r;
  float g = texture2D(uImage, uv).g;
  float b = texture2D(uImage, uv - disp * 0.16).b;
  float a = texture2D(uImage, uv).a;
  vec3 color = mix(bg, vec3(r,g,b), a);
  gl_FragColor = vec4(color, 1.0);
}