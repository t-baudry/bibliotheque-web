// ===== shader 1 — 002-vendor.C2s8bVVS6b4d5903.js =====
varying vec2 vUv;uniform mat3 uvTransform;void main(){vUv=(uvTransform*vec3(uv,1)).xy;gl_Position=vec4(position.xy,1.0,1.0);}

// ===== shader 2 — 002-vendor.C2s8bVVS6b4d5903.js =====
precision mediump float;precision mediump int;uniform float flipEnvMap;varying vec3 vOutputDirection;uniform samplerCube envMap;void main(){gl_FragColor=textureCube(envMap,vec3(flipEnvMap*vOutputDirection.x,vOutputDirection.yz));}

// ===== shader 3 — 002-vendor.C2s8bVVS6b4d5903.js =====
precision mediump float;precision mediump int;attribute float faceIndex;varying vec3 vOutputDirection;vec3 getDirection(vec2 uv,float face){uv=2.0*uv-1.0;vec3 direction=vec3(uv,1.0);if(face==0.0){direction=direction.zyx;}else if(face==1.0){direction=direction.xzy;direction.xz*=-1.0;}else if(face==2.0){direction.x*=-1.0;}else if(face==3.0){direction=direction.zyx;direction.xz*=-1.0;}else if(face==4.0){direction=direction.xzy;direction.xy*=-1.0;}else if(face==5.0){direction.z*=-1.0;}return direction;}void main(){vOutputDirection=getDirection(uv,faceIndex);gl_Position=vec4(position,1.0);}

// ===== shader 4 — 002-vendor.C2s8bVVS6b4d5903.js =====
precision highp float;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;attribute vec3 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}

// ===== shader 5 — 002-vendor.C2s8bVVS6b4d5903.js =====
uniform sampler2D shadow_pass;uniform vec2 resolution;uniform float radius;void main(){const float samples=float(VSM_SAMPLES);float mean=0.0;float squared_mean=0.0;float uvStride=samples<=1.0?0.0:2.0/(samples-1.0);float uvStart=samples<=1.0?0.0:-1.0;for(float i=0.0;i<samples;i++){float uvOffset=uvStart+i*uvStride;
#ifdef HORIZONTAL_PASS
vec2 distribution=texture2D(shadow_pass,(gl_FragCoord.xy+vec2(uvOffset,0.0)*radius)/resolution).rg;mean+=distribution.x;squared_mean+=distribution.y*distribution.y+distribution.x*distribution.x;
#else
float depth=texture2D(shadow_pass,(gl_FragCoord.xy+vec2(0.0,uvOffset)*radius)/resolution).r;mean+=depth;squared_mean+=depth*depth;
#endif
}mean=mean/samples;squared_mean=squared_mean/samples;float std_dev=sqrt(max(0.0,squared_mean-mean*mean));gl_FragColor=vec4(mean,std_dev,0.0,1.0);}

// ===== shader 6 — 002-vendor.C2s8bVVS6b4d5903.js =====

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

