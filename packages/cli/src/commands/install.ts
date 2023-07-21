import { Command } from "../types";
import { join } from "path";
import { promises as fs } from "fs";

export const install: Command = async (args: string[]) => {
  const currentDir = process.cwd();
  const rebelDir = join(currentDir, ".rebel");

  console.log({ cwd: process.cwd() });

  return;

  try {
    if (args.includes("--force")) {
      await fs.rmdir(rebelDir);
    }
  } catch (error) {
    console.warn("Rebel was not installed here before.");
  }

  try {
    await fs.access(rebelDir);
    console.log("Rebel is already installed.");
  } catch (error) {
    // Create a .rebel directory if it doesn't already exist
    await fs.mkdir(rebelDir);

    const scaffoldDir = join(currentDir, "node_modules", "@rebel", "scaffold");
    const files = await fs.readdir(scaffoldDir);

    console.log(files);

    return;

    // Copy all files from @rebel/scaffold to .rebel
    for (const file of files) {
      const origin = join(scaffoldDir, file);
      const destination = join(rebelDir, file);
      await fs.copyFile(origin, destination);
    }

    console.log("Rebel was successfully installed.");
  }
};
