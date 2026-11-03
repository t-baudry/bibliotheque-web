// ===== shader 1 — 001-Ds9T5XbZ.js =====

  varying vec3 vWorldPos;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }


// ===== shader 2 — 001-Ds9T5XbZ.js =====

  uniform float uBendH;   // horizontal arch driven by spin velocity
  uniform float uBendV;   // vertical arch driven by scroll velocity
  uniform float uTime;
  uniform float uPhase;   // per-panel random phase for idle wave
  varying vec2  vUv;
  varying float vViewZ;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // UV-space coords centred on 0
    float xn = (uv.x - 0.5) * 2.0;   // -1 … +1
    float yn = (uv.y - 0.5) * 2.0;

    // Parabolic arch: 1 at centre, 0 at both edges
    float archX = 1.0 - xn * xn;
    float archY = 1.0 - yn * yn;

    pos.z -= archX * uBendH;   // horizontal arch (spin)
    pos.z -= archY * uBendV;   // vertical arch  (scroll)

    // Subtle idle wave — each panel has a different phase
    pos.z += sin(uv.y * 6.283 + uTime * 0.55 + uPhase)
           * sin(uv.x * 3.14  + uTime * 0.35 + uPhase * 1.3) * 0.016;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vViewZ = -mvPos.z;
    gl_Position = projectionMatrix * mvPos;
  }


// ===== shader 3 — 001-Ds9T5XbZ.js =====

  uniform vec3 uBaseColor;
  uniform float uSideDarken;
  uniform float uCenterLift;
  uniform float uOpacity;
  varying vec3 vWorldPos;

  ${Tn}

  void main() {
    vec3 dir = normalize(vWorldPos - cameraPosition);
    float side = smoothstep(0.18, 0.95, abs(dir.x));
    float lift = 1.0 + (1.0 - side) * uCenterLift;

    vec3 centerCol = uBaseColor * lift;
    vec3 sideCol   = uBaseColor * (1.0 - uSideDarken);
    vec3 col       = mix(centerCol, sideCol, side);

    gl_FragColor = vec4(linearToSRGB(col), uOpacity);
  }


// ===== shader 4 — 001-Ds9T5XbZ.js =====
 sampling for the entrance.
  vec4 sampleBlurred(sampler2D tex, vec2 uv, float blur) {
    if (blur <= 0.0005) return texture2D(tex, uv);
    vec4 acc  = texture2D(tex, uv) * 0.25;
    acc      += texture2D(tex, uv + vec2( blur, 0.0))   * 0.125;
    acc      += texture2D(tex, uv + vec2(-blur, 0.0))   * 0.125;
    acc      += texture2D(tex, uv + vec2(0.0,   blur))  * 0.125;
    acc      += texture2D(tex, uv + vec2(0.0,  -blur))  * 0.125;
    acc      += texture2D(tex, uv + vec2( blur,  blur)) * 0.0625;
    acc      += texture2D(tex, uv + vec2(-blur,  blur)) * 0.0625;
    acc      += texture2D(tex, uv + vec2( blur, -blur)) * 0.0625;
    acc      += texture2D(tex, uv + vec2(-blur, -blur)) * 0.0625;
    return acc;
  }

  void main() {
    vec4 col = sampleBlurred(uTexture, vUv, uBlur);
    float depthT = smoothstep(uDepthNear, uDepthFar, vViewZ);
    float luma   = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));
    vec3  toned  = mix(col.rgb, vec3(luma), depthT * 0.12);
    toned        = mix(toned, uDepthColor, depthT * uDepthStrength);
    col.rgb      = linearToSRGB(toned);
    col.a    *= uOpacity;
    gl_FragColor = col;
  }


