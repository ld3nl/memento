import { deflateSync } from "node:zlib";
import { format } from "date-fns";
import { ImageResponse } from "next/og";
import { DECADE_LENGTH, WEEKS_PER_YEAR, YEARS_IN_LIFETIME } from "./constants";
import { lifeWeekDays } from "./life-week";
import { lifeSpans, type PublicLife } from "./lives";
import { LEDGER_INKS, spansCovering } from "./week-notes";

/** 16:9. Share crawlers fetch the JPEG the route makes from this. */
export const LIFE_OG_SIZE = { width: 1200, height: 675 };
export const LIFE_OG_CONTENT_TYPE = "image/jpeg";

/** Enough for the share card. A public life also has chapters. */
export type LifePicture = {
  name: string;
  born: string;
  birthplace?: string;
  marks?: PublicLife["marks"];
  slug?: string;
  kicker?: string;
};

/** Same rhythm as the ledger: 8px square, 8px gap, 16px between decades. */
const SCALE = 4;
const CELL = SCALE;
const YEAR_GAP = SCALE;
const DECADE_GAP = SCALE * 2;
const YEARS = YEARS_IN_LIFETIME * DECADE_LENGTH;
const GRID_W = WEEKS_PER_YEAR * (CELL + YEAR_GAP);
const GRID_H =
  YEARS * CELL +
  (YEARS - YEARS_IN_LIFETIME) * YEAR_GAP +
  (YEARS_IN_LIFETIME - 1) * DECADE_GAP;

const PAPER = "#09090b";
const LIVED = "#dc2626";
const EMPTY = "#3f3f46";

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

/** One color per week, in the same order as the page. */
export function paintLifeGrid(
  life: LifePicture,
  asOf: Date = new Date()
): string[][] {
  const dob = bornDate(life.born);
  const today = format(asOf, "yyyy-MM-dd");
  const spans =
    life.slug && life.marks && life.marks.length > 0
      ? lifeSpans(life as PublicLife)
      : [];
  const rows: string[][] = [];

  for (let year = 1; year <= YEARS; year++) {
    const row: string[] = [];
    for (let week = 1; week <= WEEKS_PER_YEAR; week++) {
      const days = lifeWeekDays(dob, year, week);
      const hit = spansCovering(spans, days.startDay, days.endDay)[0];
      if (hit) {
        row.push(INK_DARK.get(hit.color) ?? LIVED);
      } else if (days.startDay <= today) {
        row.push(LIVED);
      } else {
        row.push(EMPTY);
      }
    }
    rows.push(row);
  }

  return rows;
}

function parseHex(hex: string): [number, number, number] {
  return [
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  ];
}

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) === 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c >>> 0;
}

function crc32(data: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    c = CRC_TABLE[(c ^ (data[i] ?? 0)) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const sum = Buffer.alloc(4);
  sum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, sum]);
}

/** Opaque RGB PNG. Share apps drop the alpha PNGs next/og writes. */
function encodeRgbPng(width: number, height: number, rgb: Uint8Array): Buffer {
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const dest = y * (stride + 1);
    raw[dest] = 0;
    raw.set(rgb.subarray(y * stride, y * stride + stride), dest + 1);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(raw)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function paintSquare(
  rgb: Uint8Array,
  width: number,
  x: number,
  y: number,
  color: [number, number, number]
) {
  for (let row = 0; row < CELL; row++) {
    const start = ((y + row) * width + x) * 3;
    for (let col = 0; col < CELL; col++) {
      const pixel = start + col * 3;
      rgb[pixel] = color[0];
      rgb[pixel + 1] = color[1];
      rgb[pixel + 2] = color[2];
    }
  }
}

/**
 * The page is a 52-column grid. Each square sits in a cell twice its
 * width. Weeks 27–52 sit on the right of that cell, so the year splits
 * down the middle. Decade rows have a taller gap.
 */
export function ledgerPng(rows: string[][]): string {
  const rgb = new Uint8Array(GRID_W * GRID_H * 3);
  const paper = parseHex(PAPER);
  for (let i = 0; i < rgb.length; i += 3) {
    rgb[i] = paper[0];
    rgb[i + 1] = paper[1];
    rgb[i + 2] = paper[2];
  }

  let y = 0;
  for (const [yearIndex, row] of rows.entries()) {
    const year = yearIndex + 1;
    for (const [weekIndex, color] of row.entries()) {
      const x =
        weekIndex * (CELL + YEAR_GAP) + (weekIndex >= 26 ? YEAR_GAP : 0);
      paintSquare(rgb, GRID_W, x, y, parseHex(color));
    }
    y += CELL;
    if (year === YEARS) break;
    y += year % DECADE_LENGTH === 0 ? DECADE_GAP : YEAR_GAP;
  }

  const png = encodeRgbPng(GRID_W, GRID_H, rgb);
  return `data:image/png;base64,${png.toString("base64")}`;
}

export function lifeImageAlt(iso: string): string {
  return `Life in weeks for a person born ${speakBorn(iso)}. Each square is one week on an 80-year grid. Filled squares are weeks already lived.`;
}

export function speakBirthDate(iso: string): string {
  return speakBorn(iso);
}

/** Same card as a public life, with no chapters and no name. */
export function dateLifeImage(born: Date, asOf: Date = new Date()) {
  const month = String(born.getMonth() + 1).padStart(2, "0");
  const day = String(born.getDate()).padStart(2, "0");
  return lifeOgImage(
    {
      name: "Life in weeks",
      born: `${born.getFullYear()}-${month}-${day}`,
      kicker: "Memento mori",
    },
    asOf
  );
}

export function lifeOgImage(life: LifePicture, asOf: Date = new Date()) {
  const grid = ledgerPng(paintLifeGrid(life, asOf));
  const chapters = (life.marks ?? []).filter(mark => mark.kind === "chapter");
  const titleSize = life.name.length > 18 ? 52 : 68;
  const kicker = life.kicker ?? "Lives";
  const detail = life.birthplace
    ? `${speakBorn(life.born)} · ${life.birthplace}`
    : speakBorn(life.born);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: PAPER,
        color: "#fafafa",
      }}
    >
      <div
        style={{
          width: 18,
          height: "100%",
          backgroundColor: LIVED,
          display: "flex",
        }}
      />
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          padding: "0 36px",
          gap: 36,
        }}
      >
        <img
          src={grid}
          width={GRID_W}
          height={GRID_H}
          alt=""
          style={{ display: "flex", width: GRID_W, height: GRID_H }}
        />
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
              {kicker}
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
              {detail}
            </div>
            {life.name === "Life in weeks" ? null : (
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
            )}
          </div>
          {chapters.length === 0 ? (
            <div
              style={{
                display: "flex",
                marginTop: 28,
                maxWidth: 360,
                fontSize: 22,
                lineHeight: 1.4,
                color: "#a1a1aa",
                fontFamily: "Georgia, serif",
              }}
            >
              80 years. 4,160 weeks. Filled squares are already lived. The span
              is a scale, not a prediction.
            </div>
          ) : (
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
                          backgroundColor: INK_DARK.get(chapter.color) ?? EMPTY,
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
          )}
        </div>
      </div>
    </div>,
    { ...LIFE_OG_SIZE }
  );
}
