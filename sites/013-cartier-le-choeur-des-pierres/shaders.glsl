// ===== shader 1 — 019-useGL-BwBaJ84P.js =====


#pragma SLOT pv


IN vec3 aPosition;


// uniform mat4 uMVP;
uniform mat4 uWorldMatrix;
uniform mat4 uVP;


#if depthFormat( D_RGB )
  OUT vec2 fragZW;
#endif


struct VertexData {
  highp vec3 position;
  highp vec3 worldPos;
  #if hasNormals
    vec3 normal;
  #endif
  #if hasTangents
    vec3 tangent;
  #endif
  mat4 worldMatrix;
};


void InitVertexData( out VertexData vertex ){

  vertex.position = aPosition;
  #if hasNormals
    vertex.normal = vec3(0.0);
  #endif
  #if hasTangents
    vertex.tangent = vec3(0.0);
  #endif

  vertex.worldMatrix = uWorldMatrix;
   
}



void main( void ){

  #pragma SLOT v

  VertexData vertex;
  InitVertexData( vertex );

  #pragma SLOT vertex_warp

  vec4 worldPos = vertex.worldMatrix * vec4( vertex.position, 1.0 );
  vertex.worldPos.xyz = worldPos.xyz / worldPos.w;

  #pragma SLOT vertex_warp_world

  gl_Position     = uVP * vec4( vertex.worldPos, 1.0 );

  #if depthFormat( D_RGB )
    fragZW=gl_Position.zw;
  #endif

  #pragma SLOT postv

}


// ===== shader 2 — 019-useGL-BwBaJ84P.js =====


#pragma SLOT pf


#if depthFormat( D_RGB )
  IN vec2 fragZW;

  vec3 encodeDepthRGB(float depth){
    vec4 c = vec4(1.0,255.0,65025.0,16581375.0)*depth;
    c=fract(c);
    c.xyz-=c.yzw*(1.0/255.0);
    return c.xyz;
  }
#endif



void main(void){

  #pragma SLOT f
  
  #if depthFormat( D_RGB )
    gl_FragColor.xyz = encodeDepthRGB( ( fragZW.x / fragZW.y ) * 0.5 + 0.5 );
    gl_FragColor.w=0.0;
  #endif

  #if depthFormat( D_DEPTH )
    gl_FragColor = vec4( 0.0 );
  #endif

}


// ===== shader 3 — 019-useGL-BwBaJ84P.js =====


#pragma SLOT pv


IN vec3 aPosition;

#if hasNormals
IN vec3 aNormal;
OUT mediump vec3 vWorldNormal;
#endif

// has normal map and tangent attribute
#if hasTangents
IN vec4 aTangent;
#endif

#if HAS_normal && hasTangents
OUT mediump vec3 vWorldTangent;
OUT mediump vec3 vWorldBitangent;
#endif


// uniform mat4 uMVP;
uniform mat4 uWorldMatrix;
uniform mat4 uVP;

OUT vec3 vWorldPosition;


vec3 rotate( mat4 m, vec3 v )
{
  return m[0].xyz*v.x + m[1].xyz*v.y + m[2].xyz*v.z;
}


struct VertexData {
  highp vec3 position;
  highp vec3 worldPos;
  #if hasNormals
    vec3 normal;
  #endif
  #if hasTangents
    vec3 tangent;
  #endif
  mat4 worldMatrix;
};


void InitVertexData( out VertexData vertex ){

  vertex.position = aPosition;
  #if hasNormals
    vertex.normal = aNormal;
  #endif
  #if hasTangents
    vertex.tangent = aTangent.xyz;
  #endif

  vertex.worldMatrix = uWorldMatrix;
   
}


void main( void ){

  #pragma SLOT v

  VertexData vertex;
  InitVertexData( vertex );

  #pragma SLOT vertex_warp

  vec4 worldPos = vertex.worldMatrix * vec4( vertex.position, 1.0 );
  vertex.worldPos.xyz = worldPos.xyz / worldPos.w;

  #pragma SLOT vertex_warp_world

  gl_Position     = uVP * vec4( vertex.worldPos, 1.0 );
  vWorldPosition  = vertex.worldPos;
  
  #if hasNormals
  vWorldNormal    = normalize( rotate( vertex.worldMatrix, vertex.normal ) );
  #endif

  #if HAS_normal && hasTangents
    vWorldTangent   = normalize( rotate( vertex.worldMatrix, vertex.tangent.xyz ) );
    vWorldBitangent = normalize( cross( vWorldNormal, vWorldTangent ) * aTangent.w );
  #endif

  // IBL lighting may sample SH here if per vertex irrad enabled

  #pragma SLOT postv
  // vDebugColor = vec4( -position, 1.0 );
}

// ===== shader 4 — 019-useGL-BwBaJ84P.js =====






void InitializeLightingData(out LightingData lightingData)
{
  lightingData.lightingColor = vec3(0.0);
}




