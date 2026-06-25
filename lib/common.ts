/**
 * Common utilities - maintained for backward compatibility
 * @deprecated Use specific utility modules instead
 */

import {
  calculateFullAge as _calculateFullAge,
  getFormattedAge,
} from "./date-utils";
import { generateLifeTableUrl } from "./url-utils";

/**
 * @deprecated Use calculateFullAge from date-utils instead
 */
export const calculateFullAge = (dob: string | Date, format = "yyyy-MM-dd") => {
  return _calculateFullAge(dob, format);
};

/**
 * @deprecated Use getFormattedAge from date-utils instead
 */
export const getYearsAlive = (dob: string | Date) => {
  if (!dob || dob === "") {
    console.error("Enter valid date");
    return;
  }

  return getFormattedAge(dob);
};

/**
 * @deprecated Use generateLifeTableUrl from url-utils instead
 */
export const generateUrl = (date: string | null, name?: string) => {
  return generateLifeTableUrl(date, name);
};
