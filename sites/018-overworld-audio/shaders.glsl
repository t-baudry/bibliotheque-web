// ===== shader 1 — 004-B5B1E9Dr.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 004-B5B1E9Dr.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 004-B5B1E9Dr.js =====

			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		

// ===== shader 4 — 004-B5B1E9Dr.js =====
 axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		

// ===== shader 5 — 004-B5B1E9Dr.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 6 — 004-B5B1E9Dr.js =====


		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	

// ===== shader 7 — 004-B5B1E9Dr.js =====

			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}

// ===== shader 8 — 004-B5B1E9Dr.js =====
uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}

// ===== shader 9 — 004-B5B1E9Dr.js =====

uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}

// ===== shader 10 — 004-B5B1E9Dr.js =====

precision mediump float;
uniform sampler2D tMap;
uniform vec2 uResolution;
in vec2 v_rgbNW;
in vec2 v_rgbNE;
in vec2 v_rgbSW;
in vec2 v_rgbSE;
in vec2 v_rgbM;
in vec2 vUv;
out vec4 FragColor;
#ifndef FXAA_REDUCE_MIN
    #define FXAA_REDUCE_MIN   (1.0/ 128.0)
#endif
#ifndef FXAA_REDUCE_MUL
    #define FXAA_REDUCE_MUL   (1.0 / 8.0)
#endif
#ifndef FXAA_SPAN_MAX
    #define FXAA_SPAN_MAX     8.0
#endif
vec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution,
            vec2 v_rgbNW, vec2 v_rgbNE,
            vec2 v_rgbSW, vec2 v_rgbSE,
            vec2 v_rgbM) {
    vec4 color;
    mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);
    vec3 rgbNW = texture(tex, v_rgbNW).xyz;
    vec3 rgbNE = texture(tex, v_rgbNE).xyz;
    vec3 rgbSW = texture(tex, v_rgbSW).xyz;
    vec3 rgbSE = texture(tex, v_rgbSE).xyz;
    vec4 texColor = texture(tex, v_rgbM);
    vec3 rgbM  = texColor.xyz;
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));
    mediump vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));
    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
              dir * rcpDirMin)) * inverseVP;
    vec3 rgbA = 0.5 * (
        texture(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +
        texture(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
        texture(tex, fragCoord * inverseVP + dir * -0.5).xyz +
        texture(tex, fragCoord * inverseVP + dir * 0.5).xyz);
    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax)) {
        color = vec4(rgbA, texColor.a);
    } else {
        color = vec4(rgbB, texColor.a);
    }
    return color;
}
void main() {
    FragColor = fxaa(tMap, vUv * uResolution, uResolution, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
}


// ===== shader 11 — 004-B5B1E9Dr.js =====

precision mediump float;
in vec3 position;
in vec2 uv;
uniform vec2 uResolution;
out vec2 v_rgbNW;
out vec2 v_rgbNE;
out vec2 v_rgbSW;
out vec2 v_rgbSE;
out vec2 v_rgbM;
out vec2 vUv;
void main() {
    vUv = uv;
    vec2 fragCoord = uv * uResolution;
    vec2 inverseVP = 1.0 / uResolution.xy;
    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;
    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;
    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;
    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;
    v_rgbM = vec2(fragCoord * inverseVP);
    gl_Position = vec4(position, 1.0);
}


// ===== shader 12 — 004-B5B1E9Dr.js =====

precision mediump float;
uniform sampler2D tMap;
uniform float uThreshold;
uniform float uSmoothing;
in vec2 vUv;
out vec4 FragColor;
void main() {
    vec4 texel = texture(tMap, vUv);
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float v = dot(texel.xyz, luma);
    float alpha = smoothstep(uThreshold, uThreshold + uSmoothing, v);
    FragColor = mix(vec4(0), texel, alpha);
}


// ===== shader 13 — 004-B5B1E9Dr.js =====

in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}


// ===== shader 14 — 004-B5B1E9Dr.js =====

