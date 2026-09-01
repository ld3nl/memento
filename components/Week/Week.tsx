import { cn } from "../../lib/utils";
import type { WeekProps } from "./Week.types";

// Week component to display a single week with conditional styling
export const Week = ({
  weekIndex,
  isFilled,
  yearsAlive,
  className,
  isCurrentWeek,
  currentDayOfWeek,
}: WeekProps) => {
  // Calculate fill percentage for current week (1 day = ~14.3%, 7 days = 100%)
  const fillPercentage =
    isCurrentWeek && currentDayOfWeek
      ? Math.round((currentDayOfWeek / 7) * 100)
      : 0;

  const yearNumber = yearsAlive ? Number(yearsAlive) : NaN;
  const yearTick = Number.isFinite(yearNumber)
    ? yearNumber === 1
      ? "origin"
      : yearNumber % 10 === 0
        ? "decade"
        : "mark"
    : undefined;

  return (
    <div
      className={cn(
        "relative size-2 border",
        isFilled && !isCurrentWeek
          ? "border-zinc-900 dark:border-red-600"
          : isCurrentWeek
            ? "border-zinc-900 dark:border-red-600"
            : "border-zinc-900 dark:border-zinc-700",
        {
          "bg-zinc-900 dark:bg-red-600": isFilled && !isCurrentWeek,
          "ml-auto": weekIndex > 26,
          "bg-linear-gradient-to-r from-zinc-900 to-transparent dark:from-red-600":
            isCurrentWeek,
        },
        isCurrentWeek && "current-week",
        yearTick &&
          "data-[tick=origin]:after:font-display data-[tick=decade]:after:font-display data-[tick=decade]:after:text-accent data-[tick=decade]:after:border-accent after:pointer-events-none after:absolute after:top-1/2 after:left-full after:z-1 after:ms-2.5 after:-translate-y-1/2 after:border-l after:border-zinc-400/70 after:ps-1.5 after:font-mono after:text-[0.625rem] after:leading-none after:font-medium after:tracking-[0.14em] after:text-zinc-500 after:tabular-nums after:content-[attr(title)] data-[tick=decade]:after:text-[0.8125rem] data-[tick=decade]:after:leading-none data-[tick=decade]:after:font-normal data-[tick=decade]:after:tracking-[0.02em] data-[tick=decade]:after:italic data-[tick=origin]:after:text-[0.8125rem] data-[tick=origin]:after:leading-none data-[tick=origin]:after:font-normal data-[tick=origin]:after:tracking-[0.02em] data-[tick=origin]:after:text-zinc-800 data-[tick=origin]:after:italic dark:after:border-zinc-600/80 dark:after:text-zinc-400 dark:data-[tick=origin]:after:text-zinc-200",
        className,
      )}
      {...(yearsAlive ? { title: yearsAlive, "data-tick": yearTick } : {})}
      {...(isCurrentWeek && currentDayOfWeek
        ? { "data-current-week-day": currentDayOfWeek }
        : {})}
    >
      {/* Inner fill div for current week partial progress */}
      {isCurrentWeek && currentDayOfWeek && (
        <div
          className="absolute inset-0 origin-left bg-zinc-900 dark:bg-red-600"
          style={{
            width: `${fillPercentage}%`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
