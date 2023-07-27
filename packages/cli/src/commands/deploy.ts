import { Command } from '@rebel/core';
import path from 'path';

export default async <Command>(args: string[]) => {
  // Get the desired stack name
  const stack = args[0];

  // Get the current working directory
  const currentDirectory = process.cwd();

  // Optionally, you can resolve the absolute path if needed.
  const absolutePath = path.resolve(currentDirectory);

  // const fileToImportAsJavascript = `${absolutePath}/bin/backend/index.js`;

  const routesFilePath = path.resolve(`${absolutePath}/bin/backend/routes.js`);

  console.log(`routesFilePath: ${routesFilePath}`);

  try {
    const routes = require(routesFilePath);

    console.log(routes);
    // Assuming index.js exports a function named "main", you can call it like this:
    // importedModule.main();
  } catch (err) {
    console.error('Error while importing/running the file:', err);
  }

  console.log('Current directory:', currentDirectory);
  console.log('Absolute path:', absolutePath);

  if (stack === undefined) {
    console.log('build frontend && backend');
    console.log('deploy frontend && backend');
  }

  if (stack.match(/front/)) {
    console.log('build frontend');
    console.log('deploy frontend');
  } else if (stack.match(/back/)) {
    console.log('build frontend');
    console.log('deploy frontend');
  } else {
    console.log(`Did not recognize stack ${stack}`);
  }
};
