(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,794635,e=>{"use strict";var t=e.i(843476),r=e.i(500932),i=e.i(156569),n=e.i(124821),o=e.i(375476),a=e.i(481293),l=e.i(992325),s=e.i(494473),c=e.i(867308),d=e.i(989970),u=e.i(255667),f=e.i(328852),p=e.i(271645),h=e.i(607561),g=e.i(575509),m=e.i(212960),v=e.i(997053);let b=(0,v.default)(g.Div).attrs({as:"section"}).withConfig({componentId:"sc-e85696e3-0"})(()=>v.css`
		/* NOTE • Exactly one viewport tall, not min-height. StickyTrack's aperture
		   clips this box with a percentage inset(), so the box has to match the
		   viewport for the clip to reach its edges and no further. A min-height
		   (or the old 120dvh) would make inset(0) crop the overflow permanently
		   rather than reveal it. */
		position: relative;
		z-index: 2;

		width: 100%;
		height: 100dvh;
		overflow: clip;

		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		gap: ${(0,g.getGap)("m")};
		padding-block: ${(0,g.getGap)("huge")};

		${g.bp.l`
			justify-content: space-between;
			padding-block: ${(0,g.getGap)("col")};
		`}


        [data-level='top'] {
            
        }

        [data-level='bottom'] {
            row-gap: ${(0,g.getGap)("l")};
        }
	`),x=v.default.div.withConfig({componentId:"sc-e85696e3-1"})(()=>v.css`
		position: absolute;
		inset: 0;
		z-index: -1;
		overflow: clip;
        background: ${(0,g.getGlobal)("black")};
	`),y=v.default.div.withConfig({componentId:"sc-e85696e3-2"})(()=>v.css`
		position: absolute;
		top: -20%;
		left: 0;
		right: 0;
		height: 140%;
		z-index: 1;
		transform: translateZ(0);
		backface-visibility: hidden;

		& > span {
			position: absolute !important;
			inset: 0 !important;
			width: 100% !important;
			height: 100% !important;
		}

		img {
			display: block;
			object-fit: cover;
			width: 100%;
			height: 100%;
			pointer-events: none;
			transform: translateZ(0);
		}
	`),w=(0,v.default)(g.Div).withConfig({componentId:"sc-e85696e3-3"})(()=>v.css`

		h2 {
			${m.headlineL}

			text-wrap: balance;
			color: ${(0,g.getGlobal)("white")};
		}
	`),T=(0,v.default)(g.Div).withConfig({componentId:"sc-e85696e3-4"})(()=>v.css`
	
	`),E=(0,v.default)(g.Div).withConfig({componentId:"sc-e85696e3-5"})(({theme:e})=>v.css`
		--offset: calc(${e.grid.gutter.s});

        padding-inline: var(--offset);
		display: flex;
		flex-direction: column;
		gap: ${(0,g.getGap)("m")};
		text-wrap: balance;

		${g.bp.m`
			--offset: calc(${e.grid.gutter.m} / 2);
		`}

		${g.bp.l`
			--offset: calc(${e.grid.gutter.l} / 2);
		`}
    `),S=(0,v.default)(g.Div).attrs({as:"p"}).withConfig({componentId:"sc-e85696e3-6"})(()=>v.css`
		${m.bodyL}

		color: ${(0,g.getGlobal)("white",80)};
		text-wrap: balance;
	`),R=e=>{let i,n,o,a=(0,r.c)(7),{image:l}=e,s=(0,p.useRef)(null),g=(0,p.useRef)(null),m=(0,u.useLenis)();a[0]!==m?.rootElement?(i=e=>{let{isDesktop:t}=e,r=s.current,i=g.current,n=m?.rootElement;if(!r||!i||!n)return;let o=()=>t?0:n.clientHeight,a=()=>(e=>{let t=0,r=e;for(;r;)t+=r.offsetTop,r=r.offsetParent;return t})(r)+(t?c.APPROACH_HOLD_PX:0)-o(),l=d.default.fromTo(i,{yPercent:0},{yPercent:t?25:24,ease:"none",scrollTrigger:{scroller:n,start:a,end:()=>a()+o()+r.offsetHeight,scrub:!0,invalidateOnRefresh:!0}});return()=>{l.scrollTrigger?.kill(),l.kill()}},a[0]=m?.rootElement,a[1]=i):i=a[1];let v=l?.src;return(a[2]!==m||a[3]!==v?(n={scope:s,dependencies:[v,m]},a[2]=m,a[3]=v,a[4]=n):n=a[4],(0,h.useAnimation)(i,n),l?.src)?(a[5]!==l?(o=(0,t.jsx)(x,{ref:s,children:(0,t.jsx)(y,{ref:g,children:(0,t.jsx)(f.default,{image:l,fill:!0,sizes:"100vw",preload:!0})})}),a[5]=l,a[6]=o):o=a[6],o):null};R.displayName="Background";let A=e=>{let c,d,u,f,p,h,g,m,v,x,y,A=(0,r.c)(26),{heading:$,description:C,backgroundImage:I,logos:L,documentId:_,documentType:k}=e;A[0]!==I?(c=(0,a.resolveImageWithAlt)(I),A[0]=I,A[1]=c):c=A[1];let j=c;A[2]!==_||A[3]!==k?(d=(0,l.sanityEditAttr)({id:_,type:k,path:"approachHeading"}),A[2]=_,A[3]=k,A[4]=d):d=A[4];let P=d;return A[5]!==j?(u=(0,t.jsx)(R,{image:j}),A[5]=j,A[6]=u):u=A[6],A[7]!==$?(f=(0,t.jsx)("h2",{children:$}),A[7]=$,A[8]=f):f=A[8],A[9]!==P||A[10]!==f?(p=(0,t.jsx)(s.default,{"data-level":"top",children:(0,t.jsx)(w,{$l:"2/7",children:(0,t.jsx)(i.default,{editAttr:P,children:f})})}),A[9]=P,A[10]=f,A[11]=p):p=A[11],A[12]!==L?(h=(0,t.jsx)(T,{$l:"1/8",$xl:"1/9",children:(0,t.jsx)(o.default,{logos:L})}),A[12]=L,A[13]=h):h=A[13],A[14]!==C?(g=(0,t.jsx)(S,{children:C}),A[14]=C,A[15]=g):g=A[15],A[16]===Symbol.for("react.memo_cache_sentinel")?(m=(0,t.jsx)(n.default,{to:"/contact",label:"Start Your Project",aria:"Go to Contact"}),A[16]=m):m=A[16],A[17]!==g?(v=(0,t.jsxs)(E,{$l:"8/12",$xl:"9/12",children:[g,m]}),A[17]=g,A[18]=v):v=A[18],A[19]!==h||A[20]!==v?(x=(0,t.jsxs)(s.default,{"data-level":"bottom",$noMargin:!0,$noGutter:!0,children:[h,v]}),A[19]=h,A[20]=v,A[21]=x):x=A[21],A[22]!==x||A[23]!==u||A[24]!==p?(y=(0,t.jsxs)(b,{children:[u,p,x]}),A[22]=x,A[23]=u,A[24]=p,A[25]=y):y=A[25],y};A.displayName="Approach",e.s(["default",0,A],794635)},419762,e=>{"use strict";var t=e.i(843476),r=e.i(500932),i=e.i(156569),n=e.i(481293),o=e.i(948025),a=e.i(189897),l=e.i(607561),s=e.i(494473),c=e.i(989970),d=e.i(255667),u=e.i(328852),f=e.i(271645),p=e.i(575509),h=e.i(212960),g=e.i(997053);let m=(0,g.default)(p.Div).attrs({as:"section"}).withConfig({componentId:"sc-dd0c2790-0"})(()=>g.css`
        --single-col: ${(0,p.getGap)("col")};
        --double-col: calc(${(0,p.getGap)("col")} * 2);

        position: relative;
        z-index: 2;
        padding-block: ${(0,p.getGap)("huge")};
        

        width: 100%;
        min-height: 100dvh;
        overflow: clip;

        background: ${(0,p.getGlobal)("black")};

        ${p.bp.l`
            padding-block: var(--double-col);
        `}

        [data-placement='top'] {
            position: sticky;
            top: ${(0,p.getGap)("huge")};
            left: 0;
            z-index: -1;

            ${p.bp.l`
                top: calc(var(--single-col) * 2);
            `}
        }
    `),v=(0,g.default)(p.Div).withConfig({componentId:"sc-dd0c2790-1"})(()=>g.css`
        position: absolute;
        inset: 0;
        z-index: -1;
        overflow: clip;
        background: ${(0,p.getGlobal)("black")};
        opacity: 0.4;

        figure {
            position: sticky;
            z-index: 2;
            top: 0; left: 0;
            width: 100%;
            height: 100dvh;
            background: linear-gradient(to bottom, ${(0,p.getGlobal)("black",90)} 0%, transparent 100%);
            transform: translateZ(0);
        }
    `),b=(0,g.default)(p.Div).withConfig({componentId:"sc-dd0c2790-2"})(()=>g.css`
        position: absolute;
        inset: 0;
        transform: translateZ(0);
        backface-visibility: hidden;

        svg {
            display: block;
            width: 100%;
            height: 100%;
        }
    `),x=(0,g.default)(p.Div).attrs({as:"div"}).withConfig({componentId:"sc-dd0c2790-3"})(({theme:e})=>g.css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center; 
        gap: ${(0,p.getGap)("s")};


        h2, em {
            ${h.headlineL}

            text-wrap: balance;
            text-transform: unset;

            ${p.bp.l`
                ${h.displayL}
            `}

            span { display: block  }
        }

        em {
            font-style: normal;
        }

        p {
            ${h.bodyL}

            text-wrap: balance;
            color: ${(0,p.getBrand)("bc5",80)};

            ${p.bp.xl` max-width: calc(8.333vw * 4 - ${e.grid.gutter.l}); `}
        }
    `),y=(0,g.default)(p.Div).withConfig({componentId:"sc-dd0c2790-4"})(()=>g.css`
        position: relative;
        margin-block: ${(0,p.getGap)("l")};
        user-select: none;
        pointer-events: none;

        ${p.bp.l`
            margin-block: var(--single-col);
        `}

        picture {
            --width: 85vw;
            --buffer: 5vw;
            --half-width: calc(var(--width) / 2);

            display: block;
            position: relative;

            margin: 0 auto;
            width: var(--width);
            aspect-ratio: 707/1402;

            ${p.bp.l` --width: 50vw; `}

            ${p.bp.xl`
                --buffer: 10vw;
                --width: 70.7rem;
            `}

            &[data-car='main'] {
                position: relative;
                z-index: 1;
            }

            &[data-car='side'] {
                display: none;
                
                ${p.bp.l`
                    display: block;
                    position: absolute;
                    top: 25%;
                `}
            }

            &[data-side='left'] {
                right: calc(var(--width) + var(--half-width) + var(--buffer));
            }

            &[data-side='right'] {
                left: calc(var(--width) + var(--half-width) + var(--buffer));
            }

            img {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
                object-position: center top;
            }
        }
    `);e.s(["Background",0,v,"BackgroundParallax",0,b,"Cars",0,y,"Content",0,x,"Jacket",0,m],448578);let w=(0,f.forwardRef)((e,i)=>{let n,o,a,l,s,c,d,u,p=(0,r.c)(22),{src:h,tileSize:g,opacity:m}=e,x=void 0===g?740:g,y=void 0===m?1:m,w=(0,f.useRef)(null),T=(0,f.useId)();if(p[0]!==T){let e;p[2]===Symbol.for("react.memo_cache_sentinel")?(e=/:/g,p[2]=e):e=p[2],n=T.replace(e,""),p[0]=T,p[1]=n}else n=p[1];let E=`builds-intro-pattern-${n}`;p[3]!==i?(o=e=>{(w.current=e,"function"==typeof i)?i(e):i&&(i.current=e)},p[3]=i,p[4]=o):o=p[4];let S=o;if(!h)return null;p[5]===Symbol.for("react.memo_cache_sentinel")?(a=(0,t.jsx)("figure",{}),p[5]=a):a=p[5],p[6]!==h||p[7]!==x?(l=(0,t.jsx)("image",{href:h,width:x,height:x,preserveAspectRatio:"xMidYMid slice"}),p[6]=h,p[7]=x,p[8]=l):l=p[8],p[9]!==E||p[10]!==l||p[11]!==x?(s=(0,t.jsx)("defs",{children:(0,t.jsx)("pattern",{id:E,patternUnits:"userSpaceOnUse",width:x,height:x,children:l})}),p[9]=E,p[10]=l,p[11]=x,p[12]=s):s=p[12];let R=`url(#${E})`;return p[13]!==y||p[14]!==R?(c=(0,t.jsx)("rect",{width:"100%",height:"100%",fill:R,opacity:y}),p[13]=y,p[14]=R,p[15]=c):c=p[15],p[16]!==c||p[17]!==s?(d=(0,t.jsxs)("svg",{width:"100%",height:"100%",preserveAspectRatio:"none","aria-hidden":!0,role:"presentation",children:[s,c]}),p[16]=c,p[17]=s,p[18]=d):d=p[18],p[19]!==S||p[20]!==d?(u=(0,t.jsxs)(v,{"aria-hidden":!0,children:[a,(0,t.jsx)(b,{ref:S,children:d})]}),p[19]=S,p[20]=d,p[21]=u):u=p[21],u});w.displayName="BuildsIntroductionBackground";var T=e.i(448578);let E=e=>{let p,h,g,m,v,b,x,y,E,S,R,A,$,C,I,L,_,k,j=(0,r.c)(45),{line1:P,line2:D,description:H,backgroundImage:O,image:M,leftCarImage:z,rightCarImage:N}=e,G=(0,n.resolveImageWithAlt)(O);j[0]!==M?(p=(0,n.resolveImageWithAlt)(M),j[0]=M,j[1]=p):p=j[1];let F=p;j[2]!==z?(h=(0,n.resolveImageWithAlt)(z),j[2]=z,j[3]=h):h=j[3];let U=h;j[4]!==N?(g=(0,n.resolveImageWithAlt)(N),j[4]=N,j[5]=g):g=j[5];let B=g,W=(0,f.useRef)(null),X=(0,f.useRef)(null),V=(0,f.useRef)(null),q=(0,f.useRef)(null),Y=(0,f.useRef)(null),K=(0,f.useRef)(null),J=(0,f.useRef)(null),Z=(0,f.useRef)(null),Q=(0,d.useLenis)();j[6]!==P?(m=(0,a.cleanSanityString)(P),j[6]=P,j[7]=m):m=j[7];let ee=m;j[8]!==D?(v=(0,a.cleanSanityString)(D),j[8]=D,j[9]=v):v=j[9];let et=v;j[10]!==H?(b=(0,a.cleanSanityString)(H),j[10]=H,j[11]=b):b=j[11];let er=b;if(j[12]!==Q?.rootElement?(x=e=>{let{isDesktop:t}=e,r=W.current,i=Q?.rootElement,n=V.current,o=q.current,a=Y.current,l=K.current,s=X.current,d=J.current,u=Z.current;r&&i&&n&&o&&a&&l&&s&&d&&u&&(c.default.to(n,{scale:.75,autoAlpha:0,ease:"none",scrollTrigger:{trigger:r,scroller:i,start:"top top",end:"center top",scrub:!0,markers:!1}}),t&&c.default.from(d,{y:"-50dvh",scale:.75,ease:"none",scrollTrigger:{trigger:u,scroller:i,start:"top-=50% 100%",end:"center 60%",scrub:.2,markers:!1}}),c.default.to(o,{yPercent:-55,ease:"none",scrollTrigger:{trigger:l,scroller:i,start:"top bottom",end:"center top",scrub:.2}}),c.default.to(a,{yPercent:-50,ease:"none",scrollTrigger:{trigger:l,scroller:i,start:"top bottom",end:"bottom top",scrub:.2}}),c.default.set(s,{yPercent:-10}),c.default.to(s,{yPercent:20,ease:"none",scrollTrigger:{trigger:r,scroller:i,start:"top bottom",end:"bottom top",scrub:!0,markers:!1}}))},j[12]=Q?.rootElement,j[13]=x):x=j[13],j[14]!==Q?(y={scope:W,dependencies:[Q]},j[14]=Q,j[15]=y):y=j[15],(0,l.useAnimation)(x,y),!F||!U||!B||!ee||!et||!er||!G)return null;let ei=(0,o.imageRenditionSrc)(G.image,"pattern")??void 0;return j[16]!==w||j[17]!==G.alt||j[18]!==ei?(E=(0,t.jsx)(w,{ref:X,src:ei,alt:G.alt}),j[16]=w,j[17]=G.alt,j[18]=ei,j[19]=E):E=j[19],j[20]!==ee?(S=(0,t.jsx)(s.default,{"data-placement":"top",ref:V,children:(0,t.jsx)(T.Content,{$l:"5/9",children:(0,t.jsx)(i.default,{children:(0,t.jsx)("em",{children:ee})})})}),j[20]=ee,j[21]=S):S=j[21],j[22]!==U?(R=(0,t.jsx)("picture",{"data-car":"side","data-side":"left",ref:q,children:(0,t.jsx)(u.default,{image:U,fill:!0,sizes:"(min-width: 1024px) 35vw, 50vw"})}),j[22]=U,j[23]=R):R=j[23],j[24]!==F?(A=(0,t.jsx)("picture",{"data-car":"main",children:(0,t.jsx)(u.default,{image:F,fill:!0,sizes:"(min-width: 1024px) 70.7rem, 100vw"})}),j[24]=F,j[25]=A):A=j[25],j[26]!==B?($=(0,t.jsx)("picture",{"data-car":"side","data-side":"right",ref:Y,children:(0,t.jsx)(u.default,{image:B,fill:!0,sizes:"(min-width: 1024px) 35vw, 50vw"})}),j[26]=B,j[27]=$):$=j[27],j[28]!==R||j[29]!==A||j[30]!==$?(C=(0,t.jsxs)(T.Cars,{ref:K,children:[R,A,$]}),j[28]=R,j[29]=A,j[30]=$,j[31]=C):C=j[31],j[32]!==et?(I=(0,t.jsx)(i.default,{children:(0,t.jsx)("h2",{children:et})}),j[32]=et,j[33]=I):I=j[33],j[34]!==er?(L=(0,t.jsx)("p",{children:er}),j[34]=er,j[35]=L):L=j[35],j[36]!==I||j[37]!==L?(_=(0,t.jsx)(s.default,{"data-placement":"bottom",ref:Z,children:(0,t.jsxs)(T.Content,{$l:"4/10",$huge:"3/11",ref:J,children:[I,L]})}),j[36]=I,j[37]=L,j[38]=_):_=j[38],j[39]!==E||j[40]!==S||j[41]!==C||j[42]!==_||j[43]!==T.Jacket?(k=(0,t.jsxs)(T.Jacket,{ref:W,children:[E,S,C,_]}),j[39]=E,j[40]=S,j[41]=C,j[42]=_,j[43]=T.Jacket,j[44]=k):k=j[44],k};E.displayName="BuildsIntroduction",e.s(["default",0,E],419762)},601969,e=>{"use strict";var t=e.i(843476),r=e.i(500932),i=e.i(322208),n=e.i(867308),o=e.i(992325),a=e.i(494473),l=e.i(271645),s=e.i(383520),c=e.i(478430),d=e.i(831119),u=e.i(101384),f=e.i(456393),p=e.i(297788),h=e.i(989970),g=e.i(575509),m=e.i(212960),v=e.i(997053);let b=(0,v.default)(g.Div).attrs({as:"section"}).withConfig({componentId:"sc-12ea9db1-0"})(()=>v.css`	
		/* NOTE • height: 100dvh, matching Introduction's Jacket exactly. This used
		   to be min-height: 60rem, which the root font-size steps scale to 600 /
		   660 / 720px — so on a short window the stage grew taller than the
		   viewport and drawCoverFrame centred the frame in a taller box than the
		   Introduction's. The hero's last frame and the intro's first frame are
		   the same image, but they landed ~10px apart. The extra height bought
		   nothing either way: StickyTrack's Content is 100dvh with overflow:
		   clip, so anything past one viewport was never visible. */
		position: absolute;
		z-index: 2;
		inset: 0;
		width: 100%;
		height: 100dvh;
		overflow: hidden;
		pointer-events: none;

		/* NOTE • The layer stays a non-interactive overlay, but the editable copy
		   must remain hit-testable: Sanity's Visual Editing finds its overlay
		   targets with elementsFromPoint, and an inherited pointer-events: none
		   removes an element from that hit test entirely — the hero title and
		   description carried valid data-sanity attributes yet could never be
		   clicked in Presentation. Scroll is unaffected: wheel and touch events
		   bubble up from the text to Lenis all the same. */
		[data-sanity] {
			pointer-events: auto;
		}

		[data-text] {
			--offset: ${(0,g.getGap)("xxl")};
			--offset-top: calc((${(0,g.getGap)("l")}	* 2) + 3.2rem);

			position: absolute;
			left: 0; right: 0;

			${g.bp.l`
				--offset-top: calc((${(0,g.getGap)("xl")}	 * 2) + 3.2rem);
			`}	
		}


		[data-text='top'] {
			top: 0;
			height: 50svh;
			align-items: center;
			padding-top: var(--offset-top);

			${g.bp.l`
				align-items: flex-start;
			
				@media (min-height: 800px) {
					align-items: center;
				}
			`}
		}

		[data-text='bottom'] {
			bottom: 0;
			padding-bottom: var(--offset);
		}
	`),x=v.default.div.withConfig({componentId:"sc-12ea9db1-1"})(({$visible:e=!0})=>v.css`
		position: absolute;
		inset: 0;
		opacity: ${+!!e};
		visibility: ${e?"visible":"hidden"};
	`),y=v.default.canvas.withConfig({componentId:"sc-12ea9db1-2"})(()=>v.css`
		display: block;
		width: 100%;
		height: 100%;
	`),w=(0,v.default)(g.Div).attrs({as:"h1"}).withConfig({componentId:"sc-12ea9db1-3"})(()=>v.css`
		text-align: center;
		text-wrap: balance;
		visibility: hidden;
		opacity: 0;


		/* Custom for the hero */
		font-family: ${(0,g.getFont)("heading")};
		text-transform: capitalize;
		font-weight: ${(0,g.getFontWeight)("ultralight")};
		font-size: 6.4rem;
		line-height: 1.2;
		letter-spacing: -0.2rem;

		${g.bp.sm` font-size: 7.2rem `}

		${g.bp.l` font-size: clamp(7.2rem, 10dvh, 9.6rem)`}
	`),T=(0,v.default)(g.Div).attrs({as:"p"}).withConfig({componentId:"sc-12ea9db1-4"})(()=>v.css`
	${m.bodyL}

	text-align: center;
	text-wrap: balance;
	visibility: hidden;
	opacity: 0;
`),E="sine.inOut",S=()=>{let e,o,a,g,m,v,b,w,T,S,A,$,C,I=(0,r.c)(38),{loaderMounted:L}=(0,l.use)(c.LoaderContext),{menuOpen:_}=(0,l.use)(d.MenuContext),{isReducedMotion:k,devicePixelRatio:j}=(0,l.use)(u.PerformanceContext),{activeFrameRef:P,heroVideoLoadState:D,isRuntimeReady:H,setHeroPlaybackComplete:O,isHeroPlaybackComplete:M,isIntroFrameReady:z,setHeroFrameSettled:N}=(0,l.use)(s.HeroVideoContext),{getProgress:G,subscribe:F,getIntroSegmentProgress:U}=(0,i.useStickyTrackStore)(),B=(0,l.useRef)(_),W=(0,l.useRef)(null),X=(0,l.useRef)(null),V=(0,l.useRef)(null),q=(0,l.useRef)(null),Y=(0,l.useRef)(null),K=(0,l.useRef)(0),J=(0,l.useRef)(0),Z=(0,l.useRef)(!1),Q=(0,l.useRef)(!0),[ee,et]=(0,l.useState)(!1),[er,ei]=(0,l.useState)(!1),en=(0,l.useRef)(!1),eo="ready"===D;I[0]!==j?(e=()=>{let e=X.current,t=W.current;if(!e||!t)return!1;let r=Math.min(j,2),{clientWidth:i,clientHeight:n}=t;if(!i||!n)return!1;e.width=Math.round(i*r),e.height=Math.round(n*r),e.style.width=`${i}px`,e.style.height=`${n}px`;let o=e.getContext("2d");return!!o&&(V.current=o,o.setTransform(r,0,0,r,0,0),!0)},I[0]=j,I[1]=e):e=I[1];let ea=e;I[2]!==P||I[3]!==ea?(o=()=>{cancelAnimationFrame(J.current),J.current=requestAnimationFrame(()=>{if(!ea())return;let e=P.current;e&&(0,f.forceRedrawFrame)(e,K.current)})},I[2]=P,I[3]=ea,I[4]=o):o=I[4];let el=o;return(I[5]!==G||I[6]!==_?(a=()=>{B.current=_,_?q.current?.pause():(0,n.shouldPauseHeroPlayback)(G())||q.current?.play()},g=[_,G],I[5]=G,I[6]=_,I[7]=a,I[8]=g):(a=I[7],g=I[8]),(0,l.useLayoutEffect)(a,g),I[9]===Symbol.for("react.memo_cache_sentinel")?(m=()=>{et((0,p.canUseWebCodecs)())},v=[],I[9]=m,I[10]=v):(m=I[9],v=I[10]),(0,l.useEffect)(m,v),I[11]!==P||I[12]!==el||I[13]!==ee||I[14]!==H||I[15]!==eo||I[16]!==ea?(b=()=>{if(!H||!ee||!eo)return;let e=X.current,t=P.current;if(!e||!t)return;let r=null;return ea()&&(t.process=e=>{let t=V.current,r=W.current;t&&r&&(0,f.drawCoverFrame)(t,e,r.clientWidth,r.clientHeight)},K.current=0,(0,f.forceRedrawFrame)(t,0),ei(!0),r=new ResizeObserver(el),W.current&&r.observe(W.current),window.addEventListener("resize",el)),()=>{cancelAnimationFrame(J.current),window.removeEventListener("resize",el),ei(!1),V.current=null,r?.disconnect(),t.process=R}},w=[P,el,ee,H,eo,ea],I[11]=P,I[12]=el,I[13]=ee,I[14]=H,I[15]=eo,I[16]=ea,I[17]=b,I[18]=w):(b=I[17],w=I[18]),(0,l.useLayoutEffect)(b,w),I[19]!==P||I[20]!==G||I[21]!==L||I[22]!==er||I[23]!==k||I[24]!==O||I[25]!==F?(T=()=>{if(L||k||!er)return;let e=P.current;if(!e?.manifest)return void O(!0);let{totalFrames:t}=e.manifest;if(t<=1)return void O(!0);let r={frame:0},i=t-1;en.current=!1,Z.current=!1,O(!1),K.current=0,(0,f.forceRedrawFrame)(e,0),Q.current=!0,Y.current?.kill(),Y.current=null;let o=W.current;o&&(o.style.visibility="visible",h.default.set(o,{opacity:1}));let a=()=>{en.current||(en.current=!0,Z.current=!0,K.current=i,e.setFrame(i),O(!0),q.current?.kill(),q.current=null)};q.current=h.default.to(r,{frame:i,paused:B.current,duration:2,ease:"none",onUpdate:()=>{if(B.current||(0,n.shouldPauseHeroPlayback)(G()))return void q.current?.pause();let t=Math.round(r.frame);K.current=t;try{e.setFrame(t)}catch{a();return}t>=i&&a()},onComplete:a});let l=()=>{if(q.current&&!en.current){if(B.current||(0,n.shouldPauseHeroPlayback)(G()))return void q.current.pause();q.current.play()}};l();let s=F(l);return()=>{s(),q.current?.kill(),q.current=null}},S=[P,G,L,er,k,O,F],I[19]=P,I[20]=G,I[21]=L,I[22]=er,I[23]=k,I[24]=O,I[25]=F,I[26]=T,I[27]=S):(T=I[26],S=I[27]),(0,l.useEffect)(T,S),I[28]!==U||I[29]!==G||I[30]!==M||I[31]!==z||I[32]!==k||I[33]!==N||I[34]!==F?(A=()=>{let e=()=>{let e=U(G())>0,t=M||Z.current,r=!z||!t&&!e,i=W.current;if(!i||Q.current===r)return;Q.current=r,Y.current?.kill();let n=.3*!k;if(r){N(!1),i.style.visibility="visible",Y.current=h.default.to(i,{opacity:1,duration:n,ease:E,overwrite:!0});return}Y.current=h.default.to(i,{opacity:0,duration:n,ease:E,overwrite:!0,onComplete:()=>{Q.current||(i.style.visibility="hidden",N(!0))}})};e();let t=F(e);return()=>{t(),Y.current?.kill(),Y.current=null,N(!1)}},$=[U,G,M,z,k,F,N],I[28]=U,I[29]=G,I[30]=M,I[31]=z,I[32]=k,I[33]=N,I[34]=F,I[35]=A,I[36]=$):(A=I[35],$=I[36]),(0,l.useEffect)(A,$),ee&&H&&"unsupported"!==D&&"error"!==D)?(I[37]===Symbol.for("react.memo_cache_sentinel")?(C=(0,t.jsx)(x,{ref:W,"aria-hidden":"true",children:(0,t.jsx)(y,{ref:X})}),I[37]=C):C=I[37],C):null};function R(){}S.displayName="Background";var A=e.i(486861),$=e.i(189897),C=e.i(607561),I=e.i(797489),L=e.i(274879),_=e.i(448806),k=e.i(875324),j=e.i(221781);let P=e=>{h.default.set(e,{autoAlpha:1,yPercent:0,willChange:"auto"})},D=e=>{let n,o,a,s,f,p,g,m,v,b,x=(0,r.c)(36),{description:y,editAttr:w}=e,{loaderMounted:E}=(0,l.use)(c.LoaderContext),{menuVisible:S}=(0,l.use)(d.MenuContext),{isReducedMotion:R}=(0,l.use)(u.PerformanceContext),{getProgress:D,subscribe:H,getHeroTextSegmentProgress:O}=(0,i.useStickyTrackStore)(),M=(0,_.usePageTransitioning)(),z=(0,l.useRef)(null);x[0]===Symbol.for("react.memo_cache_sentinel")?(n=[],x[0]=n):n=x[0];let N=(0,l.useRef)(n),G=(0,l.useRef)(!1),F=(0,l.useRef)(-1),[U,B]=(0,l.useState)(!1);x[1]!==y?(o=(0,$.cleanSanityString)(y),x[1]=y,x[2]=o):o=x[2];let W=o,X=!U&&(E||M||S),V=(0,L.useSplitTextRecovery)(z,W);x[3]!==W?(a=(0,A.escapeHtml)(W),x[3]=W,x[4]=a):a=x[4];let q=(0,I.useInnerHtml)(a);return(x[5]!==W||x[6]!==X||x[7]!==R?(s=()=>{if(!z.current||!W)return;let e=k.SplitText.create(z.current,{type:"lines",linesClass:"line",mask:"lines",aria:"none"}),{lines:t}=e;return(N.current=t,F.current=-1,t.length)?(h.default.set(z.current,{autoAlpha:1}),R||G.current)?(P(t),B(!0),()=>e.revert()):(h.default.set(t,{autoAlpha:0,yPercent:100,willChange:"opacity, transform"}),X)?()=>e.revert():(h.default.timeline({delay:1,onComplete:()=>{G.current=!0,B(!0),h.default.set(t,{willChange:"auto"})}}).to(t,{autoAlpha:1,yPercent:0,duration:j.DESCRIPTION_LINE_REVEAL,stagger:j.DESCRIPTION_LINE_GAP,ease:"power3.out"}),()=>e.revert()):()=>e.revert()},x[5]=W,x[6]=X,x[7]=R,x[8]=s):s=x[8],x[9]!==W||x[10]!==X||x[11]!==R||x[12]!==V?(f={scope:z,dependencies:[W,X,R,V]},x[9]=W,x[10]=X,x[11]=R,x[12]=V,x[13]=f):f=x[13],(0,C.useAnimation)(s,f),x[14]!==O||x[15]!==D||x[16]!==U||x[17]!==R||x[18]!==H?(p=()=>{if(!U||R)return;let e=()=>{let e=N.current;if(!e.length)return;let t=.002*Math.round(O(D())/.002);if(t!==F.current){if(F.current=t,t<=0)return void P(e);for(let[r,i]of e.entries()){let n=(0,j.getStaggeredSegmentProgress)(t,r,e.length,j.DESCRIPTION_LINE_GAP,j.DESCRIPTION_LINE_REVEAL);h.default.set(i,{autoAlpha:1-n,yPercent:100*n,willChange:"opacity, transform"})}}};return e(),H(e)},x[14]=O,x[15]=D,x[16]=U,x[17]=R,x[18]=H,x[19]=p):p=x[19],x[20]!==O||x[21]!==D||x[22]!==U||x[23]!==R||x[24]!==V||x[25]!==H?(g=[O,D,U,R,H,V],x[20]=O,x[21]=D,x[22]=U,x[23]=R,x[24]=V,x[25]=H,x[26]=g):g=x[26],(0,l.useEffect)(p,g),W)?(x[27]!==W?(m=(0,t.jsx)("span",{className:"sr-only",children:W}),x[27]=W,x[28]=m):m=x[28],x[29]!==q||x[30]!==W||x[31]!==w?(v=(0,t.jsx)(T,{ref:z,"aria-hidden":!0,$l:"4/10",$xl:"5/9","data-sanity":w,dangerouslySetInnerHTML:q},W),x[29]=q,x[30]=W,x[31]=w,x[32]=v):v=x[32],x[33]!==m||x[34]!==v?(b=(0,t.jsxs)(t.Fragment,{children:[m,v]}),x[33]=m,x[34]=v,x[35]=b):b=x[35],b):null};D.displayName="HeroDescription";let H=(e,t)=>{let r=e.getBoundingClientRect(),i=r.left+r.width/2,n=r.top+r.height/2;for(let e of t){let t=e.getBoundingClientRect();h.default.set(e,{transformOrigin:`${i-t.left}px ${n-t.top}px`})}},O=e=>{h.default.set(e,{autoAlpha:1,scale:1,display:"inline-block",verticalAlign:"top",filter:"blur(0px)",willChange:"auto"})},M=e=>{let n,o,a,s,f,p,g,m,v,b,x=(0,r.c)(34),{title:y,editAttr:T}=e,{loaderMounted:E}=(0,l.use)(c.LoaderContext),{menuVisible:S}=(0,l.use)(d.MenuContext),{isReducedMotion:R}=(0,l.use)(u.PerformanceContext),{getProgress:P,subscribe:D,getHeroTextSegmentProgress:M}=(0,i.useStickyTrackStore)(),z=(0,_.usePageTransitioning)(),N=(0,l.useRef)(null);x[0]===Symbol.for("react.memo_cache_sentinel")?(n=[],x[0]=n):n=x[0];let G=(0,l.useRef)(n),F=(0,l.useRef)(!1),U=(0,l.useRef)(-1),[B,W]=(0,l.useState)(!1);x[1]!==y?(o=(0,$.cleanSanityString)(y),x[1]=y,x[2]=o):o=x[2];let X=o,V=!B&&(E||z||S),q=(0,L.useSplitTextRecovery)(N,X);x[3]!==X?(a=(0,A.escapeHtml)(X),x[3]=X,x[4]=a):a=x[4];let Y=(0,I.useInnerHtml)(a);return(x[5]!==X||x[6]!==V||x[7]!==R?(s=()=>{if(!N.current||!X)return;let e=k.SplitText.create(N.current,{type:"words"}),{words:t}=e;return(G.current=t,U.current=-1,t.length)?(h.default.set(N.current,{autoAlpha:1}),R||F.current)?(O(t),W(!0),()=>e.revert()):(H(N.current,t),h.default.set(t,{autoAlpha:0,scale:j.TITLE_SCALE_START,display:"inline-block",verticalAlign:"top",filter:`blur(${j.TITLE_BLUR_START}px)`,willChange:"opacity, transform, filter"}),V)?()=>e.revert():(h.default.timeline({delay:.75,onComplete:()=>{F.current=!0,W(!0),h.default.set(t,{willChange:"auto"})}}).to(t,{autoAlpha:1,scale:1,filter:"blur(0px)",duration:j.TITLE_WORD_REVEAL,stagger:j.TITLE_WORD_GAP,ease:"power2.out"}),()=>e.revert()):()=>e.revert()},x[5]=X,x[6]=V,x[7]=R,x[8]=s):s=x[8],x[9]!==X||x[10]!==V||x[11]!==R||x[12]!==q?(f={scope:N,dependencies:[X,V,R,q]},x[9]=X,x[10]=V,x[11]=R,x[12]=q,x[13]=f):f=x[13],(0,C.useAnimation)(s,f),x[14]!==B?(p=()=>{B&&N.current&&G.current.length&&H(N.current,G.current)},g=[B],x[14]=B,x[15]=p,x[16]=g):(p=x[15],g=x[16]),(0,l.useEffect)(p,g),x[17]!==M||x[18]!==P||x[19]!==B||x[20]!==R||x[21]!==D?(m=()=>{if(!B||R)return;let e=()=>{let e=G.current;if(!e.length)return;let t=.002*Math.round(M(P())/.002);if(t!==U.current){if(U.current=t,t<=0)return void O(e);for(let[r,i]of e.entries()){let{scale:n,opacity:o,blur:a}=(0,j.getGrowOutWordValues)(t,r,e.length);h.default.set(i,{autoAlpha:o,scale:n,filter:`blur(${a}px)`})}}};return e(),D(e)},x[17]=M,x[18]=P,x[19]=B,x[20]=R,x[21]=D,x[22]=m):m=x[22],x[23]!==M||x[24]!==P||x[25]!==B||x[26]!==R||x[27]!==q||x[28]!==D?(v=[M,P,B,R,D,q],x[23]=M,x[24]=P,x[25]=B,x[26]=R,x[27]=q,x[28]=D,x[29]=v):v=x[29],(0,l.useEffect)(m,v),X)?(x[30]!==X||x[31]!==T||x[32]!==Y?(b=(0,t.jsx)(w,{ref:N,$s:"1/5",$m:"2/6",$l:"4/10","data-sanity":T,dangerouslySetInnerHTML:Y},X),x[30]=X,x[31]=T,x[32]=Y,x[33]=b):b=x[33],b):null};M.displayName="HeroTitle";let z=e=>{let s,c,d,u,f,p,h,g,m=(0,r.c)(20),{title:v,description:x,textScrollLength:y,documentId:w,documentType:T}=e,E=void 0===y?n.DEFAULT_HERO_TEXT_SCROLL_LENGTH:y,{setHeroTextScrollLength:R}=(0,i.useStickyTrackStore)();m[0]!==w||m[1]!==T?(s=(0,o.sanityEditAttr)({id:w,type:T,path:"heroHeading"}),m[0]=w,m[1]=T,m[2]=s):s=m[2];let A=s;m[3]!==w||m[4]!==T?(c=(0,o.sanityEditAttr)({id:w,type:T,path:"heroDescription"}),m[3]=w,m[4]=T,m[5]=c):c=m[5];let $=c;return m[6]!==R||m[7]!==E?(d=()=>(R(E),()=>{R(n.DEFAULT_HERO_TEXT_SCROLL_LENGTH)}),u=[R,E],m[6]=R,m[7]=E,m[8]=d,m[9]=u):(d=m[8],u=m[9]),(0,l.useLayoutEffect)(d,u),m[10]===Symbol.for("react.memo_cache_sentinel")?(f=(0,t.jsx)(S,{}),m[10]=f):f=m[10],m[11]!==v||m[12]!==A?(p=(0,t.jsx)(a.default,{"data-text":"top",children:(0,t.jsx)(M,{title:v,editAttr:A})}),m[11]=v,m[12]=A,m[13]=p):p=m[13],m[14]!==x||m[15]!==$?(h=(0,t.jsx)(a.default,{"data-text":"bottom",children:(0,t.jsx)(D,{description:x,editAttr:$})}),m[14]=x,m[15]=$,m[16]=h):h=m[16],m[17]!==p||m[18]!==h?(g=(0,t.jsxs)(b,{"data-page-route":"/",children:[f,p,h]}),m[17]=p,m[18]=h,m[19]=g):g=m[19],g};z.displayName="Hero",e.s(["default",0,z],601969)},958643,e=>{"use strict";var t=e.i(843476),r=e.i(500932),i=e.i(322208),n=e.i(867308),o=e.i(992325),a=e.i(271645),l=e.i(383520),s=e.i(101384),c=e.i(456393),d=e.i(259553),u=e.i(478430),f=e.i(831119),p=e.i(607561),h=e.i(989970);let g=16/9,m=`
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`,v=`
precision highp float;
varying vec2 uv;
uniform sampler2D colour;
uniform sampler2D depth;
uniform vec2 coverScale;
uniform vec2 offset;
float softenedDepth(vec2 point) {
  vec2 stepSize = vec2(${.008/g}, 0.008);
  float value = texture2D(depth, point).r * 4.0;
  value += texture2D(depth, point + vec2(stepSize.x, 0.0)).r * 2.0;
  value += texture2D(depth, point - vec2(stepSize.x, 0.0)).r * 2.0;
  value += texture2D(depth, point + vec2(0.0, stepSize.y)).r * 2.0;
  value += texture2D(depth, point - vec2(0.0, stepSize.y)).r * 2.0;
  value += texture2D(depth, point + stepSize).r;
  value += texture2D(depth, point - stepSize).r;
  value += texture2D(depth, point + vec2(stepSize.x, -stepSize.y)).r;
  value += texture2D(depth, point + vec2(-stepSize.x, stepSize.y)).r;
  return value / 16.0;
}
void main() {
  vec2 depthUV = (uv - 0.5) * coverScale + 0.5;
  float distance = softenedDepth(depthUV);
  vec2 displaced = clamp(uv + offset * (distance - 0.5), 0.001, 0.999);
  gl_FragColor = vec4(texture2D(colour, displaced).rgb, 1.0);
}`;var b=e.i(255981);let x=(e,t,r)=>e?t??"/videos/intro-scroll.af":r??"/videos/intro-scroll.af";var y=e.i(575509),w=e.i(212960),T=e.i(997053);let E=(0,T.default)(y.Div).attrs({as:"section"}).withConfig({componentId:"sc-2b039258-0"})(({$elevated:e=!1})=>T.css`
		position: absolute;
		z-index: ${e?3:1};
		inset: 0;
		width: 100%;
		height: 100dvh;
		overflow: hidden;
		pointer-events: none;
	`),S=T.default.div.withConfig({componentId:"sc-2b039258-1"})(()=>T.css`
		position: absolute;
		inset: 0;
		pointer-events: none;
	`),R=T.default.canvas.withConfig({componentId:"sc-2b039258-2"})(()=>T.css`
		display: block;
		width: 100%;
		height: 100%;
	`),A=T.default.div.withConfig({componentId:"sc-2b039258-3"})(()=>T.css`
		position: absolute;
		z-index: 2;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-inline: ${(0,y.getGap)("l")};
		pointer-events: none;
	`),$=(0,T.default)(y.Div).attrs({as:"h2"}).withConfig({componentId:"sc-2b039258-4"})(()=>T.css`
		${w.headlineS}
		text-align: center;
		text-wrap: balance;
		visibility: hidden;
		opacity: 0;

		${y.bp.l`
			text-wrap: balance;
		`}
	`),C=T.default.div.withConfig({componentId:"sc-2b039258-5"})(()=>T.css`
		position: absolute;
		inset: 0;
	`),I=T.default.canvas.withConfig({componentId:"sc-2b039258-6"})(()=>T.css`
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		visibility: hidden;
		pointer-events: none;
	`),L=e=>{let o,y,w,T,E,A,$,L,j,P,D,H,O,M,z,N,G,F,U=(0,r.c)(47),{desktopVideoSrc:B,mobileVideoSrc:W}=e,{getProgress:X,subscribe:V,getIntroSegmentProgress:q}=(0,i.useStickyTrackStore)(),{isReducedMotion:Y,devicePixelRatio:K,isLowPowerMode:J}=(0,a.use)(s.PerformanceContext),{setIntroFrameReady:Z,setHasIntroVideo:Q}=(0,a.use)(l.HeroVideoContext),ee=(0,b.useIsDesktopViewport)(),et=(0,a.useRef)(null),er=(0,a.useRef)(null),ei=(0,a.useRef)(null),en=(0,a.useRef)(null),eo=(0,a.useRef)(null),ea=(0,a.useRef)(null),el=(0,a.useRef)(-1),es=(0,a.useRef)(-1),ec=(0,a.useRef)(0),[ed,eu]=(0,a.useState)("idle");U[0]!==B||U[1]!==ee||U[2]!==W?(o=()=>x(ee,B,W),U[0]=B,U[1]=ee,U[2]=W,U[3]=o):o=U[3];let[ef,ep]=(0,a.useState)(o),eh=((e,t,n,o,c)=>{let d,b,x,y,w,T=(0,r.c)(29),{loaderMounted:E}=(0,a.use)(u.LoaderContext),{isHeroPlaybackComplete:S,isHeroFrameSettled:R}=(0,a.use)(l.HeroVideoContext),{menuOpen:A}=(0,a.use)(f.MenuContext),{isReducedMotion:$,isLowPowerMode:C}=(0,a.use)(s.PerformanceContext),{getProgress:I,getIntroSegmentProgress:L,subscribe:_}=(0,i.useStickyTrackStore)(),k=(0,a.useRef)(null);T[0]===Symbol.for("react.memo_cache_sentinel")?(d=()=>k.current?.(),T[0]=d):d=T[0];let j=d;return T[1]!==t||T[2]!==n||T[3]!==L||T[4]!==I||T[5]!==R||T[6]!==S||T[7]!==C||T[8]!==o||T[9]!==$||T[10]!==E||T[11]!==A||T[12]!==_||T[13]!==e||T[14]!==c?(b=r=>{let{isDesktop:i,hasPointer:a}=r,l=t.current,s=e.current,d=n.current;if(!l||!s||!d||!o||!i||!a||$||C||E||!S||!R||A)return;let u=c.includes("/1edf555085ef9a6ae1dde1a1bbc3ea6ff806db34.af")?((e,t)=>{let r=e.getContext("webgl",{alpha:!1,antialias:!1,depth:!1});if(!r)return null;let i=[],n=[],o=r.createProgram(),a=r.createBuffer(),l=!1,s=!1,c=!0,d=new Image,u=()=>{e.style.visibility="hidden"},f=()=>{for(let t of(s=!0,l=!1,d.onload=null,d.onerror=null,e.removeEventListener("webglcontextlost",u),u(),n))r.deleteTexture(t);for(let e of i)r.deleteShader(e);r.deleteBuffer(a),r.deleteProgram(o)};if(!o||!a)return f(),null;for(let[e,t]of[[r.VERTEX_SHADER,m],[r.FRAGMENT_SHADER,v]]){let n=r.createShader(e);if(!n||(i.push(n),r.shaderSource(n,t),r.compileShader(n),!r.getShaderParameter(n,r.COMPILE_STATUS)))return f(),null;r.attachShader(o,n)}if(r.linkProgram(o),!r.getProgramParameter(o,r.LINK_STATUS))return f(),null;r.useProgram(o),r.bindBuffer(r.ARRAY_BUFFER,a),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),r.STATIC_DRAW);let p=r.getAttribLocation(o,"position");r.enableVertexAttribArray(p),r.vertexAttribPointer(p,2,r.FLOAT,!1,0,0),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!0);for(let e=0;e<2;e++){let t=r.createTexture();if(!t)return f(),null;n.push(t),r.activeTexture(r.TEXTURE0+e),r.bindTexture(r.TEXTURE_2D,t),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}r.uniform1i(r.getUniformLocation(o,"colour"),0),r.uniform1i(r.getUniformLocation(o,"depth"),1);let h=r.getUniformLocation(o,"coverScale"),b=r.getUniformLocation(o,"offset");return d.onload=()=>{s||r.isContextLost()||(r.activeTexture(r.TEXTURE1),r.bindTexture(r.TEXTURE_2D,n[1]),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,d),l=!0)},d.onerror=u,d.src="/images/hero-depth/lineup.webp",e.addEventListener("webglcontextlost",u),{invalidate:()=>{c=!0},draw:(i,o)=>{if(!l||s||r.isContextLost()||Math.abs(i)+Math.abs(o)<1e-4)return void u();(e.width!==t.width||e.height!==t.height)&&(e.width=t.width,e.height=t.height,c=!0);let a=t.width/t.height;r.viewport(0,0,e.width,e.height),r.uniform2f(h,a>g?1:a/g,a>g?g/a:1),r.uniform2f(b,.003*i,-(.003*o)),r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,n[0]);try{c&&(r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,t),c=!1),r.drawArrays(r.TRIANGLE_STRIP,0,4),e.style.visibility="visible"}catch{u()}},destroy:f}})(d,l):null,f={x:0,y:0,strength:0},p=!1;h.default.set(s,{transformPerspective:1200,transformOrigin:"50% 50%"});let b=()=>{let e=f.x*f.strength,t=f.y*f.strength;u?.draw(e,t),h.default.set(s,{xPercent:.6*e,yPercent:.6*t,rotationY:-(.5*e),rotationX:.5*t,scale:1+.025*f.strength})};k.current=()=>{u?.invalidate(),b()};let x=h.default.quickTo(f,"x",{duration:.7,ease:"power3.out",onUpdate:b}),y=h.default.quickTo(f,"y",{duration:.7,ease:"power3.out",onUpdate:b}),w=h.default.quickTo(f,"strength",{duration:.7,ease:"power3.out",onUpdate:b}),T=()=>{let e=Math.min(1,Math.max(0,L(I())/.12));w(!E&&S&&!A&&p?1-e*e*(3-2*e):0)},j=e=>{"mouse"===e.pointerType&&(x(h.default.utils.clamp(-1,1,e.clientX/window.innerWidth*2-1)),y(h.default.utils.clamp(-1,1,e.clientY/window.innerHeight*2-1)),p=!0,T())},P=()=>{p=!1,T()};T();let D=_(T);return window.addEventListener("pointermove",j,{passive:!0}),window.addEventListener("blur",P),document.documentElement.addEventListener("pointerleave",P),()=>{D(),k.current=null,u?.destroy(),window.removeEventListener("pointermove",j),window.removeEventListener("blur",P),document.documentElement.removeEventListener("pointerleave",P)}},T[1]=t,T[2]=n,T[3]=L,T[4]=I,T[5]=R,T[6]=S,T[7]=C,T[8]=o,T[9]=$,T[10]=E,T[11]=A,T[12]=_,T[13]=e,T[14]=c,T[15]=b):b=T[15],T[16]!==R||T[17]!==S||T[18]!==C||T[19]!==o||T[20]!==$||T[21]!==E||T[22]!==A||T[23]!==c?(x=[o,c,E,S,R,A,$,C],T[16]=R,T[17]=S,T[18]=C,T[19]=o,T[20]=$,T[21]=E,T[22]=A,T[23]=c,T[24]=x):x=T[24],T[25]!==e||T[26]!==x?(y={scope:e,dependencies:x},T[25]=e,T[26]=x,T[27]=y):y=T[27],T[28]===Symbol.for("react.memo_cache_sentinel")?(w={hasPointer:"(hover: hover) and (pointer: fine)"},T[28]=w):w=T[28],(0,p.useAnimation)(b,y,w),j})(er,en,ei,"ready"===ed,ef);U[4]!==K||U[5]!==J?(y=()=>{let e=en.current,t=et.current;if(!e||!t)return!1;let r=Math.min(K,J?1:1.5),{clientWidth:i,clientHeight:n}=t;if(!i||!n)return!1;e.width=Math.round(i*r),e.height=Math.round(n*r),e.style.width=`${i}px`,e.style.height=`${n}px`;let o=e.getContext("2d");return!!o&&(eo.current=o,o.setTransform(r,0,0,r,0,0),!0)},U[4]=K,U[5]=J,U[6]=y):y=U[6];let eg=y;U[7]!==eg?(w=()=>{cancelAnimationFrame(ec.current),ec.current=requestAnimationFrame(()=>{if(!eg())return;let e=ea.current;e&&(0,c.forceRedrawFrame)(e,el.current)})},U[7]=eg,U[8]=w):w=U[8];let em=w;U[9]!==q?(T=e=>{let t=ea.current;if(!t?.manifest)return;let r=q(e),i=r<=0?0:Math.round(r*(t.manifest.totalFrames-1));i!==el.current&&(el.current=i,t.setFrame(i))},U[9]=q,U[10]=T):T=U[10];let ev=T;U[11]!==q||U[12]!==X||U[13]!==ed||U[14]!==ev?(E=()=>{if("ready"!==ed)return;let e=q(X()),t=1-(0,n.getIntroOutroSegmentProgress)(e);ev(X()),et.current&&es.current!==t&&(es.current=t,et.current.style.opacity=String(t))},U[11]=q,U[12]=X,U[13]=ed,U[14]=ev,U[15]=E):E=U[15];let eb=E;return(U[16]!==eb||U[17]!==ed||U[18]!==V?(A=()=>{if("ready"===ed)return eb(),V(eb)},$=[eb,ed,V],U[16]=eb,U[17]=ed,U[18]=V,U[19]=A,U[20]=$):(A=U[19],$=U[20]),(0,a.useEffect)(A,$),U[21]!==B||U[22]!==ee||U[23]!==W?(L=()=>{ep(x(ee,B,W))},j=[B,W,ee],U[21]=B,U[22]=ee,U[23]=W,U[24]=L,U[25]=j):(L=U[24],j=U[25]),(0,a.useEffect)(L,j),U[26]!==Y||U[27]!==ef?(P=()=>{if(Y||!("VideoDecoder"in window))return void eu("unsupported");if(!ef)return;let e=!1,t=new AbortController;return(async()=>{eu("loading");try{await (0,d.promiseWithTimeout)((0,c.waitForActiveFrameRuntime)(t.signal),2e4,"ActiveFrame runtime never arrived")}catch(t){e||(console.warn("Introduction video runtime failed:",t),eu("error"));return}if(e||!window.ActiveFrame)return;ea.current?.destroy(),ea.current=null,el.current=-1;let r=new window.ActiveFrame(ef,{hardwareAcceleration:"prefer-hardware",process:_});ea.current=r;try{if(await (0,d.promiseWithTimeout)(r.loading,2e4,"Introduction video preload timed out"),e){r.destroy(),ea.current===r&&(ea.current=null);return}eu("ready")}catch(t){console.warn("Introduction video preload failed:",t),e||eu("error"),r.destroy(),ea.current===r&&(ea.current=null)}})(),()=>{e=!0,t.abort(),ea.current?.destroy(),ea.current=null}},D=[Y,ef],U[26]=Y,U[27]=ef,U[28]=P,U[29]=D):(P=U[28],D=U[29]),(0,a.useEffect)(P,D),U[30]!==X||U[31]!==em||U[32]!==ed||U[33]!==eh||U[34]!==ev||U[35]!==Z||U[36]!==eg?(H=()=>{if("ready"!==ed)return;let e=en.current,t=ea.current;if(!e||!t)return;let r=null;return(()=>{if(!eg())return;let e=!1;t.process=t=>{let r=eo.current,i=et.current;r&&i&&((0,c.drawCoverFrame)(r,t,i.clientWidth,i.clientHeight),eh(),e||(e=!0,Z(!0)))},ev(X()),r=new ResizeObserver(em),et.current&&r.observe(et.current),window.addEventListener("resize",em)})(),()=>{cancelAnimationFrame(ec.current),window.removeEventListener("resize",em),r?.disconnect(),eo.current=null,t.process=k}},O=[X,em,ed,ev,Z,eg,eh],U[30]=X,U[31]=em,U[32]=ed,U[33]=eh,U[34]=ev,U[35]=Z,U[36]=eg,U[37]=H,U[38]=O):(H=U[37],O=U[38]),(0,a.useEffect)(H,O),U[39]!==Q?(M=()=>(Q(!0),()=>Q(!1)),z=[Q],U[39]=Q,U[40]=M,U[41]=z):(M=U[40],z=U[41]),(0,a.useEffect)(M,z),U[42]!==ed||U[43]!==Z?(N=()=>{("unsupported"===ed||"error"===ed)&&Z(!0)},G=[ed,Z],U[42]=ed,U[43]=Z,U[44]=N,U[45]=G):(N=U[44],G=U[45]),(0,a.useEffect)(N,G),"unsupported"===ed||"error"===ed)?null:(U[46]===Symbol.for("react.memo_cache_sentinel")?(F=(0,t.jsx)(S,{ref:et,"aria-hidden":"true",children:(0,t.jsxs)(C,{ref:er,children:[(0,t.jsx)(R,{ref:en}),(0,t.jsx)(I,{ref:ei})]})}),U[46]=F):F=U[46],F)};function _(){}function k(){}L.displayName="IntroductionBackground";var j=e.i(481293),P=e.i(948025);let D={minWidth:1024,moveDistance:15,stopDuration:350,trailLength:5},H=T.default.div.withConfig({componentId:"sc-d2fec375-0"})(({$isActive:e=!1})=>T.css`
		position: absolute;
		z-index: 1;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: ${e?"auto":"none"};
	`),O=T.default.div.withConfig({componentId:"sc-d2fec375-1"})(()=>T.css`
		position: relative;
		width: 100%;
		height: 100%;
	`),M=T.default.div.withConfig({componentId:"sc-d2fec375-2"})(()=>T.css`
		position: absolute;
		width: 21.6rem;
		height: 27rem;
		overflow: hidden;
		border-radius: 0.3125em;
		opacity: 0;
		visibility: hidden;
	`),z=T.default.img.withConfig({componentId:"sc-d2fec375-3"})(()=>T.css`
		width: 100%;
		height: 100%;
		object-fit: cover;
	`),N=e=>{let o,l,c,d,u,f,p,g,m=(0,r.c)(20),{images:v}=e;m[0]!==v?(o=void 0===v?[]:v,m[0]=v,m[1]=o):o=m[1];let b=o,{isReducedMotion:x}=(0,a.use)(s.PerformanceContext),{getProgress:y,subscribe:w,getIntroSegmentProgress:T}=(0,i.useStickyTrackStore)(),E=(0,a.useRef)(null),[S,R]=(0,a.useState)(!1);m[2]!==b?(l=b.map(G).filter(F),m[2]=b,m[3]=l):l=m[3];let A=l;m[4]!==A?(c=A.map(U).join("|"),m[4]=A,m[5]=c):c=m[5];let $=c;return(m[6]!==T||m[7]!==y||m[8]!==$||m[9]!==x||m[10]!==w?(d=()=>{let e=E.current;if(!e||!$||x)return;let t=((e,t={})=>{let r={...D,...t};if(window.innerWidth<r.minWidth)return null;let i=Array.from(e.querySelectorAll('[data-trail="item"]'));if(!i.length)return null;let n=Math.max(1,Math.min(r.trailLength,i.length-1)),o={trailInterval:null,globalIndex:0,last:{x:0,y:0},trailImageTimestamps:new Map,isActive:!1},a=new Map,l=e=>{h.default.to(e,{opacity:0,scale:.2,duration:.8,ease:"expo.out",onComplete:()=>{h.default.set(e,{autoAlpha:0})}})},s=t=>{let s,c,d;if(!o.isActive)return;let u=e.getBoundingClientRect(),{x:f,y:p}={x:t.clientX-u.left,y:t.clientY-u.top};if(s=f,c=p,d=o.last.x,Math.hypot(d-s,o.last.y-c)>window.innerWidth/r.moveDistance){var g;let e,t;if(g=i[o.globalIndex%i.length],e=a.get(g)??{width:g.offsetWidth,height:g.offsetHeight},a.has(g)||a.set(g,e),t={left:`${f-e.width/2}px`,top:`${p-e.height/2}px`,zIndex:String(o.globalIndex),display:"block"},Object.assign(g.style,t),o.trailImageTimestamps.set(g,Date.now()),h.default.fromTo(g,{autoAlpha:0,scale:.8},{scale:1,autoAlpha:1,duration:.2,overwrite:!0}),o.last={x:f,y:p},o.globalIndex>=n){let e=(o.globalIndex-n+i.length)%i.length,t=i[e];t&&l(t)}o.globalIndex++}},c=()=>{let e=Date.now();for(let[t,i]of o.trailImageTimestamps.entries())e-i>r.stopDuration&&(l(t),o.trailImageTimestamps.delete(t))},d=()=>{if(o.isActive){for(let t of(o.isActive=!1,e.removeEventListener("mousemove",s),o.trailInterval&&(clearInterval(o.trailInterval),o.trailInterval=null),i))l(t);o.trailImageTimestamps.clear()}},u=()=>{window.innerWidth<r.minWidth&&o.isActive&&d()};return window.addEventListener("resize",u),{start:()=>{if(!o.isActive&&!(window.innerWidth<r.minWidth)){for(let e of i)a.set(e,{width:e.offsetWidth,height:e.offsetHeight});o.isActive=!0,e.addEventListener("mousemove",s),o.trailInterval=setInterval(c,100)}},stop:d,destroy:()=>{d(),window.removeEventListener("resize",u)}}})(e);if(!t)return;let r=()=>{let e=(0,n.getIntroOutroSegmentProgress)(T(y()))>=.95;R(t=>t===e?t:e),e?t.start():t.stop()};r();let i=w(r);return()=>{i(),t.destroy()}},u=[T,y,$,x,w],m[6]=T,m[7]=y,m[8]=$,m[9]=x,m[10]=w,m[11]=d,m[12]=u):(d=m[11],u=m[12]),(0,a.useEffect)(d,u),!A.length||x)?null:(m[13]!==A?(f=A.map(B),m[13]=A,m[14]=f):f=m[14],m[15]!==f?(p=(0,t.jsx)(O,{className:"trail-list",children:f}),m[15]=f,m[16]=p):p=m[16],m[17]!==S||m[18]!==p?(g=(0,t.jsx)(H,{ref:E,"data-trail":"wrapper",$isActive:S,"aria-hidden":"true",children:p}),m[17]=S,m[18]=p,m[19]=g):g=m[19],g)};function G(e){return(0,j.resolveImageWithAlt)(e)}function F(e){return!!e}function U(e){return e.src}function B(e){return(0,t.jsx)(M,{"data-trail":"item",children:(0,t.jsx)(z,{src:(0,P.imageRenditionSrc)(e.image,"trail")??void 0,alt:e.alt,width:e.width,height:e.height,draggable:!1,loading:"lazy",decoding:"async"})},e.src)}N.displayName="ImageTrail";var W=e.i(221781),X=e.i(486861),V=e.i(189897),q=e.i(875324),Y=e.i(797489),K=e.i(274879);let J=e=>{if(!e.length)return;let t=1/0,r=1/0,i=-1/0,n=-1/0;for(let o of e){let e=o.offsetLeft,a=o.offsetTop,l=e+o.offsetWidth,s=a+o.offsetHeight;t=Math.min(t,e),r=Math.min(r,a),i=Math.max(i,l),n=Math.max(n,s)}let o=(t+i)/2,a=(r+n)/2;for(let t of e)h.default.set(t,{transformOrigin:`${o-t.offsetLeft}px ${a-t.offsetTop}px`,force3D:!0})},Z=e=>{h.default.set(e,{autoAlpha:0,scale:W.TITLE_SCALE_START,yPercent:0,filter:`blur(${W.TITLE_BLUR_START}px)`,display:"inline-block",verticalAlign:"top",willChange:"opacity, transform, filter"})},Q=e=>{h.default.set(e,{autoAlpha:1,scale:1,yPercent:0,filter:"blur(0px)",display:"inline-block",verticalAlign:"top",willChange:"auto"})},ee=e=>{let o,l,c,d,u,f,g,m,v,x,y,w,T=(0,r.c)(40),{heading:E,editAttr:S}=e,{isReducedMotion:R}=(0,a.use)(s.PerformanceContext),{getProgress:C,subscribe:I,getIntroSegmentProgress:L,getApproachEntryProgress:_}=(0,i.useStickyTrackStore)(),k=(0,b.useIsDesktopViewport)(),j=(0,a.useRef)(null),P=(0,a.useRef)(null);T[0]===Symbol.for("react.memo_cache_sentinel")?(o=[],T[0]=o):o=T[0];let D=(0,a.useRef)(o),H=(0,a.useRef)("hidden"),O=(0,a.useRef)(-1),M=(0,a.useRef)(-1);if(T[1]!==E?.line1||T[2]!==E?.line2){let e=(0,V.cleanSanityString)(E?.line1),t=(0,V.cleanSanityString)(E?.line2);l=!!(e||t),c=`${e}|${t}`,f=Y.useInnerHtml,d=(0,X.escapeHtml)(e),u=(0,X.escapeHtml)(t),T[1]=E?.line1,T[2]=E?.line2,T[3]=l,T[4]=c,T[5]=d,T[6]=u,T[7]=f}else l=T[3],c=T[4],d=T[5],u=T[6],f=T[7];T[8]!==d||T[9]!==u?(g=[d,u].filter(Boolean),T[8]=d,T[9]=u,T[10]=g):g=T[10];let z=f(g.join("<br />")),N=(0,K.useSplitTextRecovery)(j,c);return(T[11]!==l||T[12]!==R?(m=()=>{if(!j.current||!l)return;let e=q.SplitText.create(j.current,{type:"words"}),{words:t}=e;return(D.current=t,H.current="hidden",O.current=-1,t.length)?(h.default.set(j.current,{autoAlpha:1}),R)?(Q(t),()=>e.revert()):(J(t),Z(t),()=>e.revert()):()=>e.revert()},T[11]=l,T[12]=R,T[13]=m):m=T[13],T[14]!==l||T[15]!==c||T[16]!==R||T[17]!==N?(v={scope:j,dependencies:[l,c,R,N]},T[14]=l,T[15]=c,T[16]=R,T[17]=N,T[18]=v):v=T[18],(0,p.useAnimation)(m,v),T[19]!==_||T[20]!==L||T[21]!==C||T[22]!==l||T[23]!==k||T[24]!==R||T[25]!==I?(x=()=>{if(!l||R)return;let e=()=>{let e=D.current,t=P.current;if(!e.length||!j.current||!t)return;let r=.002*Math.round((0,n.getIntroOutroSegmentProgress)(L(C()))/.002),i=.002*Math.round(_()/.002);if(k&&i>0){let e;if(i===M.current)return;M.current=i;let{opacity:r,blur:n}={opacity:1-(e=Math.min(1,Math.max(0,i)/.7)),blur:12*e};h.default.set(t,{autoAlpha:r,filter:`blur(${n}px)`,willChange:"opacity, filter"});return}if(-1!==M.current&&(M.current=-1,h.default.set(t,{autoAlpha:1,filter:"blur(0px)",willChange:"auto"})),r<=0){"hidden"!==H.current&&(h.default.set(t,{y:0,willChange:"auto"}),Z(e),H.current="hidden",O.current=-1);return}if(r>=1){"visible"!==H.current&&(h.default.set(t,{y:0,willChange:"auto"}),J(e),Q(e),H.current="visible",O.current=1);return}if("animating"===H.current&&r===O.current)return;let o="animating"!==H.current;for(let[i,n]of(H.current="animating",O.current=r,o&&(h.default.set(t,{y:0,willChange:"auto"}),J(e)),e.entries())){let{scale:t,opacity:o,blur:a}=(0,W.getIntroGrowInWordValues)(r,i,e.length);h.default.set(n,{autoAlpha:o,scale:t,yPercent:0,filter:`blur(${a}px)`})}};return e(),I(e)},T[19]=_,T[20]=L,T[21]=C,T[22]=l,T[23]=k,T[24]=R,T[25]=I,T[26]=x):x=T[26],T[27]!==_||T[28]!==L||T[29]!==C||T[30]!==l||T[31]!==k||T[32]!==R||T[33]!==N||T[34]!==I?(y=[_,L,C,l,k,R,I,N],T[27]=_,T[28]=L,T[29]=C,T[30]=l,T[31]=k,T[32]=R,T[33]=N,T[34]=I,T[35]=y):y=T[35],(0,a.useEffect)(x,y),l)?(T[36]!==S||T[37]!==z||T[38]!==c?(w=(0,t.jsx)(A,{ref:P,children:(0,t.jsx)($,{ref:j,"data-sanity":S,dangerouslySetInnerHTML:z},c)}),T[36]=S,T[37]=z,T[38]=c,T[39]=w):w=T[39],w):null};ee.displayName="IntroductionHeading";let et=e=>{let l,s,c,d,u,f,p,h,g,m=(0,r.c)(25),{heading:v,desktopVideoSrc:b,mobileVideoSrc:x,gallery:y,scrollLength:w,documentId:T,documentType:S}=e,R=void 0===w?n.DEFAULT_INTRO_SCROLL_LENGTH:w,{setIntroScrollLength:A,getProgress:$,subscribe:C,getIntroSegmentProgress:I}=(0,i.useStickyTrackStore)(),[_,k]=(0,a.useState)(!1);m[0]!==R||m[1]!==A?(l=()=>(A(R),()=>{A(n.DEFAULT_INTRO_SCROLL_LENGTH)}),s=[R,A],m[0]=R,m[1]=A,m[2]=l,m[3]=s):(l=m[2],s=m[3]),(0,a.useLayoutEffect)(l,s),m[4]!==I||m[5]!==$||m[6]!==C?(c=()=>{let e=()=>{let e=(0,n.getIntroOutroSegmentProgress)(I($()))>0;k(t=>t===e?t:e)};return e(),C(e)},d=[I,$,C],m[4]=I,m[5]=$,m[6]=C,m[7]=c,m[8]=d):(c=m[7],d=m[8]),(0,a.useEffect)(c,d),m[9]!==T||m[10]!==S?(u=(0,o.sanityEditAttr)({id:T,type:S,path:"introductionHeading"}),m[9]=T,m[10]=S,m[11]=u):u=m[11];let j=u;m[12]!==b||m[13]!==x?(f=(0,t.jsx)(L,{desktopVideoSrc:b,mobileVideoSrc:x}),m[12]=b,m[13]=x,m[14]=f):f=m[14];let P=y??void 0;m[15]!==P?(p=(0,t.jsx)(N,{images:P}),m[15]=P,m[16]=p):p=m[16];let D=v??void 0;return m[17]!==j||m[18]!==D?(h=(0,t.jsx)(ee,{heading:D,editAttr:j}),m[17]=j,m[18]=D,m[19]=h):h=m[19],m[20]!==_||m[21]!==h||m[22]!==f||m[23]!==p?(g=(0,t.jsxs)(E,{$elevated:_,children:[f,p,h]}),m[20]=_,m[21]=h,m[22]=f,m[23]=p,m[24]=g):g=m[24],g};et.displayName="Introduction",e.s(["default",0,et],958643)},496964,e=>{"use strict";var t=e.i(843476),r=e.i(500932),i=e.i(992325),n=e.i(607561),o=e.i(494473),a=e.i(989970),l=e.i(883495),s=e.i(255667),c=e.i(271645),d=e.i(156569),u=e.i(124821),f=e.i(575509),p=e.i(212960),h=e.i(997053);let g=(0,h.default)(f.Div).withConfig({componentId:"sc-ec8dda4b-0"})(()=>h.css`
        position: relative;
        z-index: 1;
		background: ${(0,f.getBrand)("bc1")};
		/* NOTE • Crops the fixed Texture layer below to this section's bounds.
		   clip-path clips the whole subtree — fixed descendants included — which
		   is what turns the stationary texture into a scrolling window. */
		clip-path: inset(0);
    `),m=(0,h.default)(f.Div).withConfig({componentId:"sc-ec8dda4b-1"})(()=>h.css`
		display: none;

		${f.bp.l`
			display: block;

			position: fixed;
			inset: 0;
			z-index: 0;
			background: url('/images/forged-carbon.jpg') repeat center center;
			background-size: 313px 314px;
            opacity: 0.2;
			pointer-events: none;
		`}
	`),v=(0,h.default)(f.Div).attrs({as:"section"}).withConfig({componentId:"sc-ec8dda4b-2"})(()=>h.css`
        position: relative;
        z-index: 1;
        background: transparent;
        /* NOTE • The scroll parallax (index.tsx) writes --section-lift on this
           element by hand rather than through a GSAP transform, so the property
           only ever changes on desktop and rests at zero everywhere else. */
        translate: 0 var(--section-lift, 0dvh);
    `),b=(0,h.default)(f.Div).withConfig({componentId:"sc-ec8dda4b-3"})(()=>h.css`
        /*  */
    `),x=(0,h.default)(f.Div).attrs({as:"aside"}).withConfig({componentId:"sc-ec8dda4b-4"})(()=>h.css`
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        user-select: none;

        ${f.bp.l`
            display: block;
            position: relative;
            inset: unset;
        `}
    `),y=(0,h.default)(f.Div).withConfig({componentId:"sc-ec8dda4b-5"})(()=>h.css`
        position: absolute;
        inset: 0;
        overflow: clip;

        ${f.bp.l`
            position: sticky;
            inset: 0 auto auto 0;

            height: 100dvh;
            width: 100%;
            overflow: clip;
        `}
    `),w=(0,h.default)(f.Div).attrs({as:"section"}).withConfig({componentId:"sc-ec8dda4b-6"})(({theme:e})=>h.css`
        --grid-offset: ${e.grid.gutter.s};

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        width: 100%;
        height: 75dvh;
        padding-inline: var(--grid-offset);

        ${f.bp.l`
            --grid-offset: calc(${e.grid.gutter.l} / 2);

            height: 100dvh;
        `}

        [data-name='heading'] {
            display: flex;
            flex-direction: column;
            gap: ${(0,f.getGap)("m")};

            p {
                ${p.captionL}

                color: ${(0,f.getBrand)("bc5",55)};
            }

            h3 {
                ${p.headlineL}

                color: ${(0,f.getBrand)("bc5")};
            }
        }

        > p {
            ${p.bodyL}

            color: ${(0,f.getBrand)("bc5",80)};
            margin-top: ${(0,f.getGap)("sm")};
            text-wrap: pretty;

            ${f.bp.l`
                text-wrap: balance;
            `}
        }

        a {
            margin-top: ${(0,f.getGap)("l")};
        }
    `),T=(0,h.default)(f.Div).attrs({as:"picture"}).withConfig({componentId:"sc-ec8dda4b-7"})(()=>h.css`
        display: block;
        position: relative;
        
        overflow: clip;
        height: 75dvh;
        width: 100%;
        background: ${(0,f.getBrand)("bc1")};
        
        ${f.bp.l`
            position: absolute;
            inset: 0;
            clip-path: inset(100% 0% 0% 0%);
            height: 100%;
        `}	

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            opacity: 0.4;

            ${f.bp.l`
                opacity: 1;
            `}
        }
    `),E=(e,i)=>{let n,o,a,l,s,c,f=(0,r.c)(13),{heading:p,description:h,editAttr:g}=e;return f[0]===Symbol.for("react.memo_cache_sentinel")?(n=(0,t.jsx)("p",{children:"Service"}),f[0]=n):n=f[0],f[1]!==p?(o=(0,t.jsx)("h3",{children:p}),f[1]=p,f[2]=o):o=f[2],f[3]!==g||f[4]!==o?(a=(0,t.jsxs)("div",{"data-name":"heading",children:[n,(0,t.jsx)(d.default,{editAttr:g,children:o})]}),f[3]=g,f[4]=o,f[5]=a):a=f[5],f[6]!==h?(l=(0,t.jsx)("p",{children:h}),f[6]=h,f[7]=l):l=f[7],f[8]===Symbol.for("react.memo_cache_sentinel")?(s=(0,t.jsx)(u.default,{to:"/contact",label:"Start your project",aria:"Contact Us"}),f[8]=s):s=f[8],f[9]!==i||f[10]!==a||f[11]!==l?(c=(0,t.jsxs)(w,{ref:i,children:[a,l,s]}),f[9]=i,f[10]=a,f[11]=l,f[12]=c):c=f[12],c};E.displayName="ServiceContent";let S=(0,c.memo)((0,c.forwardRef)(E));var R=e.i(481293),A=e.i(328852);let $=(e,i)=>{let n,o,a,l=(0,r.c)(7),{image:s}=e;l[0]!==s?(n=(0,R.resolveImageWithAlt)(s),l[0]=s,l[1]=n):n=l[1];let c=n;return c?(l[2]!==c?(o=(0,t.jsx)(A.default,{image:c,fill:!0,quality:85,sizes:"(min-width: 1024px) 60vw, 100vw"}),l[2]=c,l[3]=o):o=l[3],l[4]!==i||l[5]!==o?(a=(0,t.jsx)(T,{ref:i,children:o}),l[4]=i,l[5]=o,l[6]=a):a=l[6],a):null};$.displayName="ServiceImage";let C=(0,c.forwardRef)($),I="--section-lift",L=e=>{let d,u,f,p,h,w,T,E,R,A,$=(0,r.c)(19),{services:L}=e,j=(0,c.useRef)(null),P=(0,c.useRef)(null);$[0]===Symbol.for("react.memo_cache_sentinel")?(d=[],$[0]=d):d=$[0];let D=(0,c.useRef)(d);$[1]===Symbol.for("react.memo_cache_sentinel")?(u=[],$[1]=u):u=$[1];let H=(0,c.useRef)(u),O=(0,s.useLenis)();return $[2]!==O?.rootElement?(f=e=>{let{isDesktop:t}=e,r=j.current,i=H.current,n=D.current,o=O?.rootElement,s=P.current;if(i.length&&o&&r&&n.length&&s){if(t){a.default.set(i[0],{clipPath:"inset(0% 0% 0% 0%)"}),i.forEach((e,t)=>{let r=n[t];if(!e||!r)return;t>0&&a.default.fromTo(e,{clipPath:"inset(100% 0% 0% 0%)"},{clipPath:"inset(0% 0% 0% 0%)",ease:"none",scrollTrigger:{scroller:o,trigger:r,start:"top bottom",end:"top top",scrub:!0}});let i=e.querySelector("img");i&&a.default.fromTo(i,{scale:1.2},{scale:1,ease:"none",scrollTrigger:{scroller:o,trigger:r,start:"top bottom",end:"bottom top",scrub:!0}})}),n.forEach(e=>{e&&a.default.to(e,{autoAlpha:0,ease:"none",scrollTrigger:{scroller:o,trigger:e,start:"center 30%",end:"bottom 0%",scrub:!0,markers:!1}})});let e=_,t=k,s=!1,c=e=>{s||r.style.setProperty(I,`${e}dvh`)},d=l.default.create({trigger:r,scroller:o,start:"top 150%",end:"top top",onUpdate:t=>c(e(t.progress))}),u=l.default.create({trigger:r,scroller:o,start:"bottom bottom",end:"bottom top",onUpdate:e=>c(t(e.progress))}),f=()=>{c(0),s=!0},p=()=>{s=!1,c(d.progress<1?e(d.progress):t(u.progress))};return l.default.addEventListener("refreshInit",f),l.default.addEventListener("refresh",p),()=>{l.default.removeEventListener("refreshInit",f),l.default.removeEventListener("refresh",p),r.style.removeProperty(I)}}t||i.forEach(e=>{if(!e)return;let t=e.querySelector("img");t&&a.default.fromTo(t,{scale:1.2,yPercent:-25},{scale:1.2,yPercent:25,ease:"none",scrollTrigger:{scroller:o,trigger:e,start:"top bottom",end:"bottom top",scrub:!0}})})}},$[2]=O?.rootElement,$[3]=f):f=$[3],$[4]!==O||$[5]!==L?(p={scope:j,dependencies:[L,O]},$[4]=O,$[5]=L,$[6]=p):p=$[6],(0,n.useAnimation)(f,p),$[7]===Symbol.for("react.memo_cache_sentinel")?(h=(0,t.jsx)(m,{ref:P}),$[7]=h):h=$[7],$[8]!==L?(w=L.map((e,r)=>{let{_id:n,heading:o,description:a}=e;return(0,t.jsx)(S,{heading:o,description:a,editAttr:(0,i.sanityEditAttr)({id:n,type:"service",path:"heading"}),ref:e=>{e&&(D.current[r]=e)}},n)}),$[8]=L,$[9]=w):w=$[9],$[10]!==w?(T=(0,t.jsx)(b,{$l:"2/6",children:w}),$[10]=w,$[11]=T):T=$[11],$[12]!==L?(E=L.map((e,r)=>{let{image:i,_id:n}=e;return(0,t.jsx)(C,{image:i,ref:e=>{e&&(H.current[r]=e)}},n)}),$[12]=L,$[13]=E):E=$[13],$[14]!==E?(R=(0,t.jsx)(x,{$l:"7/13",children:(0,t.jsx)(y,{children:E})}),$[14]=E,$[15]=R):R=$[15],$[16]!==T||$[17]!==R?(A=(0,t.jsxs)(g,{children:[h,(0,t.jsx)(v,{ref:j,children:(0,t.jsxs)(o.default,{$noMargin:!0,$noGutter:!0,children:[T,R]})})]}),$[16]=T,$[17]=R,$[18]=A):A=$[18],A};function _(e){return-(50*(1-e))}function k(e){return 50*e}L.displayName="ServiceListing",e.s(["default",0,L],496964)},653859,e=>{"use strict";var t=e.i(843476),r=e.i(500932),i=e.i(124821),n=e.i(481293),o=e.i(992325),a=e.i(607561),l=e.i(494473),s=e.i(989970),c=e.i(255667),d=e.i(328852),u=e.i(271645),f=e.i(101384),p=e.i(486861),h=e.i(189897),g=e.i(797489),m=e.i(274879),v=e.i(698074),b=e.i(883495),x=e.i(875324),y=e.i(575509),w=e.i(212960),T=e.i(997053);let E=(0,T.default)(y.Div).attrs({as:"section"}).withConfig({componentId:"sc-d69e8bb7-0"})(()=>T.css`
		position: relative;
		z-index: 1;
		overflow: clip;

		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 75dvh;
		
        padding-block: ${(0,y.getGap)("huge")};
        background: ${(0,y.getBrand)("bc1")};

		${y.bp.l`
			padding-block: ${(0,y.getGap)("col")};
			justify-content: flex-start;
			min-height: 100dvh;
			height: auto;
		`}

		waffl-grid {
			justify-content: space-between;
			height: 100%;

			${y.bp.l`
				height: auto;
				justify-content: flex-start;
			`}
		}
	`),S=(0,T.default)(y.Div).withConfig({componentId:"sc-d69e8bb7-1"})(({theme:e})=>T.css`
		display: none;

		${y.bp.l`		
			--col: 8.333vw;

			position: absolute;
			z-index: -1;
			top: 0;
			right: calc((var(--col) * 1) + (${e.grid.gutter.l} / 2));
			bottom: auto;

			display: flex;
			align-items: center;
			justify-content: center;

			width: calc(var(--col) * 3 - ${e.grid.gutter.l});
			height: 100%;
		`}
	`),R=(0,T.default)(y.Div).withConfig({componentId:"sc-d69e8bb7-2"})(()=>T.css`
		position: relative;

		${y.bp.l`
			width: 100%;
			overflow: clip;
			aspect-ratio: 2 / 3;
		`}
	`),A=(0,T.default)(y.Div).attrs({as:"picture"}).withConfig({componentId:"sc-d69e8bb7-3"})(()=>T.css`
		position: relative;

		${y.bp.l`
			display: block;
			position: absolute;
			top: -20%;
			left: 0;
			width: 100%;
			height: 140%;
			z-index: 1;
			transform: translateZ(0);
			backface-visibility: hidden;
			background: ${(0,y.getBrand)("bc1")};
		`}

		img {
			${y.bp.l`
				display: block;
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: center;
				pointer-events: none;
				transform: translateZ(0);
				opacity: 1;
			`}
		}
	`),$=(0,T.default)(y.Div).attrs({as:"h2"}).withConfig({componentId:"sc-d69e8bb7-4"})(()=>T.css`
		${w.headlineS}
		position: relative;
		z-index: 1;
		text-wrap: balance;
		text-transform: none;
		color: #181818;

		margin-bottom: ${(0,y.getGap)("sm")};

		${y.bp.l`
			margin-bottom: 0;
		`}
	`),C=(0,T.default)(y.Div).withConfig({componentId:"sc-d69e8bb7-5"})(()=>T.css`
		position: relative;
		z-index: 1;

        display: flex;
        flex-direction: column;
        gap: ${(0,y.getGap)("m")};
        margin-top: auto;

		${y.bp.l`
			gap: ${(0,y.getGap)("xl")};
			margin-top: ${(0,y.getGap)("l")};
		`}
	`),I=(0,T.default)(y.Div).attrs({as:"p"}).withConfig({componentId:"sc-d69e8bb7-6"})(()=>T.css`
		${w.bodyL}

		position: relative;
		z-index: 1;
		text-wrap: pretty;
        color: ${(0,y.getBrand)("bc5",80)};

		${y.bp.l` text-wrap: balance `}
	`),L=e=>{let i,n,o,l,d,y=(0,r.c)(17),{heading:w,editAttr:T}=e,{isReducedMotion:E}=(0,u.use)(f.PerformanceContext),S=(0,u.useRef)(null),R=(0,c.useLenis)();y[0]!==w?(i=(0,h.cleanSanityString)(w)??"",y[0]=w,y[1]=i):i=y[1];let A=i,C=(0,m.useSplitTextRecovery)(S,A);y[2]!==A?(n=(0,p.escapeHtml)(A),y[2]=A,y[3]=n):n=y[3];let I=(0,g.useInnerHtml)(n);return(y[4]!==A||y[5]!==E||y[6]!==R?.rootElement?(o=()=>{if(!S.current||!A)return;let e=R?.rootElement;if(!e)return;let t=x.SplitText.create(S.current,{type:"lines",linesClass:"line",autoSplit:!1,aria:"auto"}),{lines:r}=t;if(!r.length||((0,v.primeFillLines)(r,{align:s.default.getProperty(S.current,"textAlign"),settled:E}),E))return()=>t.revert();let i=(0,v.buildFillTimeline)(r,{duration:1,ease:"none"}),n=b.default.create({trigger:S.current,scroller:e,start:"top bottom",end:"bottom center",scrub:!0,animation:i});return()=>{n.kill(),i.kill(),t.revert()}},y[4]=A,y[5]=E,y[6]=R?.rootElement,y[7]=o):o=y[7],y[8]!==A||y[9]!==E||y[10]!==R||y[11]!==C?(l={scope:S,dependencies:[A,E,R,C]},y[8]=A,y[9]=E,y[10]=R,y[11]=C,y[12]=l):l=y[12],(0,a.useAnimation)(o,l),A)?(y[13]!==A||y[14]!==T||y[15]!==I?(d=(0,t.jsx)($,{ref:S,$l:"2/9",$huge:"2/8","data-sanity":T,dangerouslySetInnerHTML:I},A),y[13]=A,y[14]=T,y[15]=I,y[16]=d):d=y[16],d):null};L.displayName="ServicesHeroHeading";let _=e=>{let f,p,h,g,m,v,b,x,y,w,T,$=(0,r.c)(26),{heading:_,description:k,image:j,documentId:P,documentType:D}=e;$[0]!==j?(f=(0,n.resolveImageWithAlt)(j),$[0]=j,$[1]=f):f=$[1];let H=f;$[2]!==P||$[3]!==D?(p=(0,o.sanityEditAttr)({id:P,type:D,path:"servicesHeading"}),$[2]=P,$[3]=D,$[4]=p):p=$[4];let O=p,M=(0,u.useRef)(null),z=(0,u.useRef)(null),N=(0,u.useRef)(null),G=(0,c.useLenis)();$[5]!==G?.rootElement?(h=e=>{let{isDesktop:t}=e,r=M.current,i=N.current,n=z.current,o=G?.rootElement;t&&r&&i&&n&&o&&(s.default.set(n,{yPercent:50}),s.default.to(n,{yPercent:-50,ease:"none",scrollTrigger:{trigger:r,scroller:o,start:"top bottom",end:"bottom top",scrub:!0}}),s.default.set(i,{yPercent:-50,force3D:!0}),s.default.to(i,{yPercent:50,ease:"none",force3D:!0,scrollTrigger:{trigger:r,scroller:o,start:"top bottom",end:"bottom top",scrub:!0}}))},$[5]=G?.rootElement,$[6]=h):h=$[6];let F=H?.src;return($[7]!==G||$[8]!==F?(g={scope:M,dependencies:[G,F]},$[7]=G,$[8]=F,$[9]=g):g=$[9],(0,a.useAnimation)(h,g),(_||k)&&H)?($[10]!==H?(m=(0,t.jsx)(S,{ref:z,children:(0,t.jsx)(R,{children:(0,t.jsx)(A,{ref:N,children:(0,t.jsx)(d.default,{image:H,fill:!0,sizes:"(min-width: 1024px) 25vw, 100vw"})})})}),$[10]=H,$[11]=m):m=$[11],$[12]!==_||$[13]!==O?(v=(0,t.jsx)(L,{heading:_,editAttr:O}),$[12]=_,$[13]=O,$[14]=v):v=$[14],$[15]!==k?(b=(0,t.jsx)(I,{children:k}),$[15]=k,$[16]=b):b=$[16],$[17]===Symbol.for("react.memo_cache_sentinel")?(x=(0,t.jsx)(i.default,{label:"Start Your Project",to:"/contact",aria:"Start Your Project"}),$[17]=x):x=$[17],$[18]!==b?(y=(0,t.jsxs)(C,{$l:"2/7",children:[b,x]}),$[18]=b,$[19]=y):y=$[19],$[20]!==y||$[21]!==v?(w=(0,t.jsxs)(l.default,{children:[v,y]}),$[20]=y,$[21]=v,$[22]=w):w=$[22],$[23]!==w||$[24]!==m?(T=(0,t.jsxs)(E,{ref:M,children:[m,w]}),$[23]=w,$[24]=m,$[25]=T):T=$[25],T):null};_.displayName="ServicesHero",e.s(["default",0,_],653859)},322208,e=>{"use strict";var t=e.i(271645);let r=(0,t.createContext)(null);e.s(["StickyTrackContext",0,r,"useStickyTrackStore",0,()=>{let e=(0,t.use)(r);if(!e)throw Error("useStickyTrackStore must be used within StickyTrack");return e}])},229287,e=>{"use strict";var t=e.i(843476),r=e.i(134770),i=e.i(101384),n=e.i(255981),o=e.i(883495),a=e.i(815711),l=e.i(271645),s=e.i(322208),c=e.i(867308),d=e.i(575509),u=e.i(997053);let f=u.default.div.withConfig({componentId:"sc-2b3d2147-0"})(()=>u.css`
		position: relative;
		min-height: 100dvh;
	`),p="(any-pointer: coarse)",h=u.default.div.withConfig({componentId:"sc-2b3d2147-1"})(()=>u.css`
		position: relative;
		height: 100dvh;

		@media ${p} {
			position: sticky;
			top: 0;
			/* Same layer as the fixed Content: over the Spacer, under the Overlay's 2. */
			z-index: 1;
		}
	`),g=u.default.div.withConfig({componentId:"sc-2b3d2147-2"})(()=>u.css`
		top: 0;
		left: 0;
		width: 100%;
		height: 100dvh;
		overflow: clip;
		z-index: 1;
		background-color: ${(0,d.getBrand)("bc1")};
		contain: layout paint;

		&:before {
			content: '';
			position: absolute;
			inset: 0;
			background: url('/images/forged-carbon.jpg') repeat center center;
			background-size: 313px 314px;
			background-color: ${(0,d.getGlobal)("black")};
			opacity: 0.2;
			pointer-events: none;
		}

		/* NOTE • Blackout for the Approach handover, driven from the scroll loop in
		   index.tsx (mobile only — desktop leaves it at 0 for the page's life). A
		   pseudo-element rather than a filter on Content: this is one composited
		   opacity over a panel holding a video canvas, where brightness() would
		   repaint the lot every frame. z-index clears the 3 the Introduction stacks
		   to; the Approach overlay is a sibling of Content, so it still paints over
		   this rather than under it. */
		&:after {
			content: '';
			position: absolute;
			inset: 0;
			z-index: 10;
			background: ${(0,d.getGlobal)("black")};
			opacity: var(--panel-fade, 0);
			pointer-events: none;
		}

		& > * {
			position: absolute;
			inset: 0;
		}
	`),m=u.default.div.withConfig({componentId:"sc-2b3d2147-3"})(({$scrollLength:e=3})=>u.css`
		height: ${100*Math.max(e-1,0)}dvh;
	`),v=u.default.div.withConfig({componentId:"sc-2b3d2147-4"})(()=>u.css`
		/* NOTE • Taller than its sticky slot by APPROACH_HOLD_PX. That surplus is
		   what the Approach holds still through once its aperture has finished
		   opening — the section itself must stay exactly one viewport for the clip
		   maths, so the hold has to live out here. Mobile keeps a plain 100dvh:
		   there is no aperture below bp.l, so nothing to hand over from. */
		position: relative;
		z-index: 2;

		height: 100dvh;

		${d.bp.l`
			height: calc(100dvh + ${c.APPROACH_HOLD_PX}px);
		`}
	`),b=u.default.div.withConfig({componentId:"sc-2b3d2147-5"})(()=>u.css`
		/* NOTE • The clip host. Exactly one viewport tall, so the aperture's
		   percentage inset() resolves against the viewport centre. The aperture
		   writes clip-path and transform here inline from the scroll loop in
		   index.tsx — deliberately none in CSS, so a server-rendered or JS-failed
		   page shows the Approach normally rather than an invisible zero-area
		   clip. Sticky so it holds at the top once the counter-translate reaches
		   zero and the reveal is complete. */
		position: sticky;
		top: 0;

		width: 100%;
		height: 100dvh;
	`),x=({children:e,overlay:d})=>{let{lenisRef:u}=(0,l.use)(r.AppContext),{isReducedMotion:x}=(0,l.use)(i.PerformanceContext),y=(0,l.useRef)(null),w=(0,l.useRef)(null),T=(0,l.useRef)(null),E=(0,l.useRef)(null),S=(0,l.useRef)(0),R=(0,l.useRef)(0),A=(0,l.useRef)(c.DEFAULT_INTRO_SCROLL_LENGTH),$=(0,l.useRef)(c.DEFAULT_HERO_TEXT_SCROLL_LENGTH),C=(0,l.useRef)(new Set),I=(0,l.useRef)(null),L=(0,l.useRef)(0),_=(0,l.useRef)(0),k=(0,l.useRef)(0),j=(0,l.useRef)(0),P=(0,l.useRef)(0),[D,H]=(0,l.useState)(c.DEFAULT_INTRO_SCROLL_LENGTH),O=(0,l.useCallback)(()=>{P.current||(P.current=window.requestAnimationFrame(()=>{for(let e of(P.current=0,C.current))e()}))},[]),M=(0,l.useCallback)(()=>S.current,[]),z=(0,l.useCallback)(()=>R.current,[]),N=(0,l.useCallback)(e=>(C.current.add(e),()=>{C.current.delete(e)}),[]),G=(0,l.useCallback)(e=>{let t=Math.min(1,Math.max(0,e));5e-4>Math.abs(S.current-t)||(S.current=t,O())},[O]),F=(0,l.useCallback)(()=>A.current,[]),U=(0,l.useCallback)(e=>{let t=Math.max(.1,e);if(A.current!==t){for(let e of(A.current=t,H(t),C.current))e();requestAnimationFrame(()=>{I.current?.()})}},[]),B=(0,l.useCallback)(()=>$.current,[]),W=(0,l.useCallback)(e=>{let t=Math.max(.1,e);if($.current!==t)for(let e of($.current=t,C.current))e()},[]),X=(0,l.useCallback)((e=S.current)=>(0,c.getIntroSegmentProgress)(e,A.current,c.DEFAULT_HERO_SCROLL_LENGTH),[]),V=(0,l.useCallback)((e=S.current)=>(0,c.getHeroTextSegmentProgress)(e,A.current,c.DEFAULT_HERO_SCROLL_LENGTH,$.current),[]),q=(0,l.useCallback)(()=>(0,c.getTrackScrollLength)(A.current,c.DEFAULT_HERO_SCROLL_LENGTH),[]);(0,l.useEffect)(()=>{var e;let t,r,i,l=y.current,s=w.current,d=T.current;if(!l||!s||!d)return;let f=!1,h=null,g=[],m=window.matchMedia(n.DESKTOP_MEDIA_QUERY),v=window.matchMedia(p),b=()=>{for(let e of g)e();g=[]},S=()=>{if(!h)return;b();let e=e=>Math.ceil((0,c.getScrollFromTrackProgress)(e,L.current,_.current,j.current));g=[h.add(e((0,c.getIntroCompleteTrackProgress)(A.current))),h.add(e(1))],h.resize()},$=()=>{b(),h?.destroy(),h=null},C=()=>{$();let e=u.current?.lenis;e&&m.matches&&!x&&((h=new a.default(e,{type:"proximity",debounce:500,duration:c.INTRO_SNAP_DURATION})).stop(),S())},D=e=>{if(f!==e){if(f=e,e){s.style.position="fixed",s.style.top="0",s.style.left="0",s.style.width="100%",s.style.height="100dvh",s.style.zIndex="1";return}s.style.removeProperty("position"),s.style.removeProperty("top"),s.style.removeProperty("left"),s.style.removeProperty("width"),s.style.removeProperty("height"),s.style.removeProperty("z-index")}},H=e=>{if(x||m.matches||e<=0)return void s.style.removeProperty("--panel-fade");let t=Math.min(1,e/.85);s.style.setProperty("--panel-fade",`${Math.round(1e3*t)/1e3}`)},M=()=>{let e=E.current;e&&(e.style.removeProperty("clip-path"),e.style.removeProperty("transform"))},z=e=>{let t=E.current;if(!t)return;if(x||!m.matches||e>=.9995)return void M();let r=1-e;t.style.transform=`translate3d(0, ${-r*j.current}px, 0) scale(${1+.2*r})`,t.style.clipPath=`inset(${50*r}% ${50*r}%)`},N=()=>{let e=u.current?.lenis;if(!e)return;let t=e.scroll,r=L.current,i=r+k.current-j.current;D(t>=r&&t<i&&!v.matches);let n=(0,c.measureStickyTrackProgressFromScroll)(t,r,_.current,j.current);G(n);let o=(0,c.getApproachEntryProgress)(t,r,_.current,j.current);h&&!x&&m.matches?(0,c.getIntroSegmentProgress)(n,A.current,c.DEFAULT_HERO_SCROLL_LENGTH)>=c.INTRO_SNAP_VIDEO_THRESHOLD&&n<1||o>0&&o<c.APPROACH_SNAP_BACK_THRESHOLD?h.start():h.stop():h?.stop(),Math.abs(R.current-o)>=5e-4&&(R.current=o,z(o),H(o),O())},F=(e=()=>{o.default.refresh()},r=0,(i=(...t)=>{window.clearTimeout(r),r=window.setTimeout(()=>e(...t),150)}).cancel=()=>{window.clearTimeout(r)},i),U=()=>{let e;e=u.current?.lenis?.rootElement?.clientHeight??window.innerHeight,L.current=l.offsetTop,_.current=d.offsetHeight+e,k.current=l.offsetHeight,j.current=e,S(),N(),z(R.current),H(R.current),F()};I.current=U,U();let B=window.setTimeout(U,300),W=()=>U(),X=0,V=()=>{if(x)return;let e=u.current?.lenis;if(!e){X=window.requestAnimationFrame(V);return}t=N,e.on("scroll",t),C(),U()};V();let q=()=>{C(),U()};m.addEventListener("change",q);let Y=()=>{D(!1),U()};v.addEventListener("change",Y);let K=new ResizeObserver(U);return K.observe(l),window.addEventListener("load",W),window.addEventListener("resize",U),()=>{I.current=null,F.cancel(),window.cancelAnimationFrame(X),window.cancelAnimationFrame(P.current),P.current=0,window.clearTimeout(B),window.removeEventListener("load",W),window.removeEventListener("resize",U),m.removeEventListener("change",q),v.removeEventListener("change",Y),K.disconnect(),t&&u.current?.lenis?.off("scroll",t),$(),D(!1),M(),s.style.removeProperty("--panel-fade")}},[x,u,O,G]);let Y=(0,l.useMemo)(()=>({getProgress:M,subscribe:N,getIntroScrollLength:F,setIntroScrollLength:U,getHeroTextScrollLength:B,setHeroTextScrollLength:W,getIntroSegmentProgress:X,getApproachEntryProgress:z,getHeroTextSegmentProgress:V,getTrackScrollLength:q}),[B,F,M,z,V,X,q,W,U,N]),K=(0,c.getTrackScrollLength)(D,c.DEFAULT_HERO_SCROLL_LENGTH);return(0,t.jsx)(s.StickyTrackContext.Provider,{value:Y,children:(0,t.jsxs)(f,{ref:y,children:[(0,t.jsx)(h,{children:(0,t.jsx)(g,{ref:w,children:e})}),(0,t.jsx)(m,{ref:T,$scrollLength:K}),d?(0,t.jsx)(v,{children:(0,t.jsx)(b,{ref:E,children:d})}):null]})})};x.displayName="StickyTrack",e.s(["default",0,x],229287)},867308,e=>{"use strict";let t=0,r=2,i=.6,n=.4,o=(e=r,i=t,o=n)=>i+e+o;e.s(["APPROACH_HOLD_PX",0,100,"APPROACH_SNAP_BACK_THRESHOLD",0,.5,"DEFAULT_HERO_SCROLL_LENGTH",0,t,"DEFAULT_HERO_TEXT_SCROLL_LENGTH",0,i,"DEFAULT_INTRO_SCROLL_LENGTH",0,r,"INTRO_SNAP_DURATION",0,2,"INTRO_SNAP_VIDEO_THRESHOLD",0,.6,"getApproachEntryProgress",0,(e,t,r,i)=>i<=0?0:Math.min(1,Math.max(0,(e-(t+r-i))/i)),"getHeroTextSegmentProgress",0,(e,a=r,l=t,s=i)=>{let c=o(a,l),d=((e=r,i=t,a=n)=>Math.max(o(e,i,a)-1,0))(a,l);return d<=0||s<=0?0:Math.max(0,Math.min(1,Math.max(0,e-l/c)/(s/d)))},"getIntroCompleteTrackProgress",0,(e=r,i=t,a=n)=>{let l=o(e,i,a);return l<=0?0:Math.min(1,(i+e)/l)},"getIntroOutroSegmentProgress",0,e=>e<=.5?0:Math.min(1,(e-.5)/.5),"getIntroSegmentProgress",0,(e,i=r,n=t)=>{let a=o(i,n);return a<=0?0:Math.max(0,Math.min(1,(e-n/a)/(i/a)))},"getScrollFromTrackProgress",0,(e,t,r,i)=>{let n=r-i;return n<=0?t:t+Math.min(1,Math.max(0,e))*n},"getTrackScrollLength",0,o,"measureStickyTrackProgressFromScroll",0,(e,t,r,i)=>{let n=r-i;return n<=0?0:Math.min(1,Math.max(0,(e-t)/n))},"shouldPauseHeroPlayback",0,e=>e>.002])},115166,e=>{"use strict";var t=e.i(843476),r=e.i(500932),i=e.i(481293);let n=(e,t)=>r=>{r instanceof HTMLElement&&(e.current[t]=r)};var o=e.i(992325),a=e.i(607561),l=e.i(494473),s=e.i(989970),c=e.i(883495),d=e.i(255667),u=e.i(815711),f=e.i(328852),p=e.i(271645),h=e.i(575509),g=e.i(212960),m=e.i(997053);let v="100dvh",b=(0,m.default)(h.Div).attrs({as:"section"}).withConfig({componentId:"sc-3a017878-0"})(()=>m.css`	
        position: relative;
		z-index: 5;
        min-height: calc(var(--count) * ${"75dvh"});
        background: ${(0,h.getBrand)("bc2")};
        overflow: clip;

        ${h.bp.l`
            min-height: calc(var(--count) * ${v});
        `}
    `),x=(0,m.default)(h.Div).attrs({as:"aside"}).withConfig({componentId:"sc-3a017878-1"})(()=>m.css`
        display: none;
		

        ${h.bp.l`
            display: block;
            position: absolute;
            inset: 0;
            z-index: 2;
        `}
	`),y=(0,m.default)(h.Div).withConfig({componentId:"sc-3a017878-2"})(()=>m.css`
		position: relative;
		width: 100%;
		height: ${v};
		overflow: clip;

		${h.bp.l`
			position: sticky;
			top: 0;
			left: 0;
		`}
	`),w=(0,m.default)(h.Div).attrs({as:"picture"}).withConfig({componentId:"sc-3a017878-3"})(()=>m.css`
		display: block;
		position: relative;
		overflow: clip;
		background: ${(0,h.getGlobal)("black")};

		${h.bp.l`
			position: absolute;
			inset: -1.6rem;
		`}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center;
			opacity: 0.4;
			filter: blur(0.8rem);
		}
	`),T=(0,m.default)(h.Div).withConfig({componentId:"sc-3a017878-4"})(()=>m.css`
        position: relative;
        z-index: 2;
    `),E=(0,m.default)(h.Div).attrs({as:"aside"}).withConfig({componentId:"sc-3a017878-5"})(()=>m.css`
        display: none;
            
        ${h.bp.l`
            display: block;
            position: relative;
            z-index: 3;
            height: 100%;
        `}
    `),S=(0,m.default)(h.Div).withConfig({componentId:"sc-3a017878-6"})(()=>m.css`
        position: sticky;
        top: 0; left: 0;

        width: 100%;
        height: ${v};

        display: flex;
        align-items: center;
        justify-content: center;
    `),R=(0,m.default)(h.Div).withConfig({componentId:"sc-3a017878-7"})(()=>m.css`
        position: relative;
        width: 100%;
        aspect-ratio: 1/1;

        background: ${(0,h.getBrand)("bc1")};
	`),A=(0,m.default)(h.Div).attrs({as:"section"}).withConfig({componentId:"sc-3a017878-8"})(()=>m.css`
		position: relative;
		z-index: 2;
	`),$=(0,m.default)(h.Div).attrs({as:"picture"}).withConfig({componentId:"sc-3a017878-9"})(()=>m.css`	
        display: block;
        position: absolute;
        inset: 0;
        z-index: 3;
        overflow: clip;

        /* Initial Starting Styles */
        clip-path: inset(50%);

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    `),C=(0,m.default)(h.Div).attrs({as:"section"}).withConfig({componentId:"sc-3a017878-10"})(()=>m.css`
        position: relative;
        z-index: 3;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        overflow: clip;

        ${h.bp.l`
            height: ${v};
            min-height: ${"60rem"};
        `}
    `),I=(0,m.default)(h.Div).withConfig({componentId:"sc-3a017878-11"})(({theme:e,$isLast:t})=>m.css`
        position: relative;
        height: 100%;
        padding-block: ${(0,h.getGap)("huge")} ${t?(0,h.getGap)("huge"):0};

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        ${h.bp.l`
            height: calc(33.333vw - ${e.grid.gutter.l});
            padding-block: 0;
            justify-content: space-between;
        `}

        em {
            ${g.titleL}
            top: 0; 
            font-style: normal;
        }

        h3 {
            ${g.headlineL}

            margin-top: ${(0,h.getGap)("m")};

            ${h.bp.l` margin-top: 0; `}
        }

        p {
            ${g.bodyL}
            color: ${(0,h.getBrand)("bc5",80)};
            text-wrap: pretty;

            margin-bottom: ${(0,h.getGap)("m")};

            ${h.bp.l`
                margin-bottom: 0;
                text-wrap: balance;
            `}
        }

        /* Layout the content group, not SplitText's generated letter boxes. */
        > div {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;
            gap: ${(0,h.getGap)("s")};
            width: 100%;
        }

        picture {
            position: relative;
            display: block;
            aspect-ratio: 1/1;
            width: 100%;
            overflow: clip;
            margin-block: ${(0,h.getGap)("m")};

            ${h.bp.l` display: none;  `}

            img {
                position: absolute;
                inset: 0;
                object-fit: cover;
                object-position: center;
            }
        }
    `),L=m.default.span.withConfig({componentId:"sc-3a017878-12"})(()=>m.css`
        opacity: 0.6;
    `),_=(0,p.forwardRef)((e,n)=>{let o,a,l,s=(0,r.c)(7),{image:c}=e;s[0]!==c?(o=(0,i.resolveImageWithAlt)(c),s[0]=c,s[1]=o):o=s[1];let d=o;return d?(s[2]!==d?(a=(0,t.jsx)(f.default,{image:d,fill:!0,sizes:"33.33vw"}),s[2]=d,s[3]=a):a=s[3],s[4]!==n||s[5]!==a?(l=(0,t.jsx)($,{ref:n,children:a}),s[4]=n,s[5]=a,s[6]=l):l=s[6],l):null});_.displayName="ClippedImage";let k=(0,p.memo)(_);var j=e.i(156569),P=e.i(124821);let D=(0,p.forwardRef)((e,n)=>{let o,a,l,s,c,d,u,p,h,g,m,v,b,x=(0,r.c)(32),{heading:y,description:w,currentIndex:T,total:E,editAttr:S,image:R,idx:A}=e;x[0]!==R?(o=(0,i.resolveImageWithAlt)(R),x[0]=R,x[1]=o):o=x[1];let $=o;if(!$)return null;let _=A===E-1,k=String(T+1);x[2]!==k?(a=k.padStart(2,"0"),x[2]=k,x[3]=a):a=x[3];let D=String(E);x[4]!==D?(l=D.padStart(2,"0"),x[4]=D,x[5]=l):l=x[5];let H=`/ ${l}`;return x[6]!==H?(s=(0,t.jsx)(L,{children:H}),x[6]=H,x[7]=s):s=x[7],x[8]!==a||x[9]!==s?(c=(0,t.jsxs)("em",{children:[a," ",s]}),x[8]=a,x[9]=s,x[10]=c):c=x[10],x[11]!==$?(d=(0,t.jsx)("picture",{children:(0,t.jsx)(f.default,{image:$,fill:!0,sizes:"(max-width: 1023px) calc(100vw - 32px - 32px), 1px"})}),x[11]=$,x[12]=d):d=x[12],x[13]!==y?(u=(0,t.jsx)("h3",{children:y}),x[13]=y,x[14]=u):u=x[14],x[15]!==S||x[16]!==u?(p=(0,t.jsx)(j.default,{editAttr:S,children:u}),x[15]=S,x[16]=u,x[17]=p):p=x[17],x[18]!==w?(h=(0,t.jsx)("p",{children:w}),x[18]=w,x[19]=h):h=x[19],x[20]!==p||x[21]!==h?(g=(0,t.jsxs)("div",{children:[p,h]}),x[20]=p,x[21]=h,x[22]=g):g=x[22],x[23]===Symbol.for("react.memo_cache_sentinel")?(m=(0,t.jsx)(P.default,{to:"/contact",label:"Start Your Project",aria:"Go to Contact"}),x[23]=m):m=x[23],x[24]!==d||x[25]!==g||x[26]!==_||x[27]!==c?(v=(0,t.jsxs)(I,{$isLast:_,children:[c,d,g,m]}),x[24]=d,x[25]=g,x[26]=_,x[27]=c,x[28]=v):v=x[28],x[29]!==n||x[30]!==v?(b=(0,t.jsx)(C,{ref:n,children:v}),x[29]=n,x[30]=v,x[31]=b):b=x[31],b});D.displayName="RelativeContent";let H=e=>{let h,g,m,v,$,C,I,L,_,j,P,H,O,M,z,N=(0,r.c)(31),{usps:G,documentId:F,documentType:U}=e,B=(0,p.useRef)(null);N[0]===Symbol.for("react.memo_cache_sentinel")?(h=[],N[0]=h):h=N[0];let W=(0,p.useRef)(h);N[1]===Symbol.for("react.memo_cache_sentinel")?(g=[],N[1]=g):g=N[1];let X=(0,p.useRef)(g);N[2]===Symbol.for("react.memo_cache_sentinel")?(m=[],N[2]=m):m=N[2];let V=(0,p.useRef)(m),q=(0,p.useRef)(null),Y=(0,d.useLenis)();return(N[3]!==Y?.rootElement?(v=e=>{let{isDesktop:t}=e,r=X.current,i=Y?.rootElement;if(!i||!r.length)return;if(!t){for(let e of r){let t=e?.querySelector("picture"),r=t?.querySelector("img");t&&r&&s.default.fromTo(r,{scale:1.5},{scale:1,ease:"none",scrollTrigger:{scroller:i,trigger:t,start:"top bottom",end:"center center",scrub:!0}})}return}let n=W.current,o=V.current,a=q.current,l=B.current;if(!n.length||!o.length||!a||!l)return;s.default.set(a,{y:"-25dvh",willChange:"transform"});let d=0,u=1;c.default.create({scroller:i,trigger:l,start:"top bottom",end:"bottom top",onRefresh:e=>{let t=e.end-e.start,r=i.clientHeight;d=t>0?Math.min(1,r/t):0,u=t>0?Math.max(0,(t-r)/t):1},onUpdate:e=>{let t=0;if(e.progress<d&&d>0){let r=e.progress/d;t=s.default.utils.interpolate(-25,0,r)}else if(e.progress>u&&u<1){let r=(e.progress-u)/(1-u);t=s.default.utils.interpolate(0,25,r)}s.default.set(a,{y:`${t}dvh`})}}),s.default.set(n[0],{clipPath:"inset(0% 0% 0% 0%)"}),n.forEach((e,t)=>{if(0===t)return;let n=r[t];e&&n&&s.default.fromTo(e,{clipPath:"inset(50%)"},{clipPath:"inset(0%)",ease:"none",scrollTrigger:{scroller:i,trigger:n,start:"top bottom",end:"top top",scrub:!0}})}),o.forEach((e,t)=>{if(!e)return;let n=t===o.length-1,a=r[t];(0===t&&a&&s.default.from(e,{yPercent:-50,ease:"none",scrollTrigger:{scroller:i,trigger:a,start:"top bottom",end:"top top",scrub:!0,markers:!1}}),n&&a)?s.default.to(e,{yPercent:50,ease:"none",scrollTrigger:{scroller:i,trigger:a,start:"bottom bottom",end:"bottom top",scrub:!0,markers:!1}}):!n&&a&&s.default.to(e,{autoAlpha:0,ease:"none",scrollTrigger:{scroller:i,trigger:a,start:"bottom bottom",end:"bottom top",scrub:!0,markers:!1}})})},N[3]=Y?.rootElement,N[4]=v):v=N[4],N[5]!==Y||N[6]!==G?($={scope:B,dependencies:[G,Y]},N[5]=Y,N[6]=G,N[7]=$):$=N[7],(0,a.useAnimation)(v,$),N[8]!==Y?(C=()=>{if(!Y)return;let e=window.matchMedia("(min-width: 1024px)"),t=null,r=null,i=()=>{if(r?.(),t?.destroy(),r=null,t=null,!e.matches)return;let i=X.current.filter(Boolean);i.length&&(r=(t=new u.default(Y,{type:"proximity",debounce:750})).addElements(i,{align:["start"]}))};return i(),e.addEventListener("change",i),()=>{e.removeEventListener("change",i),r?.(),t?.destroy()}},I=[Y],N[8]=Y,N[9]=C,N[10]=I):(C=N[9],I=N[10]),(0,p.useEffect)(C,I),G?.length)?(N[11]!==G?(L=G.map((e,r)=>{let{image:o,_key:a}=e,l=(0,i.resolveImageWithAlt)(o);return l?.src?(0,t.jsx)(w,{style:{zIndex:-r},ref:n(V,r),children:(0,t.jsx)(f.default,{image:l,fill:!0,sizes:"(min-width: 1024px) 100vw, 0px"})},a):null}),N[11]=G,N[12]=L):L=N[12],N[13]!==L?(_=(0,t.jsx)(x,{children:(0,t.jsx)(y,{children:L})}),N[13]=L,N[14]=_):_=N[14],N[15]!==G?(j=G.map((e,r)=>{let{image:i,_key:o}=e;return(0,t.jsx)(k,{image:i,ref:n(W,r)},o)}),N[15]=G,N[16]=j):j=N[16],N[17]!==j?(P=(0,t.jsx)(E,{$l:"2/7",$xxl:"3/7",children:(0,t.jsx)(S,{children:(0,t.jsx)(R,{ref:q,children:j})})}),N[17]=j,N[18]=P):P=N[18],N[19]!==F||N[20]!==U||N[21]!==G?(H=G.map((e,r)=>{let{heading:i,description:a,_key:l,image:s}=e;return(0,t.jsx)(D,{idx:r,image:s,heading:i,description:a,currentIndex:r,total:G.length,editAttr:(0,o.sanityEditAttr)({id:F,type:U,path:`approachUsps[_key=="${l}"].heading`}),ref:n(X,r)},l)}),N[19]=F,N[20]=U,N[21]=G,N[22]=H):H=N[22],N[23]!==H?(O=(0,t.jsx)(A,{$l:"8/12",$xxl:"8/11",children:H}),N[23]=H,N[24]=O):O=N[24],N[25]!==P||N[26]!==O?(M=(0,t.jsx)(T,{children:(0,t.jsxs)(l.default,{children:[P,O]})}),N[25]=P,N[26]=O,N[27]=M):M=N[27],N[28]!==M||N[29]!==_?(z=(0,t.jsxs)(b,{ref:B,children:[_,M]}),N[28]=M,N[29]=_,N[30]=z):z=N[30],z):null};H.displayName="USPS",e.s(["default",0,H],115166)},456393,e=>{"use strict";e.s(["drawCoverFrame",0,(e,t,r,i)=>{let n=t.displayWidth,o=t.displayHeight,a=Math.max(r/n,i/o),l=n*a,s=o*a;e.clearRect(0,0,r,i),e.drawImage(t,(r-l)/2,(i-s)/2,l,s)},"forceRedrawFrame",0,(e,t)=>{if(!e.manifest)return;let r=Math.min(Math.max(0,Math.round(t)),e.manifest.totalFrames-1);e.refresh(r)},"waitForActiveFrameRuntime",0,e=>new Promise((t,r)=>{if(window.ActiveFrame)return void t();let i=window.setInterval(()=>{if(e?.aborted){window.clearInterval(i),r(new DOMException("Aborted","AbortError"));return}window.ActiveFrame&&(window.clearInterval(i),t())},50);e?.addEventListener("abort",()=>{window.clearInterval(i),r(new DOMException("Aborted","AbortError"))},{once:!0})})])},992325,e=>{"use strict";var t=e.i(776159),r=e.i(989955);e.s(["sanityEditAttr",0,({id:e,type:i,path:n})=>{if(!e||!i)return;let o=t.studioUrl.replace(/\/$/,"");return(0,r.createDataAttribute)({baseUrl:o,projectId:t.projectId,dataset:t.dataset,id:e,type:i,path:n}).toString()}])}]);