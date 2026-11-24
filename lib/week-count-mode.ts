import type { ReadonlyURLSearchParams } from "next/navigation";
import {
  DEFAULT_LIFE_WEEK_COUNT_MODE,
  type LifeWeekCountMode,
} from "./life-grid-time";
import { readFormDataSync } from "./storage";

export const CALENDAR_WEEKS_SESSION_KEY = "memento:calendarWeeks";

export function writeCalendarWeeksPreference(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CALENDAR_WEEKS_SESSION_KEY, enabled ? "1" : "0");
  } catch {
    // Private browsing.
  }
}

export function resolveWeekCountMode(
  searchParams: ReadonlyURLSearchParams | URLSearchParams | null
): LifeWeekCountMode {
  if (searchParams?.get("weeks") === "calendar") return "calendar";
  if (readFormDataSync()?.calendarWeeks) return "calendar";
  if (typeof window !== "undefined") {
    try {
      if (sessionStorage.getItem(CALENDAR_WEEKS_SESSION_KEY) === "1") {
        return "calendar";
      }
    } catch {
      // ignore
    }
  }
  return DEFAULT_LIFE_WEEK_COUNT_MODE;
}
