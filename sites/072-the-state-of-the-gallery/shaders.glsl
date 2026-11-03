// ===== shader 1 — 029-1-d8y95fs809a.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 029-1-d8y95fs809a.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 029-1-d8y95fs809a.js =====
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
		

// ===== shader 4 — 029-1-d8y95fs809a.js =====

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
		

// ===== shader 5 — 029-1-d8y95fs809a.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 6 — 029-1-d8y95fs809a.js =====


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
	

// ===== shader 7 — 029-1-d8y95fs809a.js =====

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

// ===== shader 8 — 029-1-d8y95fs809a.js =====
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

// ===== shader 9 — 029-1-d8y95fs809a.js =====

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

// ===== shader 10 — 030-0o2p9sr872c1k.js =====

attribute vec2 aBase;
attribute float aSeed;

uniform vec3 uStationCenter;
uniform float uFormProgress;
uniform float uVisProgress;
uniform float uYOffset;
uniform float uScatterRadius;
uniform float uScatterHeight;
uniform float uFormJitter;
uniform vec2 uCursorNDC;
uniform float uHoverActive;
uniform float uHoverRadius;
uniform float uHoverRepel;
uniform float uHoverScale;
uniform float uParticleSize;
uniform float uTime;
uniform float uIdleWiggle;

varying float vForm;
varying float vVis;
varying float vPAlpha;
varying float vHoverFall;

void main() {
  // Formed pose with per-particle XY/Z jitter so the silhouette
  // isn

// ===== shader 11 — 030-0o2p9sr872c1k.js =====

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uHoverGlowColor;
uniform float uHoverGlow;
// Fake plastic-bead lighting — mirrors the surface particles
// so stat stations match. Values driven from the host scene.
uniform vec3 uPLightDir;
uniform float uPAmbient;
uniform float uPDiffuse;
uniform float uPSpec;
uniform float uPSpecPower;
varying float vForm;
varying float vVis;
varying float vPAlpha;
varying float vHoverFall;
void main() {
  // Force highp on gl_PointCoord — Safari defaults to mediump
  // which collapses the hemisphere normal calc below; Brave
  // defaults to highp.
  highp vec2 pc = gl_PointCoord;
  vec2 c = pc - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  float disc = 1.0 - smoothstep(0.35, 0.5, d);
  float edge = smoothstep(0.18, 0.5, d);
  vec3 formedCol = mix(uColorA, uColorB, vForm);
  vec3 col = mix(formedCol, uColorA, edge * 0.65);
  float lift = clamp(vHoverFall * uHoverGlow, 0.0, 4.0);
  col = mix(col, uHoverGlowColor, clamp(lift, 0.0, 1.0));
  col += uHoverGlowColor * max(lift - 1.0, 0.0);
  // Hemisphere normal from sprite UV → diffuse + Blinn-Phong.
  vec2 n2 = vec2(c.x, -c.y) * 2.0;
  float nz2 = clamp(1.0 - dot(n2, n2), 0.0, 1.0);
  vec3 N = vec3(n2, sqrt(nz2));
  vec3 L = normalize(uPLightDir);
  float diff = max(dot(N, L), 0.0);
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0),
    max(uPSpecPower, 0.001));
  float shade = uPAmbient + uPDiffuse * diff;
  col = col * shade + vec3(uPSpec * spec);
  gl_FragColor = vec4(col, disc * vVis * vPAlpha);
}


// ===== shader 12 — 030-0o2p9sr872c1k.js =====

      varying vec3 vWorld;
      varying vec3 vNormalW;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    

