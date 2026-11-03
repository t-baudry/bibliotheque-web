// ===== shader 1 — 002-app.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 002-app.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 002-app.js =====
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
		

// ===== shader 4 — 002-app.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 5 — 002-app.js =====


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
	

// ===== shader 6 — 002-app.js =====

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

// ===== shader 7 — 002-app.js =====
precision highp float;

uniform vec2 uResolution;
uniform float uDarkMode;

varying vec2 vUv;

void main() {
	vec2 sUv = gl_FragCoord.xy / uResolution;
	float dtc = length(sUv - vec2(0.5));

	vec3 color = mix(vec3(0.89), vec3(0.3), dtc);
	color = mix(color, vec3(0.1 - dtc * 0.1), uDarkMode);
	gl_FragColor = vec4(color, 1.);
}


// ===== shader 8 — 002-app.js =====
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec2 uv;
attribute vec3 position;

varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// ===== shader 9 — 002-app.js =====
precision highp float;

// Base Color
uniform vec3 uColor;

#ifdef SIXTY_MAP
	uniform sampler2D tMap;
	varying vec2 vMapUv;
#endif

// Metallic Roughness
uniform float uMetalness;
uniform float uRoughness;

#ifdef SIXTY_ARMMAP
	uniform sampler2D tArmMap;
	uniform float uRoughnessMapIntensity;
	uniform float uMetalnessMapIntensity;
	varying vec2 vArmMapUv;
#endif

// Occlusion
#ifdef SIXTY_AOMAP
	uniform sampler2D tAoMap;
	varying vec2 vAoMapUv;
#endif

#if defined(SIXTY_ARMMAP) || defined(SIXTY_AOMAP)
	uniform float uAoMapIntensity;
#endif

// Emissive
uniform vec3 uEmissive;

// Ambient
uniform vec3 uAmbient;
uniform float uAmbientIntensity;

#ifdef SIXTY_EMISSIVEMAP
	uniform sampler2D tEmissiveMap;
	varying vec2 vEmissiveMapUv;
#endif

// Normal
#ifdef SIXTY_NORMALMAP
	uniform sampler2D tNormalMap;
	varying vec2 vNormalMapUv;
	uniform vec2 uNormalScale;

#endif

// Environment
#ifdef SIXTY_ENVMAP
	uniform sampler2D tEnvMap;
	uniform mat3 uEnvMapRotation;
	uniform float uEnvMapIntensity;
#endif

// Alpha
uniform float uOpacity;
#ifdef USE_ALPHATEST
	uniform float uAlphaTest;
#endif

#ifdef SIXTY_ALPHAMAP
	uniform sampler2D tAlphaMap;
#endif

#ifdef USE_UV
	varying vec2 vUv;
#endif
#ifdef USE_UV1
	varying vec2 vUv1;
	uniform sampler2D tLightMap;
	uniform float uLightMapIntensity;
#endif


varying vec3 vNormal;
varying vec3 vViewPosition;

// CONSTANTS
#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535

#ifndef saturate
	#define saturate(a) clamp(a, 0.0, 1.0)
#endif

// STRUCTS
struct ReflectedLight {
    vec3 directDiffuse; // Direct diffuse light
    vec3 directSpecular; // Direct specular light
    vec3 indirectDiffuse; // Indirect diffuse light
    vec3 indirectSpecular; // Indirect specular light
};
// Understanding diffuse/specular: https://en.wikipedia.org/wiki/Diffuse_reflection

struct PBRMaterial {
    vec3 diffuseColor;
    float roughness;
    vec3 specularColor;
    float specularF90;
};

