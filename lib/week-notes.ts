import { addDays, addWeeks, format } from "date-fns";
import localforage from "localforage";

/**
 * Preset inks for notes. `light` holds on the paper ledger, `dark` holds
 * on the zinc night ledger. Red is reserved for weeks already lived.
 * The later inks exist so a public life can give each chapter its own color.
 */
export const LEDGER_INKS = [
  { id: "blue", name: "Blue", light: "#1d4ed8", dark: "#60a5fa" },
  { id: "amber", name: "Amber", light: "#b45309", dark: "#fbbf24" },
  { id: "green", name: "Green", light: "#15803d", dark: "#4ade80" },
  { id: "violet", name: "Violet", light: "#6d28d9", dark: "#a78bfa" },
  { id: "teal", name: "Teal", light: "#0f766e", dark: "#2dd4bf" },
  { id: "rose", name: "Rose", light: "#9f1239", dark: "#fb7185" },
  { id: "orange", name: "Orange", light: "#c2410c", dark: "#fb923c" },
  { id: "cyan", name: "Cyan", light: "#0e7490", dark: "#22d3ee" },
  { id: "indigo", name: "Indigo", light: "#312e81", dark: "#a5b4fc" },
  { id: "fuchsia", name: "Fuchsia", light: "#86198f", dark: "#f0abfc" },
  { id: "olive", name: "Olive", light: "#3f6212", dark: "#a3e635" },
  { id: "copper", name: "Copper", light: "#9a3412", dark: "#fdba74" },
  { id: "graphite", name: "Graphite", light: "#3f3f46", dark: "#d4d4d8" },
] as const;

const HEX_TO_INK: Record<string, string> = {
  "#1d4ed8": "blue",
  "#b45309": "amber",
  "#15803d": "green",
  "#6d28d9": "violet",
  "#0f766e": "teal",
  "#9f1239": "rose",
};

export const WEEK_NOTES_STORAGE_KEY = "weekNotes";
/** How many notes may cover a single week. */
export const WEEK_NOTE_LIMIT = 8;
/** How many named ranges the ledger keeps. */
const WEEK_SPAN_LIMIT = 64;
const WEEK_NOTE_LENGTH = 40;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const LEGACY_KEY = /^(\d{4}-\d{2}-\d{2}):(\d+):(\d+)$/;

export type DatePrecision = "day" | "month" | "year";

export type WeekSpan = {
  id: string;
  label: string;
  color: string;
  /** Inclusive first day, yyyy-mm-dd. */
  start: string;
  /** Inclusive last day, yyyy-mm-dd. */
  end: string;
  /** How to speak a bound when the source did not give a day. */
  startPrecision?: DatePrecision;
  endPrecision?: DatePrecision;
};

export const EMPTY_WEEK_SPANS: WeekSpan[] = [];

/** Paint for a square or swatch. Follows the screen’s light or dark scheme. */
export function inkPaint(id: string): string {
  const ink = LEDGER_INKS.find(item => item.id === id);
  if (!ink) return "transparent";
  return `light-dark(${ink.light}, ${ink.dark})`;
}

export function usedInkIds(spans: WeekSpan[]): Set<string> {
  const used = new Set<string>();
  for (const span of spans) {
    const id = resolveInkId(span.color);
    if (id) used.add(id);
  }
  return used;
}

/** A free preset, chosen at random. Null when every preset is taken. */
export function pickInk(
  used: ReadonlySet<string>,
  random: () => number = Math.random
): string | null {
  const free = LEDGER_INKS.filter(ink => !used.has(ink.id));
  if (free.length === 0) return null;
  const index = Math.floor(random() * free.length);
  return free[index]?.id ?? null;
}

function resolveInkId(raw: string): string | null {
  const text = raw.trim().toLowerCase();
  if (LEDGER_INKS.some(ink => ink.id === text)) return text;
  return HEX_TO_INK[text] ?? null;
}

