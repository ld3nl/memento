import { describe, expect, it } from "@jest/globals";
import {
  absoluteUrl,
  articleJsonLd,
  graphJsonLd,
  serializeJsonLd,
} from "./json-ld";
import { SITE_URL } from "./site";

describe("json-ld", () => {
  it("escapes angle brackets so JSON-LD cannot break out of a script tag", () => {
    const html = serializeJsonLd({ name: "</script><p>x</p>" });
    expect(html).toContain("\\u003c/script>");
    expect(html).not.toContain("</script>");
  });

  it("turns internal paths into absolute URLs", () => {
    expect(absoluteUrl("/blog")).toBe(`${SITE_URL}/blog`);
    expect(absoluteUrl(`${SITE_URL}/about`)).toBe(`${SITE_URL}/about`);
  });

  it("builds an article node with dates and a publisher", () => {
    const article = articleJsonLd({
      headline: "What Memento Mori Means",
      description: "A definition.",
      path: "/blog/what-is-memento-mori",
      datePublished: "2026-08-31",
      keywords: ["memento mori"],
      wordCount: 1200,
    });

    expect(article["@type"]).toBe("BlogPosting");
    expect(article.datePublished).toBe("2026-08-31T00:00:00.000Z");
    expect(article.url).toBe(`${SITE_URL}/blog/what-is-memento-mori`);
    expect(graphJsonLd([article])["@context"]).toBe("https://schema.org");
  });
});
