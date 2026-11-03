// ===== shader 1 — 022-BBS_-sb2.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 023-CZEyUk1w.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 023-CZEyUk1w.js =====

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
		

// ===== shader 4 — 023-CZEyUk1w.js =====
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
		

// ===== shader 5 — 023-CZEyUk1w.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 6 — 023-CZEyUk1w.js =====


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
	

// ===== shader 7 — 023-CZEyUk1w.js =====

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

// ===== shader 8 — 023-CZEyUk1w.js =====
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

// ===== shader 9 — 023-CZEyUk1w.js =====

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

// ===== shader 10 — 024-B3cVYYkG.js =====

	precision highp float;

	varying vec2 v_uv;

	void main() {
		v_uv = uv;

		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}


// ===== shader 11 — 024-B3cVYYkG.js =====
s black can
	                            dissolve into it instead of ending on a seam.
	                            0 is the ordinary hard-edged plane. */

	/*
	 * The lean, in radians: y about the vertical axis, x about the horizontal.
	 * Zero on every ordinary plane, and the whole block below folds away to a
	 * dot product against nothing when it is — see useTether, which is the
	 * only thing that writes it.
	 *
	 * It is handed in rather than derived from the model matrix because the
	 * shading wants the INTENT, not the pose: a plane the page merely happens
	 * to see at an angle should not light up.
	 */
	uniform vec2 u_tilt;

	varying vec2 v_uv;

	${Rp}

	vec2 cover(vec2 res, vec2 size, vec2 uv) {
		float rr = res.x / res.y;
		float ir = size.x / size.y;

		vec2 s = rr < ir
			? vec2(size.x * (res.y / size.y), res.y)
			: vec2(res.x, size.y * (res.x / size.x));

		vec2 o = (rr < ir
			? vec2((s.x - res.x) * 0.5, 0.0)
			: vec2(0.0, (s.y - res.y) * 0.5)) / s;

		return uv * res / s + o;
	}

	/*
	 * SIGNED, where the exterior-only form this replaced was not: it has to
	 * report how deep INSIDE the box a fragment is, which that one cannot —
	 * with no radius it returns a flat 0 across the whole interior, so a
	 * feather read off it would be one constant value everywhere rather than a
	 * gradient. Outside the box the two agree exactly, and inside, every value
	 * the old one produced was already clamped away by the smoothstep below.
	 */
	float roundBox(vec2 p, vec2 b, float r) {
		vec2 q = abs(p) - b + r;

		return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
	}

	void main() {
		vec2 st = cover(u_res, u_size, v_uv);
		st.y -= u_shift + u_scroll;

		vec4 c = texture2D(u_texture, st);

		vec2 half_res = u_res * 0.5;
		float d = roundBox(v_uv * u_res - half_res, half_res, u_radius);

		/* the ramp runs from u_feather deep inside the edge to 1.5 outside it.
		   At u_feather 0 that is the 1px antialias every plane has always had */
		float mask = 1.0 - smoothstep(-u_feather, 1.5, d);

		/* the wipe edge, in px so it is one pixel soft whatever the size —
		   uv y runs up, and the shown part is the bottom */
		float edge = (u_clip - v_uv.y) * u_res.y;
		mask *= smoothstep(0.0, 1.0, edge);

		/*
		 * The lean

// ===== shader 12 — 024-B3cVYYkG.js =====

	out vec2 v_uv;

	void main() {
		v_uv = uv;
		gl_Position = vec4(position.xy, 0.0, 1.0);
	}


// ===== shader 13 — 024-B3cVYYkG.js =====

	precision highp float;

	uniform sampler2D u_mask;
	uniform vec2 u_light;    /* uv */
	uniform vec2 u_aspect;   /* so the falloff is a circle, not an ellipse */
	uniform vec3 u_color;
	uniform float u_strength;
	uniform float u_radius;  /* uv units, along the shorter axis */
	uniform float u_white;   /* how far the hot core goes toward white */
	uniform float u_gain;    /* small ink (a 17px link) needs more than big copy */

	in vec2 v_uv;
	out vec4 fragColor;

	void main() {
		vec2 d = (v_uv - u_light) * u_aspect;
		float dist = length(d);

		/* local to the lamp */
		float local = 1.0 - smoothstep(0.0, u_radius, dist);
		if (local <= 0.0) { fragColor = vec4(0.0); return; }

		/*
		 * March from this pixel toward the light. The first few steps are
		 * skipped: ink sampled right next to a pixel paints a bright rim
		 * around every glyph, which reads as an outline rather than light
		 * behind it. Starting further out leaves the rays and loses the rim.
		 */
		vec2 step_ = (u_light - v_uv) / float(${Jp}) * 0.6;
		vec2 p = v_uv + step_ * 4.0;
		float light = 0.0;
		float w = 1.0;

		for (int i = 0; i < ${Jp}; i++) {
			p += step_;
			light += texture(u_mask, p).a * w;
			w *= 0.93;
		}
		light /= float(${Jp});

		float a = light * 1.6 * u_gain * local * local * u_strength;

		/* the hot core: white where the rays are dense and right under the
		   lamp, the tint further out — a lamp, not a blue wash */
		float hot = clamp(light * 2.5, 0.0, 1.0) * 0.5 + (1.0 - smoothstep(0.0, u_radius * 0.35, dist)) * 0.5;
		vec3 col = mix(u_color, vec3(1.0), hot * u_white);

		fragColor = vec4(col * a, a);
	}


// ===== shader 14 — 024-B3cVYYkG.js =====
s tint */

	void main() {
		int slot = int(a_slot + 0.5);
		vec4 rect = texelFetch(u_el, ivec2(0, slot), 0);
		vec4 st = texelFetch(u_el, ivec2(1, slot), 0);
		vec4 ink = texelFetch(u_el, ivec2(2, slot), 0);
		vec3 rgb = ink.rgb;

		float u_progress = st.y;
		float u_mode = st.z;

		/*
		 * The hover mark: a_index < 0 is the ● instance TextPlane injects at
		 * the first glyph

// ===== shader 15 — 024-B3cVYYkG.js =====
s second difference on screen,
			   a quarter pixel of tolerance */
			vec2 dd = p0 - 2.0 * p1 + p2;
			int n = clamp(int(ceil(sqrt(length(dd) * 0.5))), 1, 8);

			vec2 prev = p0;
			for (int k = 1; k <= n; k++) {
				float s = float(k) / float(n);
				vec2 q = mix(mix(p0, p1, s), mix(p1, p2, s), s);
				cov += segment(prev, q);
				prev = q;
			}
		}

		return cov;
	}

	void main() {
		int table = int(v_glyph.x + 0.5);
		int bands = int(v_glyph.y + 0.5);

		/* pixel footprint in em — from the derivatives, so dpr and zoom are
		   already in it. Before the discard: a derivative after one is
		   undefined for the quad

// ===== shader 16 — 024-B3cVYYkG.js =====

	precision highp float;

	varying vec2 v_uv;

	void main() {
		v_uv = uv;

		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}


// ===== shader 17 — 024-B3cVYYkG.js =====

	precision highp float;

	uniform sampler2D u_tex;
	uniform vec2 u_split;   /* uv offset per channel — the dispersion */
	uniform float u_alpha;

	varying vec2 v_uv;

	${Rp}

	void main() {
		vec4 c = texture2D(u_tex, v_uv);

		/* r and b sampled a hair apart; alpha stays the centre

// ===== shader 18 — 024-B3cVYYkG.js =====

				precision highp float;

				uniform sampler2D u_data;
				uniform vec3 u_tint;
				uniform float u_strength;

				varying vec2 v_uv;

				void main() {
					gl_FragColor = vec4(u_tint, texture2D(u_data, v_uv).b * u_strength);
				}
			