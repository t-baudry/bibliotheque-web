const U=`#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID & 1) * 4 - 1, (gl_VertexID & 2) * 2 - 1);
  gl_Position = vec4(p, 0.0, 1.0);
}`,I=`#version 300 es
precision highp float;
uniform sampler2D uMask;
uniform sampler2D uNoise;
uniform vec2 uRes;
uniform float uAspect;
uniform vec2 uLight;
uniform float uTime;
uniform float uReveal;
out vec4 outColor;

const int STEPS = 36;
const int TAPS = 5;
const float BAR = 0.28;
const float DENSITY = 26.0;

vec2 toUV(vec2 p) { return p / vec2(uAspect, 1.0) + 0.5; }

vec3 lightColor(float d) {
  return mix(vec3(1.0, 0.88, 0.72), vec3(1.0, 0.46, 0.16), smoothstep(0.12, 1.0, d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (uv - 0.5) * vec2(uAspect, 1.0);
  vec4 m = texture(uMask, uv);
  vec2 blue = texelFetch(uNoise, ivec2(gl_FragCoord.xy) & 63, 0).rg;
  float jitter = blue.r;

  float rays = 0.0;
  float bare = 0.0;
  float weightSum = 0.0;
  for (int t = 0; t < TAPS; t++) {
    float ft = (float(t) + 0.5 + (blue.g - 0.5) * 0.6) / float(TAPS) - 0.5;
    vec2 s = uLight + vec2(0.0, ft * BAR);
    float w = 1.0 - abs(ft) * 1.2;
    vec2 d = s - p;
    float len = length(d);
    float thickness = 0.0;
    for (int i = 0; i < STEPS; i++) {
      float f = (float(i) + jitter) / float(STEPS);
      thickness += texture(uMask, toUV(p + d * f)).g;
    }
    thickness *= len / float(STEPS);
    float r = max(len - 0.03, 0.0);
    float fall = exp(-r * 1.8) / (1.0 + r * r * 24.0);
    bare += w * fall;
    rays += w * fall * exp(-thickness * DENSITY);
    weightSum += w;
  }
  rays /= weightSum;
  bare /= weightSum;
  float dist = length(uLight - p);

  vec3 col = vec3(0.004, 0.003, 0.003);
  col += lightColor(dist) * rays * 0.7;
  float halo = (1.0 - m.r) * m.b * 2.0;
  col += lightColor(dist) * halo * bare * 0.25;

  vec2 px = 1.0 / uRes;
  vec2 grad = vec2(
    texture(uMask, uv + vec2(px.x * 3.0, 0.0)).b - texture(uMask, uv - vec2(px.x * 3.0, 0.0)).b,
    texture(uMask, uv + vec2(0.0, px.y * 3.0)).b - texture(uMask, uv - vec2(0.0, px.y * 3.0)).b
  );
  float facing = 0.35 + 0.65 * clamp(dot(grad, normalize(uLight - p)) / (length(grad) + 0.02), 0.0, 1.0);
  float edge = 1.0 - m.g;
  float depth = 1.0 - smoothstep(0.5, 1.0, m.b);
  vec3 slab = vec3(0.007, 0.0055, 0.005);
  slab += lightColor(dist) * bare * (edge * 1.2 + depth * 0.25) * facing;
  slab += lightColor(dist) * bare * bare * 0.6;
  col = mix(col, slab, m.r);

  col *= uReveal;
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, vec3(lum), smoothstep(0.9, 2.6, lum) * 0.4);
  col = col / (1.0 + col * 0.8);
  col = pow(max(col, 0.0), vec3(1.0 / 2.2));
  vec2 v = (uv - 0.5) * vec2(1.05, 1.0);
  col *= 1.0 - 0.38 * smoothstep(0.35, 1.05, length(v));
  float grain = texelFetch(uNoise, (ivec2(gl_FragCoord.xy) + ivec2(uTime * 61.0, uTime * 37.0)) & 63, 0).g;
  col += (grain - 0.5) * 0.028;
  outColor = vec4(col, 1.0);
}`,A=typeof matchMedia=="function"?matchMedia("(prefers-reduced-motion: reduce)"):{matches:!1},P=(n,a,e)=>{const r=n.createShader(a);if(n.shaderSource(r,e),n.compileShader(r),!n.getShaderParameter(r,n.COMPILE_STATUS))throw new Error(n.getShaderInfoLog(r));return r},D=(n,a,e)=>{const r=document.createElement("canvas");r.width=n,r.height=a;const o=r.getContext("2d"),f=Math.min(a*.42,n*.34),h=l=>{o.filter=l?`blur(${l}px)`:"none",o.font=`500 ${f}px "Neue Montreal", system-ui, sans-serif`,o.textAlign="center",o.textBaseline="middle",o.letterSpacing=`${-f*.02}px`,o.fillText(e,n*.5,a*.5+f*.04)},E=(l,u)=>{o.globalCompositeOperation="source-over",o.fillStyle="#000",o.filter="none",o.fillRect(0,0,n,a),o.fillStyle=u,o.globalCompositeOperation="lighter",h(l)},i=document.createElement("canvas");i.width=n,i.height=a;const s=i.getContext("2d");s.fillStyle="#000",s.fillRect(0,0,n,a),s.globalCompositeOperation="lighter";for(const[l,u]of[[0,"#f00"],[a*.006,"#0f0"],[a*.03,"#00f"]])E(l,u),s.drawImage(r,0,0);return i};function C(n,a){const e=n.getContext("webgl2",{antialias:!1,alpha:!1,premultipliedAlpha:!1});if(!e)return null;const r=e.createProgram();try{if(e.attachShader(r,P(e,e.VERTEX_SHADER,U)),e.attachShader(r,P(e,e.FRAGMENT_SHADER,I)),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(r))}catch(t){return console.warn("[void] shader refusé",t),null}e.useProgram(r);const o=Object.fromEntries(["uMask","uNoise","uRes","uAspect","uLight","uTime","uReveal"].map(t=>[t,e.getUniformLocation(r,t)]));e.uniform1i(o.uMask,0),e.uniform1i(o.uNoise,1);const f=(t,p,m)=>{const g=e.createTexture();return e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,g),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,p),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,p),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,m),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,m),g};f(0,e.LINEAR,e.CLAMP_TO_EDGE),f(1,e.NEAREST,e.REPEAT),e.activeTexture(e.TEXTURE1);const h=new Uint8Array(4096*4);for(let t=0;t<h.length;t++)h[t]=Math.random()*256;e.texImage2D(e.TEXTURE_2D,0,e.RGBA,64,64,0,e.RGBA,e.UNSIGNED_BYTE,h);const E=new Image;E.onload=()=>{T&&(e.activeTexture(e.TEXTURE1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,E))},E.src="/assets/noise/bluenoise64.png";let i=0,s=0,l=1;const u=()=>{const t=Math.min(devicePixelRatio||1,1.25);i=Math.round(innerWidth*t),s=Math.round(innerHeight*t),n.width=i,n.height=s,l=i/s,e.viewport(0,0,i,s),e.uniform2f(o.uRes,i,s),e.uniform1f(o.uAspect,l),e.activeTexture(e.TEXTURE0),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,D(i,s,a)),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1)},d={x:.06,y:.16},v={x:.06,y:.16},c={x:.06,y:.16,at:-1/0},x=t=>{c.x=(t.clientX/innerWidth-.5)*l,c.y=.5-t.clientY/innerHeight,c.at=performance.now()},_=t=>{t.touches[0]&&x(t.touches[0])};let T=!0,R=0,S=performance.now();const b=S,w=t=>{if(!T)return;R=requestAnimationFrame(w);const p=Math.min((t-S)/1e3,.05);S=t;const m=(t-b)/1e3,g=(t-c.at)/1e3;if(g<4||A.matches)v.x=c.x,v.y=c.y;else{const M=Math.min((g-4)/6,1);v.x=c.x+Math.sin(m*.23)*.22*M,v.y=c.y+Math.sin(m*.17+1.3)*.12*M}const L=A.matches?30:3.2,y=1-Math.exp(-L*p);d.x+=(v.x-d.x)*y,d.y+=(v.y-d.y)*y,e.uniform2f(o.uLight,d.x,d.y),e.uniform1f(o.uTime,m),e.uniform1f(o.uReveal,A.matches?1:Math.min(m/1.6,1)**2),e.drawArrays(e.TRIANGLES,0,3)};return(document.fonts?.load('500 100px "Neue Montreal"')??Promise.resolve()).catch(()=>{}).then(()=>{T&&(u(),window.addEventListener("resize",u),window.addEventListener("pointermove",x),window.addEventListener("pointerdown",x),window.addEventListener("touchmove",_,{passive:!0}),R=requestAnimationFrame(w))}),()=>{T=!1,cancelAnimationFrame(R),window.removeEventListener("resize",u),window.removeEventListener("pointermove",x),window.removeEventListener("pointerdown",x),window.removeEventListener("touchmove",_),e.getExtension("WEBGL_lose_context")?.loseContext()}}export{C as startVoid};
