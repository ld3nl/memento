"use client";

import { useTransition } from "react";
import { calculateDecadeYear } from "../lib/life-table-utils";
import type { DecadeGridProps } from "../lib/types";
import { YearGrid } from "./YearGrid/YearGrid";

// DecadeGrid component to display a grid of years for a decade
const DecadeGrid = ({
  decadeLength,
  weeks,
  yearsAlive,
  yearIndex,
  weeksFromLastBday,
  daysIntoCurrentWeek,
}: DecadeGridProps) => {
  const [isPending] = useTransition();

  const decadeYears = Array.from({ length: decadeLength }, (_, decadeIndex) => {
    const currentDecadeYear = calculateDecadeYear(
      decadeIndex,
      yearIndex,
      decadeLength,
    );

    return (
      <YearGrid
        key={currentDecadeYear}
        weeks={weeks}
        yearsAlive={yearsAlive}
        currentDecadeYear={currentDecadeYear}
        weeksFromLastBday={weeksFromLastBday}
        daysIntoCurrentWeek={daysIntoCurrentWeek}
      />
    );
  });

  return (
    <div data-cy="decade-grid" className="flex flex-col gap-2">
      {isPending ? <div>Loading...</div> : decadeYears}
    </div>
  );
};

export default DecadeGrid;
