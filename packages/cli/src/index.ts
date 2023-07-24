#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

import { ai } from './commands/ai';
import { generate } from './commands/generate';
// import { build } from "./commands/build";
// import { deploy } from "./commands/deploy";
import { install } from './commands/install';
// import { test } from "./commands/test";

interface CommandFunction {
  (args: string[]): void;
}

// Map the commands to their corresponding functions
const commandMap: { [key: string]: CommandFunction } = {
  ai: ai,
  install: install,
  //   build: build,
  //   test: test,
  //   deploy: deploy,
  generate: generate,
};

console.log({ __dirname });

const directoryPath = path.join('.', './backend/commands');
const commandFiles = fs.readdirSync(directoryPath);
commandFiles.forEach((file) => {
  const fullPath = path.join(directoryPath, file);

  // Check if it's a file
  if (fs.lstatSync(fullPath).isFile()) {
    // Import or require the file
    const module = require(fullPath);

    console.log({ module });

    // Use the module (call function, access properties, etc.)
    // ...
  }
});
console.log({ commandFiles });

const args = process.argv.slice(2);
const command = args[0];

// Remove the command from the arguments
args.shift();

if (command in commandMap) {
  commandMap[command](args);
} else {
  console.log(`Unknown command: ${command}`);
  console.log(
    'Available commands: init, install, build, test, deploy, generate'
  );
}
