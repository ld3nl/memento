"use client";
import type { WeekProps } from "../lib/types";
import { cn } from "../lib/utils";

// Week component to display a single week with conditional styling
const Week = ({ weekIndex, isFilled, yearsAlive, className }: WeekProps) => {
  return (
    <div
      className={cn(
        "after:pointer-events-none",
        "after:absolute after:top-0 after:left-full after:ms-4 after:-mt-1  after:text-xs after:leading-none after:content-[attr(title)]",
        "relative size-2 border border-black dark:border-purple-500 dark:text-purple-500",
        {
          "bg-black dark:bg-purple-500": isFilled,
          "ml-auto": weekIndex > 26,
        },
        className,
      )}
      {...(yearsAlive ? { title: `${yearsAlive}` } : {})}
    />
  );
};

export default Week;