// UTILITY FUNCTIONS
#ifdef SIXTY_ENVMAP
	vec3 inverseTransformDirection(vec3 dir, mat4 matrix) {
		return normalize((vec4(dir, 0.0) * matrix).xyz);
	}

	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace(vec3 direction) {
		vec3 absDirection = abs(direction);
		float face = - 1.0;
		if (absDirection.x > absDirection.z) {
			if (absDirection.x > absDirection.y)
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if (absDirection.z > absDirection.y)
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}

		return face;

	}

	vec2 getUV(vec3 direction, float face) {
		vec2 uv;
		if (face == 0.0) {
			uv = vec2(direction.z, direction.y) / abs(direction.x);
		} else if (face == 1.0) {
			uv = vec2(- direction.x, - direction.z) / abs(direction.y);
		} else if (face == 2.0) {
			uv = vec2(- direction.x, direction.y) / abs(direction.z);
		} else if (face == 3.0) {
			uv = vec2(- direction.z, direction.y) / abs(direction.x);
		} else if (face == 4.0) {
			uv = vec2(- direction.x, direction.z) / abs(direction.y);
		} else {
			uv = vec2(direction.x, direction.y) / abs(direction.z);
		}
		return 0.5 * (uv + 1.0);
	}

	vec3 bilinearCubeUV(sampler2D envMap, vec3 direction, float mipInt) {
		float face = getFace(direction);

		float filterInt = max(cubeUV_minMipLevel - mipInt, 0.0);
		mipInt = max(mipInt, cubeUV_minMipLevel);
		float faceSize = exp2(mipInt);
		highp vec2 uv = getUV(direction, face) * (faceSize - 2.0) + 1.0;
		if (face > 2.0) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * (exp2(CUBEUV_MAX_MIP) - faceSize);
		uv.x *= float(CUBEUV_TEXEL_WIDTH);
		uv.y *= float(CUBEUV_TEXEL_HEIGHT);

		return texture2D(envMap, uv).rgb;
	}

	#define cubeUV_r0 1.0
	#define cubeUV_m0 -2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 -1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0

	float roughnessToMip(float roughness) {
		float mip = 0.0;

		if (roughness >= cubeUV_r1) {
			mip = (cubeUV_r0 - roughness) * (cubeUV_m1 - cubeUV_m0) / (cubeUV_r0 - cubeUV_r1) + cubeUV_m0;
		} else if (roughness >= cubeUV_r4) {
			mip = (cubeUV_r1 - roughness) * (cubeUV_m4 - cubeUV_m1) / (cubeUV_r1 - cubeUV_r4) + cubeUV_m1;
		} else if (roughness >= cubeUV_r5) {
			mip = (cubeUV_r4 - roughness) * (cubeUV_m5 - cubeUV_m4) / (cubeUV_r4 - cubeUV_r5) + cubeUV_m4;
		} else if (roughness >= cubeUV_r6) {
			mip = (cubeUV_r5 - roughness) * (cubeUV_m6 - cubeUV_m5) / (cubeUV_r5 - cubeUV_r6) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2(1.16 * roughness);
		}

		return mip;
	}

	vec4 textureCubeUV(sampler2D envMap, vec3 sampleDir, float roughness) {
		float mip = clamp(roughnessToMip(roughness), cubeUV_m0, CUBEUV_MAX_MIP);
		float mipF = fract(mip);
		float mipInt = floor(mip);
		vec3 color0 = bilinearCubeUV(envMap, sampleDir, mipInt);
		if((mipF == 0.0)) {
			return vec4(color0, 1.0);
		} else {
			vec3 color1 = bilinearCubeUV(envMap, sampleDir, (mipInt + 1.0));
			return vec4(mix(color0, color1, mipF), 1.0);
		}
	}

	vec3 getIBLIrradiance(const in vec3 normal, const in sampler2D envMap, const in float envMapIntensity, const in mat3 envMapRotation) {
    	vec3 worldNormal = inverseTransformDirection(normal, viewMatrix);
		vec4 envMapColor = textureCubeUV(envMap, envMapRotation * worldNormal, 1.0);
		return PI * envMapColor.rgb * envMapIntensity;

	}

	vec3 getIBLRadiance(const in vec3 viewDir, const in vec3 normal, const in float roughness, const in sampler2D envMap, const in float envMapIntensity, const in mat3 envMapRotation) {
		vec3 reflectVec = reflect(- viewDir, normal);
		reflectVec = normalize(mix(reflectVec, normal, roughness * roughness));
		reflectVec = inverseTransformDirection(reflectVec, viewMatrix);
		vec4 envMapColor = textureCubeUV(envMap, envMapRotation * reflectVec, roughness);

		return envMapColor.rgb * envMapIntensity;
	}



