"use client";

import { Canvas } from "@react-three/fiber";
import * as React from "react";
import {
  calculateWeeksFromLastBirthday,
  calculateYearsAlive,
} from "../../lib/date-utils";
import { generateDecadeConfig } from "../../lib/life-table-utils";
import { isValidDate } from "../../lib/validation";
import type { BurstSceneProps, TooltipData } from "./BurstScene.types";
import {
  CONFIG,
  getItemSizePx,
  getItemSpacingPx,
  REFERENCE_VIEWPORT_WIDTH,
} from "./config";
import { useElementSize } from "./hooks/useElementSize";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { SceneContent } from "./SceneContent";
import { computeBurstItems } from "./utils/layout";

const getServerViewportWidth = () => REFERENCE_VIEWPORT_WIDTH;

const getViewportWidth = () => window.innerWidth;

const subscribeToViewportWidth = (onStoreChange: () => void) => {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
};

const parseDateInput = (dob: string | Date) => {
  if (dob instanceof Date) return dob;

  const dateParts = dob.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateParts) return new Date(dob);

  const [, year, month, day] = dateParts;
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export function BurstScene({
  dob,
  totalWeeks,
  shape = "square",
  itemSizeRem = CONFIG.DEFAULT_ITEM_SIZE_REM,
  itemSpacingRem = CONFIG.DEFAULT_ITEM_SPACING_REM,
}: BurstSceneProps) {
  // Use container size instead of viewport
  const { ref: containerRef, size } = useElementSize<HTMLDivElement>();
  const reduceMotion = usePrefersReducedMotion();
  const [tooltip, setTooltip] = React.useState<TooltipData | null>(null);

  const viewportWidth = React.useSyncExternalStore(
    subscribeToViewportWidth,
    getViewportWidth,
    getServerViewportWidth,
  );

  const itemSizePx = getItemSizePx(viewportWidth, itemSizeRem);
  const itemSpacingPx = getItemSpacingPx(viewportWidth, itemSpacingRem);

  // Check validity for rendering, but don't return early before hooks
  const birthDate = React.useMemo(() => parseDateInput(dob), [dob]);
  const isValid = isValidDate(birthDate);

  const layout = React.useMemo(() => {
    if (!isValid || size.w === 0 || size.h === 0) return null;

    const yearsAlive = calculateYearsAlive(birthDate);
    const weeksFromBirthday = calculateWeeksFromLastBirthday(birthDate);

    if (yearsAlive === null || weeksFromBirthday === null) return null;

    const { weeks, yearsInLifetime, decadeLength } = generateDecadeConfig();
    const effectiveTotalWeeks =
      totalWeeks || yearsInLifetime * decadeLength * weeks.length;
    const minDim = Math.min(size.w, size.h);
    const maxRadius = minDim / 2 - 40;

    return computeBurstItems({
      dob: birthDate,
      totalWeeks: effectiveTotalWeeks,
      maxRadius,
      boxPx: itemSizePx,
      spacingPx: itemSpacingPx,
      yearsAlive,
      weeksFromLastBday: weeksFromBirthday,
    });
  }, [
    birthDate,
    isValid,
    itemSizePx,
    itemSpacingPx,
    size.h,
    size.w,
    totalWeeks,
  ]);

  // Early return after all hooks
  if (!isValid) {
    console.warn("BurstScene: Invalid Date Provided");
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden border-0 bg-white select-none dark:bg-zinc-950"
    >
      {/* If layout is ready, show Canvas. Otherwise empty div ensures size measurement happens. */}
      {layout && (
        <Canvas
          frameloop="demand" // On-demand rendering
          orthographic
          camera={{ zoom: 1, position: [0, 0, 100] }}
          dpr={[1, 2]} // Optimize pixel ratio
          // Ensure canvas takes full size of container
          style={{ width: "100%", height: "100%" }}
        >
          <SceneContent
            items={layout.items}
            maxDelay={layout.maxDelay}
            reduceMotion={reduceMotion}
            setTooltip={setTooltip}
            shape={shape}
            boxSize={layout.boxSizePx}
          />
        </Canvas>
      )}

      {/* Tooltip HTML Overlay */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded border-2 border-red-600 bg-zinc-100 px-3 py-1.5 text-xs text-zinc-900 shadow-lg backdrop-blur-sm dark:bg-zinc-900 dark:text-zinc-50"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -150%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
