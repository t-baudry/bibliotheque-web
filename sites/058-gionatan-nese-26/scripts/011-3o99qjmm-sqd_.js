(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,95057,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={formatUrl:function(){return n},formatWithValidation:function(){return u},urlObjectKeys:function(){return l}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let o=e.r(90809)._(e.r(98183)),s=/https?|ftp|gopher|file/;function n(e){let{auth:t,hostname:r}=e,i=e.protocol||"",a=e.pathname||"",n=e.hash||"",l=e.query||"",u=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?u=t+e.host:r&&(u=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(u+=":"+e.port)),l&&"object"==typeof l&&(l=String(o.urlQueryToSearchParams(l)));let h=e.search||l&&`?${l}`||"";return i&&!i.endsWith(":")&&(i+=":"),e.slashes||(!i||s.test(i))&&!1!==u?(u="//"+(u||""),a&&"/"!==a[0]&&(a="/"+a)):u||(u=""),n&&"#"!==n[0]&&(n="#"+n),h&&"?"!==h[0]&&(h="?"+h),a=a.replace(/[?#]/g,encodeURIComponent),h=h.replace("#","%23"),`${i}${u}${a}${h}${n}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function u(e){return n(e)}},18581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return a}});let i=e.r(71645);function a(e,t){let r=(0,i.useRef)(null),a=(0,i.useRef)(null);return(0,i.useCallback)(i=>{if(null===i){let e=r.current;e&&(r.current=null,e());let t=a.current;t&&(a.current=null,t())}else e&&(r.current=o(e,i)),t&&(a.current=o(t,i))},[e,t])}function o(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},73668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return o}});let i=e.r(18967),a=e.r(52817);function o(e){if(!(0,i.isAbsoluteUrl)(e))return!0;try{let t=(0,i.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,a.hasBasePath)(r.pathname)}catch(e){return!1}}},84508,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"errorOnce",{enumerable:!0,get:function(){return i}});let i=e=>{}},22016,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var i={default:function(){return v},useLinkStatus:function(){return M}};for(var a in i)Object.defineProperty(r,a,{enumerable:!0,get:i[a]});let o=e.r(90809),s=e.r(43476),n=o._(e.r(71645)),l=e.r(95057),u=e.r(8372),h=e.r(18581),d=e.r(18967),c=e.r(5550);e.r(33525);let f=e.r(88540),p=e.r(91949),m=e.r(73668),g=e.r(9396);function v(t){var r,i;let a,o,v,[M,w]=(0,n.useOptimistic)(p.IDLE_LINK_STATUS),b=(0,n.useRef)(null),{href:y,as:T,children:C,prefetch:_=null,passHref:S,replace:P,shallow:E,scroll:L,onClick:R,onMouseEnter:U,onTouchStart:A,legacyBehavior:F=!1,onNavigate:B,transitionTypes:D,ref:z,unstable_dynamicOnHover:O,...N}=t;a=C,F&&("string"==typeof a||"number"==typeof a)&&(a=(0,s.jsx)("a",{children:a}));let V=n.default.useContext(u.AppRouterContext),I=!1!==_,k=!1!==_?null===(i=_)||"auto"===i?g.FetchStrategy.PPR:g.FetchStrategy.Full:g.FetchStrategy.PPR,j="string"==typeof(r=T||y)?r:(0,l.formatUrl)(r);if(F){if(a?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});o=n.default.Children.only(a)}let W=F?o&&"object"==typeof o&&o.ref:z,G=n.default.useCallback(e=>(null!==V&&(b.current=(0,p.mountLinkInstance)(e,j,V,k,I,w)),()=>{b.current&&((0,p.unmountLinkForCurrentNavigation)(b.current),b.current=null),(0,p.unmountPrefetchableInstance)(e)}),[I,j,V,k,w]),H={ref:(0,h.useMergedRef)(G,W),onClick(t){F||"function"!=typeof R||R(t),F&&o.props&&"function"==typeof o.props.onClick&&o.props.onClick(t),!V||t.defaultPrevented||function(t,r,i,a,o,s,l){if("u">typeof window){let u,{nodeName:h}=t.currentTarget;if("A"===h.toUpperCase()&&((u=t.currentTarget.getAttribute("target"))&&"_self"!==u||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(r)){a&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),s){let e=!1;if(s({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:d}=e.r(99781);n.default.startTransition(()=>{d(r,a?"replace":"push",!1===o?f.ScrollBehavior.NoScroll:f.ScrollBehavior.Default,i.current,l)})}}(t,j,b,P,L,B,D)},onMouseEnter(e){F||"function"!=typeof U||U(e),F&&o.props&&"function"==typeof o.props.onMouseEnter&&o.props.onMouseEnter(e),V&&I&&(0,p.onNavigationIntent)(e.currentTarget,!0===O)},onTouchStart:function(e){F||"function"!=typeof A||A(e),F&&o.props&&"function"==typeof o.props.onTouchStart&&o.props.onTouchStart(e),V&&I&&(0,p.onNavigationIntent)(e.currentTarget,!0===O)}};return(0,d.isAbsoluteUrl)(j)?H.href=j:F&&!S&&("a"!==o.type||"href"in o.props)||(H.href=(0,c.addBasePath)(j)),v=F?n.default.cloneElement(o,H):(0,s.jsx)("a",{...N,...H,children:a}),(0,s.jsx)(x.Provider,{value:M,children:v})}e.r(84508);let x=(0,n.createContext)(p.IDLE_LINK_STATUS),M=()=>(0,n.useContext)(x);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},23793,e=>{"use strict";var t=e.i(43476),r=e.i(71645),i=e.i(90072),a=e.i(8560),o=e.i(89970),s=e.i(23490);let n={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var l=i;class u{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}let h=new l.OrthographicCamera(-1,1,1,-1,0,1);class d extends l.BufferGeometry{constructor(){super(),this.setAttribute("position",new l.Float32BufferAttribute([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([0,2,0,0,2,0],2))}}let c=new d;class f{constructor(e){this._mesh=new l.Mesh(c,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,h)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class p extends u{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof i.ShaderMaterial?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=i.UniformsUtils.clone(e.uniforms),this.material=new i.ShaderMaterial({name:void 0!==e.name?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new f(this.material)}render(e,t,r){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=r.texture),this._fsQuad.material=this.material,this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil)),this._fsQuad.render(e)}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class m extends u{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,r){let i,a,o=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0),this.inverse?(i=0,a=1):(i=1,a=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(o.REPLACE,o.REPLACE,o.REPLACE),s.buffers.stencil.setFunc(o.ALWAYS,i,0xffffffff),s.buffers.stencil.setClear(a),s.buffers.stencil.setLocked(!0),e.setRenderTarget(r),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(o.EQUAL,1,0xffffffff),s.buffers.stencil.setOp(o.KEEP,o.KEEP,o.KEEP),s.buffers.stencil.setLocked(!0)}}class g extends u{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class v{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),void 0===t){const r=e.getSize(new i.Vector2);this._width=r.width,this._height=r.height,(t=new i.WebGLRenderTarget(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:i.HalfFloatType})).texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new p(n),this.copyPass.material.blending=i.NoBlending,this.timer=new i.Timer}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);-1!==t&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),void 0===e&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),r=!1;for(let t=0,i=this.passes.length;t<i;t++){let i=this.passes[t];if(!1!==i.enabled){if(i.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),i.render(this.renderer,this.writeBuffer,this.readBuffer,e,r),i.needsSwap){if(r){let t=this.renderer.getContext(),r=this.renderer.state.buffers.stencil;r.setFunc(t.NOTEQUAL,1,0xffffffff),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),r.setFunc(t.EQUAL,1,0xffffffff)}this.swapBuffers()}void 0!==m&&(i instanceof m?r=!0:i instanceof g&&(r=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(void 0===e){let t=this.renderer.getSize(new i.Vector2);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,(e=this.renderTarget1.clone()).setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let r=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(r,i),this.renderTarget2.setSize(r,i);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(r,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class x extends u{constructor(e,t,r=null,a=null,o=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=r,this.clearColor=a,this.clearAlpha=o,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new i.Color}render(e,t,r){let i,a,o=e.autoClear;e.autoClear=!1,null!==this.overrideMaterial&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),null!==this.clearColor&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),null!==this.clearAlpha&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),!0==this.clearDepth&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:r),!0===this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),null!==this.clearColor&&e.setClearColor(this._oldClearColor),null!==this.clearAlpha&&e.setClearAlpha(i),null!==this.overrideMaterial&&(this.scene.overrideMaterial=a),e.autoClear=o}}let M={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new i.Color(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class w extends u{constructor(e,t=1,r,a){super(),this.strength=t,this.radius=r,this.threshold=a,this.resolution=void 0!==e?new i.Vector2(e.x,e.y):new i.Vector2(256,256),this.clearColor=new i.Color(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let o=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);this.renderTargetBright=new i.WebGLRenderTarget(o,s,{type:i.HalfFloatType}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){const t=new i.WebGLRenderTarget(o,s,{type:i.HalfFloatType});t.texture.name="UnrealBloomPass.h"+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);const r=new i.WebGLRenderTarget(o,s,{type:i.HalfFloatType});r.texture.name="UnrealBloomPass.v"+e,r.texture.generateMipmaps=!1,this.renderTargetsVertical.push(r),o=Math.round(o/2),s=Math.round(s/2)}this.highPassUniforms=i.UniformsUtils.clone(M.uniforms),this.highPassUniforms.luminosityThreshold.value=a,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new i.ShaderMaterial({uniforms:this.highPassUniforms,vertexShader:M.vertexShader,fragmentShader:M.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];o=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new i.Vector2(1/o,1/s),o=Math.round(o/2),s=Math.round(s/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1,this.compositeMaterial.uniforms.bloomFactors.value=[1,.8,.6,.4,.2],this.bloomTintColors=[new i.Vector3(1,1,1),new i.Vector3(1,1,1),new i.Vector3(1,1,1),new i.Vector3(1,1,1),new i.Vector3(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=i.UniformsUtils.clone(n.uniforms),this.blendMaterial=new i.ShaderMaterial({uniforms:this.copyUniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,premultipliedAlpha:!0,blending:i.AdditiveBlending,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new i.Color,this._oldClearAlpha=1,this._basic=new i.MeshBasicMaterial,this._fsQuad=new f(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let r=Math.round(e/2),a=Math.round(t/2);this.renderTargetBright.setSize(r,a);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(r,a),this.renderTargetsVertical[e].setSize(r,a),this.separableBlurMaterials[e].uniforms.invSize.value=new i.Vector2(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2)}render(e,t,r,i,a){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let s=this.renderTargetBright;for(let t=0;t<this.nMips;t++)this._fsQuad.material=this.separableBlurMaterials[t],this.separableBlurMaterials[t].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[t].uniforms.direction.value=w.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[t]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[t].uniforms.colorTexture.value=this.renderTargetsHorizontal[t].texture,this.separableBlurMaterials[t].uniforms.direction.value=w.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[t]),e.clear(),this._fsQuad.render(e),s=this.renderTargetsVertical[t];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?e.setRenderTarget(null):e.setRenderTarget(r),this._fsQuad.render(e),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[],r=e/3;for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(r*r))/r);return new i.ShaderMaterial({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new i.Vector2(.5,.5)},direction:{value:new i.Vector2(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new i.ShaderMaterial({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}w.BlurDirectionX=new i.Vector2(1,0),w.BlurDirectionY=new i.Vector2(0,1);let b={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class y extends u{constructor(){super(),this.isOutputPass=!0,this.uniforms=i.UniformsUtils.clone(b.uniforms),this.material=new i.RawShaderMaterial({name:b.name,uniforms:this.uniforms,vertexShader:b.vertexShader,fragmentShader:b.fragmentShader}),this._fsQuad=new f(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,r){this.uniforms.tDiffuse.value=r.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},i.ColorManagement.getTransfer(this._outputColorSpace)===i.SRGBTransfer&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===i.LinearToneMapping?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===i.ReinhardToneMapping?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===i.CineonToneMapping?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===i.ACESFilmicToneMapping?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===i.AgXToneMapping?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===i.NeutralToneMapping?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===i.CustomToneMapping&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),!0===this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil)),this._fsQuad.render(e)}dispose(){this.material.dispose(),this._fsQuad.dispose()}}let T=`
  varying vec2 vN;
  varying vec3 vWorldPos; // world-space position, for the eye-laser spill light
  varying vec3 vWorldN;   // world-space normal, for the spill's lambert term
  void main() {
    vec3 e = normalize(vec3(modelViewMatrix * vec4(position, 1.0)));
    vec3 n = normalize(normalMatrix * normal);
    vec3 r = reflect(e, n);
    float m = 2.0 * sqrt(r.x*r.x + r.y*r.y + (r.z+1.0)*(r.z+1.0));
    vN = r.xy / m + 0.5;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vWorldN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,C=`
  uniform sampler2D uMatcap;
  uniform float     uGamma;
  uniform float     uExposure;
  uniform float     uModelBrightness;
  uniform float     uContrast;
  uniform float     uSaturation;
  uniform float     uLaser;         // self-emissive red (0 = off); driven on the eyes
  uniform vec3      uLaserColor;    // laser tint
  uniform float     uLaserLight;    // red LIGHT the glowing eyes cast on the face
  uniform vec3      uLaserLightPos; // world-space origin of that light (between the eyes)
  uniform float     uLaserRange;    // world-space reach of the spill falloff
  uniform vec3      uSpillColor;    // spill tint — deep red charged, warms white-hot firing
  uniform float     uFireDarken;    // mid-blast dim of the base shading (0 = none)
  varying vec2 vN;
  varying vec3 vWorldPos;
  varying vec3 vWorldN;
  void main() {
    vec4  mc = texture2D(uMatcap, vN);
    vec3  c  = mc.rgb;
    c  = pow(max(c, 0.0), vec3(1.0 / max(uGamma, 0.001)));
    c *= uExposure;
    c += uModelBrightness;
    c = (c - 0.5) * uContrast + 0.5;
    float lum = dot(c, vec3(0.299, 0.587, 0.114));
    c = mix(vec3(lum), c, uSaturation);
    // Mid-blast the beams outgun the room light, so the base shading falls
    // into shadow (like the ref: Homelander's face goes dark and moody while
    // firing) and the warm spill below becomes the face's dominant light.
    c *= 1.0 - uFireDarken;
    // Additive laser emissive — pushed well past the bloom threshold so the
    // eyes visibly glow/bleed red as they charge.
    c += uLaserColor * uLaser;
    // Red spill: the charged/firing eyes behave as a red point light, so the
    // face around them reddens — brightest on surfaces near the eyes AND turned
    // toward them. Soft distance falloff, plus a wrapped lambert so grazing
    // faces still catch some (a lit-room bounce, not a hard spotlight). This is
    // what sells the beam on the model itself; 0 on the head at rest.
    if (uLaserLight > 0.0001) {
      vec3  L    = uLaserLightPos - vWorldPos;
      float dist = length(L);
      L /= max(dist, 1e-4);
      float atten = 1.0 - smoothstep(0.0, uLaserRange, dist);
      atten *= atten;
      float ndl  = max(dot(normalize(vWorldN), L), 0.0);
      float wrap = ndl * 0.75 + 0.25;
      c += uSpillColor * (uLaserLight * atten * wrap);
    }
    c = max(c, 0.0);
    gl_FragColor = vec4(c, mc.a);
  }
`;e.s(["default",0,function(){let e=(0,r.useRef)(null);return(0,r.useEffect)(()=>{let t=e.current;if(!t)return;let r="#ff0000",n="#ff0000",l="#ffd8c6",u=t.clientWidth,h=t.clientHeight,d=Math.min(window.devicePixelRatio,2),c=new i.Scene;c.background=null;let f=new i.PerspectiveCamera(45,u/h,.1,100);f.position.set(0,0,13);let p=new a.WebGLRenderer({antialias:!0,alpha:!0});p.setPixelRatio(d),p.setSize(u,h),p.outputColorSpace=i.SRGBColorSpace,p.toneMapping=i.ACESFilmicToneMapping,p.toneMappingExposure=1.1,p.setClearColor(0,0),p.domElement.style.display="block",t.appendChild(p.domElement);let m=new i.TextureLoader().load("/Model/MatCap.jpg"),g=[],M=()=>{let e={uMatcap:{value:m},uGamma:{value:.1},uExposure:{value:.596},uModelBrightness:{value:-.05},uContrast:{value:1.281},uSaturation:{value:1.305},uLaser:{value:0},uLaserColor:{value:new i.Color(r)},uLaserLight:{value:0},uLaserLightPos:{value:new i.Vector3},uLaserRange:{value:1},uSpillColor:{value:new i.Color(r)},uFireDarken:{value:0}};return g.push(e),{m:new i.ShaderMaterial({uniforms:e,vertexShader:T,fragmentShader:C,depthWrite:!0,depthTest:!0}),u:e}},b=M(),_=M(),S=b.u,P=_.u,E=new v(p);E.setPixelRatio(d),E.setSize(u,h),E.addPass(new x(c,f));let L=new w(new i.Vector2(u,h),.213,.16,.85);E.addPass(L),E.addPass(new y);let R=null,U=null,A=[],F={x:0,y:0,z:0},B={x:0,y:0,z:0};new s.GLTFLoader().load("/Model/model.glb",e=>{R=e.scene;let t=new i.Box3().setFromObject(R);if(R.position.sub(t.getCenter(new i.Vector3)),R.userData.halfH=t.getSize(new i.Vector3).y/2,R.traverse(e=>{if(!e.isMesh)return;let t=/eyes/i.test(e.name);e.material=t?_.m:b.m,t&&(U=e)}),U){U.geometry.computeBoundingBox();let e=U.geometry.boundingBox,t=e.getCenter(new i.Vector3),r=U.geometry.attributes.position,a=[{x:0,y:0,n:0},{x:0,y:0,n:0}];for(let e=0;e<r.count;e++){let i=r.getX(e)<t.x?a[0]:a[1];i.x+=r.getX(e),i.y+=r.getY(e),i.n+=1}a.forEach(r=>{let a=new i.Object3D;a.position.set(r.n?r.x/r.n:t.x,r.n?r.y/r.n:t.y,e.max.z),U.add(a),A.push(a)})}c.add(R)});let D="ontouchstart"in window||navigator.maxTouchPoints>0,z=new i.Vector2(-100,-100),O=new i.Raycaster,N=!1,V=!1,I=0,k=!1,j=!1,W={rx:0,rz:0,py:0,pz:0},G=null,H=()=>{!N&&R&&(N=!0,G?.kill(),G=o.default.timeline().to(W,{rx:-.07,pz:-.035,duration:.35,ease:"power1.inOut"}).to(W,{rx:.24,rz:.05,py:.3,pz:.4,duration:.45,ease:"power2.inOut"}).call(()=>{k=!0},[],.35+.45*.55).to(W,{rx:-.14,py:.3,duration:3.5,ease:"power1.inOut"},"+=0.1"))},Q=e=>!!R&&(z.set(e.clientX/window.innerWidth*2-1,-(2*(e.clientY/window.innerHeight))+1),O.setFromCamera(z,f),O.intersectObject(R,!0).length>0),K=!1,X=e=>{if("touch"===e.pointerType){if(ts(),N||!Q(e))return;K=!0,V=!0,ek();return}Q(e)&&(j=!0,H())},q=e=>{"touch"===e.pointerType&&K&&(K=!1,V=!1,H())},$=()=>{K&&(K=!1,V=!1,eI())};window.addEventListener("pointerdown",X),window.addEventListener("pointerup",q),window.addEventListener("pointercancel",$);let Y=0,J=0,Z="idle",ee=0,et=0,er=0,ei=0,ea=0,eo=0,es=0,en=1,el=e=>{er=Math.max(er,e)},eu=`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,eh=`
      uniform vec3  uColor;
      uniform float uIntensity;
      varying vec2  vUv;
      void main() {
        // Soft across the width: bright centreline (vUv.x=0.5) → 0 at edges.
        float edge   = clamp(abs(vUv.x - 0.5) * 2.0, 0.0, 1.0);
        float radial = pow(1.0 - edge, 2.2);
        // Along the length: quick ramp-up at the eye, gentle dissipation at the tip.
        float lenFade = smoothstep(0.0, 0.04, vUv.y) * (1.0 - smoothstep(0.68, 1.0, vUv.y));
        gl_FragColor = vec4(uColor, radial * lenFade * uIntensity);
      }
    `,ed=new i.PlaneGeometry(1,1),ec=e=>{let t={uColor:{value:new i.Color(e)},uIntensity:{value:0}},r=new i.ShaderMaterial({uniforms:t,vertexShader:eu,fragmentShader:eh,transparent:!0,blending:i.AdditiveBlending,depthWrite:!1,depthTest:!1}),a=new i.Mesh(ed,r);return a.renderOrder=999,a.visible=!1,c.add(a),{m:a,u:t}},ef=[{glow:ec(n),core:ec(l)},{glow:ec(n),core:ec(l)}],ep=(e,t,r)=>{let a=new Uint8Array(e*t*4);for(let i=0;i<t;i++)for(let t=0;t<e;t++){let[o,s,n,l]=r(t+.5,i+.5),u=(i*e+t)*4;a[u]=o,a[u+1]=s,a[u+2]=n,a[u+3]=Math.round(255*Math.min(1,Math.max(0,l)))}let o=new i.DataTexture(a,e,t);return o.minFilter=i.LinearMipmapLinearFilter,o.magFilter=i.LinearFilter,o.generateMipmaps=!0,o.needsUpdate=!0,o},em=(e,t)=>{if(t<=e[0][0])return e[0][1];for(let r=1;r<e.length;r++)if(t<=e[r][0]){let[i,a]=e[r-1],[o,s]=e[r],n=(t-i)/(o-i);return a.map((e,t)=>e+(s[t]-e)*n)}return e[e.length-1][1]},eg=[[0,[255,255,255,1]],[.25,[255,150,90,.85]],[1,[255,0,0,0]]],ev=ep(128,128,(e,t)=>em(eg,Math.hypot(e-64,t-64)/64)),ex=()=>{let e=new i.SpriteMaterial({map:ev,color:0xffffff,transparent:!0,blending:i.AdditiveBlending,depthWrite:!1,depthTest:!1}),t=new i.Sprite(e);return t.renderOrder=998,t.visible=!1,c.add(t),t},eM=[ex(),ex()],ew=new i.Color(0xffffff),eb=new i.Color("#fff2e2"),ey=new i.Color("#ffa06a"),eT=new i.Color("#ff8a4a"),eC=new i.Color,e_=ep(256,64,(e,t)=>[255,255,255,(1-2*Math.abs(t/64-.5))*(1-2*Math.abs(e/256-.5))]),eS=()=>{let e=new i.SpriteMaterial({map:e_,color:0xffffff,transparent:!0,opacity:0,blending:i.AdditiveBlending,depthWrite:!1,depthTest:!1}),t=new i.Sprite(e);return t.renderOrder=997,t.visible=!1,c.add(t),t},eP=[eS(),eS()],eE=[[0,[255,40,20,.9]],[.45,[255,20,10,.35]],[1,[255,0,0,0]]],eL=ep(256,256,(e,t)=>em(eE,Math.hypot(e-128,t-128)/128)),eR=new i.Sprite(new i.SpriteMaterial({map:eL,transparent:!0,opacity:0,blending:i.AdditiveBlending,depthWrite:!1,depthTest:!1}));eR.position.set(0,0,-6),eR.scale.set(24,24,1),eR.renderOrder=900,eR.visible=!1,c.add(eR);let eU=new Audio("/audio/hi.mp3");eU.preload="auto",eU.volume=.7;let eA=!1,eF=()=>{eA||(eA=!0,eV(),eU.play().then(()=>{eU.pause(),eU.currentTime=0}).catch(()=>{}))};window.addEventListener("pointerdown",eF),window.addEventListener("keydown",eF);let eB=null,eD=null,ez=null,eO=null,eN=null,eV=()=>{eD||((eN=(eD=new(window.AudioContext||window.webkitAudioContext)).createGain()).gain.value=.7,eN.connect(eD.destination),fetch("/audio/hover.mp3").then(e=>e.arrayBuffer()).then(e=>eD.decodeAudioData(e)).then(e=>{ez=e}).catch(()=>{}))},eI=()=>{if(eO){try{eO.stop()}catch{}eO.disconnect(),eO=null}},ek=()=>{!N&&ez&&(eI(),"suspended"===eD.state&&eD.resume().catch(()=>{}),eN.gain.value=.7,(eO=eD.createBufferSource()).buffer=ez,eO.loop=!0,eO.loopStart=2.5,eO.loopEnd=Math.min(3.5,ez.duration),eO.connect(eN),eO.start(0))},ej=new i.Vector3,eW=new i.Vector3,eG=new i.Quaternion,eH=new i.Vector3,eQ=new i.Vector3,eK=new i.Vector3,eX=new i.Vector3,eq=new i.Matrix4,e$=new i.Vector3,eY=new i.Vector3,eJ=new i.Vector3,eZ=new i.Vector3,e0=new i.Vector3,e1=new i.Vector3,e2=new i.Vector3,e5=(e,t,r,i,a,o)=>{let s=e.m,n=o>.01&&i>.01;s.visible=n,n&&(s.position.copy(t).addScaledVector(r,i/2),eX.copy(f.position).sub(s.position).normalize(),eQ.copy(r),eH.copy(r).cross(eX),1e-6>eH.lengthSq()?eH.set(1,0,0):eH.normalize(),eK.copy(eH).cross(eQ).normalize(),eq.makeBasis(eH,eQ,eK),s.quaternion.setFromRotationMatrix(eq),s.scale.set(a,i,1),e.u.uIntensity.value=o)},e3=!1,e4=e=>{if(D)return;let t=(e.clientX-window.innerWidth/2)/(window.innerWidth/2),r=(e.clientY-window.innerHeight/2)/(window.innerHeight/2);if(F.x=i.MathUtils.clamp(.5*r,-.5,.5),F.y=i.MathUtils.clamp(.5*t,-.7,.7),F.z=.12*t,R){z.set(e.clientX/window.innerWidth*2-1,-(2*(e.clientY/window.innerHeight))+1),O.setFromCamera(z,f);let t=O.intersectObject(R,!0).length>0;t!==e3&&(V=t,t?ek():eI()),e3=t}};window.addEventListener("mousemove",e4);let e8=null,e6=!1,e9={nx:0,ny:0},e7={nx:0,ny:0},te={x:0,y:0},tt={x:0,y:0},tr=e=>Math.tanh(1.2*e)/Math.tanh(1.2),ti=e=>{let t,r;if(null==e.beta||null==e.gamma)return;let i=screen.orientation&&"number"==typeof screen.orientation.angle?screen.orientation.angle:"number"==typeof window.orientation?window.orientation:0;if(90===i?(t=-e.gamma,r=e.beta):-90===i||270===i?(t=e.gamma,r=-e.beta):(t=e.beta,r=e.gamma),!e8){e8={x:t,y:r};return}e6=!0;e9.nx=tr((r-e8.y)/40),e9.ny=tr((t-e8.x)/40)},ta=!1,to=()=>{ta||(ta=!0,window.addEventListener("deviceorientation",ti,!0))},ts=()=>{e8=null;let e=window.DeviceOrientationEvent;e&&"function"==typeof e.requestPermission?e.requestPermission().then(e=>{"granted"===e&&to()}).catch(()=>{}):e&&to()};D&&window.DeviceOrientationEvent&&"function"!=typeof window.DeviceOrientationEvent.requestPermission&&to();let tn=new i.Timer;tn.connect(document);let tl=0,tu=e=>{tl=requestAnimationFrame(tu),tn.update(e);let t=tn.getDelta(),a=tn.getElapsed();if(R){if(D&&e6){let e=1-Math.exp(-t/.16);e7.nx+=(e9.nx-e7.nx)*e,e7.ny+=(e9.ny-e7.ny)*e,F.x=i.MathUtils.clamp(1.4*e7.ny,-.82,.82),F.y=i.MathUtils.clamp(1.4*e7.nx,-.8,.8),F.z=.28*e7.nx,te.x=.3*e7.nx,te.y=-(.3*e7.ny)}let e=D?N:j,s=e?F.x:0,d=e?F.y:0,c=e?F.z:0;B.x=i.MathUtils.lerp(B.x,s,.08),B.y=i.MathUtils.lerp(B.y,d,.08),B.z=i.MathUtils.lerp(B.z,c,.08),R.rotation.x=B.x+W.rx,R.rotation.y=B.y,R.rotation.z=B.z+W.rz,en+=(!N-en)*(1-Math.exp(-t/.35));let p=D&&N;if(tt.x=i.MathUtils.lerp(tt.x,p?te.x:0,.08),tt.y=i.MathUtils.lerp(tt.y,p?te.y:0,.08),R.position.y=-.2+.12*Math.sin(1.5*a)*en+W.py+tt.y,R.position.x=tt.x,R.position.z=W.pz,R.userData.halfH){let e=f.position.z,t=2*Math.tan(i.MathUtils.degToRad(f.fov/2))*e,r=u<=1024?.85:1;R.scale.setScalar(200/h*t/(2*R.userData.halfH)*r)}let m=V||N?1:0;I+=(m-I)*(1-Math.exp(-t/.23));let v=I,x=.5+.5*Math.sin(a*(10+38*v)),M=0*(.8+.2*Math.sin(2*a));er*=Math.exp(-(6*t)),ei*=Math.exp(-(5*t)),ea*=Math.exp(-(8*t)),eo*=Math.exp(-t/1.4);let w="idle"===Z?v*(1-Y):0;if(w>.01){let e=.021*w*.5;R.rotation.x+=(Math.sin(67*a)+.5*Math.sin(41*a))*e,R.rotation.y+=(Math.cos(59*a)+.5*Math.sin(37*a))*e}if("idle"===Z){if(k){k=!1,eI(),1;eB?.kill(),eU.volume=.7;try{eU.currentTime=.5}catch{}eU.play().catch(()=>{});el(.06),ei=Math.max(ei,.6),ea=1,Z="firing",ee=0}J=Y=i.MathUtils.lerp(Y,0,.25)}else"firing"===Z?(ee+=t,J=Y=i.MathUtils.lerp(Y,1,.3),ee>=10&&(Z="sputter",ee=0,eB?.kill(),eB=o.default.to(eU,{volume:0,duration:1.2,ease:"power1.out",onComplete:()=>{eU.pause(),eU.volume=.7}}))):"sputter"===Z?(ee+=t,Y=1,J=1,ee>=.32&&(Z="exit",ee=0,et=0,ea=Math.max(ea,.8),ei=Math.max(ei,.35),el(.03),eo=1,G?.kill(),G=o.default.to(W,{rx:0,rz:0,py:0,pz:0,duration:1.1,ease:"power2.inOut"}))):(ee+=t,et=i.MathUtils.clamp(ee/.22,0,1),J=1,Y=i.MathUtils.lerp(Y,0,.35),et>=1&&(et=0,Y=0,J=0,Z="idle",N=!1,j=!1));let b=M+2.3*v+x*v*4.5+3*Y+.8*eo;if(P.uLaser.value=i.MathUtils.lerp(P.uLaser.value,b,.12),2===A.length&&U){eW.set(0,0,1).applyQuaternion(U.getWorldQuaternion(eG)).normalize();let e=+("sputter"===Z),i=1+.26*(1+2.2*e)*(Math.random()-.5+.5*Math.sin(40*a)),o=1-.45*e*Math.abs(Math.sin(47*a)*Math.sin(29*a)),s=24*J,u=et*et*30,h="exit"===Z?1-et*et:1,d=("exit"===Z?1-.5*et:1)*o,c="exit"===Z?h:Y*o,p=0+.35*v*(1-Y)+Y+ea;A[0].getWorldPosition(e$),A[1].getWorldPosition(eY),eJ.addVectors(e$,eY).multiplyScalar(.5);let m=e$.distanceTo(eY),x=(.7*v+.6*Y+.4*eo)*.8*(1+(i-1)*Y*.5),M=Math.min(Y,1);eC.set(r).lerp(ey,.45*M);let w=8.5*m*(.55+.25*M);for(let e of g)e.uLaserLight.value=x,e.uLaserLightPos.value.copy(eJ),e.uLaserRange.value=w,e.uSpillColor.value.copy(eC);S.uFireDarken.value=.15*M,P.uLaserColor.value.set(r).lerp(eb,.6*M),e0.subVectors(eY,e$),e1.setFromMatrixColumn(f.matrixWorld,0),e2.setFromMatrixColumn(f.matrixWorld,1);let b=e0.dot(e1),y=e0.dot(e2),T=Math.atan2(y,b),C=Math.hypot(b,y)/Math.max(e0.length(),1e-4),_=(.9*v+.9*Y)*i,E=2.2*m*(.35+.65*C),L=.15*m;for(let e=0;e<2;e++){let t=eP[e];t.visible=_>.01,t.visible&&(A[e].getWorldPosition(ej),t.position.copy(ej),t.scale.set(E,L,1),t.material.rotation=T,t.material.opacity=Math.min(_,1.1),t.material.color.set(r).lerp(ew,.7*Math.min(Y,1)))}for(let e=0;e<2;e++){A[e].getWorldPosition(ej),ef[e].glow.u.uColor.value.set(n),ef[e].core.u.uColor.value.set(l),eZ.copy(ej).addScaledVector(eW,u),e5(ef[e].glow,eZ,eW,s,.825*i*d,.71*c),e5(ef[e].core,eZ,eW,s,.44*i*d,.64*c);let t=eM[e];if(t.visible=p>.01,t.visible){t.position.copy(ej);let e=.75*(.4+.7*p)*i;t.scale.set(e,e,1),t.material.opacity=Math.min(p,1),t.material.color.set(r).lerp(ew,.6*Math.min(Y,1))}}let R=.03*v+.06*Y,F=R>es?.12:.4;es+=(R-es)*(1-Math.exp(-t/F)),eR.material.color.set(r).lerp(eT,.5*M),eR.material.opacity=es*(1+(i-1)*Y),eR.visible=eR.material.opacity>.004}let y=er+.012*Y;y>2e-4?(f.position.x=(Math.sin(47*a)+.6*Math.sin(23.7*a))*y*.6,f.position.y=(Math.cos(41.3*a)+.6*Math.sin(31.1*a))*y*.6):(f.position.x=0,f.position.y=0),L.strength=.213+(.12*v+.3*Y+ei)*.45}E.render()};tu();let th=()=>{u=t.clientWidth,h=t.clientHeight,f.aspect=u/h,f.updateProjectionMatrix(),p.setSize(u,h),E.setSize(u,h)};return window.addEventListener("resize",th),()=>{cancelAnimationFrame(tl),tn.dispose(),window.removeEventListener("mousemove",e4),window.removeEventListener("pointerdown",X),window.removeEventListener("pointerup",q),window.removeEventListener("pointercancel",$),window.removeEventListener("deviceorientation",ti,!0),window.removeEventListener("resize",th),window.removeEventListener("pointerdown",eF),window.removeEventListener("keydown",eF),G?.kill(),eB?.kill(),eU.pause(),eI(),eD?.close().catch(()=>{}),b.m.dispose(),_.m.dispose(),ed.dispose(),ef.forEach(e=>{e.glow.m.material.dispose(),e.core.m.material.dispose()}),eM.forEach(e=>e.material.dispose()),ev.dispose(),eP.forEach(e=>e.material.dispose()),e_.dispose(),eR.material.dispose(),eL.dispose(),m.dispose(),c.traverse(e=>{e.geometry&&e.geometry.dispose()}),E.dispose(),p.dispose(),p.domElement.parentNode&&p.domElement.parentNode.removeChild(p.domElement)}},[]),(0,t.jsx)("div",{ref:e,style:{position:"absolute",inset:0,width:"100%",height:"100%"}})}],23793)}]);