void InitializeBRDF(SurfaceData surface, out BRDFData brdf)
{
  mediump float reflectivity = ReflectivitySpecular(surface.specular);
  mediump float oneMinusReflectivity = 1.0 - reflectivity;

  brdf.diffuse = surface.albedo * (vec3(1.0, 1.0, 1.0) - surface.specular);
  brdf.specular = surface.specular;

  brdf.grazingTerm = saturate(surface.smoothness + reflectivity);
  brdf.perceptualRoughness = PerceptualSmoothnessToPerceptualRoughness(surface.smoothness);
  brdf.roughness = max(PerceptualRoughnessToRoughness(brdf.perceptualRoughness), 0.001);
  brdf.roughness2 = brdf.roughness * brdf.roughness;

  brdf.normalizationTerm = brdf.roughness * 4.0 + 2.0;
  brdf.roughness2MinusOne = brdf.roughness2 - 1.0;
}

//                MAIN
// ===================

void main( void ){

  #pragma SLOT f


  SurfaceData surface;
  #pragma SLOT pbrsurface

  #if alphaMode( MASK )
    if( surface.alpha < alphaCutoff() ) discard;
  #endif

  //
  #ifdef HAS_vertexColor
  #if HAS_vertexColor
    surface.albedo *= vertexColor();
  #endif
  #endif


  // -----------

  GeometryData geometryData;
  geometryData.worldPos = vWorldPosition;
  geometryData.viewDir  = normalize( uCameraPosition - vWorldPosition ); // safe normalize?
  geometryData.worldNrm = normalize(COMPUTE_NORMAL());
  geometryData.worldReflect = reflect( -geometryData.viewDir, geometryData.worldNrm );


  BRDFData brdfData;
  InitializeBRDF( surface, brdfData );

  LightingData lightingData;
  InitializeLightingData( lightingData );




  #pragma SLOT prelightsf
  #pragma SLOT lightsf
  #pragma SLOT postlightsf

  lightingData.lightingColor += surface.emission;


  #if alphaMode( MASK )
    FragColor.a = 1.0;
  #elif alphaMode( BLEND )
    FragColor.a = surface.alpha;
  #else
    FragColor.a = 1.0;
  #endif



  FragColor.rgb = lightingData.lightingColor;

  #pragma SLOT postf_linear

  EXPOSURE(FragColor.rgb);
  GAMMA_CORRECTION(FragColor.rgb);

  #pragma SLOT postf



}

// ===== shader 5 — 019-useGL-BwBaJ84P.js =====


#pragma SLOT pv


IN vec3 aPosition;


// uniform mat4 uMVP;
uniform mat4 uWorldMatrix;
uniform mat4 uVP;




struct VertexData {
  highp vec3 position;
  highp vec3 worldPos;
  #if hasNormals
    vec3 normal;
  #endif
  #if hasTangents
    vec3 tangent;
  #endif
  mat4 worldMatrix;
};


void InitVertexData( out VertexData vertex ){

  vertex.position = aPosition;
  #if hasNormals
    vertex.normal = vec3(0.0);
  #endif
  #if hasTangents
    vertex.tangent = vec3(0.0);
  #endif

  vertex.worldMatrix = uWorldMatrix;
   
}


void main( void ){

  #pragma SLOT v

  VertexData vertex;
  InitVertexData( vertex );

  #pragma SLOT vertex_warp

  vec4 worldPos = vertex.worldMatrix * vec4( vertex.position, 1.0 );
  vertex.worldPos.xyz = worldPos.xyz / worldPos.w;

  #pragma SLOT vertex_warp_world

  gl_Position     = uVP * vec4( vertex.worldPos, 1.0 );
  
  #pragma SLOT postv
}

// ===== shader 6 — 019-useGL-BwBaJ84P.js =====


#pragma SLOT pf



// MATH
// =========
#define saturate(x) clamp( x, 0.0, 1.0 )
#define sdot( a, b ) saturate( dot(a,b) )



//                MAIN
// ===================

void main( void ){

  #pragma SLOT f

 vec3 _baseColor = vec3(1.0);
  #if HAS_baseColor
    _baseColor *= baseColor();
  #endif
  #if HAS_baseColorFactor
    _baseColor *= baseColorFactor();
  #endif



  //
  #ifdef HAS_vertexColor
  #if HAS_vertexColor
    _baseColor *= vertexColor();
  #endif
  #endif

  FragColor.xyz = _baseColor;
 

  float _alpha = 1.0;
  #if HAS_alpha
    _alpha *= alpha();
  #endif
  #if HAS_alphaFactor
    _alpha *= alphaFactor();
  #endif


  #if alphaMode( MASK )
    if( _alpha < alphaCutoff() ) discard;
    FragColor.a = 1.0;
  #elif alphaMode( BLEND )
    FragColor.a = _alpha;
  #else
    FragColor.a = 1.0;
  #endif


  #pragma SLOT postf_linear
  #pragma SLOT postf

}

// ===== shader 7 — 019-useGL-BwBaJ84P.js =====
precision highp float;

attribute vec2 aPosition;
attribute vec2 aTexCoord;

varying vec2 vUv;

void main(void){
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vUv = aTexCoord * vec2(1.0, 1.0);
}

// ===== shader 8 — 019-useGL-BwBaJ84P.js =====
// noise_bake.frag — run ONCE into a 256x256 texture
precision highp float;

