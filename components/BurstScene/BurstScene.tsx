"use client";

import { Canvas } from "@react-three/fiber";
import * as stylex from "@stylexjs/stylex";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import {
  calculateWeeksFromLastBirthday,
  calculateYearsAlive,
  type LifeWeekCountMode,
} from "../../lib/date-utils";
import { resolveWeekCountMode } from "../../lib/week-count-mode";
import { generateDecadeConfig } from "../../lib/life-table-utils";
import { isValidDate } from "../../lib/validation";
import { breakpoints } from "../../styles/breakpoints.stylex";
import { tokens } from "../../styles/tokens.stylex";
import type { BurstItem, BurstSceneProps, ItemShape } from "./BurstScene.types";
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
  weekCountMode,
}: {
  birthDate: Date;
  totalWeeks?: number;
  width: number;
  height: number;
  itemSizePx: number;
  itemSpacingPx: number;
  weekCountMode: LifeWeekCountMode;
}) {
  const yearsAlive = calculateYearsAlive(birthDate, new Date(), weekCountMode);
  const weeksFromBirthday = calculateWeeksFromLastBirthday(
    birthDate,
    new Date(),
    weekCountMode
  );

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

type BurstLayout = NonNullable<ReturnType<typeof buildBurstLayout>>;

function layoutWhenReady(input: {
  isValid: boolean;
  birthDate: Date;
  totalWeeks?: number;
  width: number;
  height: number;
  itemSizePx: number;
  itemSpacingPx: number;
  weekCountMode: LifeWeekCountMode;
}) {
  if (!input.isValid || input.width <= 0 || input.height <= 0) return null;
  return buildBurstLayout(input);
}

function chosenWeekIndex(selectedIndex: number | null, currentIndex: number) {
  if (selectedIndex !== null) return selectedIndex;
  if (currentIndex >= 0) return currentIndex;
  return 0;
}

function nearestWeekIndex(
  items: BurstItem[],
  boxSizePx: number,
  bounds: DOMRect,
  clientX: number,
  clientY: number
) {
  const x = clientX - bounds.left - bounds.width / 2;
  const y = clientY - bounds.top - bounds.height / 2;
  let nearest = -1;
  let distance = Math.max(16, boxSizePx * 3) ** 2;
  items.forEach((item, index) => {
    const nextDistance = (item.tx - x) ** 2 + (item.ty - y) ** 2;
    if (nextDistance < distance) {
      distance = nextDistance;
      nearest = index;
    }
  });
  return nearest;
}

function inspectBurstWeek(
  event: React.PointerEvent<HTMLDivElement>,
  layout: BurstLayout | null,
  select: (index: number) => void
) {
  if (!layout) return;
  const nearest = nearestWeekIndex(
    layout.items,
    layout.boxSizePx,
    event.currentTarget.getBoundingClientRect(),
    event.clientX,
    event.clientY
  );
  if (nearest >= 0) select(nearest);
}

function weekStateLabel(item: BurstItem | undefined) {
  if (!item || item.isCurrentWeek) return item ? "This week" : "Week ahead";
  if (item.isFilled) return "Week lived";
  return "Week ahead";
}

const styles = stylex.create({
  panel: {
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: "1rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: tokens.border,
    backgroundColor: tokens.surface,
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: tokens.border,
    paddingBlock: "0.75rem",
    paddingInline: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
    },
  },
  title: {
    marginTop: 0,
    marginBottom: 0,
    fontFamily: tokens.fontDisplay,
    fontSize: "1.25rem",
    lineHeight: "calc(1.75 / 1.25)",
    color: tokens.primary,
  },
  help: {
    marginTop: 0,
    marginBottom: 0,
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: tokens.secondary,
  },
  thisWeek: {
    borderRadius: 9999,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: tokens.border,
      ":hover": tokens.accent,
    },
    paddingBlock: "0.5rem",
    paddingInline: "1rem",
    fontFamily: "inherit",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    fontWeight: "inherit",
    color: tokens.primary,
    backgroundColor: "transparent",
    outlineStyle: {
      default: null,
      ":focus-visible": "solid",
    },
    outlineWidth: {
      default: null,
      ":focus-visible": 2,
    },
    outlineColor: {
      default: null,
      ":focus-visible": tokens.accent,
    },
  },
  stage: {
    position: "relative",
    minHeight: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
  },
  hit: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    touchAction: "pan-y",
  },
  marker: {
    pointerEvents: "none",
    position: "absolute",
    height: "1.25rem",
    width: "1.25rem",
    transform: "translate(-50%, -50%)",
    borderRadius: 9999,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: tokens.quiet,
    backgroundColor: `color-mix(in oklab, ${tokens.surface} 30%, transparent)`,
    outlineWidth: 1,
    outlineStyle: "solid",
    outlineColor: tokens.surface,
  },
  explorer: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: tokens.border,
    backgroundColor: tokens.surfaceRaised,
    paddingBlock: "1rem",
    paddingInline: {
      default: "1rem",
      [breakpoints.sm]: "1.5rem",
    },
  },
  explorerMeta: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    justifyContent: "space-between",
    columnGap: "1rem",
    rowGap: "0.25rem",
    marginBottom: "0.75rem",
  },
  metaLabel: {
    marginTop: 0,
    marginBottom: 0,
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: tokens.secondary,
  },
  metaDate: {
    marginTop: "0.25rem",
    marginBottom: 0,
    fontFamily: tokens.fontMono,
    fontSize: {
      default: "0.875rem",
      [breakpoints.sm]: "1rem",
    },
    lineHeight: {
      default: "calc(1.25 / 0.875)",
      [breakpoints.sm]: 1.5,
    },
    color: tokens.primary,
  },
  slider: {
    display: "block",
    height: "2rem",
    width: "100%",
    cursor: "pointer",
    accentColor: tokens.accent,
    outlineStyle: {
      default: null,
      ":focus-visible": "solid",
    },
    outlineWidth: {
      default: null,
      ":focus-visible": 2,
    },
    outlineColor: {
      default: null,
      ":focus-visible": tokens.accent,
    },
  },
  sliderScale: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: tokens.secondary,
  },
});

