import { root } from '@rebel-framework/core';
import { spawn } from 'child_process';
import path from 'path';
import { exec } from 'child_process';

type Arguments = {
  [key: string]: string;
  stack: string;
};

async function compileStack(stack: string) {
  const inputFile = root(`stacks/${stack}/stack.ts`);
  const outputDir = root(`.rebel/stacks/${stack}`);
  await exec(`npx tsc ${inputFile} --outDir ${outputDir}`);
  const outputFile = root(`.rebel/stacks/${stack}/stack.js`);
  const babelConfigPath = root(`babel.config.json`);
  await exec(
    `npx babel ${inputFile} --out-file ${outputFile} --config-file ${babelConfigPath}`
  );
}

async function buildProject(stack: string) {
  await exec(`npm run build --workspace ${stack}`);
}

export default async function deploy(args: Arguments) {
  // TODO: Check if stack exists?
  const stack = args.stack;

  // Set current stack as globally available variable
  // so that we can use it from the app file included
  // by cdk (see ./deploy/stack.ts)
  process.env.REBEL_CURRENT_STACK = stack;

  // Transpiling stack file to to javascript
  await compileStack(stack);

  // Building project
  await buildProject(stack);

  // TODO: Assert compile stack file exists?
  const cdk = 'aws-cdk@latest';
  const app = path.resolve(`${__dirname}/deploy/stack.js`);
  const output = root(`.rebel/cdk/${stack}`);

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
