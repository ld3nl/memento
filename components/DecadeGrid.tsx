import * as stylex from "@stylexjs/stylex";
import { calculateDecadeYear } from "../lib/life-table-utils";
import type { DecadeGridProps } from "../lib/types";
import { YearGrid } from "./YearGrid/YearGrid";

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
});

const DecadeGrid = ({
  decadeLength,
  weeks,
  yearsAlive,
  yearIndex,
  weeksFromLastBday,
  daysIntoCurrentWeek,
}: DecadeGridProps) => {
  const decadeYears = Array.from({ length: decadeLength }, (_, decadeIndex) => {
    const currentDecadeYear = calculateDecadeYear(
      decadeIndex,
      yearIndex,
      decadeLength
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
    <div data-cy="decade-grid" {...stylex.props(styles.root)}>
      {decadeYears}
    </div>
  );
};

export default DecadeGrid;
