// ===== shader 1 — 001-main-BYq3OzcY.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 001-main-BYq3OzcY.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 3 — 001-main-BYq3OzcY.js =====
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
		

// ===== shader 4 — 001-main-BYq3OzcY.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 5 — 001-main-BYq3OzcY.js =====


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
	

// ===== shader 6 — 001-main-BYq3OzcY.js =====


		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}

// ===== shader 7 — 001-main-BYq3OzcY.js =====


		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}

// ===== shader 8 — 001-main-BYq3OzcY.js =====

    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }


// ===== shader 9 — 001-main-BYq3OzcY.js =====

    precision mediump float;

    uniform sampler2D tDiffuse;
    uniform sampler2D uTextureA;
    uniform sampler2D uTextureB;
    uniform float uProgress;
    uniform float uOpacity;
    uniform float uLinearizeA;
    uniform float uLinearizeB;
    uniform vec2 uCoverScaleA;
    uniform vec2 uCoverScaleB;
    uniform float uZoom; 

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    uniform float uParallaxOn;
    uniform float uParallaxSlot; 
    uniform sampler2D uAtlas;
    uniform vec2 uAtlasCell;   
    uniform vec2 uAtlasInset;  
    uniform vec2 uParallax;    
    uniform float uParallaxAmp; 
    
    
    
    uniform vec2 uBgParallax;
    uniform float uBgParallaxAmp;
    uniform float uViewportAspect; 

    varying vec2 vUv;

    
    vec3 sRGBToLinear(vec3 c) {
        return pow(max(c, 0.0), vec3(2.2));
    }

    
    
    
    
    
    
    
    
    
    
    #define NUM_GARDEN_LAYERS 6
    uniform vec4  uLayerRect[NUM_GARDEN_LAYERS];
    uniform vec2  uLayerHalfSize[NUM_GARDEN_LAYERS]; 
    uniform vec2  uLayerCenter[NUM_GARDEN_LAYERS];   
    uniform float uLayerDepth[NUM_GARDEN_LAYERS];    
    
    
    
    uniform float uGardenBright;
    uniform float uGardenWhitewash;
    uniform float uGardenBloom;

    vec4 gardenLayer(vec4 r, vec2 hsRaw, vec2 c, float d) {
        vec2 hs = vec2(hsRaw.x / uViewportAspect, hsRaw.y); 
        vec2 shift = uParallax * (uParallaxAmp * d);
        vec2 p = (vUv - c - shift) / (2.0 * hs) + 0.5;
        if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) return vec4(0.0);
        return texture2D(uAtlas, r.xy + p * r.zw);
    }

    
    
    
    
    
    
    vec3 parallaxStack(vec2 base) {
        
        
        vec2 hs0 = vec2(uLayerHalfSize[0].x / uViewportAspect, uLayerHalfSize[0].y);
        vec2 sh0 = uParallax * (uParallaxAmp * uLayerDepth[0]);
        vec2 p0 = clamp((vUv - uLayerCenter[0] - sh0) / (2.0 * hs0) + 0.5, 0.0, 1.0);
        vec3 acc = texture2D(uAtlas, uLayerRect[0].xy + p0 * uLayerRect[0].zw).rgb;
        
        vec4 l;
        l = gardenLayer(uLayerRect[1], uLayerHalfSize[1], uLayerCenter[1], uLayerDepth[1]); acc = mix(acc, l.rgb, l.a);
        l = gardenLayer(uLayerRect[2], uLayerHalfSize[2], uLayerCenter[2], uLayerDepth[2]); acc = mix(acc, l.rgb, l.a);
        l = gardenLayer(uLayerRect[3], uLayerHalfSize[3], uLayerCenter[3], uLayerDepth[3]); acc = mix(acc, l.rgb, l.a);
        l = gardenLayer(uLayerRect[4], uLayerHalfSize[4], uLayerCenter[4], uLayerDepth[4]); acc = mix(acc, l.rgb, l.a);
        l = gardenLayer(uLayerRect[5], uLayerHalfSize[5], uLayerCenter[5], uLayerDepth[5]); acc = mix(acc, l.rgb, l.a);

        
        
        vec3 col = acc * uGardenBright;
        
        col = mix(col, vec3(1.0), uGardenWhitewash);
        
        
        
        
        float lum = dot(col, vec3(0.299, 0.587, 0.114));
        float glow = smoothstep(0.42, 1.0, lum);
        col += glow * glow * uGardenBloom;
        return col;
    }

    
    
    
    vec4 sampleBgA() {
        if (uParallaxOn > 0.5 && uParallaxSlot < 0.5) {
            return vec4(parallaxStack(vUv - 0.5), 1.0);
        }
        
        
        
        vec2 uvA = (vUv - 0.5) * uCoverScaleA * uZoom * (1.0 - 2.0 * uBgParallaxAmp)
                 + uBgParallax * uBgParallaxAmp + 0.5;
        vec4 colorA = texture2D(uTextureA, uvA);
        if (uLinearizeA > 0.5) colorA.rgb = sRGBToLinear(colorA.rgb);
        return vec4(colorA.rgb * colorA.a, colorA.a);
    }

    
    
    vec4 sampleBgB() {
        if (uParallaxOn > 0.5 && uParallaxSlot > 0.5) {
            return vec4(parallaxStack(vUv - 0.5), 1.0);
        }
        
        
        
        vec2 uvB = (vUv - 0.5) * uCoverScaleB * uZoom * (1.0 - 2.0 * uBgParallaxAmp)
                 + uBgParallax * uBgParallaxAmp + 0.5;
        vec4 colorB = texture2D(uTextureB, uvB);
        if (uLinearizeB > 0.5) colorB.rgb = sRGBToLinear(colorB.rgb);
        return vec4(colorB.rgb * colorB.a, colorB.a);
    }

    void main() {
        vec4 sceneColor = texture2D(tDiffuse, vUv);

        
        vec4 pBg;
        if (uProgress < 0.001) {
            pBg = sampleBgA();
        } else if (uProgress > 0.999) {
            pBg = sampleBgB();
        } else {
            pBg = mix(sampleBgA(), sampleBgB(), uProgress);
        }
        pBg *= uOpacity;

        vec3 finalRGB = sceneColor.rgb + (pBg.rgb * (1.0 - sceneColor.a));

        gl_FragColor = vec4(finalRGB, 1.0);
    }


