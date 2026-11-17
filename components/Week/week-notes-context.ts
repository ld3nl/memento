"use client";

import { createContext } from "react";
import type { WeekSpan } from "../../lib/week-notes";

export type WeekNotesApi = {
  spans: WeekSpan[];
  marksFor: (lifeYear: number, weekIndex: number) => WeekSpan[];
  hoverFor: (lifeYear: number, weekIndex: number) => string | null;
  add: (lifeYear: number, weekIndex: number, label: string) => void;
  setRange: (id: string, start: string, end: string) => void;
  setColor: (id: string, color: string) => void;
  remove: (id: string) => void;
  /** One saved note per name, so a later week can start another period. */
  known: WeekSpan[];
  remembered: boolean;
  /** Inclusive life window for the date fields, yyyy-mm-dd. */
  lifeStart: string | null;
  lifeEnd: string | null;
  /** A public life shows the record and does not write it. */
  readOnly: boolean;
};

export const WeekNotesContext = createContext<WeekNotesApi | null>(null);
