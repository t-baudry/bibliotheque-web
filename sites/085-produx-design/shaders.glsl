// ===== shader 1 — 005-0m9vh1vcfsnp5.js =====
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// ===== shader 2 — 005-0m9vh1vcfsnp5.js =====
uniform sampler2D uTexture;
uniform float uReveal;
uniform float uPixelSize;
uniform float uNoise;
uniform float uEdgeSoftness;
uniform vec2  uResolution;
uniform int   uDirection;
uniform int   uNoiseMode;
uniform float uWaveRand;
uniform float uColorNoise;
uniform float uColorStabilize;
uniform vec3  uEdgeColor;
uniform float uEdgeWidth;
uniform float uEdgeIntensity;
uniform float uEdgeRandomness;
uniform float uSlideClip;
uniform vec2 uGlobalOffset;
uniform vec2 uGlobalScale;
uniform int  uPerWord;
uniform float uOpacity;
varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}
vec3 hash23(vec2 p) {
  return vec3(hash21(p), hash21(p + 127.33), hash21(p + 254.66)) * 2.0 - 1.0;
}

float getBlockNoise(vec2 bc, int mode, vec2 grid) {
  if (mode == 0) return hash21(bc);
  if (mode == 1) { vec2 cl = floor(bc / 3.0); return hash21(cl); }
  if (mode == 2) { float band = mod(floor(bc.y / 2.0), 2.0); return band * 0.55 + hash21(bc) * 0.45; }
  if (mode == 3) { float col = bc.x / max(grid.x, 1.0); float rp = hash21(vec2(0.0, bc.y)) * 0.12; return col * 0.78 + rp + hash21(bc) * 0.1; }
  if (mode == 4) { float pr = bc.x / max(grid.x, 1.0); float zz = mod(bc.y, 2.0) < 1.0 ? pr : 1.0 - pr; return zz * 0.75 + hash21(bc) * 0.25; }
  if (mode == 5) { float dg = mod(bc.x + bc.y, 4.0) / 4.0; return dg * 0.7 + hash21(bc) * 0.3; }
  if (mode == 6) { float cp = hash21(vec2(bc.x, 0.0)); float ri = 1.0 - bc.y / max(grid.y, 1.0); return cp * 0.55 + ri * 0.25 + hash21(bc) * 0.2; }
  if (mode == 7) {
    float sweep;
    if      (uDirection == 0) sweep = bc.y / max(grid.y, 1.0);
    else if (uDirection == 1) sweep = 1.0 - bc.y / max(grid.y, 1.0);
    else if (uDirection == 2) sweep = bc.x / max(grid.x, 1.0);
    else if (uDirection == 3) sweep = 1.0 - bc.x / max(grid.x, 1.0);
    else                      sweep = (bc.x + bc.y) / max(grid.x + grid.y, 1.0);
    float scatter = hash21(bc) * uWaveRand;
    return sweep * (1.0 - uWaveRand) + scatter;
  }
  if (mode == 8) { vec2 cen = grid * 0.5; float dst = length(bc - cen) / max(length(cen), 1.0); float sc = hash21(bc) * uWaveRand; return dst * (1.0 - uWaveRand) + sc; }
  if (mode == 9) { float dg = (bc.x + bc.y) / max(grid.x + grid.y, 1.0); float sc = hash21(bc) * uWaveRand; return dg * (1.0 - uWaveRand) + sc; }
  return 0.0;
}

void main() {
  if (uReveal <= 0.001) discard;
  if (uDirection != 4 && vUv.y < uSlideClip) discard;

  vec4 sharpTex = texture2D(uTexture, vUv);
  if (sharpTex.a < 0.01) discard;

  vec2 grid = uResolution / uPixelSize;
  vec2 blockCoord = floor(vUv * uResolution / uPixelSize);
  vec2 blockUv = clamp(
    (blockCoord * uPixelSize + uPixelSize * 0.5) / uResolution,
    vec2(0.0), vec2(1.0)
  );

  float noise = getBlockNoise(blockCoord, uNoiseMode, grid);
  vec2 globalBlockUv = uGlobalOffset + blockUv * uGlobalScale;
  vec2 baseUv = (uPerWord == 1) ? blockUv : globalBlockUv;

  float base;
  if      (uDirection == 0) base = baseUv.y;
  else if (uDirection == 1) base = 1.0 - baseUv.y;
  else if (uDirection == 2) base = baseUv.x;
  else if (uDirection == 3) base = 1.0 - baseUv.x;
  else                      base = 0.0;

  float threshold;
  if (uDirection == 4) {
    threshold = noise;
  } else if (uPerWord == 2) {
    float noiseOffset = (noise - 0.5) * uNoise * 0.2;
    float jitter = (hash21(blockCoord) - 0.5) * uWaveRand * 0.15;
    threshold = base + noiseOffset + jitter;
  } else {
    threshold = mix(base, noise, uNoise);
  }
  threshold = max(threshold, uEdgeSoftness + 0.01);
  float vis = smoothstep(threshold - uEdgeSoftness, threshold, uReveal);
  if (vis < 0.01) discard;

  float freshness = 1.0 - smoothstep(threshold, threshold + uColorStabilize, uReveal);
  vec4 blockTex = texture2D(uTexture, blockUv);
  vec3 blockRgb = blockTex.a > 0.5 ? blockTex.rgb : sharpTex.rgb;
  vec3 texRgb = mix(sharpTex.rgb, blockRgb, freshness);
  vec3 noisyColor = clamp(texRgb + hash23(blockCoord) * uColorNoise * freshness, 0.0, 1.0);

  float proximity = uReveal - threshold;
  float blockJitter = hash21(blockCoord + 99.0) * uEdgeRandomness;
  float edgeBlend = 1.0 - smoothstep(0.0, uEdgeWidth + blockJitter, proximity);
  vec3 finalColor = mix(noisyColor, uEdgeColor, edgeBlend * uEdgeIntensity);

  gl_FragColor = vec4(finalColor, sharpTex.a * vis * uOpacity);
}

