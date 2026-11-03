// ===== shader 1 — 011-hoisted.B1SGfLJ6.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 011-hoisted.B1SGfLJ6.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 011-hoisted.B1SGfLJ6.js =====
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
		

// ===== shader 4 — 011-hoisted.B1SGfLJ6.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 5 — 011-hoisted.B1SGfLJ6.js =====


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
	

// ===== shader 6 — 011-hoisted.B1SGfLJ6.js =====

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

// ===== shader 7 — 011-hoisted.B1SGfLJ6.js =====


		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

// ===== shader 8 — 011-hoisted.B1SGfLJ6.js =====


		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}

// ===== shader 9 — 011-hoisted.B1SGfLJ6.js =====

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

// ===== shader 10 — 011-hoisted.B1SGfLJ6.js =====


		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

// ===== shader 11 — 011-hoisted.B1SGfLJ6.js =====


		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}

// ===== shader 12 — 011-hoisted.B1SGfLJ6.js =====
varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}

// ===== shader 13 — 011-hoisted.B1SGfLJ6.js =====
varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}

// ===== shader 14 — 011-hoisted.B1SGfLJ6.js =====
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

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}

// ===== shader 15 — 011-hoisted.B1SGfLJ6.js =====


		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

// ===== shader 16 — 011-hoisted.B1SGfLJ6.js =====


		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}

