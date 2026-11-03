// ===== shader 1 — 011-3o99qjmm-sqd_.js =====


		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

// ===== shader 2 — 011-3o99qjmm-sqd_.js =====


		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}

// ===== shader 3 — 011-3o99qjmm-sqd_.js =====


		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

// ===== shader 4 — 011-3o99qjmm-sqd_.js =====


		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}

// ===== shader 5 — 011-3o99qjmm-sqd_.js =====


				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}

// ===== shader 6 — 011-3o99qjmm-sqd_.js =====


				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}

// ===== shader 7 — 011-3o99qjmm-sqd_.js =====


				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}

// ===== shader 8 — 011-3o99qjmm-sqd_.js =====

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

// ===== shader 9 — 011-3o99qjmm-sqd_.js =====
s lambert term
  void main() {
    vec3 e = normalize(vec3(modelViewMatrix * vec4(position, 1.0)));
    vec3 n = normalize(normalMatrix * normal);
    vec3 r = reflect(e, n);
    float m = 2.0 * sqrt(r.x*r.x + r.y*r.y + (r.z+1.0)*(r.z+1.0));
    vN = r.xy / m + 0.5;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vWorldN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }


// ===== shader 10 — 011-3o99qjmm-sqd_.js =====

  uniform sampler2D uMatcap;
  uniform float     uGamma;
  uniform float     uExposure;
  uniform float     uModelBrightness;
  uniform float     uContrast;
  uniform float     uSaturation;
  uniform float     uLaser;         // self-emissive red (0 = off); driven on the eyes
  uniform vec3      uLaserColor;    // laser tint
  uniform float     uLaserLight;    // red LIGHT the glowing eyes cast on the face
  uniform vec3      uLaserLightPos; // world-space origin of that light (between the eyes)
  uniform float     uLaserRange;    // world-space reach of the spill falloff
  uniform vec3      uSpillColor;    // spill tint — deep red charged, warms white-hot firing
  uniform float     uFireDarken;    // mid-blast dim of the base shading (0 = none)
  varying vec2 vN;
  varying vec3 vWorldPos;
  varying vec3 vWorldN;
  void main() {
    vec4  mc = texture2D(uMatcap, vN);
    vec3  c  = mc.rgb;
    c  = pow(max(c, 0.0), vec3(1.0 / max(uGamma, 0.001)));
    c *= uExposure;
    c += uModelBrightness;
    c = (c - 0.5) * uContrast + 0.5;
    float lum = dot(c, vec3(0.299, 0.587, 0.114));
    c = mix(vec3(lum), c, uSaturation);
    // Mid-blast the beams outgun the room light, so the base shading falls
    // into shadow (like the ref: Homelander

// ===== shader 11 — 011-3o99qjmm-sqd_.js =====

      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    

// ===== shader 12 — 011-3o99qjmm-sqd_.js =====

      uniform vec3  uColor;
      uniform float uIntensity;
      varying vec2  vUv;
      void main() {
        // Soft across the width: bright centreline (vUv.x=0.5) → 0 at edges.
        float edge   = clamp(abs(vUv.x - 0.5) * 2.0, 0.0, 1.0);
        float radial = pow(1.0 - edge, 2.2);
        // Along the length: quick ramp-up at the eye, gentle dissipation at the tip.
        float lenFade = smoothstep(0.0, 0.04, vUv.y) * (1.0 - smoothstep(0.68, 1.0, vUv.y));
        gl_FragColor = vec4(uColor, radial * lenFade * uIntensity);
      }
    

// ===== shader 13 — 018-1r_mvu_vuwz3v.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 14 — 018-1r_mvu_vuwz3v.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 15 — 018-1r_mvu_vuwz3v.js =====
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
		

// ===== shader 16 — 018-1r_mvu_vuwz3v.js =====

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
		

// ===== shader 17 — 018-1r_mvu_vuwz3v.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 18 — 018-1r_mvu_vuwz3v.js =====


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
	

// ===== shader 19 — 018-1r_mvu_vuwz3v.js =====

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

// ===== shader 20 — 018-1r_mvu_vuwz3v.js =====
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

// ===== shader 21 — 018-1r_mvu_vuwz3v.js =====

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

// ===== shader 22 — 020-3zt4mi0z0e4-j.js =====

      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    

// ===== shader 23 — 020-3zt4mi0z0e4-j.js =====

      uniform sampler2D uTex;
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        vec4 c = texture2D(uTex, vUv);
        gl_FragColor = vec4(c.rgb, c.a * uOpacity);
      }
    