// ===== shader 3 — 005-0m9vh1vcfsnp5.js =====

    uniform vec2  uVelocity;
    uniform float uWarpStrength;
    uniform float uWarpEnabled;
    uniform float uWarpMode;
    varying vec2  vUv;
    void main() {
        vUv = uv;
        vec3 pos = position;
        if (uWarpEnabled > 0.5) {
            float velLen = length(uVelocity);
            if (uWarpMode < 0.5) {
                if (velLen > 0.001) {
                    vec2  velDir = uVelocity / velLen;
                    float along  = dot((uv - 0.5) * 2.0, velDir);
                    float trailW = 1.0 - (along * 0.5 + 0.5);
                    trailW       = trailW * trailW;
                    pos.xy      += uVelocity * trailW * uWarpStrength;
                }
            } else if (uWarpMode > 2.5) {
                if (velLen > 0.001) {
                    vec2  velDir = uVelocity / velLen;
                    float along  = dot((uv - 0.5) * 2.0, velDir);
                    float trailW = along * 0.5 + 0.5;
                    trailW       = trailW * trailW;
                    pos.xy      += uVelocity * trailW * uWarpStrength;
                }
            } else if (velLen > 0.001) {
                vec2  fromCenter = (uv - 0.5) * 2.0;
                float dist       = length(fromCenter);
                if (dist > 0.001) {
                    float edge = dist * dist;
                    float sign = uWarpMode > 1.5 ? -1.0 : 1.0;
                    pos.xy    += normalize(fromCenter) * velLen * uWarpStrength * sign * edge;
                }
            }
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }


// ===== shader 4 — 005-0m9vh1vcfsnp5.js =====

    uniform sampler2D uTexA;
    uniform sampler2D uTexB;
    uniform float     uProgress;
    uniform float     uGridSize;
    uniform vec3      uPixelColor;
    uniform float     uAlpha;
    uniform float     uTransitioning;
    uniform float     uDirection;
    uniform float     uWaveNoise;
    uniform float     uBandWidth;
    uniform float     uEntry;
    uniform float     uExit;
    uniform float     uColorRandom;
    uniform float     uRandomRange;
    uniform float     uDistortion;
    uniform float     uDistGridSize;
    uniform float     uDistEnabled;
    varying vec2      vUv;

    float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898,78.233))) * 43758.5453); }

    void main() {
        vec2 distUv = vUv;
        if (uDistEnabled > 0.5) {
            float gs   = max(uDistGridSize, 1.0);
            vec2  cell = floor(vUv * gs) / gs;
            float nx   = rand(cell) * 2.0 - 1.0;
            float ny   = rand(cell + vec2(3.7, 9.2)) * 2.0 - 1.0;
            distUv     = clamp(vUv + vec2(nx, ny) * (uDistortion / gs), 0.0, 1.0);
        }

        if (uTransitioning < 0.5) {
            gl_FragColor = vec4(texture2D(uTexA, distUv).rgb, uAlpha);
        } else {
            vec2  waveCell  = floor(vUv * uGridSize);
            float cellY     = waveCell.y / uGridSize;
            float cellX     = waveCell.x / uGridSize;
            float dirY      = uDirection > 0.0 ? cellY : (1.0 - cellY);

            // --- KEY CHANGE ---
            // Per-cell 2D noise instead of per-column 1D noise.
            // rand(waveCell) varies independently for every (x,y) cell.
            float cellNoise = (rand(waveCell) - 0.5) * 2.0;

            // Optional: bias the noise slightly toward the sweep direction
            // so the leading edge still feels directional but pixels scatter in X too.
            float crossNoise = (rand(waveCell + vec2(17.3, 5.7)) - 0.5) * 2.0;
            float noise = (cellNoise + crossNoise * 0.4) * uWaveNoise;

            float threshold = dirY + noise;
            // ------------------

            float band = uBandWidth / uGridSize;
            if (threshold > uProgress + band) {
                if (uEntry > 0.5) discard;
                gl_FragColor = vec4(texture2D(uTexA, distUv).rgb, uAlpha);
            } else if (threshold > uProgress - band) {
                float bv = uColorRandom > 0.5
                    ? rand(waveCell) * uRandomRange + (1.0 - uRandomRange) : 1.0;
                gl_FragColor = vec4(uPixelColor * bv, uAlpha);
            } else {
                if (uExit > 0.5) discard;
                gl_FragColor = vec4(texture2D(uTexB, distUv).rgb, uAlpha);
            }
        }
    }


// ===== shader 5 — 007-0i-.3ea0..wgc.js =====

                varying vec2 vUv;
                void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
            

// ===== shader 6 — 007-0i-.3ea0..wgc.js =====

                uniform sampler2D uTexture;
                uniform vec2 uResolution, uMouse, uPrevMouse, uVelocity;
                uniform float uAspect, uDamping, uSpring, uBrushSize, uPush, uInkDissipation, uIsMoving;
                varying vec2 vUv;

                float sdLine(vec2 p, vec2 a, vec2 b) {
                    vec2 pa = p - a, ba = b - a;
                    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                    return length(pa - ba * h);
                }

                void main() {
                    vec2 cellSize = 1.0 / uResolution;
                    vec4 data = texture2D(uTexture, vUv);
                    float pressure = data.r, pVel = data.g, ink = data.b;
                    
                    float p_right = texture2D(uTexture, vUv + vec2(cellSize.x, 0.0)).r;
                    float p_left  = texture2D(uTexture, vUv + vec2(-cellSize.x, 0.0)).r;
                    float p_up    = texture2D(uTexture, vUv + vec2(0.0, cellSize.y)).r;
                    float p_down  = texture2D(uTexture, vUv + vec2(0.0, -cellSize.y)).r;
                    
                    float laplacian = p_right + p_left + p_up + p_down - 4.0 * pressure;
                    pVel += laplacian * 0.25;
                    pVel -= uSpring * pressure;
                    pressure += pVel;
                    pVel *= uDamping;
                    pressure *= 0.99;

                    vec2 distUV = vUv; 
                    distUV.x *= uAspect;
                    vec2 currM = uMouse; 
                    currM.x *= uAspect;
                    vec2 prevM = uPrevMouse; 
                    prevM.x *= uAspect;

                    float dist = sdLine(distUV, prevM, currM);
                    
                    if (uIsMoving > 0.5 && dist < uBrushSize) {
                        float power = 1.0 - (dist / uBrushSize);
                        pressure += power * 0.5;
                        pVel += length(uVelocity) * uPush * power;
                        ink += power * 0.3;
                    }
                    gl_FragColor = vec4(pressure, pVel, ink * uInkDissipation, 1.0);
                }
            

// ===== shader 7 — 007-0i-.3ea0..wgc.js =====

                varying vec2 vUv;
                void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
            

