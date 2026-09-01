import { describe, expect, it } from "@jest/globals";
import { buildRssFeed, escapeXml } from "./rss";
import { SITE_URL } from "./site";

describe("rss", () => {
  it("escapes XML entities", () => {
    expect(escapeXml(`A & B <C> "d"`)).toBe(
      "A &amp; B &lt;C&gt; &quot;d&quot;",
    );
  });

  it("emits a channel with post items", () => {
    const xml = buildRssFeed([
      {
        title: "Steve Jobs & mortality",
        description: "The morning question.",
        slug: "steve-jobs-memento-mori",
        datePublished: "2026-08-31",
      },
    ]);

    expect(xml).toContain("<rss version=\"2.0\"");
    expect(xml).toContain(`${SITE_URL}/blog/steve-jobs-memento-mori`);
    expect(xml).toContain("Steve Jobs &amp; mortality");
    expect(xml).toContain("<atom:link");
  });
});
