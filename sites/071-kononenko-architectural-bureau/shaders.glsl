// ===== shader 1 — 010-BJv2xQ-z.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 010-BJv2xQ-z.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 010-BJv2xQ-z.js =====

			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		

// ===== shader 4 — 010-BJv2xQ-z.js =====
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
		

// ===== shader 5 — 010-BJv2xQ-z.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 6 — 010-BJv2xQ-z.js =====


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
	

// ===== shader 7 — 010-BJv2xQ-z.js =====

			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}

// ===== shader 8 — 010-BJv2xQ-z.js =====
uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}

// ===== shader 9 — 010-BJv2xQ-z.js =====

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

// ===== shader 10 — 010-BJv2xQ-z.js =====
precision mediump float;varying vec2 vUv;float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);float a=hash(i);float b=hash(i+vec2(1.0,0.0));float c=hash(i+vec2(0.0,1.0));float d=hash(i+vec2(1.0,1.0));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}float fbm(vec2 p){float v=0.0;float a=0.5;vec2 shift=vec2(100.0);mat2 rot=mat2(0.866,0.5,-0.5,0.866);for(int i=0;i<4;i++){v+=a*noise(p);p=rot*p*2.0+shift;a*=0.5;}return v;}void main(){gl_FragColor=vec4(fbm(vUv*8.0),noise(vUv*16.0),noise(vUv*24.0),1.0);}

// ===== shader 11 — 010-BJv2xQ-z.js =====
varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}

// ===== shader 12 — 010-BJv2xQ-z.js =====
precision highp float;uniform sampler2D uTexture;uniform float uClip;varying vec2 vUv;void main(){if(vUv.y<uClip)discard;gl_FragColor=texture2D(uTexture,vUv);}

// ===== shader 13 — 010-BJv2xQ-z.js =====
precision highp float;precision mediump sampler2D;uniform sampler2D uTexture;uniform vec2 uResolution;uniform vec2 uImageSize;uniform vec2 uParallax;uniform float uStrength;uniform float uContain;uniform float uZoom;uniform vec3 uBgColor;uniform float uBgOpacity;uniform vec3 uBorderColor;uniform float uBorderPx;uniform float uPaddingPx;uniform float uOpacity;varying vec2 vUv;vec2 coverUv(vec2 uv,vec2 containerSize,vec2 imageSize,float contain){float containerAspect=containerSize.x/containerSize.y;float imageAspect=imageSize.x/imageSize.y;vec2 scale=vec2(1.0);bool wider=containerAspect>imageAspect;if(wider!=(contain>0.5)){scale.y=imageAspect/containerAspect;}else{scale.x=containerAspect/imageAspect;}return(uv-0.5)*scale+0.5;}float edgeFeather(vec2 vUv){vec2 fw=fwidth(vUv);vec2 edge=smoothstep(vec2(0.0),fw,vUv)*smoothstep(vec2(0.0),fw,1.0-vUv);return edge.x*edge.y;}void main(){if(uOpacity<=0.001&&uBgOpacity<=0.001)discard;float edgeAlpha=edgeFeather(vUv);float insetPx=uBorderPx+uPaddingPx;vec2 insetUv=vec2(insetPx)/uResolution;vec2 contentUv=clamp((vUv-insetUv)/(1.0 - 2.0*insetUv),0.0,1.0);vec2 contentSize=uResolution*max(1.0-2.0*insetUv,vec2(0.001));vec2 uv=coverUv(contentUv,contentSize,uImageSize,uContain);uv=(uv-0.5)/uZoom+0.5;uv=(uv-0.5)*(1.0 - uStrength)+0.5;uv+=(uParallax-0.5)*uStrength;vec4 content;if(uContain>0.5&&(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0)){content=vec4(uBgColor,uBgOpacity);}else{vec4 texColor=texture2D(uTexture,uv);content=vec4(texColor.rgb,texColor.a*uOpacity);}if(insetPx<=0.0){gl_FragColor=vec4(content.rgb,content.a*edgeAlpha);return;}vec2 distPx=min(vUv,1.0-vUv)*uResolution;float edgePx=min(distPx.x,distPx.y);float aa=max(fwidth(edgePx),1e-4)*0.5;float bandB=uBorderPx>0.0 ? 1.0-smoothstep(uBorderPx - aa,uBorderPx+aa,edgePx): 0.0;float bandC=smoothstep(insetPx-aa,insetPx+aa,edgePx);float bandP=max(0.0,1.0-bandB - bandC);float alpha=uBgOpacity*(bandB+bandP)+content.a*bandC;if(alpha<=0.001)discard;vec3 rgb=((uBorderColor*bandB+uBgColor*bandP)*uBgOpacity+content.rgb*content.a*bandC)/alpha;gl_FragColor=vec4(rgb,alpha*edgeAlpha);}

