// ===== shader 1 — 003-app.6a6f75.js =====
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 003-app.6a6f75.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
  vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
  gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 003-app.6a6f75.js =====
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
    

// ===== shader 4 — 003-app.6a6f75.js =====


      precision mediump float;
      precision mediump int;

      uniform float flipEnvMap;

      varying vec3 vOutputDirection;

      uniform samplerCube envMap;

      void main() {

        gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

      }
    

// ===== shader 5 — 003-app.6a6f75.js =====


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
  

// ===== shader 6 — 003-app.6a6f75.js =====

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

// ===== shader 7 — 003-app.6a6f75.js =====
precision highp float;
struct ColorData {
  float progress;
  vec3 color01;
  float noise01;
  vec3 color02;
  float noise02;
  vec3 color03;
  float noise03;
};
uniform float uAlpha;
uniform float uTime;
uniform float uSpeed;
uniform float uRotateSpeed;
uniform float uZoom;
uniform float uGrainAmount;
uniform float uBlurAmount;
uniform float uNoiseStrength;
uniform float uNoiseOffset;
uniform float uMix;
uniform float uTextAlpha;
uniform float uTextScale;
uniform float uTextOffset;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform vec2 uVideoSize;
uniform vec2 uTextSize;
uniform ColorData uColorIndex;
uniform sampler2D uVideoTexture;
uniform sampler2D uTextTexture;
uniform sampler2D uCursorTexture;
varying vec2 vUv;
vec2 aspect(in vec2 size, in float scale) {
  return scale / size;
}
vec2 aspectCover(vec2 uv, vec2 imageSize, vec2 meshSize) {
  vec2 sizeRatio = imageSize / meshSize;
  vec2 newSize = aspect(sizeRatio, min(sizeRatio.x, sizeRatio.y));
  vec2 centeredSize = (uv * newSize) + ((1. - newSize) * 0.5);
  return centeredSize;
}
vec2 aspectContain(vec2 uv, vec2 imageSize, vec2 meshSize) {
  vec2 sizeRatio = imageSize / meshSize;
  vec2 newSize = aspect(sizeRatio, max(sizeRatio.x, sizeRatio.y));
  vec2 centeredSize = (uv * newSize) + ((1. - newSize) * 0.5);
  return centeredSize;
}
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
vec3 draw(sampler2D image, vec2 uv) {
  return texture2D(image, vec2(uv.x, uv.y)).rgb;
}
vec3 blur(vec2 uv, sampler2D image, float blurAmount) {
  vec3 blurredImage = vec3(0.);
  float gradient = smoothstep(0.8, 0.0, (gl_FragCoord.y / uResolution.y) / uResolution.y);
  float repeats = 40.;
  for (float i = 0.; i < repeats; i++) {
    vec2 q = vec2(cos(degrees((i / repeats) * 360.)), sin(degrees((i / repeats) * 360.))) * (random(vec2(i, uv.x + uv.y)) + blurAmount);
    vec2 uv2 = uv + ((q * blurAmount) * gradient);
    blurredImage += (draw(image, uv2) / 2.);
    q = vec2(cos(degrees((i / repeats) * 360.)), sin(degrees((i / repeats) * 360.))) * (random(vec2(i + 2., (uv.x + uv.y) + 24.)) + blurAmount);
    uv2 = uv + ((q * blurAmount) * gradient);
    blurredImage += (draw(image, uv2) / 2.);
  }
  return blurredImage / repeats;
}
vec3 mod289(vec3 x) {
  return x - (floor(x * (1.0 / 289.0)) * 289.0);
}
vec2 mod289(vec2 x) {
  return x - (floor(x * (1.0 / 289.0)) * 289.0);
}
vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 10.0) * x);
}
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = (v - i) + dot(i, C.xx);
  vec2 i1;
  i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute((permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x) + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = (2.0 * fract(p * C.www)) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= (1.79284291400159 - (0.85373472095314 * ((a0 * a0) + (h * h))));
  vec3 g;
  g.x = (a0.x * x0.x) + (h.x * x0.y);
  g.yz = (a0.yz * x12.xz) + (h.yz * x12.yw);
  return 130.0 * dot(m, g);
}
vec2 rotateUV(vec2 uv, float rotation) {
  float mid = 0.5;
  return vec2(((cos(rotation) * (uv.x - mid)) + (sin(rotation) * (uv.y - mid))) + mid, ((cos(rotation) * (uv.y - mid)) - (sin(rotation) * (uv.x - mid))) + mid);
}
float noise(in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = (f * f) * (3.0 - (2.0 * f));
  return (mix(a, b, u.x) + (((c - a) * u.y) * (1.0 - u.x))) + (((d - b) * u.x) * u.y);
}
float blendOverlay(float base, float blend) {
  return base < 0.5 ? (2.0 * base) * blend : 1.0 - ((2.0 * (1.0 - base)) * (1.0 - blend));
}
vec3 blendOverlay(vec3 base, vec3 blend) {
  return vec3(blendOverlay(base.r, blend.r), blendOverlay(base.g, blend.g), blendOverlay(base.b, blend.b));
}
vec3 blendHardLight(vec3 base, vec3 blend) {
  return blendOverlay(blend, base);
}
void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 normalizeUvScale = vec2(min(aspect, 1.0), min(1.0 / aspect, 1.0));
  vec2 uv = ((vUv - 0.5) * normalizeUvScale) + 0.5;
  vec2 baseUv = vUv;
  float speed = uSpeed;
  float amplitude = 0.1;
  float time = uTime * speed;
  vec3 bgColor = uColorIndex.color03;
  vec4 mouseTex = texture2D(uCursorTexture, uv);
  float vx = -((mouseTex.b * 2.) - 1.);
  float vy = (mouseTex.g * 2.) - 1.;
  uv.x += ((vx * 0.2) * mouseTex.r);
  uv.y += ((vy * 0.5) * mouseTex.b);
  vec3 color1 = uColorIndex.color01;
  vec3 color2 = uColorIndex.color02;
  vec3 color3 = uColorIndex.color03;
  vec2 noisedUv = uv + ((snoise((uv + time) + uNoiseOffset) * 0.2) * uNoiseStrength);
  noisedUv = rotateUV(noisedUv, (0.5 * uTime) * uRotateSpeed);
  float noise1 = snoise(noisedUv * uColorIndex.noise01) * uNoiseStrength;
  float noise2 = snoise(noisedUv * uColorIndex.noise02) * uNoiseStrength;
  float noise3 = snoise(noisedUv * uColorIndex.noise03) * uNoiseStrength;
  vec3 noiseColor1 = color1 * noise1;
  vec3 noiseColor2 = color2 * noise2;
  vec3 noiseColor3 = color3 * noise3;
  vec3 color = mix(color1, color2, noisedUv.x);
  color = mix(color, color3, noisedUv.y) + 0.03;
  vec2 videoUv = aspectCover(vUv, uVideoSize, uResolution);
  vec4 videoTex = texture2D(uVideoTexture, videoUv);
  vec3 finalVideo = blur(videoUv, uVideoTexture, uBlurAmount);
  vec2 grainedUv = uv + noise(uv * 400.0);
  float grainSpeed = 20.0;
  float grain = noise(grainedUv + ((uTime * random(grainedUv)) * grainSpeed));
  vec3 bg = vec3(grain) * uGrainAmount;
  baseUv.x += ((vx * amplitude) * mouseTex.b);
  baseUv.y += ((vy * amplitude) * mouseTex.b);
  vec2 textUv = aspectContain(baseUv, uTextSize, uResolution);
  textUv = ((textUv - 0.5) * uTextScale) + 0.5;
  textUv.y += uTextOffset;
  vec4 text = texture2D(uTextTexture, textUv);
  text.rgb *= 0.4;
  text.rgb *= uTextAlpha;
  vec2 imageLimit = abs(floor(textUv));
  vec4 imageCropped = mix(vec4(0., 0., 0., 1.), text, step(max(imageLimit.x, imageLimit.y), 0.));
  float cursorInfluence = smoothstep(0.0, 1.0, mouseTex.r);
  vec3 finalColor = color.rgb * imageCropped.r;
  vec3 backgroundColor = color.rgb - finalColor.rgb;
  vec3 blendColor = blendHardLight(color.rgb, finalColor);
  blendColor += ((blendColor * (6. * mouseTex.b)) * 0.3);
  vec3 finalBackground = mix(backgroundColor, finalVideo, uMix);
  gl_FragColor = vec4(finalBackground + blendColor, uAlpha);
}


// ===== shader 8 — 003-app.6a6f75.js =====
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;
  gl_Position = projectionMatrix * mvPosition;
}
