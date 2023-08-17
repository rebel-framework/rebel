import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  projects: [
    {
      displayName: 'cli',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/cli/**/?(*.)+(spec|test).[jt]s?(x)'],
    },
    {
      displayName: 'core',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/core/**/?(*.)+(spec|test).[jt]s?(x)'],
    },
    {
      displayName: 'stack',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/cli/**/?(*.)+(spec|test).[jt]s?(x)'],
    },
  ],
};

export default config;
