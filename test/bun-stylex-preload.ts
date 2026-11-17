/**
 * Bun's built-in test runner does not use Jest's moduleNameMapper.
 * Preload a StyleX stand-in so `bun test` can mount StyleX components.
 */
import { mock } from "bun:test";
import stylexMock from "./mocks/stylex.js";

mock.module("@stylexjs/stylex", () => stylexMock);
