import { root } from '@rebel-framework/core';
import { spawn } from 'child_process';
import path from 'path';
import destroy from './destroy';

jest.mock('@rebel-framework/core');
jest.mock('child_process');

describe('destroy', () => {
  let mockSpawn;
  let mockOn;

  beforeEach(() => {
    mockOn = jest.fn();
    mockSpawn = (spawn as jest.Mock).mockReturnValue({
      on: mockOn,
    });
    (root as jest.Mock).mockReturnValue('mockedRoot');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should spawn a child process with correct arguments', async () => {
    await destroy([]);

    const cdk = 'aws-cdk@^2.90.0';
    const app = path.resolve(`${__dirname}/deploy/stack.js`);
    const output = 'mockedRoot';

    expect(mockSpawn).toHaveBeenCalledWith(
      'npx',
      [cdk, 'destroy', '--app', app, '--output', output],
      {
        stdio: 'inherit',
      }
    );
  });

  it('should log an error when child process exits with a non-zero code', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await destroy([]);

    const exitCode = 1;
    mockOn.mock.calls[0][1](exitCode); // Simulate 'exit' event

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `CDK destruction failed with exit code ${exitCode}`
    );
  });
});
