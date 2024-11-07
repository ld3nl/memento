import React from "react";
import Week from "../../components/Week";

describe("Week Component", () => {
  it("renders correctly when filled", () => {
    cy.mount(<Week weekIndex={1} isFilled={true} />);
    cy.get(".bg-black").should("exist");
  });

  it("renders correctly when not filled", () => {
    cy.mount(<Week weekIndex={1} isFilled={false} />);
    cy.get(".bg-black").should("not.exist");
  });
});
