// ===== shader 1 — 001-app.1782836328290.js =====

attribute vec4 a_position;
varying vec2 v_texcoord;

void main() {
    gl_Position = a_position;
    v_texcoord = a_position.xy * 0.5 + 0.5;
}

// ===== shader 2 — 001-app.1782836328290.js =====

precision mediump float;
varying vec2 v_texcoord;
uniform sampler2D u_texture;

void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
}

// ===== shader 3 — 001-app.1782836328290.js =====
attribute vec3 c,d; uniform vec4 e; uniform vec3 f,g;uniform mat4 h,i;varying vec3 j;void main(){vec3 a=normalize(d);vec4 b=h*vec4(c,1.);vec3 k=normalize(vec3(e-b));j=g*f*max(dot(k,a),0.),gl_Position=i*vec4(c,1.);}

// ===== shader 4 — 001-app.1782836328290.js =====
#ifdef GL_ES
precision mediump float;
#endif
varying vec3 j;void main(){gl_FragColor = vec4(j, 1.0);}