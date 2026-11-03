// ===== shader 1 — 002-BeQtrGYw.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 002-BeQtrGYw.js =====
#version 300 es

${this.getSignature()}

// extensions
${e.extensions}

// precision
${AB}

// uniforms
${e.uniforms}

// varyings
${e.varyings}

// attributes
${e.attributes}

// vars
${e.vars}

// codes
${e.codes}

void main() {

	// transforms
	${e.transforms}

	// flow
	${e.flow}

	gl_PointSize = 1.0;

}


// ===== shader 3 — 002-BeQtrGYw.js =====
#version 300 es

${this.getSignature()}

// extensions
${e.extensions}

// precision
${AB}

// structs
${e.structs}

// uniforms
${e.uniforms}

// varyings
${e.varyings}

// vars
${e.vars}

// codes
${e.codes}

void main() {

	// flow
	${e.flow}

}
