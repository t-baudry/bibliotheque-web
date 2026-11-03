// ===== shader 1 — 001-index-Ck-pEZ8v.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 001-index-Ck-pEZ8v.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 001-index-Ck-pEZ8v.js =====
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
		

// ===== shader 4 — 001-index-Ck-pEZ8v.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 5 — 001-index-Ck-pEZ8v.js =====


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
	

// ===== shader 6 — 001-index-Ck-pEZ8v.js =====

uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}

// ===== shader 7 — 002-the-watch.D6O26wKS.js =====
precision highp float;uniform vec3 uColor;varying vec3 vObjectNormal;varying vec3 vCustomPosition;
#ifdef SIXTY_MAP
uniform sampler2D tMap;varying vec2 vMapUv;
#endif
uniform float uMetalness;uniform float uRoughness;
#ifdef SIXTY_ARMMAP
uniform sampler2D tArmMap;uniform float uRoughnessMapIntensity;uniform float uMetalnessMapIntensity;varying vec2 vArmMapUv;
#endif
#ifdef SIXTY_AOMAP
uniform sampler2D tAoMap;varying vec2 vAoMapUv;
#endif
#if defined(SIXTY_ARMMAP) || defined(SIXTY_AOMAP)
uniform float uAoMapIntensity;
#endif
uniform vec3 uEmissive;uniform vec3 uAmbient;uniform float uAmbientIntensity;
#ifdef SIXTY_EMISSIVEMAP
uniform sampler2D tEmissiveMap;varying vec2 vEmissiveMapUv;
#endif
#ifdef SIXTY_NORMALMAP
uniform sampler2D tNormalMap;varying vec2 vNormalMapUv;uniform vec2 uNormalScale;
#endif
#ifdef SIXTY_ENVMAP
uniform sampler2D tEnvMap;uniform mat3 uEnvMapRotation;uniform float uEnvMapIntensity;
#endif
#ifdef SIXTY_ADDITIVEENVMAP
uniform sampler2D tAdditiveEnvMap;uniform mat3 uAdditiveEnvMapRotation;uniform float uAdditiveEnvMapIntensity;
#endif
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
varying vec3 vNormal;varying vec3 vViewPosition;
#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#ifndef saturate
#define saturate(a) clamp(a, 0.0, 1.0)
#endif
#ifdef TRANSMISSION_FULL
float avg(vec3 v){return(v.x+v.y+v.z)/3.;}
#endif
struct ReflectedLight{vec3 directDiffuse;vec3 directSpecular;vec3 indirectDiffuse;vec3 indirectSpecular;};struct PBRMaterial{vec3 diffuseColor;float roughness;vec3 specularColor;float specularF90;};
#ifdef USE_LOD
float isLOD1(){return smoothstep(3.,2.,vViewPosition.z);}
#endif
vec3 adjustSaturation(vec3 color,float saturation){return mix(vec3(dot(color,vec3(0.2125,0.7154,0.0721))),color,saturation);}
#ifdef SIXTY_ENVMAP
vec3 inverseTransformDirection(vec3 dir,mat4 matrix){return normalize((vec4(dir,0.0)*matrix).xyz);}
#define cubeUV_minMipLevel 4.0
#define cubeUV_minTileSize 16.0
float getFace(vec3 direction){vec3 absDirection=abs(direction);float face=-1.0;if(absDirection.x>absDirection.z){if(absDirection.x>absDirection.y)face=direction.x>0.0 ? 0.0 : 3.0;else face=direction.y>0.0 ? 1.0 : 4.0;}else{if(absDirection.z>absDirection.y)face=direction.z>0.0 ? 2.0 : 5.0;else face=direction.y>0.0 ? 1.0 : 4.0;}return face;}vec2 getUV(vec3 direction,float face){vec2 uv;if(face==0.0){uv=vec2(direction.z,direction.y)/abs(direction.x);}else if(face==1.0){uv=vec2(-direction.x,-direction.z)/abs(direction.y);}else if(face==2.0){uv=vec2(-direction.x,direction.y)/abs(direction.z);}else if(face==3.0){uv=vec2(-direction.z,direction.y)/abs(direction.x);}else if(face==4.0){uv=vec2(-direction.x,direction.z)/abs(direction.y);}else{uv=vec2(direction.x,direction.y)/abs(direction.z);}return 0.5*(uv+1.0);}vec3 bilinearCubeUV(sampler2D envMap,vec3 direction,float mipInt){float face=getFace(direction);float filterInt=max(cubeUV_minMipLevel-mipInt,0.0);mipInt=max(mipInt,cubeUV_minMipLevel);float faceSize=exp2(mipInt);highp vec2 uv=getUV(direction,face)*(faceSize-2.0)+1.0;if(face>2.0){uv.y+=faceSize;face-=3.0;}uv.x+=face*faceSize;uv.x+=filterInt*3.0*cubeUV_minTileSize;uv.y+=4.0*(exp2(CUBEUV_MAX_MIP)-faceSize);uv.x*=CUBEUV_TEXEL_WIDTH;uv.y*=CUBEUV_TEXEL_HEIGHT;return texture2D(envMap,uv).rgb;}
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
float roughnessToMip(float roughness){float mip=0.0;if(roughness>=cubeUV_r1){mip=(cubeUV_r0-roughness)*(cubeUV_m1-cubeUV_m0)/(cubeUV_r0-cubeUV_r1)+cubeUV_m0;}else if(roughness>=cubeUV_r4){mip=(cubeUV_r1-roughness)*(cubeUV_m4-cubeUV_m1)/(cubeUV_r1-cubeUV_r4)+cubeUV_m1;}else if(roughness>=cubeUV_r5){mip=(cubeUV_r4-roughness)*(cubeUV_m5-cubeUV_m4)/(cubeUV_r4-cubeUV_r5)+cubeUV_m4;}else if(roughness>=cubeUV_r6){mip=(cubeUV_r5-roughness)*(cubeUV_m6-cubeUV_m5)/(cubeUV_r5-cubeUV_r6)+cubeUV_m5;}else{mip=-2.0*log2(1.16*roughness);}return mip;}vec4 textureCubeUV(sampler2D envMap,vec3 sampleDir,float roughness){float mip=clamp(roughnessToMip(roughness),cubeUV_m0,CUBEUV_MAX_MIP);float mipF=fract(mip);float mipInt=floor(mip);vec3 color0=bilinearCubeUV(envMap,sampleDir,mipInt);if((mipF==0.0)){return vec4(color0,1.0);}else{vec3 color1=bilinearCubeUV(envMap,sampleDir,(mipInt+1.0));return vec4(mix(color0,color1,mipF),1.0);}}vec3 getIBLIrradiance(const in vec3 normal,const in sampler2D envMap,const in float envMapIntensity,const in mat3 envMapRotation){vec3 worldNormal=inverseTransformDirection(normal,viewMatrix);vec4 envMapColor=textureCubeUV(envMap,envMapRotation*worldNormal,1.0);return PI*envMapColor.rgb*envMapIntensity;}vec3 getIBLRadiance(const in vec3 viewDir,const in vec3 normal,const in float roughness,const in sampler2D envMap,const in float envMapIntensity,const in mat3 envMapRotation){vec3 reflectVec=reflect(-viewDir,normal);reflectVec=normalize(mix(reflectVec,normal,roughness*roughness));reflectVec=inverseTransformDirection(reflectVec,viewMatrix);vec4 envMapColor=textureCubeUV(envMap,envMapRotation*reflectVec,roughness);return envMapColor.rgb*envMapIntensity;}
#endif
vec3 getAmbientLightIrradiance(vec3 ambientLightColor){vec3 irradiance=ambientLightColor;return irradiance;}vec3 BRDF_Lambert(const in vec3 diffuseColor){return RECIPROCAL_PI*diffuseColor;}void RE_IndirectDiffuse(const in vec3 irradiance,const in vec3 geometryPosition,const in vec3 geometryNormal,const in vec3 geometryViewDir,const in PBRMaterial pbrMaterial,inout ReflectedLight reflectedLight){reflectedLight.indirectDiffuse+=irradiance*BRDF_Lambert(pbrMaterial.diffuseColor);}vec2 DFGApprox(const in vec3 normal,const in vec3 viewDir,const in float roughness){float dotNV=saturate(dot(normal,viewDir));const vec4 c0=vec4(-1,-0.0275,-0.572,0.022);const vec4 c1=vec4(1,0.0425,1.04,-0.04);vec4 r=roughness*c0+c1;float a004=min(r.x*r.x,exp2(-9.28*dotNV))*r.x+r.y;vec2 fab=vec2(-1.04,1.04)*a004+r.zw;return fab;}void computeMultiscattering(const in vec3 normal,const in vec3 viewDir,const in vec3 specularColor,const in float specularF90,const in float roughness,inout vec3 singleScatter,inout vec3 multiScatter){vec2 fab=DFGApprox(normal,viewDir,roughness);vec3 Fr=specularColor;vec3 FssEss=Fr*fab.x+specularF90*fab.y;float Ess=fab.x+fab.y;float Ems=1.0-Ess;vec3 Favg=Fr+(1.0-Fr)*0.047619;vec3 Fms=FssEss*Favg/(1.0-Ems*Favg);singleScatter+=FssEss;multiScatter+=Fms*Ems;}void RE_IndirectSpecular(const in vec3 radiance,const in vec3 irradiance,const in vec3 geometryPosition,const in vec3 geometryNormal,const in vec3 geometryViewDir,const in PBRMaterial pbrMaterial,inout ReflectedLight reflectedLight){vec3 singleScattering=vec3(0.);vec3 multiScattering=vec3(0.);vec3 cosineWeightedIrradiance=irradiance*RECIPROCAL_PI;computeMultiscattering(geometryNormal,geometryViewDir,pbrMaterial.specularColor,pbrMaterial.specularF90,pbrMaterial.roughness,singleScattering,multiScattering);vec3 totalScattering=singleScattering+multiScattering;vec3 diffuse=pbrMaterial.diffuseColor*(1.-max(max(totalScattering.r,totalScattering.g),totalScattering.b));reflectedLight.indirectSpecular+=radiance*singleScattering;reflectedLight.indirectSpecular+=multiScattering*cosineWeightedIrradiance;reflectedLight.indirectDiffuse+=diffuse*cosineWeightedIrradiance;}float computeSpecularOcclusion(const in float dotNV,const in float ambientOcclusion,const in float roughness){return saturate(pow(dotNV+ambientOcclusion,exp2(-16.0*roughness-1.0))-1.0+ambientOcclusion);}mat3 getTangentFrame(const in vec3 eyePos,const in vec3 surfaceNormal,const in vec2 uv){vec3 posDx=dFdx(eyePos);vec3 posDy=dFdy(eyePos);vec2 uvDx=dFdx(uv);vec2 uvDy=dFdy(uv);uvDx=max(uvDx,vec2(1e-2));uvDy=max(uvDy,vec2(1e-2));uvDx=min(uvDx,vec2(1.));uvDy=min(uvDy,vec2(1.));vec3 N=surfaceNormal;vec3 q1perp=cross(posDy,N);vec3 q0perp=cross(N,posDx);vec3 T=q1perp*uvDx.x+q0perp*uvDy.x;vec3 B=q1perp*uvDx.y+q0perp*uvDy.y;float det=max(dot(T,T),dot(B,B));float scale=(det==0.0)? 0.0 : inversesqrt(det);return mat3(T*scale,B*scale,N);}uniform float uInvertProgress;uniform float uDarknessProgress;uniform mat3 uGlobalEnvmapRotation;varying float vDebug;
#define SIXTY_UNIFORMS_AREA
void main(){
#define SIXTY_START_AREA
vec4 diffuseColor=vec4(uColor,uOpacity);
#define SIXTY_DIFFUSE_AREA
#ifdef SIXTY_MAP
vec4 baseColorMapSample=texture2D(tMap,vMapUv);
#ifdef SIXTY_ALPHAMAP
diffuseColor.rgb*=baseColorMapSample.rgb;diffuseColor.a*=texture2D(tAlphaMap,vUv).r;
#else
diffuseColor*=baseColorMapSample;
#endif
#define SIXTY_MAP_AREA
#endif
#ifdef USE_ALPHATEST
if(diffuseColor.a<uAlphaTest)discard;
#endif
vec4 armSample=vec4(1);
#ifdef SIXTY_ARMMAP
#ifdef SIXTY_AOMAP
armSample.gb*=texture2D(tArmMap,vArmMapUv).gb;
#else
armSample.rgb*=texture2D(tArmMap,vArmMapUv).rgb;
#endif
armSample.gb*=vec2(uRoughnessMapIntensity,uMetalnessMapIntensity);
#define SIXTY_ARMMAP_AREA
#endif
#ifdef SIXTY_AOMAP
armSample.r*=texture2D(tAoMap,vAoMapUv).r;
#endif
float roughness=clamp(armSample.g*uRoughness,0.04,1.0);float metallic=clamp(armSample.b*uMetalness,0.04,1.0);
#define SIXTY_ROUGHNESS_METALLIC
vec3 nonPerturbatedNormal=vNormal;float faceDirection=gl_FrontFacing ? 1.0 :-1.0;vec3 normal=normalize(nonPerturbatedNormal);
#define SIXTY_NORMALIZE
#ifdef DOUBLE_SIDED
normal*=faceDirection;
#endif
#ifdef SIXTY_NORMALMAP
mat3 tbn=getTangentFrame(-vViewPosition,normal,vNormalMapUv);
#if defined(DOUBLE_SIDED)
tbn[0]*=faceDirection;tbn[1]*=faceDirection;
#endif
vec3 nTex=texture2D(tNormalMap,vNormalMapUv).rgb*2.-1.;nTex.xy*=uNormalScale;normal=normalize(tbn*nTex);
#define SIXTY_NORMALMAP_AREA
#endif
#define SIXTY_NORMAL_AREA
ReflectedLight reflectedLight=ReflectedLight(vec3(0.),vec3(0.),vec3(0.),vec3(0.));PBRMaterial pbrMaterial=PBRMaterial(vec3(0.),0.,vec3(0.),0.);pbrMaterial.diffuseColor=diffuseColor.rgb*(1.-metallic);vec3 dxy=max(abs(dFdx(nonPerturbatedNormal)),abs(dFdy(nonPerturbatedNormal)));float geometryRoughness=max(max(dxy.x,dxy.y),dxy.z);pbrMaterial.roughness=max(roughness,0.0525);pbrMaterial.roughness+=geometryRoughness;pbrMaterial.roughness=min(pbrMaterial.roughness,1.0);pbrMaterial.specularColor=mix(vec3(0.04),diffuseColor.xyz,metallic);pbrMaterial.specularF90=0.;
#define SIXTY_PBR_AREA
vec3 geometryPosition=-vViewPosition;vec3 geometryNormal=normal;vec3 geometryViewDir=isOrthographic ? vec3(0.,0.,1.): normalize(vViewPosition);vec3 ambientLightColor=uAmbient*uAmbientIntensity;vec3 iblIrradiance=vec3(0.);vec3 radiance=vec3(0.);vec3 irradiance=getAmbientLightIrradiance(ambientLightColor);
#ifdef SIXTY_ENVMAP
#define SIXTY_BEFORE_ENVMAP_AREA
iblIrradiance+=getIBLIrradiance(geometryNormal,tEnvMap,uEnvMapIntensity,uEnvMapRotation*uGlobalEnvmapRotation);radiance+=getIBLRadiance(geometryViewDir,geometryNormal,pbrMaterial.roughness,tEnvMap,uEnvMapIntensity,uEnvMapRotation*uGlobalEnvmapRotation);
#define SIXTY_ENVMAP_AREA
#endif
#ifdef SIXTY_ADDITIVEENVMAP
#define SIXTY_BEFORE_ADDITIVE_ENVMAP_AREA
iblIrradiance+=getIBLIrradiance(geometryNormal,tAdditiveEnvMap,uAdditiveEnvMapIntensity,uAdditiveEnvMapRotation);radiance+=getIBLRadiance(geometryViewDir,geometryNormal,pbrMaterial.roughness,tAdditiveEnvMap,uAdditiveEnvMapIntensity,uAdditiveEnvMapRotation);
#define SIXTY_ADDITIVE_ENVMP_AREA
#endif
#if defined(SIXTY_ENVMAP) || defined(SIXTY_ADDITIVEENVMAP)
iblIrradiance=mix(iblIrradiance,0.15*iblIrradiance,uDarknessProgress);radiance=mix(radiance,0.15*radiance,uDarknessProgress);
#endif
RE_IndirectDiffuse(irradiance,geometryPosition,geometryNormal,geometryViewDir,pbrMaterial,reflectedLight);RE_IndirectSpecular(radiance,iblIrradiance,geometryPosition,geometryNormal,geometryViewDir,pbrMaterial,reflectedLight);
#if defined(SIXTY_ARM_AS_AO) || defined(SIXTY_AOMAP)
float occlusion=(armSample.r-1.)*uAoMapIntensity+1

// ===== shader 8 — 002-the-watch.D6O26wKS.js =====
#ifdef USE_UV
varying vec2 vUv;
#endif
varying vec3 vNormal;varying vec3 vCustomPosition;varying vec3 vObjectNormal;varying vec3 vViewPosition;
#ifdef SIXTY_MAP
uniform mat3 uMapTransform;varying vec2 vMapUv;
#endif
#ifdef SIXTY_ARMMAP
uniform mat3 uArmMapTransform;varying vec2 vArmMapUv;
#endif
#ifdef SIXTY_AOMAP
uniform mat3 uAoMapTransform;varying vec2 vAoMapUv;
#endif
#ifdef SIXTY_EMISSIVEMAP
uniform mat3 uEmissiveMapTransform;varying vec2 vEmissiveMapUv;
#endif
#ifdef SIXTY_NORMALMAP
uniform mat3 uNormalMapTransform;varying vec2 vNormalMapUv;
#endif
#ifdef USE_MORPHTARGETS
#ifndef USE_INSTANCING_MORPH
uniform float morphTargetBaseInfluence;uniform float morphTargetInfluences[MORPHTARGETS_COUNT];
#endif
uniform sampler2DArray morphTargetsTexture;uniform ivec2 morphTargetsTextureSize;vec4 getMorph(const in int vertexIndex,const in int morphTargetIndex,const in int offset){int texelIndex=vertexIndex*MORPHTARGETS_TEXTURE_STRIDE+offset;int y=texelIndex/morphTargetsTextureSize.x;int x=texelIndex-y*morphTargetsTextureSize.x;ivec3 morphUV=ivec3(x,y,morphTargetIndex);return texelFetch(morphTargetsTexture,morphUV,0);}
#endif
varying float vDebug;
#define SIXTY_UNIFORMS_AREA
void main(){
#define SIXTY_START_AREA
#ifdef USE_UV
vUv=uv;
#endif
#ifdef SIXTY_MAP
vMapUv=(uMapTransform*vec3(SIXTY_MAP_UV,1.)).xy;
#endif
#ifdef SIXTY_ARMMAP
vArmMapUv=(uArmMapTransform*vec3(SIXTY_ARMMAP_UV,1.)).xy;
#endif
#ifdef SIXTY_AOMAP
vAoMapUv=(uAoMapTransform*vec3(SIXTY_AOMAP_UV,1.)).xy;
#endif
#ifdef SIXTY_EMISSIVEMAP
vEmissiveMapUv=(uEmissiveMapTransform*vec3(SIXTY_EMISSIVEMAP_UV,1.)).xy;
#endif
#ifdef SIXTY_NORMALMAP
vNormalMapUv=(uNormalMapTransform*vec3(SIXTY_NORMALMAP_UV,1.)).xy;
#endif
vec3 objectNormal=normal;
#ifdef USE_MORPHNORMALS
objectNormal*=morphTargetBaseInfluence;
#endif
vec3 transformedNormal=objectNormal;
#ifdef USE_INSTANCING
mat3 im=mat3(instanceMatrix);transformedNormal/=vec3(dot(im[0],im[0]),dot(im[1],im[1]),dot(im[2],im[2]));transformedNormal=im*transformedNormal;
#endif
#define SIXTY_TRANSFORMED_NORMAL_AREA
vObjectNormal=transformedNormal;transformedNormal=normalMatrix*transformedNormal;vNormal=normalize(transformedNormal);vCustomPosition=position;vec3 transformed=position;
#ifdef USE_MORPHTARGETS
transformed*=morphTargetBaseInfluence;for(int i=0;i<MORPHTARGETS_COUNT;i++){if(morphTargetInfluences[i]!=0.0)transformed+=getMorph(gl_VertexID,i,0).xyz*morphTargetInfluences[i];}
#endif
#define SIXTY_TRANSFORMED_AREA
vec4 mvPosition=vec4(transformed,1.);
#ifdef USE_INSTANCING
#define SIXTY_INSTANCING_START_AREA
mvPosition=instanceMatrix*mvPosition;
#endif
mvPosition=modelViewMatrix*mvPosition;vViewPosition=-mvPosition.xyz;gl_Position=projectionMatrix*mvPosition;
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
vUv1=uv1;
#endif
#if DEBUG == DEBUG_UV2 && defined(USE_UV2)
vUv2=uv2;
#endif
#if DEBUG == DEBUG_UV3 && defined(USE_UV3)
vUv3=uv3;
#endif
#endif
}

// ===== shader 9 — 002-the-watch.D6O26wKS.js =====
uniform sampler2D tMap;varying vec2 vUv;void main(){gl_FragColor=vec4(0.,0.,0.,0.4*smoothstep(0.35,.5,distance(vUv,vec2(0.5))));}

// ===== shader 10 — 002-the-watch.D6O26wKS.js =====
varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}