// ===== shader 13 — 030-0o2p9sr872c1k.js =====

      uniform float uBumpStrength;
      uniform float uBumpScale;
      uniform float uBumpDistortion;
      uniform float uFrostStrength;
      uniform float uOilStrength;
      uniform float uOilRadius;
      uniform float uOilScale;
      uniform float uOilSpeed;
      uniform vec3 uOilColorA;
      uniform vec3 uOilColorB;
      uniform vec2 uCursorWorld;
      uniform float uCursorActive;
      uniform float uTime;
      uniform float uFresnelStrength;
      uniform float uFresnelPower;
      uniform vec3 uFresnelColor;
      uniform float uFresnelInvert;
      varying vec3 vWorld;
      varying vec3 vNormalW;

      vec3 fxMod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
      vec2 fxMod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
      vec3 fxPermute(vec3 x) { return fxMod289(((x * 34.0) + 1.0) * x); }
      float fxSnoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = fxMod289(i);
        vec3 p = fxPermute(fxPermute(i.y + vec3(0.0, i1.y, 1.0))
                         + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0),
                                dot(x12.xy, x12.xy),
                                dot(x12.zw, x12.zw)), 0.0);
        m = m * m; m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      float fxFbm(vec2 p) {
        float v = 0.0; float amp = 0.5;
        for (int i = 0; i < 3; i++) { v += fxSnoise(p) * amp; p *= 2.03; amp *= 0.5; }
        return v;
      }
      float fxTri(vec3 p, vec3 n, float distortion) {
        vec3 wn = abs(n); wn = wn / max(wn.x + wn.y + wn.z, 0.0001);
        vec2 dx = distortion > 0.0 ? vec2(fxFbm(p.yz * 1.7), fxFbm(p.yz * 1.7 + 13.7)) * distortion : vec2(0.0);
        vec2 dy = distortion > 0.0 ? vec2(fxFbm(p.xz * 1.7 + 7.3), fxFbm(p.xz * 1.7 + 21.4)) * distortion : vec2(0.0);
        vec2 dz = distortion > 0.0 ? vec2(fxFbm(p.xy * 1.7 - 5.1), fxFbm(p.xy * 1.7 + 33.0)) * distortion : vec2(0.0);
        float nx = fxFbm(p.yz + dx);
        float ny = fxFbm(p.xz + dy);
        float nz = fxFbm(p.xy + dz);
        return nx * wn.x + ny * wn.y + nz * wn.z;
      }

      void main() {
        vec3 outColor = vec3(0.0);
        float outAlpha = 0.0;

        // Bump + frost now handled by the glass material

// ===== shader 14 — 030-0o2p9sr872c1k.js =====
uniform vec2 uVidSize;
       uniform float uVidRadius;
       varying vec2 vLocalXY;
       float sdRoundedBoxV(vec2 p, vec2 b, float r) {
         vec2 q = abs(p) - b + vec2(r);
         return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
       }
       void main() {
         {
           vec2 halfRect = uVidSize * 0.5;
           float d = sdRoundedBoxV(vLocalXY, halfRect, uVidRadius);
           if (d > 0.0) discard;
         }

// ===== shader 15 — 030-0o2p9sr872c1k.js =====

      varying vec2 vLocal;
      uniform float uSize;
      uniform float uSurfNoiseScale;
      uniform float uSurfDisplacement;
      uniform vec2 uSurfScrollOffset;
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                       + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0),
                                dot(x12.xy, x12.xy),
                                dot(x12.zw, x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      float terrainHeight(vec2 worldXZ) {
        vec2 s = worldXZ + uSurfScrollOffset;
        float n1 = snoise(s * uSurfNoiseScale);
        float n2 = snoise(s * uSurfNoiseScale * 2.5) * 0.45;
        return (n1 + n2) * uSurfDisplacement;
      }
      void main() {
        vec3 p = vec3(position.x * uSize, position.y * uSize, position.z);
        vLocal = p.xy;
        vec4 worldP = modelMatrix * vec4(p, 1.0);
        // Lift above the static noise by enough headroom to clear
        // the surface

// ===== shader 16 — 030-0o2p9sr872c1k.js =====

      uniform vec3 uColor;
      uniform float uStrength;
      uniform float uSize;
      varying vec2 vLocal;
      void main() {
        float d = length(vLocal) / (uSize * 0.5);
        float a = (1.0 - smoothstep(0.0, 1.0, d)) * uStrength;
        if (a < 0.005) discard;
        gl_FragColor = vec4(uColor, a);
      }
    

// ===== shader 17 — 030-0o2p9sr872c1k.js =====
s noise so the caustic
      // plane can match terrain height without sharing the chunk.
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                       + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0),
                                dot(x12.xy, x12.xy),
                                dot(x12.zw, x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      float terrainHeight(vec2 worldXZ) {
        vec2 s = worldXZ + uSurfScrollOffset;
        float n1 = snoise(s * uSurfNoiseScale);
        float n2 = snoise(s * uSurfNoiseScale * 2.5) * 0.45;
        return (n1 + n2) * uSurfDisplacement;
      }
      void main() {
        // Plane is laid flat (rotation.x = -π/2). Local position xy
        // becomes world xz after rotation. Multiply by size so the
        // disc covers the desired ground area.
        vec3 p = vec3(position.x * uSize, position.y * uSize, position.z);
        vLocal = p.xy;
        vec4 worldP = modelMatrix * vec4(p, 1.0);
        vWorldXZ = worldP.xz;
        // Displace Y to match the terrain surface beneath the cube.
        // Tiny epsilon keeps the plane just above the surface to
        // avoid z-fighting with the surface mesh.
        worldP.y = terrainHeight(worldP.xz) + 0.25;
        gl_Position = projectionMatrix * viewMatrix * worldP;
      }
    

// ===== shader 18 — 030-0o2p9sr872c1k.js =====

      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uSize;
      uniform float uScale;
      uniform float uSpeed;
      uniform float uTime;
      varying vec2 vLocal;
      // Cheap caustic-ish field: layered sine ridges in domain-warped
      // space animated over time. Not physically accurate; just the
      // visual character of cast caustics.
      float caustic(vec2 p) {
        p *= uScale;
        float t = uTime * uSpeed;
        vec2 q = vec2(
          sin(p.x + t) + cos(p.y * 1.3 - t * 0.7),
          cos(p.y + t * 1.1) - sin(p.x * 1.4 + t)
        );
        float v = 0.0;
        for (int i = 0; i < 3; i++) {
          float fi = float(i) + 1.0;
          v += sin(q.x * fi + q.y * (fi + 0.7) + t * fi) /
               (fi * 0.9);
        }
        v = pow(abs(v), 3.0);
        return v;
      }
      void main() {
        float radial = length(vLocal) / (uSize * 0.5);
        float mask = 1.0 - smoothstep(0.0, 1.0, radial);
        float c = caustic(vLocal);
        float a = c * mask * uIntensity;
        if (a < 0.005) discard;
        gl_FragColor = vec4(uColor, a);
      }
    

// ===== shader 19 — 030-0o2p9sr872c1k.js =====

${h}
${S}
${g}

varying float vDisp;
varying vec3 vWorldPos;

void main() {
  // Sample noise at WORLD xz so when the mesh translates with the
  // camera (infinite-scroll mode) each vertex picks up fresh terrain
  // instead of dragging the same pattern along.
  vec4 worldFlat = modelMatrix * vec4(position.x, 0.0, position.z, 1.0);
  float disp = computeDisplacement(worldFlat.xz);
  // Intro: grow displacement from flat to full over the first half
  // of the intro curve.
  float introSurface = smoothstep(0.0, 0.5, uIntro);
  disp *= introSurface;
  vec3 pos = position;
  pos.y += disp;
  vDisp = disp;
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}


// ===== shader 20 — 030-0o2p9sr872c1k.js =====
t perfectly overlap.
uniform float uPassIndex;
attribute float aRandom;
varying float vAlphaScale;
varying float vFocusR;
varying float vHoverFall;
// Signed forward distance from camera (positive = ahead of
// camera looking in -Z). Drives the tunnel-mode colour gradient.
varying float vCamForward;
varying float vTunnelMix;

void main() {
  vec3 localPos = position;
  // Pass-shifted random — the duplicate pass uses a different
  // hash of aRandom so it scatters elsewhere instead of stacking
  // on top of the first pass.
  float effRandom = fract(aRandom + uPassIndex * 0.3759);
  // Per-particle random jitter on xz so the particle isn

// ===== shader 21 — 030-0o2p9sr872c1k.js =====

${h}
${S}
${g}

varying float vDisp;
varying vec3 vWorldPos;

void main() {
  vec4 worldFlat = modelMatrix * vec4(position.x, 0.0, position.z, 1.0);
  float disp = computeDisplacement(worldFlat.xz);
  vec3 pos = position;
  pos.y += disp;
  vDisp = disp;
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}


// ===== shader 22 — 030-0o2p9sr872c1k.js =====

${h}
${S}
${g}

uniform vec3 uWireColor;
uniform float uWireThickness;
uniform float uWireOpacity;
uniform float uGlowSpread;
uniform float uGlowStrength;
uniform float uContourSpacing;
uniform float uRevealRadius;
uniform float uRevealBlur;
uniform float uRevealNoiseScale;
uniform float uRevealNoiseStrength;
// Fog ranges only — hover/focus/time uniforms already declared by
// DISPLACEMENT_UNIFORMS_GLSL above. Redeclaring them here would cause
// a GLSL link error and the wireframe pass silently fails to render.
uniform float uFogInner;
uniform float uFogOuter;
varying float vDisp;
varying vec3 vWorldPos;

void main() {
  // Topographic contour lines — sample the displacement function
  // PER FRAGMENT (not the interpolated vDisp). This evaluates the
  // analytic noise + wave + carrier + hover at the exact world-xz
  // of this pixel, so contours come out as smooth curves instead of
  // straight chords across each triangle of the tessellated mesh.
  float disp = computeDisplacement(vWorldPos.xz);
  float spacing = max(uContourSpacing, 0.0001);
  float band = mod(disp + spacing * 0.5, spacing) - spacing * 0.5;
  float bandDist = abs(band);
  float w = fwidth(disp);
  float sharp = 1.0 - smoothstep(0.0, w * uWireThickness, bandDist);
  float glow =
    1.0 - smoothstep(0.0, w * uWireThickness * (1.0 + uGlowSpread), bandDist);
  float lineAlpha = max(sharp, glow * uGlowStrength);

  // Reveal mask — radial smoothstep around the hover point, with the
  // distance distorted by a simplex noise sample so the boundary
  // wobbles instead of being a perfect circle.
  float dh = length(vWorldPos.xz - vec2(uHoverX, uHoverZ));
  float n =
    snoise(vWorldPos.xz * uRevealNoiseScale) * uRevealNoiseStrength;
  float dist = dh + n;
  float mask = 1.0 - smoothstep(
    max(uRevealRadius - uRevealBlur, 0.0),
    uRevealRadius + uRevealBlur,
    dist
  );
  mask *= uHoverActive;

  // Focus/fog fade — same as the surface + particles. Wireframe
  // dissolves into the bg when outside the focus circle.
  float focusR = length(vWorldPos.xz - vec2(uFocusX, uFocusZ));
  float fogFactor = smoothstep(uFogInner, uFogOuter, focusR);

  float introWire = smoothstep(0.4, 1.0, uIntro);
  float alpha = lineAlpha * mask * uWireOpacity
    * (1.0 - fogFactor) * introWire;
  if (alpha < 0.002) discard;
  gl_FragColor = vec4(uWireColor, alpha);
}


// ===== shader 23 — 030-0o2p9sr872c1k.js =====

uniform vec3 uParticleColor;
uniform vec3 uParticleColorFar;
uniform float uParticleGradStart;
uniform float uParticleGradEnd;
uniform float uParticleOpacity;
uniform float uFogInner;
uniform float uFogOuter;
uniform vec3 uPLightDir;
uniform float uPAmbient;
uniform float uPDiffuse;
uniform float uPSpec;
uniform float uPSpecPower;
// Hover tint — when a particle is under the cursor halo,
// vHoverFall > 0 and the fragment leans toward this colour.
uniform vec3 uParticleHoverColor;
uniform float uParticleHoverStrength;
varying float vAlphaScale;
varying float vFocusR;
varying float vHoverFall;
varying float vCamForward;
varying float vTunnelMix;
void main() {
  // Force highp on gl_PointCoord — Safari defaults to mediump
  // (1/255 step across a sprite) which collapses the hemisphere
  // normal we derive below to a near-constant. Brave uses highp
  // by default so the same code looks right there.
  highp vec2 pc = gl_PointCoord;
  vec2 c = pc - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  float fogFactor = smoothstep(uFogInner, uFogOuter, vFocusR);
  float alpha = (1.0 - smoothstep(0.35, 0.5, d))
              * uParticleOpacity * vAlphaScale * (1.0 - fogFactor);
  // Hemisphere normal in view space. (x,y) = coord centred, z
  // computed from sphere equation so the normal points outward.
  vec2 n2 = vec2(c.x, -c.y) * 2.0;
  float nz2 = clamp(1.0 - dot(n2, n2), 0.0, 1.0);
  vec3 N = vec3(n2, sqrt(nz2));
  vec3 L = normalize(uPLightDir);
  float diff = max(dot(N, L), 0.0);
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0),
    max(uPSpecPower, 0.001));
  float shade = uPAmbient + uPDiffuse * diff;
  // Tunnel gradient — only active when uTunnelProgress > 0.
  // vCamForward > 0 = ahead of camera. Map [start..end] world
  // units to 0..1 colour mix between near and far colours.
  float gradT = clamp(
    (vCamForward - uParticleGradStart)
      / max(uParticleGradEnd - uParticleGradStart, 0.0001),
    0.0, 1.0);
  vec3 baseCol = mix(uParticleColor, uParticleColorFar,
    gradT * vTunnelMix);
  // Hover tint mixes the base toward uParticleHoverColor by the
  // hover falloff times the strength slider. Applied BEFORE the
  // lighting multiply so the hover colour is what gets lit.
  baseCol = mix(baseCol, uParticleHoverColor,
    clamp(vHoverFall * uParticleHoverStrength, 0.0, 1.0));
  vec3 col = baseCol * shade + vec3(uPSpec * spec);
  gl_FragColor = vec4(col, alpha);
}


// ===== shader 24 — 030-0o2p9sr872c1k.js =====
t need these
// before; the oil mask uses them, so declare here.
uniform float uHoverX;
uniform float uHoverZ;
uniform float uHoverActive;
varying float vDisp;
varying vec3 vWorldPos;

void main() {
  // Lift peaks a touch brighter than valleys so the noise reads.
  float h = clamp(vDisp / max(uDisplacement, 0.0001) * 0.5 + 0.5, 0.0, 1.0);
  // Intro: start saturated at the peak (darker) colour so the
  // terrain reveals itself from 

// ===== shader 25 — 030-0o2p9sr872c1k.js =====

uniform float uParticleXZJitter;
uniform float uEmissionSize;
attribute float aRandom;

void main() {
  vec3 pos = position;
  float r1 = fract(aRandom * 13.31);
  float r2 = fract(aRandom * 71.17);
  pos.xz += (vec2(r1, r2) - 0.5) * uParticleXZJitter;
  gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
  // gl_PointSize is in RT pixels. RT is 512x512 covering a 60x60
  // plane, so 1 unit ≈ 8.5 RT pixels; emissionSize ≈ 16 maps to ~2
  // world-unit-wide soft halo per particle.
  gl_PointSize = uEmissionSize;
}


// ===== shader 26 — 030-0o2p9sr872c1k.js =====

uniform vec3 uParticleColor;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  // Quadratic falloff — soft halo, brightest at the centre.
  float a = 1.0 - smoothstep(0.0, 0.5, d);
  a = a * a;
  gl_FragColor = vec4(uParticleColor * a, a);
}


// ===== shader 27 — 030-0o2p9sr872c1k.js =====

${h}
${S}
${g}

uniform float uDustSpeed;
uniform float uDustRise;
uniform float uDustSize;
uniform float uDustSizeJitter;
uniform float uDustWander;
// Same camera-wrap trick as the particle layer so dust never runs
// out — it modulos around the camera and reappears ahead.
uniform float uCameraZ;
uniform float uDustZRange;
// Tunnel-mode redirection — when active, dust stops rising up
// the Y axis and instead streams forward along -Z (away from
// camera). It also spreads vertically around the tunnel centre Y
// so the flow fills the cylinder volume instead of staying as a
// flat plane along the original terrain height.
uniform float uTunnelProgress;
uniform float uDustForwardSpeed;
uniform float uTunnelCenterY;
uniform float uDustTunnelYSpread;
attribute float aSeed;
attribute float aPhase;
varying float vAge;
varying float vFocusR;
varying float vIntroMul;

void main() {
  float age = fract(uTime * uDustSpeed + aPhase);
  // Slow sideways drift, different per particle.
  float wx = sin(uTime * 0.7 + aSeed * 31.7) * uDustWander;
  float wz = cos(uTime * 0.5 + aSeed * 17.3) * uDustWander;
  float worldX = position.x + wx;
  float worldZ = position.z + wz;

  // Wrap world Z around the camera.
  float zRange = max(uDustZRange, 1.0);
  float relZ = worldZ - uCameraZ;
  relZ = mod(relZ + zRange * 0.5, zRange) - zRange * 0.5;
  worldZ = uCameraZ + relZ;

  float surfY = computeDisplacement(vec2(worldX, worldZ));
  // Surface-mode Y: rise off the terrain over age.
  float surfaceY = surfY + age * uDustRise;
  // Tunnel-mode Y: spread vertically around the tunnel centre by
  // a per-particle pseudo-random hash. Mixed in by progress so
  // the column has volume (not a flat plane at surface height).
  float ySpread = (fract(aSeed * 13.71) - 0.5)
    * uDustTunnelYSpread;
  float tunnelY = uTunnelCenterY + ySpread;
  float worldY = mix(surfaceY, tunnelY, uTunnelProgress);
  // -Z forward flow over age cycle (only in tunnel mode).
  float flowZ = age * uDustForwardSpeed * uTunnelProgress;
  worldZ = worldZ - flowZ;
  // Re-wrap after the forward flow so particles still recycle
  // around the camera and don

// ===== shader 28 — 030-0o2p9sr872c1k.js =====

uniform vec3 uDustColor;
uniform float uDustOpacity;
uniform float uFogInner;
uniform float uFogOuter;
varying float vAge;
varying float vFocusR;
varying float vIntroMul;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  // Soft circular sprite + bell-curve life fade so particles bloom
  // and dissolve instead of popping at the cycle boundary.
  float discAlpha = 1.0 - smoothstep(0.35, 0.5, d);
  float lifeAlpha = sin(vAge * 3.14159);
  float fogFactor = smoothstep(uFogInner, uFogOuter, vFocusR);
  float a = discAlpha * lifeAlpha * uDustOpacity
    * (1.0 - fogFactor) * vIntroMul;
  gl_FragColor = vec4(uDustColor, a);
}


// ===== shader 29 — 030-0o2p9sr872c1k.js =====

varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}


// ===== shader 30 — 030-0o2p9sr872c1k.js =====

uniform sampler2D tDiffuse;
uniform float uCA;
uniform float uLens;
varying vec2 vUv;
void main() {
  vec2 uv = vUv - 0.5;
  float r2 = dot(uv, uv);
  uv *= 1.0 + uLens * r2;
  uv += 0.5;
  vec2 dir = uv - 0.5;
  float d = length(dir);
  vec2 off = dir * d * uCA;
  float r = texture2D(tDiffuse, uv - off).r;
  float g = texture2D(tDiffuse, uv      ).g;
  float b = texture2D(tDiffuse, uv + off).b;
  vec3 col = vec3(r, g, b);
  gl_FragColor = vec4(col, 1.0);
}


// ===== shader 31 — 030-0o2p9sr872c1k.js =====

varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}


