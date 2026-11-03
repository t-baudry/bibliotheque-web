// ===== shader 1 — 006-C0u6vjcG.js =====
#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID & 1) * 4 - 1, (gl_VertexID & 2) * 2 - 1);
  gl_Position = vec4(p, 0.0, 1.0);
}

// ===== shader 2 — 006-C0u6vjcG.js =====
#version 300 es
precision highp float;
uniform sampler2D uMask;
uniform sampler2D uNoise;
uniform vec2 uRes;
uniform float uAspect;
uniform vec2 uLight;
uniform float uTime;
uniform float uReveal;
out vec4 outColor;

const int STEPS = 36;
const int TAPS = 5;
const float BAR = 0.28;
const float DENSITY = 26.0;

vec2 toUV(vec2 p) { return p / vec2(uAspect, 1.0) + 0.5; }

vec3 lightColor(float d) {
  return mix(vec3(1.0, 0.88, 0.72), vec3(1.0, 0.46, 0.16), smoothstep(0.12, 1.0, d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);
  vec4 m = texture(uMask, uv);
  vec2 blue = texelFetch(uNoise, ivec2(gl_FragCoord.xy) & 63, 0).rg;
  float jitter = blue.r;

  float rays = 0.0;
  float bare = 0.0;
  float weightSum = 0.0;
  for (int t = 0; t < TAPS; t++) {
    float ft = (float(t) + 0.5 + (blue.g - 0.5) * 0.6) / float(TAPS) - 0.5;
    vec2 s = uLight + vec2(0.0, ft * BAR);
    float w = 1.0 - abs(ft) * 1.2;
    vec2 d = s - p;
    float len = length(d);
    float thickness = 0.0;
    for (int i = 0; i < STEPS; i++) {
      float f = (float(i) + jitter) / float(STEPS);
      thickness += texture(uMask, toUV(p + d * f)).g;
    }
    thickness *= len / float(STEPS);
    float r = max(len - 0.03, 0.0);
    float fall = exp(-r * 1.8) / (1.0 + r * r * 24.0);
    bare += w * fall;
    rays += w * fall * exp(-thickness * DENSITY);
    weightSum += w;
  }
  rays /= weightSum;
  bare /= weightSum;
  float dist = length(uLight - p);

  vec3 col = vec3(0.004, 0.003, 0.003);
  col += lightColor(dist) * rays * 0.7;
  float halo = (1.0 - m.r) * m.b * 2.0;
  col += lightColor(dist) * halo * bare * 0.25;

  vec2 px = 1.0 / uRes;
  vec2 grad = vec2(
    texture(uMask, uv + vec2(px.x * 3.0, 0.0)).b - texture(uMask, uv - vec2(px.x * 3.0, 0.0)).b,
    texture(uMask, uv + vec2(0.0, px.y * 3.0)).b - texture(uMask, uv - vec2(0.0, px.y * 3.0)).b
  );
  float facing = 0.35 + 0.65 * clamp(dot(grad, normalize(uLight - p)) / (length(grad) + 0.02), 0.0, 1.0);
  float edge = 1.0 - m.g;
  float depth = 1.0 - smoothstep(0.5, 1.0, m.b);
  vec3 slab = vec3(0.007, 0.0055, 0.005);
  slab += lightColor(dist) * bare * (edge * 1.2 + depth * 0.25) * facing;
  slab += lightColor(dist) * bare * bare * 0.6;
  col = mix(col, slab, m.r);

  col *= uReveal;
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, vec3(lum), smoothstep(0.9, 2.6, lum) * 0.4);
  col = col / (1.0 + col * 0.8);
  col = pow(max(col, 0.0), vec3(1.0 / 2.2));
  vec2 v = (uv - 0.5) * vec2(1.05, 1.0);
  col *= 1.0 - 0.38 * smoothstep(0.35, 1.05, length(v));
  float grain = texelFetch(uNoise, (ivec2(gl_FragCoord.xy) + ivec2(uTime * 61.0, uTime * 37.0)) & 63, 0).g;
  col += (grain - 0.5) * 0.028;
  outColor = vec4(col, 1.0);
}

// ===== shader 3 — 006-q85zufTc.js =====
#version 300 es

${this.getSignature()}

// extensions
${e.extensions}

// precision
${c5}

// structs
${e.structs}

// uniforms
${e.uniforms}

// varyings
${e.varyings}

// attributes
${e.attributes}

// vars
${e.vars}

// codes
${e.codes}

void main() {

	// transforms
	${e.transforms}

	// flow
	${e.flow}

	gl_PointSize = 1.0;

}


// ===== shader 4 — 006-q85zufTc.js =====
#version 300 es

${this.getSignature()}

// extensions
${e.extensions}

// precision
${c5}

// structs
${e.structs}

// uniforms
${e.uniforms}

// varyings
${e.varyings}

// vars
${e.vars}

// codes
${e.codes}

void main() {

	// flow
	${e.flow}

}


// ===== shader 5 — 008-q85zufTc.js =====
#version 300 es

${this.getSignature()}

// extensions
${e.extensions}

// precision
${c5}

// structs
${e.structs}

// uniforms
${e.uniforms}

// varyings
${e.varyings}

// attributes
${e.attributes}

// vars
${e.vars}

// codes
${e.codes}

void main() {

	// transforms
	${e.transforms}

	// flow
	${e.flow}

	gl_PointSize = 1.0;

}


// ===== shader 6 — 008-q85zufTc.js =====
#version 300 es

${this.getSignature()}

// extensions
${e.extensions}

// precision
${c5}

// structs
${e.structs}

// uniforms
${e.uniforms}

// varyings
${e.varyings}

// vars
${e.vars}

// codes
${e.codes}

void main() {

	// flow
	${e.flow}

}


// ===== shader 7 — 009-q85zufTc.js =====
#version 300 es

${this.getSignature()}

// extensions
${e.extensions}

// precision
${c5}

// structs
${e.structs}

// uniforms
${e.uniforms}

// varyings
${e.varyings}

// attributes
${e.attributes}

// vars
${e.vars}

// codes
${e.codes}

void main() {

	// transforms
	${e.transforms}

	// flow
	${e.flow}

	gl_PointSize = 1.0;

}


// ===== shader 8 — 009-q85zufTc.js =====
#version 300 es

${this.getSignature()}

// extensions
${e.extensions}

// precision
${c5}

// structs
${e.structs}

// uniforms
${e.uniforms}

// varyings
${e.varyings}

// vars
${e.vars}

// codes
${e.codes}

void main() {

	// flow
	${e.flow}

}
