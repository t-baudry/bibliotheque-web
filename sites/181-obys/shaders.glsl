// ===== shader 1 — 001-d.js =====
#version 300 es
precision highp float;layout(location=0)in vec2 a;layout(location=1)in vec2 b;uniform mat4 m4;uniform mat4 v4;uniform float z;uniform vec2 r;uniform vec2 v;uniform vec2 of;out vec2 vTexCoord;out vec2 vPosition;void main(){vec4 pos=v4*vec4(a.x,a.y,z,1.0);gl_Position=m4*pos;vTexCoord=(b-0.5)/r+0.5-of;vPosition=(pos.xy/v)+0.5;}

// ===== shader 2 — 001-d.js =====
#version 300 es
precision highp float;uniform sampler2D tex;in vec2 vTexCoord;in vec2 vPosition;uniform int t;uniform float o;uniform float g;uniform vec2 r;uniform vec2 mTB;uniform vec2 mLR;uniform float mY;out vec4 fragColor;float aaStep(float edge,float value){float fwidthValue=fwidth(value);return smoothstep(edge-fwidthValue,edge+fwidthValue,value);}vec3 toGray(vec3 color){return vec3((color.r+color.g+color.b)/3.0);}void main(){vec3 color;float alpha=1.0;color=texture(tex,vTexCoord).rgb;color=mix(color,toGray(color),g);color=mix(color,0.5+(color-0.5)*0.85,g);alpha=aaStep(mTB.x,1.0-vPosition.y)*aaStep(mTB.y,vPosition.y);alpha*=aaStep(mLR.x,vPosition.x)*aaStep(mLR.y,1.0-vPosition.x);fragColor=vec4(color,o*alpha);}