import{g as n}from"./DhfWlwu_.js";import{S as s,O as m,W as u,P as a,a as l,V as r,b as h,M as d}from"./CO3m5LEz.js";var f=`void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,c=`uniform vec2 uResolution;
uniform float uGridSpacing;
uniform float uPointSize;
uniform float uTime;
uniform float uOpacity;

uniform float uUvScale;
uniform float uFbm1Scale;
uniform float uFbm1TimeX;
uniform float uFbm1TimeY;
uniform float uFbm1Edge;
uniform float uFbm2Scale;
uniform float uFbm2Offset;
uniform float uFbm2TimeX;
uniform float uFbm2TimeY;
uniform float uFbm2Edge;
uniform float uInterference;
uniform float uScatterScale;
uniform float uScatterSpeed;
uniform float uThresholdBase;
uniform float uThresholdRange;
uniform vec3 uColor;
uniform float uFbm1Amp;
uniform float uFinalProgress;
uniform float uFbm1Freq;

uniform float uFbm2Amp;
uniform float uFbm2Freq;

uniform float uPsX;
uniform float uPsY;

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

float fbm(vec2 p, vec2 timeOffset, float freqMul, float ampMul) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 2.0;
  for (int i = 0; i < 3; i++) {
    value += amplitude * snoise(p * frequency + timeOffset);
    frequency *= freqMul;
    amplitude *= ampMul;
  }
  return value;
}

