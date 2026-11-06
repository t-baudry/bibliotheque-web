// ===== shader 1 — 002-vendor.CCTvz0au.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 2 — 002-vendor.CCTvz0au.js =====
#version 300 es

${this.getSignature()}

// extensions
${A.extensions}

// precision
${kR}

// uniforms
${A.uniforms}

// varyings
${A.varyings}

// attributes
${A.attributes}

// codes
${A.codes}

void main() {

	// vars
	${A.vars}

	// transforms
	${A.transforms}

	// flow
	${A.flow}

	gl_PointSize = 1.0;

}


// ===== shader 3 — 002-vendor.CCTvz0au.js =====
#version 300 es

${this.getSignature()}

// extensions
${A.extensions}

// precision
${kR}

// structs
${A.structs}

// uniforms
${A.uniforms}

// varyings
${A.varyings}

// codes
${A.codes}

void main() {

	// vars
	${A.vars}

	// flow
	${A.flow}

}
