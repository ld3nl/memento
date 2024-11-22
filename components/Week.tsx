"use client";
import { WeekProps } from "../lib/types";

// Week component to display a single week with conditional styling
const Week = ({ weekIndex, isFilled, yearsAlive }: WeekProps) => {
  return (
    <div
      className={[
        `after:content-[attr(title)] after:absolute after:left-full after:ms-4 after:leading-2 after:w-20 after:top-0 after:flex after:text-xs`,
        `size-2 border border-black dark:border-purple-500  relative dark:text-purple-500`,
        isFilled ? "bg-black dark:bg-purple-500" : "",
        weekIndex > 26 ? "ml-auto" : "",
      ].join(" ")}
      // title={`${yearsAlive}`}
      {...(yearsAlive ? { title: `${yearsAlive}` } : {})}
    ></div>
  );
};

export default Week;
