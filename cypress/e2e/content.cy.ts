describe("MDX content pages", () => {
  it("renders the about page from markdown", () => {
    cy.visit("/about");
    cy.contains("h1", "About the Life Calendar");
    cy.contains("What you are looking at");
    cy.get('script[type="application/ld+json"]').should("exist");
  });

  it("lists journal notes and opens a stoic post", () => {
    cy.visit("/blog");
    cy.contains("h1", "Notes on a finite life");
    cy.contains("Steve Jobs and the Morning Question").click();
    cy.location("pathname").should("eq", "/blog/steve-jobs-memento-mori");
    cy.contains("h1", "Steve Jobs and the Morning Question");
    cy.contains("Stanford");
  });

  it("exposes an RSS feed", () => {
    cy.request("/feed.xml").its("status").should("eq", 200);
    cy.request("/feed.xml")
      .its("body")
      .should("include", "steve-jobs-memento-mori");
  });
});
