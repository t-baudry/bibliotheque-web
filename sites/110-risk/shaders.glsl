// ===== shader 1 — 004-unicornStudio.umd.js =====

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main() {
    vTextureCoord = aTextureCoord;
    vVertexPosition = aVertexPosition;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}


// ===== shader 2 — 004-unicornStudio.umd.js =====

void main() {
    vTextureCoord = aTextureCoord;
    vVertexPosition = aVertexPosition;
    
    gl_Position = vec4(aVertexPosition, 1.0);
}


// ===== shader 3 — 004-unicornStudio.umd.js =====

uniform sampler2D uRenderTexture;

void main() {
    gl_FragColor = texture2D(uRenderTexture, vTextureCoord);
}


// ===== shader 4 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision highp float;in vec2 vTextureCoord;uniform vec2 uMousePos;const float PI = 3.14159265359;vec2 rotate(vec2 coord, float angle) {
float s = sin(angle);
float c = cos(angle);
return vec2(
coord.x * c - coord.y * s,
coord.x * s + coord.y * c
);
}out vec4 fragColor;vec3 getBgColor(vec2 uv) {return vec3(0, 0, 0);
}void main() {vec2 uv = vTextureCoord;
vec2 pos = vec2(0.5, 0.5) + mix(vec2(0), (uMousePos-0.5), 0.0000);
uv -= pos;
uv /= max(0.5000*2., 1e-5);
uv = rotate(uv, (0.0000 - 0.5) * 2. * PI);
vec4 color = vec4(getBgColor(uv), 1.0) * 1.0000;
fragColor = color;
}

// ===== shader 5 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision mediump float;in vec3 aVertexPosition;
in vec2 aTextureCoord;uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;out vec2 vTextureCoord;
out vec3 vVertexPosition;void main() {
gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
vTextureCoord = aTextureCoord;
}

// ===== shader 6 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision highp float;in vec2 vTextureCoord;
in vec3 vVertexPosition;uniform sampler2D uSourceImage;uniform vec2 uArtboardResolution;
uniform vec2 uMousePos;
uniform sampler2D uBgTexture;const float TAU = 6.28318530718;
const float PI = 3.14159265359;out vec4 fragColor;vec4 sampleImage(vec2 canvasUV, vec2 mouseOffset, vec2 mouseRotOffset) {
vec2 canvasPos = vec2(canvasUV.x * uArtboardResolution.x, (1.0 - canvasUV.y) * uArtboardResolution.y);
vec2 imageUV;float imageAspect = vec2(1920, 1200).x / vec2(1920, 1200).y;
float canvasAspect = uArtboardResolution.x / uArtboardResolution.y;
vec2 fitSize = vec2(
(canvasAspect < imageAspect) ? uArtboardResolution.y * imageAspect : uArtboardResolution.x,
(canvasAspect < imageAspect) ? uArtboardResolution.y : uArtboardResolution.x / imageAspect
);
vec2 offset = (uArtboardResolution - fitSize) * 0.5;
vec2 adjustedPos = canvasPos + mouseOffset;
imageUV = (adjustedPos - offset) / fitSize;
vec2 flippedUV = vec2(imageUV.x, 1.0 - imageUV.y);
vec4 color = textureLod(uSourceImage, flippedUV, 0.0);
if (imageUV.x >= 0.0 && imageUV.x <= 1.0 && imageUV.y >= 0.0 && imageUV.y <= 1.0) {
return color;
} else {
return vec4(0.0);
}
}vec4 getNormalOutput(vec4 color, vec4 background) {
return mix(background, color + background * (1.0 - color.a), 1.0000 * color.a);
}vec4 getOutputByMode(vec4 color, vec4 background) {
return getNormalOutput(color, background);
}vec4 applyImageAdjustments(vec4 color) {color.rgb *= color.a;color.rgb = clamp(color.rgb, 0.0, 1.0);
return color;
}vec4 getCompositeOutput(vec2 uv, vec2 mouseOffsetPx, vec2 mouseRotOffset) {
vec4 background = vec4(0);background = texture(uBgTexture, vTextureCoord);
vec4 color = sampleImage(uv, mouseOffsetPx, mouseRotOffset);
color = applyImageAdjustments(color);return getOutputByMode(color, background);
}void main() {
vec2 uv = vTextureCoord;
vec2 mouseOffsetUV = (uMousePos - 0.5) * 0.0000;
vec2 mouseOffsetPx = mouseOffsetUV;
vec2 mouseRotOffset = (uMousePos - 0.5) * 0.0000 * PI * 0.5;
uv -= mouseOffsetUV;
fragColor = getCompositeOutput(uv, mouseOffsetPx, mouseRotOffset);
}

// ===== shader 7 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision highp float;in vec3 aVertexPosition;
in vec2 aTextureCoord;uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform vec2 uMousePos;out vec2 vTextureCoord;
out vec3 vVertexPosition;void main() {
float angleX = uMousePos.y * 0.5 - 0.25;
float angleY = (1.-uMousePos.x) * 0.5 - 0.25;mat4 rotateX = mat4(1.0, 0.0, 0.0, 0.0,
0.0, cos(angleX), -sin(angleX), 0.0,
0.0, sin(angleX), cos(angleX), 0.0,
0.0, 0.0, 0.0, 1.0);
mat4 rotateY = mat4(cos(angleY), 0.0, sin(angleY), 0.0,
0.0, 1.0, 0.0, 0.0,
-sin(angleY), 0.0, cos(angleY), 0.0,
0.0, 0.0, 0.0, 1.0);mat4 rotationMatrix = rotateX * rotateY;
gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
vVertexPosition = (rotationMatrix * vec4(aVertexPosition, 1.0)).xyz;
vTextureCoord = (vec4(aTextureCoord, 0.0, 1.0)).xy;
}

// ===== shader 8 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision highp float;
precision highp int;in vec3 vVertexPosition;
in vec2 vTextureCoord;uniform sampler2D uTexture;
uniform vec2 uMousePos;
uniform vec2 uResolution;
float ease (int easingFunc, float t) {
return t;
}out vec4 fragColor;const int kernelSize = 36;
float getGaussianWeight(int index) {
switch(index) {
case 0: return 0.00094768;
case 1: return 0.00151965;
case 2: return 0.00237008;
case 3: return 0.00359517;
case 4: return 0.0053041;
case 5: return 0.00761097;
case 6: return 0.01062197;
case 7: return 0.01441804;
case 8: return 0.01903459;
case 9: return 0.0244409;
case 10: return 0.03052299;
case 11: return 0.03707432;
case 12: return 0.04379813;
case 13: return 0.05032389;
case 14: return 0.05623791;
case 15: return 0.06112521;
case 16: return 0.06461716;
case 17: return 0.06643724;
case 18: return 0.06643724;
case 19: return 0.06461716;
case 20: return 0.06112521;
case 21: return 0.05623791;
case 22: return 0.05032389;
case 23: return 0.04379813;
case 24: return 0.03707432;
case 25: return 0.03052299;
case 26: return 0.0244409;
case 27: return 0.01903459;
case 28: return 0.01441804;
case 29: return 0.01062197;
case 30: return 0.00761097;
case 31: return 0.0053041;
case 32: return 0.00359517;
case 33: return 0.00237008;
case 34: return 0.00151965;
case 35: return 0.00094768;
default: return 0.0;
}
}vec4 GaussianBlur(sampler2D tex, vec2 uv, vec2 direction) {
vec4 color = vec4(0.0);
vec2 pos = vec2(0.5237309300179163, 0.4700396329876757) + mix(vec2(0), (uMousePos-0.5), 0.0000);
float inner = distance(uv, pos);
float outer = max(0., 1.-distance(uv, pos));float amt = 0 <= 1 ? 6. : 11.;
float amount = (0.5400 * amt) * ease(0, mix(inner, outer, 0.2000));
color += texture(tex, uv) * getGaussianWeight(0);
for (int i = 0; i < kernelSize; i++) {
float x = float(i - kernelSize / 2) * amount;
color += texture(tex, uv + vec2(x * 0.001) * direction * vec2(0.5000, 1. - 0.5000)) * getGaussianWeight(i);
}
return color;
}vec4 blur(vec2 uv, vec2 direction) {
return GaussianBlur(uTexture, uv, direction);
}void main() {
vec2 uv = vTextureCoord;
vec4 color = vec4(0);
int dir = 0 % 2;
vec2 direction = dir == 1 ? vec2(0, uResolution.x/uResolution.y) : vec2(1, 0);color = blur(uv, direction);
fragColor = color;}

