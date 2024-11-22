// TypeScript 5.6.2 Suggestions:
// 1. Use const assertions for better type inference
// 2. Leverage the 'satisfies' operator for type checking
// 3. Utilize template literal types for more precise string types
// 4. Implement the 'in' operator narrowing for more precise type guards
// 5. Use 'as const' with object literals for readonly typed objects
// 6. Leverage improved control flow analysis for more accurate type narrowing
// 7. Utilize the 'infer' keyword in conditional types for better type inference
// 8. Implement mapped type 'as' clauses for more flexible type transformations

export type LabeledInputProps = {
  labelString: string;
  inputId: string;
  inputType: "text" | "number" | "date" | "email"; // Use literal types for more precise typing
  inputProps?: Record<string, unknown>; // Use Record type instead of 'any' for better type safety
};

export type LifeTableProps = {
  dob: string | Date;
};

export type DecadeGridProps = {
  decadeLength: number;
  weeks: readonly number[]; // Use readonly for immutable arrays
  yearsAlive: number;
  yearIndex: number;
  weeksFromLastBday: number;
};

export type YearGridProps = {
  weeks: readonly number[]; // Use readonly for immutable arrays
  yearsAlive: number;
  currentDecadeYear: number;
  weeksFromLastBday: number;
};

export type WeekProps = {
  weekIndex: number;
  isFilled: boolean;
  yearsAlive?: string;
};

// Example of using const assertions and satisfies operator
export const WEEK_DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

// Example of using template literal types
export type DateString = `${number}-${number}-${number}`;

// Example of using 'in' operator narrowing
export function isYearGridProps(
  props: DecadeGridProps | YearGridProps
): props is YearGridProps {
  return "currentDecadeYear" in props;
}

// Example of using mapped type 'as' clauses
export type ReadonlyProps<T> = {
  readonly [K in keyof T as `readonly${Capitalize<string & K>}`]: T[K];
};

// Usage example:
// type ReadonlyWeekProps = ReadonlyProps<WeekProps>;
// Result: { readonly readonlyWeekIndex: number; readonly readonlyIsFilled: boolean; }