// ===== shader 11 — 002-the-watch.D6O26wKS.js =====
varying vec2 vUv;uniform float uTime;uniform float uProgress;uniform float uOpacity;uniform float uOpacityMultiplier;uniform float uScreenX;uniform float uZoomProgress;
#define GRADIENT_SIZE 0.05
void main(){float screenX=smoothstep(-2.,2.,uScreenX);float overlaySize=0.03+uZoomProgress*0.1;gl_FragColor=vec4(0.,0.,0.,(smoothstep(screenX-overlaySize,screenX-(overlaySize+GRADIENT_SIZE),vUv.x)+smoothstep(screenX+overlaySize,screenX+(overlaySize+GRADIENT_SIZE),vUv.x))*uProgress*uOpacity*uOpacityMultiplier*.7);gl_FragColor.a=0.;}

// ===== shader 12 — 002-the-watch.D6O26wKS.js =====
uniform sampler2D tMap;varying vec2 vUv;uniform float uDarknessProgress;void main(){vec4 glow=texture2D(tMap,vUv);gl_FragColor=vec4(1.,1.,1.,glow.a*uDarknessProgress*0.5);}

// ===== shader 13 — 002-the-watch.D6O26wKS.js =====
varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}

// ===== shader 14 — 002-the-watch.D6O26wKS.js =====
uniform float uTime;uniform vec3 uColor;varying vec2 vUv;uniform float uOpacity;uniform float uOpacityMultiplier;vec3 lighten(vec3 color,float intensity){return color+intensity*(1.0-color);}float normalizedSin(float x){return 0.5*(sin(x)+1.0);}void main(){float line=smoothstep(0.49,0.49001,vUv.y)*smoothstep(0.5001,0.5,vUv.y);vec3 lineColor=line*uColor;lineColor=mix(lineColor,lighten(lineColor,.2),sin(vUv.x*50.-uTime*2.)*.5*line);vec3 color=lineColor;float opacity=0.;opacity+=length(color)*4.;float glow=smoothstep(0.4,0.5,vUv.y)*smoothstep(.6,0.5,vUv.y)*(1.5+sin(vUv.x*50.-uTime*2.)*1.);glow=glow*(1.-line);opacity+=glow*.03;if(opacity<0.01){discard;}color+=glow*uColor;color=mix(color,lighten(color,.3),normalizedSin(uTime*5.));gl_FragColor=vec4(color,opacity*uOpacity*uOpacityMultiplier);}

