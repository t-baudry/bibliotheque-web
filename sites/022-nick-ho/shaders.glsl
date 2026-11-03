// ===== shader 1 — 011-three.min.js =====
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 011-three.min.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
  vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
  gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 011-three.min.js =====


      precision mediump float;
      precision mediump int;

      varying vec3 vOutputDirection;

      uniform samplerCube envMap;

      ${tu()}

      void main() {

        gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
        gl_FragColor.rgb = envMapTexelToLinear( textureCube( envMap, vec3( - vOutputDirection.x, vOutputDirection.yz ) ) ).rgb;
        gl_FragColor = linearToOutputTexel( gl_FragColor );

      }
    

// ===== shader 4 — 011-three.min.js =====


    precision mediump float;
    precision mediump int;

    attribute vec3 position;
    attribute vec2 uv;
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
  

// ===== shader 5 — 011-three.min.js =====
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

        gl_FragColor = linearToOutputTexel( gl_FragColor );

      }
    

// ===== shader 6 — 051-63349.js =====

    varying vec2 vUv;
    varying vec2 vL, vR, vT, vB;
    uniform vec2 u_texel;
    void main () {
      vUv = uv;
      vL = vUv - vec2(u_texel.x, 0.);
      vR = vUv + vec2(u_texel.x, 0.);
      vT = vUv + vec2(0., u_texel.y);
      vB = vUv - vec2(0., u_texel.y);
      gl_Position = vec4(position.xy, 0., 1.);
    }
  

// ===== shader 7 — 051-63349.js =====

    precision highp float;
    varying vec2 vUv;
    uniform sampler2D u_input;
    uniform float u_ratio;
    uniform vec3 u_value;
    uniform vec2 u_point;
    uniform float u_size;
    void main () {
      vec2 p = vUv - u_point;
      p.x *= u_ratio;
      vec3 splat = pow(2., -dot(p, p) / u_size) * u_value;
      vec3 base = texture2D(u_input, vUv).xyz;
      gl_FragColor = vec4(base + splat, 1.);
    }
  

// ===== shader 8 — 051-63349.js =====

    precision highp float;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D u_velocity;
    void main () {
      float L = texture2D(u_velocity, vL).y;
      float R = texture2D(u_velocity, vR).y;
      float T = texture2D(u_velocity, vT).x;
      float B = texture2D(u_velocity, vB).x;
      gl_FragColor = vec4(.5 * (R - L - T + B), 0., 0., 1.);
    }
  

// ===== shader 9 — 051-63349.js =====

    precision highp float;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D u_velocity;
    uniform sampler2D u_curl;
    uniform float u_strength;
    uniform float u_dt;
    void main () {
      float L = texture2D(u_curl, vL).x;
      float R = texture2D(u_curl, vR).x;
      float T = texture2D(u_curl, vT).x;
      float B = texture2D(u_curl, vB).x;
      float C = texture2D(u_curl, vUv).x;
      vec2 force = .5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + .0001;
      force *= u_strength * C;
      force.y *= -1.;
      vec2 vel = texture2D(u_velocity, vUv).xy + force * u_dt;
      gl_FragColor = vec4(clamp(vel, -1000., 1000.), 0., 1.);
    }
  

// ===== shader 10 — 051-63349.js =====

    precision highp float;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D u_velocity;
    void main () {
      float L = texture2D(u_velocity, vL).x;
      float R = texture2D(u_velocity, vR).x;
      float T = texture2D(u_velocity, vT).y;
      float B = texture2D(u_velocity, vB).y;
      gl_FragColor = vec4(.6 * (R - L + T - B), 0., 0., 1.);
    }
  

// ===== shader 11 — 051-63349.js =====

    precision highp float;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D u_pressure;
    uniform sampler2D u_divergence;
    uniform sampler2D u_sceneDepth;
    uniform float u_depthBlock;
    void main () {
      float L = texture2D(u_pressure, vL).x;
      float R = texture2D(u_pressure, vR).x;
      float T = texture2D(u_pressure, vT).x;
      float B = texture2D(u_pressure, vB).x;
      float div = texture2D(u_divergence, vUv).x;
      float pressure = (L + R + B + T - div) * .25;
      pressure += u_depthBlock * texture2D(u_sceneDepth, vUv).r;
      gl_FragColor = vec4(pressure, 0., 0., 1.);
    }
  