/** One preset per name. A stored hex or a clash takes the next free ink. */
function assignColors(spans: WeekSpan[]): WeekSpan[] {
  const used = new Set<string>();
  const byLabel = new Map<string, string>();
  const next: WeekSpan[] = [];
  for (const span of spans) {
    const key = span.label.toLowerCase();
    const shared = byLabel.get(key);
    if (shared) {
      next.push({ ...span, color: shared });
      continue;
    }
    const preferred = resolveInkId(span.color);
    const color =
      preferred && !used.has(preferred) ? preferred : pickInk(used, () => 0);
    if (!color) continue;
    used.add(color);
    byLabel.set(key, color);
    next.push({ ...span, color });
  }
  return next;
}

export function normalizeNoteLabel(raw: string): string | null {
  const label = raw.trim().replace(/\s+/g, " ");
  if (!label) return null;
  return label.slice(0, WEEK_NOTE_LENGTH);
}

/** Split a typed draft on commas. The last piece stays in the field. */
export function splitNoteDraft(raw: string): {
  labels: string[];
  rest: string;
} {
  const parts = raw.split(",");
  const rest = parts.pop() ?? "";
  return {
    labels: parts.map(part => part.trim()).filter(Boolean),
    rest,
  };
}

export function isDay(value: string): boolean {
  if (!DAY.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function formatSpanDay(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return format(new Date(year ?? 0, (month ?? 1) - 1, day ?? 1), "d MMM yyyy");
}

/** A bound spoken at the precision the source actually gave. */
export function formatSpanBound(
  iso: string,
  precision: DatePrecision = "day"
): string {
  if (precision === "year") return iso.slice(0, 4);
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month) return iso;
  if (precision === "month") {
    return format(new Date(year, month - 1, 1), "MMM yyyy");
  }
  return format(new Date(year, month - 1, day ?? 1), "d MMM yyyy");
}

/** "28 Jun 1971 – 1988", or one bound when both ends say the same thing. */
export function formatSpanRange(span: {
  start: string;
  end: string;
  startPrecision?: DatePrecision;
  endPrecision?: DatePrecision;
}): string {
  const start = formatSpanBound(span.start, span.startPrecision);
  const end = formatSpanBound(span.end, span.endPrecision);
  return start === end ? start : `${start} – ${end}`;
}

/** Notes whose dates overlap this week, earliest first. */
export function spansCovering(
  spans: WeekSpan[],
  start: string,
  end: string
): WeekSpan[] {
  if (spans.length === 0) return EMPTY_WEEK_SPANS;
  const hits = spans.filter(span => span.start <= end && span.end >= start);
  if (hits.length === 0) return EMPTY_WEEK_SPANS;
  return hits.toSorted(
    (a, b) => a.start.localeCompare(b.start) || a.label.localeCompare(b.label)
  );
}

/** One entry per name, earliest range first, in name order. */
export function knownSpans(spans: WeekSpan[]): WeekSpan[] {
  const sorted = spans.toSorted(
    (a, b) => a.label.localeCompare(b.label) || a.start.localeCompare(b.start)
  );
  const seen = new Set<string>();
  const notes: WeekSpan[] = [];
  for (const span of sorted) {
    const key = span.label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    notes.push(span);
  }
  return notes;
}

/** Saved names still available for this week, narrowed by what is typed. */
export function matchSpans(
  known: WeekSpan[],
  draft: string,
  already: WeekSpan[]
): WeekSpan[] {
  const taken = new Set(already.map(span => span.label.toLowerCase()));
  const query = draft.trim().toLowerCase();
  return known
    .filter(span => {
      if (taken.has(span.label.toLowerCase())) return false;
      if (!query) return true;
      return span.label.toLowerCase().includes(query);
    })
    .slice(0, 6);
}

export function addSpan(
  spans: WeekSpan[],
  raw: string,
  start: string,
  end: string
): WeekSpan[] {
  const label = normalizeNoteLabel(raw);
  if (!label || !isDay(start) || !isDay(end)) return spans;
  const from = start <= end ? start : end;
  const to = start <= end ? end : start;
  const covering = spansCovering(spans, from, to);
  if (covering.some(span => span.label.toLowerCase() === label.toLowerCase())) {
    return spans;
  }
  if (covering.length >= WEEK_NOTE_LIMIT || spans.length >= WEEK_SPAN_LIMIT) {
    return spans;
  }
  const shared = spans.find(
    span => span.label.toLowerCase() === label.toLowerCase()
  )?.color;
  const color = shared ?? pickInk(usedInkIds(spans));
  if (!color) return spans;
  return coalesceSpans([
    ...spans,
    {
      id: createSpanId(),
      label,
      color,
      start: from,
      end: to,
    },
  ]);
}

export function setSpanColor(
  spans: WeekSpan[],
  id: string,
  color: string
): WeekSpan[] {
  const ink = resolveInkId(color);
  const current = spans.find(span => span.id === id);
  if (!ink || !current) return spans;
  const key = current.label.toLowerCase();
  const taken = spans.some(
    span => span.label.toLowerCase() !== key && span.color === ink
  );
  if (taken) return spans;
  if (
    spans.every(span => span.label.toLowerCase() !== key || span.color === ink)
  ) {
    return spans;
  }
  return spans.map(span =>
    span.label.toLowerCase() === key ? { ...span, color: ink } : span
  );
}

export function setSpanRange(
  spans: WeekSpan[],
  id: string,
  start: string,
  end: string,
  bounds?: { min: string; max: string }
): WeekSpan[] {
  if (!isDay(start) || !isDay(end)) return spans;
  if (!spans.some(span => span.id === id)) return spans;
  let from = bounds ? clampDay(start, bounds.min, bounds.max) : start;
  let to = bounds ? clampDay(end, bounds.min, bounds.max) : end;
  if (from > to) {
    const swap = from;
    from = to;
    to = swap;
  }
  return coalesceSpans(
    spans.map(span =>
      span.id === id ? { ...span, start: from, end: to } : span
    ),
    id
  );
}

export function removeSpan(spans: WeekSpan[], id: string): WeekSpan[] {
  if (!spans.some(span => span.id === id)) return spans;
  return spans.filter(span => span.id !== id);
}

/** Join ranges of the same name that touch or overlap. The edited id is kept. */
export function coalesceSpans(
  spans: WeekSpan[],
  preferId?: string
): WeekSpan[] {
  const byLabel = new Map<string, WeekSpan[]>();
  for (const span of spans) {
    const key = span.label.toLowerCase();
    const list = byLabel.get(key);
    if (list) list.push(span);
    else byLabel.set(key, [span]);
  }
  const merged: WeekSpan[] = [];
  for (const list of byLabel.values()) {
    merged.push(...coalesceLabel(list, preferId));
  }
  return merged
    .toSorted(
      (a, b) => a.start.localeCompare(b.start) || a.label.localeCompare(b.label)
    )
    .slice(0, WEEK_SPAN_LIMIT);
}

/** "Primary school week 23 1993" */
export function formatNoteHover(labels: string[], weekLabel: string): string {
  const week = weekLabel.replace(/^Week/, "week");
  return `${labels.join(", ")} ${week}`;
}

export function readWeekNotesSync(): WeekSpan[] {
  if (typeof window === "undefined") return EMPTY_WEEK_SPANS;
  try {
    const raw = localStorage.getItem(WEEK_NOTES_STORAGE_KEY);
    if (!raw) return EMPTY_WEEK_SPANS;
    return parseWeekSpans(JSON.parse(raw));
  } catch {
    return EMPTY_WEEK_SPANS;
  }
}

export function writeWeekNotesSync(spans: WeekSpan[] | null) {
  if (typeof window === "undefined") return;
  try {
    if (!spans || spans.length === 0) {
      localStorage.removeItem(WEEK_NOTES_STORAGE_KEY);
    } else {
      localStorage.setItem(WEEK_NOTES_STORAGE_KEY, JSON.stringify(spans));
    }
  } catch {
    // Private mode or a full quota. The IndexedDB copy still stands.
  }
}

export async function loadWeekNotes(): Promise<WeekSpan[]> {
  try {
    const value = await localforage.getItem<unknown>(WEEK_NOTES_STORAGE_KEY);
    return parseWeekSpans(value);
  } catch {
    return readWeekNotesSync();
  }
}

export async function saveWeekNotes(spans: WeekSpan[]): Promise<void> {
  writeWeekNotesSync(spans);
  try {
    if (spans.length === 0) {
      await localforage.removeItem(WEEK_NOTES_STORAGE_KEY);
    } else {
      await localforage.setItem(WEEK_NOTES_STORAGE_KEY, spans);
    }
  } catch (error) {
    console.warn("week notes stayed in localStorage:", error);
  }
}

export async function clearWeekNotes(): Promise<void> {
  writeWeekNotesSync(null);
  try {
    await localforage.removeItem(WEEK_NOTES_STORAGE_KEY);
  } catch (error) {
    console.warn("week notes cleared from localStorage only:", error);
  }
}

export function parseWeekSpans(value: unknown): WeekSpan[] {
  if (Array.isArray(value)) {
    return assignColors(
      coalesceSpans(
        value.flatMap(item => {
          const span = parseSpan(item);
          return span ? [span] : [];
        })
      )
    );
  }
  if (!value || typeof value !== "object") return EMPTY_WEEK_SPANS;
  const record = value as Record<string, unknown>;
  if (Array.isArray(record.spans)) return parseWeekSpans(record.spans);
  return assignColors(migrateLegacyBook(record));
}

function parseSpan(value: unknown): WeekSpan | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const label = normalizeNoteLabel(
    typeof record.label === "string" ? record.label : ""
  );
  const start = typeof record.start === "string" ? record.start : "";
  const end = typeof record.end === "string" ? record.end : "";
  const id = typeof record.id === "string" ? record.id : "";
  if (!label || !id || !isDay(start) || !isDay(end)) return null;
  const color = typeof record.color === "string" ? record.color : "";
  const [from, to] = start <= end ? [start, end] : [end, start];
  return {
    id,
    label,
    color,
    start: from,
    end: to,
  };
}