// ===== shader 10 — 001-main-BYq3OzcY.js =====

    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }


// ===== shader 11 — 001-main-BYq3OzcY.js =====

    precision mediump float;

    uniform sampler2D tDiffuse;
    uniform sampler2D uOverlayTextureA;
    uniform sampler2D uOverlayTextureB;

    uniform float uProgress;
    uniform float uOpacity;
    uniform float uEnableOverlay;
    
    
    
    
    
    uniform float uOverlayCenterReveal;

    uniform float uTime;
    uniform float uEnableNoise;
    uniform float uNoiseStrength;
    uniform sampler2D uNoiseTex;
    
    
    
    
    uniform vec2 uNoiseOffset;

    uniform vec2 uCoverScaleA;
    uniform vec2 uCoverScaleB;

    
    uniform sampler2D uGodRaysTex1;
    uniform sampler2D uGodRaysTex2;
    uniform float uGodRaysBlend;
    uniform vec2 uGodRaysCoverScale1;
    uniform vec2 uGodRaysCoverScale2;
    
    uniform vec4 uGodRaysRect1;
    uniform vec4 uGodRaysRect2;
    uniform float uGodRaysOpacity;
    uniform float uEnableGodRays;

    
    uniform float uRippleTime;
    uniform float uRippleStrength;
    uniform float uRippleHw;
    uniform float uViewportAspect;

    
    
    
    
    
    
    uniform sampler2D uHoverFrostTex;
    uniform vec2  uHoverPos;       
    uniform float uHoverRadius;    
    uniform float uHoverIntensity; 
    uniform float uHoverGlow;      
    uniform vec2  uHoverFrostCoverScale; 

    
    uniform float uExposure;
    uniform float uContrast;
    uniform float uSaturation;
    uniform float uRedTint; 

    varying vec2 vUv;

    vec3 linearToSRGB(vec3 c) {
        c = clamp(c, 0.0, 1.0);
        return mix(
            1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055,
            c * 12.92,
            vec3(lessThan(c, vec3(0.0031308)))
        );
    }

    void main() {
        vec4 sceneColor = texture2D(tDiffuse, vUv);

        vec3 finalRGB = sceneColor.rgb;

        
        
        
        if (uHoverIntensity > 0.001) {
            vec2 cm = vUv - uHoverPos;
            cm.x *= uViewportAspect;
            float dist = length(cm);
            
            
            float discMask =
                (1.0 - smoothstep(uHoverRadius * 0.95, uHoverRadius, dist))
                * uHoverIntensity;
            if (discMask > 0.001) {
                
                
                
                
                
                
                
                
                
                
                
                float glow = pow(1.0 - smoothstep(0.0, uHoverRadius, dist), 1.8);
                vec3 glowCol = vec3(1.0, 0.86, 0.62); 
                vec3 b = clamp(glowCol * glow * discMask * uHoverGlow, 0.0, 0.9);
                finalRGB = finalRGB / (1.0 - b);
            }
        }

        
        if (uEnableOverlay > 0.5 && uOpacity > 0.001) {
            vec4 pOverlay;
            if (uProgress < 0.001) {
                vec2 uvA = (vUv - 0.5) * uCoverScaleA + 0.5;
                vec4 ovA = texture2D(uOverlayTextureA, uvA);
                pOverlay = vec4(ovA.rgb * ovA.a, ovA.a);
            } else if (uProgress > 0.999) {
                vec2 uvB = (vUv - 0.5) * uCoverScaleB + 0.5;
                vec4 ovB = texture2D(uOverlayTextureB, uvB);
                pOverlay = vec4(ovB.rgb * ovB.a, ovB.a);
            } else {
                vec2 uvA = (vUv - 0.5) * uCoverScaleA + 0.5;
                vec2 uvB = (vUv - 0.5) * uCoverScaleB + 0.5;
                vec4 ovA = texture2D(uOverlayTextureA, uvA);
                vec4 ovB = texture2D(uOverlayTextureB, uvB);
                vec4 pA = vec4(ovA.rgb * ovA.a, ovA.a);
                vec4 pB = vec4(ovB.rgb * ovB.a, ovB.a);
                pOverlay = mix(pA, pB, uProgress);
            }
            pOverlay *= uOpacity;
            
            
            
            
            
            
            vec2 cm = vUv - 0.5;
            cm.x *= uViewportAspect;
            float dCenter = length(cm) * 2.0;
            float centerMask =
                1.0 - smoothstep(uOverlayCenterReveal - 4.0,
                                 uOverlayCenterReveal,
                                 dCenter);
            pOverlay *= centerMask;
            finalRGB = finalRGB * (1.0 - pOverlay.a) + pOverlay.rgb;
        }

        
        
        
        
        
        if (uEnableGodRays > 0.5 && uGodRaysOpacity > 0.001) {
            vec2 uvGr1 = (vUv - 0.5) * uGodRaysCoverScale1 + 0.5;
            vec2 uvGr2 = (vUv - 0.5) * uGodRaysCoverScale2 + 0.5;
            uvGr1 = uGodRaysRect1.xy + uvGr1 * uGodRaysRect1.zw;
            uvGr2 = uGodRaysRect2.xy + uvGr2 * uGodRaysRect2.zw;
            vec3 rays = mix(
                texture2D(uGodRaysTex1, uvGr1).rgb,
                texture2D(uGodRaysTex2, uvGr2).rgb,
                uGodRaysBlend
            );
            finalRGB += rays * uGodRaysOpacity;
        }

        
        
        
        
        if (uRippleStrength > 0.0) {
            float rt = uRippleTime;
            vec2 centered = vUv - 0.5;
            centered.x *= uViewportAspect;
            float dist = length(centered) * 2.0;
            float speed = mix(1.6, 6.0, clamp(rt / 3.0, 0.0, 1.0));
            
            
            
            float waveFront = mix(1.8, -0.9, fract(rt * speed));
            float hw = uRippleHw;
            float pulse = smoothstep(waveFront - hw, waveFront, dist)
                        * smoothstep(waveFront + hw, waveFront, dist);
            float rIntensity = smoothstep(0.0, 0.4, rt) * uRippleStrength;
            finalRGB += vec3(0.773, 1.0, 0.796) * pulse * rIntensity;
        }

        
        
        
        
        if (uEnableNoise > 0.5 && uNoiseStrength > 0.001) {
            vec2 noiseUv = gl_FragCoord.xy * 0.00390625 + uNoiseOffset;
            float n = texture2D(uNoiseTex, noiseUv).r;
            finalRGB += (n - 0.5) * uNoiseStrength;
        }

        
        finalRGB *= uExposure;
        
        
        finalRGB.g *= mix(1.0, 0.15, uRedTint);
        finalRGB.b *= mix(1.0, 0.10, uRedTint);
        float luma = dot(finalRGB, vec3(0.2126, 0.7152, 0.0722));
        finalRGB = mix(vec3(luma), finalRGB, uSaturation);
        finalRGB = clamp((finalRGB - 0.5) * uContrast + 0.5, 0.0, 1.0);
        finalRGB = linearToSRGB(finalRGB);

        gl_FragColor = vec4(finalRGB, sceneColor.a);
    }


