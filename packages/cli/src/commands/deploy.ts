import { spawn } from 'child_process';
import path from 'path';

const deploy = (name: string) => {
  const executableFilePath = path.resolve(`${__dirname}/deploy/${name}.js`);
  const child = spawn(
    'npx',
    ['aws-cdk', 'deploy', '--app', executableFilePath],
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

export default async <Command>(args: string[]) => {
  console.log('Deploying backend');

  // Get the desired stack name
  const stack = args[0];

  if (stack === undefined) {
    // Deploy both stacks? Should ask for confirmation first
    console.log('build frontend && backend');
    console.log('deploy frontend && backend');
    // deploy('frontend');
    // deploy('backend');
  } else if (stack.match(/front/)) {
    console.log('build frontend');
    console.log('deploy frontend');
    // deploy('frontend');
  } else if (stack.match(/back/)) {
    console.log('build backend');
    console.log('deploy backend');
    deploy('backend');
  } else {
    console.log(`Did not recognize stack ${stack}`);
  }
};