// ===== shader 5 — 007-Cx6gWqY.js =====

    uniform float uTime;
    uniform float uScrollVelocity;
    uniform float uSharedWaveVelocity;
    uniform float uWaveStrength;
    uniform float uWaveFrequency;
    uniform float uSharedWaveCenter;
    uniform float uSharedWaveWidth;
    uniform float uSharedWaveAmplitude;
    uniform float uMoohStrength;
    uniform float uMoohFrequency;
    uniform float uMode;

    varying vec2 vUv;
    varying float vWave;

    void main() {
      vUv = uv;
      vWave = 0.0;
      vec3 newPosition = position;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      float scrollAbs = abs(uScrollVelocity);

      if (uMode < 0.5) {
        // Legacy shared sine field.
        float phase = -worldPosition.y * uWaveFrequency + uTime * 2.0;
        float wave = max(0.0, sin(phase)) * scrollAbs * uWaveStrength;
        newPosition.z += wave;
      } else {
        // Exact port of mooh.dev WebGLImageMaterial vertex shader.
        // Sine wave anchored in world (viewport pixel) Y, so the page slides through
        // a fixed field of crests and troughs as you scroll. uScrollVelocity gates
        // amplitude, so the wave only appears while scrolling.
        float sinPhase = sin(worldPosition.y * uMoohFrequency + uTime * 0.8);
        float waveBase = sinPhase * uScrollVelocity;
        // vWave is kept on a small ~±0.5 range so the fragment purple tint stays subtle.
        vWave = waveBase * 0.1;
        // Z displacement is in pixels; the *0.5 matches mooh.dev

// ===== shader 6 — 007-Cx6gWqY.js =====

    uniform sampler2D uTexture;
    uniform float uMode;
    uniform float uScrollVelocity;
    uniform float uParallax;
    uniform float uTargetAspect;
    uniform float uSourceAspect;
    uniform float uMoohParallaxSpeed;
    uniform float uMoohRgbShift;
    uniform float uMoohDistortion;
    uniform float uOpacity;

    varying vec2 vUv;
    varying float vWave;

    // Map a mesh-space UV [0,1] onto the natural-aspect texture so that the texture
    // covers the mesh (CSS object-fit: cover). Doing this here means the texture is
    // never rebuilt on resize — the mesh aspect changes per frame and the crop
    // follows automatically, no stale-canvas duplicates while the window scales.
    vec2 cover(vec2 uv) {
      if (uSourceAspect <= 0.0) return uv;
      vec2 result = uv;
      if (uTargetAspect > uSourceAspect) {
        result.y = 0.5 + (uv.y - 0.5) * (uSourceAspect / uTargetAspect);
      } else {
        result.x = 0.5 + (uv.x - 0.5) * (uTargetAspect / uSourceAspect);
      }
      return result;
    }

    void main() {
      if (uMode < 0.5) {
        vec4 color = texture2D(uTexture, cover(vUv));
        color.a *= uOpacity;
        gl_FragColor = color;
        return;
      }

      // Port of mooh.dev WebGLImageMaterial fragment shader.
      // Headroom zoom: needs to absorb the full parallax shift so UVs never go
      // outside [0,1] (otherwise edge sampling reveals the backdrop on parallax peaks).
      vec2 correctedUv = vUv;
      correctedUv = (correctedUv * 2.0) - 1.0;
      correctedUv *= 1.0 - 1.6 * uMoohParallaxSpeed;
      float parallax = (uParallax - 0.5) * 2.0 * uMoohParallaxSpeed;
      correctedUv.y += parallax;
      correctedUv = (correctedUv + 1.0) * 0.5;
      vec2 newUv = mix(vUv + vec2(0.0, parallax), correctedUv, 1.0);

      float reducedScrollVelocity = uScrollVelocity * 0.015;
      float yDistortion = sin(newUv.x * 10.0) * reducedScrollVelocity * uMoohDistortion;
      newUv.y += yDistortion;

      float rgbShift = reducedScrollVelocity * uMoohRgbShift;
      float r = texture2D(uTexture, cover(newUv + vec2(rgbShift, 0.0))).r;
      float g = texture2D(uTexture, cover(newUv)).g;
      float b = texture2D(uTexture, cover(newUv - vec2(rgbShift, 0.0))).b;

      vec4 color = vec4(r, g, b, 1.0);
      color.rgb += vWave * 0.1 * vec3(0.2, 0.0, 0.3);
      color.a *= uOpacity;
      gl_FragColor = color;
    }
  

// ===== shader 7 — 008-Cx6gWqY.js =====

    uniform float uTime;
    uniform float uScrollVelocity;
    uniform float uSharedWaveVelocity;
    uniform float uWaveStrength;
    uniform float uWaveFrequency;
    uniform float uSharedWaveCenter;
    uniform float uSharedWaveWidth;
    uniform float uSharedWaveAmplitude;
    uniform float uMoohStrength;
    uniform float uMoohFrequency;
    uniform float uMode;

    varying vec2 vUv;
    varying float vWave;

    void main() {
      vUv = uv;
      vWave = 0.0;
      vec3 newPosition = position;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      float scrollAbs = abs(uScrollVelocity);

      if (uMode < 0.5) {
        // Legacy shared sine field.
        float phase = -worldPosition.y * uWaveFrequency + uTime * 2.0;
        float wave = max(0.0, sin(phase)) * scrollAbs * uWaveStrength;
        newPosition.z += wave;
      } else {
        // Exact port of mooh.dev WebGLImageMaterial vertex shader.
        // Sine wave anchored in world (viewport pixel) Y, so the page slides through
        // a fixed field of crests and troughs as you scroll. uScrollVelocity gates
        // amplitude, so the wave only appears while scrolling.
        float sinPhase = sin(worldPosition.y * uMoohFrequency + uTime * 0.8);
        float waveBase = sinPhase * uScrollVelocity;
        // vWave is kept on a small ~±0.5 range so the fragment purple tint stays subtle.
        vWave = waveBase * 0.1;
        // Z displacement is in pixels; the *0.5 matches mooh.dev

// ===== shader 8 — 008-Cx6gWqY.js =====

    uniform sampler2D uTexture;
    uniform float uMode;
    uniform float uScrollVelocity;
    uniform float uParallax;
    uniform float uTargetAspect;
    uniform float uSourceAspect;
    uniform float uMoohParallaxSpeed;
    uniform float uMoohRgbShift;
    uniform float uMoohDistortion;
    uniform float uOpacity;

    varying vec2 vUv;
    varying float vWave;

    // Map a mesh-space UV [0,1] onto the natural-aspect texture so that the texture
    // covers the mesh (CSS object-fit: cover). Doing this here means the texture is
    // never rebuilt on resize — the mesh aspect changes per frame and the crop
    // follows automatically, no stale-canvas duplicates while the window scales.
    vec2 cover(vec2 uv) {
      if (uSourceAspect <= 0.0) return uv;
      vec2 result = uv;
      if (uTargetAspect > uSourceAspect) {
        result.y = 0.5 + (uv.y - 0.5) * (uSourceAspect / uTargetAspect);
      } else {
        result.x = 0.5 + (uv.x - 0.5) * (uTargetAspect / uSourceAspect);
      }
      return result;
    }

    void main() {
      if (uMode < 0.5) {
        vec4 color = texture2D(uTexture, cover(vUv));
        color.a *= uOpacity;
        gl_FragColor = color;
        return;
      }

      // Port of mooh.dev WebGLImageMaterial fragment shader.
      // Headroom zoom: needs to absorb the full parallax shift so UVs never go
      // outside [0,1] (otherwise edge sampling reveals the backdrop on parallax peaks).
      vec2 correctedUv = vUv;
      correctedUv = (correctedUv * 2.0) - 1.0;
      correctedUv *= 1.0 - 1.6 * uMoohParallaxSpeed;
      float parallax = (uParallax - 0.5) * 2.0 * uMoohParallaxSpeed;
      correctedUv.y += parallax;
      correctedUv = (correctedUv + 1.0) * 0.5;
      vec2 newUv = mix(vUv + vec2(0.0, parallax), correctedUv, 1.0);

      float reducedScrollVelocity = uScrollVelocity * 0.015;
      float yDistortion = sin(newUv.x * 10.0) * reducedScrollVelocity * uMoohDistortion;
      newUv.y += yDistortion;

      float rgbShift = reducedScrollVelocity * uMoohRgbShift;
      float r = texture2D(uTexture, cover(newUv + vec2(rgbShift, 0.0))).r;
      float g = texture2D(uTexture, cover(newUv)).g;
      float b = texture2D(uTexture, cover(newUv - vec2(rgbShift, 0.0))).b;

      vec4 color = vec4(r, g, b, 1.0);
      color.rgb += vWave * 0.1 * vec3(0.2, 0.0, 0.3);
      color.a *= uOpacity;
      gl_FragColor = color;
    }
  

// ===== shader 9 — 009-Ds9T5XbZ.js =====

  varying vec3 vWorldPos;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }


// ===== shader 10 — 009-Ds9T5XbZ.js =====

  uniform float uBendH;   // horizontal arch driven by spin velocity
  uniform float uBendV;   // vertical arch driven by scroll velocity
  uniform float uTime;
  uniform float uPhase;   // per-panel random phase for idle wave
  varying vec2  vUv;
  varying float vViewZ;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // UV-space coords centred on 0
    float xn = (uv.x - 0.5) * 2.0;   // -1 … +1
    float yn = (uv.y - 0.5) * 2.0;

    // Parabolic arch: 1 at centre, 0 at both edges
    float archX = 1.0 - xn * xn;
    float archY = 1.0 - yn * yn;

    pos.z -= archX * uBendH;   // horizontal arch (spin)
    pos.z -= archY * uBendV;   // vertical arch  (scroll)

    // Subtle idle wave — each panel has a different phase
    pos.z += sin(uv.y * 6.283 + uTime * 0.55 + uPhase)
           * sin(uv.x * 3.14  + uTime * 0.35 + uPhase * 1.3) * 0.016;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vViewZ = -mvPos.z;
    gl_Position = projectionMatrix * mvPos;
  }


// ===== shader 11 — 009-Ds9T5XbZ.js =====

  uniform vec3 uBaseColor;
  uniform float uSideDarken;
  uniform float uCenterLift;
  uniform float uOpacity;
  varying vec3 vWorldPos;

  ${Tn}

  void main() {
    vec3 dir = normalize(vWorldPos - cameraPosition);
    float side = smoothstep(0.18, 0.95, abs(dir.x));
    float lift = 1.0 + (1.0 - side) * uCenterLift;

    vec3 centerCol = uBaseColor * lift;
    vec3 sideCol   = uBaseColor * (1.0 - uSideDarken);
    vec3 col       = mix(centerCol, sideCol, side);

    gl_FragColor = vec4(linearToSRGB(col), uOpacity);
  }


// ===== shader 12 — 009-Ds9T5XbZ.js =====
 sampling for the entrance.
  vec4 sampleBlurred(sampler2D tex, vec2 uv, float blur) {
    if (blur <= 0.0005) return texture2D(tex, uv);
    vec4 acc  = texture2D(tex, uv) * 0.25;
    acc      += texture2D(tex, uv + vec2( blur, 0.0))   * 0.125;
    acc      += texture2D(tex, uv + vec2(-blur, 0.0))   * 0.125;
    acc      += texture2D(tex, uv + vec2(0.0,   blur))  * 0.125;
    acc      += texture2D(tex, uv + vec2(0.0,  -blur))  * 0.125;
    acc      += texture2D(tex, uv + vec2( blur,  blur)) * 0.0625;
    acc      += texture2D(tex, uv + vec2(-blur,  blur)) * 0.0625;
    acc      += texture2D(tex, uv + vec2( blur, -blur)) * 0.0625;
    acc      += texture2D(tex, uv + vec2(-blur, -blur)) * 0.0625;
    return acc;
  }

  void main() {
    vec4 col = sampleBlurred(uTexture, vUv, uBlur);
    float depthT = smoothstep(uDepthNear, uDepthFar, vViewZ);
    float luma   = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));
    vec3  toned  = mix(col.rgb, vec3(luma), depthT * 0.12);
    toned        = mix(toned, uDepthColor, depthT * uDepthStrength);
    col.rgb      = linearToSRGB(toned);
    col.a    *= uOpacity;
    gl_FragColor = col;
  }


