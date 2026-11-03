// ===== shader 1 — 004-09uyk4q9ubkuu.js =====

  precision highp float; varying vec2 v;
  uniform sampler2D uTex, uData; uniform vec2 uReach;
  void main(){
    // Decode matches the encode below EXACTLY: byte 128 is a true zero.
    // The old (x−0.5)\xb72 decode had no representable zero — neutral stored as
    // 127, decoding to −0.008 — so the WHOLE bar sat permanently shifted a
    // sub-pixel with LINEAR-blended half-transparent edges: a faint standing
    // veil under the band that read as a glass strip.
    vec2 off = (texture2D(uData, v).rg * 255.0 - 128.0) / 127.0;
    // uReach = max pull per axis in UV units, derived from the px sliders —
    // px divided by the bar

// ===== shader 2 — 004-09uyk4q9ubkuu.js =====
attribute vec2 a; varying vec2 v; void main(){ v = a*0.5+0.5; gl_Position = vec4(a,0.,1.); }

// ===== shader 3 — 009-16_jpe2u802_-.js =====

  precision highp float; varying vec2 v;
  uniform sampler2D uTex, uData; uniform vec2 uReach;
  void main(){
    vec2 off = (texture2D(uData, v).rg * 255.0 - 128.0) / 127.0;
    vec2 uv = v - off * uReach;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
    vec4 c = texture2D(uTex, uv);
    if (c.a < 0.02) discard;
    gl_FragColor = c;
  }

// ===== shader 4 — 009-16_jpe2u802_-.js =====
attribute vec2 a; varying vec2 v; void main(){ v = a*0.5+0.5; gl_Position = vec4(a,0.,1.); }

// ===== shader 5 — 028-16_jpe2u802_-.js =====

  precision highp float; varying vec2 v;
  uniform sampler2D uTex, uData; uniform vec2 uReach;
  void main(){
    vec2 off = (texture2D(uData, v).rg * 255.0 - 128.0) / 127.0;
    vec2 uv = v - off * uReach;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) discard;
    vec4 c = texture2D(uTex, uv);
    if (c.a < 0.02) discard;
    gl_FragColor = c;
  }

// ===== shader 6 — 028-16_jpe2u802_-.js =====
attribute vec2 a; varying vec2 v; void main(){ v = a*0.5+0.5; gl_Position = vec4(a,0.,1.); }

// ===== shader 7 — 033-09uyk4q9ubkuu.js =====

  precision highp float; varying vec2 v;
  uniform sampler2D uTex, uData; uniform vec2 uReach;
  void main(){
    // Decode matches the encode below EXACTLY: byte 128 is a true zero.
    // The old (x−0.5)\xb72 decode had no representable zero — neutral stored as
    // 127, decoding to −0.008 — so the WHOLE bar sat permanently shifted a
    // sub-pixel with LINEAR-blended half-transparent edges: a faint standing
    // veil under the band that read as a glass strip.
    vec2 off = (texture2D(uData, v).rg * 255.0 - 128.0) / 127.0;
    // uReach = max pull per axis in UV units, derived from the px sliders —
    // px divided by the bar

// ===== shader 8 — 033-09uyk4q9ubkuu.js =====
attribute vec2 a; varying vec2 v; void main(){ v = a*0.5+0.5; gl_Position = vec4(a,0.,1.); }