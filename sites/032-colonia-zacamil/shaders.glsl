// ===== shader 1 — 003-DkhZ0TVB.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 003-DkhZ0TVB.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 003-DkhZ0TVB.js =====
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
		

// ===== shader 4 — 003-DkhZ0TVB.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 5 — 003-DkhZ0TVB.js =====


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
	

// ===== shader 6 — 003-DkhZ0TVB.js =====

uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepthEXT = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}

// ===== shader 7 — 003-DkhZ0TVB.js =====
attribute vec2 uv1;varying vec2 vUv;varying vec3 vPosition;varying vec3 vModelViewPosition;varying vec3 vWorldPosition;varying vec3 vNormal;varying float vInstanceId;
#ifdef IS_BIRD
uniform float uTime;
#endif
#if defined(IS_MURAL) || defined(IS_MURAL_BUILDING)
varying vec2 vUv1;
#endif
void main(){vUv=uv;
#if defined(IS_MURAL) || defined(IS_MURAL_BUILDING)
vUv1=uv1;
#endif
vec3 transformedNormal=normal;
#ifdef USE_INSTANCING
mat3 im=mat3(instanceMatrix);transformedNormal/=vec3(dot(im[0],im[0]),dot(im[1],im[1]),dot(im[2],im[2]));transformedNormal=im*transformedNormal;
#ifdef USE_TANGENT
transformedTangent=im*transformedTangent;
#endif
#endif
transformedNormal=normalMatrix*transformedNormal;vNormal=transformedNormal;vec4 modelPosition;vec3 pos=position;
#ifdef IS_BIRD
pos.y+=sin((uTime+float(gl_InstanceID))*2.)*abs(pos.x*pos.x);pos.x+=5.*cos(uTime*0.15+float(gl_InstanceID));pos.z+=5.*cos(uTime*0.15+float(gl_InstanceID));
#endif
#ifdef USE_INSTANCING
modelPosition=modelMatrix*instanceMatrix*vec4(pos,1.0);vInstanceId=float(gl_InstanceID);
#else
modelPosition=modelMatrix*vec4(pos,1.0);
#endif
vPosition=modelPosition.xyz;vec4 modelViewPosition=viewMatrix*modelPosition;vModelViewPosition=modelViewPosition.xyz;gl_Position=projectionMatrix*modelViewPosition;vWorldPosition=gl_Position.xyz;}

// ===== shader 8 — 003-DkhZ0TVB.js =====
precision highp float;uniform float uTime,uNightMode;uniform sampler2D uSolidNoise;varying vec2 vUv;varying float vInstanceId;vec3 adjustSaturation(vec3 color,float saturation){return mix(vec3(dot(color,vec3(0.2125,0.7154,0.0721))),color,saturation);}void main(){float time=uTime*.006;vec4 solidNoise=texture(uSolidNoise,vUv*(abs(sin(vInstanceId+0.5))*3.9)+vec2((time+(sin(vInstanceId*0.2)))));gl_FragColor.rgb=vec3(solidNoise.g);gl_FragColor.a=0.8;gl_FragColor.a*=smoothstep(0.3,1.,solidNoise.r);gl_FragColor.a*=smoothstep(0.5,0.4,abs(length(vUv-.5)));gl_FragColor.a*=mix(0.3,1.5,gl_FrontFacing);gl_FragColor.a*=mix(1.,0.1,uNightMode);gl_FragColor.rgb=adjustSaturation(gl_FragColor.rgb,1.-uNightMode*.65);if(gl_FragColor.a<0.005)discard;}

// ===== shader 9 — 003-DkhZ0TVB.js =====
precision highp float;varying vec2 vUv;varying float vInstanceId;void main(){vUv=uv;vec4 modelPosition;vec3 pos=position;
#ifdef USE_INSTANCING
modelPosition=modelMatrix*instanceMatrix*vec4(pos,1.0);vInstanceId=1.+float(gl_InstanceID);
#else
modelPosition=modelMatrix*vec4(pos,1.0);
#endif
gl_Position=projectionMatrix*viewMatrix*modelPosition;}

// ===== shader 10 — 003-DkhZ0TVB.js =====
precision highp float;uniform sampler2D tMap;uniform sampler2D tLabel;varying vec2 vUv;void main(){vec4 map=texture2D(tMap,vec2(1.-vUv.x,vUv.y));float label=smoothstep(.5,1.,length(texture2D(tLabel,1.-vUv)));gl_FragColor=mix(map,1.-map,label);}

// ===== shader 11 — 003-DkhZ0TVB.js =====
precision highp float;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;attribute vec2 uv;attribute vec3 position;varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}

// ===== shader 12 — 003-DkhZ0TVB.js =====
varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelMatrix*vec4(position,1.);}