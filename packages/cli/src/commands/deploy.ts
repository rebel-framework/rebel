import { root } from '@rebel/core';
import { spawn } from 'child_process';
import path from 'path';

export default async function deploy<Command>(args: string[]) {
  // TODO:
  // - Get current aws-cdk-lib version from package.json
  // - Use that version in command

  const cdk = 'aws-cdk@^2.89.0';
  const app = path.resolve(`${__dirname}/deploy/stack.js`);
  const output = root('.rebel/cdk');

  const child = spawn(
    'npx',
    [cdk, 'deploy', '--app', app, '--output', output],
    {
      stdio: 'inherit',
    }
  );

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`CDK deployment failed with exit code ${code}`);
    }
  });
}