// ===== shader 17 — 011-hoisted.B1SGfLJ6.js =====

        varying vec2 vUv;
        void main() {
          vUv = vec2(uv.x, uv.y);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      

// ===== shader 18 — 011-hoisted.B1SGfLJ6.js =====

        uniform float mixRatio;

        uniform sampler2D tDiffuse1;
        uniform sampler2D tDiffuse2;
        uniform sampler2D tMixTexture;

        uniform int useTexture;   // 1이면 기존 텍스처 마스크 전환
        uniform float threshold;  // 텍스처 마스크용

        // ★ 패턴 전환용
        uniform int pattern;      // 0..4
        uniform vec2  uCenter;
        uniform float uFeather;
        uniform vec2  uRes;
        uniform int   uDir;

        uniform float uSpinTurns;
        uniform float uStartAngle;
        uniform vec2  uRectSize0;
        uniform float uRectOversize;
        uniform vec2  uRectScale;

        varying vec2 vUv;

        // -------- util ----------
        float aspectCorrectedDistance(vec2 a, vec2 b) {
          float aspect = uRes.x / max(uRes.y, 1.0);
          vec2 d = a - b; d.x *= aspect;
          return length(d);
        }
        float maxRadiusToCover(vec2 center) {
          float d0 = aspectCorrectedDistance(center, vec2(0.0, 0.0));
          float d1 = aspectCorrectedDistance(center, vec2(1.0, 0.0));
          float d2 = aspectCorrectedDistance(center, vec2(0.0, 1.0));
          float d3 = aspectCorrectedDistance(center, vec2(1.0, 1.0));
          return max(max(d0, d1), max(d2, d3));
        }
        float sdfBox(vec2 p, vec2 b) {
          vec2 q = abs(p) - b;
          return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
        }
        float pixelEpsilonBase() {
          float aspect = uRes.x / max(uRes.y, 1.0);
          float ex = aspect / max(uRes.x, 1.0);
          float ey = 1.0    / max(uRes.y, 1.0);
          return max(ex, ey);
        }

        // ------ patterns -------
        float circleReveal(vec2 uv, vec2 center, float p, float feather) {
          float maxR = maxRadiusToCover(center);
          float d = aspectCorrectedDistance(uv, center);
          float f = max(0.0, feather);
          float r = (maxR + f) * clamp(p, 0.0, 1.0);
          if (f < 1e-6) return d < r ? 1.0 : 0.0;
          float edge0 = r - f;
          float edge1 = r;
          return clamp(1.0 - smoothstep(edge0, edge1, d), 0.0, 1.0);
        }
        float horizontalReveal(vec2 uv, float p, int dir) {
          float t = clamp(p, 0.0, 1.0);
          float x = (dir >= 0) ? uv.x : (1.0 - uv.x);
          return step(x, t);
        }
        float verticalReveal(vec2 uv, float p, int dir) {
          float t = clamp(p, 0.0, 1.0);
          float y = (dir >= 0) ? (1.0 - uv.y) : uv.y;
          return step(y, t);
        }
        float spinRectReveal(vec2 uv, vec2 center, float p, float feather,
                             float startAngle, float turns, vec2 size0,
                             float oversize, vec2 rectScale) {
          p = clamp(p, 0.0, 1.0);
          if (p <= 1e-6) return 0.0;

          vec2 q = uv - center;
          float angle = startAngle + float(uDir) * (turns * 6.28318530718) * p;
          float ca = cos(angle), sa = sin(angle);
          mat2 R = mat2(ca, -sa, sa, ca);
          vec2 pr = R * q;

          float maxR = maxRadiusToCover(center) * oversize;
          vec2 size1 = vec2(maxR) * rectScale;
          vec2 b = mix(size0, size1, p);

          float d = sdfBox(pr, b);

          float f = max(0.0, feather);
          if (f <= 1e-6) {
            float eps = pixelEpsilonBase() * p;
            return step(d, eps);
          }
          return clamp(1.0 - smoothstep(0.0, f, d), 0.0, 1.0);
        }

        void main() {
          vec4 texel1 = texture2D( tDiffuse1, vUv );
          vec4 texel2 = texture2D( tDiffuse2, vUv );


          // --- 경로 2) 패턴 기반 전환 (useTexture == 0) ---
          float p = mixRatio;                // 기존 mixRatio를 그대로 전환 진행도로 사용
          float feather = clamp(uFeather, 0.0, 0.5);

          float mask = 0.0;
          if (pattern == 0) {
            mask = p; // linear
          } else if (pattern == 1) {
            mask = circleReveal(vUv, uCenter, p, feather);
          } else if (pattern == 2) {
            mask = horizontalReveal(vUv, p, uDir);
          } else if (pattern == 3) {
            mask = verticalReveal(vUv, p, uDir);
          } else if (pattern == 4) {
            mask = spinRectReveal(vUv, uCenter, p, feather,
                                  uStartAngle, uSpinTurns, uRectSize0,
                                  uRectOversize, uRectScale);
          } else {
            mask = p;
          }

          gl_FragColor = mix(texel1, texel2, mask);
        }
      

// ===== shader 19 — 011-hoisted.B1SGfLJ6.js =====

        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      

// ===== shader 20 — 011-hoisted.B1SGfLJ6.js =====


        #define PI 3.1415926535897932384626433832795
        precision mediump float;

        uniform sampler2D tDiffuse;
        // uniform sampler2D tLogoTexture;
        // uniform sampler2D tLogoMapTexture;

        uniform vec2  uCenter;
        uniform vec2  uLogoTexSize;
        uniform float uAspect;
        uniform float uTime;
        uniform float uAmplitude;
        uniform float uFrequency;
        uniform float uSpeed;

        uniform float uRingWidth;
        uniform float uProgress;
        uniform float uRingFeather;
        uniform float uDistortAmp;
        
        uniform float tMapDist;

        varying vec2 vUv;

        float maxRadius(vec2 center, float aspect) {
          // 화면 중심(center) 기준 최대 반경 (종횡비 보정)
          vec2 toEdge = max(center, 1.0 - center);
          vec2 diag = vec2(toEdge.x * aspect, toEdge.y);
          return length(diag);
        }

        float ringDonut(float r, float rMax, float progress, float ringWidth, float ringFeather){
          float p = clamp(progress, 0.0, 1.0);
          if (p <= 0.0) return 0.0;

          float fe = ringFeather + fwidth(r);

          float outerR_nominal = rMax * p;
          float outerR_mask    = outerR_nominal - fe;

          float w_mask = max(ringWidth - 2.0 * fe, 0.0);
          float innerR_mask = max(0.0, outerR_mask - w_mask);

          float innerMask = smoothstep(innerR_mask - fe, innerR_mask + fe, r);
          float outerMask = 1.0 - smoothstep(outerR_mask - fe, outerR_mask + fe, r);
          float ring = innerMask * outerMask;

          float fadeStart = ringWidth / max(rMax, 1e-6);
          float fade = smoothstep(0.0, fadeStart, p);
          return ring * fade;
        }


        void main() {
          // 보정 좌표계
          vec2  p  = vUv - uCenter;
          vec2  ps = vec2(p.x * uAspect, p.y);

          vec2 rippleUv = vUv;

          float r2  = dot(ps, ps);
          float inv = inversesqrt(max(r2, 1e-12));
          float r   = r2 * inv;
          vec2  dirS = ps * inv; // 보정좌표계 단위벡터

          // float rMax = maxRadius(uCenter, uAspect);
          float rMax = maxRadius(vec2(0.0), uAspect);

          float ring = ringDonut(r, rMax, uProgress, uRingWidth, uRingFeather);

          // offset은 한 번만
          vec2 offset = vec2(dirS.x / max(uAspect, 1e-6), dirS.y) * (ring * uDistortAmp);

          vec4 col = texture2D(tDiffuse, vUv + offset * 0.4);
          // col.rgb += ring * 0.1; // highlight
          gl_FragColor = col;
        }

      

// ===== shader 21 — 011-hoisted.B1SGfLJ6.js =====

    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    

// ===== shader 22 — 011-hoisted.B1SGfLJ6.js =====


    uniform sampler2D tDiffuse;
    uniform float strength;
    uniform float opacity;
    uniform float stepScale;
    uniform vec2 center;
    uniform vec2 resolution;

    varying vec2 vUv;

    float random(vec3 scale, float seed){
      return fract(sin(dot(gl_FragCoord.stp + seed, scale)) * 43758.5453 + seed);
    }


    void main() {
      if(strength == 0.0){
        gl_FragColor=texture2D(tDiffuse,vUv);

      }else{

        vec4 color = vec4(0.0);
        vec2 toCenter = center - vUv * resolution;
        // vec2 invRes   = 1.0 / max(resolution, vec2(1.0)); // 나눗셈 1회로

        float offset = random(vec3(12.9898,78.233,151.7182), 0.0);
        float total  = 0.0;

        // 튜닝 노브
        const float SCALE = 1.1; 
        const float HEAD  = 0.1; 
        const float CURVE = 1.0; 

        for (float t = 0.0; t <= stepScale; t++) {
          // 균등 진행도 [0..1]
          float u = (t + offset) / stepScale;

          // 뒤쪽으로 몰기 + 시작부 skip
          float p = mix(HEAD, 1.0, pow(clamp(u, 0.0, 1.0), CURVE)); // [HEAD..1]
          float percent = p * SCALE;                                 // 거리만 확장

          // 가중치는 0..1에서 안정적으로(음수 방지)
          float w = p * (1.0 - p);

          vec2 uv = vUv + toCenter * (percent * strength) / (SCALE * resolution);
          uv = clamp(uv, 0.0, 1.0); // 에지 아티팩트 완화(선택)

          vec4 tColor = texture2D(tDiffuse, uv);
          tColor.rgb *= tColor.a;

          color += tColor * w;
          total += w;
        }


        // 아래 정규화/알파 라인은 네 기존 코드 그대로 사용
        // gl_FragColor = color/total; gl_FragColor.rgb /= gl_FragColor.a; gl_FragColor.a = opacity;

        gl_FragColor=color/total;
        gl_FragColor.rgb/=gl_FragColor.a;
        gl_FragColor.a = opacity;
      }

    }
    

// ===== shader 23 — 011-hoisted.B1SGfLJ6.js =====

        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;
        void main() {
          vUv = uv;
          vec3 newPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      

// ===== shader 24 — 011-hoisted.B1SGfLJ6.js =====

        #define PI 3.141592653589793

        varying vec2 vUv;

        uniform vec2 uMouse;
        uniform float uTime;
        uniform float uScale;
        uniform float uNoise;
        uniform float uBrightness;
        uniform float uColorIntensity;
        uniform float uColorsTotal;
        uniform float uRotate;

        uniform sampler2D tLogoTexture;
        uniform float uLogoAlpha;
        uniform float uLogoFreq;
        uniform vec2 uLogoResolution;

        uniform float uN1;
        uniform float uN2;
        uniform float uN3;

        uniform vec2  uCenter;             // 0~1, 중앙은 vec2(0.5)
        uniform float uRippleAmp;          // 변위 강도 (px 기준을 uv로 환산함)
        uniform float uRippleFreq;         // 파수 (커질수록 링이 촘촘)
        uniform float uRippleSpeed;        // 파속
        uniform float uRippleDamp;         // 감쇠(멀어질수록 감소), 0~5 권장
        uniform float uRippleIntensity;         // 감쇠(멀어질수록 감소), 0~5 권장


        uniform vec3 uColors[${this.offset.uColors.length}];

        uniform vec2 uResolution;

        float random (in vec2 st) {
          return fract(sin(dot(st.xy,
                               vec2(12.9898,78.233)))
                      * 43758.5453123);
        }
      
    
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          vec2 u = f*f*(3.0-2.0*f);
          return mix( mix( random( i + vec2(0.0,0.0) ),
                           random( i + vec2(1.0,0.0) ), u.x),
                      mix( random( i + vec2(0.0,1.0) ),
                           random( i + vec2(1.0,1.0) ), u.x), u.y);
        }
        
        mat2 rotate2d(float angle){
            return mat2(cos(angle),-sin(angle),
                        sin(angle),cos(angle));
        }

        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec2 mod289(vec2 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec3 permute(vec3 x) {
          return mod289(((x*34.0)+10.0)*x);
        }

        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                              0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                            -0.577350269189626,  // -1.0 + 2.0 * C.x
                              0.024390243902439); // 1.0 / 41.0
          // First corner
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);

          // Other corners
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;

          // Permutations
          i = mod289(i); // Avoid truncation effects in permutation
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));

          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;

          // Gradients: 41 points uniformly over a line, mapped onto a diamond.
          // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;

          // Normalise gradients implicitly by scaling m
          // Approximation of: m *= inversesqrt( a0*a0 + h*h );
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

          // Compute final noise value at P
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          float time = uTime * 0.1;
          vec2 uv = vUv;
          uv -= 0.5;
          uv *= uScale;
          float aspect = uResolution.x/uResolution.y;
          uv.x *= aspect;

          /*
            ripple
          */

          vec2 rippleUv = vUv;
          rippleUv-= 0.5;
          rippleUv.x *= aspect;
          rippleUv += 0.5;
          vec2 c = vec2(0.5);
          vec2 p = rippleUv - c;

          float r = length(p);
          float phase = r * uRippleFreq - time * uRippleSpeed;
          float env   = exp(r * uRippleDamp); 
          float wave  = sin(phase) * env;
          wave *= uRippleIntensity;
          wave = smoothstep(0.0, 1.0, wave);
          wave *= snoise(rippleUv+time);


          /*
            logo
          */
          vec2 logoUv = vUv ;
          float logoAspect = uLogoResolution.x/uLogoResolution.y;
          logoUv -= 0.5;
          // logoUv.x *= logoAspect;
          // logoUv.x *= wave;
          logoUv.x *= aspect;
          logoUv /= 0.7;
          logoUv += 0.5;

          vec4 logoColor = texture2D(tLogoTexture, logoUv);
          float logo = (logoColor.a * uLogoAlpha); 


          /*
            noise
          */

          vec2 noiseUv = uv;
          vec2 noiseUv1 = noiseUv;
          vec2 noiseUv2 = noiseUv;

          vec3 color1 = uColors[0];
          vec3 color2 = uColors[1];
          vec3 color3 = uColors[2];

          vec3 destColor = uColors[0];
          float noiseF1 = (snoise(noiseUv1+time) + 1.0)/2.0;
          float noiseF2 = (snoise(noiseUv2-time) + 1.0)/2.0;
          noiseF1 *= uN1;
          noiseF2 *= uN2;

          noiseF1 += noiseF2 * 1.0;

          destColor = mix(destColor, color2, noiseF1);

          destColor = mix(destColor, color3*(1.0 + uN3), 1.0-noiseF1);
          destColor = pow(destColor,vec3(1.0 + uColorIntensity));
          
          
          float finalNoise = random(uv/0.1)*uNoise;
          destColor += finalNoise;
          
          
          float logoNoise = logoColor.a * snoise((logoUv/uLogoFreq)+time) * uLogoAlpha;
          destColor += (logo + logoNoise);


          gl_FragColor = vec4(destColor*uBrightness+wave, 1.0);
        }
      

