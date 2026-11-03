// ===== shader 1 — 037-BackgroundCanvas.Bg_NUauP.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 037-BackgroundCanvas.Bg_NUauP.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 037-BackgroundCanvas.Bg_NUauP.js =====

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
		

// ===== shader 4 — 037-BackgroundCanvas.Bg_NUauP.js =====
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
		

// ===== shader 5 — 037-BackgroundCanvas.Bg_NUauP.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 6 — 037-BackgroundCanvas.Bg_NUauP.js =====


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
	

// ===== shader 7 — 037-BackgroundCanvas.Bg_NUauP.js =====

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

// ===== shader 8 — 037-BackgroundCanvas.Bg_NUauP.js =====
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

// ===== shader 9 — 037-BackgroundCanvas.Bg_NUauP.js =====

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

// ===== shader 10 — 037-BackgroundCanvas.Bg_NUauP.js =====

    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }


// ===== shader 11 — 037-BackgroundCanvas.Bg_NUauP.js =====

    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform float uUseColorC;
    uniform vec2 uCenter;
    uniform float uIntensity;
    uniform float uOpacity;
    uniform float uAngle;
    uniform float uOffset;
    uniform float uSoftness;
    uniform float uSpread;
    uniform float uSpeed;
    uniform float uAnimated;
    uniform float uTiling;
    uniform float uNoiseAmount;
    uniform float uNoiseScale;
    uniform float uDither;
    uniform float uTime;
    uniform int uGradientType;

    varying vec2 vUv;

    float hash31(vec3 p) {
        float n = dot(p, vec3(127.1, 311.7, 74.7));
        return fract(sin(n) * 43758.5453123);
    }

    float valueNoise3D(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        vec3 u = f * f * (3.0 - 2.0 * f);

        float a = hash31(i);
        float b = hash31(i + vec3(1.0, 0.0, 0.0));
        float c = hash31(i + vec3(0.0, 1.0, 0.0));
        float d = hash31(i + vec3(1.0, 1.0, 0.0));
        float e = hash31(i + vec3(0.0, 0.0, 1.0));
        float ff = hash31(i + vec3(1.0, 0.0, 1.0));
        float g = hash31(i + vec3(0.0, 1.0, 1.0));
        float h = hash31(i + vec3(1.0, 1.0, 1.0));

        return mix(
            mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
            mix(mix(e, ff, u.x), mix(g, h, u.x), u.y),
            u.z
        );
    }

    void main() {
        float animatedDrift = uTime * uSpeed * uAnimated;
        vec2 direction = vec2(cos(uAngle), sin(uAngle));
        vec2 drift = direction * animatedDrift;

        vec2 domain = (vUv - 0.5) * uTiling + 0.5 + drift;

        float baseGradient;

        if (uGradientType == 1) {
            baseGradient = length((vUv + drift - uCenter) * uTiling) * 2.0;
        } else if (uGradientType == 2) {
            baseGradient = domain.y;
        } else if (uGradientType == 3) {
            baseGradient = domain.x;
        } else if (uGradientType == 4) {
            baseGradient = (domain.x + domain.y) * 0.5;
        } else {
            baseGradient = dot(domain - vec2(0.5), direction) + 0.5;
        }

        float gradientWithOffset = clamp(baseGradient + uOffset, 0.0, 1.0);
        float soft = max(uSoftness, 0.0001);
        float softenedGradient = clamp((gradientWithOffset - 0.5) / soft + 0.5, 0.0, 1.0);

        vec3 noiseDomain = vec3(
            domain.x * uNoiseScale + animatedDrift,
            domain.y * uNoiseScale - animatedDrift * 0.5,
            uTime * uSpeed * uAnimated
        );
        float noise = valueNoise3D(noiseDomain) * 2.0 - 1.0;

        float t = clamp(softenedGradient + noise * uNoiseAmount, 0.0, 1.0);
        t = pow(t, uSpread);

        vec3 dual = mix(uColorA, uColorB, t);

        float firstHalf = smoothstep(0.0, 0.5, t);
        float secondHalf = smoothstep(0.5, 1.0, t);
        vec3 triA = mix(uColorA, uColorB, firstHalf);
        vec3 triB = mix(uColorB, uColorC, secondHalf);
        vec3 tri = mix(triA, triB, step(0.5, t));

        vec3 color = mix(dual, tri, uUseColorC) * uIntensity;

        float ditherSeed = vUv.x * 12.9898 + vUv.y * 78.233;
        float ditherNoise = fract(sin(ditherSeed) * 43758.5453) - 0.5;
        float ditherAmount = uDither * (1.0 / 255.0);
        color += vec3(ditherNoise * ditherAmount);

        gl_FragColor = vec4(color, clamp(uOpacity, 0.0, 1.0));
    }


