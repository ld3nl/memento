/**
 * Simplified Vertex Shader
 * - Pass-through for attributes
 * - Standard positioning (handled by CPU-updated instanceMatrix)
 */
export const vertexShader = `
  attribute float aFilled; 
  attribute float aCurrent;
  attribute float aIndex;
  attribute vec3 instanceColor;
  
  varying vec3 vColor;
  varying float vFilled;
  varying float vCurrent;
  varying float vIndex;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vColor = instanceColor;
    vFilled = aFilled;
    vCurrent = aCurrent;
    vIndex = aIndex;

    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;
