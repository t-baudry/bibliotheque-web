// ===== shader 1 — 001-index.PhJuwueo.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 001-index.PhJuwueo.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 001-index.PhJuwueo.js =====

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
		

// ===== shader 4 — 001-index.PhJuwueo.js =====
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
		

// ===== shader 5 — 001-index.PhJuwueo.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 6 — 001-index.PhJuwueo.js =====


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
	

// ===== shader 7 — 001-index.PhJuwueo.js =====

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

// ===== shader 8 — 001-index.PhJuwueo.js =====
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

// ===== shader 9 — 001-index.PhJuwueo.js =====

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

// ===== shader 10 — 001-index.PhJuwueo.js =====
#define PI 3.1415926535897932384626433832795\r
\r
precision highp float;\r
\r
attribute vec3 position;\r
attribute vec2 uv;\r
\r
uniform mat4 modelViewMatrix;\r
uniform mat4 projectionMatrix;\r
uniform float u_inViewProgress;\r
\r
varying vec2 v_uv;\r
\r
const float POS_IN_RATIO = 1.0;\r
const float TRANSLATE_Y_RATIO = -1.0;\r
\r
mat2 scale2d_mat(vec2 _scale){\r
	return mat2(_scale.x, 0., 0., _scale.y);\r
}\r
\r
void main() {\r
	vec3 newPosition = position;\r
	float posIn = (-newPosition.y + 1.) * 0.5;\r
	float startPoint = posIn * POS_IN_RATIO;\r
	float inProgress = smoothstep(startPoint, 1.0, u_inViewProgress);\r
	float _inProgress = 1.0 + (0.25 * (1.0 - inProgress));\r
\r
	newPosition.x *= _inProgress;\r
	newPosition.y += TRANSLATE_Y_RATIO * (1.0 -  u_inViewProgress);\r
\r
	vec4 _newPosition = modelViewMatrix * vec4(newPosition, 1.0);\r
\r
	v_uv = uv;\r
\r
	gl_Position = projectionMatrix * _newPosition;\r
}\r