#endif

vec3 getAmbientLightIrradiance(vec3 ambientLightColor) {
    vec3 irradiance = ambientLightColor;
    return irradiance;
}

vec3 BRDF_Lambert(const in vec3 diffuseColor) {
	return RECIPROCAL_PI * diffuseColor;
}

void RE_IndirectDiffuse(const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in PBRMaterial pbrMaterial, inout ReflectedLight reflectedLight) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert(pbrMaterial.diffuseColor);
}

// Function to approximate DFG (Diffuse, Fresnel, Geometric) term
vec2 DFGApprox(const in vec3 normal, const in vec3 viewDir, const in float roughness) {
	float dotNV = saturate(dot(normal, viewDir));
	const vec4 c0 = vec4(- 1, - 0.0275, - 0.572, 0.022);
	const vec4 c1 = vec4(1, 0.0425, 1.04, - 0.04);
	vec4 r = roughness * c0 + c1;
	float a004 = min(r.x * r.x, exp2(- 9.28 * dotNV)) * r.x + r.y;
	vec2 fab = vec2(- 1.04, 1.04) * a004 + r.zw;
	return fab;
}

void computeMultiscattering(const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter) {
	vec2 fab = DFGApprox(normal, viewDir, roughness);
	vec3 Fr = specularColor;
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + (1.0 - Fr) * 0.047619;	vec3 Fms = FssEss * Favg / (1.0 - Ems * Favg);

	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}

void RE_IndirectSpecular(const in vec3 radiance, const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in PBRMaterial pbrMaterial, inout ReflectedLight reflectedLight) {
	vec3 singleScattering = vec3(0.);
	vec3 multiScattering = vec3(0.);

	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	
	computeMultiscattering(geometryNormal, geometryViewDir, pbrMaterial.specularColor, pbrMaterial.specularF90, pbrMaterial.roughness, singleScattering, multiScattering);
	
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = pbrMaterial.diffuseColor * (1. - max(max(totalScattering.r, totalScattering.g), totalScattering.b));
	
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}

float computeSpecularOcclusion(const in float dotNV, const in float ambientOcclusion, const in float roughness) {
	return saturate(pow(dotNV + ambientOcclusion, exp2(- 16.0 * roughness - 1.0)) - 1.0 + ambientOcclusion);
}

mat3 getTangentFrame(const in vec3 eyePos, const in vec3 surfaceNormal, const in vec2 uv) {
		vec3 posDx = dFdx(eyePos);
		vec3 posDy = dFdy(eyePos);

		vec2 uvDx = dFdx(uv);
		vec2 uvDy = dFdy(uv); 

		uvDx = max(uvDx, vec2(1e-2));
		uvDy = max(uvDy, vec2(1e-2));

		uvDx = min(uvDx, vec2(1.));
		uvDy = min(uvDy, vec2(1.));

		vec3 N = surfaceNormal;

		vec3 q1perp = cross(posDy, N);
		vec3 q0perp = cross(N, posDx);
		
		// Tangent, Bitangent
		vec3 T = q1perp * uvDx.x + q0perp * uvDy.x;
		vec3 B = q1perp * uvDx.y + q0perp * uvDy.y;
		
		float det = max(dot(T, T), dot(B, B));
		float scale = (det == 0.0) ? 0.0 : inversesqrt(det);
		
		return mat3(T * scale, B * scale, N);
}

#define SIXTY_UNIFORMS_AREA

