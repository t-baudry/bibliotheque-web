(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,103930,e=>{"use strict";var t=e.i(843476),r=e.i(500932),a=e.i(156569),i=e.i(124821),o=e.i(89835),n=e.i(481293),l=e.i(607561),s=e.i(494473),c=e.i(989970),u=e.i(255667),d=e.i(271645),f=e.i(575509),p=e.i(212960),m=e.i(997053);let g=(0,m.default)(f.Div).attrs({as:"section"}).withConfig({componentId:"sc-8d5ca2ab-0"})(({$hasFade:e})=>m.css`
        position: relative;
        z-index: 1;
        overflow: clip;
        height: 100dvh;
        padding-top: 50dvh;
        background: ${(0,f.getBrand)("bc1")};

        &:after {
            position: absolute;
            inset: 0;
            z-index: 0;
            background: linear-gradient(to top, ${(0,f.getGlobal)("black")} 0%, transparent 50%);
            content: '';
            opacity: ${e?1:.4};
        }
    `),h=(0,m.default)(f.Div).withConfig({componentId:"sc-8d5ca2ab-1"})(({$isMissing:e})=>m.css`
        position: absolute;
        inset: 0;
        z-index: -1;

        /* NOTE • No image to show — see missingMedia in @tackl for why this is a
           drawn empty frame rather than a flat colour. */
        ${e&&f.missingMedia}

        picture {
            display: block;
            width: 100%;
            height: 100%;

            img {
                display: block;
                object-fit: cover;
                object-position: top;
                width: 100%;
                height: 100%;

                ${f.bp.l` object-position: center `}
            }
        }
    `),x=(0,m.default)(f.Div).attrs({as:"div"}).withConfig({componentId:"sc-8d5ca2ab-2"})(()=>m.css`
        position: relative;
        z-index: 1;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 50dvh;
    `),b=(0,m.default)(f.Div).withConfig({componentId:"sc-8d5ca2ab-3"})(()=>m.css`
        margin-bottom: ${(0,f.getGap)("s")};

        h2 {
            ${p.headlineL}

            color: ${(0,f.getBrand)("bc5")};
            text-align: center;
        }
    `),v=(0,m.default)(f.Div).attrs({as:"p"}).withConfig({componentId:"sc-8d5ca2ab-4"})(()=>m.css`
        ${p.bodyL}

        color: ${(0,f.getBrand)("bc5",80)};
        text-align: center;
        text-wrap: balance;

        margin-bottom: ${(0,f.getGap)("l")};
    `),y=e=>{let f,p,m,y,_,w,E,T,S,I,A,R,k=(0,r.c)(32),{heading:L,headingEditAttr:j,description:P,backgroundImage:C,buttonLabel:$,buttonHref:D,hasFade:F}=e,M=(0,d.useRef)(null),O=(0,d.useRef)(null),G=(0,d.useRef)(null),N=C?.desktop;k[0]!==N?(f=(0,n.resolveImageWithAlt)(N),k[0]=N,k[1]=f):f=k[1];let B=f,U=C?.mobile;k[2]!==U?(p=(0,n.resolveImageWithAlt)(U),k[2]=U,k[3]=p):p=k[3];let H=p,z=!!(B&&H),W=(0,u.useLenis)();k[4]!==W?.rootElement?(m=e=>{let{isDesktop:t}=e,r=M.current,a=W?.rootElement,i=O.current,o=G.current;if(!r||!a||!i||!o)return;let n=t?50:25;c.default.set(i,{yPercent:-n}),c.default.to(i,{yPercent:n,ease:"none",scrollTrigger:{trigger:r,scroller:a,start:"top 100%",end:"bottom 0%",scrub:!0}}),c.default.to(i,{autoAlpha:1,ease:"none",scrollTrigger:{trigger:r,scroller:a,start:"bottom 100%",end:"bottom 0%",scrub:!0}}),c.default.to(o,{yPercent:-50,ease:"none",scrollTrigger:{trigger:r,scroller:a,start:"bottom 100%",end:"bottom 0%",scrub:!0}})},k[4]=W?.rootElement,k[5]=m):m=k[5],k[6]!==W?(y={scope:M,dependencies:[W]},k[6]=W,k[7]=y):y=k[7],(0,l.useAnimation)(m,y);let X=!z;k[8]!==B||k[9]!==H?(_=B&&H?(0,t.jsx)(o.default,{desktop:B,mobile:H,fill:!0,sizes:"100vw"}):null,k[8]=B,k[9]=H,k[10]=_):_=k[10],k[11]!==X||k[12]!==_?(w=(0,t.jsx)(h,{ref:O,$isMissing:X,children:_}),k[11]=X,k[12]=_,k[13]=w):w=k[13];let V=L||"Missing";return k[14]!==V?(E=(0,t.jsx)("h2",{children:V}),k[14]=V,k[15]=E):E=k[15],k[16]!==j||k[17]!==E?(T=(0,t.jsx)(s.default,{children:(0,t.jsx)(b,{children:(0,t.jsx)(a.default,{editAttr:j,children:E})})}),k[16]=j,k[17]=E,k[18]=T):T=k[18],k[19]!==P?(S=(0,t.jsx)(s.default,{children:(0,t.jsx)(v,{$l:"5/9",$huge:"5/9",children:P})}),k[19]=P,k[20]=S):S=k[20],k[21]!==D||k[22]!==$?(I=$&&D&&(0,t.jsx)(i.default,{label:$,aria:$,to:D}),k[21]=D,k[22]=$,k[23]=I):I=k[23],k[24]!==T||k[25]!==S||k[26]!==I?(A=(0,t.jsxs)(x,{ref:G,children:[T,S,I]}),k[24]=T,k[25]=S,k[26]=I,k[27]=A):A=k[27],k[28]!==F||k[29]!==A||k[30]!==w?(R=(0,t.jsxs)(g,{ref:M,$hasFade:F,children:[w,A]}),k[28]=F,k[29]=A,k[30]=w,k[31]=R):R=k[31],R};y.displayName="CtaBand",e.s(["default",0,y],103930)},576978,e=>{"use strict";var t=e.i(843476),r=e.i(500932),a=e.i(124821),i=e.i(271645),o=e.i(174080),n=e.i(710085);let l={parallaxStrength:.016,parallaxFocus:.45,lightRadius:1.05,lightIntensity:1.9,lightFalloff:2,ambient:.16,depthInfluence:.55,floodLight:1,easing:.065,startPos:[.5,.5],spotEaseIn:.045,spotEaseOut:.025,scrollFloodDistance:.5,scrollParallaxFrom:0,scrollParallaxTo:1,scrollDarkStart:.25,scrollLightBy:.5},s=`
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`,c=`
precision highp float;

varying vec2 v_uv;

uniform sampler2D u_image;
uniform sampler2D u_depth;
uniform vec2  u_res;        // canvas resolution (px)
uniform float u_imgAspect;  // image width / height
uniform vec2  u_mouse;      // smoothed light position, canvas UV (y-up)
uniform float u_parallaxStrength;
uniform float u_parallaxFocus;
uniform float u_lightRadius;
uniform float u_lightIntensity;
uniform float u_lightFalloff;
uniform float u_ambient;
uniform float u_depthInfluence;
uniform float u_floodLight;
uniform float u_spot;       // 0 = flood lit (resting), 1 = cursor point light

// background-size: cover mapping
vec2 coverUV(vec2 uv) {
  float canvasAspect = u_res.x / u_res.y;
  vec2 scale = (canvasAspect > u_imgAspect)
    ? vec2(1.0, u_imgAspect / canvasAspect)
    : vec2(canvasAspect / u_imgAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 uv = coverUV(v_uv);

  // ---------- depth parallax ----------
  // offset direction: near pixels slide with the cursor, far pixels stay put
  vec2 mouseOffset = (u_mouse - 0.5);
  float depthHere = texture2D(u_depth, vec2(uv.x, 1.0 - uv.y)).r;
  vec2 parallax = mouseOffset * u_parallaxStrength * (depthHere - u_parallaxFocus);
  vec2 puv = uv + parallax;

  // re-sample depth at the displaced position for lighting
  float depth = texture2D(u_depth, vec2(puv.x, 1.0 - puv.y)).r;
  vec3 color = texture2D(u_image, vec2(puv.x, 1.0 - puv.y)).rgb;

  // ---------- point light ----------
  // aspect-corrected distance so the glow is circular
  vec2 aspect = vec2(u_res.x / u_res.y, 1.0);
  float dist = distance(v_uv * aspect, u_mouse * aspect);

  float att = clamp(1.0 - dist / u_lightRadius, 0.0, 1.0);
  att = pow(att, u_lightFalloff);

  // depth influence: surfaces nearer the camera (brighter depth) catch more light
  float depthCatch = mix(1.0, smoothstep(0.0, 0.85, depth), u_depthInfluence);

  float spotLight = u_ambient + u_lightIntensity * att * depthCatch;

  // The whole frame is lit at rest and the light is drawn down into the hotspot
  // as the cursor takes over, so the two states cross-fade rather than cut.
  float light = mix(u_floodLight, spotLight, u_spot);
  color *= light;

  // Subtle tonemap to keep the hotspot from clipping harshly. Faded in with the
  // spot — there is nothing to clip at full flood, and skipping it there leaves
  // the image untouched, matching the plain <img> underneath the canvas.
  color = color / (1.0 + 0.15 * u_spot * color);

  gl_FragColor = vec4(color, 1.0);
}`,u=["u_image","u_depth","u_res","u_imgAspect","u_mouse","u_parallaxStrength","u_parallaxFocus","u_lightRadius","u_lightIntensity","u_lightFalloff","u_ambient","u_depthInfluence","u_floodLight","u_spot"],d=e=>new Promise((t,r)=>{let a=new Image;a.crossOrigin="anonymous",a.onload=()=>t(a),a.onerror=()=>r(Error(`Failed to load texture: ${e}`)),a.src=e}),f=(e,t,r)=>{let a=e.createShader(t);if(!a)throw Error("Unable to create shader");if(e.shaderSource(a,r),e.compileShader(a),!e.getShaderParameter(a,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(a);throw e.deleteShader(a),Error(t??"Shader compile failed")}return a},p=e=>"function"==typeof createImageBitmap?(0,n.decodeImageBitmap)(e,{premultiplyAlpha:"none"}).catch(()=>e):Promise.resolve(e),m=e=>{"close"in e&&e.close()},g=(e,t,r)=>{let a=e.createTexture();return e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,a),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),a},h=async({canvas:e,imageSrc:t,imageElement:r,depthSrc:a,config:i,mode:o="pointer",signal:n,onFirstPaint:h,onContextLost:x})=>{let b={...l,...i},v="scroll"===o,y=e.getContext("webgl",{antialias:!1,alpha:!1,depth:!1,stencil:!1});if(!y)return null;let[_,w]=await Promise.all([r?r.decode().then(()=>r):d(t),d(a)]);if(n?.aborted)return null;let[E,T]=await Promise.all([p(_),p(w)]);if(n?.aborted)return m(E),m(T),null;let S=y.createProgram();if(!S)return null;let I=f(y,y.VERTEX_SHADER,s),A=f(y,y.FRAGMENT_SHADER,c);if(y.attachShader(S,I),y.attachShader(S,A),y.linkProgram(S),!y.getProgramParameter(S,y.LINK_STATUS))throw Error(y.getProgramInfoLog(S)??"Program link failed");y.useProgram(S);let R=y.createBuffer();y.bindBuffer(y.ARRAY_BUFFER,R),y.bufferData(y.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),y.STATIC_DRAW);let k=y.getAttribLocation(S,"a_pos");y.enableVertexAttribArray(k),y.vertexAttribPointer(k,2,y.FLOAT,!1,0,0);let L=Object.fromEntries(u.map(e=>[e,y.getUniformLocation(S,e)])),j=g(y,0,E),P=g(y,1,T);m(E),m(T),y.uniform1i(L.u_image,0),y.uniform1i(L.u_depth,1),y.uniform1f(L.u_imgAspect,_.naturalWidth/_.naturalHeight);let C=()=>{y.uniform1f(L.u_parallaxStrength,b.parallaxStrength),y.uniform1f(L.u_parallaxFocus,b.parallaxFocus),y.uniform1f(L.u_lightRadius,b.lightRadius),y.uniform1f(L.u_lightIntensity,b.lightIntensity),y.uniform1f(L.u_lightFalloff,b.lightFalloff),y.uniform1f(L.u_ambient,b.ambient),y.uniform1f(L.u_depthInfluence,b.depthInfluence),y.uniform1f(L.u_floodLight,b.floodLight)};C();let $={x:b.startPos[0],y:b.startPos[1]},D={x:b.startPos[0],y:b.startPos[1]},F=0,M=0,O=!1,G=null,N=0,B=null,U=null,H=0,z=0,W=!1,X=!1,V=!0,Y=!1,q=!1,K=()=>{q||(q=!0,h?.())},J=()=>{let t=Math.min(window.devicePixelRatio||1,2),r=Math.round(e.clientWidth*t),a=Math.round(e.clientHeight*t);r&&a&&(e.width!==r||e.height!==a)&&(e.width=r,e.height=a,y.viewport(0,0,r,a),y.uniform2f(L.u_res,r,a),Y=!0,V=!0)},Q=()=>{if(!Y)return;(()=>{if(!G)return;let t=e.clientWidth,r=e.clientHeight;if(!t||!r)return;let a=e.getBoundingClientRect(),i=a.left+a.width/2-t/2,o=a.top+a.height/2-r/2;D.x=(G.x-i)/t,D.y=1-(G.y-o)/r})(),O&&(O=!1,$.x=D.x,$.y=D.y,V=!0);let t=D.x-$.x,r=D.y-$.y,a=M-F;(!(5e-4>Math.abs(t)&&5e-4>Math.abs(r)&&5e-4>Math.abs(a))||V)&&($.x+=t*b.easing,$.y+=r*b.easing,F+=a*(a>0?b.spotEaseIn:b.spotEaseOut),y.uniform2f(L.u_mouse,$.x,$.y),y.uniform1f(L.u_spot,F),y.drawArrays(y.TRIANGLES,0,3),V=!1,K())},Z=()=>{if(!Y)return;let{scrollParallaxFrom:e,scrollParallaxTo:t,scrollDarkStart:r,scrollLightBy:a}=b,i=a>0?Math.min(H/a,1):1;y.uniform2f(L.u_mouse,.5,e+(t-e)*H),y.uniform1f(L.u_spot,0),y.uniform1f(L.u_floodLight,r+(b.floodLight-r)*i),y.drawArrays(y.TRIANGLES,0,3),V=!1,K()},ee=()=>v?Z():Q(),et=()=>{z=requestAnimationFrame(et),Q()},er=()=>{z&&(cancelAnimationFrame(z),z=0)},ea=(e,t)=>{F<.05&&(O=!0),G={x:e,y:t},M=1,N=0},ei=e=>ea(e.clientX,e.clientY),eo=e=>{let t=e.touches[0];t&&ea(t.clientX,t.clientY)},en=e=>{let t,r=(t=e.target)instanceof HTMLElement?t.scrollTop:window.scrollY||document.scrollingElement?.scrollTop||0,a=b.scrollFloodDistance*window.innerHeight;null!==B&&e.target===U&&(N=Math.min(N+Math.abs(r-B),a)),B=r,U=e.target,N>=a&&(M=0)},el=e=>{e.preventDefault(),W=!1,er(),x?.()},es=new ResizeObserver(()=>{J(),z||ee()});return es.observe(e),e.addEventListener("webglcontextlost",el),v||(window.addEventListener("pointermove",ei,{passive:!0}),window.addEventListener("touchmove",eo,{passive:!0}),window.addEventListener("scroll",en,{capture:!0,passive:!0})),J(),ee(),{setActive:e=>{if(!X&&e!==W){if(W=e,e){J(),V=!0,z||X||v||(z=requestAnimationFrame(et));return}er(),F=0,M=0,N=0,B=null,U=null,V=!0}},setScrollProgress:e=>{!X&&v&&(H=Math.min(Math.max(e,0),1),Z())},setConfig:e=>{X||(Object.assign(b,e),C(),V=!0,ee())},destroy:()=>{X||(X=!0,W=!1,er(),es.disconnect(),e.removeEventListener("webglcontextlost",el),window.removeEventListener("pointermove",ei),window.removeEventListener("touchmove",eo),window.removeEventListener("scroll",en,{capture:!0}),y.deleteTexture(j),y.deleteTexture(P),y.deleteBuffer(R),y.deleteShader(I),y.deleteShader(A),y.deleteProgram(S),y.getExtension("WEBGL_lose_context")?.loseContext())}}};var x=e.i(575509),b=e.i(997053);let v=b.default.div.withConfig({componentId:"sc-cda082ca-0"})(()=>b.css`
		position: absolute;
		inset: 0;

		pointer-events: none;
		user-select: none;

		// NOTE • Held transparent until the textures land, so the static image
		// underneath covers the gap instead of a black rectangle.
		opacity: 0;
		transition: opacity ${(0,x.getTime)("m")} ${(0,x.getEase)("ease")};

		&[data-ready='true'] {
			opacity: 1;
		}

		canvas {
			position: absolute;
			inset: 0;
			display: block;
			width: 100%;
			height: 100%;
		}
	`),y=b.default.div.withConfig({componentId:"sc-cda082ca-1"})(()=>b.css`
		position: fixed;
		inset: auto 0 0 0;
		z-index: 9999;

		max-height: 62dvh;
		overflow-y: auto;
		padding: 0.75rem;

		font: 500 11px/1.4 ui-monospace, monospace;
		color: #fff;
		background: rgb(0 0 0 / 0.82);
		backdrop-filter: blur(8px);
		border-top: 1px solid rgb(255 255 255 / 0.18);

		${x.bp.l`
			inset: 1rem 1rem auto auto;
			width: 17rem;
			max-height: calc(100dvh - 2rem);
			border: 1px solid rgb(255 255 255 / 0.18);
			border-radius: 6px;
		`}
	`),_=b.default.div.withConfig({componentId:"sc-cda082ca-2"})(()=>b.css`
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;

		button {
			padding: 0.3rem 0.55rem;
			font: inherit;
			color: #fff;
			cursor: pointer;
			background: rgb(255 255 255 / 0.12);
			border: 1px solid rgb(255 255 255 / 0.22);
			border-radius: 4px;
		}
	`),w=b.default.div.withConfig({componentId:"sc-cda082ca-3"})(()=>b.css`
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 0.65rem 0;

		label {
			display: flex;
			flex-direction: column;
			gap: 0.15rem;
		}

		span {
			display: flex;
			align-items: baseline;
			justify-content: space-between;
			gap: 0.5rem;
			opacity: 0.85;
		}

		em {
			font-style: normal;
			opacity: 0.7;
		}

		input {
			width: 100%;
			accent-color: #fff;
		}
	`),E=[{key:"parallaxStrength",label:"Parallax strength",min:0,max:.15,step:.001},{key:"parallaxFocus",label:"Parallax focus",min:0,max:1,step:.01},{key:"depthInfluence",label:"Depth influence",min:0,max:1,step:.01}],T=[{key:"scrollParallaxFrom",label:"Sweep from (y)",min:0,max:1,step:.01},{key:"scrollParallaxTo",label:"Sweep to (y)",min:0,max:1,step:.01},{key:"scrollDarkStart",label:"Start brightness",min:0,max:1,step:.01},{key:"scrollLightBy",label:"Lit by (progress)",min:.05,max:1,step:.01},{key:"floodLight",label:"Final brightness",min:0,max:2,step:.01}],S=[{key:"lightRadius",label:"Light radius",min:.2,max:3,step:.01},{key:"lightIntensity",label:"Light intensity",min:0,max:4,step:.05},{key:"lightFalloff",label:"Light falloff",min:.5,max:6,step:.1},{key:"ambient",label:"Ambient",min:0,max:1,step:.01},{key:"floodLight",label:"Flood brightness",min:0,max:2,step:.01},{key:"easing",label:"Cursor easing",min:.01,max:.3,step:.005},{key:"spotEaseIn",label:"Spot ease in",min:.005,max:.2,step:.005},{key:"spotEaseOut",label:"Flood ease out",min:.005,max:.2,step:.005},{key:"scrollFloodDistance",label:"Flood after (screens)",min:0,max:2,step:.05}],I=e=>{let a,n,s,c,u,d,f,p,m,g,h,x,b,v,I,R,k,L=(0,r.c)(38),{mode:j,base:P,onChange:C}=e,$="scroll"===j?T:S;L[0]!==$?(a=[...E,...$],L[0]=$,L[1]=a):a=L[1];let D=a;L[2]!==P?(n={...l,...P},L[2]=P,L[3]=n):n=L[3];let F=n,[M,O]=(0,i.useState)(F),[G,N]=(0,i.useState)(!0),[B,U]=(0,i.useState)(!1),[H,z]=(0,i.useState)(!1);L[4]===Symbol.for("react.memo_cache_sentinel")?(s=(e,t)=>{O(r=>({...r,[e]:t}))},L[4]=s):s=L[4];let W=s;L[5]!==F?(c=()=>O(F),L[5]=F,L[6]=c):c=L[6];let X=c;L[7]!==D||L[8]!==M?(u=()=>{let e=D.reduce((e,t)=>(e[t.key]=M[t.key],e),{});navigator.clipboard?.writeText(JSON.stringify(e,null,2)).then(()=>z(!0),()=>z(!1))},L[7]=D,L[8]=M,L[9]=u):u=L[9];let V=u;if(L[10]===Symbol.for("react.memo_cache_sentinel")?(d=()=>U(!0),f=[],L[10]=d,L[11]=f):(d=L[10],f=L[11]),(0,i.useEffect)(d,f),L[12]!==C||L[13]!==M?(m=()=>C(M),p=[M,C],L[12]=C,L[13]=M,L[14]=p,L[15]=m):(p=L[14],m=L[15]),(0,i.useEffect)(m,p),L[16]!==H?(g=()=>{if(!H)return;let e=window.setTimeout(()=>z(!1),1200);return()=>window.clearTimeout(e)},h=[H],L[16]=H,L[17]=g,L[18]=h):(g=L[17],h=L[18]),(0,i.useEffect)(g,h),!B)return null;L[19]!==j?(x=(0,t.jsxs)("strong",{children:["depth · ",j]}),L[19]=j,L[20]=x):x=L[20],L[21]===Symbol.for("react.memo_cache_sentinel")?(b=()=>N(A),L[21]=b):b=L[21];let Y=G?"hide":"show";return L[22]!==Y?(v=(0,t.jsx)("button",{type:"button",onClick:b,children:Y}),L[22]=Y,L[23]=v):v=L[23],L[24]!==x||L[25]!==v?(I=(0,t.jsxs)(_,{children:[x,v]}),L[24]=x,L[25]=v,L[26]=I):I=L[26],L[27]!==H||L[28]!==D||L[29]!==V||L[30]!==X||L[31]!==G||L[32]!==M?(R=G?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(w,{children:D.map(e=>(0,t.jsxs)("label",{children:[(0,t.jsxs)("span",{children:[e.label,(0,t.jsx)("em",{children:M[e.key].toFixed(3)})]}),(0,t.jsx)("input",{type:"range",min:e.min,max:e.max,step:e.step,value:M[e.key],onChange:t=>W(e.key,Number(t.target.value))})]},e.key))}),(0,t.jsxs)(_,{children:[(0,t.jsx)("button",{type:"button",onClick:X,children:"reset"}),(0,t.jsx)("button",{type:"button",onClick:V,children:H?"copied":"copy config"})]})]}):null,L[27]=H,L[28]=D,L[29]=V,L[30]=X,L[31]=G,L[32]=M,L[33]=R):R=L[33],L[34]!==G||L[35]!==I||L[36]!==R?(k=(0,o.createPortal)((0,t.jsxs)(y,{"data-open":G,children:[I,R]}),document.body),L[34]=G,L[35]=I,L[36]=R,L[37]=k):k=L[37],k};function A(e){return!e}I.displayName="DepthParallaxControls";let R=(0,i.forwardRef)(({imageSrc:e,imageElement:r,depthSrc:a,isActive:o=!0,mode:n="pointer",config:l,className:s},c)=>{let u=(0,i.useRef)(null),d=(0,i.useRef)(null),f=(0,i.useRef)(l);f.current=l;let p=(0,i.useRef)(0),[m,g]=(0,i.useState)(!1),[x,b]=(0,i.useState)(!1),[y,_]=(0,i.useState)(!1),w=(0,i.useCallback)(e=>{d.current?.setConfig(e)},[]);return(0,i.useImperativeHandle)(c,()=>({setScrollProgress:e=>{p.current=e,d.current?.setScrollProgress(e)}}),[]),(0,i.useEffect)(()=>{_(new URLSearchParams(window.location.search).has("depth-debug"))},[]),(0,i.useEffect)(()=>{let t=u.current;if(!t)return;let i=document.createElement("canvas");t.appendChild(i);let o=new AbortController;return h({canvas:i,imageSrc:e,imageElement:r,depthSrc:a,mode:n,config:f.current,signal:o.signal,onFirstPaint:()=>b(!0),onContextLost:()=>{g(!1),b(!1)}}).then(e=>{if(e){if(o.signal.aborted)return void e.destroy();d.current=e,e.setScrollProgress(p.current),g(!0)}}).catch(()=>g(!1)),()=>{o.abort(),d.current?.destroy(),d.current=null,i.remove(),g(!1),b(!1)}},[e,r,a,n]),(0,i.useEffect)(()=>{d.current?.setActive(o&&m)},[o,m]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(v,{ref:u,className:s,"data-ready":x,"aria-hidden":"true"}),y?(0,t.jsx)(I,{mode:n,base:l,onChange:w}):null]})});R.displayName="DepthParallax";var k=e.i(481293),L=e.i(89835),j=e.i(101384),P=e.i(748656),C=e.i(229352),$=e.i(607561),D=e.i(255981),F=e.i(494473),M=e.i(989970),O=e.i(883495),G=e.i(255667),N=e.i(212960);let B=(0,b.default)(x.Div).attrs({as:"footer"}).withConfig({componentId:"sc-a2c8839e-0"})(()=>b.css`
		--offset: calc(${(0,x.getGap)("huge")} + ${(0,x.getGap)("l")});

		position: relative;
		z-index: 0;
		overflow: clip;

		display: flex;
		align-items: flex-start;
		justify-content: flex-start;

		width: 100%;
		min-height: 100dvh;
		padding-top: var(--offset);
		background: ${(0,x.getGlobal)("black")};

		${x.bp.l` --offset: calc(${(0,x.getGap)("col")} + ${(0,x.getGap)("l")})`}


		&:after {
			content: '';
            position: absolute;
            inset: 0;
            z-index: 0;
            background: linear-gradient(to bottom, ${(0,x.getGlobal)("black")} 0%, transparent 50%);
        }

		waffl-grid {
			position: relative;
			z-index: 1;
		}
	`),U=(0,b.default)(x.Div).attrs({as:"aside"}).withConfig({componentId:"sc-a2c8839e-1"})(()=>b.css`
		position: absolute;
		inset: 0;
		z-index: -2;
		overflow: clip;
		pointer-events: none;
		user-select: none;

		// NOTE • The picture is the base layer and the depth-parallax canvas sits
		// on top of it, so it doubles as the fallback whenever the scene is off
		// (mobile, reduced motion, no depth map, no WebGL) or still loading.
		picture {
			display: block;
			width: 100%;
			height: 100%;

			img {
				display: block;
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: center bottom;

				${x.bp.l`
					object-position: center center;
				`}
			}
		}
	`),H=(0,b.default)(x.Div).withConfig({componentId:"sc-a2c8839e-2"})(()=>b.css`
		position: relative;
		z-index: 2;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: ${(0,x.getGap)("m")};
		width: 100%;

		${x.bp.l` gap: ${(0,x.getGap)("l")} `}

		a { margin-top: ${(0,x.getGap)("xs")} }
	`),z=(0,b.default)(x.Div).withConfig({componentId:"sc-a2c8839e-3"})(()=>b.css`
		h2 {
			${N.headlineL}

			/* One word per line. SplitText wraps each word in a div; laid out as a
			   centred column they stack regardless of how wide the line would be. */
			display: flex;
			flex-direction: column;
			align-items: center;

			margin: 0;
			text-align: center;
			color: ${(0,x.getBrand)("bc5")};
		}
	`),W=(0,b.default)(x.Div).withConfig({componentId:"sc-a2c8839e-4"})(()=>b.css`
		display: flex;
	`),X=(0,b.default)(x.Div).attrs({as:"p"}).withConfig({componentId:"sc-a2c8839e-5"})(()=>b.css`
		${N.captionL}	

		color: ${(0,x.getBrand)("bc5",60)};
		text-align: center;
	`),V=(0,b.default)(x.Div).withConfig({componentId:"sc-a2c8839e-6"})(()=>b.css`
		--offset: ${(0,x.getGap)("xxl")};
		
		position: absolute;
		inset: auto 0 var(--offset) 0;
		z-index: 5;

		display: grid;
		place-items: center;
		width: 100%;
		
	`),Y=[...Array(12)].map((e,t)=>`&:nth-child(${t+1}) { transition-delay: ${.02*t}s; }`).join("\n"),q=b.default.button.withConfig({componentId:"sc-a2c8839e-7"})(()=>b.css`
		${N.captionL}

		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: ${(0,x.getGap)("s")};
		cursor: pointer;

		@media (hover: hover) and (pointer: fine) {
            &:hover {
                span > span {
                    opacity: 0.6;
					transform: translateY(4em);
                }

				i  svg {
					&:last-child { transform: translateY(0%) }
					&:first-child { transform: translateY(-200%) }
				}
            }
        }

		> span {
			overflow: clip;

			> span {
				display: inline-block;
				padding: 0;
				margin: 0;
				text-shadow: ${(0,x.getBrand)("bc5",60)} 0px -4em 0px;
				transition: transform 0.5s ${(0,x.getEase)("bezzy2")};
			
				${Y}		
			}
		}
	`),K=e=>{let a,i,o,n=(0,r.c)(5),{lenis:l}=e;n[0]!==l?(a=()=>{l?.scrollTo(0,{duration:1.2})},n[0]=l,n[1]=a):a=n[1];let s=a;return n[2]===Symbol.for("react.memo_cache_sentinel")?(i=(0,t.jsx)("span",{children:"Back to Top".split("").map(J)}),n[2]=i):i=n[2],n[3]!==s?(o=(0,t.jsx)(q,{type:"button","aria-label":"Back to Top",onClick:s,children:i}),n[3]=s,n[4]=o):o=n[4],o};function J(e,r){return(0,t.jsx)("span",{children:" "===e?" ":e},`${e}_${r.toString()}`)}K.displayName="BackToTop";var Q=e.i(221781),Z=e.i(486861),ee=e.i(189897),et=e.i(797489),er=e.i(274879),ea=e.i(875324);let ei="top bottom",eo="bottom bottom",en="top 75%",el=e=>{let a,o,n,l,s,c=(0,r.c)(19),{heading:u,editAttr:d,triggerRef:f}=e,{isReducedMotion:p}=(0,i.use)(j.PerformanceContext),m=(0,i.useRef)(null),g=(0,G.useLenis)();c[0]!==u?(a=(0,ee.cleanSanityString)(u)??"",c[0]=u,c[1]=a):a=c[1];let h=a,x=(0,er.useSplitTextRecovery)(m,h);c[2]!==h?(o=(0,Z.escapeHtml)(h),c[2]=h,c[3]=o):o=c[3];let b=(0,et.useInnerHtml)(o);return(c[4]!==h||c[5]!==p||c[6]!==g?.rootElement||c[7]!==f?(n=()=>{let e=m.current,t=g?.rootElement;if(!e||!h||!t)return;let r=ea.SplitText.create(e,{type:"words"}),{words:a}=r;if(!a.length)return()=>r.revert();if(p)return M.default.set(a,{autoAlpha:1,scale:1,filter:"blur(0px)",display:"inline-block",verticalAlign:"top",willChange:"auto"}),()=>r.revert();(e=>{if(!e.length)return;let t=1/0,r=1/0,a=-1/0,i=-1/0;for(let o of e)t=Math.min(t,o.offsetLeft),r=Math.min(r,o.offsetTop),a=Math.max(a,o.offsetLeft+o.offsetWidth),i=Math.max(i,o.offsetTop+o.offsetHeight);let o=(t+a)/2,n=(r+i)/2;for(let t of e)M.default.set(t,{transformOrigin:`${o-t.offsetLeft}px ${n-t.offsetTop}px`,force3D:!0})})(a),M.default.set(a,{autoAlpha:0,scale:Q.TITLE_SCALE_START,filter:`blur(${Q.TITLE_BLUR_START}px)`,display:"inline-block",verticalAlign:"top",willChange:"opacity, transform, filter"});let i={progress:0},o=M.default.to(i,{progress:1,duration:.9,ease:"power2.out",paused:!0,onUpdate:()=>(e=>{for(let[t,r]of a.entries()){let{scale:i,opacity:o,blur:n}=(0,Q.getIntroGrowInWordValues)(e,t,a.length);M.default.set(r,{autoAlpha:o,scale:i,filter:`blur(${n}px)`})}})(i.progress),onComplete:()=>M.default.set(a,{willChange:"auto"})}),n=O.default.create({trigger:f?.current??e,scroller:t,start:en,once:!0,onEnter:()=>o.play()});return n.progress>0&&o.play(),()=>{n.kill(),o.kill(),r.revert()}},c[4]=h,c[5]=p,c[6]=g?.rootElement,c[7]=f,c[8]=n):n=c[8],c[9]!==h||c[10]!==p||c[11]!==g||c[12]!==x||c[13]!==f?(l={scope:m,dependencies:[h,p,g,x,f]},c[9]=h,c[10]=p,c[11]=g,c[12]=x,c[13]=f,c[14]=l):l=c[14],(0,$.useAnimation)(n,l),h)?(c[15]!==h||c[16]!==d||c[17]!==b?(s=(0,t.jsx)(z,{children:(0,t.jsx)("h2",{ref:m,"data-sanity":d,dangerouslySetInnerHTML:b},h)}),c[15]=h,c[16]=d,c[17]=b,c[18]=s):s=c[18],s):null};el.displayName="CtaHeading";var es=e.i(371136),ec=e.i(676842);let eu={parallaxStrength:.05},ed=e=>{let o,n,l,s,c,u,d,f,p,m,g,h,x,b,v,y,_,w,E,T,S,I,A,N,z=(0,r.c)(72),{heading:Y,headingEditAttr:q,subheading:J,mobile:Q,desktop:Z,isContact:ee}=e,{isReducedMotion:et}=(0,i.use)(j.PerformanceContext),er=(0,i.useRef)(null),ea=(0,i.useRef)(null),ed=(0,i.useRef)(null),ep=(0,i.useRef)(null),em=(0,i.useRef)(null),eg=(0,i.useRef)(null),eh=(0,i.useRef)(0),ex=(0,G.useLenis)();z[0]!==ex?(o=e=>(0,C.scrollToForm)(ex,e),z[0]=ex,z[1]=o):o=z[1];let eb=o,ev=(0,D.useIsDesktopViewport)(),[ey,e_]=(0,i.useState)(!1),[ew,eE]=(0,i.useState)(!1),[eT,eS]=(0,i.useState)(null);z[2]===Symbol.for("react.memo_cache_sentinel")?(n=e=>{em.current=e,e?.setScrollProgress(eh.current)},z[2]=n):n=z[2];let eI=n,eA=!!(Z?.image&&Q?.image&&Y&&J),eR=ev?Z:Q,ek=eR?.depthMap,eL=!ev;z[3]!==ek||z[4]!==eL?(l=((e,t=!1)=>{var r;let a;return r=t?720:1280,(a=(0,k.resolveSanityImage)(e))?(0,k.urlFor)(a).width(r).fit("max").quality(95).auto("format").url():null})(ek,eL),z[3]=ek,z[4]=eL,z[5]=l):l=z[5];let ej=l,eP=!!ej&&!et,eC=ev?"pointer":"scroll";z[6]!==eA||z[7]!==ew||z[8]!==ex?.rootElement?(s=()=>{let e=er.current;if(!e||!eA||ew)return;let t=ex?.rootElement??null,r=new IntersectionObserver(e=>{e.some(ef)&&(eE(!0),r.disconnect())},{root:t,rootMargin:`${t?.clientHeight??window.innerHeight}px 0px`});return r.observe(e),()=>r.disconnect()},z[6]=eA,z[7]=ew,z[8]=ex?.rootElement,z[9]=s):s=z[9],z[10]!==eA||z[11]!==ew||z[12]!==ex?(c=[eA,ew,ex],z[10]=eA,z[11]=ew,z[12]=ex,z[13]=c):c=z[13],(0,i.useEffect)(s,c),z[14]!==Z?.image||z[15]!==eA||z[16]!==Q?.image?(u=()=>{if(!eA||!Z?.image||!Q?.image)return;let e=eg.current?.querySelector("img");if(!e)return;let t=()=>{!e.complete||!e.naturalWidth||!e.currentSrc||(0,P.isDeferredImage)(e)||eS(t=>t?.element===e&&t.src===e.currentSrc?t:{element:e,src:e.currentSrc})};return t(),e.addEventListener("load",t),()=>e.removeEventListener("load",t)},z[14]=Z?.image,z[15]=eA,z[16]=Q?.image,z[17]=u):u=z[17],z[18]!==Z||z[19]!==eA||z[20]!==Q?(d=[Z,Q,eA],z[18]=Z,z[19]=eA,z[20]=Q,z[21]=d):d=z[21],(0,i.useEffect)(u,d),z[22]!==eA||z[23]!==ex?.rootElement?(f=()=>{let e=er.current;if(!e||!eA)return;let t=new IntersectionObserver(e=>{let t=e[0];t&&e_(t.isIntersecting)},{root:ex?.rootElement??null});return t.observe(e),()=>t.disconnect()},z[22]=eA,z[23]=ex?.rootElement,z[24]=f):f=z[24],z[25]!==eA||z[26]!==ex?(p=[ex,eA],z[25]=eA,z[26]=ex,z[27]=p):p=z[27],(0,i.useEffect)(f,p),z[28]===Symbol.for("react.memo_cache_sentinel")?(m=()=>er.current?[er.current]:[],z[28]=m):m=z[28];let e$=m;return(z[29]===Symbol.for("react.memo_cache_sentinel")?(g=[],h={distanceThreshold:"50%"},z[29]=g,z[30]=h):(g=z[29],h=z[30]),(0,es.useLenisSnap)(ex,e$,g,h),z[31]===Symbol.for("react.memo_cache_sentinel")?(x={distanceThreshold:"50%"},z[31]=x):x=z[31],(0,ec.useNativeSnap)(ex,e$,!0,x),z[32]!==et||z[33]!==ex?.rootElement?(b=e=>{let{isDesktop:t}=e,r=er.current,a=ea.current,i=ex?.rootElement;if(!r||!a||!i)return;let o=[];M.default.set(a,{autoAlpha:0}),M.default.to(a,{autoAlpha:1,ease:"none",scrollTrigger:{trigger:r,scroller:i,start:"top bottom",end:"center bottom",scrub:!0,markers:!1}}),t&&M.default.from(a,{scale:1.5,ease:"none",scrollTrigger:{trigger:r,scroller:i,start:ei,end:eo,scrub:!0}});let n=ep.current;if(n&&!et){M.default.set(n,{autoAlpha:0,y:16});let e=M.default.to(n,{autoAlpha:1,y:0,duration:.6,ease:"power2.out",delay:.7200000000000001,paused:!0}),t=O.default.create({trigger:r,scroller:i,start:en,once:!0,onEnter:()=>e.play()});t.progress>0&&e.play(),o.push(()=>{t.kill(),e.kill()})}if(t||M.default.from(a,{scale:1.5,transformOrigin:"center bottom",ease:"none",scrollTrigger:{trigger:r,scroller:i,start:ei,end:eo,scrub:!0}}),!t){let e=O.default.create({trigger:r,scroller:i,start:ei,end:eo,onUpdate:e=>{eh.current=e.progress,em.current?.setScrollProgress(e.progress)},onRefresh:e=>{eh.current=e.progress,em.current?.setScrollProgress(e.progress)}});o.push(()=>e.kill())}return()=>{for(let e of o)e()}},z[32]=et,z[33]=ex?.rootElement,z[34]=b):b=z[34],z[35]!==ee||z[36]!==et||z[37]!==ex?(v={scope:er,dependencies:[ex,ee,et]},z[35]=ee,z[36]=et,z[37]=ex,z[38]=v):v=z[38],(0,$.useAnimation)(b,v),Z?.image&&Q?.image&&Y&&J)?(z[39]!==Z.image||z[40]!==ew||z[41]!==Q.image?(y=(0,t.jsx)(L.default,{ref:eg,enabled:ew,desktop:Z.image,mobile:Q.image,fill:!0,sizes:"100vw",quality:85,crossOrigin:"anonymous"}),z[39]=Z.image,z[40]=ew,z[41]=Q.image,z[42]=y):y=z[42],z[43]!==eT||z[44]!==ej||z[45]!==eP||z[46]!==ev||z[47]!==ew||z[48]!==ey||z[49]!==eC?(_=eP&&ew&&eT&&ej?(0,t.jsx)(R,{ref:eI,mode:eC,config:ev?void 0:eu,imageSrc:eT.src,imageElement:eT.element,depthSrc:ej,isActive:ey}):null,z[43]=eT,z[44]=ej,z[45]=eP,z[46]=ev,z[47]=ew,z[48]=ey,z[49]=eC,z[50]=_):_=z[50],z[51]!==y||z[52]!==_?(w=(0,t.jsxs)(U,{ref:ea,"aria-hidden":"true",children:[y,_]}),z[51]=y,z[52]=_,z[53]=w):w=z[53],z[54]!==J?(E=(0,t.jsx)(X,{children:J}),z[54]=J,z[55]=E):E=z[55],z[56]!==Y||z[57]!==q?(T=(0,t.jsx)(el,{heading:Y,editAttr:q,triggerRef:er}),z[56]=Y,z[57]=q,z[58]=T):T=z[58],z[59]!==eb||z[60]!==ee?(S=(0,t.jsx)(W,{ref:ep,children:ee?(0,t.jsx)(a.default,{to:C.FORM_ANCHOR,onClick:eb,label:"Start the conversation",aria:"Go to the enquiry form"}):(0,t.jsx)(a.default,{to:"/contact",label:"Start Your Project",aria:"Go to Contact"})}),z[59]=eb,z[60]=ee,z[61]=S):S=z[61],z[62]!==E||z[63]!==T||z[64]!==S?(I=(0,t.jsx)(F.default,{children:(0,t.jsxs)(H,{$l:"2/12",$xl:"3/11",ref:ed,children:[E,T,S]})}),z[62]=E,z[63]=T,z[64]=S,z[65]=I):I=z[65],z[66]!==ex?(A=(0,t.jsx)(V,{children:(0,t.jsx)(K,{lenis:ex})}),z[66]=ex,z[67]=A):A=z[67],z[68]!==w||z[69]!==I||z[70]!==A?(N=(0,t.jsxs)(B,{ref:er,"data-global-cta":!0,children:[w,I,A]}),z[68]=w,z[69]=I,z[70]=A,z[71]=N):N=z[71],N):null};function ef(e){return e.isIntersecting}ed.displayName="GlobalCta",e.s(["default",0,ed],576978)},221781,e=>{"use strict";var t=e.i(989970);let r=t.default.parseEase("power2.in");t.default.parseEase("power2.out");let a=(e,t,r,a,i)=>r<=0?0:Math.max(0,Math.min(1,(e*((r-1)*a+i)-t*a)/i));e.s(["DESCRIPTION_LINE_GAP",0,.14,"DESCRIPTION_LINE_REVEAL",0,.9,"TITLE_BLUR_START",0,8,"TITLE_SCALE_START",0,0,"TITLE_WORD_GAP",0,.15,"TITLE_WORD_REVEAL",0,.8,"getGrowOutWordValues",0,(e,t,i)=>{let o=r(a(e,i-1-t,i,.083,.667));return{scale:1+ +o,opacity:1-o,blur:8*o}},"getIntroGrowInWordValues",0,(e,t,r)=>{let i=a(e,t,r,.15,.8);return{scale:0+ +i,opacity:i,blur:(1-i)*8}},"getStaggeredSegmentProgress",0,a])},375476,e=>{"use strict";var t=e.i(843476),r=e.i(500932),a=e.i(271645),i=e.i(575509),o=e.i(997053);let n=(0,o.default)(i.Div).attrs({as:"section"}).withConfig({componentId:"sc-6db9e853-0"})(({$isInView:e=!1})=>o.css`
        --gap: ${(0,i.getGap)("xxl")};
        --speed: 20s;
        --play-state: ${e?"running":"paused"};
        --offset: 30%;

        display: flex;
        overflow: hidden;
        user-select: none;
        gap: var(--gap);

        
        mask-image: linear-gradient(
            to right,
            transparent 0%,
            #000 var(--offset) 30%,
            #000 calc(100% - var(--offset)),
            transparent 100%
        );
        mask-size: 100% 100%;
        mask-repeat: no-repeat;

        ul {
            flex-shrink: 0;
            display: flex;
            justify-content: space-around;
            min-width: 100%;
            gap: var(--gap);
            animation: logoMarquee var(--speed) linear infinite var(--play-state);

            li {
                aspect-ratio: 2 / 1;
                width: auto;
                height: 4rem;

                ${i.bp.l`  height: 6rem; `}

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    object-position: center;
                }
            }
        }

        @keyframes logoMarquee {
            from {
                transform: translateX(0);
            }
            to {
                transform: translateX(calc(-100% - var(--gap)));
            }
        }
    `),l=e=>{let i,o,l,s,c,u,d=(0,r.c)(12),{logos:f}=e,p=(0,a.useRef)(null),[m,g]=(0,a.useState)(!1);if(d[0]===Symbol.for("react.memo_cache_sentinel")?(i=()=>{let e=p.current;if(!e)return;let t=new IntersectionObserver(e=>{let[t]=e,r=t?.isIntersecting??!1;g(e=>e===r?e:r)},{threshold:0});return t.observe(e),()=>t.disconnect()},o=[],d[0]=i,d[1]=o):(i=d[0],o=d[1]),(0,a.useEffect)(i,o),!f?.length)return null;d[2]!==m||d[3]!==f?(l=e=>(0,t.jsx)("ul",{"aria-hidden":e,children:f.map(r=>(0,t.jsx)("li",{children:(0,t.jsx)("img",{src:r.src,alt:e?"":r.alt,width:120,height:60,decoding:"async",loading:m?"eager":"lazy"})},r.src))}),d[2]=m,d[3]=f,d[4]=l):l=d[4];let h=l;return d[5]!==h?(s=h(!1),c=h(!0),d[5]=h,d[6]=s,d[7]=c):(s=d[6],c=d[7]),d[8]!==m||d[9]!==s||d[10]!==c?(u=(0,t.jsxs)(n,{ref:p,$isInView:m,children:[s,c]}),d[8]=m,d[9]=s,d[10]=c,d[11]=u):u=d[11],u};l.displayName="LogoMarquee",e.s(["default",0,l],375476)},229352,e=>{"use strict";let t="#form",r={duration:1.2,offset:-200};e.s(["FORM_ANCHOR",0,t,"scrollToForm",0,(e,a)=>{e&&(a?.preventDefault(),e.scrollTo(t,r))}])}]);