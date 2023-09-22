import { success, fail } from '@rebel-framework/terminal';
import { exec } from 'child_process';
import fs from 'fs';
import { join } from 'path';
import { Signature } from '../types';
import isDirectoryEmpty from '../helpers/is-directory-empty';

export const signature: Signature = {
  arguments: {
    directory: {
      type: 'string',
      default: './',
    },
  },
};

async function init({ directory }) {
  directory = directory || signature.arguments.directory.default;

  const empty = await isDirectoryEmpty(directory, true);

  if (!empty) {
    return fail('Directory is not empty');
  }

  const commands = [
    `npx rebel mkdir -r "${directory}"`,
    `npx degit https://github.com/rebel-framework/skeleton.git "${directory}" --force`,
    `git init "${directory}"`,
    `npx rebel mkdir -r "${join(directory, '.rebel')}"`,
  ];

  for (let command of commands) {
    await exec(command);
  }

  return success('Rebel was successfully installed.');
}

export default {
  signature,
  command: init,
};
