import { addDays, addWeeks, format } from "date-fns";
import * as THREE from "three";
import type { BurstItem } from "../BurstScene.types";
import { CONFIG } from "../config";

function parseBirthDate(dob: string | Date) {
  if (dob instanceof Date) return dob;

  const dateParts = dob.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateParts) return new Date(dob);

  const [, year, month, day] = dateParts;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function formatWeekDateRange(birthDate: Date, weekIndex: number) {
  const startDate = addWeeks(birthDate, weekIndex);
  const endDate = addDays(startDate, 6);

  if (startDate.getFullYear() !== endDate.getFullYear()) {
    return `${format(startDate, "MMM d, yyyy")}-${format(endDate, "MMM d, yyyy")}`;
  }

  if (startDate.getMonth() !== endDate.getMonth()) {
    return `${format(startDate, "MMM d")}-${format(endDate, "MMM d, yyyy")}`;
  }

  return `${format(startDate, "MMM d")}-${format(endDate, "d, yyyy")}`;
}

type SpiralPoint = {
  r: number;
  theta: number;
};

const SPIRAL_PITCH_RATIO = 2.4;

function fitSpiralPoints(count: number, step: number): SpiralPoint[] {
  if (step <= 0 || count <= 0) return [];

  // Archimedean spiral: r = bθ, starting at the origin so week 0
  // sits in the center and later weeks wind outward.
  const pitch = step * SPIRAL_PITCH_RATIO;
  const b = pitch / (2 * Math.PI);
  const points: SpiralPoint[] = [];
  let theta = 0;

  for (let i = 0; i < count; i++) {
    const r = b * theta;
    points.push({ r, theta });
    theta += step / Math.hypot(r, b);
  }

  return points;
}

export type LayoutResult = {
  items: BurstItem[];
  maxDelay: number;
  boxSizePx: number;
};

/**
 * Computes the spatial layout of all burst items along an Archimedean spiral.
 */
export function computeBurstItems({
  dob,
  totalWeeks,
  maxRadius,
  boxPx,
  spacingPx,
  yearsAlive,
  weeksFromLastBday,
}: {
  dob: string | Date;
  totalWeeks: number;
  maxRadius: number;
  boxPx: number;
  spacingPx: number;
  yearsAlive: number;
  weeksFromLastBday: number;
}): LayoutResult {
  const effectiveMaxRadius = Math.max(0, maxRadius);
  if (effectiveMaxRadius <= 0 || totalWeeks <= 0) {
    return { items: [], maxDelay: 0, boxSizePx: 0.5 };
  }

  const unitStep = Math.max(0.5, boxPx + spacingPx);
  const points = fitSpiralPoints(totalWeeks, unitStep);
  const lastR = points[points.length - 1]?.r ?? 1;
  const fitScale = lastR > 0 ? effectiveMaxRadius / lastR : 1;
  const visualStep = unitStep * fitScale;
  const boxSizePx = Math.max(0.5, Math.min(boxPx, visualStep * 0.52));
  const birthDate = parseBirthDate(dob);

  const items: BurstItem[] = [];
  let maxDelay = 0;

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const r = point.r * fitScale;
    // Start at the top of the screen (same convention as the old rings).
    const phi = point.theta - Math.PI / 2;
    const tx = Math.cos(phi) * r;
    const ty = Math.sin(phi) * r;
    const rotation = phi - Math.PI / 2;

    const yearIndex = Math.floor(i / CONFIG.WEEKS_PER_YEAR);
    const weekIndex = (i % CONFIG.WEEKS_PER_YEAR) + 1;

    const isFilled =
      yearIndex < yearsAlive ||
      (yearIndex === yearsAlive && weeksFromLastBday >= weekIndex);

    const isCurrentWeek =
      yearIndex === yearsAlive && weeksFromLastBday + 1 === weekIndex;

    const rDist = effectiveMaxRadius > 0 ? r / effectiveMaxRadius : 0;
    const twoPi = Math.PI * 2;
    const cwFromTop =
      ((Math.atan2(ty, tx) + Math.PI / 2 + twoPi) % twoPi) / twoPi;
    const hue = (rDist * 360 + cwFromTop * 140) % 360;
    const color = new THREE.Color().setHSL(hue / 360, 0.9, 0.55);

    const delayMs =
      (r / Math.max(visualStep, 1)) * CONFIG.STAGGER_DELAY_RING_MS +
      (i % CONFIG.WEEKS_PER_YEAR) * CONFIG.STAGGER_DELAY_INDEX_MS;
    if (delayMs > maxDelay) maxDelay = delayMs;

    items.push({
      id: `spiral-${i}`,
      tx,
      ty,
      rotation,
      delayMs,
      isFilled,
      isCurrentWeek,
      yearIndex,
      weekIndex,
      dateRangeLabel: formatWeekDateRange(birthDate, i),
      color,
    });
  }

  return { items, maxDelay, boxSizePx };
}
