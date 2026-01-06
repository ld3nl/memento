"use client";

import { memo, useMemo, useTransition } from "react";
import { calculateDecadeYear } from "../lib/life-table-utils";
import type { DecadeGridProps } from "../lib/types";
import YearGrid from "./YearGrid";

// DecadeGrid component to display a grid of years for a decade
const DecadeGrid = memo(
  ({
    decadeLength,
    weeks,
    yearsAlive,
    yearIndex,
    weeksFromLastBday,
    daysIntoCurrentWeek,
  }: DecadeGridProps) => {
    const [isPending] = useTransition();

    // Memoize the decade years to avoid unnecessary re-renders
    const decadeYears = useMemo(() => {
      return Array.from({ length: decadeLength }, (_, decadeIndex) => {
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
    }, [decadeLength, weeks, yearsAlive, yearIndex, weeksFromLastBday, daysIntoCurrentWeek]);

    return (
      <div data-cy="decade-grid" className="flex flex-col gap-2">
        {isPending ? <div>Loading...</div> : decadeYears}
      </div>
    );
  },
);

DecadeGrid.displayName = "DecadeGrid";

export default DecadeGrid;
