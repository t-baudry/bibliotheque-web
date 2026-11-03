// ===== shader 1 — 021-DgnJ8M3p.js =====
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// ===== shader 2 — 021-DgnJ8M3p.js =====
uniform sampler2D tDiffuse;
uniform bool uGray;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(tDiffuse, vUv);

    if (uGray) {
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        color = vec4(vec3(gray), color.a);
    }
    
    gl_FragColor = vec4(color.rgb, 1.0);
}

// ===== shader 3 — 021-DgnJ8M3p.js =====
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vPosition = mvPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
}

// ===== shader 4 — 021-DgnJ8M3p.js =====
uniform vec3 uRemapColor;
uniform vec3 uLightDir;
uniform float uFlatShading; 
uniform float uBrightness;
uniform float uNormalStrength;
uniform float uReveal;  // 0.0 = hidden, 1.0 = fully visible

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 flatNormal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
    vec3 normal = normalize(mix(vNormal, flatNormal, uFlatShading));

    vec3 lightDir = normalize(uLightDir);
    float diff = max(dot(normal, lightDir), 0.0); 

    vec3 color = (diff * uBrightness) + normal * uNormalStrength + 0.5;
    color = clamp(color, 0.15, 0.995);
    color *= uRemapColor;

    // --- Normal-based reveal ---
    float edge = 0.05;
    float revealMask = dot(normal, vec3(0.0, 1.0, 0.0)); // Y-facing normals reveal first
    revealMask = revealMask * 0.5 + 0.5; // remap to 0..1

    float visible = step(uReveal, revealMask);
    float edgeBand = smoothstep(uReveal - edge, uReveal, revealMask)
                   - smoothstep(uReveal, uReveal + edge, revealMask);

    vec3 edgeColor = vec3(.5, 0.8, 0.2);
    color = mix(color, edgeColor, edgeBand);

    gl_FragColor = vec4(color, visible);
}

// ===== shader 5 — 021-DgnJ8M3p.js =====
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}


// ===== shader 6 — 021-DgnJ8M3p.js =====
precision highp float;

uniform sampler2D tDiffuse;
uniform sampler2D tMouseTrail;
uniform sampler2D uCharactersTexture;

uniform vec2 uResolution;
uniform vec2 uOffset;

uniform float uAspect;
uniform float uGranularity;
uniform float uCharactersLimit;
uniform float uOutProgress;
uniform float uOpacity;
uniform float uSmear;
uniform float uBrightness;
uniform float uScale;
uniform bool uNoise;
uniform bool uMedia;

uniform bool uFillPixels;
uniform bool uOverwriteColor;
uniform bool uGreyscale;
uniform bool uInvert;
uniform bool uMatrix;

uniform vec3 uColor;
uniform vec3 uAccentColor;
uniform vec3 uBackground;

uniform float uTime;

varying vec2 vUv;

vec3 blendNormal(vec3 base, vec3 blend) {
    return blend;
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
    return blend * opacity + base * (1.0 - opacity);
}

float grayscale(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
}

float random(float x) {
    return fract(sin(x) * 123456.789);
}

float noise2D(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
}

float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