precision mediump float;
uniform sampler2D tMap;
uniform vec2 uDirection;
uniform vec2 uResolution;
in vec2 vUv;
out vec4 FragColor;
float gaussianPdf(float x, float sigma) {
    return 0.39894 * exp(-0.5 * x * x / (sigma * sigma)) / sigma;
}
vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    vec2 invSize = 1.0 / resolution;
    float fSigma = float(SIGMA);
    float weightSum = gaussianPdf(0.0, fSigma);
    vec3 diffuseSum = texture(image, uv).rgb * weightSum;
    for (int i = 1; i < KERNEL_RADIUS; i++) {
        float x = float(i);
        float w = gaussianPdf(x, fSigma);
        vec2 uvOffset = direction * invSize * x;
        vec3 sample1 = texture(image, uv + uvOffset).rgb;
        vec3 sample2 = texture(image, uv - uvOffset).rgb;
        diffuseSum += (sample1 + sample2) * w;
        weightSum += 2.0 * w;
    }
    return vec4(diffuseSum / weightSum, 1.0);
}
void main() {
    FragColor = blur(tMap, vUv, uResolution, uDirection);
}


// ===== shader 15 — 004-B5B1E9Dr.js =====

precision mediump float;
in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}


// ===== shader 16 — 004-B5B1E9Dr.js =====

precision highp float;

${EZ}

uniform sampler2D tMap;
uniform float uBluriness;
uniform vec2 uDirection;
uniform vec2 uResolution;
in vec2 vUv;
out vec4 FragColor;

void main() {
  FragColor = blur(tMap, vUv, uResolution, uBluriness * uDirection);
}


// ===== shader 17 — 004-B5B1E9Dr.js =====

in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}


// ===== shader 18 — 004-B5B1E9Dr.js =====

precision mediump float;

in vec3 position;
in vec2 uv;

uniform vec2 px;
uniform vec2 bounds;

out vec2 vUv;

void main() {
  vec3 pos = position;
  vec2 scale = 1.0 - bounds * 2.0;
  pos.xy = pos.xy * scale;
  vUv = vec2(0.5) + (pos.xy) * 0.5;
  gl_Position = vec4(pos, 1.0);
}


// ===== shader 19 — 004-B5B1E9Dr.js =====

precision mediump float;
in vec3 position;
in vec2 uv;

uniform vec2 px;

out vec2 vUv;

void main() {
  vec3 pos = position;
  vUv = 0.5 + pos.xy * 0.5;
  vec2 n = sign(pos.xy);
  pos.xy = abs(pos.xy) - px * 1.0;
  pos.xy *= n;
  gl_Position = vec4(pos, 1.0);
}


// ===== shader 20 — 004-B5B1E9Dr.js =====

precision mediump float;
uniform sampler2D velocity;
uniform float dt;
uniform vec2 fboSize;

in vec2 vUv;
out vec4 FragColor;

void main() {
  vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;

  vec2 spot_new = vUv;
  vec2 vel_old = texture(velocity, vUv).xy;
  // back trace
  vec2 spot_old = spot_new - vel_old * dt * ratio;
  vec2 vel_new1 = texture(velocity, spot_old).xy;

  // forward trace
  vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;

  vec2 error = spot_new2 - spot_new;

  vec2 spot_new3 = spot_new - error / 2.0;
  vec2 vel_2 = texture(velocity, spot_new3).xy;

  // back trace 2
  vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;

  vec2 newVel2 = texture(velocity, spot_old2).xy;
  FragColor = vec4(newVel2, 0.0, 0.0);
}


// ===== shader 21 — 004-B5B1E9Dr.js =====

precision mediump float;
uniform sampler2D velocity;
uniform float dt;
uniform vec2 px;

in vec2 vUv;
out vec4 FragColor;

void main() {
  float x0 = texture(velocity, vUv - vec2(px.x, 0)).x;
  float x1 = texture(velocity, vUv + vec2(px.x, 0)).x;
  float y0 = texture(velocity, vUv - vec2(0, px.y)).y;
  float y1 = texture(velocity, vUv + vec2(0, px.y)).y;
  float divergence = (x1 - x0 + y1 - y0) / 2.0;

  FragColor = vec4(divergence / dt);
}


// ===== shader 22 — 004-B5B1E9Dr.js =====

precision mediump float;
in vec3 position;
in vec2 uv;

uniform vec2 center;
uniform vec2 scale;
uniform vec2 px;

out vec2 vUv;

void main() {
  vec2 pos = position.xy * scale * 2.0 * px + center;
  vUv = uv;
  gl_Position = vec4(pos, 0.0, 1.0);
}


