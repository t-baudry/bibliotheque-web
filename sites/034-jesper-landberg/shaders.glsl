// ===== shader 1 — 004-DZyj3ghP.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 004-DZyj3ghP.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 004-DZyj3ghP.js =====

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
		

// ===== shader 4 — 004-DZyj3ghP.js =====
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
		

// ===== shader 5 — 004-DZyj3ghP.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 6 — 004-DZyj3ghP.js =====


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
	

// ===== shader 7 — 004-DZyj3ghP.js =====

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

// ===== shader 8 — 004-DZyj3ghP.js =====
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

// ===== shader 9 — 004-DZyj3ghP.js =====

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

// ===== shader 10 — 004-DZyj3ghP.js =====
varying vec2 vUv;

// Fullscreen pass. The quad is already in clip space (-1..1), so there is no
// camera to apply and no model matrix worth multiplying by — the vertices go
// straight through.
void main() {
	vUv = uv;
	gl_Position = vec4(position.xy, 0.0, 1.0);
}


// ===== shader 11 — 004-DZyj3ghP.js =====
s own content sliding
// over the bulge.
//

void main() {
	vec2 q = (vUv - u_center) * u_aspect * squash();

	float t = length(q) / widthUnit();
	vec2 dir = length(q) > 0.00001 ? normalize(q) : vec2(1.0, 0.0);

	// Silenced by sin(PI * p) at both ends so a shut hole leaves the page
	// exactly untouched. Clamped as a guard rather than for anything the drive
	// currently does: p is tweened on a monotonic curve today, but sin turns
	// NEGATIVE past 1, so the day someone reaches for a back or an elastic on
	// the open, the rim

// ===== shader 12 — 004-DZyj3ghP.js =====
s memory ──
//
// A height field, accumulated: every frame the previous field survives times
// u_decay, spreads a little into its neighbours (u_diff), and the cursor
// stamps one gaussian on top. That is the whole simulation — no velocity, no
// pressure — and it is enough for what the analytic capsule could not do:
// the field remembers the PATH (a curved stroke stays curved), old ink dies
// while new ink is born, and the edges soften as they fade.
//
// Deliberately NOT a fluid. A stable-fluids build of this exists on the
// metaball-fluid branch and it reads as water — ink carried off the stroke,
// swirling. A ball under a sheet is the opposite bargain: the bump stays
// where the ball made it and dies in place, because fabric has no momentum,
// only tension and relaxation — which is exactly decay and diffusion.
//
// Both rates arrive dt-shaped (exp decays computed on the CPU), so a 120Hz
// frame and a dropped one leave the same cloth behind.
void main() {
	float c = texture2D(u_prev, vUv).r;

	float n = texture2D(u_prev, vUv + vec2(u_texel.x, 0.0)).r
		+ texture2D(u_prev, vUv - vec2(u_texel.x, 0.0)).r
		+ texture2D(u_prev, vUv + vec2(0.0, u_texel.y)).r
		+ texture2D(u_prev, vUv - vec2(0.0, u_texel.y)).r;

	float h = mix(c, n * 0.25, u_diff) * u_decay;

	// The stamp. Distance judged in width-share space — x as-is, y divided
	// by aspect — so the splat is a circle on screen, not an ellipse squeezed
	// by the buffer

// ===== shader 13 — 004-DZyj3ghP.js =====
s edge: a pixel and a half of AA, exactly as the hole cuts its
// horizon.
float inside(float d) {
	float aa = max(fwidth(d), 0.0001);
	return 1.0 - smoothstep(-aa, aa, d);
}

void main() {
	vec2 q = (vUv - u_center) * u_aspect;

	float t = length(q) / widthUnit();
	vec2 dir = length(q) > 0.00001 ? normalize(q) : vec2(1.0, 0.0);
	float n = lobes(atan(q.y, q.x)) * u_wave;

	bool has1 = u_kind[1] > 0.5;
	bool has2 = u_kind[2] > 0.5;

	float r1 = has1 ? radius(u_p[1], n) : -1.0;
	float r2 = has2 ? radius(u_p[2], n) : -1.0;

	// Back to front, each disc mixed over what is behind it. The back sheet
	// has no rim of its own (1e3 skips the swell), only the one opening over
	// it.
	vec3 c = shade(u_kind[0], 1000.0, 1.0, r1, t, dir);

	if (has1) c = mix(c, shade(u_kind[1], r1, u_p[1], r2, t, dir), inside(t - r1));
	if (has2) c = mix(c, shade(u_kind[2], r2, u_p[2], -1.0, t, dir), inside(t - r2));

	// The rims

// ===== shader 14 — 004-DZyj3ghP.js =====
s second difference on screen
		vec2 dd = p0 - 2.0 * p1 + p2;
		int n = clamp(int(ceil(sqrt(length(dd) * 0.5))), 1, 8);

		float dx = off * px.x;

		vec2 prev = p0;
		for (int k = 1; k <= n; k++) {
			float s = float(k) / float(n);
			vec2 q = mix(mix(p0, p1, s), mix(p1, p2, s), s);

			cov.g += segment(prev, q);

			if (dx != 0.0) {
				cov.r += segment(prev - vec2(dx, 0.0), q - vec2(dx, 0.0));
				cov.b += segment(prev + vec2(dx, 0.0), q + vec2(dx, 0.0));
			}

			prev = q;
		}
	}

	return cov;
}

void main() {
	int table = int(v_glyph.x + 0.5);
	int bands = int(v_glyph.y + 0.5);

	// The pixel

// ===== shader 15 — 004-DZyj3ghP.js =====
s luminance and gave it a violet hue, guarded behind a
// uniform branch so a strip at rest paid nothing for it.
//
// It is a POSE now — the tile comes forward, and forward is a z offset stacked
// on the DOM-synced position (see cardPose). Which means the hover has left
// the fragment stage entirely, and that is the right place for it to live: the
// site has a floor and a horizon now, so a card answering the pointer by
// moving in space says more than one changing colour, and it costs no
// fragments at all.
void main() {
	vec4 tex = texture2D(u_texture, uvCover(u_res, u_size, vUv));

	// Depth shade, keyed to the sheet

// ===== shader 16 — 004-DZyj3ghP.js =====
s arrow, whole: a shaft along +x and two barbs swept back at
// 45° from its tip — the same silhouette arrowMark builds, so the rigid
// copy this draws and the assembled one that replaces it are the one mark.
// No per-stroke axes and no lags: this is the LEAVING half only, slid out
// as one shape. See the u_arrowR block in main.
float rightArrow(vec2 q, float w) {
	vec2 tip = vec2(ARROW_ARM, 0.0);

	float m = seg(q, -tip, tip, w);
	m = max(m, seg(q, tip, tip + ARROW_HEAD * vec2(-0.7071, 0.7071), w));
	m = max(m, seg(q, tip, tip + ARROW_HEAD * vec2(-0.7071, -0.7071), w));

	return m;
}

void main() {
	// Squared to the plane

// ===== shader 17 — 004-DZyj3ghP.js =====
varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}


// ===== shader 18 — 004-DZyj3ghP.js =====

			varying vec3 vN;

			void main() {
				vN = normalize(normalMatrix * normal);
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		

// ===== shader 19 — 004-DZyj3ghP.js =====
s frustum does.
//
// Which is also why it is not a plane pushed far back on z. A far plane is
// parallax the eye can read — it would slide against the floor under the
// mouse tilt, and the one thing a backdrop must never do is look like it is
// at a distance you could walk to.
void main() {
	vUv = uv;
	gl_Position = vec4(position.xy, 0.0, 1.0);
}


// ===== shader 20 — 004-DZyj3ghP.js =====
s background no longer has to BE
// anything, because the canvas is no longer letting it through.
//
// And it is one uniform away from being a sky again.
void main() {
	gl_FragColor = vec4(u_c0, 1.0);
}


// ===== shader 21 — 004-DZyj3ghP.js =====
s world x the cast radiates from

varying vec2 vUv;
varying vec3 vWorld;
varying float vFar;

void main() {
	// Dissolve rather than a horizon. A floor that ends on a LINE has to
	// answer for what is past it, and the answer is always either a hard
	// seam or a sky that has to match the ground exactly where they meet.
	// Fading it into the backdrop

// ===== shader 22 — 004-DZyj3ghP.js =====

					varying vec2 vUv;
					void main() {
						vUv = uv;
						gl_Position = vec4(position.xy, 0.0, 1.0);
					}
				

// ===== shader 23 — 004-DZyj3ghP.js =====

					varying vec2 vUv;
					uniform float u_alpha;
					uniform float u_edge;
					uniform float u_max;
					void main() {
						float g = smoothstep(1.0 - u_edge, 1.0, vUv.y);
						g = max(g, smoothstep(u_edge, 0.0, vUv.y));
						g *= g;
						gl_FragColor = vec4(vec3(0.0), u_alpha * u_max * g);
					}
				