varying vec2 vUv;

const float size = 8.0;

vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

float valueNoise(vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = dot(hash2(mod(i + vec2(0,0), size)), f - vec2(0,0));
    float b = dot(hash2(mod(i + vec2(1,0), size)), f - vec2(1,0));
    float c = dot(hash2(mod(i + vec2(0,1), size)), f - vec2(0,1));
    float d = dot(hash2(mod(i + vec2(1,1), size)), f - vec2(1,1));

    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

void main() {
    // vUv in [0,1], tiling at period 8 means seamlessly tileable
    vec2 uv = vUv * size;
    // 4 independent noise fields → RGBA
    gl_FragColor = vec4(
    valueNoise(uv),
    valueNoise(uv + vec2(31.4, 17.2)),
    valueNoise(uv + vec2(5.1,  73.8)),
    valueNoise(uv + vec2(44.0, 3.7))
    );

}

// ===== shader 9 — 019-useGL-BwBaJ84P.js =====
#version 300 es
in vec2 a_position;
out vec2 v_position;

void main() {
  v_position = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0, 1);
}

// ===== shader 10 — 019-useGL-BwBaJ84P.js =====
#version 300 es
precision highp float;

uniform sampler2D u_v;
uniform sampler2D u_x;
uniform float u_dt;
uniform float u_dissipation;
out vec4 res;

vec4 bilerp(sampler2D tex, vec2 x_norm, vec2 size) {
  vec2 x = x_norm * size - 0.5;
  vec2 fx = fract(x);
  ivec2 ix = ivec2(floor(x));

  vec4 x00 = texelFetch(tex, ix + ivec2(0,0), 0);
  vec4 x01 = texelFetch(tex, ix + ivec2(0,1), 0);
  vec4 x10 = texelFetch(tex, ix + ivec2(1,0), 0);
  vec4 x11 = texelFetch(tex, ix + ivec2(1,1), 0);

  return mix(mix(x00, x10, fx.x), mix(x01, x11, fx.x), fx.y);
}

void main() {
  vec2 size_v = vec2(textureSize(u_v, 0));
  vec2 size_x = vec2(textureSize(u_x, 0));
  vec2 aspect_ratio = vec2(size_x.x / size_x.y, 1.0);
  vec2 normalized_pos = gl_FragCoord.xy / size_x;
  vec2 prev = normalized_pos - u_dt * bilerp(u_v, normalized_pos, size_v).xy / aspect_ratio; 
  res = u_dissipation * bilerp(u_x, prev, size_x);
}

// ===== shader 11 — 019-useGL-BwBaJ84P.js =====
#version 300 es
precision highp float;

uniform sampler2D u_x;
uniform sampler2D u_b;
uniform float u_alpha;
uniform float u_beta;
out vec4 res;

${CO}

void main() {
  ivec2 pos = ivec2(gl_FragCoord.xy); 
  Neighbors n = tex_neighbors(u_x, pos);
  vec4 b = texelFetch(u_b, pos, 0);
  res = (n.b + n.t + n.l + n.r + u_alpha * b) / u_beta;
}

// ===== shader 12 — 019-useGL-BwBaJ84P.js =====
#version 300 es
precision highp float;

uniform sampler2D u_v;
uniform sampler2D u_p;
out vec4 res;

${CO}

void main() {
  ivec2 pos = ivec2(gl_FragCoord.xy); 
  Neighbors n = tex_neighbors(u_p, pos);

  vec4 grad = vec4(n.r.x - n.l.x, n.t.x - n.b.x, 0, 0) / 2.;
  vec4 init_v = texelFetch(u_v, pos, 0);
  res = init_v - grad;
}

// ===== shader 13 — 019-useGL-BwBaJ84P.js =====
#version 300 es
precision highp float;

uniform sampler2D u_x;
out vec4 res;

${CO}

void main() {
  ivec2 pos = ivec2(gl_FragCoord.xy); 
  Neighbors n = tex_neighbors(u_x, pos);

  float div = (n.r.x - n.l.x + n.t.y - n.b.y) / 2.;

  res = vec4(div, 0, 0, 1);
}

// ===== shader 14 — 019-useGL-BwBaJ84P.js =====
#version 300 es
precision highp float;

in vec2 v_position;
uniform sampler2D u_x;
uniform vec2 u_res;
uniform float u_alpha;
out vec4 res;

void main() {
  vec2 dir = vec2(0, 0);
  dir += vec2(lessThan(v_position, u_res));
  dir -= vec2(greaterThan(v_position, vec2(1.0) - u_res));
  float coef = length(dir) > 0.0 ? u_alpha : 1.0;
  res = coef * texture(u_x, v_position + dir * u_res);
}

// ===== shader 15 — 019-useGL-BwBaJ84P.js =====
#version 300 es
precision highp float;

in vec2 v_position;
uniform sampler2D u_x;
uniform float u_alpha;
out vec4 res;

void main() {
  res = u_alpha * texture(u_x, v_position);
}

// ===== shader 16 — 019-useGL-BwBaJ84P.js =====
#version 300 es
precision highp float;

