import {
  ask,
  choice,
  confirm,
  line,
  success,
  fail,
  bold,
} from '@rebel-framework/terminal';
import { exec } from 'child_process';
import { join } from 'path';
import readPackageJson from '../helpers/read-package-json';
import { Signature } from '../types';

export const signature: Signature = {
  options: {
    directory: {
      type: 'string',
      name: '--directory',
      short: '-D',
      default: './',
    },
  },
};

const state = {
  existingProject: true,
  monorepo: false,
  packageData: undefined,
};

async function init({ directory }) {
  directory = directory || signature.options.directory.default;

  try {
    state.packageData = readPackageJson(directory);
  } catch (error) {
    state.existingProject = false;
  }

  if (state.packageData) {
    state.monorepo = state.packageData.workspaces !== undefined;
  }

  if (
    state.existingProject &&
    (await confirm(
      'This is an existing project and changes will be made to the codebase. Are you sure?',
      false
    ))
  ) {
    console.log('Existing project and OK');
    if (state.packageData && state.packageData.workspaces) {
      const location = await ask(
        'Should we create a stack for each workspace?',
        state.packageData.workspaces
      );

      console.log({ location });
    }
  } else {
    console.log('New project');
  }

  console.log({ state });

  process.exit();

  // const commands = [
  //   `mkdir "${directory}"`,
  //   `npx degit https://github.com/rebel-framework/skeleton.git "${directory}" --force`,
  //   `git init "${directory}"`,
  //   `mkdir "${join(directory, '.rebel')}"`,
  // ];

  // for (let command of commands) {
  //   await exec(command);
  // }

  // console.log('Rebel was successfully installed.');
}

export default {
  signature,
  command: init,
};
