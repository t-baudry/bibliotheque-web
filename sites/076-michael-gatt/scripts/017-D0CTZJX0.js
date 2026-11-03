import{b8 as i,aE as a,b9 as s,b0 as n,ba as o}from"./CaSYcmUf.js";import{P as f,F as u}from"./BXV2wtrx.js";import{C as d}from"./BzTUYzf6.js";const x={name:"BlendShader",uniforms:{tDiffuse1:{value:null},tDiffuse2:{value:null},mixRatio:{value:.5},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;
		uniform float mixRatio;

		uniform sampler2D tDiffuse1;
		uniform sampler2D tDiffuse2;

		varying vec2 vUv;

		void main() {

			vec4 texel1 = texture2D( tDiffuse1, vUv );
			vec4 texel2 = texture2D( tDiffuse2, vUv );
			gl_FragColor = opacity * mix( texel1, texel2, mixRatio );

		}`};class p extends f{constructor(e){super();const t=d;this.textureID="tDiffuse",this.uniforms=i.clone(t.uniforms),this.material=new a({uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader,blending:s}),this.renderTarget=e,this.renderTarget===void 0&&(this.renderTarget=new n(1,1,{type:o}),this.renderTarget.texture.name="SavePass.rt"),this.needsSwap=!1,this.fsQuad=new u(this.material)}render(e,t,r){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=r.texture),e.setRenderTarget(this.renderTarget),this.clear&&e.clear(),this.fsQuad.render(e)}setSize(e,t){this.renderTarget.setSize(e,t)}dispose(){this.renderTarget.dispose(),this.material.dispose(),this.fsQuad.dispose()}}export{x as B,p as S};