// ===== shader 15 — 002-the-watch.D6O26wKS.js =====
varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}

// ===== shader 16 — 002-the-watch.D6O26wKS.js =====
varying vec2 vUv;uniform float uTime;uniform float uProgress;uniform float uOpenProgress;void main(){float progress=uProgress+uOpenProgress;float yUv=vUv.y+sin(vUv.x*8.+uTime*2.)*0.1;float x=smoothstep(0.,1.-progress,vUv.x)-smoothstep(progress,1.,vUv.x);float y=smoothstep(0.,1.-progress,yUv)-smoothstep(progress,1.,yUv);gl_FragColor=vec4(0.,0.,0.,x*y);}

// ===== shader 17 — 002-the-watch.D6O26wKS.js =====
uniform float uOpacity;uniform float uTime;varying float vIndex;varying float vSeed;varying vec3 vPos;varying vec2 vUv;varying float vNormalizedIndex;varying float vPointSize;varying vec3 vColor;void main(){vec2 uv=gl_PointCoord*2.-1.;float dist=length(uv*.5);float opacity=smoothstep(.5,.4,dist);opacity*=1.-smoothstep(8.,20.,vPointSize)*.1;gl_FragColor=vec4(vColor,opacity);}

// ===== shader 18 — 002-the-watch.D6O26wKS.js =====
uniform float uTime;attribute float aIndex;attribute float aSeed;uniform sampler2D tNoise;uniform sampler2D tGradient;varying float vIndex;varying float vNormalizedIndex;varying float vSeed;varying vec3 vPos;uniform float uProgress;varying vec2 vUv;uniform vec2 uMouse;uniform vec2 uResolution;varying float vPointSize;varying vec3 vColor;
#define PI 3.1415926538
vec3 curlNoise(vec3 pos,float seed,float time){vec2 noiseCoordX=vec2(pos.y+time*0.1,pos.z+seed*0.1);vec2 noiseCoordY=vec2(pos.z+time*0.1,pos.x+seed*0.1);vec2 noiseCoordZ=vec2(pos.x+time*0.1,pos.y+seed*0.1);float noiseX=texture2D(tNoise,noiseCoordX).r*2.0-1.0;float noiseY=texture2D(tNoise,noiseCoordY).g*2.0-1.0;float noiseZ=texture2D(tNoise,noiseCoordZ).b*2.0-1.0;return vec3(noiseY-noiseZ,noiseZ-noiseX,noiseX-noiseY);}float normalizedSin(float value){return .5+(sin(value)*0.5);}float stepRange(float edge0,float edge1,float x){return clamp((x-edge0)/(edge1-edge0),0.0,1.0);}float smoothstepPower3Out(float edge0,float edge1,float x){x=clamp((x-edge0)/(edge1-edge0),0.0,1.0);return 1.0-pow(1.0-x,3.0);}float smoothstepPower3In(float edge0,float edge1,float x){x=clamp((x-edge0)/(edge1-edge0),0.0,1.0);return pow(x,3.0);}void main(){vIndex=aIndex;vSeed=aSeed;vUv=uv;vNormalizedIndex=stepRange(0.,PARTICLES_COUNT,aIndex);float globalTime=uTime*0.2;float singleTime=(globalTime+vNormalizedIndex*10.);singleTime+=normalizedSin(singleTime)*.2;float radius=0.6;radius*=1.+3.*smoothstepPower3In(0.3,0.,uProgress)*vNormalizedIndex;vec3 basePos=vec3(sin(singleTime*1.5)*radius,cos(singleTime*1.5)*radius,sin(singleTime*2.));vec3 pos=basePos+curlNoise(basePos*0.1,aSeed*.5,globalTime*0.2)*.2*(.8+normalizedSin(singleTime));gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);gl_PointSize=mix(3.,2.+4.*vSeed,1.+pos.z)*(1.+smoothstep(0.45,0.8,uProgress)*2.);vPointSize=gl_PointSize;vPos=pos;vColor=vec3(mix(.0,1.,sin(vNormalizedIndex*20.+vSeed*2.0+uTime*2.)*.5+.5));}

