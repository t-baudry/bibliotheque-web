// ===== shader 1 — 003-vendor.skP70cxAbb947c09.js =====
varying vec2 vUv;uniform mat3 uvTransform;void main(){vUv=(uvTransform*vec3(uv,1)).xy;gl_Position=vec4(position.xy,1.0,1.0);}

// ===== shader 2 — 003-vendor.skP70cxAbb947c09.js =====
precision mediump float;precision mediump int;uniform float flipEnvMap;varying vec3 vOutputDirection;uniform samplerCube envMap;void main(){gl_FragColor=textureCube(envMap,vec3(flipEnvMap*vOutputDirection.x,vOutputDirection.yz));}

// ===== shader 3 — 003-vendor.skP70cxAbb947c09.js =====
precision mediump float;precision mediump int;attribute float faceIndex;varying vec3 vOutputDirection;vec3 getDirection(vec2 uv,float face){uv=2.0*uv-1.0;vec3 direction=vec3(uv,1.0);if(face==0.0){direction=direction.zyx;}else if(face==1.0){direction=direction.xzy;direction.xz*=-1.0;}else if(face==2.0){direction.x*=-1.0;}else if(face==3.0){direction=direction.zyx;direction.xz*=-1.0;}else if(face==4.0){direction=direction.xzy;direction.xy*=-1.0;}else if(face==5.0){direction.z*=-1.0;}return direction;}void main(){vOutputDirection=getDirection(uv,faceIndex);gl_Position=vec4(position,1.0);}

// ===== shader 4 — 003-vendor.skP70cxAbb947c09.js =====

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

// ===== shader 5 — 005-loader._F6p7dbabb947c09.js =====
precision highp float;varying vec2 vUv;void main(){gl_FragColor=vec4(vUv,0.,1.);}

// ===== shader 6 — 005-loader._F6p7dbabb947c09.js =====
precision highp float;in vec2 vUv;out vec4 fragColor;void main(){fragColor=vec4(vUv,0.,1.);}

// ===== shader 7 — 005-loader._F6p7dbabb947c09.js =====
precision highp float;

varying vec2 vUv;

uniform sampler2D blurTexture1;
uniform sampler2D blurTexture2;
uniform sampler2D blurTexture3;
uniform sampler2D blurTexture4;
uniform sampler2D blurTexture5;

uniform float bloomStrength;
uniform float bloomRadius;

uniform float bloomFactors[NUM_MIPS];
uniform vec3 bloomTintColors[NUM_MIPS];

float lerpBloomFactor(const in float factor) {
  float mirrorFactor = 1.2 - factor;
  return mix(factor, mirrorFactor, bloomRadius);
}

void main() {
  gl_FragColor = bloomStrength * (
      lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0)
      * texture2D(blurTexture1, vUv) +
      lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0)
      * texture2D(blurTexture2, vUv) +
      lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0)
      * texture2D(blurTexture3, vUv) +
      lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0)
      * texture2D(blurTexture4, vUv) +
      lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0)
      * texture2D(blurTexture5, vUv)
    );
}


// ===== shader 8 — 005-loader._F6p7dbabb947c09.js =====
void main() {
  gl_Position = vec4(position.xy, 0., 1.);
  gl_Position.z = gl_Position.w;
}


// ===== shader 9 — 005-loader._F6p7dbabb947c09.js =====
attribute vec3 position;
attribute vec2 UV_MAP;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
void main() {
  vUv = UV_MAP;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}


// ===== shader 10 — 005-loader._F6p7dbabb947c09.js =====

      varying vec2 v_uv;
      uniform float u_flipY;
      void main() {
        v_uv = uv;
        if (u_flipY > 0.5) v_uv.y = 1.0 - v_uv.y;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    

// ===== shader 11 — 005-loader._F6p7dbabb947c09.js =====

      precision mediump float;
      varying vec2 v_uv;
      uniform sampler2D u_texture;
      void main() {
        gl_FragColor = texture2D(u_texture, v_uv);
      }
    

// ===== shader 12 — 005-loader._F6p7dbabb947c09.js =====
#define PI 3.14159265359

attribute float aVerticalProgress;
attribute float aSeed;
attribute float aPoloIndex;

uniform float uPoloFX[5];
uniform float time;
uniform sampler3D tPerlinNoise3d;
uniform float uParticleSize;
uniform float uEscapeScale;
uniform float uSpiralRevolutions;
uniform float uHelixRise;
uniform float uHelixRadius;
uniform float uStitchCount;
uniform float uStitchAmplitude;
uniform float uPoloCenterX[5];
uniform float uPoloCenterZ[5];
uniform vec3 uPoloColors[5];
uniform sampler2D tShapeProfile;

varying float vAlpha;
varying vec2 vUv;
varying vec3 vColor;


void main() {
  // 1. Base position (machine-local) from instance matrix translation
  vec3 localBase = vec3(instanceMatrix[3]);

  // 2. Read this polo

// ===== shader 13 — 005-loader._F6p7dbabb947c09.js =====
varying float vAlpha;
varying vec2 vUv;
varying vec3 vColor;

uniform vec3 uGlassColor;
uniform float uGlassBlend;

#define gl_FragColor pc_fragColor
layout(location = 0) out vec4 pc_fragColor;


void main() {
  float dist   = length(vUv - 0.5) * 2.0;
  float circle = 1.0 - smoothstep(0.3, 1.0, dist);
  float a      = circle * vAlpha;

  if (a < 0.001) discard;

  vec3 color = mix(vColor, uGlassColor, uGlassBlend);
  gl_FragColor = vec4((color + .1) * 2., a);
}
