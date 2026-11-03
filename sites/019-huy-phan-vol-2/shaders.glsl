// ===== shader 1 — 004-shared-lib.DyD4REXM.js =====
attribute vec2 vertex;
                attribute vec2 uv;
                uniform vec4 mat;
                uniform vec2 translate;
                varying vec2 st;
                void main() {
                    st = uv;
                    gl_Position = vec4(mat2(mat) * vertex + translate, 0, 1);
                }

// ===== shader 2 — 004-shared-lib.DyD4REXM.js =====
precision highp float;
                uniform sampler2D image;
                varying vec2 st;
                void main() {
                    gl_FragColor = texture2D(image, st);
                }

// ===== shader 3 — 009-shared-lib.DyD4REXM.js =====
attribute vec2 vertex;
                attribute vec2 uv;
                uniform vec4 mat;
                uniform vec2 translate;
                varying vec2 st;
                void main() {
                    st = uv;
                    gl_Position = vec4(mat2(mat) * vertex + translate, 0, 1);
                }

// ===== shader 4 — 009-shared-lib.DyD4REXM.js =====
precision highp float;
                uniform sampler2D image;
                varying vec2 st;
                void main() {
                    gl_FragColor = texture2D(image, st);
                }

// ===== shader 5 — 010-e8XHUPKsgUbD_j36i5m_YIM8UIU28O8o8aXrZlbi1A8.tux3-Cyy.js =====
void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

// ===== shader 6 — 010-e8XHUPKsgUbD_j36i5m_YIM8UIU28O8o8aXrZlbi1A8.tux3-Cyy.js =====
 axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		

// ===== shader 7 — 010-e8XHUPKsgUbD_j36i5m_YIM8UIU28O8o8aXrZlbi1A8.tux3-Cyy.js =====


			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		

// ===== shader 8 — 010-e8XHUPKsgUbD_j36i5m_YIM8UIU28O8o8aXrZlbi1A8.tux3-Cyy.js =====


		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	

// ===== shader 9 — 010-e8XHUPKsgUbD_j36i5m_YIM8UIU28O8o8aXrZlbi1A8.tux3-Cyy.js =====
varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}

// ===== shader 10 — 010-e8XHUPKsgUbD_j36i5m_YIM8UIU28O8o8aXrZlbi1A8.tux3-Cyy.js =====

uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}

// ===== shader 11 — 010-e8XHUPKsgUbD_j36i5m_YIM8UIU28O8o8aXrZlbi1A8.tux3-Cyy.js =====

varying vec2 vUv;

attribute vec3 aPosition;
attribute float aIndex;
attribute vec4 aTextureCoords;
attribute float aImageAspect;

uniform float uCurrentPage;
uniform float uPageThickness;
uniform float uPageWidth;
uniform float uPageHeight;
uniform float uMeshCount;
uniform float uTime;
uniform float uProgress;
uniform float uSplitProgress;
uniform float uPageSpacing;
uniform float uCenterSpacing;
uniform float uFocusRotationX;
uniform float uFocusRotationY;
uniform float uFocusRotationZ;

uniform float uScrollY;
uniform float uMaxX;
uniform float uSpeedY;
uniform float uScrollCurve;
uniform float uHoverIndex;
uniform float uHoverLift;
uniform float uHoverIndexOut;
uniform float uHoverLiftOut;

varying vec4 vTextureCoords;
varying float vIndex;
varying float vRotationProgress;
varying vec3 vPosition;
varying float vImageAspect;
varying float vFocusFactor;

mat3 getYrotationMatrix(float angle)
{
    return mat3(
        cos(angle), 0.0, sin(angle),
        0.0, 1.0, 0.0,
        -sin(angle), 0.0, cos(angle)
    );
}

mat3 getXrotationMatrix(float angle)
{
    return mat3(
        1.0, 0.0, 0.0,
        0.0, cos(angle), -sin(angle),
        0.0, sin(angle), cos(angle)
    );
}

