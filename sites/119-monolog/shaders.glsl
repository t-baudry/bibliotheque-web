// ===== shader 1 — 004-initShader.CMObnxEj.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 004-initShader.CMObnxEj.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 004-initShader.CMObnxEj.js =====
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
		

// ===== shader 4 — 004-initShader.CMObnxEj.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 5 — 004-initShader.CMObnxEj.js =====


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
	

// ===== shader 6 — 004-initShader.CMObnxEj.js =====

  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }


// ===== shader 7 — 004-initShader.CMObnxEj.js =====

  precision highp float;

  uniform float uTime;
  uniform float uAmplitude;
  uniform float uReveal;

  varying vec2 vUv;

  void main() {
    vec2 c = 2.0 * vUv - 1.0;
    float ds = uAmplitude * uReveal;

    c += ds * 0.4 * sin(c.yx + vec2(1.2, 3.4) + uTime);
    c += ds * 0.2 * sin(5.2 * c.yx + vec2(3.5, 0.4) + uTime);
    c += ds * 0.3 * sin(3.5 * c.yx + vec2(1.2, 3.1) + uTime);
    c += ds * 1.6 * sin(0.4 * c.yx + vec2(0.8, 2.4) + uTime);

    float L = length(c);
    float v = 0.0;
    for (int i = 0; i < 4; i++) {
      v = mix(v, float(i) / 3.0, cos(float(i) * L));
    }

    gl_FragColor = vec4(clamp(v, 0.0, 1.0), 0.0, 0.0, 1.0);
  }


// ===== shader 8 — 004-initShader.CMObnxEj.js =====

  precision highp float;

  uniform sampler2D uFieldTex;
  uniform vec2 uFieldRes;
  uniform vec2 uResolution;
  uniform float uReveal;

  uniform float uPixelSize;
  uniform float uGooeyness;
  uniform float uContrast;
  uniform float uBias;
  uniform int uInvert;
  uniform vec3 uBg;
  uniform vec3 uFg;
  uniform int uTransparentBg;

  // Vertical wave modulation — adds a scrolling sine wave to the dot bias.
  // Set uWaveAmplitude = 0 to disable.
  uniform float uWaveTime;
  uniform float uWaveFrequency;
  uniform float uWaveAmplitude;

  varying vec2 vUv;

  float lumaToRadius(float luma, float pixelSize, float biasOffset) {
    float v = clamp((luma - 0.5 + uBias + biasOffset) * uContrast + 0.5, 0.0, 1.0);
    if (uInvert == 1) v = 1.0 - v;
    return v * pixelSize * 0.6 + pixelSize * 0.05;
  }

  float smin(float a, float b, float k) {
    if (k <= 0.001) return min(a, b);
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
  }

  void main() {
    vec2 pixelCoord = vUv * uResolution;
    vec2 baseCellIndex = floor(pixelCoord / uPixelSize);
    float minDist = 1.0e5;
    float smoothK = uGooeyness * 1.5;

    // R=1 → 3×3 neighborhood, checkerboard skip → 5 active cells/fragment.
    const int R = 1;
    for (int dx = -R; dx <= R; dx++) {
      for (int dy = -R; dy <= R; dy++) {
        vec2 cellIndex = baseCellIndex + vec2(float(dx), float(dy));
        if (mod(cellIndex.x + cellIndex.y, 2.0) > 0.5) continue;

        vec2 cellCenter = (cellIndex + 0.5) * uPixelSize;
        vec2 fieldUv    = (cellIndex + 0.5) / uFieldRes;
        float luma      = texture2D(uFieldTex, fieldUv).r;

        float cellY     = cellCenter.y / uResolution.y;
        float wavePhase = cellY * uWaveFrequency * 6.2831853 - uWaveTime;
        float waveBias  = sin(wavePhase) * uWaveAmplitude;

        float dist   = length(pixelCoord - cellCenter);
        float radius = lumaToRadius(luma, uPixelSize, waveBias);
        minDist = smin(minDist, dist - radius, smoothK * uPixelSize);
      }
    }

    float aa    = max(fwidth(minDist), 0.0001);
    float shape = 1.0 - smoothstep(-aa, aa, minDist);

    if (uTransparentBg == 1) {
      gl_FragColor = vec4(uFg * uReveal, shape * uReveal);
    } else {
      vec3 color = mix(uBg, uFg, shape);
      gl_FragColor = vec4(color * uReveal, 1.0);
    }
  }