// ===== shader 23 — 004-B5B1E9Dr.js =====

precision mediump float;
uniform vec2 force;
uniform vec2 center;
uniform vec2 scale;
uniform vec2 px;

in vec2 vUv;
out vec4 FragColor;

void main() {
  vec2 circle = (vUv - 0.5) * 2.0;
  float d = 1.0 - min(length(circle), 1.0);
  d *= d;
  FragColor = vec4(force * d, 0, 1);
}


// ===== shader 24 — 004-B5B1E9Dr.js =====

precision mediump float;
uniform sampler2D pressure;
uniform sampler2D divergence;
uniform vec2 px;

in vec2 vUv;
out vec4 FragColor;

void main() {
    // poisson equation
  float p0 = texture(pressure, vUv + vec2(px.x * 2.0, 0)).r;
  float p1 = texture(pressure, vUv - vec2(px.x * 2.0, 0)).r;
  float p2 = texture(pressure, vUv + vec2(0, px.y * 2.0)).r;
  float p3 = texture(pressure, vUv - vec2(0, px.y * 2.0)).r;
  float div = texture(divergence, vUv).r;

  float newP = (p0 + p1 + p2 + p3) / 4.0 - div;

  FragColor = vec4(newP);
}


// ===== shader 25 — 004-B5B1E9Dr.js =====

precision mediump float;
uniform sampler2D pressure;
uniform sampler2D velocity;
uniform float dt;
uniform vec2 px;

in vec2 vUv;
out vec4 FragColor;

void main() {
  float step = 1.0;

  float p0 = texture(pressure, vUv + vec2(px.x * step, 0)).r;
  float p1 = texture(pressure, vUv - vec2(px.x * step, 0)).r;
  float p2 = texture(pressure, vUv + vec2(0, px.y * step)).r;
  float p3 = texture(pressure, vUv - vec2(0, px.y * step)).r;

  vec2 v = texture(velocity, vUv).xy;
  vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
  v = v - dt * gradP;
    // New velocity at uv point
  FragColor = vec4(v, 0.0, 1.0);
}


// ===== shader 26 — 004-B5B1E9Dr.js =====

precision mediump float;
uniform sampler2D velocity;
uniform sampler2D velocity_new;
uniform float v;
uniform vec2 px;
uniform float dt;

in vec2 vUv;
out vec4 FragColor;

void main() {
  vec2 old = texture(velocity, vUv).xy;
  vec2 new0 = texture(velocity_new, vUv + vec2(px.x * 2.0, 0)).xy;
  vec2 new1 = texture(velocity_new, vUv - vec2(px.x * 2.0, 0)).xy;
  vec2 new2 = texture(velocity_new, vUv + vec2(0, px.y * 2.0)).xy;
  vec2 new3 = texture(velocity_new, vUv - vec2(0, px.y * 2.0)).xy;

  vec2 new = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
  new /= 4.0 * (1.0 + v * dt);

  gl_FragColor = vec4(new, 0.0, 0.0);
}


// ===== shader 27 — 004-B5B1E9Dr.js =====

precision mediump float;

${GZ}

uniform sampler2D tBlur1;
uniform sampler2D tBlur2;
uniform sampler2D tBlur3;
uniform sampler2D tBlur4;
uniform sampler2D tBlur5;
uniform float uBloomFactors[NUM_MIPS];
in vec2 vUv;
out vec4 FragColor;
void main() {
  FragColor = uBloomFactors[0] * texture(tBlur1, vUv) +
    uBloomFactors[1] * texture(tBlur2, vUv) +
    uBloomFactors[2] * texture(tBlur3, vUv) +
    uBloomFactors[3] * texture(tBlur4, vUv) +
    uBloomFactors[4] * texture(tBlur5, vUv);
    #ifdef DITHERING
  FragColor.rgb = dither(FragColor.rgb);
    #endif
}


// ===== shader 28 — 004-B5B1E9Dr.js =====

in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}


// ===== shader 29 — 004-B5B1E9Dr.js =====

precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uNoiseTexture;
uniform vec2 uPosOld;
uniform vec2 uPosNew;
uniform vec2 uCoords;
uniform float uSpeed;
uniform float uSpeedFactor;
uniform float uPersistance;
uniform float uThickness;
uniform float uTime;
uniform float uDiffusionSize;
uniform float uDiffusion;
uniform float uNoiseIntensity;
uniform vec3 uColor;
varying vec2 vUv;

float circle(vec2 uv, vec2 center, float size) {
  float circle = length(uv - center);
  return 1. - smoothstep(0.0, size, circle);
}

float lineSegment(vec2 p, vec2 a, vec2 b, float thickness, float aspectRatio) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  float circle = length(pa - ba * h);
  return smoothstep(thickness, thickness * 0.5, circle);
}

vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction){
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(.013846153846) * direction;
  vec2 off2 = vec2(.032307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + vec2(off1 * resolution)) * 0.3162162162;
  color += texture2D(image, uv - vec2(off1 * resolution)) * 0.3162162162;
  color += texture2D(image, uv + vec2(off2 * resolution)) * 0.0702702703;
  color += texture2D(image, uv - vec2(off2 * resolution)) * 0.0702702703;
  return color;
}

void main() {
  vec4 noise1 = texture2D(uNoiseTexture, vUv * 4.0 + vec2(uTime * .1, .0));
  vec4 noise2 = texture2D(uNoiseTexture, vUv * 8.0 + vec2(.0, uTime * .1) + noise1.rg * .5);
  vec4 noise3 = texture2D(uNoiseTexture, vUv * 16.0 + vec2(-uTime*.05, 0.) + noise2.rg * .5);
  vec4 noise = (noise1 + noise2 * .5 + noise3 * .25 ) / 1.75;

  float dirX = (-.5 + noise.g) * noise.r * 20. * uNoiseIntensity;
  float dirY = (-.5 + noise.b) * noise.r * 20. * uNoiseIntensity;

  // advect the previous frame along the noise field so the trail smears organically
  vec4 oldTexture = texture2D(uTexture, vUv + vec2(dirX, dirY) * .001);
  float br = 1. - + (oldTexture.r + oldTexture.g + oldTexture.b)/3.0;
  vec4 col = oldTexture * (1.0 - uDiffusion);
  float p2 = (uDiffusion)/2.0;
  vec2 stretchUv = vUv * vec2(1.0, 1.0);
  col += blur(uTexture, stretchUv, vec2(uDiffusionSize * br), vec2(dirX, dirY) ) * p2;
  col += blur(uTexture, stretchUv, vec2(uDiffusionSize * br), vec2(dirY, dirX) ) * p2;
  // col += blur(uTexture, stretchUv, vec2(uDiffusionSize * br), vec2(-dirX, -dirY) ) * p2;
  // col += blur(uTexture, stretchUv, vec2(uDiffusionSize * br), vec2(-dirY, -dirX) ) * p2;
  col.rgb *= uPersistance;

  if (uSpeed > 0.0){
    float lineValue = 0.;
    float th = clamp( uThickness + uSpeed * .3, .0001, 1.) ;

    vec2 newUv = vUv;

    float ratio = uCoords.x / uCoords.y;

    newUv.y /= ratio;

    vec2 posOld = uPosOld;

    posOld.y /= ratio;
    
    // lineValue = lineSegment(newUv, uPosOld, uPosNew, th, ratio);
    lineValue = circle(newUv, posOld, th);

    // erode the stamp with the noise so the trail edges look grungy
    lineValue *= mix(1.0, clamp(noise.r * 2., 0., 1.), uNoiseIntensity);

    // fade the splat with mouse speed so the trail only appears while moving
    col.rgb = mix(col.rgb, uColor, lineValue * .05 * uSpeedFactor);
    col.rgb = clamp( col.rgb, vec3(0.), vec3(1.));
  }
 
  gl_FragColor = vec4(col);
}


// ===== shader 30 — 004-B5B1E9Dr.js =====

precision highp float;

uniform float uTime;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}


// ===== shader 31 — 004-B5B1E9Dr.js =====

precision highp float;

${q1}
${vP}
${yP}
${ig}
${bP}
${X1}

float luminance(vec3 rgb) {
  const vec3 W = vec3(0.2125, 0.7154, 0.0721);
  return dot(rgb, W);
}

uniform sampler2D tScene;
uniform sampler2D tBloom;
uniform sampler2D tFluid;
uniform sampler2D tBlur;