// ===== shader 11 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_meshSize;\r
uniform vec2 u_textureSize;\r
uniform float u_uvParallaxProgress;\r
\r
varying vec2 v_uv;\r
\r
void main() {\r
    vec2 uv = v_uv;\r
    vec2 resolutionRatio = vec2(\r
        min((u_meshSize.x / u_meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),\r
        min((u_meshSize.y / u_meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)\r
    );\r
\r
    uv -= 0.5;\r
    uv *= resolutionRatio;\r
    uv += 0.5;\r
\r
    // テクスチャの余白分を計算（上下200px = 合計400px / 1936px）\r
    float paddingRatio = 400.0 / u_textureSize.y;\r
    float halfPadding = paddingRatio * 0.5;\r
    // progress: 0 → 上の余白から開始\r
    // progress: 1 → 下の余白で終了\r
    float parallaxOffset = -halfPadding + (u_uvParallaxProgress * paddingRatio);\r
\r
    uv.y -= parallaxOffset;\r
\r
    vec4 color = texture2D(u_texture, uv);\r
\r
    gl_FragColor = color;\r
}\r


// ===== shader 12 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
attribute vec3 position;\r
attribute vec2 uv;\r
\r
uniform mat4 modelViewMatrix;\r
uniform mat4 projectionMatrix;\r
\r
varying vec2 v_uv;\r
\r
void main() {\r
	v_uv = uv;\r
\r
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r
}\r


// ===== shader 13 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_meshSize;\r
uniform vec2 u_textureSize;\r
\r
varying vec2 v_uv;\r
\r
void main() {\r
  vec2 uv = v_uv;\r
  vec2 resolutionRatio = vec2(\r
    min((u_meshSize.x / u_meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),\r
    min((u_meshSize.y / u_meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)\r
  );\r
\r
  uv -= 0.5;\r
  uv *= resolutionRatio;\r
  uv += 0.5;\r
\r
  vec4 color = texture2D(u_texture, uv);\r
\r
  gl_FragColor = vec4(color);\r
}\r


// ===== shader 14 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_meshSize;\r
uniform vec2 u_textureSize;\r
uniform float u_uvParallaxProgress;\r
uniform float u_mask;\r
\r
varying vec2 v_uv;\r
\r
void main() {\r
    vec3 maskColor = vec3(10.0, 8.0, 1.0) / 255.0;\r
    float visibleAreaRatio = 1.0 - (u_mask * 2.0);\r
\r
    if (u_mask > 0.0 && (v_uv.y < u_mask || v_uv.y > 1.0 - u_mask)) {\r
        gl_FragColor = vec4(maskColor, 1.0);\r
        return;\r
    }\r
\r
    vec2 uv = vec2(v_uv.x, (v_uv.y - u_mask) / visibleAreaRatio);\r
    vec2 meshSize = vec2(u_meshSize.x, u_meshSize.y * visibleAreaRatio);\r
    vec2 resolutionRatio = vec2(\r
        min((meshSize.x / meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),\r
        min((meshSize.y / meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)\r
    );\r
\r
    uv -= 0.5;\r
    uv *= resolutionRatio;\r
    uv += 0.5;\r
\r
    // テクスチャの余白分を計算（上下200px = 合計400px / 1936px）\r
    float paddingRatio = 400.0 / u_textureSize.y;\r
    float halfPadding = paddingRatio * 0.5;\r
    // progress: 0 → 上の余白から開始\r
    // progress: 1 → 下の余白で終了\r
    float parallaxOffset = -halfPadding + (u_uvParallaxProgress * paddingRatio);\r
\r
    uv.y -= parallaxOffset;\r
\r
    vec4 color = texture2D(u_texture, uv);\r
\r
    gl_FragColor = color;\r
}\r


// ===== shader 15 — 001-index.PhJuwueo.js =====
uniform float uTranslateProgress;\r
\r
varying vec2 vUv;\r
\r
void main() {\r
  vUv = uv;\r
\r
  vec3 newPosition = position;\r
  newPosition.y -= uTranslateProgress;\r
\r
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);\r
}\r


// ===== shader 16 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
uniform sampler2D uTexture;\r
uniform vec3 uColor;\r
uniform float uAlpha;\r
uniform float uRipplePos;\r
uniform float uRippleStrength;\r
\r
varying vec2 vUv;\r
\r
float ripple(float uv, float time, float prog) {\r
  float distance = length(((uv) + (time * 2.0)));\r
\r
  return tan(distance * (1.0)) * (prog * -1.85);\r
}\r
\r
void main() {\r
  float rippleUv = ripple((vUv.y), uRipplePos, uRippleStrength) * (0.001 * uRippleStrength);\r
  vec2 newUv = vec2(vUv.x, vUv.y + rippleUv);\r
  vec2 clampedUv = clamp(newUv, vec2(0.0), vec2(1.0));\r
  vec4 texColor = texture2D(uTexture, clampedUv);\r
\r
  float inBounds =\r
    step(0.0, newUv.x) *\r
    step(0.0, newUv.y) *\r
    step(newUv.x, 1.0) *\r
    step(newUv.y, 1.0);\r
\r
  float alpha = texColor.a * uAlpha * inBounds;\r
  gl_FragColor = vec4(uColor, alpha);\r
}\r


// ===== shader 17 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_meshSize;\r
uniform vec2 u_textureSize;\r
uniform float u_fadeProgress;\r
uniform float u_multiplier;\r
uniform float u_redOffset;\r
uniform float u_greenOffset;\r
uniform float u_blueOffset;\r
uniform float u_inViewProgress;\r
\r
varying vec2 v_uv;\r
\r
float ccLensScale(float distortion, float rsqLimit) {\r
  float distPulse = 1.0 + distortion * rsqLimit;\r
  float distMinus = 1.0 / (1.0 - distortion * rsqLimit);\r
  return mix(distPulse, distMinus, step(distortion, 0.));\r
}\r
\r
void main() {\r
  vec2 uv = v_uv;\r
  vec2 uvCircle = v_uv * 2.0 - 1.0;\r
\r
  float meshAspectXY = u_meshSize.x / u_meshSize.y;\r
  float meshAspectYX = u_meshSize.y / u_meshSize.x;\r
  float uvSizeAspectRatio = min(meshAspectXY, meshAspectYX);\r
\r
  uvCircle = mix(vec2(uvCircle.x, uvCircle.y / meshAspectXY), vec2(uvCircle.x / meshAspectYX, uvCircle.y), step(u_meshSize.x, u_meshSize.y));\r
\r
  float circleLength = length(uvCircle);\r
  float circleScaleScrennSizeFixMultipleRatio = sqrt(1.0 + pow(uvSizeAspectRatio, 2.0));\r
\r
  circleLength /= circleScaleScrennSizeFixMultipleRatio;\r
\r
  vec2 uvBase = uv - 0.5;\r
\r
  float uvCCLensX2 = pow(uvBase.x * meshAspectXY, 2.0);\r
  float uvCCLensY2 = pow(uvBase.y, 2.0);\r
  float rsq = uvCCLensX2 + uvCCLensY2;\r
  float rsqLimit = 0.01;\r
  float lensProgress = 1.0 - u_inViewProgress;\r
  float multiplier = u_multiplier * lensProgress;\r
  float uvScale = ccLensScale(multiplier, rsqLimit);\r
\r
  vec2 uvTexture = vec2(\r
    uvBase.x * (1.0 + multiplier * rsq) / uvScale,\r
    uvBase.y * (1.0 + multiplier * rsq) / uvScale\r
  ) + 0.5;\r
  vec2 resolutionRatio = vec2(\r
    min((u_meshSize.x / u_meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),\r
    min((u_meshSize.y / u_meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)\r
  );\r
\r
  uvTexture -= 0.5;\r
  uvTexture *= resolutionRatio;\r
  uvTexture += 0.5;\r
\r
  float offsetProgress = 1.0 - clamp(u_inViewProgress, 0.0, 1.0);\r
\r
  vec2 redOffset = vec2(0.0, u_redOffset * offsetProgress);\r
  vec2 greenOffset = vec2(0.0, u_greenOffset * offsetProgress);\r
  vec2 blueOffset = vec2(0.0, u_blueOffset * offsetProgress);\r
\r
  float r = texture2D(u_texture, uvTexture + redOffset).r;\r
  float g = texture2D(u_texture, uvTexture + greenOffset).g;\r
  float b = texture2D(u_texture, uvTexture + blueOffset).b;\r
\r
  vec4 textureColor = vec4(r, g, b, 1.0);\r
  vec4 color = mix(vec4(0.0), textureColor, u_inViewProgress);\r
\r
  color = mix(color, vec4(0.0, 0.0, 0.0, 0.0), clamp(u_fadeProgress, 0.0, 1.0));\r
\r
  gl_FragColor = color;\r
}\r


// ===== shader 18 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_meshSize;\r
uniform vec2 u_textureSize;\r
uniform float u_fadeProgress;\r
\r
varying vec2 v_uv;\r
\r
void main() {\r
  vec2 uv = v_uv;\r
  vec2 resolutionRatio = vec2(\r
    min((u_meshSize.x / u_meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),\r
    min((u_meshSize.y / u_meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)\r
  );\r
\r
  vec2 uvTexture = uv;\r
  uvTexture -= 0.5;\r
  uvTexture *= resolutionRatio;\r
  uvTexture += 0.5;\r
\r
  vec4 textureColor = texture2D(u_texture, uvTexture);\r
\r
  textureColor = mix(textureColor, vec4(0.0, 0.0, 0.0, 0.0), clamp(u_fadeProgress, 0.0, 1.0));\r
\r
  gl_FragColor = textureColor;\r
}\r


// ===== shader 19 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
uniform sampler2D u_texture1;\r
uniform sampler2D u_texture2;\r
uniform sampler2D u_texture3;\r
uniform vec2 u_meshSize;\r
uniform vec2 u_textureSize;\r
uniform float u_uvParallaxProgress;\r
uniform float u_inView1Progress;\r
uniform float u_inView2Progress;\r
uniform float u_inView3Progress;\r
uniform float u_multiplier;\r
uniform float u_edgeStrength;\r
uniform float u_direction;\r
\r
varying vec2 v_uv;\r
\r
float circle(in vec2 _st, in float _radius, in float blurriness) {\r
  vec2 dist = _st;\r
  return 1. - smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);\r
}\r
\r
float ccLensScale(float distortion, float rsqLimit) {\r
  float distPulse = 1. + distortion * rsqLimit;\r
  float distMinus = 1. / (1. - distortion * rsqLimit);\r
  return mix(distPulse, distMinus, step(distortion, 0.));\r
}\r
\r
\r
void main() {\r
    vec2 uv = v_uv;\r
\r
    float meshAspectXY = u_meshSize.x / u_meshSize.y;\r
    float meshAspectYX = u_meshSize.y / u_meshSize.x;\r
    float uvSizeAspectRatio = min(meshAspectXY, meshAspectYX);\r
\r
    vec2 uvCircle = v_uv * 2.0 - 1.0;\r
    uvCircle = mix(vec2(uvCircle.x, uvCircle.y / meshAspectXY), vec2(uvCircle.x / meshAspectYX, uvCircle.y), step(u_meshSize.x, u_meshSize.y));\r
\r
    float circleLength = length(uvCircle);\r
    float circleScaleScrennSizeFixMultipleRatio = sqrt(1. + pow(uvSizeAspectRatio, 2.));\r
    circleLength /= circleScaleScrennSizeFixMultipleRatio;\r
\r
    // 方向判定（正の値=順方向、負の値=逆方向）\r
    float isForward = step(0.0, u_direction);\r
\r
    // texture1用のCC Lens計算\r
    vec2 uvCCLensBase1 = uv;\r
    vec2 uvTexture1Base = uv - 0.5;\r
    vec2 uvCCLens1 = uvCCLensBase1 - 0.5;\r
\r
    float uvCCLensX2_1 = pow(uvCCLens1.x * meshAspectXY, 2.);\r
    float uvCCLensY2_1 = pow(uvCCLens1.y, 2.);\r
    float rsq1 = uvCCLensX2_1 + uvCCLensY2_1;\r
\r
    float rsqLimit = 0.;\r
    // texture1: 順方向は自身のprogress、逆方向はu_inView2Progressを使用\r
    float lensProgress1 = mix(u_inView2Progress, 1. - u_inView1Progress, isForward);\r
    float multiplier1 = u_multiplier * lensProgress1;\r
    float uvScale1 = ccLensScale(multiplier1, rsqLimit);\r
\r
    vec2 uvTexture1 = vec2(\r
      uvTexture1Base.x * (1. + multiplier1 * rsq1) / uvScale1,\r
      uvTexture1Base.y * (1. + multiplier1 * rsq1) / uvScale1\r
    ) + 0.5;\r
\r
    // texture2用のCC Lens計算（u_inView2Progress）\r
    vec2 uvCCLensBase2 = uv;\r
    vec2 uvTexture2Base = uv - 0.5;\r
    vec2 uvCCLens2 = uvCCLensBase2 - 0.5;\r
\r
    float uvCCLensX2_2 = pow(uvCCLens2.x * meshAspectXY, 2.);\r
    float uvCCLensY2_2 = pow(uvCCLens2.y, 2.);\r
    float rsq2 = uvCCLensX2_2 + uvCCLensY2_2;\r
    // texture2: 順方向は自身のprogress、逆方向はu_inView3Progressを使用\r
    float lensProgress2 = mix(u_inView3Progress, 1. - u_inView2Progress, isForward);\r
    float multiplier2 = u_multiplier * lensProgress2;\r
    float uvScale2 = ccLensScale(multiplier2, rsqLimit);\r
\r
    vec2 uvTexture2 = vec2(\r
      uvTexture2Base.x * (1. + multiplier2 * rsq2) / uvScale2,\r
      uvTexture2Base.y * (1. + multiplier2 * rsq2) / uvScale2\r
    ) + 0.5;\r
\r
    // texture3用のCC Lens計算（u_inView3Progress）\r
    vec2 uvCCLensBase3 = uv;\r
    vec2 uvTexture3Base = uv - 0.5;\r
    vec2 uvCCLens3 = uvCCLensBase3 - 0.5;\r
\r
    float uvCCLensX2_3 = pow(uvCCLens3.x * meshAspectXY, 2.);\r
    float uvCCLensY2_3 = pow(uvCCLens3.y, 2.);\r
    float rsq3 = uvCCLensX2_3 + uvCCLensY2_3;\r
    // texture3: 順方向のみ歪む、逆方向では歪まない\r
    float lensProgress3 = mix(0., 1. - u_inView3Progress, isForward);\r
    float multiplier3 = u_multiplier * lensProgress3;\r
    float uvScale3 = ccLensScale(multiplier3, rsqLimit);\r
\r
    vec2 uvTexture3 = vec2(\r
      uvTexture3Base.x * (1. + multiplier3 * rsq3) / uvScale3,\r
      uvTexture3Base.y * (1. + multiplier3 * rsq3) / uvScale3\r
    ) + 0.5;\r
\r
    vec2 resolutionRatio = vec2(\r
        min((u_meshSize.x / u_meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),\r
        min((u_meshSize.y / u_meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)\r
    );\r
\r
    uvTexture1 -= 0.5;\r
    uvTexture1 *= resolutionRatio;\r
    uvTexture1 += 0.5;\r
    uvTexture2 -= 0.5;\r
    uvTexture2 *= resolutionRatio;\r
    uvTexture2 += 0.5;\r
    uvTexture3 -= 0.5;\r
    uvTexture3 *= resolutionRatio;\r
    uvTexture3 += 0.5;\r
\r
    // テクスチャの余白分を計算\r
    // 400（200（デザインサイズでのバッファ） * 2（2倍サイズの画像を使用しているため）） / 1800（画像の高さ * 2）\r
    float paddingRatio = 600.0 / u_textureSize.y;\r
    // paddingRatioを上下で使用するため半分にする。\r
    float halfPadding = paddingRatio * 0.5;\r
    // progress: 0 → デザインサイズでの画像の上端と、テクスチャの上端が一致\r
    // progress: 0.5 → デザインサイズで見た時と同じ位置\r
    // progress: 1 → デザインサイズでの画像の下端と、テクスチャの下端が一致\r
    float parallaxOffset = -halfPadding + (u_uvParallaxProgress * paddingRatio);\r
\r
    uvTexture1.y -= parallaxOffset;\r
    uvTexture2.y -= parallaxOffset;\r
    uvTexture3.y -= parallaxOffset;\r
\r
    // テクスチャの取得\r
    vec4 texture1 = texture2D(u_texture1, uvTexture1);\r
    vec4 texture2 = texture2D(u_texture2, uvTexture2);\r
    vec4 texture3 = texture2D(u_texture3, uvTexture3);\r
\r
    // 円形マスク\r
    float adjustedProgress1 = u_inView1Progress * (1.0 + u_edgeStrength) - u_edgeStrength;\r
    float inner1 = smoothstep(adjustedProgress1 + u_edgeStrength, adjustedProgress1, circleLength);\r
    float outer1 = smoothstep(adjustedProgress1 + u_edgeStrength * 2.0, adjustedProgress1 + u_edgeStrength, circleLength);\r
    float edgeMask1 = inner1 * outer1;\r
\r
    float adjustedProgress2 = u_inView2Progress * (1.0 + u_edgeStrength) - u_edgeStrength;\r
    float inner2 = smoothstep(adjustedProgress2 + u_edgeStrength, adjustedProgress2, circleLength);\r
    float outer2 = smoothstep(adjustedProgress2 + u_edgeStrength * 2.0, adjustedProgress2 + u_edgeStrength, circleLength);\r
    float edgeMask2 = inner2 * outer2;\r
\r
    float adjustedProgress3 = u_inView3Progress * (1.0 + u_edgeStrength) - u_edgeStrength;\r
    float inner3 = smoothstep(adjustedProgress3 + u_edgeStrength, adjustedProgress3, circleLength);\r
    float outer3 = smoothstep(adjustedProgress3 + u_edgeStrength * 2.0, adjustedProgress3 + u_edgeStrength, circleLength);\r
    float edgeMask3 = inner3 * outer3;\r
\r
    // 方向で合成順序とマスクを切り替え\r
    vec4 color;\r
    if (isForward > 0.5) {\r
      // 順方向: 透明背景 → texture1を円形マスクで展開 → texture2を重ねる → texture3を重ねる\r
      vec4 base = vec4(0.0);\r
      vec4 layer1 = mix(base, texture1, edgeMask1);\r
      vec4 layer12 = mix(layer1, texture2, edgeMask2);\r
      color = mix(layer12, texture3, edgeMask3);\r
    } else {\r
      // 逆方向: 次のテクスチャが中心から拡大して現在のテクスチャを覆う\r
      // texture2がtexture3を覆う際のマスク（u_inView3Progressが1→0の時、0→1で拡大）\r
      float expandProgress2 = (1.0 - u_inView3Progress) * (1.0 + u_edgeStrength) - u_edgeStrength;\r
      float expandInner2 = smoothstep(expandProgress2 + u_edgeStrength, expandProgress2, circleLength);\r
      float expandOuter2 = smoothstep(expandProgress2 + u_edgeStrength * 2.0, expandProgress2 + u_edgeStrength, circleLength);\r
      float expandMask2 = expandInner2 * expandOuter2;\r
\r
      // texture1がtexture2を覆う際のマスク（u_inView2Progressが1→0の時、0→1で拡大）\r
      float expandProgress1 = (1.0 - u_inView2Progress) * (1.0 + u_edgeStrength) - u_edgeStrength;\r
      float expandInner1 = smoothstep(expandProgress1 + u_edgeStrength, expandProgress1, circleLength);\r
      float expandOuter1 = smoothstep(expandProgress1 + u_edgeStrength * 2.0, expandProgress1 + u_edgeStrength, circleLength);\r
      float expandMask1 = expandInner1 * expandOuter1;\r
\r
      // texture3の上にtexture2が中心から拡大して覆う\r
      vec4 layer32 = mix(texture3, texture2, expandMask2);\r
      // その上にtexture1が中心から拡大して覆う\r
      vec4 layer321 = mix(layer32, texture1, expandMask1);\r
      // texture1をフェードアウト（マスクではなく透明度で制御）\r
      layer321.a *= u_inView1Progress;\r
      color = layer321;\r
    }\r
\r
    gl_FragColor = color;\r
}\r


// ===== shader 20 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
uniform sampler2D u_texture;\r
uniform vec2 u_meshSize;\r
uniform vec2 u_textureSize;\r
uniform float u_uvParallaxProgress;\r
\r
varying vec2 v_uv;\r
\r
void main() {\r
  vec2 uv = v_uv;\r
  vec2 resolutionRatio = vec2(\r
    min((u_meshSize.x / u_meshSize.y) / (u_textureSize.x / u_textureSize.y), 1.0),\r
    min((u_meshSize.y / u_meshSize.x) / (u_textureSize.y / u_textureSize.x), 1.0)\r
  );\r
\r
  uv -= 0.5;\r
  uv *= resolutionRatio;\r
  uv += 0.5;\r
\r
  float paddingRatio = 400.0 / u_textureSize.x;\r
  float halfPadding = paddingRatio * 0.5;\r
  float parallaxOffset = -halfPadding + (u_uvParallaxProgress * paddingRatio);\r
\r
  uv.x -= parallaxOffset;\r
\r
  vec4 color = texture2D(u_texture, uv);\r
\r
  gl_FragColor = color;\r
}\r


// ===== shader 21 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
void main() {\r
  vec4 color = vec4(0.039, 0.031, 0.004, 1.0);\r
\r
  gl_FragColor = color;\r
}\r


// ===== shader 22 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
uniform vec2 u_texel;\r
\r
varying vec2 vUv;\r
varying vec2 vL;\r
varying vec2 vR;\r
varying vec2 vT;\r
varying vec2 vB;\r
\r
void main () {\r
	vUv = uv;\r
	vL = vUv - vec2(u_texel.x, 0.0);\r
	vR = vUv + vec2(u_texel.x, 0.0);\r
	vT = vUv + vec2(0.0, u_texel.y);\r
	vB = vUv - vec2(0.0, u_texel.y);\r
\r
	gl_Position = vec4(position.xy, 0.0, 1.0);\r
}\r


// ===== shader 23 — 001-index.PhJuwueo.js =====
precision highp float;\r
precision highp sampler2D;\r
\r
uniform sampler2D u_input_texture;\r
uniform vec3 u_point_value;\r
uniform vec2 u_point;\r
uniform float u_ratio;\r
uniform float u_img_ratio;\r
uniform float u_point_size;\r
\r
varying vec2 vUv;\r
\r
void main () {\r
    vec2 p = vUv - u_point.xy;\r
    p.x *= u_ratio;\r
    vec3 splat = .6 * pow(2., -dot(p, p) / u_point_size) * u_point_value;\r
\r
    vec3 base = texture2D(u_input_texture, vUv).xyz;\r
    gl_FragColor = vec4(base + splat, 1.);\r
}\r


// ===== shader 24 — 001-index.PhJuwueo.js =====
precision highp float;\r
precision highp sampler2D;\r
\r
uniform sampler2D u_velocity_texture;\r
\r
varying highp vec2 vUv;\r
varying highp vec2 vL;\r
varying highp vec2 vR;\r
varying highp vec2 vT;\r
varying highp vec2 vB;\r
\r
void main () {\r
    float L = texture2D(u_velocity_texture, vL).x;\r
    float R = texture2D(u_velocity_texture, vR).x;\r
    float T = texture2D(u_velocity_texture, vT).y;\r
    float B = texture2D(u_velocity_texture, vB).y;\r
\r
    float div = .25 * (R - L + T - B);\r
    gl_FragColor = vec4(div, 0., 0., 1.);\r
}\r


// ===== shader 25 — 001-index.PhJuwueo.js =====
precision highp float;\r
precision highp sampler2D;\r
\r
uniform sampler2D u_pressure_texture;\r
uniform sampler2D u_divergence_texture;\r
\r
varying highp vec2 vUv;\r
varying highp vec2 vL;\r
varying highp vec2 vR;\r
varying highp vec2 vT;\r
varying highp vec2 vB;\r
\r
void main () {\r
    float L = texture2D(u_pressure_texture, vL).x;\r
    float R = texture2D(u_pressure_texture, vR).x;\r
    float T = texture2D(u_pressure_texture, vT).x;\r
    float B = texture2D(u_pressure_texture, vB).x;\r
    float C = texture2D(u_pressure_texture, vUv).x;\r
    float divergence = texture2D(u_divergence_texture, vUv).x;\r
    float pressure = (L + R + B + T - divergence) * .25;\r
\r
    gl_FragColor = vec4(pressure, 0., 0., 1.);\r
}\r


// ===== shader 26 — 001-index.PhJuwueo.js =====
precision highp float;\r
precision highp sampler2D;\r
\r
uniform sampler2D u_pressure_texture;\r
uniform sampler2D u_velocity_texture;\r
\r
varying highp vec2 vUv;\r
varying highp vec2 vL;\r
varying highp vec2 vR;\r
varying highp vec2 vT;\r
varying highp vec2 vB;\r
\r
void main () {\r
    float L = texture2D(u_pressure_texture, vL).x;\r
    float R = texture2D(u_pressure_texture, vR).x;\r
    float T = texture2D(u_pressure_texture, vT).x;\r
    float B = texture2D(u_pressure_texture, vB).x;\r
    vec2 velocity = texture2D(u_velocity_texture, vUv).xy;\r
    velocity.xy -= vec2(R - L, T - B);\r
    gl_FragColor = vec4(velocity, 0., 1.);\r
}\r


// ===== shader 27 — 001-index.PhJuwueo.js =====
precision highp float;\r
precision highp sampler2D;\r
\r
uniform sampler2D u_velocity_texture;\r
uniform sampler2D u_input_texture;\r
uniform vec2 u_texel;\r
uniform vec2 u_output_textel;\r
uniform float u_dt;\r
uniform float u_dissipation;\r
\r
varying vec2 vUv;\r
\r
vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {\r
    vec2 st = uv / tsize - 0.5;\r
\r
    vec2 iuv = floor(st);\r
    vec2 fuv = fract(st);\r
\r
    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);\r
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);\r
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);\r
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);\r
\r
    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);\r
}\r
\r
void main () {\r
    vec2 coord = vUv - u_dt * bilerp(u_velocity_texture, vUv, u_texel).xy * u_texel;\r
    vec4 velocity = bilerp(u_input_texture, coord, u_output_textel);\r
    gl_FragColor = u_dissipation * velocity;\r
}\r


// ===== shader 28 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
attribute vec3 position;\r
attribute vec2 uv;\r
\r
varying vec2 vUv;\r
\r
void main() {\r
	vUv = uv;\r
\r
	gl_Position = vec4(position.xy, 0.0, 1.0);\r
}\r


// ===== shader 29 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
uniform sampler2D u_scene;\r
uniform sampler2D u_velocity;\r
uniform sampler2D u_output;\r
uniform float u_disturb_power;\r
\r
varying vec2 vUv;\r
\r
void main() {\r
	float offset = texture2D(u_output, vUv).r;\r
	vec2 velocity = texture2D(u_velocity, vUv).xy;\r
\r
	velocity += 0.001;\r
\r
	vec2 dir = normalize(velocity);\r
	vec2 uv = vUv;\r
\r
	uv -= u_disturb_power * dir * offset;\r
	uv -= u_disturb_power * dir * offset;\r
\r
	gl_FragColor = texture2D(u_scene, uv);\r
}\r


// ===== shader 30 — 001-index.PhJuwueo.js =====
uniform float uTranslateProgress;\r
\r
varying vec2 vUv;\r
\r
void main() {\r
  vUv = uv;\r
\r
  vec3 newPosition = position;\r
  newPosition.x += uTranslateProgress * 0.1;\r
\r
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);\r
}\r


// ===== shader 31 — 001-index.PhJuwueo.js =====
precision highp float;\r
\r
uniform sampler2D uTexture;\r
uniform vec3 uColor;\r
uniform float uAlpha;\r
uniform float uHoverProgress;\r
uniform float uRipplePos;\r
uniform float uRippleStrength;\r
\r
varying vec2 vUv;\r
\r
float ripple(float uv, float time, float prog) {\r
  float distance = length(((uv) + (time * 2.0)));\r
\r
  return tan(distance * (1.0)) * (prog * -1.85);\r
}\r
\r
void main() {\r
  float rippleUv = ripple((vUv.x), uRipplePos, uRippleStrength) * (0.001 * uRippleStrength);\r
  float slideUvY = 0.5 + vUv.y * 0.5 - uHoverProgress * 0.5;\r
  vec2 newUv = vec2(vUv.x + rippleUv, slideUvY);\r
  vec2 clampedUv = clamp(newUv, vec2(0.0), vec2(1.0));\r
  vec4 texColor = texture2D(uTexture, clampedUv);\r
  float alpha = texColor.a * uAlpha;\r
\r
  gl_FragColor = vec4(uColor, alpha);\r
}\r