void main() {
	#define SIXTY_START_AREA

	vec4 diffuseColor = vec4(uColor, uOpacity);

	#ifdef SIXTY_MAP
		vec4 baseColorMapSample = texture2D(tMap, vMapUv);

		#ifdef SIXTY_ALPHAMAP
			diffuseColor.rgb *= baseColorMapSample.rgb;
			diffuseColor.a *= texture2D(tAlphaMap, vUv).r;
		#else
			diffuseColor *= baseColorMapSample;
		#endif

		#define SIXTY_MAP_AREA
	#endif

	#ifdef USE_ALPHATEST
		if (diffuseColor.a < uAlphaTest) discard;
	#endif

	// ARM map packed as rgb = [occlusion or nothing, roughness, metallic, nothing]
	vec4 armSample = vec4(1);

	#ifdef SIXTY_ARMMAP
		#ifdef SIXTY_AOMAP
			armSample.gb *= texture2D(tArmMap, vArmMapUv).gb;
		#else
			armSample.rgb *= texture2D(tArmMap, vArmMapUv).rgb;
		#endif

		armSample.gb *= vec2(uRoughnessMapIntensity, uMetalnessMapIntensity);

		#define SIXTY_ARMMAP_AREA
	#endif

	#ifdef SIXTY_AOMAP
		armSample.r *= texture2D(tAoMap, vAoMapUv).r;
	#endif

	float roughness = clamp(armSample.g * uRoughness, 0.04, 1.0);
	float metallic = clamp(armSample.b * uMetalness, 0.04, 1.0);

	vec3 nonPerturbatedNormal = vNormal;
	
	float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
	vec3 normal = normalize(vNormal);
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif

	#ifdef SIXTY_NORMALMAP
		mat3 tbn = getTangentFrame(-vViewPosition, normal, vNormalMapUv);

		#if defined(DOUBLE_SIDED)
			tbn[0] *= faceDirection;
			tbn[1] *= faceDirection;
		#endif

		vec3 nTex = texture2D(tNormalMap, vNormalMapUv).rgb * 2. - 1.;
		nTex.xy *= uNormalScale;
		normal = normalize(tbn * nTex);

		#define SIXTY_NORMALMAP_AREA
	#endif

	#define SIXTY_NORMAL_AREA

	ReflectedLight reflectedLight = ReflectedLight(vec3(0.), vec3(0.), vec3(0.), vec3(0.));

	PBRMaterial pbrMaterial = PBRMaterial(vec3(0.), 0., vec3(0.), 0.);
	pbrMaterial.diffuseColor = diffuseColor.rgb * (1. - metallic);

	vec3 dxy = max(abs(dFdx(nonPerturbatedNormal)), abs(dFdy(nonPerturbatedNormal)));
	float geometryRoughness = max(max(dxy.x, dxy.y), dxy.z);

	pbrMaterial.roughness = max(roughness, 0.0525);
	pbrMaterial.roughness += geometryRoughness;
	pbrMaterial.roughness = min(pbrMaterial.roughness, 1.0);

	pbrMaterial.specularColor = mix(vec3(0.04), diffuseColor.xyz, metallic);
	pbrMaterial.specularF90 = 1.;

	#define SIXTY_PBR_AREA

	vec3 geometryPosition = -vViewPosition;
	vec3 geometryNormal = normal;
	vec3 geometryViewDir = isOrthographic ? vec3(0., 0., 1.) : normalize(vViewPosition);

	vec3 ambientLightColor = uAmbient * uAmbientIntensity;
	
  

// ===== shader 10 — 002-app.js =====

#ifdef USE_UV
	varying vec2 vUv;
#endif
#ifdef USE_UV1
	varying vec2 vUv1;
#endif

// VARYINGS
varying vec3 vNormal;
varying vec3 vViewPosition;

#ifdef SIXTY_MAP
	uniform mat3 uMapTransform;
	varying vec2 vMapUv;
#endif

#ifdef SIXTY_ARMMAP
	uniform mat3 uArmMapTransform;
	varying vec2 vArmMapUv;
#endif

#ifdef SIXTY_AOMAP
	uniform mat3 uAoMapTransform;
	varying vec2 vAoMapUv;
#endif

#ifdef SIXTY_EMISSIVEMAP
	uniform mat3 uEmissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif

#ifdef SIXTY_NORMALMAP
	uniform mat3 uNormalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_MORPHTARGETS

	#ifndef USE_INSTANCING_MORPH

		uniform float morphTargetBaseInfluence;

	#endif

	#ifdef MORPHTARGETS_TEXTURE

		#ifndef USE_INSTANCING_MORPH

			uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];

		#endif

		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;

		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {

			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;

			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );

		}

	#else

		#ifndef USE_MORPHNORMALS

			uniform float morphTargetInfluences[ 8 ];

		#else

			uniform float morphTargetInfluences[ 4 ];

		#endif

	#endif

