// ===== shader 1 — 010-1dr0w03dedt0c.js =====

attribute vec2 a_position;

varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}


// ===== shader 2 — 010-1dr0w03dedt0c.js =====

precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_mouse;
uniform vec2 u_velocity;
uniform float u_hover;
uniform float u_time;
uniform float u_idleRadius;
uniform float u_hoverRadius;
uniform float u_velocityGain;
uniform float u_ambientStrength;
uniform float u_ambientSpeed;
uniform vec2 u_ambientFrequency;
uniform float u_dragStrength;
uniform float u_dragVelocityStrength;
uniform float u_interactionDirection;
uniform float u_pressureStrength;
uniform float u_swirlStrength;
uniform float u_radialStrength;
uniform float u_radialFrequency;
uniform float u_radialSpeed;
uniform float u_uvClampInset;
uniform float u_edgeProtection;
uniform vec2 u_rippleOrigin0;
uniform vec2 u_rippleOrigin1;
uniform vec2 u_rippleOrigin2;
uniform vec2 u_rippleOrigin3;
uniform float u_rippleAge0;
uniform float u_rippleAge1;
uniform float u_rippleAge2;
uniform float u_rippleAge3;
uniform float u_rippleStrength;
uniform float u_hasActiveRipple;
uniform float u_interactionActive;

varying vec2 v_uv;

const float RIPPLE_DURATION = 2.6;
const float RIPPLE_SPEED = 0.3;
const float RIPPLE_WIDTH = 0.2;

vec2 getRippleDisplacement(vec2 uv, vec2 origin, float age) {
  if (age >= RIPPLE_DURATION) {
    return vec2(0.0);
  }

  vec2 rippleDelta = uv - origin;
  float rippleDist = length(rippleDelta);
  float rippleFront = age * RIPPLE_SPEED;
  float rippleEnvelope =
    1.0 - smoothstep(0.0, RIPPLE_WIDTH, abs(rippleDist - rippleFront));
  float rippleFade =
    1.0 - smoothstep(0.0, RIPPLE_DURATION, age);
  float rippleWave = sin((rippleDist - rippleFront) * 34.0);
  float originProtection = smoothstep(0.035, RIPPLE_WIDTH * 0.72, rippleDist);
  vec2 rippleDirection = rippleDelta / max(rippleDist, RIPPLE_WIDTH * 0.45);

  return
    rippleDirection *
    originProtection *
    rippleEnvelope *
    rippleFade *
    rippleWave;
}

void main() {
  vec2 uv = v_uv;
  vec2 ambient = vec2(
    sin((uv.y + u_time * u_ambientSpeed) * u_ambientFrequency.x),
    cos((uv.x - u_time * u_ambientSpeed * 0.72) * u_ambientFrequency.y)
  ) * u_ambientStrength;

  if (u_interactionActive < 0.5 && u_hasActiveRipple < 0.5) {
    vec2 sampleUv = clamp(
      uv + ambient,
      vec2(u_uvClampInset),
      vec2(1.0 - u_uvClampInset)
    );

    gl_FragColor = texture2D(u_texture, sampleUv);
    return;
  }

  vec2 delta = uv - u_mouse;
  float dist = length(delta);
  float radius = mix(u_idleRadius, u_hoverRadius, u_hover);
  float falloff = smoothstep(radius, 0.0, dist);
  float centerSoftness = smoothstep(0.0, radius * 0.18, dist);
  float edgeMask =
    smoothstep(0.0, u_edgeProtection, uv.x) *
    smoothstep(0.0, u_edgeProtection, uv.y) *
    smoothstep(0.0, u_edgeProtection, 1.0 - uv.x) *
    smoothstep(0.0, u_edgeProtection, 1.0 - uv.y);
  float speed = min(length(u_velocity) * u_velocityGain, 1.0);

  vec2 drag =
    u_velocity *
    u_interactionDirection *
    falloff *
    (u_dragStrength + speed * u_dragVelocityStrength) *
    u_hover;
  vec2 swirl =
    vec2(-delta.y, delta.x) *
    falloff *
    speed *
    u_swirlStrength *
    u_hover;
  vec2 pressure =
    delta *
    falloff *
    centerSoftness *
    (0.65 + speed * 0.8) *
    u_pressureStrength *
    u_hover;
  vec2 radial =
    delta *
    sin(dist * u_radialFrequency - u_time * u_radialSpeed) *
    falloff *
    centerSoftness *
    u_radialStrength *
    2.0 *
    u_hover;

  vec2 ripple = vec2(0.0);

  if (u_hasActiveRipple > 0.5) {
    ripple =
      (
        getRippleDisplacement(uv, u_rippleOrigin0, u_rippleAge0) +
        getRippleDisplacement(uv, u_rippleOrigin1, u_rippleAge1) +
        getRippleDisplacement(uv, u_rippleOrigin2, u_rippleAge2) +
        getRippleDisplacement(uv, u_rippleOrigin3, u_rippleAge3)
      ) * u_rippleStrength;
  }

  vec2 displacement =
    ambient + (drag + pressure + swirl + radial + ripple) * edgeMask;

  vec2 sampleUv = clamp(
    uv + displacement,
    vec2(u_uvClampInset),
    vec2(1.0 - u_uvClampInset)
  );

  gl_FragColor = texture2D(u_texture, sampleUv);
}


// ===== shader 3 — 022-2aurwutqq0g9s.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 4 — 023-43li4fx_9i9jt.js =====
#version 300 es

${this.getSignature()}

// extensions
${e.extensions}

// precision
${fo}

// uniforms
${e.uniforms}

// varyings
${e.varyings}

// attributes
${e.attributes}

// codes
${e.codes}

void main() {

	// vars
	${e.vars}

	// transforms
	${e.transforms}

	// flow
	${e.flow}

	gl_PointSize = 1.0;

}


// ===== shader 5 — 023-43li4fx_9i9jt.js =====
#version 300 es

${this.getSignature()}

// extensions
${e.extensions}

// precision
${fo}

// structs
${e.structs}

// uniforms
${e.uniforms}

// varyings
${e.varyings}

// codes
${e.codes}

void main() {

	// vars
	${e.vars}

	// flow
	${e.flow}

}
