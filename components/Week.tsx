"use client";
import type { WeekProps } from "../lib/types";
import { cn } from "../lib/utils";

// Week component to display a single week with conditional styling
const Week = ({
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
        "relative size-2 border border-black dark:border-purple-500 dark:text-purple-500",
        {
          "bg-black dark:bg-purple-500": isFilled && !isCurrentWeek,
          "ml-auto": weekIndex > 26,
          "bg-linear-gradient-to-r from-black to-transparent": isCurrentWeek,
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
          className="absolute inset-0 origin-left bg-black dark:bg-purple-500"
          style={{
            width: `${fillPercentage}%`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Week;
