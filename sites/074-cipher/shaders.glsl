// ===== shader 1 — 006-6Ypisith.js =====
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// ===== shader 2 — 006-6Ypisith.js =====
varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uGrayscale;
uniform float uZoom;
uniform float uBlack;

void main() {
  vec2 uv = (vUv - 0.5) / uZoom + 0.5;
  vec4 color = texture2D(uTexture, uv);
  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  vec3 finalColor = mix(color.rgb, vec3(gray), uGrayscale);
  vec3 c = mix(finalColor, vec3(0.0), uBlack);
  gl_FragColor = vec4(c, color.a * uOpacity);
}

// ===== shader 3 — 008-DCYoZBDY.js =====
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// ===== shader 4 — 008-DCYoZBDY.js =====
uniform vec2 uResolution;
uniform float uGridSpacing;
uniform float uPointSize;
uniform float uTime;
uniform float uOpacity;

uniform float uUvScale;
uniform float uFbm1Scale;
uniform float uFbm1TimeX;
uniform float uFbm1TimeY;
uniform float uFbm1Edge;
uniform float uFbm2Scale;
uniform float uFbm2Offset;
uniform float uFbm2TimeX;
uniform float uFbm2TimeY;
uniform float uFbm2Edge;
uniform float uInterference;
uniform float uScatterScale;
uniform float uScatterSpeed;
uniform float uThresholdBase;
uniform float uThresholdRange;
uniform vec3 uColor;
uniform float uFbm1Amp;
uniform float uFinalProgress;
uniform float uFbm1Freq;

uniform float uFbm2Amp;
uniform float uFbm2Freq;

uniform float uPsX;
uniform float uPsY;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p, vec2 timeOffset, float freqMul, float ampMul) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 2.0;
  for (int i = 0; i < 3; i++) {
    value += amplitude * snoise(p * frequency + timeOffset);
    frequency *= freqMul;
    amplitude *= ampMul;
  }
  return value;
}

void main() {
  vec2 px;
  px.x = gl_FragCoord.x - uResolution.x * 0.5;
  px.y = (uResolution.y - gl_FragCoord.y) - uResolution.y * 0.5;

  vec2 offset = mod(uResolution * 0.5, uGridSpacing);
  px += offset;

vec2 cell = mod(px, uGridSpacing);
  float cellHalf = uGridSpacing * 0.5;
  vec2 d = abs(cell - cellHalf);
  if (d.x > uPointSize * uPsX || d.y > uPointSize * uPsY) discard;

  vec2 centerDist = px - offset;
  float exclusionRadius = uGridSpacing * 5.0;
  if (dot(centerDist, centerDist) < exclusionRadius * exclusionRadius) discard;

  vec2 gridPos = px - cell;
  vec2 uv = gridPos * uUvScale;

  float n1 = fbm(uv * uFbm1Scale, vec2(uTime * uFbm1TimeX, uTime * uFbm1TimeY), uFbm1Amp, uFbm1Freq);
  float n2 = fbm(uv * uFbm2Scale + uFbm2Offset, vec2(uTime * uFbm2TimeX, uTime * uFbm2TimeY), uFbm2Amp, uFbm2Freq);

  float edge1 = 1.0 - smoothstep(0.0, uFbm1Edge, abs(n1));
  float edge2 = 1.0 - smoothstep(0.0, uFbm2Edge, abs(n2));
  float mask = max(edge1, edge2);
  mask += edge1 * edge2 * uInterference;
  mask = clamp(mask, 0.0, 1.0);

  float scatter = snoise(gridPos * uScatterScale + uTime * uScatterSpeed);
  float threshold = uThresholdBase + scatter * uThresholdRange;

  if (mask < threshold * uFinalProgress) discard;

  gl_FragColor = vec4(uColor, uOpacity);
}

// ===== shader 5 — 009-DaIaHkIU.js =====
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// ===== shader 6 — 009-DaIaHkIU.js =====
uniform vec2 uResolution;
uniform float uRx;
uniform float uRy;
uniform float uTilt;
uniform float uGridSpacing;
uniform float uPointSize;
uniform float uTime;
uniform float uTiltProgress;
uniform float uProgress;
uniform float uProgress2;
uniform float uProgress3;
uniform float uFill;
uniform float uOpacity;
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
vec2 px;
px.x = gl_FragCoord.x - uResolution.x * 0.5;
px.y = (uResolution.y - gl_FragCoord.y) - uResolution.y * 0.5;

  vec2 cell = mod(px, uGridSpacing);
  float cellHalf = uGridSpacing * 0.5;
  vec2 d = abs(cell - cellHalf);
  float pointHalf = uPointSize;
  if (d.x > pointHalf || d.y > pointHalf) discard;

  vec2 gridPos = px - cell;

float currentTilt = uTilt + (2. * uTiltProgress);
float cos_t = cos(-currentTilt);
float sin_t = sin(-currentTilt);

  float rx = (gridPos.x * cos_t - gridPos.y * sin_t) * (0.003 + uProgress);
  float ry = (gridPos.x * sin_t + gridPos.y * cos_t) * (0.003 + uProgress3);

  float ex = rx / (uRx * uResolution.x * 0.5) ;
  float ey = ry / (uRy * uResolution.y * 0.5) ;
  float ellipseDist = sqrt(ex * ex + ey * ey);

  if (ellipseDist < 1.0) {
    float n = (snoise(gridPos * 0.1  + (uTime * 1.- uFill)) + 1.0) * 3.8;
    float probability = exp(ellipseDist * 5.6 - 5.0) + n * (0.24 * (uProgress2 - 0.0) ) * ellipseDist;
    if (probability < 0.99 * uFill) discard;
  }

  gl_FragColor = vec4(0.0, 0.0, 0.0, uOpacity);
}

// ===== shader 7 — 010-CO3m5LEz.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 8 — 010-CO3m5LEz.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 9 — 010-CO3m5LEz.js =====

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
		

// ===== shader 10 — 010-CO3m5LEz.js =====
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
		

// ===== shader 11 — 010-CO3m5LEz.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 12 — 010-CO3m5LEz.js =====


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
	

// ===== shader 13 — 010-CO3m5LEz.js =====

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

// ===== shader 14 — 010-CO3m5LEz.js =====
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

// ===== shader 15 — 010-CO3m5LEz.js =====

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