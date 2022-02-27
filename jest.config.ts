import type { Config } from '@jest/types';

export default {
  testMatch: ['**/packages/*/src/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'esbuild-jest',
  },
  testTimeout: 30000,
  modulePathIgnorePatterns: [
    '<rootDir>/packages/.+/compiled',
    '<rootDir>/packages/.+/fixtures',
  ],
} as Config.InitialOptions;