// ===== shader 8 — 007-0i-.3ea0..wgc.js =====

                uniform sampler2D uState, uTextureA, uTextureB;
                uniform vec2 uResolution;
                uniform float uRefraction, uDistStrength, uDistScale, uSoftness, uBrightness, uContrast;
                uniform float uPixelRes, uPixelationEnabled, uDitherEnabled, uDitherGrid, uColorDepth, uGrayscale, uInvertB;
                uniform vec3 uBgColor;
                uniform float uPixelEdgeRes, uEdgeThreshold;
                // ─── LETTER ENTRY ANIMATION ───
                // P:0-180  R:180-380  O:380-630  D:630-830  U:830-1070  X:1070-1280  (scale 1280)
                uniform vec3 uLetterProg1; // x=P  y=R  z=O
                uniform vec3 uLetterProg2; // x=D  y=U  z=X
                varying vec2 vUv;

                float getDither(vec2 pos) {
                    vec2 pixel = floor(mod(pos.xy / uDitherGrid, 4.0));
                    float m[16];
                    m[0]=0.0625; m[1]=0.5625; m[2]=0.1875; m[3]=0.6875;
                    m[4]=0.8125; m[5]=0.3125; m[6]=0.9375; m[7]=0.4375;
                    m[8]=0.25;   m[9]=0.75;   m[10]=0.125; m[11]=0.625;
                    m[12]=1.0;   m[13]=0.5;   m[14]=0.875; m[15]=0.375;
                    return m[int(pixel.y) * 4 + int(pixel.x)];
                }

                // Returns the entry-animation progress (0=hidden above, 1=in place)
                // for the letter column at UV x-coordinate u.
                // A small smoothstep blend zone (~4px) is placed at each boundary
                // so the sampling-UV discontinuity between adjacent columns is
                // absorbed in the transparent inter-letter gap — no visible seam.
                float getLetterProgress(float u) {
                    float w = 0.003; // ~4px blend zone at 1280px scale
                    float p0 = uLetterProg1.x; // P
                    float p1 = uLetterProg1.y; // R
                    float p2 = uLetterProg1.z; // O
                    float p3 = uLetterProg2.x; // D
                    float p4 = uLetterProg2.y; // U
                    float p5 = uLetterProg2.z; // X

                    // Boundary centres (coords / 1280)
                    float b0 = 0.140625;  // 180
                    float b1 = 0.296875;  // 380
                    float b2 = 0.4921875; // 630
                    float b3 = 0.6484375; // 830
                    float b4 = 0.8359375; // 1070

                    if (u < b0 - w) return p0;
                    if (u < b0 + w) return mix(p0, p1, smoothstep(b0 - w, b0 + w, u));
                    if (u < b1 - w) return p1;
                    if (u < b1 + w) return mix(p1, p2, smoothstep(b1 - w, b1 + w, u));
                    if (u < b2 - w) return p2;
                    if (u < b2 + w) return mix(p2, p3, smoothstep(b2 - w, b2 + w, u));
                    if (u < b3 - w) return p3;
                    if (u < b3 + w) return mix(p3, p4, smoothstep(b3 - w, b3 + w, u));
                    if (u < b4 - w) return p4;
                    if (u < b4 + w) return mix(p4, p5, smoothstep(b4 - w, b4 + w, u));
                    return p5;
                }

                void main() {
                    vec2 cellSize = 1.0 / uResolution;
                    float p = texture2D(uState, vUv).r;
                    float pR = texture2D(uState, vUv + vec2(cellSize.x, 0.0)).r;
                    float pU = texture2D(uState, vUv + vec2(0.0, cellSize.y)).r;

                    // ─── PER-LETTER SLIDE-UP: same logic as NavbarMorphingLogo ───
                    // lp=0 → letter is 1 full canvas-height below; lp=1 → letter in place
                    float lp = getLetterProgress(vUv.x);
                    float yOff = (1.0 - lp); // positive = shift sampling UP → letter appears above

                    // ─── texA (always-visible base layer) ───
                    vec2 animUvA = vec2(vUv.x, vUv.y + yOff);
                    vec4 texA = texture2D(uTextureA, animUvA);
                    // Clamp: zero alpha when sampling outside the [0,1] V range
                    texA.a *= lp * step(0.0, animUvA.y) * step(animUvA.y, 1.0);

                    // ─── texB (ink-revealed layer) ───
                    vec2 distortion = vec2(pR - p, pU - p) * uRefraction * uDistStrength;
                    vec2 targetUv = (uPixelationEnabled > 0.5) ? floor(vUv * uPixelRes) / uPixelRes : vUv;
                    vec2 distortedPUv = targetUv - (distortion * uDistScale);
                    vec2 animDistUv  = vec2(distortedPUv.x, distortedPUv.y + yOff);
                    vec4 rawTexB = texture2D(uTextureB, animDistUv);
                    rawTexB.a *= lp * step(0.0, animDistUv.y) * step(animDistUv.y, 1.0);
                    
                    vec3 colorB = rawTexB.rgb;
                    if(uGrayscale > 0.5) colorB = vec3(dot(colorB, vec3(0.299, 0.587, 0.114)));
                    if(uInvertB > 0.5) colorB = 1.0 - colorB;
                    
                    colorB = floor(colorB * uColorDepth) / uColorDepth;
                    colorB = (colorB - 0.5) * uContrast + 0.5 + (uBrightness - 1.0);

                    if(uDitherEnabled > 0.5) {
                        float lum = dot(colorB, vec3(0.299, 0.587, 0.114));
                        if(lum < getDither(gl_FragCoord.xy)) colorB *= 0.8;
                    }

                    // ─── PIXEL EDGES: snap ink UV to a pixel grid, then hard-cut ───
                    vec2 pixelUv = floor(vUv * uPixelEdgeRes) / uPixelEdgeRes;
                    float ink = texture2D(uState, pixelUv).b;
                    float inkMask = step(uEdgeThreshold, ink);

                    vec4 bgColor = vec4(uBgColor, 1.0);
                    vec4 baseA = mix(bgColor, texA, texA.a);
                    vec4 revealedB = mix(bgColor, vec4(colorB, 1.0), rawTexB.a);

                    gl_FragColor = mix(baseA, revealedB, inkMask);
                }
            

// ===== shader 9 — 016-0k4m.k83bg769.js =====

varying vec2 vUv; 
void main() { 
    vUv = uv; 
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
}

// ===== shader 10 — 016-0k4m.k83bg769.js =====

uniform sampler2D uTexture; 
uniform sampler2D uDataTexture; 
uniform vec4 resolution; // xy = quad dimensions, zw = image dimensions
varying vec2 vUv; 

void main() { 
    // Calculate aspect ratios
    float quadAspect = resolution.x / resolution.y;
    float imageAspect = resolution.z / resolution.w;

    vec2 ratio;
    if (quadAspect < imageAspect) {
        ratio = vec2(quadAspect / imageAspect, 1.0);
    } else {
        ratio = vec2(1.0, imageAspect / quadAspect);
    }

    // Apply cover math to the UVs
    vec2 coverUV = (vUv - 0.5) * ratio + 0.5;

    // Sample the interaction data mapping to the screen
    vec4 offset = texture2D(uDataTexture, vUv); 
    
    // Output the final covered texture with distortion
    gl_FragColor = texture2D(uTexture, coverUV - 0.02 * offset.rg); 
}

// ===== shader 11 — 018-0e2dxdfs4-avt.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 12 — 018-0e2dxdfs4-avt.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 13 — 018-0e2dxdfs4-avt.js =====
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
		