// ===== shader 12 — 001-main-BYq3OzcY.js =====

  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }


// ===== shader 13 — 001-main-BYq3OzcY.js =====

  precision mediump float;

  uniform sampler2D tDiffuse;
  uniform sampler2D uTextTexture;
  uniform float uBrightness;
  uniform float uSaturation;
  varying vec2 vUv;

  vec3 linearToSRGB(vec3 c) {
    c = clamp(c, 0.0, 1.0);
    return mix(
      1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055,
      c * 12.92,
      vec3(lessThan(c, vec3(0.0031308)))
    );
  }

  void main() {
    vec4 bg   = texture2D(tDiffuse, vUv);
    vec4 text = texture2D(uTextTexture, vUv);

    
    
    vec3 textColor = text.a > 0.001 ? text.rgb / text.a : vec3(0.0);

    
    vec3 adjusted = textColor + uBrightness;

    
    float luma = dot(adjusted, vec3(0.2126, 0.7152, 0.0722));
    adjusted = mix(vec3(luma), adjusted, uSaturation);

    
    
    adjusted = linearToSRGB(adjusted);

    
    vec3 finalRGB = bg.rgb * (1.0 - text.a) + adjusted * text.a;
    gl_FragColor = vec4(finalRGB, bg.a);
  }


// ===== shader 14 — 001-main-BYq3OzcY.js =====

  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }


// ===== shader 15 — 001-main-BYq3OzcY.js =====

  uniform sampler2D uPrevTrail;
  uniform sampler2D uFrostTexture;
  uniform float     uHasFrostTexture;
  uniform vec2      uFrostCoverScale;
  uniform vec2      uCursorUV;
  uniform float     uCursorRadius;
  uniform float     uFade;       
  uniform float     uHeadFade;   
  uniform float     uAspect;
  uniform float     uCursorActive;
  uniform float     uCursorIntensity;
  uniform float     uSpread;
  uniform float     uSpreadStep;
  uniform vec2      uSpreadAxis;
  varying vec2 vUv;

  void main() {
    vec2 prev2 = texture2D(uPrevTrail, vUv).rg;
    float prev     = prev2.r;
    float prevHead = prev2.g;

    
    
    
    if (uSpread > 0.5) {
      vec2 fUv = (vUv - 0.5) * uFrostCoverScale + 0.5;
      float iceLuma = uHasFrostTexture > 0.5
        ? dot(texture2D(uFrostTexture, fUv).rgb, vec3(0.299, 0.587, 0.114))
        : 1.0;
      float md = 0.4 + iceLuma * 1.2;
      float s = uSpreadStep * md;
      vec2 dir = uSpreadAxis;
      dir.x *= s;
      dir.y *= s * uAspect;
      float d = 0.92;
      float m = prev;
      m = max(m, texture2D(uPrevTrail, vUv + dir).r * d);
      m = max(m, texture2D(uPrevTrail, vUv + dir * 2.0).r * d * d);
      m = max(m, texture2D(uPrevTrail, vUv - dir).r * d);
      m = max(m, texture2D(uPrevTrail, vUv - dir * 2.0).r * d * d);
      
      
      gl_FragColor = vec4(m, prevHead * uHeadFade, 0.0, 1.0);
      return;
    }

    float faded     = prev     * uFade;
    float headFaded = prevHead * uHeadFade;

    
    vec2  delta = vUv - uCursorUV;
    delta.x    *= uAspect;
    float dist  = length(delta);

    
    float discBase = 1.0 - smoothstep(0.0, uCursorRadius, dist);

    
    vec2  frostUv = (vUv - 0.5) * uFrostCoverScale + 0.5;
    float iceLuma = uHasFrostTexture > 0.5
      ? dot(texture2D(uFrostTexture, frostUv).rgb, vec3(0.299, 0.587, 0.114))
      : 1.0;
    
    
    float perceivedLuma = pow(max(iceLuma, 0.0), 1.0 / 2.2);
    float texContrast = clamp(0.0001 + (perceivedLuma - 0.5) * 5.0, 0.0, 5.0);
    float disc = discBase * texContrast;

    
    float contrib = disc * uCursorActive * uCursorIntensity;
    float trail = max(faded, contrib);

    
    
    
    
    float headContrib = discBase * uCursorActive * uCursorIntensity;
    float headTrail = max(headFaded, headContrib);

    gl_FragColor = vec4(trail, headTrail, 0.0, 1.0);
  }


