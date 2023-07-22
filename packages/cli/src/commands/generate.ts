import { Command } from '@rebel/core';
import { join } from 'path';
import { promises as fs } from 'fs';

enum FileTypes {
  Controller = 'controller',
  Service = 'service',
  // add more file types here
}

// TODO: Instead of an inline string, use actual template files
const templates: { [key in FileTypes]: (name: string) => string } = {
  [FileTypes.Controller]: (name) => `export class ${name}Controller {}`,
  [FileTypes.Service]: (name) => `export class ${name}Service {}`,
  // add more templates here
};

export const generate: Command = async (args: string[]) => {
  // Check that we're in a project directory
  const currentDir = process.cwd();
  try {
    await fs.access(join(currentDir, '.rebel'));
  } catch (error) {
    console.error('This command must be run in a Rebel project directory.');
    process.exit(1);
  }

  // Parse the args
  const type = args[0] as FileTypes;
  const file = args[1];

  if (!file) {
    throw new Error('File name is missing');
  }

  if (!Object.values(FileTypes).includes(type)) {
    throw new Error(
      `Invalid file type '${type}'. Valid file types are: ${Object.values(
        FileTypes
      ).join(', ')}`
    );
  }

  // Define your directory structure here
  const directories: { [key in FileTypes]: string } = {
    [FileTypes.Controller]: './src/controllers',
    [FileTypes.Service]: './src/services',
    // add more directories here
  };

  const directoryPath = directories[type];
  const filePath = join(directoryPath, `${file}.ts`);

  // Create the file with a template
  const fileContent = templates[type](file);

  try {
    await fs.mkdir(directoryPath, { recursive: true });
    await fs.writeFile(filePath, fileContent);
    console.log(`Created ${type} ${file} at ${filePath}`);
  } catch (error) {
    console.error(`Error creating ${type} ${file}:`, error);
  }
};