#endif

#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;

	uniform highp sampler2D boneTexture;

	mat4 getBoneMatrix( const in float i ) {

		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );

		return mat4( v1, v2, v3, v4 );

	}
#endif

#define SIXTY_UNIFORMS_AREA

void main() {
	#define SIXTY_START_AREA


	#ifdef USE_UV
		vUv = uv;
	#endif
	#ifdef USE_UV1
		vUv1 = uv1;
	#endif


	#ifdef SIXTY_MAP
		vMapUv = (uMapTransform * vec3(SIXTY_MAP_UV, 1.)).xy;
	#endif

	#ifdef SIXTY_ARMMAP
		vArmMapUv = (uArmMapTransform * vec3(SIXTY_ARMMAP_UV, 1.)).xy;
	#endif

	#ifdef SIXTY_AOMAP
		vAoMapUv = (uAoMapTransform * vec3(SIXTY_AOMAP_UV, 1.)).xy;
	#endif

	#ifdef SIXTY_EMISSIVEMAP
		vEmissiveMapUv = (uEmissiveMapTransform * vec3(SIXTY_EMISSIVEMAP_UV, 1.)).xy;
	#endif

	#ifdef SIXTY_NORMALMAP
		vNormalMapUv = (uNormalMapTransform * vec3(SIXTY_NORMALMAP_UV, 1.)).xy;
	#endif	

	vec3 objectNormal = normal;
	vec3 transformedNormal = objectNormal;
	vec3 transformed = position;

	#ifdef USE_MORPHTARGETS

		// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
		// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in position = sum((target - base) * influence)
		// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
		transformed *= morphTargetBaseInfluence;

		#ifdef MORPHTARGETS_TEXTURE

			for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

				if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];

			}

		#else

			transformed += morphTarget0 * morphTargetInfluences[ 0 ];
			transformed += morphTarget1 * morphTargetInfluences[ 1 ];
			transformed += morphTarget2 * morphTargetInfluences[ 2 ];
			transformed += morphTarget3 * morphTargetInfluences[ 3 ];

			#ifndef USE_MORPHNORMALS

				transformed += morphTarget4 * morphTargetInfluences[ 4 ];
				transformed += morphTarget5 * morphTargetInfluences[ 5 ];
				transformed += morphTarget6 * morphTargetInfluences[ 6 ];
				transformed += morphTarget7 * morphTargetInfluences[ 7 ];

			#endif

		#endif

	#endif

	#ifdef USE_MORPHNORMALS

			// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
			// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)
			// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
			objectNormal *= morphTargetBaseInfluence;

			#ifdef MORPHTARGETS_TEXTURE

				for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

					if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];

				}

			#else

				objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
				objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
				objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
				objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];

			#endif

		#endif

		#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )

		// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
		// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)
		// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
		vColor *= morphTargetBaseInfluence;

		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

			#if defined( USE_COLOR_ALPHA )

				if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];

			#elif defined( USE_COLOR )

				if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];

			#endif

		}

	#endif

	#ifdef USE_INSTANCING_MORPH

		float morphTargetInfluences[MORPHTARGETS_COUNT];

		float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;

		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {

			morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;

		}
	#endif 

	#ifdef USE_SKINNING
		mat4 boneMatX = getBoneMatrix( skinIndex.x );
		mat4 boneMatY = getBoneMatrix( skinIndex.y );
		mat4 boneMatZ = getBoneMatrix( skinIndex.z );
		mat4 boneMatW = getBoneMatrix( skinIndex.w );

		vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );

		vec4 skinned = vec4( 0.0 );
		skinned += boneMatX * skinVertex * skinWeight.x;
		skinned += boneMatY * skinVertex * skinWeight.y;
		skinned += boneMatZ * skinVertex * skinWeight.z;
		skinned += boneMatW * skinVertex * skinWeight.w;

		transformed = ( bindMatrixInverse * skinned ).xyz;

		mat4 skinMatrix = mat4( 0.0 );
		skinMatrix += skinWeight.x * boneMatX;
		skinMatrix += skinWeight.y * boneMatY;
		skinMatrix += skinWeight.z * boneMatZ;
		skinMatrix += skinWeight.w * boneMatW;
		skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;

		objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;

		#ifdef USE_TANGENT

			objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;

		#endif
	#endif

	#ifdef USE_INSTANCING
		mat3 im = mat3(instanceMatrix);
		transformedNormal /= vec3(dot(im[0],im[0]), dot(im[1],im[1]), dot(im[2],im[2]));
		transformedNormal = im * transformedNormal;
	#endif
	
	transformedNormal = normalMatrix * transformedNormal;

	vNormal = normalize(transformedNormal);

	#define SIXTY_TRANSFORMED_AREA

	vec4 mvPosition = vec4(transformed, 1.);
	
	#ifdef USE_INSTANCING
		#define SIXTY_INSTANCING_START_AREA
		
		mvPosition = instanceMatrix * mvPosition;
	#endif

	mvPosition = modelViewMatrix * mvPosition;

    vViewPosition = -mvPosition.xyz;

	gl_Position = projectionMatrix * mvPosition;

	#define SIXTY_END_AREA

	#define DEBUG_NONE 0
