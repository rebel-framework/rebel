import { root } from '@rebel-framework/core';
import { spawn } from 'child_process';
import path from 'path';

export default async function destroy(args: string[]) {
  // TODO:
  // - Get current aws-cdk-lib version from package.json
  // - Use that version in command

  const cdk = 'aws-cdk@^2.90.0';
  const app = path.resolve(`${__dirname}/deploy/stack.js`);
  const output = root('.rebel/cdk');

  const child = spawn(
    'npx',
    [cdk, 'destroy', '--app', app, '--output', output],
    {
      stdio: 'inherit',
    }
  );

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`CDK destruction failed with exit code ${code}`);
    }
  });
}