// ===== shader 14 — 010-BJv2xQ-z.js =====
precision mediump float;precision mediump sampler2D;uniform sampler2D uTexture;uniform sampler2D uNoiseTex;uniform vec2 uResolution;uniform vec2 uImageSize;uniform float uProgress;uniform float uSoftness;uniform float uOpacity;uniform vec2 uMouse;uniform float uHover;uniform float uCircleRadius;uniform float uCircleSoftness;uniform float uExpandRadius;varying vec2 vUv;vec2 coverUv(vec2 uv,vec2 containerSize,vec2 imageSize,float contain){float containerAspect=containerSize.x/containerSize.y;float imageAspect=imageSize.x/imageSize.y;vec2 scale=vec2(1.0);bool wider=containerAspect>imageAspect;if(wider!=(contain>0.5)){scale.y=imageAspect/containerAspect;}else{scale.x=containerAspect/imageAspect;}return(uv-0.5)*scale+0.5;}float edgeFeather(vec2 vUv){vec2 fw=fwidth(vUv);vec2 edge=smoothstep(vec2(0.0),fw,vUv)*smoothstep(vec2(0.0),fw,1.0-vUv);return edge.x*edge.y;}void main(){float edgeAlpha=edgeFeather(vUv);vec2 uv=coverUv(vUv,uResolution,uImageSize,0.0);if(uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0){discard;}vec4 texColor=texture2D(uTexture,uv);float lum=dot(texColor.rgb,vec3(0.299,0.587,0.114));float ink=1.0-lum;vec3 bn=texture2D(uNoiseTex,vUv).rgb;float n=bn.r*0.5-0.25;float sweep=(1.0-uv.y)*0.55;float progress=uProgress*1.5;float threshold=(1.0-progress)+n+sweep;float soft=uSoftness*(0.7+0.6*bn.g);float mask=smoothstep(threshold,threshold+soft,ink);vec3 sketchColor=mix(vec3(1.0),texColor.rgb,mask);float aspect=uResolution.x/uResolution.y;vec2 diff=vUv-uMouse;diff.x*=aspect;float dist=length(diff);float edgeNoise=bn.b*0.02;float expand=1.0-smoothstep(uExpandRadius-0.12+edgeNoise,uExpandRadius+edgeNoise,dist);float circle=1.0-smoothstep(uCircleRadius-uCircleSoftness+edgeNoise,uCircleRadius+edgeNoise,dist);float settled=smoothstep(0.95,1.0,expand)+smoothstep(0.05,0.0,expand);circle*=uHover*min(settled,1.0);vec3 baseColor=mix(sketchColor,texColor.rgb,expand);vec3 peekColor=mix(texColor.rgb,sketchColor,expand);vec3 color=mix(baseColor,peekColor,circle);gl_FragColor=vec4(color,uOpacity*edgeAlpha);}

// ===== shader 15 — 010-BJv2xQ-z.js =====
precision highp float;uniform vec2 uResolution;uniform float uBorderPx;uniform float uOpacity;varying vec2 vUv;float edgeFeather(vec2 vUv){vec2 fw=fwidth(vUv);vec2 edge=smoothstep(vec2(0.0),fw,vUv)*smoothstep(vec2(0.0),fw,1.0-vUv);return edge.x*edge.y;}void main(){vec2 distPx=min(vUv,1.0-vUv)*uResolution;float edgePx=min(distPx.x,distPx.y);float aa=max(fwidth(edgePx),1e-4)*0.5;float band=1.0-smoothstep(uBorderPx - aa,uBorderPx+aa,edgePx);float alpha=uOpacity*band*edgeFeather(vUv);if(alpha<=0.001)discard;gl_FragColor=vec4(0.933,0.933,0.933,alpha);}

// ===== shader 16 — 010-BJv2xQ-z.js =====
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
}