#define DEBUG_UV 1
#define DEBUG_UV1 2
#define DEBUG_UV2 3
#define DEBUG_UV3 4
#define DEBUG_NORMAL_TEXTURE 5
#define DEBUG_NORMAL_SHADING 6
#define DEBUG_NORMAL_GEOMETRY 7
#define DEBUG_TANGENT 8
#define DEBUG_BITANGENT 9
#define DEBUG_ALPHA 10
#define DEBUG_OCCLUSION 11
#define DEBUG_EMISSIVE 12
#define DEBUG_METALLIC 13
#define DEBUG_ROUGHNESS 14
#define DEBUG_BASE_COLOR 15
#define DEBUG_RADIANCE 16
#define DEBUG_IBL_IRRADIANCE 17

#ifdef DEBUG
    #if DEBUG == DEBUG_UV1 && defined(USE_UV1)
        vUv1 = uv1;
    #endif

    #if DEBUG == DEBUG_UV2 && defined(USE_UV2)
        vUv2 = uv2;
    #endif

    #if DEBUG == DEBUG_UV3 && defined(USE_UV3)
        vUv3 = uv3;
    #endif
#endif
}

// ===== shader 11 — 002-app.js =====
precision highp float;

uniform bool uMobile;

uniform vec2 uMouse;
uniform float uSpeed;
// uniform float uScrollSpeed;
uniform sampler2D tLast;

varying vec2 vUv;

void main() {
	vec4 lastPos = texture2D(tLast, vUv);
    
    // vec4 lastPos = vec4(0.);

    // lastPos.x = texture2D(tLast, vec2(vUv.x + TEXEL_SIZE * 2.0 * (1. + vUv.x), vUv.y)).x;
    // lastPos.y = texture2D(tLast, vec2(vUv.x + TEXEL_SIZE * 1.0 * (1. + vUv.x), vUv.y)).y;
    // lastPos.z = texture2D(tLast, vec2(vUv.x + TEXEL_SIZE * 1.5 * (1. + vUv.x), vUv.y)).z;
    // lastPos.w = texture2D(tLast, vec2(vUv.x + TEXEL_SIZE * 2.5 * (1. + vUv.x), vUv.y)).w;

 	// vec2 currentPos = uMouse;
    
    // float interpolationFactor = vUv.x;
    // interpolationFactor = smoothstep(1. - TEXEL_SIZE * 10., 1., vUv.x);

    float drawSize = uMobile ? 0.25 : 0.1;

    float currentMouse = smoothstep(drawSize, 0., length(vec2(vUv.x, vUv.y) - (1. - uMouse)));

    vec4 final = vec4(vec3(0.), 1.);

    float fadeFactor = uMobile ? 0.16 : 0.08; // This factor controls how fast it fades out
    final.rgb = vec3(currentMouse) + (1.0 - fadeFactor) * lastPos.rgb;


    // final.x = mix(lastPos.x, currentPos, uSpeed * uDelta * interpolationFactor * .5 * (1. - min(1., abs(uScrollSpeed) * 2.)));
    // final.y = mix(lastPos.y, currentPos, uSpeed * uDelta * interpolationFactor * .4 * (1. - min(1., abs(uScrollSpeed) * 1.5)));
    // final.z = mix(lastPos.z, currentPos, uSpeed * uDelta * interpolationFactor * .6 * (1. - min(1., abs(uScrollSpeed) * 1.)));
    // final.w = mix(lastPos.w, currentPos, uSpeed * uDelta * interpolationFactor * .7 * (1. - min(1., abs(uScrollSpeed) * .5)));

    gl_FragColor = final;
}


