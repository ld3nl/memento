import { format } from "date-fns";
import { ImageResponse } from "next/og";
import { DECADE_LENGTH, WEEKS_PER_YEAR, YEARS_IN_LIFETIME } from "./constants";
import { lifeWeekDays } from "./life-week";
import { lifeSpans, type PublicLife } from "./lives";
import { LEDGER_INKS, spansCovering } from "./week-notes";

/** 16:9. Share crawlers fetch this PNG. */
export const LIFE_OG_SIZE = { width: 1200, height: 675 };
export const LIFE_OG_CONTENT_TYPE = "image/png";

const CELL_W = 13;
const CELL_H = 5;
const YEAR_GAP = 1;
const DECADE_GAP = 4;
const YEARS = YEARS_IN_LIFETIME * DECADE_LENGTH;
const GRID_W = WEEKS_PER_YEAR * CELL_W;
const GRID_H =
  YEARS * CELL_H +
  (YEARS - YEARS_IN_LIFETIME) * YEAR_GAP +
  (YEARS_IN_LIFETIME - 1) * DECADE_GAP;
const EMPTY_WEEK = "#3f3f46";

const INK_DARK = new Map<string, string>(
  LEDGER_INKS.map(ink => [ink.id, ink.dark])
);

function bornDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

function speakBorn(iso: string): string {
  return format(bornDate(iso), "d MMMM yyyy");
}

/** One hex per square. The earliest mark paints the week, as on the page. */
export function paintLifeGrid(life: PublicLife): string[][] {
  const dob = bornDate(life.born);
  const spans = lifeSpans(life);
  const rows: string[][] = [];

  for (let year = 1; year <= YEARS; year++) {
    const row: string[] = [];
    for (let week = 1; week <= WEEKS_PER_YEAR; week++) {
      const days = lifeWeekDays(dob, year, week);
      const hit = spansCovering(spans, days.startDay, days.endDay)[0];
      row.push(hit ? (INK_DARK.get(hit.color) ?? EMPTY_WEEK) : EMPTY_WEEK);
    }
    rows.push(row);
  }

  return rows;
}

function runs(
  row: string[]
): Array<{ color: string; count: number; start: number }> {
  const painted: Array<{ color: string; count: number; start: number }> = [];
  for (const [week, color] of row.entries()) {
    const last = painted[painted.length - 1];
    if (last && last.color === color) {
      last.count += 1;
    } else {
      painted.push({ color, count: 1, start: week });
    }
  }
  return painted;
}

export function lifeOgImage(life: PublicLife) {
  const grid = paintLifeGrid(life);
  const chapters = life.marks.filter(mark => mark.kind === "chapter");
  const titleSize = life.name.length > 18 ? 52 : 68;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#09090b",
        color: "#fafafa",
      }}
    >
      <div
        style={{
          width: 18,
          height: "100%",
          backgroundColor: "#dc2626",
          display: "flex",
        }}
      />
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          padding: "0 40px",
          gap: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: GRID_W,
            height: GRID_H,
          }}
        >
          {grid.map((row, yearIndex) => {
            const year = yearIndex + 1;
            const decadeBreak = year % DECADE_LENGTH === 0 && year !== YEARS;
            return (
              <div
                key={year}
                style={{
                  display: "flex",
                  width: GRID_W,
                  height: CELL_H,
                  flexGrow: 0,
                  flexShrink: 0,
                  marginBottom: decadeBreak
                    ? DECADE_GAP
                    : year === YEARS
                      ? 0
                      : YEAR_GAP,
                }}
              >
                {runs(row).map(run => (
                  <div
                    key={`${year}-${run.start}`}
                    style={{
                      width: run.count * CELL_W,
                      height: CELL_H,
                      backgroundColor: run.color,
                      display: "flex",
                      flexGrow: 0,
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: GRID_H,
            flex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#a1a1aa",
                fontFamily: "Georgia, serif",
              }}
            >
              Lives
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 14,
                fontSize: titleSize,
                lineHeight: 1.05,
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
              }}
            >
              {life.name}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 14,
                fontSize: 22,
                color: "#a1a1aa",
                fontFamily: "Georgia, serif",
              }}
            >
              {`${speakBorn(life.born)} · ${life.birthplace}`}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 8,
                fontSize: 20,
                color: "#a1a1aa",
                fontFamily: "Georgia, serif",
              }}
            >
              Life in weeks
            </div>
          </div>
          <div style={{ display: "flex", gap: 28, marginTop: 28 }}>
            {[chapters.slice(0, 6), chapters.slice(6)].map(column => (
              <div
                key={column[0]?.label ?? "chapters"}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {column.map(chapter => (
                  <div
                    key={chapter.label}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        backgroundColor:
                          INK_DARK.get(chapter.color) ?? EMPTY_WEEK,
                        display: "flex",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        fontSize: 18,
                        color: "#e4e4e7",
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      {chapter.label}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    { ...LIFE_OG_SIZE }
  );
}
