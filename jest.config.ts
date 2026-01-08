import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom", // Use jsdom for component testing

  // Patterns for test files
  testMatch: [
    "<rootDir>/lib/**/*.test.{js,jsx,ts,tsx}",
    "<rootDir>/lib/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/components/**/*.test.{js,jsx,ts,tsx}",
  ],

  // Use separate tsconfig for tests
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },

  // Coverage settings
  collectCoverageFrom: [
    "lib/**/*.{js,ts,jsx,tsx}",
    "components/**/*.{js,ts,jsx,tsx}",
    "!lib/**/*.d.ts",
    "!lib/index.ts", // Usually just exports
    "!lib/types.ts", // Type definitions
    "!lib/constants.ts", // Constants don't need coverage
    "!components/**/*.types.ts", // Type definitions
    "!components/**/index.ts", // Barrel files
    "!components/**/*.stories.{ts,tsx}", // Stories
  ],

  // Setup files (uncomment if you need global test setup)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