mat3 getZrotationMatrix(float angle)
{
    return mat3(
        cos(angle), sin(angle), 0.0,
        -sin(angle), cos(angle), 0.0,
        0.0, 0.0, 1.0
    );
}

float remap(float value, float originMin, float originMax)
{
    return clamp((value - originMin) / (originMax - originMin),0.,1.);
}

float getXwave(float x)
{
    return sin(x*2.) * 0.4;
}

void main()
{
    float PI = 3.14159265359;

    vec3 rotationCenter = vec3(-uPageWidth*0.5, 0.0, 0.0);
    vec3 translatedPosition = position - rotationCenter;

    float rotationAcclerationProgress = remap(uProgress,0.,0.3);

    float delayBeforeStart = (aIndex / uMeshCount);
    float localRotAccelerationProgress = clamp((rotationAcclerationProgress - delayBeforeStart), 0.0, 1.0);

    float yAngle = -(position.x*0.2*smoothstep(0.,0.3,rotationAcclerationProgress) - rotationAcclerationProgress*2.*PI - localRotAccelerationProgress*2.*PI);

    float fullSpeedRotationAngle = remap(uProgress,0.3,0.7);
    yAngle += fullSpeedRotationAngle*4.2*PI;

    float stackingAngle = remap(uProgress,0.7,1.);

    yAngle += position.x*0.2*stackingAngle + (1.-localRotAccelerationProgress)*2.*PI*stackingAngle + PI*1.7*stackingAngle;

    float pageCrumple = (aIndex - (uMeshCount-1.)*0.5)*smoothstep(0.8,1.,stackingAngle)*((uPageWidth-translatedPosition.x-1.)*0.01);

    translatedPosition.z+= pageCrumple*(1.-uSplitProgress);

    float pageCrumpleAngle = (aIndex - (uMeshCount-1.)*0.5)*smoothstep(0.8,1.,stackingAngle)*((-pow(translatedPosition.x,2.))*0.002);
    yAngle+= pageCrumpleAngle;

    float stackingPages = (uMeshCount-aIndex) * uPageThickness*smoothstep(0.8,1.,stackingAngle);

    translatedPosition.z += stackingPages*(1.-uSplitProgress);

    yAngle-= pageCrumpleAngle*uSplitProgress;

    yAngle-=uSplitProgress*PI*0.4;

    translatedPosition.z += uSplitProgress*uPageSpacing*( - (aIndex - (uMeshCount-1.)*0.5));

    float boxCenterZ = uPageSpacing*( - (aIndex - (uMeshCount-1.)*0.5));

    float maxZ = uMeshCount * (uPageSpacing + uPageThickness) * 0.5;

    float centerZProgress = boxCenterZ - uScrollY;

    float flatWrappedCenterZ = mod(centerZProgress + maxZ, 2.0 * maxZ) - maxZ;

    float distanceToCenter = abs(flatWrappedCenterZ);
    float pushAmount = uCenterSpacing * uPageSpacing;

    float shiftMagnitude = smoothstep(0.1, uPageSpacing * 0.9, distanceToCenter) * pushAmount;

    float direction = sign(flatWrappedCenterZ);
    if (direction == 0.0) direction = 1.0;

    float shiftedWrappedCenterZ = flatWrappedCenterZ + direction * shiftMagnitude;

    float wrappedCenterZ = shiftedWrappedCenterZ - getXwave((position.y+uPageHeight*0.5)/uPageHeight)*clamp(uSpeedY*2.,-2.,2.)*uScrollCurve;

    float zOffset = wrappedCenterZ - boxCenterZ;

    translatedPosition.z += zOffset;

    vec3 rotatedPosition = getYrotationMatrix(yAngle) * translatedPosition;

    rotatedPosition.z-=uSplitProgress;

    float initialRotationProgress = remap(uProgress,0.,0.15);

    rotatedPosition += rotationCenter;
    rotatedPosition.x += initialRotationProgress*uPageWidth*0.5;

    float xAngle = -PI*0.2*initialRotationProgress;

    xAngle+=uSplitProgress*PI*0.2;

    vec3 newPosition = getXrotationMatrix(xAngle) * rotatedPosition;

    float focusFactor = 1.0 - smoothstep(0.0, uPageSpacing * 0.8, distanceToCenter);
    float smoothedFocusFactor = smoothstep(0.0, 1.0, focusFactor);
    float rotationFactor = smoothedFocusFactor;

    vec3 localFocusCenter = vec3(uPageWidth * 0.5, 0.0, 0.0);
    newPosition -= localFocusCenter;
    newPosition = getXrotationMatrix(uFocusRotationX * rotationFactor) * newPosition;
    newPosition = getYrotationMatrix(uFocusRotationY * rotationFactor) * newPosition;
    newPosition = getZrotationMatrix(uFocusRotationZ * rotationFactor) * newPosition;
    newPosition += localFocusCenter;

    float liftAmount = 0.0;
    if (abs(aIndex - uHoverIndex) < 0.5)    liftAmount = uHoverLift;
    if (abs(aIndex - uHoverIndexOut) < 0.5) liftAmount = max(liftAmount, uHoverLiftOut);

    float nonFocusFactor = smoothstep(0.05, 0.4, 1.0 - smoothedFocusFactor);
    float hoverAmount = liftAmount * nonFocusFactor;
    newPosition.y += hoverAmount * 0.25;

    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vUv = uv;
    vTextureCoords=aTextureCoords;
    vIndex=aIndex;
    vRotationProgress=localRotAccelerationProgress;
    vImageAspect=aImageAspect;
    vFocusFactor=smoothedFocusFactor;
}


