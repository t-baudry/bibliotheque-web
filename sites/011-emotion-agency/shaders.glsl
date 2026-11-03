// ===== shader 1 — 015-MGdOx5d6.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 015-MGdOx5d6.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 015-MGdOx5d6.js =====

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
		

// ===== shader 4 — 015-MGdOx5d6.js =====
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
		

// ===== shader 5 — 015-MGdOx5d6.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 6 — 015-MGdOx5d6.js =====


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
	

// ===== shader 7 — 015-MGdOx5d6.js =====

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

// ===== shader 8 — 015-MGdOx5d6.js =====
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

// ===== shader 9 — 015-MGdOx5d6.js =====

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

// ===== shader 10 — 015-MGdOx5d6.js =====
varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}

// ===== shader 11 — 015-MGdOx5d6.js =====
uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}

// ===== shader 12 — 015-MGdOx5d6.js =====
#ifdef USE_V_UV
  varying vec2 vUv;
#endif

#ifdef USE_OFFSETS
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
#endif

void main() {
  #ifdef USE_V_UV
    vUv = uv;
  #endif

  #ifdef USE_OFFSETS
    vL = uv - vec2(texelSize.x, 0.0);
    vR = uv + vec2(texelSize.x, 0.0);
    vT = uv + vec2(0.0, texelSize.y);
    vB = uv - vec2(0.0, texelSize.y);
  #endif

  gl_Position = vec4(position, 1.0);
}

// ===== shader 13 — 015-MGdOx5d6.js =====
precision highp float;

varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uClearValue;

void main() { gl_FragColor = uClearValue * texture2D(uTexture, vUv); }

// ===== shader 14 — 015-MGdOx5d6.js =====
precision highp float;

varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

uniform sampler2D uVelocity;

void main() {
    float L = texture2D(uVelocity, vL).y;

    float R = texture2D(uVelocity, vR).y;

    float T = texture2D(uVelocity, vT).x;

    float B = texture2D(uVelocity, vB).x;

    float vorticity = R - L - T + B;

    gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
}

// ===== shader 15 — 015-MGdOx5d6.js =====
precision highp float;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;

uniform sampler2D uVelocity;

void main() {
    float L = texture2D(uVelocity, vL).x;

    float R = texture2D(uVelocity, vR).x;

    float T = texture2D(uVelocity, vT).y;

    float B = texture2D(uVelocity, vB).y;

    vec2 C = texture2D(uVelocity, vUv).xy;

    if(vL.x < 0.0) {
        L = -C.x;
    }

    if(vR.x > 1.0) {
        R = -C.x;
    }

    if(vT.y > 1.0) {
        T = -C.y;
    }

    if(vB.y < 0.0) {
        B = -C.y;
    }

    float div = 0.5 * (R - L + T - B);

    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
}

// ===== shader 16 — 015-MGdOx5d6.js =====
precision highp float;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;

uniform sampler2D uPressure;
uniform sampler2D uVelocity;

void main() {
    float L = texture2D(uPressure, vL).x;

    float R = texture2D(uPressure, vR).x;

    float T = texture2D(uPressure, vT).x;

    float B = texture2D(uPressure, vB).x;

    vec2 velocity = texture2D(uVelocity, vUv).xy;

    velocity.xy -= vec2(R - L, T - B);

    gl_FragColor = vec4(velocity, 0.0, 1.0);
}

// ===== shader 17 — 015-MGdOx5d6.js =====
precision highp float;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;

uniform sampler2D uPressure;
uniform sampler2D uDivergence;

void main() {
    float L = texture2D(uPressure, vL).x;

    float R = texture2D(uPressure, vR).x;

    float T = texture2D(uPressure, vT).x;

    float B = texture2D(uPressure, vB).x;

    float C = texture2D(uPressure, vUv).x;

    float divergence = texture2D(uDivergence, vUv).x;

    float pressure = (L + R + B + T - divergence) * 0.25;

    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
}

// ===== shader 18 — 015-MGdOx5d6.js =====
precision highp float;

varying vec2 vUv;

uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 uColor;
uniform vec2 uPointer;
uniform float uRadius;

void main() {
    vec2 p = vUv - uPointer.xy;

    p.x *= aspectRatio;

    vec3 splat = exp(-dot(p, p) / uRadius) * uColor;

    vec3 base = texture2D(uTarget, vUv).xyz;

    gl_FragColor = vec4(base + splat, 1.0);
}

// ===== shader 19 — 015-MGdOx5d6.js =====
precision highp float;

varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float uDissipation;

void main() {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;

    gl_FragColor = uDissipation * texture2D(uSource, coord);

    gl_FragColor.a = 1.0;
}

// ===== shader 20 — 015-MGdOx5d6.js =====
precision highp float;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uCurlValue;
uniform float dt;

