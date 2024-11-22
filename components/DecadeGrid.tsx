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
    yearsAlive,
    yearIndex,
    weeksFromLastBday,
  }: DecadeGridProps) => {
    const [isPending] = useTransition();

    // Memoize the decade years to avoid unnecessary re-renders
    const decadeYears = useMemo(() => {
      return Array.from({ length: decadeLength }, (_, decadeIndex) => {
        const currentDecadeYear = decadeIndex + 1 + yearIndex * decadeLength;

        // const isFilled =
        //   yearsAlive >= currentDecadeYear ||
        //   (yearsAlive === currentDecadeYear && weeksFromLastBday >= 52);

        // console.log("isFilled", isFilled);
        return (
          <YearGrid
            key={`decade-${decadeIndex}`}
            weeks={weeks}
            yearsAlive={yearsAlive}
            currentDecadeYear={currentDecadeYear}
            weeksFromLastBday={weeksFromLastBday}
          />
        );
      });
    }, [decadeLength, weeks, yearsAlive, yearIndex, weeksFromLastBday]);

    return <>{isPending ? <div>Loading...</div> : decadeYears}</>;
  }
);

DecadeGrid.displayName = "DecadeGrid";

export default DecadeGrid;
