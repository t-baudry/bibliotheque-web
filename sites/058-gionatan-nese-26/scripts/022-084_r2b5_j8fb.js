(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,67670,e=>{"use strict";e.i(47167);var t,a,i=e.i(43476),o=e.i(71645),l=e.i(90072),n=e.i(8560),r=e.i(23490),s=e.i(77478),u=e.i(89970),d=/[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,c=/[\+\-]?\d*\.?\d+e[\+\-]?\d+/ig,f=Math.PI/180,m=Math.sin,h=Math.cos,g=Math.abs,p=Math.sqrt,v=function(e){return Math.round(1e5*e)/1e5||0},w=function(e){return e.closed=.001>Math.abs(e[0]-e[e.length-2])&&.001>Math.abs(e[1]-e[e.length-1])},x=function(){return t||"u">typeof window&&(t=window.gsap)&&t.registerPlugin&&t},y=function(){(t=x())?(t.registerEase("_CE",L.create),a=1):console.warn("Please gsap.registerPlugin(CustomEase)")},R=function(e){return~~(1e3*e+(e<0?-.5:.5))/1e3},b=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/gi,D=/[cLlsSaAhHvVtTqQ]/g,E=function(e){var t,a=e.length,i=1e20;for(t=1;t<a;t+=6)+e[t]<i&&(i=+e[t]);return i},M=function(e,t,a){a||0===a||(a=Math.max(+e[e.length-1],+e[1]));var i,o=-1*e[0],l=-a,n=e.length,r=1/(+e[n-2]+o),s=-t||(Math.abs(e[n-1]-e[1])<.01*(e[n-2]-e[0])?E(e)+l:+e[n-1]+l);for(i=0,s=s?1/s:-r;i<n;i+=2)e[i]=(+e[i]+o)*r,e[i+1]=(+e[i+1]+l)*s},S=function e(t,a,i,o,l,n,r,s,u,d,c){var f,m=(t+i)/2,h=(a+o)/2,g=(i+l)/2,p=(o+n)/2,v=(l+r)/2,w=(n+s)/2,x=(m+g)/2,y=(h+p)/2,R=(g+v)/2,b=(p+w)/2,D=(x+R)/2,E=(y+b)/2,M=r-t,S=s-a,L=Math.abs((i-r)*S-(o-s)*M),T=Math.abs((l-r)*S-(n-s)*M);return d||(d=[{x:t,y:a},{x:r,y:s}],c=1),d.splice(c||d.length-1,0,{x:D,y:E}),(L+T)*(L+T)>u*(M*M+S*S)&&(f=d.length,e(t,a,m,h,x,y,D,E,u,d,c),e(D,E,R,b,v,w,r,s,u,d,c+1+(d.length-f))),d},L=function(){function e(e,t,i){a||y(),this.id=e,this.setData(t,i)}var i=e.prototype;return i.setData=function(e,a){a=a||{};var i,o,l,n,r,s,u,v,x,y=(e=e||"0,0,1,1").match(b),R=1,E=[],L=[],T=a.precision||1,C=T<=1;if(this.data=e,(D.test(e)||~e.indexOf("M")&&0>e.indexOf("C"))&&(y=function(e){var t,a,i,o,l,n,r,s,u,v,x,y,R,b,D,E=(e+"").replace(c,function(e){var t=+e;return t<1e-4&&t>-1e-4?0:t}).match(d)||[],M=[],S=0,L=0,T=2/3,C=E.length,B=0,W="ERROR: malformed path: "+e,P=function(e,t,a,i){v=(a-e)/3,x=(i-t)/3,r.push(e+v,t+x,a-v,i-x,a,i)};if(!e||!isNaN(E[0])||isNaN(E[1]))return console.log(W),M;for(t=0;t<C;t++)if(R=l,isNaN(E[t])?n=(l=E[t].toUpperCase())!==E[t]:t--,i=+E[t+1],o=+E[t+2],n&&(i+=S,o+=L),t||(s=i,u=o),"M"===l)r&&(r.length<8?M.length-=1:B+=r.length,w(r)),S=s=i,L=u=o,r=[i,o],M.push(r),t+=2,l="L";else if("C"===l)r||(r=[0,0]),n||(S=L=0),r.push(i,o,S+ +E[t+3],L+ +E[t+4],S+=+E[t+5],L+=+E[t+6]),t+=6;else if("S"===l)v=S,x=L,("C"===R||"S"===R)&&(v+=S-r[r.length-4],x+=L-r[r.length-3]),n||(S=L=0),r.push(v,x,i,o,S+=+E[t+3],L+=+E[t+4]),t+=4;else if("Q"===l)v=S+(i-S)*T,x=L+(o-L)*T,n||(S=L=0),S+=+E[t+3],L+=+E[t+4],r.push(v,x,S+(i-S)*T,L+(o-L)*T,S,L),t+=4;else if("T"===l)v=S-r[r.length-4],x=L-r[r.length-3],r.push(S+v,L+x,i+(S+1.5*v-i)*T,o+(L+1.5*x-o)*T,S=i,L=o),t+=2;else if("H"===l)P(S,L,S=i,L),t+=1;else if("V"===l)P(S,L,S,L=i+(n?L-S:0)),t+=1;else if("L"===l||"Z"===l)"Z"===l&&(i=s,o=u,r.closed=!0),("L"===l||g(S-i)>.5||g(L-o)>.5)&&(P(S,L,i,o),"L"===l&&(t+=2)),S=i,L=o;else if("A"===l){if(b=E[t+4],D=E[t+5],v=E[t+6],x=E[t+7],a=7,b.length>1&&(b.length<3?(x=v,v=D,a--):(x=D,v=b.substr(2),a-=2),D=b.charAt(1),b=b.charAt(0)),y=function(e,t,a,i,o,l,n,r,s){if(e!==r||t!==s){a=g(a),i=g(i);var u=o%360*f,d=h(u),c=m(u),v=Math.PI,w=2*v,x=(e-r)/2,y=(t-s)/2,R=d*x+c*y,b=-c*x+d*y,D=R*R,E=b*b,M=D/(a*a)+E/(i*i);M>1&&(a=p(M)*a,i=p(M)*i);var S=a*a,L=i*i,T=(S*L-S*E-L*D)/(S*E+L*D);T<0&&(T=0);var C=(l===n?-1:1)*p(T),B=a*b/i*C,W=-(i*R/a*C),P=(e+r)/2+(d*B-c*W),k=(t+s)/2+(c*B+d*W),G=(R-B)/a,z=(b-W)/i,F=(-R-B)/a,Y=(-b-W)/i,A=G*G+z*z,O=(z<0?-1:1)*Math.acos(G/p(A)),U=(G*Y-z*F<0?-1:1)*Math.acos((G*F+z*Y)/p(A*(F*F+Y*Y)));isNaN(U)&&(U=v),!n&&U>0?U-=w:n&&U<0&&(U+=w),O%=w;var V,q=Math.ceil(g(U%=w)/(w/4)),I=[],N=U/q,X=4/3*m(N/2)/(1+h(N/2)),H=d*a,_=c*a,Z=-(c*i),j=d*i;for(V=0;V<q;V++)R=h(o=O+V*N),b=m(o),G=h(o+=N),z=m(o),I.push(R-X*b,b+X*R,G+X*z,z-X*G,G,z);for(V=0;V<I.length;V+=2)R=I[V],b=I[V+1],I[V]=R*H+b*Z+P,I[V+1]=R*_+b*j+k;return I[V-2]=r,I[V-1]=s,I}}(S,L,+E[t+1],+E[t+2],+E[t+3],+b,+D,(n?S:0)+ +v,(n?L:0)+ +x),t+=a,y)for(a=0;a<y.length;a++)r.push(y[a]);S=r[r.length-2],L=r[r.length-1]}else console.log(W);return(t=r.length)<6?(M.pop(),t=0):w(r),M.totalPoints=B+t,M}(e)[0]),4===(i=y.length))y.unshift(0,0),y.push(1,1),i=8;else if((i-2)%6)throw"Invalid CustomEase";for((0!=+y[0]||1!=+y[i-2])&&M(y,a.height,a.originY),this.segment=y,n=2;n<i;n+=6)o={x:+y[n-2],y:+y[n-1]},l={x:+y[n+4],y:+y[n+5]},E.push(o,l),S(o.x,o.y,+y[n],+y[n+1],+y[n+2],+y[n+3],l.x,l.y,1/(2e5*T),E,E.length-1);for(n=0,i=E.length;n<i;n++)u=E[n],v=E[n-1]||u,(u.x>v.x||v.y!==u.y&&v.x===u.x||u===v)&&u.x<=1?(v.cx=u.x-v.x,v.cy=u.y-v.y,v.n=u,v.nx=u.x,C&&n>1&&Math.abs(v.cy/v.cx-E[n-2].cy/E[n-2].cx)>2&&(C=0),v.cx<R&&(v.cx?R=v.cx:(v.cx=.001,n===i-1&&(v.x-=.001,R=Math.min(R,.001),C=0)))):(E.splice(n--,1),i--);if(r=1/(i=1/R+1|0),s=0,u=E[0],C){for(n=0;n<i;n++)x=n*r,u.nx<x&&(u=E[++s]),o=u.y+(x-u.x)/u.cx*u.cy,L[n]={x:x,cx:r,y:o,cy:0,nx:9},n&&(L[n-1].cy=o-L[n-1].y);s=E[E.length-1],L[i-1].cy=s.y-o,L[i-1].cx=s.x-L[L.length-1].x}else{for(n=0;n<i;n++)u.nx<n*r&&(u=E[++s]),L[n]=u;s<E.length-1&&(L[n-1]=E[E.length-2])}return this.ease=function(e){var t=L[e*i|0]||L[i-1];return t.nx<e&&(t=t.n),t.y+(e-t.x)/t.cx*t.cy},this.ease.custom=this,this.id&&t&&t.registerEase(this.id,this.ease),this},i.getSVGData=function(t){return e.getSVGData(this,t)},e.create=function(t,a,i){return new e(t,a,i).ease},e.register=function(e){t=e,y()},e.get=function(e){return t.parseEase(e)},e.getSVGData=function(a,i){var o,l,n,r,s,u,d,c,f,m,h=(i=i||{}).width||100,g=i.height||100,p=i.x||0,w=(i.y||0)+g,x=t.utils.toArray(i.path)[0];if(i.invert&&(g=-g,w=0),"string"==typeof a&&(a=t.parseEase(a)),a.custom&&(a=a.custom),a instanceof e)o=function(e){"number"==typeof e[0]&&(e=[e]);var t,a,i,o,l="",n=e.length;for(a=0;a<n;a++){for(l+="M"+v((o=e[a])[0])+","+v(o[1])+" C",t=o.length,i=2;i<t;i++)l+=v(o[i++])+","+v(o[i++])+" "+v(o[i++])+","+v(o[i++])+" "+v(o[i++])+","+v(o[i])+" ";o.closed&&(l+="z")}return l}(function(e,t,a,i,o){for(var l,n,r,s,u,d=e.length;--d>-1;)for(r=0,n=(l=e[d]).length;r<n;r+=2)s=l[r],u=l[r+1],l[r]=s*t+0*u+i,l[r+1]=0*s+u*a+o;return e._dirty=1,e}([a.segment.slice(0)],h,-g,p,w));else{for(o=[p,w],r=1/(d=Math.max(5,200*(i.precision||1))),d+=2,c=5/d,f=R(p+r*h),l=((m=R(w+-(a(r)*g)))-w)/(f-p),n=2;n<d;n++)s=R(p+n*r*h),(Math.abs(((u=R(w+-(a(n*r)*g)))-m)/(s-f)-l)>c||n===d-1)&&(o.push(f,m),l=(u-m)/(s-f)),f=s,m=u;o="M"+o.join(",")}return x&&x.setAttribute("d",o),o},e}();L.version="3.15.0",L.headless=!0,x()&&t.registerPlugin(L),u.default.registerPlugin(L),L.create("spring-500-60","M0,0 L0.017,0.029 L0.034,0.095 L0.051,0.173 L0.068,0.255 L0.085,0.333 L0.102,0.405 L0.119,0.472 L0.136,0.531 L0.153,0.584 L0.169,0.632 L0.186,0.674 L0.203,0.711 L0.22,0.744 L0.237,0.774 L0.254,0.8 L0.271,0.823 L0.288,0.843 L0.305,0.861 L0.322,0.877 L0.339,0.891 L0.356,0.904 L0.373,0.915 L0.39,0.925 L0.407,0.933 L0.424,0.941 L0.441,0.948 L0.458,0.954 L0.475,0.959 L0.492,0.964 L0.508,0.968 L0.525,0.972 L0.542,0.975 L0.559,0.978 L0.576,0.98 L0.593,0.983 L0.61,0.985 L0.627,0.986 L0.644,0.988 L0.661,0.989 L0.678,0.991 L0.695,0.992 L0.712,0.993 L0.729,0.993 L0.746,0.994 L0.763,0.995 L0.78,0.995 L0.797,0.996 L0.814,0.996 L0.83,0.997 L0.847,0.997 L0.864,0.998 L0.881,0.998 L0.898,0.998 L0.915,0.998 L0.932,0.999 L0.949,0.999 L0.966,0.999 L0.983,0.999 L1,1");let T=`
  varying vec2 vUv;
  varying vec4 vClipPos;
  void main() {
    vUv = uv;
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vClipPos = clip;
    gl_Position = clip;
  }
`,C=`
  #define PI 3.14159265
  uniform sampler2D uBg;
  uniform vec2      uRes;
  uniform float     uProgress;
  uniform vec2      uCursorUV;
  uniform float     uZoom;
  uniform float     uDispersion;
  uniform float     uBlur;
  uniform float     uGlow;
  uniform vec3      uBlueColor;
  uniform float     uWhiteGlow;
  uniform float     uBlueRing;
  uniform float     uTime;
  uniform float     uShimmer;
  uniform float     uNovaSize;
  uniform float     uRingRadius;
  uniform float     uRingWidth;
  uniform float     uDiscScreenRadius;
  uniform float     uRimStart;
  uniform float     uRimTangential;
  uniform float     uRimInward;
  uniform float     uRimFreq1;
  uniform float     uRimFreq2;
  uniform float     uDissolve;
  uniform float     uEdgeRingOn;
  uniform vec3      uEdgeRingColor;
  uniform float     uEdgeRingIntensity;
  uniform float     uEdgeRingWidth;
  uniform float     uEdgeRingSoftness;
  uniform float     uEdgeRingShimmer;
  varying vec2 vUv;
  varying vec4 vClipPos;

  void main() {
    vec2  c    = vUv - 0.5;
    float dist = length(c);
    float r2   = dot(c, c);
    float mask = smoothstep(0.5, 0.464, dist);
    if (mask < 0.001) discard;
    vec2 screenUV = (vClipPos.xy / vClipPos.w) * 0.5 + 0.5;

    // ── Dissolve-out: 0 = full effect, 1 = gone ──
    // Strict ordering so nothing ever doubles: additive light (ring/nova/edge)
    // fades first (gone at 60%), the distortion OFFSETS reach exactly zero at
    // 80% — from there the lens samples the background pixel-for-pixel — and
    // only then (80%→100%) does the alpha fade run, blending identical images.
    float kDistort = 1.0 - smoothstep(0.0, 0.8, uDissolve);
    float kGlow    = 1.0 - smoothstep(0.0, 0.6, uDissolve);

    // Aspect-correct the screen-space field. screenUV is 0..1 on both axes, but the
    // viewport is uRes.x by uRes.y px, so equal UV deltas are unequal *pixel*
    // distances. Without this, the radial distortion/dispersion stretches into an
    // oval on non-square (e.g. portrait mobile) viewports. We measure distance and
    // direction in an aspect-corrected square space (asp applied to x), then undo it
    // when writing offsets back to UV space for texture sampling.
    float asp = uRes.x / max(uRes.y, 1.0);
    vec2  aspV = vec2(asp, 1.0);
    vec2  offUV    = screenUV - uCursorUV;     // raw UV-space offset
    vec2  offset   = offUV * aspV;             // square-space offset (isotropic)
    float nd       = clamp(length(offset) / max(uDiscScreenRadius, 0.0001), 0.0, 1.0);
    float pull     = uZoom * 0.30 * (nd * nd) * kDistort;
    float rimStrength = smoothstep(uRimStart, 1.0, nd);
    vec2  radialDir   = normalize(offset + 1e-6);
    vec2  tangentDir  = vec2(-radialDir.y, radialDir.x);
    float angle       = atan(offset.y, offset.x);
    float fluidWave   = sin(angle * uRimFreq1) * 0.55 + sin(angle * uRimFreq2) * 0.25;
    // rim/disp offsets are built in square space, then divided by aspV to return to UV.
    vec2  rimOff      = (tangentDir * fluidWave * rimStrength * uDiscScreenRadius * uRimTangential * kDistort) / aspV;
    vec2  rimPull     = (-radialDir * rimStrength * uDiscScreenRadius * uRimInward * kDistort) / aspV;
    float rimMask   = smoothstep(0.60, 1.0, nd);
    float dispTotal = uDispersion * 0.004 * rimMask * kDistort;
    vec2  baseUV    = uCursorUV + offUV * (1.0 - pull) + rimOff + rimPull;
    vec2  dispDir   = (radialDir * length(offUV) * dispTotal);
    vec3  ca    = vec3(0.0);
    vec3  caW   = vec3(0.0);
    const int CA_N = 8;
    for (int si = 0; si < CA_N; si++) {
      float t   = float(si) / float(CA_N - 1);
      vec2  sUV = baseUV + dispDir * (t - 0.5);
      vec3  s   = texture2D(uBg, sUV).rgb;
      float wr  = exp(-pow((t - 0.00) / 0.38, 2.0));
      float wg  = exp(-pow((t - 0.50) / 0.38, 2.0));
      float wb  = exp(-pow((t - 1.00) / 0.38, 2.0));
      ca  += s * vec3(wr, wg, wb);
      caW += vec3(wr, wg, wb);
    }
    // Normalize each channel by its OWN weight sum. A shared scalar norm
    // tints the whole disc green (the green Gaussian is centered in the
    // sample range, so it sums higher than red/blue, which are cut off at
    // the ends) — per-channel keeps a uniform background perfectly neutral
    // while the spatial offsets still produce the rainbow rim fringing.
    vec3 col = ca / max(caW, vec3(0.001));
    float blurFade = 1.0 - smoothstep(0.72, 0.98, nd);
    vec2  blurRad  = vec2(uBlur) / uRes * blurFade * kDistort;
    if (blurFade > 0.01) {
      vec3  blurCol = vec3(0.0);
      float blurTW  = 0.0;
      for (float d = 0.0; d < PI * 2.0; d += PI * 2.0 / 6.0) {
        for (float i = 0.2; i <= 1.001; i += 0.2) {
          vec2  off = vec2(cos(d), sin(d)) * blurRad * i;
          float w   = 1.0 - i * 0.38;
          blurCol  += texture2D(uBg, baseUV + off).rgb * w;
          blurTW   += w;
        }
      }
      blurCol += texture2D(uBg, baseUV).rgb * 2.0;
      blurTW  += 2.0;
      col = mix(blurCol / blurTW, col, rimMask);
    }
    col *= mix(1.0, mix(0.91, 1.0, smoothstep(0.0, 0.38, dist)), kDistort);
    float gs   = max(uNovaSize * uGlow * 0.003, 0.004);
    float nova = exp(-r2 / gs) + exp(-r2 / (gs * 7.0)) * 0.18;
    nova *= uWhiteGlow * (uGlow / 17.0) * 1.15 * kGlow;
    col  += vec3(nova);
    float tR       = clamp(uRingRadius, 0.1, 0.49);
    float rW       = max(uRingWidth, 0.003);
    float ring     = exp(-pow((dist - tR) / rW, 2.0));
    ring *= uBlueRing * (uGlow / 17.0) * 1.8 * kGlow;
    if (uShimmer > 0.5) ring *= sin(atan(c.y, c.x) * 12.0 + uTime * 3.5) * 0.12 + 0.88;
    float ringAura = exp(-pow((dist - tR) / (rW * 6.0), 2.0)) * 0.28 * uBlueRing * (uGlow / 17.0) * kGlow;
    col += uBlueColor * (ring + ringAura);
    col += vec3(exp(-pow((dist - 0.483) / 0.007, 2.0)) * 0.95 * kGlow);

    // ── Edge ring: a second, configurable ring locked to the glass border ──
    // Sits at dist 0.478 (just inside the alpha feather at 0.464–0.5 so its
    // core is never clipped). Same additive-light recipe as the blue ring —
    // Gaussian core + wider dim halo — so it fades out with kGlow during the
    // dissolve and can never ghost.
    if (uEdgeRingOn > 0.5) {
      float eR    = 0.478;
      float eW    = max(uEdgeRingWidth, 0.002);
      float eRing = exp(-pow((dist - eR) / eW, 2.0));
      if (uEdgeRingShimmer > 0.5)
        eRing *= sin(atan(c.y, c.x) * 12.0 + uTime * 3.5) * 0.12 + 0.88;
      // Softness widens a dimmer halo around the core line (0 = crisp line).
      float eHalo = exp(-pow((dist - eR) / (eW * (1.0 + uEdgeRingSoftness * 7.0)), 2.0))
                  * 0.35 * clamp(uEdgeRingSoftness, 0.0, 1.0);
      col += uEdgeRingColor * (eRing + eHalo) * uEdgeRingIntensity * kGlow;
    }
    float glassA = min(mix(0.86, 0.98, smoothstep(0.0, 0.44, dist)) + nova * 0.4, 1.0);

    // While the offsets collapse, drive the glass fully opaque: its resting
    // 0.86–0.98 alpha lets 2–14% of the true background bleed through the
    // still-displaced sample, which reads as a faint echo of the text.
    glassA = mix(glassA, 1.0, smoothstep(0.0, 0.35, uDissolve));

    // Final fade runs only AFTER kDistort hits exactly zero (uDissolve 0.8+),
    // when the lens already matches the background pixel-for-pixel — so this
    // blend is between identical images and can never show a double.
    glassA *= 1.0 - smoothstep(0.8, 1.0, uDissolve);

    gl_FragColor = vec4(col, mask * glassA * uProgress);
  }
`,B=`
  float hash13(vec3 p3) {
    p3 = fract(p3 * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
  }
  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash13(i);
    float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash13(i + vec3(1.0, 1.0, 1.0));
    return mix(
      mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
      mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
      f.z
    );
  }
`,W=`
  uniform float uReveal;
  uniform float uTime;
  uniform float uRevealMinY;
  uniform float uRevealMaxY;
  uniform float uRevealBand;
  uniform float uRevealWobble;
  varying vec2 vN;
  varying vec3 vWorldPos;
  varying vec3 vViewPos;
  varying vec3 vViewNormal;
  ${B}
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    // ── Liquid-glass forming: molten ripple ──
    // While the liquid line sweeps up, the band of surface just under it is
    // still liquid and ripples along its normals; anything further below has
    // set and sits perfectly still. At uReveal = 1 the line is above the
    // head, molten = 0 everywhere, and this block is a no-op.
    float span = (uRevealMaxY - uRevealMinY) + 2.0 * uRevealBand;
    float front = uRevealMinY - uRevealBand + span * uReveal;
    float molten = smoothstep(front - uRevealBand, front, wp.y);
    if (molten > 0.0) {
      vec3 wn = normalize(mat3(modelMatrix) * normal);
      float ripple = vnoise(wp.xyz * 2.2 + vec3(0.0, -uTime * 1.6, 0.0)) - 0.5;
      wp.xyz += wn * ripple * uRevealWobble * molten;
    }
    vWorldPos = wp.xyz;
    vec4 mvPos = viewMatrix * wp;
    vViewPos = mvPos.xyz;
    vViewNormal = normalize(normalMatrix * normal);
    vec3 e = normalize(mvPos.xyz);
    vec3 r = reflect(e, vViewNormal);
    float m = 2.0 * sqrt(r.x*r.x + r.y*r.y + (r.z+1.0)*(r.z+1.0));
    vN = r.xy / m + 0.5;
    gl_Position = projectionMatrix * mvPos;
  }
`,P=`
  uniform sampler2D uMatcap;
  uniform float     uGamma;
  uniform vec3      uMousePos;
  uniform float     uHoverIntensity;
  uniform vec3      uGlowColor;
  uniform float     uGlowRadius;
  uniform float     uSpread;
  uniform float     uFalloff;
  uniform float     uBrightness;
  uniform float     uExposure;
  uniform float     uModelBrightness;
  uniform float     uContrast;
  uniform float     uSaturation;
  uniform float     uReveal;
  uniform float     uTime;
  uniform float     uRevealMinY;
  uniform float     uRevealMaxY;
  uniform float     uRevealBand;
  uniform float     uRevealEdgeNoise;
  uniform float     uRevealRefract;
  uniform float     uRevealGlassAlpha;
  uniform float     uRevealGlassBrightness;
  uniform vec3      uRevealTint;
  varying vec2 vN;
  varying vec3 vWorldPos;
  varying vec3 vViewPos;
  varying vec3 vViewNormal;
  ${B}
  void main() {
    // ── Liquid-glass forming: where is this fragment vs the liquid line? ──
    // glass = 1 right at the line, fading to 0 one band-width below (set).
    // Above the line the head simply doesn't exist yet. The whole block is
    // skipped once formed so the resting look costs nothing extra.
    float glass = 0.0;
    float edge = 0.0;
    if (uReveal < 0.9999) {
      float span = (uRevealMaxY - uRevealMinY) + 2.0 * uRevealBand;
      float front = uRevealMinY - uRevealBand + span * uReveal;
      // wavy meniscus — the line is never ruler-straight while rising
      float wave = vnoise(vec3(vWorldPos.x * 2.4, vWorldPos.z * 2.4, uTime * 0.9)) - 0.5;
      edge = vWorldPos.y + wave * uRevealEdgeNoise * (1.0 - uReveal) - front;
      if (edge > 0.0) discard;
      glass = smoothstep(-uRevealBand, 0.0, edge);
    }

    vec4  mc = texture2D(uMatcap, vN);
    vec3  c  = mc.rgb;
    float d  = distance(vWorldPos, uMousePos);
    float g  = smoothstep(uGlowRadius, uGlowRadius * uSpread, d);
    g = pow(g, uFalloff) * uHoverIntensity * uBrightness;
    c += uGlowColor * g;
    c  = pow(max(c, 0.0), vec3(1.0 / max(uGamma, 0.001)));
    // Exposure
    c *= uExposure;
    // Brightness
    c += uModelBrightness;
    // Contrast
    c = (c - 0.5) * uContrast + 0.5;
    // Saturation
    float lum = dot(c, vec3(0.299, 0.587, 0.114));
    c = mix(vec3(lum), c, uSaturation);
    c = max(c, 0.0);

    float alpha = mc.a;
    if (glass > 0.001) {
      // Still-liquid zone: sample the matcap through a wobbling offset so the
      // reflections swim like light through moving glass, then grade it cool
      // and bright with a fresnel rim — transparent material, not dimmed paint.
      vec2 rip = vec2(
        vnoise(vWorldPos.xyz * 3.1 + vec3(uTime * 1.4, 0.0, 0.0)),
        vnoise(vWorldPos.xyz * 3.1 + vec3(0.0, uTime * 1.4, 7.3))
      ) - 0.5;
      vec3 liquid = texture2D(uMatcap, vN + rip * uRevealRefract * glass).rgb;
      float fres = pow(1.0 - abs(dot(normalize(vViewNormal), normalize(-vViewPos))), 2.0);
      liquid = liquid * uRevealGlassBrightness + uRevealTint * (0.10 + fres * 0.55);
      liquid = mix(liquid, vec3(1.0), fres * 0.25);
      c = mix(c, liquid, glass);
      // hot meniscus — same blue as the hover glow, shimmering slightly
      float line = pow(smoothstep(-uRevealBand * 0.28, 0.0, edge), 3.0);
      float shimmer = 0.8 + 0.2 * sin(uTime * 6.0 + vWorldPos.x * 4.0);
      c += uGlowColor * line * shimmer * 1.4;
      alpha = mix(mc.a, uRevealGlassAlpha, glass);
    }

    gl_FragColor = vec4(c, alpha);
  }
`;e.s(["default",0,({about:e})=>{let t=(0,o.useRef)(null),a=(0,o.useRef)(null),d=(0,o.useRef)(null),c=(0,o.useRef)({x:0,y:0,z:0}),f=(0,o.useRef)(new l.Vector2(-100,-100)),m=(0,o.useRef)(0);return(0,o.useEffect)(()=>{let i=t.current;if(!i)return;a.current;let o=i.clientWidth,h=i.clientHeight,g={rotationSensitivity:1,rotationSpeed:.08,maxRotationX:.62,maxRotationY:.59,gyroEnabled:!0,gyroRangeDeg:40,gyroSensitivity:1.4,gyroMaxRotationX:.82,gyroMaxRotationY:.8,gyroRollRange:.28,gyroPosRange:.3,gyroSmoothTime:.16,floatAmplitude:.2,floatSpeed:1.5,bobLerp:.08,posX:0,posY:0,posZ:-1,glowColor:"#1621ff",glowRadius:1.09,glowSpread:.262,glowFalloff:3,glowBrightness:.4,lensZoom:.5,lensDispersion:1.64,lensBlur:0,lensGlow:11,blueRingColor:"#252ba7",whiteGlowIntensity:.285,novaSize:4,blueRingIntensity:.9,ringRadius:.49,ringWidth:.08,ringShimmer:!0,edgeRingEnabled:!0,edgeRingColor:"#252ba7",edgeRingIntensity:1.053,edgeRingWidth:.06,edgeRingSoftness:1,edgeRingShimmer:!0,rimStart:.85,rimTangential:0,rimInward:.2344,rimFreq1:12,rimFreq2:20,totalDuration:4,scaleEase:"expo.out",explosionScale:10,dissolveStartScale:6.1405,dissolveDuration:.8975,dissolveEase:"sine.inOut",playbackSpeed:1,revealDuration:3.85,revealDelay:1,revealEase:"power2.out",revealBand:.97,revealEdgeNoise:.95,revealWobble:.11,revealRefract:.5,revealGlassAlpha:1,revealGlassBrightness:1,revealTint:"#8fa0ff",modelScale:.79684,modelSizePx:200,modelExposure:.984,modelBrightness:-.0459,modelContrast:1.353,modelSaturation:1,modelGamma:1.465,wrapEnabled:!0,wrapZoneRadiusX:3.0596,wrapZoneRadiusY:4.0543,wrapZoneCenterX:0,wrapZoneCenterY:0,wrapTextLerp:.138045,wrapPadding:0};c.current=window.innerWidth<=640?{x:0,y:0,z:0}:{x:-g.maxRotationX,y:g.maxRotationY,z:.2};let p=new n.WebGLRenderer({antialias:!0,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});p.setSize(o,h),p.setPixelRatio(Math.min(window.devicePixelRatio,2)),p.outputColorSpace=l.SRGBColorSpace,p.setClearColor(0xffffff,1),i.querySelectorAll("canvas").forEach(e=>e.parentNode&&e.parentNode.removeChild(e)),i.appendChild(p.domElement);let v=new l.Scene,w=new l.PerspectiveCamera(45,o/h,.1,100);w.position.set(0,0,13);let x=new l.WebGLRenderTarget(o,h,{minFilter:l.LinearFilter,magFilter:l.LinearFilter}),y=new l.TextureLoader,R=new l.Raycaster,b=new l.Raycaster,D={ready:0,total:5},E=()=>{let e={ready:D.ready,total:D.total};window.__pagePreloadProgress=e,window.dispatchEvent(new CustomEvent("page-preload-progress",{detail:e}))},M=()=>{D.ready=Math.min(D.total,D.ready+1),E()};E();let S={uMatcap:{value:y.load("/Model/MatCap.jpg",M,void 0,M)},uGamma:{value:1.5},uMousePos:{value:new l.Vector3},uHoverIntensity:{value:0},uGlowColor:{value:new l.Color(g.glowColor)},uGlowRadius:{value:g.glowRadius},uSpread:{value:g.glowSpread},uFalloff:{value:g.glowFalloff},uBrightness:{value:g.glowBrightness},uExposure:{value:g.modelExposure},uModelBrightness:{value:g.modelBrightness},uContrast:{value:g.modelContrast},uSaturation:{value:g.modelSaturation},uTime:{value:0},uReveal:{value:0},uRevealMinY:{value:-1},uRevealMaxY:{value:1},uRevealBand:{value:g.revealBand},uRevealEdgeNoise:{value:g.revealEdgeNoise},uRevealWobble:{value:g.revealWobble},uRevealRefract:{value:g.revealRefract},uRevealGlassAlpha:{value:g.revealGlassAlpha},uRevealGlassBrightness:{value:g.revealGlassBrightness},uRevealTint:{value:new l.Color(g.revealTint)}},L=new l.ShaderMaterial({uniforms:S,vertexShader:W,fragmentShader:P,depthWrite:!0,depthTest:!0,transparent:!0}),B={uBg:{value:x.texture},uRes:{value:new l.Vector2(o,h)},uProgress:{value:1},uCursorUV:{value:new l.Vector2(.5,.5)},uZoom:{value:g.lensZoom},uDispersion:{value:g.lensDispersion},uBlur:{value:g.lensBlur},uGlow:{value:g.lensGlow},uBlueColor:{value:new l.Color(g.blueRingColor)},uWhiteGlow:{value:g.whiteGlowIntensity},uBlueRing:{value:g.blueRingIntensity},uTime:{value:0},uShimmer:{value:+!!g.ringShimmer},uNovaSize:{value:g.novaSize},uRingRadius:{value:g.ringRadius},uRingWidth:{value:g.ringWidth},uDiscScreenRadius:{value:.3},uRimStart:{value:g.rimStart},uRimTangential:{value:g.rimTangential},uRimInward:{value:g.rimInward},uRimFreq1:{value:g.rimFreq1},uRimFreq2:{value:g.rimFreq2},uDissolve:{value:0},uEdgeRingOn:{value:+!!g.edgeRingEnabled},uEdgeRingColor:{value:new l.Color(g.edgeRingColor)},uEdgeRingIntensity:{value:g.edgeRingIntensity},uEdgeRingWidth:{value:g.edgeRingWidth},uEdgeRingSoftness:{value:g.edgeRingSoftness},uEdgeRingShimmer:{value:+!!g.edgeRingShimmer}},k=new l.ShaderMaterial({uniforms:B,vertexShader:T,fragmentShader:C,transparent:!0,depthWrite:!0,depthTest:!0,side:l.FrontSide}),G=new l.CircleGeometry(1,128),z=new l.Mesh(G,k);z.position.set(0,0,-8),z.scale.setScalar(0),z.renderOrder=-1,v.add(z);let F=null,Y=null,A=null,O=null,U=null,V=!1,q=null,I={bottomBelowOrigin:0,pxToWorld:0},N=()=>{let t="Turning bold ideas into ambitious and ridiculously cool Stuff that actually sticks.",a=K(),i=a?62:75,n=`Currently at ${e?.currentlyAt||"DashDigital® Studio"}`,r=a?12:14;if(J()){let e=o-2*Q,a=document.createElement("canvas").getContext("2d"),l=t.split(/\s+/).filter(Boolean).reduce((e,t)=>{a.font=`500 ${i}px Teodor, sans-serif`;let o=a.measureText(t).width;return o>e?o:e},0);l>e&&(i=Math.floor(e/l*i))}let s=1.18*i,u=J()?ee(t,`300 ${i}px Teodor, sans-serif`,o-2*Q):["Turning bold ideas into","ambitious and ridiculously cool","Stuff that actually sticks."],d=w.position.z- -8,c=2*Math.tan(l.MathUtils.degToRad(w.fov/2))*d,f=o/h*c/o,m=Math.min(window.devicePixelRatio||1,2),g=o,x=h,y=document.createElement("canvas");y.width=Math.ceil(g*m),y.height=Math.ceil(x*m);let R=y.getContext("2d");R.scale(m,m),R.clearRect(0,0,g,x),R.fillStyle="#000000",R.textAlign="center",R.textBaseline="middle";let b=u.length*s,D=(x-b)/2,E=`300 ${i}px Teodor, sans-serif`,M=.015*i,S=J()?16:24,L=`300 ${S}px LayGrotesk, sans-serif`,T=.2*i,C=(e,t,a,i)=>{R.font=E,R.textAlign=i,R.fillText(e,t,a),M>0&&(R.strokeStyle="#000000",R.lineWidth=M,R.lineJoin="round",R.strokeText(e,t,a))},B=-.01*i;"letterSpacing"in R&&(R.letterSpacing=`${B}px`),u.forEach((e,t)=>{((e,t)=>{let a="Stuff",i=e.indexOf(a);if(-1===i)return C(e,g/2,t,"center");let o=e.slice(0,i+a.length),l=e.slice(i+a.length);R.font=E;let n=R.measureText(o).width,r=R.measureText(l).width;R.font=L;let s=R.measureText("™").width,u=(g-(n+8+s+r))/2;C(o,u,t,"left"),u+=n+8,R.font=L,R.textAlign="left",R.fillText("™",u,t-T),C(l,u+=s,t,"left"),R.textAlign="center"})(e,D+t*s+s/2)}),"letterSpacing"in R&&(R.letterSpacing="0px");let W=D+b;R.font=`500 ${r}px LayGrotesk, sans-serif`;let P=W+56+r/2;R.fillText(n,g/2,P);let k=R.measureText(n).width,G=R.measureText("Currently at ").width,z=g/2-k/2;U={leftPx:z+G,rightPx:z+k,centerYPx:P,fontSize:r,cssW:g,cssH:x};let N=new l.CanvasTexture(y);N.colorSpace=l.SRGBColorSpace,N.minFilter=l.LinearFilter,N.magFilter=l.LinearFilter,N.anisotropy=p.capabilities.getMaxAnisotropy?.()||1;let X=new l.PlaneGeometry(g*f,x*f),H=new l.MeshBasicMaterial({map:N,transparent:!0,depthWrite:!1});(F=new l.Mesh(X,H)).position.z=-8,F.renderOrder=-2,F.userData.imgAspect=g/x,I.bottomBelowOrigin=(W+56+r-x/2)*f,I.topAboveOrigin=(x/2-D)*f,I.pxToWorld=f,v.add(F),q&&q.kill(),A&&A.dispose(),O&&O.dispose(),V=!1;let _=U.rightPx-U.leftPx,Z=(U.leftPx+U.rightPx)/2;A=new l.PlaneGeometry(Math.max(_*f,1e-4),Math.max(1.4*r*f,1e-4)),O=new l.MeshBasicMaterial({color:0xffffff,transparent:!0,opacity:0,depthWrite:!1}),(Y=new l.Mesh(A,O)).position.set((Z-g/2)*f,(x/2-P)*f,.02),Y.renderOrder=-1,F.add(Y)},X=new FontFace("Teodor","url(/fonts/Teodor-Light.woff)",{weight:"300"}),H=new FontFace("Teodor","url(/fonts/Teodor-Regular.woff)",{weight:"400"}),_=new FontFace("LayGrotesk","url(/fonts/LayGrotesk-Medium.woff)",{weight:"500"});Promise.allSettled([X.load().finally(M),H.load().finally(M),_.load().finally(M)]).then(e=>(e.forEach(e=>{"fulfilled"===e.status&&document.fonts.add(e.value)}),document.fonts.ready)).then(()=>{N(),ec(),eo(),ei(),requestAnimationFrame(()=>{requestAnimationFrame(()=>{window.__pageContentReady=!0,window.dispatchEvent(new Event("page-content-ready"))})})});let Z=[],j=e?.chapters||[],$=[{label:"Ch. One",numeral:"I",title:"Quality"},{label:"Ch. Two",numeral:"II",title:"Feel"},{label:"Ch. Three",numeral:"III",title:"Purpose"},{label:"Ch. Four",numeral:"IV",title:"Obsession"}].map((e,t)=>({...e,leftText:j[t]?.leftText||"",rightText:j[t]?.rightText||""})),Q=10,J=()=>o<=1024,K=()=>o<=640,ee=(e,t,a)=>{let i=document.createElement("canvas").getContext("2d");i.font=t;let o=e.split(/\s+/).filter(Boolean),l=[],n="";for(let e of o){let t=n?n+" "+e:e;i.measureText(t).width<=a||!n?n=t:(l.push(n),n=e)}return n&&l.push(n),l.length?l:[""]},et=(e,t,a,i)=>{let o=Math.min(window.devicePixelRatio||1,2),n=document.createElement("canvas").getContext("2d");n.font=t;let r=n.measureText(e),s=Math.ceil(r.actualBoundingBoxLeft||0),u=Math.ceil(r.actualBoundingBoxRight||r.width),d=Math.max(Math.ceil(r.width),s+u),c=t.match(/(\d+)px/),f=c?parseInt(c[1],10):16,m=Math.ceil(.6*f),h=Math.ceil(.6*f),g=d+2*m,v=f+2*h,w=document.createElement("canvas");w.width=Math.ceil(g*o),w.height=Math.ceil(v*o);let x=w.getContext("2d");x.scale(o,o),x.font=t,x.fillStyle=a,x.textBaseline="middle",x.textAlign="left",x.fillText(e,m+s,v/2);let y=new l.CanvasTexture(w);y.colorSpace=l.SRGBColorSpace,y.minFilter=l.LinearFilter,y.magFilter=l.LinearFilter,y.anisotropy=p.capabilities.getMaxAnisotropy?.()||1;let R=g*i,b=v*i,D=new l.PlaneGeometry(R,b),E=new l.MeshBasicMaterial({map:y,transparent:!0,depthWrite:!1}),M=new l.Mesh(D,E);return M.renderOrder=-2,M.userData.worldW=R,M.userData.worldH=b,M.userData.padXWorld=m*i,M.userData.text=e,M},ea={servicesBottomY:0,lastBottomY:0,cycleLength:0},ei=()=>{let e,t,a=I.pxToWorld||1,i=ea.lastBottomY-(e=I.pxToWorld||1,t=I.topAboveOrigin/e,Math.max(400,h/2+t)*a)+I.topAboveOrigin;ea.cycleLength=-i},eo=()=>{let e=I.pxToWorld||1,t=ea.servicesBottomY-230*e;$.forEach((a,i)=>{((e,t)=>{let a,i='"Teodor", serif',n='"LayGrotesk", "Teodor", sans-serif',r=w.position.z- -8,s=2*Math.tan(l.MathUtils.degToRad(w.fov/2))*r,u=o/h*s/o,{label:d,numeral:c,title:f,leftText:m,rightText:g}=e,p=`400 16px ${i}`,x=J(),y=o/2-(x?14:8)-6,R=x?y:Math.min(y,250),b=/\s*(?:\r?\n|\\n|\/n)\s*/g,D=(e,t)=>{let a=String(e||"");return(x?[a.replace(b," ")]:a.split(b)).flatMap(e=>ee(e,p,t))},E=D(m,R),M=D(g,R),S=164.432,L=(e,t)=>-(e-.35*t)*u,T=new l.Group,C=[],B=document.createElement("canvas").getContext("2d");B.font=`400 64px ${i}`;let W=B.measureText(c).width,P=L(52.48,64),k=et(d,`500 14px ${n}`,"#000000",u);k.position.y=P,k.userData.anchor="right",k.userData.isHeader=!0,k.userData.defaultEdge=-(W/2+70)*u,T.add(k),C.push(k);let G=et(c,`400 64px ${i}`,"#000000",u);G.position.set(0,P,0),G.userData.anchor="center",T.add(G),C.push(G);let z=et(f,`500 14px ${n}`,"#000000",u);z.position.y=P,z.userData.anchor="left",z.userData.isHeader=!0,z.userData.defaultEdge=(W/2+70)*u,T.add(z),C.push(z);let F=-6*u,Y=6*u;E.forEach((e,t)=>{let a=et(e,p,"#000000",u);a.position.y=L(S+25.6*t,16),a.userData.anchor="right",a.userData.defaultEdge=F,T.add(a),C.push(a)});let A=x?S+25.6*E.length+25.6:S+(E.length-1)*25.6;M.forEach((e,t)=>{let a=et(e,p,"#000000",u);a.position.y=L(A+25.6*t,16),a.userData.anchor="left",a.userData.defaultEdge=Y,T.add(a),C.push(a)}),C.forEach(e=>{let t=e.userData.anchor;"center"===t?e.position.x=0:"right"===t?e.position.x=e.userData.defaultEdge-e.userData.worldW/2+e.userData.padXWorld:e.position.x=e.userData.defaultEdge+e.userData.worldW/2-e.userData.padXWorld}),a=x?S-18.432+25.6*E.length+25.6+25.6*M.length:Math.max(S-18.432+25.6*E.length,S-18.432+(E.length-1)*25.6+25.6*M.length),T.position.set(0,t,-8),T.userData.visH=s,T.userData.initialY=t,T.userData.lines=C,T.userData.titleTopY=0,T.userData.contentH=a*u,T.userData.contentBottomY=-a*u,v.add(T),Z.push(T)})(a,t);let n=Z[Z.length-1],r=t+n.userData.contentBottomY;ea.lastBottomY=r,t=r-270*e})},el=null,en=[],er=null,es=[{heading:"Digital Design",side:"left",items:["UX/UI Design","Motion Design","3D Design","Social Media"]},{heading:"Branding",side:"right",items:["Tone of Voice","Identity Design","Art Direction","Brand Guidelines","Storytelling"]},{heading:"Print Design",side:"left",items:["Packaging","Editorial","Wayfinding","Signage"]},{heading:"Awards",side:"right",items:e?.awards?.length>0?e.awards:["Awwwards x4","DDA x2","CSSDA x2","The FWA x2"]},{heading:"Contact",side:"left",items:["Email","Instagram","Twitter","Linkedin","Cosmos"]}],eu=e?.contactLinks||{},ed={Email:eu.email?`mailto:${eu.email}`:null,Instagram:eu.instagram||null,Twitter:eu.twitter||null,Linkedin:eu.linkedin||null,Cosmos:eu.cosmos||null},ec=()=>{let e,t;en=[],er=null;let a=w.position.z- -8,i=2*Math.tan(l.MathUtils.degToRad(w.fov/2))*a,o=i/h,n=0;es.forEach((e,t)=>{let a=14*e.items.length+(e.items.length-1)*8;n+=52+a,t<es.length-1&&(n+=64)});let r=new l.Group,s=[],u=(e,t)=>-(e+t/2)*o,d=12*o,c=0;es.forEach(e=>{let t="left"===e.side?"right":"left",a="left"===e.side?-d:d,i=et(e.heading,'500 12px "LayGrotesk", "Teodor", sans-serif',"#000000",o);i.position.y=u(c,12),i.userData.anchor=t,i.userData.defaultEdge=a,r.add(i),s.push(i),c+=52,e.items.forEach((i,l)=>{let n=et(i,'400 14px "Teodor", serif',"#000000",o);if(n.position.y=u(c,14),n.userData.anchor=t,n.userData.defaultEdge=a,"Contact"===e.heading){let e=ed[i];e&&(n.userData.contactUrl=e,en.push(n))}r.add(n),s.push(n),c+=14,l<e.items.length-1&&(c+=8)}),c+=64}),s.forEach(e=>{"right"===e.userData.anchor?e.position.x=e.userData.defaultEdge-e.userData.worldW/2+e.userData.padXWorld:e.position.x=e.userData.defaultEdge+e.userData.worldW/2-e.userData.padXWorld});let f=I.pxToWorld||o,m=0-I.bottomBelowOrigin-(e=I.pxToWorld||1,t=I.bottomBelowOrigin/e,Math.max(400,h/2-t)*f);r.position.set(0,m,-8),r.userData.visH=i,r.userData.initialY=m,r.userData.lines=s,r.userData.contentH=n*o,ea.servicesBottomY=m-n*o,ea.lastBottomY=ea.servicesBottomY,v.add(r),el=r},ef=null,em=null,eh={},eg={p:0},ep=new l.Box3,ev=!1,ew=1,ex=0,ey={x:0,y:0,z:0},eR={x:0,y:0,z:0},eb=!1,eD=null,eE=null,eM=null,eS=null,eL=1,eT={speed:1,amp:1},eC=0,eB=()=>{eb||!ef||J()||eK||ev||eZ||ej||!(eg.p>=1)||(eb=!0,eh["eyes-idle"]?.stop(),eS&&(eM?.kill(),eM=u.default.to(eS.scale,{y:.2*eL,duration:1.1,ease:"power2.inOut"})),eE=u.default.to(c.current,{x:.42,y:0,z:.12,duration:1.4,ease:"power2.inOut"}),u.default.to(eT,{speed:.35,amp:1.6,duration:1.6,ease:"power2.inOut"}))},eW=()=>{eb&&(eb=!1,eE?.kill(),eE=null,eM?.kill(),eM=null,u.default.killTweensOf(eT),u.default.to(eT,{speed:1,amp:1,duration:.8,ease:"power2.out"}),eS&&(eS.scale.y=eL),ev||(eh["gio-head-shake"]?.reset().setLoop(l.LoopOnce,1).play(),eh["gio-eyes-shake"]?.reset().setLoop(l.LoopOnce,1).play(),window.__playSfx?.("softClick2")))},eP=()=>{eD&&clearTimeout(eD),eD=setTimeout(eB,3e4)},ek=()=>{eb&&eW(),eP()};new r.GLTFLoader().load("/Model/model.glb",e=>{ef=e.scene;let t=new l.Box3().setFromObject(ef);ef.position.sub(t.getCenter(new l.Vector3)),ef.userData.baseX=ef.position.x,ef.userData.baseY=ef.position.y,ef.position.x=ef.userData.baseX+g.posX,ef.position.z=g.posZ,ef.userData.initialY=ef.userData.baseY+g.posY,ef.position.y=ef.userData.initialY;let a=t.getSize(new l.Vector3);ef.userData.halfW=a.x/2,ef.userData.halfH=a.y/2,ef.traverse(e=>{e.isMesh&&(e.material=L)}),v.add(ef),(em=new l.AnimationMixer(ef)).timeScale=g.playbackSpeed,e.animations.forEach(e=>{eh[e.name]=em.clipAction(e)}),(eS=ef.getObjectByName("gio-eyes-idle")||null)&&(eL=eS.scale.y),eF=!0,eU(),M()},void 0,M);let eG=null,ez=!1,eF=!1,eY=!1,eA=g.revealDelay,eO=()=>{window.dispatchEvent(new Event("about:enter"))},eU=()=>{if(!ez&&eF&&eY){if(ez=!0,window.matchMedia?.("(prefers-reduced-motion: reduce)").matches){eg.p=1,eO();return}eG=u.default.to(eg,{p:1,duration:g.revealDuration,delay:eA,ease:g.revealEase,onStart:eO})}},eV=(e=g.revealDelay)=>{eY||(eY=!0,eA=e,eU())},eq=()=>eV(g.revealDelay);window.addEventListener("pagepreloader:reveal",eq);let eI=0,eN=()=>{eI=window.setTimeout(()=>eV(0),450)};window.addEventListener("pagetransition:start",eN);let eX=window.setTimeout(()=>eV(0),16e3),eH=null;if(/[?&]gui\b/.test(window.location.search)){(eH=new s.default({title:"Liquid-glass reveal"})).hide(),eH.domElement.style.zIndex="2147483647";let e={replay:()=>{eG&&eG.kill(),eg.p=0,eG=u.default.to(eg,{p:1,duration:g.revealDuration,ease:g.revealEase})},formNow:()=>{eG&&eG.kill(),eg.p=1}};eH.add(e,"replay").name("▶ Replay pour"),eH.add(eg,"p",0,1,.001).name("scrub (0→1)").listen().onChange(()=>{eG&&eG.kill()});let t=eH.addFolder("Timing (applies on Replay)");t.add(g,"revealDuration",.4,6,.05).name("duration (s)"),t.add(g,"revealDelay",0,2,.05).name("entry delay (s)"),t.add(g,"revealEase",["none","power1.inOut","power2.inOut","power2.out","power3.inOut","sine.inOut","expo.inOut","expo.out","circ.inOut"]).name("ease");let a=eH.addFolder("Glass & liquid line");a.add(g,"revealBand",.1,3,.01).name("liquid depth"),a.add(g,"revealEdgeNoise",0,1.2,.01).name("line waviness"),a.add(g,"revealWobble",0,.25,.005).name("surface ripple"),a.add(g,"revealRefract",0,1,.01).name("refraction"),a.add(g,"revealGlassAlpha",0,1,.01).name("glass opacity"),a.add(g,"revealGlassBrightness",.5,2.5,.01).name("glass brightness"),a.addColor(g,"revealTint").name("liquid tint").onChange(e=>S.uRevealTint.value.set(e)),eH.add(e,"formNow").name("⤒ Jump to formed")}let e_={scale:0,dissolve:0},eZ=null,ej=null,e$=e=>{if(J()||e.sourceCapabilities&&e.sourceCapabilities.firesTouchEvents)return;let t=i.getBoundingClientRect(),a=(e.clientX-t.left)/o*2-1,n=-(2*((e.clientY-t.top)/h))+1;f.current.set(a,n);let r=(e.clientX-(t.left+t.width/2))/(window.innerWidth/2),s=(e.clientY-(t.top+t.height/2))/(window.innerHeight/2);c.current={x:l.MathUtils.clamp(s*g.rotationSensitivity,-g.maxRotationX,g.maxRotationX),y:l.MathUtils.clamp(r*g.rotationSensitivity,-g.maxRotationY,g.maxRotationY),z:.2*r}};window.addEventListener("mousemove",e$);let eQ=["mousemove","wheel","pointerdown","touchstart","keydown"];eQ.forEach(e=>window.addEventListener(e,ek,{passive:!0})),eP();let eJ=null,eK=!1,e0={nx:0,ny:0},e1={nx:0,ny:0},e2={x:0,y:0},e3=e=>Math.tanh(1.2*e)/Math.tanh(1.2),e5=e=>{let t,a;if(!g.gyroEnabled||null==e.beta||null==e.gamma)return;let i=screen.orientation&&"number"==typeof screen.orientation.angle?screen.orientation.angle:"number"==typeof window.orientation?window.orientation:0;if(90===i?(t=-e.gamma,a=e.beta):-90===i||270===i?(t=e.gamma,a=-e.beta):(t=e.beta,a=e.gamma),!eJ){eJ={x:t,y:a};return}eK=!0;let o=Math.max(g.gyroRangeDeg,1);e0.nx=e3((a-eJ.y)/o),e0.ny=e3((t-eJ.x)/o)},e4=!1,e9=()=>{e4||(e4=!0,window.addEventListener("deviceorientation",e5,!0))},e8=()=>{let e;eJ=null,(e=window.DeviceOrientationEvent)&&"function"==typeof e.requestPermission?e.requestPermission().then(e=>{"granted"===e&&e9()}).catch(()=>{}):e&&e9(),window.removeEventListener("touchend",e8)};window.addEventListener("touchend",e8,{passive:!0}),window.DeviceOrientationEvent&&"function"!=typeof window.DeviceOrientationEvent.requestPermission&&e9();let e6=m.current,e7=0,te=!1,tt=!1,ta=0,ti=e=>{e.preventDefault(),te=!1,e7=0,m.current+=e.deltaY};i.addEventListener("wheel",ti,{passive:!1});let to=0,tl=e=>{if(1!==e.touches.length){tt=!1;return}tt=!0,te=!0,to=e.touches[0].clientY,ta=performance.now(),e7=0},tn=e=>{if(!tt||1!==e.touches.length)return;e.cancelable&&e.preventDefault();let t=e.touches[0].clientY,a=to-t;to=t;let i=performance.now(),o=Math.max(1,i-ta);ta=i,e7=a/o*16,m.current+=a},tr=e=>{0===e.touches.length&&(tt=!1)};i.addEventListener("touchstart",tl,{passive:!0}),i.addEventListener("touchmove",tn,{passive:!1}),i.addEventListener("touchend",tr,{passive:!0}),i.addEventListener("touchcancel",tr,{passive:!0});let ts=(e,t)=>{if(!en.length)return null;let a=i.getBoundingClientRect(),n=(e-a.left)/o*2-1,r=-(2*((t-a.top)/h))+1;b.setFromCamera(new l.Vector2(n,r),w);let s=b.intersectObjects(en,!1);return s.length>0?s[0].object:null},tu=(e,t)=>{if(!F||!U)return!1;let a=i.getBoundingClientRect(),n=(e-a.left)/o*2-1,r=-(2*((t-a.top)/h))+1;b.setFromCamera(new l.Vector2(n,r),w);let s=b.intersectObject(F,!1);if(0===s.length||!s[0].uv)return!1;let{cssW:u,cssH:d,leftPx:c,rightPx:f,centerYPx:m,fontSize:g}=U,p=s[0].uv.x*u,v=(1-s[0].uv.y)*d;return p>=c&&p<=f&&v>=m-.75*g&&v<=m+.75*g},td=t=>{let a,n=(a=ts(t.clientX,t.clientY))?a.userData.contactUrl:null;if(n)return void window.open(n,"_blank","noopener,noreferrer");if(e?.studioUrl&&tu(t.clientX,t.clientY))return void window.open(e.studioUrl,"_blank","noopener,noreferrer");if(!ef)return;let r=i.getBoundingClientRect(),s=(t.clientX-r.left)/o*2-1,d=-(2*((t.clientY-r.top)/h))+1;b.setFromCamera(new l.Vector2(s,d),w),b.intersectObject(ef,!0).length>0&&(()=>{let e,t;if(eb)return eW();if(ev||eZ||ej||eg.p<.8)return;eg.p<1&&(eG&&eG.kill(),eg.p=1),ev=!0,ef&&(ey.x=ef.rotation.x,ey.y=ef.rotation.y,ey.z=ef.rotation.z),eZ&&eZ.kill(),ej&&ej.kill(),e_.scale=0,e_.dissolve=0,z.scale.setScalar(0),B.uDissolve.value=0,e=!1,t=()=>{e=!0,ej=u.default.to(e_,{dissolve:1,duration:g.dissolveDuration,ease:g.dissolveEase,onUpdate(){B.uDissolve.value=e_.dissolve},onComplete(){eZ&&(eZ.kill(),eZ=null),ej=null,e_.scale=0,e_.dissolve=0,z.scale.setScalar(0),B.uDissolve.value=0}})},eZ=u.default.to(e_,{scale:g.explosionScale,duration:g.totalDuration,ease:g.scaleEase,onUpdate(){z.scale.setScalar(e_.scale),!e&&e_.scale>=g.dissolveStartScale&&t()},onComplete(){e||t()}});let a=1===ew?"-01":"-02",i=eh[`avatar-hit${a}`],o=eh[`eyes-hit${a}`],n=eh["gio-head-shake"],r=eh["gio-eyes-shake"];if(i&&o){eh["eyes-idle"]?.stop(),window.__playSfx?.("hit"),i.reset().setLoop(l.LoopOnce,1).play(),o.reset().setLoop(l.LoopOnce,1).play();let e=t=>{t.action===i&&(em.removeEventListener("finished",e),n&&n.reset().setLoop(l.LoopOnce,1).play(),r&&r.reset().setLoop(l.LoopOnce,1).play(),ev=!1,ew=1===ew?2:1)};em.addEventListener("finished",e)}else ev=!1})()};i.addEventListener("click",td);let tc=e=>{let t=ts(e.clientX,e.clientY);i.style.cursor=t?"pointer":"default",t!==er&&(er&&u.default.to(er.material,{opacity:1,duration:.55,ease:"spring-500-60",overwrite:!0}),er=t,t&&u.default.to(t.material,{opacity:.5,duration:.55,ease:"spring-500-60",overwrite:!0}))};i.addEventListener("pointermove",tc);let tf=e=>{let t=tu(e.clientX,e.clientY);t&&(i.style.cursor="pointer"),t===V||(V=t,O&&(q&&q.kill(),q=u.default.to(O,{opacity:.5*!!t,duration:.55,ease:"spring-500-60"})))};i.addEventListener("pointermove",tf);let tm=new l.Timer;tm.connect(document);let th=e=>{d.current=requestAnimationFrame(th),tm.update(e);let t=tm.getDelta(),a=tm.getElapsed();if(em&&em.update(t),(e=>{if(!ev&&!eb&&!(eg.p<.8)&&e-ex>3+2*Math.random()){let t=eh["eyes-idle"];t&&!t.isRunning()&&(t.reset().setLoop(l.LoopOnce,1).play(),ex=e)}})(a),eK){let e=1-Math.exp(-t/Math.max(g.gyroSmoothTime,.001));e1.nx+=(e0.nx-e1.nx)*e,e1.ny+=(e0.ny-e1.ny)*e,c.current={x:l.MathUtils.clamp(e1.ny*g.gyroSensitivity,-g.gyroMaxRotationX,g.gyroMaxRotationX),y:l.MathUtils.clamp(e1.nx*g.gyroSensitivity,-g.gyroMaxRotationY,g.gyroMaxRotationY),z:e1.nx*g.gyroRollRange},e2.x=e1.nx*g.gyroPosRange,e2.y=-e1.ny*g.gyroPosRange}if(ef){let e=1-Math.pow(1-g.rotationSpeed,60*t),i=1-Math.pow(1-g.bobLerp,60*t);ev?(ef.rotation.x=ey.x,ef.rotation.y=ey.y,ef.rotation.z=ey.z,eR.x=ey.x,eR.y=ey.y,eR.z=ey.z):(eR.x=l.MathUtils.lerp(eR.x,c.current.x,e),eR.y=l.MathUtils.lerp(eR.y,c.current.y,e),eR.z=l.MathUtils.lerp(eR.z,c.current.z,e),ef.rotation.x=eR.x,ef.rotation.y=eR.y,ef.rotation.z=eR.z),ef.position.x=l.MathUtils.lerp(ef.position.x,ef.userData.baseX+g.posX+e2.x,e),eC+=t*g.floatSpeed*eT.speed,ef.position.y=l.MathUtils.lerp(ef.position.y,ef.userData.initialY+Math.sin(eC)*g.floatAmplitude*eT.amp*eg.p+e2.y,i),R.setFromCamera(f.current,w);let n=R.intersectObject(ef,!0);if(S.uHoverIntensity.value=l.MathUtils.lerp(S.uHoverIntensity.value,+(n.length>0),n.length>0?.1:.05),n.length>0&&S.uMousePos.value.copy(n[0].point),g.modelSizePx>0&&ef.userData.halfH){let e=w.position.z-ef.position.z,t=2*Math.tan(l.MathUtils.degToRad(w.fov/2))*e;g.modelScale=g.modelSizePx/h*t/(2*ef.userData.halfH)}let r=g.modelScale*(J()?.85:o<=1440?.9:1);if(ef.scale.set(r,r,r),S.uGamma.value=g.modelGamma,S.uExposure.value=g.modelExposure,S.uModelBrightness.value=g.modelBrightness,S.uContrast.value=g.modelContrast,S.uSaturation.value=g.modelSaturation,S.uReveal.value=eg.p,S.uTime.value=a,eg.p<1){ef.updateMatrixWorld(!0),ep.setFromObject(ef);let e=.25*g.revealBand;S.uRevealMinY.value=ep.min.y,S.uRevealMaxY.value=ep.max.y+e}S.uRevealBand.value=g.revealBand,S.uRevealEdgeNoise.value=g.revealEdgeNoise,S.uRevealWobble.value=g.revealWobble,S.uRevealRefract.value=g.revealRefract,S.uRevealGlassAlpha.value=g.revealGlassAlpha,S.uRevealGlassBrightness.value=g.revealGlassBrightness}if(B.uCursorUV.value.set(.5,.5),B.uZoom.value=g.lensZoom,B.uDispersion.value=g.lensDispersion,B.uBlur.value=g.lensBlur,B.uGlow.value=g.lensGlow,B.uBlueColor.value.set(g.blueRingColor),B.uWhiteGlow.value=g.whiteGlowIntensity,B.uBlueRing.value=g.blueRingIntensity,B.uTime.value=a,B.uShimmer.value=+!!g.ringShimmer,B.uNovaSize.value=g.novaSize,B.uRingRadius.value=g.ringRadius,B.uRingWidth.value=g.ringWidth,B.uRimStart.value=g.rimStart,B.uRimTangential.value=g.rimTangential,B.uRimInward.value=g.rimInward,B.uRimFreq1.value=g.rimFreq1,B.uRimFreq2.value=g.rimFreq2,B.uEdgeRingOn.value=+!!g.edgeRingEnabled,B.uEdgeRingColor.value.set(g.edgeRingColor),B.uEdgeRingIntensity.value=g.edgeRingIntensity,B.uEdgeRingWidth.value=g.edgeRingWidth,B.uEdgeRingSoftness.value=g.edgeRingSoftness,B.uEdgeRingShimmer.value=+!!g.edgeRingShimmer,Z.length>0&&ea.cycleLength>0){let e=Z[0].userData.visH,t=ea.cycleLength,a=I.pxToWorld||e/h;!tt&&Math.abs(e7)>.05?(m.current+=e7,e7*=.95):tt||(e7=0),te?e6=m.current:e6+=(m.current-e6)*.12;let i=e6*a,o=t/2,n=e=>((e+o)%t+t)%t-o;F&&(F.position.y=n(i)),Z.forEach(e=>{e.position.y=n(e.userData.initialY+i)}),el&&(el.position.y=n(el.userData.initialY+i));let r=0,s=0,u=0,d=0,c=!1;if(ef&&g.wrapEnabled){let e=w.position.z,t=(e- -8)/(e-ef.position.z);r=g.wrapZoneCenterX*t,s=g.wrapZoneCenterY*t;let a=window.innerWidth<=640?.7875:1;u=g.wrapZoneRadiusX*a,d=g.wrapZoneRadiusY*a,c=!0}let f=g.wrapPadding,p=g.wrapTextLerp,v=e=>{let t=e.userData.lines;if(!t)return;let a=e.position.y;for(let e=0;e<t.length;e++){let i,o=t[e],n=o.userData.anchor;if("center"===n||o.userData.isHeader)continue;let m=a+o.position.y,h=o.userData.defaultEdge,g=o.userData.defaultEdge,v=!1;if(c){let e=(m-s)/d;if(1>Math.abs(e)){let t=u*Math.sqrt(1-e*e);h=r-t-f,g=r+t+f,v=!0}}let w=o.userData.worldW/2,x=o.userData.padXWorld;i="right"===n?(v?Math.min(h,o.userData.defaultEdge):o.userData.defaultEdge)-w+x:(v?Math.max(g,o.userData.defaultEdge):o.userData.defaultEdge)+w-x,o.position.x=l.MathUtils.lerp(o.position.x,i,p)}};Z.forEach(v),el&&v(el)}let i=w.position.z-z.position.z,n=2*Math.tan(l.MathUtils.degToRad(w.fov/2))*i;B.uDiscScreenRadius.value=e_.scale/n,z.visible=!1,ef&&(ef.visible=!1),p.setRenderTarget(x),p.render(v,w),z.visible=!0,ef&&(ef.visible=!0),p.setRenderTarget(null),p.render(v,w)};th(),p.domElement.__snapshotRender=()=>{z.visible=!1,ef&&(ef.visible=!1),p.setRenderTarget(x),p.render(v,w),z.visible=!0,ef&&(ef.visible=!0),p.setRenderTarget(null),p.render(v,w)};let tg=()=>{o=i.clientWidth,h=i.clientHeight,w.aspect=o/h,w.updateProjectionMatrix(),p.setSize(o,h),x.setSize(o,h),B.uRes.value.set(o,h),F&&(v.remove(F),F.geometry.dispose(),F.material.map?.dispose(),F.material.dispose(),F=null,N()),Z.length>0&&(Z.forEach(e=>{v.remove(e),e.traverse(e=>{e.isMesh&&(e.geometry?.dispose(),e.material&&(e.material.map?.dispose(),e.material.dispose()))})}),Z=[],el&&(v.remove(el),el.traverse(e=>{e.isMesh&&(e.geometry?.dispose(),e.material&&(e.material.map?.dispose(),e.material.dispose()))}),el=null),ec(),eo(),ei())};return window.addEventListener("resize",tg),()=>{cancelAnimationFrame(d.current),tm.dispose(),window.removeEventListener("mousemove",e$),eQ.forEach(e=>window.removeEventListener(e,ek)),eD&&clearTimeout(eD),eE?.kill(),eM?.kill(),u.default.killTweensOf(eT),window.removeEventListener("deviceorientation",e5,!0),window.removeEventListener("touchend",e8),i.removeEventListener("wheel",ti),i.removeEventListener("touchstart",tl),i.removeEventListener("touchmove",tn),i.removeEventListener("touchend",tr),i.removeEventListener("touchcancel",tr),window.removeEventListener("resize",tg),i.removeEventListener("click",td),i.removeEventListener("pointermove",tc),i.removeEventListener("pointermove",tf),eZ&&eZ.kill(),ej&&ej.kill(),q&&q.kill(),window.removeEventListener("pagepreloader:reveal",eq),window.removeEventListener("pagetransition:start",eN),window.clearTimeout(eX),window.clearTimeout(eI),eG&&eG.kill(),eH&&eH.destroy(),A?.dispose(),O?.dispose(),G.dispose(),k.dispose(),F&&(F.geometry.dispose(),F.material.map?.dispose(),F.material.dispose()),Z.length>0&&Z.forEach(e=>{e.traverse(e=>{e.isMesh&&(e.geometry?.dispose(),e.material&&(e.material.map?.dispose(),e.material.dispose()))})}),el&&el.traverse(e=>{e.isMesh&&(e.geometry?.dispose(),e.material&&(e.material.map?.dispose(),e.material.dispose()))}),x.dispose(),p.dispose();let e=p.domElement;e&&e.parentNode&&e.parentNode.removeChild(e)}},[]),(0,i.jsx)("div",{ref:a,className:"w-full h-screen relative overflow-hidden touch-none overscroll-none",children:(0,i.jsx)("section",{ref:t,"aria-hidden":"true",className:"w-full h-screen overflow-hidden"})})}],67670)}]);