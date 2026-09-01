/**
 * Fragment Shader
 * - Handles Border rendering
 * - Handles Fill state (Filled vs Empty)
 * - Handles Current Week Pulse
 * - Color Wave Animation (hue shifting)
 * - Uses smoothstep for antialiasing
 * - Supports both square and circle shapes
 */
export const fragmentShader = `
  varying vec3 vColor;
  varying float vFilled;
  varying float vCurrent;
  varying vec2 vUv;
  varying float vIndex;

  uniform float uTime;
  uniform float uBorderThickness;
  uniform float uIsCircle;
  uniform float uColorWaveSpeed;
  uniform float uColorWaveOffset;
  uniform float uReduceMotion;

  // RGB to HSL conversion
  vec3 rgb2hsl(vec3 c) {
    float maxC = max(max(c.r, c.g), c.b);
    float minC = min(min(c.r, c.g), c.b);
    float l = (maxC + minC) / 2.0;
    
    if (maxC == minC) {
      return vec3(0.0, 0.0, l);
    }
    
    float d = maxC - minC;
    float s = l > 0.5 ? d / (2.0 - maxC - minC) : d / (maxC + minC);
    
    float h;
    if (maxC == c.r) {
      h = (c.g - c.b) / d + (c.g < c.b ? 6.0 : 0.0);
    } else if (maxC == c.g) {
      h = (c.b - c.r) / d + 2.0;
    } else {
      h = (c.r - c.g) / d + 4.0;
    }
    h /= 6.0;
    
    return vec3(h, s, l);
  }

  // HSL to RGB conversion
  float hue2rgb(float p, float q, float t) {
    if (t < 0.0) t += 1.0;
    if (t > 1.0) t -= 1.0;
    if (t < 1.0/6.0) return p + (q - p) * 6.0 * t;
    if (t < 1.0/2.0) return q;
    if (t < 2.0/3.0) return p + (q - p) * (2.0/3.0 - t) * 6.0;
    return p;
  }

  vec3 hsl2rgb(vec3 c) {
    if (c.y == 0.0) {
      return vec3(c.z);
    }
    
    float q = c.z < 0.5 ? c.z * (1.0 + c.y) : c.z + c.y - c.z * c.y;
    float p = 2.0 * c.z - q;
    
    return vec3(
      hue2rgb(p, q, c.x + 1.0/3.0),
      hue2rgb(p, q, c.x),
      hue2rgb(p, q, c.x - 1.0/3.0)
    );
  }

  void main() {
    // Border Logic (UV 0..1)
    // Use smoothstep for soft edges (AA)
    float thickness = uBorderThickness;
    vec2 aa = fwidth(vUv); // derivative for pixel-perfect AA
    float softness = max(aa.x, aa.y);
    
    float isBorder;
    float isContent;
    
    if (uIsCircle > 0.5) {
      // Circle: use radial distance from center
      vec2 centered = vUv - 0.5;
      float dist = length(centered) * 2.0; // 0 at center, 1 at edge (radius 0.5)
      
      // Discard pixels outside the circle
      if (dist > 1.0) {
        discard;
      }
      
      // Border mask for circle
      float border = smoothstep(1.0 - thickness - softness, 1.0 - thickness, dist);
      isBorder = border;
      isContent = 1.0 - isBorder;
    } else {
      // Square: use edge distance (original logic)
      // Calculate distance from center [0.5, 0.5]
      vec2 dist = abs(vUv - 0.5) * 2.0; // 0 at center, 1 at edge
      
      // Border mask: 0 inside, 1 outside (border)
      vec2 border = smoothstep(1.0 - thickness - softness, 1.0 - thickness, dist);
      isBorder = max(border.x, border.y);
      isContent = 1.0 - isBorder;
    }
    
    // Apply color wave - shift hue based on time and index
    vec3 hsl = rgb2hsl(vColor);
    float hueShift = uTime * uColorWaveSpeed + vIndex * uColorWaveOffset;
    hsl.x = fract(hsl.x + hueShift); // Wrap hue around 0-1
    vec3 waveColor = hsl2rgb(hsl);
    
    // Only apply wave to filled items
    vec3 displayColor = vFilled > 0.5 ? waveColor : vColor;
    
    vec4 finalColor;
    
    if (isContent > 0.5) {
      // Inside Content
      if (vCurrent > 0.5) {
           // Current Week: Pulse Opacity (Alive effect)
           float pulse = uReduceMotion > 0.5 ? 0.5 : (0.5 + 0.5 * sin(uTime * 0.005));
           // Pulse between 0.3 and 0.8 opacity
           finalColor = vec4(displayColor, 0.3 + 0.5 * pulse); 
      } else if (vFilled > 0.5) {
           finalColor = vec4(displayColor, 1.0); // Filled opacity
      } else {
           // Empty squares/circles 
           // Make them very subtle to avoid "dark stack" look
           finalColor = vec4(displayColor, 0.05); 
      }
    } else {
      // Border Content
      // Blend border opacity 
      finalColor = vec4(displayColor, 0.8);
    }
    
    gl_FragColor = finalColor;
    
    // Tone mapping for consistency
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
