// Reference viewport width for base sizing (1440px)
export const REFERENCE_VIEWPORT_WIDTH = 1440;
// Base rem size in pixels
const REM_TO_PX = 16;

// Calculate dynamic size based on viewport width
// At 1440px, size is baseRem * 16px
export function getItemSizePx(
  viewportWidth: number,
  baseRem: number = 0.5,
): number {
  const scale = viewportWidth / REFERENCE_VIEWPORT_WIDTH;
  return baseRem * REM_TO_PX * scale;
}

// Calculate dynamic spacing based on viewport width
// At 1440px, spacing is baseRem * 16px
export function getItemSpacingPx(
  viewportWidth: number,
  baseRem: number = 0.5,
): number {
  const scale = viewportWidth / REFERENCE_VIEWPORT_WIDTH;
  return baseRem * REM_TO_PX * scale;
}

export const CONFIG = {
  BOX_SIZE: 8, // Default px (legacy, will be overridden by dynamic sizing)
  BOX_GAP_RATIO: 0.75, // Gap relative to box size (legacy)
  ANIMATION_DURATION_MS: 750,
  STAGGER_DELAY_RING_MS: 50,
  STAGGER_DELAY_INDEX_MS: 5,
  BORDER_THICKNESS: 0.1, // 10% of UV space
  MIN_SCALE: 0.4,
  MAX_SCALE: 1.0,
  WEEKS_PER_YEAR: 52,
  // Default rem values for dynamic sizing
  DEFAULT_ITEM_SIZE_REM: 0.5,
  DEFAULT_ITEM_SPACING_REM: 0.5,
  // Color wave animation
  COLOR_WAVE_SPEED: 0, // Disabled - set to 0.0005 to enable
  COLOR_WAVE_OFFSET: 0, // Disabled - set to 0.002 to enable
  // Magnetic mouse interaction
  MAGNETIC_FORCE: 15, // Maximum displacement in pixels
  MAGNETIC_RADIUS: 150, // Radius of influence in pixels
  MAGNETIC_FALLOFF: 2, // Power for distance falloff (higher = sharper)
};
