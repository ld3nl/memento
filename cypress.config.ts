import path from "node:path";
import { defineConfig } from "cypress";
import { configureVisualRegression } from "cypress-visual-regression";

export default defineConfig({
  // Shared visual regression config
  env: {
    visualRegressionType: "regression",
    visualRegressionBaseDirectory: "cypress/snapshots/base",
    visualRegressionDiffDirectory: "cypress/snapshots/diff",
    visualRegressionGenerateDiff: "always",
  },
  screenshotsFolder: "./cypress/snapshots/actual",

  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, _config) {
      configureVisualRegression(on);
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
      webpackConfig: {
        resolve: {
          alias: {
            "next/navigation": path.resolve(
              __dirname,
              "cypress/support/nextNavigationMock.ts",
            ),
          },
        },
      },
    },
    // Cypress 14+ compiles specs just-in-time for better performance
    justInTimeCompile: true,
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, _config) {
      configureVisualRegression(on);
    },
  },
});