// ===== shader 7 — 003-loader.CM330CYc6b4d5903.js =====
s left/right side and/or top/bottom edge if flagged.
    vec2 placePoint(vec2 nd, float stickX, float stickY) {
        vec2 p = u_rectMin + nd * u_rectSize;
        if (stickX < -0.5) p.x = 0.0;
        else if (stickX > 0.5) p.x = 1.0;
        if (stickY < -0.5) p.y = 0.0;
        else if (stickY > 0.5) p.y = 1.0;
        return p;
    }

    void main() {
        vec2 pixelPos = vUv * u_virtualResolution;
        float combinedAlpha = 0.0;

        for (int i = 0; i < NUM_LINES; i++) {

            float drawT = u_progress[i] * mix(1.0, u_centerDashFactor, u_centerDashMask[i]);
            if (drawT <= 0.0) continue;

            vec2 startPx = placePoint(u_starts[i], u_stickStarts[i], u_stickStartsY[i]) * u_virtualResolution;
            vec2 endPx   = placePoint(u_ends[i],   u_stickEnds[i],   u_stickEndsY[i])   * u_virtualResolution;

            vec2 netBase   = placePoint(u_starts[i], 0.0, u_stickStartsY[i]) * u_virtualResolution;
            vec2 target    = mix(endPx, mix(netBase, endPx, u_netFactor), u_netMask[i]);
            vec2 currentEndPx = mix(startPx, target, drawT);

            vec2 center = (startPx + currentEndPx) * 0.5;
            vec2 size   = abs(startPx - currentEndPx) * 0.5;

            if (abs(startPx.x - endPx.x) > abs(startPx.y - endPx.y)) {
                size.y += u_thickness * 0.5;
            } else {
                size.x += u_thickness * 0.5;
            }

            float d = sdBox(pixelPos, center, size);
            float aa = fwidth(d);
            if (aa == 0.0) aa = 1.0;
            aa *= 1.5;

            float alpha = 1.0 - smoothstep(-aa, aa, d);
            combinedAlpha = max(combinedAlpha, alpha);
        }

        vec3 lineColor = applyCustomOverlay(u_lineColor, vUv);
        vec3 finalColor = mix(u_bgColor, lineColor, combinedAlpha);
        gl_FragColor = vec4(finalColor, combinedAlpha * u_opacity);
    }


// ===== shader 8 — 003-loader.CM330CYc6b4d5903.js =====

    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }


// ===== shader 9 — 003-loader.CM330CYc6b4d5903.js =====
precision highp float;varying vec2 vUv;varying vec2 vUvLogo;varying float vSurfaceId;uniform sampler2D map;uniform sampler2D tLogoMap;uniform vec3 uMiuMiuColor;uniform vec3 uNbColor;uniform float uSeamShade;void main(){vec3 albedo=texture2D(map,vUv).rgb;float isWool=step(0.5,vSurfaceId);albedo*=mix(uSeamShade,1.0,isWool);vec2 logo=texture2D(tLogoMap,vUvLogo).rg;float NB=smoothstep(0.5,0.55,logo.r-0.19);float MIU=smoothstep(0.5,0.55,logo.g-0.19);float logoAlpha=clamp(NB+MIU,0.0,1.0);vec3 logoColor=uMiuMiuColor*MIU+uNbColor*NB;vec3 color=mix(albedo,logoColor,logoAlpha*logoAlpha);gl_FragColor=vec4(color,1.0);}

// ===== shader 10 — 003-loader.CM330CYc6b4d5903.js =====
#define PI 3.14159265359
varying vec2 vUv;varying vec2 vUvLogo;varying float vSurfaceId;attribute float surfaceId;uniform float uLogoScale;mat2 rotate2d(float a){float s=sin(a);float c=cos(a);return mat2(c,s,-s,c);}void main(){vUv=uv;vSurfaceId=surfaceId;vUvLogo=(uv-.5)*uLogoScale*rotate2d(PI*.5)*vec2(1.,-1.)+.5+vec2(0.,0.05);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}

// ===== shader 11 — 003-loader.CM330CYc6b4d5903.js =====
precision highp float;varying vec2 vPos;uniform vec3 uColor;uniform float uOpacity;uniform float uFalloff;void main(){float d=length(vPos)*2.0;float a=exp(-d*d*uFalloff);gl_FragColor=vec4(uColor,a*uOpacity);}

// ===== shader 12 — 003-loader.CM330CYc6b4d5903.js =====
varying vec2 vPos;void main(){vPos=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}

// ===== shader 13 — 003-loader.CM330CYc6b4d5903.js =====
varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}

// ===== shader 14 — 003-loader.CM330CYc6b4d5903.js =====

    varying vec2 vPos;
    void main() {
        vPos = position.xy;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }


// ===== shader 15 — 003-loader.CM330CYc6b4d5903.js =====

    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }


// ===== shader 16 — 003-loader.CM330CYc6b4d5903.js =====

    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }


// ===== shader 17 — 003-loader.CM330CYc6b4d5903.js =====
precision highp float;varying vec2 vPos;uniform float uProgress;uniform vec3 uColor;uniform float uOpacity;uniform vec3 uSharpness;uniform vec3 uOffset;uniform float uStart;uniform float uEnd;float ring(float dist,float radius,float sharpness,float fade){float edge=abs(dist-radius);return exp(-sharpness*edge)*fade;}void main(){float dist=length(vPos);float base=mix(uStart,uEnd,uProgress);float fade=smoothstep(0.0,0.08,uProgress)*(1.0-uProgress);float a=ring(dist,base+uOffset.x,uSharpness.x,fade)+ring(dist,base+uOffset.y,uSharpness.y,fade)+ring(dist,base+uOffset.z,uSharpness.z,fade);a=clamp(a,0.0,1.0)*uOpacity;gl_FragColor=vec4(uColor*a,a);}

// ===== shader 18 — 003-loader.CM330CYc6b4d5903.js =====
varying vec2 vPos;void main(){vPos=(uv-0.5)*2.0;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}

// ===== shader 19 — 003-loader.CM330CYc6b4d5903.js =====
precision highp float;varying vec2 vUv;uniform sampler2D uPicture;uniform float uProgress;uniform float uZoomProgress;uniform vec2 uOrigin;uniform float uInvert;uniform float uTime;uniform vec2 uRepeat;uniform vec2 uOffset;uniform vec2 uResolution;uniform vec3 uGlowColor;uniform float uThickness;uniform float uPortraitReach;const vec3 WIDTH=vec3(0.06,0.015,0.2);const vec3 OFFSET=vec3(0.0,0.035,0.075);const float GLOW=0.35;const float DISPLACE=4.0;const float ZOOM=3.;const float ZOOM_EASE=3.0;float ring(float d,float radius,float width){return exp(-abs(d-radius)/width);}float easeOut(float t,float power){return 1.0-pow(1.0-t,power);}void main(){float aspect=uResolution.x/uResolution.y;vec2 p=(vUv-0.5)*vec2(aspect,1.0);vec2 o=(uOrigin-0.5)*vec2(aspect,1.0);float d=distance(p,o);float maxDist=length(vec2(aspect,1.0))+OFFSET.z+0.05+uPortraitReach;float base=uProgress*maxDist;float r1=base-OFFSET.x;float r2=base-OFFSET.y;float r3=base-OFFSET.z;float m1=smoothstep(r1+0.02,r1-0.02,d);float m2=smoothstep(r2+0.02,r2-0.02,d);float m3=smoothstep(r3+0.02,r3-0.02,d);float reveal=(m1+m2+m3)/3.0;float mask=mix(reveal,1.0-reveal,uInvert);float decay=40.0/uThickness;float e1=sin((d-r1)*35.0-uTime*6.0)*exp(-abs(d-r1)*decay);float e2=sin((d-r2)*35.0-uTime*6.0)*exp(-abs(d-r2)*decay);float e3=sin((d-r3)*35.0-uTime*6.0)*exp(-abs(d-r3)*decay);float disp=(e1+e2+e3)*0.04*DISPLACE;float zt=uInvert>0.5?1.0:easeOut(uZoomProgress,ZOOM_EASE);float zoom=mix(ZOOM,1.0,zt);vec2 dir=normalize(p-o+1e-4)/vec2(aspect,1.0);vec2 sUv=(vUv-0.5)/zoom+0.5+dir*disp*0.6;vec3 pic=texture2D(uPicture,sUv*uRepeat+uOffset).rgb;float fade=smoothstep(0.0,0.08,uProgress)*(1.0-uProgress);float rings=ring(d,r1,WIDTH.x)+ring(d,r2,WIDTH.y)+ring(d,r3,WIDTH.z);float glow=clamp(rings,0.0,1.0)*fade*GLOW;gl_FragColor=vec4(pic*mask+uGlowColor*glow,mask);}

// ===== shader 20 — 003-loader.CM330CYc6b4d5903.js =====
varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}