void main() {
  vec2 px;
  px.x = gl_FragCoord.x - uResolution.x * 0.5;
  px.y = (uResolution.y - gl_FragCoord.y) - uResolution.y * 0.5;

  vec2 offset = mod(uResolution * 0.5, uGridSpacing);
  px += offset;

vec2 cell = mod(px, uGridSpacing);
  float cellHalf = uGridSpacing * 0.5;
  vec2 d = abs(cell - cellHalf);
  if (d.x > uPointSize * uPsX || d.y > uPointSize * uPsY) discard;

  vec2 centerDist = px - offset;
  float exclusionRadius = uGridSpacing * 5.0;
  if (dot(centerDist, centerDist) < exclusionRadius * exclusionRadius) discard;

  vec2 gridPos = px - cell;
  vec2 uv = gridPos * uUvScale;

  float n1 = fbm(uv * uFbm1Scale, vec2(uTime * uFbm1TimeX, uTime * uFbm1TimeY), uFbm1Amp, uFbm1Freq);
  float n2 = fbm(uv * uFbm2Scale + uFbm2Offset, vec2(uTime * uFbm2TimeX, uTime * uFbm2TimeY), uFbm2Amp, uFbm2Freq);

  float edge1 = 1.0 - smoothstep(0.0, uFbm1Edge, abs(n1));
  float edge2 = 1.0 - smoothstep(0.0, uFbm2Edge, abs(n2));
  float mask = max(edge1, edge2);
  mask += edge1 * edge2 * uInterference;
  mask = clamp(mask, 0.0, 1.0);

  float scatter = snoise(gridPos * uScatterScale + uTime * uScatterSpeed);
  float threshold = uThresholdBase + scatter * uThresholdRange;

  if (mask < threshold * uFinalProgress) discard;

  gl_FragColor = vec4(uColor, uOpacity);
}`;class b{constructor(i,t,e){this.container=i,this.animationFrameId=null,this.width=window.innerWidth,this.height=window.innerHeight,this.isHome=e,this.isMobile=t,this._renderBound=this.render.bind(this),this.gridSpacing=12,this.pointSize=1,this.params={gridSpacing:this.gridSpacing,pointSize:this.pointSize,opacity:0,uvScale:.0027,fbm1Scale:.04,fbm1TimeX:.1,fbm1Amp:2,fbm1Freq:.5,fbm1TimeY:.3,fbm1Edge:.25,fbm2Scale:.04,fbm2Offset:8,fbm2TimeX:-.3,fbm2TimeY:.2,fbm2Edge:.48,fbm2Amp:1,fbm2Freq:.9,interference:5,scatterScale:.9,scatterSpeed:1.5,thresholdBase:.54,thresholdRange:.51,timeSpeed:.013},this.scene=new s,this.camera=new m(-this.width/2,this.width/2,this.height/2,-this.height/2,.1,100),this.camera.position.z=1,this.renderer=new u({canvas:this.container,antialias:!1,alpha:!0}),this.renderer.setSize(this.width,this.height),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.initPlane(),this._resizeBound=this.resize.bind(this),window.addEventListener("resize",this._resizeBound)}startRender(){this.animationFrameId||this.render()}stopRender(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.destroyed=!0,this.container.style.visibility="hidden",requestAnimationFrame(()=>{this.destroy()})}playIntro(){n.timeline().to(this.plane.material.uniforms.uOpacity,{value:this.isHome?.6:.8,duration:1.3,ease:"none"},0).to(this.plane.material.uniforms.uFbm1Amp,{value:2,duration:1.9,ease:"contact"},0).to(this.plane.material.uniforms.uFbm1Freq,{value:.5,duration:1.9,ease:"contact"},0).to(this.plane.material.uniforms.uFbm1Edge,{value:this.params.fbm1Edge,duration:1,ease:"contact"},0)}playOutro(){return new Promise(i=>{n.timeline().to(this.plane.material.uniforms.uFinalProgress,{value:.1,duration:1.2,ease:"power3.out"},0).to(this.plane.material.uniforms.uUvScale,{value:1e-5,duration:1.2,ease:"power3.out"},0).to(this.plane.material.uniforms.uFbm1Freq,{value:.5,duration:1.2,ease:"power3.out"},0).to(this.plane.material.uniforms.uFbm2Freq,{value:.5,duration:1.2,ease:"power3.out"},0).to(this.plane.material.uniforms.uOpacity,{value:0,duration:.5,ease:"none",onComplete:()=>{this.stopRender()}},.4).to(".overlay_loader",{opacity:0,duration:.5,ease:"none",onStart:()=>i()},0),n.set(".main_logo",{pointerEvents:"auto"}),n.set(".loader",{pointerEvents:"none"})})}initPlane(){const i=new a(this.width,this.height),t=Math.min(window.devicePixelRatio,2),e=this.params,o=new l({uniforms:{uResolution:{value:new h(this.width*t,this.height*t)},uGridSpacing:{value:e.gridSpacing*t},uPointSize:{value:e.pointSize*t},uTime:{value:0},uOpacity:{value:0},uUvScale:{value:.0027},uFbm1Scale:{value:e.fbm1Scale},uFbm1TimeX:{value:e.fbm1TimeX},uFbm1TimeY:{value:e.fbm1TimeY},uFbm1Edge:{value:2},uFbm1Amp:{value:0},uFbm1Freq:{value:0},uFbm2Scale:{value:e.fbm2Scale},uFbm2Offset:{value:e.fbm2Offset},uFbm2TimeX:{value:e.fbm2TimeX},uFbm2TimeY:{value:e.fbm2TimeY},uFbm2Edge:{value:e.fbm2Edge},uFbm2Amp:{value:e.fbm2Amp},uFbm2Freq:{value:e.fbm2Freq},uInterference:{value:e.interference},uScatterScale:{value:e.scatterScale},uScatterSpeed:{value:e.scatterSpeed},uThresholdBase:{value:e.thresholdBase},uThresholdRange:{value:e.thresholdRange},uColor:{value:this.isHome?new r(1,1,1):new r(0,0,0)},uFinalProgress:{value:1},uPsX:{value:1},uPsY:{value:1}},vertexShader:f,fragmentShader:c,transparent:!0});this.plane&&(this.scene.remove(this.plane),this.plane.geometry.dispose(),this.plane.material.dispose()),this.plane=new d(i,o),this.scene.add(this.plane),this.startRender(),this.playIntro()}resize(){if(this.destroyed)return;this.width=window.innerWidth,this.height=window.innerHeight,this.camera.left=-this.width/2,this.camera.right=this.width/2,this.camera.top=this.height/2,this.camera.bottom=-this.height/2,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.width,this.height),this.renderer.setPixelRatio(window.devicePixelRatio);const i=Math.min(window.devicePixelRatio,2);this.plane.material.uniforms.uGridSpacing.value=this.params.gridSpacing*i,this.plane.material.uniforms.uPointSize.value=this.params.pointSize*i,this.plane.material.uniforms.uResolution.value.set(this.width*window.devicePixelRatio,this.height*window.devicePixelRatio),this.plane.geometry.dispose(),this.plane.geometry=new a(this.width,this.height)}destroy(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null),this.gui?.destroy(),this.plane.geometry.dispose(),this.plane.material.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss(),window.removeEventListener("resize",this._resizeBound)}render(){this.plane.material.uniforms.uTime.value+=this.params.timeSpeed,this.renderer.render(this.scene,this.camera),this.animationFrameId=requestAnimationFrame(this._renderBound)}}export{b as default};
