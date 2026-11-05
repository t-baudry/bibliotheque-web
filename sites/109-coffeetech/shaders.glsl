// ===== shader 1 — 010-model-viewer.min.js =====
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 010-model-viewer.min.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
  vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
  gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 010-model-viewer.min.js =====
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
    

// ===== shader 4 — 010-model-viewer.min.js =====


      precision mediump float;
      precision mediump int;

      uniform float flipEnvMap;

      varying vec3 vOutputDirection;

      uniform samplerCube envMap;

      void main() {

        gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

      }
    

// ===== shader 5 — 010-model-viewer.min.js =====


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
  

// ===== shader 6 — 010-model-viewer.min.js =====

            varying vec2 vUv;
            void main(){
                vUv = uv;
                gl_Position = vec4(position.xy * 1.0,0.,.999999);
            }

// ===== shader 7 — 010-model-viewer.min.js =====

            uniform sampler2D blitTexture; 
            varying vec2 vUv;

            void main(){ 
                gl_FragColor = vec4(vUv.xy, 0, 1);
                
                #ifdef IS_SRGB
                gl_FragColor = LinearTosRGB( texture2D( blitTexture, vUv) );
                #else
                gl_FragColor = texture2D( blitTexture, vUv);
                #endif
            }

// ===== shader 8 — 010-model-viewer.min.js =====

      
      varying vec3 vOutputDirection;
  
      void main() {
  
        vOutputDirection = vec3( position );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  
      }
    

// ===== shader 9 — 010-model-viewer.min.js =====
 axis-angle rotation
          vec3 sampleDirection = vOutputDirection * cosTheta
            + cross( axis, vOutputDirection ) * sin( theta )
            + axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );
  
          return vec3( textureCube( envMap, sampleDirection ) );
  
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
      

// ===== shader 10 — 010-model-viewer.min.js =====


    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }

// ===== shader 11 — 010-model-viewer.min.js =====


    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

      vec4 sum = vec4( 0.0 );

      sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
      sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
      sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
      sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
      sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
      sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
      sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
      sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

      gl_FragColor = sum;

    }

// ===== shader 12 — 010-model-viewer.min.js =====


    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }

// ===== shader 13 — 010-model-viewer.min.js =====


    uniform sampler2D tDiffuse;
    uniform float v;

    varying vec2 vUv;

    void main() {

      vec4 sum = vec4( 0.0 );

      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

      gl_FragColor = sum;

    }

// ===== shader 14 — 011-model-viewer.min.js =====
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 15 — 011-model-viewer.min.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
  vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
  gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 16 — 011-model-viewer.min.js =====
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
    

// ===== shader 17 — 011-model-viewer.min.js =====


      precision mediump float;
      precision mediump int;

      uniform float flipEnvMap;

      varying vec3 vOutputDirection;

      uniform samplerCube envMap;

      void main() {

        gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

      }
    

// ===== shader 18 — 011-model-viewer.min.js =====


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
  

// ===== shader 19 — 011-model-viewer.min.js =====

            varying vec2 vUv;
            void main(){
                vUv = uv;
                gl_Position = vec4(position.xy * 1.0,0.,.999999);
            }

// ===== shader 20 — 011-model-viewer.min.js =====

            uniform sampler2D blitTexture; 
            varying vec2 vUv;

            void main(){ 
                gl_FragColor = vec4(vUv.xy, 0, 1);
                
                #ifdef IS_SRGB
                gl_FragColor = LinearTosRGB( texture2D( blitTexture, vUv) );
                #else
                gl_FragColor = texture2D( blitTexture, vUv);
                #endif
            }

// ===== shader 21 — 011-model-viewer.min.js =====

      
      varying vec3 vOutputDirection;
  
      void main() {
  
        vOutputDirection = vec3( position );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  
      }
    

// ===== shader 22 — 011-model-viewer.min.js =====
 axis-angle rotation
          vec3 sampleDirection = vOutputDirection * cosTheta
            + cross( axis, vOutputDirection ) * sin( theta )
            + axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );
  
          return vec3( textureCube( envMap, sampleDirection ) );
  
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
      

// ===== shader 23 — 011-model-viewer.min.js =====


    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }

// ===== shader 24 — 011-model-viewer.min.js =====


    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

      vec4 sum = vec4( 0.0 );

      sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
      sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
      sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
      sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
      sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
      sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
      sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
      sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

      gl_FragColor = sum;

    }

// ===== shader 25 — 011-model-viewer.min.js =====


    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }

// ===== shader 26 — 011-model-viewer.min.js =====


    uniform sampler2D tDiffuse;
    uniform float v;

    varying vec2 vUv;

    void main() {

      vec4 sum = vec4( 0.0 );

      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
      sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

      gl_FragColor = sum;

    }