// ===== shader 9 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision highp float;
precision highp int;in vec3 vVertexPosition;
in vec2 vTextureCoord;uniform sampler2D uTexture;
uniform vec2 uMousePos;
uniform vec2 uResolution;
float ease (int easingFunc, float t) {
return t;
}out vec4 fragColor;const int kernelSize = 36;
float getGaussianWeight(int index) {
switch(index) {
case 0: return 0.00094768;
case 1: return 0.00151965;
case 2: return 0.00237008;
case 3: return 0.00359517;
case 4: return 0.0053041;
case 5: return 0.00761097;
case 6: return 0.01062197;
case 7: return 0.01441804;
case 8: return 0.01903459;
case 9: return 0.0244409;
case 10: return 0.03052299;
case 11: return 0.03707432;
case 12: return 0.04379813;
case 13: return 0.05032389;
case 14: return 0.05623791;
case 15: return 0.06112521;
case 16: return 0.06461716;
case 17: return 0.06643724;
case 18: return 0.06643724;
case 19: return 0.06461716;
case 20: return 0.06112521;
case 21: return 0.05623791;
case 22: return 0.05032389;
case 23: return 0.04379813;
case 24: return 0.03707432;
case 25: return 0.03052299;
case 26: return 0.0244409;
case 27: return 0.01903459;
case 28: return 0.01441804;
case 29: return 0.01062197;
case 30: return 0.00761097;
case 31: return 0.0053041;
case 32: return 0.00359517;
case 33: return 0.00237008;
case 34: return 0.00151965;
case 35: return 0.00094768;
default: return 0.0;
}
}vec4 GaussianBlur(sampler2D tex, vec2 uv, vec2 direction) {
vec4 color = vec4(0.0);
vec2 pos = vec2(0.5237309300179163, 0.4700396329876757) + mix(vec2(0), (uMousePos-0.5), 0.0000);
float inner = distance(uv, pos);
float outer = max(0., 1.-distance(uv, pos));float amt = 1 <= 1 ? 6. : 11.;
float amount = (0.5400 * amt) * ease(0, mix(inner, outer, 0.2000));
color += texture(tex, uv) * getGaussianWeight(0);
for (int i = 0; i < kernelSize; i++) {
float x = float(i - kernelSize / 2) * amount;
color += texture(tex, uv + vec2(x * 0.001) * direction * vec2(0.5000, 1. - 0.5000)) * getGaussianWeight(i);
}
return color;
}vec4 blur(vec2 uv, vec2 direction) {
return GaussianBlur(uTexture, uv, direction);
}void main() {
vec2 uv = vTextureCoord;
vec4 color = vec4(0);
int dir = 1 % 2;
vec2 direction = dir == 1 ? vec2(0, uResolution.x/uResolution.y) : vec2(1, 0);color = blur(uv, direction);
fragColor = color;}

// ===== shader 10 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision highp float;
precision highp int;in vec3 vVertexPosition;
in vec2 vTextureCoord;uniform sampler2D uTexture;
uniform vec2 uMousePos;
uniform vec2 uResolution;
float ease (int easingFunc, float t) {
return t;
}out vec4 fragColor;const int kernelSize = 36;
float getGaussianWeight(int index) {
switch(index) {
case 0: return 0.00094768;
case 1: return 0.00151965;
case 2: return 0.00237008;
case 3: return 0.00359517;
case 4: return 0.0053041;
case 5: return 0.00761097;
case 6: return 0.01062197;
case 7: return 0.01441804;
case 8: return 0.01903459;
case 9: return 0.0244409;
case 10: return 0.03052299;
case 11: return 0.03707432;
case 12: return 0.04379813;
case 13: return 0.05032389;
case 14: return 0.05623791;
case 15: return 0.06112521;
case 16: return 0.06461716;
case 17: return 0.06643724;
case 18: return 0.06643724;
case 19: return 0.06461716;
case 20: return 0.06112521;
case 21: return 0.05623791;
case 22: return 0.05032389;
case 23: return 0.04379813;
case 24: return 0.03707432;
case 25: return 0.03052299;
case 26: return 0.0244409;
case 27: return 0.01903459;
case 28: return 0.01441804;
case 29: return 0.01062197;
case 30: return 0.00761097;
case 31: return 0.0053041;
case 32: return 0.00359517;
case 33: return 0.00237008;
case 34: return 0.00151965;
case 35: return 0.00094768;
default: return 0.0;
}
}vec4 GaussianBlur(sampler2D tex, vec2 uv, vec2 direction) {
vec4 color = vec4(0.0);
vec2 pos = vec2(0.5237309300179163, 0.4700396329876757) + mix(vec2(0), (uMousePos-0.5), 0.0000);
float inner = distance(uv, pos);
float outer = max(0., 1.-distance(uv, pos));float amt = 2 <= 1 ? 6. : 11.;
float amount = (0.5400 * amt) * ease(0, mix(inner, outer, 0.2000));
color += texture(tex, uv) * getGaussianWeight(0);
for (int i = 0; i < kernelSize; i++) {
float x = float(i - kernelSize / 2) * amount;
color += texture(tex, uv + vec2(x * 0.001) * direction * vec2(0.5000, 1. - 0.5000)) * getGaussianWeight(i);
}
return color;
}vec4 blur(vec2 uv, vec2 direction) {
return GaussianBlur(uTexture, uv, direction);
}void main() {
vec2 uv = vTextureCoord;
vec4 color = vec4(0);
int dir = 2 % 2;
vec2 direction = dir == 1 ? vec2(0, uResolution.x/uResolution.y) : vec2(1, 0);color = blur(uv, direction);
fragColor = color;}

