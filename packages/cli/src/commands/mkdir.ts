import { success, fail } from '@rebel-framework/terminal';
import fs from 'fs';
import { Signature } from '../types';

export const signature: Signature = {
  arguments: {
    directory: {
      type: 'string',
    },
  },
  options: {
    recursive: {
      type: 'flag',
      name: '--recursive',
      short: '-r',
    },
  },
};

async function mkdir({ directory, recursive }) {
  if (!directory) {
    return fail('Please provide a directory');
  }

  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive });
    } else {
      return fail('Directory already exists');
    }
  } catch (error) {
    return fail(`Could not create directory: ${error.message}`);
  }

  return success('Directory was successfully created');
}

export default {
  signature,
  command: mkdir,
};