void main() {
    float L = texture2D(uCurl, vL).x;

    float R = texture2D(uCurl, vR).x;

    float T = texture2D(uCurl, vT).x;

    float B = texture2D(uCurl, vB).x;

    float C = texture2D(uCurl, vUv).x;

    vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L)) * 0.5;

    force /= length(force) + 1.;

    force *= uCurlValue * C;

    force.y *= -1.;

    vec2 vel = texture2D(uVelocity, vUv).xy;

    gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
}

// ===== shader 21 — 015-MGdOx5d6.js =====
uniform float uTime;
uniform vec3 uSkyColor;

uniform vec3 uCloudColor;
uniform vec3 uCloudShadow;
uniform float uCloudDensity;
uniform float uCloudSpeed;
uniform sampler2D tCloud;

uniform float uNight;

varying vec3 vWorldPosition;

const float PI  = 3.14159265359;
const float TAU = 6.28318530718;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec3 direction = normalize(vWorldPosition);

  
  vec3 skyBase = uSkyColor;

  
  float horizonGlow = 1.0 - smoothstep(0.0, 0.5, abs(direction.y));
  skyBase = mix(skyBase, skyBase * 1.12, horizonGlow * 0.25);

  
  
  
  vec3 violetHalo = vec3(0.45, 0.22, 0.72);
  float haloBand = horizonGlow * 0.10 + smoothstep(0.7, 0.0, abs(direction.y)) * 0.03;
  skyBase += violetHalo * haloBand * uNight;

  
  
  
  
  vec2 skyUV = vec2(
    atan(direction.z, direction.x) / TAU + 0.5,
    asin(clamp(direction.y, -1.0, 1.0)) / PI + 0.5
  );
  vec2 uv = skyUV;

  
  
  uv.x -= uTime * uCloudSpeed * 0.0025;

  float cloudNoise = texture2D(tCloud, uv).r;

  
  float heightMask = smoothstep(0.0, 0.4, direction.y) * smoothstep(0.95, 0.5, direction.y);

  
  float threshold = 0.55 - uCloudDensity * 0.25;
  float cloudMask = smoothstep(threshold, threshold + 0.15, cloudNoise) * heightMask;

  
  
  
  if (uNight > 0.0) {
    float skyMask = smoothstep(0.02, 0.25, direction.y);
    float cloudOcclude = 1.0 - cloudMask;

    
    
    
    vec2 starUV = skyUV * vec2(160.0, 80.0);
    vec2 cell = floor(starUV);
    vec2 frac = fract(starUV);
    float h = hash21(cell);
    vec2 starCenter = vec2(0.3 + 0.4 * fract(h * 7.0), 0.3 + 0.4 * fract(h * 11.0));
    float d = distance(frac, starCenter);
    float star = smoothstep(0.045, 0.0, d);
    
    star *= step(0.96, h);
    float twinkle = 0.55 + 0.45 * sin(uTime * (2.0 + h * 5.0) + h * 100.0);
    star *= twinkle * 0.85;
    vec3 starColor = vec3(0.95, 0.92, 1.0);
    skyBase = mix(skyBase, starColor, star * skyMask * cloudOcclude * uNight);

    
    
    
    vec3 moonDir = normalize(vec3(0.6, 0.22, 0.45));
    float align = clamp(dot(direction, moonDir), 0.0, 1.0);
    float moonDisc = smoothstep(0.9985, 0.99965, align);
    float moonHalo = clamp(pow(align, 90.0), 0.0, 1.0) * 0.28;
    vec3 moonColor = vec3(0.48, 0.20, 0.88);
    skyBase = mix(skyBase, moonColor, (moonDisc + moonHalo) * cloudOcclude * uNight);
  }

  
  vec3 cloudFinal = mix(uCloudShadow, uCloudColor, cloudNoise * 0.5 + 0.5);

  
  vec3 finalColor = mix(skyBase, cloudFinal, cloudMask * 0.65);

  gl_FragColor = vec4(finalColor, 1.0);
}

// ===== shader 22 — 015-MGdOx5d6.js =====
uniform float uCloudScale;
varying vec2 vUv;

const float PI  = 3.14159265359;
const float TAU = 6.28318530718;

float hash3(vec3 p) {
  ivec3 ip = ivec3(floor(p)) & 255;
  int n = ip.x + ip.y * 157 + ip.z * 113;
  n = (n << 13) ^ n;
  n = n * (n * n * 15731 + 789221) + 1376312589;
  return float(n & 0x7fffffff) / float(0x7fffffff);
}

