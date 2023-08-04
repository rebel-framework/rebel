import { root } from '@rebel/core';
import { spawn } from 'child_process';
import path from 'path';

export default async <Command>(args: string[]) => {
  const app = path.resolve(`${__dirname}/deploy/stack.js`);

  const child = spawn(
    'npx',
    ['aws-cdk', 'deploy', '--app', app, '--output', root('.rebel/cdk')],
    {
      stdio: 'inherit',
    }
  );

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`CDK deployment failed with exit code ${code}`);
    }
  });
};
