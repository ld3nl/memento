"use client";
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

  return (
    <div
      className={cn(
        "after:pointer-events-none",
        "after:absolute after:top-0 after:left-full after:ms-4 after:text-[8px]/1 after:leading-none after:content-[attr(title)]",
        "relative size-2 border text-zinc-500 dark:text-zinc-400",
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
        // Current week styling
        isCurrentWeek && "current-week overflow-hidden",
        className,
      )}
      {...(yearsAlive ? { title: `${yearsAlive}` } : {})}
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
