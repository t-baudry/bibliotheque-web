(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,473210,e=>{"use strict";var t=e.i(500932),r=e.i(478430),n=e.i(271645);let i=()=>{let e,i,o=(0,t.c)(4),{setLoaderEnabled:a,setLoaderMounted:l}=(0,n.use)(r.LoaderContext);return o[0]!==a||o[1]!==l?(e=()=>{a(!1),l(!1)},i=[a,l],o[0]=a,o[1]=l,o[2]=e,o[3]=i):(e=o[2],i=o[3]),(0,n.useEffect)(e,i),null};i.displayName="LoaderBypass",e.s(["default",0,i])},17344,e=>{"use strict";var t=e.i(843476),r=e.i(500932),n=e.i(365747),i=e.i(989970),o=e.i(883495),a=e.i(875324);i.default.registerPlugin(o.ScrollTrigger,a.SplitText,n.useGSAP);var l=e.i(646340),s=e.i(228073);let c=!1;var d=e.i(338139),u=e.i(271645),m=e.i(997053);let f=e=>{let n,i,o,a=(0,r.c)(7),{children:c,desktopVideoSrc:f,mobileVideoSrc:h,loaderEnabled:g}=e;return a[0]===Symbol.for("react.memo_cache_sentinel")?(n=[],a[0]=n):n=a[0],(0,u.useEffect)(p,n),a[1]===Symbol.for("react.memo_cache_sentinel")?(i=(0,t.jsx)(s.GlobalStyle,{}),a[1]=i):i=a[1],a[2]!==c||a[3]!==f||a[4]!==g||a[5]!==h?(o=(0,t.jsx)(d.default,{children:(0,t.jsxs)(m.ThemeProvider,{theme:s.theme,children:[i,(0,t.jsx)(l.default,{desktopVideoSrc:f,mobileVideoSrc:h,loaderEnabled:g,children:c})]},"themeprovider")}),a[2]=c,a[3]=f,a[4]=g,a[5]=h,a[6]=o):o=a[6],o};function p(){c||(c=!0)}f.displayName="Providers",e.s(["default",0,f],17344)},95187,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={callServer:function(){return o.callServer},createServerReference:function(){return l.createServerReference},findSourceMapURL:function(){return a.findSourceMapURL}};for(var i in n)Object.defineProperty(r,i,{enumerable:!0,get:n[i]});let o=e.r(132120),a=e.r(92245),l=e.r(235326)},365183,e=>{"use strict";var t=e.i(843476),r=e.i(500932),n=e.i(522016),i=e.i(271645);let o=()=>{let e,o,a,l=(0,r.c)(3),[s,c]=(0,i.useState)(!1);return(l[0]===Symbol.for("react.memo_cache_sentinel")?(e=()=>{c(window===window.parent&&!window.opener)},o=[],l[0]=e,l[1]=o):(e=l[0],o=l[1]),(0,i.useEffect)(e,o),s)?(l[2]===Symbol.for("react.memo_cache_sentinel")?(a=(0,t.jsx)(n.default,{href:"/api/draft-mode/disable/",prefetch:!1,"aria-label":"Exit draft preview mode",style:{position:"fixed",bottom:"1rem",right:"1rem",zIndex:9999,padding:"0.75rem 1rem",background:"#111",color:"#fff",borderRadius:"0.5rem",fontSize:"0.875rem",textDecoration:"none"},children:"Exit draft preview"}),l[2]=a):a=l[2],a):null};o.displayName="DisableDraftMode";var a=e.i(618566);let l=(0,e.i(770703).default)(()=>e.A(896535),{ssr:!1});var s=e.i(95187);let c=(0,s.createServerReference)("40c25491dbc1d3a8d0280d9fb8b596d7a6fba83c5e",s.callServer,void 0,s.findSourceMapURL,"perspectiveChangeAction"),d=(0,s.createServerReference)("4022553e5c227c51528cdf8494af708dc547df2a64",s.callServer,void 0,s.findSourceMapURL,"variantChangeAction");function u(e){let r,n;if("string"!=typeof e.basePath)try{r=""}catch(e){console.error("Failed detecting basePath",e)}if("boolean"!=typeof e.trailingSlash)try{n=!0,console.log(`Detected next trailingSlash as ${JSON.stringify(n)} by reading "process.env.__NEXT_TRAILING_SLASH". If this is incorrect then you can set it manually with the trailingSlash prop on the <VisualEditing /> component.`)}catch(e){console.error("Failed detecting trailingSlash",e)}return(0,t.jsx)(l,{onPerspectiveChange:c,onVariantChange:d,...e,basePath:e.basePath??r,trailingSlash:e.trailingSlash??n})}let m=()=>{let e,n,i,l,s=(0,r.c)(7),c=(0,a.useRouter)();s[0]!==c?(e=e=>(c.refresh(),new Promise(f)),s[0]=c,s[1]=e):e=s[1];let d=e;return s[2]!==d?(n=(0,t.jsx)(u,{trailingSlash:!0,refresh:d}),s[2]=d,s[3]=n):n=s[3],s[4]===Symbol.for("react.memo_cache_sentinel")?(i=(0,t.jsx)(o,{}),s[4]=i):i=s[4],s[5]!==n?(l=(0,t.jsxs)(t.Fragment,{children:[n,i]}),s[5]=n,s[6]=l):l=s[6],l};function f(e){setTimeout(e,1e3)}m.displayName="DraftPreview",e.s(["default",0,m],365183)},366599,e=>{"use strict";e.i(247167);var t=e.i(500932),r=e.i(384024),n=e.i(271645);let i="GTM-KPDWHVM8",o="https://www.googletagmanager.com/gtm.js",a=()=>{let e,a,l=(0,t.c)(3),s=(0,r.useConsent)();return l[0]!==s?(e=()=>{"granted"===s&&i&&(e=>{if(document.querySelector(`script[src^="${o}"]`))return;!function(){window.dataLayer=window.dataLayer??[],window.dataLayer.push(arguments)}("consent","default",{analytics_storage:"granted",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"}),window.dataLayer?.push({"gtm.start":Date.now(),event:"gtm.js"});let t=document.createElement("script");t.async=!0,t.src=`${o}?id=${encodeURIComponent(e)}`,document.head.appendChild(t)})(i)},a=[s],l[0]=s,l[1]=e,l[2]=a):(e=l[1],a=l[2]),(0,n.useEffect)(e,a),null};a.displayName="Analytics",e.s(["default",0,a])},824171,e=>{"use strict";var t=e.i(843476),r=e.i(500932),n=e.i(271645),i=e.i(228073),o=e.i(494473),a=e.i(575509),l=e.i(997053);let s=(0,l.default)(a.Div).withConfig({componentId:"sc-f9bddc50-0"})(e=>l.css`
		height: 100%;
		display: none;

		${e.$isMobile&&l.css`
			display: block;
		`}

		${a.bp.m`
            ${e.$isTablet&&l.css`
					display: block;
				`}
        `}

        ${a.bp.l`
            display: block;
        `}

        span {
			--max: 100%;
			display: block;

			border-inline-style: dashed;
			border-inline-width: ${+!!e.$altColor}px;
			border-inline-color: ${(0,a.getFeedback)("negative")};

			width: var(--max);
			height: var(--max);
			transition: all 0.25s linear;

			&:after {
				content: '';
				opacity: ${!e.$altColor?.5:.2};
				display: block;
				width: var(--max);
				height: var(--max);
				transition: all 0.25s linear;
				background-color: ${!e.$altColor?(0,a.getFeedback)("negative"):"transparent"};
			}
		}
	`),c=(0,l.default)(a.Div).attrs({as:"aside"}).withConfig({componentId:"sc-f9bddc50-1"})(e=>l.css`
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		width: 100%;
		height: ${e.$showGrid?"100%":"0%"};
		pointer-events: none;
		transition: all 1s ${(0,a.getEase)("bezzy")};

		waffl-grid {
			height: 100%;
		}
	`),d=i.theme.grid.columns.l,u=i.theme.grid.columns.s,m=i.theme.grid.columns.m;function f(e){return!e}function p(e){return!e}e.s(["default",0,()=>{let e,i,a,l,h,g,w,b=(0,r.c)(12),[y,v]=(0,n.useState)(!1),[x,S]=(0,n.useState)(!0);b[0]===Symbol.for("react.memo_cache_sentinel")?(e=()=>{v(f)},b[0]=e):e=b[0];let $=e;b[1]===Symbol.for("react.memo_cache_sentinel")?(i=()=>{S(p)},b[1]=i):i=b[1];let E=i;b[2]===Symbol.for("react.memo_cache_sentinel")?(a=()=>{let e=e=>{e.ctrlKey&&("g"===e.key?(e.preventDefault(),$()):"f"===e.key&&(e.preventDefault(),E()))};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)},l=[$,E],b[2]=a,b[3]=l):(a=b[2],l=b[3]),(0,n.useEffect)(a,l),b[4]!==x?(h=Array.from({length:d},(e,r)=>(0,t.jsx)(s,{$isMobile:r<u,$isTablet:r<m,$altColor:x,style:{gridColumn:r+1},children:(0,t.jsx)("span",{})},`col-${r}`)),b[4]=x,b[5]=h):h=b[5];let C=h;return b[6]!==C?(g=(0,t.jsx)(o.Grid,{children:C}),b[6]=C,b[7]=g):g=b[7],b[8]!==y||b[9]!==g||b[10]!==x?(w=(0,t.jsx)(c,{$showGrid:y,$altColor:x,children:g}),b[8]=y,b[9]=g,b[10]=x,b[11]=w):w=b[11],w}],824171)},605949,e=>{"use strict";var t=e.i(843476),r=e.i(500932),n=e.i(383520),i=e.i(478430),o=e.i(101384),a=e.i(189897),l=e.i(607561),s=e.i(271645),c=e.i(440873),d=e.i(505271),u=e.i(944833);function m(){return Promise.all([(0,c.waitForFonts)(),(0,d.waitForImages)()])}var f=e.i(494473),p=e.i(989970),h=e.i(618566),g=e.i(486861),w=e.i(797489),b=e.i(274879),y=e.i(875324);let v=e=>/[.!?]$/.test(e)?.42:.25*!!/[,;:]$/.test(e);var x=e.i(575509),S=e.i(212960),$=e.i(997053);let E=[...Array(14)].map((e,t)=>`&:nth-child(${t+1}) { transition-delay: ${.03*t}s; }`).join("\n"),C=(0,$.default)(x.Div).attrs({as:"div"}).withConfig({componentId:"sc-60e682e4-0"})(()=>$.css`
        position: fixed;
        inset: 0;
        z-index: 999;

        display: grid;
        place-items: center;
        
        background: ${(0,x.getGlobal)("black")};
    `),j=(0,$.default)(x.Div).attrs({as:"p"}).withConfig({componentId:"sc-60e682e4-1"})(({theme:e})=>$.css`
        ${S.captionL}

        max-width: 45.5rem;
        margin: 0 auto;

        text-align: center;
        text-wrap: balance;
        color: ${e.colors.global.white};
        visibility: hidden;
        opacity: 0;

        > div {
            display: inline-block;
            vertical-align: baseline;
        }
    `),L=$.default.div.withConfig({componentId:"sc-60e682e4-2"})(()=>$.css`
		position: fixed;
        inset: auto auto ${(0,x.getGap)("l")} 50%;
		transform: translateX(-50%);

        display: flex;
        flex-direction: column;
        align-items: center;

        ${x.bp.l`
            inset: auto auto ${(0,x.getGap)("xl")} 50%;
        `}
	`),_=$.default.div.withConfig({componentId:"sc-60e682e4-3"})(()=>$.css`
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: ${(0,x.getGap)("s")};
	`),k=$.default.div.withConfig({componentId:"sc-60e682e4-4"})(()=>$.css`
		width: 16rem;
		height: 2px;
        border-radius: 1px;
		overflow: hidden;
		background: ${(0,x.getGlobal)("white",10)};
	`),A=$.default.div.withConfig({componentId:"sc-60e682e4-5"})(()=>$.css`
		width: 100%;
		height: 100%;
		background: ${(0,x.getBrand)("bc5")};
		transform: scaleX(0);
		transform-origin: left center;
	`),T=$.default.div.withConfig({componentId:"sc-60e682e4-6"})(()=>$.css`
		display: flex;
		align-items: center;
		justify-content: center;
		gap: ${(0,x.getGap)("s")};
	`),R=$.default.span.withConfig({componentId:"sc-60e682e4-7"})(()=>$.css`
		${S.captionS}
        max-width: 19.9rem;
		text-align: center;
		text-wrap: balance;
		color: ${(0,x.getGlobal)("white",55)};

		/* Two lines on desktop rather than three. */
		${x.bp.l`
			max-width: 40rem;
		`}

		a {
			color: inherit;
			transition: color ${(0,x.getTime)("s")} ${(0,x.getEase)("ease")};

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					color: ${(0,x.getGlobal)("white")};
				}
			}

			&:focus-visible {
				color: ${(0,x.getGlobal)("white")};
			}
		}
	`),P=$.default.button.withConfig({componentId:"sc-60e682e4-8"})(()=>$.css`
        ${S.titleS}

        padding: ${(0,x.getGap)("sm")};
        color: ${(0,x.getGlobal)("white")};
        text-transform: uppercase;
        white-space: nowrap;

        > span {
            position: relative;
            display: inline-block;
            overflow: clip;

            &:after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 1px;
                background: ${(0,x.getGlobal)("white")}	;
                transform: scaleX(1);
                transform-origin: left center;
                transition: transform 0.3s ease-in-out;
            }
        }

        @media (hover: hover) and (pointer: fine) {
            &:hover {
                cursor: pointer;

                > span:after {
                    transform: scaleX(0);
                    transform-origin: right center;
                }

                > span > span {
                    transform: translateY(2em);
                }
            }
        }

        > span > span {
            display: inline-block;
            position: relative;
            text-shadow: ${(0,x.getGlobal)("white",60)} 0px -2em 0px;

            transition: transform 0.75s ${(0,x.getEase)("bezzy2")};

            ${E}
        }
	`),I=e=>{let n,i,c,d,u,m,f,h=(0,r.c)(19),{text:v,onComplete:x}=e,{isReducedMotion:S}=(0,s.use)(o.PerformanceContext),$=(0,s.useRef)(null);h[0]!==v?(n=(0,a.cleanSanityString)(v),h[0]=v,h[1]=n):n=h[1];let E=n,C=(0,b.useSplitTextRecovery)($,E);h[2]!==E?(i=(0,g.escapeHtml)(E),h[2]=E,h[3]=i):i=h[3];let L=(0,w.useInnerHtml)(i);return h[4]!==S||h[5]!==x?(c=()=>{if(!$.current)return;if(S){p.default.set($.current,{autoAlpha:1}),x?.();return}let e=y.SplitText.create($.current,{type:"words",aria:"none"}),{words:t}=e;if(!t.length)return p.default.set($.current,{autoAlpha:1}),x?.(),()=>e.revert();p.default.set(t,{autoAlpha:0,y:12,filter:"blur(0.8rem)"}),p.default.set($.current,{autoAlpha:1});let r=p.default.timeline({delay:.4,onComplete:()=>{p.default.set(t,{autoAlpha:1,y:0,filter:"none",clearProps:"transform,translate,rotate,scale,willChange"}),x?.()}}),n=0;return t.forEach((e,i)=>{let o;r.to(e,{autoAlpha:1,y:0,filter:"blur(0rem)",duration:.65,ease:"power3.out"},n),n+=.11,i<t.length-1&&(n+=(o=e.textContent?.trim()??"",/[.!?]$/.test(o)?.42:.25*!!/[,;:]$/.test(o)))}),()=>e.revert()},h[4]=S,h[5]=x,h[6]=c):c=h[6],h[7]!==E||h[8]!==S||h[9]!==C?(d={scope:$,dependencies:[E,S,C]},h[7]=E,h[8]=S,h[9]=C,h[10]=d):d=h[10],(0,l.useAnimation)(c,d),h[11]!==E?(u=(0,t.jsx)("span",{className:"sr-only",children:E}),h[11]=E,h[12]=u):u=h[12],h[13]!==E||h[14]!==L?(m=(0,t.jsx)(j,{ref:$,"aria-hidden":!0,"data-cinematic-words":!0,dangerouslySetInnerHTML:L},E),h[13]=E,h[14]=L,h[15]=m):m=h[15],h[16]!==u||h[17]!==m?(f=(0,t.jsxs)(t.Fragment,{children:[u,m]}),h[16]=u,h[17]=m,h[18]=f):f=h[18],f};I.displayName="CinematicText";var N=e.i(384024);let M=e=>{let n,o,a,l,c,d,u=(0,r.c)(14),{label:m,ariaLabel:f,onEnter:p,isFocusTarget:h}=e,g=void 0===m?"Enter":m,w=void 0===f?"Enter Website":f,b=void 0===h||h,{setLoaderEnabled:y}=(0,s.use)(i.LoaderContext),v=(0,s.useRef)(null);u[0]!==p||u[1]!==y?(n=()=>{p?.(),y(!1)},u[0]=p,u[1]=y,u[2]=n):n=u[2];let x=n;return(u[3]!==b?(o=()=>{let e=v.current;if(!e||!b)return;let t=document.activeElement;t instanceof HTMLElement&&t!==document.body&&t.matches(":focus-visible")&&e.focus();let r=t=>{"Tab"!==t.key||t.shiftKey||document.activeElement&&document.activeElement!==document.body||(t.preventDefault(),e.focus())};return document.addEventListener("keydown",r),()=>document.removeEventListener("keydown",r)},a=[b],u[3]=b,u[4]=o,u[5]=a):(o=u[4],a=u[5]),(0,s.useEffect)(o,a),u[6]!==g)?(l=Array.from(g).map((e,r)=>(0,t.jsx)("span",{children:" "===e?" ":e},`${e}-${r.toString()}`)),u[6]=g,u[7]=l):l=u[7],u[8]!==l?(c=(0,t.jsx)("span",{children:l}),u[8]=l,u[9]=c):c=u[9],u[10]!==w||u[11]!==x||u[12]!==c?(d=(0,t.jsx)(P,{ref:v,type:"button","aria-label":w,onClick:x,children:c}),u[10]=w,u[11]=x,u[12]=c,u[13]=d):d=u[13],d};M.displayName="EnterButton";let G=(0,e.i(22584).legalHref)("cookies"),F=()=>(0,N.setConsent)("granted"),z=()=>(0,N.setConsent)("denied"),O=()=>{let e,n,i,a,c=(0,r.c)(6),{isReducedMotion:d}=(0,s.use)(o.PerformanceContext),u=(0,N.useConsent)(),[m]=(0,s.useState)("unknown"===u),f=(0,s.useRef)(null);if(c[0]!==d?(e=()=>{if(!f.current)return;let e=Array.from(f.current.children);if(e.length){if(d)return void p.default.set(e,{autoAlpha:1,y:0});p.default.set(e,{autoAlpha:0,y:24,willChange:"opacity, transform"}),p.default.to(e,{autoAlpha:1,y:0,duration:.75,stagger:.12,ease:"power2.out",onComplete:()=>{p.default.set(e,{willChange:"auto"})}})}},c[0]=d,c[1]=e):e=c[1],c[2]===Symbol.for("react.memo_cache_sentinel")?(n={scope:f},c[2]=n):n=c[2],(0,l.useAnimation)(e,n),!m){let e;return c[3]===Symbol.for("react.memo_cache_sentinel")?(e=(0,t.jsx)(_,{ref:f,children:(0,t.jsx)(M,{})}),c[3]=e):e=c[3],e}return c[4]===Symbol.for("react.memo_cache_sentinel")?(i=(0,t.jsxs)(T,{children:[(0,t.jsx)(M,{label:"Accept & Enter",ariaLabel:"Accept analytics cookies and enter website",onEnter:F}),(0,t.jsx)(M,{label:"Reject & Enter",ariaLabel:"Reject analytics cookies and enter website",onEnter:z,isFocusTarget:!1})]}),c[4]=i):i=c[4],c[5]===Symbol.for("react.memo_cache_sentinel")?(a=(0,t.jsxs)(_,{ref:f,children:[i,(0,t.jsxs)(R,{children:["We use ",(0,t.jsx)("a",{href:G,target:"_blank",rel:"noopener",children:"analytics cookies"})," to improve the site. Either choice enters — change it any time from the menu."]})]}),c[5]=a):a=c[5],a};O.displayName="LoaderBottom";let D=e=>{let n,i,a,c,d,u,m=(0,r.c)(16),{duration:f,canComplete:h,onComplete:g}=e,w=void 0!==h&&h,{isReducedMotion:b}=(0,s.use)(o.PerformanceContext),y=(0,s.useRef)(null),v=(0,s.useRef)(!1),[x,S]=(0,s.useState)(!1);m[0]!==g?(n=()=>{if(!y.current||v.current)return;let e=y.current.firstElementChild;e&&p.default.to(e,{scaleX:1,duration:0,ease:"power2.out",overwrite:!0,onComplete:()=>{v.current||(v.current=!0,g?.())}})},m[0]=g,m[1]=n):n=m[1];let $=n;return m[2]!==f||m[3]!==b?(i=()=>{if(!y.current)return;let e=y.current.firstElementChild;if(e){if(b){p.default.set(e,{scaleX:1}),S(!0);return}v.current=!1,S(!1),p.default.set(e,{scaleX:0,transformOrigin:"left center"}),p.default.to(e,{scaleX:.92,duration:f,ease:"none",onComplete:()=>S(!0)})}},m[2]=f,m[3]=b,m[4]=i):i=m[4],m[5]!==f||m[6]!==b?(a={scope:y,dependencies:[f,b]},m[5]=f,m[6]=b,m[7]=a):a=m[7],(0,l.useAnimation)(i,a),m[8]!==w||m[9]!==x||m[10]!==b||m[11]!==g||m[12]!==$?(c=()=>{if(w&&x&&!v.current){if(b){v.current=!0,g?.();return}$()}},d=[w,x,b,g,$],m[8]=w,m[9]=x,m[10]=b,m[11]=g,m[12]=$,m[13]=c,m[14]=d):(c=m[13],d=m[14]),(0,s.useEffect)(c,d),m[15]===Symbol.for("react.memo_cache_sentinel")?(u=(0,t.jsx)(k,{ref:y,"aria-hidden":"true",children:(0,t.jsx)(A,{})}),m[15]=u):u=m[15],u};D.displayName="LoaderProgress";let H=e=>{let c,d,g,w,b,y,x,S,$,E,j=(0,r.c)(27),{text:_}=e,k=void 0===_?"built on distinction, desire, and identity. not simply to modify vehicles, but to reimagine them as objects of distinction, desire and cultural value.":_,{loaderEnabled:A,setLoaderMounted:T}=(0,s.use)(i.LoaderContext),{heroVideoLoadState:R,isIntroFrameReady:P,hasIntroVideo:N}=(0,s.use)(n.HeroVideoContext),{isReducedMotion:M}=(0,s.use)(o.PerformanceContext),G="/"===(0,h.usePathname)(),F=(0,s.useRef)(null),z=(0,s.useRef)(null),[H,B]=(0,s.useState)(!1),[W,U]=(0,s.useState)(!1),[q,X]=(0,s.useState)(!1);j[0]!==k?(c=(0,a.cleanSanityString)(k),j[0]=k,j[1]=c):c=j[1];let V=c;j[2]!==V?(d=(e=>{let t=e.trim().split(/\s+/).filter(Boolean);if(!t.length)return .4;let r=0;for(let e=0;e<t.length;e++){if(e===t.length-1)return .4+r+.65;r+=.11+v(t[e]??"")}return 1.05})(V),j[2]=V,j[3]=d):d=j[3];let K=d;if(j[4]!==R)g="ready"===R||"unsupported"===R||"error"===R,j[4]=R,j[5]=g;else g=j[5];let J=g,Y=(e=>{let t,n,i=(0,r.c)(3),[o,a]=(0,s.useState)(!1);return i[0]!==e?(t=()=>{if(!e)return;let t=!1;return a(!1),(0,u.waitForWindowLoad)().then(m).then(()=>{t||a(!0)}),()=>{t=!0}},n=[e],i[0]=e,i[1]=t,i[2]=n):(t=i[1],n=i[2]),(0,s.useEffect)(t,n),!!e&&o})(!G),Q=(G?J&&(!N||P):Y)&&H;j[6]===Symbol.for("react.memo_cache_sentinel")?(w=()=>B(!0),j[6]=w):w=j[6];let Z=w;j[7]===Symbol.for("react.memo_cache_sentinel")?(b=()=>U(!0),j[7]=b):b=j[7];let ee=b;return(j[8]!==M||j[9]!==q||j[10]!==A||j[11]!==T?(y=()=>{if(A||q||!F.current)return;if(M){X(!0),T(!1);return}let e=F.current,t=Array.from(e.querySelectorAll("[data-cinematic-words] > *")),r=z.current,n=p.default.timeline({onComplete:()=>{X(!0)}});t.length&&n.set(t,{filter:"blur(0rem)"},0).to(t,{autoAlpha:0,y:-12,filter:"blur(0.8rem)",duration:.6,stagger:.03,ease:"power2.in"},0),r&&n.to(r,{autoAlpha:0,y:16,duration:.5,ease:"power2.in"},0),n.to(e,{autoAlpha:0,duration:.8,ease:"power2.inOut",onStart:()=>T(!1)},n.duration()+.15)},j[8]=M,j[9]=q,j[10]=A,j[11]=T,j[12]=y):y=j[12],j[13]!==M||j[14]!==q||j[15]!==A||j[16]!==T?(x={scope:F,dependencies:[A,q,M,T]},j[13]=M,j[14]=q,j[15]=A,j[16]=T,j[17]=x):x=j[17],(0,l.useAnimation)(y,x),q)?null:(j[18]!==V?(S=(0,t.jsx)(f.default,{children:(0,t.jsx)(I,{text:V,onComplete:Z})}),j[18]=V,j[19]=S):S=j[19],j[20]!==Q||j[21]!==W||j[22]!==K?($=(0,t.jsx)(L,{ref:z,children:W?(0,t.jsx)(O,{}):(0,t.jsx)(D,{duration:K,canComplete:Q,onComplete:ee})}),j[20]=Q,j[21]=W,j[22]=K,j[23]=$):$=j[23],j[24]!==$||j[25]!==S?(E=(0,t.jsxs)(C,{ref:F,role:"dialog","aria-modal":"true","aria-label":"Welcome to Forge Automotive",children:[S,$]}),j[24]=$,j[25]=S,j[26]=E):E=j[26],E)};H.displayName="Loader",e.s(["default",0,H],605949)},882326,e=>{"use strict";var t=e.i(843476),r=e.i(500932),n=e.i(831119),i=e.i(770703),o=e.i(271645),a=e.i(845262);let l=(0,i.default)(()=>(0,a.prefetchMenu)(),{ssr:!1}),s=e=>{let i,a,s,c,d,u=(0,r.c)(8),{socials:m,heroImages:f}=e,{menuOpen:p}=(0,o.use)(n.MenuContext),[h,g]=(0,o.useState)(!1);return(u[0]!==p?(i=()=>{p&&g(!0)},a=[p],u[0]=p,u[1]=i,u[2]=a):(i=u[1],a=u[2]),(0,o.useEffect)(i,a),u[3]===Symbol.for("react.memo_cache_sentinel")?(s=()=>{if("function"!=typeof window.requestIdleCallback){let e=window.setTimeout(()=>g(!0),2500);return()=>window.clearTimeout(e)}let e=window.requestIdleCallback(()=>g(!0),{timeout:4e3});return()=>window.cancelIdleCallback(e)},c=[],u[3]=s,u[4]=c):(s=u[3],c=u[4]),(0,o.useEffect)(s,c),h)?(u[5]!==f||u[6]!==m?(d=(0,t.jsx)(l,{socials:m,heroImages:f}),u[5]=f,u[6]=m,u[7]=d):d=u[7],d):null};s.displayName="MenuGate",e.s(["default",0,s])},25863,e=>{"use strict";var t=e.i(843476),r=e.i(500932),n=e.i(478430),i=e.i(831119),o=e.i(883495),a=e.i(271645),l=e.i(575509),s=e.i(997053);let c=(0,s.default)(l.Div).attrs({as:"main"}).withConfig({componentId:"sc-d3167531-0"})(({$isMenuOpen:e,$isPrimed:t})=>s.css`
        --speed: 1s;
        --ease: ${(0,l.getEase)("bezzy2")};

        position: relative;
        z-index: 1;
        
        pointer-events: ${e?"none":"all"};
        clip-path: inset(${50*!!e}%);
        scale: ${e?.5:1};
        transition: clip-path var(--speed) var(--ease), scale var(--speed) var(--ease);

        /* NOTE • Promoted BEFORE the first open, not during it. Animating clip-path
           and scale together forces this element onto its own compositor layer, and
           on the very first open that promotion happened as the transition started —
           the frame painted before the new layer had rasterised showed the page
           unclipped, whatever happened to be on screen at that scroll position. One
           frame, first open only, because every later open reuses the layer.

           Keyed to menuReady rather than menuOpen so the promotion lands when the
           lazy menu warm-mounts at idle, with no click waiting on it. */
        will-change: ${t?"clip-path, scale":"auto"};

        /* NOTE • Reduced motion: the menu cuts in and out — no zoom of the page, no
           wipe. The close then settles on PageWrapper's MENU_CLOSE_FALLBACK_MS, since
           no transitionend fires. */
        @media (prefers-reduced-motion: reduce) {
            scale: 1;
            transition: none;
        }
    `),d=e=>{let l,s,d,u,m,f=(0,r.c)(12),{children:p}=e,{menuOpen:h,menuReady:g,setMenuVisible:w}=(0,a.use)(i.MenuContext),{loaderMounted:b}=(0,a.use)(n.LoaderContext),y=h&&g,v=(0,a.useRef)(null),x=(0,a.useRef)(!1);return f[0]!==b||f[1]!==h?(l=()=>{v.current?.toggleAttribute("inert",b||h)},s=[b,h],f[0]=b,f[1]=h,f[2]=l,f[3]=s):(l=f[2],s=f[3]),(0,a.useEffect)(l,s),f[4]!==y||f[5]!==w?(d=()=>{if(y){x.current=!0,w(!0);return}if(!x.current||!v.current)return;let e=v.current,t=!1,r=()=>{t||(t=!0,w(!1),o.default.refresh())},n=t=>{t.target===e&&"scale"===t.propertyName&&r()};e.addEventListener("transitionend",n);let i=window.setTimeout(r,1100);return()=>{e.removeEventListener("transitionend",n),window.clearTimeout(i)}},u=[y,w],f[4]=y,f[5]=w,f[6]=d,f[7]=u):(d=f[6],u=f[7]),(0,a.useEffect)(d,u),f[8]!==p||f[9]!==y||f[10]!==g?(m=(0,t.jsx)(c,{id:"page",ref:v,$isMenuOpen:y,$isPrimed:g,children:p}),f[8]=p,f[9]=y,f[10]=g,f[11]=m):m=f[11],m};d.displayName="PageWrapper",e.s(["default",0,d],25863)},735521,e=>{"use strict";var t=e.i(500932),r=e.i(618566),n=e.i(271645);let i=()=>{let e,i,o=(0,t.c)(3),a=(0,r.usePathname)(),l=(0,n.useRef)(a);return o[0]!==a?(e=()=>{if(l.current===a)return;l.current=a;let e=performance.now(),t=0,r=()=>{let n=Array.from(document.querySelectorAll("#page h1")).find(e=>e.checkVisibility?e.checkVisibility():e.getClientRects().length>0);if(n)return void(!n.hasAttribute("tabindex")&&(n.setAttribute("tabindex","-1"),n.addEventListener("blur",()=>n.removeAttribute("tabindex"),{once:!0})),n.focus({preventScroll:!0}));performance.now()-e<1500&&(t=requestAnimationFrame(r))};return t=requestAnimationFrame(r),()=>cancelAnimationFrame(t)},i=[a],o[0]=a,o[1]=e,o[2]=i):(e=o[1],i=o[2]),(0,n.useEffect)(e,i),null};i.displayName="RouteFocus",e.s(["default",0,i])},412312,e=>{"use strict";var t=e.i(843476),r=e.i(500932),n=e.i(575509),i=e.i(212960),o=e.i(997053);let a=o.default.a.withConfig({componentId:"sc-a18b2d21-0"})(()=>o.css`
		${i.bodyS}

		position: fixed;
		z-index: 1002;
		top: ${(0,n.getGap)("m")};
		left: ${(0,n.getGap)("m")};
		padding: 1.2rem 1.6rem;

		background: var(--brand-bc5);
		color: var(--brand-bc1);
		text-decoration: none;

		transform: translateY(calc(-100% - ${(0,n.getGap)("m")} - 1rem));

		&:focus-visible {
			transform: none;
			outline-color: var(--brand-bc5);
		}
	`),l="page",s=()=>{let e,n=(0,r.c)(1);return n[0]===Symbol.for("react.memo_cache_sentinel")?(e=(0,t.jsx)(a,{href:`#${l}`,onClick:c,children:"Skip to content"}),n[0]=e):e=n[0],e};function c(e){let t=document.getElementById(l);t&&(e.preventDefault(),t.setAttribute("tabindex","-1"),t.addEventListener("blur",()=>t.removeAttribute("tabindex"),{once:!0}),t.focus({preventScroll:!0}))}s.displayName="SkipLink",e.s(["default",0,s],412312)},945047,e=>{"use strict";var t=e.i(843476),r=e.i(500932),n=e.i(134770),i=e.i(383520),o=e.i(478430),a=e.i(101384),l=e.i(764548),s=e.i(573943),c=e.i(255667),d=e.i(618566),u=e.i(271645),m=e.i(174080),f=e.i(575509),p=e.i(997053);let h=(0,p.default)(f.Div).attrs({as:"pre"}).withConfig({componentId:"sc-42c083a9-0"})(()=>p.css`
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 99999999999;
		max-width: 92vw;
		margin: 0;
		padding: 0.8rem 1rem;
		font-family: monospace;
		font-size: 1.1rem;
		line-height: 1.5;
		white-space: pre-wrap;
		color: #00ff66;
		background: rgba(0, 0, 0, 0.85);
		pointer-events: none;
	`),g=()=>{let e,n,a,l,s,f=(0,r.c)(27),{loaderEnabled:p,loaderMounted:g}=(0,u.use)(o.LoaderContext),{heroVideoLoadState:w,isHeroPlaybackComplete:b,activeFrameRef:y}=(0,u.use)(i.HeroVideoContext),v=(0,d.usePathname)(),x=(0,c.useLenis)(),[S,$]=(0,u.useState)(!1),[E,C]=(0,u.useState)("");return(f[0]===Symbol.for("react.memo_cache_sentinel")?(e=()=>{$(new URLSearchParams(window.location.search).has("af-debug"))},n=[],f[0]=e,f[1]=n):(e=f[0],n=f[1]),(0,u.useEffect)(e,n),f[2]!==y||f[3]!==w||f[4]!==b||f[5]!==S||f[6]!==x?.isScrolling||f[7]!==x?.isStopped||f[8]!==x?.rootElement||f[9]!==x?.scroll||f[10]!==x?.targetScroll||f[11]!==x?.velocity||f[12]!==p||f[13]!==g||f[14]!==v?(a=()=>{if(!S)return;let e=[],t=t=>{e.push(String(t.message).slice(0,90))},r=t=>{e.push(`rejection: ${String(t.reason).slice(0,90)}`)};window.addEventListener("error",t),window.addEventListener("unhandledrejection",r);let n={starts:0,moves:0,prevented:"n/a",target:"-",touchAction:"-",fixedAncestor:"-"},i=e=>{n.starts=n.starts+1,(e=>{if(!(e instanceof Element))return;n.target=`${e.tagName.toLowerCase()}${e.className&&"string"==typeof e.className?`.${e.className.split(" ")[0]}`:""}`,n.touchAction=getComputedStyle(e).touchAction;let t=e;n.fixedAncestor="no";for(let e=0;t&&e<15;e++){if("fixed"===getComputedStyle(t).position){n.fixedAncestor=`yes<${t.tagName.toLowerCase()}>`;break}t=t.parentElement}})(e.target)},o=e=>{n.moves=n.moves+1,n.prevented=String(e.defaultPrevented)};window.addEventListener("touchstart",i,{passive:!0}),window.addEventListener("touchmove",o,{passive:!0});let a=window.setInterval(()=>{let t=x?.rootElement,r=y.current,i=r?.decoder;C([`path ${v}`,`loader enabled=${p} mounted=${g}`,`hero video=${w} playbackComplete=${b}`,`lenis stopped=${x?.isStopped??"n/a"} scroll=${Math.round(x?.scroll??-1)}`,t?`wrapper ${Math.round(t.scrollTop)}/${t.scrollHeight} cls=${t.className}`:"wrapper none",i?`decoder ${i.state} queue=${i.decodeQueueSize} frame=${r?.frameProcessed??"-"} enabled=${r?.enabled??"-"}`:"decoder none",`target ${Math.round(x?.targetScroll??-1)} vel ${(x?.velocity??0).toFixed(1)} scrolling=${String(x?.isScrolling??"n/a")}`,`touch s=${n.starts} m=${n.moves} prevented=${n.prevented}`,`on ${n.target} tAction=${n.touchAction} fixed=${n.fixedAncestor}`,`errors ${e.length}${e.length?` | last: ${e[e.length-1]}`:""}`].join("\n"))},300);return()=>{window.removeEventListener("error",t),window.removeEventListener("unhandledrejection",r),window.removeEventListener("touchstart",i),window.removeEventListener("touchmove",o),window.clearInterval(a)}},f[2]=y,f[3]=w,f[4]=b,f[5]=S,f[6]=x?.isScrolling,f[7]=x?.isStopped,f[8]=x?.rootElement,f[9]=x?.scroll,f[10]=x?.targetScroll,f[11]=x?.velocity,f[12]=p,f[13]=g,f[14]=v,f[15]=a):a=f[15],f[16]!==y||f[17]!==w||f[18]!==b||f[19]!==S||f[20]!==x||f[21]!==p||f[22]!==g||f[23]!==v?(l=[y,w,b,S,x,p,g,v],f[16]=y,f[17]=w,f[18]=b,f[19]=S,f[20]=x,f[21]=p,f[22]=g,f[23]=v,f[24]=l):l=f[24],(0,u.useEffect)(a,l),S)?(f[25]!==E?(s=(0,m.createPortal)((0,t.jsx)(h,{"aria-hidden":!0,children:E}),document.body),f[25]=E,f[26]=s):s=f[26],s):null};g.displayName="DebugHud";let w=(0,p.default)(f.Div).withConfig({componentId:"sc-13a61dc4-0"})(()=>p.css`
		position: fixed;
		z-index: 997;
		/* NOTE • The three edges ride one custom property so the bar can be driven
		   flush to the corner with a single tweened number. Unitless and multiplied
		   here, because GSAP interpolates a bare number cleanly where a value
		   carrying its own unit has to be parsed and re-serialised every frame. */
		--progress-inset: 1.6;
		inset: auto calc(var(--progress-inset) * 1rem) calc(var(--progress-inset) * 1rem);
		height: 2px;
		overflow: hidden;
		pointer-events: none;
		background: ${(0,f.getGlobal)("white",10)};
		view-transition-name: scroll-progress;
	`),b=(0,p.default)(f.Div).withConfig({componentId:"sc-13a61dc4-1"})(()=>p.css`
		width: 100%;
		height: 100%;
		background: ${(0,f.getBrand)("bc5")};
		/* Sub-pixel, not zero — see MIN_PROGRESS in index.tsx. */
		transform: scaleX(0.0005);
		transform-origin: left center;
		view-transition-name: scroll-progress-fill;
	`),y=e=>{if((0,l.readScrollLoop)(e)>0)return null;let t=e.scrollHeight-e.clientHeight;if(t<=0)return null;let r=e.querySelector("footer");return{start:Math.max(0,Math.min(r?r.getBoundingClientRect().top-e.getBoundingClientRect().top+e.scrollTop-e.clientHeight:t-e.clientHeight,t)),end:t}},v=()=>{let e,n,i,a,s,m=(0,r.c)(7),{loaderMounted:f}=(0,u.use)(o.LoaderContext),p=(0,u.useRef)(null),h=(0,u.useRef)(null),g=(0,u.useRef)(null),v=(0,d.usePathname)(),x=(0,c.useLenis)();m[0]===Symbol.for("react.memo_cache_sentinel")?(e=(e,t)=>{let r,n;p.current&&(p.current.style.transform=`scaleX(${(n=(r=(0,l.readScrollLoop)(t))>0?r:t.scrollHeight-t.clientHeight)<=0?{progress:5e-4,isAtBottom:!1}:Math.min(1,Math.max(5e-4,(0,l.toLoopPosition)(e,r)/n))})`);let i=h.current,o=g.current;if(!i)return;if(!o||o.end<=o.start)return void i.style.setProperty("--progress-inset",String(1.6));let a=Math.min(1,Math.max(0,(e-o.start)/(o.end-o.start)));i.style.setProperty("--progress-inset",String(1.6*(1-a)))},m[0]=e):e=m[0];let S=e;return(m[1]===Symbol.for("react.memo_cache_sentinel")?(n=e=>{let t=e.rootElement;t&&S(e.scroll,t)},m[1]=n):n=m[1],(0,c.useLenis)(n),m[2]!==x||m[3]!==v?(i=()=>{if(!x||!v)return;let e=x.rootElement;g.current=y(e),S(x.scroll,e);let t=()=>{x.resize(),g.current=y(e),S(x.scroll,e)},r=window.requestAnimationFrame(t),n=window.setTimeout(t,300);return()=>{window.cancelAnimationFrame(r),window.clearTimeout(n)}},a=[x,v,S],m[2]=x,m[3]=v,m[4]=i,m[5]=a):(i=m[4],a=m[5]),(0,u.useEffect)(i,a),f)?null:(m[6]===Symbol.for("react.memo_cache_sentinel")?(s=(0,t.jsx)(w,{ref:h,"aria-hidden":"true",children:(0,t.jsx)(b,{ref:p})}),m[6]=s):s=m[6],s)};v.displayName="ScrollProgress";let x=p.default.div.withConfig({componentId:"sc-7cd9d095-0"})(()=>p.css`
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

		${f.bp.l`
			inset: 1rem 1rem auto auto;
			width: 18rem;
			max-height: calc(100dvh - 2rem);
			border: 1px solid rgb(255 255 255 / 0.18);
			border-radius: 6px;
		`}
	`),S=p.default.div.withConfig({componentId:"sc-7cd9d095-1"})(()=>p.css`
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
	`),$=p.default.div.withConfig({componentId:"sc-7cd9d095-2"})(()=>p.css`
		margin: 0.5rem 0 0;
		opacity: 0.7;
		white-space: pre-wrap;
	`),E=p.default.div.withConfig({componentId:"sc-7cd9d095-3"})(()=>p.css`
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
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

		small {
			font-size: 10px;
			opacity: 0.55;
		}

		em {
			font-style: normal;
			opacity: 0.7;
		}

		input[type='range'] {
			width: 100%;
			accent-color: #fff;
		}

		label[data-kind='toggle'] {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			input {
				accent-color: #fff;
				width: 1.4rem;
				height: 1.4rem;
			}
		}
	`),C="forge:scroll-tuner:2",j=[{key:"lerp",label:"lerp",hint:"wheel / programmatic smoothing",min:.02,max:.3,step:.005},{key:"duration",label:"duration",hint:"programmatic scroll length (s)",min:.3,max:3,step:.05},{key:"wheelMultiplier",label:"wheelMultiplier",hint:"wheel delta scale",min:.5,max:3,step:.05}],L=[{key:"smoothWheel",label:"smoothWheel",hint:"Lenis drives the wheel"}],_=()=>{let e,n,i,o,a,l,s,d,f,p,h,g,w,b,y,v,_,A,T,R=(0,r.c)(39),P=(0,c.useLenis)(),[I,N]=(0,u.useState)(!1),[M,G]=(0,u.useState)(!0),[F,z]=(0,u.useState)(null),[O,D]=(0,u.useState)(null),[H,B]=(0,u.useState)(""),[W,U]=(0,u.useState)(!1);R[0]===Symbol.for("react.memo_cache_sentinel")?(e=()=>{N(new URLSearchParams(window.location.search).has("scroll-debug"))},n=[],R[0]=e,R[1]=n):(e=R[0],n=R[1]),(0,u.useEffect)(e,n),R[2]!==I||R[3]!==P||R[4]!==F?(i=()=>{if(!I||!P||F)return;let e={smoothWheel:!!P.options.smoothWheel,lerp:P.options.lerp,duration:P.options.duration??1.2,wheelMultiplier:P.options.wheelMultiplier};z(e),D({...e,...(()=>{try{let e=window.localStorage.getItem(C);return e?JSON.parse(e):null}catch{return null}})()})},o=[I,P,F],R[2]=I,R[3]=P,R[4]=F,R[5]=i,R[6]=o):(i=R[5],o=R[6]),(0,u.useEffect)(i,o),R[7]!==P||R[8]!==O?(a=()=>{P&&O&&(Object.assign(P.options,O),window.localStorage.setItem(C,JSON.stringify(O)))},l=[P,O],R[7]=P,R[8]=O,R[9]=a,R[10]=l):(a=R[9],l=R[10]),(0,u.useEffect)(a,l),R[11]!==I||R[12]!==P?(s=()=>{if(!I||!P)return;let e=()=>{let e="ontouchstart"in window?"touch":"no-touch";B(`device: ${e} \xb7 ${window.innerWidth}\xd7${window.innerHeight}
scroll: ${Math.round(P.scroll)} / ${Math.round(P.limit)}
velocity: ${P.velocity.toFixed(2)} \xb7 scrolling: ${String(P.isScrolling)}
live options: lerp ${P.options.lerp} \xb7 duration ${P.options.duration??"lerp-driven"} \xb7 wheel\xd7 ${P.options.wheelMultiplier}`)};e();let t=window.setInterval(e,150);return()=>window.clearInterval(t)},d=[I,P],R[11]=I,R[12]=P,R[13]=s,R[14]=d):(s=R[13],d=R[14]),(0,u.useEffect)(s,d),R[15]!==W?(f=()=>{if(!W)return;let e=window.setTimeout(()=>U(!1),1200);return()=>window.clearTimeout(e)},p=[W],R[15]=W,R[16]=f,R[17]=p):(f=R[16],p=R[17]),(0,u.useEffect)(f,p),R[18]===Symbol.for("react.memo_cache_sentinel")?(h=(e,t)=>{D(r=>r?{...r,[e]:t}:r)},R[18]=h):h=R[18];let q=h;R[19]===Symbol.for("react.memo_cache_sentinel")?(g=(e,t)=>{D(r=>r?{...r,[e]:t}:r)},R[19]=g):g=R[19];let X=g;R[20]!==F?(w=()=>{F&&(D(F),window.localStorage.removeItem(C))},R[20]=F,R[21]=w):w=R[21];let V=w;R[22]!==O?(b=()=>{O&&navigator.clipboard?.writeText(JSON.stringify(O,null,2)).then(()=>U(!0),()=>U(!1))},R[22]=O,R[23]=b):b=R[23];let K=b;if(!I||!O)return null;R[24]===Symbol.for("react.memo_cache_sentinel")?(y=(0,t.jsx)("strong",{children:"scroll · lenis"}),R[24]=y):y=R[24],R[25]===Symbol.for("react.memo_cache_sentinel")?(v=()=>G(k),R[25]=v):v=R[25];let J=M?"hide":"show";return R[26]!==J?(_=(0,t.jsxs)(S,{children:[y,(0,t.jsx)("button",{type:"button",onClick:v,children:J})]}),R[26]=J,R[27]=_):_=R[27],R[28]!==W||R[29]!==K||R[30]!==V||R[31]!==M||R[32]!==H||R[33]!==O?(A=M?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(E,{children:[L.map(e=>(0,t.jsxs)("label",{"data-kind":"toggle",children:[(0,t.jsxs)("span",{children:[e.label,(0,t.jsx)("small",{children:e.hint})]}),(0,t.jsx)("input",{type:"checkbox",checked:O[e.key],onChange:t=>X(e.key,t.target.checked)})]},e.key)),j.map(e=>(0,t.jsxs)("label",{children:[(0,t.jsxs)("span",{children:[e.label,(0,t.jsx)("em",{children:O[e.key].toFixed(3)})]}),(0,t.jsx)("small",{children:e.hint}),(0,t.jsx)("input",{type:"range",min:e.min,max:e.max,step:e.step,value:O[e.key],onChange:t=>q(e.key,Number(t.target.value))})]},e.key))]}),(0,t.jsxs)(S,{children:[(0,t.jsx)("button",{type:"button",onClick:V,children:"reset to shipped"}),(0,t.jsx)("button",{type:"button",onClick:K,children:W?"copied":"copy config"})]}),(0,t.jsx)($,{children:H})]}):null,R[28]=W,R[29]=K,R[30]=V,R[31]=M,R[32]=H,R[33]=O,R[34]=A):A=R[34],R[35]!==M||R[36]!==_||R[37]!==A?(T=(0,m.createPortal)((0,t.jsxs)(x,{"data-scroll-tuner":!0,"data-open":M,children:[_,A]}),document.body),R[35]=M,R[36]=_,R[37]=A,R[38]=T):T=R[38],T};function k(e){return!e}_.displayName="ScrollTuner";var A=e.i(989970),T=e.i(883495);A.gsap.registerPlugin(T.default);let R=()=>{let e,t,n,l,s=(0,r.c)(10),m=(0,c.useLenis)(),f=(0,d.usePathname)(),{loaderEnabled:p,loaderMounted:h}=(0,u.use)(o.LoaderContext),{heroVideoLoadState:g,isHeroPlaybackComplete:w}=(0,u.use)(i.HeroVideoContext),{isReducedMotion:b}=(0,u.use)(a.PerformanceContext),[y,v]=(0,u.useState)(!1),x="/"===f&&!p&&!b&&"ready"===g&&!w;return s[0]!==y||s[1]!==x?(e=()=>{if(!x||y)return;let e=window.setTimeout(()=>v(!0),6e3);return()=>window.clearTimeout(e)},t=[x,y],s[0]=y,s[1]=x,s[2]=e,s[3]=t):(e=s[2],t=s[3]),(0,u.useEffect)(e,t),s[4]!==y||s[5]!==x||s[6]!==m||s[7]!==h?(n=()=>{if(m)return h||x&&!y?m.stop():m.start(),()=>{m.start()}},l=[y,x,m,h],s[4]=y,s[5]=x,s[6]=m,s[7]=h,s[8]=n,s[9]=l):(n=s[8],l=s[9]),(0,u.useEffect)(n,l),null},P=()=>{let e,t,n=(0,r.c)(4),i=(0,c.useLenis)();return n[0]!==i?.rootElement?(e=()=>{let e=i?.rootElement;if(!e)return;let t=t=>{(function(e){return e.target===document.documentElement||e.target===document.body})(t)&&e.dispatchEvent(new WheelEvent("wheel",t))};return window.addEventListener("wheel",t,{passive:!0}),()=>{window.removeEventListener("wheel",t)}},n[0]=i?.rootElement,n[1]=e):e=n[1],n[2]!==i?(t=[i],n[2]=i,n[3]=t):t=n[3],(0,u.useEffect)(e,t),null},I=()=>{let e,t,n=(0,r.c)(3),i=(0,c.useLenis)();return n[0]!==i?(e=()=>{let e=i?.rootElement;if(!i||!e)return;let t=0,r=0,n=()=>{t=0,"native"===i.isScrolling&&((0,s.scrollTrace)("watchdog rest",{position:Math.round(e.scrollTop)}),i.reset(),i.emit())},o=()=>{let o=performance.now();o-r>120&&(r=o,(0,s.scrollTrace)("native scroll",{position:Math.round(e.scrollTop),isScrolling:i.isScrolling})),window.clearTimeout(t),t=window.setTimeout(n,200)};return e.addEventListener("scroll",o,{passive:!0}),()=>{window.clearTimeout(t),e.removeEventListener("scroll",o)}},t=[i],n[0]=i,n[1]=e,n[2]=t):(e=n[1],t=n[2]),(0,u.useEffect)(e,t),null},N=()=>{let e=(0,c.useLenis)(),t=(0,d.usePathname)(),r=(0,u.useRef)(null);return(0,u.useLayoutEffect)(()=>{if(!e||r.current===t)return;r.current=t,e.options.infinite&&(e.options.infinite=!1),e.rootElement.setAttribute(l.SCROLL_RESETTING_ATTRIBUTE,"");try{e.scrollTo(0,{immediate:!0,force:!0})}finally{e.rootElement.removeAttribute(l.SCROLL_RESETTING_ATTRIBUTE)}e.resize();let n=requestAnimationFrame(()=>{T.default.refresh()});return()=>cancelAnimationFrame(n)},[e,t]),null},M=()=>{let e,t,n=(0,r.c)(3),i=(0,c.useLenis)();return n[0]!==i?(e=()=>{if(!i)return;let e=i.rootElement;T.default.scrollerProxy(e,{scrollTop:e=>(void 0!==e&&i.scrollTo(e,{immediate:!0}),i.scroll),getBoundingClientRect:()=>({top:0,left:0,width:e.clientWidth,height:e.clientHeight}),pinType:"fixed"}),T.default.defaults({scroller:e}),i.on("scroll",T.default.update);let t=e=>i.raf(1e3*e);return A.gsap.ticker.add(t),T.default.refresh(),()=>{i.off("scroll",T.default.update),A.gsap.ticker.remove(t),T.default.defaults({scroller:window}),T.default.scrollerProxy(e)}},t=[i],n[0]=i,n[1]=e,n[2]=t):(e=n[1],t=n[2]),(0,u.useEffect)(e,t),null},G=e=>{let i,o,l,s,d,m,f,p,h,w,b=(0,r.c)(12),{children:y}=e,{lenisRef:x}=(0,u.use)(n.AppContext),{isReducedMotion:S}=(0,u.use)(a.PerformanceContext);return S?y:(b[0]===Symbol.for("react.memo_cache_sentinel")?(i={autoRaf:!1,lerp:.09},o=(0,t.jsx)(M,{}),l=(0,t.jsx)(R,{}),s=(0,t.jsx)(P,{}),d=(0,t.jsx)(N,{}),m=(0,t.jsx)(I,{}),f=(0,t.jsx)(v,{}),p=(0,t.jsx)(g,{}),h=(0,t.jsx)(_,{}),b[0]=i,b[1]=o,b[2]=l,b[3]=s,b[4]=d,b[5]=m,b[6]=f,b[7]=p,b[8]=h):(i=b[0],o=b[1],l=b[2],s=b[3],d=b[4],m=b[5],f=b[6],p=b[7],h=b[8]),b[9]!==y||b[10]!==x?(w=(0,t.jsxs)(c.ReactLenis,{ref:x,options:i,children:[o,l,s,d,m,f,p,h,y]}),b[9]=y,b[10]=x,b[11]=w):w=b[11],w)};G.displayName="SmoothScroll";e.s(["default",0,G],945047)}]);