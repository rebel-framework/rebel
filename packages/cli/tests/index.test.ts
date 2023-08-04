import { exec } from 'child_process';

describe('Check console.log output', () => {
  test('outputs the correct value', (done) => {
    exec('node ../dist/cli.js', (error, stdout) => {
      expect(stdout).toBe('Hello, World!\n');
      done();
    });
  });
});
