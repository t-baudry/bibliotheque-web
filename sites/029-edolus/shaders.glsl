// ===== shader 1 — 005-playcanvas-stable.min.js =====

	attribute vec2 vertex_position;
	varying vec2 pcTexCoord;
	void main() {
		gl_Position = vec4(vertex_position, 0.0, 1.0);
		pcTexCoord = vertex_position * 0.5 + 0.5;
	}


// ===== shader 2 — 005-playcanvas-stable.min.js =====

	uniform sampler2D pcSource;
	varying vec2 pcTexCoord;
	void main() {
		gl_FragColor = texture2D(pcSource, pcTexCoord);
	}


// ===== shader 3 — 005-playcanvas-stable.min.js =====

        attribute vec2 aPosition;
        varying vec2 vUv0;
        void main(void)
        {
            gl_Position = vec4(aPosition, 0.0, 1.0);
            vUv0 = getImageEffectUV((aPosition.xy + 1.0) * 0.5);
        }
    

// ===== shader 4 — 005-playcanvas-stable.min.js =====

void main(void) {
	ivec2 fragCoords = ivec2(gl_FragCoord.xy);
	
	uint splatIndex = uint(fragCoords.y * int(dstTextureSize) + fragCoords.x);
	
	if (splatIndex >= dstNumSplats) discard;
	
	setSplat(splatIndex);
	
	process();
}


// ===== shader 5 — 005-playcanvas-stable.min.js =====

uniform highp sampler2D means_l;
uniform highp sampler2D means_u;
uniform highp uint numSplats;
uniform highp vec3 means_mins;
uniform highp vec3 means_maxs;
void main(void) {
	int w = int(textureSize(means_l, 0).x);
	ivec2 uv = ivec2(gl_FragCoord.xy);
	if (uint(uv.x + uv.y * w) >= numSplats) {
		discard;
	}
	vec3 l = texelFetch(means_l, uv, 0).xyz;
	vec3 u = texelFetch(means_u, uv, 0).xyz;
	vec3 n = (l + u * 256.0) / 257.0;
	vec3 v = mix(means_mins, means_maxs, n);
	vec3 center = sign(v) * (exp(abs(v)) - 1.0);
	pcFragColor0 = uvec4(floatBitsToUint(center), 0u);
}


// ===== shader 6 — 005-playcanvas-stable.min.js =====

varying vec2 vUv0;
uniform sampler2D source;
uniform vec2 pixelOffset;
#ifdef GAUSS
	uniform float weight[{SAMPLES}];
#endif
void main(void) {
	vec3 moments = vec3(0.0);
	vec2 uv = vUv0 - pixelOffset * (float({SAMPLES}) * 0.5);
	for (int i = 0; i < {SAMPLES}; i++) {
		vec4 c = texture2D(source, uv + pixelOffset * float(i));
		#ifdef GAUSS
			moments += c.xyz * weight[i];
		#else
			moments += c.xyz;
		#endif
	}
	#ifndef GAUSS
		moments *= 1.0 / float({SAMPLES});
	#endif
	gl_FragColor = vec4(moments.x, moments.y, moments.z, 1.0);
}


// ===== shader 7 — 005-playcanvas-stable.min.js =====

	varying vec2 uv0;
	uniform sampler2D blitTexture;
	void main(void) {
		gl_FragColor = texture2D(blitTexture, uv0);
	}


// ===== shader 8 — 005-playcanvas-stable.min.js =====

	varying vec2 uv0;
	uniform samplerCube blitTexture;
	uniform mat4 invViewProj;
	void main(void) {
		vec4 projPos = vec4(uv0 * 2.0 - 1.0, 0.5, 1.0);
		vec4 worldPos = invViewProj * projPos;
		gl_FragColor = textureCube(blitTexture, worldPos.xyz);
	}


// ===== shader 9 — 005-playcanvas-stable.min.js =====

	attribute vec2 vertex_position;
	varying vec2 uv0;
	void main(void) {
		gl_Position = vec4(vertex_position, 0.5, 1.0);
		uv0 = vertex_position.xy * 0.5 + 0.5;
		#ifndef WEBGPU
			uv0.y = 1.0 - uv0.y;
		#endif
	}


// ===== shader 10 — 005-playcanvas-stable.min.js =====

attribute vec2 vertex_position;
varying vec2 vUv0;
void main(void)
{
	gl_Position = vec4(vertex_position, 0.5, 1.0);
	vUv0 = vertex_position.xy * 0.5 + 0.5;
}


// ===== shader 11 — 005-playcanvas-stable.min.js =====

	attribute vec2 aPosition;
	varying vec2 uv0;
	void main(void)
	{
		gl_Position = vec4(aPosition, 0.0, 1.0);
		uv0 = getImageEffectUV((aPosition.xy + 1.0) * 0.5);
	}


// ===== shader 12 — 005-playcanvas-stable.min.js =====

		varying vec4 color;
		void main(void) {
			gl_FragColor = vec4(gammaCorrectOutput(decodeGamma(color.rgb)), color.a);
		}


// ===== shader 13 — 005-playcanvas-stable.min.js =====

	attribute vec4 vertex_position;
	attribute vec4 vertex_color;
	uniform mat4 matrix_model;
	uniform mat4 matrix_viewProjection;
	varying vec4 color;
	void main(void) {
		color = vertex_color;
		gl_Position = matrix_viewProjection * matrix_model * vertex_position;
	}


// ===== shader 14 — 005-playcanvas-stable.min.js =====

	varying vec2 uv0;
	uniform sampler2DArray morphTexture;
	uniform highp float morphFactor[{MORPH_TEXTURE_MAX_COUNT}];
	uniform highp uint morphIndex[{MORPH_TEXTURE_MAX_COUNT}];
	uniform int count;
	#ifdef MORPH_INT
		uniform vec3 aabbSize;
		uniform vec3 aabbMin;
	#endif
	void main (void) {
		highp vec3 color = vec3(0, 0, 0);
		ivec2 pixelCoords = ivec2(uv0 * vec2(textureSize(morphTexture, 0).xy));
		
		for (int i = 0; i < count; i++) {
			uint textureIndex = morphIndex[i];
			vec3 delta = texelFetch(morphTexture, ivec3(pixelCoords, int(textureIndex)), 0).xyz;
			color += morphFactor[i] * delta;
		}
		#ifdef MORPH_INT
			color = (color - aabbMin) / aabbSize * 65535.0;
			gl_FragColor = uvec4(color, 1u);
		#else
			gl_FragColor = vec4(color, 1.0);
		#endif
	}


// ===== shader 15 — 005-playcanvas-stable.min.js =====

	attribute vec2 vertex_position;
	varying vec2 uv0;
	void main(void) {
		gl_Position = vec4(vertex_position, 0.5, 1.0);
		uv0 = vertex_position.xy * 0.5 + 0.5;
	}


// ===== shader 16 — 005-playcanvas-stable.min.js =====

varying vec2 vUv0;
uniform sampler2D source;
void main(void) {
	gl_FragColor = texture2D(source, vUv0);
}


// ===== shader 17 — 005-playcanvas-stable.min.js =====