// ===== shader 12 — 010-e8XHUPKsgUbD_j36i5m_YIM8UIU28O8o8aXrZlbi1A8.tux3-Cyy.js =====

varying vec2 vUv;
varying vec4 vTextureCoords;
uniform sampler2D uAtlas;

varying float vIndex;
varying float vRotationProgress;
varying float vImageAspect;
varying float vFocusFactor;

uniform float uPageWidth;
uniform float uPageHeight;
uniform float uPicking;
uniform float uHoverIndex;
uniform float uHoverLift;
uniform float uHoverIndexOut;
uniform float uHoverLiftOut;

void main()
{
    float xStart = vTextureCoords.x;
    float xEnd = vTextureCoords.y;
    float yStart = vTextureCoords.z;
    float yEnd = vTextureCoords.w;

    float planeAspect = uPageWidth / uPageHeight;
    float imageAspect = vImageAspect;

    vec2 coverUv = vUv;

    if (planeAspect < imageAspect) {
        float scale = planeAspect / imageAspect;
        coverUv.x = (coverUv.x - 0.5) * scale + 0.5;
    } else {
        float scale = imageAspect / planeAspect;
        coverUv.y = (coverUv.y - 0.5) * scale + 0.5;
    }

    float textureHoverAmount = 0.0;
    if (abs(vIndex - uHoverIndex) < 0.5) {
        textureHoverAmount = uHoverLift;
    }
    if (abs(vIndex - uHoverIndexOut) < 0.5) {
        textureHoverAmount = max(textureHoverAmount, uHoverLiftOut);
    }
    textureHoverAmount *= smoothstep(0.65, 0.95, vFocusFactor);

    float textureScale = 1.0 - textureHoverAmount * 0.156;
    coverUv = (coverUv - 0.5) * textureScale + 0.5;

    vec2 atlasUV = vec2(
        mix(xStart, xEnd, coverUv.x),
        mix(yStart, yEnd, 1.0 - coverUv.y)
    );

    if(vRotationProgress==0. && vIndex!=0.)
    {
        discard;
    }

    if (uPicking > 0.5) {
        gl_FragColor = vec4((vIndex + 1.0) / 255.0, 0.0, 0.0, 1.0);
        return;
    }

    vec4 color = texture2D(uAtlas, atlasUV);

    gl_FragColor = color;
}
