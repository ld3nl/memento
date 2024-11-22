"use client";

import Week from "./Week";
import { YearGridProps } from "../lib/types";

// YearGrid component to display a grid of weeks for a year
const YearGrid = ({
  weeks,
  yearsAlive,
  currentDecadeYear,
  weeksFromLastBday,
}: YearGridProps) => {
  return (
    <div className={`grid grid-cols-52 w-[52rem] mx-auto`}>
      {weeks.map((weekIndex) => {
        // Determine if the week should be filled based on the years alive and weeks from the last birthday
        const isFilled =
          yearsAlive >= currentDecadeYear ||
          (yearsAlive + 1 === currentDecadeYear &&
            weeksFromLastBday >= weekIndex);

        // console.log("currentDecadeYear", currentDecadeYear);
        return (
          <Week
            key={weekIndex}
            weekIndex={weekIndex}
            isFilled={isFilled}
            {...(weekIndex === 52
              ? { yearsAlive: `${currentDecadeYear} yo` }
              : {})}
          />
        );
      })}
    </div>
  );
};

export default YearGrid;
