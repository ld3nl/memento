"use client"

import YearGrid from "./YearGrid";
import { DecadeGridProps } from "../lib/types";
import { memo, useMemo } from 'react';
import {  useTransition } from 'react';


// Suggestions for using React 19 and Next.js 15:
// 1. Use memo to optimize rendering performance
// 2. Implement useMemo for expensive calculations
// 3. Utilize useTransition for improved user experience during updates
// 4. Consider using Server Components for better initial load performance
// 5. Implement Suspense boundaries for smoother loading states
// 6. Use the new 'use client' directive if client-side interactivity is needed
// 7. Leverage the improved TypeScript support in Next.js 15
// 8. Consider using the new Image component for optimized images if needed
// 9. Implement error boundaries using the new ErrorBoundary component
// 10. Use the new parallel routing feature for complex UI states if applicable

const DecadeGrid = memo(({
  decadeLength,
  weeks,
  yeasAlive,
  yearIndex,
  weeksFromLastBday,
}: DecadeGridProps) => {
  const [isPending, startTransition] = useTransition();

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

  return (
    <>
      {isPending ? (
        <div>Loading...</div>
      ) : (
        decadeYears
      )}
    </>
  );
});

DecadeGrid.displayName = 'DecadeGrid';

export default DecadeGrid;
