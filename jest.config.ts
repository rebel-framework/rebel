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
      testMatch: ['<rootDir>/packages/stack/**/?(*.)+(spec|test).[jt]s?(x)'],
    },
    {
      displayName: 'router',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/router/**/?(*.)+(spec|test).[jt]s?(x)'],
    },
    {
      displayName: 'database',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/database/**/?(*.)+(spec|test).[jt]s?(x)'],
    },
  ],
};

export default config;