float noise3D(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

  float n000 = hash3(i);
  float n100 = hash3(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash3(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash3(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash3(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash3(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash3(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash3(i + vec3(1.0, 1.0, 1.0));

  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);

  float nxy0 = mix(nx00, nx10, f.y);
  float nxy1 = mix(nx01, nx11, f.y);

  return mix(nxy0, nxy1, f.z);
}

float fbm3D(vec3 p) {
  float value = 0.5 * noise3D(p);
  p = p * 2.0 + vec3(1.7, 9.2, 3.1);
  value += 0.25 * noise3D(p);
  p = p * 2.0 + vec3(5.3, 2.8, 7.4);
  value += 0.125 * noise3D(p);
  p = p * 2.0 + vec3(3.1, 6.5, 4.9);
  value += 0.0625 * noise3D(p);
  return value / 0.9375;
}

void main() {
  
  
  float theta = (vUv.x - 0.5) * TAU;
  float phi   = (vUv.y - 0.5) * PI;
  float cp    = cos(phi);
  vec3 dir = vec3(cp * cos(theta), sin(phi), cp * sin(theta));

  float n = fbm3D(dir * uCloudScale);
  gl_FragColor = vec4(n, 0.0, 0.0, 1.0);
}

// ===== shader 23 — 015-MGdOx5d6.js =====

        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      

// ===== shader 24 — 015-MGdOx5d6.js =====
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// ===== shader 25 — 015-MGdOx5d6.js =====
uniform float time;
uniform float waveDuration;
uniform float waveStartTimes[4];
uniform float waveRadius;
uniform float planeSize;
uniform vec3 color;
uniform vec3 glowColor;

varying vec2 vUv;

float easeOutCubic(float t) {
  return 1.0 - pow(1.0 - t, 3.0);
}

float renderWave(float dist, float waveProgress) {
  if(waveProgress <= 0.0 || waveProgress >= 1.0)
    return 0.0;

  float smoothProgress = easeOutCubic(waveProgress);
  float currentRadius = smoothProgress * waveRadius;

  
  float ringWidth = 0.06 * (1.0 - smoothProgress * 0.5);
  float ringInner = smoothstep(currentRadius - ringWidth, currentRadius, dist);
  float ringOuter = 1.0 - smoothstep(currentRadius, currentRadius + ringWidth, dist);
  float ring = ringInner * ringOuter;

  
  float glowWidth = 0.4;
  float outerGlow = 1.0 - smoothstep(currentRadius, currentRadius + glowWidth, dist);
  outerGlow = pow(outerGlow, 3.0) * 0.15;

  
  float fade = 1.0 - smoothstep(0.1, 0.7, waveProgress);
  fade = pow(fade, 2.0);

  float alpha = (ring + outerGlow) * fade;
  alpha *= smoothstep(0.0, 0.03, waveProgress);

  return alpha;
}

void main() {
  vec2 center = vUv - 0.5;
  float dist = length(center) * planeSize;

  
  float totalAlpha = 0.0;
  for(int i = 0; i < 4; i++) {
    float waveTime = time - waveStartTimes[i];
    float waveProgress = clamp(waveTime / waveDuration, 0.0, 1.0);
    totalAlpha += renderWave(dist, waveProgress);
  }

  
  totalAlpha = min(totalAlpha, 0.6);

  vec3 finalColor = mix(color, glowColor, totalAlpha * 0.3);

  gl_FragColor = vec4(finalColor, totalAlpha);
}

// ===== shader 26 — 015-MGdOx5d6.js =====
uniform float time;
uniform float size;
uniform float pixelRatio;

attribute float aSpawnTime;
attribute float aLifetime;
attribute vec3 aVelocity;
attribute vec3 aSpawnPos;
attribute float aPhase;

varying float vAlpha;
varying float vAge;

void main() {
  float age = time - aSpawnTime;
  float progress = clamp(age / aLifetime, 0.0, 1.0);

  
  if(progress >= 1.0 || aSpawnTime < 0.0) {
    gl_Position = vec4(0.0, 0.0, -999.0, 1.0);
    gl_PointSize = 0.0;
    vAlpha = 0.0;
    return;
  }

  
  float decel = 1.0 - progress * 0.6;
  vec3 pos = aSpawnPos + aVelocity * age * decel;

  
  float swirlAngle = age * (2.0 + aPhase * 3.0);
  vec3 radial = normalize(pos + vec3(0.001));
  
  vec3 up = abs(radial.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 tangent = normalize(cross(radial, up));
  vec3 bitangent = cross(radial, tangent);
  float swirlRadius = (0.9 + aPhase * 0.5) * (1.0 - progress);
  pos += tangent * sin(swirlAngle) * swirlRadius + bitangent * cos(swirlAngle) * swirlRadius;

  
  float waveFreq = 3.0 + aPhase * 4.0;
  float waveAmp = 0.4 * (1.0 - progress * 0.8);
  pos.x += sin(age * waveFreq + aPhase * 6.28) * waveAmp;
  pos.y += cos(age * waveFreq * 0.7 + aPhase * 4.0) * waveAmp * 0.6;

  
  float fadeIn = smoothstep(0.0, 0.05, progress);
  float fadeOut = 1.0 - smoothstep(0.4, 1.0, progress);
  vAlpha = fadeIn * fadeOut;
  vAge = progress;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  
  float sizeScale = (1.0 - progress * 0.7) * (0.7 + aPhase * 0.6);
  float sizeAttenuation = 350.0 / -mvPosition.z;
  gl_PointSize = size * pixelRatio * sizeAttenuation * sizeScale;
  gl_PointSize = clamp(gl_PointSize, 1.0, 60.0);
}

// ===== shader 27 — 015-MGdOx5d6.js =====
uniform vec3 color;
uniform vec3 glowColor;

varying float vAlpha;
varying float vAge;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);

  if(dist > 0.5)
    discard;

  
  float core = 1.0 - smoothstep(0.0, 0.15, dist);
  float glow = 1.0 - smoothstep(0.0, 0.5, dist);
  glow = pow(glow, 2.0);

  
  vec3 col = mix(glowColor, color, smoothstep(0.0, 0.3, vAge));

  
  col += glowColor * core * 0.8;

  
  col *= 1.5 + core * 2.0;

  float alpha = glow * vAlpha;

  gl_FragColor = vec4(col, alpha);
}

// ===== shader 28 — 015-MGdOx5d6.js =====
precision highp float;

precision highp int;
precision highp sampler2D;

uniform vec2 resolution;
uniform float time;
uniform float delta;

uniform float springStiffness;
uniform float damping;
uniform float viscosity;
uniform float flowStrength;
uniform float flowScale;
uniform float flowSpeed;
uniform float returnSharpness;
uniform float scatterDuration;

uniform float pulseAmplitude;
uniform float burstIntensity;

uniform vec2 uMouseUV;
uniform vec2 uMouseVel;
uniform float uAspect;
uniform float uImpulseScale;

uniform mat4 uMVP;

uniform vec3 uCamRight;
uniform vec3 uCamUp;
uniform float uInteractForce;

uniform float repulsionStrength;
uniform float repulsionRadius;

uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform sampler2D textureTarget;

in vec2 vUv;

layout(location = 0) out vec4 outPosition;
layout(location = 1) out vec4 outVelocity;

uvec2 _pcg3d16(uvec3 p) {
  uvec3 v = p * 1664525u + 1013904223u;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  v.z += v.x * v.y;
  v.x += v.y * v.z;
  v.y += v.z * v.x;
  return v.xy;
}

vec3 _gradient3d(uint hash) {
  vec3 g = vec3(uvec3(hash) & uvec3(0x80000u, 0x40000u, 0x20000u));
  return g * (1.0 / vec3(0x40000, 0x20000, 0x10000)) - 1.0;
}

vec3 BitangentNoise3D(vec3 p) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(p + dot(p, C.yyy));
  vec3 x0 = p - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = i + 32768.5;
  uvec2 hash0 = _pcg3d16(uvec3(i));
  uvec2 hash1 = _pcg3d16(uvec3(i + i1));
  uvec2 hash2 = _pcg3d16(uvec3(i + i2));
  uvec2 hash3 = _pcg3d16(uvec3(i + 1.0));
  vec3 p00 = _gradient3d(hash0.x);
  vec3 p01 = _gradient3d(hash0.y);
  vec3 p10 = _gradient3d(hash1.x);
  vec3 p11 = _gradient3d(hash1.y);
  vec3 p20 = _gradient3d(hash2.x);
  vec3 p21 = _gradient3d(hash2.y);
  vec3 p30 = _gradient3d(hash3.x);
  vec3 p31 = _gradient3d(hash3.y);
  vec4 m = clamp(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0, 1.0);
  vec4 mt = m * m;
  vec4 m4 = mt * mt;
  mt = mt * m;
  vec4 pdotx = vec4(dot(p00, x0), dot(p10, x1), dot(p20, x2), dot(p30, x3));
  vec4 temp = mt * pdotx;
  vec3 gradient0 = -8.0 * (temp.x * x0 + temp.y * x1 + temp.z * x2 + temp.w * x3);
  gradient0 += m4.x * p00 + m4.y * p10 + m4.z * p20 + m4.w * p30;
  pdotx = vec4(dot(p01, x0), dot(p11, x1), dot(p21, x2), dot(p31, x3));
  temp = mt * pdotx;
  vec3 gradient1 = -8.0 * (temp.x * x0 + temp.y * x1 + temp.z * x2 + temp.w * x3);
  gradient1 += m4.x * p01 + m4.y * p11 + m4.z * p21 + m4.w * p31;
  return cross(gradient0, gradient1) * 3918.76;
}

void main() {
  vec2 uv = vUv;

  vec4 posData = texture(texturePosition, uv);
  vec4 velData = texture(textureVelocity, uv);
  vec4 targetData = texture(textureTarget, uv);

  vec3 pos = posData.xyz;
  vec3 vel = velData.xyz;
  vec3 target = targetData.xyz;

  float pulse = 1.0 + burstIntensity * pulseAmplitude * 0.15;
  target *= pulse;
  vel += normalize(pos + vec3(0.001)) * burstIntensity * pulseAmplitude * 0.08;

  
  vec4 clipPos = uMVP * vec4(pos, 1.0);
  float interactMask = 0.0;
  if(clipPos.w > 0.0) {
    vec2 screenUV = clamp((clipPos.xy / clipPos.w) * 0.5 + 0.5, 0.001, 0.999);
    vec2 d = screenUV - uMouseUV;
    d.x *= uAspect;
    interactMask = 1.0 - smoothstep(0.05, 0.12, length(d));
  }
  vec2 fluidVelXY = vec2(uMouseVel.x * uAspect, uMouseVel.y) * 50.0
                  * uImpulseScale * interactMask;
  float rawLen = length(fluidVelXY);
  fluidVelXY *= min(1.0, 1.5 / max(rawLen, 1e-4));
  float fluidMag = min(rawLen, 1.5) * uInteractForce;

  vec3 fluidDisp = uCamRight * fluidVelXY.x + uCamUp * fluidVelXY.y;
  vel += fluidDisp * 0.07 * uInteractForce;

  vec3 toTarget = target - pos;
  float dist = length(toTarget);

  float scatter = velData.w;
  float threshold = 1.0 / max(returnSharpness, 1.0);
  float holdFactor = smoothstep(0.0, threshold, scatter);

  float invFluidStrength = max(0.3, 1.0 - fluidMag * 0.8);
  float springReduction = invFluidStrength * (1.0 - holdFactor * 0.6);
  springReduction = max(springReduction, 0.2);

  float distAmp = mix(1.0 + dist * 0.5, 1.0, scatter);
  float springK = springStiffness * distAmp * springReduction;
  vel += toTarget * springK * delta;

  vec3 flowPos = pos * flowScale + vec3(0.0, 0.0, time * flowSpeed);
  float mouseFlowBoost = 1.0 + fluidMag * 2.6;
  vel += BitangentNoise3D(flowPos) * flowStrength * mouseFlowBoost;

  vec2 repUvStep = vec2(1.0 / resolution.x, 1.0 / resolution.y) * 2.0;
  vec3 repulsionForce = vec3(0.0);
  for(int i = 0; i < 2; i++) {
    vec2 off = i == 0 ? vec2(1.0, 1.0) : vec2(-1.0, -1.0);
    vec3 neighborPos = texture(texturePosition, uv + off * repUvStep).xyz;
    vec3 diff = pos - neighborPos;
    float neighborDist = length(diff);
    if(neighborDist > 0.001 && neighborDist < repulsionRadius * 10.0) {
      float repulse = 1.0 / (neighborDist * neighborDist + 0.1);
      repulsionForce += normalize(diff) * repulse * repulsionStrength;
    }
  }
  vel += repulsionForce;

  float uvStep = 1.0 / resolution.x;
  vec3 velSum = vel;
  velSum += texture(textureVelocity, uv + vec2(uvStep, uvStep)).xyz;
  velSum += texture(textureVelocity, uv + vec2(-uvStep, -uvStep)).xyz;
  vel = mix(vel, velSum / 3.0, viscosity);

  vel *= damping;

  
  float vMag = length(vel);
  vel *= min(1.0, 6.0 / max(vMag, 1e-4));

  float targetScatter = clamp(fluidMag * 2.5, 0.0, 1.0);
  float newScatter;
  if(targetScatter > scatter) {
    newScatter = scatter + (targetScatter - scatter) * min(1.0, delta * 15.0);
  } else {
    newScatter = scatter - delta / max(scatterDuration, 0.01);
  }
  newScatter = clamp(newScatter, 0.0, 1.0);

  
  
  
  float dt60 = delta * 60.0;
  vec3 newPos = pos + vel * dt60;

  
  float prevGlow = posData.w;
  float speed = length(vel);
  float velGlow = clamp((speed - 0.05) * 2.5, 0.0, 1.0);
  float scatterGlow = newScatter * 0.7;
  float impulseMag = length(uMouseVel) * 50.0 * uImpulseScale * interactMask;
  float proxGlow = min(impulseMag * 1.5, 0.8);
  float targetGlow = clamp(velGlow + proxGlow + scatterGlow, 0.0, 1.0);
  float glow;
  if (targetGlow > prevGlow) {
    glow = prevGlow + (targetGlow - prevGlow) * min(1.0, delta * 12.0);
  } else {
    glow = prevGlow + (targetGlow - prevGlow) * min(1.0, delta * 3.0);
  }

  outPosition = vec4(newPos, clamp(glow, 0.0, 1.0));
  outVelocity = vec4(vel, newScatter);
}

// ===== shader 29 — 015-MGdOx5d6.js =====
uniform sampler2D positionTexture;
uniform sampler2D velocityTexture;
uniform float extrapolateTau;
uniform float size;
uniform float pixelRatio;
uniform float centerGlowSize;
uniform float centerGlowPulse;
uniform vec3 centerGlowColor;
uniform float centerGlowOpacity;
uniform float burstIntensity;
uniform float uTime;
uniform vec3 glowColor;
uniform vec3 tintColor;
uniform vec3 energyColor;

attribute vec2 texCoord;
attribute vec3 color;
attribute float aHash;

varying vec3 vColor;
varying vec3 vAddColor;
varying vec3 vBoostColor;

varying vec3 vFx;

void main() {
  vec4 posData = texture2D(positionTexture, texCoord);
  vec4 velData = texture2D(velocityTexture, texCoord);
  vec3 currVel = velData.xyz;
  
  
  vec3 pos = posData.xyz + currVel * extrapolateTau;
  float glow = posData.w;
  float scatter = velData.w;
  float speed = length(currVel);

  vColor = color;

  float distToCenter = length(pos);
  float glowRadius = centerGlowSize * centerGlowPulse;
  float centerGlow = 1.0 - smoothstep(0.0, glowRadius, distToCenter);
  centerGlow *= centerGlow;

  
  
  float speedMix = smoothstep(0.05, 0.5, speed) * 0.5;
  vAddColor = glowColor * glow * 1.5
    + centerGlowColor * centerGlow * centerGlowOpacity
    + energyColor * speedMix;
  vBoostColor = tintColor
    * (1.3 * (1.0 + glow * 0.4 + centerGlow * 0.3 + burstIntensity));

  float blowoutKey = clamp(
    glow * 0.7 +
    burstIntensity * 0.5 +
    scatter * 0.45 +
    smoothstep(0.08, 0.45, speed) * 0.45,
    0.0, 1.0
  );
  vFx = vec3(
    1.0 + 0.05 * sin(uTime * 1.5 + aHash * 6.28318),
    scatter * 0.2,
    smoothstep(0.25, 0.95, blowoutKey) * 0.25
  );

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float sizeAttenuation = 350.0 / -mvPosition.z;
  float bloomScale = 1.0 + glow * 0.35;
  gl_PointSize = size * pixelRatio * sizeAttenuation * bloomScale;
  
  
  gl_PointSize = clamp(gl_PointSize, 2.0, 100.0) * 0.84;
}

// ===== shader 30 — 015-MGdOx5d6.js =====
varying vec3 vColor;
varying vec3 vAddColor;
varying vec3 vBoostColor;
varying vec3 vFx;

uniform vec3 lightDirView;
uniform vec3 halfDirView;
uniform float uPresence;

uniform vec3 rimColorCool;
uniform vec3 rimColorWarm;
uniform vec3 specColor;

void main() {
  
  
  vec2 uv = (gl_PointCoord - 0.5) * 0.84;
  float dist = length(uv);

  float solidEdge = 0.42;
  if(dist > solidEdge) discard;

  float z = sqrt(max(0.0, 0.25 - dist * dist));
  
  vec3 normal = vec3(uv.x, -uv.y, z) * 2.0;

  float NdotL = max(dot(normal, lightDirView), 0.0);
  float diffuse = NdotL * 0.4 + 0.6;
  float shadow = smoothstep(-0.3, 0.4, normal.y) * 0.25 + 0.75;

  float rim = 1.0 - max(normal.z, 0.0);
  float rim2 = rim * rim;
  float rimGlow = rim2 * rim * 0.4;

  vec3 baseColor = vColor * diffuse * shadow * 1.2;

  
  float backLit = 1.0 - NdotL;
  baseColor += vColor * (backLit * backLit * 0.18);

  
  vec3 rimMix = mix(rimColorWarm, rimColorCool, rim2);
  baseColor += rimMix * rimGlow;

  float sN = max(dot(normal, halfDirView), 0.0);
  float s2 = sN * sN;
  float s4 = s2 * s2;
  float s8 = s4 * s4;
  float s16 = s8 * s8;
  float spec = s16 * s8 * 0.25;
  baseColor += specColor * spec;

  
  baseColor += vAddColor;

  
  float luma = dot(baseColor, vec3(0.299, 0.587, 0.114));
  baseColor = mix(baseColor, vec3(luma), vFx.y);

  
  baseColor *= vFx.x;

  vec3 boosted = baseColor * vBoostColor;

  
  
  
  baseColor = mix(boosted, vec3(1.8), vFx.z);

  
  
  float ditherNoise = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5;
  baseColor += ditherNoise / 255.0;

  float alpha = 1.0 - smoothstep(0.36, solidEdge, dist);

  gl_FragColor = vec4(baseColor, alpha * uPresence);
}

// ===== shader 31 — 015-MGdOx5d6.js =====
in vec3 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}

// ===== shader 32 — 015-MGdOx5d6.js =====
precision highp float;
in vec2 vUv;
uniform sampler2D initPos;
uniform sampler2D initVel;
layout(location = 0) out vec4 outPosition;
layout(location = 1) out vec4 outVelocity;
void main() {
  outPosition = texture(initPos, vUv);
  outVelocity = texture(initVel, vUv);
}

// ===== shader 33 — 015-MGdOx5d6.js =====

uniform float uBakeWorldSize;
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}


// ===== shader 34 — 015-MGdOx5d6.js =====

uniform float uBakeWorldSize;
varying vec2 vUv;
void main() {
    // Map UV 0-1 → world [-half, +half] so FBM gets unique values across entire area
    vec2 worldXZ = (vUv - 0.5) * uBakeWorldSize;
    float h = getTerrainHeight(worldXZ);

    // Normals via finite differences
    float d = 1.0;
    float hR = getTerrainHeight(worldXZ + vec2(d, 0.0));
    float hU = getTerrainHeight(worldXZ + vec2(0.0, d));
    vec3 n = normalize(vec3((h - hR) / d, 1.0, (h - hU) / d));

    gl_FragColor = vec4(h, n.x * 0.5 + 0.5, n.z * 0.5 + 0.5, 1.0);
}


// ===== shader 35 — 015-MGdOx5d6.js =====
uniform float uTime;
uniform float uWindSpeed;
uniform float uWindStrength;
uniform vec2 uWindDirection;
uniform float uPixelRatio;
uniform vec3 uCameraPosition;
uniform float uSpread;
uniform vec2 uOfficeCenter;
uniform vec2 uOfficeHalf;
uniform float uOfficeRoofY;

attribute vec3 aVelocity;
attribute float aSize;
attribute float aPhase;

varying float vAlpha;
varying float vGlow;
varying float vBlur;

void main() {
    
    vec3 pos = position;
    float half_spread = uSpread * 0.5;
    pos.x = uCameraPosition.x + mod(pos.x - uCameraPosition.x + half_spread, uSpread) - half_spread;
    pos.z = uCameraPosition.z + mod(pos.z - uCameraPosition.z + half_spread, uSpread) - half_spread;

    
    float edgeDistX = abs(pos.x - uCameraPosition.x) / half_spread;
    float edgeDistZ = abs(pos.z - uCameraPosition.z) / half_spread;
    float edgeFade = smoothstep(1.0, 0.6, max(edgeDistX, edgeDistZ));

    float t = uTime;
    float phase = aPhase * 6.2831853;

    
    float wanderX = sin(t * 0.4 * aVelocity.x + phase) * 2.5
                   + sin(t * 0.17 + phase * 1.3) * 1.5;
    float wanderZ = cos(t * 0.35 * aVelocity.z + phase * 0.7) * 2.5
                   + cos(t * 0.22 + phase * 1.7) * 1.5;
    float wanderY = sin(t * 0.6 * aVelocity.y + phase * 1.1) * 1.0
                   + sin(t * 0.25 + phase) * 0.8;

    pos.x += wanderX;
    pos.y += wanderY;
    pos.z += wanderZ;

    
    pos.x += sin(t * uWindSpeed * 0.3 + phase) * uWindStrength * 2.0 * uWindDirection.x;
    pos.z += sin(t * uWindSpeed * 0.3 + phase * 1.4) * uWindStrength * 2.0 * uWindDirection.y;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float dist = length(mvPosition.xyz);

    
    float pulse = sin(t * (1.5 + aVelocity.x * 2.0) + phase) * 0.5 + 0.5;
    
    float flash = pow(pulse, 4.0);
    vGlow = mix(0.15, 1.0, flash);

    
    vBlur = smoothstep(25.0, 3.0, dist);

    
    vec2 od = abs(pos.xz - uOfficeCenter) - uOfficeHalf;
    float officeDist = length(max(od, 0.0)) + min(max(od.x, od.y), 0.0);
    float indoor = (1.0 - smoothstep(0.0, 3.0, officeDist))
                 * (1.0 - smoothstep(uOfficeRoofY - 2.0, uOfficeRoofY, pos.y));

    
    vAlpha = smoothstep(250.0, 30.0, dist) * smoothstep(0.0, 3.0, dist) * edgeFade;
    vAlpha *= 1.0 - indoor;

    gl_Position = projectionMatrix * mvPosition;

    
    float glowSize = 1.0 + flash * 1.5;
    gl_PointSize = aSize * uPixelRatio * glowSize * (180.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.5, 24.0);
}

// ===== shader 36 — 015-MGdOx5d6.js =====
uniform vec3 uColor;
uniform vec3 uCoreColor;

varying float vAlpha;
varying float vGlow;
varying float vBlur;

void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;

    
    if (d > 1.0) discard;

    
    float coreTight = mix(12.0, 2.0, vBlur);
    float haloTight = mix(3.0, 0.8, vBlur);

    float core = exp(-d * d * coreTight);
    float halo = exp(-d * d * haloTight);

    
    float edgeFade = 1.0 - smoothstep(0.6, 1.0, d);

    float shape = mix(halo * 0.3, core + halo * 0.4, vGlow) * edgeFade;
    
    float alpha = shape * vAlpha * vGlow * mix(1.0, 0.4, vBlur);

    if (alpha < 0.005) discard;

    vec3 color = mix(uColor, uCoreColor, core * vGlow);

    gl_FragColor = vec4(color, alpha);
}

