import { defineConfig } from "cypress";
import { configureVisualRegression } from "cypress-visual-regression";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    env: {
      // visualRegressionType: "base", // Use 'base' to create source of truth
      visualRegressionType: "regression", // Use 'regression' for comparison
      visualRegressionBaseDirectory: "cypress/snapshots/base", // Path to base images
      visualRegressionDiffDirectory: "cypress/snapshots/diff", // Path to diff images
      visualRegressionGenerateDiff: "always",
    },
    screenshotsFolder: "./cypress/snapshots/actual", // Fo
    setupNodeEvents(on, config) {
      configureVisualRegression(on);
    },
  },
});
