(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,32485,e=>{"use strict";var t=e.i(843476),i=e.i(500932),a=e.i(134770),n=e.i(831119),r=e.i(523289),l=e.i(271645),s=e.i(89835),o=e.i(481293),c=e.i(101384),d=e.i(607561),u=e.i(989970),p=e.i(575509),f=e.i(212960),m=e.i(997053);let h=[...Array(12)].map((e,t)=>`&:nth-child(${t+1}) { transition-delay: ${.02*t}s; }`).join("\n"),g=(0,m.default)(p.Div).attrs({as:"nav"}).withConfig({componentId:"sc-1eb77e08-0"})(({$isOpen:e})=>m.css`
        position: fixed;
        inset: 0;
        z-index: 0;
        background: ${(0,p.getBrand)("bc3")};
        pointer-events: ${e?"all":"none"};
        opacity: ${+!!e};
        visibility: ${e?"visible":"hidden"};
        transition:
            opacity 0.3s ${(0,p.getEase)("ease")} ${.9*!e}s,
            visibility 0s linear ${1.2*!e}s;

        &:after {
            content: '';
            position: absolute;
            z-index: 0;
            inset: 0;
            background: ${(0,p.getGlobal)("black")};
            opacity: 0.2;
            pointer-events: none;
        }
    `),v=(0,m.default)(p.Div).withConfig({componentId:"sc-1eb77e08-1"})(({$isOpen:e})=>m.css`
        --movement: 1.5em;
        --ease: ${(0,p.getEase)("bezzy2")};

        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: ${(0,p.getGap)("m")};

        width: 100%;
        height: 100%;

        opacity: ${+!!e};
        scale: 	${e?1:2};
        filter: blur(${8*!e}px);
        
        transition:
            opacity ${e?1.2:.25}s var(--ease),
            scale ${.75}s var(--ease),
            filter ${e?1.2:.25}s var(--ease);

        transition-delay: ${.15*!!e}s;
        

        ul[data-name='pages'],
        ul[data-name='legals'] {
            display: flex;
            align-items: center;
            justify-content: center;

            li {
                a,
                button {
                    display: inline-block;
                    color: ${(0,p.getBrand)("bc5")};
                    overflow: clip;
                    transition: opacity 0.3s ${(0,p.getEase)("ease")};     

                    span {
                        display: inline-block;
                        text-shadow: ${(0,p.getBrand)("bc5")} 0 calc(var(--movement) * -1) 0;
                        transition: transform 0.5s ${(0,p.getEase)("bezzy2")};

                        ${h}
                    }
                }
            }

            @media (hover: hover) and (pointer: fine) {
                &:hover :is(a, button) {
                    opacity: 0.2;
                }

                & :is(a, button):hover {
                    opacity: 1;

                    span {
                        transform: translateY(var(--movement));
                    }
                }
            }
        }

        ul[data-name='pages'] {
            flex-direction: column;
            gap: ${(0,p.getGap)("s")};

            li a {
                ${f.displayL}
                text-transform: uppercase;
            }
        }

        ul[data-name='legals'] {
            flex-wrap: wrap;
            gap: ${(0,p.getGap)("s")} ${(0,p.getGap)("l")};

            li :is(a, button) {
                ${f.titleS}

                cursor: pointer;

                color: ${(0,p.getBrand)("bc5")};
            }
        }

        ul[data-name='socials'] {
            display: flex;
            gap: ${(0,p.getGap)("s")};
            align-items: center;
            justify-content: center;

            ${p.bp.l`  display: none; `}

            li {

                a {
                    display: inline-block;
                    padding: ${(0,p.getGap)("s")};

                    svg {
                        --size: 2.4rem;
                        fill: ${(0,p.getBrand)("bc5")};
                    }
                }
            }
        }

        @media (max-height: 500px) and (orientation: landscape) {
            padding: 7.2rem ${(0,p.getGap)("s")} 6.4rem;
            gap: ${(0,p.getGap)("xs")};

            ul[data-name='pages'] {
                flex-direction: row;
                gap: ${(0,p.getGap)("m")};

                li a {
                    font-size: clamp(3.2rem, 6vw, 6rem);
                }
            }
        }
    `),b=m.default.small.withConfig({componentId:"sc-1eb77e08-2"})(()=>m.css`
        --offset: ${(0,p.getGap)("xl")};

        @media (max-height: 500px) and (orientation: landscape) {
            --offset: ${(0,p.getGap)("s")};
        }

        position: absolute;
        bottom: var(--offset); left: 50%;
        transform: translateX(-50%);

        width: 100%;
		display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: ${(0,p.getGap)("xs")};
		text-align: center;

        p, a {
            ${f.captionS}

            color: ${(0,p.getBrand)("bc5",55)};
            transition: color 0.3s ${(0,p.getEase)("ease")};  

            svg {
                opacity: 1;
                transition: opacity 0.3s ${(0,p.getEase)("ease")};
            }
        }

        @media (hover: hover) and (pointer: fine) {
            a:hover { 
                color: ${(0,p.getBrand)("bc5")};

                svg {
                    opacity: 0.4;
                }
            }
        }

        [data-name='copyright'] {
            position: absolute;
            bottom: 0; left: var(--offset);
        }

        [data-name='powered'] a{
            display: flex;
            flex-direction: column;
            gap: ${(0,p.getGap)("s")};
        }

        [data-name='siteby'] {
            position: absolute;
            bottom: 0; right: var(--offset);
        }
	`),y=m.default.figure.withConfig({componentId:"sc-1eb77e08-3"})(()=>m.css`
		position: absolute;
		inset: -12rem;
		z-index: 1;
        overflow: visible;
        user-select: none;
        pointer-events: none;

        svg { 
            width: 100%;
            height: 100%;
            fill: ${(0,p.getGlobal)("black",20)};
            pointer-events: none;
        }
	`),x=()=>{let e,a,r,s,o,p,f,m=(0,i.c)(11),{menuOpen:h}=(0,l.use)(n.MenuContext),{isReducedMotion:g}=(0,l.use)(c.PerformanceContext),v=(0,l.useRef)(null),b=(0,l.useRef)(null),x=(0,l.useRef)(h),C=(0,l.useRef)(null),L=(0,l.useRef)(null);return m[0]!==h?(e=()=>{x.current=h},a=[h],m[0]=h,m[1]=e,m[2]=a):(e=m[1],a=m[2]),(0,l.useLayoutEffect)(e,a),m[3]!==h?(r=()=>{h||(C.current?.(0),L.current?.(0))},s=[h],m[3]=h,m[4]=r,m[5]=s):(r=m[4],s=m[5]),(0,l.useEffect)(r,s),m[6]!==g?(o=e=>{let{isDesktop:t}=e,i=b.current;if(!t||g||!i)return;let a=u.default.quickTo(i,"x",{duration:.85,ease:"power2.out"}),n=u.default.quickTo(i,"y",{duration:.85,ease:"power2.out"});C.current=a,L.current=n;let r=e=>{if(!x.current)return;let t=e.clientX/window.innerWidth-.5,i=e.clientY/window.innerHeight-.5;a(-(120*t)),n(-(120*i))};return window.addEventListener("mousemove",r,{passive:!0}),()=>{window.removeEventListener("mousemove",r),C.current=null,L.current=null}},m[6]=g,m[7]=o):o=m[7],m[8]!==g?(p={scope:v,dependencies:[g],revertOnUpdate:!0},m[8]=g,m[9]=p):p=m[9],(0,d.useAnimation)(o,p),m[10]===Symbol.for("react.memo_cache_sentinel")?(f=(0,t.jsx)(y,{ref:v,"aria-hidden":"true",children:(0,t.jsx)("svg",{ref:b,viewBox:"0 0 440 796",fill:"none","aria-hidden":"true",children:(0,t.jsx)("path",{d:"M744.064 796H1091.95C1093.83 796 1094.85 793.785 1093.49 792.421L357.651 56.7476C321.174 20.2792 271.914 0 220.438 0H-47.8527C-49.7276 0 -50.7503 2.21537 -49.3867 3.57868L208.847 261.755C210.211 263.118 209.188 265.333 207.313 265.333H-46.8299C-98.3062 265.333 -147.737 285.783 -184.043 322.081L-654.318 792.421C-655.682 793.785 -654.659 796 -652.784 796H-304.893C-304.893 796 -303.87 795.83 -303.359 795.318L-131.544 623.542C-131.544 623.542 -129.328 622.69 -128.476 623.542L43.3388 795.318C43.3388 795.318 44.191 796 44.8729 796H392.764C394.639 796 395.661 793.785 394.298 792.421L48.6227 446.823C48.6227 446.823 47.7705 444.608 48.6227 443.756L218.563 273.854C218.563 273.854 220.779 273.002 221.631 273.854L743.211 795.318C743.211 795.318 744.064 796 744.746 796H744.064Z"})})}),m[10]=f):f=m[10],f};x.displayName="Background";var C=e.i(384024),L=e.i(319420),$=e.i(522016);let H=e=>e.split("").map((i,a)=>(0,t.jsx)("span",{children:" "===i?" ":i},`${e}-${i}-${a.toString()}`)),w=e=>{let a,n,r,l=(0,i.c)(12),{label:s,href:o,aria:c,onClick:d,onNavigate:u,prefetch:p}=e;l[0]!==o||l[1]!==d||l[2]!==u?(a=e=>{d?.(),!u||(0,L.isModifiedClick)(e)||e.defaultPrevented||(e.preventDefault(),u(o))},l[0]=o,l[1]=d,l[2]=u,l[3]=a):a=l[3];let f=a;return l[4]!==s?(n=H(s),l[4]=s,l[5]=n):n=l[5],l[6]!==c||l[7]!==f||l[8]!==o||l[9]!==p||l[10]!==n?(r=(0,t.jsx)($.default,{href:o,"aria-label":c,prefetch:p,onClick:f,children:n}),l[6]=c,l[7]=f,l[8]=o,l[9]=p,l[10]=n,l[11]=r):r=l[11],r};w.displayName="MenuItem";let j=()=>{let e,a=(0,i.c)(1);return a[0]===Symbol.for("react.memo_cache_sentinel")?(e=(0,t.jsx)("button",{type:"button","aria-label":"Cookie settings: choose again",onClick:C.resetConsent,children:H("Cookie Settings")}),a[0]=e):e=a[0],e};j.displayName="CookieSettings";var k=e.i(704634);let S=()=>{let e=new Date().getFullYear();return`Copyright \xa9 ${e}`};S.displayName="Copyright";let _=()=>{let e,a,n,r=(0,i.c)(3);return r[0]===Symbol.for("react.memo_cache_sentinel")?(e=(0,t.jsx)("p",{"data-name":"copyright",children:(0,t.jsx)(S,{})}),r[0]=e):e=r[0],r[1]===Symbol.for("react.memo_cache_sentinel")?(a=(0,t.jsx)("p",{"data-name":"powered",children:(0,t.jsxs)("a",{href:"https://www.thevehiclewrappingcentre.com/",target:"_blank",rel:"noopener noreferrer","aria-label":"Navigate to WRPD",children:["Powered by",(0,t.jsxs)("svg",{width:"72",height:"16",viewBox:"0 0 72 16",fill:"none","aria-hidden":"true",role:"img",children:[(0,t.jsx)("path",{d:"M17.8695 15.7825H12.066L11.3043 8.56653L7.64474 15.7825H1.84592L0 0H5.54236L6.4085 7.87472L10.4075 0H15.4538L16.2217 7.9803L20.2744 0H25.869L17.871 15.7825H17.8695ZM12.6266 15.1427H17.4901L24.84 0.639811H20.6522L15.807 10.1818L14.8887 0.639811H10.7853L6.01536 10.029L4.98336 0.639811H0.703353L2.39877 15.1427H7.26696L11.7036 6.39338L12.6281 15.1427H12.6266Z",fill:"white"}),(0,t.jsx)("path",{d:"M37.1698 15.7825H31.2834L29.1964 11.9752H28.4117L27.673 15.7825H22.0615L25.1391 0H32.0144C36.0518 0 38.4613 1.97932 38.4613 5.29499C38.4613 7.98818 37.0638 10.1251 34.6144 11.2077L37.1713 15.7825H37.1698ZM31.6474 15.1427H36.0917L33.7114 10.8831L34.0538 10.7507C36.4572 9.81779 37.8363 7.82902 37.8363 5.29656C37.8363 2.33862 35.7139 0.641387 32.0144 0.641387H25.6505L22.8232 15.1443H27.1616L27.9003 11.3369H29.5619L31.6489 15.1443L31.6474 15.1427ZM30.9379 8.12528H28.5115L29.3331 3.93657H31.2543C33.1401 3.93657 33.4211 5.09958 33.4211 5.79297C33.4211 7.25382 32.4936 8.12528 30.9379 8.12528ZM29.2747 7.48547H30.9394C32.1388 7.48547 32.7992 6.88506 32.7992 5.79454C32.7992 5.27292 32.6395 4.57796 31.2558 4.57796H29.846L29.2763 7.48547H29.2747Z",fill:"white"}),(0,t.jsx)("path",{d:"M41.6886 15.7825H36.0771L39.1532 0H45.9656C50.0413 0 52.4754 1.99665 52.4754 5.33911C52.4754 9.36078 49.3502 12.0619 44.7017 12.0619H42.4073L41.6902 15.7825H41.6886ZM36.8373 15.1427H41.1757L41.8929 11.422H44.7001C49.0431 11.422 51.8504 9.03457 51.8504 5.33911C51.8504 2.3528 49.705 0.639811 45.964 0.639811H39.663L36.8373 15.1427ZM44.9535 8.12528H42.5271L43.3487 3.93657H45.2699C47.1557 3.93657 47.4368 5.09958 47.4368 5.79297C47.4368 7.25382 46.5092 8.12528 44.9535 8.12528ZM43.2888 7.48547H44.9535C46.1529 7.48547 46.8133 6.88506 46.8133 5.79454C46.8133 5.27292 46.6536 4.57796 45.2699 4.57796H43.8601L43.2904 7.48547H43.2888Z",fill:"white"}),(0,t.jsx)("path",{d:"M58.3648 15.7825H50.0781L53.1557 0H60.0725C64.9069 0 67.9107 2.58446 67.9107 6.7448C67.9107 12.1501 64.0745 15.7825 58.3648 15.7825ZM50.8414 15.1427H58.3663C63.7029 15.1427 67.2888 11.7672 67.2888 6.7448C67.2888 2.9217 64.5921 0.639811 60.074 0.639811H53.6686L50.8429 15.1427H50.8414ZM58.5337 11.8034H55.8355L57.3512 3.9807H59.5043C61.6589 3.9807 62.8936 5.098 62.8936 7.04895C62.8936 9.93756 61.1828 11.8034 58.5337 11.8034ZM56.5957 11.162H58.5337C60.8035 11.162 62.2686 9.54674 62.2686 7.04738C62.2686 5.04127 60.7651 4.62051 59.5027 4.62051H57.8611L56.5941 11.162H56.5957Z",fill:"white"}),(0,t.jsx)("path",{d:"M68.7156 15.9999C67.0201 15.9999 65.79 14.7833 65.79 13.105C65.79 11.1777 67.1799 9.77832 69.0949 9.77832C70.8318 9.77832 72.0004 10.9413 72.0004 12.6732C72.0004 14.5706 70.5876 15.9999 68.7156 15.9999ZM69.0949 10.4181C67.5407 10.4181 66.4135 11.548 66.4135 13.105C66.4135 14.4319 67.3595 15.3585 68.7156 15.3585C70.2574 15.3585 71.3754 14.2286 71.3754 12.6717C71.3754 11.3022 70.4801 10.4181 69.0949 10.4181Z",fill:"white"})]})]})}),r[1]=a):a=r[1],r[2]===Symbol.for("react.memo_cache_sentinel")?(n=(0,t.jsxs)(b,{children:[e,a,(0,t.jsx)("p",{"data-name":"siteby",children:(0,t.jsx)("a",{href:"https://12.studio",target:"_blank",rel:"noopener noreferrer","aria-label":"Navigate to 12 Studio",children:"Made by 12 Studio"})})]}),r[2]=n):n=r[2],n};_.displayName="TinyText";var E=e.i(22584);let M={position:"fixed",bottom:0,left:0,width:1,height:1,overflow:"hidden",opacity:0,pointerEvents:"none",contain:"strict"},z=e=>{let r,c,d,u,p,f,m,h,b,y,C,L,$,H,S,z,Z,G,I,A,B,P,R,q,T,D,O=(0,i.c)(51),{socials:W,heroImages:U}=e,{lenisRef:F}=(0,l.use)(a.AppContext),{menuOpen:Y,setMenuOpen:K,setMenuReady:X,navigateFromMenu:J}=(0,l.use)(n.MenuContext),[Q,V]=(0,l.useState)(!1),[ee,et]=(0,l.useState)(!1),ei=(0,l.useRef)(null),ea=(0,l.useRef)(null);O[0]!==F||O[1]!==Y?(r=()=>{let e=F.current?.lenis;if(e&&Y)return e.stop(),()=>e.start()},c=[F,Y],O[0]=F,O[1]=Y,O[2]=r,O[3]=c):(r=O[2],c=O[3]),(0,l.useEffect)(r,c),O[4]!==Y||O[5]!==K?(d=()=>{if(!Y)return;let e=e=>{"Escape"===e.key&&K(!1)};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)},u=[Y,K],O[4]=Y,O[5]=K,O[6]=d,O[7]=u):(d=O[6],u=O[7]),(0,l.useEffect)(d,u),O[8]!==Y?(p=()=>{let e=ei.current;!Y&&e?.contains(document.activeElement)&&document.querySelector(`[aria-controls="${k.MENU_ID}"]`)?.focus({preventScroll:!0})},f=[Y],O[8]=Y,O[9]=p,O[10]=f):(p=O[9],f=O[10]),(0,l.useLayoutEffect)(p,f),O[11]!==X?(m=()=>(X(!0),()=>X(!1)),h=[X],O[11]=X,O[12]=m,O[13]=h):(m=O[12],h=O[13]),(0,l.useLayoutEffect)(m,h),O[14]!==Y?(y=()=>{if(!Y)return void V(!1);V(!1);let e=requestAnimationFrame(()=>V(!0));return()=>cancelAnimationFrame(e)},b=[Y],O[14]=Y,O[15]=b,O[16]=y):(b=O[15],y=O[16]),(0,l.useLayoutEffect)(y,b),O[17]!==Q?(C=()=>{let e=ei.current;if(e){if(Q)return void e.removeAttribute("inert");e.setAttribute("inert","")}},L=[Q],O[17]=Q,O[18]=C,O[19]=L):(C=O[18],L=O[19]),(0,l.useEffect)(C,L),O[20]!==ee||O[21]!==Y?($=()=>{let e=ea.current;if(!e||!Y||ee)return;let t=t=>{t.target===e&&"opacity"===t.propertyName&&et(!0)};return e.addEventListener("transitionend",t),()=>e.removeEventListener("transitionend",t)},H=[Y,ee],O[20]=ee,O[21]=Y,O[22]=$,O[23]=H):($=O[22],H=O[23]),(0,l.useEffect)($,H),O[24]===Symbol.for("react.memo_cache_sentinel")?(S=[{label:"Builds",href:"/builds",aria:"Navigate to Builds"},{label:"Stock",href:"/stock",aria:"Navigate to Stock"},{label:"Contact",href:"/contact",aria:"Navigate to Contact"}],O[24]=S):S=O[24];let en=S;return O[25]===Symbol.for("react.memo_cache_sentinel")?(z=(0,t.jsx)(x,{}),O[25]=z):z=O[25],O[26]!==ee||O[27]!==U?(Z=ee&&U?(0,t.jsx)("div",{style:M,"aria-hidden":"true",children:[U.builds,U.stock,U.contact].map((e,i)=>{let a=(0,o.resolveImageWithAlt)(e?.desktop),n=(0,o.resolveImageWithAlt)(e?.mobile);return a&&n?(0,t.jsx)(s.default,{desktop:a,mobile:n,fill:!0,sizes:"100vw",loading:"eager"},en[i]?.href??i):null})}):null,O[26]=ee,O[27]=U,O[28]=Z):Z=O[28],O[29]!==ee||O[30]!==J?(G=(0,t.jsx)("ul",{"data-name":"pages",children:en.map(e=>{let{label:i,href:a,aria:n}=e;return(0,t.jsx)("li",{children:(0,t.jsx)(w,{label:i,href:a,aria:n,prefetch:ee,onNavigate:J})},i)})}),O[29]=ee,O[30]=J,O[31]=G):G=O[31],O[32]!==J?(I=(0,t.jsx)("li",{children:(0,t.jsx)(w,{label:"Legal",href:E.LEGAL_PATH,aria:"Legal",onNavigate:J})}),O[32]=J,O[33]=I):I=O[33],O[34]===Symbol.for("react.memo_cache_sentinel")?(A=(0,t.jsx)("li",{children:(0,t.jsx)(j,{})}),O[34]=A):A=O[34],O[35]!==I?(B=(0,t.jsxs)("ul",{"data-name":"legals",children:[I,A]}),O[35]=I,O[36]=B):B=O[36],O[37]!==W?(P=W.map(N),O[37]=W,O[38]=P):P=O[38],O[39]!==P?(R=(0,t.jsx)("ul",{"data-name":"socials",children:P}),O[39]=P,O[40]=R):R=O[40],O[41]===Symbol.for("react.memo_cache_sentinel")?(q=(0,t.jsx)(_,{}),O[41]=q):q=O[41],O[42]!==Q||O[43]!==G||O[44]!==B||O[45]!==R?(T=(0,t.jsxs)(v,{ref:ea,$isOpen:Q,children:[G,B,R,q]}),O[42]=Q,O[43]=G,O[44]=B,O[45]=R,O[46]=T):T=O[46],O[47]!==Q||O[48]!==Z||O[49]!==T?(D=(0,t.jsxs)(g,{ref:ei,id:k.MENU_ID,"aria-label":"Menu",$isOpen:Q,children:[z,Z,T]}),O[47]=Q,O[48]=Z,O[49]=T,O[50]=D):D=O[50],D};function N(e){let{type:i,url:a}=e;return(0,t.jsx)("li",{children:(0,t.jsx)("a",{href:a,target:"_blank",rel:"noopener noreferrer","aria-label":i,children:(0,t.jsx)(r.default,{type:i})})},i)}z.displayName="Menu",e.s(["default",0,z],32485)},89835,e=>{"use strict";var t=e.i(843476),i=e.i(500932),a=e.i(481293),n=e.i(180301),r=e.i(657688),l=e.i(402463),s=e.i(328852),o=e.i(271645),c=e.i(174080);let d=Number.parseInt(n.grid.breakpoints.l??"1024",10),u=(0,o.forwardRef)((e,n)=>{let o,u,p,f,m,h,g,v,b,y,x,C,L,$,H,w,j,k,S,_,E,M,z,N,Z,G,I=(0,i.c)(62);I[0]!==e?({desktop:p,mobile:h,fill:f,width:H,height:m,sizes:y,quality:b,enabled:x,preload:v,loading:C,desktopMinWidth:L,desktopInLandscape:$,className:o,crossOrigin:u,...g}=e,I[0]=e,I[1]=o,I[2]=u,I[3]=p,I[4]=f,I[5]=m,I[6]=h,I[7]=g,I[8]=v,I[9]=b,I[10]=y,I[11]=x,I[12]=C,I[13]=L,I[14]=$,I[15]=H):(o=I[1],u=I[2],p=I[3],f=I[4],m=I[5],h=I[6],g=I[7],v=I[8],b=I[9],y=I[10],x=I[11],C=I[12],L=I[13],$=I[14],H=I[15]);let A=void 0===x||x,B=void 0===C?"lazy":C,P=void 0===L?d:L,R=void 0!==$&&$;if(I[16]!==o||I[17]!==u||I[18]!==p||I[19]!==R||I[20]!==P||I[21]!==A||I[22]!==f||I[23]!==m||I[24]!==B||I[25]!==h||I[26]!==g||I[27]!==v||I[28]!==b||I[29]!==n||I[30]!==y||I[31]!==H){z=Symbol.for("react.early_return_sentinel");e:{if(E=(0,a.resolveImageWithAlt)(p),M=(0,a.resolveImageWithAlt)(h),!E||!M){z=null;break e}_=f?{fill:!0}:{width:H??M.width??1200,height:m??M.height??675},j=f?{}:{width:H??E.width??1200,height:m??E.height??675};let e={sizes:y,quality:b,preload:v,loader:l.imageLoader,..._};if(E.src===M.src){z=(0,t.jsx)("picture",{ref:n,className:o,...g,children:(0,t.jsx)(s.default,{enabled:A,image:E,sizes:y,quality:b,preload:v,loading:B,crossOrigin:u,..._})});break e}w=`(min-width: ${P}px)${R?", (orientation: landscape)":""}`;let i=`(max-width: ${P-1}px)${R?" and (orientation: portrait)":""}`,{props:d}=(0,r.getImageProps)({...e,src:E.src,alt:E.alt});if({srcSet:S,sizes:k}=d,v&&A){let{props:t}=(0,r.getImageProps)({...e,src:M.src,alt:M.alt}),{srcSet:a,sizes:n}=t;(0,c.preload)(E.src,{as:"image",fetchPriority:"high",imageSrcSet:S,imageSizes:k,media:w}),(0,c.preload)(M.src,{as:"image",fetchPriority:"high",imageSrcSet:a,imageSizes:n,media:i})}}I[16]=o,I[17]=u,I[18]=p,I[19]=R,I[20]=P,I[21]=A,I[22]=f,I[23]=m,I[24]=B,I[25]=h,I[26]=g,I[27]=v,I[28]=b,I[29]=n,I[30]=y,I[31]=H,I[32]=w,I[33]=j,I[34]=k,I[35]=S,I[36]=_,I[37]=E,I[38]=M,I[39]=z}else w=I[32],j=I[33],k=I[34],S=I[35],_=I[36],E=I[37],M=I[38],z=I[39];if(z!==Symbol.for("react.early_return_sentinel"))return z;I[40]!==w||I[41]!==j||I[42]!==k||I[43]!==S||I[44]!==A?(N=A?(0,t.jsx)("source",{media:w,srcSet:S,sizes:k,...j}):null,I[40]=w,I[41]=j,I[42]=k,I[43]=S,I[44]=A,I[45]=N):N=I[45];let q=v||"eager"===B?"eager":"lazy",T=v?"high":void 0;return I[46]!==u||I[47]!==A||I[48]!==_||I[49]!==b||I[50]!==E.lqip||I[51]!==M||I[52]!==y||I[53]!==q||I[54]!==T?(Z=(0,t.jsx)(s.default,{enabled:A,image:M,desktopPlaceholder:E.lqip,sizes:y,quality:b,loading:q,fetchPriority:T,crossOrigin:u,..._}),I[46]=u,I[47]=A,I[48]=_,I[49]=b,I[50]=E.lqip,I[51]=M,I[52]=y,I[53]=q,I[54]=T,I[55]=Z):Z=I[55],I[56]!==o||I[57]!==g||I[58]!==n||I[59]!==N||I[60]!==Z?(G=(0,t.jsxs)("picture",{ref:n,className:o,...g,children:[N,Z]}),I[56]=o,I[57]=g,I[58]=n,I[59]=N,I[60]=Z,I[61]=G):G=I[61],G});u.displayName="ResponsiveImage",e.s(["default",0,u])}]);