import { exec } from 'child_process';
import { join } from 'path';

export default async function init(args: string[]) {
  const [directory] = args;

  const commands = [
    `mkdir "${directory}"`,
    `npx degit https://github.com/rebel-framework/skeleton.git "${directory}" --force`,
    `git init "${directory}"`,
    `mkdir "${join(directory, '.rebel')}"`,
  ];

  for (let command of commands) {
    await exec(command);
  }

  console.log('Rebel was successfully installed.');
}