function WeekMarker({ tx, ty }: { tx: number; ty: number }) {
  const markerProps = stylex.props(styles.marker);
  return (
    <div
      {...markerProps}
      style={{
        ...markerProps.style,
        left: `calc(50% + ${tx}px)`,
        top: `calc(50% + ${ty}px)`,
      }}
    />
  );
}

function BurstHeader({ onThisWeek }: { onThisWeek: () => void }) {
  return (
    <div {...stylex.props(styles.header)}>
      <div>
        <p {...stylex.props(styles.title)}>Follow your weeks</p>
        <p id="burst-help" {...stylex.props(styles.help)}>
          Move over the spiral or use the slider to explore.
        </p>
      </div>
      <button
        type="button"
        {...stylex.props(styles.thisWeek)}
        onClick={onThisWeek}
      >
        This week
      </button>
    </div>
  );
}

function BurstStage({
  containerRef,
  layout,
  reduceMotion,
  shape,
  activeIndex,
  activeItem,
  onInspect,
}: {
  containerRef: React.Ref<HTMLDivElement>;
  layout: BurstLayout | null;
  reduceMotion: boolean;
  shape: ItemShape;
  activeIndex: number;
  activeItem: BurstItem | undefined;
  onInspect: (event: React.PointerEvent<HTMLDivElement>) => void;
}) {
  return (
    <div ref={containerRef} {...stylex.props(styles.stage)}>
      {layout ? (
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
            {...stylex.props(styles.hit)}
            aria-hidden="true"
            onPointerMove={onInspect}
            onPointerDown={onInspect}
          />
          {activeItem ? (
            <WeekMarker tx={activeItem.tx} ty={activeItem.ty} />
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function BurstExplorer({
  layout,
  activeIndex,
  activeItem,
  onSelect,
}: {
  layout: BurstLayout | null;
  activeIndex: number;
  activeItem: BurstItem | undefined;
  onSelect: (index: number) => void;
}) {
  const sliderMax = Math.max(0, (layout?.items.length ?? 1) - 1);
  const yearSpan = Math.ceil((layout?.items.length ?? 4160) / 52);

  return (
    <div {...stylex.props(styles.explorer)}>
      <div {...stylex.props(styles.explorerMeta)}>
        <div>
          <p {...stylex.props(styles.metaLabel)}>
            {weekStateLabel(activeItem)} · Age {activeItem?.yearIndex ?? 0} ·
            Week {activeItem?.weekIndex ?? 1}
          </p>
          <p {...stylex.props(styles.metaDate)}>
            {activeItem?.dateRangeLabel ?? "Preparing your spiral…"}
          </p>
        </div>
        <span {...stylex.props(styles.metaLabel)}>One dot. One week.</span>
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
        max={sliderMax}
        value={activeIndex}
        onChange={event => onSelect(Number(event.target.value))}
        {...stylex.props(styles.slider)}
      />
      <div {...stylex.props(styles.sliderScale)}>
        <span>Birth · spiral center</span>
        <span>{yearSpan} years · outer edge</span>
      </div>
    </div>
  );
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
  const searchParams = useSearchParams();
  const weekCountMode = React.useMemo<LifeWeekCountMode>(
    () => resolveWeekCountMode(searchParams),
    [searchParams]
  );
  const layout = React.useMemo(
    () =>
      layoutWhenReady({
        isValid,
        birthDate,
        totalWeeks,
        width: size.w,
        height: size.h,
        itemSizePx,
        itemSpacingPx,
        weekCountMode,
      }),
    [
      isValid,
      birthDate,
      totalWeeks,
      size.w,
      size.h,
      itemSizePx,
      itemSpacingPx,
      weekCountMode,
    ]
  );
  const currentIndex =
    layout?.items.findIndex(item => item.isCurrentWeek) ?? -1;
  const activeIndex = chosenWeekIndex(selectedIndex, currentIndex);
  const activeItem = layout?.items.at(
    Math.min(activeIndex, layout.items.length - 1)
  );

  if (!isValid) {
    console.warn("BurstScene: Invalid Date Provided");
    return null;
  }

  return (
    <section {...stylex.props(styles.panel)} aria-label="Life in a spiral">
      <BurstHeader
        onThisWeek={() => setSelectedIndex(chosenWeekIndex(null, currentIndex))}
      />
      <BurstStage
        containerRef={containerRef}
        layout={layout}
        reduceMotion={reduceMotion}
        shape={shape}
        activeIndex={activeIndex}
        activeItem={activeItem}
        onInspect={event => inspectBurstWeek(event, layout, setSelectedIndex)}
      />
      <BurstExplorer
        layout={layout}
        activeIndex={activeIndex}
        activeItem={activeItem}
        onSelect={setSelectedIndex}
      />
    </section>
  );
}
