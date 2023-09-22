import { success, fail } from '@rebel-framework/terminal';
import { exec } from 'child_process';
import { join } from 'path';
import { Signature } from '../types';
import isDirectoryEmpty from '../helpers/is-directory-empty';

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

async function init({ directory }) {
  directory = directory || signature.options.directory.default;

  const empty = await isDirectoryEmpty(directory, true);

  if (!empty) {
    fail('Directory is not empty');
  }

  const commands = [
    `mkdir "${directory}"`,
    `npx degit https://github.com/rebel-framework/skeleton.git "${directory}" --force`,
    `git init "${directory}"`,
    `mkdir "${join(directory, '.rebel')}"`,
  ];

  for (let command of commands) {
    await exec(command);
  }

  success('Rebel was successfully installed.');
}

export default {
  signature,
  command: init,
};
