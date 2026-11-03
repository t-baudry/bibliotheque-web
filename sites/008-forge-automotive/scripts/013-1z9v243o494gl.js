(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,124821,135741,e=>{"use strict";var t=e.i(843476),a=e.i(500932);let o=null;var r=e.i(271645),i=e.i(575509),n=e.i(212960),s=e.i(951847),l=e.i(997053);let c=[...Array(25)].map((e,t)=>`&:nth-child(${t+1}) { transition-delay: ${.02*t}s; }`).join("\n"),f=({$isFullWidth:e})=>l.css`
    @property --gradient-angle {
            syntax: "<angle>";
            initial-value: 0deg;
            inherits: false;
        }

        @property --gradient-angle-offset {
            syntax: "<angle>";
            initial-value: 0deg;
            inherits: false;
        }

        @property --gradient-percent {
            syntax: "<percentage>";
            initial-value: 5%;
            inherits: false;
        }

        @property --gradient-shine {
            syntax: "<color>";
            initial-value: white;
            inherits: false;
        }

        @keyframes gradient-angle {
            to {
                --gradient-angle: 360deg;
            }
        }

        @keyframes shimmer {
            to {
                rotate: 360deg;
            }
        }

        --ease: ease-in-out;
        --dur: 0.5s;
        --play-state: paused;

        position: relative;
        display: grid;
        place-items: center;
        white-space: nowrap;

        width: ${e?"100%":"max-content"};
        padding:  ${(0,i.getGap)("sm")} ${(0,i.getGap)("l")};

        border: 1px solid ${(0,i.getBrand)("bc5",10)};
        background: ${(0,i.getGlobal)("black",10)};
        text-decoration: none;
        transition: border-color var(--ease) var(--dur);

        ${i.bp.l`
            backdrop-filter: blur(4px);
        `}

        

        &[disabled],
        &[aria-disabled='true'] {
            opacity: 0.4;
            pointer-events: none;

            // Pause shimmer and gradient animations if the button is disabled or aria-disabled
            > i {
                animation-play-state: paused;
                opacity: 0;
            }
        }


        &:focus-visible {
            outline: 1px dashed ${(0,i.getBrand)("bc5",60)};
            outline-offset: 2px;
            border-color: ${(0,i.getBrand)("bc3",40)};
        }
   


        @media (hover: hover) and (pointer: fine) {
            &:hover {
                cursor: pointer;
                border-color: ${(0,i.getBrand)("bc5",40)};
                
                > span {
                    opacity: 0.6;

                    span { transform: translateY(4em) }
                }
            }
        }
   

        > span {
            ${n.captionL}

            display: block;
            position: relative;
            z-index: 1;
            overflow: clip;

            transition: opacity var(--ease) var(--dur), letter-spacing var(--ease) var(--dur);


            span {
                display: inline-block;
                padding: 0;
                margin: 0;
                text-shadow: ${(0,i.getBrand)("bc5",60)} 0px -4em 0px;
                transition: transform 0.5s ${(0,i.getEase)("bezzy2")};
            
                ${c}
            }
        }

        > i {
            --duration: 5s;
            --stroke: 1px;
            --offset-start: 25%;
            --offset-end: 75%;

            position: absolute;
            inset: calc(var(--stroke) * -1);
            z-index: 0;
            mix-blend-mode: screen;
            pointer-events: none;

            padding: var(--stroke);
            background: conic-gradient(
                from calc(var(--gradient-angle) - var(--gradient-angle-offset)) at center,
                transparent calc(var(--offset-start) - var(--gradient-percent) * 2),
                ${(0,i.getBrand)("bc5",0)} calc(var(--offset-start) - var(--gradient-percent)),
                white var(--offset-start),
                ${(0,i.getBrand)("bc5",0)} calc(var(--offset-start) + var(--gradient-percent)),
                transparent calc(var(--offset-start) + var(--gradient-percent) * 2),
                transparent calc(var(--offset-end) - var(--gradient-percent) * 2),
                ${(0,i.getBrand)("bc5",0)} calc(var(--offset-end) - var(--gradient-percent)),
                white var(--offset-end),
                ${(0,i.getBrand)("bc5",0)}	 calc(var(--offset-end) + var(--gradient-percent)),
                transparent calc(var(--offset-end) + var(--gradient-percent) * 2)
            );

            /* Ring mask — only the stroke is painted; centre stays fully transparent. */
            -webkit-mask:
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask:
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
            mask-composite: exclude;

            transition:
                opacity 0.5s var(--ease),
                var(--gradient-angle-offset) var(--duration) var(--ease),
                var(--gradient-percent) var(--duration) var(--ease),
                var(--gradient-shine) var(--duration) var(--ease);

            animation: gradient-angle 4.5s linear infinite var(--play-state);

            @media (prefers-reduced-motion: reduce) {
                animation: none;
            }
        }
`,d=(0,l.default)(s.Link).withConfig({componentId:"sc-6f2721c4-0"})(({$isFullWidth:e})=>l.css`
        ${f({$isFullWidth:e})}
    `),u=l.default.button.withConfig({componentId:"sc-6f2721c4-1"})(({$isFullWidth:e})=>l.css`
        ${f({$isFullWidth:e})}
    `);e.s(["Button",0,u,"Jacket",0,d,"sharedStyles",0,f],135741);let m=e=>{let i,n,s,l,c=(0,a.c)(6),f=(0,r.useRef)(null),m=(0,r.useRef)(null);if(c[0]!==e.isButton?(i=()=>{let t=e.isButton?f.current:m.current;if(t){let e;return(e=o||(o=new IntersectionObserver(e=>{for(let t of e)t.target instanceof HTMLElement&&t.target.style.setProperty("--play-state",t.isIntersecting?"running":"paused")},{threshold:0}))).observe(t),()=>e.unobserve(t)}},n=[e.isButton],c[0]=e.isButton,c[1]=i,c[2]=n):(i=c[1],n=c[2]),(0,r.useEffect)(i,n),c[3]!==e){l=Symbol.for("react.early_return_sentinel");e:{let a=[];for(let o=0;o<e.label.length;o+=1){let r=e.label[o];a.push((0,t.jsx)("span",{children:" "===r?" ":r},`${e.label}-${o}`))}let o=p;if(e.isButton){let{aria:r,label:i,onClick:n,isFullWidth:s,type:c,disabled:d}=e,m=void 0!==d&&d;l=(0,t.jsx)(u,{ref:f,type:void 0===c?"button":c,"aria-label":r??i,"aria-disabled":m,$isFullWidth:void 0!==s&&s,disabled:m,onClick:n,children:o(a)});break e}let{aria:r,label:i,to:n,onClick:c,isFullWidth:h,transitionAwaitsContent:g,prefetch:v,tabIndex:b}=e;s=(0,t.jsx)(d,{ref:m,href:n,"aria-label":r??i,$isFullWidth:void 0!==h&&h,onClick:c,transitionAwaitsContent:g,prefetch:v,tabIndex:b,children:o(a)})}c[3]=e,c[4]=s,c[5]=l}else s=c[4],l=c[5];return l!==Symbol.for("react.early_return_sentinel")?l:s};function p(e){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("span",{children:e}),(0,t.jsx)("i",{"aria-hidden":"true"})]})}m.displayName="Button",e.s(["default",0,m],124821)},394735,e=>{"use strict";var t=e.i(843476),a=e.i(989970),o=e.i(271645);let r=`
attribute vec2 aPosition;
uniform vec2 uResolution;
uniform vec2 uImageSize;
varying vec2 vUv;

void main() {
	vec2 uv = aPosition * 0.5 + 0.5;
	float scale = max(uResolution.x / uImageSize.x, uResolution.y / uImageSize.y);
	vec2 visible = uResolution / scale;
	vec2 offset = (uImageSize - visible) * 0.5;
	vUv = (uv * visible + offset) / uImageSize;
	gl_Position = vec4(aPosition, 0.0, 1.0);
}
`,i=`
precision highp float;

uniform sampler2D uImage;
uniform sampler2D uMask;
uniform sampler2D uText;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform float uHasText;
uniform float uTime;
uniform vec2 uFlow;
uniform float uIntensity;
uniform float uScale;
uniform float uSplit;
uniform float uShowMask;
uniform float uSmokeOpacity;
uniform float uSmokeScale;
uniform float uSmokeSpeed;
uniform vec3 uSmokeColor;
varying vec2 vUv;

// NOTE • Fract-based hash rather than the usual sin() one: time scrolls the
// noise coordinates without bound, and sin() of a very large argument loses
// precision on the GPU and starts to show structure after a few minutes.
float hash(vec2 p) {
	vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
	q += dot(q, q.yzx + 33.33);
	return fract((q.x + q.y) * q.z);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));
	return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
	float value = 0.0;
	float amplitude = 0.5;
	for (int i = 0; i < 4; i++) {
		value += amplitude * noise(p);
		p = p * 2.05 + vec2(17.3, 9.1);
		amplitude *= 0.5;
	}
	return value;
}

// One sheet of smoke drifting along the flow. The coordinates are warped by a
// second noise read before the fbm — that warp is what makes wisps curl rather
// than sit as round blobs.
float smokeSheet(vec2 q, float scale, float drift, float time) {
	vec2 s = q * scale + vec2(-time * drift, 0.0);
	vec2 warp = vec2(
		noise(s * 1.7 + vec2(0.0, time * 0.35)),
		noise(s * 1.7 + vec2(5.2, -time * 0.3))
	) - 0.5;
	return fbm(s + warp * 0.8);
}

void main() {
	vec4 maps = texture2D(uMask, vUv);
	float mask = maps.r;
	float smokeMask = maps.g;

	// Flow frame: q.x runs along the flow, q.y across it.
	vec2 across = vec2(-uFlow.y, uFlow.x);
	vec2 q = vec2(dot(vUv, uFlow), dot(vUv, across)) * vec2(uScale * 0.66, uScale);
	float n1 = noise(q + vec2(-uTime * 1.6, 0.0));
	float n2 = noise(q * 2.3 + vec2(-uTime * 2.9, 0.7));
	vec2 offset = ((n1 - 0.5) * across + (n2 - 0.5) * 0.4 * uFlow) * uIntensity * mask;

	// Hot air refracts each wavelength a little differently — a touch of split
	// inside the haze sells it. Zero for a clean displacement.
	float r = texture2D(uImage, vUv + offset * (1.0 + uSplit)).r;
	float g = texture2D(uImage, vUv + offset).g;
	float b = texture2D(uImage, vUv + offset * (1.0 - uSplit)).b;

	vec3 color = vec3(r, g, b);

	// Text: drawn in screen space (see text.ts), so the image-space offset is
	// rescaled by how much of the image the screen shows. Sampled per channel at
	// the same split offsets as the photo — it is on the same plane, behind the gas.
	if (uHasText > 0.5) {
		float cover = max(uResolution.x / uImageSize.x, uResolution.y / uImageSize.y);
		vec2 screenOffset = offset * uImageSize * cover / uResolution;
		vec2 screenUv = gl_FragCoord.xy / uResolution;
		vec4 tr = texture2D(uText, screenUv + screenOffset * (1.0 + uSplit));
		vec4 tg = texture2D(uText, screenUv + screenOffset);
		vec4 tb = texture2D(uText, screenUv + screenOffset * (1.0 - uSplit));
		color = vec3(mix(color.r, tr.r, tr.a), mix(color.g, tg.g, tg.a), mix(color.b, tb.b, tb.a));
	}

	// Smoke: the visible part of the same gas, so it rides the same flow and is
	// sampled at the displaced UV so the haze wobbles it too. Two sheets at
	// different scales and speeds — their parallax is most of what reads as volume.
	if (smokeMask > 0.002) {
		vec2 displaced = vUv + offset;
		vec2 qs = vec2(dot(displaced, uFlow), dot(displaced, across));
		float t = uTime * uSmokeSpeed;
		float coarse = smokeSheet(qs, uSmokeScale, 0.55, t);
		float fine = smokeSheet(qs + vec2(3.1, 1.7), uSmokeScale * 2.4, 0.9, t);
		// Thresholded so there is clear air between tendrils, not a veil.
		float density = smoothstep(0.42, 0.78, coarse * 0.65 + fine * 0.35);
		// Emission breathes — puffs and thins rather than a constant stream.
		float breath = 0.7 + 0.3 * noise(vec2(t * 0.3, 1.3));
		density *= smokeMask * breath;
		// A little of the photo mixed in keeps it from looking pasted on.
		vec3 tint = mix(uSmokeColor, color, 0.15);
		color = mix(color, tint, density * uSmokeOpacity);
	}

	// Debug overlay: red = distortion map, green = smoke map.
	color = mix(color, vec3(maps.r, maps.g, 0.0), uShowMask);
	gl_FragColor = vec4(color, 1.0);
}
`;var n=e.i(575509),s=e.i(997053);let l=(0,s.default)(n.Div).withConfig({componentId:"sc-576b4e69-0"})(()=>s.css`
		position: relative;
		overflow: clip;
		width: 100%;
		height: 100%;
		background: #000;
	`),c=s.default.img.withConfig({componentId:"sc-576b4e69-1"})(()=>s.css`
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		user-select: none;
	`),f=(0,s.default)(n.Div).withConfig({componentId:"sc-576b4e69-2"})(({$isReady:e})=>s.css`
		position: absolute;
		inset: 0;
		opacity: ${+!!e};
		transition: opacity ${(0,n.getTime)("m")} ${(0,n.getEase)("bezzy")};

		canvas {
			display: block;
			width: 100%;
			height: 100%;
		}
	`),d=(0,s.default)(n.Div).withConfig({componentId:"sc-576b4e69-3"})(()=>s.css`
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;

		a,
		button {
			pointer-events: auto;
		}

		[data-haze-text] {
			opacity: 0;
			pointer-events: none;
			user-select: none;
		}
	`),u=(e,t)=>"uppercase"===t?e.toUpperCase():"lowercase"===t?e.toLowerCase():"capitalize"===t?e.replace(/(^|\s)\S/g,e=>e.toUpperCase()):e,m=(e,t,a)=>{let o=e.createShader(t);if(!o)throw Error("HeatHaze: could not create shader");if(e.shaderSource(o,a),e.compileShader(o),!e.getShaderParameter(o,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(o)??"unknown error";throw e.deleteShader(o),Error(`HeatHaze: shader failed to compile — ${t}`)}return o},p=(e,t)=>{let a=e.createTexture();if(!a)throw Error("HeatHaze: could not create texture");return e.bindTexture(e.TEXTURE_2D,a),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t),a},h=e=>new Promise((t,a)=>{let o=new Image;o.crossOrigin="anonymous",o.onload=()=>t(o),o.onerror=()=>a(Error(`HeatHaze: could not load ${e}`)),o.src=e}),g={intensity:.006,speed:3,angle:180,scale:25,split:.07,smokeOpacity:.55,smokeScale:2,smokeSpeed:.9,smokeColor:"#8a8d93",showMask:!1,paused:!1},v=Math.PI/180,b=({image:e,mask:n,smokeMask:s,alt:b="",children:x,intensity:w=g.intensity,speed:y=g.speed,angle:k=g.angle,scale:S=g.scale,split:T=g.split,smokeOpacity:E=g.smokeOpacity,smokeScale:R=g.smokeScale,smokeSpeed:U=g.smokeSpeed,smokeColor:I=g.smokeColor,showMask:_=g.showMask,paused:z=g.paused})=>{let C=(0,o.useRef)(null),$=(0,o.useRef)(null),A=(0,o.useRef)({...g}),[B,L]=(0,o.useState)(!1);return(0,o.useEffect)(()=>{A.current={intensity:w,speed:y,angle:k,scale:S,split:T,smokeOpacity:E,smokeScale:R,smokeSpeed:U,smokeColor:I,showMask:_,paused:z}},[w,y,k,S,T,E,R,U,I,_,z]),(0,o.useEffect)(()=>{let t=C.current,o=$.current;if(!t||!o)return;let l=document.createElement("canvas");o.appendChild(l);let c=l.getContext("webgl",{alpha:!1,antialias:!1,powerPreference:"high-performance"});if(!c)return void l.remove();let f=!1,d=!0,g=0,b=window.matchMedia("(prefers-reduced-motion: reduce)").matches,x=((e,t,a)=>{let o=e.createProgram();if(!o)throw Error("HeatHaze: could not create program");if(e.attachShader(o,m(e,e.VERTEX_SHADER,t)),e.attachShader(o,m(e,e.FRAGMENT_SHADER,a)),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS)){let t=e.getProgramInfoLog(o)??"unknown error";throw e.deleteProgram(o),Error(`HeatHaze: program failed to link — ${t}`)}return o})(c,r,i);c.useProgram(x);let w=c.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,w),c.bufferData(c.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),c.STATIC_DRAW);let y=c.getAttribLocation(x,"aPosition");c.enableVertexAttribArray(y),c.vertexAttribPointer(y,2,c.FLOAT,!1,0,0);let k=c.getUniformLocation(x,"uResolution"),S=c.getUniformLocation(x,"uImageSize"),T=c.getUniformLocation(x,"uTime"),E=c.getUniformLocation(x,"uFlow"),R=c.getUniformLocation(x,"uIntensity"),U=c.getUniformLocation(x,"uScale"),I=c.getUniformLocation(x,"uSplit"),_=c.getUniformLocation(x,"uShowMask"),z=c.getUniformLocation(x,"uSmokeOpacity"),B=c.getUniformLocation(x,"uSmokeScale"),D=c.getUniformLocation(x,"uSmokeSpeed"),P=c.getUniformLocation(x,"uSmokeColor"),F=c.getUniformLocation(x,"uImage"),M=c.getUniformLocation(x,"uMask"),H=c.getUniformLocation(x,"uText"),O=c.getUniformLocation(x,"uHasText"),j=Array.from(t.querySelectorAll("[data-haze-text]")),G=j.length>0,N=null,q=()=>{var e,a;let o=t.getBoundingClientRect(),r=Math.min(window.devicePixelRatio||1,2);l.width=Math.round(o.width*r),l.height=Math.round(o.height*r),c.viewport(0,0,l.width,l.height),c.uniform2f(k,l.width,l.height),N&&(c.activeTexture(c.TEXTURE2),e=N,a=((e,t,a,o,r)=>{let i=document.createElement("canvas");i.width=a,i.height=o;let n=i.getContext("2d");if(!n)throw Error("HeatHaze: could not get a 2D context to render the text");for(let a of(n.scale(r,r),e)){let e=getComputedStyle(a),o=a.getBoundingClientRect(),r=u(a.textContent??"",e.textTransform);if(!r)continue;n.font=`${e.fontStyle} ${e.fontWeight} ${e.fontSize} ${e.fontFamily}`,n.letterSpacing="normal"===e.letterSpacing?"0px":e.letterSpacing,n.fillStyle=e.color,n.textBaseline="alphabetic";let i=n.measureText(r),s=Number.parseFloat(e.fontSize),l=i.fontBoundingBoxAscent??.8*s,c=i.fontBoundingBoxDescent??.2*s,f=o.left-t.left,d=o.top-t.top+(o.height-(l+c))/2+l;n.fillText(r,f,d)}return i})(j,o,l.width,l.height,r),c.bindTexture(c.TEXTURE_2D,e),c.pixelStorei(c.UNPACK_FLIP_Y_WEBGL,!0),c.texImage2D(c.TEXTURE_2D,0,c.RGBA,c.RGBA,c.UNSIGNED_BYTE,a))},X=(e,t)=>{let a;if(!d)return;let o=A.current;o.paused||(g+=t/1e3*o.speed),c.uniform1f(T,g);let r=o.angle*v;c.uniform2f(E,Math.cos(r),Math.sin(r)),c.uniform1f(R,b?0:o.intensity),c.uniform1f(U,o.scale),c.uniform1f(I,o.split),c.uniform1f(_,+!!o.showMask),c.uniform1f(z,o.smokeOpacity),c.uniform1f(B,o.smokeScale),c.uniform1f(D,o.smokeSpeed),c.uniform3fv(P,[((a=Number.parseInt(o.smokeColor.replace("#",""),16))>>16&255)/255,(a>>8&255)/255,(255&a)/255]),c.drawArrays(c.TRIANGLES,0,3)},W=new ResizeObserver(q),Y=new IntersectionObserver(([e])=>{d=e?.isIntersecting??!0});return(async()=>{let o=s?[n,s]:[n],[r,...i]=await Promise.all([h(e),...o.map(h)]);if(f)return;let{naturalWidth:l,naturalHeight:d}=r;if(c.uniform2f(S,l,d),c.activeTexture(c.TEXTURE0),p(c,r),c.uniform1i(F,0),c.activeTexture(c.TEXTURE1),p(c,((e,t)=>{let a=document.createElement("canvas");a.width=1024,a.height=t;let o=a.getContext("2d");if(!o)throw Error("HeatHaze: could not get a 2D context to rasterise the maps");for(let a of(o.fillStyle="#000",o.fillRect(0,0,1024,t),o.globalCompositeOperation="lighter",e))o.drawImage(a,0,0,1024,t);return a})(i,Math.round(1024*d/l))),c.uniform1i(M,1),G){if(await document.fonts.ready,f)return;c.activeTexture(c.TEXTURE2),N=p(c,document.createElement("canvas")),c.uniform1i(H,2)}c.uniform1f(O,+!!G),q(),W.observe(t),Y.observe(t),a.gsap.ticker.add(X),L(!0)})().catch(e=>{console.error(e)}),()=>{f=!0,a.gsap.ticker.remove(X),W.disconnect(),Y.disconnect(),c.getExtension("WEBGL_lose_context")?.loseContext(),l.remove()}},[e,n,s]),(0,t.jsxs)(l,{ref:C,children:[(0,t.jsx)(c,{src:e,alt:b,draggable:!1}),(0,t.jsx)(f,{ref:$,$isReady:B,"aria-hidden":!0}),x?(0,t.jsx)(d,{children:x}):null]})};b.displayName="HeatHaze",e.s(["default",0,b],394735)},413732,e=>{"use strict";var t=e.i(843476),a=e.i(500932),o=e.i(124821),r=e.i(394735),i=e.i(575509),n=e.i(212960),s=e.i(997053);let l="calc(8.333vw + 16px)",c=(0,s.default)(i.Div).attrs({as:"section"}).withConfig({componentId:"sc-4ff1c1a-0"})(()=>s.css`
		position: relative;
		overflow: clip;

		width: 100%;
		height: 100dvh;
		background: ${(0,i.getGlobal)("black")};
	`),f=(0,s.default)(i.Div).withConfig({componentId:"sc-4ff1c1a-1"})(()=>s.css`
		position: absolute;
		bottom: ${l};
		left: ${l};
		z-index: 1;

		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 3.2rem;
	`),d=(0,s.default)(i.Div).attrs({as:"h1"}).withConfig({componentId:"sc-4ff1c1a-2"})(()=>s.css`
		${n.headlineL}
		line-height: 1.2;
		text-transform: capitalize;
		color: ${(0,i.getGlobal)("white")};

		span {
			display: block;

			/* NOTE • One line per span on desktop — the shader paints each span as a
			   single line. Phones aren't in the shader, so they may wrap. */
			${i.bp.l` white-space: nowrap; `}
		}
	`),u={image:"/images/heat-haze/exhaust.jpg",mask:"/images/heat-haze/mask.svg",smokeMask:"/images/heat-haze/smoke.svg",alt:"Quad exhaust tips of a red sports car, heat shimmering from the pipes"},m=()=>{let e,i,n=(0,a.c)(2);return n[0]===Symbol.for("react.memo_cache_sentinel")?(e=(0,t.jsx)(o.default,{label:"Back home",aria:"Back to the homepage",to:"/"}),n[0]=e):e=n[0],n[1]===Symbol.for("react.memo_cache_sentinel")?(i=(0,t.jsx)(c,{children:(0,t.jsx)(r.default,{...u,children:(0,t.jsxs)(f,{children:[e,(0,t.jsxs)(d,{children:[(0,t.jsx)("span",{"data-haze-text":!0,children:"This page"}),(0,t.jsx)("span",{"data-haze-text":!0,children:"can’t be found"})]})]})})}),n[1]=i):i=n[1],i};m.displayName="NotFound",e.s(["default",0,m],413732)}]);