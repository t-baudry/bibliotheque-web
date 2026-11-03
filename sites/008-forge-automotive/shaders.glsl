// ===== shader 1 — 006-1mv-tcvyyul86.js =====

attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}

// ===== shader 2 — 006-1mv-tcvyyul86.js =====

precision highp float;

varying vec2 v_uv;

uniform sampler2D u_image;
uniform sampler2D u_depth;
uniform vec2  u_res;        // canvas resolution (px)
uniform float u_imgAspect;  // image width / height
uniform vec2  u_mouse;      // smoothed light position, canvas UV (y-up)
uniform float u_parallaxStrength;
uniform float u_parallaxFocus;
uniform float u_lightRadius;
uniform float u_lightIntensity;
uniform float u_lightFalloff;
uniform float u_ambient;
uniform float u_depthInfluence;
uniform float u_floodLight;
uniform float u_spot;       // 0 = flood lit (resting), 1 = cursor point light

// background-size: cover mapping
vec2 coverUV(vec2 uv) {
  float canvasAspect = u_res.x / u_res.y;
  vec2 scale = (canvasAspect > u_imgAspect)
    ? vec2(1.0, u_imgAspect / canvasAspect)
    : vec2(canvasAspect / u_imgAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 uv = coverUV(v_uv);

  // ---------- depth parallax ----------
  // offset direction: near pixels slide with the cursor, far pixels stay put
  vec2 mouseOffset = (u_mouse - 0.5);
  float depthHere = texture2D(u_depth, vec2(uv.x, 1.0 - uv.y)).r;
  vec2 parallax = mouseOffset * u_parallaxStrength * (depthHere - u_parallaxFocus);
  vec2 puv = uv + parallax;

  // re-sample depth at the displaced position for lighting
  float depth = texture2D(u_depth, vec2(puv.x, 1.0 - puv.y)).r;
  vec3 color = texture2D(u_image, vec2(puv.x, 1.0 - puv.y)).rgb;

  // ---------- point light ----------
  // aspect-corrected distance so the glow is circular
  vec2 aspect = vec2(u_res.x / u_res.y, 1.0);
  float dist = distance(v_uv * aspect, u_mouse * aspect);

  float att = clamp(1.0 - dist / u_lightRadius, 0.0, 1.0);
  att = pow(att, u_lightFalloff);

  // depth influence: surfaces nearer the camera (brighter depth) catch more light
  float depthCatch = mix(1.0, smoothstep(0.0, 0.85, depth), u_depthInfluence);

  float spotLight = u_ambient + u_lightIntensity * att * depthCatch;

  // The whole frame is lit at rest and the light is drawn down into the hotspot
  // as the cursor takes over, so the two states cross-fade rather than cut.
  float light = mix(u_floodLight, spotLight, u_spot);
  color *= light;

  // Subtle tonemap to keep the hotspot from clipping harshly. Faded in with the
  // spot — there is nothing to clip at full flood, and skipping it there leaves
  // the image untouched, matching the plain <img> underneath the canvas.
  color = color / (1.0 + 0.15 * u_spot * color);

  gl_FragColor = vec4(color, 1.0);
}

// ===== shader 3 — 013-1z9v243o494gl.js =====

attribute vec2 aPosition;
uniform vec2 uResolution;
uniform vec2 uImageSize;
varying vec2 vUv;

void main() {
	vec2 uv = aPosition * 0.5 + 0.5;
	float scale = max(uResolution.x / uImageSize.x, uResolution.y / uImageSize.y);
	vec2 visible = uResolution / scale;
	vec2 offset = (uImageSize - visible) * 0.5;
	vUv = (uv * visible + offset) / uImageSize;
	gl_Position = vec4(aPosition, 0.0, 1.0);
}


// ===== shader 4 — 013-1z9v243o494gl.js =====

precision highp float;

uniform sampler2D uImage;
uniform sampler2D uMask;
uniform sampler2D uText;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform float uHasText;
uniform float uTime;
uniform vec2 uFlow;
uniform float uIntensity;
uniform float uScale;
uniform float uSplit;
uniform float uShowMask;
uniform float uSmokeOpacity;
uniform float uSmokeScale;
uniform float uSmokeSpeed;
uniform vec3 uSmokeColor;
varying vec2 vUv;

// NOTE • Fract-based hash rather than the usual sin() one: time scrolls the
// noise coordinates without bound, and sin() of a very large argument loses
// precision on the GPU and starts to show structure after a few minutes.
float hash(vec2 p) {
	vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
	q += dot(q, q.yzx + 33.33);
	return fract((q.x + q.y) * q.z);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));
	return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
	float value = 0.0;
	float amplitude = 0.5;
	for (int i = 0; i < 4; i++) {
		value += amplitude * noise(p);
		p = p * 2.05 + vec2(17.3, 9.1);
		amplitude *= 0.5;
	}
	return value;
}

