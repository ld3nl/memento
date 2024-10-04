export type LabeledInputProps = {
  labelString: string;
  inputId: string;
  inputType: string;
  inputProps?: any;
};

export type LifeTableProps = {
  dob: string | Date;
};

export type DecadeGridProps = {
  decadeLength: number;
  weeks: number[];
  yeasAlive: number;
  yearIndex: number;
  weeksFromLastBday: number;
};

export type YearGridProps = {
  weeks: number[];
  yeasAlive: number;
  currentDecadeYear: number;
  weeksFromLastBday: number;
};

export type WeekProps = {
  weekIndex: number;
  isFilled: boolean;
};
