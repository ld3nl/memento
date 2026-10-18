"use client";

import { Canvas } from "@react-three/fiber";
import * as React from "react";
import {
  calculateWeeksFromLastBirthday,
  calculateYearsAlive,
} from "../../lib/date-utils";
import { generateDecadeConfig } from "../../lib/life-table-utils";
import { isValidDate } from "../../lib/validation";
import type { BurstSceneProps } from "./BurstScene.types";
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

function buildBurstLayout({
  birthDate,
  totalWeeks,
  width,
  height,
  itemSizePx,
  itemSpacingPx,
}: {
  birthDate: Date;
  totalWeeks?: number;
  width: number;
  height: number;
  itemSizePx: number;
  itemSpacingPx: number;
}) {
  const yearsAlive = calculateYearsAlive(birthDate);
  const weeksFromBirthday = calculateWeeksFromLastBirthday(birthDate);

  if (yearsAlive === null || weeksFromBirthday === null) return null;

  const { weeks, yearsInLifetime, decadeLength } = generateDecadeConfig();
  const effectiveTotalWeeks =
    totalWeeks ?? yearsInLifetime * decadeLength * weeks.length;
  const maxRadius = Math.min(width, height) / 2 - 40;

  return computeBurstItems({
    dob: birthDate,
    totalWeeks: effectiveTotalWeeks,
    maxRadius,
    boxPx: itemSizePx,
    spacingPx: itemSpacingPx,
    yearsAlive,
    weeksFromLastBday: weeksFromBirthday,
  });
}

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
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const viewportWidth = React.useSyncExternalStore(
    subscribeToViewportWidth,
    getViewportWidth,
    getServerViewportWidth
  );

  const sizingWidth = size.w > 0 ? size.w : viewportWidth;
  const itemSizePx = getItemSizePx(sizingWidth, itemSizeRem);
  const itemSpacingPx = getItemSpacingPx(sizingWidth, itemSpacingRem);

  const birthTimestamp = parseDateInput(dob).getTime();
  const birthDate = React.useMemo(
    () => new Date(birthTimestamp),
    [birthTimestamp]
  );
  const isValid = isValidDate(birthDate);
  const layout = React.useMemo(
    () =>
      isValid && size.w > 0 && size.h > 0
        ? buildBurstLayout({
            birthDate,
            totalWeeks,
            width: size.w,
            height: size.h,
            itemSizePx,
            itemSpacingPx,
          })
        : null,
    [isValid, birthDate, totalWeeks, size.w, size.h, itemSizePx, itemSpacingPx]
  );
  const currentIndex =
    layout?.items.findIndex(item => item.isCurrentWeek) ?? -1;
  const activeIndex = selectedIndex ?? (currentIndex >= 0 ? currentIndex : 0);
  const activeItem =
    layout?.items[Math.min(activeIndex, layout.items.length - 1)];

  const inspectWeek = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!layout) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;
    let nearest = -1;
    let distance = Math.max(16, layout.boxSizePx * 3) ** 2;
    layout.items.forEach((item, index) => {
      const nextDistance = (item.tx - x) ** 2 + (item.ty - y) ** 2;
      if (nextDistance < distance) {
        distance = nextDistance;
        nearest = index;
      }
    });
    if (nearest >= 0) setSelectedIndex(nearest);
  };

  // Early return after all hooks
  if (!isValid) {
    console.warn("BurstScene: Invalid Date Provided");
    return null;
  }

  return (
    <section
      className="flex h-full w-full flex-col rounded-2xl border border-border bg-surface overflow-hidden"
      aria-label="Life in a spiral"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
        <div>
          <p className="font-display text-xl text-primary">Follow your weeks</p>
          <p id="burst-help" className="text-xs text-secondary">
            Move over the spiral or use the slider to explore.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-border px-4 py-2 text-xs text-primary hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
          onClick={() => setSelectedIndex(currentIndex >= 0 ? currentIndex : 0)}
        >
          This week
        </button>
      </div>
      <div ref={containerRef} className="relative min-h-0 flex-1">
        {layout && (
          <>
            <Canvas
              frameloop="demand"
              orthographic
              camera={{ zoom: 1, position: [0, 0, 100] }}
              dpr={[1, 2]}
              style={{ width: "100%", height: "100%", pointerEvents: "none" }}
            >
              <SceneContent
                items={layout.items}
                maxDelay={layout.maxDelay}
                reduceMotion={reduceMotion}
                selectedIndex={activeIndex}
                shape={shape}
                boxSize={layout.boxSizePx}
              />
            </Canvas>
            <div
              className="absolute inset-0 touch-pan-y"
              aria-hidden="true"
              onPointerMove={inspectWeek}
              onPointerDown={inspectWeek}
            />
            {activeItem && (
              <div
                className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-quiet bg-surface/30 outline outline-surface"
                style={{
                  left: `calc(50% + ${activeItem.tx}px)`,
                  top: `calc(50% + ${activeItem.ty}px)`,
                }}
              />
            )}
          </>
        )}
      </div>
      <div className="border-t border-border bg-surface-raised px-4 py-4 sm:px-6">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <div>
            <p className="text-xs text-secondary">
              {activeItem?.isCurrentWeek
                ? "This week"
                : activeItem?.isFilled
                  ? "Week lived"
                  : "Week ahead"}{" "}
              · Age {activeItem?.yearIndex ?? 0} · Week{" "}
              {activeItem?.weekIndex ?? 1}
            </p>
            <p className="mt-1 font-mono text-sm text-primary sm:text-base">
              {activeItem?.dateRangeLabel ?? "Preparing your spiral…"}
            </p>
          </div>
          <span className="text-xs text-secondary">One dot. One week.</span>
        </div>
        <input
          type="range"
          aria-label="Explore a week"
          aria-describedby="burst-help"
          aria-valuetext={
            activeItem
              ? `Age ${activeItem.yearIndex}, week ${activeItem.weekIndex}, ${activeItem.dateRangeLabel}`
              : undefined
          }
          min={0}
          max={Math.max(0, (layout?.items.length ?? 1) - 1)}
          value={activeIndex}
          onChange={event => setSelectedIndex(Number(event.target.value))}
          className="block h-8 w-full cursor-pointer accent-accent focus-visible:outline-2 focus-visible:outline-accent"
        />
        <div className="flex justify-between text-xs text-secondary">
          <span>Birth · spiral center</span>
          <span>
            {Math.ceil((layout?.items.length ?? 4160) / 52)} years · outer edge
          </span>
        </div>
      </div>
    </section>
  );
}