in vec2 v_position;
uniform sampler2D u_x;
uniform float u_alpha;
out vec4 res;

void main() {
  vec2 tcoord = v_position;
  ivec2 size = textureSize(u_x, 0);
  vec2 texelSize = 1.0 / vec2(size);
  // apply a padding of one texel to tcoord
  tcoord = tcoord * (1.0 - 2.0 * texelSize) + texelSize;
  res = u_alpha * texture(u_x, tcoord);
}

// ===== shader 17 — 019-useGL-BwBaJ84P.js =====
#version 300 es
precision highp float;

in vec2 v_position;
uniform sampler2D u_x;
uniform vec2 u_point;
uniform vec3 u_value;
uniform float u_radius;
uniform float u_ratio;
out vec4 res;

void main() {
  vec4 init = texture(u_x, v_position);
  vec2 v = v_position - u_point;
  v.x *= u_ratio;
  vec3 force = exp(-dot(v,v)/u_radius) * u_value;

  res = vec4(init.xyz + force, 1.);
}

// ===== shader 18 — 019-useGL-BwBaJ84P.js =====
#version 300 es
precision highp float;

uniform sampler2D u_x;
out vec4 res;

${CO}

void main() {
  ivec2 pos = ivec2(gl_FragCoord.xy);
  Neighbors n = tex_neighbors(u_x, pos);
  float curl = (n.r.y - n.l.y - n.t.x + n.b.x) / 2.0;
  res = vec4(curl, 0, 0, 1);
}

// ===== shader 19 — 019-useGL-BwBaJ84P.js =====
#version 300 es
precision highp float;

uniform sampler2D u_v;
uniform sampler2D u_curl;
uniform float u_dt;
uniform float u_vorticity;
out vec4 res;

${CO}

void main() {
  ivec2 pos = ivec2(gl_FragCoord.xy);
  Neighbors n = tex_neighbors(u_curl, pos);

  vec2 eta = vec2(abs(n.r.x) - abs(n.l.x), abs(n.t.x) - abs(n.b.x));
  eta = eta / (length(eta) + 1e-5);

  float curl = n.c.x;
  vec2 force = u_vorticity * vec2(eta.y * curl, -eta.x * curl);

  vec4 vel = texelFetch(u_v, pos, 0);
  res = vec4(vel.xy + force * u_dt, 0, 1);
}

// ===== shader 20 — 019-useGL-BwBaJ84P.js =====
#version 300 es

precision highp float;


in vec2 aTexCoord0;
out vec2 vTexCoord;

void main(void)
{
  vTexCoord = aTexCoord0;
  gl_Position.xy = 2.0 * aTexCoord0 - vec2(1.0, 1.0);
  gl_Position.zw = vec2(0.0, 1.0);
}


// ===== shader 21 — 019-useGL-BwBaJ84P.js =====
#version 300 es

precision mediump float;

in vec2 vTexCoord;

uniform sampler2D tInput;
uniform vec2 uTexelSize;
uniform float uSpread;

out vec4 FragColor;

vec2 rotationMatrix(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return vec2(c, s);
}

void main(void)
{
  vec2 uv = vTexCoord;
  float ts = uTexelSize.x * uSpread;


  // 9-tap gaussian blur (horizontal)
  vec4 c0 = texture(tInput, uv + vec2(-4.0 * ts, 0.0));
  vec4 c1 = texture(tInput, uv + vec2(-3.0 * ts, 0.0));
  vec4 c2 = texture(tInput, uv + vec2(-2.0 * ts, 0.0));
  vec4 c3 = texture(tInput, uv + vec2(-1.0 * ts, 0.0));
  vec4 c4 = texture(tInput, uv);
  vec4 c5 = texture(tInput, uv + vec2( 1.0 * ts, 0.0));
  vec4 c6 = texture(tInput, uv + vec2( 2.0 * ts, 0.0));
  vec4 c7 = texture(tInput, uv + vec2( 3.0 * ts, 0.0));
  vec4 c8 = texture(tInput, uv + vec2( 4.0 * ts, 0.0));

  FragColor = c0 * 0.01621622
            + c1 * 0.05405405
            + c2 * 0.12162162
            + c3 * 0.19459459
            + c4 * 0.22702703
            + c5 * 0.19459459
            + c6 * 0.12162162
            + c7 * 0.05405405
            + c8 * 0.01621622;
}


// ===== shader 22 — 019-useGL-BwBaJ84P.js =====
#version 300 es

precision mediump float;

in vec2 vTexCoord;

uniform sampler2D tInput;
uniform vec2 uTexelSize;
uniform float uSpread;

out vec4 FragColor;

vec2 rotationMatrix(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return vec2(c, s);
}

