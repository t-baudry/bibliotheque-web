;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="59369643-18e6-8508-e12f-65c3c7407ddb")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,986291,e=>{"use strict";var t=e.i(708127),a=e.i(129324),r=e.i(703626),s=e.i(277863),o=e.i(647163),i=r;let l=new i.Vector3;function n(e,t,a,r,s,o){let i=2*Math.PI*s/4,n=Math.max(o-2*s,0),u=Math.PI/4;l.copy(t),l[r]=0,l.normalize();let c=.5*i/(i+n),f=1-l.angleTo(e)/u;return 1===Math.sign(l[a])?f*c:n/(i+n)+c+c*(1-f)}class u extends i.BoxGeometry{constructor(e=1,t=1,a=1,r=2,s=.1){const o=2*r+1;if(s=Math.min(e/2,t/2,a/2,s),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:a,segments:r,radius:s},1===o)return;const l=this.toNonIndexed();this.index=null,this.attributes.position=l.attributes.position,this.attributes.normal=l.attributes.normal,this.attributes.uv=l.attributes.uv;const u=new i.Vector3,c=new i.Vector3,f=new i.Vector3(e,t,a).divideScalar(2).subScalar(s),d=this.attributes.position.array,p=this.attributes.normal.array,v=this.attributes.uv.array,m=d.length/6,h=new i.Vector3,S=.5/o;for(let r=0,o=0;r<d.length;r+=3,o+=2)switch(u.fromArray(d,r),c.copy(u),c.x-=Math.sign(c.x)*S,c.y-=Math.sign(c.y)*S,c.z-=Math.sign(c.z)*S,c.normalize(),d[r+0]=f.x*Math.sign(u.x)+c.x*s,d[r+1]=f.y*Math.sign(u.y)+c.y*s,d[r+2]=f.z*Math.sign(u.z)+c.z*s,p[r+0]=c.x,p[r+1]=c.y,p[r+2]=c.z,Math.floor(r/m)){case 0:h.set(1,0,0),v[o+0]=n(h,c,"z","y",s,a),v[o+1]=1-n(h,c,"y","z",s,t);break;case 1:h.set(-1,0,0),v[o+0]=1-n(h,c,"z","y",s,a),v[o+1]=1-n(h,c,"y","z",s,t);break;case 2:h.set(0,1,0),v[o+0]=1-n(h,c,"x","z",s,e),v[o+1]=n(h,c,"z","x",s,a);break;case 3:h.set(0,-1,0),v[o+0]=1-n(h,c,"x","z",s,e),v[o+1]=1-n(h,c,"z","x",s,a);break;case 4:h.set(0,0,1),v[o+0]=1-n(h,c,"x","y",s,e),v[o+1]=1-n(h,c,"y","x",s,t);break;case 5:h.set(0,0,-1),v[o+0]=n(h,c,"x","y",s,e),v[o+1]=1-n(h,c,"y","x",s,t)}}static fromJSON(e){return new u(e.width,e.height,e.depth,e.segments,e.radius)}}async function c(e,t,a={}){let{worldHeight:r=1.4,threshold:s=200}=a,o=new Image;o.crossOrigin="anonymous",o.src=e,await new Promise((t,a)=>{if(o.complete&&o.naturalWidth>0)return t();o.onload=()=>t(),o.onerror=()=>a(Error(`failed to load image: ${e}`))});let i=o.naturalWidth,l=o.naturalHeight,n=document.createElement("canvas");n.width=i,n.height=l;let u=n.getContext("2d",{willReadFrequently:!0});u.drawImage(o,0,0);let f=u.getImageData(0,0,i,l).data,d=r/l,p=new Float32Array(2*t),v=0,m=0,h=400*t;for(;v<t&&m<h;){m++;let e=Math.random()*i|0,t=Math.random()*l|0,a=(t*i+e)*4;.299*f[a]+.587*f[a+1]+.114*f[a+2]>s&&(p[2*v]=(e-i/2)*d,p[2*v+1]=-(t-l/2)*d,v++)}return p}async function f(e,t,a={}){let{pixelSize:r=220,bold:s=!0,worldHeight:o=1.4}=a,i=function(){if("u"<typeof document)return"sans-serif";let e=document.createElement("div");e.style.position="absolute",e.style.visibility="hidden",e.style.fontFamily="var(--font-overused-grotesk), sans-serif",document.body.appendChild(e);let t=getComputedStyle(e).fontFamily||"sans-serif";return document.body.removeChild(e),t}(),l=s?"700":"400";if("u">typeof document&&document.fonts)try{await document.fonts.load(`${l} ${r}px ${i}`)}catch{}let n=Math.ceil(e.length*r*.7+.4*r),u=Math.ceil(1.3*r),c=document.createElement("canvas");c.width=n,c.height=u;let d=c.getContext("2d",{willReadFrequently:!0});d.fillStyle="white",d.font=`${l} ${r}px ${i}`,d.textAlign="center",d.textBaseline="middle",d.fillText(e,n/2,u/2);let p=d.getImageData(0,0,n,u).data,v=new Float32Array(2*t),m=o/r,h=0,S=0;for(;h<t&&S<200*t;){S++;let e=Math.random()*n|0,t=Math.random()*u|0;p[(t*n+e)*4+3]>80&&(v[2*h]=(e-n/2)*m,v[2*h+1]=-(t-u/2)*m,h++)}return v}let d=`
attribute vec2 aBase;
attribute float aSeed;

uniform vec3 uStationCenter;
uniform float uFormProgress;
uniform float uVisProgress;
uniform float uYOffset;
uniform float uScatterRadius;
uniform float uScatterHeight;
uniform float uFormJitter;
uniform vec2 uCursorNDC;
uniform float uHoverActive;
uniform float uHoverRadius;
uniform float uHoverRepel;
uniform float uHoverScale;
uniform float uParticleSize;
uniform float uTime;
uniform float uIdleWiggle;

varying float vForm;
varying float vVis;
varying float vPAlpha;
varying float vHoverFall;

void main() {
  // Formed pose with per-particle XY/Z jitter so the silhouette
  // isn't a perfectly crisp number.
  vec3 jitter = vec3(
    (fract(aSeed * 41.7) - 0.5),
    (fract(aSeed * 79.3) - 0.5),
    (fract(aSeed * 17.1) - 0.5)
  ) * uFormJitter;
  vec3 formed = uStationCenter
    + vec3(aBase.x, aBase.y + uYOffset, 0.0)
    + jitter;

  // Scattered pose — particles sit on / just below the terrain
  // surface, spread across a wide XZ area around the station. The
  // surface mesh hides anything beneath it, so the particles read
  // as "emerging from the ground" the moment their Y crosses
  // their local surface height.
  float rx = (fract(aSeed * 11.3) - 0.5) * 2.0;
  float rz = (fract(aSeed * 71.1) - 0.5) * 2.0;
  vec3 scattered = uStationCenter + vec3(
    rx * uScatterRadius,
    -uScatterHeight - fract(aSeed * 31.9) * 0.6,
    rz * uScatterRadius
  );

  // Per-particle stagger for an organic rise.
  float perOffset = fract(aSeed * 53.7);
  float stagger = 0.35;
  float pEase = clamp(
    (uFormProgress - perOffset * stagger) / max(1.0 - stagger, 0.0001),
    0.0,
    1.0
  );
  // Ease-out quartic — slower / softer settle at the end than the
  // cubic curve, so the formation reads as gently coming to rest
  // rather than snapping into place.
  pEase = 1.0 - pow(1.0 - pEase, 4.0);

  // Both axes interpolate over the whole journey so visible
  // motion is in both X and Y. Eases stretch out to pEase=1.0
  // (instead of finishing early) so particles keep gliding into
  // place during the alpha fade-in — no harsh snap.
  float xzEase = smoothstep(0.0, 1.0, pEase);
  float yEase = smoothstep(0.0, 1.0, pEase);
  vec3 worldPos;
  worldPos.x = mix(scattered.x, formed.x, xzEase);
  worldPos.y = mix(scattered.y, formed.y, yEase);
  worldPos.z = mix(scattered.z, formed.z, xzEase);

  // Idle wiggle — small per-particle vibration once the formation
  // is settled, so the number doesn't read as a frozen sprite.
  float wiggleAmt = uIdleWiggle * pEase;
  vec3 wiggle = vec3(
    sin(uTime * 1.7 + aSeed * 13.0),
    cos(uTime * 1.3 + aSeed * 7.0),
    sin(uTime * 2.1 + aSeed * 23.0)
  ) * wiggleAmt;
  worldPos += wiggle;

  // Per-particle alpha — fade-in begins earlier so a larger
  // portion of the travel is visible. Combined with the quartic
  // ease + full-journey position interpolation, particles drift
  // softly into place instead of popping.
  vPAlpha = smoothstep(0.35, 1.0, pEase);

  // Screen-space hover reaction — single cursor NDC bullseye.
  // The cursor sample fed to uCursorNDC is JS-smoothed so the
  // illumination lags slightly behind the real pointer.
  vec4 mvPos = viewMatrix * vec4(worldPos, 1.0);
  vec4 clip = projectionMatrix * mvPos;
  float hoverFall = 0.0;
  // Compute push entirely in NDC then add to clip-space at the
  // end. Avoids reassigning mvPos/clip inside conditionals —
  // Safari has been observed to drop those re-projections.
  vec2 pushNDC = vec2(0.0);
  if (uHoverActive > 0.0) {
    vec2 partNDC = clip.xy / max(clip.w, 0.0001);
    vec2 toCursor = partNDC - uCursorNDC;
    float dn = length(toCursor);
    hoverFall = exp(
      -(dn * dn) / max(uHoverRadius * uHoverRadius, 0.0001)
    ) * uHoverActive;
    if (uHoverRepel > 0.0001) {
      float r = max(uHoverRadius, 0.0001);
      float t = dn / r;
      float radial = t * exp(1.0 - t * t);
      vec2 dir = toCursor / max(dn, 0.0001);
      vec2 tangent = vec2(-dir.y, dir.x);
      // Scale push by uHoverActive too — that uniform is now
      // velocity-driven, so the visible "bulge" displacement
      // weakens with cursor slowdown instead of running at full
      // strength while only the brightness fades.
      pushNDC = (dir * radial + tangent * radial * 0.35)
        * uHoverRepel * 0.5 * uHoverActive;
    }
  }

  // Apply push directly in clip-space (NDC → clip by * clip.w).
  clip.xy += pushNDC * clip.w;
  gl_Position = clip;

  float depthAtten = clamp(8.0 / max(-mvPos.z, 0.5), 0.4, 1.6);
  gl_PointSize = uParticleSize * depthAtten * (1.0 + hoverFall * uHoverScale);

  vForm = pEase;
  vVis = clamp(uVisProgress, 0.0, 1.0);
  vHoverFall = hoverFall;
}
`,p=`
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uHoverGlowColor;
uniform float uHoverGlow;
// Fake plastic-bead lighting — mirrors the surface particles
// so stat stations match. Values driven from the host scene.
uniform vec3 uPLightDir;
uniform float uPAmbient;
uniform float uPDiffuse;
uniform float uPSpec;
uniform float uPSpecPower;
varying float vForm;
varying float vVis;
varying float vPAlpha;
varying float vHoverFall;
void main() {
  // Force highp on gl_PointCoord — Safari defaults to mediump
  // which collapses the hemisphere normal calc below; Brave
  // defaults to highp.
  highp vec2 pc = gl_PointCoord;
  vec2 c = pc - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  float disc = 1.0 - smoothstep(0.35, 0.5, d);
  float edge = smoothstep(0.18, 0.5, d);
  vec3 formedCol = mix(uColorA, uColorB, vForm);
  vec3 col = mix(formedCol, uColorA, edge * 0.65);
  float lift = clamp(vHoverFall * uHoverGlow, 0.0, 4.0);
  col = mix(col, uHoverGlowColor, clamp(lift, 0.0, 1.0));
  col += uHoverGlowColor * max(lift - 1.0, 0.0);
  // Hemisphere normal from sprite UV → diffuse + Blinn-Phong.
  vec2 n2 = vec2(c.x, -c.y) * 2.0;
  float nz2 = clamp(1.0 - dot(n2, n2), 0.0, 1.0);
  vec3 N = vec3(n2, sqrt(nz2));
  vec3 L = normalize(uPLightDir);
  float diff = max(dot(N, L), 0.0);
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0),
    max(uPSpecPower, 0.001));
  float shade = uPAmbient + uPDiffuse * diff;
  col = col * shade + vec3(uPSpec * spec);
  gl_FragColor = vec4(col, disc * vVis * vPAlpha);
}
`;async function v(e,t,a,s={}){let{colorA:o="#202434",colorB:i="#ecff3e",particleCount:l=6e3,pixelSize:n=220,bold:u=!0,particleSize:m=3,worldHeight:h=1.4,yOffset:S=.8,scatterRadius:g=4,scatterHeight:y=.8,formJitter:w=.03,triggerOffset:x=6,formInDurationMs:C=700,formOutDurationMs:T=500,imageThreshold:R=200}=s,b="string"==typeof e?await f(e,l,{pixelSize:n,bold:u,worldHeight:h}):await c(e.src,l,{worldHeight:h,threshold:e.threshold??R}),P=new r.BufferGeometry,O=new Float32Array(3*l),E=new Float32Array(l);for(let e=0;e<l;e++)E[e]=Math.random();P.setAttribute("position",new r.BufferAttribute(O,3)),P.setAttribute("aBase",new r.BufferAttribute(b,2)),P.setAttribute("aSeed",new r.BufferAttribute(E,1));let M={uStationCenter:{value:new r.Vector3(t,0,a)},uFormProgress:{value:0},uVisProgress:{value:0},uYOffset:{value:S},uScatterRadius:{value:g},uScatterHeight:{value:y},uFormJitter:{value:w},uCursorNDC:{value:new r.Vector2(0,0)},uHoverActive:{value:0},uHoverRadius:{value:.3},uHoverRepel:{value:.8},uHoverScale:{value:0},uHoverGlow:{value:0},uHoverGlowColor:{value:new r.Color("#ffffff")},uParticleSize:{value:m},uColorA:{value:new r.Color(o)},uColorB:{value:new r.Color(i)},uTime:{value:0},uIdleWiggle:{value:.02},uPLightDir:{value:new r.Vector3(.4,.8,.6).normalize()},uPAmbient:{value:.45},uPDiffuse:{value:.7},uPSpec:{value:.4},uPSpecPower:{value:16}},F=new r.ShaderMaterial({vertexShader:d,fragmentShader:p,uniforms:M,transparent:!0,depthWrite:!1,depthTest:!1,blending:r.NormalBlending}),G=new r.Points(P,F);G.frustumCulled=!1,G.renderOrder=100;let W=x,B=C,D=T,z=0,A=(e,t,a)=>{let r=Math.max(0,Math.min(1,(a-e)/(t-e)));return r*r*(3-2*r)};return{mesh:G,update:(e,t)=>{M.uTime.value+=t/1e3;let r=e-a,s=W,o=(1-A(s,s+6,r))*A(-(s+6),-s,r),i=o-z,l=t/Math.max(i>=0?B:D,1);Math.abs(i)<=l?z=o:z+=Math.sign(i)*l,M.uFormProgress.value=z;let n=A(-(s+10),-s,r),u=1-A(s,s+10,r);M.uVisProgress.value=n*u},setCursorNDC:(e,t,a)=>{M.uCursorNDC.value.set(e,t),M.uHoverActive.value=a},setColorA:e=>{M.uColorA.value=new r.Color(e)},setColorB:e=>{M.uColorB.value=new r.Color(e)},setYOffset:e=>{M.uYOffset.value=e},setParticleSize:e=>{M.uParticleSize.value=e},setHoverRadius:e=>{M.uHoverRadius.value=e},setHoverRepel:e=>{M.uHoverRepel.value=e},setHoverScale:e=>{M.uHoverScale.value=e},setHoverGlow:e=>{M.uHoverGlow.value=e},setHoverGlowColor:e=>{M.uHoverGlowColor.value=new r.Color(e)},setScatterRadius:e=>{M.uScatterRadius.value=e},setScatterHeight:e=>{M.uScatterHeight.value=e},setFormJitter:e=>{M.uFormJitter.value=e},setTriggerOffset:e=>{W=e},setFormInDurationMs:e=>{B=Math.max(1,e)},setFormOutDurationMs:e=>{D=Math.max(1,e)},setIdleWiggle:e=>{M.uIdleWiggle.value=e},setPLight:(e,t,a,r,s,o,i)=>{M.uPLightDir.value.set(e,t,a).normalize(),M.uPAmbient.value=r,M.uPDiffuse.value=s,M.uPSpec.value=o,M.uPSpecPower.value=i},dispose:()=>{P.dispose(),F.dispose()}}}async function m(e,t,a,s={}){let{width:o=2.4,height:i=1.8,depth:l=1,yBase:n=.1,ior:c=1.5,transmission:f=1,roughness:d=.05,metalness:p=0,thickness:v=.5,clearcoat:h=.6,clearcoatRoughness:S=.08,attenuationColor:g="#cfe0ff",reflectivity:y=.5,dispersion:w=1.5,iridescence:x=.15,iridescenceIor:C=1.3,sheen:T=.4,sheenRoughness:R=.4,sheenColor:b="#ffffff",fresnelStrength:P=0,fresnelPower:O=2.5,fresnelColor:E="#000000",fresnelInvert:M=0,fresnelBlend:F=0,bumpStrength:G=0,bumpScale:W=4,bumpDistortion:B=0,vertexBumpStrength:D=0,frostStrength:z=0,tilesX:A=20,tilesY:H=15,tileGap:L=.92,hoverStrength:N=.4,hoverRadius:k=.25,emissiveIntensity:I=.7,enterStart:Z=7,enterEnd:V=1,exitStart:Y=0,exitEnd:X=-3,oilStrength:U=0,oilRadius:_=1.2,oilScale:$=1.4,oilSpeed:J=.3,oilColorA:j="#ff5cae",oilColorB:q="#5cf0ff",causticBlendingMode:K=1,haloBlendingMode:Q=1,blendingMode:ee=0,causticIntensity:et=.6,causticScale:ea=3,causticSpeed:er=.5,causticColor:es="#cfe0ff",surfaceUniforms:eo,cornerRadius:ei=.22,videoRadius:el=.12,haloColor:en="#7faaff",haloStrength:eu=.5,haloSize:ec=1.6,initialRotationX:ef=-.5,initialRotationY:ed=.4,initialRotationZ:ep=0,initialScaleX:ev=.2,initialScaleY:em=1e-4,initialScaleZ:eh=.2,finalRotationX:eS=0,finalRotationY:eg=.25,finalRotationZ:ey=0,exitRotationX:ew=0,exitRotationY:ex=0,exitRotationZ:eC=0,triggerOffset:eT=6,formInDurationMs:eR=900,formOutDurationMs:eb=600}=s,eP=document.createElement("video");eP.crossOrigin="anonymous",eP.muted=!0,eP.loop=!0,eP.playsInline=!0,eP.autoplay=!0,eP.preload="auto",eP.addEventListener("error",()=>{console.error("[GlassVideoStation] video load error",e,eP.error)}),eP.src=e,await new Promise(t=>{if(eP.readyState>=2)return t();let a=!1,r=()=>{a||(a=!0,eP.removeEventListener("loadeddata",s),eP.removeEventListener("error",o),clearTimeout(i),t())},s=()=>r(),o=()=>{console.warn("[GlassVideoStation] video failed, proceeding without",e),r()},i=setTimeout(()=>{console.warn("[GlassVideoStation] video load timeout",e),r()},5e3);eP.addEventListener("loadeddata",s),eP.addEventListener("error",o)}),console.log("[GlassVideoStation] video loaded",{url:e,width:eP.videoWidth,height:eP.videoHeight,duration:eP.duration,readyState:eP.readyState}),eP.play().catch(e=>{console.warn("[GlassVideoStation] video play failed",e)});let eO=new r.VideoTexture(eP);eO.minFilter=r.LinearFilter,eO.magFilter=r.LinearFilter,eO.colorSpace=r.SRGBColorSpace;let eE=new u(o,i,l,12,Math.max(.001,Math.min(ei,.49*Math.min(o,i,l)))),eM=new r.MeshPhysicalMaterial({color:0xffffff,metalness:p,roughness:d,transmission:f,ior:c,thickness:v,clearcoat:h,clearcoatRoughness:S,reflectivity:y,attenuationColor:new r.Color(g),transparent:!0,side:r.DoubleSide});eM.dispersion=w,eM.iridescence=x,eM.iridescenceIOR=C,eM.iridescenceThicknessRange=[100,800];eM.sheen=T,eM.sheenRoughness=R,eM.sheenColor=new r.Color(b);let eF=(e,t)=>{switch(t){case 1:e.blending=r.AdditiveBlending;break;case 2:e.blending=r.MultiplyBlending;break;case 3:e.blending=r.SubtractiveBlending;break;case 4:e.blending=r.CustomBlending,e.blendEquation=r.AddEquation,e.blendSrc=r.OneMinusDstColorFactor,e.blendDst=r.OneFactor;break;case 5:e.blending=r.CustomBlending,e.blendEquation=r.MaxEquation,e.blendSrc=r.OneFactor,e.blendDst=r.OneFactor;break;case 6:e.blending=r.CustomBlending,e.blendEquation=r.MinEquation,e.blendSrc=r.OneFactor,e.blendDst=r.OneFactor;break;default:e.blending=r.NormalBlending}e.needsUpdate=!0};eF(eM,ee);let eG={uFresnelStrength:{value:P},uFresnelPower:{value:O},uFresnelColor:{value:new r.Color(E)},uFresnelInvert:{value:M},uFresnelBlend:{value:0}},eW={uBumpStrength:{value:G},uBumpScale:{value:W},uBumpDistortion:{value:B},uVertexBumpStrength:{value:D},uFrostStrength:{value:z},uOilStrength:{value:U},uOilRadius:{value:_},uOilScale:{value:$},uOilSpeed:{value:J},uOilColorA:{value:new r.Color(j)},uOilColorB:{value:new r.Color(q)},uCursorWorld:{value:new r.Vector2(0,0)},uCursorActive:{value:0},uGlassTime:{value:0}};eM.onBeforeCompile=()=>{},eM.needsUpdate=!0;let eB=Math.max(1,Math.min(60,Math.round(A))),eD=Math.max(1,Math.min(60,Math.round(H))),ez=eB*eD,eA=o/eB,eH=i/eD,eL=L,eN=new u(eA*eL,eH*eL,l,6,Math.min(ei,.45*Math.min(eA,eH)));eE.dispose(),eE=eN;let ek=new r.InstancedMesh(eN,eM,3600);ek.count=ez,ek.frustumCulled=!1,ek.position.set(0,0,0);{let e=new r.Matrix4;e.makeScale(1e-4,1e-4,1e-4);for(let t=0;t<3600;t++)ek.setMatrixAt(t,e);ek.instanceMatrix.needsUpdate=!0}let eI=new Float32Array(ez),eZ=new Float32Array(ez),eV=new Float32Array(ez);new Float32Array(ez);for(let e=0;e<eD;e++)for(let t=0;t<eB;t++){let a=e*eB+t;eI[a]=(t-(eB-1)/2)*eA,eZ[a]=(e-(eD-1)/2)*eH;let r=eD-1-e,s=.06*Math.sin(.45*t+.2*r);eV[a]=r/eD*.45+s}let eY=new Float32Array(7200),eX=new Float32Array(7200);for(let e=0;e<eD;e++)for(let t=0;t<eB;t++){let a=e*eB+t;eY[2*a]=t/eB,eY[2*a+1]=e/eD,eX[2*a]=1/eB,eX[2*a+1]=1/eD}eN.setAttribute("instUvOffset",new r.InstancedBufferAttribute(eY,2)),eN.setAttribute("instUvScale",new r.InstancedBufferAttribute(eX,2));let eU={uMatcapStrength:{value:.8},uMatcapAngle:{value:.75*Math.PI},uMatcapElevation:{value:.7},uMatcapSharpness:{value:8},uMatcapColor:{value:new r.Color("#ffffff")}},e_=Array.from({length:16},()=>new r.Vector4(0,0,-1,0)),e$={uTileHoverNDC:{value:new r.Vector2(0,0)},uTileHoverActive:{value:0},uTileHoverRadiusNDC:{value:k},uTileOilRadiusNDC:{value:.35},uTileOilStrength:{value:0},uTileOilColorA:{value:new r.Color(j)},uTileOilColorB:{value:new r.Color(q)},uTileOilSpeed:{value:J},uTileOilScale:{value:$},uTileOilTime:{value:0},uTileTrail:{value:e_},uTileTrailMaxArc:{value:1e-4},uTileTrailLife:{value:1.3},uTileTrailTaperPower:{value:4},uTileTrailBlur:{value:.03}},eJ=0,ej=0,eq=!1;eM.emissive=new r.Color(0xffffff),eM.emissiveIntensity=I,eM.emissiveMap=eO,eM.needsUpdate=!0;let eK=eM.onBeforeCompile;eM.onBeforeCompile=(e,t)=>{eK(e,t),e.vertexShader=e.vertexShader.replace("void main() {",`attribute vec2 instUvOffset;
       attribute vec2 instUvScale;
       varying vec2 vTileLocalUv;
       varying vec2 vTileClipNDC;
       void main() {`),e.vertexShader=e.vertexShader.replace("#include <uv_vertex>",`#include <uv_vertex>
       // The base "uv" attribute is per-vertex 0..1 within each
       // RoundedBox face. Pass the front-face UV through to the
       // fragment so the per-tile edge-glow can compute distance
       // to the tile silhouette without needing to invert the
       // mapped UV.
       vTileLocalUv = uv;
       #ifdef USE_EMISSIVEMAP
         vEmissiveMapUv = vEmissiveMapUv * instUvScale + instUvOffset;
       #endif
       #ifdef USE_MAP
         vMapUv = vMapUv * instUvScale + instUvOffset;
       #endif`),e.vertexShader=e.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
       vTileClipNDC = gl_Position.xy / max(gl_Position.w, 0.0001);`),e.uniforms.uTileHoverNDC=e$.uTileHoverNDC,e.uniforms.uTileHoverActive=e$.uTileHoverActive,e.uniforms.uTileHoverRadiusNDC=e$.uTileHoverRadiusNDC,e.uniforms.uTileOilRadiusNDC=e$.uTileOilRadiusNDC,e.uniforms.uTileOilStrength=e$.uTileOilStrength,e.uniforms.uTileOilColorA=e$.uTileOilColorA,e.uniforms.uTileOilColorB=e$.uTileOilColorB,e.uniforms.uTileOilSpeed=e$.uTileOilSpeed,e.uniforms.uTileOilScale=e$.uTileOilScale,e.uniforms.uTileOilTime=e$.uTileOilTime,e.uniforms.uTileTrail=e$.uTileTrail,e.uniforms.uTileTrailMaxArc=e$.uTileTrailMaxArc,e.uniforms.uTileTrailLife=e$.uTileTrailLife,e.uniforms.uTileTrailTaperPower=e$.uTileTrailTaperPower,e.uniforms.uTileTrailBlur=e$.uTileTrailBlur,e.uniforms.uMatcapStrength=eU.uMatcapStrength,e.uniforms.uMatcapAngle=eU.uMatcapAngle,e.uniforms.uMatcapElevation=eU.uMatcapElevation,e.uniforms.uMatcapSharpness=eU.uMatcapSharpness,e.uniforms.uMatcapColor=eU.uMatcapColor,e.fragmentShader=e.fragmentShader.replace("void main() {",`uniform vec2 uTileHoverNDC;
       uniform float uTileHoverActive;
       uniform float uTileHoverRadiusNDC;
       uniform float uTileOilRadiusNDC;
       uniform float uTileOilStrength;
       uniform vec3 uTileOilColorA;
       uniform vec3 uTileOilColorB;
       uniform float uTileOilSpeed;
       uniform float uTileOilScale;
       uniform float uTileOilTime;
       uniform vec4 uTileTrail[16];
       uniform float uTileTrailMaxArc;
       uniform float uTileTrailLife;
       uniform float uTileTrailTaperPower;
       uniform float uTileTrailBlur;
       uniform float uMatcapStrength;
       uniform float uMatcapAngle;
       uniform float uMatcapElevation;
       uniform float uMatcapSharpness;
       uniform vec3 uMatcapColor;
       varying vec2 vTileLocalUv;
       varying vec2 vTileClipNDC;
       // Simplex 2D noise + fbm so the iridescent oil patches read
       // as soft blobs (same family as the terrain oil reveal).
       vec3 tileMod289_3(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
       vec2 tileMod289_2(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
       vec3 tilePermute(vec3 x) { return tileMod289_3(((x * 34.0) + 1.0) * x); }
       float tileSnoise(vec2 v) {
         const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                             -0.577350269189626, 0.024390243902439);
         vec2 i = floor(v + dot(v, C.yy));
         vec2 x0 = v - i + dot(i, C.xx);
         vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
         vec4 x12 = x0.xyxy + C.xxzz;
         x12.xy -= i1;
         i = tileMod289_2(i);
         vec3 p = tilePermute(tilePermute(i.y + vec3(0.0, i1.y, 1.0))
                              + i.x + vec3(0.0, i1.x, 1.0));
         vec3 m = max(0.5 - vec3(dot(x0, x0),
                                 dot(x12.xy, x12.xy),
                                 dot(x12.zw, x12.zw)), 0.0);
         m = m * m;
         m = m * m;
         vec3 x = 2.0 * fract(p * C.www) - 1.0;
         vec3 h = abs(x) - 0.5;
         vec3 ox = floor(x + 0.5);
         vec3 a0 = x - ox;
         m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
         vec3 g;
         g.x  = a0.x  * x0.x  + h.x  * x0.y;
         g.yz = a0.yz * x12.xz + h.yz * x12.yw;
         return 130.0 * dot(m, g);
       }
       float tileFbm(vec2 p) {
         float v = 0.0;
         float amp = 0.5;
         for (int i = 0; i < 3; i++) {
           v += tileSnoise(p) * amp;
           p *= 2.03;
           amp *= 0.5;
         }
         return v;
       }
       void main() {`),e.fragmentShader=e.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
       {
         // Screen-space oil TRAIL. Polyline SDF over the last 16
         // cursor NDC samples + taper-by-arc-length so the
         // iridescent streak fades behind the cursor like the
         // terrain oil trail. Colour from the rainbow palette
         // (R/G/B as sin-offsets of fbm noise) so warm bands
         // (yellow/orange) appear too, biased toward the picker
         // tint.
         if (uTileOilStrength > 0.0001) {
           float life = max(uTileTrailLife, 0.0001);
           float maxArc = max(uTileTrailMaxArc, 0.0001);
           float oilMask = 0.0;
           for (int ti = 0; ti < 15; ti++) {
             vec4 a = uTileTrail[ti];
             vec4 b = uTileTrail[ti + 1];
             if (a.z < 0.0 || b.z < 0.0) continue;
             vec2 pa = vTileClipNDC - a.xy;
             vec2 ba = b.xy - a.xy;
             float hRaw = dot(pa, ba) / max(dot(ba, ba), 0.0001);
             // Strictly behind the cursor — drop fragments in
             // front of the head along the first segment.
             if (ti == 0 && hRaw < 0.0) continue;
             float hC = clamp(hRaw, 0.0, 1.0);
             vec2 closest = a.xy + ba * hC;
             float dN = length(vTileClipNDC - closest);
             float segTime = mix(a.z, b.z, hC);
             float age = uTileOilTime - segTime;
             if (age < 0.0 || age > life) continue;
             float arcS = mix(a.w, b.w, hC);
             float arcFrac = clamp(arcS / maxArc, 0.0, 1.0);
             float taper = pow(
               1.0 - arcFrac,
               max(uTileTrailTaperPower, 0.001)
             );
             float radius = uTileOilRadiusNDC * taper;
             float ageFrac = age / life;
             float segMask = 1.0 - smoothstep(
               max(radius - uTileTrailBlur, 0.0),
               radius + uTileTrailBlur,
               dN
             );
             oilMask = max(oilMask, segMask * (1.0 - ageFrac));
           }
           if (oilMask > 0.001) {
             vec2 op = vTileClipNDC * uTileOilScale;
             float ot = uTileOilTime * uTileOilSpeed;
             vec2 warp = vec2(
               tileFbm(op + vec2(ot, 0.0)),
               tileFbm(op + vec2(0.0, -ot))
             );
             float n = tileFbm(op + warp);
             vec3 rainbow = vec3(
               sin(n * 6.2831853),
               sin(n * 6.2831853 + 2.094),
               sin(n * 6.2831853 + 4.189)
             ) * 0.5 + 0.5;
             vec3 tint = mix(uTileOilColorA, uTileOilColorB, n * 0.5 + 0.5);
             vec3 oilCol = rainbow * tint;
             totalEmissiveRadiance += oilCol * uTileOilStrength * oilMask;
           }
         }
         // Matcap-style key light — view-space normal dotted with
         // a chosen direction gives a directional highlight that
         // reads like a faked HDRI reflection. uMatcapAngle
         // rotates the light around screen space (top-left,
         // top-right, etc.); uMatcapElevation lifts it forward so
         // it catches front-facing tiles, not just the rim.
         if (uMatcapStrength > 0.0001) {
           vec3 keyDir = normalize(
             vec3(cos(uMatcapAngle), sin(uMatcapAngle), max(uMatcapElevation, 0.05))
           );
           float key = pow(
             max(dot(normalize(normal), keyDir), 0.0),
             max(uMatcapSharpness, 0.01)
           );
           totalEmissiveRadiance += uMatcapColor * key * uMatcapStrength;
         }
         // Soft exponential roll-off (1 - exp(-x*1.5)) keeps the
         // darks linear and only rolls bright values gently
         // toward 1 — bright video pixels stay bright without
         // blowing out into pure white.
         totalEmissiveRadiance = vec3(1.0) -
           exp(-totalEmissiveRadiance * 1.5);
       }`)};let eQ=new r.ShaderMaterial({uniforms:{uBumpStrength:eW.uBumpStrength,uBumpScale:eW.uBumpScale,uBumpDistortion:eW.uBumpDistortion,uFrostStrength:eW.uFrostStrength,uOilStrength:eW.uOilStrength,uOilRadius:eW.uOilRadius,uOilScale:eW.uOilScale,uOilSpeed:eW.uOilSpeed,uOilColorA:eW.uOilColorA,uOilColorB:eW.uOilColorB,uCursorWorld:eW.uCursorWorld,uCursorActive:eW.uCursorActive,uTime:eW.uGlassTime,uFresnelStrength:eG.uFresnelStrength,uFresnelPower:eG.uFresnelPower,uFresnelColor:eG.uFresnelColor,uFresnelInvert:eG.uFresnelInvert},vertexShader:`
      varying vec3 vWorld;
      varying vec3 vNormalW;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,fragmentShader:`
      uniform float uBumpStrength;
      uniform float uBumpScale;
      uniform float uBumpDistortion;
      uniform float uFrostStrength;
      uniform float uOilStrength;
      uniform float uOilRadius;
      uniform float uOilScale;
      uniform float uOilSpeed;
      uniform vec3 uOilColorA;
      uniform vec3 uOilColorB;
      uniform vec2 uCursorWorld;
      uniform float uCursorActive;
      uniform float uTime;
      uniform float uFresnelStrength;
      uniform float uFresnelPower;
      uniform vec3 uFresnelColor;
      uniform float uFresnelInvert;
      varying vec3 vWorld;
      varying vec3 vNormalW;

      vec3 fxMod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
      vec2 fxMod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
      vec3 fxPermute(vec3 x) { return fxMod289(((x * 34.0) + 1.0) * x); }
      float fxSnoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = fxMod289(i);
        vec3 p = fxPermute(fxPermute(i.y + vec3(0.0, i1.y, 1.0))
                         + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0),
                                dot(x12.xy, x12.xy),
                                dot(x12.zw, x12.zw)), 0.0);
        m = m * m; m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      float fxFbm(vec2 p) {
        float v = 0.0; float amp = 0.5;
        for (int i = 0; i < 3; i++) { v += fxSnoise(p) * amp; p *= 2.03; amp *= 0.5; }
        return v;
      }
      float fxTri(vec3 p, vec3 n, float distortion) {
        vec3 wn = abs(n); wn = wn / max(wn.x + wn.y + wn.z, 0.0001);
        vec2 dx = distortion > 0.0 ? vec2(fxFbm(p.yz * 1.7), fxFbm(p.yz * 1.7 + 13.7)) * distortion : vec2(0.0);
        vec2 dy = distortion > 0.0 ? vec2(fxFbm(p.xz * 1.7 + 7.3), fxFbm(p.xz * 1.7 + 21.4)) * distortion : vec2(0.0);
        vec2 dz = distortion > 0.0 ? vec2(fxFbm(p.xy * 1.7 - 5.1), fxFbm(p.xy * 1.7 + 33.0)) * distortion : vec2(0.0);
        float nx = fxFbm(p.yz + dx);
        float ny = fxFbm(p.xz + dy);
        float nz = fxFbm(p.xy + dz);
        return nx * wn.x + ny * wn.y + nz * wn.z;
      }

      void main() {
        vec3 outColor = vec3(0.0);
        float outAlpha = 0.0;

        // Bump + frost now handled by the glass material's
        // built-in normalMap + roughnessMap. fx overlay carries
        // only fresnel + oil hover, which have no equivalent in
        // the PBR map pipeline.

        // Fresnel rim / centre tint.
        vec3 viewDir = normalize(cameraPosition - vWorld);
        float ndv = clamp(abs(dot(vNormalW, viewDir)), 0.0, 1.0);
        float rim = pow(1.0 - ndv, uFresnelPower);
        float centre = pow(ndv, uFresnelPower);
        float fres = mix(rim, centre, clamp(uFresnelInvert, 0.0, 1.0));
        if (uFresnelStrength > 0.0001) {
          outColor += uFresnelColor * fres * uFresnelStrength;
          outAlpha = max(outAlpha, fres * uFresnelStrength);
        }

        // Oil iridescent hover near cursor (world XZ distance).
        if (uOilStrength > 0.0001 && uCursorActive > 0.0) {
          vec2 d = vWorld.xz - uCursorWorld;
          float dist = length(d);
          float fall = exp(-dist * dist / max(uOilRadius * uOilRadius, 0.0001));
          vec2 op = vWorld.xz * uOilScale + uTime * uOilSpeed;
          float n = fxFbm(op);
          float mixT = 0.5 + 0.5 * sin(n * 6.2831 + uTime * 0.7);
          vec3 oil = mix(uOilColorA, uOilColorB, clamp(mixT, 0.0, 1.0));
          outColor += oil * fall * uOilStrength;
          outAlpha = max(outAlpha, fall * uOilStrength);
        }

        if (outAlpha < 0.005) discard;
        gl_FragColor = vec4(outColor, clamp(outAlpha, 0.0, 1.0));
      }
    `,transparent:!0,depthWrite:!1,side:r.DoubleSide,blending:r.AdditiveBlending}),e0=new r.Mesh(eE,eQ);e0.position.copy(ek.position),e0.scale.setScalar(1.003),e0.renderOrder=(ek.renderOrder||0)+5;let e1=new r.PlaneGeometry(.92*o,.92*i),e2=new r.MeshBasicMaterial({map:eO,toneMapped:!1,side:r.DoubleSide}),e3={uVidSize:{value:new r.Vector2(.92*o,.92*i)},uVidRadius:{value:el}};e2.onBeforeCompile=e=>{e.uniforms.uVidSize=e3.uVidSize,e.uniforms.uVidRadius=e3.uVidRadius,e.vertexShader=e.vertexShader.replace("void main() {",`varying vec2 vLocalXY;
       void main() {
         vLocalXY = position.xy;`),e.fragmentShader=e.fragmentShader.replace("void main() {",`uniform vec2 uVidSize;
       uniform float uVidRadius;
       varying vec2 vLocalXY;
       float sdRoundedBoxV(vec2 p, vec2 b, float r) {
         vec2 q = abs(p) - b + vec2(r);
         return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
       }
       void main() {
         {
           vec2 halfRect = uVidSize * 0.5;
           float d = sdRoundedBoxV(vLocalXY, halfRect, uVidRadius);
           if (d > 0.0) discard;
         }`)};let e5=new r.Mesh(e1,e2);e5.position.set(0,i/2,-(.5*l)-.02),eG.uFresnelBlend.value=F;let e4=new r.PlaneGeometry(1,1,64,64),e6={uColor:{value:new r.Color(en)},uStrength:{value:0},uSize:{value:ec},uSurfNoiseScale:eo?.uNoiseScale??{value:0},uSurfDisplacement:eo?.uDisplacement??{value:0},uSurfScrollOffset:eo?.uScrollOffset??{value:new r.Vector2(0,0)}},e8=new r.ShaderMaterial({uniforms:e6,vertexShader:`
      varying vec2 vLocal;
      uniform float uSize;
      uniform float uSurfNoiseScale;
      uniform float uSurfDisplacement;
      uniform vec2 uSurfScrollOffset;
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                       + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0),
                                dot(x12.xy, x12.xy),
                                dot(x12.zw, x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      float terrainHeight(vec2 worldXZ) {
        vec2 s = worldXZ + uSurfScrollOffset;
        float n1 = snoise(s * uSurfNoiseScale);
        float n2 = snoise(s * uSurfNoiseScale * 2.5) * 0.45;
        return (n1 + n2) * uSurfDisplacement;
      }
      void main() {
        vec3 p = vec3(position.x * uSize, position.y * uSize, position.z);
        vLocal = p.xy;
        vec4 worldP = modelMatrix * vec4(p, 1.0);
        // Lift above the static noise by enough headroom to clear
        // the surface's other contributions (base carrier waves +
        // intro factor + corridor walls) that the caustic formula
        // doesn't model. Reads as a soft glow hovering on the
        // surface contour rather than slicing through.
        worldP.y = terrainHeight(worldP.xz) + 0.25;
        gl_Position = projectionMatrix * viewMatrix * worldP;
      }
    `,fragmentShader:`
      uniform vec3 uColor;
      uniform float uStrength;
      uniform float uSize;
      varying vec2 vLocal;
      void main() {
        float d = length(vLocal) / (uSize * 0.5);
        float a = (1.0 - smoothstep(0.0, 1.0, d)) * uStrength;
        if (a < 0.005) discard;
        gl_FragColor = vec4(uColor, a);
      }
    `,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending,side:r.DoubleSide}),e9=new r.Mesh(e4,e8);e9.rotation.x=-Math.PI/2,e9.position.set(0,.01,0),e9.renderOrder=-10;let e7=new r.PlaneGeometry(1,1,64,64),te={uColor:{value:new r.Color(es)},uIntensity:{value:0},uSize:{value:ec},uScale:{value:ea},uSpeed:{value:er},uTime:{value:0},uSurfNoiseScale:eo?.uNoiseScale??{value:0},uSurfDisplacement:eo?.uDisplacement??{value:0},uSurfScrollOffset:eo?.uScrollOffset??{value:new r.Vector2(0,0)}},tt=new r.ShaderMaterial({uniforms:te,vertexShader:`
      varying vec2 vLocal;
      varying vec2 vWorldXZ;
      uniform float uSize;
      uniform float uSurfNoiseScale;
      uniform float uSurfDisplacement;
      uniform vec2 uSurfScrollOffset;
      // Simplex 2D noise — copy of the surface's noise so the caustic
      // plane can match terrain height without sharing the chunk.
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                       + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0),
                                dot(x12.xy, x12.xy),
                                dot(x12.zw, x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      float terrainHeight(vec2 worldXZ) {
        vec2 s = worldXZ + uSurfScrollOffset;
        float n1 = snoise(s * uSurfNoiseScale);
        float n2 = snoise(s * uSurfNoiseScale * 2.5) * 0.45;
        return (n1 + n2) * uSurfDisplacement;
      }
      void main() {
        // Plane is laid flat (rotation.x = -π/2). Local position xy
        // becomes world xz after rotation. Multiply by size so the
        // disc covers the desired ground area.
        vec3 p = vec3(position.x * uSize, position.y * uSize, position.z);
        vLocal = p.xy;
        vec4 worldP = modelMatrix * vec4(p, 1.0);
        vWorldXZ = worldP.xz;
        // Displace Y to match the terrain surface beneath the cube.
        // Tiny epsilon keeps the plane just above the surface to
        // avoid z-fighting with the surface mesh.
        worldP.y = terrainHeight(worldP.xz) + 0.25;
        gl_Position = projectionMatrix * viewMatrix * worldP;
      }
    `,fragmentShader:`
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uSize;
      uniform float uScale;
      uniform float uSpeed;
      uniform float uTime;
      varying vec2 vLocal;
      // Cheap caustic-ish field: layered sine ridges in domain-warped
      // space animated over time. Not physically accurate; just the
      // visual character of cast caustics.
      float caustic(vec2 p) {
        p *= uScale;
        float t = uTime * uSpeed;
        vec2 q = vec2(
          sin(p.x + t) + cos(p.y * 1.3 - t * 0.7),
          cos(p.y + t * 1.1) - sin(p.x * 1.4 + t)
        );
        float v = 0.0;
        for (int i = 0; i < 3; i++) {
          float fi = float(i) + 1.0;
          v += sin(q.x * fi + q.y * (fi + 0.7) + t * fi) /
               (fi * 0.9);
        }
        v = pow(abs(v), 3.0);
        return v;
      }
      void main() {
        float radial = length(vLocal) / (uSize * 0.5);
        float mask = 1.0 - smoothstep(0.0, 1.0, radial);
        float c = caustic(vLocal);
        float a = c * mask * uIntensity;
        if (a < 0.005) discard;
        gl_FragColor = vec4(uColor, a);
      }
    `,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending,side:r.DoubleSide}),ta=new r.Mesh(e7,tt);ta.rotation.x=-Math.PI/2,ta.position.set(0,.015,0),ta.renderOrder=-9,e9.visible=!1,ta.visible=!1;let tr=new r.Group;tr.position.set(t,n+i/2,a),tr.add(ek),e0.visible=!1,e5.visible=!1,tr.add(e5),tr.frustumCulled=!1;let ts=new r.Vector3(ef,ed,ep),to=new r.Vector3(eS,eg,ey),ti=new r.Vector3(ew,ex,eC),tl=new r.Vector3(ev,em,eh);tr.rotation.set(ts.x,ts.y,ts.z),tr.scale.set(tl.x,tl.y,tl.z);let tn=eu,tu=et,tc=Z,tf=V,td=Y,tp=X,tv=new r.Matrix4,tm=new r.Quaternion,th=new r.Euler,tS=new r.Vector3,tg=new r.Vector3,ty=new r.Vector3,tw=(e,t,a)=>{let r=Math.max(0,Math.min(1,(a-e)/(t-e)));return r*r*(3-2*r)},tx=o,tC=i,tT=l,tR=ei,tb=n,tP=()=>{let e=tx/eB,t=tC/eD,a=new u(e*eL,t*eL,tT,6,Math.min(tR,.45*Math.min(e,t))),r=ek.geometry;a.setAttribute("instUvOffset",r.getAttribute("instUvOffset")),a.setAttribute("instUvScale",r.getAttribute("instUvScale")),ek.geometry.dispose(),ek.geometry=a,e0.geometry=a,eE=a;for(let a=0;a<eD;a++)for(let r=0;r<eB;r++){let s=a*eB+r;eI[s]=(r-(eB-1)/2)*e,eZ[s]=(a-(eD-1)/2)*t}},tO=new r.Vector2(0,0),tE=0,tM=N,tF=k,tG=0,tW=null;return{group:tr,videoMesh:e5,glassMesh:ek,halo:e9,update:(e,t)=>{let s=e-a,o=tw(tc,tf,s)+(1-tw(tp,td,s)),i=tw(0,1,Math.min(o,1)),l=tw(1,2,Math.max(o,1)),n=i*(1-l);if(tr.rotation.x=ts.x+(to.x-ts.x)*i+(ti.x-to.x)*l,tr.rotation.y=ts.y+(to.y-ts.y)*i+(ti.y-to.y)*l,tr.rotation.z=ts.z+(to.z-ts.z)*i+(ti.z-to.z)*l,tr.scale.set(1,1,1),e8.uniforms.uStrength.value=n*tn,tt.uniforms.uIntensity.value=n*tu,tt.uniforms.uTime.value+=t/1e3,eW.uGlassTime.value+=t/1e3,e$.uTileOilTime.value+=t/1e3,e$.uTileHoverNDC.value.set(tO.x,tO.y),e$.uTileHoverActive.value=tE,e$.uTileHoverRadiusNDC.value=tF,tE>0){let e=tO.x-eJ,t=tO.y-ej;if(!eq||e*e+t*t>1e-4){for(let e=e_.length-1;e>0;e--)e_[e].copy(e_[e-1]);e_[0].set(tO.x,tO.y,e$.uTileOilTime.value,0);let e=0;for(let t=1;t<e_.length;t++){let a=e_[t-1],r=e_[t];if(r.z<0){r.w=a.w;continue}let s=r.x-a.x,o=r.y-a.y;r.w=a.w+Math.sqrt(s*s+o*o),r.w>e&&(e=r.w)}e$.uTileTrailMaxArc.value=Math.max(e,1e-4),eJ=tO.x,ej=tO.y,eq=!0}}let u=null!==tW&&(tM>1e-4||Math.abs(tG)>1e-4),c=e$.uTileTrailLife.value,f=e$.uTileTrailMaxArc.value,d=e$.uTileTrailTaperPower.value,p=e$.uTileOilTime.value;u&&tr.updateMatrixWorld();for(let e=0;e<ez;e++){let t,a=o-eV[e];if(a<=0||a>=1.5)t=0;else if(a<.5){let e=a/.5;t=e*e*(3-2*e)}else if(a<1)t=1;else{let e=(a-1)/.5;t=1-e*e*(3-2*e)}let s=t,i=.001+.999*s,l=(1-s)*Math.PI,n=(1-s)*.6*Math.sin(.7*e);if(u){tg.set(eI[e],eZ[e],0),tg.applyMatrix4(tr.matrixWorld),ty.copy(tg).project(tW);let t=ty.x,a=ty.y,r=0;for(let e=0;e<e_.length-1;e++){let s=e_[e],o=e_[e+1];if(s.z<0||o.z<0)continue;let i=o.x-s.x,l=o.y-s.y,n=i*i+l*l,u=t-s.x,v=a-s.y,m=n>1e-6?(u*i+v*l)/n:0;if(0===e&&m<0)continue;m<0?m=0:m>1&&(m=1);let h=s.x+i*m,S=s.y+l*m,g=t-h,y=a-S,w=g*g+y*y,x=p-(s.z+(o.z-s.z)*m);if(x<0||x>c)continue;let C=Math.pow(1-Math.min(1,Math.max(0,(s.w+(o.w-s.w)*m)/Math.max(f,1e-4))),Math.max(d,.001)),T=tF*C,R=w/Math.max(T*T,1e-4),b=(R<1?(1-R)*(1-R):0)*(1-x/c);b>r&&(r=b)}r>1e-4&&(l+=r*tM,i=Math.max(0,i*(1+r*tG)))}th.set(l,n,0),tm.setFromEuler(th),tS.set(eI[e],eZ[e],0),tv.compose(tS,tm,new r.Vector3(i,i,i)),ek.setMatrixAt(e,tv)}ek.instanceMatrix.needsUpdate=!0},setSize:(e,t,a)=>{tx=e,tC=t,tT=a,tP(),ek.position.y=0,e0.position.y=0,e5.geometry.dispose(),e5.geometry=new r.PlaneGeometry(.92*e,.92*t),e3.uVidSize.value.set(.92*e,.92*t),e5.position.set(0,0,-(.5*a)-.02),tr.position.y=tb+t/2},setCornerRadius:e=>{tR=e,tP()},setIor:e=>{eM.ior=e},setTransmission:e=>{eM.transmission=e},setRoughness:e=>{eM.roughness=e},setMetalness:e=>{eM.metalness=e},setThickness:e=>{eM.thickness=e},setClearcoat:e=>{eM.clearcoat=e},setClearcoatRoughness:e=>{eM.clearcoatRoughness=e},setAttenuationColor:e=>{eM.attenuationColor=new r.Color(e)},setReflectivity:e=>{eM.reflectivity=e},setDispersion:e=>{eM.dispersion=e},setIridescence:e=>{eM.iridescence=e},setIridescenceIor:e=>{eM.iridescenceIOR=e},setSheen:e=>{eM.sheen=e},setSheenRoughness:e=>{eM.sheenRoughness=e},setSheenColor:e=>{eM.sheenColor=new r.Color(e)},setFresnelStrength:e=>{eG.uFresnelStrength.value=e},setFresnelPower:e=>{eG.uFresnelPower.value=e},setFresnelColor:e=>{eG.uFresnelColor.value.set(e)},setFresnelInvert:e=>{eG.uFresnelInvert.value=e},setFresnelBlend:e=>{eG.uFresnelBlend.value=Math.round(e)},setCausticBlendingMode:e=>{eF(tt,Math.round(e))},setHaloBlendingMode:e=>{eF(e8,Math.round(e))},setBumpStrength:e=>{eW.uBumpStrength.value=e},setBumpScale:e=>{eW.uBumpScale.value=e},setBumpDistortion:e=>{eW.uBumpDistortion.value=e},setVertexBumpStrength:e=>{eW.uVertexBumpStrength.value=e},setFrostStrength:e=>{eW.uFrostStrength.value=Math.max(0,Math.min(1,e))},setOilStrength:e=>{eW.uOilStrength.value=e},setOilRadius:e=>{eW.uOilRadius.value=e},setOilScale:e=>{eW.uOilScale.value=e},setOilSpeed:e=>{eW.uOilSpeed.value=e},setOilColorA:e=>{eW.uOilColorA.value.set(e)},setOilColorB:e=>{eW.uOilColorB.value.set(e)},setCursorWorld:(e,t,a)=>{eW.uCursorWorld.value.set(e,t),eW.uCursorActive.value=a},setBlendingMode:e=>{eF(eM,Math.round(e))},setCausticIntensity:e=>{tu=e},setCausticScale:e=>{tt.uniforms.uScale.value=e},setCausticSpeed:e=>{tt.uniforms.uSpeed.value=e},setCausticColor:e=>{tt.uniforms.uColor.value.set(e)},setVideoRadius:e=>{e3.uVidRadius.value=e},setHaloColor:e=>{e8.uniforms.uColor.value.set(e)},setHaloStrength:e=>{tn=e},setHaloSize:e=>{e8.uniforms.uSize.value=e,tt.uniforms.uSize.value=e},setInitialRotation:(e,t,a)=>{ts.set(e,t,a)},setInitialScale:(e,t,a)=>{tl.set(e,t,a)},setExitRotation:(e,t,a)=>{ti.set(e,t,a)},setTiles:(e,t)=>{let a=Math.max(1,Math.min(60,Math.round(e))),s=Math.max(1,Math.min(60,Math.round(t)));if(a===eB&&s===eD)return;ez=(eB=a)*(eD=s);let o=tx/eB,i=tC/eD,l=new u(o*eL,i*eL,tT,6,Math.min(tR,.45*Math.min(o,i))),n=new Float32Array(7200),c=new Float32Array(7200);for(let e=0;e<eD;e++)for(let t=0;t<eB;t++){let a=e*eB+t;n[2*a]=t/eB,n[2*a+1]=e/eD,c[2*a]=1/eB,c[2*a+1]=1/eD}l.setAttribute("instUvOffset",new r.InstancedBufferAttribute(n,2)),l.setAttribute("instUvScale",new r.InstancedBufferAttribute(c,2)),ek.geometry.dispose(),ek.geometry=l,e0.geometry=l,eE=l,ek.count=ez,eI=new Float32Array(ez),eZ=new Float32Array(ez),eV=new Float32Array(ez),new Float32Array(ez),(()=>{for(let e=0;e<eD;e++)for(let t=0;t<eB;t++){let a=e*eB+t,r=tx/eB,s=tC/eD;eI[a]=(t-(eB-1)/2)*r,eZ[a]=(e-(eD-1)/2)*s;let o=eD-1-e,i=.12*Math.sin(.45*t+.2*o);eV[a]=o/eD+i}})()},setHoverStrength:e=>{tM=e},setHoverRadius:e=>{tF=e},setHoverScale:e=>{tG=e},setHoverCursorNDC:(e,t,a)=>{tO.set(e,t),tE=a},setHoverCamera:e=>{tW=e},setTileGap:e=>{eL=Math.max(.05,Math.min(1,e)),tP()},setWaveTriggers:(e,t,a,r)=>{tc=e,tf=t,td=a,tp=r},setEmissiveIntensity:e=>{eM.emissiveIntensity=e},setTileOilStrength:e=>{e$.uTileOilStrength.value=e},setTileOilColorA:e=>{e$.uTileOilColorA.value.set(e)},setTileOilColorB:e=>{e$.uTileOilColorB.value.set(e)},setTileOilSpeed:e=>{e$.uTileOilSpeed.value=e},setTileOilScale:e=>{e$.uTileOilScale.value=e},setTileOilRadius:e=>{e$.uTileOilRadiusNDC.value=e},setTileTrailLife:e=>{e$.uTileTrailLife.value=e},setTileTrailTaper:e=>{e$.uTileTrailTaperPower.value=e},setTileTrailBlur:e=>{e$.uTileTrailBlur.value=e},setMatcapStrength:e=>{eU.uMatcapStrength.value=e},setMatcapAngle:e=>{eU.uMatcapAngle.value=e},setMatcapElevation:e=>{eU.uMatcapElevation.value=e},setMatcapSharpness:e=>{eU.uMatcapSharpness.value=e},setMatcapColor:e=>{eU.uMatcapColor.value.set(e)},setYBase:e=>{tb=e,tr.position.y=e+tC/2},dispose:()=>{eE.dispose(),eM.dispose(),eQ.dispose(),e5.geometry.dispose(),e2.dispose(),e4.dispose(),e8.dispose(),e7.dispose(),tt.dispose(),eO.dispose(),eP.pause(),eP.src="",eP.load()}}}let h=`
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)),
               0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`,S=`
uniform float uNoiseScale;
uniform float uDisplacement;
uniform float uTime;
uniform float uFocusX;
uniform float uFocusZ;
uniform float uWaveSpeed;
uniform float uWaveAmplitude;
uniform float uWaveLength;
uniform float uWaveFalloff;
uniform float uPulseWidth;
uniform float uBaseAmplitude;
uniform float uBaseSpeed;
uniform float uBaseWavelength;
// Click-driven pulses: up to MAX_CLICKS rings live at once. Each
// click is (x, z, startTime). startTime < 0 → unused slot.
uniform vec3 uClicks[4];
// Hover bump — soft Gaussian raise at the cursor position.
uniform float uHoverX;
uniform float uHoverZ;
uniform float uHoverActive;
uniform float uHoverRadius;
uniform float uHoverStrength;
// Scroll-driven offset added to the NOISE sample only. Lets the
// underlying terrain flow toward / past the camera as the user
// scrolls, while focus, click rings, and hover stay anchored in
// world space.
uniform vec2 uScrollOffset;
// On-load intro factor — eased 0..1 over ~3.5s. Each shader slices
// its own portion of this curve via smoothstep so the scene boots
// up with the surface growing first, then caustics, then volume,
// while a particle wave sweeps outward from the camera.
uniform float uIntro;
// Linear (unEased) intro 0..1 — used by the particle / dust radial
// wave so the sweep is visually steady across the full duration.
uniform float uIntroLinear;
// Corridor walls — raises the terrain as |worldX| grows past
// uCorridorWidth so the camera flies down a valley/tunnel.
uniform float uCorridorWidth;
uniform float uCorridorHeight;
uniform float uCorridorSharpness;
`,g=`
float computeDisplacement(vec2 posXZ) {
  float n1 = snoise(vec2(posXZ.x * uNoiseScale, posXZ.y * uNoiseScale));
  float n2 = snoise(vec2(posXZ.x * uNoiseScale * 2.5,
                         posXZ.y * uNoiseScale * 2.5)) * 0.45;
  float disp = (n1 + n2) * uDisplacement;

  float focusR = length(posXZ - vec2(uFocusX, uFocusZ));
  float falloffFocus = exp(-focusR * uWaveFalloff);

  // Sum of up to 4 click rings — each is a single Gaussian-enveloped
  // travelling ring born at its click position when the user pressed
  // the surface. Empty slots have startTime < 0 and are skipped.
  float sigma = max(uPulseWidth, 0.0001);
  float halfLife = 1.6; // seconds — ring rises, peaks, then decays
  float wave = 0.0;
  for (int i = 0; i < 4; i++) {
    vec3 click = uClicks[i];
    if (click.z < 0.0) continue;
    float age = uTime - click.z;
    if (age < 0.0 || age > halfLife * 4.0) continue;
    float r = length(posXZ - click.xy);
    float frontR = age * uWaveSpeed;
    float delta = r - frontR;
    float spatial = exp(-(delta * delta) / (sigma * sigma));
    float tau = age / halfLife;
    float temporal = tau * exp(1.0 - tau);
    float falloffR = exp(-r * uWaveFalloff);
    wave += sin(
      (r - frontR) * (6.2831853 / max(uWaveLength, 0.0001))
    ) * spatial * temporal * falloffR;
  }
  disp += wave * uWaveAmplitude;

  // Quiet continuous carrier driven from the focus point.
  float baseWl = max(uBaseWavelength, 0.0001);
  float basePhase = focusR * (6.2831853 / baseWl) - uTime * uBaseSpeed;
  disp += sin(basePhase) * uBaseAmplitude * falloffFocus;

  // Hover bump — soft Gaussian raise that follows the cursor.
  // uHoverActive is eased 0..1 from JS so the bump fades in and out
  // as the cursor enters / leaves the canvas (no on/off snap).
  {
    float dh = length(posXZ - vec2(uHoverX, uHoverZ));
    float hoverFalloff = exp(-(dh * dh)
      / (max(uHoverRadius, 0.0001) * max(uHoverRadius, 0.0001)));
    disp += hoverFalloff * uHoverStrength * uHoverActive;
  }

  // Corridor walls — terrain ramps up on both sides of the camera's
  // X-axis path. ax beyond uCorridorWidth raises the ground by
  // pow(d, uCorridorSharpness) * uCorridorHeight, so the user
  // flies through a valley whose walls steepen with X distance.
  if (uCorridorHeight > 0.0001) {
    float ax = abs(posXZ.x);
    float d = max(ax - uCorridorWidth, 0.0);
    disp += pow(d, max(uCorridorSharpness, 0.001)) * uCorridorHeight;
  }

  return disp;
}
`,y=`
${h}
${S}
${g}

varying float vDisp;
varying vec3 vWorldPos;

void main() {
  // Sample noise at WORLD xz so when the mesh translates with the
  // camera (infinite-scroll mode) each vertex picks up fresh terrain
  // instead of dragging the same pattern along.
  vec4 worldFlat = modelMatrix * vec4(position.x, 0.0, position.z, 1.0);
  float disp = computeDisplacement(worldFlat.xz);
  // Intro: grow displacement from flat to full over the first half
  // of the intro curve.
  float introSurface = smoothstep(0.0, 0.5, uIntro);
  disp *= introSurface;
  vec3 pos = position;
  pos.y += disp;
  vDisp = disp;
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`,w=`
${h}
${S}
${g}

uniform float uParticleLift;
uniform float uParticleSize;
uniform float uParticleSizeJitter;
uniform float uParticleXZJitter;
uniform float uParticleYJitter;
// "Mexican wave" — one ring at a time travelling outward from the
// focus point, respawned every uPWavePeriod seconds. uPWaveBoost is
// the peak scale multiplier added to 1.0, uPWaveSpeed is the ring's
// radial velocity, uPWaveWidth is its Gaussian thickness.
uniform float uPWaveBoost;
uniform float uPWaveSpeed;
uniform float uPWavePeriod;
uniform float uPWaveWidth;
// Infinite-scroll wrap — particles modulo their world Z around the
// camera so they always lie within \xb1zRange/2 of the camera. As the
// camera flies past, a particle wraps to the front. Pure GPU
// solution, no CPU updates needed.
uniform float uCameraZ;
uniform float uParticleZRange;
// Tunnel formation — when active, particles lift off the surface
// and arrange into a spiral cylinder around (uTunnelCenterX,
// uTunnelCenterY, particle's own worldZ). Progress is driven by
// the camera's distance into the trigger zone (CPU-side), so all
// particles morph in lockstep instead of per-position.
uniform float uTunnelProgress;
uniform float uTunnelRadius;
uniform float uTunnelCenterX;
uniform float uTunnelCenterY;
uniform float uTunnelScatter;
uniform float uTunnelSpiralTurns;
uniform float uTunnelSpiralPitch;
uniform float uTunnelRotSpeed;
// Per-particle position wiggle in tunnel mode so the cylinder
// doesn't read as a frozen grid. Amplitude scales with progress.
uniform float uTunnelWiggle;
// Travelling pulse INSIDE the tunnel — a Z-axis brightband moving
// from the camera outward into the distance. Particles inside the
// band get a size + brightness boost. Period seconds per cycle.
uniform float uTunnelPulseSpeed;
uniform float uTunnelPulseWidth;
uniform float uTunnelPulseBoost;
uniform float uTunnelPulsePeriod;
// Subtle breathing — particles slowly scale up/down independently
// (per-aRandom phase). Mimics the number-station hover idle.
uniform float uTunnelBreathAmp;
uniform float uTunnelBreathSpeed;
// Forward Z drift applied per-frame in tunnel mode so the
// particle column flows past the camera into the distance.
uniform float uTunnelDriftSpeed;
// Same NDC-bullseye hover the stat-station particles use —
// projects each particle to NDC, falls off exp(-d\xb2/r\xb2), boosts
// size by uHoverNScale and shifts colour by uHoverNGlow.
uniform vec2 uCursorNDC;
uniform float uHoverNActive;
uniform float uHoverNRadius;
uniform float uHoverNScale;
uniform float uHoverNRepel;
// Pass index 0 = first draw, 1 = duplicate draw (the "doubled
// particle count" in tunnel mode). The duplicate uses a hashed
// offset of aRandom so the two passes don't perfectly overlap.
uniform float uPassIndex;
attribute float aRandom;
varying float vAlphaScale;
varying float vFocusR;
varying float vHoverFall;
// Signed forward distance from camera (positive = ahead of
// camera looking in -Z). Drives the tunnel-mode colour gradient.
varying float vCamForward;
varying float vTunnelMix;

void main() {
  vec3 localPos = position;
  // Pass-shifted random — the duplicate pass uses a different
  // hash of aRandom so it scatters elsewhere instead of stacking
  // on top of the first pass.
  float effRandom = fract(aRandom + uPassIndex * 0.3759);
  // Per-particle random jitter on xz so the particle isn't pinned
  // exactly to the geometric vertex.
  float r1 = fract(effRandom * 13.31);
  float r2 = fract(effRandom * 71.17);
  localPos.xz += (vec2(r1, r2) - 0.5) * uParticleXZJitter;

  // Wrap world Z around the camera so the particle never falls
  // outside \xb1zRange/2. Bypass modelMatrix — we work directly in
  // world coords.
  float worldX = localPos.x;
  float worldZ = localPos.z;
  float zRange = max(uParticleZRange, 1.0);
  float relZ = worldZ - uCameraZ;
  relZ = mod(relZ + zRange * 0.5, zRange) - zRange * 0.5;
  worldZ = uCameraZ + relZ;

  // Noise sampled at the WRAPPED world position so each cycle
  // shows fresh terrain instead of a repeating loop.
  float disp = computeDisplacement(vec2(worldX, worldZ));
  float worldY = disp + uParticleLift
    + (fract(effRandom * 91.7) - 0.5) * uParticleYJitter;
  vec3 worldXYZ = vec3(worldX, worldY, worldZ);

  // Spiral cylinder target. Each particle picks a base angle from
  // its random seed and a per-Z offset so the angles rotate as Z
  // advances down the camera path (-> visible spiral instead of
  // stacked rings). Scatter perturbs radius so the cylinder isn't
  // a perfect tube. uTime rotates the whole helix slowly.
  if (uTunnelProgress > 0.0001) {
    float scatter = (fract(effRandom * 41.7) - 0.5) * uTunnelScatter;
    float tRad = uTunnelRadius + scatter;
    float baseAngle = effRandom * 6.2831853;
    // Use the STATIC spawn position.z (not wrapped worldZ) so the
    // spiral structure is anchored to the particle's identity,
    // not its camera-relative position. Without this, scrolling
    // FORWARDS rotated the spiral one way and scrolling BACK
    // rotated it the other, fighting the constant uTime spin.
    float zAngle = position.z * uTunnelSpiralPitch;
    float turnAngle = baseAngle * uTunnelSpiralTurns + zAngle
      + uTime * uTunnelRotSpeed;
    // Per-particle wiggle — independent sin offsets along each
    // axis with phase tied to effRandom. Tiny, alive-looking.
    vec3 wiggle = vec3(
      sin(uTime * 0.73 + effRandom * 17.0),
      sin(uTime * 0.97 + effRandom * 31.0),
      sin(uTime * 1.11 + effRandom * 23.0)
    ) * uTunnelWiggle * uTunnelProgress;
    vec3 tunnelXYZ = vec3(
      uTunnelCenterX + cos(turnAngle) * tRad,
      uTunnelCenterY + sin(turnAngle) * tRad,
      worldZ
    ) + wiggle;
    worldXYZ = mix(worldXYZ, tunnelXYZ, uTunnelProgress);
  }

  vec4 mvPos = viewMatrix * vec4(worldXYZ, 1.0);
  gl_Position = projectionMatrix * mvPos;
  // Camera looks toward -Z. Forward = how far ahead this
  // particle sits (positive = further down the tunnel from us).
  vCamForward = cameraPosition.z - worldXYZ.z;
  vTunnelMix = clamp(uTunnelProgress, 0.0, 1.0);

  // Pixel-direct sizing. uParticleSize ≈ gl_PointSize in pixels,
  // with a per-particle random factor and a mild perspective falloff
  // (clamped) so distant particles still shrink but the value is
  // predictable for small sizes (2 px ≈ 2 px on screen).
  float sizeRand = mix(
    1.0 - uParticleSizeJitter,
    1.0 + uParticleSizeJitter,
    effRandom
  );
  float depthAtten = clamp(8.0 / max(-mvPos.z, 0.5), 0.4, 1.6);
  // In tunnel mode flatten the perspective falloff so particles
  // don't read as "huge near, tiny far" — keeps the cylinder
  // looking like a uniform column rather than scattered blobs of
  // wildly different sizes.
  depthAtten = mix(depthAtten, 1.0, uTunnelProgress);
  // Surface pulse — one ring at a time, born at the focus point
  // every uPWavePeriod seconds. Ease-out cubic on the ring's
  // radius. Only contributes while the surface is the dominant
  // particle layout (uTunnelProgress < 1).
  float pwR = length(vec2(worldX, worldZ) - vec2(uFocusX, uFocusZ));
  float period = max(uPWavePeriod, 0.0001);
  float tau = mod(uTime, period) / period;
  float easedTau = 1.0 - pow(1.0 - tau, 3.0);
  float pwFront = easedTau * period * uPWaveSpeed;
  float pwDelta = abs(pwR - pwFront);
  float pwBell = smoothstep(max(uPWaveWidth, 0.0001), 0.0, pwDelta);
  float edge =
    smoothstep(0.0, 0.04, tau)
    * (1.0 - smoothstep(0.96, 1.0, tau));
  float surfacePulse = pwBell * edge * uPWaveBoost
    * (1.0 - uTunnelProgress);
  // Tunnel pulse — Z-axis band travelling away from camera into
  // the distance. Active in tunnel mode. Particles whose worldZ
  // is within uTunnelPulseWidth of the band front get boosted.
  float tPeriod = max(uTunnelPulsePeriod, 0.0001);
  float tTau = mod(uTime, tPeriod) / tPeriod;
  // Band starts at the camera and travels -Z (forward) over the
  // period, then wraps. Distance from camera = pulseSpeed*period*tTau.
  float bandDist = tTau * tPeriod * uTunnelPulseSpeed;
  float bandZ = uCameraZ - bandDist;
  float bandDelta = abs(worldZ - bandZ);
  float bandBell = smoothstep(
    max(uTunnelPulseWidth, 0.0001), 0.0, bandDelta);
  float tunnelPulse = bandBell * uTunnelPulseBoost
    * uTunnelProgress;
  // Idle breathing — slow per-particle scale wobble in tunnel.
  float breath = sin(
    uTime * uTunnelBreathSpeed + effRandom * 6.2831853);
  float breathMul = 1.0 + breath * uTunnelBreathAmp
    * uTunnelProgress;
  float pwMul = 1.0 + surfacePulse + tunnelPulse;
  // NDC-bullseye cursor hover, same algorithm as the stat-station
  // particles. Falloff exp(-d\xb2/r\xb2) over NDC distance plus a
  // radial-bell + tangential-swirl PUSH (same as stat repel) so
  // particles glide away from the cursor instead of getting
  // shoved straight outward.
  // Hover = identical math to the stat-station shader.
  // Compute push entirely in NDC, then add to clip-space at the
  // end — same Safari-safe pattern.
  float hoverFall = 0.0;
  vec2 pushNDC = vec2(0.0);
  if (uHoverNActive > 0.0 && uTunnelProgress > 0.0001) {
    vec2 partNDC = gl_Position.xy / max(gl_Position.w, 0.0001);
    vec2 toCursor = partNDC - uCursorNDC;
    float dn = length(toCursor);
    hoverFall = exp(
      -(dn * dn) / max(uHoverNRadius * uHoverNRadius, 0.0001)
    ) * uHoverNActive;
    if (uHoverNRepel > 0.0001) {
      float r = max(uHoverNRadius, 0.0001);
      float t = dn / r;
      float radial = t * exp(1.0 - t * t);
      vec2 dir = toCursor / max(dn, 0.0001);
      vec2 tangent = vec2(-dir.y, dir.x);
      pushNDC = (dir * radial + tangent * radial * 0.35)
        * uHoverNRepel * 0.5 * uHoverNActive;
    }
  }
  gl_Position.xy += pushNDC * gl_Position.w;
  float hoverMul = 1.0 + hoverFall * uHoverNScale;
  gl_PointSize = uParticleSize * sizeRand * depthAtten
    * pwMul * breathMul * hoverMul;
  vHoverFall = hoverFall;

  // Slight depth fade so things further away aren't as bright.
  vAlphaScale = clamp(1.0 - (-mvPos.z) * 0.05, 0.2, 1.0);
  // Tunnel mode: drive per-particle alpha with breath + travelling
  // pulse band, same data the size uses, so the visual reads as a
  // single coordinated brighten-up (hover-idle style).
  float tunnelAlphaPulse = 1.0 + (tunnelPulse + breath * uTunnelBreathAmp)
    * 0.4 * uTunnelProgress;
  vAlphaScale *= tunnelAlphaPulse;

  // Intro: radial wave sweeping outward from the camera. Uses the
  // LINEAR intro factor so the sweep is steady across the whole
  // boot rather than rushing past everything in the first third.
  float distFromCam = length(vec2(worldX - 0.0, worldZ - uCameraZ));
  float waveR = uIntroLinear * 50.0;
  float introMul = 1.0 - smoothstep(waveR, waveR + 4.0, distFromCam);
  vAlphaScale *= introMul;

  // World-space distance to the focus point, so the fragment can
  // apply the same focus/fog fade as the surface.
  vFocusR = length(vec2(worldX, worldZ) - vec2(uFocusX, uFocusZ));
}
`,x=`
${h}
${S}
${g}

varying float vDisp;
varying vec3 vWorldPos;

void main() {
  vec4 worldFlat = modelMatrix * vec4(position.x, 0.0, position.z, 1.0);
  float disp = computeDisplacement(worldFlat.xz);
  vec3 pos = position;
  pos.y += disp;
  vDisp = disp;
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`,C=`
${h}
${S}
${g}

uniform vec3 uWireColor;
uniform float uWireThickness;
uniform float uWireOpacity;
uniform float uGlowSpread;
uniform float uGlowStrength;
uniform float uContourSpacing;
uniform float uRevealRadius;
uniform float uRevealBlur;
uniform float uRevealNoiseScale;
uniform float uRevealNoiseStrength;
// Fog ranges only — hover/focus/time uniforms already declared by
// DISPLACEMENT_UNIFORMS_GLSL above. Redeclaring them here would cause
// a GLSL link error and the wireframe pass silently fails to render.
uniform float uFogInner;
uniform float uFogOuter;
varying float vDisp;
varying vec3 vWorldPos;

void main() {
  // Topographic contour lines — sample the displacement function
  // PER FRAGMENT (not the interpolated vDisp). This evaluates the
  // analytic noise + wave + carrier + hover at the exact world-xz
  // of this pixel, so contours come out as smooth curves instead of
  // straight chords across each triangle of the tessellated mesh.
  float disp = computeDisplacement(vWorldPos.xz);
  float spacing = max(uContourSpacing, 0.0001);
  float band = mod(disp + spacing * 0.5, spacing) - spacing * 0.5;
  float bandDist = abs(band);
  float w = fwidth(disp);
  float sharp = 1.0 - smoothstep(0.0, w * uWireThickness, bandDist);
  float glow =
    1.0 - smoothstep(0.0, w * uWireThickness * (1.0 + uGlowSpread), bandDist);
  float lineAlpha = max(sharp, glow * uGlowStrength);

  // Reveal mask — radial smoothstep around the hover point, with the
  // distance distorted by a simplex noise sample so the boundary
  // wobbles instead of being a perfect circle.
  float dh = length(vWorldPos.xz - vec2(uHoverX, uHoverZ));
  float n =
    snoise(vWorldPos.xz * uRevealNoiseScale) * uRevealNoiseStrength;
  float dist = dh + n;
  float mask = 1.0 - smoothstep(
    max(uRevealRadius - uRevealBlur, 0.0),
    uRevealRadius + uRevealBlur,
    dist
  );
  mask *= uHoverActive;

  // Focus/fog fade — same as the surface + particles. Wireframe
  // dissolves into the bg when outside the focus circle.
  float focusR = length(vWorldPos.xz - vec2(uFocusX, uFocusZ));
  float fogFactor = smoothstep(uFogInner, uFogOuter, focusR);

  float introWire = smoothstep(0.4, 1.0, uIntro);
  float alpha = lineAlpha * mask * uWireOpacity
    * (1.0 - fogFactor) * introWire;
  if (alpha < 0.002) discard;
  gl_FragColor = vec4(uWireColor, alpha);
}
`,T=`
uniform vec3 uParticleColor;
uniform vec3 uParticleColorFar;
uniform float uParticleGradStart;
uniform float uParticleGradEnd;
uniform float uParticleOpacity;
uniform float uFogInner;
uniform float uFogOuter;
uniform vec3 uPLightDir;
uniform float uPAmbient;
uniform float uPDiffuse;
uniform float uPSpec;
uniform float uPSpecPower;
// Hover tint — when a particle is under the cursor halo,
// vHoverFall > 0 and the fragment leans toward this colour.
uniform vec3 uParticleHoverColor;
uniform float uParticleHoverStrength;
varying float vAlphaScale;
varying float vFocusR;
varying float vHoverFall;
varying float vCamForward;
varying float vTunnelMix;
void main() {
  // Force highp on gl_PointCoord — Safari defaults to mediump
  // (1/255 step across a sprite) which collapses the hemisphere
  // normal we derive below to a near-constant. Brave uses highp
  // by default so the same code looks right there.
  highp vec2 pc = gl_PointCoord;
  vec2 c = pc - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  float fogFactor = smoothstep(uFogInner, uFogOuter, vFocusR);
  float alpha = (1.0 - smoothstep(0.35, 0.5, d))
              * uParticleOpacity * vAlphaScale * (1.0 - fogFactor);
  // Hemisphere normal in view space. (x,y) = coord centred, z
  // computed from sphere equation so the normal points outward.
  vec2 n2 = vec2(c.x, -c.y) * 2.0;
  float nz2 = clamp(1.0 - dot(n2, n2), 0.0, 1.0);
  vec3 N = vec3(n2, sqrt(nz2));
  vec3 L = normalize(uPLightDir);
  float diff = max(dot(N, L), 0.0);
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0),
    max(uPSpecPower, 0.001));
  float shade = uPAmbient + uPDiffuse * diff;
  // Tunnel gradient — only active when uTunnelProgress > 0.
  // vCamForward > 0 = ahead of camera. Map [start..end] world
  // units to 0..1 colour mix between near and far colours.
  float gradT = clamp(
    (vCamForward - uParticleGradStart)
      / max(uParticleGradEnd - uParticleGradStart, 0.0001),
    0.0, 1.0);
  vec3 baseCol = mix(uParticleColor, uParticleColorFar,
    gradT * vTunnelMix);
  // Hover tint mixes the base toward uParticleHoverColor by the
  // hover falloff times the strength slider. Applied BEFORE the
  // lighting multiply so the hover colour is what gets lit.
  baseCol = mix(baseCol, uParticleHoverColor,
    clamp(vHoverFall * uParticleHoverStrength, 0.0, 1.0));
  vec3 col = baseCol * shade + vec3(uPSpec * spec);
  gl_FragColor = vec4(col, alpha);
}
`,R=`
${h}

// Precision intentionally left to ThreeJS defaults (highp) so it
// matches the vertex shader — explicitly setting mediump here would
// make uDisplacement's precision differ across stages and the link
// step would fail with "Precisions of uniform 'uDisplacement' differ
// between VERTEX and FRAGMENT shaders".
uniform vec3 uBaseColor;
uniform vec3 uPeakColor;
uniform vec3 uFogColor;
uniform float uDisplacement;
// 0 = surface renders normally, 1 = blacked out. Driven by the
// tunnel-progress signal so the terrain dissolves as particles
// lift into the tunnel formation.
uniform float uSurfaceDarken;
// Radial fog focus — in WORLD space, on the plane. The visible
// patch sits around (uFocusX, 0, uFocusZ); the surface fades to
// uFogColor between uFogInner and uFogOuter (in world units).
// World-space means the focus follows the surface as the camera
// orbits, not the screen.
uniform float uFocusX;
uniform float uFocusZ;
uniform float uFogInner;
uniform float uFogOuter;
// Lighting / material.
uniform vec3 uLightDir;
uniform vec3 uLightColor;
uniform float uBumpiness;
uniform float uSpecularStrength;
uniform float uSpecularSharpness;
// Particle-emission lightmap — particles are re-rendered top-down
// each frame into an RT. The lightmap stores total incoming light
// at every world-xz position on the plane. The surface samples it
// by world XZ, then dims by max(dot(N, up)) so the result reads as
// the particle light bouncing off the surface rather than glowing
// in the air.
uniform sampler2D uLightMap;
uniform float uEmissionStrength;
uniform float uEmissionDirBias;
uniform vec2 uLightMapWorldMin;
uniform vec2 uLightMapWorldMax;
// Oil-trail accumulation texture (ping-pong RT). Sampled by
// world XZ to produce the cursor trail silhouette.
uniform sampler2D uOilTex;
uniform vec2 uOilWorldMin;
uniform vec2 uOilWorldMax;
uniform float uOilTexThreshold;
// Fragment-only normal perturbation from simplex noise — adds the
// illusion of fine surface texture without subdividing the mesh.
uniform float uBumpNoiseScale;
uniform float uBumpNoiseStrength;
// Animated caustics — two layers of simplex ridges multiplied
// together produce stringy bright patches that drift over time,
// like sunlight refracted through water.
uniform float uTime;
uniform vec3 uCausticsColor;
uniform float uCausticsIntensity;
uniform float uCausticsScale;
uniform float uCausticsSpeed;
uniform float uCausticsContrast;
uniform float uCausticsDistort;
// Scroll-driven noise offset — must match the value used in the
// vertex displacement so caustics flow with the surface pattern.
uniform vec2 uScrollOffset;
uniform float uIntro;
// Caustic ridge texture (baked once per frame) + the world rect it
// covers. Used by both the surface caustic mix and the volume march.
uniform sampler2D uCausticsTex;
uniform vec2 uCausticsWorldMin;
uniform vec2 uCausticsWorldMax;
// Volume caustics — march from camera to surface, sample the
// caustic texture at each step. Limited by uVolumeMaxDist and
// uVolumeSteps, gated by the surface fog so we only run the march
// where the surface is in focus (no work in foggy areas).
uniform float uVolumeDensity;
uniform float uVolumeYFalloff;
uniform float uVolumeMaxDist;
uniform float uVolumeSteps;
uniform float uVolumeSharpness;
uniform float uVolumeFocusBias;
// Click ripple subsurface light — one expanding bright disc per
// active click slot, time-faded. Uses the same uClicks ring buffer
// as the geometric pulse so every click also blooms a light wash.
uniform vec3 uClicks[4];
uniform vec3 uRippleColor;
uniform float uRippleIntensity;
uniform float uRippleSpeed;
uniform float uRippleSoftness;
uniform float uRippleLife;
uniform float uRippleNoiseScale;
uniform float uRippleNoiseStrength;
// Oil-trail reveal — iridescent noise inside a tapered trail mask.
// uOilTrail is a 16-slot ring buffer of recent cursor positions:
// (worldX, worldZ, timestamp). startTime < 0 means "empty slot".
uniform float uOilIntensity;
uniform float uOilRingStrength;
uniform float uOilRingWidth;
uniform float uOilRingBlur;
uniform float uOilSpreadRate;
uniform float uOilNoiseScale;
uniform float uOilSpeed;
uniform float uOilRevealRadius;
uniform float uOilRevealBlur;
uniform float uOilTrailLife;
uniform float uOilTaperPower;
uniform float uOilMaskNoise;
uniform float uOilMaskNoiseScale;
uniform vec3 uOilColorA;
uniform vec3 uOilColorB;
// Each slot stores (worldX, worldZ, timestamp, arcLength). arcLength
// is the cumulative arc distance from the cursor head along the
// polyline so taper is driven by ACTUAL distance, not age.
uniform vec4 uOilTrail[16];
uniform float uOilMaxArc;
// Hover position uniforms — surface fragment didn't need these
// before; the oil mask uses them, so declare here.
uniform float uHoverX;
uniform float uHoverZ;
uniform float uHoverActive;
varying float vDisp;
varying vec3 vWorldPos;

void main() {
  // Lift peaks a touch brighter than valleys so the noise reads.
  float h = clamp(vDisp / max(uDisplacement, 0.0001) * 0.5 + 0.5, 0.0, 1.0);
  // Intro: start saturated at the peak (darker) colour so the
  // terrain reveals itself from "high / dark" down into its normal
  // tonal range. Eases to the displacement-driven mix by the
  // middle of the intro.
  float introMix = smoothstep(0.0, 0.7, uIntro);
  float introH = mix(1.0, h, introMix);
  vec3 col = mix(uBaseColor, uPeakColor, introH);

  // Reconstruct a surface normal from screen-space derivatives of
  // the world position. cross(dFdy, dFdx) points along the surface
  // normal in world space; scaling its horizontal components by
  // uBumpiness exaggerates or softens the apparent relief without
  // changing the geometry.
  vec3 dx = dFdx(vWorldPos);
  vec3 dy = dFdy(vWorldPos);
  vec3 N = normalize(cross(dy, dx));
  N.xz *= uBumpiness;
  N = normalize(N);

  // Fine "bump map" via finite-difference gradient of simplex noise.
  // Two extra samples per fragment give a usable 2D gradient that we
  // subtract from N.xz so the apparent slope follows the noise.
  if (uBumpNoiseStrength > 0.0001) {
    vec2 bp = vWorldPos.xz * uBumpNoiseScale;
    float eps = 0.6;
    float nC = snoise(bp);
    float nX = snoise(bp + vec2(eps, 0.0));
    float nZ = snoise(bp + vec2(0.0, eps));
    vec2 grad = vec2(nX - nC, nZ - nC) / eps;
    N.xz -= grad * uBumpNoiseStrength;
    N = normalize(N);
  }

  // Lambert + Phong on top of the height-tinted base, tinted by
  // the global light colour.
  vec3 L = normalize(uLightDir);
  float ndl = clamp(dot(N, L), 0.0, 1.0);
  vec3 lit = col * (0.45 + 0.55 * ndl * uLightColor);

  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 R = reflect(-L, N);
  float spec = pow(max(dot(V, R), 0.0), max(uSpecularSharpness, 1.0));
  lit += uLightColor * spec * uSpecularStrength;

  // Particle-emission contribution. Sample the top-down lightmap by
  // world XZ — gives the total light deposited at this point on the
  // plane. Then dim by max(N\xb7up): horizontal surface reflects fully,
  // steep slopes facing away reflect almost nothing. That's what
  // makes it read as light landing on the surface, not floating in
  // the air above it.
  vec2 lmRange = uLightMapWorldMax - uLightMapWorldMin;
  vec2 lmUV = (vWorldPos.xz - uLightMapWorldMin) / lmRange;
  if (uEmissionStrength > 0.0001
    && lmUV.x >= 0.0 && lmUV.x <= 1.0
    && lmUV.y >= 0.0 && lmUV.y <= 1.0) {
    vec3 emission = texture2D(uLightMap, lmUV).rgb;
    float upDot = max(dot(N, vec3(0.0, 1.0, 0.0)), 0.0);
    float dirGain = mix(upDot, 1.0, 1.0 - uEmissionDirBias);
    lit += emission * uEmissionStrength * dirGain;
  }

  // Click ripples — each active click slot adds a thin expanding
  // ring of light. Composited with screen blend (lit + r − lit\xb7r)
  // so the ring reads as light over the surface instead of paint
  // (additive overshoots to white and washes out the saturation).
  // Bell uses pow(.., 2) for a sharp bright core with a soft halo.
  if (uRippleIntensity > 0.0001) {
    vec3 rippleSum = vec3(0.0);
    float life = max(uRippleLife, 0.0001);
    for (int i = 0; i < 4; i++) {
      vec3 click = uClicks[i];
      if (click.z < 0.0) continue;
      float age = uTime - click.z;
      if (age < 0.0 || age > life) continue;
      float d = length(vWorldPos.xz - click.xy);
      // Wobble the ring's distance by simplex noise so it reads as
      // organic instead of a perfect circle. Time-scrolled so the
      // distortion shifts as the ring expands.
      float rnoise =
        snoise(vWorldPos.xz * uRippleNoiseScale + vec2(uTime * 0.4))
        * uRippleNoiseStrength;
      // Gentle ease-out quadratic — keeps the early burst feel of
      // linear but eases off near end-of-life so the ring doesn't
      // hit max radius at full speed and stop cold. Endpoint
      // matches life * uRippleSpeed so total size unchanged.
      float lifeT = clamp(age / life, 0.0, 1.0);
      float easedT = 1.0 - (1.0 - lifeT) * (1.0 - lifeT);
      float radius = life * uRippleSpeed * easedT;
      float ringDist = abs((d + rnoise) - radius);
      // Softness grows over the ring's life so the edge starts at
      // the user-set value and dissipates outward, like the ring
      // "loses focus" as it ages.
      float t = clamp(age / life, 0.0, 1.0);
      float softness = max(uRippleSoftness, 0.0001)
        * (1.0 + 3.5 * smoothstep(0.0, 1.0, t));
      float ring = 1.0 - smoothstep(0.0, softness, ringDist);
      // Sharper core, smoother halo.
      ring = ring * ring * (3.0 - 2.0 * ring);
      // Smootherstep time fade — derivative is zero at both ends, so
      // the ring doesn't cliff out at the end of its life.
      float timeFade = 1.0 - (t * t * t * (t * (t * 6.0 - 15.0) + 10.0));
      // Noise-chunk dissolve. High-freq simplex sampled in world
      // space (+ time drift) gives a sparse speckle field. We
      // threshold it with a cutoff that RISES over the ring's
      // life so fewer pixels survive as the ring expands — reads
      // as the noisy chunks thinning out / breaking apart, not a
      // uniform opacity fade.
      float chunkN =
        snoise(vWorldPos.xz * uRippleNoiseScale * 2.8
          + vec2(uTime * 0.9, -uTime * 0.7));
      float chunk01 = chunkN * 0.5 + 0.5;
      // Density boost near the click epicentre — lift the noise
      // values so more pixels pass the chunkMask threshold within
      // the inner ~50% of the ring radius. Outer falloff
      // unchanged.
      float coreBoost = 1.0
        - smoothstep(0.0, 0.5, clamp(d / max(radius, 0.0001), 0.0, 1.0));
      chunk01 = clamp(chunk01 + coreBoost * 0.3, 0.0, 1.0);
      // Threshold has two components:
      //   timeCut — rises over ring life so chunks thin over time
      //   radCut  — rises with distance from cursor centre so the
      //              ring is dense near the strike point and
      //              sparse at the outer expanding edge
      // Cutoff = the larger of the two so EITHER axis sparsifies
      // the noise. Bias radCut to kick in past ~30% of the front
      // distance so the cursor neighbourhood stays dense.
      float timeCut = smoothstep(0.2, 1.0, t) * 0.9;
      // Wider dense core: radial cutoff stays at 0 until past
      // ~60% of the ring radius, and tops out at 0.7 (not 0.92)
      // so even the outer edge keeps decent chunk coverage —
      // ring reads as thick + chunky, not a thin scattered line.
      float radNorm = clamp(d / max(radius, 0.0001), 0.0, 1.0);
      float radCut = smoothstep(0.6, 1.15, radNorm) * 0.7;
      float cutoff = max(timeCut, radCut);
      float chunkMask = smoothstep(cutoff - 0.06, cutoff + 0.06, chunk01);
      rippleSum += uRippleColor * ring * timeFade * chunkMask;
    }
    vec3 r = clamp(rippleSum * uRippleIntensity, 0.0, 4.0);
    // Screen blend per channel — saturates toward 1.0 without
    // washing out the underlying surface colour.
    vec3 invLit = 1.0 - clamp(lit, 0.0, 1.0);
    vec3 invR = 1.0 - clamp(r, 0.0, 1.0);
    lit = 1.0 - invLit * invR;
  }

  // Surface caustics — inline snoise computation (kept exactly as
  // the working version). Two ridge layers drifting opposite ways
  // multiplied together. uCausticsDistort shifts the sample point
  // by local displacement so the veins bend with the geometry.
  if (uCausticsIntensity > 0.0001) {
    float ct = uTime * uCausticsSpeed;
    vec2 cp = vWorldPos.xz * uCausticsScale + vDisp * uCausticsDistort;
    float c1 = snoise(cp + vec2(ct * 0.6, ct * 0.4));
    float c2 = snoise(cp * 1.37 - vec2(ct * 0.3, -ct * 0.5));
    float ridge = (1.0 - abs(c1)) * (1.0 - abs(c2));
    ridge = pow(clamp(ridge, 0.0, 1.0), max(uCausticsContrast, 0.001));
    // Intro: caustics fade in during the middle of the intro.
    float introCaustics = smoothstep(0.3, 0.85, uIntro);
    lit += uCausticsColor * ridge * uCausticsIntensity * introCaustics;
  }

  // Pre-compute the volume's lightmap UV range below.
  vec2 lmRangeC = uCausticsWorldMax - uCausticsWorldMin;

  // Pre-compute focus distance + fog factor for both the volume
  // gate below and the final fog mix.
  vec2 diff = vWorldPos.xz - vec2(uFocusX, uFocusZ);
  float dist = length(diff);
  float fogFactor = smoothstep(uFogInner, uFogOuter, dist);

  // Volume caustics — only run the march when the surface is in
  // focus (1 - fogFactor) is high. Outside the focal area it's
  // skipped entirely, so the work concentrates in the middle of
  // the scene. The volume's brightness is also weighted by the
  // focus, so it fades naturally toward the fog.
  float volFocus = 1.0 - fogFactor;
  if (uVolumeDensity > 0.0001 && volFocus > 0.01) {
    vec3 toSurf = vWorldPos - cameraPosition;
    float rayLen = length(toSurf);
    vec3 rayDir = toSurf / max(rayLen, 0.0001);
    float marchDist = min(rayLen, uVolumeMaxDist);
    int volSteps = int(clamp(uVolumeSteps, 1.0, 32.0));
    float volStepDist = marchDist / float(volSteps);
    float volJitter =
      fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5);
    float vt = volJitter * volStepDist;
    vec3 volAcc = vec3(0.0);
    for (int j = 0; j < 32; j++) {
      if (j >= volSteps) break;
      vec3 vp = cameraPosition + rayDir * vt;
      if (vp.y > 0.0) {
        vec2 vuv = (vp.xz - uCausticsWorldMin) / lmRangeC;
        if (vuv.x >= 0.0 && vuv.x <= 1.0
          && vuv.y >= 0.0 && vuv.y <= 1.0) {
          float vridge = texture2D(uCausticsTex, vuv).r;
          // Raise to a power so the soft baked ridge becomes thin
          // bright beams in the air — controls how "ray-like" the
          // volume reads.
          vridge = pow(vridge, max(uVolumeSharpness, 0.001));
          float vyAtten = exp(-vp.y * uVolumeYFalloff);
          // Per-sample focus weight — concentrate beam density
          // around the focus point, so light reads as pouring into
          // the middle of the scene.
          float sampleR = length(vp.xz - vec2(uFocusX, uFocusZ));
          float sampleFocus = 1.0
            - smoothstep(uFogInner * 0.6, uFogOuter, sampleR);
          volAcc += vridge * vyAtten * sampleFocus;
        }
      }
      vt += volStepDist;
    }
    // Final pixel-level focus bias — pow > 1 tightens the beams to
    // the centre; <1 broadens them across the focal area.
    float pixelFocus = pow(volFocus, max(uVolumeFocusBias, 0.001));
    // Intro: volume catches up after caustics.
    float introVolume = smoothstep(0.45, 1.0, uIntro);
    lit += volAcc * uCausticsColor * uVolumeDensity
      * volStepDist * pixelFocus * introVolume;
  }

  // Oil-trail reveal — chromatic noise inside the hover mask.
  // Three phase-shifted sines on a scrolling simplex give the
  // rainbow shimmer; the rainbow is then biased toward the user's
  // two key colours so the look stays on-brand. Composited via
  // screen blend over lit so dark areas catch more iridescence
  // than already-bright peaks.
  // Oil is composited OUTSIDE the surface-darken multiplier so
  // the cursor trail stays visible even after the surface fades
  // to black during the tunnel intro.
  vec3 oilContribution = vec3(0.0);
  float oilOpacity = 0.0;
  if (uOilIntensity > 0.0001) {
    // Domain-warped noise — sample point is offset by a slow
    // time-driven noise so the pattern itself organically morphs
    // and flows, instead of sliding across the surface.
    vec2 op = vWorldPos.xz * uOilNoiseScale;
    float ot = uTime * uOilSpeed;
    vec2 warp = vec2(
      snoise(op + vec2(ot, 0.0)),
      snoise(op + vec2(0.0, ot) + 31.7)
    );
    float n = snoise(op + warp * 1.6);
    vec3 rainbow = vec3(
      sin(n * 6.2831853),
      sin(n * 6.2831853 + 2.094),
      sin(n * 6.2831853 + 4.189)
    ) * 0.5 + 0.5;
    vec3 tint = mix(uOilColorA, uOilColorB, n * 0.5 + 0.5);
    vec3 oilCol = rainbow * tint;

    // RT-accumulation trail. Sample the ping-pong oil texture by
    // world XZ. The texture is updated every frame in a separate
    // pass that decays + blurs the previous frame and stamps a
    // gaussian at the cursor — so the trail naturally merges into
    // one silhouette, grows outward while moving, and fades on
    // its own. Profile applied ONCE per pixel (no per-segment
    // ring intersections).
    vec2 oilRange = uOilWorldMax - uOilWorldMin;
    vec2 oilUV = (vWorldPos.xz - uOilWorldMin) / oilRange;
    float oilSample = 0.0;
    if (oilUV.x >= 0.0 && oilUV.x <= 1.0
        && oilUV.y >= 0.0 && oilUV.y <= 1.0) {
      oilSample = texture2D(uOilTex, oilUV).r;
    }
    // Convert raw accumulator value → 0..1 silhouette intensity.
    // Smoothstep range is wide AND starts higher above zero so
    // the trail fades IN over several frames as pigment ramps
    // up under the cursor — no abrupt pop from 0 to visible.
    float thr = max(uOilTexThreshold, 0.0001);
    float silhouette = smoothstep(thr * 1.5, thr * 8.0, oilSample);
    // dn = 0 deep inside the trail, 1 right at the silhouette.
    float dn = 1.0 - silhouette;
    // Rim band — bright stripe centred mid-silhouette. The
    // half-width controls how THICK the band is, the blur
    // controls how SOFT its edges are. Both sliders are in
    // dn units (0 = solid centre, 1 = silhouette edge).
    float halfW = max(uOilRingWidth, 0.0001) * 0.5;
    float ringB = max(uOilRingBlur, 0.0001);
    float dRim = abs(dn - 0.5);
    float rim = 1.0 - smoothstep(halfW, halfW + ringB, dRim);
    float body = 0.15;
    float oilMask = silhouette
      * (body + uOilRingStrength * rim);

    oilContribution = clamp(oilCol * uOilIntensity * oilMask, 0.0, 1.5);
    oilOpacity = clamp(oilMask * uOilIntensity, 0.0, 1.0);
  }

  // fogFactor already computed above for the volume gate.
  vec3 outCol = mix(lit, uFogColor, fogFactor);
  // Surface darken — fades terrain only. Oil overlay still
  // renders on top of darkened/transparent surface so the
  // cursor trail keeps showing after the tunnel triggers.
  float darken = clamp(uSurfaceDarken, 0.0, 1.0);
  outCol = mix(outCol, vec3(0.0), darken);
  float alpha = 1.0 - darken;
  // Oil hover lives on the terrain only — once the surface
  // darkens for the tunnel transition it must go with it.
  // Fog/focus also fade it so the trail respects depth and the
  // focal sphere the rest of the scene already uses.
  float oilGate = (1.0 - darken) * (1.0 - fogFactor);
  oilContribution *= oilGate;
  oilOpacity *= oilGate;
  if (oilOpacity > 0.001) {
    vec3 invSurf = 1.0 - clamp(outCol, 0.0, 1.0);
    vec3 invOil = 1.0 - clamp(oilContribution, 0.0, 1.0);
    outCol = 1.0 - invSurf * invOil;
    alpha = max(alpha, oilOpacity);
  }
  if (alpha <= 0.001) discard;
  gl_FragColor = vec4(outCol, alpha);
  return;

  // Output raw sRGB — color uniforms are supplied as raw sRGB values
  // (Vector3 instead of THREE.Color) so the canvas matches the
  // page background exactly. Built-in materials get an automatic
  // linear→sRGB encode via <colorspace_fragment>; ShaderMaterial
  // doesn't, hence we bypass colour management entirely here.
  gl_FragColor = vec4(outCol, 1.0);
}
`,b=`
uniform float uParticleXZJitter;
uniform float uEmissionSize;
attribute float aRandom;

void main() {
  vec3 pos = position;
  float r1 = fract(aRandom * 13.31);
  float r2 = fract(aRandom * 71.17);
  pos.xz += (vec2(r1, r2) - 0.5) * uParticleXZJitter;
  gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1.0);
  // gl_PointSize is in RT pixels. RT is 512x512 covering a 60x60
  // plane, so 1 unit ≈ 8.5 RT pixels; emissionSize ≈ 16 maps to ~2
  // world-unit-wide soft halo per particle.
  gl_PointSize = uEmissionSize;
}
`,P=`
uniform vec3 uParticleColor;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  // Quadratic falloff — soft halo, brightest at the centre.
  float a = 1.0 - smoothstep(0.0, 0.5, d);
  a = a * a;
  gl_FragColor = vec4(uParticleColor * a, a);
}
`,O=`
${h}
${S}
${g}

