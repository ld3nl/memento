import type { WeekSpan } from "../../lib/week-notes";

export type LifeTableProps = {
  dob: string | Date;
  /** Authored marks for a public life. Skips the device store. */
  preset?: WeekSpan[];
  /** Hide the editor. Implied when `preset` is set. */
  readOnly?: boolean;
};