void main(void)
{
  vec2 uv = vTexCoord;
  float ts = uTexelSize.y * uSpread;

  // 9-tap gaussian blur (vertical)
  vec4 c0 = texture(tInput, uv + vec2(0.0, -4.0 * ts));
  vec4 c1 = texture(tInput, uv + vec2(0.0, -3.0 * ts));
  vec4 c2 = texture(tInput, uv + vec2(0.0, -2.0 * ts));
  vec4 c3 = texture(tInput, uv + vec2(0.0, -1.0 * ts));
  vec4 c4 = texture(tInput, uv);
  vec4 c5 = texture(tInput, uv + vec2(0.0,  1.0 * ts));
  vec4 c6 = texture(tInput, uv + vec2(0.0,  2.0 * ts));
  vec4 c7 = texture(tInput, uv + vec2(0.0,  3.0 * ts));
  vec4 c8 = texture(tInput, uv + vec2(0.0,  4.0 * ts));

  FragColor = c0 * 0.01621622
            + c1 * 0.05405405
            + c2 * 0.12162162
            + c3 * 0.19459459
            + c4 * 0.22702703
            + c5 * 0.19459459
            + c6 * 0.12162162
            + c7 * 0.05405405
            + c8 * 0.01621622;
}


// ===== shader 23 — 019-useGL-BwBaJ84P.js =====
#version 300 es

precision highp float;

in vec2 aTexCoord0;
out vec2 vTexCoord;

void main(void)
{
  vTexCoord = aTexCoord0;
  gl_Position.xy = 2.0 * aTexCoord0 - vec2(1.0, 1.0);
  gl_Position.zw = vec2(0.0, 1.0);
}


// ===== shader 24 — 019-useGL-BwBaJ84P.js =====
#version 300 es

precision highp float;

in vec2 vTexCoord;

uniform sampler2D tHeightmap;
uniform vec2 uTexelSize;
uniform float uStrength;

out vec4 FragColor;

void main(void)
{
  vec2 uv = vTexCoord;

  vec2 textureSize = vec2(textureSize(tHeightmap, 0));
  vec2 texelSize = 1.0 / textureSize * 1.5;
  texelSize *= 4.0;

  float hL = texture(tHeightmap, uv + vec2(-texelSize.x, 0.0)).r;
  float hR = texture(tHeightmap, uv + vec2( texelSize.x, 0.0)).r;
  float hB = texture(tHeightmap, uv + vec2(0.0, -texelSize.y)).r;
  float hT = texture(tHeightmap, uv + vec2(0.0,  texelSize.y)).r;

  vec2 displacement = vec2(hL - hR, hB - hT) * uStrength;

  FragColor = vec4(displacement * 0.5 + 0.5, 0.0, 1.0);
}


// ===== shader 25 — 019-useGL-BwBaJ84P.js =====


precision lowp float;

uniform sampler2D uTexture;

in vec2 vTexCoord;

out vec4 FragColor;

void main(void){

  vec2 coord = vTexCoord;
  FragColor = texture(uTexture, coord);
}

// ===== shader 26 — 019-useGL-BwBaJ84P.js =====


precision lowp float;

in vec2 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;

uniform vec2 uTexOffset;

void main(void){
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vTexCoord = aTexCoord + uTexOffset;
}

// ===== shader 27 — 019-useGL-BwBaJ84P.js =====
 float;

uniform sampler2D uTexture;
uniform sampler2D uNoiseTexture;
uniform vec2 uViewport;
uniform vec3 uSettings; // x: noiseScale, y: reveal, z: time
uniform vec2 uM1;
uniform vec2 uM2;
uniform vec2 uM3;

#define uNoiseScale uSettings.x
#define uReveal uSettings.y
#define uTime uSettings.z

in vec2 vTexCoord;

out vec4 FragColor;

vec3 blendOverlay(vec3 base, vec3 blend) {
  return mix(1.0 - 2.0 * (1.0 - base) * (1.0 - blend), 2.0 * base * blend, step(base, vec3(0.5)));
}

float mask(vec2 origin, vec2 uv, float r, float noise){
  float dist = distance(uv, origin) + noise * 0.1;
  float reveal = r + noise * 0.2;
  float mask = smoothstep(dist, dist + 0.1, reveal * 1.5);
  return mask;
}

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}


void main(void){

  vec2 coord = vTexCoord;
  FragColor = texture(uTexture, coord);

  vec2 uv = coord * uViewport / 512.0; // Assuming noise texture is 512x512
  
  vec3 n1 = texture(uNoiseTexture, uv * uNoiseScale + vec2(0.0, uTime * 0.2)).rgb;
  vec3 n2 = texture(uNoiseTexture, uv * uNoiseScale + vec2(0.2, -uTime * 0.2)).rgb;

  FragColor.rgb = blendOverlay(FragColor.rgb, (n1 * n2) * 0.5);

  float n3 = texture(uNoiseTexture, uv * 0.2 + vec2(0.0, uTime * 0.005)).r;
  float n4 = texture(uNoiseTexture, uv * 0.2 + vec2(0.0, -uTime * 0.005)).r;

  float nmask = (((n3 * n4) * 0.5) - 0.5) * 2.0;
  // n3 = (n3 - 0.5) * 2.0;

  float ratio = uViewport.x / uViewport.y;
  vec2 ruv = (coord - 0.5) * vec2(ratio, 1.0) + 0.5; // Adjust for aspect ratio

  // Avoid the initial visual dead zone while preserving the curve from 0.1+.
  // float revealInput = (uReveal > 0.0 && uReveal < 0.1) ? 0.1 : uReveal;
  float revealInput = map(uReveal, 0.0, 1.0, 0.10, 0.8);

  float r1 = clamp(map(revealInput, 0.0, 1.0, 0.0, 1.0), 0.0, 1.0);
  float r2 = clamp(map(revealInput, 0.1, 1.0, 0.0, 1.0), 0.0, 1.0);
  float r3 = clamp(map(revealInput, 0.2,  1.0, 0.0, 1.0), 0.0, 1.0);
  float r4 = clamp(map(revealInput, 0.15,  1.0, 0.0, 1.0), 0.0, 1.0);

  float m1 = mask(vec2(0.5, 0.5), ruv, r1, nmask);

  // float m2 = mask(vec2(-0.2, 0.8), ruv, r2, nmask);
  // float m3 = mask(vec2(0.8, 0.1), ruv, r3, nmask);
  // float m4 = mask(vec2(1.0, 1.0), ruv, r4, nmask);
  float m2 = mask(uM1, ruv, r2, nmask);
  float m3 = mask(uM2, ruv, r3, nmask);
  float m4 = mask(uM3, ruv, r4, nmask);
  

  FragColor.rgb += vec3(m1 + m2 + m3 + m4);

}

