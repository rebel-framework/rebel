import path from 'path';

export default async <Command>(args: string[]) => {
  // Get the desired command name
  const commandName = args[0];

  // Arguments to pass to the command
  const commandArgs = args.slice(0);

  if (commandName === undefined) {
    console.error('You need to specify a command');
    return;
  }

  // Get the current working directory
  const currentDirectory = process.cwd();

  // Optionally, you can resolve the absolute path if needed.
  const absolutePath = path.resolve(currentDirectory);

  // const fileToImportAsJavascript = `${absolutePath}/bin/backend/index.js`;
  const commandFilePath = path.resolve(`${absolutePath}/bin/backend/commands`);

  console.log('Current directory:', currentDirectory);
  console.log('Absolute path:', absolutePath);
  console.log('Commands path:', commandFilePath);

  try {
    const projectRoutesModule = require(`${commandFilePath}/${commandName}`);
    const command = projectRoutesModule.default;
    await command(commandArgs);
  } catch (err) {
    console.error('Error while importing/running the file:', err);
  }
};
