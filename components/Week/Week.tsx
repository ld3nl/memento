import { cn } from "../../lib/utils";
import type { WeekProps } from "./Week.types";

const YEAR_TICK_CLASSES =
  "data-[tick=origin]:after:font-display data-[tick=decade]:after:font-display data-[tick=decade]:after:text-accent data-[tick=decade]:after:border-accent after:pointer-events-none after:absolute after:top-1/2 after:left-full after:z-1 after:ms-2.5 after:-translate-y-1/2 after:border-l after:border-secondary/70 after:ps-1.5 after:font-mono after:text-tick after:leading-none after:font-medium after:tracking-tick after:text-secondary after:tabular-nums after:content-[attr(title)] data-[tick=decade]:after:text-tick-lg data-[tick=decade]:after:leading-none data-[tick=decade]:after:font-normal data-[tick=decade]:after:tracking-tick-soft data-[tick=decade]:after:italic data-[tick=origin]:after:text-tick-lg data-[tick=origin]:after:leading-none data-[tick=origin]:after:font-normal data-[tick=origin]:after:tracking-tick-soft data-[tick=origin]:after:text-primary data-[tick=origin]:after:italic dark:after:border-border/80 dark:after:text-secondary dark:data-[tick=origin]:after:text-quiet";

function yearTickFor(yearsAlive: string | undefined) {
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

function borderClassName(
  isFilled: boolean | undefined,
  isCurrentWeek: boolean | undefined
) {
  if (isFilled || isCurrentWeek) return "border-week dark:border-accent";
  return "border-week dark:border-border";
}

function weekClassName(
  { weekIndex, isFilled, className, isCurrentWeek }: WeekProps,
  yearTick: string | undefined
) {
  return cn(
    "relative size-2 border",
    borderClassName(isFilled, isCurrentWeek),
    {
      "bg-week dark:bg-accent": isFilled && !isCurrentWeek,
      "ml-auto": weekIndex > 26,
      "bg-linear-gradient-to-r from-week to-transparent dark:from-accent":
        isCurrentWeek,
    },
    isCurrentWeek && "current-week",
    yearTick && YEAR_TICK_CLASSES,
    className
  );
}

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
  const showFill = isCurrentWeek && currentDayOfWeek;

  return (
    <div
      className={weekClassName(
        { weekIndex, isFilled, className, isCurrentWeek },
        yearTick
      )}
      {...(yearsAlive ? { title: yearsAlive, "data-tick": yearTick } : {})}
      {...(showFill ? { "data-current-week-day": currentDayOfWeek } : {})}
    >
      {showFill ? (
        <div
          className="absolute inset-0 origin-left bg-week dark:bg-accent"
          style={{ width: `${fillPercentage}%` }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
};
