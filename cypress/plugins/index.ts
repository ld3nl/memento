import { configureVisualRegression } from "cypress-visual-regression/dist/plugin";

export default (on, config) => {
  configureVisualRegression(on);
  // Any other plugin configuration
  return config;
};
