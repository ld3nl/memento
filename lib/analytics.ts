"use client";

import { sendGAEvent } from "@next/third-parties/google";

/** Decade only. The full birthdate is already in the page path. */
export function birthDecade(isoDate: string): string | null {
  const year = Number(isoDate.slice(0, 4));
  if (!Number.isInteger(year) || year < 1000 || year > 9999) return null;
  return `${Math.floor(year / 10) * 10}s`;
}

export function trackGenerateCalendar(isoDate: string, named: boolean) {
  const decade = birthDecade(isoDate);
  sendGAEvent("event", "generate_calendar", {
    ...(decade ? { birth_decade: decade } : {}),
    named: named ? "yes" : "no",
  });
}

export function trackSwitchView(view: "table" | "burst") {
  sendGAEvent("event", "switch_view", { view });
}
