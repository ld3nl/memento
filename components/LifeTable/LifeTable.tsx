"use client";

import * as stylex from "@stylexjs/stylex";
import { addDays, addWeeks, format } from "date-fns";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DECADE_LENGTH,
  WEEKS_PER_YEAR,
  YEARS_IN_LIFETIME,
} from "../../lib/constants";
import {
  calculateWeeksFromLastBirthday,
  calculateYearsAlive,
  getDaysIntoCurrentWeek,
} from "../../lib/date-utils";
import { generateDecadeConfig } from "../../lib/life-table-utils";
import { describeLifeWeek, lifeWeekDays } from "../../lib/life-week";
import { readFormDataSync } from "../../lib/storage";
import { isValidDate, parseAndValidateDate } from "../../lib/validation";
import {
  addSpan,
  formatNoteHover,
  knownSpans,
  loadWeekNotes,
  readWeekNotesSync,
  removeSpan,
  saveWeekNotes,
  setSpanColor,
  setSpanRange,
  spansCovering,
  type WeekSpan,
} from "../../lib/week-notes";
import DecadeGrid from "../DecadeGrid";
import { WeekInspectContext } from "../Week/week-inspect";
import {
  type WeekNotesApi,
  WeekNotesContext,
} from "../Week/week-notes-context";
import type { LifeTableProps } from "./LifeTable.types";
import { WeekDialog } from "./WeekDialog";

type SelectedWeek = {
  lifeYear: number;
  weekIndex: number;
};

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
});

export const LifeTable = ({ dob, preset, readOnly }: LifeTableProps) => {
  const locked = readOnly ?? preset !== undefined;
  const [selected, setSelected] = useState<SelectedWeek | null>(null);
  const [spans, setSpans] = useState<WeekSpan[]>(() => preset ?? []);
  const [remembered, setRemembered] = useState(false);
  const spansRef = useRef(spans);
  useEffect(() => {
    spansRef.current = spans;
  }, [spans]);
  const inspect = useCallback((lifeYear: number, weekIndex: number) => {
    setSelected({ lifeYear, weekIndex });
  }, []);

  useEffect(() => {
    if (locked) return;
    let cancel = false;
    const saved = readFormDataSync();
    const on = Boolean(saved?.saveData);
    // react-doctor-disable-next-line react-hooks-js/set-state-in-effect
    setRemembered(on);
    if (!on) return;
    const cached = readWeekNotesSync();
    if (cached.length > 0) {
      setSpans(cached);
      return;
    }
    void loadWeekNotes().then(book => {
      if (cancel || book.length === 0) return;
      setSpans(current => (current.length > 0 ? current : book));
    });
    return () => {
      cancel = true;
    };
  }, [locked]);

  const dobDate = dob && isValidDate(dob) ? parseAndValidateDate(dob) : null;

  const notesApi = useMemo<WeekNotesApi>(() => {
    const lifeStart = dobDate ? format(dobDate, "yyyy-MM-dd") : null;
    const lifeEnd = dobDate
      ? format(
          addDays(
            addWeeks(
              dobDate,
              YEARS_IN_LIFETIME * DECADE_LENGTH * WEEKS_PER_YEAR - 1
            ),
            6
          ),
          "yyyy-MM-dd"
        )
      : null;
    const bounds =
      lifeStart && lifeEnd ? { min: lifeStart, max: lifeEnd } : undefined;
    const commit = (recipe: (prev: WeekSpan[]) => WeekSpan[]) => {
      if (locked) return;
      const next = recipe(spansRef.current);
      if (next === spansRef.current) return;
      spansRef.current = next;
      setSpans(next);
      if (remembered) void saveWeekNotes(next);
    };
    const marksFor = (lifeYear: number, weekIndex: number): WeekSpan[] => {
      if (!dobDate) return [];
      const days = lifeWeekDays(dobDate, lifeYear, weekIndex);
      return spansCovering(spans, days.startDay, days.endDay);
    };
    return {
      spans,
      remembered,
      known: knownSpans(spans),
      lifeStart,
      lifeEnd,
      marksFor,
      hoverFor: (lifeYear, weekIndex) => {
        const marks = marksFor(lifeYear, weekIndex);
        if (!marks.length || !dobDate) return null;
        const week = describeLifeWeek(dobDate, lifeYear, weekIndex);
        return formatNoteHover(
          marks.map(mark => mark.label),
          week.label
        );
      },
      add: (lifeYear, weekIndex, label) => {
        if (!dobDate) return;
        const days = lifeWeekDays(dobDate, lifeYear, weekIndex);
        commit(prev => addSpan(prev, label, days.startDay, days.endDay));
      },
      setRange: (id, start, end) => {
        commit(prev => setSpanRange(prev, id, start, end, bounds));
      },
      setColor: (id, color) => {
        commit(prev => setSpanColor(prev, id, color));
      },
      remove: id => {
        commit(prev => removeSpan(prev, id));
      },
      readOnly: locked,
    };
  }, [dobDate, spans, remembered, locked]);

  // Validate input DOB
  if (!dob) {
    console.error("Missing date of birth");
    return null;
  }

  if (!isValidDate(dob)) {
    console.error("Invalid date of birth:", dob);
    return null;
  }

  // Calculate years alive and weeks from birthday using utilities
  const yearsAlive = calculateYearsAlive(dob);
  const weeksFromBirthday = calculateWeeksFromLastBirthday(dob);
  const daysIntoCurrentWeek = getDaysIntoCurrentWeek(dob);

  // Return null if calculations failed
  if (
    yearsAlive === null ||
    weeksFromBirthday === null ||
    daysIntoCurrentWeek === null
  ) {
    console.error("Failed to calculate age data");
    return null;
  }

  // Get configuration using utilities
  const { weeks, yearsInLifetime, decadeLength } = generateDecadeConfig();
  const detail =
    selected && dobDate
      ? describeLifeWeek(dobDate, selected.lifeYear, selected.weekIndex)
      : null;

  return (
    <WeekInspectContext.Provider value={inspect}>
      <WeekNotesContext.Provider value={notesApi}>
        <div {...stylex.props(styles.root)} data-cy="life-table">
          {Array.from(
            { length: yearsInLifetime },
            (_, yearIndex) => yearIndex
          ).map(yearOfLife => (
            <DecadeGrid
              key={yearOfLife}
              decadeLength={decadeLength}
              weeks={weeks}
              yearsAlive={yearsAlive}
              yearIndex={yearOfLife}
              weeksFromLastBday={weeksFromBirthday}
              daysIntoCurrentWeek={daysIntoCurrentWeek}
            />
          ))}
          <WeekDialog
            detail={detail}
            lifeYear={selected?.lifeYear ?? null}
            weekIndex={selected?.weekIndex ?? null}
            onClose={() => setSelected(null)}
          />
        </div>
      </WeekNotesContext.Provider>
    </WeekInspectContext.Provider>
  );
};
