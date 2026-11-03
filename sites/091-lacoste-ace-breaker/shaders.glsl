// ===== shader 1 — 002-vendor.6be70aa8526f9beb.js =====
attribute vec3 c,d; uniform vec4 e; uniform vec3 f,g;uniform mat4 h,i;varying vec3 j;void main(){vec3 a=normalize(d);vec4 b=h*vec4(c,1.);vec3 k=normalize(vec3(e-b));j=g*f*max(dot(k,a),0.),gl_Position=i*vec4(c,1.);}

// ===== shader 2 — 002-vendor.6be70aa8526f9beb.js =====
#ifdef GL_ES
precision mediump float;
#endif
varying vec3 j;void main(){gl_FragColor = vec4(j, 1.0);}

// ===== shader 3 — 003-webgl.a9816380526f9beb.js =====
varying vec2 vUv;uniform mat3 uvTransform;void main(){vUv=(uvTransform*vec3(uv,1)).xy;gl_Position=vec4(position.xy,1.0,1.0);}

// ===== shader 4 — 003-webgl.a9816380526f9beb.js =====
precision mediump float;precision mediump int;uniform float flipEnvMap;varying vec3 vOutputDirection;uniform samplerCube envMap;void main(){gl_FragColor=textureCube(envMap,vec3(flipEnvMap*vOutputDirection.x,vOutputDirection.yz));}

// ===== shader 5 — 003-webgl.a9816380526f9beb.js =====
precision mediump float;precision mediump int;attribute float faceIndex;varying vec3 vOutputDirection;vec3 getDirection(vec2 uv,float face){uv=2.0*uv-1.0;vec3 direction=vec3(uv,1.0);if(face==0.0){direction=direction.zyx;}else if(face==1.0){direction=direction.xzy;direction.xz*=-1.0;}else if(face==2.0){direction.x*=-1.0;}else if(face==3.0){direction=direction.zyx;direction.xz*=-1.0;}else if(face==4.0){direction=direction.xzy;direction.xy*=-1.0;}else if(face==5.0){direction.z*=-1.0;}return direction;}void main(){vOutputDirection=getDirection(uv,faceIndex);gl_Position=vec4(position,1.0);}

// ===== shader 6 — 003-webgl.a9816380526f9beb.js =====
#define PI 3.14159265359
precision lowp float;varying vec3 vPos;uniform float time;uniform vec3 color;uniform vec3 color2;uniform float darken;uniform float yOffset;uniform sampler2D noise;void main(){float a=smoothstep(-1.,1.,cos(vPos.x*PI*2.+1.2));vec3 c=mix(color,color2,smoothstep(0.8,-0.1,a)*smoothstep(-0.02,0.2,vPos.y)*smoothstep(1.0,0.,vPos.y));float nm=smoothstep(-280.,-190.,vPos.z);
#ifdef IS_MOBILE
float n=0.;
#else
float t=time*0.3;float na=texture2D(noise,vPos.xy*2.5+vec2(0.,t)).r;float nb=texture2D(noise,vPos.xy*2.+vec2(t*0.35+10.,0.)+na*0.2).r-0.5;float n=nb*2.*nm;
#endif
c=mix(c,c*0.1,smoothstep(mix(-150.,-270.,yOffset),mix(-50.,-200.,yOffset),vPos.z)-n*1.2);gl_FragColor=vec4(c*darken,1.);}

// ===== shader 7 — 003-webgl.a9816380526f9beb.js =====
precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 modelMatrix;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;varying vec3 vPos;varying vec2 vUv;void main(){vec3 transformed=vec3(position);vec4 mvPosition=vec4(transformed,1.0);mvPosition=modelViewMatrix*mvPosition;gl_Position=projectionMatrix*mvPosition;vec4 worldPosition=modelMatrix*vec4(transformed,1.0);vPos=vec3(uv.x,uv.y,worldPosition.y);}

