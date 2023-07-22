#!/usr/bin/env node

import { wait } from '@rebel/core';
import { promises as fs } from 'fs';
import { join } from 'path';

interface CommandFunction {
  (args: string[]): void;
}

const commandMap: { [key: string]: CommandFunction } = {};

const loadCommands = async () => {
  const commandsDir = join(__dirname, 'commands');

  try {
    const files = await fs.readdir(commandsDir);

    for (const file of files) {
      const commandName = file.replace('.ts', '');
      const commandModule = await import(`./commands/${file}`);
      commandMap[commandName] = commandModule.default;
    }
  } catch (error) {
    console.error('Error loading commands:', error);
  }
};

const commands = wait(loadCommands);
console.log(commands);

const runCommand = async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  // Remove the command from the arguments
  args.shift();

  if (!command || !(command in commandMap)) {
    console.log('Unknown command:', command);
    console.log('Available commands:', Object.keys(commandMap).join(', '));
    return;
  }

  try {
    await loadCommands();
    commandMap[command](args);
  } catch (error) {
    console.error('Error running command:', error);
  }
};

wait(runCommand);
