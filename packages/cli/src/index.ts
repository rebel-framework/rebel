#!/usr/bin/env node

import * as commands from './commands';
import parseArguments from './helpers/parse-arguments';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(`No command specified. TODO: List available commands`);
    process.exit();
  }

  args.shift(); // Remove the command name from the arguments

  if (!commands[command]) {
    console.log(`Unknown command: ${command}`);
    console.log(
      'Available commands: init, install, build, test, deploy, generate'
    );
  } else {
    const signature = commands[command].signature || {};
    const parsedArgs = parseArguments(args, signature);
    await commands[command].command(parsedArgs);
  }
}

main();