// ===== shader 28 — 019-useGL-BwBaJ84P.js =====
 float;

in vec2 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;

void main(void){
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vTexCoord = aTexCoord;
}

// ===== shader 29 — 019-useGL-BwBaJ84P.js =====
precision highp float;

uniform float uTime;
uniform sampler2D uNoise;

varying vec2 vTexCoord;
uniform vec2 uMousePosition;

vec2 rotate(vec2 uv, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
}

void main(){

  vec2 uv = vTexCoord;
  vec3 noise = texture2D(uNoise, uv).rgb;
  noise = (noise * 2.0) - vec3(1.0);

  uv *= vec2(2.0, 0.5);
  uv = rotate(uv, 1.2);
  mat3 m = mat3(-2, -1, 2, 3, -2, 1, 1, 2, 2);

  vec2 coord = vTexCoord * 2.0 - vec2(1.0);
  float delta = 1.0 - (length(coord - uMousePosition) * 1.0);
  delta = clamp(delta, 0.0, 1.0) * 0.0;

  vec3 a = vec3( uv, uTime * 0.1 ) * m;
  vec3 b = a * m * .4 + noise.g * 0.2;
  vec3 c = b * m * .3 + noise.b * 0.2;

  float la = length(.5 - fract(a));
  float lb = length(.5 - fract(b));
  float lc = length(.5 - fract(c));
  float f = min(min(la, lb), lc);


  float color = pow(f, 7.0) * 25.0;
  color *= 1.0 + delta * 1.5;

  vec3 n2 = texture2D(uNoise, uv * 0.2 + vec2(0.0, uTime) * 0.1).rgb;
  delta *= length(n2);
  color += delta * 5.0;

  gl_FragColor = vec4(color * 2.0);
  // gl_FragColor = gl_FragColor * 0.000001 + vec4(vTexCoord, 0.0, 1.0);
  

}

// ===== shader 30 — 019-useGL-BwBaJ84P.js =====
precision highp float;

attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

uniform vec2 uTexOffset;

void main(void){
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vTexCoord = aTexCoord + uTexOffset;
}

// ===== shader 31 — 019-useGL-BwBaJ84P.js =====


precision highp float;

uniform sampler2D uGouach;
uniform sampler2D uPackshot;
uniform sampler2D uMask;
uniform sampler2D uDisplacement;
uniform float uTime;
uniform vec2 uMousePosition;

uniform vec2 uScreenSize;

in vec2 vTexCoord;

out vec4 fragColor;

#define chromatic_aberration 0.0015

void main( ) {

  // --- Camera
  vec2 tcoord = vTexCoord;

  vec3 mask = texture(uMask, tcoord).rgb;
  float maskFactor = min(max(mask.r, 0.0), 1.0);

  vec4 displacement = texture(uDisplacement, tcoord);
  vec2 displace = (displacement.rg - 0.5) * 2.0;
  float chromaticMask = smoothstep(0.05, 0.2, maskFactor);
  maskFactor = smoothstep(0.15, 1.0, maskFactor);
  
  tcoord += mix(vec2(0.0), displace * 0.025, maskFactor);

  vec2 tsize = vec2(textureSize(uGouach, 0));
  vec2 coord = tcoord;
  vec3 c1 = texture(uPackshot, coord).rgb;
  vec3 c2 = texture(uGouach, coord).rgb;

  float r = texture(uPackshot, coord + vec2(chromatic_aberration) * displace * 5.0).r;
  float g = c1.g;
  float b = texture(uPackshot, coord - vec2(chromatic_aberration) * displace * 5.0).b;
  vec3 chromatic = vec3(r, g, b);

  c1 = mix(c1, chromatic, chromaticMask);
  

  fragColor = vec4(mix(c1, c2, maskFactor), 1.0 );
  
}

// ===== shader 32 — 019-useGL-BwBaJ84P.js =====


precision highp float;

in vec2 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;

uniform vec2 uTexOffset;