// ===== shader 14 — 018-0e2dxdfs4-avt.js =====

			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

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
		

// ===== shader 15 — 018-0e2dxdfs4-avt.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 16 — 018-0e2dxdfs4-avt.js =====


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
	

// ===== shader 17 — 018-0e2dxdfs4-avt.js =====

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

// ===== shader 18 — 018-0e2dxdfs4-avt.js =====
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

// ===== shader 19 — 018-0e2dxdfs4-avt.js =====

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

// ===== shader 20 — 022-134f89ww_qe_x.js =====

                varying vec2 vUv;
                void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
            

// ===== shader 21 — 022-134f89ww_qe_x.js =====

                uniform sampler2D uTexture;
                uniform vec2 uResolution, uMouse, uPrevMouse, uVelocity;
                uniform float uAspect, uDamping, uSpring, uBrushSize, uPush, uInkDissipation, uIsMoving;
                varying vec2 vUv;

                float sdLine(vec2 p, vec2 a, vec2 b) {
                    vec2 pa = p - a, ba = b - a;
                    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                    return length(pa - ba * h);
                }

                void main() {
                    vec2 cellSize = 1.0 / uResolution;
                    vec4 data = texture2D(uTexture, vUv);
                    float pressure = data.r, pVel = data.g, ink = data.b;
                    
                    float p_right = texture2D(uTexture, vUv + vec2(cellSize.x, 0.0)).r;
                    float p_left  = texture2D(uTexture, vUv + vec2(-cellSize.x, 0.0)).r;
                    float p_up    = texture2D(uTexture, vUv + vec2(0.0, cellSize.y)).r;
                    float p_down  = texture2D(uTexture, vUv + vec2(0.0, -cellSize.y)).r;
                    
                    float laplacian = p_right + p_left + p_up + p_down - 4.0 * pressure;
                    pVel += laplacian * 0.25;
                    pVel -= uSpring * pressure;
                    pressure += pVel;
                    pVel *= uDamping;
                    pressure *= 0.99;

                    vec2 distUV = vUv; 
                    distUV.x *= uAspect;
                    vec2 currM = uMouse; 
                    currM.x *= uAspect;
                    vec2 prevM = uPrevMouse; 
                    prevM.x *= uAspect;

                    float dist = sdLine(distUV, prevM, currM);
                    
                    if (uIsMoving > 0.5 && dist < uBrushSize) {
                        float power = 1.0 - (dist / uBrushSize);
                        pressure += power * 0.5;
                        pVel += length(uVelocity) * uPush * power;
                        ink += power * 0.3;
                    }
                    gl_FragColor = vec4(pressure, pVel, ink * uInkDissipation, 1.0);
                }
            

// ===== shader 22 — 022-134f89ww_qe_x.js =====

                varying vec2 vUv;
                void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
            

// ===== shader 23 — 022-134f89ww_qe_x.js =====

                uniform sampler2D uState, uTextureA, uTextureB;
                uniform vec2 uResolution;
                uniform float uRefraction, uDistStrength, uDistScale, uSoftness, uBrightness, uContrast;
                uniform float uPixelRes, uPixelationEnabled, uDitherEnabled, uDitherGrid, uColorDepth, uGrayscale, uInvertB;
                uniform vec3 uBgColor;
                uniform float uPixelEdgeRes, uEdgeThreshold;
                // ─── LETTER ENTRY ANIMATION ───
                // P:0-180  R:180-380  O:380-630  D:630-830  U:830-1070  X:1070-1280  (scale 1280)
                uniform vec3 uLetterProg1; // x=P  y=R  z=O
                uniform vec3 uLetterProg2; // x=D  y=U  z=X
                varying vec2 vUv;

                float getDither(vec2 pos) {
                    vec2 pixel = floor(mod(pos.xy / uDitherGrid, 4.0));
                    float m[16];
                    m[0]=0.0625; m[1]=0.5625; m[2]=0.1875; m[3]=0.6875;
                    m[4]=0.8125; m[5]=0.3125; m[6]=0.9375; m[7]=0.4375;
                    m[8]=0.25;   m[9]=0.75;   m[10]=0.125; m[11]=0.625;
                    m[12]=1.0;   m[13]=0.5;   m[14]=0.875; m[15]=0.375;
                    return m[int(pixel.y) * 4 + int(pixel.x)];
                }

                // Returns the entry-animation progress (0=hidden above, 1=in place)
                // for the letter column at UV x-coordinate u.
                // A small smoothstep blend zone (~4px) is placed at each boundary
                // so the sampling-UV discontinuity between adjacent columns is
                // absorbed in the transparent inter-letter gap — no visible seam.
                float getLetterProgress(float u) {
                    float w = 0.003; // ~4px blend zone at 1280px scale
                    float p0 = uLetterProg1.x; // P
                    float p1 = uLetterProg1.y; // R
                    float p2 = uLetterProg1.z; // O
                    float p3 = uLetterProg2.x; // D
                    float p4 = uLetterProg2.y; // U
                    float p5 = uLetterProg2.z; // X

                    // Boundary centres (coords / 1280)
                    float b0 = 0.140625;  // 180
                    float b1 = 0.296875;  // 380
                    float b2 = 0.4921875; // 630
                    float b3 = 0.6484375; // 830
                    float b4 = 0.8359375; // 1070

                    if (u < b0 - w) return p0;
                    if (u < b0 + w) return mix(p0, p1, smoothstep(b0 - w, b0 + w, u));
                    if (u < b1 - w) return p1;
                    if (u < b1 + w) return mix(p1, p2, smoothstep(b1 - w, b1 + w, u));
                    if (u < b2 - w) return p2;
                    if (u < b2 + w) return mix(p2, p3, smoothstep(b2 - w, b2 + w, u));
                    if (u < b3 - w) return p3;
                    if (u < b3 + w) return mix(p3, p4, smoothstep(b3 - w, b3 + w, u));
                    if (u < b4 - w) return p4;
                    if (u < b4 + w) return mix(p4, p5, smoothstep(b4 - w, b4 + w, u));
                    return p5;
                }

                void main() {
                    vec2 cellSize = 1.0 / uResolution;
                    float p = texture2D(uState, vUv).r;
                    float pR = texture2D(uState, vUv + vec2(cellSize.x, 0.0)).r;
                    float pU = texture2D(uState, vUv + vec2(0.0, cellSize.y)).r;

                    // ─── PER-LETTER SLIDE-UP: same logic as NavbarMorphingLogo ───
                    // lp=0 → letter is 1 full canvas-height below; lp=1 → letter in place
                    float lp = getLetterProgress(vUv.x);
                    float yOff = (1.0 - lp); // positive = shift sampling UP → letter appears above

                    // ─── texA (always-visible base layer) ───
                    vec2 animUvA = vec2(vUv.x, vUv.y + yOff);
                    vec4 texA = texture2D(uTextureA, animUvA);
                    // Clamp: zero alpha when sampling outside the [0,1] V range
                    texA.a *= lp * step(0.0, animUvA.y) * step(animUvA.y, 1.0);

                    // ─── texB (ink-revealed layer) ───
                    vec2 distortion = vec2(pR - p, pU - p) * uRefraction * uDistStrength;
                    vec2 targetUv = (uPixelationEnabled > 0.5) ? floor(vUv * uPixelRes) / uPixelRes : vUv;
                    vec2 distortedPUv = targetUv - (distortion * uDistScale);
                    vec2 animDistUv  = vec2(distortedPUv.x, distortedPUv.y + yOff);
                    vec4 rawTexB = texture2D(uTextureB, animDistUv);
                    rawTexB.a *= lp * step(0.0, animDistUv.y) * step(animDistUv.y, 1.0);
                    
                    vec3 colorB = rawTexB.rgb;
                    if(uGrayscale > 0.5) colorB = vec3(dot(colorB, vec3(0.299, 0.587, 0.114)));
                    if(uInvertB > 0.5) colorB = 1.0 - colorB;
                    
                    colorB = floor(colorB * uColorDepth) / uColorDepth;
                    colorB = (colorB - 0.5) * uContrast + 0.5 + (uBrightness - 1.0);

                    if(uDitherEnabled > 0.5) {
                        float lum = dot(colorB, vec3(0.299, 0.587, 0.114));
                        if(lum < getDither(gl_FragCoord.xy)) colorB *= 0.8;
                    }

                    // ─── PIXEL EDGES: snap ink UV to a pixel grid, then hard-cut ───
                    vec2 pixelUv = floor(vUv * uPixelEdgeRes) / uPixelEdgeRes;
                    float ink = texture2D(uState, pixelUv).b;
                    float inkMask = step(uEdgeThreshold, ink);

                    vec4 bgColor = vec4(uBgColor, 1.0);
                    vec4 baseA = mix(bgColor, texA, texA.a);
                    vec4 revealedB = mix(bgColor, vec4(colorB, 1.0), rawTexB.a);

                    gl_FragColor = mix(baseA, revealedB, inkMask);
                }
            