// ===== shader 12 — 051-63349.js =====

    precision highp float;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform sampler2D u_pressure;
    uniform sampler2D u_velocity;
    void main () {
      float L = texture2D(u_pressure, vL).x;
      float R = texture2D(u_pressure, vR).x;
      float T = texture2D(u_pressure, vT).x;
      float B = texture2D(u_pressure, vB).x;
      vec2 vel = texture2D(u_velocity, vUv).xy - vec2(R - L, T - B);
      gl_FragColor = vec4(vel, 0., 1.);
    }
  

// ===== shader 13 — 051-63349.js =====

    precision highp float;
    varying vec2 vUv;
    uniform sampler2D u_velocity;
    uniform sampler2D u_input;
    uniform sampler2D u_sceneDepth;
    uniform vec2 u_texel;
    uniform float u_dt;
    uniform float u_dissipation;
    uniform float u_cling;
    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
      vec2 st = uv / tsize - .5;
      vec2 iuv = floor(st);
      vec2 fuv = fract(st);
      vec4 a = texture2D(sam, (iuv + vec2(.5, .5)) * tsize);
      vec4 b = texture2D(sam, (iuv + vec2(1.5, .5)) * tsize);
      vec4 c = texture2D(sam, (iuv + vec2(.5, 1.5)) * tsize);
      vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
      return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }
    void main () {
      vec2 coord = vUv - u_dt * bilerp(u_velocity, vUv, u_texel).xy * u_texel;
      float diss = mix(u_dissipation, .998, texture2D(u_sceneDepth, vUv).r * u_cling);
      gl_FragColor = diss * bilerp(u_input, coord, u_texel);
      gl_FragColor.a = 1.;
    }
  

// ===== shader 14 — 051-63349.js =====

    precision highp float;
    varying vec2 vUv;
    uniform sampler2D u_map;
    uniform vec4 u_cover;   // span.xy, object-position.zw
    uniform vec2 u_range;
    uniform float u_fill;
    uniform float u_base;   // 1 = base layer paints everywhere
    void main () {
      vec2 uv = u_cover.zw * (1. - u_cover.xy) + vUv * u_cover.xy;
      vec4 ds = texture2D(u_map, uv);
      float d = u_range.x + ds.r * (u_range.y - u_range.x);
      float v = mix(u_fill, d, ds.a);
      gl_FragColor = vec4(vec3(v), max(u_base, ds.a));
    }
  

// ===== shader 15 — 051-63349.js =====

    varying vec2 vUv;
    varying vec2 vStage;
    void main () {
      vUv = uv;
      vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.);
      vStage = p.xy * .5 + .5;
      gl_Position = p;
    }
  

// ===== shader 16 — 051-63349.js =====

    precision highp float;
    varying vec2 vUv;
    varying vec2 vStage;
    uniform sampler2D uMap;
    uniform sampler2D uDepthMap;
    uniform sampler2D uDye;
    uniform vec4  uCoverP;
    uniform vec4  uCoverD;
    uniform vec2  uMouse;
    uniform float uParallax;
    uniform float uFocus;
    uniform float uZoom;
    uniform vec2  uDepthRange;
    uniform float uFillDepth;
    uniform float uThreshold;
    uniform float uEdge;
    uniform float uDepthBias;
    uniform float uGraySat;
    uniform float uGrayBright;
    uniform vec4  uClip;   // wrapper rect in stage space (x0,y0,x1,y1)

    float readDepth (vec2 uvD) {
      vec4 ds = texture2D(uDepthMap, uvD);
      float mapD = uDepthRange.x + ds.r * (uDepthRange.y - uDepthRange.x);
      return mix(uFillDepth, mapD, ds.a);
    }

    void main () {
      vec2 Sp = uCoverP.xy / uZoom;
      vec2 baseP = uCoverP.zw * (1. - Sp) + vUv * Sp;
      vec2 Sd = uCoverD.xy / uZoom;
      vec2 baseD = uCoverD.zw * (1. - Sd) + vUv * Sd;

      // iterative refinement: the shift converges to the SOURCE
      // pixel