void main(void){
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vTexCoord = aTexCoord + uTexOffset;
}

// ===== shader 33 — 019-useGL-BwBaJ84P.js =====


precision highp float;

uniform sampler2D uTextureBase;
uniform sampler2D uTextureBlurred;
uniform vec2 uViewportSize;
uniform vec2 uMousePos;
uniform float uFactor;

in vec2 vTexCoord;

out vec4 FragColor;

void main(void){

  vec2 coord = vTexCoord;

  vec2 aspect = vec2(1.0, uViewportSize.y / uViewportSize.x);
  vec2 mcoord = (uMousePos + 1.0) * 0.5;
  vec2 delta = (coord - mcoord);

  float blurMask = length(delta * aspect);
  blurMask = clamp(blurMask * 3.0, 0.0, 1.0);
  blurMask *= uFactor;

  vec4 base = texture(uTextureBase, coord);
  vec4 blurred = texture(uTextureBlurred, coord);
  FragColor = mix(base, blurred, blurMask);  
}

// ===== shader 34 — 019-useGL-BwBaJ84P.js =====


precision highp float;

in vec2 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;

uniform vec2 uTexOffset;

void main(void){
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vTexCoord = aTexCoord + uTexOffset;
}

// ===== shader 35 — 019-useGL-BwBaJ84P.js =====


precision highp float;

uniform sampler2D uTextureBase;
uniform sampler2D uTextureBlurred;
uniform sampler2D uNoiseTexture;

uniform vec2 uViewportSize;
uniform vec3 uMaskSettings;
uniform float uAngle;

uniform vec2 uMousePos;
uniform float uFactor;


in vec2 vTexCoord;
in vec2 vClipPos;

out vec4 FragColor;

#define uNoiseScale uMaskSettings.x
#define uReveal uMaskSettings.y
#define uTime uMaskSettings.z

float mask(vec2 origin, vec2 uv, float r, float noise){
  float dist = distance(uv, origin) + noise * 0.1;
  float reveal = r + noise * 0.2;
  float mask = smoothstep(dist, dist + 0.3, reveal * 1.7);
  return mask;
}

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}


vec3 computeMask(){
  vec2 coord = vTexCoord;
  vec2 uv = coord * uViewportSize / 512.0;

  vec3 n1 = texture(uNoiseTexture, uv * uNoiseScale + vec2(0.0, uTime * 0.2)).rgb;
  vec3 n2 = texture(uNoiseTexture, uv * uNoiseScale + vec2(0.2, -uTime * 0.2)).rgb;

  float n3 = texture(uNoiseTexture, uv * 0.6 + vec2(0.0, uTime * 0.005)).r;
  float n4 = texture(uNoiseTexture, uv * 0.6 + vec2(0.0, -uTime * 0.005)).r;

  float nmask = (((n3 * n4) * 0.5) - 0.5) * 2.0;

  float ratio = uViewportSize.x / uViewportSize.y;
  vec2 ruv = (coord - 0.5) * vec2(ratio, 1.0) + 0.5; // Adjust for aspect ratio

  float ri1 = map(uReveal, 0.0, 1.0, 0.10, 0.9);
  float r1 = clamp(map(ri1, 0.0, 1.0, 0.0, 1.0), 0.0, 1.0);
  float m1 = mask(vec2(0.5, 0.5), ruv, r1, nmask);

  float ri2 = map(uReveal - 1.0, 0.0, 1.0, 0.1, 0.8);
  float r2 = clamp(map(ri2, 0.0, 1.0, 0.0, 1.0), 0.0, 1.0);
  float m2 = mask(vec2(0.5, 0.5), ruv, r2, nmask);

  float f1 = clamp(m1, 0.0, 1.0);
  float f2 = clamp(m2, 0.0, 1.0);
  return vec3(f1 - f2, n1.xy);
}

#define chromatic_aberration 0.0015

vec2 skew(vec2 v, float a, vec2 pivot) {
  float t = tan(a);
  vec2 p = v - pivot;
  p = vec2(p.x, p.y + p.x * t);
  return p + pivot;
}

float blendSoftLight(float base, float blend) {
  return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight(vec3 base, vec3 blend) {
  return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));
}

vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
  return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
}

float blendScreen(float base, float blend) {
  return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreen(vec3 base, vec3 blend) {
  return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
}

vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
  return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
}


void main(void){

  vec2 coord = vTexCoord;
  vec4 maskColor = vec4(0.95);

  vec3 computedMask = computeMask();
  float mask = computedMask.r;

  vec2 dmask = (computedMask.yz - vec2(0.5)) * 2.0;

  vec2 aspect = vec2(1.0, uViewportSize.y / uViewportSize.x);
  vec2 mcoord = (uMousePos + 1.0) * 0.5;
  vec2 delta = (coord - mcoord);

  float blurMask = length(delta * aspect);
  blurMask = clamp(blurMask * 3.0, 0.0, 1.0);
  blurMask *= uFactor;

  vec2 displace = (coord - vec2(0.5)) * 2.0 * mask;
  coord += dmask * 0.001 * mask;
  float r = texture(uTextureBase, coord + vec2(chromatic_aberration) * displace * 8.0).r;
  float g = texture(uTextureBase, coord).g;
  float b = texture(uTextureBase, coord - vec2(chromatic_aberration) * displace * 8.0).b;
  vec4 base = vec4(r, g, b, 1.0);

  vec4 blurred = texture(uTextureBlurred, coord);

  mask *= smoothstep(2.0, 1.9, uReveal);

  FragColor = mix(base, blurred, blurMask);
  FragColor = mix(FragColor, maskColor, mask);

}

