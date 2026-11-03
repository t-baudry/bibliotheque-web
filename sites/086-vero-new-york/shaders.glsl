// ===== shader 1 — 026-11sswtocfulc.js =====
#version 300 es
#define attribute in
#define varying out
attribute vec2 uv;attribute vec3 position;attribute float id;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;varying vec2 vUv;varying float vId;void main(){vUv=uv;vId=id;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}

// ===== shader 2 — 026-11sswtocfulc.js =====
#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;uniform vec3 uColor;uniform sampler2D tMap;uniform float uTime;uniform float uStagger;uniform float uDuration;varying vec2 vUv;varying float vId;float c(float e){return 1.-pow(1.-e,3.);}void main(){vec3 f=texture2D(tMap,vUv).rgb;float h=max(min(f.r,f.g),min(max(f.r,f.g),f.b))-.5;float i=vId*uStagger;float j=c(clamp((uTime-i)/uDuration,.0,1.));float k=mix(.8,.0,j);float l=h-k;float m=fwidth(l);float n=smoothstep(-m,m,l);gl_FragColor=vec4(uColor,n);}

// ===== shader 3 — 031-113pxml9t0jd6.js =====
#version 300 es
precision highp float;
#ifdef SHADOW
const mat4 shadowCoordsMatrix=mat4(.5,0,0,0,0,.5,0,0,0,0,.5,0,.5,.5,.5,1);vec4 b(const in mat4 c,const in mat4 d,const in mat4 e,const in vec3 f){return(shadowCoordsMatrix*c*d*e*vec4(f,1.));}uniform mat4 shadowViewMatrix;uniform mat4 shadowProjectionMatrix;out vec4 vShadowCoords;
#endif
#ifdef DISPLACEMENT_MAP
uniform sampler2D displacementMap;uniform vec2 displacementMapScale;uniform float displacementMapIntensity;uniform float displacementMapBias;
#endif
uniform mat3 normalMatrix;uniform mat4 modelMatrix;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;in vec3 position;in vec2 uv;in vec3 normal;out vec2 vUv;out vec3 vNormal;out vec3 vModelPosition;out vec3 vModelPositionRaw;void main(){
#ifdef FLIP_UV_Y
vUv=vec2(uv.x,1.-uv.y);
#else
vUv=uv;
#endif
vNormal=normalize(normalMatrix*normal);vModelPositionRaw=position;
#ifdef DISPLACEMENT_MAP
float displacement=texture(displacementMap,vUv*displacementMapScale).r;displacement=displacement*displacementMapIntensity+displacementMapBias;vModelPositionRaw+=vNormal*displacement;
#endif
vModelPosition=(modelMatrix*vec4(vModelPositionRaw,1.)).xyz;
#ifdef SHADOW
vShadowCoords=b(shadowProjectionMatrix,shadowViewMatrix,modelMatrix,position);
#endif
gl_Position=projectionMatrix*modelViewMatrix*vec4(vModelPositionRaw,1.);}