void main() {
    vec2 screenUV = vUv;

    // -------------------------
    // PIXELATION GRID (STABLE)
    // -------------------------
    vec2 division = uResolution / uGranularity;
    vec2 d = 1.0 / division;
    vec2 pixelizedUV = d * (floor(screenUV / d) + 0.5);

    vec4 mouseTrail = texture2D(tMouseTrail, screenUV);

    // -------------------------
    // MATRIX COLUMN MOTION
    // -------------------------
    if (uMatrix) {
        float noise = random(pixelizedUV.x);
        pixelizedUV.y += uTime * abs(noise);
        pixelizedUV.y = fract(pixelizedUV.y);
    }

    // -------------------------
    // EXIT LIFT
    // -------------------------
    float columnNoise = random(floor(pixelizedUV.x * division.x));
    float exitLift = uOutProgress * (1.2 + columnNoise);

    // -------------------------
    // SMEAR
    // -------------------------
    float waterfallAlpha = 1.0;

    if (uSmear > 0.0) {

        float rowHeight = d.y;
        float py = clamp(pixelizedUV.y, 0.0, 1.0);

        float rowIndex  = floor(py / rowHeight);
        float totalRows = division.y;

        float rowNoise      = hash(rowIndex * 17.0);
        float edgeNoise     = hash(rowIndex * 21.0);
        float stretchNoise  = hash(rowIndex * 9.0 + 0.3);

        float smearRows = uSmear * totalRows;

        float noiseAmount = 0.35 * uSmear;
        float noisySmearRows = smearRows + (rowNoise - 0.5) * noiseAmount * totalRows;

        float blendRows = max(1.0, smearRows * 0.835);
        float dist = noisySmearRows - rowIndex;
        float smearMask = clamp(dist / blendRows, 0.0, 1.0);

        smearMask = pow(smearMask, mix(1.5, 3.0, edgeNoise));

        float lastRowY = rowHeight * 0.5;

        float flowNoise = hash(rowIndex * 31.0 + pixelizedUV.x * 13.0);
        py -= flowNoise * rowHeight * smearMask * 0.6;

        py = mix(py, lastRowY, smearMask);

        float depth = 1.0 - (rowIndex / totalRows);

        float stretch = 0.1;
        stretch *= uSmear;
        stretch *= stretch;
        stretch *= mix(0.6, 1.4, stretchNoise);

        float cx = 0.5;
        pixelizedUV.x = cx + (pixelizedUV.x - cx) * (1.0 + stretch * smearMask);

        pixelizedUV.y = py;

        waterfallAlpha = mix(
            1.0,
            0.05,
            depth * smearMask * uSmear
        );
    }

    // -------------------------
    // APPLY EXIT
    // -------------------------
    pixelizedUV.y -= exitLift;

    if (pixelizedUV.y < 0.0) {
        gl_FragColor = vec4(0.0);
        return;
    }

    // -------------------------
    // APPLY MEDIA MAPPING
    // -------------------------
    vec2 finalUV = pixelizedUV;

    if (uMedia) {
        vec2 centered = finalUV - 0.5;
        float ratio = (uResolution.x / uResolution.y) / uAspect;

        if (ratio > 1.0) {
            centered.y /= ratio;
        } else {
            centered.x *= ratio;
        }

        centered /= uScale;  
        finalUV = centered + 0.5 + uOffset;
    }

    vec4 pixelizedColor = texture2D(tDiffuse, finalUV);
    float grayColor = grayscale(pixelizedColor.rgb);

    if (uInvert) {
        grayColor = 1.0 - grayColor;
    }

    // -------------------------
    // EDGE DETECTION on tDiffuse
    // -------------------------
    vec2 texel = 1.0 / uResolution;

    float left  = grayscale(texture2D(tDiffuse, finalUV + vec2(-texel.x, 0.0)).rgb);
    float right = grayscale(texture2D(tDiffuse, finalUV + vec2( texel.x, 0.0)).rgb);
    float up    = grayscale(texture2D(tDiffuse, finalUV + vec2(0.0,  texel.y)).rgb);
    float down  = grayscale(texture2D(tDiffuse, finalUV + vec2(0.0, -texel.y)).rgb);

    float edgeX = right - left;
    float edgeY = up - down;
    float edgeMask = length(vec2(edgeX, edgeY));

    // Tune these thresholds to control edge thickness/sensitivity
    edgeMask = smoothstep(0.01, 0.25, edgeMask);

    // -------------------------
    // ASCII CHAR SELECTION
    // -------------------------
    vec2 size = vec2(16.0);

    float baseCharIndex = floor(grayColor * (uCharactersLimit - 1.0));
    float trailCharIndex = floor(mouseTrail.r * (uCharactersLimit - 1.0));

    // Gate trail character influence by edgeMask — no black holes in flat areas
    float trailInfluence = step(0.1, mouseTrail.r) * edgeMask;
    float charIndex = mix(baseCharIndex, trailCharIndex, trailInfluence);

    float charX = mod(charIndex, size.x);
    float charY = floor(charIndex / size.y);

    vec2 charUV = mod(screenUV * (division / size), 1.0 / size);
    charUV -= vec2(0.0, 1.0 / size);
    charUV += vec2(charX, -charY) / size;

    vec4 ascii = texture2D(uCharactersTexture, charUV);

    // -------------------------
    // NOISE
    // -------------------------
    float asciiNoise = 1.0;

    if (uNoise) {
        float n = noise2D(pixelizedUV * 120.0 + uTime * 0.0001);
        asciiNoise = smoothstep(0.5, 0.9, n);
        asciiNoise = mix(0.6, 1.4, asciiNoise);
    }

    ascii.r *= asciiNoise;

    vec4 color = ascii;

    if (uFillPixels) {
        if (uOverwriteColor) {
            color.rgb = uColor * ceil(pixelizedColor.rgb);

            if (uGreyscale) {
                color.rgb *= grayscale(pixelizedColor.rgb);
            }
        } else if (uGreyscale) {
            color.rgb = vec3(grayscale(pixelizedColor.rgb));
        } else {
            color.rgb = pixelizedColor.rgb;
        }

        color.rgb += ascii.r;
        color.a = pixelizedColor.a;

    } else if (uOverwriteColor) {
        color.rgb = uColor * ascii.r;
        color.a = pixelizedColor.a;

        if (uGreyscale) {
            color.rgb *= grayscale(pixelizedColor.rgb);
        }

    } else if (uGreyscale) {
        color.rgb = vec3(grayscale(pixelizedColor.rgb)) * ascii.r;

    } else {
        color = pixelizedColor * ascii.r;
    }

    if (color.rgb == vec3(0.0)) {
        color.a = 0.0;
    }

    float alpha = (uBackground == vec3(0.0)) ? color.a : 1.0;
    alpha *= waterfallAlpha;
    alpha *= uOpacity;

    vec3 finalColor = blendNormal(uBackground, color.rgb, color.a);

    // -------------------------
    // ACCENT COLOR — edges only
    // -------------------------
    float trailMask = mouseTrail.r * ascii.r * edgeMask;
    finalColor = mix(finalColor, uAccentColor, trailMask);

    finalColor += vec3(uBrightness);

    gl_FragColor = vec4(finalColor, alpha);
    // gl_FragColor = mouseTrail;
}