// ===== shader 36 — 019-useGL-BwBaJ84P.js =====


precision highp float;

in vec2 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;
out vec2 vClipPos;

uniform vec2 uTexOffset;

void main(void){
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vTexCoord = aTexCoord + uTexOffset;
  vClipPos = gl_Position.xy;
}

// ===== shader 37 — 019-useGL-BwBaJ84P.js =====


precision highp float;

uniform sampler2D uTexture;
uniform vec4 uTintColor;

in vec2 vTexCoord;

out vec4 FragColor;

vec3 blendOverlay(vec3 base, vec3 blend) {
  return mix(1.0 - 2.0 * (1.0 - base) * (1.0 - blend), 2.0 * base * blend, step(base, vec3(0.5)));
}


void main(void){

  vec2 coord = vTexCoord;
  FragColor = texture(uTexture, coord);

  // vec3 tintColor = uTintColor.rgb * 10.0;
  vec3 blended = blendOverlay(FragColor.rgb, uTintColor.rgb * 1.2);
  FragColor.rgb = mix(blended, FragColor.rgb, uTintColor.a);
  
}

// ===== shader 38 — 019-useGL-BwBaJ84P.js =====


precision highp float;

in vec2 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;

uniform vec2 uTexOffset;

void main(void){
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vTexCoord = aTexCoord + uTexOffset;
}

// ===== shader 39 — 019-useGL-BwBaJ84P.js =====
 by R3N. https://shadertoy.com/view/NdVXDw
// 2022-11-24 01:10:01

// Updated have more configuration and add photoshop blend modes on existing textures
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20151020 (hassoncs)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uNoise;

varying vec2 vTexCoord;

float vignette(vec2 uv) {
    uv *=  1.0 - uv.yx;   //vec2(1.0)- uv.yx; -> 1.-u.yx; Thanks FabriceNeyret !
    
    float vig = uv.x*uv.y * 15.0; // multiply with sth for intensity
    
    vig = pow(vig, 0.25); // change pow for modifying the extend of the  vignette
    return vig;
}

vec4 silk(float dir, float strength){
  vec4 color = vec4(0.0);
  vec2 uv = vTexCoord;
  uv.x *= 2.0;
  uv.y += sin(uv.y * 3.0 + uTime * 0.3) * 0.2;

  float t = 0.5 * uTime;
  uv.y += 0.03 * sin( 8.0 * uv.x - t);
  uv.x += -uTime * 0.15 + dir * uTime * 0.1;

  float f = 0.6 + 0.4 * sin( 5.0 * (uv.x + uv.y + cos( 3.0 * uv.x + 5.0 * uv.y ) + 0.02 * t ) + sin( 20.0 * ( uv.x + uv.y - 0.1 * t ) ));
  float b = 1.7;

  color = vec4(strength, strength, strength, 1.0) * vec4(f);

  uv = vTexCoord;
  float vig = vignette(uv);

  float fadeLR = .7 - abs(uv.x - .4);
  float fadeTB = 1.1 - uv.y;
  vec3 pos = vec3(uv * vec2( 3. , 1.) - vec2(0., uTime * .00005), uTime * .006);

  color = vec4(color.xyz, 1.0);// * vig;

  float k = (sin(uTime / 1.0) + 1.0)/4.0 + 0.75;

  // #define heartoffset vec2(sin(uv.x + uTime)*10., cos(uv.x * 10. + 0.01*sin(uTime) + uTime)*15.*(1.5-uv.y)*0.4)
  vec2 heartoffset = vec2(sin(uv.x + uTime)*10., cos( uv.x * 10. + 0.01 * sin(uTime) + uTime ) * 15. * ( 1.5 - uv.y ) * 0.4);

  // Add a bit of shading to make things seem more 3-dimensional
  color -= (heartoffset.y + heartoffset.x) * 0.01 * k * (1.-uv.y)*0.4;
  // gl_FragColor -= vec4((1.-uv.y)*0.1*k,0,0,1.);
  color -= vec4((1.-uv.y)*0.1*k);
  color -= (vec4(uv.y, uv.y * 0.8, uv.y, 1.)) / 8.0;
  return color;
}

void main(){

  vec4 c1 = silk(1.0, 0.4) * 4.0;
  vec4 c2 = silk(-1.0, 0.5) * 4.0;
  
  gl_FragColor = vec4(c1.r * c2.r);
  gl_FragColor.a = 1.0;


}

// ===== shader 40 — 019-useGL-BwBaJ84P.js =====
precision highp float;

attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

uniform vec2 uTexOffset;

void main(void){
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vTexCoord = aTexCoord + uTexOffset;
}