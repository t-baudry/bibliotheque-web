// ===== shader 1 — 013-three.min.js =====
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 013-three.min.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
  vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
  gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 013-three.min.js =====


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
    

// ===== shader 4 — 013-three.min.js =====


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
  

// ===== shader 5 — 013-three.min.js =====
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
    

// ===== shader 6 — 016-62015.js =====

        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      

// ===== shader 7 — 016-62015.js =====

        varying vec2 vUv;
        uniform float uProgress;
        uniform vec2 uCenter;
        uniform vec3 uColor;
        uniform float uAspect;
        uniform float uTime;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }
        float fbm(vec2 p) {
          float v = 0.0; float a = 0.5;
          for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p *= 2.1;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = vUv;
          vec2 c = uCenter;
          uv.x *= uAspect;
          c.x *= uAspect;

          float d = distance(uv, c);
          float t = uTime * 0.3;

          float ramp = smoothstep(0.0, 0.5, uProgress);

          vec2 q = vec2(
            fbm(uv * 3.0 + t),
            fbm(uv * 3.0 + 37.2 - t)
          );
          float n = fbm(uv * 4.0 + q * 1.8) * 0.55 * ramp;

          float g = (fbm(uv * 15.0 + 5.1 + t * 0.6) - 0.5) * 0.12 * ramp;

          float edge = uProgress - n + g;
          float mask = smoothstep(edge - 0.012, edge, d);

          gl_FragColor = vec4(uColor, mask);
        }
      

// ===== shader 8 — 016-62015.js =====
#version 300 es
      precision highp float;
      in vec2 aPos;
      out vec2 vUv;
      void main () {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }

// ===== shader 9 — 016-62015.js =====
#version 300 es
      precision highp float;
      in vec2 vUv; out vec4 fragColor;
      uniform sampler2D uField;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point;
        p.x *= aspectRatio;
        float g = exp(-dot(p, p) / radius);
        vec4 f = texture(uField, vUv);
        float w = clamp(g * color.x, 0.0, 1.0);
        fragColor = vec4(
          f.r + g * color.x,
          mix(f.g, color.y, w),
          mix(f.b, color.z, w),
          1.0
        );
      }

// ===== shader 10 — 016-62015.js =====
#version 300 es
      precision highp float;
      in vec2 vUv; out vec4 fragColor;
      uniform sampler2D uField;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float friction;
      uniform float spread;
      uniform float decay;
      uniform float wobble;
      uniform float grain;
      uniform float time;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1, 0)), f.x),
          mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
      }
      float fbm(vec2 p) {
        return noise(p) * 0.55 + noise(p * 2.6) * 0.3 + noise(p * 6.3) * 0.15;
      }

      void main () {
        vec2 vel = texture(uField, vUv).gb;
        vec2 coord = vUv - vel * dt;
        vec4 s = texture(uField, coord);

        float t = time * 0.3;
        vec2 warp = (vec2(
          fbm(vUv * 11.0 + t),
          fbm(vUv * 11.0 + 37.2 - t)
        ) - 0.5) * 2.0 * wobble * texelSize;

        vec4 nL = texture(uField, coord + vec2(-texelSize.x, 0.0) + warp);
        vec4 nR = texture(uField, coord + vec2( texelSize.x, 0.0) + warp);
        vec4 nT = texture(uField, coord + vec2(0.0,  texelSize.y) + warp);
        vec4 nB = texture(uField, coord + vec2(0.0, -texelSize.y) + warp);
        float avgD = (nL.r + nR.r + nT.r + nB.r) * 0.25;
        vec2 avgV = (nL.gb + nR.gb + nT.gb + nB.gb) * 0.25;

        float d = mix(s.r, avgD, spread);
        vec2 v = mix(s.gb, avgV, spread * 0.5);

        float g = fbm(vUv * 15.0 + 5.1 + t * 0.6);
        d *= 1.0 / (1.0 + (decay + grain * decay * (g - 0.5) * 2.0) * dt);
        v *= 1.0 / (1.0 + friction * dt);

        fragColor = vec4(max(d, 0.0), v, 1.0);
      }

// ===== shader 11 — 016-62015.js =====
#version 300 es
      precision highp float;
      in vec2 vUv; out vec4 fragColor;
      uniform sampler2D uField;
      uniform vec3 maskColor;
      uniform vec2 edge;
      uniform float bottomFade;
      uniform float time;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1, 0)), f.x),
          mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
      }
      float fbm(vec2 p) {
        return noise(p) * 0.55 + noise(p * 2.6) * 0.3 + noise(p * 6.3) * 0.15;
      }

      void main () {
        float d = texture(uField, vUv).r;

        float n = fbm(vec2(vUv.x * 9.0, time * 0.25));
        float localFade = bottomFade * (0.35 + n * 1.3);
        d *= smoothstep(0.0, localFade, vUv.y);

        float alpha = 1.0 - smoothstep(edge.x, edge.y, d);
        fragColor = vec4(maskColor, alpha);
      }