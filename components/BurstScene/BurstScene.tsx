"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import {
  calculateWeeksFromLastBirthday,
  calculateYearsAlive,
} from "../../lib/date-utils";
import { generateDecadeConfig } from "../../lib/life-table-utils";
import { isValidDate } from "../../lib/validation";

import { CONFIG, getItemSizePx, getItemSpacingPx } from "./config";
import { BurstSceneProps, ItemShape, TooltipData } from "./BurstScene.types";

import { computeBurstItems } from "./utils/layout";
import { useElementSize } from "./hooks/useElementSize";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { SceneContent } from "./SceneContent";

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

  // Validate Input
  if (!dob || !isValidDate(dob)) {
    console.warn("BurstScene: Invalid Date Provided");
    return null;
  }

  // Calculate dynamic size and spacing based on viewport width
  // Using window.innerWidth for viewport-based scaling
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1440;
  const itemSizePx = getItemSizePx(viewportWidth, itemSizeRem);
  const itemSpacingPx = getItemSpacingPx(viewportWidth, itemSpacingRem);

  // Memoized Data Generation
  // Re-calculate when size changes
  const layout = React.useMemo(() => {
    // If size is 0, don't compute yet
    if (size.w === 0 || size.h === 0) return null;

    const yearsAlive = calculateYearsAlive(dob);
    const weeksFromBirthday = calculateWeeksFromLastBirthday(dob);

    // Safety check
    if (yearsAlive === null || weeksFromBirthday === null) return null;

    const { weeks, yearsInLifetime, decadeLength } = generateDecadeConfig();
    const effectiveTotalWeeks =
      totalWeeks || yearsInLifetime * decadeLength * weeks.length;

    // Radius calc derived from container size
    const minDim = Math.min(size.w, size.h);
    const maxRadius = minDim / 2 - 40; // 40px padding

    const result = computeBurstItems({
      totalWeeks: effectiveTotalWeeks,
      maxRadius,
      boxPx: itemSizePx,
      spacingPx: itemSpacingPx,
      yearsAlive,
      weeksFromLastBday: weeksFromBirthday,
    });

    return result;
  }, [dob, totalWeeks, size.w, size.h, itemSizePx, itemSpacingPx]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden border-0 bg-white select-none dark:bg-black"
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
            boxSize={itemSizePx}
          />
        </Canvas>
      )}

      {/* Tooltip HTML Overlay */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded bg-gray-900 px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm dark:bg-gray-100 dark:text-gray-900"
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

export default BurstScene;