// ===== shader 11 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision highp float;
precision highp int;in vec3 vVertexPosition;
in vec2 vTextureCoord;uniform sampler2D uTexture;
uniform vec2 uMousePos;
uniform vec2 uResolution;
float ease (int easingFunc, float t) {
return t;
}
uvec2 pcg2d(uvec2 v) {
v = v * 1664525u + 1013904223u;
v.x += v.y * v.y * 1664525u + 1013904223u;
v.y += v.x * v.x * 1664525u + 1013904223u;
v ^= v >> 16;
v.x += v.y * v.y * 1664525u + 1013904223u;
v.y += v.x * v.x * 1664525u + 1013904223u;
return v;
}float randFibo(vec2 p) {
uvec2 v = floatBitsToUint(p);
v = pcg2d(v);
uint r = v.x ^ v.y;
return float(r) / float(0xffffffffu);
}
float deband() {
return (randFibo(gl_FragCoord.xy) - 0.5) / 255.0;
}out vec4 fragColor;const int kernelSize = 36;
float getGaussianWeight(int index) {
switch(index) {
case 0: return 0.00094768;
case 1: return 0.00151965;
case 2: return 0.00237008;
case 3: return 0.00359517;
case 4: return 0.0053041;
case 5: return 0.00761097;
case 6: return 0.01062197;
case 7: return 0.01441804;
case 8: return 0.01903459;
case 9: return 0.0244409;
case 10: return 0.03052299;
case 11: return 0.03707432;
case 12: return 0.04379813;
case 13: return 0.05032389;
case 14: return 0.05623791;
case 15: return 0.06112521;
case 16: return 0.06461716;
case 17: return 0.06643724;
case 18: return 0.06643724;
case 19: return 0.06461716;
case 20: return 0.06112521;
case 21: return 0.05623791;
case 22: return 0.05032389;
case 23: return 0.04379813;
case 24: return 0.03707432;
case 25: return 0.03052299;
case 26: return 0.0244409;
case 27: return 0.01903459;
case 28: return 0.01441804;
case 29: return 0.01062197;
case 30: return 0.00761097;
case 31: return 0.0053041;
case 32: return 0.00359517;
case 33: return 0.00237008;
case 34: return 0.00151965;
case 35: return 0.00094768;
default: return 0.0;
}
}vec4 GaussianBlur(sampler2D tex, vec2 uv, vec2 direction) {
vec4 color = vec4(0.0);
vec2 pos = vec2(0.5237309300179163, 0.4700396329876757) + mix(vec2(0), (uMousePos-0.5), 0.0000);
float inner = distance(uv, pos);
float outer = max(0., 1.-distance(uv, pos));float amt = 3 <= 1 ? 6. : 11.;
float amount = (0.5400 * amt) * ease(0, mix(inner, outer, 0.2000));
color += texture(tex, uv) * getGaussianWeight(0);
for (int i = 0; i < kernelSize; i++) {
float x = float(i - kernelSize / 2) * amount;
color += texture(tex, uv + vec2(x * 0.001) * direction * vec2(0.5000, 1. - 0.5000)) * getGaussianWeight(i);
}
return color;
}vec4 blur(vec2 uv, vec2 direction) {
return GaussianBlur(uTexture, uv, direction);
}void main() {
vec2 uv = vTextureCoord;
vec4 color = vec4(0);
int dir = 3 % 2;
vec2 direction = dir == 1 ? vec2(0, uResolution.x/uResolution.y) : vec2(1, 0);color = blur(uv, direction);float dither = deband();
color.rgb += dither;
fragColor = color;}

// ===== shader 12 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision mediump float;in vec3 aVertexPosition;
in vec2 aTextureCoord;uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix;out vec2 vTextureCoord;
out vec3 vVertexPosition;void main() {
gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
vTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}

// ===== shader 13 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision highp float;
in vec2 vTextureCoord;
in vec3 vVertexPosition;uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMousePos;
uniform vec2 uResolution;
float ease (int easingFunc, float t) {
return t;
}vec3 hash33(vec3 p3) {
p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
p3 += dot(p3, p3.yxz + 19.19);
return -1.0 + 2.0 * fract(vec3(
(p3.x + p3.y) * p3.z,
(p3.x + p3.z) * p3.y,
(p3.y + p3.z) * p3.x
));
}float perlin_noise(vec3 p) {
vec3 pi = floor(p);
vec3 pf = p - pi;vec3 w = pf * pf * (3.0 - 2.0 * pf);float n000 = dot(pf - vec3(0.0, 0.0, 0.0), hash33(pi + vec3(0.0, 0.0, 0.0)));
float n100 = dot(pf - vec3(1.0, 0.0, 0.0), hash33(pi + vec3(1.0, 0.0, 0.0)));
float n010 = dot(pf - vec3(0.0, 1.0, 0.0), hash33(pi + vec3(0.0, 1.0, 0.0)));
float n110 = dot(pf - vec3(1.0, 1.0, 0.0), hash33(pi + vec3(1.0, 1.0, 0.0)));
float n001 = dot(pf - vec3(0.0, 0.0, 1.0), hash33(pi + vec3(0.0, 0.0, 1.0)));
float n101 = dot(pf - vec3(1.0, 0.0, 1.0), hash33(pi + vec3(1.0, 0.0, 1.0)));
float n011 = dot(pf - vec3(0.0, 1.0, 1.0), hash33(pi + vec3(0.0, 1.0, 1.0)));
float n111 = dot(pf - vec3(1.0, 1.0, 1.0), hash33(pi + vec3(1.0, 1.0, 1.0)));float nx00 = mix(n000, n100, w.x);
float nx01 = mix(n001, n101, w.x);
float nx10 = mix(n010, n110, w.x);
float nx11 = mix(n011, n111, w.x);float nxy0 = mix(nx00, nx10, w.y);
float nxy1 = mix(nx01, nx11, w.y);float nxyz = mix(nxy0, nxy1, w.z);return nxyz;
}out vec4 fragColor;const float PI = 3.14159265359;mat2 rot(float a) {
return mat2(cos(a),-sin(a),sin(a),cos(a));
}vec2 getPerlinNoise(vec2 uv, vec2 textureCoord, float direction, float phase, float time, float turbulence) {
vec2 skew = vec2(direction, 1. - direction);
float noiseX = perlin_noise(vec3(
uv * skew,
phase + time * 0.03
));float noiseY = perlin_noise(vec3(
(uv + vec2(4.37)) * skew,
phase + time * 0.03
));vec2 offset = vec2(noiseX * 1.5, noiseY * 1.5) * 0.5 + 0.5;return mix(textureCoord, offset, turbulence * 1.2);
}vec2 getNoiseOffset(vec2 uv, vec2 textureCoord, float direction, float phase, float time, float turbulence) {
return getPerlinNoise(uv, textureCoord, direction, phase, time, turbulence);
}vec2 distortUV(vec2 uv) {
float aspectRatio = uResolution.x/uResolution.y;vec2 mPos = vec2(0.5, 0.5) + mix(vec2(0), (uMousePos-0.5), 0.5000);
float dist = ease(0, max(0.,1.-distance(uv * vec2(aspectRatio, 1), mPos * vec2(aspectRatio, 1)) * 4. * (1. - 1.0000)));if(dist <= 0.001) {
return uv;
}if(0.2500 <= 0.001) {
return uv;
}vec2 pos = mix(vec2(0.5, 0.5), mPos, floor(1.0000));
vec2 drift = vec2(0, 0.0000 * uTime * 0.0125);
pos += drift * rot(0.0000 * -2. * PI);
vec2 st = (uv - pos) * vec2(aspectRatio, 1);
st *= 12. * 0.5000;
st = rot(0.0000 * -2. * PI) * st;vec2 noise = getNoiseOffset(st, uv, 0.1900, 0.0000, uTime, 0.2500);
return mix(uv, noise, dist);
}void main() {
vec2 uv = vTextureCoord;
uv = distortUV(uv);
vec4 color = texture(uTexture, uv);
fragColor = color;}

