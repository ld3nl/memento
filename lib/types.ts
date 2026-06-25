// TypeScript 5.6.2 Suggestions:
// 1. Use const assertions for better type inference
// 2. Leverage the 'satisfies' operator for type checking
// 3. Utilize template literal types for more precise string types
// 4. Implement the 'in' operator narrowing for more precise type guards
// 5. Use 'as const' with object literals for readonly typed objects
// 6. Leverage improved control flow analysis for more accurate type narrowing
// 7. Utilize the 'infer' keyword in conditional types for better type inference
// 8. Implement mapped type 'as' clauses for more flexible type transformations

export type DecadeGridProps = {
  decadeLength: number;
  weeks: readonly number[]; // Use readonly for immutable arrays
  yearsAlive: number;
  yearIndex: number;
  weeksFromLastBday: number;
  daysIntoCurrentWeek: number; // 1-7 representing day within current week
};
