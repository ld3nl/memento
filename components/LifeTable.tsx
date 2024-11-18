"use client";
import {
  differenceInCalendarISOWeekYears,
  differenceInCalendarISOWeeks,
  subDays,
  getDate,
  getMonth,
} from "date-fns";
import DecadeGrid from "./DecadeGrid";

import { LifeTableProps } from "../lib/types";

// Suggestions for using React 19 and Next.js 15:
// 1. Use the new 'use' hook for data fetching in Server Components
// 2. Implement Server Components for improved performance
// 3. Utilize Suspense boundaries for better loading states
// 4. Take advantage of automatic code splitting and lazy loading
// 5. Use the new app directory structure for better organization
// 6. Implement parallel routing for more complex UI states
// 7. Use the new error.js file for custom error handling
// 8. Leverage the improved TypeScript support
// 9. Utilize the new Image component for optimized images if needed
// 10. Implement streaming SSR for improved performance
// 11. Use React Server Components for data fetching and rendering
// 12. Implement the new useFormState hook for form state management
// 13. Use the useOptimistic hook for optimistic UI updates
// 14. Implement Server Actions for form submissions
// 15. Use the new useFormStatus hook for better form UX

const LifeTable = ({ dob }: LifeTableProps) => {
  const today = new Date();
  const lastYear = subDays(today, 365).getFullYear() + 1;

  const dobDate = new Date(dob);

  const weeksFromLastBday = differenceInCalendarISOWeeks(
    new Date(),
    new Date(lastYear, getMonth(dobDate), getDate(dobDate))
  );

  const yeasAlive = differenceInCalendarISOWeekYears(today, dobDate) - 1;

  // loop 52 weeks
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);
  const decadeLength = 10;
  const yearsInLifetime = 8;

  return (
    <>
      {Array.from({ length: yearsInLifetime }, (_, yearIndex) => (
        <div
          key={`year-${yearIndex}`}
          className="grid gap-y-2 mb-4"
          data-cy={"life-table"}
        >
          <DecadeGrid
            decadeLength={decadeLength}
            weeks={weeks}
            yeasAlive={yeasAlive}
            yearIndex={yearIndex}
            weeksFromLastBday={weeksFromLastBday}
          />
        </div>
      ))}
    </>
  );
};

export default LifeTable;