// ===== shader 25 — 011-hoisted.B1SGfLJ6.js =====

        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      

// ===== shader 26 — 011-hoisted.B1SGfLJ6.js =====

        precision highp float;

        varying vec2 vUv;
        uniform sampler2D tDiffuse;
        uniform vec2 uFitRatio;
        uniform float uOpacity;
        uniform float uBackColorUse;
        uniform float uFlipX;

        uniform vec3  uTint;
        uniform float uGrayAmount;
        uniform float uUseColorGrading;

        void main() {
          vec2 fitUv = vec2(
            vUv.x * uFitRatio.x + (1.0 - uFitRatio.x) * 0.5,
            vUv.y * uFitRatio.y + (1.0 - uFitRatio.y) * 0.5
          );

          if (uFlipX > 0.5) {
            fitUv.x = 1.0 - fitUv.x;
          }

          vec4 colorFront = texture2D( tDiffuse, fitUv );
          vec3 colorBack  = vec3(0.0, 0.0, 0.0);

          vec3 finalColor = gl_FrontFacing ? colorFront.rgb : mix(colorFront.rgb,colorBack,uBackColorUse);

          if(uUseColorGrading == 1.0) {
            vec3 colorGrading = finalColor;
            colorGrading *= uTint;
            float gray = dot(colorGrading, vec3(0.2126, 0.7152, 0.0722));
            vec3 gcol = vec3(gray);
            gcol = mix(gcol, pow(gcol, vec3(1.0)), 0.15);
            finalColor = mix(colorGrading, gcol, clamp(uGrayAmount, 0.0, 1.0));
          }

          gl_FragColor = vec4(finalColor, colorFront.a);
          gl_FragColor.a = uOpacity;
        }
      