// ===== shader 24 — 025-0_lk9iwq5oxqa.js =====

    uniform vec2  uVelocity;
    uniform float uWarpStrength;
    uniform float uWarpEnabled;
    uniform float uWarpMode;
    varying vec2  vUv;
    void main() {
        vUv = uv;
        vec3 pos = position;
        if (uWarpEnabled > 0.5) {
            float velLen = length(uVelocity);
            if (uWarpMode < 0.5) {
                if (velLen > 0.001) {
                    vec2  velDir = uVelocity / velLen;
                    float along  = dot((uv - 0.5) * 2.0, velDir);
                    float trailW = 1.0 - (along * 0.5 + 0.5);
                    trailW       = trailW * trailW;
                    pos.xy      += uVelocity * trailW * uWarpStrength;
                }
            } else if (uWarpMode > 2.5) {
                if (velLen > 0.001) {
                    vec2  velDir = uVelocity / velLen;
                    float along  = dot((uv - 0.5) * 2.0, velDir);
                    float trailW = along * 0.5 + 0.5;
                    trailW       = trailW * trailW;
                    pos.xy      += uVelocity * trailW * uWarpStrength;
                }
            } else if (velLen > 0.001) {
                vec2  fromCenter = (uv - 0.5) * 2.0;
                float dist       = length(fromCenter);
                if (dist > 0.001) {
                    float edge = dist * dist;
                    float sign = uWarpMode > 1.5 ? -1.0 : 1.0;
                    pos.xy    += normalize(fromCenter) * velLen * uWarpStrength * sign * edge;
                }
            }
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }


// ===== shader 25 — 025-0_lk9iwq5oxqa.js =====

    uniform sampler2D uTexA;
    uniform sampler2D uTexB;
    uniform float     uProgress;
    uniform float     uGridSize;
    uniform vec3      uPixelColor;
    uniform float     uAlpha;
    uniform float     uTransitioning;
    uniform float     uDirection;
    uniform float     uWaveNoise;
    uniform float     uBandWidth;
    uniform float     uEntry;
    uniform float     uExit;
    uniform float     uColorRandom;
    uniform float     uRandomRange;
    uniform float     uDistortion;
    uniform float     uDistGridSize;
    uniform float     uDistEnabled;
    varying vec2      vUv;

    float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898,78.233))) * 43758.5453); }

    void main() {
        vec2 distUv = vUv;
        if (uDistEnabled > 0.5) {
            float gs   = max(uDistGridSize, 1.0);
            vec2  cell = floor(vUv * gs) / gs;
            float nx   = rand(cell) * 2.0 - 1.0;
            float ny   = rand(cell + vec2(3.7, 9.2)) * 2.0 - 1.0;
            distUv     = clamp(vUv + vec2(nx, ny) * (uDistortion / gs), 0.0, 1.0);
        }

        if (uTransitioning < 0.5) {
            gl_FragColor = vec4(texture2D(uTexA, distUv).rgb, uAlpha);
        } else {
            vec2  waveCell  = floor(vUv * uGridSize);
            float cellY     = waveCell.y / uGridSize;
            float cellX     = waveCell.x / uGridSize;
            float dirY      = uDirection > 0.0 ? cellY : (1.0 - cellY);

            // --- KEY CHANGE ---
            // Per-cell 2D noise instead of per-column 1D noise.
            // rand(waveCell) varies independently for every (x,y) cell.
            float cellNoise = (rand(waveCell) - 0.5) * 2.0;

            // Optional: bias the noise slightly toward the sweep direction
            // so the leading edge still feels directional but pixels scatter in X too.
            float crossNoise = (rand(waveCell + vec2(17.3, 5.7)) - 0.5) * 2.0;
            float noise = (cellNoise + crossNoise * 0.4) * uWaveNoise;

            float threshold = dirY + noise;
            // ------------------

            float band = uBandWidth / uGridSize;
            if (threshold > uProgress + band) {
                if (uEntry > 0.5) discard;
                gl_FragColor = vec4(texture2D(uTexA, distUv).rgb, uAlpha);
            } else if (threshold > uProgress - band) {
                float bv = uColorRandom > 0.5
                    ? rand(waveCell) * uRandomRange + (1.0 - uRandomRange) : 1.0;
                gl_FragColor = vec4(uPixelColor * bv, uAlpha);
            } else {
                if (uExit > 0.5) discard;
                gl_FragColor = vec4(texture2D(uTexB, distUv).rgb, uAlpha);
            }
        }
    }


