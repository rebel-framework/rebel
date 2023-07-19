import { Command } from "../types";
import { join } from "path";
import { promises as fs } from "fs";

export const install: Command = async (args: string[]) => {
  // Create a .rebel directory if it doesn't already exist
  const currentDir = process.cwd();
  const rebelDir = join(currentDir, ".rebel");

  try {
    await fs.access(rebelDir);
    console.log("Rebel is already installed.");
  } catch (error) {
    await fs.mkdir(rebelDir);
    console.log("Rebel was successfully installed.");
  }
};