// ===== shader 14 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision mediump float;in vec3 aVertexPosition;
in vec2 aTextureCoord;uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix;out vec2 vTextureCoord;
out vec3 vVertexPosition;void main() {
gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
vTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}

// ===== shader 15 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision highp float;
in vec2 vTextureCoord;uniform sampler2D uTexture;
uniform float uAmount;
uniform float uTime;uniform vec2 uMousePos;
uniform vec2 uResolution;float ease (int easingFunc, float t) {
return t < 0.5 ? 16.0 * t * t * t * t * t : 1.0 + 16.0 * (--t) * t * t * t * t;
}const float STEPS = 8.0;
const float PI = 3.14159265359;
const vec3 CH_R = vec3(1, 0, 0);
const vec3 CH_G = vec3(0, 1, 0);
const vec3 CH_B = vec3(0, 0, 1);mat2 rot(float a) {
return mat2(cos(a),-sin(a),sin(a),cos(a));
}vec2 scaleAspect(vec2 st) {
return st * vec2(uResolution.x / uResolution.y, 1.0);
}vec2 unscaleAspect(vec2 st) {
return st * vec2(uResolution.y / uResolution.x, 1.0);
}vec2 scaleAspect(vec2 st, float aspectRatio) {
return st * vec2(aspectRatio, 1.0);
}float smoothSegment(float s) {
return mix(s, smoothstep(0.0, 0.5, s) - smoothstep(0.5, 1.0, s), 0.0000);
}vec3 channelDistort(float segment) {
return mix(mix(CH_R, CH_G, segment * 2.0), mix(CH_G, CH_B, (segment - 0.5) * 2.0), step(0.5, segment));
}vec2 applyStyle(vec2 st, vec2 pos, float angle) {
st = rot(angle * 2. * PI) * (st - pos) + pos;
st = unscaleAspect(st);
return st;
}vec2 style5(vec2 st, vec2 pos, float divisions, float dist, float amount, float angle, out vec3 d) {
vec2 diff = st - pos;
vec2 rotatedDiff = vec2(
diff.x * cos(-PI / 4.) - diff.y * sin(-PI / 4.),
diff.x * sin(-PI / 4.) + diff.y * cos(-PI / 4.)
);
float manhattanDist = abs(rotatedDiff.x) + abs(rotatedDiff.y);
float segment = smoothSegment(fract(manhattanDist * divisions - uTime * 0.05));
d = channelDistort(segment);
st -= pow(d.r, dist) / 10. * amount * normalize(diff);
st += pow(d.b, dist) / 10. * amount * normalize(diff);
return applyStyle(st, pos, angle);
}vec2 getStyle(vec2 st, vec2 pos, float divisions, float dist, float amount, float angle, out vec3 d) {
return style5(st, pos, divisions, dist, amount, angle, d);
}vec2 caUV;
vec3 caDistort;
float caDist;
float caAmount;out vec4 fragColor;vec2 distortUV(vec2 uv) {
float aspectRatio = uResolution.x / uResolution.y;vec2 mPos = vec2(1, 0.5) + mix(vec2(0), (uMousePos - 0.5), 0.0000);
float mDist = ease(12, max(0., 1. - distance(uv * vec2(aspectRatio, 1), mPos * vec2(aspectRatio, 1)) * 4. * (1. - 1.0000)));vec2 pos = scaleAspect(mix(vec2(1, 0.5), mPos, floor(1.0000)));
vec2 st = scaleAspect(uv);
st = rot(0.3753 * -2.0 * PI) * (st - pos) + pos;float divisions = 2. + 0.1000 * 30.;
float dist = 0.0000 * 4. + 1.;
float amount = uAmount * mDist;caDist = dist;
caAmount = amount;
caUV = uv;
caDistort = vec3(0.0);if (abs(amount) <= 0.001) return uv;vec2 texelX = dFdx(st) * 1.5;
vec2 texelY = dFdy(st) * 1.5;vec3 distort;
vec3 scratchDistort;
vec2 result = getStyle(st, pos, divisions, dist, amount, 0.3753, distort);
vec2 result1 = getStyle(st + texelX, pos, divisions, dist, amount, 0.3753, scratchDistort);
vec2 result2 = getStyle(st + texelY, pos, divisions, dist, amount, 0.3753, scratchDistort);
vec2 result3 = getStyle(st - texelX, pos, divisions, dist, amount, 0.3753, scratchDistort);
vec2 result4 = getStyle(st - texelY, pos, divisions, dist, amount, 0.3753, scratchDistort);caUV = result;
caDistort = distort;return (result + result1 + result2 + result3 + result4) / 5.;
}void main() {
vec2 uv = vTextureCoord;
uv = distortUV(uv);
vec4 color = texture(uTexture, uv);
fragColor = color;}

// ===== shader 16 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision mediump float;in vec3 aVertexPosition;
in vec2 aTextureCoord;uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix;out vec2 vTextureCoord;
out vec3 vVertexPosition;void main() {
gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
vTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}