// ===== shader 37 — 015-MGdOx5d6.js =====
uniform float uTime;
uniform float uWindSpeed;
uniform float uWindStrength;
uniform vec2 uWindDirection;
uniform float uPixelRatio;
uniform vec3 uCameraPosition;
uniform float uSpread;
uniform vec2 uOfficeCenter;
uniform vec2 uOfficeHalf;
uniform float uOfficeRoofY;

attribute float aPhase;
attribute float aSize;
attribute vec3 aVelocity;

varying float vAlpha;
varying float vRotation;
varying float vLeafType;
varying float vBlur;

void main() {
    
    vec3 pos = position;
    float half_spread = uSpread * 0.5;
    pos.x = uCameraPosition.x + mod(pos.x - uCameraPosition.x + half_spread, uSpread) - half_spread;
    pos.z = uCameraPosition.z + mod(pos.z - uCameraPosition.z + half_spread, uSpread) - half_spread;

    
    float edgeDistX = abs(pos.x - uCameraPosition.x) / half_spread;
    float edgeDistZ = abs(pos.z - uCameraPosition.z) / half_spread;
    float edgeFade = smoothstep(1.0, 0.6, max(edgeDistX, edgeDistZ));

    float t = uTime * uWindSpeed;
    float phase = aPhase * 6.2831853;

    
    pos.x += sin(t * 0.2 + phase) * uWindStrength * uWindDirection.x * aVelocity.x * 8.0;
    pos.z += sin(t * 0.2 + phase * 1.4) * uWindStrength * uWindDirection.y * aVelocity.z * 8.0;

    
    float spiralSpeed = 0.4 + aVelocity.x * 0.3;
    pos.x += sin(t * spiralSpeed + phase) * 3.0;
    pos.z += cos(t * spiralSpeed * 0.8 + phase * 1.3) * 2.5;

    
    pos.y += sin(t * 0.3 + phase) * 2.0;
    pos.y -= mod(t * aVelocity.y * 0.3 + aPhase * 100.0, 40.0) - 20.0;

    
    vRotation = t * (2.0 + aVelocity.x * 3.0) + phase;

    
    vLeafType = aPhase;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float dist = length(mvPosition.xyz);

    
    vBlur = smoothstep(30.0, 5.0, dist);

    
    vec2 od = abs(pos.xz - uOfficeCenter) - uOfficeHalf;
    float officeDist = length(max(od, 0.0)) + min(max(od.x, od.y), 0.0);
    float indoor = (1.0 - smoothstep(0.0, 3.0, officeDist))
                 * (1.0 - smoothstep(uOfficeRoofY - 2.0, uOfficeRoofY, pos.y));

    vAlpha = smoothstep(200.0, 60.0, dist) * smoothstep(0.0, 3.0, dist) * edgeFade;
    vAlpha *= 1.0 - indoor;

    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * uPixelRatio * (120.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 2.0, 40.0);
}

