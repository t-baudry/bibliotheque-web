// ===== shader 1 — 017-b536a0f1-a89aaee2c858350d.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 2 — 017-b536a0f1-a89aaee2c858350d.js =====
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
		

// ===== shader 3 — 017-b536a0f1-a89aaee2c858350d.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 4 — 017-b536a0f1-a89aaee2c858350d.js =====


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
	

// ===== shader 5 — 017-b536a0f1-a89aaee2c858350d.js =====

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

// ===== shader 6 — 019-bd904a5c-a41790b73ae35279.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 7 — 020-3067-5e667a9ff21b27a9.js =====
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uGlobeTexture;
uniform sampler2D uGlowTexture;
uniform sampler2D uOverlayTexture;
uniform sampler2D uMaskTexture;
uniform vec2 uResolution;
uniform vec3 uOutlineColor;

varying vec2 vUv;

// ACES Filmic tone mapping approximation
vec3 ACESFilmicToneMapping(vec3 x) {
	float a = 2.51;
	float b = 0.03;
	float c = 2.43;
	float d = 0.59;
	float e = 0.14;
	return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

// Calculate outline edge detection with smooth antialiasing
float calculateOutline(vec2 uv, sampler2D globeTex, vec2 resolution, float outlineWidth) {
	vec2 texelSize = 1.0 / resolution;
	vec4 center = texture2D(globeTex, uv);
	
	// Calculate AA width based on resolution for smooth antialiasing
	// Use a resolution-based approach that provides consistent AA quality
	float pixelSize = 1.0 / min(resolution.x, resolution.y);
	float aaWidth = pixelSize * 0.5;
	
	float edge = 0.0;
	
	// Sample in multiple directions with smooth blending
	vec2 offsets[8];
	offsets[0] = vec2(0.0, outlineWidth);
	offsets[1] = vec2(0.0, -outlineWidth);
	offsets[2] = vec2(outlineWidth, 0.0);
	offsets[3] = vec2(-outlineWidth, 0.0);
	offsets[4] = vec2(outlineWidth, outlineWidth) * 0.707;
	offsets[5] = vec2(-outlineWidth, outlineWidth) * 0.707;
	offsets[6] = vec2(outlineWidth, -outlineWidth) * 0.707;
	offsets[7] = vec2(-outlineWidth, -outlineWidth) * 0.707;
	
	for (int i = 0; i < 8; i++) {
		vec2 sampleUV = uv + offsets[i] * texelSize;
		vec4 neighbor = texture2D(globeTex, sampleUV);
		
		// Edge detection: current pixel is outside but neighbor is inside
		float isEdge = (1.0 - step(0.1, center.a)) * step(0.1, neighbor.a);
		
		// Smooth antialiasing: blend edge strength based on distance from outline edge
		float dist = length(offsets[i]);
		float smoothEdge = smoothstep(outlineWidth - aaWidth, outlineWidth + aaWidth, dist);
		edge = max(edge, isEdge * (1.0 - smoothEdge));
	}
	
	return edge;
}

void main() {
	vec4 globe = texture2D(uGlobeTexture, vUv);
	vec4 glow = texture2D(uGlowTexture, vUv);
	vec4 mask = texture2D(uMaskTexture, vUv);

	// globe = vec4(0.);
	
	// Calculate outline BEFORE unmultiplying (uses original alpha values)
	float edge = calculateOutline(vUv, uGlobeTexture, uResolution, 1.5);
	
	// Step 1: Unmultiply globe for tone mapping, keep glow as premultiplied
	vec3 globeColorRaw = vec3(0.0);
	if (globe.a > 0.001) {
		globeColorRaw = globe.rgb / globe.a;
	}
	
	// Step 2: Apply tone mapping only to globe
	vec3 globeColorToned = globeColorRaw * 2.0; // Exposure boost
	globeColorToned = ACESFilmicToneMapping(globeColorToned);
	globeColorToned = clamp(globeColorToned, 0.0, 1.0);
	
	// Step 3: Composite glow behind globe using premultiplied alpha blending
	// Glow is already in premultiplied format (glow.rgb = color * alpha)
	// Globe needs to be converted back to premultiplied: globeColorToned * globe.a
	// Premultiplied alpha compositing: result = globe_premult + glow_premult * (1.0 - globe_alpha)
	// When globe.a = 1.0, glow is completely hidden (multiplied by 0.0)
	vec3 globePremult = globeColorToned * globe.a;
	vec3 color = globePremult + glow.rgb * (1.0 - globe.a);
	float alpha = globe.a + glow.a * (1.0 - globe.a);
	
	// Step 5: Apply outline on top at 40% opacity
	// Outline should be visible on the edge, blending with existing color
	// Outline color needs to be premultiplied for proper blending
	float outlineStrength = edge * 0.4;
	if (outlineStrength > 0.001) {
		vec3 outlineColorPremult = uOutlineColor * outlineStrength;
		color = color * (1.0 - outlineStrength) + outlineColorPremult;
	}
	
	// Final alpha: combine globe, glow, and outline
	// Outline contributes to alpha where it

// ===== shader 8 — 020-3067-5e667a9ff21b27a9.js =====
varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}



// ===== shader 9 — 020-3067-5e667a9ff21b27a9.js =====
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
	vUv = uv;
	vNormal = normalize(normalMatrix * normal);
	vec4 worldPosition = modelMatrix * vec4(position, 1.0);
	vWorldPosition = worldPosition.xyz;
	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
	vViewPosition = -mvPosition.xyz;
	gl_Position = projectionMatrix * mvPosition;
}