// ===== shader 24 — 020-3zt4mi0z0e4-j.js =====

      uniform sampler2D uTex;
      uniform float uOpacity;
      uniform float uReveal;   // 0 = skeleton placeholder, 1 = loaded media
      uniform float uTime;     // seconds, drives the skeleton shimmer sweep
      uniform vec2 uUvScale;
      uniform vec2 uUvOffset;
      varying vec2 vUv;
      void main() {
        float sweep = fract(uTime * 0.6);
        float pos = (vUv.x + vUv.y) * 0.5;
        float band = smoothstep(0.18, 0.0, abs(pos - sweep));
        vec3 skel = vec3(0.914) + band * 0.05; // ~#E9E9E9, brightening in the band

        vec2 uv = vUv * uUvScale + uUvOffset;
        vec4 c = texture2D(uTex, uv);

        vec3 rgb = mix(skel, c.rgb, uReveal);
        float a = mix(1.0, c.a, uReveal) * uOpacity;
        gl_FragColor = vec4(rgb, a);
      }
    

// ===== shader 25 — 020-3zt4mi0z0e4-j.js =====

      uniform sampler2D tDiffuse;
      uniform float uBandTop;
      uniform float uBandBot;
      uniform float uStrength;
      uniform float uCurve;
      uniform float uChromaticAberration;
      varying vec2 vUv;

      float sag(float t) {
        t = clamp(pow(t, uCurve), 0.0, 1.0);
        return 1.0 - sqrt(1.0 - t * t);
      }

      void main() {
        vec2 uv = vUv; // uv.y: 0 = bottom, 1 = top
        float dist = 0.0;

        if (uBandTop > 0.0 && uv.y > 1.0 - uBandTop) {
          float t = (uv.y - (1.0 - uBandTop)) / uBandTop;
          dist = sag(t) * uBandTop * uStrength;
          uv.y -= dist;
        } else if (uBandBot > 0.0 && uv.y < uBandBot) {
          float t = (uBandBot - uv.y) / uBandBot;
          dist = sag(t) * uBandBot * uStrength;
          uv.y += dist;
        }

        uv = clamp(uv, vec2(0.0), vec2(1.0));

        if (dist == 0.0 || uChromaticAberration == 0.0) {
          gl_FragColor = texture2D(tDiffuse, uv);
          return;
        }

        vec3 finalColor = vec3(0.0);
        vec3 weightSum = vec3(0.0);
        for (int i = 0; i < 16; i++) {
          float t = float(i) / 15.0;
          vec3 w = vec3(
            smoothstep(0.8, 0.2, t),
            smoothstep(0.0, 0.5, t) * smoothstep(1.0, 0.5, t),
            smoothstep(0.2, 0.8, t)
          );
          float shift = (t - 0.5) * uChromaticAberration * dist * 30.0;
          vec2 sampleUv = clamp(uv + vec2(0.0, shift), vec2(0.0), vec2(1.0));
          finalColor += texture2D(tDiffuse, sampleUv).rgb * w;
          weightSum += w;
        }
        finalColor /= weightSum;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    

// ===== shader 26 — 020-3zt4mi0z0e4-j.js =====

          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        

// ===== shader 27 — 022-084_r2b5_j8fb.js =====

  varying vec2 vUv;
  varying vec4 vClipPos;
  void main() {
    vUv = uv;
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vClipPos = clip;
    gl_Position = clip;
  }


// ===== shader 28 — 022-084_r2b5_j8fb.js =====

  #define PI 3.14159265
  uniform sampler2D uBg;
  uniform vec2      uRes;
  uniform float     uProgress;
  uniform vec2      uCursorUV;
  uniform float     uZoom;
  uniform float     uDispersion;
  uniform float     uBlur;
  uniform float     uGlow;
  uniform vec3      uBlueColor;
  uniform float     uWhiteGlow;
  uniform float     uBlueRing;
  uniform float     uTime;
  uniform float     uShimmer;
  uniform float     uNovaSize;
  uniform float     uRingRadius;
  uniform float     uRingWidth;
  uniform float     uDiscScreenRadius;
  uniform float     uRimStart;
  uniform float     uRimTangential;
  uniform float     uRimInward;
  uniform float     uRimFreq1;
  uniform float     uRimFreq2;
  uniform float     uDissolve;
  uniform float     uEdgeRingOn;
  uniform vec3      uEdgeRingColor;
  uniform float     uEdgeRingIntensity;
  uniform float     uEdgeRingWidth;
  uniform float     uEdgeRingSoftness;
  uniform float     uEdgeRingShimmer;
  varying vec2 vUv;
  varying vec4 vClipPos;

  void main() {
    vec2  c    = vUv - 0.5;
    float dist = length(c);
    float r2   = dot(c, c);
    float mask = smoothstep(0.5, 0.464, dist);
    if (mask < 0.001) discard;
    vec2 screenUV = (vClipPos.xy / vClipPos.w) * 0.5 + 0.5;

    // ── Dissolve-out: 0 = full effect, 1 = gone ──
    // Strict ordering so nothing ever doubles: additive light (ring/nova/edge)
    // fades first (gone at 60%), the distortion OFFSETS reach exactly zero at
    // 80% — from there the lens samples the background pixel-for-pixel — and
    // only then (80%→100%) does the alpha fade run, blending identical images.
    float kDistort = 1.0 - smoothstep(0.0, 0.8, uDissolve);
    float kGlow    = 1.0 - smoothstep(0.0, 0.6, uDissolve);

    // Aspect-correct the screen-space field. screenUV is 0..1 on both axes, but the
    // viewport is uRes.x by uRes.y px, so equal UV deltas are unequal *pixel*
    // distances. Without this, the radial distortion/dispersion stretches into an
    // oval on non-square (e.g. portrait mobile) viewports. We measure distance and
    // direction in an aspect-corrected square space (asp applied to x), then undo it
    // when writing offsets back to UV space for texture sampling.
    float asp = uRes.x / max(uRes.y, 1.0);
    vec2  aspV = vec2(asp, 1.0);
    vec2  offUV    = screenUV - uCursorUV;     // raw UV-space offset
    vec2  offset   = offUV * aspV;             // square-space offset (isotropic)
    float nd       = clamp(length(offset) / max(uDiscScreenRadius, 0.0001), 0.0, 1.0);
    float pull     = uZoom * 0.30 * (nd * nd) * kDistort;
    float rimStrength = smoothstep(uRimStart, 1.0, nd);
    vec2  radialDir   = normalize(offset + 1e-6);
    vec2  tangentDir  = vec2(-radialDir.y, radialDir.x);
    float angle       = atan(offset.y, offset.x);
    float fluidWave   = sin(angle * uRimFreq1) * 0.55 + sin(angle * uRimFreq2) * 0.25;
    // rim/disp offsets are built in square space, then divided by aspV to return to UV.
    vec2  rimOff      = (tangentDir * fluidWave * rimStrength * uDiscScreenRadius * uRimTangential * kDistort) / aspV;
    vec2  rimPull     = (-radialDir * rimStrength * uDiscScreenRadius * uRimInward * kDistort) / aspV;
    float rimMask   = smoothstep(0.60, 1.0, nd);
    float dispTotal = uDispersion * 0.004 * rimMask * kDistort;
    vec2  baseUV    = uCursorUV + offUV * (1.0 - pull) + rimOff + rimPull;
    vec2  dispDir   = (radialDir * length(offUV) * dispTotal);
    vec3  ca    = vec3(0.0);
    vec3  caW   = vec3(0.0);
    const int CA_N = 8;
    for (int si = 0; si < CA_N; si++) {
      float t   = float(si) / float(CA_N - 1);
      vec2  sUV = baseUV + dispDir * (t - 0.5);
      vec3  s   = texture2D(uBg, sUV).rgb;
      float wr  = exp(-pow((t - 0.00) / 0.38, 2.0));
      float wg  = exp(-pow((t - 0.50) / 0.38, 2.0));
      float wb  = exp(-pow((t - 1.00) / 0.38, 2.0));
      ca  += s * vec3(wr, wg, wb);
      caW += vec3(wr, wg, wb);
    }
    // Normalize each channel by its OWN weight sum. A shared scalar norm
    // tints the whole disc green (the green Gaussian is centered in the
    // sample range, so it sums higher than red/blue, which are cut off at
    // the ends) — per-channel keeps a uniform background perfectly neutral
    // while the spatial offsets still produce the rainbow rim fringing.
    vec3 col = ca / max(caW, vec3(0.001));
    float blurFade = 1.0 - smoothstep(0.72, 0.98, nd);
    vec2  blurRad  = vec2(uBlur) / uRes * blurFade * kDistort;
    if (blurFade > 0.01) {
      vec3  blurCol = vec3(0.0);
      float blurTW  = 0.0;
      for (float d = 0.0; d < PI * 2.0; d += PI * 2.0 / 6.0) {
        for (float i = 0.2; i <= 1.001; i += 0.2) {
          vec2  off = vec2(cos(d), sin(d)) * blurRad * i;
          float w   = 1.0 - i * 0.38;
          blurCol  += texture2D(uBg, baseUV + off).rgb * w;
          blurTW   += w;
        }
      }
      blurCol += texture2D(uBg, baseUV).rgb * 2.0;
      blurTW  += 2.0;
      col = mix(blurCol / blurTW, col, rimMask);
    }
    col *= mix(1.0, mix(0.91, 1.0, smoothstep(0.0, 0.38, dist)), kDistort);
    float gs   = max(uNovaSize * uGlow * 0.003, 0.004);
    float nova = exp(-r2 / gs) + exp(-r2 / (gs * 7.0)) * 0.18;
    nova *= uWhiteGlow * (uGlow / 17.0) * 1.15 * kGlow;
    col  += vec3(nova);
    float tR       = clamp(uRingRadius, 0.1, 0.49);
    float rW       = max(uRingWidth, 0.003);
    float ring     = exp(-pow((dist - tR) / rW, 2.0));
    ring *= uBlueRing * (uGlow / 17.0) * 1.8 * kGlow;
    if (uShimmer > 0.5) ring *= sin(atan(c.y, c.x) * 12.0 + uTime * 3.5) * 0.12 + 0.88;
    float ringAura = exp(-pow((dist - tR) / (rW * 6.0), 2.0)) * 0.28 * uBlueRing * (uGlow / 17.0) * kGlow;
    col += uBlueColor * (ring + ringAura);
    col += vec3(exp(-pow((dist - 0.483) / 0.007, 2.0)) * 0.95 * kGlow);

    // ── Edge ring: a second, configurable ring locked to the glass border ──
    // Sits at dist 0.478 (just inside the alpha feather at 0.464–0.5 so its
    // core is never clipped). Same additive-light recipe as the blue ring —
    // Gaussian core + wider dim halo — so it fades out with kGlow during the
    // dissolve and can never ghost.
    if (uEdgeRingOn > 0.5) {
      float eR    = 0.478;
      float eW    = max(uEdgeRingWidth, 0.002);
      float eRing = exp(-pow((dist - eR) / eW, 2.0));
      if (uEdgeRingShimmer > 0.5)
        eRing *= sin(atan(c.y, c.x) * 12.0 + uTime * 3.5) * 0.12 + 0.88;
      // Softness widens a dimmer halo around the core line (0 = crisp line).
      float eHalo = exp(-pow((dist - eR) / (eW * (1.0 + uEdgeRingSoftness * 7.0)), 2.0))
                  * 0.35 * clamp(uEdgeRingSoftness, 0.0, 1.0);
      col += uEdgeRingColor * (eRing + eHalo) * uEdgeRingIntensity * kGlow;
    }
    float glassA = min(mix(0.86, 0.98, smoothstep(0.0, 0.44, dist)) + nova * 0.4, 1.0);

    // While the offsets collapse, drive the glass fully opaque: its resting
    // 0.86–0.98 alpha lets 2–14% of the true background bleed through the
    // still-displaced sample, which reads as a faint echo of the text.
    glassA = mix(glassA, 1.0, smoothstep(0.0, 0.35, uDissolve));

    // Final fade runs only AFTER kDistort hits exactly zero (uDissolve 0.8+),
    // when the lens already matches the background pixel-for-pixel — so this
    // blend is between identical images and can never show a double.
    glassA *= 1.0 - smoothstep(0.8, 1.0, uDissolve);

    gl_FragColor = vec4(col, mask * glassA * uProgress);
  }


// ===== shader 29 — 022-084_r2b5_j8fb.js =====

  uniform float uReveal;
  uniform float uTime;
  uniform float uRevealMinY;
  uniform float uRevealMaxY;
  uniform float uRevealBand;
  uniform float uRevealWobble;
  varying vec2 vN;
  varying vec3 vWorldPos;
  varying vec3 vViewPos;
  varying vec3 vViewNormal;
  ${B}
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    // ── Liquid-glass forming: molten ripple ──
    // While the liquid line sweeps up, the band of surface just under it is
    // still liquid and ripples along its normals; anything further below has
    // set and sits perfectly still. At uReveal = 1 the line is above the
    // head, molten = 0 everywhere, and this block is a no-op.
    float span = (uRevealMaxY - uRevealMinY) + 2.0 * uRevealBand;
    float front = uRevealMinY - uRevealBand + span * uReveal;
    float molten = smoothstep(front - uRevealBand, front, wp.y);
    if (molten > 0.0) {
      vec3 wn = normalize(mat3(modelMatrix) * normal);
      float ripple = vnoise(wp.xyz * 2.2 + vec3(0.0, -uTime * 1.6, 0.0)) - 0.5;
      wp.xyz += wn * ripple * uRevealWobble * molten;
    }
    vWorldPos = wp.xyz;
    vec4 mvPos = viewMatrix * wp;
    vViewPos = mvPos.xyz;
    vViewNormal = normalize(normalMatrix * normal);
    vec3 e = normalize(mvPos.xyz);
    vec3 r = reflect(e, vViewNormal);
    float m = 2.0 * sqrt(r.x*r.x + r.y*r.y + (r.z+1.0)*(r.z+1.0));
    vN = r.xy / m + 0.5;
    gl_Position = projectionMatrix * mvPos;
  }