// ===== shader 17 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision highp float;
precision highp int;in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform sampler2D uCustomTexture;uniform float uScale;
uniform float uDispersion;
uniform float uFrost;
uniform float uTime;uniform vec2 uMousePos;
uniform vec2 uResolution;uvec2 pcg2d(uvec2 v) {
v = v * 1664525u + 1013904223u;
v.x += v.y * v.y * 1664525u + 1013904223u;
v.y += v.x * v.x * 1664525u + 1013904223u;
v ^= v >> 16;
v.x += v.y * v.y * 1664525u + 1013904223u;
v.y += v.x * v.x * 1664525u + 1013904223u;
return v;
}float randFibo(vec2 p) {
uvec2 v = floatBitsToUint(p);
v = pcg2d(v);
uint r = v.x ^ v.y;
return float(r) / float(0xffffffffu);
}const float PI = 3.14159265359;
const float TAU = 6.28318530718;
const float PHI = 1.61803398875;
const float FOV_FACTOR = 0.1763269807;
const vec3 CAMERA_POSITION = vec3(0.0, 0.0, -4.25);ivec2 customTexSize;
float customTexAspect;
mat3 shapeRotation;const mat3 ROT_Y_90 = mat3(
0.0, 0.0, 1.0,
0.0, 1.0, 0.0,
-1.0, 0.0, 0.0
);const mat3 ROT_Z_90 = mat3(
0.0, -1.0, 0.0,
1.0, 0.0, 0.0,
0.0, 0.0, 1.0
);const mat3 ROT_X_90 = mat3(
1.0, 0.0, 0.0,
0.0, 0.0, -1.0,
0.0, 1.0, 0.0
);float interleavedGradientNoise(vec2 st) {
return fract(52.9829189 * fract(dot(st, vec2(0.06711056, 0.00583715))));
}mat3 rotY(float ang) {
float c = cos(ang), s = sin(ang);
return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
}mat3 rotX(float ang) {
float c = cos(ang), s = sin(ang);
return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
}mat3 rotZ(float ang) {
float c = cos(ang), s = sin(ang);
return mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
}vec3 twistY(vec3 p, float amount) {
float c = cos(amount * p.y);
float s = sin(amount * p.y);
mat2 m = mat2(c, -s, s, c);
return vec3(m * p.xz, p.y);
}vec3 twistX(vec3 p, float amount) {
float c = cos(amount * p.x);
float s = sin(amount * p.x);
mat2 m = mat2(c, -s, s, c);
return vec3(p.x, m * p.yz);
}float opExtrusion(vec3 p, float d, float h) {
vec2 w = vec2( d, abs(p.z) - h );
return min(max(w.x,w.y),0.0) + length(max(w,0.0));
}float median(float r, float g, float b) {
return max(min(r, g), min(max(r, g), b));
}float sdCustom(vec3 p) {
p *= rotX(radians(90.0));
p *= rotY(radians(180.0));
p *= rotZ(radians(180.0));
vec2 uv = p.xy * 0.25 + 0.5;
if (customTexAspect > 1.0) {
uv.y = (uv.y - 0.5) * customTexAspect + 0.5;
} else {
uv.x = (uv.x - 0.5) / customTexAspect + 0.5;
}vec4 sdColor = texture(uCustomTexture, uv);
float msdf = median(sdColor.r, sdColor.g, sdColor.b);
float sdf = sdColor.a;
float sd = msdf;
if(sdf < 1.) {
float tuning = 0.023;
sd = mix(msdf, max(msdf - tuning, sdf), sdf);
}float screenPxDistance = sd - 0.5;
float d = -screenPxDistance * (2.0 / 3.0);return opExtrusion(p, d, 0.5000 * 0.5);
}vec3 getRepeat(vec3 p) {
float spacing = (0.7800 + 0.0000 * 0.38) * 8.;
return p;
}vec3 getThreeDRepeat(vec3 p) {
float spacing = (0.7800 + 0.0000 * 0.38) * 8.;
return p;
}vec3 getAdjustedP(vec3 p) {
float scale = max(uScale, 0.000000001);
float scaleFactor = 1.0/scale;
vec3 adjustedP = p * scaleFactor;vec2 twist = vec2(0, 0);adjustedP.xy *= vec2(uResolution.x / uResolution.y, 1);adjustedP *= (1. + (0.0000 + 0.01));adjustedP = getRepeat(adjustedP);
adjustedP = shapeRotation * adjustedP;
adjustedP = getThreeDRepeat(adjustedP);if (twist.y != 0.0) {
adjustedP = twistY(adjustedP, -1.0 * twist.y);
} else {
adjustedP = adjustedP.xzy;
}if (twist.x != 0.0) {
adjustedP = twistX(adjustedP, -1.0 * twist.x);
}return adjustedP;
}float getMergedSDF(vec3 p) {
p = getAdjustedP(p);
return sdCustom(p);
}float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
float NdotV = abs(dot(eyeVector, worldNormal));
float width = fwidth(dot(eyeVector, worldNormal));
float threshold = 0.2;
float edgeDampFactor = smoothstep(threshold, -threshold, width);
float fresnelFactor = 1.0 - NdotV;
return pow(fresnelFactor, power) * mix(1., edgeDampFactor * 2., 0.5);
}float ign(vec2 st) {
return fract(52.9829189 * fract(dot(st, vec2(0.06711056, 0.00583715))));
}float ignGaussian4(vec2 st) {
float n0 = ign(st + vec2(0.5, 0.5));
float n1 = ign(st + vec2(5.2, 1.3));
float n2 = ign(st + vec2(1.7, 9.2));
float n3 = ign(st + vec2(8.3, 2.8));
return (n0 + n1 + n2 + n3 - PHI) * PHI;
}vec2 rot90(vec2 v) {
return vec2(v.y, -v.x);
}float getSignedSDF(vec3 p) {
return (getMergedSDF(p) - (0.0000 + 0.005)) * max(uScale, 0.000000001) / (1.01 + 0.0000);
}float getFinalSDF(vec3 p) {
return max(0.0000000001 * max(uScale, 0.000000001), getSignedSDF(p));
}vec3 calculateNormal(vec3 p, float eps) {
vec2 e = vec2(1.0, -1.0) * eps * 0.5;
return normalize(
e.xyy * getMergedSDF(p + e.xyy) +
e.yyx * getMergedSDF(p + e.yyx) +
e.yxy * getMergedSDF(p + e.yxy) +
e.xxx * getMergedSDF(p + e.xxx)
);
}vec3 perturbSurfaceNormal(vec3 p, vec3 normal) {return normal;
}float getShapeBoundRadius() {
return 4.0 * max(uScale, 0.0001);
}vec2 getChromaOffset(vec2 direction) {
float directionLength = length(direction);
return directionLength > 0.0001
? direction / directionLength * uDispersion * 0.025
: vec2(0.0);
}vec3 sampleDispersionTap(vec2 sampleUV, vec2 chromaOffset, float dispersionStep, vec2 blurOffset) {
vec2 dispersionOffset = chromaOffset * dispersionStep;
vec2 centerOffset = chromaOffset * (dispersionStep - 0.5);
float centerWeight = 1.5 - abs(dispersionStep - 0.5) * 2.0;
return vec3(
texture(uTexture, sampleUV + dispersionOffset + blurOffset).r,
texture(uTexture, sampleUV + centerOffset + blurOffset).g * centerWeight,
texture(uTexture, sampleUV - dispersionOffset + blurOffset).b
);
}vec3 sampleTextureAtUV(vec2 sampleUV, vec2 dispersionDirection) {
vec2 texel = 1.0 / uResolution;
vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
vec2 blurAxis = vec2(0.0);
vec2 blurAxisPerp = vec2(0.0);
if (uFrost > 0.0) {
vec2 px = gl_FragCoord.xy;
float angle = ign(px * 1.212) * PHI;
vec2 screenAxis = vec2(cos(angle), sin(angle));
vec2 axis = screenAxis / aspect;
vec2 axisPerp = rot90(screenAxis) / aspect;
float jitter = clamp(ignGaussian4(px), -2.0, 2.0) * 0.5;
float blurRadius = max(uFrost * 25.0 * texel.y * (1.0 + jitter), 0.0);
blurAxis = axis * blurRadius;
blurAxisPerp = axisPerp * blurRadius;
}
if (uDispersion > 0.0) {
vec2 chromaOffset = getChromaOffset(dispersionDirection);
float tapJitter = (ign(gl_FragCoord.xy) - 0.5) * 0.25;
vec3 dispersionColor = vec3(0.0);
dispersionColor += sampleDispersionTap(sampleUV, chromaOffset, 0.125 + tapJitter, blurAxis);
dispersionColor += sampleDispersionTap(sampleUV, chromaOffset, 0.375 + tapJitter, -blurAxis);
dispersionColor += sampleDispersionTap(sampleUV, chromaOffset, 0.625 + tapJitter, blurAxisPerp);
dispersionColor += sampleDispersionTap(sampleUV, chromaOffset, 0.875 + tapJitter, -blurAxisPerp);
return clamp(dispersionColor * 0.25, 0.0, 1.0);
}
if (uFrost > 0.0) {
return clamp((
texture(uTexture, sampleUV + blurAxis).rgb +
texture(uTexture, sampleUV - blurAxis).rgb +
texture(uTexture, sampleUV + blurAxisPerp).rgb +
texture(uTexture, sampleUV - blurAxisPerp).rgb
) * 0.25, 0.0, 1.0);
}return texture(uTexture, sampleUV).rgb;
}vec3 sampleMaterialTexture(vec3 rd, vec3 entryPoint, vec3 entryNormal, vec2 screenPosition, float eps, vec3 lightDirection, out vec3 backsideEffects) {
vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
vec2 sampleUV = vTextureCoord;
vec2 dispersionDirection = entryNormal.xy / aspect;
backsideEffects = vec3(0.0);vec3 reflectedDirection = refract(
entryPoint,
entryNormal,
1.0 / (1.0 + 1.0000 * 0.25)
);
sampleUV -= reflectedDirection.xy;
dispersionDirection = reflectedDirection.xy / aspect;return sampleTextureAtUV(sampleUV, dispersionDirection);
}bool getRayBounds(vec3 ro, vec3 rd, out float nearDistance, out float farDistance) {
nearDistance = 0.0;
farDistance = 32.0;float radius = getShapeBoundRadius();
float b = dot(ro, rd);
float c = dot(ro, ro) - radius * radius;
float discriminant = b * b - c;if (discriminant < 0.0) return false;float root = sqrt(discriminant);
nearDistance = max(-b - root, 0.0);
farDistance = min(-b + root, farDistance);
return farDistance > nearDistance;
}void setShapeRotation() {
vec2 mousePosition = mix(vec2(0.0), uMousePos - 0.5, 0.2000);
vec2 axis = vec2(-vec3(0.5, 0.5, 0.5).y - 1.0 + mousePosition.y / PI, vec3(0.5, 0.5, 0.5).x + mousePosition.x / PI) * 2.0;
float baseTime = uTime * 0.02;
vec3 animation = vec3(0, 1, 0) * baseTime;mat3 baseRotation = rotZ(vec3(0.5, 0.5, 0.5).z * TAU) * rotY(axis.y * PI) * rotX(axis.x * PI);
mat3 animationRotation = rotZ(animation.z) * rotX(animation.x) * rotY(animation.y);
shapeRotation = animationRotation * baseRotation;
}const int STEPS = 72;vec4 raymarch(vec3 ro, vec3 rd, vec4 bg, vec2 screenPosition) {
float jitter = interleavedGradientNoise(gl_FragCoord.xy);
float nearDistance;
float farDistance;if (!getRayBounds(ro, rd, nearDistance, farDistance)) {
return bg;
}setShapeRotation();
float pixelAngle = 2.0 * FOV_FACTOR / max(uResolution.y, 1.0);
float traveled = nearDistance + jitter * max(0.0005, nearDistance * pixelAngle);
vec3 entryPoint = vec3(0.0);
vec3 entryNormal = vec3(0.0);
float partialAlpha = 0.0;
float hitPixelSize = 0.0005;
float smoothing = mix(1., 4., 0.0000);for (int i = 0; i < STEPS; ++i) {
vec3 currentPos = ro + rd * traveled;
float distance = getFinalSDF(currentPos);
float pixelSize = max(0.0005, traveled * pixelAngle);
float coverage = 1.0 - smoothstep(pixelSize * 0.25, pixelSize * 1.25, distance);
float progress = float(i)/float(STEPS);
float step = distance * mix(0.65, 1.0, progress);if (coverage > partialAlpha) {
partialAlpha = coverage;
entryPoint = currentPos;
hitPixelSize = pixelSize;
}if (partialAlpha >= 0.999) break;traveled += max(step, pixelSize * 0.5);
if (traveled > farDistance) break;
}if (partialAlpha == 0.0) {
return bg;
}entryNormal = perturbSurfaceNormal(
entryPoint,
calculateNormal(entryPoint, hitPixelSize * smoothing)
);vec3 lightDir = vec3(((vec2(vec3(0.25, 0.25, -3).x, 1.-vec3(0.25, 0.25, -3).y) - 0.333) * 3.) - vec2(0.5, 0.5), vec3(0.25, 0.25, -3).z);
vec3 normLightDir = normalize(lightDir);
vec3 lightColor = mix(vec3(1), vec3(1, 1, 1), 1. - 0.0000);vec3 refractionColor = vec3(0.0);
vec3 backsideEffects = vec3(0.0);
float interiorPixelSize = max(hitPixelSize, 0.005);refractionColor = sampleMaterialTexture(
rd,
entryPoint,
entryNormal,
screenPosition,
interiorPixelSize,
normLightDir,
backsideEffects
);float lightAndShadow = max(dot(entryNormal, normLightDir), 0.0);
vec3 fresnelEffect = vec3(0.0);fresnelEffect = fresnel(rd, entryNormal, 8.0) * 0.2000 * vec3(1, 1, 1);vec3 specularEffect = vec3(0.0);vec3 combinedEffects = fresnelEffect + specularEffect + backsideEffects;
vec3 finalColor = mix(refractionColor, vec3(1, 1, 1) * lightAndShadow, 0.0000);
finalColor += combinedEffects;vec4 outputColor = vec4(finalColor, 1.);return mix(bg, outputColor, partialAlpha);
}out vec4 fragColor;void main() {
vec4 col = vec4(0);
vec2 uv = vTextureCoord;customTexSize = textureSize(uCustomTexture, 0);
customTexAspect = float(customTexSize.x) / float(customTexSize.y);if(float(customTexSize.x) == float(uResolution.x) && float(customTexSize.y) == float(uResolution.y)) {
discard;
}vec4 bg = vec4(0.0);
bg = texture(uTexture, uv);
if(uScale <= 0.0001 || 1.0000 <= 0.0001) {
col = vec4(0);
if(1 == 1) {
col = bg;
}
fragColor = col;
return;
}vec2 pos = vec2(0.5, 0.5) + mix(vec2(0), (uMousePos-0.5), 0.0000);
uv = uv - pos;
vec3 rd = normalize(vec3(uv * FOV_FACTOR, 0.5));
col = raymarch(CAMERA_POSITION, rd, bg, pos);
float dither = (randFibo(vTextureCoord.xy) - 0.5) / 255.0;
col.rgb += dither * col.a;col = mix(bg, col, 1.0000);
fragColor = col;}