/** Older saves stored a note on each week key. Each becomes a one-week range. */
function migrateLegacyBook(record: Record<string, unknown>): WeekSpan[] {
  const spans: WeekSpan[] = [];
  for (const [key, notes] of Object.entries(record)) {
    const match = LEGACY_KEY.exec(key);
    if (!match || !Array.isArray(notes)) continue;
    const dobDay = match[1] ?? "";
    const lifeYear = Number(match[2]);
    const weekIndex = Number(match[3]);
    if (
      !isDay(dobDay) ||
      !Number.isInteger(lifeYear) ||
      lifeYear < 1 ||
      lifeYear > 80 ||
      !Number.isInteger(weekIndex) ||
      weekIndex < 1 ||
      weekIndex > 52
    ) {
      continue;
    }
    const [year, month, day] = dobDay.split("-").map(Number);
    const dob = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
    const weekStart = addWeeks(dob, (lifeYear - 1) * 52 + (weekIndex - 1));
    const start = format(weekStart, "yyyy-MM-dd");
    const end = format(addDays(weekStart, 6), "yyyy-MM-dd");
    for (const note of notes) {
      if (!note || typeof note !== "object") continue;
      const label = normalizeNoteLabel(
        "label" in note && typeof note.label === "string" ? note.label : ""
      );
      if (!label) continue;
      const color =
        "color" in note && typeof note.color === "string" ? note.color : "";
      spans.push({
        id: `legacy:${key}:${label.toLowerCase()}`,
        label,
        color,
        start,
        end,
      });
    }
  }
  return coalesceSpans(spans);
}

function coalesceLabel(list: WeekSpan[], preferId?: string): WeekSpan[] {
  const sorted = list.toSorted(
    (a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end)
  );
  const groups: WeekSpan[][] = [];
  for (const span of sorted) {
    const last = groups[groups.length - 1];
    const tail = last?.[last.length - 1];
    if (last && tail && span.start <= nextDay(tail.end)) last.push(span);
    else groups.push([span]);
  }
  return groups.flatMap(group => {
    const first = group[0];
    if (!first) return [];
    let start = first.start;
    let end = first.end;
    for (const span of group) {
      if (span.start < start) start = span.start;
      if (span.end > end) end = span.end;
    }
    const preferred = group.find(span => span.id === preferId) ?? first;
    return [{ ...preferred, start, end }];
  });
}

function nextDay(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return format(
    addDays(new Date(year ?? 0, (month ?? 1) - 1, day ?? 1), 1),
    "yyyy-MM-dd"
  );
}

function clampDay(value: string, min: string, max: string): string {
  if (isDay(min) && value < min) return min;
  if (isDay(max) && value > max) return max;
  return value;
}

function createSpanId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `span-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