// ===== shader 26 — 025-0_lk9iwq5oxqa.js =====
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// ===== shader 27 — 025-0_lk9iwq5oxqa.js =====
uniform sampler2D uTexture;
uniform float uReveal;
uniform float uPixelSize;
uniform float uNoise;
uniform float uEdgeSoftness;
uniform vec2  uResolution;
uniform int   uDirection;
uniform int   uNoiseMode;
uniform float uWaveRand;
uniform float uColorNoise;
uniform float uColorStabilize;
uniform vec3  uEdgeColor;
uniform float uEdgeWidth;
uniform float uEdgeIntensity;
uniform float uEdgeRandomness;
uniform float uSlideClip;
uniform vec2 uGlobalOffset;
uniform vec2 uGlobalScale;
uniform int  uPerWord;
uniform float uOpacity;
varying vec2 vUv;

float hash21(vec2 p) {
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}
vec3 hash23(vec2 p) {
  return vec3(hash21(p), hash21(p + 127.33), hash21(p + 254.66)) * 2.0 - 1.0;
}

float getBlockNoise(vec2 bc, int mode, vec2 grid) {
  if (mode == 0) return hash21(bc);
  if (mode == 1) { vec2 cl = floor(bc / 3.0); return hash21(cl); }
  if (mode == 2) { float band = mod(floor(bc.y / 2.0), 2.0); return band * 0.55 + hash21(bc) * 0.45; }
  if (mode == 3) { float col = bc.x / max(grid.x, 1.0); float rp = hash21(vec2(0.0, bc.y)) * 0.12; return col * 0.78 + rp + hash21(bc) * 0.1; }
  if (mode == 4) { float pr = bc.x / max(grid.x, 1.0); float zz = mod(bc.y, 2.0) < 1.0 ? pr : 1.0 - pr; return zz * 0.75 + hash21(bc) * 0.25; }
  if (mode == 5) { float dg = mod(bc.x + bc.y, 4.0) / 4.0; return dg * 0.7 + hash21(bc) * 0.3; }
  if (mode == 6) { float cp = hash21(vec2(bc.x, 0.0)); float ri = 1.0 - bc.y / max(grid.y, 1.0); return cp * 0.55 + ri * 0.25 + hash21(bc) * 0.2; }
  if (mode == 7) {
    float sweep;
    if      (uDirection == 0) sweep = bc.y / max(grid.y, 1.0);
    else if (uDirection == 1) sweep = 1.0 - bc.y / max(grid.y, 1.0);
    else if (uDirection == 2) sweep = bc.x / max(grid.x, 1.0);
    else if (uDirection == 3) sweep = 1.0 - bc.x / max(grid.x, 1.0);
    else                      sweep = (bc.x + bc.y) / max(grid.x + grid.y, 1.0);
    float scatter = hash21(bc) * uWaveRand;
    return sweep * (1.0 - uWaveRand) + scatter;
  }
  if (mode == 8) { vec2 cen = grid * 0.5; float dst = length(bc - cen) / max(length(cen), 1.0); float sc = hash21(bc) * uWaveRand; return dst * (1.0 - uWaveRand) + sc; }
  if (mode == 9) { float dg = (bc.x + bc.y) / max(grid.x + grid.y, 1.0); float sc = hash21(bc) * uWaveRand; return dg * (1.0 - uWaveRand) + sc; }
  return 0.0;
}

void main() {
  if (uReveal <= 0.001) discard;
  if (uDirection != 4 && vUv.y < uSlideClip) discard;

  vec4 sharpTex = texture2D(uTexture, vUv);
  if (sharpTex.a < 0.01) discard;

  vec2 grid = uResolution / uPixelSize;
  vec2 blockCoord = floor(vUv * uResolution / uPixelSize);
  vec2 blockUv = clamp(
    (blockCoord * uPixelSize + uPixelSize * 0.5) / uResolution,
    vec2(0.0), vec2(1.0)
  );

  float noise = getBlockNoise(blockCoord, uNoiseMode, grid);
  vec2 globalBlockUv = uGlobalOffset + blockUv * uGlobalScale;
  vec2 baseUv = (uPerWord == 1) ? blockUv : globalBlockUv;

  float base;
  if      (uDirection == 0) base = baseUv.y;
  else if (uDirection == 1) base = 1.0 - baseUv.y;
  else if (uDirection == 2) base = baseUv.x;
  else if (uDirection == 3) base = 1.0 - baseUv.x;
  else                      base = 0.0;

  float threshold;
  if (uDirection == 4) {
    threshold = noise;
  } else if (uPerWord == 2) {
    float noiseOffset = (noise - 0.5) * uNoise * 0.2;
    float jitter = (hash21(blockCoord) - 0.5) * uWaveRand * 0.15;
    threshold = base + noiseOffset + jitter;
  } else {
    threshold = mix(base, noise, uNoise);
  }
  threshold = max(threshold, uEdgeSoftness + 0.01);
  float vis = smoothstep(threshold - uEdgeSoftness, threshold, uReveal);
  if (vis < 0.01) discard;

  float freshness = 1.0 - smoothstep(threshold, threshold + uColorStabilize, uReveal);
  vec4 blockTex = texture2D(uTexture, blockUv);
  vec3 blockRgb = blockTex.a > 0.5 ? blockTex.rgb : sharpTex.rgb;
  vec3 texRgb = mix(sharpTex.rgb, blockRgb, freshness);
  vec3 noisyColor = clamp(texRgb + hash23(blockCoord) * uColorNoise * freshness, 0.0, 1.0);

  float proximity = uReveal - threshold;
  float blockJitter = hash21(blockCoord + 99.0) * uEdgeRandomness;
  float edgeBlend = 1.0 - smoothstep(0.0, uEdgeWidth + blockJitter, proximity);
  vec3 finalColor = mix(noisyColor, uEdgeColor, edgeBlend * uEdgeIntensity);

  gl_FragColor = vec4(finalColor, sharpTex.a * vis * uOpacity);
}

// ===== shader 28 — 028-05n0-i2ygd4eb.js =====

  varying vec2 vUv;
  uniform float uDistortion;
  uniform float uCardHalfH;
  uniform float uTiltX;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float t = pos.y / uCardHalfH;
    pos.z += uDistortion * (1.0 - t * t);
    float cosT = cos(uTiltX);
    float sinT = sin(uTiltX);
    float newY = pos.y * cosT - pos.z * sinT;
    float newZ = pos.y * sinT + pos.z * cosT;
    pos.y = newY;
    pos.z = newZ;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }


