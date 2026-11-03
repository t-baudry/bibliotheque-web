// ===== shader 1 — 008-CT1tNzyx.js =====
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;

void main() {
    vUv = uv;
    
    vec3 p = position;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}

// ===== shader 2 — 008-CT1tNzyx.js =====
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec2 uVideoSizes;
uniform vec2 uThumbnailSizes;
uniform vec2 uPlaneSizes;
uniform vec2 uGridSizes;
uniform vec2 uScreenSizes;
uniform vec2 uScreenSizesPx;
uniform float uDebug;
uniform float uRadiusStrength;
uniform float uOpacity;
uniform float uThumbnailOpacity;
uniform float uScale;
uniform float uDuotoneOpacity;
uniform float uBottomGradientOpacity;
uniform float uParallaxX;
uniform float uParallaxY;

uniform sampler2D tMap;
uniform sampler2D tDuotone;
uniform sampler2D tGrid;
uniform sampler2D tThumbnail;

varying vec2 vUv;

vec3 blendMultiply(vec3 base, vec3 blend) {
  return base*blend;
}

float blendDarken(float base, float blend) {
  return min(blend,base);
}

vec3 blendDarken(vec3 base, vec3 blend) {
  return vec3(blendDarken(base.r,blend.r),blendDarken(base.g,blend.g),blendDarken(base.b,blend.b));
}

vec3 blendDarken(vec3 base, vec3 blend, float opacity) {
  return (blendDarken(base, blend) * opacity + base * (1.0 - opacity));
}

float drawRoundedRect(float longSide, float shortSide, float differenceXY, float circleDistanceAlongShortSide) {
  if (longSide < 0.0) {
      differenceXY = -differenceXY;
  }

  if (abs(longSide) < abs(differenceXY) + circleDistanceAlongShortSide) {
      longSide = -circleDistanceAlongShortSide;
  } else {
      longSide -= differenceXY;
  }

  if (abs(shortSide) < circleDistanceAlongShortSide) {
      shortSide = -circleDistanceAlongShortSide;
  }

  float rawDistanceToCenter = length(abs(vec2(longSide, shortSide)) - circleDistanceAlongShortSide);
  return rawDistanceToCenter;
}

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.0-smoothstep(_radius- fwidth(dot(dist, dist) * 2.0),
                         _radius+ fwidth(dot(dist, dist) * 2.0),
                         dot(dist,dist) * 2.0);
}

void main() {
  float scale = 1.0 / uScale;

  vec3 color = vec3(0.0);

  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uVideoSizes.x / uVideoSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uVideoSizes.y / uVideoSizes.x), 1.0)
  );

  vec2 ratioThumbnail = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uThumbnailSizes.x / uThumbnailSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uThumbnailSizes.y / uThumbnailSizes.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  vec2 uvThumbnail = vec2(
    vUv.x * ratioThumbnail.x + (1.0 - ratioThumbnail.x) * 0.5,
    vUv.y * ratioThumbnail.y + (1.0 - ratioThumbnail.y) * 0.5
  );
  
  
  vec2 uvTexture = vec2(
    uv.x + uParallaxX,
    uv.y + uParallaxY
  );

  vec2 uvThumbnailTexture = vec2(
    uvThumbnail.x + uParallaxX,
    uvThumbnail.y + uParallaxY
  );

  color = texture2D(tMap, uvTexture).rgb;
  vec3 thumbnail = texture2D(tThumbnail, uvThumbnailTexture).rgb;
  color = mix(color, thumbnail, uThumbnailOpacity);

  
  vec3 duotone = texture2D(tDuotone, uvTexture).rgb;
  color = blendDarken(color, duotone, uDuotoneOpacity * 0.1);

  
  color = mix(color, vec3(0.0), 0.275);

  
  vec3 gradientColor = vec3(.0, .0, .0);
  float gradientOpacity = max(0., .6 * uBottomGradientOpacity * (0.45 - (vUv.y)));
  color = mix(color, gradientColor, gradientOpacity);

  
  vec2 ratioGrid = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uGridSizes.x / uGridSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uGridSizes.y / uGridSizes.x), 1.0)
  );

  vec2 uvGrid = vec2(
    vUv.x * ratioGrid.x + (1.0 - ratioGrid.x) * 0.5,
    vUv.y * ratioGrid.y + (1.0 - ratioGrid.y) * 0.5
  );

  vec3 grid = texture2D(tGrid, uvGrid).rgb;
  color = mix(color, grid, 0.3 * uDebug);
  
  

  
    
  vec2 uResolution = uScreenSizesPx * uPlaneSizes / uScreenSizes;
  vec2 fragCoord = vUv * uResolution; 
  float uSpacing = 0.0;

  
  vec2 resizeVector = vec2((uResolution.x - uSpacing) / uResolution.x, (uResolution.y - uSpacing) / uResolution.y);
  vec2 resizedResolution = uResolution * resizeVector;

  
  vec2 centeredCoord = fragCoord - resizedResolution / (2.0 * resizeVector);

  
  float circleDistanceAlongShortSide = min(resizedResolution.x, resizedResolution.y) / 2.0 - 0.02 * uResolution.x;

  float differenceXY = (resizedResolution.x - resizedResolution.y) / 2.0;

  float distanceToCenter;
  float relativeDistance;

  if (differenceXY > 0.0) {
      
      distanceToCenter = drawRoundedRect(centeredCoord.x, centeredCoord.y, differenceXY, circleDistanceAlongShortSide);
      relativeDistance = log(distanceToCenter / (resizedResolution.y / 2.0 - circleDistanceAlongShortSide));
  } else {
      
      differenceXY = abs(differenceXY);
      distanceToCenter = drawRoundedRect(centeredCoord.y, centeredCoord.x, differenceXY, circleDistanceAlongShortSide);
      relativeDistance = log(distanceToCenter / (resizedResolution.x / 2.0 - circleDistanceAlongShortSide));
  }

  
  
  
  
  float w = max(fwidth(relativeDistance) * 0.8, 0.0005);

  
  float mask = 1.0 - smoothstep(-0.5 * w, 0.5 * w, relativeDistance) * (uRadiusStrength);

  

  gl_FragColor.rgb = color;
  gl_FragColor.a = mask * uOpacity;
}