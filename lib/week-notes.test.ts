import {
  addSpan,
  formatNoteHover,
  formatSpanDay,
  formatSpanRange,
  inkPaint,
  knownSpans,
  LEDGER_INKS,
  matchSpans,
  parseWeekSpans,
  pickInk,
  removeSpan,
  setSpanColor,
  setSpanRange,
  spansCovering,
  splitNoteDraft,
  type WeekSpan,
} from "./week-notes";

const school = (id: string, start: string, end: string): WeekSpan => ({
  id,
  label: "Primary school",
  color: "#0f766e",
  start,
  end,
});

describe("week notes", () => {
  it("gives each name its own ink and reuses it for that name", () => {
    const school = addSpan([], "Primary school", "1991-05-16", "1991-05-22");
    const again = addSpan(school, "Primary school", "1994-09-01", "1994-09-07");
    expect(again[0]?.color).toBe(again[1]?.color);
    const both = addSpan(again, "Piano", "1991-05-16", "1991-05-22");
    const piano = both.find(span => span.label === "Piano");
    expect(piano?.color).not.toBe(school[0]?.color);
    expect(inkPaint(school[0]?.color ?? "")).toBe(
      `light-dark(${LEDGER_INKS.find(ink => ink.id === school[0]?.color)?.light}, ${LEDGER_INKS.find(ink => ink.id === school[0]?.color)?.dark})`
    );
  });

  it("refuses a color another note already holds", () => {
    const used = new Set(LEDGER_INKS.map(ink => ink.id));
    expect(pickInk(used, () => 0)).toBeNull();
    const school = addSpan([], "Primary school", "1991-05-16", "1991-05-22");
    const both = addSpan(school, "Piano", "1992-01-01", "1992-01-07");
    const schoolSpan = both.find(span => span.label === "Primary school");
    const piano = both.find(span => span.label === "Piano");
    expect(setSpanColor(both, schoolSpan?.id ?? "", piano?.color ?? "")).toBe(
      both
    );
    const free = LEDGER_INKS.find(
      ink => ink.id !== schoolSpan?.color && ink.id !== piano?.color
    );
    const next = setSpanColor(both, schoolSpan?.id ?? "", free?.id ?? "");
    expect(next.find(span => span.label === "Primary school")?.color).toBe(
      free?.id
    );
  });

  it("turns a comma into a finished note and leaves the rest", () => {
    expect(splitNoteDraft("Primary school,")).toEqual({
      labels: ["Primary school"],
      rest: "",
    });
    expect(splitNoteDraft("Primary school, Pia")).toEqual({
      labels: ["Primary school"],
      rest: " Pia",
    });
  });

  it("speaks a stored day the way the dialog does", () => {
    expect(formatSpanDay("1994-09-01")).toBe("1 Sep 1994");
  });

  it("paints every week the range touches, and no week outside it", () => {
    const span = school("school", "1994-09-01", "1999-09-01");
    expect(spansCovering([span], "1996-03-01", "1996-03-07")).toHaveLength(1);
    expect(spansCovering([span], "1994-08-26", "1994-09-01")).toHaveLength(1);
    expect(spansCovering([span], "1999-09-01", "1999-09-07")).toHaveLength(1);
    expect(spansCovering([span], "1994-08-25", "1994-08-31")).toHaveLength(0);
    expect(spansCovering([span], "1999-09-02", "1999-09-08")).toHaveLength(0);
  });

  it("starts a note on one week and drops it when removed", () => {
    const added = addSpan([], "Primary school", "1991-05-16", "1991-05-22");
    expect(added).toHaveLength(1);
    expect(added[0]?.label).toBe("Primary school");
    expect(added[0]?.start).toBe("1991-05-16");
    expect(added[0]?.end).toBe("1991-05-22");
    expect(removeSpan(added, added[0]?.id ?? "")).toEqual([]);
  });

  it("keeps a gap between two periods of the same name", () => {
    const first = addSpan([], "Piano", "1991-05-16", "1991-05-22");
    const both = addSpan(first, "Piano", "1994-09-01", "1994-09-07");
    expect(both).toHaveLength(2);
  });

  it("joins two periods of the same name when their dates meet", () => {
    const early = school("early", "1991-05-16", "1991-05-22");
    const later = school("later", "1991-06-01", "1991-06-07");
    const joined = setSpanRange(
      [early, later],
      "later",
      "1991-05-23",
      "1991-06-07"
    );
    expect(joined).toHaveLength(1);
    expect(joined[0]?.id).toBe("later");
    expect(joined[0]?.start).toBe("1991-05-16");
    expect(joined[0]?.end).toBe("1991-06-07");
  });

  it("offers a saved note again, and hides it once this week has it", () => {
    const spans = [
      school("school", "1994-09-01", "1999-09-01"),
      {
        id: "piano",
        label: "Piano",
        color: "#b45309",
        start: "1991-05-16",
        end: "1991-05-22",
      },
    ];
    expect(knownSpans(spans).map(span => span.label)).toEqual([
      "Piano",
      "Primary school",
    ]);
    expect(
      matchSpans(knownSpans(spans), "pri", []).map(span => span.label)
    ).toEqual(["Primary school"]);
    expect(
      matchSpans(knownSpans(spans), "", [spans[0] as WeekSpan]).map(
        span => span.label
      )
    ).toEqual(["Piano"]);
  });

  it("turns an older per-week save into a one-week range", () => {
    const spans = parseWeekSpans({
      "1991-05-16:1:1": [{ label: "Primary school", color: "#0f766e" }],
    });
    expect(spans).toHaveLength(1);
    expect(spans[0]?.start).toBe("1991-05-16");
    expect(spans[0]?.end).toBe("1991-05-22");
    expect(spans[0]?.color).toBe("teal");
  });

  it("gives a second note a different ink when an old save reused a hex", () => {
    const spans = parseWeekSpans({
      "1991-05-16:1:1": [
        { label: "Primary school", color: "#0f766e" },
        { label: "Piano", color: "#0f766e" },
      ],
    });
    expect(spans.map(span => span.color)).toEqual(["teal", "blue"]);
  });

  it("names the hover the way the week is spoken", () => {
    expect(formatNoteHover(["Primary school"], "Week 23 1993")).toBe(
      "Primary school week 23 1993"
    );
  });

  it("speaks a range at the precision the source gave", () => {
    expect(formatSpanDay("1994-09-01")).toBe("1 Sep 1994");
    expect(
      formatSpanRange({
        start: "1971-06-28",
        end: "1988-12-31",
        startPrecision: "day",
        endPrecision: "year",
      })
    ).toBe("28 Jun 1971 – 1988");
    expect(
      formatSpanRange({
        start: "2008-09-28",
        end: "2008-09-28",
        startPrecision: "day",
        endPrecision: "day",
      })
    ).toBe("28 Sep 2008");
  });
});