// ===== shader 4 — 031-113pxml9t0jd6.js =====
#version 300 es
precision highp float;
#define PI 3.14159265359
#define PI2 6.283185307179586
vec4 f(vec4 J){vec3 K=pow(J.xyz,vec3(2.2));return vec4(K,J.w);;}vec3 h(vec3 L){return pow(L,vec3(1./2.2));}
#define F0 vec3(.04)
uniform vec3 cameraPosition;uniform mat4 viewMatrix;uniform mat3 normalMatrix;uniform vec3 diffuse;uniform float metalness;uniform float roughness;uniform float occlusion;uniform float occlusionBack;uniform vec3 emissive;uniform float alpha;struct d{vec3 direction;vec3 color;float intensity;};uniform d[DIRECTIONAL_LIGHTS_COUNT] directionalLights;in vec2 vUv;in vec3 vNormal;in vec3 vModelPosition;in vec3 vModelPositionRaw;out vec4 fragColor;
#ifdef DIFFUSE_MAP
uniform sampler2D diffuseMap;uniform vec2 diffuseMapScale;
#endif
#ifdef RMO_MAP
uniform sampler2D rmoMap;uniform vec2 rmoMapScale;uniform float metalnessMapIntensity;uniform float roughnessMapIntensity;uniform float occlusionMapIntensity;
#endif
#ifdef NO_MAP
uniform sampler2D noMap;uniform vec2 noMapScale;uniform float normalMapIntensity;uniform float occlusionMapIntensity;
#endif
#ifdef ROUGHNESS_MAP
uniform sampler2D roughnessMap;uniform vec2 roughnessMapScale;uniform float roughnessMapIntensity;
#endif
#ifdef METALNESS_MAP
uniform sampler2D metalnessMap;uniform vec2 metalnessMapScale;uniform float metalnessMapIntensity;
#endif
#ifdef OCCLUSION_MAP
uniform sampler2D occlusionMap;uniform vec2 occlusionMapScale;uniform float occlusionMapIntensity;
#endif
#ifdef NORMAL_MAP
uniform sampler2D normalMap;uniform vec2 normalMapScale;uniform float normalMapIntensity;
#endif
#ifdef FRESNEL
float j(const in float M,const in vec3 N,const in vec3 O){return pow(1.-clamp(dot(normalize(N),normalize(O)),0.,1.),M);}uniform vec3 fresnelColor;uniform float fresnelPower;uniform float fresnelIntensity;
#endif
#ifdef SHADOW
uniform sampler2D shadowMap;uniform float shadowIntensity;in vec4 vShadowCoords;
#endif
#ifdef SHADOW_PCSS
highp float k(const in vec2 P){const highp float Q=12.9898;const highp float R=78.233;const highp float S=43758.5453;highp float T=dot(P,vec2(Q,R));highp float U=mod(T,PI);return fract(sin(U)*S);}
#define POISSON_SAMPLES 37
#define POISSON_RINGS 11
vec2 poissonDisk[POISSON_SAMPLES];void l(const in vec2 V){float W=PI2*float(POISSON_RINGS)/float(POISSON_SAMPLES);float X=1./float(POISSON_SAMPLES);float Y=k(V)*PI2;float Z=X;float ab=Z;for(int cb=0;cb<POISSON_SAMPLES;cb++){poissonDisk[cb]=vec2(cos(Y),sin(Y))*pow(Z,.75);Z+=ab;Y+=W;}}float m(vec4 eb){return dot(eb,1./vec4(1.,255.,65025.,16581375.));}
#define SHADOW_FRUSTUM_BIAS .001
bool n(in vec4 gb){gb.xyz/=gb.w;gb.z+=SHADOW_FRUSTUM_BIAS;return(gb.x<0.||
gb.x>1.||
gb.y<0.||
gb.y>1.||
gb.z>1.);}struct e{float lightSizeUv;float nearPlane;};
#define PCSS_BLOCKER_SEARCH_SAMPLES POISSON_SAMPLES
float o(const in float ib,const in float kb){return(ib-kb)/kb;}float p(sampler2D mb,const in vec2 ob,const in float qb,const in e sb){float ub=sb.lightSizeUv*(qb-sb.nearPlane)/qb;float wb=0.;int yb=0;for(int Ab=0;Ab<PCSS_BLOCKER_SEARCH_SAMPLES;Ab++){float Cb=m(texture(mb,ob+poissonDisk[Ab]*ub));if(Cb<qb){wb+=Cb;yb++;}}return mix(-1.,wb/float(max(1,yb)),float(yb>=1));}float q(sampler2D Eb,vec2 Gb,float Ib,float Kb){float Mb=0.;for(int Ob=0;Ob<PCSS_BLOCKER_SEARCH_SAMPLES;Ob++){Mb+=step(Ib,m(texture(Eb,Gb+poissonDisk[Ob]*Kb)));}for(int Ob=0;Ob<PCSS_BLOCKER_SEARCH_SAMPLES;Ob++){Mb+=step(Ib,m(texture(Eb,Gb+-poissonDisk[Ob].yx*Kb)));}return Mb/float(PCSS_BLOCKER_SEARCH_SAMPLES);}float u(sampler2D Sb,vec4 Ub,const in e Wb){if(n(Ub)){return 1.;}vec2 Yb=Ub.xy;float ac=Ub.z;l(Yb);float cc=p(Sb,Yb,ac,Wb);if(cc==-1.){return 1.;}float ec=o(ac,cc);float gc=ec*Wb.lightSizeUv*Wb.nearPlane/ac;return q(Sb,Yb,ac,gc);}uniform float pcssLightWorldSize;uniform float pcssLightFrustumWidth;uniform float pcssNearPlane;
#endif
#ifdef FADE
uniform vec2 fade;
#endif
vec3 A(vec3 ic){vec3 kc=dFdx(vModelPosition.xyz);vec3 mc=dFdy(vModelPosition.xyz);vec2 oc=dFdx(vUv);vec2 qc=dFdy(vUv);vec3 sc=normalize(kc*qc.t-mc*oc.t);vec3 uc=normalize(-kc*qc.s+mc*oc.s);mat3 wc=mat3(sc,uc,normalize(vNormal));vec3 yc=normalize(wc*ic);return normalize((vec4(yc,.0)*viewMatrix).xyz);}
#ifdef FRESNEL
void B(inout vec3 Ac,const in vec3 Cc,const in vec3 Ec){Ac+=fresnelIntensity*fresnelColor*j(fresnelPower,Cc,Ec);}
#endif
#ifdef SHADOW
void C(inout vec3 Gc){float Ic=1.;
#ifdef SHADOW_PCSS
Ic=u(shadowMap,vShadowCoords,e(pcssLightWorldSize/pcssLightFrustumWidth,pcssNearPlane));
#endif
Gc*=Ic*shadowIntensity-shadowIntensity+1.;}
#endif
vec3 E(vec3 Kc,vec3 Mc,float Oc){return Kc+(Mc-Kc)*pow(clamp(1.-Oc,0.,1.),5.);}float H(float Qc,float Sc,float Uc){float Wc=pow(Qc,2.);float Yc=2.*Sc/(Sc+sqrt(Wc+(1.-Wc)*(Sc*Sc)));float ad=2.*Uc/(Uc+sqrt(Wc+(1.-Wc)*(Uc*Uc)));return Yc*ad;}float I(float cd,float ed){float gd=pow(cd,2.);return gd/(PI*pow((ed*gd-ed)*ed+1.,2.));}void main(){vec3 id=vec3(0.,0.,1.);vec3 kd=diffuse;float md=roughness;float od=metalness;float qd=1.;
#ifdef NO_MAP
vec4 no=texture(noMap,vUv*noMapScale);id=no.rgb*2.-1.;id.xy*=normalMapIntensity;qd*=no.a*occlusionMapIntensity;
#endif
#ifdef NORMAL_MAP
id=texture(normalMap,vUv*normalMapScale).rgb*2.-1.;id.xy*=normalMapIntensity;
#endif
#ifdef DIFFUSE_MAP
kd*=f(texture(diffuseMap,vUv*diffuseMapScale)).rgb;
#endif
#ifdef RMO_MAP
vec3 rmo=texture(rmoMap,vUv*rmoMapScale).rgb;md+=rmo.r*roughnessMapIntensity;od+=rmo.g*metalnessMapIntensity;qd*=rmo.b*occlusionMapIntensity;
#endif
#ifdef ROUGHNESS_MAP
md+=texture(roughnessMap,vUv*roughnessMapScale).r*roughnessMapIntensity;
#endif
#ifdef METALNESS_MAP
od+=texture(metalnessMap,vUv*metalnessMapScale).r*metalnessMapIntensity;
#endif
#ifdef OCCLUSION_MAP
qd*=texture(occlusionMap,vUv*occlusionMapScale).r*occlusionMapIntensity;
#endif
od=clamp(od,.04,1.);md=clamp(md,.04,1.);vec3 diffuseColor=kd*(vec3(1.)-F0)*(1.-od);vec3 specularColor=mix(F0,kd,od);vec3 specularEnvR0=specularColor;vec3 specularEnvR90=vec3(clamp(max(max(specularColor.r,specularColor.g),specularColor.b)*25.,0.,1.));vec3 normal=A(id);vec3 view=normalize(cameraPosition-vModelPosition);vec3 color=vec3(0.,0.,0.);for(int i=0;i<DIRECTIONAL_LIGHTS_COUNT;i++){d directionalLight=directionalLights[i];vec3 lightDirection=normalize(directionalLight.direction);vec3 halfway=normalize(lightDirection+view);vec3 reflection=normalize(reflect(-view,normal));float NdL=clamp(dot(normal,lightDirection),.001,1.);float NdV=clamp(abs(dot(normal,view)),.001,1.);float NdH=clamp(dot(normal,halfway),0.,1.);float VdH=clamp(dot(view,halfway),0.,1.);vec3 F=E(specularEnvR0,specularEnvR90,VdH);float G=H(md,NdL,NdV);float D=I(md,NdH);vec3 diffuseContribution=(1.-F)*(diffuseColor/PI);vec3 specularContribution=F*G*D/(4.*NdL*NdV);color+=NdL*directionalLight.color*(diffuseContribution+specularContribution)*directionalLight.intensity;}
#ifdef FRESNEL
B(color,normal,view);
#endif
color=mix(color,color*qd,occlusion);color+=emissive;color=mix(color,vec3(0.,0.,0.),occlusionBack*(1.-float(gl_FrontFacing)));
#ifdef SHADOW
C(color);
#endif
fragColor.rgb=h(color);fragColor.a=alpha;
#ifdef FADE
float fadeRange=fade.y-fade.x;float fadeDisabled=step(abs(fadeRange),0.);fadeRange=mix(fadeRange,1.,fadeDisabled);float fadeFactor=1.-clamp((vModelPositionRaw.y-fade.x)/fadeRange,0.,1.);fadeFactor=mix(fadeFactor,1.,fadeDisabled);fadeFactor=1.-pow(1.-fadeFactor,2.);fragColor.a*=fadeFactor;
#endif
#ifdef PREMULTIPLY_ALPHA
fragColor.rgb*=fragColor.a;
#endif
}

// ===== shader 5 — 032-0llrukolnvf9j.js =====

    precision highp float;
    precision highp int;

    attribute vec3 position;
    attribute vec3 normal;

    uniform mat3 normalMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying vec3 vNormal;

    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }


// ===== shader 6 — 032-0llrukolnvf9j.js =====

    precision highp float;
    precision highp int;

    varying vec3 vNormal;

    void main() {
        gl_FragColor.rgb = normalize(vNormal);
        gl_FragColor.a = 1.0;
    }


// ===== shader 7 — 032-0llrukolnvf9j.js =====

    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }


// ===== shader 8 — 032-0llrukolnvf9j.js =====

    precision highp float;

    vec4 packRGBA (float v) {
        vec4 pack = fract(vec4(1.0, 255.0, 65025.0, 16581375.0) * v);
        pack -= pack.yzww * vec2(1.0 / 255.0, 0.0).xxxy;
        return pack;
    }

    void main() {
        gl_FragColor = packRGBA(gl_FragCoord.z);
    }
