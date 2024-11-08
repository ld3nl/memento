"use client";

import YearGrid from "./YearGrid";
import { DecadeGridProps } from "../lib/types";
import { memo, useMemo } from "react";
import { useTransition } from "react";

// DecadeGrid component to display a grid of years for a decade
const DecadeGrid = memo(
  ({
    decadeLength,
    weeks,
    yeasAlive,
    yearIndex,
    weeksFromLastBday,
  }: DecadeGridProps) => {
    const [isPending] = useTransition();

    // Memoize the decade years to avoid unnecessary re-renders
    const decadeYears = useMemo(() => {
      return Array.from({ length: decadeLength }, (_, decadeIndex) => {
        const currentDecadeYear = decadeIndex + 1 + yearIndex * decadeLength;
        return (
          <YearGrid
            key={`decade-${decadeIndex}`}
            weeks={weeks}
            yeasAlive={yeasAlive}
            currentDecadeYear={currentDecadeYear}
            weeksFromLastBday={weeksFromLastBday}
          />
        );
      });
    }, [decadeLength, weeks, yeasAlive, yearIndex, weeksFromLastBday]);

    return <>{isPending ? <div>Loading...</div> : decadeYears}</>;
  }
);

DecadeGrid.displayName = "DecadeGrid";

export default DecadeGrid;
