import { getLife } from "./lives";
import { buildLlmsFullTxt, buildLlmsTxt } from "./llms";
import { SITE_URL } from "./site";

describe("llms.txt", () => {
  const life = getLife("elon-musk");
  const posts = [
    {
      title: "What Is Memento Mori?",
      description: "Memento mori is Latin for remember that you will die.",
      slug: "what-is-memento-mori",
    },
  ];

  it("tells an agent how to fetch a birthdate picture", () => {
    if (!life) throw new Error("missing life");
    const text = buildLlmsTxt(posts, [life]);

    expect(text).toContain(`${SITE_URL}/life/1971/6/28/life-in-weeks.jpg`);
    expect(text).toContain(`${SITE_URL}/lives/elon-musk/life-in-weeks.jpg`);
    expect(text).toContain(`${SITE_URL}/blog/what-is-memento-mori`);
    expect(text).toContain(`${SITE_URL}/about#pictures`);
    expect(text).toContain("Do not draw your own grid");
  });

  it("keeps the citation limits in the long file", () => {
    if (!life) throw new Error("missing life");
    const text = buildLlmsFullTxt(posts, [life]);

    expect(text).toContain("Do not describe Steve Jobs as a Stoic philosopher");
    expect(text).toContain("personal life expectancy");
    expect(text).toContain(posts[0]?.description);
  });
});
