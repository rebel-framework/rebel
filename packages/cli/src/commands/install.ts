import { Command } from "../types";
import { join } from "path";
import { promises as fs } from "fs";
import { exec } from "child_process";
import { resolve } from "path";

// OPPORTUNITY: Move this function to @rebel/core
async function isDirectoryEmpty(dirPath: string): Promise<boolean> {
  try {
    const files = await fs.readdir(dirPath);
    return files.length === 0;
  } catch (error) {
    // Handle error (directory doesn't exist, or there was a problem reading it)
    return false;
  }
}

export const install: Command = async (args: string[]) => {
  const currentDir = process.cwd();
  const isEmpty = await isDirectoryEmpty(currentDir);

  if (!isEmpty) {
    return console.warn(
      "Cannot install Rebel because the current directory is not empty."
    );
  }

  // Clone the 'rebeljs/skeleton' repository
  const gitCloneCommand = `git clone https://github.com/rebeljs/skeleton.git .`;

  // Execute the git clone command
  try {
    await exec(gitCloneCommand);
  } catch (error) {
    console.error("Error cloning repository:", error.message);
  }

  console.log("Rebel was successfully installed.");
};
