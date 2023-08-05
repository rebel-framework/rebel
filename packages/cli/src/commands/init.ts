import { exec } from 'child_process';

export default async function init(args: string[]) {
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
}