// One sheet of smoke drifting along the flow. The coordinates are warped by a
// second noise read before the fbm — that warp is what makes wisps curl rather
// than sit as round blobs.
float smokeSheet(vec2 q, float scale, float drift, float time) {
	vec2 s = q * scale + vec2(-time * drift, 0.0);
	vec2 warp = vec2(
		noise(s * 1.7 + vec2(0.0, time * 0.35)),
		noise(s * 1.7 + vec2(5.2, -time * 0.3))
	) - 0.5;
	return fbm(s + warp * 0.8);
}

void main() {
	vec4 maps = texture2D(uMask, vUv);
	float mask = maps.r;
	float smokeMask = maps.g;

	// Flow frame: q.x runs along the flow, q.y across it.
	vec2 across = vec2(-uFlow.y, uFlow.x);
	vec2 q = vec2(dot(vUv, uFlow), dot(vUv, across)) * vec2(uScale * 0.66, uScale);
	float n1 = noise(q + vec2(-uTime * 1.6, 0.0));
	float n2 = noise(q * 2.3 + vec2(-uTime * 2.9, 0.7));
	vec2 offset = ((n1 - 0.5) * across + (n2 - 0.5) * 0.4 * uFlow) * uIntensity * mask;

	// Hot air refracts each wavelength a little differently — a touch of split
	// inside the haze sells it. Zero for a clean displacement.
	float r = texture2D(uImage, vUv + offset * (1.0 + uSplit)).r;
	float g = texture2D(uImage, vUv + offset).g;
	float b = texture2D(uImage, vUv + offset * (1.0 - uSplit)).b;

	vec3 color = vec3(r, g, b);

	// Text: drawn in screen space (see text.ts), so the image-space offset is
	// rescaled by how much of the image the screen shows. Sampled per channel at
	// the same split offsets as the photo — it is on the same plane, behind the gas.
	if (uHasText > 0.5) {
		float cover = max(uResolution.x / uImageSize.x, uResolution.y / uImageSize.y);
		vec2 screenOffset = offset * uImageSize * cover / uResolution;
		vec2 screenUv = gl_FragCoord.xy / uResolution;
		vec4 tr = texture2D(uText, screenUv + screenOffset * (1.0 + uSplit));
		vec4 tg = texture2D(uText, screenUv + screenOffset);
		vec4 tb = texture2D(uText, screenUv + screenOffset * (1.0 - uSplit));
		color = vec3(mix(color.r, tr.r, tr.a), mix(color.g, tg.g, tg.a), mix(color.b, tb.b, tb.a));
	}

	// Smoke: the visible part of the same gas, so it rides the same flow and is
	// sampled at the displaced UV so the haze wobbles it too. Two sheets at
	// different scales and speeds — their parallax is most of what reads as volume.
	if (smokeMask > 0.002) {
		vec2 displaced = vUv + offset;
		vec2 qs = vec2(dot(displaced, uFlow), dot(displaced, across));
		float t = uTime * uSmokeSpeed;
		float coarse = smokeSheet(qs, uSmokeScale, 0.55, t);
		float fine = smokeSheet(qs + vec2(3.1, 1.7), uSmokeScale * 2.4, 0.9, t);
		// Thresholded so there is clear air between tendrils, not a veil.
		float density = smoothstep(0.42, 0.78, coarse * 0.65 + fine * 0.35);
		// Emission breathes — puffs and thins rather than a constant stream.
		float breath = 0.7 + 0.3 * noise(vec2(t * 0.3, 1.3));
		density *= smokeMask * breath;
		// A little of the photo mixed in keeps it from looking pasted on.
		vec3 tint = mix(uSmokeColor, color, 0.15);
		color = mix(color, tint, density * uSmokeOpacity);
	}

	// Debug overlay: red = distortion map, green = smoke map.
	color = mix(color, vec3(maps.r, maps.g, 0.0), uShowMask);
	gl_FragColor = vec4(color, 1.0);
}


