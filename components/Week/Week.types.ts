export type WeekProps = {
  className?: string;
  weekIndex: number;
  isFilled: boolean;
  yearsAlive?: string;
  isCurrentWeek?: boolean;
  currentDayOfWeek?: number; // 1-7 representing day within the week
};