// ===== shader 19 — 002-the-watch.D6O26wKS.js =====
varying vec2 vUv;uniform float uTime;uniform sampler2D tDiffuse;uniform sampler2D tLastDiffuse;uniform float uOpacity;uniform float uProgress;uniform float uPass;void main(){vec4 color=(texture2D(tDiffuse,vUv));color.rgb*=1.04;color.a-=0.001;color.a*=uOpacity;color.a*=mix(.6,.99*1.-smoothstep(0.5,.6,uProgress),uPass)*smoothstep(.1,.2,uProgress);gl_FragColor=vec4(color);}

// ===== shader 20 — 002-the-watch.D6O26wKS.js =====
varying vec2 vUv;uniform float uProgress;void main(){vUv=uv;gl_Position=vec4(position,1.0);}

// ===== shader 21 — 002-the-watch.D6O26wKS.js =====
precision highp float;uniform sampler2D tDiffuse,uNoise,tGradient;uniform float uRatio;uniform vec2 uResolution;uniform float uLongpress;uniform vec2 uMouse;uniform float uBackgroundMultiplier;uniform float uTime;varying vec2 vUv;
#define PI 3.14159265359
#define NEAR 1.
#define FAR 100.
#define CONTRAST 1.15
#define GAMMA 1.6
#define NOISE .05
#define FISHEYE .0
vec3 adjustSaturation(vec3 color,float saturation){return mix(vec3(dot(color,vec3(0.2125,0.7154,0.0721))),color,saturation);}float avg(vec3 c){return(c.x+c.y+c.z)/3.;}void main(){vec2 cUv=vUv-.5;float dtc=length(cUv);float border=smoothstep(.3,.7,dtc);vec2 dUv=(vUv-.5)*(1.-border*FISHEYE)+.5;vec2 uvNoise=texture2D(uNoise,vec2(vUv.x*uRatio,vUv.y)*4.).rg-.5;vec4 color=texture2D(tDiffuse,dUv);color.rgb=((color.rgb-0.5)*CONTRAST+0.5);color.rgb=pow(color.rgb,vec3(1.0/GAMMA));float bgBorder=smoothstep(.7,.3,length(dUv-.5));float t=uTime*.3;float backgroundIntensity=0.;vec2 sUv=dUv*.8+uMouse*.2;float mouseDist=length(dUv-uMouse*.5-.5);backgroundIntensity=(sin(sUv.x*4.*sin(sUv.x*4.)+t+sin(sUv.y*4.+t*1.3))-sin(sUv.y+t+sin(sUv.x*3.+t*1.)*4.))*.3;backgroundIntensity*=bgBorder;backgroundIntensity+=smoothstep(.7,.3,length(dUv-1.));backgroundIntensity=backgroundIntensity*.2+0.;backgroundIntensity*=uBackgroundMultiplier*1.5;color.rgb=mix(color.rgb,vec3(backgroundIntensity),1.-color.a);color.a=mix(color.a,1.,backgroundIntensity*(1.-color.a));gl_FragColor=color;}

