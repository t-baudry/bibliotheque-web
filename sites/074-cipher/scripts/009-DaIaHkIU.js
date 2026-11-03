import{S as l,O as u,W as h,P as o,a as m,b as p,M as d}from"./CO3m5LEz.js";import{g as e}from"./DhfWlwu_.js";var c=`void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,v=`uniform vec2 uResolution;
uniform float uRx;
uniform float uRy;
uniform float uTilt;
uniform float uGridSpacing;
uniform float uPointSize;
uniform float uTime;
uniform float uTiltProgress;
uniform float uProgress;
uniform float uProgress2;
uniform float uProgress3;
uniform float uFill;
uniform float uOpacity;
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
vec2 px;
px.x = gl_FragCoord.x - uResolution.x * 0.5;
px.y = (uResolution.y - gl_FragCoord.y) - uResolution.y * 0.5;

  vec2 cell = mod(px, uGridSpacing);
  float cellHalf = uGridSpacing * 0.5;
  vec2 d = abs(cell - cellHalf);
  float pointHalf = uPointSize;
  if (d.x > pointHalf || d.y > pointHalf) discard;

  vec2 gridPos = px - cell;

float currentTilt = uTilt + (2. * uTiltProgress);
float cos_t = cos(-currentTilt);
float sin_t = sin(-currentTilt);

  float rx = (gridPos.x * cos_t - gridPos.y * sin_t) * (0.003 + uProgress);
  float ry = (gridPos.x * sin_t + gridPos.y * cos_t) * (0.003 + uProgress3);

  float ex = rx / (uRx * uResolution.x * 0.5) ;
  float ey = ry / (uRy * uResolution.y * 0.5) ;
  float ellipseDist = sqrt(ex * ex + ey * ey);

  if (ellipseDist < 1.0) {
    float n = (snoise(gridPos * 0.1  + (uTime * 1.- uFill)) + 1.0) * 3.8;
    float probability = exp(ellipseDist * 5.6 - 5.0) + n * (0.24 * (uProgress2 - 0.0) ) * ellipseDist;
    if (probability < 0.99 * uFill) discard;
  }

  gl_FragColor = vec4(0.0, 0.0, 0.0, uOpacity);
}`;class x{constructor(t,i,r,s,a,n){this.container=t,this.toggle=r,this.open=a,this.close=n,this.hide=s,this.animationFrameId=null,this.width=window.innerWidth,this.height=window.innerHeight,this.isMobile=i,this._renderBound=this.render.bind(this),this.rx=this.isMobile?1.1:.5,this.ry=this.isMobile?1.25:.4,this.tilt=this.isMobile?Math.PI/6.7:-Math.PI/6.7,this.gridSpacing=this.isMobile?10:13,this.pointSize=this.isMobile?10:13,this.isContact=!1,this.scene=new l,this.isOpen=!1,this.camera=new u(-this.width/2,this.width/2,this.height/2,-this.height/2,.1,100),this.camera.position.z=1,this.renderer=new h({canvas:this.container,antialias:!1,alpha:!0}),this.renderer.setSize(this.width,this.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.initPlane(),this._resizeTimeout=null,this._resizeBound=()=>{clearTimeout(this._resizeTimeout),this._resizeTimeout=setTimeout(()=>this.resize(),150)},window.addEventListener("resize",this._resizeBound)}async outroAnimation(t){await this.playOutro(),this.router.push(`/works/${t}`)}startRender(){this.animationFrameId||this.render()}stopRender(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}playOutro(t){return this.close(),this.isOpen=!0,e.set(".contact",{pointerEvents:"auto",cursor:"default"}),e.set(".main_links",{pointerEvents:"none"}),document.body.style.cursor="",this.isMobile&&e.to(".mobile_close",{opacity:0,duration:.15,overwrite:!0}),this.isContact&&e.to(".anim_contact",{opacity:0,duration:.2,overwrite:!0}),this.startRender(),new Promise(i=>{t?(e.set(this.plane.material.uniforms.uOpacity,{value:0}),e.set(this.plane.material.uniforms.uFill,{value:0}),e.set(this.plane.material.uniforms.uProgress,{value:1}),e.set(this.plane.material.uniforms.uProgress2,{value:.3}),e.set(this.plane.material.uniforms.uProgress3,{value:1}),e.set(this.plane.material.uniforms.uTiltProgress,{value:0}),e.to(this.plane.material.uniforms.uOpacity,{value:1,duration:this.isMobile?.7:1,ease:"none",overwrite:!0,onComplete:()=>i()})):(this.isContact||(e.set(this.plane.material.uniforms.uOpacity,{value:1}),e.set(this.plane.material.uniforms.uProgress,{value:.1})),e.to(".main_links",{y:0,duration:.9,ease:"power3.out"}),e.to(".main_logo",{y:0,duration:.9,ease:"power3.out"}),e.to(this.plane.material.uniforms.uProgress,{value:1,duration:this.isMobile?.7:1,ease:"power2.out",overwrite:!0}),e.to(this.plane.material.uniforms.uProgress2,{value:.3,duration:this.isMobile?.7:1,ease:"power2.out",overwrite:!0}),e.to(this.plane.material.uniforms.uFill,{value:0,duration:this.isMobile?.7:1,ease:"power2.out",overwrite:!0}),e.to(this.plane.material.uniforms.uProgress3,{value:1,duration:this.isMobile?.7:1,ease:"power2.out",overwrite:!0,onComplete:()=>i()}),e.to(this.plane.material.uniforms.uTiltProgress,{value:0,duration:this.isMobile?.7:1,ease:"power2.out",overwrite:!0}))})}playIntro(){this.isOpen=!1,this.startRender(),e.set(".contact",{pointerEvents:"none"}),e.set(this.plane.material.uniforms.uOpacity,{value:1}),e.to(this.plane.material.uniforms.uOpacity,{value:0,duration:.45,ease:"none",delay:.2,overwrite:!0,onComplete:()=>{this.plane.material.uniforms.uProgress.value=.06,this.plane.material.uniforms.uProgress2.value=2,this.plane.material.uniforms.uProgress3.value=0,this.plane.material.uniforms.uTiltProgress.value=.4,this.plane.material.uniforms.uFill.value=1,this.plane.material.uniforms.uOpacity.value=1,this.stopRender()}})}animateIn(){this.isOpen||(this.open(),this.isOpen=!0,this.startRender(),this.isContact=!0,this.hide(),e.set(".main_links",{pointerEvents:"none"}),e.set(this.plane.material.uniforms.uOpacity,{value:1}),e.set(this.plane.material.uniforms.uProgress2,{value:.3}),e.set(".contact",{pointerEvents:"auto"}),e.to(".anim_layer",{filter:"blur(7px)",ease:"power1.out",duration:1,overwrite:!0}),e.set(".anim_contact",{y:this.isMobile?0:"200px",opacity:this.isMobile?0:1,overwrite:!0}),e.to(".anim_contact",{y:0,opacity:1,stagger:{from:"edges",amount:this.isMobile?0:.11},ease:"power3.out",duration:1.1,overwrite:!0}),e.to(this.plane.material.uniforms.uProgress,{value:this.isMobile?1.8:1,duration:.9,ease:"contact",overwrite:!0}),e.to(this.plane.material.uniforms.uProgress2,{value:this.isMobile?.8:.7,duration:.9,ease:"contact",overwrite:!0}),e.to(this.plane.material.uniforms.uProgress3,{value:this.isMobile?1.6:1,duration:1.7,ease:"contact",overwrite:!0}),e.to(this.plane.material.uniforms.uTiltProgress,{value:this.isMobile?.34:0,duration:1.3,ease:"contact",overwrite:!0}))}animateOut(){this.isContact=!1,e.set(".contact",{pointerEvents:"none"}),e.to(this.plane.material.uniforms.uProgress,{value:.3,duration:.7,ease:"power1.out",onComplete:()=>{},overwrite:!0}),e.to(this.plane.material.uniforms.uOpacity,{value:0,duration:.5,ease:"power3.out",onComplete:()=>{e.set(".main_links",{pointerEvents:"auto"}),this.isOpen=!1,this.close()},overwrite:!0}),e.to(this.plane.material.uniforms.uProgress2,{value:.7,duration:.7,ease:"power1.out",overwrite:!0}),e.to(".anim_contact",{opacity:0,duration:.15,overwrite:!0}),this.isMobile&&e.to(".mobile_close",{opacity:0,duration:.15,overwrite:!0}),e.to(".anim_layer",{filter:"blur(0px)",ease:"power2.out",duration:.3,overwrite:!0}),e.to(this.plane.material.uniforms.uProgress3,{value:0,duration:.7,ease:"power1.out",onComplete:()=>this.stopRender(),overwrite:!0}),e.to(this.plane.material.uniforms.uTiltProgress,{value:.25,duration:.7,ease:"power1.out",overwrite:!0})}initPlane(){const t=new o(this.width,this.height),i=Math.min(window.devicePixelRatio,2),r=new m({uniforms:{uResolution:{value:new p(this.width*i,this.height*i)},uRx:{value:this.rx},uRy:{value:this.ry},uTilt:{value:this.tilt},uGridSpacing:{value:this.gridSpacing*i},uPointSize:{value:this.pointSize*i},uTime:{value:0},uProgress:{value:.35},uProgress2:{value:.3},uProgress3:{value:0},uTiltProgress:{value:.25},uFill:{value:1},uOpacity:{value:1}},vertexShader:c,fragmentShader:v,transparent:!0});this.plane&&(this.scene.remove(this.plane),this.plane.geometry.dispose(),this.plane.material.dispose()),this.plane=new d(t,r),this.scene.add(this.plane)}resize(){const t=this.width,i=this.height;this.width=window.innerWidth,this.height=window.innerHeight;const r=this.isMobile;this.isMobile=window.innerWidth<=768,this.camera.left=-this.width/2,this.camera.right=this.width/2,this.camera.top=this.height/2,this.camera.bottom=-this.height/2,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.width,this.height);const s=Math.min(window.devicePixelRatio,2);this.renderer.setPixelRatio(s),r!==this.isMobile&&(this.rx=this.isMobile?1.1:.5,this.ry=this.isMobile?1.25:.4,this.tilt=this.isMobile?Math.PI/6.7:-Math.PI/6.7,this.gridSpacing=this.isMobile?6:13,this.pointSize=this.isMobile?6:13,this.plane.material.uniforms.uRx.value=this.rx,this.plane.material.uniforms.uRy.value=this.ry,this.plane.material.uniforms.uTilt.value=this.tilt),this.plane.material.uniforms.uGridSpacing.value=this.gridSpacing*s,this.plane.material.uniforms.uPointSize.value=this.pointSize*s,this.plane.material.uniforms.uResolution.value.set(this.width*s,this.height*s),(t!==this.width||i!==this.height)&&(this.plane.geometry.dispose(),this.plane.geometry=new o(this.width,this.height))}destroy(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),clearTimeout(this._resizeTimeout),this.plane.geometry.dispose(),this.plane.material.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss(),window.removeEventListener("resize",this._resizeBound)}render(){this.plane.material.uniforms.uTime.value+=2e-4,this.renderer.render(this.scene,this.camera),this.animationFrameId=requestAnimationFrame(this._renderBound)}}export{x as default};