// ===== shader 5 — 022-41t5q7-2d5l5y.js =====

attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}

// ===== shader 6 — 022-41t5q7-2d5l5y.js =====

precision highp float;
varying vec2 uv;
uniform sampler2D colour;
uniform sampler2D depth;
uniform vec2 coverScale;
uniform vec2 offset;
float softenedDepth(vec2 point) {
  vec2 stepSize = vec2(${.008/g}, 0.008);
  float value = texture2D(depth, point).r * 4.0;
  value += texture2D(depth, point + vec2(stepSize.x, 0.0)).r * 2.0;
  value += texture2D(depth, point - vec2(stepSize.x, 0.0)).r * 2.0;
  value += texture2D(depth, point + vec2(0.0, stepSize.y)).r * 2.0;
  value += texture2D(depth, point - vec2(0.0, stepSize.y)).r * 2.0;
  value += texture2D(depth, point + stepSize).r;
  value += texture2D(depth, point - stepSize).r;
  value += texture2D(depth, point + vec2(stepSize.x, -stepSize.y)).r;
  value += texture2D(depth, point + vec2(-stepSize.x, stepSize.y)).r;
  return value / 16.0;
}
void main() {
  vec2 depthUV = (uv - 0.5) * coverScale + 0.5;
  float distance = softenedDepth(depthUV);
  vec2 displaced = clamp(uv + offset * (distance - 0.5), 0.001, 0.999);
  gl_FragColor = vec4(texture2D(colour, displaced).rgb, 1.0);
}

// ===== shader 7 — 027-1z9v243o494gl.js =====

attribute vec2 aPosition;
uniform vec2 uResolution;
uniform vec2 uImageSize;
varying vec2 vUv;

void main() {
	vec2 uv = aPosition * 0.5 + 0.5;
	float scale = max(uResolution.x / uImageSize.x, uResolution.y / uImageSize.y);
	vec2 visible = uResolution / scale;
	vec2 offset = (uImageSize - visible) * 0.5;
	vUv = (uv * visible + offset) / uImageSize;
	gl_Position = vec4(aPosition, 0.0, 1.0);
}


// ===== shader 8 — 027-1z9v243o494gl.js =====

precision highp float;

uniform sampler2D uImage;
uniform sampler2D uMask;
uniform sampler2D uText;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform float uHasText;
uniform float uTime;
uniform vec2 uFlow;
uniform float uIntensity;
uniform float uScale;
uniform float uSplit;
uniform float uShowMask;
uniform float uSmokeOpacity;
uniform float uSmokeScale;
uniform float uSmokeSpeed;
uniform vec3 uSmokeColor;
varying vec2 vUv;

// NOTE • Fract-based hash rather than the usual sin() one: time scrolls the
// noise coordinates without bound, and sin() of a very large argument loses
// precision on the GPU and starts to show structure after a few minutes.
float hash(vec2 p) {
	vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
	q += dot(q, q.yzx + 33.33);
	return fract((q.x + q.y) * q.z);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));
	return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
	float value = 0.0;
	float amplitude = 0.5;
	for (int i = 0; i < 4; i++) {
		value += amplitude * noise(p);
		p = p * 2.05 + vec2(17.3, 9.1);
		amplitude *= 0.5;
	}
	return value;
}

