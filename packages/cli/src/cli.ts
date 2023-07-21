#!/usr/bin/env node
import { ai } from "./commands/ai";
import { generate } from "./commands/generate";
// import { build } from "./commands/build";
// import { deploy } from "./commands/deploy";
import { install } from "./commands/install";
// import { init } from "./commands/init";
// import { test } from "./commands/test";

interface CommandFunction {
  (args: string[]): void;
}

// Map the commands to their corresponding functions
const commandMap: { [key: string]: CommandFunction } = {
  ai: ai,
  //   init: init,
  install: install,
  //   build: build,
  //   test: test,
  //   deploy: deploy,
  generate: generate,
};

const args = process.argv.slice(2);
const command = args[0];

// Remove the command from the arguments
args.shift();

if (command in commandMap) {
  commandMap[command](args);
} else {
  console.log(`Unknown command: ${command}`);
  console.log(
    "Available commands: init, install, build, test, deploy, generate"
  );
}
