#!/usr/bin/env node

import * as commands from './commands';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(`No command specified. TODO: List available commands`);
    process.exit();
  }

  args.shift(); // Remove the command name from the arguments

  const stackFlagIndex = args.findIndex(
    (arg) => arg === '--stack' || arg === '-s'
  );

  let currentStack: string | null = null;

  // Check if a stack flag was provided
  if (stackFlagIndex !== -1 && args[stackFlagIndex + 1]) {
    currentStack = args[stackFlagIndex + 1];
    args.splice(stackFlagIndex, 2); // Remove the flag and its value from args
  }

  if (!commands[command]) {
    console.log(`Unknown command: ${command}`);
    console.log(
      'Available commands: init, install, build, test, deploy, generate'
    );
  } else {
    await commands[command]([...args, { stack: currentStack }]);
  }
}

main();