// ===== shader 12 — 002-app.js =====
precision highp float;

attribute vec2 uv;
attribute vec3 position;

varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = vec4(position, 1.0);
}

// ===== shader 13 — 002-app.js =====
precision highp float;

uniform sampler2D tMap;

varying vec2 vUv;

void main() {

	vec2 dUv = vec2(vUv.x, 1. - vUv.y);

	dUv = (dUv - 0.5) * 1.1 + 0.5;

	vec3 color = texture2D(tMap, dUv).rgb;

	float alpha = .3;
	// alpha = 0.;
	alpha *= smoothstep(0., 0.03, vUv.x) * smoothstep(1., 0.97, vUv.x);
	alpha *= smoothstep(0., 0.03, vUv.y) * smoothstep(1., 0.97, vUv.y);

	gl_FragColor = vec4(color, alpha);
}


// ===== shader 14 — 002-app.js =====
precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec2 uv;
attribute vec3 position;

varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// ===== shader 15 — 002-app.js =====

        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;

        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.);
        }
      

// ===== shader 16 — 002-app.js =====

        precision highp float;
        varying vec2 vUv;

        uniform sampler2D uScene, uBlured, uNoise;
        uniform vec2 uResolution;
        uniform float uTime, uNoiseIntensity;

        #define PI 3.14159265

        float avg(vec3 c) { return (c.x + c.y + c.z) / 3.; }

        void main() {
          vec3 color = texture2D(uScene, vUv).rgb * 2.;
          vec4 glow = vec4(0.);

          vec3 noise = (texture2D(uNoise, vUv / 256. * uResolution + floor(uTime * 10000.) * .04).rgb - .5);
          // vec2 poisson = vec2(cos(noise.x), sin(noise.x)) / uResolution * 50.;

          glow += texture2D(uBlured, vUv);

          // color += glow.rgb * .3;
          color += vec3(glow.r * .4, glow.g * .25, glow.b * .1) * .5;
          // color = glow.rgb;
          color *= 1. + mix(vec3(avg(noise)), noise, .5) * uNoiseIntensity;

          gl_FragColor = vec4(color, 1.);
        }
      

