import * as THREE from "three";
import { CONFIG } from "../config";
import { BurstItem } from "../BurstScene.types";

function totalCapacity(step: number, maxRadius: number) {
  if (maxRadius <= 0) return 0;
  let total = 0;
  for (let ring = 0; ring * step <= maxRadius + 1e-6; ring++) {
    const r = ring * step;
    const cap =
      ring === 0 ? 1 : Math.max(1, Math.floor((2 * Math.PI * r) / step));
    total += cap;
  }
  return total;
}

function findStepPx({
  count,
  boxPx,
  maxRadius,
  spacingPx,
}: {
  count: number;
  boxPx: number;
  maxRadius: number;
  spacingPx: number;
}) {
  // Use spacing parameter for gap between items
  const effectiveSize = boxPx + spacingPx;

  const minStep = Math.max(1, effectiveSize);
  const minCap = totalCapacity(minStep, maxRadius);

  if (minCap <= 0) return { step: minStep, clampedCount: 0 };
  if (minCap < count) return { step: minStep, clampedCount: minCap };

  let lo = minStep;
  let hi = Math.max(minStep, maxRadius);

  // Quick check upper bound
  if (totalCapacity(hi, maxRadius) >= count) {
    return { step: hi, clampedCount: count };
  }

  // Binary search for optimal density
  for (let i = 0; i < 22; i++) {
    const mid = (lo + hi) / 2;
    if (totalCapacity(mid, maxRadius) >= count) lo = mid;
    else hi = mid;
  }
  return { step: lo, clampedCount: count };
}

export type LayoutResult = {
  items: BurstItem[];
  maxDelay: number;
};

/**
 * Computes the spatial layout of all burst items.
 * Memoization recommended in parent.
 */
export function computeBurstItems({
  totalWeeks,
  maxRadius,
  boxPx,
  spacingPx,
  yearsAlive,
  weeksFromLastBday,
}: {
  totalWeeks: number;
  maxRadius: number;
  boxPx: number;
  spacingPx: number;
  yearsAlive: number;
  weeksFromLastBday: number;
}): LayoutResult {
  const { step, clampedCount } = findStepPx({
    count: totalWeeks,
    boxPx,
    maxRadius: Math.max(0, maxRadius),
    spacingPx,
  });

  const items: BurstItem[] = [];
  let remaining = clampedCount;
  let globalWeekIndex = 0;
  let maxDelay = 0;

  const effectiveMaxRadius = Math.max(0, maxRadius);

  for (
    let ring = 0;
    remaining > 0 && ring * step <= effectiveMaxRadius + 0.1;
    ring++
  ) {
    const r = ring * step;
    const cap =
      ring === 0 ? 1 : Math.max(1, Math.floor((2 * Math.PI * r) / step));
    const n = Math.min(cap, remaining);

    for (let j = 0; j < n; j++) {
      // Angle: start at -PI/2 (top)
      const theta = -Math.PI / 2 + (j * 2 * Math.PI) / n;

      const tx = Math.cos(theta) * r;
      const ty = Math.sin(theta) * r;

      // Rotation: Face Outward
      // theta is angle from center.
      // Plane geometry Y is Up.
      // If we want +Y to point Away from center:
      // At Top (theta=PI/2), we want Rotation=0. => PI/2 - offset = 0 => offset = PI/2.
      // So Rotation = theta - PI/2.
      const rotation = theta - Math.PI / 2;

      const yearIndex = Math.floor(globalWeekIndex / CONFIG.WEEKS_PER_YEAR);
      const weekIndex = (globalWeekIndex % CONFIG.WEEKS_PER_YEAR) + 1;

      const isFilled =
        yearIndex < yearsAlive ||
        (yearIndex === yearsAlive && weeksFromLastBday >= weekIndex);

      const isCurrentWeek =
        yearIndex === yearsAlive && weeksFromLastBday + 1 === weekIndex;

      // Color Calculation
      const rDist = effectiveMaxRadius > 0 ? r / effectiveMaxRadius : 0;
      const twoPi = Math.PI * 2;
      const cwFromTop =
        ((Math.atan2(ty, tx) + Math.PI / 2 + twoPi) % twoPi) / twoPi;
      const hue = (rDist * 360 + cwFromTop * 140) % 360;
      const color = new THREE.Color().setHSL(hue / 360, 0.9, 0.55);

      const delayMs =
        ring * CONFIG.STAGGER_DELAY_RING_MS + j * CONFIG.STAGGER_DELAY_INDEX_MS;
      if (delayMs > maxDelay) maxDelay = delayMs;

      items.push({
        id: `${ring}-${j}`,
        tx,
        ty, // +Y is mathematically up. We want visual, we can invert in render.
        rotation,
        delayMs,
        isFilled,
        isCurrentWeek,
        yearIndex,
        weekIndex,
        color,
      });

      globalWeekIndex++;
    }
    remaining -= n;
  }

  return { items, maxDelay };
}
