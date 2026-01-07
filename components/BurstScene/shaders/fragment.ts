/**
 * Fragment Shader
 * - Handles Border rendering
 * - Handles Fill state (Filled vs Empty)
 * - Handles Current Week Pulse
 * - Uses smoothstep for antialiasing
 */
export const fragmentShader = `
  varying vec3 vColor;
  varying float vFilled;
  varying float vCurrent;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uBorderThickness;

  void main() {
    // Border Logic (UV 0..1)
    // Use smoothstep for soft edges (AA)
    float thickness = uBorderThickness;
    vec2 aa = fwidth(vUv); // derivative for pixel-perfect AA
    float softness = max(aa.x, aa.y);
    
    // Calculate distance from center [0.5, 0.5]
    // Or just use distance from edge
    vec2 dist = abs(vUv - 0.5) * 2.0; // 0 at center, 1 at edge
    
    // Border mask: 0 inside, 1 outside (border)
    // We want 1 inside content, 0 at border
    vec2 border = smoothstep(1.0 - thickness - softness, 1.0 - thickness, dist);
    float isBorder = max(border.x, border.y);
    float isContent = 1.0 - isBorder;
    
    vec4 finalColor;
    
    if (isContent > 0.5) {
      // Inside Content
      if (vCurrent > 0.5) {
           // Current Week: Pulse Opacity (Alive effect)
           float pulse = 0.5 + 0.5 * sin(uTime * 0.005);
           // Pulse between 0.3 and 0.8 opacity
           finalColor = vec4(vColor, 0.3 + 0.5 * pulse); 
      } else if (vFilled > 0.5) {
           finalColor = vec4(vColor, 1.0); // Filled opacity
      } else {
           // Empty squares 
           // Make them very subtle to avoid "dark stack" look
           finalColor = vec4(vColor, 0.05); 
      }
    } else {
      // Border Content
      // Blend border opacity 
      finalColor = vec4(vColor, 0.8);
    }
    
    gl_FragColor = finalColor;
    
    // Tone mapping for consistency
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
