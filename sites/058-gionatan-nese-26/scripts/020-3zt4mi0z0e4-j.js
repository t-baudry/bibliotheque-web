(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,99222,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(90072),o=e.i(8560),l=e.i(18268);let i="Gionatan Nese",n="©2026 All Rights Reserved",s=[{family:"Lay Grotesk",weight:"500",url:"/fonts/LayGrotesk-Medium.woff"},{family:"Teodor",weight:"300",url:"/fonts/Teodor-Light.woff"},{family:"Teodor",weight:"400",url:"/fonts/Teodor-Regular.woff"}];e.s(["default",0,function({project:e}){let u=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let t,a=u.current;if(!a||!e)return;let c=e.detail||{},d={bg:"#ffffff",ink:"#0a0a0a",ease:.12,pagePadPx:8,topPadPx:200,blockGapPx:8,pairGapPx:8,headGapPx:10,headBotPx:80,headNameSizePx:16,headTypeSizePx:17,headLineMul:1.15,footerTopPx:80,footerBotPx:16,footerSizePx:13,teodor:"'Teodor', serif",grotesk:"'Lay Grotesk', sans-serif",glassBandTopPct:.08,glassBandBotPct:.08,glassStrength:1,glassCurve:1,chromatic:.01},m=window.visualViewport,p=()=>{let e=m?m.height:window.innerHeight;a.style.height=Math.round(e)+"px"};p();let v=a.clientWidth,h=a.clientHeight,f=Math.min(window.devicePixelRatio,2),x=v<=640,g=new r.Scene,P=35*Math.PI/180,y=new r.PerspectiveCamera(35,v/h,1,1e4),w=()=>{y.position.set(v/2,-h/2,h/2/Math.tan(P/2)),y.lookAt(v/2,-h/2,0),y.aspect=v/h,y.updateProjectionMatrix()};w();let S=new o.WebGLRenderer({antialias:!0,alpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});S.setPixelRatio(f),S.setSize(v,h),S.outputColorSpace=r.SRGBColorSpace,S.setClearColor(new r.Color(d.bg),1),S.domElement.style.display="block",S.domElement.style.touchAction="none",S.domElement.style.overscrollBehavior="none",S.domElement.style.webkitUserSelect="none",S.domElement.style.userSelect="none",S.domElement.style.webkitTouchCallout="none",a.querySelectorAll("canvas").forEach(e=>e.parentNode&&e.parentNode.removeChild(e)),a.appendChild(S.domElement);let T=new r.Group;g.add(T);let E=`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,b=`
      uniform sampler2D uTex;
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        vec4 c = texture2D(uTex, vUv);
        gl_FragColor = vec4(c.rgb, c.a * uOpacity);
      }
    `,M=`
      uniform sampler2D uTex;
      uniform float uOpacity;
      uniform float uReveal;   // 0 = skeleton placeholder, 1 = loaded media
      uniform float uTime;     // seconds, drives the skeleton shimmer sweep
      uniform vec2 uUvScale;
      uniform vec2 uUvOffset;
      varying vec2 vUv;
      void main() {
        float sweep = fract(uTime * 0.6);
        float pos = (vUv.x + vUv.y) * 0.5;
        float band = smoothstep(0.18, 0.0, abs(pos - sweep));
        vec3 skel = vec3(0.914) + band * 0.05; // ~#E9E9E9, brightening in the band

        vec2 uv = vUv * uUvScale + uUvOffset;
        vec4 c = texture2D(uTex, uv);

        vec3 rgb = mix(skel, c.rgb, uReveal);
        float a = mix(1.0, c.a, uReveal) * uOpacity;
        gl_FragColor = vec4(rgb, a);
      }
    `,B=new r.WebGLRenderTarget(v*f,h*f,{samples:4,minFilter:r.LinearFilter,magFilter:r.LinearFilter}),C=`
      uniform sampler2D tDiffuse;
      uniform float uBandTop;
      uniform float uBandBot;
      uniform float uStrength;
      uniform float uCurve;
      uniform float uChromaticAberration;
      varying vec2 vUv;

      float sag(float t) {
        t = clamp(pow(t, uCurve), 0.0, 1.0);
        return 1.0 - sqrt(1.0 - t * t);
      }

      void main() {
        vec2 uv = vUv; // uv.y: 0 = bottom, 1 = top
        float dist = 0.0;

        if (uBandTop > 0.0 && uv.y > 1.0 - uBandTop) {
          float t = (uv.y - (1.0 - uBandTop)) / uBandTop;
          dist = sag(t) * uBandTop * uStrength;
          uv.y -= dist;
        } else if (uBandBot > 0.0 && uv.y < uBandBot) {
          float t = (uBandBot - uv.y) / uBandBot;
          dist = sag(t) * uBandBot * uStrength;
          uv.y += dist;
        }

        uv = clamp(uv, vec2(0.0), vec2(1.0));

        if (dist == 0.0 || uChromaticAberration == 0.0) {
          gl_FragColor = texture2D(tDiffuse, uv);
          return;
        }

        vec3 finalColor = vec3(0.0);
        vec3 weightSum = vec3(0.0);
        for (int i = 0; i < 16; i++) {
          float t = float(i) / 15.0;
          vec3 w = vec3(
            smoothstep(0.8, 0.2, t),
            smoothstep(0.0, 0.5, t) * smoothstep(1.0, 0.5, t),
            smoothstep(0.2, 0.8, t)
          );
          float shift = (t - 0.5) * uChromaticAberration * dist * 30.0;
          vec2 sampleUv = clamp(uv + vec2(0.0, shift), vec2(0.0), vec2(1.0));
          finalColor += texture2D(tDiffuse, sampleUv).rgb * w;
          weightSum += w;
        }
        finalColor /= weightSum;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,L={tDiffuse:{value:B.texture},uBandTop:{value:d.glassBandTopPct},uBandBot:{value:d.glassBandBotPct},uStrength:{value:d.glassStrength},uCurve:{value:d.glassCurve},uChromaticAberration:{value:d.chromatic}},D=new r.Scene,A=new r.OrthographicCamera(-1,1,1,-1,0,1),U=new r.Mesh(new r.PlaneGeometry(2,2),new r.ShaderMaterial({uniforms:L,vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,fragmentShader:C,depthTest:!1,depthWrite:!1}));D.add(U);let G=[],k=e=>{let t=e.userData.opts,a=v-2*d.pagePadPx,o=t.maxWidthPx?Math.min(t.maxWidthPx,a):0,{texture:l,wPx:i,hPx:n,ascentPx:s,padPx:u}=((e,t)=>{let a,{sizePx:o,font:l,color:i,maxWidthPx:n=0,lineStepPx:s,align:u="left",letterSpacingPx:c=0}=t,d=e=>{e.font=`${o}px ${l}`,e.textBaseline="alphabetic","letterSpacing"in e&&(e.letterSpacing=`${c}px`)},m=document.createElement("canvas").getContext("2d");d(m);let p=e=>String(e).split(/\r?\n/);if(Array.isArray(e))a=e.flatMap(p);else{let t=p(e);a=n>0?t.flatMap(e=>e.length?((e,t,a)=>{let r=t.split(/\s+/).filter(Boolean),o=[],l="";for(let t of r){let r=l?l+" "+t:t;e.measureText(r).width>a&&l?(o.push(l),l=t):l=r}return l&&o.push(l),o})(m,e,n):[""]):t}0===a.length&&(a=[""]);let v=s||Math.ceil(1.2*o),h=0;a.forEach(e=>{h=Math.max(h,m.measureText(e).width)});let x=Math.ceil(n>0?Math.max(n,h):h)+2,g=m.measureText(a[0]||"M"),P=m.measureText(a[a.length-1]||"M"),y=g.actualBoundingBoxAscent||.8*o,w=P.actualBoundingBoxDescent||.2*o,T=Math.ceil(v*(a.length-1)+y+w)+2,E=document.createElement("canvas");E.width=Math.max(1,x*f),E.height=Math.max(1,T*f);let b=E.getContext("2d");b.scale(f,f),d(b),b.fillStyle=i,b.textAlign="center"===u?"center":"left";let M="center"===u?x/2:1;a.forEach((e,t)=>{b.fillText(e,M,1+y+t*v)});let B=new r.CanvasTexture(E);return B.colorSpace=r.SRGBColorSpace,B.minFilter=r.LinearFilter,B.generateMipmaps=!1,B.anisotropy=S.capabilities.getMaxAnisotropy(),{texture:B,wPx:x,hPx:T,ascentPx:y,padPx:1}})(e.userData.input,{...t,maxWidthPx:o}),c=e.material.uniforms.uTex.value;e.material.uniforms.uTex.value=l,c&&c.dispose(),e.userData.wPx=i,e.userData.hPx=n,e.userData.ascentPx=s,e.userData.padPx=u,e.geometry.dispose(),e.geometry=new r.PlaneGeometry(i,n,1,1)},F=(e,t)=>{let a=new r.ShaderMaterial({uniforms:{uTex:{value:null},uOpacity:{value:1}},vertexShader:E,fragmentShader:b,transparent:!0}),o=new r.Mesh(new r.PlaneGeometry(1,1,1,1),a);return o.userData={input:e,opts:t,wPx:1,hPx:1,isText:!0},T.add(o),G.push(o),k(o),o},R=(e,t,a,r,o)=>{e.position.x=t+r/2,e.position.y=-(a+o/2)},z=(e,t,a)=>{let r=e.mat.uniforms;if(!r.uUvScale)return;let o=t/a,l=e.aspect||o,i=1,n=1;o>l?n=l/o:i=o/l,r.uUvScale.value.set(i,n),r.uUvOffset.value.set((1-i)/2,(1-n)/2)},O=new r.TextureLoader;O.crossOrigin="anonymous";let W=[],_=[],N={value:0},$=1.5*h,H=(e,t,{eager:a=!1,ar:o=null}={})=>{let i=(e=>{if(!e)return null;if("string"==typeof e)return e;let t=(x?e.m:e.d)||e.d||e.m||null;if(t&&(0,l.isWebmUrl)(t)&&!(0,l.canUseWebmTexture)(t)){let a=t===e.m?e.d:e.m;if(a&&(!(0,l.isWebmUrl)(a)||(0,l.canUseWebmTexture)(a)))return a}return t})(e),n=!x&&!!t,s=new r.ShaderMaterial({uniforms:{uTex:{value:null},uOpacity:{value:1},uReveal:{value:0},uTime:N,uUvScale:{value:new r.Vector2(1,1)},uUvOffset:{value:new r.Vector2(0,0)}},vertexShader:E,fragmentShader:M,transparent:!0}),u=new r.Mesh(new r.PlaneGeometry(1,1,1,1),s);T.add(u);let c={mesh:u,mat:s,aspect:n?t:o||1,fixedAspect:n?t:null,naturalAspect:o||null,reveal:0,loaded:!1,loadStarted:!1,yPx:0},d=()=>{if(!c.loadStarted&&i)if(c.loadStarted=!0,i&&/\.(webm|mp4|m4v|mov)$/i.test(i)){let e=document.createElement("video");a&&(e.fetchPriority="high"),e.src=i,e.loop=!0,e.muted=!0,e.playsInline=!0,e.setAttribute("playsinline",""),e.setAttribute("webkit-playsinline",""),e.preload="auto",e.crossOrigin="anonymous",_.push(e);let t=new r.VideoTexture(e);t.colorSpace=r.SRGBColorSpace,t.minFilter=r.LinearFilter,t.magFilter=r.LinearFilter,t.generateMipmaps=!1,s.uniforms.uTex.value=t,s.uniforms.uOpacity.value=1,e.addEventListener("loadedmetadata",()=>{e.videoWidth&&e.videoHeight&&(c.naturalAspect=e.videoWidth/e.videoHeight,c.fixedAspect||(c.aspect=c.naturalAspect)),c.loaded=!0,Z()});let o=()=>e.play().catch(()=>{});e.addEventListener("canplay",o,{once:!0}),o()}else a&&(0,l.preloadAssets)([i],{priority:"high"}),O.load(i,e=>{e.minFilter=r.LinearMipmapLinearFilter,e.anisotropy=S.capabilities.getMaxAnisotropy(),s.uniforms.uTex.value=e,s.uniforms.uOpacity.value=1,c.naturalAspect=e.image.width/e.image.height,c.fixedAspect||(c.aspect=c.naturalAspect),c.loaded=!0,Z()},void 0,()=>{c.loaded=!0,Z()})};return c.startLoad=d,a&&d(),W.push(c),c},V=(c.blocks||[]).map((e,t)=>{let a=0===t;if("pair"===e.type){let[t,r]=e.aspects||[],o=e.ars||[];return{type:"pair",cells:[H(e.files&&e.files[0],t||null,{eager:a,ar:o[0]}),H(e.files&&e.files[1],r||null,{eager:a,ar:o[1]})]}}return"spacer"===e.type?{type:"spacer",height:e.height||0}:{type:"full",cell:H(e.file,e.aspect||null,{eager:a,ar:e.ar})}}),j=e.name?F(e.name,{sizePx:d.headNameSizePx,font:d.grotesk,color:d.ink,align:"center",lineStepPx:Math.round(d.headNameSizePx*d.headLineMul)}):null,q=e.overview?.category?F(e.overview.category,{sizePx:d.headTypeSizePx,font:d.teodor,color:d.ink,align:"center",lineStepPx:Math.round(d.headTypeSizePx*d.headLineMul)}):null,Y={sizePx:d.footerSizePx,font:d.teodor,color:d.ink,align:"center"},I=F(`${i} ${n}`,Y),K=F(i,Y),J=F(n,Y);[I,K,J].forEach(e=>e.layers.set(1));let Q=h,X=(e,t)=>(R(e,(v-e.userData.wPx)/2,t,e.userData.wPx,e.userData.hPx),t+e.userData.hPx),Z=()=>{let e,t=v-2*d.pagePadPx,a=d.topPadPx;j&&(a=X(j,a)),j&&q&&(a+=d.headGapPx),q&&(a=X(q,a)),(j||q)&&(a+=d.headBotPx);let o=a;V.forEach(e=>{if("full"===e.type){let l=t/(e.cell.aspect||1);e.cell.mesh.geometry.dispose(),e.cell.mesh.geometry=new r.PlaneGeometry(t,l,1,1),R(e.cell.mesh,d.pagePadPx,a,t,l),e.cell.yPx=a,a+=l,o=a,a+=d.blockGapPx}else if("pair"===e.type)if(x)e.cells.forEach((o,l)=>{let i=t/(o.aspect||1);o.mesh.geometry.dispose(),o.mesh.geometry=new r.PlaneGeometry(t,i,1,1),R(o.mesh,d.pagePadPx,a,t,i),z(o,t,i),o.yPx=a,a+=i,l<e.cells.length-1&&(a+=d.pairGapPx)}),o=a,a+=d.blockGapPx;else{let l=(t-d.pairGapPx)/2,i=Math.max(...e.cells.map(e=>l/(e.aspect||1)));e.cells.forEach((e,t)=>{e.mesh.geometry.dispose(),e.mesh.geometry=new r.PlaneGeometry(l,i,1,1);let o=d.pagePadPx+t*(l+d.pairGapPx);R(e.mesh,o,a,l,i),z(e,l,i),e.yPx=a}),a+=i,o=a,a+=d.blockGapPx}else"spacer"===e.type&&(a+=e.height,o=a)});let l=o+d.footerTopPx,i=v<=640;if(I.visible=!i,K.visible=i,J.visible=i,i){let t=[K,J],a=Math.max(...t.map(e=>e.userData.ascentPx)),r=e=>l+(a-e.userData.ascentPx);R(K,d.pagePadPx,r(K),K.userData.wPx,K.userData.hPx),R(J,v-d.pagePadPx-J.userData.wPx,r(J),J.userData.wPx,J.userData.hPx),e=Math.max(...t.map(e=>r(e)+e.userData.hPx))}else e=X(I,l);Q=Math.max(h,e+d.footerBotPx)},ee=()=>{a.clientWidth,d.pagePadPx=8,d.blockGapPx=8,d.pairGapPx=8};ee(),G.forEach(k),Z(),"FontFace"in window&&Promise.all(s.map(async e=>{try{let t=new FontFace(e.family,`url(${e.url})`,{weight:e.weight,style:"normal"});await t.load(),document.fonts.add(t)}catch{}})).then(()=>{G.forEach(k),Z()});let et=0,ea=0,er=0,eo=!1,el=()=>Math.max(0,Q-h),ei=e=>Math.min(el(),Math.max(0,e)),en=e=>{e.preventDefault(),eo=!1,er=0,et=ei(et+e.deltaY)};a.addEventListener("wheel",en,{passive:!1});let es=0,eu=!1,ec=0,ed=e=>{if(1!==e.touches.length){eu=!1;return}eu=!0,eo=!0,es=e.touches[0].clientY,ec=performance.now(),er=0},em=e=>{if(!eu||1!==e.touches.length)return;e.cancelable&&e.preventDefault();let t=e.touches[0].clientY,a=es-t;es=t;let r=performance.now(),o=Math.max(1,r-ec);ec=r,er=a/o*16,et=ei(et+a)},ep=e=>{0===e.touches.length&&(eu=!1)};a.addEventListener("touchstart",ed,{passive:!0}),a.addEventListener("touchmove",em,{passive:!1}),a.addEventListener("touchend",ep,{passive:!0}),a.addEventListener("touchcancel",ep,{passive:!0});let ev=0,eh=!1,ef=()=>{t=requestAnimationFrame(ef),!eh&&++ev>=2&&(eh=!0,window.__pageContentReady=!0,window.dispatchEvent(new Event("page-content-ready"))),!eu&&Math.abs(er)>.05?(et=ei(et+er),er*=.95,(et<=0||et>=el())&&(er=0)):eu||(er=0),eo?ea=et:ea+=(et-ea)*d.ease,T.position.y=ea,N.value=performance.now()/1e3;let e=ea+$;W.forEach(t=>{!t.loadStarted&&t.yPx<=e&&t.startLoad(),t.loaded&&t.reveal<1&&(t.reveal=Math.min(1,t.reveal+.08),t.mat.uniforms.uReveal.value=t.reveal)}),ex()};function ex(){y.layers.set(0),S.setRenderTarget(B),S.render(g,y),S.setRenderTarget(null),S.render(D,A),y.layers.set(1),S.autoClear=!1,S.render(g,y),S.autoClear=!0,y.layers.set(0)}ef(),S.domElement.__snapshotRender=ex;let eg=()=>{p(),v=a.clientWidth,h=a.clientHeight,S.setSize(v,h),B.setSize(v*f,h*f),w(),ee(),G.forEach(k),Z(),et=Math.min(et,el())};return window.addEventListener("resize",eg),m&&(m.addEventListener("resize",eg),m.addEventListener("scroll",eg)),()=>{cancelAnimationFrame(t),a.removeEventListener("wheel",en),a.removeEventListener("touchstart",ed),a.removeEventListener("touchmove",em),a.removeEventListener("touchend",ep),a.removeEventListener("touchcancel",ep),window.removeEventListener("resize",eg),m&&(m.removeEventListener("resize",eg),m.removeEventListener("scroll",eg)),T.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){let t=e.material.uniforms;t&&t.uTex&&t.uTex.value&&t.uTex.value.dispose(),e.material.dispose()}}),U.geometry.dispose(),U.material.dispose(),B.dispose(),S.dispose(),_.forEach(e=>{try{e.pause(),e.removeAttribute("src"),e.load()}catch(e){}}),S.domElement.parentNode&&S.domElement.parentNode.removeChild(S.domElement)}},[e?.slug]),(0,t.jsx)("div",{ref:u,"aria-hidden":"true",style:{position:"relative",width:"100%",height:"100dvh",overflow:"hidden",touchAction:"none",overscrollBehavior:"none"}})}])}]);