(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,854810,e=>{"use strict";var t=e.i(843476),a=e.i(500932),r=e.i(124821),n=e.i(494473),i=e.i(575509),s=e.i(271645),o=e.i(212960),l=e.i(997053);let d=(0,l.default)(i.Div).withConfig({componentId:"sc-d8e7d8d9-0"})(()=>l.css`
        display: flex;
        align-items: center;

        width: 100%;
        min-height: 100dvh;
        padding-block: ${(0,i.getGap)("xl")};

        background: ${(0,i.getBrand)("bc1")};
    `),c=(0,l.default)(i.Div).withConfig({componentId:"sc-d8e7d8d9-1"})(()=>l.css`
        ${o.titleL}
        margin-bottom: ${(0,i.getGap)("s")};
        color: ${(0,i.getBrand)("bc5")};
    `),f=(0,l.default)(i.Div).attrs({as:"p"}).withConfig({componentId:"sc-d8e7d8d9-2"})(()=>l.css`
        ${o.bodyL}
        color: ${(0,i.alpha)("--brand-bc5",60)};

        ${i.bp.l` max-width: 48rem; `}
    `),u=(0,l.default)(i.Div).withConfig({componentId:"sc-d8e7d8d9-3"})(()=>l.css`
        margin-top: ${(0,i.getGap)("m")};
    `),p="forge:error-reload",g=e=>{let o,l,g,h,v,y,x=(0,a.c)(8),{error:w,reset:$}=e,[k,B]=(0,s.useState)(!1),j=(0,s.useRef)(!1);x[0]===Symbol.for("react.memo_cache_sentinel")?(o=[],x[0]=o):o=x[0];let S=(0,s.useRef)(o);return(x[1]!==w||x[2]!==$?(l=()=>{if(console.error("Route error boundary:",w),!j.current)return j.current=!0,S.current.push(window.setTimeout(()=>{if((()=>{try{let e=Number(window.sessionStorage.getItem(p)??0);return Number.isFinite(e)&&Date.now()-e<3e4}catch{return!1}})())return void B(!0);try{window.sessionStorage.setItem(p,String(Date.now()))}catch{}$(),S.current.push(window.setTimeout(m,600))},150)),()=>{for(let e of S.current)window.clearTimeout(e);S.current=[]}},g=[w,$],x[1]=w,x[2]=$,x[3]=l,x[4]=g):(l=x[3],g=x[4]),(0,s.useEffect)(l,g),k)?(x[5]===Symbol.for("react.memo_cache_sentinel")?(h=(0,t.jsx)(c,{as:"h1",children:"This page didn’t load"}),v=(0,t.jsx)(f,{children:"Something went wrong on our side. Reloading usually clears it — if it doesn’t, try again in a moment."}),x[5]=h,x[6]=v):(h=x[5],v=x[6]),x[7]===Symbol.for("react.memo_cache_sentinel")?(y=(0,t.jsx)(d,{as:"section",children:(0,t.jsx)(n.default,{$isFixed:!0,children:(0,t.jsxs)(i.Div,{$m:"1/7",$l:"4/10",children:[h,v,(0,t.jsx)(u,{children:(0,t.jsx)(r.default,{onClick:b,aria:"Reload this page",isButton:!0,label:"Reload the page"})})]})})}),x[7]=y):y=x[7],y):null};function m(){"visible"===document.visibilityState&&window.location.reload()}function b(){return window.location.reload()}g.displayName="SiteError",e.s(["default",0,g],854810)},124821,135741,e=>{"use strict";var t=e.i(843476),a=e.i(500932);let r=null;var n=e.i(271645),i=e.i(575509),s=e.i(212960),o=e.i(951847),l=e.i(997053);let d=[...Array(25)].map((e,t)=>`&:nth-child(${t+1}) { transition-delay: ${.02*t}s; }`).join("\n"),c=({$isFullWidth:e})=>l.css`
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
            ${s.captionL}

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
            
                ${d}
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
`,f=(0,l.default)(o.Link).withConfig({componentId:"sc-6f2721c4-0"})(({$isFullWidth:e})=>l.css`
        ${c({$isFullWidth:e})}
    `),u=l.default.button.withConfig({componentId:"sc-6f2721c4-1"})(({$isFullWidth:e})=>l.css`
        ${c({$isFullWidth:e})}
    `);e.s(["Button",0,u,"Jacket",0,f,"sharedStyles",0,c],135741);let p=e=>{let i,s,o,l,d=(0,a.c)(6),c=(0,n.useRef)(null),p=(0,n.useRef)(null);if(d[0]!==e.isButton?(i=()=>{let t=e.isButton?c.current:p.current;if(t){let e;return(e=r||(r=new IntersectionObserver(e=>{for(let t of e)t.target instanceof HTMLElement&&t.target.style.setProperty("--play-state",t.isIntersecting?"running":"paused")},{threshold:0}))).observe(t),()=>e.unobserve(t)}},s=[e.isButton],d[0]=e.isButton,d[1]=i,d[2]=s):(i=d[1],s=d[2]),(0,n.useEffect)(i,s),d[3]!==e){l=Symbol.for("react.early_return_sentinel");e:{let a=[];for(let r=0;r<e.label.length;r+=1){let n=e.label[r];a.push((0,t.jsx)("span",{children:" "===n?" ":n},`${e.label}-${r}`))}let r=g;if(e.isButton){let{aria:n,label:i,onClick:s,isFullWidth:o,type:d,disabled:f}=e,p=void 0!==f&&f;l=(0,t.jsx)(u,{ref:c,type:void 0===d?"button":d,"aria-label":n??i,"aria-disabled":p,$isFullWidth:void 0!==o&&o,disabled:p,onClick:s,children:r(a)});break e}let{aria:n,label:i,to:s,onClick:d,isFullWidth:m,transitionAwaitsContent:b,prefetch:h,tabIndex:v}=e;o=(0,t.jsx)(f,{ref:p,href:s,"aria-label":n??i,$isFullWidth:void 0!==m&&m,onClick:d,transitionAwaitsContent:b,prefetch:h,tabIndex:v,children:r(a)})}d[3]=e,d[4]=o,d[5]=l}else o=d[4],l=d[5];return l!==Symbol.for("react.early_return_sentinel")?l:o};function g(e){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("span",{children:e}),(0,t.jsx)("i",{"aria-hidden":"true"})]})}p.displayName="Button",e.s(["default",0,p],124821)}]);