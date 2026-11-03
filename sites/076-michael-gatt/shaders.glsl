// ===== shader 1 — 001-BzTUYzf6.js =====


		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

// ===== shader 2 — 001-BzTUYzf6.js =====


		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}

// ===== shader 3 — 017-D0CTZJX0.js =====


		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

// ===== shader 4 — 017-D0CTZJX0.js =====


		uniform float opacity;
		uniform float mixRatio;

		uniform sampler2D tDiffuse1;
		uniform sampler2D tDiffuse2;

		varying vec2 vUv;

		void main() {

			vec4 texel1 = texture2D( tDiffuse1, vUv );
			vec4 texel2 = texture2D( tDiffuse2, vUv );
			gl_FragColor = opacity * mix( texel1, texel2, mixRatio );

		}

// ===== shader 5 — 024-47pVCtBX.js =====
uniform float uCurveAmountX;
uniform float uCurveAmountY;
uniform float uImageWidth;
uniform float uImageHeight;
uniform float uSizeFactorX;
uniform float uSizeFactorY;
uniform float uTiltAngle;

varying vec2 vUv;
varying float fogDepth;

void main() {
  vUv = uv;
  vec3 pos = position;

  
  float percentageX = (abs(pos.x) / (uImageWidth * 0.5)) * 1000.0;
  float percentageY = (abs(pos.y) / (uImageHeight * 0.5)) * 1000.0;
  pos.z += uCurveAmountX * pow(percentageX, 2.0) * 0.003 * uSizeFactorX;
  pos.z += uCurveAmountY * pow(percentageY, 2.0) * 0.003 * uSizeFactorY;

  
  pos.z += pos.y * tan(uTiltAngle);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  fogDepth = -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
}

// ===== shader 6 — 024-47pVCtBX.js =====
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uWarpProgress;

varying vec2 vUv;

void main() {
    
    vec2 centeredUV = vUv - 0.5;

    
    float x = smoothstep(0.0, 1.0, (uWarpProgress * 2.0 + abs(centeredUV.y) * 2.0 - 1.0));

    
    vec2 warpedUV = mix(vUv, centeredUV * (1.0 - x) + 0.5, x);

    
    vec4 texColor = texture2D(uTexture, warpedUV);

    
    float warpOpacity = mix(1.0, 0.0, x); 

    
    texColor.a *= uOpacity * warpOpacity;

    gl_FragColor = texColor;
}

// ===== shader 7 — 030-CaSYcmUf.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 8 — 030-CaSYcmUf.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 9 — 030-CaSYcmUf.js =====
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
		

// ===== shader 10 — 030-CaSYcmUf.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 11 — 030-CaSYcmUf.js =====


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
	

// ===== shader 12 — 030-CaSYcmUf.js =====

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