// ===== shader 29 — 028-05n0-i2ygd4eb.js =====

  uniform sampler2D uTexMain;
  uniform sampler2D uTexLogo;
  uniform float     uImgARMain;
  uniform float     uImgARLogo;
  uniform float     uCardAR;
  uniform float     uClip;
  uniform float     uTransition;
  uniform float     uTime;
  uniform vec3      uBorderColor;
  uniform float     uPixelGrid;
  uniform float     uNoiseScale;
  uniform float     uDispSpeed;
  uniform float     uNoiseSpeed;
  uniform float     uRadialScale;
  uniform float     uEdgeRamp;
  uniform float     uGlowInner;
  uniform float     uGlowOuter;
  uniform float     uGlowDark;
  uniform float     uGlowBright;
  uniform float     uGlowIntensity;
  uniform float     uPulseSpeed;
  uniform float     uOpacity;
  uniform float     uSaturation;
  uniform float     uBlur;
  uniform float     uHoverZoom;
  varying vec2 vUv;

  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
  float cnoise(vec3 P) {
    vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0); Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + Pi0.zzzz);
    vec4 ixy1 = permute(ixy + Pi1.zzzz);
    vec4 gx0 = ixy0/7.0; vec4 gy0 = fract(floor(gx0)/7.0)-0.5; gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5)-abs(gx0)-abs(gy0); vec4 sz0 = step(gz0,vec4(0.0));
    gx0 -= sz0*(step(0.0,gx0)-0.5); gy0 -= sz0*(step(0.0,gy0)-0.5);
    vec4 gx1 = ixy1/7.0; vec4 gy1 = fract(floor(gx1)/7.0)-0.5; gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5)-abs(gx1)-abs(gy1); vec4 sz1 = step(gz1,vec4(0.0));
    gx1 -= sz1*(step(0.0,gx1)-0.5); gy1 -= sz1*(step(0.0,gy1)-0.5);
    vec3 g000=vec3(gx0.x,gy0.x,gz0.x); vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010=vec3(gx0.z,gy0.z,gz0.z); vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001=vec3(gx1.x,gy1.x,gz1.x); vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011=vec3(gx1.z,gy1.z,gz1.z); vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g100,g100),dot(g010,g010),dot(g110,g110)));
    g000*=norm0.x; g100*=norm0.y; g010*=norm0.z; g110*=norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g101,g101),dot(g011,g011),dot(g111,g111)));
    g001*=norm1.x; g101*=norm1.y; g011*=norm1.z; g111*=norm1.w;
    float n000=dot(g000,Pf0); float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
    float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)); float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
    float n001=dot(g001,vec3(Pf0.xy,Pf1.z)); float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
    float n011=dot(g011,vec3(Pf0.x,Pf1.yz)); float n111=dot(g111,Pf1);
    vec3 fxyz = fade(Pf0);
    float nz  = mix(mix(n000,n100,fxyz.x),mix(n010,n110,fxyz.x),fxyz.y);
    float ndz = mix(mix(n001,n101,fxyz.x),mix(n011,n111,fxyz.x),fxyz.y);
    return 2.2 * mix(nz, ndz, fxyz.z);
  }

  vec2 coverUV(vec2 v, float imgAR, float cardAR) {
    if (imgAR > cardAR) {
      float scale = cardAR / imgAR;
      return vec2(v.x * scale + (1.0 - scale) * 0.5, v.y);
    } else {
      float scale = imgAR / cardAR;
      return vec2(v.x, v.y * scale + (1.0 - scale) * 0.5);
    }
  }

  vec4 blurSample(sampler2D tex, vec2 uv, float imgAR, float cardAR) {
    if (uBlur < 0.0005) return texture2D(tex, coverUV(uv, imgAR, cardAR));
    float s = uBlur;
    vec4 col = vec4(0.0);
    col += texture2D(tex, coverUV(uv + vec2(-s,-s), imgAR, cardAR));
    col += texture2D(tex, coverUV(uv + vec2( 0.,-s), imgAR, cardAR));
    col += texture2D(tex, coverUV(uv + vec2( s,-s), imgAR, cardAR));
    col += texture2D(tex, coverUV(uv + vec2(-s, 0.), imgAR, cardAR));
    col += texture2D(tex, coverUV(uv,               imgAR, cardAR));
    col += texture2D(tex, coverUV(uv + vec2( s, 0.), imgAR, cardAR));
    col += texture2D(tex, coverUV(uv + vec2(-s,  s), imgAR, cardAR));
    col += texture2D(tex, coverUV(uv + vec2( 0.,  s), imgAR, cardAR));
    col += texture2D(tex, coverUV(uv + vec2( s,  s), imgAR, cardAR));
    return col / 9.0;
  }

  void main() {
    if (vUv.y >= uClip) discard;

    vec2 grid = vec2(uPixelGrid, uPixelGrid / uCardAR);
    vec2 snapped = floor(vUv * grid) / grid;
    float useGrid = step(0.001, uTransition);
    vec2 pixUv = mix(vUv, snapped, useGrid);
    vec2 cUv = (pixUv - 0.5) * vec2(uCardAR, 1.0) + 0.5;
    float maxDist = length(vec2(uCardAR, 1.0)) * 0.5;

    vec2 dispUv = cUv + cnoise(vec3(cUv * uNoiseScale, uTime * uDispSpeed));
    float n = cnoise(vec3(dispUv * uNoiseScale, uTime * uNoiseSpeed));

    float d = length(cUv - 0.5) / maxDist;
    float radial = d * uRadialScale + (1.0 - uTransition) * 2.0 - 15.0 * uTransition;
    float raw = n + radial;
    float mask = clamp(raw, 0.0, 1.0);

    float edge = smoothstep(0.0, uGlowInner, raw) * smoothstep(uGlowOuter, uGlowInner, raw);
    edge *= min(uTransition * uEdgeRamp, 1.0);
    vec3 deepTone = uBorderColor * uGlowDark;
    vec3 glowTone = uBorderColor * uGlowBright;
    vec3 edgeColor = glowTone;

    vec2 zoomUv = (vUv - 0.5) / uHoverZoom + 0.5;
    vec4 logoCol = blurSample(uTexLogo, zoomUv, uImgARLogo, uCardAR);
    vec4 mainCol = blurSample(uTexMain, zoomUv, uImgARMain, uCardAR);

    vec3 blended = mix(mainCol.rgb, logoCol.rgb, mask);
    vec3 final   = mix(blended, edgeColor * uGlowIntensity, edge);

    float luma = dot(final, vec3(0.299, 0.587, 0.114));
    final = mix(vec3(luma), final, uSaturation);

    gl_FragColor = vec4(final, uOpacity);
  }


// ===== shader 30 — 028-05n0-i2ygd4eb.js =====

  varying vec2 vUv;
  uniform float uDistortion;
  uniform float uCardHalfH;
  uniform float uTiltX;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float t = pos.y / uCardHalfH;
    pos.z += uDistortion * (1.0 - t * t);
    float cosT = cos(uTiltX);
    float sinT = sin(uTiltX);
    float newY = pos.y * cosT - pos.z * sinT;
    float newZ = pos.y * sinT + pos.z * cosT;
    pos.y = newY; pos.z = newZ;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }


// ===== shader 31 — 028-05n0-i2ygd4eb.js =====

  uniform sampler2D uTexMain;
  uniform sampler2D uTexLogo;
  uniform float uImgARMain;
  uniform float uImgARLogo;
  uniform float uCardAR;
  uniform float uClip;
  uniform float uTransition;
  uniform float uTime;
  uniform vec3  uBorderColor;
  uniform float uPixelGrid;
  uniform float uNoiseScale;
  uniform float uDispSpeed;
  uniform float uNoiseSpeed;
  uniform float uRadialScale;
  uniform float uEdgeRamp;
  uniform float uGlowInner;
  uniform float uGlowOuter;
  uniform float uGlowDark;
  uniform float uGlowBright;
  uniform float uGlowIntensity;
  uniform float uPulseSpeed;
  uniform float uOpacity;
  uniform float uSaturation;
  uniform float uBlur;
  uniform float uHoverZoom;
  varying vec2 vUv;

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  vec3 fade(vec3 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}
  float cnoise(vec3 P){
    vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.0);
    Pi0=mod(Pi0,289.0);Pi1=mod(Pi1,289.0);
    vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.0);
    vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
    vec4 iy=vec4(Pi0.yy,Pi1.yy);
    vec4 ixy=permute(permute(ix)+iy);
    vec4 ixy0=permute(ixy+Pi0.zzzz);
    vec4 ixy1=permute(ixy+Pi1.zzzz);
    vec4 gx0=ixy0/7.0;vec4 gy0=fract(floor(gx0)/7.0)-0.5;gx0=fract(gx0);
    vec4 gz0=vec4(0.5)-abs(gx0)-abs(gy0);vec4 sz0=step(gz0,vec4(0.0));
    gx0-=sz0*(step(0.0,gx0)-0.5);gy0-=sz0*(step(0.0,gy0)-0.5);
    vec4 gx1=ixy1/7.0;vec4 gy1=fract(floor(gx1)/7.0)-0.5;gx1=fract(gx1);
    vec4 gz1=vec4(0.5)-abs(gx1)-abs(gy1);vec4 sz1=step(gz1,vec4(0.0));
    gx1-=sz1*(step(0.0,gx1)-0.5);gy1-=sz1*(step(0.0,gy1)-0.5);
    vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
    vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g100,g100),dot(g010,g010),dot(g110,g110)));
    g000*=norm0.x;g100*=norm0.y;g010*=norm0.z;g110*=norm0.w;
    vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g101,g101),dot(g011,g011),dot(g111,g111)));
    g001*=norm1.x;g101*=norm1.y;g011*=norm1.z;g111*=norm1.w;
    float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
    float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
    float n001=dot(g001,vec3(Pf0.xy,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
    float n011=dot(g011,vec3(Pf0.x,Pf1.yz));float n111=dot(g111,Pf1);
    vec3 fxyz=fade(Pf0);
    float nz=mix(mix(n000,n100,fxyz.x),mix(n010,n110,fxyz.x),fxyz.y);
    float ndz=mix(mix(n001,n101,fxyz.x),mix(n011,n111,fxyz.x),fxyz.y);
    return 2.2*mix(nz,ndz,fxyz.z);
  }

  vec2 coverUV(vec2 v,float imgAR,float cardAR){
    if(imgAR>cardAR){float s=cardAR/imgAR;return vec2(v.x*s+(1.0-s)*0.5,v.y);}
    else{float s=imgAR/cardAR;return vec2(v.x,v.y*s+(1.0-s)*0.5);}
  }

  vec4 blurSample(sampler2D tex,vec2 uv,float imgAR,float cardAR){
    if(uBlur<0.0005)return texture2D(tex,coverUV(uv,imgAR,cardAR));
    float s=uBlur;vec4 col=vec4(0.0);
    col+=texture2D(tex,coverUV(uv+vec2(-s,-s),imgAR,cardAR));
    col+=texture2D(tex,coverUV(uv+vec2(0.,-s),imgAR,cardAR));
    col+=texture2D(tex,coverUV(uv+vec2(s,-s),imgAR,cardAR));
    col+=texture2D(tex,coverUV(uv+vec2(-s,0.),imgAR,cardAR));
    col+=texture2D(tex,coverUV(uv,imgAR,cardAR));
    col+=texture2D(tex,coverUV(uv+vec2(s,0.),imgAR,cardAR));
    col+=texture2D(tex,coverUV(uv+vec2(-s,s),imgAR,cardAR));
    col+=texture2D(tex,coverUV(uv+vec2(0.,s),imgAR,cardAR));
    col+=texture2D(tex,coverUV(uv+vec2(s,s),imgAR,cardAR));
    return col/9.0;
  }

  void main(){
    if(vUv.y>=uClip)discard;
    vec2 grid=vec2(uPixelGrid,uPixelGrid/uCardAR);
    vec2 snapped=floor(vUv*grid)/grid;
    float useGrid=step(0.001,uTransition);
    vec2 pixUv=mix(vUv,snapped,useGrid);
    vec2 cUv=(pixUv-0.5)*vec2(uCardAR,1.0)+0.5;
    float maxDist=length(vec2(uCardAR,1.0))*0.5;
    vec2 dispUv=cUv+cnoise(vec3(cUv*uNoiseScale,uTime*uDispSpeed));
    float n=cnoise(vec3(dispUv*uNoiseScale,uTime*uNoiseSpeed));
    float d=length(cUv-0.5)/maxDist;
    float radial=d*uRadialScale+(1.0-uTransition)*2.0-15.0*uTransition;
    float raw=n+radial;
    float mask=clamp(raw,0.0,1.0);
    float edge=smoothstep(0.0,uGlowInner,raw)*smoothstep(uGlowOuter,uGlowInner,raw);
    edge*=min(uTransition*uEdgeRamp,1.0);
    vec3 glowTone=uBorderColor*uGlowBright;
    vec3 edgeColor=glowTone;
    vec2 zoomUv=(vUv-0.5)/uHoverZoom+0.5;
    vec4 logoCol=blurSample(uTexLogo,zoomUv,uImgARLogo,uCardAR);
    vec4 mainCol=blurSample(uTexMain,zoomUv,uImgARMain,uCardAR);
    vec3 blended=mix(mainCol.rgb,logoCol.rgb,mask);
    vec3 final=mix(blended,edgeColor*uGlowIntensity,edge);
    float luma=dot(final,vec3(0.299,0.587,0.114));
    final=mix(vec3(luma),final,uSaturation);
    gl_FragColor=vec4(final,uOpacity);
  }