// ===== shader 18 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision mediump float;in vec3 aVertexPosition;
in vec2 aTextureCoord;uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix;out vec2 vTextureCoord;
out vec3 vVertexPosition;void main() {
gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
vTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}

// ===== shader 19 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision highp float;
in vec2 vTextureCoord;
in vec3 vVertexPosition;uniform vec2 uMousePos;
uniform sampler2D uBgTexture;
uniform sampler2D uTexture;vec3 blend (int blendMode, vec3 src, vec3 dst) {
return src + dst - 2.0 * src * dst;
}const float PI = 3.14159265359;out vec4 fragColor;vec4 getNormalOutput(vec4 color, vec4 background) {
vec3 unpremultColor = color.rgb / max(color.a, 0.0001);
vec3 blendedColor = blend(14, unpremultColor, background.rgb);
color = vec4(blendedColor, 1.0) * (color.a * 1.0000);
color = color + background * (1.0 - color.a);
return color;
return mix(background, color + background * (1.0 - color.a), 1.0000);
}vec4 getOutputByMode(vec4 color, vec4 background) {
return getNormalOutput(color, background);
}void main() {
vec2 uv = vTextureCoord;
vec2 pos = vec2(0);pos = mix(vec2(0), (uMousePos - 0.5), 0.0000);uv -= pos;vec4 background = vec4(0);background = texture(uBgTexture, vTextureCoord);
vec4 color = texture(uTexture, uv);vec4 col = getOutputByMode(color, background);fragColor = col;
}

