// Jest setup file for global test configuration
import '@jest/globals';

// Set timezone to UTC for consistent date testing
process.env.TZ = "UTC";

// Mock console methods to reduce noise in tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// }
