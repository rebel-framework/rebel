import { Command } from '@rebel/core';
import { promises as fs } from 'fs';
import { exec } from 'child_process';

// OPPORTUNITY: Move this function to @rebel/core
async function isDirectoryEmpty(dirPath: string): Promise<boolean> {
  try {
    const files = await fs.readdir(dirPath);
    return files.length === 0;
  } catch (error) {
    // Handle error (directory doesn't exist, or there was a problem reading it)
    return false;
  }
}

const init: Command = async (args: string[]) => {
  const currentDir = process.cwd();
  const isEmpty = await isDirectoryEmpty(currentDir);
  const [name] = args;

  if (!name) {
    return console.warn(`Missing argument 'name'`);
  }

  await exec(`mkdir ${name}`);

  if (!isEmpty) {
    return console.warn(
      'Cannot install Rebel because the current directory is not empty.'
    );
  }

  try {
    await exec(`npx degit https://github.com/rebeljs/skeleton.git ${name}`);
  } catch (error) {
    console.error('Error cloning repository:', error.message);
  }

  // TODO: git init
  // TODO: run npm install

  console.log('Rebel was successfully installed.');
};

export default init;
