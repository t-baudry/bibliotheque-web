// ===== shader 1 — 006-56e648bf7ded97bc.js =====

  varying vec2 vUv;
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFoldProgress;
  uniform vec2 uFoldOrigin;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uPointerAmplitude;
  uniform vec2 uHalftoneSize;
  uniform float uHalftoneDotSize;
  uniform float uHalftoneStrength;
  uniform float uMorphProgress;
  uniform float uDistortionStrength;
  uniform float uPointerActive;
  

    vec2 rotate2D(vec2 position, float angle) {
        mat2 rotationMatrix = mat2(cos(angle), -sin(angle),
                                sin(angle),  cos(angle));
        return rotationMatrix * position;
    }

mat4 rotation3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(
    oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
    0.0,                                0.0,                                0.0,                                1.0
  );
}
  void main() {
    vUv = uv;
    vec3 newPosition = position;
    
    // Paper fold effect starting from the bottom-left corner
    // The fold propagates diagonally across the paper
    
    // Distance from fold origin (in UV space)
    float cornerDist = length(uv - uFoldOrigin);
    
    // Anchor the corner - reduce effect near the origin corner
    float cornerAnchor = smoothstep(0.0, 0.35, cornerDist);
    
    // Create a traveling fold line that moves across the cloth
    float foldLine = uFoldProgress * 2.2; // The fold line position (0 to ~2.2 for full diagonal with overshoot)
    
    // Distance from the current fold line
    float distFromFold = cornerDist - foldLine;
    
    // Create a wider, softer cloth-like fold effect with actual geometric folding
    // Cloth lifts before the fold line and settles after with multiple waves
    float foldWidth = 0.85;
    
    // Softer, more gradual fold region for cloth-like feel
    float inFoldRegion = smoothstep(-foldWidth, 0.0, distFromFold) * (1.0 - smoothstep(0.0, foldWidth * 0.7, distFromFold));
    
    // Calculate fold angle - cloth bends along the crease
    // Areas before the fold line rotate upward, creating actual folding
    float foldAngle = 0.0;
    float creaseIntensity = 0.0;
    
    if (distFromFold < 0.0) {
      // Before the fold line - this part should fold over
      float foldProgress = smoothstep(-foldWidth * 1.2, 0.0, distFromFold);
      foldAngle = foldProgress * uFoldProgress * 0.7; // Reduced fold angle
      creaseIntensity = inFoldRegion * cornerAnchor;
    } else {
      // After the fold line - settled area
      creaseIntensity = inFoldRegion * cornerAnchor;
    }
    
    // Primary fold - softer, more flowing crease (anchored at corner)
    // Use a smoother curve for cloth-like behavior
    float crease = creaseIntensity * uAmplitude * 0.7 * (1.0 + sin(distFromFold * 4.0 + uTime * 2.0) * 0.1);
    
    // Apply actual geometric folding - rotate vertices around the fold line
    // Calculate direction from fold origin to current point
    vec2 dirFromOrigin = normalize(uv - uFoldOrigin);
    vec2 perpendicularDir = vec2(-dirFromOrigin.y, dirFromOrigin.x); // Perpendicular to fold direction
    
    // Rotate position around the fold line - reduced intensity
    float foldRotation = foldAngle * uAmplitude * 0.5;
    mat2 rotationMatrix = mat2(cos(foldRotation), -sin(foldRotation), sin(foldRotation), cos(foldRotation));
    
    // Only apply rotation to areas before the fold line
    float rotationMask = smoothstep(0.0, -foldWidth * 1.5, distFromFold);
    vec2 rotatedPos = mix(position.xy, (rotationMatrix * (position.xy - vec2(0.5)) + vec2(0.5)), rotationMask * cornerAnchor);
    
    // Blend between original and rotated position - reduced blend
    newPosition.xy = mix(position.xy, rotatedPos, uFoldProgress * 0.35);
    
    // Add subtle ripples behind the main fold (like cloth settling and draping)
    // First ripple - close to fold, reduced intensity
    float ripple1 = smoothstep(-foldWidth * 2.5, -foldWidth * 0.9, distFromFold) * 
                    (1.0 - smoothstep(-foldWidth * 0.9, 0.0, distFromFold));
    float settlingWave1 = ripple1 * uAmplitude * 0.18 * sin(distFromFold * 7.5 + uTime * 2.0) * cornerAnchor;
    
    // Second ripple - medium distance, flowing
    float ripple2 = smoothstep(-foldWidth * 4.0, -foldWidth * 2.2, distFromFold) * 
                    (1.0 - smoothstep(-foldWidth * 2.2, -foldWidth * 1.3, distFromFold));
    float settlingWave2 = ripple2 * uAmplitude * 0.12 * sin(distFromFold * 6.0 + uTime * 1.5 + 1.2) * cornerAnchor;
    
    // Third ripple - further back, subtle
    float ripple3 = smoothstep(-foldWidth * 6.0, -foldWidth * 3.5, distFromFold) * 
                    (1.0 - smoothstep(-foldWidth * 3.5, -foldWidth * 2.5, distFromFold));
    float settlingWave3 = ripple3 * uAmplitude * 0.08 * sin(distFromFold * 4.5 + uTime * 1.1 + 2.3) * cornerAnchor;
    
    // Combine settling waves
    float settlingWave = settlingWave1 + settlingWave2 + settlingWave3;
    
    // Paper ripple distortion effect (from intro background)
    float pointerDist = length(uv - uPointer);
    float rippleRadius = 0.35;
    float rippleFalloff = smoothstep(rippleRadius, 0.0, pointerDist);
    float ripple = pow(rippleFalloff, 2.0);
    
    // Gentle wave distortion - very slow animation when stationary
    float wave = sin(pointerDist * 12.0 - uTime * 0.3) * 0.5 + 0.5;
    float distortion = ripple * wave * uDistortionStrength * uPointerActive;
    float pointerDistortion = distortion * 0.08;
    
    // Combine effects with cloth-like pointer interaction
    // Reduced intensity for subtler response
    float pointerFalloff = smoothstep(0.6, 0.0, pointerDist);
    float pointerBend = pow(pointerFalloff, 1.8);
    float pointerRipple = pointerBend * uPointerStrength * uPointerAmplitude * 0.7;
    
    // Add subtle secondary pointer waves
    float pointerWave1 = pointerBend * uPointerStrength * uPointerAmplitude * 0.2 * 
                        sin(pointerDist * 12.0 + uTime * 3.0);
    pointerRipple = pointerRipple + pointerWave1;
    
    // Add subtle cloth-like undulation across the entire surface
    // Reduced intensity for less distortion
    float wave1 = sin(uv.x * 3.14159 * 3.2 + uTime * 1.1) * 
                  sin(uv.y * 3.14159 * 2.8 + uTime * 0.9) * 
                  uAmplitude * 0.06 * (1.0 - uFoldProgress * 0.5);
    
    float wave2 = sin((uv.x + uv.y) * 3.14159 * 2.0 + uTime * 0.7) * 
                  sin((uv.x - uv.y) * 3.14159 * 1.8 + uTime * 0.5) * 
                  uAmplitude * 0.04 * (1.0 - uFoldProgress * 0.4);
    
    float globalUndulation = wave1 + wave2;
    
    // Add subtle gravity-like draping effect
    float gravityDrape = sin(uv.y * 3.14159 * 1.5) * uAmplitude * 0.03 * (1.0 - uFoldProgress * 0.7);

    float halftoneAngle = 0.35;
    mat2 halftoneRotation = mat2(cos(halftoneAngle), -sin(halftoneAngle), sin(halftoneAngle), cos(halftoneAngle));
    vec2 halftoneCenter = (uv - 0.5) * uHalftoneSize;
    vec2 halftoneUv = (halftoneRotation * halftoneCenter + 0.5 * uHalftoneSize) / uHalftoneDotSize;
    vec2 halftoneCell = fract(halftoneUv) - 0.5;
    float halftoneDist = length(halftoneCell);
    float halftoneDot = smoothstep(0.48, 0.2, halftoneDist);
    float halftoneDisplacement = uMorphProgress * uHalftoneStrength * (halftoneDot - 0.5) * 0.08;

    if(true){
      newPosition.z =  pointerRipple + pointerDistortion + halftoneDisplacement + gravityDrape;
    }

    // newPosition = (rotation3d(vec3(0. , 0., 1.),  uAngle * 3.14 * 1.) * vec4(pos, 1.)).xyz;
    // newPosition = (rotation3d(vec3(0.05 , 0.1, 0.),  3.14 * flipProgress * 2. ) * vec4(newPosition, 1.)).xyz;


    vec2 m = uPointer * 2.0 - 1.0; // mouse uv -1 - 1
    vec2 vPos = uv * 2.0 - 1.0;  // vertex uv -1 - 1
    float angle = atan(-m.y, -m.x);
    vec2 uv2 = uv;
    uv2 -= 0.5;
    uv2 = rotate2D(uv2, angle) ;
    uv2 += .5;


    float len = length(m);
    float flipProgress = smoothstep(0.0 + uv2.x * 0.2, 0.8 + uv2.x * 0.2, .1 * len);
     // newPosition = (rotation3d(vec3(m.x, m.y, 1.),3.14 * flipProgress * 1.0) * vec4(newPosition, 1.0)).xyz;


    float flipProgress2 = smoothstep(0. + uv.x * 0.3, 0.8 + uv.x * 0.2, uFoldProgress  );
    newPosition = (rotation3d(vec3(0.5 * (1.- flipProgress2 ) , 1., 0.),  3.14 * flipProgress2 * 1. ) * vec4(newPosition, 1.)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }


// ===== shader 2 — 006-56e648bf7ded97bc.js =====

  uniform sampler2D uTexture;
  uniform vec2 vUvScale;
  uniform float uOpacity;
  uniform vec2 uPointer;
  uniform vec2 uHalftoneSize;
  uniform float uHalftoneDotSize;
  uniform float uHalftoneStrength;
  uniform vec3 uHalftoneColor;
  uniform float uMorphProgress;
  uniform float uTime;
  varying vec2 vUv;
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

 float regularLine(vec2 uv, float fadeBottom, float fadeTop){

        float center = 0.0 + uv.x;

        return  smoothstep(center - fadeBottom, center, uv.y )
                - smoothstep(center, center + fadeTop, uv.y );
    }

    float easeOutQuart(float x) {
    return 1.0 - pow(1.0 - x, 4.0);
}
  void main() {

    vec2 uv2 = vUv;
    if (!gl_FrontFacing) {
      uv2.x = 1.0 - uv2.x; // horizontal flip on backface
    }
    vec2 uv = (uv2 - 0.5) * vUvScale + 0.5;
    vec4 color = texture2D(uTexture, uv);
    float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
    float halftoneAngle = 0.35;
    mat2 halftoneRotation = mat2(cos(halftoneAngle), -sin(halftoneAngle), sin(halftoneAngle), cos(halftoneAngle));
    vec2 halftoneCenter = (uv - 0.5) * uHalftoneSize;
    vec2 halftoneUv = (halftoneRotation * halftoneCenter + 0.5 * uHalftoneSize) / uHalftoneDotSize;
    vec2 cell = fract(halftoneUv) - 0.5;
    float dist = length(cell);
    float dotRadius = mix(0.26, 0.68, 1.0 - luma);
    float dotMask = smoothstep(dotRadius, dotRadius - 0.02, dist);
    
    // Radial reveal effect - halftone expands outward from pointer
    float pointerDist = distance(uv, uPointer);
    
    // Calculate reveal radius with easing for smoother expansion
    // Max radius covers most of the screen (diagonal is ~1.414)
    float maxRevealRadius = 1.2;
    
    // Apply easing to halftone strength for smoother reveal
    // Ease-out for smooth start, ease-in for smooth end
    float revealRadiusEased = uHalftoneStrength < 0.5 
      ? 2.0 * uHalftoneStrength * uHalftoneStrength  // Ease-out (smooth start)
      : 1.0 - 2.0 * (1.0 - uHalftoneStrength) * (1.0 - uHalftoneStrength); // Ease-in (smooth end)
    
    float revealRadius = revealRadiusEased * maxRevealRadius;
    
    // Increased feathering for smoother, softer edge
    float revealFeather = 0.4;
    float revealMask = 1.0 - smoothstep(revealRadius - revealFeather, revealRadius, pointerDist);
    
    // Add subtle noise to the reveal edge for organic feel
    float edgeNoise = (hash((uv - uPointer) * 60.0) - 0.5) * 0.04;
    float revealDistWithNoise = pointerDist + edgeNoise;
    float revealMaskNoisy = 1.0 - smoothstep(revealRadius - revealFeather, revealRadius, revealDistWithNoise);
    
    // Combine smooth and noisy masks for natural reveal
    float revealMaskFinal = mix(revealMask, revealMaskNoisy, 0.25);
    
    // Smooth halftone blend transition with easing
    float halftoneStrengthEased = smoothstep(0.0, 1.0, uHalftoneStrength);
    float halftoneBlend = clamp(halftoneStrengthEased * (1.0 - uMorphProgress) * 1.2, 0.0, 1.0);
    
    // Apply reveal mask to halftone blend - halftone only appears within reveal area
    halftoneBlend *= revealMaskFinal;
    
    vec3 paperColor = mix(color.rgb, uHalftoneColor, 0.85);
    vec3 halftoneDots = mix(paperColor, color.rgb, dotMask);
    vec3 halftoneBase = mix(color.rgb, halftoneDots, halftoneBlend);
    halftoneBase = mix(halftoneBase, color.rgb, uMorphProgress);
    halftoneBase = color.rgb;
    
    // Original reveal window for the image reveal effect
    float imageRevealRadius = 0.28;
    float imageRevealFeather = 0.22;
    float imageRevealEdgeNoise = (hash((uv - uPointer) * 120.0) - 0.5) * 0.07;
    float imageRevealDist = distance(uv, uPointer) + imageRevealEdgeNoise;
    float imageRevealRadiusJitter = imageRevealRadius + (hash(uv * 45.0) - 0.5) * 0.04;
    float revealWindow = 1.0 - smoothstep(imageRevealRadiusJitter, imageRevealRadiusJitter + imageRevealFeather, imageRevealDist);
    revealWindow = pow(revealWindow, 0.8);
    vec3 finalColor = mix(color.rgb, halftoneBase, revealWindow);

        vec2 uv1 = vUv - .5;

  
        float numPulses = 3.0;

        float result = 0.0;

        float fadeBottom = 0.05;
        float fadeTop = .5;

        float uProgress = mod(uTime * 0.2, 2.);
        for (int i = 0; i < 1; i++) {
            float offset = float(i) / numPulses ; 

            float t = uProgress + offset; // 0 to 1 looping, each offset


            
            float mapped = t * (2.0 + fadeTop + fadeBottom) - 1. - fadeBottom;

            vec2 uv3 = uv1;

            uv3.y += mapped;


            result = max(result, regularLine(uv3, fadeBottom, fadeTop));
        }

        float pct = result * 0.01 * 1.;

    if(true){
        finalColor = (1.0 - pct) * finalColor + pct * vec3(1., 1., 1.);
    }

    gl_FragColor = vec4(finalColor, color.a );
  }


// ===== shader 3 — 011-fd447676122150f3.js =====

  varying vec2 vUv;
  uniform float uTime;
  uniform float uFoldProgress;
  varying float progress;
  uniform float uDirection;

  mat4 rotation3d(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(
      oc * axis.x * axis.x + c,
      oc * axis.x * axis.y - axis.z * s,
      oc * axis.z * axis.x + axis.y * s,
      0.0,

      oc * axis.x * axis.y + axis.z * s,
      oc * axis.y * axis.y + c,
      oc * axis.y * axis.z - axis.x * s,
      0.0,

      oc * axis.z * axis.x - axis.y * s,
      oc * axis.y * axis.z + axis.x * s,
      oc * axis.z * axis.z + c,
      0.0,

      0.0, 0.0, 0.0, 1.0
    );
  }

  void main() {
    vUv = uv;


    vec2 uv2 = uv;
    if(uDirection == -1.){
      uv2.x = 1.- uv2.x;
    }
    vec3 newPosition = position;

    float flipProgress = smoothstep(
      0.0 + uv2.x * 0.3,
      0.8 + uv2.x * 0.2,
      uFoldProgress
    );

    newPosition.x = -newPosition.x;
    newPosition = (
      rotation3d(
        vec3(0.5 * (1.- flipProgress ) , 1., 0.),
        3.14159265 * flipProgress 
      ) * vec4(newPosition, 1.0)
    ).xyz;


    // newPosition.z += sin(uv.x * 3.14159265 + uTime * 2.0) * 0.05;

    progress = flipProgress;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }


// ===== shader 4 — 011-fd447676122150f3.js =====

  varying vec2 vUv;

  uniform sampler2D uTexture;
  uniform vec2 uPlaneSize;
  uniform vec2 uImageSize;
varying float progress;
  uniform float uOpacity;

  vec2 coverUv(vec2 uv, vec2 plane, vec2 image) {
    float planeRatio = plane.x / plane.y;
    float imageRatio = image.x / image.y;

    vec2 scale = vec2(1.0);

    if (planeRatio > imageRatio) {
      scale.y = imageRatio / planeRatio;
    } else {
      scale.x = planeRatio / imageRatio;
    }

    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv, uPlaneSize, uImageSize);
    vec4 color = texture2D(uTexture, vUv);
    float alpha = progress * uOpacity;

    if(alpha == 0.){
      discard;
    }
    
    
    gl_FragColor = vec4(color.rgb, alpha);
  }


