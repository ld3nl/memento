/**
 * URL generation and manipulation utilities
 */

import type { LifeWeekCountMode } from "./life-grid-time";

/**
 * Canonical picture for a birthdate. Month and day have no leading zero.
 * `/life/1971/06/28/life-in-weeks.jpg` still resolves to the same picture.
 * That picture lines each year up with the real birthday. The 7-day grid
 * asks for the same file with `?weeks=grid`.
 */
export const lifeImagePath = (
  date: Date,
  mode: LifeWeekCountMode = "calendar"
): string => {
  const path = `/life/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/life-in-weeks.jpg`;
  return mode === "birthday-grid" ? `${path}?weeks=grid` : path;
};

/** Picture query. Anything other than `grid` is the birthday-aligned year. */
export function lifeImageModeFromQuery(
  weeks: string | null | undefined
): LifeWeekCountMode {
  return weeks === "grid" ? "birthday-grid" : "calendar";
}

/**
 * Generates a URL for the life table or burst view page
 */
export const generateLifeTableUrl = (
  date: string | null,
  name?: string,
  view: "table" | "burst" = "table",
  options?: { calendarWeeks?: boolean }
): string => {
  const basePath = `/${view}`;

  const datePath = date ? `/${date.split("-").join("/")}` : "";

  const query: string[] = [];
  if (name?.trim()) {
    query.push(`name=${encodeURIComponent(name.trim())}`);
  }
  if (options?.calendarWeeks) query.push("weeks=calendar");
  const suffix = query.join("&");

  return `${basePath}${datePath}${suffix ? `?${suffix}` : ""}`;
};

/**
 * Parses date from URL path segments
 */
export const parseDateFromUrl = (pathSegments: string[]): string | null => {
  if (pathSegments.length < 3) return null;

  const [year, month, day] = pathSegments;

  // Basic validation
  if (!year || !month || !day) return null;

  // Ensure proper formatting (YYYY-MM-DD)
  const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  return formattedDate;
};

/** Local calendar date from `/yyyy/m/d` segments (not UTC `Date.parse`). */
export const birthDateFromPathSegments = (
  pathSegments: string[]
): Date | null => {
  const iso = parseDateFromUrl(pathSegments);
  if (!iso) return null;

  const [year, month, day] = iso.split("-").map(Number);
  if (
    year === undefined ||
    month === undefined ||
    day === undefined ||
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day)
  ) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

/**
 * Extracts name from URL search params
 */
export const extractNameFromUrl = (
  searchParams: URLSearchParams
): string | null => {
  const name = searchParams.get("name");
  return name?.trim() ? name.trim() : null;
};
