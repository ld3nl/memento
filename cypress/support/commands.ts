/// <reference types="cypress" />

import { addCompareSnapshotCommand } from "cypress-visual-regression/dist/command";

// Visual regression command - configured once here for both e2e and component tests
addCompareSnapshotCommand({
  capture: "fullPage",
  overwrite: true,
});