// ===== shader 30 — 022-084_r2b5_j8fb.js =====

  uniform sampler2D uMatcap;
  uniform float     uGamma;
  uniform vec3      uMousePos;
  uniform float     uHoverIntensity;
  uniform vec3      uGlowColor;
  uniform float     uGlowRadius;
  uniform float     uSpread;
  uniform float     uFalloff;
  uniform float     uBrightness;
  uniform float     uExposure;
  uniform float     uModelBrightness;
  uniform float     uContrast;
  uniform float     uSaturation;
  uniform float     uReveal;
  uniform float     uTime;
  uniform float     uRevealMinY;
  uniform float     uRevealMaxY;
  uniform float     uRevealBand;
  uniform float     uRevealEdgeNoise;
  uniform float     uRevealRefract;
  uniform float     uRevealGlassAlpha;
  uniform float     uRevealGlassBrightness;
  uniform vec3      uRevealTint;
  varying vec2 vN;
  varying vec3 vWorldPos;
  varying vec3 vViewPos;
  varying vec3 vViewNormal;
  ${B}
  void main() {
    // ── Liquid-glass forming: where is this fragment vs the liquid line? ──
    // glass = 1 right at the line, fading to 0 one band-width below (set).
    // Above the line the head simply doesn

// ===== shader 31 — 024-04xi6lk37w8d4.js =====

      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    

// ===== shader 32 — 024-04xi6lk37w8d4.js =====
s own cover window. Separate from the pair above because the
      // still and the clip need not share an aspect ratio — each is cropped
      // into the same fixed tile box on its own terms.
      uniform vec2 uUvScale2;
      uniform vec2 uUvOffset2;
      varying vec2 vUv;

      void main() {
        float sweep = fract(uTime * 0.6);
        float pos = (vUv.x + vUv.y) * 0.5;
        float band = smoothstep(0.18, 0.0, abs(pos - sweep));
        vec3 skel = vec3(0.914) + band * 0.05; // ~#E9E9E9, brightening in the band

        // window into the part of each texture that covers the tile box
        vec2 uv = vUv;
        vec4 c = texture2D(uTex, uv * uUvScale + uUvOffset);
        // uTex2 is only ever bound while this tile is (or is becoming) the
        // hovered one — see attachHoverTex. At uMix 0 it is an unbound
        // sampler and the mix drops it entirely, exactly like uReveal does
        // for uTex before the tile

// ===== shader 33 — 024-04xi6lk37w8d4.js =====

      uniform sampler2D uTex;
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        vec4 c = texture2D(uTex, vUv);
        gl_FragColor = vec4(c.rgb, c.a * uOpacity);
      }
    

// ===== shader 34 — 024-04xi6lk37w8d4.js =====
s top-left, in image-local px
      uniform vec2  uSizePx;     // chip size
      uniform float uRadiusPx;
      uniform float uBlurPx;
      uniform float uBgAlpha;
      varying vec2 vUv;

      const int TAPS = 32;

      void main() {
        // ── rounded rect, antialiased across one pixel ──
        vec2 p = (vUv - 0.5) * uSizePx;
        vec2 b = uSizePx * 0.5 - uRadiusPx;
        vec2 q = abs(p) - b;
        float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadiusPx;
        float cover = 1.0 - smoothstep(-0.5, 0.5, sd);
        if (cover <= 0.0) discard;

        // ── where this fragment sits on the tile image ──
        // vUv.y is 0 at the quad

// ===== shader 35 — 024-04xi6lk37w8d4.js =====

      uniform sampler2D tDiffuse;
      uniform float uBandTop;  // top band size, fraction of viewport height
      uniform float uBandBot;  // bottom band size
      uniform float uStrength; // refraction amount (fraction of band height)
      uniform float uCurve;    // profile exponent (>1 = bend hugs the edge)
      uniform float uChromaticAberration; // multi-channel sampling spread
      varying vec2 vUv;

      // circular lens sag: t = 0 at the inner band boundary (flat, slope 0,
      // so no visible seam), t = 1 at the screen edge (maximum bend).
      float sag(float t) {
        t = clamp(pow(t, uCurve), 0.0, 1.0);
        return 1.0 - sqrt(1.0 - t * t);
      }

      void main() {
        vec2 uv = vUv; // uv.y: 0 = bottom of screen, 1 = top
        float dist = 0.0;

        // Calculate lens displacement
        if (uBandTop > 0.0 && uv.y > 1.0 - uBandTop) {
          float t = (uv.y - (1.0 - uBandTop)) / uBandTop;
          dist = sag(t) * uBandTop * uStrength;
          uv.y -= dist;
        } else if (uBandBot > 0.0 && uv.y < uBandBot) {
          float t = (uBandBot - uv.y) / uBandBot;
          dist = sag(t) * uBandBot * uStrength;
          uv.y += dist;
        }

        uv = clamp(uv, vec2(0.0), vec2(1.0));

        // Early exit: If we are in the flat middle section, skip the expensive loop completely.
        if (dist == 0.0 || uChromaticAberration == 0.0) {
          gl_FragColor = texture2D(tDiffuse, uv);
          return;
        }

        // Multi-tap spectral dispersion: seamlessly blends colors instead of creating harsh RGB bands
        vec3 finalColor = vec3(0.0);
        vec3 weightSum = vec3(0.0);

        for (int i = 0; i < 16; i++) {
          float t = float(i) / 15.0;
          
          // Cinematic spectrum weights for realistic light blending
          vec3 w = vec3(
            smoothstep(0.8, 0.2, t),                           // Red curve
            smoothstep(0.0, 0.5, t) * smoothstep(1.0, 0.5, t), // Green curve
            smoothstep(0.2, 0.8, t)                            // Blue curve
          );

          // Disperse the samples along the vertical axis (matching the physical glass bend)
          float shift = (t - 0.5) * uChromaticAberration * dist * 30.0;
          vec2 sampleUv = clamp(uv + vec2(0.0, shift), vec2(0.0), vec2(1.0));
          
          finalColor += texture2D(tDiffuse, sampleUv).rgb * w;
          weightSum += w;
        }

        finalColor /= weightSum;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    

// ===== shader 36 — 024-04xi6lk37w8d4.js =====

          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        