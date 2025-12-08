"use client";
import type { WeekProps } from "../lib/types";
import { cn } from "../lib/utils";

// Week component to display a single week with conditional styling
const Week = ({ weekIndex, isFilled, yearsAlive, className }: WeekProps) => {
  return (
    <div
      className={cn(
        "after:transition-all after:transition-discrete after:delay-100 after:duration-300",
        "after:absolute after:top-0 after:left-full after:ms-4 after:flex after:w-20 after:text-xs after:leading-2 after:content-[attr(title)]",
        "relative size-2 border border-black dark:border-purple-500 dark:text-purple-500",
        {
          "bg-black dark:bg-purple-500": isFilled,
          "ml-auto": weekIndex > 26,
        },
        className,
      )}
      // title={`${yearsAlive}`}
      {...(yearsAlive ? { title: `${yearsAlive}` } : {})}
    />
  );
};

export default Week;
