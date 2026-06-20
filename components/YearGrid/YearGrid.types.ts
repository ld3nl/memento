export type YearGridProps = {
  weeks: readonly number[] // Use readonly for immutable arrays
  yearsAlive: number
  currentDecadeYear: number
  weeksFromLastBday: number
  daysIntoCurrentWeek: number // 1-7 representing day within current week
}