// One sheet of smoke drifting along the flow. The coordinates are warped by a
// second noise read before the fbm — that warp is what makes wisps curl rather
// than sit as round blobs.
float smokeSheet(vec2 q, float scale, float drift, float time) {
	vec2 s = q * scale + vec2(-time * drift, 0.0);
	vec2 warp = vec2(
		noise(s * 1.7 + vec2(0.0, time * 0.35)),
		noise(s * 1.7 + vec2(5.2, -time * 0.3))
	) - 0.5;
	return fbm(s + warp * 0.8);
}

void main() {
	vec4 maps = texture2D(uMask, vUv);
	float mask = maps.r;
	float smokeMask = maps.g;

	// Flow frame: q.x runs along the flow, q.y across it.
	vec2 across = vec2(-uFlow.y, uFlow.x);
	vec2 q = vec2(dot(vUv, uFlow), dot(vUv, across)) * vec2(uScale * 0.66, uScale);
	float n1 = noise(q + vec2(-uTime * 1.6, 0.0));
	float n2 = noise(q * 2.3 + vec2(-uTime * 2.9, 0.7));
	vec2 offset = ((n1 - 0.5) * across + (n2 - 0.5) * 0.4 * uFlow) * uIntensity * mask;

	// Hot air refracts each wavelength a little differently — a touch of split
	// inside the haze sells it. Zero for a clean displacement.
	float r = texture2D(uImage, vUv + offset * (1.0 + uSplit)).r;
	float g = texture2D(uImage, vUv + offset).g;
	float b = texture2D(uImage, vUv + offset * (1.0 - uSplit)).b;

	vec3 color = vec3(r, g, b);

	// Text: drawn in screen space (see text.ts), so the image-space offset is
	// rescaled by how much of the image the screen shows. Sampled per channel at
	// the same split offsets as the photo — it is on the same plane, behind the gas.
	if (uHasText > 0.5) {
		float cover = max(uResolution.x / uImageSize.x, uResolution.y / uImageSize.y);
		vec2 screenOffset = offset * uImageSize * cover / uResolution;
		vec2 screenUv = gl_FragCoord.xy / uResolution;
		vec4 tr = texture2D(uText, screenUv + screenOffset * (1.0 + uSplit));
		vec4 tg = texture2D(uText, screenUv + screenOffset);
		vec4 tb = texture2D(uText, screenUv + screenOffset * (1.0 - uSplit));
		color = vec3(mix(color.r, tr.r, tr.a), mix(color.g, tg.g, tg.a), mix(color.b, tb.b, tb.a));
	}

	// Smoke: the visible part of the same gas, so it rides the same flow and is
	// sampled at the displaced UV so the haze wobbles it too. Two sheets at
	// different scales and speeds — their parallax is most of what reads as volume.
	if (smokeMask > 0.002) {
		vec2 displaced = vUv + offset;
		vec2 qs = vec2(dot(displaced, uFlow), dot(displaced, across));
		float t = uTime * uSmokeSpeed;
		float coarse = smokeSheet(qs, uSmokeScale, 0.55, t);
		float fine = smokeSheet(qs + vec2(3.1, 1.7), uSmokeScale * 2.4, 0.9, t);
		// Thresholded so there is clear air between tendrils, not a veil.
		float density = smoothstep(0.42, 0.78, coarse * 0.65 + fine * 0.35);
		// Emission breathes — puffs and thins rather than a constant stream.
		float breath = 0.7 + 0.3 * noise(vec2(t * 0.3, 1.3));
		density *= smokeMask * breath;
		// A little of the photo mixed in keeps it from looking pasted on.
		vec3 tint = mix(uSmokeColor, color, 0.15);
		color = mix(color, tint, density * uSmokeOpacity);
	}

	// Debug overlay: red = distortion map, green = smoke map.
	color = mix(color, vec3(maps.r, maps.g, 0.0), uShowMask);
	gl_FragColor = vec4(color, 1.0);
}


// ===== shader 9 — 029-1mv-tcvyyul86.js =====

attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}

// ===== shader 10 — 029-1mv-tcvyyul86.js =====

precision highp float;

varying vec2 v_uv;

