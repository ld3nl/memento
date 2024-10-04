import React from "react";
import LabeledInput from "../../components/LabeledInput";

describe("<LabeledInput />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <LabeledInput labelString="Email" inputId="email" inputType="email" />
    );
  });
});
