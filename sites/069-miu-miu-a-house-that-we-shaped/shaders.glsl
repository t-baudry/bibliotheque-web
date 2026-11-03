// ===== shader 1 — 002-vendor.BGeYFsBob24d0b8d.js =====
varying vec2 vUv;uniform mat3 uvTransform;void main(){vUv=(uvTransform*vec3(uv,1)).xy;gl_Position=vec4(position.xy,1.0,1.0);}

// ===== shader 2 — 002-vendor.BGeYFsBob24d0b8d.js =====
precision mediump float;precision mediump int;uniform float flipEnvMap;varying vec3 vOutputDirection;uniform samplerCube envMap;void main(){gl_FragColor=textureCube(envMap,vec3(flipEnvMap*vOutputDirection.x,vOutputDirection.yz));}

// ===== shader 3 — 002-vendor.BGeYFsBob24d0b8d.js =====
precision mediump float;precision mediump int;attribute float faceIndex;varying vec3 vOutputDirection;vec3 getDirection(vec2 uv,float face){uv=2.0*uv-1.0;vec3 direction=vec3(uv,1.0);if(face==0.0){direction=direction.zyx;}else if(face==1.0){direction=direction.xzy;direction.xz*=-1.0;}else if(face==2.0){direction.x*=-1.0;}else if(face==3.0){direction=direction.zyx;direction.xz*=-1.0;}else if(face==4.0){direction=direction.xzy;direction.xy*=-1.0;}else if(face==5.0){direction.z*=-1.0;}return direction;}void main(){vOutputDirection=getDirection(uv,faceIndex);gl_Position=vec4(position,1.0);}

// ===== shader 4 — 002-vendor.BGeYFsBob24d0b8d.js =====

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

// ===== shader 5 — 004-loader.1ikZMdAgb24d0b8d.js =====
precision highp float;uniform mat4 modelMatrix;uniform mat4 viewMatrix;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;uniform mat3 normalMatrix;uniform float uOutsideCameraX;uniform float uVisibleWidth;uniform vec2 uBleed;in vec3 position;in vec2 uv;out vec2 vUv;out vec2 vPosition;void main(){vec3 pos=position;pos.xy*=(1.0+2.0*uBleed);vec4 mpos=modelMatrix*vec4(pos,1.0);float dist=mpos.x-uOutsideCameraX;float maxCurveDist=max(20.0,uVisibleWidth);float maxCurve=3.0;float t=clamp(dist*dist/(maxCurveDist*maxCurveDist),0.0,1.0);vec4 mvPosition=viewMatrix*mpos;vUv=uv;vPosition=mpos.xy;gl_Position=projectionMatrix*mvPosition;}

// ===== shader 6 — 004-loader.1ikZMdAgb24d0b8d.js =====
precision highp float;uniform sampler2D uTexture;uniform vec2 uUvScale;uniform vec2 uBleed;uniform vec3 uTopBgColor;uniform vec3 uBottomBgColor;uniform vec3 uLeftBgColor;uniform vec3 uRightBgColor;in vec2 vUv;in vec2 vPosition;out vec4 outColor;float linearstep(float edge0,float edge1,float x){return clamp((x-edge0)/(edge1-edge0),0.0,1.0);}void main(){vec2 baseUv=(vUv-0.5)*(1.0+2.0*uBleed)+0.5;vec2 imgUv=(baseUv-0.5)*uUvScale+0.5;float BLEND_DIST=0.04;float dTop=max(0.0,imgUv.y-(1.0-BLEND_DIST));float dBottom=max(0.0,BLEND_DIST-imgUv.y);float dRight=max(0.0,imgUv.x-(1.0-BLEND_DIST));float dLeft=max(0.0,BLEND_DIST-imgUv.x);float totalWeight=dTop+dBottom+dLeft+dRight;vec3 bgColor=uTopBgColor;if(totalWeight>0.0){bgColor=(uTopBgColor*dTop+uBottomBgColor*dBottom+uLeftBgColor*dLeft+uRightBgColor*dRight)/totalWeight;}vec2 clampedUv=clamp(imgUv,0.0,1.0);vec3 texCol=texture(uTexture,clampedUv).rgb;float edgeDist=min(min(imgUv.y,1.0-imgUv.y),min(imgUv.x,1.0-imgUv.x));float bgMix=1.0-linearstep(0.0,BLEND_DIST,edgeDist);vec3 col=mix(texCol,bgColor,bgMix);outColor=vec4(col,1.0);}

// ===== shader 7 — 004-loader.1ikZMdAgb24d0b8d.js =====
precision highp float;varying vec2 vUv;void main(){gl_FragColor=vec4(vUv,0.,1.);}

// ===== shader 8 — 004-loader.1ikZMdAgb24d0b8d.js =====
precision highp float;in vec2 vUv;out vec4 fragColor;void main(){fragColor=vec4(vUv,0.,1.);}

// ===== shader 9 — 004-loader.1ikZMdAgb24d0b8d.js =====
precision highp float;
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif
uniform mat4 modelMatrix;uniform mat4 viewMatrix;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;uniform mat3 normalMatrix;uniform float uOutsideCameraX;uniform float uVisibleWidth;in vec3 position;in vec2 uv;out vec2 vUv;out vec2 vPosition;void main(){vec3 pos=position;vec4 mpos=modelMatrix*vec4(pos,1.0);float dist=mpos.x-uOutsideCameraX;float maxCurveDist=max(20.0,uVisibleWidth);float maxCurve=2.0;float t=clamp(dist*dist/(maxCurveDist*maxCurveDist),0.0,1.0);mpos.z-=t*maxCurve;vec4 mvPosition=viewMatrix*mpos;vUv=uv;vPosition=mpos.xy;gl_Position=projectionMatrix*mvPosition;}