// ===== shader 16 — 001-main-BYq3OzcY.js =====

  precision highp float;
  uniform sampler2D uHeight;
  uniform vec2  uTexelSize;
  uniform float uStrength;
  uniform float uSampleStride;   
  varying vec2 vUv;

  void main() {
    
    
    
    vec2 px = uTexelSize * uSampleStride;
    float h00 = dot(texture2D(uHeight, vUv + vec2(-px.x, -px.y)).rgb, vec3(0.333));
    float h10 = dot(texture2D(uHeight, vUv + vec2(0.0,   -px.y)).rgb, vec3(0.333));
    float h20 = dot(texture2D(uHeight, vUv + vec2( px.x, -px.y)).rgb, vec3(0.333));
    float h01 = dot(texture2D(uHeight, vUv + vec2(-px.x, 0.0)).rgb,   vec3(0.333));
    float h21 = dot(texture2D(uHeight, vUv + vec2( px.x, 0.0)).rgb,   vec3(0.333));
    float h02 = dot(texture2D(uHeight, vUv + vec2(-px.x,  px.y)).rgb, vec3(0.333));
    float h12 = dot(texture2D(uHeight, vUv + vec2(0.0,    px.y)).rgb, vec3(0.333));
    float h22 = dot(texture2D(uHeight, vUv + vec2( px.x,  px.y)).rgb, vec3(0.333));

    
    
    float gx = (h20 + 2.0 * h21 + h22) - (h00 + 2.0 * h01 + h02);
    float gy = (h02 + 2.0 * h12 + h22) - (h00 + 2.0 * h10 + h20);

    
    vec3 n = normalize(vec3(-gx * uStrength, -gy * uStrength, 1.0));

    
    gl_FragColor = vec4(n * 0.5 + 0.5, 1.0);
  }


// ===== shader 17 — 001-main-BYq3OzcY.js =====

  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }


// ===== shader 18 — 001-main-BYq3OzcY.js =====

  uniform sampler2D tDiffuse;
  uniform sampler2D uTrailTexture;
  uniform sampler2D uFrostTexture;     
  uniform sampler2D uIceNormalTxt;     
  uniform float     uOpacity;
  uniform float     uWhiteout;
  uniform float     uTrailWhite;
  uniform float     uMelt;            
  uniform float     uCenterWhite;     
  uniform float     uLightIntensity;
  uniform vec2      uFrostCoverScale;
  uniform float     uHasFrostTexture;
  uniform float     uHasIceNormal;
  uniform float     uLoadProgress;
  uniform float     uDisplacement;     
  uniform float     uAspect;           
  uniform vec2      uNormalBias;       
  uniform vec2      uFrostShift;       
  varying vec2 vUv;

  
  float rand(vec2 n) {
    vec3 p = fract(vec3(n.xyx) * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  void main() {
    
    
    
    vec2 trailData = texture2D(uTrailTexture, vUv + uFrostShift).rg;
    float cleared  = trailData.r; 
    float headRaw  = trailData.g; 

    
    
    
    vec2 ratioUv = (vUv - 0.5) * uFrostCoverScale + 0.5 + uFrostShift;

    
    
    vec4 frostTex = uHasFrostTexture > 0.5
      ? texture2D(uFrostTexture, ratioUv)
      : vec4(1.0);
    float iceDensity = frostTex.r;
    float iceLuma    = iceDensity;
    float noise      = rand(vUv * 20.0);

    
    
    
    
    float freezeVal  = (1.0 - vUv.y) * 0.6 + iceLuma * 0.4;
    float prog       = uLoadProgress * 1.5;
    float freezeMask = 1.0 - smoothstep(prog - 0.35, prog, freezeVal);

    
    
    
    
    
    
    
    
    
    
    
    
    vec2 meltDelta = vUv - 0.5;
    meltDelta.x *= uAspect;
    float meltDist = length(meltDelta);
    float meltEdge = uMelt - 0.2 + (iceLuma - 0.5) * 0.2;
    float meltMask = smoothstep(meltEdge - 0.05, meltEdge + 0.05, meltDist);

    
    
    float clearMask = clamp(1.0 - cleared, 0.0, 1.0);

    
    
    
    
    
    vec2 iceNorm = uHasIceNormal > 0.5
      ? texture2D(uIceNormalTxt, ratioUv).rg * 2.0 - 1.0 - uNormalBias
      : vec2(0.0);

    
    
    
    vec2 disp = iceNorm * uDisplacement * iceDensity * clearMask * freezeMask * meltMask;
    vec4 scene = texture2D(tDiffuse, vUv + disp);

    
    
    
    
    
    
    
    
    float centerWhite = 1.0 - smoothstep(uCenterWhite - 0.7, uCenterWhite, meltDist);
    scene.rgb = mix(scene.rgb, vec3(1.0), centerWhite);

    
    
    
    vec3 frostBase  = frostTex.rgb * uLightIntensity;
    vec3 frostColor = mix(scene.rgb, frostBase, 0.3);

    
    float frostAlpha = uOpacity * (1.0 - cleared);

    
    
    float edgeZone  = smoothstep(0.5, 0.7, cleared) * (1.0 - smoothstep(0.7, 0.95, cleared));
    float roughEdge = clamp(0.5 + (iceLuma - 0.5) * 2.5, 0.0, 1.0);
    frostAlpha = mix(frostAlpha, frostAlpha * roughEdge, edgeZone);
    frostAlpha *= (0.8 + 0.2 * noise);
    frostAlpha  = clamp(frostAlpha, 0.0, 1.0);

    
    float freezeEdge = smoothstep(0.0, 0.5, freezeMask) * (1.0 - smoothstep(0.5, 1.0, freezeMask));
    
    freezeEdge += (noise - 0.5) * 0.06;
    freezeEdge = clamp(freezeEdge, 0.0, 1.0);
    frostColor = mix(frostColor, vec3(0.773, 1.0, 0.796), freezeEdge);

    frostAlpha *= freezeMask;
    frostAlpha = max(frostAlpha, freezeEdge);

    
    
    
    
    float cappedCleared = min(cleared, 2.0);
    float trailGlow = smoothstep(0.05, 0.5, cappedCleared)
                    * (1.0 - smoothstep(0.5, 1.2, cappedCleared));

    
    
    
    
    
    float trailHead = smoothstep(0.15, 0.5, headRaw);

    float combinedGlow = max(trailGlow, trailHead);
    frostColor = mix(frostColor, vec3(1.0), combinedGlow);
    frostAlpha = max(frostAlpha, combinedGlow * uOpacity);

    
    frostColor = mix(frostColor, vec3(1.0), uWhiteout);
    frostAlpha = mix(frostAlpha, 1.0, uWhiteout);

    
    float trailWhite = cleared * uTrailWhite;
    frostColor = mix(frostColor, vec3(1.0), trailWhite);
    frostAlpha = max(frostAlpha, trailWhite * uOpacity);

    
    
    
    frostAlpha *= meltMask;

    
    
    
    
    
    float meltRim = 4.0 * meltMask * (1.0 - meltMask);
    frostColor = mix(frostColor, vec3(1.0), meltRim);
    frostAlpha = max(frostAlpha, meltRim * uOpacity);

    vec3 finalRGB = scene.rgb * (1.0 - frostAlpha) + frostColor * frostAlpha;
    gl_FragColor  = vec4(finalRGB, scene.a);
  }


// ===== shader 19 — 001-main-BYq3OzcY.js =====

  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }


// ===== shader 20 — 001-main-BYq3OzcY.js =====

  precision mediump float;
  uniform sampler2D tDiffuse;
  varying vec2 vUv;
  void main() {
    gl_FragColor = texture2D(tDiffuse, vUv);
  }


// ===== shader 21 — 001-main-BYq3OzcY.js =====

  varying vec2 vUv;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vViewNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }


// ===== shader 22 — 001-main-BYq3OzcY.js =====

  precision mediump float;
  
  
  uniform sampler2D uMapA;
  uniform sampler2D uMapB;
  uniform float uBlend;
  uniform float uFresnelPower;
  varying vec2 vUv;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }


// ===== shader 23 — 001-main-BYq3OzcY.js =====

  precision mediump float;
  uniform sampler2D tDiffuse;
  uniform sampler2D uShatter;
  uniform sampler2D uHandMask;
  varying vec2 vUv;

  vec3 linearToSRGB(vec3 c) {
    c = clamp(c, 0.0, 1.0);
    return mix(
      1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055,
      c * 12.92,
      vec3(lessThan(c, vec3(0.0031308)))
    );
  }

  void main() {
    vec4 live    = texture2D(tDiffuse, vUv);
    vec4 shatter = texture2D(uShatter, vUv);
    float handMask = texture2D(uHandMask, vUv).r;

    
    float mask = shatter.a * (1.0 - handMask);

    
    
    gl_FragColor = vec4(mix(live.rgb, linearToSRGB(shatter.rgb), mask), 1.0);
  }


// ===== shader 24 — 001-main-BYq3OzcY.js =====

  varying vec3 vViewNormal;
  varying vec2 vUv;
  void main() {
    vViewNormal = normalize(normalMatrix * normal);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }


// ===== shader 25 — 001-main-BYq3OzcY.js =====

  precision mediump float;
  varying vec3 vViewNormal;
  varying vec2 vUv;
  void main() {
    vec3 n = normalize(vViewNormal);
    gl_FragColor = vec4(n.xy * 0.5 + 0.5, fract(vUv));
  }


// ===== shader 26 — 001-main-BYq3OzcY.js =====

  precision mediump float;

  uniform sampler2D tDiffuse;
  uniform sampler2D uNormalMask;
  uniform sampler2D uRefractionMap;

  uniform float uRefraction;
  uniform float uDispersion;
  uniform float uMapStrength;
  uniform vec2  uMapScale;
  uniform vec3  uTintColor;
  uniform float uFresnelPower;
  uniform vec2  uPixelSize;
  uniform float uEdgeHighlight;

  varying vec2 vUv;

  void main() {
    vec4 m = texture2D(uNormalMask, vUv);

    
    vec4 live = texture2D(tDiffuse, vUv);
    if (m.r + m.g < 0.01) {
      gl_FragColor = live;
      return;
    }

    
    vec2 nxy = m.rg * 2.0 - 1.0;
    float nz  = sqrt(max(0.0, 1.0 - dot(nxy, nxy)));

    
    float rm = texture2D(uRefractionMap, m.ba * uMapScale).r;

    
    vec2 offset = nxy * uRefraction + (rm - 0.5) * uMapStrength * nxy;

    
    vec3 glass;
    if (uDispersion < 0.001) {
      glass = texture2D(tDiffuse, vUv + offset).rgb;
    } else {
      glass = vec3(
        texture2D(tDiffuse, vUv + offset * (1.0 - uDispersion)).r,
        texture2D(tDiffuse, vUv + offset).g,
        texture2D(tDiffuse, vUv + offset * (1.0 + uDispersion)).b
      );
    }

    
    glass *= uTintColor;

    
    float fresnel = 0.04 + 0.96 * pow(1.0 - nz, uFresnelPower);
    glass += vec3(0.92, 0.95, 1.0) * fresnel;

    
    if (uEdgeHighlight > 0.001) {
      vec2 nL = texture2D(uNormalMask, vUv + vec2(-uPixelSize.x, 0.0)).rg;
      vec2 nR = texture2D(uNormalMask, vUv + vec2( uPixelSize.x, 0.0)).rg;
      vec2 nT = texture2D(uNormalMask, vUv + vec2(0.0,  uPixelSize.y)).rg;
      vec2 nB = texture2D(uNormalMask, vUv + vec2(0.0, -uPixelSize.y)).rg;
      float dN = length(nR - nL) + length(nT - nB);
      glass += vec3(1.0) * smoothstep(0.02, 0.15, dN) * uEdgeHighlight;
    }

    
    gl_FragColor = vec4(mix(live.rgb, glass, 1.0), live.a);
  }


// ===== shader 27 — 001-main-BYq3OzcY.js =====
varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }

// ===== shader 28 — 001-main-BYq3OzcY.js =====

    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }


// ===== shader 29 — 001-main-BYq3OzcY.js =====

    precision mediump float;
    uniform sampler2D tDiffuse;
    uniform vec2 uHalfPixel;
    varying vec2 vUv;

    void main() {
        vec4 sum = texture2D(tDiffuse, vUv) * 4.0;
        sum += texture2D(tDiffuse, vUv - uHalfPixel);
        sum += texture2D(tDiffuse, vUv + uHalfPixel);
        sum += texture2D(tDiffuse, vUv + vec2(uHalfPixel.x, -uHalfPixel.y));
        sum += texture2D(tDiffuse, vUv - vec2(uHalfPixel.x, -uHalfPixel.y));
        gl_FragColor = sum / 8.0;
    }