// ===== shader 22 — 002-the-watch.D6O26wKS.js =====
attribute vec3 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.);}

// ===== shader 23 — 002-the-watch.D6O26wKS.js =====
uniform sampler2D tMap;varying vec2 vUv;uniform float uDarknessProgress;uniform float uOpacity;void main(){gl_FragColor.rgb=vec3(1.-texture2D(tMap,vUv).a*.4);gl_FragColor.rgb=mix(vec3(1.),gl_FragColor.rgb,uOpacity);gl_FragColor.a=1.;}

// ===== shader 24 — 002-the-watch.D6O26wKS.js =====
varying vec2 vUv;void main(){vUv=uv;vec3 pos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);}

// ===== shader 25 — 003-hotReplace.BfRBVwiW.js =====
precision highp float;uniform vec3 uColor;
#ifdef SIXTY_MAP
uniform sampler2D tMap;varying vec2 vMapUv;
#endif
uniform float uMetallic;uniform float uRoughness;
#ifdef SIXTY_ARMMAP
uniform sampler2D tArmMap;uniform float uRoughnessMapIntensity;uniform float uMetallicMapIntensity;varying vec2 vArmMapUv;
#endif
#ifdef SIXTY_AOMAP
uniform sampler2D tAoMap;varying vec2 vAoMapUv;
#endif
#if defined(SIXTY_ARMMAP) || defined(SIXTY_AOMAP)
uniform float uAoMapIntensity;
#endif
uniform vec3 uEmissiveColor;uniform vec3 uAmbientColor;uniform float uAmbientIntensity;
#ifdef SIXTY_EMISSIVEMAP
uniform sampler2D tEmissiveMap;varying vec2 vEmissiveMapUv;
#endif
#ifdef SIXTY_NORMALMAP
uniform sampler2D tNormalMap;varying vec2 vNormalMapUv;uniform vec2 uNormalScale;
#endif
#ifdef SIXTY_ENVMAP
uniform sampler2D tEnvMap;uniform mat3 uEnvMapRotation;uniform float uEnvMapIntensity;
#endif
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
varying vec3 vNormal;varying vec3 vViewPosition;
#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#ifndef saturate
#define saturate(a) clamp(a, 0.0, 1.0)
#endif
struct ReflectedLight{vec3 directDiffuse;vec3 directSpecular;vec3 indirectDiffuse;vec3 indirectSpecular;};struct PBRMaterial{vec3 diffuseColor;float roughness;vec3 specularColor;float specularF90;};
#ifdef SIXTY_ENVMAP
vec3 inverseTransformDirection(vec3 dir,mat4 matrix){return normalize((vec4(dir,0.0)*matrix).xyz);}
#define cubeUV_minMipLevel 4.0
#define cubeUV_minTileSize 16.0
float getFace(vec3 direction){vec3 absDirection=abs(direction);float face=-1.0;if(absDirection.x>absDirection.z){if(absDirection.x>absDirection.y)face=direction.x>0.0 ? 0.0 : 3.0;else face=direction.y>0.0 ? 1.0 : 4.0;}else{if(absDirection.z>absDirection.y)face=direction.z>0.0 ? 2.0 : 5.0;else face=direction.y>0.0 ? 1.0 : 4.0;}return face;}vec2 getUV(vec3 direction,float face){vec2 uv;if(face==0.0){uv=vec2(direction.z,direction.y)/abs(direction.x);}else if(face==1.0){uv=vec2(-direction.x,-direction.z)/abs(direction.y);}else if(face==2.0){uv=vec2(-direction.x,direction.y)/abs(direction.z);}else if(face==3.0){uv=vec2(-direction.z,direction.y)/abs(direction.x);}else if(face==4.0){uv=vec2(-direction.x,direction.z)/abs(direction.y);}else{uv=vec2(direction.x,direction.y)/abs(direction.z);}return 0.5*(uv+1.0);}vec3 bilinearCubeUV(sampler2D envMap,vec3 direction,float mipInt){float face=getFace(direction);float filterInt=max(cubeUV_minMipLevel-mipInt,0.0);mipInt=max(mipInt,cubeUV_minMipLevel);float faceSize=exp2(mipInt);highp vec2 uv=getUV(direction,face)*(faceSize-2.0)+1.0;if(face>2.0){uv.y+=faceSize;face-=3.0;}uv.x+=face*faceSize;uv.x+=filterInt*3.0*cubeUV_minTileSize;uv.y+=4.0*(exp2(SIXTY_CUBEUV_MAX_MIP)-faceSize);uv.x*=SIXTY_CUBEUV_TEXEL_WIDTH;uv.y*=SIXTY_CUBEUV_TEXEL_HEIGHT;return texture2D(envMap,uv).rgb;}
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
float roughnessToMip(float roughness){float mip=0.0;if(roughness>=cubeUV_r1){mip=(cubeUV_r0-roughness)*(cubeUV_m1-cubeUV_m0)/(cubeUV_r0-cubeUV_r1)+cubeUV_m0;}else if(roughness>=cubeUV_r4){mip=(cubeUV_r1-roughness)*(cubeUV_m4-cubeUV_m1)/(cubeUV_r1-cubeUV_r4)+cubeUV_m1;}else if(roughness>=cubeUV_r5){mip=(cubeUV_r4-roughness)*(cubeUV_m5-cubeUV_m4)/(cubeUV_r4-cubeUV_r5)+cubeUV_m4;}else if(roughness>=cubeUV_r6){mip=(cubeUV_r5-roughness)*(cubeUV_m6-cubeUV_m5)/(cubeUV_r5-cubeUV_r6)+cubeUV_m5;}else{mip=-2.0*log2(1.16*roughness);}return mip;}vec4 textureCubeUV(sampler2D envMap,vec3 sampleDir,float roughness){float mip=clamp(roughnessToMip(roughness),cubeUV_m0,SIXTY_CUBEUV_MAX_MIP);float mipF=fract(mip);float mipInt=floor(mip);vec3 color0=bilinearCubeUV(envMap,sampleDir,mipInt);if((mipF==0.0)){return vec4(color0,1.0);}else{vec3 color1=bilinearCubeUV(envMap,sampleDir,(mipInt+1.0));return vec4(mix(color0,color1,mipF),1.0);}}vec3 getIBLIrradiance(const in vec3 normal,const in sampler2D envMap,const in float envMapIntensity,const in mat3 envMapRotation){vec3 worldNormal=inverseTransformDirection(normal,viewMatrix);vec4 envMapColor=textureCubeUV(envMap,envMapRotation*worldNormal,1.0);return PI*envMapColor.rgb*envMapIntensity;}vec3 getIBLRadiance(const in vec3 viewDir,const in vec3 normal,const in float roughness,const in sampler2D envMap,const in float envMapIntensity,const in mat3 envMapRotation){vec3 reflectVec=reflect(-viewDir,normal);reflectVec=normalize(mix(reflectVec,normal,roughness*roughness));reflectVec=inverseTransformDirection(reflectVec,viewMatrix);vec4 envMapColor=textureCubeUV(envMap,envMapRotation*reflectVec,roughness);return envMapColor.rgb*envMapIntensity;}
#endif
vec3 getAmbientLightIrradiance(vec3 ambientLightColor){vec3 irradiance=ambientLightColor;return irradiance;}vec3 BRDF_Lambert(const in vec3 diffuseColor){return RECIPROCAL_PI*diffuseColor;}void RE_IndirectDiffuse(const in vec3 irradiance,const in vec3 geometryPosition,const in vec3 geometryNormal,const in vec3 geometryViewDir,const in PBRMaterial pbrMaterial,inout ReflectedLight reflectedLight){reflectedLight.indirectDiffuse+=irradiance*BRDF_Lambert(pbrMaterial.diffuseColor);}vec2 DFGApprox(const in vec3 normal,const in vec3 viewDir,const in float roughness){float dotNV=saturate(dot(normal,viewDir));const vec4 c0=vec4(-1,-0.0275,-0.572,0.022);const vec4 c1=vec4(1,0.0425,1.04,-0.04);vec4 r=roughness*c0+c1;float a004=min(r.x*r.x,exp2(-9.28*dotNV))*r.x+r.y;vec2 fab=vec2(-1.04,1.04)*a004+r.zw;return fab;}void computeMultiscattering(const in vec3 normal,const in vec3 viewDir,const in vec3 specularColor,const in float specularF90,const in float roughness,inout vec3 singleScatter,inout vec3 multiScatter){vec2 fab=DFGApprox(normal,viewDir,roughness);vec3 Fr=specularColor;vec3 FssEss=Fr*fab.x+specularF90*fab.y;float Ess=fab.x+fab.y;float Ems=1.0-Ess;vec3 Favg=Fr+(1.0-Fr)*0.047619;vec3 Fms=FssEss*Favg/(1.0-Ems*Favg);singleScatter+=FssEss;multiScatter+=Fms*Ems;}void RE_IndirectSpecular(const in vec3 radiance,const in vec3 irradiance,const in vec3 geometryPosition,const in vec3 geometryNormal,const in vec3 geometryViewDir,const in PBRMaterial pbrMaterial,inout ReflectedLight reflectedLight){vec3 singleScattering=vec3(0.);vec3 multiScattering=vec3(0.);vec3 cosineWeightedIrradiance=irradiance*RECIPROCAL_PI;computeMultiscattering(geometryNormal,geometryViewDir,pbrMaterial.specularColor,pbrMaterial.specularF90,pbrMaterial.roughness,singleScattering,multiScattering);vec3 totalScattering=singleScattering+multiScattering;vec3 diffuse=pbrMaterial.diffuseColor*(1.-max(max(totalScattering.r,totalScattering.g),totalScattering.b));reflectedLight.indirectSpecular+=radiance*singleScattering;reflectedLight.indirectSpecular+=multiScattering*cosineWeightedIrradiance;reflectedLight.indirectDiffuse+=diffuse*cosineWeightedIrradiance;}float computeSpecularOcclusion(const in float dotNV,const in float ambientOcclusion,const in float roughness){return saturate(pow(dotNV+ambientOcclusion,exp2(-16.0*roughness-1.0))-1.0+ambientOcclusion);}mat3 getTangentFrame(const in vec3 eyePos,const in vec3 surfaceNormal,const in vec2 uv){vec3 posDx=dFdx(eyePos);vec3 posDy=dFdy(eyePos);vec2 uvDx=dFdx(uv);vec2 uvDy=dFdy(uv);uvDx=max(uvDx,vec2(1e-2));uvDy=max(uvDy,vec2(1e-2));uvDx=min(uvDx,vec2(1.));uvDy=min(uvDy,vec2(1.));vec3 t=normalize(posDx*uvDy.t-posDy*uvDx.t);vec3 b=normalize(-posDx*uvDy.s+posDy*uvDx.s);return mat3(t,b,surfaceNormal);}
#define SIXTY_UNIFORMS_AREA
void main(){
#define SIXTY_START_AREA
vec4 diffuseColor=vec4(uColor,uOpacity);
#ifdef SIXTY_MAP
vec4 baseColorMapSample=texture2D(tMap,vMapUv);
#ifdef SIXTY_ALPHAMAP
diffuseColor.rgb*=baseColorMapSample.rgb;diffuseColor.a*=texture2D(tAlphaMap,vUv).r;
#else
diffuseColor*=baseColorMapSample;
#endif
#define SIXTY_MAP_AREA
#endif
#ifdef USE_ALPHATEST
if(diffuseColor.a<uAlphaTest)discard;
#endif
vec4 armSample=vec4(1);
#ifdef SIXTY_ARMMAP
#ifdef SIXTY_AOMAP
armSample.gb*=texture2D(tArmMap,vArmMapUv).gb;
#else
armSample.rgb*=texture2D(tArmMap,vArmMapUv).rgb;
#endif
armSample.gb*=vec2(uRoughnessMapIntensity,uMetallicMapIntensity);
#define SIXTY_ARMMAP_AREA
#endif
#ifdef SIXTY_AOMAP
armSample.r*=texture2D(tAoMap,vAoMapUv).r;
#endif
float roughness=clamp(armSample.g*uRoughness,0.04,1.0);float metallic=clamp(armSample.b*uMetallic,0.04,1.0);vec3 nonPerturbatedNormal=vNormal;float faceDirection=gl_FrontFacing ? 1.0 :-1.0;vec3 normal=normalize(vNormal);
#ifdef DOUBLE_SIDED
normal*=faceDirection;
#endif
#ifdef SIXTY_NORMALMAP
mat3 tbn=getTangentFrame(-vViewPosition,normal,vNormalMapUv);
#if defined(DOUBLE_SIDED)
tbn[0]*=faceDirection;tbn[1]*=faceDirection;
#endif
vec3 nTex=texture2D(tNormalMap,vNormalMapUv).rgb*2.-1.;nTex.xy*=-uNormalScale;normal=normalize(tbn*nTex);
#define SIXTY_NORMALMAP_REA
#endif
#define SIXTY_NORMAL_AREA
ReflectedLight reflectedLight=ReflectedLight(vec3(0.),vec3(0.),vec3(0.),vec3(0.));PBRMaterial pbrMaterial=PBRMaterial(vec3(0.),0.,vec3(0.),0.);pbrMaterial.diffuseColor=diffuseColor.rgb*(1.-metallic);vec3 dxy=max(abs(dFdx(nonPerturbatedNormal)),abs(dFdy(nonPerturbatedNormal)));float geometryRoughness=max(max(dxy.x,dxy.y),dxy.z);pbrMaterial.roughness=max(roughness,0.0525);pbrMaterial.roughness+=geometryRoughness;pbrMaterial.roughness=min(pbrMaterial.roughness,1.0);pbrMaterial.specularColor=mix(vec3(0.04),diffuseColor.xyz,metallic);pbrMaterial.specularF90=1.;
#define SIXTY_PBR_AREA
vec3 geometryPosition=-vViewPosition;vec3 geometryNormal=normal;vec3 geometryViewDir=isOrthographic ? vec3(0.,0.,1.): normalize(vViewPosition);vec3 ambientLightColor=uAmbientColor*uAmbientIntensity;vec3 iblIrradiance=vec3(0.);vec3 radiance=vec3(0.);vec3 irradiance=getAmbientLightIrradiance(ambientLightColor);
#ifdef SIXTY_ENVMAP
iblIrradiance+=getIBLIrradiance(geometryNormal,tEnvMap,uEnvMapIntensity,uEnvMapRotation);radiance+=getIBLRadiance(geometryViewDir,geometryNormal,pbrMaterial.roughness,tEnvMap,uEnvMapIntensity,uEnvMapRotation);
#define SIXTY_ENVMAP_AREA
#endif
RE_IndirectDiffuse(irradiance,geometryPosition,geometryNormal,geometryViewDir,pbrMaterial,reflectedLight);RE_IndirectSpecular(radiance,iblIrradiance,geometryPosition,geometryNormal,geometryViewDir,pbrMaterial,reflectedLight);
#if defined(SIXTY_ARM_AS_AO) || defined(SIXTY_AOMAP)
float occlusion=(armSample.r-1.)*uAoMapIntensity+1.;reflectedLight.indirectDiffuse*=occlusion;
#ifdef SIXTY_ENVMAP
float dotNV=saturate(dot(geometryNormal,geometryViewDir));reflectedLight.indirectSpecular*=computeSpecularOcclusion(dotNV,occlusion,pbrMaterial.roughness);
#endif
#define SIXTY_AOMAP_AREA
#endif
vec3 totalEmissiveRadiance=uEmissiveColor;
#ifdef SIXTY_EMISSIVEMAP
totalEmissiveRadiance*=texture2D(tEmissiveMap,vEmissiveMapUv).rgb;
#define SIXTY_EMISSIVEMAP_AREA
#endif
vec3 totalDiffuse=reflectedLight.directDiffuse+reflectedLight.indirectDiffuse;vec3 totalSpecular=reflectedLight.directSpecular+reflectedLight.indirectSpecular;vec3 outgoingLight=totalDiffuse+totalSpecular+totalEmissiveRadiance;
#ifdef OPAQUE
diffuseColor.a=1.0;
#endif
gl_FragColor=vec4(outgoingLight,diffuseColor.a);
#ifdef TONE_MAPPING
gl_FragColor.rgb=toneMapping(gl_FragColor.rgb);
#endif
gl_FragColor=linearToOutputTexel(gl_FragColor);
#ifdef PREMULTIPLIED_ALPHA
gl_FragColor.rgb*=gl_FragColor.a;
#endif
#ifdef DITHERING
gl_FragColor.rgb=dithering(gl_FragColor.rgb);
#endif
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
#d

// ===== shader 26 — 003-hotReplace.BfRBVwiW.js =====
#ifdef USE_UV
varying vec2 vUv;
#endif
varying vec3 vNormal;varying vec3 vViewPosition;
#ifdef SIXTY_MAP
uniform mat3 uMapTransform;varying vec2 vMapUv;
#endif
#ifdef SIXTY_ARMMAP
uniform mat3 uArmMapTransform;varying vec2 vArmMapUv;
#endif
#ifdef SIXTY_AOMAP
uniform mat3 uAoMapTransform;varying vec2 vAoMapUv;
#endif
#ifdef SIXTY_EMISSIVEMAP
uniform mat3 uEmissiveMapTransform;varying vec2 vEmissiveMapUv;
#endif
#ifdef SIXTY_NORMALMAP
uniform mat3 uNormalMapTransform;varying vec2 vNormalMapUv;
#endif
#define SIXTY_UNIFORMS_AREA
void main(){
#define SIXTY_START_AREA
#ifdef USE_UV
vUv=uv;
#endif
#ifdef SIXTY_MAP
vMapUv=(uMapTransform*vec3(SIXTY_MAP_UV,1.)).xy;
#endif
#ifdef SIXTY_ARMMAP
vArmMapUv=(uArmMapTransform*vec3(SIXTY_ARMMAP_UV,1.)).xy;
#endif
#ifdef SIXTY_AOMAP
vAoMapUv=(uAoMapTransform*vec3(SIXTY_AOMAP_UV,1.)).xy;
#endif
#ifdef SIXTY_EMISSIVEMAP
vEmissiveMapUv=(uEmissiveMapTransform*vec3(SIXTY_EMISSIVEMAP_UV,1.)).xy;
#endif
#ifdef SIXTY_NORMALMAP
vNormalMapUv=(uNormalMapTransform*vec3(SIXTY_NORMALMAP_UV,1.)).xy;
#endif
vec3 objectNormal=normal;vec3 transformedNormal=objectNormal;
#ifdef USE_INSTANCING
mat3 im=mat3(instanceMatrix);transformedNormal/=vec3(dot(im[0],im[0]),dot(im[1],im[1]),dot(im[2],im[2]));transformedNormal=im*transformedNormal;
#endif
transformedNormal=normalMatrix*transformedNormal;vNormal=normalize(transformedNormal);vec3 transformed=position;
#define SIXTY_TRANSFORMED_AREA
vec4 mvPosition=vec4(transformed,1.);
#ifdef USE_INSTANCING
#define SIXTY_INSTANCING_START_AREA
mvPosition=instanceMatrix*mvPosition;
#endif
mvPosition=modelViewMatrix*mvPosition;vViewPosition=-mvPosition.xyz;gl_Position=projectionMatrix*mvPosition;
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
vUv1=uv1;
#endif
#if DEBUG == DEBUG_UV2 && defined(USE_UV2)
vUv2=uv2;
#endif
#if DEBUG == DEBUG_UV3 && defined(USE_UV3)
vUv3=uv3;
#endif
#endif
}