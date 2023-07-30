import { Command } from '@rebel/core';
import { exec } from 'child_process';

const init: Command = async (args: string[]) => {
  const [directory] = args;

  const commands = [
    `mkdir ${directory}`,
    `npx degit https://github.com/rebeljs/skeleton.git ${directory} --force`,
    `git init ${directory}`,
    `mkdir ${directory}/.rebel`,
  ];

  for (let command of commands) {
    await exec(command);
  }

  console.log('Rebel was successfully installed.');
};

export default init;