vec3 modifySeams(vec3 dir, float scale) {
	vec3 adir = abs(dir);
	float M = max(max(adir.x, adir.y), adir.z);
	return dir / M * vec3(
		adir.x == M ? 1.0 : scale,
		adir.y == M ? 1.0 : scale,
		adir.z == M ? 1.0 : scale
	);
}
vec2 toSpherical(vec3 dir) {
	return vec2(dir.xz == vec2(0.0) ? 0.0 : atan(dir.x, dir.z), asin(dir.y));
}
vec3 fromSpherical(vec2 uv) {
	return vec3(cos(uv.y) * sin(uv.x),
				sin(uv.y),
				cos(uv.y) * cos(uv.x));
}
vec3 getDirectionEquirect() {
	return fromSpherical((vec2(vUv0.x, 1.0 - vUv0.y) * 2.0 - 1.0) * vec2(PI, PI * 0.5));
}
float signNotZero(float k){
	return(k >= 0.0) ? 1.0 : -1.0;
}
vec2 signNotZero(vec2 v) {
	return vec2(signNotZero(v.x), signNotZero(v.y));
}
vec3 octDecode(vec2 o) {
	vec3 v = vec3(o.x, 1.0 - abs(o.x) - abs(o.y), o.y);
	if (v.y < 0.0) {
		v.xz = (1.0 - abs(v.zx)) * signNotZero(v.xz);
	}
	return normalize(v);
}
vec3 getDirectionOctahedral() {
	return octDecode(vec2(vUv0.x, 1.0 - vUv0.y) * 2.0 - 1.0);
}
vec2 octEncode(in vec3 v) {
	float l1norm = abs(v.x) + abs(v.y) + abs(v.z);
	vec2 result = v.xz * (1.0 / l1norm);
	if (v.y < 0.0) {
		result = (1.0 - abs(result.yx)) * signNotZero(result.xy);
	}
	return result;
}
#ifdef CUBEMAP_SOURCE
	vec4 sampleCubemap(vec3 dir) {
		return textureCube(sourceCube, modifySeams(dir, 1.0));
	}
	vec4 sampleCubemap(vec2 sph) {
		return sampleCubemap(fromSpherical(sph));
	}
	vec4 sampleCubemap(vec3 dir, float mipLevel) {
		return textureCubeLod(sourceCube, modifySeams(dir, 1.0), mipLevel);
	}
	vec4 sampleCubemap(vec2 sph, float mipLevel) {
		return sampleCubemap(fromSpherical(sph), mipLevel);
	}
#else
	vec4 sampleEquirect(vec2 sph) {
		vec2 uv = sph / vec2(PI * 2.0, PI) + 0.5;
		return texture2D(sourceTex, vec2(uv.x, 1.0 - uv.y));
	}
	vec4 sampleEquirect(vec3 dir) {
		return sampleEquirect(toSpherical(dir));
	}
	vec4 sampleEquirect(vec2 sph, float mipLevel) {
		vec2 uv = sph / vec2(PI * 2.0, PI) + 0.5;
		return texture2DLod(sourceTex, vec2(uv.x, 1.0 - uv.y), mipLevel);
	}
	vec4 sampleEquirect(vec3 dir, float mipLevel) {
		return sampleEquirect(toSpherical(dir), mipLevel);
	}
	vec4 sampleOctahedral(vec3 dir) {
		vec2 uv = octEncode(dir) * 0.5 + 0.5;
		return texture2D(sourceTex, vec2(uv.x, 1.0 - uv.y));
	}
	vec4 sampleOctahedral(vec2 sph) {
		return sampleOctahedral(fromSpherical(sph));
	}
	vec4 sampleOctahedral(vec3 dir, float mipLevel) {
		vec2 uv = octEncode(dir) * 0.5 + 0.5;
		return texture2DLod(sourceTex, vec2(uv.x, 1.0 - uv.y), mipLevel);
	}
	vec4 sampleOctahedral(vec2 sph, float mipLevel) {
		return sampleOctahedral(fromSpherical(sph), mipLevel);
	}
#endif
vec3 getDirectionCubemap() {
	vec2 st = vUv0 * 2.0 - 1.0;
	float face = targetFace();
	vec3 vec;
	if (face == 0.0) {
		vec = vec3(1, -st.y, -st.x);
	} else if (face == 1.0) {
		vec = vec3(-1, -st.y, st.x);
	} else if (face == 2.0) {
		vec = vec3(st.x, 1, st.y);
	} else if (face == 3.0) {
		vec = vec3(st.x, -1, -st.y);
	} else if (face == 4.0) {
		vec = vec3(st.x, -st.y, 1);
	} else {
		vec = vec3(-st.x, -st.y, -1);
	}
	return normalize(modifySeams(vec, 1.0));
}
mat3 matrixFromVector(vec3 n) {
	float a = 1.0 / (1.0 + n.z);
	float b = -n.x * n.y * a;
	vec3 b1 = vec3(1.0 - n.x * n.x * a, b, -n.x);
	vec3 b2 = vec3(b, 1.0 - n.y * n.y * a, -n.y);
	return mat3(b1, b2, n);
}
mat3 matrixFromVectorSlow(vec3 n) {
	vec3 up = (1.0 - abs(n.y) <= 0.0000001) ? vec3(0.0, 0.0, n.y > 0.0 ? 1.0 : -1.0) : vec3(0.0, 1.0, 0.0);
	vec3 x = normalize(cross(up, n));
	vec3 y = cross(n, x);
	return mat3(x, y, n);
}
vec4 reproject() {
	if ({NUM_SAMPLES} <= 1) {
		return {ENCODE_FUNC}({DECODE_FUNC}({SOURCE_FUNC}({TARGET_FUNC}())));
	} else {
		vec3 t = {TARGET_FUNC}();
		vec3 tu = dFdx(t);
		vec3 tv = dFdy(t);
		vec3 result = vec3(0.0);
		for (float u = 0.0; u < {NUM_SAMPLES_SQRT}; ++u) {
			for (float v = 0.0; v < {NUM_SAMPLES_SQRT}; ++v) {
				result += {DECODE_FUNC}({SOURCE_FUNC}(normalize(t +
															tu * (u / {NUM_SAMPLES_SQRT} - 0.5) +
															tv * (v / {NUM_SAMPLES_SQRT} - 0.5))));
			}
		}
		return {ENCODE_FUNC}(result / ({NUM_SAMPLES_SQRT} * {NUM_SAMPLES_SQRT}));
	}
}
vec4 unpackFloat = vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0);
#ifdef USE_SAMPLES_TEX
	void unpackSample(int i, out vec3 L, out float mipLevel) {
		float u = (float(i * 4) + 0.5) * samplesTexInverseSize.x;
		float v = (floor(u) + 0.5) * samplesTexInverseSize.y;
		vec4 raw;
		raw.x = dot(texture2D(samplesTex, vec2(u, v)), unpackFloat); u += samplesTexInverseSize.x;
		raw.y = dot(texture2D(samplesTex, vec2(u, v)), unpackFloat); u += samplesTexInverseSize.x;
		raw.z = dot(texture2D(samplesTex, vec2(u, v)), unpackFloat); u += samplesTexInverseSize.x;
		raw.w = dot(texture2D(samplesTex, vec2(u, v)), unpackFloat);
		L.xyz = raw.xyz * 2.0 - 1.0;
		mipLevel = raw.w * 8.0;
	}
	vec4 prefilterSamples() {
		mat3 vecSpace = matrixFromVectorSlow({TARGET_FUNC}());
		vec3 L;
		float mipLevel;
		vec3 result = vec3(0.0);
		float totalWeight = 0.0;
		for (int i = 0; i < {NUM_SAMPLES}; ++i) {
			unpackSample(i, L, mipLevel);
			result += {DECODE_FUNC}({SOURCE_FUNC}(vecSpace * L, mipLevel)) * L.z;
			totalWeight += L.z;
		}
		return {ENCODE_FUNC}(result / totalWeight);
	}
	vec4 prefilterSamplesUnweighted() {
		mat3 vecSpace = matrixFromVectorSlow({TARGET_FUNC}());
		vec3 L;
		float mipLevel;
		vec3 result = vec3(0.0);
		float totalWeight = 0.0;
		for (int i = 0; i < {NUM_SAMPLES}; ++i) {
			unpackSample(i, L, mipLevel);
			result += {DECODE_FUNC}({SOURCE_FUNC}(vecSpace * L, mipLevel));
		}
		return {ENCODE_FUNC}(result / float({NUM_SAMPLES}));
	}
#endif
void main(void) {
	gl_FragColor = {PROCESS_FUNC}();
}


// ===== shader 18 — 005-playcanvas-stable.min.js =====