// ===== shader 32 — 030-0o2p9sr872c1k.js =====

${h}
uniform float uTime;
uniform float uCausticsScale;
uniform float uCausticsSpeed;
uniform float uCausticsContrast;
uniform vec2 uCausticsWorldMin;
uniform vec2 uCausticsWorldMax;
uniform vec2 uScrollOffset;
varying vec2 vUV;
void main() {
  vec2 worldXZ = mix(uCausticsWorldMin, uCausticsWorldMax, vUV);
  float ct = uTime * uCausticsSpeed;
  vec2 cp = worldXZ * uCausticsScale;
  float c1 = snoise(cp + vec2(ct * 0.6, ct * 0.4));
  float c2 = snoise(cp * 1.37 - vec2(ct * 0.3, -ct * 0.5));
  float ridge = (1.0 - abs(c1)) * (1.0 - abs(c2));
  ridge = pow(clamp(ridge, 0.0, 1.0), max(uCausticsContrast, 0.001));
  gl_FragColor = vec4(ridge, ridge, ridge, 1.0);
}


// ===== shader 33 — 030-0o2p9sr872c1k.js =====

        uniform vec3 uFogColor;
        uniform float uSurfaceDarken;
        void main() {
          // Match the surface

// ===== shader 34 — 030-0o2p9sr872c1k.js =====

        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      

// ===== shader 35 — 030-0o2p9sr872c1k.js =====
 front — leads the pigment outward so the
        //         bleed has a wet halo expanding ahead of the
        //         visible mark, then drying back as decay catches
        //         up. Pigment migrates toward the wet front and
        //         settles at its edge (the edge-darkening that
        //         makes watercolor look like watercolor).
        uniform sampler2D uPrevTex;
        uniform vec2 uTexel;
        uniform float uDecay;
        uniform float uBlur;
        uniform float uSplatActive;
        uniform vec2 uSplatPos;
        uniform vec2 uSplatPosPrev;
        uniform float uSplatHasPrev;
        uniform float uSplatRadius;
        uniform float uSplatStrength;
        uniform vec2 uWorldMin;
        uniform vec2 uWorldMax;
        uniform float uEdgeDarken;
        uniform float uWaterSpread;
        uniform float uPigmentDiff;
        varying vec2 vUv;
        void main() {
          vec2 o = uTexel * max(uBlur, 0.0);
          // 4 neighbors of pigment + water.
          vec4 cN  = texture2D(uPrevTex, vUv);
          vec4 nN  = texture2D(uPrevTex, vUv + vec2(0.0, o.y));
          vec4 sN  = texture2D(uPrevTex, vUv - vec2(0.0, o.y));
          vec4 eN  = texture2D(uPrevTex, vUv + vec2(o.x, 0.0));
          vec4 wN  = texture2D(uPrevTex, vUv - vec2(o.x, 0.0));
          float pC = cN.r; float wC = cN.g;
          float pAvg = (nN.r + sN.r + eN.r + wN.r) * 0.25;
          float wAvg = (nN.g + sN.g + eN.g + wN.g) * 0.25;
          // Laplacian diffusion: each cell moves toward its
          // neighbours

// ===== shader 36 — 030-0o2p9sr872c1k.js =====

        ${h}
        uniform vec3 uHoverPos;
        uniform float uHoverActivity;
        uniform float uHoverRadius;
        uniform float uHoverStrength;
        uniform float uTime;
        uniform float uNoiseAmp;
        uniform float uNoiseScale;
        uniform float uNoiseSpeed;
        varying vec2 vUv;
        varying float vWorldZ;
        void main() {
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          // Radial direction from tunnel axis (axis runs along
          // world Z through the mesh origin) outward to this
          // vertex. Used to push lines outward at the cursor.
          vec3 meshO = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
          vec2 radialXY = wp.xy - meshO.xy;
          float rLen = length(radialXY);
          vec3 radialDir = rLen > 0.0001
            ? vec3(radialXY / rLen, 0.0)
            : vec3(0.0);
          // Noise deformation — sample simplex in (angle, world Z)
          // so it tiles cleanly around the tube and walks along
          // its length with time. Pushes vertices radially in /
          // out, decoupled from the hover effect.
          float ang = atan(radialXY.y, radialXY.x);
          float t = uTime * uNoiseSpeed;
          vec2 nUv = vec2(
            ang * 1.6 + t * 0.7,
            wp.z * uNoiseScale - t
          );
          float n = snoise(nUv) * 0.7
            + snoise(nUv * 2.3 + vec2(11.0, 5.0)) * 0.3;
          wp.xyz += radialDir * n * uNoiseAmp;
          float d = distance(wp.xyz, uHoverPos);
          float r = max(uHoverRadius, 0.0001);
          float bell = exp(-(d * d) / (r * r));
          wp.xyz += radialDir
            * (uHoverStrength * uHoverActivity * bell);
          vWorldZ = wp.z;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      

// ===== shader 37 — 030-0o2p9sr872c1k.js =====

        uniform float uTunnelProgress;
        uniform vec3 uWireColor;
        uniform float uGridU;
        uniform float uGridV;
        uniform float uLineWidth;
        uniform float uLineSoftness;
        uniform float uWireOpacity;
        uniform float uTwist;
        uniform float uFogStart;
        uniform float uFogEnd;
        uniform float uFogNearStart;
        uniform float uFogNearEnd;
        uniform float uCameraZ;
        uniform float uCylLen;
        uniform float uReveal;
        uniform float uRevealEdge;
        uniform float uTime;
        uniform float uRotSpeed;
        varying vec2 vUv;
        varying float vWorldZ;
        void main() {
          float cylActive = smoothstep(0.92, 1.0, uTunnelProgress);
          if (cylActive < 0.001) discard;
          // V coordinate is anchored to WORLD Z (not the mesh
          // UV) so the rings stay put in space and appear to
          // slide past the camera as it flies forward. Line
          // density still controlled by uGridV (lines per
          // CYL_LENGTH world units).
          float worldV = vWorldZ * (uGridV / max(uCylLen, 0.001));
          // Twist offsets U as a function of world V. Time
          // term spins the spiral in the same direction as the
          // particle tunnel (uRotSpeed is shared). vUv.x ∈ [0,1]
          // wraps the cylinder, so 1.0 of U = 2π radians.
          float rot = uTime * uRotSpeed / 6.2831853;
          float uTwisted =
            (vUv.x + rot) * uGridU + worldV * uTwist;
          // Spiral only — distance to the nearest twisted-U
          // line. Ring axis (worldV) intentionally skipped so
          // the wireframe is pure spirals, no cross hatch.
          float f = fract(uTwisted) - 0.5;
          float dist = abs(f);
          float soft = max(uLineSoftness, 0.00001);
          float line = 1.0 - smoothstep(
            uLineWidth, uLineWidth + soft, dist);
          if (line < 0.001) discard;
          // Distance from camera along world Z. Two fades:
          // far cuts at uFogStart..uFogEnd, near cuts close
          // to camera at uFogNearEnd..uFogNearStart.
          float dz = abs(vWorldZ - uCameraZ);
          float farFog = 1.0 - smoothstep(uFogStart, uFogEnd, dz);
          float nearFog = smoothstep(uFogNearEnd, uFogNearStart, dz);
          float fog = farFog * nearFog;
          // Wipe — reveal sweeps outward from camera as uReveal
          // ramps 0→1. Lines appear at the camera first and
          // extend forward/backward symmetrically.
          float revealDist = uReveal * (uCylLen * 0.5 + uRevealEdge);
          float wipe = 1.0 - smoothstep(
            revealDist - uRevealEdge, revealDist, dz);
          float a = line * uWireOpacity * cylActive * fog * wipe;
          if (a < 0.001) discard;
          gl_FragColor = vec4(uWireColor, a);
        }
      

// ===== shader 38 — 030-0o2p9sr872c1k.js =====

        ${h}
        uniform float uTime;
        uniform float uCylLen;
        uniform float uScale;
        uniform float uDeform;
        uniform float uSpeed;
        uniform float uRotSpeed;
        varying vec2 vUv;
        varying float vN;
        varying float vWorldZ;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vec3 meshO = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
          vec2 rXY = wp.xy - meshO.xy;
          float rLen = length(rXY);
          vec2 unit = rLen > 0.0001 ? rXY / rLen : vec2(1.0, 0.0);
          // Rotate the SAMPLED unit vector by uTime*uRotSpeed —
          // texture spins around the tube axis without moving
          // the mesh itself. Same scheme particle / wire
          // shaders use via their own rotSpeed.
          float rotAng = uTime * uRotSpeed;
          float cr = cos(rotAng), sr = sin(rotAng);
          vec2 rotUnit = vec2(
            unit.x * cr - unit.y * sr,
            unit.x * sr + unit.y * cr);
          float worldV = wp.z * (1.0 / max(uCylLen, 0.001));
          float k = max(uScale, 0.0001);
          float t = worldV * 40.0 - uTime * uSpeed;
          float n1 = snoise(vec2(rotUnit.x * k * 2.0, t));
          float n2 = snoise(vec2(rotUnit.y * k * 2.0, t + 17.0));
          float n3 = snoise(vec2(rotUnit.x * k * 4.2, t * 1.3 - 9.0)) * 0.5;
          float n4 = snoise(vec2(rotUnit.y * k * 4.2, t * 1.3 + 5.0)) * 0.5;
          float n = (n1 + n2 + n3 + n4) / 3.0;
          vN = n * 0.5 + 0.5;
          vec3 radialDir = vec3(unit, 0.0);
          wp.xyz += radialDir * n * uDeform;
          vWorldZ = wp.z;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      

// ===== shader 39 — 030-0o2p9sr872c1k.js =====

        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uTunnelProgress;
        uniform float uCameraZ;
        uniform float uFogNearStart;
        uniform float uFogNearEnd;
        uniform float uFogFarStart;
        uniform float uFogFarEnd;
        uniform float uRevealDist;
        uniform float uRevealEdge;
        varying vec2 vUv;
        varying float vN;
        varying float vWorldZ;
        void main() {
          float cylActive = smoothstep(0.92, 1.0, uTunnelProgress);
          if (cylActive < 0.001) discard;
          float dz = abs(vWorldZ - uCameraZ);
          // Near + far fog windows.
          float farFog =
            smoothstep(uFogFarStart, uFogFarEnd, dz);
          float nearFog = 1.0 -
            smoothstep(uFogNearEnd, uFogNearStart, dz);
          float visible = (1.0 - farFog) * (1.0 - nearFog);
          // Wave reveal — visible where dz > uRevealDist. Front
          // starts at the far end (uRevealDist = max) and walks
          // inward toward the camera (uRevealDist → 0), so the
          // texture appears first at the hole and floods toward
          // the viewer.
          float reveal =
            smoothstep(
              uRevealDist - uRevealEdge,
              uRevealDist + uRevealEdge,
              dz);
          float a = vN * uOpacity * cylActive * visible * reveal;
          if (a < 0.002) discard;
          gl_FragColor = vec4(uColor * (0.6 + vN * 0.6), a);
        }
      