// ===== shader 30 — 001-main-BYq3OzcY.js =====

    precision mediump float;
    uniform sampler2D tDiffuse;
    uniform vec2 uHalfPixel;
    varying vec2 vUv;

    void main() {
        vec4 sum = vec4(0.0);
        
        sum += texture2D(tDiffuse, vUv + vec2(-uHalfPixel.x * 2.0, 0.0));
        sum += texture2D(tDiffuse, vUv + vec2( uHalfPixel.x * 2.0, 0.0));
        sum += texture2D(tDiffuse, vUv + vec2(0.0, -uHalfPixel.y * 2.0));
        sum += texture2D(tDiffuse, vUv + vec2(0.0,  uHalfPixel.y * 2.0));
        
        sum += texture2D(tDiffuse, vUv + vec2(-uHalfPixel.x, -uHalfPixel.y)) * 2.0;
        sum += texture2D(tDiffuse, vUv + vec2( uHalfPixel.x, -uHalfPixel.y)) * 2.0;
        sum += texture2D(tDiffuse, vUv + vec2(-uHalfPixel.x,  uHalfPixel.y)) * 2.0;
        sum += texture2D(tDiffuse, vUv + vec2( uHalfPixel.x,  uHalfPixel.y)) * 2.0;
        gl_FragColor = sum / 12.0;
    }


// ===== shader 31 — 001-main-BYq3OzcY.js =====

    precision mediump float;
    uniform sampler2D tOriginal;
    uniform sampler2D tBlurred;
    uniform vec2  uFocalPoint;
    uniform float uFocalRadius;
    uniform float uFalloff;
    uniform vec2  uResolution;
    varying vec2 vUv;

    void main() {
        float aspect = uResolution.x / uResolution.y;
        vec2 delta = (vUv - uFocalPoint) * vec2(aspect, 1.0);
        float dist = length(delta);
        float blend = smoothstep(uFocalRadius, uFocalRadius + uFalloff, dist);
        gl_FragColor = mix(
            texture2D(tOriginal, vUv),
            texture2D(tBlurred, vUv),
            blend
        );
    }


// ===== shader 32 — 001-main-BYq3OzcY.js =====

    precision mediump float;

    uniform sampler2D uTextureA;
    uniform sampler2D uTextureB;
    
    
    
    
    uniform vec2 uTexOffsetA;
    uniform vec2 uTexScaleA;
    uniform vec2 uTexOffsetB;
    uniform vec2 uTexScaleB;
    uniform float uProgress;
    uniform float uOpacity;

    
    
    
    
    uniform sampler2D uAlphaMap;
    uniform vec2 uAlphaOffset;
    uniform vec2 uAlphaScale;

    #ifdef USE_RIPPLE
        uniform float uRippleTime;
        uniform float uRippleIntensity;
        uniform vec2  uRippleResolution;
        uniform float uRippleHw;
    #endif

    varying vec2 vUv;

    void main() {
        
        
        
        vec4 colorA = texture2D(uTextureA, vUv * uTexScaleA + uTexOffsetA);
        vec4 colorB = texture2D(uTextureB, vUv * uTexScaleB + uTexOffsetB);

        
        
        vec4 pA = vec4(colorA.rgb * colorA.a, colorA.a);
        vec4 pB = vec4(colorB.rgb * colorB.a, colorB.a);
        vec4 pMix = mix(pA, pB, uProgress);

        
        
        
        float alphaMask = texture2D(uAlphaMap, vUv * uAlphaScale + uAlphaOffset).r;
        float outA = pMix.a * uOpacity * alphaMask;
        vec3 outRGB = pMix.rgb * uOpacity * alphaMask;

        #ifdef USE_RIPPLE
            if (uRippleIntensity > 0.001) {
                vec2 screenUv = gl_FragCoord.xy / uRippleResolution;
                vec2 centered = screenUv - 0.5;
                centered.x *= uRippleResolution.x / uRippleResolution.y;
                float dist = length(centered) * 2.0;
                float speed = mix(1.6, 6.0, clamp(uRippleTime / 3.0, 0.0, 1.0));
                float waveFront = mix(1.8, -0.9, fract(uRippleTime * speed));
                float hw = uRippleHw;
                float pulse = smoothstep(waveFront - hw, waveFront, dist)
                            * smoothstep(waveFront + hw, waveFront, dist);
                outRGB += vec3(0.773, 1.0, 0.796) * pulse * uRippleIntensity * outA;
            }
        #endif

        gl_FragColor = vec4(outRGB, outA);
    }


// ===== shader 33 — 001-main-BYq3OzcY.js =====

  attribute vec3 aOffset;
  attribute vec3 aVelocity;
  attribute float aPhase;
  attribute vec4 aPetalRect;
  attribute float aScale;
  attribute vec2 aRotSpeed;

  uniform float uTime;
  uniform float uSwirlTime;
  uniform vec3 uBounds;
  uniform vec3 uBoundsCenter;
  uniform float uEntry;

  varying vec2 vUv;
  varying vec4 vPetalRect;
  varying float vOpacity;
  varying float vBrightness;
  varying float vSaturation;
  varying float vFresnel;

  vec3 wrapPos(vec3 p, vec3 b) {
    return mod(p + b, 2.0 * b) - b;
  }

  void main() {
    // --- Position pipeline operates in box-centered coords (cp),
    // so wrap / swirl / fade are symmetric about the bounding box

// ===== shader 34 — 001-main-BYq3OzcY.js =====

  precision mediump float;

  uniform sampler2D uAtlas;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec4 vPetalRect;
  varying float vOpacity;
  varying float vBrightness;
  varying float vSaturation;
  varying float vFresnel;

  void main() {
    // Per-petal atlas sub-rect (vPetalRect = offset.xy, scale.zw). A 1% inset
    // keeps ETC1S block edges from bleeding across neighbouring petals.
    vec2 atlasUV = vPetalRect.xy + vPetalRect.zw * (0.01 + vUv * 0.98);

    vec4 texel = texture2D(uAtlas, atlasUV);

    // Combined discard: texture alpha AND envelope opacity. Edge-fade
    // petals + per-instance opacity can have ~20% of fragments effectively
    // invisible — skip all the colour-grading math (luma dot, mix, fresnel
    // chroma reconstruction) for them.
    float outA = texel.a * uOpacity * vOpacity;
    if (outA < 0.005) discard;

    float lum = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
    vec3 color = mix(vec3(lum), texel.rgb, vSaturation) * vBrightness;
    float fresnelFactor = 0.65 + 1.15 * vFresnel;
    float baseLum = lum * vBrightness;
    float newLum = baseLum * fresnelFactor;
    vec3 chroma = color - baseLum;
    color = newLum + chroma * (newLum / max(baseLum, 0.001));
    gl_FragColor = vec4(color, outA);
  }


// ===== shader 35 — 001-main-BYq3OzcY.js =====

  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }


// ===== shader 36 — 001-main-BYq3OzcY.js =====

  
  
  
  
  
  
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uMaxBlur;
  uniform float uProgress; 
  uniform vec2 uAtlasOffset;
  uniform vec2 uAtlasScale;
  uniform float uNoiseSeed;
  uniform float uAspect;
  
  
  uniform float uRotate;

  
  
  
  
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  
  
  
  
  vec3 flareBoost(vec3 rgb, float flare) {
    float luma = dot(rgb, vec3(0.299, 0.587, 0.114));
    return mix(vec3(luma), rgb, 1.0 + 3.0 * flare) * (1.0 + 0.25 * flare);
  }

  void main() {
    
    vec2 suv = (uRotate > 0.5) ? vec2(vUv.y, 1.0 - vUv.x) : vUv;

    
    
    
    
    if (uProgress >= 0.999) {
      gl_FragColor = texture2D(uTexture, uAtlasOffset + suv * uAtlasScale);
      return;
    }

    float effectiveProgress = uProgress * 1.3;

    
    float n = vnoise(vec2(suv.x * uAspect, suv.y) * 4.0 + uNoiseSeed);
    float mask = suv.x * 0.5 + n * 0.5;
    
    
    
    
    float flare = smoothstep(effectiveProgress - 0.85, effectiveProgress + 0.1, mask);
    flare *= 1.0 - smoothstep(0.8, 1.0, uProgress);
    float alpha = smoothstep(effectiveProgress + 0.3, effectiveProgress - 0.1, mask);

    
    
    if (alpha < 0.005) discard;

    vec2 aUv = uAtlasOffset + suv * uAtlasScale;

  #ifdef LITE_TEXT
    
    
    
    
    
    vec4 c0 = texture2D(uTexture, aUv);
    gl_FragColor = vec4(flareBoost(c0.rgb, flare), c0.a * alpha);
  #else
    
    float blurFactor = smoothstep(effectiveProgress - 0.5, effectiveProgress + 0.3, mask);

    
    
    
    
    
    if (blurFactor < 0.03) {
      vec4 c0 = texture2D(uTexture, aUv);
      gl_FragColor = vec4(flareBoost(c0.rgb, flare), c0.a * alpha);
      return;
    }

    
    
    float r = blurFactor * uMaxBlur * 0.003;

    
    vec4 color = texture2D(uTexture, aUv) * 2.0;
    float total = 2.0;

    
    vec2 uv1 = clamp(suv + vec2(r,          0.0),        0.0, 1.0);
    vec2 uv2 = clamp(suv + vec2(r * 0.5,    r * 0.866),  0.0, 1.0);
    vec2 uv3 = clamp(suv + vec2(-r * 0.5,   r * 0.866),  0.0, 1.0);
    vec2 uv4 = clamp(suv + vec2(-r,          0.0),        0.0, 1.0);
    vec2 uv5 = clamp(suv + vec2(-r * 0.5,  -r * 0.866),  0.0, 1.0);
    vec2 uv6 = clamp(suv + vec2(r * 0.5,   -r * 0.866),  0.0, 1.0);

    color += texture2D(uTexture, uAtlasOffset + uv1 * uAtlasScale);
    color += texture2D(uTexture, uAtlasOffset + uv2 * uAtlasScale);
    color += texture2D(uTexture, uAtlasOffset + uv3 * uAtlasScale);
    color += texture2D(uTexture, uAtlasOffset + uv4 * uAtlasScale);
    color += texture2D(uTexture, uAtlasOffset + uv5 * uAtlasScale);
    color += texture2D(uTexture, uAtlasOffset + uv6 * uAtlasScale);
    total += 6.0;

    color /= total;

    gl_FragColor = vec4(flareBoost(color.rgb, flare), color.a * alpha);
  #endif
  }


// ===== shader 37 — 001-main-BYq3OzcY.js =====

  precision highp float;
  uniform float uTime;
  uniform float uSeed;
  uniform float uWaveAmp;
  uniform float uWaveFreq;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    float wave = sin(uv.x * uWaveFreq + uTime * 2.0 + uSeed * 6.283) * uWaveAmp;
    wave += sin(uv.y * uWaveFreq * 0.7 + uTime * 1.5 + uSeed * 3.7) * uWaveAmp * 0.5;
    pos.z += wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }


