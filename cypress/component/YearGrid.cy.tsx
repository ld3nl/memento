import React from "react";
import YearGrid from "../../components/YearGrid";

describe("YearGrid Component", () => {
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);
  const yeasAlive = 30;
  const currentDecadeYear = 31;
  const weeksFromLastBday = 10;

  it("renders correctly", () => {
    cy.mount(
      <YearGrid
        weeks={weeks}
        yeasAlive={yeasAlive}
        currentDecadeYear={currentDecadeYear}
        weeksFromLastBday={weeksFromLastBday}
      />
    );

    // Check if the grid has 52 weeks
    cy.get(".grid-cols-52").children().should("have.length", 52);
  });

  it("fills the correct weeks", () => {
    cy.mount(
      <YearGrid
        weeks={weeks}
        yeasAlive={yeasAlive}
        currentDecadeYear={currentDecadeYear}
        weeksFromLastBday={weeksFromLastBday}
      />
    );

    // Check if the correct weeks are filled
    cy.get(".bg-black").should("have.length", weeksFromLastBday);
  });
});