attribute vec2 vertex_position;
uniform vec4 uvMod;
varying vec2 vUv0;
void main(void) {
	gl_Position = vec4(vertex_position, 0.5, 1.0);
	vUv0 = getImageEffectUV((vertex_position.xy * 0.5 + 0.5) * uvMod.xy + uvMod.zw);
}


// ===== shader 19 — 005-playcanvas-stable.min.js =====

		uniform sampler2D texture_envAtlas;
		uniform float mipLevel;
	#endif
	void main(void) {
		#ifdef PREPASS_PASS
			gl_FragColor = float2vec4(vLinearDepth);
		#else
			#if defined(SKY_FISHEYE) && !defined(SKYMESH)
				vec2 ndc = vClipXYW.xy / vClipXYW.z;
				float px = ndc.x / fisheye_projMat00;
				float py = ndc.y / fisheye_projMat11;
				float r = sqrt(px * px + py * py);
				float theta = fisheye_k * atan(r * fisheye_invK);
				float sinT = sin(theta);
				float cosT = cos(theta);
				vec3 camDir = (r > 1e-6)
					? vec3(px / r * sinT, py / r * sinT, -cosT)
					: vec3(0.0, 0.0, -1.0);
				vec3 dir = transpose(mat3(matrix_view)) * camDir;
				dir = dir * cubeMapRotationMatrix;
			#elif defined(SKY_CUBEMAP) && defined(SKYMESH)
				vec3 envDir = normalize(vWorldPos - projectedSkydomeCenter);
				vec3 dir = envDir * cubeMapRotationMatrix;
			#else
				vec3 dir = vViewDir;
			#endif
			#ifdef SKY_CUBEMAP
				dir.x *= -1.0;
				vec3 linear = {SKYBOX_DECODE_FNC}(textureCube(texture_cubeMap, dir));
			#else
				dir *= vec3(-1.0, 1.0, 1.0);
				vec2 uv = toSphericalUv(normalize(dir));
				vec3 linear = {SKYBOX_DECODE_FNC}(texture2D(texture_envAtlas, mapRoughnessUv(uv, mipLevel)));
			#endif
			if (any(greaterThanEqual(linear, vec3(64.0)))) {
				linear *= skyboxHighlightMultiplier;
			}
			gl_FragColor = vec4(gammaCorrectOutput(toneMap(processEnvironment(linear))), 1.0);
			#if defined(SCENE_TEXTURE_DEPTH) && defined(SKYMESH)
				writeSceneTextureDepth(vLinearDepth, 1.0);
			#endif
		#endif
	}


// ===== shader 20 — 005-playcanvas-stable.min.js =====

attribute vec4 aPosition;
uniform mat4 matrix_view;
uniform mat4 matrix_projectionSkybox;
uniform mat3 cubeMapRotationMatrix;
varying vec3 vViewDir;
#ifdef SKY_FISHEYE
	varying vec3 vClipXYW;
	uniform float projectionFlipY;
#endif
#if defined(PREPASS_PASS) || (defined(SCENE_TEXTURE_DEPTH) && defined(SKYMESH))
	varying float vLinearDepth;
#endif
#ifdef SKYMESH
	uniform mat4 matrix_model;
	varying vec3 vWorldPos;
#endif
void main(void) {
	mat4 view = matrix_view;
	#ifdef SKYMESH
		vec4 worldPos = matrix_model * aPosition;
		vWorldPos = worldPos.xyz;
		gl_Position = matrix_projectionSkybox * (view * worldPos);
		#if defined(PREPASS_PASS) || defined(SCENE_TEXTURE_DEPTH)
			vLinearDepth = -(matrix_view * vec4(vWorldPos, 1.0)).z;
		#endif
	#else
		view[3][0] = view[3][1] = view[3][2] = 0.0;
		vViewDir = aPosition.xyz * cubeMapRotationMatrix;
		#ifdef SKY_FISHEYE
			vec4 viewPos = view * aPosition;
			vClipXYW = vec3(viewPos.xy, -viewPos.z);
			gl_Position = vec4(viewPos.x, viewPos.y * projectionFlipY, 0.0, -viewPos.z);
		#else
			gl_Position = matrix_projectionSkybox * (view * aPosition);
		#endif
		#ifdef PREPASS_PASS
			vLinearDepth = -gl_Position.w;
		#endif
	#endif
	gl_Position.z = gl_Position.w - 1.0e-7;
}


// ===== shader 21 — 005-playcanvas-stable.min.js =====

float normpdf3(in vec3 v, in float sigma) {
	return 0.39894 * exp(-0.5 * dot(v, v) / (sigma * sigma)) / sigma;
}
vec3 decodeRGBM(vec4 rgbm) {
	vec3 color = (8.0 * rgbm.a) * rgbm.rgb;
	return color * color;
}
float saturate(float x) {
	return clamp(x, 0.0, 1.0);
}
vec4 encodeRGBM(vec3 color) {
	vec4 encoded;
	encoded.rgb = pow(color.rgb, vec3(0.5));
	encoded.rgb *= 1.0 / 8.0;
	encoded.a = saturate( max( max( encoded.r, encoded.g ), max( encoded.b, 1.0 / 255.0 ) ) );
	encoded.a = ceil(encoded.a * 255.0) / 255.0;
	encoded.rgb /= encoded.a;
	return encoded;
}
vec3 decode(vec4 pixel) {
	#if HDR
		return pixel.rgb;
	#else
		return decodeRGBM(pixel);
	#endif
}
bool isUsed(vec4 pixel) {
	#if HDR
		return any(greaterThan(pixel.rgb, vec3(0.0)));
	#else
		return pixel.a > 0.0;
	#endif
}
varying vec2 vUv0;
uniform sampler2D source;
uniform vec2 pixelOffset;
uniform vec2 sigmas;
uniform float bZnorm;
uniform float kernel[{MSIZE}];
void main(void) {
	
	vec4 pixel = texture2DLod(source, vUv0, 0.0);
	if (!isUsed(pixel)) {
		gl_FragColor = pixel;
		return ;
	}
	float sigma = sigmas.x;
	float bSigma = sigmas.y;
	vec3 pixelHdr = decode(pixel);
	vec3 accumulatedHdr = vec3(0.0);
	float accumulatedFactor = 0.000001;
	const int kSize = ({MSIZE} - 1) / 2;
	for (int i = -kSize; i <= kSize; ++i) {
		for (int j = -kSize; j <= kSize; ++j) {
			
			vec2 coord = vUv0 + vec2(float(i), float(j)) * pixelOffset;
			vec4 pix = texture2DLod(source, coord, 0.0);
			if (isUsed(pix)) {
				vec3 hdr = decode(pix);
				float factor = kernel[kSize + j] * kernel[kSize + i];
				factor *= normpdf3(hdr - pixelHdr, bSigma) * bZnorm;
				accumulatedHdr += factor * hdr;
				accumulatedFactor += factor;
			}
		}
	}
	vec3 finalHDR = accumulatedHdr / accumulatedFactor;
	#if HDR
		gl_FragColor = vec4(finalHDR, 1.0);
	#else
		gl_FragColor = encodeRGBM(finalHDR);
	#endif
}


// ===== shader 22 — 005-playcanvas-stable.min.js =====

varying vec2 vUv0;
uniform sampler2D source;
uniform vec2 pixelOffset;
bool isUsed(vec4 pixel) {
	#if HDR
		return any(greaterThan(pixel.rgb, vec3(0.0)));
	#else
		return pixel.a > 0.0;
	#endif
}
void main(void) {
	vec4 c = texture2DLod(source, vUv0, 0.0);
	c = isUsed(c) ? c : texture2DLod(source, vUv0 - pixelOffset, 0.0);
	c = isUsed(c) ? c : texture2DLod(source, vUv0 + vec2(0, -pixelOffset.y), 0.0);
	c = isUsed(c) ? c : texture2DLod(source, vUv0 + vec2(pixelOffset.x, -pixelOffset.y), 0.0);
	c = isUsed(c) ? c : texture2DLod(source, vUv0 + vec2(-pixelOffset.x, 0), 0.0);
	c = isUsed(c) ? c : texture2DLod(source, vUv0 + vec2(pixelOffset.x, 0), 0.0);
	c = isUsed(c) ? c : texture2DLod(source, vUv0 + vec2(-pixelOffset.x, pixelOffset.y), 0.0);
	c = isUsed(c) ? c : texture2DLod(source, vUv0 + vec2(0, pixelOffset.y), 0.0);
	c = isUsed(c) ? c : texture2DLod(source, vUv0 + pixelOffset, 0.0);
	gl_FragColor = c;
}