// ===== shader 20 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision highp float;in vec3 aVertexPosition;
in vec2 aTextureCoord;uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix;
uniform vec2 uMousePos;out vec2 vTextureCoord;
out vec3 vVertexPosition;void main() {
float angleX = uMousePos.y * 0.5 - 0.25;
float angleY = (1.-uMousePos.x) * 0.5 - 0.25;mat4 rotateX = mat4(1.0, 0.0, 0.0, 0.0,
0.0, cos(angleX), -sin(angleX), 0.0,
0.0, sin(angleX), cos(angleX), 0.0,
0.0, 0.0, 0.0, 1.0);
mat4 rotateY = mat4(cos(angleY), 0.0, sin(angleY), 0.0,
0.0, 1.0, 0.0, 0.0,
-sin(angleY), 0.0, cos(angleY), 0.0,
0.0, 0.0, 0.0, 1.0);mat4 rotationMatrix = rotateX * rotateY;
gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
vVertexPosition = (rotationMatrix * vec4(aVertexPosition, 1.0)).xyz;
vTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}

// ===== shader 21 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision highp float;
in vec3 vVertexPosition;
in vec2 vTextureCoord;uniform sampler2D uTexture;uniform vec2 uResolution;const float FXAA_REDUCE_MIN = 0.0078125;
const float FXAA_REDUCE_MUL = 0.125;
const float FXAA_SPAN_MAX = 12.0;
const float FXAA_EDGE_THRESHOLD = 0.166;
const float FXAA_EDGE_THRESHOLD_MIN = 0.0833;
const float FXAA_SUBPIX_QUALITY = 0.75;out vec4 fragColor;void main() {
vec2 res = 1.0 / uResolution;vec3 rgbNW = texture(uTexture, vTextureCoord.xy + vec2(-1.0, -1.0) * res).xyz;
vec3 rgbNE = texture(uTexture, vTextureCoord.xy + vec2( 1.0, -1.0) * res).xyz;
vec3 rgbSW = texture(uTexture, vTextureCoord.xy + vec2(-1.0, 1.0) * res).xyz;
vec3 rgbSE = texture(uTexture, vTextureCoord.xy + vec2( 1.0, 1.0) * res).xyz;
vec4 rgbaM = texture(uTexture, vTextureCoord.xy);
vec3 rgbM = rgbaM.xyz;vec3 luma = vec3(0.299, 0.587, 0.114);
float lumaNW = dot(rgbNW, luma);
float lumaNE = dot(rgbNE, luma);
float lumaSW = dot(rgbSW, luma);
float lumaSE = dot(rgbSE, luma);
float lumaM = dot(rgbM, luma);float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));
float lumaRange = lumaMax - lumaMin;
if (lumaRange < max(FXAA_EDGE_THRESHOLD_MIN, lumaMax * FXAA_EDGE_THRESHOLD)) {
fragColor = rgbaM;
return;
}
float lumaAvg = (lumaNW + lumaNE + lumaSW + lumaSE) * 0.25;
float subpixBlend = clamp(abs(lumaAvg - lumaM) / lumaRange, 0.0, 1.0);
subpixBlend = smoothstep(0.0, 1.0, subpixBlend);
subpixBlend = subpixBlend * subpixBlend * FXAA_SUBPIX_QUALITY;vec2 dir;
dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
dir.y = ((lumaNW + lumaSW) - (lumaNE + lumaSE));float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);dir = min(vec2(FXAA_SPAN_MAX),
max(vec2(-FXAA_SPAN_MAX),
dir * rcpDirMin)) * res;vec4 rgbA = 0.5 * (
texture(uTexture, vTextureCoord.xy + dir * (1.0/3.0 - 0.5)) +
texture(uTexture, vTextureCoord.xy + dir * (2.0/3.0 - 0.5)));vec4 rgbB = rgbA * 0.5 + 0.25 * (
texture(uTexture, vTextureCoord.xy + dir * -0.5) +
texture(uTexture, vTextureCoord.xy + dir * 0.5));float lumaB = dot(rgbB.xyz, luma);vec4 edgeResult;
if (lumaB < lumaMin || lumaB > lumaMax) {
edgeResult = rgbA;
} else {
edgeResult = rgbB;
}fragColor = mix(edgeResult, rgbaM, -subpixBlend);
}

// ===== shader 22 — 005-rsqaxBhELEVaZlhM4M8V.js =====
#version 300 es
// Copyright (c) Unicorn Studio. Licensed under the Unicorn Studio Commercial License.
// Unauthorized copying, redistribution, or use in competing products is prohibited.
precision mediump float;in vec3 aVertexPosition;
in vec2 aTextureCoord;uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix;out vec2 vTextureCoord;
out vec3 vVertexPosition;void main() {
gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
vTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}

// ===== shader 23 — 006-main.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 24 — 006-main.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 25 — 006-main.js =====
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
		

// ===== shader 26 — 006-main.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 27 — 006-main.js =====


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
	

// ===== shader 28 — 006-main.js =====

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

// ===== shader 29 — 006-main.js =====

varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}


// ===== shader 30 — 006-main.js =====

uniform sampler2D uTextureCurrent;
uniform sampler2D uTextureNext;
uniform vec2 uTextureSize;
uniform vec2 uResolution;
uniform float uTime;
uniform float uScrollSpeed;
uniform float uBandSpacing;
uniform float uChevronDepth;
uniform float uBandWidth;
uniform float uBandFeather;
uniform float uRefraction;
uniform float uChroma;
uniform float uEdgePadding;
uniform float uBandCount;
uniform float uTransitionProgress;
uniform float uTransitionFeather;
uniform float uTransitionChevron;

varying vec2 vUv;

vec2 getCoverUV(vec2 uv, vec2 texSize) {
  float screenAspect = uResolution.x / uResolution.y;
  float texAspect = texSize.x / texSize.y;
  vec2 scale = vec2(1.0);
  if (screenAspect > texAspect) {
    scale.y = texAspect / screenAspect;
  } else {
    scale.x = screenAspect / texAspect;
  }
  return (uv - 0.5) * scale + 0.5;
}

