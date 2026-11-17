import * as stylex from "@stylexjs/stylex";
import { breakpoints } from "../../styles/breakpoints.stylex";
import { tokens } from "../../styles/tokens.stylex";
import type { WeekProps } from "./Week.types";

type YearTick = "origin" | "decade" | "mark";

function yearTickFor(yearsAlive: string | undefined): YearTick | undefined {
  const yearNumber = yearsAlive ? Number(yearsAlive) : Number.NaN;
  if (!Number.isFinite(yearNumber)) return undefined;
  if (yearNumber === 1) return "origin";
  if (yearNumber % 10 === 0) return "decade";
  return "mark";
}

function currentWeekFill(
  isCurrentWeek: boolean | undefined,
  currentDayOfWeek: number | undefined
) {
  if (!isCurrentWeek || !currentDayOfWeek) return 0;
  return Math.round((currentDayOfWeek / 7) * 100);
}

const styles = stylex.create({
  cell: {
    position: "relative",
    width: "0.5rem",
    height: "0.5rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: tokens.week,
      [breakpoints.dark]: tokens.accent,
    },
    printColorAdjust: "exact",
    WebkitPrintColorAdjust: "exact",
  },
  emptyBorder: {
    borderColor: {
      default: tokens.week,
      [breakpoints.dark]: tokens.border,
    },
  },
  filled: {
    backgroundColor: {
      default: tokens.week,
      [breakpoints.dark]: tokens.accent,
    },
  },
  secondHalf: {
    marginLeft: "auto",
  },
  fillBar: {
    position: "absolute",
    inset: 0,
    transformOrigin: "left center",
    backgroundColor: {
      default: tokens.week,
      [breakpoints.dark]: tokens.accent,
    },
    width: "var(--week-fill)",
    printColorAdjust: "exact",
    WebkitPrintColorAdjust: "exact",
  },
  tick: {
    pointerEvents: "none",
    position: "absolute",
    top: "50%",
    left: "100%",
    zIndex: 1,
    marginLeft: "0.625rem",
    transform: "translateY(-50%)",
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: {
      default: `color-mix(in oklab, ${tokens.secondary} 70%, transparent)`,
      [breakpoints.dark]: `color-mix(in oklab, ${tokens.border} 80%, transparent)`,
    },
    paddingLeft: "0.375rem",
    fontFamily: tokens.fontMono,
    fontSize: tokens.tick,
    lineHeight: 1,
    fontWeight: 500,
    letterSpacing: tokens.trackingTick,
    color: {
      default: tokens.secondary,
      [breakpoints.dark]: tokens.secondary,
    },
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },
  tickOrigin: {
    fontFamily: tokens.fontDisplay,
    fontSize: tokens.tickLg,
    lineHeight: 1,
    fontWeight: 400,
    letterSpacing: tokens.trackingTickSoft,
    fontStyle: "italic",
    color: {
      default: tokens.primary,
      [breakpoints.dark]: tokens.quiet,
    },
  },
  tickDecade: {
    fontFamily: tokens.fontDisplay,
    fontSize: tokens.tickLg,
    lineHeight: 1,
    fontWeight: 400,
    letterSpacing: tokens.trackingTickSoft,
    fontStyle: "italic",
    // Match production Tailwind cascade: decade label is accent in light,
    // but `dark:after:text-secondary` wins over `data-[tick=decade]:after:text-accent`.
    color: {
      default: tokens.accent,
      [breakpoints.dark]: tokens.secondary,
    },
    borderLeftColor: tokens.accent,
  },
});

export const Week = ({
  weekIndex,
  isFilled,
  yearsAlive,
  className,
  isCurrentWeek,
  currentDayOfWeek,
}: WeekProps) => {
  const yearTick = yearTickFor(yearsAlive);
  const fillPercentage = currentWeekFill(isCurrentWeek, currentDayOfWeek);
  const showFill = Boolean(isCurrentWeek && currentDayOfWeek);
  const isLived = Boolean(isFilled || isCurrentWeek);

  const stylexProps = stylex.props(
    styles.cell,
    !isLived && styles.emptyBorder,
    Boolean(isFilled && !isCurrentWeek) && styles.filled,
    weekIndex > 26 && styles.secondHalf
  );

  const markerClasses = [
    stylexProps.className,
    isCurrentWeek ? "current-week" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      {...stylexProps}
      className={markerClasses}
      {...(yearsAlive ? { title: yearsAlive, "data-tick": yearTick } : {})}
      {...(showFill ? { "data-current-week-day": currentDayOfWeek } : {})}
    >
      {showFill ? (
        <div
          {...stylex.props(styles.fillBar)}
          style={{ ["--week-fill" as string]: `${fillPercentage}%` }}
          aria-hidden="true"
        />
      ) : null}
      {yearTick && yearsAlive ? (
        <span
          {...stylex.props(
            styles.tick,
            yearTick === "origin" && styles.tickOrigin,
            yearTick === "decade" && styles.tickDecade
          )}
        >
          {yearsAlive}
        </span>
      ) : null}
    </div>
  );
};
