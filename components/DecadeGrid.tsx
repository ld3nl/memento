import YearGrid from "./YearGrid";
import { DecadeGridProps } from "../lib/types";

const DecadeGrid = ({
  decadeLength,
  weeks,
  yeasAlive,
  yearIndex,
  weeksFromLastBday,
}: DecadeGridProps) => {
  return (
    <>
      {Array.from({ length: decadeLength }, (_, decadeIndex) => {
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
      })}
    </>
  );
};

export default DecadeGrid;