// ===== shader 8 — 003-webgl.a9816380526f9beb.js =====
precision lowp float;uniform float shadowOpacity;uniform float shadowBlur;uniform float shadowScale;uniform float shadowAspect;uniform float isSphere;uniform float isBar;varying float vAlpha;varying vec2 vUv;float box(vec2 position,vec2 halfSize,float cornerRadius){position=abs(position)-halfSize+cornerRadius;return length(max(position,0.0))+min(max(position.x,position.y),0.0)-cornerRadius;}float sdChamferBox(vec2 p,vec2 b,float chamferTop,float chamferBottom){float chamfer=p.y<0.0?chamferTop:chamferBottom;p=abs(p)-b;p=(p.y>p.x)?p.yx:p.xy;p.y+=chamfer;const float k=1.0-sqrt(2.0);if(p.y<0.0&&p.y+p.x*k<0.0)return p.x;if(p.x<p.y)return(p.x+p.y)*sqrt(0.5);return length(p);}void main(){vec2 uv=vUv-0.5;vec2 correctedUv=vec2(uv.x*shadowAspect,uv.y);vec2 innerHalf=vec2(0.5*shadowAspect,0.5)/shadowScale;float sdf=box(correctedUv,innerHalf,0.02);float fadeZone=0.5-0.5/shadowScale;float normalizedDist=sdf/fadeZone;float shadow=smoothstep(1.0,-shadowBlur,normalizedDist);shadow=shadow*shadow;float sphereShadow=1.0-length(uv)*2.0;sphereShadow=smoothstep(0.0,1.0,sphereShadow);sphereShadow=sphereShadow*sphereShadow;shadow=mix(shadow,sphereShadow,isSphere);float barSdf=sdChamferBox(correctedUv,innerHalf,0.2,0.02);float barShadow=1.0-smoothstep(0.0,shadowBlur,barSdf+.71);shadow=mix(shadow,barShadow,isBar);float alpha=shadow*shadowOpacity*vAlpha;gl_FragColor=vec4(vec3(0.0),alpha);}

// ===== shader 9 — 003-webgl.a9816380526f9beb.js =====
precision lowp float;uniform float blockScale;uniform float shadowScale;attribute vec3 translation;attribute float alpha;varying float vAlpha;varying vec2 vUv;void main(){float isReal=step(0.0,translation.y);float a=smoothstep(0.12,1.,alpha)*isReal;vec3 pos=position;pos*=blockScale*shadowScale;pos+=translation;pos.y=0.001;vAlpha=a;vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);}

// ===== shader 10 — 003-webgl.a9816380526f9beb.js =====
precision lowp float;uniform vec3 color;varying float vFade;varying float vLight;varying vec2 vUv;void main(){vec2 uv=vUv;vec2 dist=uv-vec2(0.5);float sdf=smoothstep(1.,-1.,dot(dist,dist)*4.0)*smoothstep(1.,0.5,gl_FragCoord.w)*smoothstep(0.25,0.2,gl_FragCoord.w)*vFade;vec3 c=mix(color*0.3,color*1.3,vLight);gl_FragColor=vec4(c*sdf,1.);}

// ===== shader 11 — 003-webgl.a9816380526f9beb.js =====
precision highp float;attribute vec3 position;attribute vec2 uv;attribute vec3 translation;attribute float offset;uniform mat4 viewMatrix;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;uniform float time;uniform float boxSize;uniform vec3 boxPosition;uniform vec4 light1;uniform vec4 light2;uniform vec4 light3;uniform vec4 light4;varying vec2 vUv;varying float vFade;varying float vLight;
#define DURATION 100.0
#define INV_DURATION 0.01
void main(){vUv=uv;vec3 bbRight=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]);vec3 bbUp=vec3(viewMatrix[0][1],viewMatrix[1][1],viewMatrix[2][1]);vec3 billboard=bbRight*position.x+bbUp*position.y;vec3 t=translation;t.x+=cos(time*0.3+offset)*0.1;t.y+=cos(time*-0.33+offset*10.)*0.1;t.z+=sin(time*-0.22+offset*-6.-t.y)*0.12;vFade=1.;vLight=max(max(max(smoothstep(2.2,0.0,distance(light1.xyz,t)*0.5)*1.1*light1.w,smoothstep(2.2,0.0,distance(light2.xyz,t)*0.5)*1.7*light2.w),smoothstep(2.2,0.0,distance(light3.xyz,t)*0.5)*1.7*light3.w),smoothstep(2.2,0.0,distance(light4.xyz,t)*0.5)*1.7*light4.w)*1.;vec3 transformed=billboard+t.xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(transformed,1.);}