// ===== shader 38 — 001-main-BYq3OzcY.js =====

    
    
    
    
    
    precision highp float;
    attribute float aStripIndex;

    uniform float uShredProgress;
    uniform float uNumStrips;
    uniform float uWaviness;
    uniform float uTime;
    uniform float uSeed;

    varying vec2 vUv;
    varying float vStripBelowAmount;
    varying float vStripId;
    varying vec2 vMatcapUv;

    
    
    
    
    float stripHash(float p) {
        p = fract(p * 0.1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
    }

    void main() {
        vUv = uv;

        
        float stripId = aStripIndex + uSeed * 137.0;
        vStripId = stripId;

        
        float pastAmount = clamp((uShredProgress - uv.x) / 0.4, 0.0, 1.0);
        vStripBelowAmount = pastAmount;

        
        float s = uSeed * 6.283;
        float p1 = uTime * 1.2 + uv.x * 5.0 + uv.y * 3.0 + s;
        float p2 = uTime * 1.8 + uv.x * 3.0 - uv.y * 4.0 + s * 1.7;
        float p3 = uTime * 0.7 + uv.y * 6.0 + s * 2.3;
        float idleWave = uWaviness * (
            sin(p1) * 3.0 + sin(p2) * 2.0 + sin(p3) * 1.5
        );

        
        float shredWave = 0.0;
        float fall = 0.0;
        if (pastAmount > 0.0) {
            float h1 = stripHash(stripId);
            float h2 = stripHash(stripId + 10.0);
            float h3 = stripHash(stripId + 20.0);
            shredWave = pastAmount * uWaviness * (
                sin(uTime * (1.5 + h1 * 3.0) + uv.x * (5.0 + h2 * 8.0)) * (3.0 + h3 * 3.0)
              + sin(uTime * (2.2 + h2 * 2.0) + uv.y * (4.0 + h1 * 6.0)) * (2.0 + h1 * 2.0)
              + sin(uTime * (3.1 + h3 * 1.5) + uv.x * (9.0 + h3 * 5.0)) * (1.5 + h2 * 1.5)
            );
            float easedPast = pastAmount * pastAmount;
            fall = easedPast * (0.25 + stripHash(stripId + 3.3) * 0.25);

            
            float center = (uNumStrips - 1.0) * 0.5;
            float distFromCenter = (aStripIndex - center) / max(center, 1.0);
            fall -= easedPast * distFromCenter * 0.3;
        }

        float waveZ = idleWave + shredWave;
        vec3 displaced = vec3(position.x, position.y - fall, position.z + waveZ);

        
        if (pastAmount > 0.0) {
            float h4 = stripHash(stripId + 30.0);
            float h5 = stripHash(stripId + 40.0);
            float angle = pastAmount * pastAmount * (h4 * 2.0 - 1.0) * 3.0; 
            float stripCenterY = (aStripIndex + 0.5) / uNumStrips - 0.5;
            float localY = displaced.y - stripCenterY;
            float localZ = displaced.z;
            float cosA = cos(angle);
            float sinA = sin(angle);
            displaced.y = stripCenterY + localY * cosA - localZ * sinA;
            displaced.z = localY * sinA + localZ * cosA;

            
            float angleX = pastAmount * pastAmount * (h5 * 2.0 - 1.0) * 2.0;
            float localX = displaced.x;
            float localZ2 = displaced.z;
            float cosB = cos(angleX);
            float sinB = sin(angleX);
            displaced.x = localX * cosB - localZ2 * sinB;
            displaced.z = localX * sinB + localZ2 * cosB;
        }

        
        float dzdx = uWaviness * (cos(p1) * 5.0 * 3.0 + cos(p2) * 3.0 * 2.0);
        float dzdy = uWaviness * (cos(p1) * 3.0 * 3.0 - cos(p2) * 4.0 * 2.0 + cos(p3) * 6.0 * 1.5);
        float normalScale = 1.0;
        vec3 surfNormal = normalize(vec3(-dzdx * normalScale, -dzdy * normalScale, 1.0));

        vec3 viewNormal = normalize(normalMatrix * surfNormal);
        vMatcapUv = viewNormal.xy * 0.5 + 0.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }


// ===== shader 39 — 001-main-BYq3OzcY.js =====

    
    
    
    precision highp float;

    uniform sampler2D uTexture;
    uniform sampler2D uMatcap;
    uniform float uOpacity;
    uniform float uNumStrips;
    uniform float uMatcapStrength;
    uniform float uBrightness;
    
    
    uniform vec2 uTexOffset;
    uniform vec2 uTexScale;

    varying vec2 vUv;
    varying float vStripBelowAmount;
    varying float vStripId;
    varying vec2 vMatcapUv;

    
    float tearHash(float p) {
        p = fract(p * 0.1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
    }

    float tearNoise(float p) {
        float i = floor(p);
        float f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(tearHash(i), tearHash(i + 1.0), f);
    }

    float tearFbm(float p) {
        return tearNoise(p) * 0.5
             + tearNoise(p * 2.0 + 5.7) * 0.3
             + tearNoise(p * 4.0 + 11.3) * 0.2;
    }

    void main() {
        
        if (vStripBelowAmount > 0.01) {
            float localV = fract(vUv.y * uNumStrips);
            float tearDepth = 0.15 * smoothstep(0.0, 0.3, vStripBelowAmount);
            float seed = vStripId * 13.7;

            float tearBottom = tearFbm(vUv.x * 35.0 + seed) * tearDepth;
            float tearTop = tearFbm(vUv.x * 35.0 + seed + 100.0) * tearDepth;

            if (localV < tearBottom || localV > 1.0 - tearTop) {
                discard;
            }
        }

        
        vec2 mcUv = gl_FrontFacing ? vMatcapUv : vec2(1.0 - vMatcapUv.x, 1.0 - vMatcapUv.y);
        vec3 matcapColor = texture2D(uMatcap, mcUv).rgb;
        vec3 lighting = mix(vec3(1.0), matcapColor, uMatcapStrength) * uBrightness;

        
        if (!gl_FrontFacing) {
            vec3 backBase = vec3(0.341, 0.333, 0.286);
            gl_FragColor = vec4(backBase * lighting, uOpacity);
            return;
        }

        vec2 atlasUv = vUv * uTexScale + uTexOffset;
        vec4 texColor = texture2D(uTexture, atlasUv);
        gl_FragColor = vec4(texColor.rgb * lighting, texColor.a * uOpacity);
    }


// ===== shader 40 — 001-main-BYq3OzcY.js =====

    
    
    
    precision highp float;

    uniform float uWaviness;
    uniform float uTime;
    uniform float uSeed;

    varying vec2 vUv;
    varying vec2 vMatcapUv;

    void main() {
        vUv = uv;

        
        float s = uSeed * 6.283;
        float p1 = uTime * 1.2 + uv.x * 5.0 + uv.y * 3.0 + s;
        float p2 = uTime * 1.8 + uv.x * 3.0 - uv.y * 4.0 + s * 1.7;
        float p3 = uTime * 0.7 + uv.y * 6.0 + s * 2.3;
        float waveZ = uWaviness * (
            sin(p1) * 3.0 + sin(p2) * 2.0 + sin(p3) * 1.5
        );

        vec3 displaced = vec3(position.x, position.y, position.z + waveZ);

        
        float dzdx = uWaviness * (cos(p1) * 5.0 * 3.0 + cos(p2) * 3.0 * 2.0);
        float dzdy = uWaviness * (cos(p1) * 3.0 * 3.0 - cos(p2) * 4.0 * 2.0 + cos(p3) * 6.0 * 1.5);
        vec3 surfNormal = normalize(vec3(-dzdx, -dzdy, 1.0));

        vec3 viewNormal = normalize(normalMatrix * surfNormal);
        vMatcapUv = viewNormal.xy * 0.5 + 0.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