// ===== shader 13 — 010-C64vahhe.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 14 — 010-C64vahhe.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 15 — 010-C64vahhe.js =====

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
		

// ===== shader 16 — 010-C64vahhe.js =====
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
		

// ===== shader 17 — 010-C64vahhe.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 18 — 010-C64vahhe.js =====


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
	

// ===== shader 19 — 010-C64vahhe.js =====

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

// ===== shader 20 — 010-C64vahhe.js =====
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

// ===== shader 21 — 010-C64vahhe.js =====

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

// ===== shader 22 — 017-CbzmU9t4.js =====

  varying vec3 vWorldPos;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }


// ===== shader 23 — 017-CbzmU9t4.js =====

  uniform vec3 uBaseColor;
  uniform float uSideDarken;
  uniform float uCenterLift;
  uniform float uOpacity;
  varying vec3 vWorldPos;

  vec3 linearToSRGB(vec3 c) { return pow(max(c, 0.0), vec3(1.0 / 2.2)); }

  void main() {
    vec3 dir = normalize(vWorldPos - cameraPosition);
    float side = smoothstep(0.18, 0.95, abs(dir.x));
    float lift = 1.0 + (1.0 - side) * uCenterLift;

    vec3 centerCol = uBaseColor * lift;
    vec3 sideCol   = uBaseColor * (1.0 - uSideDarken);
    vec3 col       = mix(centerCol, sideCol, side);

    gl_FragColor = vec4(linearToSRGB(col), uOpacity);
  }
