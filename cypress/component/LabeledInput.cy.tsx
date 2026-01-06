import LabeledInput from "../../components/LabeledInput";

describe("LabeledInput Component", () => {
  const defaultProps = {
    labelString: "Test Label",
    inputId: "test-input",
    inputType: "text" as const,
  };

  it("renders label with correct text", () => {
    cy.mount(<LabeledInput {...defaultProps} />);

    cy.get("[data-cy=test-input-label]")
      .should("exist")
      .and("contain.text", defaultProps.labelString);
  });

  it("renders input with correct type attribute", () => {
    cy.mount(<LabeledInput {...defaultProps} />);

    cy.get("[data-cy=test-input-input]")
      .should("exist")
      .and("have.attr", "type", defaultProps.inputType);
  });

  it("associates label with input via htmlFor attribute", () => {
    cy.mount(<LabeledInput {...defaultProps} />);

    cy.get("[data-cy=test-input-label]").should(
      "have.attr",
      "for",
      defaultProps.inputId,
    );
    cy.get("[data-cy=test-input-input]").should(
      "have.attr",
      "id",
      defaultProps.inputId,
    );
  });

  it("renders date input type correctly", () => {
    cy.mount(<LabeledInput {...defaultProps} inputType="date" />);

    cy.get("[data-cy=test-input-input]").should("have.attr", "type", "date");
  });

  it("passes additional inputProps to the input element", () => {
    const onChangeSpy = cy.spy().as("onChangeSpy");

    cy.mount(
      <LabeledInput
        {...defaultProps}
        inputProps={{ onChange: onChangeSpy, placeholder: "Enter text" }}
      />,
    );

    cy.get("[data-cy=test-input-input]")
      .should("have.attr", "placeholder", "Enter text")
      .type("test value");

    cy.get("@onChangeSpy").should("have.been.called");
  });
});