// ===== shader 27 — 011-hoisted.B1SGfLJ6.js =====

        varying vec2 vUv;
        void main(){
          vec2 ndc = position.xy;   // -1..+1
          vUv = ndc * 0.5 + 0.5;    // 0..1
          gl_Position = vec4(ndc, 0.0, 1.0);
        }
      

// ===== shader 28 — 011-hoisted.B1SGfLJ6.js =====

        varying vec2 vUv;
        uniform vec3 uInnerColor, uOuterColor;
        uniform vec2 uCenterUV, uResolution; // aspect 계산용으로만 사용
        uniform float uRadius, uFeather, uGamma, uOpacity;

        void main(){
          // UV 공간 + 종횡비 보정(원 유지)
          float aspect = uResolution.x / uResolution.y;
          vec2 p = vUv - uCenterUV;
          p.x *= aspect;
          float d = length(p);

          float edge0 = max(0.0001, uRadius - uFeather);
          float edge1 = uRadius + uFeather;
          float t = smoothstep(edge0, edge1, d);
          // GLSL 명세상 pow(x, y) 는 x == 0 && y <= 0 에서 정의되지 않는다.
          // 대부분의 GPU 가 pow 를 exp2(y * log2(x)) 로 구현하므로
          // pow(0, 0) = exp2(0 * -inf) = NaN 이 된다.
          // uCenterUV 에 프래그먼트 샘플이 정확히 떨어지면(드로잉 버퍼의
          // 가로·세로가 모두 홀수일 때) d == 0 → t == 0 이 되고,
          // chapter1 은 uGamma 를 0 으로 쓰므로 그 픽셀이 NaN 이 된다.
          // NaN 은 bloom 의 밉 체인을 타고 번져 화면 전체를 검게 만든다.
          // 밑을 0 에서 떼어두면 어떤 감마에서도 정의된다.
          t = pow(max(clamp(t, 0.0, 1.0), 1e-6), uGamma);

          vec3 col = mix(uInnerColor, uOuterColor, t);
          gl_FragColor = vec4(col, uOpacity);
        }

      

// ===== shader 29 — 011-hoisted.B1SGfLJ6.js =====

  varying vec2 vUv;
  void main(){
    vUv = uv;
    // standard modelView path (fog uses mvPosition depth)
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }


// ===== shader 30 — 011-hoisted.B1SGfLJ6.js =====


  uniform sampler2D uTex;

  uniform vec2  uResolution;        // plane size (px 또는 비율)
  uniform vec2  uTextureResolution; // texture size (px)

  uniform vec2  uAlign;     // (0..1,0..1) left/bottom=0, center=0.5, right/top=1
  uniform float uScale;     // extra zoom (1=none, >1 more crop)

  uniform vec3  uTint;      // multiply
  uniform float uTintAmount;
  uniform float uGrayAmount;// 0..1
  
  uniform float uGrayGamma;   // 기본 1.0 (감마)
  uniform float uGrayGain;    // 기본 1.0 (밝기 스케일)
  uniform float uGrayBias;    // 기본 0.0 (밝기 오프셋)
  
  uniform float uOpacity;   // 0..1
  
  varying vec2 vUv;


  float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

  void main(){

    vec2 ratio = vec2(
      min((uResolution.x / uResolution.y) / (uTextureResolution.x / uTextureResolution.y), 1.0),
      min((uResolution.y / uResolution.x) / (uTextureResolution.y / uTextureResolution.x), 1.0));

    vec2 fitUv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 src = texture2D(uTex, fitUv);

    // vec3 col = src.rgb * mix(vec3(1.0), uTint, uTintAmount);
    // float g = luma(col);
    // g = pow(max(g, 1e-6), max(uGrayGamma, 1e-6));
    // g = g * uGrayGain + uGrayBias;
    // g = clamp(g, 0.0, 1.0);

    // vec3 grayCol = vec3(g);
    // col = mix(col, grayCol, clamp(uGrayAmount, 0.0, 1.0));
    // gl_FragColor = vec4(col, src.a * uOpacity);

    vec3 baseCol = src.rgb;

    // ① 먼저 grayscale 변환 (gray 우선)
    float g = luma(baseCol);
    g = pow(max(g, 1e-6), max(uGrayGamma, 1e-6));
    g = g * uGrayGain + uGrayBias;
    g = clamp(g, 0.0, 1.0);
    vec3 grayCol = vec3(g);

    // ② grayAmount 만큼 원본색과 섞음
    float grayAmt = clamp(uGrayAmount, 0.0, 1.0);
    vec3 grayMixed = mix(baseCol, grayCol, grayAmt);

    // ③ 그 위에 tint 적용 (보정된 색조)
    float tintAmt = clamp(uTintAmount, 0.0, 1.0);
    vec3 tinted = grayMixed * mix(vec3(1.0), uTint, tintAmt);

    // ④ 출력
    gl_FragColor = vec4(tinted, src.a * uOpacity);


  }