// ===== shader 23 — 005-playcanvas-stable.min.js =====

varying vec4 texCoordsAlphaLife;
uniform sampler2D colorMap;
uniform sampler2D colorParam;
uniform float graphSampleSize;
uniform float graphNumSamples;
#ifndef CAMERAPLANES
	#define CAMERAPLANES
	uniform vec4 camera_params;
#endif
#ifdef SOFT
	uniform float softening;
#endif
uniform float colorMult;
float saturate(float x) {
	return clamp(x, 0.0, 1.0);
}
void main(void) {
	vec4 tex  = texture2D(colorMap, vec2(texCoordsAlphaLife.x, 1.0 - texCoordsAlphaLife.y));
	vec4 ramp = texture2D(colorParam, vec2(texCoordsAlphaLife.w, 0.0));
	ramp.rgb *= colorMult;
	ramp.a += texCoordsAlphaLife.z;
	vec3 rgb = tex.rgb * ramp.rgb;
	float a  = tex.a * ramp.a;


// ===== shader 24 — 005-playcanvas-stable.min.js =====

vec3 unpack3NFloats(float src) {
	float r = fract(src);
	float g = fract(src * 256.0);
	float b = fract(src * 65536.0);
	return vec3(r, g, b);
}
float saturate(float x) {
	return clamp(x, 0.0, 1.0);
}
vec4 tex1Dlod_lerp(TEXTURE_ACCEPT_HIGHP(tex), vec2 tc) {
	return mix( texture2D(tex,tc), texture2D(tex,tc + graphSampleSize), fract(tc.x*graphNumSamples) );
}
vec4 tex1Dlod_lerp(TEXTURE_ACCEPT_HIGHP(tex), vec2 tc, out vec3 w) {
	vec4 a = texture2D(tex,tc);
	vec4 b = texture2D(tex,tc + graphSampleSize);
	float c = fract(tc.x*graphNumSamples);
	vec3 unpackedA = unpack3NFloats(a.w);
	vec3 unpackedB = unpack3NFloats(b.w);
	w = mix(unpackedA, unpackedB, c);
	return mix(a, b, c);
}
vec2 rotate(vec2 quadXY, float pRotation, out mat2 rotMatrix) {
	float c = cos(pRotation);
	float s = sin(pRotation);
	mat2 m = mat2(c, -s, s, c);
	rotMatrix = m;
	return m * quadXY;
}
vec3 billboard(vec3 InstanceCoords, vec2 quadXY) {
	#ifdef SCREEN_SPACE
		vec3 pos = vec3(-1, 0, 0) * quadXY.x + vec3(0, -1, 0) * quadXY.y;
	#else
		vec3 pos = -matrix_viewInverse[0].xyz * quadXY.x + -matrix_viewInverse[1].xyz * quadXY.y;
	#endif
	return pos;
}
vec3 customFace(vec3 InstanceCoords, vec2 quadXY) {
	vec3 pos = faceTangent * quadXY.x + faceBinorm * quadXY.y;
	return pos;
}
vec2 safeNormalize(vec2 v) {
	float l = length(v);
	return (l > 1e-06) ? v / l : v;
}
void main(void) {
	vec3 meshLocalPos = particle_vertexData.xyz;
	float id = floor(particle_vertexData.w);
	float rndFactor = fract(sin(id + 1.0 + seed));
	vec3 rndFactor3 = vec3(rndFactor, fract(rndFactor*10.0), fract(rndFactor*100.0));
	float uv = id / numParticlesPot;
	readInput(uv);
#ifdef LOCAL_SPACE
	inVel = mat3(matrix_model) * inVel;
#endif
	vec2 velocityV = safeNormalize((mat3(matrix_view) * inVel).xy);
#ifdef SCREEN_SPACE
	velocityV.x *= viewport_size.x * viewport_size.w;
	velocityV = safeNormalize(velocityV);
#endif
	float particleLifetime = lifetime;
	if (inLife <= 0.0 || inLife > particleLifetime || !inShow)
		meshLocalPos = vec3(0.0);
	vec2 quadXY = meshLocalPos.xy;
	float nlife = clamp(inLife / particleLifetime, 0.0, 1.0);
	vec3 paramDiv;
	vec4 params = tex1Dlod_lerp(TEXTURE_PASS(internalTex2), vec2(nlife, 0), paramDiv);
	float scale = params.y;
	float scaleDiv = paramDiv.x;
	float alphaDiv = paramDiv.z;
	scale += (scaleDiv * 2.0 - 1.0) * scaleDivMult * fract(rndFactor*10000.0);
#ifndef USE_MESH
	texCoordsAlphaLife = vec4(quadXY * -0.5 + 0.5, (alphaDiv * 2.0 - 1.0) * alphaDivMult * fract(rndFactor*1000.0), nlife);
#else
	texCoordsAlphaLife = vec4(particle_uv, (alphaDiv * 2.0 - 1.0) * alphaDivMult * fract(rndFactor*1000.0), nlife);
#endif
	vec3 particlePos = inPos;
	vec3 particlePosMoved = vec3(0.0);
	mat2 rotMatrix;


// ===== shader 25 — 005-playcanvas-stable.min.js =====

float saturate(float x) {
	return clamp(x, 0.0, 1.0);
}
vec3 unpack3NFloats(float src) {
	float r = fract(src);
	float g = fract(src * 256.0);
	float b = fract(src * 65536.0);
	return vec3(r, g, b);
}
vec3 tex1Dlod_lerp(TEXTURE_ACCEPT_HIGHP(tex), vec2 tc, out vec3 w) {
	vec4 a = texture2D(tex, tc);
	vec4 b = texture2D(tex, tc + graphSampleSize);
	float c = fract(tc.x * graphNumSamples);
	vec3 unpackedA = unpack3NFloats(a.w);
	vec3 unpackedB = unpack3NFloats(b.w);
	w = mix(unpackedA, unpackedB, c);
	return mix(a.xyz, b.xyz, c);
}
#define HASHSCALE4 vec4(1031, .1030, .0973, .1099)
vec4 hash41(float p) {
	vec4 p4 = fract(vec4(p) * HASHSCALE4);
	p4 += dot(p4, p4.wzxy+19.19);
	return fract(vec4((p4.x + p4.y)*p4.z, (p4.x + p4.z)*p4.y, (p4.y + p4.z)*p4.w, (p4.z + p4.w)*p4.x));
}
void main(void) {
	if (gl_FragCoord.x > numParticles) discard;
	readInput(vUv0.x);
	visMode = inShow? 1.0 : -1.0;
	vec4 rndFactor = hash41(gl_FragCoord.x + seed);
	float particleRate = rate + rateDiv * rndFactor.x;
	outLife = inLife + delta;
	float nlife = clamp(outLife / lifetime, 0.0, 1.0);
	vec3 localVelocityDiv;
	vec3 velocityDiv;
	vec3 paramDiv;
	vec3 localVelocity = tex1Dlod_lerp(TEXTURE_PASS(internalTex0), vec2(nlife, 0), localVelocityDiv);
	vec3 velocity =	  tex1Dlod_lerp(TEXTURE_PASS(internalTex1), vec2(nlife, 0), velocityDiv);
	vec3 params =		tex1Dlod_lerp(TEXTURE_PASS(internalTex2), vec2(nlife, 0), paramDiv);
	float rotSpeed = params.x;
	float rotSpeedDiv = paramDiv.y;
	vec3 radialParams = tex1Dlod_lerp(TEXTURE_PASS(internalTex3), vec2(nlife, 0), paramDiv);
	float radialSpeed = radialParams.x;
	float radialSpeedDiv = radialParams.y;
	bool respawn = inLife <= 0.0 || outLife >= lifetime;
	inPos = respawn ? calcSpawnPosition(rndFactor.xyz, rndFactor.x) : inPos;
	inAngle = respawn ? mix(startAngle, startAngle2, rndFactor.x) : inAngle;
#ifndef LOCAL_SPACE
	vec3 radialVel = inPos - emitterPos;
#else
	vec3 radialVel = inPos;
#endif
	radialVel = (dot(radialVel, radialVel) > 1.0E-8) ? radialSpeed * normalize(radialVel) : vec3(0.0);
	radialVel += (radialSpeedDiv * vec3(2.0) - vec3(1.0)) * radialSpeedDivMult * rndFactor.xyz;
	localVelocity +=	(localVelocityDiv * vec3(2.0) - vec3(1.0)) * localVelocityDivMult * rndFactor.xyz;
	velocity +=		 (velocityDiv * vec3(2.0) - vec3(1.0)) * velocityDivMult * rndFactor.xyz;
	rotSpeed +=		 (rotSpeedDiv * 2.0 - 1.0) * rotSpeedDivMult * rndFactor.y;
	addInitialVelocity(localVelocity, rndFactor.xyz);
#ifndef LOCAL_SPACE
	outVel = emitterMatrix * localVelocity + (radialVel + velocity) * emitterScale;
#else
	outVel = (localVelocity + radialVel) / emitterScale + emitterMatrixInv * velocity;
#endif
	outPos = inPos + outVel * delta;
	outAngle = inAngle + rotSpeed * delta;


// ===== shader 26 — 005-playcanvas-stable.min.js =====

attribute vec4 particle_vertexData;
attribute vec4 particle_vertexData2;
attribute vec4 particle_vertexData3;
attribute float particle_vertexData4;
#ifndef USE_MESH
	attribute vec2 particle_vertexData5;
#else
	attribute vec4 particle_vertexData5;
#endif
uniform mat4 matrix_viewProjection;
uniform mat4 matrix_model;
#ifndef VIEWMATRIX
	#define VIEWMATRIX
	uniform mat4 matrix_view;
#endif
uniform mat3 matrix_normal;
uniform mat4 matrix_viewInverse;
uniform float numParticles;
uniform float lifetime;
uniform float stretch;
uniform float seed;
uniform vec3 emitterScale;
uniform vec3 faceTangent;
uniform vec3 faceBinorm;
#ifdef PARTICLE_GPU
	#ifdef WRAP
		uniform vec3 wrapBounds;
	#endif
#endif
#ifdef PARTICLE_GPU
	uniform highp sampler2D internalTex0;
	uniform highp sampler2D internalTex1;
	uniform highp sampler2D internalTex2;
#endif
uniform vec3 emitterPos;
varying vec4 texCoordsAlphaLife;
vec2 rotate(vec2 quadXY, float pRotation, out mat2 rotMatrix)
{
	float c = cos(pRotation);
	float s = sin(pRotation);
	mat2 m = mat2(c, -s, s, c);
	rotMatrix = m;
	return m * quadXY;
}
vec3 billboard(vec3 InstanceCoords, vec2 quadXY)
{
	#ifdef SCREEN_SPACE
		vec3 pos = vec3(-1, 0, 0) * quadXY.x + vec3(0, -1, 0) * quadXY.y;
	#else
		vec3 pos = -matrix_viewInverse[0].xyz * quadXY.x + -matrix_viewInverse[1].xyz * quadXY.y;
	#endif
	return pos;
}
vec3 customFace(vec3 InstanceCoords, vec2 quadXY)
{
	vec3 pos = faceTangent * quadXY.x + faceBinorm * quadXY.y;
	return pos;
}
void main(void)
{
	vec3 particlePos = particle_vertexData.xyz;
	vec3 inPos = particlePos;
	vec3 vertPos = particle_vertexData3.xyz;
	vec3 inVel = vec3(particle_vertexData2.w, particle_vertexData3.w, particle_vertexData5.x);
	float id = floor(particle_vertexData4);
	float rndFactor = fract(sin(id + 1.0 + seed));
	vec3 rndFactor3 = vec3(rndFactor, fract(rndFactor*10.0), fract(rndFactor*100.0));
#ifdef LOCAL_SPACE
	inVel = mat3(matrix_model) * inVel;
#endif
	vec2 velocityV = normalize((mat3(matrix_view) * inVel).xy);
#ifdef SCREEN_SPACE
	velocityV.x *= viewport_size.x * viewport_size.w;
	velocityV = normalize(velocityV);
#endif
	vec2 quadXY = vertPos.xy;
#ifdef USE_MESH
	texCoordsAlphaLife = vec4(particle_vertexData5.zw, particle_vertexData2.z, particle_vertexData.w);
#else
	texCoordsAlphaLife = vec4(quadXY * -0.5 + 0.5, particle_vertexData2.z, particle_vertexData.w);
#endif
	mat2 rotMatrix;
	float inAngle = particle_vertexData2.x;
	vec3 particlePosMoved = vec3(0.0);
	vec3 meshLocalPos = particle_vertexData3.xyz;


// ===== shader 27 — 005-playcanvas-stable.min.js =====

flat varying ivec4 vSubDraw;
uniform vec3 uColorMultiply;
#if SH_BANDS > 0
	uniform uint uCameraOrtho;
#endif
#ifdef GSPLAT_ID
	uniform uint uId;
#endif
void main(void) {
	int localRow = int(gl_FragCoord.y) - vSubDraw.w;
	int localCol = int(gl_FragCoord.x) - vSubDraw.y;
	uint originalIndex = uint(vSubDraw.x + localRow * vSubDraw.z + localCol);
	setSplat(originalIndex);
	vec3 worldCenter;
	vec4 worldRotation = vec4(0.0, 0.0, 0.0, 1.0);
	vec3 worldScale = vec3(1.0);
	#if SH_BANDS > 0
		vec3 dir;
	#endif
	#ifdef GSPLAT_WORKBUFFER_GEOMETRY
		initWorkBufferGeometry(ivec2(gl_FragCoord.xy));
		worldCenter = workBufferWorldCenter();
		#if SH_BANDS > 0
			vec3 viewDir = uCameraOrtho != 0u ? vec3(0.0, 0.0, -1.0) * mat3(matrix_view) : worldCenter - uCameraPosition;
			dir = normalize(quatRotateInv(model_rotation, viewDir));
		#endif
	#else
		vec3 modelCenter = getCenter();
		worldCenter = (matrix_model * vec4(modelCenter, 1.0)).xyz;
		SplatCenter center;
		initCenter(modelCenter, center);
		vec4 srcRotation = getRotation().yzwx;
		vec3 srcScale = getScale();
		worldRotation = quatMul(model_rotation, srcRotation);
		if (worldRotation.w < 0.0) {
			worldRotation = -worldRotation;
		}
		worldScale = model_scale * srcScale;
		vec3 originalCenter = worldCenter;
		modifySplatCenter(worldCenter);
		modifySplatRotationScale(originalCenter, worldCenter, worldRotation, worldScale);
		#if SH_BANDS > 0
			vec3 viewDir = uCameraOrtho != 0u ? vec3(0.0, 0.0, -1.0) : center.view;
			dir = normalize(viewDir * mat3(center.modelView));
		#endif
	#endif
	vec4 color = getColor();
	#if SH_BANDS > 0
		vec3 sh[SH_COEFFS];
		float scale;
		readSHData(sh, scale);
		color.xyz += evalSH(sh, dir) * scale;
	#endif
	modifySplatColor(worldCenter, color);
	color.xyz *= uColorMultiply;
	writeSplat(worldCenter, worldRotation, worldScale, color);
	#ifdef GSPLAT_ID
		writePcId(uvec4(uId, 0u, 0u, 0u));
	#endif
}


// ===== shader 28 — 005-playcanvas-stable.min.js =====

attribute vec2 vertex_position;
precision highp usampler2D;
uniform usampler2D uSubDrawData;
uniform ivec2 uTextureSize;
uniform int uSubDrawBase;
flat varying ivec4 vSubDraw;
void main(void) {
	int subDrawWidth = textureSize(uSubDrawData, 0).x;
	int idx = gl_InstanceID + uSubDrawBase;
	uvec4 data = texelFetch(uSubDrawData, ivec2(idx % subDrawWidth, idx / subDrawWidth), 0);
	int rowStart = int(data.r & 0xFFFFu);
	int numRows = int(data.r >> 16u);
	int colStart = int(data.g);
	int colEnd = int(data.b);
	int sourceBase = int(data.a);
	float u = float(gl_VertexID & 1);
	float v = float(gl_VertexID >> 1);
	vec4 ndc = vec4(colStart, colEnd, rowStart, rowStart + numRows) / vec4(uTextureSize.x, uTextureSize.x, uTextureSize.y, uTextureSize.y) * 2.0 - 1.0;
	gl_Position = vec4(mix(ndc.x, ndc.y, u), mix(ndc.z, ndc.w, v), 0.5, 1.0);
	vSubDraw = ivec4(sourceBase, colStart, colEnd - colStart, rowStart);
}


// ===== shader 29 — 005-playcanvas-stable.min.js =====

const float EXP4 = exp(-4.0);
const float INV_EXP4 = 1.0 / (1.0 - EXP4);
float normExp(float x) {
	return (exp(x * -4.0) - EXP4) * INV_EXP4;
}
void main(void) {
	mediump float A = dot(gaussianUV, gaussianUV);
	if (A > 1.0) {
		discard;
	}
	mediump float alpha = normExp(A) * gaussianColor.a;
	#if defined(SHADOW_PASS) || defined(PICK_PASS) || defined(PREPASS_PASS)
		if (alpha < alphaClip) {
			discard;
		}
	#endif
	#ifdef PICK_PASS
		#ifdef GSPLAT_UNIFIED_ID
			pcFragColor0 = encodePickOutput(vPickId);
		#else
			pcFragColor0 = getPickOutput();
		#endif
		#ifdef DEPTH_PICK_PASS
			pcFragColor1 = getPickDepth();
		#endif
	#elif SHADOW_PASS
		gl_FragColor = getShadowOutput();
	#elif PREPASS_PASS
		gl_FragColor = float2vec4(vLinearDepth);
	#else
		if (alpha < alphaClipForward) {
			discard;
		}
		vec4 fragColor = vec4(gaussianColor.xyz, alpha);
		modifySplatColor(gaussianUV, fragColor);
		#ifndef DITHER_NONE
			opacityDither(fragColor.a, id * 0.013);
		#endif
		gl_FragColor = vec4(fragColor.xyz * fragColor.a, fragColor.a);
		#ifdef SCENE_TEXTURE_DEPTH
			#ifdef DITHER_NONE
				writeSceneTextureDepth(vLinearDepth, fragColor.a);
			#else
				writeSceneTextureDepth(vLinearDepth, 1.0);
			#endif
		#endif
	#endif
}


// ===== shader 30 — 005-playcanvas-stable.min.js =====

varying mediump vec2 gaussianUV;
flat varying mediump vec4 gaussianColor;
#ifndef DITHER_NONE
	flat varying float id;
#endif
mediump vec4 discardVec = vec4(0.0, 0.0, 2.0, 1.0);
#if defined(PREPASS_PASS) || defined(SCENE_TEXTURE_DEPTH)
	flat varying float vLinearDepth;
#endif
#if defined(GSPLAT_UNIFIED_ID) && defined(PICK_PASS)
	flat varying uint vPickId;
#endif
#ifdef GSPLAT_OVERDRAW
	uniform sampler2D colorRamp;
	uniform float colorRampIntensity;
#endif
void main(void) {
	SplatSource source;
	if (!initSource(source)) {
		gl_Position = discardVec;
		return;
	}
	vec3 modelCenter = getCenter();
	SplatCenter center;
	center.modelCenterOriginal = modelCenter;
	
	modifySplatCenter(modelCenter);
	center.modelCenterModified = modelCenter;
	if (!initCenter(modelCenter, center)) {
		gl_Position = discardVec;
		return;
	}
	SplatCorner corner;
	if (!initCorner(source, center, corner)) {
		gl_Position = discardVec;
		return;
	}
	#ifdef GSPLAT_SEPARATE_OPACITY
		float opacity = getOpacity();
		vec4 clr = vec4(getColor(), opacity);
	#else
		vec4 clr = getColor();
	#endif
	#if GSPLAT_AA
		clr.a *= corner.aaFactor;
	#endif
	#if SH_BANDS > 0
		vec3 viewDir = camera_params.w == 1.0 ? vec3(0.0, 0.0, -1.0) : center.view;
		vec3 dir = normalize(viewDir * mat3(center.modelView));
		vec3 sh[SH_COEFFS];
		float scale;
		readSHData(sh, scale);
		clr.xyz += evalSH(sh, dir) * scale;
	#endif
	modifySplatColor(modelCenter, clr);
	#if defined(SHADOW_PASS) || defined(PICK_PASS) || defined(PREPASS_PASS)
		float alphaClipValue = alphaClip;
	#else
		float alphaClipValue = alphaClipForward;
	#endif
	if (clr.w <= alphaClipValue) {
		gl_Position = discardVec;
		return;
	}
	clipCorner(corner, clr.w);
	#if GSPLAT_2DGS
		vec3 modelCorner = center.modelCenterModified + corner.offset;
		gl_Position = matrix_projection * center.modelView * vec4(modelCorner, 1.0);
	#else
		gl_Position = center.proj + vec4(corner.offset.xyz, 0);
	#endif
	gaussianUV = corner.uv;
	#ifdef GSPLAT_OVERDRAW
		float t = clamp(modelCenter.y / 20.0, 0.0, 1.0);
		vec3 rampColor = textureLod(colorRamp, vec2(t, 0.5), 0.0).rgb;
		clr.a *= (1.0 / 32.0) * colorRampIntensity;
		gaussianColor = vec4(rampColor, clr.a);
	#else
		gaussianColor = vec4(prepareOutputFromGamma(max(clr.xyz, 0.0), -center.view.z), clr.w);
	#endif
	#ifndef DITHER_NONE
		id = float(splat.index);
	#endif
	#if defined(PREPASS_PASS) || defined(SCENE_TEXTURE_DEPTH)
		vLinearDepth = -center.view.z;
	#endif
	#if defined(GSPLAT_UNIFIED_ID) && defined(PICK_PASS)
		vPickId = loadPcId().r;
	#endif
}


// ===== shader 31 — 005-playcanvas-stable.min.js =====

	uniform vec4 uDepthReadRect;
	uniform vec2 uDepthReadGrid;
	uniform float uDepthReadFar;
	uniform float uDepthReadEmpty;
	void main() {
		vec2 cell = (floor(gl_FragCoord.xy) + 0.5) / uDepthReadGrid;
		vec2 uv = getImageEffectUV(uDepthReadRect.xy + cell * uDepthReadRect.zw);
		vec2 size = vec2(textureSize(uSceneDepthMap, 0));
		uv = (floor(uv * size) + 0.5) / size;
		float depth = getLinearScreenDepth(uv);
		gl_FragColor = float2uint(depth >= uDepthReadFar ? uDepthReadEmpty : depth);
	}


// ===== shader 32 — 005-playcanvas-stable.min.js =====

	attribute vec3 vertex_position;
	attribute vec4 vertex_texCoord0;
	attribute vec4 vertex_color;
	varying vec4 uv0;
	varying vec4 color;
	varying float mode;
	void main(void) {
		gl_Position = vec4(vertex_position.xy * 2.0 - 1.0, 0.5, 1.0);
		uv0 = vertex_texCoord0;
		color = vertex_color;
		mode = vertex_position.z;
	}


// ===== shader 33 — 005-playcanvas-stable.min.js =====

	varying vec4 uv0;
	varying vec4 color;
	varying float mode;
	uniform vec4 clr;
	uniform sampler2D graphTex;
	uniform sampler2D wordsTex;
	void main(void) {
		float alpha = 1.0;
		if (mode > 1.5) {
			vec4 sampleValue = texture2D(graphTex, uv0.xy);
			float fill = step(uv0.w, sampleValue.r) * 0.18;
			float edge = (1.0 - step(uv0.z, abs(uv0.w - sampleValue.r))) * 0.60;
			float budget = (1.0 - step(uv0.z * 0.5, abs(uv0.w - sampleValue.a))) * 0.16;
			alpha = max(fill, max(edge, budget)) * step(0.001, sampleValue.a);
		} else if (mode > 0.5) {
			alpha = texture2D(wordsTex, vec2(uv0.x, 1.0 - uv0.y)).a;
		}
		gl_FragColor = vec4(color.rgb, color.a * alpha) * clr;
	}


// ===== shader 34 — 005-playcanvas-stable.min.js =====

	varying vec2 vUv0;
	uniform vec2 uOffset;
	uniform float uSrcMultiplier;
	uniform sampler2D source;
	void main(void)
	{
		vec4 pixel;
		vec4 texel = texture2D(source, vUv0);
		vec4 firstTexel = texel;
		float diff = texel.a * uSrcMultiplier;
		pixel = texture2D(source, vUv0 + uOffset * -2.0);
		texel = max(texel, pixel);
		diff = max(diff, length(firstTexel.rgb - pixel.rgb));
		pixel = texture2D(source, vUv0 + uOffset * -1.0);
		texel = max(texel, pixel);
		diff = max(diff, length(firstTexel.rgb - pixel.rgb));
		pixel = texture2D(source, vUv0 + uOffset * 1.0);
		texel = max(texel, pixel);
		diff = max(diff, length(firstTexel.rgb - pixel.rgb));
		pixel = texture2D(source, vUv0 + uOffset * 2.0);
		texel = max(texel, pixel);
		diff = max(diff, length(firstTexel.rgb - pixel.rgb));
	   gl_FragColor = vec4(texel.rgb, min(diff, 1.0));
	}


// ===== shader 35 — 005-playcanvas-stable.min.js =====

	attribute vec2 vertex_position;
	uniform mat4 matrix_model;
	uniform float projectionFlipY;
	varying vec2 uv0;
	void main(void) {
		gl_Position = matrix_model * vec4(vertex_position, 0.0, 1.0);
		gl_Position.y *= projectionFlipY;
		uv0 = vertex_position + 0.5;
	}


// ===== shader 36 — 005-playcanvas-stable.min.js =====

			varying vec2 uv0;
			uniform float projectionFlipY;
			void main(void) {
				vec2 uv = vec2(uv0.x, 0.5 - (uv0.y - 0.5) * projectionFlipY);
				float depth = getLinearScreenDepth(getImageEffectUV(uv)) * camera_params.x;
				gl_FragColor = vec4(gammaCorrectOutput(vec3(depth)), 1.0);
			}
		

// ===== shader 37 — 005-playcanvas-stable.min.js =====

	attribute vec3 vertex_position;
	attribute vec4 instance_prevWidth;
	attribute vec4 instance_startWidth;
	attribute vec4 instance_endDistance;
	attribute vec4 instance_nextDistance;
	attribute vec3 instance_startColor;
	attribute vec3 instance_endColor;
	attribute vec4 instance_style;
	attribute vec4 instance_dashFlags;
	uniform mat4 matrix_viewProjection;
	uniform vec4 screen_size;
	#ifdef WIDE_LINE_WORLD_SPACE_WIDTH
		uniform mat4 matrix_projection;
	#endif
	varying vec3 vColor;
	varying vec4 vDash;
	varying vec3 vLineData;
	varying float vDistance;
	vec2 safeNormalize(vec2 value, vec2 fallbackValue) {
		float lengthValue = length(value);
		return lengthValue > 0.00001 ? value / lengthValue : fallbackValue;
	}
	vec2 perpendicular(vec2 value) {
		return vec2(-value.y, value.x);
	}
	vec2 toScreen(vec4 clipPosition) {
		float w = abs(clipPosition.w) > 0.00001 ? clipPosition.w : 0.00001;
		return clipPosition.xy / w * screen_size.xy * 0.5;
	}
	vec4 offsetClip(vec4 clipPosition, vec2 pixelOffset) {
		clipPosition.xy += pixelOffset * (2.0 * screen_size.zw) * clipPosition.w;
		return clipPosition;
	}
	float resolveHalfWidth(float width, vec4 clipPosition) {
		#ifdef WIDE_LINE_WORLD_SPACE_WIDTH
			float pixelsPerWorldUnit = abs(matrix_projection[1][1]) * screen_size.y * 0.5 /
				max(abs(clipPosition.w), 0.00001);
			return width * 0.5 * pixelsPerWorldUnit;
		#else
			return width * 0.5;
		#endif
	}
	vec2 miterOffset(vec2 firstDirection, vec2 secondDirection, float side, float halfWidth) {
		vec2 secondNormal = perpendicular(secondDirection);
		vec2 miter = safeNormalize(perpendicular(firstDirection) + secondNormal, secondNormal);
		float scale = halfWidth / max(dot(miter, secondNormal), 0.25);
		return miter * side * min(scale, halfWidth * 4.0);
	}
	void main(void) {
		vec3 prev = instance_prevWidth.xyz;
		vec3 start = instance_startWidth.xyz;
		vec3 end = instance_endDistance.xyz;
		vec3 next = instance_nextDistance.xyz;
		float startDistance = instance_endDistance.w;
		float endDistance = instance_nextDistance.w;
		vec4 prevClip = matrix_viewProjection * vec4(prev, 1.0);
		vec4 startClip = matrix_viewProjection * vec4(start, 1.0);
		vec4 endClip = matrix_viewProjection * vec4(end, 1.0);
		vec4 nextClip = matrix_viewProjection * vec4(next, 1.0);
		float startHalfWidth = resolveHalfWidth(instance_prevWidth.w, startClip);
		float endHalfWidth = resolveHalfWidth(instance_startWidth.w, endClip);
		vec2 startScreen = toScreen(startClip);
		vec2 endScreen = toScreen(endClip);
		vec2 currentDirection = safeNormalize(endScreen - startScreen, vec2(1.0, 0.0));
		vec2 previousDirection = safeNormalize(startScreen - toScreen(prevClip), currentDirection);
		vec2 nextDirection = safeNormalize(toScreen(nextClip) - endScreen, currentDirection);
		vec2 currentNormal = perpendicular(currentDirection);
		vec2 previousNormal = perpendicular(previousDirection);
		float joinStyle = instance_style.x;
		float capStyle = instance_style.y;
		uint flags = uint(instance_dashFlags.y + 0.5);
		bool startConnected = (flags & 1u) != 0u;
		bool endConnected = (flags & 2u) != 0u;
		float kind = vertex_position.z;
		vec4 clipPosition;
		vLineData = vec3(0.0, startHalfWidth, 0.0);
		if (kind < 0.5) {
			float along = vertex_position.x;
			float side = vertex_position.y;
			bool atStart = along < 0.5;
			float halfWidth = atStart ? startHalfWidth : endHalfWidth;
			vec2 offset;
			if (atStart) {
				if (startConnected && joinStyle < 0.5) {
					offset = miterOffset(previousDirection, currentDirection, side, halfWidth);
				} else {
					offset = currentNormal * side * halfWidth;
					if (!startConnected && capStyle > 0.5 && capStyle < 1.5) {
						offset -= currentDirection * halfWidth;
					}
				}
				clipPosition = offsetClip(startClip, offset);
			} else {
				if (endConnected && joinStyle < 0.5) {
					offset = miterOffset(currentDirection, nextDirection, side, halfWidth);
				} else {
					offset = currentNormal * side * halfWidth;
					if (!endConnected && capStyle > 0.5 && capStyle < 1.5) {
						offset += currentDirection * halfWidth;
					}
				}
				clipPosition = offsetClip(endClip, offset);
			}
			vColor = mix(instance_startColor, instance_endColor, along);
			vDistance = mix(startDistance, endDistance, along);
			vLineData = vec3(side, mix(startHalfWidth, endHalfWidth, along), 1.0);
		} else if (kind < 1.5) {
			bool visible = (startConnected && joinStyle > 1.5) || (!startConnected && capStyle > 1.5);
			float scale = visible ? startHalfWidth : 0.0;
			vec2 offset = (currentDirection * vertex_position.x + currentNormal * vertex_position.y) * scale;
			clipPosition = offsetClip(startClip, offset);
			vColor = instance_startColor;
			vDistance = startDistance;
		} else if (kind < 2.5) {
			bool visible = !endConnected && capStyle > 1.5;
			float scale = visible ? endHalfWidth : 0.0;
			vec2 offset = (currentDirection * vertex_position.x + currentNormal * vertex_position.y) * scale;
			clipPosition = offsetClip(endClip, offset);
			vColor = instance_endColor;
			vDistance = endDistance;
		} else {
			bool visible = startConnected && joinStyle > 0.5 && joinStyle < 1.5;
			float scale = visible ? startHalfWidth : 0.0;
			vec2 offset = vec2(0.0);
			if (kind > 3.5 && kind < 4.5) {
				offset = previousNormal * vertex_position.y * scale;
			} else if (kind > 4.5) {
				offset = currentNormal * vertex_position.y * scale;
			}
			clipPosition = offsetClip(startClip, offset);
			vColor = instance_startColor;
			vDistance = startDistance;
		}
		vDash = vec4(instance_style.z, instance_style.w, instance_dashFlags.x, capStyle);
		gl_Position = clipPosition;
	}


// ===== shader 38 — 005-playcanvas-stable.min.js =====

	varying vec3 vColor;
	varying vec4 vDash;
	varying vec3 vLineData;
	varying float vDistance;
	void main(void) {
		float worldPerPixel = length(vec2(dFdx(vDistance), dFdy(vDistance)));
		if (vDash.x > 0.0 && vDash.y > 0.0) {
			float period = vDash.x + vDash.y;
			float phase = mod(vDistance + vDash.z, period);
			if (phase < 0.0) {
				phase += period;
			}
			if (phase > vDash.x) {
				if (vDash.w > 1.5 && vLineData.z > 0.5) {
					float along = min(phase - vDash.x, period - phase) / max(worldPerPixel, 0.00001);
					float across = abs(vLineData.x) * vLineData.y;
					if (length(vec2(along, across)) > vLineData.y) {
						discard;
					}
				} else {
					discard;
				}
			}
		}
		gl_FragColor = vec4(vColor, 1.0);
	}


// ===== shader 39 — 005-playcanvas-stable.min.js =====

uniform sampler2D sourceTexture;
uniform vec2 sourceInvResolution;
varying vec2 uv0;
#ifdef PREMULTIPLY
	uniform sampler2D premultiplyTexture;
#endif
#ifdef PREFILTER
	uniform vec2 prefilterThresholdKnee;
#endif
void main()
{
	vec3 e = texture2D (sourceTexture, uv0).rgb;
	#ifdef BOXFILTER
		vec3 value = e;
		#ifdef PREMULTIPLY
			float premultiply = texture2D(premultiplyTexture, uv0).{PREMULTIPLY_SRC_CHANNEL};
			value *= vec3(premultiply);
		#endif
	#else
		float x = sourceInvResolution.x;
		float y = sourceInvResolution.y;
		vec3 a = texture2D(sourceTexture, vec2 (uv0.x - 2.0 * x, uv0.y + 2.0 * y)).rgb;
		vec3 b = texture2D(sourceTexture, vec2 (uv0.x,		   uv0.y + 2.0 * y)).rgb;
		vec3 c = texture2D(sourceTexture, vec2 (uv0.x + 2.0 * x, uv0.y + 2.0 * y)).rgb;
		vec3 d = texture2D(sourceTexture, vec2 (uv0.x - 2.0 * x, uv0.y)).rgb;
		vec3 f = texture2D(sourceTexture, vec2 (uv0.x + 2.0 * x, uv0.y)).rgb;
		vec3 g = texture2D(sourceTexture, vec2 (uv0.x - 2.0 * x, uv0.y - 2.0 * y)).rgb;
		vec3 h = texture2D(sourceTexture, vec2 (uv0.x,		   uv0.y - 2.0 * y)).rgb;
		vec3 i = texture2D(sourceTexture, vec2 (uv0.x + 2.0 * x, uv0.y - 2.0 * y)).rgb;
		vec3 j = texture2D(sourceTexture, vec2 (uv0.x - x, uv0.y + y)).rgb;
		vec3 k = texture2D(sourceTexture, vec2 (uv0.x + x, uv0.y + y)).rgb;
		vec3 l = texture2D(sourceTexture, vec2 (uv0.x - x, uv0.y - y)).rgb;
		vec3 m = texture2D(sourceTexture, vec2 (uv0.x + x, uv0.y - y)).rgb;
		vec3 value = e * 0.125;
		value += (a + c + g + i) * 0.03125;
		value += (b + d + f + h) * 0.0625;
		value += (j + k + l + m) * 0.125;
	#endif
	#ifdef REMOVE_INVALID
		value = max(value, vec3(0.0));
	#endif
	#ifdef PREFILTER
		float luminance = max(value.r, max(value.g, value.b));
		float threshold = prefilterThresholdKnee.x;
		float knee = prefilterThresholdKnee.y;
		float soft = clamp(luminance - threshold + knee, 0.0, 2.0 * knee);
		soft = soft * soft / (4.0 * knee + 1e-4);
		value *= clamp(max(soft, luminance - threshold) / max(luminance, 1e-4), 0.0, 1.0);
	#endif
	gl_FragColor = vec4(value, 1.0);
}


// ===== shader 40 — 005-playcanvas-stable.min.js =====

	uniform sampler2D sourceTexture;
	uniform vec2 sourceInvResolution;
	varying vec2 uv0;
	void main()
	{
		float x = sourceInvResolution.x;
		float y = sourceInvResolution.y;
		vec3 a = texture2D (sourceTexture, vec2 (uv0.x - x, uv0.y + y)).rgb;
		vec3 b = texture2D (sourceTexture, vec2 (uv0.x,	 uv0.y + y)).rgb;
		vec3 c = texture2D (sourceTexture, vec2 (uv0.x + x, uv0.y + y)).rgb;
		vec3 d = texture2D (sourceTexture, vec2 (uv0.x - x, uv0.y)).rgb;
		vec3 e = texture2D (sourceTexture, vec2 (uv0.x,	 uv0.y)).rgb;
		vec3 f = texture2D (sourceTexture, vec2 (uv0.x + x, uv0.y)).rgb;
		vec3 g = texture2D (sourceTexture, vec2 (uv0.x - x, uv0.y - y)).rgb;
		vec3 h = texture2D (sourceTexture, vec2 (uv0.x,	 uv0.y - y)).rgb;
		vec3 i = texture2D (sourceTexture, vec2 (uv0.x + x, uv0.y - y)).rgb;
		vec3 value = e * 0.25;
		value += (b + d + f + h) * 0.125;
		value += (a + c + g + i) * 0.0625;
		gl_FragColor = vec4(value, 1.0);
	}
