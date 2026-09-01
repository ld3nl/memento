import { describe, expect, it } from "@jest/globals";
import {
  countMdxWords,
  estimateReadingMinutes,
  formatContentDate,
  isValidSlug,
  parseFrontmatter,
  pickRelated,
  stripMdxMeta,
  toIsoDateTime,
} from "./content-meta";

describe("content-meta", () => {
  it("accepts hyphenated slugs and rejects path tricks", () => {
    expect(isValidSlug("steve-jobs-memento-mori")).toBe(true);
    expect(isValidSlug("What-Is-Memento")).toBe(false);
    expect(isValidSlug("../about")).toBe(false);
    expect(isValidSlug("hello_world")).toBe(false);
  });

  it("parses complete frontmatter", () => {
    const parsed = parseFrontmatter({
      title: "A title",
      description: "A description",
      datePublished: "2026-08-31",
      keywords: ["memento mori"],
      tags: ["stoicism"],
    });

    expect(parsed.title).toBe("A title");
    expect(parsed.datePublished).toBe("2026-08-31");
  });

  it("strips the frontmatter export before counting words", () => {
    const source = `export const frontmatter = {
  title: "Hello",
  nested: { ok: true },
}

import Image from "next/image"

# Hello

A short [link](/blog) and some **words**.
`;

    expect(stripMdxMeta(source)).toContain("A short");
    expect(stripMdxMeta(source)).not.toContain("export const frontmatter");
    expect(countMdxWords(source)).toBeGreaterThan(3);
  });

  it("estimates reading time from word counts", () => {
    expect(estimateReadingMinutes(0)).toBe(1);
    expect(estimateReadingMinutes(220)).toBe(1);
    expect(estimateReadingMinutes(440)).toBe(2);
  });

  it("formats dates for people and machines", () => {
    expect(formatContentDate("2026-08-31")).toBe("31 August 2026");
    expect(toIsoDateTime("2026-08-31")).toBe("2026-08-31T00:00:00.000Z");
  });

  it("ranks related notes by overlapping tags", () => {
    const related = pickRelated(
      [
        { slug: "a", tags: ["memento mori", "stoicism"] },
        { slug: "b", tags: ["stoicism"] },
        { slug: "c", tags: ["life calendar"] },
        { slug: "d", tags: ["memento mori", "practice"] },
      ],
      "a",
      2,
    );

    expect(related.map((item) => item.slug)).toEqual(["b", "d"]);
  });
});