uniform bool boolBloom;
uniform bool boolFluid;
uniform bool boolLuminosity;
uniform bool boolFxaa;

float vignout = .55; // vignetting outer border
float vignin = 0.1; // vignetting inner border
float vignfade = 2.0; // f-stops till vignete fades

in vec2 vUv;
out vec4 FragColor;

void main() {
  vec4 fluid = texture(tFluid, vUv);
  vec2 uv = vUv + fluid.rg * -.15;
  vec4 mixed = rgbshift(tScene, uv, -1., .001);

  if(boolBloom) {
    vec4 bloom = rgbshift(tBloom, uv, -1.5, .02);
    float angle = length(uv + 0.5);
    float uBloomDistortion = 2.5;
    float amount = .001 * uBloomDistortion;

    mixed.rgb += bloom.rgb;
    mixed.rgb += rgbshift(tBloom, uv, angle, amount / .5).rgb;
  }


  mixed.rgb += length(fluid.xy) * .015;

  float vignetteF = vignette(uv.xy, vignin, vignout, vignfade, .25);

  FragColor = vec4(mixed.rgb, 1.);
}


// ===== shader 32 — 004-B5B1E9Dr.js =====

in vec3 position;
in vec2 uv;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
out vec2 vUv;
void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix * worldPosition;
  gl_Position = projectionMatrix * mvPosition;
}


// ===== shader 33 — 004-B5B1E9Dr.js =====

precision highp float;

in vec3 position;
in vec2 uv;

uniform vec2 texelSize;

out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;

void main () {
  vUv = uv;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);

  gl_Position = vec4(position, 1.0);
}


// ===== shader 34 — 004-B5B1E9Dr.js =====

precision mediump float;
precision mediump sampler2D;

uniform sampler2D uTexture;
uniform float value;

in highp vec2 vUv;

out vec4 FragColor;

void main () {
  FragColor = value * texture(uTexture, vUv);
}


// ===== shader 35 — 004-B5B1E9Dr.js =====

precision highp float;
precision highp sampler2D;

uniform sampler2D uTarget;
uniform float uAspect;
uniform vec3 color;
uniform vec2 point;
uniform float radius;

in vec2 vUv;

out vec4 FragColor;

void main () {
  vec2 p = vUv - point.xy;
  p.x *= uAspect;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture(uTarget, vUv).xyz;

  FragColor = vec4(base + splat, 1.0);
}


// ===== shader 36 — 004-B5B1E9Dr.js =====

precision highp float;
precision highp sampler2D;

uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;

in vec2 vUv;

out vec4 FragColor;

void main () {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;

  FragColor = dissipation * texture(uSource, coord);
  FragColor.a = 1.0;
}


// ===== shader 37 — 004-B5B1E9Dr.js =====

precision mediump float;
precision mediump sampler2D;

uniform sampler2D uVelocity;

in highp vec2 vUv;
in highp vec2 vL;
in highp vec2 vR;
in highp vec2 vT;
in highp vec2 vB;

out vec4 FragColor;

void main () {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  float div = 0.5 * (R - L + T - B);

  FragColor = vec4(div, 0.0, 0.0, 1.0);
}


// ===== shader 38 — 004-B5B1E9Dr.js =====

precision mediump float;
precision mediump sampler2D;

uniform sampler2D uVelocity;

in highp vec2 vUv;
in highp vec2 vL;
in highp vec2 vR;
in highp vec2 vT;
in highp vec2 vB;

out vec4 FragColor;

void main () {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  float vorticity = R - L - T + B;

  FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}


// ===== shader 39 — 004-B5B1E9Dr.js =====

precision highp float;
precision highp sampler2D;

uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;

out vec4 FragColor;

void main () {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy;

  FragColor = vec4(vel + force * dt, 0.0, 1.0);
}


// ===== shader 40 — 004-B5B1E9Dr.js =====

precision mediump float;
precision mediump sampler2D;

uniform sampler2D uPressure;
uniform sampler2D uDivergence;

in highp vec2 vUv;
in highp vec2 vL;
in highp vec2 vR;
in highp vec2 vT;
in highp vec2 vB;

out vec4 FragColor;

void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float C = texture(uPressure, vUv).x;
  float divergence = texture(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;

  FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
