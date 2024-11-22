import React from "react";
import DecadeGrid from "../../components/DecadeGrid";

describe("DecadeGrid Component", () => {
  const decadeLength = 10;
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);
  const yearsAlive = 10;
  const yearIndex = 1;
  const weeksFromLastBday = 10;

  it("renders correctly", () => {
    cy.mount(
      <DecadeGrid
        decadeLength={decadeLength}
        weeks={weeks}
        yearsAlive={yearsAlive}
        yearIndex={yearIndex}
        weeksFromLastBday={weeksFromLastBday}
      />
    );

    // Check if the grid has the correct number of years
    cy.get(".bg-black").should("have.length", decadeLength);

    cy.compareSnapshot("DecadeGrid", 0.2);
  });
});