float smoothEdge(float x, float padding) {
  if (padding <= 0.0) return 1.0;
  if (x < padding)
    return smoothstep(0.0, padding, x);
  if (x > 1.0 - padding)
    return smoothstep(1.0, 1.0 - padding, x);
  return 1.0;
}

float transitionMask(vec2 uv, float progress) {
  if (progress <= 0.0) return 0.0;
  if (progress >= 1.0) return 1.0;
  float indent = uTransitionChevron;
  float vFactor = indent * abs(2.0 * uv.y - 1.0);
  float edgeX = 1.0 - progress * (1.0 + indent) + vFactor;
  float f = uTransitionFeather;
  return smoothstep(edgeX - f, edgeX + f, uv.x);
}

vec3 sampleGlass(sampler2D tex, vec2 uv, float m, float alt) {
  uv.x += uRefraction * m * alt;
  vec2 coverUV = getCoverUV(uv, uTextureSize);
  coverUV = clamp(coverUV, 0.0, 1.0);

  vec2 chromaOff = vec2(uChroma * m * alt, 0.0);
  float r = texture2D(tex, clamp(coverUV + chromaOff, 0.0, 1.0)).r;
  float g = texture2D(tex, coverUV).g;
  float b = texture2D(tex, clamp(coverUV - chromaOff, 0.0, 1.0)).b;
  return vec3(r, g, b);
}

void main() {
  vec2 uv = vUv;

  float cycle = uBandSpacing * uBandCount;
  float chevron = 1.0 - 2.0 * abs(uv.y - 0.5);
  float proj = uv.x + uChevronDepth * chevron;

  float scroll = mod(uTime * uScrollSpeed, cycle);
  float u = mod(proj - scroll, cycle);

  float c = mod(u, uBandSpacing);
  float dist = abs(c - uBandSpacing * 0.5);
  float halfGlass = uBandSpacing * uBandWidth * 0.5;
  float m = 1.0 - smoothstep(halfGlass - uBandFeather, halfGlass + uBandFeather, dist);

  float edgeScreen = smoothEdge(uv.x, uEdgePadding);
  m *= edgeScreen;

  float bandIndex = floor(u / uBandSpacing + 0.001);
  float alt = mod(bandIndex, 2.0) * 2.0 - 1.0;

  vec3 colorCurrent = sampleGlass(uTextureCurrent, uv, m, alt);
  vec3 colorNext = sampleGlass(uTextureNext, uv, m, alt);

  float mask = transitionMask(vUv, uTransitionProgress);
  vec3 finalColor = mix(colorCurrent, colorNext, mask);

  gl_FragColor = vec4(finalColor, 1.0);
}


// ===== shader 31 — 006-main.js =====

varying vec3 vWorldNormal;
varying vec3 vWorldPos;
varying vec3 vLocalPos;

void main() {
  vLocalPos = position;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}


// ===== shader 32 — 006-main.js =====

uniform sampler2D uBackground;
uniform vec2 uResolution;
uniform float uReflectPower;
uniform float uFresnelPower;
uniform float uFresnelStrength;
uniform vec3 uTint;
uniform vec3 uBaseColor;
uniform float uRoughness;
uniform float uGrainScale;
uniform float uGrainStrength;
uniform float uAmbient;
uniform float uSpecPower1;
uniform float uSpecStrength1;
uniform vec3 uLightDir1;
uniform float uSpecPower2;
uniform float uSpecStrength2;
uniform vec3 uLightDir2;
uniform float uSpecPower3;
uniform float uSpecStrength3;
uniform vec3 uLightDir3;

varying vec3 vWorldNormal;
varying vec3 vWorldPos;
varying vec3 vLocalPos;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 screenUV = gl_FragCoord.xy / uResolution;

  vec3 N = normalize(vWorldNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);

  // --- Surface grain: perturb normals for brushed-metal micro-texture ---
  vec2 gUV = vLocalPos.xy * uGrainScale;
  float dnx = fbm(gUV) - 0.5;
  float dny = fbm(gUV + vec2(7.8, 3.1)) - 0.5;
  vec3 Np = normalize(N + uGrainStrength * vec3(dnx, dny, 0.0));

  // --- Reflection ---
  vec3 R = reflect(-V, Np);
  vec2 reflOff = R.xy * uReflectPower;

  // Multi-tap blur for roughness
  float blur = uRoughness * 0.006;
  vec3 refl = vec3(0.0);
  refl += texture2D(uBackground, clamp(screenUV + reflOff, 0.0, 1.0)).rgb;
  refl += texture2D(uBackground, clamp(screenUV + reflOff + vec2( blur,  0.0), 0.0, 1.0)).rgb;
  refl += texture2D(uBackground, clamp(screenUV + reflOff + vec2(-blur,  0.0), 0.0, 1.0)).rgb;
  refl += texture2D(uBackground, clamp(screenUV + reflOff + vec2( 0.0,  blur), 0.0, 1.0)).rgb;
  refl += texture2D(uBackground, clamp(screenUV + reflOff + vec2( 0.0, -blur), 0.0, 1.0)).rgb;
  refl += texture2D(uBackground, clamp(screenUV + reflOff + vec2( blur,  blur) * 0.707, 0.0, 1.0)).rgb;
  refl += texture2D(uBackground, clamp(screenUV + reflOff + vec2(-blur, -blur) * 0.707, 0.0, 1.0)).rgb;
  refl += texture2D(uBackground, clamp(screenUV + reflOff + vec2(-blur,  blur) * 0.707, 0.0, 1.0)).rgb;
  refl += texture2D(uBackground, clamp(screenUV + reflOff + vec2( blur, -blur) * 0.707, 0.0, 1.0)).rgb;
  refl /= 9.0;

  refl *= uTint;

  // --- Fresnel (high F0 for metal) ---
  float cosTheta = max(dot(N, V), 0.0);
  float fresnel = 0.82 + 0.18 * pow(1.0 - cosTheta, uFresnelPower);

  // --- Diffuse base ---
  float NdL = max(dot(Np, normalize(uLightDir1)), 0.0);
  vec3 base = uBaseColor * (uAmbient + (1.0 - uAmbient) * NdL);

  vec3 color = mix(base, refl, fresnel);

  // --- Edge brightening ---
  color += uTint * pow(1.0 - cosTheta, uFresnelPower + 1.0) * uFresnelStrength * 0.15;

  // --- 3 specular lights ---
  vec3 specTint = mix(vec3(1.0), uTint, 0.35);

  vec3 H1 = normalize(V + normalize(uLightDir1));
  color += specTint * pow(max(dot(Np, H1), 0.0), uSpecPower1) * uSpecStrength1;

  vec3 H2 = normalize(V + normalize(uLightDir2));
  color += specTint * pow(max(dot(Np, H2), 0.0), uSpecPower2) * uSpecStrength2;

  vec3 H3 = normalize(V + normalize(uLightDir3));
  color += specTint * pow(max(dot(Np, H3), 0.0), uSpecPower3) * uSpecStrength3;

  // --- Subtle grain overlay ---
  float microGrain = vnoise(gUV * 4.0) * 0.06 - 0.03;
  color += microGrain * uTint;

  gl_FragColor = vec4(color, 1.0);
}