// ===== shader 7 — 021-DgnJ8M3p.js =====
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// ===== shader 8 — 021-DgnJ8M3p.js =====
#define TRAIL_LENGTH 40
#define PIXEL_SIZE 80.0

uniform vec2 uTrail[TRAIL_LENGTH];
uniform float uTrailStrength[TRAIL_LENGTH];
uniform float uTime;
uniform float uVelocity;
uniform vec2 uResolution;

varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 pixelate(vec2 uv, float pixels) {
    return floor(uv * pixels) / pixels;
}

float circle(vec2 uv, vec2 center, float radius) {
    return 1.0 - smoothstep(radius - 0.02, radius + 0.02, length(uv - center));
}

void main() {
    vec2 uv = pixelate(vUv, PIXEL_SIZE);

    vec3 color = vec3(0.0);
    float trail = 0.0;

    for (int i = 0; i < TRAIL_LENGTH; i++) {
        float size = uVelocity * 0.025 * (1.0 - float(i) / float(TRAIL_LENGTH));
        float strength = uTrailStrength[i] * (1.0 - float(i) / float(TRAIL_LENGTH));
        trail += circle(uv, uTrail[i], size) * strength;
    }

    trail = clamp(trail, 0.0, 1.0);
    color = mix(vec3(0.0), vec3(1.0, 1.0, 1.0), trail);

    gl_FragColor = vec4(color, trail * uVelocity);
}

// ===== shader 9 — 022-DS4A_qdJ.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 10 — 022-DS4A_qdJ.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 11 — 022-DS4A_qdJ.js =====
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
		

// ===== shader 12 — 022-DS4A_qdJ.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 13 — 022-DS4A_qdJ.js =====


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
	

// ===== shader 14 — 022-DS4A_qdJ.js =====

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