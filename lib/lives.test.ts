import { getLife, lifeSpans } from "./lives";
import { spansCovering } from "./week-notes";

describe("elon musk", () => {
  const life = getLife("elon-musk");

  it("loads the public record", () => {
    expect(life?.name).toBe("Elon Musk");
    expect(life?.born).toBe("1971-06-28");
    expect(life?.marks.filter(mark => mark.kind === "chapter")).toHaveLength(
      12
    );
  });

  it("keeps the chapter paint when an event falls in the same week", () => {
    if (!life) throw new Error("missing life");
    const spans = lifeSpans(life);
    const teslaWeek = spansCovering(spans, "2008-09-28", "2008-09-28");
    expect(teslaWeek.map(span => span.label)).toEqual([
      "Tesla",
      "Falcon 1 orbit",
    ]);
    expect(teslaWeek[0]?.color).toBe("green");

    const founding = spansCovering(spans, "2002-05-06", "2002-05-12");
    expect(founding.map(span => span.label)).toEqual(["SpaceX"]);
    expect(founding[0]?.color).toBe("orange");
  });
});
