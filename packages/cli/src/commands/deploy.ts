import { Command } from '@rebel/core';
import path from 'path';
import frontend from './deploy/frontend';
import backend from './deploy/backend';

export default async <Command>(args: string[]) => {
  // Get the desired stack name
  const stack = args[0];

  if (stack === undefined) {
    console.log('build frontend && backend');
    console.log('deploy frontend && backend');
    return;
  }

  // npx aws-cdk

  // Get the current working directory
  const currentDirectory = process.cwd();

  // Optionally, you can resolve the absolute path if needed.
  const absolutePath = path.resolve(currentDirectory);

  // const fileToImportAsJavascript = `${absolutePath}/bin/backend/index.js`;
  const routesFilePath = path.resolve(`${absolutePath}/bin/backend/routes.js`);

  console.log('Current directory:', currentDirectory);
  console.log('Absolute path:', absolutePath);
  console.log('Routes path:', routesFilePath);

  try {
    const projectRoutesModule = require(routesFilePath);
    const router = projectRoutesModule.default;

    if (!router.routes) {
      throw new Error(`No routes were found for this project.`);
    }

    console.log(router);
  } catch (err) {
    console.error('Error while importing/running the file:', err);
  }

  console.log('Current directory:', currentDirectory);
  console.log('Absolute path:', absolutePath);

  if (stack.match(/front/)) {
    console.log({ frontend });
    console.log('build frontend');
    console.log('deploy frontend');
  } else if (stack.match(/back/)) {
    console.log({ backend });
    console.log('build frontend');
    console.log('deploy frontend');
  } else {
    console.log(`Did not recognize stack ${stack}`);
  }
};