// ===== shader 5 — 011-fd447676122150f3.js =====

varying vec2 vUv;
uniform float uBend;
uniform float uFlip;
uniform float uFlipBend;
uniform float uAngle;
varying vec3 test;

float quarticOut(float t) {
  return pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
}

float quadraticOut(float t) {
  return -t * (t - 2.0);
}

mat4 rotation3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(
    oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
    0.0,                                0.0,                                0.0,                                1.0
  );
}

void main() {
  vUv = uv;
  vec3 pos = position;

  float bend = (quadraticOut(uv.y) - 1.0) * uBend;
  float flipProgress = smoothstep(0.0 + uv.x * 0.4, 0.8 + uv.x * 0.2, uFlip);

  pos = (rotation3d(vec3(0.0, 0.0, 1.0), uAngle * 3.14 * 4.0) * vec4(pos, 1.0)).xyz;
  pos = (rotation3d(vec3(1.6, 1.0, 0.5), 3.14 * flipProgress * 1.0 + uAngle * 3.14 * 4.0) * vec4(pos, 1.0)).xyz;

  pos.z += bend * 6.0;

  test.r = abs(pos.z);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}


// ===== shader 6 — 011-fd447676122150f3.js =====

varying vec2 vUv;
uniform sampler2D uMap;
varying vec3 test;
uniform float uOpacity;

void main() {
  vec4 image = texture2D(uMap, vUv);
  vec3 color = image.rgb - image.rgb * pow(test.r, 2.0) * 0.8;
  gl_FragColor = vec4(color, uOpacity);
}


// ===== shader 7 — 020-e731e01936617f80.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 8 — 020-e731e01936617f80.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 9 — 020-e731e01936617f80.js =====
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
		

// ===== shader 10 — 020-e731e01936617f80.js =====

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
		

// ===== shader 11 — 020-e731e01936617f80.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 12 — 020-e731e01936617f80.js =====


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
	

// ===== shader 13 — 020-e731e01936617f80.js =====

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

// ===== shader 14 — 020-e731e01936617f80.js =====
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

// ===== shader 15 — 020-e731e01936617f80.js =====

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