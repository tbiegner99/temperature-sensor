import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/*.ts'],
};
export default config;