// ===== shader 12 — 037-BackgroundCanvas.Bg_NUauP.js =====


		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

// ===== shader 13 — 037-BackgroundCanvas.Bg_NUauP.js =====


		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}

// ===== shader 14 — 037-BackgroundCanvas.Bg_NUauP.js =====

                precision highp float;
                attribute vec3 position;
                void main() {
                    gl_Position = vec4(position.xy, 0.0, 1.0);
                }
            

// ===== shader 15 — 037-BackgroundCanvas.Bg_NUauP.js =====

                precision highp float;
                uniform vec3 uColor;
                uniform float uOpacity;
                void main() {
                    gl_FragColor = vec4(uColor, uOpacity);
                }
            

// ===== shader 16 — 037-BackgroundCanvas.Bg_NUauP.js =====


		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

// ===== shader 17 — 037-BackgroundCanvas.Bg_NUauP.js =====


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

// ===== shader 18 — 037-BackgroundCanvas.Bg_NUauP.js =====


				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}

// ===== shader 19 — 037-BackgroundCanvas.Bg_NUauP.js =====


				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}

// ===== shader 20 — 037-BackgroundCanvas.Bg_NUauP.js =====


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

// ===== shader 21 — 037-BackgroundCanvas.Bg_NUauP.js =====

    precision highp float;

    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;

    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }


// ===== shader 22 — 037-BackgroundCanvas.Bg_NUauP.js =====

    precision highp float;

    uniform sampler2D tDiffuse;
    uniform sampler2D tReveal;
    uniform float uStrength;
    uniform float uRadius;
    uniform float uSoftnessMin;
    uniform float uSoftnessMax;
    uniform float uFisheye;
    uniform vec2 uAberration;
    uniform float uGlobalAberration;
    uniform vec3 uColor;
    uniform float uColorIntensity;
    uniform float uColorOpacity;
    uniform float uNoiseScale;
    uniform float uNoiseStrength;
    uniform float uNoiseMagnitude;
    uniform float uNoiseAmplitude;
    uniform float uNoiseSpeed;
    uniform float uAspectRatio;
    uniform float uTime;

    varying vec2 vUv;

    float hash21(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * 0.1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }

    float noise2D(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
        vec2 screenUv = vUv;

        float n = noise2D(screenUv * uNoiseScale * 4.0);
        float noiseOffset = (n - 0.5) * uNoiseStrength * (1.0 - min(uRadius, 1.0));

        float n2 = noise2D((screenUv + uTime * uNoiseSpeed) * uNoiseMagnitude * 4.0);
        float noiseOffset2 = (n2 - 0.5) * uNoiseAmplitude * (1.0 - min(uRadius, 1.0));

        vec2 centered = (screenUv - 0.5) * vec2(uAspectRatio, 1.0);
        float cornerDist = 0.5 * sqrt(uAspectRatio * uAspectRatio + 1.0);
        float maxDist = cornerDist + uSoftnessMin + uSoftnessMax;
        float d = length(centered) / maxDist + noiseOffset;
        float mask = smoothstep(
            uRadius - uSoftnessMin,
            uRadius + uSoftnessMax,
            d
        );

        float revealNoiseUv = noiseOffset2 * (1.0 - uRadius);
        vec4 reveal = texture2D(tReveal, screenUv + revealNoiseUv);

        reveal.rgb = mix(
            reveal.rgb,
            uColor * uColorIntensity,
            mask * uColorOpacity
        );

        vec2 center = vec2(0.5);
        vec2 dir = screenUv - center;
        float r2 = dot(dir, dir);
        float k = uFisheye * uRadius;
        vec2 stretchedUv = center + dir * (1.0 + k * r2);

        float kR = k * (1.0 + uAberration.x);
        float kB = k * (1.0 - uAberration.x);
        vec2 uvR = center + dir * (1.0 + kR * r2);
        vec2 uvB = center + dir * (1.0 + kB * r2);

        float abOnly = uAberration.y * sin(uRadius * 3.14159265);
        vec2 revealUvR = center + dir * (1.0 + abOnly * r2) + revealNoiseUv;
        vec2 revealUvB = center + dir * (1.0 - abOnly * r2) + revealNoiseUv;
        float rvR = texture2D(tReveal, revealUvR).r;
        float rvG = texture2D(tReveal, screenUv + revealNoiseUv).g;
        float rvB = texture2D(tReveal, revealUvB).b;
        vec4 revealChromatic = vec4(rvR, rvG, rvB, 1.0);
        revealChromatic.rgb = mix(
            revealChromatic.rgb,
            uColor * uColorIntensity,
            mask * uColorOpacity
        );
        vec4 finalReveal = mix(reveal, revealChromatic, uGlobalAberration);

        float cr = texture2D(tDiffuse, uvR).r;
        float cg = texture2D(tDiffuse, stretchedUv).g;
        float cb = texture2D(tDiffuse, uvB).b;
        vec4 distorted = vec4(cr, cg, cb, 1.0);

        vec4 clean = texture2D(tDiffuse, screenUv);
        vec4 masked = mix(clean, distorted, mask);
        vec4 current = mix(masked, distorted, uGlobalAberration);

        vec4 composited = mix(finalReveal, current, mask);
        gl_FragColor = mix(clean, composited, uStrength);
    }


