import React from "react";
import LabeledInput from "../../components/LabeledInput";

describe("LabeledInput Component", () => {
  const labelString = "Test Label";
  const inputId = "test-input";
  const inputType = "text";

  it("renders correctly", () => {
    cy.mount(
      <LabeledInput
        labelString={labelString}
        inputId={inputId}
        inputType={inputType}
      />
    );

    // Check if the label is rendered correctly
    cy.get(`[data-cy=${inputId}-label]`).should("contain.text", labelString);

    // Check if the input is rendered correctly
    cy.get(`[data-cy=${inputId}-input]`).should("have.attr", "type", inputType);
  });
});
