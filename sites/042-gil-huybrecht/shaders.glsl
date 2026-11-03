// ===== shader 1 — 005-BOnW5v8J.js =====
precision mediump float;





attribute float aLine;  
attribute float aPitch; 
attribute float aCut;   
attribute float aOver;  

uniform float u_progress;
uniform float u_window;  
uniform float u_stagger; 
uniform float u_planeH;  

varying vec2 vUv;    
varying vec2 vPlane; 
varying float vP;    
varying float vYEl;  
varying float vEdgeTop;
varying float vEdgeBot;

void main() {
	
	
	float p = clamp((u_progress - aLine * u_stagger) / u_window, 0.0, 1.0);
	p = 1.0 - pow(2.0, -10.0 * p);

	
	
	
	vec3 pos = position;
	pos.y -= (1.0 - p) * aPitch / u_planeH;

	
	
	
	
	
	
	
	vEdgeTop = aCut + (1.0 - p) * 1.5;
	vEdgeBot = aCut + aPitch + p * aOver;

	vUv = uv;
	vPlane = vec2(position.x + 0.5, position.y + 0.5);
	vP = p;
	vYEl = (0.5 - pos.y) * u_planeH;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}


// ===== shader 2 — 013-CuL0r0_T.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 3 — 013-CuL0r0_T.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 4 — 013-CuL0r0_T.js =====

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
		

// ===== shader 5 — 013-CuL0r0_T.js =====
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
		

// ===== shader 6 — 013-CuL0r0_T.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 7 — 013-CuL0r0_T.js =====


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
	

// ===== shader 8 — 013-CuL0r0_T.js =====

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

// ===== shader 9 — 013-CuL0r0_T.js =====
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

// ===== shader 10 — 013-CuL0r0_T.js =====

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

// ===== shader 11 — 013-CuL0r0_T.js =====

varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = vec4(position.xy, 0.0, 1.0);
}

// ===== shader 12 — 013-CuL0r0_T.js =====

varying vec2 vUv;
uniform sampler2D uPrev;
uniform float uDt;
uniform float uAspect;
uniform float uAmt;
uniform vec2 uA;
uniform vec2 uB;
uniform vec2 uDir;
uniform float uRadius;
uniform vec2 uShift;

float segDist(vec2 p, vec2 a, vec2 b) {
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
	return length(pa - ba * h);
}

void main() {
	// Scroll advection: the field rides the page — this pixel

// ===== shader 13 — 013-CuL0r0_T.js =====

varying vec2 vUv;
void main() {
	vUv = uv;
	gl_Position = vec4(position.xy, 0.0, 1.0);
}

// ===== shader 14 — 013-CuL0r0_T.js =====
s raggedness as it went.
uniform float uShift;

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float vnoise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(
		mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
		mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
		u.y
	);
}

void main() {
	vec4 cut = texture2D(uCut, vUv);
	float heat = cut.r;
	float char = cut.g;

	// Page-anchored coordinate for every noise lookup below: the field
	// advected content by uShift, so this pixel

// ===== shader 15 — 013-CuL0r0_T.js =====
precision mediump float;

varying vec2 vUv;

void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
	vUv = uv;
}


// ===== shader 16 — 013-CuL0r0_T.js =====
precision mediump float;

uniform vec2 u_size;
uniform sampler2D u_texture;
uniform float u_alpha;

varying vec2 vUv;