// ===== shader 23 — 037-BackgroundCanvas.Bg_NUauP.js =====
uniform sampler2D passThruTexture;

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	gl_FragColor = texture2D( passThruTexture, uv );

}


// ===== shader 24 — 037-BackgroundCanvas.Bg_NUauP.js =====

    uniform vec3 uBoxSize;
    uniform float uSpeed;
    uniform float uSwayAmount;
    uniform float uLifeSpeed;
    uniform vec3 uOffset;
    uniform float uTime;
    uniform float uCount;
    uniform float uTexSize;

    float hash11(float p) {
        p = fract(p * 0.1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        float idx = gl_FragCoord.y * uTexSize + gl_FragCoord.x;
        if (idx >= uCount) { gl_FragColor = vec4(0.0, 0.0, 0.0, -1.0); return; }

        vec4 particle = texture2D(texturePosition, uv);
        vec3 pos = particle.xyz;
        float life = particle.w;

        float lifeVar = hash11(idx + 100.0) * 0.5 + 0.75;
        life += uLifeSpeed * lifeVar;
        if (life >= 1.0) life = 0.0;

        float phase = hash11(idx + 200.0) * 6.2831;
        float t = uTime * uSpeed;
        pos.x += sin(t + phase) * uSwayAmount;
        pos.y += cos(t * 0.7 + phase) * uSwayAmount;
        pos.z += sin(t * 0.5 + phase * 1.3) * uSwayAmount;

        pos += uOffset;

        vec3 halfBox = uBoxSize * 0.5;
        pos = fract((pos + halfBox) / uBoxSize) * uBoxSize - halfBox;

        gl_FragColor = vec4(pos, life);
    }


// ===== shader 25 — 037-BackgroundCanvas.Bg_NUauP.js =====

    attribute vec2 reference;
    uniform sampler2D tPosition;
    uniform float uParticleSize;
    uniform float uFadeIn;
    uniform float uFadeOut;
    uniform float uEdgeFade;
    uniform vec3 uBoxSize;
    uniform float uPixelRatio;
    uniform float uBlurNear;
    uniform float uBlurFar;

    varying float vAlpha;
    varying float vBlurT;
    varying vec3 vWorldPos;

    void main() {
        vec4 particle = texture2D(tPosition, reference);
        if (particle.w < 0.0) { gl_Position = vec4(9999.0); gl_PointSize = 0.0; return; }

        vec3 pos = particle.xyz;
        float life = particle.w;

        float fadeIn = smoothstep(0.0, uFadeIn, life);
        float fadeOut = 1.0 - smoothstep(uFadeOut, 1.0, life);
        float lifeFade = fadeIn * fadeOut;

        vec3 halfBox = uBoxSize * 0.5;
        vec3 edgeWidth = halfBox * uEdgeFade;
        vec3 distToEdge = halfBox - abs(pos);
        float edgeFactor = min(
            smoothstep(0.0, edgeWidth.x, distToEdge.x),
            min(
                smoothstep(0.0, edgeWidth.y, distToEdge.y),
                smoothstep(0.0, edgeWidth.z, distToEdge.z)
            )
        );

        vAlpha = lifeFade * edgeFactor;
        vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        float dist = -mvPosition.z;
        vBlurT = smoothstep(uBlurNear, uBlurFar, dist);

        gl_PointSize = uParticleSize * uPixelRatio * (300.0 / dist) * lifeFade * edgeFactor;
        gl_Position = projectionMatrix * mvPosition;
    }


// ===== shader 26 — 037-BackgroundCanvas.Bg_NUauP.js =====

    uniform vec3 uColor;
    uniform float uOpacity;
    uniform sampler2D tMap;
    uniform sampler2D tBlurMap;

    #ifdef USE_FOG
        uniform vec3 uFogColor;
        uniform float uFogNear;
        uniform float uFogFar;
        uniform float uFogDensity;
        uniform float uFogDensityMode;
    #endif

    varying float vAlpha;
    varying float vBlurT;
    varying vec3 vWorldPos;

    void main() {
        vec4 col;

        #ifdef USE_PARTICLE_MAP
            vec4 sharp = texture2D(tMap, gl_PointCoord);
            vec4 blurred = texture2D(tBlurMap, gl_PointCoord);
            vec4 mapSample = mix(sharp, blurred, vBlurT);
            col = vec4(mapSample.rgb * uColor, mapSample.a * vAlpha * uOpacity);
        #else
            vec2 center = gl_PointCoord - 0.5;
            float d = length(center);
            float innerEdge = mix(0.15, 0.0, vBlurT);
            float circleAlpha = 1.0 - smoothstep(innerEdge, 0.5, d);
            col = vec4(uColor, circleAlpha * vAlpha * uOpacity);
        #endif

        #ifdef USE_FOG
            float dist = length(vWorldPos - cameraPosition);
            float fogFactor;
            if (uFogDensityMode > 0.5) {
                float dd = uFogDensity * dist;
                fogFactor = 1.0 - exp(-dd * dd);
            } else {
                fogFactor = smoothstep(uFogNear, uFogFar, dist);
            }
            col.rgb = mix(col.rgb, uFogColor, fogFactor);
        #endif

        gl_FragColor = col;
    }


// ===== shader 27 — 037-BackgroundCanvas.Bg_NUauP.js =====

    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;

    #ifdef COMPILE_DISPLACEMENT
      uniform sampler2D tDisplacement;
      uniform float uShowDisplacement;
      uniform float uDisplacementStrength;
      uniform float uDisplacementRadius;
      uniform vec3 uMouseDir;
      uniform float uMouseStrength;
    #endif

    void main() {
      vPosition = position;
      vNormal = normal;
      vUv = uv;

      vec3 pos = position;

      #ifdef COMPILE_DISPLACEMENT
        if (uShowDisplacement > 0.5) {
          vec3 norm = normalize(normal);
          vec3 vertDir = normalize(pos);
          vec4 dispSample = texture2D(tDisplacement, uv);
          float dispValue = length(dispSample.rgb);
          float cosAngle = clamp(dot(uMouseDir, vertDir), -1.0, 1.0);
          float angDist = (1.0 - cosAngle) * 0.5;
          float mouseInfluence = smoothstep(uDisplacementRadius, 0.0, angDist);
          pos += norm * dispValue * uDisplacementStrength * mouseInfluence * uMouseStrength;
        }
      #endif

      vec4 worldPos = modelMatrix * vec4(pos, 1.0);
      vWorldPos = worldPos.xyz;
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  

// ===== shader 28 — 037-BackgroundCanvas.Bg_NUauP.js =====

    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uEmissiveIntensity;

    uniform float uShowFresnel;
    uniform float uFresnelPower;
    uniform float uFresnelStrength;
    uniform float uFresnelNoiseAmount;
    uniform float uFresnelNoiseScale;
    uniform float uFresnelNoiseSpeed;

    uniform float uShowHex;
    uniform float uHexProjection;
    uniform float uHexBlendSharpness;
    uniform float uHexScale;
    uniform float uHexEdgeWidth;
    uniform float uHexOpacity;
    uniform float uHexFresnelPower;
    uniform float uHexFresnelStrength;
    uniform float uHexFresnelNoiseAmount;
    uniform float uHexFresnelNoiseScale;
    uniform float uHexFresnelNoiseSpeed;
    uniform float uHexMaskByBrighten;

    uniform float uShowFlow;
    uniform float uFlowScale;
    uniform float uFlowSpeed;
    uniform float uFlowIntensity;

    uniform float uRadius;

    #ifdef COMPILE_REVEAL
      uniform float uShowReveal;
      uniform float uRevealProgress;
      uniform float uRevealEdgeWidth;
      uniform float uRevealEdgeIntensity;
    #endif

    #ifdef COMPILE_BOTTOM_FADE
      uniform float uShowBottomFade;
      uniform float uBottomFadeStart;
    #endif

    #ifdef COMPILE_HITS
      uniform float uShowHits;
      uniform float uHitDuration;
      uniform float uHitRadius;
      uniform float uHitRingWidth;
      uniform float uHitRingIntensity;
      uniform vec4 uHitData[${qi}];
    #endif

    #ifdef COMPILE_BRIGHTEN
      uniform float uShowBrightenHover;
      uniform float uBrightenHexOnly;
      uniform float uBrightenHexSharpness;
      uniform float uBrightenAlpha;
      uniform vec3 uBrightenColor;
      uniform float uBrightenOpacity;
      uniform float uBrightenNoiseScale;
      uniform float uBrightenEdgeNoise;
      uniform float uBrightenRadius;
      uniform vec3 uMouseDir;
      uniform float uMouseStrength;
      #ifdef HAS_HOVER_MASK
        uniform sampler2D tHoverMask;
      #endif
    #endif

    #ifdef COMPILE_DISPLACEMENT
      uniform sampler2D tDisplacement;
      uniform float uShowDisplacement;
      uniform float uDisplacementColorBoost;
      uniform float uDisplacementColorBoostPower;
    #endif

    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vWorldPos;
    varying vec3 vWorldNormal;

    float hash31(vec3 p) {
      float n = dot(p, vec3(127.1, 311.7, 74.7));
      return fract(sin(n) * 43758.5453123);
    }

    float valueNoise3D(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      vec3 u = f * f * (3.0 - 2.0 * f);

      float a = hash31(i);
      float b = hash31(i + vec3(1.0, 0.0, 0.0));
      float c = hash31(i + vec3(0.0, 1.0, 0.0));
      float d = hash31(i + vec3(1.0, 1.0, 0.0));
      float e = hash31(i + vec3(0.0, 0.0, 1.0));
      float ff = hash31(i + vec3(1.0, 0.0, 1.0));
      float g = hash31(i + vec3(0.0, 1.0, 1.0));
      float h = hash31(i + vec3(1.0, 1.0, 1.0));

      return mix(
        mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
        mix(mix(e, ff, u.x), mix(g, h, u.x), u.y),
        u.z
      );
    }

    float hexGrid(vec2 uv2d, float scale) {
      vec2 p = uv2d * scale;
      vec2 s = vec2(1.0, 1.7320508);
      vec2 hs = s * 0.5;

      vec2 a = p - s * floor(p / s + 0.5);
      vec2 b = (p - hs) - s * floor((p - hs) / s + 0.5);

      float cell = dot(a, a) < dot(b, b) ? 1.0 : 0.0;
      vec2 q = mix(b, a, cell);

      float hexDist = max(abs(q.x) + abs(q.y) * 0.5773503, abs(q.y) * 1.1547005);
      return 1.0 - hexDist * 2.0;
    }

    float triPlanarHex(vec3 pos, vec3 norm, float scale, float edgeWidth, float blendSharpness) {
      vec3 blend = abs(norm);
      blend = pow(blend, vec3(blendSharpness));
      blend /= (blend.x + blend.y + blend.z);

      float hxy = hexGrid(pos.xy, scale);
      float hyz = hexGrid(pos.yz, scale);
      float hxz = hexGrid(pos.xz, scale);

      float combined = hxy * blend.z + hyz * blend.x + hxz * blend.y;
      return 1.0 - smoothstep(0.0, edgeWidth, combined);
    }

    float sphericalHex(vec3 pos, float scale, float edgeWidth) {
      vec3 dir = normalize(pos);
      float theta = atan(dir.z, dir.x);
      float phi = acos(clamp(dir.y, -1.0, 1.0));
      vec2 coord = vec2(theta * sin(phi), phi);
      float hex = hexGrid(coord, scale);
      return 1.0 - smoothstep(0.0, edgeWidth, hex);
    }

    void main() {
      vec3 pos = vPosition;
      vec3 norm = normalize(vNormal);
      vec3 worldNorm = normalize(vWorldNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPos);

      float intensity = 0.0;

      float brightenMask = 0.0;
      #ifdef COMPILE_BRIGHTEN
        if (uShowBrightenHover > 0.5) {
          #ifdef HAS_HOVER_MASK
            vec4 maskSample = texture2D(tHoverMask, vUv);
            float baseRaw = clamp(length(maskSample.rgb), 0.0, 1.0);
            float shapePow = clamp(2.85 - uBrightenRadius * 2.45, 0.2, 3.5);
            float baseMask = pow(baseRaw, shapePow);
            float edgeWeight = clamp(baseMask * (1.0 - baseMask) * 4.0, 0.0, 1.0);
            vec3 noiseSample = vec3(vUv * uBrightenNoiseScale, uTime * 0.1);
            float nSigned = valueNoise3D(noiseSample) * 2.0 - 1.0;
            float jitter = nSigned * edgeWeight * uBrightenEdgeNoise;
            brightenMask = clamp(baseMask + jitter, 0.0, 1.0);
          #else
            vec3 fragDir = normalize(pos);
            float cosAngle = clamp(dot(uMouseDir, fragDir), -1.0, 1.0);
            float angDist = (1.0 - cosAngle) * 0.5;
            float baseMask = smoothstep(uBrightenRadius, 0.0, angDist) * uMouseStrength;
            float edgeWeight = clamp(baseMask * (1.0 - baseMask) * 4.0, 0.0, 1.0);
            vec3 noiseSample = vec3(vUv * uBrightenNoiseScale, uTime * 0.1);
            float nSigned = valueNoise3D(noiseSample) * 2.0 - 1.0;
            float jitter = nSigned * edgeWeight * uBrightenEdgeNoise;
            brightenMask = clamp(baseMask + jitter, 0.0, 1.0);
          #endif
        }
      #endif

      #ifdef COMPILE_FRESNEL
        if (uShowFresnel > 0.5) {
          float NdotV = clamp(dot(worldNorm, viewDir), 0.0, 1.0);
          float fresnel = pow(1.0 - NdotV, uFresnelPower) * uFresnelStrength;

          vec3 fresnelNoiseSample = pos * uFresnelNoiseScale + vec3(
            uTime * uFresnelNoiseSpeed,
            uTime * uFresnelNoiseSpeed * 0.7,
            uTime * uFresnelNoiseSpeed * 0.3
          );
          float fresnelNoise = valueNoise3D(fresnelNoiseSample) * 2.0 - 1.0;
          fresnel *= 1.0 + fresnelNoise * uFresnelNoiseAmount;

          intensity += fresnel;
        }
      #endif

      #ifdef COMPILE_FLOW
        if (uShowFlow > 0.5) {
          vec3 flowSample = pos * uFlowScale + vec3(
            uTime * uFlowSpeed,
            uTime * uFlowSpeed * 0.7,
            0.0
          );
          float flow = valueNoise3D(flowSample) * uFlowIntensity;
          intensity += flow;
        }
      #endif

      float hexEdge = 0.0;
      #if defined(COMPILE_HEX) || defined(COMPILE_BRIGHTEN)
        if (uHexProjection > 0.5) {
          hexEdge = sphericalHex(pos, uHexScale, uHexEdgeWidth);
        } else {
          hexEdge = triPlanarHex(pos, norm, uHexScale, uHexEdgeWidth, uHexBlendSharpness);
        }
      #endif

      #ifdef COMPILE_HEX
        if (uShowHex > 0.5) {
          float hex = hexEdge * uHexOpacity;

          float hexNdotV = clamp(dot(worldNorm, viewDir), 0.0, 1.0);
          float hexFresnel = pow(1.0 - hexNdotV, uHexFresnelPower);
          float hexFresnelFactor = (1.0 - uHexFresnelStrength) + hexFresnel * uHexFresnelStrength;
          hex *= hexFresnelFactor;

          vec3 hexNoiseSample = pos * uHexFresnelNoiseScale + vec3(
            uTime * uHexFresnelNoiseSpeed,
            uTime * uHexFresnelNoiseSpeed * 0.7,
            uTime * uHexFresnelNoiseSpeed * 0.3
          );
          float hexNoise = valueNoise3D(hexNoiseSample) * 2.0 - 1.0;
          hex *= clamp(1.0 + hexNoise * uHexFresnelNoiseAmount, 0.0, 2.0);

          #ifdef COMPILE_BRIGHTEN
            if (uHexMaskByBrighten > 0.5 && uShowBrightenHover > 0.5) {
              hex *= brightenMask;
            }
          #endif

          intensity += hex;
        }
      #endif

      #ifdef COMPILE_HITS
        if (uShowHits > 0.5) {
          float hitGlow = 0.0;
          for (int i = 0; i < ${qi}; i++) {
            vec4 hitData = uHitData[i];
            vec3 hitPos = hitData.xyz;
            float hitTime = hitData.w;

            float active = step(0.001, hitTime);

            vec3 hitDir = normalize(hitPos);
            vec3 fragDir = normalize(pos);
            float cosAngle = clamp(dot(hitDir, fragDir), -1.0, 1.0);
            float angDist = (1.0 - cosAngle) * 0.5;

            float ringPos = hitTime * uHitRadius;
            float ringDist = abs(angDist - ringPos);
            float ring = smoothstep(uHitRingWidth, 0.0, ringDist);

            float fade = (1.0 - hitTime) * uHitRingIntensity;

            hitGlow += ring * fade * active;
          }
          intensity += hitGlow;
        }
      #endif

      float revealGlow = 0.0;
      #ifdef COMPILE_REVEAL
        if (uShowReveal > 0.5) {
          float normalizedY = pos.y / uRadius * 0.5 + 0.5;
          float revealEdgeDist = abs(normalizedY - uRevealProgress);
          revealGlow = smoothstep(uRevealEdgeWidth, 0.0, revealEdgeDist) * uRevealEdgeIntensity;
        }
      #endif
      intensity += revealGlow;

      #ifdef COMPILE_DISPLACEMENT
        if (uShowDisplacement > 0.5) {
          vec4 dispSample = texture2D(tDisplacement, vUv);
          float dispValue = length(dispSample.rgb);
          float boost = pow(clamp(dispValue, 0.0, 1.0), uDisplacementColorBoostPower) * uDisplacementColorBoost;
          intensity += boost;
        }
      #endif

      vec3 baseTint = uColor;

      #ifdef COMPILE_BRIGHTEN
        if (uShowBrightenHover > 0.5) {
          float addBrighten = brightenMask * uBrightenOpacity;
          if (uBrightenHexOnly > 0.5) {
            addBrighten *= pow(hexEdge, uBrightenHexSharpness);
          }
          baseTint += uBrightenColor * addBrighten;
        }
      #endif

      float alpha = clamp(intensity * uOpacity, 0.0, 1.0);

      #ifdef COMPILE_BRIGHTEN
        if (uShowBrightenHover > 0.5) {
          if (uBrightenHexOnly > 0.5) {
            float hexFactor = pow(hexEdge, uBrightenHexSharpness);
            float brightenAreaAlpha = hexFactor * uBrightenAlpha;
            alpha = alpha * (1.0 - brightenMask) + brightenAreaAlpha * brightenMask;
          } else {
            alpha += brightenMask * uBrightenAlpha;
          }
        }
      #endif

      #ifdef COMPILE_REVEAL
        if (uShowReveal > 0.5) {
          float normalizedY = pos.y / uRadius * 0.5 + 0.5;
          float revealMask = 1.0 - smoothstep(uRevealProgress - uRevealEdgeWidth, uRevealProgress, normalizedY);
          alpha *= revealMask;
        }
      #endif

      #ifdef COMPILE_BOTTOM_FADE
        if (uShowBottomFade > 0.5) {
          float bottomFade = smoothstep(uBottomFadeStart, uBottomFadeStart + 0.3, pos.y);
          alpha *= bottomFade;
        }
      #endif

      gl_FragColor = vec4(baseTint, alpha);
    }
  

// ===== shader 29 — 037-BackgroundCanvas.Bg_NUauP.js =====

    attribute float aSide;
    attribute vec2  aLineUv;
    attribute vec2  aTexCoord;
    attribute vec2  aPrevTexCoord;
    attribute vec2  aNextTexCoord;

    uniform sampler2D tPositions;
    uniform float     uLineWidth;
    uniform vec2      uResolution;
    uniform float     uTaper;

    varying vec2 vLineUv;

    vec2 toScreen(vec4 p, float aspect) {
      vec2 r = p.xy / p.w;
      r.x *= aspect;
      return r;
    }

    void main() {
      float aspect = uResolution.x / uResolution.y;

      mat4 mvp = projectionMatrix * modelViewMatrix;

      vec4  posData = texture2D(tPositions, aTexCoord);
      vec4  cur  = mvp * vec4(posData.xyz, 1.0);
      vec4  prev = mvp * vec4(texture2D(tPositions, aPrevTexCoord).xyz, 1.0);
      vec4  next = mvp * vec4(texture2D(tPositions, aNextTexCoord).xyz, 1.0);

      vec2 dir = normalize(toScreen(next, aspect) - toScreen(prev, aspect));

      float taper = 1.0;
      if (uTaper > 0.0) {
        float p = aLineUv.x;
        taper = smoothstep(0.0, uTaper, p) * smoothstep(0.0, uTaper, 1.0 - p);
      }

      cur.xy += vec2(-dir.y / aspect, dir.x) * uLineWidth * aSide * posData.a * taper;

      vLineUv = aLineUv;
      gl_Position = cur;
    }
  

// ===== shader 30 — 037-BackgroundCanvas.Bg_NUauP.js =====

    uniform vec3  uColor;
    uniform float uOpacity;
    uniform float uAlphaTest;

    varying vec2 vLineUv;

    void main() {
      float edgeDist = abs(vLineUv.y - 0.5) * 2.0;
      float alpha = uOpacity * (1.0 - smoothstep(0.85, 1.0, edgeDist));
      if (alpha < uAlphaTest) discard;
      gl_FragColor = vec4(uColor, alpha);
    }
  

// ===== shader 31 — 037-BackgroundCanvas.Bg_NUauP.js =====

    uniform sampler2D tInfo;

    void main() {
      vec2  uv      = gl_FragCoord.xy / resolution.xy;
      vec4  current = texture2D(tPosition, uv);
      vec4  info    = texture2D(tInfo, uv);

      vec3  pos    = current.xyz;
      float isHead = info.z;

      if (isHead >= 1.0) {
        pos.x += 0.1;
      } else {
        vec3 prev = texture2D(tPosition, info.xy).xyz;
        pos += (prev - pos) * 0.05;
      }

      gl_FragColor = vec4(pos, current.w);
    }
  

// ===== shader 32 — 037-BackgroundCanvas.Bg_NUauP.js =====

    uniform sampler2D tInfo;
    uniform sampler2D tInstanceOffset;
    uniform sampler2D tInstanceParams;

    uniform float uTime;
    uniform float uSpeed;
    uniform vec3  uBoxSize;
    uniform vec3  uWindDirection;
    uniform float uLineLength;
    uniform float uFadeIn;
    uniform float uFadeOut;

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;

      vec4 info       = texture2D(tInfo, uv);
      vec4 instOffset = texture2D(tInstanceOffset, uv);
      vec4 instParams = texture2D(tInstanceParams, uv);

      float progress   = info.w;
      vec3  offset     = instOffset.xyz;
      float phase      = instOffset.w;
      float speedMult  = instParams.x;
      float lengthMult = instParams.y;

      vec3  halfBox   = uBoxSize * 0.5;
      float boxExtent = dot(abs(uWindDirection), uBoxSize);
      float life      = fract(uTime * uSpeed * speedMult + phase);

      vec3 center  = offset + uWindDirection * life * boxExtent;
      vec3 wrapped = fract((center + halfBox) / uBoxSize) * uBoxSize - halfBox;

      float lineLen = uLineLength * lengthMult;
      vec3  pos     = wrapped + uWindDirection * (progress - 0.5) * lineLen;

      float fadeIn  = smoothstep(0.0, uFadeIn, life);
      float fadeOut = 1.0 - smoothstep(uFadeOut, 1.0, life);

      gl_FragColor = vec4(pos, fadeIn * fadeOut);
    }
  

// ===== shader 33 — 037-BackgroundCanvas.Bg_NUauP.js =====

    attribute float aSide;
    attribute vec2  aLineUv;
    attribute vec2  aTexCoord;
    attribute vec2  aPrevTexCoord;
    attribute vec2  aNextTexCoord;

    uniform sampler2D tPositions;
    uniform float     uLineWidth;
    uniform vec2      uResolution;
    uniform float     uTaper;

    varying vec2  vLineUv;
    varying float vFade;

    vec2 toScreen(vec4 p, float aspect) {
      vec2 r = p.xy / p.w;
      r.x *= aspect;
      return r;
    }

    void main() {
      float aspect = uResolution.x / uResolution.y;
      mat4  mvp    = projectionMatrix * modelViewMatrix;

      vec4 posData = texture2D(tPositions, aTexCoord);
      vec4 cur     = mvp * vec4(posData.xyz, 1.0);
      vec4 prev    = mvp * vec4(texture2D(tPositions, aPrevTexCoord).xyz, 1.0);
      vec4 next    = mvp * vec4(texture2D(tPositions, aNextTexCoord).xyz, 1.0);

      vec2 dir = normalize(toScreen(next, aspect) - toScreen(prev, aspect));

      float taper = 1.0;
      if (uTaper > 0.0) {
        float p = aLineUv.x;
        taper = smoothstep(0.0, uTaper, p) * smoothstep(0.0, uTaper, 1.0 - p);
      }

      cur.xy += vec2(-dir.y / aspect, dir.x) * uLineWidth * aSide * taper;

      vLineUv = aLineUv;
      vFade   = posData.a;
      gl_Position = cur;
    }
  

// ===== shader 34 — 037-BackgroundCanvas.Bg_NUauP.js =====

    uniform vec3  uColor;
    uniform float uOpacity;
    uniform float uAlphaTest;

    varying vec2  vLineUv;
    varying float vFade;

    void main() {
      float edgeDist = abs(vLineUv.y - 0.5) * 2.0;
      float edge  = 1.0 - smoothstep(0.85, 1.0, edgeDist);
      float alpha = uOpacity * vFade * edge;
      if (alpha < uAlphaTest) discard;
      gl_FragColor = vec4(uColor, alpha);
      // gl_FragColor = vec4(1.,0.,0.,1.);
    }
  