// ===== shader 10 — 020-3067-5e667a9ff21b27a9.js =====
precision mediump float;

uniform vec3 uColor;
uniform float uGlowStrength;
uniform float uRadius;
uniform float uGlowScale;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
	vec3 normal = normalize(vNormal);
	vec3 viewDir = normalize(vViewPosition);
	
	// Dot product: 1.0 when normal faces camera (0deg), 0.0 when perpendicular (90deg)
	float facing = max(dot(viewDir, normal), 0.0);
	
	// Alpha calculation: glow should fade based on facing camera
	// facing: 1.0 when normal faces camera (0deg), 0.0 when perpendicular (90deg)
	// On a sphere: edges have facing ≈ 0.0-0.7, center has facing ≈ 1.0
	// We want alpha to decay at the edges: most of sphere should be visible, only edges should fade
	// So: facing > threshold → alpha = 1.0 (visible), facing < threshold → alpha fades to 0.0 (transparent)
	
	// Most of the sphere should be visible, fade only starts near edges
	// Using a low threshold (e.g., 0.3) means most of sphere is opaque, only edges fade
	float alpha = smoothstep(0.0, 1., facing);
	alpha = pow(alpha, 2.);
	
	// Clamp alpha to valid range
	alpha = clamp(alpha, 0.0, 1.0);
	
	// Output with color - glow color modulated by alpha
	// Note: We

// ===== shader 11 — 020-3067-5e667a9ff21b27a9.js =====
precision highp float;
uniform float uOpacity;

void main() {
	gl_FragColor = vec4(uOpacity, 0.0, 0.0, 1.0);
}



// ===== shader 12 — 020-3067-5e667a9ff21b27a9.js =====
varying vec2 vUv;

uniform float uTime;
uniform float uRandomOffset;
uniform float uFloatSpeed;
uniform float uFloatIntensity;
uniform float uRotationIntensity;
uniform float uSpeedVariation;

vec3 rotate_x(vec3 p, float angle) {
	float s = sin(angle);
	float c = cos(angle);
	return vec3(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}

vec3 rotate_y(vec3 p, float angle) {
	float s = sin(angle);
	float c = cos(angle);
	return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}

vec3 rotate_z(vec3 p, float angle) {
	float s = sin(angle);
	float c = cos(angle);
	return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
}

void main() {
	vUv = uv;
	
	vec3 pos = position;
	
	float speedMod = uFloatSpeed * uSpeedVariation;
	float t = uRandomOffset + uTime * speedMod;
	
	float rotX = sin(t) * 3.14159 * 0.2 * uRotationIntensity;
	float rotY = cos(t) * 3.14159 * 0.2 * uRotationIntensity;
	float rotZ = sin(t * 0.5) * 3.14159 * 0.1 * uRotationIntensity;
	
	pos = rotate_x(pos, rotX);
	pos = rotate_y(pos, rotY);
	pos = rotate_z(pos, rotZ);
	
	float zOffset = (sin(t) + 1.0) * 0.5 * uFloatIntensity;
	pos.z += zOffset;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}



// ===== shader 13 — 020-3067-5e667a9ff21b27a9.js =====
precision highp float;
varying float vOpacity;
uniform float uOpacity;

void main() {
	float opacity = vOpacity * uOpacity;
	gl_FragColor = vec4(opacity, 0.0, 0.0, 1.0);
}



// ===== shader 14 — 020-3067-5e667a9ff21b27a9.js =====
precision highp float;
attribute float aPhase;
varying float vOpacity;
uniform float uTime;
uniform float uFrequency;
uniform float uIsHighlighted;

void main() {
	float sine = sin(uTime * uFrequency + aPhase);
	float sine2 = sin(uTime * uFrequency * 0.6 + aPhase + 0.54);
	
	// Add Y-axis oscillation
	vec3 offsetPosition = position;
	offsetPosition.y += sine * 0.02;
	offsetPosition.z += sine2 * 0.005;
	
	vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(offsetPosition, 1.0);
	gl_Position = projectionMatrix * mvPosition;
	
	float baseOpacity = 1. - clamp(pow((sine + 1.0) * 0.5, 2.) - 0.2, 0., .6);
	vOpacity = mix(1.0, 0.0, uIsHighlighted) * baseOpacity;
}