vec2 uvCover(vec2 screenSize, vec2 imageSize, vec2 uv) {
	float screenRatio = screenSize.x / screenSize.y;
	float imageRatio = imageSize.x / imageSize.y;

	vec2 newSize = screenRatio < imageRatio
		? vec2(imageSize.x * (screenSize.y / imageSize.y), screenSize.y)
		: vec2(screenSize.x, imageSize.y * (screenSize.x / imageSize.x));
	vec2 newOffset = (screenRatio < imageRatio
		? vec2((newSize.x - screenSize.x) / 2.0, 0.0)
		: vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;

	return uv * screenSize / newSize + newOffset;
}

void main() {
	vec2 uv = uvCover(vec2(1.0), u_size, vUv);
	vec4 tex = texture2D(u_texture, uv);
	gl_FragColor = vec4(tex.rgb, tex.a * u_alpha);
}


// ===== shader 17 — 013-CuL0r0_T.js =====
precision mediump float;

varying vec2 vUv;
varying vec2 vRes;
varying float vShape;
varying float vParab;

uniform float u_progress;
uniform float u_exit;
uniform vec2  u_pinch;     
uniform float u_pinchFall; 
uniform float u_pinchPull; 
uniform float u_pinchBow;  
uniform float u_bulge;
uniform vec2 u_res;
uniform vec4 u_from;
uniform vec4 u_to;
uniform vec2 u_viewport;
uniform vec2 u_cam;

const float PI = 3.14159265;

void main() {
	vUv = uv;

	vShape = 0.0;
	vParab = 0.0;

	
	
	
	
	
	
	if (u_progress <= 0.0) {
		vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
		vec4 clip0 = projectionMatrix * mvPos;

		
		
		float aspect = projectionMatrix[1][1] / projectionMatrix[0][0];
		vec2 s = vec2(clip0.x / clip0.w * aspect, clip0.y / clip0.w);
		float d = clamp(length(s) / length(vec2(aspect, 1.0)), 0.0, 1.0);

		mvPos.z += u_bulge * (1.0 - d * d) * 45.0;

		gl_Position = projectionMatrix * mvPos;
		vRes = u_res;
		return;
	}

	
	
	
	
	vec2 dir = vec2(
		(u_to.x + u_to.z * 0.5) - (u_from.x + u_from.z * 0.5),
		-((u_to.y + u_to.w * 0.5) - (u_from.y + u_from.w * 0.5))
	);

	float sx0 = step(0.0, dir.x);
	float sy0 = step(0.0, dir.y);
	float ax = mix(1.0 - uv.x, uv.x, sx0);
	float ay = mix(1.0 - uv.y, uv.y, sy0);
	float activation = 1.0 - sqrt(ax * ax * 0.6 + ay * ay * 0.4);

	vec2 uvScreen = vec2(uv.x, 1.0 - uv.y);
	vec2 fromPixel = u_from.xy + uvScreen * u_from.zw;
	vec2 toPixel = u_to.xy + uvScreen * u_to.zw;

	float lead = 1.0 - activation;
	float stagger = 0.225;

	
	
	
	
	
	
	
	
	
	if (u_exit > 0.5) {
		lead = 1.0 - clamp(distance(fromPixel, u_pinch) / max(u_pinchFall, 1.0), 0.0, 1.0);
		stagger = 0.0;
	}

	
	
	
	float vertexProgress = clamp(u_progress / max(1.0 - lead * stagger, 0.001), 0.0, 1.0);
	vertexProgress = 1.0 - (1.0 - vertexProgress) * (1.0 - vertexProgress);

	vec2 pixel = mix(fromPixel, toPixel, vertexProgress);

	
	
	
	
	
	if (u_exit > 0.5) {
		pixel.y += (u_pinch.y - fromPixel.y) * vertexProgress * u_pinchPull;
	}

	
	
	
	
	float parab = u_progress * (1.0 - u_progress) * 4.0;
	float dome = sin(uv.x * PI) * sin(uv.y * PI);
	float shape = dome * 0.5 + lead * 0.5;
	float lift = parab * shape * 8.0;

	if (u_exit > 0.5) {
		
		
		
		
		
		shape = lead;
		lift = parab * (lead - 0.5) * u_pinchBow;
	}

	vShape = shape;
	vParab = parab;

	
	vec3 worldPos = vec3(
		u_cam.x * (pixel.x / u_viewport.x - 0.5),
		u_cam.y * (0.5 - pixel.y / u_viewport.y),
		lift
	);

	gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);

	vRes = mix(u_from.zw, u_to.zw, vertexProgress);
}


// ===== shader 18 — 013-CuL0r0_T.js =====

attribute float aFade;
varying float vFade;
void main() {
	vFade = aFade;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// ===== shader 19 — 013-CuL0r0_T.js =====

uniform vec3 uColor;
varying float vFade;
void main() {
	vec3 c = mix(uColor, vec3(1.0), vFade * 0.65);
	gl_FragColor = vec4(c, vFade * 1.15);
}

// ===== shader 20 — 018-96mvp6Ej.js =====
precision mediump float;

#define PI 3.141592

uniform float u_bend;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
	vec3 p = position;

	
	
	float sx = sin(PI * uv.x);
	float sy = 0.75 + 0.25 * sin(PI * uv.y);

	p.z += u_bend * sx * sy;

	
	
	
	float dzdx = u_bend * PI * cos(PI * uv.x) * sy;
	float dzdy = u_bend * sx * 0.25 * PI * cos(PI * uv.y);

	vNormal = normalize(normalMatrix * vec3(-dzdx, -dzdy, 1.0));

	gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
	vUv = uv;
}
