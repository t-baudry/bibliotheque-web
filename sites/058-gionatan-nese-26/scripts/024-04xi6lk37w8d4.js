(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,68675,e=>{"use strict";var t=e.i(43476),a=e.i(71645),o=e.i(18566),r=e.i(90072),i=e.i(8560),n=e.i(89970),l=e.i(84048),s=e.i(18268);let u="Gionatan Nese",d="©2026 All Rights Reserved",c=[{family:"Lay Grotesk",weight:"500",url:"/fonts/LayGrotesk-Medium.woff"},{family:"Teodor",weight:"300",url:"/fonts/Teodor-Light.woff"},{family:"Teodor",weight:"400",url:"/fonts/Teodor-Regular.woff"}];e.s(["default",0,function({onOpen:e,items:v=[]}={}){let{goToCase:h}=(0,l.usePageTransition)(),m=(0,a.useRef)(h);m.current=h;let p=(0,o.useRouter)(),f=(0,a.useRef)(p);f.current=p;let x=(0,a.useRef)(null),g=(0,a.useRef)(null);return(0,a.useEffect)(()=>{let t,a=x.current;if(!a)return;let o={cols:3,tileAspect:.75,pagePadPx:8,headTopPx:200,headBotPx:80,headGroteskSizePx:16,headTeodorSizePx:17,headGroteskTrackPct:-.01,headLineMul:1.2,colGapPx:8,rowGapPx:40,imgTextGapPx:12,titleSizePx:12,catSizePx:13,titleCatGapPx:6,soonMarginPx:8,soonGapPx:2,soonPadXPx:8,soonPadTopPx:6,soonPadBottomPx:4,soonRadiusPx:4,soonSizePx:12,soonLineHeight:1,soonBgAlpha:.5,soonBlurPx:40,textBlockPadPx:6,footerTopPx:240,footerSizePx:13,glassBandTopPct:.08,glassBandBotPct:.08,glassStrength:1,glassCurve:1,bg:"#ffffff",ink:"#0a0a0a",ease:.12,hoverEase:"power4.out",hoverFadeDuration:.45,hoverFadeEase:"power2.out",hoverBreakpointPx:1024,titleFont:"'Lay Grotesk', sans-serif",catFont:"'Teodor', serif",footerFont:"'Teodor', serif"},l=window.visualViewport,h=()=>{let e=l?l.height:window.innerHeight;a.style.height=Math.round(e)+"px"};h();let p=a.clientWidth,P=a.clientHeight,w=Math.min(window.devicePixelRatio,2),y=new r.Scene,S=35*Math.PI/180,b=new r.PerspectiveCamera(35,p/P,1,1e4),T=()=>{b.position.set(p/2,-P/2,P/2/Math.tan(S/2)),b.lookAt(p/2,-P/2,0),b.aspect=p/P,b.updateProjectionMatrix()};T();let M=new i.WebGLRenderer({antialias:!0,alpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});M.setPixelRatio(w),M.setSize(p,P),M.outputColorSpace=r.SRGBColorSpace,M.setClearColor(new r.Color(o.bg),1),M.domElement.style.display="block",M.domElement.style.touchAction="none",M.domElement.style.overscrollBehavior="none",M.domElement.style.webkitUserSelect="none",M.domElement.style.userSelect="none",M.domElement.style.webkitTouchCallout="none",a.querySelectorAll("canvas").forEach(e=>e.parentNode&&e.parentNode.removeChild(e)),a.appendChild(M.domElement);let B=new r.Group;y.add(B);let D=`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,E=`
      uniform sampler2D uTex;
      uniform sampler2D uTex2; // hover media, crossfaded in over uTex by uMix
      uniform float uOpacity;
      uniform float uMix;    // 0 = still image, 1 = hover video
      uniform float uReveal; // 0 = skeleton placeholder, 1 = loaded media
      uniform float uTime;   // seconds, drives the skeleton shimmer sweep
      uniform vec2 uUvScale;  // cover window: sampled sub-rect size...
      uniform vec2 uUvOffset; // ...and its top-left corner (see applyCoverUv)
      // The clip's own cover window. Separate from the pair above because the
      // still and the clip need not share an aspect ratio — each is cropped
      // into the same fixed tile box on its own terms.
      uniform vec2 uUvScale2;
      uniform vec2 uUvOffset2;
      varying vec2 vUv;

      void main() {
        float sweep = fract(uTime * 0.6);
        float pos = (vUv.x + vUv.y) * 0.5;
        float band = smoothstep(0.18, 0.0, abs(pos - sweep));
        vec3 skel = vec3(0.914) + band * 0.05; // ~#E9E9E9, brightening in the band

        // window into the part of each texture that covers the tile box
        vec2 uv = vUv;
        vec4 c = texture2D(uTex, uv * uUvScale + uUvOffset);
        // uTex2 is only ever bound while this tile is (or is becoming) the
        // hovered one — see attachHoverTex. At uMix 0 it is an unbound
        // sampler and the mix drops it entirely, exactly like uReveal does
        // for uTex before the tile's own media lands.
        vec4 v = texture2D(uTex2, uv * uUvScale2 + uUvOffset2);
        c = mix(c, v, uMix);

        vec3 rgb = mix(skel, c.rgb, uReveal);
        float a = mix(1.0, c.a, uReveal) * uOpacity;
        gl_FragColor = vec4(rgb, a);
      }
    `,U=`
      uniform sampler2D uTex;
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        vec4 c = texture2D(uTex, vUv);
        gl_FragColor = vec4(c.rgb, c.a * uOpacity);
      }
    `,C=`
      uniform sampler2D uTex;    // the chip's own text bitmap, padding baked in
      uniform sampler2D uSrc;    // the tile's media — what gets blurred
      uniform sampler2D uSrc2;   // its hover media, blurred alongside
      uniform float uOpacity;
      uniform float uMix;
      uniform float uReveal;
      uniform vec2  uUvScale;
      uniform vec2  uUvOffset;
      uniform vec2  uUvScale2;
      uniform vec2  uUvOffset2;
      uniform vec2  uImgSizePx;  // tile image's on-screen size
      uniform vec2  uOriginPx;   // chip's top-left, in image-local px
      uniform vec2  uSizePx;     // chip size
      uniform float uRadiusPx;
      uniform float uBlurPx;
      uniform float uBgAlpha;
      varying vec2 vUv;

      const int TAPS = 32;

      void main() {
        // ── rounded rect, antialiased across one pixel ──
        vec2 p = (vUv - 0.5) * uSizePx;
        vec2 b = uSizePx * 0.5 - uRadiusPx;
        vec2 q = abs(p) - b;
        float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadiusPx;
        float cover = 1.0 - smoothstep(-0.5, 0.5, sd);
        if (cover <= 0.0) discard;

        // ── where this fragment sits on the tile image ──
        // vUv.y is 0 at the quad's BOTTOM, but the chip is positioned from its
        // top, so flip before stepping down from the image's top edge.
        vec2 px = uOriginPx + vec2(vUv.x, 1.0 - vUv.y) * uSizePx;
        vec2 base = vec2(px.x / uImgSizePx.x, 1.0 - px.y / uImgSizePx.y);
        // The same cover window the image itself applies, so the frosted panel
        // samples exactly the patch of tile it covers.
        vec2 base1 = base * uUvScale + uUvOffset;
        vec2 base2 = base * uUvScale2 + uUvOffset2;

        // ── backdrop blur ──
        // Golden-angle spiral: even coverage of the disc from few taps, and
        // none of the axis-aligned banding a square kernel leaves behind.
        // Both sources are blurred and crossfaded by the SAME uMix the tile
        // itself uses, so the frosted panel keeps frosting what is actually
        // underneath it as the still gives way to the clip.
        vec2 r1 = (uBlurPx / uImgSizePx) * uUvScale;
        vec2 r2 = (uBlurPx / uImgSizePx) * uUvScale2;
        vec3 acc = vec3(0.0);
        for (int i = 0; i < TAPS; i++) {
          float fi = float(i);
          float a = fi * 2.39996323;                  // golden angle
          float rad = sqrt((fi + 0.5) / float(TAPS)); // sqrt = equal area/tap
          vec2 dir = vec2(cos(a), sin(a)) * rad;
          acc += mix(
            texture2D(uSrc,  base1 + dir * r1).rgb,
            texture2D(uSrc2, base2 + dir * r2).rgb,
            uMix
          );
        }
        // Before the media lands the tile is flat skeleton grey. Blurring a
        // still-unbound texture samples black, which would read as a hole
        // punched in the placeholder — so fade to that same grey instead.
        vec3 backdrop = mix(vec3(0.914), acc / float(TAPS), uReveal);

        vec3 glass = mix(backdrop, vec3(1.0), uBgAlpha);
        vec4 t = texture2D(uTex, vUv);
        gl_FragColor = vec4(mix(glass, t.rgb, t.a), cover * uOpacity);
      }
    `,k=new r.WebGLRenderTarget(p*w,P*w,{samples:4,minFilter:r.LinearFilter,magFilter:r.LinearFilter}),R=`
      uniform sampler2D tDiffuse;
      uniform float uBandTop;  // top band size, fraction of viewport height
      uniform float uBandBot;  // bottom band size
      uniform float uStrength; // refraction amount (fraction of band height)
      uniform float uCurve;    // profile exponent (>1 = bend hugs the edge)
      uniform float uChromaticAberration; // multi-channel sampling spread
      varying vec2 vUv;

      // circular lens sag: t = 0 at the inner band boundary (flat, slope 0,
      // so no visible seam), t = 1 at the screen edge (maximum bend).
      float sag(float t) {
        t = clamp(pow(t, uCurve), 0.0, 1.0);
        return 1.0 - sqrt(1.0 - t * t);
      }

      void main() {
        vec2 uv = vUv; // uv.y: 0 = bottom of screen, 1 = top
        float dist = 0.0;

        // Calculate lens displacement
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

        // Early exit: If we are in the flat middle section, skip the expensive loop completely.
        if (dist == 0.0 || uChromaticAberration == 0.0) {
          gl_FragColor = texture2D(tDiffuse, uv);
          return;
        }

        // Multi-tap spectral dispersion: seamlessly blends colors instead of creating harsh RGB bands
        vec3 finalColor = vec3(0.0);
        vec3 weightSum = vec3(0.0);

        for (int i = 0; i < 16; i++) {
          float t = float(i) / 15.0;
          
          // Cinematic spectrum weights for realistic light blending
          vec3 w = vec3(
            smoothstep(0.8, 0.2, t),                           // Red curve
            smoothstep(0.0, 0.5, t) * smoothstep(1.0, 0.5, t), // Green curve
            smoothstep(0.2, 0.8, t)                            // Blue curve
          );

          // Disperse the samples along the vertical axis (matching the physical glass bend)
          float shift = (t - 0.5) * uChromaticAberration * dist * 30.0;
          vec2 sampleUv = clamp(uv + vec2(0.0, shift), vec2(0.0), vec2(1.0));
          
          finalColor += texture2D(tDiffuse, sampleUv).rgb * w;
          weightSum += w;
        }

        finalColor /= weightSum;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,A={tDiffuse:{value:k.texture},uBandTop:{value:o.glassBandTopPct},uBandBot:{value:o.glassBandBotPct},uStrength:{value:o.glassStrength},uCurve:{value:o.glassCurve},uChromaticAberration:{value:.01}},L=new r.Scene,O=new r.OrthographicCamera(-1,1,1,-1,0,1),F=new r.Mesh(new r.PlaneGeometry(2,2),new r.ShaderMaterial({uniforms:A,vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `,fragmentShader:R,depthTest:!1,depthWrite:!1}));L.add(F);let z=[],G=(e,t,a,o,i=0)=>{let n=e=>{e.font=`${t}px ${a}`,e.textBaseline="alphabetic","letterSpacing"in e&&(e.letterSpacing=`${i}px`)},l=document.createElement("canvas").getContext("2d");n(l);let s=l.measureText(e),u=Math.ceil(s.width)+2,d=s.actualBoundingBoxAscent||.8*t,c=Math.ceil(d+(s.actualBoundingBoxDescent||.2*t))+2,v=document.createElement("canvas");v.width=Math.max(1,u*w),v.height=Math.max(1,c*w);let h=v.getContext("2d");h.scale(w,w),n(h),h.fillStyle=o,h.fillText(e,1,1+d);let m=new r.CanvasTexture(v);return m.colorSpace=r.SRGBColorSpace,m.minFilter=r.LinearFilter,m.generateMipmaps=!1,m.anisotropy=M.capabilities.getMaxAnisotropy(),{texture:m,wPx:u,hPx:c,ascentPx:1+d}},V=(e,t,a,o,i=0)=>{let{texture:n,wPx:l,hPx:s,ascentPx:u}=G(e,t,a,o,i),d=new r.PlaneGeometry(l,s,1,1),c=new r.ShaderMaterial({uniforms:{uTex:{value:n},uOpacity:{value:1}},vertexShader:D,fragmentShader:U,transparent:!0}),v=new r.Mesh(d,c);return v.userData.wPx=l,v.userData.hPx=s,v.userData.ascentPx=u,v.userData.text=e,v.userData.sizePx=t,v.userData.font=a,v.userData.color=o,v.userData.letterSpacingPx=i,v.userData.isText=!0,z.push(v),v},W=[],_=e=>{let t=`${o.soonSizePx}px ${o.titleFont}`,a=document.createElement("canvas").getContext("2d");a.font=t,a.textBaseline="alphabetic";let i=a.measureText(e),n=i.actualBoundingBoxAscent||.8*o.soonSizePx,l=i.actualBoundingBoxDescent||.2*o.soonSizePx,s=o.soonSizePx*o.soonLineHeight,u=Math.ceil(i.width)+2*o.soonPadXPx,d=Math.ceil(s)+o.soonPadTopPx+o.soonPadBottomPx,c=document.createElement("canvas");c.width=Math.max(1,Math.round(u*w)),c.height=Math.max(1,Math.round(d*w));let v=c.getContext("2d");v.scale(w,w),v.font=t,v.textBaseline="alphabetic",v.fillStyle=o.ink,v.fillText(e,o.soonPadXPx,o.soonPadTopPx+(s+n-l)/2);let h=new r.CanvasTexture(c);return h.colorSpace=r.SRGBColorSpace,h.minFilter=r.LinearFilter,h.generateMipmaps=!1,h.anisotropy=M.capabilities.getMaxAnisotropy(),{texture:h,wPx:u,hPx:d}},q=(e,t,a,o,r)=>{let i=e.userData.isText?Math.round(t):t,n=e.userData.isText?Math.round(a):a;e.position.x=i+o/2,e.position.y=-(n+r/2)},j=(e,t,a)=>{let r=o.tileAspect,i=a||r,n=1,l=1;r>i?l=i/r:n=r/i,e.value.set(n,l),t.value.set((1-n)/2,(1-l)/2)},I=e=>{let t=e.mat.uniforms;j(t.uUvScale,t.uUvOffset,e.aspect),j(t.uUvScale2,t.uUvOffset2,e.hoverAspect)},H=new r.TextureLoader;H.crossOrigin="anonymous";let $=[],N={value:0},X=v.map(e=>{let t=new r.ShaderMaterial({uniforms:{uTex:{value:null},uTex2:{value:null},uOpacity:{value:1},uMix:{value:0},uReveal:{value:0},uTime:N,uUvScale:{value:new r.Vector2(1,1)},uUvOffset:{value:new r.Vector2(0,0)},uUvScale2:{value:new r.Vector2(1,1)},uUvOffset2:{value:new r.Vector2(0,0)}},vertexShader:D,fragmentShader:E,transparent:!0}),a=new r.Mesh(new r.PlaneGeometry(1,1,1,1),t);B.add(a);let i=V(e.name,o.titleSizePx,o.titleFont,o.ink),n=V(e.category,o.catSizePx,o.catFont,o.ink);B.add(i),B.add(n);let l=[...e.comingSoon?["Coming Soon"]:[],...e.gridLabels||[]].map(e=>{let a=((e,t)=>{let{texture:a,wPx:i,hPx:n}=_(e),l=new r.ShaderMaterial({uniforms:{uTex:{value:a},uSrc:t.uniforms.uTex,uSrc2:t.uniforms.uTex2,uMix:t.uniforms.uMix,uReveal:t.uniforms.uReveal,uUvScale:t.uniforms.uUvScale,uUvOffset:t.uniforms.uUvOffset,uUvScale2:t.uniforms.uUvScale2,uUvOffset2:t.uniforms.uUvOffset2,uOpacity:{value:1},uImgSizePx:{value:new r.Vector2(1,1)},uOriginPx:{value:new r.Vector2(0,0)},uSizePx:{value:new r.Vector2(i,n)},uRadiusPx:{value:o.soonRadiusPx},uBlurPx:{value:o.soonBlurPx},uBgAlpha:{value:o.soonBgAlpha}},vertexShader:D,fragmentShader:C,transparent:!0}),s=new r.Mesh(new r.PlaneGeometry(i,n,1,1),l);return s.userData.wPx=i,s.userData.hPx=n,s.userData.isText=!0,s.userData.badgeText=e,s.renderOrder=1,W.push(s),s})(e,t);return B.add(a),a}),u={item:e,mesh:a,mat:t,title:i,cat:n,chips:l,aspect:e.ar||null,loaded:!1,failed:!1,reveal:0,hoverUrl:null,hoverType:e.hover&&e.hover.type||"video",hoverMobile:e.hover&&e.hover.mobile||"tile",hoverStarted:!1,hoverVideo:null,hoverTex:null,hoverReady:!1,hoverAspect:e.hover&&e.hover.ar||null,hovered:!1,hoverAttached:!1,mobileSwapOn:!1};if(e.hover&&e.hover.file){let t=e=>!!e&&("image"===u.hoverType||!(0,s.isWebmUrl)(e)||(0,s.canUseWebmTexture)(e));u.hoverUrl=t(e.hover.file)?e.hover.file:t(e.hover.fileFallback)?e.hover.fileFallback:null}let d=e.type,c=e.file;if("video"===d&&(0,s.isWebmUrl)(c)&&!(0,s.canUseWebmTexture)(c)){let t=(0,s.resolveResponsiveMedia)(e.firstBlockMedia);t&&(0,s.isImageUrl)(t)&&(d="image",c=t)}if("video"===d){let e=document.createElement("video");e.src=c,e.loop=!0,e.muted=!0,e.playsInline=!0,e.setAttribute("playsinline",""),e.setAttribute("webkit-playsinline",""),e.preload="auto",e.crossOrigin="anonymous",$.push(e);let a=new r.VideoTexture(e);a.colorSpace=r.SRGBColorSpace,a.minFilter=r.LinearFilter,a.magFilter=r.LinearFilter,a.generateMipmaps=!1,t.uniforms.uTex.value=a,e.addEventListener("loadedmetadata",()=>{e.videoWidth&&e.videoHeight&&(u.aspect=e.videoWidth/e.videoHeight,I(u))}),e.addEventListener("loadeddata",()=>{u.loaded=!0,Y()}),e.addEventListener("error",()=>{u.failed=!0,Y()});let o=()=>e.play().catch(()=>{});e.addEventListener("canplay",o,{once:!0}),o()}else H.load(c,e=>{e.minFilter=r.LinearMipmapLinearFilter,e.anisotropy=M.capabilities.getMaxAnisotropy(),t.uniforms.uTex.value=e,u.aspect=e.image.width/e.image.height,I(u),u.loaded=!0,Y()},void 0,()=>{u.failed=!0,Y()});return u}),Y=()=>{let e=X.filter(e=>e.loaded||e.failed).length,t={ready:e,total:X.length};window.__pagePreloadProgress=t,window.dispatchEvent(new CustomEvent("page-preload-progress",{detail:t})),X.length&&e===X.length&&er()},K=e=>{e.hoverReady=!0,e.mobileSwapOn?e.mat.uniforms.uMix.value=1:e.hovered&&Z(e,1)},J=e=>{if(!e.hoverUrl||e.hoverStarted)return;if(e.hoverStarted=!0,"image"===e.hoverType)return void H.load(e.hoverUrl,t=>{t.minFilter=r.LinearMipmapLinearFilter,t.anisotropy=M.capabilities.getMaxAnisotropy(),e.hoverTex=t,t.image&&t.image.width&&t.image.height&&(e.hoverAspect=t.image.width/t.image.height),I(e),e.hoverAttached&&(e.mat.uniforms.uTex2.value=t),K(e)},void 0,()=>{});let t=document.createElement("video");t.loop=!0,t.muted=!0,t.playsInline=!0,t.setAttribute("playsinline",""),t.setAttribute("webkit-playsinline",""),t.preload="auto",t.crossOrigin="anonymous",t.src=e.hoverUrl,$.push(t);let a=new r.VideoTexture(t);a.colorSpace=r.SRGBColorSpace,a.minFilter=r.LinearFilter,a.magFilter=r.LinearFilter,a.generateMipmaps=!1,e.hoverVideo=t,e.hoverTex=a,t.addEventListener("loadedmetadata",()=>{t.videoWidth&&t.videoHeight&&(e.hoverAspect=t.videoWidth/t.videoHeight,I(e))}),t.addEventListener("loadeddata",()=>K(e))},Q=e=>{e.hoverTex&&!e.hoverAttached&&(e.mat.uniforms.uTex2.value=e.hoverTex,e.hoverAttached=!0)},Z=(e,t,a)=>n.default.to(e.mat.uniforms.uMix,{value:t,duration:o.hoverFadeDuration,ease:o.hoverFadeEase,overwrite:!0,onComplete:a}),ee=e=>{let t=e.hoverVideo;if(t)try{t.pause(),t.currentTime=0}catch(e){}e.hoverAttached&&(e.mat.uniforms.uTex2.value=null,e.hoverAttached=!1)},et=()=>{let e=a.clientWidth<=o.hoverBreakpointPx;X.forEach(t=>{if(!t.hoverUrl)return;let a=e&&"swap"===t.hoverMobile;a!==t.mobileSwapOn&&(t.mobileSwapOn=a,n.default.killTweensOf(t.mat.uniforms.uMix),a?(J(t),Q(t),t.mat.uniforms.uMix.value=+!!t.hoverReady,t.hoverVideo&&t.hoverVideo.play().catch(()=>{})):(t.mat.uniforms.uMix.value=0,ee(t)))})},ea=null,eo=!1,er=()=>{!eo&&a.clientWidth>o.hoverBreakpointPx&&(eo=!0,ea=setTimeout(()=>{X.forEach(e=>e.hoverUrl&&J(e))},600))};Y();let ei=V("A Curated Selection of ",o.headGroteskSizePx,o.titleFont,o.ink,o.headGroteskSizePx*o.headGroteskTrackPct),en=e=>V(e,o.headTeodorSizePx,o.catFont,o.ink),el=en("Branding and Digital Projects"),es=en("Branding"),eu=en("and Digital Projects");[ei,el,es,eu].forEach(e=>B.add(e));let ed=e=>V(e,o.footerSizePx,o.footerFont,o.ink),ec=ed(`${u} ${d}`),ev=ed(u),eh=ed(d);[ec,ev,eh].forEach(e=>{e.layers.set(1),B.add(e)});let em=P,ep=()=>{let e=(p-2*o.pagePadPx-o.colGapPx*(o.cols-1))/o.cols,t=p<=640;el.visible=!t,es.visible=t,eu.visible=t;let a=t?[[ei,es],[eu]]:[[ei,el]],i=Math.round(o.headTeodorSizePx*o.headLineMul),n=o.headTopPx+Math.max(...a[0].map(e=>e.userData.ascentPx)),l=o.headTopPx;a.forEach((e,t)=>{var a;let o,r,s;t>0&&(n+=i),l=Math.max(l,(a=n,o=e.reduce((e,t)=>e+t.userData.wPx,0),r=(p-o)/2,s=a,e.forEach(e=>{let t=a-e.userData.ascentPx;q(e,r,t,e.userData.wPx,e.userData.hPx),r+=e.userData.wPx,s=Math.max(s,t+e.userData.hPx)}),s))});let s=l+o.headBotPx,u=[],d=s,c=d;X.forEach((t,a)=>{let i=a%o.cols,n=Math.floor(a/o.cols),l=o.pagePadPx+i*(e+o.colGapPx),v=e/o.tileAspect;0===i&&(d=0===n?s:u[n-1]+o.rowGapPx);let h=d;t.mesh.geometry.dispose(),t.mesh.geometry=new r.PlaneGeometry(e,v,1,1),q(t.mesh,l,h,e,v),I(t);let m=Math.round(h+o.soonMarginPx),p=Math.round(l+o.soonMarginPx);t.chips.forEach(t=>{let a=t.material.uniforms;a.uImgSizePx.value.set(e,v),a.uOriginPx.value.set(p-l,m-h),q(t,p,m,t.userData.wPx,t.userData.hPx),p+=t.userData.wPx+o.soonGapPx});let f=h+v+o.imgTextGapPx;q(t.title,l,f,t.title.userData.wPx,t.title.userData.hPx),f+=t.title.userData.hPx+o.titleCatGapPx,q(t.cat,l,f,t.cat.userData.wPx,t.cat.userData.hPx);let x=f+=t.cat.userData.hPx+o.textBlockPadPx;u[n]=Math.max(u[n]||0,x),c=Math.max(c,x)});let v=c+o.footerTopPx,h=p<=640;if(ec.visible=!h,ev.visible=h,eh.visible=h,h){let e=[ev,eh],t=Math.max(...e.map(e=>e.userData.ascentPx)),a=e=>v+(t-e.userData.ascentPx);q(ev,o.pagePadPx,a(ev),ev.userData.wPx,ev.userData.hPx),q(eh,p-o.pagePadPx-eh.userData.wPx,a(eh),eh.userData.wPx,eh.userData.hPx),c=Math.max(...e.map(e=>a(e)+e.userData.hPx))+20}else q(ec,(p-ec.userData.wPx)/2,v,ec.userData.wPx,ec.userData.hPx),c=v+ec.userData.hPx+20;em=Math.max(P,c)},ef=()=>{let e=a.clientWidth;e<=640?o.cols=1:e<=1024?o.cols=2:o.cols=3,o.pagePadPx=8};ef(),et(),ep(),"FontFace"in window&&Promise.all(c.map(async e=>{try{let t=new FontFace(e.family,`url(${e.url})`,{weight:e.weight,style:"normal"});await t.load(),document.fonts.add(t)}catch(t){console.warn("Font load failed:",e.url,t)}})).then(()=>{z.forEach(e=>{let{text:t,sizePx:a,font:o,color:i,letterSpacingPx:n}=e.userData,{texture:l,wPx:s,hPx:u,ascentPx:d}=G(t,a,o,i,n),c=e.material.uniforms.uTex.value;e.material.uniforms.uTex.value=l,c&&c.dispose(),e.userData.wPx=s,e.userData.hPx=u,e.userData.ascentPx=d,e.geometry.dispose(),e.geometry=new r.PlaneGeometry(s,u,1,1)}),W.forEach(e=>{let{texture:t,wPx:a,hPx:o}=_(e.userData.badgeText),i=e.material.uniforms,n=i.uTex.value;i.uTex.value=t,n&&n.dispose(),i.uSizePx.value.set(a,o),e.userData.wPx=a,e.userData.hPx=o,e.geometry.dispose(),e.geometry=new r.PlaneGeometry(a,o,1,1)}),ep()});let ex=0,eg=0,eP=0,ew=!1,ey=()=>Math.max(0,em-P),eS=e=>Math.min(ey(),Math.max(0,e)),eb=e=>{e.preventDefault(),ew=!1,eP=0,ex=eS(ex+e.deltaY)};a.addEventListener("wheel",eb,{passive:!1});let eT=0,eM=!1,eB=0,eD=e=>{if(1!==e.touches.length){eM=!1;return}eM=!0,ew=!0,eT=e.touches[0].clientY,eB=performance.now(),eP=0},eE=e=>{if(!eM||1!==e.touches.length)return;e.cancelable&&e.preventDefault();let t=e.touches[0].clientY,a=eT-t;eT=t;let o=performance.now(),r=Math.max(1,o-eB);eB=o,eP=a/r*16,ex=eS(ex+a)},eU=e=>{0===e.touches.length&&(eM=!1)};a.addEventListener("touchstart",eD,{passive:!0}),a.addEventListener("touchmove",eE,{passive:!1}),a.addEventListener("touchend",eU,{passive:!0}),a.addEventListener("touchcancel",eU,{passive:!0});let eC=new r.Raycaster,ek=new r.Vector2,eR=X.map(e=>e.mesh),eA=null,eL=g.current,eO=null,eF=null;eL&&(n.default.set(eL,{xPercent:-50,yPercent:-50,opacity:0,scale:.6}),eO=n.default.quickTo(eL,"x",{duration:.5,ease:"power3.out"}),eF=n.default.quickTo(eL,"y",{duration:.5,ease:"power3.out"}));let ez="ontouchstart"in window||navigator.maxTouchPoints>0,eG=new Set,eV=e=>{if(e===eA)return;(e&&((e=>{let t=e&&e.item&&e.item.slug;if(!t||e.item.comingSoon||eG.has(t))return;eG.add(t);try{f.current.prefetch(`/projects/${t}`)}catch(e){}let a=(0,s.resolveResponsiveMedia)(e.item.firstBlockMedia);a&&(0,s.preloadAssets)([a])})(e),window.__playSfx?.("imageHover")),eA&&(eA.hovered=!1,(e=>{if(e.hoverStarted&&!e.mobileSwapOn){if(0===e.mat.uniforms.uMix.value){n.default.killTweensOf(e.mat.uniforms.uMix),ee(e);return}Z(e,0,()=>ee(e))}})(eA)),eA=e,e)&&(e.hovered=!0,e.hoverUrl&&!e.mobileSwapOn&&a.clientWidth>o.hoverBreakpointPx&&(J(e),Q(e),e.hoverVideo&&e.hoverVideo.play().catch(()=>{}),e.hoverReady&&Z(e,1)));let t=!!e&&!e.item.comingSoon;eL&&!ez&&(n.default.killTweensOf(eL,"opacity,scale"),n.default.to(eL,{opacity:+!!t,scale:t?1:.8,duration:t?.75:.6,ease:o.hoverEase})),a.style.cursor=e?"pointer":"default"},eW=e=>{if("touch"===e.pointerType)return;eO?.(e.clientX),eF?.(e.clientY);let t=M.domElement.getBoundingClientRect();ek.x=(e.clientX-t.left)/t.width*2-1,ek.y=-(2*((e.clientY-t.top)/t.height))+1,eC.setFromCamera(ek,b);let a=eC.intersectObjects(eR,!1);a.length>0?eV(X.find(e=>e.mesh===a[0].object)||null):eV(null)};window.addEventListener("pointermove",eW);let e_=t=>{let a=M.domElement.getBoundingClientRect();ek.x=(t.clientX-a.left)/a.width*2-1,ek.y=-(2*((t.clientY-a.top)/a.height))+1,eC.setFromCamera(ek,b);let o=eC.intersectObjects(eR,!1);if(0===o.length)return;let r=X.find(e=>e.mesh===o[0].object);if(!r||r.item.comingSoon)return;let i=r.item.slug;e?e(i):i&&m.current(i)};M.domElement.addEventListener("click",e_);let eq=0,ej=!1,eI=()=>{t=requestAnimationFrame(eI),!ej&&++eq>=2&&(ej=!0,window.__pageContentReady=!0,window.dispatchEvent(new Event("page-content-ready"))),!eM&&Math.abs(eP)>.05?(ex=eS(ex+eP),eP*=.95,(ex<=0||ex>=ey())&&(eP=0)):eM||(eP=0),ew?eg=ex:eg+=(ex-eg)*o.ease,B.position.y=eg,N.value=performance.now()/1e3,X.forEach(e=>{e.loaded&&e.reveal<1&&(e.reveal=Math.min(1,e.reveal+.08),e.mat.uniforms.uReveal.value=e.reveal)}),b.layers.set(0),M.setRenderTarget(k),M.render(y,b),M.setRenderTarget(null),M.render(L,O),b.layers.set(1),M.autoClear=!1,M.render(y,b),M.autoClear=!0,b.layers.set(0)};eI(),M.domElement.__snapshotRender=()=>{b.layers.set(0),M.setRenderTarget(k),M.render(y,b),M.setRenderTarget(null),M.render(L,O),b.layers.set(1),M.autoClear=!1,M.render(y,b),M.autoClear=!0,b.layers.set(0)};let eH=()=>{h(),p=a.clientWidth,P=a.clientHeight,M.setSize(p,P),k.setSize(p*w,P*w),T(),ef(),et(),ep(),ex=Math.min(ex,ey())};return window.addEventListener("resize",eH),l&&(l.addEventListener("resize",eH),l.addEventListener("scroll",eH)),()=>{cancelAnimationFrame(t),ea&&clearTimeout(ea),a.removeEventListener("wheel",eb),a.removeEventListener("touchstart",eD),a.removeEventListener("touchmove",eE),a.removeEventListener("touchend",eU),a.removeEventListener("touchcancel",eU),window.removeEventListener("pointermove",eW),M.domElement.removeEventListener("click",e_),window.removeEventListener("resize",eH),l&&(l.removeEventListener("resize",eH),l.removeEventListener("scroll",eH)),X.forEach(e=>{n.default.killTweensOf(e.mat.uniforms.uMix),e.hoverTex&&e.hoverTex.dispose()}),B.traverse(e=>{if(e.geometry&&e.geometry.dispose(),e.material){let t=e.material.uniforms;t&&t.uTex&&t.uTex.value&&t.uTex.value.dispose(),e.material.dispose()}}),F.geometry.dispose(),F.material.dispose(),k.dispose(),M.dispose(),$.forEach(e=>{try{e.pause(),e.removeAttribute("src"),e.load()}catch(e){}}),M.domElement.parentNode&&M.domElement.parentNode.removeChild(M.domElement)}},[]),(0,t.jsx)("div",{ref:x,"aria-hidden":"true",style:{position:"relative",width:"100%",height:"100dvh",overflow:"hidden",touchAction:"none",overscrollBehavior:"none"},children:(0,t.jsx)("div",{ref:g,className:"absolute top-8 left-8 z-50 pointer-events-none font-lay-grotesk text-[13px] leading-[120%] mix-blend-difference text-white will-change-transform",style:{opacity:0},children:"View"})})}])}]);