// ===== shader 17 — 002-app.js =====

        precision highp float;
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        uniform mat4 normalMatrix;

        attribute vec3 position;
        attribute vec3 normal;
        attribute vec2 uv;
        attribute vec2 uv1;

        varying vec2 vUv;
        varying vec2 vUv1;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vViewPosition;

        uniform float uBackSide;

        void main() {
          vUv = uv;
          vUv1 = uv1;
          vPosition = position;
          vNormal = vec3(normalMatrix * vec4(normal, 1.));
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
          mvPosition.xyz *= 1. + mvPosition.xyz * .001 * uBackSide;
          vViewPosition = mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      

// ===== shader 18 — 002-app.js =====

        precision highp float;
        varying vec2 vUv;
        varying vec2 vUv1;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vViewPosition;

        uniform sampler2D uReflexion, uNoise;
        uniform float uOpacity, uLuminosity, uBackSide, uGlobalLuminosity;

        #define PI 3.14159265

        void main() {
          float frontSide = 1. - uBackSide;
          vec3 color = vec3(0.);
          vec2 dUv = abs(vUv - .5) * .1 + fract(atan(vPosition.x, vPosition.y) * .1) + vUv1 * frontSide + abs(vNormal.xy) * .01;
          float t = 0.;
          float r = .0005 + length(vNormal.xy) * .00001;
          color.r += texture2D(uReflexion, dUv + vec2(cos(t), sin(t)) * r).r;
          t += PI * 2. / 3.;
          color.g += texture2D(uReflexion, dUv + vec2(cos(t), sin(t)) * r).g;
          t += PI * 2. / 3.;
          color.b += texture2D(uReflexion, dUv + vec2(cos(t), sin(t)) * r).b;

          color += smoothstep(.0, 1., texture2D(uReflexion, reflect(normalize(vViewPosition), normalize(vNormal) * .2).rg).r) * .4;

          color *= 1. + (texture2D(uNoise, vPosition.xy * .3 + vUv1 * frontSide - abs(vNormal.xy) * .001).r - .5) * .3;
          color += smoothstep(.5, 1., color) * .2;
          // color = .15 + color * .3 * vec3(1.2, .9, .6);
          color = .05 + color * .3 * vec3(1.2, 1.1, 1.05);

          gl_FragColor = vec4(color * uLuminosity * uGlobalLuminosity, uOpacity);
        }
      

// ===== shader 19 — 002-app.js =====

        precision highp float;

        attribute vec3 position;
        attribute vec2 uv;

        varying vec2 vUv;

        uniform float uBackSide;

        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.);
        }
      

// ===== shader 20 — 002-app.js =====

        precision highp float;
        varying vec2 vUv;

        uniform sampler2D uDiffuse, uLast, uNoise;
        uniform vec2 uResolution;

        #define WEIGHT_1 0.1945946
        #define WEIGHT_2 0.1216216
        #define WEIGHT_3 0.054054
        #define WEIGHT_4 0.016216

        #define PI 3.14159265

        void main() {
          vec2 offset = 5. / uResolution;

          vec3 color = vec3(0.);
          #ifdef HORIZONTAL
            color += texture2D(uDiffuse, vUv + vec2(offset.x * 1., 0.)).rgb * WEIGHT_1;
            color += texture2D(uDiffuse, vUv - vec2(offset.x * 1., 0.)).rgb * WEIGHT_1;

            color += texture2D(uDiffuse, vUv + vec2(offset.x * 2., 0.)).rgb * WEIGHT_2;
            color += texture2D(uDiffuse, vUv - vec2(offset.x * 2., 0.)).rgb * WEIGHT_2;

            color += texture2D(uDiffuse, vUv + vec2(offset.x * 3., 0.)).rgb * WEIGHT_3;
            color += texture2D(uDiffuse, vUv - vec2(offset.x * 3., 0.)).rgb * WEIGHT_3;

            color += texture2D(uDiffuse, vUv + vec2(offset.x * 4., 0.)).rgb * WEIGHT_4;
            color += texture2D(uDiffuse, vUv - vec2(offset.x * 4., 0.)).rgb * WEIGHT_4;
          #else
            color += texture2D(uDiffuse, vUv + vec2(0., offset.y * 1.)).rgb * WEIGHT_1;
            color += texture2D(uDiffuse, vUv - vec2(0., offset.y * 1.)).rgb * WEIGHT_1;

            color += texture2D(uDiffuse, vUv + vec2(0., offset.y * 2.)).rgb * WEIGHT_2;
            color += texture2D(uDiffuse, vUv - vec2(0., offset.y * 2.)).rgb * WEIGHT_2;

            color += texture2D(uDiffuse, vUv + vec2(0., offset.y * 3.)).rgb * WEIGHT_3;
            color += texture2D(uDiffuse, vUv - vec2(0., offset.y * 3.)).rgb * WEIGHT_3;

            color += texture2D(uDiffuse, vUv + vec2(0., offset.y * 4.)).rgb * WEIGHT_4;
            color += texture2D(uDiffuse, vUv - vec2(0., offset.y * 4.)).rgb * WEIGHT_4;

            color = mix(color, texture2D(uLast, vUv).rgb, .3);
          #endif
          gl_FragColor = vec4(smoothstep(.0, .3, length(color)) * color * 2., 1.);
          // gl_FragColor = texture2D(uDiffuse, vUv);
        }
      