uniform float uDustSpeed;
uniform float uDustRise;
uniform float uDustSize;
uniform float uDustSizeJitter;
uniform float uDustWander;
// Same camera-wrap trick as the particle layer so dust never runs
// out — it modulos around the camera and reappears ahead.
uniform float uCameraZ;
uniform float uDustZRange;
// Tunnel-mode redirection — when active, dust stops rising up
// the Y axis and instead streams forward along -Z (away from
// camera). It also spreads vertically around the tunnel centre Y
// so the flow fills the cylinder volume instead of staying as a
// flat plane along the original terrain height.
uniform float uTunnelProgress;
uniform float uDustForwardSpeed;
uniform float uTunnelCenterY;
uniform float uDustTunnelYSpread;
attribute float aSeed;
attribute float aPhase;
varying float vAge;
varying float vFocusR;
varying float vIntroMul;

void main() {
  float age = fract(uTime * uDustSpeed + aPhase);
  // Slow sideways drift, different per particle.
  float wx = sin(uTime * 0.7 + aSeed * 31.7) * uDustWander;
  float wz = cos(uTime * 0.5 + aSeed * 17.3) * uDustWander;
  float worldX = position.x + wx;
  float worldZ = position.z + wz;

  // Wrap world Z around the camera.
  float zRange = max(uDustZRange, 1.0);
  float relZ = worldZ - uCameraZ;
  relZ = mod(relZ + zRange * 0.5, zRange) - zRange * 0.5;
  worldZ = uCameraZ + relZ;

  float surfY = computeDisplacement(vec2(worldX, worldZ));
  // Surface-mode Y: rise off the terrain over age.
  float surfaceY = surfY + age * uDustRise;
  // Tunnel-mode Y: spread vertically around the tunnel centre by
  // a per-particle pseudo-random hash. Mixed in by progress so
  // the column has volume (not a flat plane at surface height).
  float ySpread = (fract(aSeed * 13.71) - 0.5)
    * uDustTunnelYSpread;
  float tunnelY = uTunnelCenterY + ySpread;
  float worldY = mix(surfaceY, tunnelY, uTunnelProgress);
  // -Z forward flow over age cycle (only in tunnel mode).
  float flowZ = age * uDustForwardSpeed * uTunnelProgress;
  worldZ = worldZ - flowZ;
  // Re-wrap after the forward flow so particles still recycle
  // around the camera and don't drift indefinitely off-screen.
  float relZ2 = worldZ - uCameraZ;
  relZ2 = mod(relZ2 + zRange * 0.5, zRange) - zRange * 0.5;
  worldZ = uCameraZ + relZ2;

  vec4 mvPos = viewMatrix * vec4(worldX, worldY, worldZ, 1.0);
  gl_Position = projectionMatrix * mvPos;

  float sizeRand = mix(
    1.0 - uDustSizeJitter,
    1.0 + uDustSizeJitter,
    fract(aSeed * 0.71)
  );
  float depthAtten = clamp(8.0 / max(-mvPos.z, 0.5), 0.4, 1.6);
  gl_PointSize = uDustSize * sizeRand * depthAtten;

  vAge = age;
  vFocusR = length(vec2(worldX, worldZ) - vec2(uFocusX, uFocusZ));
  // Intro fade — same linear radial wave as the particle layer.
  float distFromCam = length(vec2(worldX, worldZ - uCameraZ));
  float waveR = uIntroLinear * 50.0;
  vIntroMul = 1.0 - smoothstep(waveR, waveR + 4.0, distFromCam);
}
`,E=`
uniform vec3 uDustColor;
uniform float uDustOpacity;
uniform float uFogInner;
uniform float uFogOuter;
varying float vAge;
varying float vFocusR;
varying float vIntroMul;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  if (d > 0.5) discard;
  // Soft circular sprite + bell-curve life fade so particles bloom
  // and dissolve instead of popping at the cycle boundary.
  float discAlpha = 1.0 - smoothstep(0.35, 0.5, d);
  float lifeAlpha = sin(vAge * 3.14159);
  float fogFactor = smoothstep(uFogInner, uFogOuter, vFocusR);
  float a = discAlpha * lifeAlpha * uDustOpacity
    * (1.0 - fogFactor) * vIntroMul;
  gl_FragColor = vec4(uDustColor, a);
}
`,M=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,F=`
uniform sampler2D tDiffuse;
uniform float uCA;
uniform float uLens;
varying vec2 vUv;
void main() {
  vec2 uv = vUv - 0.5;
  float r2 = dot(uv, uv);
  uv *= 1.0 + uLens * r2;
  uv += 0.5;
  vec2 dir = uv - 0.5;
  float d = length(dir);
  vec2 off = dir * d * uCA;
  float r = texture2D(tDiffuse, uv - off).r;
  float g = texture2D(tDiffuse, uv      ).g;
  float b = texture2D(tDiffuse, uv + off).b;
  vec3 col = vec3(r, g, b);
  gl_FragColor = vec4(col, 1.0);
}
`,G=`
varying vec2 vUV;
void main() {
  vUV = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,W=`
${h}
uniform float uTime;
uniform float uCausticsScale;
uniform float uCausticsSpeed;
uniform float uCausticsContrast;
uniform vec2 uCausticsWorldMin;
uniform vec2 uCausticsWorldMax;
uniform vec2 uScrollOffset;
varying vec2 vUV;
void main() {
  vec2 worldXZ = mix(uCausticsWorldMin, uCausticsWorldMax, vUV);
  float ct = uTime * uCausticsSpeed;
  vec2 cp = worldXZ * uCausticsScale;
  float c1 = snoise(cp + vec2(ct * 0.6, ct * 0.4));
  float c2 = snoise(cp * 1.37 - vec2(ct * 0.3, -ct * 0.5));
  float ridge = (1.0 - abs(c1)) * (1.0 - abs(c2));
  ridge = pow(clamp(ridge, 0.0, 1.0), max(uCausticsContrast, 0.001));
  gl_FragColor = vec4(ridge, ridge, ridge, 1.0);
}
`,B=e=>{let t=e.replace("#","");return new r.Vector3(parseInt(t.slice(0,2),16)/255,parseInt(t.slice(2,4),16)/255,parseInt(t.slice(4,6),16)/255)},D="in-review:scene-settings:v23",z=(e,t)=>{let a=e*Math.PI/180,s=t*Math.PI/180;return new r.Vector3(Math.sin(a)*Math.cos(s),Math.sin(s),Math.cos(a)*Math.cos(s))},A={noiseScale:.365,displacement:.16,baseColor:"#688500",peakColor:"#0b0e13",fogColor:"#08090d",fogInner:1.5,fogOuter:6.3,focusX:0,focusZ:.4,waveSpeed:1.55,waveAmplitude:.09,waveLength:1.1,waveFalloff:.07,animating:!0,pulseWidth:2,hoverRadius:.65,hoverStrength:.12,hoverEasing:.05,baseAmplitude:.02,baseSpeed:.35,baseWavelength:8,lightAngle:-179,lightElevation:17,lightColor:"#ecff3e",bumpiness:.23,specularStrength:0,specularSharpness:128,particlesOn:!0,particleColor:"#ecff3e",particleSize:2,particleOpacity:1,particleLift:.045,particleSizeJitter:.56,particleXZJitter:.1,particleYJitter:0,wireOn:!0,wireColor:"#ecff3e",wireThickness:.05,wireOpacity:1.5,wireDensity:120,contourSpacing:.015,glowSpread:20,glowStrength:.34,revealRadius:.1,revealBlur:1.15,revealNoiseScale:1.39,revealNoiseStrength:.45,emissionOn:!0,emissionStrength:.06,emissionSize:2,emissionDirBias:.12,bumpNoiseScale:77.7,bumpNoiseStrength:.32,causticsOn:!0,causticsColor:"#94ff3d",causticsIntensity:.14,causticsScale:.72,causticsSpeed:.26,causticsContrast:2.1,causticsDistort:0,dustOn:!0,dustCount:3e3,dustSpawnRadius:16,dustColor:"#ecff3e",dustOpacity:.52,dustSize:3,dustSizeJitter:1,dustSpeed:.08,dustRise:1.15,dustWander:.085,postOn:!0,postCA:.0055,postLens:-.66,scrollOn:!0,scrollSpeed:.0065,scrollRotateX:-.005,scrollRotateY:-.005,scrollRotateZ:.15,scrollZoom:30,corridorOn:!0,corridorWidth:1.8,corridorHeight:.425,corridorSharpness:1.85,oilOn:!0,oilColorA:"#ff5cae",oilColorB:"#5cf0ff",oilIntensity:.47,oilNoiseScale:2.19,oilSpeed:.18,oilRevealRadius:.1,oilRevealBlur:3.1,oilTrailLife:4.5,oilTaperPower:6,oilMaskNoise:0,oilMaskNoiseScale:.05,oilRingStrength:.9,oilRingWidth:0,oilRingBlur:.42,oilSpreadRate:0,oilDecay:.985,oilBlur:2.2,oilSplatRadius:.5,oilSplatStrength:1,oilTexThreshold:.04,oilSplatLag:.18,oilSpeedMax:8,oilSpeedRadiusTaper:.25,oilSpeedStrengthTaper:.15,oilSpeedMoveOn:.3,oilStampActivityUpRate:.05,oilStampActivityDownRate:.025,oilWaterSpread:.55,oilPigmentDiff:.12,oilEdgeDarken:.18,statColorA:"#ecff3e",statColorB:"#f4f5f0",statYOffset:.5,statParticleSize:1.7,statScatterRadius:20,statScatterHeight:4.3,statFormJitter:.019,statHoverRadius:.09,statHoverRepel:.05,statHoverScale:1.8,statHoverGlow:1.4,statHoverGlowColor:"#ffffff",statHoverStiffness:140,statHoverDamping:16,pTunnelTriggerStartCamZ_v2:-56.5,pTunnelTriggerEndCamZ_v2:-80.5,pTunnelRadius:2.05,pTunnelCenterY:-1.6,pTunnelScatter:.31,pTunnelSpiralTurns:.75,pTunnelSpiralPitch:.735,pTunnelRotSpeed:-.21,tunnelWiggle:.02,tunnelPulseSpeed:18,tunnelPulseWidth:4,tunnelPulseBoost:.8,tunnelPulsePeriod:4,tunnelBreathAmp:.35,tunnelBreathSpeed:2.2,tunnelDriftSpeed:6,pTunnelSurfaceDarkenMax:1,pTunnelColorFar:"#000000",pTunnelGradStart:0,pTunnelGradEnd:60,particleHoverColor:"#ffffff",particleHoverStrength:1,pLightDirX:.4,pLightDirY:.8,pLightDirZ:.6,pAmbient:.48,pDiffuse:.44,pSpec:.34,pSpecPower:11,cylWireGridU:28,cylWireGridV:43,cylWireLineWidth:0,cylWireLineSoftness:.02,cylWireOpacity:.45,cylWireColor:"#ecff3e",cylWireTwist:-2.5,cylWireFogStart:20.5,cylWireFogEnd:31.5,cylWireFogNearStart:8,cylWireFogNearEnd:4.75,cylWireRotSpeed:.1,cylWireHoverRadius:.6,cylWireHoverStrength:-.29,dustForwardSpeed:22,dustTunnelYSpread:8,outroPhase1Text:"You've seen the numbers",outroPhase2Text:"Now start exploring",copyDesktopPx:18,copyMobilePx:14,noiseTunOn:!0,noiseTunColor:"#677a05",noiseTunSize:1,noiseTunScale:1.1,noiseTunDeform:.055,noiseTunOpacity:.84,noiseTunSpeed:-.89,noiseTunRotSpeed:.57,noiseTunFogNearStart:4.9,noiseTunFogNearEnd:.9,noiseTunFogFarStart:0,noiseTunFogFarEnd:19,outroPhase1AppearCamZ_v4:-86,outroPhaseSplitCamZ_v4:-91,outroButtonAppearCamZ_v4:-125,outroPhase1HoldMs:2400,outroButtonGapVw:6.7,outroButtonPaddingX:42,outroButtonPaddingY:18,outroButtonRadius:19,outroButtonMagnetRadius:220,outroButtonMagnetStrength:.35,statTriggerOffset:1,statFormInMs:490,statFormOutMs:1440,statSpacing:8,statFirstZ:-5.5,statIdleWiggle:.026,statLabelText0:"Entries to date",statLabelText1:"Websites",statLabelText2:"Experiments",statLabelText3:"Unique makers",mobileLabelText0:"Entries\nto date",mobileLabelText1:"Websites",mobileLabelText2:"Experiments",mobileLabelText3:"Unique\nmakers",mobileOutroPhase1Text:"You've seen\nthe numbers",mobileOutroPhase2Text:"Now start\nexploring",mobileIntroSizeVw:22,mobileTitleSizeVw:14,mobileOutroSizeVw:14,mobileLineHeight:1,mobileOutroButtonGapVw:28,mobilePreLabelGapEm:1.8,mobilePostLabelGapEm:.14,mobilePostLabelSizeEm:.46,statLabelAppearOffset:5.6,statLabelDisappearOffset:-.9,statLabelSizeVw:8,statVideoRectWidth:1.2,statVideoRectHeight:.9,statVideoAspect:4/3,statVideoYOffset:.9,statVideoParticleSize:2.05,statVideoParticleCount:33e3,statVideoFrameColor:"#ffffff",statVideoFrameThickness:0,statVideoCornerRadius:.08,statGlassDepth:.015,statGlassYBase:.2,statGlassIor:1.45,statGlassTransmission:1,statGlassRoughness:.185,statGlassMetalness:0,statGlassThickness:0,statGlassClearcoat:1,statGlassClearcoatRoughness:0,statGlassAttenuationColor:"#ffffff",statGlassReflectivity:1,statGlassDispersion:20,statGlassCornerRadius:.01,statGlassVideoRadius:.115,statGlassIridescence:1,statGlassIridescenceIor:1.5,statGlassHaloColor:"#d8ec46",statGlassHaloStrength:0,statGlassHaloSize:1.6,statGlassInitRotX:0,statGlassInitRotY:1.54,statGlassInitRotZ:.01,statGlassInitScale:0,statGlassExitRotX:0,statGlassExitRotY:-1.75,statGlassExitRotZ:0,statGlassTilesX:12,statGlassTilesY:10,statGlassTileGap:.965,statGlassEnterStart:7,statGlassEnterEnd:1,statGlassExitStart:2,statGlassExitEnd:-1,statGlassHoverStrength:1.5,statGlassHoverRadius:.24,statGlassHoverScale:-.67,statGlassEmissiveIntensity:.7,statGlassSheen:0,statGlassSheenRoughness:.4,statGlassSheenColor:"#ffffff",statGlassBlendingMode:0,statGlassCausticIntensity:0,statGlassCausticScale:3,statGlassCausticSpeed:.5,statGlassCausticColor:"#cfe0ff",statGlassBumpStrength:.6,statGlassBumpScale:4,statGlassBumpDistortion:0,statGlassVertexBumpStrength:0,statGlassFrostStrength:.3,statGlassOilStrength:0,statGlassOilRadius:1.2,statGlassOilScale:1.4,statGlassOilSpeed:.3,statGlassOilColorA:"#ff5cae",statGlassOilColorB:"#5cf0ff",statGlassTileOilStrength:.24,statGlassTileOilColorA:"#ff5cae",statGlassTileOilColorB:"#5cf0ff",statGlassTileOilSpeed:1.19,statGlassTileOilScale:3.4,statGlassTileOilRadius:.13,statGlassTileTrailLife:1.3,statGlassTileTrailTaper:1.1,statGlassTileTrailBlur:.03,statGlassMatcapStrength:.81,statGlassMatcapAngle:2.46,statGlassMatcapElevation:.6,statGlassMatcapSharpness:8.5,statGlassMatcapColor:"#ffffff",statGlassFresnelStrength:0,statGlassFresnelPower:2.5,statGlassFresnelColor:"#000000",statGlassFresnelInvert:0,statGlassFresnelBlend:0,statGlassCausticBlend:1,statGlassHaloBlend:1,statLabelSuper0:"",statLabelSuper1:"",statLabelSuper2:"",statLabelSuper3:"",statLabelSupColor:"#bababa",statLabelPostGapEm:-.52,progressClickOffset:3.3,pWaveOn:!0,pWaveBoost:.85,pWaveSpeed:1.85,pWavePeriod:2.85,pWaveWidth:1.1,rippleOn:!0,rippleColor:"#55fb0e",rippleIntensity:4,rippleSpeed:2.2,rippleSoftness:.07,rippleLife:1.05,rippleNoiseScale:11.55,rippleNoiseStrength:.5,volumeOn:!0,volumeDensity:.71,volumeYFalloff:1.06,volumeMaxDist:11,volumeSteps:30,volumeSharpness:3.3,volumeFocusBias:1.6};e.s(["InReviewScene",0,function({className:e,mode:i="stats",onFirstFrame:l}){let n="embed"===i,u=(0,a.useRef)(n),c=(0,a.useRef)(l);(0,a.useEffect)(()=>{c.current=l},[l]);let f=(0,a.useRef)(null),d=(0,a.useRef)(null),p=(0,a.useRef)(null),S=(0,a.useRef)(null),g=(0,a.useRef)({z:0}),H=(0,a.useRef)({prevCamZ:0}),L=(0,a.useRef)({x:0,y:16,vx:0,vy:0,s:.5,vs:0}),N=(0,a.useRef)({x:0,y:0,active:!1}),k=(0,a.useRef)(null),[I,Z]=(0,a.useState)(()=>(()=>{try{let e=window.localStorage.getItem("in-review:dev-panel-open:v1");return null===e||"true"===e}catch{return!0}})()),[V,Y]=(0,a.useState)(!1),X=(0,a.useRef)(null);null===X.current&&(X.current=(()=>{try{let e=window.localStorage.getItem(D);return e?JSON.parse(e):{}}catch{return{}}})());let U=e=>{let t=X.current[e];return null==t?A[e]:t},[_,$]=(0,a.useState)(()=>U("noiseScale")),[J,j]=(0,a.useState)(()=>U("displacement")),[q,K]=(0,a.useState)(()=>U("baseColor")),[Q,ee]=(0,a.useState)(()=>U("peakColor")),[et,ea]=(0,a.useState)(()=>U("fogColor")),[er,es]=(0,a.useState)(()=>U("fogInner")),[eo,ei]=(0,a.useState)(()=>U("fogOuter")),[el,en]=(0,a.useState)(()=>U("focusX")),[eu,ec]=(0,a.useState)(()=>U("focusZ")),[ef,ed]=(0,a.useState)(()=>U("waveSpeed")),[ep,ev]=(0,a.useState)(()=>U("waveAmplitude")),[em,eh]=(0,a.useState)(()=>U("waveLength")),[eS,eg]=(0,a.useState)(()=>U("waveFalloff")),[ey,ew]=(0,a.useState)(()=>U("pulseWidth")),[ex,eC]=(0,a.useState)(()=>U("hoverRadius")),[eT,eR]=(0,a.useState)(()=>U("hoverStrength")),[eb,eP]=(0,a.useState)(()=>U("hoverEasing")),[eO,eE]=(0,a.useState)(()=>U("baseAmplitude")),[eM,eF]=(0,a.useState)(()=>U("baseSpeed")),[eG,eW]=(0,a.useState)(()=>U("baseWavelength")),[eB,eD]=(0,a.useState)(()=>U("animating")),[ez,eA]=(0,a.useState)(()=>U("lightAngle")),[eH,eL]=(0,a.useState)(()=>U("lightElevation")),[eN,ek]=(0,a.useState)(()=>U("lightColor")),[eI,eZ]=(0,a.useState)(()=>U("bumpiness")),[eV,eY]=(0,a.useState)(()=>U("specularStrength")),[eX,eU]=(0,a.useState)(()=>U("specularSharpness")),[e_,e$]=(0,a.useState)(()=>U("particlesOn")),[eJ,ej]=(0,a.useState)(()=>U("particleColor")),[eq,eK]=(0,a.useState)(()=>U("particleSize")),[eQ,e0]=(0,a.useState)(()=>U("particleOpacity")),[e1,e2]=(0,a.useState)(()=>U("particleLift")),[e3,e5]=(0,a.useState)(()=>U("particleSizeJitter")),[e4,e6]=(0,a.useState)(()=>U("particleXZJitter")),[e8,e9]=(0,a.useState)(()=>U("particleYJitter")),[e7,te]=(0,a.useState)(()=>U("wireOn")),[tt,ta]=(0,a.useState)(()=>U("wireColor")),[tr,ts]=(0,a.useState)(()=>U("wireThickness")),[to,ti]=(0,a.useState)(()=>U("wireOpacity")),[tl,tn]=(0,a.useState)(()=>U("wireDensity")),[tu,tc]=(0,a.useState)(()=>U("glowSpread")),[tf,td]=(0,a.useState)(()=>U("glowStrength")),[tp,tv]=(0,a.useState)(()=>U("revealRadius")),[tm,th]=(0,a.useState)(()=>U("revealBlur")),[tS,tg]=(0,a.useState)(()=>U("revealNoiseScale")),[ty,tw]=(0,a.useState)(()=>U("revealNoiseStrength")),[tx,tC]=(0,a.useState)(()=>U("contourSpacing")),[tT,tR]=(0,a.useState)(()=>U("emissionOn")),[tb,tP]=(0,a.useState)(()=>U("emissionStrength")),[tO,tE]=(0,a.useState)(()=>U("emissionSize")),[tM,tF]=(0,a.useState)(()=>U("emissionDirBias")),[tG,tW]=(0,a.useState)(()=>U("bumpNoiseScale")),[tB,tD]=(0,a.useState)(()=>U("bumpNoiseStrength")),[tz,tA]=(0,a.useState)(()=>U("causticsOn")),[tH,tL]=(0,a.useState)(()=>U("causticsColor")),[tN,tk]=(0,a.useState)(()=>U("causticsIntensity")),[tI,tZ]=(0,a.useState)(()=>U("causticsScale")),[tV,tY]=(0,a.useState)(()=>U("causticsSpeed")),[tX,tU]=(0,a.useState)(()=>U("causticsContrast")),[t_,t$]=(0,a.useState)(()=>U("causticsDistort")),[tJ,tj]=(0,a.useState)(()=>U("dustOn")),[tq,tK]=(0,a.useState)(()=>U("dustColor")),[tQ,t0]=(0,a.useState)(()=>U("dustOpacity")),[t1,t2]=(0,a.useState)(()=>U("dustSize")),[t3,t5]=(0,a.useState)(()=>U("dustSizeJitter")),[t4,t6]=(0,a.useState)(()=>U("dustSpeed")),[t8,t9]=(0,a.useState)(()=>U("dustRise")),[t7,ae]=(0,a.useState)(()=>U("dustWander")),[at,aa]=(0,a.useState)(()=>U("postOn")),[ar,as]=(0,a.useState)(()=>U("postCA")),[ao,ai]=(0,a.useState)(()=>U("postLens")),[al,an]=(0,a.useState)(()=>U("pWaveOn")),[au,ac]=(0,a.useState)(()=>U("pWaveBoost")),[af,ad]=(0,a.useState)(()=>U("pWaveSpeed")),[ap,av]=(0,a.useState)(()=>U("pWavePeriod")),[am,ah]=(0,a.useState)(()=>U("pWaveWidth")),[aS,ag]=(0,a.useState)(()=>U("rippleOn")),[ay,aw]=(0,a.useState)(()=>U("rippleColor")),[ax,aC]=(0,a.useState)(()=>U("rippleIntensity")),[aT,aR]=(0,a.useState)(()=>U("rippleSpeed")),[ab,aP]=(0,a.useState)(()=>U("rippleSoftness")),[aO,aE]=(0,a.useState)(()=>U("rippleLife")),[aM,aF]=(0,a.useState)(()=>U("rippleNoiseScale")),[aG,aW]=(0,a.useState)(()=>U("rippleNoiseStrength")),[aB,aD]=(0,a.useState)(()=>U("volumeOn")),[az,aA]=(0,a.useState)(()=>U("volumeDensity")),[aH,aL]=(0,a.useState)(()=>U("volumeYFalloff")),[aN,ak]=(0,a.useState)(()=>U("volumeMaxDist")),[aI,aZ]=(0,a.useState)(()=>U("volumeSteps")),[aV,aY]=(0,a.useState)(()=>U("volumeSharpness")),[aX,aU]=(0,a.useState)(()=>U("volumeFocusBias")),[a_,a$]=(0,a.useState)(()=>U("scrollOn")),[aJ,aj]=(0,a.useState)(()=>U("scrollSpeed")),[aq,aK]=(0,a.useState)(()=>U("scrollRotateX")),[aQ,a0]=(0,a.useState)(()=>U("scrollRotateY")),[a1,a2]=(0,a.useState)(()=>U("scrollRotateZ")),[a3,a5]=(0,a.useState)(()=>U("scrollZoom")),[a4,a6]=(0,a.useState)(()=>U("corridorOn")),[a8,a9]=(0,a.useState)(()=>U("corridorWidth")),[a7,re]=(0,a.useState)(()=>U("corridorHeight")),[rt,ra]=(0,a.useState)(()=>U("corridorSharpness")),[rr,rs]=(0,a.useState)(()=>U("oilOn")),[ro,ri]=(0,a.useState)(()=>U("oilColorA")),[rl,rn]=(0,a.useState)(()=>U("oilColorB")),[ru,rc]=(0,a.useState)(()=>U("oilIntensity")),[rf,rd]=(0,a.useState)(()=>U("oilNoiseScale")),[rp,rv]=(0,a.useState)(()=>U("oilSpeed")),[rm,rh]=(0,a.useState)(()=>U("oilRevealRadius")),[rS,rg]=(0,a.useState)(()=>U("oilRevealBlur")),[ry,rw]=(0,a.useState)(()=>U("oilTrailLife")),[rx,rC]=(0,a.useState)(()=>U("oilTaperPower")),[rT,rR]=(0,a.useState)(()=>U("oilMaskNoise")),[rb,rP]=(0,a.useState)(()=>U("oilMaskNoiseScale")),[rO,rE]=(0,a.useState)(()=>U("oilRingStrength")),[rM,rF]=(0,a.useState)(()=>U("oilRingWidth")),[rG,rW]=(0,a.useState)(()=>U("oilRingBlur")),[rB,rD]=(0,a.useState)(()=>U("oilSpreadRate")),[rz,rA]=(0,a.useState)(()=>U("statColorA")),[rH,rL]=(0,a.useState)(()=>U("statColorB")),[rN,rk]=(0,a.useState)(()=>U("statYOffset")),[rI,rZ]=(0,a.useState)(()=>U("statParticleSize")),[rV,rY]=(0,a.useState)(()=>U("statScatterRadius")),[rX,rU]=(0,a.useState)(()=>U("statScatterHeight")),[r_,r$]=(0,a.useState)(()=>U("statFormJitter")),[rJ,rj]=(0,a.useState)(()=>U("statHoverRadius")),[rq,rK]=(0,a.useState)(()=>U("statHoverRepel")),[rQ,r0]=(0,a.useState)(()=>U("statHoverScale")),[r1,r2]=(0,a.useState)(()=>U("statHoverGlow")),[r3,r5]=(0,a.useState)(()=>U("statHoverGlowColor")),[r4,r6]=(0,a.useState)(()=>U("statHoverStiffness")),[r8,r9]=(0,a.useState)(()=>U("statHoverDamping")),[r7,se]=(0,a.useState)(()=>U("pTunnelTriggerStartCamZ_v2")),[st,sa]=(0,a.useState)(()=>U("pTunnelTriggerEndCamZ_v2")),[sr,ss]=(0,a.useState)(()=>U("pTunnelRadius")),[so,si]=(0,a.useState)(()=>U("pTunnelCenterY")),[sl,sn]=(0,a.useState)(()=>U("pTunnelScatter")),[su,sc]=(0,a.useState)(()=>U("pTunnelSpiralTurns")),[sf,sd]=(0,a.useState)(()=>U("pTunnelSpiralPitch")),[sp,sv]=(0,a.useState)(()=>U("pTunnelRotSpeed")),[sm,sh]=(0,a.useState)(()=>U("pTunnelSurfaceDarkenMax")),[sS,sg]=(0,a.useState)(()=>U("pTunnelColorFar")),[sy,sw]=(0,a.useState)(()=>U("pTunnelGradStart")),[sx,sC]=(0,a.useState)(()=>U("pTunnelGradEnd")),[sT,sR]=(0,a.useState)(()=>U("particleHoverColor")),[sb,sP]=(0,a.useState)(()=>U("particleHoverStrength")),[sO,sE]=(0,a.useState)(()=>U("pLightDirX")),[sM,sF]=(0,a.useState)(()=>U("pLightDirY")),[sG,sW]=(0,a.useState)(()=>U("pLightDirZ")),[sB,sD]=(0,a.useState)(()=>U("pAmbient")),[sz,sA]=(0,a.useState)(()=>U("pDiffuse")),[sH,sL]=(0,a.useState)(()=>U("pSpec")),[sN,sk]=(0,a.useState)(()=>U("pSpecPower")),[sI,sZ]=(0,a.useState)(()=>U("cylWireGridU")),[sV,sY]=(0,a.useState)(()=>U("cylWireGridV")),[sX,sU]=(0,a.useState)(()=>U("cylWireLineWidth")),[s_,s$]=(0,a.useState)(()=>U("cylWireLineSoftness")),[sJ,sj]=(0,a.useState)(()=>U("cylWireOpacity")),[sq,sK]=(0,a.useState)(()=>U("cylWireColor")),[sQ,s0]=(0,a.useState)(()=>U("cylWireTwist")),[s1,s2]=(0,a.useState)(()=>U("cylWireFogStart")),[s3,s5]=(0,a.useState)(()=>U("cylWireFogEnd")),[s4,s6]=(0,a.useState)(()=>U("cylWireRotSpeed")),[s8,s9]=(0,a.useState)(()=>U("cylWireFogNearStart")),[s7,oe]=(0,a.useState)(()=>U("cylWireFogNearEnd")),[ot,oa]=(0,a.useState)(()=>U("cylWireHoverRadius")),[or,os]=(0,a.useState)(()=>U("cylWireHoverStrength")),[oo,oi]=(0,a.useState)(()=>U("outroPhase1AppearCamZ_v4")),[ol,on]=(0,a.useState)(()=>U("outroPhaseSplitCamZ_v4")),[ou,oc]=(0,a.useState)(()=>U("outroButtonAppearCamZ_v4")),[of,od]=(0,a.useState)(()=>U("outroButtonGapVw")),[op,ov]=(0,a.useState)(()=>U("copyDesktopPx")),[om,oh]=(0,a.useState)(()=>U("copyMobilePx")),[oS,og]=(0,a.useState)(()=>U("noiseTunOn")),[oy,ow]=(0,a.useState)(()=>U("noiseTunColor")),[ox,oC]=(0,a.useState)(()=>U("noiseTunSize")),[oT,oR]=(0,a.useState)(()=>U("noiseTunScale")),[ob,oP]=(0,a.useState)(()=>U("noiseTunDeform")),[oO,oE]=(0,a.useState)(()=>U("noiseTunOpacity")),[oM,oF]=(0,a.useState)(()=>U("noiseTunSpeed")),[oG,oW]=(0,a.useState)(()=>U("noiseTunRotSpeed")),[oB,oD]=(0,a.useState)(()=>U("noiseTunFogNearStart")),[oz,oA]=(0,a.useState)(()=>U("noiseTunFogNearEnd")),[oH,oL]=(0,a.useState)(()=>U("noiseTunFogFarStart")),[oN,ok]=(0,a.useState)(()=>U("noiseTunFogFarEnd")),[oI,oZ]=(0,a.useState)(()=>U("outroButtonMagnetRadius")),[oV,oY]=(0,a.useState)(()=>U("outroButtonMagnetStrength")),[oX,oU]=(0,a.useState)(()=>U("mobileIntroSizeVw")),[o_,o$]=(0,a.useState)(()=>U("mobileTitleSizeVw")),[oJ,oj]=(0,a.useState)(()=>U("mobileOutroSizeVw")),[oq,oK]=(0,a.useState)(()=>U("mobileLineHeight")),[oQ,o0]=(0,a.useState)(()=>U("mobileOutroButtonGapVw")),[o1,o2]=(0,a.useState)(()=>U("mobilePreLabelGapEm")),[o3,o5]=(0,a.useState)(()=>U("mobilePostLabelGapEm")),[o4,o6]=(0,a.useState)(()=>U("mobilePostLabelSizeEm")),[o8,o9]=(0,a.useState)(()=>U("outroButtonPaddingX")),[o7,ie]=(0,a.useState)(()=>U("outroButtonPaddingY")),[it,ia]=(0,a.useState)(()=>U("outroButtonRadius")),[ir,is]=(0,a.useState)(()=>U("statTriggerOffset")),[io,ii]=(0,a.useState)(()=>U("statFormInMs")),[il,iu]=(0,a.useState)(()=>U("statFormOutMs")),[ic,id]=(0,a.useState)(()=>U("statIdleWiggle")),[ip,iv]=(0,a.useState)(()=>U("statSpacing")),[im,ih]=(0,a.useState)(()=>U("statFirstZ")),[iS,ig]=(0,a.useState)(()=>U("statLabelText0")),[iy,iw]=(0,a.useState)(()=>U("statLabelText1")),[ix,iC]=(0,a.useState)(()=>U("statLabelText2")),[iT,iR]=(0,a.useState)(()=>U("statLabelText3")),[ib,iP]=(0,a.useState)(()=>U("statLabelAppearOffset")),[iO,iE]=(0,a.useState)(()=>U("statLabelDisappearOffset")),[iM,iF]=(0,a.useState)(()=>U("statLabelSizeVw")),[iG,iW]=(0,a.useState)(()=>U("statLabelPostGapEm")),[iB,iD]=(0,a.useState)(()=>U("progressClickOffset")),[iz,iA]=(0,a.useState)(()=>{try{let e=window.localStorage.getItem("in-review:intro-title-size:v2");if(e){let t=Number(e);if(Number.isFinite(t)&&t>0)return t}}catch{}return 12});(0,a.useEffect)(()=>{if("u"<typeof document)return;let e=document.documentElement;e.style.setProperty("--ir-intro-vw",`${oX}vw`),e.style.setProperty("--ir-title-vw",`${o_}vw`),e.style.setProperty("--ir-outro-vw",`${oJ}vw`),e.style.setProperty("--ir-line-h",String(oq)),e.style.setProperty("--ir-outro-gap-vw",`${oQ}vw`),e.style.setProperty("--ir-pre-gap-em",`${o1}em`),e.style.setProperty("--ir-post-gap-em",`${o3}em`),e.style.setProperty("--ir-post-size-em",`${o4}em`),e.style.setProperty("--ir-copy-desktop-px",`${op}px`),e.style.setProperty("--ir-copy-mobile-px",`${om}px`)},[oX,o_,oJ,oq,oQ,o1,o3,o4,op,om,oS,oy,ox,oT,ob,oO,oM,oG,oB,oz,oH,oN]);let[iH,iL]=(0,a.useState)(()=>U("statLabelSuper0")),[iN,ik]=(0,a.useState)(()=>U("statLabelSuper1")),[iI,iZ]=(0,a.useState)(()=>U("statLabelSuper2")),[iV,iY]=(0,a.useState)(()=>U("statLabelSuper3")),[iX,iU]=(0,a.useState)(()=>U("statLabelSupColor")),[i_,i$]=(0,a.useState)(()=>U("statVideoRectWidth")),[iJ,ij]=(0,a.useState)(()=>U("statVideoRectHeight")),[iq,iK]=(0,a.useState)(()=>U("statVideoYOffset")),[iQ,i0]=(0,a.useState)(()=>U("statVideoParticleSize")),[i1,i2]=(0,a.useState)(()=>U("statVideoFrameColor")),[i3,i5]=(0,a.useState)(()=>U("statVideoAspect")),[i4,i6]=(0,a.useState)(()=>U("statVideoParticleCount")),[i8,i9]=(0,a.useState)(()=>U("statVideoFrameThickness")),[i7,le]=(0,a.useState)(()=>U("statVideoCornerRadius")),[lt,la]=(0,a.useState)(()=>U("statGlassDepth")),[lr,ls]=(0,a.useState)(()=>U("statGlassYBase")),[lo,li]=(0,a.useState)(()=>U("statGlassIor")),[ll,ln]=(0,a.useState)(()=>U("statGlassTransmission")),[lu,lc]=(0,a.useState)(()=>U("statGlassRoughness")),[lf,ld]=(0,a.useState)(()=>U("statGlassMetalness")),[lp,lv]=(0,a.useState)(()=>U("statGlassThickness")),[lm,lh]=(0,a.useState)(()=>U("statGlassClearcoat")),[lS,lg]=(0,a.useState)(()=>U("statGlassClearcoatRoughness")),[ly,lw]=(0,a.useState)(()=>U("statGlassAttenuationColor")),[lx,lC]=(0,a.useState)(()=>U("statGlassReflectivity")),[lT,lR]=(0,a.useState)(()=>U("statGlassDispersion")),[lb,lP]=(0,a.useState)(()=>U("statGlassCornerRadius")),[lO,lE]=(0,a.useState)(()=>U("statGlassVideoRadius")),[lM,lF]=(0,a.useState)(()=>U("statGlassIridescence")),[lG,lW]=(0,a.useState)(()=>U("statGlassIridescenceIor")),[lB,lD]=(0,a.useState)(()=>U("statGlassHaloColor")),[lz,lA]=(0,a.useState)(()=>U("statGlassHaloStrength")),[lH,lL]=(0,a.useState)(()=>U("statGlassHaloSize")),[lN,lk]=(0,a.useState)(()=>U("statGlassInitRotX")),[lI,lZ]=(0,a.useState)(()=>U("statGlassInitRotY")),[lV,lY]=(0,a.useState)(()=>U("statGlassInitRotZ")),[lX,lU]=(0,a.useState)(()=>U("statGlassInitScale")),[l_,l$]=(0,a.useState)(()=>U("statGlassExitRotX")),[lJ,lj]=(0,a.useState)(()=>U("statGlassExitRotY")),[lq,lK]=(0,a.useState)(()=>U("statGlassExitRotZ")),[lQ,l0]=(0,a.useState)(()=>U("statGlassTilesX")),[l1,l2]=(0,a.useState)(()=>U("statGlassTilesY")),[l3,l5]=(0,a.useState)(()=>U("statGlassTileGap")),[l4,l6]=(0,a.useState)(()=>U("statGlassEnterStart")),[l8,l9]=(0,a.useState)(()=>U("statGlassEnterEnd")),[l7,ne]=(0,a.useState)(()=>U("statGlassExitStart")),[nt,na]=(0,a.useState)(()=>U("statGlassExitEnd")),[nr,ns]=(0,a.useState)(()=>U("statGlassHoverStrength")),[no,ni]=(0,a.useState)(()=>U("statGlassHoverRadius")),[nl,nn]=(0,a.useState)(()=>U("statGlassHoverScale")),[nu,nc]=(0,a.useState)(()=>U("statGlassEmissiveIntensity")),[nf,nd]=(0,a.useState)(()=>U("statGlassSheen")),[np,nv]=(0,a.useState)(()=>U("statGlassSheenRoughness")),[nm,nh]=(0,a.useState)(()=>U("statGlassSheenColor")),[nS,ng]=(0,a.useState)(()=>U("statGlassBlendingMode")),[ny,nw]=(0,a.useState)(()=>U("statGlassCausticIntensity")),[nx,nC]=(0,a.useState)(()=>U("statGlassCausticScale")),[nT,nR]=(0,a.useState)(()=>U("statGlassCausticSpeed")),[nb,nP]=(0,a.useState)(()=>U("statGlassCausticColor")),[nO,nE]=(0,a.useState)(()=>U("statGlassFresnelStrength")),[nM,nF]=(0,a.useState)(()=>U("statGlassFresnelPower")),[nG,nW]=(0,a.useState)(()=>U("statGlassFresnelColor")),[nB,nD]=(0,a.useState)(()=>U("statGlassFresnelInvert")),[nz,nA]=(0,a.useState)(()=>U("statGlassFresnelBlend")),[nH,nL]=(0,a.useState)(()=>U("statGlassCausticBlend")),[nN,nk]=(0,a.useState)(()=>U("statGlassHaloBlend")),[nI,nZ]=(0,a.useState)(()=>U("statGlassBumpStrength")),[nV,nY]=(0,a.useState)(()=>U("statGlassBumpScale")),[nX,nU]=(0,a.useState)(()=>U("statGlassBumpDistortion")),[n_,n$]=(0,a.useState)(()=>U("statGlassVertexBumpStrength")),[nJ,nj]=(0,a.useState)(()=>U("statGlassFrostStrength")),[nq,nK]=(0,a.useState)(()=>U("statGlassOilStrength")),[nQ,n0]=(0,a.useState)(()=>U("statGlassOilRadius")),[n1,n2]=(0,a.useState)(()=>U("statGlassOilScale")),[n3,n5]=(0,a.useState)(()=>U("statGlassOilSpeed")),[n4,n6]=(0,a.useState)(()=>U("statGlassOilColorA")),[n8,n9]=(0,a.useState)(()=>U("statGlassOilColorB")),[n7,ue]=(0,a.useState)(()=>U("statGlassTileOilStrength")),[ut,ua]=(0,a.useState)(()=>U("statGlassTileOilColorA")),[ur,us]=(0,a.useState)(()=>U("statGlassTileOilColorB")),[uo,ui]=(0,a.useState)(()=>U("statGlassTileOilSpeed")),[ul,un]=(0,a.useState)(()=>U("statGlassTileOilScale")),[uu,uc]=(0,a.useState)(()=>U("statGlassTileOilRadius")),[uf,ud]=(0,a.useState)(()=>U("statGlassTileTrailLife")),[up,uv]=(0,a.useState)(()=>U("statGlassTileTrailTaper")),[um,uh]=(0,a.useState)(()=>U("statGlassTileTrailBlur")),[uS,ug]=(0,a.useState)(()=>U("statGlassMatcapStrength")),[uy,uw]=(0,a.useState)(()=>U("statGlassMatcapAngle")),[ux,uC]=(0,a.useState)(()=>U("statGlassMatcapElevation")),[uT,uR]=(0,a.useState)(()=>U("statGlassMatcapSharpness")),[ub,uP]=(0,a.useState)(()=>U("statGlassMatcapColor"));return(0,a.useEffect)(()=>{let e,t=f.current;if(!t)return;let a=u.current;try{e=new s.WebGLRenderer({antialias:!0,alpha:!0,precision:"highp",powerPreference:"high-performance"})}catch{return}e.setPixelRatio(Math.min(2,window.devicePixelRatio)),e.setSize(t.clientWidth,t.clientHeight,!1),e.outputColorSpace=r.SRGBColorSpace,e.domElement.style.display="block",e.domElement.style.width="100%",e.domElement.style.height="100%",t.appendChild(e.domElement);let o=navigator.userAgent;/^((?!chrome|android|crios|fxios).)*safari/i.test(o);let i=new r.Scene;i.background=null;let l=new r.AmbientLight(0xffffff,.4);i.add(l);let n=new r.DirectionalLight(0xffffff,1.2);n.position.set(4,6,3),i.add(n);let D=new r.DirectionalLight(0xa3c3ff,.8);D.position.set(-3,2,-4),i.add(D);let I=new r.PerspectiveCamera(52,t.clientWidth/Math.max(t.clientHeight,1),.1,80),Z=new r.Vector3(0,1.2,5.5),V=new r.Vector3(0,.1,0);I.position.copy(Z),I.lookAt(V);let Y=new r.PlaneGeometry(60,60,340,340);Y.rotateX(-Math.PI/2);let U={uNoiseScale:{value:A.noiseScale},uDisplacement:{value:A.displacement},uBaseColor:{value:B(A.baseColor)},uPeakColor:{value:B(A.peakColor)},uFogColor:{value:B(A.fogColor)},uFogInner:{value:A.fogInner},uFogOuter:{value:A.fogOuter},uSurfaceDarken:{value:0},uFocusX:{value:A.focusX},uFocusZ:{value:A.focusZ},uTime:{value:0},uWaveSpeed:{value:A.waveSpeed},uWaveAmplitude:{value:A.waveAmplitude},uWaveLength:{value:A.waveLength},uWaveFalloff:{value:A.waveFalloff},uPulseWidth:{value:A.pulseWidth},uClicks:{value:[new r.Vector3(0,0,-1),new r.Vector3(0,0,-1),new r.Vector3(0,0,-1),new r.Vector3(0,0,-1)]},uHoverX:{value:0},uHoverZ:{value:0},uHoverActive:{value:0},uHoverRadius:{value:A.hoverRadius},uHoverStrength:{value:A.hoverStrength},uScrollOffset:{value:new r.Vector2(0,0)},uIntro:{value:0},uIntroLinear:{value:0},uCorridorWidth:{value:A.corridorWidth},uCorridorHeight:{value:A.corridorOn?A.corridorHeight:0},uCorridorSharpness:{value:A.corridorSharpness},uBaseAmplitude:{value:A.baseAmplitude},uBaseSpeed:{value:A.baseSpeed},uBaseWavelength:{value:A.baseWavelength},uLightDir:{value:z(A.lightAngle,A.lightElevation)},uLightColor:{value:B(A.lightColor)},uBumpiness:{value:A.bumpiness},uSpecularStrength:{value:A.specularStrength},uSpecularSharpness:{value:A.specularSharpness},uLightMap:{value:null},uEmissionStrength:{value:A.emissionOn?A.emissionStrength:0},uEmissionDirBias:{value:A.emissionDirBias},uLightMapWorldMin:{value:new r.Vector2(-30,-30)},uLightMapWorldMax:{value:new r.Vector2(30,30)},uBumpNoiseScale:{value:A.bumpNoiseScale},uBumpNoiseStrength:{value:A.bumpNoiseStrength},uCausticsColor:{value:B(A.causticsColor)},uCausticsIntensity:{value:A.causticsOn?A.causticsIntensity:0},uCausticsScale:{value:A.causticsScale},uCausticsSpeed:{value:A.causticsSpeed},uCausticsContrast:{value:A.causticsContrast},uCausticsDistort:{value:A.causticsDistort},uRippleColor:{value:B(A.rippleColor)},uRippleIntensity:{value:A.rippleOn?A.rippleIntensity:0},uRippleSpeed:{value:A.rippleSpeed},uRippleSoftness:{value:A.rippleSoftness},uRippleLife:{value:A.rippleLife},uRippleNoiseScale:{value:A.rippleNoiseScale},uRippleNoiseStrength:{value:A.rippleNoiseStrength},uOilColorA:{value:B(A.oilColorA)},uOilColorB:{value:B(A.oilColorB)},uOilIntensity:{value:A.oilOn?A.oilIntensity:0},uOilNoiseScale:{value:A.oilNoiseScale},uOilSpeed:{value:A.oilSpeed},uOilRevealRadius:{value:A.oilRevealRadius},uOilRevealBlur:{value:A.oilRevealBlur},uOilTrailLife:{value:A.oilTrailLife},uOilTaperPower:{value:A.oilTaperPower},uOilMaskNoise:{value:A.oilMaskNoise},uOilMaskNoiseScale:{value:A.oilMaskNoiseScale},uOilRingStrength:{value:A.oilRingStrength},uOilRingWidth:{value:A.oilRingWidth},uOilRingBlur:{value:A.oilRingBlur},uOilSpreadRate:{value:A.oilSpreadRate},uOilTex:{value:null},uOilWorldMin:{value:new r.Vector2(-30,-30)},uOilWorldMax:{value:new r.Vector2(30,30)},uOilTexThreshold:{value:A.oilTexThreshold},uOilMaxArc:{value:1},uOilTrail:{value:Array.from({length:16},()=>new r.Vector4(0,0,-1,0))},uCausticsTex:{value:null},uCausticsWorldMin:{value:new r.Vector2(-30,-30)},uCausticsWorldMax:{value:new r.Vector2(30,30)},uVolumeDensity:{value:A.volumeOn?A.volumeDensity:0},uVolumeYFalloff:{value:A.volumeYFalloff},uVolumeMaxDist:{value:A.volumeMaxDist},uVolumeSteps:{value:A.volumeSteps},uVolumeSharpness:{value:A.volumeSharpness},uVolumeFocusBias:{value:A.volumeFocusBias}},_={current:A.animating},$=()=>{let e=es.uPLightDir.value,t=es.uPAmbient.value,a=es.uPDiffuse.value,r=es.uPSpec.value,s=es.uPSpecPower.value;for(let o of at)o.setPLight(e.x,e.y,e.z,t,a,r,s)};S.current={setNoiseScale:e=>{U.uNoiseScale.value=e},setDisplacement:e=>{U.uDisplacement.value=e},setFogColor:e=>{U.uFogColor.value=B(e)},setFogInner:e=>{U.uFogInner.value=e},setFogOuter:e=>{U.uFogOuter.value=e},setFocusX:e=>{U.uFocusX.value=e},setFocusZ:e=>{tk.current=e},setBaseColor:e=>{U.uBaseColor.value=B(e)},setPeakColor:e=>{U.uPeakColor.value=B(e)},setWaveSpeed:e=>{U.uWaveSpeed.value=e},setWaveAmplitude:e=>{U.uWaveAmplitude.value=e},setWaveLength:e=>{U.uWaveLength.value=e},setWaveFalloff:e=>{U.uWaveFalloff.value=e},setPulseWidth:e=>{U.uPulseWidth.value=e},setHoverRadius:e=>{U.uHoverRadius.value=e},setHoverStrength:e=>{U.uHoverStrength.value=e},setHoverEasing:e=>{tW.current=e},setBaseAmplitude:e=>{U.uBaseAmplitude.value=e},setBaseSpeed:e=>{U.uBaseSpeed.value=e},setBaseWavelength:e=>{U.uBaseWavelength.value=e},setAnimating:e=>{_.current=e},setLightDir:(e,t)=>{U.uLightDir.value.copy(z(e,t))},setLightColor:e=>{U.uLightColor.value=B(e)},setBumpiness:e=>{U.uBumpiness.value=e},setSpecularStrength:e=>{U.uSpecularStrength.value=e},setSpecularSharpness:e=>{U.uSpecularSharpness.value=e},setParticlesOn:e=>{ei&&(ei.visible=e)},setParticleColor:e=>{es.uParticleColor.value=B(e)},setParticleSize:e=>{es.uParticleSize.value=e},setParticleOpacity:e=>{es.uParticleOpacity.value=e},setParticleLift:e=>{es.uParticleLift.value=e},setParticleSizeJitter:e=>{es.uParticleSizeJitter.value=e},setParticleXZJitter:e=>{es.uParticleXZJitter.value=e},setParticleYJitter:e=>{es.uParticleYJitter.value=e},setWireOn:e=>{eh.visible=e},setWireColor:e=>{ev.uWireColor.value=B(e)},setWireThickness:e=>{ev.uWireThickness.value=e},setWireOpacity:e=>{ev.uWireOpacity.value=e},setWireDensity:e=>{ev.uWireDensity.value=e},setGlowSpread:e=>{ev.uGlowSpread.value=e},setGlowStrength:e=>{ev.uGlowStrength.value=e},setRevealRadius:e=>{ev.uRevealRadius.value=e},setRevealBlur:e=>{ev.uRevealBlur.value=e},setRevealNoiseScale:e=>{ev.uRevealNoiseScale.value=e},setRevealNoiseStrength:e=>{ev.uRevealNoiseStrength.value=e},setContourSpacing:e=>{ev.uContourSpacing.value=e},setEmissionOn:e=>{U.uEmissionStrength.value=e?X.current.emissionStrength??A.emissionStrength:0},setEmissionStrength:e=>{U.uEmissionStrength.value=e},setEmissionSize:e=>{ef.uEmissionSize.value=e},setEmissionDirBias:e=>{U.uEmissionDirBias.value=e},setBumpNoiseScale:e=>{U.uBumpNoiseScale.value=e},setBumpNoiseStrength:e=>{U.uBumpNoiseStrength.value=e},setCausticsOn:e=>{U.uCausticsIntensity.value=e?X.current.causticsIntensity??A.causticsIntensity:0},setCausticsColor:e=>{U.uCausticsColor.value=B(e)},setCausticsIntensity:e=>{U.uCausticsIntensity.value=e},setCausticsScale:e=>{U.uCausticsScale.value=e},setCausticsSpeed:e=>{U.uCausticsSpeed.value=e},setCausticsContrast:e=>{U.uCausticsContrast.value=e},setCausticsDistort:e=>{U.uCausticsDistort.value=e},setDustOn:e=>{e0.visible=e},setDustColor:e=>{eK.uDustColor.value=B(e)},setDustOpacity:e=>{eK.uDustOpacity.value=e},setDustSize:e=>{eK.uDustSize.value=e},setDustSizeJitter:e=>{eK.uDustSizeJitter.value=e},setDustSpeed:e=>{eK.uDustSpeed.value=e},setDustRise:e=>{eK.uDustRise.value=e},setDustWander:e=>{eK.uDustWander.value=e},setPostOn:e=>{e8.uCA.value=e?X.current.postCA??A.postCA:0,e8.uLens.value=e?X.current.postLens??A.postLens:0},setPostCA:e=>{e8.uCA.value=e},setPostLens:e=>{e8.uLens.value=e},setPWaveOn:e=>{es.uPWaveBoost.value=e?X.current.pWaveBoost??A.pWaveBoost:0},setPWaveBoost:e=>{es.uPWaveBoost.value=e},setPWaveSpeed:e=>{es.uPWaveSpeed.value=e},setPWavePeriod:e=>{es.uPWavePeriod.value=e},setPWaveWidth:e=>{es.uPWaveWidth.value=e},setRippleOn:e=>{U.uRippleIntensity.value=e?X.current.rippleIntensity??A.rippleIntensity:0},setRippleColor:e=>{U.uRippleColor.value=B(e)},setRippleIntensity:e=>{U.uRippleIntensity.value=e},setRippleSpeed:e=>{U.uRippleSpeed.value=e},setRippleSoftness:e=>{U.uRippleSoftness.value=e},setRippleLife:e=>{U.uRippleLife.value=e},setRippleNoiseScale:e=>{U.uRippleNoiseScale.value=e},setRippleNoiseStrength:e=>{U.uRippleNoiseStrength.value=e},setVolumeOn:e=>{U.uVolumeDensity.value=e?X.current.volumeDensity??A.volumeDensity:0},setVolumeDensity:e=>{U.uVolumeDensity.value=e},setVolumeYFalloff:e=>{U.uVolumeYFalloff.value=e},setVolumeMaxDist:e=>{U.uVolumeMaxDist.value=e},setVolumeSteps:e=>{U.uVolumeSteps.value=e},setVolumeSharpness:e=>{U.uVolumeSharpness.value=e},setVolumeFocusBias:e=>{U.uVolumeFocusBias.value=e},setScrollOn:e=>{tB.on=e},setScrollSpeed:e=>{tB.speed=e},setScrollRotateX:e=>{tB.rotateX=e},setScrollRotateY:e=>{tB.rotateY=e},setScrollRotateZ:e=>{tB.rotateZ=e},setScrollZoom:e=>{tB.zoom=e},setCorridorOn:e=>{U.uCorridorHeight.value=e?X.current.corridorHeight??A.corridorHeight:0},setCorridorWidth:e=>{U.uCorridorWidth.value=e},setCorridorHeight:e=>{U.uCorridorHeight.value=e},setCorridorSharpness:e=>{U.uCorridorSharpness.value=e},setOilOn:e=>{U.uOilIntensity.value=e?X.current.oilIntensity??A.oilIntensity:0},setOilColorA:e=>{U.uOilColorA.value=B(e)},setOilColorB:e=>{U.uOilColorB.value=B(e)},setOilIntensity:e=>{U.uOilIntensity.value=e},setOilNoiseScale:e=>{U.uOilNoiseScale.value=e},setOilSpeed:e=>{U.uOilSpeed.value=e},setOilRevealRadius:e=>{U.uOilRevealRadius.value=e},setOilRevealBlur:e=>{U.uOilRevealBlur.value=e},setOilTrailLife:e=>{U.uOilTrailLife.value=e},setStatColorA:e=>{aS.colorA=e,at.forEach(t=>t.setColorA(e))},setStatColorB:e=>{aS.colorB=e,at.forEach(t=>t.setColorB(e))},setStatYOffset:e=>{aS.yOffset=e,at.forEach(t=>t.setYOffset(e))},setStatParticleSize:e=>{aS.particleSize=e,at.forEach(t=>t.setParticleSize(e))},setStatScatterRadius:e=>{aS.scatterRadius=e,at.forEach(t=>t.setScatterRadius(e))},setStatScatterHeight:e=>{aS.scatterHeight=e,at.forEach(t=>t.setScatterHeight(e))},setStatFormJitter:e=>{aS.formJitter=e,at.forEach(t=>t.setFormJitter(e))},setStatHoverRadius:e=>{aS.hoverRadius=e,at.forEach(t=>t.setHoverRadius(e)),es.uHoverNRadius.value=e},setStatHoverRepel:e=>{aS.hoverRepel=e,at.forEach(t=>t.setHoverRepel(e)),es.uHoverNRepel.value=e},setStatHoverScale:e=>{aS.hoverScale=e,at.forEach(t=>t.setHoverScale(e)),es.uHoverNScale.value=e},setStatHoverGlow:e=>{aS.hoverGlow=e,at.forEach(t=>t.setHoverGlow(e)),es.uHoverNGlow.value=e},setStatHoverGlowColor:e=>{aS.hoverGlowColor=e,at.forEach(t=>t.setHoverGlowColor(e)),es.uHoverNGlowColor.value.set(e)},setStatHoverStiffness:e=>{ah.stiffness=e},setStatHoverDamping:e=>{ah.damping=e},setPTunnelTriggerStartCamZ:e=>{ar.triggerStartCamZ=e},setPTunnelTriggerEndCamZ:e=>{ar.triggerEndCamZ=e},setPTunnelRadius:e=>{es.uTunnelRadius.value=e},setPTunnelCenterY:e=>{ar.centerYOffset=e},setPTunnelScatter:e=>{es.uTunnelScatter.value=e},setPTunnelSpiralTurns:e=>{es.uTunnelSpiralTurns.value=e},setPTunnelSpiralPitch:e=>{es.uTunnelSpiralPitch.value=e},setPTunnelRotSpeed:e=>{es.uTunnelRotSpeed.value=e},setPTunnelSurfaceDarkenMax:e=>{ar.surfaceDarkenMax=e},setPTunnelColorFar:e=>{es.uParticleColorFar.value=B(e)},setPTunnelGradStart:e=>{es.uParticleGradStart.value=e},setPTunnelGradEnd:e=>{es.uParticleGradEnd.value=e},setParticleHoverColor:e=>{es.uParticleHoverColor.value=B(e)},setParticleHoverStrength:e=>{es.uParticleHoverStrength.value=e},setPLightDirX:e=>{let t=es.uPLightDir.value;t.x=e,t.normalize(),$()},setPLightDirY:e=>{let t=es.uPLightDir.value;t.y=e,t.normalize(),$()},setPLightDirZ:e=>{let t=es.uPLightDir.value;t.z=e,t.normalize(),$()},setPAmbient:e=>{es.uPAmbient.value=e,$()},setPDiffuse:e=>{es.uPDiffuse.value=e,$()},setPSpec:e=>{es.uPSpec.value=e,$()},setPSpecPower:e=>{es.uPSpecPower.value=e,$()},setCylWireGridU:e=>{eA.uGridU.value=e},setCylWireGridV:e=>{eA.uGridV.value=e},setCylWireLineWidth:e=>{eA.uLineWidth.value=e},setCylWireLineSoftness:e=>{eA.uLineSoftness.value=e},setCylWireOpacity:e=>{eA.uWireOpacity.value=e},setCylWireColor:e=>{eA.uWireColor.value.set(e)},setCylWireTwist:e=>{eA.uTwist.value=e},setCylWireFogStart:e=>{eA.uFogStart.value=e},setCylWireFogEnd:e=>{eA.uFogEnd.value=e},setCylWireRotSpeed:e=>{eA.uRotSpeed.value=e},setCylWireFogNearStart:e=>{eA.uFogNearStart.value=e},setCylWireFogNearEnd:e=>{eA.uFogNearEnd.value=e},setCylWireHoverRadius:e=>{eA.uHoverRadius.value=e},setCylWireHoverStrength:e=>{eA.uHoverStrength.value=e},setOutroPhase1AppearCamZ:e=>{as.phase1AppearCamZ=e},setOutroPhaseSplitCamZ:e=>{as.phaseSplitCamZ=e},setOutroButtonAppearCamZ:e=>{as.buttonAppearCamZ=e},setOutroButtonGapVw:e=>{let t=k.current;t&&(t.btnWrap.style.top=`calc(46% + ${e}vw)`)},setOutroButtonMagnetRadius:e=>{as.magnetRadius=e},setOutroButtonMagnetStrength:e=>{as.magnetStrength=e},setNoiseTunOn:e=>{eV.current=e},setNoiseTunColor:e=>{ek.uColor.value.set(e)},setNoiseTunSize:e=>{eY.current=e},setNoiseTunScale:e=>{ek.uScale.value=e},setNoiseTunDeform:e=>{ek.uDeform.value=e},setNoiseTunOpacity:e=>{ek.uOpacity.value=e},setNoiseTunSpeed:e=>{ek.uSpeed.value=e},setNoiseTunRotSpeed:e=>{ek.uRotSpeed.value=e},setNoiseTunFogNearStart:e=>{ek.uFogNearStart.value=e},setNoiseTunFogNearEnd:e=>{ek.uFogNearEnd.value=e},setNoiseTunFogFarStart:e=>{ek.uFogFarStart.value=e},setNoiseTunFogFarEnd:e=>{ek.uFogFarEnd.value=e},setOutroButtonPaddingX:e=>{let t=k.current;if(t){let a=t.btnWrap.firstElementChild;a&&(a.style.paddingLeft=`${e}px`,a.style.paddingRight=`${e}px`)}},setOutroButtonPaddingY:e=>{let t=k.current;if(t){let a=t.btnWrap.firstElementChild;a&&(a.style.paddingTop=`${e}px`,a.style.paddingBottom=`${e}px`,a.style.height="auto")}},setOutroButtonRadius:e=>{let t=k.current;if(t){let a=t.btnWrap.firstElementChild;a&&(a.style.borderRadius=`${e}px`)}},setStatTriggerOffset:e=>{aS.triggerOffset=e,at.forEach(t=>t.setTriggerOffset(e))},setStatFormInMs:e=>{aS.formInMs=e,at.forEach(t=>t.setFormInDurationMs(e))},setStatFormOutMs:e=>{aS.formOutMs=e,at.forEach(t=>t.setFormOutDurationMs(e))},setStatIdleWiggle:e=>{aS.idleWiggle=e,at.forEach(t=>t.setIdleWiggle(e))},setStatLabelText:(e,t)=>{if(e<0||e>=ai.texts.length)return;ai.texts[e]=t;let a=ao[e];a&&ad(a,t,af(e))},setStatLabelSuper:(e,t)=>{if(e<0||e>=ai.supers.length)return;ai.supers[e]=t;let a=ao[e];a&&ad(a,ai.texts[e]??"",af(e))},setStatLabelSupColor:e=>{for(let t of(ai.supColor=e,ao))t.sup&&(t.sup.style.color=e)},setStatVideoRectWidth:e=>{an.rectWidth=e;let t=e/Math.max(an.aspect,1e-4);for(let a of aa)a.setSize(e,t,au.depth)},setStatVideoRectHeight:()=>{},setStatVideoAspect:e=>{an.aspect=Math.max(.1,e);let t=an.rectWidth/an.aspect;for(let e of aa)e.setSize(an.rectWidth,t,au.depth)},setStatVideoYOffset:e=>{an.yOffset=e},setStatVideoParticleSize:e=>{an.particleSize=e},setStatVideoParticleCount:e=>{an.particleCount=Math.max(100,Math.floor(e))},setStatVideoFrameColor:e=>{an.frameColor=e},setStatVideoFrameThickness:e=>{an.frameThickness=e},setStatVideoCornerRadius:e=>{an.cornerRadius=e},setStatGlassDepth:e=>{au.depth=e;let t=an.rectWidth,a=t/Math.max(an.aspect,1e-4);for(let r of aa)r.setSize(t,a,e)},setStatGlassYBase:e=>{for(let t of(au.yBase=e,aa))t.setYBase(e)},setStatGlassIor:e=>{for(let t of(au.ior=e,aa))t.setIor(e)},setStatGlassTransmission:e=>{for(let t of(au.transmission=e,aa))t.setTransmission(e)},setStatGlassRoughness:e=>{for(let t of(au.roughness=e,aa))t.setRoughness(e)},setStatGlassMetalness:e=>{for(let t of(au.metalness=e,aa))t.setMetalness(e)},setStatGlassThickness:e=>{for(let t of(au.thickness=e,aa))t.setThickness(e)},setStatGlassClearcoat:e=>{for(let t of(au.clearcoat=e,aa))t.setClearcoat(e)},setStatGlassClearcoatRoughness:e=>{for(let t of(au.clearcoatRoughness=e,aa))t.setClearcoatRoughness(e)},setStatGlassAttenuationColor:e=>{for(let t of(au.attenuationColor=e,aa))t.setAttenuationColor(e)},setStatGlassReflectivity:e=>{for(let t of(au.reflectivity=e,aa))t.setReflectivity(e)},setStatGlassDispersion:e=>{for(let t of(au.dispersion=e,aa))t.setDispersion(e)},setStatGlassCornerRadius:e=>{for(let t of(au.cornerRadius=e,aa))t.setCornerRadius(e)},setStatGlassVideoRadius:e=>{for(let t of(au.videoRadius=e,aa))t.setVideoRadius(e)},setStatGlassIridescence:e=>{for(let t of(au.iridescence=e,aa))t.setIridescence(e)},setStatGlassIridescenceIor:e=>{for(let t of(au.iridescenceIor=e,aa))t.setIridescenceIor(e)},setStatGlassHaloColor:e=>{for(let t of(au.haloColor=e,aa))t.setHaloColor(e)},setStatGlassHaloStrength:e=>{for(let t of(au.haloStrength=e,aa))t.setHaloStrength(e)},setStatGlassHaloSize:e=>{for(let t of(au.haloSize=e,aa))t.setHaloSize(e)},setStatGlassInitRot:(e,t,a)=>{for(let r of(au.initRotX=e,au.initRotY=t,au.initRotZ=a,aa))r.setInitialRotation(e,t,a)},setStatGlassInitScale:e=>{for(let t of(au.initScale=e,aa))t.setInitialScale(e,e,e)},setStatGlassExitRot:(e,t,a)=>{for(let r of(au.exitRotX=e,au.exitRotY=t,au.exitRotZ=a,aa))r.setExitRotation(e,t,a)},setStatGlassTiles:(e,t)=>{for(let a of(au.tilesX=Math.max(1,Math.round(e)),au.tilesY=Math.max(1,Math.round(t)),aa))a.setTiles(au.tilesX,au.tilesY)},setStatGlassTileGap:e=>{for(let t of(au.tileGap=e,aa))t.setTileGap(e)},setStatGlassWaveTriggers:(e,t,a,r)=>{for(let s of(au.enterStart=e,au.enterEnd=t,au.exitStart=a,au.exitEnd=r,aa))s.setWaveTriggers(e,t,a,r)},setStatGlassHoverStrength:e=>{for(let t of(au.hoverStrength=e,aa))t.setHoverStrength(e)},setStatGlassHoverRadius:e=>{for(let t of(au.hoverRadius=e,aa))t.setHoverRadius(e)},setStatGlassEmissiveIntensity:e=>{for(let t of(au.emissiveIntensity=e,aa))t.setEmissiveIntensity(e)},setStatGlassSheen:e=>{for(let t of(au.sheen=e,aa))t.setSheen(e)},setStatGlassSheenRoughness:e=>{for(let t of(au.sheenRoughness=e,aa))t.setSheenRoughness(e)},setStatGlassSheenColor:e=>{for(let t of(au.sheenColor=e,aa))t.setSheenColor(e)},setStatGlassBlendingMode:e=>{for(let t of(au.blendingMode=e,aa))t.setBlendingMode(e)},setStatGlassCausticIntensity:e=>{for(let t of(au.causticIntensity=e,aa))t.setCausticIntensity(e)},setStatGlassCausticScale:e=>{for(let t of(au.causticScale=e,aa))t.setCausticScale(e)},setStatGlassCausticSpeed:e=>{for(let t of(au.causticSpeed=e,aa))t.setCausticSpeed(e)},setStatGlassCausticColor:e=>{for(let t of(au.causticColor=e,aa))t.setCausticColor(e)},setStatGlassFresnelStrength:e=>{for(let t of(au.fresnelStrength=e,aa))t.setFresnelStrength(e)},setStatGlassFresnelPower:e=>{for(let t of(au.fresnelPower=e,aa))t.setFresnelPower(e)},setStatGlassFresnelColor:e=>{for(let t of(au.fresnelColor=e,aa))t.setFresnelColor(e)},setStatGlassFresnelInvert:e=>{for(let t of(au.fresnelInvert=e,aa))t.setFresnelInvert(e)},setStatGlassFresnelBlend:e=>{for(let t of(au.fresnelBlend=e,aa))t.setFresnelBlend(e)},setStatGlassCausticBlend:e=>{for(let t of(au.causticBlend=e,aa))t.setCausticBlendingMode(e)},setStatGlassHaloBlend:e=>{for(let t of(au.haloBlend=e,aa))t.setHaloBlendingMode(e)},setStatGlassBumpStrength:e=>{for(let t of(au.bumpStrength=e,aa))t.setBumpStrength(e)},setStatGlassBumpScale:e=>{for(let t of(au.bumpScale=e,aa))t.setBumpScale(e)},setStatGlassBumpDistortion:e=>{for(let t of(au.bumpDistortion=e,aa))t.setBumpDistortion(e)},setStatGlassVertexBumpStrength:e=>{for(let t of(au.vertexBumpStrength=e,aa))t.setVertexBumpStrength(e)},setStatGlassFrostStrength:e=>{for(let t of(au.frostStrength=e,aa))t.setFrostStrength(e)},setStatGlassOilStrength:e=>{for(let t of(au.oilStrength=e,aa))t.setOilStrength(e)},setStatGlassOilRadius:e=>{for(let t of(au.oilRadius=e,aa))t.setOilRadius(e)},setStatGlassOilScale:e=>{for(let t of(au.oilScale=e,aa))t.setOilScale(e)},setStatGlassOilSpeed:e=>{for(let t of(au.oilSpeed=e,aa))t.setOilSpeed(e)},setStatGlassOilColorA:e=>{for(let t of(au.oilColorA=e,aa))t.setOilColorA(e)},setStatGlassOilColorB:e=>{for(let t of(au.oilColorB=e,aa))t.setOilColorB(e)},setStatGlassTileOilStrength:e=>{for(let t of(au.tileOilStrength=e,aa))t.setTileOilStrength(e)},setStatGlassTileOilColorA:e=>{for(let t of(au.tileOilColorA=e,aa))t.setTileOilColorA(e)},setStatGlassTileOilColorB:e=>{for(let t of(au.tileOilColorB=e,aa))t.setTileOilColorB(e)},setStatGlassTileOilSpeed:e=>{for(let t of(au.tileOilSpeed=e,aa))t.setTileOilSpeed(e)},setStatGlassTileOilScale:e=>{for(let t of(au.tileOilScale=e,aa))t.setTileOilScale(e)},setStatGlassTileOilRadius:e=>{for(let t of(au.tileOilRadius=e,aa))t.setTileOilRadius(e)},setStatGlassTileTrailLife:e=>{for(let t of(au.tileTrailLife=e,aa))t.setTileTrailLife(e)},setStatGlassTileTrailTaper:e=>{for(let t of(au.tileTrailTaper=e,aa))t.setTileTrailTaper(e)},setStatGlassTileTrailBlur:e=>{for(let t of(au.tileTrailBlur=e,aa))t.setTileTrailBlur(e)},setStatGlassHoverScale:e=>{for(let t of(au.hoverScale=e,aa))t.setHoverScale(e)},setStatGlassMatcapStrength:e=>{for(let t of(au.matcapStrength=e,aa))t.setMatcapStrength(e)},setStatGlassMatcapAngle:e=>{for(let t of(au.matcapAngle=e,aa))t.setMatcapAngle(e)},setStatGlassMatcapElevation:e=>{for(let t of(au.matcapElevation=e,aa))t.setMatcapElevation(e)},setStatGlassMatcapSharpness:e=>{for(let t of(au.matcapSharpness=e,aa))t.setMatcapSharpness(e)},setStatGlassMatcapColor:e=>{for(let t of(au.matcapColor=e,aa))t.setMatcapColor(e)},setStatLabelAppearOffset:e=>{ai.appearOffset=e},setStatLabelDisappearOffset:e=>{ai.disappearOffset=e},setStatLabelSizeVw:e=>{for(let t of(ai.sizeVw=e,ao))t.el.style.fontSize=`${e}vw`},setProgressClickOffset:e=>{al.clickOffset=e;let t=e=>{let t=e+al.clickOffset;return(Z.z-t)/tB.speed},a=0;for(let e of tV){let r=t(e.z);r>a&&(a=r)}for(let e of(tZ.current=Math.max(a,1),tV)){let a=Math.max(0,Math.min(1,t(e.z)/tZ.current));e.el.style.left=`${100*a}%`}},setStatLabelPostGapEm:e=>{for(let t of(ai.postGapEm=e,ao))for(let a of Array.from(t.el.children))"DIV"===a.tagName&&(a.style.marginTop=`${e}em`)},setOilTaperPower:e=>{U.uOilTaperPower.value=e},setOilMaskNoise:e=>{U.uOilMaskNoise.value=e},setOilMaskNoiseScale:e=>{U.uOilMaskNoiseScale.value=e},setOilRingStrength:e=>{U.uOilRingStrength.value=e},setOilRingWidth:e=>{U.uOilRingWidth.value=e},setOilRingBlur:e=>{U.uOilRingBlur.value=e},setOilSpreadRate:e=>{U.uOilSpreadRate.value=e}};let J=new r.ShaderMaterial({vertexShader:y,fragmentShader:R,uniforms:U,side:r.DoubleSide,transparent:!0,depthWrite:!1}),j=new r.Mesh(Y,J);i.add(j);let q=new r.ShaderMaterial({vertexShader:`
        void main() { gl_Position = vec4(position.xy, 1.0, 1.0); }
      `,fragmentShader:`
        uniform vec3 uFogColor;
        uniform float uSurfaceDarken;
        void main() {
          // Match the surface's same darken curve so the horizon
          // edge stays seamless as the terrain fades to black.
          vec3 c = mix(
            uFogColor, vec3(0.0),
            clamp(uSurfaceDarken, 0.0, 1.0)
          );
          gl_FragColor = vec4(c, 1.0);
        }
      `,uniforms:{uFogColor:U.uFogColor,uSurfaceDarken:U.uSurfaceDarken},depthTest:!1,depthWrite:!1}),K=new r.PlaneGeometry(2,2),Q=new r.Mesh(K,q);Q.frustumCulled=!1,Q.renderOrder=-100,i.add(Q);let ee=Y.getAttribute("position"),et=ee.count,ea=new r.BufferGeometry;ea.setAttribute("position",ee);let er=new Float32Array(et);for(let e=0;e<et;e++)er[e]=Math.random();ea.setAttribute("aRandom",new r.BufferAttribute(er,1));let es={uNoiseScale:U.uNoiseScale,uDisplacement:U.uDisplacement,uTime:U.uTime,uFocusX:U.uFocusX,uFocusZ:U.uFocusZ,uWaveSpeed:U.uWaveSpeed,uWaveAmplitude:U.uWaveAmplitude,uWaveLength:U.uWaveLength,uWaveFalloff:U.uWaveFalloff,uPulseWidth:U.uPulseWidth,uClicks:U.uClicks,uHoverX:U.uHoverX,uHoverZ:U.uHoverZ,uHoverActive:U.uHoverActive,uHoverRadius:U.uHoverRadius,uHoverStrength:U.uHoverStrength,uBaseAmplitude:U.uBaseAmplitude,uBaseSpeed:U.uBaseSpeed,uBaseWavelength:U.uBaseWavelength,uScrollOffset:U.uScrollOffset,uIntro:U.uIntro,uIntroLinear:U.uIntroLinear,uCorridorWidth:U.uCorridorWidth,uCorridorHeight:U.uCorridorHeight,uCorridorSharpness:U.uCorridorSharpness,uParticleLift:{value:A.particleLift},uParticleSize:{value:A.particleSize},uParticleSizeJitter:{value:A.particleSizeJitter},uParticleXZJitter:{value:A.particleXZJitter},uParticleYJitter:{value:A.particleYJitter},uParticleColor:{value:B(A.particleColor)},uParticleColorFar:{value:B(A.pTunnelColorFar)},uParticleHoverColor:{value:B(A.particleHoverColor)},uParticleHoverStrength:{value:A.particleHoverStrength},uParticleGradStart:{value:A.pTunnelGradStart},uParticleGradEnd:{value:A.pTunnelGradEnd},uParticleOpacity:{value:A.particleOpacity},uFogInner:U.uFogInner,uFogOuter:U.uFogOuter,uPWaveBoost:{value:A.pWaveOn?A.pWaveBoost:0},uPWaveSpeed:{value:A.pWaveSpeed},uPWavePeriod:{value:A.pWavePeriod},uPWaveWidth:{value:A.pWaveWidth},uCameraZ:{value:0},uParticleZRange:{value:60},uTunnelProgress:{value:0},uTunnelRadius:{value:A.pTunnelRadius},uTunnelCenterX:{value:0},uTunnelCenterY:{value:A.pTunnelCenterY},uTunnelScatter:{value:A.pTunnelScatter},uTunnelSpiralTurns:{value:A.pTunnelSpiralTurns},uTunnelSpiralPitch:{value:A.pTunnelSpiralPitch},uTunnelRotSpeed:{value:A.pTunnelRotSpeed},uTunnelWiggle:{value:A.tunnelWiggle},uTunnelPulseSpeed:{value:A.tunnelPulseSpeed},uTunnelPulseWidth:{value:A.tunnelPulseWidth},uTunnelPulseBoost:{value:A.tunnelPulseBoost},uTunnelPulsePeriod:{value:A.tunnelPulsePeriod},uTunnelBreathAmp:{value:A.tunnelBreathAmp},uTunnelBreathSpeed:{value:A.tunnelBreathSpeed},uTunnelDriftSpeed:{value:A.tunnelDriftSpeed},uCursorNDC:{value:new r.Vector2(0,0)},uHoverNActive:{value:0},uHoverNRadius:{value:A.statHoverRadius},uHoverNScale:{value:A.statHoverScale},uHoverNRepel:{value:A.statHoverRepel},uHoverNGlow:{value:A.statHoverGlow},uHoverNGlowColor:{value:new r.Color(A.statHoverGlowColor)},uPassIndex:{value:0},uPLightDir:{value:new r.Vector3(A.pLightDirX,A.pLightDirY,A.pLightDirZ).normalize()},uPAmbient:{value:A.pAmbient},uPDiffuse:{value:A.pDiffuse},uPSpec:{value:A.pSpec},uPSpecPower:{value:A.pSpecPower}},eo=new r.ShaderMaterial({vertexShader:w,fragmentShader:T,uniforms:es,transparent:!0,depthWrite:!1,blending:r.NormalBlending}),ei=new r.Points(ea,eo);ei.visible=A.particlesOn,ei.frustumCulled=!1,i.add(ei);let el=e=>{let t={...es,uPassIndex:{value:e},uParticleOpacity:{value:0}},a=new r.ShaderMaterial({vertexShader:w,fragmentShader:T,uniforms:t,transparent:!0,depthWrite:!1,blending:r.NormalBlending}),s=new r.Points(ea,a);return s.visible=!1,s.frustumCulled=!1,i.add(s),{mesh:s,material:a}},en=[el(1),el(2)],eu=new r.WebGLRenderTarget(1024,1024,{minFilter:r.LinearFilter,magFilter:r.LinearFilter,depthBuffer:!1,stencilBuffer:!1});U.uLightMap.value=eu.texture,U.uLightMapWorldMin.value.set(-30,-30),U.uLightMapWorldMax.value.set(30,30);let ec=new r.OrthographicCamera(-30,30,30,-30,.1,20);ec.position.set(0,5,0),ec.up.set(0,0,-1),ec.lookAt(0,0,0),ec.layers.set(1);let ef={uParticleColor:es.uParticleColor,uParticleXZJitter:es.uParticleXZJitter,uEmissionSize:{value:A.emissionSize}},ed=new r.ShaderMaterial({vertexShader:b,fragmentShader:P,uniforms:ef,transparent:!0,depthTest:!1,depthWrite:!1,blending:r.AdditiveBlending}),ep=new r.Points(ea,ed);ep.layers.set(1),ep.frustumCulled=!1,i.add(ep);let ev={uNoiseScale:U.uNoiseScale,uDisplacement:U.uDisplacement,uTime:U.uTime,uFocusX:U.uFocusX,uFocusZ:U.uFocusZ,uWaveSpeed:U.uWaveSpeed,uWaveAmplitude:U.uWaveAmplitude,uWaveLength:U.uWaveLength,uWaveFalloff:U.uWaveFalloff,uPulseWidth:U.uPulseWidth,uBaseAmplitude:U.uBaseAmplitude,uBaseSpeed:U.uBaseSpeed,uBaseWavelength:U.uBaseWavelength,uClicks:U.uClicks,uHoverX:U.uHoverX,uHoverZ:U.uHoverZ,uHoverActive:U.uHoverActive,uHoverRadius:U.uHoverRadius,uHoverStrength:U.uHoverStrength,uScrollOffset:U.uScrollOffset,uIntro:U.uIntro,uCorridorWidth:U.uCorridorWidth,uCorridorHeight:U.uCorridorHeight,uCorridorSharpness:U.uCorridorSharpness,uFogInner:U.uFogInner,uFogOuter:U.uFogOuter,uWireColor:{value:B(A.wireColor)},uWireThickness:{value:A.wireThickness},uWireOpacity:{value:A.wireOpacity},uWireDensity:{value:A.wireDensity},uGlowSpread:{value:A.glowSpread},uGlowStrength:{value:A.glowStrength},uRevealRadius:{value:A.revealRadius},uRevealBlur:{value:A.revealBlur},uRevealNoiseScale:{value:A.revealNoiseScale},uRevealNoiseStrength:{value:A.revealNoiseStrength},uContourSpacing:{value:A.contourSpacing}},em=new r.ShaderMaterial({vertexShader:x,fragmentShader:C,uniforms:ev,transparent:!0,depthWrite:!1,side:r.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),eh=new r.Mesh(Y,em);eh.visible=A.wireOn,i.add(eh);let eS=new r.WebGLRenderTarget(512,512,{minFilter:r.LinearFilter,magFilter:r.LinearFilter,wrapS:r.ClampToEdgeWrapping,wrapT:r.ClampToEdgeWrapping,depthBuffer:!1,stencilBuffer:!1});U.uCausticsTex.value=eS.texture,U.uCausticsWorldMin.value.set(-30,-30),U.uCausticsWorldMax.value.set(30,30);let eg=new r.Scene,ey=new r.Camera,ew={uTime:U.uTime,uCausticsScale:U.uCausticsScale,uCausticsSpeed:U.uCausticsSpeed,uCausticsContrast:U.uCausticsContrast,uCausticsWorldMin:U.uCausticsWorldMin,uCausticsWorldMax:U.uCausticsWorldMax,uScrollOffset:U.uScrollOffset},ex=new r.ShaderMaterial({vertexShader:G,fragmentShader:W,uniforms:ew,depthTest:!1,depthWrite:!1}),eC=new r.PlaneGeometry(2,2),eT=new r.Mesh(eC,ex);eT.frustumCulled=!1,eg.add(eT);let eR={minFilter:r.LinearFilter,magFilter:r.LinearFilter,wrapS:r.ClampToEdgeWrapping,wrapT:r.ClampToEdgeWrapping,depthBuffer:!1,stencilBuffer:!1,type:r.HalfFloatType},eb=new r.WebGLRenderTarget(1536,1536,eR),eP=new r.WebGLRenderTarget(1536,1536,eR),eO=new r.Vector2(-90,-90),eE=new r.Vector2(90,90);U.uOilTex.value=eb.texture,U.uOilWorldMin.value.copy(eO),U.uOilWorldMax.value.copy(eE);let eM=new r.Scene,eF=new r.Camera,eG={uPrevTex:{value:eb.texture},uTexel:{value:new r.Vector2(6510416666666666e-19,6510416666666666e-19)},uDecay:{value:A.oilDecay},uBlur:{value:A.oilBlur},uSplatActive:{value:0},uSplatPos:{value:new r.Vector2(0,0)},uSplatPosPrev:{value:new r.Vector2(0,0)},uSplatHasPrev:{value:0},uSplatRadius:{value:A.oilRevealRadius},uSplatStrength:{value:A.oilSplatStrength},uWorldMin:{value:eO},uWorldMax:{value:eE},uEdgeDarken:{value:A.oilEdgeDarken},uWaterSpread:{value:A.oilWaterSpread},uPigmentDiff:{value:A.oilPigmentDiff}},eW=new r.ShaderMaterial({vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,fragmentShader:`
        // Watercolor-bleed simulation. Stored channels (RG):
        //   .r = pigment density (the visible silhouette).
        //   .g = "water" front — leads the pigment outward so the
        //         bleed has a wet halo expanding ahead of the
        //         visible mark, then drying back as decay catches
        //         up. Pigment migrates toward the wet front and
        //         settles at its edge (the edge-darkening that
        //         makes watercolor look like watercolor).
        uniform sampler2D uPrevTex;
        uniform vec2 uTexel;
        uniform float uDecay;
        uniform float uBlur;
        uniform float uSplatActive;
        uniform vec2 uSplatPos;
        uniform vec2 uSplatPosPrev;
        uniform float uSplatHasPrev;
        uniform float uSplatRadius;
        uniform float uSplatStrength;
        uniform vec2 uWorldMin;
        uniform vec2 uWorldMax;
        uniform float uEdgeDarken;
        uniform float uWaterSpread;
        uniform float uPigmentDiff;
        varying vec2 vUv;
        void main() {
          vec2 o = uTexel * max(uBlur, 0.0);
          // 4 neighbors of pigment + water.
          vec4 cN  = texture2D(uPrevTex, vUv);
          vec4 nN  = texture2D(uPrevTex, vUv + vec2(0.0, o.y));
          vec4 sN  = texture2D(uPrevTex, vUv - vec2(0.0, o.y));
          vec4 eN  = texture2D(uPrevTex, vUv + vec2(o.x, 0.0));
          vec4 wN  = texture2D(uPrevTex, vUv - vec2(o.x, 0.0));
          float pC = cN.r; float wC = cN.g;
          float pAvg = (nN.r + sN.r + eN.r + wN.r) * 0.25;
          float wAvg = (nN.g + sN.g + eN.g + wN.g) * 0.25;
          // Laplacian diffusion: each cell moves toward its
          // neighbours' average. Water diffuses faster than
          // pigment — that's what creates the wet halo running
          // out ahead of the visible mark.
          float pigment = pC + (pAvg - pC) * uPigmentDiff;
          float water   = wC + (wAvg - wC) * uWaterSpread;
          // Edge darkening — pigment migrates TOWARD the
          // wet-front gradient: where water is present but
          // pigment is thinner, push some pigment in. Settles at
          // the boundary as the water dries (decay), leaving a
          // darker rim. Classic watercolor.
          float wGrad = max(0.0, water - pigment);
          pigment += wGrad * uEdgeDarken;
          // Evaporation / drying.
          pigment *= uDecay;
          water   *= uDecay * 0.985;
          // Line-segment splat between previous and current
          // cursor world XZ. MAX (not ADD) so a held cursor
          // doesn't saturate. Closest point on the segment is
          // computed in WORLD units; gaussian falls off by
          // world-space distance. Fast cursor motion leaves a
          // continuous trail with no gaps.
          if (uSplatActive > 0.5) {
            vec2 range = uWorldMax - uWorldMin;
            vec2 fragWorld = uWorldMin + vUv * range;
            vec2 pCur = uSplatPos;
            vec2 pPrev = uSplatHasPrev > 0.5 ? uSplatPosPrev : pCur;
            vec2 segVec = pCur - pPrev;
            float segLen2 = dot(segVec, segVec);
            float h = segLen2 > 0.000001
              ? clamp(dot(fragWorld - pPrev, segVec) / segLen2,
                  0.0, 1.0)
              : 0.0;
            vec2 closest = pPrev + segVec * h;
            vec2 d = fragWorld - closest;
            float r = max(uSplatRadius, 0.0001);
            float g = exp(-dot(d, d) / (r * r));
            float stampP = g * uSplatStrength;
            float gw = exp(-dot(d, d) / (r * r * 2.25));
            float stampW = gw * uSplatStrength * 1.1;
            pigment = max(pigment, stampP);
            water   = max(water,   stampW);
          }
          gl_FragColor = vec4(pigment, water, 0.0, 1.0);
        }
      `,uniforms:eG,depthTest:!1,depthWrite:!1}),eB=new r.PlaneGeometry(2,2),eD=new r.Mesh(eB,eW);eD.frustumCulled=!1,eM.add(eD);let ez=new r.CylinderGeometry(A.pTunnelRadius,A.pTunnelRadius,80,384,512,!0);ez.rotateX(Math.PI/2);let eA={uTunnelProgress:es.uTunnelProgress,uWireColor:{value:new r.Color(0xffffff)},uGridU:{value:48},uGridV:{value:24},uLineWidth:{value:.004},uLineSoftness:{value:5e-4},uWireOpacity:{value:.6},uTwist:{value:0},uFogStart:{value:20},uFogEnd:{value:40},uFogNearStart:{value:5},uFogNearEnd:{value:0},uCameraZ:{value:0},uCylLen:{value:80},uReveal:{value:0},uRevealEdge:{value:6},uTime:U.uTime,uRotSpeed:{value:A.cylWireRotSpeed},uHoverPos:{value:new r.Vector3},uHoverActivity:{value:0},uHoverRadius:{value:A.cylWireHoverRadius},uHoverStrength:{value:A.cylWireHoverStrength},uNoiseAmp:{value:.06},uNoiseScale:{value:.45},uNoiseSpeed:{value:.35}},eH=new r.ShaderMaterial({uniforms:eA,transparent:!0,depthWrite:!1,side:r.BackSide,vertexShader:`
        ${h}
        uniform vec3 uHoverPos;
        uniform float uHoverActivity;
        uniform float uHoverRadius;
        uniform float uHoverStrength;
        uniform float uTime;
        uniform float uNoiseAmp;
        uniform float uNoiseScale;
        uniform float uNoiseSpeed;
        varying vec2 vUv;
        varying float vWorldZ;
        void main() {
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          // Radial direction from tunnel axis (axis runs along
          // world Z through the mesh origin) outward to this
          // vertex. Used to push lines outward at the cursor.
          vec3 meshO = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
          vec2 radialXY = wp.xy - meshO.xy;
          float rLen = length(radialXY);
          vec3 radialDir = rLen > 0.0001
            ? vec3(radialXY / rLen, 0.0)
            : vec3(0.0);
          // Noise deformation — sample simplex in (angle, world Z)
          // so it tiles cleanly around the tube and walks along
          // its length with time. Pushes vertices radially in /
          // out, decoupled from the hover effect.
          float ang = atan(radialXY.y, radialXY.x);
          float t = uTime * uNoiseSpeed;
          vec2 nUv = vec2(
            ang * 1.6 + t * 0.7,
            wp.z * uNoiseScale - t
          );
          float n = snoise(nUv) * 0.7
            + snoise(nUv * 2.3 + vec2(11.0, 5.0)) * 0.3;
          wp.xyz += radialDir * n * uNoiseAmp;
          float d = distance(wp.xyz, uHoverPos);
          float r = max(uHoverRadius, 0.0001);
          float bell = exp(-(d * d) / (r * r));
          wp.xyz += radialDir
            * (uHoverStrength * uHoverActivity * bell);
          vWorldZ = wp.z;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,fragmentShader:`
        uniform float uTunnelProgress;
        uniform vec3 uWireColor;
        uniform float uGridU;
        uniform float uGridV;
        uniform float uLineWidth;
        uniform float uLineSoftness;
        uniform float uWireOpacity;
        uniform float uTwist;
        uniform float uFogStart;
        uniform float uFogEnd;
        uniform float uFogNearStart;
        uniform float uFogNearEnd;
        uniform float uCameraZ;
        uniform float uCylLen;
        uniform float uReveal;
        uniform float uRevealEdge;
        uniform float uTime;
        uniform float uRotSpeed;
        varying vec2 vUv;
        varying float vWorldZ;
        void main() {
          float cylActive = smoothstep(0.92, 1.0, uTunnelProgress);
          if (cylActive < 0.001) discard;
          // V coordinate is anchored to WORLD Z (not the mesh
          // UV) so the rings stay put in space and appear to
          // slide past the camera as it flies forward. Line
          // density still controlled by uGridV (lines per
          // CYL_LENGTH world units).
          float worldV = vWorldZ * (uGridV / max(uCylLen, 0.001));
          // Twist offsets U as a function of world V. Time
          // term spins the spiral in the same direction as the
          // particle tunnel (uRotSpeed is shared). vUv.x ∈ [0,1]
          // wraps the cylinder, so 1.0 of U = 2π radians.
          float rot = uTime * uRotSpeed / 6.2831853;
          float uTwisted =
            (vUv.x + rot) * uGridU + worldV * uTwist;
          // Spiral only — distance to the nearest twisted-U
          // line. Ring axis (worldV) intentionally skipped so
          // the wireframe is pure spirals, no cross hatch.
          float f = fract(uTwisted) - 0.5;
          float dist = abs(f);
          float soft = max(uLineSoftness, 0.00001);
          float line = 1.0 - smoothstep(
            uLineWidth, uLineWidth + soft, dist);
          if (line < 0.001) discard;
          // Distance from camera along world Z. Two fades:
          // far cuts at uFogStart..uFogEnd, near cuts close
          // to camera at uFogNearEnd..uFogNearStart.
          float dz = abs(vWorldZ - uCameraZ);
          float farFog = 1.0 - smoothstep(uFogStart, uFogEnd, dz);
          float nearFog = smoothstep(uFogNearEnd, uFogNearStart, dz);
          float fog = farFog * nearFog;
          // Wipe — reveal sweeps outward from camera as uReveal
          // ramps 0→1. Lines appear at the camera first and
          // extend forward/backward symmetrically.
          float revealDist = uReveal * (uCylLen * 0.5 + uRevealEdge);
          float wipe = 1.0 - smoothstep(
            revealDist - uRevealEdge, revealDist, dz);
          float a = line * uWireOpacity * cylActive * fog * wipe;
          if (a < 0.001) discard;
          gl_FragColor = vec4(uWireColor, a);
        }
      `}),eL=new r.Mesh(ez,eH);eL.frustumCulled=!1,eL.visible=!1,i.add(eL);let eN=new r.CylinderGeometry(A.pTunnelRadius,A.pTunnelRadius,80,256,384,!0);eN.rotateX(Math.PI/2);let ek={uTime:U.uTime,uTunnelProgress:es.uTunnelProgress,uCylLen:{value:80},uColor:{value:new r.Color(A.noiseTunColor)},uScale:{value:A.noiseTunScale},uDeform:{value:A.noiseTunDeform},uOpacity:{value:A.noiseTunOpacity},uSpeed:{value:A.noiseTunSpeed},uRotSpeed:{value:A.noiseTunRotSpeed},uCameraZ:{value:0},uFogNearStart:{value:4},uFogNearEnd:{value:1.5},uFogFarStart:{value:22},uFogFarEnd:{value:34},uRevealDist:{value:0},uRevealEdge:{value:4}},eI=new r.ShaderMaterial({uniforms:ek,transparent:!0,depthWrite:!1,side:r.BackSide,vertexShader:`
        ${h}
        uniform float uTime;
        uniform float uCylLen;
        uniform float uScale;
        uniform float uDeform;
        uniform float uSpeed;
        uniform float uRotSpeed;
        varying vec2 vUv;
        varying float vN;
        varying float vWorldZ;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vec3 meshO = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
          vec2 rXY = wp.xy - meshO.xy;
          float rLen = length(rXY);
          vec2 unit = rLen > 0.0001 ? rXY / rLen : vec2(1.0, 0.0);
          // Rotate the SAMPLED unit vector by uTime*uRotSpeed —
          // texture spins around the tube axis without moving
          // the mesh itself. Same scheme particle / wire
          // shaders use via their own rotSpeed.
          float rotAng = uTime * uRotSpeed;
          float cr = cos(rotAng), sr = sin(rotAng);
          vec2 rotUnit = vec2(
            unit.x * cr - unit.y * sr,
            unit.x * sr + unit.y * cr);
          float worldV = wp.z * (1.0 / max(uCylLen, 0.001));
          float k = max(uScale, 0.0001);
          float t = worldV * 40.0 - uTime * uSpeed;
          float n1 = snoise(vec2(rotUnit.x * k * 2.0, t));
          float n2 = snoise(vec2(rotUnit.y * k * 2.0, t + 17.0));
          float n3 = snoise(vec2(rotUnit.x * k * 4.2, t * 1.3 - 9.0)) * 0.5;
          float n4 = snoise(vec2(rotUnit.y * k * 4.2, t * 1.3 + 5.0)) * 0.5;
          float n = (n1 + n2 + n3 + n4) / 3.0;
          vN = n * 0.5 + 0.5;
          vec3 radialDir = vec3(unit, 0.0);
          wp.xyz += radialDir * n * uDeform;
          vWorldZ = wp.z;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,fragmentShader:`
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uTunnelProgress;
        uniform float uCameraZ;
        uniform float uFogNearStart;
        uniform float uFogNearEnd;
        uniform float uFogFarStart;
        uniform float uFogFarEnd;
        uniform float uRevealDist;
        uniform float uRevealEdge;
        varying vec2 vUv;
        varying float vN;
        varying float vWorldZ;
        void main() {
          float cylActive = smoothstep(0.92, 1.0, uTunnelProgress);
          if (cylActive < 0.001) discard;
          float dz = abs(vWorldZ - uCameraZ);
          // Near + far fog windows.
          float farFog =
            smoothstep(uFogFarStart, uFogFarEnd, dz);
          float nearFog = 1.0 -
            smoothstep(uFogNearEnd, uFogNearStart, dz);
          float visible = (1.0 - farFog) * (1.0 - nearFog);
          // Wave reveal — visible where dz > uRevealDist. Front
          // starts at the far end (uRevealDist = max) and walks
          // inward toward the camera (uRevealDist → 0), so the
          // texture appears first at the hole and floods toward
          // the viewer.
          float reveal =
            smoothstep(
              uRevealDist - uRevealEdge,
              uRevealDist + uRevealEdge,
              dz);
          float a = vN * uOpacity * cylActive * visible * reveal;
          if (a < 0.002) discard;
          gl_FragColor = vec4(uColor * (0.6 + vN * 0.6), a);
        }
      `}),eZ=new r.Mesh(eN,eI);eZ.frustumCulled=!1,eZ.visible=!1,i.add(eZ);let eV={current:A.noiseTunOn},eY={current:A.noiseTunSize},eX={current:-1},eU=44,e_=new r.BufferGeometry,e$=A.dustCount,eJ=new Float32Array(3*e$),ej=new Float32Array(e$),eq=new Float32Array(e$);for(let e=0;e<e$;e++){let t=Math.sqrt(Math.random())*A.dustSpawnRadius,a=Math.random()*Math.PI*2;eJ[3*e]=Math.cos(a)*t,eJ[3*e+1]=0,eJ[3*e+2]=Math.sin(a)*t,ej[e]=Math.random(),eq[e]=Math.random()}e_.setAttribute("position",new r.BufferAttribute(eJ,3)),e_.setAttribute("aSeed",new r.BufferAttribute(ej,1)),e_.setAttribute("aPhase",new r.BufferAttribute(eq,1));let eK={uNoiseScale:U.uNoiseScale,uDisplacement:U.uDisplacement,uTime:U.uTime,uFocusX:U.uFocusX,uFocusZ:U.uFocusZ,uWaveSpeed:U.uWaveSpeed,uWaveAmplitude:U.uWaveAmplitude,uWaveLength:U.uWaveLength,uWaveFalloff:U.uWaveFalloff,uPulseWidth:U.uPulseWidth,uClicks:U.uClicks,uHoverX:U.uHoverX,uHoverZ:U.uHoverZ,uHoverActive:U.uHoverActive,uHoverRadius:U.uHoverRadius,uHoverStrength:U.uHoverStrength,uBaseAmplitude:U.uBaseAmplitude,uBaseSpeed:U.uBaseSpeed,uBaseWavelength:U.uBaseWavelength,uScrollOffset:U.uScrollOffset,uIntro:U.uIntro,uIntroLinear:U.uIntroLinear,uCorridorWidth:U.uCorridorWidth,uCorridorHeight:U.uCorridorHeight,uCorridorSharpness:U.uCorridorSharpness,uFogInner:U.uFogInner,uFogOuter:U.uFogOuter,uDustColor:{value:B(A.dustColor)},uDustOpacity:{value:A.dustOn?A.dustOpacity:0},uDustSize:{value:A.dustSize},uDustSizeJitter:{value:A.dustSizeJitter},uDustSpeed:{value:A.dustSpeed},uDustRise:{value:A.dustRise},uDustWander:{value:A.dustWander},uCameraZ:{value:0},uDustZRange:{value:32},uTunnelProgress:es.uTunnelProgress,uTunnelCenterY:es.uTunnelCenterY,uDustForwardSpeed:{value:A.dustForwardSpeed},uDustTunnelYSpread:{value:A.dustTunnelYSpread}},eQ=new r.ShaderMaterial({vertexShader:O,fragmentShader:E,uniforms:eK,transparent:!0,depthWrite:!1,blending:r.NormalBlending}),e0=new r.Points(e_,eQ);e0.frustumCulled=!1,e0.visible=A.dustOn,i.add(e0);let e1=Math.max(1,t.clientWidth),e2=Math.max(1,t.clientHeight),e3=e.getPixelRatio(),e5=new r.WebGLRenderTarget(Math.floor(e1*e3),Math.floor(e2*e3),{minFilter:r.LinearFilter,magFilter:r.LinearFilter,depthBuffer:!0,stencilBuffer:!1}),e4=new r.Scene,e6=new r.Camera,e8={tDiffuse:{value:e5.texture},uCA:{value:A.postOn?A.postCA:0},uLens:{value:A.postOn?A.postLens:0}},e9=new r.ShaderMaterial({vertexShader:M,fragmentShader:F,uniforms:e8,depthTest:!1,depthWrite:!1}),e7=new r.PlaneGeometry(2,2),te=new r.Mesh(e7,e9);te.frustumCulled=!1,e4.add(te);let tt=a?.025:.05,ta=a?.01:.05,tr=0,ts=0,to=0,ti=0,tl=new r.Raycaster,tn=new r.Raycaster,tu=new r.Vector2,tc={activity:0,vActivity:0,hitX:0,hitY:0,hitZ:0,ndcX:0,ndcY:0,vNdcX:0,vNdcY:0},tf=new r.Vector2,td=new r.Plane(new r.Vector3(0,1,0),0),tp=new r.Vector3,tv=e=>{let a=t.getBoundingClientRect();return(tf.x=(e.clientX-a.left)/a.width*2-1,tf.y=-((e.clientY-a.top)/a.height*2-1),tl.setFromCamera(tf,I),tl.ray.intersectPlane(td,tp))?{x:tp.x,z:tp.z}:null},tm=0,th=0,tS=0,tg=!1,ty=0,tw=0,tx=0,tC=0,tT=0,tR=0,tb=!1,tP={current:0},tO={current:0},tE={current:0},tM=!1,tF=0,tG=0,tW={current:A.hoverEasing},tB={on:A.scrollOn,speed:A.scrollSpeed,rotateX:A.scrollRotateX,rotateY:A.scrollRotateY,rotateZ:A.scrollRotateZ,zoom:A.scrollZoom},tD={current:0},tz={current:0},tA={current:0},tH={current:0},tL={current:0},tN={current:0},tk={current:A.focusZ},tI=new r.Vector3,tZ={current:1},tV=[],tY={current:!1},tX={current:0},tU={current:!1},t_={current:0},t$=e=>{let a=t.getBoundingClientRect(),r=(e.clientX-a.left)/a.width*2-1,s=(e.clientY-a.top)/a.height*2-1;ts=.18*r,tr=-(.08*s),ag.x=r,ag.y=-s,ag.active=1,N.current.x=e.clientX,N.current.y=e.clientY,N.current.active=!0;let o=tv(e);if(o){ty=o.x,tw=o.z,tx=1;let t=performance.now()/1e3;if(tb){let a=Math.max(t-tR,1/240),r=Math.hypot(e.clientX-tC,e.clientY-tT)/a;tP.current=.55*tP.current+.45*r}tC=e.clientX,tT=e.clientY,tR=t,tb=!0;let a=o.x-th,r=o.z-tS;if(!tg||a*a+r*r>.0025){let e=U.uOilTrail.value;for(let t=e.length-1;t>0;t--)e[t].copy(e[t-1]);e[0].set(o.x,o.z,U.uTime.value,0);let t=0;for(let a=1;a<e.length;a++){let r=e[a-1],s=e[a];if(s.z<0){s.w=r.w;continue}let o=s.x-r.x,i=s.y-r.y;s.w=r.w+Math.sqrt(o*o+i*i),s.w>t&&(t=s.w)}U.uOilMaxArc.value=Math.max(t,1e-4),th=o.x,tS=o.z,tg=!0}}else tx=0},tJ=()=>{tr=0,ts=0,tx=0,ag.active=0,N.current.active=!1,tb=!1,tP.current=0},tj=0,tq=0,tK=null,tQ=e=>{tj=e.clientX,tq=e.clientY,tK=e},t0=e=>{if(!tK)return;let t=Math.hypot(e.clientX-tj,e.clientY-tq),a=tK;if(tK=null,t>10)return;let r=tv(a);r&&(U.uClicks.value[tm].set(r.x,r.z,U.uTime.value),tm=(tm+1)%U.uClicks.value.length)},t1=e=>{tB.on&&(e.preventDefault(),tz.current=Math.max(0,tz.current+e.deltaY))},t2=a?t.closest("[data-scene-pointer-host]")??t:t;t2.addEventListener("pointermove",t$),t2.addEventListener("pointerleave",tJ),t2.addEventListener("pointerdown",tQ),t2.addEventListener("pointerup",t0),t2.addEventListener("pointercancel",()=>{tK=null}),a||window.addEventListener("wheel",t1,{passive:!1});let t3=!1,t5=0,t4=e=>{(0===e.button||"touch"===e.pointerType)&&(t3=!0,t5=e.clientY)},t6=e=>{if(!t3||!tB.on)return;let t=t5-e.clientY;t5=e.clientY;let a="touch"===e.pointerType?4:1;tz.current=Math.max(0,tz.current+t*a)},t8=()=>{t3=!1};a||(window.addEventListener("pointerdown",t4),window.addEventListener("pointermove",t6),window.addEventListener("pointerup",t8),window.addEventListener("pointercancel",t8));let t9=()=>{tY.current=!0,tX.current=performance.now(),tU.current=!1},t7=()=>{tY.current&&(tU.current=!0,t_.current=performance.now(),tY.current=!1)};window.addEventListener("in-review:intro-done",t9),window.addEventListener("in-review:intro-back",t7);let ae=a?-1:performance.now(),at=[],aa=[],ar={triggerStartCamZ:A.pTunnelTriggerStartCamZ_v2,triggerEndCamZ:A.pTunnelTriggerEndCamZ_v2,surfaceDarkenMax:A.pTunnelSurfaceDarkenMax,centerYOffset:0},as={phase1AppearCamZ:A.outroPhase1AppearCamZ_v4,phaseSplitCamZ:A.outroPhaseSplitCamZ_v4,buttonAppearCamZ:A.outroButtonAppearCamZ_v4,phase1HoldMs:A.outroPhase1HoldMs,magnetRadius:A.outroButtonMagnetRadius,magnetStrength:A.outroButtonMagnetStrength},ao=[],ai={texts:[A.statLabelText0,A.statLabelText1,A.statLabelText2,A.statLabelText3],supers:[A.statLabelSuper0,A.statLabelSuper1,A.statLabelSuper2,A.statLabelSuper3],appearOffset:A.statLabelAppearOffset,disappearOffset:A.statLabelDisappearOffset,sizeVw:A.statLabelSizeVw,supColor:A.statLabelSupColor,postGapEm:A.statLabelPostGapEm},al={clickOffset:A.progressClickOffset};ai.texts.push("Top maker"),ai.supers.push("");let an={rectWidth:A.statVideoRectWidth,aspect:A.statVideoAspect,yOffset:A.statVideoYOffset,particleSize:A.statVideoParticleSize,particleCount:A.statVideoParticleCount,frameColor:A.statVideoFrameColor,frameThickness:A.statVideoFrameThickness,cornerRadius:A.statVideoCornerRadius},au={depth:A.statGlassDepth,yBase:A.statGlassYBase,ior:A.statGlassIor,transmission:A.statGlassTransmission,roughness:A.statGlassRoughness,metalness:A.statGlassMetalness,thickness:A.statGlassThickness,clearcoat:A.statGlassClearcoat,clearcoatRoughness:A.statGlassClearcoatRoughness,attenuationColor:A.statGlassAttenuationColor,reflectivity:A.statGlassReflectivity,dispersion:A.statGlassDispersion,cornerRadius:A.statGlassCornerRadius,videoRadius:A.statGlassVideoRadius,iridescence:A.statGlassIridescence,iridescenceIor:A.statGlassIridescenceIor,haloColor:A.statGlassHaloColor,haloStrength:A.statGlassHaloStrength,haloSize:A.statGlassHaloSize,initRotX:A.statGlassInitRotX,initRotY:A.statGlassInitRotY,initRotZ:A.statGlassInitRotZ,initScale:A.statGlassInitScale,exitRotX:A.statGlassExitRotX,exitRotY:A.statGlassExitRotY,exitRotZ:A.statGlassExitRotZ,tilesX:A.statGlassTilesX,tilesY:A.statGlassTilesY,tileGap:A.statGlassTileGap,enterStart:A.statGlassEnterStart,enterEnd:A.statGlassEnterEnd,exitStart:A.statGlassExitStart,exitEnd:A.statGlassExitEnd,hoverStrength:A.statGlassHoverStrength,hoverRadius:A.statGlassHoverRadius,hoverScale:A.statGlassHoverScale,emissiveIntensity:A.statGlassEmissiveIntensity,sheen:A.statGlassSheen,sheenRoughness:A.statGlassSheenRoughness,sheenColor:A.statGlassSheenColor,blendingMode:A.statGlassBlendingMode,causticIntensity:A.statGlassCausticIntensity,causticScale:A.statGlassCausticScale,causticSpeed:A.statGlassCausticSpeed,causticColor:A.statGlassCausticColor,fresnelStrength:A.statGlassFresnelStrength,fresnelPower:A.statGlassFresnelPower,fresnelColor:A.statGlassFresnelColor,fresnelInvert:A.statGlassFresnelInvert,fresnelBlend:A.statGlassFresnelBlend,causticBlend:A.statGlassCausticBlend,haloBlend:A.statGlassHaloBlend,bumpStrength:A.statGlassBumpStrength,bumpScale:A.statGlassBumpScale,bumpDistortion:A.statGlassBumpDistortion,vertexBumpStrength:A.statGlassVertexBumpStrength,frostStrength:A.statGlassFrostStrength,oilStrength:A.statGlassOilStrength,oilRadius:A.statGlassOilRadius,oilScale:A.statGlassOilScale,oilSpeed:A.statGlassOilSpeed,oilColorA:A.statGlassOilColorA,oilColorB:A.statGlassOilColorB,tileOilStrength:A.statGlassTileOilStrength,tileOilColorA:A.statGlassTileOilColorA,tileOilColorB:A.statGlassTileOilColorB,tileOilSpeed:A.statGlassTileOilSpeed,tileOilScale:A.statGlassTileOilScale,tileOilRadius:A.statGlassTileOilRadius,tileTrailLife:A.statGlassTileTrailLife,tileTrailTaper:A.statGlassTileTrailTaper,tileTrailBlur:A.statGlassTileTrailBlur,matcapStrength:A.statGlassMatcapStrength,matcapAngle:A.statGlassMatcapAngle,matcapElevation:A.statGlassMatcapElevation,matcapSharpness:A.statGlassMatcapSharpness,matcapColor:A.statGlassMatcapColor},ac=[],af=e=>{let t=ai.supers[e]?.trim()??"";return t.length>0?t:ac[e]??""},ad=(e,t,a,r,s)=>{e.el.innerHTML="",e.chars=[],e.supChars=[],e.sup=null;let o=(r??"").trim(),i=0;if(o.length>0){let t=document.createElement("div");t.className="in-review-pre-label",t.style.display="block",t.style.fontSize="18px",t.style.textTransform="uppercase",t.style.letterSpacing="0.02em",t.style.marginBottom=window.matchMedia("(max-width: 768px)").matches?"0.6em":"56px",t.style.lineHeight="1",t.style.color=ai.supColor;let a=Array.from(o);for(let r=0;r<a.length;r++){let s=a[r],o=document.createElement("span");o.style.display="inline-block",o.style.overflow="hidden",o.style.verticalAlign="bottom",o.style.lineHeight="1",o.style.paddingBottom="0.22em",o.style.marginBottom="-0.22em";let i=document.createElement("span");i.style.display="inline-block",i.style.transform=e.revealed?"translateY(0)":"translateY(110%)",i.style.opacity=e.revealed?"1":"0",i.style.transition=`transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${35*r}ms, opacity 700ms ease ${35*r}ms`,i.textContent=32===s.charCodeAt(0)?String.fromCharCode(160):s,o.appendChild(i),t.appendChild(o),e.supChars.push(i)}e.el.appendChild(t),e.sup=t,i=a.length}let l=Array.from(t),n=t.split("\n"),u=n.length>1,c=0;for(let t=0;t<n.length;t++){let a=n[t].split(" "),r=e.el;if(u){let t=document.createElement("div");t.style.display="block",t.style.whiteSpace="nowrap",e.el.appendChild(t),r=t}for(let t=0;t<a.length;t++){let s=a[t],o=document.createElement("span");o.style.display="inline-block",o.style.whiteSpace="nowrap",o.style.verticalAlign="bottom";for(let t=0;t<s.length;t++){let a=s[t],r=c,l=document.createElement("span");l.style.display="inline-block",l.style.overflow="hidden",l.style.verticalAlign="bottom",l.style.lineHeight="1",l.style.paddingBottom="0.22em",l.style.marginBottom="-0.22em";let n=document.createElement("span");n.style.display="inline-block",n.style.transform=e.revealed?"translateY(0)":"translateY(110%)",n.style.opacity=e.revealed?"1":"0";let u=(i+r)*35;n.style.transition=`transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${u}ms, opacity 700ms ease ${u}ms`,n.textContent=a,l.appendChild(n),o.appendChild(l),e.chars.push(n),c++}r.appendChild(o),t<a.length-1&&(r.appendChild(document.createTextNode(" ")),c++)}}let f=(s??"").trim();if(f.length>0){let t=document.createElement("div");t.className="in-review-post-label",t.style.display="block",t.style.fontSize="0.32em",t.style.marginTop=window.matchMedia("(max-width: 768px)").matches?`${ai.postGapEm}em`:"16px",t.style.lineHeight="1",t.style.color=ai.supColor;let a=Array.from(f);for(let r=0;r<a.length;r++){let s=a[r],o=document.createElement("span");o.style.display="inline-block",o.style.overflow="hidden",o.style.verticalAlign="bottom",o.style.lineHeight="1";let n=document.createElement("span");n.style.display="inline-block",n.style.transform=e.revealed?"translateY(0)":"translateY(110%)",n.style.opacity=e.revealed?"1":"0";let u=(i+l.length+r)*35;n.style.transition=`transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${u}ms, opacity 700ms ease ${u}ms`,n.textContent=32===s.charCodeAt(0)?String.fromCharCode(160):s,o.appendChild(n),t.appendChild(o),e.supChars.push(n)}e.el.appendChild(t)}let d=a.trim();if(d.length>0){let t=document.createElement("sup");t.style.fontSize="0.32em",t.style.marginLeft="0.08em",t.style.verticalAlign="super",t.style.whiteSpace="nowrap",t.style.display="inline-block",t.style.color=ai.supColor;let a=Array.from(`(${d})`);for(let r=0;r<a.length;r++){let s=a[r],o=document.createElement("span");o.style.display="inline-block",o.style.overflow="hidden",o.style.verticalAlign="bottom",o.style.lineHeight="1";let i=document.createElement("span");i.style.display="inline-block",i.style.transform=e.revealed?"translateY(0)":"translateY(110%)",i.style.opacity=e.revealed?"1":"0";let n=(l.length+r)*35;i.style.transition=`transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${n}ms, opacity 700ms ease ${n}ms`,i.textContent=32===s.charCodeAt(0)?String.fromCharCode(160):s,o.appendChild(i),t.appendChild(o),e.supChars.push(i)}t.className="in-review-title-sup",e.el.appendChild(t),e.sup=t}},ap=!1,av=X.current.statFirstZ??A.statFirstZ,am={x:0,y:0,vx:0,vy:0,init:!1},ah={stiffness:A.statHoverStiffness,damping:A.statHoverDamping},aS={colorA:A.statColorA,colorB:A.statColorB,yOffset:A.statYOffset,particleSize:A.statParticleSize,scatterRadius:A.statScatterRadius,scatterHeight:A.statScatterHeight,formJitter:A.statFormJitter,hoverRadius:A.statHoverRadius,hoverRepel:A.statHoverRepel,hoverScale:A.statHoverScale,hoverGlow:A.statHoverGlow,hoverGlowColor:A.statHoverGlowColor,hoverSmoothing:.18,triggerOffset:A.statTriggerOffset,formInMs:A.statFormInMs,formOutMs:A.statFormOutMs,idleWiggle:A.statIdleWiggle,spacing:X.current.statSpacing??A.statSpacing},ag={x:0,y:0,active:0};(a?Promise.resolve(null):fetch("/api/in-review/stats").then(e=>e.json())).then(async e=>{if(ap||!e)return;let t=[String(e.totalEntries),String(e.websites),String(e.experiments),String(e.makers)];ac.length=0,ac.push(...t);for(let e=0;e<t.length;e++){if(ap)return;let a=await v(t[e],0,av-e*aS.spacing,{colorA:aS.colorA,colorB:aS.colorB,yOffset:aS.yOffset,particleSize:aS.particleSize,scatterRadius:aS.scatterRadius,scatterHeight:aS.scatterHeight,formJitter:aS.formJitter,triggerOffset:aS.triggerOffset,formInDurationMs:aS.formInMs,formOutDurationMs:aS.formOutMs});if(ap)return void a.dispose();a.setHoverRadius(aS.hoverRadius),a.setHoverRepel(aS.hoverRepel),a.setHoverScale(aS.hoverScale),a.setHoverGlow(aS.hoverGlow),a.setHoverGlowColor(aS.hoverGlowColor),a.setIdleWiggle(aS.idleWiggle);{let e=es.uPLightDir.value;a.setPLight(e.x,e.y,e.z,es.uPAmbient.value,es.uPDiffuse.value,es.uPSpec.value,es.uPSpecPower.value)}at.push(a),i.add(a.mesh);let r=d.current,s=ai.texts[e]??"";if(r&&s){let t=document.createElement("div");t.className="in-review-title-label",t.style.gridRow="1",t.style.gridColumn="1",t.style.whiteSpace=window.matchMedia("(max-width: 768px)").matches?"normal":"nowrap",t.style.fontFamily="var(--font-overused-grotesk), system-ui, sans-serif",t.style.fontWeight="400",t.style.fontSize=`${ai.sizeVw}vw`,t.style.lineHeight="1",t.style.letterSpacing="-0.01em",t.style.color="#ffffff",t.style.mixBlendMode="difference",t.style.willChange="opacity",t.style.maxWidth="95vw",window.matchMedia("(max-width: 768px)").matches?(t.style.setProperty("position","absolute","important"),t.style.setProperty("left","0","important"),t.style.setProperty("right","0","important"),t.style.setProperty("top","50%","important"),t.style.setProperty("transform","translateY(-50%)","important"),t.style.setProperty("width","100vw","important"),t.style.setProperty("max-width","100vw","important"),t.style.setProperty("padding-left","24px","important"),t.style.setProperty("padding-right","24px","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("text-align","center","important"),t.style.setProperty("display","block","important")):(t.style.position="relative",t.style.textAlign="center"),r.appendChild(t);let a={el:t,chars:[],supChars:[],sup:null,stationZ:av-e*aS.spacing,revealed:!1};ad(a,s,af(e)),ao.push(a)}}if(ap)return;let a=e.bestMaker?.name??"Unseen Studio";ac.push(a);let r=t.length,s=av-r*aS.spacing,o=e.bestMaker?.avatarUrl??"/in-review/unseen-logo.jpg",l=await v({type:"image",src:o,threshold:180},0,s,{colorA:aS.colorA,colorB:aS.colorB,worldHeight:2.4,yOffset:aS.yOffset,particleSize:aS.particleSize,scatterRadius:aS.scatterRadius,scatterHeight:aS.scatterHeight,formJitter:aS.formJitter,triggerOffset:aS.triggerOffset,formInDurationMs:aS.formInMs,formOutDurationMs:aS.formOutMs});if(ap)return void l.dispose();l.setHoverRadius(aS.hoverRadius),l.setHoverRepel(aS.hoverRepel),l.setHoverScale(aS.hoverScale),l.setHoverGlow(aS.hoverGlow),l.setHoverGlowColor(aS.hoverGlowColor),l.setIdleWiggle(.003);{let e=es.uPLightDir.value;l.setPLight(e.x,e.y,e.z,es.uPAmbient.value,es.uPDiffuse.value,es.uPSpec.value,es.uPSpecPower.value)}at.push(l),i.add(l.mesh);let n=d.current,u=ai.texts[r]??"Top maker";if(n&&a){let e=document.createElement("div");e.className="in-review-title-label",e.style.gridRow="1",e.style.gridColumn="1",e.style.whiteSpace=window.matchMedia("(max-width: 768px)").matches?"normal":"nowrap",e.style.fontFamily="var(--font-overused-grotesk), system-ui, sans-serif",e.style.fontWeight="400",e.style.fontSize=`${ai.sizeVw}vw`,e.style.lineHeight="1",e.style.letterSpacing="-0.01em",e.style.color="#ffffff",e.style.mixBlendMode="difference",e.style.willChange="opacity",e.style.maxWidth="95vw",e.style.textAlign="center",n.appendChild(e);let t={el:e,chars:[],supChars:[],sup:null,stationZ:s,revealed:!1};ad(t,a,"",u),ao.push(t)}if(ap)return;let c=[];for(let t=2;t>=0;t--){let a=e.bestPerformance?.[t];a?.previewVideo&&c.push({data:a,rank:t+1})}for(let e=0;e<c.length;e++){if(ap)return;let t=c[e].data,a=c[e].rank,s=t.previewVideo,o=av-(r+1+e)*aS.spacing,l=e=>e.split(/[|\-–—:]/)[0].trim(),n=an.rectWidth,u=an.rectWidth/an.aspect,f=await m(s,0,o,{width:n,height:u,depth:au.depth,yBase:au.yBase,ior:au.ior,transmission:au.transmission,roughness:au.roughness,metalness:au.metalness,thickness:au.thickness,clearcoat:au.clearcoat,clearcoatRoughness:au.clearcoatRoughness,attenuationColor:au.attenuationColor,reflectivity:au.reflectivity,dispersion:au.dispersion,cornerRadius:au.cornerRadius,videoRadius:au.videoRadius,iridescence:au.iridescence,iridescenceIor:au.iridescenceIor,haloColor:au.haloColor,haloStrength:au.haloStrength,haloSize:au.haloSize,initialRotationX:au.initRotX,initialRotationY:au.initRotY,initialRotationZ:au.initRotZ,initialScaleX:au.initScale,initialScaleY:au.initScale,initialScaleZ:au.initScale,exitRotationX:au.exitRotX,exitRotationY:au.exitRotY,exitRotationZ:au.exitRotZ,sheen:au.sheen,sheenRoughness:au.sheenRoughness,sheenColor:au.sheenColor,blendingMode:au.blendingMode,causticIntensity:au.causticIntensity,causticScale:au.causticScale,causticSpeed:au.causticSpeed,causticColor:au.causticColor,tilesX:au.tilesX,tilesY:au.tilesY,tileGap:au.tileGap,hoverStrength:au.hoverStrength,hoverRadius:au.hoverRadius,emissiveIntensity:au.emissiveIntensity,enterStart:au.enterStart,enterEnd:au.enterEnd,exitStart:au.exitStart,exitEnd:au.exitEnd,fresnelStrength:au.fresnelStrength,fresnelPower:au.fresnelPower,fresnelColor:au.fresnelColor,fresnelInvert:au.fresnelInvert,fresnelBlend:au.fresnelBlend,causticBlendingMode:au.causticBlend,haloBlendingMode:au.haloBlend,bumpStrength:au.bumpStrength,bumpScale:au.bumpScale,bumpDistortion:au.bumpDistortion,vertexBumpStrength:au.vertexBumpStrength,frostStrength:au.frostStrength,oilStrength:au.oilStrength,oilRadius:au.oilRadius,oilScale:au.oilScale,oilSpeed:au.oilSpeed,oilColorA:au.oilColorA,oilColorB:au.oilColorB,surfaceUniforms:{uNoiseScale:U.uNoiseScale,uDisplacement:U.uDisplacement,uScrollOffset:U.uScrollOffset,uTime:U.uTime},triggerOffset:aS.triggerOffset,formInDurationMs:aS.formInMs,formOutDurationMs:aS.formOutMs});if(ap)return void f.dispose();aa.push(f),i.add(f.group),f.setTileOilStrength(au.tileOilStrength),f.setTileOilColorA(au.tileOilColorA),f.setTileOilColorB(au.tileOilColorB),f.setTileOilSpeed(au.tileOilSpeed),f.setTileOilScale(au.tileOilScale),f.setTileOilRadius(au.tileOilRadius),f.setTileTrailLife(au.tileTrailLife),f.setTileTrailTaper(au.tileTrailTaper),f.setTileTrailBlur(au.tileTrailBlur),f.setHoverScale(au.hoverScale),f.setMatcapStrength(au.matcapStrength),f.setMatcapAngle(au.matcapAngle),f.setMatcapElevation(au.matcapElevation),f.setMatcapSharpness(au.matcapSharpness),f.setMatcapColor(au.matcapColor);let p=l(t.title);ai.texts.push(p),ai.supers.push(""),ac.push(`${t.pageviewsAll} views`);let v=d.current;if(v){let e=document.createElement("div");e.className="in-review-title-label",e.style.gridRow="1",e.style.gridColumn="1",e.style.whiteSpace=window.matchMedia("(max-width: 768px)").matches?"normal":"nowrap",e.style.fontFamily="var(--font-overused-grotesk), system-ui, sans-serif",e.style.fontWeight="400",e.style.fontSize=`${ai.sizeVw}vw`,e.style.lineHeight="1",e.style.letterSpacing="-0.01em",e.style.color="#ffffff",e.style.mixBlendMode="difference",e.style.willChange="opacity",e.style.maxWidth="95vw",e.style.textAlign="center",v.appendChild(e);let r={el:e,chars:[],supChars:[],sup:null,stationZ:o,revealed:!1},s=e=>0===e.length?"":1===e.length?e[0]:2===e.length?`${e[0]} and ${e[1]}`:`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`;ad(r,p,"",`Top pick №${a}`,t.makerNames&&t.makerNames.length>0?`by ${s(t.makerNames)}`:""),ao.push(r)}}if(!ap&&d.current){let e=d.current,t=document.createElement("div");t.className="in-review-outro-label",t.style.position="absolute",window.matchMedia("(max-width: 768px)").matches?(t.style.left="0",t.style.right="0",t.style.top="46%",t.style.transform="translateY(-50%)",t.style.display="flex",t.style.flexDirection="column",t.style.alignItems="center"):(t.style.left="50%",t.style.top="46%",t.style.transform="translate(-50%, -50%)"),t.style.whiteSpace=window.matchMedia("(max-width: 768px)").matches?"normal":"nowrap",t.style.fontFamily="var(--font-overused-grotesk), system-ui, sans-serif",t.style.fontWeight="400",t.style.fontSize=`${ai.sizeVw}vw`,t.style.lineHeight="1",t.style.letterSpacing="-0.01em",t.style.color="#ffffff",t.style.mixBlendMode="difference",t.style.willChange="opacity",t.style.maxWidth="95vw",t.style.textAlign="center",t.style.pointerEvents="none",e.appendChild(t);let a=document.createElement("div");a.className="in-review-cta-wrap",a.style.position="absolute",a.style.left="50%";{let e=X.current.outroButtonGapVw??A.outroButtonGapVw;a.style.top=`calc(46% + ${e}vw)`}a.style.transform="translate(-50%, 32px)",a.style.opacity="0",a.style.pointerEvents="none",a.style.transition="opacity 600ms ease, transform 240ms cubic-bezier(0.22, 1, 0.36, 1)",a.style.willChange="opacity, transform";let r=document.createElement("a");r.href="/websites",r.textContent="Browse the gallery",r.className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-2xl transition-all h-11 px-5 bg-brand text-fg-on-inverse-primary hover:bg-brand-hover font-geist font-body-03-strong leading-body-03-strong cursor-pointer text-sm",r.style.pointerEvents="inherit";let s=X.current.outroButtonPaddingX??A.outroButtonPaddingX,o=X.current.outroButtonPaddingY??A.outroButtonPaddingY,i=X.current.outroButtonRadius??A.outroButtonRadius;r.style.paddingLeft=`${s}px`,r.style.paddingRight=`${s}px`,r.style.paddingTop=`${o}px`,r.style.paddingBottom=`${o}px`,r.style.height="auto",r.style.borderRadius=`${i}px`,r.style.textDecoration="none",a.appendChild(r),e.appendChild(a);let l={el:t,chars:[],supChars:[],sup:null,stationZ:0,revealed:!1};ad(l,window.matchMedia("(max-width: 768px)").matches?A.mobileOutroPhase1Text:A.outroPhase1Text,""),k.current={lbl:l,btnWrap:a,phase:0,phase2Ready:!1,phase1EnteredAt:null}}let f=p.current;if(f){let e=[];for(let a=0;a<t.length;a++)e.push({z:av-a*aS.spacing,label:String(a+1)});at.length>t.length&&e.push({z:av-t.length*aS.spacing,label:"M"});for(let t=0;t<aa.length;t++)e.push({z:aa[t].group.position.z,label:`E${t+1}`});let a=e=>{let t=e+al.clickOffset;return(Z.z-t)/tB.speed};f.innerHTML="";let r=0;for(let t of e){let e=a(t.z);e>r&&(r=e)}for(let t of(tZ.current=Math.max(r,1),e)){let e=document.createElement("button");e.type="button",e.style.position="relative",e.style.flex="0 0 auto",e.style.width="40px",e.style.height="80px",e.style.padding="0",e.style.margin="0",e.style.border="0",e.style.background="transparent",e.style.cursor="pointer",e.style.pointerEvents="none",e.style.display="flex",e.style.alignItems="flex-end",e.style.justifyContent="center",e.title=`Jump to ${t.label} (z=${t.z.toFixed(1)})`;let r=document.createElement("span");r.style.display="block",r.style.width="1px",r.style.height="0px",r.style.opacity="0.5",r.style.background="#cfdee5",r.style.transformOrigin="bottom",r.style.transition="height 360ms cubic-bezier(0.22, 1, 0.36, 1)",e.appendChild(r);let s={el:e,z:t.z,line:r,hover:!1};e.addEventListener("pointerenter",()=>{s.hover=!0}),e.addEventListener("pointerleave",()=>{s.hover=!1}),e.addEventListener("click",()=>{let e=window.scrollY||0;tz.current=a(t.z)-e,window.__inReviewSkipIntro?.()}),f.appendChild(e),tV.push(s)}}}).catch(()=>{});let ay=0,aw=performance.now(),ax=!a,aC=()=>{if(!ax){ay=0;return}let t=performance.now();ae<0&&(ae=t);let s=Math.min((t-aw)/1e3,.05);aw=t,_.current&&(U.uTime.value+=s);let o=Math.min((t-ae)/3500,1);U.uIntroLinear.value=o,U.uIntro.value=1-Math.pow(1-o,3),U.uHoverX.value+=(ty-U.uHoverX.value)*tW.current,U.uHoverZ.value+=(tw-U.uHoverZ.value)*tW.current;let l=Math.min(s,.05);tP.current*=Math.exp(-4*l);let n=Math.min(1,tP.current/450),u=n*n*(3-2*n),f=u>tO.current?.22:.08;tO.current+=(u-tO.current)*f;let d=tO.current;tE.current+=(tx-tE.current)*tW.current,U.uHoverActive.value=tE.current;let p=ag.active?tt:ta;to+=(tr-to)*p,ti+=(ts-ti)*p;let v=Z.distanceTo(V),m=Math.asin((Z.y-V.y)/v)+to,h=Math.atan2(Z.x-V.x,Z.z-V.z)+ti;I.position.set(V.x+Math.sin(h)*Math.cos(m)*v,V.y+Math.sin(m)*v,V.z+Math.cos(h)*Math.cos(m)*v),I.position.y+=(1-U.uIntro.value)*8;let S=!a&&window.scrollY||0,y=tz.current+S;if(tB.on&&tB.speed>0){let e=-(as.buttonAppearCamZ-12)/tB.speed;if(y>e){let t=y-e;tH.current+=t,y=e,tz.current+=(e-S-tz.current)*.5}}tA.current+=(y-tA.current)*.08,a||(window.__inReviewScrollPx=y);let w=tB.on?-(tA.current*tB.speed):0;I.position.z+=w,tI.copy(V),tI.z+=w,I.lookAt(tI);let x=Math.abs(tA.current-tN.current);tN.current=tA.current,x+=tH.current,tH.current*=.55,tD.current+=(x-tD.current)*.04;let C=1-Math.exp(-(.18*Math.max(0,x-tD.current))),T=tL.current;if(tL.current=T+(C-T)*(C>T?.09:.04),I.rotation.x+=tL.current*tB.rotateX,I.rotation.y+=tL.current*tB.rotateY,I.rotation.z+=tL.current*tB.rotateZ,I.fov=Math.max(15,Math.min((window.matchMedia("(max-width: 768px)").matches?75:a?40:52)+tL.current*tB.zoom,110)),I.updateProjectionMatrix(),U.uFocusZ.value=tk.current+w,j.position.z=w,eh.position.z=w,tV.length>0&&(tY.current||tU.current)){let e=tV.map(e=>(Z.z-e.z)/tB.speed),t=tA.current,a=0;if(t<=e[0])a=0;else if(t>=e[e.length-1])a=e.length-1;else for(let r=0;r<e.length-1;r++)if(t>=e[r]&&t<=e[r+1]){let s=e[r+1]-e[r];a=r+(s>0?(t-e[r])/s:0);break}{let e=window,t=es.uTunnelProgress.value>.02;e.__inReviewTunnelActive!==t&&(e.__inReviewTunnelActive=t,window.dispatchEvent(new CustomEvent(t?"in-review:tunnel-active":"in-review:tunnel-inactive")))}let r=es.uTunnelProgress.value;!tU.current&&r>.02?(tU.current=!0,t_.current=aw):tU.current&&r<.001&&(tU.current=!1,tX.current=aw);let s=aw-tX.current,o=aw-t_.current,i=tV.length;for(let e=0;e<i;e++){let t=Math.max(0,1-Math.abs(e-a)/2),r=24+t*t*(3-2*t)*40;tV[e].hover&&(r+=6);let l=Math.max(0,Math.min(1,(s-30*e)/520));if(r*=l*l*(3-2*l),tU.current){let t=Math.max(0,Math.min(1,(o-(i-1-e)*30)/520));r*=1-t*t*(3-2*t)}tV[e].line.style.height=`${r}px`,tV[e].el.style.pointerEvents=tY.current&&!tU.current?"auto":"none";let n=Math.max(0,1-Math.abs(e-a)/4),u=.15+n*n*(3-2*n)*.35;tV[e].line.style.opacity=String(u)}}es.uCameraZ.value=I.position.z,eK.uCameraZ.value=I.position.z,g.current.z=I.position.z,es.uHoverNActive.value=ag.active*d;{let e=ar.triggerStartCamZ,t=ar.triggerEndCamZ-e,a=0;if(Math.abs(t)>1e-4){let r=Math.max(0,Math.min(1,(I.position.z-e)/t));a=r*r*(3-2*r)}for(let e of(es.uTunnelProgress.value=a,es.uTunnelCenterX.value=I.position.x,es.uTunnelCenterY.value=I.position.y+ar.centerYOffset,en))e.material.uniforms.uParticleOpacity.value=es.uParticleOpacity.value*a,e.mesh.visible=a>.001&&!0===A.particlesOn;U.uSurfaceDarken.value=a*ar.surfaceDarkenMax,a>.05&&(U.uHoverActive.value=0)}{let e=k.current;if(e){let t=I.position.z,a=H.current.prevCamZ;H.current.prevCamZ=t;let r=e.phase;if(t>as.phase1AppearCamZ?(r=0,e.phase1EnteredAt=null):0===e.phase?t<a-.001?r=1:t>a+.001||(r=1):1===e.phase&&null!==e.phase1EnteredAt&&performance.now()-e.phase1EnteredAt>=as.phase1HoldMs&&(r=2),r!==e.phase){let t=e.phase;e.phase=r,1===r?e.phase1EnteredAt=performance.now():0===r&&(e.phase1EnteredAt=null),2!==r&&(e.phase2Ready=!1);let a=e.lbl;if(0===r){for(let e of a.chars)e.style.transform="translateY(-110%)",e.style.opacity="0";for(let e of a.supChars)e.style.transform="translateY(-110%)",e.style.opacity="0";a.revealed=!1}else if(1===r)if(2===t){let t=a.chars.slice(),r=a.supChars.slice(),s=e=>{for(let t of e)t.style.transform="translateY(-110%)",t.style.opacity="0"};s(t),s(r),a.revealed=!1,setTimeout(()=>{1===e.phase&&(window.__inReviewAudio?.playScroll(),ad(a,window.matchMedia("(max-width: 768px)").matches?A.mobileOutroPhase1Text:A.outroPhase1Text,""),requestAnimationFrame(()=>{if(1===e.phase){for(let e of a.chars)e.style.transform="translateY(0)",e.style.opacity="1";a.revealed=!0}}))},35*Math.max(t.length,1)+350)}else a.revealed=!1,window.__inReviewAudio?.playScroll(),ad(a,window.matchMedia("(max-width: 768px)").matches?A.mobileOutroPhase1Text:A.outroPhase1Text,""),requestAnimationFrame(()=>{if(1===e.phase){for(let e of a.chars)e.style.transform="translateY(0)",e.style.opacity="1";a.revealed=!0}});else{let t=a.chars.slice(),r=a.supChars.slice(),s=e=>{for(let t of e)t.style.transform="translateY(-110%)",t.style.opacity="0"};s(t),s(r),a.revealed=!1,setTimeout(()=>{2!==e.phase||(window.__inReviewAudio?.playScroll(),ad(a,window.matchMedia("(max-width: 768px)").matches?A.mobileOutroPhase2Text:A.outroPhase2Text,""),requestAnimationFrame(()=>{if(2===e.phase){for(let e of a.chars)e.style.transform="translateY(0)",e.style.opacity="1";a.revealed=!0}}),setTimeout(()=>{2===e.phase&&(e.phase2Ready=!0)},250+35*(window.matchMedia("(max-width: 768px)").matches?A.mobileOutroPhase2Text:A.outroPhase2Text).length))},35*Math.max(t.length,1)+350)}}let o=2===e.phase&&e.phase2Ready;e.btnWrap.style.opacity=o?"1":"0",e.btnWrap.style.pointerEvents=o?"auto":"none";let i=L.current,l=0,n=32*!o;if(o&&N.current.active){let t=e.btnWrap.getBoundingClientRect(),a=t.left+.5*t.width,r=t.top+.5*t.height,s=N.current.x-a,o=N.current.y-r,i=Math.hypot(s,o),u=as.magnetRadius,c=as.magnetStrength;if(i<u){let e=1-i/u,t=e*e*(3-2*e)*c;l=s*t,n=o*t}}let u=Math.min(s,.05);i.vx+=((l-i.x)*280-20*i.vx)*u,i.vy+=((n-i.y)*280-20*i.vy)*u,i.x+=i.vx*u,i.y+=i.vy*u,e.btnWrap.style.transition="opacity 360ms ease",e.btnWrap.style.transform=`translate(calc(-50% + ${i.x.toFixed(2)}px), ${i.y.toFixed(2)}px)`}}if(at.length>0||aa.length>0){let e=I.position.z,t=1e3*s;if(ag.active<=0)am.init=!1,am.vx=0,am.vy=0;else if(am.init){let e=Math.min(s,.05),t=Math.max(1,ah.stiffness),a=Math.max(0,ah.damping),r=(ag.x-am.x)*t-am.vx*a,o=(ag.y-am.y)*t-am.vy*a;am.vx+=r*e,am.vy+=o*e,am.x+=am.vx*e,am.y+=am.vy*e}else am.x=ag.x,am.y=ag.y,am.vx=0,am.vy=0,am.init=!0;let a=am.init?am.x:ag.x,r=am.init?am.y:ag.y;for(let s of(es.uCursorNDC.value.set(a,r),at))s.update(e,t),s.setCursorNDC(a,r,ag.active*d);for(let s of aa)s.update(e,t),s.setCursorWorld(ty,tw,tx*d),s.setHoverCursorNDC(a,r,ag.active),s.setHoverCamera(I)}if(ao.length>0){let e=I.position.z,t=ai.appearOffset,a=ai.disappearOffset,r=-1,s=e<=as.phase1AppearCamZ;for(let o=0;o<ao.length;o++){let i=ao[o],l=e-i.stationZ,n=!s&&l>-a&&l<t;if(n&&-1===r&&(r=o),n!==i.revealed){for(let e of(i.revealed=n,n&&window.__inReviewAudio?.playScroll(),i.chars))e.style.transform=n?"translateY(0)":"translateY(110%)",e.style.opacity=n?"1":"0";for(let e of i.supChars)e.style.transform=n?"translateY(0)":"translateY(110%)",e.style.opacity=n?"1":"0"}}window.__inReviewActiveStation=r}if(U.uCausticsIntensity.value>1e-4||U.uVolumeDensity.value>1e-4){let t=e.getRenderTarget();e.setRenderTarget(eS),e.render(eg,ey),e.setRenderTarget(t)}{let t=e.getRenderTarget();tx>.5?(tM?(eG.uSplatPosPrev.value.set(tF,tG),eG.uSplatHasPrev.value=1):(eG.uSplatHasPrev.value=0,tM=!0),tF=ty,tG=tw):tM=!1,eG.uSplatRadius.value=U.uOilRevealRadius.value,eG.uSplatStrength.value=A.oilSplatStrength,eG.uPrevTex.value=eb.texture,eG.uSplatActive.value=tx,eG.uSplatPos.value.set(ty,tw),e.setRenderTarget(eP),e.clear(),e.render(eM,eF),e.setRenderTarget(t);let a=eb;eb=eP,eP=a,U.uOilTex.value=eb.texture}{let e=es.uTunnelProgress.value;if(Math.max(0,Math.min(1,(e-.92)/.08))>.001){eL.visible=!0,eL.position.set(es.uTunnelCenterX.value,es.uTunnelCenterY.value,I.position.z);let t=A.pTunnelRadius,a=es.uTunnelRadius.value/Math.max(t,1e-4);if(eL.scale.set(a,a,1),eA.uCameraZ.value=I.position.z,eV.current){eZ.visible=!0,eZ.position.copy(eL.position);let e=a*eY.current;eZ.scale.set(e,e,1),ek.uCameraZ.value=I.position.z;let t=performance.now();eX.current<0&&(eX.current=t);let r=1-Math.pow(1-Math.min(1,(t-eX.current)/1400),3);ek.uRevealDist.value=(1-r)*eU}else eZ.visible=!1,eX.current=-1,ek.uRevealDist.value=0;let r=0;if(ag.active>0){tc.vNdcX+=(ag.x-tc.ndcX)*.12-.22*tc.vNdcX,tc.vNdcY+=(ag.y-tc.ndcY)*.12-.22*tc.vNdcY,tc.ndcX+=tc.vNdcX,tc.ndcY+=tc.vNdcY,tn.setFromCamera(tu.set(tc.ndcX,tc.ndcY),I);let e=tn.intersectObject(eL,!1);if(e.length>0){let t=e[0].point;tc.hitX=t.x,tc.hitY=t.y,tc.hitZ=t.z,r=d}}else tc.vNdcX*=.9,tc.vNdcY*=.9;tc.vActivity+=(r-tc.activity)*.18-.18*tc.vActivity,tc.activity+=tc.vActivity,eA.uHoverActivity.value=tc.activity,eA.uHoverPos.value.set(tc.hitX,tc.hitY,tc.hitZ);let s=Math.max(0,Math.min(1,(e-.75)/.25));eA.uReveal.value=s*s*(3-2*s)}else eL.visible=!1,eZ.visible=!1,eX.current=-1,ek.uRevealDist.value=eU}if(U.uEmissionStrength.value>1e-4&&ei.visible){let t=e.getRenderTarget(),a=e.getClearColor(new r.Color),s=e.getClearAlpha();e.setRenderTarget(eu),e.setClearColor(0,0),e.clear(!0,!1,!1),e.render(i,ec),e.setRenderTarget(t),e.setClearColor(a,s)}e.setRenderTarget(e5),e.render(i,I),e.setRenderTarget(null),e.render(e4,e6),!aT&&(aT=!0,c.current?.(),a||(window.__inReviewReady=!0,window.dispatchEvent(new CustomEvent("in-review:ready")))),ay=requestAnimationFrame(aC)},aT=!1;a||(ay=requestAnimationFrame(aC));let aR=null;a&&(aR=new IntersectionObserver(([e])=>{(ax=e.isIntersecting)&&0===ay&&(aw=performance.now(),ay=requestAnimationFrame(aC))})).observe(t);let ab=()=>{let a=t.clientWidth,r=t.clientHeight;if(0===a||0===r)return;I.aspect=a/r,I.updateProjectionMatrix();let s=Math.min(window.devicePixelRatio||1,2);e.setPixelRatio(s),e.setSize(a,r,!1),e5.setSize(Math.floor(a*s),Math.floor(r*s))},aP=new ResizeObserver(ab);return aP.observe(t),window.addEventListener("resize",ab,{passive:!0}),window.addEventListener("orientationchange",ab),()=>{for(let e of(cancelAnimationFrame(ay),aR?.disconnect(),aP.disconnect(),window.removeEventListener("resize",ab),window.removeEventListener("orientationchange",ab),t2.removeEventListener("pointermove",t$),t2.removeEventListener("pointerleave",tJ),t2.removeEventListener("pointerdown",tQ),t2.removeEventListener("pointerup",t0),window.removeEventListener("wheel",t1),window.removeEventListener("pointerdown",t4),window.removeEventListener("pointermove",t6),window.removeEventListener("pointerup",t8),window.removeEventListener("pointercancel",t8),window.removeEventListener("in-review:intro-done",t9),window.removeEventListener("in-review:intro-back",t7),Y.dispose(),J.dispose(),ea.dispose(),eo.dispose(),en))e.material.dispose();for(let e of(em.dispose(),ed.dispose(),eu.dispose(),e_.dispose(),eQ.dispose(),e5.dispose(),e9.dispose(),e7.dispose(),q.dispose(),K.dispose(),ex.dispose(),eW.dispose(),eB.dispose(),eb.dispose(),eP.dispose(),eH.dispose(),ez.dispose(),eC.dispose(),eS.dispose(),ap=!0,at.forEach(e=>e.dispose()),aa.forEach(e=>e.dispose()),ao))e.el.parentNode?.removeChild(e.el);ao.length=0,e.dispose(),t.removeChild(e.domElement),S.current=null}},[]),(0,a.useEffect)(()=>{S.current?.setNoiseScale(_)},[_]),(0,a.useEffect)(()=>{S.current?.setDisplacement(J)},[J]),(0,a.useEffect)(()=>{S.current?.setFogColor(et)},[et]),(0,a.useEffect)(()=>{S.current?.setFogInner(er)},[er]),(0,a.useEffect)(()=>{S.current?.setFogOuter(eo)},[eo]),(0,a.useEffect)(()=>{S.current?.setFocusX(el)},[el]),(0,a.useEffect)(()=>{S.current?.setFocusZ(eu)},[eu]),(0,a.useEffect)(()=>{S.current?.setBaseColor(q)},[q]),(0,a.useEffect)(()=>{S.current?.setPeakColor(Q)},[Q]),(0,a.useEffect)(()=>{S.current?.setWaveSpeed(ef)},[ef]),(0,a.useEffect)(()=>{S.current?.setWaveAmplitude(ep)},[ep]),(0,a.useEffect)(()=>{S.current?.setWaveLength(em)},[em]),(0,a.useEffect)(()=>{S.current?.setAnimating(eB)},[eB]),(0,a.useEffect)(()=>{S.current?.setWaveFalloff(eS)},[eS]),(0,a.useEffect)(()=>{S.current?.setPulseWidth(ey)},[ey]),(0,a.useEffect)(()=>{S.current?.setHoverRadius(ex)},[ex]),(0,a.useEffect)(()=>{S.current?.setHoverStrength(eT)},[eT]),(0,a.useEffect)(()=>{S.current?.setHoverEasing(eb)},[eb]),(0,a.useEffect)(()=>{S.current?.setBaseAmplitude(eO)},[eO]),(0,a.useEffect)(()=>{S.current?.setBaseSpeed(eM)},[eM]),(0,a.useEffect)(()=>{S.current?.setBaseWavelength(eG)},[eG]),(0,a.useEffect)(()=>{S.current?.setLightDir(ez,eH)},[ez,eH]),(0,a.useEffect)(()=>{S.current?.setLightColor(eN)},[eN]),(0,a.useEffect)(()=>{S.current?.setBumpiness(eI)},[eI]),(0,a.useEffect)(()=>{S.current?.setSpecularStrength(eV)},[eV]),(0,a.useEffect)(()=>{S.current?.setSpecularSharpness(eX)},[eX]),(0,a.useEffect)(()=>{S.current?.setParticlesOn(e_)},[e_]),(0,a.useEffect)(()=>{S.current?.setParticleColor(eJ)},[eJ]),(0,a.useEffect)(()=>{S.current?.setParticleSize(eq)},[eq]),(0,a.useEffect)(()=>{S.current?.setParticleOpacity(eQ)},[eQ]),(0,a.useEffect)(()=>{S.current?.setParticleLift(e1)},[e1]),(0,a.useEffect)(()=>{S.current?.setParticleSizeJitter(e3)},[e3]),(0,a.useEffect)(()=>{S.current?.setParticleXZJitter(e4)},[e4]),(0,a.useEffect)(()=>{S.current?.setParticleYJitter(e8)},[e8]),(0,a.useEffect)(()=>{S.current?.setWireOn(e7)},[e7]),(0,a.useEffect)(()=>{S.current?.setWireColor(tt)},[tt]),(0,a.useEffect)(()=>{S.current?.setWireThickness(tr)},[tr]),(0,a.useEffect)(()=>{S.current?.setWireOpacity(to)},[to]),(0,a.useEffect)(()=>{S.current?.setWireDensity(tl)},[tl]),(0,a.useEffect)(()=>{S.current?.setGlowSpread(tu)},[tu]),(0,a.useEffect)(()=>{S.current?.setGlowStrength(tf)},[tf]),(0,a.useEffect)(()=>{S.current?.setRevealRadius(tp)},[tp]),(0,a.useEffect)(()=>{S.current?.setRevealBlur(tm)},[tm]),(0,a.useEffect)(()=>{S.current?.setRevealNoiseScale(tS)},[tS]),(0,a.useEffect)(()=>{S.current?.setRevealNoiseStrength(ty)},[ty]),(0,a.useEffect)(()=>{S.current?.setContourSpacing(tx)},[tx]),(0,a.useEffect)(()=>{S.current?.setEmissionOn(tT),tT&&S.current?.setEmissionStrength(tb)},[tT,tb]),(0,a.useEffect)(()=>{S.current?.setEmissionSize(tO)},[tO]),(0,a.useEffect)(()=>{S.current?.setEmissionDirBias(tM)},[tM]),(0,a.useEffect)(()=>{S.current?.setBumpNoiseScale(tG)},[tG]),(0,a.useEffect)(()=>{S.current?.setBumpNoiseStrength(tB)},[tB]),(0,a.useEffect)(()=>{S.current?.setCausticsOn(tz),tz&&S.current?.setCausticsIntensity(tN)},[tz,tN]),(0,a.useEffect)(()=>{S.current?.setCausticsColor(tH)},[tH]),(0,a.useEffect)(()=>{S.current?.setCausticsScale(tI)},[tI]),(0,a.useEffect)(()=>{S.current?.setCausticsSpeed(tV)},[tV]),(0,a.useEffect)(()=>{S.current?.setCausticsContrast(tX)},[tX]),(0,a.useEffect)(()=>{S.current?.setCausticsDistort(t_)},[t_]),(0,a.useEffect)(()=>{S.current?.setDustOn(tJ)},[tJ]),(0,a.useEffect)(()=>{S.current?.setDustColor(tq)},[tq]),(0,a.useEffect)(()=>{S.current?.setDustOpacity(tQ)},[tQ]),(0,a.useEffect)(()=>{S.current?.setDustSize(t1)},[t1]),(0,a.useEffect)(()=>{S.current?.setDustSizeJitter(t3)},[t3]),(0,a.useEffect)(()=>{S.current?.setDustSpeed(t4)},[t4]),(0,a.useEffect)(()=>{S.current?.setDustRise(t8)},[t8]),(0,a.useEffect)(()=>{S.current?.setDustWander(t7)},[t7]),(0,a.useEffect)(()=>{S.current?.setPostOn(at),at&&(S.current?.setPostCA(ar),S.current?.setPostLens(ao))},[at,ar,ao]),(0,a.useEffect)(()=>{S.current?.setPWaveOn(al),al&&S.current?.setPWaveBoost(au)},[al,au]),(0,a.useEffect)(()=>{S.current?.setPWaveSpeed(af)},[af]),(0,a.useEffect)(()=>{S.current?.setPWavePeriod(ap)},[ap]),(0,a.useEffect)(()=>{S.current?.setPWaveWidth(am)},[am]),(0,a.useEffect)(()=>{S.current?.setRippleOn(aS),aS&&S.current?.setRippleIntensity(ax)},[aS,ax]),(0,a.useEffect)(()=>{S.current?.setRippleColor(ay)},[ay]),(0,a.useEffect)(()=>{S.current?.setRippleSpeed(aT)},[aT]),(0,a.useEffect)(()=>{S.current?.setRippleSoftness(ab)},[ab]),(0,a.useEffect)(()=>{S.current?.setRippleLife(aO)},[aO]),(0,a.useEffect)(()=>{S.current?.setRippleNoiseScale(aM)},[aM]),(0,a.useEffect)(()=>{S.current?.setRippleNoiseStrength(aG)},[aG]),(0,a.useEffect)(()=>{S.current?.setVolumeOn(aB),aB&&S.current?.setVolumeDensity(az)},[aB,az]),(0,a.useEffect)(()=>{S.current?.setVolumeYFalloff(aH)},[aH]),(0,a.useEffect)(()=>{S.current?.setVolumeMaxDist(aN)},[aN]),(0,a.useEffect)(()=>{S.current?.setVolumeSteps(aI)},[aI]),(0,a.useEffect)(()=>{S.current?.setVolumeSharpness(aV)},[aV]),(0,a.useEffect)(()=>{S.current?.setVolumeFocusBias(aX)},[aX]),(0,a.useEffect)(()=>{S.current?.setScrollOn(a_)},[a_]),(0,a.useEffect)(()=>{S.current?.setScrollSpeed(aJ)},[aJ]),(0,a.useEffect)(()=>{S.current?.setScrollRotateX(aq)},[aq]),(0,a.useEffect)(()=>{S.current?.setScrollRotateY(aQ)},[aQ]),(0,a.useEffect)(()=>{S.current?.setScrollRotateZ(a1)},[a1]),(0,a.useEffect)(()=>{S.current?.setScrollZoom(a3)},[a3]),(0,a.useEffect)(()=>{S.current?.setCorridorOn(a4),a4&&S.current?.setCorridorHeight(a7)},[a4,a7]),(0,a.useEffect)(()=>{S.current?.setCorridorWidth(a8)},[a8]),(0,a.useEffect)(()=>{S.current?.setCorridorSharpness(rt)},[rt]),(0,a.useEffect)(()=>{S.current?.setOilOn(rr),rr&&S.current?.setOilIntensity(ru)},[rr,ru]),(0,a.useEffect)(()=>{S.current?.setOilColorA(ro)},[ro]),(0,a.useEffect)(()=>{S.current?.setOilColorB(rl)},[rl]),(0,a.useEffect)(()=>{S.current?.setOilNoiseScale(rf)},[rf]),(0,a.useEffect)(()=>{S.current?.setOilSpeed(rp)},[rp]),(0,a.useEffect)(()=>{S.current?.setOilRevealRadius(rm)},[rm]),(0,a.useEffect)(()=>{S.current?.setOilRevealBlur(rS)},[rS]),(0,a.useEffect)(()=>{S.current?.setOilTrailLife(ry)},[ry]),(0,a.useEffect)(()=>{S.current?.setStatColorA(rz)},[rz]),(0,a.useEffect)(()=>{S.current?.setStatColorB(rH)},[rH]),(0,a.useEffect)(()=>{S.current?.setStatYOffset(rN)},[rN]),(0,a.useEffect)(()=>{S.current?.setStatParticleSize(rI)},[rI]),(0,a.useEffect)(()=>{S.current?.setStatScatterRadius(rV)},[rV]),(0,a.useEffect)(()=>{S.current?.setStatScatterHeight(rX)},[rX]),(0,a.useEffect)(()=>{S.current?.setStatFormJitter(r_)},[r_]),(0,a.useEffect)(()=>{S.current?.setStatHoverRadius(rJ)},[rJ]),(0,a.useEffect)(()=>{S.current?.setStatHoverRepel(rq)},[rq]),(0,a.useEffect)(()=>{S.current?.setStatHoverScale(rQ)},[rQ]),(0,a.useEffect)(()=>{S.current?.setStatHoverGlow(r1)},[r1]),(0,a.useEffect)(()=>{S.current?.setStatHoverGlowColor(r3)},[r3]),(0,a.useEffect)(()=>{S.current?.setStatHoverStiffness(r4)},[r4]),(0,a.useEffect)(()=>{S.current?.setStatHoverDamping(r8)},[r8]),(0,a.useEffect)(()=>{S.current?.setPTunnelTriggerStartCamZ(r7)},[r7]),(0,a.useEffect)(()=>{S.current?.setPTunnelTriggerEndCamZ(st)},[st]),(0,a.useEffect)(()=>{S.current?.setPTunnelRadius(sr)},[sr]),(0,a.useEffect)(()=>{S.current?.setPTunnelCenterY(so)},[so]),(0,a.useEffect)(()=>{S.current?.setPTunnelScatter(sl)},[sl]),(0,a.useEffect)(()=>{S.current?.setPTunnelSpiralTurns(su)},[su]),(0,a.useEffect)(()=>{S.current?.setPTunnelSpiralPitch(sf)},[sf]),(0,a.useEffect)(()=>{S.current?.setPTunnelRotSpeed(sp)},[sp]),(0,a.useEffect)(()=>{S.current?.setPTunnelSurfaceDarkenMax(sm)},[sm]),(0,a.useEffect)(()=>{S.current?.setPTunnelColorFar(sS)},[sS]),(0,a.useEffect)(()=>{S.current?.setPTunnelGradStart(sy)},[sy]),(0,a.useEffect)(()=>{S.current?.setPTunnelGradEnd(sx)},[sx]),(0,a.useEffect)(()=>{S.current?.setParticleHoverColor(sT)},[sT]),(0,a.useEffect)(()=>{S.current?.setParticleHoverStrength(sb)},[sb]),(0,a.useEffect)(()=>{S.current?.setPLightDirX(sO)},[sO]),(0,a.useEffect)(()=>{S.current?.setPLightDirY(sM)},[sM]),(0,a.useEffect)(()=>{S.current?.setPLightDirZ(sG)},[sG]),(0,a.useEffect)(()=>{S.current?.setPAmbient(sB)},[sB]),(0,a.useEffect)(()=>{S.current?.setPDiffuse(sz)},[sz]),(0,a.useEffect)(()=>{S.current?.setPSpec(sH)},[sH]),(0,a.useEffect)(()=>{S.current?.setPSpecPower(sN)},[sN]),(0,a.useEffect)(()=>{S.current?.setCylWireGridU(sI)},[sI]),(0,a.useEffect)(()=>{S.current?.setCylWireGridV(sV)},[sV]),(0,a.useEffect)(()=>{S.current?.setCylWireLineWidth(sX)},[sX]),(0,a.useEffect)(()=>{S.current?.setCylWireLineSoftness(s_)},[s_]),(0,a.useEffect)(()=>{S.current?.setCylWireOpacity(sJ)},[sJ]),(0,a.useEffect)(()=>{S.current?.setCylWireColor(sq)},[sq]),(0,a.useEffect)(()=>{S.current?.setCylWireTwist(sQ)},[sQ]),(0,a.useEffect)(()=>{S.current?.setCylWireFogStart(s1)},[s1]),(0,a.useEffect)(()=>{S.current?.setCylWireFogEnd(s3)},[s3]),(0,a.useEffect)(()=>{S.current?.setCylWireRotSpeed(s4)},[s4]),(0,a.useEffect)(()=>{S.current?.setCylWireFogNearStart(s8)},[s8]),(0,a.useEffect)(()=>{S.current?.setCylWireFogNearEnd(s7)},[s7]),(0,a.useEffect)(()=>{S.current?.setCylWireHoverRadius(ot)},[ot]),(0,a.useEffect)(()=>{S.current?.setCylWireHoverStrength(or)},[or]),(0,a.useEffect)(()=>{S.current?.setOutroPhase1AppearCamZ(oo)},[oo]),(0,a.useEffect)(()=>{S.current?.setOutroPhaseSplitCamZ(ol)},[ol]),(0,a.useEffect)(()=>{S.current?.setOutroButtonAppearCamZ(ou)},[ou]),(0,a.useEffect)(()=>{S.current?.setOutroButtonGapVw(of)},[of]),(0,a.useEffect)(()=>{S.current?.setOutroButtonMagnetRadius(oI)},[oI]),(0,a.useEffect)(()=>{S.current?.setOutroButtonMagnetStrength(oV)},[oV]),(0,a.useEffect)(()=>{S.current?.setNoiseTunOn(oS)},[oS]),(0,a.useEffect)(()=>{S.current?.setNoiseTunColor(oy)},[oy]),(0,a.useEffect)(()=>{S.current?.setNoiseTunSize(ox)},[ox]),(0,a.useEffect)(()=>{S.current?.setNoiseTunScale(oT)},[oT]),(0,a.useEffect)(()=>{S.current?.setNoiseTunDeform(ob)},[ob]),(0,a.useEffect)(()=>{S.current?.setNoiseTunOpacity(oO)},[oO]),(0,a.useEffect)(()=>{S.current?.setNoiseTunSpeed(oM)},[oM]),(0,a.useEffect)(()=>{S.current?.setNoiseTunRotSpeed(oG)},[oG]),(0,a.useEffect)(()=>{S.current?.setNoiseTunFogNearStart(oB)},[oB]),(0,a.useEffect)(()=>{S.current?.setNoiseTunFogNearEnd(oz)},[oz]),(0,a.useEffect)(()=>{S.current?.setNoiseTunFogFarStart(oH)},[oH]),(0,a.useEffect)(()=>{S.current?.setNoiseTunFogFarEnd(oN)},[oN]),(0,a.useEffect)(()=>{S.current?.setOutroButtonPaddingX(o8)},[o8]),(0,a.useEffect)(()=>{S.current?.setOutroButtonPaddingY(o7)},[o7]),(0,a.useEffect)(()=>{S.current?.setOutroButtonRadius(it)},[it]),(0,a.useEffect)(()=>{S.current?.setStatTriggerOffset(ir)},[ir]),(0,a.useEffect)(()=>{S.current?.setStatFormInMs(io)},[io]),(0,a.useEffect)(()=>{S.current?.setStatFormOutMs(il)},[il]),(0,a.useEffect)(()=>{S.current?.setStatIdleWiggle(ic)},[ic]),(0,a.useEffect)(()=>{S.current?.setStatLabelText(0,iS)},[iS]),(0,a.useEffect)(()=>{S.current?.setStatLabelText(1,iy)},[iy]),(0,a.useEffect)(()=>{S.current?.setStatLabelText(2,ix)},[ix]),(0,a.useEffect)(()=>{S.current?.setStatLabelText(3,iT)},[iT]),(0,a.useEffect)(()=>{S.current?.setStatLabelAppearOffset(ib)},[ib]),(0,a.useEffect)(()=>{S.current?.setStatLabelDisappearOffset(iO)},[iO]),(0,a.useEffect)(()=>{S.current?.setStatLabelSizeVw(iM)},[iM]),(0,a.useEffect)(()=>{S.current?.setStatLabelPostGapEm(iG)},[iG]),(0,a.useEffect)(()=>{S.current?.setProgressClickOffset(iB)},[iB]),(0,a.useEffect)(()=>{S.current?.setStatLabelSuper(0,iH)},[iH]),(0,a.useEffect)(()=>{S.current?.setStatLabelSuper(1,iN)},[iN]),(0,a.useEffect)(()=>{S.current?.setStatLabelSuper(2,iI)},[iI]),(0,a.useEffect)(()=>{S.current?.setStatLabelSuper(3,iV)},[iV]),(0,a.useEffect)(()=>{S.current?.setStatLabelSupColor(iX)},[iX]),(0,a.useEffect)(()=>{S.current?.setStatVideoRectWidth(i_)},[i_]),(0,a.useEffect)(()=>{S.current?.setStatVideoRectHeight(iJ)},[iJ]),(0,a.useEffect)(()=>{S.current?.setStatVideoYOffset(iq)},[iq]),(0,a.useEffect)(()=>{S.current?.setStatVideoParticleSize(iQ)},[iQ]),(0,a.useEffect)(()=>{S.current?.setStatVideoFrameColor(i1)},[i1]),(0,a.useEffect)(()=>{S.current?.setStatVideoAspect(i3)},[i3]),(0,a.useEffect)(()=>{S.current?.setStatVideoParticleCount(i4)},[i4]),(0,a.useEffect)(()=>{S.current?.setStatVideoFrameThickness(i8)},[i8]),(0,a.useEffect)(()=>{S.current?.setStatVideoCornerRadius(i7)},[i7]),(0,a.useEffect)(()=>{S.current?.setStatGlassDepth(lt)},[lt]),(0,a.useEffect)(()=>{S.current?.setStatGlassYBase(lr)},[lr]),(0,a.useEffect)(()=>{S.current?.setStatGlassIor(lo)},[lo]),(0,a.useEffect)(()=>{S.current?.setStatGlassTransmission(ll)},[ll]),(0,a.useEffect)(()=>{S.current?.setStatGlassRoughness(lu)},[lu]),(0,a.useEffect)(()=>{S.current?.setStatGlassMetalness(lf)},[lf]),(0,a.useEffect)(()=>{S.current?.setStatGlassThickness(lp)},[lp]),(0,a.useEffect)(()=>{S.current?.setStatGlassClearcoat(lm)},[lm]),(0,a.useEffect)(()=>{S.current?.setStatGlassClearcoatRoughness(lS)},[lS]),(0,a.useEffect)(()=>{S.current?.setStatGlassAttenuationColor(ly)},[ly]),(0,a.useEffect)(()=>{S.current?.setStatGlassReflectivity(lx)},[lx]),(0,a.useEffect)(()=>{S.current?.setStatGlassDispersion(lT)},[lT]),(0,a.useEffect)(()=>{S.current?.setStatGlassCornerRadius(lb)},[lb]),(0,a.useEffect)(()=>{S.current?.setStatGlassVideoRadius(lO)},[lO]),(0,a.useEffect)(()=>{S.current?.setStatGlassIridescence(lM)},[lM]),(0,a.useEffect)(()=>{S.current?.setStatGlassIridescenceIor(lG)},[lG]),(0,a.useEffect)(()=>{S.current?.setStatGlassHaloColor(lB)},[lB]),(0,a.useEffect)(()=>{S.current?.setStatGlassHaloStrength(lz)},[lz]),(0,a.useEffect)(()=>{S.current?.setStatGlassHaloSize(lH)},[lH]),(0,a.useEffect)(()=>{S.current?.setStatGlassInitRot(lN,lI,lV)},[lN,lI,lV]),(0,a.useEffect)(()=>{S.current?.setStatGlassInitScale(lX)},[lX]),(0,a.useEffect)(()=>{S.current?.setStatGlassExitRot(l_,lJ,lq)},[l_,lJ,lq]),(0,a.useEffect)(()=>{S.current?.setStatGlassTiles(lQ,l1)},[lQ,l1]),(0,a.useEffect)(()=>{S.current?.setStatGlassTileGap(l3)},[l3]),(0,a.useEffect)(()=>{S.current?.setStatGlassWaveTriggers(l4,l8,l7,nt)},[l4,l8,l7,nt]),(0,a.useEffect)(()=>{S.current?.setStatGlassHoverStrength(nr)},[nr]),(0,a.useEffect)(()=>{S.current?.setStatGlassHoverRadius(no)},[no]),(0,a.useEffect)(()=>{S.current?.setStatGlassEmissiveIntensity(nu)},[nu]),(0,a.useEffect)(()=>{S.current?.setStatGlassSheen(nf)},[nf]),(0,a.useEffect)(()=>{S.current?.setStatGlassSheenRoughness(np)},[np]),(0,a.useEffect)(()=>{S.current?.setStatGlassSheenColor(nm)},[nm]),(0,a.useEffect)(()=>{S.current?.setStatGlassBlendingMode(nS)},[nS]),(0,a.useEffect)(()=>{S.current?.setStatGlassCausticIntensity(ny)},[ny]),(0,a.useEffect)(()=>{S.current?.setStatGlassCausticScale(nx)},[nx]),(0,a.useEffect)(()=>{S.current?.setStatGlassCausticSpeed(nT)},[nT]),(0,a.useEffect)(()=>{S.current?.setStatGlassCausticColor(nb)},[nb]),(0,a.useEffect)(()=>{S.current?.setStatGlassFresnelStrength(nO)},[nO]),(0,a.useEffect)(()=>{S.current?.setStatGlassFresnelPower(nM)},[nM]),(0,a.useEffect)(()=>{S.current?.setStatGlassFresnelColor(nG)},[nG]),(0,a.useEffect)(()=>{S.current?.setStatGlassFresnelInvert(nB)},[nB]),(0,a.useEffect)(()=>{S.current?.setStatGlassFresnelBlend(nz)},[nz]),(0,a.useEffect)(()=>{S.current?.setStatGlassCausticBlend(nH)},[nH]),(0,a.useEffect)(()=>{S.current?.setStatGlassHaloBlend(nN)},[nN]),(0,a.useEffect)(()=>{S.current?.setStatGlassBumpStrength(nI)},[nI]),(0,a.useEffect)(()=>{S.current?.setStatGlassBumpScale(nV)},[nV]),(0,a.useEffect)(()=>{S.current?.setStatGlassBumpDistortion(nX)},[nX]),(0,a.useEffect)(()=>{S.current?.setStatGlassVertexBumpStrength(n_)},[n_]),(0,a.useEffect)(()=>{S.current?.setStatGlassFrostStrength(nJ)},[nJ]),(0,a.useEffect)(()=>{S.current?.setStatGlassOilStrength(nq)},[nq]),(0,a.useEffect)(()=>{S.current?.setStatGlassOilRadius(nQ)},[nQ]),(0,a.useEffect)(()=>{S.current?.setStatGlassOilScale(n1)},[n1]),(0,a.useEffect)(()=>{S.current?.setStatGlassOilSpeed(n3)},[n3]),(0,a.useEffect)(()=>{S.current?.setStatGlassOilColorA(n4)},[n4]),(0,a.useEffect)(()=>{S.current?.setStatGlassOilColorB(n8)},[n8]),(0,a.useEffect)(()=>{S.current?.setStatGlassTileOilStrength(n7)},[n7]),(0,a.useEffect)(()=>{S.current?.setStatGlassTileOilColorA(ut)},[ut]),(0,a.useEffect)(()=>{S.current?.setStatGlassTileOilColorB(ur)},[ur]),(0,a.useEffect)(()=>{S.current?.setStatGlassTileOilSpeed(uo)},[uo]),(0,a.useEffect)(()=>{S.current?.setStatGlassTileOilScale(ul)},[ul]),(0,a.useEffect)(()=>{S.current?.setStatGlassTileOilRadius(uu)},[uu]),(0,a.useEffect)(()=>{S.current?.setStatGlassTileTrailLife(uf)},[uf]),(0,a.useEffect)(()=>{S.current?.setStatGlassTileTrailTaper(up)},[up]),(0,a.useEffect)(()=>{S.current?.setStatGlassTileTrailBlur(um)},[um]),(0,a.useEffect)(()=>{S.current?.setStatGlassHoverScale(nl)},[nl]),(0,a.useEffect)(()=>{S.current?.setStatGlassMatcapStrength(uS)},[uS]),(0,a.useEffect)(()=>{S.current?.setStatGlassMatcapAngle(uy)},[uy]),(0,a.useEffect)(()=>{S.current?.setStatGlassMatcapElevation(ux)},[ux]),(0,a.useEffect)(()=>{S.current?.setStatGlassMatcapSharpness(uT)},[uT]),(0,a.useEffect)(()=>{S.current?.setStatGlassMatcapColor(ub)},[ub]),(0,a.useEffect)(()=>{S.current?.setOilTaperPower(rx)},[rx]),(0,a.useEffect)(()=>{S.current?.setOilMaskNoise(rT)},[rT]),(0,a.useEffect)(()=>{S.current?.setOilMaskNoiseScale(rb)},[rb]),(0,a.useEffect)(()=>{S.current?.setOilRingStrength(rO)},[rO]),(0,a.useEffect)(()=>{S.current?.setOilRingWidth(rM)},[rM]),(0,a.useEffect)(()=>{S.current?.setOilRingBlur(rG)},[rG]),(0,a.useEffect)(()=>{S.current?.setOilSpreadRate(rB)},[rB]),(0,a.useEffect)(()=>{try{window.localStorage.setItem(D,JSON.stringify({noiseScale:_,displacement:J,baseColor:q,peakColor:Q,fogColor:et,fogInner:er,fogOuter:eo,focusX:el,focusZ:eu,waveSpeed:ef,waveAmplitude:ep,waveLength:em,waveFalloff:eS,pulseWidth:ey,hoverRadius:ex,hoverStrength:eT,hoverEasing:eb,baseAmplitude:eO,baseSpeed:eM,baseWavelength:eG,animating:eB,lightAngle:ez,lightElevation:eH,lightColor:eN,bumpiness:eI,specularStrength:eV,specularSharpness:eX,particlesOn:e_,particleColor:eJ,particleSize:eq,particleOpacity:eQ,particleLift:e1,particleSizeJitter:e3,particleXZJitter:e4,particleYJitter:e8,wireOn:e7,wireColor:tt,wireThickness:tr,wireOpacity:to,wireDensity:tl,glowSpread:tu,glowStrength:tf,revealRadius:tp,revealBlur:tm,revealNoiseScale:tS,revealNoiseStrength:ty,contourSpacing:tx,emissionOn:tT,emissionStrength:tb,emissionSize:tO,emissionDirBias:tM,bumpNoiseScale:tG,bumpNoiseStrength:tB,causticsOn:tz,causticsColor:tH,causticsIntensity:tN,causticsScale:tI,causticsSpeed:tV,causticsContrast:tX,causticsDistort:t_,dustOn:tJ,dustColor:tq,dustOpacity:tQ,dustSize:t1,dustSizeJitter:t3,dustSpeed:t4,dustRise:t8,dustWander:t7,postOn:at,postCA:ar,postLens:ao,pWaveOn:al,pWaveBoost:au,pWaveSpeed:af,pWavePeriod:ap,pWaveWidth:am,rippleOn:aS,rippleColor:ay,rippleIntensity:ax,rippleSpeed:aT,rippleSoftness:ab,rippleLife:aO,rippleNoiseScale:aM,rippleNoiseStrength:aG,volumeOn:aB,volumeDensity:az,volumeYFalloff:aH,volumeMaxDist:aN,volumeSteps:aI,volumeSharpness:aV,volumeFocusBias:aX,scrollOn:a_,scrollSpeed:aJ,scrollRotateX:aq,scrollRotateY:aQ,scrollRotateZ:a1,scrollZoom:a3,corridorOn:a4,corridorWidth:a8,corridorHeight:a7,corridorSharpness:rt,oilOn:rr,oilColorA:ro,oilColorB:rl,oilIntensity:ru,oilNoiseScale:rf,oilSpeed:rp,oilRevealRadius:rm,oilRevealBlur:rS,oilTrailLife:ry,oilTaperPower:rx,oilMaskNoise:rT,oilMaskNoiseScale:rb,oilRingStrength:rO,oilRingWidth:rM,oilRingBlur:rG,oilSpreadRate:rB,statColorA:rz,statColorB:rH,statYOffset:rN,statParticleSize:rI,statScatterRadius:rV,statScatterHeight:rX,statFormJitter:r_,statHoverRadius:rJ,statHoverRepel:rq,statHoverScale:rQ,statHoverGlow:r1,statHoverGlowColor:r3,statHoverStiffness:r4,statHoverDamping:r8,pTunnelTriggerStartCamZ_v2:r7,pTunnelTriggerEndCamZ_v2:st,pTunnelRadius:sr,pTunnelCenterY:so,pTunnelScatter:sl,pTunnelSpiralTurns:su,pTunnelSpiralPitch:sf,pTunnelRotSpeed:sp,pTunnelSurfaceDarkenMax:sm,pTunnelColorFar:sS,pTunnelGradStart:sy,pTunnelGradEnd:sx,particleHoverColor:sT,particleHoverStrength:sb,pLightDirX:sO,pLightDirY:sM,pLightDirZ:sG,pAmbient:sB,pDiffuse:sz,pSpec:sH,pSpecPower:sN,cylWireGridU:sI,cylWireGridV:sV,cylWireLineWidth:sX,cylWireLineSoftness:s_,cylWireOpacity:sJ,cylWireColor:sq,cylWireTwist:sQ,cylWireFogStart:s1,cylWireFogEnd:s3,cylWireRotSpeed:s4,cylWireFogNearStart:s8,cylWireFogNearEnd:s7,cylWireHoverRadius:ot,cylWireHoverStrength:or,outroPhase1AppearCamZ_v4:oo,outroPhaseSplitCamZ_v4:ol,outroButtonAppearCamZ_v4:ou,outroButtonGapVw:of,outroButtonMagnetRadius:oI,outroButtonMagnetStrength:oV,mobileIntroSizeVw:oX,mobileTitleSizeVw:o_,mobileOutroSizeVw:oJ,mobileLineHeight:oq,mobileOutroButtonGapVw:oQ,mobilePreLabelGapEm:o1,mobilePostLabelGapEm:o3,mobilePostLabelSizeEm:o4,copyDesktopPx:op,copyMobilePx:om,noiseTunOn:oS,noiseTunColor:oy,noiseTunSize:ox,noiseTunScale:oT,noiseTunDeform:ob,noiseTunOpacity:oO,noiseTunSpeed:oM,noiseTunRotSpeed:oG,noiseTunFogNearStart:oB,noiseTunFogNearEnd:oz,noiseTunFogFarStart:oH,noiseTunFogFarEnd:oN,outroButtonPaddingX:o8,outroButtonPaddingY:o7,outroButtonRadius:it,statTriggerOffset:ir,statFormInMs:io,statFormOutMs:il,statIdleWiggle:ic,statSpacing:ip,statFirstZ:im,statLabelText0:iS,statLabelText1:iy,statLabelText2:ix,statLabelText3:iT,statLabelAppearOffset:ib,statLabelDisappearOffset:iO,statLabelSizeVw:iM,statLabelPostGapEm:iG,progressClickOffset:iB,statLabelSuper0:iH,statLabelSuper1:iN,statLabelSuper2:iI,statLabelSuper3:iV,statLabelSupColor:iX,statVideoRectWidth:i_,statVideoRectHeight:iJ,statVideoAspect:i3,statVideoYOffset:iq,statVideoParticleSize:iQ,statVideoParticleCount:i4,statVideoFrameColor:i1,statVideoFrameThickness:i8,statVideoCornerRadius:i7,statGlassDepth:lt,statGlassYBase:lr,statGlassIor:lo,statGlassTransmission:ll,statGlassRoughness:lu,statGlassMetalness:lf,statGlassThickness:lp,statGlassClearcoat:lm,statGlassClearcoatRoughness:lS,statGlassAttenuationColor:ly,statGlassReflectivity:lx,statGlassDispersion:lT,statGlassCornerRadius:lb,statGlassVideoRadius:lO,statGlassIridescence:lM,statGlassIridescenceIor:lG,statGlassHaloColor:lB,statGlassHaloStrength:lz,statGlassHaloSize:lH,statGlassInitRotX:lN,statGlassInitRotY:lI,statGlassInitRotZ:lV,statGlassInitScale:lX,statGlassTilesX:lQ,statGlassTilesY:l1,statGlassTileGap:l3,statGlassHoverStrength:nr,statGlassHoverRadius:no,statGlassHoverScale:nl,statGlassSheen:nf,statGlassSheenRoughness:np,statGlassSheenColor:nm,statGlassBlendingMode:nS,statGlassCausticIntensity:ny,statGlassCausticScale:nx,statGlassCausticSpeed:nT,statGlassCausticColor:nb,statGlassFresnelStrength:nO,statGlassFresnelPower:nM,statGlassFresnelColor:nG,statGlassFresnelInvert:nB,statGlassFresnelBlend:nz,statGlassCausticBlend:nH,statGlassHaloBlend:nN,statGlassBumpStrength:nI,statGlassBumpScale:nV,statGlassBumpDistortion:nX,statGlassVertexBumpStrength:n_,statGlassFrostStrength:nJ,statGlassOilStrength:nq,statGlassOilRadius:nQ,statGlassOilScale:n1,statGlassOilSpeed:n3,statGlassOilColorA:n4,statGlassOilColorB:n8,statGlassTileOilStrength:n7,statGlassTileOilColorA:ut,statGlassTileOilColorB:ur,statGlassTileOilSpeed:uo,statGlassTileOilScale:ul,statGlassTileOilRadius:uu,statGlassTileTrailLife:uf,statGlassTileTrailTaper:up,statGlassTileTrailBlur:um,statGlassMatcapStrength:uS,statGlassMatcapAngle:uy,statGlassMatcapElevation:ux,statGlassMatcapSharpness:uT,statGlassMatcapColor:ub}))}catch{}},[_,J,q,Q,et,er,eo,el,eu,ef,ep,em,eS,ey,ex,eT,eb,eO,eM,eG,eB,ez,eH,eN,eI,eV,eX,e_,eJ,eq,eQ,e1,e3,e4,e8,e7,tt,tr,to,tl,tu,tf,tp,tm,tS,ty,tx,tT,tb,tO,tM,tG,tB,tz,tH,tN,tI,tV,tX,t_,tJ,tq,tQ,t1,t3,t4,t8,t7,at,ar,ao,al,au,af,ap,am,aS,ay,ax,aT,ab,aO,aM,aG,aB,az,aH,aN,aI,aV,aX,a_,aJ,aq,aQ,a1,a3,a4,a8,a7,rt,rr,ro,rl,ru,rf,rp,rm,rS,ry,rx,rT,rb,rz,rH,rN,rI,rV,rX,r_,rJ,rq,rQ,r1,r3,r4,r8,ir,io,il,ic,ip,im,iS,iy,ix,iT,ib,iO,iM,iG,iB,iH,iN,iI,iV,iX,i_,iJ,i3,iq,iQ,i4,i1,i8,i7,lt,lr,lo,ll,lu,lf,lp,lm,lS,ly,lx,lT,lb,lO,lM,lG,lB,lz,lH,lN,lI,lV,lX,l_,lJ,lq,lQ,l1,l3,l4,l8,l7,nt,nr,no,nl,nu,nf,np,nm,nS,ny,nx,nT,nb,nO,nM,nG,nB,nz,nH,nN,nI,nV,nX,n_,nJ,nq,nQ,n1,n3,n4,n8,n7,ut,ur,uo,ul,uu,uf,up,um,uS,uy,ux,uT,ub,r7,st,sr,so,sl,su,sf,sp,sm,sS,sy,sx,sT,sb,sO,sM,sG,sB,sz,sH,sN,sI,sV,sX,s_,sJ,sq,sQ,s1,s3,s4,s8,s7,ot,or,oo,ol,ou,of,oI,oV,o8,o7,it,oX,o_,oJ,oq,oQ,o1,o3,o4,op,om,oS,oy,ox,oT,ob,oO,oM,oG,oB,oz,oH,oN]),(0,t.jsxs)("div",{className:"relative h-full w-full",children:[(0,t.jsx)("style",{children:`
        :root {
          --ir-copy: var(--ir-copy-desktop-px, ${op}px);
        }
        @media (max-width: 768px) {
          :root {
            --ir-copy: var(--ir-copy-mobile-px, ${om}px);
          }
          .in-review-title-label {
            font-size: var(--ir-title-vw, ${o_}vw) !important;
            line-height: var(--ir-line-h, ${oq}) !important;
            position: absolute !important;
            left: 0 !important;
            right: 0 !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: 100vw !important;
            max-width: 100vw !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
            box-sizing: border-box !important;
            text-align: center !important;
            white-space: normal !important;
            word-break: normal;
            overflow-wrap: normal;
          }
          .in-review-outro-label {
            font-size: var(--ir-outro-vw, ${oJ}vw) !important;
            line-height: var(--ir-line-h, ${oq}) !important;
            position: absolute !important;
            left: 0 !important;
            right: 0 !important;
            top: 46% !important;
            transform: translateY(-50%) !important;
            width: 100vw !important;
            max-width: 100vw !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
            box-sizing: border-box !important;
            display: block !important;
            text-align: center !important;
            white-space: normal !important;
            word-break: normal;
            overflow-wrap: normal;
          }
          .in-review-cta-wrap {
            top: calc(46% + var(--ir-outro-gap-vw, ${oQ}vw)) !important;
          }
          .in-review-title-sup {
            display: none !important;
          }
          .in-review-pre-label {
            margin-bottom: var(--ir-pre-gap-em, ${o1}em) !important;
          }
          .in-review-post-label {
            margin-top: calc(var(--ir-post-gap-em, ${o3}em) + 8px) !important;
            font-size: var(--ir-post-size-em, ${o4}em) !important;
          }
        }
      `}),(0,t.jsx)("div",{ref:f,className:(0,o.cn)("h-full w-full select-none",n?"[touch-action:pan-y]":"[touch-action:none]",e)}),n?null:(0,t.jsx)("div",{ref:d,className:"pointer-events-none absolute inset-0 overflow-hidden grid place-items-center"}),n?null:(0,t.jsx)("div",{ref:p,className:"pointer-events-auto absolute bottom-0 left-1/2 z-10 -translate-x-1/2 hidden md:flex items-end justify-center",style:{height:80}})]})}],986291)},666376,function(e){e.n(e.i(986291))}]);

//# debugId=59369643-18e6-8508-e12f-65c3c7407ddb