// ===== shader 38 — 015-MGdOx5d6.js =====
uniform vec3 uColor;
uniform vec3 uColor2;

varying float vAlpha;
varying float vRotation;
varying float vLeafType;
varying float vBlur;

vec2 rot(vec2 p, float a) {
    float c = cos(a), s = sin(a);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

float leafShape(vec2 p) {
    
    float stretch = 1.8 + vLeafType * 0.6;
    p.x *= stretch;

    
    float taper = 1.0 + p.y * 0.6;
    p.x *= taper;

    
    float d = length(p);

    
    float vein = abs(p.x) * 4.0;
    float veinLine = smoothstep(0.05, 0.0, vein) * 0.15;

    
    float sideVein = abs(fract(p.y * 3.0 + 0.5) - 0.5);
    float sideVeinLine = smoothstep(0.15, 0.05, sideVein) * smoothstep(0.4, 0.2, abs(p.x)) * 0.1;

    return d - 0.35 + veinLine + sideVeinLine;
}

void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;

    
    uv = rot(uv, vRotation);

    
    float tumble = sin(vRotation * 0.7) * 0.6;
    uv.x *= 1.0 + tumble;

    float sdf = leafShape(uv);
    
    float edgeWidth = mix(0.07, 0.25, vBlur);
    float shape = smoothstep(edgeWidth, -0.02, sdf);

    if (shape < 0.01) discard;

    
    vec3 color = mix(uColor, uColor2, vLeafType);

    
    float edgeDark = smoothstep(-0.15, 0.05, sdf) * 0.3 * (1.0 - vBlur * 0.7);
    color *= 1.0 - edgeDark;

    
    gl_FragColor = vec4(color, shape * vAlpha * 0.85 * mix(1.0, 0.5, vBlur));
}

// ===== shader 39 — 015-MGdOx5d6.js =====

varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}


// ===== shader 40 — 015-MGdOx5d6.js =====

precision highp float;
uniform sampler2D uTexture;
uniform float uThreshold;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(uTexture, vUv);
  // Max channel, not luminance — violet lamps have low luma but hot channels
  float br = max(max(c.r, c.g), c.b);
  float k = smoothstep(uThreshold - 0.2, uThreshold + 0.1, br);
  gl_FragColor = vec4(c.rgb * k, 1.0);
}
