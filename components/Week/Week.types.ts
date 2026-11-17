export type WeekProps = {
  className?: string;
  weekIndex: number;
  isFilled: boolean;
  yearsAlive?: string;
  isCurrentWeek?: boolean;
  currentDayOfWeek?: number; // 1-7 representing day within the week
  /** Life-year row (1–80). Present only when the cell can open the week dialog. */
  lifeYear?: number;
  /** Keyboard entry when this life has no current week inside the grid. */
  tabStop?: boolean;
};