uniform sampler2D u_image;
uniform sampler2D u_depth;
uniform vec2  u_res;        // canvas resolution (px)
uniform float u_imgAspect;  // image width / height
uniform vec2  u_mouse;      // smoothed light position, canvas UV (y-up)
uniform float u_parallaxStrength;
uniform float u_parallaxFocus;
uniform float u_lightRadius;
uniform float u_lightIntensity;
uniform float u_lightFalloff;
uniform float u_ambient;
uniform float u_depthInfluence;
uniform float u_floodLight;
uniform float u_spot;       // 0 = flood lit (resting), 1 = cursor point light

// background-size: cover mapping
vec2 coverUV(vec2 uv) {
  float canvasAspect = u_res.x / u_res.y;
  vec2 scale = (canvasAspect > u_imgAspect)
    ? vec2(1.0, u_imgAspect / canvasAspect)
    : vec2(canvasAspect / u_imgAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 uv = coverUV(v_uv);

  // ---------- depth parallax ----------
  // offset direction: near pixels slide with the cursor, far pixels stay put
  vec2 mouseOffset = (u_mouse - 0.5);
  float depthHere = texture2D(u_depth, vec2(uv.x, 1.0 - uv.y)).r;
  vec2 parallax = mouseOffset * u_parallaxStrength * (depthHere - u_parallaxFocus);
  vec2 puv = uv + parallax;

  // re-sample depth at the displaced position for lighting
  float depth = texture2D(u_depth, vec2(puv.x, 1.0 - puv.y)).r;
  vec3 color = texture2D(u_image, vec2(puv.x, 1.0 - puv.y)).rgb;

  // ---------- point light ----------
  // aspect-corrected distance so the glow is circular
  vec2 aspect = vec2(u_res.x / u_res.y, 1.0);
  float dist = distance(v_uv * aspect, u_mouse * aspect);

  float att = clamp(1.0 - dist / u_lightRadius, 0.0, 1.0);
  att = pow(att, u_lightFalloff);

  // depth influence: surfaces nearer the camera (brighter depth) catch more light
  float depthCatch = mix(1.0, smoothstep(0.0, 0.85, depth), u_depthInfluence);

  float spotLight = u_ambient + u_lightIntensity * att * depthCatch;

  // The whole frame is lit at rest and the light is drawn down into the hotspot
  // as the cursor takes over, so the two states cross-fade rather than cut.
  float light = mix(u_floodLight, spotLight, u_spot);
  color *= light;

  // Subtle tonemap to keep the hotspot from clipping harshly. Faded in with the
  // spot — there is nothing to clip at full flood, and skipping it there leaves
  // the image untouched, matching the plain <img> underneath the canvas.
  color = color / (1.0 + 0.15 * u_spot * color);

  gl_FragColor = vec4(color, 1.0);
}

// ===== shader 11 — 030-41t5q7-2d5l5y.js =====

attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}

// ===== shader 12 — 030-41t5q7-2d5l5y.js =====

precision highp float;
varying vec2 uv;
uniform sampler2D colour;
uniform sampler2D depth;
uniform vec2 coverScale;
uniform vec2 offset;
float softenedDepth(vec2 point) {
  vec2 stepSize = vec2(${.008/g}, 0.008);
  float value = texture2D(depth, point).r * 4.0;
  value += texture2D(depth, point + vec2(stepSize.x, 0.0)).r * 2.0;
  value += texture2D(depth, point - vec2(stepSize.x, 0.0)).r * 2.0;
  value += texture2D(depth, point + vec2(0.0, stepSize.y)).r * 2.0;
  value += texture2D(depth, point - vec2(0.0, stepSize.y)).r * 2.0;
  value += texture2D(depth, point + stepSize).r;
  value += texture2D(depth, point - stepSize).r;
  value += texture2D(depth, point + vec2(stepSize.x, -stepSize.y)).r;
  value += texture2D(depth, point + vec2(-stepSize.x, stepSize.y)).r;
  return value / 16.0;
}
void main() {
  vec2 depthUV = (uv - 0.5) * coverScale + 0.5;
  float distance = softenedDepth(depthUV);
  vec2 displaced = clamp(uv + offset * (distance - 0.5), 0.001, 0.999);
  gl_FragColor = vec4(texture2D(colour, displaced).rgb, 1.0);
}