// ===== shader 31 — 011-hoisted.B1SGfLJ6.js =====

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vPlaneRight;
  varying vec3 vPlaneUp;
  varying vec3 vPlaneFwd;
  void main() {
    vec4 wpos = modelMatrix * vec4(position, 1.0);
    vWorldPos = wpos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vUv = uv;
    vPlaneRight = normalize((modelMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz);
    vPlaneUp    = normalize((modelMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
    vPlaneFwd   = normalize((modelMatrix * vec4(0.0, 0.0, -1.0, 0.0)).xyz);
    gl_Position = projectionMatrix * viewMatrix * wpos;
  }


// ===== shader 32 — 011-hoisted.B1SGfLJ6.js =====

  precision highp float;

  uniform int   uUseImage;      // 1=image, 0=env
  uniform int   uAngleSource;   // 0=camera, 1=mesh
  uniform vec3  uTint;
  uniform float uRoughness;
  uniform float uOpacity;

  // env
  uniform float uMirrorRelax;
  uniform sampler2D tEnv;
  uniform float uScale;
  uniform vec2  uOffset;

  // image
  uniform sampler2D tImage;
  uniform float uPlaneAspect;
  uniform float uImageAspect;
  uniform int   uFitMode;      // 1=cover, 0=contain
  uniform vec2  uAlign;
  uniform float uImageScale;

  // angle (simple)
  uniform float uAngleAmount;  // 0..1
  uniform vec2  uAngleAxisMix; // (1,1)
  uniform float uAnglePow;     // 0.5..3
  uniform float uAngleGain;    // ⬅ 추가: 전체 강도 배율

  // screen-fixed (simple)
  uniform int   uImageScreenFixed; // 1=on
  uniform vec2  uScreenSize;       // px
  uniform float uScreenParallaxPx; // px
  uniform vec2  uScreenParallaxAxis; // ⬅ 추가
  uniform float uScreenParallaxPow;  // ⬅ 추가

  // grayscale mix
  uniform float uGrayAmount;   // 0..1

  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec2 vUv;
  varying vec3 vPlaneRight;
  varying vec3 vPlaneUp;
  varying vec3 vPlaneFwd;

  // ---- helpers ----
  vec2 dirToEquirectUV(vec3 d) {
    d = normalize(d);
    float phi = atan(d.z, d.x);
    float theta = asin(clamp(d.y, -1.0, 1.0));
    float u = 0.5 + phi / (2.0 * 3.14159265);
    float v = 0.5 - theta / 3.14159265;
    return vec2(u, v);
  }

  vec3 roughSample(sampler2D tex, vec2 uv, float r){
    if (r <= 0.001) return texture2D(tex, uv).rgb;
    vec2 o = vec2(0.002) * r;
    vec3 c = texture2D(tex, uv).rgb
           + texture2D(tex, uv + vec2( o.x,  o.y)).rgb
           + texture2D(tex, uv + vec2(-o.x,  o.y)).rgb
           + texture2D(tex, uv + vec2( o.x, -o.y)).rgb
           + texture2D(tex, uv + vec2(-o.x, -o.y)).rgb;
    return c / 5.0;
  }

  vec2 objectFitUV(vec2 baseUv, float containerAspect, float imageAspect, int fitMode, vec2 align) {
    float sx, sy;
    if (fitMode == 1) { // cover
      if (containerAspect > imageAspect) { sx = 1.0; sy = containerAspect / imageAspect; }
      else                               { sx = imageAspect / containerAspect; sy = 1.0; }
    } else {            // contain
      if (containerAspect > imageAspect) { sx = imageAspect / containerAspect; sy = 1.0; }
      else                               { sx = 1.0; sy = containerAspect / imageAspect; }
    }
    vec2 scale = vec2(sx, sy);
    vec2 uv = (baseUv - 0.5) * scale + 0.5;
    uv += (align - 0.5) * (1.0 - scale) * 2.0;
    return uv;
  }

  // ---- camera forward in world space (no inverse() needed) ----
  vec3 cameraForwardWS() {
    // viewMatrix is world->camera. Third ROW gives +Z_cam axis in world.
    // We want camera forward (-Z_cam) in world -> negative of row2.
    mat3 V = mat3(viewMatrix);
    vec3 row2 = vec3(V[0][2], V[1][2], V[2][2]);
    return normalize(-row2);
  }

  // basis for parallax
  vec2 angleBasis() {
    if (uAngleSource == 0) {
      vec3 CF = cameraForwardWS();
      float sx = dot(CF, vPlaneRight);
      float sy = dot(CF, vPlaneUp);
      return vec2(sx, sy);
    } else {
      return vec2(vPlaneFwd.x, vPlaneFwd.y);
    }
  }

  // ---- modes ----
  vec3 getEnvColor(vec3 camPos) {
    vec3 V = normalize(vWorldPos - camPos);
    vec3 N = normalize(vWorldNormal);
    vec3 Rtrue  = reflect(V, N);
    vec3 Rfixed = vPlaneFwd;
    vec3 R = normalize(mix(Rtrue, Rfixed, clamp(uMirrorRelax, 0.0, 1.0)));
    vec2 uv = dirToEquirectUV(R);
    uv = (uv - 0.5) / max(uScale, 1e-6) + 0.5;
    uv += uOffset;
    uv = fract(uv);
    return roughSample(tEnv, uv, clamp(uRoughness, 0.0, 1.0));
  }

  vec3 getImageColorPerspective(vec3 camPos) {
    vec2 uv = objectFitUV(vUv, max(uPlaneAspect,1e-6), max(uImageAspect,1e-6), uFitMode, uAlign);
    uv = (uv - 0.5) / max(uImageScale, 1e-6) + 0.5;

    vec2 ab = angleBasis();
    float sx = ab.x, sy = ab.y;
    float ax = sign(sx) * pow(abs(sx), max(uAnglePow, 1e-6));
    float ay = sign(sy) * pow(abs(sy), max(uAnglePow, 1e-6));
    uv += vec2(ax, ay) * uAngleAmount * uAngleAxisMix * uAngleGain * 0.15; // ⬅ gain 추가

    return roughSample(tImage, uv, clamp(uRoughness, 0.0, 1.0));
  }

  vec3 getImageColorScreenFixed() {
    vec2 suv = gl_FragCoord.xy / max(uScreenSize, vec2(1.0));
    float screenAspect = uScreenSize.x / max(uScreenSize.y, 1e-6);
    vec2 uv = objectFitUV(suv, screenAspect, max(uImageAspect,1e-6), 1, uAlign);
    uv = (uv - 0.5) / max(uImageScale, 1.0e-6) + 0.5;

    vec2 ab = angleBasis();
    float sx = ab.x, sy = ab.y;
    // px parallax → uv (축·지수 반영)
    float ax = sign(sx) * pow(abs(sx), max(uScreenParallaxPow, 1.0e-6));
    float ay = sign(sy) * pow(abs(sy), max(uScreenParallaxPow, 1.0e-6));
    vec2 shiftPx = vec2(ax, ay) * uScreenParallaxPx * uScreenParallaxAxis;
    vec2 shiftUv = shiftPx / max(uScreenSize, vec2(1.0));
    uv += shiftUv;

    return roughSample(tImage, uv, clamp(uRoughness, 0.0, 1.0));
  }

  void main() {
    vec3 col = (uUseImage == 1)
      ? ((uImageScreenFixed == 1) ? getImageColorScreenFixed() : getImageColorPerspective(cameraPosition))
      : getEnvColor(cameraPosition);

    col *= uTint;

    // grayscale mix (Rec.709 in linear)
    float gray = dot(col, vec3(0.2126, 0.7152, 0.0722));
    vec3 gcol = vec3(gray);
    gcol = mix(gcol, pow(gcol, vec3(1.0)), 0.15);
    vec3 finalCol = mix(col, gcol, clamp(uGrayAmount, 0.0, 1.0));

    gl_FragColor = vec4(finalCol, uOpacity);
  }


// ===== shader 33 — 011-hoisted.B1SGfLJ6.js =====

        attribute float scale;
        attribute float time;        // age (sec)
        attribute float duration;    // life (sec)
        attribute float speed;       // 이동 속도 계수(이동만)
        attribute float blinkInt;    // blinkle interval (sec)
        attribute float blinkSpeed;  // blinkle phase(0..1)
        attribute vec3  velocity;
        attribute vec3  colorAttr;

        uniform vec3  color;
        uniform bool  useColorAttr;
        uniform bool  uFixedSize;
        uniform vec3  uMoveScale;
        uniform vec3  uVelocityMul;
        uniform float uPixelRatio;
        uniform float uPointScale;

        uniform float uBlinkSharp;
        uniform float uBlinkSizeMul;

        varying float vLife;  // 0..1
        varying vec3  vColor;
        varying float vDist;
        varying float vBlink;   // 0..1

        float parabola01(float x, float sharpness) {
          return pow(max(0.0, 4.0 * x * (1.0 - x)), sharpness);
        }

        void main() {
          const float EPS = 1e-6;

          // 1) life (0..1)
          float life = clamp(time / max(EPS, duration), 0.0, 1.0);
          vLife = life;

          // 2) local position: lifetime 동안 velocity 방향으로 이동
          vec3 vdir = normalize(velocity * uVelocityMul + vec3(EPS));
          float step01 = life * speed;
          vec3 localPos = position + (uMoveScale * step01) * vdir;

          // 3) world / view
          vec3 worldPos = (modelMatrix * vec4(localPos, 1.0)).xyz;  // 월드 (vDist 용)
          vec4 mv       = modelViewMatrix * vec4(localPos, 1.0);    // 뷰

          vColor = useColorAttr ? colorAttr : color;
          vDist  = distance(worldPos, cameraPosition);               // 필요 시 depth로 대체 가능

          // 4) blink (phase=0.5에서 피크)
          float phase = fract((time * blinkSpeed) / max(EPS, blinkInt));
          vBlink = parabola01(phase, uBlinkSharp); // 0..1

          // 5) point size (perspective-correct)
          float depth = max(-mv.z, EPS);
          float ps = scale;
          if (!uFixedSize) {
            ps = scale * (projectionMatrix[1][1] / depth) ;
          }

          gl_Position  = projectionMatrix * mv;
          gl_PointSize = ps * uPixelRatio * uPointScale; // uPixelRatio는 마지막에 한 번만
        }

      

// ===== shader 34 — 011-hoisted.B1SGfLJ6.js =====

        uniform float uRadius;
        uniform float uSoftness;
        uniform float uCloseRefDist;
        uniform float uSoftnessClose;
        uniform float uGlowCloseMul;

        uniform float uNearFadeStart;
        uniform float uNearFadeEnd;
        uniform float uFar;
        uniform float uFarFadeStart;

        uniform float uOpacity;
        uniform float uBirthFadeWidth;
        uniform float uDeathFadeWidth;
        uniform float uPixelRatio;

        uniform float uBlinkMin;
        uniform float uBlinkMax;
        uniform float uBlinkOn;

        uniform float uGlowOn;
        uniform float uGlowStrength;
        uniform float uGlowSizeMul;

        varying float vLife; // 0..1
        varying vec3  vColor;
        varying float vDist;
        varying float vBlink;

        void main() {
          float d = length(gl_PointCoord - vec2(0.5));

          float closeFactor = clamp(1.0 - (vDist / max(1e-6, uCloseRefDist)), 0.0, 1.0);
          float dynamicSoft = mix(uSoftness, uSoftness * uSoftnessClose, closeFactor);

          float edge = 1.0 - smoothstep(uRadius, uRadius + dynamicSoft, d);
          float core = exp(-pow(d / max(1e-6, (0.35 + dynamicSoft)), 2.0));
          core = mix(core, core * uGlowCloseMul, closeFactor);

          float nearFade = smoothstep(uNearFadeStart, uNearFadeEnd, vDist);
          float farFade  = 1.0 - smoothstep(uFarFadeStart, uFar, vDist);

          //birth /death 는 life 진행도로
          float birth = (uBirthFadeWidth > 0.0)
            ? smoothstep(0.0, max(1e-6, uBirthFadeWidth), vLife) : 1.0;
          float death = (uDeathFadeWidth > 0.0)
            ? 1.0 - smoothstep(1.0 - uDeathFadeWidth, 1.0, vLife) : 1.0;

          float a = edge * core * nearFade * farFade * birth * death;
          a *= uOpacity;

          // blinkle 밝기 계수
          float blink = mix(uBlinkMin, uBlinkMax, vBlink);
          vec3 col = vColor * mix(1.0, blink, uBlinkOn);
          
          float halo = max(0.0, edge - core);          // 중심은 억제, 가장자리만 남김
          halo *= nearFade * farFade * birth * death;  // 거리/생사 페이드
          // halo *= blink;                               // 깜빡임 연동
          halo *= uGlowOn * uGlowStrength;             // 토글/강도

          // col += vColor * halo;
          a *= blink;

          if (a <= 0.0001) discard;
          gl_FragColor = vec4(col, a); // ← 최종 컬러/알파 모두 반영
        }
      

// ===== shader 35 — 011-hoisted.B1SGfLJ6.js =====

        varying vec2 vUv;
        void main(){
          vec2 ndc = position.xy;   // -1..+1
          vUv = ndc * 0.5 + 0.5;    // 0..1
          gl_Position = vec4(ndc, 0.0, 1.0);
        }
      

// ===== shader 36 — 011-hoisted.B1SGfLJ6.js =====

        varying vec2 vUv;
        uniform vec3 uStartColor, uEndColor;
        uniform vec2 uCenterUV, uResolution;
        uniform float uAngle, uWidth, uFeather, uGamma, uOpacity;

        void main(){
          // aspect correction so gradient axis is isotropic in screen space
          float aspect = uResolution.x / uResolution.y;

          // shift space so centerUV is the midline (s==0)
          vec2 p = vUv - uCenterUV;
          p.x *= aspect;

          // direction from angle (radians)
          vec2 dir = vec2(cos(uAngle), sin(uAngle));
          dir = normalize(dir);

          // signed distance along gradient axis
          float s = dot(p, dir);

          // soft band from -width to +width, feather broadens edges
          float edge0 = -uWidth - uFeather;
          float edge1 =  uWidth + uFeather;
          float t = smoothstep(edge0, edge1, s);
          t = pow(clamp(t, 0.0, 1.0), uGamma);

          vec3 col = mix(uStartColor, uEndColor, t);
          gl_FragColor = vec4(col, uOpacity);
        }
      

// ===== shader 37 — 011-hoisted.B1SGfLJ6.js =====

      varying vec2 vUv;
      varying float vTime;
      varying float vViewZ;              // ★ NEW: view-space depth

      uniform float uSize;
      uniform float uPixelRatio;
      uniform float uFixedSize;

      attribute float aTime;
      attribute float aScale;

      void main() {
        vUv = uv;
        vTime = aTime;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewZ = -mvPosition.z;          // ★ NEW: 카메라 기준 +거리

        gl_Position = projectionMatrix * mvPosition;
        if(uFixedSize == 1.0) {
          gl_PointSize = uSize * uPixelRatio;
        }else{
          gl_PointSize = uSize * (projectionMatrix[1][1] / vViewZ) * aScale * uPixelRatio;
        }

      }
    

// ===== shader 38 — 011-hoisted.B1SGfLJ6.js =====

      varying float vTime;
      varying float vViewZ;                 // ★ NEW

      uniform sampler2D pointTexture;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uTime;
      uniform float uFeatherEdge;
      uniform float uFeatherCenter;

      uniform float uMinFlicker;
      uniform float uMaxFlicker;

      uniform float uNearFadeStart;         // ★ NEW
      uniform float uNearFadeEnd;           // ★ NEW

      void main() {
        vec2 p = gl_PointCoord - 0.5;
        float r = length(p);

        float edge = smoothstep(0.5 - uFeatherEdge, 0.5, r);
        float core = 1.0 - edge;

        float texA = texture2D(pointTexture, gl_PointCoord).a;
        // core *= texA; // 필요하면 주석 해제

        float flicker = mix(uMinFlicker, uMaxFlicker, 0.5 + 0.5 * sin(uTime * 4.0 + vTime));
        float alpha = core * flicker;

        // ★ NEW: 카메라 근거리 페이드 (vViewZ가 작을수록 더 투명)
        // float nearFactor = smoothstep(uNearFadeStart, uNearFadeEnd, vViewZ);
        // alpha *= nearFactor;

        if (alpha <= 0.001) discard;

        vec3 color = uColor * (1.0 + uFeatherCenter * core);

        gl_FragColor = vec4(color * alpha, alpha * uOpacity);
      }
    

// ===== shader 39 — 011-hoisted.B1SGfLJ6.js =====

        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      

// ===== shader 40 — 011-hoisted.B1SGfLJ6.js =====

        precision highp float;

        varying vec2 vUv;
        uniform sampler2D tDiffuse;
        uniform vec2 uResolution;
        uniform vec2 uTextureResolution;
        uniform vec3 uBackColor;
        uniform float uOpacity;
        uniform float uBackAlpha;

        void main() {
         vec2 ratio = vec2(
						min((uResolution.x / uResolution.y) / (uTextureResolution.x / uTextureResolution.y), 1.0),
						min((uResolution.y / uResolution.x) / (uTextureResolution.y / uTextureResolution.x), 1.0));

					vec2 fitUv = vec2(
						vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
						vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
					);

          vec4 colorFront = texture2D( tDiffuse, fitUv );

          vec3 finalColor = gl_FrontFacing ? colorFront.rgb : uBackColor;
          float alpha = gl_FrontFacing ? colorFront.a * uOpacity : uBackAlpha;

          gl_FragColor = vec4(finalColor, alpha);
        }
      