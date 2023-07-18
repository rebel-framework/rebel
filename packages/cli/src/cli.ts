#!/usr/bin/env node
import * as install from "./commands/install";
import * as generate from "./commands/generate";

// Get all command line arguments except the first two (node executable and file path)
const args = process.argv.slice(2);

// Get the command (the first argument)
const command = args[0];

// Get any options (all remaining arguments)
const options = args.slice(1);

console.log(args, command, options);

// Use a switch statement to route the command to the appropriate function
// switch (command) {
//   case "install":
//     install.run(options);
//     break;
//   case "generate":
//     generate.run(options);
//     break;
//   default:
//     console.error(`Unknown command: ${command}`);
//     process.exit(1);
// }
