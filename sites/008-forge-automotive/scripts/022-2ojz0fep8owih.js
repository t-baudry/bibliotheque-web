(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,280411,e=>{e.v({className:"geistsans_d5a4f12f-module__Ur3q_a__className",variable:"geistsans_d5a4f12f-module__Ur3q_a__variable"})},522016,(e,t,r)=>{"use strict";e.i(247167),Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return b},useLinkStatus:function(){return $}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let o=e.r(190809),i=e.r(843476),s=o._(e.r(271645)),l=e.r(195057),c=e.r(8372),u=e.r(818581),f=e.r(718967),m=e.r(405550),d=e.r(388540),p=e.r(91949),h=e.r(573668),g=e.r(509396);function b(t){var r;let n,a,o,[b,$]=(0,s.useOptimistic)(p.IDLE_LINK_STATUS),v=(0,s.useRef)(null),{href:w,as:k,children:x,prefetch:T=null,passHref:P,replace:_,shallow:C,scroll:S,onClick:E,onMouseEnter:R,onTouchStart:O,legacyBehavior:j=!1,onNavigate:z,transitionTypes:N,ref:U,unstable_dynamicOnHover:V,...L}=t;n=x,j&&("string"==typeof n||"number"==typeof n)&&(n=(0,i.jsx)("a",{children:n}));let F=s.default.useContext(c.AppRouterContext),M=!1!==T,A=!1===T?"none":!0===T?"full":"auto",D="none"!==A&&"full"===A?g.FetchStrategy.Full:g.FetchStrategy.PPR,I="string"==typeof(r=k||w)?r:(0,l.formatUrl)(r);if(j){if(n?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});a=s.default.Children.only(n)}let B=j?a&&"object"==typeof a&&a.ref:U,K,G=s.default.useCallback(e=>(null!==F&&(v.current=(0,p.mountLinkInstance)(e,I,F,D,M,$,K)),()=>{v.current&&((0,p.unmountLinkForCurrentNavigation)(v.current),v.current=null),(0,p.unmountPrefetchableInstance)(e)}),[M,I,F,D,$,K]),W={ref:(0,u.useMergedRef)(G,B),onClick(t){j||"function"!=typeof E||E(t),j&&a.props&&"function"==typeof a.props.onClick&&a.props.onClick(t),!F||t.defaultPrevented||function(t,r,n,a,o,i,l,c="none"){if("u">typeof window){let u,{nodeName:f}=t.currentTarget;if("A"===f.toUpperCase()&&((u=t.currentTarget.getAttribute("target"))&&"_self"!==u||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,h.isLocalURL)(r)){a&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),i){let e=!1;if(i({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:m}=e.r(699781);s.default.startTransition(()=>{m(r,a?"replace":"push",!1===o?d.ScrollBehavior.NoScroll:d.ScrollBehavior.Default,n.current,l,c)})}}(t,I,v,_,S,z,N,A)},onMouseEnter(e){j||"function"!=typeof R||R(e),j&&a.props&&"function"==typeof a.props.onMouseEnter&&a.props.onMouseEnter(e),F&&M&&(0,p.onNavigationIntent)(e.currentTarget,!0===V)},onTouchStart:function(e){j||"function"!=typeof O||O(e),j&&a.props&&"function"==typeof a.props.onTouchStart&&a.props.onTouchStart(e),F&&M&&(0,p.onNavigationIntent)(e.currentTarget,!0===V)}};return(0,f.isAbsoluteUrl)(I)?W.href=I:j&&!P&&("a"!==a.type||"href"in a.props)||(W.href=(0,m.addBasePath)(I)),o=j?s.default.cloneElement(a,W):(0,i.jsx)("a",{...L,...W,children:n}),(0,i.jsx)(y.Provider,{value:b,children:o})}let y=(0,s.createContext)(p.IDLE_LINK_STATUS),$=()=>(0,s.useContext)(y);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},818581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return a}});let n=e.r(271645);function a(e,t){let r=(0,n.useRef)(null),a=(0,n.useRef)(null);return(0,n.useCallback)(n=>{if(null===n){let e=r.current;e&&(r.current=null,e());let t=a.current;t&&(a.current=null,t())}else e&&(r.current=o(e,n)),t&&(a.current=o(t,n))},[e,t])}function o(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},573668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return o}});let n=e.r(718967),a=e.r(652817);function o(e){if(!(0,n.isAbsoluteUrl)(e))return!0;try{let t=(0,n.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,a.hasBasePath)(r.pathname)}catch(e){return!1}}},998183,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={assign:function(){return l},searchParamsToUrlQuery:function(){return o},urlQueryToSearchParams:function(){return s}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});function o(e){let t={};for(let[r,n]of e.entries()){let e=t[r];void 0===e?t[r]=n:Array.isArray(e)?e.push(n):t[r]=[e,n]}return t}function i(e){return"string"==typeof e?e:("number"!=typeof e||isNaN(e))&&"boolean"!=typeof e?"":String(e)}function s(e){let t=new URLSearchParams;for(let[r,n]of Object.entries(e))if(Array.isArray(n))for(let e of n)t.append(r,i(e));else t.set(r,i(n));return t}function l(e,...t){for(let r of t){for(let t of r.keys())e.delete(t);for(let[t,n]of r.entries())e.append(t,n)}return e}},195057,(e,t,r)=>{"use strict";e.i(247167),Object.defineProperty(r,"__esModule",{value:!0});var n={formatUrl:function(){return s},formatWithValidation:function(){return c},urlObjectKeys:function(){return l}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let o=e.r(190809)._(e.r(998183)),i=/https?|ftp|gopher|file/;function s(e){let{auth:t,hostname:r}=e,n=e.protocol||"",a=e.pathname||"",s=e.hash||"",l=e.query||"",c=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?c=t+e.host:r&&(c=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(c+=":"+e.port)),l&&"object"==typeof l&&(l=String(o.urlQueryToSearchParams(l)));let u=e.search||l&&`?${l}`||"";return n&&!n.endsWith(":")&&(n+=":"),e.slashes||(!n||i.test(n))&&!1!==c?(c="//"+(c||""),a&&"/"!==a[0]&&(a="/"+a)):c||(c=""),s&&"#"!==s[0]&&(s="#"+s),u&&"?"!==u[0]&&(u="?"+u),a=a.replace(/[?#]/g,encodeURIComponent),u=u.replace("#","%23"),`${n}${c}${a}${u}${s}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function c(e){return s(e)}},718967,(e,t,r)=>{"use strict";e.i(247167),Object.defineProperty(r,"__esModule",{value:!0});var n={DecodeError:function(){return b},MiddlewareNotFoundError:function(){return w},MissingStaticPage:function(){return v},NormalizeError:function(){return y},PageNotFoundError:function(){return $},SP:function(){return h},ST:function(){return g},WEB_VITALS:function(){return o},execOnce:function(){return i},getDisplayName:function(){return f},getLocationOrigin:function(){return c},getURL:function(){return u},isAbsoluteUrl:function(){return l},isResSent:function(){return m},loadGetInitialProps:function(){return p},normalizeRepeatedSlashes:function(){return d},stringifyError:function(){return k}};for(var a in n)Object.defineProperty(r,a,{enumerable:!0,get:n[a]});let o=["CLS","FCP","FID","INP","LCP","TTFB"];function i(e){let t,r=!1;return(...n)=>(r||(r=!0,t=e(...n)),t)}let s=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=e=>{let t=e.charCodeAt(0);return!!(t>=65&&t<=90||t>=97&&t<=122)&&s.test(e)};function c(){let{protocol:e,hostname:t,port:r}=window.location;return`${e}//${t}${r?":"+r:""}`}function u(){let{href:e}=window.location,t=c();return e.substring(t.length)}function f(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function m(e){return e.finished||e.headersSent}function d(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function p(e,t){let r=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await p(t.Component,t.ctx)}:{};let n=await e.getInitialProps(t);if(r&&m(r))return n;if(!n)throw Object.defineProperty(Error(`"${f(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return n}let h="u">typeof performance,g=h&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class b extends Error{}class y extends Error{}class $ extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class v extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class w extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function k(e){return JSON.stringify({message:e.message,stack:e.stack})}},618566,(e,t,r)=>{t.exports=e.r(976562)},327748,255672,e=>{"use strict";let t=(e,t)=>Object.fromEntries(Object.keys(t).map(t=>[t,`var(--${e}-${t})`]));e.s(["toVarDeclarations",0,(e,t)=>Object.entries(t).map(([t,r])=>`--${e}-${t}: ${r};`).join("\n"),"toVarRefs",0,t],255672);let r={brand:{bc1:"#0C0C0C",bc2:"#161616",bc3:"#410306",bc4:"#C5A064",bc5:"#F2F1ED"},global:{white:"#ffffff",black:"#000000"},feedback:{positive:"#3adb76",negative:"#cc4b37",warning:"#face10"}},n={brand:t("brand",r.brand),global:t("global",r.global),feedback:t("feedback",r.feedback)};e.s(["baseColors",0,r,"colors",0,n],327748)},702544,e=>{e.v({className:"editorial_5b27502a-module__OGcOgW__className",variable:"editorial_5b27502a-module__OGcOgW__variable"})},580662,428137,70877,778042,e=>{"use strict";var t=e.i(255672);let r={xs:"0.3rem",s:"0.6rem",m:"1.2rem",l:"1.8rem",round:"999rem"},n=(0,t.toVarRefs)("br",r);e.s(["borderRadius",0,n,"borderRadiusValues",0,r],580662);let a={bezzy:"cubic-bezier(0.8, 0, 0, 1)",bezzy2:"cubic-bezier(0.430, 0.195, 0.020, 1)",bezzy3:"cubic-bezier(0.5, 0, 0, 1)",ease:"ease-in-out"},o=(0,t.toVarRefs)("easing",a);e.s(["easing",0,o,"easingValues",0,a],428137);var i=e.i(280411);let s={className:i.default.className,style:{fontFamily:"'GeistSans', 'GeistSans Fallback'"}};null!=i.default.variable&&(s.variable=i.default.variable);var l=e.i(702544);let c={className:l.default.className,style:{fontFamily:"'editorial', 'editorial Fallback'"}};null!=l.default.variable&&(c.variable=l.default.variable);let u={heading:'var(--editorial), Georgia, Times, "Times New Roman", serif',body:'var(--font-geist-sans), Arial, Helvetica, "Liberation Sans", sans-serif',mono:'var(--font-geist-mono), "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace',script:'var(--inter), "Comic Sans MS", "Comic Sans", cursive, Arial, sans-serif'},f={family:(0,t.toVarRefs)("font",u),weight:{ultralight:200,light:300,regular:400,medium:500,semi:600,bold:700,heavy:800,black:900}};e.s(["fontFamilies",0,u,"fonts",0,f],70877);let m={xxs:"0.2rem",xs:"0.4rem",s:"0.8rem",sm:"1.6rem",m:"2.4rem",l:"3.2rem",xl:"4rem",xxl:"6.4rem",huge:"8rem",uber:"9.6rem",massive:"12.8rem",col:"calc(8.333vw + 1.6rem)"},d=(0,t.toVarRefs)("gap",m);e.s(["gap",0,d,"gapValues",0,m],778042)},180301,e=>{"use strict";e.s(["grid",0,{columns:{s:4,m:6,l:12},breakpoints:{s:"320px",sm:"420px",m:"700px",l:"1024px",xl:"1200px",xxl:"1400px",huge:"1600px",uber:"1800px"},gutter:{s:"2.4rem",m:"3.2rem",l:"3.2rem"},maxSize:"1440px",design:{mobile:390,tablet:700,desktop:1440}}])},228073,e=>{"use strict";var t=e.i(997053),r=e.i(580662),n=e.i(327748),a=e.i(255672),o=e.i(428137),i=e.i(70877),s=e.i(778042),l=e.i(180301);let c={s:"4.8rem",m:"6rem",l:"10rem",xl:"12rem",col:"calc(8.333vw + 1.8rem)"},u=(0,a.toVarRefs)("space",c),f={s:"0.15s",m:"0.3s",l:"0.6s"},m=(0,a.toVarRefs)("time",f),d={colors:n.colors,space:u,gap:s.gap,br:r.borderRadius,font:i.fonts,grid:l.grid,easing:o.easing,time:m},p=[...Object.entries(n.baseColors).map(([e,t])=>(0,a.toVarDeclarations)(e,t)),(0,a.toVarDeclarations)("space",c),(0,a.toVarDeclarations)("gap",s.gapValues),(0,a.toVarDeclarations)("br",r.borderRadiusValues),(0,a.toVarDeclarations)("easing",o.easingValues),(0,a.toVarDeclarations)("time",f),(0,a.toVarDeclarations)("font",i.fontFamilies)].join("\n"),h=t.createGlobalStyle`
	:root {
		${p}
		--header-size: 3.2rem;
		--header-size-mobile: 8.8rem;
		--header-size-desktop: 9.6rem;
	}

	/* SECTION • Runtime theme overrides
	   Redefine any token per theme — every consumer follows automatically:

	   html[data-theme='dark'] {
	       --global-white: #000000;
	       --global-black: #ffffff;
	       --brand-bc1: #9b30ff;
	   }
	*/

	body {
		background: ${d.colors.global.black};
		color: ${d.colors.global.white};
	}
`;e.s(["GlobalStyle",0,h,"theme",0,d],228073)},575509,512618,194981,e=>{"use strict";var t=e.i(228073);let{xxl:r,sm:n,m:a}=t.theme.grid.breakpoints;r?.replace("px",""),a?.replace("px",""),n?.replace("px","");var o=e.i(997053);let i=t.theme.grid.breakpoints,s=Object.keys(i),l=s.reduce((e,t)=>(e[t]=`@media (min-width: ${i[t]})`,e),{}),c=s.reduce((e,t)=>(e[t]=`@media (max-width: ${i[t]})`,e),{}),u=s.reduce((e,t)=>(e[t]=(...e)=>o.css`
        ${l[t]} {
            ${(0,o.css)(...e)}
        }
    `,e),{}),f=s.reduce((e,t)=>(e[t]=(...e)=>o.css`
        ${c[t]} {
            ${(0,o.css)(...e)}
        }
    `,e),{});e.s(["breakpointDown",0,f,"breakpointUp",0,u],512618);let m=e=>{let r,n,a,i,s,l;return o.css`
    ${r=t.theme.space.s,n=t.theme.space.m,a=t.theme.space.l,o.css`

        ${e.$padBottom&&o.css`
            padding-bottom: ${r};
            ${u.m`padding-bottom: ${n};`}
            ${u.l`padding-bottom: ${a};`}
        `}

        ${e.$padTop&&o.css`
            padding-top: ${r};
            ${u.m` padding-top: ${n};`}
            ${u.l` padding-top: ${a};`}
        `}
        
        ${e.$pad&&o.css`
            padding-block: ${r};
            ${u.m` padding-block: ${n}; `}
            ${u.l` padding-block: ${a}; `}
        `}
    `}
    ${i=t.theme.space.s,s=t.theme.space.m,l=t.theme.space.l,o.css`
        ${e.$marBottom&&o.css`
            margin-bottom: ${i};
            ${u.m`margin-bottom: ${s};`}
            ${u.l`margin-bottom: ${l};`}
        `}

        ${e.$marTop&&o.css`
            margin-top: ${i};
            ${u.m`margin-top: ${s};`}
            ${u.l`margin-top: ${l};`}
        `}
        
        ${e.$mar&&o.css`
            margin-block: ${i};
            ${u.m` margin-block: ${s}; `}
            ${u.l` margin-block: ${l}; `}
        `}
    `}
`},d=Object.keys(t.theme.grid.breakpoints),p=e=>o.css`
    ${d.map(t=>e[`$${t}`]&&o.css`
                ${u[t]`
                    grid-column: ${e[`$${t}`]};
                `}
            `)}
`;e.s(["gridSemantics",0,p,"semantics",0,m],194981);let h=o.default.div.withConfig({componentId:"sc-337305d3-0"})`
	${e=>m(e)}
	${e=>p(e)}
`,g=(e,t)=>{let r=e.startsWith("--")?`var(${e})`:e;return t>=100?r:`color-mix(in srgb, ${r} ${t}%, transparent)`},b=o.css`
	background-color: var(--brand-bc2);
	box-shadow: inset 0 0 0 1px ${g("--brand-bc5",14)};
	background-image: linear-gradient(
			to bottom right,
			transparent calc(50% - 1px),
			${g("--brand-bc5",14)} calc(50% - 1px),
			${g("--brand-bc5",14)} calc(50% + 1px),
			transparent calc(50% + 1px)
		),
		linear-gradient(
			to bottom left,
			transparent calc(50% - 1px),
			${g("--brand-bc5",14)} calc(50% - 1px),
			${g("--brand-bc5",14)} calc(50% + 1px),
			transparent calc(50% + 1px)
		);
`,y=(e,t)=>void 0===e||void 0===t?e:g(e,t);o.css`
	scrollbar-width: none;
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		width: 0;
		height: 0;
		background: transparent;
	}
`,e.s(["Div",0,h,"alpha",0,g,"bp",0,u,"getBrand",0,(e,t)=>r=>y(r.theme.colors.brand[e],t),"getEase",0,e=>t=>t.theme.easing[e],"getFeedback",0,(e,t)=>r=>y(r.theme.colors.feedback[e],t),"getFont",0,e=>t=>t.theme.font.family[e],"getFontWeight",0,e=>t=>t.theme.font.weight[e],"getGap",0,e=>t=>t.theme.gap[e],"getGlobal",0,(e,t)=>r=>y(r.theme.colors.global[e],t),"getRadius",0,e=>t=>t.theme.br[e],"getTime",0,e=>t=>t.theme.time[e],"missingMedia",0,b],575509)},212960,e=>{"use strict";var t=e.i(228073),r=e.i(997053),n=e.i(512618);let a=r.css`
	font-family: ${t.theme.font.family.heading};
	text-transform: capitalize;
	/* Only the real italic cut — a synthetic oblique slants the roman f. */
	font-synthesis: none;

	${e=>e?.$alt&&"font-style: italic;"}
`,o=r.css`
	${a}
	
	font-weight: ${t.theme.font.weight.ultralight};
	font-size: 8rem;
	line-height: 1.1;
	letter-spacing: -0.2rem;

	${n.breakpointUp.xl` font-size: 14rem; `}
`,i=r.css`
	${a}
	font-weight: ${t.theme.font.weight.ultralight};
	font-size: 5.8rem;
	line-height: 1.2;
	letter-spacing: -0.2rem;

	
	${n.breakpointUp.xl` font-size: 9.6rem; `}
`,s=r.css`
	${a}
	font-weight: ${t.theme.font.weight.ultralight};
	font-size: 3.6rem;
	line-height: 1.2;
	letter-spacing: -0.1rem;

	${n.breakpointUp.l` font-size: 6.4rem; `}
	${n.breakpointUp.xl` font-size: 8rem; `}
`,l=r.css`
	${a}
	font-weight: ${t.theme.font.weight.light};
	font-size: 2rem;
	line-height: 1.2;
	letter-spacing: -0.05rem;

	${n.breakpointUp.xl`
		font-size: 2.4rem;
	`}
`,c=r.css`
	${a}
	font-weight: ${t.theme.font.weight.light};
	font-size: 1.6rem;
	line-height: 1.2;
	letter-spacing: -0.05rem;

	${n.breakpointUp.xl`
		font-size: 1.8rem;
	`}
`,u=r.css`
	font-family: ${t.theme.font.family.body};
`,f=r.css`
	${u}
	display: block;
	font-style: normal;
	font-size: 1.6rem;
	font-weight: ${t.theme.font.weight.light};
	line-height: 1.4;
	letter-spacing: -0.05rem;

	${n.breakpointUp.m` font-size: 1.8rem; `}
`,m=r.css`
	${u}
	display: block;
	font-style: normal;
	font-size: 1.2rem;
	line-height: 1.2;
	font-weight: ${t.theme.font.weight.regular};
	letter-spacing: -0.05rem;

	${n.breakpointUp.m` font-size: 1.4rem; `}
`,d=r.css`
	${u}
	display: block;

	font-style: normal;
	font-size: 0.9rem;
	font-weight: ${t.theme.font.weight.semi};
	line-height: 2;
	letter-spacing: 0.3rem;
	text-transform: uppercase;

	${n.breakpointUp.m` font-size: 1rem; `}
`,p=r.css`
	${u}
	display: block;
	font-style: normal;
	font-size: 0.7rem;
	line-height: 1.2;
	font-weight: ${t.theme.font.weight.semi};
	text-transform: uppercase;

	${n.breakpointUp.m` font-size: 0.8rem; `}
`;e.s(["bodyL",0,f,"bodyS",0,m,"captionL",0,d,"captionS",0,p,"displayL",0,o,"headlineL",0,i,"headlineS",0,s,"titleL",0,l,"titleS",0,c])},951847,35035,e=>{"use strict";var t=e.i(843476),r=e.i(522016),n=e.i(271645),a=e.i(448806),o=e.i(500932),i=e.i(618566),s=e.i(452599);function l(){let e,t,r,l,c=(0,o.c)(12),u=(0,i.useRouter)(),f=(0,a.useSetPageTransitioning)();c[0]!==f?(e=(e,t,r)=>{(0,s.supportsViewTransitions)()?((0,s.runGatedTransition)(e,void 0===r?{}:r,f),(0,n.startTransition)(t)):t()},c[0]=f,c[1]=e):e=c[1];let m=e;c[2]!==u||c[3]!==m?(t=(e,t)=>{let{onTransitionReady:r,types:n,awaitContent:a,...o}=void 0===t?{}:t;m(e,()=>u.push(e,o),{onTransitionReady:r,types:n,awaitContent:a})},c[2]=u,c[3]=m,c[4]=t):t=c[4];let d=t;c[5]!==u||c[6]!==m?(r=(e,t)=>{let{onTransitionReady:r,types:n,awaitContent:a,...o}=void 0===t?{}:t;m(e,()=>u.replace(e,o),{onTransitionReady:r,types:n,awaitContent:a})},c[5]=u,c[6]=m,c[7]=r):r=c[7];let p=r;return c[8]!==d||c[9]!==p||c[10]!==u?(l={...u,push:d,replace:p},c[8]=d,c[9]=p,c[10]=u,c[11]=l):l=c[11],l}e.s(["useTransitionRouter",0,l],35035);let c=e=>{let t=e.split(/[?#]/)[0]||"/";return t.length>1?t.replace(/\/+$/,""):t},u=(0,n.forwardRef)(function(e,o){let i=l(),{href:s,replace:u,scroll:f,transitionTypes:m,transitionAwaitsContent:d,...p}=e,h=(0,n.useCallback)(t=>{if(e.onClick&&e.onClick(t),!t.defaultPrevented&&"startViewTransition"in document){if(function(e){let t,{nodeName:r}=e.currentTarget;return"A"===r.toUpperCase()&&(!!(t=e.currentTarget.getAttribute("target"))&&"_self"!==t||!!e.metaKey||!!e.ctrlKey||!!e.shiftKey||!!e.altKey||!!e.nativeEvent&&2===e.nativeEvent.which)||!1}(t))return;let e="string"==typeof s?s:s.pathname+(s.search||"")+(s.hash||"");if(c(e)!==c(window.location.pathname)){if((0,a.isPageTransitionInFlight)())return void t.preventDefault();t.preventDefault(),(u?i.replace:i.push)(e,{scroll:f??!0,types:m,awaitContent:d})}}},[e.onClick,s,u,f,m,d,i]),g=(0,n.useCallback)(()=>{let e="string"==typeof s?s:s.pathname+(s.search||"")+(s.hash||"");i.prefetch(e)},[s,i]),b=(0,n.useCallback)(t=>{e.onMouseEnter?.(t),g()},[e.onMouseEnter,g]),y=(0,n.useCallback)(t=>{e.onFocus?.(t),g()},[e.onFocus,g]);return(0,t.jsx)(r.default,{...p,ref:o,href:s,replace:u,scroll:f,onClick:h,onMouseEnter:b,onFocus:y})});e.s(["Link",0,u],951847)},448806,883644,452599,e=>{"use strict";let t;var r=e.i(843476),n=e.i(500932),a=e.i(618566),o=e.i(271645);let i=null,s=0,l=null,c=new Map,u=()=>{let e=()=>{};return{promise:new Promise(t=>{e=t}),resolve:e}},f=e=>e.replace(/\/+$/,"")||"/",m=()=>l??f(window.location.pathname),d=null,p=e=>new Promise(t=>{let r=e=>{d===r&&(d=null),t(e)};d=r,window.setTimeout(()=>r("timeout"),e)}),h=async()=>{let e=document.querySelector("main img");e&&!e.complete&&await Promise.race([e.decode().catch(()=>void 0),new Promise(e=>setTimeout(e,600))])},g=e=>{let a,s,l,u=(0,n.c)(4),{token:f}=e;t!==f&&i?.start("content");let p=(0,o.useRef)(null);return u[0]!==f?(a=()=>{var e;let r=!1;return t=f,p.current&&(e=p.current,c.set(m(),e)),h().finally(()=>{r||d?.("ready")}),()=>{r=!0}},s=[f],u[0]=f,u[1]=a,u[2]=s):(a=u[1],s=u[2]),(0,o.useEffect)(a,s),u[3]===Symbol.for("react.memo_cache_sentinel")?(l=(0,r.jsx)("span",{ref:p,hidden:!0,"aria-hidden":"true"}),u[3]=l):l=u[3],l};g.displayName="RouteContentReady",e.s(["RouteContentReady",0,g,"waitForRouteContent",0,p],883644);let b=/^(-?\d*\.?\d+)(ms|s)$/,y="data-page-leaving",$=0,v=null,w=null,k=()=>{v&&(clearTimeout(v),v=null)},x=()=>{w&&(clearTimeout(w),w=null)},T=()=>{x(),document.documentElement.removeAttribute(y)},P=()=>{k(),T(),$+=1};e.s(["cancelPendingRelease",0,P,"runGatedTransition",0,(e,t,r)=>{k();let n=++$;r(!0);let a=(e=>{let t=e.trim().match(b);if(!t)return null;let[,r,n]=t;return"s"===n?1e3*Number(r):Number(r)})(getComputedStyle(document.documentElement).getPropertyValue("--page-beat-dur"))??1200,o=t.types?.length?Promise.resolve():(x(),document.documentElement.setAttribute(y,""),new Promise(e=>{w=setTimeout(()=>{w=null,e()},.6*a)})),l=(({href:e,awaitContent:t,onStart:r,capMs:n})=>{i?.close();let a=u(),o=u(),l={id:++s,targetPathname:f(new URL(e,window.location.href).pathname),awaitContent:t,startedBy:null,captured:a.promise,committed:o.promise,release:a.resolve,start:e=>{l.startedBy||(l.startedBy=e,r(l))},close:()=>{a.resolve(),o.resolve(),i===l&&(i=null)}};return i=l,window.setTimeout(()=>{i===l&&(m()===l.targetPathname?l.close():l.start("cap"))},n),l})({href:e,awaitContent:t.awaitContent??!1,capMs:1e3,onStart:e=>o.then(()=>{$===n&&((e,t,{onTransitionReady:r,types:n},a,o)=>{if("function"!=typeof document.startViewTransition){T(),e.release();return}let i=()=>{let t="content"===e.startedBy?p(2500):Promise.resolve(),r=Promise.race([e.committed,new Promise(e=>window.setTimeout(e,2500))]);return e.release(),Promise.all([r,t]).then(T)},s=n?.length&&"u">typeof ViewTransition&&"types"in ViewTransition.prototype?document.startViewTransition({update:i,types:n}):document.startViewTransition(i);r&&s.ready.then(r),s.ready.then(()=>{$===t&&(v=setTimeout(()=>{$===t&&(a(!1),v=null)},.92*o))}),s.finished.finally(()=>{$===t&&(k(),a(!1))})})(e,n,t,r,a)})});l.committed.then(()=>{$!==n||l.startedBy||(T(),r(!1))})},"supportsViewTransitions",0,()=>"function"==typeof document.startViewTransition],452599);let _=(0,o.createContext)(!1),C=(0,o.createContext)(()=>()=>{}),S=!1;function E(e){let t,r,a,{setIsPageTransitioning:s}=e;return(a=(0,n.c)(3))[0]!==s?(t=()=>{let e=()=>{i?.close(),P(),s(!1)};return window.addEventListener("popstate",e),()=>window.removeEventListener("popstate",e)},r=[s],a[0]=s,a[1]=t,a[2]=r):(t=a[1],r=a[2]),(0,o.useEffect)(t,r),null}function R(){let e,t,r=(0,n.c)(3),s=(0,a.usePathname)(),u=f(s);if(i&&u===i.targetPathname&&u!==m()){if(i.awaitContent){let e;(e=c.get(u))&&(e.isConnected||(c.delete(u),0))&&i.start("retained")}else i.start("shell");(0,o.use)(i.captured)}return r[0]!==s?(e=()=>{l=f(s),i?.targetPathname===l&&i.close()},t=[s],r[0]=s,r[1]=e,r[2]=t):(e=r[1],t=r[2]),(0,o.useEffect)(e,t),null}e.s(["ViewTransitions",0,function(e){let t,a,i,s,l=(0,n.c)(7),{children:c}=e,[u,f]=(0,o.useState)(!1);return l[0]!==u?(t=()=>{S=u},a=[u],l[0]=u,l[1]=t,l[2]=a):(t=l[1],a=l[2]),(0,o.useEffect)(t,a),l[3]===Symbol.for("react.memo_cache_sentinel")?(i=(0,r.jsxs)(o.Suspense,{fallback:null,children:[(0,r.jsx)(E,{setIsPageTransitioning:f}),(0,r.jsx)(R,{})]}),l[3]=i):i=l[3],l[4]!==c||l[5]!==u?(s=(0,r.jsx)(C.Provider,{value:f,children:(0,r.jsxs)(_.Provider,{value:u,children:[i,c]})}),l[4]=c,l[5]=u,l[6]=s):s=l[6],s},"isPageTransitionInFlight",0,()=>S,"usePageTransitioning",0,function(){return(0,o.use)(_)},"useSetPageTransitioning",0,function(){return(0,o.use)(C)}],448806)}]);