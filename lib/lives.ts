import { z } from "zod";
import elonMusk from "../content/lives/elon-musk.json";
import { type DatePrecision, LEDGER_INKS, type WeekSpan } from "./week-notes";

const precision = z.enum(["day", "month", "year"]);
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const lifeSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  born: day,
  birthplace: z.string().min(1),
  source: z.string().url(),
  sourceName: z.string().min(1),
  updated: day,
  essay: z.string().regex(/^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().min(1),
  marks: z
    .array(
      z.object({
        kind: z.enum(["chapter", "event"]),
        label: z.string().min(1).max(40),
        color: z.string().min(1),
        start: day,
        end: day,
        startPrecision: precision,
        endPrecision: precision,
      })
    )
    .min(1),
});

export type PublicLife = z.infer<typeof lifeSchema>;
export type LifeMark = PublicLife["marks"][number];

const INK_IDS = new Set<string>(LEDGER_INKS.map(ink => ink.id));

function validateLife(life: PublicLife): void {
  if (!INK_IDS.has(life.marks[0]?.color ?? "")) {
    throw new Error(`${life.slug} uses an unknown ink`);
  }
  const chapters = life.marks.filter(mark => mark.kind === "chapter");
  if (chapters.length === 0) {
    throw new Error(`${life.slug} has no chapters`);
  }
  if (chapters[0]?.start !== life.born) {
    throw new Error(`${life.slug} does not start on the birthday`);
  }
  const colors = new Set<string>();
  let previousEnd = "";
  for (const mark of life.marks) {
    if (!INK_IDS.has(mark.color)) {
      throw new Error(`${life.slug} mark “${mark.label}” uses an unknown ink`);
    }
    if (mark.start > mark.end) {
      throw new Error(
        `${life.slug} mark “${mark.label}” ends before it starts`
      );
    }
    if (mark.start < life.born) {
      throw new Error(
        `${life.slug} mark “${mark.label}” is before the birthday`
      );
    }
  }
  for (const chapter of chapters) {
    if (colors.has(chapter.color)) {
      throw new Error(
        `${life.slug} reuses ${chapter.color} on another chapter`
      );
    }
    colors.add(chapter.color);
    if (previousEnd && chapter.start <= previousEnd) {
      throw new Error(
        `${life.slug} chapter “${chapter.label}” overlaps the one before it`
      );
    }
    previousEnd = chapter.end;
  }
}

function loadLife(value: unknown): PublicLife {
  const life = lifeSchema.parse(value);
  validateLife(life);
  return life;
}

const LIVES = [loadLife(elonMusk)];

export function listLives(): PublicLife[] {
  return LIVES;
}

export function getLife(slug: string): PublicLife | null {
  return LIVES.find(life => life.slug === slug) ?? null;
}

/** Chapters paint the square. Events share a week and show in the dialog. */
export function lifeSpans(life: PublicLife): WeekSpan[] {
  return life.marks.map((mark, index) => ({
    id: `${life.slug}:${index}`,
    label: mark.label,
    color: mark.color,
    start: mark.start,
    end: mark.end,
    startPrecision: mark.startPrecision as DatePrecision,
    endPrecision: mark.endPrecision as DatePrecision,
  }));
}
