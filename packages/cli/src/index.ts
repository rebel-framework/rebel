#!/usr/bin/env node

import { registerEnvironmentVariables } from '@rebel-framework/core';
import * as commands from './commands';

registerEnvironmentVariables();

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Remove the command name from the arguments
  args.shift();

  if (!commands[command]) {
    console.log(`Unknown command: ${command}`);
    console.log(
      'Available commands: init, install, build, test, deploy, generate'
    );
  } else {
    await commands[command](args);
  }
}

main();
